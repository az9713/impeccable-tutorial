# Run your first audit

`/impeccable audit` produces a scored diagnostic report across five technical dimensions. It's the right command to run when you're picking up unfamiliar code, preparing a feature for release, or want a prioritized list of what to fix before calling anything done.

---

## Prerequisites

- Impeccable installed ([quickstart](../getting-started/quickstart.md))
- PRODUCT.md created (`/impeccable teach`)
- At least one page, component, or route to audit

---

## Step 1: Run the audit

```
/impeccable audit
```

To scope it to a specific area:

```
/impeccable audit landing-page
/impeccable audit checkout
/impeccable audit dashboard header
```

The target is free-form — the AI uses it to focus on the relevant files rather than the entire codebase.

---

## Step 2: Read the scored report

The audit returns a table showing scores across five dimensions, followed by detailed findings.

### Scoring dimensions

| Dimension | What's checked |
|-----------|---------------|
| Accessibility | Contrast ratios, ARIA labels, keyboard navigation, semantic HTML, heading hierarchy, form labels |
| Performance | Layout thrash, expensive animations, image optimization, lazy loading, bundle size |
| Responsive design | Fixed widths, touch targets (minimum 44×44px), horizontal scroll, text scaling, breakpoint coverage |
| Theming | Hard-coded colors vs. design tokens, dark mode correctness, token consistency |
| Anti-patterns | AI slop tells, design quality issues — checked against the absolute bans from the shared design laws |

Each dimension is scored 0–4:

| Score | Meaning |
|-------|---------|
| 4 | Excellent — no material issues |
| 3 | Good — minor issues only |
| 2 | Partial — significant gaps, usable |
| 1 | Major problems — blocks or degrades the experience |
| 0 | Critical — fundamentally broken for this dimension |

The total is out of 20, with rating bands:

| Score | Band |
|-------|------|
| 18–20 | Excellent (minor polish) |
| 14–17 | Good (address weak dimensions) |
| 10–13 | Acceptable (significant work needed) |
| 6–9 | Poor (major overhaul) |
| 0–5 | Critical (fundamental issues) |

### Anti-patterns verdict

This section appears before the score table. It answers one question: does this look AI-generated? The audit lists specific tells found — if none are found, it says so. This is the most subjective dimension and the most important one to get right.

---

## Step 3: Read the prioritized findings

Each issue is tagged with a priority level:

| Priority | Meaning |
|----------|---------|
| P0 | Blocking — prevents task completion. Fix immediately. |
| P1 | Major — significant difficulty or WCAG AA violation. Fix before release. |
| P2 | Minor — annoyance, workaround exists. Fix in next pass. |
| P3 | Polish — nice-to-fix, no real user impact. Fix if time permits. |

For each issue the audit reports:
- Location (component, file, line number when identifiable)
- Category (Accessibility / Performance / Theming / Responsive / Anti-Pattern)
- Impact on users
- Which standard it violates (e.g., WCAG 2.1 AA 1.4.3 for contrast)
- A specific recommendation
- The Impeccable command to use to fix it

---

## Step 4: Use the recommended commands

At the end of the report, the audit lists recommended commands in priority order. These are direct next steps, not suggestions.

A typical output:

```
1. [P0] /impeccable adapt — fix horizontal scroll on mobile viewport (checkout form)
2. [P1] /impeccable typeset — address flat type hierarchy (body and h2 are same size)
3. [P1] /impeccable audit — re-run after adapt and typeset to verify fixes
4. [P2] /impeccable colorize — introduce color tokens to replace 12 hard-coded hex values
5. [P3] /impeccable polish — micro-detail pass after structural issues are resolved
```

Run them in order. Re-run `/impeccable audit` after P0 and P1 issues are fixed to verify the score improves.

---

## Step 5: Re-audit after fixes

```
/impeccable audit checkout
```

The re-audit confirms fixes landed correctly and often surfaces secondary issues that were masked by the primary ones. Keep running until the score reaches your target band.

---

## Tips

**Start with anti-patterns.** If the anti-patterns dimension scores below 3, fix those first. AI slop tells often mask how the rest of the design is performing — once removed, the real structure becomes visible.

**Don't fix P3 before P0.** The audit is a triage tool. Resist the urge to polish hover states while the mobile layout has horizontal scroll.

**Scope tightly for faster results.** `/impeccable audit checkout-form` gives more focused findings than a full-codebase audit. Use broad audits for overview, targeted audits for depth.

**Pair with critique for subjective issues.** `audit` catches what's measurably wrong. `/impeccable critique` catches what's technically correct but experientially weak — unclear hierarchy, low emotional resonance, UX friction that doesn't show up in automated checks.
