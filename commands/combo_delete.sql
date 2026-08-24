-- Step 3 of 3 of `combos.combos.delete`. Soft delete: the rows stay so an already issued ticket
-- can still be read, but the combo leaves the catalogue.
UPDATE combos_combo
SET is_deleted = 1, deleted_at = :now, updated_by = :current_user_id, updated_at = :now
WHERE id = :combo_id AND hub_id = :hub_id AND is_deleted = 0;
