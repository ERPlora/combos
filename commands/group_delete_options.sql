-- Step 1 of 2 of `combos.groups.delete`, which runs as ONE transaction. The options go first,
-- while their course is still findable.
UPDATE combos_choice_option
SET is_deleted = 1, deleted_at = :now, updated_by = :current_user_id, updated_at = :now
WHERE hub_id = :hub_id AND group_id = :group_id AND is_deleted = 0;
