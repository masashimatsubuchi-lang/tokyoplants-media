"use client";

import { useEffect, useState } from "react";
import { currentSale, withTag, type SalePhase } from "@/lib/amazonSale";

/** 閲覧時の日時で開催中のセールを判定する（静的ページでも日付で切り替わる） */
function useSale(): SalePhase {
  const [sale, setSale] = useState<SalePhase>(null);
  useEffect(() => {
    let preview: string | null = null;
    try {
      preview = new URLSearchParams(window.location.search).get("amazonSale");
    } catch {
      preview = null;
    }
    setSale(currentSale(new Date(), preview));
  }, []);
  return sale;
}

function label(s: NonNullable<SalePhase>) {
  return s.phase === "pre" ? `${s.sale.name} 先行セール開催中` : `${s.sale.name} 開催中`;
}
function until(s: NonNullable<SalePhase>) {
  return s.phase === "pre" ? `本セールは11/30から・先行は${s.sale.preEndLabel}まで` : `${s.sale.endLabel}まで`;
}

/**
 * サイト上部の帯。セール期間中だけ出す（閉じたら同じセールの間は出さない）。
 * 期間中はアプリの案内の帯（AppPromoBanner）の代わりに出る。
 */
export function AmazonSaleStrip() {
  const sale = useSale();
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (!sale) return;
    try {
      if (localStorage.getItem(`amazon-sale-strip-${sale.sale.id}`) === "1") setClosed(true);
    } catch {
      /* 保存できない環境では毎回出す */
    }
  }, [sale]);
  if (!sale || closed) return null;
  const close = () => {
    setClosed(true);
    try {
      localStorage.setItem(`amazon-sale-strip-${sale.sale.id}`, "1");
    } catch {
      /* noop */
    }
  };
  return (
    <div className="relative flex items-center justify-center gap-2 bg-[#232f3e] px-3 py-2 text-white sm:gap-3">
      <a
        href={withTag(sale.sale.url)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-placement="sale-strip"
        className="flex min-w-0 items-center gap-2 text-[12px] sm:text-[13px]"
      >
        <span className="shrink-0 rounded bg-[#ff9900] px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#232f3e]">SALE</span>
        <span className="truncate font-bold">{label(sale)}</span>
        <span className="hidden shrink-0 text-white/70 sm:inline">（{until(sale)}）</span>
        <span className="shrink-0 font-bold text-[#ffb84d] underline underline-offset-2">会場を見る</span>
      </a>
      <button
        type="button"
        onClick={close}
        aria-label="閉じる"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 text-[16px] leading-none text-white/60 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

/** セール中はアプリ案内の帯を隠すため、開催中かどうかだけを返す */
export function useAmazonSaleActive(): boolean {
  return useSale() !== null;
}

/**
 * Amazon商品カード（amazon-cards・記事末のAmazon欄）の上に出す告知。
 * 紹介商品が値下がりしているとは言わない。対象かどうかは商品ページで確かめてもらう。
 */
export function AmazonSaleNotice() {
  const sale = useSale();
  if (!sale) return null;
  return (
    <div className="mb-3 rounded-xl bg-[#232f3e] px-3.5 py-2.5 text-white">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="rounded bg-[#ff9900] px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#232f3e]">SALE</span>
        <span className="text-[13.5px] font-bold">{label(sale)}</span>
        <span className="text-[12px] text-white/70">{until(sale)}</span>
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-white/80">
        下の商品がセール対象かどうか・価格は、Amazonの商品ページでご確認ください。
        <a
          href={withTag(sale.sale.url)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-placement="sale-notice"
          className="ml-1 font-bold text-[#ffb84d] underline underline-offset-2"
        >
          セール会場を見る
        </a>
      </p>
    </div>
  );
}
