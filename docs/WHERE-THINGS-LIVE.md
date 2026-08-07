# Where Things Live

A wayfinding guide, organized by what you're trying to *do*, not by folder. Every path and field below was verified against the actual code on 2026-08-07, after Polish passes 1-3 — if something here looks wrong later, the code changed and this doc didn't; fix the doc, don't trust memory. The "Worked example" under [Adding assets](#adding-assets) was tested literally as written — a real placeholder JPEG dropped into `public/projects/aircraft-design/`, the manifest edited exactly as shown, confirmed rendering correctly through Next's image optimizer (right dimensions, correct `srcset`, caption visible) on the live dev server — then fully reverted, so `projects-data.js` and `public/projects/` are unchanged from before this doc was written.

Jump to: [Content](#content) · [Adding assets](#adding-assets) · [Styling](#styling) · [Motion](#motion) · [Layout](#layout) · [Known TODOs](#known-todos)

---

## Content

### Your name, title, bio, email, socials, resume
**File:** `utils/data/personal-data.js` — one object, `personalData`.
- `name` — short display name ("Sujith"), used in the hero `<h1>` and nav logo.
- `designation` — your title, shown in the hero next to your name in accent color.
- `description` — the About section's bio paragraph, rendered verbatim in `app/components/homepage/about/index.jsx`.
- `email` — shown in the Contact section next to the email icon.
- `github` / `linkedIn` — the two social icon links in the Hero and Contact sections. `facebook`/`twitter`/`stackOverflow`/`leetcode` exist but are empty strings on purpose (no icon renders for an empty value — see `docs/BUILD-PLAN.md` Stage 1.1) — fill one in and its icon reappears automatically only if you also add the rendering for it (currently only github/linkedIn are wired to icons in Hero/Contact; adding a new platform means editing those two components too).
- `resume` — currently an external Google Drive link, not a same-origin PDF. **If you change this,** see [Known TODOs](#known-todos) — there's an open PII-redaction decision blocking moving it into `public/`.
- `profile` — path to your photo (`/profile.png`, i.e. `public/profile.png`), used in the About section only.

*If you change `designation`, also check:* `app/layout.js`'s `TITLE`/`DESCRIPTION` constants (below) don't automatically pick it up — they're separate, hand-written strings for SEO purposes, not derived from `personalData`.

### Page title, meta description, OG image, favicon
**File:** `app/layout.js` — two constants near the top: `TITLE` and `DESCRIPTION`. Both feed the `<title>` tag, the base `<meta name="description">`, and the OpenGraph/Twitter card metadata at once (kept as one pair specifically so they can't drift apart again — they used to say different things in the same page, see `docs/POLISH-AUDIT.md` Polish pass 2 §1).

- **OG/Twitter card image** — not a static file. `app/opengraph-image.jsx` generates it at build time using `next/og`'s `ImageResponse` (name, title, "Aerospace · Robotics · Autonomy" tagline, using the real design tokens — see [Styling](#styling)). `app/twitter-image.jsx` re-exports the same module rather than duplicating it. **To change the OG card's text/design**, edit `app/opengraph-image.jsx` only — the Twitter file updates automatically. Don't add an `images` array back into `layout.js`'s `openGraph`/`twitter` metadata blocks — that would create a second, easily-stale image reference alongside the file-convention one.
- **Favicon** — `app/favicon.ico` (16/32/48px multi-size, the browser tab icon), `app/icon.png` (512px, modern browsers), `app/apple-icon.png` (180px, iOS home screen). All three are currently the same "S" monogram in `signal-500`/`ink-900`. Regenerate all three together if you change the design — there's no single source file, they were hand-generated once (see `docs/POLISH-AUDIT.md` Polish pass 2 §1 for exactly how, if you need to redo it).
- **Canonical site URL** (used by the OG image generator and metadata resolution) — `SITE_URL` constant in `app/layout.js`, reads `NEXT_PUBLIC_APP_URL` with a hardcoded fallback. *If you change domains,* update the fallback string here too, not just the env var — it's the safety net if the env var is ever unset.

### A project's title, description, narrative, tools, context, result
**File:** `utils/data/projects-data.js` — find the project's object by `slug`, edit these fields directly:
- `nameFull` — the title shown as the page/section heading.
- `context` — the small mono line under the title ("personal project, 2025" etc.) — there's no employer/role field, these are personal projects.
- `description` — the narrative paragraph.
- `tools` — array of strings, rendered as tag chips.
- `result` — **optional.** One line, shown in accent color. Leave it as `''` (empty string) if there's no real quantified result — the component omits the line entirely rather than showing empty accent text (`docs/DESIGN-SYSTEM.md`'s accent rule: accent is for real proof-point data only). Don't put a placeholder string here; empty is the correct "nothing yet" state.

*If you change any of these,* nothing else needs touching — both the homepage showcase and the `/projects/[slug]` detail page read the same object via the shared `ProjectHeader` component (`app/components/homepage/projects/project-header.jsx`), so there's no second copy to keep in sync.

### Adding or removing a project entirely
Five files/locations, in order:
1. **`utils/data/projects-data.js`** — add/remove the project's object from the `projectsData` array. New projects need: `id`, `slug` (kebab-case, becomes the URL), `domain`/`name` (matches your folder-naming convention), `nameFull`, `context`, `result`, `description`, `tools`, `hero` (`{ file, width, height, alt, placeholder: true }`), and `assets` (use the `demoAssets()` helper for the standard placeholder set, or build a custom array — see [Adding assets](#adding-assets)).
2. **The `/projects/[slug]` route** — nothing to create. `app/projects/[slug]/page.js` is a dynamic route; `generateStaticParams()` in that file reads `projectsData` directly and generates one static page per entry automatically. Removing a project from the array removes its route on the next build with zero other changes.
3. **`public/projects/<slug>/`** — the asset directory. Create it for a new project (see [Adding assets](#adding-assets)); delete it if removing a project (nothing references it once the data entry is gone).
4. **The homepage showcase** — nothing to touch. `app/components/homepage/projects/index.jsx` maps over `projectsData` directly; no per-project list to maintain there either.
5. **Nav/other cross-references** — checked: nothing else in the codebase hardcodes a project slug or title (confirmed via `grep -rn "aircraft-design\|cubesats-and-satellites\|drone-and-unmanned\|rocket-design-technology\|'rover'" app utils` — only `projects-data.js` and `docs/ASSET-CHECKLIST.md`'s per-project checklist match). If you remove a project, `docs/ASSET-CHECKLIST.md`'s checklist for it becomes stale — worth deleting that section too, but it won't break anything if you don't.

### Experience entries
**File:** `utils/data/experience.js` — array of `{ id, title, company, duration, bullets: [] }`. Rendered by `app/components/homepage/experience/index.jsx`, reverse-chronological order is just array order (no auto-sorting) — reorder the array to reorder the page.

### Education entries
**File:** `utils/data/educations.js` — array of `{ id, title, duration, institution, status, achievements: [] }`. `status` is the small pill badge (e.g. "Incoming", "Expected 2026") — omit the field entirely for an entry with no status badge, don't pass an empty string (the component checks `education.status &&` before rendering the pill, so `''` and `undefined` both correctly hide it — either works, but omitting is clearer). `achievements` is optional too, same pattern.

### Skills list
**File:** `utils/data/skills.js` — array of `{ category, skills: [] }`. Rendered by `app/components/homepage/skills/index.jsx` as a grouped grid (category becomes an `<h3>`, skills become tiles). *If you add a new skill,* also check `utils/skill-image.js` — every skill gets an icon or a monogram fallback automatically, but a **new** skill name won't have an icon mapped yet and will silently fall through to the monogram system. See [Styling](#styling) for exactly how to add a real icon vs. accept the fallback.

---

## Adding assets

**This is the section you'll use most.** The format is fully built and live with grey placeholder boxes — every image/video slot already exists on the page, in the right position, at the right aspect ratio. Adding a real asset is a two-step process: drop the file, then flip one field in the data file. Nothing else changes.

### Where each asset type goes, per project

All files for one project live in **`public/projects/<slug>/`** (create the directory if it doesn't exist yet — none exist as of this writing). `<slug>` is one of: `aircraft-design`, `cubesats-and-satellites`, `drone-and-unmanned-aerial-vehicles`, `rocket-design-technology`, `rover`.

| Asset type | Filename convention | Dimensions | Format |
|---|---|---|---|
| Hero (exactly one per project) | `hero.jpg` | 2400×1350 | JPEG (or PNG if transparent) |
| CAD/design render | `cad-01.jpg`, `cad-02.jpg`, ... | 1600×1200 | JPEG |
| Simulation screenshot | `sim-01.jpg`, `sim-02.jpg`, ... | 1600×900 | PNG (contour plots compress better lossless) |
| Results plot/figure | `results-01.jpg`, `results-02.jpg`, ... | 1600×900 | PNG or JPEG |
| Video | `video-01.mp4`, `video-02.mp4`, ... | ≤1920×1080, ≤8MB | MP4/H.264 |
| Video poster frame | `video-01-poster.jpg` (matches its video's number) | ≤1600px long edge | JPEG |

Full export-quality specs (source file size targets, SolidWorks-specific render guidance, video compression/trimming) are in `docs/ASSET-CHECKLIST.md` — this table is the filename/dimension convention only.

### How a new asset gets picked up — it's a manifest, not auto-discovery

Dropping a file into `public/projects/<slug>/` **does nothing by itself.** Files aren't auto-discovered from the filesystem, and they aren't statically imported (`import cad01 from '...'`) either — every asset is a plain-object entry in the project's `assets` array (or the `hero` object) in `utils/data/projects-data.js`. The object has a `placeholder` field: `true` renders the grey dimensioned box, `false` + a `file` renders the real image/video. This is deliberate — a manifest is a pure data edit, safe to do incrementally, one project/one asset at a time, with no component code to touch (see `docs/PRD.md` §10.3 for the original rationale).

The component that reads this and decides what to render is `ProjectAsset` in `app/components/helper/asset-placeholder.jsx` — you don't need to touch this file to add an asset, only to know it exists if something isn't rendering as expected.

### Worked example — adding one CAD image to `aircraft-design`

**Before** (in `utils/data/projects-data.js`, inside `aircraft-design`'s `assets` array — this is what `demoAssets()` generates by default):
```js
assets: [
  { category: 'cad', placeholder: true, width: 1600, height: 1200, caption: 'TODO' },
  // ...the rest of demoAssets()
],
```

**Step 1 — drop the file:** save your export as `public/projects/aircraft-design/cad-01.jpg` (1600×1200, per the table above).

**Step 2 — edit the manifest entry.** Stop using the `demoAssets()` helper for this project (it exists only to generate the placeholder set) and write the `assets` array out explicitly so you can edit individual entries. Change the one CAD entry you're replacing:
```js
assets: [
  {
    category: 'cad',
    placeholder: false,
    file: 'cad-01.jpg',
    width: 1600,
    height: 1200,
    alt: 'SolidWorks assembly render of the wing spar',
    caption: 'SolidWorks assembly render of the wing spar',
  },
  // ...remaining placeholder entries, untouched
],
```

**After:** the detail page (`/projects/aircraft-design`) now shows your real JPEG in the "Design & CAD" gallery section, with the caption underneath it. The homepage showcase is unaffected (it only ever shows the `hero` asset, never gallery items). No other file needs editing, no rebuild step beyond the normal dev server hot-reload / next build.

**Required fields for a real (non-placeholder) image asset:** `category`, `placeholder: false`, `file`, `width`, `height`. **Recommended:** `alt` (accessibility text) and `caption` (visible text under the image on the detail page) — if `alt` is missing, the component falls back to `caption`, then to an empty string; write at least one of them.

### Video assets

Same manifest pattern, one category (`video`), two extra fields:
```js
{
  category: 'video',
  placeholder: false,
  file: 'video-01.mp4',
  poster: 'video-01-poster.jpg',
  width: 1920,
  height: 1080,
  caption: 'Wind-tunnel test, 15° angle of attack',
}
```
`poster` is the still-frame filename (same directory, same slug). If you omit `poster`, the `<video>` element just has no poster attribute — it degrades to the browser's own default, not broken, just less polished. Video is **click-to-play by default** — `preload="none"`, real `<video controls>`, no autoplay, no loop. This is hardcoded in `ProjectAsset` (`app/components/helper/asset-placeholder.jsx`), not a per-video setting — there's currently no manifest field to opt a specific short/silent clip into autoplay (the PRD allows that as a rare exception; it isn't built, because nothing has needed it yet). *If you ever need it,* that's a code change to `ProjectAsset`'s video branch, not a data-only change.

### Captions and alt text — where they're written, where they show

Both live directly on the asset object (`caption`, `alt`) in `utils/data/projects-data.js` — there's no separate captions file. **`caption` is only ever displayed on the `/projects/[slug]` detail page**, under each gallery image (`project-detail-view.jsx`, the `<p>` right after each `ProjectAsset`). The homepage showcase section shows no caption for the hero image at all — only `alt` (accessibility-only, never visible as text) applies there. If you want visible text near the homepage hero, that's the `description` paragraph (see [Content](#content)), not a caption field.

### Code snippets

Fifth category, no file at all — the snippet is inline text in the manifest:
```js
{
  category: 'code',
  placeholder: false,
  language: 'python',
  snippet: `def trim_condition(alpha, cl_target):\n    ...`,
  caption: 'Trim-angle solver used for the stability sweep',
  codeUrl: 'https://github.com/Sujith-013/...',  // optional
}
```
`language` is just a label printed above the snippet (no syntax highlighter is wired up — it's a plain monospace block, deliberately, per `docs/PRD.md` §10.3: a code block is one gallery element, not the page's frame, so it doesn't earn a new dependency). `codeUrl` is optional — if present, a "View full source" link renders below the snippet. Rendered by `CodePlaceholder` in `app/components/helper/asset-placeholder.jsx`, same placeholder/real split as images (`placeholder: false` + `snippet` present → real block; otherwise → the dashed "CODE SNIPPET" placeholder box).

*If a project has no real code,* leave its code entry as `placeholderAsset('code', null, null)` (the `demoAssets()` default) or omit the code category from `assets` entirely — the detail page simply doesn't render a "Code" section if there are zero items in it (confirmed behavior, see `docs/POLISH-AUDIT.md` Polish pass 3 §3).

---

## Styling

Full rationale lives in `docs/DESIGN-SYSTEM.md` — this section is the "where do I change it" index, not a restatement.

### Color tokens and the accent's reserved role
**File:** `app/css/theme.css`, inside the `@theme { ... }` block. Two primitive scales — `ink-*` (neutral, 50-950) and `signal-*` (the one accent, 400-600) — plus semantic aliases (`--color-canvas`, `--color-surface`, `--color-text-primary`, `--color-accent`, etc.) that components should reach for by name. **The accent rule, stated at the top of this file as a comment too:** `--color-accent`/`signal-*` is reserved for exactly two jobs — quantified/proof-point data and identifying labels (dates, project titles, results), and interactive affordances (links, hover/focus states, the primary CTA). Never decoration, never a large fill, never bulk emphasis. If you're about to use accent for something that's neither data nor interactive, use an `ink-*` token instead.

### Typography scale and which face goes where
**Font loading:** `app/layout.js` — three `next/font/google` calls (`Inter`, `Roboto_Slab`, `IBM_Plex_Mono`), each exposing a CSS variable consumed by `theme.css`.
**Scale/roles:** `app/css/theme.css`'s `@theme` block — `--font-sans` (Inter, body text, the default), `--font-display` (Roboto Slab 700, headings/nav logo/section eyebrows/project titles), `--font-mono` (IBM Plex Mono, dates/tags/spec labels/code). `--text-display: 2.75rem` is the one custom type-scale token (fills a real gap between Tailwind's default `text-4xl`/`text-5xl`), used on the hero `<h1>`.
**Applying a face:** use the Tailwind utility (`font-display`, `font-mono`) directly in a component's `className` — there's no separate "apply typography" step, it's inline per-element like every other utility class here.

### Spacing rhythm
No dedicated spacing token file — `--spacing: 0.25rem` (Tailwind's 4px default) is declared explicitly in `theme.css`, and the actual rhythm is expressed directly as utility classes per component: **`my-12 lg:my-24`** on every top-level homepage section wrapper (48px → 96px), **`gap-8 lg:gap-16`** on two-column grids. There's nothing to "look up" beyond grepping for these two patterns — match them when adding a new section rather than inventing a new spacing value.

### Where a component's layout lives vs. global styles
- **Per-component layout/spacing/color** — inline Tailwind utility classes directly in each `.jsx` file under `app/components/`. This is the vast majority of all styling in the repo.
- **`app/css/globals.scss`** — almost empty on purpose: just `body { color; background-color; }`. Not where component styling goes.
- **`app/css/card.scss`** — the one real custom-CSS file, holding `GlowCard`'s mouse-tracked conic-gradient hover effect (`app/components/helper/glow-card.jsx` is the React half; the actual gradient math is here because it needs raw CSS custom properties Tailwind utilities can't express). If you're touching the Experience/Education card hover glow, this is the file — nothing else has hand-written CSS.
- **`app/css/theme.css`** — tokens only (see above), not component layout.

### What not to do
- **No hardcoded hex values** anywhere in a component. Every color traces back to a `theme.css` token. (`app/api/contact/route.js`'s HTML email template is the one deliberate exception — email clients don't support CSS custom properties, so inline hex is correct there, not a violation.)
- **No arbitrary Tailwind bracket values** (`p-[13px]`, `text-[#fff]`, etc.) for anything a token should cover. The one legitimate class of exception already in the codebase is one-off pixel dimensions tied to a specific decorative SVG's real size (e.g. `w-[100px] h-[100px]` ambient blur blobs) — not colors, not spacing that should follow the `my-12 lg:my-24` rhythm.
- **Do not reintroduce `tailwind.config.js`.** It was deleted entirely in Stage 3 — Tailwind v4's `@theme` in `theme.css` is the only configuration surface. If something seems to need JS-level config, that's a signal to re-read `docs/DESIGN-SYSTEM.md`'s "Where the tokens live" section before assuming a config file is the fix.

---

## Motion

**File:** `utils/hooks/use-section-reveal.js` — the one shared primitive, `useSectionReveal(scopeRef)`. **In one paragraph:** every section calls this hook once, passing a ref to its own wrapping element; the hook finds every descendant marked `data-reveal="text"` or `data-reveal="figure"`, hides them, and builds one GSAP timeline (not one ScrollTrigger per element) that reveals them all in DOM order — with a small stagger — the first time the section scrolls into view, then never again.

### Changing timing, stagger, distance, easing
All in `use-section-reveal.js`, inside the `gsap.to(...)` call:
- **Stagger** — the `stagger: 0.12` property (seconds between each element's animation start).
- **Duration** — the `duration: (_i, target) => ...` function — currently 0.7s for `figure` steps, 0.55s for `text` steps.
- **Easing** — the `ease: "power2.out"` string (any GSAP ease name).
- **Distance/movement** — in the earlier `gsap.set(...)` call (the "hidden" state): `y: (_i, target) => ...` — currently 32px for figures, 20px for text. Figures also get a slight `scale: 0.97` "resolving into view" effect.
- **Trigger point** — the hook's second argument, `{ start = "top 78%" }` — when the section starts revealing relative to viewport position. Override per-call: `useSectionReveal(scopeRef, { start: "top 60%" })`.

### Making a new element animate
Add `data-reveal="text"` (small slide-up, for copy/labels/tags) or `data-reveal="figure"` (larger movement + scale, for images/cards/anything visual) directly on the JSX element — no other wiring needed, as long as it's inside a section that already calls `useSectionReveal` on an ancestor ref. Order matters: elements animate in DOM order, not declaration order across components.

### Making something NOT animate
Don't add a `data-reveal` attribute. This is the entire mechanism — there's no separate opt-out flag. The hero `<h1>` is the one deliberate example: it carries no `data-reveal` at all, because it's LCP-critical content that must be visible and stable on first paint (see the comment directly above `useSectionReveal(scopeRef)` in `app/components/homepage/hero-section/index.jsx`).

### The reduced-motion gate
Inside `use-section-reveal.js`: a plain `window.matchMedia("(prefers-reduced-motion: reduce)").matches` check, made **before** anything is hidden. If it's true, the hook returns immediately and does nothing — nothing was ever hidden, so there's nothing to reveal. **The rule, and why it's built this way:** content must never be hidden pending an animation that might not run — the failure mode is always "no animation," never "invisible content." (This file used to hide elements unconditionally via a CSS class and rely on a callback to reveal them; that callback silently never fired for most visitors and broke the entire site — see the long comment in the file itself, and `docs/BUILD-PLAN.md`'s Stage 4 write-up, for the full incident.) The same discipline extends to video: `ProjectAsset`'s `<video>` elements never autoplay by default (see [Adding assets](#adding-assets)), so there's no separate reduced-motion branch needed there — nothing plays without a visitor pressing play, under any motion preference.

---

## Layout

### Homepage section order
**File:** `app/page.js` — a flat list of JSX elements in `<div>`. Reorder sections by reordering the lines; each section is self-contained (owns its own `id` for nav-anchor scrolling, its own `useSectionReveal` call), so reordering is safe with no cross-file coordination needed. Current order: Hero → About → Experience → Skills → Projects → Education → Contact.

### Nav links
**File:** `app/components/navbar.jsx` — the `NAV_LINKS` array near the top (`{ href, label }` pairs). Both the desktop nav and the mobile hamburger menu render from this same array — no second list to keep in sync. Anchor links (`/#about` etc.) must match the target section's `id` in `app/page.js`.

### The `/projects/[slug]` detail-page template
**Route file:** `app/projects/[slug]/page.js` — server component, handles `generateStaticParams`/`generateMetadata`, groups a project's `assets` by category, calls `notFound()` for an unknown slug.
**Actual template/markup:** `app/components/homepage/projects/project-detail-view.jsx` — the back-link, header, hero, description, tools, and the gallery loop. Shared header markup (title/context/result) lives in `project-header.jsx`, reused by both this and the homepage showcase (`project-showcase.jsx`) via a `headingLevel` prop so each gets a correct, non-duplicate `<h1>`/`<h3>` in its own page's document outline.

### Server vs. client components — and why it matters when you edit one
**Server components** (no `"use client"` directive): `app/page.js`, `app/layout.js`, `app/not-found.jsx`, `app/projects/[slug]/page.js`, `app/opengraph-image.jsx`, `app/twitter-image.jsx`. These can be `async`, can use `generateStaticParams`/`generateMetadata`, and render with no client-side JS shipped for their own code — but **cannot** use hooks (`useState`, `useEffect`, `useRef`) or browser-only APIs. If you need to add interactivity to one of these, either add `"use client"` to the top (loses the server-only capabilities above) or extract a small client child component and import it in.

**Client components** (`"use client"` at the top of the file): everything under `app/components/homepage/*`, `app/components/navbar.jsx`, and the three helpers (`animation-lottie.jsx`, `glow-card.jsx`, `scroll-to-top.jsx`). These can use hooks and browser APIs, but **cannot** be `async` functions or export `generateStaticParams`/`generateMetadata`. Every homepage section is a client component because every one of them calls `useSectionReveal` (needs `useRef` + GSAP, both client-only).

`app/components/helper/asset-placeholder.jsx` and `app/components/homepage/projects/project-header.jsx` have **no** `"use client"` directive and use no hooks — they work correctly either as a standalone server component or nested inside a client tree (which is how they're actually used today, imported by the client components above). Don't add hooks to either without adding `"use client"` too.

---

## Known TODOs

Open decisions and unfinished verification, pulled from `docs/POLISH-AUDIT.md` (Polish passes 1-3) plus one found while writing this doc — nothing here is a bug, everything here needs a decision or a follow-up pass:

1. **Contact form: keep vs. `mailto:` link — undecided.** `docs/POLISH-AUDIT.md` Polish pass 1 §3 argues both sides; recommendation is to keep the form once `EMAIL_ADDRESS`/`GMAIL_PASSKEY` are set (currently unset, so every submission gets an honest 503). Your call, not acted on.
2. **Resume PII redaction — undecided, blocking.** `personalData.resume` still points at an external Google Drive link rather than a same-origin `/resume.pdf`, because the source PDF has three referees' names/employers/personal phone numbers that need redacting first (`docs/BUILD-PLAN.md` Stage 2.1/0.1).
3. **The five projects' content is entirely placeholder.** Every `nameFull`/`context`/`description`/`tools`/`result` in `utils/data/projects-data.js` is a literal `TODO:` string, and every asset is `placeholder: true`. This is intentional, not a bug — see [Adding assets](#adding-assets) and `docs/ASSET-CHECKLIST.md` for exactly what's needed per project.
4. **`NEXT_PUBLIC_GTM` is unset locally** — Google Tag Manager's `gtmId` resolves to `undefined` in the rendered page (harmless, no tracking fires, no error) until it's set in the environment.
5. **A hands-on browser/DevTools pass is still owed** for both responsive layout and keyboard navigation. Every verification in Polish passes 1-3 was done via SSR HTML inspection, computed class/aspect-ratio reasoning, and live-but-scripted checks — no interactive browser automation tool is available in this environment. Worth an actual resize-and-tab-through pass before shipping real assets.
6. **Formal Lighthouse run (`docs/BUILD-PLAN.md` Stage 8.1) hasn't happened** — bundle size and per-image budgets were verified manually and empirically (see `docs/POLISH-AUDIT.md` Polish pass 3 §2), but an actual Lighthouse score against a deployed preview is still outstanding.
7. **Minor: a vestigial `video: true` field.** `projects-data.js`'s `demoAssets()` helper sets `{ video: true }` on its placeholder video entry, but nothing reads that field — `ProjectAsset` and `AssetPlaceholder` both branch on `category === "video"` instead. Harmless (found while writing this doc), safe to remove next time that helper is touched, not worth a standalone pass.
