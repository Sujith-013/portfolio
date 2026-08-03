# Content Audit — Resume vs. Repo

Source of truth: `Harirajan Sujith_Resume.pdf` (repo root, untracked). Everything below is checked against it, not against the site's existing copy.

## 1. Resume extraction (full)

**Identity**
- Name: Harirajan Sujith
- Current title on resume: Space System Engineer
- Nationality: Singaporean
- Contact: `hsujith5@gmail.com`, `(+65) 9748 7830`
- Portfolio link on resume: `sujith-portfolio-eight.vercel.app/` — i.e. this site is already the canonical link his resume points to
- Languages: English & Tamil (native), German (A1), French (A1)
- Hobbies: boxing, bouldering

**Education**
- Nanyang Technological University (NTU), Singapore — B.Eng. (Honours) Aerospace Engineering, Aug 2022 – May 2026 (in progress, graduating)
  - OCEP Vietnam service project: managed $30,000+ budget for library construction / educational programs in Trà Vinh
  - Leadership Development Programme: STEM outreach, Micro:bit embedded-systems curriculum for primary schoolers at Taman Jurong CC
- TU Berlin, Germany — MSc Space Engineering, Oct 2026 – Sept 2028 (**incoming**, not yet started — resume date range starts in the future relative to today, 2026-08-03)

**Experience**
1. **Archimedes Autonomous Vehicles**, Singapore — Autonomous Vehicle AI Lead, Aug 2024–Present
   - Edge-accelerated perception stack: extrinsic-invariant 3D projection, real-time YOLOv8 inference (>30 FPS), async LiDAR/Camera/IMU sensor fusion for maritime buoy recognition
   - Hybrid Autonomy Framework: Stochastic Decision Models (MDPs) + generative AI for adaptive mission planning; >95% Mission Assurance across all 8 RobotX 2024 task scenarios
   - Context: 2nd-place global qualification, RobotX 2024
2. **Space Copy**, California, US — Robotics Engineering Intern (ISRU), Jun–Sept 2025
   - High-fidelity multiphysics CFD of regolith melt-pool thermodynamics; elastodynamic modal/harmonic FEA (10–250 Hz); 30% attenuation in peak resonance amplification for space-grade additive-manufacturing platforms
   - Reconfigurable robotic end-effector architectures, <2s low-latency magnetic coupling; authored systems-level trade studies/technical narratives for NASA NIAC and CSA ROSS ISRU proposals; >$500K in competitive grant acquisition
3. **Aliena**, Singapore — Space System Engineering Intern (R&D), Jan–Jun 2025
   - Built a Command & Telemetry (C&T) interface for PWM-driven propellant modulation with real-time oscilloscopic flow diagnostics
   - Empirical characterization of 20/100 μm micro-fluidic restrictors for the Propellant Management Assembly (PMA), 0.2–20 sccm ultra-low flow regimes
   - GSE + precision mechanical interfaces for a segmented LP/HP avionics testbed (FLATSAT); Environmental Stress Screening (thermal cycling −40°C to 80°C) per SpaceX Rideshare Payload User's Guide
   - Co-authored IEPC 2025 paper: "Design and Testing of a Second-generation Compact Xenon Propellant Management Assembly for Low Power Hall Effect Thrusters"
4. **ASTRAEUS**, Germany — Thermal & Radiation Systems Researcher, Aug 2025–Present (listed under "Volunteering and Other Projects")
   - DIANA project: hit TPM targets across 4 architectural concepts; optimized ATCS/PTCS + radiation mitigation, +15% projected mission survivability margin
   - System-level trade studies using VHAB and DALUS for ECLSS modeling; 12% reduction in Equivalent System Mass, 18% improvement in power efficiency
5. **SEDS in NTU**, Singapore — Technical Director & Co-founder, Aug 2022–Apr 2026 (also under "Volunteering and Other Projects")
   - Project New Dawn: end-to-end lifecycle management, conceptual architecture → functional prototype; secured seed funding; led cross-functional team of 40+
   - Long-range TT&C link via APRS, 20 km tracking radius; designed/fabricated a <2 kg high-stiffness composite airframe using VARTM + thermal curing

**Honours & Awards**
- DSTA National CubeSat Challenge 2025, Singapore — **1st Place**, June 2025. Engineered an optimized ADCS control law for inertial maneuvering: 400% improvement in pointing agility, significant reduction in target-acquisition latency.

**Publications**
- Co-authored, IEPC 2025 (39th International Electric Propulsion Conference, Imperial College London) — presenting in person.

**Credentials / short trainings**
- ISRO training: automated GEOINT/PNT pipelines in Python/R; multispectral satellite-data processing and spatial modeling in QGIS/ENVI
- USAFA professional training: HIL verification for FalconSAT avionics; RF protocols and agile workflows for flight-representative hardware integration
- University of Toronto AV Specialization: full-stack AV frameworks in CARLA SIL; multi-modal state estimation and hierarchical motion planning for semantic navigation

**Technical proficiency (verbatim groupings from resume)**
- Python, C++, PyTorch, YOLOv8
- ROS 2, Gazebo, Isaac Sim, MuJoCo
- OpenCV, LiDAR/Depth, TensorRT
- SolidWorks, ANSYS, Fusion 360
- MATLAB, Simulink, Arduino, Raspberry Pi
- Linux, Docker, Git, Jetson/CUDA
- MS Office, Google Workspace, Canva

**Soft-skill narrative** ("Job Related Abilities"): communication/stakeholder management (4+ yrs), systems-engineering V-model expertise, cross-functional team leadership, ownership/innovation (4+ yrs turning theory into flight-representative prototypes), contract/grant negotiation (2+ yrs), public speaking (IEPC presentation, directed a pan-Asian leadership summit for 400+ delegates / 60+ universities).

**What's on the resume but NOT web-safe as-is** — see the housekeeping section at the end.

## 2. Three-column audit

### `utils/data/personal-data.js`

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| `name` | "Sujith" | Harirajan Sujith | Keep "Sujith" for casual display copy if that's the preferred short form, but full legal name should appear at least once (footer/meta) — confirm which you want as the primary display name. |
| `designation` | "Software Developer" | Space System Engineer | "Space Systems Engineer" or similar — this is the single worst inconsistency in the file: it directly contradicts the bio two lines below it and the site's own `<title>` in `layout.js`. |
| `description` (bio) | Already rewritten to: "Systems Engineer dedicated to the architecture and verification of mission-critical aerospace and robotic platforms..." | Matches the spirit of the resume (aerospace/robotics, hardware-software integration, extreme environments) | This is essentially correct and resume-consistent already — good baseline, no resume contradiction found. Minor: it's generic enough that it doesn't name a single concrete achievement (RobotX, CubeSat win, IEPC paper) — a strong hero deserves one concrete proof point, not only positioning language. |
| `email` | `hsujith5@gmail.com` | Same | Correct, matches. |
| `github` | `https://github.com/Sujith-013` | Not listed on resume | Presumably correct — resume just doesn't carry it. |
| `facebook` | `''` | Not listed | Leave empty and hide the icon, don't fake a link. |
| `linkedIn` | populated | Not listed on resume (resume only lists the portfolio URL) | Fine to keep if it's really yours — just note the resume itself doesn't corroborate it. |
| `twitter`, `stackOverflow`, `leetcode` | all `''` | Not listed | Same as facebook — empty means dead `href=""` icons currently (per architecture audit). Either fill in or remove the icons. |
| `devUsername` | "Sujith-013" | n/a (dev.to not mentioned) | This entire dev.to blog integration is a template feature with no resume basis — decide if you actually want a dev.to blog section on an aerospace portfolio, or if it's vestigial. |
| `resume` | Google Drive link (`drive.google.com/file/d/1VWUT.../view`) | n/a | See housekeeping Q1 below — should point to a same-origin `/resume.pdf` under `public/`, not an external Drive link that can rot or be revoked. |

### `utils/data/experience.js`

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| Entries present | 5 entries: ASTRAEUS, Archimedes AV, Space Copy, Aliena, "SEDS in NTU" | Same 5 roles appear on resume | Roles and companies are already correctly sourced from the resume — good, this file is not template leftover. |
| Entry #5 shape | `{ title: "SEDS in NTU, Singapore", company: "Technical Director & Co-founder", duration: "(Aug 2022 - April 2026)" }` | Resume lists it as: SEDS in NTU (company) — Technical Director & Co-founder (title) | **Title and company fields are swapped** relative to every other entry in this same array — a rendering bug waiting to happen if the card component assumes a fixed field meaning, and inconsistent with entries #1–4 which correctly put the job title in `title` and the org in `company`. |
| Ordering | ASTRAEUS (Aug 2025) listed first, before Archimedes (Aug 2024) | Resume lists Archimedes first (primary "Experience" section), ASTRAEUS is under "Volunteering and Other Projects" further down | Current file sorts by nothing obvious (not chronological, not by resume order, not by seniority). Decide: reverse-chronological is the standard convention for an experience section and would put Archimedes AV (current, most senior "Lead" title) first. |
| Descriptions/bullets | None — file only has title/company/duration, no bullet content | Rich, specific bullets exist on resume for every role | **This is the biggest content gap in the whole repo.** The file structure has no field for achievement bullets at all, so none of the YOLOv8/sensor-fusion/FEA/grant-acquisition/CubeSat-caliber detail from the resume is on the site. Whatever component renders this needs a `bullets: []` (or similar) field added, and every entry populated. |

### `utils/data/educations.js`

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| TU Berlin entry | "MSc Space Engineering", "2026 - 2028" | Oct 2026 – Sept 2028 | Correct, matches — but this is a **future/incoming** program, not completed or in-progress the way the phrasing "2026 - 2028" implies without qualification. Consider a visual/label distinction ("Incoming") so it doesn't read as already underway. |
| NTU entry | "B.Eng.(Honours) Aerospace Engineering", "2022 - 2026" | Aug 2022 – May 2026 | Correct, matches. Currently in progress (graduating ~May 2026, i.e. before TU Berlin starts) — worth stating "expected" since today's date is 2026-08-03 and the resume's own May-2026 graduation date has technically passed as of now; confirm actual graduation status is current. |
| Honours/achievements per entry | None | DSTA CubeSat 1st place, OCEP Vietnam project, STEM/Micro:bit outreach are all tied to the NTU period | Same gap pattern as experience.js — no bullet/achievement field exists, so none of this rich, resume-sourced detail (which is exactly the kind of proof-point a recruiter or admissions committee wants) makes it onto the page. |

### `utils/data/projects-data.js`

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| Content | 5 projects: Marsbound (rover), IntoOrbit (rocket design), PocketSat (CubeSat), DroneQuest (UAV), FlightCraft (aircraft) — all framed as personal coursework/self-study projects (SolidWorks/ANSYS/MATLAB/Simulink exercises with named case studies like Pragyan Rover, Chandrayaan-3) | **None of these five projects appear anywhere on the resume.** The resume's actual project-shaped work is: RobotX perception stack, ISRU thermal/FEA work, PMA micro-fluidics, DSTA CubeSat win (real, flown/competed), Project New Dawn (SEDS rocket, APRS TT&C, composite airframe) | These are not "template leftover" in the generic sense (they're not React/MySQL boilerplate) — they read as previously-authored personal/coursework content, plausible and on-topic for an aerospace engineer, but **unverifiable against the resume and not the strongest available material.** The DSTA CubeSat win, Project New Dawn, and the Archimedes/Aliena/Space Copy work are all resume-verified, quantified, and more impressive than unnamed coursework exercises — they should be the featured projects, with Marsbound/IntoOrbit/etc. demoted to a secondary "coursework" list or cut. |
| `role`, `code`, `demo` | Empty string on every entry | n/a | Confirmed dead per architecture audit — either populate with real repo/demo links (SEDS GitHub? RobotX writeup? IEPC paper PDF?) or remove the affordance from the card UI entirely. Do not ship visible-but-empty links. |
| Template comment block | "Do not remove any property..." boilerplate at the bottom of the file | n/a | Leftover instruction text aimed at a generic template's contributors — delete, it has no purpose in a personal repo. |

### `utils/data/skills.js`

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| Full list | HTML, CSS, Javascript, Typescript, React, Next JS, Tailwind, MongoDB, MySQL, PostgreSQL, Git, AWS, Bootstrap, Docker, Go, Figma, Firebase, MaterialUI, Nginx, Strapi | Python, C++, PyTorch, YOLOv8, ROS 2, Gazebo, Isaac Sim, MuJoCo, OpenCV, LiDAR/Depth, TensorRT, SolidWorks, ANSYS, Fusion 360, MATLAB, Simulink, Arduino, Raspberry Pi, Linux, Docker, Git, Jetson/CUDA | **Total mismatch bar Docker and Git.** This is the generic template's default web-stack skill list, unedited. Every one of HTML/CSS/JS/TS/React/NextJS/Tailwind/Mongo/MySQL/Postgres/AWS/Bootstrap/Go/Figma/Firebase/MaterialUI/Nginx/Strapi is either unverifiable against the resume or actively contradicts the resume's "Technical Proficiency" list. Replace wholesale with the resume's actual stack (Python/C++/ROS2/PyTorch/SolidWorks/ANSYS/MATLAB/etc.), grouped by category (languages/ML, robotics/sim, CAD/FEA, embedded/hardware, tooling) rather than one flat marquee — the resume itself is already grouped this way. |
| Trailing comment block | Full alphabetical list of ~80 "AVAILABLE SKILLS" icon names (Illustrator, Svelte, GCP, Sketch, Unity, etc.) with an instruction to raise a GitHub issue if a needed skill icon is missing | n/a | Pure template scaffolding for the upstream `developer-portfolio` project's icon system. If the icon-lookup mechanism (`utils/skill-image.js`) is kept, it needs to be re-pointed at aerospace/robotics-relevant icons (Python, ROS, SolidWorks, ANSYS, etc. — check if `react-icons`/simple-icons even has brand icons for these; many won't, so a custom icon set or text-only skill tags may be unavoidable). This comment block itself should be deleted regardless. |

### Hero section hardcoded skill list (`app/components/homepage/hero-section/index.jsx`)

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| Fake terminal `skills:` array | React, MySql, MongoDB, Docker, AWS (hardcoded JSX, not data-driven) | Not one of these except Docker appears on the resume | Same failure mode as `skills.js` but worse, because it's hand-typed directly into the hero — the single most-seen part of the page — and isn't even wired to the data file, so fixing `skills.js` alone won't fix this. Needs its own edit, and arguably should just import from a shared skills data source instead of hardcoding a second, independently-drifting list. |

### `app/layout.js` metadata

| Field | Currently says | Resume says | Should say |
|---|---|---|---|
| `title` | "Portfolio of Sujith - Space Systems Engineer" | Space System Engineer | Already correct and resume-aligned — **this is the one place in the whole codebase that already tells the truth**, which is precisely why it clashes so badly with `personalData.designation: "Software Developer"` a few files away. Fix the other file to match this one, not the reverse. |
| `description` / OG / Twitter descriptions | "Space systems, robotics, autonomy, and engineering portfolio of Sujith." | Consistent with resume's actual domains (space systems, robotics — RobotX/AV work counts as autonomy) | Accurate, keep. Could be sharpened with one concrete signal (RobotX 2024, DSTA CubeSat win) instead of staying at the category level, but not wrong. |
| OG/Twitter image | `/profile.png`, alt "Portfolio of Sujith" | n/a | Functionally fine; depends on `public/profile.png` actually being a current, presentable headshot (matches resume photo?) — verify the file is current, not a placeholder. |

## 3. What the resume does NOT cover — gaps you'll need to supply

The resume is a dense, quantified list of roles and outcomes. It is **not** a positioning statement or a set of ready-to-publish project narratives. Specifically missing, that a strong landing page needs:

1. **A single-sentence positioning statement** — what unifies "autonomous maritime robotics," "ISRU thermal/mechanical engineering," "propulsion micro-fluidics," and "CubeSat ADCS control law"? The resume lists domains; it doesn't say *why* one person spans all of them or what that breadth means for a reader in 20 seconds. You'll need to write this — it's the thesis of the hero section.
2. **Project narratives with context and outcome**, prose-shaped, for the site's featured-work section: for each of RobotX, the CubeSat win, Project New Dawn, and the ISRU/Aliena internships — what was the *problem*, what did *you specifically* do (resume bullets are compressed and jargon-dense; a reader needs one plain-language sentence per project before the technical detail), and what happened as a result. The resume's bullets are raw material, not finished copy.
3. **Visual assets**: no photos/renders/diagrams of any of this work exist in `public/` — the current image assets (`public/image/ayla.jpg`, `crefin.jpg`, `real-estate.jpg`, `travel.jpg`, `portfolio.gif`, `card.png`, `screen.png`) are unrelated template stock photos for generic web-dev projects that don't exist in your data anymore. You'll need real photos/diagrams/CAD renders of the rover work, RobotX vehicle, CubeSat, PMA hardware, etc., or intentionally-designed abstract/technical graphics standing in for them.
4. **Explicit permission/scope on the references** — three named people with personal phone numbers are on the resume; decide whether any of that belongs anywhere near a public site (almost certainly not — see housekeeping).
5. **A decision on the dev.to blog integration** — nothing on the resume suggests you write publicly; if that's true, decide whether `/blog` stays, becomes a static "writing" placeholder, or is removed.
6. **Confirmation of current status claims** — "graduating May 2026" and a few "Present" end-dates need a decision about how they read as of *today* (2026-08-03), since some listed end-dates have technically already passed and others ("Present" roles) need to be double-checked as still current before publishing.

## 4. Housekeeping — the resume file itself

**(1) Where the PDF should live / what `personalData.resume` should point to**

The file is currently `Harirajan Sujith_Resume.pdf` in the repo root — untracked (shows as untracked in `git status`), so it isn't in git and isn't served by Next.js's static file server (`public/` is the only directory Next.js serves as-is). Right now nothing on the site can actually link to it.

- Move it into `public/`, e.g. `public/resume.pdf` (drop spaces/special characters from the filename — URL-unfriendly as-is).
- Point `personalData.resume` at the same-origin path `/resume.pdf` instead of the current Google Drive share link. Same-origin is more reliable (no dependency on Drive sharing settings staying "anyone with the link" forever, no Google interstitial/redirect, works if you ever want to `<a download>` it), and it's the obvious choice since the file is already sitting in the repo waiting to be committed.
- Decide before committing: do you want the **exact PDF as-is** (with the reference phone numbers, home country, etc.) publicly downloadable? That leads directly into question 2.

**(2) What's in the file that you should think twice about before it's public**

Reading it plainly, the PDF contains:
- Your personal mobile number: `(+65) 9748 7830`
- Your personal email: `hsujith5@gmail.com` (this one's already public in `personalData.email`, so no new exposure there)
- Nationality: Singaporean
- **Three named references, each with full name, title/employer, and personal mobile number**: Edgar J. Danaraj (ex-SAESL/Pratt & Whitney), Dr. George-Cristian Potrivitu (CTO, Aliena), Madison C. Feehan (Founder/CEO, Space Copy, ex-NASA). These are **other people's personal contact details**, not yours — publishing them on a public GitHub repo and a public URL exposes third parties who did not necessarily consent to that, and is the single highest-severity item in this file.
- No home address is present on the resume itself (contrast with `personalData.address` in the codebase, which does contain a street-level Singapore address that isn't even on the resume — see the audit table above, that's a separate and arguably worse exposure already live on the site today).

No stripping done — this is entirely your call. If you want a public-facing copy, the reference block (names, titles, and phone numbers) is the part I'd flag as needing removal or redaction before it sits at a public URL; your own phone number is a smaller, personal-risk-tolerance decision.
