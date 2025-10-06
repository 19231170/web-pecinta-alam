import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Coba akses rute yang dilindungi dan harapkan pengalihan ke halaman login
    print("Mencoba mengakses rute yang dilindungi...")
    page.goto("http://localhost:3000/admin/dashboard")
    expect(page).to_have_url(re.compile(".*auth/login"))
    print("Berhasil dialihkan ke halaman login.")

    # 2. Masuk sebagai admin
    print("Mencoba masuk sebagai admin...")
    page.get_by_label("Email").fill("admin@mapala.ac.id")
    page.get_by_label("Password").fill("admin123")
    page.get_by_role("button", name="Masuk").click()

    # 3. Verifikasi login berhasil dan nama pengguna muncul
    # Setelah login, pengguna harus diarahkan ke dasbor anggota secara default
    expect(page).to_have_url(re.compile(".*anggota/dashboard"))
    print("Berhasil masuk dan dialihkan ke dasbor.")

    # Verifikasi bahwa nama pengguna admin ada di navbar
    navbar_user = page.get_by_role("button", name=re.compile("Budi Santoso"))
    expect(navbar_user).to_be_visible()
    print("Nama pengguna admin terlihat di navbar.")

    # Tampilkan menu pengguna untuk menemukan tombol logout
    navbar_user.click()

    # 4. Keluar dari aplikasi
    print("Mencoba keluar...")
    logout_button = page.get_by_role("button", name="Logout")
    expect(logout_button).to_be_visible()
    logout_button.click()

    # 5. Verifikasi bahwa pengguna berhasil keluar dan kembali ke halaman login
    expect(page).to_have_url(re.compile(".*auth/login"))
    print("Berhasil keluar dan kembali ke halaman login.")

    # Ambil screenshot dari hasil akhir (halaman login setelah logout)
    page.screenshot(path="jules-scratch/verification/auth_flow_verification.png")
    print("Screenshot berhasil diambil.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)