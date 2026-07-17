# CLAUDE.md — aprende-con-ana-isabella

## Sobre este proyecto
Repositorio **público** e independiente (no forma parte de `ivan-workspace`),
enfocado en Ana Isabella (8-10 años). Es un **hub de juegos educativos
interactivos y divertidos** para que aprenda jugando.

Producción: https://aprende-con-ana-isabella.pages.dev (Cloudflare Pages,
deploy automático en cada push a `main`; build output = raíz `/`).

## Enfoque de diseño (importante)
Inspirado en https://www.synthesis.com/ — aprendizaje **gamificado**:
- Todo se presenta como JUEGO, no como "lección con texto". Prioridad total a
  lo interactivo, visual y divertido.
- Tono cálido y alentador: celebrar el progreso y el esfuerzo, no la
  perfección. Mensajes positivos ("¡Muy bien!", "¡Vas mejorando!").
- Paleta vibrante y energética (azules/morados), tipografía grande y clara,
  botones grandes, animaciones suaves, mucho color y emojis.
- Gamificación: puntos, niveles, barras de progreso, pantallas de celebración.

## Stack técnico
- HTML/CSS/JS puro, sin build ni frameworks. Debe abrirse directo en el
  navegador o servirse con GitHub Pages / Cloudflare Pages.
- Única dependencia externa hasta ahora: imágenes de banderas de flagcdn.com.

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

## Estado actual
- Lección 1 (secuencias de instrucciones con un robot) completa.
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
- Los 5 juegos previstos están completos. La home ya no tiene tarjetas
  "Pronto"; si se agregan juegos nuevos, seguir el mismo patrón (página en
  `juegos/` + script en `js/` + tarjeta en index.html).
