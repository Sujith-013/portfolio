# PRD — Portfolio Landing Page Redesign

## 1. Goals

- **The five projects are the primary deliverable of this site.** (Revised 2026-08-05 — see §9.) Hero, About, Skills, Education, and Contact are supporting material that establishes credibility and gets a reader to the projects; they are not the point. A visitor should leave knowing specifically what's been built and how well it was built, not just who the subject is. Every other section's job is to earn 20 more seconds of attention that gets spent in the project showcase.
- Replace a generic, template-derived "developer portfolio" (currently mismatched: web-dev skill list, fake terminal snippet, Software-Developer designation) with a site that reads as deliberately designed and represents the subject's actual field — space systems / aerospace / robotics engineering — accurately and specifically.
- Survive a 20-second look from a recruiter, a professor, or an admissions committee: the hero and first scroll must communicate *who this is and what they've actually built*, not generic developer-portfolio signifiers.
- Stay fast. This is a portfolio, not a showreel — Lighthouse performance is a hard constraint, not an aspiration. This matters more, not less, once real CAD renders and simulation screenshots are the centerpiece — see §10's performance budget.
- Motion serves comprehension (sequencing, causality, hierarchy) — it is not decoration layered on afterward.

## 2. Audience

Three named readers, all time-constrained and skimming, not reading:
1. **Recruiters / hiring managers** at aerospace, robotics, and defense-adjacent companies — scanning for role fit, seniority signals ("AI Lead," "1st Place"), and named technologies they recognize (YOLOv8, ROS 2, ANSYS).
2. **Professors / admissions committees** (TU Berlin MSc context, or future PhD applications) — scanning for research substance, publication (IEPC 2025), and evidence of independent technical ownership (SEDS co-founder, Project New Dawn).
3. **Peers / collaborators** (RobotX teams, SEDS network, aerospace clubs) — scanning for depth and credibility, more forgiving of technical density, more likely to click through to a GitHub repo or paper.

All three need the same first 20 seconds; they diverge only in what they click next.

## 3. Content inventory — mapped to files

Every rewrite target, cross-referenced against `docs/CONTENT-AUDIT.md` (full current/resume/should-be detail lives there — not repeated here):

| File | Action required |
|---|---|
| `utils/data/personal-data.js` | Fix `designation` ("Software Developer" → space systems engineer / equivalent, to match `layout.js` which is already correct). Decide on `address` (currently a real Singapore street address — recommend removing or replacing with just "Singapore"). Decide on `phone` exposure. Repoint `resume` at a same-origin `/resume.pdf`. Fill or remove empty social fields (`facebook`, `twitter`, `stackOverflow`, `leetcode`). |
| `utils/data/experience.js` | Fix the swapped `title`/`company` fields on the SEDS entry. Add a bullets/achievements field (doesn't exist today) and populate every entry from the resume's actual bullet content. Decide on chronological ordering (recommend reverse-chronological, current role first). |
| `utils/data/educations.js` | Add an achievements/context field for NTU (DSTA CubeSat win, OCEP Vietnam project, STEM outreach) — currently bare title/duration/institution with no room for this. Add an "incoming" state distinction for TU Berlin so it doesn't read as already underway. |
| `utils/data/projects-data.js` | **Superseded 2026-08-06 — see §9.5.** Originally replaced the five unverified coursework projects with resume-verified professional work (DSTA CubeSat, Project New Dawn, RobotX, Aliena PMA, Space Copy ISRU) in Stage 1.6. That professional work now lives permanently in `experience.js`/`educations.js` instead (every quantified result preserved there) — the landing-page Projects section itself was redirected to feature five personal/passion projects (Aircraft Design, CubeSats and Satellites, Drone and UAV, Rocket Design Technology, Rover), which are **not** resume-verified and currently hold TODO placeholders pending real content from the subject. |
| `utils/data/skills.js` | Replace the entire web-dev list (HTML/CSS/React/Mongo/MySQL/AWS/etc.) with the resume's actual stack, grouped by category (languages & ML, robotics & sim, CAD & FEA, embedded/hardware, tooling) rather than one flat marquee. Delete the trailing ~80-line "AVAILABLE SKILLS" template comment block. Audit `utils/skill-image.js` for icon coverage — most aerospace/robotics tools (ROS, SolidWorks, ANSYS, MuJoCo) will have no icon in whatever icon set is wired up; decide on text-tag fallback vs. a small custom icon set. |
| Hero section hardcoded skill list (`app/components/homepage/hero-section/index.jsx`) | Currently hand-typed (React/MySQL/MongoDB/Docker/AWS), not data-driven — needs its own edit regardless of `skills.js`, ideally refactored to import from a shared skills source so the two can't drift apart again. |
| `app/layout.js` `<metadata>` | Already correct and resume-aligned (title says "Space Systems Engineer") — leave as the reference truth other files should be reconciled toward. Optionally sharpen description with one concrete proof point (RobotX 2024, DSTA CubeSat win) instead of staying at category level. |
| `utils/data/contactsData.js` | Confirmed dead code (defined, never imported) per architecture audit — delete rather than reconcile. |

## 4. Section-by-section spec

Current homepage order (`app/page.js`): HeroSection → AboutSection → Experience → Skills → Projects → Education → Blog → ContactSection.

1. **Hero** — the thesis of the page. Must state, in the first viewport: name, current standing (final-year NTU aerospace engineering, incoming TU Berlin MSc), and one concrete, specific proof point — not a category label. "Space Systems Engineer" as a title is accurate but generic against three internships and a competition win; the hero copy should carry one fact a reader can't get from the job title alone (e.g. RobotX 2024 global 2nd-place qualification, or the DSTA CubeSat win). Whatever hardcoded skill list currently sits in the fake terminal block must be removed or rebuilt from real, current content.
2. **About** — the positioning statement this resume doesn't supply (see CONTENT-AUDIT §3.1): what connects maritime autonomy, ISRU thermal engineering, propulsion micro-fluidics, and CubeSat ADCS work. This is prose you'll need to write; it's the single most important paragraph on the page, and it's exactly what the resume's "Job Related Abilities" narrative gestures at without ever saying plainly.
3. **Experience** — reverse-chronological, each entry carrying 2-3 concrete bullets (currently zero bullets exist in the data file — see §3). This section is where the resume's actual density belongs; don't compress it back down to title/company/dates only.
4. **Skills** — grouped by category, matching the resume's own groupings (languages/ML, robotics/sim, CAD/FEA, embedded/hardware, tooling) rather than a single alphabetical marquee. No web-dev-stack leftovers.
5. **Projects** — the site's centerpiece, not a card in a scroll. Full format, routing decision, and asset pipeline specified in §9 and §10 (revised 2026-08-05 — this used to be a one-line bullet assuming a generic card grid). **Revised again 2026-08-06 (see §9.5):** the five landing-page projects are personal/passion work (Aircraft Design, CubeSats and Satellites, Drone and UAV, Rocket Design Technology, Rover), not the resume-verified professional work originally slotted in here — that work (RobotX, Aliena PMA, Space Copy ISRU, Project New Dawn, DSTA CubeSat) stayed on the site but moved permanently to Experience/Education, where every quantified result already lived independently. The format/routing/pipeline decisions in §9-10 don't depend on which five projects are featured, so they're unchanged by this — only `utils/data/projects-data.js`'s actual content changed.
6. **Education** — NTU + TU Berlin, with room for the achievement context (CubeSat win, OCEP Vietnam, STEM outreach) that currently has nowhere to live in the data shape.
7. **Blog** (dev.to integration) — no resume basis for a public-writing habit. Decision needed: keep as-is, replace with a static "writing/talks" placeholder (IEPC presentation could live here instead), or remove the section and route entirely. Flagging as an open decision, not deciding it here.
8. **Contact** — currently non-functional (see punch list in ARCHITECTURE.md: missing Telegram bot env vars). Fix or simplify before shipping; a broken contact form undermines "technically credible" faster than almost anything else on the page.

## 5. Motion spec

**Point of view:** motion exists to sequence information the reader would otherwise have to find by scrolling and re-reading — entrance ordering that mirrors reading order, scroll-linked reveals that arrive exactly when a section enters view, and state changes (hover, focus) that confirm interactivity. It does not exist to demonstrate that animation was used.

**What animates:**
- Section entrances, once, on first scroll into view (not on every re-scroll past) — staggered slightly so headline → supporting text → proof point arrive in reading order, not simultaneously.
- The hero's proof point / concrete fact — one deliberate emphasis moment, not a looping effect.
- Card hover/focus states in Experience/Projects — subtle elevation or border-glow confirming interactivity, already partially present via the existing `GlowCard`/`card.scss` mouse-tracked glow effect; keep that pattern rather than replacing it wholesale, since it's one of the few things in this codebase that isn't template-generic.
- Skill-category reveals — deliberate, ordered, not an infinite marquee (the current `react-fast-marquee` implementation is a template default that undercuts "restrained" — a marquee scrolling generic skill icons forever reads as decorative, not informational).

**What explicitly does not animate:**
- Body text reflow or paragraph-level content — nothing about reading the About/Experience prose should move once it's rendered.
- Anything that would delay Largest Contentful Paint — the hero's name/title/proof-point must be visible and stable on first paint, not animated in from an invisible state that risks a flash-of-unstyled-content if JS loads late (see RESOURCE-AUDIT.md SSR/hydration note: set the pre-animation state in CSS, not JS, for exactly this reason).
- Decorative background motion (particle fields, floating shapes) with no informational role — if used at all, must be `prefers-reduced-motion`-gated and justified against the subject matter, not added as ambient texture.
- Repeated/looping attention-grabbers (infinite marquees, continuous pulsing) — one-shot and scroll-triggered only, matching the "GSAP `matchMedia()` for `prefers-reduced-motion`" pattern documented in the installed `gsap-core` skill.

**Library:** GSAP, per RESOURCE-AUDIT.md §"Bundle size / animation library head-to-head" — first-party React hook (`useGSAP`, covered by installed `gsap-react` skill), no licensing caveat, timeline model fits "one coordinated reveal per section" better than isolated per-component transitions. ScrollTrigger (installed `gsap-scrolltrigger` skill) drives the scroll-linked reveals specifically.

## 6. Accessibility requirements

- `prefers-reduced-motion` respected globally — every GSAP timeline gated via `gsap.matchMedia()`, not a single top-level check; reduced-motion users get the same content, instantly, no exceptions per section.
- All existing empty/generic `alt` text fixed (per ARCHITECTURE.md: `blog-card.jsx` and others use empty/generic alt, decorative SVGs use `alt="Hero"` regardless of actual content) — decorative images get `alt=""`, informational images get specific descriptions.
- Contact form (once fixed) needs proper label associations and error messaging, not just placeholder text as the only label.
- Color contrast: the current hardcoded `#16f2b3` accent against dark backgrounds needs a contrast check once centralized into the Tailwind 4 `@theme` palette — don't just relocate the same hex value into a token without verifying it against WCAG AA for text use, not just as a decorative accent.
- Keyboard navigation and visible focus states on every interactive element (skill tags, project cards, nav links) — currently unverified; decorative hover-only affordances (like the mouse-tracked glow card) must have a keyboard-accessible equivalent state.

## 7. Performance budget

- Lighthouse Performance ≥ 90 on mobile (not just desktop) — this is a portfolio, judged in part by whether it demonstrates the engineering rigor the subject claims elsewhere on the page.
- No new animation library beyond the one chosen (GSAP) — Phase 2 explicitly ruled out running two animation libraries at once; if a copied component (from React Bits, Aceternity, etc.) drags in Motion or three.js as an unrelated dependency, replace its animation with a GSAP-driven equivalent rather than shipping both libraries.
- Images: `next/image` throughout (already used per architecture summary), real photos/renders sized and compressed appropriately — current template stock photos in `public/image/` (ayla.jpg, crefin.jpg, real-estate.jpg, travel.jpg, portfolio.gif) must be deleted once replaced, not left as unreferenced dead weight in the repo.
- Fonts: keep the existing `next/font` Google Inter loading strategy (self-hosted, no render-blocking external font request) unless the typography direction chosen in §8 requires a second display face — if so, apply the same `next/font` self-hosting discipline to it.
- No render-blocking third-party scripts beyond the existing GTM tag — do not add a component library's CDN script tag; every library adopted here is either copy-paste source (no runtime dependency beyond what you already bundle) or a small npm install (GSAP).

## 8. Design direction options

Three directions, each grounded in the resume's actual field rather than a generic "developer portfolio" aesthetic. All three assume the content fixes in §3 have landed first — none of them fix bad content with good visual design.

### Direction A — "Flight documentation" (recommended)

**Rationale:** The subject's actual work product — FLATSAT test logs, FEA modal analysis, systems-engineering V-model trade studies, IEPC paper — is technical documentation, not consumer software. Lean into that directly: a typographic, document-like hero (large serif or slab display face for the name/title, monospace for technical labels/specs — dates, tool names, quantified results treated as data, not prose), a restrained near-monochrome palette with a single accent color reserved for one thing only (the proof-point number, or active nav state), and a layout with generous margins and a visible grid, closer to a technical spec sheet or a mission-patch design than a SaaS landing page.

**Cost:** Medium. Requires a genuine typographic system (one display face + one monospace, both self-hosted via `next/font`) and a centralized Tailwind 4 `@theme` palette (straightforward, no legacy config to migrate away from per RESOURCE-AUDIT.md). No dependency on any of the triaged component libraries — the visual language (spec-sheet layout, data-as-typography) is closer to what `getdesign.md`'s methodology models than to anything Aceternity/Magic UI/KokonutUI ship, so this is mostly hand-built: a few custom components (a "spec row" for quantified results, a monospace label component) rather than copied ones. GSAP ScrollTrigger drives section reveals; no need for React Bits/Aceternity primitives at all. This is the cheapest direction to keep *restrained* because it has the fewest moving parts to keep consistent.

### Direction B — "Systems trace" (motion-forward alternative)

**Rationale:** Leans into the multidisciplinary breadth explicitly — the About section's positioning statement is expressed visually as a connecting line/thread that the scroll position traces through the different domains (maritime autonomy → ISRU thermal → propulsion → CubeSat), turning the "why does one person span all these fields" question into a literal, scroll-driven path rather than only a paragraph. Best fit for a reader who scans visually before reading (a recruiter skimming, not reading closely).

**Cost:** High. This is the direction most dependent on GSAP ScrollTrigger doing real work (pinned sections, scrubbed path animation tied to scroll position) — the installed `gsap-scrolltrigger` skill covers the technique, but building and tuning a scroll-scrubbed path that feels controlled rather than gimmicky takes real iteration time, and it's the direction most at risk of drifting from "motion serves comprehension" into "motion as demonstration" if not held to a tight standard. A component or two from React Bits' scroll-linked category (Tailwind 4-native, GSAP-dependency-compatible) could seed this rather than building the scroll-choreography from zero, but the connecting-path concept itself is bespoke regardless.

### Direction C — "Instrument panel" (data-density alternative)

**Rationale:** Treats the Skills/Experience/Projects sections like a cockpit or telemetry-dashboard readout — quantified results (>95% Mission Assurance, 400% pointing agility, 30% attenuation) rendered as small stat displays with sparklines/dials rather than prose sentences, monospace numerals, high information density per viewport. Fits a reader who wants to extract facts fast (recruiter) at some cost to the narrative/prose reader (admissions committee) who wants context, not just numbers.

**Cost:** Medium-high. The stat-tile/data-density visual language is exactly what the installed `dataviz` skill and `ui-ux-pro-max`'s chart-type database are built for — worth invoking directly if this direction is chosen, rather than hand-designing stat tiles from scratch. Risk: quantified stats without the surrounding sentence of context (what was measured, why it mattered) can read as unverifiable numbers-for-their-own-sake to a skeptical reader — this direction needs restraint to avoid overclaiming precision the underlying work doesn't really carry (a "+15% mission survivability margin" reads very differently with one sentence of DIANA-project context next to it than as a bare stat tile).

**Recommendation: Direction A.** It's the cheapest to build, the least dependent on any external library or motion complexity, and the most literally honest to the subject matter — a systems engineer's actual work artifacts (spec sheets, trade studies, test reports) are typographic and document-like, not dashboard-like or narrative-thread-like. It also fails safest: if the motion work runs out of time or budget, a well-typeset, well-gridded static version of Direction A still reads as intentional. Direction B or C failing halfway looks unfinished by comparison.

## 9. Project showcase specification (added 2026-08-05)

**Why this exists:** the site was originally scoped as a standard portfolio landing page with a projects *section* among several equal sections. That's no longer accurate. The subject has substantial real visual assets per project — SolidWorks CAD models and renders, thermal/FEA/CFD simulation screenshots, plots, results figures, "lots per project, at full resolution" — and the explicit goal is now that a visitor leaves knowing what was built and how well, which only the projects can actually demonstrate. This section specifies how they're presented; §10 specifies how the assets that make that possible get into the repo.

### 9.1 Format options considered

**Option 1 — Full dossier sections inline on the landing page, no separate route.**
Each project becomes a full-width section in the main scroll (replacing the current 5-card sticky stack): numbered eyebrow ("PROJECT 01"), title, spec row (role · organization · result), one large hero image, full narrative, a curated strip of 3-5 supporting images, tools tag row — all inline, nothing hidden.
*Pros:* one continuous read, no navigation away, simplest mental model, most literally "spec sheet as a flat document."
*Cons:* five projects × (hero + 3-5 supporting images) means 20-30 real images all eventually loading on one page — directly at odds with "full resolution" and the performance budget; no per-project shareable URL, which matters for the "peers/collaborators… more likely to click through" audience segment in §2; the page becomes very long, which works against "survive a 20-second look" for the sections that still need to earn attention before a reader gets deep into project 4 or 5.

**Option 2 — Curated section inline + dedicated detail route per project.**
Landing page shows one large hero image (not a thumbnail) + spec row + short narrative + a "View full project" link per project, in a full section each. A dedicated `/projects/[slug]` route holds the complete dossier: full narrative, complete captioned asset gallery grouped by type (Design & CAD / Simulation & Analysis / Results & Data), possibly prev/next project navigation.
*Pros:* satisfies "large scale, not a thumbnail" on the landing page (one real hero image per project, shown big) *and* "lots of assets, full resolution" without penalizing landing-page load (the gallery only loads when a reader opts in); gives every project a real, shareable, deep-linkable URL — the single best fit for a recruiter forwarding one project to a colleague, or a peer wanting to link a specific build; keeps the landing page's total image payload bounded and known (exactly 5 hero images) regardless of how many supporting assets exist per project; architecturally cheap in Next.js App Router (`generateStaticParams` on a `[slug]` route, statically generated at build time, no server cost at runtime).
*Cons:* more implementation surface (new route, per-project metadata/OG tags, a shared detail-page template); a second page pattern to keep visually consistent with the landing page (mitigated — the token system in `docs/DESIGN-SYSTEM.md` applies identically to any route, this isn't a new design system, just a new template).

**Option 3 — Compact grid with click-to-expand (accordion or modal) on the landing page only.**
Five small tiles (thumbnail + title + one-line result); clicking a tile expands it in place or opens a modal with the full dossier.
*Pros:* landing page stays compact and scannable at a glance; asset loading can be deferred until expansion.
*Cons:* directly contradicts the explicit brief — the *first* view of every project is a thumbnail, which is exactly what "presented at a scale that lets someone actually see the engineering rather than a thumbnail" rules out; modal/accordion-reveal galleries are the generic-SaaS-template affect Direction A is deliberately avoiding; no shareable URL without adding hash/query routing back in, which erases the simplicity that was this option's only advantage.

### 9.2 Recommendation: Option 2

It's the only option that satisfies both explicit, non-negotiable requirements at once — large-scale visibility on the landing page, and complete full-resolution asset sets — without trading off the performance budget or Direction A's document-like restraint. It's also the most consistent with "the five projects are the point of this site": they get real, addressable, first-class pages of their own, not a component nested inside a longer scroll competing for attention with Skills and Education.

### 9.3 Anatomy

**Landing-page showcase section** (one per project, in place of the current sticky-card stack — this is now the largest, most visually weighted section on the page, more than Experience or Education):
- Eyebrow label: sequence designation, e.g. `PROJECT 01` (`font-mono`, matches the "flight documentation" numbered-drawing convention).
- Title: `nameFull` (`font-display`), large.
- Context row (`font-mono`): what kind of project it is and roughly when — for the personal projects actually in `projectsData` as of 2026-08-06 (see §9.5), there's no employer/role to cross-reference the way the original resume-verified lineup would have had, so this is a `context` field the subject supplies directly (not invented, not cross-referenced) rather than a "Role · Organization" pairing.
- The result, one line, `text-accent` — this is a legitimate accent use under `docs/DESIGN-SYSTEM.md`'s reserved-role rule (quantified proof-point data), *only if a real one exists* — e.g. a competition placement or a measured outcome. Optional per project; the component omits the line entirely rather than showing a placeholder in accent color, since an empty accent-styled "fact" would misrepresent the rule's whole point.
- One large hero image, real scale (not a thumbnail) — the artifact itself is the evidence.
- Full narrative (the prose already written in `projects-data.js`, unchanged).
- Tools tag row (`font-mono`, existing `tools` array).
- "View full project →" link to `/projects/[slug]`.

**Detail page** (`/projects/[slug]`):
- Same header block (title, spec row, result).
- Full narrative.
- Captioned asset gallery, grouped by category (Design & CAD / Simulation & Analysis / Results & Data — see §10 for the manifest shape that drives this).
- Back-to-portfolio link; optional prev/next project navigation.

### 9.4 What this does not change (as of 2026-08-05)

The five projects' `name`/`nameFull`/`description`/`tools`/`role` values in `projects-data.js` were resume-sourced and correct as of Stage 1.6 — this section was presentation only at the time it was written. See §9.5 for what changed the following day.

### 9.5 Revision 2026-08-06 — the featured projects changed, the format didn't

The five projects actually in `projectsData` are now personal/passion work, not the resume-verified professional projects this section originally described: **Aircraft Design, CubeSats and Satellites, Drone and Unmanned Aerial Vehicles, Rocket Design Technology, Rover**. The professional work (RobotX perception stack, Aliena PMA, Space Copy ISRU, Project New Dawn, DSTA CubeSat) did **not** leave the site — every quantified result it carried (RobotX's 2nd-place qualification and 95% mission assurance, the IEPC 2025 paper, DSTA's 1st place and 400% pointing agility improvement, and the rest) already lived independently in `utils/data/experience.js`'s bullets and `utils/data/educations.js`'s achievements since Stage 1, so nothing was lost by narrowing what Projects itself features.

**Why personal projects instead:** the subject's call, not a technical constraint — the resume-verified work is professional/confidential-adjacent in a way that makes it awkward to also showcase in full visual detail (client hardware, employer IP), where the personal projects are the subject's own to document freely, in depth, with real CAD/simulation/video assets.

**What this changes in §9.1-9.4 above:** nothing about the *format* — the Option 2 recommendation, the landing-section-plus-detail-route anatomy, and the "don't invent content" discipline all apply identically regardless of which five projects fill them. What changed is narrower and more concrete:
- The `role`/`organization` framing in §9.3's spec row doesn't fit personal projects (there's no employer to name) — replaced by a single `context` field (project type + rough timeframe), supplied directly by the subject, not cross-referenced from anywhere.
- None of these five projects have verified content yet. `docs/CONTENT-AUDIT.md` and the resume don't cover them at all, so `nameFull`, `context`, `description`, `tools`, and `result` are placeholder TODOs in the data file until the subject supplies them — see `docs/ASSET-CHECKLIST.md` for exactly what's needed per project, kept to the minimum that makes the format work.
- The landing page and detail routes were built with the TODO placeholders and grey dimensioned asset boxes in place (`app/components/helper/asset-placeholder.jsx`) specifically so the format itself can be judged live, scrolled, and approved *before* any real asset export happens — exporting the wrong aspect ratio five times over was the thing being avoided.

## 10. Asset pipeline specification (added 2026-08-05, extended 2026-08-06 for video)

Governs everything under `public/projects/` and how components consume it. Written so Stage 6 (asset population) is mechanical once assets exist, and so the subject can add them incrementally without needing this re-explained per project — see the literal step-by-step version in `docs/ASSET-CHECKLIST.md`.

### 10.1 Directory structure

```
public/projects/
  aircraft-design/
    hero.jpg
    cad-01.jpg
    sim-01.jpg
    results-01.jpg
    video-01.mp4
    video-01-poster.jpg
    ...
  cubesats-and-satellites/
    hero.jpg
    ...
  drone-and-unmanned-aerial-vehicles/
    hero.jpg
    ...
  rocket-design-technology/
    hero.jpg
    ...
  rover/
    hero.jpg
    ...
```

One directory per project, named by `slug` (kebab-case, matching each `projectsData` entry's `slug` field — already assigned: `aircraft-design`, `cubesats-and-satellites`, `drone-and-unmanned-aerial-vehicles`, `rocket-design-technology`, `rover`). Every project directory has exactly one `hero.jpg` (the landing-page image); every other file is a detail-page gallery asset, named by category prefix + index: `cad-01.jpg`, `cad-02.jpg`, `sim-01.jpg`, `results-01.jpg`, `video-01.mp4` (+ matching `video-01-poster.jpg`, see §10.5). The prefix (`cad` / `sim` / `results` / `video`) is also the category the manifest groups it under — see 10.3. `code` is the one category with no file at all — see 10.3's note on inline code snippets.

### 10.2 Export formats and resolutions

Next.js's built-in image optimizer re-encodes to AVIF/WebP at request time regardless of source format (already enabled by default — `next.config.js`'s `images` block only configures `remotePatterns`, no format restriction), so the source format matters less than source *size*: an unnecessarily huge source file still costs disk/repo space and optimizer CPU time even though the browser never receives it raw.

| Asset type | Source format | Max long-edge resolution | Target source file size |
|---|---|---|---|
| Hero image (1 per project) | JPEG, quality ~90 (or PNG if the render has transparency) | 2400px | ≤ 2MB |
| CAD/design renders (gallery) | JPEG, quality ~85-90 | 1600px | ≤ 1.5MB |
| Simulation screenshots (CFD/FEA/thermal) | PNG (contour plots compress better lossless) | 1600px, cropped to the plot/chart itself — not the whole application window with toolbars | ≤ 1.5MB |
| Results plots/figures | PNG or JPEG depending on source tool | 1600px | ≤ 1MB |

**SolidWorks-specific guidance:** export PhotoView 360 / SOLIDWORKS Visualize renders at 1920×1080 or 2400×1350 (16:9), JPEG quality 90. Don't export at the tool's maximum native resolution (often 4K+) — nothing on the web renders it and it only bloats the repo.

**Simulation tool screenshots:** crop tightly to the contour plot / chart area before exporting — cut the surrounding application chrome (menus, toolbars, panel borders). A tightly-cropped 1200×900 plot reads better at display size than an uncropped 2560×1440 screenshot of the whole window shrunk down.

These are source-file targets (what lands in the repo before Next's optimizer touches it), not what a browser downloads — see 10.4 for the served-size budget.

### 10.3 Manifest, not static imports

Each `projectsData` entry gains an `assets` array (in `utils/data/projects-data.js`, or a separate `utils/data/project-assets.js` if that keeps the main file more readable — implementer's call):

```js
{
  slug: 'aircraft-design',
  hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO' },
  assets: [
    { file: 'cad-01.jpg', category: 'cad', width: 1600, height: 1200, caption: 'TODO' },
    { file: 'sim-01.jpg', category: 'simulation', width: 1600, height: 900, caption: 'TODO' },
    { file: 'results-01.jpg', category: 'results', width: 1600, height: 900, caption: 'TODO' },
    {
      file: 'video-01.mp4',
      category: 'video',
      width: 1920,
      height: 1080,
      poster: 'video-01-poster.jpg',
      caption: 'TODO',
    },
    {
      category: 'code',
      language: 'python',
      snippet: 'TODO — inline text, not a file (see 10.3)',
      caption: 'TODO',
    },
  ],
}
```

`width`/`height` per asset drive the placeholder's aspect ratio during the placeholder-first build (see §9.5) and, once real files land, the fixed-aspect-ratio convention `next/image` needs in place of automatic inference (see the static-imports tradeoff above). `video` entries carry a `poster` (a still-frame JPEG, same size/format discipline as other images — see §10.5) instead of `alt`. `code` entries have no `file` at all — the snippet is inline text in the manifest, not a binary asset (see below).

**Why a manifest instead of static ES-module imports per image:** the subject is adding assets incrementally, one project at a time, over an unknown timeframe. Static imports (`import cad01 from '@/public/...'`) require editing component/import code for every new file — high-friction for what's fundamentally a content-entry task, and easy to forget to wire up. A manifest is a data edit, consistent with how every other content file in this repo already works (`utils/data/*.js`, hand-edited). `next/image` optimizes any image it's given identically whether the source is a static import or a plain `/public/` path string — static imports mainly buy automatic width/height inference, which this pipeline replaces with the fixed-aspect-ratio convention in 10.4 instead (worth the small tradeoff for the much lower content-entry friction).

**Captions and alt text:** every manifest entry needs a `caption` (shown under the image on the detail page — what it depicts, in the same plain-language register as the project narratives, e.g. "CFD streamline plot around the regolith melt-pool, showing recirculation at the boundary") and an `alt` (accessibility text, can be shorter/more literal than the caption). Neither should claim a specific number or result not already verified in `docs/CONTENT-AUDIT.md` — a caption describes what an image *shows*, it doesn't introduce new claims. Whoever writes captions (subject or assistant, working from the subject's own description of what each image depicts) should treat this the same as any other factual content in this repo.

**Code snippets (added 2026-08-06):** some of these projects have real code worth showing — this is a fifth manifest category (`cad` / `simulation` / `results` / `video` / `code`), but unlike the other four it's not a binary file in `public/projects/<slug>/` at all. A `code`-category manifest entry carries the snippet as inline text (`snippet` + a `language` string for syntax-highlighting hints) plus a `caption` explaining what it does. This keeps source code out of the image pipeline entirely (no export/compression/resolution questions apply to text) and — per the brief — a code block is one gallery element the detail page renders among photos/video/results, never the frame the whole project sits inside the way the old fake-terminal card was. If a project's code lives in a public repo, a link is a reasonable alternative/addition to an inline snippet; that's a `codeUrl` field on the same entry, not a separate category.

### 10.4 Performance budget

Direction A's Lighthouse ≥ 90 mobile constraint (§7) gets harder, not easier, once ~5-40 real high-resolution engineering images are in play. Explicit budget:

- **Per-image served-size target:** hero images ≤ 400KB, gallery images ≤ 250KB, *after* Next's optimizer processes them (not the source file size in 10.2, which is larger and never reaches the browser).
- **Homepage total image budget:** exactly 5 hero images (one per project section), all below-the-fold relative to the hero/about/experience/skills sections that precede Projects in scroll order, so none should be marked `priority` — they lazy-load by `next/image` default. Target ceiling: 5 × 400KB = 2MB total for project imagery reachable by scrolling the full homepage, on top of whatever the rest of the page already weighs.
- **Detail pages:** no homepage-wide ceiling applies (a reader has opted into the deep-dive), but the same per-image budget holds, and only the first-viewport image(s) skip lazy-loading.
- **`sizes` prop discipline:** every `next/image` usage in this pipeline sets a real `sizes` attribute tuned to actual rendered width per breakpoint — never left at the 100vw default, which would make mobile download desktop-resolution images.
- **Format negotiation:** already on by default (see 10.2) — AVIF/WebP served automatically per browser support, no config needed, but worth re-verifying in Stage 8's Lighthouse run that this is actually happening (check `Content-Type` in the Network tab) rather than assumed.

### 10.5 Video assets (added 2026-08-06)

Video is new territory for this pipeline — §10.2-10.4 above were written for images, where `next/image` provides a safety net (automatic re-encoding, format negotiation, lazy-loading) regardless of what the subject exports. **Next.js has no equivalent built-in optimizer for video** — anything dropped in `public/projects/<slug>/` is served byte-for-byte as a static file. That makes the *export* step the only size control that exists, which is why this spec is more prescriptive here than for images.

**Format and compression:**
- **Container/codec: MP4 (H.264, baseline or main profile).** Universally supported by every target browser natively — no need for a second WebM/VP9 source or a `<video>` multi-`<source>` fallback for a portfolio site; that's DAM-system complexity this repo's non-goals (§11) already rule out.
- **Resolution: cap at 1920×1080 (1080p).** Same reasoning as image resolution in §10.2 — nothing on the web renders 4K usefully, and it costs proportionally more to store, encode, and (eventually) stream.
- **Bitrate/target file size: aim for ≤ 8MB per clip** after compression (roughly a 2-4 Mbps target bitrate at 1080p, adjustable down for lower-motion footage like a mostly-static CAD flythrough). Compress with `ffmpeg` or HandBrake before the file ever reaches `public/` — there is no server-side step that will do this later.
- **Keep clips short.** This pipeline is for demonstrating a specific simulation run or test, not archiving raw footage — trim to the relevant 5-20 seconds rather than uploading a multi-minute recording. A shorter, tightly-trimmed clip is both a better viewer experience and the single biggest lever on file size.

**Poster frames:** every video needs a poster image — a representative still frame shown before playback starts, serving double duty as the perceived-performance placeholder while the video (if ever requested) loads. Export the poster as a JPEG following the same guidance as other gallery images (§10.2: ≤1600px long edge, ≤250KB served). Named to match its video: `video-01.mp4` → `video-01-poster.jpg`.

**Autoplay/muted/loop policy: click-to-play is the default, not autoplay.** `<video>` renders with its poster frame and standard controls; playback starts only when the visitor presses play. This is a deliberate choice, not an oversight — it matches the motion philosophy in §5 ("no repeated/looping attention-grabbers... one-shot and scroll-triggered only") and respects visitor bandwidth/battery on mobile rather than treating video as ambient decoration. A short (<10s), silent simulation clip being used essentially as an animated figure (in place of a static image) is the one case where muted+loop autoplay could be considered on a per-video basis — if used, it must still never violate the reduced-motion rule below, and should be the exception the subject explicitly opts a specific clip into, not the pipeline's default behavior.

**Reduced motion:** no video autoplays under `prefers-reduced-motion: reduce`, including the muted-loop exception above — the poster frame is shown, controls remain available, and playback is only ever visitor-initiated. This is the video-specific instance of the same rule the Stage 4 reveal system already enforces for scroll animation (`docs/BUILD-PLAN.md` Stage 4) — same principle, applied to a second motion source.

**Slow connections:** `preload="none"` (or `preload="metadata"` if a duration display before play is wanted) on every `<video>` element — the multi-megabyte video file itself is never fetched until the visitor actually presses play. The poster JPEG (cheap, already budgeted under §10.4's per-image target) is the only video-related payload a visitor pays for by default.

## 11. Non-goals (explicit)

- Not building a CMS or admin panel — content stays in `utils/data/*.js`, hand-edited.
- Not adding authentication, comments, or any user-generated content surface.
- Not pursuing a full design-system component library (Storybook, etc.) for a single-page site — a handful of well-built components is enough; don't over-engineer for reuse that will never happen.
- Not chasing every visual idea from the triaged inspiration sites (Savee, getdesign.md) literally — they're reference/theory, not a checklist to implement.
- Not solving the dev.to `/blog` route's long-term fate in this pass — flagged as an open decision in §4, not resolved here.
- Not fixing the contact form's third-party channel choice (Telegram vs. email vs. something else) as a design decision — that's an infrastructure/env-var fix covered in BUILD-PLAN.md, not a PRD-level design call.
- Not migrating off Tailwind 4, Next 16, or React 19 — these are fixed constraints, not open questions.
- Not building a real digital-asset-management system (upload UI, image CMS, automated resizing pipeline) for the project assets in §10 — a hand-maintained directory convention plus a manifest data file is proportionate to five projects; revisit only if the project count grows enough that this becomes real friction.
- Not generating or sourcing the project imagery — every asset in §10's pipeline is supplied by the subject from real CAD/simulation/results work; nothing here fabricates a placeholder render or stock photo standing in for the real thing.
