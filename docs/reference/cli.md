# CLI reference

The `impeccable` CLI ships alongside the skill. It provides standalone anti-pattern detection and skill management without an AI harness.

```bash
npx impeccable <command> [options]
```

---

## `detect`

Scan files, directories, or URLs for UI anti-patterns and design quality issues.

```bash
npx impeccable detect [options] [file-or-dir-or-url...]
```

### Options

| Flag | Description |
|------|-------------|
| `--fast` | Regex-only mode. Skips jsdom processing — faster, but misses styles in linked stylesheets. Use for CI or large directories. |
| `--json` | Output results as JSON instead of human-readable text. |
| `--help` | Show usage. |

### Detection modes

| Input type | How it's scanned |
|-----------|-----------------|
| HTML file | jsdom with computed styles (default). Catches issues in linked CSS and inline styles. |
| CSS, JSX, TSX, and other non-HTML files | Regex pattern matching. |
| URL (`http://` or `https://`) | Full browser rendering via Puppeteer. Most accurate — catches runtime styles. |
| Directory | Scans all supported files recursively. Warns if a framework dev server is detected. |
| Stdin | Piped HTML is detected automatically when no file targets are given. |

`--fast` overrides the default and forces regex for all inputs, including HTML files.

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | No findings — clean. |
| `1` | One or more findings reported. |

### Examples

```bash
# Scan a directory (recursive)
npx impeccable detect src/

# Scan a single HTML file
npx impeccable detect public/index.html

# Scan a live URL (uses Puppeteer)
npx impeccable detect https://your-site.com

# Regex-only scan with JSON output (CI-friendly)
npx impeccable detect --fast --json src/

# Scan a running dev server
npx impeccable detect http://localhost:3000

# Pipe HTML from stdin
cat build/index.html | npx impeccable detect
```

### Using in CI

```bash
# Fail CI if any findings are detected
npx impeccable detect --fast --json src/ && echo "Clean" || exit 1
```

The `--fast` flag is recommended for CI: it skips Puppeteer and runs regex-only checks, which works without a browser and is suitable for environments without a display.

> **Note:** Always run the CLI via `node` or `npx`, not `bun`. Bun's jsdom implementation is slower and causes HTML scans to hang.

---

## `skills`

Manage Impeccable skill installation and updates.

### `skills install`

Install Impeccable skills into your current project.

```bash
npx impeccable skills install [options]
```

Detects which AI tools you have configured (`.claude/`, `.cursor/`, `.gemini/`, etc.) and installs the matching skill files for each.

| Flag | Description |
|------|-------------|
| `--force` | Reinstall even if Impeccable is already installed. |
| `-y`, `--yes` | Skip confirmation prompts (for CI or scripted installs). |
| `--prefix=<prefix>` | Prefix all command names to avoid conflicts. For example, `--prefix=i-` makes commands available as `/i-audit`, `/i-polish`, etc. instead of `/audit`, `/polish`. |

```bash
# Standard install
npx impeccable skills install

# Non-interactive install with prefix
npx impeccable skills install -y --prefix=i-
```

After install, run `/impeccable teach` in your AI harness to set up project design context.

### `skills update`

Update installed Impeccable skills to the latest version.

```bash
npx impeccable skills update [options]
```

Downloads the latest universal bundle from impeccable.style, compares it to your local install, and updates any outdated skill files. Preserves any prefix you configured during install.

| Flag | Description |
|------|-------------|
| `-y`, `--yes` | Skip the confirmation prompt. |

```bash
npx impeccable skills update
npx impeccable skills update -y
```

### `skills check`

Check whether updates are available without installing anything.

```bash
npx impeccable skills check
```

Compares your local skill files against the latest bundle and reports whether an update is available.

### `skills help`

List all available commands by fetching the current command list from impeccable.style.

```bash
npx impeccable skills help
```

---

## Top-level flags

| Flag | Description |
|------|-------------|
| `--help`, `-h` | Show usage and available commands. |
| `--version`, `-v` | Print the CLI version number. |

```bash
npx impeccable --help
npx impeccable --version
```
