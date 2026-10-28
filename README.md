# kasbu-bento-builder

A Claude skill that builds animated, responsive **bento-grid portfolios for Kasbu** (kasbu.bio) as copy-paste HTML code tiles — desktop (8 columns) and phone (4 columns) — and previews them before you paste anything.

What it does:
1. **Interviews you** (who you are, what you sell, links, accent color) and — only with your permission — recovers facts from past conversations/memory and public sources like your website.
2. **Plans** the grid for desktop and phone.
3. **Builds** self-contained blocks from 15 animated templates (counters, typed roles, orbiting socials, marquees, testimonials, quotes, timelines, link lists, status chip, event badge…), themed with one accent color.
4. **Previews** both layouts in the Claude Code browser pane (or a private Artifact).
5. **Delivers** the code row by row, with sizes and what to edit.

## Install
Copy the folder to `~/.claude/skills/kasbu-bento-builder/` (all projects) or `<project>/.claude/skills/kasbu-bento-builder/`. Requires **Node 18+** (no packages). Then ask Claude: *"Build my Kasbu page"*.

## Manual use
```bash
node scripts/kasbu.js build examples/site.json --out examples/out
node scripts/kasbu.js serve examples/out 5173     # open http://localhost:5173/preview.html
node scripts/kasbu.js lint examples/out
```
Edit `site.json` (your data, accent, layout) and rebuild.

## Layout
- `SKILL.md` — instructions for Claude
- `references/` — discovery, grid, design system, animations, responsive, preview/delivery, pitfalls, block catalog
- `templates/` — block templates + shared partials
- `scripts/kasbu.js` — build / lint / serve
- `examples/` — demo `site.json` and its output

## Honest limits
Tested in a local browser preview only — not in Kasbu's live editor or on a physical phone. Slot sizes are measured from one real page; check yours and adjust. Never invent facts: unknown details stay as placeholders until you confirm them.
