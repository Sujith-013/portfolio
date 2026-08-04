# Build Plan — Current State → Finished Landing Page

Sequenced so the site is deployable after every step (never left broken between commits), and so identity/content corrections land before any visual or motion work. Each step lists: what to do, which files, which resource/library it draws on, rough effort, dependencies on earlier steps, and a checkpoint to verify before moving on.

Assumes Direction A ("Flight documentation," see `docs/PRD.md` §8) unless noted — swap in Direction B/C's specifics at Stage 4 if a different direction is chosen; Stages 0-3 and 6-9 are direction-agnostic.

---

## Stage 0 — Decisions that block everything else

These aren't code changes; they're calls only you can make, and several later steps are blocked on them.

### 0.1 Resume PII decision
- **What:** Decide whether the reference block (3 names + personal phone numbers) gets redacted before the PDF is ever committed, and whether your own phone number stays in a public-facing resume copy. See `docs/CONTENT-AUDIT.md` §4.
- **Files:** `Harirajan Sujith_Resume.pdf` (currently untracked, repo root).
- **Effort:** Minutes, if you redact — needs whatever tool you used to author the PDF, not something to do in a text editor.
- **Depends on:** Nothing.
- **Checkpoint:** You have a version of the PDF you're comfortable committing to a public repo and serving at a public URL. Do not proceed to Step 1.1 until this is decided.

### 0.2 Address/phone exposure decision
- **What:** Decide whether `personalData.address` (currently a real Singapore street address, not even present on the resume) stays, gets reduced to just "Singapore," or is removed entirely. Same question for `personalData.phone`.
- **Files:** None yet — decision only.
- **Depends on:** Nothing.
- **Checkpoint:** You know what the final values should be before Step 1.1.

### 0.3 Design direction confirmation
- **What:** Confirm Direction A, or pick B/C, from `docs/PRD.md` §8.
- **Depends on:** Nothing.
- **Checkpoint:** Confirmed before Stage 4 (typography/color) starts — everything before that is direction-agnostic.

---

## Stage 1 — Identity/content correctness (no visual changes) — ✅ DONE

Goal: every data file tells the same, resume-accurate story. Lowest risk changes in the whole plan — text-only edits to `utils/data/*.js`, verifiable by reading the rendered page, no dependency installs, no layout changes.

**Completed 2026-08-04.** All six steps done; `npm run build` and a dev-server content check both pass. Notes from execution:
- Also fixed a live bug found during this pass: `contact/index.jsx` still read `personalData.phone`/`.address`, which Stage 0 had already deleted from the data file — those fields would have rendered as blank/undefined on the live page. Removed the phone/address rows from the contact section rather than reintroducing the fields.
- 1.1: `facebook`/`twitter`/`stackOverflow`/`leetcode` were left empty (not on the resume, not fabricated) — chose to remove those icons from Hero and Contact rather than leave dead `href=""` links. Only GitHub + LinkedIn remain. **Flagged for review**, not a hard requirement — fill any of these in later if you want them.
- 1.2: reordered experience as resume's own primary-Experience-section-first, then volunteering (Archimedes → Space Copy → Aliena → ASTRAEUS → SEDS), rather than a strict pure reverse-chronological sort — matches the plan's explicit note to put Archimedes first. **Flagged for review** if you'd prefer a different order.
- 1.4: skills data is now grouped by category in `skills.js`, but the Skills component still flattens it into the existing marquee for now — the marquee→grid visual rebuild is Stage 5.4, not this stage. Icon coverage: only 10 of 25 real skills have an icon in `skill-image.js` (Python, C++, PyTorch, OpenCV, MATLAB, Linux, Docker, Git, Canva, Microsoft Office); the rest render as text-only tags via a new fallback in the Skills component — no new icon set was sourced, per the plan's own note that this needs a design decision, deferred to Stage 5.4.
- 1.6: cut the five unverified coursework projects entirely rather than building a secondary "coursework" list UI (that's additional scope, not a Stage 1 content fix). All five new projects' `code`/`demo` stayed empty — harmless, since the live `ProjectCard` component never renders those fields (only the already-dead `single-project.jsx` does, deleted in Stage 2.2). One `role` field left blank with an inline `// TODO` — no official title/role for the DSTA CubeSat Challenge entry exists in `docs/CONTENT-AUDIT.md`, so it wasn't invented.

### 1.1 Fix `personal-data.js`
- **What:** `designation` → match `layout.js`'s already-correct "Space Systems Engineer" (or your preferred exact phrasing). Apply the address/phone decision from 0.2. Fill or blank-and-hide `facebook`/`twitter`/`stackOverflow`/`leetcode` (decide per platform, don't leave dead `href=""` icons). Leave `resume` pointing at the Drive link for now — it gets repointed in Step 2.1 once the PDF is actually in `public/`.
- **Files:** `utils/data/personal-data.js`.
- **Resource:** None — content-audit table in `docs/CONTENT-AUDIT.md` is the source.
- **Effort:** Small (15 min).
- **Depends on:** 0.1, 0.2.
- **Checkpoint:** `npm run build` succeeds; homepage bio/designation text matches `<title>` in browser tab; no icon on the page links to `href=""`.

### 1.2 Fix `experience.js`
- **What:** Swap the reversed `title`/`company` fields on the SEDS entry. Add a bullets/achievements array field to the data shape (doesn't exist today) and populate every one of the 5 entries with 2-3 resume-sourced bullets (content is in `docs/CONTENT-AUDIT.md` §1). Re-order reverse-chronologically if you agree with that recommendation (Archimedes AV first).
- **Files:** `utils/data/experience.js`, and whatever component renders it (find via `grep -rl "experiences" app/components` — the card/list component needs a new field rendered, not just new data).
- **Resource:** None.
- **Effort:** Medium (bullets need to be written in reader-friendly prose, not resume-bullet-paste — see PRD §4 point 3).
- **Depends on:** 1.1 (not strictly, but keep the content pass together as one reviewable unit).
- **Checkpoint:** Every experience card on the page shows real bullets; SEDS entry shows "Technical Director & Co-founder" as the title, "SEDS in NTU, Singapore" as the org.

### 1.3 Fix `educations.js`
- **What:** Add an achievements/context field (DSTA CubeSat win, OCEP Vietnam, STEM/Micro:bit outreach for NTU); add an "incoming" distinction for TU Berlin so date range doesn't read as already underway.
- **Files:** `utils/data/educations.js` + rendering component.
- **Effort:** Small-medium.
- **Depends on:** 1.2 (same component-shape pattern, do them together for consistency).
- **Checkpoint:** NTU card shows the CubeSat win; TU Berlin card visually reads as upcoming, not in-progress.

### 1.4 Replace `skills.js` content
- **What:** Delete the web-dev list and the trailing ~80-line template comment block. Replace with the resume's actual stack, grouped by category (languages/ML, robotics/sim, CAD/FEA, embedded/hardware, tooling).
- **Files:** `utils/data/skills.js`, `utils/skill-image.js` (icon lookup — audit which of the new skills have an available icon; most won't in a typical web-dev icon set, decide text-tag fallback vs. sourcing a small aerospace/robotics icon set).
- **Resource:** None required; if you want a broader icon set, `react-icons` (already a dependency, due for a v5 bump per Step 2.7) or simple-icons may cover some (Python, Docker, Git, Linux) but not most CAD/robotics-specific tools (SolidWorks, ANSYS, ROS 2, MuJoCo) — plan for text labels on those regardless.
- **Effort:** Medium (icon coverage gap needs a design decision, not just data entry).
- **Depends on:** 0.3 not required yet (this is still direction-agnostic content).
- **Checkpoint:** No HTML/CSS/React/MongoDB/MySQL/AWS/etc. remains anywhere in the rendered skills section.

### 1.5 Fix hero hardcoded skill list
- **What:** Remove the hand-typed React/MySQL/MongoDB/Docker/AWS list from the fake terminal block; either delete that block or refactor it to import from the same source as `skills.js` (recommended, so the two can't drift apart again).
- **Files:** `app/components/homepage/hero-section/index.jsx`.
- **Depends on:** 1.4 (needs the corrected skill data to point at).
- **Effort:** Small.
- **Checkpoint:** Hero section shows zero web-dev-stack terms.

### 1.6 Replace/demote `projects-data.js` content
- **What:** Feature the resume-verified work (DSTA CubeSat, Project New Dawn, RobotX perception stack, Aliena PMA, Space Copy ISRU) ahead of or instead of the five unverified coursework projects. Write plain-language problem/role/outcome narrative per project (this is new prose, not a resume-bullet paste — PRD §4 point 5 / CONTENT-AUDIT §3 point 2). Populate real `code`/`demo` links where they exist, or remove those UI affordances for projects that don't have one. Delete the trailing "Do not remove any property" template comment.
- **Files:** `utils/data/projects-data.js`, `app/components/homepage/projects/*` (check whether `single-project.jsx` — already flagged as dead code reading nonexistent fields — needs deleting here or in Step 2.2; don't let a live component read a field shape you just changed without checking it first).
- **Resource:** None — this is the content gap identified in CONTENT-AUDIT §3; you supply the narrative, this plan just sequences it in.
- **Effort:** Large (new prose, most content-creation-heavy step in Stage 1).
- **Depends on:** 1.1-1.5 loosely (no hard technical dependency, but doing it last in Stage 1 means every other data file is already stable when you're writing the highest-visibility content).
- **Checkpoint:** Projects section shows resume-verified work first; no card shows a dead/empty demo or code link; `npm run build` succeeds.

**Stage 1 exit checkpoint:** Full click-through of the live site (`localhost:3000`, dev server already running) top to bottom. Every section's text is resume-accurate. No visual changes have been made yet — this stage is a pure content/data correctness pass, verified by reading, not by screenshot comparison.

---

## Stage 2 — Housekeeping / punch list

Folds in every item from `docs/ARCHITECTURE.md`'s prioritised punch list not already covered in Stage 1. All independent of each other and of the design direction — safe to do in any order within this stage, sequenced here by risk (safest/most mechanical first).

### 2.1 Move and repoint the resume PDF
- **What:** Move `Harirajan Sujith_Resume.pdf` into `public/` (rename to drop spaces, e.g. `public/resume.pdf`). Update `personalData.resume` to `/resume.pdf`.
- **Files:** move the PDF; edit `utils/data/personal-data.js`.
- **Depends on:** 0.1 (PII decision must already be reflected in the PDF you're about to commit and publish).
- **Effort:** Trivial.
- **Checkpoint:** `localhost:3000/resume.pdf` loads the file directly; the resume-download button/link on the site points at it and works.

### 2.2 Delete confirmed dead code
- **What:** Delete `app/components/homepage/projects/single-project.jsx` (reads fields — `tags`/`image`/`features` — that don't exist on the current or new project data shape), `utils/data/contactsData.js` (defined, never imported), `app/api/data/route.js` (placeholder stub).
- **Files:** as listed.
- **Depends on:** 1.6 (confirm nothing in the new project card rendering path still imports `single-project.jsx` before deleting it).
- **Effort:** Trivial.
- **Checkpoint:** `npm run build` succeeds with no unresolved-import errors; `grep -r "single-project\|contactsData" app utils` returns nothing.

### 2.3 Fix or remove the contact form's broken pieces
- **What:** `app/api/google/route.js` reads `process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` — the `NEXT_PUBLIC_` prefix wrongly exposes a secret to the client bundle. Either wire up `react-google-recaptcha` properly (rename the env var, remove the `NEXT_PUBLIC_` prefix, actually render the recaptcha component) or remove the recaptcha dependency and route entirely if you don't want it. Separately, set real values for `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` (or whichever channel you choose) locally and on Vercel so the contact form's POST doesn't 400.
- **Files:** `app/api/google/route.js`, `app/api/contact/route.js`, `.env.example`, Vercel project env vars (external, not a repo file).
- **Effort:** Medium — the security-relevant part (secret naming) is small; deciding and provisioning a real notification channel (Telegram bot setup, or switching to `EMAIL_ADDRESS`/`GMAIL_PASSKEY`, or dropping `@emailjs/browser` which is installed but unused) takes longer.
- **Depends on:** Nothing from Stage 1.
- **Checkpoint:** Submitting the contact form on the live (or preview-deployed) site actually delivers a message somewhere you receive it. No secret key is present in client-side bundle output (`next build` output / browser devtools Network tab shows no reCAPTCHA secret in any client-fetched JS).

### 2.4 Pick one lockfile
- **What:** `package-lock.json` and `pnpm-lock.yaml` are both committed. Pick the package manager you actually use, delete the other lockfile, commit the result.
- **Files:** delete `pnpm-lock.yaml` or `package-lock.json`.
- **Effort:** Trivial.
- **Depends on:** Nothing.
- **Checkpoint:** Only one lockfile exists; a clean `npm ci` (or `pnpm install --frozen-lockfile`, matching whichever you kept) succeeds from scratch.

### 2.5 Rewrite `README.md`
- **What:** Full rewrite as an about-me / project document, not template install instructions — who you are, what this site is, what you work on, links out. Denser and more technical than the landing page copy is appropriate here (per your own note in `docs/ARCHITECTURE.md` §5: repo visitors are more technical/curious than recruiters skimming the live site) — cover engineering decisions made in this rebuild, what didn't work, why GSAP over the alternatives, etc.
- **Files:** `README.md`.
- **Resource:** `docs/RESOURCE-AUDIT.md` and this build plan are good source material for the "how it was built" section.
- **Effort:** Medium.
- **Depends on:** Ideally done after Stage 6 (so it can describe the finished build accurately) — listed here because it's a housekeeping item, but consider deferring the actual writing until the site is closer to done.
- **Checkpoint:** README reads as a standalone document; no leftover install/setup instructions for a template someone else wrote.

### 2.6 Remove remaining template branding
- **What:** Remove Footer Star/Fork links pointing at the original template author's repo. Remove `.github/FUNDING.yml`'s open_collective entry (or the whole file, if you don't want a funding prompt at all).
- **Files:** `app/components/footer/*`, `.github/FUNDING.yml`.
- **Effort:** Trivial.
- **Depends on:** Nothing.
- **Checkpoint:** Footer contains no links to the upstream template repo.

### 2.7 Minor cleanup
- **What:** Bump `react-icons` from v4 to current v5 (check for breaking icon-name changes in the changelog before bulk-replacing imports). Fix generic/empty `alt` text (`blog-card.jsx` and decorative SVGs using `alt="Hero"` regardless of content) — covered fully in Stage 7's accessibility pass, but the `react-icons` bump specifically is independent and can happen here.
- **Files:** `package.json`, any file importing from `react-icons`.
- **Effort:** Small, unless the v4→v5 changelog reveals renamed icons in use (verify before assuming a drop-in bump).
- **Depends on:** Nothing.
- **Checkpoint:** `npm run build` succeeds post-bump; spot-check every icon still renders (v5 renamed some icons).

**Stage 2 exit checkpoint:** `npm run build` and `npm run lint` both pass clean. Contact form works end-to-end on a preview deploy. No dead code, no duplicate lockfiles, no template branding remains.

---

## Stage 3 — Design token foundation (Tailwind 4 CSS-first)

Everything visual in Stages 4-6 depends on this existing first — do not start copying/building components against ad-hoc arbitrary values again.

### 3.1 Centralize the color system
- **What:** Replace the scattered `#16f2b3` arbitrary-value hex and hardcoded violet gradients with a real `@theme` block. Because this repo has zero existing `tailwind.config.js` theme customization (per `docs/ARCHITECTURE.md` §4), this is a clean introduction, not a migration — no HSL→OKLCH conversion, no legacy `:root`/`.dark` `@layer base` block to untangle (see `docs/RESOURCE-AUDIT.md` "Tailwind CSS 4 fit").
- **Files:** `app/css/globals.scss` (or a new `app/css/theme.css` imported alongside it — Tailwind 4's `@theme` block needs to live in a CSS file processed by `@tailwindcss/postcss`, verify Sass-vs-plain-CSS interaction before choosing the file).
- **Resource:** Tailwind CSS 4 official `@theme` docs (fetched during Phase 0 of this pass — exact `--color-*`, `--*: initial` override syntax confirmed there).
- **Effort:** Medium — requires actually designing the palette (see Direction A/B/C in PRD §8), not just relocating one hex value into a variable.
- **Depends on:** 0.3 (direction decision — the palette itself depends on which direction you picked).
- **Checkpoint:** `grep -rn "#16f2b3\|16f2b3" app` returns nothing outside the new `@theme` definition; every color in the rendered site traces back to a named token.

### 3.2 Typography scale and font pairing
- **What:** Define `--font-*` and `--text-*` theme variables for the chosen direction's type pairing (Direction A: one display/slab or serif face for name/headings + one monospace for technical labels/specs, alongside or replacing the existing Inter body face).
- **Files:** `app/layout.js` (font loading via `next/font/google` or `next/font/local`), `@theme` block from 3.1.
- **Effort:** Medium.
- **Depends on:** 3.1.
- **Checkpoint:** No default browser/system font renders anywhere; both faces are self-hosted via `next/font` (no external font request visible in Network tab); type scale is used consistently, not ad-hoc per component.

### 3.3 Spacing rhythm
- **What:** Define a `--spacing` base unit and/or named spacing tokens matching the chosen direction's density (Direction A: generous margins, visible grid — needs a wider base rhythm than a dense dashboard-style layout would).
- **Files:** `@theme` block.
- **Effort:** Small.
- **Depends on:** 3.1, 0.3.
- **Checkpoint:** Section padding/margins are visually consistent scrolling top to bottom — no section noticeably tighter or looser than its neighbors without a deliberate reason.

**Stage 3 exit checkpoint:** A visual diff of the (still content-correct, not yet motion-enhanced) site shows every color/font/spacing value traceable to a token in one `@theme` block. This is the point where "reads as deliberately designed" starts being visually true, not just structurally true.

---

## Stage 4 — Motion foundation

### 4.1 Install and wire GSAP
- **What:** `npm install gsap`. Set up the `useGSAP` hook pattern (per the installed `gsap-react` skill) and a shared `prefers-reduced-motion` gate using `gsap.matchMedia()` (per `gsap-core`), so every subsequent section's animation opts into the same reduced-motion handling rather than each component reinventing the check.
- **Files:** new `utils/hooks/use-scroll-reveal.js` (or similar shared hook), `package.json`.
- **Resource:** installed skills `gsap-core`, `gsap-react`.
- **Effort:** Medium (the shared hook is worth getting right once rather than per-section).
- **Depends on:** Stage 3 (motion should reveal already-correct tokens/typography, not placeholder content).
- **Checkpoint:** A trivial test animation (e.g. hero fade-in) respects OS-level reduced-motion setting when toggled in browser devtools; removing the test animation leaves no console errors.

### 4.2 ScrollTrigger setup for section reveals
- **What:** Wire `ScrollTrigger` (installed `gsap-scrolltrigger` skill) for the staggered, once-per-section entrance pattern specified in PRD §5 — headline → supporting text → proof point, in reading order, triggered on first scroll into view only.
- **Files:** section components under `app/components/homepage/*`.
- **Effort:** Medium.
- **Depends on:** 4.1.
- **Checkpoint:** Scrolling down the page once triggers each section's reveal in order; scrolling back up and down again does not re-trigger it (unless that's a deliberate choice — decide and be consistent).

**Stage 4 exit checkpoint:** The reduced-motion toggle test from 4.1, repeated against every section now wired to ScrollTrigger — confirm none of them bypass the shared gate.

---

## Stage 5 — Section-by-section rebuild

Order matches the page's actual top-to-bottom sequence, so at every step the live site is a strictly improved version of itself — never a half-migrated mix of old and new that looks broken.

### 5.1 Hero
- **What:** Rebuild per PRD §4.1 — name, current standing, one concrete proof point, no hardcoded stale skill list (already fixed in 1.5, but this is where the *visual* treatment of the hero gets built against the new type/color system).
- **Files:** `app/components/homepage/hero-section/index.jsx`.
- **Effort:** Large (this is the highest-stakes single component on the page).
- **Depends on:** Stages 1, 3, 4.
- **Checkpoint:** First viewport, no scrolling, on both mobile and desktop widths, communicates who this is and one real proof point — have someone unfamiliar with the site look at it for 20 seconds and repeat back what they saw.

### 5.2 About
- **What:** Build the positioning-statement paragraph (content you write per PRD §4.2 / CONTENT-AUDIT §3.1) into the visual system.
- **Files:** `app/components/homepage/about-section/*` (or equivalent — confirm actual path).
- **Effort:** Medium.
- **Depends on:** 5.1.
- **Checkpoint:** Paragraph reads as a specific answer to "why does one person span maritime autonomy, ISRU, propulsion, and CubeSats," not a generic "I love learning new things" statement.

### 5.3 Experience
- **What:** Visual rebuild of the now-bulleted (Stage 1.2), reverse-chronological experience list against the new type/color/spacing system.
- **Files:** experience section + card components.
- **Effort:** Medium.
- **Depends on:** 1.2, Stage 3, 5.2.
- **Checkpoint:** Each entry's bullets are legible and scannable, not a wall of undifferentiated text.

### 5.4 Skills
- **What:** Visual rebuild of the now-grouped (Stage 1.4), non-marquee skills section. Decide against keeping `react-fast-marquee`'s infinite scroll (flagged in PRD §5 as a template default working against "restrained") — replace with a static, grouped grid or list.
- **Files:** skills section, `package.json` (remove `react-fast-marquee` if dropped).
- **Effort:** Medium.
- **Depends on:** 1.4, 1.5, Stage 3.
- **Checkpoint:** No infinite/looping marquee remains unless deliberately kept and justified; skills read in clear categories.

### 5.5 Projects
- **What:** Visual rebuild featuring the resume-verified projects (Stage 1.6) with the plain-language narrative built into cards, per whichever direction's project-card treatment (Direction A: spec-sheet-style card with quantified result as a typographic "spec row").
- **Files:** projects section + card components (confirm `single-project.jsx` deletion from 2.2 didn't strand any import).
- **Effort:** Large.
- **Depends on:** 1.6, 2.2, Stage 3.
- **Checkpoint:** Featured projects are the resume-verified ones; each has a real code/demo link or no dead affordance; narrative reads as context+outcome, not a bullet dump.

### 5.6 Education
- **What:** Visual rebuild with the achievement context (Stage 1.3) and the incoming/in-progress distinction.
- **Files:** education section.
- **Effort:** Small-medium.
- **Depends on:** 1.3, Stage 3.
- **Checkpoint:** TU Berlin visually reads as upcoming; NTU shows the CubeSat win and other achievement context.

### 5.7 Blog section decision
- **What:** Execute whichever call was made in PRD §4 point 7 (keep dev.to integration as-is, replace with a static writing/talks placeholder featuring the IEPC presentation, or remove the section and `/blog` route entirely).
- **Files:** `app/page.js`, `app/blog/page.js`, blog section component, depending on the choice.
- **Effort:** Small (keep) to Medium (replace/remove and clean up the now-unused dev.to fetch logic in `app/page.js`).
- **Depends on:** A decision, not on other Stage 5 steps.
- **Checkpoint:** Whatever's shipped here matches the decision — no half-implemented state (e.g. don't leave the dev.to fetch running server-side if the section using it was removed).

### 5.8 Contact
- **What:** Visual rebuild of the now-functional (Stage 2.3) contact form against the new type/color system, with proper label/error-state accessibility (feeds into Stage 7).
- **Files:** contact section.
- **Effort:** Small-medium.
- **Depends on:** 2.3, Stage 3.
- **Checkpoint:** Form is visually consistent with the rest of the site and actually delivers a message end-to-end (re-verify after visual changes, since restyling can accidentally break a working form).

**Stage 5 exit checkpoint:** Full top-to-bottom scroll-through on both mobile and desktop viewport widths. Every section is content-correct (Stage 1), housekeeping-clean (Stage 2), token-consistent (Stage 3), and motion-enhanced (Stage 4) at once — this is the first point where the site is "done" in every dimension except final polish and performance verification.

---

## Stage 6 — Asset cleanup

### 6.1 Remove unused template stock images
- **What:** Delete `public/image/ayla.jpg`, `crefin.jpg`, `real-estate.jpg`, `travel.jpg`, `portfolio.gif`, `card.png`, `screen.png`, `png/placeholder.png` — unused template stock photos for generic web-dev projects that no longer exist in the data (per CONTENT-AUDIT §3 point 3), once real photos/renders/diagrams (which you'll need to supply — this plan can't generate them) are in place, or immediately if the new project cards don't use images at all.
- **Files:** `public/image/*`, `public/png/*`.
- **Depends on:** 5.5 (confirm nothing still references these paths before deleting).
- **Effort:** Trivial once confirmed unreferenced.
- **Checkpoint:** `grep -rn "ayla\|crefin\|real-estate\|travel.jpg\|portfolio.gif" app utils` returns nothing; repo no longer ships dead weight images.

### 6.2 Real visual assets
- **What:** Add whatever real photos/renders/diagrams you're supplying (RobotX vehicle, CubeSat, PMA hardware, composite airframe, etc. — flagged as a content gap you own in CONTENT-AUDIT §3 point 3) via `next/image` with real, specific `alt` text.
- **Files:** `public/`, relevant section components.
- **Effort:** Depends entirely on what you supply and when — this step is a placeholder for that work, not something this plan can size.
- **Depends on:** You supplying the assets (external to this plan).
- **Checkpoint:** Every image on the page is either a real, relevant asset or deliberately absent — no stand-in stock photo remains.

---

## Stage 7 — Accessibility pass

### 7.1 Alt text audit
- **What:** Fix every empty/generic `alt` (per ARCHITECTURE.md: `blog-card.jsx`, decorative SVGs hardcoded to `alt="Hero"`) — decorative gets `alt=""`, informational gets a real description.
- **Files:** every component using `<Image>` or `<svg>`.
- **Effort:** Small (mechanical once you've decided decorative vs. informational per image).
- **Depends on:** Stage 6.2 (real assets need their real alt text; no point writing alt text for images about to be replaced).

### 7.2 Contrast and keyboard verification
- **What:** Verify the new `@theme` accent color against WCAG AA for any text use (not just as a decorative highlight). Tab through the entire page confirming visible focus states on every interactive element, including the mouse-tracked glow card's keyboard-accessible equivalent.
- **Files:** as needed, likely `@theme` block adjustments and a few `:focus-visible` rules.
- **Effort:** Medium.
- **Depends on:** Stage 5 (needs the finished visual system to test against).
- **Checkpoint:** A full keyboard-only pass (no mouse) reaches and activates every interactive element with a visible focus indicator at each stop.

### 7.3 Reduced-motion re-verification
- **What:** Re-run the reduced-motion test from Stage 4 against the finished, fully-built site (not just the trivial test animation) — confirm every section's real ScrollTrigger animation is gated correctly, not just the prototype.
- **Depends on:** Stage 5 complete.
- **Effort:** Small.
- **Checkpoint:** Toggling OS-level reduced-motion shows all content immediately, no section stuck mid-animation or invisible.

---

## Stage 8 — Performance verification

### 8.1 Lighthouse run
- **What:** Run Lighthouse (mobile + desktop) against a Vercel preview deploy (not just local dev — dev-mode Turbopack numbers aren't representative). Confirm ≥90 performance per PRD §7.
- **Files:** none — verification step.
- **Depends on:** Stages 1-7 complete.
- **Effort:** Small to run, potentially Medium-Large to fix findings.
- **Checkpoint:** Score ≥90 mobile. If not, most likely culprits given this build: unoptimized real images from 6.2 (verify `next/image` sizing/formats), a component library import that dragged in an unrelated animation dependency (re-check PRD §7's "no second animation library" rule), or web font loading strategy regression from Stage 3.2.

### 8.2 Bundle size check
- **What:** Run `@next/bundle-analyzer` (or equivalent) to verify the "no second animation library" rule actually held — confirm nothing copied from React Bits/Aceternity/Magic UI/KokonutUI during Stage 5 quietly introduced Motion, three.js, or Framer Motion alongside GSAP.
- **Depends on:** Stage 5 complete.
- **Effort:** Small.
- **Checkpoint:** Only one animation library appears in the client bundle.

---

## Stage 9 — Final QA

### 9.1 Cross-browser/responsive pass
- **What:** Manually check the four named reader types' likely contexts — desktop Chrome/Safari, mobile Safari/Chrome — at minimum. Verify the hero's 20-second test (5.1's checkpoint) holds on mobile specifically, not just desktop.
- **Depends on:** Stage 8.
- **Effort:** Small-medium.

### 9.2 README finalization
- **What:** If deferred from 2.5, finalize the README now that the actual build (library choice, direction chosen, what changed from plan) is known.
- **Depends on:** Everything.
- **Effort:** Medium.

### 9.3 Final content read-through
- **What:** One last pass reading every word on the live site against `docs/CONTENT-AUDIT.md`, confirming no template leftover survived the whole build (search the final rendered site for any of: "Software Developer," "React, MySql, MongoDB, Docker, AWS," any of the five unverified coursework project names if you chose to drop them, the template's Star/Fork footer links).
- **Depends on:** Everything.
- **Effort:** Small.
- **Checkpoint:** Nothing in `docs/CONTENT-AUDIT.md`'s "currently says" column is still true of the live site.

---

## Summary sequencing rationale

Content (Stage 1) before housekeeping (Stage 2) before design tokens (Stage 3) before motion (Stage 4) before section rebuilds (Stage 5) before assets (Stage 6) before accessibility (Stage 7) before performance (Stage 8) before final QA (Stage 9). The guiding constraint throughout: never rebuild the visual layer (Stages 3-6) against content that's still wrong (Stage 1), and never add motion (Stage 4) to a layout that's still using ad-hoc arbitrary-value colors (Stage 3) you'll have to re-touch again once tokens exist.
