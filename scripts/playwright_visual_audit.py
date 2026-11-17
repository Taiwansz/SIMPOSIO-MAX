#!/usr/bin/env python3
"""
Auditoria visual dual-viewport (1440x900 Desktop e 390x844 Mobile) para VERITAS.
Verifica zero erros de console, zero overflow horizontal e captura todas as telas.
"""

import os
import subprocess
import time
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).resolve().parent.parent
SCREENSHOT_DIR = REPO_ROOT / "docs" / "screenshots"
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)


def wait_for_server(url: str, timeout: float = 35.0) -> None:
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                if r.status == 200:
                    return
        except Exception:
            time.sleep(0.5)
    raise RuntimeError(f"Servidor nao respondeu em {url}")


def main() -> None:
    port = 3198
    base_url = f"http://127.0.0.1:{port}"
    env = os.environ.copy()
    env["PORT"] = str(port)

    proc = subprocess.Popen(
        ["npx", "next", "start", "-p", str(port), "-H", "127.0.0.1"],
        cwd=str(REPO_ROOT),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    try:
        wait_for_server(base_url)
        console_errors: list[str] = []
        page_errors: list[str] = []

        with sync_playwright() as p:
            try:
                browser = p.firefox.launch(headless=True)
            except Exception:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--disable-gpu", "--no-sandbox"],
                )

            # Desktop 1440x900
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: page_errors.append(str(err)))

            page.goto(base_url, wait_until="networkidle")
            page.wait_for_timeout(1000)
            if page.evaluate("document.documentElement.scrollWidth > window.innerWidth"):
                raise AssertionError("Overflow horizontal detectado no Desktop 1440x900.")
            page.screenshot(path=str(SCREENSHOT_DIR / "01_desktop_home.png"))

            desktop_nav = page.locator("nav[aria-label='Navegacao principal']")

            # 1. Estudos (Dock)
            desktop_nav.get_by_role("button", name="Estudos").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "02b_desktop_notebook.png"))

            # 2. Turmas (Dock)
            desktop_nav.get_by_role("button", name="Turmas").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "09_desktop_classes.png"))

            # 3. Raio-X da IA (via Menu Mais)
            desktop_nav.get_by_role("button", name="Mais ferramentas").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Raio-X da IA").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "02_desktop_autopsy.png"))

            # 4. Teste de Autoria (via Menu Mais)
            desktop_nav.get_by_role("button", name="Mais ferramentas").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Teste de 60s").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "03_desktop_mutation.png"))

            # 5. Arena ao Vivo (via Menu Mais)
            desktop_nav.get_by_role("button", name="Mais ferramentas").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Arena da Sala").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "04_desktop_arena.png"))

            # 6. Resultados (via Menu Mais)
            desktop_nav.get_by_role("button", name="Mais ferramentas").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Resultados & Banca").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "05_desktop_faculty.png"))

            # 7. Perfil (via Menu do Usuario Topbar)
            page.get_by_role("button", name="Abrir menu da conta").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Meu Perfil").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "10_desktop_profile.png"))

            # 8. Ajustes (via Menu do Usuario Topbar)
            page.get_by_role("button", name="Abrir menu da conta").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Configurações").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "11_desktop_settings.png"))

            page.goto(f"{base_url}/apresentacao", wait_until="networkidle")
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "06_desktop_presentation.png"))

            # Mobile 390x844
            page.set_viewport_size({"width": 390, "height": 844})
            page.goto(base_url, wait_until="networkidle")
            page.wait_for_timeout(900)
            if page.evaluate("document.documentElement.scrollWidth > window.innerWidth"):
                raise AssertionError("Overflow horizontal detectado no Mobile 390x844.")
            page.screenshot(path=str(SCREENSHOT_DIR / "07_mobile_home.png"))

            mobile_nav = page.locator("nav[aria-label='Navegacao mobile']")
            # Turmas mobile
            mobile_nav.get_by_role("button", name="Turmas").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "12_mobile_classes.png"))

            # Arena mobile (via Mais)
            mobile_nav.get_by_role("button", name="Mais opcoes").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Arena da Sala").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "08_mobile_arena.png"))

            # Ajustes mobile (via Avatar)
            page.get_by_role("button", name="Abrir menu da conta").click()
            page.wait_for_timeout(400)
            page.get_by_role("button", name="Configurações").click()
            page.wait_for_timeout(700)
            page.screenshot(path=str(SCREENSHOT_DIR / "13_mobile_settings.png"))

            browser.close()

        if console_errors or page_errors:
            raise AssertionError(f"Erros detectados: console={console_errors}, page={page_errors}")

        print(f"[AUDIT OK] Screenshots VERITAS salvos em {SCREENSHOT_DIR}; 0 erros; 0 overflow.")
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()


if __name__ == "__main__":
    main()
