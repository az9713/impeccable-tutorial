# What is Impeccable?

Impeccable is a design skill for AI coding tools. It gives your AI a professional design vocabulary — typography systems, color theory, layout principles, motion design — so it produces interfaces that look considered rather than generated.

---

## The problem it solves

Every language model learned from the same dataset. Without guidance, you get the same defaults every time: Inter font, purple gradients, cards nested in cards, gray text on colored backgrounds, bounce easing. These patterns are common enough in training data to be the path of least resistance — and distinctive enough to immediately signal "AI made this."

Impeccable fights that bias by loading explicit design knowledge into your AI before it writes a single line of code.

## How it works

When you type a command like `/impeccable audit` or `/impeccable polish`, three things happen in sequence:

**1. Context is loaded.**
The skill runs `scripts/load-context.mjs`, which reads two files from your project root:

- `PRODUCT.md` — who your users are, what the product does, your brand personality, your anti-references (designs you want to avoid)
- `DESIGN.md` — your color tokens, typography system, spacing scale, component rules

Without these files, commands still work — but they produce generic output. With them, every command knows what "on-brand" means for your specific project.

**2. The register is determined.**
Every design task belongs to one of two modes:

- **Brand** — marketing pages, landing pages, campaign sites, portfolios. The design IS the product; distinctiveness is the goal.
- **Product** — app UI, dashboards, admin interfaces, tools. The design SERVES the product; earned familiarity is the goal.

The skill identifies which mode applies (from cues in the task, the surface being worked on, or the `register` field in PRODUCT.md) and loads the matching reference: `brand.md` or `product.md`.

**3. The command reference is loaded.**
Each of the 23 commands has its own reference file — a focused set of instructions for that command's discipline. Running `/impeccable typeset` loads `reference/typeset.md`. Running `/impeccable animate` loads `reference/animate.md`. The command's reference, the register reference, the shared design laws, and your project context all compose into the active AI context for that task.

## The mental model

Think of Impeccable as a senior design director joining your AI session. Before the AI touches a file, the director:

1. Reads your project brief (PRODUCT.md)
2. Reads your design system spec (DESIGN.md)
3. Decides whether this is brand or product work
4. Loads the relevant design playbook for the specific task

Then the director watches the AI work, enforcing hard rules (no gradient text, no side-stripe borders, no pure black) and pulling from the appropriate discipline (typography, motion, layout, accessibility, etc.) depending on the command.

## What's included

**The skill itself** — 23 commands organized into six categories:

| Category | Commands |
|----------|----------|
| Build | `craft`, `shape`, `teach`, `document`, `extract` |
| Evaluate | `critique`, `audit` |
| Refine | `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard` |
| Enhance | `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive` |
| Fix | `clarify`, `adapt`, `optimize` |
| Iterate | `live` |

**Seven domain reference files** — loaded selectively by the craft and shape commands based on task needs:

| Reference | Covers |
|-----------|--------|
| `typography.md` | Type systems, font pairing, modular scales, OpenType features |
| `color-and-contrast.md` | OKLCH, tinted neutrals, dark mode, accessibility |
| `spatial-design.md` | Spacing systems, grids, visual hierarchy |
| `motion-design.md` | Easing curves, staggering, reduced motion |
| `interaction-design.md` | Forms, focus states, loading patterns |
| `responsive-design.md` | Mobile-first, fluid design, container queries |
| `ux-writing.md` | Button labels, error messages, empty states |

**The CLI** — a standalone detector that catches 24 anti-patterns without an AI harness:

```bash
npx impeccable detect src/
npx impeccable detect https://example.com
```

**Live mode** — a browser overlay that lets you select any element, pick a design action, and get three distinct variants hot-swapped via your dev server's HMR without leaving the browser.

## How it reaches your AI tool

Impeccable is built from a single source in `source/skills/impeccable/` and distributed to 11 AI harnesses via a config-driven build pipeline. When you run `bun run build`, the source is compiled into harness-specific directories (`.claude/skills/`, `.cursor/skills/`, `.agents/skills/`, etc.). Each harness reads from its own directory — the same content, adapted to each tool's frontmatter format, placeholder system, and command syntax.

See [How the skill reaches your AI](../architecture/how-the-skill-reaches-your-ai.md) for the full pipeline.
