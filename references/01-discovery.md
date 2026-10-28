# 01 · Discovery: learn about the person before designing

Goal: a **confirmed fact sheet**. Designs built on guesses look generic and, worse, can publish wrong claims under the person's name.

## 1. The interview (ask in two or three short rounds, not a wall of questions)

**Who**
- Name as you want it shown, city, languages of your audience.
- One sentence: what do you do, and for whom?
- Roles you want visible (max 6–9). Which one comes first?

**What you build**
- Businesses, products or projects (name, one line, URL, your role, status: live / in progress / private).
- For each: does it have its own brand (colors, logo, fonts)? Where can I see it?

**Proof**
- Numbers you stand behind (years, projects, clients) — and *what each number counts*.
- Clients or brands you can show publicly (and which you can't).
- Testimonials you already publish (who said it, where).
- Events, talks, awards, education, communities (year + your role: speaker / organizer / attendee).

**Reach**
- How should people contact you? (WhatsApp / email / calendar). Social links (or "later").
- Is there a call to action you want pushed (book a call, join a waitlist, buy)?

**Feel**
- 3 words for the tone (serious, playful, operator-like, warm…). Pages or people whose look you like.
- Accent color preference (or "extract it from my site").
- Dark, light, or mixed.

**Assets**
- Portrait photo? Logos (SVG/PNG, transparent)? Project screenshots? Where are they hosted?

## 2. Optional deep dive A — mine their past conversations / memory (needs a clear "yes")

Ask, in the user's language, something like:

> I can search your previous Claude conversations and saved memory for facts about you and your business (names, services, clients, events, brand colors). I would only read titles and short snippets, summarize what I find, and **you confirm everything before I use it**. I won't use contact details, tax/ID documents or anything sensitive unless you say so. Want me to do that?

If yes:
- **Claude Code desktop**: use the session search tool (`search_session_transcripts`) with short queries — the person's name, business names, "clients", "event", "brand", "portfolio", "colors". Read only the snippets. Use the memory folder if there is one (`~/.claude/projects/<project>/memory/`).
- **Claude Code CLI**: look at `CLAUDE.md`, the memory folder and, only with permission, grep the transcripts under `~/.claude/projects/`.
- **No such access**: ask them to paste the bio/about text they already use.
- Collect facts into a table: *fact · where it came from · confidence · needs confirmation?*
- **Watch for stale or second-hand facts.** A draft post about "the speaker" may not be about *them*. Example from a real build: a LinkedIn draft described a talk given by a client's founder; the user had spoken at the *previous* edition. Always ask "is this about you?" before attributing.
- Show the table and let the user strike or correct rows. Never silently drop facts that contradict each other — ask.

## 3. Optional deep dive B — public sources (needs a clear "yes" and the URLs)

Ask for the URLs (business site, existing portfolio, product site). Then:
- Fetch with the available tool (web fetch or the browser pane). Public pages only; no logins.
- Extract, in this order: **brand colors** (CSS custom properties / computed styles of buttons and headings), **fonts** (`font-family` of body and h1), **logo** (inline SVG from the header, or the image URL), **headline and one-liner**, **services/offerings**, **client logos** (with the `alt` text), **testimonials** (verbatim + attribution), **links** (social, contact).
- Take short excerpts and the user's own wording; don't copy long passages of someone else's copy. Testimonials belong to the person quoted — keep them short and attributed.
- Hot-linked images (logos, screenshots, portraits) break if the source site changes. Warn the user and suggest hosting a copy they control. Never reuse a **client's or colleague's face**; use initials.
- If a site's rebrand supersedes older brand notes, trust the site and say so.

## 4. The fact sheet (what you hand back for confirmation)

```
Identity      name · city · languages
One-liner     …
Roles         [ordered list]
Businesses    name · one line · URL · brand (colors, fonts, logo) · status
Numbers       value · what it counts · confirmed? (y/n)
Proof         clients (public ok?) · testimonials · events (year, role) · education · communities
Reach         primary CTA + link · socials (or "later")
Assets        portrait · logos · screenshots · hosted where
Tone & look   3 words · accent color · dark/light/mixed
Open questions  …
```
Get an explicit "yes, that's right" (or corrections) before designing.

## 5. After the build
Offer to store the confirmed sheet and the layout decisions (in the project's memory or a `facts.md`) so later sessions don't re-ask. Record dates for numbers that change ("30+ clients as of 2026-10").
