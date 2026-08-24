-- Step 2 of 2 of `combos.groups.delete`. Soft delete of the course itself.
UPDATE combos_choice_group
SET is_deleted = 1, deleted_at = :now, updated_by = :current_user_id, updated_at = :now
WHERE id = :group_id AND hub_id = :hub_id AND is_deleted = 0;
