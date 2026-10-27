// Oriel Foundation — 정적 사이트 빌드 (영어 기본 /, 한국어 /ko/)
// 외부 패키지 없음. 실행: node scripts/build.mjs → dist/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { markdown, frontmatter, esc } from "./lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const S = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8"));
const BASE = ((process.env.BASE_PATH || "/").replace(/\/?$/, "/")).replace(/^\/?/, "/");
const ORIGIN = (process.env.SITE_URL || (S.domain ? `https://${S.domain}` : "https://probe2928-crypto.github.io")).replace(/\/$/, "");
const ABS = ORIGIN + BASE;
const hash = (f) => { try { const b = fs.readFileSync(path.join(ROOT, "public", f)); let h = 0; for (const x of b) h = (h * 31 + x) >>> 0; return h.toString(36); } catch { return "0"; } };
const V = { css: hash("style.css"), js: hash("app.js") };

fs.rmSync(DIST, { recursive: true, force: true });
const write = (rel, html) => { const p = path.join(DIST, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); };
const copyDir = (from, to) => { if (!fs.existsSync(from)) return; fs.cpSync(from, path.join(DIST, to), { recursive: true }); };

/* ---------- 문구 ---------- */
const T = {
  en: {
    lang: "en", htmlLang: "en", pre: "", other: "ko", otherLabel: "한국어", otherShort: "KO",
    name: S.name, tag: "Light for learning. Glass for giving.",
    desc: "Oriel is a foundation in the making for children in Southeast Asia: learning first, then everyday support, then the classrooms and schools a community asks for. Every gift traceable on-chain.",
    nav: [["plan/", "Plan"], ["partners/", "Partners"], ["journal/", "Journal"], ["get-involved/", "Get involved", "Join"], ["about/", "About"]],
    join: "Join the founding circle", readPlan: "Read the plan",
    status: "Founding stage. We are not taking donations yet. Giving opens once the foundation is registered, and every transaction will be public from the first one.",
    heroLede: "We are a foundation in the making for children in Southeast Asia. We start with learning, add the everyday support that keeps a child in class, and grow toward the roads, buildings and schools a community needs.",
    heroNote: "Every gift will be traceable on a public blockchain.",
    oriel: "The oriel window",
    eyebrow: ["A foundation in formation", "Southeast Asia"], sub: "Foundation", joinShort: "Join",
    pathTitle: "Learn, live, build",
    pathLede: "Three steps, in this order. We take the next one only when the one before it works and a local partner asks for it.",
    path: [
      ["Learn", "Tutoring, books, school supplies, reading corners and scholarships, run with local teachers."],
      ["Live", "Meals, clean water, health checks and a safe way to get to school. The things that decide whether a child keeps showing up."],
      ["Build", "Classrooms, libraries, toilets, safe paths and, when a community asks for it, a whole school."],
    ],
    chainTitle: "Proof, not promises",
    chainLede: "Charity runs on trust. We want ours to run on records anyone can check.",
    chain: [
      ["A public wallet", "Gifts in stablecoins and crypto go to one published address. Anyone can follow them on a block explorer."],
      ["Spending you can trace", "Each payout is linked to a receipt, the partner who received it and what it paid for."],
      ["Reports people can read", "Every quarter, a short report in English and Korean, with the on-chain record next to it."],
    ],
    chainNote: "Card and bank gifts will be welcome too, and logged on the same record.",
    howTitle: "How we work",
    how: [
      ["Local people lead", "Teachers, parents and community groups on the ground decide what is needed. We fund and support; we don't parachute in."],
      ["Children are never the attraction", "No orphanage visits, no short trips to play with kids, no volunteer left alone with a child. We send skills, not sightseers."],
      ["Every photo has consent", "We photograph with a guardian's written consent, never at a child's lowest moment, and we never publish where a child lives."],
      ["Small first, then bigger", "One community and one partner before we take on a second. Buildings come only after the programs inside them work."],
    ],
    roadTitle: "Where we are going",
    now: "Now",
    journalTitle: "Field journal",
    journalLede: "Notes, photos and numbers from the work, posted as it happens.",
    journalEmpty: "The first field notes arrive with the first trip.",
    allPosts: "See every post",
    partnerTitle: "Partners",
    partnerText: "CHAINBRIEF, a crypto news outlet, is our media partner and will report our progress gift by gift.",
    quratorText: "QURATOR, an art docent service from the same founders, has pledged a share of its revenue. Its gifts begin once we are registered and will be recorded in our public ledger.",
    partnerWanted: "We are looking for a first local partner in Southeast Asia: a school, community group or registered NGO already working with children.",
    becomePartner: "Talk to us about partnering",
    ctaTitle: "Open the first window with us",
    ctaText: "Join the founding circle and we'll write to you when giving opens, when we pick our first community, and when there's a way to help that fits what you do.",
    footStatus: "Oriel Foundation is in formation and not yet a registered charity.",
    footLinks: [["notes/", "Notes"], ["faq/", "Questions"], ["partners/", "Partner process"], ["safeguarding/", "Safeguarding"], ["transparency/", "Transparency"], ["get-involved/", "Contact"]],
    ledgerTitle: "The ledger so far", ledgerLede: "We keep our own progress the way we will keep every gift: in order, dated, and public. Each block is a set of things we actually finished.", block: "Block", nextBlock: "Next block", follow: "Follow", channels: "Channels",
    media: "Media partner",
    notesTitle: "Notes", notesLede: "What we are reading on giving, children's education and on-chain transparency. Every item links to its source.", notesEmpty: "The first notes are on their way.", allNotes: "All notes", sources: "Sources", zhSummary: "繁體中文摘要",
    rights: "Oriel Foundation (in formation)",
    readMore: "Read",
    posted: "Posted",
    photosNote: "Photos are published with consent under our safeguarding policy.",
    back: "All journal posts",
    skip: "Skip to content",
    menu: "Menu",
  },
  ko: {
    lang: "ko", htmlLang: "ko", pre: "ko/", other: "en", otherLabel: "English", otherShort: "EN",
    name: S.name_ko, tag: "배움에는 빛을, 기부에는 창을.",
    desc: "오리엘은 동남아시아 아이들을 위해 준비 중인 재단입니다. 배움에서 시작해 생활을 돕고, 마을이 원하는 교실과 학교까지 짓습니다. 모든 기부는 블록체인에 기록됩니다.",
    nav: [["plan/", "계획"], ["partners/", "파트너"], ["journal/", "활동 일지"], ["get-involved/", "함께하기"], ["about/", "소개"]],
    join: "창립 서포터 신청", readPlan: "계획 보기",
    status: "설립 준비 단계입니다. 아직 기부를 받지 않습니다. 재단 등록을 마친 뒤 기부를 열고, 첫 거래부터 모두 공개합니다.",
    heroLede: "동남아시아 아이들을 위해 준비 중인 재단입니다. 배움에서 시작해, 아이가 계속 학교에 올 수 있게 하는 생활 지원을 더하고, 마을에 필요한 길과 건물, 학교까지 짓는 것이 목표입니다.",
    heroNote: "모든 기부는 공개 블록체인에서 확인할 수 있게 됩니다.",
    oriel: "오리엘 창",
    eyebrow: ["설립 준비 중", "동남아시아"], sub: "Foundation", joinShort: "참여하기",
    pathTitle: "배우고, 살고, 짓는다",
    pathLede: "세 단계를 이 순서대로 밟습니다. 앞 단계가 제대로 돌아가고 현지 파트너가 원할 때만 다음으로 넘어갑니다.",
    path: [
      ["배움", "현지 선생님과 함께하는 보충수업, 책과 학용품, 독서 공간, 장학금."],
      ["생활", "급식, 깨끗한 물, 건강검진, 안전한 등굣길. 아이가 계속 학교에 나올 수 있느냐를 가르는 것들."],
      ["짓기", "교실, 도서관, 화장실, 안전한 길, 그리고 마을이 원할 때는 학교 한 채."],
    ],
    chainTitle: "약속 대신 기록으로",
    chainLede: "기부는 신뢰로 움직입니다. 우리는 그 신뢰를 누구나 확인할 수 있는 기록으로 증명하려 합니다.",
    chain: [
      ["공개 지갑", "스테이블코인과 암호화폐 기부는 공개된 주소 하나로만 받습니다. 누구나 블록 탐색기에서 흐름을 볼 수 있습니다."],
      ["추적되는 지출", "모든 지출은 영수증, 받은 파트너, 쓰인 곳과 함께 기록합니다."],
      ["읽히는 보고서", "분기마다 영어·한국어로 짧은 보고서를 내고, 온체인 기록을 함께 붙입니다."],
    ],
    chainNote: "카드·계좌 기부도 받을 예정이며, 같은 기록에 함께 남깁니다.",
    howTitle: "일하는 원칙",
    how: [
      ["현지 사람들이 이끈다", "필요한 것은 현장의 선생님, 부모, 마을 단체가 정합니다. 우리는 돈과 손을 보탤 뿐, 밖에서 결정해 들이밀지 않습니다."],
      ["아이는 구경거리가 아니다", "보육원 방문, 아이들과 놀아주는 단기 봉사는 하지 않습니다. 봉사자가 아이와 단둘이 있는 일도 없습니다. 구경꾼 대신 기술을 보냅니다."],
      ["모든 사진은 동의를 받는다", "보호자의 서면 동의를 받아 촬영하고, 아이가 가장 힘든 순간은 찍지 않으며, 아이가 사는 곳은 공개하지 않습니다."],
      ["작게 시작해 크게", "한 마을, 한 파트너와 먼저 해낸 뒤에 다음 마을로 갑니다. 건물은 그 안의 프로그램이 돌아간 다음에 짓습니다."],
    ],
    roadTitle: "가려는 길",
    now: "지금",
    journalTitle: "활동 일지",
    journalLede: "현장의 기록과 사진, 숫자를 일어나는 대로 올립니다.",
    journalEmpty: "첫 현장 기록은 첫 방문과 함께 올라옵니다.",
    allPosts: "전체 보기",
    partnerTitle: "파트너",
    partnerText: "코인 뉴스 매체 체인브리프(CHAINBRIEF)가 미디어 파트너로서 기부 하나하나의 진행을 보도합니다.",
    quratorText: "같은 운영진이 만든 미술 도슨트 서비스 QURATOR가 수익의 일부를 기부하기로 약정했습니다. 기부는 재단 등록 후 시작되고, 공개 장부에 기록됩니다.",
    partnerWanted: "동남아시아에서 함께할 첫 현지 파트너를 찾고 있습니다. 이미 아이들과 일하고 있는 학교, 마을 단체, 등록된 NGO라면 연락 주세요.",
    becomePartner: "파트너 문의하기",
    ctaTitle: "첫 창을 함께 열어 주세요",
    ctaText: "창립 서포터로 신청하시면 기부가 열릴 때, 첫 마을을 정할 때, 하시는 일에 맞는 도움 방법이 생길 때 연락드립니다.",
    footStatus: "오리엘 재단은 설립 준비 중이며 아직 등록된 공익단체가 아닙니다.",
    footLinks: [["notes/", "읽을거리"], ["faq/", "자주 묻는 질문"], ["partners/", "파트너 절차"], ["safeguarding/", "아동보호 정책"], ["transparency/", "투명성"], ["get-involved/", "문의"]],
    ledgerTitle: "지금까지의 장부", ledgerLede: "앞으로 모든 기부를 기록할 방식 그대로, 우리의 진행도 순서대로, 날짜와 함께, 공개로 남깁니다. 블록 하나는 실제로 끝낸 일들의 묶음입니다.", block: "블록", nextBlock: "다음 블록", follow: "팔로우", channels: "채널",
    media: "미디어 파트너",
    notesTitle: "읽을거리", notesLede: "기부, 아이들의 교육, 온체인 투명성에 관해 우리가 읽고 있는 것들. 모든 항목에 출처를 답니다.", notesEmpty: "첫 읽을거리가 곧 올라옵니다.", allNotes: "전체 보기", sources: "출처", zhSummary: "繁體中文摘要",
    rights: "오리엘 재단 (설립 준비 중)",
    readMore: "읽기",
    posted: "게시",
    photosNote: "사진은 아동보호 정책에 따라 동의를 받아 게시합니다.",
    back: "활동 일지 전체",
    skip: "본문으로 건너뛰기",
    menu: "메뉴",
  },
};

/* ---------- 브랜드 도형 ---------- */
// 워드마크: Familjen Grotesk 800, 자간 -0.055em, 소문자 'oriel' — 윤곽선 path라 글꼴 없이도 똑같이 보인다
const WM = `<g transform="scale(1,-1)"><path transform="translate(0 0)" d="M330 -15Q181 -15 108 70Q34 156 34 300Q34 444 108 530Q181 615 330 615Q479 615 552 530Q626 444 626 300Q626 156 552 70Q479 -15 330 -15ZM330 93Q396 93 427 145Q458 197 458 300Q458 404 427 456Q396 507 330 507Q264 507 233 456Q202 404 202 300Q202 197 233 145Q264 93 330 93Z"/><path transform="translate(594 0)" d="M72 0V600H220V490H244Q250 520 266 546Q283 573 317 590Q351 606 408 606H440V460H396Q311 460 272 417Q234 374 234 288V0Z"/><path transform="translate(998 0)" d="M74 0V600H236V0ZM155 669Q112 669 90 692Q68 714 68 750Q68 786 90 808Q112 831 155 831Q198 831 220 808Q242 786 242 750Q242 714 220 692Q198 669 155 669Z"/><path transform="translate(1242 0)" d="M325 -15Q183 -15 108 70Q34 155 34 301Q34 399 68 469Q101 539 166 577Q230 615 323 615Q457 615 528 534Q600 453 600 296V262H192Q197 186 232 142Q266 99 325 99Q372 99 400 127Q429 155 438 192H592Q583 137 552 90Q521 43 465 14Q409 -15 325 -15ZM192 364H442Q438 432 408 470Q378 507 322 507Q267 507 234 472Q200 436 192 364Z"/><path transform="translate(1806 0)" d="M123 0Q95 32 84 72Q72 113 72 179V800H234V196Q234 120 251 78Q268 35 296 6V0Z"/></g>`;
const wordmark = (cls = "wm") => `<svg class="${cls}" viewBox="20 -845 2110 875" role="img" aria-label="Oriel"><title>Oriel</title>${WM}</svg>`;
const logo = (cls = "logo-mark") => wordmark(cls);

// 첫 화면: 창으로 들어온 햇빛이 떨어진 복숭아색 회벽(렌더 이미지, 워드마크 포함) + 둘레의 작은 라벨
function heroLight(t) {
  const ko = t.lang === "ko";
  const labs = ko
    ? [["01 배움", "현지 선생님과 함께하는 보충수업, 책, 장학금"], ["02 생활", "급식, 깨끗한 물, 안전한 등굣길"], ["03 짓기", "마을이 원할 때만 교실과 도서관"], ["온체인", "모든 기부와 지출을 공개 장부에"]]
    : [["01 Learn", "Tutoring, books and scholarships with local teachers"], ["02 Live", "Meals, clean water, a safe way to school"], ["03 Build", "Classrooms and libraries, only when a community asks"], ["On-chain", "Every gift and payout on a public ledger"]];
  return `<section class="hero-light" aria-labelledby="hero-title">
  <picture><source media="(max-width: 720px)" srcset="${BASE}brand/hero-tall.jpg"><img class="hero-img" src="${BASE}brand/hero-wide.jpg" alt="${esc(ko ? "창으로 들어온 햇빛이 복숭아색 벽에 떨어져 있고, 그 위에 oriel이라고 쓰여 있다" : "Sunlight from an arched window falls across a peach plaster wall painted with the word oriel")}" width="2880" height="1710" fetchpriority="high"></picture>
  <h1 id="hero-title" class="vh">${esc(t.name)} — ${esc(t.tag)}</h1>
  <ul class="hero-labs">${labs.map(([h, x], i) => `<li class="hl hl${i}"><b>${esc(h)}</b>${esc(x)}</li>`).join("")}</ul>
  <div class="hero-foot"><p class="hero-tag">${esc(t.tag)}</p><p class="hero-zh" lang="zh-Hant">明窗基金會</p><p class="hero-st">${esc(ko ? "설립 준비 중 · 아직 기부를 받지 않습니다" : "In formation · Not taking donations yet")}</p></div>
</section>`;
}

/* ---------- 콘텐츠: 활동 일지 ---------- */
function loadJournal() {
  const dir = path.join(ROOT, "content", "journal");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
    const { data, body } = frontmatter(fs.readFileSync(path.join(dir, f), "utf8"));
    const [en, ko = ""] = body.split(/\n<!--\s*ko\s*-->\n/);
    const slug = f.replace(/\.md$/, "");
    const photos = [].concat(data.photos || []);
    return { slug, date: data.date || slug.slice(0, 10), place: data.place || "", place_ko: data.place_ko || data.place || "", kind: data.kind || "note",
      title: data.title || slug, title_ko: data.title_ko || data.title || slug, summary: data.summary || "", summary_ko: data.summary_ko || data.summary || "",
      cover: data.cover || photos[0] || "", photos, en: en.trim(), ko: ko.trim() || en.trim(), draft: data.draft === "true" };
  }).filter((p) => !p.draft).sort((a, b) => (a.date < b.date ? 1 : -1));
}
const JOURNAL = loadJournal();

/* ---------- 콘텐츠: 읽을거리(Notes) ---------- */
function loadNotes() {
  const dir = path.join(ROOT, "content", "notes");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
    const { data, body } = frontmatter(fs.readFileSync(path.join(dir, f), "utf8"));
    const parts = { en: "", zh: "", ko: "" }; let cur = "en";
    for (const line of body.split("\n")) { const m = line.match(/^<!--\s*(zh|ko)\s*-->\s*$/); if (m) { cur = m[1]; continue; } parts[cur] += line + "\n"; }
    const slug = f.replace(/\.md$/, "");
    return { slug, date: data.date || slug.slice(0, 10), no: data.no || "", title: data.title || slug, title_ko: data.title_ko || data.title || slug,
      summary: data.summary || "", summary_ko: data.summary_ko || data.summary || "", en: parts.en.trim(), zh: parts.zh.trim(), ko: parts.ko.trim() || parts.en.trim(), draft: data.draft === "true" };
  }).filter((n) => !n.draft).sort((a, b) => (a.date < b.date ? 1 : -1));
}
const NOTES = loadNotes();

/* ---------- 채널 ---------- */
function socials(t) {
  const list = [["Telegram", S.tgChannel ? `https://t.me/${S.tgChannel.replace(/^@/, "")}` : ""], ["LinkedIn", S.linkedinPage || S.linkedin], ["Instagram", S.instagram], ["Facebook", S.facebook]].filter(([, h]) => h);
  return list.length ? `<p class="small foot-ch">${esc(t.follow)}</p><ul class="socials">${list.map(([n, h]) => `<li><a href="${esc(h)}" target="_blank" rel="noopener">${n}</a></li>`).join("")}</ul>` : "";
}

/* ---------- 레이아웃 ---------- */
const u = (t, p = "") => BASE + t.pre + p;
const fmtDate = (d, t) => { try { return new Date(d + "T00:00:00Z").toLocaleDateString(t.lang === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }); } catch { return d; } };

function layout(t, { title, desc, p = "", body, active = "", og = "" }) {
  const full = title ? `${title} | ${t.name}` : `${t.name} | ${t.tag}`;
  const altP = BASE + (t.lang === "en" ? "ko/" : "") + p;
  const ogImg = ABS + "og.png";
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc || t.desc)}">
<link rel="canonical" href="${ABS + t.pre + p}">
<link rel="alternate" hreflang="en" href="${ABS + p}"><link rel="alternate" hreflang="ko" href="${ABS + "ko/" + p}"><link rel="alternate" hreflang="x-default" href="${ABS + p}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(S.name)}"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc || t.desc)}"><meta property="og:image" content="${og || ogImg}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#E9CFBB">
<link rel="icon" href="${BASE}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+TC:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}style.css?v=${V.css}">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: S.name, alternateName: S.name_ko, url: ABS, email: S.email, description: T.en.desc, logo: ABS + "favicon.svg" })}</script>
</head>
<body class="lang-${t.lang}">
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="site-head">
  <div class="wrap head-row">
    <a class="brand" href="${u(t)}" aria-label="${esc(t.name)}">${wordmark("brand-wm")}</a>
    <nav class="nav" aria-label="${t.lang === "ko" ? "주요 메뉴" : "Main"}">${t.nav.map(([h, l, sh]) => `<a href="${u(t, h)}"${active === h ? ' aria-current="page"' : ""}>${sh ? `<span class="lg">${esc(l)}</span><span class="sh">${esc(sh)}</span>` : esc(l)}</a>`).join("")}</nav>
    <div class="head-end"><a class="lang" href="${altP}" hreflang="${t.other}" lang="${t.other}">${esc(t.otherShort)}</a><a class="head-join" href="${u(t, "get-involved/")}#circle">${esc(t.joinShort)} →</a></div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-foot">
  <div class="wrap">
    <p class="foot-mark">${wordmark("foot-wm")}</p><p class="foot-zh" lang="zh-Hant">${esc(S.name_zh)}</p>
    <p class="foot-tag">${esc(t.tag)}</p>
    <nav class="foot-links" aria-label="${t.lang === "ko" ? "바닥 메뉴" : "Footer"}">${t.footLinks.map(([h, l]) => `<a href="${u(t, h)}">${esc(l)}</a>`).join("")}<a class="mail" href="mailto:${S.email}">${esc(S.email)}</a></nav>
    <div class="foot-partner"><p class="small">${esc(t.media)}</p><a class="cb" href="${S.chainbrief}" target="_blank" rel="noopener">CHAINBRIEF</a>${socials(t)}</div>
  </div>
  <div class="wrap foot-base"><p>${esc(t.footStatus)}</p><p>© 2026 ${esc(t.rights)}</p></div>
</footer>
<script src="${BASE}app.js?v=${V.js}" defer></script>
</body>
</html>`;
}

const statusBar = (t) => `<p class="status"><span class="dot" aria-hidden="true"></span>${esc(t.status)}</p>`;
const pageHead = (title, lede = "") => `<header class="page-head wrap"><h1>${esc(title)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}</header>`;

function roadmap(t, full = false) {
  const cur = S.phases.findIndex((x) => x.id === S.stage);
  return `<ol class="road${full ? " road-full" : ""}">${S.phases.map((ph, i) => `<li class="${i < cur ? "done" : i === cur ? "now" : ""}"><span class="road-when">${esc(t.lang === "ko" ? ph.when_ko : ph.when)}${i === cur ? ` <em class="road-now">${esc(t.now)}</em>` : ""}</span><h3>${esc(t.lang === "ko" ? ph.title_ko : ph.title)}</h3><p>${esc(t.lang === "ko" ? ph.text_ko : ph.text)}</p></li>`).join("")}</ol>`;
}

function postCard(t, p) {
  const title = t.lang === "ko" ? p.title_ko : p.title, sum = t.lang === "ko" ? p.summary_ko : p.summary, place = t.lang === "ko" ? p.place_ko : p.place;
  return `<article class="post-card"><a href="${u(t, `journal/${p.slug}/`)}">${p.cover ? `<img src="${BASE}${esc(p.cover)}" alt="" loading="lazy">` : `<div class="post-ph" aria-hidden="true">${logo("logo-mark xl")}</div>`}<p class="post-meta"><time datetime="${p.date}">${esc(fmtDate(p.date, t))}</time>${place ? `<span>${esc(place)}</span>` : ""}</p><h3>${esc(title)}</h3>${sum ? `<p>${esc(sum)}</p>` : ""}</a></article>`;
}

function ledger(t) {
  const ko = t.lang === "ko";
  const blocks = (S.ledger || []).map((b) => `<li class="blk"><p class="blk-no">${esc(t.block)} ${b.block}</p><time datetime="${b.date}">${esc(fmtDate(b.date, t))}</time><ul>${(ko ? b.items_ko : b.items).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></li>`).join("");
  const nb = S.nextBlock ? `<li class="blk next"><p class="blk-no">${esc(t.nextBlock)}</p><span class="blk-when">${esc(ko ? S.nextBlock.when_ko : S.nextBlock.when)}</span><ul>${(ko ? S.nextBlock.items_ko : S.nextBlock.items).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></li>` : "";
  return `<ol class="chain">${blocks}${nb}</ol>`;
}

// 배움·생활·짓기 번호
function courses(i) { return `<span class="path-no">0${i + 1}</span>`; }

/* ---------- 페이지 ---------- */
function home(t) {
  const posts = JOURNAL.slice(0, 3);
  return `
${heroLight(t)}
<section class="wrap intro">
  <p class="lede">${esc(t.heroLede)}</p>
  <div class="actions"><a class="btn" href="${u(t, "get-involved/")}#circle">${esc(t.join)}</a><a class="btn btn-quiet" href="${u(t, "plan/")}">${esc(t.readPlan)}</a></div>
</section>
<div class="wrap">${statusBar(t)}</div>

<section class="band path-band">
  <div class="wrap">
    <header class="sec-head"><h2>${esc(t.pathTitle)}</h2><p>${esc(t.pathLede)}</p></header>
    <ol class="path">${t.path.map(([h, x], i) => `<li style="--step:${i}">${courses(i)}<h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="wrap split">
  <header class="sec-head"><h2>${esc(t.chainTitle)}</h2><p>${esc(t.chainLede)}</p></header>
  <div><dl class="defs">${t.chain.map(([h, x]) => `<div><dt>${esc(h)}</dt><dd>${esc(x)}</dd></div>`).join("")}</dl><p class="small">${esc(t.chainNote)} <a href="${u(t, "transparency/")}">${t.lang === "ko" ? "투명성 원칙 자세히" : "How transparency will work"}</a></p></div>
</section>

<section class="wrap ledger-sec">
  <header class="sec-head"><h2>${esc(t.ledgerTitle)}</h2><p>${esc(t.ledgerLede)}</p></header>
  ${ledger(t)}
</section>

<section class="band ink-band">
  <div class="wrap">
    <header class="sec-head"><h2>${esc(t.howTitle)}</h2></header>
    <div class="principles">${t.how.map(([h, x]) => `<div><h3>${esc(h)}</h3><p>${esc(x)}</p></div>`).join("")}</div>
    <p class="small"><a href="${u(t, "safeguarding/")}">${t.lang === "ko" ? "아동보호 정책 읽기" : "Read our safeguarding policy"}</a></p>
  </div>
</section>

<section class="wrap">
  <header class="sec-head"><h2>${esc(t.roadTitle)}</h2></header>
  ${roadmap(t)}
</section>

<section class="wrap journal-sec">
  <header class="sec-head row"><div><h2>${esc(t.journalTitle)}</h2><p>${esc(t.journalLede)}</p></div>${posts.length ? `<a class="text-link" href="${u(t, "journal/")}">${esc(t.allPosts)}</a>` : ""}</header>
  ${posts.length ? `<div class="posts">${posts.map((p) => postCard(t, p)).join("")}</div>` : `<p class="empty">${esc(t.journalEmpty)}</p>`}
</section>

${NOTES.length ? `<section class="wrap notes-sec">
  <header class="sec-head row"><div><h2>${esc(t.notesTitle)}</h2><p>${esc(t.notesLede)}</p></div><a class="text-link" href="${u(t, "notes/")}">${esc(t.allNotes)}</a></header>
  <ol class="notes">${NOTES.slice(0, 3).map((n) => noteRow(t, n)).join("")}</ol>
</section>

` : ""}<section class="wrap split partners">
  <header class="sec-head"><h2>${esc(t.partnerTitle)}</h2></header>
  <div><p class="partner-line"><a class="cb" href="${S.chainbrief}" target="_blank" rel="noopener">CHAINBRIEF</a><span>${esc(t.partnerText)}</span></p>${S.qurator ? `<p class="partner-line"><a class="cb" href="${S.qurator}" target="_blank" rel="noopener">QURATOR</a><span>${esc(t.quratorText)}</span></p>` : ""}<p>${esc(t.partnerWanted)}</p><p><a class="text-link" href="${u(t, "get-involved/")}#partner">${esc(t.becomePartner)}</a></p></div>
</section>

<section class="band cta-band">
  <div class="wrap cta"><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText)}</p><a class="btn btn-light" href="${u(t, "get-involved/")}#circle">${esc(t.join)}</a></div>
</section>`;
}

const PLAN = {
  en: {
    title: "The plan", lede: "What Oriel will do, in what order, and how we will know it is working.",
    sections: [
      ["Why Southeast Asia, why children", "Across parts of Southeast Asia, many children still leave school early, often because of costs, distance or work at home rather than lack of interest. Small, steady help close to the classroom can change that. We will choose our first community with a local partner, after visiting, listening and checking what others already do there, so we add to existing work instead of duplicating it."],
      ["Learn: keep children learning", "Our first programs support learning that is already happening: after-school tutoring with local teachers, books and supplies, reading corners in existing schools, and scholarships that cover the costs that make families pull children out. Every program has a local lead and a simple measure we report on, such as attendance or reading levels."],
      ["Live: remove what stops a child coming", "Once learning support works, we add the everyday basics that decide whether a child turns up: school meals, clean drinking water, health and eye checks, hygiene kits and safe transport. We fund what the partner asks for, buy locally when we can, and publish what each item cost."],
      ["Build: classrooms, then schools", "Buildings come last. When a community has a working program and asks for space, we help build it: a classroom, a library, toilets, a water point, a safer path or bridge, and eventually a school. Communities contribute land, labour or upkeep plans so each building has an owner after we leave."],
      ["How giving will work", "We will register the foundation before accepting a single donation. Gifts in stablecoins and crypto will go to one published wallet, card and bank gifts to a named account, and every payout will be logged with a receipt and the partner who received it. A quarterly report in English and Korean will put the numbers and the on-chain record side by side."],
      ["How we will measure progress", "For each program: children reached, attendance, learning results where a partner can measure them, and cost per child. For each building: cost against budget, date finished, and whether it is still in use a year later. We will publish misses as well as wins."],
    ],
  },
  ko: {
    title: "계획", lede: "오리엘이 무엇을, 어떤 순서로 하고, 잘되고 있는지 어떻게 확인할지 정리했습니다.",
    sections: [
      ["왜 동남아시아, 왜 아이들인가", "동남아시아 곳곳에는 아직도 일찍 학교를 그만두는 아이들이 많습니다. 공부가 싫어서라기보다 비용, 거리, 집안일 때문인 경우가 많습니다. 교실 가까이에서 작고 꾸준하게 돕는 일이 그 흐름을 바꿀 수 있습니다. 첫 마을은 현지 파트너와 함께 직접 가서 듣고, 이미 그곳에서 일하는 단체들을 확인한 뒤 정합니다. 있는 일을 겹치게 하지 않고 보태기 위해서입니다."],
      ["배움: 아이가 계속 배우게", "첫 프로그램은 이미 일어나고 있는 배움을 돕습니다. 현지 선생님과의 방과후 보충수업, 책과 학용품, 기존 학교 안의 독서 공간, 가정이 아이를 학교에서 빼게 만드는 비용을 덮는 장학금. 모든 프로그램에는 현지 책임자와 출석률·읽기 수준 같은 간단한 지표가 있고, 이를 보고합니다."],
      ["생활: 학교에 못 오게 막는 것을 없애기", "학습 지원이 자리 잡으면, 아이가 학교에 나오느냐를 가르는 생활의 기본을 더합니다. 급식, 깨끗한 식수, 건강·시력 검진, 위생용품, 안전한 등하굣길. 파트너가 요청한 것을 지원하고, 가능하면 현지에서 사며, 항목별 비용을 공개합니다."],
      ["짓기: 교실에서 학교까지", "건물은 마지막입니다. 프로그램이 돌아가는 마을이 공간을 원할 때 함께 짓습니다. 교실, 도서관, 화장실, 식수대, 더 안전한 길이나 다리, 그리고 언젠가는 학교. 마을은 땅이나 일손, 유지 계획을 보태 우리가 떠난 뒤에도 건물의 주인이 됩니다."],
      ["기부는 이렇게 받습니다", "재단 등록을 마치기 전에는 기부를 한 푼도 받지 않습니다. 스테이블코인·암호화폐 기부는 공개된 지갑 하나로, 카드·계좌 기부는 재단 명의 계좌로 받고, 모든 지출은 영수증·받은 파트너와 함께 기록합니다. 분기마다 영어·한국어 보고서에 숫자와 온체인 기록을 나란히 싣습니다."],
      ["잘되고 있는지 확인하는 법", "프로그램마다 지원한 아이 수, 출석률, 파트너가 측정할 수 있는 학습 결과, 아이 1인당 비용을 봅니다. 건물마다 예산 대비 비용, 완공일, 1년 뒤에도 쓰이고 있는지를 봅니다. 잘된 것만이 아니라 안 된 것도 공개합니다."],
    ],
  },
};

function plan(t) {
  const P = PLAN[t.lang];
  return `${pageHead(P.title, P.lede)}
<div class="wrap">${statusBar(t)}</div>
<section class="wrap prose-grid">${P.sections.map(([h, x]) => `<article class="prose-block"><h2>${esc(h)}</h2><p>${esc(x)}</p></article>`).join("")}</section>
<section class="wrap"><header class="sec-head"><h2>${esc(t.roadTitle)}</h2></header>${roadmap(t, true)}</section>
<section class="band cta-band"><div class="wrap cta"><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText)}</p><a class="btn btn-light" href="${u(t, "get-involved/")}#circle">${esc(t.join)}</a></div></section>`;
}

function noteRow(t, n) {
  const title = t.lang === "ko" ? n.title_ko : n.title, sum = t.lang === "ko" ? n.summary_ko : n.summary;
  return `<li class="note-row"><a href="${u(t, `notes/${n.slug}/`)}"><span class="note-no">${n.no ? "No. " + esc(String(n.no)) : ""}</span><span class="note-main"><span class="note-title">${esc(title)}</span>${sum ? `<span class="note-sum">${esc(sum)}</span>` : ""}</span><time datetime="${n.date}">${esc(fmtDate(n.date, t))}</time></a></li>`;
}
function notesIndex(t) {
  return `${pageHead(t.notesTitle, t.notesLede)}
<section class="wrap">${NOTES.length ? `<ol class="notes">${NOTES.map((n) => noteRow(t, n)).join("")}</ol>` : `<p class="empty">${esc(t.notesEmpty)}</p>`}</section>`;
}
function notePost(t, n) {
  const title = t.lang === "ko" ? n.title_ko : n.title;
  const body = markdown(t.lang === "ko" ? n.ko : n.en);
  const zh = t.lang === "en" && n.zh ? `<aside class="zh" lang="zh-Hant"><p class="cap">${esc(t.zhSummary)}</p>${markdown(n.zh)}</aside>` : "";
  return `<article class="post wrap note-post">
  <header class="post-head"><p class="post-meta">${n.no ? `<span>No. ${esc(String(n.no))}</span>` : ""}<time datetime="${n.date}">${esc(fmtDate(n.date, t))}</time></p><h1>${esc(title)}</h1></header>
  <div class="prose">${body}</div>
  ${zh}
  <p><a class="text-link" href="${u(t, "notes/")}">${esc(t.allNotes)}</a></p>
</article>`;
}

function journalIndex(t) {
  return `${pageHead(t.journalTitle, t.journalLede)}
<section class="wrap">${JOURNAL.length ? `<div class="posts">${JOURNAL.map((p) => postCard(t, p)).join("")}</div>` : `<p class="empty">${esc(t.journalEmpty)}</p>`}</section>`;
}

function journalPost(t, p) {
  const title = t.lang === "ko" ? p.title_ko : p.title, place = t.lang === "ko" ? p.place_ko : p.place;
  const body = markdown(t.lang === "ko" ? p.ko : p.en).replace(/src="(?!https?:|\/)/g, `src="${BASE}`).replace(/href="(?!https?:|\/|#|mailto:)/g, `href="${u(t)}`);
  const gallery = p.photos.length > 1 ? `<div class="gallery">${p.photos.slice(1).map((ph) => `<img src="${BASE}${esc(ph)}" alt="" loading="lazy">`).join("")}</div>` : "";
  return `<article class="post wrap">
  <header class="post-head"><p class="post-meta"><time datetime="${p.date}">${esc(fmtDate(p.date, t))}</time>${place ? `<span>${esc(place)}</span>` : ""}</p><h1>${esc(title)}</h1></header>
  ${p.cover ? `<img class="post-cover" src="${BASE}${esc(p.cover)}" alt="">` : ""}
  <div class="prose">${body}</div>
  ${gallery}
  ${p.photos.length ? `<p class="small">${esc(t.photosNote)}</p>` : ""}
  <p><a class="text-link" href="${u(t, "journal/")}">${esc(t.back)}</a></p>
</article>`;
}

const INV = {
  en: {
    title: "Get involved", lede: "We are building this with people, not just for them. Here is where you fit in today.",
    ways: [
      ["circle", "Join the founding circle", "Leave your email and we'll write when giving opens, when we pick our first community, and when there's a role that fits you. No spam, no sharing your details."],
      ["volunteer", "Volunteer a skill", "Teachers, builders, engineers, nurses, translators, designers, developers and accountants. We match skills to what a local partner asks for, often remotely. We do not run short visits with children."],
      ["partner", "Partner with us", "Schools, community groups and registered NGOs in Southeast Asia; companies and web3 projects that want their giving to be traceable; media that want to follow the work."],
    ],
    form: { title: "Sign up", name: "Your name", email: "Email", interest: "How would you like to help?", opts: ["Give when giving opens", "Volunteer a skill", "Partner organisation", "Spread the word", "Something else"], country: "Where are you based?", msg: "Anything you'd like us to know (optional)", send: "Send", privacy: "We use your details only to reply and to send founding updates. Ask us any time and we delete them." },
  },
  ko: {
    title: "함께하기", lede: "아이들을 위해서만이 아니라 사람들과 함께 만듭니다. 지금 함께할 수 있는 방법입니다.",
    ways: [
      ["circle", "창립 서포터 신청", "이메일을 남기시면 기부가 열릴 때, 첫 마을을 정할 때, 맞는 역할이 생길 때 연락드립니다. 스팸 없이, 정보는 다른 곳에 넘기지 않습니다."],
      ["volunteer", "재능 봉사", "선생님, 건축·토목, 엔지니어, 간호사, 통번역, 디자이너, 개발자, 회계사. 현지 파트너가 요청한 일에 맞춰 연결하며, 원격으로 하는 일도 많습니다. 아이들과의 단기 방문 봉사는 하지 않습니다."],
      ["partner", "파트너 되기", "동남아시아의 학교, 마을 단체, 등록된 NGO. 기부를 투명하게 하고 싶은 기업과 웹3 프로젝트. 활동을 함께 기록할 미디어."],
    ],
    form: { title: "신청하기", name: "이름", email: "이메일", interest: "어떻게 함께하고 싶으세요?", opts: ["기부가 열리면 기부", "재능 봉사", "파트너 기관", "알리기", "기타"], country: "사는 곳", msg: "남기고 싶은 말 (선택)", send: "보내기", privacy: "남겨주신 정보는 답장과 창립 소식 안내에만 씁니다. 요청하시면 언제든 지웁니다." },
  },
};

function involve(t) {
  const I = INV[t.lang], F = I.form;
  return `${pageHead(I.title, I.lede)}
<section class="wrap ways">${I.ways.map(([id, h, x]) => `<article id="${id}" class="way"><h2>${esc(h)}</h2><p>${esc(x)}</p></article>`).join("")}</section>
<section class="wrap form-wrap" aria-labelledby="form-title">
  <h2 id="form-title">${esc(F.title)}</h2>
  <form class="form" action="${esc(S.formEndpoint)}" method="POST">
    <input type="hidden" name="_subject" value="Oriel: new founding circle sign-up (${t.lang})">
    <input type="hidden" name="_next" value="${ABS + t.pre}thanks/">
    <input type="hidden" name="_template" value="table">
    <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <label><span>${esc(F.name)}</span><input name="name" required autocomplete="name"></label>
    <label><span>${esc(F.email)}</span><input name="email" type="email" required autocomplete="email"></label>
    <label><span>${esc(F.interest)}</span><select name="interest">${F.opts.map((o) => `<option>${esc(o)}</option>`).join("")}</select></label>
    <label><span>${esc(F.country)}</span><input name="country" autocomplete="country-name"></label>
    <label class="wide"><span>${esc(F.msg)}</span><textarea name="message" rows="4"></textarea></label>
    <div class="wide form-end"><button class="btn" type="submit">${esc(F.send)}</button><p class="small">${esc(F.privacy)}</p></div>
  </form>
  <p class="small">${t.lang === "ko" ? "이메일로 직접 연락하셔도 됩니다:" : "Or write to us directly:"} <a href="mailto:${S.email}">${esc(S.email)}</a></p>
</section>`;
}

const thanks = (t) => `${pageHead(t.lang === "ko" ? "고맙습니다" : "Thank you", t.lang === "ko" ? "잘 받았습니다. 곧 이메일로 연락드릴게요." : "We have your note and will write back by email soon.")}<section class="wrap"><p><a class="btn btn-quiet" href="${u(t)}">${t.lang === "ko" ? "처음으로" : "Back to the start"}</a></p></section>`;

const SAFE = {
  en: { title: "Safeguarding", lede: "Children come first, including in how we tell their stories.",
    items: [
      ["Our commitments", ["Every partner we fund must have, or adopt with our help, a written child safeguarding policy.", "Anyone who works with children through us is screened, signs our code of conduct and is never left alone with a child.", "We do not support orphanage visits or short-term volunteering with children, and we do not fund residential care where family-based care is possible.", "Concerns are taken seriously, handled confidentially and reported to the right local authorities."]],
      ["Photos and stories", ["We take and publish photos only with a guardian's written consent and the child's own agreement.", "We show children as people, not as objects of pity: no images at their lowest moments, no staged scenes.", "We never publish a child's full name, school name together with location, or anything that shows where they live.", "Photos are stripped of location data before they are published, and removed on request."]],
      ["Report a concern", ["If you are worried about a child connected to our work, email us with the subject \"Safeguarding\". If a child is in immediate danger, contact local emergency services first."]],
    ] },
  ko: { title: "아동보호 정책", lede: "아이가 먼저입니다. 아이들의 이야기를 전하는 방식에서도요.",
    items: [
      ["우리의 약속", ["우리가 지원하는 모든 파트너는 서면 아동보호 정책을 갖추거나, 우리와 함께 마련합니다.", "우리를 통해 아이들과 일하는 사람은 모두 확인 절차를 거치고 행동강령에 서명하며, 아이와 단둘이 있지 않습니다.", "보육원 방문이나 아이들과의 단기 봉사는 지원하지 않으며, 가정 기반 돌봄이 가능한 곳에서 시설 보호를 지원하지 않습니다.", "문제 제기는 진지하게, 비밀을 지켜 다루고 현지 관계 기관에 알립니다."]],
      ["사진과 이야기", ["보호자의 서면 동의와 아이 본인의 동의가 있을 때만 촬영하고 게시합니다.", "아이를 동정의 대상이 아닌 한 사람으로 보여줍니다. 가장 힘든 순간이나 연출된 장면은 쓰지 않습니다.", "아이의 실명, 학교 이름과 위치를 함께, 또는 사는 곳을 알 수 있는 정보는 공개하지 않습니다.", "게시 전 사진의 위치 정보를 지우고, 요청이 있으면 내립니다."]],
      ["걱정되는 일 알리기", ["우리 활동과 관련된 아이에 대해 걱정되는 일이 있으면 제목에 \"Safeguarding\"을 적어 이메일을 보내 주세요. 아이가 당장 위험하다면 먼저 현지 긴급 기관에 연락해 주세요."]],
    ] },
};
const TRANS = {
  en: { title: "Transparency", lede: "How every gift will be recorded, and what is true today.",
    items: [
      ["Today", ["We are in formation and do not accept donations of any kind yet.", "We have no wallet address yet. Anyone asking you to send crypto to Oriel today is not us.", "When giving opens, the address will be published only on this page and announced from our official channels at the same time."]],
      ["When giving opens", ["One public wallet per network, listed here with links to a block explorer.", "Every outgoing payment labelled with the partner, the purpose and a receipt.", "Card and bank gifts recorded in the same ledger, with totals reconciled each quarter.", "A quarterly report in English and Korean, and annual accounts once the foundation is registered."]],
    ] },
  ko: { title: "투명성", lede: "모든 기부를 어떻게 기록할지, 그리고 지금 사실인 것.",
    items: [
      ["지금", ["설립 준비 중이며 어떤 형태의 기부도 아직 받지 않습니다.", "지갑 주소는 아직 없습니다. 지금 오리엘 이름으로 암호화폐를 보내 달라는 연락은 저희가 아닙니다.", "기부가 열리면 주소는 이 페이지에만 게시하고, 같은 시점에 공식 채널에서 알립니다."]],
      ["기부가 열리면", ["네트워크마다 공개 지갑 하나를 블록 탐색기 링크와 함께 여기에 올립니다.", "모든 지출에 받은 파트너, 용도, 영수증을 붙입니다.", "카드·계좌 기부도 같은 장부에 기록하고, 분기마다 합계를 맞춥니다.", "분기별 영어·한국어 보고서를 내고, 재단 등록 후에는 연간 결산을 공개합니다."]],
    ] },
};
const policyPage = (t, D) => `${pageHead(D.title, D.lede)}<section class="wrap prose policy">${D.items.map(([h, list]) => `<h2>${esc(h)}</h2>${list.length > 1 ? `<ul>${list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p>${esc(list[0])}</p>`}`).join("")}${D === SAFE[t.lang] ? `<p><a class="btn btn-quiet" href="mailto:${S.email}?subject=Safeguarding">${esc(S.email)}</a></p>` : ""}</section>`;

const ABOUT = {
  en: { title: "About", lede: "Who is starting Oriel, and why.",
    founderH: "Founder", founder: "Sejun Park", founderRole: "Founder",
    bio: ["Sejun has spent seven years in the crypto exchange industry, working with global exchanges including Bitget, MEXC, Digifinex and Huobi. He studied history in Incheon, has organised or taken part in more than twenty art exhibitions in Seoul and Incheon, and has run restaurant and investment businesses.", "He is starting Oriel to put what the crypto industry does well, open ledgers and fast cross-border payments, to work for children's education, and he plans to spend time in the field himself, travelling and volunteering alongside local partners."],
    whyH: "Why the name", why: "An oriel is a window that leans out from a wall to catch more light and a wider view. We want to be that for children's learning: more light, in places that have too little of it. It is also how we want to be seen: through clear glass, with every gift and every payout in view on a public chain. Our Chinese name, 明窗, comes from 明窗淨几, the bright window and clean desk of a good place to study." },
  ko: { title: "소개", lede: "누가, 왜 오리엘을 시작하는지.",
    founderH: "설립자", founder: "박세준", founderRole: "설립자",
    bio: ["박세준은 비트겟, MEXC, 디지파이넥스, 후오비 등 글로벌 거래소와 함께 7년간 암호화폐 거래소 업계에서 일했습니다. 인천에서 사학을 공부했고, 서울과 인천에서 20회 넘는 미술 전시를 열거나 참여했으며, 요식업과 투자 사업도 운영했습니다.", "공개 장부와 빠른 국경 간 송금이라는 크립토 업계의 강점을 아이들의 교육에 쓰기 위해 오리엘을 시작합니다. 직접 현장을 다니며 현지 파트너와 함께 봉사할 계획입니다."],
    whyH: "이름의 뜻", why: "오리엘은 벽에서 바깥으로 내민 창입니다. 빛을 더 들이고, 더 멀리 보게 해 줍니다. 우리는 아이들의 배움에 그런 창이 되고 싶습니다. 빛이 모자란 곳에 빛을 더 들이는 일입니다. 동시에 우리 자신도 그렇게 보이고 싶습니다. 맑은 유리 너머로, 모든 기부와 지출이 공개 블록체인에 그대로 보이도록. 중국어 이름 明窗(밝은 창)은 공부하기 좋은 방을 뜻하는 明窗淨几에서 따왔습니다." },
};
function about(t) {
  const A = ABOUT[t.lang];
  return `${pageHead(A.title, A.lede)}
<section class="wrap split"><header class="sec-head"><h2>${esc(A.founderH)}</h2></header><div class="prose"><p class="person"><strong>${esc(A.founder)}</strong></p>${A.bio.map((x) => `<p>${esc(x)}</p>`).join("")}${S.linkedin ? `<p><a class="text-link" href="${esc(S.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></p>` : ""}</div></section>
<section class="wrap split"><header class="sec-head"><h2>${esc(A.whyH)}</h2></header><div class="prose"><p>${esc(A.why)}</p></div></section>
<section class="wrap split partners"><header class="sec-head"><h2>${esc(t.partnerTitle)}</h2></header><div><p class="partner-line"><a class="cb" href="${S.chainbrief}" target="_blank" rel="noopener">CHAINBRIEF</a><span>${esc(t.partnerText)}</span></p>${S.qurator ? `<p class="partner-line"><a class="cb" href="${S.qurator}" target="_blank" rel="noopener">QURATOR</a><span>${esc(t.quratorText)}</span></p>` : ""}<p>${esc(t.partnerWanted)}</p></div></section>`;
}

const PARTNERS = {
  en: { title: "Partner with us", lede: "How a school, community group or NGO becomes a Oriel partner, step by step. We move slowly on purpose: trust first, money second.",
    stepsTitle: "How it works",
    steps: [
      ["Introduce yourself", "Write to us with who you are, where you work and the children you already serve. A short email is enough to start."],
      ["Call and documents", "We meet by video and ask for your registration, your safeguarding policy (or a plan to adopt one with us) and any recent report."],
      ["Visit", "Our founder visits in person to meet teachers, parents and your team. No photos of children are taken without a guardian's consent."],
      ["Plan together", "You propose one small program, a budget and one simple measure of success. We agree it in writing."],
      ["Fund and record", "Funds go out in stages. Every payment carries a receipt and is logged on our public record."],
      ["Report and decide", "A short report every quarter. After a year we decide together whether to continue, grow, or build."],
    ],
    lookTitle: "What we look for",
    look: ["Already working with children in the community, led by local people", "A written child safeguarding policy, or the will to adopt one", "Registered locally, or hosted by a registered organisation", "Comfortable with publishing receipts and results, including misses"],
    otherTitle: "Companies, web3 projects and media",
    other: [["Sponsor a program", "Fund one partner's program for a year, with every payout visible on-chain."], ["Match gifts", "Match what your community gives once giving opens."], ["Lend skills", "Accounting, legal, design, engineering or translation, usually remote."], ["Tell the story", "Media partners follow the work; CHAINBRIEF already reports our progress."]],
    cta: "Start a conversation", ctaBtn: "Write to us" },
  ko: { title: "파트너 되기", lede: "학교·마을 단체·NGO가 오리엘 파트너가 되는 과정입니다. 일부러 천천히 갑니다. 신뢰가 먼저, 돈은 그다음.",
    stepsTitle: "진행 순서",
    steps: [
      ["소개", "누구인지, 어디서 일하는지, 이미 돕고 있는 아이들에 대해 알려 주세요. 짧은 이메일이면 충분합니다."],
      ["화상 미팅·서류", "화상으로 만나고 등록 서류, 아동보호 정책(없다면 함께 만들 계획), 최근 보고서를 받습니다."],
      ["방문", "설립자가 직접 방문해 선생님·부모님·팀을 만납니다. 보호자 동의 없이 아이 사진은 찍지 않습니다."],
      ["함께 계획", "작은 프로그램 하나, 예산, 간단한 성과 지표 하나를 제안해 주시면 서면으로 합의합니다."],
      ["지원과 기록", "지원금은 단계별로 나갑니다. 모든 지급에 영수증을 붙이고 공개 기록에 남깁니다."],
      ["보고와 결정", "분기마다 짧은 보고서를 내고, 1년 뒤 계속할지·키울지·지을지 함께 정합니다."],
    ],
    lookTitle: "이런 파트너를 찾습니다",
    look: ["현지 사람들이 이끌며 이미 마을의 아이들과 일하고 있는 곳", "서면 아동보호 정책이 있거나 만들 의지가 있는 곳", "현지에 등록됐거나 등록된 단체의 지원을 받는 곳", "실패를 포함한 영수증과 결과를 공개하는 데 동의하는 곳"],
    otherTitle: "기업·웹3 프로젝트·미디어",
    other: [["프로그램 후원", "한 파트너의 프로그램을 1년간 후원하고, 모든 지급을 온체인으로 확인합니다."], ["매칭 기부", "기부가 열리면 커뮤니티 기부액만큼 함께 기부합니다."], ["재능 지원", "회계·법률·디자인·엔지니어링·번역. 대부분 원격으로 가능합니다."], ["이야기 전하기", "미디어 파트너가 활동을 따라 기록합니다. 체인브리프가 이미 함께하고 있습니다."]],
    cta: "대화를 시작해요", ctaBtn: "문의 남기기" },
};
function partners(t) {
  const P = PARTNERS[t.lang];
  return `${pageHead(P.title, P.lede)}
<section class="wrap"><header class="sec-head"><h2>${esc(P.stepsTitle)}</h2></header>
<ol class="steps">${P.steps.map(([h, x], i) => `<li><span class="step-no" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(h)}</h3><p>${esc(x)}</p></div></li>`).join("")}</ol></section>
<section class="wrap split"><header class="sec-head"><h2>${esc(P.lookTitle)}</h2></header><ul class="checks">${P.look.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
<section class="wrap"><header class="sec-head"><h2>${esc(P.otherTitle)}</h2></header><div class="principles plain">${P.other.map(([h, x]) => `<div><h3>${esc(h)}</h3><p>${esc(x)}</p></div>`).join("")}</div></section>
<section class="band cta-band"><div class="wrap cta"><h2>${esc(P.cta)}</h2><p>${esc(t.partnerWanted)}</p><a class="btn btn-light" href="${u(t, "get-involved/")}#partner">${esc(P.ctaBtn)}</a></div></section>`;
}

const FAQ = {
  en: { title: "Questions", lede: "Short answers to what people ask us most.", qs: [
    ["Are you a registered charity?", "Not yet. Oriel is in formation. We will register before we accept any donation, and we will say so on this site the day it happens."],
    ["Can I donate now?", "No. We are not taking donations of any kind yet. If anyone asks you to send money or crypto to Oriel today, it is not us."],
    ["Where will you work first?", "In Southeast Asia, in one community, chosen with a local partner after visits and conversations. We will name it once a partner agrees."],
    ["How will on-chain giving work?", "Gifts in stablecoins and crypto will go to one published wallet, so anyone can see them arrive. Each payout will be logged with a receipt and the partner who received it, and card or bank gifts will be recorded on the same ledger."],
    ["Can I volunteer?", "Yes, with a skill a partner needs: teaching, building, health, translation, design, accounting, development. Much of it is remote. We do not organise short visits with children."],
    ["Who is behind Oriel?", "Founder Sejun Park, who spent seven years in the crypto exchange industry. Advisers will be listed here as they join."],
    ["How is CHAINBRIEF involved?", "CHAINBRIEF, a crypto news outlet, is our media partner and reports our progress."],
  ] },
  ko: { title: "자주 묻는 질문", lede: "가장 많이 받는 질문에 짧게 답합니다.", qs: [
    ["등록된 공익단체인가요?", "아직 아닙니다. 설립 준비 중이며, 어떤 기부도 받기 전에 등록을 마치고 그날 이 사이트에 알립니다."],
    ["지금 기부할 수 있나요?", "아니요. 아직 어떤 형태의 기부도 받지 않습니다. 지금 오리엘 이름으로 돈이나 암호화폐를 보내 달라는 연락은 저희가 아닙니다."],
    ["어디서 먼저 활동하나요?", "동남아시아의 한 마을에서, 직접 방문하고 대화한 뒤 현지 파트너와 함께 정합니다. 파트너가 동의하면 공개합니다."],
    ["온체인 기부는 어떻게 하나요?", "스테이블코인·암호화폐 기부는 공개된 지갑 하나로 받아 누구나 들어오는 것을 볼 수 있게 합니다. 모든 지출에 영수증과 받은 파트너를 기록하고, 카드·계좌 기부도 같은 장부에 남깁니다."],
    ["봉사할 수 있나요?", "네, 파트너에게 필요한 재능으로요. 교육·건축·보건·번역·디자인·회계·개발 등이며 원격으로 하는 일도 많습니다. 아이들과의 단기 방문은 운영하지 않습니다."],
    ["누가 만드나요?", "7년간 암호화폐 거래소 업계에서 일한 박세준이 설립합니다. 자문단은 합류하는 대로 소개합니다."],
    ["체인브리프와는 어떤 관계인가요?", "코인 뉴스 매체 체인브리프가 미디어 파트너로서 진행 상황을 보도합니다."],
  ] },
};
function faq(t) {
  const F = FAQ[t.lang];
  return `${pageHead(F.title, F.lede)}<section class="wrap"><div class="faq">${F.qs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>`;
}

/* ---------- 쓰기 ---------- */
for (const t of [T.en, T.ko]) {
  const P = t.pre;
  write(P + "index.html", layout(t, { body: home(t) }));
  write(P + "plan/index.html", layout(t, { title: PLAN[t.lang].title, desc: PLAN[t.lang].lede, p: "plan/", active: "plan/", body: plan(t) }));
  write(P + "journal/index.html", layout(t, { title: t.journalTitle, desc: t.journalLede, p: "journal/", active: "journal/", body: journalIndex(t) }));
  for (const post of JOURNAL) write(P + `journal/${post.slug}/index.html`, layout(t, { title: t.lang === "ko" ? post.title_ko : post.title, desc: t.lang === "ko" ? post.summary_ko : post.summary, p: `journal/${post.slug}/`, active: "journal/", body: journalPost(t, post), og: post.cover ? ABS + post.cover : "" }));
  write(P + "notes/index.html", layout(t, { title: t.notesTitle, desc: t.notesLede, p: "notes/", body: notesIndex(t) }));
  for (const n of NOTES) write(P + `notes/${n.slug}/index.html`, layout(t, { title: t.lang === "ko" ? n.title_ko : n.title, desc: t.lang === "ko" ? n.summary_ko : n.summary, p: `notes/${n.slug}/`, body: notePost(t, n) }));
  write(P + "get-involved/index.html", layout(t, { title: INV[t.lang].title, desc: INV[t.lang].lede, p: "get-involved/", active: "get-involved/", body: involve(t) }));
  write(P + "thanks/index.html", layout(t, { title: t.lang === "ko" ? "고맙습니다" : "Thank you", p: "thanks/", body: thanks(t) }));
  write(P + "safeguarding/index.html", layout(t, { title: SAFE[t.lang].title, desc: SAFE[t.lang].lede, p: "safeguarding/", body: policyPage(t, SAFE[t.lang]) }));
  write(P + "transparency/index.html", layout(t, { title: TRANS[t.lang].title, desc: TRANS[t.lang].lede, p: "transparency/", body: policyPage(t, TRANS[t.lang]) }));
  write(P + "partners/index.html", layout(t, { title: PARTNERS[t.lang].title, desc: PARTNERS[t.lang].lede, p: "partners/", active: "partners/", body: partners(t) }));
  write(P + "faq/index.html", layout(t, { title: FAQ[t.lang].title, desc: FAQ[t.lang].lede, p: "faq/", body: faq(t) }));
  write(P + "about/index.html", layout(t, { title: ABOUT[t.lang].title, desc: ABOUT[t.lang].lede, p: "about/", active: "about/", body: about(t) }));
}
write("404.html", layout(T.en, { title: "Page not found", p: "", body: `${pageHead("This page isn't here", "It may have moved. Start again from the home page.")}<section class="wrap"><p><a class="btn" href="${BASE}">Go to the home page</a></p></section>` }));

for (const f of fs.readdirSync(path.join(ROOT, "public"))) fs.cpSync(path.join(ROOT, "public", f), path.join(DIST, f), { recursive: true });
copyDir(path.join(ROOT, "images"), "images");
const pages = ["", "plan/", "partners/", "faq/", "journal/", "get-involved/", "safeguarding/", "transparency/", "about/", "notes/", ...JOURNAL.map((p) => `journal/${p.slug}/`), ...NOTES.map((n) => `notes/${n.slug}/`)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.flatMap((p) => [ABS + p, ABS + "ko/" + p]).map((l) => `<url><loc>${l}</loc></url>`).join("")}</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${ABS}sitemap.xml\n`);
write(".nojekyll", "");
console.log(`built → dist/ (journal ${JOURNAL.length}, notes ${NOTES.length}, base ${BASE})`);
