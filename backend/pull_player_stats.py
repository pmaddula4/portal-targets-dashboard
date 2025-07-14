from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import time

# Setup Chrome options
options = Options()
options.add_argument("--headless=new")
driver = webdriver.Chrome(service=Service(), options=options)

# Load the site
url = "https://barttorvik.com/playerstat.php?link=y&xvalue=trans&year=2025&minmin=0&start=20241101&end=20250501&erk=1000"
driver.get(url)
wait = WebDriverWait(driver, 15)

# Disable filters
try:
    hide_filter = wait.until(EC.presence_of_element_located((By.ID, "hidefilter")))
    if not hide_filter.is_selected():
        hide_filter.click()
except:
    print("⚠️ Could not hide filters")

# Scroll to bottom
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
time.sleep(2)

# Click "Basic" if not already active
try:
    basic_toggle = wait.until(EC.presence_of_element_located((By.ID, "basic")))
    color = basic_toggle.value_of_css_property("color")

    if color.strip() != "rgb(0, 0, 0)":
        driver.execute_script("arguments[0].click();", basic_toggle)
        # Wait until the span turns black (active)
        WebDriverWait(driver, 10).until(
            lambda d: d.find_element(By.ID, "basic").value_of_css_property("color") == "rgb(0, 0, 0)"
        )
        # Wait for at least one cell in PTS column to appear
        wait.until(EC.presence_of_element_located((By.XPATH, "//td[contains(@class, 'pts')]")))
except Exception as e:
    print(f"⚠️ Could not activate Basic toggle: {e}")

# Wait a bit extra for JS updates to finish
time.sleep(1.5)

# Extract HTML
html = driver.page_source
driver.quit()

# Parse HTML
soup = BeautifulSoup(html, "html.parser")
table_div = soup.find("div", {"id": "tble"})

rows = []
for row in table_div.find_all("tr"):
    cols = [col.get_text(strip=True) for col in row.find_all(["td", "th"])]
    if cols:
        rows.append(cols)

# Separate header and data
headers = rows[0]
data = rows[1:]

# Save
df = pd.DataFrame(data)
df.to_csv("transfer_portal_all_stats_2025_full.csv", index=False, header=False)
print("✅ Scrape complete. Saved to transfer_portal_all_stats_2025_full.csv")
