from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8000/index.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Capture console messages
    def on_console(msg):
        try:
            print(f"console.{msg.type}: {msg.text}")
        except Exception as e:
            print("console: (failed to print):", e)

    page.on("console", on_console)

    # Log failed requests and responses for diagnostics
    def on_request_failed(request):
        print(f"requestfailed: {request.url} -> {request.failure}")
    page.on("requestfailed", on_request_failed)

    def on_response(response):
        if response.status >= 400:
            try:
                print(f"response {response.status}: {response.url}")
                try:
                    body = response.text()
                    print("response body:", body)
                except Exception as e:
                    print("response body: (failed to read)", e)
            except Exception:
                print("response: (failed to print)")
    page.on("response", on_response)

    # Capture page errors
    def on_page_error(err):
        print("pageerror:", err)
    page.on("pageerror", on_page_error)

    # Navigate and wait a short while for scripts to run
    print(f"Loading: {URL}")
    page.goto(URL, timeout=30000)
    page.wait_for_timeout(4000)

    print("-- Done capturing console output --")

    browser.close()
