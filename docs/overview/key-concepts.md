# Key concepts

Every term used across the Impeccable documentation.

---

**Anti-pattern** — a design decision the skill explicitly prohibits because it produces generic or low-quality output. Examples: gradient text (`background-clip: text` with a gradient), side-stripe borders (`border-left` or `border-right` greater than 1px as a colored accent), bounce easing, and identical card grids. The [design laws and anti-patterns](../concepts/design-laws-and-anti-patterns.md) page lists all of them.

**Brand reference** — the file `reference/brand.md`, loaded by the skill when the register is `brand`. Covers design principles specific to marketing pages, landing pages, campaign sites, and portfolios — surfaces where distinctiveness is the primary goal. Not loaded for product (app UI) work.

**Command** — one of 23 subcommands available under `/impeccable`. Each command is invoked as `/impeccable <command> [target]` (e.g., `/impeccable audit homepage`). Every command has its own reference file in `reference/` that the skill loads when the command is matched. See the [command reference](../reference/commands.md) for the full list.

**Craft flow** — the end-to-end lifecycle for building a new UI feature with Impeccable: shape the design (produce a confirmed brief), generate visual direction (mocks/probes), build to production quality, then iterate in-browser across viewports. See [Shape then build](../guides/shape-then-build.md).

**DESIGN.md** — an optional file at the project root that captures your design system: color tokens, typography scales, spacing, elevation rules, component specifications. When present, every command reads it via `load-context.mjs` and respects its rules. Without it, commands still work but can't enforce design-system alignment. Generate one from existing code with `/impeccable document`.

**Design laws** — the universal design rules that apply to every command, regardless of register. They cover color (OKLCH, tinted neutrals), typography (line length, hierarchy), layout (rhythm, no nested cards), motion (no bounce easing), and a set of absolute bans. See [Design laws and anti-patterns](../concepts/design-laws-and-anti-patterns.md).

**Harness** — an AI coding tool that can load and invoke Impeccable. Supported harnesses: Claude Code, Cursor, Gemini CLI, Codex CLI, OpenCode, Pi, GitHub Copilot, Kiro, Trae, Rovo Dev. Each harness reads skill files from its own directory (`.claude/skills/`, `.cursor/skills/`, etc.).

**Live mode** — an interactive browser overlay started by `/impeccable live`. You click any element on your dev-server page, pick a design action (or type a freeform prompt), and the AI generates three distinct HTML+CSS variants that hot-swap via HMR. You cycle through variants, adjust parameters with sliders and toggles, and accept the one you want. The accepted variant is committed to your source files. See [Iterate live in the browser](../guides/iterate-live-in-browser.md).

**load-context.mjs** — the script that runs at the start of every Impeccable command session. It reads PRODUCT.md and DESIGN.md from the project root and returns their contents as JSON. If PRODUCT.md is missing or a placeholder, the command stops and runs `/impeccable teach` to create it before proceeding.

**OKLCH** — the color space Impeccable requires for all new color declarations. OKLCH (Oklab Lightness, Chroma, Hue) produces perceptually uniform colors — the same chroma value at any hue looks equally saturated to the human eye. This makes it far easier to build accessible, cohesive palettes than hex or HSL. Example: `oklch(60% 0.25 350)` is a vivid magenta.

**Pin** — a standalone shortcut command created with `/impeccable pin <command>`. After pinning `audit`, you can type `/audit` instead of `/impeccable audit`. The pin script writes redirect shims to every harness directory present in the project. Remove a pin with `/impeccable unpin <command>`.

**PRODUCT.md** — a required file at the project root that anchors every command to your specific project. It contains: who your users are, what the product does, your brand personality, your anti-references (designs or aesthetics you want to avoid), and your design principles. Create it interactively with `/impeccable teach`. The `register` field in PRODUCT.md records whether the project is `brand` or `product` work.

**Product reference** — the file `reference/product.md`, loaded when the register is `product`. Covers design principles for app UI, dashboards, admin interfaces, and tools — surfaces where earned familiarity and functional clarity are the primary goals.

**Register** — the classification of a design task as either `brand` (design IS the product) or `product` (design SERVES the product). The register determines which reference file is loaded alongside shared design laws. See [The register system](../concepts/the-register-system.md).

**Shared design laws** — the universal rules in `SKILL.md` that apply to every command and both registers. They sit above brand.md and product.md in the context stack. See [Design laws and anti-patterns](../concepts/design-laws-and-anti-patterns.md).

**Skill** — a structured instruction file (with YAML frontmatter and markdown body) that an AI harness loads and uses to guide its behavior. Impeccable is a skill with one user-invocable entry point (`/impeccable`) and 23 subcommands. The skill format follows the Agent Skills specification.

**Target** — the optional argument passed to a command that scopes it to a specific area of the UI. Examples: `/impeccable audit blog` (audit the blog section), `/impeccable polish checkout-form` (polish just the checkout form). Without a target, commands scope themselves to the full project or the most-recently-worked-on area.
