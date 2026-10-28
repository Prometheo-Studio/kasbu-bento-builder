# 05 · Responsive blocks (desktop vs phone)

Kasbu is used on phones as much as on desktops. The same block is pasted into both views, so **each block must adapt to its slot width on its own.**

## The wrapper pattern (container queries)

A container cannot query its own size, and `aspect-ratio` on the container would fight the query. So use two layers:

```html
<div class="xx" style="...">          <!-- container: container-type:inline-size; width:100% -->
  <style>… </style>
  <div class="xx-in">                  <!-- aspect-ratio lives here; position:relative; overflow:hidden -->
    … absolutely positioned content in cqw …
  </div>
</div>
```
```css
.xx{container-type:inline-size;display:block;width:100%;border-radius:inherit;background:#0b0b0d}
.xx-in{position:relative;width:100%;aspect-ratio:307/193;overflow:hidden;isolation:isolate;border-radius:inherit}
@container (min-width: 315px){      /* phone layout for a 3-column block */
  .xx-in{aspect-ratio:21/10}
  …
}
```
- Inside a container-query block, `cqw` still refers to the container's width.
- Put the noise overlay on `.xx-in::after`, not on the container.

## Thresholds
| Block | Desktop slot | Phone slot | Rule |
|---|---|---|---|
| 3-column block (3×2) | 306 px | ~260–350 px | `@container (min-width:315px)` → phone layout. (Desktop 306 < 315 ≤ phone.) Very small phones (<315 px) fall back to the desktop layout, which still works. |
| Full-width banner | 876 px | ~350 px | `@container (max-width:640px)` → phone layout |

**Don't** detect phones with `hover:none` / `pointer:coarse`: the editor's phone preview on a desktop browser has a mouse, so you'd never see the phone layout while building.

## Designing the 4×2 phone layout (≈ 348×168, ratio 2.07 → use `21/10`)
- The tile is **shorter than the 3×2 desktop version relative to its width**. Don't keep all content: drop the third row of pills, replace side chips with round avatars, remove decorative marks that collide with text.
- **Bigger type**: quotes 5 cqw, roles 4.2 cqw, buttons 4.7 cqw (≥ 42 px tall for fingers).
- Anchor text to the corner the user asked for (e.g. quote bottom-left beside a vertical progress bar) instead of centering everything.
- Keep a clear gap (≥ 3 cqw) between stacked groups.
- Layout switches should keep **the same animation timing** so the block feels the same.

## Testing (what to actually do)
1. `node scripts/kasbu.js build site.json` → preview has a **Desktop** and a **Mobile (4 columns)** section with the real slot sizes.
2. Make a quick comparison page with the block at **307 px**, **350 px** and **320 px** wide if you're tuning one block.
3. Look for: text overlapping the next row, button cut off, quote lines wrapping to 4+, small type (< ~11 px at 350 px width), animated elements leaving their frame.
4. After pasting into Kasbu, check both views once and send a screenshot if anything looks off.

Important when testing: **never paste two different versions of the same block into one test page** — they share class names, so the old css overrides the new one and you'll "see" a bug that doesn't exist for the user.
