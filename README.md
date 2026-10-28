# kasbu-bento-builder

A Claude skill that builds animated, responsive **bento-grid portfolios for Kasbu** (kasbu.bio) as copy-paste HTML code tiles — desktop (8 columns) and phone (4 columns) — and previews them before you paste anything.

What it does:
1. **Interviews you** (who you are, what you sell, links, accent color) and — only with your permission — recovers facts from past conversations/memory and public sources like your website.
2. **Plans** the grid for desktop and phone.
3. **Builds** self-contained blocks from 17 animated templates (counters, typed roles, orbiting socials, marquees, testimonials, quotes, timelines, link lists, status chip, product card, restaurant menu, event badge…), themed with one accent color.
4. **Previews** both layouts in the Claude Code browser pane (or a private Artifact).
5. **Delivers** the code row by row, with sizes and what to edit.

## Install (step by step)

**You need:** [Claude Code](https://claude.com/claude-code) (terminal, desktop app or IDE extension), **Node 18+** (`node -v` to check), and optionally Git.

### 1. Download the skill
Pick one:

- **With Git (recommended, easy to update)**

  macOS / Linux:
  ```bash
  git clone https://github.com/Prometheo-Studio/kasbu-bento-builder ~/.claude/skills/kasbu-bento-builder
  ```
  Windows (PowerShell):
  ```powershell
  git clone https://github.com/Prometheo-Studio/kasbu-bento-builder "$HOME\.claude\skills\kasbu-bento-builder"
  ```
- **Without Git:** on GitHub click **Code → Download ZIP**, unzip it, and move the folder to `~/.claude/skills/` (Windows: `C:\Users\<you>\.claude\skills\`). The folder must be named `kasbu-bento-builder` and contain `SKILL.md` directly inside.
- **Only for one project:** use `<your-project>/.claude/skills/kasbu-bento-builder/` instead.

### 2. (Optional) Add the short command `/kasbu`
The skill already answers to `/kasbu-bento-builder`. For the short alias, copy the command file:

macOS / Linux:
```bash
mkdir -p ~/.claude/commands && cp ~/.claude/skills/kasbu-bento-builder/commands/kasbu.md ~/.claude/commands/kasbu.md
```
Windows (PowerShell):
```powershell
New-Item -ItemType Directory -Force "$HOME\.claude\commands" | Out-Null
Copy-Item "$HOME\.claude\skills\kasbu-bento-builder\commands\kasbu.md" "$HOME\.claude\commands\kasbu.md"
```

### 3. Start a new Claude Code session
Skills and commands are loaded when a session starts, so open a **new** session (or restart Claude Code) in the folder where you want your Kasbu files.

### 4. Run it
Type either command, or just ask in plain words:
```
/kasbu
/kasbu build my portfolio, I'm a product designer and founder
/kasbu-bento-builder add a testimonials banner
Make me a Kasbu page
```

### 5. What happens next
1. **Interview:** Claude asks who you are, what you offer, your links and your accent color. It only searches your past conversations or reads your website if you say yes.
2. **Plan:** it proposes a layout for the desktop grid (8 columns) and the phone grid (4 columns) and waits for your OK.
3. **Build:** it renders the blocks, lints them and opens a **preview of desktop and phone** side by side.
4. **Deliver:** you get the code block by block, with the size to use on each view.

### 6. Paste into Kasbu
In your Kasbu editor add an **HTML / code tile**, paste one block, then set its size in the desktop view and again in the phone view. Repeat for each block.

### Update / remove
```bash
git -C ~/.claude/skills/kasbu-bento-builder pull      # update
```
To remove it, delete the `kasbu-bento-builder` folder (and `~/.claude/commands/kasbu.md` if you added the alias).

## Manual use (without Claude)
```bash
node scripts/kasbu.js build examples/site.json --out examples/out
node scripts/kasbu.js serve examples/out 5173     # open http://localhost:5173/preview.html
node scripts/kasbu.js lint examples/out
```
Edit `site.json` (your data, accent, layout) and rebuild.

## Layout
- `SKILL.md` — instructions for Claude
- `commands/kasbu.md` — the optional `/kasbu` alias
- `references/` — discovery, grid, design system, animations, responsive, preview/delivery, pitfalls, block catalog
- `templates/` — 17 block templates + shared partials
- `scripts/kasbu.js` — build / lint / serve
- `examples/` — demo `site.json` and the page built for this skill

## Principles
Never invent facts: unknown details stay as placeholders until you confirm them. Searching your conversations or websites is always opt-in.

## License
MIT
