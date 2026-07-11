const TAMANO = 5;
const INICIO = { fila: 4, columna: 0 };
const META = { fila: 0, columna: 4 };
const MAX_INSTRUCCIONES = 15;

const SIMBOLOS = {
  arriba: "⬆️",
  abajo: "⬇️",
  izquierda: "⬅️",
  derecha: "➡️",
};

const MOVIMIENTOS = {
  arriba: { fila: -1, columna: 0 },
  abajo: { fila: 1, columna: 0 },
  izquierda: { fila: 0, columna: -1 },
  derecha: { fila: 0, columna: 1 },
};

let instrucciones = [];
let posicion = { ...INICIO };
let ejecutando = false;

const tableroEl = document.getElementById("tablero");
const listaEl = document.getElementById("lista-instrucciones");
const mensajeEl = document.getElementById("mensaje");
const botonEjecutar = document.getElementById("btn-ejecutar");
const botonBorrar = document.getElementById("btn-borrar");
const botonesDireccion = document.querySelectorAll(".controles button");

function dibujarTablero() {
  tableroEl.innerHTML = "";
  for (let fila = 0; fila < TAMANO; fila++) {
    for (let columna = 0; columna < TAMANO; columna++) {
      const celda = document.createElement("div");
      celda.className = "celda";
      if (fila === posicion.fila && columna === posicion.columna) {
        celda.textContent = "🤖";
      } else if (fila === META.fila && columna === META.columna) {
        celda.textContent = "⭐";
      }
      tableroEl.appendChild(celda);
    }
  }
}

function dibujarInstrucciones() {
  listaEl.textContent = instrucciones.map((paso) => SIMBOLOS[paso]).join(" ") || "Agrega movimientos con las flechas...";
}

function agregarInstruccion(direccion) {
  if (ejecutando || instrucciones.length >= MAX_INSTRUCCIONES) return;
  instrucciones.push(direccion);
  dibujarInstrucciones();
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje";
}

function borrarTodo() {
  if (ejecutando) return;
  instrucciones = [];
  posicion = { ...INICIO };
  dibujarInstrucciones();
  dibujarTablero();
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje";
}

function alternarBotones(deshabilitar) {
  botonesDireccion.forEach((boton) => (boton.disabled = deshabilitar));
  botonEjecutar.disabled = deshabilitar;
  botonBorrar.disabled = deshabilitar;
}

function ejecutarInstrucciones() {
  if (ejecutando || instrucciones.length === 0) return;
  ejecutando = true;
  alternarBotones(true);
  posicion = { ...INICIO };
  dibujarTablero();

  let paso = 0;
  const intervalo = setInterval(() => {
    if (paso >= instrucciones.length) {
      clearInterval(intervalo);
      terminarEjecucion();
      return;
    }
    const movimiento = MOVIMIENTOS[instrucciones[paso]];
    const nuevaFila = posicion.fila + movimiento.fila;
    const nuevaColumna = posicion.columna + movimiento.columna;
    if (nuevaFila >= 0 && nuevaFila < TAMANO && nuevaColumna >= 0 && nuevaColumna < TAMANO) {
      posicion = { fila: nuevaFila, columna: nuevaColumna };
      dibujarTablero();
    }
    paso++;
  }, 450);
}

function terminarEjecucion() {
  ejecutando = false;
  alternarBotones(false);
  const logrado = posicion.fila === META.fila && posicion.columna === META.columna;
  if (logrado) {
    mensajeEl.textContent = "¡Lo lograste! 🎉 El robot llegó a la estrella.";
    mensajeEl.className = "mensaje exito";
  } else {
    mensajeEl.textContent = "Casi... el robot no llegó a la estrella. ¡Intenta de nuevo!";
    mensajeEl.className = "mensaje error";
  }
}

document.getElementById("arriba").addEventListener("click", () => agregarInstruccion("arriba"));
document.getElementById("abajo").addEventListener("click", () => agregarInstruccion("abajo"));
document.getElementById("izquierda").addEventListener("click", () => agregarInstruccion("izquierda"));
document.getElementById("derecha").addEventListener("click", () => agregarInstruccion("derecha"));
botonEjecutar.addEventListener("click", ejecutarInstrucciones);
botonBorrar.addEventListener("click", borrarTodo);

dibujarTablero();
dibujarInstrucciones();
