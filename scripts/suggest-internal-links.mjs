#!/usr/bin/env node
/**
 * 「検出 - インデックス未登録」の記事に、内部リンクを張る元の候補を探す。
 *
 *   node scripts/suggest-internal-links.mjs targets.txt   # 1行1slug（category/slug）
 *
 * リンク元の条件は3つ。
 *   1. GSCで検索流入がある（Googleが実際に巡回している記事からしか辿られない）
 *   2. 対象と話題が近い（IDF重み付きコサイン類似度 0.12 以上）
 *   3. まだ対象へリンクしていない
 * 並び順は 類似度 × log(クリック数) で、「近くて、かつ巡回されている」順。
 *
 * ⚠️ 出力はあくまで候補。類似0.15前後は別属・別話題の取り違えが混じるので、
 * 文脈として自然に置けるかは必ず人が判断すること。機械的に挿入しない。
 *
 * 前提: scratchpad の gsc-pages.tsv（node scripts/gsc-queries.mjs --dim page --tsv で作る）
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const CATS = ["guide", "soil", "research", "review", "species"];
const STOP = new Set(["観葉植物","の","と","は","が","を","に","で","も","な","する","こと","ため","方法","ガイド","完全","おすすめ","解説","紹介","育て方","原因","対策","選び方","特徴"]);
function toks(t){
  const c=t.replace(/[｜|、。・（）()【】「」\[\]".,:;!?\/]/g," ").toLowerCase();
  const o=new Set();
  for(const w of c.split(/\s+/).filter(Boolean)){
    if(/^[a-z0-9-]+$/.test(w)){ if(w.length>2)o.add(w); continue; }
    for(let n=2;n<=4;n++) for(let i=0;i+n<=w.length;i++){const g=w.slice(i,i+n); if(!STOP.has(g))o.add(g);}
  }
  return o;
}
const posts=[];
for(const c of CATS) for(const f of readdirSync(join("content",c)).filter(x=>x.endsWith(".md"))){
  const g=matter(readFileSync(join("content",c,f),"utf8"));
  const slug=`${c}/${f.slice(0,-3)}`;
  posts.push({slug, title:g.data.title??"", tok:toks(`${g.data.title??""} ${g.data.description??""} ${(g.data.tags??[]).join(" ")}`), body:g.content});
}
const df=new Map();
for(const p of posts) for(const t of p.tok) df.set(t,(df.get(t)??0)+1);
const idf=t=>Math.log(posts.length/(1+(df.get(t)??0)));
const sim=(a,b)=>{
  let num=0,na=0,nb=0;
  for(const t of a.tok){const w=idf(t);na+=w*w; if(b.tok.has(t))num+=w*w;}
  for(const t of b.tok){const w=idf(t);nb+=w*w;}
  return na&&nb?num/Math.sqrt(na*nb):0;
};
// 検索流入のあるページ（＝リンク元として価値がある）
const traffic=new Map();
for(const line of readFileSync("/private/tmp/claude-501/-Users-masashimatsubuchi-my-first-project/8b9715f6-5505-4af7-b63d-f855ba500404/scratchpad/gsc-pages.tsv","utf8").split("\n").slice(1)){
  const [u,c]=line.split("\t"); if(!u) continue;
  traffic.set(u.replace("https://media.tokyoplants.com/","").replace(/\/$/,""), Number(c)||0);
}
const targets=readFileSync(process.argv[2],"utf8").split("\n").filter(Boolean).map(s=>s.trim());
const byslug=new Map(posts.map(p=>[p.slug,p]));

for(const t of targets){
  const tp=byslug.get(t); if(!tp){console.log(`?? ${t}`);continue;}
  const cands=posts
    .filter(p=>p.slug!==t && traffic.has(p.slug) && !p.body.includes(`/${t}`))
    .map(p=>({slug:p.slug,title:p.title,s:sim(tp,p),clicks:traffic.get(p.slug)??0}))
    .filter(x=>x.s>=0.12)
    .sort((a,b)=>(b.s*Math.log(2+b.clicks))-(a.s*Math.log(2+a.clicks)))
    .slice(0,3);
  console.log(`\n■ ${t}\n   ${tp.title}`);
  if(!cands.length){console.log("   → 関連の強い記事が見つからない（手動検討）");continue;}
  for(const c of cands) console.log(`   ← ${c.slug}  (類似${c.s.toFixed(2)} / クリック${c.clicks})  ${c.title.slice(0,34)}`);
}
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const CATS = ["guide", "soil", "research", "review", "species"];
const STOP = new Set(["観葉植物","の","と","は","が","を","に","で","も","な","する","こと","ため","方法","ガイド","完全","おすすめ","解説","紹介","育て方","原因","対策","選び方","特徴"]);
function toks(t){
  const c=t.replace(/[｜|、。・（）()【】「」\[\]".,:;!?\/]/g," ").toLowerCase();
  const o=new Set();
  for(const w of c.split(/\s+/).filter(Boolean)){
    if(/^[a-z0-9-]+$/.test(w)){ if(w.length>2)o.add(w); continue; }
    for(let n=2;n<=4;n++) for(let i=0;i+n<=w.length;i++){const g=w.slice(i,i+n); if(!STOP.has(g))o.add(g);}
  }
  return o;
}
const posts=[];
for(const c of CATS) for(const f of readdirSync(join("content",c)).filter(x=>x.endsWith(".md"))){
  const g=matter(readFileSync(join("content",c,f),"utf8"));
  const slug=`${c}/${f.slice(0,-3)}`;
  posts.push({slug, title:g.data.title??"", tok:toks(`${g.data.title??""} ${g.data.description??""} ${(g.data.tags??[]).join(" ")}`), body:g.content});
}
const df=new Map();
for(const p of posts) for(const t of p.tok) df.set(t,(df.get(t)??0)+1);
const idf=t=>Math.log(posts.length/(1+(df.get(t)??0)));
const sim=(a,b)=>{
  let num=0,na=0,nb=0;
  for(const t of a.tok){const w=idf(t);na+=w*w; if(b.tok.has(t))num+=w*w;}
  for(const t of b.tok){const w=idf(t);nb+=w*w;}
  return na&&nb?num/Math.sqrt(na*nb):0;
};
// 検索流入のあるページ（＝リンク元として価値がある）
const traffic=new Map();
for(const line of readFileSync("/private/tmp/claude-501/-Users-masashimatsubuchi-my-first-project/8b9715f6-5505-4af7-b63d-f855ba500404/scratchpad/gsc-pages.tsv","utf8").split("\n").slice(1)){
  const [u,c]=line.split("\t"); if(!u) continue;
  traffic.set(u.replace("https://media.tokyoplants.com/","").replace(/\/$/,""), Number(c)||0);
}
const targets=readFileSync(process.argv[2],"utf8").split("\n").filter(Boolean).map(s=>s.trim());
const byslug=new Map(posts.map(p=>[p.slug,p]));

for(const t of targets){
  const tp=byslug.get(t); if(!tp){console.log(`?? ${t}`);continue;}
  const cands=posts
    .filter(p=>p.slug!==t && traffic.has(p.slug) && !p.body.includes(`/${t}`))
    .map(p=>({slug:p.slug,title:p.title,s:sim(tp,p),clicks:traffic.get(p.slug)??0}))
    .filter(x=>x.s>=0.12)
    .sort((a,b)=>(b.s*Math.log(2+b.clicks))-(a.s*Math.log(2+a.clicks)))
    .slice(0,3);
  console.log(`\n■ ${t}\n   ${tp.title}`);
  if(!cands.length){console.log("   → 関連の強い記事が見つからない（手動検討）");continue;}
  for(const c of cands) console.log(`   ← ${c.slug}  (類似${c.s.toFixed(2)} / クリック${c.clicks})  ${c.title.slice(0,34)}`);
}
