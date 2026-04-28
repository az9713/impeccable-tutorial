# How the skill reaches your AI

When you type `/impeccable audit`, your AI tool executes a skill. That skill is a markdown file with YAML frontmatter — but how did it get from this repository's `source/` directory into your tool's context? This document traces that path.

---

## The source of truth

All skill content lives in one place:

```
source/skills/impeccable/
├── SKILL.md                  ← the main skill file (frontmatter + shared laws + command router)
├── reference/
│   ├── audit.md              ← loaded when /impeccable audit is invoked
│   ├── polish.md             ← loaded when /impeccable polish is invoked
│   ├── craft.md              ← loaded when /impeccable craft is invoked
│   ├── live.md               ← loaded when /impeccable live is invoked
│   ├── brand.md              ← loaded for brand-register tasks
│   ├── product.md            ← loaded for product-register tasks
│   ├── typography.md         ← domain reference, loaded by craft and shape
│   ├── color-and-contrast.md ← domain reference, loaded by craft and shape
│   └── ...                   ← 23 command files + 7 domain files total
└── scripts/
    ├── load-context.mjs      ← reads PRODUCT.md and DESIGN.md at session start
    ├── live.mjs              ← starts the live mode helper server
    ├── live-poll.mjs         ← polls for browser events during live mode
    ├── live-wrap.mjs         ← locates elements in source and inserts variant wrappers
    ├── live-accept.mjs       ← commits accepted variants and cleans up scaffolding
    ├── pin.mjs               ← writes and removes standalone command shortcuts
    └── command-metadata.json ← single source of truth for command descriptions and hints
```

Source files contain placeholders like `{{model}}`, `{{config_file}}`, and `{{command_prefix}}` that get replaced with harness-specific values during the build.

---

## The build step

```bash
bun run build
```

This runs `scripts/build.js`, which reads every provider config from `scripts/lib/transformers/providers.js` and applies a config-driven transformer to the source. Each provider config specifies:

- Its name and output directory
- Placeholder values (which model name to use, which config file name, how slash commands work)
- Whether the harness supports frontmatter fields like `argument-hint` or `allowed-tools`
- Whether commands use `/` or `$` as a prefix (Codex uses `$impeccable`)

The output lands in harness-specific directories, all committed to the repo:

```
.claude/skills/impeccable/      ← Claude Code
.cursor/skills/impeccable/      ← Cursor
.agents/skills/impeccable/      ← Codex CLI
.github/skills/impeccable/      ← GitHub Copilot
.opencode/skills/impeccable/    ← OpenCode
.gemini/skills/impeccable/      ← Gemini CLI
.pi/skills/impeccable/          ← Pi
.trae/skills/impeccable/        ← Trae International
.trae-cn/skills/impeccable/     ← Trae China
.rovodev/skills/impeccable/     ← Rovo Dev
```

These directories are intentionally committed. When you install Impeccable by copying a directory into your project, you're copying one of these pre-built outputs.

---

## How your AI tool loads it

When you start a session with Impeccable installed, your AI tool scans its skill directory and registers available skills. The `SKILL.md` frontmatter tells the tool:

```yaml
name: impeccable
description: Use when the user wants to design, redesign, shape, critique, audit...
user-invocable: true
argument-hint: "[craft|shape · audit|critique · ...]"
allowed-tools:
  - Bash(npx impeccable *)
```

The `description` field is tuned for auto-triggering: when you describe a UI task without explicitly typing `/impeccable`, the tool's skill-routing logic may recognize the task as design-related and activate the skill automatically.

`allowed-tools` pre-authorizes the `npx impeccable *` commands (the CLI detector and live mode scripts) so the AI can run them without prompting you for permission each time.

---

## What gets loaded when you type a command

When you type `/impeccable audit landing-page`, the skill's command router matches `audit` and loads `reference/audit.md` into the active context. The full context stack at that point is:

```
SKILL.md (shared laws + command router)
  + brand.md or product.md (register reference)
  + reference/audit.md (command reference)
  + PRODUCT.md contents (via load-context.mjs)
  + DESIGN.md contents (via load-context.mjs, if present)
```

This is why the same command produces different output in different projects and for different registers — the context stack is different every time.

---

## Keeping the built files in sync

The harness directories are generated from source. After editing anything in `source/skills/impeccable/`, run:

```bash
bun run build
```

The build validator checks for stale numeric counts (command count in README, plugin.json, marketplace.json) and fails if any disagree with the router table — so stale documentation is caught before it ships.

For the CLI's browser detector, a separate build step is needed:

```bash
bun run build:browser
```

This regenerates `src/detect-antipatterns-browser.js` from `src/detect-antipatterns.mjs`. They must stay in sync — the CLI, the Chrome extension, and the live-page overlay all run the detector, but in different environments (Node.js vs. browser vs. jsdom).

---

## The install experience

The install process (copying a harness directory into your project) is intentionally low-friction: no npm install, no config files, no API keys. You copy pre-built files and start using commands.

`npx skills install` (the Agent Skills installer) reads the built harness directories directly from this repository and copies them into user projects. This is why the harness directories are committed rather than gitignored.

For projects that update Impeccable from the registry, the skill's post-update cleanup script (`scripts/cleanup-deprecated.mjs`) runs once after update to remove files from renamed or merged commands — handling the migration automatically without user intervention.
