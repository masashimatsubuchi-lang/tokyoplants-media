import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "baseec-img-mng.akamaized.net" },
    ],
  },
  async redirects() {
    return [
      // 2026-06-28 commit 3553f09 でカテゴリ移動した記事の旧URLリダイレクト
      { source: "/guide/grow-light-electricity-cost", destination: "/research/grow-light-electricity-cost", permanent: true },
      { source: "/guide/houseplant-fertilizer-guide", destination: "/research/houseplant-fertilizer-guide", permanent: true },
      { source: "/guide/houseplant-grow-light-guide", destination: "/research/houseplant-grow-light-guide", permanent: true },
      { source: "/guide/food-waste-processor-comparison", destination: "/review/food-waste-processor-comparison", permanent: true },
      { source: "/guide/houseplant-pest-control-tools", destination: "/review/houseplant-pest-control-tools", permanent: true },
      { source: "/guide/platycerium-mounting-board-cork", destination: "/review/platycerium-mounting-board-cork", permanent: true },
      // 2026-07-06 重複記事統合に伴う旧URLリダイレクト
      { source: "/soil/houseplant-soil-smell-causes", destination: "/soil/soil-smell-causes", permanent: true },
      { source: "/soil/how-to-dispose-soil", destination: "/soil/how-to-dispose-houseplant-soil", permanent: true },
      { source: "/soil/soilless-houseplant-growing", destination: "/soil/growing-houseplants-without-soil", permanent: true },
      { source: "/guide/root-rot-recovery-complete-guide", destination: "/guide/root-rot-causes-and-recovery", permanent: true },
      { source: "/guide/summer-houseplant-care", destination: "/guide/summer-houseplant-care-guide", permanent: true },
      { source: "/guide/houseplant-sunburn-causes-and-recovery", destination: "/guide/sunburn-houseplants", permanent: true },
    ];
  },
};

export default nextConfig;
