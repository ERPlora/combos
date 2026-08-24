-- The options of one course. The component is an OPAQUE reference: whoever sells is who knows what
-- `source_ref` means, and resolving it to a name is the caller's job, not this module's.
SELECT
  id           AS option_id,
  group_id     AS group_id,
  source       AS source,
  source_ref   AS source_ref,
  price_delta  AS price_delta,
  sort_order   AS sort_order
FROM combos_choice_option
WHERE hub_id = :hub_id AND group_id = :group_id AND is_deleted = 0
ORDER BY sort_order, source_ref, id
