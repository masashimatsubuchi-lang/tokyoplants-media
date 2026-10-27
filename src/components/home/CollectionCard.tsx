"use client";

import Image from "next/image";
import { useState } from "react";
import type { OwnProduct } from "@/lib/homeStorefront";

// 自社商品のカード。Apple Storeの商品カードにならい、文字は種類・名前・一言・価格だけにして
// 写真を下半分に大きく置く。カードのどこを押してもECの商品ページへ行く。
//
// 柄が複数ある商品（タオル）は、写真の下の小さな見本で他の柄を見られる。
// PCは見本に乗せている間だけ、スマホはタップでその柄を表示し、
// PCでカードから外れたら代表の柄（variants[0]）に戻す。
// 見本のボタンは全面リンクの上に重ねて押せるようにしている。
export default function CollectionCard({ product, priority = false }: { product: OwnProduct; priority?: boolean }) {
  const variants = product.variants ?? [];
  const [active, setActive] = useState(0);
  const shown = variants[active] ?? { image: product.image, alt: product.alt, name: product.name };

  return (
    <article
      onMouseLeave={() => setActive(0)}
      className="group relative flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)] sm:w-[58%] md:w-auto"
    >
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${product.name}をtokyoplantsのショップで見る`}
        className="absolute inset-0 z-0 rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352A]"
      />
      <div className="pointer-events-none relative flex flex-1 flex-col">
        <div className="px-6 pt-7 md:px-7 md:pt-8">
          <p className="text-[12px] font-semibold text-[#2c6e52]">{product.kind}</p>
          <h3 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] xl:text-[24px]">{product.name}</h3>
          <p className="mt-3 text-balance text-[14px] font-semibold leading-snug [word-break:auto-phrase]">{product.catchCopy}</p>
          <p className="mt-2 text-[14px] text-[#1d1d1f]">{product.price}</p>
        </div>

        {/* 写真はカードの下端に寄せ、文字の行数が違っても4枚の写真の位置が揃うようにする */}
        <div className="mt-auto px-3 pb-4 pt-6">
          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <Image
              key={shown.image}
              src={shown.image}
              alt={shown.alt}
              width={800}
              height={800}
              sizes="(min-width: 1280px) 270px, (min-width: 768px) 45vw, 82vw"
              priority={priority && active === 0}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          {variants.length > 1 && (
            <div className="pointer-events-auto relative z-10 mt-2 flex justify-center gap-1" role="group" aria-label={`柄を見る（全${variants.length}種）`}>
              {variants.map((v, i) => (
                <button
                  key={v.image}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={v.name}
                  title={v.name}
                  className={`h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full bg-white ring-1 transition ${
                    i === active ? "ring-2 ring-[#1d1d1f]" : "ring-black/10 hover:ring-black/30"
                  }`}
                >
                  <Image src={v.thumb} alt="" width={64} height={64} loading="lazy" className="h-full w-full scale-125 object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
