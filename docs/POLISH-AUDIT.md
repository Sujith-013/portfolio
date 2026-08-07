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
