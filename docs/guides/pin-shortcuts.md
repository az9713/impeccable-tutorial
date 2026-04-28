# Pin commands as shortcuts

Pinning creates a standalone shortcut command so you can type `/audit` instead of `/impeccable audit`. Unpin removes the shortcut.

---

## Pin a command

```
/impeccable pin audit
```

After running this, `/audit` invokes `/impeccable audit` directly. The pin script writes redirect shims to every harness directory present in your project (`.claude/skills/`, `.cursor/skills/`, etc.).

## Unpin a command

```
/impeccable unpin audit
```

Removes the standalone shortcut. `/audit` will no longer work; use `/impeccable audit` instead.

## Valid commands to pin

Any of the 23 commands:

```
craft    shape    teach    document    extract
critique    audit
polish    bolder    quieter    distill    harden    onboard
animate    colorize    typeset    layout    delight    overdrive
clarify    adapt    optimize
live
```

## Common shortcuts to consider pinning

| Pin | When it's useful |
|-----|-----------------|
| `/impeccable pin audit` | You run audits frequently, or want a quick scan shortcut |
| `/impeccable pin polish` | Standard pre-ship step in your workflow |
| `/impeccable pin live` | You use live mode regularly for visual exploration |
| `/impeccable pin critique` | Design review is part of your PR process |

## How pinning works

The pin command runs:

```bash
node .claude/skills/impeccable/scripts/pin.mjs pin <command>
```

This writes a small redirect file into each harness directory that routes `/<command>` to `/impeccable <command>`. The redirect files are lightweight — they contain no logic, just a delegation instruction.

Pinned shortcuts appear as standalone skills in your AI tool's command menu. In Claude Code, type `/` and the pinned command will appear alongside other skills. In Cursor, it appears in the slash command autocomplete.

## Scope

Pins are project-local by default — they're written to the harness directories in your project (`.claude/`, `.cursor/`, etc.). For global shortcuts that apply across all projects, install the skill globally and pin from there:

```bash
cp -r dist/claude-code/.claude/* ~/.claude/
# Then in a project that has the global install active:
/impeccable pin audit
```

Global pins work because global harness directories are read alongside project-local ones by most tools.
