# Technical Specification: AI Design Skill System

**Version:** 1.0
**Status:** Draft
**Prerequisite:** Read `prd.md` first for context, goals, and non-goals.

---

## System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        Source Layer                          │
│  source/skills/<name>/SKILL.md   (provider-neutral markdown) │
│  source/skills/<name>/reference/*.md                         │
└──────────────────────────┬───────────────────────────────────┘
                           │ bun/node run scripts/build.js
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Build Pipeline                           │
│  Replace placeholders → emit frontmatter → write per-provider│
│  .claude/ .cursor/ .github/ .gemini/ etc.                    │
└──────────────────────────┬───────────────────────────────────┘
                           │ npx skills install (user runs)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  AI Coding Tool Context                       │
│  Skill loaded on /impeccable invocation                      │
│  Command router → reference file loaded → design work begins │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   Detection Engine                           │
│  src/detect-antipatterns.mjs  (source of truth)              │
│       │                          │                           │
│  scripts/build-browser.js   scripts/build-extension.js      │
│       │                          │                           │
│  src/detect-antipatterns-browser.js   extension/detector/   │
└──────────────────────────┬───────────────────────────────────┘
                           │
                     bin/cli.js
                           │
              ┌────────────┼────────────┐
           detect         live      skills install
```

---

## Component 1: Skill System

### File structure

```
source/skills/
  impeccable/
    SKILL.md              # Root: frontmatter, shared laws, command router
    reference/
      brand.md            # Brand register reference
      product.md          # Product register reference
      craft.md            # /impeccable craft
      shape.md            # /impeccable shape
      teach.md            # /impeccable teach
      document.md         # /impeccable document
      audit.md            # /impeccable audit
      polish.md           # /impeccable polish
      bolder.md
      quieter.md
      distill.md
      harden.md
      onboard.md
      animate.md
      colorize.md
      typeset.md
      layout.md
      delight.md
      overdrive.md
      clarify.md
      adapt.md
      optimize.md
      extract.md
      critique.md
      live.md
      # Domain references (loaded by craft.md based on brief needs)
      typography.md
      color-and-contrast.md
      spatial-design.md
      motion-design.md
      interaction-design.md
      responsive-design.md
      ux-writing.md
      cognitive-load.md
      heuristics-scoring.md
      personas.md
    scripts/
      load-context.mjs    # Reads PRODUCT.md + DESIGN.md, outputs JSON
      pin.mjs             # Creates/removes standalone command shortcuts
      command-metadata.json
      cleanup-deprecated.mjs
      # live mode scripts
      live.mjs
      live-server.mjs
      live-poll.mjs
      live-inject.mjs
      live-wrap.mjs
      live-accept.mjs
      live-browser.js
      design-parser.mjs
      detect-csp.mjs
      is-generated.mjs
      modern-screenshot.umd.js
```

### SKILL.md structure

```markdown
---
name: impeccable
description: "[auto-trigger description — long, keyword-rich]"
argument-hint: "[command] [target]"
user-invocable: true
allowed-tools:
  - Bash(npx impeccable *)
license: Apache 2.0
---

[Short one-liner: what it does]

## Setup (non-optional)
[Preflight gate table: context, product, command, craft, image, mutation]
[Context gathering: load-context.mjs call, PRODUCT.md requirements]
[Register selection logic]

## Shared design laws
[Color, theme, typography, layout, motion, absolute bans, copy, AI slop test]

## Commands
[Router table: command | category | description | reference file path]
[Routing rules: no arg → menu | first word matches → load reference | no match → general invocation]

## Pin / Unpin
[How pin.mjs works]
```

### load-context.mjs interface

Input: none (reads from `process.cwd()`)

Output: JSON to stdout:
```json
{
  "product": {
    "exists": true,
    "content": "...",
    "register": "brand",
    "migrated": false
  },
  "design": {
    "exists": true,
    "content": "..."
  }
}
```

The AI consumes the full JSON output. Never pipe through head/tail/grep/jq.

### The preflight gate

Before any file mutation, the AI must verify and state:

```
IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=pass|not_required image_gate=pass|skipped:<reason> mutation=open
```

Gates in order:
1. **context** — load-context.mjs has run this session
2. **product** — PRODUCT.md exists, not empty, no `[TODO]` markers, ≥200 chars
3. **command_reference** — matching reference file loaded for this sub-command
4. **shape** — confirmed design brief exists (only required for `craft`)
5. **image_gate** — visual probe decision recorded
6. **mutation** — all above pass; file edits are now allowed

### shape/craft protocol

`shape` produces a ten-section design brief:
1. Feature Summary
2. Primary User Action
3. Design Direction (color strategy + scene sentence + named references)
4. Scope (fidelity, breadth, interactivity, time intent)
5. Layout Strategy
6. Key States
7. Interaction Model
8. Content Requirements
9. Recommended References
10. Open Questions

Brief is not valid until the user explicitly confirms it in a separate response. AI self-authored briefs do not count as confirmed.

`craft` only runs after `shape=pass`. Steps:
1. Load shape brief
2. Load reference files named in brief
3. Generate north-star visual mocks (capability-gated: only when native image gen available)
4. Build mock fidelity inventory
5. Implement semantically
6. Browser inspection loop (required: inspect → critique → fix → repeat)
7. Present with deviations documented

### The register system

Priority for register selection:
1. Task cue ("landing page" → brand; "dashboard" → product)
2. Surface in focus (route/filename)
3. `## Register` field in PRODUCT.md

Loads `reference/brand.md` or `reference/product.md`. Shared design laws apply to both; register references add and override.

---

## Component 2: Multi-Provider Build System

### Source placeholders

Every source file may contain these tokens, replaced per provider at build time:

| Placeholder | Example values |
|---|---|
| `{{model}}` | Claude, Gemini, GPT |
| `{{config_file}}` | CLAUDE.md, .cursorrules, AGENTS.md |
| `{{ask_instruction}}` | "ask the user directly" / "use the ask_user tool" |
| `{{command_prefix}}` | `/` or `$` |
| `{{available_commands}}` | comma-separated command list |
| `{{scripts_path}}` | `.claude/skills/impeccable/scripts` |
| `{{command_hint}}` | first word of argument-hint |

### Provider config schema

```javascript
{
  provider: 'claude-code',         // key for PROVIDER_PLACEHOLDERS lookup
  configDir: '.claude',            // dot-directory at project root
  displayName: 'Claude Code',      // build log label
  frontmatterFields: [             // which optional frontmatter keys to emit
    'user-invocable',
    'argument-hint',
    'allowed-tools',
    'license'
  ],
  bodyTransform: null,             // optional (body, skill) => body post-process fn
  placeholderProvider: null        // override placeholder key (for variants sharing config)
}
```

### Build flow

```
readSourceFiles()
  for each skill directory in source/skills/:
    parseFrontmatter(SKILL.md)  →  { meta, body }
    readReferenceFiles()        →  { filename: content }
    readScriptFiles()           →  { filename: content }

for each provider in PROVIDERS:
  transformer = createTransformer(providerConfig)
  transformer(skill)
    replacePlaceholders(body, provider)
    generateYamlFrontmatter(meta, providerConfig.frontmatterFields)
    writeFiles(configDir/skills/name/)
    writeZip(dist/zips/)

validateCounts()  →  fail build if command counts in docs disagree with router table
```

### Output directories (committed to repo)

```
.claude/skills/impeccable/
.cursor/skills/impeccable/
.github/copilot-instructions.d/impeccable/
.gemini/skills/impeccable/
.agents/skills/impeccable/
.opencode/skills/impeccable/
.kiro/skills/impeccable/
.zed/skills/impeccable/
# ... one per provider
```

### command-metadata.json schema

```json
{
  "craft": {
    "description": "Shape, then build a feature end-to-end",
    "argumentHint": "[feature]",
    "category": "Build"
  }
}
```

Used by: build (to generate `{{available_commands}}`), pin.mjs, sub-page generator.

### pin.mjs

Creates a standalone redirect shim so `/audit` invokes `/impeccable audit`:

```markdown
---
name: audit
description: "Delegates to /impeccable audit — [original description]"
---
/impeccable audit {{args}}
```

Writes to every harness directory present in the project.

---

## Component 3: Anti-Pattern Detection Engine

### File: `src/detect-antipatterns.mjs`

This is the single source of truth. Everything else is derived from it.

### Rule schema

```javascript
{
  id: 'gradient-text',          // kebab-case, stable identifier
  category: 'slop',             // 'slop' | 'quality'
  name: 'Gradient text',        // human-readable
  description: 'background-clip: text with gradient is decorative, never meaningful.',
  skillSection: 'Absolute bans',  // optional: links to skill guidance
  skillGuideline: 'Use a single solid color instead.'  // optional
}
```

### Rule implementation pattern

Every rule follows this structure:

```javascript
// 1. Pure check function (no DOM access)
function checkGradientText({ backgroundClip, backgroundImage }) {
  if (backgroundClip === 'text' && backgroundImage?.includes('gradient')) {
    return [{ id: 'gradient-text', snippet: `background: ${backgroundImage}` }]
  }
  return []
}

// 2. Browser adapter (getComputedStyle + getBoundingClientRect)
function checkElementGradientTextDOM(el) {
  const style = getComputedStyle(el)
  return checkGradientText({
    backgroundClip: style.webkitBackgroundClip || style.backgroundClip,
    backgroundImage: style.backgroundImage
  })
}

// 3. jsdom adapter (parse explicit CSS, no layout)
function checkElementGradientText(el, tag, window) {
  const style = window.getComputedStyle(el)
  return checkGradientText({
    backgroundClip: style.getPropertyValue('-webkit-background-clip') || style.backgroundClip,
    backgroundImage: style.backgroundImage
  })
}
```

Both adapters wire into two separate loops:
- Browser loop (~line 1837): called per element in the live page
- jsdom loop in `detectHtml` (~line 2058): called per element when scanning a file

### jsdom gotchas (critical)

- `getBoundingClientRect()` always returns 0×0. Read `parseFloat(style.width)` from explicit CSS instead.
- `background:` shorthand is not decomposed. Use `resolveBackground()` and `resolveGradientStops()` helpers.
- Computed colors are not normalized. `parseGradientColors()` handles both hex and rgb forms.

### Public API

```javascript
// Scan an HTML string
const findings = await detectHtml(htmlString, { url: 'http://localhost:3000' })

// Scan a file
const findings = await detectFile('/path/to/file.html')

// Scan a directory recursively
const findings = await detectDirectory('/path/to/src')

// Each finding:
{
  id: 'gradient-text',
  category: 'slop',
  name: 'Gradient text',
  description: '...',
  snippet: 'background: linear-gradient(...)',
  file: '/path/to/file.html',  // when scanning files
  line: 42                      // when available
}
```

### Test fixture format

For each rule, one fixture file at `tests/fixtures/antipatterns/{rule-id}.html`:

```html
<!-- SHOULD_FLAG -->
<div id="case-1">
  <h2>Case label "used as snippet identifier"</h2>
  <!-- ... markup that should trigger the rule ... -->
</div>

<!-- SHOULD_PASS -->
<div id="pass-1">
  <h2>Pass label "valid pattern"</h2>
  <!-- ... markup that should NOT trigger the rule ... -->
</div>
```

TDD order (non-negotiable): fixture → failing test → rule entry → pure check function → two adapters → both loops → browser verify.

---

## Component 4: Browser Detector

### Build: `scripts/build-browser-detector.js`

Takes `src/detect-antipatterns.mjs` and:
1. Strips `import` statements and Node-specific code
2. Replaces jsdom-path calls with browser DOM/CSSOM equivalents
3. Wraps in an IIFE that attaches to `window.ImpeccableDetector`
4. Outputs `src/detect-antipatterns-browser.js`

Run after any change to `src/detect-antipatterns.mjs`:
```
node scripts/build-browser-detector.js
```

### Browser API

```javascript
window.ImpeccableDetector.scan()
// Returns: Promise<Finding[]>
// Scans the current document and returns findings

window.ImpeccableDetector.renderOverlay(findings)
// Highlights flagged elements and shows a findings panel
```

### Chrome Extension

```
extension/
  manifest.json          # MV3, permissions: activeTab, scripting
  background.js          # Service worker — handles toolbar click
  content.js             # Injected per tab — runs detector, renders overlay
  popup/                 # Toolbar popup showing finding counts
  detector/
    detect.js            # Copy of detect-antipatterns-browser.js
    antipatterns.json    # Rule metadata (id, name, description) — no logic
```

Build: `node scripts/build-extension.js` — copies detector, packages into ZIP.

The content script:
1. Injects `detect.js` into the page
2. Calls `window.ImpeccableDetector.scan()`
3. Receives findings array
4. Renders an overlay panel pinned to the bottom of the viewport

---

## Component 5: CLI

### Entry point: `bin/cli.js`

Thin router. Parses `process.argv`, dispatches to command modules under `src/cli/`.

```javascript
#!/usr/bin/env node
import { detect } from '../src/cli/detect.js'
import { live } from '../src/cli/live.js'
import { skills } from '../src/cli/skills.js'
```

### `detect` command

```javascript
// src/cli/detect.js
export async function detect(args) {
  // Parse flags: --fast, --json, --rule, --ignore
  // For each input (file / directory / URL):
  //   if URL: fetch HTML, run detectHtml()
  //   if directory: glob **/*.html, run detectFile() per file
  //   if file: run detectFile()
  // Aggregate findings
  // Output: text (default) or JSON (--json flag)
  // Exit code: 0 if no findings, 1 if findings
}
```

Text output format:
```
src/index.html
  line 42  [slop]    gradient-text       Gradient text detected
  line 87  [quality] low-contrast        Text contrast 2.1:1 (required 4.5:1)

2 files scanned. 2 findings.
```

### `live` command

Starts a local WebSocket server that:
1. Serves the browser injection script
2. Listens for element selection events from the browser
3. On selection: notifies the AI agent (via stdout or webhook) with element context
4. Receives design variants from the AI agent
5. Pushes variants to the browser for preview
6. On accept: writes the accepted variant back to source

Protocol (WebSocket messages):
```json
{ "type": "select", "selector": ".hero-cta", "context": { "html": "...", "css": "..." } }
{ "type": "variants", "items": [{ "label": "A", "css": "..." }, ...] }
{ "type": "accept", "index": 0 }
```

### `skills` command

```
skills install    Detect which AI tools are present. Copy harness directories.
skills update     Pull latest, re-run install.
```

Detection logic:
```javascript
const TOOL_SIGNALS = [
  { tool: 'claude-code', signal: '.claude/' },
  { tool: 'cursor',      signal: '.cursor/' },
  { tool: 'copilot',     signal: '.github/' },
  { tool: 'gemini',      signal: '.gemini/' },
  // ...
]
```

---

## Component 6: Dev/Marketing Site

### Server: `server/index.js`

Bun server (development only). At startup:
- Runs `generateSubPages()` — generates HTML for `/docs/:id`, `/anti-patterns/:id`, `/tutorials/:id`
- Serves `public/` with live reload for CSS
- Handles legacy URL redirects

### Build: `scripts/build.js`

Produces `build/` for Cloudflare Pages deployment:
- Inlines `@import` chains from CSS entry point
- Processes HTML files (resolves `<link rel="stylesheet">`)
- Copies `public/` assets
- Generates `_redirects` file for Cloudflare Pages
- Runs `validateCounts()` — fails if command counts in HTML/MD disagree with router table

### Sub-page generation: `scripts/build-sub-pages.js`

Generates HTML pages for each command from two sources:
- `source/skills/impeccable/scripts/command-metadata.json` — description, argument hint, category
- `content/site/skills/<command>.md` — optional editorial content (tagline + four sections)

Output template per command:
```html
<!-- /docs/:command -->
<h1>[command]</h1>
<p class="tagline">[tagline from editorial file, or description from metadata]</p>
[editorial body if present]
[related commands based on COMMAND_RELATIONSHIPS]
```

### CSS token system

```css
/* tokens.css */
--color-ink:      oklch(10% 0.01 250);   /* body copy */
--color-charcoal: oklch(25% 0.01 250);   /* headings */
--color-ash:      oklch(55% 0.01 250);   /* secondary labels */
--color-mist:     oklch(85% 0.005 250);  /* borders */
--color-cream:    oklch(97% 0.005 250);  /* backgrounds */
--color-accent:   oklch(55% 0.2 250);    /* brand accent */
```

Rules:
- `--color-ink` for body copy, even at small sizes
- `--color-charcoal` only for headings ≥16px
- `--color-ash` for secondary labels and captions
- Never pure black (`#000`) or pure white (`#fff`)

### Count validation

`validateCounts()` in `scripts/build.js` scans these files for numeric command counts and fails the build if any disagree with the router table:
- `public/index.html` (meta descriptions, hero box, section lead)
- `README.md`
- `NOTICE.md`
- `AGENTS.md`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

---

## Cross-Cutting Concerns

### Versioning

Three independent version numbers. Bump only the one that changed.

| Component | File | Bump when |
|---|---|---|
| CLI / npm package | `package.json` → `version` | CLI code changes |
| Skills | `.claude-plugin/plugin.json` + `marketplace.json` → `version` | Skill content changes |
| Chrome extension | `extension/manifest.json` → `version` | Extension code changes |

### Testing

```
tests/
  build.test.js                   # bun test — build orchestration
  detect-antipatterns.test.js     # bun test — detection unit tests
  windows-path-fix.test.js        # bun test — path normalization
  detect-antipatterns-fixtures.test.mjs  # node --test — per-rule fixture tests
  detect-antipatterns-browser.test.mjs   # node --test — browser bundle smoke tests
  cleanup-deprecated.test.mjs     # node --test
  live-wrap.test.mjs              # node --test — live mode wrap
  live-accept.test.mjs            # node --test — live mode accept
  live-inject.test.mjs            # node --test — live mode inject
  live-server.test.mjs            # node --test — live server
  framework-fixtures.test.mjs     # node --test — per-framework integration
  live-e2e.test.mjs               # opt-in only — full E2E with Playwright
  fixtures/antipatterns/          # one HTML file per rule
  framework-fixtures/             # one directory per framework (Vite, Next, SvelteKit, etc.)
```

Fixture test pattern: each `tests/fixtures/antipatterns/{rule-id}.html` has `SHOULD_FLAG` and `SHOULD_PASS` sections. The test extracts the snippet from the heading and asserts presence/absence in findings.

### Named exports for test spying

`scripts/lib/transformers/index.js` re-exports each transformer by name (`transformCursor`, `transformClaudeCode`, etc.) even though `build.js` uses `createTransformer + PROVIDERS` directly. These named exports exist only for `spyOn()` in `tests/build.test.js`. Do not remove them.

### Technology stack summary

| Layer | Technology | Why |
|---|---|---|
| Detection engine | Node.js + jsdom | Only JS runtime can simulate CSS computed styles |
| Build runner | Bun | Fast, built-in bundler and HTTP server for dev |
| CLI runtime | Node.js (not Bun) | Bun's jsdom is slow; CLI detect path must use Node |
| Site deployment | Cloudflare Pages | Static, global CDN, Pages Functions for API routes |
| E2E tests | Playwright | Real browser, cross-framework fixture support |
| CSS | Plain CSS, OKLCH | No build step, no framework; tokens via custom properties |
| Skill format | Markdown + YAML frontmatter | Plain text, works across all AI tool providers |
