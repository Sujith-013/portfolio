# Start Here — Adding Project Content

One screen to work from. Detail lives elsewhere — don't re-read those here, jump to them when a step below references them:
- **`docs/WHERE-THINGS-LIVE.md`** — every file path, organized by what you want to change.
- **`docs/ASSET-CHECKLIST.md`** — full per-project checklist and pipeline rationale.
- **`docs/CONTENT-TEMPLATE.md`** — the copy-five-times content fields + the full export spec table.
- **`docs/DECISIONS.md`** — two open questions (resume hosting, GTM analytics) plus three already resolved — none block the work below.

---

## 0. Reference implementation — `aircraft-design`

`aircraft-design` is fully wired up with dummy content — every field, all 8 assets (hero, 2 CAD, 2 simulation, 1 results, 1 video + poster, 1 code snippet), every caption. Every dummy value is prefixed `[DUMMY]` in the data and the images themselves are labelled on their face ("DUMMY — CAD RENDER 01" etc., generated placeholders, not real renders). It exists purely to show the finished shape end to end — read it (`utils/data/projects-data.js`, first project) and look at it live (`/projects/aircraft-design`) before starting your own. It is **not** real progress on that project; replace it the same way you'd fill in any other, piece by piece, per §2 below.

Format verdict from building it fully populated (desktop and mobile): **holds, one fix already made.** A category with only one asset (results, video, code — the default shape) used to sit left-aligned with a dead gap in the 2-column gallery grid on desktop; fixed so a lone asset now spans the full row (`project-detail-view.jsx`, `sm:only:col-span-2`) — no export change needed, so unless you *want* a second results/video shot, one is enough. The full detail page runs long on mobile once every section is populated (~7 stacked images/video/code, single column) — expected for a deep-dive page you navigate to deliberately, not a problem; the homepage teaser (`ProjectShowcase`) stays short by design — hero, description, tools, one link, no gallery — so the homepage itself never gets long no matter how full a project's detail page is.

---

## 1. State of the site

Format, routing, motion, accessibility, performance, and metadata are **finished and verified** (`docs/POLISH-AUDIT.md`, three passes; gallery grid balance re-verified building the reference above). Real content for all five projects is still **100% TODO** — `aircraft-design` additionally carries the full `[DUMMY]` reference build described in §0, the other four are untouched grey placeholder boxes and literal `TODO:` strings. The asset pipeline itself (manifest → `ProjectAsset` → real `<Image>`/`<video>`) is built and tested end-to-end, so wiring in a real asset is a pure data edit, not a code change. Two decisions remain open (resume hosting, GTM analytics — `docs/DECISIONS.md`) but neither blocks this work — the only thing left is you supplying content and assets, five times (four, plus replacing the reference dummy on the fifth).

---

## 2. The add-one-asset loop

**First time touching a project's assets:** every project except `aircraft-design` still has `assets: demoAssets()` — a shared function call, not an array you can edit entries in directly (the four remaining projects reuse it). Before step 2 below, replace that one line with the literal array it produces (copy the 7 `placeholderAsset(...)` lines straight out of `demoAssets()`'s own definition, a few lines up in the same file) — now you have real objects to edit, and editing one project's copy never touches the others. `aircraft-design`'s `assets` array is already a literal array of 7 fully-filled `[DUMMY]` objects (§0) — use its shape as the concrete example of what your own array should look like once real.

**Image:**
1. Export/crop to spec (`docs/CONTENT-TEMPLATE.md` Part 2) → save as `public/projects/<slug>/<name>.jpg`.
2. In `utils/data/projects-data.js`, find (or add) that asset's object in the project's `assets` array.
3. Set `placeholder: false`, `file: '<name>.jpg'`, the real `width`/`height`, and write `caption` (+ `alt`, optional — falls back to `caption`).
4. Save, refresh `localhost:3000/projects/<slug>`, check it before moving to the next one.

**Video:**
1. Trim to 5-20s, compress to spec, export a poster JPEG (same name + `-poster`, e.g. `video-01.mp4` → `video-01-poster.jpg`).
2. Save both under `public/projects/<slug>/`.
3. Add/edit the video's object: `placeholder: false`, `file`, `poster`, `width`/`height`, `caption`.
4. Refresh — confirm the poster shows and playback only starts on click (no autoplay).

**Code snippet (no export):**
1. Copy the snippet text, note the language.
2. Add/edit a `code`-category object: `placeholder: false`, `snippet`, `language`, `caption`, optional `codeUrl`.
3. Refresh — confirm it renders as a real text block, not the dashed placeholder.

---

## 3. Order of work

**Write all five projects' content first** (`docs/CONTENT-TEMPLATE.md` Part 1) — pure text, zero export risk, and it clears every `TODO:` on the live site in one sitting. **Then do assets one project fully at a time**, not one pass across all five — that way a bad export setting (wrong crop, wrong dimensions) costs you a re-export on 3-8 images, not 40. Start asset work on whichever project you already have the most exported/ready material for — the point of finishing one fully first is to validate your actual export workflow against the real pipeline, so start where you have real files in hand, not where you have the least.

---

## 4. How to check your work

After every 2-3 assets, not just at the end:

```
npm run check     # instant — catches missing files, wrong dimensions, oversized
                  # exports, missing posters, and half-filled content by name
npx next build    # must stay clean too — a bad width/height occasionally only
                  # surfaces here
npm run dev       # then open localhost:3000/projects/<slug>
```

**`npm run check` is the fast one — run it constantly, not just before a commit.** It reads `utils/data/projects-data.js` and checks it against `docs/CONTENT-TEMPLATE.md`'s spec directly: every real (`placeholder: false`) asset's file actually exists on disk, its actual pixel dimensions match what the data file declares, it's under the export-spec size cap, every real video has a real poster frame, and no real asset's caption is still the literal `TODO` text. It prints one line per project (✅/❌) plus a specific reason for every failure — e.g. `rover: hero image missing at public/projects/rover/hero.jpg` — never a stack trace. Placeholder projects/assets you haven't gotten to yet are never reported as errors, only real ones that are actually broken. Exit code is non-zero the moment anything's wrong, zero when everything's clean, so it's safe to run after every single edit.

On the page itself, additionally check:
- The image is sharp, not stretched/squeezed (`npm run check` catches a declared/actual mismatch, but eyeball it anyway).
- The caption under it matches what you meant.
- No dashed grey placeholder box where you expected a real image (`placeholder: false` didn't get set, or the filename doesn't match).
- Video: poster frame shows, playback only starts when you click it.
- The homepage hero for that project matches what's on its detail page.

Wrong result almost always means: filename typo, `width`/`height` not matching the actual file, or `placeholder` left `true` — `npm run check` names the exact one. Full troubleshooting/paths: `docs/WHERE-THINGS-LIVE.md`.

**Also worth knowing:** a malformed real asset (missing file, missing/invalid `width`/`height`, an empty code snippet) degrades to the grey placeholder box instead of crashing the page — you'll see a specific warning in the terminal running `npm run dev` (not a browser error) telling you exactly which project and field. `npm run check` will have already caught the same thing by name before you got that far.
