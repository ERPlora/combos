import { LitElement, html, css, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { define } from '@erplora/outfitkit/define';
import '@erplora/outfitkit/ok-data-table';
import '@erplora/outfitkit/ok-inline-feedback';
import '@erplora/outfitkit/ok-combo';
import type { DataTableColumn, DataTableAction } from '@erplora/outfitkit';
import { createListController, dataTableLabels } from '@erplora/module-sdk';
import { formatMoneyInput, normaliseMoneyInput, parseMoneyInput } from '@erplora/module-toolkit/money-input';
import type { ListController, ListClient, ListParams, ListPage } from '@erplora/module-sdk';
import esLocale from '../../../locales/es.json';
import enLocale from '../../../locales/en.json';

const CATALOG: Record<string, unknown> = { es: esLocale, en: enLocale };

// The screen a business builds a "menu del dia" with (pm#157, ADR-0381).
//
// TWO LEVELS, ONE NAVIGATION ENTRY. The list of menus is the door; clicking a row opens the
// BUILDER of that menu. A combo is an ARTICLE of the catalogue, not a setting, so it is opened
// from its own record — the same shape Odoo, Square, Toast and WooCommerce give it.
//
// This module owns the compound article and NOTHING else. It has `depends_on: []` and must keep
// it: the components are opaque references (`source` + `source_ref`), and the catalogues that
// resolve them are read through `queryOptional` (ADR-0127), which answers `undefined` when the
// owner module is not installed. A salon pack is made of `services`, and `services` does not
// depend on `inventory` — hanging this off the product catalogue would force a salon to install
// the product module to sell a package.

interface ErploraClientLike extends ListClient {
  query<T = unknown>(name: string, params?: Record<string, unknown>): Promise<T>;
  queryOptional<T = unknown>(name: string, params?: Record<string, unknown>): Promise<T | undefined>;
  queryPage<R = unknown>(name: string, params: ListParams): Promise<ListPage<R>>;
  command<T = unknown>(name: string, payload?: Record<string, unknown>): Promise<T>;
  on(event: string, cb: (payload: unknown) => void): () => void;
  hasPermission?(permission: string): boolean;
  formatMoney(minor: number): string;
  currency?: string;
  currencyDecimals?: number;
  locale: string;
  t(catalog: Record<string, unknown>, key: string, params?: Record<string, unknown>): string;
}

interface Combo {
  id: string; name: string; kitchen_name: string; price: number;
  tax_category_key: string; supply_kind: string; is_active: number; sort_order: number;
}

interface Course {
  group_id: string; combo_id: string; name: string;
  min_choices: number; max_choices: number; allow_repeat: number; sort_order: number;
}

interface Choice {
  option_id: string; group_id: string; source: string; source_ref: string;
  price_delta: number; sort_order: number;
}

/** An article of somebody else's catalogue, flattened for the picker. */
interface Article { value: string; label: string }

interface TaxCategory { key: string; display_name: string }

function erplora(): ErploraClientLike {
  const c = (globalThis as { erplora?: ErploraClientLike }).erplora;
  if (!c) throw new Error('erplora SDK not initialised by the shell');
  return c;
}

const can = (permission: string): boolean => erplora().hasPermission?.(permission) ?? true;

const t = (key: string, params?: Record<string, unknown>): string => erplora().t(CATALOG, key, params);

/** Decimals of the hub currency. NOT a hardcoded 2: in JPY they are 0 and `*100` overcharges 100x. */
const decimals = (): number => erplora().currencyDecimals ?? 2;

/**
 * Which money field an amount was typed into. The SIGN is the only thing this module decides on
 * top of the shared reading: a menu price is never negative (CHECK price >= 0 in 001_init.sql,
 * `minimum: 0` in its schemas), a supplement may be — a cheaper substitution is a real menu.
 */
type AmountField = 'price' | 'supplement';

/** What a typed amount turned out to be — or the i18n key (and its words) of why it cannot be used. */
type Amount = { ok: true; minor: number } | { ok: false; key: string; params?: Record<string, unknown> };

/**
 * A typed amount → minor units of the hub currency (combos#3, pm#521).
 *
 * The READING is the toolkit's (`@erplora/module-toolkit/money-input`): combos#7 wrote it here
 * first, from the market (12+ references and their forums, combos#3), and combos#9 moved it out so
 * every module reads money the same way. Both separators; the hub currency, spaces and NBSP / NNBSP
 * cleaned away; letters glued to the figure, accounting brackets, a minus behind the digits or
 * another currency refused; and a lone separator followed by three digits (`1.250`: 1250 or 1,25,
 * 1000x apart) refused with BOTH readings instead of guessed.
 *
 * What stays here is what only this module knows:
 *
 *  * an EMPTY field is 0 — the price and the supplement are `NOT NULL DEFAULT 0`, and nothing
 *    typed means nothing charged on top;
 *  * a negative PRICE is refused in words here, before the server answers with a raw schema
 *    detail; a negative SUPPLEMENT keeps its sign.
 */
function readAmount(typed: unknown, field: AmountField): Amount {
  const c = erplora();
  const d = decimals();
  const raw = String(typed ?? '');
  const read = parseMoneyInput(raw, d, { currency: c.currency || undefined, locale: c.locale });
  if (read.ok) {
    const minor = read.minor ?? 0;
    if (minor < 0 && field === 'price') return { ok: false, key: 'ui.errNegativePrice' };
    return { ok: true, minor };
  }
  if (read.code === 'ambiguous_amount') {
    // What they actually wrote and THE TWO READINGS OF IT, in the hub's locale, so the person can
    // copy the one they meant straight back into the field. Not a canned example: quoting
    // somebody else's number reads like a bug and teaches nothing.
    return {
      ok: false,
      key: 'ui.errAmbiguousAmount',
      params: {
        typed: raw.trim(),
        grouped: formatMoneyInput(read.readings.grouped, d, c.locale),
        decimal: formatMoneyInput(read.readings.decimal, d, c.locale),
      },
    };
  }
  return { ok: false, key: 'ui.errNotAnAmount' };
}

/** The amount — for the callers that have already checked it can be used. */
function amountToMinor(typed: unknown, field: AmountField): number {
  const read = readAmount(typed, field);
  return read.ok ? read.minor : 0;
}

/** Why this typed amount cannot be used, as an i18n key — or '' when it can. */
function amountBlockedKey(typed: unknown, field: AmountField): string {
  const read = readAmount(typed, field);
  return read.ok ? '' : read.key;
}

/** The words the refusal of this typed amount is built from (none when it can be used). */
function amountReadings(typed: unknown, field: AmountField): Record<string, unknown> {
  const read = readAmount(typed, field);
  return read.ok ? {} : read.params ?? {};
}

/**
 * MINOR units → what a human types into the field, in the HUB's locale and the CURRENCY's
 * decimals: 1350 → «13,50» in es, «13.50» in en. Two rules, both load-bearing:
 *
 *  * the decimals come from the currency, so the field never shows a different scale than the
 *    money it edits (in JPY there are none, and 1999 is 1999 yen);
 *  * NO GROUPING. `1.250,50` inside an editable field is the single cause of the x10 Business
 *    Central had to fix for Spain and of the field Odoo blanked (odoo#19357), and a field whose
 *    own output does not survive being read back is broken by design. Grouping belongs on the
 *    READ-ONLY surfaces, which is where hub#1090 put it.
 */
const minorToInput = (minor: number): string => formatMoneyInput(minor, decimals(), erplora().locale);

/**
 * What the field should show once the person leaves it. Unreadable input is left EXACTLY as typed:
 * rewriting it would either throw away what they wrote or pick one of the two readings of an
 * ambiguous amount, which is the guess this whole section exists to avoid.
 */
function normaliseOnBlur(typed: string): string {
  const c = erplora();
  return normaliseMoneyInput(typed, decimals(), c.locale, c.currency || undefined);
}

/** The two catalogues a combo component can come from, each with the module that owns it. */
const CATALOGUES = [
  { source: 'product', query: 'inventory.products.list', moduleKey: 'ui.moduleInventory' },
  { source: 'service', query: 'services.services.list', moduleKey: 'ui.moduleServices' },
] as const;

/** A row of a reorderable list, as it was measured when the drag started. */
interface Slot { top: number; height: number }

/** `list` with the row at `from` taken out and put back in at `to`. */
function moved<T>(list: T[], from: number, to: number): T[] {
  const out = [...list];
  const [row] = out.splice(from, 1);
  out.splice(to, 0, row);
  return out;
}

/**
 * Which slot a dragged row lands on when the pointer is at `y` — the whole arithmetic of the drag,
 * kept pure so it can be proven without a browser.
 *
 * `slots` are the row boxes measured ONCE, when the drag started. That is deliberate: while the
 * finger is down the rows are reordered live for feedback, so re-measuring them mid-gesture would
 * chase a moving target and make the list flicker between two positions. The boxes describe the
 * SLOTS, which do not move; only what sits in them does.
 *
 * The pointer belongs to the first slot whose middle it has not passed yet, which is the standard
 * insertion-point reading (Shopify, Odoo, Ionic's own reorder all behave this way): halfway down a
 * row is where it takes the place of that row. Above the list it lands first, below it lands last.
 */
export function dropIndexAt(y: number, slots: Slot[], from: number): number {
  if (slots.length === 0) return from;
  for (let i = 0; i < slots.length; i += 1) {
    if (y <= slots[i].top + slots[i].height / 2) return i;
  }
  return slots.length - 1;
}

/** A business rejection (hub#139) carries a stable `code`: translate it through `errors.<code>`. */
function domainErrorText(e: unknown, fallbackKey: string): string {
  const code = (e as { code?: unknown } | null)?.code;
  const message = e instanceof Error ? e.message : '';
  if (typeof code === 'string' && code.startsWith('combos.')) {
    const key = `errors.${code}`;
    const text = t(key, { message });
    if (text !== key) return text;
  }
  return message || t(fallbackKey);
}

export class ErpCombosMenus extends LitElement {
  static styles = css`
    :host { display:flex; flex-direction:column; height:100%; min-height:0; font-family: system-ui, sans-serif; color: var(--ion-text-color, #1c1b18); }
    .page { display:flex; flex-direction:column; min-height:0; flex:1 1 auto; }
    .page > ok-data-table { flex:1 1 auto; min-height:0; }

    /* The builder scrolls on its own so the menu header stays put on a phone. */
    .builder { display:flex; flex-direction:column; min-height:0; flex:1 1 auto; gap:.75rem; }
    .builder-body { overflow-y:auto; min-height:0; flex:1 1 auto; display:flex; flex-direction:column; gap:.75rem; padding-bottom:1rem; }

    .menu-head { display:flex; flex-wrap:wrap; align-items:center; gap:.5rem .75rem; flex:0 0 auto; }
    .menu-head .name { font-size:1.05rem; font-weight:600; }
    .menu-head .price { font-variant-numeric: tabular-nums; font-weight:600; }

    .card { border:1px solid var(--ion-border-color, #e7e2d6); border-radius: var(--ok-radius-sm, 10px); padding:.75rem 1rem; background: var(--ok-surface-2, var(--ion-color-step-50, rgba(var(--ion-text-color-rgb, 24,24,27), .04))); }
    .card-head { display:flex; flex-wrap:wrap; gap:.5rem; align-items:baseline; }
    .card-head .title { font-weight:600; flex:1 1 auto; }

    /* The rule the till will apply, stated where the course is built. */
    .rule { font-size:.85rem; opacity:.8; }
    [data-required='true'] .badge { background: color-mix(in srgb, var(--ion-color-warning, #ffc409) 22%, transparent); }
    .badge { display:inline-block; border-radius:999px; padding:.1rem .55rem; font-size:.78rem; background: color-mix(in srgb, var(--ion-text-color, #1c1b18) 8%, transparent); }

    .choices { list-style:none; margin:.6rem 0 0; padding:0; display:flex; flex-direction:column; gap:.3rem; }
    /* Wraps on purpose. Four 44 px targets are 64 px wider per row than four 28 px ones, and
       measured at 390x844 a long article name plus a supplement pushed Retirar PAST the right
       edge of its own row -- cut off, with the page not even scrolling sideways to reveal it.
       Growing a touch target until it leaves the card is not a fix, so on a narrow screen the
       actions drop to their own line at full size. */
    .choices li { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; font-size:.92rem; }
    .choices .name { flex:1 1 8rem; min-width:0; overflow-wrap:anywhere; }
    .choices .delta { margin-left:auto; font-variant-numeric: tabular-nums; }
    /* Pushed to the end of the row, and to the same place whether or not there is a supplement.
       The flex:0 0 auto is load-bearing: a 44 px target that is allowed to shrink is not a 44 px
       target any more, it just fails more quietly.
       (No backticks in this comment -- it lives inside the css tagged template and one would
       CLOSE it, which is exactly how this edit broke the whole component once.) */
    .choices .row-actions { flex:0 0 auto; margin-left:auto; display:flex; align-items:center; gap:.1rem; }
    .choices .delta + .row-actions { margin-left:.5rem; }

    .form { display:flex; flex-direction:column; gap:.7rem; }
    /* Wide enough to breathe on a tablet, single column on a phone. */
    .row { display:flex; flex-wrap:wrap; gap:.6rem; align-items:flex-end; }
    .row > * { flex:1 1 12rem; min-width:0; }
    .help { font-size:.82rem; opacity:.75; margin:0; }
    .help[data-active='false'] { opacity:.5; }
    .help[data-active='true'] { opacity:1; font-weight:500; }

    /*
     * A BLOCKED BUTTON IS NOT NATIVELY DISABLED. Ionic implements the native disabled state as
     * pointer-events:none, so it swallows the tap and leaves the reason in a title attribute
     * nobody reads on a tablet. The button here stays tappable, is announced with aria-disabled,
     * and the tap ANSWERS with the reason in words.
     *
     * The styling hook is data-blocked, NOT an [aria-disabled] selector: Ionic relocates aria-*
     * onto its inner button element, so a selector on the host would never match and this rule
     * would silently do nothing.
     *
     * (No backticks anywhere in this comment, on purpose: it lives inside the css tagged
     * template, so a backtick here would CLOSE that template and break the whole component at
     * parse time. Same trap applies to the HTML comments inside the render templates.)
     */
    [data-blocked='true'] { opacity:.55; }

    /*
     * THE COLOUR OF A BUTTON COMES FROM THESE VARS, NEVER FROM ion-button's color ATTRIBUTE.
     * Measured in Chromium on the real bundle: inside this shadow root a color attribute leaves
     * the background at rgba(0,0,0,0) and the text at rgb(255,255,255) -- white on white, which
     * swallowed Guardar and Anadir eleccion. Ionic paints that attribute through .ion-color-*
     * classes defined in the HOST document, and those never cross a shadow boundary. Custom
     * properties do, so the tone is applied here and hooked on data-tone.
     */
    ion-button[data-tone='primary'] {
      --background: var(--ion-color-primary, #0054e9);
      --color: var(--ion-color-primary-contrast, #fff);
    }
    ion-button[data-tone='danger'] {
      --background: var(--ion-color-danger, #c5000f);
      --color: var(--ion-color-danger-contrast, #fff);
    }
    /*
     * ONE TOUCH TARGET SIZE FOR THE WHOLE BUILDER, NOT ONE PER ROW (combos#4).
     * Measured on the built bundle in Chromium with Ionic in ios (the mode the shell pins,
     * ADR-0143), at 390x844, 820x1180 and 1440x900: an icon-only ion-button size=small came out
     * 28,1 x 28,1 px in all three, with 5,6 px between neighbours -- centres 33,7 px apart, four
     * of them in a row, and the last one is Retirar. A mis-tap there withdraws the choice next to
     * the one that was aimed at.
     *
     * 44 is the floor Apple HIG and WCAG 2.1 SC 2.5.5 (AAA) both put it at, and it is what the
     * rest of ERPlora already settled on with tests behind it: ok-data-table pins 44 for the row
     * actions of the list half of THIS screen, and invoice, cash_register, kitchen, customers,
     * appointments and reservations pin the same 44.
     *
     * Pinned for every ion-button of the component, not only the icon-only ones: the arrows of a
     * course share a card head with its Editar and Retirar, so sizing one and not the other is
     * how a card ends up with two heights -- worse than the small size it replaced.
     *
     * --min-height as well as min-height on purpose: min-height on the host reserves the box, but
     * what the finger actually lands on is the .button-native Ionic paints inside, and that one
     * follows the custom property.
     */
    ion-button { min-height:44px; --min-height:44px; }
    /* No label to widen them, so these are the ones that collapse. Square, and padding-free so
       the icon keeps the middle. */
    .icon-btn { min-width:44px; min-height:44px; --min-height:44px; --padding-start:0; --padding-end:0; }

    /*
     * THE DRAG HANDLE, AND THE ONE LINE THAT MAKES THE GESTURE POSSIBLE (combos#6).
     *
     * A drag on a touch screen competes with the browser's own scroll, and the ONLY thing that
     * settles it is touch-action. preventDefault() on pointerdown does not: by the time it runs the
     * browser has already decided the gesture is a scroll.
     *
     * It is pinned on the HANDLE and nowhere else, in both places it has to be pinned:
     *
     *  * on the host, and
     *  * on ::part(native) -- touch-action is NOT inherited, and what the finger actually lands on
     *    is the button Ionic paints inside its own shadow root. Pinning only the host leaves the
     *    page scrolling under a handle that looks draggable and is not.
     *
     * And nowhere else ON PURPOSE. touch-action:none on the row, the card or the scrolling body
     * would kill the page scroll on a tablet, which is a far worse defect than the one this fixes.
     * The rest of the row keeps its normal behaviour, so the list still scrolls under a finger that
     * does not start on the handle.
     */
    .drag-handle { touch-action:none; cursor:grab; }
    .drag-handle::part(native) { touch-action:none; }
    /* The row that is being carried, so the finger can see what it picked up. */
    [data-dragging='true'] { opacity:.6; }
    [data-dragging='true'] .drag-handle { cursor:grabbing; }

    .reason { color: var(--ion-color-danger, #d9480f); font-size:.85rem; margin:.2rem 0 0; }
    .muted { opacity:.75; font-size:.9rem; }
  `;

  // ── The open menu (null = the list) ────────────────────────────────────────────────────────
  @state() private openCombo: Combo | null = null;

  // ── Combo form (lives in the data-table `create` panel, always projected) ───────────────────
  @state() private editing: Combo | null = null;
  /** pm#450: whether the table's panel HEADER already carries the editing title (OutfitKit
   *  ≥ 0.1.94, outfitkit#150). Set only after checking the rendered dialog — never assumed — so
   *  an older shell (hub:stable ships 0.1.73, which ignores the `title` and keeps «New») still
   *  gets the fallback title in the form body. */
  @state() private editTitleInHeader = false;
  @state() private fName = '';
  @state() private fKitchenName = '';
  @state() private fPrice = '';
  @state() private fTaxCategory = '';
  @state() private fSupplyKind = 'service';
  @state() private fActive = true;
  @state() private fSortOrder = '0';
  @state() private comboReason = '';
  @state() private comboError = '';

  // ── Courses of the open menu ───────────────────────────────────────────────────────────────
  @state() private courses: Course[] = [];
  @state() private coursesLoading = false;
  @state() private coursesError = '';
  @state() private choices: Record<string, Choice[]> = {};

  // ── Course form ────────────────────────────────────────────────────────────────────────────
  @state() private editingCourse: Course | null = null;
  @state() private cName = '';
  @state() private cMin = '1';
  @state() private cMax = '1';
  @state() private cRepeat = false;
  @state() private courseReason = '';
  @state() private courseError = '';

  // ── Choice drafts, one per course ──────────────────────────────────────────────────────────
  @state() private optionDraft: Record<string, { ref: string; delta: string }> = {};
  /** The choice whose row is open in the form. `null` = the form adds a new one. */
  @state() private editingChoice: Choice | null = null;
  /**
   * The course the reason/failure below belongs to. Measured in Chromium at 390x844: painted once
   * at the foot of the builder, the sentence explaining a refusal lands two screens under the
   * button that was just tapped, which is the `title` attribute problem in another shape. A
   * message about one course is painted IN that course.
   */
  @state() private optionScope = '';
  @state() private optionReason = '';
  @state() private optionError = '';

  // ── Bulk add of articles (combos#6) ─────────────────────────────────────────────────────────
  /** The course whose bulk picker is open. `''` = the picker is closed. */
  @state() private bulkFor = '';
  @state() private bulkQuery = '';
  /** The opaque references ticked in the picker, in the order they were ticked. */
  @state() private bulkPicked: string[] = [];
  @state() private bulkReason = '';

  // ── Foreign catalogues (OPTIONAL: the owner module may not be installed) ────────────────────
  @state() private articles: Article[] = [];
  /** i18n keys of the modules that are NOT installed, so their absence can be SAID. */
  @state() private missingCatalogues: string[] = [];
  /** A catalogue that BROKE — not the same thing as one that is absent, and never silent. */
  @state() private catalogueError = '';
  @state() private taxCategories: TaxCategory[] = [];
  @state() private taxCategoriesError = '';

  @state() private saving = false;

  /**
   * The drag in flight, or null. `at` is where the row currently sits on screen (the list is
   * reordered live, so the finger carries something), `from` is where it started, and `original`
   * is what the screen has to go back to if the gesture is cancelled.
   */
  private drag:
    | { kind: 'course'; from: number; at: number; slots: Slot[]; original: Course[] }
    | { kind: 'choice'; groupId: string; from: number; at: number; slots: Slot[]; original: Choice[] }
    | null = null;

  private ctrl!: ListController<Combo>;

  private readonly onLocaleChange = (): void => this.requestUpdate();

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    window.addEventListener('erplora:locale-changed', this.onLocaleChange);
    this.ctrl = createListController<Combo>(erplora(), 'combos.combos.list', () => this.requestUpdate(), {
      pageSize: 50, sort: 'sort_order', dir: 'asc',
    });
    await Promise.all([this.ctrl.load(), this.loadCatalogues(), this.loadTaxCategories()]);
  }

  disconnectedCallback(): void {
    window.removeEventListener('erplora:locale-changed', this.onLocaleChange);
    // A drag holds three listeners on `window`. Leaving the view mid-gesture (a hub navigation, a
    // module reload) would leave them pointing at a detached component for the rest of the session.
    this.endDrag();
    super.disconnectedCallback();
  }

  /** Wired natively on the shadow root, not with a Lit `@click` on the tag: `<ok-data-table>`
   *  carries `testid`, not `data-testid` (outfitkit#143), and it is re-created each time the user
   *  comes back from a menu builder, which a listener on the first table would not survive. */
  firstUpdated(): void {
    this.renderRoot.addEventListener('click', (e) => this.onTableClick(e));
  }

  /** pm#450: the table's «Add» emits no event and keeps our form state; after an edit it would
   *  show the edited menu under a «New» header, and the submit would UPDATE it. */
  private onTableClick(e: Event): void {
    if (!this.editing) return;
    const addId = 'combos-table-add';
    if (e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.testid === addId)) this.resetComboForm();
  }

  // ── Reordering by dragging, which never replaces the arrows (combos#6) ──────────────────────
  //
  // WCAG 2.2 SC 2.5.7 is literal: every function that uses a dragging movement has to be reachable
  // without dragging, and reordering by drag alone is failure F108 by name — with technique G219
  // blessing step-wise arrows as the answer. Its note is the one that matters here: «this
  // requirement is separate from keyboard accessibility because people using a touchscreen device
  // may not use a physical keyboard». Our users are on a tablet, so the keyboard is no defence.
  //
  // The handle is what every verified product ships as the affordance — Lightspeed K-Series (equal
  // sign), Square, Toast (six dots), Odoo (`widget="handle"`), and Shopify sends both. So: handle
  // AND arrows, and both end in exactly the same write.
  //
  // Ionic's own `ion-reorder-group` was the first thing looked at, and it is NOT usable from here:
  // the shell registers a fixed list of `ion-*` custom elements (`hub/apps/web/src/lib/ionic-wc.ts`)
  // and reorder is not in it, so the element would render as an inert unknown tag — no error, no
  // behaviour. That is the hub#1129 trap, and a module cannot fix it in its own repository.

  /** The rows a drag of `kind` can land between, in the order they are painted. */
  private dragRows(kind: 'course' | 'choice', groupId: string): HTMLElement[] {
    const selector = kind === 'course'
      ? 'section[data-testid^="combos-course-row-"]'
      : `[data-testid="combos-course-row-${groupId}"] li[data-testid^="combos-choice-row-"]`;
    return [...this.renderRoot.querySelectorAll(selector)] as HTMLElement[];
  }

  /** Picks a row up. `id` is the `group_id` of a course or the `option_id` of a choice. */
  private beginDrag(e: PointerEvent, kind: 'course' | 'choice', groupId: string, id: string): void {
    if (!can('combos.manage_combo') || this.drag) return;
    const list = kind === 'course' ? this.courses : (this.choices[groupId] ?? []);
    const from = kind === 'course'
      ? this.courses.findIndex((c) => c.group_id === id)
      : (this.choices[groupId] ?? []).findIndex((o) => o.option_id === id);
    // A single row has nowhere to go, and starting a drag there would only steal the page scroll.
    if (from < 0 || list.length < 2) return;
    const slots = this.dragRows(kind, groupId).map((row) => {
      const box = row.getBoundingClientRect();
      return { top: box.top, height: box.height };
    });
    e.preventDefault();
    // Optional on purpose: it is what keeps the events coming when the finger leaves the handle in
    // a browser, and it does not exist in every DOM this component is tested in. The listeners
    // below are on `window`, so the gesture works either way.
    (e.currentTarget as Element & { setPointerCapture?: (id: number) => void })
      .setPointerCapture?.(e.pointerId);
    this.drag = kind === 'course'
      ? { kind, from, at: from, slots, original: this.courses }
      : { kind, groupId, from, at: from, slots, original: this.choices[groupId] ?? [] };
    window.addEventListener('pointermove', this.onDragMove);
    window.addEventListener('pointerup', this.onDragEnd);
    window.addEventListener('pointercancel', this.onDragCancel);
    this.requestUpdate();
  }

  /** Carries the row with the finger: the list is reordered on screen, nothing is written yet. */
  private readonly onDragMove = (e: Event): void => {
    const drag = this.drag;
    if (!drag) return;
    const to = dropIndexAt((e as PointerEvent).clientY, drag.slots, drag.from);
    if (to === drag.at) return;
    if (drag.kind === 'course') this.courses = moved(this.courses, drag.at, to);
    else this.choices = { ...this.choices, [drag.groupId]: moved(this.choices[drag.groupId] ?? [], drag.at, to) };
    drag.at = to;
  };

  /** Drops the row. Only a drop that actually moved something writes. */
  private readonly onDragEnd = (): void => {
    const drag = this.drag;
    this.endDrag();
    if (!drag || drag.at === drag.from) return;
    const lo = Math.min(drag.from, drag.at);
    const hi = Math.max(drag.from, drag.at);
    if (drag.kind === 'course') void this.persistCourseOrder(lo, hi);
    else void this.persistChoiceOrder(drag.groupId, lo, hi);
  };

  /** The gesture was taken away (a call, a system sheet): the screen goes back to what it was. */
  private readonly onDragCancel = (): void => {
    const drag = this.drag;
    this.endDrag();
    if (!drag) return;
    if (drag.kind === 'course') this.courses = drag.original;
    else this.choices = { ...this.choices, [drag.groupId]: drag.original };
  };

  private endDrag(): void {
    window.removeEventListener('pointermove', this.onDragMove);
    window.removeEventListener('pointerup', this.onDragEnd);
    window.removeEventListener('pointercancel', this.onDragCancel);
    this.drag = null;
    this.requestUpdate();
  }

  /** True while `id` is the row being carried, so the row can show it. */
  private isDragging(kind: 'course' | 'choice', index: number): boolean {
    return this.drag?.kind === kind && this.drag.at === index;
  }

  // ── Foreign reads ──────────────────────────────────────────────────────────────────────────

  /**
   * Both catalogues, through the OPTIONAL door. `queryOptional` answers `undefined` ONLY when the
   * owner module is absent (`module_not_installed` / `module_inactive`); a renamed query or a
   * denied permission still explodes, because those are broken contracts, not absences.
   *
   * `search` is passed straight through so the picker asks the SERVER on every keystroke instead
   * of filtering a first page of 50 in the browser: both catalogues paginate at 50, and a shop
   * with 200 articles would silently be unable to reach 150 of them (the hub#650 hole).
   */
  private async loadCatalogues(search = ''): Promise<void> {
    const found: Article[] = [];
    const missing: string[] = [];
    try {
      for (const cat of CATALOGUES) {
        const params = search ? { search, limit: 50 } : { limit: 50 };
        const rows =
          cat.source === 'product'
            ? await erplora().queryOptional<Record<string, unknown>[]>('inventory.products.list', params)
            : await erplora().queryOptional<Record<string, unknown>[]>('services.services.list', params);
        if (rows === undefined) {
          missing.push(cat.moduleKey);
          continue;
        }
        for (const r of rows ?? []) {
          found.push({ value: `${cat.source}:${String(r.id)}`, label: String(r.name ?? r.id) });
        }
      }
    } catch (e) {
      // A catalogue that BREAKS is not a catalogue that is ABSENT, and the difference is the whole
      // point: swallowed, both look like an empty picker, which reads as "you have no articles" and
      // sends the merchant off to create duplicates of what is already in the shop. `queryOptional`
      // already answers `undefined` for the absent module, so anything that reaches here is a real
      // failure and is SAID. The previous list is kept: half a catalogue is worse than the last
      // good one, because there is no way to tell which half is missing.
      this.catalogueError = domainErrorText(e, 'ui.errLoadCatalogue');
      return;
    }
    this.catalogueError = '';
    this.articles = found;
    this.missingCatalogues = missing;
  }

  /** The fiscal categories of the hub. `taxes` owns them, and it may not be installed either. */
  private async loadTaxCategories(): Promise<void> {
    try {
      const rows = await erplora().queryOptional<TaxCategory[]>('taxes.categories.list', { limit: 100 });
      this.taxCategories = rows ?? [];
      this.taxCategoriesError = '';
    } catch (e) {
      // Unhandled, this rejected the `Promise.all` of `connectedCallback` and the whole screen came
      // up blank with nothing but an unhandled rejection in a console nobody has open on a tablet.
      this.taxCategoriesError = domainErrorText(e, 'ui.errLoadTaxCategories');
      this.taxCategories = [];
    }
  }

  // ── The menu list ──────────────────────────────────────────────────────────────────────────

  private get columns(): DataTableColumn[] {
    return [
      { key: 'name', header: t('ui.colName'), sortable: true, filterable: true, filterType: 'text' },
      { key: 'price', header: t('ui.colPrice'), align: 'right', sortable: true, format: (r) => erplora().formatMoney(Number(r.price ?? 0)) },
      {
        key: 'supply_kind',
        header: t('ui.colSupply'),
        sortable: true,
        filterable: true,
        // Closed domain the server filters by `eq`: it is chosen, never typed.
        filterType: 'select',
        // The list READS the kind row after row, so it gets the short value ("Eat in" / "Take
        // away"); the long sentence that explains the consequence stays in the form (combos#25).
        options: [
          { value: 'service', label: t('ui.supplyServiceShort') },
          { value: 'goods', label: t('ui.supplyGoodsShort') },
        ],
        format: (r) => (r.supply_kind === 'goods' ? t('ui.supplyGoodsShort') : t('ui.supplyServiceShort')),
      },
      {
        key: 'is_active',
        header: t('ui.colActive'),
        sortable: true,
        filterable: true,
        filterType: 'select',
        options: [{ value: '1', label: t('ui.yes') }, { value: '0', label: t('ui.no') }],
        format: (r) => (r.is_active ? t('ui.yes') : t('ui.no')),
      },
      { key: 'sort_order', header: t('ui.colOrder'), align: 'right', sortable: true },
    ];
  }

  private get rowActions(): DataTableAction[] {
    if (!can('combos.manage_combo')) return [];
    return [
      { id: 'edit', label: t('ui.actionEdit'), icon: 'create-outline' },
      { id: 'delete', label: t('ui.actionDelete'), icon: 'trash-outline', color: 'danger' },
    ];
  }

  private dataTable(): {
    open(p?: 'filters' | 'create' | 'edit', opts?: { title?: string }): void;
    close(): void;
    updateComplete?: Promise<unknown>;
    shadowRoot: ShadowRoot | null;
  } | null {
    return this.renderRoot.querySelector('ok-data-table') as
      | {
          open(p?: 'filters' | 'create' | 'edit', opts?: { title?: string }): void;
          close(): void;
          updateComplete?: Promise<unknown>;
          shadowRoot: ShadowRoot | null;
        }
      | null;
  }

  // ── Opening a menu ─────────────────────────────────────────────────────────────────────────

  private async openBuilder(combo: Combo): Promise<void> {
    this.openCombo = combo;
    this.coursesLoading = true;
    this.coursesError = '';
    this.courses = [];
    this.choices = {};
    this.resetChoiceForm();
    this.resetCourseForm();
    await this.loadCourses();
  }

  private async loadCourses(): Promise<void> {
    const combo = this.openCombo;
    if (!combo) return;
    this.coursesLoading = true;
    this.coursesError = '';
    try {
      const rows = await erplora().query<Course[]>('combos.groups.list', { combo_id: combo.id });
      // The list arrives ordered by the query; sorting here keeps the builder honest even if a
      // caller ever hands it an unordered array. The order IS the order the till asks in.
      this.courses = [...(rows ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      const perCourse = await Promise.all(
        this.courses.map((c) => erplora().query<Choice[]>('combos.options.list', { group_id: c.group_id })),
      );
      const map: Record<string, Choice[]> = {};
      // Sorted here for the same reason the courses are: the order IS the order the till offers
      // them in, and the arrows below reorder an array, not a query.
      this.courses.forEach((c, i) => {
        map[c.group_id] = [...(perCourse[i] ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      });
      this.choices = map;
    } catch (e) {
      this.coursesError = domainErrorText(e, 'ui.errLoadCourses');
      this.courses = [];
    } finally {
      this.coursesLoading = false;
    }
  }

  private backToList(): void {
    this.openCombo = null;
    this.courses = [];
    this.choices = {};
    this.coursesError = '';
    // The picker belongs to a course of THIS menu. Left open, it would float over the menu list
    // pointing at a course that is no longer on screen.
    this.closeBulk();
  }

  // ── Combo form ─────────────────────────────────────────────────────────────────────────────

  private resetComboForm(): void {
    this.editing = null;
    this.fName = ''; this.fKitchenName = ''; this.fPrice = '';
    this.fTaxCategory = ''; this.fSupplyKind = 'service';
    this.fActive = true; this.fSortOrder = '0';
    this.comboReason = ''; this.comboError = '';
  }

  /**
   * pm#450: Cancel from an edit whose header carried the title. The header stays labelled for
   * the edit that is being abandoned, so re-opening the panel as `create` puts it back to «New»
   * — header and clean form agree again.
   */
  private cancelComboEdit(): void {
    this.resetComboForm();
    this.dataTable()?.open('create');
  }

  private async startEditCombo(combo: Combo): Promise<void> {
    if (!can('combos.manage_combo')) return;
    this.editing = combo;
    this.fName = combo.name;
    this.fKitchenName = combo.kitchen_name ?? '';
    this.fPrice = minorToInput(Number(combo.price ?? 0));
    this.fTaxCategory = combo.tax_category_key ?? '';
    this.fSupplyKind = combo.supply_kind || 'service';
    this.fActive = Boolean(combo.is_active);
    this.fSortOrder = String(combo.sort_order ?? 0);
    this.comboReason = ''; this.comboError = '';
    const title = t('ui.editMenuTitle', { name: combo.name });
    const table = this.dataTable();
    table?.open('edit', { title });
    await table?.updateComplete;
    // OutfitKit < 0.1.94 ignores the title and keeps «New»: only drop the in-form title when the
    // header REALLY carries it (the dialog is labelled with it).
    this.editTitleInHeader = table?.shadowRoot?.querySelector('[role="dialog"]')?.getAttribute('aria-label') === title;
  }

  /**
   * Why the combo cannot be saved yet, as an i18n key — or '' when it can.
   *
   * `ck_combos_combo_single_supply_has_a_rate` refuses a `service` combo with no rate of its own,
   * because it could not be billed at all. Reaching Postgres with it means showing the merchant a
   * constraint violation instead of a sentence.
   */
  private get comboBlockedKey(): string {
    if (!this.fName.trim()) return 'ui.errNoName';
    if (this.fSupplyKind === 'service' && !this.fTaxCategory.trim()) return 'ui.errNoTaxCategory';
    // An amount that cannot be read is REFUSED, never coerced to 0 (combos#3): a menu that saves
    // itself free because a paste was misread is the most expensive kind of silence there is.
    const price = amountBlockedKey(this.fPrice, 'price');
    if (price) return price;
    return '';
  }

  private async saveCombo(): Promise<void> {
    if (!can('combos.manage_combo')) return;
    const blocked = this.comboBlockedKey;
    if (blocked) {
      // The tap ANSWERS. This is the whole reason the button is not natively disabled.
      // `typed` is what they actually wrote: an unreadable amount is quoted back, because
      // "this is not an amount" without saying WHICH one is a dead end on a busy counter.
      this.comboReason = t(blocked, amountReadings(this.fPrice, 'price'));
      return;
    }
    this.saving = true;
    this.comboError = ''; this.comboReason = '';
    const payload = {
      name: this.fName.trim(),
      kitchen_name: this.fKitchenName.trim(),
      price: amountToMinor(this.fPrice, 'price'),
      tax_category_key: this.fTaxCategory.trim(),
      supply_kind: this.fSupplyKind,
      is_active: this.fActive ? 1 : 0,
      sort_order: Number(this.fSortOrder) || 0,
    };
    try {
      if (this.editing) await erplora().command('combos.combos.update', { combo_id: this.editing.id, ...payload });
      else await erplora().command('combos.combos.create', payload);
      this.resetComboForm();
      this.dataTable()?.close();
      await this.ctrl.load();
    } catch (e) {
      this.comboError = domainErrorText(e, 'ui.errSaveMenu');
    } finally {
      this.saving = false;
    }
  }

  private async deleteCombo(combo: Combo): Promise<void> {
    if (!can('combos.manage_combo')) return;
    this.saving = true;
    this.comboError = '';
    try {
      await erplora().command('combos.combos.delete', { combo_id: combo.id });
      if (this.openCombo?.id === combo.id) this.backToList();
      await this.ctrl.load();
    } catch (e) {
      this.comboError = domainErrorText(e, 'ui.errDeleteMenu');
    } finally {
      this.saving = false;
    }
  }

  // ── Course form ────────────────────────────────────────────────────────────────────────────

  private resetCourseForm(): void {
    this.editingCourse = null;
    this.cName = ''; this.cMin = '1'; this.cMax = '1'; this.cRepeat = false;
    this.courseReason = ''; this.courseError = '';
  }

  private startEditCourse(course: Course): void {
    if (!can('combos.manage_combo')) return;
    this.editingCourse = course;
    this.cName = course.name;
    this.cMin = String(course.min_choices ?? 0);
    this.cMax = String(course.max_choices ?? 0);
    this.cRepeat = Boolean(course.allow_repeat);
    this.courseReason = ''; this.courseError = '';
  }

  /**
   * Why the course cannot be saved — or '' when it can.
   *
   * `ck_combos_choice_group_ceiling` allows `max_choices = 0` (NO ceiling) and otherwise demands
   * `max >= min`. Confusing "no ceiling" with "a ceiling of zero" would refuse the most ordinary
   * course there is (pick one drink, as many as you like).
   */
  private get courseBlockedKey(): string {
    if (!this.cName.trim()) return 'ui.errNoName';
    const min = Number(this.cMin) || 0;
    const max = Number(this.cMax) || 0;
    if (max !== 0 && max < min) return 'ui.errCeilingBelowFloor';
    return '';
  }

  private async saveCourse(): Promise<void> {
    if (!can('combos.manage_combo') || !this.openCombo) return;
    const blocked = this.courseBlockedKey;
    if (blocked) {
      this.courseReason = t(blocked, { min: Number(this.cMin) || 0, max: Number(this.cMax) || 0 });
      return;
    }
    this.saving = true;
    this.courseError = ''; this.courseReason = '';
    const payload = {
      name: this.cName.trim(),
      min_choices: Number(this.cMin) || 0,
      max_choices: Number(this.cMax) || 0,
      allow_repeat: this.cRepeat ? 1 : 0,
    };
    try {
      if (this.editingCourse) {
        await erplora().command('combos.groups.update', { group_id: this.editingCourse.group_id, ...payload });
      } else {
        await erplora().command('combos.groups.create', {
          combo_id: this.openCombo.id,
          // The new course goes LAST: its order is the order it will be asked in, and appending is
          // the only placement that cannot silently reshuffle the courses already agreed.
          sort_order: this.courses.length,
          ...payload,
        });
      }
      this.resetCourseForm();
      await this.loadCourses();
    } catch (e) {
      this.courseError = domainErrorText(e, 'ui.errSaveCourse');
    } finally {
      this.saving = false;
    }
  }

  private async deleteCourse(course: Course): Promise<void> {
    if (!can('combos.manage_combo')) return;
    this.saving = true;
    this.courseError = '';
    try {
      await erplora().command('combos.groups.delete', { group_id: course.group_id });
      await this.loadCourses();
    } catch (e) {
      this.courseError = domainErrorText(e, 'ui.errDeleteCourse');
    } finally {
      this.saving = false;
    }
  }

  /** Moves a course one step, then persists the new order of every course it displaced. */
  private async moveCourse(course: Course, delta: -1 | 1): Promise<void> {
    if (!can('combos.manage_combo')) return;
    const from = this.courses.findIndex((c) => c.group_id === course.group_id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= this.courses.length) return;
    // Optimistic: the arrow answers immediately, and a failure reloads the truth from the server.
    this.courses = moved(this.courses, from, to);
    await this.persistCourseOrder(Math.min(from, to), Math.max(from, to));
  }

  /**
   * Writes the position of every course between `lo` and `hi`, which is what BOTH ways of
   * reordering end in — one step with an arrow (two rows) or a drop several slots away (as many
   * rows as it displaced). Only the range that actually moved is written: rewriting the whole
   * course list on every nudge would multiply the round trips for nothing.
   */
  private async persistCourseOrder(lo: number, hi: number): Promise<void> {
    this.saving = true;
    this.courseError = '';
    try {
      for (let index = lo; index <= hi; index += 1) {
        const c = this.courses[index];
        await erplora().command('combos.groups.update', {
          group_id: c.group_id,
          name: c.name,
          min_choices: c.min_choices,
          max_choices: c.max_choices,
          allow_repeat: c.allow_repeat,
          sort_order: index,
        });
      }
      await this.loadCourses();
    } catch (e) {
      this.courseError = domainErrorText(e, 'ui.errSaveCourse');
      await this.loadCourses();
    } finally {
      this.saving = false;
    }
  }

  // ── Choices ────────────────────────────────────────────────────────────────────────────────

  private draft(groupId: string): { ref: string; delta: string } {
    return this.optionDraft[groupId] ?? { ref: '', delta: '' };
  }

  private patchDraft(groupId: string, patch: Partial<{ ref: string; delta: string }>): void {
    this.optionDraft = { ...this.optionDraft, [groupId]: { ...this.draft(groupId), ...patch } };
  }

  /** The choice the form of `groupId` is editing, or null when it is adding a new one. */
  private editingIn(groupId: string): Choice | null {
    return this.editingChoice?.group_id === groupId ? this.editingChoice : null;
  }

  /**
   * Opens an existing choice in the form of its own course.
   *
   * This is the whole point of combos#1: withdrawing a choice and adding it back is NOT the same
   * operation. It loses the position (the re-added row lands last, so correcting one cent
   * reorders the printed menu) and it is not atomic — `ux_combos_choice_option` only looks at live
   * rows, so the withdrawal has to land first, and a failure in between leaves the operator
   * without the choice they only meant to retouch.
   */
  private startEditChoice(choice: Choice): void {
    if (!can('combos.manage_combo')) return;
    this.editingChoice = choice;
    this.optionScope = choice.group_id;
    this.optionReason = ''; this.optionError = '';
    this.optionDraft = {
      ...this.optionDraft,
      [choice.group_id]: {
        ref: `${choice.source}:${choice.source_ref}`,
        delta: choice.price_delta ? minorToInput(choice.price_delta) : '',
      },
    };
  }

  private cancelEditChoice(): void {
    const groupId = this.editingChoice?.group_id;
    this.editingChoice = null;
    this.optionScope = ''; this.optionReason = ''; this.optionError = '';
    if (groupId) this.optionDraft = { ...this.optionDraft, [groupId]: { ref: '', delta: '' } };
  }

  /**
   * Everything the choice form holds, back to zero — on OPENING a menu, next to the
   * `resetCourseForm` that was already there, and only there: the list is the only door into a
   * builder, so every entry passes through here.
   *
   * A refusal, and a half-typed draft, belong to the attempt that caused them; leaving the menu
   * ends that attempt. The four fields are cleared together on purpose — clearing three of them
   * is exactly how a red sentence comes back to a menu where nothing was refused.
   */
  private resetChoiceForm(): void {
    this.editingChoice = null;
    this.optionDraft = {};
    this.optionScope = ''; this.optionReason = ''; this.optionError = '';
  }

  /**
   * Why the choice of this course cannot be saved yet, as an i18n key — or '' when it can.
   *
   * `ux_combos_choice_option (hub_id, group_id, source, source_ref) WHERE is_deleted = 0` refuses
   * the same article twice in the same course. Same rule as the two CHECKs of the combo and the
   * course: what the database refuses, the screen explains FIRST, because reaching Postgres with
   * it means showing the merchant a unique-violation instead of a sentence. Editing a choice into
   * itself is not a duplicate, so the row being edited is excluded from the comparison.
   */
  private optionBlockedKey(groupId: string): string {
    const draft = this.draft(groupId);
    if (!draft.ref) return 'ui.errNoArticle';
    const delta = amountBlockedKey(draft.delta, 'supplement');
    if (delta) return delta;
    const editing = this.editingIn(groupId);
    const clash = (this.choices[groupId] ?? []).some(
      (o) => `${o.source}:${o.source_ref}` === draft.ref && o.option_id !== editing?.option_id,
    );
    return clash ? 'ui.errDuplicateArticle' : '';
  }

  private async saveChoice(groupId: string): Promise<void> {
    if (!can('combos.manage_combo')) return;
    const blocked = this.optionBlockedKey(groupId);
    if (blocked) {
      // The tap ANSWERS, in the course it was tapped in.
      this.optionScope = groupId;
      this.optionReason = t(blocked, amountReadings(this.draft(groupId).delta, 'supplement'));
      return;
    }
    const draft = this.draft(groupId);
    const [source, ...rest] = draft.ref.split(':');
    const editing = this.editingIn(groupId);
    this.saving = true;
    this.optionScope = groupId;
    this.optionError = ''; this.optionReason = '';
    try {
      // The reference stays OPAQUE both ways: `source` + `source_ref`, never the article name.
      // This module does not learn what those rows are, which is what keeps `depends_on` empty.
      const article = { source, source_ref: rest.join(':'), price_delta: amountToMinor(draft.delta, 'supplement') };
      if (editing) {
        await erplora().command('combos.options.update', {
          option_id: editing.option_id,
          ...article,
          // The position it ALREADY holds. `option_update.sql` runs COALESCE(:sort_order, 0), so
          // omitting the field is not "leave it as it is": it sends the choice to the top of the
          // course on every single edit.
          sort_order: editing.sort_order ?? 0,
        });
        this.editingChoice = null;
      } else {
        await erplora().command('combos.options.create', {
          group_id: groupId,
          ...article,
          // A new choice goes LAST, the only placement that cannot reshuffle what is agreed.
          sort_order: (this.choices[groupId] ?? []).length,
        });
      }
      this.optionDraft = { ...this.optionDraft, [groupId]: { ref: '', delta: '' } };
      await this.loadCourses();
    } catch (e) {
      this.optionError = domainErrorText(e, 'ui.errSaveOption');
    } finally {
      this.saving = false;
    }
  }

  /** Moves a choice one step inside its course, then persists the two positions that swapped. */
  private async moveChoice(choice: Choice, delta: -1 | 1): Promise<void> {
    if (!can('combos.manage_combo')) return;
    const list = this.choices[choice.group_id] ?? [];
    const from = list.findIndex((o) => o.option_id === choice.option_id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= list.length) return;
    // Optimistic: the arrow answers immediately, and a failure reloads the truth from the server.
    this.choices = { ...this.choices, [choice.group_id]: moved(list, from, to) };
    await this.persistChoiceOrder(choice.group_id, Math.min(from, to), Math.max(from, to));
  }

  /** The same write for both ways of reordering a course's choices: the arrows and the handle. */
  private async persistChoiceOrder(groupId: string, lo: number, hi: number): Promise<void> {
    this.saving = true;
    this.optionScope = groupId;
    this.optionError = '';
    try {
      const list = this.choices[groupId] ?? [];
      for (let index = lo; index <= hi; index += 1) {
        const o = list[index];
        // `option_update.sql` rewrites the WHOLE row, so the reference and the supplement travel
        // with the new position: sending only `sort_order` would blank the component.
        await erplora().command('combos.options.update', {
          option_id: o.option_id,
          source: o.source,
          source_ref: o.source_ref,
          price_delta: o.price_delta,
          sort_order: index,
        });
      }
      await this.loadCourses();
    } catch (e) {
      this.optionError = domainErrorText(e, 'ui.errSaveOption');
      await this.loadCourses();
    } finally {
      this.saving = false;
    }
  }

  // ── Adding several articles at once (combos#6) ──────────────────────────────────────────────
  //
  // The frontier the market barrido found is not catalogue size, it is TPV vs ERP: every verified
  // hospitality TPV ships bulk add and the ones that ship one line at a time are the ones
  // generating the complaints (Odoo's «keying it in 1 line at a time is going to take too long»,
  // Square's «VERY inconvenient to have to select each modifier inside each item»). Copied from
  // Lightspeed K-Series, the closest product: a pop-up with a filter, a checkbox per row and a
  // primary button whose LABEL CARRIES THE COUNT.
  //
  // The supplement is NOT asked here, on purpose. It is the exception, not the rule, and asking for
  // it once per row would turn a bulk add back into the one-at-a-time form it replaces. It is set
  // afterwards by editing the row, which combos#1 made possible without losing the position.

  private openBulk(groupId: string): void {
    if (!can('combos.manage_combo')) return;
    this.bulkFor = groupId;
    this.bulkPicked = [];
    this.bulkQuery = '';
    this.bulkReason = '';
    // Reopened with whatever the last search left behind, the picker would show a filtered
    // catalogue with an empty search box: the full first page is asked for again.
    void this.loadCatalogues();
  }

  private closeBulk(): void {
    this.bulkFor = '';
    this.bulkPicked = [];
    this.bulkQuery = '';
    this.bulkReason = '';
  }

  /** Searches on the SERVER: both catalogues paginate at 50 (the hub#650 hole). */
  private searchBulk(query: string): void {
    this.bulkQuery = query;
    void this.loadCatalogues(query);
  }

  private tickBulk(ref: string, owned: boolean, checked: boolean): void {
    // `ux_combos_choice_option` refuses the same article twice in the same course, so a row that is
    // already there cannot be ticked. It stays visible and says why instead of disappearing: a
    // picker that hides what is already in the course reads as a catalogue with holes in it.
    if (owned) return;
    this.bulkPicked = checked
      ? [...this.bulkPicked.filter((r) => r !== ref), ref]
      : this.bulkPicked.filter((r) => r !== ref);
  }

  private async confirmBulk(): Promise<void> {
    if (!can('combos.manage_combo')) return;
    const groupId = this.bulkFor;
    if (!groupId) return;
    const picked = this.bulkPicked;
    if (picked.length === 0) {
      // The tap ANSWERS: same contract as every other blocked button on this screen.
      this.bulkReason = t('ui.errNoneSelected');
      return;
    }
    this.saving = true;
    this.optionScope = groupId;
    this.optionError = ''; this.optionReason = '';
    // They go in AFTER what is already there, in the order they were ticked: appending is the only
    // placement that cannot silently reshuffle the choices already agreed.
    const base = (this.choices[groupId] ?? []).length;
    try {
      for (const [i, ref] of picked.entries()) {
        const [source, ...rest] = ref.split(':');
        await erplora().command('combos.options.create', {
          group_id: groupId,
          source,
          source_ref: rest.join(':'),
          price_delta: 0,
          sort_order: base + i,
        });
      }
      this.closeBulk();
      await this.loadCourses();
    } catch (e) {
      // Whatever landed before the failure is REAL. The picker closes and the course is reloaded so
      // the screen shows what the server actually holds, not what was attempted — a picker left
      // open with its ticks intact invites adding the same rows a second time.
      this.optionError = domainErrorText(e, 'ui.errSaveOption');
      this.closeBulk();
      await this.loadCourses();
    } finally {
      this.saving = false;
    }
  }

  private async deleteChoice(choice: Choice): Promise<void> {
    if (!can('combos.manage_combo')) return;
    this.saving = true;
    this.optionScope = choice.group_id;
    this.optionError = '';
    try {
      await erplora().command('combos.options.delete', { option_id: choice.option_id });
      if (this.editingChoice?.option_id === choice.option_id) this.cancelEditChoice();
      await this.loadCourses();
    } catch (e) {
      this.optionError = domainErrorText(e, 'ui.errDeleteOption');
    } finally {
      this.saving = false;
    }
  }

  /** The label of an opaque reference, or a sentence saying it is gone from the catalogue. */
  private articleLabel(choice: Choice): string {
    const found = this.articles.find((a) => a.value === `${choice.source}:${choice.source_ref}`);
    return found ? found.label : t('ui.unknownArticle', { ref: choice.source_ref });
  }

  // ── Rendering ──────────────────────────────────────────────────────────────────────────────

  /**
   * A button that is blocked but still ANSWERS. Never `disabled`: Ionic implements it as
   * `pointer-events:none`, so the tap dies and the reason lives in a `title` no tablet shows.
   */
  private blockingButton(opts: {
    testid: string; blocked: boolean; label: string; onClick: () => void; tone?: string;
  }) {
    return html`<ion-button
      size="small"
      data-testid=${opts.testid}
      data-tone=${opts.tone ?? 'primary'}
      data-blocked=${String(opts.blocked)}
      aria-disabled=${String(opts.blocked)}
      @click=${opts.onClick}
    >${opts.label}</ion-button>`;
  }

  /** The sentence that states the rule the till will apply for this course. */
  private courseRule(course: Course): string {
    const min = Number(course.min_choices ?? 0);
    const max = Number(course.max_choices ?? 0);
    const parts: string[] = [];
    if (min >= 1) {
      // The obligation IS the number. No separate flag exists, deliberately: one control with two
      // effects is Square's documented footgun, where an optional course turns compulsory silently.
      parts.push(max === min ? t('ui.courseRequired', { min }) : t('ui.courseRequiredRange', { min }));
    } else {
      parts.push(t('ui.courseOptional'));
    }
    parts.push(max === 0 ? t('ui.courseNoCeiling') : t('ui.courseMax', { max }));
    parts.push(course.allow_repeat ? t('ui.courseRepeat') : t('ui.courseNoRepeat'));
    return parts.join(' · ');
  }

  private renderComboForm() {
    const editing = this.editing;
    const blockedKey = this.comboBlockedKey;
    return html`<form slot="create" class="form" data-testid="combos-form" @submit=${(e: Event) => { e.preventDefault(); this.saveCombo(); }}>
      <!-- pm#450: when the header already carries the editing title, repeating it in the form
           body is the duplicate this issue exists to remove. -->
      ${editing && this.editTitleInHeader
        ? nothing
        : html`<h3>${editing ? t('ui.editMenuTitle', { name: editing.name }) : t('ui.newMenuTitle')}</h3>`}

      <ion-input mode="md" fill="outline" data-testid="combos-name" label=${t('ui.fieldName')} label-placement="floating"
        .value=${this.fName}
        @ionInput=${(e: CustomEvent) => (this.fName = String((e.target as HTMLInputElement).value ?? ''))}></ion-input>

      <ion-input mode="md" fill="outline" data-testid="combos-kitchen-name" label=${t('ui.fieldKitchenName')} label-placement="floating"
        .value=${this.fKitchenName}
        @ionInput=${(e: CustomEvent) => (this.fKitchenName = String((e.target as HTMLInputElement).value ?? ''))}></ion-input>
      <p class="help">${t('ui.fieldKitchenNameHelp')}</p>

      <ion-input mode="md" fill="outline" data-testid="combos-price" type="text" inputmode="decimal"
        label=${t('ui.fieldPrice')} label-placement="floating" .value=${this.fPrice}
        @ionInput=${(e: CustomEvent) => (this.fPrice = String((e.target as HTMLInputElement).value ?? ''))}
        @ionBlur=${() => (this.fPrice = normaliseOnBlur(this.fPrice))}></ion-input>
      <p class="help">${t('ui.fieldPriceHelp')}</p>

      <!-- supply_kind is asked by what it MEANS: whoever fills it is a restaurateur, not an adviser. -->
      <ion-select mode="md" fill="outline" data-testid="combos-supply-kind" label=${t('ui.supplyLabel')} label-placement="floating"
        .value=${this.fSupplyKind}
        @ionChange=${(e: CustomEvent) => (this.fSupplyKind = String((e.target as HTMLSelectElement).value ?? 'service'))}>
        <ion-select-option value="service">${t('ui.supplyService')}</ion-select-option>
        <ion-select-option value="goods">${t('ui.supplyGoods')}</ion-select-option>
      </ion-select>
      <!--
        BOTH consequences are shown, with the active one emphasised - not only the selected
        one. Rendering just the current value would mean the merchant has to SELECT goods to
        find out what goods does, which is the "discover it on the invoice" failure this screen
        exists to prevent. The choice is between two fiscal outcomes, so both are on the table.
      -->
      <p class="help" data-testid="combos-supply-help-service" data-active=${String(this.fSupplyKind === 'service')}>
        ${t('ui.supplyService')}: ${t('ui.supplyServiceHelp')}
      </p>
      <p class="help" data-testid="combos-supply-help-goods" data-active=${String(this.fSupplyKind === 'goods')}>
        ${t('ui.supplyGoods')}: ${t('ui.supplyGoodsHelp')}
      </p>

      <!-- Only a single supply needs a rate of its own: with goods each component brings one. -->
      ${this.fSupplyKind === 'service'
        ? html`<ion-select mode="md" fill="outline" data-testid="combos-tax-category" label=${t('ui.fieldTaxCategory')} label-placement="floating"
            .value=${this.fTaxCategory}
            @ionChange=${(e: CustomEvent) => (this.fTaxCategory = String((e.target as HTMLSelectElement).value ?? ''))}>
            ${this.taxCategories.map((c) => html`<ion-select-option value=${c.key}>${c.display_name}</ion-select-option>`)}
          </ion-select>
          <p class="help">${t('ui.fieldTaxCategoryHelp')}</p>`
        : nothing}

      <ion-input mode="md" fill="outline" data-testid="combos-order" type="number" min="0"
        label=${t('ui.fieldOrder')} label-placement="floating" .value=${this.fSortOrder}
        @ionInput=${(e: CustomEvent) => (this.fSortOrder = String((e.target as HTMLInputElement).value ?? '0'))}></ion-input>

      <ion-checkbox data-testid="combos-active" .checked=${this.fActive}
        @ionChange=${(e: CustomEvent) => (this.fActive = Boolean((e.target as HTMLInputElement).checked))}>${t('ui.fieldActive')}</ion-checkbox>

      ${this.blockingButton({
        testid: 'combos-save',
        blocked: Boolean(blockedKey),
        label: this.saving ? t('ui.saving') : t('ui.save'),
        onClick: () => this.saveCombo(),
      })}
      ${this.comboReason ? html`<p class="reason" data-testid="combos-blocked-reason">${this.comboReason}</p>` : nothing}
      ${this.comboError ? html`<ok-inline-feedback data-testid="combos-form-error" tone="danger" icon="alert-circle-outline">${this.comboError}</ok-inline-feedback>` : nothing}
      ${editing ? html`<ion-button size="small" data-testid="combos-cancel" @click=${() => this.cancelComboEdit()}>${t('ui.cancel')}</ion-button>` : nothing}
    </form>`;
  }

  private renderChoices(course: Course) {
    const rows = this.choices[course.group_id] ?? [];
    const manage = can('combos.manage_combo');
    const draft = this.draft(course.group_id);
    const editing = this.editingIn(course.group_id);
    return html`
      <div class="rule">${t('ui.optionsTitle')}</div>
      ${rows.length === 0
        ? html`<p class="muted" data-testid=${`combos-course-row-${course.group_id}-choices-empty`}>${t('ui.optionsEmpty')}</p>`
        : html`<ul class="choices">
            ${rows.map((o, i) => html`<li data-testid=${`combos-choice-row-${o.option_id}`} data-option-id=${o.option_id}
              data-editing=${String(this.editingChoice?.option_id === o.option_id)}
              data-dragging=${String(this.drag?.kind === 'choice' && this.drag.groupId === course.group_id && this.drag.at === i)}>
              <span class="name">${this.articleLabel(o)}</span>
              ${o.price_delta ? html`<span class="delta">${erplora().formatMoney(o.price_delta)}</span>` : nothing}
              ${manage
                ? html`<span class="row-actions">
                    <ion-button size="small" class="icon-btn drag-handle" data-testid=${`combos-choice-row-${o.option_id}-drag`}
                      aria-label=${t('ui.dragToReorder')}
                      @pointerdown=${(e: PointerEvent) => this.beginDrag(e, 'choice', course.group_id, o.option_id)}>
                      <ion-icon name="reorder-three-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o.option_id}-up`} aria-label=${t('ui.moveUp')}
                      data-blocked=${String(i === 0)} aria-disabled=${String(i === 0)}
                      @click=${() => this.moveChoice(o, -1)}>
                      <ion-icon name="arrow-up-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o.option_id}-down`} aria-label=${t('ui.moveDown')}
                      data-blocked=${String(i === rows.length - 1)} aria-disabled=${String(i === rows.length - 1)}
                      @click=${() => this.moveChoice(o, 1)}>
                      <ion-icon name="arrow-down-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o.option_id}-edit`} aria-label=${t('ui.optionEdit')}
                      @click=${() => this.startEditChoice(o)}>
                      <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o.option_id}-delete`} aria-label=${t('ui.optionDelete')}
                      @click=${() => this.deleteChoice(o)}>
                      <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </span>`
                : nothing}
            </li>`)}
          </ul>`}

      ${manage
        ? html`${editing
            ? html`<p class="help" data-testid=${`combos-course-row-${course.group_id}-editing-choice`} data-active="true">
                ${t('ui.editingChoice', { article: this.articleLabel(editing) })}
              </p>`
            : nothing}
          <div class="row">
            <!-- Typeahead over BOTH catalogues. The server searches, so a 500-article shop is
                 reachable; a first page of 50 filtered in the browser would hide the rest. -->
            <ok-combo
              data-testid=${`combos-course-row-${course.group_id}-option-picker`}
              .options=${this.articles}
              .value=${draft.ref}
              .labels=${{ placeholder: t('ui.optionPickerPlaceholder'), empty: t('ui.catalogueEmpty') }}
              @ok-input=${(e: CustomEvent<{ query: string }>) => this.loadCatalogues(e.detail?.query ?? '')}
              @ok-change=${(e: CustomEvent<{ value: string }>) => this.patchDraft(course.group_id, { ref: e.detail?.value ?? '' })}
            ></ok-combo>
            <ion-input mode="md" fill="outline" data-testid=${`combos-course-row-${course.group_id}-option-delta`} type="text" inputmode="decimal"
              label=${t('ui.optionDelta')} label-placement="floating" .value=${draft.delta}
              @ionInput=${(e: CustomEvent) => this.patchDraft(course.group_id, { delta: String((e.target as HTMLInputElement).value ?? '') })}
              @ionBlur=${() => this.patchDraft(course.group_id, { delta: normaliseOnBlur(this.draft(course.group_id).delta) })}></ion-input>
            ${this.blockingButton({
              testid: `combos-course-row-${course.group_id}-option-save`,
              blocked: Boolean(this.optionBlockedKey(course.group_id)),
              label: editing ? (this.saving ? t('ui.saving') : t('ui.save')) : t('ui.optionAdd'),
              onClick: () => this.saveChoice(course.group_id),
            })}
            ${editing
              ? html`<ion-button size="small" data-testid=${`combos-course-row-${course.group_id}-option-cancel`} @click=${() => this.cancelEditChoice()}>
                  ${t('ui.cancel')}
                </ion-button>`
              : html`<!-- The other door in, and the one a real catalogue uses: several at once. -->
                <ion-button size="small" data-testid=${`combos-course-row-${course.group_id}-bulk-add`} @click=${() => this.openBulk(course.group_id)}>
                  <ion-icon name="add-outline" slot="start"></ion-icon>${t('ui.bulkAdd')}
                </ion-button>`}
          </div>
          <p class="help">${t('ui.optionDeltaHelp')}</p>`
        : nothing}

      ${this.optionScope === course.group_id && this.optionReason
        ? html`<p class="reason" data-testid=${`combos-course-row-${course.group_id}-option-blocked-reason`}>${this.optionReason}</p>` : nothing}
      ${this.optionScope === course.group_id && this.optionError
        ? html`<ok-inline-feedback data-testid=${`combos-course-row-${course.group_id}-option-error`} tone="danger" icon="alert-circle-outline">${this.optionError}</ok-inline-feedback>` : nothing}
    `;
  }

  private renderCourse(course: Course, index: number) {
    const manage = can('combos.manage_combo');
    const required = Number(course.min_choices ?? 0) >= 1;
    return html`<section class="card" data-testid=${`combos-course-row-${course.group_id}`} data-group-id=${course.group_id} data-required=${String(required)}
      data-dragging=${String(this.isDragging('course', index))}>
      <div class="card-head">
        <span class="title">${course.name}</span>
        <span class="badge" data-testid=${`combos-course-row-${course.group_id}-rule`}>${this.courseRule(course)}</span>
        ${manage
          ? html`
            <ion-button size="small" class="icon-btn drag-handle" data-testid=${`combos-course-row-${course.group_id}-drag`}
              aria-label=${t('ui.dragToReorder')}
              @pointerdown=${(e: PointerEvent) => this.beginDrag(e, 'course', '', course.group_id)}>
              <ion-icon name="reorder-three-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button size="small" class="icon-btn" data-testid=${`combos-course-row-${course.group_id}-up`} aria-label=${t('ui.moveUp')}
              data-blocked=${String(index === 0)} aria-disabled=${String(index === 0)}
              @click=${() => this.moveCourse(course, -1)}>
              <ion-icon name="arrow-up-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button size="small" class="icon-btn" data-testid=${`combos-course-row-${course.group_id}-down`} aria-label=${t('ui.moveDown')}
              data-blocked=${String(index === this.courses.length - 1)} aria-disabled=${String(index === this.courses.length - 1)}
              @click=${() => this.moveCourse(course, 1)}>
              <ion-icon name="arrow-down-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button size="small" data-testid=${`combos-course-row-${course.group_id}-edit`} @click=${() => this.startEditCourse(course)}>${t('ui.actionEdit')}</ion-button>
            <ion-button size="small" data-tone="danger" data-testid=${`combos-course-row-${course.group_id}-delete`} @click=${() => this.deleteCourse(course)}>${t('ui.actionDelete')}</ion-button>`
          : nothing}
      </div>
      ${this.renderChoices(course)}
    </section>`;
  }

  /**
   * The bulk picker, as Lightspeed K-Series ships it: a pop-up with its own SERVER-side filter, a
   * checkbox per row, and a primary button that says how many articles are going in.
   *
   * TWO THINGS ABOUT `ion-modal` THAT ARE NOT OPTIONAL, both measured in Chromium on the built
   * bundle, because neither is visible from the source:
   *
   *  1. IT IS REPARENTED TO `<body>` when it presents, so this component's stylesheet does NOT
   *     reach anything inside it. Everything in here is an Ionic primitive or carries its own
   *     inline style — the same rule `services`' own modals already follow.
   *  2. THE ELEMENT AND ITS WHOLE BODY STAY IN THE TEMPLATE, ALWAYS. Only `isOpen` moves.
   *     Rendering the modal only while open left it FROZEN ON SCREEN after a confirmed bulk add —
   *     still saying «Guardando…», with the course already updated behind it: once Ionic has moved
   *     the element out, taking it out of the Lit template takes out nothing, and nothing dismisses
   *     it. Swapping only the BODY for `nothing` was not enough either: the old rows were left
   *     orphaned in `<body>` and the next open painted a SECOND catalogue beside them (14 rows for
   *     7 articles, three flagged as already-added inside a course with no choices). Lit updates
   *     the row list happily while the modal is presented — 7 to 1 to 7 across a search, measured;
   *     what it does not survive is the subtree appearing and disappearing under Ionic's feet.
   *     It is rendered from `render()` and not from the builder for the same reason: leaving the
   *     menu would remove it mid-animation.
   */
  private renderBulkPicker() {
    const groupId = this.bulkFor;
    const already = new Set((this.choices[groupId] ?? []).map((o) => `${o.source}:${o.source_ref}`));
    const picked = new Set(this.bulkPicked);
    const n = this.bulkPicked.length;
    return html`<ion-modal data-testid="combos-bulk-picker" .isOpen=${Boolean(groupId)}
      @ionModalDidDismiss=${() => this.closeBulk()}>
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-title>${t('ui.bulkTitle')}</ion-title>
          <ion-buttons slot="end">
            <ion-button data-testid="combos-bulk-cancel" @click=${() => this.closeBulk()}>${t('ui.cancel')}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-searchbar data-testid="combos-bulk-search" .value=${this.bulkQuery}
          placeholder=${t('ui.optionPickerPlaceholder')}
          @ionInput=${(e: CustomEvent) => this.searchBulk(String((e.target as HTMLInputElement).value ?? ''))}></ion-searchbar>

        ${this.catalogueError
          ? html`<ok-inline-feedback data-testid="combos-bulk-catalogue-error" tone="danger" icon="alert-circle-outline">${this.catalogueError}</ok-inline-feedback>`
          : this.articles.length === 0
            ? html`<p data-testid="combos-bulk-empty">${this.missingCatalogues.length
                ? this.missingCatalogues.map((k) => t('ui.catalogueMissing', { module: t(k) })).join(' ')
                : t('ui.catalogueEmpty')}</p>`
            : html`<ion-list lines="full">
                ${this.articles.map((a) => {
                  const owned = already.has(a.value);
                  return html`<ion-item data-testid=${`combos-bulk-row-${a.value}`} data-ref=${a.value} data-already=${String(owned)}
                    style=${owned ? 'opacity:.55' : ''}>
                    <ion-checkbox data-testid=${`combos-bulk-row-${a.value}-pick`}
                      .checked=${owned || picked.has(a.value)}
                      aria-disabled=${String(owned)}
                      @ionChange=${(e: CustomEvent) => this.tickBulk(a.value, owned, Boolean((e.target as HTMLInputElement).checked))}
                    >${a.label}</ion-checkbox>
                    <!-- Two catalogues in one list: which one a row comes from has to be readable,
                         or a product and a service with the same name are the same row. -->
                    <span slot="end">${owned
                      ? t('ui.bulkAlready')
                      : t(a.value.startsWith('service:') ? 'ui.sourceService' : 'ui.sourceProduct')}</span>
                  </ion-item>`;
                })}
              </ion-list>`}

        <!-- Blocked, never natively disabled: Ionic implements disabled as pointer-events:none, so
             the tap dies and the reason with it. (No backticks in an HTML comment inside an html
             tagged template: one would CLOSE the template and break the whole component.) -->
        <ion-button class="ion-margin-top" expand="block" data-testid="combos-bulk-confirm"
          data-blocked=${String(n === 0)} aria-disabled=${String(n === 0)}
          style=${n === 0 ? 'opacity:.55' : ''}
          @click=${() => this.confirmBulk()}
        >${this.saving ? t('ui.saving') : t('ui.bulkAddCount', { n })}</ion-button>
        ${this.bulkReason
          ? html`<p data-testid="combos-bulk-blocked-reason" style="color:var(--ion-color-danger,#c5000f);font-size:.85rem;">${this.bulkReason}</p>`
          : nothing}
      </ion-content>
    </ion-modal>`;
  }

  private renderCourseForm() {
    if (!can('combos.manage_combo')) return nothing;
    const blockedKey = this.courseBlockedKey;
    return html`<section class="card">
      <div class="form">
        <span class="title">${this.editingCourse ? t('ui.editCourse', { name: this.editingCourse.name }) : t('ui.newCourse')}</span>
        <div class="row">
          <ion-input mode="md" fill="outline" data-testid="combos-course-name" label=${t('ui.fieldCourseName')} label-placement="floating"
            .value=${this.cName}
            @ionInput=${(e: CustomEvent) => (this.cName = String((e.target as HTMLInputElement).value ?? ''))}></ion-input>
          <ion-input mode="md" fill="outline" data-testid="combos-course-min" type="number" min="0"
            label=${t('ui.fieldMin')} label-placement="floating" .value=${this.cMin}
            @ionInput=${(e: CustomEvent) => (this.cMin = String((e.target as HTMLInputElement).value ?? '0'))}></ion-input>
          <ion-input mode="md" fill="outline" data-testid="combos-course-max" type="number" min="0"
            label=${t('ui.fieldMax')} label-placement="floating" .value=${this.cMax}
            @ionInput=${(e: CustomEvent) => (this.cMax = String((e.target as HTMLInputElement).value ?? '0'))}></ion-input>
        </div>
        <p class="help">${t('ui.fieldMinHelp')}</p>
        <p class="help">${t('ui.fieldMaxHelp')}</p>
        <ion-checkbox data-testid="combos-course-repeat" .checked=${this.cRepeat}
          @ionChange=${(e: CustomEvent) => (this.cRepeat = Boolean((e.target as HTMLInputElement).checked))}>${t('ui.fieldRepeat')}</ion-checkbox>
        <div class="row">
          ${this.blockingButton({
            testid: 'combos-course-save',
            blocked: Boolean(blockedKey),
            label: this.saving ? t('ui.saving') : t('ui.save'),
            onClick: () => this.saveCourse(),
          })}
          ${this.editingCourse ? html`<ion-button size="small" data-testid="combos-course-cancel" @click=${() => this.resetCourseForm()}>${t('ui.cancel')}</ion-button>` : nothing}
        </div>
        ${this.courseReason ? html`<p class="reason" data-testid="combos-course-blocked-reason">${this.courseReason}</p>` : nothing}
        ${this.courseError ? html`<ok-inline-feedback data-testid="combos-course-error" tone="danger" icon="alert-circle-outline">${this.courseError}</ok-inline-feedback>` : nothing}
      </div>
    </section>`;
  }

  private renderBuilder(combo: Combo) {
    const goods = combo.supply_kind === 'goods';
    return html`<div class="builder">
      <div class="menu-head">
        <ion-button size="small" data-testid="combos-back" @click=${() => this.backToList()}>
          <ion-icon name="arrow-back-outline" slot="start"></ion-icon>${t('ui.back')}
        </ion-button>
        <span class="name">${combo.name}</span>
        <span class="price">${erplora().formatMoney(Number(combo.price ?? 0))}</span>
      </div>

      <!-- What this menu will DO on the receipt, said before anybody discovers it on an invoice. -->
      <ok-inline-feedback data-testid="combos-supply-consequence" tone=${goods ? 'warning' : 'info'} icon="receipt-outline">
        ${goods ? t('ui.supplyGoodsWarning') : t('ui.supplyServiceWarning')}
      </ok-inline-feedback>

      ${this.missingCatalogues.length
        ? html`<ok-inline-feedback data-testid="combos-catalogue-missing" tone="warning" icon="alert-circle-outline">
            ${this.missingCatalogues.map((k) => t('ui.catalogueMissing', { module: t(k) })).join(' ')}
          </ok-inline-feedback>`
        : nothing}

      <!-- A catalogue that FAILED, said out loud. Swallowed it looks exactly like an empty one. -->
      ${this.catalogueError
        ? html`<ok-inline-feedback data-testid="combos-catalogue-error" tone="danger" icon="alert-circle-outline">
            ${this.catalogueError}
          </ok-inline-feedback>`
        : nothing}
      ${this.taxCategoriesError
        ? html`<ok-inline-feedback data-testid="combos-tax-categories-error" tone="danger" icon="alert-circle-outline">
            ${this.taxCategoriesError}
          </ok-inline-feedback>`
        : nothing}

      <div class="builder-body">
        <div>
          <div class="card-head"><span class="title">${t('ui.coursesTitle')}</span></div>
          <p class="help">${t('ui.coursesHelp')}</p>
        </div>

        ${this.coursesLoading
          ? html`<p class="muted" data-testid="combos-courses-loading">${t('ui.coursesLoading')}</p>`
          : this.coursesError
            ? html`<ok-inline-feedback data-testid="combos-courses-error" tone="danger" icon="alert-circle-outline">${this.coursesError}</ok-inline-feedback>`
            : this.courses.length === 0
              ? html`<p class="muted" data-testid="combos-courses-empty">${t('ui.coursesEmpty')}</p>`
              : this.courses.map((c, i) => this.renderCourse(c, i))}

        ${this.coursesLoading ? nothing : this.renderCourseForm()}
      </div>
    </div>`;
  }

  render() {
    // No `<h2>`: the shell topbar paints the view title.
    // The picker modal is rendered from HERE, in both views, and never from inside the builder:
    // Ionic reparents it out of this shadow root, so a template that stops rendering it orphans a
    // live overlay on the page instead of dismissing it.
    if (this.openCombo) {
      return html`<div class="page">${this.renderBuilder(this.openCombo)}</div>${this.renderBulkPicker()}`;
    }

    return html`<div class="page">
      ${this.comboError ? html`<ok-inline-feedback data-testid="combos-error" tone="danger" icon="alert-circle-outline">${this.comboError}</ok-inline-feedback>` : nothing}
      ${this.ctrl?.error ? html`<ok-inline-feedback data-testid="combos-list-error" tone="danger" icon="alert-circle-outline">${this.ctrl.error}</ok-inline-feedback>` : nothing}
      <ok-data-table testid="combos-table"
        .serverSide=${true}
        .fill=${true}
        .labels=${dataTableLabels(erplora().locale)}
        .views=${true}
        .cardTitle=${(r: Record<string, unknown>) => String(r.name ?? '—')}
        .cardIcon=${() => 'restaurant-outline'}
        .addable=${can('combos.manage_combo')}
        .columns=${this.columns}
        .rows=${this.ctrl?.rows ?? []}
        .total=${this.ctrl?.total ?? 0}
        .page=${this.ctrl?.state.page ?? 0}
        .pageSize=${this.ctrl?.state.pageSize ?? 50}
        .sort=${this.ctrl?.state.sort}
        .sortDir=${this.ctrl?.state.dir ?? 'asc'}
        .searchable=${true}
        .searchPlaceholder=${t('ui.searchMenu')}
        .actions=${this.rowActions}
        .rowClickable=${true}
        .emptyMessage=${this.ctrl?.loading ? t('ui.loading') : t('ui.emptyMenus')}
        @rowAction=${(e: CustomEvent<{ actionId: string; row: Record<string, unknown> }>) => {
          const combo = e.detail.row as unknown as Combo;
          if (e.detail.actionId === 'edit') this.startEditCombo(combo);
          if (e.detail.actionId === 'delete') this.deleteCombo(combo);
        }}
        @rowClick=${(e: CustomEvent<{ row: Record<string, unknown> }>) => this.openBuilder(e.detail.row as unknown as Combo)}
        @pageChange=${(e: CustomEvent<number>) => this.ctrl.setPage(e.detail)}
        @pageSizeChange=${(e: CustomEvent<number>) => this.ctrl.setPageSize(e.detail)}
        @sortChange=${(e: CustomEvent<{ sort: string; dir: 'asc' | 'desc' }>) => this.ctrl.setSort(e.detail.sort, e.detail.dir)}
        @searchChange=${(e: CustomEvent<string>) => this.ctrl.setSearch(e.detail)}
        @filterChange=${(e: CustomEvent<{ col: string; value: unknown }>) => this.ctrl.setFilter(e.detail.col, e.detail.value)}
      >
        ${this.renderComboForm()}
      </ok-data-table>
    </div>${this.renderBulkPicker()}`;
  }
}

define('erp-combos-menus', ErpCombosMenus);
