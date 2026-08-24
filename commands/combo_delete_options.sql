-- Step 1 of 3 of `combos.combos.delete`, which runs as ONE transaction. Options go FIRST, while
-- their courses are still findable: a soft delete does not fire the cascade of the foreign key, so
-- the children have to be taken down explicitly, deepest first.
-- Split across three files because Postgres prepares each file as ONE statement.
UPDATE combos_choice_option
SET is_deleted = 1, deleted_at = :now, updated_by = :current_user_id, updated_at = :now
WHERE hub_id = :hub_id
  AND is_deleted = 0
  AND group_id IN (
    SELECT id FROM combos_choice_group WHERE hub_id = :hub_id AND combo_id = :combo_id
  );
