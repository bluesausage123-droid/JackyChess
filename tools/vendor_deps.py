"""Download all CDN dependencies into site/vendor/ for offline-first APK.

Runs once. Outputs:
  site/vendor/js/react.production.min.js
  site/vendor/js/react-dom.production.min.js
  site/vendor/js/tailwindcss.js
  site/vendor/css/noto-serif-tc.css       (URL-rewritten to local woff2)
  site/vendor/fonts/*.woff2

Babel-standalone is intentionally NOT vendored — JSX is pre-compiled at build
time so the runtime doesn't need it.
"""

from __future__ import annotations

import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENDOR = ROOT / "site" / "vendor"
JS = VENDOR / "js"
CSS = VENDOR / "css"
FONTS = VENDOR / "fonts"
for d in (JS, CSS, FONTS):
    d.mkdir(parents=True, exist_ok=True)

# Modern Chrome UA so Google Fonts serves woff2 (legacy UAs get TTF).
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)


def fetch(url: str, dest: Path, *, binary: bool = False) -> None:
    print(f"  {url}")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if binary:
        dest.write_bytes(data)
    else:
        dest.write_text(data.decode("utf-8"), encoding="utf-8")
    print(f"    → {dest.relative_to(ROOT)} ({len(data) // 1024} KB)")


def vendor_js() -> None:
    print("[js]")
    fetch(
        "https://unpkg.com/react@18/umd/react.production.min.js",
        JS / "react.production.min.js",
    )
    fetch(
        "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        JS / "react-dom.production.min.js",
    )
    fetch("https://cdn.tailwindcss.com", JS / "tailwindcss.js")


def vendor_fonts() -> None:
    print("[fonts] Noto Serif TC (400, 600, 900)")
    css_url = (
        "https://fonts.googleapis.com/css2"
        "?family=Noto+Serif+TC:wght@400;600;900&display=swap"
    )
    print(f"  {css_url}")
    req = urllib.request.Request(css_url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        css_text = r.read().decode("utf-8")

    # Pull every woff2 URL out of the @font-face src lines.
    urls = sorted(set(re.findall(r"url\((https://[^)]+\.woff2)\)", css_text)))
    print(f"  {len(urls)} woff2 files")

    rewrites: dict[str, str] = {}
    for u in urls:
        name = u.rsplit("/", 1)[-1]
        # Original Google Fonts URLs include a hash; keep it for cache busting.
        local = FONTS / name
        if not local.exists():
            fetch(u, local, binary=True)
        rewrites[u] = f"../fonts/{name}"

    for original, local in rewrites.items():
        css_text = css_text.replace(original, local)

    (CSS / "noto-serif-tc.css").write_text(css_text, encoding="utf-8")
    print(f"    → site/vendor/css/noto-serif-tc.css ({len(css_text) // 1024} KB)")


def main() -> None:
    vendor_js()
    vendor_fonts()
    total = sum(p.stat().st_size for p in VENDOR.rglob("*") if p.is_file())
    print(f"\nDone. Total vendored: {total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
