// Contract of the screen a business builds a "menu del dia" with (pm#157, ADR-0381).
//
// Every assertion here pins a decision that, undone, turns this into a different product. They are
// not "it renders something" checks.
//
// 🔴 THEY ASSERT ON STRUCTURE AND ON THE i18n KEY, NEVER ON THE PROSE. A test that matches the
// visible Spanish sentence passes only while nobody rewords it, and it silently rewards a module
// that hardcodes text instead of translating it. So "it says it in words" is checked as: the
// component ASKED for that catalogue key, and what came back is non-empty and is not the raw enum
// value. Reword the sentence and the test stays green; drop the sentence and it goes red.
//
//  1. TWO LEVELS, ONE VIEW. The menu list and the builder of the open menu are the same navigation
//     entry: you enter a menu by clicking its row. A combo is an ARTICLE of the catalogue
//     (ADR-0381 piece 1), and an article is opened from its own record.
//
//  2. OBLIGATION IS A NUMBER, NOT A CHECKBOX. `min_choices >= 1` IS "required". There is no
//     required control on this screen, deliberately: it is Square's documented footgun, where one
//     control with two effects turns an optional course compulsory without saying so.
//
//  3. `supply_kind` IS ASKED BY WHAT IT MEANS. Whoever fills it is a restaurateur, not a tax
//     adviser: each value carries its consequence. `service` is the default.
//
//  4. WHAT THE DATABASE REFUSES, THE SCREEN EXPLAINS FIRST. A `service` combo with no rate of its
//     own and a ceiling below the floor are CHECK constraints: reaching Postgres with them means
//     showing the user a constraint violation instead of a sentence.
//
//  5. NO NATIVE `disabled`. Ionic implements it as `pointer-events:none`: it swallows the tap and
//     leaves the reason in a `title` nobody sees on a tablet. Use `aria-disabled` + the reason in
//     words + a tap that ANSWERS.
//
//  6. THE CATALOGUE IS AN OPAQUE, OPTIONAL REFERENCE. `combos` has `depends_on: []` and must not
//     gain a hard dependency just for having a picker: catalogues are read with `queryOptional`
//     (ADR-0127), and an absent owner module is SAID in words instead of being served as an empty
//     dropdown that looks like an empty catalogue.
import { beforeEach, describe, expect, it } from 'vitest';
import esLocale from '../../../locales/es.json';
import enLocale from '../../../locales/en.json';

// ── Bench: a hub with two menus, one of them with two courses built ──────────────────────────

const SET_MENU = {
  id: 'c1', name: 'Menú del día', kitchen_name: '', price: 1350,
  tax_category_key: 'reduced', supply_kind: 'service', is_active: 1, sort_order: 0,
};

const SHOP_PACK = {
  id: 'c2', name: 'Bocadillo + bebida', kitchen_name: '', price: 400,
  tax_category_key: '', supply_kind: 'goods', is_active: 1, sort_order: 1,
};

const STARTER = {
  group_id: 'g1', combo_id: 'c1', name: 'Primero',
  min_choices: 1, max_choices: 1, allow_repeat: 0, sort_order: 0,
};

const DESSERT = {
  group_id: 'g2', combo_id: 'c1', name: 'Postre',
  min_choices: 0, max_choices: 2, allow_repeat: 1, sort_order: 1,
};

const STARTER_OPTION = {
  option_id: 'o1', group_id: 'g1', source: 'product', source_ref: 'p1',
  price_delta: 0, sort_order: 0,
};

const PRODUCTS = [
  { id: 'p1', name: 'Ensalada', price: 700 },
  { id: 'p2', name: 'Solomillo', price: 1600 },
];

const SERVICES = [{ id: 's1', name: 'Corte de pelo', price: 1500 }];

const TAX_CATEGORIES = [
  { key: 'reduced', display_name: 'IVA reducido (10 %)' },
  { key: 'standard', display_name: 'IVA general (21 %)' },
];

let commands: { name: string; payload: Record<string, unknown> }[] = [];
let queried: string[] = [];
/** Keys the component asked the module catalogue to translate. */
let translated: string[] = [];
/** Queries this hub does NOT have installed: `queryOptional` answers `undefined` for them. */
let notInstalled: Set<string>;
/** Queries that must fail, for the error state. */
let broken: Map<string, string>;
/** Makes `combos.options.list` answer OUT of order, to prove the builder does not trust it. */
let choicesArriveUnordered: boolean;
let groups: typeof STARTER[];
let options: typeof STARTER_OPTION[];
let combos: typeof SET_MENU[];

beforeEach(() => {
  commands = [];
  queried = [];
  translated = [];
  notInstalled = new Set();
  broken = new Map();
  choicesArriveUnordered = false;
  groups = [STARTER, DESSERT];
  options = [STARTER_OPTION];
  combos = [SET_MENU, SHOP_PACK];

  const answer = (name: string, params: Record<string, unknown> = {}): unknown => {
    queried.push(name);
    const boom = broken.get(name);
    if (boom) throw new Error(boom);
    if (name === 'combos.groups.list') return groups.filter((g) => g.combo_id === params.combo_id);
    if (name === 'combos.options.list') {
      // `ORDER BY sort_order, source_ref, id`, verbatim from queries/options_list.sql.
      const rows = options
        .filter((o) => o.group_id === params.group_id)
        .sort((a, b) => a.sort_order - b.sort_order
          || a.source_ref.localeCompare(b.source_ref)
          || a.option_id.localeCompare(b.option_id));
      return choicesArriveUnordered ? rows.reverse() : rows;
    }
    if (name === 'inventory.products.list') return PRODUCTS;
    if (name === 'services.services.list') return SERVICES;
    if (name === 'taxes.categories.list') return TAX_CATEGORIES;
    return [];
  };

  (globalThis as Record<string, unknown>).erplora = {
    query: async (name: string, params?: Record<string, unknown>) => answer(name, params),
    queryOptional: async (name: string, params?: Record<string, unknown>) => {
      if (notInstalled.has(name)) {
        queried.push(name);
        return undefined;
      }
      return answer(name, params);
    },
    queryPage: async (name: string) => {
      queried.push(name);
      const boom = broken.get(name);
      if (boom) throw new Error(boom);
      return { rows: combos, total: combos.length, limit: 50, offset: 0 };
    },
    command: async (name: string, payload: Record<string, unknown>) => {
      commands.push({ name, payload });
      return {};
    },
    on: () => () => {},
    hasPermission: () => true,
    locale: 'es',
    currency: 'EUR',
    currencyDecimals: 2,
    formatMoney: (minor: number) => `${(minor / 100).toFixed(2)} €`,
    t: (catalog: Record<string, unknown>, key: string, params?: Record<string, unknown>) => {
      translated.push(key);
      const dict = (catalog.es ?? {}) as Record<string, unknown>;
      let cur: unknown = dict;
      for (const part of key.split('.')) {
        cur = cur && typeof cur === 'object' ? (cur as Record<string, unknown>)[part] : undefined;
      }
      let out = typeof cur === 'string' ? cur : key;
      for (const [k, v] of Object.entries(params ?? {})) out = out.replaceAll(`{${k}}`, String(v));
      return out;
    },
  };
});

type Mounted = HTMLElement & { shadowRoot: ShadowRoot };

async function mount(): Promise<Mounted> {
  await import('./erp-combos-menus');
  const el = document.createElement('erp-combos-menus');
  document.body.appendChild(el);
  await settle(el);
  return el as Mounted;
}

async function settle(el: Element): Promise<void> {
  for (let i = 0; i < 6; i += 1) {
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    await new Promise((r) => setTimeout(r, 0));
  }
}

const table = (el: Mounted) =>
  el.shadowRoot.querySelector('ok-data-table') as (HTMLElement & Record<string, unknown>) | null;

const at = (el: Mounted, test: string) =>
  el.shadowRoot.querySelector(`[data-test="${test}"]`) as (HTMLElement & { value?: unknown }) | null;

/** Types into a control the way Ionic reports it. */
function type(el: Mounted, test: string, value: unknown): void {
  const c = at(el, test)!;
  c.value = value;
  c.dispatchEvent(new CustomEvent('ionInput', { detail: { value } }));
  c.dispatchEvent(new CustomEvent('ionChange', { detail: { value } }));
}

/** Enters menu `row` the way the user does: by clicking its row. */
async function openMenu(el: Mounted, row: Record<string, unknown> = SET_MENU): Promise<void> {
  table(el)!.dispatchEvent(new CustomEvent('rowClick', { detail: { row } }));
  await settle(el);
}

/** The visible text of a node, collapsed — used only to assert a sentence is NOT the raw enum. */
const words = (n: Element | null) => (n?.textContent ?? '').replace(/\s+/g, ' ').trim();

// ── 1 · Two levels, one view ─────────────────────────────────────────────────────────────────

describe('the menu list is the door, and a menu is entered by clicking its row', () => {
  it('starts on the menu list, in an ok-data-table that fills the height', async () => {
    const el = await mount();
    expect(table(el), 'the view does not start on the menu list').toBeTruthy();
    expect(table(el)?.fill, 'without `fill` the table does not take the view height').toBe(true);
    expect(table(el)?.addable, 'without `addable` there is no + to create a menu').toBe(true);
  });

  it('the whole row is clickable: the actions column can sit off-screen (outfitkit#67)', async () => {
    const el = await mount();
    expect(table(el)?.rowClickable, '`rowClickable` is opt-in and here it is the only door in').toBe(true);
  });

  it('does not repeat the view title: the shell topbar paints it', async () => {
    const el = await mount();
    expect(el.shadowRoot.querySelector('h2'), 'the view duplicates the topbar title').toBeNull();
  });

  it('clicking a menu opens ITS builder, with that menu courses and only those', async () => {
    const el = await mount();
    await openMenu(el);
    expect(queried, 'the courses are not asked per combo').toContain('combos.groups.list');
    const courses = [...el.shadowRoot.querySelectorAll('[data-test="course"]')];
    expect(courses.map((c) => c.getAttribute('data-group-id')), 'wrong courses painted').toEqual(['g1', 'g2']);
  });

  it('the builder allows going back to the list without reloading the view', async () => {
    const el = await mount();
    await openMenu(el);
    const back = at(el, 'back-to-menus');
    expect(back, 'there is no way back from the builder').toBeTruthy();
    back!.click();
    await settle(el);
    expect(table(el), 'going back does not return to the menu list').toBeTruthy();
  });

  it('paints the courses in their declared order, which is the order they are asked in', async () => {
    groups = [DESSERT, STARTER];
    const el = await mount();
    await openMenu(el);
    const courses = [...el.shadowRoot.querySelectorAll('[data-test="course"]')];
    expect(courses.map((c) => c.getAttribute('data-group-id')),
      'the builder does not respect sort_order: the courses would be asked in another order at the till')
      .toEqual(['g1', 'g2']);
  });
});

// ── 2 · Obligation is a number, not a checkbox ───────────────────────────────────────────────

describe('the obligation of a course is READ from min_choices and stated in words', () => {
  const course = (el: Mounted, id: string) =>
    el.shadowRoot.querySelector(`[data-test="course"][data-group-id="${id}"]`) as HTMLElement;

  it('a course with min_choices >= 1 is presented as compulsory', async () => {
    const el = await mount();
    await openMenu(el);
    expect(course(el, 'g1'), 'the compulsory course is not painted').toBeTruthy();
    expect(course(el, 'g1').getAttribute('data-required'),
      'min_choices=1 does not mark the course compulsory').toBe('true');
    expect(translated, 'it never asked for the compulsory sentence: the rule is not stated')
      .toContain('ui.courseRequired');
  });

  it('a course with min_choices = 0 is presented as optional', async () => {
    const el = await mount();
    await openMenu(el);
    expect(course(el, 'g2').getAttribute('data-required')).toBe('false');
    expect(translated).toContain('ui.courseOptional');
  });

  it('states the rule as a sentence, not as the raw number or the column name', async () => {
    const el = await mount();
    await openMenu(el);
    const said = words(course(el, 'g1').querySelector('[data-test="course-rule"]'));
    expect(said.length, 'the course rule is empty: nothing tells the owner what the till will do')
      .toBeGreaterThan(3);
    expect(/^(min_choices|max_choices|1|0)$/i.test(said), 'it shows the raw field, not a sentence').toBe(false);
  });

  it('there is NO required control that could contradict the minimum (Square footgun)', async () => {
    const el = await mount();
    await openMenu(el);
    const toggles = [...el.shadowRoot.querySelectorAll('ion-checkbox, ion-toggle')];
    const suspect = toggles.find((c) => /obligatori|required/i.test(c.textContent ?? ''));
    expect(suspect, 'there is a separate required box beside the minimum: that is the Square bug').toBeUndefined();
  });

  it('states the ceiling and the repetition, the other half of the rule the till applies', async () => {
    const el = await mount();
    await openMenu(el);
    expect(translated, 'never states the ceiling').toContain('ui.courseMax');
    expect(translated, 'never states that repeating is allowed').toContain('ui.courseRepeat');
  });

  it('a ceiling of 0 is stated as "no limit", not as a ceiling of zero', async () => {
    groups = [{ ...STARTER, max_choices: 0 }];
    const el = await mount();
    await openMenu(el);
    expect(translated, '`max_choices = 0` is being shown as a real ceiling of zero').toContain('ui.courseNoCeiling');
    expect(translated).not.toContain('ui.courseMax');
  });
});

// ── 3 · supply_kind is offered by its consequence ────────────────────────────────────────────

describe('supply_kind is offered by its consequence, not as tax jargon', () => {
  const supplyOptions = (el: Mounted) =>
    [...el.shadowRoot.querySelectorAll('[data-test="supply-kind"] ion-select-option')] as HTMLElement[];

  it('offers exactly the two values the database accepts', async () => {
    const el = await mount();
    expect(supplyOptions(el).map((o) => o.getAttribute('value')).sort()).toEqual(['goods', 'service']);
  });

  it('`service` is the default: the Spanish set menu goes entirely at the menu rate', async () => {
    const el = await mount();
    expect((at(el, 'supply-kind') as { value: string }).value, 'the default is not `service`').toBe('service');
  });

  it('neither value is labelled with the raw enum: each states its consequence', async () => {
    const el = await mount();
    const labels = supplyOptions(el).map((o) => words(o));
    expect(labels.every((l) => l.length > 0), 'an option with no label').toBe(true);
    expect(labels.some((l) => /^(service|goods|supply_kind)$/i.test(l)), 'the raw value is offered as the label').toBe(false);
    expect(translated, 'the `service` consequence is never stated').toContain('ui.supplyServiceHelp');
    expect(translated, 'the `goods` consequence is never stated').toContain('ui.supplyGoodsHelp');
  });

  it('a `goods` menu warns, in its own builder, that the price WILL BE SPLIT per component', async () => {
    const el = await mount();
    await openMenu(el, SHOP_PACK);
    expect(translated, 'a `goods` pack does not warn about the per-component split')
      .toContain('ui.supplyGoodsWarning');
    expect(at(el, 'supply-consequence'), 'the consequence is not painted in the builder').toBeTruthy();
  });

  it('a `service` menu states the opposite: one single line, whatever its components are taxed at', async () => {
    const el = await mount();
    await openMenu(el, SET_MENU);
    expect(translated).toContain('ui.supplyServiceWarning');
  });
});

// ── 4 · What the database refuses, the screen explains first ─────────────────────────────────

describe('the two CHECKs of the schema are explained on screen, not in the Postgres error', () => {
  it('a `service` menu with no rate of its own is not sent, and the reason is readable', async () => {
    const el = await mount();
    type(el, 'combo-name', 'Menú sin tipo');
    type(el, 'combo-price', '13,50');
    type(el, 'supply-kind', 'service');
    type(el, 'combo-tax-category', '');
    await settle(el);

    const button = at(el, 'save-combo')!;
    expect(button.hasAttribute('disabled'),
      'uses the native `disabled`: the tap is swallowed and the reason stays in a title').toBe(false);
    expect(button.getAttribute('aria-disabled'), 'the button is not marked unactionable').toBe('true');

    button.click();
    await settle(el);
    expect(commands, 'a combo the database will refuse was sent').toEqual([]);
    expect(translated, 'the tap does not ANSWER with the reason').toContain('ui.errNoTaxCategory');
    expect(at(el, 'combo-blocked-reason'), 'the reason is not painted anywhere').toBeTruthy();
  });

  it('a `goods` menu needs no rate of its own: each component brings its own', async () => {
    const el = await mount();
    type(el, 'combo-name', 'Pack tienda');
    type(el, 'combo-price', '4,00');
    type(el, 'supply-kind', 'goods');
    type(el, 'combo-tax-category', '');
    await settle(el);
    expect(at(el, 'save-combo')!.getAttribute('aria-disabled'),
      '`goods` is being asked for a rate it does not need').toBe('false');
  });

  it('a ceiling below the floor is refused with the reason written, without reaching the database', async () => {
    const el = await mount();
    await openMenu(el);
    type(el, 'course-name', 'Imposible');
    type(el, 'course-min', '3');
    type(el, 'course-max', '1');
    await settle(el);

    const button = at(el, 'save-course')!;
    expect(button.getAttribute('aria-disabled')).toBe('true');
    button.click();
    await settle(el);
    expect(commands.filter((c) => c.name === 'combos.groups.create'),
      'a course impossible to satisfy was sent').toEqual([]);
    expect(translated).toContain('ui.errCeilingBelowFloor');
  });

  it('a ceiling of 0 is "no limit" and is NOT confused with a ceiling below the floor', async () => {
    const el = await mount();
    await openMenu(el);
    type(el, 'course-name', 'Bebida');
    type(el, 'course-min', '1');
    type(el, 'course-max', '0');
    await settle(el);

    expect(at(el, 'save-course')!.getAttribute('aria-disabled'),
      '`max = 0` is no ceiling, not an invalid one').toBe('false');
    at(el, 'save-course')!.click();
    await settle(el);
    expect(commands.map((c) => c.name)).toContain('combos.groups.create');
  });

  it('the course it sends carries the numbers as numbers, not as the typed strings', async () => {
    const el = await mount();
    await openMenu(el);
    type(el, 'course-name', 'Bebida');
    type(el, 'course-min', '1');
    type(el, 'course-max', '2');
    await settle(el);
    at(el, 'save-course')!.click();
    await settle(el);
    const created = commands.find((c) => c.name === 'combos.groups.create')!;
    expect(created.payload.combo_id, 'the course is not hung from the open menu').toBe('c1');
    expect(created.payload.min_choices).toBe(1);
    expect(created.payload.max_choices).toBe(2);
  });
});

// ── 5 · The catalogue is an OPAQUE, OPTIONAL reference ───────────────────────────────────────

describe('the article picker does not give combos a hard dependency', () => {
  const picker = (el: Mounted) =>
    at(el, 'option-picker') as unknown as HTMLElement & { options: { value: string; label: string }[] };

  it('reads both catalogues through the OPTIONAL door (ADR-0127), not through `query`', async () => {
    const el = await mount();
    await openMenu(el);
    expect(queried, 'does not consult the product catalogue').toContain('inventory.products.list');
    expect(queried, 'does not consult the service catalogue').toContain('services.services.list');
  });

  it('offers products AND services in the same picker: a salon pack is made of services', async () => {
    const el = await mount();
    await openMenu(el);
    expect(picker(el), 'there is no article picker').toBeTruthy();
    const labels = picker(el).options.map((o) => o.label).join(' | ');
    expect(labels, 'does not offer the catalogue products').toContain('Ensalada');
    expect(labels, 'does not offer the catalogue services').toContain('Corte de pelo');
  });

  it('with inventory NOT installed it SAYS so, instead of faking an empty catalogue', async () => {
    notInstalled.add('inventory.products.list');
    const el = await mount();
    await openMenu(el);
    expect(translated, 'an absent catalogue is presented as an empty catalogue').toContain('ui.catalogueMissing');
    expect(at(el, 'catalogue-missing'), 'the absence is not painted').toBeTruthy();
    expect(picker(el).options.map((o) => o.label).join(' | '),
      'the services are there and must still be offered').toContain('Corte de pelo');
  });

  it('stores the OPAQUE reference (source + source_ref), never the article name', async () => {
    const el = await mount();
    await openMenu(el);
    picker(el).dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p2', label: 'Solomillo' } }));
    type(el, 'option-delta', '3,00');
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    const created = commands.find((c) => c.name === 'combos.options.create');
    expect(created, 'the option was not created').toBeTruthy();
    expect(created!.payload.source).toBe('product');
    expect(created!.payload.source_ref).toBe('p2');
    expect(created!.payload.group_id, 'the option is not hung from its course').toBe('g1');
    expect(created!.payload.price_delta, 'the supplement does not travel in minor units').toBe(300);
    expect(Object.keys(created!.payload), 'the article name is not part of the combos contract')
      .not.toContain('name');
  });

  // `product:p1` is ALREADY the only choice of this course in the bench, and the unique index
  // refuses the same article twice in the same course — so the supplement is exercised on an
  // article the course does not have yet. The rule under test is the negative delta, not the index.
  it('accepts a NEGATIVE supplement: a cheaper substitution is a real menu', async () => {
    const el = await mount();
    await openMenu(el);
    picker(el).dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p2', label: 'Solomillo' } }));
    type(el, 'option-delta', '-1,50');
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    const created = commands.find((c) => c.name === 'combos.options.create')!;
    expect(created.payload.price_delta, 'a negative supplement is lost or clamped to 0').toBe(-150);
  });

  it('will not add a choice with no article picked, and says why', async () => {
    const el = await mount();
    await openMenu(el);
    expect(at(el, 'save-option')!.getAttribute('aria-disabled')).toBe('true');
    at(el, 'save-option')!.click();
    await settle(el);
    expect(commands.filter((c) => c.name === 'combos.options.create')).toEqual([]);
    expect(translated).toContain('ui.errNoArticle');
  });
});

// ── 6 · Loading, empty and error states PAINTED ──────────────────────────────────────────────

describe('the three states that are not the happy path are painted', () => {
  it('a menu with no courses invites creating the first, it does not leave a hole', async () => {
    groups = [];
    const el = await mount();
    await openMenu(el);
    expect(at(el, 'courses-empty'), 'an empty menu says nothing').toBeTruthy();
  });

  it('if the courses fail to load, the error shows — not a menu that looks empty', async () => {
    broken.set('combos.groups.list', 'boom');
    const el = await mount();
    await openMenu(el);
    expect(el.shadowRoot.querySelector('ok-inline-feedback[tone="danger"]'),
      'a load failure is presented as "this menu has no courses"').toBeTruthy();
    expect(at(el, 'courses-empty'), 'it also claims to be empty, which is false').toBeNull();
  });

  it('while the courses load it says so, and not ahead of time', async () => {
    const el = await mount();
    table(el)!.dispatchEvent(new CustomEvent('rowClick', { detail: { row: SET_MENU } }));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(at(el, 'courses-loading'), 'there is no loading state').toBeTruthy();
  });
});

// ── 7 · i18n and the UI rules already paid for elsewhere ─────────────────────────────────────

describe('the UI rules already paid for in other modules', () => {
  // 🔴 BOTH VIEWS, not just the one on screen at the end. The builder REPLACES the list, so the
  // combo form (which lives in the data-table create panel) is gone once a menu is open. A single
  // pass after `openMenu` inspects only the builder's controls and lets the whole combo form ship
  // without `mode="md"` — a mutation that dropped it there survived until this loop existed.
  const fillControls = (el: Mounted) =>
    [...el.shadowRoot.querySelectorAll('ion-input[fill], ion-select[fill], ion-textarea[fill]')];

  const namesOf = (nodes: Element[]) =>
    nodes.map((c) => `${c.tagName.toLowerCase()}:${c.getAttribute('data-test') ?? c.getAttribute('label') ?? ''}`);

  it('every form control with `fill` carries `mode="md"` (in `ios` fill is a no-op, ADR-0143)', async () => {
    const el = await mount();

    // View 1: the menu list, whose create panel holds the whole combo form.
    const onList = fillControls(el);
    expect(onList.length, 'the menu list has no form control at all: something is wrong').toBeGreaterThan(0);
    expect(namesOf(onList.filter((c) => c.getAttribute('mode') !== 'md')),
      'these controls of the MENU form render with no box and no border in the hub shell').toEqual([]);

    // View 2: the builder, with the course form and the choice rows.
    await openMenu(el);
    const onBuilder = fillControls(el);
    expect(onBuilder.length, 'the builder has no form control at all: something is wrong').toBeGreaterThan(0);
    expect(namesOf(onBuilder.filter((c) => c.getAttribute('mode') !== 'md')),
      'these controls of the BUILDER render with no box and no border in the hub shell').toEqual([]);

    // And `goods` swaps part of the combo form, so its branch is inspected too.
    el.shadowRoot.querySelector('[data-test="back-to-menus"]')!.dispatchEvent(new MouseEvent('click'));
    await settle(el);
    type(el, 'supply-kind', 'goods');
    await settle(el);
    expect(namesOf(fillControls(el).filter((c) => c.getAttribute('mode') !== 'md')),
      'the `goods` branch of the menu form ships a control the shell will not paint').toEqual([]);
  });

  // 🔴 A MISSING KEY IS INVISIBLE. `t()` answers the key itself when the catalogue has no entry,
  // so the test above ("nothing is hardcoded") stays green while the screen paints
  // `ui.editingChoice` at the user. And the SPANISH half is the one that goes missing, because
  // English is where the string is born (ADR-0055/0199): both files are checked, not one.
  it('every key the screen asks for exists in BOTH catalogues, `en` and its `es`', async () => {
    const el = await mount();
    await openMenu(el);

    // Walk the paths whose sentences only appear once something is being edited or refused —
    // they are exactly the ones a new feature forgets to translate.
    (el.shadowRoot.querySelector('[data-test="edit-choice"]') as HTMLElement).click();
    await settle(el);
    (el.shadowRoot.querySelector('[data-test="cancel-choice"]') as HTMLElement).click();
    await settle(el);
    (el.shadowRoot.querySelector('[data-test="option-picker"]') as HTMLElement)
      .dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p1' } }));
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    el.shadowRoot.querySelector('[data-test="back-to-menus"]')!.dispatchEvent(new MouseEvent('click'));
    await settle(el);
    type(el, 'supply-kind', 'goods');
    await settle(el);

    const lookup = (catalog: Record<string, unknown>, key: string): unknown => {
      let cur: unknown = catalog;
      for (const part of key.split('.')) {
        cur = cur && typeof cur === 'object' ? (cur as Record<string, unknown>)[part] : undefined;
      }
      return cur;
    };
    const asked = [...new Set(translated)];
    expect(asked.length, 'the screen asks for no key at all: the bench is broken').toBeGreaterThan(20);
    expect(asked.filter((k) => typeof lookup(enLocale as Record<string, unknown>, k) !== 'string'),
      'these keys are painted as their own name in English').toEqual([]);
    expect(asked.filter((k) => typeof lookup(esLocale as Record<string, unknown>, k) !== 'string'),
      'these keys have no Spanish: the hub is used in Spanish').toEqual([]);
  });

  it('no visible string is hardcoded: they all go through the module catalogue', async () => {
    const el = await mount();
    await openMenu(el);
    expect(translated.length, 'the view asks for no translation at all: there is hardcoded text')
      .toBeGreaterThan(20);
    expect([...new Set(translated)].filter((k) => !k.startsWith('ui.') && !k.startsWith('errors.')),
      'a key outside the module `ui.`/`errors.` space').toEqual([]);
  });

  // 🔴 MEASURED IN CHROMIUM, NOT GUESSED. Inside this Shadow DOM the `color` attribute of an
  // ion-button is worse than a no-op: Ionic's `.ion-color-*` classes live in the host document and
  // do not cross the shadow boundary, so the BACKGROUND resolves to rgba(0,0,0,0) while the text
  // stays rgb(255,255,255). White on white. Measured on the real bundle at 1440x900:
  //
  //     color absent   -> background rgb(0,84,233)   color rgb(255,255,255)   visible
  //     color="danger" -> background rgba(0,0,0,0)   color rgb(255,255,255)   INVISIBLE
  //     color="primary"-> background rgba(0,0,0,0)   color rgb(255,255,255)   INVISIBLE
  //
  // It hit «Guardar» and «Añadir elección» — the two primary actions of the screen. The colour has
  // to come from CSS custom properties, which DO inherit through the shadow boundary, keyed off a
  // `data-tone` hook. Nothing in the DOM shape reveals this, which is why the rule is pinned here.
  it('no ion-button leans on the `color` attribute: inside the shadow root it paints white on white', async () => {
    const el = await mount();
    const offenders = (root: ShadowRoot) =>
      [...root.querySelectorAll('ion-button[color]')].map((b) => `${b.getAttribute('data-test') ?? b.textContent?.trim()}:color=${b.getAttribute('color')}`);

    expect(offenders(el.shadowRoot), 'these buttons of the MENU list render invisible in the hub').toEqual([]);
    await openMenu(el);
    expect(offenders(el.shadowRoot), 'these buttons of the BUILDER render invisible in the hub').toEqual([]);
  });

  it('the destructive action is still distinguishable, through the hook that does cross the shadow', async () => {
    const el = await mount();
    await openMenu(el);
    const danger = [...el.shadowRoot.querySelectorAll('[data-tone="danger"]')];
    expect(danger.length, 'nothing marks the destructive action: it looks like every other button').toBeGreaterThan(0);
  });

  it('without the manage permission the screen stays read-only: no +, no row actions', async () => {
    (globalThis as Record<string, any>).erplora.hasPermission = (p: string) => p !== 'combos.manage_combo';
    const el = await mount();
    expect(table(el)?.addable, 'offers creating a menu without permission to manage it').toBe(false);
    expect((table(el)?.actions as unknown[])?.length ?? 0, 'offers row actions without permission').toBe(0);
  });

  it('without the manage permission the builder offers no way to add a course either', async () => {
    (globalThis as Record<string, any>).erplora.hasPermission = (p: string) => p !== 'combos.manage_combo';
    const el = await mount();
    await openMenu(el);
    expect(at(el, 'save-course'), 'a read-only user is offered a course form').toBeNull();
    expect(at(el, 'save-option'), 'a read-only user is offered a choice form').toBeNull();
  });
});

// ── 8 · A choice is EDITED, not withdrawn and put back (combos#1) ─────────────────────────────
//
// `combos.options.update` was declared by the manifest from day one and nobody sent it, so the
// only way to fix a typo in a supplement was to withdraw the choice and add it again. That is NOT
// the same operation, and the difference is visible on the card:
//
//     before  Ensalada · Solomillo · Sopa
//     after   Solomillo · Sopa · Ensalada        <- corrected 3,00 -> 3,50 and the menu reordered
//
// (measured on origin/main@cf248cb before this section existed). A menu del dia is READ in order,
// so a course that reshuffles itself every time a price is corrected is a defect of use, not a
// cosmetic one. The second half of the difference is atomicity: `ux_combos_choice_option` only
// looks at live rows, so the withdrawal has to land BEFORE the re-add, and a failure in between
// leaves the operator without the choice they only meant to retouch.
//
// 🔴 The assertions below go through a WRITING bench. A test that only inspects the payload cannot
// see a position being lost, because losing it is what the SERVER does with `COALESCE(:sort_order,
// 0)` when nobody sends the field: omit it and every edited choice silently jumps to the top.

/** Bench of three choices in the first course, in the order the till will ask them. */
function threeChoices(): void {
  options = [
    { option_id: 'o1', group_id: 'g1', source: 'product', source_ref: 'p1', price_delta: 0, sort_order: 0 },
    { option_id: 'o2', group_id: 'g1', source: 'product', source_ref: 'p2', price_delta: 300, sort_order: 1 },
    { option_id: 'o3', group_id: 'g1', source: 'service', source_ref: 's1', price_delta: 150, sort_order: 2 },
  ];
}

/**
 * Makes the bench WRITE. Without this the store answers the same three rows for ever and every
 * assertion about "where the choice ended up" is vacuously true.
 */
function persistChoices(): void {
  const client = (globalThis as Record<string, any>).erplora;
  const record = client.command;
  client.command = async (name: string, payload: Record<string, unknown>) => {
    await record(name, payload);
    if (name === 'combos.options.delete') {
      options = options.filter((o) => o.option_id !== payload.option_id);
    }
    if (name === 'combos.options.create') {
      options = [...options, {
        option_id: `n${options.length + 1}`, group_id: String(payload.group_id),
        source: String(payload.source), source_ref: String(payload.source_ref),
        price_delta: Number(payload.price_delta ?? 0), sort_order: Number(payload.sort_order ?? 0),
      }];
    }
    if (name === 'combos.options.update') {
      options = options.map((o) => (o.option_id === payload.option_id
        ? {
          ...o, source: String(payload.source), source_ref: String(payload.source_ref),
          price_delta: Number(payload.price_delta ?? 0), sort_order: Number(payload.sort_order ?? 0),
        }
        : o));
    }
    return {};
  };
}

/** The choices of a course as the screen paints them, top to bottom. */
const choiceOrder = (el: Mounted, groupId = 'g1') =>
  [...el.shadowRoot.querySelectorAll(`[data-test="course"][data-group-id="${groupId}"] [data-test="choice"]`)]
    .map((li) => li.getAttribute('data-option-id'));

const choiceRow = (el: Mounted, optionId: string) =>
  el.shadowRoot.querySelector(`[data-test="choice"][data-option-id="${optionId}"]`) as HTMLElement;

const inRow = (el: Mounted, optionId: string, test: string) =>
  choiceRow(el, optionId)?.querySelector(`[data-test="${test}"]`) as HTMLElement | null;

describe('a choice is edited in place, keeping the position it holds in the course', () => {
  beforeEach(() => {
    threeChoices();
    persistChoices();
  });

  // The mirror of the course test above. The order of the choices is the order the till OFFERS
  // them in, so the builder sorts what it is handed instead of trusting the caller — which is what
  // makes the optimistic swap of the arrows safe: it reorders an array, not a query.
  it('paints the choices in their declared order even if they arrive unordered', async () => {
    choicesArriveUnordered = true;
    const el = await mount();
    await openMenu(el);
    expect(choiceOrder(el),
      'the builder trusts the arrival order: the till would offer the choices in another one')
      .toEqual(['o1', 'o2', 'o3']);
  });

  it('every choice offers an edit control, not only a withdraw one', async () => {
    const el = await mount();
    await openMenu(el);
    expect(choiceOrder(el), 'bench not as declared').toEqual(['o1', 'o2', 'o3']);
    expect(inRow(el, 'o1', 'edit-choice'), 'a choice cannot be edited: the only route is delete + re-add').toBeTruthy();
    expect(inRow(el, 'o1', 'delete-choice'), 'the withdraw control disappeared').toBeTruthy();
  });

  // 🔴 THE TEST THE ISSUE IS ABOUT.
  //
  // It corrects the LAST choice on purpose. The first one sits at `sort_order` 0 already, so a
  // payload that drops the field, or hardcodes a 0, would leave it exactly where it was and this
  // test would pass over the very bug it exists to catch.
  it('correcting a supplement leaves the course in the SAME order', async () => {
    const el = await mount();
    await openMenu(el);
    const before = choiceOrder(el);

    inRow(el, 'o3', 'edit-choice')!.click();
    await settle(el);
    type(el, 'option-delta', '0,50');
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    expect(choiceOrder(el), 'correcting a supplement REORDERED the menu').toEqual(before);
    expect(options.find((o) => o.option_id === 'o3')!.price_delta, 'the supplement was not corrected').toBe(50);
    expect(choiceRow(el, 'o3').getAttribute('data-editing'),
      'the form stayed on that choice: the next Add would overwrite it instead of adding').toBe('false');
    expect(commands.map((c) => c.name).filter((n) => n.startsWith('combos.options.')),
      'the choice was withdrawn and put back instead of edited').toEqual(['combos.options.update']);
  });

  // The mechanical half of the same rule: `option_update.sql` runs `COALESCE(:sort_order, 0)`, so
  // a payload that omits the field does not "leave it alone" — it moves the choice to the top.
  it('the update carries the position the choice already had, it does not let the server default it', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o3', 'edit-choice')!.click();
    await settle(el);
    type(el, 'option-delta', '2,00');
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    const sent = commands.find((c) => c.name === 'combos.options.update')!;
    expect(sent, 'no update was sent').toBeTruthy();
    expect(sent.payload.option_id, 'the update does not say WHICH choice it edits').toBe('o3');
    expect(sent.payload.sort_order, 'the position is not sent: the server COALESCEs it to 0 and the choice jumps to the top').toBe(2);
    expect(sent.payload.price_delta, 'the supplement does not travel in minor units').toBe(200);
  });

  it('the form opens loaded with what the choice says today, not empty', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o2', 'edit-choice')!.click();
    await settle(el);

    const picker = at(el, 'option-picker') as unknown as { value: string };
    expect(picker.value, 'the picker does not preselect the article being edited').toBe('product:p2');
    expect(String((at(el, 'option-delta') as { value?: unknown }).value ?? ''),
      'the supplement box does not carry the current supplement').toBe('3');
    expect(choiceRow(el, 'o2').getAttribute('data-editing'),
      'nothing marks WHICH choice is being edited').toBe('true');
    expect(translated, 'it never says which choice is open for editing').toContain('ui.editingChoice');
  });

  it('editing the ARTICLE keeps the reference OPAQUE: source + source_ref, never the name', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    (at(el, 'option-picker') as HTMLElement)
      .dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'service:s1x', label: 'Corte de pelo' } }));
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    const sent = commands.find((c) => c.name === 'combos.options.update')!;
    expect(sent.payload.source, 'the catalogue the component comes from is not sent').toBe('service');
    expect(sent.payload.source_ref, 'the opaque id is not sent').toBe('s1x');
    expect(Object.keys(sent.payload), 'the article name is not part of the combos contract').not.toContain('name');
    expect(choiceOrder(el), 'swapping the article moved the choice').toEqual(['o1', 'o2', 'o3']);
  });

  it('a NEGATIVE supplement can be set by editing, exactly as it can by adding', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o2', 'edit-choice')!.click();
    await settle(el);
    type(el, 'option-delta', '-1,50');
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);
    expect(commands.find((c) => c.name === 'combos.options.update')!.payload.price_delta,
      'a cheaper substitution is lost or clamped to 0 when edited').toBe(-150);
  });

  it('cancelling an edit changes nothing and returns the form to adding', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    type(el, 'option-delta', '9,99');
    await settle(el);
    at(el, 'cancel-choice')!.click();
    await settle(el);

    expect(commands.filter((c) => c.name.startsWith('combos.options.')), 'cancelling wrote something').toEqual([]);
    expect(choiceRow(el, 'o1').getAttribute('data-editing'), 'the choice is still marked as being edited').toBe('false');
    expect(String((at(el, 'option-delta') as { value?: unknown }).value ?? ''),
      'the abandoned draft is still in the box, ready to be added as a new choice').toBe('');
  });

  // `ux_combos_choice_option (hub_id, group_id, source, source_ref) WHERE is_deleted = 0`. Same
  // rule as the two CHECKs of section 4: what the database refuses, the screen explains first.
  it('pointing a choice at an article the course already has is refused, with the reason in words', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    (at(el, 'option-picker') as HTMLElement)
      .dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p2' } }));
    await settle(el);

    const button = at(el, 'save-option')!;
    expect(button.hasAttribute('disabled'), 'uses the native `disabled`: the tap is swallowed').toBe(false);
    expect(button.getAttribute('aria-disabled'), 'a duplicate the database will refuse is offered as saveable').toBe('true');
    button.click();
    await settle(el);
    expect(commands.filter((c) => c.name === 'combos.options.update'), 'a duplicate was sent to the database').toEqual([]);
    expect(translated, 'the tap does not ANSWER with the reason').toContain('ui.errDuplicateArticle');
    expect(at(el, 'option-blocked-reason'), 'the reason is not painted anywhere').toBeTruthy();
  });

  it('the same guard protects ADDING, which could always hit that index too', async () => {
    const el = await mount();
    await openMenu(el);
    (at(el, 'option-picker') as HTMLElement)
      .dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p1' } }));
    await settle(el);
    expect(at(el, 'save-option')!.getAttribute('aria-disabled'),
      'adding an article the course already has is offered as saveable').toBe('true');
    at(el, 'save-option')!.click();
    await settle(el);
    expect(commands.filter((c) => c.name === 'combos.options.create'), 'a duplicate was sent to the database').toEqual([]);
  });

  // 🔴 MEASURED IN CHROMIUM, at 390x844. The reason existed in the DOM and every happy-dom
  // assertion was green — but it was painted AFTER the last course, so on a phone the operator
  // taps «Guardar» in the first course and the sentence explaining the refusal is two screens
  // below, out of sight. A reason nobody sees is the `title` attribute all over again.
  it('the reason is painted INSIDE the course whose form was refused, not at the foot of the menu', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    (at(el, 'option-picker') as HTMLElement)
      .dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p2' } }));
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    const course = (id: string) => el.shadowRoot.querySelector(`[data-test="course"][data-group-id="${id}"]`)!;
    expect(course('g1').querySelector('[data-test="option-blocked-reason"]'),
      'the reason is not inside the course that refused: on a phone it is off-screen').toBeTruthy();
    expect(course('g2').querySelector('[data-test="option-blocked-reason"]'),
      'the reason is repeated in a course that refused nothing').toBeNull();
  });

  it('a failure is reported in the course it happened in, not in every course at once', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    (globalThis as Record<string, any>).erplora.command = async () => { throw new Error(''); };
    at(el, 'save-option')!.click();
    await settle(el);

    const course = (id: string) => el.shadowRoot.querySelector(`[data-test="course"][data-group-id="${id}"]`)!;
    expect(course('g1').querySelector('ok-inline-feedback[tone="danger"]'),
      'the failure is not shown in the course it happened in').toBeTruthy();
    expect(course('g2').querySelector('ok-inline-feedback[tone="danger"]'),
      'an untouched course is painted as failing too').toBeNull();
  });

  it('a refusal does not survive leaving the menu and coming back', async () => {
    const el = await mount();
    await openMenu(el);
    (at(el, 'option-picker') as HTMLElement)
      .dispatchEvent(new CustomEvent('ok-change', { detail: { value: 'product:p1' } }));
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);
    expect(at(el, 'option-blocked-reason'), 'the refusal was not shown in the first place').toBeTruthy();

    at(el, 'back-to-menus')!.click();
    await settle(el);
    await openMenu(el);
    expect(at(el, 'option-blocked-reason'),
      'the old refusal is painted again on a menu where nothing was refused').toBeNull();
    // The half-typed draft belongs to the same abandoned attempt.
    expect((at(el, 'option-picker') as unknown as { value: string }).value,
      'the article picked in the abandoned attempt is still selected').toBe('');
  });

  it('editing a choice into ITSELF is not a duplicate', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    expect(at(el, 'save-option')!.getAttribute('aria-disabled'),
      'the choice being edited is counted as its own duplicate').toBe('false');
  });

  // The order of the choices is the order the till offers them in, exactly like the courses. It is
  // arrows and not drag & drop for the same reason it is arrows there: a tablet, a finger, and a
  // list that must not reorder itself by accident.
  it('the choices of a course are reordered with arrows, writing nothing but their positions', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o3', 'choice-up')!.click();
    await settle(el);

    expect(choiceOrder(el), 'the arrow did not move the choice').toEqual(['o1', 'o3', 'o2']);
    const writes = commands.filter((c) => c.name.startsWith('combos.options.'));
    expect(writes.map((c) => c.name), 'reordering withdraws and re-adds instead of updating')
      .toEqual(['combos.options.update', 'combos.options.update']);
    expect(writes.map((c) => [c.payload.option_id, c.payload.sort_order]).sort(),
      'the two positions that swapped are not the ones written').toEqual([['o2', 2], ['o3', 1]]);
    expect(writes.every((c) => typeof c.payload.source_ref === 'string' && c.payload.source_ref !== ''),
      'the reorder update drops the reference, which `option_update.sql` would then blank').toBe(true);
  });

  it('the arrows at the ends are blocked and still answer, they are not natively disabled', async () => {
    const el = await mount();
    await openMenu(el);
    const first = inRow(el, 'o1', 'choice-up')!;
    const last = inRow(el, 'o3', 'choice-down')!;
    expect(first.getAttribute('aria-disabled'), 'the first choice can be moved further up').toBe('true');
    expect(first.hasAttribute('disabled'), 'native `disabled` swallows the tap').toBe(false);
    expect(last.getAttribute('aria-disabled'), 'the last choice can be moved further down').toBe('true');
    expect(inRow(el, 'o2', 'choice-up')!.getAttribute('aria-disabled'), 'a middle choice cannot be moved').toBe('false');
    first.click();
    await settle(el);
    expect(commands.filter((c) => c.name.startsWith('combos.options.')), 'a blocked arrow wrote anyway').toEqual([]);
    // Not writing is only half of it: a blocked arrow must be a NO-OP, not a swallowed crash that
    // paints a failure the operator did not cause.
    expect(choiceOrder(el), 'a blocked arrow moved something').toEqual(['o1', 'o2', 'o3']);
    expect(el.shadowRoot.querySelector('ok-inline-feedback[tone="danger"]'),
      'a blocked arrow reported a failure at the operator').toBeNull();
  });

  it('without the manage permission there is no edit and no arrow, only what can be read', async () => {
    (globalThis as Record<string, any>).erplora.hasPermission = (p: string) => p !== 'combos.manage_combo';
    const el = await mount();
    await openMenu(el);
    expect(choiceOrder(el), 'a read-only user cannot see the choices at all').toEqual(['o1', 'o2', 'o3']);
    expect(inRow(el, 'o1', 'edit-choice'), 'a read-only user is offered an edit control').toBeNull();
    expect(inRow(el, 'o1', 'choice-up'), 'a read-only user is offered a reorder arrow').toBeNull();
    expect(inRow(el, 'o1', 'delete-choice'), 'a read-only user is offered a withdraw control').toBeNull();
  });

  it('a failed edit is SAID and the screen goes back to the truth on the server', async () => {
    const el = await mount();
    await openMenu(el);
    inRow(el, 'o1', 'edit-choice')!.click();
    await settle(el);
    (globalThis as Record<string, any>).erplora.command = async () => { throw new Error(''); };
    type(el, 'option-delta', '1,00');
    await settle(el);
    at(el, 'save-option')!.click();
    await settle(el);

    expect(el.shadowRoot.querySelector('ok-inline-feedback[tone="danger"]'),
      'the edit failed in silence and the screen looks saved').toBeTruthy();
    expect(translated, 'a rejection with no sentence of its own is shown raw').toContain('ui.errSaveOption');
    expect(options.find((o) => o.option_id === 'o1')!.price_delta,
      'the screen reported a failure but wrote anyway').toBe(0);
  });
});

// ── 9 · Every control of the builder is a target a FINGER can hit (combos#4) ──────────────────
//
// Measured on origin/main@9a84fed in Chromium, on the built bundle, with Ionic in `ios` (the mode
// the shell pins, ADR-0143), at 390×844, 820×1180 and 1440×900: the six icon-only controls of the
// builder were **28,1 × 28,1 px** in all three, with 5,6 px between neighbours — centres 33,7 px
// apart, four of them in a row, and the last one is Retirar. A mis-tap there is not "nothing
// happens": it withdraws the choice next to the one that was aimed at.
//
// 44 is the floor: Apple HIG and WCAG 2.1 SC 2.5.5 (AAA) both put it there, Material puts it at
// 48, and the rest of ERPlora already settled on 44 with tests behind it — `ok-data-table` pins
// `.actions ion-button { min-width: 44px; min-height: 44px }` for the row actions of the list half
// of this very screen, and invoice, cash_register, kitchen, customers, appointments and
// reservations pin the same 44 on their own buttons.
//
// 🔴 IT IS PINNED FOR THE WHOLE SCREEN, NOT FOR THE ROW. The rule these tests exist to hold is
// that there is ONE height: the arrows of a course sit in the same card head as its Editar and
// Retirar, and the supplement form sits in the same card as the rows. Fixing only the choice
// controls is how a card ends up with two sizes, which is worse than the small size it replaced.
//
// happy-dom does no layout, so the pixels are not measured here — the CONTRACT that produces them
// is: the controls declare the shared class, and the stylesheet pins that class at 44. The
// measurement itself is redone in a real browser and written into the PR.

/** The `min-*` a rule pins for `sel`, in px, or null when the rule does not pin it. */
function pinnedPx(css: string, sel: string, prop: 'min-width' | 'min-height'): number | null {
  // The declaration block of the rule, taken from the component's own stylesheet.
  const rule = new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`).exec(css);
  if (!rule) return null;
  const decl = new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([0-9.]+)px`).exec(rule[1]);
  return decl ? Number(decl[1]) : null;
}

const styleSheet = (el: Mounted): string => {
  const ctor = el.constructor as unknown as { styles: { cssText: string } | { cssText: string }[] };
  const s = ctor.styles;
  return Array.isArray(s) ? s.map((x) => x.cssText).join('\n') : s.cssText;
};

describe('every control of the builder is a target a finger can hit', () => {
  /** The icon-only controls: no label to widen them, so they are the ones that collapse to 28. */
  const ICON_ONLY = ['course-up', 'course-down', 'choice-up', 'choice-down', 'edit-choice', 'delete-choice'];
  /** Controls WITH a label that share a row with the icon-only ones. Same row, same height. */
  const LABELLED = ['edit-course', 'delete-course', 'back-to-menus', 'save-option'];

  beforeEach(() => {
    threeChoices();
    persistChoices();
  });

  it('the icon-only controls all declare the same touch-target class', async () => {
    const el = await mount();
    await openMenu(el);
    for (const test of ICON_ONLY) {
      const btn = el.shadowRoot.querySelector(`[data-test="${test}"]`);
      expect(btn, `\`${test}\` is not painted: the bench does not cover it`).toBeTruthy();
      expect(btn!.classList.contains('icon-btn'),
        `\`${test}\` does not carry the touch-target class: it keeps whatever size Ionic gives it`)
        .toBe(true);
    }
  });

  it('that class is pinned at 44×44 in the stylesheet, floor of Apple HIG and WCAG 2.5.5', async () => {
    const css = styleSheet(await mount());
    expect(pinnedPx(css, '.icon-btn', 'min-width'),
      '`.icon-btn` does not pin a min-width: an icon-only ion-button collapses to 28 px')
      .toBeGreaterThanOrEqual(44);
    expect(pinnedPx(css, '.icon-btn', 'min-height'),
      '`.icon-btn` does not pin a min-height: an icon-only ion-button collapses to 28 px')
      .toBeGreaterThanOrEqual(44);
  });

  it('the labelled controls of the same rows get the same height: one card, one size', async () => {
    const el = await mount();
    await openMenu(el);
    const css = styleSheet(el);
    expect(pinnedPx(css, 'ion-button', 'min-height'),
      'the height is pinned per control instead of for the screen: the card ends up with two sizes')
      .toBeGreaterThanOrEqual(44);
    for (const test of LABELLED) {
      expect(el.shadowRoot.querySelector(`[data-test="${test}"]`),
        `\`${test}\` is not painted: the bench does not cover the row it shares`).toBeTruthy();
    }
  });

  it('the height survives Ionic: it is set on the host AND on the ion-button variable', async () => {
    // `min-height` on the host alone is not enough on every Ionic control: the inner
    // `.button-native` is what is actually tapped, and it follows `--min-height`. Both are pinned
    // so the target is the box the finger lands on, not only the box the layout reserves.
    const css = styleSheet(await mount());
    expect(/--min-height:\s*44px/.test(css),
      'only the host is pinned: the inner button Ionic actually paints can stay smaller').toBe(true);
  });
});
