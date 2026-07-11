// Números mágicos — Aprende con Ana Isabella
// Juego de matemáticas con teclado interactivo, objetos para contar y rachas.

const TOTAL_PREGUNTAS = 10;
const PUNTOS_BASE = 10; // puntos por respuesta correcta
const MAX_DIGITOS = 4; // largo máximo de la respuesta que se puede escribir

const NOMBRE_NIVEL = {
  facil: "Fácil",
  intermedio: "Intermedio",
  dificil: "Difícil",
};

// Emojis para los objetos que se cuentan en el nivel fácil.
const OBJETOS = ["🍎", "⭐", "🎈", "🐢", "🌸", "🍓", "🐟", "🦋"];

// Mensajes de ánimo al acertar (se elige uno al azar).
const ANIMOS = ["¡Muy bien! 🎉", "¡Excelente! ✨", "¡Perfecto! 🌟", "¡Genial! 🎊", "¡Correcto! 👏"];

// Estado de la partida.
let nivelActual = null;
let problemas = [];
let indice = 0;
let puntos = 0;
let aciertos = 0;
let racha = 0;
let respuestaEscrita = "";
let bloqueado = false;

// Elementos de la página.
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFin = document.getElementById("pantalla-fin");

const puntosEl = document.getElementById("puntos");
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("barra-progreso");
const rachaEl = document.getElementById("racha");
const manipulativosEl = document.getElementById("manipulativos");
const operacionEl = document.getElementById("operacion");
const respuestaEl = document.getElementById("respuesta");
const tecladoEl = document.getElementById("teclado");
const mensajeEl = document.getElementById("mensaje-juego");

// Devuelve un entero al azar entre min y max (ambos incluidos).
function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function mostrarPantalla(pantalla) {
  [pantallaInicio, pantallaJuego, pantallaFin].forEach((p) => {
    p.hidden = p !== pantalla;
  });
}

// Crea un problema de matemáticas según el nivel.
function generarProblema(nivel) {
  let a, b, op, respuesta;

  if (nivel === "facil") {
    op = elegir(["+", "-"]);
    if (op === "+") {
      a = aleatorio(1, 6);
      b = aleatorio(1, 6);
      respuesta = a + b;
    } else {
      a = aleatorio(3, 10);
      b = aleatorio(1, a - 1);
      respuesta = a - b;
    }
  } else if (nivel === "intermedio") {
    op = elegir(["+", "-", "×"]);
    if (op === "+") {
      a = aleatorio(10, 50);
      b = aleatorio(10, 50);
      respuesta = a + b;
    } else if (op === "-") {
      a = aleatorio(20, 60);
      b = aleatorio(1, a);
      respuesta = a - b;
    } else {
      a = aleatorio(2, 5);
      b = aleatorio(2, 9);
      respuesta = a * b;
    }
  } else {
    op = elegir(["+", "-", "×", "÷"]);
    if (op === "+") {
      a = aleatorio(25, 99);
      b = aleatorio(25, 99);
      respuesta = a + b;
    } else if (op === "-") {
      a = aleatorio(40, 99);
      b = aleatorio(10, a);
      respuesta = a - b;
    } else if (op === "×") {
      a = aleatorio(3, 9);
      b = aleatorio(3, 9);
      respuesta = a * b;
    } else {
      // División exacta: construimos a partir del resultado para que no sobre.
      b = aleatorio(2, 9);
      respuesta = aleatorio(2, 9);
      a = b * respuesta;
    }
  }

  return { a, b, op, respuesta };
}

function empezarPartida(nivel) {
  nivelActual = nivel;
  problemas = [];
  for (let i = 0; i < TOTAL_PREGUNTAS; i++) {
    problemas.push(generarProblema(nivel));
  }
  indice = 0;
  puntos = 0;
  aciertos = 0;
  racha = 0;
  mostrarPantalla(pantallaJuego);
  mostrarProblema();
}

// Dibuja los objetos para contar (solo en el nivel fácil).
function dibujarManipulativos(problema) {
  manipulativosEl.innerHTML = "";
  if (nivelActual !== "facil") {
    manipulativosEl.hidden = true;
    return;
  }
  manipulativosEl.hidden = false;
  const objeto = elegir(OBJETOS);

  if (problema.op === "+") {
    // Dos grupos de objetos que se juntan.
    manipulativosEl.appendChild(crearGrupo(problema.a, objeto, false));
    const mas = document.createElement("span");
    mas.className = "signo-objetos";
    mas.textContent = "+";
    manipulativosEl.appendChild(mas);
    manipulativosEl.appendChild(crearGrupo(problema.b, objeto, false));
  } else {
    // Un grupo donde tachamos los que se quitan.
    const grupo = document.createElement("div");
    grupo.className = "grupo-objetos";
    for (let i = 0; i < problema.a; i++) {
      const item = document.createElement("span");
      item.className = "objeto";
      // Los últimos b objetos se muestran tachados (se los "quitamos").
      if (i >= problema.a - problema.b) item.classList.add("quitado");
      item.textContent = objeto;
      grupo.appendChild(item);
    }
    manipulativosEl.appendChild(grupo);
  }
}

function crearGrupo(cantidad, objeto) {
  const grupo = document.createElement("div");
  grupo.className = "grupo-objetos";
  for (let i = 0; i < cantidad; i++) {
    const item = document.createElement("span");
    item.className = "objeto";
    item.textContent = objeto;
    grupo.appendChild(item);
  }
  return grupo;
}

function mostrarProblema() {
  bloqueado = false;
  respuestaEscrita = "";
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje-juego";

  const problema = problemas[indice];
  puntosEl.textContent = `Puntos: ${puntos}`;
  contadorEl.textContent = `${indice + 1}/${TOTAL_PREGUNTAS}`;
  barraEl.style.width = `${(indice / TOTAL_PREGUNTAS) * 100}%`;
  actualizarRacha();

  dibujarManipulativos(problema);

  operacionEl.textContent = `${problema.a} ${problema.op} ${problema.b}`;
  actualizarRespuesta();

  respuestaEl.classList.remove("correcta", "incorrecta");
  habilitarTeclado(true);
}

function actualizarRacha() {
  if (racha >= 2) {
    rachaEl.hidden = false;
    rachaEl.textContent = `🔥 ${racha}`;
  } else {
    rachaEl.hidden = true;
  }
}

function actualizarRespuesta() {
  respuestaEl.textContent = respuestaEscrita === "" ? "?" : respuestaEscrita;
}

function habilitarTeclado(activo) {
  tecladoEl.querySelectorAll("button").forEach((b) => (b.disabled = !activo));
}

// Maneja cada tecla del teclado en pantalla.
function pulsarTecla(valor) {
  if (bloqueado) return;
  if (valor === "borrar") {
    respuestaEscrita = respuestaEscrita.slice(0, -1);
    actualizarRespuesta();
  } else if (valor === "comprobar") {
    comprobar();
  } else {
    // Es un dígito.
    if (respuestaEscrita.length < MAX_DIGITOS) {
      respuestaEscrita += valor;
      actualizarRespuesta();
    }
  }
}

function comprobar() {
  if (respuestaEscrita === "" || bloqueado) return;
  bloqueado = true;
  habilitarTeclado(false);

  const problema = problemas[indice];
  const acerto = Number(respuestaEscrita) === problema.respuesta;

  if (acerto) {
    racha++;
    aciertos++;
    // Puntos base + un pequeño bono por racha.
    const bono = Math.max(0, racha - 1) * 2;
    puntos += PUNTOS_BASE + bono;
    puntosEl.textContent = `Puntos: ${puntos}`;
    respuestaEl.classList.add("correcta");
    mensajeEl.textContent = bono > 0 ? `${elegir(ANIMOS)} (+${PUNTOS_BASE + bono})` : elegir(ANIMOS);
    mensajeEl.className = "mensaje-juego exito";
  } else {
    racha = 0;
    respuestaEl.classList.add("incorrecta");
    mensajeEl.textContent = `Casi... la respuesta era ${problema.respuesta}`;
    mensajeEl.className = "mensaje-juego error";
  }
  actualizarRacha();

  setTimeout(siguiente, 1500);
}

function siguiente() {
  indice++;
  if (indice >= problemas.length) {
    terminarPartida();
  } else {
    mostrarProblema();
  }
}

function terminarPartida() {
  barraEl.style.width = "100%";
  mostrarPantalla(pantallaFin);

  const porcentaje = aciertos / TOTAL_PREGUNTAS;
  let estrellas = 0;
  if (porcentaje >= 0.9) estrellas = 3;
  else if (porcentaje >= 0.6) estrellas = 2;
  else if (porcentaje >= 0.3) estrellas = 1;

  let felicitacion = "¡Sigue practicando, lo estás logrando!";
  if (estrellas === 3) felicitacion = "¡Increíble! Eres una maga de los números.";
  else if (estrellas === 2) felicitacion = "¡Muy bien! Ya dominas muchas operaciones.";
  else if (estrellas === 1) felicitacion = "¡Buen intento! Cada vez lo haces mejor.";

  document.getElementById("fin-estrellas").textContent =
    "⭐".repeat(estrellas) + "☆".repeat(3 - estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-puntaje").textContent = `Acertaste ${aciertos} de ${TOTAL_PREGUNTAS}`;
  document.getElementById("fin-puntos").textContent = `${puntos} puntos`;
  document.getElementById("fin-nivel").textContent = `Nivel: ${NOMBRE_NIVEL[nivelActual]}`;
}

// Construye el teclado numérico en pantalla.
function construirTeclado() {
  const teclas = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "borrar", "0", "comprobar"];
  teclas.forEach((valor) => {
    const boton = document.createElement("button");
    boton.className = "tecla";
    if (valor === "borrar") {
      boton.classList.add("tecla-borrar");
      boton.textContent = "⌫";
      boton.setAttribute("aria-label", "Borrar");
    } else if (valor === "comprobar") {
      boton.classList.add("tecla-comprobar");
      boton.textContent = "✓";
      boton.setAttribute("aria-label", "Comprobar");
    } else {
      boton.textContent = valor;
    }
    boton.addEventListener("click", () => pulsarTecla(valor));
    tecladoEl.appendChild(boton);
  });
}

// También permite usar el teclado físico (útil en computadora).
document.addEventListener("keydown", (e) => {
  if (pantallaJuego.hidden) return;
  if (e.key >= "0" && e.key <= "9") pulsarTecla(e.key);
  else if (e.key === "Backspace") pulsarTecla("borrar");
  else if (e.key === "Enter") pulsarTecla("comprobar");
});

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

construirTeclado();
mostrarPantalla(pantallaInicio);
