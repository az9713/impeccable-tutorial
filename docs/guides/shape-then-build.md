# Shape then build

The craft flow is Impeccable's end-to-end process for building new UI features. It enforces a discipline that code-first approaches skip: establish what you're building and how it should look before writing a single line of implementation.

Running `/impeccable craft` executes the full flow. Running `/impeccable shape` executes only the first phase, producing a confirmed design brief that someone else (or you, later) can build from.

---

## Why shape before building?

Code-first UI development has a failure mode: the first working version sets a visual anchor that's hard to move. Layouts that "work" get shipped without challenging whether they're the right layouts. Craft breaks this by separating the decision about what to build from the execution of building it.

The brief you produce in shape is a contract — implementation decisions trace back to it. When the AI builds, it builds toward the brief, not toward whatever seemed easiest to code.

---

## The craft flow, step by step

### Step 1: Context and register

Before shape begins, the skill runs `load-context.mjs` to read PRODUCT.md and DESIGN.md. If PRODUCT.md is missing, it runs `/impeccable teach` first, then resumes.

The register (brand or product) is determined from the task, the surface in focus, or PRODUCT.md. The matching reference — `brand.md` or `product.md` — is loaded.

### Step 2: Shape the design

The skill produces a design brief covering:

- **Scope** — exactly what's in this feature and what's explicitly out
- **Content and states** — what data, copy, and UI states need to be designed (default, empty, loading, error, success, overflow)
- **Visual direction** — the aesthetic lane, dominant composition, tone, and distinguishing choices
- **Constraints** — technical, accessibility, or time constraints that limit the solution space
- **Anti-goals** — what this feature should not be, not do, and not look like
- **Recommended references** — which domain reference files (typography, motion, color, etc.) the implementation should load

The brief is presented for your explicit confirmation. The craft flow cannot proceed until you confirm it. Summarizing assumptions or writing PRODUCT.md doesn't count as a confirmed brief — you need to respond with approval or feedback before the build phase begins.

> If you want to approve a brief quickly, "looks good, proceed" or "yes" is sufficient. If you have feedback, state it and the skill will revise.

### Step 3: Visual direction (when available)

When the AI tool has native image generation capability (Codex with the `image_gen` tool, for example), the skill generates 1–3 high-fidelity visual comps before touching code.

The purpose: find a stronger visual lane than code-first generation would discover on its own. The brief defines what to build; the mock clarifies composition, hierarchy, density, and tone.

The comps must be genuinely different in primary visual direction — not color variants of the same layout. You review them and approve one direction (or ask for revisions) before implementation starts.

If your tool doesn't have image generation, this step is skipped with a note, and implementation proceeds directly from the brief.

### Step 4: Asset extraction (when needed)

If the approved direction includes image-native visual ingredients that can't be built in HTML/CSS/SVG — stickers, illustrated badges, textures, scene elements, product renders — those are generated as separate assets before building. Core UI text, navigation, and semantic structure are never rasterized.

### Step 5: Build to production quality

Implementation follows the confirmed brief and approved direction. The production bar is specific:

- Real or realistic content — no placeholder copy, no dead links, no `Lorem ipsum`
- Semantic HTML first — real headings, landmarks, labels, form associations
- All states handled — default, hover, focus, active, disabled, loading, error, success, empty
- Deliberate spacing — spacing tokens used consistently, not arbitrary pixel values
- Typography intentional — font loading strategy, clear hierarchy, readable line length
- Responsive behavior compositional — the layout adapts, it doesn't just shrink
- Motion feeling premium — purposeful, timed correctly, respects reduced motion

If a design question arises that materially changes the brief, the AI stops and asks rather than guessing.

### Step 6: Browser-based iteration

**This step is non-negotiable.** The first implementation pass is not the final pass.

The AI inspects the result across three viewport checkpoints at minimum:

- Mobile narrow (≈375px)
- Tablet / small laptop (≈768px)
- Desktop wide (≈1280px)

After the first inspection, a critique-and-fix pass runs. Then another inspection. This loop continues until no material issues remain against eight criteria:

1. Does it match the brief?
2. Does it match the approved mock (if generated)?
3. Does it pass the AI slop test — would someone look at this and immediately say "AI made that"?
4. Does it avoid all absolute bans (side-stripe borders, gradient text, glassmorphism, hero-metric template, identical card grids)?
5. Have all states been tested (empty, error, loading, edge cases)?
6. Does responsive behavior adapt compositionally, not just shrink?
7. Are craft details correct (spacing consistency, type hierarchy, color contrast, icon coherence, focus states)?
8. Are there obvious performance issues (oversized images, layout thrash, blocking animations)?

The exit bar is not "it works." It's: the result looks intentional at all checked viewports, all expected states are handled, no placeholders remain, and the implementation quality would be defensible in a senior design review.

### Step 7: Present

The AI presents:
- The feature in its primary state
- Which viewports were checked and the most important fixes made after inspection
- Key states walked through (empty, error, responsive)
- Design decisions that trace back to the confirmed brief
- Any accepted deviations from the mock
- Remaining limitations or follow-up risks

Then: "What's working? What isn't?"

---

## Using shape standalone

Run `/impeccable shape [feature]` when you want the brief without the build — for handoff to another developer, for review before committing time to implementation, or as a planning artifact.

```
/impeccable shape onboarding flow
/impeccable shape settings sidebar redesign
/impeccable shape checkout confirmation page
```

The brief produced by `shape` is the same one `craft` would produce. It's a complete, self-contained design spec.

---

## Common mistakes

**Skipping shape and going straight to build.** The brief exists to catch misaligned assumptions before they're baked into code. "Just build the checkout form" produces a checkout form — but maybe not the right one.

**Treating PRODUCT.md as a substitute for the brief.** PRODUCT.md is project-level context. The brief is task-level context. They're complementary, not interchangeable. A brief covers the specific feature's scope, states, visual direction, and anti-goals — things PRODUCT.md doesn't contain.

**Approving a weak visual direction to save time.** The mock phase produces comps that are "genuinely different in primary visual direction." If two comps look too similar, ask for a revision — you're setting the direction for everything that follows.

**Stopping after the first browser pass.** The critique-and-fix loop exists because first-pass implementations always have material issues. Skip it and you ship those issues.
