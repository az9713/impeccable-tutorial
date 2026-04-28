/**
 * Tests for the live-wrap CLI helper.
 * Run with: node --test tests/live-wrap.test.mjs
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';

import {
  buildSearchQueries,
  findElement,
  findClosingLine,
  detectCommentSyntax,
} from '../source/skills/impeccable/scripts/live-wrap.mjs';

// ---------------------------------------------------------------------------
// Unit tests: pure functions
// ---------------------------------------------------------------------------

describe('detectCommentSyntax', () => {
  it('returns HTML comments for .html files', () => {
    const result = detectCommentSyntax('index.html');
    assert.equal(result.open, '<!--');
    assert.equal(result.close, '-->');
  });

  it('returns JSX comments for .jsx files', () => {
    const result = detectCommentSyntax('App.jsx');
    assert.equal(result.open, '{/*');
    assert.equal(result.close, '*/}');
  });

  it('returns JSX comments for .tsx files', () => {
    const result = detectCommentSyntax('component.tsx');
    assert.equal(result.open, '{/*');
    assert.equal(result.close, '*/}');
  });

  it('returns HTML comments for .vue files', () => {
    const result = detectCommentSyntax('App.vue');
    assert.equal(result.open, '<!--');
    assert.equal(result.close, '-->');
  });

  it('returns HTML comments for .svelte files', () => {
    const result = detectCommentSyntax('Page.svelte');
    assert.equal(result.open, '<!--');
    assert.equal(result.close, '-->');
  });
});

describe('buildSearchQueries', () => {
  it('prioritizes ID over classes', () => {
    const queries = buildSearchQueries('hero', 'hero-section,dark', 'section', null);
    assert.equal(queries[0], 'id="hero"');
  });

  it('includes full class match for multi-class elements', () => {
    const queries = buildSearchQueries(null, 'hero-section,dark-theme', 'div', null);
    assert.ok(queries.some(q => q === 'class="hero-section dark-theme"'));
  });

  it('includes the most distinctive single class (longest)', () => {
    const queries = buildSearchQueries(null, 'btn,hero-combined-left', null, null);
    assert.ok(queries.some(q => q === 'hero-combined-left'));
  });

  it('includes tag+class combo', () => {
    const queries = buildSearchQueries(null, 'hero-section', 'section', null);
    assert.ok(queries.some(q => q === '<section class="hero-section'));
  });

  it('includes raw fallback query', () => {
    const queries = buildSearchQueries(null, null, null, 'Welcome to our app');
    assert.deepEqual(queries, ['Welcome to our app']);
  });

  it('returns all query types when everything is provided', () => {
    const queries = buildSearchQueries('main', 'container,wide', 'div', 'fallback');
    assert.ok(queries.length >= 4);
    assert.equal(queries[0], 'id="main"');
    assert.ok(queries.includes('fallback'));
  });
});

describe('findElement', () => {
  it('finds an element by class name', () => {
    const lines = [
      '<html>',
      '<body>',
      '  <div class="hero">',
      '    <h1>Hello</h1>',
      '  </div>',
      '</body>',
      '</html>',
    ];
    const result = findElement(lines, 'hero');
    assert.ok(result);
    assert.equal(result.startLine, 2);
    assert.equal(result.endLine, 4);
  });

  it('finds an element by ID', () => {
    const lines = [
      '<section id="features">',
      '  <p>Content</p>',
      '</section>',
    ];
    const result = findElement(lines, 'id="features"');
    assert.ok(result);
    assert.equal(result.startLine, 0);
    assert.equal(result.endLine, 2);
  });

  it('returns null when element is not found', () => {
    const lines = ['<div>hello</div>'];
    const result = findElement(lines, 'nonexistent');
    assert.equal(result, null);
  });

  it('skips comments containing the query', () => {
    const lines = [
      '<!-- hero section -->',
      '<div class="hero">',
      '  <p>Content</p>',
      '</div>',
    ];
    const result = findElement(lines, 'hero');
    assert.ok(result);
    assert.equal(result.startLine, 1); // skips the comment on line 0
  });

  it('skips lines that contain data-impeccable-variant', () => {
    const lines = [
      '<div class="hero" data-impeccable-variant="original">Old</div>',
      '<div class="hero">Real</div>',
    ];
    const result = findElement(lines, 'hero');
    assert.ok(result);
    assert.equal(result.startLine, 1);
  });
});

describe('findClosingLine', () => {
  it('finds the closing tag on the same line', () => {
    const lines = ['<p>Hello</p>'];
    assert.equal(findClosingLine(lines, 0), 0);
  });

  it('finds the closing tag across multiple lines', () => {
    const lines = [
      '<div>',
      '  <p>Hello</p>',
      '</div>',
    ];
    assert.equal(findClosingLine(lines, 0), 2);
  });

  it('handles nested tags of the same type', () => {
    const lines = [
      '<div class="outer">',
      '  <div class="inner">',
      '    <p>Content</p>',
      '  </div>',
      '</div>',
    ];
    assert.equal(findClosingLine(lines, 0), 4);
  });

  it('handles deeply nested structures', () => {
    const lines = [
      '<section>',
      '  <div>',
      '    <div>',
      '      <span>text</span>',
      '    </div>',
      '  </div>',
      '</section>',
    ];
    assert.equal(findClosingLine(lines, 0), 6);
  });

  it('handles self-closing tags', () => {
    const lines = [
      '<div>',
      '  <img src="test.png" />',
      '  <br />',
      '</div>',
    ];
    assert.equal(findClosingLine(lines, 0), 3);
  });
});

// ---------------------------------------------------------------------------
// Integration tests: full wrap CLI on fixture files
// ---------------------------------------------------------------------------

describe('wrapCli integration', () => {
  let tmp;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'impeccable-wrap-test-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('wraps an HTML element by class name', () => {
    const html = `<!DOCTYPE html>
<html>
<body>
  <div class="hero-section">
    <h1>Hello World</h1>
    <p>Welcome to our site.</p>
  </div>
</body>
</html>`;
    writeFileSync(join(tmp, 'index.html'), html);

    const result = JSON.parse(execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id test123 --count 3 --classes "hero-section" --file "${join(tmp, 'index.html')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    ));

    // The file path is relative to cwd, so it may be a relative path to the tmp dir
    assert.ok(result.file.endsWith('index.html'));
    assert.ok(result.insertLine > 0);
    assert.equal(result.commentSyntax.open, '<!--');

    // Verify the file was modified correctly
    const modified = readFileSync(join(tmp, 'index.html'), 'utf-8');
    assert.ok(modified.includes('data-impeccable-variants="test123"'));
    assert.ok(modified.includes('data-impeccable-variant-count="3"'));
    assert.ok(modified.includes('data-impeccable-variant="original"'));
    assert.ok(modified.includes('display: contents'));
    assert.ok(modified.includes('impeccable-variants-start test123'));
    assert.ok(modified.includes('impeccable-variants-end test123'));
    // Original should NOT be hidden (stays visible until variants arrive)
    assert.ok(!modified.includes('data-impeccable-variant="original" style="display: none"'));
  });

  it('wraps a JSX element and uses JSX comment syntax', () => {
    const jsx = `export default function App() {
  return (
    <main>
      <section className="hero">
        <h1>Hello</h1>
      </section>
    </main>
  );
}`;
    writeFileSync(join(tmp, 'App.jsx'), jsx);

    const result = JSON.parse(execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id jsx123 --count 2 --classes "hero" --file "${join(tmp, 'App.jsx')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    ));

    assert.equal(result.commentSyntax.open, '{/*');
    assert.equal(result.commentSyntax.close, '*/}');

    const modified = readFileSync(join(tmp, 'App.jsx'), 'utf-8');
    assert.ok(modified.includes('{/* impeccable-variants-start jsx123'));
    assert.ok(modified.includes('data-impeccable-variant-count="2"'));
  });

  it('finds element by ID when --element-id is used', () => {
    const html = `<html><body>
<div id="pricing">
  <h2>Pricing</h2>
  <p>Plans start at $10/mo.</p>
</div>
</body></html>`;
    writeFileSync(join(tmp, 'page.html'), html);

    const result = JSON.parse(execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id id123 --count 2 --element-id "pricing" --file "${join(tmp, 'page.html')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    ));

    const modified = readFileSync(join(tmp, 'page.html'), 'utf-8');
    assert.ok(modified.includes('data-impeccable-variants="id123"'));
    // The original pricing div should be inside the wrapper
    assert.ok(modified.includes('id="pricing"'));
  });

  it('exits with error when element is not found', () => {
    writeFileSync(join(tmp, 'empty.html'), '<html><body><p>No match here</p></body></html>');

    try {
      execSync(
        `node source/skills/impeccable/scripts/live-wrap.mjs --id err123 --count 2 --classes "nonexistent" --file "${join(tmp, 'empty.html')}"`,
        { cwd: process.cwd(), encoding: 'utf-8', stdio: 'pipe' }
      );
      assert.fail('Should have exited with error');
    } catch (err) {
      assert.ok(err.status !== 0, 'Should exit with non-zero status');
      assert.ok(err.stderr.includes('error') || err.stderr.includes('Could not'), 'Should print error message');
    }
  });

  it('preserves surrounding content when wrapping', () => {
    const html = `<div class="before">Before</div>
<div class="target">
  <span>Target content</span>
</div>
<div class="after">After</div>`;
    writeFileSync(join(tmp, 'preserve.html'), html);

    execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id pres123 --count 2 --classes "target" --file "${join(tmp, 'preserve.html')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );

    const modified = readFileSync(join(tmp, 'preserve.html'), 'utf-8');
    assert.ok(modified.includes('class="before"'));
    assert.ok(modified.includes('class="after"'));
    assert.ok(modified.includes('data-impeccable-variants="pres123"'));
  });
});

// ---------------------------------------------------------------------------
// Regression tests from real-world failures (EAC report, 2026-04)
// ---------------------------------------------------------------------------

describe('live-wrap — JSX / TSX correctness', () => {
  let tmp;
  beforeEach(() => { tmp = mkdtempSync(join(tmpdir(), 'impeccable-wrap-jsx-')); });
  afterEach(() => { rmSync(tmp, { recursive: true, force: true }); });

  it('wraps the correct <section> when a class collides with a multi-line tag elsewhere', () => {
    // Decoy section: multi-line JSX with `organic-sand-surface` inside className
    // but NOT the full `py-20 lg:py-24` combo.
    // Target section: same class token on one line, together with py-20 lg:py-24.
    //
    // Bug: substring matcher lands on the decoy's className continuation line,
    // mangling the decoy tag and missing the real target entirely.
    const tsx = `export default function Page() {
  return (
    <main>
      <section
        className="organic-sand-surface public-arc-top-section relative z-10 pb-16 lg:pb-20"
        id="marketplace-intro"
      >
        <h2>Intro</h2>
      </section>

      <section className="organic-sand-surface py-20 lg:py-24">
        <h2>Target</h2>
      </section>
    </main>
  );
}`;
    writeFileSync(join(tmp, 'page.tsx'), tsx);

    execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id wrapA --count 3 --classes "organic-sand-surface,py-20,lg:py-24" --tag "section" --file "${join(tmp, 'page.tsx')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );

    const modified = readFileSync(join(tmp, 'page.tsx'), 'utf-8');

    // Wrapper landed somewhere.
    assert.ok(modified.includes('impeccable-variants-start wrapA'), 'wrapper was created');

    // Decoy section survives intact — all three of its lines still present in order.
    const decoyIntact =
      /<section\s*\n\s*className="organic-sand-surface public-arc-top-section/.test(modified) &&
      /id="marketplace-intro"/.test(modified);
    assert.ok(decoyIntact, 'decoy section opening tag was not mangled');

    // Target section sits inside the original variant wrapper.
    const originalMatch = modified.match(/data-impeccable-variant="original"[^>]*>([\s\S]*?)\s*<\/div>/);
    assert.ok(originalMatch, 'original variant wrapper exists');
    const inside = originalMatch[1];
    assert.ok(inside.includes('py-20 lg:py-24'), 'target section (with py-20 lg:py-24) is inside original wrapper');
    assert.ok(!inside.includes('public-arc-top-section'), 'decoy section is NOT inside original wrapper');
  });

  it('emits JSX-safe style attribute ({{ }}) in .tsx files', () => {
    const tsx = `export default function App() {
  return (
    <main>
      <section className="target">
        <h1>Hi</h1>
      </section>
    </main>
  );
}`;
    writeFileSync(join(tmp, 'App.tsx'), tsx);

    execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id jsxStyle --count 3 --classes "target" --tag "section" --file "${join(tmp, 'App.tsx')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );

    const modified = readFileSync(join(tmp, 'App.tsx'), 'utf-8');

    // HTML-attribute style="..." is invalid JSX (parses then type-errors in strict setups).
    assert.ok(
      !/style\s*=\s*"display:\s*contents"/.test(modified),
      'no HTML-style style attribute on outer wrapper'
    );
    // JSX-safe object syntax instead.
    assert.ok(
      /style=\{\{\s*display:\s*["']contents["']\s*\}\}/.test(modified),
      'outer wrapper uses JSX style={{ display: "contents" }}'
    );
  });

  it('finds elements via className= (React) when the exact class combo is unique there', () => {
    // Both divs contain `target-marker`, but only one shares `shared-class` with it.
    // A substring-only search would hit the decoy first; the full className match
    // disambiguates — requires the query generator to emit className="..." too.
    const tsx = `export default function Page() {
  return (
    <main>
      <div className="extra-class target-marker">Decoy</div>
      <div className="shared-class target-marker">Target</div>
    </main>
  );
}`;
    writeFileSync(join(tmp, 'Page.tsx'), tsx);

    execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id classNameA --count 3 --classes "shared-class,target-marker" --tag "div" --file "${join(tmp, 'Page.tsx')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );

    const modified = readFileSync(join(tmp, 'Page.tsx'), 'utf-8');

    const originalMatch = modified.match(/data-impeccable-variant="original"[^>]*>([\s\S]*?)\s*<\/div>/);
    assert.ok(originalMatch, 'original variant wrapper exists');
    const inside = originalMatch[1];
    assert.ok(inside.includes('shared-class target-marker'), 'correct target wrapped');
    assert.ok(!inside.includes('extra-class'), 'decoy not wrapped');
  });

  it('respects --tag to reject matches inside the wrong element type', () => {
    // Two elements, both containing the class. The <div> comes first in source
    // order; a tag-agnostic search would wrap it. With --tag section, the
    // <section> is the only valid target.
    const html = `<main>
  <div class="ambiguous-name">Decoy div</div>
  <section class="ambiguous-name">Target section</section>
</main>`;
    writeFileSync(join(tmp, 'index.html'), html);

    execSync(
      `node source/skills/impeccable/scripts/live-wrap.mjs --id tagFilter --count 3 --classes "ambiguous-name" --tag "section" --file "${join(tmp, 'index.html')}"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );

    const modified = readFileSync(join(tmp, 'index.html'), 'utf-8');
    const originalMatch = modified.match(/data-impeccable-variant="original"[^>]*>([\s\S]*?)\s*<\/div>/);
    assert.ok(originalMatch, 'original variant wrapper exists');
    const inside = originalMatch[1];
    assert.ok(inside.includes('<section'), 'section was wrapped');
    assert.ok(inside.includes('Target section'), 'target content is inside wrapper');
    assert.ok(!inside.includes('Decoy div'), 'div decoy was not wrapped');
  });
});

describe('findClosingLine — edge cases', () => {
  it('recognises an opener line where the tag sits at end-of-line (multi-line JSX)', () => {
    const lines = [
      '<section',
      '  className="hero"',
      '>',
      '  <h1>Hi</h1>',
      '</section>',
    ];
    // findClosingLine should treat line 0 as a valid opener and span to line 4.
    assert.equal(findClosingLine(lines, 0), 4);
  });
});
