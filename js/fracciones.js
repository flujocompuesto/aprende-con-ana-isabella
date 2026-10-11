// Fracciones divertidas — Aprende con Ana Isabella
// Aprende fracciones de forma visual: identifica, colorea y compara,
// usando pizzas y barras divididas en partes iguales.

const TOTAL_PREGUNTAS = 8;
const PUNTOS_POR_ACIERTO = 10;

const NOMBRE_NIVEL = { facil: "Fácil", intermedio: "Intermedio", dificil: "Difícil", experto: "Experto" };

// Rango de denominadores y tipos de reto por nivel.
const CONFIG = {
  facil: { min: 2, max: 4, tipos: ["identificar", "colorear"] },
  intermedio: { min: 2, max: 6, tipos: ["identificar", "colorear", "comparar"] },
  dificil: { min: 3, max: 10, tipos: ["colorear", "comparar", "identificar"] },
  // Experto: fracciones equivalentes (1/2 = 2/4) y sumas con igual denominador.
  experto: { min: 3, max: 12, tipos: ["equivalente", "suma", "comparar"] },
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

  if (tipo === "equivalente") return preguntaEquivalente(forma);
  if (tipo === "suma") return preguntaSuma(cfg);

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

const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const valida = (nu, de) => Number.isInteger(nu) && Number.isInteger(de) && nu >= 1 && nu < de && de <= 24;

// Completa hasta "cuantas" opciones equivocadas con fracciones que no valgan
// lo mismo. Si con ese denominador no alcanzan, prueba con los siguientes.
function completarTrampas(trampas, correcta, den, cuantas = 3) {
  const [cn, cd] = correcta.split("/").map(Number);
  const lista = [...new Set(trampas)].filter((f) => f !== correcta);
  for (let d = den; lista.length < cuantas && d <= den + 6; d++) {
    for (const nu of mezclar([...Array(d - 1).keys()].map((x) => x + 1))) {
      const f = `${nu}/${d}`;
      if (lista.length >= cuantas) break;
      if (nu * cd !== cn * d && !lista.includes(f)) lista.push(f);
    }
  }
  return mezclar(lista).slice(0, cuantas);
}
const primeras = (n) => new Set([...Array(n).keys()]); // partes coloreadas seguidas

// ¿Qué fracción es igual a num/den? La respuesta es multiplicar arriba y abajo.
function preguntaEquivalente(forma) {
  let den, num, k;
  do {
    den = aleatorio(2, 6);
    num = aleatorio(1, den - 1);
    k = aleatorio(2, 3);
  } while (mcd(num, den) !== 1 || den * k > 12);
  const correcta = `${num * k}/${den * k}`;
  const trampas = [
    [num, den * k], // solo cambiar el de abajo
    [num * k - 1, den * k],
    [num * k + 1, den * k],
    [num * k, den * k + 1],
    [num + 1, den * k],
  ].filter(([nu, de]) => valida(nu, de) && nu * den !== num * de).map(([nu, de]) => `${nu}/${de}`);
  const opciones = mezclar([correcta, ...completarTrampas(trampas, correcta, den * k)]);
  return { tipo: "equivalente", forma, num, den, k, correcta, opciones };
}

// num1/den + num2/den: solo se suman los de arriba.
function preguntaSuma(cfg) {
  const den = aleatorio(Math.max(cfg.min, 4), Math.min(cfg.max, 10));
  const a = aleatorio(1, den - 2);
  const b = aleatorio(1, den - 1 - a);
  const correcta = `${a + b}/${den}`;
  const trampas = [
    [a + b, den * 2], // sumar también los de abajo (el error más común)
    [a + b + 1, den],
    [a + b - 1, den],
    [a * b, den],
  ].filter(([nu, de]) => valida(nu, de) && `${nu}/${de}` !== correcta).map(([nu, de]) => `${nu}/${de}`);
  // La trampa común siempre aparece: es la que más enseña.
  const comun = `${a + b}/${den * 2}`;
  const otras = completarTrampas(trampas.filter((f) => f !== comun), correcta, den, 2);
  const opciones = mezclar([correcta, comun, ...otras]);
  return { tipo: "suma", forma: "barra", a, b, den, correcta, opciones, trampaComun: `${a + b}/${den * 2}` };
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
  else if (pregunta.tipo === "equivalente") renderEquivalente();
  else if (pregunta.tipo === "suma") renderSuma();
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

// Opciones de fracción para los retos de experto.
function ponerOpciones(explicarError, alAcertar) {
  pregunta.opciones.forEach((frac) => {
    const [nu, de] = frac.split("/");
    const boton = document.createElement("button");
    boton.className = "opcion-frac";
    boton.dataset.fraccion = frac;
    boton.innerHTML = fraccionHTML(nu, de);
    boton.addEventListener("click", () => {
      if (bloqueo) return;
      bloqueo = true;
      opcionesEl.querySelectorAll(".opcion-frac").forEach((b) => {
        b.disabled = true;
        if (b.dataset.fraccion === pregunta.correcta) b.classList.add("correcta");
      });
      const acerto = frac === pregunta.correcta;
      if (acerto && alAcertar) alAcertar();
      finalizarRespuesta(acerto, boton, explicarError(frac));
    });
    opcionesEl.appendChild(boton);
  });
}

function renderEquivalente() {
  const { num, den, k, forma } = pregunta;
  instruccionEl.innerHTML = `¿Qué fracción es <strong>igual</strong> a ${fraccionHTML(num, den)}?`;
  figuraEl.innerHTML = figuraSVG(forma, den, primeras(num), false);
  // Al acertar dibujamos la otra fracción al lado: ¡es la misma cantidad!
  ponerOpciones(
    () => `${num}/${den} = ${num * k}/${den * k}: multiplica arriba y abajo por ${k}.`,
    () => figuraEl.insertAdjacentHTML("beforeend", figuraSVG(forma, den * k, primeras(num * k), false))
  );
}

function renderSuma() {
  const { a, b, den } = pregunta;
  instruccionEl.innerHTML = `¿Cuánto es ${fraccionHTML(a, den)} + ${fraccionHTML(b, den)}?`;
  figuraEl.innerHTML = figuraSVG("barra", den, primeras(a), false) + '<span class="signo-mas">+</span>' + figuraSVG("barra", den, primeras(b), false);
  ponerOpciones(
    (frac) =>
      frac === pregunta.trampaComun
        ? `¡Ojo! Cuando el número de abajo es igual, no se suma: solo se suman los de arriba. Era ${pregunta.correcta}.`
        : `Era ${pregunta.correcta}: ${a} + ${b} = ${a + b} partes de ${den}.`
  );
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
