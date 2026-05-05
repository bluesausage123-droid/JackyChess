"""Extract the inline JSX block from site/index.html into site/app.jsx.

The JSX lives between `<script type="text/babel">` and the matching `</script>`.
We write only the source so Babel can compile it to plain JS, dropping the
need for babel-standalone at runtime.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "site" / "index.html"
OUT = ROOT / "site" / "app.jsx"

text = HTML.read_text(encoding="utf-8")
m = re.search(
    r'<script\s+type="text/babel">\s*\n(?P<body>.*?)\n\s*</script>',
    text,
    flags=re.DOTALL,
)
if not m:
    raise SystemExit("Could not find <script type=\"text/babel\"> block.")
body = m.group("body")
OUT.write_text(body, encoding="utf-8")
print(f"Extracted {len(body)} chars → {OUT.relative_to(ROOT)}")
