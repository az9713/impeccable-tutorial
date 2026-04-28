# Iterate live in the browser

Live mode is Impeccable's interactive design exploration tool. You select any element on your running dev-server page, choose a design action, and the AI generates three distinct HTML+CSS variants that hot-swap via HMR — no page reload, no code-then-refresh cycle.

---

## Prerequisites

- A running dev server with hot module replacement (Vite, Next.js, SvelteKit, Astro, Nuxt, Bun's HTML server), **or** a static HTML file open in the browser
- Impeccable installed in your project (the live scripts live in `.claude/skills/impeccable/scripts/`)

---

## Start live mode

```
/impeccable live
```

The skill runs `scripts/live.mjs`, which:

1. Starts a small helper HTTP server on a local port
2. Injects a `<script>` tag into your HTML file(s) that loads the browser overlay
3. Reads PRODUCT.md and DESIGN.md if present (DESIGN.md wins on visual decisions, PRODUCT.md wins on strategic and voice decisions)

Then navigate to your dev server URL (not the helper port — that's internal plumbing). You should see a small overlay bar at the top of the page indicating live mode is active.

### First-time setup

If this is your first time running live mode, the skill checks for a `config.json` in `.claude/skills/impeccable/`. If it doesn't exist, you'll be prompted to create one.

The config tells the live system which HTML files to inject into:

```json
{
  "files": ["index.html"],
  "insertBefore": "</body>",
  "commentSyntax": "html"
}
```

Common configurations by framework:

| Framework | `files` | `commentSyntax` |
|-----------|---------|-----------------|
| Vite / React SPA | `["index.html"]` | `html` |
| Next.js App Router | `["app/layout.tsx"]` | `jsx` |
| Next.js Pages | `["pages/_document.tsx"]` | `jsx` |
| SvelteKit | `["src/app.html"]` | `html` |
| Astro | `["src/layouts/Base.astro"]` | `html` |
| Multi-page static | `["public/**/*.html"]` | `html` |

Use a glob (`"public/**/*.html"`) for multi-page sites so new pages are picked up automatically.

---

## The live loop

### Select an element

Click any element on the page. A selection outline appears around it, and the overlay shows which element was selected along with a menu of design actions.

### Pick a design action

| Action | What the AI generates |
|--------|----------------------|
| (freeform) | Three distinct directions anchored to real-world design archetypes |
| `bolder` | Three variants that amplify different dimensions (scale, saturation, structure) |
| `quieter` | Three variants that pull back different dimensions (color, ornament, spacing) |
| `distill` | Three variants that remove different classes of excess |
| `polish` | Three variants targeting different refinement axes |
| `typeset` | Three variants with different type pairings and scale ratios |
| `colorize` | Three variants with different hue families and color strategies |
| `layout` | Three variants with different structural arrangements |
| `adapt` | Three variants for different target contexts (mobile, tablet, desktop) |
| `animate` | Three variants with different motion vocabularies |
| `delight` | Three variants with different flavors of personality |
| `overdrive` | Three variants each breaking a different design convention |

You can also type a freeform prompt (e.g., "make this feel like a newspaper front page") in addition to or instead of selecting an action.

### Review variants

The AI generates three distinct HTML+CSS variants and injects them. The browser shows the first variant immediately. Use the overlay to cycle through them.

**Freeform variants** must anchor to different real-world archetypes — not three riffs on the same style. If two variants look too similar, type feedback and generate again.

**Action-specific variants** must vary along the action's named dimension. `typeset` variants need genuinely different type pairings, not three versions of the same pair.

### Use parameters

Each variant can expose sliders, step selectors, and toggles that let you tune the design without regenerating. Examples:

- A `density` step selector (Airy / Snug / Packed)
- A `color-amount` range slider (0.0 to 1.0)
- A `serif` toggle (on/off)

Parameters are wired to CSS custom properties and data attributes — adjustments take effect instantly. The tuned values are baked into the source file when you accept.

### Accept a variant

Click Accept on the variant you want. The overlay:

1. Commits the accepted variant's HTML to your source file
2. Bakes in the parameter values you chose
3. Removes the variant scaffolding and temporary CSS
4. Moves the CSS rules to your project's actual stylesheet

The result is clean, production-ready source with no live-mode plumbing left behind.

### Discard

Clicking Discard on a variant (or closing the overlay without accepting) restores the original element. Nothing is written to source.

---

## Annotating before generating

Before clicking Go, you can annotate the element to give the AI more direction:

- **Comments** — drop a text note on any part of the element (the position is meaningful: a comment near the title applies to the title, not the whole element)
- **Strokes** — draw on the element: a closed loop means "focus here," an arrow means "move this," a cross means "remove this"

Annotations are captured as a screenshot that the AI reads before generating variants. They let you say things like "the CTA needs to be more prominent" or "remove this secondary text" without typing a full prompt.

---

## Stop live mode

Say "stop live mode" in chat, close the browser tab, or click the exit button in the overlay. The skill:

1. Stops the helper HTTP server
2. Removes the injected `<script>` tag from your HTML files
3. Cleans up any leftover variant wrappers in source

---

## What happens behind the scenes

Live mode is a coordinated system with four parts:

1. **`live.mjs`** — starts the helper server, injects the browser script, reads project context
2. **`live-browser.js`** (injected) — the browser overlay that captures element selection, actions, annotations, and user choices; communicates with the helper server via Server-Sent Events
3. **`live-wrap.mjs`** — given an element ID, finds the corresponding source file and inserts a variant wrapper at the right line
4. **`live-accept.mjs`** — on accept, commits the chosen variant to source and triggers the carbonize cleanup (removing temporary scaffolding, moving CSS to the real stylesheet, baking in parameter values)

The AI polls the helper server in a loop, waiting for events (generate, accept, discard, prefetch, exit) and dispatching the appropriate action for each.

---

## Troubleshooting

**The overlay doesn't appear.** Check that the `<script>` tag was injected: search your HTML file for `localhost` + the helper port. If it's not there, re-run `/impeccable live`. If CSP is blocking the injection, live mode detects this and asks to patch your CSP configuration for development.

**Variants don't hot-swap.** Your dev server may not support HMR, or the element lives in a generated file the live system can't write to. The system falls back to direct file fetching — variants appear, but HMR won't trigger. The AI handles this automatically.

**The element lives in a generated file (Astro, Next.js, static site generator).** Live mode uses a fallback flow: variants are shown in the served file for preview, and the accepted variant is written to the true source (the template or component), not the generated output.

For the full architecture decision behind live mode, see [ADR: live variant mode](../adr-live-variant-mode.md).
