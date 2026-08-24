-- The admin listing. The runtime wraps this as a subquery and composes search, sort, filters and
-- pagination from the `list` block of the manifest, so no ORDER BY / LIMIT / trailing `;` here.
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
WHERE hub_id = :hub_id AND is_deleted = 0
