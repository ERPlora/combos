#!/usr/bin/env python3
"""`combos` against a REAL Postgres — the catalogue `sales` prices a menu from (ADR-0381, pm#156).

Why this file exists and why it is separate from `contract.test.py`: that one reads files, this one
RUNS them. `erplora validate --pg` only proves every statement PREPAREs; a statement can prepare
perfectly and still return the wrong rows, in the wrong order, or none at all.

What it pins, all of which are real risks:

  1. The migration APPLIES — not "parses": applies, with its indexes and its CHECKs.
  2. `supply_kind` is CLOSED. A third value is refused by the database. This is the switch that
     decides ONE line at the combo's rate (art. 91.Uno.2.2 LIVA: a menu served on the premises is
     all at 10%, wine included) versus ONE LINE PER COMPONENT with the closed price apportioned
     (art. 79.Dos). A row that reached `sales` with neither value would be priced by accident.
  3. `combos.options.all` hands `sales` EVERYTHING it needs to apportion — the closed price, the
     supply kind, the group rules and every component — and hands back EVERY row, because it is a
     price authority and not a screen.
  4. A negative `price_delta` survives the round trip: a cheaper substitution is a real menu.
  5. TENANCY WITH A LIVE NEIGHBOUR. Another hub's combos exist, in the same tables, at the same
     time — and neither hub sees the other. Seeding one hub and asserting it sees its own rows
     proves nothing about isolation.
  6. Deleting a combo takes its groups and its options with it, in ONE command. A soft-deleted
     combo whose groups survive would keep demanding a choice at the till.
  7. The parameterised reads PREPARE with REAL binds, the way the runtime does. Substituting
     literals cannot see a type-inference failure (42P08), because a literal is not a parameter.

⚠️ What this file does NOT test, on purpose: the largest-remainder apportionment itself. It cannot
live here — `combos` deliberately does not know what a `product` or a `service` is (opaque
`source_ref`, `depends_on: []`), so it has no access to the component catalogue prices the split is
proportional to. Testing it here would mean asserting against a helper written in this same file,
which proves nothing. The split is `ERPlora/sales#152`, where ADR-0210's `split_by_largest_remainder`
already lives; the golden vector is written into that issue. What this file pins is the half
`combos` owns: the dividend (the closed price) and the switch (`supply_kind`).

Usage: tests/catalog.pg.test.py   (exit 0 = green)
  Uses the `erplora-test-pg-5433` container by default (override: ERPLORA_TEST_PG_CONTAINER).
  Creates a scratch database and DROPS it at the end, pass or fail. If Docker or the container is
  missing this is SKIPPED, never passed.
"""

import os
import pathlib
import subprocess
import sys
import uuid

MODULE_DIR = pathlib.Path(__file__).resolve().parent.parent
CONTAINER = os.environ.get("ERPLORA_TEST_PG_CONTAINER", "erplora-test-pg-5433")
DB = f"combos_catalog_{uuid.uuid4().hex[:8]}"
HUB = "hub-a"
NEIGHBOUR = "hub-b"
USER = "admin-a"
NOW = "2026-08-24T10:00:00+00:00"


def psql(args: list[str], db: str | None = None, stdin: str | None = None) -> str:
    cmd = [
        "docker",
        "exec",
        "-i",
        CONTAINER,
        "psql",
        "-v",
        "ON_ERROR_STOP=1",
        "-U",
        "postgres",
        "-X",
    ]
    if db:
        cmd += ["-d", db]
    cmd += args
    res = subprocess.run(cmd, input=stdin, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip() or res.stdout.strip())
    return res.stdout


def available() -> bool:
    try:
        psql(["-c", "SELECT 1"])
        return True
    except Exception:
        return False


def lit(value) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def bind(sql: str, params: dict) -> str:
    """Substitute the runtime's named binds. Longest name first so `:group_id` never eats `:group`."""
    for name in sorted(params, key=len, reverse=True):
        sql = sql.replace(f":{name}", lit(params[name]))
    return sql


def prepare_with_binds(sql: str, order: list[str], db: str) -> str | None:
    """PREPARE the statement with REAL parameters, the way the runtime does.

    Returns None if it prepared, or the Postgres error if it did not. Named binds become `$n` in
    first-appearance order, which is precisely the order Postgres uses to infer their types.
    """
    positional = sql
    for i, name in enumerate(order, start=1):
        positional = positional.replace(f":{name}", f"${i}")
    stmt = f"prep_{uuid.uuid4().hex[:8]}"
    try:
        psql(["-c", f"PREPARE {stmt} AS {positional}"], db=db)
        return None
    except Exception as exc:  # noqa: BLE001 - the message IS the assertion here
        return str(exc)


if not available():
    print(
        f"SKIPPED: no Postgres in container `{CONTAINER}` — this is a SKIP, not a pass"
    )
    sys.exit(0)

failures: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        failures.append(message)


def cmd(path: str, params: dict, db: str) -> None:
    sql = (MODULE_DIR / "commands" / path).read_text()
    psql(["-c", bind(sql, params)], db=db)


def rows(sql_path: str, params: dict, db: str) -> list[list[str]]:
    sql = (MODULE_DIR / sql_path).read_text()
    out = psql(["-tAF", "|", "-c", bind(sql, params)], db=db).strip()
    return [r.split("|") for r in out.splitlines() if r]


psql(["-c", f'CREATE DATABASE "{DB}"'])
try:
    # --- 1 · the migration APPLIES ---------------------------------------------------------
    migration = (MODULE_DIR / "migrations" / "postgres" / "001_init.sql").read_text()
    psql(["-f", "-"], db=DB, stdin=migration)
    tables = psql(
        [
            "-tAc",
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema='public' ORDER BY table_name",
        ],
        db=DB,
    ).split()
    for t in ("combos_combo", "combos_choice_group", "combos_choice_option"):
        check(t in tables, f"{t} was not created by the migration")

    # --- 2 · supply_kind is CLOSED by the database ------------------------------------------
    base = {"hub_id": HUB, "current_user_id": USER, "now": NOW}
    menu = {
        **base,
        "new_id": "c-menu",
        "name": "Menu del dia",
        "kitchen_name": "MENU",
        "price": 1350,
        "tax_category_key": "food.onsite",
        "supply_kind": "service",
        "is_active": 1,
        "sort_order": 10,
    }
    cmd("combo_create.sql", menu, DB)
    # goods: the food shop's "sandwich + beer" at a single price — art. 79.Dos, apportioned.
    pack = {
        **base,
        "new_id": "c-pack",
        "name": "Bocadillo y cerveza",
        "kitchen_name": "",
        "price": 600,
        "tax_category_key": "product.generic",
        "supply_kind": "goods",
        "is_active": 1,
        "sort_order": 20,
    }
    cmd("combo_create.sql", pack, DB)

    refused = None
    try:
        cmd(
            "combo_create.sql",
            {
                **base,
                "new_id": "c-bad",
                "name": "Neither",
                "kitchen_name": "",
                "price": 100,
                "tax_category_key": "x",
                "supply_kind": "mixed",
                "is_active": 1,
                "sort_order": 99,
            },
            DB,
        )
    except Exception as exc:  # noqa: BLE001 - the refusal IS the assertion
        refused = str(exc)
    check(
        refused is not None and "supply_kind" in refused,
        "a supply_kind outside ('service','goods') must be refused by the database: a third value "
        f"means neither branch of ADR-0381 and the sale gets priced by accident (got {refused!r})",
    )

    # --- seed the two menus ------------------------------------------------------------------
    cmd(
        "group_create.sql",
        {
            **base,
            "new_id": "g-first",
            "combo_id": "c-menu",
            "name": "Primero",
            "min_choices": 1,
            "max_choices": 1,
            "allow_repeat": 0,
            "sort_order": 10,
        },
        DB,
    )
    cmd(
        "group_create.sql",
        {
            **base,
            "new_id": "g-drink",
            "combo_id": "c-menu",
            "name": "Bebida",
            "min_choices": 1,
            "max_choices": 1,
            "allow_repeat": 0,
            "sort_order": 20,
        },
        DB,
    )
    cmd(
        "option_create.sql",
        {
            **base,
            "new_id": "o-soup",
            "group_id": "g-first",
            "source": "product",
            "source_ref": "prod-soup",
            "price_delta": 0,
            "sort_order": 10,
        },
        DB,
    )
    # A cheaper substitution: the delta may be NEGATIVE.
    cmd(
        "option_create.sql",
        {
            **base,
            "new_id": "o-salad",
            "group_id": "g-first",
            "source": "product",
            "source_ref": "prod-salad",
            "price_delta": -50,
            "sort_order": 20,
        },
        DB,
    )
    cmd(
        "option_create.sql",
        {
            **base,
            "new_id": "o-wine",
            "group_id": "g-drink",
            "source": "product",
            "source_ref": "prod-wine",
            "price_delta": 0,
            "sort_order": 10,
        },
        DB,
    )
    # The goods pack: two components at DIFFERENT rates — this is the apportionment case.
    cmd(
        "group_create.sql",
        {
            **base,
            "new_id": "g-food",
            "combo_id": "c-pack",
            "name": "Bocadillo",
            "min_choices": 1,
            "max_choices": 1,
            "allow_repeat": 0,
            "sort_order": 10,
        },
        DB,
    )
    cmd(
        "group_create.sql",
        {
            **base,
            "new_id": "g-beer",
            "combo_id": "c-pack",
            "name": "Bebida",
            "min_choices": 1,
            "max_choices": 1,
            "allow_repeat": 0,
            "sort_order": 20,
        },
        DB,
    )
    cmd(
        "option_create.sql",
        {
            **base,
            "new_id": "o-sandwich",
            "group_id": "g-food",
            "source": "product",
            "source_ref": "prod-sandwich",
            "price_delta": 0,
            "sort_order": 10,
        },
        DB,
    )
    cmd(
        "option_create.sql",
        {
            **base,
            "new_id": "o-beer",
            "group_id": "g-beer",
            "source": "product",
            "source_ref": "prod-beer",
            "price_delta": 0,
            "sort_order": 10,
        },
        DB,
    )
    # A service pack of the salon vertical, to prove `service`/`goods` coexist and that a component
    # can be a SERVICE without this module ever learning what a service is.
    cmd(
        "combo_create.sql",
        {
            **base,
            "new_id": "c-salon",
            "name": "Corte y color",
            "kitchen_name": "",
            "price": 6000,
            "tax_category_key": "service.generic",
            "supply_kind": "service",
            "is_active": 1,
            "sort_order": 30,
        },
        DB,
    )
    cmd(
        "group_create.sql",
        {
            **base,
            "new_id": "g-salon",
            "combo_id": "c-salon",
            "name": "Servicios",
            "min_choices": 2,
            "max_choices": 2,
            "allow_repeat": 0,
            "sort_order": 10,
        },
        DB,
    )
    cmd(
        "option_create.sql",
        {
            **base,
            "new_id": "o-cut",
            "group_id": "g-salon",
            "source": "service",
            "source_ref": "svc-cut",
            "price_delta": 0,
            "sort_order": 10,
        },
        DB,
    )
    # An inactive combo: it must not reach the till, but its rows must still exist.
    cmd(
        "combo_create.sql",
        {
            **base,
            "new_id": "c-old",
            "name": "Menu retirado",
            "kitchen_name": "",
            "price": 900,
            "tax_category_key": "food.onsite",
            "supply_kind": "service",
            "is_active": 0,
            "sort_order": 40,
        },
        DB,
    )

    # --- 5 · A LIVE NEIGHBOUR, seeded through the same door ----------------------------------
    other = {"hub_id": NEIGHBOUR, "current_user_id": "admin-b", "now": NOW}
    cmd(
        "combo_create.sql",
        {
            **other,
            "new_id": "c-neighbour",
            "name": "Menu del vecino",
            "kitchen_name": "",
            "price": 9999,
            "tax_category_key": "food.onsite",
            "supply_kind": "service",
            "is_active": 1,
            "sort_order": 10,
        },
        DB,
    )
    cmd(
        "group_create.sql",
        {
            **other,
            "new_id": "g-neighbour",
            "combo_id": "c-neighbour",
            "name": "Unico",
            "min_choices": 1,
            "max_choices": 1,
            "allow_repeat": 0,
            "sort_order": 10,
        },
        DB,
    )
    cmd(
        "option_create.sql",
        {
            **other,
            "new_id": "o-neighbour",
            "group_id": "g-neighbour",
            "source": "product",
            "source_ref": "prod-secret",
            "price_delta": 0,
            "sort_order": 10,
        },
        DB,
    )

    # --- 3 · combos.combos.all: the sellable catalogue ----------------------------------------
    # Column order of queries/combos_all.sql:
    #   0 combo_id · 1 name · 2 kitchen_name · 3 price · 4 tax_category_key · 5 supply_kind
    #   6 sort_order
    catalogue = rows("queries/combos_all.sql", {"hub_id": HUB}, DB)
    ids = [r[0] for r in catalogue]
    check(
        ids == ["c-menu", "c-pack", "c-salon"],
        f"combos.combos.all must return the three ACTIVE combos in sort order, got {ids}",
    )
    check(
        "c-old" not in ids,
        "an inactive combo must not reach the till through combos.combos.all",
    )
    check(
        "c-neighbour" not in ids,
        "combos.combos.all leaked another hub's combo — the neighbour is alive in these tables",
    )
    by_id = {r[0]: r for r in catalogue}
    if "c-menu" in by_id:
        check(
            by_id["c-menu"][3] == "1350",
            f"the CLOSED price must travel intact, got {by_id['c-menu'][3]}",
        )
        check(
            by_id["c-menu"][5] == "service",
            "a menu served on the premises is a single supply: supply_kind must travel",
        )
        check(
            by_id["c-menu"][4] == "food.onsite",
            "the combo's own tax category must travel — it is the rate of the single line",
        )
    if "c-pack" in by_id:
        check(
            by_id["c-pack"][5] == "goods",
            "the shop pack is a supply of goods of diverse nature: it must come back as `goods`, "
            "which is what makes `sales` apportion instead of charging one rate",
        )

    # --- 3b · combos.options.all: everything the apportionment needs, and EVERY row -----------
    # Column order of queries/options_all.sql:
    #   0 option_id · 1 group_id · 2 combo_id · 3 combo_name · 4 combo_kitchen_name
    #   5 combo_price · 6 combo_tax_category_key · 7 supply_kind · 8 combo_is_active
    #   9 group_name · 10 min_choices · 11 max_choices · 12 allow_repeat · 13 group_sort_order
    #   14 source · 15 source_ref · 16 price_delta · 17 option_sort_order
    options = rows("queries/options_all.sql", {"hub_id": HUB}, DB)
    seeded = psql(
        [
            "-tAc",
            f"SELECT count(*) FROM combos_choice_option "
            f"WHERE hub_id = '{HUB}' AND is_deleted = 0",
        ],
        db=DB,
    ).strip()
    check(
        len(options) == int(seeded),
        f"combos.options.all must return EVERY option ({seeded} seeded), got {len(options)} — a "
        f"price authority that hands back a page is a hole, not a display bug (hub#650)",
    )
    opt = {r[0]: r for r in options}
    check(
        "o-neighbour" not in opt,
        "combos.options.all leaked another hub's option — the neighbour is alive in these tables",
    )

    # --- 4 · a negative delta survives --------------------------------------------------------
    check(
        "o-salad" in opt and opt["o-salad"][16] == "-50",
        f"a negative price_delta must survive: a cheaper substitution is a real menu, got "
        f"{opt.get('o-salad', ['?'] * 17)[16] if 'o-salad' in opt else 'missing'}",
    )

    # --- what `sales#152` reads to apportion --------------------------------------------------
    pack_options = [r for r in options if r[2] == "c-pack"]
    check(
        len(pack_options) == 2,
        f"the goods pack must expose its two components, got {len(pack_options)}",
    )
    for r in pack_options:
        check(
            r[5] == "600",
            f"every component row must carry the CLOSED price (the dividend of "
            f"the apportionment), got {r[5]}",
        )
        check(
            r[7] == "goods",
            f"every component row must carry the supply kind (the switch), got {r[7]}",
        )
        check(
            r[14] == "product" and r[15].startswith("prod-"),
            f"the component must arrive as an OPAQUE source/source_ref, got {r[14]}/{r[15]}",
        )
    check(
        sorted(r[15] for r in pack_options) == ["prod-beer", "prod-sandwich"],
        f"both components must be reachable, got {sorted(r[15] for r in pack_options)}",
    )

    # A service component proves the opaque reference carries a second world.
    salon = [r for r in options if r[2] == "c-salon"]
    check(
        len(salon) == 1 and salon[0][14] == "service",
        "a component may be a SERVICE, and this module still does not know what a service is",
    )

    # Group rules travel: min_choices IS the obligation.
    if "o-soup" in opt:
        check(
            opt["o-soup"][10] == "1",
            "min_choices must travel: >= 1 IS 'required', and it blocks sending to the kitchen",
        )
        check(opt["o-soup"][11] == "1", "max_choices must travel")

    # An inactive combo's options still come back, FLAGGED — so `sales` refuses loudly instead of
    # reporting an unknown option.
    check(
        all(r[8] == "1" for r in options if r[2] != "c-old"),
        "active combos must report combo_is_active = 1",
    )

    # --- 7 · the parameterised reads PREPARE with REAL binds ----------------------------------
    for path, order in (
        ("queries/combos_get.sql", ["hub_id", "combo_id"]),
        ("queries/groups_list.sql", ["hub_id", "combo_id"]),
        ("queries/options_list.sql", ["hub_id", "group_id"]),
        ("queries/combos_all.sql", ["hub_id"]),
        ("queries/options_all.sql", ["hub_id"]),
    ):
        err = prepare_with_binds((MODULE_DIR / path).read_text(), order, DB)
        check(
            err is None,
            f"{path} does not PREPARE with real binds — this is what the runtime "
            f"does, and it is how a query dies in every hub: {err}",
        )

    # --- and the check detects the positive ---------------------------------------------------
    check(
        rows(
            "queries/groups_list.sql", {"hub_id": HUB, "combo_id": "c-nonexistent"}, DB
        )
        == [],
        "an unknown combo must return no groups (control: the query is not returning everything "
        "regardless of its parameter)",
    )
    check(
        len(rows("queries/groups_list.sql", {"hub_id": HUB, "combo_id": "c-menu"}, DB))
        == 2,
        "control: the same query DOES find the two groups of the menu, so the empty result "
        "above means something",
    )

    # --- 5b · the neighbour sees ITS OWN, and only its own -------------------------------------
    neighbour_catalogue = rows("queries/combos_all.sql", {"hub_id": NEIGHBOUR}, DB)
    check(
        [r[0] for r in neighbour_catalogue] == ["c-neighbour"],
        f"the neighbour must see exactly its own combo, got "
        f"{[r[0] for r in neighbour_catalogue]} — if this is empty the isolation above proves "
        f"nothing, because there would be nothing to leak",
    )

    # --- 6 · deleting a combo takes its groups and options with it ----------------------------
    for statement in (
        "combo_delete_options.sql",
        "combo_delete_groups.sql",
        "combo_delete.sql",
    ):
        cmd(statement, {**base, "combo_id": "c-menu"}, DB)
    after = rows("queries/combos_all.sql", {"hub_id": HUB}, DB)
    check(
        "c-menu" not in [r[0] for r in after],
        "a deleted combo must leave the catalogue",
    )
    left = rows("queries/options_all.sql", {"hub_id": HUB}, DB)
    check(
        not [r for r in left if r[2] == "c-menu"],
        "deleting a combo must take its options with it — a surviving group would keep demanding "
        "a choice at the till for a menu that no longer exists",
    )
    check(
        rows("queries/groups_list.sql", {"hub_id": HUB, "combo_id": "c-menu"}, DB)
        == [],
        "deleting a combo must take its groups with it",
    )
    check(
        [r[0] for r in rows("queries/combos_all.sql", {"hub_id": NEIGHBOUR}, DB)]
        == ["c-neighbour"],
        "deleting this hub's combo must not touch the neighbour's",
    )
finally:
    psql(["-c", f'DROP DATABASE IF EXISTS "{DB}" WITH (FORCE)'])

if failures:
    print(
        f"✗ {len(failures)} failure(s) running combos against Postgres:",
        file=sys.stderr,
    )
    for f in failures:
        print(f"  - {f}", file=sys.stderr)
    sys.exit(1)

print(
    "✓ combos on real Postgres: the migration applies, supply_kind is closed by the database, "
    "the catalogue reads hand back every row with the closed price and the switch, a negative "
    "delta survives, a live neighbour sees only its own, deleting a combo takes its groups and "
    "options with it, and every parameterised read PREPAREs with real binds"
)
