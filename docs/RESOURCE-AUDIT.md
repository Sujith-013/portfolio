# Resource Audit — Phase 0 Triage + Phase 2 Compatibility

Classification key: **(A)** Claude Code skill to install · **(B)** component/code source to copy from · **(C)** library to install as a dependency · **(D)** design theory to internalise · **(E)** visual inspiration only · **(F)** not useful for this project.

## Phase 0 — Triage table

### Claude Code skills / methodology repos

| Resource | Class | Why |
|---|---|---|
| [anthropics/skills — frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | **A** | Official Anthropic skill. Single `SKILL.md`, valid frontmatter (`name`, `description`, `license`). Directly on-topic: distinctive visual design, typography pairing, "one real aesthetic risk you can justify" — exactly the brief's tone. |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | **A** | Official GSAP skills repo, but it's a *bundle* of 8 separate skills (core, react, scrolltrigger, timeline, utils, performance, plugins, frameworks), each with valid, distinct frontmatter. Installed all 8 individually rather than as one nested folder — see Phase 1. |
| [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | **A** | Repo bundles 13 skills under different names (design-taste-frontend, design-taste-frontend-v1, brutalist, minimalist, soft, brandkit, stitch, redesign, image-to-code, imagegen-frontend-web/mobile, output-skill, gpt-tasteskill). Installed only the current primary one, `design-taste-frontend` (frontmatter `name: design-taste-frontend`) — it explicitly supersedes the v1 file, which exists only for backward compatibility. The other 12 are valid but not installed; available if you want a specific style enforcer (e.g. `brutalist-skill`) later. |
| [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) | **A** | Single skill, valid frontmatter, two explicit modes (create/audit) distilled from named motion designers (Emil Kowalski, Jakub Krehel, Jhey Tompkins). Directly relevant to the "motion that serves comprehension" requirement. |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | **A** | Ships the *same* SKILL.md pre-packaged for ~14 different agent tool directories (`.claude`, `.cursor`, `.trae`, `.gemini`, etc. — all identical content). Installed the `.claude/skills/impeccable/` copy only. Valid frontmatter with `version`, `allowed-tools`, `license`. |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | **A** | Repo ships its own ready-made `.claude/skills/` directory containing 7 discrete skills (`ui-ux-pro-max`, `design-system`, `banner-design`, `slides`, `design`, `brand`, `ui-styling`) — this is clearly the intended drop-in layout, so all 7 were installed as a set (see Phase 1). `ui-ux-pro-max` itself is a large local database (84 styles, 192 palettes, 74 font pairings, 16 GSAP motion presets) — useful as a lookup tool, not a design philosophy. |

### Component libraries

| Resource | Class | Why |
|---|---|---|
| [Magic UI](https://magicui.design/) | **B** | React + TypeScript + Tailwind + Motion, "companion for shadcn/ui." Copy-paste distribution. Good source for a small number of specific effects (e.g. a restrained marquee, a subtle border-beam) — not a wholesale UI kit for this project; most of its catalogue (bento grids, animated testimonial walls, pricing tables) skews SaaS-marketing, wrong register for a technical/academic portfolio. |
| [Aceternity UI](https://ui.aceternity.com/) | **B**, with caveats | React/Next.js, copy-paste, built on Tailwind + Framer Motion (not the renamed `motion` package). 200+ components skew heavily toward SaaS-landing tropes (3D card tilts, spotlight heroes, bento layouts) — the opposite of "restrained, technically credible." A couple of primitives (e.g. a text-reveal, a subtle background grid) could be adapted, but treat as a source to raid selectively, not a kit to install wholesale. See Tailwind v4 compatibility note below — this is the library most likely to need real migration work. |
| [React Bits](https://reactbits.dev/) | **B** | Largest catalogue surveyed: JS/TS × CSS/Tailwind variants per component, installable via `shadcn` or `jsrepo` CLI or plain copy-paste. Explicitly supports **Tailwind CSS 4**. Selective-dependency model — each component only pulls what it needs (`motion/react`, `gsap`, `three.js`, `matter-js`, `lenis`, `d3`), so adopting one text-scramble or scroll-linked component doesn't drag in an unrelated animation stack. Best-fit component source of the four surveyed for this project, precisely because it doesn't force a single opinionated visual style the way Aceternity/Magic UI/Kokonut do. |
| [KokonutUI](https://kokonutui.com/) | **B** | React/Next.js, Tailwind-based, installed via `shadcn` CLI (`npx shadcn@latest add @kokonutui/<name>`) or copy-paste, animated with Motion. ~100 components, also skews SaaS/product-marketing (pricing cards, AI chat bubbles, dashboards). Same verdict as Magic UI: raid for one or two primitives if genuinely useful, don't adopt the aesthetic. |
| [Uiverse.io](https://uiverse.io/) | **F** | Community-submitted CSS/HTML snippets (buttons, toggles, loaders, checkboxes), exportable as HTML/CSS, Tailwind, React, or Figma. No curation or design system coherence — it's a grab-bag, and quality/consistency varies wildly submission-to-submission. Wrong tool for "reads as deliberately designed, not assembled" — the whole point of this project is to *not* look like a pile of independently-sourced widgets. Skip. |

### Animation libraries

| Resource | Class | Why |
|---|---|---|
| [GSAP](https://gsap.com/) | **C** — **recommended pick** | Now fully free (Webflow-sponsored, no more Business/Club tier paywall for any plugin, including ScrollTrigger/SplitText). Framework-agnostic, official `useGSAP` React hook (covered by the installed `gsap-react` skill), officially documented Next.js/App Router usage. Timeline-based sequencing is the right mental model for scroll-driven, choreographed reveals rather than isolated per-component transitions. See recommendation detail below. |
| [Motion](https://motion.dev/) (formerly Framer Motion) | **C** — runner-up | MIT, "up to 90% smaller API than GSAP" per their own marketing (bundle-size claim, not independently verified here). React/JS/Vue. Used internally by Magic UI, Aceternity, KokonutUI, and React Bits' `motion/react` components — so if you later copy components from any of those, Motion is already an implicit dependency of that code. Would require `"use client"` on every animated component (App Router: all Motion/GSAP-driven work must be client components regardless of library choice). |
| [anime.js](https://animejs.com/) | **F** for this project | Vanilla JS, framework-agnostic, no first-party React bindings. v4, ~24.5KB modular (Timer 5.6KB, Animation 5.2KB, Draggable 6.4KB — pick only what you use). Fine engine, but pairing vanilla-JS imperative animation code with React's render cycle means hand-rolling the cleanup/ref-sync work that `useGSAP`/Motion's hooks already solve. No reason to take on that integration cost when GSAP's React story is first-party. |
| [react-spring](https://react-spring.dev/) (`pmndrs`) | **F** for this project | Actively maintained (latest 10.0.4, healthy release cadence) but **peer-dependency conflict with React 19**: `@react-spring/web` in the version most guides reference constrains `react@"^16.8.0 \|\| ^17.0.0 \|\| ^18.0.0"`, so installing alongside React 19.2 needs `--force`/`--legacy-peer-deps`. Given this repo is already running bleeding-edge React 19.2/Next 16, introducing a library that needs a peer-dep override on day one is an avoidable landmine. Physics-based spring model is a nice mental model but not worth the friction here. |

**Single animation library recommendation: GSAP.** Reasons, weighed against the other three: it's the only one of the four with (a) no licensing asterisk left post-Webflow acquisition, (b) an official first-party React integration already covered by an installed skill (`gsap-react`), (c) documented Next.js/SSR guidance (animate in `useGSAP`/`useEffect`, gated behind `"use client"`, nothing runs during server render so no hydration mismatch), and (d) a timeline model suited to the motion language this brief wants — one coordinated reveal sequence per section, not a pile of independent micro-interactions. Motion is the legitimate second choice if you specifically want scroll-linked layout animations (its `layout` prop) or already plan to lift a Motion-dependent component from React Bits — worth revisiting only if that need materializes.

### Tooling / assets / inspiration

| Resource | Class | Why |
|---|---|---|
| [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) | **F** | Full-stack app (React/Vite frontend + FastAPI backend) you'd self-host or use hosted at screenshottocode.com — not a Claude Code skill, not a dependency, not a design reference. Converts screenshots/Figma/recordings to HTML+Tailwind, React+Tailwind, Vue, Bootstrap, or Ionic code via GPT/Gemini/Claude. Only relevant if you want to hand it a competitor's screenshot to reverse-engineer layout ideas — not something this pass needs. |
| [helloianneo/ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations/tree/main) | **F** | Not a pre-made illustration asset pack — it's an AI-agent prompt/skill for generating a specific recurring minimalist character ("Xiaohei," 小黑) for Chinese-language editorial content. MIT-licensed, but the wrong subject and register entirely for an aerospace-engineering portfolio; would need to be redirected at a completely different visual character to be usable, at which point it's not really "using" this repo so much as writing a new skill from scratch. Skip. |
| [Savee](https://savee.com/) | **E** | Pure mood-board/inspiration platform (image/color/layout curation, browser extension, Figma plugin), plus a secondary marketplace of paid templates/assets. No code or components to extract — browse for aesthetic reference only, if at all; nothing here is aerospace/technical-portfolio specific. |
| [Reve — explore/templates](https://app.reve.com/explore/templates) | **F** for this pass | AI image-generation tool, not a website-template gallery despite the URL path. Could theoretically generate a hero illustration or abstract technical graphic later, but that's an asset-generation task for a later pass, not a design-system or component resource for this one. |
| [getdesign.md](https://getdesign.md/) | **D** | Catalog of ~300 machine-readable `DESIGN.md` specs (colors/typography/spacing/rationale) reverse-engineered from real sites (Airbnb, Apple, Stripe, Figma, etc.), meant to be handed to an AI coder as a style brief. Useful as a *methodology reference* for how to structure our own design tokens document, and possibly worth pulling one or two specs (e.g. a technical/engineering-adjacent brand) for comparison — but none of the 300 are your subject matter, so treat as theory/technique, not a brief to copy. |

## Phase 2 — Compatibility findings

### React 19 / Next.js 16 App Router fit

- **Aceternity UI, Magic UI, KokonutUI, React Bits**: all four are React/Next.js-targeted and copy-paste (or CLI-drop, via `shadcn`/`jsrepo`) — meaning the code lands in your repo as source you own, not a black-box npm dependency with its own peer-dependency graph. This sidesteps most React-19-peer-conflict risk *except* whatever animation library the copied component itself imports (Motion, GSAP, three.js) — check that import per component you copy.
- Every one of these libraries' interactive components needs an explicit `"use client"` directive once copied into an App Router project — none of them are server-component-safe as authored (they use hooks, refs, browser APIs). This repo's `app/page.js` is currently a server component that fetches dev.to posts server-side, so any copied animated component must be its own client boundary, not force the whole page client-side.
- **react-spring** is the one real peer-dependency conflict found: not compatible with React 19 without `--force`/`--legacy-peer-deps` as of the versions surveyed. Confirmed reason to exclude it (see table above).
- **Next.js 16 specifics worth knowing before building** (from the official v16 upgrade guide): Turbopack is now the default for both `dev` and `build` (no flag needed); `middleware.ts` is renamed `proxy.ts` (irrelevant here — this repo has no middleware file); `params`/`searchParams` are fully-async-only now (relevant to the `app/blog/page.js` route if it reads searchParams); Node.js 18 is no longer supported (minimum 20.9); `next/legacy/image` and `images.domains` are deprecated in favor of `next/image` + `images.remotePatterns`. None of this blocks the visual redesign, but the build step will fail loudly if a stray webpack config or Node 18 CI runner is in play — worth a quick check before the first deploy of this work.

### Tailwind CSS 4 fit

- This repo already has zero `tailwind.config.js` theme customization (confirmed in `ARCHITECTURE.md` — only container/breakpoint/gradient extensions, no color palette), so there's no legacy config to migrate away from. That's a genuine advantage: the CSS-first `@theme` block can be introduced clean, with no HSL→OKLCH conversion, no `@layer base` `:root`/`.dark` migration, and no risk of the "missing `@theme inline`, `bg-primary` silently stops resolving" failure mode that shadcn-on-v4 migrations commonly hit — because there's no existing shadcn-style CSS-variable theme to break.
- **Aceternity UI** is the one component source most likely to assume Tailwind 3-era config-based theming and CSS variables under `@layer base` (its ecosystem overlaps heavily with shadcn/ui, which has documented v4 migration pain: missing `@theme inline` wrapper breaks `bg-*`/`text-*` utilities referencing CSS variables). Any component copied from there needs its color tokens re-expressed as this repo's own `@theme` variables rather than pasted as-is.
- **React Bits explicitly supports Tailwind CSS 4** per its own site copy — lowest migration friction of the four component sources for that reason alone.
- Magic UI and KokonutUI don't state a Tailwind major-version requirement explicitly on their marketing pages; treat as "probably fine, verify per component" rather than confirmed v4-native.

### Bundle size / animation library head-to-head

| Library | Reported size | License | React integration |
|---|---|---|---|
| GSAP | Not disclosed on marketing site (historically ~40-70KB core+plugins depending on what's imported; verify with a bundle-analyzer once integrated rather than trusting a marketing number) | Now free for all use (Webflow-sponsored) | First-party `useGSAP` hook, `gsap.context()` cleanup, official React docs |
| Motion | Marketing claims "APIs up to 90% smaller than GSAP" (comparative claim, not an absolute figure — treat as directional, not a spec) | MIT | First-party React support, `motion/react` import path |
| anime.js | 24.5KB v4 core, modular (Timer 5.6KB / Animation 5.2KB / Draggable 6.4KB) — most concretely-quantified of the four | Unclear on the marketing page — verify before adopting | None — vanilla JS only |
| react-spring | Not surfaced in this pass | MIT | First-party but React-19 peer-dep conflict (see above) |

Take the anime.js number as the only one independently concrete; GSAP's and Motion's figures either weren't disclosed or were comparative marketing claims — re-verify with an actual bundle analysis (`next build` + `@next/bundle-analyzer`) once a library is wired in, rather than deciding the performance budget from marketing copy alone.

### SSR / hydration behavior

- Both GSAP and Motion are safe under Next.js SSR **as long as all DOM-touching animation code runs inside a `"use client"` boundary and inside `useEffect`/`useGSAP`/`useLayoutEffect`-equivalent hooks** — nothing about either library executes during the server render pass itself, so there's no content flash or hydration-mismatch risk inherent to the library. The actual risk is homegrown: if a component sets initial CSS opacity/transform via inline styles meant to be animated *from*, and the animation library hasn't mounted yet, you get a flash of the "pre-animation" state on slow connections. Both libraries' React docs recommend setting that initial state in CSS (not JS) precisely to avoid this — worth calling out explicitly in the motion spec (PRD) as a rule, not an afterthought.
- No SSR-specific documentation was surfaced for anime.js (vanilla, no React lifecycle awareness) or react-spring in this pass; moot given both are excluded above.

## Uncertain / not independently verified

Flagging explicitly rather than presenting as confirmed:
- Exact GSAP core bundle size (marketing page didn't disclose a number).
- Motion's "90% smaller than GSAP" claim is comparative marketing copy from Motion's own site, not a third-party benchmark.
- anime.js license type (not stated on the fetched page — almost certainly MIT given its long history, but not confirmed here).
- Whether Magic UI's and KokonutUI's component catalogues carry any Tailwind v4-breaking assumptions — their marketing pages don't state a Tailwind major version, this would need per-component verification at copy-time.
