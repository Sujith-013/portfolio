# Sujith

Final-year B.Eng. (Honours) Aerospace Engineering student at Nanyang Technological University (NTU), Singapore, graduating May 2026. Incoming MSc Space Engineering student at TU Berlin (Oct 2026–Sept 2028). Working across autonomous systems, spacecraft/propulsion systems engineering, and mechanical/thermal design.

<!-- TODO: one paragraph on what actually connects RobotX perception work, ISRU thermal/FEA, propulsion micro-fluidics, and CubeSat ADCS control law into a single thread — the resume lists the domains but doesn't say why one person works across all of them. Write this yourself; don't want to guess at it. -->

This is the source for [my portfolio site](https://sujith-portfolio-eight.vercel.app/). Below is a plainer, denser version of the same information — what I've actually worked on, with the context and numbers that don't fit on a landing page.

## Work

**Archimedes Autonomous Vehicles**, Singapore — Autonomous Vehicle AI Lead (Aug 2024–Present)

Leading perception and autonomy for Archimedes' RobotX entry. Built an edge-accelerated perception stack around real-time YOLOv8 inference (>30 FPS) with extrinsic-invariant 3D projection, fusing LiDAR, camera, and IMU data asynchronously for buoy recognition in dynamic maritime conditions. Also built a hybrid autonomy framework — stochastic decision models (MDPs) combined with generative AI for adaptive mission planning — that hit >95% Mission Assurance across all 8 RobotX 2024 task scenarios. The team qualified 2nd globally for RobotX 2024.

**Space Copy**, California — Robotics Engineering Intern, ISRU (Jun–Sept 2025)

Ran high-fidelity CFD simulations of regolith melt-pool thermodynamics and elastodynamic modal/harmonic FEA (10–250 Hz) to design structural damping strategies for space-grade additive manufacturing platforms, cutting peak resonance amplification by 30%. Also engineered a reconfigurable robotic end-effector architecture with sub-2-second magnetic coupling, and authored systems-level trade studies and technical narratives for NASA NIAC and CSA ROSS ISRU proposals that helped bring in over $500K in competitive grant funding.

**Aliena**, Singapore — Space System Engineering Intern, R&D (Jan–Jun 2025)

Built a Command & Telemetry interface for PWM-driven propellant modulation with real-time oscilloscopic flow diagnostics, and empirically characterized 20/100 μm micro-fluidic restrictors for the Propellant Management Assembly across ultra-low flow regimes (0.2–20 sccm). Separately built Ground Support Equipment and precision mechanical interfaces for a segmented avionics testbed (FLATSAT), and ran environmental stress screening — thermal cycling from −40°C to 80°C — per the SpaceX Rideshare Payload User's Guide. Co-authored a paper on a second-generation compact Xenon Propellant Management Assembly for low-power Hall effect thrusters, presented at IEPC 2025 (39th International Electric Propulsion Conference, Imperial College London).

**ASTRAEUS**, Germany — Thermal & Radiation Systems Researcher (Aug 2025–Present)

Working on the DIANA project: optimizing active/passive thermal control and radiation mitigation strategies across four architectural concepts, improving projected mission survivability margins by 15%. Also running system-level trade studies with VHAB and DALUS for ECLSS modeling, cutting Equivalent System Mass by 12% and improving power efficiency by 18%.

**SEDS in NTU**, Singapore — Technical Director & Co-founder (Aug 2022–Apr 2026)

Co-founded and led the technical program. Directed Project New Dawn end-to-end, from concept to functional prototype — secured seed funding and led a cross-functional team of 40+. Built a long-range TT&C link over APRS with a 20 km tracking radius, and designed and fabricated a sub-2kg high-stiffness composite airframe using vacuum-assisted resin transfer molding and thermal curing.

<!-- TODO: project narratives with more concrete context (what the problem actually was, what specifically I decided vs. the team) belong here or in a Projects section on the site itself — resume bullets above are accurate but compressed. -->

## Notable results

- **1st place, DSTA National CubeSat Challenge 2025** (Singapore, June 2025) — engineered an ADCS control law for inertial maneuvering, a 400% improvement in pointing agility over the baseline and a significant reduction in target-acquisition latency.
- **Co-authored paper, IEPC 2025** — "Design and Testing of a Second-generation Compact Xenon Propellant Management Assembly for Low Power Hall Effect Thrusters," presented at the 39th International Electric Propulsion Conference, Imperial College London.

## Education

**Nanyang Technological University (NTU)**, Singapore — B.Eng. (Honours) Aerospace Engineering, Aug 2022–May 2026

Alongside coursework: managed a $30,000+ budget for library construction and educational programs in Trà Vinh, Vietnam, as part of an Overseas Community Engagement service project. Separately, as part of a Leadership Development Programme, designed and delivered an embedded-systems curriculum on Micro:bit platforms for STEM outreach workshops at Taman Jurong CC.

**TU Berlin**, Germany — MSc Space Engineering, Oct 2026–Sept 2028 (incoming)

## Stack

What I actually work with, day to day:

- **Languages / ML** — Python, C++, PyTorch, YOLOv8
- **Robotics / simulation** — ROS 2, Gazebo, Isaac Sim, MuJoCo, OpenCV, LiDAR/depth sensing, TensorRT
- **CAD / analysis** — SolidWorks, ANSYS, Fusion 360
- **Embedded / hardware** — MATLAB, Simulink, Arduino, Raspberry Pi
- **Tooling** — Linux, Docker, Git, Jetson/CUDA

(This is a fairly recent correction — the site's `utils/data/skills.js` still listed a generic web-development stack inherited from the template this repo started from; see `docs/CONTENT-AUDIT.md` for the full before/after.)

## About this repository

This repo is the source for my portfolio site: Next.js 16 (App Router), React 19, Tailwind CSS 4, Sass, deployed on Vercel. It started from a generic open-source portfolio template and is now standalone — most of the content it originally shipped with (a web-developer skill list, placeholder projects, template copy) is in the process of being replaced with content that actually reflects the work above.

`docs/` in this repo holds the working audit trail for that rewrite — a full extraction of what's on my resume cross-checked against what the site currently says, a triage of design/animation resources under consideration, a PRD, and a sequenced build plan. Left in place for anyone curious about the process, not just the result.

## Links

- Site: [sujith-portfolio-eight.vercel.app](https://sujith-portfolio-eight.vercel.app/)
- LinkedIn: [harirajan-sujith](https://www.linkedin.com/in/harirajan-sujith-784a861a4/)
- GitHub: [Sujith-013](https://github.com/Sujith-013)
- Email: hsujith5@gmail.com

---

<details>
<summary>Running this locally</summary>

See [SETUP.md](./SETUP.md) for prerequisites, environment variables, and Docker instructions.

</details>
