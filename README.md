# Oriel Foundation

Website of Oriel Foundation (오리엘 재단) — a foundation in formation for families in need and their lovely children: learning first, then everyday support, then classrooms and schools. Every gift will be traceable on-chain.

- English at `/`, Korean at `/ko/`
- Static build, Node 22, no dependencies: `node scripts/build.mjs` → `dist/`, preview with `node scripts/serve.mjs` (http://localhost:4400)
- Deploys to GitHub Pages on every push to `main` (`.github/workflows/pages.yml`)

## Where things live

| What | File |
|---|---|
| Name, contacts, social links, stage, roadmap phases, wallets | `site.json` |
| Page copy (EN/KO) | `scripts/build.mjs` (`T`, `PLAN`, `INV`, `SAFE`, `TRANS`, `ABOUT`) |
| Field journal posts | `content/journal/YYYY-MM-DD-slug.md` (see `docs/CONTENT_GUIDE.md`) |
| Photos | `images/journal/<slug>/…` |
| Design | `public/style.css` (tokens at the top), hero schoolhouse in `schoolhouse()` |
| Social preview | `public/og/<page>.jpg` per page (make with `node scripts/build.mjs && NODE_PATH=$(npm root -g) node scripts/og.mjs`, needs Playwright + local fonts), `public/og.png` fallback |
| Plan and backlog | `docs/ROADMAP.md` |
| Marketing kit and weekly content | `marketing/` |

## Rules that never change

- No donations, wallets or payment links until the foundation is registered (`site.json` → `givingOpen`).
- Children's photos only with a guardian's written consent; no names, no locations, EXIF stripped (`docs/CONTENT_GUIDE.md`).
- No invented numbers, quotes, partners or results. Plans are written as plans.
