// Memoria de perritos — Aprende con Ana Isabella
// Encuentra las parejas de perritos iguales. Ilustraciones SVG originales.

// Cuántos pares tiene cada nivel.
const PARES_POR_NIVEL = { facil: 3, intermedio: 6, dificil: 10 };

const NOMBRE_NIVEL = { facil: "Fácil", intermedio: "Intermedio", dificil: "Difícil" };

// Los 10 perritos, cada uno con un accesorio y color distintos para
// diferenciarlos fácilmente. Cada uno se dibuja con SVG (arte original).
const PERRITOS = [
  { id: "fiesta", accent: "#e84393", nombre: "perrito con gorro de fiesta" },
  { id: "mono", accent: "#0984e3", nombre: "perrito con moño" },
  { id: "lentes", accent: "#2d3436", nombre: "perrito con lentes de sol" },
  { id: "flor", accent: "#e17055", nombre: "perrito con flor" },
  { id: "corona", accent: "#fdcb6e", nombre: "perrito con corona" },
  { id: "bufanda", accent: "#00b894", nombre: "perrito con bufanda" },
  { id: "audifonos", accent: "#6c5ce7", nombre: "perrito con audífonos" },
  { id: "gorra", accent: "#d63031", nombre: "perrito con gorra" },
  { id: "enamorado", accent: "#e84393", nombre: "perrito enamorado" },
  { id: "jugueton", accent: "#e17055", nombre: "perrito juguetón" },
];

// Partes comunes de la cara del perrito (en un lienzo de 120x120).
const OREJAS = `
  <ellipse cx="30" cy="64" rx="15" ry="28" fill="#7a5230" transform="rotate(-14 30 64)"/>
  <ellipse cx="90" cy="64" rx="15" ry="28" fill="#7a5230" transform="rotate(14 90 64)"/>`;
const CABEZA = `<circle cx="60" cy="62" r="38" fill="#fffdf7" stroke="#3a3a3a" stroke-width="2.5"/>`;
const NARIZ = `
  <ellipse cx="60" cy="72" rx="8" ry="6" fill="#2b2b2b"/>
  <path d="M60 78 Q60 86 52 85" stroke="#2b2b2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M60 78 Q60 86 68 85" stroke="#2b2b2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
const OJOS_NORMAL = `
  <circle cx="48" cy="58" r="5.5" fill="#2b2b2b"/>
  <circle cx="72" cy="58" r="5.5" fill="#2b2b2b"/>
  <circle cx="46" cy="56" r="1.8" fill="#fff"/>
  <circle cx="70" cy="56" r="1.8" fill="#fff"/>`;

// Dibuja un corazón pequeño centrado en (cx, cy).
function corazon(cx, cy, s, color) {
  return `<path transform="translate(${cx} ${cy}) scale(${s})"
    d="M0 3 C -3 -2 -9 1 -9 5 C -9 10 0 15 0 15 C 0 15 9 10 9 5 C 9 1 3 -2 0 3 Z"
    fill="${color}"/>`;
}

// Devuelve el SVG completo de un perrito según su id.
function svgPerrito(id, accent) {
  let ojos = OJOS_NORMAL;
  let extra = ""; // accesorio que se dibuja encima

  switch (id) {
    case "fiesta":
      extra = `
        <polygon points="60,6 44,38 76,38" fill="${accent}"/>
        <polygon points="60,6 52,22 68,22" fill="#ffffff" opacity="0.5"/>
        <circle cx="60" cy="6" r="5" fill="#fdcb6e"/>`;
      break;
    case "mono":
      extra = `
        <polygon points="60,104 44,96 44,112" fill="${accent}"/>
        <polygon points="60,104 76,96 76,112" fill="${accent}"/>
        <circle cx="60" cy="104" r="5" fill="#74b9ff"/>`;
      break;
    case "lentes":
      // Se dibuja encima de los ojos.
      extra = `
        <rect x="37" y="51" width="19" height="14" rx="7" fill="#2d3436"/>
        <rect x="64" y="51" width="19" height="14" rx="7" fill="#2d3436"/>
        <rect x="56" y="55" width="8" height="3" fill="#2d3436"/>`;
      break;
    case "flor":
      extra = `
        <g transform="translate(90 30)">
          ${[0, 72, 144, 216, 288].map((a) => `<circle cx="${8 * Math.cos((a * Math.PI) / 180)}" cy="${8 * Math.sin((a * Math.PI) / 180)}" r="6" fill="${accent}"/>`).join("")}
          <circle cx="0" cy="0" r="5" fill="#fdcb6e"/>
        </g>`;
      break;
    case "corona":
      extra = `
        <polygon points="38,34 46,18 54,30 60,14 66,30 74,18 82,34"
          fill="${accent}" stroke="#e0a800" stroke-width="1.5"/>
        <circle cx="46" cy="20" r="2.5" fill="#e17055"/>
        <circle cx="60" cy="16" r="2.5" fill="#0984e3"/>
        <circle cx="74" cy="20" r="2.5" fill="#00b894"/>`;
      break;
    case "bufanda":
      extra = `
        <path d="M26 88 Q60 102 94 88 L94 96 Q60 110 26 96 Z" fill="${accent}"/>
        <path d="M80 94 L92 116 L82 116 L74 96 Z" fill="${accent}"/>`;
      break;
    case "audifonos":
      extra = `
        <path d="M24 50 Q60 8 96 50" stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <rect x="18" y="48" width="15" height="22" rx="7" fill="${accent}"/>
        <rect x="87" y="48" width="15" height="22" rx="7" fill="${accent}"/>`;
      break;
    case "gorra":
      extra = `
        <path d="M30 42 Q60 12 90 42 Z" fill="${accent}"/>
        <path d="M30 42 Q16 44 14 52 L36 46 Z" fill="${accent}"/>
        <circle cx="60" cy="20" r="4" fill="#ffffff"/>`;
      break;
    case "enamorado":
      ojos = `${corazon(48, 54, 0.55, "#e84393")}${corazon(72, 54, 0.55, "#e84393")}`;
      extra = `${corazon(24, 26, 0.5, "#fd79a8")}${corazon(98, 30, 0.4, "#fd79a8")}`;
      break;
    case "jugueton":
      // Un ojo guiñando y la lengua de fuera.
      ojos = `
        <circle cx="48" cy="58" r="5.5" fill="#2b2b2b"/>
        <circle cx="46" cy="56" r="1.8" fill="#fff"/>
        <path d="M66 58 Q72 52 78 58" stroke="#2b2b2b" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = `<path d="M54 82 Q60 100 66 82 Z" fill="#e26d8a"/>
        <line x1="60" y1="84" x2="60" y2="94" stroke="#c0556f" stroke-width="1.5"/>`;
      break;
  }

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img">
    ${OREJAS}${CABEZA}${ojos}${NARIZ}${extra}
  </svg>`;
}

// Estado de la partida.
let nivelActual = null;
let totalPares = 0;
let primeraCarta = null;
let bloqueo = false;
let intentos = 0;
let paresEncontrados = 0;

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFin = document.getElementById("pantalla-fin");

const tableroEl = document.getElementById("tablero");
const paresEl = document.getElementById("pares");
const intentosEl = document.getElementById("intentos");
const mensajeEl = document.getElementById("mensaje-juego");

function mostrarPantalla(pantalla) {
  [pantallaInicio, pantallaJuego, pantallaFin].forEach((p) => {
    p.hidden = p !== pantalla;
  });
}

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function empezarPartida(nivel) {
  nivelActual = nivel;
  totalPares = PARES_POR_NIVEL[nivel];
  primeraCarta = null;
  bloqueo = false;
  intentos = 0;
  paresEncontrados = 0;

  // Elegimos los perritos del nivel y armamos las parejas.
  const elegidos = mezclar(PERRITOS).slice(0, totalPares);
  const cartas = mezclar([...elegidos, ...elegidos]);

  tableroEl.className = `tablero nivel-${nivel}`;
  tableroEl.innerHTML = "";
  cartas.forEach((perrito) => {
    const carta = document.createElement("button");
    carta.className = "carta";
    carta.dataset.figura = perrito.id;
    carta.setAttribute("aria-label", "Carta de perrito");
    carta.innerHTML = `
      <span class="carta-inner">
        <span class="carta-cara carta-frente">🐾</span>
        <span class="carta-cara carta-reverso">${svgPerrito(perrito.id, perrito.accent)}</span>
      </span>`;
    carta.addEventListener("click", () => voltear(carta));
    tableroEl.appendChild(carta);
  });

  actualizarMarcador();
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje-juego";
  mostrarPantalla(pantallaJuego);
}

function actualizarMarcador() {
  paresEl.textContent = `Pares: ${paresEncontrados}/${totalPares}`;
  intentosEl.textContent = `Intentos: ${intentos}`;
}

function voltear(carta) {
  if (bloqueo) return;
  if (carta.classList.contains("volteada") || carta.classList.contains("encontrada")) return;

  carta.classList.add("volteada");

  if (!primeraCarta) {
    primeraCarta = carta;
    return;
  }

  // Es la segunda carta: contamos el intento y comparamos.
  intentos++;
  actualizarMarcador();
  const segundaCarta = carta;

  if (primeraCarta.dataset.figura === segundaCarta.dataset.figura) {
    // ¡Pareja encontrada!
    primeraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");
    primeraCarta = null;
    paresEncontrados++;
    actualizarMarcador();
    mensajeEl.textContent = "¡Encontraste una pareja! 🎉";
    mensajeEl.className = "mensaje-juego exito";
    if (paresEncontrados === totalPares) {
      setTimeout(terminarPartida, 700);
    }
  } else {
    // No coinciden: las volteamos de nuevo tras un momento.
    bloqueo = true;
    mensajeEl.textContent = "Casi... ¡intenta otra vez!";
    mensajeEl.className = "mensaje-juego";
    setTimeout(() => {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
      primeraCarta = null;
      bloqueo = false;
    }, 900);
  }
}

function terminarPartida() {
  mostrarPantalla(pantallaFin);

  // Estrellas según cuántos intentos usó (menos intentos = mejor).
  let estrellas = 1;
  if (intentos <= Math.ceil(totalPares * 1.4)) estrellas = 3;
  else if (intentos <= totalPares * 2) estrellas = 2;

  let felicitacion = "¡Buen trabajo! Tu memoria mejora cada vez.";
  if (estrellas === 3) felicitacion = "¡Increíble memoria! Encontraste todas las parejas rapidísimo.";
  else if (estrellas === 2) felicitacion = "¡Muy bien! Encontraste todas las parejas.";

  document.getElementById("fin-estrellas").textContent =
    "⭐".repeat(estrellas) + "☆".repeat(3 - estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-resumen").textContent =
    `Encontraste ${totalPares} pares en ${intentos} intentos`;
  document.getElementById("fin-nivel").textContent = `Nivel: ${NOMBRE_NIVEL[nivelActual]}`;
}

// Botones de nivel.
document.querySelectorAll("[data-nivel]").forEach((boton) => {
  boton.addEventListener("click", () => empezarPartida(boton.dataset.nivel));
});

// Botones "volver a elegir nivel".
document.querySelectorAll("[data-accion='inicio']").forEach((boton) => {
  boton.addEventListener("click", () => mostrarPantalla(pantallaInicio));
});

// Botón "Jugar otra vez".
document.getElementById("btn-repetir").addEventListener("click", () => {
  empezarPartida(nivelActual);
});

mostrarPantalla(pantallaInicio);
