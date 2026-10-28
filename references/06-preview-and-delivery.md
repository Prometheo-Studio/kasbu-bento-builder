# 06 · Preview and delivery

## Build + preview
```bash
node scripts/kasbu.js build site.json --out out     # writes out/blocks/*.html + out/preview.html, lints everything
node scripts/kasbu.js serve out 5173                # static server → http://localhost:5173/preview.html
node scripts/kasbu.js lint some/folder               # lint hand-written blocks too
```
`preview.html` draws the **desktop grid (8 × 78 px, 36 px gaps)** and the **phone grid (4 × 78 px, 12 px gaps)** using each block's slot from `site.json` → `layout.desktop` / `layout.mobile`. Dashed tiles are native Kasbu tiles (`"native": "Email"`).

### Showing it in Claude Code
- **Browser pane (best)**: run `serve` in the background, then `preview_start` with `{url: "http://localhost:5173/preview.html"}`. Use `read_page` / screenshots to check, and `resize_window` for narrow widths. Close old tabs first — the pane has a tab cap.
  - Opening `file://` pages works only for small files in embedded browsers (observed limit ≈ 150 KB); the local server has no such limit.
- **Artifact**: if the user wants a link or to share the preview, publish `preview.html` as a **private** Artifact (the artifact tool needs a self-contained page: the preview already inlines the blocks; fonts come from Google Fonts). Don't publish anything that contains private data without asking.
- **Fallback**: send the file to the user (`SendUserFile`) or tell them to double-click it.
- Animations: a static screenshot catches one frame; to see end states, step the animations in the page (`document.getAnimations()`) or disable them and set final transforms. Don't claim motion was verified if you only saw frames.

## Iterating
- Keep every version the user has seen: copy `name.html` → `name-v1-….html` before a redesign.
- When the user pastes screenshots from Kasbu, compare slot size vs block size first (white strip? cut-off? tiny text?) — most issues are sizing, not CSS.
- If something looks wrong in your test page but fine in the block alone, suspect **class-name collisions** between versions.

## Delivering code
For each row, in the order the blocks appear:
1. A heading with the block name and **slot size for desktop and for phone**.
2. The code in one fenced `html` block (complete: comment header, `<style>`, markup).
3. One line on what to edit (link, text, image URL).

Then a short closing list:
- Links/handles to fill; numbers to confirm; images they should host themselves (hot-linked images break if the source changes).
- "Replace, don't add" — pasting a new version next to the old one makes their styles clash.
- What you didn't test (real Kasbu editor, real phone).

## Pasting into Kasbu (tell the user)
1. Add an HTML / code tile.
2. Paste the block.
3. Set its size in the desktop view and again in the phone view (e.g. profile 3×2 and 4×2).
4. Check both views; send a screenshot if anything looks off.

## Keeping the project alive
- Offer to save `site.json` + the confirmed fact sheet in the project so the page can be regenerated or restyled later (change `site.accent`, re-run build).
- When the user changes a fact, edit `site.json` and rebuild rather than hand-editing HTML.
