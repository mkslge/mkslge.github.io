from selenium import webdriver

from selenium.webdriver.common.by import By;
from selenium.webdriver.common.keys import Keys;
import time

SLEEP_AMOUNT = 0.5

driver = webdriver.Chrome()
driver.get("http://127.0.0.1:8080")


def test_button(id: str):
    time.sleep(SLEEP_AMOUNT)
    button = driver.find_element(By.ID, id)
    button.click()
    time.sleep(SLEEP_AMOUNT)

def set_page(URL: str):
    driver.get(URL)


#Main page buttons
test_button("experience")
set_page("http://127.0.0.1:8080")
test_button("projects")
set_page("http://127.0.0.1:8080")
test_button("github")
test_button("linkedin")

#Projects page buttons
set_page("http://127.0.0.1:8080/projects.html")

test_button("main")
set_page("http://127.0.0.1:8080/projects.html")
test_button("experience")
set_page("http://127.0.0.1:8080/projects.html")

#project links

test_button("blackjack")
test_button("marchmadness")
test_button("scam")
test_button("snake")
test_button("maze")
test_button("shell")
test_button("interpreter")
test_button("garbage")

#footer pages
test_button("github")
test_button("linkedin")

#Experience Page
set_page("http://127.0.0.1:8080/experience.html")

test_button("main")
set_page("http://127.0.0.1:8080/projects.html")
test_button("projects")
set_page("http://127.0.0.1:8080/projects.html")

test_button("github")
test_button("linkedin")
