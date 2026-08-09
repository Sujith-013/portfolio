# Content Template — Copy, Fill, Send

Field names and paths below are verified against the actual code (`utils/data/projects-data.js`, `app/projects/[slug]/page.js`, `app/components/helper/asset-placeholder.jsx`, `app/components/homepage/projects/project-header.jsx`), not written from memory. If you fill this in exactly as shown, it drops into `projectsData` with no renaming.

---

## Part 1 — Content, one block per project

Copy the block below 5×, one per slug: `aircraft-design`, `cubesats-and-satellites`, `drone-and-unmanned-aerial-vehicles`, `rocket-design-technology`, `rover`. These five fields are the minimum that makes the format work — everything the page renders (`nameFull` as the `<h1>`/`<h3>` title, `context` under it, `description` as the body paragraph, `tools` as the pill row, `result` as the accent proof-point line) reads directly from these, nothing else is needed to clear a project out of placeholder.

```
### <slug>

Title (nameFull):
Context:
Narrative (description):

Tools (comma-separated):
Result (optional — leave blank if nothing quantified exists):
```

Field notes, straight from the code:
- **Title** → `project.nameFull` — rendered as the page's only `<h1>` on `/projects/<slug>` (`project-header.jsx:29`), and as the `<h3>` per project on the homepage. Also feeds the tab title (`app/projects/[slug]/page.js:18`: `"${nameFull} — Portfolio of Sujith"`).
- **Context** → `project.context` — one line under the title (`project-header.jsx:31`), e.g. "Personal build, 2024" or "Coursework, senior capstone." Keep it short; it's styled as a single mono-font line, not a sentence.
- **Narrative** → `project.description` — the one body paragraph, rendered on both the homepage card and the detail page (`project-detail-view.jsx:47`). This is the only place the "what/why/outcome" story goes — there's no separate long-form field.
- **Tools** → `project.tools`, an array. If left empty, the page silently renders a single `"TODO: tools"` pill instead of crashing (`project-showcase.jsx:44`, `project-detail-view.jsx:51`) — so an empty list is visibly wrong, not invisible.
- **Result** → `project.result`, optional. Only renders (`project-header.jsx:33`, in the accent color) if non-empty — leaving it blank cleanly omits the line rather than showing a placeholder. Per `docs/DESIGN-SYSTEM.md`'s accent rule, this should be a real quantified fact (a number, a placement, a measured outcome) or left blank — don't write a vague sentence here just to fill it.

### Worked example — dummy text, not real, format/tone reference only

```
### aircraft-design

Title (nameFull): FlexWing — Compliant Trailing-Edge Test Article
Context: Personal build, summer 2025, ~3 months
Narrative (description): Wanted to test whether a compliant flexure
mechanism could replace discrete hinged flaps on a small fixed-wing UAS
without a weight penalty. Designed and 3D-printed three rib iterations in
PETG, revising the flexure geometry after the first two cracked under
cyclic bench loading. The final version survived 200+ actuation cycles on
the bench rig and flew on a test glider for one flight before a hard
landing damaged the servo mount.

Tools (comma-separated): SolidWorks, Fusion 360, Arduino, MATLAB
Result (optional): Survived 200+ bench actuation cycles before the airframe was retired
```

That's the full expected depth: one sentence of goal, two to three of what was actually done (including a real setback if one happened — don't smooth it out), one of outcome. Not a case study, not a single line either.

Send all five blocks in one message and I'll wire them into `utils/data/projects-data.js` directly.

---

## Part 2 — Export spec

One row per asset type. Source-file targets — what you export and drop into the repo — not what a browser downloads (Next's optimizer re-compresses everything before it's served; see the note below the table).

| Asset type | Dimensions (long edge) | Format | Max source size | Destination path |
|---|---|---|---|---|
| Hero image (1 per project) | 2400 × 1350 (16:9) | JPEG, quality ~90 (PNG if transparency) | ≤ 2MB | `public/projects/<slug>/hero.jpg` |
| CAD / design render | 1600 × 1200 (4:3) | JPEG, quality ~85-90 | ≤ 1.5MB | `public/projects/<slug>/cad-01.jpg`, `cad-02.jpg`, ... |
| Simulation screenshot (CFD/FEA/thermal) | 1600px, cropped tight to the plot — no toolbars/window chrome | PNG | ≤ 1.5MB | `public/projects/<slug>/sim-01.jpg`, `sim-02.jpg`, ... |
| Results plot / figure | 1600px | PNG or JPEG | ≤ 1MB | `public/projects/<slug>/results-01.jpg`, ... |
| Video | ≤ 1920 × 1080 (1080p), trimmed to the relevant 5-20s | MP4, H.264 | ≤ 8MB | `public/projects/<slug>/video-01.mp4`, ... |
| Video poster frame | ≤ 1600px long edge | JPEG | ≤ 250KB | `public/projects/<slug>/video-01-poster.jpg` (name matches its video) |

Slugs (the `<slug>` folder name, exact): `aircraft-design`, `cubesats-and-satellites`, `drone-and-unmanned-aerial-vehicles`, `rocket-design-technology`, `rover` — verified against `utils/data/projects-data.js`'s `slug` fields and the path Next actually requests (`asset-placeholder.jsx:123`: `` `/projects/${slug}/${asset.file}` ``).

**Every entry also needs, in the data file (not exported — typed directly into `projectsData`):**
- `caption` (every asset type) — one line, what it shows, e.g. "CFD streamline plot showing separation at high angle of attack."
- `alt` (images/hero only) — shorter accessibility text; the code falls back to `caption` if you skip it (`asset-placeholder.jsx:150`), so writing a good caption alone is enough.
- Code snippets need no export at all — just `snippet` (the text), `language`, `caption`, and optionally `codeUrl` if it lives in a public repo.
- `placeholder: false` — the flag that switches an entry from the grey placeholder box to the real file. Nothing renders as real until this is set, regardless of whether `file` is filled in.

**No spec value changed as a result of the responsive or performance findings in `docs/POLISH-AUDIT.md`.** Polish pass 3 checked both directly against these exact numbers:
- **Responsive:** a 2400×1350 hero and every gallery aspect ratio scale fluidly via `aspectRatio` + `w-full` — at 380px a hero box computes to ≈213px tall, no viewport clips or forces horizontal scroll. Confirmed this format survives mobile as specced, no change needed.
- **Performance:** synthetic test images at these exact dimensions, including a deliberately worst-case gradient+noise version, ran through Next's real image optimizer at realistic widths and landed at 18-113KB served — comfortably inside the ≤400KB hero / ≤250KB gallery served-size budget (`docs/PRD.md` §10.4). The table above is exactly what was tested; export at these numbers with confidence, not caution.

Full rationale for the numbers themselves: `docs/PRD.md` §10.2 (formats/resolutions), §10.4 (performance budget), §10.5 (video). You don't need to read those to work from this table — they're the reasoning, this is the answer.
