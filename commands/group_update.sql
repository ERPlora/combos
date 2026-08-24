-- Edits a course. The combo it belongs to is not editable here: a course is part of ONE menu, and
-- moving it to another one is a different menu, not an edit.
UPDATE combos_choice_group SET
  name = :name,
  min_choices = COALESCE(:min_choices, 1),
  max_choices = COALESCE(:max_choices, 1),
  allow_repeat = COALESCE(:allow_repeat, 0),
  sort_order = COALESCE(:sort_order, 0),
  updated_by = :current_user_id,
  updated_at = :now
WHERE id = :group_id AND hub_id = :hub_id AND is_deleted = 0;
