# Quickstart

Install Impeccable and run your first command in under 15 minutes.

---

## Prerequisites

- An AI coding tool: Claude Code, Cursor, Gemini CLI, Codex CLI, OpenCode, GitHub Copilot, or Kiro
- A frontend project with at least one HTML, CSS, or component file

No build tools, no dependencies, no account required.

---

## Step 1: Install

**Recommended — CLI installer (detects your tools automatically):**

```bash
npx impeccable skills install
```

Run this inside your project directory. The installer detects which AI tools you have configured (`.claude/`, `.cursor/`, `.gemini/`, etc.) and installs the matching skill files for each. It will ask if you want to prefix commands to avoid conflicts with other skills.

After running, open your project in your AI tool. The skill loads automatically when you type `/impeccable`.

---

**Alternative — Download from impeccable.style:**

Visit [impeccable.style](https://impeccable.style), download the ZIP for your tool, extract it, and copy the folder to your project root. Tool-specific notes:

| Tool | Notes |
|------|-------|
| Claude Code | Copy `.claude/` to your project root, or copy `.claude/*` to `~/.claude/` for a global install. |
| Cursor | Copy `.cursor/` to your project root. Requires Nightly channel: Cursor Settings → Beta → Agent Skills: On. |
| Gemini CLI | Copy `.gemini/` to your project root. Requires preview version: `npm i -g @google/gemini-cli@preview`, then enable Skills in `/settings`. |
| Codex CLI | Copy `.agents/` to your project root. |
| GitHub Copilot | Copy `.github/` to your project root. |
| OpenCode | Copy `.opencode/` to your project root. |

---

## Step 2: Set up your project context

Impeccable needs to know about your project before it can produce on-brand output.

Run:

```
/impeccable teach
```

The skill will ask you a short series of questions:

1. Who are your users?
2. What does the product do?
3. Is this brand (marketing/landing) or product (app UI/dashboard) work?
4. What's the brand personality?
5. What designs or aesthetics should be avoided?

Your answers are written to `PRODUCT.md` at your project root. This file is read at the start of every subsequent command — it's what makes Impeccable project-specific rather than generic.

> **Tip:** If you have a design system, run `/impeccable document` after `teach` to generate `DESIGN.md` from your existing code. With both files in place, every command respects your colors, fonts, and spacing tokens.

---

## Step 3: Run your first command

**Try an audit** to see your UI's current state:

```
/impeccable audit
```

Or scope it to a specific area:

```
/impeccable audit landing-page
/impeccable audit checkout
```

Expected output: a scored report across five dimensions (accessibility, performance, responsive design, theming, anti-patterns), with prioritized findings (P0–P3) and recommended next commands.

**Try a polish pass** to prepare a feature for shipping:

```
/impeccable polish
```

**Try a critique** to get a UX design review with heuristic scoring:

```
/impeccable critique hero
```

---

## Step 4: Explore the command menu

Type `/impeccable` with no arguments to see the full command menu, grouped by category:

```
/impeccable
```

The menu shows all 23 commands with their descriptions. From there you can run any command directly, or see [command categories](../concepts/command-categories.md) and the [command reference](../reference/commands.md) for details on each.

---

## What's next

- [Teach your AI](teach-your-ai.md) — deeper guide to PRODUCT.md and DESIGN.md
- [The register system](../concepts/the-register-system.md) — understand brand vs. product mode
- [Shape then build](../guides/shape-then-build.md) — the full craft flow for new features
- [Command reference](../reference/commands.md) — all 23 commands
