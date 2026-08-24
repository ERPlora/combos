-- Creates a combo. Runtime injects :new_id, :hub_id, :current_user_id, :now.
-- `price` is the CLOSED price and `supply_kind` is the switch that decides one line or one line
-- per component (ADR-0381). The database refuses a third supply kind and refuses a single-supply
-- combo with no rate of its own, so neither can reach the till.
INSERT INTO combos_combo
  (id, hub_id, name, kitchen_name, price, tax_category_key, supply_kind, sort_order,
   is_active, is_deleted, created_by, updated_by, created_at, updated_at)
VALUES
  (:new_id, :hub_id, :name, COALESCE(:kitchen_name, ''), COALESCE(:price, 0),
   COALESCE(:tax_category_key, ''), COALESCE(:supply_kind, 'service'), COALESCE(:sort_order, 0),
   COALESCE(:is_active, 1), 0, :current_user_id, :current_user_id, :now, :now);
