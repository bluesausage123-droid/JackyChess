"""Generate Android launcher icons from the master 1024 chevron icon.

Outputs into android/app/src/main/res/mipmap-* and updates the adaptive-icon
background color to deep red (#7F1D1D).

Layers:
  - ic_launcher.png         legacy launcher (transparent bg + chevrons)
  - ic_launcher_round.png   round legacy variant (same)
  - ic_launcher_foreground.png  adaptive icon foreground (chevrons inside the
                                72/108 safe-zone of a transparent canvas)
  - background color set in res/values/ic_launcher_background.xml
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "site" / "icons" / "icon-1024.png"  # transparent chevrons
RES = ROOT / "android" / "app" / "src" / "main" / "res"

# Density buckets → legacy launcher size, adaptive foreground size
# Legacy launcher icons are 48dp at mdpi → 192px at xxxhdpi (4×).
# Adaptive icons are 108dp foreground → 432px at xxxhdpi.
DENSITIES = {
    "mdpi": (48, 108),
    "hdpi": (72, 162),
    "xhdpi": (96, 216),
    "xxhdpi": (144, 324),
    "xxxhdpi": (192, 432),
}

# Brand red for the adaptive-icon background layer.
BG_RED = "#7F1D1D"


def safe_area_image(src: Image.Image, canvas_size: int, content_ratio: float) -> Image.Image:
    """Place src centered on a transparent canvas, scaled to content_ratio of canvas width."""
    target_w = int(canvas_size * content_ratio)
    src_resized = src.resize((target_w, target_w), Image.LANCZOS)
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    off = (canvas_size - target_w) // 2
    canvas.paste(src_resized, (off, off), src_resized)
    return canvas


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing master icon: {SRC}. Run make_icons.py first.")
    master = Image.open(SRC).convert("RGBA")

    # Adaptive-icon foreground safe zone: visible region is inner 66/108 ≈ 0.61
    # of the canvas. We use 0.55 to leave a little extra breathing room for
    # parallax launchers.
    SAFE_RATIO = 0.55

    for density, (legacy_size, fg_size) in DENSITIES.items():
        target_dir = RES / f"mipmap-{density}"
        target_dir.mkdir(parents=True, exist_ok=True)

        # Legacy launcher (transparent bg + chevrons, full bleed)
        legacy = master.resize((legacy_size, legacy_size), Image.LANCZOS)
        legacy.save(target_dir / "ic_launcher.png", "PNG", optimize=True)
        legacy.save(target_dir / "ic_launcher_round.png", "PNG", optimize=True)

        # Adaptive foreground: chevrons inside safe zone
        fg = safe_area_image(master, fg_size, SAFE_RATIO)
        fg.save(target_dir / "ic_launcher_foreground.png", "PNG", optimize=True)

        print(f"  {density}: legacy {legacy_size}px, foreground {fg_size}px")

    # Update the adaptive-icon background color (Capacitor default is white).
    bg_xml = RES / "values" / "ic_launcher_background.xml"
    bg_xml.write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        "<resources>\n"
        f'    <color name="ic_launcher_background">{BG_RED}</color>\n'
        "</resources>\n",
        encoding="utf-8",
    )
    print(f"  background color → {BG_RED}")
    print("Done.")


if __name__ == "__main__":
    main()
