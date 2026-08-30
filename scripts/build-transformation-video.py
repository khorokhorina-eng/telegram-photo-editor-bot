#!/usr/bin/env python3
"""Build a high-quality Telegram transformation animation from four stills."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "channel" / "transformation-v2-20260828"
FRAMES = Path("/tmp/transformation-v2-frames")
SIZE = (720, 1280)
FPS = 12
HOLD_FRAMES = 12
TRANSITION_FRAMES = 6


def prepare(path: Path) -> Image.Image:
    with Image.open(path) as image:
        return ImageOps.fit(image.convert("RGB"), SIZE, Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def save(frame: Image.Image, index: int) -> None:
    frame.save(FRAMES / f"frame-{index:03d}.jpg", quality=96, subsampling=0, optimize=True)


def main() -> None:
    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True)
    images = [prepare(SOURCE / name) for name in (
        "01-home-mirror.png",
        "02-black-dress.png",
        "03-mountains-peonies.png",
        "04-autumn.png",
    )]

    index = 0
    for current, following in zip(images, images[1:]):
        for _ in range(HOLD_FRAMES):
            save(current, index)
            index += 1
        for step in range(TRANSITION_FRAMES):
            progress = (step + 1) / TRANSITION_FRAMES
            boundary = int(SIZE[0] * (1 - progress))
            frame = current.copy()
            frame.paste(following.crop((boundary, 0, SIZE[0], SIZE[1])), (boundary, 0))
            draw = ImageDraw.Draw(frame)
            draw.line((boundary, 0, boundary, SIZE[1]), fill=(255, 248, 215), width=6)
            draw.line((boundary + 5, 0, boundary + 5, SIZE[1]), fill=(255, 255, 255), width=2)
            save(frame, index)
            index += 1
    for _ in range(HOLD_FRAMES):
        save(images[-1], index)
        index += 1


if __name__ == "__main__":
    main()
