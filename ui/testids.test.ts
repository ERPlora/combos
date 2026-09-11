// The module's `data-testid` guard — combos#18, mirror of `hub/apps/web/src/form-testids.test.ts`.
//
// WHY THIS EXISTS. A QA spec addresses a screen by hook, never by visible text (everything is
// translated, ADR-0055/0199) nor by position (a new button shifts it). `data-testid` is the only
// hook Playwright's `getByTestId` resolves, and it is a CONTRACT with specs that live in ANOTHER
// repo: renaming one here turns a spec red days later, in a repository whose CI never saw this
// change. The hub's guard covers the shell and cannot see this repo, so the contract is held here.
//
// Convention (single source: `architecture/hub/apps/testids.md`): `<surface>-<field|action|state>`,
// kebab-case, the surface prefix mandatory, row identity at the end and never the index.
//
// 🔴 THREE DELIBERATE DEVIATIONS FROM THE SHELL'S GUARD, all three because the shell is Vue with a
// single `<template>` block per screen and this module is LIT, whose markup is a set of tagged
// `html` templates scattered through the class:
//
//  1. SPELLING (rule 4). Vue's two legal spellings are `data-testid="…"` and `:data-testid="…"`.
//     In Lit `:data-testid` is not a binding: it paints an attribute literally named
//     `:data-testid`, which `getByTestId` does not resolve — the exact class of dead hook rule 4
//     exists to deny. So the legal pair here is `data-testid="…"` and `data-testid=${…}`, and
//     `:data-testid` / `v-bind:data-testid` are denied with the rest of the variants.
//  2. ONLY MARKUP IS READ. The hooks are looked for inside `html`…`` templates and nowhere else.
//     This component also builds CSS selectors in plain TypeScript
//     (`querySelectorAll('[data-testid^="combos-course-row-"]')`) and its spec is full of them: read
//     as source, every one of those strings would enter the contract as a hook that nothing paints.
//     Rule 3 still sweeps the raw source of every file, which is what makes a spec that kept
//     reading `[data-test="…"]` fail.
//  3. CONTROL_TAGS SWEEPS BUTTONS. The shell leaves buttons to the contract because it has hundreds
//     of decorative ones. Measured on modifiers#9 and confirmed on tables#86: copied as-is, the
//     mutant «a new control without a hook» SURVIVES when the control is an action `ion-button`,
//     which is most of what this screen is made of.
//
// The five rules are the shell's five, in the same order:
//   1. COVERAGE — a form control or action without a hook fails.
//   2. CONTRACT — `COVERED` declares the EXACT set of names per screen; any drift, in either
//      direction, fails. This is what makes a silent rename impossible.
//   3. ATTRIBUTE — `data-test` and every other variant denied, in `ui/` and in `tests/`.
//   4. SPELLING — only the two spellings above, always double quotes.
//   5. RATCHET — every screen with a form is in `COVERED` or in `NOT_YET_COVERED` with a REAL
//      issue (`repo#N`), and `PENDING_TODAY` counts the pending ones and only ever goes down.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

/**
 * The module root, found by walking up from the working directory until `module.json` appears —
 * NOT from `import.meta.url`, which under vitest + happy-dom is not a `file:` URL and dies before
 * collecting a single test.
 */
function moduleRoot(): string {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(join(dir, 'module.json'))) return dir;
    const up = dirname(dir);
    if (up === dir) throw new Error('module.json not found above ' + process.cwd());
    dir = up;
  }
}

const MODULE_DIR = moduleRoot();
const UI = join(MODULE_DIR, 'ui');
const TESTS = join(MODULE_DIR, 'tests');

/**
 * This file is the only thing excluded from the sweeps, because it is the only file that has to
 * SPELL the denied variants in order to deny them. Everything else under `ui/` is swept, test files
 * included: a spec that keeps reading `[data-test="…"]` after the screen stopped painting it
 * asserts about nothing, which is half of what rule 3 exists to stop.
 */
const GUARD = 'testids.test.ts';

/**
 * What each screen declares. `contract` is the EXACT set of literal hook names the screen writes
 * today — both `data-testid="…"` in its markup and the name it hands to a reusable control
 * (`testid: '…'`); `computed` is the same contract for the FIXED HEAD of each computed hook
 * (the part before the variable — the only bit a spec can predict); `tables` is the namespace each
 * `<ok-data-table>` receives, from which the table derives all of its own chrome
 * (`-add`, `-search`, `-row-<id>`, `-row-<id>-<actionId>`, `-page-prev`… — outfitkit#143).
 *
 * `prefix` is the screen's namespace and every name above must start with it. The module has ONE
 * screen today, so its prefix is `combos-`; a second screen takes its own rather than widening
 * this one, which is what stops two screens from sharing a hook.
 *
 * WHY SO MANY COMPUTED ONES. This screen paints a course per menu, a choice per course and an
 * article per bulk row, and the per-course option controls (picker, delta, save, cancel, bulk add,
 * reasons) are painted ONCE PER COURSE too. A fixed name there repeats in the DOM and
 * `getByTestId` picks one of them at random, so everything inside a repeated block carries the
 * identity of its row: `combos-course-row-<group_id>-…`, `combos-choice-row-<option_id>-…`,
 * `combos-bulk-row-<ref>-…`.
 */
const COVERED: Record<
  string,
  { prefix: string; contract: string[]; computed?: string[]; tables?: string[] }
> = {
  'components/erp-combos-menus/erp-combos-menus.ts': {
    prefix: 'combos-',
    contract: [
      // The menu list and its create form.
      'combos-error',
      'combos-list-error',
      'combos-form',
      'combos-form-error',
      'combos-name',
      'combos-kitchen-name',
      'combos-price',
      'combos-supply-kind',
      'combos-supply-help-service',
      'combos-supply-help-goods',
      'combos-tax-category',
      'combos-order',
      'combos-active',
      'combos-save',
      'combos-cancel',
      'combos-blocked-reason',
      // The builder of one menu.
      'combos-back',
      'combos-supply-consequence',
      'combos-catalogue-missing',
      'combos-catalogue-error',
      'combos-tax-categories-error',
      'combos-courses-loading',
      'combos-courses-empty',
      'combos-courses-error',
      // The course form, which is painted once under the list of courses.
      'combos-course-name',
      'combos-course-min',
      'combos-course-max',
      'combos-course-repeat',
      'combos-course-save',
      'combos-course-cancel',
      'combos-course-blocked-reason',
      'combos-course-error',
      // The bulk article picker, a modal painted once.
      'combos-bulk-picker',
      'combos-bulk-search',
      'combos-bulk-cancel',
      'combos-bulk-confirm',
      'combos-bulk-empty',
      'combos-bulk-catalogue-error',
      'combos-bulk-blocked-reason',
    ],
    computed: ['combos-course-row-', 'combos-choice-row-', 'combos-bulk-row-'],
    tables: ['combos-table'],
  },
};

/** Screens with a form still without hooks. The value is the REAL issue that asks for them. */
const NOT_YET_COVERED: Record<string, string> = {};

/**
 * How many screens are pending TODAY. This number ONLY GOES DOWN: a screen that moves to `COVERED`
 * subtracts one, and nothing ever adds. Without it the pending list is a list of exceptions — a new
 * screen enters with a decorative issue number and the guard stays green (measured as a mutant when
 * reviewing hub#1813).
 */
const PENDING_TODAY = 0;

/** A real issue reference: `repo#N`. A placeholder (`repo#PENDING-1`) is not one. */
const ISSUE_REF = /^[a-z0-9_.-]+#\d+$/;

/**
 * What a person fills in, plus what a person presses. `ok-combo` is in here because it is this
 * screen's article typeahead: a spec has to fill it exactly like an `ion-select`.
 */
const CONTROL_TAGS = [
  'ion-input',
  'ion-select',
  'ion-textarea',
  'ion-toggle',
  'ion-checkbox',
  'ion-searchbar',
  'ion-radio-group',
  'ion-datetime',
  'ion-range',
  'ion-button',
  'ok-combo',
  'form',
  'input',
  'select',
  'textarea',
  'button',
] as const;

const CONTROL_OPEN = new RegExp(`<(${CONTROL_TAGS.join('|')})(?=[\\s/>])`, 'g');
const TABLE_OPEN = /<ok-data-table(?=[\s/>])/g;

/** `data-testid="…"` written by hand. The Lit binding `data-testid=${…}` does NOT count here. */
const LITERAL_TESTID = /(?<![:\w-])data-testid="([^"]*)"/g;
/** The head of a Lit binding; the expression itself is read with balanced braces. */
const COMPUTED_TESTID = /(?<![\w-])data-testid=\$\{/g;
/** `testid="…"` — the namespace `<ok-data-table>` receives from its host. */
const TABLE_TESTID = /(?<![:\w-])testid="([^"]*)"/g;
/**
 * The name handed to a REUSABLE control (`blockingButton({ testid: '…' })`). The convention says
 * the reusable control takes its name from outside and the HOST puts the prefix — so the host's
 * call is where the name lives, and where the contract has to read it, or renaming it there is
 * invisible to every rule below.
 */
const PASSED_LITERAL = /(?<![\w-])testid:\s*'([^']*)'/g;
/** The same, when the host computes the name for a row: `testid: `combos-course-row-${id}-…``. */
const PASSED_COMPUTED = /(?<![\w-])testid:\s*`([^`]*)`/g;
/**
 * Any `data-test…` attribute that is NOT `data-testid`. Playwright resolves `getByTestId` against
 * `data-testid` and nothing else, so `data-test` is a hook the robot cannot reach.
 */
const DENIED_ATTR = /(?<![\w-])data-test(?!id\s*=)[\w-]*\s*=/g;
/** Every way the attribute is written, so rule 4 can reject the ones the rules above cannot read. */
const SPELLING = /(?<![\w-])(v-bind:data-testid|:data-testid|data-testid)\s*=\s*(\$\{|"|'|[^\s>])/g;
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
/**
 * A reusable control's pass-through (`data-testid=${opts.testid}`): it has no fixed head ON PURPOSE
 * because the name comes from the host, which `PASSED_LITERAL`/`PASSED_COMPUTED` already read.
 * Anything else without a head is a hook no spec can address.
 */
const PASS_THROUGH = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/;

/** The end of a `'…'` / `"…"` string, honouring escapes. */
function endOfString(source: string, open: number): number {
  const quote = source[open];
  for (let i = open + 1; i < source.length; i++) {
    if (source[i] === '\\') {
      i++;
      continue;
    }
    if (source[i] === quote) return i;
  }
  return source.length;
}

/** The `}` that closes a `${…}`, skipping the braces, strings and templates nested inside it. */
function endOfExpression(source: string, open: number): number {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const c = source[i];
    if (c === '"' || c === "'") {
      i = endOfString(source, i);
      continue;
    }
    if (c === '`') {
      i = endOfTemplate(source, i);
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return source.length;
}

/** The backtick that closes a template literal, skipping its `${…}` holes. */
function endOfTemplate(source: string, open: number): number {
  for (let i = open + 1; i < source.length; i++) {
    const c = source[i];
    if (c === '\\') {
      i++;
      continue;
    }
    if (c === '`') return i;
    if (c === '$' && source[i + 1] === '{') {
      i = endOfExpression(source, i + 1);
      continue;
    }
  }
  return source.length;
}

/**
 * The MARKUP of a Lit file: everything inside a `html`…`` template and nothing else, with every
 * other character blanked out so the line numbers stay the ones of the real file. A nested
 * `html`…`` inside a `${…}` is already inside its parent's region, so one pass covers all of them.
 */
function markupOf(source: string): string {
  const out = source.split('').map((c) => (c === '\n' ? '\n' : ' '));
  const scan = /(?<![\w$.])html`/g;
  let m: RegExpExecArray | null;
  while ((m = scan.exec(source)) !== null) {
    const open = m.index + m[0].length - 1;
    const end = endOfTemplate(source, open);
    for (let i = open + 1; i < end; i++) out[i] = source[i];
    scan.lastIndex = end + 1;
  }
  return out.join('');
}

/** The `>` that closes an opening tag, skipping the ones inside quotes or inside a binding. */
function openTag(source: string, start: number): string {
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (c === '"' || c === "'") {
      i = endOfString(source, i);
      continue;
    }
    // `@ionInput=${(e) => …}` carries a `>` of its own: reading it as the end of the tag hides
    // every attribute written after the handler, hook included.
    if (c === '$' && source[i + 1] === '{') {
      i = endOfExpression(source, i + 1);
      continue;
    }
    if (c === '>') return source.slice(start, i + 1);
  }
  return source.slice(start);
}

function walk(dir: string, found: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, found);
    else found.push(full);
  }
  return found;
}

const uiSources: Array<{ name: string; source: string; markup: string }> = walk(UI)
  .filter((f) => f.endsWith('.ts') && !f.endsWith(GUARD))
  .map((f) => {
    const source = readFileSync(f, 'utf8');
    return { name: relative(UI, f), source, markup: markupOf(source) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

/** A screen is a file that PAINTS controls: that is what the contract is about. */
const SCREENS = uiSources.filter((s) => new RegExp(CONTROL_OPEN.source).test(s.markup));

/** Rule 3 reaches both halves: the screens AND the specs that address them. */
const SWEPT = [
  ...uiSources,
  ...walk(TESTS)
    .filter((f) => !f.endsWith(GUARD))
    .map((f) => ({ name: relative(MODULE_DIR, f), source: readFileSync(f, 'utf8') })),
];

const matches = (re: RegExp, source: string): RegExpExecArray[] => {
  const found: RegExpExecArray[] = [];
  const scan = new RegExp(re.source, re.flags);
  let m: RegExpExecArray | null;
  while ((m = scan.exec(source)) !== null) found.push(m);
  return found;
};

const lineOf = (source: string, index: number): number => source.slice(0, index).split('\n').length;

/** Every fixed name the screen declares: painted by hand, or handed to a reusable control. */
const literalTestids = (markup: string): string[] => [
  ...matches(LITERAL_TESTID, markup).map((m) => m[1]),
  ...matches(PASSED_LITERAL, markup).map((m) => m[1]),
];

const tableTestids = (markup: string): string[] => matches(TABLE_TESTID, markup).map((m) => m[1]);

/** The fixed head of a name built from a variable: the text before the first `${`. */
const headOf = (template: string): string | null => {
  const head = template.split('${')[0];
  return head.length > 0 ? head : null;
};

/**
 * The computed hooks of a screen. A `${…}` holding a template gives its fixed head; a bare property
 * read (`opts.testid`) is a reusable control's pass-through and is legal with no head, because its
 * host names it. Anything else has no head and no host, so no spec can address it.
 */
function computedHooks(
  markup: string,
): Array<{ expression: string; head: string | null; passThrough: boolean; line: number }> {
  const fromAttribute = matches(COMPUTED_TESTID, markup).map((m) => {
    const expression = markup.slice(m.index + m[0].length, endOfExpression(markup, m.index + m[0].length - 1)).trim();
    const template = expression.match(/^`([^`]*)`$/);
    return {
      expression,
      head: template ? headOf(template[1]) : null,
      passThrough: !template && PASS_THROUGH.test(expression) && expression.split('.').pop() === 'testid',
      line: lineOf(markup, m.index),
    };
  });
  const fromHost = matches(PASSED_COMPUTED, markup).map((m) => ({
    expression: '`' + m[1] + '`',
    head: headOf(m[1]),
    passThrough: false,
    line: lineOf(markup, m.index),
  }));
  return [...fromAttribute, ...fromHost];
}

const hasTestid = (tag: string): boolean => /(?:^|\s)data-testid\s*=/.test(tag);

const uncoveredControls = (markup: string): string[] =>
  matches(CONTROL_OPEN, markup)
    .filter((m) => !hasTestid(openTag(markup, m.index)))
    .map((m) => `<${m[1]}> line ${lineOf(markup, m.index)}`);

const tablesWithoutNamespace = (markup: string): string[] =>
  matches(TABLE_OPEN, markup)
    .filter((m) => !/(?:^|\s)testid\s*=/.test(openTag(markup, m.index)))
    .map((m) => `<ok-data-table> line ${lineOf(markup, m.index)}`);

describe('data-testid — the module UI contract (combos#18)', () => {
  it('1 · covered screens leave no control without a hook', () => {
    const offenders: string[] = [];
    for (const name of Object.keys(COVERED)) {
      const screen = uiSources.find((s) => s.name === name);
      expect(screen, `${name} is in COVERED but does not exist`).toBeDefined();
      for (const control of uncoveredControls(screen!.markup)) offenders.push(`${name}: ${control}`);
      for (const table of tablesWithoutNamespace(screen!.markup)) offenders.push(`${name}: ${table}`);
    }
    expect(
      offenders,
      'a control without data-testid is a control Playwright cannot fill; an <ok-data-table> ' +
        'without `testid` paints no hook at all (outfitkit#143)',
    ).toEqual([]);
  });

  it('2 · the declared contract is EXACTLY what the screen paints', () => {
    for (const [name, spec] of Object.entries(COVERED)) {
      const screen = uiSources.find((s) => s.name === name)!;
      expect([...new Set(literalTestids(screen.markup))].sort(), `${name}: literal hooks`).toEqual(
        [...spec.contract].sort(),
      );
      const hooks = computedHooks(screen.markup);
      expect(
        [...new Set(hooks.map((h) => h.head).filter((h): h is string => h !== null))].sort(),
        `${name}: fixed heads of the computed hooks`,
      ).toEqual([...(spec.computed ?? [])].sort());
      expect(
        hooks
          .filter((h) => h.head === null && !h.passThrough)
          .map((h) => `line ${h.line}: ${h.expression}`),
        `${name}: a computed hook with no fixed head cannot be addressed by any spec`,
      ).toEqual([]);
      expect([...new Set(tableTestids(screen.markup))].sort(), `${name}: table namespaces`).toEqual(
        [...(spec.tables ?? [])].sort(),
      );
    }
  });

  it('2b · every declared name is kebab-case and lives under its screen prefix', () => {
    const offenders: string[] = [];
    for (const [name, spec] of Object.entries(COVERED)) {
      for (const value of [...spec.contract, ...(spec.computed ?? []), ...(spec.tables ?? [])]) {
        if (!KEBAB.test(value.replace(/-$/, ''))) offenders.push(`${name}: "${value}" is not kebab-case`);
        if (!value.startsWith(spec.prefix)) offenders.push(`${name}: "${value}" is outside ${spec.prefix}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('2c · no literal hook is repeated across two screens', () => {
    const owners = new Map<string, string[]>();
    for (const { name, markup } of uiSources) {
      for (const value of new Set(literalTestids(markup))) {
        owners.set(value, [...(owners.get(value) ?? []), name]);
      }
    }
    expect(
      [...owners].filter(([, screens]) => screens.length > 1).map(([v, s]) => `${v}: ${s.join(', ')}`),
      'getByTestId would pick one of them at random',
    ).toEqual([]);
  });

  it('3 · nothing writes data-test (or any other variant) instead of data-testid', () => {
    const offenders: string[] = [];
    for (const { name, source } of SWEPT) {
      for (const m of matches(DENIED_ATTR, source)) {
        offenders.push(`${name}:${lineOf(source, m.index)}: ${m[0].trim()}`);
      }
    }
    expect(
      offenders,
      'Playwright resolves getByTestId against data-testid and nothing else',
    ).toEqual([]);
  });

  it('4 · the hook is written in ONE way: data-testid="…" or data-testid=${…}', () => {
    const offenders: string[] = [];
    for (const { name, source } of SWEPT) {
      for (const m of matches(SPELLING, source)) {
        const legal = m[1] === 'data-testid' && (m[2] === '"' || m[2] === '${');
        if (!legal) offenders.push(`${name}:${lineOf(source, m.index)}: ${m[0].trim()}`);
      }
    }
    expect(
      offenders,
      'this module is Lit: `:data-testid`/`v-bind:data-testid` paint an attribute with that literal ' +
        'name, which getByTestId does not resolve, and single quotes are invisible to the rules above',
    ).toEqual([]);
  });

  it('5 · every screen with a form is classified, and the pending list only shrinks', () => {
    const unclassified = SCREENS.filter(
      (s) => !(s.name in COVERED) && !(s.name in NOT_YET_COVERED),
    ).map((s) => s.name);
    expect(unclassified, 'a screen with controls is either COVERED or a declared pending one').toEqual([]);

    for (const [name, issue] of Object.entries(NOT_YET_COVERED)) {
      expect(ISSUE_REF.test(issue), `${name}: "${issue}" is not a real issue (repo#N)`).toBe(true);
      const screen = uiSources.find((s) => s.name === name);
      expect(screen, `${name} is pending but does not exist`).toBeDefined();
      expect(
        uncoveredControls(screen!.markup).length + tablesWithoutNamespace(screen!.markup).length,
        `${name} is already complete: move it to COVERED and subtract one from PENDING_TODAY`,
      ).toBeGreaterThan(0);
    }

    expect(
      Object.keys(NOT_YET_COVERED).length,
      "PENDING_TODAY is today's photo and only goes down: a new screen cannot enter the pending " +
        'list with a decorative issue number',
    ).toBe(PENDING_TODAY);
  });
});
