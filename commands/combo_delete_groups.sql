-- Step 2 of 3 of `combos.combos.delete`. A course that survived its combo would keep demanding a
-- choice at the till for a menu that no longer exists.
UPDATE combos_choice_group
SET is_deleted = 1, deleted_at = :now, updated_by = :current_user_id, updated_at = :now
WHERE hub_id = :hub_id AND combo_id = :combo_id AND is_deleted = 0;
