# Design laws and anti-patterns

Impeccable enforces two overlapping sets of design rules:

- **Shared design laws** — built into the skill, applied by the AI to every command, both registers
- **Anti-pattern detection** — built into the CLI, detectable mechanically in source files and live pages

They cover the same territory from two directions: the laws tell the AI what to do, the detector tells you what slipped through.

---

## Shared design laws

These rules apply to every design task, regardless of register or command. The AI reads them from `SKILL.md` before any other context is loaded.

### Color

**Use OKLCH.** All color declarations should use `oklch(lightness% chroma hue)`. OKLCH is perceptually uniform — the same chroma value at any hue looks equally saturated. This makes accessible, cohesive palettes far easier to build than with hex or HSL.

**Never pure black or white.** `#000` and `#fff` are banned. Every neutral should be tinted toward the brand hue. A chroma of 0.005–0.01 is enough — barely perceptible, but it gives the neutral a relationship to the palette rather than floating in isolation.

**Choose a color strategy before choosing colors.** Four options on a commitment axis:

| Strategy | Description | Typical use |
|----------|-------------|-------------|
| Restrained | Tinted neutrals + one accent at ≤10% of the surface | Product default, brand minimalism |
| Committed | One saturated color carries 30–60% of the surface | Brand default for identity-driven pages |
| Full palette | 3–4 named color roles, each used deliberately | Brand campaigns, data visualization |
| Drenched | The surface IS the color | Brand heroes, campaign pages |

The "one accent ≤10%" rule only applies to Restrained. The other strategies exceed it intentionally. Collapsing every design to Restrained by reflex is itself an anti-pattern.

### Theme

Dark vs. light is never a default. Before choosing, write one sentence of physical scene: who uses this, where, under what ambient light, in what mood. "SRE glancing at incident severity on a 27-inch monitor at 2am in a dim room" forces a dark answer. "Shopper browsing a luxury goods collection from a phone in natural light" forces a light answer.

If the sentence doesn't force the answer, add more specificity until it does.

### Typography

**Cap body line length at 65–75ch.** Past 75 characters, the eye struggles to track from the end of one line to the start of the next. Use `max-width` on prose containers.

**Build hierarchy through scale and weight contrast.** The ratio between adjacent type scale steps should be at least 1.25. Flat scales (all body text the same size, headings only slightly larger) fail to communicate structure.

### Layout

**Vary spacing for rhythm.** Using the same padding on every element is monotony, not consistency. Rhythm comes from intentional variation — tighter clusters inside sections, more generous gaps between sections.

**Cards are the lazy answer.** Use them only when content genuinely benefits from an enclosure affordance. Nested cards are always wrong — flatten the hierarchy.

**Don't wrap everything in a container.** Most elements don't need one. Background-spanning sections and edge-to-edge layouts are valid.

### Motion

**Don't animate CSS layout properties.** `width`, `height`, `padding`, `margin`, `top`, `left` — animating these causes layout thrash and visible jank. Animate `transform` and `opacity` only.

**Ease out with exponential curves.** `ease-out-quart`, `ease-out-quint`, or `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). These feel physically natural — fast start, decelerate to rest. Bounce and elastic easing are banned because they feel dated and arbitrary.

**Respect `prefers-reduced-motion`.** Every animation that isn't essential to understanding state must be disabled or substituted with a fast fade when the user has this preference set.

---

## Absolute bans

These are match-and-refuse. The AI is instructed to rewrite rather than produce any of these, regardless of register, command, or user request.

### Side-stripe borders

`border-left` or `border-right` greater than 1px used as a colored accent on cards, list items, callouts, or alerts.

This is one of the most recognizable AI-generated design tells. It appears across 80% of AI-generated dashboards and admin UIs. Replace with full borders, background tints, leading numbers or icons, or no articulation at all.

### Gradient text

`background-clip: text` combined with a gradient fill on text.

Gradient text is decorative, never meaningful, and another strong AI-slop signal. Use a single solid color. If emphasis is needed, use weight or size — never gradient fill.

### Glassmorphism as default

Blurred translucent cards, glass borders, glow backgrounds used decoratively.

Glassmorphism has legitimate uses (system-level overlays, focus contexts). As a default aesthetic it's a cliché. If used, it should be rare and purposeful.

### The hero-metric template

Big number + small label + supporting stats + gradient accent.

This layout pattern appears in millions of AI-generated SaaS landing pages and dashboards. It reads as template output, not designed output.

### Identical card grids

Same-sized cards with icon + heading + text, repeated endlessly.

The uniform grid of interchangeable content cards is the most common AI-generated layout failure. It flattens hierarchy, treats all content as equal importance, and signals that no design judgment was applied.

### Modal as first thought

Modals are usually laziness. Inline editing, progressive disclosure, slide-over panels, and separate routes are almost always better answers. Exhaust those alternatives before reaching for a modal.

---

## Anti-pattern detection (the CLI)

The `npx impeccable detect` CLI catches 24 design issues mechanically — no AI required. It scans HTML, CSS, and JavaScript for patterns that match known anti-patterns and general quality issues.

Run it on a directory:

```bash
npx impeccable detect src/
```

On a file:

```bash
npx impeccable detect index.html
```

On a live URL (uses Puppeteer):

```bash
npx impeccable detect https://your-site.com
```

For fast CI scans (regex-only, no Puppeteer, JSON output):

```bash
npx impeccable detect --fast --json src/
```

### What it detects

The 24 rules split into two categories:

**AI slop tells** — patterns that mark output as AI-generated:

| Rule | What it catches |
|------|----------------|
| `side-tab` | `border-left` or `border-right` as a colored accent ≥2px on cards or alerts |
| `purple-gradient` | Purple/violet gradient backgrounds (the default AI color palette) |
| `bounce-easing` | `cubic-bezier` values that produce bounce or elastic motion |
| `dark-glow` | Glowing colored shadows on dark backgrounds (cyan/purple halos) |
| `gradient-text` | `background-clip: text` with a gradient fill |
| `glassmorphism` | `backdrop-filter: blur` combined with `background: rgba(...)` used decoratively |
| `hero-metric` | Hero layout with oversized stat + label + supporting metrics pattern |
| `icon-tile-stack` | Rows of icon tiles above headings (the feature grid cliché) |
| `flat-type-hierarchy` | Page headings less than 1.2x larger than body text |

**General design quality** — issues that affect usability regardless of origin:

| Rule | What it catches |
|------|----------------|
| `low-contrast` | Text with a contrast ratio below 4.5:1 (WCAG AA) |
| `long-lines` | Body text containers wider than 80ch |
| `cramped-padding` | Padding less than 8px on interactive or content elements |
| `small-touch-target` | Interactive elements smaller than 44×44px |
| `skipped-headings` | Heading hierarchy that jumps levels (h1 → h3) |
| `gray-on-color` | Gray text on a non-neutral (colored) background |
| `missing-alt` | Images without alt attributes |

And several more across layout, spacing, and interaction quality.

### Interpreting results

Each finding reports:
- The rule ID and category (`slop` or `quality`)
- The HTML snippet where the issue was detected
- A short description of why it's a problem

Use the findings to guide which Impeccable commands to run next: `low-contrast` findings → `/impeccable audit`, `flat-type-hierarchy` → `/impeccable typeset`, `cramped-padding` → `/impeccable layout`.

### Using it in CI

The detector exits with code `1` when issues are found, `0` when clean. Use this for automated quality gates:

```bash
# Fail CI if any anti-patterns are detected
npx impeccable detect --fast --json src/ && echo "Clean" || exit 1
```

The `--fast` flag skips Puppeteer and runs regex-only checks, which is suitable for CI where a browser is unavailable or expensive.
