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
    // REFERENCE IMPLEMENTATION — see docs/START-HERE.md §0. Every field
    // and asset below is dummy content generated to prove the fully
    // populated format out before real assets exist for any project.
    // None of this is Sujith's real project — replace every field marked
    // [DUMMY] with real content the same way the other four projects are
    // filled in from docs/CONTENT-TEMPLATE.md. The text itself is the
    // exact worked example already shown in CONTENT-TEMPLATE.md Part 1.
    id: 1,
    slug: 'aircraft-design',
    domain: 'Aircraft Design',
    name: 'Aircraft Design',
    nameFull: '[DUMMY] FlexWing: Compliant Trailing-Edge Test Article',
    context: '[DUMMY] Personal build, summer 2025, ~3 months',
    result: '[DUMMY] Survived 200+ bench actuation cycles before the airframe was retired',
    description:
      '[DUMMY — reference example content, not real] Wanted to test whether a compliant flexure ' +
      'mechanism could replace discrete hinged flaps on a small fixed-wing UAS without a weight ' +
      'penalty. Designed and 3D-printed three rib iterations in PETG, revising the flexure geometry ' +
      'after the first two cracked under cyclic bench loading. The final version survived 200+ ' +
      'actuation cycles on the bench rig and flew on a test glider for one flight before a hard ' +
      'landing damaged the servo mount.',
    tools: ['SolidWorks', 'Fusion 360', 'Arduino', 'MATLAB'],
    hero: {
      file: 'hero.jpg',
      width: 2400,
      height: 1350,
      alt: '[DUMMY] Placeholder hero render for the FlexWing reference project',
      placeholder: false,
    },
    assets: [
      {
        category: 'cad',
        placeholder: false,
        file: 'cad-01.jpg',
        width: 1600,
        height: 1200,
        caption: '[DUMMY] CAD render 01: flexure rib assembly, exploded view',
      },
      {
        category: 'cad',
        placeholder: false,
        file: 'cad-02.jpg',
        width: 1600,
        height: 1200,
        caption: '[DUMMY] CAD render 02: trailing-edge flexure geometry, iteration 3',
      },
      {
        category: 'simulation',
        placeholder: false,
        file: 'sim-01.jpg',
        width: 1600,
        height: 900,
        caption: '[DUMMY] Simulation 01: FEA stress plot at max deflection (placeholder figure)',
      },
      {
        category: 'simulation',
        placeholder: false,
        file: 'sim-02.jpg',
        width: 1600,
        height: 900,
        caption: '[DUMMY] Simulation 02: cyclic load thermal placeholder figure',
      },
      {
        category: 'results',
        placeholder: false,
        file: 'results-01.jpg',
        width: 1600,
        height: 900,
        caption: '[DUMMY] Results plot: bench actuation cycle count vs. rib iteration (placeholder data)',
      },
      {
        category: 'video',
        placeholder: false,
        video: true,
        file: 'video-01.mp4',
        poster: 'video-01-poster.jpg',
        width: 1280,
        height: 720,
        caption: '[DUMMY] Bench actuation test, iteration 3, 8s clip (placeholder video)',
      },
      {
        category: 'code',
        placeholder: false,
        language: 'C++ (Arduino)',
        caption: '[DUMMY] Flexure servo control loop: placeholder snippet, not real project code',
        snippet:
          '// [DUMMY] placeholder snippet, reference formatting only, not real project code\n' +
          '// Reads a bench-load cell and holds the flexure at a commanded deflection\n' +
          '// angle via a simple proportional loop.\n\n' +
          'const int LOAD_CELL_PIN = A0;\n' +
          'const int SERVO_PIN = 9;\n' +
          'const float KP = 0.85;\n\n' +
          'Servo flexureServo;\n' +
          'float targetDeflectionDeg = 12.0;\n\n' +
          'void setup() {\n' +
          '  flexureServo.attach(SERVO_PIN);\n' +
          '  Serial.begin(9600);\n' +
          '}\n\n' +
          'void loop() {\n' +
          '  float measuredDeg = readDeflectionDeg(LOAD_CELL_PIN);\n' +
          '  float error = targetDeflectionDeg - measuredDeg;\n' +
          '  float command = constrain(90 + KP * error, 0, 180);\n' +
          '  flexureServo.write(command);\n' +
          '  Serial.println(measuredDeg);\n' +
          '  delay(20);\n' +
          '}\n',
      },
    ],
  },
  {
    id: 2,
    slug: 'cubesats-and-satellites',
    domain: 'CubeSats and Satellites',
    name: 'CubeSats and Satellites',
    nameFull: 'TODO: project title',
    context: 'TODO: project type (personal/coursework/etc.) + rough timeframe',
    result: '',
    description: 'TODO: problem/goal, your approach, and outcome. See docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO', placeholder: true },
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
    description: 'TODO: problem/goal, your approach, and outcome. See docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO', placeholder: true },
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
    description: 'TODO: problem/goal, your approach, and outcome. See docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO', placeholder: true },
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
    description: 'TODO: problem/goal, your approach, and outcome. See docs/ASSET-CHECKLIST.md for exactly what to send.',
    tools: [],
    hero: { file: 'hero.jpg', width: 2400, height: 1350, alt: 'TODO', placeholder: true },
    assets: demoAssets(),
  },
];
