# Start Here — Adding Project Content

One screen to work from. Detail lives in `docs/WHERE-THINGS-LIVE.md` (where things live in the code) and `docs/ASSET-CHECKLIST.md` (per-project checklists) — link out to those, don't re-read them here.

---

## 1. State of the site

Format, routing, motion, accessibility, performance, and metadata are **finished and verified** (see `docs/POLISH-AUDIT.md`, three passes). All five projects are **100% placeholder** — every title/description/tool/result is a literal `TODO:` string, every image/video slot is a grey dimensioned box. Nothing else is blocking you: the site builds clean and the pipeline is proven to work (tested end-to-end in `docs/WHERE-THINGS-LIVE.md`). The only thing between here and a finished site is you supplying content and assets, five times.

---

## 2. Decisions waiting on you

Clear these in one sitting — none of them touch project content, so they're independent of the work below.

1. **Contact form: keep it, or replace with a `mailto:` link?** It's honest (a real 503 if unconfigured, no fake success) but needs `EMAIL_ADDRESS`/`GMAIL_PASSKEY` set to actually work. **Recommendation: keep it**, set the two env vars. More capable for the same ongoing cost once configured.
2. **Resume: redact and host locally, or leave the Google Drive link?** The source PDF has three referees' names/employers/phone numbers — that's the only thing blocking moving it to `public/resume.pdf`. **Recommendation: redact and host locally** — an external link can rot or be revoked; a same-origin PDF can't.
3. **Blog section — already resolved, no action needed.** Removed entirely (the dev.to account had never posted, so it shipped an empty section). Not open.
4. **Empty social icons** (`facebook`/`twitter`/`stackOverflow`/`leetcode` in `personal-data.js`) — currently no icon renders for these (correct, not a bug). **Recommendation: leave empty** unless you actually maintain one of those accounts.
5. **Experience section order** — currently resume's own order (Archimedes first), not strict reverse-chronological. **Recommendation: leave as-is** unless you have a specific reason to prefer strict date order.

---

## 3. What I need from you, per project — copy this 5×

```
### <slug>
Title:        
Context:      (personal build / coursework / competition — rough timeframe)
Narrative:    (problem/goal → what you did → outcome. 3-6 sentences.)
Tools:        (comma-separated)
Result:       (optional — one real, quantified fact. Leave blank if none exists.)
```

**Worked example — dummy text, not real, format/tone reference only:**

```
### aircraft-design
Title:        FlexWing — Compliant Trailing-Edge Test Article
Context:      Personal build, summer 2025, ~3 months
Narrative:    Wanted to test whether a compliant flexure mechanism could
              replace discrete hinged flaps on a small fixed-wing UAS
              without a weight penalty. Designed and 3D-printed three rib
              iterations in PETG, revising the flexure geometry after the
              first two cracked under cyclic bench loading. The final
              version survived 200+ actuation cycles on the bench rig and
              flew on a test glider for one flight before a hard landing
              damaged the servo mount.
Tools:        SolidWorks, Fusion 360, Arduino, MATLAB
Result:       Survived 200+ bench actuation cycles before the airframe was
              retired
```

Send this for all five (`aircraft-design`, `cubesats-and-satellites`, `drone-and-unmanned-aerial-vehicles`, `rocket-design-technology`, `rover`) in one message if you want — I'll wire all five into `utils/data/projects-data.js` at once.

---

## 4. Export spec — keep this open next to SolidWorks

| Asset | Dimensions | Format | Max size | Goes in |
|---|---|---|---|---|
| Hero (1 per project) | 2400×1350 | JPEG (PNG if transparent) | 2MB | `public/projects/<slug>/hero.jpg` |
| CAD render | 1600×1200 | JPEG | 1.5MB | `public/projects/<slug>/cad-01.jpg`, `cad-02.jpg`... |
| Simulation screenshot | 1600×900, cropped tight (no toolbars/chrome) | PNG | 1.5MB | `public/projects/<slug>/sim-01.jpg`... |
| Results plot/figure | 1600×900 | PNG or JPEG | 1MB | `public/projects/<slug>/results-01.jpg`... |
| Video | ≤1920×1080, 5-20s trimmed | MP4/H.264 | 8MB | `public/projects/<slug>/video-01.mp4`... |
| Video poster frame | ≤1600px long edge | JPEG | 250KB | `public/projects/<slug>/video-01-poster.jpg` (match the video's number) |

These are source-file caps (what you export) — Next re-compresses everything served to a browser, so exporting exactly at these numbers is safe, not wasteful. Full rationale in `docs/PRD.md` §10.2/10.5 if you want it; you don't need it to work.

---

## 5. Add-one-asset loop

**Image:**
1. Export/crop to the spec row above → save as `public/projects/<slug>/<name>.jpg`.
2. In `utils/data/projects-data.js`, find (or add) that asset's object in the project's `assets` array.
3. Set `placeholder: false`, `file: '<name>.jpg'`, correct `width`/`height`, write `alt` + `caption`.
4. Save. Refresh `localhost:3000/projects/<slug>` — check it before moving to the next one.

**Video:**
1. Trim to 5-20s, compress to spec, export a poster JPEG too.
2. Save both: `public/projects/<slug>/video-01.mp4` + `video-01-poster.jpg`.
3. Add/edit the video asset object: `placeholder: false`, `file`, `poster`, `width`/`height`, `caption`.
4. Refresh — confirm the poster shows and it does **not** autoplay (click-to-play is correct).

**Code snippet (no export needed):**
1. Copy the snippet text, note the language.
2. Add/edit a `code`-category object: `placeholder: false`, `snippet`, `language`, `caption`, optional `codeUrl`.
3. Refresh — confirm it renders as a real text block, not the dashed placeholder.

Full field reference and a worked example: `docs/WHERE-THINGS-LIVE.md` → "Adding assets."

---

## 6. Order of work

**Recommended: write all five projects' content (§3) in one sitting first** — it's pure text, zero export risk, and it immediately replaces every `TODO:` on the live site. **Then do assets one project fully at a time**, not one pass across all five — finish one project's hero + gallery completely, check it (§7), *then* move to the next. That way an export-setting mistake (wrong crop, wrong dimensions) costs you a re-export on 3-8 images, not 40. Pick whichever project you already have the most exported/ready material for as the first one — the goal of doing one fully first is to validate your own export workflow against the real pipeline, so start where you have real files in hand, not where you have the least.

---

## 7. How to check your work

After every 2-3 assets, not just at the end:

```
npx next build          # must stay clean — a bad width/height value in
                         # the data file will usually fail the build here
npm run dev              # then open localhost:3000/projects/<slug>
```

On the page, check:
- The image is sharp and not stretched/squeezed (wrong aspect ratio in the data entry vs. the actual file is the most common mistake).
- The caption text under it matches what you meant.
- No dashed grey placeholder box where you expected a real image (means `placeholder: false` didn't get set, or the filename doesn't match).
- For video: poster frame shows, playback only starts when you click it.
- Scroll to the homepage section for that project too — the hero should match what you see on the detail page.

If something looks wrong, it's almost always one of: filename typo, `width`/`height` not matching the actual exported file, or `placeholder` left as `true`.
