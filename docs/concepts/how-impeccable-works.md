# How Impeccable works

Impeccable solves one specific problem: fast AI code execution in the wrong direction produces confidently bad design. The fix is not better prompting. It is a structured process that makes the AI do the same work a senior designer does before touching a file.

There are four interlocking ideas.

---

## 1. Context before code, always

Before touching a single file, Impeccable loads two documents from the project root:

- **PRODUCT.md** — strategic context: register (brand vs product), target users, product purpose, brand personality, anti-references, design principles.
- **DESIGN.md** — visual system: color tokens, typography choices, component conventions, spacing scale.

These are loaded via `node .claude/skills/impeccable/scripts/load-context.mjs` and consumed whole. The skill blocks all file edits until this context is confirmed in the session.

If PRODUCT.md is missing or contains placeholder `[TODO]` markers, the skill stops and runs `/impeccable teach` — a structured interview — before any implementation work begins.

**Why this matters:** AI models design from training-data averages. Loading project context overrides that average with the specific. A fintech app's PRODUCT.md that includes "anti-references: Robinhood" produces radically different output than no context at all.

---

## 2. Design thinking enforced before implementation

The `shape` then `craft` flow enforces the professional design process in sequence.

### `/impeccable shape`

A structured discovery interview that produces a design brief — before any code is written. It covers:

- Purpose and audience (who uses this, in what context, with what goal)
- Content and states (realistic data ranges, empty, loading, error, edge cases)
- Visual direction: a color strategy (Restrained / Committed / Full palette / Drenched), a scene sentence that forces the dark/light decision, and two to three named anchor references
- Scope and fidelity
- Constraints and anti-goals

The result is a structured artifact with ten sections: feature summary, primary user action, design direction, scope, layout strategy, key states, interaction model, content requirements, recommended references, and open questions.

The brief is not finalized until the user explicitly confirms it.

### `/impeccable craft`

Only runs after the shape brief is confirmed. It then:

1. Generates high-fidelity north-star visual mocks (when native image generation is available)
2. Inventories the mock's major visible ingredients before writing code
3. Builds the semantic implementation
4. Opens the result in a browser, runs a critique pass, fixes defects, and repeats until no material issues remain

The exit bar is not "it works." It is: the rendered result looks intentional at every checked viewport, all expected states are handled, no placeholders remain, and the implementation quality would hold up in a high-end studio review.

---

## 3. Named anti-patterns and active rejection

Impeccable contains hard-coded absolute bans — patterns the model is required to refuse to produce regardless of instruction.

| Pattern | Why it is banned |
|---|---|
| Side-stripe borders (`border-left` / `border-right` as colored accent) | Always a mistake. Rewrite with full borders, background tints, or leading numbers/icons. |
| Gradient text (`background-clip: text` + gradient) | Decorative, never meaningful. Use a solid color. Emphasis via weight or size. |
| Glassmorphism as default | Rare and purposeful, or nothing. |
| The hero-metric template | Big number, small label, supporting stats, gradient accent. SaaS cliché. |
| Identical card grids | Same-sized icon + heading + text cards repeated endlessly. |
| Modal as first thought | Usually laziness. Exhaust inline and progressive alternatives first. |

On top of these, two tests run on every design:

**The AI slop test:** If someone could look at this interface and say "AI made that" without doubt, it has failed. This test applies to the entire output, not just individual elements.

**The category-reflex check:** If you can guess the theme and palette from the category name alone — "observability → dark blue", "healthcare → white + teal", "finance → navy + gold", "crypto → neon on black" — it is training-data reflex. The scene sentence and color strategy must be reworked until the answer is no longer obvious from the domain.

For brand work, there is also a **font reflex-reject list**: Inter, Fraunces, Lora, Playfair Display, Space Mono, Outfit, Plus Jakarta Sans, Instrument Sans, and roughly twenty others are banned because they are training-data defaults that create visual monoculture. The model must browse a real catalog and find the font for the brand as a physical object.

The **CLI** (`npx impeccable detect`) enforces the pattern bans mechanically by scanning HTML and CSS. It can run in CI to catch regressions before they ship.

---

## 4. The register: two distinct design modes

Every design task is classified as either brand or product. The classification determines which reference file is loaded alongside the shared design laws, and from that point forward, every design decision — color, type, layout, motion — is governed by different rules.

### Brand

Design IS the product. The surface exists to communicate identity, attract attention, or tell a story. Distinctiveness is the goal.

- Color strategies: Committed, Full palette, and Drenched are all in scope. A restrained beige landing page ignores the register.
- Typography: wide latitude — editorial serifs, display faces, strong contrasts, typographic risk-taking.
- Motion: orchestrated page-load sequences, scroll-linked transitions, typographic choreography.
- Layout: asymmetric compositions, single-purpose folds, art direction per section.

### Product

Design SERVES the product. The surface exists to help users accomplish tasks efficiently. Earned familiarity is the goal — a fluent user of Linear, Figma, Notion, or Stripe should sit down and trust it immediately.

- Color defaults to Restrained (tinted neutrals, one accent for primary actions and state indicators only).
- Typography: system fonts are legitimate. One family is often correct. Fixed rem scale, not fluid.
- Motion: 150 to 250ms, state feedback only, no orchestrated page-load sequences.
- Layout: predictable grids, familiar patterns, consistency as an affordance.

The failure modes are opposite. Brand fails by being safe and forgettable. Product fails by being strange and unreliable. Treating them as one design problem produces mediocre output for both.

---

## The full command workflow

```
/impeccable teach        Write PRODUCT.md and DESIGN.md. Establishes register, users,
                         brand voice, and visual tokens for the project.

/impeccable shape        Discovery interview that produces a confirmed design brief.
                         No code written here.

/impeccable craft        Brief → visual mocks → semantic implementation → browser loop.
                         The end-to-end build flow.

/impeccable audit        Technical checks: accessibility, performance, responsive behavior.
                         Accessibility is deliberately deferred to here, not baked into
                         design time, to prevent over-cautious underdesign.

/impeccable polish       Final quality pass before shipping.
```

Plus 18 targeted commands (`bolder`, `quieter`, `typeset`, `colorize`, `animate`, `live`, and others) that each load their own reference file and apply the shared design laws to one specific dimension of the interface.

---

## Why it works

The shared design laws end with: *"The model is capable of extraordinary work. Don't hold back."*

Most AI design tools implicitly ask for safety. Impeccable explicitly asks for ambition, and provides the scaffolding — project context, structured brief, slop tests, pattern bans, register separation — that makes ambitious output reliable rather than random.

The process looks like overhead. It is actually compression: the brief replaces dozens of regeneration cycles, the slop tests prevent the most common failure modes before they appear, and the register ensures the model is applying the right judgment for the right kind of surface.
