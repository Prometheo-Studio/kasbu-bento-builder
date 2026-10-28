# 03 · Design system

One page, one system. These rules are what made 17 different blocks look like one product.

## Tokens
- **Page black**: `#0b0b0d`. Every block root and `html,body` use it.
- **Ink**: `#f4f1ec` on dark. On light tiles: cream `#f4f1ec` + ink `#0b0b0d` (or the brand's own navy).
- **Muted text**: ink at 55–62 % (`rgba(244,241,236,.6)`). Never lower than ~55 % — it stops being readable on phones.
- **One accent** for the page (`site.accent`). Templates read it through CSS variables so one value recolors everything:
  `--a` (accent), `--a-rgb` (for `rgba(var(--a-rgb),.3)`), `--a-dk` (darker, for text on light), `--a-lt` (lighter, for gradients on dark).
  Per-block override: `data.ACCENT` (used for project cards, each with its own dot color).
- **Brand tiles** (a business, a product) may use that business's own palette — extract it from its site. Keep it inside the tile.

## Type
- Default: **Inter** (400/500/600/700) + **JetBrains Mono** (500) for small labels in brackets, e.g. `[ projects ]`.
- Headlines: 600–700, tight tracking (`letter-spacing:-.03em` to `-.045em`), line-height ~1–1.1.
- Brand tiles can bring the brand's fonts (e.g. a serif wordmark). Load them with `@import` at the **top** of the block's `<style>`.
- Minimum sizes on a phone: body 3.5 cqw (~12 px at 350 px width), labels 3 cqw, quotes ≥ 4.6 cqw.

## Units: `cqw`, not px
Every block's root is `container-type:inline-size`; all sizes are `cqw` (1 cqw = 1 % of the block's width). The block then scales to any slot. Corollaries:
- The container can't query its own size → wrap content in an inner element (`.xx-in`) and put `aspect-ratio` on that (see `05-responsive.md`).
- Use `aspect-ratio` on the root or the inner wrapper so the iframe has a height.

## Surface language
- Cards are flat dark surfaces with **one** soft radial glow in the accent, a hairline border `rgba(255,255,255,.08–.14)` and a faint grain.
- **Grain** (noise overlay): `partials/noise.css` (white specks on dark, `opacity:.3`) and `noise-ink.css` (dark specks on light, `opacity:.14`). It animates with `steps(1)` so it flickers like film, not like a loop. Too strong = washed-out blacks; the values above are tuned.
- Rounded pills (`99px`) for chips and roles; 2.4–4 cqw radius for inner cards. The outer radius is `inherit` — Kasbu rounds the tile.
- Contrast on purpose: light tile next to dark ones (profile card, business tile), dark portrait tile next to light.

## Copy
- Short. A tile is read in a second. Headline ≤ 6 words, subline ≤ 10.
- Claims are **specific and true** ("10+ years", "30+ clients as of 2026"). No superlatives.
- Voice follows the person's tone (operator / warm / playful). Don't import marketing clichés.
- Language: the audience's. Keep quotes in their original language unless the user asks to translate (mark translations as such).

## Accessibility
- `role="group"` + `aria-label` on each root; decorative layers `aria-hidden="true"`.
- Motion is always optional: every block has `@media (prefers-reduced-motion:reduce)` that stops animation and shows a sensible final state.
- Links are real `<a>` with `rel="noopener"`; whole-tile links are fine for single-purpose tiles.
- Text over photos sits on a gradient mask, never on raw image.
