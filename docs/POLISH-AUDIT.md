# Polish Pass 1 — Findings and Fixes

Three sections that were functionally broken or empty, investigated and fixed 2026-08-07. Read `docs/BUILD-PLAN.md` and `docs/DESIGN-SYSTEM.md` first for context — this doc records what was found and why each fix was made, not a rehash of the design system itself.

---

## 1. Blog section — dev.to fetch confirmed empty

**Test:** `curl -s "https://dev.to/api/articles?username=Sujith-013"` → `[]`. The request doesn't error (`res.ok` is true, so `app/page.js`'s `getData()` never throws) — it succeeds and returns zero articles, because this dev.to account has never posted. `docs/CONTENT-AUDIT.md` (line 80) already flagged this as "a template feature with no resume basis," unresolved since Stage 1.

**Effect on the live site:** the homepage Blog section renders its heading, divider, and a "View More" button over an empty grid — no cards, nothing wrong-looking enough to be obviously broken, just silently empty. `/blog` is the same empty grid with nothing else on the page. Exactly the "empty section must not ship" case.

**Options considered:**
1. **Remove the section and `/blog` route entirely.** No content exists to show; nothing on the resume or in `docs/CONTENT-AUDIT.md` establishes a public-writing habit to feature instead.
2. **Repoint `devUsername`** to an account that has posts. Rejected outright — there's no such account to point at; inventing one or using a placeholder would be fabricating content, explicitly against the ground rules for this pass.
3. **Replace with a static "writing/talks" placeholder** (`docs/PRD.md` §4 point 7 floated the IEPC presentation as a candidate). Rejected for this pass specifically: the ground rules for this task say don't invent or touch project/content substance, and building a new "talks" content type with real copy is new content work, not a polish fix — it's a legitimate future idea but belongs in a content-authoring pass, not this one.

**Recommendation and action taken: removed.** This is the only option that doesn't require unverified content and doesn't ship an empty section. Removed cleanly:
- `app/page.js` — dropped the `getData()` dev.to fetch and the `<Blog blogs={blogs} />` render.
- `app/blog/page.js` — deleted (the route).
- `app/components/homepage/blog/` — deleted (`index.jsx`, `blog-card.jsx`).
- `app/components/navbar.jsx` — removed the "BLOGS" nav link.
- `utils/data/personal-data.js` — removed `devUsername` (now unused anywhere).
- `utils/time-converter.js` — deleted (only consumer was `blog-card.jsx`).
- No npm dependency was blog-specific (the integration was a plain `fetch` call, not a package), so no `package.json` changes here.

If a real talks/writing section is wanted later, it's a new content-and-design decision, not a revival of this dev.to wiring.

---

## 2. Skills marquee — rebuilt as a static grid

**Confirmed root cause** (flagged, not fixed, in the prior session): `react-fast-marquee` renders nothing in server-rendered HTML — its scroll mechanics depend on measuring container width client-side, so with JS disabled (or before hydration) the entire Skills section was blank past the "Skills" heading. Verified again here before rebuilding: SSR HTML for `#skills` contained the heading and divider but zero skill tiles.

**Fix:** replaced the marquee with a static grid, grouped by the categories `utils/data/skills.js` already carries (`Languages & ML`, `Robotics & Simulation`, etc. — this data shape has existed since Stage 1.4, the component just flattened it for the marquee). Same tile treatment (icon / `IconComponent` / monogram fallback, unchanged from the icon-coverage work) and design tokens — no new visual system, just a different container. `react-fast-marquee` removed from `package.json` and its import; no other file referenced it.

**Verified with JS disabled:** confirmed via curl'd SSR HTML that all 25 skill names and their icon/monogram markup are present in the initial server response — a no-JS visitor now sees the same information a JS visitor does, motion or not.

---

## 3. Contact form — 503 path is honest; keep-vs-mailto is an open question

**503 path checked end-to-end:** `app/api/contact/route.js` already returns a real `503` with a clear message — `"The contact form is not configured yet — email delivery is unavailable right now. Please reach out directly instead."` — when `EMAIL_ADDRESS`/`GMAIL_PASSKEY` aren't set (they aren't, confirmed no `.env.local` values). `contact-form.jsx`'s `catch` block surfaces `error?.response?.data?.message` via a visible `react-toastify` toast. This is honest, not a silent failure — a visitor who submits the form today sees a real error, not a false "sent!" confirmation.

**One dishonest-adjacent gap found and fixed regardless (per instruction to fix this now, independent of the keep/replace decision):** the toast only shows real text when the failure is an HTTP error with a JSON body (the 503 case). A network failure, timeout, or any error without `error.response.data.message` would call `toast.error(undefined)` — react-toastify renders an empty toast, which reads as a silent failure even though the code technically "tried" to report something. Added a fallback string so every failure path shows real text.

**Keep the form vs. replace with a `mailto:` link — not decided here, per instruction.**

- **Keep the form:** a real form is lower-friction for a visitor (no mail client hand-off, works from any device including ones without a configured mail client) and looks more finished/professional for a portfolio. Cost: it depends on `EMAIL_ADDRESS`/`GMAIL_PASSKEY` actually being set in the environment (locally and on Vercel) to ever work — until that happens, every submission ends in the 503. It's also more code to keep correct (API route, Nodemailer, env vars, error states) for a single-purpose "let people reach me" feature.
- **Replace with `mailto:`:** zero configuration, zero server dependency, cannot silently rot if an env var expires or a Gmail app password gets revoked — it either works (visitor's mail client opens) or it doesn't (no mail client configured, which is rare and self-evidently the visitor's own environment issue, not this site's). Cost: worse UX on visitors without a configured desktop mail client (increasingly common), no in-page confirmation of anything, feels like a step down in polish for a site that's otherwise fully custom-built.

**Recommendation: keep the form**, on the condition that `EMAIL_ADDRESS`/`GMAIL_PASSKEY` actually get set soon — the code is already correct and honest, the only missing piece is two environment variables. A portfolio for a systems engineer benefits from the more capable, more finished-looking option when the only real cost is "set two secrets once," not an ongoing maintenance burden. But this is the user's call, not acted on.

---

# Polish Pass 2 — Metadata, Leftovers, Accessibility (2026-08-07)

## 1. Metadata audit

**Found and fixed — a real internal contradiction.** `app/layout.js`'s base `<meta name="description">` still had leftover template phrasing ("...a self taught developer. I love to learn new things and I am always open to collaborating with others. I am a quick learner...") while the *same file*'s `openGraph.description`/`twitter.description` had already been corrected to the resume-accurate version ("Space systems, robotics, autonomy, and engineering portfolio of Sujith."). Two different descriptions on the same page's own meta tags is a direct self-contradiction — search engines and any surface that reads the base tag instead of OG (not all link-unfurlers prefer OG) would have shown the generic version. Fixed by making `TITLE`/`DESCRIPTION` single constants reused across the base tag, OpenGraph, and Twitter card, so they can't drift apart again.

**Found and fixed — missing `metadataBase`.** `npx next build` warned about this directly (`metadataBase property in metadata export is not set... using "http://localhost:3000"`) — any relative social-image URL would have resolved against localhost in production. Set to `https://sujith-portfolio-eight.vercel.app` (via `NEXT_PUBLIC_APP_URL` with that literal as fallback), matching the resume's own portfolio link, `README.md`, and `SETUP.md`'s existing guidance for that env var — not a guess, cross-confirmed from three sources already in the repo. Warning is gone from the build output.

**Checked against `docs/CONTENT-AUDIT.md`:** title ("Portfolio of Sujith - Space Systems Engineer") already matched the audit's recommendation from a prior stage — confirmed still correct, left alone. Description now matches what's actually on the page (`personalData.description` in the About section) in spirit — both describe the same aerospace/robotics/systems-engineering positioning, no contradiction between meta and body copy.

**Favicon — found genuinely malformed, not just generic.** The existing `app/favicon.ico` was a non-square **26×32** cropped headshot photo. Non-square `.ico` files are unusual and risk being squeezed/distorted into whatever square slot a browser tab or bookmark bar reserves, and a tiny cropped face is hard to read as an icon at 16-32px regardless. Replaced with a proper multi-size (16/32/48px) square `.ico`: a monospace "S" monogram in `signal-500` on `ink-900` — same token pairing already verified at 12.74:1 in `docs/DESIGN-SYSTEM.md`'s contrast table, so no new contrast computation was needed. Also added `app/icon.png` (512×512) and `app/apple-icon.png` (180×180, for iOS home-screen) with the same monogram — neither existed before, so this was a real gap, not a redundant addition; Next's file-convention auto-links all three (confirmed via rendered `<head>`: `favicon.ico` 48×48, `icon.png` 512×512, `apple-touch-icon` 180×180).

**Manifest:** no `manifest.json`/`site.webmanifest` exists, and nothing in the rendered `<head>` references one — there's no broken link to fix, and a PWA manifest isn't something this build needs (not installable-app scope). Nothing to do here.

## 2. OG image — redesigned, no photography

**What was there:** `personalData.profile` (`/profile.png`, a personal headshot) declared as `1200×630` in the OG/Twitter metadata — but the actual file is `828×1006`, a portrait crop. The declared dimensions were simply wrong, and platforms that trust the declared size before fetching could crop or letterbox it unpredictably. It was also a personal photo doing a job description could do better: nothing about the image itself said "space systems engineer" or "aerospace/robotics."

**Built:** `app/opengraph-image.jsx` using `next/og`'s `ImageResponse` (confirmed available in this Next 16.0.10 install) — a token-based card at the correct `1200×630`: `ink-900` canvas, an `ink-500`-bordered frame, "SPACE SYSTEMS ENGINEER" eyebrow in `signal-500` IBM Plex Mono, "SUJITH" in 144px Roboto Slab bold, "Aerospace · Robotics · Autonomy" in `ink-300` mono — every color and both typefaces pulled directly from `docs/DESIGN-SYSTEM.md`, nothing new invented. No photography, no credentials beyond what's already the site's own title/positioning (no numbers, no claims). `app/twitter-image.jsx` re-exports the same module (Next's documented pattern for sharing one image between both cards) rather than duplicating the design.

**Font files:** `next/og`'s `ImageResponse` needs real font bytes, which `next/font`'s CSS-only output can't supply — vendored `RobotoSlab-Bold.ttf` and `IBMPlexMono-Medium.ttf` under `app/assets/fonts/og/` (same Apache-2.0/OFL-1.1 fonts already used elsewhere on the site, so no new license to track).

**Verified:** fetched the generated image directly — confirmed exactly `1200×630` (the standard size for Facebook/LinkedIn/Twitter's `summary_large_image` and every other major platform that reads `og:image:width`/`height`), rendered correctly with both fonts loading (checked visually, not just "didn't throw"). Old declared-but-wrong `1200×630`-claimed-828×1006-actual entry removed from `layout.js` in favor of Next's automatic file-convention wiring.

## 3. Remaining leftovers — grepped, fixed what's unambiguous, flagged what isn't

| Finding | File(s) | Action |
|---|---|---|
| Footer read `"© Developer Portfolio by [Sujith]"` | `app/components/footer.jsx` | **Fixed.** Now `"© {current year} [Sujith]"`. Template branding, unambiguous. |
| `package.json`/`package-lock.json` `"name": "developer-portfolio"` | `package.json`, `package-lock.json` | **Fixed.** Renamed to `"sujith-portfolio"` (`npm pkg set` + `npm install` to sync the lockfile). Private/unpublished field, invisible to visitors, but still worth naming correctly for anyone reading the repo. |
| Resume points to an external Google Drive link, not a same-origin PDF | `utils/data/personal-data.js:13` | **Flagged, not fixed** — this is `docs/BUILD-PLAN.md` Stage 2.1's already-known, already-documented open item: the source PDF contains three referees' full names, employers, and personal phone numbers, and stays gitignored/untracked until a redaction decision is made. Nothing changed here this pass; re-flagging per this task's instruction rather than silently leaving it unmentioned. |
| `said7388`/`developer-portfolio`/template-README references | `docs/ARCHITECTURE.md`, `docs/CONTENT-AUDIT.md`, `docs/PRD.md` | **Not fixed — intentionally historical.** These are dated audit documents recording what the repo *used to* say, which is the entire point of an audit trail (`docs/CONTENT-AUDIT.md`'s own format is "currently says" vs. "should say"). Scrubbing the old value out of the audit would make the audit lie about what it found. All of the *actual* template branding these docs describe has already been removed from the live site and source files (confirmed via the greps above — zero matches outside `docs/`). |
| `TODO:` placeholders in `utils/data/projects-data.js` (title/context/description/tools/hero alt, ×5 projects) | `utils/data/projects-data.js` | **Not a leftover — confirmed intentional**, per this task's own ground rule ("don't touch project content or invent anything"). These are deliberate, visible placeholders awaiting real content per `docs/ASSET-CHECKLIST.md`, not something left over from cleanup. |
| Blank `role` field on any project/experience/education entry | `utils/data/experience.js`, `utils/data/educations.js`, `utils/data/projects-data.js` | **Checked, none found.** Every `title`/`role`-equivalent field across all three data files is populated; the DSTA CubeSat blank-role note from an earlier `docs/BUILD-PLAN.md` entry no longer applies to the current data shape (that project moved out of `projects-data.js` entirely in the previous polish pass, into `educations.js`'s achievements, which has no `role` field at all). |

## 4. Accessibility — full pass, computed rather than eyeballed

**Alt text.** Grepped every `alt=` in the codebase (7 call sites, several repeated inside `.map()`s for 10 total rendered instances). All 6 decorative background/glow SVGs (`hero.svg`, `section.svg` ×2, `blur-23.svg` ×2, one of them rendered once per experience/education card) previously carried a copy-pasted `alt="Hero"` regardless of which section they actually sat behind or what they showed — nonsensical to a screen reader (e.g. announcing "Hero image" inside the Education section). Fixed to `alt=""` on all of them, explicitly marking them decorative rather than leaving a wrong description. The two informational images (`personalData.profile`, `alt="Sujith"`; each skill icon, `alt={skill}`) were already correct and left alone. Confirmed via rendered HTML after the fix: exactly 10 empty `alt=""` (matching the decorative count) plus the informational ones with real text.

**Heading hierarchy — the biggest finding of this pass.** Before this fix, the homepage had exactly **one** real heading element on the entire page (`<h1>` in the hero) — every other section title ("Experiences," "Skills," "Educations," "PROJECTS," "Contact with me," "Who I am?") was a `<span>` or `<p>` styled to *look* like a heading but not marked up as one. A screen-reader user navigating by heading (a primary navigation method — NVDA/VoiceOver's "jump to next heading" command) would hit the hero and then find nothing else on the page. Separately, `/projects/[slug]` — a standalone route — had **no `<h1>` at all**, jumping straight to `<h2>` for the project name.

Fixed by converting every section-title element to a real heading, building a single-`<h1>`-per-page outline:
- Homepage: `<h1>` (hero) → `<h2>` per section (About/Experience/Skills/Projects/Education/Contact) → `<h3>` per subsection (each experience/education entry, each skill category, each individual project title within the Projects section).
- `/projects/[slug]`: made `ProjectHeader` accept a `headingLevel` prop (`h1` on the standalone detail route, `h3` when the same component is reused inline on the homepage under the Projects section's own `h2`) rather than duplicating the component — one shared header, two correct outlines depending on where it's mounted. Gallery category titles ("Design & CAD," "Simulation & Analysis," etc.) dropped from `h3` to `h2` to nest correctly under the page's new `h1`.
- The two decorative rotated sidebar labels ("ABOUT ME," "CONTACT" — desktop-only, `hidden` below `lg`) were left as non-heading `<span>`s and marked `aria-hidden="true"`, since they now visually duplicate the real, always-visible `<h2>` in the same section; a screen reader has no reason to announce the same section title twice, especially one written sideways.

Verified via curl'd SSR HTML on both `/` and a `/projects/[slug]` route: exactly one `h1` per page, no skipped levels, correct nesting in DOM order.

**Visible focus states — found and fixed a real gap, not a stylistic one.** Grepped every `outline-none`/`outline-0`/`ring-0` in the component tree: all 5 top nav links (`outline-none`, with only a `hover:` color change — no `focus:`/`focus-visible:` state at all) and all 3 contact-form fields (`ring-0 outline-0`, with only `focus:border-accent`, a single-pixel color change as the sole indicator). Tabbing through the nav previously gave **zero visible indication of position** — a genuine keyboard-navigation failure, not a nice-to-have. Fixed with `focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` on the nav (and every other icon-only link — GitHub/LinkedIn in the hero and contact section, the scroll-to-top button, the nav's own logo link) and `focus:outline` (not `focus-visible:`, since a ring on mouse-click is normal/expected UX for form fields) on the three inputs, layered on top of the existing border-color change rather than replacing it. Every other button/link in the codebase (CTA pills, "View full project," "Go to Home") never had its outline stripped in the first place and was already relying on the browser's default visible focus ring — confirmed by grep (no `outline-none` present on them), left untouched.

**Keyboard navigation through the nav — found a second, more serious bug while checking the first.** The mobile nav (`<ul id="navbar-default">`, everything below the `md` breakpoint) was permanently `max-h-0 opacity-0` with **no button anywhere in the codebase that ever changed that state** — confirmed by grepping for any hamburger/toggle/menu control referencing `navbar-default`; there was none. This means on any narrow viewport, all five nav links were not just visually hidden but structurally unreachable by any means — no mouse click target existed to reveal them, and (since `opacity-0` doesn't remove focusability) a keyboard user tabbing through would land on invisible links with no indication of where they were. This predates this session entirely; nothing in the last several stages touched `navbar.jsx`'s interactivity. Fixed: converted `navbar.jsx` to a client component with a real `useState` toggle, added a visible (`md:hidden`) hamburger button with `aria-expanded`/`aria-controls`/`aria-label`, wired the `<ul>`'s open/closed classes to that state (adding `overflow-hidden` too, which was also missing — without it, `max-h-0` alone doesn't reliably clip overflowing `<li>` content), and close the menu on link click. Verified via rendered HTML: `aria-expanded="false"` present on load, `overflow-hidden` now in the class list.

**Full keyboard navigation through project links.** `ProjectShowcase`'s "View full project" link and `ProjectDetailView`'s "Back to portfolio" link both already carry visible text alongside their icons (not icon-only) and never had their outline stripped — already keyboard-operable with a visible focus ring, confirmed by absence from the `outline-none` grep. No change needed.

**Form labels — found and fixed a missing association.** The three contact-form `<label>` elements had no `htmlFor`, and their `<input>`/`<textarea>` had no matching `id` — visually adjacent but not programmatically linked, so a screen reader wouldn't announce "Your Name" when the name field received focus, and clicking the label text wouldn't focus the field. Added matching `id`/`htmlFor` pairs (`contact-name`, `contact-email`, `contact-message`). Also added `aria-invalid`/`aria-describedby` on the email field so its validation message is programmatically associated, and `role="alert"` on the "all fields required" message so it's announced when it appears. Fixed a real typo found in the same message while touching this file: "All fiels are required!" → "All fields are required!".

**Contrast — checked against the existing table, nothing new to compute.** Every color pairing touched or added this pass (favicon monogram, OG image text, Skills category headings, new focus-ring color, footer text) reuses token combinations already verified in `docs/DESIGN-SYSTEM.md`'s WCAG table (`signal-500` on `ink-900` = 12.74:1, `ink-300`/`ink-100` on `ink-900` = 8.28:1/15.35:1, etc.) — no genuinely new pairing was introduced, so there was nothing left to eyeball or compute independently.

**GlowCard's mouse-tracked effect** (flagged in `docs/DESIGN-SYSTEM.md` as a Stage 7.2 checkpoint item): confirmed it's purely decorative ambient hover styling on non-focusable container `<article>` elements — it doesn't gate any functionality behind hover, and the `:focus-visible` CSS selector already present in `card.scss` targets a non-focusable element (inert for keyboard purposes, harmless). No keyboard-equivalent is owed here because there's nothing exclusive to reach; the actual interactive content inside each card (links, text) already has its own independent focus handling, unaffected by whether the glow renders.
