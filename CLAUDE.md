# CLAUDE.md — Sujith's Portfolio

Directive, not prose. Detail lives in `docs/` — read the linked doc before guessing.

## Stack & constraints
- Next.js 16, App Router, Turbopack. React 19. Node 24.
- Tailwind CSS 4, **CSS-first** — tokens live in `app/css/theme.css` (`@theme` block). No `tailwind.config.js`. Don't recreate one; it doesn't exist for a reason (`docs/DESIGN-SYSTEM.md`).
- **Dark-only.** No light mode, no `prefers-color-scheme` toggle. Don't add one.
- Motion: **GSAP only** (`utils/hooks/use-section-reveal.js`, `data-reveal="text"|"figure"`). No other animation library.
- Data-driven content: `utils/data/*.js`. Assets rendered via `app/components/helper/asset-placeholder.jsx` (`ProjectAsset`/`CodePlaceholder`), gated by each entry's `placeholder: true/false`.

## Content is visible without motion or JS
Nothing may ever start hidden and depend on JS/GSAP to reveal it. `useSectionReveal` reveals synchronously and fails open (reduced-motion, no-JS, or a thrown error all leave content visible, never hidden) — follow that same pattern in anything new. Never ship an opacity-0-by-default class that only a script clears.

## Facts about Sujith
`docs/CONTENT-AUDIT.md` is the **only** source of truth for anything about him (identity, experience, education, results). Never invent, infer, or embellish a fact, number, or credential not already there or explicitly given in the conversation. If a fact is needed and isn't in the audit, ask — don't fill the gap.

## The five featured projects ≠ Experience
Aircraft Design, CubeSats and Satellites, Drone and UAV, Rocket Design Technology, Rover (`utils/data/projects-data.js`) are Sujith's **personal/passion projects** — currently 100% `TODO` placeholder, not resume-verified, and never to be treated as equivalent to his resume-verified professional work. That work (RobotX, Aliena PMA, Space Copy ISRU, Project New Dawn, DSTA CubeSat) lives in `utils/data/experience.js` and `utils/data/educations.js` — don't move it, don't merge it into the project cards, don't backfill project content from it.

## Where to read what
- `docs/START-HERE.md` — the one screen for adding content/assets; start here.
- `docs/CONTENT-TEMPLATE.md` — per-project content fields + full asset export spec (dimensions, format, size caps, paths).
- `docs/WHERE-THINGS-LIVE.md` — file paths by task.
- `docs/DESIGN-SYSTEM.md` — tokens, the accent rule, why plain CSS not SCSS.
- `docs/DECISIONS.md` — open questions; don't re-decide something already closed here.
- `docs/DEPLOY.md` — env vars, host setup.

## Conventions
- **Color:** only `--color-*` tokens from `app/css/theme.css`. `--color-accent`/`signal-*` is reserved for (1) quantified data + identifying labels and (2) interactive affordances — never decorative gradients, glows, or bulk fills. Need a new value → add it to `theme.css` + document in `DESIGN-SYSTEM.md`, don't reach for an arbitrary bracketed value.
- **Assets:** exact dimensions/format/size caps per category are in `docs/CONTENT-TEMPLATE.md` Part 2 — don't eyeball them. Real assets are opted in per-entry via `placeholder: false`; a malformed real entry must degrade to the placeholder box, never crash the route (see `asset-placeholder.jsx`'s `isFiniteNumber` guard — match that pattern for any new asset type).
- **Video:** click-to-play only. Never autoplay, never loop.
- Run `npm run check` after any content/asset edit, `npx next build` before calling anything done.

## Do not
- Hardcode a hex/rgb value or arbitrary Tailwind bracket value — use a token.
- Reintroduce `tailwind.config.js` or a Sass-first token setup.
- Ship a reveal/animation that's `opacity-0` (or otherwise hidden) by default without a synchronous, fail-open reveal — this has caused a blank page before.
- Invent a credential, metric, employer, or result for Sujith. `docs/CONTENT-AUDIT.md` or nothing.
- Commit the resume PDF or any file matching `*Resume*` — it contains PII and is gitignored on purpose.
- Autoplay or loop video.
- Push to remote unless explicitly told to.
