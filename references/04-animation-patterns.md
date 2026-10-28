# 04 · Animation patterns (CSS only)

Kasbu blocks should *feel alive* without scripts. Everything below is CSS-only (no JS), cheap (animates `transform`, `opacity`, `box-shadow`, `width` only on tiny elements) and respects reduced motion.

## Rules that prevent the classic bugs
1. **Never write an empty keyframe** like `28%,100%{}`. An empty block doesn't define properties, so the browser interpolates from the previous keyframe to the *underlying* value across the whole span — the highlight fades out over 78 % of the cycle instead of snapping. Always write the explicit end values. (The linter flags this.)
2. **Stagger with `animation-delay`, share one `@keyframes`.** Give each item `style="--d:3"` and use `animation-delay:calc(var(--d) * 1s)`.
3. **Cycle math.** For N items each visible for T seconds: duration = N×T, delay = i×T, visible window = 0 → (100/N)% of the keyframes. Templates that need this compute the percentages (`derive` in `scripts/kasbu.js`).
4. **Base state = hidden/idle.** Before an animation's delay elapses, the element shows its base style — set base `opacity:0` for things that appear later.
5. **Prefix every keyframe name** with the block prefix (`st-r`, `pc-ty`…). Two blocks on one page share the global keyframe namespace.
6. **Reduced motion**: stop everything (`animation:none!important`) and show the final or first state (counter at its final number, first quote visible, first role fully typed).
7. **Don't animate layout** (width/height of big elements, top/left). Use `transform`. (Exception: typed text uses `width` on a one-line span.)
8. Animations in an iframe keep running while off-screen; keep the count modest (≈ 3–6 animated things per tile).

## Catalog

### Counter reel (stat tiles)
A column of numbers 0…N clipped to one line high, translated up in `steps(N)`:
```css
.win{height:1em;overflow:hidden}
.reel{display:flex;flex-direction:column;animation:r 6s infinite}
.reel span{display:block;height:1em;line-height:1}
@keyframes r{0%{transform:translateY(0);animation-timing-function:steps(N)}33.33%{transform:translateY(-Nem)}86%{transform:translateY(-Nem)}93%,100%{transform:translateY(0)}}
```
Pair it with a visual that fills at the same pace (dots on a ring, a mosaic): `animation-delay:calc(var(--k) * (2s/N))`. A "+" fades in once the count ends.

### Typed text with variable length
```css
.roles span{width:0;overflow:hidden;white-space:nowrap;border-right:.5cqw solid var(--a-dk);opacity:0;animation:ty 12s infinite;animation-delay:calc(var(--d) * 1s)}
@keyframes ty{0%{width:0;opacity:1;animation-timing-function:steps(var(--n))}8%,20%{width:calc(var(--n) * 1ch);opacity:1}22%,100%{width:calc(var(--n) * 1ch);opacity:0}}
```
Use a **monospace** font so `ch` equals one character; set `--n` to the text length (the build script passes `{{.length}}`). Four roles × 3 s = a 12 s loop.

### Marquee (infinite horizontal scroll)
Two identical sets side by side, translate −50 %; alternate direction per row (`reverse` via a second keyframe). Mask the edges: `mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)`. Pause on hover (`animation-play-state:paused`). Make each set wider than the tile.

### Orbit with upright icons
Parent rotates 360° (`30s linear`); each child sits at `rotate(a) translateY(-r)`, and its icon counter-rotates: keyframes `from{rotate(-a)} to{rotate(-a-360deg)}`. Lights up in sequence with a shared `lit` keyframe + delays.

### Rotating ticker / quotes
Stack the items absolutely; each has the show-window keyframe (fade up in → hold → fade up out) and its own delay. Pair with a progress bar (`scaleX` 0→1 over the item's time) and highlight the matching chip.

### Shine sweep (buttons, badges, images)
A `::before` gradient strip, `skewX(-18deg)`, translating across with `ease-in-out`, idle for 40 % of the loop:
`@keyframes sw{0%,40%{transform:translateX(-160%) skewX(-18deg)}80%,100%{transform:translateX(420%) skewX(-18deg)}}`

### Pulse rings
Cheap: animate `box-shadow` spread from 0 to a few cqw with alpha to 0 (`0 0 0 3.4cqw rgba(...,0)`). Dramatic: 3 absolutely placed circles scaling 1→4.6 with `opacity` .95→0, delayed by 1/3 of the loop. Make them **large and visible** (that was the feedback on a first, timid version).

### Swinging object (badge on a lanyard)
`transform-origin:50% 0` on the group, `rotate(-4.5deg ↔ 4.5deg)` `alternate ease-in-out 5.5s`. Spotlight beams: `conic-gradient` wedges rotating slowly.

### Ken-Burns pan (screenshots, portraits)
`transform:scale(1.22) translateX(-4% → 4%)`, `alternate`, 11 s. Always crop with `object-fit:cover` inside an `overflow:hidden` frame.

### Reveal on load
`@keyframes up{from{opacity:0;transform:translateY(3cqw)}to{opacity:1;transform:none}}` with `animation:up .9s cubic-bezier(.2,.8,.2,1) both` and staggered delays (.1s, .22s, .32s…).

### Grain
See `partials/noise.css`. Don't animate it faster than ~1 s steps.

### Hover micro-interactions
Lift (`translateY(-.8cqw)`), arrow chip rotates 45°, chip flips to light with original logo colors. Hover doesn't exist on phones — never hide essential info behind it.
