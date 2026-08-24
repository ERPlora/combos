-- THE SELLABLE CATALOGUE. Every combo the till may offer, in presentation order, in one call.
--
-- No `list` block ON PURPOSE. This is a price authority, not a screen: `sales` resolves the closed
-- price against this read and treats whatever arrives in the payload as a proposal, not a fact
-- (the lesson of sales#68). A paginated read would hand back the first 50 combos and stay silent
-- about the rest (hub#650), which for a price authority is a hole, not a display bug.
--
-- `is_active = 0` never reaches the till: a withdrawn menu keeps its rows, so yesterday's ticket
-- can still be read, but it cannot be sold again.
SELECT
  id                AS combo_id,
  name              AS name,
  kitchen_name      AS kitchen_name,
  price             AS price,
  tax_category_key  AS tax_category_key,
  supply_kind       AS supply_kind,
  sort_order        AS sort_order
FROM combos_combo
WHERE hub_id = :hub_id AND is_deleted = 0 AND is_active = 1
ORDER BY sort_order, name, id
