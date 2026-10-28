# 08 · Block catalog and authoring new templates

Templates live in `templates/`. Each starts with a comment header (`Block: … data: …`) — that header is the source of truth for fields. All accept `ACCENT` (hex) to override the page accent for that block.

| Template | Desktop / phone size | What it shows | Key `data` fields |
|---|---|---|---|
| `stat-counter` | 1×1 / 1×1 | Counter climbing to a number with a ring / double ring / mosaic of dots (auto by size of number) | `NUMBER`, `LABEL`, `VARIANT?` |
| `profile-card` | 3×2 / 4×2 | Light business-card: typed roles, seal, contact button | `NAME`, `ROLES` (≤4), `LOCATION`, `CTA_LABEL`, `CTA_URL`, `SEAL_TEXT?`, `INITIALS?` |
| `about-photo` | 3×3 | Portrait, name, rotating facts, chips | `PHOTO?`, `NAME_FIRST`, `NAME_LAST`, `ROLE`, `FACTS` (≤4), `CHIPS[{text,color}]`, `TAG?` |
| `role-pills` | 3×2 / 4×2 | Swaying role pills, one lights up | `ROWS[[{text,icon,lit}]]`, `HEADLINE_1`, `HEADLINE_PRE`, `HEADLINE_2` |
| `event-badge` | 2×3 | Conference badge swinging under spotlights | `YEAR`, `EVENT_1/2`, `NAME_1/2`, `COMPANY`, `ROLE_LABEL`, `ORG_LINE`, `FOOT_LABEL` |
| `project-card` | 2×3 | Panning screenshot, shine, name, tags (one block per project) | `NAME`, `INDEX`, `TAGS` (≤3), `IMAGE?`, `IMAGE_POS?`, `URL?`, `ACCENT` |
| `logo-marquee` | 3×3 | Three rows of tinted logos scrolling opposite ways | `LOGOS[{src,name}]`, `LABEL`, `HEADLINE`, `HEADLINE_EM`, `SUBLINE` |
| `cta-pulse` | 2×3 | Gradient card with breathing rings and a pulsing button | `HEADLINE_1/2`, `SUB_1/2`, `BUTTON_LABEL`, `BUTTON_URL` |
| `social-orbit` | 2×3 | Network icons orbiting a hub, lit in turn | `NETWORKS[{name,url,icon}]` (≤6), `SOON?`, `HEADLINE_1/2`, `SUB`, `BUTTON_*` |
| `business-tile` | 3×3 | Business/product card, light or dark, chips + marquee | `THEME`, `LOGO_TEXT`, `TAG`, `HEADLINE_1/2`, `SUB`, `CHIPS` (4), `MARQUEE[]`, `URL?` |
| `quote-card` | 3×2 / 4×2 | One quote, author, travelling underline | `QUOTE` (≤90 chars), `NAME`, `ROLE`, `COMPANY?`, `INITIALS?` |
| `timeline-card` | 3×3 / 4×4 | Vertical timeline, dots light in turn | `TAG`, `TITLE`, `ITEMS[{year,text}]` (2–4) |
| `link-list` | 3×2 / 4×2 | Up to 3 link rows, travelling highlight | `TAG`, `LINKS[{label,hint,url}]` (≤3) |
| `status-tile` | 2×1 | Pulsing dot + short status | `STATUS` (≤18 chars), `SUB` (≤24), `URL?` |
| `testimonials-banner` | 8×2 / 4×2 | Rotating client quotes, progress bar, chips/avatars | `QUOTES[{text,name,role,company,tag,initials?}]` (2–5), `TAG_LABEL` |

Available icons: `social-orbit` → linkedin instagram x youtube github tiktok facebook globe mail. `role-pills` → pen puzzle spark win mega bulb layers target route (see the template for the rest).

## `site.json` shape
```json
{
  "site": { "name": "…", "accent": "#12b5a6" },
  "blocks": [ { "id": "profile", "template": "profile-card", "data": { … } },
              { "id": "email", "native": "Email" } ],
  "layout": {
    "desktop": [ ["profile@3x2", "about@3x3", "event@2x3"], … ],
    "mobile":  [ … ]
  }
}
```
See `examples/site.json` for a complete working file (17 blocks, both layouts).

## Template syntax (mini engine in `scripts/kasbu.js`)
- `{{KEY}}` escaped value, `{{KEY|default}}` with fallback, `{{RAW_KEY}}` unescaped (for CSS / pre-built markup).
- `{{#each LIST}}…{{.}} / {{.field}}…{{/each}}`, `{{#if KEY}}…{{else}}…{{/if}}`, `{{.length}}`.
- `{{> partial prefix}}` inlines `templates/partials/<partial>.css` with the block's class prefix.
- Derived values (padding rows, keyframe percentages, initials…) come from `derive[template]` in `scripts/kasbu.js`.

## Authoring a new template
1. **Ask what the tile says** (one idea) and its size. Pick a **unique 2-letter prefix** not in the table above.
2. Copy the closest template. Keep: comment header, root with `container-type:inline-size`, `{{> page-bg xx}}`, `{{> noise xx}}` (or `noise-ink`), reduced-motion block, `aria-label`.
3. Size everything in `cqw`; add the `aspect-ratio` on an inner wrapper if it needs a phone layout (`05-responsive.md`).
4. Animations: pick from `04-animation-patterns.md`; explicit keyframes.
5. Document fields in the header comment; if lists need padding or computed values, add a `derive` entry.
6. Add it to `examples/site.json`, run `build`, check **both** preview grids, run `lint`.
7. Add a row to this table.
