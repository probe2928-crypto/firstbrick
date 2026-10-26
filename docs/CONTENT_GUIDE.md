# Content guide — field journal, photos, social posts

## Field journal post

File: `content/journal/YYYY-MM-DD-<english-slug>.md`

```
---
title: English title (≤ 70 chars)
title_ko: 한국어 제목
date: 2026-11-14
place: Siem Reap, Cambodia        # town and country only — never a village or school name next to children
place_ko: 캄보디아 시엠레아프
kind: field | founder | update | partner
summary: One sentence (EN)
summary_ko: 한 문장 (KO)
cover: images/journal/<slug>/01.jpg
photos: [images/journal/<slug>/01.jpg, images/journal/<slug>/02.jpg]
draft: false
---
English body (markdown: ## headings, lists, links, images)
<!-- ko -->
한국어 본문
```

Structure for a field post: what we saw → who we met (roles, not names of children) → what was decided → what it cost (if any money moved) → what's next.

## Photos (safeguarding — non-negotiable)

1. A guardian's written consent for every identifiable child, plus the child's own agreement. Keep consent records offline, never in the repo.
2. No child's full name, no school name + location together, nothing that shows where a child lives.
3. Dignity: no images at a child's lowest moment, no staged poverty, no crying children, no partial nudity.
4. Strip EXIF/GPS before committing (`python3 -c "from PIL import Image; im=Image.open(p); im.save(p, quality=88)"` after resizing to max 2000px).
5. Prefer: hands, books, classrooms, buildings in progress, adults at work, landscapes, groups from behind.
6. Remove any photo on request within 24 hours.

## Social posts

- English first (LinkedIn, Instagram, Facebook), Korean second.
- Every claim must be true today. Write plans as plans ("we will", "we plan to").
- Never ask for crypto or money until giving is open and the wallet is on `/transparency/`.
- Always link to the website or the journal post.
