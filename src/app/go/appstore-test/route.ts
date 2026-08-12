import { NextResponse } from "next/server";

// 検証用（/app/link-test の2番）。
// Adjustと同じく、自ドメインで一度受けてから302でApp Storeへ転送する。
// ホップを挟むこと自体に効果があるのかを確かめるためのもの。
//
// 動的セグメントの /go/[channel] より、この固定パスが優先される。
// 結論が出たら link-test ごと削除する。
export function GET() {
  return NextResponse.redirect(
    "https://apps.apple.com/app/id6790673876?mt=8",
    302,
  );
}
