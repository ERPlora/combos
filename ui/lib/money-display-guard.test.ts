import { it, expect } from 'vitest';
import { checkMoneyDisplay } from '@erplora/module-toolkit/money-display-guard';

// GUARD (pm#289, shared since pm#505/pm#508): money on screen is never formatted by hand in this
// module, and OutfitKit comes in by entry point, never as a value from the barrel.
//
// The rules live in `@erplora/module-toolkit/money-display-guard` (one piece for every module,
// tested there against its own positives); this test only says what is specific to Combos:
//
// * witnesses — the three amounts this module paints (the Price column, a menu's head price and an
//   option's supplement, all in the menus screen) go through the shell's formatter. They count the
//   CALL, not the name: the screen also declares `formatMoney(minor: number)` in its `erplora()`
//   interface, and a scan over empty or over-stripped content must not stay green on that
//   declaration (rv-combos-22).
// * notDisplay — none: `minorToInput` (the value of the money inputs) is a `NumberFormat` WITHOUT
//   `currency`, so it is not a hit. Add an entry (`'file: exact code line'` → why) only with the
//   reason it is not a screen amount.
// * outfitkitImporters — the menus screen imports OutfitKit (entry points + types), so the barrel
//   scan provably read it (rv-pricing-53).
it('money on screen goes through the shared formatter and OutfitKit by entry point (pm#289)', () => {
  expect(
    checkMoneyDisplay({
      from: import.meta.url,
      witnesses: {
        'components/erp-combos-menus/erp-combos-menus.ts': { text: 'erplora().formatMoney(', atLeast: 3 },
      },
      notDisplay: {},
      outfitkitImporters: ['components/erp-combos-menus/erp-combos-menus.ts'],
    }),
  ).toEqual([]);
});
