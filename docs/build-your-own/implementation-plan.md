# Implementation Plan: AI Design Skill System

**Version:** 1.0
**Prerequisite:** Read `prd.md` and `spec.md` first.

---

## Strategy

Build the hardest, most unique parts first. The detection engine is the core differentiator and the most technically constrained — it drives the stack choice and the test architecture. Everything else layers on top.

Order rationale:
- Phase 1 (detection engine) proves the stack works and produces the first shippable artifact
- Phase 2 (skill system) delivers the AI design intelligence — usable before the full CLI exists
- Phase 3 (build pipeline) makes the skill work across all AI tools
- Phase 4 (CLI) wraps everything into an installable package
- Phase 5 (browser detector + extension) extends the engine to the browser
- Phase 6 (site) makes it discoverable

Each phase ends with a working, testable artifact. Don't start a phase until the previous one's acceptance criteria pass.

---

## Phase 1: Detection Engine + CLI `detect`

**Goal:** `node bin/cli.js detect src/` scans HTML files, reports findings, exits 1 if any found.

**Why first:** Forces the Node.js stack decision, establishes the dual-adapter pattern, and produces the only part of the system with zero dependency on anything else.

### Tasks

**1.1 Project scaffold**
- Init npm package: `package.json` with `name`, `version`, `type: module`, `engines: { node: ">=18" }`
- Directory structure: `src/`, `bin/`, `tests/`, `tests/fixtures/antipatterns/`
- Install: `jsdom` (detection), dev: `bun` (build/test runner)
- Add `.nvmrc` pinning Node 18+

Acceptance: `node --version` matches engine requirement. `npm install` clean.

**1.2 Detection engine skeleton**
- Create `src/detect-antipatterns.mjs`
- Define `ANTIPATTERNS` array (empty)
- Implement `detectHtml(htmlString, opts)` — creates jsdom, runs element loop, returns findings
- Implement `detectFile(filePath)` — reads file, calls `detectHtml`
- Implement `detectDirectory(dirPath)` — globs `**/*.html`, calls `detectFile` per file
- Implement `detectUrl(url)` — fetches HTML, calls `detectHtml`

Acceptance: `detectHtml('<div></div>')` returns `[]` without error.

**1.3 First rule: gradient-text (TDD)**

Follow this exact sequence for every rule:

a. Write `tests/fixtures/antipatterns/gradient-text.html` with ≥4 flag cases and ≥5 pass cases. Use explicit pixel CSS since jsdom has no layout engine.

b. Write failing test in `tests/detect-antipatterns-fixtures.test.mjs` asserting flag cases trigger and pass cases don't.

c. Run test. Confirm it fails.

d. Add rule to `ANTIPATTERNS` array.

e. Implement `checkGradientText({ backgroundClip, backgroundImage })` — pure function.

f. Implement `checkElementGradientTextDOM(el)` — browser adapter.

g. Implement `checkElementGradientText(el, tag, window)` — jsdom adapter.

h. Wire both adapters into both loops (browser loop and jsdom loop in `detectHtml`).

i. Run test. Confirm it passes.

j. Verify manually on a live HTML page.

Acceptance: all fixture test cases pass. No false positives on a real project.

**1.4 Implement remaining 30+ rules** (repeat 1.3 for each)

Priority order:
1. `gradient-text` (done in 1.3)
2. `side-stripe-border`
3. `glassmorphism`
4. `hero-metric-template`
5. `identical-card-grid`
6. `low-contrast`
7. `flat-type-hierarchy`
8. `missing-focus-styles`
9. `overlong-line-length`
10. `layout-property-animation`
11. `color-only-state`
12. `monospace-as-technical`
13. `modal-overuse`
14. ... (remaining rules)

Acceptance: each rule has a fixture file and passing fixture tests.

**1.5 CLI `detect` command**
- Create `bin/cli.js` as ESM, `#!/usr/bin/env node`
- Parse `process.argv`: `detect [paths...] [--fast] [--json] [--rule <id>] [--ignore <glob>]`
- Call the appropriate `detectFile` / `detectDirectory` / `detectUrl` / `detectHtml`
- Text output: `file:line [category] id description`
- JSON output: `{ findings: [...], summary: { total, byCategory } }`
- Exit code: 0 if no findings, 1 if findings exist

Acceptance:
- `node bin/cli.js detect tests/fixtures/antipatterns/gradient-text.html` exits 1 and reports findings
- `node bin/cli.js detect tests/fixtures/antipatterns/gradient-text.html --json` outputs valid JSON
- `node bin/cli.js detect <clean-project-dir>` exits 0

**1.6 Test suite infrastructure**
- Configure `bun test` for `tests/*.test.js`
- Configure `node --test` for `tests/*.test.mjs`
- Write `package.json` test script that runs both

Acceptance: `npm test` runs all tests and passes.

---

## Phase 2: Skill System

**Goal:** The skill file is complete enough to be installed and used in Claude Code. `/impeccable teach`, `/impeccable shape`, and `/impeccable craft` work end-to-end in a real project.

### Tasks

**2.1 Shared design laws**
- Write `source/skills/impeccable/SKILL.md` — frontmatter, setup section (with preflight gate table), shared design laws (color, theme, typography, layout, motion, absolute bans, copy, AI slop test)
- This file uses provider-neutral placeholders (`{{model}}`, `{{config_file}}`, etc.)

Acceptance: read it as a design document. Every shared law is present, specific, and actionable.

**2.2 Register references**
- Write `source/skills/impeccable/reference/brand.md` — brand register: typography, color, layout, imagery, motion, bans, permissions
- Write `source/skills/impeccable/reference/product.md` — product register: same sections, product-specific rules

Acceptance: given a brand brief and a product brief, the two registers produce meaningfully different guidance.

**2.3 `teach` command**
- Write `source/skills/impeccable/reference/teach.md`
- Write `source/skills/impeccable/scripts/load-context.mjs`

`load-context.mjs` must:
- Read `PRODUCT.md` if it exists (case-insensitive)
- Read `DESIGN.md` if it exists
- Detect `register` field value
- Detect `.impeccable.md` legacy file and rename → `PRODUCT.md` (set `migrated: true`)
- Output clean JSON to stdout

Acceptance: run `node .claude/skills/impeccable/scripts/load-context.mjs` in a project with and without PRODUCT.md. Output matches spec schema.

**2.4 `shape` command**
- Write `source/skills/impeccable/reference/shape.md`
- Includes: discovery interview protocol, visual direction probe spec, design brief structure (10 sections)

Acceptance: given to an AI, it produces a valid 10-section brief before writing any code.

**2.5 `craft` command**
- Write `source/skills/impeccable/reference/craft.md`
- Includes: build gate (5 conditions), craft contract (6 artifacts), all 7 steps

Acceptance: given to an AI with a confirmed brief, it follows the step sequence and produces browser-inspected output.

**2.6 `document` command**
- Write `source/skills/impeccable/reference/document.md`
- Covers: scanning existing CSS/tokens for DESIGN.md generation, and seeding a starter DESIGN.md for new projects

**2.7 Remaining command reference files**
Write one reference file per remaining command: `audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `extract`, `critique`, `live`

**2.8 Domain reference files**
Write: `typography.md`, `color-and-contrast.md`, `spatial-design.md`, `motion-design.md`, `interaction-design.md`, `responsive-design.md`, `ux-writing.md`, `cognitive-load.md`

**2.9 Command router in SKILL.md**
- Add `## Commands` section with router table (command | category | description | reference path)
- Add routing rules (no arg → menu, first word matches → load reference, no match → general)
- Add `## Pin / Unpin` section

**2.10 `pin.mjs`**
- Reads `command-metadata.json`
- Creates or removes standalone redirect shims
- Writes to every harness directory present in the project

**2.11 `command-metadata.json`**
- One entry per command: `{ description, argumentHint, category }`

Acceptance: a developer can install the `.claude/skills/impeccable/` directory manually and use all commands in Claude Code.

---

## Phase 3: Multi-Provider Build Pipeline

**Goal:** `node scripts/build.js` generates provider-specific skill files for all 10+ providers from the single source.

### Tasks

**3.1 Placeholder system**
- Implement `PROVIDER_PLACEHOLDERS` map in `scripts/lib/utils.js`
- Implement `replacePlaceholders(body, provider)` function

**3.2 Frontmatter parser/serializer**
- Implement `parseFrontmatter(content)` → `{ meta, body }`
- Implement `generateYamlFrontmatter(meta, fields)` — auto-quotes values starting with `[` or `{`

**3.3 Provider config map**
- Create `scripts/lib/transformers/providers.js`
- One config entry per supported provider (at minimum: Claude Code, Cursor, Copilot, Gemini CLI, Codex)

**3.4 Transformer factory**
- Implement `createTransformer(config)` in `scripts/lib/transformers/factory.js`
- Returns a function `(skill) => writes files to configDir/skills/name/`

**3.5 Named exports for test spying**
- `scripts/lib/transformers/index.js` re-exports each transformer by name
- Keep these even though `build.js` doesn't use them directly

**3.6 Build orchestrator**
- Implement `scripts/build.js`:
  - `readSourceFiles()` — reads all skills from `source/skills/`
  - Loops over `PROVIDERS`, creates transformer, runs on each skill
  - Runs `validateCounts()` — checks command counts across docs

**3.7 Count validator**
- Implement `validateCounts()` in `scripts/build.js`
- Reads router table to get canonical count
- Scans `README.md`, `NOTICE.md`, `AGENTS.md`, plugin files for numeric counts
- Fails build if any disagree

**3.8 ZIP bundle generator**
- Implement `scripts/lib/zip.js`
- Produces one ZIP per provider in `dist/zips/`

**3.9 `skills-lock.json`**
- Track installed skill versions per provider

**3.10 `skills install` CLI command**
- Detect which AI tools are present (signal-based detection)
- Copy appropriate harness directories
- Update `skills-lock.json`

Acceptance: `node scripts/build.js` completes without error. Each provider's output directory has a valid SKILL.md with placeholders resolved.

---

## Phase 4: CLI — Full Command Set

**Goal:** Published npm package. `npx impeccable detect` and `npx impeccable skills install` work from zero install.

### Tasks

**4.1 Package metadata**
- Finalize `package.json`: `name`, `version`, `bin`, `main`, `exports`, `files`
- Ensure `bin/cli.js` is executable
- `files` array includes only `bin/`, `src/`, `LICENSE`

**4.2 `live` command — server**
- Implement `src/cli/live.js`
- Start WebSocket server on a random available port
- Serve browser injection script at `GET /inject.js`
- Implement message protocol: `select`, `variants`, `accept`
- Print connection URL + copy-paste snippet for injecting into any page

**4.3 `live` command — variant loop**
- On `select` message: extract element context (HTML, computed CSS)
- Format context for AI agent consumption
- On `variants` message: push to connected browsers
- On `accept` message: write accepted variant to source file (CSS or inline style)

**4.4 Error handling and UX**
- Unknown command: print help
- No files found: clear message
- Permission error: clear message
- `--help` output matching npm conventions

**4.5 npm publish dry run**
- `npm pack --dry-run` — verify `files` array is correct
- No secrets, no dev files, no large binaries

Acceptance: `npx impeccable --help` shows correct output. `npx impeccable detect tests/` runs detection. `npx impeccable skills install` copies skill files.

---

## Phase 5: Browser Detector + Chrome Extension

**Goal:** The detection engine runs in any browser. A Chrome extension lets users scan any tab with one click.

### Tasks

**5.1 Browser build script**
- Implement `scripts/build-browser-detector.js`
- Input: `src/detect-antipatterns.mjs`
- Transform: strip Node imports, replace jsdom adapters with `getComputedStyle`/`getBoundingClientRect`, wrap in IIFE
- Output: `src/detect-antipatterns-browser.js` exposing `window.ImpeccableDetector`

**5.2 Browser API**
- `ImpeccableDetector.scan()` → `Promise<Finding[]>`
- `ImpeccableDetector.renderOverlay(findings)` — highlights elements, shows panel

**5.3 Browser smoke tests**
- `tests/detect-antipatterns-browser.test.mjs` — loads the bundle in jsdom, runs scan, checks findings match the file-based engine

**5.4 Chrome extension scaffold**
- `extension/manifest.json` — MV3, permissions: `activeTab`, `scripting`
- `extension/background.js` — toolbar click → inject content script
- `extension/content.js` — inject detector, run scan, render overlay
- `extension/popup/` — finding count badge

**5.5 Extension build script**
- Implement `scripts/build-extension.js`
- Copies `src/detect-antipatterns-browser.js` → `extension/detector/detect.js`
- Generates `extension/detector/antipatterns.json` (rule metadata only, no logic)
- Packages into `dist/extension.zip`

**5.6 Full build script**
- Update `package.json` scripts:
  - `build:browser` → `node scripts/build-browser-detector.js`
  - `build:extension` → `node scripts/build-extension.js`
  - `build` → runs all three builds + count validator

Acceptance: `node scripts/build:browser` produces a valid browser bundle. Loading the bundle in Chrome and calling `ImpeccableDetector.scan()` returns findings matching the CLI on the same HTML.

---

## Phase 6: Dev/Marketing Site

**Goal:** A publicly deployable site at a custom domain showing the skill, commands, anti-pattern gallery, live demo, and full docs.

### Tasks

**6.1 Site scaffold**
- `public/` with `index.html`, `css/`, `js/`
- CSS token file (`css/tokens.css`) with OKLCH system
- `server/index.js` — Bun dev server

**6.2 CSS architecture**
- `css/main.css` — imports, reset, global tokens
- `css/tokens.css` — OKLCH color tokens
- `css/workflow.css` — commands section, glass terminal, magazine spread
- `css/sub-pages.css` — docs, anti-patterns, tutorials pages

**6.3 Homepage**
- Hero with install instruction and value proposition
- Command periodic table (one cell per command, symbol + number + name)
- Framework visualization
- Anti-pattern showcase (live examples of each ban)
- Getting started steps

**6.4 Docs system**
- `docs/` directory as source (already built in previous phases)
- `scripts/build-sub-pages.js` — generates `public/docs/:command` from `content/site/skills/<command>.md` + `command-metadata.json`
- Navigation between docs pages
- Command relationship links (leadsTo, pairs, combinesWith)

**6.5 Editorial content**
- `content/site/skills/<command>.md` for each command — tagline + four sections (When to use, How it works, Try it, Pitfalls)

**6.6 Anti-patterns gallery**
- One page per detected anti-pattern
- Visual before/after example
- Rule ID, category, description, how to fix

**6.7 Live demo page (`/visual-mode`)**
- Embeds the browser detector
- Lets visitors scan the demo page itself and see findings
- Links to the `live` CLI command for their own projects

**6.8 Build pipeline**
- `scripts/build.js` — full static build to `build/`
- Inline CSS `@import` chains
- Resolve `<link rel="stylesheet">` into inline `<style>`
- Copy assets
- Generate `_redirects` for Cloudflare Pages (legacy URL redirects)

**6.9 Cloudflare Pages deployment**
- `wrangler.toml` or Pages project config
- `npm run deploy` → build + `wrangler pages deploy build/`
- Test legacy redirects: `/skills` → `/docs`, `/gallery` → `/visual-mode#try-it-live`

**6.10 OG images and metadata**
- `<meta>` tags for social sharing
- `scripts/generate-og-image.js` — puppeteer-based OG image generation per command

Acceptance: `npm run deploy` succeeds. Homepage loads at custom domain. `/docs/craft` shows the craft command editorial page. `/anti-patterns/gradient-text` shows the visual example. Chrome extension links to the docs.

---

## Milestone summary

| Phase | End state | Estimated effort |
|---|---|---|
| 1: Detection engine + CLI detect | Scan HTML files for anti-patterns from the terminal | High (most novel work) |
| 2: Skill system | Full AI design intelligence installable in Claude Code | High (most writing) |
| 3: Build pipeline | One source → 10+ provider formats, automated | Medium |
| 4: CLI full | npm package, all commands, publishable | Medium |
| 5: Browser detector + extension | Scan any live page, Chrome extension | Medium |
| 6: Site | Public site, docs, gallery, live demo | Medium–High |

---

## What to build last (explicitly)

- The `live` variant picker WebSocket flow (hardest part of Phase 4) — skip for MVP, ship `detect` + `skills install` first
- The Chrome extension store submission — requires approval time, not blocking launch
- The `generate-og-image` script — cosmetic, not blocking
- E2E Playwright tests for every framework fixture — add progressively, not blocking launch
