# Asset Checklist — Project Showcase

A literal, tick-through checklist for adding real project content and imagery, one project at a time. Full rationale for the format, routing, and pipeline lives in `docs/PRD.md` §9-10 — this file is the "what do I actually do" version, not a rehash of the reasoning.

**Work through this one project at a time, in any order you like.** The landing page and detail routes are already live with TODO placeholders and dimensioned grey boxes for every project — nothing is blocked waiting on all five to be ready at once.

---

## Step 0 — RESOLVED 2026-08-06

Originally this step asked which (if any) of the five domain folders mapped onto the resume-verified professional projects. Resolved: **there was no mapping to work out** — the five domain folders (`Aircraft Design`, `CubeSats and Satellites`, `Drone and Unmanned Aerial Vehicles`, `Rocket Design Technology`, `Rover`) *are* the five featured projects. The resume-verified professional work (RobotX, Aliena PMA, Space Copy ISRU, Project New Dawn, DSTA CubeSat) stays fully documented on the site — in `utils/data/experience.js`'s bullets and `utils/data/educations.js`'s achievements, where every quantified result already lived independently — but is no longer duplicated in the Projects section itself. See `docs/PRD.md` §9.5 for the full writeup.

---

## Two things needed per project: content, then assets

**Content first** (titles, descriptions, results) is what makes the page say something true. **Assets second** (images/video) is what makes it visual. You can do these in either order, but nothing in `docs/CONTENT-AUDIT.md` or the resume covers these five projects — every word of content below has to come from you, not be inferred or invented.

## Part A — Content (minimum needed per project)

For each project, in `utils/data/projects-data.js`:

1. **Project title** (`nameFull`) — a proper name if you have one (the old template had punchy names like "IntoOrbit" for the rocket-design project) — or just confirm the domain name itself is fine as the title.
2. **One-sentence description of what it is** — folded into the narrative below, doesn't need to be separate.
3. **Context** (`context`) — what kind of project this is (personal build, coursework, competition entry, etc.) and roughly when (a year or academic term is enough).
4. **Narrative** (`description`) — a short paragraph: what the goal/problem was, what you actually did, and what happened (a working prototype, a specific outcome, a competition result — whatever's true; if there's genuinely no concrete outcome yet, that's fine, just don't invent one).
5. **Tools/software** (`tools`) — a list of what you used (SolidWorks, ANSYS, specific programming languages, whatever applies).
6. **Result** (`result`, optional) — one quantified or notable fact worth calling out in the accent color on the page (a number, a placement, a measured result). Only fill this in if something real exists — the page cleanly omits the line if it's blank, so leaving it empty is a legitimate answer, not a gap.

That's the whole list — five required fields + one optional, per project, matching the same shape the resume-verified projects used before.

## Part B — Assets

### General rules (every image)

- **Formats/resolutions** (full detail in `docs/PRD.md` §10.2):
  - Hero image: JPEG (or PNG if transparent), **2400 × 1350** (16:9), ≤ 2MB source file.
  - CAD/design renders: JPEG, **1600 × 1200** (4:3), ≤ 1.5MB.
  - Simulation screenshots (CFD/FEA/thermal): PNG, **1600 × 900** (16:9), cropped tightly to the plot/chart itself — cut toolbars/menus/window chrome before exporting.
  - Results plots/figures: PNG or JPEG, **1600 × 900** (16:9), ≤ 1MB.
  - These are the exact dimensions the placeholder boxes on the live site are already built to — match them and a real image will drop in with no layout changes.
- **Filenames**: lowercase, hyphenated, category-prefixed — `hero.jpg`, `cad-01.jpg`, `sim-01.jpg`, `results-01.jpg`, `video-01.mp4`.
- **Where they go**: `public/projects/<slug>/` — slugs are `aircraft-design`, `cubesats-and-satellites`, `drone-and-unmanned-aerial-vehicles`, `rocket-design-technology`, `rover`.
- **Captions**: a one-line description of what each image shows, in your own words (e.g. "SolidWorks assembly render of the wing spar" or "CFD streamline plot showing separation at high angle of attack") — I'll turn it into the on-page caption/alt text, or write your own if you prefer.

### Video (new — full spec in `docs/PRD.md` §10.5)

- **Format**: MP4, H.264 codec. No other format needed.
- **Resolution**: cap at **1920 × 1080** (1080p) — don't export higher.
- **Compression**: aim for **≤ 8MB per clip** — compress with `ffmpeg`/HandBrake before adding to the repo (there's no server-side step that does this for you, unlike images).
- **Length**: keep it short — trim to the relevant 5-20 seconds, not a full raw recording.
- **Poster frame**: every video needs a still-frame JPEG, same rules as other images (≤1600px, ≤250KB), named to match — `video-01.mp4` → `video-01-poster.jpg`.
- **Playback**: click-to-play by default (poster shown, visitor presses play) — not autoplay. If you have a short (<10s), silent clip you specifically want treated like an animated figure instead, flag it and we can make that one exception.

### Code snippets (new — no export needed)

If a project has real code worth showing, you don't need to prepare a file at all — just send me the snippet (or a link to wherever it lives, e.g. a GitHub repo) and a one-line description of what it does. It renders as a text block among the other gallery items, not as the page's visual frame.

### How many assets per project

- **Minimum to look finished**: 1 hero image + content (Part A). The gallery categories on the detail page simply don't appear for categories with nothing in them.
- **Recommended**: hero + 4-8 gallery items across whichever categories actually apply (not every project needs CAD *and* simulation *and* video *and* code — use what's real).
- **No hard maximum.**

---

## Per-project checklist

### 1. Aircraft Design
`slug: aircraft-design`

- [ ] Part A content (title, context, narrative, tools, optional result)
- [ ] Hero image, `hero.jpg`, 2400×1350
- [ ] Gallery images/video across whichever categories apply
- [ ] Captions for each
- [ ] Drop everything in `public/projects/aircraft-design/`

### 2. CubeSats and Satellites
`slug: cubesats-and-satellites`

- [ ] Part A content
- [ ] Hero image, `hero.jpg`, 2400×1350
- [ ] Gallery images/video across whichever categories apply
- [ ] Captions for each
- [ ] Drop everything in `public/projects/cubesats-and-satellites/`

### 3. Drone and Unmanned Aerial Vehicles
`slug: drone-and-unmanned-aerial-vehicles`

- [ ] Part A content
- [ ] Hero image, `hero.jpg`, 2400×1350
- [ ] Gallery images/video across whichever categories apply
- [ ] Captions for each
- [ ] Drop everything in `public/projects/drone-and-unmanned-aerial-vehicles/`

### 4. Rocket Design Technology
`slug: rocket-design-technology`

- [ ] Part A content
- [ ] Hero image, `hero.jpg`, 2400×1350
- [ ] Gallery images/video across whichever categories apply
- [ ] Captions for each
- [ ] Drop everything in `public/projects/rocket-design-technology/`

### 5. Rover
`slug: rover`

- [ ] Part A content
- [ ] Hero image, `hero.jpg`, 2400×1350
- [ ] Gallery images/video across whichever categories apply
- [ ] Captions for each
- [ ] Drop everything in `public/projects/rover/`

---

## When you're done with a project (or all five)

Tell me which project(s) are ready — content, assets, or both — and I'll wire them in. You can send Part A content and Part B assets separately or together, whichever's easier.
