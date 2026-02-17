import Link from "next/link";
import Image from "next/image";
import { PostMeta } from "@/lib/posts";
import ArticleCard from "./ArticleCard";

interface GenusGroup {
  genusPost: PostMeta;
  speciesPosts: PostMeta[];
}

export default function SpeciesDirectory({ posts }: { posts: PostMeta[] }) {
  // 属ページと種ページを分離
  const genusPosts = posts.filter((p) => p.slug.startsWith("genus-"));
  const speciesPosts = posts.filter((p) => !p.slug.startsWith("genus-"));

  // 属名 → GenusGroup のマップを構築
  const genusMap = new Map<string, GenusGroup>();
  for (const gp of genusPosts) {
    const genusKey = gp.slug.replace("genus-", "");
    genusMap.set(genusKey, { genusPost: gp, speciesPosts: [] });
  }

  // 種ページを属に振り分け
  const orphanPosts: PostMeta[] = [];
  for (const sp of speciesPosts) {
    if (sp.genus && genusMap.has(sp.genus)) {
      genusMap.get(sp.genus)!.speciesPosts.push(sp);
    } else {
      orphanPosts.push(sp);
    }
  }

  // 属グループを品種数順（多い順）でソート
  const genusGroups = Array.from(genusMap.values()).sort(
    (a, b) => b.speciesPosts.length - a.speciesPosts.length || a.genusPost.title.localeCompare(b.genusPost.title)
  );

  // 属名を title から抽出（「〇〇属とは｜...」→「〇〇属」）
  const getGenusName = (title: string) => {
    const match = title.match(/^(.+?属)/);
    return match ? match[1] : title.split("｜")[0];
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">植物図鑑</h1>
      <p className="mt-2 text-gray-500">属ごとに観葉植物の特徴・品種・育て方を解説</p>

      {/* 属カードグリッド */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {genusGroups.map(({ genusPost, speciesPosts: species }) => (
          <Link
            key={genusPost.slug}
            href={`/species/${genusPost.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:border-teal-200 hover:shadow-md"
          >
            <div className="relative aspect-[3/2] bg-gray-100">
              {genusPost.image && (
                <Image
                  src={genusPost.image}
                  alt={genusPost.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                {getGenusName(genusPost.title)}
              </h2>
              <p className="mt-1 text-[13px] text-gray-400 line-clamp-2">
                {genusPost.description}
              </p>
              {species.length > 0 && (
                <p className="mt-2 text-xs font-semibold text-teal-600">
                  {species.length}品種の図鑑あり
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* genus に属さない種ページ */}
      {orphanPosts.length > 0 && (
        <>
          <div className="mt-14 mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm font-semibold text-gray-400">その他の植物図鑑</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {orphanPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
