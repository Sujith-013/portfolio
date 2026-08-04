# Asset Checklist — Project Showcase

A literal, tick-through checklist for adding real project imagery, one project at a time. Full rationale for the format, routing, and pipeline lives in `docs/PRD.md` §9-10 — this file is the "what do I actually do" version, not a rehash of the reasoning.

**Work through this one project at a time, in any order you like.** Nothing here needs to happen all at once — the site keeps working with however many projects have real assets and however many still don't (a project with no assets yet just doesn't get a landing-page section/detail route until it does — that's a Stage 5.5 implementation detail, not something you need to manage).

---

## Step 0 — Blocking: the folder mapping (needed before anything else)

Your assets are organized by domain on your machine — folders named `Aircraft Design`, `CubeSats and Satellites`, `Drone and Unmanned Aerial Vehicles`, `Rocket Design Technology`, `Rover`. The five projects actually on the site are the resume-verified work: RobotX (maritime autonomous vehicle), Aliena PMA (propulsion micro-fluidics), Space Copy ISRU (regolith thermal/structural), Project New Dawn (SEDS sounding rocket), and the DSTA CubeSat Challenge (ADCS). These don't map cleanly onto your five domain folders — I can see two *plausible* overlaps and no way to confirm them without you:

| Your folder | Might belong to... | Confirmed? |
|---|---|---|
| `Rocket Design Technology` | Project New Dawn (SEDS rocket)? | **No — please confirm.** The old cut project ("IntoOrbit") this folder mapped to was described as a personal/coursework rocket-design exercise (nozzle design, case studies on other missions), which may or may not be the same hardware as the actual SEDS New Dawn rocket. |
| `CubeSats and Satellites` | DSTA National CubeSat Challenge? | **No — please confirm.** Same issue: the old project ("PocketSat") this folder mapped to was described as a coursework exercise, not necessarily the actual competition CubeSat. |
| `Aircraft Design` | *(no current project)* | No resume-verified project involves aircraft design. |
| `Drone and Unmanned Aerial Vehicles` | *(no current project)* | No resume-verified project involves drones/UAVs. |
| `Rover` | *(no current project)* | No resume-verified project involves a rover. |

**What I need from you, in plain terms:**
1. For `Rocket Design Technology` and `CubeSats and Satellites`: is the material in there actually from Project New Dawn / the DSTA Challenge specifically, or is it from a separate coursework project that isn't on the site? If it's the real thing, great — tell me and we use it. If it's a different (unlisted) project, we leave those folders alone.
2. For RobotX, Aliena PMA, and Space Copy ISRU — none of your five domain folders obviously correspond to these. Do you have assets for these three anywhere (even unsorted), or do they still need to be gathered/exported? These are 3 of your 5 featured projects, so this is the bigger gap.
3. `Aircraft Design`, `Drone and UAV`, and `Rover` (if not claimed by #1) aren't used by any current project — fine to leave alone; not a gap, just unused material for now.

Once you answer this, Step 0 is done for good — everything below is the same repeatable process per project.

---

## General rules (apply to every project, every image)

- **Formats/resolutions** (full detail in PRD §10.2):
  - Hero image: JPEG (or PNG if transparent), max **2400px** long edge, ≤ 2MB source file.
  - CAD/design renders: JPEG, max **1600px** long edge, ≤ 1.5MB.
  - Simulation screenshots (CFD/FEA/thermal): PNG, max **1600px**, **cropped tightly to the plot/chart itself** — cut the toolbars/menus/window chrome before exporting.
  - Results plots/figures: PNG or JPEG, max **1600px**, ≤ 1MB.
  - Don't export at your tool's native/maximum resolution (often 4K+) — nothing on the web uses it and it just bloats the repo. Next.js re-optimizes everything anyway; these are source-file ceilings, not what a browser ends up downloading.
- **Filenames**: lowercase, hyphenated, category-prefixed — `hero.jpg`, `cad-01.jpg`, `cad-02.jpg`, `sim-01.jpg`, `results-01.jpg`. The prefix is what groups the image on the detail page (Design & CAD / Simulation & Analysis / Results & Data), so keep it accurate.
- **Where they go**: `public/projects/<slug>/`, one folder per project (slugs listed below). Create the folder if it doesn't exist yet.
- **What I need alongside each image**: a one-line description of what it shows, in your own words — I'll turn that into the on-page caption and alt text (see PRD §10.3). Don't worry about polishing the wording, just tell me what it is (e.g. "SolidWorks assembly render of the sensor mounting bracket" or "CFD streamline plot around the regolith melt-pool, showing recirculation at the boundary"). If you'd rather write captions yourself, that's fine too — just keep them factual, matching the register of the existing project descriptions.

## How many images per project

- **Minimum to go live**: 1 hero image. That alone is enough for the landing-page section to work (detail page just won't have a gallery yet).
- **Recommended**: 1 hero + 4-8 gallery images, spread across the categories that actually apply (not every project will have all three — e.g. a pure-software project might have no "CAD" category at all).
- **No hard maximum** — "lots per project, at full resolution" was the brief; the pipeline is designed to hold that (see PRD §10.4's performance budget, which is about *served* size after optimization, not how many source files you hand over).

---

## Per-project checklist

### 1. RobotX Perception & Autonomy Stack
`slug: robotx-perception-autonomy-stack`

- [ ] Confirm source material exists (per Step 0 — likely needs gathering, no obvious existing folder)
- [ ] Pick 1 hero image (the single best shot — vehicle in the field, a key render, or a compelling result visualization)
- [ ] Export/resize/compress per the rules above, save as `hero.jpg`
- [ ] Pick 4-8 supporting images across whatever categories apply (vehicle/hardware renders → `cad-`, perception/sensor-fusion visualizations → `sim-` or `results-` as fits, mission-assurance/qualification data → `results-`)
- [ ] Export/resize/compress each, name `cad-01.jpg`, `sim-01.jpg`, `results-01.jpg` etc.
- [ ] Drop everything in `public/projects/robotx-perception-autonomy-stack/`
- [ ] Send me a one-line description of what each image shows (or write your own captions)

### 2. Second-Gen Xenon Propellant Management Assembly (Aliena)
`slug: xenon-propellant-management-assembly`

- [ ] Confirm source material exists (per Step 0 — likely needs gathering, no obvious existing folder)
- [ ] Pick 1 hero image (PMA hardware, FLATSAT setup, or a key diagram)
- [ ] Export/resize/compress, save as `hero.jpg`
- [ ] Pick 4-8 supporting images (hardware/mechanical renders → `cad-`, flow-diagnostic or oscilloscope captures → `sim-` or `results-`, environmental test data → `results-`)
- [ ] Export/resize/compress, name and drop in `public/projects/xenon-propellant-management-assembly/`
- [ ] Send descriptions/captions

### 3. ISRU Regolith Melt-Pool Thermal & Structural Analysis (Space Copy)
`slug: isru-regolith-thermal-structural-analysis`

- [ ] Confirm source material exists (per Step 0 — likely needs gathering, no obvious existing folder)
- [ ] Pick 1 hero image (a strong CFD/thermal visualization, or the additive-manufacturing hardware itself)
- [ ] Export/resize/compress, save as `hero.jpg`
- [ ] Pick 4-8 supporting images (CFD/FEA contour plots → `sim-`, end-effector/hardware renders → `cad-`, resonance-attenuation or other results data → `results-`)
- [ ] Export/resize/compress (remember: crop simulation screenshots tight to the plot), name and drop in `public/projects/isru-regolith-thermal-structural-analysis/`
- [ ] Send descriptions/captions

### 4. Project New Dawn (SEDS sounding rocket)
`slug: project-new-dawn`

- [ ] Confirm whether `Rocket Design Technology` is actually this project (per Step 0) — if yes, review what's in there; if it's a different coursework project, source New Dawn material separately
- [ ] Pick 1 hero image (rocket/airframe render or field photo)
- [ ] Export/resize/compress, save as `hero.jpg`
- [ ] Pick 4-8 supporting images (composite airframe/CAD → `cad-`, APRS telemetry range/link data → `results-`, any structural or thermal-curing analysis → `sim-`)
- [ ] Export/resize/compress, name and drop in `public/projects/project-new-dawn/`
- [ ] Send descriptions/captions

### 5. DSTA National CubeSat Challenge — ADCS Control Law
`slug: dsta-cubesat-adcs-control-law`

- [ ] Confirm whether `CubeSats and Satellites` is actually this project (per Step 0) — if yes, review what's in there; if it's a different coursework project, source DSTA material separately
- [ ] Pick 1 hero image (CubeSat hardware/render, or a pointing-agility/control-law result plot)
- [ ] Export/resize/compress, save as `hero.jpg`
- [ ] Pick 4-8 supporting images (CubeSat/ADCS hardware renders → `cad-`, control-law simulation output → `sim-`, the 400% pointing-agility result data → `results-`)
- [ ] Export/resize/compress, name and drop in `public/projects/dsta-cubesat-adcs-control-law/`
- [ ] Send descriptions/captions

---

## When you're done with a project (or all five)

Tell me which project(s) are ready and I'll wire up that project's landing-page section and detail route (Stage 5.5 in `docs/BUILD-PLAN.md`) — you don't need to wait for all five to be ready before any of them go live.
