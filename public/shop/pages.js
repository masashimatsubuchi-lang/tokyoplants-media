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
    '.tp-pg{max-width:980px;margin:0 auto;font-family:var(--tp-font);color:var(--tp-ink,#1d1d1f);text-align:left}',
    '.tp-pg *{box-sizing:border-box}',
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

  function run() {
    var style = document.createElement('style');
    style.id = 'tp-pages-css';
    style.textContent = CSS;
    document.head.appendChild(style);
    hideCommunityLinks();
    footer();
    if (/^\/about\/?$/.test(path)) aboutPage();
    if (/^\/membership\/?$/.test(path)) membershipPage();
    if (/^\/community\/?$/.test(path)) communityPage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
