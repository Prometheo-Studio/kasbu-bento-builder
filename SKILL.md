---
name: kasbu-bento-builder
argument-hint: "[what you want to build or change]"
description: Build your own Kasbu page (kasbu.bio bento / link-in-bio / portfolio) out of animated, mobile-friendly HTML code blocks. Use when the user wants to create, redesign or extend a Kasbu page with custom HTML cards — stat counters, profile cards, project cards, testimonials, quotes, timelines, link lists, status chips, logo marquees, social links, event badges, business tiles — or asks for animated tiles, responsive (phone vs desktop) cards, or a preview before pasting into Kasbu. Interviews the user, mines their own past conversations and public websites for facts (only with permission), renders blocks from templates, lints them, previews desktop and mobile, and hands over copy-paste code row by row.
---

# Kasbu Bento Builder

Help a person build **their own Kasbu page**: a bento grid where each tile is either a native Kasbu tile or an **HTML code block** that you design and animate. The result should look like a designed product, not a template: real facts about the person, one consistent visual system, subtle motion, and layouts that work on **desktop and phone**.

Everything here comes from a real build (a founder's personal + business portfolio: 17 blocks, desktop and mobile). The templates, the linter and the references encode what broke and what worked.

## Ground rules (read first)

1. **Never invent facts.** Names, numbers, clients, quotes, dates, degrees, prices, links — every one must come from the user, from a source they approved, or be left as an obvious placeholder. If a number is uncertain (e.g. "21 or 30 clients?"), ask. Mark unverified items in your summary.
2. **Permission before reading anything about the person.** Searching their past conversations, memory files or any website is opt-in. Ask first, say exactly what you will read and why, and show what you found before using it. See `references/01-discovery.md` for the wording.
3. **Privacy.** Don't put phone numbers, emails, tax/ID documents, or other people's photos into a block unless the user explicitly confirms. Use initials instead of clients' faces. Quote testimonials only in short excerpts, attributed, and only ones the user already publishes.
4. **Speak the user's language.** The instructions here are in English; talk to the user in whatever language they use. Copy inside the blocks should be in the language of their audience (ask).
5. **Build only what was asked, then iterate.** Propose a layout, get a yes, build. Keep backups of versions the user has seen (`name-v1.html`) before you change them.
6. **Verify before handing over.** Run the linter and look at the preview at desktop and phone widths.

## Paths
`scripts/`, `templates/` and `references/` live in this skill's folder (the folder that contains this SKILL.md). Run the script from there, e.g. `node <skill-folder>/scripts/kasbu.js build site.json --out out`, and keep the user's `site.json`, `out/` and notes in **their project folder**, not inside the skill.

## How it is started
- `/kasbu-bento-builder` (or the short alias `/kasbu`, see `commands/kasbu.md`) followed by what the user wants — e.g. `/kasbu build my portfolio` — or just ask in plain words: "make me a Kasbu page".
- With no arguments, start with the discovery interview (phase 1).

## Workflow

### 1 · Discover (about 5 minutes)
Goal: a one-page fact sheet the user has confirmed. Read `references/01-discovery.md`.
- Ask the short interview (who they are, what they sell, audience, tone, proof, links, assets, language).
- Offer the two optional deep dives — each needs a clear "yes":
  - **Past conversations / memory**: search their previous Claude sessions or memory for facts about them and their business.
  - **Public sources**: their business website, existing portfolio, LinkedIn page, etc. → brand colors, fonts, logo, copy, client logos.
- Produce the fact sheet; the user corrects it. Save it (e.g. `site.json` draft + a short `facts.md`).

### 2 · Plan the layout
Read `references/02-kasbu-grid.md` and `references/08-block-catalog.md`.
- Desktop grid = **8 columns × 78 px, 36 px gaps**. Phone grid = **4 columns × 78 px, 12 px gaps**.
- Choose blocks from the catalog that tell *their* story in this order: **who** (profile, about) → **what they build** (business tiles, projects) → **proof** (stats, logos, testimonials) → **authority** (events, tools) → **how to reach them** (CTA, socials).
- Mix light and dark tiles on purpose (a light tile between dark ones gives rhythm), one accent color for the whole page, and give each business its own tile in its own brand.
- Write the layout for **both** desktop and mobile in `site.json` (see `examples/site.json`). Full-width banners (8 columns) become **4×2** on phone — never 4×1.
- Show the plan as a small table (block → size → content) and get a yes.

### 3 · Build the blocks
Read `references/03-design-system.md`, `04-animation-patterns.md`, `05-responsive.md`.
```bash
node scripts/kasbu.js build site.json --out out      # renders every block, lints, writes out/preview.html
```
- Blocks are rendered from `templates/*.html` with the data in `site.json`. Accent color is one value (`site.accent`, overridable per block); the script derives the shades.
- Need a block that doesn't exist? Copy the closest template, keep its conventions (prefix, `cqw` units, `html,body` rule, explicit keyframes, reduced-motion) and add it to the catalog. See "Authoring a new template" in `references/08-block-catalog.md`.
- Same template used several times with different data? The script gives each variant its own css prefix (`st`, `st2`, `st3`) so styles never clash.

### 4 · Preview and iterate
Read `references/06-preview-and-delivery.md`.
```bash
node scripts/kasbu.js serve out 5173                  # then open http://localhost:5173/preview.html
```
- In Claude Code, open it in the Browser pane (`preview_start` with that URL) — or publish it as a private Artifact if the user wants a link. The preview shows the **desktop grid and the phone grid** with real slot sizes.
- Check each block at 307 px (desktop 3-col slot), 320 px and 350 px (phone). Fix overlaps, tiny type, cut-off text.
- Iterate with the user. Keep the previous version when you change something they approved.

### 5 · Deliver
- Give the code **one row at a time**, each block in its own fenced `html` code block, with: the slot size for desktop and for phone, and what to change (links, text).
- Tell them how to paste: Kasbu → add an HTML/code tile → paste → set the tile size (desktop and phone views separately).
- List what is left for them: links to fill, facts to confirm, images to host, anything still to confirm.
- Offer to save what you learned (facts, brand tokens, layout decisions) so the next session starts warm.

## Kasbu facts you can rely on (and what to double-check)
- The HTML tile renders in an **iframe whose height follows the content**. Do not use `position:fixed`; give the root an `aspect-ratio`. If the tile slot is taller than the block, the rest shows the page/frame background — so every block sets `html,body{background:#0b0b0d}`.
- Slot size is chosen by the user per view (desktop / phone). The block cannot read the slot's height, only its **width** → switch layouts with `@container` on width, never by touch detection.
- Ask the user for a screenshot of their real Kasbu editor if something looks off; most problems are slot sizes. See `references/02-kasbu-grid.md`.

## Block catalog (templates/)
| Template | Size (desktop → phone) | What it is |
|---|---|---|
| `stat-counter` | 1×1 → 1×1 | Counter that climbs to a number while dots / mosaic fill |
| `profile-card` | 3×2 → 4×2 | Light business-card: rotating seal, typed roles, contact button |
| `about-photo` | 3×3 → 4×4 | Portrait (optional), name, rotating facts, chips |
| `role-pills` | 3×2 → 4×2 | Swaying rows of role pills + headline |
| `project-card` | 2×3 → 2×3 | Screenshot that pans, tags, accent color |
| `testimonials-banner` | 8×2 → 4×2 | Rotating quotes + client chips / avatars |
| `logo-marquee` | 3×3 → 4×4 | Three rows of client logos scrolling in opposite directions |
| `business-tile` | 3×3 → 4×4 | A business/product card, light or dark theme |
| `event-badge` | 2×3 → 2×3 | Swinging conference badge under stage lights |
| `cta-pulse` | 2×3 → 2×3 | Gradient card with a pulsing call-to-action |
| `social-orbit` | 2×3 → 2×3 | Social icons orbiting a hub; real links; optional "soon" badge |
| `quote-card` | 3×2 → 4×2 | One short quote with author and a travelling underline |
| `timeline-card` | 3×3 → 4×4 | Vertical timeline (2–4 items) whose dots light in turn |
| `link-list` | 3×2 → 4×2 | Up to 3 link rows with a travelling highlight |
| `status-tile` | 2×1 → 2×1 | Pulsing dot + short status ("Open to projects") |

## Files
- `scripts/kasbu.js` — `build`, `lint`, `serve` (Node 18+, no dependencies).
- `templates/` — block templates + `partials/` (noise overlay, page background).
- `examples/site.json` — a full demo page (17 blocks, desktop + mobile layout).
- `references/` — discovery, grid, design system, animation patterns, responsive, preview/delivery, pitfalls, catalog.
