import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Pergi ke halaman utama
    page.goto("http://localhost:3000")

    # Temukan heading untuk bagian peta
    map_heading = page.get_by_role("heading", name="Temukan Lokasi Kami")

    # Gulir ke heading agar terlihat
    map_heading.scroll_into_view_if_needed()

    # Tunggu hingga heading terlihat
    expect(map_heading).to_be_visible()

    # Temukan kontainer peta
    # Peta Leaflet berada di dalam kontainer dengan kelas 'leaflet-container'
    map_container = page.locator(".leaflet-container")

    # Verifikasi bahwa peta terlihat
    expect(map_container).to_be_visible()

    # Ambil screenshot dari seluruh halaman
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)