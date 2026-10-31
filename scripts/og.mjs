// 페이지별 공유(og) 이미지 만들기 — 사이트 빌드와 별개인 손작업 도구
// 필요: Playwright(전역 설치), 로컬 글꼴 Familjen Grotesk · Noto Sans KR · Noto Sans TC
// 실행: node scripts/build.mjs && NODE_PATH=$(npm root -g) node scripts/og.mjs [key...]
//   --missing  이미지가 아직 없는 페이지만 (새 글을 올린 뒤)
//   --all      전부 다시 (디자인을 바꾼 뒤). 인자가 없으면 --all 과 같다
// 결과: public/og/<key>.jpg (1200×630). 빌드는 파일이 있으면 그 페이지의 og:image로 쓴다.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "public", "og");
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const pages = JSON.parse(fs.readFileSync(path.join(DIST, "og-pages.json"), "utf8"));
const args = process.argv.slice(2);
const missingOnly = args.includes("--missing");
const only = args.filter((a) => !a.startsWith("--"));
const wm = fs.readFileSync(path.join(DIST, "index.html"), "utf8").match(/<svg class="brand-wm"[\s\S]*?<\/svg>/)[0].replace('class="brand-wm"', 'class="wm"');
const b64 = (f) => fs.readFileSync(path.join(ROOT, "public", "brand", f)).toString("base64");
const IMG = { learn: b64("path-learn.jpg"), live: b64("path-live.jpg"), build: b64("path-build.jpg"), hero: b64("hero-wide.jpg") };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 글꼴: 로컬 가변 글꼴 파일을 직접 넣는다 (~/.fonts)
const FD = [path.join(os.homedir(), ".fonts"), "/usr/share/fonts/truetype"].find((d) => fs.existsSync(path.join(d, "FamiljenGrotesk[wght].ttf"))) || path.join(os.homedir(), ".fonts");
const face = (fam, file) => fs.existsSync(path.join(FD, file)) ? `@font-face{font-family:"${fam}";src:url(data:font/ttf;base64,${fs.readFileSync(path.join(FD, file)).toString("base64")});font-weight:100 900}` : "";
const FONTS = face("Familjen Grotesk", "FamiljenGrotesk[wght].ttf") + face("Noto Sans KR", "NotoSansKR[wght].ttf") + face("Noto Sans TC", "NotoSansTC[wght].ttf");

const STATUS = { en: "In formation · Not taking donations yet", ko: "설립 준비 중 · 아직 기부를 받지 않습니다" };
const TAG = { en: "Light for learning. Glass for giving.", ko: "배움에는 빛을, 기부에는 창을." };
const pick = (key) => { const k = ["learn", "live", "build"]; let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return k[h % 3]; };

const base = (lang) => `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#E3CAB6;color:#161514;font-family:${lang === "ko" ? '"Noto Sans KR","Familjen Grotesk"' : '"Familjen Grotesk","Noto Sans KR"'},sans-serif;-webkit-font-smoothing:antialiased}
.wm{display:block;fill:#161514}
.zh{font-family:"Noto Sans TC",sans-serif;font-weight:500;letter-spacing:.24em}
.foot{position:absolute;left:64px;right:64px;bottom:44px;display:flex;justify-content:space-between;align-items:baseline;font-weight:600;font-size:21px;letter-spacing:${lang === "ko" ? "0" : ".005em"}}`;

function pageHTML(pg) {
  const ko = pg.lang === "ko";
  if (pg.key === "home" || pg.key === "ko--home") {
    return `<!doctype html><meta charset="utf-8"><style>${FONTS}${base(pg.lang)}
.bg{position:absolute;inset:0;background:url(data:image/jpeg;base64,${IMG.hero}) center 34%/cover}
.foot{left:44px;right:44px;bottom:38px}</style>
<div class="bg"></div><div class="foot"><span>${esc(TAG[pg.lang])}</span><span class="zh">明窗基金會</span><span>${esc(STATUS[pg.lang])}</span></div>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>${FONTS}${base(pg.lang)}
.photo{position:absolute;top:0;right:0;width:440px;height:630px;background:url(data:image/jpeg;base64,${IMG[pick(pg.key)]}) center 62%/cover}
.photo::before{content:"";position:absolute;inset:0 auto 0 0;width:90px;background:linear-gradient(90deg,#E3CAB6,rgba(227,202,182,0))}
.col{position:absolute;left:64px;top:56px;width:640px;bottom:118px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:22px}
.top .wm{width:118px;height:auto}
.kick{font-weight:600;font-size:21px;padding-left:22px;border-left:1.5px solid rgba(22,21,20,.45);line-height:1.1}
.mid{margin-top:auto}
h1{font-weight:${ko ? 700 : 650};letter-spacing:${ko ? "-.03em" : "-.035em"};line-height:${ko ? 1.16 : 1.0};word-break:keep-all;overflow-wrap:break-word}
p.d{margin-top:22px;font-size:25px;line-height:1.42;color:#2A2420;font-weight:${ko ? 400 : 450};word-break:keep-all;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.foot{right:440px;padding-right:56px;border-top:1.5px solid rgba(22,21,20,.3);padding-top:18px;bottom:40px}
.foot .st{font-weight:500;color:#2A2420;font-size:19px}</style>
<div class="photo"></div>
<div class="col"><div class="top">${wm}${pg.kicker ? `<span class="kick">${esc(pg.kicker)}</span>` : ""}</div>
<div class="mid"><h1>${esc(pg.title)}</h1>${pg.desc ? `<p class="d">${esc(pg.desc)}</p>` : ""}</div></div>
<div class="foot"><span>${esc(TAG[pg.lang])}</span><span class="st">${ko ? "설립 준비 중" : "In formation"}</span></div>`;
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let n = 0;
for (const pg of pages) {
  if (only.length && !only.includes(pg.key)) continue;
  if (missingOnly && fs.existsSync(path.join(OUT, pg.key + ".jpg"))) continue;
  await page.setContent(pageHTML(pg), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // 제목 크기 맞추기: 크게 시작해 3줄·가로 폭 안에 들 때까지 줄인다, 설명은 제목이 길면 2줄로
  await page.evaluate(() => {
    const h = document.querySelector("h1"); if (!h) return;
    const d = document.querySelector("p.d");
    for (let s = 92; s >= 44; s -= 2) {
      h.style.fontSize = s + "px";
      const lines = Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight));
      const mid = document.querySelector(".mid").getBoundingClientRect(), top = document.querySelector(".top").getBoundingClientRect();
      if (h.scrollWidth <= h.clientWidth + 1 && lines <= 3 && mid.top >= top.bottom + 28) break;
      if (d && lines >= 2) d.style.webkitLineClamp = "2";
    }
  });
  await page.screenshot({ path: path.join(OUT, pg.key + ".jpg"), type: "jpeg", quality: 86 });
  n++;
}
await browser.close();
console.log(`og → public/og/ (${n} images)`);
