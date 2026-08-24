CREATE TABLE IF NOT EXISTS combos_combo (
  id                TEXT PRIMARY KEY,
  hub_id            TEXT NOT NULL,
  name              TEXT NOT NULL,
  kitchen_name      TEXT NOT NULL DEFAULT '',
  price             BIGINT NOT NULL DEFAULT 0 CHECK (price >= 0),
  tax_category_key  TEXT NOT NULL DEFAULT '',
  supply_kind       TEXT NOT NULL DEFAULT 'service' CHECK (supply_kind IN ('service', 'goods')),
  sort_order        INTEGER NOT NULL DEFAULT 0,
  is_active         INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  is_deleted        INTEGER NOT NULL DEFAULT 0,
  deleted_at        TEXT,
  created_by        TEXT,
  updated_by        TEXT,
  created_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_combos_combo_single_supply_has_a_rate
    CHECK (supply_kind <> 'service' OR tax_category_key <> '')
);
CREATE INDEX IF NOT EXISTS idx_combos_combo_hub ON combos_combo (hub_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_combos_combo_order ON combos_combo (hub_id, sort_order, name);

CREATE TABLE IF NOT EXISTS combos_choice_group (
  id            TEXT PRIMARY KEY,
  hub_id        TEXT NOT NULL,
  combo_id      TEXT NOT NULL,
  name          TEXT NOT NULL,
  min_choices   INTEGER NOT NULL DEFAULT 1 CHECK (min_choices >= 0),
  max_choices   INTEGER NOT NULL DEFAULT 1 CHECK (max_choices >= 0),
  allow_repeat  INTEGER NOT NULL DEFAULT 0 CHECK (allow_repeat IN (0, 1)),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_deleted    INTEGER NOT NULL DEFAULT 0,
  deleted_at    TEXT,
  created_by    TEXT,
  updated_by    TEXT,
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_combos_choice_group_ceiling
    CHECK (max_choices = 0 OR max_choices >= min_choices),
  FOREIGN KEY (combo_id) REFERENCES combos_combo (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_combos_choice_group_combo
  ON combos_choice_group (hub_id, combo_id, sort_order);

CREATE TABLE IF NOT EXISTS combos_choice_option (
  id           TEXT PRIMARY KEY,
  hub_id       TEXT NOT NULL,
  group_id     TEXT NOT NULL,
  source       TEXT NOT NULL CHECK (source IN ('product', 'service')),
  source_ref   TEXT NOT NULL,
  price_delta  BIGINT NOT NULL DEFAULT 0,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_deleted   INTEGER NOT NULL DEFAULT 0,
  deleted_at   TEXT,
  created_by   TEXT,
  updated_by   TEXT,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES combos_choice_group (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_combos_choice_option_group
  ON combos_choice_option (hub_id, group_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_combos_choice_option_source
  ON combos_choice_option (hub_id, source, source_ref);
CREATE UNIQUE INDEX IF NOT EXISTS ux_combos_choice_option
  ON combos_choice_option (hub_id, group_id, source, source_ref)
  WHERE is_deleted = 0;

-- combos: initial schema (Postgres), ADR-0381. The runtime adds hub_id + is_deleted/deleted_at
-- + created_by/updated_by/created_at/updated_at by contract. Only the domain lives here.
--
-- The prose sits at the END of the file on purpose. The runtime's statement splitter keeps a
-- comment INSIDE the statement that precedes it, and its guard matches a forbidden verb at the
-- START of the statement text, so a header comment can hide the first statement from the guard
-- (hub#1137). Trailing prose cannot. And no comment line here carries a statement terminator,
-- which splits the statement on the tags the fleet still runs (hub#1027, module-toolkit#70).
--
-- COMBO. The compound sellable article: a menu del dia, a shop pack, a salon package. It is an
-- article of the catalogue, NOT a discount. Toast and Clover model it as a discount and a discount
-- cannot be routed to a station, cannot be broken down for tax and cannot move anything: Square,
-- Lightspeed, Odoo, WooCommerce, NetSuite and Holded all give it its own article.
--
--   * `price` is the CLOSED price, in the whole unit of the money contract. It is the whole point
--     of a combo, and it is the dividend of the apportionment that `sales` performs.
--   * `supply_kind` is the SWITCH, and the combo DECLARES it -- the till never guesses it:
--       - `service`  = a single supply. Art. 91.Uno.2.2 LIVA puts hospitality served on the
--                      premises at 10 %, the wine included, because the drink is accessory to the
--                      meal. ONE line, at `tax_category_key`, with the closed price. No split, no
--                      rounding, the money machinery untouched.
--       - `goods`    = a supply of goods of diverse nature at a single price. Art. 79.Dos LIVA
--                      then apportions the base "in proportion to the market value", which is the
--                      same method HMRC prefers ("selling price", VATVAL03800). ONE LINE PER
--                      COMPONENT, each at its own rate.
--     A menu is `service` even when one of its drinks is tagged at 21 % in the catalogue:
--     accessoriness is a legal position of the business, not a consequence of the tagging. That is
--     why a third value is refused outright -- it would mean neither branch.
--   * `ck_combos_combo_single_supply_has_a_rate` -- a single-supply combo with no rate of its own
--     cannot be billed at all, so it is refused when it is written rather than at the till.
--
-- CHOICE GROUP. The course of THIS menu: "Starter", "Main", "Dessert", "Drink". It belongs to its
-- combo and is not shared, which is the deep difference with a modifier group: there the group is
-- reusable across articles, here it is the course of one concrete menu. Lightspeed K-Series and
-- Odoo model it the same way, so there is no N-to-N link table on purpose.
--
--   * `min_choices >= 1` IS the obligation. There is no separate flag, and that is deliberate:
--     Clover models it as a number, and Square is the cautionary tale where one control has two
--     effects and an optional course silently becomes compulsory.
--   * `max_choices = 0` means no ceiling. `ck_combos_choice_group_ceiling` keeps a ceiling from
--     landing below the floor, which would make the group impossible to satisfy.
--   * `allow_repeat` lets the same option be picked more than once (two coffees in one menu).
--
-- CHOICE OPTION. Unlike a modifier option, which is a label with a delta, this is a REAL article
-- of the catalogue: it gets routed to its station, it moves what it has to move and it carries its
-- own rate. It is LS Central's item-modifier versus text-modifier distinction, the same one the
-- amendment to ADR-0376 already adopted.
--
--   * `source` / `source_ref` is an OPAQUE reference (`product` | `service` plus its id, with NO
--     foreign key). This module never learns what those rows are, which is why it declares no
--     dependency in either direction. Same pattern as the retentions of ADR-0375. It is the reason
--     the module exists: a salon package is made of bookable services, and that catalogue does not
--     depend on the product one and must not start doing so just to sell a package.
--   * `price_delta` is the supplement for substituting ("+ sirloin, 3 EUR"). It may be NEGATIVE,
--     because a cheaper substitution is a real menu, and it adds to the CLOSED price -- never to
--     the component, whose catalogue price is what the apportionment weighs.
--   * `ux_combos_choice_option` -- the same article twice in the same course is a data error, not
--     a repetition. Repeating a pick at the till is what `allow_repeat` is for.
