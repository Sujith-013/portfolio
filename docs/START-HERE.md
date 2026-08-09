# Start Here — Adding Project Content

One screen to work from. Detail lives elsewhere — don't re-read those here, jump to them when a step below references them:
- **`docs/WHERE-THINGS-LIVE.md`** — every file path, organized by what you want to change.
- **`docs/ASSET-CHECKLIST.md`** — full per-project checklist and pipeline rationale.
- **`docs/CONTENT-TEMPLATE.md`** — the copy-five-times content fields + the full export spec table.
- **`docs/DECISIONS.md`** — five open questions (contact form, resume hosting, etc.) — none block the work below.

---

## 1. State of the site

Format, routing, motion, accessibility, performance, and metadata are **finished and verified** (`docs/POLISH-AUDIT.md`, three passes). All five projects are **100% placeholder** — every title/description/tool/result is a literal `TODO:` string, every image/video slot is a grey dimensioned box. The asset pipeline itself (manifest → `ProjectAsset` → real `<Image>`/`<video>`) is built and tested end-to-end, so wiring in a real asset is a pure data edit, not a code change. Five decisions remain open (`docs/DECISIONS.md`) but none of them block this work — the only thing left is you supplying content and assets, five times.

---

## 2. The add-one-asset loop

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
npx next build    # must stay clean — a bad width/height in the data file
                  # usually fails the build right here
npm run dev       # then open localhost:3000/projects/<slug>
```

On the page, check:
- The image is sharp, not stretched/squeezed (wrong aspect ratio vs. the real file is the most common mistake).
- The caption under it matches what you meant.
- No dashed grey placeholder box where you expected a real image (`placeholder: false` didn't get set, or the filename doesn't match).
- Video: poster frame shows, playback only starts when you click it.
- The homepage hero for that project matches what's on its detail page.

Wrong result almost always means: filename typo, `width`/`height` not matching the actual file, or `placeholder` left `true`. Full troubleshooting/paths: `docs/WHERE-THINGS-LIVE.md`.
