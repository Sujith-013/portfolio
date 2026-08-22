# Design System — Direction A ("Flight Documentation")

Established in Stage 3 of `docs/BUILD-PLAN.md`. This is the single source of truth for color, type, and spacing — every later stage (4-9) builds against these tokens, not new arbitrary values. If a value you need doesn't exist here, add it to `app/css/theme.css` and document it here; don't reach for a bracketed arbitrary value.

## Mode: dark-only

There is no light mode and none is planned. The old `@media (prefers-color-scheme: dark)` toggle in `globals.scss` (a leftover from the original template's default scaffold) has been removed — it only ever changed one CSS variable that nothing consistently used anyway. If light mode is ever wanted, it's new work, not a flag to flip.

## Where the tokens live

`app/css/theme.css` — a plain `.css` file (deliberately not `.scss`) containing `@import "tailwindcss"` and the `@theme` block. Tailwind v4's `@theme` at-rule needs to be evaluated by `@tailwindcss/postcss` directly; routing it through Sass first was tested and avoided (see "Why plain CSS, not SCSS" below). `app/layout.js` imports `theme.css` first, then `globals.scss` (base body rules) — that order matters for cascade. (A third import, `card.scss`, existed here through the color-audit pass below; it held the glow-card hover effect and was deleted once that effect was replaced with a plain Tailwind hover state — see "Audit: gradients, glow, blur, decorative stripes".)

`tailwind.config.js` no longer exists. Everything it held was either dead (`container` customization, `bg-gradient-radial`/`bg-gradient-conic`, a broken/unused `4k` breakpoint — none were referenced anywhere in the codebase) or redundant under Tailwind v4's automatic content detection. Tailwind v4 doesn't require a JS config file at all when there's nothing JS-only to configure.

### Why plain CSS, not SCSS

Tested empirically rather than assumed: Sass compiles `.scss` to plain CSS *before* PostCSS/Tailwind ever sees it, and Tailwind v4 relies on native CSS features (cascade layers, its own at-rules) that Sass predates. Keeping `@theme` in a plain `.css` file sidesteps any ambiguity. `globals.scss` is kept as Sass only because nothing in it needs to interact with `@theme` at the Tailwind-processing layer — it references the compiled tokens via plain `var(--color-*)`, which works because Tailwind's `@theme` block generates real global CSS custom properties, readable from any stylesheet in the cascade. (`card.scss` used to be the other file here, on the same basis — it's gone now; see "Audit: gradients, glow, blur, decorative stripes" below.)

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

> `--color-accent` (and its `signal-*` primitives) **is** reserved for exactly two jobs, and nothing else:
> 1. **Quantified/proof-point data and identifying labels** — dates, durations, project titles, section eyebrow labels.
> 2. **Interactive affordances** — links, hover/focus/active states, the primary call-to-action.
>
> It **is not**: a decorative gradient stop, an ambient glow or blur, a large fill, bulk emphasis, a divider/stripe, or a stand-in "brand color" applied because something looks unfinished without a splash of hue. If what you're coloring is neither data nor interactive, reach for an `ink-*` token instead — a page that needs more visual interest earns it from type, spacing, and border weight, not from a second reason to reach for the accent.

This is stated as a comment directly above the `@theme` block in `theme.css` too, so it survives even if this doc drifts. Before Stage 3, the same hex (`#16f2b3`) already lived almost entirely inside these two categories (dates, project titles, eyebrow labels, hover states) — the Stage-3 fix wasn't relocating the accent, it was removing the four *other* colors (pink, violet, amber, cyan, orange) that were competing with it everywhere else, so the one accent that was already disciplined could actually read as singular. This pass (below) keeps the same *role* discipline and instead re-examines the *hue* itself, plus a second, previously-missed source of stray color and glow living in raw SVG assets — see "The accent: neon mint → considered amber" and "Audit: gradients, glow, blur, decorative stripes".

### Primitives

**`ink-*`** — neutral scale, hue ~227° ("night sky"), dark-only. Anchored on the site's original canvas color (`#0d1224` = `ink-900`), formalized into a full scale rather than the ~15 near-duplicate navy/violet hex values scattered through the old components.

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#05060d` | Deepest shadow tone; also the label-text color on `bg-accent`/`bg-accent-hover` buttons |
| `ink-900` | `#0d1224` | Canvas (page background) — unchanged from the original |
| `ink-800` | `#10152c` | Surface: cards, nav |
| `ink-700` | `#161c38` | Raised surface: form fields, code-block panels |
| `ink-600` | `#262e52` | Decorative border / divider (not a functional boundary) |
| `ink-500` | `#5b6390` | Functional border: inputs, focus rings, interactive outlines |
| `ink-400` | `#7c84a8` | Muted / tertiary text |
| `ink-300` | `#a6acc7` | Secondary text: dates, durations, captions |
| `ink-100` | `#e7e9f2` | Primary body text |
| `ink-50` | `#f8f9fc` | Headings, max-emphasis text |

**`signal-*`** — the one reserved accent. Hue changed this pass, from `#16f2b3` (neon mint) to a muted brass/amber (hue ~42°) — see "The accent: neon mint → considered amber" below for the full argument.

| Token | Hex | Role |
|---|---|---|
| `signal-600` | `#846621` | Pressed / active state |
| `signal-500` | `#a27d28` | Default accent |
| `signal-400` | `#be932f` | Hover state |

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

### The accent: neon mint → considered amber

**Honest assessment first.** `#16f2b3` on `#0d1224` — a saturated, high-luminance mint green (relative luminance 0.669, near the top of the whole scale) sitting on a near-black canvas — is exactly the neon-accent-on-near-black combination that reads as generated-template design. Being disciplined about *where* the accent was used (the two roles under THE ACCENT RULE, unchanged since Stage 3) never fixed *what* the hue itself signaled: that particular saturated-green-on-black pairing is common enough in AI-tool default output that it's recognizable on sight, independent of how restrained its usage is. Confining a neon color to a small role doesn't stop it from being neon.

**The replacement: a muted brass/amber, hue ~42°.** Argued against the actual constraint, not swapped for the next available bright color:

- **Considered, not glowing.** The old accent's luminance (0.669) was roughly 3× higher than what any of its actual contrast requirements needed — it was over-satisfying WCAG AA by a wide margin, which is a large part of why it read as glowing rather than chosen. The new `signal-500` (`#a27d28`, L=0.225) is tuned to land just above the required thresholds (4.72–4.87:1 against canvas/surface, see the recomputed table below) rather than far past them. Same underlying method used for the two hover/pressed tones (`signal-400`/`signal-600`): each picked by solving for the minimum relative luminance its actual use requires, not by eyeballing a brighter or darker version of the same hue.
- **Complementary to the ink scale, not adjacent to it.** The `ink-*` primitives sit at hue ~227° ("night sky," per the primitives table above). A hue at ~42° is close to directly complementary — that's what makes it read as a deliberate figure against the neutral scale rather than a marginally-brighter shade of the background, which is the actual job of an accent in a near-monochrome system.
- **Clear of the flagged list on its own terms.** Not neon (moderate 60% saturation, not the near-100% saturation that reads "glowing"), not part of a purple-and-black pairing (nowhere near violet), not one stop in a rainbow (still exactly one hue, same as before), not a pastel (luminance/saturation profile of a considered mid-tone, not a washed-out tint), and it's a flat token-driven fill everywhere — never a gradient (see the audit below).
- **Distinct from `danger-400`.** The error-state red (`#f87171`, hue ~0°) and the new accent (hue ~42°) sit ~42° apart on the wheel — enough separation that the two don't read as variations of the same warning color, which matters more now that both are warm hues (the old mint, at ~160°, had no such adjacency risk purely by being on the opposite side of the wheel; distinctness had to be re-checked deliberately here rather than assumed for free).
- **Pairs with what's already established.** This system's premise is "engineered documentation" (aircraft/flight theme, Roboto Slab + IBM Plex Mono — see Typography below). A muted brass/amber reads as instrument-panel or nameplate amber — a considered, referential color choice for that premise — rather than an interface-tool default.

The three-tone ramp (`signal-600`/`500`/`400`) keeps the exact same role structure as before (pressed/default/hover) — only the hue and the luminance targets changed. `--color-accent`/`--color-accent-hover`/`--color-accent-active` still point at the same primitives; no component had to change which token it reaches for, only what that token now resolves to.

### Deliberate recolors (not just token substitution)

A handful of things were genuinely multi-hue before and are now monochrome+accent by design, not by accident:

- **Hero and project-card fake terminal blocks** — previously 6 hues (pink/white/gray/amber/orange/cyan) doing ad-hoc syntax highlighting with no real meaning, recolored at Stage 3 to strictly `ink-50`/`ink-100`/`ink-300` with zero accent inside. **The hero instance is removed entirely this pass** (the project-card instance was already gone before this pass — replaced by `project-showcase.jsx`, a real image + real description, per that component's own comment). A recolored fake terminal is still a fake terminal — see "Audit: AI-template visual clichés" below.
- **"Traffic light" window-chrome dots** (hero) — were literal red/orange/green, recolored at Stage 3 to a graduated neutral (`ink-500`/`ink-400`/`ink-300`). **Removed entirely this pass** along with the terminal block they decorated — see the audit below.
- **Ambient background blur blobs** (skills, projects sections — Tailwind `bg-ink-500 blur-3xl` divs) — were `violet-100` before Stage 3, recolored to `ink-500` at low opacity at the time. **Removed entirely this pass**, not just recolored — see "Audit: gradients, glow, blur, decorative stripes" below; a neutral-hued blur is still a blur, and the current instruction set flags ambient blur/glow regardless of hue.
- **Section divider rules** (the thin gradient hairlines above cards/section headers) — were pink-to-violet or violet-only before Stage 3, recolored to `border-strong` (neutral) at the time. **Removed entirely this pass** — every instance sat directly on top of a section or panel that already had its own solid `border-t`/`border`, so the gradient hairline was a redundant "highlight over an existing border," not a distinct piece of information. See the audit below.
- **Glow-card hover effect** (`card.scss` + `glow-card.jsx`) — was a 4-stop pink/purple/blue/near-white conic gradient before Stage 3, recolored to cycle the three `signal-*` tones at the time. **Replaced entirely this pass**: a mouse-tracked, blurred, gradient hover glow is itself a template-glassmorphism pattern independent of which hue drives it. `card.scss` is deleted; `glow-card.jsx` is replaced by `app/components/helper/card.jsx`, a flat `border-border → hover:border-accent` transition with no JS, no blur, no gradient. See the audit below.
- **Primary buttons** ("Get Resume", "Send Message", scroll-to-top, 404's "Go to Home") — were a pink-to-violet gradient fill before Stage 3; already solid `bg-accent` with `text-ink-950` since then. Recomputed this pass for the new hue: 5.30:1 (was 12.74:1 under the old neon mint — still a comfortable PASS, just no longer wildly over-satisfying the 4.5:1 requirement, consistent with "considered, not glowing" above). This is the accent's most legitimate use: the page's actual primary interactive affordances.
- **Secondary buttons** ("Contact me", "View More") — outlined in `border-strong`, text goes `accent` only on hover. Kept visually distinct from the primary buttons rather than both screaming accent.
- **Contact icon circles** — were a light gray (`#8b98a5`) circle with a dark glyph, an intentional light-button-on-dark-page inversion. Preserved as `bg-ink-300` / `text-ink-900`, with `hover:bg-accent` (interactive state).

### Audit: gradients, glow, blur, decorative stripes

A full repo grep for `gradient|blur|glow|shadow` this pass, checked against every match rather than assumed clean from the Stage-3 pass (which had recolored some of these, not removed them — recoloring a gradient/blur to a neutral hue still leaves a gradient/blur, and that's now explicitly in scope). Four findings, all fixed (the first two are groups of multiple identical instances, not single occurrences):

1. **Five decorative gradient hairlines** (`bg-gradient-to-r from-transparent via-border-strong to-transparent`) — footer top rule, the hero terminal panel's top rule, two in Skills (per-tile and section-header), one in Education's section-header. Every one of them sat directly on top of a container that already had its own solid `border`/`border-t` — a faded highlight duplicating a border that was already there. **Removed** (not flattened to solid), since the underlying real border already does the job.
2. **Two ambient blur blobs** (`bg-ink-500 rounded-full ... blur-3xl opacity-20/30`) — Skills and Projects sections. Purely decorative depth with no data/interactive role — the exact case THE ACCENT RULE already excludes, and blur/glow-as-decoration is out regardless of which token drives it. **Removed.**
3. **The glow-card mouse-tracked hover effect** (`card.scss`'s conic-gradient + `filter: blur(...)`, driven by `glow-card.jsx`'s pointermove listener) — used on every Experience/Education card. Already recolored to `signal-*` at Stage 3, but a blurred, mouse-tracked conic gradient is a recognizable glassmorphism-template pattern independent of hue. **Replaced**: `card.scss` deleted, `glow-card.jsx` replaced by `app/components/helper/card.jsx` — a plain component (no `"use client"`, no listener) with a flat `hover:border-accent` transition. Same interactive signal (the card visibly responds to hover), none of the mechanism.
4. **Three raw SVG background assets — `public/hero.svg`, `public/section.svg`, `public/blur-23.svg`** — the single biggest finding. These were never touched by the Stage-3 token migration because they're static image files, not Tailwind classes, so a class-level grep for `#16f2b3` never surfaced them. Opened and inspected directly: all three contain Gaussian-blurred (`feGaussianBlur`), radial/linear-gradient-filled ellipse "glow" shapes in raw `#8244FF` (violet), `#F926AE` (magenta/pink), and `#5B21B6` (violet) — literally the purple-and-black-plus-glow combination this task flags, sitting undetected behind the hero, and behind the Experience/Education section headers and every Experience/Education card. (`docs/POLISH-AUDIT.md` and `docs/BUILD-PLAN.md` had previously flagged and fixed these three files' *alt text* — correctly changed to `alt=""` as decorative — without anyone opening the files to look at what they actually rendered.) **Deleted**, and every `<Image>` reference to them removed from `hero-section/index.jsx`, `experience/index.jsx`, and `education/index.jsx` — confirmed via repo-wide grep that no other file referenced any of the three filenames before deleting.

Post-fix, `grep -rniE "gradient|blur-3xl|filter blur|glow" app/` returns nothing outside `theme.css`'s own rule-statement comment and `card.jsx`'s comment explaining what it replaced.

### Out of scope, deliberately

- `app/api/contact/route.js`'s HTML email template still uses raw hex. Email clients don't reliably support CSS custom properties, so inline hex is the *correct* practice there, not a violation — it was excluded from migration on purpose.

### Contrast verification

Computed via the WCAG relative-luminance formula (not eyeballed), for every token pairing actually used in a component. Re-run from scratch this pass (a standalone script against the live hex values in `theme.css`) — the `ink-*`/`danger-*` figures are unchanged from the previous pass (those hexes didn't move), but every `signal-*` row is new since the accent hue changed:

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| `ink-50` text on `ink-900` canvas | 17.67 | 4.5 (text) | PASS |
| `ink-100` text on `ink-900` canvas | 15.35 | 4.5 | PASS |
| `ink-300` text on `ink-900` canvas | 8.28 | 4.5 | PASS |
| `ink-400` text on `ink-900` canvas | 5.07 | 4.5 | PASS |
| `ink-100`/`ink-300`/`ink-400` on `ink-800` surface | 14.87 / 8.02 / 4.91 | 4.5 | PASS |
| `ink-100`/`ink-300` on `ink-700` raised (form text) | 13.79 / 7.43 | 4.5 | PASS |
| `signal-500` accent on `ink-900` canvas / `ink-800` surface | 4.87 / 4.72 | 4.5 | PASS |
| `signal-400` accent-hover text on `ink-900` | 6.56 | 4.5 | PASS |
| `ink-950` text on `signal-500` (primary button label) | 5.30 | 4.5 | PASS |
| `ink-950` text on `signal-400` (primary button label, hover) | 7.13 | 4.5 | PASS |
| `danger-400` on `ink-900` / `ink-700` | 6.72 / 6.04 | 4.5 | PASS |
| `ink-500` functional border on `ink-900` / `ink-800` (non-text) | 3.22 / 3.12 | 3.0 | PASS |
| `signal-500` focus ring on `ink-900` (non-text) | 4.87 | 3.0 | PASS |
| `signal-600` pressed/active on `ink-900` (non-text, currently unwired to any class) | 3.46 | 3.0 | PASS |

Every pairing actually in use clears WCAG AA. `ink-600` (the *decorative*-divider tier) does not hit 3:1 against canvas by design — it's intentionally subtle and never used for a functional boundary a user needs to perceive to operate the UI (that's what `ink-500`/`border-strong` is for).

Note the margins: every `signal-*` row now clears its requirement by roughly 0.2–2.6, not by a factor of 3× like the old neon mint did (12.74:1 against a 4.5:1 requirement). That tighter margin is the direct, intended consequence of "considered, not glowing" above — the new accent was chosen to clear WCAG AA, not to floodlight past it.

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

**Where each is applied:** `font-display` → nav logo, hero name/headline, section eyebrow pill labels ("ABOUT ME", "Skills", "Educations", "PROJECTS", "CONTACT", "Contact with me", 404 heading), project card titles. `font-mono` → nav links, dates/durations, status badges, skill/tool tags, project category labels, and real code snippets (`CodePlaceholder`). Everything else — body prose, bullet lists, form labels — stays the default `font-sans`, now IBM Plex Sans. (The hero's fake-terminal code block, previously also `font-mono`, is gone — see "Audit: AI-template visual clichés" below.)

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

## Audit: AI-template visual clichés

A pass over every route (`/`, all 5 project showcases on the homepage, `/projects/[slug]` for all 5 slugs, `/404`) against the specific list of patterns that read as generated-template design, independent of the color/gradient audit above (that one covered gradients/glow/blur; this one covers layout, shape, and motion clichés). Per item: what it was, where, what replaced it, and why the replacement is structural (borders/rules/alignment/whitespace) rather than decorative.

**Found and fixed:**

1. **Dot grid / background grid pattern behind the hero.** `public/grid.svg` — a literal tessellated grid of hairlines and faint rectangles — and `public/top-bg.svg` — a 567KB base64-embedded raster behind a heavy Gaussian blur filter — both sat unreferenced in `public/`. Neither was actually wired into any component (confirmed by a repo-wide grep for both filenames returning zero hits before deletion), so neither was rendering on the live site at the time of this audit — but both are exactly the pattern being described, left behind from the original template as a landmine that could get wired back in by anyone who found them later thinking they were meant to be used. **Deleted**, not just left dead. (`next.svg`, `vercel.svg`, `card.png` are also unreferenced original-template leftovers in `public/` but aren't grid/glow patterns and don't match any item on this list — left alone as out of scope for this pass.)
2. **Terminal-window framing, "radio orb" dots, and fabricated content, all in one element.** The hero's right-hand panel was a fake code editor: a three-dot macOS-style title bar (`ink-500`/`ink-400`/`ink-300` circles — the "radio orbs," recolored neutral at Stage 3 but never removed) above a `<code>` block rendering a fictional `const coder = { name: 'Sujith', skills: [...], hardWorker: true, quickLearner: true, problemSolver: true, hireable: function() {...} }`. Three problems at once: it's terminal-window chrome with no actual terminal behind it; the three dots are bare decorative circles with no function; and `hardWorker`/`quickLearner`/`problemSolver` are self-praise claims that don't trace to `docs/CONTENT-AUDIT.md` — this doc's own "no fabricated traits" rule, tripped by a template gimmick nobody had re-examined since it shipped. **Removed entirely**, not recolored or reworded. The hero is now a single column — headline, social links, CTAs — full stop. No replacement panel was invented to fill the space: `docs/DESIGN-SYSTEM.md` already flagged (before this pass) that "a real proof-point moment in the hero" is a deliberate content/layout decision for a later stage, not something to improvise while removing a cliché. Whitespace and the existing `max-w-3xl` measure now do the work the fake panel was doing — the hero reads as considered because there's nothing competing with the headline, not because something replaced the terminal one-for-one.
3. **Loose decorative icon repeated beside text, no informational value.** Every Experience and Education card carried a `BsPersonWorkspace` icon — the identical generic "person at a workstation" glyph on all 7 entries regardless of what the entry actually was, contributing zero information and doing nothing but occupying the card's left edge. **Removed.** What replaced it: a `border-t border-border` rule between the duration eyebrow and the title/body block — the same eyebrow-then-rule pattern already used by `/projects/[slug]`'s category headers and by every section's top border elsewhere on the site. A structural rule marking where one part of the card ends and the next begins, instead of a decorative icon that never carried any of that information to begin with.
4. **A "decorative" icon styled as interactive with no actual function.** The contact section's email row was `<MdAlternateEmail className="... hover:bg-accent hover:scale-110 ... cursor-pointer" /> <span>{email}</span>` — a plain, non-interactive `<p>` wrapping an icon dressed up with hover states and a pointer cursor that implied a click would do something. It didn't; there was no `href`, no `onClick`. **Fixed by making it real**, not by stripping the styling: the row is now a genuine `mailto:` link, `<a href="mailto:...">`, with the same hover/focus treatment as the GitHub/LinkedIn links beside it. The icon earns its interactive affordance instead of faking one.
5. **The `hover:gap-3` animated-icon-nudge, applied uniformly to every pill button regardless of which icon it carried.** Six buttons/links (`hero` "Contact me" and "Get Resume", `project-showcase`'s "View full project" with `FaArrowRight`, the contact form's "Send Message", 404's "Go to Home") all had `gap-1 hover:gap-3` — the icon sliding away from its label on hover, the specific "animated arrow" pattern named in this audit, generalized by the codebase to every CTA regardless of whether the icon was actually an arrow. **Removed from all six.** Each button already had a real, token-driven hover state independent of the gap animation (`hover:text-accent`, `hover:border-accent`, or `hover:bg-accent-hover`) — that's what's left, a color/border change on hover, not a moving part. (404's "Go to Home" had `hover:gap-3` with no icon at all to move — it was already inert dead CSS before this pass; removing it is a pure correctness fix, not just a style call.) `project-detail-view.jsx`'s static "Back to portfolio" `FaArrowLeft` is untouched — it never animated, it's a plain, real wayfinding arrow, not a decorative nudge (see "kept" below).
6. **Uniformly soft corner radii on every structural surface, four different values with no logic distinguishing them.** Cards, project/asset images, code and asset placeholders, the contact-form panel, and the profile photo were split across `rounded-lg` (8px) and `rounded-xl` (12px) with no rule for which surface got which — just whatever felt right per component at the time it was written, the exact "soft-cornered-everything" signature this list flags. **Consolidated onto one value, `rounded-md` (6px)**, for every non-pill surface: `app/components/helper/card.jsx`, all four render paths in `asset-placeholder.jsx`, the skill tile and its icon image, the profile photo, and the contact-form panel. `rounded-full` is untouched and stays exactly where it was — CTA pill buttons, the icon circles in the contact section, the status-badge chip, the traffic-light dots (now deleted along with the rest of the terminal block). The result is two radius values doing two distinct, legible jobs — a small consistent radius for rectangular surfaces, full round for genuine circles/pills/chips — instead of four soft steps applied by feel.
7. **Two full-color stock Lottie illustrations, not caught by any of the grep-based passes because they're runtime-fetched JSON animation data, not a Tailwind class or inline SVG.** `public/lottie/code.json` (Experience) rendered a neon violet-and-orange glowing outline of a laptop; `public/lottie/study.json` (Education) rendered a hot-pink-platform isometric desk scene with purple/blue accents — both generic stock illustrations with zero informational content, and both directly reintroducing the rainbow-multi-hue, neon-glow palette the color audit (above) spent two passes removing from every other part of the site. Found by actually looking at rendered screenshots rather than trusting a clean grep. **Removed** — `animation-lottie.jsx`, both JSON files (84KB/475KB), and the `lottie-react` dependency are all deleted; Experience and Education collapse from a 2-column (illustration + cards) layout to a single `max-w-3xl` column of cards, the same treatment the hero got in finding 2. No decorative illustration was swapped in to replace it.

**Checked, not present — no change needed:**

- **Bento grids.** No irregular, mixed-span grid anywhere. The only multi-column grids on the site are Skills' icon grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`, every cell identically sized) and the `/projects/[slug]` asset gallery (`grid-cols-1 sm:grid-cols-2`, every cell identically sized) — see the gallery-specific check below.
- **Three-feature-cards-in-a-row.** No icon+heading+blurb triplet exists anywhere on the site. Skills is a flat grid of many identically-treated tiles (not three cards), and the five projects are full-width stacked sections, not a card row.
- **Drop shadows applied by default.** Zero `shadow-*` Tailwind utilities anywhere in `app/` (confirmed by grep) — every surface's separation from its background comes from a 1px border (`border-border`/`border-border-strong`), not a shadow. This was already true going into this pass; nothing to fix, worth stating because it's easy to assume a card-heavy layout has shadows somewhere without checking.
- **Glassmorphism / frosted / liquid-glass surfaces.** Zero `backdrop-blur`, zero translucent-white/black overlay classes anywhere. Every surface is an opaque `ink-*` token — `bg-surface`/`bg-surface-raised` — with a real border, not a blurred see-through panel.
- **Sparkle icons.** None imported, none rendered — checked the full `react-icons` import list across every component.
- **Radio orbs, beyond the one instance already covered above.** The only bare, unlabeled circular indicators anywhere were the hero's three traffic-light dots (removed with the rest of the terminal block, finding 2). Every other `rounded-full` element either contains a real icon/text (buttons, badges, icon circles) or is a functional focus-outline shape — nothing else is a bare decorative orb.
- **Remaining terminal-window framing, beyond the hero.** The old "project-card" component that also used to carry terminal-style chrome no longer exists — `project-showcase.jsx`'s own comment records that it "replaces the old fake terminal card stack" from an earlier stage. `CodePlaceholder`/`ProjectAsset`'s code-snippet rendering (`asset-placeholder.jsx`) is a plain bordered `<pre><code>` block with a language label — a real code excerpt display for real project code, not IDE/terminal cosplay chrome (no title bar, no traffic lights, no fake prompt).

**The five placeholder project sections and `/projects/[slug]` routes, specifically:**

Checked because these are about to receive real content and a bento-grid regression here would be the most visible possible instance of this whole list. `ProjectDetailView`'s asset gallery (`app/components/homepage/projects/project-detail-view.jsx`) renders `grid grid-cols-1 sm:grid-cols-2 gap-6` — every asset tile is the same size, full stop. There is no per-asset size/span override anywhere in `utils/data/projects-data.js` (confirmed by grep for `col-span`/`row-span`/arbitrary `aspect-[` — none exist), so there is no mechanism by which a future content edit could make one figure bigger than its neighbors without also editing this component's markup directly. The one exception, `sm:only:col-span-2` (a category with exactly one asset spans the full row instead of sitting alone with a bare gap beside it, via Tailwind's `:only-child` variant), is a fix for an *empty-space* problem, not a size-hierarchy decoration — a category with two assets is completely unaffected, and it doesn't create the asymmetric big-tile/small-tile mix that defines a bento layout. Verified live against `aircraft-design`, the one project with real assets (8/8, per `npm run check`) — the gallery renders as a plain, uniform, captioned 2-column grid at `sm:` and up, one column below it. This structure holds regardless of how many real assets eventually land in each category; it does not need to be revisited when the other four projects are filled in.

One thing noticed here, **not fixed, flagged instead:** `aircraft-design`'s `hero.jpg` — one of the eight ffmpeg-generated placeholder files from the "fully populated reference implementation" pass (commit `18856f9`) — is itself a diagonal green-to-navy gradient test pattern, with "DUMMY — PLACEHOLDER HERO IMAGE" burned into the pixels. It's real pixels currently rendering on the live homepage and `/projects/aircraft-design`, and it happens to land in almost exactly the neon-mint family this whole engagement has been removing everywhere else — but it's synthetic test-pattern content generated on purpose to prove the real-asset pipeline before real photos are exported, self-labeled unmistakably as fake in giant text, not a design decision anyone made about how the site should look. Left alone as out of scope for a component/token pass — raised here so it isn't mistaken for something this audit checked and cleared.

---

## Audit: motion restraint

A pass over every `hover:`/`transition`/`duration`/`animate`/`scale`/`translate` class in `app/components` (the Stage-4 `data-reveal` scroll reveals, `utils/hooks/use-section-reveal.js`, were explicitly out of scope — those stay). Rule applied: motion stays only where it aids comprehension or confirms a real interaction; a hover state on its own is a state change, not an animation, so it should read as immediate, not eased in over a duration.

**Removed — decorative motion with no interaction behind it:**

- **The profile photo's `hover:grayscale-0 hover:scale-110` reveal, `duration-1000`.** A plain, non-interactive `<Image>` (no link, no click handler) had a full-second hover animation that revealed color and grew the image — motion with nothing to confirm, since hovering a non-interactive photo does nothing. **Removed**, along with `cursor-pointer` (there was never anything to click). The photo is now a static grayscale image, matching the site's near-monochrome direction rather than hiding it behind a hover gimmick.
- **`SkillTile`'s `hover:scale-[1.08]` and `group-hover:border-accent`, `duration-500`.** The tile itself carries `cursor-default` — the codebase's own admission that these tiles aren't interactive — while still growing and re-bordering on hover. **Removed entirely**; the tile is now a plain static box, consistent with what `cursor-default` already says about it.
- **`hover:scale-110`/`hover:scale-125` on every icon-only link** (contact section's email/GitHub/LinkedIn icons, hero's GitHub/LinkedIn icons) **and `hover:text-xl` on the scroll-to-top button.** Real links and a real button, so the hover state itself stays — but the icon growing in size on hover confirms nothing about the interaction; the color/background change already does that job. **Removed** the scale/size growth from all five, kept the color/background hover.

**Changed from animated to immediate — real interactions, but eased over a duration that read as an animation rather than a state change:**

`transition-colors`/`transition-all` + `duration-200`/`duration-300`/`duration-500` was applied uniformly to essentially every hover and focus state on the site: `card.jsx`'s border-on-hover, the nav links and mobile-menu toggle, both hero CTAs and both social links, the "View full project" and "Back to portfolio" links, the contact-form inputs' focus border and its submit button. None of these move or resize — they're all a color, border, or background swap. **The `transition-*`/`duration-*`/`ease-*` classes were removed from all of them**, so the state change is instant: hover/focus now reads as immediate and legible, not as a small animation playing on every pointer pass. Nothing about *what* changes on hover/focus was touched, only whether it eases in or snaps.

**Kept, deliberately — confirms a real interaction, not decorative:**

- **The mobile nav menu's open/close transition** (`navbar.jsx`, `max-h-0 opacity-0` ↔ `max-h-screen opacity-100`, `duration-300`). This isn't a hover state, it's a click-triggered panel appearing/disappearing — an abrupt cut here would be more disorienting than the eased version, not less. Kept, but paired with `motion-reduce:transition-none` so it's an instant show/hide under reduced motion rather than a smaller version of the same animation — the one transition on the site that still animates now also has an explicit reduced-motion opt-out, which none of the removed ones needed since they no longer animate at all.
- **The Stage-4 `data-reveal` scroll reveals** (`useSectionReveal`) — explicitly out of scope per this pass's own framing above, and already fail-open under reduced motion (see the hook's own docstring).

## Audit: loading states

The site was about to receive large real images and video with nothing marking the gap between "layout reserved" and "asset painted" — worth fixing before real assets land, not after. Scope: `ProjectAsset`'s real-image and real-video render paths in `app/components/helper/asset-placeholder.jsx` (the dashed `AssetPlaceholder`/`CodePlaceholder` boxes aren't a loading state — they don't load anything, they're a permanent "not real yet" marker, untouched here).

**What changed:** both the image and video branches now render inside a wrapper `<div>` sized to the asset's exact aspect ratio (`style={{ aspectRatio }}`, computed from the manifest's `width`/`height` — the same values that already gated whether an asset counts as "real"), with a skeleton tone (`bg-surface-raised`, a token already used elsewhere for exactly this "one step up from the base surface" role) sitting behind the media as an absolutely-positioned layer.

**Why this needs no JavaScript at all**, which is the load-bearing design decision here, not an implementation detail: an `<img>` (and a `<video poster>`, once painted) is transparent until it has real pixels to show — that's native browser behavior, not something either element does on request. So the skeleton doesn't need a load event to know when to hide; it never actively hides. It just sits one layer behind the media in the same positioned stacking context, and the instant the real asset has pixels to paint, those pixels cover it. No `useState`, no `onLoad` handler, no "use client" — `ProjectAsset` and `AssetPlaceholder` stay exactly the plain components they already were. That satisfies the "must degrade to visible content if JS fails" requirement in the strongest available way: there's no JS in the loading-state mechanism to fail in the first place. Confirmed with a full Playwright pass at `javaScriptEnabled: false` — every image and the video poster on `/projects/aircraft-design` render correctly with JS off, same as with it on.

**Reserving exact layout space:** the wrapper's `aspectRatio` comes from the manifest before any request for the asset itself goes out, so the box is the right size on first paint — nothing shifts when the asset finishes loading, on a fast connection or a slow one. The real `<Image>` switched from explicit `width`/`height` to `fill` to size itself off that same wrapper rather than duplicating the ratio in a second place that could drift from it.

**Not animating under reduced motion:** the skeleton tone uses `motion-safe:animate-pulse` — Tailwind's built-in reduced-motion variant, not a bespoke `prefers-reduced-motion` media query — so the pulse itself is present only when motion is allowed; under reduced motion it's a flat, static tone. Verified directly: `getComputedStyle(...).animationName` reads `"pulse"` under normal preferences and `"none"` under `reducedMotion: 'reduce'`, for every skeleton on `/projects/aircraft-design`.

---

## What's still deferred (later stages, not this one)

- **Marquee → static grouped grid for Skills** (Stage 5.4) — the data is grouped by category now (`utils/data/skills.js`), but the component still flattens it into the existing `react-fast-marquee` scroll for visual continuity. The PRD explicitly flags the infinite marquee as working against "restrained"; replacing it is a layout change, out of scope for a tokens-only stage.
- **A real proof-point moment in the hero** (Stage 5.1) — content/copy work, not a token question.
- ~~Icon coverage for the skills grid~~ — **resolved 2026-08-06.** `utils/skill-image.js` now covers 14 of 25 skills with real brand icons (10 local SVGs + `react-icons/si`'s `SiAnsys`/`SiArduino`/`SiRaspberrypi`/`SiNvidia`, checked individually for an unambiguous brand match — two lookalikes, `SiYolo` and `SiGoogle`, were deliberately rejected as wrong/misrepresentative matches). The remaining 11 (YOLOv8, ROS 2, Gazebo, Isaac Sim, MuJoCo, LiDAR/Depth, TensorRT, SolidWorks, Fusion 360, Simulink, Google Workspace) get a uniform `font-mono` monogram tile — same neutral `ink-*` tokens as everything else, no accent, applied identically rather than a one-off per skill.
