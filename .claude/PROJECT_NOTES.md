# Project notes

Context for future Claude sessions working on this repo. Read this before making
changes — it covers what the site is, how it's built, and what's been done so far.

## What this is

`vashishtkumar99.github.io` — Vashisht Kumar's personal site. Hand-built, no
frameworks, no build step, no npm. Deploys automatically via GitHub Pages on
push to `main`. See [README.md](../README.md) for the original setup notes.

## Stack & conventions

- **Plain HTML/CSS/JS.** Every page is a standalone `.html` file with its own
  `<head>`, sharing `styles/main.css`, `styles/animations.css`,
  `styles/responsive.css`, and `js/app.js` / `js/animations.js`.
- **Design system** lives in `styles/main.css` as CSS custom properties:
  - Palette: warm paper background, sage green accent, warm-black ink.
    `--paper`, `--ink`, `--ink-soft`, `--gray`, `--line`, `--sage`,
    `--sage-deep`, `--sage-tint`.
  - Type: Instrument Serif for headings (`--font-display`), Inter for body
    (`--font-body`).
  - Spacing scale: `--space-1` through `--space-6`.
  - Dark mode via `[data-theme="dark"]` on `<html>`, toggled by
    `js/app.js` and persisted to `localStorage`; respects
    `prefers-color-scheme` on first visit. Every page has a small inline
    `<script>` in `<head>` that sets the attribute before paint to avoid a
    flash of the wrong theme — copy that block exactly on any new page.
  - Reusable components: `.btn` / `.btn--solid` (buttons), `.chip` (small
    pill buttons/filters, has `.is-active` state), `.status` /
    `.status--building` / `.status--live` / `.status--archived` (dot + label
    status tags), `.link` (underline-on-hover inline links), `.eyebrow`
    (small-caps section label), `.timeline` (accordion, used for career and
    the DJ curriculum), `.gear-card`, `.post-card`.
- **Nav/header/footer markup is duplicated per page** (no templating) —
  when adding a new page, copy the header/footer from an existing one
  (e.g. `dj.html`) rather than writing it from scratch, and remember to set
  `aria-current="page"` correctly and update `canonical`/`og:*` meta tags.
- **Content data**: blog posts live in the `POSTS` array at the top of
  `js/app.js`, which drives both the homepage "Recent notes" preview and
  the full `writing.html` list/filters. Adding or removing a post means
  editing `POSTS`, adding/removing the actual `writing/*.html` file, and
  updating `sitemap.xml`.

## Site structure

| File | Purpose |
|---|---|
| `index.html` | Home — about, career timeline, interests, now, writing preview, contact |
| `vibe-coding.html` | Project showcase (Duet, Atlas, Trading co-pilot, Flight logbook) |
| `dj.html` | DJ journey overview — curriculum summary, practice tool section, gear, mixes, playlists, gallery |
| `dj-plan.html` | Full 12-week DJ curriculum, session-by-session |
| `dj-controller.html` | Interactive virtual DJ controller (see below) |
| `writing.html` | Blog index with search + category filters |
| `writing/*.html` | Individual posts |
| `404.html` | Not-found page |
| `.claude/agents/` | Project-specific subagents: `site-planner.md`, `site-coder.md`, `site-reviewer.md` |

## The virtual DJ controller (`dj-controller.html`)

The largest single feature built in this repo so far. Renders an interactive
Pioneer DDJ-FLX4 / DDJ-FLX2 in the browser (click to test drills, or connect
a real controller over USB via the Web MIDI API to mirror it live). Also
supports recording/replaying button-and-knob sessions, exporting/importing
custom MIDI mappings, and screen recording.

Key design decisions, in case they get second-guessed later:

- **The hardware graphic is scoped under `#mixTracker`** so its internal
  classnames (`.deck`, `.pad`, `.knob`, `.mixer`, etc.) can never collide
  with or get overridden by the site's own CSS. Everything *around* the
  graphic (the controller-select dropdown, Connect MIDI, session buttons,
  press log, advanced tools) uses the site's real components (`.btn`,
  `.chip`, custom small CSS) — it was deliberately pulled *out* of the
  hardware-styled box so it reads as part of the page, not a bolted-on
  widget.
- **Accent color is real hardware orange** (`#f59b2d` / `#a96f24`), not the
  site's sage — matched against actual DDJ-FLX4/FLX2 product photos. This
  was tried as sage first and explicitly reverted; don't re-theme it sage
  again without checking reference photos.
- **Hardware labels use `var(--font-body)`** (Inter), not a monospace font —
  originally IBM Plex Mono, changed because it looked disconnected from the
  rest of the site.
- **Only DDJ-FLX4 and DDJ-FLX2** are supported controllers. XDJ-RR was
  removed entirely (data, MIDI mappings, copy) — the owner only has/cares
  about the FLX4 and FLX2.
- **Connect MIDI is its own status indicator**, not a plain button: amber
  "Connect MIDI" pill by default, flips to a sage "MIDI Connected" pill
  (reusing the site's `.status--building` / `.status--live` dot+label
  language from vibe-coding.html) once a device answers. It's right-aligned
  in its row.
- **The Learn / Save map / Load map tools are hidden** (`hidden` attribute,
  not deleted) — element IDs and JS wiring are intact so they can be
  un-hidden later by removing the attribute. "Clear" (the log-clearing
  button) was pulled out of that group and lives next to the press log's
  event count instead.
- **What was deliberately *not* built**: a second source project
  (`~/Downloads/vashi-dj/`) had a Supabase-backed live progress tracker and
  a PIN-gated "edit mode." Neither was integrated. `dj-plan.html` already
  covers the curriculum statically, and the edit-mode PIN was client-side
  only with no real access control behind it (the Supabase anon key was
  public either way) — flagged as a security concern and skipped rather
  than shipped.

## Known environment quirks (not site bugs)

When testing this site locally through the Claude Browser pane tool during
this work: `computer.screenshot` occasionally returns a blank or stale/
mid-transition frame, especially right after `scrollIntoView` or resizing.
Direct DOM checks via the JS tool (`element.hidden`, `.className`,
`.textContent`, etc.) are more reliable than trusting a single screenshot —
verify state via JS first, then screenshot to confirm visually, and re-shoot
once if the first capture looks wrong before concluding something is
actually broken.

To preview locally: `python3 -m http.server 8000` from the repo root, then
either open `localhost:8000` directly or use the Browser pane's
`preview_start` with a `.claude/launch.json` config pointing at that URL.

## Git / deploy

- Remote is set to SSH (`git@github.com:vashishtkumar99/vashishtkumar99.github.io.git`)
  using an existing key already authorized on the GitHub account — pushes
  from this environment work without further auth setup.
- Pushing to `main` deploys automatically (GitHub Pages, `username.github.io`
  repo convention) within a minute or two.
- Only commit/push when explicitly asked — this has been the working pattern
  throughout: make changes, verify locally, summarize, wait for a "yes"
  before committing.

## Change log

Reverse chronological. Each entry is a commit already on `main` unless noted.

- **Polish DJ controller UI: borderless select, MIDI status pill, clearer labels**
  Removed the boxed border from the controller-select dropdown (custom
  chevron, no background). Turned Connect MIDI into a right-aligned
  amber/sage status pill instead of a plain button + separate badge.
  Relabeled session buttons to Record/Replay/Save/Load Movements and Record
  Screen. Made the log's Clear button higher-contrast so it doesn't blend
  into the gray event count.
- **Give the virtual controller its own DJ page section, polish its UI**
  Added a dedicated "Practice tool" section to `dj.html` (previously the
  controller was just a link crammed into the curriculum section). Hid the
  Learn/Save map/Load map mapping tools for now. Moved Clear next to the
  press log's count. Made Connect MIDI transparent with a separate
  connected-state badge (later replaced by the status-pill approach above).
  Added a custom chevron to the dropdown (first pass, later restyled
  borderless).
- **Trim writing to two posts, add Atlas project, restyle DJ controller to
  match real hardware**
  Removed the "Designing an app for exactly two users" post (file, `POSTS`
  entry, sitemap row) so Writing only covers the DJ and flight-history
  posts. Fixed a stale copy-pasted `og:title` bug present on all writing
  posts. Added an Atlas (travel journal app) project card to
  `vibe-coding.html` and synced the homepage teaser copy. Restructured
  `dj-controller.html` so page chrome (buttons, log, dropdown) uses real
  site components instead of living inside the hardware-styled box; dropped
  the outer card background; reverted the accent color from sage back to
  real DDJ-FLX4/FLX2 orange; removed the XDJ-RR option.
- **Add virtual DJ controller page, project agents, and sync résumé/career copy**
  Built `dj-controller.html` from a separately-provided "Mix Tracker" HTML
  tool, reskinned to match the site (sage accents at the time, later
  reverted to orange — see above). Added `.claude/agents/` (site-planner,
  site-coder, site-reviewer), modeled on a similar setup in another
  project. Replaced `assets/Vashisht_Kumar_Resume.pdf` with a newer draft
  and corrected several career-section bullets in `index.html` to match
  facts in the new résumé (OPEX savings figures, the NA Lead for Center of
  Excellence title/achievement that was missing entirely, PE-backed sale
  readiness detail, and a few other dropped numbers).
- **Initial repo state** (`5879dbc`, `823fc9f`, `3251b35` — pre-existing,
  not done in this working session): the original hand-built site as
  uploaded, plus `dj-plan.html` and the DJ journey content.
