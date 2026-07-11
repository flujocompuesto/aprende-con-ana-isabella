# CLAUDE.md — aprende-con-ana-isabella

## Sobre este proyecto
Repositorio **público** e independiente (no forma parte de `ivan-workspace`),
enfocado en Ana Isabella (8-10 años): lecciones interactivas de programación
y, más adelante, matemáticas y lectura.

## Stack técnico
- HTML/CSS/JS puro, sin build ni dependencias. Debe poder abrirse
  directamente en el navegador o servirse con GitHub Pages.

## Reglas y convenciones
- Público siempre: **nunca** incluir datos personales sensibles, fotos,
  ubicación, escuela, apellidos completos, ni nada que identifique a Ana
  Isabella más allá de su nombre de pila.
- Contenido y comentarios en español, con lenguaje simple y cercano para
  una niña de 8 a 10 años.
- Cada lección es autocontenida: una página en `lecciones/` + un script en
  `js/`. No introducir frameworks ni build steps salvo que el contenido lo
  amerite claramente.
- Priorizar lo visual e interactivo sobre el texto largo.

## Estado actual
- Lección 1 (secuencias de instrucciones con un robot) completa.
- Juego "Banderas del mundo" completo: 3 niveles (fácil/intermedio/difícil),
  quiz de opción múltiple, puntaje y pantalla final. Vive en
  `juegos/banderas-del-mundo.html` + `js/banderas.js`. Las banderas se cargan
  como imágenes desde flagcdn.com (única dependencia externa; requiere
  internet). Si se quiere 100% offline, habría que descargar los SVG/PNG al
  repo.
- Módulos de Matemáticas, Lectura y Proyectos de tarea: pendientes.
