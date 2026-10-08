// Robot programador — Aprende con Ana Isabella
// Arma un programa (lista de instrucciones en orden) para que el robot llegue
// a la estrella sin chocar con las rocas. 5 niveles cada vez más difíciles.

const TAMANO = 5;
const MAX_INSTRUCCIONES = 16;
const VELOCIDAD = 420; // milisegundos por paso

// Posiciones como [fila, columna]. Las rocas son obstáculos.
const NIVELES = [
  { inicio: [2, 0], meta: [2, 4], rocas: [] },
  { inicio: [4, 0], meta: [0, 4], rocas: [] },
  { inicio: [4, 2], meta: [0, 2], rocas: [[2, 1], [2, 2], [2, 3]] },
  { inicio: [4, 0], meta: [0, 0], rocas: [[3, 0], [3, 1], [1, 1], [1, 2], [1, 3], [1, 4]] },
  { inicio: [0, 0], meta: [4, 4], rocas: [[0, 1], [1, 1], [2, 1], [2, 3], [3, 3], [4, 3]] },
];

const MOVIMIENTOS = {
  arriba: { fila: -1, columna: 0, simbolo: "↑" },
  abajo: { fila: 1, columna: 0, simbolo: "↓" },
  izquierda: { fila: 0, columna: -1, simbolo: "←" },
  derecha: { fila: 0, columna: 1, simbolo: "→" },
};

let nivelActual = 0;
let programa = [];
let posicion = null;
let pisadas = new Set();
let choco = false;
let ejecutando = false;
let tableroSucio = false; // true después de ejecutar, hasta que se edite el programa

const nivelesEl = document.getElementById("niveles-robot");
const retoEl = document.getElementById("reto");
const tableroEl = document.getElementById("tablero");
const listaEl = document.getElementById("lista-instrucciones");
const pasosEl = document.getElementById("pasos");
const mensajeEl = document.getElementById("mensaje");
const recordEl = document.getElementById("fin-record");
const botonEjecutar = document.getElementById("btn-ejecutar");
const botonQuitar = document.getElementById("btn-quitar");
const botonBorrar = document.getElementById("btn-borrar");
const botonSiguiente = document.getElementById("btn-siguiente");
const botonesDireccion = document.querySelectorAll(".controles button");

const clave = ([f, c]) => `${f},${c}`;
const iguales = (a, b) => a[0] === b[0] && a[1] === b[1];

function nivel() {
  return NIVELES[nivelActual];
}

function esRoca(f, c, n = nivel()) {
  return n.rocas.some(([rf, rc]) => rf === f && rc === c);
}

// Menor cantidad de pasos para llegar a la estrella (búsqueda en anchura).
function caminoMinimo(n) {
  const cola = [[n.inicio[0], n.inicio[1], 0]];
  const visto = new Set([clave(n.inicio)]);
  while (cola.length) {
    const [f, c, d] = cola.shift();
    if (f === n.meta[0] && c === n.meta[1]) return d;
    for (const m of Object.values(MOVIMIENTOS)) {
      const nf = f + m.fila;
      const nc = c + m.columna;
      if (nf < 0 || nf >= TAMANO || nc < 0 || nc >= TAMANO || esRoca(nf, nc, n)) continue;
      if (visto.has(`${nf},${nc}`)) continue;
      visto.add(`${nf},${nc}`);
      cola.push([nf, nc, d + 1]);
    }
  }
  return Infinity;
}

function estrellasGuardadas(i) {
  return (Aprende.progreso().robot || {})[String(i + 1)] || 0;
}

// Un nivel se desbloquea al completar el anterior.
function desbloqueado(i) {
  return i === 0 || estrellasGuardadas(i - 1) > 0;
}

// ---- Dibujo ----

function dibujarNiveles() {
  nivelesEl.innerHTML = "";
  NIVELES.forEach((_, i) => {
    const boton = document.createElement("button");
    boton.className = "punto-nivel" + (i === nivelActual ? " actual" : "");
    const abierto = desbloqueado(i);
    boton.disabled = !abierto || ejecutando;
    const estrellas = estrellasGuardadas(i);
    boton.innerHTML = abierto
      ? `Nivel ${i + 1}<span class="estrellas-nivel">${estrellas ? Aprende.textoEstrellas(estrellas) : "&nbsp;"}</span>`
      : `🔒 ${i + 1}<span class="estrellas-nivel">&nbsp;</span>`;
    boton.addEventListener("click", () => cambiarNivel(i));
    nivelesEl.appendChild(boton);
  });
  retoEl.textContent = `🏆 Reto: llega a la estrella con ${caminoMinimo(nivel())} instrucciones para ganar 3 ⭐`;
}

function dibujarTablero() {
  const n = nivel();
  tableroEl.innerHTML = "";
  for (let f = 0; f < TAMANO; f++) {
    for (let c = 0; c < TAMANO; c++) {
      const celda = document.createElement("div");
      celda.className = "celda";
      if (esRoca(f, c)) {
        celda.classList.add("roca");
        celda.textContent = "🪨";
      } else if (iguales([f, c], posicion)) {
        celda.textContent = choco ? "💥" : "🤖";
        if (choco) celda.classList.add("choque");
        celda.id = "celda-robot";
      } else if (iguales([f, c], n.meta)) {
        celda.textContent = "⭐";
      }
      if (pisadas.has(`${f},${c}`) && !iguales([f, c], posicion)) celda.classList.add("pisada");
      tableroEl.appendChild(celda);
    }
  }
}

// activo = instrucción que se está ejecutando; fallo = la que causó el choque.
function dibujarPrograma(activo = -1, fallo = -1) {
  listaEl.innerHTML = "";
  if (programa.length === 0) {
    listaEl.innerHTML = '<span class="vacia">Toca las flechas para armar tu programa…</span>';
  }
  programa.forEach((paso, i) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    if (i === fallo) chip.classList.add("fallo");
    else if (i === activo) chip.classList.add("activa");
    else if (activo !== -1 && i < activo) chip.classList.add("hecha");
    chip.textContent = MOVIMIENTOS[paso].simbolo;
    listaEl.appendChild(chip);
  });
  pasosEl.textContent = `${programa.length} / ${MAX_INSTRUCCIONES} instrucciones`;
}

function limpiarMensajes() {
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje";
  recordEl.hidden = true;
  botonSiguiente.hidden = true;
}

function reiniciarTablero() {
  posicion = [...nivel().inicio];
  pisadas = new Set();
  choco = false;
  tableroSucio = false;
  dibujarTablero();
}

// ---- Edición del programa ----

function alEditar() {
  if (tableroSucio) reiniciarTablero();
  limpiarMensajes();
  dibujarPrograma();
}

function agregar(direccion) {
  if (ejecutando || programa.length >= MAX_INSTRUCCIONES) return;
  programa.push(direccion);
  Aprende.sonido.clic();
  alEditar();
}

function quitarUltimo() {
  if (ejecutando || programa.length === 0) return;
  programa.pop();
  Aprende.sonido.clic();
  alEditar();
}

function borrarTodo() {
  if (ejecutando) return;
  programa = [];
  alEditar();
}

function bloquearControles(bloquear) {
  botonesDireccion.forEach((b) => (b.disabled = bloquear));
  botonEjecutar.disabled = bloquear;
  botonQuitar.disabled = bloquear;
  botonBorrar.disabled = bloquear;
  nivelesEl.querySelectorAll("button").forEach((b, i) => (b.disabled = bloquear || !desbloqueado(i)));
}

// ---- Ejecución ----

function ejecutar() {
  if (ejecutando || programa.length === 0) return;
  ejecutando = true;
  bloquearControles(true);
  limpiarMensajes();
  reiniciarTablero();
  tableroSucio = true;

  let i = 0;
  const paso = () => {
    if (i >= programa.length) {
      dibujarPrograma();
      terminar(false, "El robot no llegó a la estrella. ¡Revisa tu programa y vuelve a intentar!");
      return;
    }
    dibujarPrograma(i);
    const m = MOVIMIENTOS[programa[i]];
    const nf = posicion[0] + m.fila;
    const nc = posicion[1] + m.columna;
    const fuera = nf < 0 || nf >= TAMANO || nc < 0 || nc >= TAMANO;
    if (fuera || esRoca(nf, nc)) {
      choco = true;
      dibujarTablero();
      dibujarPrograma(-1, i);
      terminar(false, fuera ? "¡Ups! El robot se salió del tablero." : "¡Ups! El robot chocó con una roca 🪨");
      return;
    }
    pisadas.add(clave(posicion));
    posicion = [nf, nc];
    dibujarTablero();
    Aprende.sonido.paso();
    if (iguales(posicion, nivel().meta)) {
      dibujarPrograma(i + 1);
      terminar(true);
      return;
    }
    i++;
    setTimeout(paso, VELOCIDAD);
  };
  setTimeout(paso, 250);
}

function terminar(exito, texto) {
  ejecutando = false;
  bloquearControles(false);

  if (!exito) {
    mensajeEl.textContent = texto;
    mensajeEl.className = "mensaje error";
    Aprende.sonido.error();
    Aprende.efecto.sacudir(tableroEl);
    return;
  }

  const minimo = caminoMinimo(nivel());
  const usadas = programa.length;
  let estrellas = 1;
  if (usadas <= minimo) estrellas = 3;
  else if (usadas <= minimo + 2) estrellas = 2;

  Aprende.efecto.rebote(document.getElementById("celda-robot"));
  Aprende.finDePartida("robot", String(nivelActual + 1), estrellas);

  const ultimo = nivelActual === NIVELES.length - 1;
  let resumen = `¡Lo lograste! 🎉 ${Aprende.textoEstrellas(estrellas)} — usaste ${usadas} instrucciones.`;
  if (estrellas < 3) resumen += ` El camino más corto tiene ${minimo}. ¿Lo puedes mejorar?`;
  if (ultimo) resumen += " 🏆 ¡Completaste todos los niveles!";
  mensajeEl.textContent = resumen;
  mensajeEl.className = "mensaje exito";
  botonSiguiente.hidden = ultimo;
  dibujarNiveles();
}

function cambiarNivel(i) {
  if (ejecutando || !desbloqueado(i)) return;
  nivelActual = i;
  programa = [];
  limpiarMensajes();
  reiniciarTablero();
  dibujarPrograma();
  dibujarNiveles();
}

// ---- Eventos ----

document.getElementById("arriba").addEventListener("click", () => agregar("arriba"));
document.getElementById("abajo").addEventListener("click", () => agregar("abajo"));
document.getElementById("izquierda").addEventListener("click", () => agregar("izquierda"));
document.getElementById("derecha").addEventListener("click", () => agregar("derecha"));
botonEjecutar.addEventListener("click", ejecutar);
botonQuitar.addEventListener("click", quitarUltimo);
botonBorrar.addEventListener("click", borrarTodo);
botonSiguiente.addEventListener("click", () => cambiarNivel(nivelActual + 1));

// Flechas del teclado, Enter para ejecutar y Borrar para quitar la última.
const TECLAS = { ArrowUp: "arriba", ArrowDown: "abajo", ArrowLeft: "izquierda", ArrowRight: "derecha" };
document.addEventListener("keydown", (e) => {
  if (TECLAS[e.key]) {
    e.preventDefault();
    agregar(TECLAS[e.key]);
  } else if (e.key === "Enter") {
    e.preventDefault();
    ejecutar();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    quitarUltimo();
  }
});

// Empezamos en el primer nivel que aún no tiene estrellas.
const pendiente = NIVELES.findIndex((_, i) => desbloqueado(i) && estrellasGuardadas(i) === 0);
cambiarNivel(pendiente === -1 ? 0 : pendiente);
