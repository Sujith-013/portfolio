# Deploy — Vercel Redeploy Checklist

Written for reconnecting `Sujith-013/portfolio` to Vercel after the old Vercel project (pointed at the deleted repo) was disconnected. The repo itself needed no restructuring — everything below is what was checked, what was found, and what to do in the Vercel dashboard.

---

## 1. Production build — verified for real, not just `next dev`

Ran the exact sequence a host runs: `rm -rf node_modules .next && npm ci && npm run build && npm start`, then hit every route on the running production server (not dev).

**Result: clean.** `npm ci` installs from the lockfile with no errors, `npm run build` completes with zero warnings (the only console noise is `baseline-browser-mapping`/browserslist freshness notices — unrelated to this repo, harmless), and every route returns the right status on `npm start`: `/` and all 5 `/projects/<slug>` routes → 200, `/projects/nonexistent` → 404, `POST /api/contact` → honest 503 (no env vars set), OG/Twitter/favicon routes → 200.

**One real bug found, production-reachable, and fixed.** `contact-form.jsx` built its POST URL as `` `${process.env.NEXT_PUBLIC_APP_URL}/api/contact` ``. `NEXT_PUBLIC_APP_URL` is a build-time-inlined variable — with it unset (the current state, and the state of every environment unless someone remembers to set it first), Next bakes that template literal into the shipped bundle as the *literal string* `"undefined/api/contact"`, which the browser resolves relative to the current page — never reaching the real API route. Confirmed by inspecting the actual compiled client chunk with the var unset, then confirming again with it set to a test value (the bundle content visibly changed, proving the var really does get inlined here). **Fixed:** the POST now targets a plain relative `"/api/contact"` — this call always runs in the browser on the same origin as the route, so it never needed an absolute URL or an env var at all. Verified against the real running production server: the fix is present in the actual served chunk, and the route still returns the correct honest 503.

This wasn't strictly a "production-only" failure (it would have misfired in `next dev` too, for the same reason) — it was never caught because every prior verification pass in this project POSTed to `/api/contact` directly to check the honest-503 behavior, which exercises the API route but not the frontend's own URL-building code. Worth knowing this is the kind of bug that direct-API testing can hide.

**Dependency audit run against production dependencies.** `npm audit --omit=dev` found 18 vulnerabilities, including one critical (`form-data`, via `axios@1.6.8`) and several high (`axios`, `follow-redirects`, `immutable`, `nanoid`). `npm audit fix` (non-breaking) resolved all of these — `axios` moved to `1.19.0` within its existing `^1.6.8` range, only `package-lock.json` changed, `package.json`'s declared ranges are untouched. Rebuilt and re-verified clean after.

**Four remain, not applied — all require `--force` / breaking changes:**
| Package | Fix requires | Why not applied here |
|---|---|---|
| `nodemailer` | Major bump to `9.0.5` | Breaking API changes; the contact form's send path isn't configured/tested with real credentials yet — a blind major bump here isn't a "redeploy prep" change. |
| `postcss` (via `next`) | `next@16.3.1` | Outside the currently declared Next range — a framework version bump deserves its own verification pass, not a side effect of an audit fix. |
| `sharp` | Major bump to `0.35.3` | Breaking change to the library Next's image optimizer depends on natively. |

None of these three block a redeploy — they're pre-existing, not introduced by anything in this pass — but they're a real follow-up worth scheduling deliberately rather than force-fixing here.

---

## 2. Host-specific leftovers

- **`vercel.json` / `netlify.toml` / `now.json`** — none exist. Nothing to remove.
- **`abusaid.netlify.app` (the original template author's demo link)** — grepped the full tracked repo, zero matches. Already clean from earlier polish passes.
- **Dockerfiles (`Dockerfile.dev`, `Dockerfile.prod`, `docker-compose.yml`, `.dockerignore`)** — present, and documented as a supported local workflow in `SETUP.md`'s "Docker" section. **Vercel ignores these entirely** (no `vercel.json` opts into a Docker-based build, so Vercel just runs `npm run build`/`npm start` per `package.json` — confirmed that's the only path Vercel will take). Left in place; they're not leftover cruft, they're a real parallel local-dev option, just inert for this deploy.
- **Hardcoded machine-specific absolute paths** — none found anywhere in tracked project files.
- **Dead template config, found and removed:** `next.config.js` still had `images.remotePatterns` allowlisting `res.cloudinary.com`, `media.dev.to`, and `media2.dev.to` — leftover from the original template's blog (dev.to) integration and an image host nothing in the current codebase ever used (confirmed: zero remote-image `src`s anywhere in `app/`). Also had `sassOptions.includePaths` pointing at a `styles/` directory that doesn't exist and never has since this rebuild (confirmed via git history — the file was untouched since the initial commit). Neither breaks a build, both are pure dead weight from the template. Reduced `next.config.js` to `module.exports = {}`. Rebuilt clean after.

---

## 3. Environment variables — Vercel dashboard checklist

| Variable | Read in | Required? | If missing |
|---|---|---|---|
| `EMAIL_ADDRESS` | `app/api/contact/route.js` | Optional, but both-or-neither with `GMAIL_PASSKEY` | Contact form returns an honest `503` ("not configured yet"), no crash, no silent failure. |
| `GMAIL_PASSKEY` | `app/api/contact/route.js` | Optional, paired with `EMAIL_ADDRESS` | Same as above. Must be a Gmail **app password** (`myaccount.google.com/apppasswords`), not the real account password. |
| `NEXT_PUBLIC_APP_URL` | `app/layout.js` (metadata base / OG image resolution) | Optional | Falls back to a hardcoded string that still names the *old, deleted* Vercel project (`https://sujith-portfolio-eight.vercel.app`) — **set this explicitly after your first deploy**, once Vercel assigns the new project's real URL (or your custom domain), so OG images and metadata resolve correctly instead of silently pointing at a dead project. |

**None of these are required for a working deploy.** Every one degrades honestly if left unset — the worst case with all three unset is: no contact-form email delivery (visible 503, not broken), OG image metadata pointing at the old project's URL string (cosmetic, not a crash). Nothing 500s, nothing silently lies.

`.env.example` at the repo root already lists all three with blank values — copy it to `.env` locally if you want to test the contact form end to end before setting real values on Vercel.

There is no analytics variable to set. Google Tag Manager was wired but never turned on (see `docs/DECISIONS.md` #4) and has been removed outright — the site loads no third-party scripts and collects nothing beyond what a visitor submits through the contact form.

*Not on this list:* `NODE_ENV` — read once, in `utils/hooks/use-section-reveal.js`, only to gate a `console.error` in non-production. Vercel (and `next build`/`next start`) sets this automatically; never set it manually in the dashboard.

---

## 4. Secrets — confirmed clean

- `.env` and `.env*.local` are both in `.gitignore`, confirmed via `git check-ignore -v`.
- Checked the **entire** git history (`git log --all --diff-filter=A --name-only`) for any file matching `.env*`: the only one ever committed, ever, is `.env.example` — and every value in it is blank (`KEY =`, no real values). No `.env`, `.env.local`, or any other real env file has ever been tracked.
- Broad secret-pattern scan (API-key-shaped strings, private-key headers) across every tracked code/config/doc file: zero matches. (One false positive from a base64-encoded PNG inside an SVG file was checked and dismissed — image data, not a credential.)

---

## 5. Connecting the repo in Vercel

1. **Vercel dashboard → Add New → Project.**
2. **Import Git Repository → select `Sujith-013/portfolio`.** (Already exists and is up to date — this session's commits push there once you choose to; nothing needs restructuring first.) If it's not in the list, click "Adjust GitHub App Permissions" and grant Vercel access to that repo specifically.
3. **Framework Preset** — Vercel auto-detects Next.js from `package.json`; leave Build Command (`next build`) and Output Directory as the detected defaults. Don't point it at either Dockerfile — this is a standard Next.js build, not a container deploy.
4. **Environment Variables** — add the four from the table in §3 now if you have real values ready (`EMAIL_ADDRESS`/`GMAIL_PASSKEY` to enable the contact form immediately; `NEXT_PUBLIC_GTM` only if you want analytics). `NEXT_PUBLIC_APP_URL` can't be set correctly yet — you don't know the real URL until after the first deploy — so skip it for now and come back to it (see step 6).
5. **Deploy.** First build takes the same path just verified locally: `npm ci` → `next build`. Should complete clean.
6. **After the first deploy succeeds:** copy the assigned `*.vercel.app` URL (or set up a custom domain first, if you have one), then go to Project Settings → Environment Variables and add `NEXT_PUBLIC_APP_URL` set to that real URL. Redeploy once (Vercel → Deployments → ⋯ → Redeploy) so the OG-image/metadata code picks it up — it's read at build time, so setting the env var alone isn't enough without a rebuild.

### What the first deploy will actually look like

The site is fully built and finished — routing, motion, accessibility, performance, metadata — but **all five projects are still 100% placeholder content** (`docs/START-HERE.md` §1). So the live site will show: a real hero/about/experience/skills/education/contact section, and a Projects section where every one of the five entries shows literal `TODO:` text and grey dimensioned placeholder boxes instead of images. This is expected, not a deploy failure — nothing crashes or looks broken, it just visibly says "not written yet" everywhere content hasn't landed. Once real project content and assets are added (per `docs/START-HERE.md`), every subsequent push to `main` redeploys automatically — no Vercel reconfiguration needed for that part.
