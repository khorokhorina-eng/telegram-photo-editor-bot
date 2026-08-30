"""Build a short right-to-left wipe GIF from four Telegram campaign frames."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/channel/transformation-20260828"
OUTPUT = ROOT / "assets/channel/transformation-20260828.gif"
FRAME_FILES = [
    "01-home.png",
    "02-resort.png",
    "03-thailand-swing.png",
    "04-convertible-bouquet.png",
]
SIZE = (540, 960)


def prepare(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image.thumbnail(SIZE, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", SIZE, "#0d0b0d")
    left = (SIZE[0] - image.width) // 2
    top = (SIZE[1] - image.height) // 2
    canvas.paste(image, (left, top))
    return canvas


def palette(image: Image.Image) -> Image.Image:
    return image.quantize(colors=128, method=Image.Quantize.MEDIANCUT)


def main() -> None:
    scenes = [prepare(SOURCE / filename) for filename in FRAME_FILES]
    frames: list[Image.Image] = []
    durations: list[int] = []

    for index, current in enumerate(scenes):
        frames.extend([palette(current)] * 2)
        durations.extend([700, 500])
        if index == len(scenes) - 1:
            continue

        following = scenes[index + 1]
        for step in range(1, 13):
            boundary = SIZE[0] - round(SIZE[0] * step / 12)
            frame = current.copy()
            frame.paste(following.crop((boundary, 0, SIZE[0], SIZE[1])), (boundary, 0))
            draw = ImageDraw.Draw(frame)
            draw.rectangle((boundary - 3, 0, boundary + 3, SIZE[1]), fill="#fff1a3")
            draw.rectangle((boundary - 1, 0, boundary + 1, SIZE[1]), fill="#ffffff")
            frames.append(palette(frame))
            durations.append(60)

    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(f"{OUTPUT} ({OUTPUT.stat().st_size / 1024 / 1024:.2f} MiB, {len(frames)} frames)")


if __name__ == "__main__":
    main()
