#!/usr/bin/env python3
"""Create a clean 2×2 post image from the four transformation scenes."""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "channel" / "transformation-v2-20260828"
OUTPUT = SOURCE / "transformation-grid.jpg"
TILE = (720, 960)
GAP = 12


def tile(path: Path) -> Image.Image:
    with Image.open(path) as image:
        return ImageOps.fit(image.convert("RGB"), TILE, Image.Resampling.LANCZOS, centering=(0.5, 0.45))


def main() -> None:
    names = ("01-home-mirror.png", "02-black-dress.png", "03-mountains-peonies.png", "04-autumn.png")
    photos = [tile(SOURCE / name) for name in names]
    canvas = Image.new("RGB", (TILE[0] * 2 + GAP * 3, TILE[1] * 2 + GAP * 3), "#ffffff")
    positions = ((GAP, GAP), (TILE[0] + GAP * 2, GAP), (GAP, TILE[1] + GAP * 2), (TILE[0] + GAP * 2, TILE[1] + GAP * 2))
    for photo, position in zip(photos, positions):
        canvas.paste(photo, position)
    canvas.save(OUTPUT, quality=96, subsampling=0, optimize=True)


if __name__ == "__main__":
    main()
