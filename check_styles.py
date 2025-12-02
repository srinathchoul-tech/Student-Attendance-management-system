from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8000/index.html"
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(URL)
    header_bg = page.evaluate("() => getComputedStyle(document.querySelector('header')).backgroundColor")
    header_pos = page.evaluate("() => getComputedStyle(document.querySelector('header')).position")
    nav_color = page.evaluate("() => getComputedStyle(document.querySelector('nav a')).color")
    card_bg = page.evaluate("() => getComputedStyle(document.querySelector('.card')).backgroundColor")
    print('header.backgroundColor =', header_bg)
    print('header.position =', header_pos)
    print('nav.link.color =', nav_color)
    print('.card.backgroundColor =', card_bg)
    browser.close()