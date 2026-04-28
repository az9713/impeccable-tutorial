# Command categories

The 23 Impeccable commands are organized into six categories by purpose. Each category owns a distinct phase of the design process.

Type `/impeccable` with no arguments to see the full menu in your AI tool.

---

## Build

Commands for creating new UI from scratch. Use these at the start of a feature or page.

| Command | What it does |
|---------|--------------|
| `craft [feature]` | The full end-to-end flow: shape the brief, generate visual direction, build to production quality, then iterate in-browser |
| `shape [feature]` | Produce a confirmed design brief before writing any code — scope, content states, visual direction, anti-goals |
| `teach` | Interactive interview that writes PRODUCT.md and optionally DESIGN.md |
| `document` | Generate DESIGN.md from existing project code (reverse-engineers your design system) |
| `extract [target]` | Pull reusable tokens and components out of one-off implementations into the shared design system |

**When to use:** Start here for any new feature, page, or redesign. `craft` bundles `shape` + build + iteration into one flow. Use `shape` standalone when you want to agree on the brief before handing off to someone else to build.

---

## Evaluate

Commands for understanding the current state of a UI. Use these before deciding what to fix.

| Command | What it does |
|---------|--------------|
| `critique [target]` | UX design review: visual hierarchy, clarity, emotional resonance, heuristic scoring |
| `audit [target]` | Technical quality checks: accessibility, performance, responsive design, theming, anti-patterns — scored 0–4 per dimension with prioritized findings |

**When to use:** Run `audit` first when you're picking up an unfamiliar codebase or haven't reviewed a section in a while. It gives you a scored report with recommended next commands. Run `critique` when the code quality is fine but the design doesn't feel right — it surfaces subjective UX issues that automated checks miss.

The output of both commands is a prioritized list of issues with recommended commands to run next. They don't fix anything — that's the Refine, Enhance, and Fix categories.

---

## Refine

Commands for improving existing UI without fundamentally redesigning it. Use these on work that's functionally complete.

| Command | What it does |
|---------|--------------|
| `polish [target]` | Final pass before shipping: design system alignment, micro-details, interaction states, edge cases |
| `bolder [target]` | Amplify safe or bland designs — more contrast, more presence, more commitment |
| `quieter [target]` | Tone down overstimulating or visually aggressive designs |
| `distill [target]` | Strip to essence — remove complexity, visual noise, redundant content |
| `harden [target]` | Production-ready: error handling, i18n, text overflow, extreme content lengths, edge cases |
| `onboard [target]` | First-run flows, empty states, and activation paths — the experience for users who have no data yet |

**When to use:** `polish` is the last command before any feature ships. `bolder` and `quieter` are direct responses to design feedback ("this feels too safe" / "this is overwhelming"). `distill` is right for interfaces that have accumulated cruft over time. `harden` targets the edge cases that look fine in demos but break in production.

---

## Enhance

Commands for adding specific design dimensions to existing UI. Each targets one discipline.

| Command | What it does |
|---------|--------------|
| `animate [target]` | Add purposeful animations and motion — entrances, transitions, microinteractions |
| `colorize [target]` | Introduce strategic color to monochromatic or undercolored UIs |
| `typeset [target]` | Improve typography: font choices, scale hierarchy, line length, weight contrast |
| `layout [target]` | Fix spatial relationships: spacing, rhythm, grid, visual hierarchy |
| `delight [target]` | Add moments of personality — unexpected microinteractions, typographic surprises, illustrated accents |
| `overdrive [target]` | Push past conventional limits — ambitious visual effects that feel technically extraordinary |

**When to use:** Use these when `critique` or `audit` identifies a specific dimension that needs work. "Weak typographic hierarchy" → `typeset`. "No meaningful motion" → `animate`. "Layout feels cramped and uniform" → `layout`. "Everything is gray" → `colorize`.

`overdrive` is a different beast — use it when you want something that would make a senior frontend engineer stop and stare. It's for technically ambitious effects, not incremental polish.

---

## Fix

Commands for correcting specific, identifiable problems. Each fixes a known failure mode.

| Command | What it does |
|---------|--------------|
| `clarify [target]` | Improve UX copy: button labels, error messages, empty state copy, placeholder text |
| `adapt [target]` | Adapt the UI for different devices and screen sizes — makes responsive behavior intentional, not accidental |
| `optimize [target]` | Diagnose and fix UI performance: layout thrash, expensive animations, unoptimized images, render bottlenecks |

**When to use:** `clarify` after any copy review reveals vague labels or confusing error messages. `adapt` when responsive behavior was bolted on as an afterthought. `optimize` when performance issues are confirmed — run `audit` first to find the specific issues.

---

## Iterate

The live, interactive layer.

| Command | What it does |
|---------|--------------|
| `live` | Start the browser overlay: select any element, pick a design action, get three AI-generated variants hot-swapped via HMR, cycle through them, tune with sliders and toggles, accept the winner directly into source |

**When to use:** Any time you want to explore design directions visually rather than through code-and-refresh cycles. Live mode is particularly effective for typography experiments, color exploration, and layout rearrangements — decisions that are hard to spec in prose but immediately legible in the browser.

See [Iterate live in the browser](../guides/iterate-live-in-browser.md) for the full workflow.

---

## Which command do I use?

| Situation | Command |
|-----------|---------|
| Starting a new feature from scratch | `craft` or `shape` |
| Set up a new project for the first time | `teach` |
| Generate design docs from existing code | `document` |
| Need a diagnostic report before fixing anything | `audit` or `critique` |
| Feature is done, about to ship | `polish` |
| "This design is too safe / boring" | `bolder` |
| "This is too loud / overwhelming" | `quieter` |
| "This has too much going on" | `distill` |
| Users see this for the first time | `onboard` |
| UI breaks on bad data or network errors | `harden` |
| Everything is gray and flat | `colorize` |
| Type hierarchy is weak | `typeset` |
| Spacing feels random | `layout` |
| No motion at all | `animate` |
| Copy is vague or confusing | `clarify` |
| Breaks on mobile | `adapt` |
| Feels sluggish | `optimize` |
| Want to explore visually in the browser | `live` |
