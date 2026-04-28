# The register system

Every design task in Impeccable is classified as either **brand** or **product**. This classification — called the register — determines which design reference the skill loads alongside the shared laws, which shapes every design decision from color strategy to motion intensity.

Getting the register right is the single highest-leverage configuration choice in Impeccable.

---

## The two registers

### Brand

Design IS the product. The surface exists to communicate identity, attract attention, build trust, or tell a story. Distinctiveness is the primary goal.

Examples: marketing pages, landing pages, campaign microsites, brand portfolios, editorial content, product announcement pages.

What this unlocks:
- Permission to use saturated, identity-driven color strategies (Committed, Full palette, or Drenched)
- Wide typographic latitude — editorial serifs, display faces, strong weight contrasts
- More expressive motion — orchestrated entrances, scroll-linked animations, atmospheric effects
- Layout experimentation — asymmetric grids, editorial rhythm, generous whitespace at unexpected scales

### Product

Design SERVES the product. The surface exists to help users accomplish tasks efficiently. Earned familiarity is the primary goal — the design should feel like Linear, Figma, Notion, or Stripe to a fluent user.

Examples: app UI, dashboards, admin interfaces, settings screens, data tables, onboarding flows, internal tools.

What this constrains:
- Color defaults to Restrained (tinted neutrals + one accent at ≤10% of the surface)
- Typography defaults to familiar hierarchies — no decorative display faces in the product shell
- Motion is purposeful and fast — state feedback, not theatrical entrances
- Layout prioritizes functional clarity over visual drama

---

## How the register is determined

The skill checks three signals in order. The first match wins.

**1. The task cue.** If the task itself contains a clear signal ("redo this landing page", "build the checkout flow"), that overrides everything. Landing pages → brand. Checkout flows → product.

**2. The surface in focus.** If you're working on a specific route, page, or file, the surface type determines the register. A `/pricing` page is brand. A `/settings/billing` page is product.

**3. The `register` field in PRODUCT.md.** When neither the task nor the surface is conclusive, the skill falls back to the field you set during `/impeccable teach`:

```markdown
## Register

brand
```

or

```markdown
## Register

product
```

If PRODUCT.md lacks this field, the skill infers it from your "Users" and "Product Purpose" sections and uses the inferred value for the session — then suggests running `/impeccable teach` to add it explicitly.

---

## How it affects command output

The register doesn't change what a command does — it changes the design judgment applied inside it.

**`/impeccable typeset` in brand mode:**
- More latitude for display faces, editorial serifs, strong size contrasts
- Italic display type used as a voice, not just for emphasis
- Fluid sizes via `clamp()` encouraged for hero type

**`/impeccable typeset` in product mode:**
- System-adjacent fonts preferred — Inter, Geist, Untitled Sans, or similar
- Hierarchy built from weight and size contrast within a restrained scale
- No decorative display faces in functional UI

**`/impeccable bolder` in brand mode:**
- Can push to Committed, Full palette, or Drenched color strategies
- Structural changes (editorial asymmetry, break-out elements) are appropriate
- More intense motion, texture, or scale contrasts

**`/impeccable bolder` in product mode:**
- Color amplification stays in Restrained territory — the accent becomes more present, not dominant
- Layout changes stay within product UI conventions
- "Bold" means confident hierarchy, not visual drama

**`/impeccable delight` in brand mode:**
- Unexpected visual moments, typographic surprises, illustrated accents
- Easter eggs and playful interactions are on-brief

**`/impeccable delight` in product mode:**
- Microinteractions that confirm state (a satisfying check animation, a smooth dismiss)
- Personality in empty states and success screens
- Nothing that disrupts task completion

The commands that diverge most strongly by register: `typeset`, `animate`, `bolder`, `delight`, `colorize`, `layout`, `quieter`. Commands that are largely register-neutral: `audit`, `harden`, `adapt`, `optimize`, `clarify`.

---

## When to mix registers

Some projects genuinely have both surfaces — a public marketing site (brand) and an authenticated product dashboard (product). The skill handles this naturally: the register is determined per-task, not per-project. When working on the marketing homepage, `teach` sets `register: brand` in PRODUCT.md. When working on the dashboard, you can either have a second PRODUCT.md in the dashboard's subdirectory, or include both surfaces in one PRODUCT.md and rely on the surface cue to determine the register per-task.

For most projects, one register dominates — choose the one that fits the majority of the work you do with Impeccable.
