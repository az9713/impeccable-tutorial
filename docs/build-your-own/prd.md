# PRD: AI Design Skill System (Impeccable-class)

**Version:** 1.0
**Status:** Draft
**Scope:** Full system — skill engine, build pipeline, detection, browser overlay, CLI, marketing site

---

## Problem

AI coding tools (Claude Code, Cursor, Copilot, Gemini CLI, Codex) generate frontend UI that is fast but visually generic. The output reliably converges on a small set of clichés: identical card grids, gradient text, glassmorphism, hero-metric templates, side-stripe borders. Engineers have no way to encode design standards into the AI's workflow. The gap between "AI made this" and "a designer made this" is not a model capability problem — it is a context and process problem.

There are three root causes:

1. **No project context.** The AI designs for a generic project, not your specific product, users, and brand.
2. **No design process.** The AI jumps straight to code without doing the thinking a designer does first: who uses this, what states exist, what visual direction fits.
3. **No anti-pattern enforcement.** The AI has strong learned priors toward exactly the clichés that make UI look generated. Nothing stops it from following them.

This product addresses all three.

---

## Target Users

**Primary: Frontend engineers using AI coding tools.**
They use Claude Code, Cursor, Copilot, Gemini CLI, or Codex daily. They are comfortable with code but may lack deep design training. They want their AI-generated UI to look intentional and pass a design review, not just function correctly.

**Secondary: Design-forward engineering teams.**
Small teams (2–10 engineers) where a designer sets standards but is not involved in every PR. They want to encode those standards so the AI follows them consistently without the designer having to review every component.

**Tertiary: Solo developers without a design background.**
They want a system that imposes design discipline on their behalf — asking the right questions, enforcing the right rules — so they don't have to know what they don't know.

---

## Product Goals

| Goal | Measure of success |
|---|---|
| Design process before code | Every AI build command requires a confirmed design brief before file edits |
| Project context loading | Every command reads PRODUCT.md and DESIGN.md before designing |
| Anti-pattern prevention | Known design clichés are refused at generation time and caught at scan time |
| Provider coverage | Skill works in all major AI coding tools (Claude Code, Cursor, Copilot, Gemini CLI, Codex, OpenCode, Kiro) |
| CLI usability | `npx <tool> detect <path>` runs with no config in under 5 seconds on a typical project |
| Browser iteration | Users can select an element in any running browser page and generate design variants without reloading |

---

## Features

### 1. Skill System

The AI design intelligence layer. A set of structured markdown files the AI coding tool loads into context when the user invokes a command.

**What it provides:**
- A root skill file with frontmatter (name, description, argument hint, allowed tools), shared design laws, and a command router table
- One reference file per command (~23 commands) loaded on demand
- Two register reference files (brand and product) that govern which design rules apply
- Domain reference files (typography, color, spatial design, motion, interaction, UX writing, responsive design)
- PRODUCT.md and DESIGN.md protocol: two files the user writes once at project root that every command reads

**Commands, grouped:**
- **Build:** `craft`, `shape`, `teach`, `document`, `extract`
- **Evaluate:** `critique`, `audit`
- **Refine:** `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`
- **Enhance:** `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`
- **Fix:** `clarify`, `adapt`, `optimize`
- **Iterate:** `live`
- **Management:** `pin`, `unpin`

**Design laws enforced by the skill:**
- OKLCH color space. Tinted neutrals. Never pure black or white.
- Mandatory color strategy selection (Restrained / Committed / Full palette / Drenched)
- Theme via scene sentence (forces dark vs light decision concretely)
- Typography hierarchy via scale + weight contrast (≥1.25 ratio)
- Layout rhythm through varied spacing
- Motion: ease-out curves only, no layout property animation
- Absolute bans: side-stripe borders, gradient text, glassmorphism as default, hero-metric template, identical card grids, modal as first thought
- AI slop test and category-reflex check on every output
- Font reflex-reject list for brand work (~25 training-data defaults banned)

**PRODUCT.md schema:**
```
Register (brand | product)
Users
Product Purpose
Brand Personality
Anti-references
Design Principles
Accessibility & Inclusion
```

**DESIGN.md schema:** Google Stitch format. Colors, typography, elevation, spacing, components.

### 2. Multi-Provider Build System

Transforms source skill files into provider-specific formats for every supported AI coding tool.

**Supported providers (target):**
Claude Code, Cursor, Copilot (VS Code), Gemini CLI, Codex CLI, OpenCode, Kiro, Agents (OpenAI), Zed, Pi

**What differs per provider:**
- Output directory (`.claude/skills/`, `.cursor/skills/`, `.github/copilot-instructions.d/`, etc.)
- Frontmatter fields supported (each tool recognizes different keys)
- Body placeholders resolved (`{{model}}`, `{{config_file}}`, `{{command_prefix}}`, `{{ask_instruction}}`, `{{available_commands}}`)

**Source format:**
Single source file with provider-neutral placeholders. One build run produces all provider outputs. Adding a provider requires only a config entry — no new build logic.

**Additional outputs:**
- ZIP bundle per provider for manual install
- `skills-lock.json` tracking installed versions
- Plugin metadata files (`.claude-plugin/plugin.json`, `marketplace.json`)

### 3. Anti-Pattern Detection Engine

A Node.js rule engine that scans HTML and CSS for known design anti-patterns and quality issues.

**Two rule categories:**
- `slop` — patterns that reveal AI generation: gradient text, glassmorphism, hero-metric template, identical card grids, side-stripe borders, monospace-as-technical-shorthand
- `quality` — real design and accessibility problems: low contrast, flat type hierarchy, missing focus styles, overlong line lengths, layout property animation, color-only state indicators

**Architecture: dual adapter pattern.**
Every rule has two implementations:
- `checkElementXxxDOM(el)` — browser path, uses `getComputedStyle` and `getBoundingClientRect`
- `checkElementXxx(el, tag, window)` — jsdom path, reads explicit CSS properties (no layout computation)

Both adapters wire into two separate element-scanning loops in the same engine file.

**Inputs:** HTML string or file path. **Outputs:** array of findings with `{ id, category, name, description, snippet, element }`.

**Scale target:** ~40 rules at launch, extensible.

### 4. Browser Detector

A self-contained JavaScript bundle of the detection engine, injectable into any running web page.

**What it does:** Runs the detection engine against the live DOM. Reports findings as an overlay panel on the page or as console output.

**How it's generated:** Built from the main detection engine source via a bundler step that strips jsdom-specific code and replaces it with live browser DOM/CSSOM calls.

**Distribution:** Available as a standalone script (`detect-antipatterns-browser.js`), a Chrome extension, and injectable via the `live` server.

**Chrome extension:** Adds a toolbar button that runs the detector on the active tab and shows findings in a panel. Uses the same rule set as the CLI.

### 5. CLI

The command-line interface. Distributed on npm. Zero config required.

**Commands:**

`detect [file-or-dir-or-url...]`
Scans HTML files or URLs for anti-patterns. Recursive by default. Outputs findings to stdout. Exit code 1 if findings exist (usable in CI).

Flags:
- `--fast` — regex-only scan, no DOM parsing, faster but lower recall
- `--json` — JSON output for tooling integration
- `--rule <id>` — run a single rule only
- `--ignore <glob>` — exclude paths

`live`
Starts a local server that injects the browser detector into any page. Opens a connection between the terminal and the browser for live variant iteration (the `/impeccable live` flow).

`skills install`
Installs or updates the skill files into the current project's AI tool directories. Detects which tools are present.

`skills update`
Re-runs install with latest skill versions.

`--help` / `--version`

**Distribution:** npm package `impeccable`. Runnable as `npx impeccable <command>`.

### 6. Dev/Marketing Site

The public-facing site at the product's domain. Static HTML, plain CSS, no framework, no build step for CSS.

**Pages:**
- Homepage — hero, command periodic table, live demo, anti-pattern showcase, install instructions
- `/docs` — full documentation (the docs/ directory rendered as HTML)
- `/docs/:command` — per-command reference pages generated from `content/site/skills/` editorial files
- `/anti-patterns` — gallery of detected anti-patterns with visual examples
- `/tutorials` — step-by-step guides
- `/visual-mode` — live demo of the browser variant picker

**CSS architecture:**
- `css/main.css` — entry point, imports partials, defines OKLCH tokens and reset
- `css/tokens.css` — color tokens
- `css/workflow.css` — command section, glass terminal, magazine spread
- `css/sub-pages.css` — docs, anti-patterns, tutorials
- No preprocessor. No Tailwind. `<link rel="stylesheet">` resolved by the build tool.

**Deployment target:** Cloudflare Pages. Static assets from `build/`, API routes via `_redirects`.

---

## Non-Goals

- **Not a visual design tool.** No drag-and-drop, no Figma integration, no pixel output.
- **Not an AI model.** No inference, no embeddings, no vector search.
- **Not a component library.** Does not ship React/Vue/Svelte components.
- **Not a CSS framework.** Does not provide utility classes or design tokens for end projects.
- **Not a linter for general code quality.** Scope is design and UI anti-patterns only.
- **Not a replacement for a designer.** The process guides better AI output; it does not replace design judgment for novel problems.

---

## Constraints

- Detection engine must work with Node.js 18+. No Bun runtime dependency in the detection path.
- CLI must run with `npx` — zero install required for the detect command.
- Skill files must be plain markdown. No compiled output in the skill layer.
- The site must be deployable as a static build with no server-side rendering.
- Detection must produce no false positives on well-designed, non-AI-generated HTML. (The slop tests must be calibrated, not paranoid.)
- Provider-specific outputs are committed to the repo so users can install via `npx skills` directly from git without a build step.
