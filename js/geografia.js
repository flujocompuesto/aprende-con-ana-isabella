// Explora el mundo — Aprende con Ana Isabella
// Geografía tocando el mapa: continentes, países famosos, capitales y, en
// experto, todos los países de América Latina (el mapa se acerca a la región).
// También hay un modo para explorar libremente: tocas un país y ves su nombre,
// su bandera y su capital. El mapa (Natural Earth, dominio público) está en
// js/mapa-mundo.js, generado por herramientas/generar-mapa.js.

const TOTAL = 10;
const NS = "http://www.w3.org/2000/svg";

// Como se enseña en la escuela en Latinoamérica: 5 continentes con gente
// (más la Antártida, que no sale en el mapa).
const CONTINENTES = {
  america: { nombre: "América", color: "#f6c3ad" },
  europa: { nombre: "Europa", color: "#c4d6f2" },
  africa: { nombre: "África", color: "#f6dc8c" },
  asia: { nombre: "Asia", color: "#cde4b0" },
  oceania: { nombre: "Oceanía", color: "#d9cdf2" },
};

// Países grandes o muy conocidos, fáciles de tocar en el mapa del mundo.
const FAMOSOS = ["br", "ar", "mx", "us", "ca", "co", "pe", "cl", "ve", "bo", "es", "fr", "it", "de", "gb", "se", "no", "pl", "ua", "ru", "cn", "in", "jp", "mn", "kz", "id", "sa", "tr", "ir", "au", "nz", "eg", "za", "ng", "dz", "cd", "et", "ma", "ke"];

const CAPITALES = {
  br: "Brasilia", ar: "Buenos Aires", mx: "Ciudad de México", us: "Washington D. C.", ca: "Ottawa",
  co: "Bogotá", pe: "Lima", cl: "Santiago", ve: "Caracas", ec: "Quito", uy: "Montevideo", py: "Asunción",
  pa: "Ciudad de Panamá", cr: "San José", cu: "La Habana", gt: "Ciudad de Guatemala", hn: "Tegucigalpa",
  ni: "Managua", sv: "San Salvador", do: "Santo Domingo", es: "Madrid", fr: "París", it: "Roma",
  de: "Berlín", gb: "Londres", pt: "Lisboa", ru: "Moscú", cn: "Pekín", jp: "Tokio", in: "Nueva Delhi",
  au: "Canberra", eg: "El Cairo", ng: "Abuya", ke: "Nairobi", ma: "Rabat", tr: "Ankara", gr: "Atenas",
  se: "Estocolmo", no: "Oslo", kr: "Seúl", sa: "Riad", th: "Bangkok", nz: "Wellington",
};

// En el nivel experto no se preguntan territorios que no son países.
const NO_PREGUNTAR = ["fk", "gl", "pr"];

const NOMBRE_NIVEL = { facil: "Continentes", intermedio: "Países", dificil: "Capitales", experto: "América Latina" };
const ANIMOS = ["¡Muy bien! 🎉", "¡Exacto! ✨", "¡Genial! 🌟", "¡Eso es! 👏", "¡Perfecto! 🎊"];

const porIso = Object.fromEntries(MAPA.paises.filter((p) => p.iso).map((p) => [p.iso, p]));

const pantallas = {
  inicio: document.getElementById("pantalla-inicio"),
  juego: document.getElementById("pantalla-juego"),
  fin: document.getElementById("pantalla-fin"),
};
const mapaEl = document.getElementById("mapa");
const preguntaEl = document.getElementById("pregunta-geo");
const opcionesEl = document.getElementById("opciones-geo");
const mensajeEl = document.getElementById("mensaje-juego");
const puntosEl = document.getElementById("puntos");
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("barra-progreso");

let nivel = "facil";
let ronda = [];
let indice = 0;
let aciertos = 0;
let puntos = 0;
let fallosPregunta = 0;
let bloqueado = false;
let explorando = false;
let sesion = 0;
// Cada país se dibuja con uno o más <path>; Rusia con dos (Europa y Asia).
let piezas = []; // { pais, camino, continente }
// Los Urales: al este de esta x (unos 60° E) Rusia ya es Asia.
const URALES = ((60 + 180) / 360) * MAPA.ancho;

function mostrarPantalla(nombre) {
  sesion++;
  Object.entries(pantallas).forEach(([k, el]) => (el.hidden = k !== nombre));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mezclar(lista) {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];
const bandera = (iso, clase = "bandera-geo") => `<img class="${clase}" src="https://flagcdn.com/w160/${iso}.png" alt="Bandera" />`;

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

// ---- El mapa ----

// Dibuja el mapa. "zoom" (opcional) es la caja [x1, y1, x2, y2] a mostrar.
function dibujarMapa({ colorear = false, zoom = null } = {}) {
  const svg = document.createElementNS(NS, "svg");
  const [x1, y1, x2, y2] = zoom || [0, 0, MAPA.ancho, MAPA.alto];
  svg.setAttribute("viewBox", `${x1} ${y1} ${x2 - x1} ${y2 - y1}`);
  svg.setAttribute("class", "svg-mapa");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Mapa del mundo");
  const mar = document.createElementNS(NS, "rect");
  mar.setAttribute("x", x1);
  mar.setAttribute("y", y1);
  mar.setAttribute("width", x2 - x1);
  mar.setAttribute("height", y2 - y1);
  mar.setAttribute("class", "mar");
  svg.appendChild(mar);
  // Rusia se parte en los Urales: la parte de la izquierda es Europa y la
  // de la derecha, Asia (se recorta el mismo dibujo dos veces).
  const defs = document.createElementNS(NS, "defs");
  // (Un pedacito del extremo este cruza la línea de 180° y aparece a la
  // izquierda del mapa, junto a Alaska: también es Asia.)
  const borde = MAPA.ancho * 0.15;
  defs.innerHTML = `<clipPath id="oeste"><rect x="${borde}" y="0" width="${URALES - borde}" height="${MAPA.alto}"/></clipPath>
    <clipPath id="este"><rect x="${URALES}" y="0" width="${MAPA.ancho - URALES}" height="${MAPA.alto}"/><rect x="0" y="0" width="${borde}" height="${MAPA.alto}"/></clipPath>`;
  svg.appendChild(defs);
  // El grosor del borde se ajusta al zoom para que se vea igual.
  const escala = (x2 - x1) / MAPA.ancho;
  piezas = [];
  const agregar = (pais, continente, recorte) => {
    const camino = document.createElementNS(NS, "path");
    camino.setAttribute("d", pais.d);
    camino.setAttribute("class", "pais");
    if (recorte) camino.setAttribute("clip-path", `url(#${recorte})`);
    camino.style.strokeWidth = 0.6 * escala + "px";
    if (colorear) camino.style.fill = CONTINENTES[continente].color;
    camino.addEventListener("click", () => tocarPais(pais, camino, continente));
    piezas.push({ pais, camino, continente });
    svg.appendChild(camino);
  };
  MAPA.paises.forEach((pais) => {
    if (pais.iso === "ru") {
      agregar(pais, "europa", "oeste");
      agregar(pais, "asia", "este");
    } else agregar(pais, pais.continente);
  });
  mapaEl.innerHTML = "";
  mapaEl.appendChild(svg);
}

// Los <path> de un país o de un continente.
const caminosDePais = (pais) => piezas.filter((x) => x.pais === pais).map((x) => x.camino);
const caminosDeContinente = (c) => piezas.filter((x) => x.continente === c).map((x) => x.camino);
const todosLosCaminos = () => piezas.map((x) => x.camino);

function marcar(caminosLista, clase, ms) {
  caminosLista.forEach((c) => c.classList.add(clase));
  if (ms) setTimeout(() => caminosLista.forEach((c) => c.classList.remove(clase)), ms);
}

// Caja que encierra a América Latina (de México a Argentina), con margen.
function cajaAmericaLatina() {
  const lista = MAPA.paises.filter((p) => (p.continente === "america" && p.region !== "norte") || p.iso === "mx");
  const caja = lista.reduce((c, p) => [Math.min(c[0], p.caja[0]), Math.min(c[1], p.caja[1]), Math.max(c[2], p.caja[2]), Math.max(c[3], p.caja[3])], [Infinity, Infinity, -Infinity, -Infinity]);
  return [caja[0] - 8, caja[1] - 8, caja[2] + 8, caja[3] + 8];
}

// ---- Partida ----

function armarRonda(n) {
  if (n === "facil") {
    // 4 veces "toca el continente" y 6 veces "¿en qué continente está…?".
    const conts = mezclar(Object.keys(CONTINENTES)).slice(0, 4).map((c) => ({ tipo: "continente", continente: c }));
    // Rusia está en dos continentes: no se pregunta "¿en qué continente está?".
    const paises = mezclar(FAMOSOS.filter((i) => porIso[i] && i !== "ru")).slice(0, 6).map((i) => ({ tipo: "dondeEsta", pais: porIso[i] }));
    return mezclar([...conts, ...paises]);
  }
  if (n === "intermedio") return mezclar(FAMOSOS.filter((i) => porIso[i])).slice(0, TOTAL).map((i) => ({ tipo: "toca", pais: porIso[i] }));
  if (n === "dificil") {
    const conCapital = Object.keys(CAPITALES).filter((i) => porIso[i]);
    return mezclar(conCapital).slice(0, TOTAL).map((i) => ({ tipo: "capital", pais: porIso[i] }));
  }
  const latinos = MAPA.paises.filter((p) => p.iso && p.continente === "america" && (p.region !== "norte" || p.iso === "mx") && !NO_PREGUNTAR.includes(p.iso));
  return mezclar(latinos).slice(0, TOTAL).map((p) => ({ tipo: "toca", pais: p }));
}

function empezar(n) {
  nivel = n;
  explorando = false;
  ronda = armarRonda(n);
  indice = 0;
  aciertos = 0;
  puntos = 0;
  mostrarPantalla("juego");
  document.getElementById("barra-juego").hidden = false;
  contadorEl.hidden = false;
  puntosEl.hidden = false;
  dibujarMapa({ colorear: n === "facil", zoom: n === "experto" ? cajaAmericaLatina() : null });
  mostrarPregunta();
}

function mostrarPregunta() {
  const q = ronda[indice];
  bloqueado = false;
  fallosPregunta = 0;
  mensaje("");
  opcionesEl.innerHTML = "";
  contadorEl.textContent = `${indice + 1}/${TOTAL}`;
  puntosEl.textContent = `Puntos: ${puntos}`;
  barraEl.style.width = `${(indice / TOTAL) * 100}%`;
  todosLosCaminos().forEach((c) => c.classList.remove("correcto", "equivocado", "destacado", "brilla"));

  if (q.tipo === "continente") {
    preguntaEl.innerHTML = `Toca <strong>${CONTINENTES[q.continente].nombre}</strong> en el mapa`;
  } else if (q.tipo === "dondeEsta") {
    preguntaEl.innerHTML = `${bandera(q.pais.iso)}<span>¿En qué continente está <strong>${q.pais.nombre}</strong>? Toca el continente.</span>`;
  } else if (q.tipo === "toca") {
    preguntaEl.innerHTML = `${bandera(q.pais.iso)}<span>Toca <strong>${q.pais.nombre}</strong> en el mapa</span>`;
  } else {
    // Capital: el país se ve resaltado y se elige entre 4 capitales.
    preguntaEl.innerHTML = `${bandera(q.pais.iso)}<span>¿Cuál es la capital de <strong>${q.pais.nombre}</strong>?</span>`;
    marcar(caminosDePais(q.pais), "destacado");
    const mismas = Object.keys(CAPITALES).filter((i) => i !== q.pais.iso && porIso[i] && porIso[i].continente === q.pais.continente);
    const otras = Object.keys(CAPITALES).filter((i) => i !== q.pais.iso && !mismas.includes(i));
    const trampas = [...mezclar(mismas), ...mezclar(otras)].slice(0, 3);
    mezclar([q.pais.iso, ...trampas]).forEach((iso) => {
      const b = document.createElement("button");
      b.className = "opcion";
      b.textContent = CAPITALES[iso];
      b.addEventListener("click", () => responderCapital(iso, b));
      opcionesEl.appendChild(b);
    });
  }
  Aprende.efecto.rebote(preguntaEl);
}

function tocarPais(pais, camino, continente) {
  if (explorando) return mostrarFicha(pais, continente);
  if (bloqueado || pantallas.juego.hidden) return;
  const q = ronda[indice];
  if (q.tipo === "capital") return;
  const buscado = q.continente || q.pais.continente;
  const correcto = q.tipo === "toca" ? pais === q.pais : continente === buscado;
  if (correcto) {
    acertar(fallosPregunta === 0);
    marcar(q.tipo === "toca" ? caminosDePais(pais) : caminosDeContinente(continente), "correcto");
    const extra = q.tipo === "dondeEsta" ? ` ${q.pais.nombre} está en ${CONTINENTES[continente].nombre}.` : "";
    mensaje(`${elegir(ANIMOS)}${extra}`, "exito");
    return pasar();
  }
  fallosPregunta++;
  Aprende.sonido.error();
  Aprende.efecto.sacudir(mapaEl);
  marcar(caminosDePais(pais), "equivocado", 900);
  const dijo = q.tipo === "toca" ? `Ese es ${pais.nombre}.` : `Ese es ${pais.nombre}, en ${CONTINENTES[continente].nombre}.`;
  if (fallosPregunta < 2) {
    mensaje(`${dijo} ¡Intenta otra vez!`, "error");
    return;
  }
  // Segundo error: se muestra la respuesta y se sigue.
  marcar(q.tipo === "toca" ? caminosDePais(q.pais) : caminosDeContinente(buscado), "brilla");
  const donde = q.tipo === "toca" ? `${q.pais.nombre} es el que brilla.` : `${CONTINENTES[buscado].nombre} es el que brilla.`;
  mensaje(`${dijo} ${donde}`, "error");
  pasar(2200);
}

function responderCapital(iso, boton) {
  if (bloqueado) return;
  const q = ronda[indice];
  if (iso === q.pais.iso) {
    boton.classList.add("correcta");
    opcionesEl.querySelectorAll("button").forEach((b) => (b.disabled = true));
    acertar(fallosPregunta === 0);
    mensaje(`${elegir(ANIMOS)} La capital de ${q.pais.nombre} es ${CAPITALES[iso]}.`, "exito");
    return pasar();
  }
  fallosPregunta++;
  boton.classList.add("incorrecta");
  boton.disabled = true;
  Aprende.sonido.error();
  Aprende.efecto.sacudir(boton);
  const de = Object.keys(CAPITALES).find((i) => i === iso);
  mensaje(`${CAPITALES[iso]} es la capital de ${porIso[de] ? porIso[de].nombre : "otro país"}. ¡Intenta otra vez!`, "error");
  if (fallosPregunta >= 2) {
    opcionesEl.querySelectorAll("button").forEach((b) => {
      b.disabled = true;
      if (b.textContent === CAPITALES[q.pais.iso]) b.classList.add("correcta");
    });
    mensaje(`La capital de ${q.pais.nombre} es ${CAPITALES[q.pais.iso]}.`, "error");
    pasar(2200);
  }
}

// Solo cuenta como acierto si salió al primer intento.
function acertar(alPrimero) {
  bloqueado = true;
  if (alPrimero) {
    aciertos++;
    puntos += 10;
  }
  puntosEl.textContent = `Puntos: ${puntos}`;
  Aprende.sonido.acierto();
}

function pasar(ms = 1500) {
  bloqueado = true;
  const s = sesion;
  setTimeout(() => {
    if (s !== sesion) return;
    indice++;
    if (indice < TOTAL) mostrarPregunta();
    else terminar();
  }, ms);
}

function terminar() {
  mostrarPantalla("fin");
  const estrellas = Aprende.estrellasPorAciertos(aciertos, TOTAL);
  const textos = ["¡Buen intento! Explora el mapa y vuelve a probar.", "¡Bien hecho!", "¡Muy bien! Conoces mucho del mundo.", "¡Increíble! Eres toda una exploradora. 🌎"];
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = textos[estrellas];
  document.getElementById("fin-puntaje").textContent = `Acertaste ${aciertos} de ${TOTAL} al primer intento`;
  document.getElementById("fin-nivel").textContent = `Nivel: ${NOMBRE_NIVEL[nivel]}`;
  Aprende.finDePartida("geografia", nivel, estrellas);
}

// ---- Explorar libremente ----

function explorar() {
  explorando = true;
  mostrarPantalla("juego");
  document.getElementById("barra-juego").hidden = true;
  contadorEl.hidden = true;
  puntosEl.hidden = true;
  opcionesEl.innerHTML = "";
  mensaje("");
  preguntaEl.innerHTML = "<span>Toca cualquier país para ver su nombre, su bandera y su capital.</span>";
  dibujarMapa({ colorear: true });
}

function mostrarFicha(pais, continente) {
  todosLosCaminos().forEach((c) => c.classList.remove("destacado"));
  marcar(caminosDePais(pais), "destacado");
  Aprende.sonido.clic();
  const capital = CAPITALES[pais.iso] ? `<br>Capital: <strong>${CAPITALES[pais.iso]}</strong>` : "";
  const donde = pais.iso === "ru" ? "Europa y Asia (¡está en dos continentes!)" : CONTINENTES[continente].nombre;
  preguntaEl.innerHTML = `${pais.iso ? bandera(pais.iso) : ""}<span><strong>${pais.nombre}</strong><br>${donde}${capital}</span>`;
}

// ---- Eventos ----

document.querySelectorAll("[data-nivel]").forEach((b) => b.addEventListener("click", () => !b.disabled && empezar(b.dataset.nivel)));
document.querySelectorAll("[data-accion='inicio']").forEach((b) =>
  b.addEventListener("click", () => {
    Aprende.actualizarCandados();
    mostrarPantalla("inicio");
  })
);
document.getElementById("btn-repetir").addEventListener("click", () => empezar(nivel));
document.getElementById("btn-explorar").addEventListener("click", explorar);

Aprende.actualizarCandados();
mostrarPantalla("inicio");
