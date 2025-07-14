from playwright.sync_api import sync_playwright
import pandas as pd

FILENAME = "barttorvik_team_tables_each.csv"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto("https://barttorvik.com/team-tables_each.php", timeout=60000)

    page.wait_for_selector("table")

    html = page.content()

    tables = pd.read_html(html)
    df = tables[0]

    df.to_csv(FILENAME, index=False)
    print(f"✅ Saved to {FILENAME}")

    browser.close()
