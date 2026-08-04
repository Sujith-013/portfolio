# Design System — Direction A ("Flight Documentation")

Established in Stage 3 of `docs/BUILD-PLAN.md`. This is the single source of truth for color, type, and spacing — every later stage (4-9) builds against these tokens, not new arbitrary values. If a value you need doesn't exist here, add it to `app/css/theme.css` and document it here; don't reach for a bracketed arbitrary value.

## Mode: dark-only

There is no light mode and none is planned. The old `@media (prefers-color-scheme: dark)` toggle in `globals.scss` (a leftover from the original template's default scaffold) has been removed — it only ever changed one CSS variable that nothing consistently used anyway. If light mode is ever wanted, it's new work, not a flag to flip.

## Where the tokens live

`app/css/theme.css` — a plain `.css` file (deliberately not `.scss`) containing `@import "tailwindcss"` and the `@theme` block. Tailwind v4's `@theme` at-rule needs to be evaluated by `@tailwindcss/postcss` directly; routing it through Sass first was tested and avoided (see "Why plain CSS, not SCSS" below). `app/layout.js` imports `theme.css` first, then `globals.scss` (base body rules), then `card.scss` (glow-card effect) — that order matters for cascade.

`tailwind.config.js` no longer exists. Everything it held was either dead (`container` customization, `bg-gradient-radial`/`bg-gradient-conic`, a broken/unused `4k` breakpoint — none were referenced anywhere in the codebase) or redundant under Tailwind v4's automatic content detection. Tailwind v4 doesn't require a JS config file at all when there's nothing JS-only to configure.

### Why plain CSS, not SCSS

Tested empirically rather than assumed: Sass compiles `.scss` to plain CSS *before* PostCSS/Tailwind ever sees it, and Tailwind v4 relies on native CSS features (cascade layers, its own at-rules) that Sass predates. Keeping `@theme` in a plain `.css` file sidesteps any ambiguity. `globals.scss` and `card.scss` are kept as Sass only because nothing in them needs to interact with `@theme` at the Tailwind-processing layer — `card.scss` references the compiled tokens via plain `var(--color-*)`, which works because Tailwind's `@theme` block generates real global CSS custom properties, readable from any stylesheet in the cascade.

### Content scanning: `@source`

Deleting `tailwind.config.js` also removed its `content: [...]` allowlist, which had scoped scanning to `app/`, `components/`, `pages/`. Without it, Tailwind v4's default heuristic scans the *whole repo* (respecting `.gitignore`) — which swept up example Tailwind class names from `.claude/skills/*/references/*.md` (e.g. `from-pink-500` used in a shadcn theming example) and generated real, unused CSS for them. Fixed with the CSS-first equivalent:

```css
@import "tailwindcss" source(none);
@source "../";
```

`source(none)` disables the whole-repo heuristic; the explicit `@source "../"` (relative to `app/css/theme.css`, i.e. `app/`) is the only place Tailwind scans for class usage now. If you add source files outside `app/` that use Tailwind classes, add another `@source` line for that path.

---

## Color: three-layer token system

**Primitive → Semantic** (no separate component layer — the codebase is small enough that a third layer would be ceremony, not structure; per `docs/PRD.md` §11's own non-goal against over-engineering for reuse that won't happen).

### THE ACCENT RULE

> `--color-accent` (and its `signal-*` primitives) is reserved for exactly two jobs:
> 1. **Quantified/proof-point data and identifying labels** — dates, durations, project titles, section eyebrow labels.
> 2. **Interactive affordances** — links, hover/focus/active states, the primary call-to-action.
>
> It is never used for decorative gradients, ambient glows, large fills, or bulk emphasis. If what you're coloring is neither data nor interactive, reach for an `ink-*` token instead.

This is stated as a comment directly above the `@theme` block in `theme.css` too, so it survives even if this doc drifts. Before Stage 3, the same hex (`#16f2b3`) already lived almost entirely inside these two categories (dates, project titles, eyebrow labels, hover states) — the fix wasn't relocating the accent, it was removing the four *other* colors (pink, violet, amber, cyan, orange) that were competing with it everywhere else, so the one accent that was already disciplined could actually read as singular.

### Primitives

**`ink-*`** — neutral scale, hue ~227° ("night sky"), dark-only. Anchored on the site's original canvas color (`#0d1224` = `ink-900`), formalized into a full scale rather than the ~15 near-duplicate navy/violet hex values scattered through the old components.

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#05060d` | Deepest shadow / glow-card underlay |
| `ink-900` | `#0d1224` | Canvas (page background) — unchanged from the original |
| `ink-800` | `#10152c` | Surface: cards, nav |
| `ink-700` | `#161c38` | Raised surface: form fields, code-block panels |
| `ink-600` | `#262e52` | Decorative border / divider (not a functional boundary) |
| `ink-500` | `#5b6390` | Functional border: inputs, focus rings, interactive outlines |
| `ink-400` | `#7c84a8` | Muted / tertiary text |
| `ink-300` | `#a6acc7` | Secondary text: dates, durations, captions |
| `ink-100` | `#e7e9f2` | Primary body text |
| `ink-50` | `#f8f9fc` | Headings, max-emphasis text |

**`signal-*`** — the one reserved accent, hue unchanged from the original site.

| Token | Hex | Role |
|---|---|---|
| `signal-600` | `#0fcf97` | Pressed / active state |
| `signal-500` | `#16f2b3` | Default accent |
| `signal-400` | `#5cf5c8` | Hover state |

**`danger-400`** — `#f87171`. Form-validation error text only. This is a necessary functional UI state (most design systems carve out red for errors even in strict monochrome+accent systems), not a second accent — it never appears outside `<ContactForm>`'s validation messages.

### Semantic aliases

Components should reach for these first; they exist so intent reads at the call site instead of a raw scale step.

```
--color-canvas          → ink-900   page background
--color-surface         → ink-800   card/nav background
--color-surface-raised  → ink-700   form fields, code-block panels
--color-border          → ink-600   decorative dividers
--color-border-strong   → ink-500   functional borders (inputs, focus, interactive outlines)
--color-text-primary    → ink-50    headings, max emphasis
--color-text-secondary  → ink-100   body copy
--color-text-tertiary   → ink-300   captions, code punctuation
--color-text-muted      → ink-400   least-prominent text
--color-accent          → signal-500
--color-accent-hover    → signal-400
--color-accent-active   → signal-600
--color-danger          → danger-400
```

### Deliberate recolors (not just token substitution)

A handful of things were genuinely multi-hue before and are now monochrome+accent by design, not by accident:

- **Hero and project-card fake terminal blocks** — previously 6 hues (pink/white/gray/amber/orange/cyan) doing ad-hoc syntax highlighting with no real meaning. Now strictly `ink-50` (keys) / `ink-100` (values) / `ink-300` (punctuation) — zero accent inside these blocks. The content in them is decorative code-block flavor, not the site's actual proof-point data, so it doesn't earn accent treatment. (Stage 5.1 may introduce a real proof-point moment in the hero; that's a content/layout decision, not this stage's to make.)
- **"Traffic light" window-chrome dots** (hero + project-card) — were literal red/orange/green; now a graduated neutral (`ink-500`/`ink-400`/`ink-300`). Three saturated hues for a decorative flourish directly violated the accent rule.
- **Ambient background blur blobs** (skills, blog, projects sections) — were `violet-100`; now `ink-500` at the same low opacity. Purely decorative depth, no data/interactive role, so no hue.
- **Section divider rules** (the thin gradient lines above cards/sections) — were pink-to-violet or violet-only; now `border-strong` (neutral). These appear on nearly every card; making them accent-colored would have been the single biggest source of "accent overuse" on the page.
- **Glow-card hover effect** (`card.scss`) — was a 4-stop pink/purple/blue/near-white conic gradient; now cycles the three `signal-*` tones plus one `ink-50` highlight point. Same mouse-tracked mechanic (untouched — that's existing interaction code, not new motion), recolored to the one accent instead of an unrelated rainbow.
- **Primary buttons** ("Get Resume", "Send Message", scroll-to-top, 404's "Go to Home") — were a pink-to-violet gradient fill; now solid `bg-accent` with `text-ink-950` (verified 12.7:1 contrast). This is the accent's most legitimate use: the page's actual primary interactive affordances.
- **Secondary buttons** ("Contact me", "View More") — outlined in `border-strong`, text goes `accent` only on hover. Kept visually distinct from the primary buttons rather than both screaming accent.
- **Contact icon circles** — were a light gray (`#8b98a5`) circle with a dark glyph, an intentional light-button-on-dark-page inversion. Preserved as `bg-ink-300` / `text-ink-900`, with `hover:bg-accent` (interactive state).

### Out of scope, deliberately

- `app/api/contact/route.js`'s HTML email template still uses raw hex. Email clients don't reliably support CSS custom properties, so inline hex is the *correct* practice there, not a violation — it was excluded from migration on purpose.
- `card.scss`'s `#000`/`#0000`/`#fff`/`#ffffff26` are CSS mask/alpha compositing values (white = opaque, transparent = hidden, by mask convention), not brand hues. Left as-is.

### Contrast verification

Computed via the WCAG relative-luminance formula (not eyeballed), for every token pairing actually used in a component:

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| `ink-50` text on `ink-900` canvas | 17.67 | 4.5 (text) | PASS |
| `ink-100` text on `ink-900` canvas | 15.35 | 4.5 | PASS |
| `ink-300` text on `ink-900` canvas | 8.28 | 4.5 | PASS |
| `ink-400` text on `ink-900` canvas | 5.07 | 4.5 | PASS |
| `ink-100`/`ink-300`/`ink-400` on `ink-800` surface | 14.87 / 8.02 / 4.91 | 4.5 | PASS |
| `ink-100`/`ink-300` on `ink-700` raised (form text) | 13.79 / 7.43 | 4.5 | PASS |
| `signal-500` accent on `ink-900` / `ink-800` | 12.74 / 12.34 | 4.5 | PASS |
| `signal-400` accent-hover on `ink-900` | 13.59 | 4.5 | PASS |
| `ink-950` text on `signal-500` (primary button label) | 12.74 | 4.5 | PASS |
| `danger-400` on `ink-900` / `ink-700` | 6.72 / 6.04 | 4.5 | PASS |
| `ink-500` functional border on `ink-900` / `ink-800` (non-text) | 3.22 / 3.12 | 3.0 | PASS |
| `signal-500` focus ring on `ink-900` (non-text) | 12.74 | 3.0 | PASS |

Every pairing actually in use clears WCAG AA. `ink-600` (the *decorative*-divider tier) does not hit 3:1 against canvas by design — it's intentionally subtle and never used for a functional boundary a user needs to perceive to operate the UI (that's what `ink-500`/`border-strong` is for).

---

## Typography: display/slab + monospace + sans

Three roles, one face each — chosen so nothing is ad hoc per component.

| Role | Face | Utility | Loaded weights | License |
|---|---|---|---|---|
| Body copy | Inter | `font-sans` (default) | Variable (unchanged from original) | SIL OFL 1.1 |
| Display / headings | Roboto Slab | `font-display` | 700 only | Apache License 2.0 |
| Technical / data | IBM Plex Mono | `font-mono` | 400, 500 | SIL OFL 1.1 |

All three are loaded via `next/font/google` with the `variable` option in `app/layout.js` and referenced in `theme.css` as `--font-sans`/`--font-display`/`--font-mono` — fully self-hosted (verified: production build outputs real `.woff2` files under `.next/static/media/`, zero requests to `fonts.googleapis.com`/`fonts.gstatic.com` from the rendered page).

**Why Roboto Slab, not a literary serif or a second sans:** Direction A calls for a slab or serif display face specifically because the subject's actual work product (FLATSAT logs, FEA reports, systems-engineering trade studies) is technical documentation, not consumer software — a slab serif's visible structural weight reads as "engineered," where a transitional/literary serif (e.g. a Fraunces-style face) would read as editorial. Roboto Slab is Google's own type team's slab, wide weight range, Apache-2.0 licensed, and well-established (not a novelty pick).

**Why IBM Plex Mono:** IBM designed the whole Plex superfamily specifically for corporate/technical documentation — it's not a generic code-editor font pressed into service, it's built for exactly this brief. Also excellent at small sizes, which matters since it's used for dates/tags/spec labels, not just the fake-terminal blocks.

**Where each is applied:** `font-display` → nav logo, hero name/headline, section eyebrow pill labels ("ABOUT ME", "Skills", "Educations", "PROJECTS", "CONTACT", "Contact with me", 404 heading), project card titles. `font-mono` → nav links, dates/durations, status badges, skill tags, blog post metadata (date/read-time), and the existing fake-terminal code blocks (this was already `font-mono` before Stage 3 — it just fell back to a generic system monospace stack; it now resolves to IBM Plex Mono for real). Everything else — body prose, bullet lists, form labels — stays the default `font-sans` (Inter).

**One new type-scale token:** `--text-display: 2.75rem` (with a paired `1.15` line-height) formalizes what was previously a one-off arbitrary `text-[2.6rem]` on the hero `<h1>` — Tailwind's default scale jumps from `text-4xl` (2.25rem) to `text-5xl` (3rem) with nothing at the size the hero actually needed, so this is a genuine, documented gap-fill rather than an arbitrary value smuggled back in.

---

## Spacing rhythm

Base unit: `--spacing: 0.25rem` (Tailwind's 4px default), declared explicitly in `theme.css` rather than left implicit.

The site's section rhythm was already consistent before Stage 3 and is expressed directly as Tailwind utilities against that base — not aliased into named CSS custom properties, since doing so would just be a redundant wrapper around numbers Tailwind already names clearly:

- **Section vertical spacing:** `my-12 lg:my-24` (48px → 96px) on every top-level homepage section. Two sections (About, Contact) were inconsistently using a smaller `my-12 lg:my-16` (48px → 64px) with no deliberate reason — fixed to match the other five during this stage, per the exit checkpoint's "no section noticeably tighter or looser than its neighbors without a deliberate reason."
- **Two-column grid gaps:** `gap-8 lg:gap-16` (32px → 64px), consistent across About/Experience/Education.
- **Card internal padding:** `p-3` small cards, `px-4 lg:px-8 py-4 lg:py-8` for code-block panels.

No arbitrary bracketed spacing values (`p-[...]`, `gap-[...]`, etc.) exist anywhere in the codebase — confirmed by grep before this stage started, so there was no chaos to fix, only one inconsistency to align.

---

## What's still deferred (later stages, not this one)

- **Marquee → static grouped grid for Skills** (Stage 5.4) — the data is grouped by category now (`utils/data/skills.js`), but the component still flattens it into the existing `react-fast-marquee` scroll for visual continuity. The PRD explicitly flags the infinite marquee as working against "restrained"; replacing it is a layout change, out of scope for a tokens-only stage.
- **A real proof-point moment in the hero** (Stage 5.1) — content/copy work, not a token question.
- ~~Icon coverage for the skills grid~~ — **resolved 2026-08-06.** `utils/skill-image.js` now covers 14 of 25 skills with real brand icons (10 local SVGs + `react-icons/si`'s `SiAnsys`/`SiArduino`/`SiRaspberrypi`/`SiNvidia`, checked individually for an unambiguous brand match — two lookalikes, `SiYolo` and `SiGoogle`, were deliberately rejected as wrong/misrepresentative matches). The remaining 11 (YOLOv8, ROS 2, Gazebo, Isaac Sim, MuJoCo, LiDAR/Depth, TensorRT, SolidWorks, Fusion 360, Simulink, Google Workspace) get a uniform `font-mono` monogram tile — same neutral `ink-*` tokens as everything else, no accent, applied identically rather than a one-off per skill.
