// A list that could not load must not read «No menus» + «0 records» (pm#533, hub#2328).
//
// The shell's `<ok-data-table>` (OutfitKit ≥ 0.1.113) paints a failed load itself: «could not
// load», the reason and a Retry button. The menu list hands it the controller's `error` and
// reloads on its `retry` event — and drops its own red banner, which would say the same thing
// twice. But a module paints with the SHELL's OutfitKit (ADR-0451): on a hub whose table has no
// `error` property the banner is the only place the reason is shown, so it stays.
//
// The shell's table is stood in for by a bare element registered BEFORE the screen loads (as the
// shell does at boot; the screen's own `define()` then loses, like in the hub). Its `error`
// property is added or removed per test, which is exactly what `dataTableShowsLoadError()` reads.
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

class ShellTable extends HTMLElement {}
const errors = new WeakMap<HTMLElement, unknown>();

function shellTableKnowsErrors(yes: boolean) {
  if (yes) {
    Object.defineProperty(ShellTable.prototype, 'error', {
      configurable: true,
      get(this: HTMLElement) { return errors.get(this) ?? ''; },
      set(this: HTMLElement, v: unknown) { errors.set(this, v); },
    });
  } else {
    delete (ShellTable.prototype as { error?: unknown }).error;
  }
}

const TAG = 'erp-combos-menus';
const TABLE = 'combos-table';
const BANNER = 'combos-list-error';

let hubAnswers = false;
let pageCalls = 0;
let queryCalls: string[] = [];

beforeAll(async () => {
  customElements.define('ok-data-table', ShellTable);
  await import('../components/erp-combos-menus/erp-combos-menus');
});

beforeEach(() => {
  document.body.innerHTML = '';
  hubAnswers = false;
  pageCalls = 0;
  queryCalls = [];
  const answer = async (name: string) => {
    queryCalls.push(name);
    if (!hubAnswers) throw new Error('The hub is not responding.');
    return [];
  };
  (globalThis as Record<string, unknown>).erplora = {
    query: answer,
    queryOptional: answer,
    queryPage: async () => {
      pageCalls++;
      if (!hubAnswers) throw new Error('The hub is not responding.');
      return { rows: [{ id: 'r1', name: 'Menú del día' }], total: 1 };
    },
    queryAll: async () => [],
    command: async () => ({}),
    hasPermission: () => true,
    on: () => () => {},
    locale: 'es',
    t: (_catalog: unknown, key: string) => key,
    currency: 'EUR',
    currencyDecimals: 2,
    formatMoney: (cents: number) => `${(cents / 100).toFixed(2)} €`,
  };
});

type Screen = HTMLElement & { shadowRoot: ShadowRoot; updateComplete: Promise<unknown> };

async function mountFailed(): Promise<{ el: Screen; table: HTMLElement }> {
  const el = document.createElement(TAG) as Screen;
  document.body.appendChild(el);
  await vi.waitFor(() => {
    if (pageCalls === 0) throw new Error('the list has not asked for its page yet');
  });
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  const table = el.shadowRoot.querySelector<HTMLElement>(`ok-data-table[testid="${TABLE}"]`);
  expect(table, `${TAG} paints its table`).toBeTruthy();
  return { el, table: table! };
}

describe(`${TAG} — a list that could not load (pm#533)`, () => {
  it('hands the reason to the shell table and paints no second banner', async () => {
    shellTableKnowsErrors(true);
    const { el, table } = await mountFailed();
    expect((table as unknown as { error: string }).error).toBe('The hub is not responding.');
    expect(el.shadowRoot.querySelector(`[data-testid="${BANNER}"]`), 'the reason would be said twice').toBeNull();
  });

  it('Retry on the table asks the hub again and paints the rows that now arrive', async () => {
    shellTableKnowsErrors(true);
    const { el, table } = await mountFailed();
    const before = pageCalls;
    hubAnswers = true;
    table.dispatchEvent(new CustomEvent('retry', { detail: {} }));
    await vi.waitFor(() => {
      if (pageCalls === before) throw new Error('Retry did not ask the hub again');
    });
    await vi.waitFor(async () => {
      await el.updateComplete;
      if ((table as unknown as { error: string }).error !== '') throw new Error('the error is still on the table');
    });
    expect((table as unknown as { rows: unknown[] }).rows).toEqual([{ id: 'r1', name: 'Menú del día' }]);
  });

  it('on a shell whose table cannot paint the error, keeps its own banner with the reason', async () => {
    shellTableKnowsErrors(false);
    const { el } = await mountFailed();
    const banner = el.shadowRoot.querySelector(`[data-testid="${BANNER}"]`);
    expect(banner, 'an older hub would show the failure nowhere').toBeTruthy();
    expect(banner!.textContent).toContain('The hub is not responding.');
  });

  it('Retry also asks again for the catalogue and the tax categories the failure left out', async () => {
    // Both load with the list when the screen opens; after a failed start the menu form would
    // keep saying «could not load the catalogue» even with the rows back.
    shellTableKnowsErrors(true);
    const { el, table } = await mountFailed();
    const state = el as unknown as { catalogueError: string; taxCategoriesError: string };
    expect(state.catalogueError, 'the catalogue failed with the list').not.toBe('');
    expect(state.taxCategoriesError, 'the tax categories failed with the list').not.toBe('');
    hubAnswers = true;
    table.dispatchEvent(new CustomEvent('retry', { detail: {} }));
    await vi.waitFor(() => {
      if (state.catalogueError !== '') throw new Error('the catalogue was not asked again');
      if (state.taxCategoriesError !== '') throw new Error('the tax categories were not asked again');
    });
    expect(queryCalls.filter((n) => n === 'taxes.categories.list').length).toBeGreaterThanOrEqual(2);
    expect(queryCalls.filter((n) => n === 'inventory.products.list').length).toBeGreaterThanOrEqual(2);
  });
});
