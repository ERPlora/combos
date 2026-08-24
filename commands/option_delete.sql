-- Soft delete of one component. The unique index that keeps the same article from being declared
-- twice in a course only looks at live rows, so the same component can be added again afterwards.
UPDATE combos_choice_option
SET is_deleted = 1, deleted_at = :now, updated_by = :current_user_id, updated_at = :now
WHERE id = :option_id AND hub_id = :hub_id AND is_deleted = 0;
