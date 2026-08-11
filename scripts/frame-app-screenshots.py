#!/usr/bin/env python3
"""iPhoneの生スクリーンショットを、端末の枠にはめた画像に加工する。

/app のLPで使う端末画像を作る。以前は App Store Connect 用の宣伝画像
（見出しが焼き込まれ、背景がブランドグリーンで塗られたもの）を切り抜いて
使っていたが、見出しの二重表示や背景色の縛りが発生するため、
生のスクリーンショットから枠を合成する方式に変えた。

出力はRGBA（枠の外は透明）。背景を透明にしておくと、LPのどのセクションに
置いても浮かないうえ、CSSのdrop-shadowで影を付けられる。
透明部分にも枠の色を残しているので、縮小時に縁が白く滲むこともない。

必要なもの: Pillow
    python3 -m venv .venv && .venv/bin/pip install Pillow

Usage:
    .venv/bin/python scripts/frame-app-screenshots.py \\
        screen-watering=~/Downloads/IMG_3985.PNG \\
        screen-home=~/Downloads/IMG_3981.PNG

出力は public/images/app/<name>.png。
実行すると、src/app/app/page.tsx の features[].height に入れる値が表示される。
"""

import os
import sys

from PIL import Image, ImageDraw

# 入力（iPhone 16 Pro の 1260x2736）を基準にした寸法。
# 他の機種のスクショでも、幅に対する比率で換算するので破綻しない。
REF_WIDTH = 1260
SCREEN_RADIUS = 172   # 画面の角丸
BEZEL = 26            # 画面を囲む黒縁
EDGE = 12             # いちばん外側の金属フレーム
BEZEL_COLOR = (16, 16, 20)
EDGE_COLOR = (85, 82, 90)

OUTPUT_WIDTH = 900    # LPでの表示は最大290px程度。3倍あれば足りる
SUPERSAMPLE = 4       # 角丸マスクのアンチエイリアス用


def rounded_mask(size, radius):
    """アンチエイリアスの効いた角丸マスクを作る。

    ImageDraw の rounded_rectangle は角がギザつくので、
    4倍で描いてから縮小して滑らかにする。
    """
    big = (size[0] * SUPERSAMPLE, size[1] * SUPERSAMPLE)
    mask = Image.new("L", big, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, big[0] - 1, big[1] - 1), radius=radius * SUPERSAMPLE, fill=255
    )
    return mask.resize(size, Image.LANCZOS)


def frame(src_path):
    shot = Image.open(src_path).convert("RGB")
    # 入力の解像度に合わせて各寸法を換算する
    k = shot.width / REF_WIDTH
    bezel, edge = round(BEZEL * k), round(EDGE * k)
    r_screen = round(SCREEN_RADIUS * k)
    pad = bezel + edge
    r_bezel = r_screen + bezel
    r_outer = r_bezel + edge

    comp_size = (shot.width + pad * 2, shot.height + pad * 2)

    # いちばん外側の金属フレーム色で塗りつぶし、その内側に黒縁を重ねる。
    # 透明にする部分にもこの色が残るので、縮小時に縁が滲まない。
    comp = Image.new("RGB", comp_size, EDGE_COLOR)
    comp.paste(
        Image.new("RGB", (shot.width + bezel * 2, shot.height + bezel * 2), BEZEL_COLOR),
        (edge, edge),
        rounded_mask((shot.width + bezel * 2, shot.height + bezel * 2), r_bezel),
    )
    comp.paste(shot, (pad, pad), rounded_mask(shot.size, r_screen))

    comp.putalpha(rounded_mask(comp_size, r_outer))

    out_h = round(OUTPUT_WIDTH * comp_size[1] / comp_size[0])
    return comp.resize((OUTPUT_WIDTH, out_h), Image.LANCZOS)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    dest_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "public", "images", "app",
    )
    for arg in sys.argv[1:]:
        name, _, src = arg.partition("=")
        if not src:
            sys.exit(f"引数は <name>=<path> の形式で渡すこと: {arg}")
        out = frame(os.path.expanduser(src))
        dest = os.path.join(dest_dir, f"{name}.png")
        out.save(dest, optimize=True)
        print(f"{name}: {out.width}x{out.height}  → height: {out.height},")


if __name__ == "__main__":
    main()
