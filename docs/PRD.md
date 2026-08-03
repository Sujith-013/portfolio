# PRD — Portfolio Landing Page Redesign

## 1. Goals

- Replace a generic, template-derived "developer portfolio" (currently mismatched: web-dev skill list, fake terminal snippet, Software-Developer designation) with a site that reads as deliberately designed and represents the subject's actual field — space systems / aerospace / robotics engineering — accurately and specifically.
- Survive a 20-second look from a recruiter, a professor, or an admissions committee: the hero and first scroll must communicate *who this is and what they've actually built*, not generic developer-portfolio signifiers.
- Stay fast. This is a portfolio, not a showreel — Lighthouse performance is a hard constraint, not an aspiration.
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
| `utils/data/projects-data.js` | Replace or demote the five unverified coursework projects (Marsbound, IntoOrbit, PocketSat, DroneQuest, FlightCraft) in favor of resume-verified, quantified work: DSTA CubeSat (1st place, 400% pointing agility), Project New Dawn (SEDS, APRS TT&C, composite airframe), RobotX perception stack, Aliena PMA micro-fluidics, Space Copy ISRU thermal/FEA. Populate real `code`/`demo` links or remove those affordances. Delete the trailing "Do not remove any property" template comment. |
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
5. **Projects** — feature the resume-verified, quantified work (DSTA CubeSat, Project New Dawn, RobotX, Aliena PMA, Space Copy ISRU) ahead of or instead of the five unverified coursework projects currently in the data file. Each project card needs a plain-language problem/role/outcome narrative, not just a resume-bullet paste — see content gap §3.2 in CONTENT-AUDIT.md.
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

## 9. Non-goals (explicit)

- Not building a CMS or admin panel — content stays in `utils/data/*.js`, hand-edited.
- Not adding authentication, comments, or any user-generated content surface.
- Not pursuing a full design-system component library (Storybook, etc.) for a single-page site — a handful of well-built components is enough; don't over-engineer for reuse that will never happen.
- Not chasing every visual idea from the triaged inspiration sites (Savee, getdesign.md) literally — they're reference/theory, not a checklist to implement.
- Not solving the dev.to `/blog` route's long-term fate in this pass — flagged as an open decision in §4, not resolved here.
- Not fixing the contact form's third-party channel choice (Telegram vs. email vs. something else) as a design decision — that's an infrastructure/env-var fix covered in BUILD-PLAN.md, not a PRD-level design call.
- Not migrating off Tailwind 4, Next 16, or React 19 — these are fixed constraints, not open questions.
