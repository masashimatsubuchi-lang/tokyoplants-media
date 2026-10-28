#!/bin/zsh
# トップの自社商品の写真（public/images/home/*.jpg）から、軽い AVIF と小さいサイズを作る。
# 写真を足した・差し替えたら実行する。元の JPEG はそのまま残し、AVIF に対応しない古いブラウザ向けに使う。
#
#   zsh scripts/encode-home-images.sh
#
# 作るファイル（{name} は元の JPEG の名前）
#   {name}.avif       元と同じ大きさ（長辺800px）。3倍密度のスマホ向け
#   {name}-560.jpg    長辺560px。PC・2倍密度の画面向け
#   {name}-560.avif
#   src/data/home-images.json  上のファイルの有無と縦横の大きさ（CollectionCard が srcset を組むのに使う）
#
# 画質は「元の JPEG と見分けがつかない」ことを条件に自動で選ぶ。
# 0.75 から 0.05 刻みで上げ、元との明るさ（Y）の SSIM が 0.995 以上になった最初の値を使う（2026-10-28 オーナー指示「画質は落としたくない」）。
# RGB で比べないのは、AVIF は色の情報を縦横半分で持つため RGB の SSIM が 0.993 前後で頭打ちになるから。
# SOIL のラベル文字（緑地にクリーム色）を3倍に拡大して比べても、にじみは見えないことを確認済み。
# AVIF にしても元の 85% 以上の大きさになる場合は AVIF を作らない（JPEG だけで十分なため）。
# 必要なもの: Xcode のコマンドラインツール（swiftc）、ffmpeg（SSIM の計算に使う）
set -e
cd "${0:A:h}/.."
DIR=public/images/home
TMP=$(mktemp -d)
swiftc -O scripts/encode-avif.swift -o "$TMP/encode-avif" 2>/dev/null

ssim() { # $1 元, $2 比べる画像
  sips -s format png "$1" --out "$TMP/a.png" >/dev/null
  sips -s format png "$2" --out "$TMP/b.png" >/dev/null
  ffmpeg -hide_banner -i "$TMP/a.png" -i "$TMP/b.png" -lavfi "[0]format=yuv444p[a];[1]format=yuv444p[b];[a][b]ssim" -f null - 2>&1 | grep -o " Y:[0-9.]*" | cut -d: -f2
}

encode() { # $1 元 JPEG
  local src=$1 out=${1%.jpg}.avif q
  rm -f "$out"
  for q in 0.75 0.8 0.85 0.9 0.95; do
    "$TMP/encode-avif" "$src" "$TMP/x.avif" $q
    if (( $(ssim "$src" "$TMP/x.avif") >= 0.995 )); then
      if (( $(stat -f%z "$TMP/x.avif") < $(stat -f%z "$src") * 85 / 100 )); then
        cp "$TMP/x.avif" "$out"
        printf "  %-40s q%s  %4dKB → %4dKB\n" "${src:t}" $q $(( $(stat -f%z "$src") / 1024 )) $(( $(stat -f%z "$out") / 1024 ))
        return
      fi
      break
    fi
  done
  printf "  %-40s AVIFにしても軽くならないので JPEG のまま\n" "${src:t}"
}

size() { sips -g pixelWidth -g pixelHeight "$1" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{printf "\"w\": %d, \"h\": %d", w, h}'; }

json="{"
sep=""
for f in $DIR/*.jpg; do
  [[ $f == *-560.jpg ]] && continue
  small=${f%.jpg}-560.jpg
  sips -Z 560 -s formatOptions 92 "$f" --out "$small" >/dev/null
  encode "$f"
  encode "$small"
  json+="$sep\n  \"/${f#public/}\": { $(size $f), \"avif\": $([[ -f ${f%.jpg}.avif ]] && echo true || echo false), \"small\": { \"src\": \"/${small#public/}\", $(size $small), \"avif\": $([[ -f ${small%.jpg}.avif ]] && echo true || echo false) } }"
  sep=","
done
print -- "$json"$'\n'"}" > src/data/home-images.json
rm -rf "$TMP"
echo "src/data/home-images.json を書き出しました"
