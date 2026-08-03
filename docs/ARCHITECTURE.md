# Architecture Summary — developer-portfolio

**Stack:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Sass. Single-page portfolio with one secondary `/blog` route.

## 1. Routing (App Router)
- `app/layout.js` — root layout: fonts, global CSS, Navbar/Footer shell, toast container, GTM script, and all page metadata (title/OG/Twitter tags).
- `app/page.js` — homepage; server component that fetches dev.to blog posts, then renders 8 sections in order.
- `app/blog/page.js` — standalone page listing all dev.to posts.
- `app/not-found.jsx` — 404 page.
- `app/api/{contact,data,google}/route.js` — three Route Handlers.
- No Pages Router remnants; routing is 100% App Router.

## 2. Where content lives
| Content | File |
|---|---|
| Name, bio, designation, contact info, socials, resume link, dev.to username | `utils/data/personal-data.js` |
| Contact section socials (duplicate of above, unused) | `utils/data/contactsData.js` |
| Work experience | `utils/data/experience.js` |
| Education | `utils/data/educations.js` |
| Projects | `utils/data/projects-data.js` |
| Skills marquee list | `utils/data/skills.js` (icon lookup in `utils/skill-image.js`) |
| Profile photo | `public/profile.png`, referenced via `personalData.profile` |
| Page title / OG / Twitter meta | `app/layout.js` (hardcoded, not pulled from personal-data.js) |
| Hero "code block" skills list | hardcoded in `hero-section/index.jsx` (not data-driven) |

## 3. Component hierarchy (homepage)
`layout.js` → Navbar + `page.js` children + ScrollToTop + Footer.
Inside `page.js`: HeroSection → AboutSection → Experience → Skills → Projects → Education → Blog → ContactSection.

Each section is self-contained, importing its own data file and small card components (GlowCard, ProjectCard, BlogCard, AnimationLottie). Data flow is one-directional: `utils/data/*.js` → section `index.jsx` → card component via props.

## 4. Styling
- Tailwind 4 (via `@tailwindcss/postcss`) is the primary system. `tailwind.config.js` only extends container, a 4k breakpoint, and two gradient backgrounds — no custom colour palette, so all colours (`#16f2b3`, violet gradients) are hardcoded inline as Tailwind arbitrary values throughout components, not centralised.
- `app/css/globals.scss` — root CSS vars, body background, base styles.
- `app/css/card.scss` — glow-card hover effect (mouse-tracked).
- Font: Google Inter via `next/font`.

## 5. Leftover template artifacts
- Footer still links Star/Fork buttons to the original template author's repo.
- `README.md` is entirely the generic template README (install docs, badges pointing at said7388/developer-portfolio, broken Live Demo link). **This needs a full rewrite, not a patch** — I want the README to be an about-me document that stands on its own as a piece of the portfolio, not setup instructions for a template someone else wrote. Nobody landing on my GitHub repo needs to know how to `npm install` it. Note that the repo audience is more technical and more curious about how things were built than a recruiter skimming the live site, so the README can afford to be denser than the landing page copy — engineering detail, decisions made, things that didn't work.
- Hero section hardcoded fake terminal snippet lists React, MySQL, MongoDB, Docker, AWS — template leftover, contradicts actual background.
- `skills.js` is still the generic web-dev skill list (HTML/CSS/JS etc.) — inconsistent with actual positioning and project data.
- `personalData.designation` contradicts the `layout.js` metadata and bio.
- `.github/FUNDING.yml` still has the template author's open_collective entry.
- `projects-data.js` still carries the template's "Do not remove any property" comment block.

## 6. package.json / dependencies
Scripts: `dev`, `build`, `start`, `lint` — standard Next.js, nothing custom.
Notable: `next@16.0.10`, `react@19.2.0` (very recent), `react-icons` well behind current v5, plus axios, nodemailer, sharp, lottie-react, react-fast-marquee.
`@emailjs/browser` installed but appears unused (contact form uses own `/api/contact` + axios). `react-google-recaptcha` installed but never rendered.
Both `package-lock.json` (npm) and `pnpm-lock.yaml` (pnpm) are committed — mixed lockfiles.

## 7. Issues found
- **Dead code:** `app/components/homepage/projects/single-project.jsx` reads `project.tags/image/features` fields that don't exist on the current projectsData shape — would crash if wired up. `utils/data/contactsData.js` defined but never imported. `app/api/data/route.js` is a placeholder stub. `app/api/google/route.js` is never called from the frontend.
- **Security smell:** `app/api/google/route.js` reads `process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` — the `NEXT_PUBLIC_` prefix exposes it to the client bundle, wrong for a secret key. Moot currently, but a landmine if wired up later.
- **Broken/empty links:** `projects-data.js` has empty code/demo for every project. `personalData.facebook/twitter/stackOverflow/leetcode` are empty, so those social icons render `href=""` and link to the current page.
- **Content inconsistency:** `personalData.designation` vs `layout.js` metadata vs hero hardcoded skills vs `skills.js` all tell different stories.
- **Env vars:** `.env.example` lists `NEXT_PUBLIC_GTM`, `NEXT_PUBLIC_TELEGRAM_CHAT_ID`, `GMAIL_PASSKEY`, `EMAIL_ADDRESS` — all blank. Contact form POST will fail (400) without `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` set, so the contact form is currently non-functional.
- **Accessibility:** several `<Image>` tags use empty/generic alt text (e.g. `blog-card.jsx`; decorative SVGs use `alt="Hero"` regardless of content).
- **No test suite exists.**

## Prioritised punch list
1. Fix identity inconsistency — reconcile `personalData.designation`, `skills.js`, and the hardcoded hero code-block skills.
2. Fill in or remove empty social links.
3. Fix contact form — set real env vars locally and on the host, or simplify the API to one channel.
4. Rewrite `README.md` from scratch as an about-me / project document — who I am, what this site is, what I work on, links out. Remove Footer star/fork links and `.github/FUNDING.yml` at the same time.
5. Delete dead code — `single-project.jsx`, `contactsData.js`, `api/data/route.js`; wire up or remove `api/google/route.js` + `react-google-recaptcha` (and fix the `NEXT_PUBLIC_` secret).
6. Pick one lockfile (npm or pnpm), remove the other, commit the modified `package-lock.json`.
7. Add real project code/demo links or drop those UI affordances.
8. Minor: bump `react-icons` to v5, tidy alt text.
