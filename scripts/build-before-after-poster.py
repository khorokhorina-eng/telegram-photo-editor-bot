from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/n.khorokhorina/Desktop/Новая папка')
OUT = ROOT / 'assets/channel/before-after-story-20260828.png'
BG = ROOT / 'assets/channel/poster-bg-20260828.png'

W, H = 1080, 1350
GRID_H, TILE = 1080, 540
WHITE = (255, 255, 255)
GOLD = (244, 194, 48)
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_REGULAR = '/System/Library/Fonts/Supplemental/Arial.ttf'

images = [
    SOURCE / 'IMAGE 2026-08-20 19:38:57.jpg',
    SOURCE / 'IMAGE 2026-08-20 19:41:02.jpg',
    SOURCE / 'IMAGE 2026-08-20 19:41:11.jpg',
    SOURCE / 'IMAGE 2026-08-20 19:41:37.jpg',
]

def font(size, bold=True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)

def cover(path, size):
    image = Image.open(path).convert('RGB')
    # Keep the crown and whole face in the frame. The lower part may crop, not the head.
    return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.10))

def draw_multiline(draw, xy, text, size, fill, spacing=3):
    draw.multiline_text(xy, text, font=font(size), fill=fill, spacing=spacing)

canvas = Image.new('RGB', (W, H), (14, 14, 16))
for index, image_path in enumerate(images):
    x = (index % 2) * TILE
    y = (index // 2) * TILE
    canvas.paste(cover(image_path, (TILE, TILE)), (x, y))

# Thin dividers keep the comparison visually clean.
draw = ImageDraw.Draw(canvas, 'RGBA')
draw.rectangle((0, TILE - 3, W, TILE + 3), fill=(255, 255, 255, 180))
draw.rectangle((TILE - 3, 0, TILE + 3, GRID_H), fill=(255, 255, 255, 180))

# Narrative labels: first-person copy plus a separate explanatory callout in every frame.
draw.text((46, 38), 'ЭТО', font=font(48), fill=WHITE)
draw.text((46, 91), 'Я', font=font(54), fill=GOLD)
draw.rounded_rectangle((44, 402, 405, 516), radius=18, fill=(4, 4, 5, 192), outline=GOLD, width=2)
draw.text((66, 422), '1 обычное фото', font=font(30), fill=WHITE)
draw.text((66, 462), 'без фильтров и фотосессий', font=font(20, False), fill=WHITE)

draw.text((590, 145), 'НО ЗДЕСЬ', font=font(38), fill=WHITE)
draw.text((590, 185), 'Я НИКОГДА', font=font(38), fill=GOLD)
draw.text((590, 225), 'НЕ БЫЛА', font=font(38), fill=WHITE)
draw.rounded_rectangle((728, 408, 1042, 516), radius=18, fill=(4, 4, 5, 192), outline=GOLD, width=2)
draw.text((752, 427), 'AI-фотосессия', font=font(28), fill=WHITE)
draw.text((752, 466), 'из одного селфи', font=font(22, False), fill=GOLD)

draw.text((45, 730), 'И ЗДЕСЬ', font=font(38), fill=WHITE)
draw.text((45, 770), 'ТОЖЕ', font=font(38), fill=WHITE)
draw.text((45, 810), 'Я НЕ БЫЛА', font=font(38), fill=GOLD)
draw.line((85, 912, 162, 936), fill=GOLD, width=5)
draw.polygon(((162, 936), (140, 924), (143, 948)), fill=GOLD)

draw.text((590, 900), 'А ЭТО', font=font(38), fill=WHITE)
draw.text((590, 940), 'ТОЖЕ', font=font(38), fill=WHITE)
draw.text((590, 980), 'Я', font=font(42), fill=GOLD)

# Use the generated texture only as the brand-footer background.
footer = ImageOps.fit(Image.open(BG).convert('RGB'), (W, H - GRID_H), method=Image.Resampling.LANCZOS)
canvas.paste(footer, (0, GRID_H))
draw = ImageDraw.Draw(canvas, 'RGBA')
draw.rectangle((0, GRID_H, W, H), fill=(0, 0, 0, 125))
draw.text((42, 1118), 'AI-ФОТОСЕССИИ', font=font(57), fill=WHITE)
draw.text((43, 1188), 'Загрузи своё фото — получи новые образы', font=font(27, False), fill=WHITE)
draw.rounded_rectangle((620, 1127, 1036, 1294), radius=24, fill=(8, 8, 10, 210), outline=GOLD, width=3)
draw.text((657, 1163), 'Попробуй в боте', font=font(25, False), fill=WHITE)
draw.text((657, 1200), '@gpt_photoeditor_bot', font=font(27), fill=GOLD)

canvas.save(OUT, quality=95, optimize=True)
print(OUT)
