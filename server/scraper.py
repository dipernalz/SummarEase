#!/bin/python3

from bs4 import BeautifulSoup
import json
import openai
import re
from selenium import webdriver
import sys


openai.api_key = "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"


review_url = f"https://www.amazon.com/product-reviews"
review_types = ["positive", "critical"]


def get_product_id(url):
    search = re.search(r"[A-Z0-9]{10}", url)
    return search.group(0) if search is not None else None


def get_source(urls):
    source = []

    try:
        options = webdriver.FirefoxOptions()
        options.add_argument("--headless")
        browser = webdriver.Firefox(options=options)
        for url in urls:
            browser.get(url)
            source.append(browser.page_source)
    finally:
        try:
            browser.close()
        except:
            pass

    return source


def get_reviews(soup):
    return [
        item.contents[1].text
        for item in filter(
            lambda i: i.attrs.get("data-hook", "") == "review-body",
            soup.find_all("span"),
        ) if len(item) == 3
    ]


def get_title(soup):
    return list(filter(
        lambda i: i.attrs.get("data-hook", "") == "product-link",
        soup.find_all("a"),
    ))[0].text


def get_image(soup):
    return list(filter(
        lambda i: i.attrs.get("data-hook", "") == "cr-product-image",
        soup.find_all("img"),
    ))[0].attrs["src"]


def get_chatgpt_output(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    response_message = response['choices'][0]['message']['content']
    return response_message


def main():
    url = sys.argv[1]
    product_id = get_product_id(url)
    output = {"pros": [], "cons": [], "title": "", "image": ""}
    if product_id is not None:
        sources = get_source([
            f"{review_url}/{product_id}?filterByStar={review_type}"
            for review_type in review_types
        ])
        reviews = []
        for source in sources:
            soup = BeautifulSoup(source, "lxml")
            reviews += get_reviews(soup)
            output["title"] = get_title(soup)
            output["image"] = get_image(soup)
        reviews.sort(key=lambda x: len(x))
        prompt = "Pros and cons of the product from this review:\n\n"
        i = 0
        while i < len(reviews) and len(prompt) + len(reviews[i]) < 4000:
            prompt += reviews[i]
            i += 1
        results = list(map(
            lambda x: list(map(lambda y: y[2:].strip(), x.split("\n")[1:])),
            get_chatgpt_output(prompt).split("\n\n"),
        ))
        output["pros"] = results[0]
        output["cons"] = results[1]
        output["status"] = "success"
    else:
        output["status"] = "failure"
    print(json.dumps(output))
    

if __name__ == "__main__":
    main()
