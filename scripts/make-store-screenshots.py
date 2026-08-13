#!/usr/bin/env python3
"""App Store Connect に掲載するスクリーンショットを生成する。

生のiPhoneスクショに、背景・ラベル・見出し・説明文を載せて仕上げる。
文言は /app のLPと揃えてあるので、ストアとLPで訴求がぶれない。

デザインの方針
  - 背景はLPと同じ生成り(#FAF8F4)。アプリのUI自体が生成りなので端末が馴染む
  - 画面ごとに淡いアクセント色を上部に敷き、8枚並んだときに単調にならないようにする
  - 「ラベル → 見出し → 説明」の3段で、視線の入り口を作る
  - 端末には実際に影を落とす。平置きに見えると安っぽくなる
  - 並び順は「これは何のアプリか」→「実用」→「情緒」。1枚目が最も見られるため

出力サイズは 1242x2688（6.5インチ）。現在ストアに載っているものと同じ寸法。

必要なもの: Pillow
    python3 -m venv .venv && .venv/bin/pip install Pillow

Usage:
    .venv/bin/python scripts/make-store-screenshots.py <出力先> [centered|editorial]
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

from importlib.machinery import SourceFileLoader

_framer = SourceFileLoader(
    "framer", os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           "frame-app-screenshots.py")).load_module()

CANVAS = (1242, 2688)
BG = (0xFA, 0xF8, 0xF4)        # 生成り。LPと同じ
INK = (0x16, 0x35, 0x2A)       # 見出しの深緑
BODY = (0x5C, 0x5A, 0x52)      # 説明文の温かみのあるグレー

# ⚠️ 仮名専用フォント（かくまるっこ等）を使わないこと。
#    漢字が字形を持たず、無言で抜け落ちる。下の check_glyphs() で必ず検査している。
FONT_PATH = os.path.expanduser("~/Library/Fonts/NotoSansJP-VariableFont_wght.ttf")

TOP_PAD = 132
LABEL_SIZE = 34
HEADLINE_SIZE = 86
HEADLINE_LEADING = 1.32
SUB_SIZE = 40
SUB_LEADING = 1.55
GAP_LABEL = 40
GAP_SUB = 34
GAP_DEVICE = 78
DEVICE_WIDTH = 980

WASH_HEIGHT = 1150             # 上部に敷くアクセントの高さ
WASH_ALPHA = 46                # 濃くしすぎない。地の生成りを残す

DOWNLOADS = os.path.expanduser("~/Downloads")

# 見出し・説明文はLPと同じ言い回しに揃えている。
# accent は画面ごとの識別色。ラベルの地色と上部のウォッシュに使う。
SLIDES = [
    {
        "src": "IMG_3981.PNG", "name": "01-home", "index": "01",
        "label": "GREEN COLLECTION", "accent": (0x01, 0x54, 0x40),
        "headline": ["植物のお世話が、", "コレクションになる。"],
        "sub": ["開くたびに、育てている植物が降ってくる。",
                "集めるほど、棚がにぎやかに。"],
    },
    {
        "src": "IMG_3985.PNG", "name": "02-watering", "index": "02",
        "label": "水やり", "accent": (0x2E, 0x7D, 0xA8),
        "headline": ["今日水やりをする植物が、", "ひと目でわかる。"],
        "sub": ["今日・明日・それ以降に自動でまとまる。",
                "株をダブルタップすれば、その場で記録。"],
    },
    {
        "src": "IMG_3987.PNG", "name": "03-add", "index": "03",
        "label": "AI図鑑", "accent": (0x4A, 0x7C, 0x2F),
        "headline": ["写真を撮るだけで、", "AIが自動で下書き。"],
        "sub": ["品種名・水やり頻度・育て方まで、",
                "AIが教えてくれます。"],
    },
    {
        "src": "IMG_3984.PNG", "name": "04-care-data", "index": "04",
        "label": "育て方データ", "accent": (0x8A, 0x6D, 0x1E),
        "headline": ["1,000種類を超える", "植物図鑑データ。"],
        "sub": ["適温・湿度・日当たりまで、",
                "品種ごとの育て方がすぐわかる。"],
    },
    {
        "src": "IMG_3992.PNG", "name": "05-calendar", "index": "05",
        "label": "記録", "accent": (0x9A, 0x5A, 0x2C),
        "headline": ["お世話は、ぜんぶ", "カレンダーに残る。"],
        "sub": ["水やり・肥料・剪定・メモが日付ごとに。",
                "植え替えの予定も自由に書き込めます。"],
    },
    {
        "src": "IMG_3988.PNG", "name": "06-collection", "index": "06",
        "label": "コレクション", "accent": (0x2F, 0x6B, 0x52),
        "headline": ["増えても、迷わない。"],
        "sub": ["属ごとの絞り込み、名前・品種での検索、お気に入り。",
                "何十株になっても、探している子がすぐ見つかる。"],
    },
    {
        "src": "IMG_3991.PNG", "name": "07-characters", "index": "07",
        "label": "なかまたち", "accent": (0xC2, 0x5A, 0x1E),
        "headline": ["ひとりで育てない。", "8体のなかまたち。"],
        "sub": ["応援担当のブルーム、植物博士のラム、土ならクロ。",
                "それぞれの担当から、毎日ひとことずつ。"],
    },
    {
        "src": "IMG_3982.PNG", "name": "08-summary", "index": "08",
        "label": "ふりかえり", "accent": (0x2E, 0x7D, 0xA8),
        "headline": ["がんばった分が、", "数字になる。"],
        "sub": ["今月の水やり回数とお世話の合計、",
                "いちばん世話した株のランキングが毎月まとまる。"],
    },
]


def load_font(size, weight):
    font = ImageFont.truetype(FONT_PATH, size)
    font.set_variation_by_axes([weight])
    return font


def check_glyphs(font, lines, where):
    """字形を持たない文字がないか確かめる。

    仮名専用フォントを使うと漢字が無言で消える。出力を目視するまで
    気づけないので、生成の前に弾く。
    """
    missing = {c for line in lines for c in line
               if c.strip() and not font.getmask(c).getbbox()}
    if missing:
        sys.exit(f"{where}: フォントに字形がない文字があります → {''.join(sorted(missing))}")


def paint_wash(canvas, accent):
    """上部にアクセント色を薄く敷き、下に向けて地の色へ溶かす。"""
    ramp = Image.new("L", (1, WASH_HEIGHT))
    for y in range(WASH_HEIGHT):
        # 上端が最も濃く、下端で完全に消える
        ramp.putpixel((0, y), int(WASH_ALPHA * (1 - y / WASH_HEIGHT) ** 1.6))
    mask = ramp.resize((CANVAS[0], WASH_HEIGHT))
    layer = Image.new("RGB", (CANVAS[0], WASH_HEIGHT), accent)
    canvas.paste(layer, (0, 0), mask)


def draw_label(draw, text, font, top, accent, center_x=None):
    """アクセント色の小さな見出しラベル（角丸のピル）。

    ⚠️ ピルの高さを font.size から出さないこと。日本語は字面が em を超えるため、
    下端が欠けたり上下がずれたりする。実際の字面（getbbox）から採寸し、
    文字は anchor="mm" でピルの中心に置く。
    """
    pad_x, pad_y = 32, 18
    left, top_b, right, bottom = font.getbbox(text)
    box_w = (right - left) + pad_x * 2
    box_h = (bottom - top_b) + pad_y * 2
    x = (center_x if center_x is not None else CANVAS[0] // 2) - box_w // 2
    draw.rounded_rectangle([x, top, x + box_w, top + box_h],
                           radius=box_h // 2, fill=accent)
    draw.text((x + box_w // 2, top + box_h // 2), text,
              font=font, fill=BG, anchor="mm")
    return top + box_h


def draw_lines(draw, lines, font, top, color, leading, x, anchor="ma"):
    """複数行を描き、次の要素を置くY座標を返す。

    anchor で寄せを決める（"ma"=中央揃え / "la"=左揃え）。
    横位置を textbbox の幅から自前で計算すると左サイドベアリング分ずれるため、
    anchor に任せる。
    """
    line_h = int(font.size * leading)
    y = top
    for line in lines:
        draw.text((x, y), line, font=font, fill=color, anchor=anchor)
        y += line_h
    return y


def with_shadow(device):
    """端末の下に柔らかい影を作る。平置きに見えないようにするため。"""
    blur, offset = 46, 34
    pad = blur * 3
    shadow = Image.new("RGBA", (device.width + pad * 2, device.height + pad * 2),
                       (0, 0, 0, 0))
    silhouette = Image.new("RGBA", device.size, (22, 53, 42, 96))
    shadow.paste(silhouette, (pad, pad + offset), device)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    shadow.paste(device, (pad, pad), device)
    return shadow, pad


def draw_tracked(draw, text, font, x, y, color, tracking):
    """字間を空けて描く。ラベルを小さく置くとき、詰まって見えるのを防ぐ。"""
    for ch in text:
        draw.text((x, y), ch, font=font, fill=color, anchor="la")
        x += font.getlength(ch) + tracking
    return x


def build_editorial(slide, out_dir):
    """雑誌の見開きのような、左揃え・余白多め・端末を傾けた構成。"""
    accent = slide["accent"]

    canvas = Image.new("RGB", CANVAS, BG)
    # 斜めの淡いグラデーション。平坦さを消して奥行きを出す
    grad = Image.new("L", (64, 64))
    gd = ImageDraw.Draw(grad)
    for i in range(64):
        gd.line([(0, i), (64, i - 64)], fill=int(58 * (1 - i / 64) ** 1.3))
    canvas.paste(Image.new("RGB", CANVAS, accent), (0, 0),
                 grad.resize(CANVAS, Image.BICUBIC))

    # 端末の背後に置く、ぼかした色だまり。奥行きの芯になる
    blob = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    ImageDraw.Draw(blob).ellipse([180, 1180, 1140, 2200], fill=accent + (58,))
    canvas.paste(Image.alpha_composite(
        canvas.convert("RGBA"), blob.filter(ImageFilter.GaussianBlur(150))
    ).convert("RGB"), (0, 0))

    draw = ImageDraw.Draw(canvas)
    left = 104

    label_font = load_font(30, 700)
    head_font = load_font(94, 900)
    sub_font = load_font(38, 500)
    index_font = load_font(30, 900)
    for f, lines, where in ((label_font, [slide["label"]], "ラベル"),
                            (head_font, slide["headline"], "見出し"),
                            (sub_font, slide["sub"], "説明文")):
        check_glyphs(f, lines, f"{slide['name']} の{where}")

    # 連番と細い罫線。誌面の目次のような佇まいにする
    y = 150
    draw.text((left, y), slide["index"], font=index_font, fill=accent, anchor="la")
    draw.line([(left + 62, y + 20), (left + 132, y + 20)], fill=accent, width=3)
    draw_tracked(draw, slide["label"], label_font, left + 152, y - 1, accent, 4)

    y = draw_lines(draw, slide["headline"], head_font, y + 92, INK, 1.30,
                   left, anchor="la")
    y = draw_lines(draw, slide["sub"], sub_font, y + 30, BODY, 1.6,
                   left, anchor="la")

    device = _framer.frame(os.path.join(DOWNLOADS, slide["src"]))
    w = 1015
    device = device.resize((w, round(device.height * w / device.width)),
                           Image.LANCZOS)
    device = device.rotate(-3.4, expand=True, resample=Image.BICUBIC)
    device, pad = with_shadow(device)
    canvas.paste(device, ((CANVAS[0] - device.width) // 2 + 30,
                          y + 96 - pad), device)

    path = os.path.join(out_dir, f"{slide['name']}.png")
    canvas.save(path)
    return path


def build(slide, out_dir):
    device = _framer.frame(os.path.join(DOWNLOADS, slide["src"]))
    device = device.resize(
        (DEVICE_WIDTH, round(device.height * DEVICE_WIDTH / device.width)),
        Image.LANCZOS)
    device, pad = with_shadow(device)

    canvas = Image.new("RGB", CANVAS, BG)
    paint_wash(canvas, slide["accent"])
    draw = ImageDraw.Draw(canvas)

    label_font = load_font(LABEL_SIZE, 700)
    head_font = load_font(HEADLINE_SIZE, 900)
    sub_font = load_font(SUB_SIZE, 500)
    check_glyphs(label_font, [slide["label"]], f"{slide['name']} のラベル")
    check_glyphs(head_font, slide["headline"], f"{slide['name']} の見出し")
    check_glyphs(sub_font, slide["sub"], f"{slide['name']} の説明文")

    y = draw_label(draw, slide["label"], label_font, TOP_PAD, slide["accent"])
    y = draw_lines(draw, slide["headline"], head_font, y + GAP_LABEL,
                   INK, HEADLINE_LEADING, CANVAS[0] // 2)
    y = draw_lines(draw, slide["sub"], sub_font, y + GAP_SUB,
                   BODY, SUB_LEADING, CANVAS[0] // 2)

    # 端末は中央寄せ。canvasの下端からはみ出すぶんは切れる（意図どおり）
    canvas.paste(device, ((CANVAS[0] - device.width) // 2,
                          y + GAP_DEVICE - pad), device)

    path = os.path.join(out_dir, f"{slide['name']}.png")
    canvas.save(path)
    return path


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    out_dir = os.path.abspath(sys.argv[1])
    style = sys.argv[2] if len(sys.argv) > 2 else "centered"
    maker = {"centered": build, "editorial": build_editorial}[style]
    os.makedirs(out_dir, exist_ok=True)
    for slide in SLIDES:
        print(os.path.basename(maker(slide, out_dir)))
    print(f"\n{len(SLIDES)}枚を {out_dir} に出力しました（{CANVAS[0]}x{CANVAS[1]}）")


if __name__ == "__main__":
    main()
