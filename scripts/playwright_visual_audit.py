#!/usr/bin/env python3
"""
Auditoria visual e funcional via Playwright em dual-viewport (1440x900 Desktop e 390x844 Mobile).
Captura screenshots reais em docs/screenshots/ e valida:
- Zero erros de console e zero excecoes de pagina
- Zero overflow horizontal em desktop e mobile
- Presenca real dos paineis interativos e rota /apresentacao
"""

import os
import subprocess
import sys
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
    port = 3194
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
        print("[AUDIT] Servidor Next.js ativo para auditoria Playwright.")

        console_errors: list[str] = []
        page_errors: list[str] = []

        with sync_playwright() as p:
            try:
                browser = p.firefox.launch(headless=True)
            except Exception:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--disable-gpu", "--disable-software-rasterizer", "--no-sandbox"],
                )

            # 1. Desktop 1440x900
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: page_errors.append(str(err)))

            page.goto(base_url, wait_until="networkidle")
            page.wait_for_timeout(1200)

            overflow_desktop = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            if overflow_desktop:
                raise AssertionError("Overflow horizontal detectado no viewport Desktop 1440x900.")

            page.screenshot(path=str(SCREENSHOT_DIR / "01_desktop_hero_edag.png"))

            # Navegar por todas as abas e capturar o workspace em foco completo
            tabs = [
                ("01. Cartografia E-DAG", "01b_desktop_edag_workspace.png"),
                ("02. Inquisidor Socratico", "02_desktop_socratic_inquisitor.png"),
                ("03. Gemeo BKT & Brier", "03_desktop_cognitive_twin.png"),
                ("04. Prova Isomorfica", "04_desktop_isomorphic_exam.png"),
                ("05. Protagonismo Docente", "05_desktop_faculty_console.png"),
                ("06. Edital & Banca", "06_desktop_edital_dossier.png"),
            ]
            for label, filename in tabs:
                btn = page.get_by_role("button", name=label)
                btn.click()
                page.locator("#workspace").scroll_into_view_if_needed()
                page.wait_for_timeout(700)
                page.screenshot(path=str(SCREENSHOT_DIR / filename))

            # Rota de Apresentacao 15 min
            page.goto(f"{base_url}/apresentacao", wait_until="networkidle")
            page.wait_for_timeout(800)
            page.screenshot(path=str(SCREENSHOT_DIR / "07_desktop_presentation_15min.png"))

            # 2. Mobile 390x844
            page.set_viewport_size({"width": 390, "height": 844})
            page.goto(base_url, wait_until="networkidle")
            page.wait_for_timeout(1000)
            overflow_mobile = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            if overflow_mobile:
                raise AssertionError("Overflow horizontal detectado no viewport Mobile 390x844.")
            page.screenshot(path=str(SCREENSHOT_DIR / "08_mobile_390x844.png"))

            browser.close()

        if console_errors or page_errors:
            raise AssertionError(
                f"Erros detectados no runtime: console={console_errors}, page={page_errors}"
            )

        print(f"[AUDIT OK] 8 screenshots salvos em {SCREENSHOT_DIR}; 0 erros console; 0 overflow.")
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()


if __name__ == "__main__":
    main()
