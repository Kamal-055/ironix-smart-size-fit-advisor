"""End-to-end browser test (Playwright). Run: python3 tests/e2e.py   (from the prototype folder)
Needs: pip install playwright && playwright install chromium. Saves screenshots to ../docs/screenshots/prototype."""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
SHOTS = ROOT.parent / 'docs' / 'screenshots' / 'prototype'; SHOTS.mkdir(parents=True, exist_ok=True)
URL = (ROOT / 'index.html').as_uri()
results = []
def check(name, cond): results.append((name, bool(cond))); print(('PASS ' if cond else 'FAIL ') + name)

def fill(page, chest, height, fit=None):
    page.fill('#chest', chest); page.fill('#height', height)
    if fit: page.check(f'input[value={fit}]', force=True)
    page.click('button[type=submit].primary')

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={'width': 1366, 'height': 900})
    errors = []; page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None); page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(URL)
    page.screenshot(path=SHOTS / '01-desktop-initial.png')

    page.click('button[type=submit].primary')                      # 1 empty submit -> errors
    check('empty form shows chest, height errors', page.inner_text('#chestErr') and page.inner_text('#heightErr'))
    check('result stays hidden on invalid input', page.is_hidden('#result'))
    page.screenshot(path=SHOTS / '02-desktop-validation-errors.png')

    fill(page, 'abc', '69', 'snug'); check('non-numeric chest rejected', 'number' in page.inner_text('#chestErr'))
    fill(page, '10', '69', 'snug'); check('unrealistic chest rejected', 'between' in page.inner_text('#chestErr'))

    fill(page, '39', '69', 'regular')                              # 39+1=40 -> boundary M/L, regular picks L
    check('boundary case shows between sizes + alternative', 'Between sizes' in page.inner_text('#result') and page.locator('#result .secondary').count() == 1)
    check('chart highlights recommended row', page.locator('tr.hl').get_attribute('data-size') == 'L' and page.locator('tr.alt').get_attribute('data-size') == 'M')

    page.click('#result .primary')                                  # add L black (stock 8)
    check('add to cart updates count', page.inner_text('#cartCount') == '1')
    page.screenshot(path=SHOTS / '03-desktop-result-between-sizes.png')

    # sold-out recommended size with in-stock alternative (Black M is sold out)
    fill(page, '39.7', '69', 'snug')                                # e=39.7 -> M, near 40 boundary -> alt L
    check('sold-out size with alternative offered', 'sold out' in page.inner_text('#result .stock').lower() and 'L' in page.inner_text('#result .stock'))
    page.screenshot(path=SHOTS / '04-desktop-sold-out-alternative.png')

    # fully sold out colour -> notify form validation + success
    page.click('.swatch:has-text("Green")'); page.click('button[type=submit].primary')
    check('sold-out colour disables add button', page.locator('#result .primary').is_disabled())
    page.fill('.notify input', 'nope'); page.click('.notify button')
    check('invalid email rejected', 'valid email' in page.inner_text('#result'))
    page.fill('.notify input', 'kamala@example.com'); page.click('.notify button')
    check('valid email shows success', 'Done' in page.inner_text('#result'))
    page.screenshot(path=SHOTS / '05-desktop-notify-success.png')

    page.click('.swatch:has-text("Maroon")'); fill(page, '50', '69', 'snug')   # out of range
    check('out-of-range shows support CTA, no size', 'cannot size' in page.inner_text('#result') and page.locator('#result a[href^=mailto]').count() == 1)
    page.screenshot(path=SHOTS / '06-desktop-out-of-range.png')

    page.click('.chip[data-unit=cm]'); fill(page, '101.6', '175', 'snug')     # cm path = 40 in
    check('cm unit works', 'We recommend size' in page.inner_text('#result'))

    for _ in range(12): page.click('#result .primary') if page.locator('#result .primary').is_enabled() else None
    page.click('#cartBtn'); page.screenshot(path=SHOTS / '07-desktop-cart.png')
    check('stock cap prevents over-adding (Maroon L max 10)', page.locator('#cartList li').count() >= 1)
    page.keyboard.press('Escape'); check('Escape closes cart', page.is_hidden('#drawer'))

    m = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    m.on('pageerror', lambda e: errors.append(str(e))); m.goto(URL)
    check('no horizontal scroll on mobile', m.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
    m.screenshot(path=SHOTS / '08-mobile-initial.png', full_page=False)
    m.fill('#chest', '37.5'); m.fill('#height', '172'); m.check('input[value=snug]', force=True); m.click('button[type=submit].primary')
    m.screenshot(path=SHOTS / '09-mobile-result.png')
    check('no horizontal scroll after result', m.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
    check('no console/page errors', not errors)
    b.close()
bad = [n for n, ok in results if not ok]; print(f'\n{len(results)-len(bad)}/{len(results)} passed'); sys.exit(1 if bad else 0)
