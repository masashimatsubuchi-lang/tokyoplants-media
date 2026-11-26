/*
 * tokyoplants ショップ（BASE）のフッター・ABOUT・FAQ・メンバーシップ・コミュニティを整えるスクリプト。
 * BASE のテーマは 15万字の上限に近いので、ページの作り替えはここ（media の public/shop/pages.js）で行い、
 * テーマには読み込みの1行だけを置く。
 *
 * 方針（2026-10-30）
 * - 文章の元は BASE の管理画面にあるもの（ショップ紹介文・デザイン設定の FAQ・メンバーシップの説明）をそのまま使い、
 *   ここでは要約・図・表・トグルを足すだけ。元の文章は消さずにトグルの中へ移す（オーナーが管理画面で直せるように）
 * - ここに書く事実は、ABOUT・FAQ・特定商取引法に基づく表記・購入画面で確認できたものだけ
 * - 読み込みに失敗しても、BASE の元のページがそのまま表示される
 */
(function () {
  if (window.__tpPages) return;
  window.__tpPages = true;

  var base = (location.pathname.match(/^\/shop_preview\/[^/]+/) || [''])[0];
  var path = location.pathname.slice(base.length) || '/';
  var MEDIA = 'https://media.tokyoplants.com';
  var IG = 'https://www.instagram.com/tokyoplants.jp';

  var ICON = {
    truck: '<path d="M2.5 6.5h11v9h-11z"/><path d="M13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/>',
    box: '<path d="M3 7.5 12 3.5l9 4v9l-9 4-9-4z"/><path d="M3 7.5l9 4 9-4M12 11.5v9"/>',
    chat: '<path d="M4 5h16v11H9.5L5 19.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    tree: '<path d="M12 3 17.5 10H15l4 6H5l4-6H6.5z"/><path d="M12 16v5"/>',
    cart: '<path d="M3 4h2.5l2 11h10.5l2-8H6.4"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M9 9.5h4.5a2 2 0 010 4H9M9 9.5V16"/>',
    home: '<path d="M4 11 12 4.5l8 6.5"/><path d="M6.5 9.5V20h11V9.5"/>',
    shield: '<path d="M12 3.5 19.5 6v6c0 4.6-3.2 7.6-7.5 8.5C7.7 19.6 4.5 16.6 4.5 12V6z"/><path d="M9 12l2 2 4-4"/>',
    leaf: '<path d="M5 19c0-8.5 5.5-14 15-14 0 9.5-5.5 15-15 15z"/><path d="M5 19l8-8"/>',
    camera: '<path d="M4 7.5h3.5L9 5h6l1.5 2.5H20V19H4z"/><circle cx="12" cy="13" r="3.5"/>',
    pot: '<path d="M6 10h12l-1.5 10h-9z"/><path d="M12 10V6m0 0c-1.5-2-4-2.5-5-1.5 1 1.5 3 2 5 1.5zm0 0c1.5-2 4-2.5 5-1.5-1 1.5-3 2-5 1.5z"/>',
    card: '<rect x="3" y="6" width="18" height="12.5" rx="2"/><path d="M3 10h18M7 15h3"/>',
    gift: '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7z"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>'
  };
  function icon(name) {
    return '<svg class="tp-pg-ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function heading(en, ja, id) {
    return '<h2 class="tp-pg-h"' + (id ? ' id="' + id + '"' : '') + '><span class="tp-pg-en">' + en + '</span><span class="tp-pg-ja">' + ja + '</span></h2>';
  }
  function details(title, bodyHtml, open) {
    return '<details class="tp-pg-acc"' + (open ? ' open' : '') + '><summary>' + title + '</summary><div class="tp-pg-acc-body">' + bodyHtml + '</div></details>';
  }
  // BASE の <br> 区切りの本文を、行の配列にする
  function linesOf(el) {
    var tmp = document.createElement('div');
    tmp.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    return tmp.textContent.split('\n').map(function (s) { return s.trim(); });
  }
  // 「▼ 見出し」で始まる行で区切る。最初の ▼ より前の行は intro に入れる
  function sections(lines) {
    var out = { intro: [], list: [] }, cur = null;
    lines.forEach(function (l) {
      if (/^▼/.test(l)) { cur = { title: l.replace(/^▼\s*/, ''), lines: [] }; out.list.push(cur); return; }
      (cur ? cur.lines : out.intro).push(l);
    });
    return out;
  }
  // 行の配列を段落に（空行で区切る。「■」「・」の行はそのまま改行して見せる）
  function paras(lines) {
    var html = '', buf = [];
    function flush() { if (buf.length) html += '<p>' + buf.map(esc).join('<br>') + '</p>'; buf = []; }
    lines.forEach(function (l) {
      if (!l) { flush(); return; }
      if (/^■/.test(l)) { flush(); html += '<h4>' + esc(l.replace(/^■\s*/, '')) + '</h4>'; return; }
      buf.push(l);
    });
    flush();
    return html;
  }

  var CSS = [
    // 商品ページのレビュー欄に「悪い」評価は出さない（2026-11-04 オーナー指示）。BASE アプリ側の表示は変えられない
    '.item-detail-review .review01__listChild:has(.ico--bad){display:none!important}',
    '.tp-pg{max-width:980px;margin:0 auto;font-family:var(--tp-font);color:var(--tp-ink,#1d1d1f);text-align:left}',
    '.tp-pg *{box-sizing:border-box}',
    '.tp-tw-sub{display:block;font-size:.72em;margin-top:4px;color:var(--tp-green,#22614c)}',
    '.tp-tw-free{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;background:var(--tp-green,#22614c);color:#fff;font:600 12px/1.6 var(--tp-font);vertical-align:middle}',
    '.tp-tw{margin:14px 0 22px;padding:16px;background:var(--tp-tint,#eef2ee);border-radius:14px;font-family:var(--tp-font);color:var(--tp-ink,#1d1d1f)}',
    '.tp-tw-h{display:block;font:700 15px/1.4 var(--tp-font)}',
    '.tp-tw-lead{margin:4px 0 12px;font:400 13px/1.6 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-tw-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
    '.tp-tw-card{position:relative;display:block;padding:12px;background:#fff;border:1.5px solid transparent;border-radius:10px;color:var(--tp-green,#22614c);text-decoration:none}',
    '.tp-tw-card span{display:block;font:600 13px/1.4 var(--tp-font)}',
    '.tp-tw-card em{display:block;margin:2px 0 4px;font:700 17px/1.3 var(--tp-font);font-style:normal}',
    '.tp-tw-card small{display:block;font:400 12px/1.5 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-tw-card.is-cur{border-color:var(--tp-green,#22614c)}',
    '.tp-tw-card i{position:absolute;top:10px;right:10px;font:600 10px/1 var(--tp-font);font-style:normal;padding:4px 6px;border-radius:999px;background:var(--tp-green,#22614c);color:#fff}',
    '.tp-tw-fact{margin:12px 0 0;font:400 12px/1.6 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-tw-pick{margin:4px 0 20px;padding:14px;border:1.5px solid var(--tp-line,#e3e3e0);border-radius:14px;font-family:var(--tp-font)}',
    '.tp-tw-gift{margin:12px 0 0;padding:12px 14px;border-radius:12px;background:var(--tp-tint,#eef2ee);font:400 12.5px/1.7 var(--tp-font);color:var(--tp-ink,#1d1d1f)}',
    '.tp-tw-gift b{display:block;font-weight:700;margin-bottom:2px}',
    '.tp-tw-gift a{display:inline-block!important;width:auto!important;margin-top:6px!important;padding:0!important;border:0!important;background:none!important;color:var(--tp-green,#22614c)!important;font:600 12.5px/1.7 var(--tp-font)!important;text-decoration:underline!important;text-underline-offset:3px}',
    '.tp-tw-hint{margin:0 0 8px;font:600 12px/1.6 var(--tp-font);color:#c0392b;text-align:center}',
    '.tp-tw-hint:empty{display:none}',
    '.tp-tw-pick-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font:600 14px/1.4 var(--tp-font)}',
    '.tp-tw-cnt{font:700 14px/1.4 var(--tp-font);color:var(--tp-green,#22614c);white-space:nowrap}',
    '.tp-tw-msg{margin:4px 0 12px;font:400 12px/1.6 var(--tp-font);color:#c0392b}',
    '.tp-tw-msg.is-done{color:var(--tp-green,#22614c)}',
    '.tp-tw-grid{display:flex;flex-direction:column;gap:6px}',
    '.tp-tw-pat{display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:8px;padding:6px 8px 6px 6px;border:1.5px solid var(--tp-line,#e3e3e0);border-radius:12px;background:#fff}',
    '.tp-tw-pat.is-on{border-color:var(--tp-green,#22614c);background:var(--tp-tint,#eef2ee)}',
    '.tp-tw-pat.is-out{opacity:.45}',
    '.tp-tw-pat img{width:44px;height:44px;aspect-ratio:auto;object-fit:contain;border-radius:8px;background:#f3f1ec}',
    '.tp-tw-nm{font:600 12.5px/1.4 var(--tp-font);color:var(--tp-ink,#1d1d1f);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.tp-tw-nm small{display:block;font-weight:400;font-size:12px;color:var(--tp-muted,#6e6e73)}',
    '.tp-tw-step{display:flex;align-items:center;gap:4px}',
    '.tp-tw-step button{width:30px;height:30px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1.5px solid var(--tp-green,#22614c);background:#fff;color:var(--tp-green,#22614c);font:500 20px/1 var(--tp-font);cursor:pointer;flex:0 0 auto}',
    '.tp-tw-step button:disabled{opacity:.25;cursor:default}',
    '.tp-tw-step output{min-width:1.2em;text-align:center;font:700 16px/1 var(--tp-font)}',
    '.tp-tw-out{font:600 12px/34px var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-pg-ic{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}',
    '.tp-pg-h{display:flex;flex-direction:column;gap:6px;margin:56px 0 20px;scroll-margin-top:90px}',
    '.tp-pg-en{font:700 28px/1.1 var(--tp-font);letter-spacing:.01em;color:var(--tp-green,#22614c)}',
    '.tp-pg-ja{font:400 13px/1.5 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-pg-lead{font:500 20px/1.75 var(--tp-font);margin:0 0 8px;letter-spacing:.01em}',
    '.tp-pg-sub{font:400 14px/1.9 var(--tp-font);color:var(--tp-muted,#6e6e73);margin:0}',
    '.tp-pg-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 8px}',
    '.tp-pg-chips a{font:500 13px/1 var(--tp-font);padding:10px 14px;border-radius:999px;background:#fff;color:var(--tp-ink,#1d1d1f);text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.06)}',
    '.tp-pg-chips a:hover{color:var(--tp-green,#22614c)}',
    '.tp-pg-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}',
    '.tp-pg-card{background:#fff;border-radius:18px;padding:22px 20px;box-shadow:0 1px 6px rgba(0,0,0,.05)}',
    '.tp-pg-card .tp-pg-ic{color:var(--tp-green,#22614c);margin-bottom:12px}',
    '.tp-pg-card b{display:block;font:700 15px/1.5 var(--tp-font);margin-bottom:6px}',
    '.tp-pg-card span{display:block;font:400 13px/1.8 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-pg-cards--2{grid-template-columns:1fr 1fr}',
    '.tp-pg-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;counter-reset:tpstep;margin:0;padding:0;list-style:none}',
    '.tp-pg-flow li{position:relative;background:#fff;border-radius:18px;padding:20px 18px;box-shadow:0 1px 6px rgba(0,0,0,.05)}',
    '.tp-pg-flow li::before{counter-increment:tpstep;content:"STEP " counter(tpstep);display:block;font:700 11px/1 var(--tp-font);letter-spacing:.08em;color:var(--tp-green,#22614c);margin-bottom:10px}',
    '.tp-pg-flow li:not(:last-child)::after{content:"";position:absolute;right:-9px;top:50%;width:8px;height:8px;border-top:2px solid #c7c7cc;border-right:2px solid #c7c7cc;transform:translateY(-50%) rotate(45deg);z-index:1}',
    '.tp-pg-flow .tp-pg-ic{color:var(--tp-green,#22614c);margin-bottom:8px}',
    '.tp-pg-flow b{display:block;font:700 14px/1.5 var(--tp-font);margin-bottom:4px}',
    '.tp-pg-flow span{display:block;font:400 12.5px/1.7 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-pg-free{display:flex;align-items:center;gap:14px;margin:12px 0;padding:18px 22px;border-radius:18px;background:var(--tp-green,#22614c);color:#fff}',
    '.tp-pg-free b{font:700 17px/1.4 var(--tp-font)}',
    '.tp-pg-free span{font:400 13px/1.6 var(--tp-font);opacity:.85}',
    '.tp-pg-table{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.05);font:400 13.5px/1.7 var(--tp-font)}',
    '.tp-pg-table th,.tp-pg-table td{padding:14px 16px;text-align:left;vertical-align:top;border-bottom:1px solid #f0f0f2}',
    '.tp-pg-table tr:last-child th,.tp-pg-table tr:last-child td{border-bottom:0}',
    '.tp-pg-table thead th{font:600 12px/1.4 var(--tp-font);color:var(--tp-muted,#6e6e73);background:#fafafb}',
    '.tp-pg-table tbody th{font-weight:600;white-space:nowrap}',
    '.tp-pg-note{font:400 12px/1.8 var(--tp-font);color:var(--tp-muted,#6e6e73);margin:10px 2px 0}',
    '.tp-pg-note a,.tp-pg-acc a,.tp-pg-table a{color:var(--tp-green,#22614c)}',
    '.tp-pg-acc{background:#fff;border-radius:16px;margin:0 0 10px;box-shadow:0 1px 6px rgba(0,0,0,.05)}',
    '.tp-pg-acc summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 20px;font:600 15px/1.5 var(--tp-font)}',
    '.tp-pg-acc summary::-webkit-details-marker{display:none}',
    '.tp-pg-acc summary::after{content:"";width:8px;height:8px;border-right:2px solid #86868b;border-bottom:2px solid #86868b;transform:rotate(45deg);transition:transform .2s;flex:0 0 auto;margin-top:-4px}',
    '.tp-pg-acc[open] summary::after{transform:rotate(-135deg);margin-top:4px}',
    '.tp-pg-acc-body{padding:0 20px 18px;font:400 14px/1.9 var(--tp-font);color:#3a3a3c}',
    '.tp-pg-acc-body p{margin:0 0 12px}',
    '.tp-pg-acc-body h4{font:600 13px/1.5 var(--tp-font);color:var(--tp-green,#22614c);margin:14px 0 4px}',
    '.tp-pg-faqg{font:600 13px/1.5 var(--tp-font);color:var(--tp-muted,#6e6e73);margin:22px 4px 10px}',
    '.tp-pg-q summary{font-size:14.5px}',
    '.tp-pg-q summary span::before{content:"Q.";color:var(--tp-green,#22614c);font-weight:700;margin-right:8px}',
    '.tp-pg-cta{display:inline-block;margin-top:18px;padding:14px 26px;border-radius:999px;background:var(--tp-green,#22614c);color:#fff!important;font:600 14px/1 var(--tp-font);text-decoration:none}',
    '.tp-pg-hero{background:#fff;border-radius:24px;padding:36px 32px;box-shadow:0 1px 6px rgba(0,0,0,.05);margin:8px 0 0}',
    '.tp-pg-hero .tp-pg-en{display:block;font-size:13px;letter-spacing:.12em;margin-bottom:10px}',
    '.tp-pg-hero h2{font:700 30px/1.3 var(--tp-font);margin:0 0 12px;color:var(--tp-ink,#1d1d1f)}',
    '.tp-pg-calc{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:16px 0 0;font:600 14px/1.4 var(--tp-font)}',
    '.tp-pg-calc span{background:#f5f5f7;border-radius:12px;padding:10px 14px}',
    '.tp-pg-calc i{font-style:normal;color:var(--tp-muted,#6e6e73)}',
    // メンバーシップ: BASE が出す画像・ポイント・特典・会員登録を、上の説明と同じ幅のカードにそろえる
    '#membership[data-tp] .guide,#membership[data-tp] .about-point,#membership[data-tp] .reward-list,#membership[data-tp] .register{max-width:980px;margin:40px auto 0!important;box-sizing:border-box}',
    '#membership[data-tp] .guide .img-wrapper img{width:100%;border-radius:24px;display:block}',
    '#membership[data-tp] .guide .content{margin:28px 0 0!important;padding:0!important;text-align:left}',
    '#membership[data-tp] .guide .content .heading{font:700 22px/1.5 var(--tp-font)!important;margin:0 0 16px!important;text-align:left!important}',
    '#membership[data-tp] .guide .content .description{margin:0!important;padding:0!important}',
    '#membership[data-tp] .about-point,#membership[data-tp] .reward-list{background:#fff!important;border-radius:18px;padding:24px!important;box-shadow:0 1px 6px rgba(0,0,0,.05);font-family:var(--tp-font)}',
    '#membership[data-tp] .heading-point,#membership[data-tp] .reward-list .title{font:700 17px/1.5 var(--tp-font)!important;color:var(--tp-green,#22614c)!important;margin:0 0 10px!important}',
    '#membership[data-tp] .reward-list .bar{display:none}',
    // 管理画面でメンバーシップの画像を設定していると、BASE はページ見出しを白にする（画像の上に重ねる前提）。明るい背景では読めないので文字色を戻す
    'body.membership-img-exist .page-title-wrap h2.page-title.page-title{color:var(--tp-ink,#1d1d1f)!important;text-shadow:none!important}',
    '#membership[data-tp] .register{border-radius:18px;overflow:hidden}',
    '.tp-pg-empty{background:#fff;border-radius:20px;padding:28px 24px;box-shadow:0 1px 6px rgba(0,0,0,.05);font:400 14px/1.9 var(--tp-font)}',
    '.tp-pg-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}',
    '.tp-pg-links a{padding:11px 16px;border-radius:999px;background:#f5f5f7;color:var(--tp-ink,#1d1d1f);text-decoration:none;font:500 13px/1 var(--tp-font)}',
    /* フッター */
    '.footer .footer-top.tp-ft{display:grid!important;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:36px 28px;max-width:1200px;margin:0 auto}',
    '.tp-ft-strip{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}',
    '.tp-ft-strip a{display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;color:var(--tp-ink,#1d1d1f);text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.05)}',
    '.tp-ft-strip .tp-pg-ic{color:var(--tp-green,#22614c)}',
    '.tp-ft-strip b{display:block;font:600 13px/1.4 var(--tp-font)}',
    '.tp-ft-strip span{display:block;font:400 11.5px/1.5 var(--tp-font);color:var(--tp-muted,#6e6e73)}',
    '.tp-ft-col h3{font:600 12px/1.4 var(--tp-font)!important;letter-spacing:.08em;color:var(--tp-green,#22614c)!important;margin:0 0 14px!important}',
    '.tp-ft-col ul{list-style:none;margin:0;padding:0}',
    '.tp-ft-col li{margin:0 0 10px}',
    '.tp-ft-col a{font:400 13px/1.5 var(--tp-font);color:var(--tp-ink,#1d1d1f);text-decoration:none}',
    '.tp-ft-col a:hover{color:var(--tp-green,#22614c)}',
    '.footer .footer-top.tp-ft .footer-about,.footer .footer-top.tp-ft .mailmagazine{width:auto!important;max-width:none!important;margin:0!important;padding:0!important}',
    '.footer .footer-top.tp-ft .footer-about h3,.footer .footer-top.tp-ft .mailmagazine h3{font:600 12px/1.4 var(--tp-font)!important;letter-spacing:.08em;color:var(--tp-green,#22614c)!important;margin:0 0 14px!important}',
    '.footer .footer-top.tp-ft .footer-about-text{font:400 12.5px/1.9 var(--tp-font)!important;color:var(--tp-muted,#6e6e73)!important}',
    // メールマガジンは列に入れると1つだけ浮くので、最後に全幅の横長カードにする
    '.footer .footer-top.tp-ft .mailmagazine{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:8px 32px;background:#fff!important;border-radius:16px;padding:20px 24px!important;box-shadow:0 1px 4px rgba(0,0,0,.05)}',
    '.footer .footer-top.tp-ft .mailmagazine h3{margin:0!important}',
    '.footer .footer-top.tp-ft .mailmagazine p{margin:0;flex:1 1 220px;font:400 13px/1.6 var(--tp-font)}',
    '.footer .footer-top.tp-ft .mailmagazine-form{flex:0 1 360px;width:100%}',
    '@media (max-width:900px){',
    '.tp-pg-cards,.tp-pg-flow{grid-template-columns:1fr 1fr}',
    '.tp-pg-flow li:nth-child(2)::after{display:none}',
    '.footer .footer-top.tp-ft{grid-template-columns:1fr 1fr;gap:28px 20px}',
    '.tp-ft-strip{grid-template-columns:1fr 1fr}',
    '.footer .footer-top.tp-ft .footer-about{grid-column:1/-1}',
    '}',
    '@media (max-width:560px){',
    '.tp-pg-cards,.tp-pg-flow{grid-template-columns:1fr}',
    '.tp-pg-flow li::after{display:none}',
    // スマホでは縦に長くなりすぎるので、アイコンを左・文章を右の横並びにする
    '.tp-pg-flow,.tp-pg-cards{gap:8px}',
    '.tp-pg-flow li,.tp-pg-card{display:grid;grid-template-columns:28px 1fr;column-gap:14px;padding:16px 16px}',
    '.tp-pg-flow li::before{grid-column:2;margin-bottom:4px}',
    '.tp-pg-flow .tp-pg-ic,.tp-pg-card .tp-pg-ic{grid-column:1;grid-row:1/span 3;margin:0}',
    '.tp-pg-flow b,.tp-pg-flow span,.tp-pg-card b,.tp-pg-card span{grid-column:2}',
    '.tp-pg-en{font-size:24px}',
    '.tp-pg-lead{font-size:17px}',
    '.tp-pg-hero{padding:26px 20px}',
    '.tp-pg-hero h2{font-size:24px}',
    '.tp-pg-table{font-size:12.5px}',
    '.tp-pg-table th,.tp-pg-table td{padding:12px 12px}',
    '.tp-pg-table tbody th{white-space:normal}',
    // 列の多い表は、スマホでは1行ずつのカードにする（見出しは各セルの前に出す）
    '.tp-pg-stack thead{display:none}',
    '.tp-pg-stack tr{display:block;padding:14px 16px;border-bottom:1px solid #f0f0f2}',
    '.tp-pg-stack tr:last-child{border-bottom:0}',
    '.tp-pg-stack th,.tp-pg-stack td{display:block;padding:2px 0!important;border:0!important}',
    '.tp-pg-stack th{font-size:14px;margin-bottom:4px}',
    '.tp-pg-stack td::before{content:attr(data-label) "：";color:var(--tp-muted,#6e6e73)}',
    '.tp-ft-strip a{padding:14px}',
    '}'
  ].join('');

  // 管理画面の「コミュニティ」は作成されていない（2026-10-30 確認）。空のページへの導線を出さない
  function hideCommunityLinks() {
    document.querySelectorAll('a[href$="/community"]').forEach(function (a) {
      var li = a.closest('li');
      (li || a).style.display = 'none';
    });
  }

  function footer() {
    var top = document.querySelector('.footer .footer-top');
    if (!top || top.classList.contains('tp-ft')) return;
    var oldMenu = top.querySelector('.footer-menu');
    // 管理画面で設定された URL を優先して使う（プレビューでも正しく飛ぶように）
    function hrefOf(re, fallback) {
      var a = oldMenu && Array.prototype.find.call(oldMenu.querySelectorAll('a'), function (x) { return re.test(x.textContent); });
      return a ? a.getAttribute('href') : base + fallback;
    }
    var about = hrefOf(/私たちについて|ABOUT/i, '/about');
    var contact = hrefOf(/お問い合わせ|CONTACT/i, '/inquiry');
    var member = hrefOf(/^ガイド$/, '/membership');
    var mypage = hrefOf(/マイページ/, '/membership/mypage');
    function col(title, items) {
      return '<div class="tp-ft-col"><h3>' + title + '</h3><ul>' + items.map(function (i) {
        return '<li><a href="' + i[1] + '"' + (/^https?:\/\/(?!www\.tokyoplants)/.test(i[1]) ? ' target="_blank" rel="noopener"' : '') + '>' + i[0] + '</a></li>';
      }).join('') + '</ul></div>';
    }
    var strip = document.createElement('div');
    strip.className = 'tp-ft-strip';
    strip.innerHTML =
      '<a href="' + about + '#tp-shipping">' + icon('truck') + '<div><b>¥10,000以上で送料無料</b><span>全国どこへでも</span></div></a>' +
      '<a href="' + about + '#tp-shipping">' + icon('box') + '<div><b>3日以内に発送</b><span>お支払いの確定から</span></div></a>' +
      '<a href="' + IG + '" target="_blank" rel="noopener">' + icon('chat') + '<div><b>育て方の相談</b><span>Instagram の DM から</span></div></a>' +
      '<a href="' + member + '">' + icon('tree') + '<div><b>お買い物の1%を森へ</b><span>tokyo to forest</span></div></a>';
    var cols = document.createElement('div');
    cols.style.display = 'contents';
    cols.innerHTML =
      col('SHOP', [['Plants｜植物', base + '/categories/6382090'], ['Soil &amp; Care｜土', base + '/categories/6820321'], ['Towels｜タオル', base + '/items/135803882'], ['Items｜雑貨', base + '/categories/7207689']]) +
      col('GUIDE', [['ショップについて', about], ['お届けと送料', about + '#tp-shipping'], ['お支払い方法', about + '#tp-payment'], ['よくある質問', about + '#faq'], ['お問い合わせ', contact]]) +
      col('MORE', [['メンバーシップ', member], ['マイページ', mypage], ['Journal｜読みもの', MEDIA + '/journal?utm_source=shop&utm_medium=footer'], ['植物図鑑・育て方', MEDIA + '/?utm_source=shop&utm_medium=footer'], ['Green Collection｜アプリ', MEDIA + '/app?utm_source=shop&utm_medium=footer'], ['Instagram', IG]]);
    var aboutBox = top.querySelector('.footer-about');
    var mail = top.querySelector('.mailmagazine');
    top.insertBefore(strip, top.firstChild);
    if (oldMenu) oldMenu.remove();
    // 並び: 帯 → SHOP INFO → SHOP → GUIDE → MORE → メールマガジン
    if (aboutBox) top.appendChild(aboutBox);
    while (cols.firstChild) top.appendChild(cols.firstChild);
    if (mail) top.appendChild(mail);
    top.classList.add('tp-ft');
  }

  function aboutPage() {
    var main = document.querySelector('.about-main');
    if (!main || main.dataset.tp) return;
    main.dataset.tp = '1';
    var info = main.querySelector('.shop-info');
    var faqH = main.querySelector('#faq');
    var faqText = faqH && faqH.nextElementSibling;
    var soil = base + '/items/99620939';

    var html = '<div class="tp-pg">' +
      '<div class="tp-pg-chips"><a href="#tp-story">私たちについて</a><a href="#tp-shipping">お届けと送料</a><a href="#tp-payment">お支払い方法</a><a href="#faq">よくある質問</a><a href="#tp-detail">ご案内の全文</a></div>' +
      heading('STORY', '私たちについて', 'tp-story') +
      '<p class="tp-pg-lead">東京・世田谷の小さな部屋から、<br>希少な観葉植物を手の届く価格で。</p>' +
      '<p class="tp-pg-sub">仲介業者を通さず、自ら海外まで足を運び、現地で一点ずつ選んで買い付けています。</p>' +
      '<div class="tp-pg-cards" style="margin-top:20px">' +
        '<div class="tp-pg-card">' + icon('leaf') + '<b>現地で一点ずつ買い付け</b><span>国内ではなかなか出会えない品種を、自分の目で選んでいます。</span></div>' +
        '<div class="tp-pg-card">' + icon('camera') + '<b>写真の株をそのままお届け</b><span>植物は一点ずつ撮影し、その現物をお送りしています。</span></div>' +
        '<div class="tp-pg-card">' + icon('chat') + '<b>購入後も相談できる</b><span>水やりや置き場所、植え替えの時期も、Instagram の DM からどうぞ。</span></div>' +
      '</div>' +

      heading('SHIPPING', 'お届けと送料', 'tp-shipping') +
      '<ol class="tp-pg-flow">' +
        '<li>' + icon('cart') + '<b>ご注文</b><span>お支払い方法は下の表から選べます。</span></li>' +
        '<li>' + icon('box') + '<b>3日以内に発送</b><span>お支払いの確定から3日以内（通常2〜3日）。</span></li>' +
        '<li>' + icon('home') + '<b>お届け</b><span>まずは置き場所に慣らしてから。すぐの植え替えはおすすめしません。</span></li>' +
        '<li>' + icon('chat') + '<b>育て方の相談</b><span>Instagram の DM や、アプリ Green Collection で記録と相談を。</span></li>' +
      '</ol>' +
      '<div class="tp-pg-free">' + icon('truck') + '<div><b>¥10,000（税込）以上のご注文で、全国送料無料</b><br><span>植物と雑貨をまとめても、合計金額で判定します。</span></div></div>' +
      '<table class="tp-pg-table tp-pg-stack"><thead><tr><th>お届けするもの</th><th>配送方法</th><th>送料</th><th>特徴</th></tr></thead><tbody>' +
        '<tr><th>植物・土など</th><td data-label="配送方法">ゆうパック</td><td data-label="送料">全国一律 ¥800</td><td data-label="特徴">補償付き</td></tr>' +
        '<tr><th>タオルなど一部の商品</th><td data-label="配送方法">ゆうパケット</td><td data-label="送料">全国一律 ¥500</td><td data-label="特徴">ポスト投函・追跡あり・日時指定不可</td></tr>' +
      '</tbody></table>' +
      '<p class="tp-pg-note">送料は商品ページにも表示しています。夏と冬は、アルミシートで暑さ・寒さ対策をして梱包します（無料）。</p>' +
      '<div class="tp-pg-cards tp-pg-cards--2" style="margin-top:16px">' +
        '<div class="tp-pg-card">' + icon('pot') + '<b>根が見える軽いプラスチック鉢</b><span>育てている鉢のままお届けします。根の様子を確かめやすい鉢です。</span></div>' +
        '<div class="tp-pg-card">' + icon('leaf') + '<b>土はオリジナルの培養土</b><span>基本用土は『I\'m original SOIL』。同じ土を<a href="' + soil + '" style="color:var(--tp-green,#22614c)">ショップで購入できます</a>。</span></div>' +
      '</div>' +

      heading('PAYMENT', 'お支払い方法', 'tp-payment') +
      '<table class="tp-pg-table"><thead><tr><th>お支払い方法</th><th>お支払いのタイミング</th></tr></thead><tbody>' +
        '<tr><th>クレジットカード</th><td>ご注文時に確定</td></tr>' +
        '<tr><th>Amazon Pay・PayPal</th><td>ご注文時に確定</td></tr>' +
        '<tr><th>キャリア決済</th><td>ご注文時に確定</td></tr>' +
        '<tr><th>PayPay</th><td>ショップの発送処理後に確定</td></tr>' +
        '<tr><th>コンビニ・Pay-easy</th><td>ご注文日から5日以内にお支払い</td></tr>' +
        '<tr><th>銀行振込</th><td>ご請求から5営業日以内にお支払い</td></tr>' +
        '<tr><th>PAY ID あと払い</th><td>翌月10日までにコンビニで、または口座振替</td></tr>' +
      '</tbody></table>' +
      '<p class="tp-pg-note">手数料がかかるお支払い方法があります。くわしくは<a href="' + base + '/law">特定商取引法に基づく表記</a>をご覧ください。</p>' +
      '</div>';

    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var page = wrap.firstChild;

    // FAQ: デザイン設定の FAQ テキスト（Q. で始まる行が質問、■ がグループ見出し）をトグルに
    if (faqText) {
      var groups = [{ title: 'ご注文・お届け', items: [] }], q = null, tail = [];
      faqText.textContent.split('\n').map(function (s) { return s.trim(); }).forEach(function (l) {
        if (/^■/.test(l)) { groups.push({ title: l.replace(/^■\s*/, ''), items: [] }); q = null; return; }
        if (/^Q[.．]/.test(l)) { q = { q: l.replace(/^Q[.．]\s*/, ''), a: [] }; groups[groups.length - 1].items.push(q); return; }
        if (q) q.a.push(l); else if (l) tail.push(l);
      });
      // 元の FAQ に無い質問を、ほかのページの記載から足す（ギフトラッピング: 商品オプション、返品: 特定商取引法に基づく表記）
      groups[0].items.push(
        { q: 'ギフトラッピングはできますか？', a: ['タオルと SISHICRAFT の作品は、不織布リボン付きのギフトバッグ（赤）でお包みできます（1包装 ¥300）。', 'タオルは「1枚ずつ包む」か「まとめて1つの袋に包む」かを選べます。くわしくはタオルの商品ページをご覧ください。'] },
        { q: '返品はできますか？', a: ['商品に欠陥がある場合をのぞき、基本的には返品をお受けしていません（特定商取引法に基づく表記）。'] }
      );
      // 最後の「ご不明な点は…」の行は、最後のグループの答えに入ってしまうので、末尾の案内として分ける
      var last = groups[groups.length - 1].items.slice(-1)[0];
      if (last) {
        var idx = last.a.findIndex(function (l) { return /^ご不明な点/.test(l); });
        if (idx >= 0) { tail = tail.concat(last.a.slice(idx)); last.a = last.a.slice(0, idx); }
      }
      var faqHtml = heading('FAQ', 'よくある質問', 'faq');
      groups.forEach(function (g) {
        if (!g.items.length) return;
        faqHtml += '<p class="tp-pg-faqg">' + esc(g.title) + '</p>';
        g.items.forEach(function (it) {
          faqHtml += details('<span>' + esc(it.q) + '</span>', paras(it.a)).replace('tp-pg-acc"', 'tp-pg-acc tp-pg-q"');
        });
      });
      if (tail.length) faqHtml += '<p class="tp-pg-note">' + tail.map(esc).join('<br>') + '</p>';
      var faqBox = document.createElement('div');
      faqBox.innerHTML = faqHtml;
      while (faqBox.firstChild) page.appendChild(faqBox.firstChild);
      faqH.removeAttribute('id');
      faqH.remove();
      faqText.remove();
    }

    // ショップ紹介文（管理画面の「ショップ紹介文」）は、▼ ごとのトグルにして最後に置く
    if (info) {
      var sec = sections(linesOf(info));
      var detailHtml = heading('DETAILS', 'ご案内の全文', 'tp-detail');
      if (sec.intro.some(Boolean)) detailHtml += paras(sec.intro);
      sec.list.forEach(function (s) { detailHtml += details(esc(s.title), paras(s.lines)); });
      var detailBox = document.createElement('div');
      detailBox.innerHTML = detailHtml;
      while (detailBox.firstChild) page.appendChild(detailBox.firstChild);
      info.remove();
    }
    main.insertBefore(page, main.firstChild);
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
    }
  }

  function membershipPage() {
    var root = document.querySelector('#membership');
    var guide = root && root.querySelector('.guide');
    if (!guide || root.dataset.tp) return;
    root.dataset.tp = '1';
    var register = root.querySelector('.register');
    var hero = document.createElement('div');
    hero.className = 'tp-pg';
    hero.innerHTML =
      '<div class="tp-pg-hero"><span class="tp-pg-en">MEMBERSHIP</span><h2>tokyo to forest</h2>' +
      '<p class="tp-pg-sub">tokyoplants でのお買い物金額の1%がポイントに。50ポイントで、世界のどこかに木を1本植えるプロジェクトに参加できます。</p>' +
      '<div class="tp-pg-calc"><span>¥5,000 のお買い物</span><i>→</i><span>50 ポイント</span><i>→</i><span>木を1本</span></div>' +
      (register ? '<a class="tp-pg-cta" href="#tp-register">無料で参加する</a>' : '') + '</div>' +
      heading('HOW IT WORKS', 'ポイントが森になるまで') +
      '<ol class="tp-pg-flow">' +
        '<li>' + icon('cart') + '<b>お買い物</b><span>メンバーシップに参加して、いつもどおりお買い物。</span></li>' +
        '<li>' + icon('coin') + '<b>1%がポイントに</b><span>購入金額の1%が、ショップ独自のポイントとして貯まります。</span></li>' +
        '<li>' + icon('gift') + '<b>50ポイントで交換</b><span>商品購入時に、特典「plant one tree」を申請できます。</span></li>' +
        '<li>' + icon('tree') + '<b>森に木が増える</b><span>Tree-Nation を通じて植樹し、樹種や植樹先をお知らせします。</span></li>' +
      '</ol>' +
      heading('MEMBERSHIP', 'メンバーシップのしくみ') +
      '<table class="tp-pg-table"><tbody>' +
        '<tr><th>参加費</th><td>無料（PAY ID の会員登録が必要です）</td></tr>' +
        '<tr><th>ポイント</th><td>購入金額の1%。メンバーシップに参加しているお客様にだけ付与されます</td></tr>' +
        '<tr><th>特典</th><td>50ポイントで「plant one tree」1回分</td></tr>' +
        '<tr><th>交換のしかた</th><td>ポイントが貯まったら、商品購入時に特典を申請します</td></tr>' +
        '<tr><th>植樹先</th><td>樹種・地域・プロジェクト・本数は、その時点で支援する森林再生プロジェクトによって異なります</td></tr>' +
      '</tbody></table>';
    root.insertBefore(hero, guide);
    if (register) register.id = 'tp-register';

    // 管理画面の説明文（<br> 区切り、▼ 見出し）を、冒頭の文章＋トグルに
    var desc = guide.querySelector('.description p') || guide.querySelector('.description');
    if (desc) {
      var sec = sections(linesOf(desc));
      var box = document.createElement('div');
      box.className = 'tp-pg';
      box.innerHTML = (sec.intro.some(Boolean) ? '<div class="tp-pg-acc-body" style="padding:0">' + paras(sec.intro) + '</div>' : '') +
        sec.list.map(function (s) { return details(esc(s.title), paras(s.lines)); }).join('');
      desc.parentNode.replaceChild(box, desc);
    }
  }

  function communityPage() {
    var title = Array.prototype.find.call(document.querySelectorAll('h2.page-title'), function (h) { return /COMMUNITY/i.test(h.textContent); });
    if (!title) return;
    var wrap = title.closest('.inview') || title.parentNode;
    if (wrap.dataset.tp || !/コミュニティがありません/.test(wrap.textContent)) return;
    wrap.dataset.tp = '1';
    var box = document.createElement('div');
    box.className = 'tp-pg';
    box.innerHTML = '<div class="tp-pg-empty"><b>いま参加できるコミュニティはありません。</b><br>' +
      '新しい植物の入荷や育て方の話題は、Instagram と Journal でお届けしています。' +
      '<div class="tp-pg-links"><a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="' + MEDIA + '/journal?utm_source=shop&utm_medium=community" target="_blank" rel="noopener">Journal</a>' +
      '<a href="' + base + '/membership">メンバーシップ</a></div></div>';
    Array.prototype.forEach.call(wrap.children, function (c) { if (c !== title && /コミュニティがありません/.test(c.textContent)) c.style.display = 'none'; });
    wrap.appendChild(box);
  }

  // ---- タオルのまとめ買い（2026-11-01。単品 135803882 と 3枚・6枚・全8種セット） ----
  // 比較（価格・お得額・送料）を価格の下に出し、セットの柄は写真の一覧から −／＋ で選ぶ。
  // 選んだ柄は BASE の注文オプション「1枚目の柄」〜「n枚目の柄」にそのまま入れる（注文データの形は変えない）
  var TOWEL = { '135803882': 1, '164675173': 3, '164675181': 6, '164675194': 8 };
  var TOWEL_SETS = [
    { id: '135803882', n: 1, label: '1枚', price: 2000, note: '送料500円' },
    { id: '164675173', n: 3, label: '3枚', price: 5000, note: '1,000円お得・送料500円' },
    { id: '164675181', n: 6, label: '6枚', price: 10000, note: '2,000円お得・送料無料' },
    { id: '164675194', n: 8, label: '全8種', price: 12800, note: '3,200円お得・送料無料' }
  ];
  var TOWEL_PAT = [
    ['モンステラ・デリシオーサ｜緑', 'monstera-green'],
    ['モンステラ・デリシオーサ｜斑入り', 'monstera-variegata'],
    ['アンスリウム・ワロクアーナム｜緑', 'warocqueanum-green'],
    ['アンスリウム・ワロクアーナム｜深緑', 'warocqueanum-deepgreen'],
    ['アンスリウム・キング オブ スペード｜緑', 'king-of-spades-green'],
    ['アンスリウム・キング オブ スペード｜黒', 'king-of-spades-black'],
    ['アロカシア｜緑', 'alocasia-green'],
    ['アロカシア｜ピンク', 'alocasia-pink']
  ];
  // 2025-11〜2026-10 の当店のタオル注文 322件のうち、2枚以上は 209件（65%）
  var TOWEL_FACT = 'タオルをご注文の方の約3人に2人が、2枚以上をまとめて購入しています（2025年11月〜2026年10月・当店のご注文）';

  function towelPage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    if (!TOWEL[id]) return;
    var detail = document.querySelector('.item-detail-inner');
    if (!detail || detail.dataset.tpTowel) return;
    detail.dataset.tpTowel = '1';
    var n = TOWEL[id];
    var cur = TOWEL_SETS.filter(function (s) { return s.id === id; })[0];

    // 見出し: 「Daily Botanical Towel」と「3枚セット」を2段に（スマホで「セッ／ト」と切れないように）
    var h1 = detail.querySelector('h1');
    if (h1 && n > 1) {
      var m = h1.textContent.match(/^(Daily Botanical Towel)\s+(.+)$/);
      if (m) h1.innerHTML = esc(m[1]) + '<span class="tp-tw-sub">' + esc(m[2]) + '</span>';
    }

    // 価格: 1万円以上は送料無料をはっきり出し、BASE 標準の「送料は¥800です」を言い換える
    var price = detail.querySelector('.price');
    if (price && cur.price >= 10000) {
      var tag = document.createElement('span');
      tag.className = 'tp-tw-free';
      tag.textContent = '送料無料';
      (price.querySelector('.default') || price).appendChild(tag);
      Array.prototype.forEach.call(detail.querySelectorAll('.attention'), function (p) {
        if (/送料は¥/.test(p.textContent)) p.textContent = '※ ¥10,000以上のご注文のため、国内送料は無料です。';
        else if (/¥10,000以上のご注文で国内送料が無料/.test(p.textContent)) p.style.display = 'none';
      });
    }

    // 比較: 単品・各セットを並べ、表示中のものに印を付ける（テーマの .tp-sets があれば置き換える）
    var cmp = document.createElement('div');
    cmp.className = 'tp-tw';
    cmp.innerHTML = '<b class="tp-tw-h">まとめ買いがお得</b>' +
      '<p class="tp-tw-lead">自分用に1枚、贈り物に2枚。キッチン・洗面所・洗い替えに。</p>' +
      '<div class="tp-tw-cards">' + TOWEL_SETS.map(function (s) {
        var body = '<span>' + s.label + '</span><em>¥' + s.price.toLocaleString() + '</em><small>' + s.note + '</small>';
        return s.id === id ? '<div class="tp-tw-card is-cur" aria-current="page">' + body + '<i>表示中</i></div>'
          : '<a class="tp-tw-card" href="' + base + '/items/' + s.id + '">' + body + '</a>';
      }).join('') + '</div>' +
      '<p class="tp-tw-fact">' + TOWEL_FACT + '</p>';
    var old = detail.querySelector('.tp-sets');
    if (old) old.parentNode.replaceChild(cmp, old);
    else if (price) price.parentNode.insertBefore(cmp, price.nextSibling);

    if (n === 3 || n === 6) towelPicker(detail, n);

    // 「数量」がタオルの枚数かセット数か分かるように言い換える
    var amount = detail.querySelector('select[name="amount"]');
    var amountBox = amount && amount.closest('.itemOptionElement, .amount, div');
    var amountLabel = amountBox && Array.prototype.filter.call(amountBox.parentNode.querySelectorAll('*'), function (e) {
      return e.childElementCount === 0 && e.textContent.trim() === '数量';
    })[0];
    if (amountLabel) amountLabel.textContent = n > 1 ? 'セット数（1セット＝' + (n === 8 ? '全8種・8枚' : n + '枚') + '）' : '枚数';

    // ラッピングは全タオル共通で「ギフトバッグを袋の数だけ＋分け方は備考欄」（2026-11-01 オーナー決定）
    var buy = detail.querySelector('.purchaseButton__btn--addToCart');
    if (buy) {
      var gift = document.createElement('div');
      gift.className = 'tp-tw-gift';
      gift.innerHTML = '<b>ギフトにする方へ</b>ギフトバッグ（1袋¥300）を袋の数だけカートに入れてください。全部まとめて1袋なら1つでOK。分けたいときは、購入画面の備考欄に分け方をご記入ください。' +
        '<a href="' + base + '/items/164551101">ギフトバッグを見る</a>';
      buy.parentNode.insertBefore(gift, buy.nextSibling);
    }

  }

  function towelPicker(detail, n) {
    var form = detail.querySelector('form.x_purchaseForm, #purchase_form');
    if (!form) return;
    var els = Array.prototype.filter.call(form.querySelectorAll('.itemOptionElement'), function (e) {
      var l = e.querySelector('.itemOption__name');
      return l && /^\s*\d+枚目の柄/.test(l.textContent);
    });
    var sels = els.map(function (e) { return e.querySelector('select'); });
    if (sels.length !== n || sels.some(function (s) { return !s; })) return; // 想定と違う形なら BASE の選択欄のまま
    var choice = function (sel, name) {
      return Array.prototype.filter.call(sel.options, function (o) { return o.value && o.text.trim().indexOf(name) === 0; })[0];
    };
    var count = TOWEL_PAT.map(function () { return 0; });
    sels.forEach(function (s) { // 戻るボタンで戻ったときなど、選択済みの値を読み込む
      var t = s.options[s.selectedIndex] && s.options[s.selectedIndex].value ? s.options[s.selectedIndex].text.trim() : '';
      TOWEL_PAT.forEach(function (p, i) { if (t && t.indexOf(p[0]) === 0) count[i]++; });
    });

    var box = document.createElement('div');
    box.className = 'tp-tw-pick';
    box.innerHTML = '<div class="tp-tw-pick-h"><b>柄を選ぶ（合計' + n + '枚）</b><span class="tp-tw-cnt"></span></div>' +
      '<p class="tp-tw-msg"></p><div class="tp-tw-grid">' + TOWEL_PAT.map(function (p, i) {
        var ok = !!choice(sels[0], p[0]);
        var nm = p[0].replace('アンスリウム・', '').replace('・デリシオーサ', '').replace(/ /g, '').split('｜');
        return '<div class="tp-tw-pat' + (ok ? '' : ' is-out') + '" data-i="' + i + '">' +
          '<img src="' + MEDIA + '/images/home/towel-' + p[1] + '-560.jpg" alt="' + esc(p[0]) + '" loading="lazy">' +
          '<span class="tp-tw-nm">' + esc(nm[0]) + '<small>' + esc(nm[1]) + '</small></span>' +
          (ok ? '<span class="tp-tw-step"><button type="button" data-d="-1" aria-label="' + esc(p[0]) + 'を1枚減らす">−</button><output>0</output>' +
            '<button type="button" data-d="1" aria-label="' + esc(p[0]) + 'を1枚増やす">＋</button></span>' : '<span class="tp-tw-out">品切れ</span>') +
          '</div>';
      }).join('') + '</div>';
    els[0].parentNode.insertBefore(box, els[0]);
    els.forEach(function (e) { e.style.display = 'none'; });
    // ラッピングなど他のオプションは、柄の一覧の下へ
    Array.prototype.forEach.call(form.querySelectorAll('.itemOptionElement'), function (e) {
      if (els.indexOf(e) < 0 && e.compareDocumentPosition(box) & Node.DOCUMENT_POSITION_FOLLOWING) box.parentNode.insertBefore(e, els[els.length - 1].nextSibling);
    });

    function total() { return count.reduce(function (a, b) { return a + b; }, 0); }
    function sync() {
      var list = [];
      count.forEach(function (c, i) { for (var k = 0; k < c; k++) list.push(TOWEL_PAT[i][0]); });
      sels.forEach(function (s, k) {
        var o = list[k] ? choice(s, list[k]) : null;
        s.value = o ? o.value : '';
        s.dispatchEvent(new Event('change', { bubbles: true }));
      });
      var t = total();
      box.querySelector('.tp-tw-cnt').textContent = '選択済み ' + t + '／' + n + '枚';
      var msg = box.querySelector('.tp-tw-msg');
      msg.textContent = t < n ? 'あと' + (n - t) + '枚選んでください。同じ柄を何枚でも選べます。' : '選べました。';
      msg.classList.toggle('is-done', t === n);
      hint.textContent = t < n ? '柄をあと' + (n - t) + '枚選ぶと、カートに入れられます。' : '';
      Array.prototype.forEach.call(box.querySelectorAll('.tp-tw-pat'), function (el) {
        var i = +el.dataset.i, out = el.querySelector('output');
        if (!out) return;
        out.textContent = count[i];
        el.classList.toggle('is-on', count[i] > 0);
        el.querySelector('[data-d="-1"]').disabled = count[i] === 0;
        el.querySelector('[data-d="1"]').disabled = t >= n;
      });
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-d]');
      if (!b) return;
      var i = +b.closest('.tp-tw-pat').dataset.i, d = +b.dataset.d;
      if (d > 0 && total() >= n) return;
      count[i] = Math.max(0, count[i] + d);
      sync();
    });
    // BASE は必須の柄が埋まるまで「カートに入れる」を押せなくする。灰色の理由が分かるよう、ボタンの上に残りの枚数を出す
    var cartBtn = form.querySelector('.purchaseButton__btn--addToCart');
    var hint = document.createElement('p');
    hint.className = 'tp-tw-hint';
    if (cartBtn) cartBtn.parentNode.insertBefore(hint, cartBtn);
    sync();
  }

  // Daily Botanical Socks（2026-11-03 新商品）: 見出しの2段目・ポイント・サイズ表・仕様表
  // 事実の出典はオーナーの商品説明と写真。素材の混率は未確認なので書かない
  var SOCKS = { '164953353': 1 };
  function socksPage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var detail = document.querySelector('.item-detail-inner');
    if (!SOCKS[id] || !detail || detail.dataset.tpSocks) return;
    detail.dataset.tpSocks = '1';
    // 見出し: テーマは「｜」より前だけを出すので、商品名の2つ目（MONSTERA MONDAY - …）を小さく添える
    var h1 = detail.querySelector('h1');
    var sub = (document.title.split(/[｜|]/)[1] || '').trim();
    if (h1 && sub) h1.innerHTML = esc(h1.textContent.trim()) + '<span class="tp-tw-sub">' + esc(sub) + '</span>';
    // 説明のブロック（ポイント・サイズ・仕様）は出さない。世界観を優先し、説明文をそのまま読んでもらう（2026-11-25 オーナー判断）
  }

  // SISHICRAFT のモンステラ2モデル（2026-11-04）: どちらのページにも「2つのモデル」の比較を出し、タイコンステレーションにはポイントと仕様表も足す
  // 呼び方は「通常／Premium」ではなく品種名（白斑／タイコンステレーション）で並べる（2026-11-04 オーナー決定）
  // 事実の出典はオーナーの商品説明・SISHI 公式の精緻版の仕様・写真。価格は BASE と手で合わせる（変えたらここも直す）
  var SISHI = {
    '143263775': { name: 'Monstera variegated', sub: '白い斑のモンステラ', price: '¥19,800', img: 'ddcc2cb431e28bbdae445da88bd24236.jpg' },
    '165042659': { name: 'Thai Constellation', sub: '気根モデル・クリーム〜黄色の斑', price: '¥29,800', img: '51ece75f9923ea085f0a8a04271f85c7.jpg' }
  };
  function sishiPage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var detail = document.querySelector('.item-detail-inner');
    if (!SISHI[id] || !detail || detail.dataset.tpSishi) return;
    detail.dataset.tpSishi = '1';
    var css = document.createElement('style');
    css.textContent =
      '.tp-sc-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}' +
      '.tp-sc-card{display:block;border:1px solid #e3e1dc;border-radius:12px;overflow:hidden;color:inherit;text-decoration:none;background:#fff}' +
      '.tp-sc-card.is-here{border:2px solid var(--tp-green,#22614c)}' +
      '.tp-sc-card img{display:block;width:100%;aspect-ratio:1;object-fit:cover}' +
      '.tp-sc-card span{display:block;padding:0 10px}' +
      '.tp-sc-card .tp-sc-tag{padding-top:8px;font-size:10px;letter-spacing:.06em;color:var(--tp-green,#22614c)}' +
      '.tp-sc-card .tp-sc-name{font-weight:600;font-size:14px;line-height:1.4}' +
      '.tp-sc-card .tp-sc-sub{font-size:11px;color:#6b6b6b;line-height:1.5}' +
      '.tp-sc-card .tp-sc-price{padding-bottom:10px;font-size:13px;margin-top:2px}' +
      '.tp-sc-table{table-layout:fixed;width:100%}.tp-sc-table th:first-child{width:5.6em;white-space:nowrap}';
    document.head.appendChild(css);
    var card = function (key) {
      var m = SISHI[key], here = key === id;
      return '<a class="tp-sc-card' + (here ? ' is-here' : '') + '" href="' + base + '/items/' + key + '">' +
        '<img src="https://baseec-img-mng.akamaized.net/images/item/origin/' + m.img + '?imformat=generic&amp;q=90&amp;im=Resize,width=480,height=480,aspect=fill,type=normal;Crop,width=480,height=480,gravity=Center" alt="SISHICRAFT モンステラ ' + esc(m.name) + '" loading="lazy">' +
        '<span class="tp-sc-tag">' + (here ? '表示中' : 'もうひとつのモデル') + '</span>' +
        '<span class="tp-sc-name">' + esc(m.name) + '</span><span class="tp-sc-sub">' + esc(m.sub) + '</span>' +
        '<span class="tp-sc-price">' + m.price + '</span></a>';
    };
    var compare =
      '<section><h2>2つのモデル</h2><div class="tp-sc-cards">' + card('143263775') + card('165042659') + '</div>' +
      '<table class="tp-ins-table tp-sc-table"><thead><tr><th></th><th>白斑</th><th>タイコン</th></tr></thead><tbody>' +
        '<tr><th>斑</th><td>白い斑</td><td>クリーム〜黄色の散り斑（タイコンステレーション）</td></tr>' +
        '<tr><th>気根</th><td>なし</td><td>茎に巻きつく気根まで革で表現</td></tr>' +
        '<tr><th>葉・茎</th><td colspan="2">植物タンニン鞣しのイタリアンレザー（手染め）</td></tr>' +
        '<tr><th>大きさ</th><td colspan="2">3枚葉・高さ約15cm</td></tr>' +
        '<tr><th>鉢</th><td colspan="2">SISHICRAFT 刻印入りの陶器鉢</td></tr>' +
        '<tr><th>価格</th><td>¥19,800</td><td>¥29,800</td></tr>' +
      '</tbody></table></section>';
    var ins = document.createElement('div');
    ins.className = 'tp-ins';
    if (id === '165042659') {
      ins.innerHTML =
        '<section><h2>3つのポイント</h2><div class="tp-ins-points">' +
          '<div><b>気根まで、すべて革で</b><span>茎に巻きつき、鉢の外で絡み合う気根まで革で仕立てています。表面はあえて少しざらつかせています。</span></div>' +
          '<div><b>タイコンステレーションの斑</b><span>クリーム〜黄色の斑と細かな散り斑を、一枚ずつ手で描いています。</span></div>' +
          '<div><b>日本で初めてのご紹介</b><span>数量限定の予約販売です。発送は12月1日から順次。</span></div>' +
        '</div></section>' +
        '<section><h2>仕様</h2><table class="tp-ins-table"><tbody>' +
          '<tr><th>品種</th><td>Monstera deliciosa \'Thai Constellation\'（3枚葉）</td></tr>' +
          '<tr><th>高さ</th><td>約15cm（個体差あり）</td></tr>' +
          '<tr><th>葉</th><td>植物タンニン鞣しのイタリアンレザー／日本製の顔料で手染め</td></tr>' +
          '<tr><th>茎・気根</th><td>植物タンニン鞣しのレザー（茎は向きを自由に曲げられます）</td></tr>' +
          '<tr><th>鉢</th><td>SISHICRAFT 刻印入りの陶器鉢</td></tr>' +
          '<tr><th>発送</th><td>予約販売・12月1日から順次</td></tr>' +
        '</tbody></table><p class="tp-ins-note">すべて手作業のため、形や斑の入り方には個体差があります。</p></section>' +
        compare;
    } else {
      ins.innerHTML = compare;
    }
    var acc = detail.querySelector('.tp-acc');
    var traits = detail.querySelector('.tp-pdp-traits');
    // 説明文が長いので、末尾ではなく書き出しの段落のすぐ後ろに置く
    var intro = traits && traits.firstElementChild;
    if (intro && intro.tagName === 'DIV') traits.insertBefore(ins, intro.nextSibling);
    else if (acc) acc.parentNode.insertBefore(ins, acc);
    else if (traits) traits.parentNode.insertBefore(ins, traits.nextSibling);
    else return;
    // 表と重なる説明文の節（ちがい・商品説明）は折りたたみの中へ移す
    if (traits && acc && id === '165042659') {
      var first = acc.firstChild;
      traits.querySelectorAll('h2').forEach(function (h) {
        if (!/ちがい|商品説明/.test(h.textContent)) return;
        var body = h.nextElementSibling;
        var d = document.createElement('details');
        d.innerHTML = '<summary>' + esc(h.textContent) + '</summary>';
        if (body && body.tagName === 'DIV') d.appendChild(body);
        acc.insertBefore(d, first);
        h.remove();
      });
    }
  }

  // TOP の PICK UP の先頭に新商品のソックスを足す（2026-11-03 オーナー依頼。テーマは文字数の上限に近いのでここで足す）
  // 写真はオーナー提供のパッケージ写真（public/shop/socks-pick.webp、2026-11-04 差し替え）。PC は5枚を1列に並べる
  function pickSocks() {
    var pick = document.querySelector('.tp-pick');
    if (!pick || pick.querySelector('.tp-card--socks')) return;
    var css = document.createElement('style');
    css.textContent = '.tp-pick .tp-card--socks{--card-bg:linear-gradient(180deg,#f1ece5 0%,#e3d9cc 100%)}' +
      '.tp-card .tp-card-new{display:inline-block;margin-right:6px;padding:1px 7px;border-radius:999px;background:var(--tp-green,#22614c);color:#fff;font-size:10px;letter-spacing:.06em;vertical-align:1px}' +
      '@media (min-width:1181px){.tp-wrap .tp-pick{grid-template-columns:repeat(5,1fr);gap:16px}.tp-pick .tp-card-name{font-size:22px}.tp-pick .tp-card-body{padding:26px 22px 0}}';
    document.head.appendChild(css);
    var card = document.createElement('article');
    card.className = 'tp-card tp-card--socks';
    card.innerHTML =
      '<a class="tp-card-link" href="' + base + '/items/164953353" aria-label="Daily Botanical Socksを見る"></a>' +
      '<div class="tp-card-body"><span class="tp-card-kind"><span class="tp-card-new">NEW</span>オリジナルソックス</span>' +
      '<span class="tp-card-name">Daily Botanical Socks</span><span class="tp-card-copy">ちょっと気分が上がる、特別な靴下。</span><span class="tp-card-price">¥2,000</span></div>' +
      '<div class="tp-card-photo"><img src="https://media.tokyoplants.com/shop/socks-pick.webp" alt="帯付きのパッケージに入った Daily Botanical Socks" loading="lazy"></div>';
    pick.insertBefore(card, pick.firstChild);
  }

  // TOP の PICK UP「Leather Botanical」にタイコンステレーションの気根モデル（2026-11-04 新商品）の色の丸を足す。テーマは文字数の上限に近いのでここで足す
  // テーマは DOMContentLoaded で各ボタンにクリックを付けるが、こちらが後から動いたときに備えて自前でも切り替える
  function pickSishi() {
    var card = document.querySelector('.tp-card--sishi');
    var vars = card && card.querySelector('.tp-vars');
    if (!vars || vars.querySelector('[data-path="/items/165042659"]')) return;
    var kind = card.querySelector('.tp-card-kind');
    // 「NEW」を足すと PC の5列で2行に折れて見出しの高さがそろわないので、ブランド名だけにする
    if (kind) kind.innerHTML = '<span class="tp-card-new">NEW</span>SISHICRAFT';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.img = 'https://media.tokyoplants.com/shop/pick-sishi-premium-2.jpg';
    btn.dataset.alt = 'SISHICRAFT タイコンステレーションのレザー作品（気根モデル）';
    btn.dataset.price = '¥29,800';
    btn.dataset.path = '/items/165042659';
    btn.setAttribute('aria-label', '鉢植え タイコンステレーション（緑／クリーム）');
    btn.innerHTML = '<i style="background:linear-gradient(135deg, #1f5c34 50%, #e6d6a2 50%)"></i>';
    vars.insertBefore(btn, vars.firstChild);
    var link = card.querySelector('.tp-card-link');
    var img = card.querySelector('.tp-card-photo img');
    var price = card.querySelector('.tp-card-price');
    var pick = function (b) {
      vars.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      img.src = b.dataset.img;
      img.parentNode.classList.toggle('is-cutout', b.dataset.cut === '1');
      img.alt = b.dataset.alt;
      price.textContent = b.dataset.price;
      link.href = link.href.replace(link.dataset.tpPath, b.dataset.path);
      link.dataset.tpPath = b.dataset.path;
    };
    vars.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) { e.preventDefault(); pick(b); }
    });
    // 最初に出すのはタイコンステレーション（台座の写真）。2026-11-04 に一度白斑にしたが、同日オーナー指示で戻した
    pick(btn);
  }

  // PICK UP の並び。新作の SISHICRAFT を先頭に（2026-11-04 オーナー依頼）、明るいカードと暗いカードが交互になるように並べる
  var PICK_ORDER = ['sishi', 'soil', 'socks', 'select', 'towel'];
  function pickOrder() {
    var list = document.querySelector('.tp-pick');
    if (!list) return;
    PICK_ORDER.forEach(function (k) {
      var c = list.querySelector(':scope > .tp-card--' + k);
      if (c) list.appendChild(c);
    });
  }

  // TOP のクリック計測（2026-11-17）。STORE のアイコン列と PICK UP のカードは同じ商品に飛ぶものがあり、
  // 移動先のページビューでは区別できないため、押した場所ごとに別のイベント名で送る。
  // 送り先はショップの GA4（G-TZ5ML4HS7P、プロパティ 381982667）だけ。BASE 側の測定IDには送らない。
  // link_url / link_text は GA4 の既定のディメンション（リンク先URL・リンクテキスト）で見られる。
  function topClickTracking() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.tp-coll a, .tp-pick a.tp-card-link');
      if (!a || typeof window.gtag !== 'function') return;
      var icon = a.closest('.tp-coll');
      var text = icon ? (a.querySelector('span') || a).textContent : (a.getAttribute('aria-label') || '').replace(/を見る$/, '');
      window.gtag('event', icon ? 'top_icon_click' : 'top_pickup_click', {
        send_to: 'G-TZ5ML4HS7P',
        link_url: a.href,
        link_text: text.trim(),
        transport_type: 'beacon'
      });
    }, true);
  }

  // ===== 商品ページの検索対策（2026-11-17） =====
  // 1) テーマ（initJsonLd）が作る Product の構造化データに、評価・送料・返品・説明・SKU を足す。
  //    評価は BASE の「良い／普通／悪い」を 3／2／1 として、その商品のレビュー全件（ページで隠している「悪い」も含む）で出す。
  //    隠した評価を除いて計算すると Google のガイドライン違反になるため、必ず全件で数える。
  //    送料はページの「※送料は¥800です」を読む（¥10,000以上は無料）。返品は特商法の表記どおり「欠陥品以外は不可」。
  // 2) 関連商品の画像に代替テキスト、中身の無い h1（非表示のコミュニティ見出し）を消す。
  // 3) 主力商品に「よくある質問」を出す（事実の出典: 商品説明・media の記事）。
  var ITEM_FAQ = {
    '99620939': [
      ['何号の鉢に、どのくらい使いますか？', '植え替えに使う土の量は、5号鉢で約0.9L、6号鉢で約1.5L、7号鉢で約2.5Lが目安です。2Lなら5号鉢2つ分・6号鉢1つ分です。7号以上の鉢や、複数の鉢をまとめて植え替えるときは10Lが便利です（10Lで5号鉢なら約11鉢分）。'],
      ['虫は出ませんか？', '有機質（ヤシの繊維・発酵樹皮・ミミズ堆肥・ピートモス）を約7割含むため、無機質が主体の土と比べると、コバエなどが出る可能性はあります。受け皿に水をためない、表面が乾いてから水をやる、といった管理でリスクを下げられます。虫をできるだけ避けたい場合は、無機質の <a href="' + base + '/items/142692278">HYDRO MINERAL</a> もご検討ください。'],
      ['肥料は入っていますか？', 'ミミズ堆肥（10%）を配合しており、カルシウム・マグネシウム・カリ・リン酸などの養分を含みます。成長期に生育を早めたいときは、市販の液体肥料を併用してください。'],
      ['どんな植物に向いていますか？', 'アンスリウム、モンステラ、フィロデンドロンなど、サトイモ科の熱帯植物に向けて配合しています。乾燥を好む多肉植物・塊根植物・サンスベリアや、着生植物のビカクシダには、それぞれ専用の配合の用土をおすすめします。'],
      ['2Lと10Lの違いは？', '中身は同じです。10Lは2L×5袋分の量を、4袋分の価格（¥4,800）でお求めいただけます。']
    ],
    '142692278': [
      ['ふつうの鉢でも使えますか？', '使えます。穴のあいた鉢では、水はけのよい無機用土として使えます。いちばん安定して育てられるのは、鉢の下に水をためるハイドロカルチャーや底面給水鉢です。'],
      ['何号の鉢に、どのくらい使いますか？', '鉢に入れる量は、5号鉢で約0.9L、6号鉢で約1.5Lが目安です。2Lで5〜6号鉢1つ分になります。'],
      ['肥料は必要ですか？', '緩効性肥料（オスモコート・エグザクト）を0.5%配合しているので、植え替えから約8〜9ヶ月は水だけで育てられます。'],
      ['虫は出にくいですか？', '富士山の溶岩石とゼオライトだけの無機用土で、虫のエサになる有機質を含まないため、土に比べて虫が発生しにくくなっています。'],
      ['石の大きさは？', '約3〜5mmです。アロカシア、モンステラ、フィロデンドロンなどの植え込みに使いやすい粒の大きさです。']
    ]
  };
  function itemFaq(id, detail) {
    var list = ITEM_FAQ[id];
    var acc = detail.querySelector('.tp-acc');
    if (!list || !acc || detail.querySelector('.tp-faq')) return;
    var box = document.createElement('div');
    box.className = 'tp-ins tp-faq';
    box.innerHTML = '<section><h2>よくある質問</h2><div class="tp-acc">' + list.map(function (qa) {
      return '<details><summary>' + esc(qa[0]) + '</summary><div>' + qa[1] + '</div></details>';
    }).join('') + '</div></section>';
    acc.parentNode.insertBefore(box, acc.nextSibling);
  }
  function itemAlts(detail) {
    document.querySelectorAll('.item-list-item').forEach(function (li) {
      var img = li.querySelector('img');
      if (!img || img.alt) return;
      var name = (li.querySelector('.name, .title, .item-title') || {}).textContent;
      if (name) img.alt = name.trim().slice(0, 120);
    });
    document.querySelectorAll('h1').forEach(function (h) { if (!h.textContent.trim()) h.remove(); });
  }
  function itemReviews(id, done) {
    var count = { g: 0, n: 0, b: 0 };
    (function page(p) {
      fetch(base + '/items/' + id + '/reviews?format=item&score=&page=' + p, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) {
          var rows = html.split('review01__listChild').slice(1);
          rows.forEach(function (c) {
            if (/ico--good/.test(c)) count.g++;
            else if (/ico--bad/.test(c)) count.b++;
            else if (/ico--normal/.test(c)) count.n++;
          });
          if (rows.length >= 20 && p < 10) page(p + 1); else done(count);
        })
        .catch(function () { done(count); });
    })(1);
  }
  var YUPACKET = { '135803882': 1, '164675173': 1, '164953353': 1, '164551101': 1 }; // タオル・タオル3枚セット・ソックス・ギフトバッグ
  // 八幡化成 Sen ローリーポット 丸（2026-11-25）: キャッチ・写真つきの3つのポイント・サイズの比較図・サイズとカラーの一覧を出す
  // 数値はカタログ（Sen_catalog_2026 p.5・p.8）。写真はメーカー提供（media/public/shop/sen/）。価格は BASE と手で合わせる（変えたらここも直す）
  var SEN = {
    '166998845': { size: 'S', d: 14.8, h: 10.4, vol: '1.2L', pd: 13.8, ph: 0.9, price: '¥2,600', ref: '5号鉢（直径15cm）とほぼ同じ' },
    '166998875': { size: 'M', d: 19.7, h: 13.9, vol: '2.9L', pd: 18.4, ph: 1.1, price: '¥3,800', ref: '6号鉢（直径18cm）と7号鉢（直径21cm）の間' }
  };
  var SEN_IMG = 'https://media.tokyoplants.com/shop/sen/';
  // 一緒に使う付属品（2026-11-26）。公開されている（ページが開ける）ものだけ「あわせて使う」に出す
  var SEN_ACC = [
    { id: '167062417', img: 'stand.jpg', name: 'チアーズスタンド 丸 S', sub: '鉢をのせて、高さを出すスタンド', price: '¥1,000', only: 'S' },
    { id: '167089954', img: 'rope.jpg', name: '専用ロープ（Sフック付）', sub: '吊り下げホールに通して、吊り鉢に', price: '¥1,000' }
  ];
  function senAccessories(ins, size) {
    var list = SEN_ACC.filter(function (a) { return !a.only || a.only === size; });
    Promise.all(list.map(function (a) {
      return fetch(base + '/items/' + a.id, { method: 'HEAD', credentials: 'same-origin' })
        .then(function (r) { return r.ok ? a : null; })
        .catch(function () { return null; });
    })).then(function (ok) {
      ok = ok.filter(Boolean);
      if (!ok.length) return;
      var sec = document.createElement('section');
      sec.innerHTML = '<h2>あわせて使う</h2><div class="tp-sen-cards tp-sen-acc">' + ok.map(function (a) {
        return '<a class="tp-sen-card" href="' + base + '/items/' + a.id + '">' +
          '<img src="' + SEN_IMG + a.img + '" alt="Sen ' + esc(a.name) + '" loading="lazy">' +
          '<span class="t">別売り</span><span class="n">' + esc(a.name) + '</span>' +
          '<span class="s">' + esc(a.sub) + '</span><span class="p">' + a.price + '</span></a>';
      }).join('') + '</div>' +
        (size === 'M' && ok.every(function (a) { return a.id !== '167062417'; }) ? '<p class="tp-ins-note">チアーズスタンドは S サイズ専用です。</p>' : '') +
        (size === 'S' && ok.some(function (a) { return a.id === '167062417'; }) ? '<p class="tp-ins-note">スタンドにのせるときは、受け皿は使いません。</p>' : '');
      ins.appendChild(sec);
    });
  }
  function senDiagram(id) {
    var k = 8, yb = 168, order = ['166998845', '166998875'], cxs = [96, 252], svg = '';
    order.forEach(function (key, n) {
      var m = SEN[key], here = key === id, cx = cxs[n];
      var w = m.d * k, h = m.h * k, pw = m.pd * k, ph = Math.max(m.ph * k, 6), top = yb - ph - h;
      var fill = here ? '#2f3833' : '#c9cdca', ink = here ? 'var(--tp-green,#22614c)' : '#8a8f8c';
      var P = function (fx, fy) { return (cx + fx * w).toFixed(1) + ',' + (top + fy * h).toFixed(1); };
      svg +=
        '<rect x="' + (cx - pw / 2).toFixed(1) + '" y="' + (yb - ph) + '" width="' + pw.toFixed(1) + '" height="' + ph + '" rx="3" fill="' + fill + '" opacity=".75"/>' +
        '<path d="M' + P(-0.43, 0) + ' C' + P(-0.5, 0.12) + ' ' + P(-0.53, 0.55) + ' ' + P(-0.45, 0.76) + ' C' + P(-0.38, 0.95) + ' ' + P(-0.31, 1) + ' ' + P(-0.24, 1) +
        ' L' + P(0.24, 1) + ' C' + P(0.31, 1) + ' ' + P(0.38, 0.95) + ' ' + P(0.45, 0.76) + ' C' + P(0.53, 0.55) + ' ' + P(0.5, 0.12) + ' ' + P(0.43, 0) + ' Z" fill="' + fill + '"/>' +
        '<path d="M' + P(-0.16, 0.02) + ' Q' + P(-0.19, 0.55) + ' ' + P(-0.12, 0.99) + ' M' + P(0.16, 0.02) + ' Q' + P(0.19, 0.55) + ' ' + P(0.12, 0.99) + '" stroke="#fff" stroke-opacity=".55" stroke-width="1" fill="none"/>' +
        '<text x="' + cx + '" y="' + (top - 8) + '" text-anchor="middle" font-size="11" fill="' + ink + '">直径' + m.d + 'cm</text>' +
        '<text x="' + cx + '" y="' + (yb + 22) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + ink + '">' + m.size + (here ? '（このページ）' : '') + '</text>' +
        '<text x="' + cx + '" y="' + (yb + 40) + '" text-anchor="middle" font-size="11.5" fill="' + ink + '">高さ' + m.h + 'cm・容量' + m.vol + '</text>' +
        '<text x="' + cx + '" y="' + (yb + 56) + '" text-anchor="middle" font-size="10.5" fill="#8a8f8c">受け皿 直径' + m.pd + 'cm</text>';
    });
    return '<svg class="tp-sen-svg" viewBox="0 0 350 232" role="img" aria-label="S と M の大きさの比較図"><line x1="10" y1="' + yb + '" x2="340" y2="' + yb + '" stroke="#e3e1dc"/>' + svg + '</svg>';
  }
  function senSelectColor(color) {
    var form = document.querySelector('.item-detail-inner form');
    if (!form) return;
    var btn = Array.prototype.find.call(form.querySelectorAll('button, label, a'), function (b) { return b.textContent.trim() === color; });
    if (btn) btn.click();
    else Array.prototype.forEach.call(form.querySelectorAll('select'), function (s) {
      var o = Array.prototype.find.call(s.options, function (op) { return op.textContent.trim() === color; });
      if (o) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }
    });
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function senCss() {
    if (document.getElementById('tp-sen-css')) return;
    var css = document.createElement('style');
    css.id = 'tp-sen-css';
    css.textContent =
      '.tp-sen-points{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}' +
      '.tp-sen-points figure{margin:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-sen-points img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}' +
      '.tp-sen-points figcaption{padding:12px 14px 14px}' +
      '.tp-sen-points b{display:block;font:700 14px/1.45 var(--tp-font);color:var(--tp-green,#22614c);margin-bottom:6px}' +
      '.tp-sen-points span{display:block;font:400 12.5px/1.65 var(--tp-font);color:var(--tp-ink,#1d1d1f)}' +
      '.tp-sen-size{background:#fff;border-radius:16px;padding:16px 12px 8px;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-sen-svg{display:block;width:100%;max-width:420px;height:auto;margin:0 auto;font-family:var(--tp-font)}' +
      '.tp-sen-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}' +
      '.tp-sen-card{display:block;border:1px solid #e3e1dc;border-radius:12px;overflow:hidden;color:inherit;text-decoration:none;background:#fff;cursor:pointer}' +
      '.tp-sen-card.is-here{border:2px solid var(--tp-green,#22614c)}' +
      '.tp-sen-card img{display:block;width:100%;aspect-ratio:1;object-fit:cover}' +
      '.tp-sen-card span{display:block;padding:0 10px}' +
      '.tp-sen-card .t{padding-top:8px;font-size:10px;letter-spacing:.06em;color:var(--tp-green,#22614c)}' +
      '.tp-sen-card .n{font-weight:600;font-size:14px;line-height:1.4}' +
      '.tp-sen-card .s{font-size:11px;color:#6b6b6b;line-height:1.5}' +
      '.tp-sen-card .p{padding-bottom:10px;font-size:13px;margin-top:2px}' +
      '.tp-sen-acc{grid-template-columns:repeat(2,1fr);max-width:520px}' +
      '@media (max-width:767px){.tp-sen-points{grid-template-columns:1fr}.tp-sen-cards{grid-template-columns:repeat(2,1fr)}}';
    document.head.appendChild(css);
  }
  function senPage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var detail = document.querySelector('.item-detail-inner');
    if (!SEN[id] || !detail || detail.dataset.tpSen) return;
    detail.dataset.tpSen = '1';
    senCss();

    // 見出しの下に、商品名の2つ目の区切り（キャッチ）を小さく添える（ソックスと同じ見せ方）
    var h1 = detail.querySelector('h1');
    var sub = (document.title.split(/[｜|]/)[1] || '').trim();
    if (h1 && sub && !h1.querySelector('.tp-tw-sub')) h1.innerHTML = esc(h1.textContent.trim()) + '<span class="tp-tw-sub">' + esc(sub) + '</span>';

    var card = function (key, color, file) {
      var m = SEN[key], here = key === id;
      return '<a class="tp-sen-card' + (here ? ' is-here' : '') + '" href="' + (here ? '#' : base + '/items/' + key) + '" data-color="' + color + '">' +
        '<img src="' + SEN_IMG + file + '" alt="Sen ローリーポット 丸 ' + m.size + ' ' + color + '" loading="lazy">' +
        '<span class="t">' + (here ? 'このページ' : 'ほかのサイズ') + '</span>' +
        '<span class="n">' + m.size + '・' + color + '</span>' +
        '<span class="s">直径' + m.d + 'cm・' + m.vol + '</span>' +
        '<span class="p">' + m.price + '</span></a>';
    };
    var m = SEN[id];
    var ins = document.createElement('div');
    ins.className = 'tp-ins';
    ins.innerHTML =
      '<section><h2>3つのポイント</h2><div class="tp-sen-points">' +
        '<figure><img src="' + SEN_IMG + 'set.jpg" alt="受け皿に載せた Sen ローリーポット（ブラック）" loading="lazy"><figcaption><b>鉢と受け皿が、同じ色</b><span>同じ素材・同じ色の専用プレート（受け皿）がセット。受け皿だけが浮いて見えることがありません。</span></figcaption></figure>' +
        '<figure><img src="' + SEN_IMG + 'texture.jpg" alt="グレーの受け皿の表面" loading="lazy"><figcaption><b>陶器のような、マットな質感</b><span>植物由来の繊維を配合したセルロースファイバー複合樹脂。軽く、割れにくい素材です（メーカー説明）。</span></figcaption></figure>' +
        '<figure><img src="' + SEN_IMG + 'slit.jpg" alt="光が抜ける Sen ローリーポットのスリット" loading="lazy"><figcaption><b>光と風が通るスリット</b><span>縦のスリットが空気と水の通り道に。鉢底ネットを敷かずに使えます。傾けても起き上がる、まるいかたちです。</span></figcaption></figure>' +
      '</div></section>' +
      '<section><h2>大きさを比べる</h2><div class="tp-sen-size">' + senDiagram(id) + '</div>' +
        '<p class="tp-ins-note">カタログの寸法から、縮尺をそろえて描いた図です。' + m.size + 'の直径' + m.d + 'cmは、' + m.ref + 'の大きさです。</p></section>' +
      '<section><h2>サイズとカラー</h2><div class="tp-sen-cards">' +
        card('166998845', 'ブラック', 'pot-s-bk.jpg') + card('166998845', 'グレー', 'pot-s-gy.jpg') +
        card('166998875', 'ブラック', 'pot-m-bk.jpg') + card('166998875', 'グレー', 'pot-m-gy.jpg') +
      '</div><p class="tp-ins-note">カラーはこのページの「種類」から、' + (m.size === 'S' ? 'M' : 'S') + 'サイズはカードからお選びいただけます。どちらも同じ色の受け皿付きです。</p></section>';
    ins.querySelectorAll('.tp-sen-card.is-here').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); senSelectColor(a.dataset.color); });
    });
    senAccessories(ins, m.size);
    var acc = detail.querySelector('.tp-acc');
    var traits = detail.querySelector('.tp-pdp-traits');
    var intro = traits && traits.firstElementChild;
    if (intro && intro.tagName === 'DIV') traits.insertBefore(ins, intro.nextSibling);
    else if (acc) acc.parentNode.insertBefore(ins, acc);
    else if (traits) traits.parentNode.insertBefore(ins, traits.nextSibling);
    else return;
    // 図と一覧に重なる説明文の節（サイズとカラー）は折りたたみの中へ移す
    if (traits && acc) {
      traits.querySelectorAll('h2').forEach(function (h) {
        if (!/サイズとカラー/.test(h.textContent) || ins.contains(h)) return;
        var body = h.nextElementSibling;
        var d = document.createElement('details');
        d.innerHTML = '<summary>' + esc(h.textContent) + '（数値）</summary>';
        if (body && body.tagName === 'DIV') d.appendChild(body);
        acc.insertBefore(d, acc.firstChild);
        h.remove();
      });
    }
  }

  // 定番商品のページを「写真つきの3つのポイント＋図」に（2026-11-25 オーナー依頼「Sen のような構成を他の商品にも」。スマホ前提）
  // テーマ（item.html の INSIGHT）や socksPage・sishiPage が出す文字だけのポイントを写真つきに置き換え、図の節を足す
  // 写真はその商品の BASE の商品画像。数値は商品説明文・テーマの仕様表と同じもの（変えたらここも直す）
  var BIMG = function (f, w) { return 'https://baseec-img-mng.akamaized.net/images/item/origin/' + f + '?imformat=generic&q=85&im=Resize,width=' + (w || 800) + ',type=normal'; };
  var SISHI_PAINT = ['6306e36ca6a9f4bd80d01b303de9c2cf.jpg', '筆で斑を描き入れている SISHICRAFT のレザーの葉', '台湾のレザーアーティストの手仕事', 'SISHICRAFT が裁断から染色、成形まで、すべて手作業で仕上げています。'];
  var RICH = {
    // I'm original SOIL
    '99620939': {
      points: [
        ['9bb9b1c47e8a6eb2f695f822ffcd9689.jpg', '手のひらにのせた I\'m original SOIL', '根が呼吸できる、粗めの粒', '粒が大きめで、土の中に空気の通り道ができます。水はけと保水を両立し、根腐れしにくい土です。'],
        ['2850eda46a2de132cf37f323dd627852.jpg', '並べた6種類の素材', '6種類の天然素材をブレンド', 'ヤシの繊維・日向石・蘭の発酵樹皮・ミミズ堆肥・ピートモス・パーライト。アンスリウム、モンステラなどサトイモ科の植物に。'],
        ['08b6582886d4ee5f9265c49d464cf353.jpg', '2L と 10L のパッケージ', '使う分だけ、ジップ付き', '2Lと10Lの2サイズ。使う分だけ取り出して、口を閉じて保管できます。']
      ],
      mats: [
        ['08d24ca81e68a4c70c5dfd51ecdeb00b.png', '#6b4f33', '天然ヤシの繊維', 30, '水はけと通気性を高める'],
        ['7189a8387c4d3d35a4586a255f891f84.png', '#9c8a72', '日向石', 20, '宮崎県の多孔質の軽石。根に酸素を届ける'],
        ['8081f351659ccc4c9f4db51731539c21.png', '#3f2f22', '蘭の発酵樹皮', 20, '水分を保ちながら通気性もキープ'],
        ['4bf21735df47576bf04e3d0100f82c12.png', '#22614c', 'ミミズ堆肥', 10, '天然の土壌改良材。土をふんわり保つ'],
        ['f0a5378247f7b071d6b9992159fe9ec1.png', '#7d6a4f', 'ピートモス', 10, '水分を保ち、乾燥を防ぐ'],
        ['6b0e75cadfe7774d21585cb75ad1910e.png', '#b8b4aa', 'パーライト', 10, '軽く、水はけと通気性を高める']
      ]
    },
    // HYDRO MINERAL
    '142692278': {
      points: [
        ['a885f550628ada49a7d2bcedf87e5c74.jpg', 'HYDRO MINERAL に植えたアロカシア', '土を使わない無機用土', '溶岩石とゼオライトだけ。虫のエサになる有機質を含まないので、清潔に扱えます。'],
        ['bbb9432140b0580c9dc193bc86655612.jpg', '富士山の溶岩石', '水と空気を両立', '無数の気泡を持つ多孔質の石が、水と空気の通り道をつくり、根腐れを防ぎます。'],
        ['ecfcde3c21a152db9166e547cb9fa1c3.jpg', 'HYDRO MINERAL のパッケージ', '肥料入りで、約8〜9ヶ月は水だけ', '緩効性肥料（オスモコート・エグザクト）を0.5%配合。植え替えから約8〜9ヶ月は肥料を足さずに育てられます。']
      ],
      mats: [
        ['bbb9432140b0580c9dc193bc86655612.jpg', '#5a4a43', '富士山の溶岩石', 75, '無数の気泡を持つ多孔質。根が呼吸しやすい'],
        ['6661a363862f6589377c2743cb349d84.jpg', '#b9b3a3', '島根県産ゼオライト', 25, '老廃物やアンモニアを吸着し、水を傷みにくくする']
      ]
    },
    // SISHICRAFT
    '143263775': { points: [SISHI_PAINT,
      ['b95a9fd58a66c79ec04b0c3882a26d3f.jpg', '手に持った斑入りモンステラの鉢植え', '植物タンニン鞣しのイタリアンレザー', '葉も茎もレザー。使うほどに表情が変わる、革ならではの経年変化を楽しめます。'],
      ['ddcc2cb431e28bbdae445da88bd24236.jpg', '台にのせた斑入りモンステラ', 'ひとつずつ違う表情', '手作業のため、形や斑の入り方に個体差があります。']] },
    '146918176': { points: [SISHI_PAINT,
      ['91f468db8bdd6810d5e4c28ea087f330.jpg', 'タイコンステレーションのキーホルダー', '植物タンニン鞣しのイタリアンレザー', '使うほどに表情が変わる、革ならではの経年変化を楽しめます。'],
      ['1cb729aed1faab6850569c283848c132.jpg', '箱に入ったキーホルダー', 'ひとつずつ違う表情', '手作業のため、形や斑の入り方に個体差があります。SISHICRAFT の箱入り。']] },
    '146918957': { points: [SISHI_PAINT,
      ['9ba40e909fd44c6ffd8d1d462b83f36d.jpg', 'アルボのしおり', '植物タンニン鞣しのイタリアンレザー', '使うほどに表情が変わる、革ならではの経年変化を楽しめます。'],
      ['0ee539c93ad26822696152c2d7bb7d38.jpg', '箱に入ったしおり', 'ひとつずつ違う表情', '手作業のため、形や斑の入り方に個体差があります。SISHICRAFT の箱入り。']] },
    '165042659': { points: [
      ['bcafeb63cd15b2831986994a3900e715.jpg', '鉢のまわりに絡む革の気根', '気根まで、すべて革で', '茎に巻きつき、鉢の外で絡み合う気根まで革で仕立てています。表面はあえて少しざらつかせています。'],
      ['51ece75f9923ea085f0a8a04271f85c7.jpg', 'タイコンステレーションの斑の葉', 'タイコンステレーションの斑', 'クリーム〜黄色の斑と細かな散り斑を、一枚ずつ手で描いています。'],
      ['272ceca6c6b91554be00a76ad952b3fa.jpg', '台にのせた気根モデル', '日本で初めてのご紹介', '数量限定の予約販売です。発送は12月1日から順次。']] },
    // MOCHI POT（テーマに要約ブロックがないので、節ごと作る）
    '140571906': {
      points: [
        ['62247ac7220290eb29743208d7bab973.png', '鉢の内側のメッシュ構造', '内側は、細かいメッシュ構造', '通気性と排水性を確保するため、鉢の内部に細かいメッシュ構造を採用しています。'],
        ['9f1a48ba51da110b6eef8605c6c1f253.png', '鉢と受け皿', '高さのある受け皿', '受け皿に高さを持たせて、水をしっかり溜められるようにしています。'],
        ['b9f874ba39df50583db2361153a390c1.png', 'OLIVE と GRAY の MOCHI POT', 'OLIVE と GRAY の2色', '3Dプリント（PETG）でつくった、ぷっくりした形。軽く、耐水性・耐久性に優れた素材です。']
      ]
    }
  };

  function richCss() {
    if (document.getElementById('tp-rich-css')) return;
    var css = document.createElement('style');
    css.id = 'tp-rich-css';
    css.textContent =
      '.tp-pts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}' +
      '.tp-pts figure{margin:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-pts img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}' +
      '.tp-pts figcaption{padding:12px 14px 14px}' +
      '.tp-pts b{display:block;font:700 15px/1.45 var(--tp-font);color:var(--tp-green,#22614c);margin-bottom:6px}' +
      '.tp-pts span{display:block;font:400 13px/1.7 var(--tp-font);color:var(--tp-ink,#1d1d1f)}' +
      '.tp-mats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;list-style:none;margin:12px 0 0;padding:0}' +
      '.tp-mats li{margin:0;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-mats img{display:block;width:100%;aspect-ratio:1;object-fit:cover}' +
      '.tp-mats div{padding:10px 12px 12px;border-top:4px solid var(--c)}' +
      '.tp-mats b{display:block;font:700 13.5px/1.4 var(--tp-font);color:var(--tp-ink,#1d1d1f)}' +
      '.tp-mats em{display:block;font:700 18px/1.3 var(--tp-font);font-style:normal;color:var(--tp-green,#22614c)}' +
      '.tp-mats small{display:block;margin-top:4px;font:400 12px/1.6 var(--tp-font);color:#555}' +
      '.tp-mats.is-two{grid-template-columns:1fr 1fr}' +
      '.tp-split{display:flex;height:30px;border-radius:8px;overflow:hidden;margin-top:8px;font:700 12px/30px var(--tp-font);color:#fff;text-align:center}' +
      '.tp-split i{font-style:normal;white-space:nowrap;overflow:hidden}' +
      '.tp-fig{background:#fff;border-radius:16px;padding:16px 10px 10px;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-fig svg{display:block;width:100%;max-width:480px;height:auto;margin:0 auto;font-family:var(--tp-font)}' +
      '.tp-fig + .tp-ins-table{margin-top:12px}' +
      '.tp-pick{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
      '.tp-pick button{display:block;width:100%;text-align:left;border:1px solid #e3e1dc;border-radius:14px;background:#fff;padding:12px;color:inherit;cursor:pointer;font-family:var(--tp-font)}' +
      '.tp-pick button.is-on{border:2px solid var(--tp-green,#22614c);padding:11px}' +
      '.tp-pick svg{display:block;width:auto;max-width:100%;height:64px;margin-bottom:8px}' +
      '.tp-pick b{display:block;font:700 18px/1.3 var(--tp-font)}' +
      '.tp-pick .pr{display:block;font:700 15px/1.4 var(--tp-font);color:var(--tp-green,#22614c)}' +
      '.tp-pick small{display:block;font:400 12px/1.6 var(--tp-font);color:#555;margin-top:4px}' +
      '@media (max-width:767px){.tp-pts{grid-template-columns:1fr}.tp-mats{grid-template-columns:1fr 1fr}}';
    document.head.appendChild(css);
  }
  function ptsHtml(list) {
    return '<div class="tp-pts">' + list.map(function (p) {
      return '<figure><img src="' + BIMG(p[0]) + '" alt="' + esc(p[1]) + '" loading="lazy"><figcaption><b>' + esc(p[2]) + '</b><span>' + esc(p[3]) + '</span></figcaption></figure>';
    }).join('') + '</div>';
  }
  function matsHtml(list) {
    return '<ul class="tp-mats' + (list.length === 2 ? ' is-two' : '') + '">' + list.map(function (m) {
      return '<li style="--c:' + m[1] + '"><img src="' + BIMG(m[0], 480) + '" alt="' + esc(m[2]) + '" loading="lazy"><div><em>' + m[3] + '%</em><b>' + esc(m[2]) + '</b><small>' + esc(m[4]) + '</small></div></li>';
    }).join('') + '</ul>';
  }
  function insSec(ins, re) {
    return Array.prototype.filter.call(ins.querySelectorAll(':scope > section'), function (s) {
      var h = s.querySelector('h2');
      return h && re.test(h.textContent);
    })[0];
  }
  function addSec(ins, html, beforeRe) {
    var s = document.createElement('section');
    s.innerHTML = html;
    var ref = beforeRe && insSec(ins, beforeRe);
    if (ref) ins.insertBefore(s, ref); else ins.appendChild(s);
    return s;
  }
  // 決まった値で散らばる乱数（描くたびに同じ図になるように）
  function seeded(n) { return function () { n = (n * 16807) % 2147483647; return (n - 1) / 2147483646; }; }

  // 土の断面: 一般的な土（細かい粒が詰まる）と SOIL（粗い粒のすき間を空気と水が通る）
  function soilSectionSvg() {
    var r = seeded(7), left = '', right = '', placed = [];
    for (var y = 0; y < 13; y++) for (var x = 0; x < 13; x++) {
      var px = 22 + x * 8.4 + (y % 2) * 4.2 + (r() - .5) * 2, py = 40 + y * 8 + (r() - .5) * 2;
      left += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="' + (4.6 + r() * .8).toFixed(1) + '" fill="' + ['#5b4632', '#6e5741', '#4a3a2a'][x % 3] + '"/>';
    }
    for (var i = 0; i < 3000 && placed.length < 40; i++) {
      var cx = 200 + r() * 128, cy = 26 + r() * 128, rad = 6 + r() * 6.5, ok = Math.hypot(cx - 264, cy - 90) < 62 + rad * .4;
      for (var j = 0; j < placed.length; j++) {
        var p = placed[j];
        if (!ok || Math.hypot(p[0] - cx, p[1] - cy) < p[2] + rad + 3) { ok = false; break; }
      }
      if (!ok) continue;
      placed.push([cx, cy, rad]);
      var col = ['#7a5a3a', '#c9bfae', '#3f2f22', '#9c8a72', '#e9e6df'][placed.length % 5];
      right += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="' + rad.toFixed(1) + '" ry="' + (rad * (.75 + r() * .2)).toFixed(1) + '" transform="rotate(' + Math.round(r() * 180) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')" fill="' + col + '"/>';
    }
    var arrow = function (x, y) { return '<path d="M' + x + ' ' + y + ' v-26 m-4 7 l4 -7 l4 7" stroke="#4a90c2" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; };
    return '<svg viewBox="0 0 350 210" role="img" aria-label="一般的な土と I\'m original SOIL の断面のイメージ">' +
      '<defs><clipPath id="tpc1"><circle cx="76" cy="90" r="62"/></clipPath><clipPath id="tpc2"><circle cx="264" cy="90" r="62"/></clipPath></defs>' +
      '<circle cx="76" cy="90" r="62" fill="#3a2d21"/><g clip-path="url(#tpc1)">' + left + '</g><circle cx="76" cy="90" r="62" fill="none" stroke="#d8d4cc"/>' +
      '<circle cx="264" cy="90" r="62" fill="#f4f1ea"/><g clip-path="url(#tpc2)">' + right + arrow(222, 140) + arrow(262, 128) + arrow(302, 138) + '</g><circle cx="264" cy="90" r="62" fill="none" stroke="var(--tp-green,#22614c)" stroke-width="2"/>' +
      '<text x="76" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#6b6b6b">一般的な土</text>' +
      '<text x="76" y="195" text-anchor="middle" font-size="12.5" fill="#6b6b6b">細かい粒が詰まりやすい</text>' +
      '<text x="264" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tp-green,#22614c)">I\'m original SOIL</text>' +
      '<text x="264" y="195" text-anchor="middle" font-size="12.5" fill="var(--tp-green,#22614c)">すき間を空気と水が通る</text>' +
      '</svg>';
  }
  // 鉢の大きさと土の量（5・6・7号を縮尺をそろえて描く。量の目安は ITEM_FAQ と同じ）
  function soilPotsSvg() {
    var pots = [[5, 15, 0.9], [6, 18, 1.5], [7, 21, 2.5]], k = 5.2, yb = 178, x = 11, svg = '';
    pots.forEach(function (p) {
      var w = p[1] * k, h = p[1] * k * .82, bw = w * .72, cx = x + w / 2, top = yb - h;
      var n2 = Math.floor(2 / p[2] + 1e-9), n10 = Math.floor(10 / p[2] + 1e-9);
      svg +=
        '<path d="M' + (cx - w / 2) + ' ' + top + ' L' + (cx + w / 2) + ' ' + top + ' L' + (cx + bw / 2) + ' ' + yb + ' L' + (cx - bw / 2) + ' ' + yb + ' Z" fill="#e9e4da"/>' +
        '<path d="M' + (cx - w / 2 + 4) + ' ' + (top + 8) + ' L' + (cx + w / 2 - 4) + ' ' + (top + 8) + ' L' + (cx + bw / 2 - 3) + ' ' + (yb - 3) + ' L' + (cx - bw / 2 + 3) + ' ' + (yb - 3) + ' Z" fill="#5b4632"/>' +
        '<rect x="' + (cx - w / 2 - 3) + '" y="' + (top - 6) + '" width="' + (w + 6) + '" height="7" rx="2" fill="#d6cfc2"/>' +
        '<text x="' + cx + '" y="' + (top + h / 2 + 10) + '" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">' + p[2] + 'L</text>' +
        '<text x="' + cx + '" y="' + (top - 14) + '" text-anchor="middle" font-size="15" font-weight="700" fill="var(--tp-ink,#1d1d1f)">' + p[0] + '号</text>' +
        '<text x="' + cx + '" y="' + (yb + 18) + '" text-anchor="middle" font-size="12" fill="#8a8f8c">直径' + p[1] + 'cm</text>' +
        '<text x="' + cx + '" y="' + (yb + 42) + '" text-anchor="middle" font-size="13.5" fill="var(--tp-ink,#1d1d1f)">' + (n2 ? '2Lで <tspan font-weight="700">' + n2 + '鉢</tspan>' : '2Lでは不足') + '</text>' +
        '<text x="' + cx + '" y="' + (yb + 62) + '" text-anchor="middle" font-size="13.5" fill="var(--tp-green,#22614c)">10Lで <tspan font-weight="700">' + n10 + '鉢</tspan></text>';
      x += w + 18;
    });
    return '<svg viewBox="0 0 350 248" role="img" aria-label="5号鉢は約0.9L、6号鉢は約1.5L、7号鉢は約2.5Lの土を使います"><line x1="4" y1="178" x2="346" y2="178" stroke="#e3e1dc"/>' + svg + '</svg>';
  }
  function bagSvg(n, big) {
    var s = '', w = big ? 26 : 34, h = big ? 40 : 52;
    for (var i = 0; i < n; i++) {
      var x = 4 + i * (w + 4), y = 62 - h, free = big && i === n - 1;
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="' + (free ? '#fff' : '#22614c') + '" stroke="#22614c" stroke-width="1.5"' + (free ? ' stroke-dasharray="3 2"' : '') + '/>' +
        '<rect x="' + (x + 4) + '" y="' + (y + 5) + '" width="' + (w - 8) + '" height="3" rx="1.5" fill="' + (free ? '#22614c' : '#fff') + '" opacity=".6"/>' +
        (free ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#22614c">無料</text>' : '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 6) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2L</text>');
    }
    return '<svg viewBox="0 0 ' + (n * (w + 4) + 4) + ' 64" preserveAspectRatio="xMinYMid meet" aria-hidden="true">' + s + '</svg>';
  }
  // HYDRO MINERAL の使い方（鉢の下に水をためる／ふつうの鉢）
  function hydroUseSvg() {
    var r = seeded(11);
    var stones = function (x0, y0, w, h) {
      var s = '';
      for (var y = 0; y < h; y += 9) for (var x = 0; x < w; x += 10) {
        s += '<circle cx="' + (x0 + x + 5 + (r() - .5) * 4).toFixed(1) + '" cy="' + (y0 + y + 4 + (r() - .5) * 3).toFixed(1) + '" r="' + (3.4 + r() * 1.6).toFixed(1) + '" fill="' + (r() < .75 ? '#5a4a43' : '#cfc9bb') + '"/>';
      }
      return s;
    };
    var plant = function (cx, y) { return '<path d="M' + cx + ' ' + y + ' C' + (cx - 2) + ' ' + (y - 24) + ' ' + (cx - 20) + ' ' + (y - 36) + ' ' + (cx - 34) + ' ' + (y - 40) + ' C' + (cx - 22) + ' ' + (y - 56) + ' ' + (cx - 4) + ' ' + (y - 46) + ' ' + cx + ' ' + y + ' M' + cx + ' ' + y + ' C' + (cx + 3) + ' ' + (y - 30) + ' ' + (cx + 22) + ' ' + (y - 48) + ' ' + (cx + 36) + ' ' + (y - 50) + ' C' + (cx + 30) + ' ' + (y - 30) + ' ' + (cx + 10) + ' ' + (y - 22) + ' ' + cx + ' ' + y + '" fill="#2f7d5b"/>'; };
    return '<svg viewBox="0 0 350 250" role="img" aria-label="鉢の下に水をためる使い方と、穴のあいたふつうの鉢での使い方">' +
      '<defs><clipPath id="tph1"><path d="M28 86 L148 86 L138 186 L38 186 Z"/></clipPath><clipPath id="tph2"><path d="M202 86 L322 86 L312 176 L212 176 Z"/></clipPath></defs>' +
      // 左: 穴のない鉢・水をためる
      plant(88, 92) +
      '<g clip-path="url(#tph1)"><rect x="20" y="152" width="140" height="40" fill="#bfe0f2"/>' + stones(30, 92, 116, 92) + '</g>' +
      '<path d="M28 86 L148 86 L138 186 L38 186 Z" fill="none" stroke="#9aa39f" stroke-width="2"/>' +
      '<path d="M58 176 v-18 m-4 6 l4 -6 l4 6 M88 176 v-18 m-4 6 l4 -6 l4 6 M118 176 v-18 m-4 6 l4 -6 l4 6" stroke="#2f7fb5" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="44" y="16" width="88" height="22" rx="11" fill="var(--tp-green,#22614c)"/><text x="88" y="31" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">いちばん安定</text>' +
      '<text x="88" y="210" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tp-ink,#1d1d1f)">鉢の下に水をためる</text>' +
      '<text x="88" y="228" text-anchor="middle" font-size="12" fill="#6b6b6b">ハイドロ・底面給水鉢</text>' +
      '<text x="88" y="244" text-anchor="middle" font-size="12" fill="#6b6b6b">必要な分だけ吸い上げる</text>' +
      // 右: 穴のあいた鉢
      plant(262, 92) +
      '<g clip-path="url(#tph2)">' + stones(204, 92, 116, 84) + '</g>' +
      '<path d="M202 86 L322 86 L312 176 L212 176 Z" fill="none" stroke="#9aa39f" stroke-width="2"/>' +
      '<path d="M252 176 h20" stroke="#fff" stroke-width="3"/>' +
      '<path d="M262 178 v12 m-4 -5 l4 5 l4 -5" stroke="#2f7fb5" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="206" y="192" width="112" height="6" rx="3" fill="#d6cfc2"/>' +
      '<text x="262" y="214" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tp-ink,#1d1d1f)">穴のあいたふつうの鉢</text>' +
      '<text x="262" y="232" text-anchor="middle" font-size="12" fill="#6b6b6b">水はけのよい用土として</text>' +
      '</svg>';
  }
  // MOCHI POT の大きさ（側面。内径・深さは点線）
  function mochiSizeSvg() {
    var k = 14, w = 11.5 * k, h = 9.8 * k, cx = 165, yb = 176, top = yb - h, iw = 8 * k, ih = 7 * k, s = '';
    for (var i = 0; i < 3; i++) {
      var ry = h / 6, cy = top + ry + i * h / 3;
      s += '<rect x="' + (cx - w / 2) + '" y="' + (cy - ry) + '" width="' + w + '" height="' + (ry * 2) + '" rx="' + ry + '" fill="#7d8a5a"/>';
    }
    return '<svg viewBox="0 0 350 236" role="img" aria-label="MOCHI POT は高さ約9.8cm、直径約11.5cm、内径約8cm・深さ約7cm">' +
      s + '<rect x="' + (cx - iw / 2) + '" y="' + top + '" width="' + iw + '" height="' + ih + '" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3"/>' +
      '<path d="M' + (cx - w / 2) + ' ' + (top - 12) + ' h' + w + ' M' + (cx - w / 2) + ' ' + (top - 16) + ' v8 M' + (cx + w / 2) + ' ' + (top - 16) + ' v8" stroke="#555" stroke-width="1.2"/>' +
      '<text x="' + cx + '" y="' + (top - 20) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tp-ink,#1d1d1f)">直径 約11.5cm</text>' +
      '<path d="M' + (cx + w / 2 + 14) + ' ' + top + ' v' + h + ' M' + (cx + w / 2 + 10) + ' ' + top + ' h8 M' + (cx + w / 2 + 10) + ' ' + yb + ' h8" stroke="#555" stroke-width="1.2"/>' +
      '<text x="' + (cx + w / 2 + 24) + '" y="' + (top + h / 2 - 4) + '" font-size="13" font-weight="700" fill="var(--tp-ink,#1d1d1f)">高さ</text>' +
      '<text x="' + (cx + w / 2 + 24) + '" y="' + (top + h / 2 + 13) + '" font-size="13" font-weight="700" fill="var(--tp-ink,#1d1d1f)">約9.8cm</text>' +
      '<line x1="40" y1="' + yb + '" x2="310" y2="' + yb + '" stroke="#e3e1dc"/>' +
      '<text x="175" y="' + (yb + 24) + '" text-anchor="middle" font-size="12.5" fill="#6b6b6b">3号鉢サイズ・重さ約133g</text>' +
      '<text x="175" y="' + (yb + 44) + '" text-anchor="middle" font-size="12.5" fill="#6b6b6b">点線は内側（内径約8cm・深さ約7cm）</text>' +
      '</svg>';
  }
  function soilPickOption(re) {
    var sel = document.querySelector('.item-detail-inner select[id^="x_optionSelect"]');
    if (!sel) return;
    var o = Array.prototype.filter.call(sel.options, function (op) { return re.test(op.text.trim()); })[0];
    if (o) { sel.value = o.value; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    sel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function richPage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var detail = document.querySelector('.item-detail-inner');
    // タオルは説明のブロックを出さない（世界観を優先、2026-11-25 オーナー判断）。柄の選択・まとめ買い・ギフトの案内は towelPage が出す
    if (TOWEL[id] && detail) Array.prototype.forEach.call(detail.querySelectorAll('.tp-ins'), function (e) { e.remove(); });
    var cfg = RICH[id];
    if (!cfg || !detail || detail.dataset.tpRich) return;
    detail.dataset.tpRich = '1';
    richCss();

    // MOCHI POT はテーマの要約ブロックがないので、書き出しの段落の後ろに作る（Sen と同じ位置）
    if (id === '140571906' && !detail.querySelector('.tp-ins')) {
      var box = document.createElement('div');
      box.className = 'tp-ins';
      box.innerHTML = '<section><h2>3つのポイント</h2><div class="tp-ins-points"></div></section>' +
        '<section><h2>大きさ</h2><div class="tp-fig">' + mochiSizeSvg() + '</div>' +
        '<table class="tp-ins-table"><tbody>' +
          '<tr><th>サイズ</th><td>3号鉢サイズ／高さ約9.8cm・直径約11.5cm</td></tr>' +
          '<tr><th>内側</th><td>内径約8cm・深さ約7cm</td></tr>' +
          '<tr><th>重さ</th><td>約133g</td></tr>' +
          '<tr><th>素材</th><td>PETG（3Dプリント）</td></tr>' +
          '<tr><th>カラー</th><td>OLIVE／GRAY（「種類」からお選びください）</td></tr>' +
        '</tbody></table><p class="tp-ins-note">3Dプリントのため、積層跡や細かなムラ、糸引きが見られる場合があります。</p></section>';
      var acc0 = detail.querySelector('.tp-acc');
      var traits0 = detail.querySelector('.tp-pdp-traits');
      var intro0 = traits0 && traits0.firstElementChild;
      if (intro0 && intro0.tagName === 'DIV') traits0.insertBefore(box, intro0.nextSibling);
      else if (acc0) acc0.parentNode.insertBefore(box, acc0);
      else if (traits0) traits0.parentNode.insertBefore(box, traits0.nextSibling);
      else return;
    }

    // 文字だけのポイントを、写真つきに置き換える
    Array.prototype.forEach.call(detail.querySelectorAll('.tp-ins .tp-ins-points'), function (old) {
      var d = document.createElement('div');
      d.innerHTML = ptsHtml(cfg.points);
      old.parentNode.replaceChild(d.firstChild, old);
    });
    var ins = detail.querySelector('.tp-ins');
    if (!ins) return;

    // 配合の凡例を、素材の写真つきのカードに
    if (cfg.mats) {
      var legend = ins.querySelector('.tp-ins-legend');
      if (legend) {
        var t = document.createElement('div');
        t.innerHTML = matsHtml(cfg.mats);
        legend.parentNode.replaceChild(t.firstChild, legend);
      }
    }

    if (id === '99620939') {
      var mix = insSec(ins, /^配合/);
      var bar = mix && mix.querySelector('.tp-ins-bar');
      if (bar) {
        var split = document.createElement('div');
        split.className = 'tp-split';
        split.setAttribute('role', 'img');
        split.setAttribute('aria-label', '有機質70%、無機質30%');
        split.innerHTML = '<i style="width:70%;background:#6b4f33">有機質 70%</i><i style="width:30%;background:#b8b4aa;color:#1d1d1f">無機質 30%</i>';
        bar.parentNode.insertBefore(split, bar.nextSibling);
      }
      var diff = insSec(ins, /違い/);
      var dt = diff && diff.querySelector('.tp-ins-table');
      if (dt) {
        var fig = document.createElement('div');
        fig.className = 'tp-fig';
        fig.innerHTML = soilSectionSvg();
        dt.parentNode.insertBefore(fig, dt);
      }
      addSec(ins, '<h2>鉢の大きさと土の量</h2><div class="tp-fig">' + soilPotsSvg() + '</div>' +
        '<p class="tp-ins-note">植え替えに使う土の量の目安です。鉢の形や根鉢の大きさで変わります。</p>', /^サイズ/);
      var size = insSec(ins, /^サイズ/);
      if (size) {
        size.innerHTML = '<h2>サイズ</h2><div class="tp-pick">' +
          '<button type="button" data-re="^2L">' + bagSvg(1, false) + '<b>2L</b><span class="pr">¥1,200</span><small>1Lあたり¥600<br>まずは少量から試したい方に</small></button>' +
          '<button type="button" data-re="^10L">' + bagSvg(5, true) + '<b>10L</b><span class="pr">¥4,800</span><small>1Lあたり¥480<br>2L×5袋分が、4袋分の価格</small></button>' +
          '</div><p class="tp-ins-note">中身は同じです。タップすると、サイズを選んだ状態で購入欄に移ります。</p>';
        var btns = size.querySelectorAll('button');
        var mark = function () {
          var sel = document.querySelector('.item-detail-inner select[id^="x_optionSelect"]');
          var cur = sel && sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text.trim() : '';
          Array.prototype.forEach.call(btns, function (b) { b.classList.toggle('is-on', !!cur && new RegExp(b.dataset.re).test(cur)); });
        };
        Array.prototype.forEach.call(btns, function (b) {
          b.addEventListener('click', function () { soilPickOption(new RegExp(b.dataset.re)); mark(); });
        });
        Array.prototype.forEach.call(document.querySelectorAll('.item-detail-inner select[id^="x_optionSelect"]'), function (s) { s.addEventListener('change', mark); });
        mark();
      }
    }
    if (id === '142692278') {
      addSec(ins, '<h2>使い方</h2><div class="tp-fig">' + hydroUseSvg() + '</div>' +
        '<p class="tp-ins-note">石の大きさは約3〜5mm。鉢に入れる量は、5号鉢で約0.9L、6号鉢で約1.5Lが目安です。</p>', /選び方/);
    }
  }

  // 植物（一点もの）のページ: 属ごとの「育て方の目安」を4つのアイコンで出し、media の育て方の記事へつなぐ（2026-11-25）
  // 値は media の育て方の記事（link の記事）から。湿度は「50%以上」に統一（2026-11-22 オーナー決定）
  var CARE = [
    [/^Anthurium\b/i, 'アンスリウム', 'guide/anthurium-care-for-beginners', [
      ['sun', '光', '明るい間接光。直射日光は葉焼けのもと'],
      ['drop', '水やり', '土の表面が乾き、鉢が軽くなってから'],
      ['temp', '冬の温度', '15℃以上が理想。10℃を下回らない場所に'],
      ['mist', '湿度', '50%以上。エアコンの風は直接当てない']]],
    [/^Alocasia\b/i, 'アロカシア', 'guide/alocasia-care-guide', [
      ['sun', '光', 'レースカーテン越しの明るい間接光。直射日光はNG'],
      ['drop', '水やり', '土が乾いてから。受け皿の水は捨てる'],
      ['temp', '冬の温度', '15℃以上を保つ（品種により異なる）'],
      ['mist', '湿度', '50%以上。冬の暖房の乾燥に注意']]],
    [/^Stephania\b/i, 'ステファニア', 'guide/stephania-kaweesakii-complete-guide', [
      ['sun', '光', '明るい間接光。直射日光で葉焼けする'],
      ['drop', '水やり', '土が完全に乾いてから。迷ったら1日待つ'],
      ['temp', '冬の温度', '最低10℃以上。5℃以下で塊根が傷む'],
      ['leaf', '育つ季節', '夏型。冬は落葉して休眠し、芽が出てから水やりを再開']]],
    [/^Phyllanthus\b/i, 'フィランサス', 'species/phyllanthus-urinaria-pink-variegated', [
      ['sun', '光', '明るい間接光。斑入りは光多めに、直射は不可'],
      ['drop', '水やり', '表土が乾いたらたっぷり。冬は乾いて2〜3日後'],
      ['temp', '冬の温度', '最低15℃以上。夜は窓際から離す'],
      ['mist', '湿度', '50%以上。乾燥すると葉先が茶色くなる']]],
    [/^Monstera\b/i, 'モンステラ', 'guide/monstera-care', [
      ['sun', '光', 'レースカーテン越しの明るい間接光を長時間'],
      ['drop', '水やり', '土が乾いてから、鉢底から流れるまで'],
      ['temp', '冬の温度', '10℃以上を確保する'],
      ['mist', '湿度', '50%以上。冬は葉水か加湿器で補う']]]
  ];
  var CARE_ICON = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
    drop: '<path d="M12 3c3.5 4.4 6 7.6 6 10.6A6 6 0 0 1 6 13.6C6 10.6 8.5 7.4 12 3Z"/>',
    temp: '<path d="M10 4a2 2 0 1 1 4 0v9.3a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
    mist: '<path d="M4 8c2.5-2 5.5-2 8 0s5.5 2 8 0M4 13c2.5-2 5.5-2 8 0s5.5 2 8 0M4 18c2.5-2 5.5-2 8 0s5.5 2 8 0"/>',
    leaf: '<path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15Z"/><path d="M5 19 13 11"/>'
  };
  function plantCarePage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var detail = document.querySelector('.item-detail-inner');
    if (!id || RICH[id] || SEN[id] || !detail || detail.dataset.tpCare) return;
    var title = (document.title.split(/[｜|│]/)[0] || '').replace(/^\s*[【<][^】>]*[】>]\s*/, '').trim();
    if (!/[｜|│]\s*観葉植物\s*$/.test(document.title.split(' | tokyoplants')[0])) return; // 商品名の最後が「｜観葉植物」の植物だけ
    var hit = CARE.filter(function (c) { return c[0].test(title); })[0];
    if (!hit) return;
    detail.dataset.tpCare = '1';
    richCss();
    var css = document.createElement('style');
    css.textContent =
      '.tp-care{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}' +
      '.tp-care div{background:#fff;border-radius:14px;padding:14px 12px;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-care svg{width:26px;height:26px;fill:none;stroke:var(--tp-green,#22614c);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;display:block;margin-bottom:6px}' +
      '.tp-care b{display:block;font:700 13px/1.4 var(--tp-font);color:var(--tp-green,#22614c)}' +
      '.tp-care span{display:block;margin-top:3px;font:400 13px/1.65 var(--tp-font);color:var(--tp-ink,#1d1d1f)}' +
      '.tp-care-go{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;padding:14px;border-radius:999px;background:var(--tp-green,#22614c);color:#fff !important;text-decoration:none;font:700 14px/1.3 var(--tp-font)}' +
      '@media (max-width:767px){.tp-care{grid-template-columns:1fr 1fr}}';
    document.head.appendChild(css);
    var box = document.createElement('div');
    box.className = 'tp-ins';
    box.innerHTML = '<section><h2>' + esc(hit[1]) + 'の育て方の目安</h2><div class="tp-care">' + hit[3].map(function (r) {
      return '<div><svg viewBox="0 0 24 24" aria-hidden="true">' + CARE_ICON[r[0]] + '</svg><b>' + esc(r[1]) + '</b><span>' + esc(r[2]) + '</span></div>';
    }).join('') + '</div>' +
      '<a class="tp-care-go" href="' + MEDIA + '/' + hit[2] + '?utm_source=shop&amp;utm_medium=item&amp;utm_content=care" target="_blank" rel="noopener">' + esc(hit[1]) + 'の育て方を詳しく読む</a>' +
      '<p class="tp-ins-note">属としての一般的な目安です。株の状態や季節に合わせて調整してください。</p></section>';
    var acc = detail.querySelector('.tp-acc');
    var traits = detail.querySelector('.tp-pdp-traits');
    var intro = traits && traits.firstElementChild;
    if (intro && intro.tagName === 'DIV') traits.insertBefore(box, intro.nextSibling);
    else if (acc) acc.parentNode.insertBefore(box, acc);
    else if (traits) traits.parentNode.insertBefore(box, traits.nextSibling);
  }


  // Sen の付属品（チアーズスタンド・専用ロープ）のページ（2026-11-27 オーナー「デザインも仕上げて」）。鉢のページと同じ見せ方
  var SEN_POTCARD = function (key, file, color) {
    var m = SEN[key];
    return '<a class="tp-sen-card" href="' + base + '/items/' + key + '">' +
      '<img src="' + SEN_IMG + file + '" alt="Sen ローリーポット 丸 ' + m.size + ' ' + color + '" loading="lazy">' +
      '<span class="t">鉢と受け皿のセット</span><span class="n">ローリーポット ' + m.size + '</span>' +
      '<span class="s">直径' + m.d + 'cm・' + m.vol + '</span><span class="p">' + m.price + '</span></a>';
  };
  function senColorCard(file, color, note) {
    return '<a class="tp-sen-card" href="#" data-color="' + color + '">' +
      '<img src="' + BIMG(file, 600) + '" alt="' + color + '" loading="lazy">' +
      '<span class="t">カラー</span><span class="n">' + color + '</span><span class="s">' + note + '</span><span class="p">「種類」から選ぶ</span></a>';
  }
  // スタンドの大きさ（側面。S の鉢と同じ縮尺で並べる）
  function standSvg() {
    var k = 7.4, yb = 172, sx = 128, sw = 16.9 * k, sh = 19.5 * k, top = yb - sh, px = 272, pw = 14.8 * k, ph = 10.4 * k, ptop = yb - ph;
    var waist = top + sh * .58;
    // 写真と同じ形: 上は外へ開いて鉢を受け、中ほどで細くくびれ、下は外へ広がって脚になる
    var leg = function (dir, w, col, sw2) {
      var xt = sx + dir * sw * .5 * w, xb = sx + dir * sw * .5 * w;
      return '<path d="M' + xt + ' ' + top + ' C' + xt + ' ' + (top + sh * .32) + ' ' + (sx + dir * 5 * w) + ' ' + (waist - sh * .12) + ' ' + (sx + dir * 4 * w) + ' ' + waist +
        ' C' + (sx + dir * 3 * w) + ' ' + (waist + sh * .2) + ' ' + xb + ' ' + (yb - sh * .12) + ' ' + (xb + dir * 4) + ' ' + yb + '" stroke="' + col + '" stroke-width="' + sw2 + '" fill="none" stroke-linecap="round"/>';
    };
    var P = function (fx, fy) { return (px + fx * pw).toFixed(1) + ',' + (ptop + fy * ph).toFixed(1); };
    return '<svg class="tp-sen-svg" viewBox="0 0 350 232" role="img" aria-label="チアーズスタンド 丸 S は幅16.9cm・高さ19.5cm。ローリーポット S は直径14.8cm">' +
      '<line x1="10" y1="' + yb + '" x2="340" y2="' + yb + '" stroke="#e3e1dc"/>' +
      leg(-1, .45, '#8a8f8c', 3.5) + leg(1, .45, '#8a8f8c', 3.5) + leg(-1, 1, '#2f3833', 5) + leg(1, 1, '#2f3833', 5) +
      '<rect x="' + (sx - 7) + '" y="' + (waist - 8) + '" width="14" height="16" rx="3" fill="#2f3833"/>' +
      '<path d="M' + (sx - sw / 2) + ' ' + (top - 12) + ' h' + sw + ' M' + (sx - sw / 2) + ' ' + (top - 16) + ' v8 M' + (sx + sw / 2) + ' ' + (top - 16) + ' v8" stroke="#8a8f8c" stroke-width="1.2"/>' +
      '<text x="' + sx + '" y="' + (top - 20) + '" text-anchor="middle" font-size="12" fill="var(--tp-green,#22614c)">幅16.9cm</text>' +
      '<path d="M' + (sx - sw / 2 - 12) + ' ' + top + ' v' + sh + ' M' + (sx - sw / 2 - 16) + ' ' + top + ' h8 M' + (sx - sw / 2 - 16) + ' ' + yb + ' h8" stroke="#8a8f8c" stroke-width="1.2"/>' +
      '<text x="' + (sx - sw / 2 - 18) + '" y="' + (top + sh / 2 - 2) + '" text-anchor="end" font-size="12" fill="var(--tp-green,#22614c)">高さ</text>' +
      '<text x="' + (sx - sw / 2 - 18) + '" y="' + (top + sh / 2 + 14) + '" text-anchor="end" font-size="12" fill="var(--tp-green,#22614c)">19.5cm</text>' +
      '<path d="M' + P(-0.43, 0) + ' C' + P(-0.5, 0.12) + ' ' + P(-0.53, 0.55) + ' ' + P(-0.45, 0.76) + ' C' + P(-0.38, 0.95) + ' ' + P(-0.31, 1) + ' ' + P(-0.24, 1) +
        ' L' + P(0.24, 1) + ' C' + P(0.31, 1) + ' ' + P(0.38, 0.95) + ' ' + P(0.45, 0.76) + ' C' + P(0.53, 0.55) + ' ' + P(0.5, 0.12) + ' ' + P(0.43, 0) + ' Z" fill="#c9cdca"/>' +
      '<text x="' + sx + '" y="' + (yb + 22) + '" text-anchor="middle" font-size="15" font-weight="700" fill="var(--tp-green,#22614c)">スタンド</text>' +
      '<text x="' + sx + '" y="' + (yb + 40) + '" text-anchor="middle" font-size="11.5" fill="#8a8f8c">組み立て後・68g</text>' +
      '<text x="' + px + '" y="' + (yb + 22) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#8a8f8c">鉢 S</text>' +
      '<text x="' + px + '" y="' + (yb + 40) + '" text-anchor="middle" font-size="11.5" fill="#8a8f8c">直径14.8cm</text>' +
      '</svg>';
  }
  var SEN_ACC_PAGE = {
    '167062417': {
      points: [
        ['4d2ede3054e9116246e35b850ef12558.jpg', 'スタンドにのせた Sen ローリーポット', '高低差で、飾り方が広がる', '鉢をのせると高さが生まれ、光と空気を取り込みやすく。限られたスペースでも、植物をバランスよく飾れます（メーカー説明）。'],
        ['00bc29f8b48cc50b5fb917b81fa4f985.jpg', '2つのパーツを組み合わせるところ', '2つのパーツを組むだけ', '2つのパーツを十字に組み合わせて使います。スタンドにのせるときは、受け皿は使いません。'],
        ['d576ddb9bde767c420366433f3349bf6.jpg', 'ゴールドのスタンドの脚', 'ゴールドとブラック', 'ポリカーボネート製・日本製。グレーの鉢にはゴールドで明るく、ブラックの鉢にはブラックで引き締めて。']
      ],
      size: function () { return '<section><h2>大きさ</h2><div class="tp-sen-size">' + standSvg() + '</div><p class="tp-ins-note">同じ縮尺で並べた図です。ローリーポット S（直径14.8cm）専用で、M サイズには使えません。</p></section>'; },
      colors: [['794c46b3fba658134c7ebd6096863384.jpg', 'ゴールド', 'グレーの鉢を明るく'], ['282a29f29e7c0f66e9020bf2313e59c7.jpg', 'ブラック', 'ブラックの鉢と一体に']],
      pots: function () { return SEN_POTCARD('166998845', 'pot-s-bk.jpg', 'ブラック') + SEN_POTCARD('166998845', 'pot-s-gy.jpg', 'グレー'); },
      potNote: 'ローリーポット S 専用です。スタンドにのせるときは、受け皿は使いません。',
      fold: /S 専用|組み合わせる|カラー/
    },
    '167089954': {
      points: [
        ['8b1c9f3c5f88db8b135097f4a339d447.jpg', 'ロープで吊るした Sen ローリーポット', '宙に浮かぶ、吊り鉢に', '棚や床から離して吊るすと、葉の流れや垂れ下がるつるが、いっそう美しく見えます。'],
        ['a4bb571cae366c6bef1de90ea36062e5.jpg', 'ロープを通した鉢のアップ', 'スリット上部のホールに通すだけ', '鉢のスリット上部にある小さな穴（吊り下げホール）にロープを通して結びます。'],
        ['711fb74b36d7b78394ea0f37ea351bb2.jpg', 'グレーのロープと S字フック', 'S字フック付き・2本入り', '直径2mm × 長さ1.5m のロープが2本と、スチールの S字フックが1個。'
        ]
      ],
      steps: [
        ['a700d3406a4119fd90853d8372c0b704.jpg', 'ロープの先を結び、吊り下げホールに内側から通します。'],
        ['a3d5ab0639a5e0daefc3862b7f40bd6b.jpg', '対角側のホールに外側から内側へ通し、結びます。'],
        ['98845c74e08c98ecedee213de399956d.jpg', 'もう1本のロープも、残りの2つのホールに同じように通します。'],
        ['11477f9ee2859f345629c3434170505b.jpg', '上で長さを調整して、S字フックに掛けます。']
      ],
      colors: [['711fb74b36d7b78394ea0f37ea351bb2.jpg', 'グレー', 'グレーの鉢になじむ'], ['cb6b64fca5f8fd3499205f86b10b6e17.jpg', 'ブラック', 'ブラックの鉢と一体に']],
      pots: function () { return SEN_POTCARD('166998845', 'pot-s-gy.jpg', 'グレー') + SEN_POTCARD('166998875', 'pot-m-gy.jpg', 'グレー'); },
      potNote: 'ローリーポットの S・M どちらにも使えます。',
      fold: /ローリーポットに|取り付け方|カラー/
    }
  };
  function senAccPage() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var cfg = SEN_ACC_PAGE[id];
    var detail = document.querySelector('.item-detail-inner');
    if (!cfg || !detail || detail.dataset.tpSenAcc) return;
    detail.dataset.tpSenAcc = '1';
    senCss();
    richCss();
    var css = document.createElement('style');
    css.textContent =
      '.tp-sen-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;counter-reset:st}' +
      '.tp-sen-steps figure{margin:0;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.05)}' +
      '.tp-sen-steps img{display:block;width:100%;aspect-ratio:3/2;object-fit:cover}' +
      '.tp-sen-steps figcaption{padding:10px 12px 12px;font:400 12.5px/1.65 var(--tp-font);color:var(--tp-ink,#1d1d1f)}' +
      '.tp-sen-steps figcaption:before{counter-increment:st;content:counter(st);display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin-right:6px;border-radius:50%;background:var(--tp-green,#22614c);color:#fff;font-weight:700;font-size:11px}' +
      '.tp-sen-two{grid-template-columns:repeat(2,1fr) !important;max-width:520px}' +
      '@media (max-width:767px){.tp-sen-steps{grid-template-columns:1fr 1fr}}';
    document.head.appendChild(css);
    var h1 = detail.querySelector('h1');
    var sub = (document.title.split(/[｜|]/)[1] || '').trim();
    if (h1 && sub && !h1.querySelector('.tp-tw-sub')) h1.innerHTML = esc(h1.textContent.trim()) + '<span class="tp-tw-sub">' + esc(sub) + '</span>';
    var ins = document.createElement('div');
    ins.className = 'tp-ins';
    ins.innerHTML =
      '<section><h2>3つのポイント</h2>' + ptsHtml(cfg.points) + '</section>' +
      (cfg.size ? cfg.size() : '') +
      (cfg.steps ? '<section><h2>取り付け方</h2><div class="tp-sen-steps">' + cfg.steps.map(function (s) {
        return '<figure><img src="' + BIMG(s[0], 600) + '" alt="" loading="lazy"><figcaption>' + esc(s[1]) + '</figcaption></figure>';
      }).join('') + '</div></section>' : '') +
      '<section><h2>カラー</h2><div class="tp-sen-cards tp-sen-two">' + cfg.colors.map(function (c) { return senColorCard(c[0], c[1], c[2]); }).join('') + '</div></section>' +
      '<section><h2>使える鉢</h2><div class="tp-sen-cards tp-sen-two">' + cfg.pots() + '</div><p class="tp-ins-note">' + cfg.potNote + '</p></section>';
    ins.querySelectorAll('.tp-sen-card[data-color]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); senSelectColor(a.dataset.color); });
    });
    var acc = detail.querySelector('.tp-acc');
    var traits = detail.querySelector('.tp-pdp-traits');
    var intro = traits && traits.firstElementChild;
    if (intro && intro.tagName === 'DIV') traits.insertBefore(ins, intro.nextSibling);
    else if (acc) acc.parentNode.insertBefore(ins, acc);
    else if (traits) traits.parentNode.insertBefore(ins, traits.nextSibling);
    else return;
    // 図・カードと重なる説明文の節は折りたたみの中へ
    if (traits && acc) {
      traits.querySelectorAll('h2').forEach(function (h) {
        if (!cfg.fold.test(h.textContent) || ins.contains(h)) return;
        var body = h.nextElementSibling;
        var d = document.createElement('details');
        d.innerHTML = '<summary>' + esc(h.textContent) + '</summary>';
        if (body && body.tagName === 'DIV') d.appendChild(body);
        acc.insertBefore(d, acc.firstChild);
        h.remove();
      });
    }
  }
  // 他社の商品（仕入れ品）は、テーマが定番品に付ける「TOKYOPLANTS ORIGINAL」を書き換える（2026-11-25 Sen ローリーポット）
  var BRAND_LABEL = [[/Sen ローリーポット|Roly Pot/, 'SELECTED ITEM  /  HACHIMAN']];
  function itemBrandLabel(detail) {
    var over = detail.querySelector('.tp-pdp-over');
    var name = (detail.querySelector('h1') || {}).textContent || '';
    var hit = BRAND_LABEL.find(function (b) { return b[0].test(name); });
    if (over && hit) over.textContent = hit[1];
  }
  function itemSeo() {
    var id = (path.match(/^\/items\/(\d+)/) || [])[1];
    var detail = document.querySelector('.item-detail-inner');
    if (!id || !detail) return;
    itemBrandLabel(detail);
    itemAlts(detail);
    itemFaq(id, detail);
    (function wait(t) {
      var ld = Array.prototype.find.call(document.querySelectorAll('script[type="application/ld+json"]'), function (s) { return /"@type":"Product"/.test(s.textContent); });
      var ship = Array.prototype.find.call(document.querySelectorAll('.item-detail p.attention, p.attention'), function (p) { return /送料/.test(p.textContent) && p.querySelector('b'); });
      if ((!ld || !ship) && t < 50) return setTimeout(function () { wait(t + 1); }, 100);
      if (!ld) return;
      var data;
      try { data = JSON.parse(ld.textContent); } catch (e) { return; }
      if (ld.dataset.tpSeo) return;
      ld.dataset.tpSeo = '1';
      var desc = (document.querySelector('meta[name="description"]') || {}).content || '';
      if (desc) data.description = desc.slice(0, 500);
      data.sku = id;
      data.productID = id;
      var offer = data.offers || {};
      var price = Number(offer.price) || 0;
      offer.itemCondition = 'https://schema.org/NewCondition';
      offer.seller = { '@type': 'Organization', name: 'tokyoplants' };
      // ページの「※送料は<b>¥800</b>です」を読む。読めないとき（Google の描画など）は、案内ページの送料表どおり
      // ゆうパケットの商品は¥500、それ以外はゆうパックの¥800（どちらも¥10,000以上は無料）
      var shown = ship && ((ship.querySelector('b') || ship).textContent.match(/[¥￥]\s*([\d,]+)/) || [])[1];
      var fee = price >= 10000 ? 0 : shown ? Number(shown.replace(/,/g, '')) : (YUPACKET[id] ? 500 : 800);
      if (fee >= 0) {
        offer.shippingDetails = {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: fee, currency: 'JPY' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'JP' }
        };
      }
      offer.hasMerchantReturnPolicy = {
        '@type': 'MerchantReturnPolicy', applicableCountry: 'JP',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
      };
      data.offers = offer;
      itemReviews(id, function (c) {
        var total = c.g + c.n + c.b;
        if (total > 0) {
          data.aggregateRating = {
            '@type': 'AggregateRating', ratingValue: Math.round((3 * c.g + 2 * c.n + c.b) / total * 100) / 100,
            bestRating: 3, worstRating: 1, ratingCount: total, reviewCount: total
          };
        }
        ld.textContent = JSON.stringify(data);
      });
      ld.textContent = JSON.stringify(data); // 評価の取得に失敗しても、送料・返品は先に入れておく
    })(0);
  }

  function run() {
    if (path === '/') { pickSocks(); pickSishi(); pickOrder(); topClickTracking(); }
    var style = document.createElement('style');
    style.id = 'tp-pages-css';
    style.textContent = CSS;
    document.head.appendChild(style);
    hideCommunityLinks();
    footer();
    if (/^\/about\/?$/.test(path)) aboutPage();
    if (/^\/membership\/?$/.test(path)) membershipPage();
    if (/^\/community\/?$/.test(path)) communityPage();
    // テーマ（item.html）が購入欄を並べ替え・選択欄をボタン化し終えてから動かす（先に動くと二重表示・選択画面なしになる）
    (function wait(t) {
      if (document.querySelector('.item-detail-inner .tp-choice, .item-detail-inner .tp-sets') || t > 40) towelPage();
      else setTimeout(function () { wait(t + 1); }, 100);
    })(0);
    // ソックス・SISHICRAFT: テーマが説明文を節に分け終えてから（.tp-acc ができてから）動かす
    if (/^\/items\/\d+/.test(path)) (function waitSocks(t) {
      if (document.querySelector('.item-detail-inner .tp-acc') || t > 40) { socksPage(); sishiPage(); senPage(); senAccPage(); richPage(); plantCarePage(); itemSeo(); }
      else setTimeout(function () { waitSocks(t + 1); }, 100);
    })(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
