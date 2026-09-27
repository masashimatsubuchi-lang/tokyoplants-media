import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const CATEGORY_LABELS: Record<string, string> = {
  guide: "育て方ガイド",
  soil: "土・用土",
  species: "植物図鑑",
  research: "調査・研究",
  review: "レビュー",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "tokyoplants media";
  const category = searchParams.get("category") ?? "";
  const categoryLabel = CATEGORY_LABELS[category] ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f1a10",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 背景の葉モチーフ（シンプルな装飾） */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            borderRadius: "0 0 0 100%",
            backgroundColor: "#1a3320",
            opacity: 0.5,
          }}
        />

        {/* カテゴリバッジ */}
        {categoryLabel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#4a7c59",
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: 700,
                padding: "8px 20px",
                borderRadius: "100px",
                letterSpacing: "0.05em",
              }}
            >
              {categoryLabel}
            </div>
          </div>
        )}

        {/* タイトル */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          <div
            style={{
              color: "#f0f7f1",
              fontSize: title.length > 30 ? "46px" : "56px",
              fontWeight: 800,
              lineHeight: 1.4,
              maxWidth: "900px",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
        </div>

        {/* フッター：ブランド */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #2d4a35",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* ロゴ的な丸 */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#4a7c59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: 800,
                }}
              >
                t
              </div>
            </div>
            <div
              style={{
                color: "#a8c5b0",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              tokyoplants media
            </div>
          </div>
          <div
            style={{
              color: "#4a7c59",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            media.tokyoplants.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
