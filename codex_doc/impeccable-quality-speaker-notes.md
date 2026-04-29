# Speaker Notes For The Impeccable Quality Image Infographics

Audience assumption: the room is new to Impeccable and new to frontend. They know AI can write code, but they may not know why AI-generated interfaces often look generic.

Suggested framing: "Impeccable is a way to make an AI frontend partner behave more like a design-aware builder and less like a template generator."

Use these notes with the image panels in `codex_doc/infographics/`. The full contact sheet is `codex_doc/infographics/impeccable-quality-infographic-sheet.png`, and each section below maps to the matching numbered PNG panel.

## Opening, 60 seconds

Start with the basic vocabulary.

Frontend means the part of software people see and interact with in the browser or app: layout, text, buttons, forms, motion, colors, error states, and mobile behavior.

Most AI tools can generate frontend code quickly. The problem is taste and verification. Without a strong brief, the model often reaches for patterns it has seen everywhere: centered hero sections, purple gradients, nested cards, tiny gray text, generic fonts, and bouncy motion.

Impeccable solves this by adding three things around the AI:

1. A design brief and design vocabulary.
2. Focused commands for specific design jobs.
3. Detectors, tests, and browser loops that catch weak results.

## Image 1: The Quality Flywheel

What to point at first: the loop from "Project Context" to "Browser Evidence" and back to "Tests and Fixtures."

Say:

"This is the whole system in one picture. Impeccable does not trust a single prompt to produce quality. It sets context, applies design rules, routes the task to a specific command, makes the AI build, then checks the result in the browser and with automated detection."

Beginner translation:

"Imagine asking someone to design a kitchen. You do not just say, make it nice. You tell them who lives there, what style the house has, what must never happen, and what kind of job you need done today. Then you inspect the finished kitchen in real light. Impeccable does the same thing for frontend."

Key idea:

Quality is produced by a loop:

1. Give the AI better context.
2. Narrow the task.
3. Build real code.
4. Inspect the real screen.
5. Fix what does not meet the bar.

Transition:

"Next, we zoom into what the AI actually receives before it starts editing code."

## Image 2: The Context Stack An Agent Receives

What to point at first: the stack order from user request to active AI context.

Say:

"The user request is only the top layer. Impeccable adds several layers underneath it. PRODUCT.md tells the AI who the product is for and what brand voice to use. DESIGN.md tells it the color, typography, spacing, and component system. The register reference tells it whether the design itself is the product, like a landing page, or whether design serves a tool, like a dashboard. The command reference tells it what discipline to use."

Beginner translation:

"This is the difference between saying, make this page better, and saying, improve the checkout page for this brand, using this design system, in a product UI mode, with the polish checklist."

Important distinction:

PRODUCT.md is strategic. It says who, why, tone, and anti-references.

DESIGN.md is visual. It says colors, fonts, spacing, components, and motion.

Register is the mode. Brand work can be more expressive. Product work should be efficient and task-focused.

Transition:

"Now that we know what the AI reads, let us look at how the same skill reaches different AI coding tools."

## Image 3: Source To Every AI Harness

What to point at first: `source/skills/impeccable` on the left and the harness directories on the right.

Say:

"This repo has one source of truth. The skill is authored once in source/skills/impeccable. The build system reads that source, then transforms it for Claude Code, Cursor, Codex, GitHub Copilot, Gemini, OpenCode, and other harnesses."

Beginner translation:

"Different AI coding tools expect skills in different folders and different metadata formats. Impeccable avoids maintaining eleven separate versions by generating them from one source."

Why it matters:

If the design rules change in the source, the provider outputs can be regenerated. That keeps the quality doctrine consistent across tools.

Point out:

`scripts/lib/transformers/providers.js` defines which harnesses exist.

`scripts/lib/transformers/factory.js` writes the provider-specific SKILL.md files.

`scripts/build.js` coordinates the site build, provider outputs, ZIPs, API data, and local harness sync.

Transition:

"The next image explains why Impeccable has many commands instead of one giant improve-design command."

## Image 4: Command System As Design Specialization

What to point at first: the categories around `/impeccable`.

Say:

"Frontend quality is not one thing. A design can have good colors but bad spacing. It can have strong layout but weak mobile behavior. It can look polished but fail accessibility. Impeccable splits design work into commands so the AI knows which lens to use."

Beginner translation:

"Think of these commands like specialists in a studio. `typeset` is the typography person. `layout` is the composition person. `audit` is the technical reviewer. `harden` is the person who checks real-world edge cases. `live` is the visual iteration session."

Useful examples:

If text hierarchy feels flat, use `typeset`.

If a page looks crowded or random, use `layout`.

If the UI works but needs final consistency, use `polish`.

If the page breaks on mobile, use `adapt`.

If the result needs measurable review, use `audit`.

Transition:

"Specialized commands guide the AI before and during implementation. The detector checks after and during review."

## Image 5: Anti-Pattern Detector As Guardrail

What to point at first: the environment split: regex, jsdom, browser, Puppeteer URL scan.

Say:

"The detector is design lint. In regular programming, lint catches code smells. Here, the detector catches design smells: side-tab borders, gradient text, AI color palettes, nested cards, poor contrast, long line length, cramped padding, and other common failures."

Beginner translation:

"Some design mistakes can be checked by code. If text contrast is too low, the detector can report it. If a card has the classic thick colored stripe on the side, the detector can report it. If a page uses the same spacing everywhere, that can be flagged too."

Important nuance:

The detector has multiple paths because frontend can exist in many forms:

1. Raw HTML and CSS files.
2. React or Vue components.
3. Static HTML with jsdom.
4. A real browser page with real layout.
5. A URL loaded through Puppeteer.

Say:

"This is why Impeccable is more than advice. It converts part of the design doctrine into executable feedback."

Transition:

"Automated checks are useful, but visual quality still needs live judgment. That is where live mode comes in."

## Image 6: Live Mode Visual Iteration

What to point at first: the sequence from browser selection to accepted source code.

Say:

"Live mode lets the user work visually. They select an element in the browser, choose an action, and the agent generates variants. Those variants are inserted into source, shown in the browser, and one can be accepted back into the code."

Beginner translation:

"Instead of describing a component from memory, you point at the actual thing on the page. The AI receives the rendered element details, creates alternatives, and you judge them on screen."

Explain the moving parts:

The browser is where the user selects and compares.

The helper server carries events between the browser and the agent.

The agent polls for events and writes source changes.

The wrap script finds the selected element in source and creates a safe insertion point.

The accept script cleans the temporary variant scaffolding and keeps the chosen result.

Key idea:

Live mode turns design feedback from abstract chat into an interactive browser workflow.

Transition:

"The last process image shows what protects the project from drifting as the repo changes."

## Image 7: Test And Build Safety Net

What to point at first: change, tests, fixtures, validators, provider regeneration.

Say:

"A tool that enforces quality has to keep itself honest. This repo tests detector rules with should-flag and should-pass fixtures. It validates generated counts. It checks skill frontmatter. It rebuilds provider outputs and browser bundles so the skill, CLI, extension, and website do not drift apart."

Beginner translation:

"When the project teaches the AI a new rule, it also needs examples proving the rule catches bad designs and does not annoy users by flagging good designs."

Call out the fixture pattern:

For a new anti-pattern, the repo expects examples that should be flagged and examples that should pass. That false-positive discipline matters because a noisy detector loses trust quickly.

Transition:

"Now we can compress the whole system into one beginner mental model."

## Image 8: Beginner Mental Model

What to point at first: frontend, design system, skill, command, detector, browser loop.

Say:

"This is the simplest version. Frontend is what the user sees. A design system is the reusable rulebook for that frontend. A skill gives the AI that rulebook. A command tells it which job to do. A detector checks for known mistakes. A browser loop proves the result on screen."

Close with:

"Impeccable delivers high-quality frontend designs because it combines design taste, project context, task specialization, deterministic checks, and visual iteration. It makes the AI slower in the right places: before it edits, while it chooses a design direction, and after it sees the result."

## Presenter Cheat Sheet

Use these one-line definitions if the audience gets lost:

| Term | Simple definition |
|---|---|
| Frontend | The visible, interactive part of software. |
| Design system | A reusable set of visual and interaction rules. |
| Skill | A package of instructions an AI coding tool can load. |
| Harness | The AI coding environment, such as Claude Code, Cursor, Codex, or Gemini CLI. |
| Register | The design mode: brand surface or product surface. |
| Anti-pattern | A recurring design mistake with a recognizable shape. |
| Fixture | A test example used to prove a rule catches the right thing. |
| Live mode | Browser-based variant generation and acceptance. |

## Suggested 12 Minute Run Of Show

| Time | Segment |
|---|---|
| 0:00-1:00 | Explain the problem: AI frontend output is fast but generic. |
| 1:00-2:30 | Image 1, the quality flywheel. |
| 2:30-4:00 | Image 2, the context stack. |
| 4:00-5:30 | Image 3, source to every harness. |
| 5:30-7:00 | Image 4, command specialization. |
| 7:00-8:30 | Image 5, detector guardrails. |
| 8:30-10:00 | Image 6, live visual iteration. |
| 10:00-11:00 | Image 7, test and build safety net. |
| 11:00-12:00 | Image 8, beginner mental model and close. |

## Evidence Pointers For Q&A

If someone asks "where is that in the code?", point them here:

| Claim | Source path |
|---|---|
| The skill loads context and shared design laws | `source/skills/impeccable/SKILL.md` |
| Commands and descriptions are data-backed | `source/skills/impeccable/scripts/command-metadata.json` |
| Provider outputs are generated | `scripts/build.js`, `scripts/lib/transformers/` |
| Anti-pattern checks are executable | `src/detect-antipatterns.mjs` |
| The CLI routes to the detector | `bin/cli.js` |
| Browser live iteration is script-backed | `source/skills/impeccable/scripts/live*.mjs` |
| Regression safety comes from fixtures | `tests/fixtures/antipatterns/`, `tests/detect-antipatterns-fixtures.test.mjs` |
