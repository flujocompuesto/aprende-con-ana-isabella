# CLAUDE.md — aprende-con-ana-isabella

## Sobre este proyecto
Repositorio **público** e independiente (no forma parte de `ivan-workspace`),
enfocado en Ana Isabella (8-10 años). Es un **hub de juegos educativos
interactivos y divertidos** para que aprenda jugando.

Producción: https://aprende-con-ana-isabella.pages.dev (Cloudflare Pages,
deploy automático en cada push a `main`; build output = raíz `/`).

## Enfoque de diseño (importante)
Inspirado en https://www.synthesis.com/ — aprendizaje **gamificado**: todo se
presenta como JUEGO, tono cálido y alentador, puntos, niveles y celebraciones.

**Estilo visual (oct-2026): libro ilustrado / cuaderno, que NO parezca hecho
con IA.** Ivan lo pidió explícitamente. Reglas:
- Papel cuadriculado de fondo, contornos "de tinta" (`--tinta`) y sombras
  sólidas desplazadas tipo sticker (`--sombra-tinta`). Nada de sombras difusas.
- Colores planos de la paleta de `:root` (mostaza, naranja, teal, pasteles
  `.color-*`). **Sin degradados** y sin la paleta "Flat UI" (#6c5ce7,
  #00b894, #fdcb6e…), que es lo que delataba el diseño genérico.
- Letras: Grandstander (títulos y botones) y Andika (texto, hecha para
  niños que aprenden a leer), desde Google Fonts.
- Emojis solo como contenido del juego (banderas, dibujos de inglés, etc.),
  no como decoración de títulos, botones o encabezados. Los íconos de la
  página de inicio son SVG dibujados en `img/iconos/`.
- **Mascota: Capi, la capibara** (`img/capibara.svg`, con su mandarina en la
  cabeza). `js/comun.js` la pone sola en el encabezado de cada página y la
  hace saltar al terminar una partida; una página puede evitarlo con
  `data-sin-mascota` en el `<header>`. En el ajedrez es la profe y también
  la **rival** de las partidas (Capi tranquila / lista con lentes / experta
  con birrete).
- Pie de página: "Hecho a mano por papá, para Ana Isabella."

## Stack técnico
- HTML/CSS/JS puro, sin build ni frameworks. Debe abrirse directo en el
  navegador o servirse con GitHub Pages / Cloudflare Pages.
- Dependencias externas: imágenes de banderas (flagcdn.com) y las dos
  letras de Google Fonts.
- Única parte con servidor: el ajedrez **en línea** (Pages Functions en
  `functions/api/partida/` + la D1 `aprende-partidas`, binding `DB` en
  `wrangler.toml`; esquema en `migraciones/`, se aplica con
  `npx wrangler d1 migrations apply aprende-partidas --remote`). Para
  probarlo local: `npx wrangler pages dev --port=8796` (config
  `ana-wrangler`). El resto del sitio sigue funcionando sin servidor.

## Reglas y convenciones
- Público siempre: **nunca** incluir datos personales sensibles, fotos,
  ubicación, escuela, apellidos completos, su edad exacta, ni nada que
  identifique a Ana Isabella más allá de su nombre de pila. (En oct-2026 se
  quitó "Eu tenho nove anos" del curso de portugués por eso.)
- Contenido y comentarios en español, con lenguaje simple y cercano para
  una niña de 8 a 10 años.
- Cada juego/lección es autocontenido: una página (en `juegos/` o
  `lecciones/`) + un script en `js/`. No introducir frameworks ni build steps
  salvo que el contenido lo amerite claramente.
- Priorizar lo visual, lo interactivo y lo divertido sobre el texto largo.

## Capa común de los juegos (`js/comun.js`)
Todas las páginas cargan `js/comun.js` **antes** del script del juego. Expone
el objeto `Aprende`:
- `Aprende.silenciado()` — si está en 🔇 (la voz del juego de inglés también lo respeta).
- `Aprende.sonido.acierto() / error() / clic() / paso() / victoria() /
  boing() / gracioso()` —
  sonidos sintetizados con Web Audio (sin archivos). El botón 🔊/🔇 se agrega
  solo al encabezado y recuerda la preferencia.
- `Aprende.efecto.rebote(el) / sacudir(el)` y `Aprende.confeti()` (respetan
  "reducir movimiento").
- `Aprende.estrellasPorAciertos(aciertos, total)` y `Aprende.textoEstrellas(n)`.
- `Aprende.finDePartida(juego, nivel, estrellas)` — al terminar: guarda el
  récord (solo si mejora), celebra y muestra `#fin-record` si hubo récord.

El progreso vive en `localStorage` (`aprende:progreso` = mejores estrellas por
juego y nivel). Es solo del navegador de quien juega: no viaja entre
dispositivos y se pierde si se borran los datos del sitio.

**Juego nuevo**: cargar `comun.js`, poner `<p id="fin-record" class="fin-record"
hidden>` en la pantalla final, llamar `Aprende.finDePartida(...)`, y en
`index.html` darle a la tarjeta `data-juego` + `data-max` (estrellas máximas)
y un `<span class="progreso-card">` — `js/inicio.js` pinta el progreso.

## Estado actual
- "Robot Programador" (`lecciones/leccion-01-que-es-programar.html` +
  `js/leccion-01.js`, la URL se mantuvo): 8 niveles con rocas, se desbloquean
  en orden (6–8 son laberintos de un solo camino de 16 instrucciones); el programa se ve como fichas que se iluminan al ejecutarse; las
  estrellas comparan las instrucciones usadas con el camino más corto
  (búsqueda en anchura). Su tablero usa `.tablero-robot` (no `.tablero`, que
  es el de Memoria). Flechas del teclado, Enter y Borrar también funcionan.
- Juego "Banderas del mundo" completo: 3 niveles (fácil/intermedio/difícil),
  quiz de opción múltiple, puntaje y pantalla final. Vive en
  `juegos/banderas-del-mundo.html` + `js/banderas.js`. Las banderas se cargan
  como imágenes desde flagcdn.com (única dependencia externa; requiere
  internet). Si se quiere 100% offline, habría que descargar los SVG/PNG al
  repo.
- Juego "Números mágicos" (matemáticas) completo: 3 niveles, teclado numérico
  en pantalla, objetos para contar en el nivel fácil (manipulativos visuales),
  racha 🔥 con bono de puntos, y pantalla final con estrellas. Vive en
  `juegos/numeros-magicos.html` + `js/numeros.js`. Fácil = sumas/restas con
  dibujos; Intermedio = +/-/×; Difícil = +/-/×/÷ (divisiones exactas).
- Juego "Memoria de perritos" completo: 3 niveles (3, 6 y 10 pares), volteo
  de cartas 3D, marcador de pares e intentos, y pantalla final con estrellas.
  Vive en `juegos/memoria-perritos.html` + `js/memoria.js`. Los perritos son
  ILUSTRACIONES SVG ORIGINALES (10 beagles caricatura con accesorios: gorro de
  fiesta, moño, lentes, flor, corona, bufanda, audífonos, gorra, enamorado,
  juguetón). NO se usa arte de Snoopy (personaje con copyright) — Ivan pidió
  "estilo Snoopy" pero al ser sitio público se hicieron perritos propios.
- Juego "Aventura de lectura" completo: 3 niveles (palabras cortas / medianas
  / largas), mecánica de ordenar fichas de letras revueltas para formar la
  palabra con pista de emoji, botón borrar, soporte de teclado físico, puntos
  y pantalla final con estrellas. Vive en `juegos/aventura-lectura.html` +
  `js/lectura.js`. Las palabras se eligen sin tildes para que las fichas
  queden limpias.
- Juego "Fracciones divertidas" completo: 3 niveles, mecánicas visuales
  (identificar la fracción coloreada, colorear una fracción tocando partes,
  comparar cuál es mayor) con pizzas (círculos) y barras SVG divididas en
  partes iguales. Vive en `juegos/fracciones-divertidas.html` +
  `js/fracciones.js`. Puntos y pantalla final con estrellas.
- **Nivel Experto** (oct-2026) en Banderas, Números, Lectura, Memoria y
  Fracciones: un cuarto botón que se abre con al menos 1 ⭐ en Difícil
  (`data-requiere="dificil"` dentro del contenedor con `data-juego`;
  `Aprende.actualizarCandados()` de `comun.js` los abre o cierra al cargar y
  al terminar cada partida). Cada juego da hasta 12 ⭐.
  - Banderas: banderas que se parecen (`GRUPOS_PARECIDOS`), y las trampas
    salen del mismo grupo.
  - Números: sumas y restas de 3 cifras, multiplicaciones 2×1, divisiones
    hasta 100 y "el número que falta" (`□ + 27 = 85`).
  - Lectura: palabras largas (con Ñ) y un botón de pista que pone la primera
    letra.
  - Memoria: 12 pares en 6 columnas con perritos "gemelos" (`GEMELOS`: misma
    forma, otro color) que confunden.
  - Fracciones: fracciones equivalentes y sumas con el mismo denominador (la
    trampa común `a+b / 2·den` siempre está entre las opciones).
- Nota CSS importante: se agregó una regla global `[hidden]{display:none
  !important}` porque una clase con `display` (ej. `.acciones`) le ganaba al
  atributo `hidden` y dejaba visible un botón que debía ocultarse.
- Juego "Inglés divertido" (`juegos/ingles-divertido.html` + `js/ingles.js`):
  8 temas en vez de niveles (animales, colores, números, comida, cuerpo, mi
  mundo, acciones y ropa; el progreso se guarda por tema) y el **Desafío
  final** (`desafio`): palabras de todos los temas con trampas del mismo
  tema, 4 deletreos de palabras de 5+ letras y 70 % del tiempo. Se abre con
  estrellas en 4 temas. Máximo 27 ⭐. Cada partida son 10
  retos en orden creciente: ver ×3, escuchar ×3, traducir ×2, deletrear ×2.
  Cada pregunta va contra reloj con bono por rapidez. La pronunciación usa la
  voz del navegador (`speechSynthesis`, en-US); si no hay voz o está en 🔇,
  "escuchar" se convierte en "ver". Palabras de una sola palabra, sin
  espacios (por el deletreo). Colores se dibujan como muestras y números como
  cifras, no con emojis.
- "Aprende ajedrez" (`juegos/ajedrez.html`): el juego que más usa. Camino
  de 21 capítulos con Capi en secciones (`SECCIONES`): lo básico (meta,
  piezas, jaque y mate, cómo empezar, partida), táctica (pieza sola, tenedor,
  clavada, descubierta: paso `tactica`), mates de campeona (mates difíciles,
  mate en 2), finales (mate con dama, con torre y la regla del cuadrado: paso
  `final`) y retos (coordenadas y notación: pasos `nombrar` y `coordenadas`;
  Capi experta). Los capítulos con `requiere` se abren al terminar el que
  nombran. Progreso por capítulo, máximo 63 ⭐.
  - **Práctica diaria** (arriba del camino): el **problema del día** (todos
    los días otro del banco `js/ajedrez-problemas.js`, que da la vuelta), con
    racha 🔥 en `aprende:ajedrez-diario` (sigue viva si resolvió hoy o ayer;
    la página de inicio la muestra en la tarjeta), "Otro problema" para
    practicar y el reto de coordenadas de 30 s con récord.
  - **Capi rival** (`js/capi-rival.js`): en las partidas Capi se sienta
    arriba del tablero con un globo de frases y hace muecas dibujadas en SVG
    (las mismas formas de `img/capibara.svg`): le comen un peón → sorpresa;
    caballo → lengua afuera; alfil → berrinche con vapor; torre → llanto;
    dama → llanto y se le vuela la mandarina; jaque → mareada; cuando Capi
    come algo o da jaque → lentes de sol; al perder → bandera blanca; al
    ganar → baile.
    Sonidos `Aprende.sonido.boing()` y `gracioso()` (en `comun.js`). La
    jugada de la compu espera a que termine la mueca. En el problema del día
    (y los de práctica) en los pasos `tactica` y `final` de los capítulos y en los
    capítulos «Jaque y jaque mate» (también al escapar del jaque), «Mates
    difíciles» y «Mate en 2» (`CAPITULOS_CON_RIVAL`)
    también juega con las negras: reta al abrir, se burla con la lengua si
    la jugada no es, se asusta con la jugada clave, se escapa, hace la mueca
    de la pieza que le comen y se rinde con el mate. En los finales además
    se burla cuando su rey escapa, se asusta cuando le quedan 4 casillas o
    menos (`Finales.caja`), festeja el ahogado y llora si el peón corona.
    En los demás pasos queda oculta (`prepararPaso` la esconde) y las
    reacciones no hacen nada.
  - **"¿Dónde me equivoqué?"**: al terminar una partida, revisa cada jugada a
    2 jugadas (`Busqueda.valorarJugadas`) y muestra hasta 3 momentos donde
    perdió 2+ puntos o dejó pasar un mate; en cada uno busca una jugada mejor.
  - `js/ajedrez-busqueda.js`: alfa-beta + capturas al final (quiescencia),
    contando material. `js/ajedrez-finales.js`: la defensa del rey negro y la
    pista de los finales ("la caja": achicar el espacio del rey sin ahogarlo).
  - `herramientas/generar-problemas-ajedrez.js` genera el banco: juega
    partidas entre compus principiantes y guarda posiciones con solución
    única (mate en 1, mate en 2 con 1–2 soluciones, o una táctica que gana
    2+ puntos muy por encima de las demás jugadas), con el tablero volteado
    si les tocaba a las negras. ~15 min para 100 problemas; misma semilla,
    mismo banco.
  - **Jugar con papá** (tarjeta en Práctica, `js/ajedrez-duo.js`): dos
    jugadores en el mismo aparato (se pasan la tablet; deshacer y dar vuelta
    el tablero) o **en línea** con un código de 4 números. El servidor solo
    es cartero: guarda las jugadas en orden (`e2e4`, `e7e8q`), revisa turno,
    número de jugada y la clave secreta de cada color; las reglas las valida
    el motor en cada navegador. Se sondea cada 1,5 s. La partida en curso
    queda en `aprende:partida-en-linea`; las partidas de más de 2 días se
    borran solas. No guarda nombres ni nada personal. Capi hace de árbitro
    (`CapiRival.decir`). `volteado` y `colorJugador` en `ajedrez.js` dan
    vuelta el tablero y dicen qué color se puede mover.
  - **`node herramientas/probar-ajedrez.js`** verifica todo con el motor
    (perft, cada mate y mate en 2, cada táctica con su línea y sus `buenas`,
    los finales siguiendo la pista y el banco entero). Correrlo antes de
    publicar cualquier cambio del ajedrez.
  - `js/ajedrez-motor.js`: reglas completas (jaque, enroque, al paso,
    coronación, mate/ahogado). Se valida con perft:
    `node -e 'const A=require("./js/ajedrez-motor.js");console.log(A.perft(A.desdeFEN(A.INICIAL),4))'`
    debe dar 197281. Si se toca el motor, correr perft antes de publicar.
  - `js/ajedrez.js`: contenido (`CAPITULOS`, cada paso tiene un `tipo`:
    explica, conoce, explora, estrellas, pregunta, escapa, mate, mate2,
    tactica, final, nombrar, coordenadas, jugada, guion, partida) y la compu (`elegirJugada`, heurística de 1 jugada con azar; la
    "tranquila" a veces no revisa si deja piezas colgando). La **experta**
    (`elegirJugadaExperta`) mira 2 jugadas (la suya y la mejor respuesta) y
    al final la mejor captura que queda; ~30 ms por jugada y le gana casi
    siempre a la "lista". Los mates en 1 y en 2 se validan con el motor, no
    con una respuesta fija: en `mate2` sirve cualquier jugada tras la que
    toda defensa deja un mate en 1, y la compu defiende con la que deja
    menos mates. Al agregar un problema, comprobar que no tenga mate en 1.
- "Robótica" (`juegos/robotica.html`), con Capi ingeniera
  (`img/capibara-ingeniera.svg`, con casco). Dos talleres de 10 niveles
  (progreso `robotica` → `robot-N` y `circuito-N`, máximo 60 ⭐):
  - Robot con sensores: programación por bloques con orientación (avanzar,
    girar), Repetir N, Repetir hasta llegar y Si hay algo adelante / si no.
    Niveles con varios tableros: el mismo programa debe funcionar en todos.
    8–10 son los difíciles: la aspiradora (repetir dentro de repetir), rodear
    rocas (varios pasos dentro del Si) y una espiral gigante. En los
    recorridos largos la animación acelera (~25 s por tablero como mucho).
  - Taller de circuitos: girar cables (recta, curva, T) e interruptores;
    focos y motores se prenden solo si están en un camino de + a −; detecta
    cortocircuitos. Serie, paralelo, y el circuito final del robot.
    Opcionales del nivel: `apagados` (focos que deben quedar apagados; hay
    pista si se prenden), `color` en un foco (`verde`/`rojo`) y `fija: true`
    en un cable que no se puede girar (se dibuja con tornillos).
  - `js/robotica-motor.js` (puro, probado en Node), `js/robotica-niveles.js`
    (datos), `js/robotica.js` (pantalla). Al cambiar un nivel, verificar que
    la solución pensada funcione, que no exista un programa más corto que el
    "reto" y que el mínimo de toques del circuito sea el real (búsqueda en
    anchura sobre los giros).
    Excepción conocida: en "Rodea las rocas" (robot 9) la fuerza bruta llega
    hasta 7 bloques sin encontrar atajos, pero existen programas raros de 8
    (barridos que encuentran la cueva). Se aceptan porque no salen por
    accidente, y el programa de 4 bloques de los niveles 6–7 ya no sirve.
    Por eso la estrella está en una cueva en medio del campo: en la orilla,
    seguir la pared con 4 bloques la resolvía.
- "Curso de portugués" (`juegos/portugues.html`): 11 unidades de portugués
  de Brasil que se desbloquean en orden (saludos, números, colores, animales,
  familia, comida, escuela, una conversación con Capi y tres difíciles:
  verbos con palabras engañosas —brincar, acordar—, días de la semana y
  clima, y pedir comida en una lanchonete). Las de conversación tienen
  `conversa` (y `finConversa`) en vez de palabras. Cada unidad:
  tarjetas para escuchar (con una "dica" de pronunciación), práctica de 8
  preguntas (leer / escuchar / traducir, con la palabra en español como
  trampa cuando es distinta) y armar frases. Voz `speechSynthesis` pt-BR.
  Datos en `js/portugues-unidades.js`, pantalla en `js/portugues.js`.
  Progreso `portugues` → id de la unidad, máximo 33 ⭐. La conversación usa
  el nombre de pila de Ana Isabella y sus gustos (ajedrez y robots).
- "Estudio de videos" (`juegos/videos.html`, oct-2026): curso de 7 unidades
  para hacer videos de YouTube (la idea, cuidarse en internet, el guion,
  grabar, edición, miniatura y título, subirlo con papá). Datos en
  `js/videos-unidades.js` (cada paso tiene un `tipo`: explica, pregunta,
  ordena, clasifica, escribe, set, editor, miniatura, subida, plan) y el
  motor en `js/videos.js`. Progreso `videos` → id de la unidad, máximo 21 ⭐.
  Mientras avanza, arma **su propio plan de video** (`aprende:mi-video` en
  localStorage, solo en ese aparato; se imprime con `window.print()` y el
  CSS de impresión de `.pagina-videos`). Lo que escribe se muestra siempre
  escapado (`esc`). Mensajes que no hay que perder al editar: el canal
  propio exige 13 años (se sube en el canal de papá), "contenido para
  niños" apaga los comentarios, primer video Privado o No listado, música
  libre (Biblioteca de audio), miniatura sin su cara ni datos personales.
- "Explora el mundo" (`juegos/geografia.html` + `js/geografia.js`): mapa
  SVG de verdad (Natural Earth, dominio público) en `js/mapa-mundo.js`,
  generado por `herramientas/generar-mapa.js` (proyección de Miller, nombres
  en español). Niveles: continentes (5, como en la escuela latinoamericana:
  América es uno), países famosos, capitales (lista `CAPITALES`, sin países
  con capital discutida) y experto América Latina (el mapa se acerca a la
  región; México va en América del Norte). Rusia se dibuja dos veces con
  recorte en los Urales para que la parte asiática cuente como Asia. Hay un
  modo para explorar libremente. Progreso `geografia`, máximo 12 ⭐.
- "Mi alcancía" (`juegos/alcancia.html` + `js/alcancia.js`): educación
  financiera en 4 misiones: necesidades y deseos, los tres frascos (gastar,
  ahorrar, compartir), una meta de ahorro semana a semana con tentaciones
  (estrellas por semanas: 7 o menos = 3) y el interés compuesto con un
  gráfico de barras que ella mueve (con $10 al mes al 10 % anual, el interés
  supera a lo puesto a los 13 años). Cifras de juego, no consejos de
  inversión. Progreso `alcancia`, máximo 12 ⭐.
- "Cuentos de Capi" (`juegos/cuentos.html` + `js/cuentos.js`, cuentos en
  `js/cuentos-datos.js`): 6 cuentos ORIGINALES en 3 niveles, para leer o
  escuchar (voz del navegador en español), con preguntas literales, de
  deducción, de vocabulario, de idea principal y de ordenar los hechos.
  Progreso `cuentos` → id del cuento, máximo 18 ⭐.
- "Tablas de multiplicar" (`juegos/tablas.html` + `js/tablas.js`): repaso
  que se adapta (cajas de Leitner en `aprende:tablas`: bien y rápido sube de
  caja, error vuelve a la 0 y la pregunta reaparece en la partida), práctica
  por tabla con trucos y un mapa de colores de lo dominado. Progreso
  `tablas` (`tabla-2` … `tabla-10` y `repaso`), máximo 30 ⭐.
- **Pasar el progreso a otro aparato** (`progreso.html` + `js/progreso.js`,
  enlazado desde el inicio): todo lo guardado (`aprende:*` menos el
  silencio) se vuelve un código `ANA1-` + base64 o un archivo. Al cargar se
  **combina**, nunca se pisa: mejores estrellas, la racha más reciente, la
  caja más alta de cada multiplicación.
- Herramientas de desarrollo en `herramientas/` (Node): generadores
  (problemas de ajedrez, mapa) y pruebas del ajedrez. Se suben con el resto
  del repo (el deploy publica la raíz), pero ninguna página las usa.
- Los 15 juegos están completos. Si se agregan juegos nuevos, seguir el mismo
  patrón (página en `juegos/` + script en `js/` + tarjeta en index.html).
