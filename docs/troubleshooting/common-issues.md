# Common issues

Organized by symptom. Fixes are exact — no "check your config" without telling you which file and field.

---

## The skill doesn't appear in the command menu after installing

**Cause:** The harness hasn't registered the new skill files, or the install landed in the wrong directory.

**Fix:**
1. Verify the skill files exist in the expected directory for your tool:

   | Tool | Expected path |
   |------|--------------|
   | Claude Code | `.claude/skills/impeccable/SKILL.md` |
   | Cursor | `.cursor/skills/impeccable/SKILL.md` |
   | Gemini CLI | `.gemini/skills/impeccable/SKILL.md` |
   | Codex CLI | `.agents/skills/impeccable/SKILL.md` |
   | GitHub Copilot | `.github/skills/impeccable/SKILL.md` |
   | OpenCode | `.opencode/skills/impeccable/SKILL.md` |

2. If the files are missing, re-run the install:
   ```bash
   npx impeccable skills install
   ```

3. Restart your AI tool. Most tools scan skill directories at startup, not continuously.

**If that doesn't work:** Run `npx impeccable skills install --force` to reinstall from scratch.

---

## Cursor: skill doesn't appear after installing

**Cause:** Cursor requires the Nightly build channel and Agent Skills feature to be enabled.

**Fix:**
1. Switch to the Nightly channel: Cursor Settings → Beta → Channel: Nightly
2. Enable Agent Skills: Cursor Settings → Rules → Agent Skills: On
3. Restart Cursor

---

## Gemini CLI: skill doesn't appear after installing

**Cause:** Agent Skills require the preview version of Gemini CLI, and the feature must be enabled in settings.

**Fix:**
1. Install the preview version:
   ```bash
   npm i -g @google/gemini-cli@preview
   ```
2. Run `/settings` inside Gemini CLI and enable "Skills"
3. Run `/skills list` to verify the skill is registered

---

## Commands prompt `/impeccable teach` even though PRODUCT.md exists

**Cause:** The skill checks PRODUCT.md length and content. A file under 200 characters, or one that still contains `[TODO]` placeholder text, is treated as incomplete.

**Fix:**
1. Check your PRODUCT.md length:
   ```bash
   wc -c PRODUCT.md
   ```
   If under 200 characters, complete the file.

2. Search for placeholder markers:
   ```bash
   grep -n "\[TODO\]" PRODUCT.md
   ```
   Fill in any `[TODO]` sections.

3. Verify the file is being read correctly by running `load-context.mjs` directly:
   ```bash
   node .claude/skills/impeccable/scripts/load-context.mjs
   ```
   The JSON output shows exactly what the skill receives. If PRODUCT.md is empty in the output, the script can't find it — confirm it's at the project root, not a subdirectory.

---

## The AI ignores my anti-references

**Cause:** The `## Anti-references` section heading must match exactly. A typo or formatting difference causes `load-context.mjs` to miss it.

**Fix:**
1. Open PRODUCT.md and verify the section heading is exactly:
   ```markdown
   ## Anti-references
   ```
   Not `## Anti-References`, not `## Avoid`, not `## Anti references` (with a space).

2. Confirm it's being loaded:
   ```bash
   node .claude/skills/impeccable/scripts/load-context.mjs
   ```
   Look for `antiReferences` in the JSON output. If it's empty, the heading doesn't match.

---

## DESIGN.md is requested every session even though it exists

**Cause:** The skill nudges you once per session when DESIGN.md is present but small (under ~500 characters). It's a reminder, not a blocker — you can proceed without it.

**Fix:** If DESIGN.md is thin, run `/impeccable document` to regenerate it from your current codebase. A richer DESIGN.md stops the prompt:

```
/impeccable document
```

---

## Live mode overlay doesn't appear

**Cause:** Either the `<script>` injection failed, or Content Security Policy is blocking the injected script.

**Fix:**
1. Check that the script tag was injected — open your source HTML and search for `impeccable-live`:
   ```bash
   grep -r "impeccable-live" index.html
   ```
   If not found, re-run `/impeccable live`.

2. If you have a CSP header or `<meta http-equiv="Content-Security-Policy">` tag, live mode detects this and offers to patch it for development. Accept the patch prompt.

3. Check the browser console for errors from the injected script (look for `impeccable` in the console filter).

**If that doesn't work:** Check `.impeccable-live.json` in your project root — if it exists with a stale PID, delete it and re-run `/impeccable live`.

---

## Live mode variants don't hot-swap

**Cause:** Your dev server doesn't support HMR (hot module replacement), or the element is in a file the HMR watcher doesn't track.

**Fix:** This is expected behavior. Live mode falls back to direct file fetching automatically — variants still appear in the browser, but via a fetch from the live server's `/source` endpoint instead of HMR. You don't need to do anything; the AI handles this switch.

If variants aren't appearing at all (not just not hot-swapping), see "Live mode overlay doesn't appear" above.

---

## Live mode: selected element lives in a generated file

**Cause:** Some frameworks (Astro, Next.js App Router, static site generators) serve compiled output, not the source you edit directly. The live system writes variants to the served file for preview, then writes the accepted variant to the actual source template or component.

**Fix:** Nothing — this is handled automatically. When you accept a variant, the live system traces the element back to its source template and writes there, not to the generated output. If the trace fails, the AI reports which source file to edit manually.

---

## `npx impeccable detect` hangs on an HTML scan

**Cause:** jsdom-based scanning (the default for HTML files) loads full DOM trees and can be slow on large projects. Also caused by scanning a directory that contains `node_modules` or compiled output.

**Fix:**
1. Use `--fast` mode to skip jsdom entirely:
   ```bash
   npx impeccable detect --fast src/
   ```

2. Or target specific files rather than a full directory:
   ```bash
   npx impeccable detect public/index.html
   ```

3. If scanning a URL is an option, it's usually faster than jsdom:
   ```bash
   npx impeccable detect http://localhost:3000
   ```

> **Note:** Never run the detect CLI with Bun (`bun run detect`). Bun's jsdom implementation is significantly slower than Node's and will hang on HTML files. Use `node` or `npx impeccable detect`.

---

## CLI exits with code 1 in CI even when output looks clean

**Cause:** The CLI exits 1 when any findings are reported, 0 when none. Exit code 1 means issues were found.

**Fix:** Run in `--fast --json` mode in CI to see exactly what was found without Puppeteer overhead:

```bash
npx impeccable detect --fast --json src/
```

The JSON output lists every finding with rule ID, category, and snippet. Pipe to `jq` for easier reading:

```bash
npx impeccable detect --fast --json src/ | jq '.[] | {rule: .id, snippet: .snippet}'
```

To fail CI only on `slop` category issues (AI-generated tells), filter the output:

```bash
FINDINGS=$(npx impeccable detect --fast --json src/)
SLOP=$(echo "$FINDINGS" | jq '[.[] | select(.category == "slop")] | length')
[ "$SLOP" -eq 0 ] || exit 1
```
