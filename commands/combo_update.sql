-- Edits a combo. Changing the menu today never rewrites yesterday's order: the sale line carries
-- an immutable snapshot of the combo, so this only affects what is sold from now on.
UPDATE combos_combo SET
  name = :name,
  kitchen_name = COALESCE(:kitchen_name, ''),
  price = COALESCE(:price, 0),
  tax_category_key = COALESCE(:tax_category_key, ''),
  supply_kind = COALESCE(:supply_kind, 'service'),
  sort_order = COALESCE(:sort_order, 0),
  is_active = COALESCE(:is_active, 1),
  updated_by = :current_user_id,
  updated_at = :now
WHERE id = :combo_id AND hub_id = :hub_id AND is_deleted = 0;
