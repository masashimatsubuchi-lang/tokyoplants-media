#!/usr/bin/env python3
"""Green Collection の Meta広告クリエイティブを、LPの素材から組み直す。

/app のLPで使っている端末画像（public/images/app/screen-*.png）と
機能紹介動画（public/videos/*.mp4）をそのまま広告の版面に流用する。
新しく撮り下ろさず、LPで検証済みの画面とコピーを使うのが前提。

出力は ads/app/ 以下。
    静止画: <key>-<ratio>.jpg               … そのまま入稿できる
    動画  : <key>-<ratio>-overlay.png       … 背景・見出し・端末フレーム（画面部分は透明）
            video-jobs.json                 … 下の Swift スクリプトへの指示書

動画は Pillow では書き出せないので、画面の穴が空いたオーバーレイだけをここで作り、
LPの mp4 をその穴にはめ込む合成は scripts/make-ad-video.swift（AVFoundation）が行う。
版面の計算をこちらに寄せておくと、文字まわりの調整がPillowだけで完結する。

必要なもの: Pillow
    python3 -m venv .venv && .venv/bin/pip install Pillow

Usage:
    .venv/bin/python ads/make-app-ads.py
    swift scripts/make-ad-video.swift ads/app/video-jobs.json
"""

import json
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, "public/images/app")
VIDEOS = os.path.join(ROOT, "public/videos")
OUT = os.path.join(ROOT, "ads/app")

# LP（src/app/app/page.tsx）と同じ配色。広告からLPに着地したときに同じ色でつながる。
BG = (250, 248, 244)        # #FAF8F4
HEAD = (22, 53, 42)         # #16352A
BODY = (92, 90, 82)         # #5C5A52
MUTED = (110, 108, 99)      # #6E6C63
PILL_BG = (232, 240, 232)
PILL_FG = (47, 107, 82)     # #2F6B52

FONT_BOLD = "/System/Library/Fonts/ヒラギノ角ゴシック W7.ttc"
FONT_MED = "/System/Library/Fonts/ヒラギノ角ゴシック W5.ttc"
FONT_REG = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"

SUPERSAMPLE = 4

# 端末フレームの寸法。scripts/frame-app-screenshots.py と同じ比率を使う。
# 生のスクショ（1260幅）に対して黒縁26・金属フレーム12・画面の角丸172。
REF_SCREEN_W = 1260
REF_BEZEL = 26
REF_EDGE = 12
REF_RADIUS = 172
REF_TOTAL_W = REF_SCREEN_W + 2 * (REF_BEZEL + REF_EDGE)
BEZEL_COLOR = (16, 16, 20)
EDGE_COLOR = (85, 82, 90)

# 既にフレームを合成済みのLP用スクショ（透過PNG）の実寸
SHOT_W, SHOT_H = 900, 1894

FREE_NOTE = "3株までずっと無料"

# 版面。Reelsは上14%・下20%にUIが重なるため、文字はすべてその内側に置く。
# 端末は下の安全域に食い込ませて断ち切る（絵は隠れても意味が壊れないため）。
LAYOUTS = {
    "9x16": dict(
        size=(1080, 1920),
        lockup_y=300, icon=84, lockup_size=26,
        head_y=418, head_size=62, head_lh=90,
        sub_gap=42, sub_size=30, sub_lh=48,
        pill_gap=34, pill_size=27,
        dev_gap=54, dev_w=660, dev_max_bottom=1990,
    ),
    "4x5": dict(
        size=(1080, 1350),
        lockup_y=92, icon=76, lockup_size=24,
        head_y=190, head_size=58, head_lh=84,
        sub_gap=36, sub_size=29, sub_lh=46,
        pill_gap=30, pill_size=26,
        dev_gap=44, dev_w=610, dev_max_bottom=1420,
    ),
}

MARGIN = 84


def font(path, size):
    return ImageFont.truetype(path, size)


def rounded_mask(size, radius):
    """角がギザつかない角丸マスク。4倍で描いてから縮小する。"""
    big = (max(size[0] * SUPERSAMPLE, 1), max(size[1] * SUPERSAMPLE, 1))
    mask = Image.new("L", big, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, big[0] - 1, big[1] - 1), radius=radius * SUPERSAMPLE, fill=255
    )
    return mask.resize(size, Image.LANCZOS)


def tracked_text(draw, pos, text, fnt, fill, tracking):
    """字間を空けて描く。小さいラベルは詰まって見えるため。"""
    x, y = pos
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x - tracking


def device_shadow(canvas, box, radius):
    """端末の下に柔らかい影を落とす。平置きに見えないよう少し下にずらす。"""
    x, y, w, h = box
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shadow.paste((26, 40, 32, 78), (0, 0), rounded_mask((w, h), radius))
    layer.paste(shadow, (x, y + 26), shadow)
    layer = layer.filter(ImageFilter.GaussianBlur(34))
    return Image.alpha_composite(canvas, layer)


def draw_header(canvas, lay, concept):
    """ロックアップ・見出し・説明・無料表記までを描き、端末を置くY座標を返す。"""
    d = ImageDraw.Draw(canvas)

    icon = Image.open(os.path.join(SHOTS, "app-icon.png")).convert("RGBA")
    icon = icon.resize((lay["icon"], lay["icon"]), Image.LANCZOS)
    icon.putalpha(rounded_mask(icon.size, int(lay["icon"] * 0.23)))
    canvas.paste(icon, (MARGIN, lay["lockup_y"]), icon)

    f_lock = font(FONT_MED, lay["lockup_size"])
    tracked_text(
        d,
        (MARGIN + lay["icon"] + 22, lay["lockup_y"] + lay["icon"] // 2 - lay["lockup_size"] // 2 - 2),
        "GREEN COLLECTION", f_lock, MUTED, 3.4,
    )

    f_head = font(FONT_BOLD, lay["head_size"])
    y = lay["head_y"]
    for line in concept["head"]:
        d.text((MARGIN, y), line, font=f_head, fill=HEAD)
        y += lay["head_lh"]

    y += lay["sub_gap"] - lay["head_lh"] + lay["head_size"]
    f_sub = font(FONT_REG, lay["sub_size"])
    for line in concept["sub"]:
        d.text((MARGIN, y), line, font=f_sub, fill=BODY)
        y += lay["sub_lh"]

    y += lay["pill_gap"] - lay["sub_lh"] + lay["sub_size"]
    f_pill = font(FONT_MED, lay["pill_size"])
    tw = d.textlength(FREE_NOTE, font=f_pill)
    ph = int(lay["pill_size"] * 2.0)
    d.rounded_rectangle(
        (MARGIN, y, MARGIN + tw + lay["pill_size"] * 1.8, y + ph),
        radius=ph // 2, fill=PILL_BG,
    )
    d.text((MARGIN + lay["pill_size"] * 0.9, y + ph // 2 - lay["pill_size"] * 0.72),
           FREE_NOTE, font=f_pill, fill=PILL_FG)

    return y + ph + lay["dev_gap"]


def place_framed_shot(canvas, lay, shot_path, top, wide=False):
    """フレーム合成済みのLP用スクショを置く。縦長は下に断ち切る。"""
    shot = Image.open(shot_path).convert("RGBA")
    if wide:
        # 横長のウィジェットカード。縦長の端末と同じ扱いで下に断ち切ると
        # 下が間延びするため、残りの領域の中央に置く。
        w = min(960, lay["size"][0] - MARGIN * 2)
        h = int(shot.height * w / shot.width)
        x = (lay["size"][0] - w) // 2
        top = top + max(0, (lay["size"][1] - top - MARGIN - h) // 2)
        canvas = device_shadow(canvas, (x, top, w, h), int(w * 0.045))
    else:
        w = lay["dev_w"]
        h = int(shot.height * w / shot.width)
        x = (lay["size"][0] - w) // 2
        canvas = device_shadow(canvas, (x, top, w, min(h, lay["size"][1] - top)), int(w * 0.09))
    shot = shot.resize((w, h), Image.LANCZOS)
    canvas.paste(shot, (x, top), shot)
    return canvas




def place_device(canvas, lay, top, src_ratio, screen_img=None):
    """端末フレームを描く。

    screen_img を渡せばその画像を画面にはめ込み（静止画用）、
    渡さなければ画面部分をくり抜いて透明にする（動画のオーバーレイ用）。
    src_ratio は中身の 高さ/幅。返り値は画面の矩形（左上原点）。
    """
    dev_w = lay["dev_w"]
    k = dev_w / REF_TOTAL_W
    edge = REF_EDGE * k
    bezel = REF_BEZEL * k
    screen_w = int(REF_SCREEN_W * k)
    screen_h = int(screen_w * src_ratio)
    dev_h = int(screen_h + 2 * (edge + bezel))
    x = (lay["size"][0] - dev_w) // 2

    canvas = device_shadow(
        canvas, (x, top, dev_w, min(dev_h, lay["size"][1] - top)), int(dev_w * 0.09)
    )

    dev = Image.new("RGBA", (dev_w, dev_h), (0, 0, 0, 0))
    dev.paste(
        EDGE_COLOR + (255,), (0, 0),
        rounded_mask((dev_w, dev_h), int((REF_RADIUS + REF_BEZEL + REF_EDGE) * k)),
    )
    inner = (int(dev_w - 2 * edge), int(dev_h - 2 * edge))
    bez = Image.new("RGBA", inner, (0, 0, 0, 0))
    bez.paste(BEZEL_COLOR + (255,), (0, 0), rounded_mask(inner, int((REF_RADIUS + REF_BEZEL) * k)))
    dev.paste(bez, (int(edge), int(edge)), bez)

    hole = (screen_w, screen_h)
    hole_mask = rounded_mask(hole, int(REF_RADIUS * k))
    hx, hy = int(edge + bezel), int(edge + bezel)

    if screen_img is not None:
        screen = screen_img.convert("RGB").resize(hole, Image.LANCZOS).convert("RGBA")
        screen.putalpha(hole_mask)
        dev.paste(screen, (hx, hy), screen)

    canvas.paste(dev, (x, top), dev)
    sx, sy = x + hx, top + hy

    if screen_img is None:
        # 画面を透明にする。dev側で透明にしても、canvasへpaste(mask=dev)した時点で
        # 下地の背景が残ってしまうため、合成後のcanvasのalphaを直接書き換える。
        box = (sx, sy, sx + hole[0], sy + hole[1])
        region = canvas.crop(box)
        region.putalpha(Image.composite(Image.new("L", hole, 0), region.getchannel("A"), hole_mask))
        canvas.paste(region, (sx, sy))

    return canvas, (sx, sy, hole[0], hole[1])


# 素材とコピーはすべて /app のLP（src/app/app/page.tsx）から流用している。
# shot   … フレーム合成済みのLP用スクショ（public/images/app/）
# video  … LPの機能紹介動画（public/videos/）。poster は静止画版の画面として使う
CONCEPTS = [
    dict(
        key="falling", video="hero-falling.mp4", poster="hero-falling-poster.jpg",
        head=["開くたびに、", "植物が降ってくる。"],
        sub=["育てている植物が、画面の中に集まる。", "お世話が、そのままコレクションになる。"],
        ratios=["9x16", "4x5"],
    ),
    dict(
        key="health", video="feature-ai-health-check.mp4",
        poster="feature-ai-health-check-poster.jpg",
        head=["気になる症状も、", "写真でAIに相談。"],
        sub=["葉が黄色い、元気がない。写真を送ると", "考えられる原因と、次に試すことがわかる。"],
        ratios=["9x16", "4x5"],
    ),
    dict(
        key="ai-draft", video="feature-ai-draft.mp4", poster="feature-ai-draft-poster.jpg",
        head=["撮るだけで、", "図鑑クオリティ。"],
        sub=["AIが品種名から水やり頻度まで下書き。", "1,000種以上のデータから選ぶことも。"],
        ratios=["9x16", "4x5"], max_seconds=10.0,
    ),
    dict(
        key="light", video="feature-light-meter.mp4", poster="feature-light-meter-poster.jpg",
        head=["その場所の明るさ、", "写すだけで測れる。"],
        sub=["葉っぱを3秒写すだけで、lux換算。", "この植物に合っているかがその場でわかる。"],
        ratios=["9x16"],
    ),
    dict(
        key="watering", shot="screen-watering.png",
        head=["今日水やりをする植物が、", "ひと目でわかる。"],
        sub=["今日・明日・それ以降に自動でまとまる。", "ダブルタップで、その場で記録。"],
        ratios=["9x16", "4x5"],
    ),
    dict(
        key="collection", shot="screen-collection.png",
        head=["植物のお世話が、", "コレクションになる。"],
        sub=["観葉植物の専門店がつくった、", "育てる楽しさが続くアプリ。"],
        ratios=["9x16", "4x5"],
    ),
    dict(
        key="characters", shot="screen-characters.png",
        head=["ひとりで育てない。", "8体のなかまたち。"],
        sub=["応援担当のブルーム、植物博士のラム。", "それぞれの担当から毎日ひとことずつ。"],
        ratios=["9x16", "4x5"],
    ),
    dict(
        key="summary", shot="screen-summary.png",
        head=["がんばった分が、", "数字になる。"],
        sub=["今月の水やり回数、お世話の合計、使ったお金。", "予算を決めれば、使いすぎも防げます。"],
        ratios=["4x5"],
    ),
    dict(
        key="widget", shot="screen-widget.png", wide=True,
        head=["ウィジェットで、", "今日のお世話がわかる。"],
        sub=["ホーム画面に置くだけ。「ぜんぶ」をタップすれば", "アプリを開かずまとめて記録完了。"],
        ratios=["4x5"],
    ),
]


def render_static(concept, ratio):
    lay = LAYOUTS[ratio]
    canvas = Image.new("RGBA", lay["size"], BG + (255,))
    top = draw_header(canvas, lay, concept)

    if concept.get("shot"):
        # LP用スクショは端末フレームを合成済みなので、そのまま置くだけでよい
        canvas = place_framed_shot(
            canvas, lay, os.path.join(SHOTS, concept["shot"]), top,
            wide=concept.get("wide", False),
        )
    else:
        # 動画しかない機能は、LPのポスター画像（生の画面）にフレームを描いて使う
        poster = Image.open(os.path.join(VIDEOS, concept["poster"]))
        canvas, _ = place_device(canvas, lay, top, poster.height / poster.width, poster)

    out = os.path.join(OUT, f"{concept['key']}-{ratio}.jpg")
    canvas.convert("RGB").save(out, quality=92, subsampling=1)
    return out


def render_video_overlay(concept, ratio):
    lay = LAYOUTS[ratio]
    poster = Image.open(os.path.join(VIDEOS, concept["poster"]))
    canvas = Image.new("RGBA", lay["size"], BG + (255,))
    top = draw_header(canvas, lay, concept)
    canvas, screen = place_device(canvas, lay, top, poster.height / poster.width)
    out = os.path.join(OUT, f"{concept['key']}-{ratio}-overlay.png")
    canvas.save(out)
    return dict(
        video=os.path.join(VIDEOS, concept["video"]),
        overlay=out,
        out=os.path.join(OUT, f"{concept['key']}-{ratio}.mp4"),
        canvas=list(lay["size"]),
        screen=list(screen),
        maxSeconds=concept.get("max_seconds", 15.0),
        source=[poster.width, poster.height],
    )


def main():
    os.makedirs(OUT, exist_ok=True)
    jobs = []
    for concept in CONCEPTS:
        for ratio in concept["ratios"]:
            print("静止画 ", os.path.relpath(render_static(concept, ratio), ROOT))
            if concept.get("video"):
                job = render_video_overlay(concept, ratio)
                jobs.append(job)
                # 拡大率が大きいと画面の文字が甘くなる。素材の作り直し判断に使う
                scale = job["screen"][2] / job["source"][0]
                mark = "  ⚠️ 拡大率が高い" if scale > 1.15 else ""
                print(f"  動画待ち {os.path.relpath(job['out'], ROOT)}  ×{scale:.2f}{mark}")

    with open(os.path.join(OUT, "video-jobs.json"), "w") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    print(f"\n{len(jobs)}件の動画ジョブを ads/app/video-jobs.json に書き出した。次を実行:")
    print("    swift scripts/make-ad-video.swift ads/app/video-jobs.json")


if __name__ == "__main__":
    main()
