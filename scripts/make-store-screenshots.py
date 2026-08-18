#!/usr/bin/env python3
"""App Store Connect に掲載するスクリーンショットを生成する。

生のiPhoneスクショに、背景・ラベル・見出し・説明文を載せて仕上げる。
文言は /app のLPと揃えてあるので、ストアとLPで訴求がぶれない。

デザインの方針（2026-08-13改訂：「AI生成っぽい」という指摘を受けて全面刷新）
  - 背景は全枚で統一（LPと同じ生成り #FAF8F4）。以前は画面ごとに違う原色の
    グラデーションを敷いていたが、9枚並べたときに「テンプレートへ自動で色を
    割り振っただけ」に見えてしまっていた。統一した背景に変えることで、
    9枚が1つのキャンペーンとして見えるようにする
  - ぼかした楕円の色だまり（AI生成画像やテンプレート素材で最も多用される
    「安易な奥行きの出し方」）をやめ、代わりに葉っぱのシルエットを背景モチーフに
    使う。植物図鑑アプリの世界観に直接結びつく、記号として意味のある要素にする
  - ラベルは「標本ラベル」風。丸数字インデックス＋字間を空けたラベル＋細い罫線
  - 全枚共通で下部に小さなブランドマーク（葉アイコン＋GREEN COLLECTION）を置き、
    バラバラの掲載物ではなく統一されたシリーズだと分かるようにする
  - 端末には実際に影を落とす。平置きに見えると安っぽくなる
  - 並び順は「これは何のアプリか」→「実用」→「情緒」。1枚目が最も見られるため

出力サイズは 1242x2688（6.5インチ）。現在ストアに載っているものと同じ寸法。

必要なもの: Pillow
    python3 -m venv .venv && .venv/bin/pip install Pillow

Usage:
    .venv/bin/python scripts/make-store-screenshots.py <出力先>
"""

import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

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

DOWNLOADS = os.path.expanduser("~/Downloads")

# 見出し・説明文はLPと同じ言い回しに揃えている。
# accent は画面ごとの識別色。ラベルの地色・葉モチーフの色に使う（背景は全枚共通）。
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
        # 2026-08-13更新: 種類名がAIで自動入力された直後の場面に差し替え
        # （撮影→背景切り抜き→種類名の自動下書きまで進んだ状態が伝わるため）
        "src": "AI-Draft-Catalog.PNG", "name": "03-add", "index": "03",
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
        # 2026-08-13新設: 光をはかる機能
        "src": "Light-Meter-Result.PNG", "name": "05-light-meter", "index": "05",
        "label": "光をはかる", "accent": (0xC9, 0x8A, 0x1E),
        "headline": ["その場所の明るさ、", "写すだけで測れる。"],
        "sub": ["葉っぱを3秒写すだけで、",
                "lux換算・株ごとに判定します。"],
    },
    {
        # 2026-08-18新設: AI健康チェック機能
        "src": "AI-Health-Check-Result.PNG", "name": "06-health-check", "index": "06",
        "label": "健康チェック", "accent": (0xB0, 0x5A, 0x46),
        "headline": ["気になる症状も、", "写真でAIに相談。"],
        "sub": ["葉が黄色い、元気がないなど、",
                "考えられる原因をAIが教えてくれます。"],
    },
    {
        "src": "IMG_3992.PNG", "name": "07-calendar", "index": "07",
        "label": "記録", "accent": (0x9A, 0x5A, 0x2C),
        "headline": ["お世話は、ぜんぶ", "カレンダーに残る。"],
        "sub": ["水やり・肥料・剪定・メモが日付ごとに。",
                "植え替えの予定も自由に書き込めます。"],
    },
    {
        "src": "IMG_3988.PNG", "name": "08-collection", "index": "08",
        "label": "コレクション", "accent": (0x2F, 0x6B, 0x52),
        "headline": ["増えても、迷わない。"],
        "sub": ["属ごとの絞り込み、名前・品種での検索、お気に入り。",
                "何十株になっても、探している子がすぐ見つかる。"],
    },
    {
        "src": "IMG_3991.PNG", "name": "09-characters", "index": "09",
        "label": "なかまたち", "accent": (0xC2, 0x5A, 0x1E),
        "headline": ["ひとりで育てない。", "8体のなかまたち。"],
        "sub": ["応援担当のブルーム、植物博士のラム、土ならクロ。",
                "それぞれの担当から、毎日ひとことずつ。"],
    },
    {
        # 2026-08-18更新: まとめ画面が「使ったお金」中心の作りに変わったのに合わせ、
        # 説明文とソース画像を差し替え（水やりランキングは画面内に残っているが、
        # 見出しの主役は使った金額と予算に変更）。
        "src": "MoneySummary.PNG", "name": "10-summary", "index": "10",
        "label": "ふりかえり", "accent": (0x2E, 0x7D, 0xA8),
        "headline": ["がんばった分が、", "数字になる。"],
        "sub": ["水やり回数とお世話の合計、",
                "使った金額もまとめて振り返れます。"],
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


def leaf_mask(w, h, r_ratio=0.58, d_ratio=0.85):
    """葉っぱのシルエットのマスク（白黒）を作る。

    2つの円を少しだけ離して重ね、その交差（ヴェシカ形）を葉として使う。
    中心を結ぶ線と垂直な向きに尖った、左右に細長いレンズ形になるので、
    使うときは回転させて自然な向き（斜め）に見せる。
    supersample してから縮小し、輪郭を滑らかにする。
    """
    SS = 4
    W, H = w * SS, h * SS
    R = int(H * r_ratio)
    d = int(H * d_ratio)
    cx, cy = W // 2, H // 2
    a = Image.new("L", (W, H), 0)
    ImageDraw.Draw(a).ellipse([cx - R, cy - d // 2 - R, cx + R, cy - d // 2 + R], fill=255)
    b = Image.new("L", (W, H), 0)
    ImageDraw.Draw(b).ellipse([cx - R, cy + d // 2 - R, cx + R, cy + d // 2 + R], fill=255)
    return ImageChops.darker(a, b).resize((w, h), Image.LANCZOS)


def paint_leaf_motif(canvas, accent, size, center, angle, alpha):
    """背景に、うっすら色づいた葉のシルエットを1枚置く。

    以前はぼかした楕円の色だまりで奥行きを出していたが、それは
    テンプレート素材によくある表現で「AI生成っぽい」印象の一因になっていた。
    植物図鑑アプリの世界観に直接つながる葉モチーフに差し替える。
    中央に葉脈の線を1本添えて、ただの色面ではなく「葉」だと分かるようにする。
    """
    w, h = size
    mask = leaf_mask(w, h)
    layer = Image.new("RGBA", (w, h), accent + (0,))
    layer.putalpha(mask.point(lambda p: int(p * alpha / 255)))

    # 葉脈（中心を横切る線と、そこから斜めに数本）。штрихは持たせすぎない。
    vein = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vein)
    cx, cy = w // 2, h // 2
    span = int(w * 0.34)
    vd.line([(cx - span, cy), (cx + span, cy)], fill=accent + (int(alpha * 1.6), ), width=3)
    for t in (-0.55, -0.2, 0.2, 0.55):
        vx = cx + int(span * t)
        vd.line([(vx, cy), (vx + int(span * 0.22), cy - int(span * 0.30))],
                fill=accent + (int(alpha * 1.2),), width=2)
        vd.line([(vx, cy), (vx + int(span * 0.22), cy + int(span * 0.30))],
                fill=accent + (int(alpha * 1.2),), width=2)
    vein.putalpha(ImageChops.multiply(vein.getchannel("A"), mask))
    layer = Image.alpha_composite(layer, vein)

    layer = layer.rotate(angle, expand=True, resample=Image.BICUBIC)
    x = center[0] - layer.width // 2
    y = center[1] - layer.height // 2
    canvas.paste(layer, (x, y), layer)


def draw_specimen_label(draw, slide, top, accent, index_font, label_font):
    """植物標本のラベルのような佇まいの見出しラベル。

    丸数字（円のアウトライン＋数字）＋細い罫線＋字間を空けたラベル、という
    「図鑑・標本カード」のフォーマットに寄せている。塗りつぶしたピルより、
    実在の印刷物に近い落ち着いた見た目になる。
    """
    left = 104
    d = 64
    draw.ellipse([left, top, left + d, top + d], outline=accent, width=3)
    draw.text((left + d / 2, top + d / 2), slide["index"],
              font=index_font, fill=accent, anchor="mm")
    draw.line([(left + d + 24, top + d / 2), (left + d + 74, top + d / 2)],
              fill=accent, width=2)
    draw_tracked(draw, slide["label"], label_font, left + d + 96,
                top + d / 2 - label_font.size * 0.62, accent, 5)
    return top + d


def draw_brand_mark(canvas, draw):
    """全枚共通のブランドマーク。9枚がバラバラの掲載物ではなく、
    1つのシリーズだと分かるように、毎回同じ位置に同じ形で置く。

    ⚠️ 下部には置かないこと。端末は「下端からはみ出すぶんは切れる」設計
    （with_shadowのコメント参照）で、大きい端末だと縦の9割近くを占めるため、
    下部に固定位置を確保しようとすると（一度試したが）端末が押し上げられて
    見出しと衝突する。上部の、標本ラベルより右・端末が絶対に届かない余白
    （見出しブロックの右上）に置けば、位置調整なしで常に衝突しない。
    """
    mark_font = load_font(26, 700)
    text = "GREEN COLLECTION"
    text_w = draw.textlength(text, font=mark_font)
    leaf = leaf_mask(30, 30, r_ratio=0.62, d_ratio=0.8).rotate(-30, expand=True)
    leaf_img = Image.new("RGBA", leaf.size, INK + (200,))
    leaf_img.putalpha(ImageChops.multiply(leaf_img.getchannel("A"), leaf))

    gap = 12
    right = CANVAS[0] - 104
    top = 160
    tx = right - text_w
    canvas.paste(leaf_img, (int(tx - leaf_img.width - gap), int(top)), leaf_img)
    draw_tracked(draw, text, mark_font, int(tx), int(top - mark_font.size * 0.1),
                (0x6E, 0x6C, 0x63), 3)


def build(slide, out_dir):
    """統一した生成りの背景に、葉モチーフ・標本ラベル・端末・ブランドマークを重ねる。"""
    accent = slide["accent"]
    canvas = Image.new("RGB", CANVAS, BG).convert("RGBA")

    # 背景の葉モチーフ。右上にはみ出す位置に大きく1枚、控えめな左下にもう1枚
    paint_leaf_motif(canvas, accent, (1100, 1100), (CANVAS[0] - 120, 520), 28, 34)
    paint_leaf_motif(canvas, accent, (700, 700), (60, CANVAS[1] - 520), -18, 22)
    canvas = canvas.convert("RGB")
    draw = ImageDraw.Draw(canvas)

    label_font = load_font(30, 700)
    head_font = load_font(92, 900)
    sub_font = load_font(38, 500)
    index_font = load_font(30, 900)
    for f, lines, where in ((label_font, [slide["label"]], "ラベル"),
                            (head_font, slide["headline"], "見出し"),
                            (sub_font, slide["sub"], "説明文")):
        check_glyphs(f, lines, f"{slide['name']} の{where}")

    left = 104
    y = draw_specimen_label(draw, slide, 148, accent, index_font, label_font)
    y = draw_lines(draw, slide["headline"], head_font, y + 74, INK, 1.30,
                   left, anchor="la")
    y = draw_lines(draw, slide["sub"], sub_font, y + 30, BODY, 1.6,
                   left, anchor="la")

    device = _framer.frame(os.path.join(DOWNLOADS, slide["src"]))
    w = 1015
    device = device.resize((w, round(device.height * w / device.width)),
                           Image.LANCZOS)
    device = device.rotate(-3.4, expand=True, resample=Image.BICUBIC)
    device, pad = with_shadow(device)
    # 端末は中央寄せ。canvasの下端からはみ出すぶんは切れる（意図どおり、大きく見せる）。
    # ブランドマークは上部に置いてあるので、この配置と衝突しない。
    canvas.paste(device, ((CANVAS[0] - device.width) // 2 + 30,
                          y + 90 - pad), device)

    draw_brand_mark(canvas, draw)

    path = os.path.join(out_dir, f"{slide['name']}.png")
    canvas.save(path)
    return path


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    out_dir = os.path.abspath(sys.argv[1])
    os.makedirs(out_dir, exist_ok=True)
    for slide in SLIDES:
        print(os.path.basename(build(slide, out_dir)))
    print(f"\n{len(SLIDES)}枚を {out_dir} に出力しました（{CANVAS[0]}x{CANVAS[1]}）")


if __name__ == "__main__":
    main()
