// Personal/passion projects — NOT resume-verified. Nothing below was
// invented: titles, descriptions, context, tools, and results are all
// marked TODO until Sujith supplies them (see docs/ASSET-CHECKLIST.md).
// The `name`/`domain` fields are the one thing that's already true — they're
// the project categories/folder names Sujith gave directly.
//
// The resume-verified professional work formerly listed here (RobotX,
// Aliena PMA, Space Copy ISRU, Project New Dawn, DSTA CubeSat) was NOT
// deleted from the site — it lives in utils/data/experience.js (bullets)
// and utils/data/educations.js (achievements), where every quantified
// result (RobotX 2nd place, 95% mission assurance, IEPC 2025 paper, DSTA
// 1st place / 400% pointing agility) already appears verbatim or better.

const placeholderAsset = (category, width, height, extra = {}) => ({
  category,
  placeholder: true,
  width,
  height,
  caption: 'TODO',
  ...extra,
});

const demoAssets = () => [
  placeholderAsset('cad', 1600, 1200),
  placeholderAsset('cad', 1600, 1200),
  placeholderAsset('simulation', 1600, 900),
  placeholderAsset('simulation', 1600, 900),
  placeholderAsset('results', 1600, 900),
  placeholderAsset('video', 1920, 1080, { video: true }),
  placeholderAsset('code', null, null),
];

export const projectsData = [
  {
    id: 1,
    slug: 'aircraft-design',
    domain: 'Aircraft Design',
    name: 'Aircraft Design',
    nameFull: 'TODO: project title',
    context: 'TODO: project type (personal/coursework/etc.) + rough timeframe',
    result: '', // TODO (optional) — a real quantified/notable result, if one exists. Leave blank if none — the accent proof-point line won't render.
    description: 'TODO: problem/goal, your approach, and outcome — see docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [], // TODO: tools/software used
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO' },
    assets: demoAssets(),
  },
  {
    id: 2,
    slug: 'cubesats-and-satellites',
    domain: 'CubeSats and Satellites',
    name: 'CubeSats and Satellites',
    nameFull: 'TODO: project title',
    context: 'TODO: project type (personal/coursework/etc.) + rough timeframe',
    result: '',
    description: 'TODO: problem/goal, your approach, and outcome — see docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO' },
    assets: demoAssets(),
  },
  {
    id: 3,
    slug: 'drone-and-unmanned-aerial-vehicles',
    domain: 'Drone and Unmanned Aerial Vehicles',
    name: 'Drone and UAV',
    nameFull: 'TODO: project title',
    context: 'TODO: project type (personal/coursework/etc.) + rough timeframe',
    result: '',
    description: 'TODO: problem/goal, your approach, and outcome — see docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO' },
    assets: demoAssets(),
  },
  {
    id: 4,
    slug: 'rocket-design-technology',
    domain: 'Rocket Design Technology',
    name: 'Rocket Design Technology',
    nameFull: 'TODO: project title',
    context: 'TODO: project type (personal/coursework/etc.) + rough timeframe',
    result: '',
    description: 'TODO: problem/goal, your approach, and outcome — see docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO' },
    assets: demoAssets(),
  },
  {
    id: 5,
    slug: 'rover',
    domain: 'Rover',
    name: 'Rover',
    nameFull: 'TODO: project title',
    context: 'TODO: project type (personal/coursework/etc.) + rough timeframe',
    result: '',
    description: 'TODO: problem/goal, your approach, and outcome — see docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO' },
    assets: demoAssets(),
  },
];
