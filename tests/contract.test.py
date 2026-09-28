#!/usr/bin/env python3
"""Contract test for `combos` (ADR-0381, pm#156) — the decisions that, if undone, make this the
wrong module.

Why a contract test and not a smoke test: every rule below was settled by a 13-reference market
sweep plus the letter of art. 79.Dos LIVA, and each one could be quietly reverted by a later edit
without anything else in the hub complaining. `erplora validate --pg` proves the SQL prepares; it
has no opinion about whether the module still means what the ADR decided.

  1. ZERO DEPENDENCIES, OPAQUE REFERENCE. A combo component is `source` + `source_ref`, with NO
     foreign key into another module's tables and NO `depends_on`. This is not tidiness: a hair
     salon pack ("cut + colour + treatment, 60 EUR") is made of `services`, and `services` does not
     depend on `inventory`. Hanging combos off the product catalogue would force a salon to install
     the product module. Same argument ADR-0376 already accepted.

  2. OBLIGATION IS A NUMBER, NOT A FLAG. `min_choices >= 1` IS "required". Clover models it this
     way; Square is the cautionary tale, where "can only select one" ALSO forces a minimum of one
     and an optional group silently becomes mandatory. A `required` column reintroduces that bug.

  3. `supply_kind` IS THE SWITCH, AND THE COMBO DECLARES IT. `service` = single supply, the
     accessory exception of art. 79.Dos, ONE line at the combo's own rate (a Spanish menu del dia
     served on the premises is 10% including the wine, art. 91.Uno.2.2 LIVA). `goods` = supply of
     goods of diverse nature, apportioned into ONE LINE PER COMPONENT. The POS must never guess it
     from how the components happen to be tagged: accessoriness is a legal position of the
     business. A CHECK constraint pins the two values because a third one would silently mean
     "neither branch".

  4. THE PRICE IS CLOSED AND IT LIVES HERE. `price` is the whole point of a combo, and it is the
     dividend of the apportionment in `sales`. `price_delta` on an option is a supplement on the
     CLOSED price, never on the component, and may be negative.

  5. NO STOCK, NO COST, NO PARENT LINE. Stock is moved by the components (unanimous in the market:
     Odoo kit, Shopify, WooCommerce, Square, Holded, NetSuite) — that is inventory#69, not this
     module. And nothing here may materialise a parent line: Odoo's documented failure is that the
     apportioned combo shows up at 0 EUR in the sales report and looks like a giveaway.

  6. THE FULL-CATALOGUE READS ARE NOT PAGINATED. `combos.combos.all` and `combos.options.all` are
     the price authority `sales` reads instead of trusting the payload (the lesson of sales#68). A
     `list` block would hand the handler the first 50 rows and stay silent about the rest (hub#650)
     — for a price authority that is a hole, not a display bug.

Usage: tests/contract.test.py   (exit 0 = green)
"""

import json
import pathlib
import re
import sys

MODULE_DIR = pathlib.Path(__file__).resolve().parent.parent
MANIFEST = MODULE_DIR / "module.json"
MIGRATION = MODULE_DIR / "migrations" / "postgres" / "001_init.sql"

failures: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        failures.append(message)


if not MANIFEST.exists():
    print(f"✗ {MANIFEST} does not exist", file=sys.stderr)
    sys.exit(1)

manifest = json.loads(MANIFEST.read_text())
sql = MIGRATION.read_text() if MIGRATION.exists() else ""


def table_body(name: str) -> str:
    """The text between `CREATE TABLE ... name (` and the matching close, or '' if absent."""
    m = re.search(rf"CREATE TABLE IF NOT EXISTS {name}\s*\((.*?)\n\);", sql, re.S)
    return m.group(1) if m else ""


combo = table_body("combos_combo")
group = table_body("combos_choice_group")
option = table_body("combos_choice_option")

check(bool(combo), "combos_combo does not exist in 001_init.sql")
check(bool(group), "combos_choice_group does not exist in 001_init.sql")
check(bool(option), "combos_choice_option does not exist in 001_init.sql")

# --- 1 · zero dependencies, opaque reference -------------------------------------------------
check(
    manifest.get("depends_on") == [],
    f"depends_on must be exactly [] — a salon pack is made of `services`, which does not depend "
    f"on `inventory`; got {manifest.get('depends_on')!r}",
)
check(
    "source" in option and "source_ref" in option,
    "combos_choice_option must reference the sellable article opaquely: source + source_ref",
)
check(
    not re.search(r"REFERENCES\s+(?!combos_)", sql),
    "no table here may carry a foreign key into another module's tables — that is a hard "
    "dependency in disguise",
)
# Every table any statement of this module touches must be one of ours. This is the precise
# form of "zero dependencies": reading another module's table is a hard dependency that no
# `depends_on: []` can undo, and it is invisible to the manifest schema.
TABLE_REF = re.compile(
    r"\b(?:FROM|JOIN|UPDATE|INSERT\s+INTO|REFERENCES)\s+([a-zA-Z_][a-zA-Z0-9_]*)", re.I
)


def strip_sql_comments(text: str) -> str:
    """Drop `--` comments before reading table names.

    Without this the WORDS of the prose are read as tables: `FROM the`, `UPDATE now`. Same
    reason the toolkit's own migration guard strips them first. A string literal is opaque and
    is kept, because `'a--b'` is data, not a comment.
    """
    out, in_string, i = [], False, 0
    while i < len(text):
        ch = text[i]
        if in_string:
            out.append(ch)
            if ch == "'":
                in_string = False
        elif ch == "'":
            in_string = True
            out.append(ch)
        elif ch == "-" and text[i : i + 2] == "--":
            while i < len(text) and text[i] != "\n":
                i += 1
            continue
        else:
            out.append(ch)
        i += 1
    return "".join(out)


def touched_tables(text: str) -> set[str]:
    return {m.group(1).lower() for m in TABLE_REF.finditer(strip_sql_comments(text))}


every_sql = [sql]
for block in ("queries", "commands"):
    for name, spec in (manifest.get(block) or {}).items():
        paths = spec.get("sql")
        for rel in [paths] if isinstance(paths, str) else (paths or []):
            path = MODULE_DIR / rel
            if path.exists():
                every_sql.append(path.read_text())
for text in every_sql:
    for table in touched_tables(text):
        check(
            table.startswith("combos_"),
            f"a statement of this module touches `{table}` — reading or writing another module's "
            f"table is a hard dependency that `depends_on: []` cannot undo",
        )

# And every name this module publishes lives in its own namespace, so nothing here can shadow or
# impersonate another module's query or command.
for block in ("queries", "commands"):
    for name in (manifest.get(block) or {}):
        check(name.startswith("combos."),
              f"`{name}` is outside the `combos.` namespace")
for event in set((manifest.get("events") or {}).get("emits") or []):
    check(event.startswith("combos."), f"`{event}` is outside the `combos.` namespace")

# --- 2 · obligation is a number, not a flag ---------------------------------------------------
check(
    "min_choices" in group,
    "combos_choice_group must declare min_choices (>= 1 IS 'required')",
)
check(
    "max_choices" in group,
    "combos_choice_group must declare max_choices (0 = no ceiling)",
)
check("allow_repeat" in group, "combos_choice_group must declare allow_repeat")
check(
    not re.search(r"\brequired\b", sql, re.I),
    "nothing here may carry a `required` flag: obligation is min_choices >= 1 (Clover's rule; "
    "Square's dual-effect control is the bug this avoids)",
)

# --- 3 · supply_kind is the switch, and it is closed ------------------------------------------
check("supply_kind" in combo, "combos_combo must declare supply_kind (service | goods)")
check(
    re.search(
        r"supply_kind[^,]*CHECK\s*\(\s*supply_kind\s+IN\s*\(\s*'service'\s*,\s*'goods'\s*\)",
        combo,
        re.S | re.I,
    )
    or re.search(
        r"CHECK\s*\(\s*supply_kind\s+IN\s*\(\s*'service'\s*,\s*'goods'\s*\)", sql, re.I
    ),
    "supply_kind must be closed by a CHECK to ('service','goods'): a third value would mean "
    "neither branch of ADR-0381 and the sale would be priced by accident",
)
check(
    "tax_category_key" in combo,
    "combos_combo must declare tax_category_key — the rate of the single line when supply_kind "
    "is 'service' (art. 91.Uno.2.2 LIVA: a menu served on the premises is all at 10%)",
)
check(
    "supply_kind" not in group and "supply_kind" not in option,
    "supply_kind belongs to the COMBO, not to a group or an option: accessoriness is a legal "
    "position of the business, not a consequence of how the components are tagged",
)

# --- 4 · the price is closed, and the delta rides on it ---------------------------------------
check("price" in combo, "combos_combo must declare price (the CLOSED price)")
check(
    "price_delta" in option,
    "combos_choice_option must declare price_delta (a supplement on the CLOSED price, may be "
    "negative)",
)
check(
    not re.search(r"price_delta[^,\n]*(CHECK[^,\n]*>=\s*0|UNSIGNED)", option, re.I),
    "price_delta must be allowed to go negative (a cheaper substitution is a real menu)",
)

# --- 5 · no stock, no cost, no parent line ----------------------------------------------------
for forbidden in ("stock", "cost", "quantity"):
    check(
        not re.search(rf"\b{forbidden}\b", sql, re.I),
        f"nothing here may declare `{forbidden}`: stock is moved by the COMPONENTS "
        f"(inventory#69), never by the combo",
    )
check(
    not re.search(r"parent_line|line_id|sale_item", sql, re.I),
    "combos must not materialise a sale line: the lines are siblings created by `sales`, and a "
    "parent line at 0 EUR is Odoo's documented failure (the combo looks given away in reports)",
)

# --- 6 · the full-catalogue reads are not paginated -------------------------------------------
queries = manifest.get("queries") or {}
for name, must_return in (
    ("combos.combos.all", ("price", "supply_kind", "tax_category_key")),
    (
        "combos.options.all",
        ("source", "source_ref", "price_delta", "combo_id", "min_choices"),
    ),
):
    spec = queries.get(name)
    check(
        bool(spec),
        f"{name} is missing: without a parameterless catalogue read, `sales` has no "
        f"way to price a combo and would have to trust the payload (sales#68)",
    )
    if not spec:
        continue
    check(
        "list" not in spec,
        f"{name} must NOT declare a `list` block: a paginated read hands the handler the first 50 "
        f"rows and stays silent about the rest (hub#650) — a price-authority hole, not a display "
        f"bug",
    )
    rel = spec.get("sql")
    body = (MODULE_DIR / rel).read_text() if rel and (MODULE_DIR / rel).exists() else ""
    for column in must_return:
        check(column in body, f"{name} must return {column}")

# --- every emitted event is declared ----------------------------------------------------------
# A handler emitting an event its module does not declare makes the whole command FAIL at runtime,
# and it is discovered in production. Cheap to check here.
declared = set((manifest.get("events") or {}).get("emits") or [])
for cmd, spec in (manifest.get("commands") or {}).items():
    for event in spec.get("emit") or []:
        check(
            event in declared,
            f"{cmd} emits `{event}` but events.emits does not declare it — the runtime fails the "
            f"whole command when that happens",
        )

# --- every declared file exists ----------------------------------------------------------------
for block in ("queries", "commands"):
    for name, spec in (manifest.get(block) or {}).items():
        paths = spec.get("sql")
        for rel in [paths] if isinstance(paths, str) else (paths or []):
            check(
                (MODULE_DIR / rel).exists(),
                f"{name} points at {rel}, which is not in the package",
            )
        schema = spec.get("schema")
        if schema:
            check(
                (MODULE_DIR / schema).exists(),
                f"{name} points at schema {schema}, which is not in the package",
            )

# --- every command declares a payload schema ---------------------------------------------------
for name, spec in (manifest.get("commands") or {}).items():
    check(
        bool(spec.get("schema")),
        f"{name} declares no payload schema: the handler would be trusting whatever arrives",
    )

# --- the migration guard traps -----------------------------------------------------------------
# A `;` inside a `--` comment makes the migration guard of the tags the fleet runs REJECT the whole
# module at install time, and `erplora validate` does not catch it (module-toolkit#70, hub#1027).
for n, line in enumerate(sql.splitlines(), 1):
    stripped = line.strip()
    if stripped.startswith("--") and ";" in stripped:
        failures.append(
            f"001_init.sql:{n}: a `;` inside a `--` comment makes the migration guard REJECT the "
            f"whole module at install time"
        )
# `expand` (a bare path) admits no DROP/TRUNCATE/DELETE FROM/SET NOT NULL.
for forbidden in ("DROP ", "TRUNCATE", "DELETE FROM", "SET NOT NULL"):
    check(
        forbidden not in sql.upper(),
        f"001_init.sql declares `{forbidden.strip()}` — an `expand` migration admits none of it",
    )

# --- tenancy: every table carries hub_id, every statement scopes by it -------------------------
for name, body in (
    ("combos_combo", combo),
    ("combos_choice_group", group),
    ("combos_choice_option", option),
):
    check("hub_id" in body, f"{name} must carry hub_id — it is not optional")
for block in ("queries", "commands"):
    for name, spec in (manifest.get(block) or {}).items():
        paths = spec.get("sql")
        for rel in [paths] if isinstance(paths, str) else (paths or []):
            path = MODULE_DIR / rel
            if not path.exists():
                continue
            check(
                ":hub_id" in path.read_text(),
                f"{rel} ({name}) never mentions :hub_id — a read or a write that is not scoped "
                f"to the tenant is a cross-hub leak",
            )

# 7. THE SIGN OF TYPED MONEY IS SETTLED AT THE DOOR TOO (pm#521). The screen reads typed money with
#    the toolkit's money-input, which KEEPS the sign; the screen refuses a negative price in words,
#    and the command schemas are the door every other caller (the assistant, a flow, the API) goes
#    through. A price is `minimum: 0` — 0 is allowed, exactly like CHECK (price >= 0), so neither
#    `exclusiveMinimum` nor `minimum: 1` — and a supplement has NO floor (rule 4).
SCHEMAS = MODULE_DIR / "schemas"
for name in ("combo_create", "combo_update"):
    price = (
        json.loads((SCHEMAS / f"{name}.json").read_text())["properties"].get("price")
        or {}
    )
    check(
        price.get("minimum") == 0 and "exclusiveMinimum" not in price,
        f"schemas/{name}.json: price must be `minimum: 0` (a negative menu price reaches the "
        f"CHECK as a raw error; a free one is allowed), got {price}",
    )
for name in ("option_create", "option_update"):
    delta = (
        json.loads((SCHEMAS / f"{name}.json").read_text())["properties"].get(
            "price_delta"
        )
        or {}
    )
    check(
        delta.get("type") == "integer"
        and "minimum" not in delta
        and "exclusiveMinimum" not in delta,
        f"schemas/{name}.json: price_delta is an integer with NO floor (a cheaper substitution "
        f"is a real menu), got {delta}",
    )

if failures:
    print(f"✗ {len(failures)} contract failure(s):", file=sys.stderr)
    for f in failures:
        print(f"  - {f}", file=sys.stderr)
    sys.exit(1)

print(
    "✓ combos contract (ADR-0381): zero dependencies and an opaque component reference, "
    "obligation is a number, supply_kind is a closed switch declared by the combo, the price is "
    "closed and the delta may be negative, no stock/cost/parent line, the catalogue reads are "
    "not paginated, every event is declared and every row is scoped by hub_id"
)
