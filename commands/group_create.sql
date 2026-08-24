-- Adds a course to a combo. `min_choices >= 1` IS the obligation -- no separate flag is declared
-- (Clover's rule; Square's one-control-two-effects is the documented bug this avoids).
-- `max_choices = 0` means no ceiling; the database refuses a ceiling below the floor.
INSERT INTO combos_choice_group
  (id, hub_id, combo_id, name, min_choices, max_choices, allow_repeat, sort_order,
   is_deleted, created_by, updated_by, created_at, updated_at)
VALUES
  (:new_id, :hub_id, :combo_id, :name, COALESCE(:min_choices, 1), COALESCE(:max_choices, 1),
   COALESCE(:allow_repeat, 0), COALESCE(:sort_order, 0),
   0, :current_user_id, :current_user_id, :now, :now);
