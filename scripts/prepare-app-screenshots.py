#!/usr/bin/env python3
"""App Store掲載用スクリーンショットを /app のLP用に加工する。

App Store Connect からダウンロードした画像（1242x2688）は
  1) 見出しコピーがブランドグリーンの背景に焼き込まれている
  2) 端末のまわりもブランドグリーン (#015440) で塗られている
という状態なので、そのままではLPに置けない。
LP側はHTMLで見出しを持ち、背景も明るいナチュラル系にしているため、

  - 焼き込まれた見出しを切り落として端末部分だけにする
  - 端末のまわりの緑を、LPの背景色に塗り替える（外周からの塗りつぶしなので
    アプリ画面の中にある緑は変わらない）

の2つを行う。

Usage:
    python3 scripts/prepare-app-screenshots.py \
        screen-home=~/Downloads/0x0ss.png \
        screen-calendar='~/Downloads/0x0ss (2).png'

出力は public/images/app/<name>.png。
元画像はリポジトリに置いていないので、差し替えるときは App Store Connect から
落とし直すこと。実行後に表示される高さを src/app/app/page.tsx の
features[].height に反映すること（アスペクト比がずれると表示が崩れる）。
"""

import os
import struct
import sys
import zlib
from collections import deque

BRAND_GREEN = (0x01, 0x54, 0x40)   # スクショの背景色
PAGE_BG = (0xFA, 0xF8, 0xF4)       # LPの背景色。page.tsx の PAGE_BG と揃えること

FILL_TOL = 30      # 塗りつぶし対象とみなす、背景色からの許容差
FRINGE_TOL = 95    # 縁のアンチエイリアスを拾うときの許容差
FRINGE_PASSES = 2  # 縁を削る回数

BEZEL_DARK = 70    # R,G,Bすべてがこの値未満なら端末のベゼル
BEZEL_MIN = 300    # 端末上端とみなす、1行あたりのベゼル画素数
TOP_PAD = 30       # 端末の上に残す余白


def read_png(path):
    d = open(path, "rb").read()
    i, idat = 8, b""
    w = h = None
    while i < len(d):
        ln = struct.unpack(">I", d[i:i + 4])[0]
        typ, data = d[i + 4:i + 8], d[i + 8:i + 8 + ln]
        if typ == b"IHDR":
            w, h, bd, ct = struct.unpack(">IIBB", data[:10])
            if (bd, ct) != (8, 2):
                sys.exit(f"{path}: 8bit RGB のPNGのみ対応 (bitdepth={bd} colortype={ct})")
        elif typ == b"IDAT":
            idat += data
        i += 12 + ln
    raw = zlib.decompress(idat)
    ch, stride = 3, w * 3 + 1
    prev, rows = bytearray(w * 3), []
    for y in range(h):
        f = raw[y * stride]
        line = bytearray(raw[y * stride + 1:(y + 1) * stride])
        if f:
            for x in range(len(line)):
                a = line[x - ch] if x >= ch else 0
                b = prev[x]
                c = prev[x - ch] if x >= ch else 0
                if f == 1:
                    line[x] = (line[x] + a) & 255
                elif f == 2:
                    line[x] = (line[x] + b) & 255
                elif f == 3:
                    line[x] = (line[x] + (a + b) // 2) & 255
                else:
                    pp = a + b - c
                    pa, pb, pc = abs(pp - a), abs(pp - b), abs(pp - c)
                    pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                    line[x] = (line[x] + pr) & 255
        prev = line
        rows.append(line)
    return w, h, rows


def write_png(path, w, rows):
    raw = b"".join(b"\x00" + bytes(r) for r in rows)
    out = [b"\x89PNG\r\n\x1a\n"]
    for typ, data in (
        (b"IHDR", struct.pack(">IIBBBBB", w, len(rows), 8, 2, 0, 0, 0)),
        (b"IDAT", zlib.compress(raw, 9)),
        (b"IEND", b""),
    ):
        out.append(struct.pack(">I", len(data)) + typ + data
                   + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF))
    open(path, "wb").write(b"".join(out))


def crop_top(w, rows):
    """焼き込まれた見出しを落とし、端末の上端から始まるようにする。

    見出しの文字はクリーム色で明るく、背景は緑。端末のベゼルだけが暗いので、
    「暗い画素が一定数以上ある最初の行」を端末の上端とみなせる。
    """
    for y, r in enumerate(rows):
        dark = 0
        for x in range(0, w, 2):
            o = x * 3
            if r[o] < BEZEL_DARK and r[o + 1] < BEZEL_DARK and r[o + 2] < BEZEL_DARK:
                dark += 2
        if dark >= BEZEL_MIN:
            return max(0, y - TOP_PAD)
    return 0


def near(px, color, tol):
    return all(abs(px[k] - color[k]) <= tol for k in range(3))


def replace_background(w, h, rows):
    """外周から届く緑だけを PAGE_BG に塗り替える。

    画像の外周から4近傍で塗りつぶすので、アプリ画面の中で使われている緑
    （ボタンやロゴ）は端末のベゼルに囲まれていて到達できず、変化しない。
    """
    filled = bytearray(w * h)
    q = deque()

    def push(x, y):
        i = y * w + x
        if filled[i]:
            return
        px = rows[y][x * 3:x * 3 + 3]
        if near(px, BRAND_GREEN, FILL_TOL):
            filled[i] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                push(nx, ny)

    # 緑とベゼルの中間色（アンチエイリアス）が残ると縁が緑にふちどられるため、
    # 塗りつぶし領域に接する「緑寄り」の画素を数回だけ巻き込む。
    # ベゼルはR≈G≈Bの無彩色なので、緑優勢(G>R かつ G>B)の条件で保護できる。
    for _ in range(FRINGE_PASSES):
        add = []
        for y in range(h):
            row = rows[y]
            for x in range(w):
                i = y * w + x
                if filled[i]:
                    continue
                if not any(
                    0 <= x + dx < w and 0 <= y + dy < h and filled[(y + dy) * w + x + dx]
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
                ):
                    continue
                r, g, b = row[x * 3:x * 3 + 3]
                if g > r and g > b and near((r, g, b), BRAND_GREEN, FRINGE_TOL):
                    add.append(i)
        if not add:
            break
        for i in add:
            filled[i] = 1

    for y in range(h):
        row = rows[y]
        base = y * w
        for x in range(w):
            if filled[base + x]:
                row[x * 3:x * 3 + 3] = bytes(PAGE_BG)
    return rows


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    dest_dir = os.path.join(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))), "public", "images", "app")
    for arg in sys.argv[1:]:
        name, _, src = arg.partition("=")
        if not src:
            sys.exit(f"引数は <name>=<path> の形式で渡すこと: {arg}")
        src = os.path.expanduser(src)
        w, h, rows = read_png(src)
        rows = rows[crop_top(w, rows):]
        rows = replace_background(w, len(rows), rows)
        dest = os.path.join(dest_dir, f"{name}.png")
        write_png(dest, w, rows)
        print(f"{name}: {w}x{len(rows)}  (height: {len(rows)},)")


if __name__ == "__main__":
    main()
