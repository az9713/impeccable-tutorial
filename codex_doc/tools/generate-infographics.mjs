import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('codex_doc/infographics');
fs.mkdirSync(OUT_DIR, { recursive: true });

const W = 1600;
const H = 1000;
const paper = '#f8f4ef';
const ink = '#211f20';
const muted = '#6d6667';
const line = '#d8ceca';
const magenta = '#d1197a';
const blush = '#f7d8e8';
const white = '#fffdf9';
const green = '#16835a';
const blue = '#2468b2';
const amber = '#9b6a08';

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function text(x, y, value, opts = {}) {
  const {
    size = 30,
    weight = 500,
    fill = ink,
    family = 'Instrument Sans, Arial, sans-serif',
    anchor = 'start',
    style = '',
  } = opts;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" style="${style}">${esc(value)}</text>`;
}

function lines(x, y, values, opts = {}) {
  const size = opts.size ?? 24;
  const gap = opts.gap ?? Math.round(size * 1.35);
  return values.map((v, i) => text(x, y + i * gap, v, { ...opts, size })).join('\n');
}

function rect(x, y, w, h, opts = {}) {
  const {
    fill = white,
    stroke = line,
    sw = 2,
    rx = 14,
    opacity = 1,
  } = opts;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

function circle(cx, cy, r, opts = {}) {
  const fill = opts.fill ?? white;
  const stroke = opts.stroke ?? line;
  const sw = opts.sw ?? 2;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function arrow(x1, y1, x2, y2, color = ink, width = 4) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" marker-end="url(#arrow)"/>`;
}

function header(title, subtitle) {
  return [
    text(80, 92, title, {
      size: 54,
      weight: 400,
      family: 'Cormorant Garamond, Georgia, serif',
      style: 'font-style:italic',
    }),
    text(82, 134, subtitle, { size: 22, weight: 400, fill: muted }),
    `<line x1="80" y1="170" x2="1520" y2="170" stroke="${line}" stroke-width="2"/>`,
  ].join('\n');
}

function svg(title, subtitle, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
  <defs>
    <marker id="arrow" markerWidth="14" markerHeight="14" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 Z" fill="${ink}"/>
    </marker>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#211f20" flood-opacity="0.10"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="${paper}"/>
  ${header(title, subtitle)}
  ${body}
</svg>`;
}

function nodeBox(x, y, title, body, opts = {}) {
  const color = opts.color ?? ink;
  const fill = opts.fill ?? white;
  const w = opts.w ?? 250;
  const h = opts.h ?? 135;
  return [
    rect(x, y, w, h, { fill, stroke: opts.stroke ?? color, sw: opts.sw ?? 2, rx: 16 }),
    text(x + 22, y + 42, title, { size: 25, weight: 700, fill: color }),
    lines(x + 22, y + 78, body, { size: 18, weight: 400, fill: muted, gap: 25 }),
  ].join('\n');
}

function write(name, content) {
  fs.writeFileSync(path.join(OUT_DIR, name), content);
}

write('01-quality-flywheel.svg', svg(
  '1. The Quality Flywheel',
  'High quality emerges from context, focused action, browser evidence, and repeated correction.',
  [
    circle(800, 540, 270, { fill: '#fff9f5', stroke: line, sw: 3 }),
    text(800, 520, 'Impeccable', { size: 62, weight: 400, anchor: 'middle', family: 'Cormorant Garamond, Georgia, serif', style: 'font-style:italic' }),
    text(800, 560, 'design quality loop', { size: 24, weight: 500, anchor: 'middle', fill: muted }),
    nodeBox(110, 250, 'Context', ['PRODUCT.md', 'DESIGN.md'], { color: magenta, w: 255 }),
    nodeBox(510, 220, 'Design Laws', ['rules', 'absolute bans'], { color: ink, w: 255 }),
    nodeBox(920, 220, 'Commands', ['23 focused', 'design actions'], { color: blue, w: 255 }),
    nodeBox(1235, 420, 'Build', ['real frontend', 'project stack'], { color: ink, w: 255 }),
    nodeBox(930, 705, 'Evidence', ['browser checks', 'live variants'], { color: green, w: 255 }),
    nodeBox(520, 735, 'Detector', ['25 checks', 'audit report'], { color: amber, w: 255 }),
    nodeBox(110, 610, 'Fix And Learn', ['polish', 'tests, fixtures'], { color: magenta, w: 255 }),
    arrow(365, 318, 505, 288),
    arrow(765, 288, 915, 288),
    arrow(1175, 320, 1230, 470),
    arrow(1232, 560, 1090, 700),
    arrow(920, 770, 780, 790),
    arrow(520, 770, 365, 680),
    arrow(220, 610, 220, 390),
  ].join('\n')
));

write('02-context-stack.svg', svg(
  '2. The Context Stack',
  'Before editing, the agent receives layers of product, design, register, and command context.',
  [
    [
      ['User request', 'The immediate task', magenta],
      ['SKILL.md', 'Setup gates, shared laws, command menu', ink],
      ['PRODUCT.md', 'Users, purpose, voice, anti-references', blue],
      ['DESIGN.md', 'Colors, type, spacing, components', green],
      ['Register reference', 'Brand surface or product surface', amber],
      ['Command reference', 'The specific design discipline', magenta],
      ['Active AI context', 'Specific enough to design with intent', ink],
    ].map((row, i) => {
      const y = 220 + i * 94;
      return [
        rect(260 + i * 28, y, 1080 - i * 56, 66, { fill: i === 6 ? blush : white, stroke: row[2], sw: i === 6 ? 4 : 2, rx: 12 }),
        text(300 + i * 28, y + 42, row[0], { size: 25, weight: 700, fill: row[2] }),
        text(775, y + 42, row[1], { size: 20, weight: 400, fill: muted }),
      ].join('\n');
    }).join('\n'),
    text(800, 905, 'Each layer narrows vague taste into an actionable design brief.', { size: 28, anchor: 'middle', fill: ink }),
  ].join('\n')
));

write('03-source-to-harnesses.svg', svg(
  '3. Source To Every AI Harness',
  'One authored skill becomes provider-specific bundles for many coding agents.',
  [
    nodeBox(90, 390, 'Source', ['source/skills', 'impeccable'], { color: magenta, w: 285, h: 155 }),
    nodeBox(470, 290, 'Reader', ['SKILL.md', 'references, scripts'], { color: ink, w: 300, h: 155 }),
    nodeBox(470, 590, 'Build', ['counts, ZIPs', 'site data'], { color: amber, w: 300, h: 155 }),
    nodeBox(870, 390, 'Transformer', ['frontmatter', 'placeholders'], { color: blue, w: 300, h: 155 }),
    nodeBox(1240, 260, 'Harness Dirs', ['.claude .cursor', '.agents .github'], { color: green, w: 285, h: 155 }),
    nodeBox(1240, 565, 'Downloads', ['dist bundles', 'universal ZIP'], { color: magenta, w: 285, h: 155 }),
    arrow(375, 468, 465, 370),
    arrow(375, 468, 465, 668),
    arrow(770, 370, 865, 468),
    arrow(770, 668, 865, 468),
    arrow(1170, 468, 1235, 338),
    arrow(1170, 468, 1235, 645),
    text(800, 850, 'The doctrine stays consistent. The packaging adapts to each tool.', { size: 30, anchor: 'middle' }),
  ].join('\n')
));

write('04-command-specialization.svg', svg(
  '4. Command System As Design Specialization',
  'The 23 commands turn "make it better" into a named frontend job.',
  [
    circle(800, 500, 130, { fill: blush, stroke: magenta, sw: 4 }),
    text(800, 490, '/impeccable', { size: 42, weight: 700, anchor: 'middle', fill: magenta }),
    text(800, 528, 'command router', { size: 22, anchor: 'middle', fill: muted }),
    nodeBox(110, 225, 'Build', ['craft, shape', 'teach, document'], { color: magenta, w: 315 }),
    nodeBox(645, 215, 'Evaluate', ['critique', 'audit'], { color: blue, w: 315 }),
    nodeBox(1175, 225, 'Refine', ['polish, harden', 'distill, onboard'], { color: green, w: 315 }),
    nodeBox(110, 675, 'Enhance', ['typeset, layout', 'colorize, animate'], { color: amber, w: 315 }),
    nodeBox(645, 690, 'Fix', ['clarify', 'adapt, optimize'], { color: magenta, w: 315 }),
    nodeBox(1175, 675, 'Iterate', ['live browser', 'variant loop'], { color: blue, w: 315 }),
    arrow(680, 425, 420, 310),
    arrow(800, 370, 800, 295),
    arrow(920, 425, 1170, 310),
    arrow(680, 575, 420, 742),
    arrow(800, 630, 800, 690),
    arrow(920, 575, 1170, 742),
  ].join('\n')
));

write('05-detector-guardrail.svg', svg(
  '5. Anti-Pattern Detector As Guardrail',
  'Design guidance is converted into executable checks across files and browsers.',
  [
    nodeBox(90, 300, 'Inputs', ['files, dirs', 'URLs, pages'], { color: magenta, w: 285, h: 160 }),
    nodeBox(470, 215, 'Regex', ['HTML, CSS', 'JSX, SFCs'], { color: ink, w: 255, h: 135 }),
    nodeBox(470, 390, 'jsdom', ['static HTML', 'computed styles'], { color: blue, w: 255, h: 135 }),
    nodeBox(470, 565, 'Browser', ['real DOM', 'layout data'], { color: green, w: 255, h: 135 }),
    nodeBox(835, 390, '25 Rules', ['AI tells', 'quality issues'], { color: amber, w: 275, h: 160 }),
    nodeBox(1210, 240, 'CLI Report', ['exit 0 clean', 'exit 2 findings'], { color: ink, w: 300, h: 145 }),
    nodeBox(1210, 430, 'Overlay', ['visual page', 'annotations'], { color: magenta, w: 300, h: 145 }),
    nodeBox(1210, 620, 'Fixtures', ['should flag', 'should pass'], { color: green, w: 300, h: 145 }),
    arrow(375, 380, 465, 285),
    arrow(375, 380, 465, 458),
    arrow(375, 380, 465, 635),
    arrow(725, 285, 830, 455),
    arrow(725, 458, 830, 470),
    arrow(725, 635, 830, 500),
    arrow(1110, 455, 1205, 315),
    arrow(1110, 470, 1205, 505),
    arrow(1110, 500, 1205, 695),
  ].join('\n')
));

write('06-live-mode.svg', svg(
  '6. Live Mode Visual Iteration',
  'Users judge variants on the rendered page, then the accepted variant is baked into source.',
  [
    ['User', 'Browser', 'Helper server', 'Agent', 'Project source'].map((label, i) => {
      const x = 145 + i * 315;
      return [
        circle(x, 250, 52, { fill: i === 0 ? blush : white, stroke: i === 0 ? magenta : line, sw: 3 }),
        text(x, 340, label, { size: 24, anchor: 'middle', weight: 700 }),
        `<line x1="${x}" y1="370" x2="${x}" y2="820" stroke="${line}" stroke-width="3" stroke-dasharray="8 10"/>`,
      ].join('\n');
    }).join('\n'),
    arrow(145, 410, 460, 410, magenta),
    text(302, 395, 'select element', { size: 20, anchor: 'middle', fill: muted }),
    arrow(460, 490, 775, 490),
    text(617, 475, 'generate event', { size: 20, anchor: 'middle', fill: muted }),
    arrow(1090, 570, 775, 570),
    text(932, 555, 'poll event', { size: 20, anchor: 'middle', fill: muted }),
    arrow(1090, 650, 1405, 650, green),
    text(1247, 635, 'wrap and write variants', { size: 20, anchor: 'middle', fill: muted }),
    arrow(1405, 725, 460, 725, blue),
    text(932, 710, 'hot-swap in browser, accept one', { size: 20, anchor: 'middle', fill: muted }),
    arrow(1090, 800, 1405, 800, magenta),
    text(1247, 785, 'bake accepted source', { size: 20, anchor: 'middle', fill: muted }),
  ].join('\n')
));

write('07-test-build-safety-net.svg', svg(
  '7. Test And Build Safety Net',
  'The repo keeps skill text, detector behavior, provider outputs, and site data synchronized.',
  [
    nodeBox(95, 395, 'Change', ['source, scripts', 'detector, site'], { color: magenta, w: 250 }),
    nodeBox(405, 260, 'Tests', ['Bun tests', 'Node tests'], { color: ink, w: 245 }),
    nodeBox(405, 560, 'Fixtures', ['should flag', 'should pass'], { color: blue, w: 245 }),
    nodeBox(720, 395, 'Validators', ['counts, header', 'copy, frontmatter'], { color: amber, w: 280 }),
    nodeBox(1080, 260, 'Regenerate', ['provider dirs', 'browser bundle'], { color: green, w: 285 }),
    nodeBox(1080, 560, 'Release', ['ZIPs, site', 'npm, plugin'], { color: magenta, w: 285 }),
    arrow(345, 462, 400, 328),
    arrow(345, 462, 400, 628),
    arrow(650, 328, 715, 462),
    arrow(650, 628, 715, 490),
    arrow(1000, 445, 1075, 328),
    arrow(1000, 492, 1075, 628),
    text(800, 850, 'False-positive discipline matters: noisy quality checks stop being trusted.', { size: 28, anchor: 'middle' }),
  ].join('\n')
));

write('08-beginner-mental-model.svg', svg(
  '8. Beginner Mental Model',
  'A short path from what users see to how Impeccable proves quality on screen.',
  [
    [
      ['Frontend', ['what users', 'see and click'], magenta],
      ['Design system', ['reusable', 'visual rules'], ink],
      ['Skill', ['AI-readable', 'design playbook'], blue],
      ['Command', ['focused', 'design job'], green],
      ['Detector', ['automated', 'design lint'], amber],
      ['Browser loop', ['proof', 'on screen'], magenta],
    ].map((item, i) => {
      const x = 95 + i * 245;
      return [
        rect(x, 385, 210, 190, { fill: i % 2 ? white : '#fff9f5', stroke: item[2], sw: 3, rx: 18 }),
        text(x + 105, 455, item[0], { size: 28, weight: 700, anchor: 'middle', fill: item[2] }),
        lines(x + 105, 505, item[1], { size: 18, anchor: 'middle', fill: muted, gap: 24 }),
        i < 5 ? arrow(x + 210, 480, x + 240, 480) : '',
      ].join('\n');
    }).join('\n'),
    text(800, 735, 'Design taste + project context + executable checks + browser judgment.', { size: 34, anchor: 'middle', weight: 700 }),
  ].join('\n')
));

const sheetFiles = [
  '01-quality-flywheel.svg',
  '02-context-stack.svg',
  '03-source-to-harnesses.svg',
  '04-command-specialization.svg',
  '05-detector-guardrail.svg',
  '06-live-mode.svg',
  '07-test-build-safety-net.svg',
  '08-beginner-mental-model.svg',
];

const thumbs = sheetFiles.map((file, i) => {
  const x = 40 + (i % 2) * 790;
  const y = 40 + Math.floor(i / 2) * 520;
  return `<image href="${file}" x="${x}" y="${y}" width="740" height="463"/>`;
}).join('\n');

fs.writeFileSync(path.join(OUT_DIR, 'impeccable-quality-infographic-sheet.svg'), `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2120" viewBox="0 0 1600 2120">
  <rect width="1600" height="2120" fill="${paper}"/>
  ${thumbs}
</svg>`);

console.log(`Generated ${sheetFiles.length + 1} SVG infographic image files in ${OUT_DIR}`);
