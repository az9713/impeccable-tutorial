# Command reference

All 23 Impeccable commands. Every command is accessed as `/impeccable <command> [target]`.

Type `/impeccable` with no arguments to see the grouped menu in your AI tool.

---

## Build

| Command | Argument | Description |
|---------|----------|-------------|
| `craft` | `[feature]` | Full end-to-end flow: shape, visual direction, build, browser iteration. The primary command for new features. |
| `shape` | `[feature]` | Produce a confirmed design brief before implementation. Covers scope, content states, visual direction, constraints, and anti-goals. |
| `teach` | — | Interactive interview that writes PRODUCT.md (required context) and optionally DESIGN.md. Run this first on any new project. |
| `document` | — | Generate DESIGN.md by reverse-engineering your existing codebase. Extracts color tokens, typography styles, spacing scale, and component patterns. |
| `extract` | `[target]` | Pull reusable tokens and components out of one-off implementations. Use when similar patterns appear in multiple places and should be systematized. |

---

## Evaluate

| Command | Argument | Description |
|---------|----------|-------------|
| `critique` | `[target]` | UX design review: visual hierarchy, clarity, emotional resonance, information architecture. Returns heuristic scores and specific findings. Does not fix — documents for other commands to address. |
| `audit` | `[target]` | Technical quality checks across five dimensions: accessibility (0–4), performance (0–4), responsive design (0–4), theming (0–4), anti-patterns (0–4). Total score out of 20 with P0–P3 prioritized findings and recommended next commands. |

---

## Refine

| Command | Argument | Description |
|---------|----------|-------------|
| `polish` | `[target]` | Final quality pass: design system alignment, micro-details, interaction states, information architecture drift, edge cases. Run last before shipping. |
| `bolder` | `[target]` | Amplify safe or bland designs. Pushes commitment — more contrast, more presence, more visual decision-making. Operates on the appropriate color strategy for the register (brand allows Committed/Full palette/Drenched; product stays in Restrained territory). |
| `quieter` | `[target]` | Tone down overstimulating or visually aggressive designs. Reduces color commitment, ornament, and animation. |
| `distill` | `[target]` | Strip to essence. Remove visual complexity, redundant content, nested structure, and unnecessary ornamentation. |
| `harden` | `[target]` | Make the UI production-ready beyond the happy path: error handling, i18n, extreme text lengths, overflow behavior, edge cases, and missing states. |
| `onboard` | `[target]` | Design the first-run experience: empty states, activation paths, zero-data states, and progressive feature introduction. |

---

## Enhance

| Command | Argument | Description |
|---------|----------|-------------|
| `animate` | `[target]` | Add purposeful motion: entrance animations, state transitions, microinteractions. Each variant uses a different motion vocabulary (cascade stagger, clip wipe, scale-and-focus, morph, parallax). Always respects `prefers-reduced-motion`. |
| `colorize` | `[target]` | Introduce strategic color to monochromatic or undercolored UIs. Each variant explores a different hue family and color strategy — not shades of one color. |
| `typeset` | `[target]` | Improve typography: font choices, scale hierarchy, weight contrast, line length, and letter spacing. Each variant uses a genuinely different type pairing and scale ratio. |
| `layout` | `[target]` | Fix spatial relationships: spacing rhythm, grid structure, visual hierarchy, and element sizing. Each variant uses a different structural arrangement (stacked / side-by-side / grid / asymmetric). |
| `delight` | `[target]` | Add moments of personality and memorability. Brand mode: unexpected microinteractions, typographic surprises, illustrated accents, easter eggs. Product mode: satisfying state feedback, personality in empty states, microinteractions that confirm completion. |
| `overdrive` | `[target]` | Push past conventional limits. Ambitious visual effects that would make a senior frontend engineer stop and stare. Each variant breaks a different design convention. |

---

## Fix

| Command | Argument | Description |
|---------|----------|-------------|
| `clarify` | `[target]` | Improve UX copy: button labels, error messages, placeholder text, empty state copy, tooltip text. Eliminates hedging, vague language, and ambiguous labels. |
| `adapt` | `[target]` | Make the UI work across target devices and screen sizes. Not "add breakpoints" — makes responsive behavior intentional and compositional. Variants target different device contexts (mobile-first, tablet, desktop, or print/low-data). |
| `optimize` | `[target]` | Diagnose and fix UI performance: layout thrash, expensive animations, unoptimized images, blocking renders, unnecessary repaints. |

---

## Iterate

| Command | Argument | Description |
|---------|----------|-------------|
| `live` | — | Interactive browser overlay. Select any element, pick a design action, get three AI-generated variants hot-swapped via HMR. Cycle through variants, tune with parameter sliders and toggles, accept the winner into source. See [Iterate live in the browser](../guides/iterate-live-in-browser.md). |

---

## Management

| Command | Argument | Description |
|---------|----------|-------------|
| `pin` | `<command>` | Create a standalone shortcut so `/<command>` invokes `/impeccable <command>`. Writes to all harness directories in the project. |
| `unpin` | `<command>` | Remove a standalone shortcut. |

---

## Usage patterns

**Scope a command to a specific area:**

```
/impeccable audit landing-page
/impeccable polish settings sidebar
/impeccable harden checkout-form
/impeccable bolder hero
```

The target is free-form. Use page names, component names, section names, or route paths.

**Run without a target:**

```
/impeccable audit
/impeccable polish
```

Without a target, commands scope themselves to the full project or the most recently worked-on area.

**Use `/impeccable` directly with a description:**

```
/impeccable redo this hero section
/impeccable the pricing table needs to feel more premium
```

When the first word doesn't match a command name, the full argument is treated as a general design task. The skill applies setup steps, shared design laws, and the register reference — useful for one-off requests that don't fit a specific command.
