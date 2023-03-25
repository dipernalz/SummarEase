from bs4 import BeautifulSoup
from selenium import webdriver
import sys
import re


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
        )
    ]


def main():
    url = sys.argv[1]
    product_id = get_product_id(url)
    output = {"reviews": {}}
    if product_id is not None:
        sources = get_source([
            f"{review_url}/{product_id}?filterByStar={review_type}"
            for review_type in review_types
        ])
        for i, review_type in enumerate(review_types):
            output["reviews"][review_type] = get_reviews(
                BeautifulSoup(sources[i], "lxml"),
            )
        output["status"] = "success"
    else:
        output["status"] = "failure"
    print(output)


if __name__ == "__main__":
    main()
