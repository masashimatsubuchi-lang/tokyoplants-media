"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { OwnProduct } from "@/lib/homeStorefront";

// 自社商品のカード。写真が主役なので、文字は種類・名前・一言・価格に絞る。
// カード全体はECへのリンク。記事リンクとサイズ切り替えだけは、その上に重ねて押せるようにしている
// （aタグの入れ子を避けるため、全面リンクを下に敷き、中身は pointer-events-none にしている）。
export default function CollectionCard({
  product,
  priority = false,
}: {
  product: OwnProduct;
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);
  const variant = product.variants[active];

  return (
    <article className="group relative flex w-[80%] shrink-0 snap-start flex-col rounded-[28px] bg-white px-5 pb-6 pt-7 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_10px_34px_rgba(0,0,0,0.10)] sm:w-[58%] md:w-auto md:px-6">
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${product.name}をtokyoplantsのショップで見る`}
        className="absolute inset-0 z-0 rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352A]"
      />
      <div className="pointer-events-none relative flex flex-1 flex-col">
        <p className="text-[12px] font-semibold text-[#2c6e52]">
          {product.kind}
        </p>
        <h3 className="mt-1.5 text-[22px] font-semibold leading-[1.2] tracking-[-0.01em]">
          {product.name}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73] [word-break:auto-phrase]">
          {product.catchCopy}
        </p>

        {/* 写真。白背景の商品写真を白いカードに直接置き、輪郭だけが浮かぶように見せる */}
        <div className="relative -mx-1 mt-3 aspect-square md:mx-auto md:w-full md:max-w-[360px]">
          {product.variants.map((v, i) => (
            <Image
              key={v.image}
              src={v.image}
              alt={v.alt}
              width={1000}
              height={1000}
              sizes="(min-width: 1200px) 300px, (min-width: 768px) 45vw, 80vw"
              priority={priority && i === 0}
              loading={priority && i === 0 ? undefined : "lazy"}
              className={`absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.03] ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* 選択肢・価格・状態の行はどのカードにも同じ高さで置き、横に並べたとき価格の位置を揃える */}
        <div className="mt-auto pt-4">
          <div className="mb-3 flex h-8 items-center">
            {product.variants.length > 1 && (
              <div
                className="pointer-events-auto relative z-10 inline-flex rounded-full bg-[#f5f5f7] p-1"
                role="group"
                aria-label="容量"
              >
                {product.variants.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={`rounded-full px-3.5 py-1 text-[12px] font-semibold transition-colors ${
                      i === active
                        ? "bg-white text-[#1d1d1f] shadow-sm"
                        : "text-[#6e6e73] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
            {product.swatches && (
              <div
                className="flex flex-wrap items-center gap-1.5"
                aria-label={`全${product.swatches.length}種`}
              >
                {product.swatches.map((s) => (
                  <span
                    key={s.name}
                    title={s.name}
                    className="h-3 w-3 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: s.color }}
                  />
                ))}
                <span className="ml-1 whitespace-nowrap text-[12px] text-[#6e6e73]">
                  全{product.swatches.length}種
                </span>
              </div>
            )}
          </div>
          <p className="text-[15px] font-semibold">
            {variant.price}
            <span className="ml-1 text-[12px] font-normal text-[#6e6e73]">
              税込
            </span>
          </p>
          <p className="mt-1 min-h-[1.5em] text-[12px] text-[#6e6e73]">
            {product.status}
          </p>
          <Link
            href={product.article.href}
            className="pointer-events-auto relative z-10 mt-3 inline-block text-[13px] font-medium text-[#2c6e52] hover:underline"
          >
            {product.article.label} ›
          </Link>
        </div>
      </div>
    </article>
  );
}
