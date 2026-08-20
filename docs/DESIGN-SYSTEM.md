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

Computed via the WCAG relative-luminance formula (not eyeballed), for every token pairing actually used in a component. Re-run from scratch on this pass (a standalone script against the live hex values in `theme.css`, not copied forward) since color and type are easy to let drift apart — colors themselves are untouched by the Stage-3-revisit font swap, so no ratio was expected to move, and none did:

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
| `ink-950` text on `signal-500` (primary button label) | 13.86 | 4.5 | PASS |
| `danger-400` on `ink-900` / `ink-700` | 6.72 / 6.04 | 4.5 | PASS |
| `ink-500` functional border on `ink-900` / `ink-800` (non-text) | 3.22 / 3.12 | 3.0 | PASS |
| `signal-500` focus ring on `ink-900` (non-text) | 12.74 | 3.0 | PASS |

Every pairing actually in use clears WCAG AA. `ink-600` (the *decorative*-divider tier) does not hit 3:1 against canvas by design — it's intentionally subtle and never used for a functional boundary a user needs to perceive to operate the UI (that's what `ink-500`/`border-strong` is for).

One correction from this pass: `ink-950` text on `signal-500` was previously recorded as 12.74, which is actually the `signal-500`-on-`ink-900` figure directly above it, transcribed into the wrong row. The real computed ratio for that pair is 13.86 — still a comfortable PASS, nothing was ever at risk, but recording it accurately now that it's been independently recomputed rather than carried forward.

---

## Typography: display/slab + monospace + sans

Three roles, one face each — chosen so nothing is ad hoc per component.

| Role | Face | Utility | Loaded weights | License |
|---|---|---|---|---|
| Body copy | **IBM Plex Sans** | `font-sans` (default) | Variable, wght 100-700 | SIL OFL 1.1 |
| Display / headings | Roboto Slab | `font-display` | Variable, wght 100-900 | Apache License 2.0 |
| Technical / data | IBM Plex Mono | `font-mono` | 400, 500 (static) | SIL OFL 1.1 |

All three are loaded via `next/font/google` in `app/layout.js` and referenced in `theme.css` as `--font-sans`/`--font-display`/`--font-mono` — fully self-hosted (verified: production build outputs real `.woff2` files under `.next/static/media/`, zero requests to `fonts.googleapis.com`/`fonts.gstatic.com` from the rendered page — re-confirmed on this pass, see "Body face" below).

### Body face: Inter → IBM Plex Sans

Inter, Geist, and Space Grotesk are out — all three now read as the reflexive default of AI-assisted design tooling specifically, which undercuts the "engineered, not templated" direction this system is built around. Inter was the body face inherited from the original template at Stage 3 and never actually re-argued; this pass replaces it and re-argues the choice from scratch rather than reaching for the nearest alternative.

**The pick: IBM Plex Sans.** Argued against the actual requirements, not assumed:

- **Genuinely open-licensed & self-hostable:** SIL OFL 1.1, loaded via `next/font/google`, same licensing tier Inter already cleared. Verified self-hosted exactly the same way the other two faces are (below).
- **Real range at small sizes for dense technical copy:** this is IBM's own stated design brief for the whole Plex superfamily — built for corporate/technical documentation UI, not a display face pressed into body duty. This doc already made that exact argument for Plex Mono below; Plex Sans is the same team solving the same problem for running text. Distinguishable `1`/`l`/`I` and `0`/`O`, consistent x-height, holds up at the `text-xs`/`text-sm` sizes this site actually uses for captions, tags, and dense card copy.
- **Doesn't read as a default:** not part of the Inter/Geist/Space Grotesk cluster, and not in the runner-up tier either (Roboto, Poppins, Montserrat, Manrope, DM Sans). IBM Plex has its own recognizable identity — most visible in the flat-cut terminals on `k`/`K`/`R`/`t`.
- **Pairs with what stays, structurally not just aesthetically:** IBM Plex Sans and IBM Plex Mono are literal siblings in the same superfamily — same x-height, same stroke contrast, same construction logic, drawn together. Body and technical/data faces sharing real DNA is a stronger pairing argument than two unrelated faces that merely don't clash. Against Roboto Slab: both Plex Sans and Roboto Slab are purpose-built for technical/structural reading rather than editorial prose, so the three-face system now argues the same "engineered documentation" premise end to end — before, only Plex Mono and Roboto Slab carried that argument; Inter was along for the ride.

**Roboto Slab and IBM Plex Mono — checked against the same list, both clear.** Neither is Inter, Geist, or Space Grotesk, and neither is in the wider "generic AI-tool default" tier those three anchor (Roboto/Poppins/Montserrat/DM Sans/Manrope for sans, JetBrains Mono/Fira Code for the mono-as-default pattern). Both already had a specific, non-arbitrary rationale in this doc before this pass (slab-for-"engineered" vs. literary serif; Plex Mono's IBM-documentation brief) rather than being picked as "a monospace" or "a serif." No replacement needed for either.

**A real bug found and fixed while wiring this up:** the initial swap requested IBM Plex Sans and Roboto Slab as arrays of discrete static weights (`["400","500","600","700"]` etc.) — the same pattern IBM Plex Mono already used correctly. But both families are also published on Google Fonts as true variable fonts (`wght` axis), and requesting discrete static weights from a variable-capable family hit a real `next/font`+Turbopack bug: every requested weight's `@font-face` rule was silently pointed at the *same physical file* (verified by inspecting the compiled `.next/static/chunks/*.css` — 4 distinct `font-weight` declarations for Plex Sans, 1 underlying file; confirmed on the actual bytes via `fontTools`, whose `OS/2.usWeightClass`/postscript name reported `IBMPlexSans-Regular` for all four). `font-medium`/`font-semibold`/`font-bold` would have rendered as plain Regular everywhere on the site. IBM Plex Mono has no variable axis at all, which is exactly why it alone came out correct on the first attempt. Fixed by requesting `weight: "variable"` on both families instead — verified via `fontTools` that the delivered `.woff2` files now carry a real `fvar` table (Plex Sans: `wght` 100-700; Roboto Slab: `wght` 100-900), so `font-weight` now interpolates for real. This also incidentally fixed a second, older bug: the hero `<h1>`'s `md:font-extrabold` (800) on Roboto Slab had no matching weight loaded at all pre-Stage-3-revisit (only 700 was ever requested) — variable coverage now includes it.

**Where each is applied:** `font-display` → nav logo, hero name/headline, section eyebrow pill labels ("ABOUT ME", "Skills", "Educations", "PROJECTS", "CONTACT", "Contact with me", 404 heading), project card titles. `font-mono` → nav links, dates/durations, status badges, skill tags, blog post metadata (date/read-time), and the existing fake-terminal code blocks. Everything else — body prose, bullet lists, form labels, tool-tag pills — stays the default `font-sans`, now IBM Plex Sans.

**One new type-scale token:** `--text-display: 2.75rem` (with a paired `1.15` line-height) formalizes what was previously a one-off arbitrary `text-[2.6rem]` on the hero `<h1>` — Tailwind's default scale jumps from `text-4xl` (2.25rem) to `text-5xl` (3rem) with nothing at the size the hero actually needed, so this is a genuine, documented gap-fill rather than an arbitrary value smuggled back in.

### Line-length re-verification (computed, not eyeballed)

Character width isn't assumed — pulled from the actual shipped `.woff2` files' `hmtx` tables via `fontTools`, weighted by standard English letter frequency (including a ~17.5% space fraction), then converted to CSS px at the sizes actually used. Checked against the site's widest body-copy container, `max-w-3xl` (768px, used by project descriptions and the contact-form card):

| Face | Size | Avg char width | Chars/line @ 768px |
|---|---|---|---|
| IBM Plex Sans (new) | 16px (`text-base`) | 7.17px | ~107 |
| IBM Plex Sans (new) | 14px (`text-sm`) | 6.28px | ~122 |
| Inter (old, for comparison) | 16px | 7.60px | ~101 |
| Inter (old, for comparison) | 14px | 6.65px | ~115 |

Both faces run past the ~45-90 char "ideal reading line" guideline at the full 768px container width — this is a **pre-existing container-width condition, not something the font swap introduced**: IBM Plex Sans is marginally narrower than Inter at the same size (~6% more characters per line), a small regression in the wrong direction, not the cause. Not fixing it here — it's a layout/container decision out of scope for a font swap, and this site's paragraphs are a few sentences of description copy, not long-form article prose, so the practical reading-fatigue cost is low. Worth a `max-w-2xl` pass if this ever becomes an actual reading surface.

On mobile, this isn't a concern at all: viewport-constrained containers (~340-380px effective width after page padding) at `text-sm` (14px, the mobile default before the `lg:text-base` bump) come out to roughly 54-60 characters/line — inside the ideal range without any change needed.

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
