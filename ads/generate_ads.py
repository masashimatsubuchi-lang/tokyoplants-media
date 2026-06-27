from PIL import Image, ImageDraw, ImageFont
import os

BASE = "/Users/masashimatsubuchi/my-first-project/public/images/products/botanical-towel"
OUT  = "/Users/masashimatsubuchi/my-first-project/ads"
os.makedirs(OUT, exist_ok=True)

FONT_MINCHO = "/System/Library/Fonts/ヒラギノ明朝 ProN.ttc"
FONT_BOLD   = "/System/Library/Fonts/ヒラギノ角ゴシック W8.ttc"
FONT_HELV   = "/System/Library/Fonts/HelveticaNeue.ttc"

def load_font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except:
        return ImageFont.load_default()

def add_gradient(img, direction, color, max_alpha, ratio):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    w, h = img.size
    if direction == "bottom":
        grad_h = int(h * ratio)
        for y in range(grad_h):
            a = int(max_alpha * y / grad_h)
            draw.line([(0, h - grad_h + y), (w, h - grad_h + y)], fill=(*color, a))
    elif direction == "top":
        grad_h = int(h * ratio)
        for y in range(grad_h):
            a = int(max_alpha * (1 - y / grad_h))
            draw.line([(0, y), (w, y)], fill=(*color, a))
    return Image.alpha_composite(img.convert("RGBA"), overlay)

def shadow_text(draw, pos, text, font, fill=(255,255,255), s=2, so=80):
    x, y = pos
    draw.text((x+s, y+s), text, font=font, fill=(0, 0, 0, so))
    draw.text((x, y), text, font=font, fill=fill)

def crop_to_ratio(img, w, h):
    iw, ih = img.size
    target = w / h
    src = iw / ih
    if src > target:
        new_w = int(ih * target)
        left = (iw - new_w) // 2
        return img.crop((left, 0, left + new_w, ih))
    else:
        new_h = int(iw / target)
        top = ih // 8
        return img.crop((0, top, iw, min(top + new_h, ih)))

# ────────────────────────────────────────────
# AD 1: 4:5 (1080×1350) — product-on-table
# ────────────────────────────────────────────
W, H = 1080, 1350
img = crop_to_ratio(Image.open(f"{BASE}/product-on-table.jpg"), W, H).resize((W, H), Image.LANCZOS)
img = add_gradient(img, "bottom", (18, 35, 18), 210, 0.42)
d = ImageDraw.Draw(img)

f_tag   = load_font(FONT_HELV,   26)
f_main  = load_font(FONT_MINCHO, 90)
f_sub   = load_font(FONT_BOLD,   36)
f_price = load_font(FONT_HELV,   30)

# Tag pill
tag = "Daily Botanical Towel"
tw = int(d.textlength(tag, font=f_tag))
d.rounded_rectangle([(60,58),(60+tw+32,102)], radius=22, fill=(255,255,255,230))
d.text((76, 67), tag, font=f_tag, fill=(40,65,40))

y0 = H - 330
shadow_text(d, (72, y0),      "植物を、毎日の",            f_main)
shadow_text(d, (72, y0+104),  "そばに。",                  f_main)
shadow_text(d, (74, y0+215),  "希少植物デザイン  全10種",  f_sub,   fill=(195,230,195))
shadow_text(d, (74, y0+264),  "¥2,000  /  tokyoplants.com", f_price, fill=(170,210,170))

img.convert("RGB").save(f"{OUT}/ad1_feed_4x5.jpg", quality=95)
print("Ad1 saved ✓")

# ────────────────────────────────────────────
# AD 2: 1:1 (1080×1080) — hero (wall scene)
# ────────────────────────────────────────────
img = crop_to_ratio(Image.open(f"{BASE}/hero.jpg"), 1, 1).resize((1080, 1080), Image.LANCZOS)
img = add_gradient(img, "bottom", (238,244,232), 220, 0.38)
d = ImageDraw.Draw(img)

f2_main  = load_font(FONT_MINCHO, 74)
f2_sub   = load_font(FONT_BOLD,   34)
f2_price = load_font(FONT_HELV,   27)
dg = (32, 62, 32)

d.text((62, 750), "インテリアに、",              font=f2_main,  fill=dg)
d.text((62, 832), "植物のかたち。",              font=f2_main,  fill=dg)
d.text((64, 932), "Daily Botanical Towel  |  全10種", font=f2_sub,   fill=(75,110,65))
d.text((65, 980), "¥2,000  /  tokyoplants.com", font=f2_price, fill=(115,145,100))

img.convert("RGB").save(f"{OUT}/ad2_feed_1x1_interior.jpg", quality=95)
print("Ad2 saved ✓")

# ────────────────────────────────────────────
# AD 3: 1:1 (1080×1080) — kitchen (red Caladium)
# ────────────────────────────────────────────
img = crop_to_ratio(Image.open(f"{BASE}/kitchen-use.jpg"), 1, 1).resize((1080, 1080), Image.LANCZOS)
img = add_gradient(img, "top",    (0,0,0), 120, 0.28)
img = add_gradient(img, "bottom", (0,0,0), 170, 0.38)
d = ImageDraw.Draw(img)

f3_main  = load_font(FONT_MINCHO, 78)
f3_sub   = load_font(FONT_BOLD,   34)
f3_price = load_font(FONT_HELV,   28)

d.text((62, 48), "Daily Botanical Towel", font=load_font(FONT_HELV, 28), fill=(255,255,255,210))
shadow_text(d, (62, 718), "キッチンを、",             f3_main, s=3)
shadow_text(d, (62, 806), "植物で飾ろう。",           f3_main, s=3)
shadow_text(d, (64, 908), "希少植物デザイン  全10種", f3_sub,  fill=(255,218,195), s=2)
shadow_text(d, (65, 955), "¥2,000  /  tokyoplants.com", f3_price, fill=(220,190,178), s=2)

img.convert("RGB").save(f"{OUT}/ad3_feed_1x1_kitchen.jpg", quality=95)
print("Ad3 saved ✓")
print("\nAll 3 creatives generated!")
