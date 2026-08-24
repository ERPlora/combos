-- One combo, by id. Runtime injects :hub_id.
SELECT
  id                AS id,
  name              AS name,
  kitchen_name      AS kitchen_name,
  price             AS price,
  tax_category_key  AS tax_category_key,
  supply_kind       AS supply_kind,
  is_active         AS is_active,
  sort_order        AS sort_order
FROM combos_combo
WHERE id = :combo_id AND hub_id = :hub_id AND is_deleted = 0
