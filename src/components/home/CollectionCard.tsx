"use client";

import Image from "next/image";
import { useState } from "react";
import type { OwnProduct } from "@/lib/homeStorefront";
import { trackEvent } from "@/lib/track";

// 自社商品のカード。Apple Storeの商品カードにならい、文字は種類・名前・一言・価格だけにして
// 写真を下半分に大きく置く。カードのどこを押してもECの商品ページへ行く。
//
// 種類違いのある商品は、写真の下で切り替えられる。
//   color: 色の丸をタップすると、その色の写真に切り替わる（タオル、SISHICRAFTの鉢植え／キーホルダー）
//   size:  容量のボタンで写真と価格が切り替わる（SOILの2L／10L）
// どちらも、別の商品ページに分かれている種類は切り替えるとリンク先も変わる。
// 切り替えのボタンは全面リンクの上に重ねて押せるようにしている。
export default function CollectionCard({
  product,
  priority = false,
}: {
  product: OwnProduct;
  priority?: boolean;
}) {
  const variants = product.variants ?? [];
  const [active, setActive] = useState(0);
  const variant = variants[active];
  const image = variant?.image ?? product.image;
  const alt = variant?.alt ?? product.alt;
  const price = variant?.price ?? product.price;
  const href = variant?.href ?? product.href;

  // どの色・容量が見られているかを計測する。GA4に登録済みのカスタムディメンション placement に
  // 「collection-{商品}:{種類名}」の形で載せる（新しいディメンションの登録は管理者権限が要るため）
  const select = (i: number) => {
    setActive(i);
    if (i !== active) trackEvent("home_variant_select", { placement: `collection-${product.id}:${variants[i].name}` });
  };

  return (
    <article className="group relative flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)] sm:w-[58%] md:w-auto">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${product.name}をtokyoplantsのショップで見る`}
        className="absolute inset-0 z-0 rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352A]"
      />
      <div className="pointer-events-none relative flex flex-1 flex-col">
        <div className="px-6 pt-7 md:px-7 md:pt-8">
          <p className="text-[12px] font-semibold text-[#2c6e52]">
            {product.kind}
          </p>
          <h3 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] xl:text-[24px]">
            {product.name}
          </h3>
          <p className="mt-3 text-balance text-[14px] font-semibold leading-snug [word-break:auto-phrase]">
            {product.catchCopy}
          </p>
          <p className="mt-2 text-[14px] text-[#1d1d1f]">{price}</p>
        </div>

        {/* 写真はカードの下端に寄せ、文字の行数が違っても4枚の写真の位置が揃うようにする */}
        <div className="mt-auto px-3 pb-5 pt-6">
          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <Image
              key={image}
              src={image}
              alt={alt}
              width={800}
              height={800}
              sizes="(min-width: 1280px) 270px, (min-width: 768px) 45vw, 82vw"
              priority={priority && active === 0}
              className="h-full w-full origin-bottom object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          {/* 切り替えの行は、ボタンの無いカードにも同じ高さで空けておく（写真の位置を4枚で揃えるため） */}
          <div className="mt-4 flex h-[34px] items-center justify-center">
            {product.variantStyle === "size" && variants.length > 1 && (
              <div className="flex justify-center">
                <div
                  className="pointer-events-auto relative z-10 inline-flex rounded-full bg-[#f5f5f7] p-1"
                  role="group"
                  aria-label="容量"
                >
                  {variants.map((v, i) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => select(i)}
                      aria-pressed={i === active}
                      className={`rounded-full px-4 py-1 text-[12px] font-semibold transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352A] ${
                        i === active
                          ? "bg-white text-[#1d1d1f] shadow-sm"
                          : "text-[#6e6e73] hover:text-[#1d1d1f]"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variantStyle === "color" && variants.length > 1 && (
              <div
                className="pointer-events-auto relative z-10 flex justify-center gap-2"
                role="group"
                aria-label={`カラー（全${variants.length}種）`}
              >
                {variants.map((v, i) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => select(i)}
                    aria-pressed={i === active}
                    aria-label={v.name}
                    title={v.name}
                    // 選択中の色は外側に細い輪をつける（Apple Storeの色選びと同じ見せ方）。
                    // 丸は22pxのまま、before で上下左右に押せる範囲を足して指で押しやすくする（丸どうしの隙間で左右に分け合う）
                    className={`relative flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full transition before:absolute before:-inset-x-[4px] before:-inset-y-[11px] before:content-[''] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16352A] ${
                      i === active
                        ? "ring-[1.5px] ring-[#1d1d1f] ring-offset-2"
                        : "hover:ring-1 hover:ring-black/25 hover:ring-offset-2"
                    }`}
                  >
                    <span
                      className="h-full w-full rounded-full ring-1 ring-inset ring-black/15"
                      style={{ background: v.color }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
