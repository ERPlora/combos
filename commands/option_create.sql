-- Adds a component to a course. `source`/`source_ref` is an OPAQUE reference to the sellable
-- article: this module never learns what a product or a bookable service is, which is why it
-- declares no dependency in either direction (ADR-0381).
-- `price_delta` is the supplement for substituting, in the whole unit of the money contract. It
-- may be negative, and it adds to the CLOSED price of the combo, never to the component.
INSERT INTO combos_choice_option
  (id, hub_id, group_id, source, source_ref, price_delta, sort_order,
   is_deleted, created_by, updated_by, created_at, updated_at)
VALUES
  (:new_id, :hub_id, :group_id, :source, :source_ref, COALESCE(:price_delta, 0),
   COALESCE(:sort_order, 0),
   0, :current_user_id, :current_user_id, :now, :now);
