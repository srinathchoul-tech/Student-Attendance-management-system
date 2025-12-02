from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8000/index.html"
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(URL)
    bg_img = page.evaluate("() => getComputedStyle(document.querySelector('.card.gradient-card')).backgroundImage")
    print('backgroundImage =', bg_img)
    browser.close()