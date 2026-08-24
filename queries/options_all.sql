-- WHAT `sales` READS TO BUILD A MENU. Every component of every combo, flattened with the rules of
-- its course and the closed price of its combo, in one round trip.
--
-- It carries the two things the apportionment of art. 79.Dos needs and that only this module owns:
-- the DIVIDEND (`combo_price`, plus the `price_delta` of whatever was substituted) and the SWITCH
-- (`supply_kind`). The WEIGHTS are the catalogue prices of the chosen components, which live in
-- whichever catalogue `source` points at -- this module never learns what those rows are, so it
-- cannot and must not compute the split. That is ERPlora/sales#152.
--
-- No `list` block, for the same reason as `combos.combos.all`: a price authority hands back
-- everything or it is not an authority.
--
-- `combo_is_active` travels instead of being filtered out here so that a component of a withdrawn
-- menu can be refused LOUDLY ("this menu is no longer on sale") rather than looking like an
-- unknown option, which is a different bug with a different fix.
SELECT
  o.id                AS option_id,
  o.group_id          AS group_id,
  g.combo_id          AS combo_id,
  c.name              AS combo_name,
  c.kitchen_name      AS combo_kitchen_name,
  c.price             AS combo_price,
  c.tax_category_key  AS combo_tax_category_key,
  c.supply_kind       AS supply_kind,
  c.is_active         AS combo_is_active,
  g.name              AS group_name,
  g.min_choices       AS min_choices,
  g.max_choices       AS max_choices,
  g.allow_repeat      AS allow_repeat,
  g.sort_order        AS group_sort_order,
  o.source            AS source,
  o.source_ref        AS source_ref,
  o.price_delta       AS price_delta,
  o.sort_order        AS option_sort_order
FROM combos_choice_option o
JOIN combos_choice_group g
  ON g.id = o.group_id AND g.hub_id = o.hub_id AND g.is_deleted = 0
JOIN combos_combo c
  ON c.id = g.combo_id AND c.hub_id = g.hub_id AND c.is_deleted = 0
WHERE o.hub_id = :hub_id AND o.is_deleted = 0
ORDER BY c.sort_order, c.name, g.sort_order, g.name, o.sort_order, o.source_ref
