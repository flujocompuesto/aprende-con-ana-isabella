// Aventura de lectura — Aprende con Ana Isabella
// Ordena las letras revueltas para formar la palabra (con una pista de emoji).

// Palabras por nivel. Cada una tiene su emoji de pista. Se usan palabras sin
// tildes para que las fichas de letras queden limpias.
const PALABRAS = {
  facil: [
    { palabra: "SOL", emoji: "🌞" },
    { palabra: "GATO", emoji: "🐱" },
    { palabra: "FLOR", emoji: "🌸" },
    { palabra: "LUNA", emoji: "🌙" },
    { palabra: "CASA", emoji: "🏠" },
    { palabra: "PAN", emoji: "🍞" },
    { palabra: "PEZ", emoji: "🐟" },
    { palabra: "AUTO", emoji: "🚗" },
    { palabra: "VACA", emoji: "🐮" },
    { palabra: "MANO", emoji: "🖐️" },
    { palabra: "OSO", emoji: "🐻" },
    { palabra: "PATO", emoji: "🦆" },
    { palabra: "RANA", emoji: "🐸" },
    { palabra: "MAR", emoji: "🌊" },
  ],
  intermedio: [
    { palabra: "PERRO", emoji: "🐶" },
    { palabra: "FRESA", emoji: "🍓" },
    { palabra: "PANDA", emoji: "🐼" },
    { palabra: "ABEJA", emoji: "🐝" },
    { palabra: "GLOBO", emoji: "🎈" },
    { palabra: "COHETE", emoji: "🚀" },
    { palabra: "CACTUS", emoji: "🌵" },
    { palabra: "QUESO", emoji: "🧀" },
    { palabra: "BANANA", emoji: "🍌" },
    { palabra: "CERDO", emoji: "🐷" },
    { palabra: "CONEJO", emoji: "🐰" },
    { palabra: "PIZZA", emoji: "🍕" },
  ],
  dificil: [
    { palabra: "MARIPOSA", emoji: "🦋" },
    { palabra: "ELEFANTE", emoji: "🐘" },
    { palabra: "TORTUGA", emoji: "🐢" },
    { palabra: "GIRASOL", emoji: "🌻" },
    { palabra: "MANZANA", emoji: "🍎" },
    { palabra: "ESCUELA", emoji: "🏫" },
    { palabra: "CABALLO", emoji: "🐴" },
    { palabra: "BICICLETA", emoji: "🚲" },
    { palabra: "CHOCOLATE", emoji: "🍫" },
    { palabra: "ZANAHORIA", emoji: "🥕" },
    { palabra: "CARACOL", emoji: "🐌" },
    { palabra: "ESTRELLA", emoji: "⭐" },
    { palabra: "CANGREJO", emoji: "🦀" },
  ],
};

// Cuántas palabras tiene cada partida.
const TOTAL_PALABRAS = 8;
const PUNTOS_POR_ACIERTO = 10;

const NOMBRE_NIVEL = { facil: "Fácil", intermedio: "Intermedio", dificil: "Difícil" };

// Estado de la partida.
let nivelActual = null;
let ronda = [];
let indice = 0;
let puntos = 0;
let aciertos = 0;
let fichas = []; // { letra, usada }
let respuesta = []; // índices de fichas en el orden elegido
let bloqueo = false;

// Elementos de la página.
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFin = document.getElementById("pantalla-fin");

const puntosEl = document.getElementById("puntos");
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("barra-progreso");
const emojiEl = document.getElementById("pista-emoji");
const slotsEl = document.getElementById("slots");
const letrasEl = document.getElementById("letras");
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

// Revuelve las letras de una palabra, asegurando que no queden igual.
function revolver(palabra) {
  const letras = palabra.split("");
  if (new Set(letras).size === 1) return letras; // ej. una sola letra repetida
  let intento;
  do {
    intento = mezclar(letras);
  } while (intento.join("") === palabra);
  return intento;
}

function empezarPartida(nivel) {
  nivelActual = nivel;
  ronda = mezclar(PALABRAS[nivel]).slice(0, TOTAL_PALABRAS);
  indice = 0;
  puntos = 0;
  aciertos = 0;
  mostrarPantalla(pantallaJuego);
  mostrarPalabra();
}

function mostrarPalabra() {
  bloqueo = false;
  respuesta = [];
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje-juego";

  const item = ronda[indice];
  puntosEl.textContent = `Puntos: ${puntos}`;
  contadorEl.textContent = `${indice + 1}/${TOTAL_PALABRAS}`;
  barraEl.style.width = `${(indice / TOTAL_PALABRAS) * 100}%`;

  emojiEl.textContent = item.emoji;

  // Casillas vacías, una por letra.
  slotsEl.className = "slots";
  slotsEl.innerHTML = "";
  for (let i = 0; i < item.palabra.length; i++) {
    const slot = document.createElement("span");
    slot.className = "slot";
    slotsEl.appendChild(slot);
  }

  // Fichas de letras revueltas.
  fichas = revolver(item.palabra).map((letra) => ({ letra, usada: false }));
  letrasEl.innerHTML = "";
  fichas.forEach((ficha, i) => {
    const boton = document.createElement("button");
    boton.className = "letra";
    boton.textContent = ficha.letra;
    boton.addEventListener("click", () => elegirLetra(i));
    letrasEl.appendChild(boton);
  });
}

function actualizarVista() {
  const item = ronda[indice];
  const slots = slotsEl.querySelectorAll(".slot");
  slots.forEach((slot, i) => {
    const idx = respuesta[i];
    slot.textContent = idx === undefined ? "" : fichas[idx].letra;
    slot.classList.toggle("lleno", idx !== undefined);
  });
  const botones = letrasEl.querySelectorAll(".letra");
  botones.forEach((b, i) => (b.disabled = fichas[i].usada || bloqueo));
  // Cuando se completa la palabra, comprobamos.
  if (respuesta.length === item.palabra.length) comprobar();
}

function elegirLetra(i) {
  if (bloqueo || fichas[i].usada) return;
  fichas[i].usada = true;
  respuesta.push(i);
  actualizarVista();
}

function borrar() {
  if (bloqueo || respuesta.length === 0) return;
  const i = respuesta.pop();
  fichas[i].usada = false;
  actualizarVista();
}

function comprobar() {
  bloqueo = true;
  const item = ronda[indice];
  const formada = respuesta.map((idx) => fichas[idx].letra).join("");
  const acerto = formada === item.palabra;

  if (acerto) {
    aciertos++;
    puntos += PUNTOS_POR_ACIERTO;
    puntosEl.textContent = `Puntos: ${puntos}`;
    slotsEl.classList.add("correcta");
    mensajeEl.textContent = "¡Muy bien! 🎉";
    mensajeEl.className = "mensaje-juego exito";
  } else {
    slotsEl.classList.add("incorrecta");
    mensajeEl.textContent = `Era: ${item.palabra}`;
    mensajeEl.className = "mensaje-juego error";
  }
  // Desactivamos las fichas mientras se muestra el resultado.
  letrasEl.querySelectorAll(".letra").forEach((b) => (b.disabled = true));
  setTimeout(siguiente, 1500);
}

function siguiente() {
  indice++;
  if (indice >= ronda.length) {
    terminarPartida();
  } else {
    mostrarPalabra();
  }
}

function terminarPartida() {
  barraEl.style.width = "100%";
  mostrarPantalla(pantallaFin);

  const porcentaje = aciertos / TOTAL_PALABRAS;
  let estrellas = 0;
  if (porcentaje >= 0.9) estrellas = 3;
  else if (porcentaje >= 0.6) estrellas = 2;
  else if (porcentaje >= 0.3) estrellas = 1;

  let felicitacion = "¡Sigue leyendo, cada vez lo haces mejor!";
  if (estrellas === 3) felicitacion = "¡Increíble! Eres una campeona de las palabras.";
  else if (estrellas === 2) felicitacion = "¡Muy bien! Formaste casi todas las palabras.";
  else if (estrellas === 1) felicitacion = "¡Buen intento! Ya vas aprendiendo muchas palabras.";

  document.getElementById("fin-estrellas").textContent =
    "⭐".repeat(estrellas) + "☆".repeat(3 - estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-resumen").textContent =
    `Formaste ${aciertos} de ${TOTAL_PALABRAS} palabras`;
  document.getElementById("fin-puntos").textContent = `${puntos} puntos`;
  document.getElementById("fin-nivel").textContent = `Nivel: ${NOMBRE_NIVEL[nivelActual]}`;
}

// Permite usar el teclado físico (útil en computadora).
document.addEventListener("keydown", (e) => {
  if (pantallaJuego.hidden || bloqueo) return;
  if (e.key === "Backspace") {
    borrar();
    return;
  }
  const tecla = e.key.toUpperCase();
  if (tecla.length === 1 && /[A-ZÑ]/.test(tecla)) {
    // Buscamos la primera ficha libre con esa letra.
    const i = fichas.findIndex((f) => !f.usada && f.letra === tecla);
    if (i !== -1) elegirLetra(i);
  }
});

// Botones de nivel.
document.querySelectorAll("[data-nivel]").forEach((boton) => {
  boton.addEventListener("click", () => empezarPartida(boton.dataset.nivel));
});

// Botón "borrar" (quita la última letra).
document.getElementById("btn-borrar").addEventListener("click", borrar);

// Botones "volver a elegir nivel".
document.querySelectorAll("[data-accion='inicio']").forEach((boton) => {
  boton.addEventListener("click", () => mostrarPantalla(pantallaInicio));
});

// Botón "Jugar otra vez".
document.getElementById("btn-repetir").addEventListener("click", () => {
  empezarPartida(nivelActual);
});

mostrarPantalla(pantallaInicio);
