# Aprende con Ana Isabella

Sitio de juegos educativos hecho a mano por su papá para una niña de 8 a 10
años: programación, banderas, matemáticas, lectura, memoria y fracciones.
Cada juego tiene niveles, sonidos, celebraciones y estrellas que se guardan
en el navegador.

## Cómo verlo

En línea: https://aprende-con-ana-isabella.pages.dev (se publica solo con
cada cambio en `main`). En local basta con abrir `index.html`.

## Estructura

- `index.html` — página de inicio: los juegos y las estrellas ganadas.
- `lecciones/` y `juegos/` — una página por juego.
- `css/style.css` — estilos compartidos.
- `js/comun.js` — sonidos, confeti, animaciones y estrellas guardadas
  (lo usan todos los juegos).
- `js/inicio.js` — muestra el progreso en la página de inicio.
- `js/` — la lógica de cada juego (un archivo por juego).

## Juegos disponibles

- **Robot Programador** — arma un programa de flechas para que el robot
  llegue a la estrella esquivando rocas. 5 niveles que se desbloquean en
  orden; 3 estrellas si usas el camino más corto.
- **Banderas del mundo** — adivina el país por su bandera, con niveles
  fácil, intermedio y difícil. Las banderas se cargan desde flagcdn.com.
- **Números mágicos** — resuelve operaciones con un teclado interactivo,
  con objetos para contar en el nivel fácil, rachas y estrellas. Niveles
  fácil (sumas/restas), intermedio (+/-/×) y difícil (+/-/×/÷).
- **Memoria de perritos** — encuentra las parejas de perritos iguales, con
  ilustraciones SVG originales. Niveles fácil (3 pares), intermedio (6 pares)
  y difícil (10 pares).
- **Aventura de lectura** — ordena las letras revueltas para formar la palabra,
  con una pista de emoji. Niveles fácil (palabras cortas), intermedio
  (medianas) y difícil (largas).
- **Fracciones divertidas** — aprende fracciones de forma visual: identifica la
  fracción coloreada, colorea una fracción tocando las partes, y compara cuál
  es mayor, con pizzas y barras. Niveles fácil, intermedio y difícil.

## Cómo agregar un juego nuevo

1. Crea `juegos/mi-juego.html` copiando la estructura de otro juego (carga
   `js/comun.js` antes del script del juego).
2. Crea su lógica en `js/mi-juego.js` y, al terminar la partida, llama
   `Aprende.finDePartida("mi-juego", nivel, estrellas)`.
3. Agrega su tarjeta en `index.html` con `data-juego="mi-juego"` y
   `data-max` (estrellas máximas) para que se vea el progreso.
