import { NextResponse } from "next/server";

// 検証用（/app/link-test の変種F）。
// 外部の計測ツールと同じく、自ドメインで一度受けてから App Store へ転送する。
// ホップを1つ挟むこと自体に意味があるのかを確かめるためのもの。
//
// 動的セグメントの /go/[channel] より、この固定パスが優先される。
// 原因が確定したら link-test ごと消してよい。
export function GET() {
  return NextResponse.redirect(
    "https://apps.apple.com/app/id6790673876?mt=8",
    302,
  );
}
