# Teach your AI

PRODUCT.md and DESIGN.md are the two files that transform Impeccable from a generic design tool into one that knows your project. Without them, commands produce high-quality output — but output that could be for any project. With them, every command produces output that fits your brand, respects your design system, and avoids the aesthetics you explicitly don't want.

---

## Why these files matter

Every Impeccable command begins by running `scripts/load-context.mjs`. This script reads both files and returns their full contents as JSON before any design work starts. The AI receives this context alongside the command's reference file and the shared design laws — it's the stack that makes "on-brand" mean something specific.

If PRODUCT.md is missing or contains placeholder text (under 200 characters, or still has `[TODO]` markers), commands stop and prompt you to run `/impeccable teach` before proceeding. This is intentional: the skill refuses to guess at your brand when it can read it directly.

---

## PRODUCT.md

**Create it with:**

```
/impeccable teach
```

This runs an interactive interview that asks about your project, then writes `PRODUCT.md` to your project root. The file uses a fixed structure that the skill knows how to parse.

### What it contains

| Section | What goes here |
|---------|----------------|
| `## Register` | `brand` or `product` — determines which design mode is active |
| `## Users` | Who uses this, and what they're trying to accomplish |
| `## Product Purpose` | What the product does and how success is measured |
| `## Brand Personality` | Adjectives and a three-word summary of the brand voice |
| `## Anti-references` | Designs, aesthetics, or patterns to explicitly avoid |
| `## Design Principles` | Named rules that govern every design decision |
| `## Accessibility & Inclusion` | Baseline commitments for contrast, keyboard nav, screen readers |

### The register field

```markdown
## Register

brand
```

This single field — `brand` or `product` — determines which reference file the skill loads for every subsequent command. Get it wrong and the AI optimizes for the wrong goals. See [The register system](../concepts/the-register-system.md).

### Anti-references

Anti-references are the most underused section. They're explicit design aesthetics the AI should refuse to produce. Be specific:

```markdown
## Anti-references

- Dark mode with purple gradients and neon accents
- SaaS hero-metric layouts (big number + supporting stats + gradient accent)
- Identical card grids (same card shape repeated with icon + heading + text)
- Glassmorphism used decoratively
- "Boost your productivity" benefit-list copy
```

The skill loads these at context time, so when a command produces design choices, it actively avoids everything on this list.

### Editing PRODUCT.md manually

PRODUCT.md is a plain markdown file. Edit it directly when the project evolves — new brand direction, new user segment, updated principles. The skill re-reads it on every new session.

---

## DESIGN.md

**Generate it from existing code with:**

```
/impeccable document
```

This command reads your codebase, identifies color tokens, typography styles, spacing scales, component patterns, and elevation rules, then writes `DESIGN.md` at the project root.

**Or create it manually** using `/impeccable teach`, which offers to write a starter DESIGN.md after the PRODUCT.md interview.

### What it contains

| Section | What goes here |
|---------|----------------|
| Colors | Named tokens in OKLCH (or other formats), with their semantic roles |
| Typography | Font families, scale steps, weight, line-height, and usage rules |
| Spacing | The spacing scale tokens (4px / 8px / 16px / 24px / etc.) |
| Elevation | Shadow vocabulary, when flat vs. raised |
| Components | Key component specs: radius, padding, background, border rules |
| Do's and Don'ts | Explicit decisions that should never be reversed |

### How commands use DESIGN.md

When DESIGN.md is present, commands like `polish`, `typeset`, `colorize`, and `layout` use it to:

- Enforce design token usage (no hard-coded `#3b82f6` when `--color-accent` exists)
- Detect drift from the design system (using the wrong border-radius, skipping a spacing token)
- Produce code that uses your actual variable names and component patterns, not invented ones

Without DESIGN.md, these commands still follow the shared design laws and register principles, but they can't enforce your specific system.

### Keeping DESIGN.md current

Re-run `/impeccable document` when your design system changes significantly — new color tokens, a new component library, a new spacing scale. The command reads the current codebase state each time.

---

## What happens with both files present

A typical command session with both files looks like this:

1. You type `/impeccable polish checkout`
2. The skill runs `load-context.mjs`
3. `load-context.mjs` reads PRODUCT.md (users, register = `product`, anti-references, principles) and DESIGN.md (your color tokens, spacing scale, component rules)
4. The skill determines register = `product`, loads `reference/product.md`
5. The skill loads `reference/polish.md`
6. The AI has: shared design laws + product reference + polish instructions + your project's full design context
7. The polish pass aligns the checkout UI to your token system, fixes drift, enforces your spacing scale, and avoids every aesthetic on your anti-references list

Without PRODUCT.md and DESIGN.md, step 3 returns empty. The command runs on general design principles alone — still good, but not yours.

---

## Troubleshooting

**PRODUCT.md exists but the command runs `/impeccable teach` anyway.**
The file is too short (under 200 characters) or still contains `[TODO]` placeholder text. Complete the teach interview or fill in the missing sections.

**DESIGN.md is missing.**
The skill nudges you once per session: "Run `/impeccable document` for more on-brand output." You can proceed without it; commands fall back to the shared design laws. Create DESIGN.md when you want token-level precision.

**The AI ignores my anti-references.**
The anti-references section of PRODUCT.md must use the `## Anti-references` heading exactly. Check for typos. If the section is present and correctly headed, run `load-context.mjs` directly in the terminal to verify it's being read:

```bash
node .claude/skills/impeccable/scripts/load-context.mjs
```

The JSON output shows exactly what the skill receives.
