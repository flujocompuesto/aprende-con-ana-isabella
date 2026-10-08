// Fracciones divertidas — Aprende con Ana Isabella
// Aprende fracciones de forma visual: identifica, colorea y compara,
// usando pizzas y barras divididas en partes iguales.

const TOTAL_PREGUNTAS = 8;
const PUNTOS_POR_ACIERTO = 10;

const NOMBRE_NIVEL = { facil: "Fácil", intermedio: "Intermedio", dificil: "Difícil" };

// Rango de denominadores y tipos de reto por nivel.
const CONFIG = {
  facil: { min: 2, max: 4, tipos: ["identificar", "colorear"] },
  intermedio: { min: 2, max: 6, tipos: ["identificar", "colorear", "comparar"] },
  dificil: { min: 3, max: 10, tipos: ["colorear", "comparar", "identificar"] },
};

// Colores de las figuras.
const RELLENO = "#ef8a3c";
const VACIO = "#fff4dc";
const BORDE = "#2b2118";

// Estado de la partida.
let nivelActual = null;
let indice = 0;
let puntos = 0;
let aciertos = 0;
let bloqueo = false;
let pregunta = null; // pregunta en curso
let coloreadas = new Set(); // partes coloreadas en el reto de "colorear"

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFin = document.getElementById("pantalla-fin");

const puntosEl = document.getElementById("puntos");
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("barra-progreso");
const instruccionEl = document.getElementById("instruccion");
const figuraEl = document.getElementById("figura");
const opcionesEl = document.getElementById("opciones");
const zonaListoEl = document.getElementById("zona-listo");
const contadorColorEl = document.getElementById("contador-color");
const btnListoEl = document.getElementById("btn-listo");
const mensajeEl = document.getElementById("mensaje-juego");

function mostrarPantalla(p) {
  [pantallaInicio, pantallaJuego, pantallaFin].forEach((x) => (x.hidden = x !== p));
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function mezclar(lista) {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

// Devuelve k índices distintos entre 0 y n-1.
function indicesAlAzar(n, k) {
  return mezclar([...Array(n).keys()]).slice(0, k);
}

// ---- Dibujo de figuras (SVG) ----

function puntoCirculo(cx, cy, r, ang) {
  return [ (cx + r * Math.cos(ang)).toFixed(2), (cy + r * Math.sin(ang)).toFixed(2) ];
}

// Dibuja una pizza dividida en n porciones, con un conjunto coloreado.
function circuloSVG(n, coloreadasSet, clickable) {
  const cx = 60, cy = 60, r = 54;
  let partes = "";
  if (n === 1) {
    const fill = coloreadasSet.has(0) ? RELLENO : VACIO;
    partes = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${BORDE}" stroke-width="2" class="porcion${clickable ? " clic" : ""}" data-i="0"/>`;
  } else {
    for (let i = 0; i < n; i++) {
      const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
      const [x0, y0] = puntoCirculo(cx, cy, r, a0);
      const [x1, y1] = puntoCirculo(cx, cy, r, a1);
      const fill = coloreadasSet.has(i) ? RELLENO : VACIO;
      partes += `<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="${fill}" stroke="${BORDE}" stroke-width="2" class="porcion${clickable ? " clic" : ""}" data-i="${i}"/>`;
    }
  }
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="fig-circulo">${partes}</svg>`;
}

// Dibuja una barra (tableta de chocolate) dividida en n partes.
function barraSVG(n, coloreadasSet, clickable) {
  const W = 240, H = 84;
  const seg = W / n;
  let partes = "";
  for (let i = 0; i < n; i++) {
    const fill = coloreadasSet.has(i) ? RELLENO : VACIO;
    partes += `<rect x="${(i * seg).toFixed(2)}" y="0" width="${seg.toFixed(2)}" height="${H}" fill="${fill}" stroke="${BORDE}" stroke-width="2" class="porcion${clickable ? " clic" : ""}" data-i="${i}"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="fig-barra">${partes}</svg>`;
}

function figuraSVG(forma, n, coloreadasSet, clickable) {
  return forma === "barra" ? barraSVG(n, coloreadasSet, clickable) : circuloSVG(n, coloreadasSet, clickable);
}

// Muestra una fracción como número sobre número.
function fraccionHTML(num, den) {
  return `<span class="fraccion"><span class="num">${num}</span><span class="den">${den}</span></span>`;
}

// ---- Generación de preguntas ----

function generarPregunta(nivel) {
  const cfg = CONFIG[nivel];
  const tipo = elegir(cfg.tipos);
  const forma = elegir(["circulo", "barra"]);

  if (tipo === "comparar") {
    let a, b;
    do {
      a = nuevaFraccion(cfg);
      b = nuevaFraccion(cfg);
    } while (a.num / a.den === b.num / b.den);
    const mayor = a.num / a.den > b.num / b.den ? 0 : 1;
    return { tipo, forma, a, b, mayor };
  }

  const den = aleatorio(cfg.min, cfg.max);
  const num = aleatorio(1, den - 1);
  if (tipo === "colorear") {
    return { tipo, forma, num, den };
  }
  // identificar
  const coloreadasSet = new Set(indicesAlAzar(den, num));
  return { tipo, forma, num, den, coloreadasSet, opciones: opcionesIdentificar(num, den) };
}

function nuevaFraccion(cfg) {
  const den = aleatorio(cfg.min, cfg.max);
  const num = aleatorio(1, den - 1);
  return { num, den, coloreadasSet: new Set(indicesAlAzar(den, num)) };
}

// Crea 4 opciones de fracción: la correcta y 3 distractoras válidas.
function opcionesIdentificar(num, den) {
  const correcta = `${num}/${den}`;
  const valorCorrecto = num / den;
  const pool = new Set([correcta]);
  const candidatos = [
    [num, den + 1], [num, Math.max(2, den - 1)],
    [num + 1, den], [Math.max(1, num - 1), den],
    [den - num, den], [num + 1, den + 1],
  ];
  for (const [nu, de] of mezclar(candidatos)) {
    if (nu >= 1 && nu < de && nu / de !== valorCorrecto) pool.add(`${nu}/${de}`);
    if (pool.size >= 4) break;
  }
  // Si faltan, rellenamos con fracciones al azar.
  while (pool.size < 4) {
    const de = aleatorio(2, 10);
    const nu = aleatorio(1, de - 1);
    if (nu / de !== valorCorrecto) pool.add(`${nu}/${de}`);
  }
  return mezclar([...pool]);
}

// ---- Flujo del juego ----

function empezarPartida(nivel) {
  nivelActual = nivel;
  indice = 0;
  puntos = 0;
  aciertos = 0;
  mostrarPantalla(pantallaJuego);
  mostrarPregunta();
}

function mostrarPregunta() {
  bloqueo = false;
  coloreadas = new Set();
  pregunta = generarPregunta(nivelActual);

  puntosEl.textContent = `Puntos: ${puntos}`;
  contadorEl.textContent = `${indice + 1}/${TOTAL_PREGUNTAS}`;
  barraEl.style.width = `${(indice / TOTAL_PREGUNTAS) * 100}%`;
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje-juego";
  opcionesEl.innerHTML = "";
  figuraEl.innerHTML = "";
  zonaListoEl.hidden = true;
  contadorColorEl.hidden = true;

  if (pregunta.tipo === "identificar") renderIdentificar();
  else if (pregunta.tipo === "colorear") renderColorear();
  else renderComparar();
}

function renderIdentificar() {
  instruccionEl.textContent = "¿Qué fracción está coloreada?";
  figuraEl.innerHTML = figuraSVG(pregunta.forma, pregunta.den, pregunta.coloreadasSet, false);
  pregunta.opciones.forEach((frac) => {
    const [nu, de] = frac.split("/");
    const boton = document.createElement("button");
    boton.className = "opcion-frac";
    boton.dataset.fraccion = frac;
    boton.innerHTML = fraccionHTML(nu, de);
    boton.addEventListener("click", () => responderIdentificar(frac, boton));
    opcionesEl.appendChild(boton);
  });
}

function responderIdentificar(frac, boton) {
  if (bloqueo) return;
  bloqueo = true;
  const correcta = `${pregunta.num}/${pregunta.den}`;
  const acerto = frac === correcta;
  opcionesEl.querySelectorAll(".opcion-frac").forEach((b) => {
    b.disabled = true;
    if (b.dataset.fraccion === correcta) b.classList.add("correcta");
  });
  finalizarRespuesta(acerto, boton, `Era ${correcta}`);
}

function renderColorear() {
  instruccionEl.innerHTML = `Colorea la fracción ${fraccionHTML(pregunta.num, pregunta.den)}`;
  zonaListoEl.hidden = false;
  contadorColorEl.hidden = false;
  pintarColorear();
}

function pintarColorear() {
  figuraEl.innerHTML = figuraSVG(pregunta.forma, pregunta.den, coloreadas, true);
  // Muestra en vivo la fracción que lleva coloreada.
  contadorColorEl.innerHTML = `Llevas ${fraccionHTML(coloreadas.size, pregunta.den)}`;
  figuraEl.querySelectorAll(".porcion").forEach((p) => {
    p.addEventListener("click", () => {
      if (bloqueo) return;
      const i = Number(p.dataset.i);
      if (coloreadas.has(i)) coloreadas.delete(i);
      else coloreadas.add(i);
      Aprende.sonido.clic();
      pintarColorear();
    });
  });
}

function comprobarColorear() {
  if (bloqueo) return;
  bloqueo = true;
  zonaListoEl.hidden = true;
  const acerto = coloreadas.size === pregunta.num;
  finalizarRespuesta(acerto, null, `Debías colorear ${pregunta.num} de ${pregunta.den} partes`);
}

function renderComparar() {
  instruccionEl.textContent = "¿Cuál fracción es mayor? Toca la más grande.";
  [pregunta.a, pregunta.b].forEach((f, lado) => {
    const envoltura = document.createElement("button");
    envoltura.className = "figura-opcion";
    envoltura.innerHTML =
      figuraSVG(pregunta.forma, f.den, f.coloreadasSet, false) + fraccionHTML(f.num, f.den);
    envoltura.addEventListener("click", () => responderComparar(lado, envoltura));
    figuraEl.appendChild(envoltura);
  });
}

function responderComparar(lado, envoltura) {
  if (bloqueo) return;
  bloqueo = true;
  const acerto = lado === pregunta.mayor;
  const botones = figuraEl.querySelectorAll(".figura-opcion");
  botones.forEach((b, i) => {
    b.disabled = true;
    if (i === pregunta.mayor) b.classList.add("correcta");
  });
  finalizarRespuesta(acerto, envoltura, "");
}

// Feedback común y avance a la siguiente pregunta.
function finalizarRespuesta(acerto, botonElegido, textoError) {
  if (acerto) {
    aciertos++;
    puntos += PUNTOS_POR_ACIERTO;
    puntosEl.textContent = `Puntos: ${puntos}`;
    mensajeEl.textContent = "¡Muy bien! 🎉";
    mensajeEl.className = "mensaje-juego exito";
    Aprende.sonido.acierto();
    Aprende.efecto.rebote(botonElegido || figuraEl);
  } else {
    if (botonElegido) botonElegido.classList.add("incorrecta");
    mensajeEl.textContent = textoError || "¡Casi!";
    mensajeEl.className = "mensaje-juego error";
    Aprende.sonido.error();
    Aprende.efecto.sacudir(botonElegido || figuraEl);
  }
  setTimeout(siguiente, 1600);
}

function siguiente() {
  indice++;
  if (indice >= TOTAL_PREGUNTAS) terminarPartida();
  else mostrarPregunta();
}

function terminarPartida() {
  barraEl.style.width = "100%";
  mostrarPantalla(pantallaFin);

  const estrellas = Aprende.estrellasPorAciertos(aciertos, TOTAL_PREGUNTAS);

  let felicitacion = "¡Sigue practicando las fracciones!";
  if (estrellas === 3) felicitacion = "¡Increíble! Dominas las fracciones.";
  else if (estrellas === 2) felicitacion = "¡Muy bien! Ya entiendes las fracciones.";
  else if (estrellas === 1) felicitacion = "¡Buen intento! Cada vez lo haces mejor.";

  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  Aprende.finDePartida("fracciones", nivelActual, estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-resumen").textContent = `Acertaste ${aciertos} de ${TOTAL_PREGUNTAS}`;
  document.getElementById("fin-puntos").textContent = `${puntos} puntos`;
  document.getElementById("fin-nivel").textContent = `Nivel: ${NOMBRE_NIVEL[nivelActual]}`;
}

// ---- Botones ----
document.querySelectorAll("[data-nivel]").forEach((b) =>
  b.addEventListener("click", () => empezarPartida(b.dataset.nivel))
);
document.querySelectorAll("[data-accion='inicio']").forEach((b) =>
  b.addEventListener("click", () => mostrarPantalla(pantallaInicio))
);
btnListoEl.addEventListener("click", comprobarColorear);
document.getElementById("btn-repetir").addEventListener("click", () => empezarPartida(nivelActual));

mostrarPantalla(pantallaInicio);
