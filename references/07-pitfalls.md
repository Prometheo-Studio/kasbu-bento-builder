# 07 · Pitfalls (each one happened in a real build)

| Symptom | Cause | Fix |
|---|---|---|
| White strip below a tile | Kasbu slot is taller than the block; iframe body is white | `html,body{margin:0;background:#0b0b0d}` in every block (partial `page-bg.css`) |
| Highlight/pulse fades slowly instead of snapping | Empty keyframe stop (`28%,100%{}`) | Write explicit values at every stop |
| Block looks wrong in a test page but fine alone | Two versions with the same class prefix on one page | Unique prefix per block; one version per test page. `build` auto-renames duplicates |
| Block collapses / shows 100 px tall | `position:fixed` or no in-flow height | Use `aspect-ratio` on an in-flow wrapper |
| 4×1 full-width card unreadable on phone | Desktop banner shrunk to half width | Design a 4×2 phone layout with `@container (max-width:640px)` |
| Phone layout never shows while building | Detected phones via `hover:none` | Use container width |
| Phone layout used on desktop 3×2 | Threshold too low | 3-col blocks switch at 315 px (desktop slot is 306) |
| Images vanish later | Hot-linked from a third-party site | Ask the user to host/upload; lint warns on external `src=` |
| Text unreadable on photo | Raw image behind text | Gradient mask under the text |
| Counter shows wrong number at end | `steps(N)` count ≠ reel length | N = number of steps, reel has N+1 rows |
| Typed text clipped/oversized | Proportional font with `ch` units | Monospace for the typed span; `--n` = character count |
| Orbit icons rotate with the ring | No counter-rotation | Per-icon keyframes `rotate(-a) → rotate(-a-360deg)` |
| Wrong facts on a tile | Inferred from memory or a similar person's event | Facts only from the user, their site or confirmed sources; mark unknown as TODO and ask |
| Brand colors off | Guessed | Read them from the business's site CSS/meta theme-color |
| Link tiles dead | Placeholder `#` left in | Lint list of `href="#"`; ask the user for URLs |
| Mixed content / fonts blocked | `http://` assets | Always https |

## Process pitfalls
- **Doing more than asked.** Users want only the requested block/change. Confirm the plan when they ask for one.
- **Verify the home page before writing copy** about a business — current name, branding, offer.
- **Never delete or discard** a previous version without asking; keep `-v1` backups.
- **Over-claiming testing.** A static screenshot is not an animation test; a localhost preview is not the real Kasbu.
