from bs4 import BeautifulSoup
from selenium import webdriver
import sys
import re


def get_product_id(url):
    search = re.search(r"[A-Z0-9]{10}", url)
    return search.group(0) if search is not None else None


def get_source(url):
    source = None

    try:
        options = webdriver.FirefoxOptions()
        options.add_argument("--headless")
        browser = webdriver.Firefox(options=options)
        browser.get(url)
        source = browser.page_source
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
    if product_id is not None:
        review_url = f"https://www.amazon.com/product-reviews/{product_id}"
        source = get_source(review_url)
        
        soup = BeautifulSoup(source, "lxml")
        reviews = get_reviews(soup)
        output = {"status": "success", "reviews": reviews}
    else:
        output = {"status": "failure", "reviews": []}
    print(output)


if __name__ == "__main__":
    main()
