-- Edits a component. The course it belongs to is not editable here, for the same reason a course
-- does not change combo: it would be a different menu, not an edit.
UPDATE combos_choice_option SET
  source = :source,
  source_ref = :source_ref,
  price_delta = COALESCE(:price_delta, 0),
  sort_order = COALESCE(:sort_order, 0),
  updated_by = :current_user_id,
  updated_at = :now
WHERE id = :option_id AND hub_id = :hub_id AND is_deleted = 0;
