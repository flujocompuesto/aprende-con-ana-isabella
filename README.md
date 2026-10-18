# Aprende con Ana Isabella

Sitio de juegos educativos hecho a mano por su papá para una niña de 8 a 10
años: programación, robótica, banderas, matemáticas, lectura, memoria,
fracciones, inglés, portugués, ajedrez, videos para YouTube, geografía,
finanzas para niños, cuentos y tablas de multiplicar.
Cada juego tiene niveles, sonidos, celebraciones y estrellas que se guardan
en el navegador. Los niveles más difíciles se abren al ganar estrellas en los
anteriores.

## Cómo verlo

En línea: https://aprende-con-ana-isabella.pages.dev (se publica solo con
cada cambio en `main`). En local basta con abrir `index.html`.

## Estructura

- `index.html` — página de inicio: los juegos y las estrellas ganadas.
- `lecciones/` y `juegos/` — una página por juego.
- `css/style.css` — estilos compartidos (estilo libro ilustrado).
- `img/` — Capi, la capibara mascota, y los íconos dibujados de cada juego.
- `js/comun.js` — sonidos, confeti, animaciones y estrellas guardadas
  (lo usan todos los juegos).
- `js/inicio.js` — muestra el progreso en la página de inicio.
- `js/` — la lógica de cada juego (un archivo por juego).

## Juegos disponibles

- **Robot Programador** — arma un programa de flechas para que el robot
  llegue a la estrella esquivando rocas. 8 niveles que se desbloquean en
  orden (los últimos son laberintos); 3 estrellas si usas el camino más corto.
- **Banderas del mundo** — adivina el país por su bandera, con niveles
  fácil, intermedio, difícil y experto (banderas que se parecen). Las banderas se cargan desde flagcdn.com.
- **Números mágicos** — resuelve operaciones con un teclado interactivo,
  con objetos para contar en el nivel fácil, rachas y estrellas. Niveles
  fácil (sumas/restas), intermedio (+/-/×), difícil (+/-/×/÷) y experto
  (números de 3 cifras y "el número que falta").
- **Memoria de perritos** — encuentra las parejas de perritos iguales, con
  ilustraciones SVG originales. Niveles fácil (3 pares), intermedio (6 pares),
  difícil (10 pares) y experto (12 pares con perritos gemelos).
- **Aventura de lectura** — ordena las letras revueltas para formar la palabra,
  con una pista de emoji. Niveles fácil (palabras cortas), intermedio
  (medianas), difícil (largas) y experto (muy largas, con Ñ).
- **Fracciones divertidas** — aprende fracciones de forma visual: identifica la
  fracción coloreada, colorea una fracción tocando las partes, y compara cuál
  es mayor, con pizzas y barras. Niveles fácil, intermedio, difícil y experto
  (fracciones equivalentes y sumas).

- **Inglés divertido** — vocabulario en inglés por temas (animales, colores,
  números, comida, cuerpo, mi mundo, acciones y ropa): mirar, escuchar la
  pronunciación, traducir y deletrear, contra reloj. Al final se repasan las
  palabras. Con estrellas en 4 temas se abre el Desafío final.

- **Aprende ajedrez** — 21 capítulos con Capi: lo básico (piezas, jaque y
  mate, cómo empezar, una partida), táctica (pieza sola, tenedor, clavada,
  descubierta), mates de campeona, finales (mate con dama, con torre, regla
  del cuadrado) y retos (coordenadas, la compu experta). Cada día hay un
  **problema del día** con racha 🔥, y después de cada partida se puede ver
  **«¿Dónde me equivoqué?»**. Con **Jugar con papá** se juega de a dos en
  el mismo aparato o en línea, cada uno en el suyo, con un código de 4
  números.
- **Explora el mundo** — continentes, países y capitales tocando un mapa de
  verdad; en experto, toda América Latina.
- **Mi alcancía** — necesidades y deseos, los tres frascos, una meta de
  ahorro con tentaciones y el interés compuesto con un gráfico.
- **Cuentos de Capi** — 6 cuentos originales para leer o escuchar, con
  preguntas de comprensión.
- **Tablas de multiplicar** — un repaso que pregunta más las que cuestan,
  con trucos y un mapa de lo que ya domina.
- **Mi progreso** (`progreso.html`) — pasar las estrellas a otro aparato con
  un código o un archivo.

- **Robótica** — con Capi, la ingeniera: programa un robot con bloques
  (avanzar, girar, repetir y sensores, con programas que deben funcionar en
  varios tableros) y arma circuitos girando cables (interruptor, motor, serie,
  paralelo y cortocircuito). 10 niveles en cada taller.

- **Curso de portugués** — 11 unidades con Capi: palabras con su
  pronunciación, práctica, armar frases y conversaciones en portugués
  (presentarse y pedir comida en una cafetería).

- **Estudio de videos** — 7 unidades con Capi para aprender a hacer videos
  de YouTube: la idea, cuidarse en internet, el guion, grabar (un estudio con
  luz, ruido y celular), editar (cortar y ordenar tomas), la miniatura y
  subirlo con papá. En el camino se arma un plan de video para imprimir.

## Herramientas (Node)

- `node herramientas/probar-ajedrez.js` — verifica el ajedrez con el motor.
- `node herramientas/generar-problemas-ajedrez.js` — genera el banco del
  problema del día.
- `node herramientas/generar-mapa.js <geojson>` — genera el mapa del mundo
  (datos de Natural Earth, dominio público).

## Cómo agregar un juego nuevo

1. Crea `juegos/mi-juego.html` copiando la estructura de otro juego (carga
   `js/comun.js` antes del script del juego).
2. Crea su lógica en `js/mi-juego.js` y, al terminar la partida, llama
   `Aprende.finDePartida("mi-juego", nivel, estrellas)`.
3. Agrega su tarjeta en `index.html` con `data-juego="mi-juego"` y
   `data-max` (estrellas máximas) para que se vea el progreso.
