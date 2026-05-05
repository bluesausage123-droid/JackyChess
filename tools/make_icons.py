"""
觀棋心徑 App icon generator (v2 — flat, sharp, transparent background).

Per user spec:
  - Transparent background (no red circle, no starfield, no rim).
  - Sharp right-angle ends on the chevrons (no rounded caps).
  - Two parallel chevrons (uniform perpendicular gap).
  - LEFT arm length = RIGHT arm length × 5/3 (左邊比右邊長 2/3 倍).
  - Faithful to the user's original reference image (bright yellow chevrons).

Renders via filled polygons at 4× supersampling for crisp edges.

Outputs into site/icons/ at sizes 72, 96, 128, 144, 152, 192, 384, 512, plus
maskable variants (192/512) and a 1024 master.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

SUPERSAMPLE = 4
MASTER = 1024
CANVAS = MASTER * SUPERSAMPLE

# Bright yellow matching the user's reference image
YELLOW = (255, 230, 0, 255)

# Maskable icons MUST have a non-transparent background (Android crops them
# into varying shapes). We use deep red so it stays on-brand even though the
# regular icons are transparent.
MASKABLE_BG = (127, 29, 29, 255)


def chevron_polygon(
    apex_x: float,
    apex_y: float,
    left_arm: float,
    right_arm: float,
    half_angle_rad: float,
    stroke: float,
) -> list[tuple[float, float]]:
    """Return a flat-ended chevron polygon (sharp miter at apex, flat ends).

    The chevron points UP — apex at top, arms extending down-left / down-right.
    """
    sa = math.sin(half_angle_rad)
    ca = math.cos(half_angle_rad)

    # Endpoints of the centerlines
    right_end = (apex_x + right_arm * sa, apex_y + right_arm * ca)
    left_end = (apex_x - left_arm * sa, apex_y + left_arm * ca)

    # Outward perpendicular (toward the convex / "above" side of the V)
    # Right arm dir = (sa, ca) → CCW 90° rotation = (ca, -sa) points up-right
    right_n = (ca, -sa)
    # Left arm dir = (-sa, ca) → CW 90° rotation = (-ca, -sa) points up-left
    left_n = (-ca, -sa)

    half_w = stroke / 2
    miter = half_w / sa  # along the (vertical) bisector

    apex_outer = (apex_x, apex_y - miter)
    apex_inner = (apex_x, apex_y + miter)

    right_end_outer = (right_end[0] + right_n[0] * half_w, right_end[1] + right_n[1] * half_w)
    right_end_inner = (right_end[0] - right_n[0] * half_w, right_end[1] - right_n[1] * half_w)
    left_end_outer = (left_end[0] + left_n[0] * half_w, left_end[1] + left_n[1] * half_w)
    left_end_inner = (left_end[0] - left_n[0] * half_w, left_end[1] - left_n[1] * half_w)

    # Walk the polygon clockwise starting from the top miter
    return [
        apex_outer,
        right_end_outer,
        right_end_inner,
        apex_inner,
        left_end_inner,
        left_end_outer,
    ]


def draw_chevron_pair(
    img: Image.Image,
    scale: float = 1.0,
    color=YELLOW,
) -> None:
    size = img.size[0]
    cx, cy = size / 2, size / 2

    right_arm = 220 * SUPERSAMPLE * scale
    left_arm = right_arm * (5 / 3)
    half_angle = math.radians(45)  # apex = 90° (right angle)
    stroke = 70 * SUPERSAMPLE * scale
    gap = 200 * SUPERSAMPLE * scale  # centerline-to-centerline gap between the two chevrons

    # Vertical placement: balance the pair around the canvas center.
    # Compute total vertical extent and center it.
    sa = math.sin(half_angle)
    ca = math.cos(half_angle)
    half_w = stroke / 2
    miter = half_w / sa
    # Top of the upper chevron: apex_outer.y = apex_y - miter
    # Bottom of the lower chevron: max(left_end_inner.y, right_end_inner.y) + ...
    # Use the longer arm (left) end's bottom: apex_y2 + left_arm*ca + half_w*sa
    # apex_y2 = apex_y + gap. Approximate vertical center:
    top_y = -miter
    bottom_y = gap + left_arm * ca + half_w * sa
    motif_height = bottom_y - top_y
    apex_y_top = cy - motif_height / 2 - top_y  # so that the motif is centered

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    for i in range(2):
        ay = apex_y_top + i * gap
        poly = chevron_polygon(cx, ay, left_arm, right_arm, half_angle, stroke)
        d.polygon(poly, fill=color)

    img.alpha_composite(overlay)


def render_master(scale: float = 1.0, bg=(0, 0, 0, 0)) -> Image.Image:
    out = Image.new("RGBA", (CANVAS, CANVAS), bg)
    draw_chevron_pair(out, scale=scale)
    return out.resize((MASTER, MASTER), Image.LANCZOS)


def main() -> None:
    print("Rendering master 1024 (transparent)...")
    master = render_master()
    master.save(OUT / "icon-1024.png", "PNG")
    print(f"  saved {OUT / 'icon-1024.png'}")

    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    for s in sizes:
        img = master.resize((s, s), Image.LANCZOS)
        path = OUT / f"icon-{s}.png"
        img.save(path, "PNG", optimize=True)
        print(f"  saved {path}")

    # Maskable variants — Android adaptive icons require a non-transparent
    # background, so we render the same motif on a deep red bleed.
    print("Rendering maskable 1024 (red bleed)...")
    maskable = render_master(scale=0.62, bg=MASKABLE_BG)
    maskable.save(OUT / "icon-maskable-1024.png", "PNG")
    for s in (192, 512):
        m = maskable.resize((s, s), Image.LANCZOS)
        m.save(OUT / f"icon-maskable-{s}.png", "PNG", optimize=True)
        print(f"  saved {OUT / f'icon-maskable-{s}.png'}")

    favicon = master.resize((64, 64), Image.LANCZOS)
    favicon.save(OUT / "favicon.png", "PNG", optimize=True)
    print(f"  saved {OUT / 'favicon.png'}")
    print("Done.")


if __name__ == "__main__":
    main()
