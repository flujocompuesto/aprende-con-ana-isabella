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
  `data-sin-mascota` en el `<header>`. En el ajedrez es la profe.
- Pie de página: "Hecho a mano por papá, para Ana Isabella."

## Stack técnico
- HTML/CSS/JS puro, sin build ni frameworks. Debe abrirse directo en el
  navegador o servirse con GitHub Pages / Cloudflare Pages.
- Dependencias externas: imágenes de banderas (flagcdn.com) y las dos
  letras de Google Fonts.

## Reglas y convenciones
- Público siempre: **nunca** incluir datos personales sensibles, fotos,
  ubicación, escuela, apellidos completos, ni nada que identifique a Ana
  Isabella más allá de su nombre de pila.
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
- `Aprende.sonido.acierto() / error() / clic() / paso() / victoria()` —
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
  `js/leccion-01.js`, la URL se mantuvo): 5 niveles con rocas, se desbloquean
  en orden; el programa se ve como fichas que se iluminan al ejecutarse; las
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
- Nota CSS importante: se agregó una regla global `[hidden]{display:none
  !important}` porque una clase con `display` (ej. `.acciones`) le ganaba al
  atributo `hidden` y dejaba visible un botón que debía ocultarse.
- Juego "Inglés divertido" (`juegos/ingles-divertido.html` + `js/ingles.js`):
  6 temas en vez de niveles (animales, colores, números, comida, cuerpo, mi
  mundo; el progreso se guarda por tema, máximo 18 ⭐). Cada partida son 10
  retos en orden creciente: ver ×3, escuchar ×3, traducir ×2, deletrear ×2.
  Cada pregunta va contra reloj con bono por rapidez. La pronunciación usa la
  voz del navegador (`speechSynthesis`, en-US); si no hay voz o está en 🔇,
  "escuchar" se convierte en "ver". Palabras de una sola palabra, sin
  espacios (por el deletreo). Colores se dibujan como muestras y números como
  cifras, no con emojis.
- "Aprende ajedrez" (`juegos/ajedrez.html`): camino de 10 capítulos con el
  Capi, la capibara (meta del juego, torre, alfil, dama, rey, caballo, peón, jaque
  y mate, cómo empezar —Italiana guiada con enroque y Mate del Pastor— y una
  partida contra la compu). Progreso por capítulo, máximo 30 ⭐.
  - `js/ajedrez-motor.js`: reglas completas (jaque, enroque, al paso,
    coronación, mate/ahogado). Se valida con perft:
    `node -e 'const A=require("./js/ajedrez-motor.js");console.log(A.perft(A.desdeFEN(A.INICIAL),4))'`
    debe dar 197281. Si se toca el motor, correr perft antes de publicar.
  - `js/ajedrez.js`: contenido (`CAPITULOS`, cada paso tiene un `tipo`:
    explica, conoce, explora, estrellas, pregunta, escapa, mate, jugada, guion,
    partida) y la compu (`elegirJugada`, heurística de 1 jugada con azar; la
    "tranquila" a veces no revisa si deja piezas colgando). Los mates en 1 se
    validan con el motor, no con una respuesta fija.
- Los 8 juegos están completos. Si se agregan juegos nuevos, seguir el mismo
  patrón (página en `juegos/` + script en `js/` + tarjeta en index.html).
