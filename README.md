# combos

Módulo ERPlora (declarativo). Repo independiente; se desarrolla dentro de un workspace creado con
`erplora startproject`.

Dueño único del **artículo compuesto vendible a precio cerrado** —menú del día, pack de tienda,
paquete de salón— y de sus **grupos de elección**, para todo lo que se vende. Decisión: **ADR-0381**
(`architecture/modules/combos.md`).

- `module.json` — manifest (queries/commands/permisos/eventos). **`depends_on: []`**: el componente
  es una referencia **opaca** (`source`/`source_ref`), así que este módulo nunca aprende qué es un
  producto ni un servicio reservable.
- `migrations/postgres/001_init.sql` — las tres tablas: `combos_combo`, `combos_choice_group`,
  `combos_choice_option`.
- `queries/`, `commands/` — SQL declarativo (Postgres; ADR-0154 retiró SQLite).
- `tests/` — el contrato (`contract.test.py`) y la batería contra Postgres real
  (`catalog.pg.test.py`).

## Lo que decide el modelo

- **Un combo no es una línea: es un GRUPO de líneas hermanas**, y cuántas tenga lo decide cuántos
  **tipos impositivos** distintos hay dentro, nunca cuántos componentes se eligieron.
  `supply_kind = 'service'` → **una** línea al tipo del combo (art. 91.Uno.2.2 LIVA: un menú servido
  en el local va entero al 10 %, vino incluido). `supply_kind = 'goods'` → **una línea por
  componente**, con el precio cerrado repartido en proporción al precio de catálogo (art. 79.Dos).
- **`min_choices >= 1` ES «obligatorio»** — no hay flag `required`, a propósito.
- **`price_delta` puede ser negativo** y suma al **precio cerrado**, nunca al componente.

## Lo que este módulo NO hace

| | Dónde vive |
|---|---|
| Pantalla de administración | `ERPlora/pm#157` |
| Armar el combo y repartir la base | `ERPlora/sales#152` |
| Picker del menú en el TPV | `ERPlora/sales#153` |
| Menú en el tique y en la cuenta | `ERPlora/sales#154` |
| Cada componente a SU estación | `ERPlora/kitchen#57` |
| Mover existencias de los componentes | `ERPlora/inventory#69` |

```sh
erplora validate combos --pg   # manifest + PREPARE de cada sentencia
erplora test combos            # contrato + batería de Postgres
erplora pack combos            # module.zip + manifest.lock + SHA256
```
