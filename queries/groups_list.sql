-- The courses of one combo, in presentation order.
-- `min_choices >= 1` IS the obligation -- there is no separate flag, on purpose (Clover's rule).
-- `max_choices = 0` means no ceiling.
SELECT
  id            AS group_id,
  combo_id      AS combo_id,
  name          AS name,
  min_choices   AS min_choices,
  max_choices   AS max_choices,
  allow_repeat  AS allow_repeat,
  sort_order    AS sort_order
FROM combos_choice_group
WHERE hub_id = :hub_id AND combo_id = :combo_id AND is_deleted = 0
ORDER BY sort_order, name, id
