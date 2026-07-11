# Aprende con Ana Isabella

Sitio educativo hecho a mano por su papá, con lecciones interactivas de
programación y (próximamente) matemáticas y lectura, pensado para una niña
de 8 a 10 años.

## Cómo verlo

Abre `index.html` en el navegador, o publícalo con GitHub Pages.

## Estructura

- `index.html` — página de inicio con las lecciones y juegos disponibles.
- `lecciones/` — cada lección es una página independiente.
- `juegos/` — juegos educativos, cada uno en su propia página.
- `css/style.css` — estilos compartidos.
- `js/` — la lógica de cada lección o juego (un archivo por cada uno).

## Lecciones disponibles

1. **¿Qué es programar?** — un juego donde se le dan instrucciones en
   secuencia a un robot para que llegue hasta una estrella.

## Juegos disponibles

- **Banderas del mundo** — adivina el país por su bandera, con niveles
  fácil, intermedio y difícil. Las banderas se cargan desde flagcdn.com.
- **Números mágicos** — resuelve operaciones con un teclado interactivo,
  con objetos para contar en el nivel fácil, rachas y estrellas. Niveles
  fácil (sumas/restas), intermedio (+/-/×) y difícil (+/-/×/÷).

## Cómo agregar una lección nueva

1. Crea `lecciones/leccion-XX-tema.html` copiando la estructura de la lección 1.
2. Crea su lógica en `js/leccion-XX.js`.
3. Agrega una tarjeta nueva en `index.html` enlazando a la lección.
