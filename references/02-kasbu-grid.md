# 02 · Kasbu grid and sizing

## Geometry (measured on a real page)

| | Desktop view | Phone view |
|---|---|---|
| Columns | **8** | **4** |
| Unit (1 column / 1 row) | 78 px | ~78 px |
| Gap | 36 px | ~12 px |
| Tile = n units wide | 78n + 36(n-1) | 78n + 12(n-1) |

Common sizes (width × height in px):

| Size (cols×rows) | Desktop | Phone |
|---|---|---|
| 1×1 | 78×78 | 78×78 |
| 2×1 | 192×78 | 168×78 |
| 3×2 | 306×192 | 258×168 |
| 3×3 | 306×306 | 258×258 |
| 2×3 | 192×306 | 168×258 |
| 4×2 | 420×192 | **348×168** |
| 4×4 | 420×420 | 348×348 |
| 8×2 | 876×192 | — (use 4×2) |

Rules that follow:
- A tile that spans **all 8 columns on desktop becomes 4 columns on phone** (half the width). Squeezing it into 4×1 makes everything tiny. Design a **4×2** version.
- The phone grid is narrower per tile than desktop at the same unit count (a 3-col tile is ~258 px, not 306 px). Blocks scale with `cqw`, so they shrink gracefully; check type size.
- Desktop and phone layouts are arranged **separately** by the user in Kasbu; the same HTML block is used in both. So one block must carry **both** layouts (see `05-responsive.md`).

## How the HTML tile behaves

Observed:
- Code runs in an **iframe**; the frame height follows the block's in-flow content (min height ≈ 100 px). `position:fixed` elements collapse it — don't use them.
- If the slot is **taller** than the block, the extra area is not part of your block. Setting `html,body{margin:0;background:#0b0b0d}` (the page's black) avoids a white strip.
- The block can read the slot **width** (container queries) but not its height.

Inferred / to verify in the user's editor:
- Slot widths on a given phone vary a little (≈ 290–390 px). Treat 315 px as the phone threshold for 3-column blocks and 640 px for full-width banners.
- Whether Kasbu rounds the tile corners itself (assume yes: use `border-radius:inherit`).

If you can't open the user's editor, say what you assumed.

## Choosing sizes for blocks
- Hero / identity: 3×3 or 3×2 (+ a photo tile of 3×3).
- Stats: three 1×1 in a row.
- Portrait-shaped stories (events, projects, CTA): 2×3.
- Full-width social proof: 8×2 → 4×2.
- Don't leave holes: fill the grid in rows of 8 units on desktop (e.g. 3+3+2) and 4 on phone (e.g. 2+2, 4, 3+1 stats + native tile).
- Native Kasbu tiles (links, WhatsApp, email, music, etc.) stay native — mix them with code tiles; `site.json` marks them with `"native": "label"`.
