# WORKFLOW — Menús y combos

Prefijo: COMBOS
Alcance MVP: restaurante

> Contrato de comportamiento del módulo (pm#620, pm#621). Se lee antes de tocar el código y se
> actualiza en la misma PR que cambie un comportamiento. El detalle técnico vive en
> `architecture/modules/combos.md`; aquí se escribe lo que ve y hace la persona.

## Para qué sirve y para quién

Menús y combos guarda los artículos compuestos que se venden a **precio cerrado**: el menú del día
(«primero + segundo + postre + bebida por 13,50 €»), un pack de tienda o un paquete de servicios. Cada
menú tiene **platos** (grupos de elección: Primero, Segundo, Bebida…) con su mínimo y su máximo, y cada
plato ofrece **elecciones**: artículos reales del catálogo, con un suplemento por sustituir. Lo
configura el **responsable** o el **administrador**; el **empleado** puede consultarlo. Quien lo usa a
diario es el **cajero** o la camarera en el TPV, y quien lo paga es el cliente, con el IVA que el
negocio declara. Este módulo guarda el menú; **Venta** lo pregunta, lo cobra y reparte su IVA,
**Inventario** baja el stock de cada plato y **Cocina** lo recibe. No es un descuento ni una variante, y
no es el catálogo de «extras» de un plato (eso es Modificadores).

## Referencia adoptada

Contrastada en `.claude/agents/qa-hub-restaurant.md` §2 (10/08/2026) y en el barrido de mercado de
`architecture/modules/combos.md` (24/08/2026); se adopta esto, no más:

- [Square — combos](https://squareup.com/help/us/en/article/8558-create-and-sell-combos): el combo es un
  artículo del catálogo, con «elecciones requeridas» por grupo y un cargo por opción.
- [Lightspeed K-Series — combos](https://k-series-support.lightspeedhq.com/hc/en-us/articles/1260804656529-About-combos):
  grupos con cuántos artículos hay que elegir, a precio fijo.
- [Odoo — combos](https://www.odoo.com/documentation/18.0/applications/sales/point_of_sale/combos.html):
  precio extra por opción y el precio cerrado repartido en una línea por componente.
- Toast (vista abierta), citada en el código de Venta (sales#153): todos los grupos a la vez en una
  sola hoja, no un asistente paso a paso.
- Ley del IVA: art. 91.Uno.2.2º LIVA (el menú servido en el local es una prestación única, bebida
  incluida) y art. 79.Dos LIVA (el pack de bienes se reparte en proporción al precio de venta).

## Antes de empezar

- Combos no depende de ningún módulo (`depends_on` vacío). Para elegir **productos** hace falta
  Inventario; para elegir **servicios**, Servicios; para el tipo de IVA de un menú «en el local», Impuestos.
  Sin uno de ellos la pantalla lo dice («{módulo} no está instalado, así que sus artículos no se pueden
  elegir aquí. Instálalo desde el marketplace.»); sin Impuestos la lista de IVA sale vacía y sin aviso, y
  un menú «en el local» no se puede guardar.
- Venta ofrece los menús en el TPV (COMBOS-F07) y cobra su precio (COMBOS-F08). Sin Combos, Venta cobra
  igual que siempre.
- El precio cerrado y los suplementos son importes en la moneda del negocio, escritos con coma o punto.

Configuración inicial, paso a paso:

1. Abre **Menús** y pulsa el botón de añadir (COMBOS-F02): nombre, precio cerrado, cómo se vende y, si es
   «en el local», el tipo de IVA.
2. Abre el menú (toca su fila) y añade sus platos con el mínimo y el máximo de cada uno (COMBOS-F05).
3. En cada plato, añade las elecciones, con su suplemento si lo hay (COMBOS-F06).
4. Comprueba en el TPV que el menú sale con la etiqueta «Menú» y que no deja añadirlo sin completar los
   platos obligatorios (COMBOS-F07).

## Pantallas

### Menús
Menú **Menús → Menús** (una sola entrada de navegación; el módulo no declara bloque de ajustes, así que
no hay pestaña de Ajustes). Tabla de menús con buscador «Buscar un menú…» (busca por nombre y por
nombre de cocina), vista tabla o tarjetas y columnas: Nombre (se ordena y se filtra), «Precio cerrado»
(se ordena), «Cómo se vende» («En el local» o «Para llevar»; se ordena y se filtra), «A la venta» (Sí o
No; se ordena y se filtra) y Orden (se ordena). Páginas de 50. Con permiso de gestión hay botón de
añadir, y por fila «Editar datos» y «Retirar»; sin él, solo se ve la lista. Tocar una fila abre el
constructor.
Vacía: «Aún no hay menús. Crea el primero con el botón +.». Cargando: «Cargando…» en el hueco de la
tabla. Error de carga: el mensaje en la propia tabla con reintento; si la tabla no lo pinta, sale
encima. El reintento recarga también los catálogos de artículos y las categorías de IVA.

El panel de alta y de edición (título «Menú nuevo» o «Menú · {nombre}») lleva: Nombre, «Nombre de
cocina», «Precio cerrado», «¿Cómo se vende?» («Se consume en el local (servicio de restauración)» o «Se
vende como producto / para llevar»; la explicación de las dos opciones se ve siempre), «Tipo de IVA»
(solo si es «en el local»), «Orden en la lista de menús» y la casilla «A la venta» (marcada de
partida), con «Guardar» y, al editar, «Cancelar».

### Constructor del menú
Se abre al tocar un menú. Arriba, «Todos los menús» (vuelve a la lista), el nombre y el precio del menú, y
un aviso que dice qué hará ese menú en el tique: «Este menú se factura como un único servicio: una sola
línea a su tipo de IVA, tributen como tributen sus componentes.» o «Este menú se factura como entrega de
bienes: su precio se repartirá entre los componentes que añadas, una línea por cada uno.». Debajo, la
sección «Platos» y una tarjeta por plato, en el orden en que se preguntan: nombre, su regla («Obligatorio ·
elige 1 · hasta 1 · sin repetir»), y con permiso de gestión, asa de arrastre, «Subir», «Bajar», «Editar
datos» y «Retirar». Dentro, «Elecciones»: una fila por artículo con su suplemento, y por fila arrastre,
subir, bajar, editar y quitar; abajo, el buscador «Busca un producto o un servicio…», «Suplemento»,
«Añadir elección» y «Añadir varios» (ventana con buscador y casillas: «Añadir N seleccionados»). Al
final, el formulario «Añadir un plato» (Nombre del plato, «Elecciones mínimas», «Elecciones máximas»,
la casilla «Se puede elegir la misma opción más de una vez» y «Guardar»).
Sin platos: «Aún no hay platos. Añade el primero: un menú sin platos no tiene nada que elegir.».
Plato sin elecciones: «Aún no hay elecciones: nadie puede resolver este plato.». Cargando: «Cargando los
platos…». Error: «No se han podido cargar los platos de este menú.».

## Flujos

### COMBOS-F01 Consultar y buscar los menús
Estado: hecho
Actor: administrador, responsable, empleado
Pantalla: Menús
Pasos:
1. Abre **Menús → Menús**.
2. Lee la tabla: nombre, precio cerrado, cómo se vende, si está a la venta y orden.
3. Para encontrar uno, escribe en «Buscar un menú…», ordena por una columna o filtra por nombre, por cómo se vende o por «A la venta».
4. Toca una fila para abrir su constructor.
Entra: los menús del negocio (permiso de consulta).
Sale: nada; solo lee.
Si falla: el error de carga sale en la tabla con reintento; sin menús, «Aún no hay menús. Crea el primero con el botón +.».
Implicados: ninguno
QA: qa-hub-restaurant §7.03

### COMBOS-F02 Crear un menú a precio cerrado
Estado: hecho
Actor: responsable, administrador
Pantalla: Menús
Pasos:
1. En Menús, pulsa el botón de añadir.
2. Escribe el Nombre; si la comanda debe decir otra cosa, el «Nombre de cocina».
3. Escribe el «Precio cerrado»: lo que paga el cliente por el menú entero, elija lo que elija. Un precio vacío se lee como 0.
4. Elige «¿Cómo se vende?»: «Se consume en el local (servicio de restauración)» factura UNA línea al tipo del menú, bebida incluida (el menú del día español); «Se vende como producto / para llevar»: si todos los componentes tributan igual, UNA línea a ese tipo; si no, UNA línea por componente, cada una a su tipo, con el precio repartido (COMBOS-F09).
5. Si es «en el local», elige el «Tipo de IVA» del menú entero.
6. Deja marcada «A la venta» si ya se puede vender y pulsa «Guardar».
7. El panel se cierra y el menú aparece en la lista. Todavía no se puede vender: faltan sus platos y sus elecciones (COMBOS-F05, F06).
Entra: nombre, nombre de cocina, precio, forma de venta, tipo de IVA, orden y «A la venta»; las categorías de IVA las lee de Impuestos.
Sale: el menú (avisa: combos.combo.created). No crea platos ni elecciones.
Si falla: antes de enviar, junto al botón: «El menú necesita un nombre.», «Un menú que se consume en el local necesita su propio tipo de IVA: sin él no se puede facturar.», «El precio de un menú no puede ser negativo. Para abaratar una opción, ponle un suplemento negativo.», y los dos avisos de importe ilegible («Esto no es un importe. Escribe una cifra, por ejemplo 12,50.» y el de las dos lecturas posibles, que cita lo escrito). Si el servidor rechaza, sale su mensaje o «No se ha podido guardar el menú.». Sin permiso de gestión no hay botón de añadir. Sin Impuestos instalado, la lista de IVA sale vacía y un menú «en el local» no se puede guardar; un menú «para llevar» sí.
Implicados: TAXES-F01, REC_RESTAURANTE-F03
QA: qa-hub-restaurant §7.03

### COMBOS-F03 Cambiar los datos de un menú, ponerlo a la venta o retirarlo de la venta
Estado: parcial — por el asistente o la API, un cambio que no nombra «A la venta» vuelve a poner a la venta un menú retirado (y sin orden queda en 0, sin nombre de cocina vacío); desde la pantalla no pasa, porque manda todos los campos
Actor: responsable, administrador
Pantalla: Menús
Pasos:
1. En la fila del menú, pulsa «Editar datos».
2. Cambia lo que haga falta: nombre, precio, forma de venta, tipo de IVA, orden o la casilla «A la venta».
3. Pulsa «Guardar».
4. La lista muestra el cambio. Un menú con «A la venta» desmarcada sigue en la lista pero el TPV deja de ofrecerlo.
Entra: los mismos campos que el alta.
Sale: el menú cambiado (avisa: combos.combo.updated). Lo ya cobrado no cambia: cada línea de la venta lleva el menú congelado. En una cuenta abierta solo se congela el importe (precio cerrado y suplementos): cambiar la forma de venta o el tipo de IVA cambia cómo se factura al cobrarla, y retirar el menú o una elección hace que se rechace.
Si falla: los mismos avisos que el alta; «No se ha podido guardar el menú.» si el servidor rechaza. Por el asistente o la API, un cambio reescribe todos los campos: lo que no se nombra vuelve a su valor de fábrica (a la venta, orden 0, nombre de cocina vacío; el tipo de IVA vacío lo rechaza la base en un menú «en el local»). Un menú ya puesto en una cuenta abierta y retirado de la venta se rechaza al cobrar: «Ese menú ya no está a la venta. Quítalo del tique o vuelve a activarlo en Combos».
Implicados: SALES-F12, REC_RESTAURANTE-F03
QA: qa-hub-restaurant §7.03

### COMBOS-F04 Retirar un menú
Estado: parcial — «Retirar» actúa al instante, sin pedir confirmación; nada impide retirar un menú que está en una cuenta abierta (se rechaza al cobrar); retirar un menú que no existe contesta bien y avisa igual
Actor: responsable, administrador
Pantalla: Menús
Pasos:
1. En la fila del menú, pulsa «Retirar».
2. El menú desaparece de la lista, junto con sus platos y sus elecciones, y el TPV deja de ofrecerlo.
Entra: el menú elegido.
Sale: el menú, sus platos y sus elecciones retirados en una sola operación (avisa: combos.combo.deleted). Los tiques ya emitidos se siguen leyendo: llevan una copia congelada del menú.
Si falla: el mensaje del servidor o «No se ha podido retirar el menú.», encima de la tabla. El módulo trae un texto para «menú en uso» (el aviso de que se está usando y no se puede retirar) pero ningún comando lo lanza: retirar un menú en uso funciona. Una cuenta abierta que lo llevaba falla al cobrar: «Ese menú ya no está en el catálogo: quita la línea y vuelve a añadirla».
Implicados: SALES-F12
QA: ninguno

### COMBOS-F05 Montar los platos de un menú
Estado: parcial — editar un plato (por ejemplo, subir su mínimo) lo pasa a orden 0 (arriba del todo, o empatado con el primero y ordenado por nombre), porque la edición no manda el orden y el servidor lo rellena con 0; por el asistente o la API, un cambio sin mínimo ni máximo los pone en 1 y 1; «Retirar» un plato actúa sin confirmar; el orden se guarda plato a plato, sin una transacción común (un fallo a medias deja parte del orden nuevo en el servidor; la pantalla recarga lo que quedó)
Actor: responsable, administrador
Pantalla: Constructor del menú
Pasos:
1. Abre el menú (toca su fila) y baja al formulario «Añadir un plato».
2. Escribe el «Nombre del plato» (Primero, Segundo, Postre, Bebida), las «Elecciones mínimas» (1 o más hace el plato obligatorio, 0 lo hace opcional) y las «Elecciones máximas» (0 es sin límite). De partida salen 1 y 1.
3. Marca «Se puede elegir la misma opción más de una vez» solo si hace falta (dos cafés en el mismo menú).
4. Pulsa «Guardar»: el plato entra el último, que es el último que se pregunta. Con «Subir», «Bajar» o arrastrando el asa se cambia el orden; «Editar datos» lo cambia y «Retirar» lo quita con sus elecciones.
Entra: nombre, mínimo, máximo y repetición; el orden lo pone la pantalla.
Sale: el plato (avisa: combos.choice_group.created, updated o deleted); cada cambio de orden reescribe el plato. Un plato obligatorio exige elegir en el TPV; uno opcional se puede dejar vacío.
Si falla: antes de enviar: «El menú necesita un nombre.» (también para el plato) y «El máximo ({max}) queda por debajo del mínimo ({min}): nadie podría satisfacer nunca este plato.». Si el servidor rechaza, «No se ha podido guardar el plato.» o «No se ha podido quitar el plato.». El servidor también rechaza un máximo por debajo del mínimo (restricción de base) y valores por encima de 50. Un fallo al reordenar recarga los platos con lo que el servidor guardó.
Implicados: REC_RESTAURANTE-F03
QA: qa-hub-restaurant §7.03

### COMBOS-F06 Elegir los artículos de cada plato y su suplemento
Estado: parcial — la lista de artículos trae como mucho 50 por catálogo y se sustituye con cada búsqueda: toda elección cuyo artículo no esté en la lista del momento se pinta como «Artículo {ref} (ya no está en el catálogo)» aunque exista; por el asistente o la API, un cambio de elección que no nombra el suplemento lo pone a 0 y la manda a la primera posición; quitar una elección actúa sin confirmar
Actor: responsable, administrador
Pantalla: Constructor del menú
Pasos:
1. En la tarjeta del plato, escribe en «Busca un producto o un servicio…» y elige el artículo del catálogo.
2. Escribe el «Suplemento» si sustituir el artículo cuesta más (o menos, con signo negativo) que el precio cerrado; vacío es sin suplemento.
3. Pulsa «Añadir elección»: entra la última. Para varias de golpe, «Añadir varios»: marca las casillas y pulsa «Añadir N seleccionados» (todas entran sin suplemento).
4. Para cambiar el artículo o el suplemento de una, pulsa su lápiz («Editar esta elección»): conserva su posición. Con subir, bajar o el asa se reordena; la papelera («Quitar esta elección») la quita.
Entra: el catálogo de productos (Inventario) y de servicios (Servicios) para elegir; solo guarda el tipo y el identificador del artículo, sin enlace fuerte.
Sale: la elección (avisa: combos.choice_option.created, updated o deleted). El suplemento se suma al precio cerrado, nunca al precio del componente.
Si falla: antes de enviar: «Elige antes un artículo del catálogo.», «Este plato ya ofrece ese artículo. Para que se pueda elegir dos veces, activa «se puede elegir la misma opción más de una vez».» y los avisos de importe. Si el servidor rechaza, «No se ha podido guardar la elección.» o «No se ha podido quitar la elección.». Si un catálogo no carga, sale el mensaje del error o, si no trae, «No se ha podido cargar el catálogo de artículos, así que esta lista puede estar incompleta.». La misma pareja plato y artículo no cabe dos veces (restricción de base). El módulo no comprueba que el identificador sea un artículo real.
Implicados: INVENTORY-F27, SERVICES-F10, REC_RESTAURANTE-F03
QA: qa-hub-restaurant §7.03

### COMBOS-F07 Elegir un menú al vender
Estado: parcial — un componente no puede llevar sus propias opciones (modificadores) desde la hoja del menú; un plato sin elecciones no llega a Venta y nadie lo exige aunque sea obligatorio
Actor: cajero, responsable
Pantalla: Venta: Vender
Pasos:
1. En el TPV, en «Todos», los menús salen primero con la etiqueta «Menú». Toca uno: se abre una hoja con todos sus platos a la vez.
2. Cada plato muestra su contador (por ejemplo 0/1) y sus artículos, con el suplemento con su signo si no es cero. Un plato de una sola elección cambia al tocar otro artículo; en uno con varias, tocar de más no añade y marca el plato.
3. Mientras falte algo, el botón dice el motivo («Elige {n} en {plato}», «{plato} admite solo {n}», «{plato} no admite el mismo artículo dos veces»); cuando cada plato obligatorio tiene sus elecciones, el botón se activa y suma el total en vivo; pulsa añadir. Un menú con todos los platos opcionales y nada elegido tampoco se puede añadir (se pide una elección en el menú).
4. La línea del menú entra con lo elegido en su orden.
Entra: los menús a la venta con sus platos y elecciones (`combos.options.all`); los nombres de los artículos los pone el catálogo de productos que el TPV ya tiene cargado.
Sale: la línea del menú con los identificadores de lo elegido; el precio que viaja es solo una vista previa que Venta ignora (COMBOS-F08). El servidor vuelve a comprobar cada plato al cobrar: mínimo, máximo y repetición.
Si falla: sin Combos instalado, el TPV no ofrece menús ni avisa. Si la lectura falla, «No se han podido cargar los menús, así que no se ofrece ninguno. Revisa el módulo Combos e inténtalo de nuevo». Un menú sin ninguna elección, o con «A la venta» desmarcada, no sale. Un plato sin elecciones no llega a Venta (la consulta parte de las elecciones): no sale en la hoja y nadie lo exige aunque sea obligatorio; el menú se vende sin él. Al cobrar, un plato incompleto («Al menú le falta un plato por elegir. Complétalo antes de cobrar»), con demasiadas elecciones («El menú admite menos elecciones en ese plato. Quita una antes de cobrar») o con una repetida («Ese plato no admite elegir dos veces lo mismo») se rechaza y no se cobra. Por la API o el asistente, en una cuenta de mesa el mínimo no se comprueba al añadir ni al mandar a cocina: solo al cobrar.
Implicados: MODIFIERS-F06, SALES-F12, REC_RESTAURANTE-F06
QA: qa-hub-restaurant §7.03, qa-hub-restaurant §7.07

### COMBOS-F08 Cobrar el menú: precio cerrado y suplementos
Estado: hecho
Actor: sistema
Pantalla: ninguna
Pasos:
1. Al cobrar, Venta lee el catálogo de menús y arma el menú por su cuenta: el precio cerrado del catálogo más los suplementos de las elecciones, uno por cada elección (también la repetida). El precio que mande el navegador se ignora.
2. Si el resultado fuera negativo, se rechaza.
3. En una cuenta abierta, el importe (precio cerrado y suplementos) es el que tenía cuando se pidió, no el de hoy; la forma de venta, el tipo de IVA y el reparto, y que el menú y sus elecciones sigan existiendo, se leen del catálogo el día del cobro.
4. Cada línea de la venta lleva congelada una copia del menú (nombre, precio, forma de venta y componentes con su suplemento).
Entra: el precio cerrado, el tipo de IVA, la forma de venta y las elecciones de este módulo, leídos por Venta; las elecciones que manda el TPV.
Sale: las líneas del menú en la venta, sin línea «padre» con dinero, y el menú congelado en cada una; Factura y la AEAT leen esas líneas (COMBOS-F09).
Si falla: sin Combos o sin que llegue el catálogo: «No se han podido cargar los menús, así que no se ha cobrado nada. Comprueba que el módulo Combos está instalado y vuelve a intentarlo». Menú que ya no existe: «Ese menú ya no está en el catálogo: quita la línea y vuelve a añadirla». Elección que ya no existe: «Una de las elecciones del menú ya no está en el catálogo: vuelve a elegirla». En todos los casos la venta no se guarda.
Implicados: SALES-F12, REC_RESTAURANTE-F11
QA: qa-hub-restaurant §7.03

### COMBOS-F09 Repartir el IVA de un menú
Estado: parcial — un menú «para llevar» con un servicio dentro, o con un producto que no está activo en Inventario, se rechaza al cobrar se parta o no, y nada lo avisa al montarlo; uno cuyos productos no tienen categoría fiscal se rechaza con un aviso que manda a arreglarlo a Combos
Actor: sistema
Pantalla: ninguna
Pasos:
1. «En el local»: el menú sale en UNA línea, con el precio cerrado y el tipo de IVA del menú, aunque una bebida de dentro tenga otro tipo en el catálogo.
2. «Para llevar» con todos los componentes al mismo tipo (y todos productos activos de Inventario): UNA línea con el precio cerrado y ese tipo.
3. «Para llevar» con tipos distintos: UNA línea por componente, cada una con su tipo, y el precio cerrado (con los suplementos) repartido en proporción al precio de catálogo de cada componente, con el céntimo sobrante al resto mayor (a igualdad, al componente elegido antes); la suma es exactamente el precio cerrado.
4. Si el menú se invita o lo cubre un bono, se invita o cubre entero; un descuento de línea lo llevan por igual todas las líneas.
Entra: forma de venta, tipo de IVA del menú y elecciones de este módulo; precio de catálogo y tipo de cada producto, que lee Venta de Inventario.
Sale: las líneas con su base y su cuota para la factura (avisa: sale.completed, con el menú congelado en cada línea).
Si falla: un menú «en el local» sin tipo de IVA: «Ese menú no tiene categoría fiscal, así que no se puede cobrar. Configúrala en Combos» (la base y la pantalla ya lo impiden al guardar). Un menú «para llevar» con un servicio dentro, o con un producto que no está activo en Inventario, se rechaza al cobrar, se parta o no: «Un componente del menú no tiene precio de catálogo, así que no se puede repartir su IVA. Ponle precio en el catálogo»; al partir, también si todos los componentes valen 0 en el catálogo. Un menú «para llevar» cuyos productos no tienen categoría fiscal en Inventario se rechaza con «Ese menú no tiene categoría fiscal, así que no se puede cobrar. Configúrala en Combos», aunque lo que falta está en Inventario. En todos los casos no se cobra.
Implicados: SALES-F12, REC_RESTAURANTE-F12
QA: qa-hub-restaurant §7.03

### COMBOS-F10 Bajar el stock de cada plato al cobrar
Estado: hecho
Actor: sistema
Pantalla: ninguna
Pasos:
1. Al cobrar un menú «en una línea», Venta manda en el aviso de venta cada artículo elegido con su cantidad (la de la línea ya multiplicada); si el menú se partió en una línea por componente, cada línea ya es su artículo.
2. Inventario baja el stock de cada artículo elegido, nunca el del menú, y solo de los que controlan existencias.
3. Un servicio dentro de un menú «en el local» no mueve stock y los demás se descuentan igual (un menú «para llevar» con un servicio dentro no se cobra, COMBOS-F09).
4. Si se anula la venta, Inventario devuelve lo que salió de su libro de movimientos.
Entra: los artículos elegidos del menú, que manda Venta en el aviso de venta cobrada.
Sale: movimientos de stock por artículo (Inventario); nada de este módulo.
Si falla: un artículo que no controla stock no descuenta nada y no avisa. Con stock insuficiente la venta no se frena (ya está cobrada): si Inventario no permite vender sin stock, ese componente no se descuenta y no queda rastro ni aviso; si lo permite, su stock queda en negativo.
Implicados: INVENTORY-F22, SALES-F12, REC_RESTAURANTE-F11
QA: qa-hub-restaurant §7.03

### COMBOS-F11 Mandar el menú a cocina
Estado: parcial — la comanda recibe el menú como una sola línea con su nombre comercial: sin los platos elegidos, sin cada plato en su estación y sin el nombre de cocina del menú, porque Venta no manda a Cocina los componentes que Cocina sabe expandir (comprobado en el código de los dos módulos); y un menú sin completar sale a cocina igual
Actor: sistema
Pantalla: ninguna
Pasos:
1. El camarero añade un menú a la cuenta de la mesa y manda la cuenta a cocina.
2. Venta arma la comanda con las líneas guardadas de la cuenta: la línea del menú viaja con su nombre comercial y el id del menú como artículo (cantidad, precio, nota y suplementos), sin sus elecciones.
3. Cocina crea la línea con ese nombre; solo expande un menú en sus componentes (cada uno a la estación de su artículo, bajo un mismo nombre de menú) cuando la línea trae sus componentes, y hoy Venta no los manda; y como el id del menú no es un artículo de cocina, la línea no va a la estación de ningún plato.
Entra: la línea del menú de la cuenta abierta (nombre y composición congelada), que lee Venta.
Sale: el aviso de comanda enviada (order.fired) con la línea del menú; Cocina la guarda como una línea.
Si falla: Cocina rechaza un menú que llega con la lista de componentes vacía («kitchen.combo_without_components»); Venta no manda esa lista. Por la API o el asistente el mínimo de cada plato no se comprueba al mandar a cocina, solo al cobrar.
Implicados: KITCHEN-F06, SALES-F20, REC_RESTAURANTE-F07
QA: qa-hub-restaurant §7.08

## Cobertura contra la referencia

| Elemento de la referencia | Estado | Flujo |
|---|---|---|
| Combo como artículo propio con precio cerrado | hecho | F02, F08 |
| Grupos de elección con obligatorio, mínimo y máximo | hecho | F05, F07 |
| Sin casilla «obligatorio» (mínimo 1 o más) | hecho | F05 |
| Suplemento por opción, positivo o negativo | hecho | F06, F08 |
| Repetir la misma opción | hecho | F05, F07 |
| Orden de los platos y de las elecciones | parcial: editar un plato lo pasa a orden 0 | F05, F06 |
| Hoja única con todos los grupos y total en vivo | hecho | F07 |
| Servicio en el local a una línea, bienes repartidos | hecho | F09 |
| Reparto proporcional con el céntimo al resto mayor | hecho | F09 |
| Precio y IVA del catálogo, no del navegador | hecho | F08, F09 |
| Menú congelado en la línea | hecho | F08 |
| Stock por componente, nunca del menú | hecho | F10 |
| Devolver el stock al anular | hecho | F10 |
| Cada plato a su estación y como lista en la comanda | no hecho: la comanda lleva una línea | F11 |
| Modificadores dentro de un componente | no hecho | F07 |
| Activar y desactivar un menú | hecho en pantalla; por asistente o API un cambio sin «A la venta» lo reactiva | F03 |
| Disponibilidad del menú por horario (Square) | no hecho | — |
| Opción por defecto o preseleccionada | no hecho | — |
| Confirmar antes de retirar | no hecho | F04 |
| Packs de servicios (peluquería) | solo «en el local»: «para llevar» con un servicio dentro se rechaza al cobrar (alcance MVP: restaurante) | F09 |

## Datos: de quién es cada dato

- **Propios**: menús, platos y elecciones (tres tablas). La elección guarda el tipo (producto o
  servicio) y el identificador del artículo como referencia opaca, sin clave ajena: Combos no sabe
  qué es un producto ni un servicio.
- **Lo que lee de otros**: solo la pantalla, y de forma opcional: los catálogos de Inventario
  (`inventory.products.list`) y Servicios (`services.services.list`) y las categorías de Impuestos
  (`taxes.categories.list`). Si el módulo no está, lo dice o la lista queda vacía.
- **Quién lo lee**: Venta lee `combos.options.all` (TPV y cobro). Cocina e Inventario no leen este
  módulo: reciben lo que Venta les manda.
- **Copias fuera del módulo**: Venta guarda en la cuenta abierta el id del menú, las elecciones (id,
  nombre del artículo y categoría) y el importe; en cada línea de la venta cobrada, la copia completa
  (id y nombre del menú, nombre de cocina, precio, forma de venta, y por componente: elección, plato,
  artículo, nombre, suplemento, tipo y reparto); Cocina guarda el nombre de la línea. Lo que guarda cada
  uno se lee en su módulo.
- **Datos personales** (inventario RGPD): ninguna tabla guarda datos de clientes. Las tres tablas
  guardan quién creó y quién cambió cada fila (identificador de usuario del hub). Nombres, precios y
  suplementos son datos del negocio. Cada aviso `combos.*` lleva los campos de la orden más el negocio, el usuario del hub que la lanzó, la hora y el id nuevo. Ningún dato de cliente.

## Reglas que no se rompen

- **Aislamiento**: toda lectura filtra por el negocio y las ediciones y borrados llevan el negocio en
  su condición; cada fila nace con el suyo.
- **El precio cerrado no es negativo** (restricción de base y esquema); el suplemento sí puede serlo.
- **Un menú «en el local» tiene siempre tipo de IVA propio**: la base rechaza guardarlo sin él.
- **Un plato no puede tener máximo por debajo del mínimo** (con 0 = sin límite): lo impide la base.
- **El mismo artículo no entra dos veces en el mismo plato**: lo impide un índice único; repetirlo al
  vender es lo que permite «se puede repetir».
- **El mínimo, el máximo y la repetición los hace cumplir el servidor de Venta al cobrar**, no solo la
  hoja del TPV, y solo de los platos que tienen al menos una elección (no al añadir ni al mandar a cocina).
- **El precio cerrado y los suplementos salen del catálogo de Combos; el tipo de IVA, del menú si es «en el
  local» y de cada producto en Inventario si es «para llevar»**. Nunca del navegador; sin catálogo, el
  menú no se cobra.
- **El reparto de IVA suma exactamente el precio cerrado** y no hay línea «padre» con dinero.
- **El stock lo mueven los componentes, nunca el menú.**
- **Permisos**: consultar es de los tres perfiles; crear, cambiar, retirar y todo lo del constructor es
  del responsable y del administrador. La pantalla esconde los botones sin permiso y el servidor lo
  aplica igual: a un empleado le pide la aprobación de un responsable con su PIN.
- **Retirar un menú retira también sus platos y elecciones**, en una sola operación.

## Lo que NO hace, a propósito

- No es un descuento de combinación: es un artículo con precio, IVA y consecuencia de stock.
- No tiene stock propio: el menú no se cuenta, se cuentan sus componentes.
- No tiene disponibilidad por horario (menú solo a mediodía) ni opciones por defecto.
- No cobra, no factura ni reparte el IVA: lo hace Venta con lo que lee de aquí.
- No manda nada a cocina por sí mismo: Cocina recibe lo que Venta le pasa.
- No comprueba que el identificador de una elección sea un artículo real del catálogo.
- No pregunta antes de retirar un menú, un plato o una elección.

## Dudas abiertas

Se resuelven con `market-decision`; no las decide el worker.

1. ¿El menú del día debe poder ofrecerse solo en un horario (mediodía), como los menús por franjas de
   Square, o basta con ponerlo y quitarlo de la venta a mano?
2. ¿Debe retirarse un menú que está en una cuenta abierta, o rechazarse con el aviso «en uso» que ya
   existe en los textos?
3. ¿Retirar un menú, un plato o una elección debe pedir confirmación (el manual ya lo dice)?
4. ¿La comanda debe llevar cada plato elegido en su estación y como lista, como exige
   `architecture/modules/combos.md` (regla 10)? Hoy lleva una línea.
5. ¿Debe bloquearse el envío a cocina de un menú con platos obligatorios sin resolver, o basta con que
   el cobro lo rechace?
6. ¿Un componente del menú debe poder llevar sus propios modificadores desde la hoja del TPV?

## Fuentes contrastadas

Contra `origin/main` de Combos v0.1.18, de Venta, de Cocina, de Inventario y `origin/develop` del hub
(05/10/2026). Una línea por discrepancia; manda el código.

- **`architecture/modules/combos.md`** abre con «decidido, sin implementar»: el módulo existe, con su
  pantalla, sus consultas y sus comandos (F01 a F11).
- **`architecture/modules/combos.md` reglas 7 y 10** («un grupo con mínimo 1 o más sin resolver bloquea
  el envío a cocina»; cada componente a su estación y como lista): el mínimo solo lo comprueba el cobro
  y la hoja del TPV; la comanda lleva una línea (F07, F11).
- **Manual de usuario** (`hand-book/modulos/combos.md`): «Lea la confirmación» al retirar y «un menú que
  esté en uso puede rechazar la retirada»: no pide confirmación (los textos de confirmación están en
  `locales/` pero ningún código los usa) y nada lanza el error de «menú en uso», ni este módulo ni el
  hub (F04).
- **Manual de usuario**: «Cocina puede recibir cada componente en su estación»: hoy no, Venta no manda
  los componentes (F11).
- **Manual de usuario**: «Active **A la venta** cuando haya revisado todas las reglas»: el menú nace con
  la casilla ya marcada (F02).
- **Manual de usuario**: no dice que la lista de IVA queda vacía sin Impuestos, ni que editar un plato
  lo manda a la primera posición (F02, F05).
- **`locales/es.json`**: la clave de columna «Nombre de cocina» no se usa en la lista de Menús (esa
  columna no existe); el nombre de cocina solo se ve en el panel de edición (F02).
- **`.claude/agents/qa-hub-restaurant.md` §7.03** («Menú/combo: selección requerida, suplemento y
  desglose correcto») se cumple en el cobro; no cubre la comanda de cocina (F11).
