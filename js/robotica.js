// Robótica — Aprende con Ana Isabella
// Dos talleres con Capi, la ingeniera:
//  · Robot con sensores: programa con bloques (avanzar, girar, repetir,
//    repetir hasta llegar, si hay algo adelante). En los últimos niveles el
//    mismo programa debe funcionar en varios tableros: para eso sirven los
//    sensores.
//  · Taller de circuitos: gira los cables para cerrar el circuito y prender
//    focos y motores (interruptor, serie, paralelo y cortocircuito).
// Las reglas están en js/robotica-motor.js y los niveles en js/robotica-niveles.js.

const R = Robotica;
const IMG = "../img/robotica/";
const VELOCIDAD = 380; // milisegundos por paso del robot

const BLOQUES = {
  avanzar: { texto: "↑ Avanzar", clase: "b-mover" },
  izq: { texto: "↺ Girar a la izquierda", clase: "b-mover" },
  der: { texto: "↻ Girar a la derecha", clase: "b-mover" },
  repetir: { texto: "Repetir __ veces", clase: "b-repetir" },
  hasta: { texto: "Repetir hasta llegar a la estrella", clase: "b-repetir" },
  si: { texto: "Si hay algo adelante…", clase: "b-si" },
};

// Cambia al salir de una pantalla; las animaciones viejas lo revisan y se detienen.
let sesion = 0;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const pantallas = {
  mapa: document.getElementById("pantalla-mapa"),
  robot: document.getElementById("pantalla-robot"),
  circuito: document.getElementById("pantalla-circuito"),
};

function mostrarPantalla(nombre) {
  sesion++;
  Object.entries(pantallas).forEach(([k, el]) => (el.hidden = k !== nombre));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mensaje(el, texto, tipo = "") {
  el.innerHTML = texto;
  el.className = "mensaje-juego " + tipo;
}

function estrellasGuardadas(clave) {
  return (Aprende.progreso().robotica || {})[clave] || 0;
}

// Guarda, celebra y muestra el aviso de récord en la pantalla actual.
function celebrar(clave, estrellas, pantalla) {
  const record = Aprende.finDePartida("robotica", clave, estrellas);
  const aviso = pantalla.querySelector("[data-record]");
  aviso.hidden = !record;
  aviso.textContent = "🏅 ¡Nuevo récord en este nivel!";
}

// ================= Mapa de los dos talleres =================

function pintarMapa() {
  [["robot", NIVELES_ROBOT, "niveles-robot"], ["circuito", NIVELES_CIRCUITO, "niveles-circuito"]].forEach(
    ([taller, niveles, idContenedor]) => {
      const contenedor = document.getElementById(idContenedor);
      contenedor.innerHTML = "";
      niveles.forEach((nivel, i) => {
        const abierto = i === 0 || estrellasGuardadas(`${taller}-${i}`) > 0;
        const estrellas = estrellasGuardadas(`${taller}-${i + 1}`);
        const boton = document.createElement("button");
        boton.className = "nivel-taller";
        boton.disabled = !abierto;
        boton.innerHTML = `<span class="num">${i + 1}</span><span class="nombre">${abierto ? nivel.titulo : "Bloqueado"}</span>
          <span class="estrellas-nivel">${estrellas ? Aprende.textoEstrellas(estrellas) : ""}</span>`;
        boton.addEventListener("click", () => (taller === "robot" ? abrirNivelRobot(i) : abrirNivelCircuito(i)));
        contenedor.appendChild(boton);
      });
    }
  );
}

document.querySelectorAll("[data-accion='mapa']").forEach((b) =>
  b.addEventListener("click", () => {
    pintarMapa();
    mostrarPantalla("mapa");
  })
);

// ================= Taller 1: robot con sensores =================

const tableroEl = document.getElementById("tablero-sensores");
const variantesEl = document.getElementById("variantes");
const cajaBloquesEl = document.getElementById("caja-bloques");
const programaEl = document.getElementById("programa");
const cuentaBloquesEl = document.getElementById("cuenta-bloques");
const mensajeRobotEl = document.getElementById("mensaje-robot");
const botonCorrer = document.getElementById("btn-correr");
const botonLimpiar = document.getElementById("btn-limpiar");
const botonSiguienteRobot = document.getElementById("btn-siguiente-robot");

let nivelRobot = 0;
let programa = [];
let destino = programa; // lista donde se agregan los bloques nuevos
let proximoId = 1;
let animando = false;
let tableroVisto = 0;
let resultadosVariantes = []; // "exito" / "falla" por tablero, después de correr

function nivelActualRobot() {
  return NIVELES_ROBOT[nivelRobot];
}

function abrirNivelRobot(i) {
  nivelRobot = i;
  const nivel = nivelActualRobot();
  programa = [];
  destino = programa;
  animando = false;
  tableroVisto = 0;
  resultadosVariantes = [];
  mostrarPantalla("robot");
  document.getElementById("titulo-robot").textContent = `Nivel ${i + 1}: ${nivel.titulo}`;
  document.getElementById("texto-robot").innerHTML = nivel.texto;
  document.getElementById("reto-robot").textContent =
    `🏆 Reto: resuélvelo con ${nivel.reto} bloques` + (nivel.maxBloques ? ` · máximo ${nivel.maxBloques}` : "");
  pantallas.robot.querySelector("[data-record]").hidden = true;
  botonSiguienteRobot.hidden = true;
  mensaje(mensajeRobotEl, "");
  pintarCajaBloques();
  pintarPrograma();
  mostrarTableroInicial();
}

function pintarCajaBloques() {
  cajaBloquesEl.innerHTML = "";
  nivelActualRobot().bloques.forEach((tipo) => {
    const boton = document.createElement("button");
    boton.className = `bloque-caja ${BLOQUES[tipo].clase}`;
    boton.textContent = BLOQUES[tipo].texto.replace("__", "N");
    boton.addEventListener("click", () => agregarBloque(tipo));
    cajaBloquesEl.appendChild(boton);
  });
}

function agregarBloque(tipo) {
  if (animando) return;
  const nivel = nivelActualRobot();
  if (nivel.maxBloques && R.contarBloques(programa) >= nivel.maxBloques) {
    mensaje(mensajeRobotEl, `En este nivel caben máximo ${nivel.maxBloques} bloques. ¡Usa un bloque que repita!`, "error");
    Aprende.sonido.error();
    Aprende.efecto.sacudir(programaEl);
    return;
  }
  const bloque = { id: proximoId++, tipo };
  if (tipo === "repetir") {
    bloque.veces = 3;
    bloque.hijos = [];
  } else if (tipo === "hasta") {
    bloque.hijos = [];
  } else if (tipo === "si") {
    bloque.si = [];
    bloque.sino = [];
  }
  destino.push(bloque);
  // Los bloques nuevos se meten automáticamente dentro de un Repetir o Si.
  if (bloque.hijos) destino = bloque.hijos;
  else if (bloque.si) destino = bloque.si;
  Aprende.sonido.clic();
  alEditar();
}

// ¿La lista está dentro del bloque (o es una de sus ranuras)?
function contieneLista(bloque, lista) {
  return [bloque.hijos, bloque.si, bloque.sino].some(
    (l) => l && (l === lista || l.some((hijo) => contieneLista(hijo, lista)))
  );
}

function quitarBloque(bloque, lista) {
  lista.splice(lista.indexOf(bloque), 1);
  if (contieneLista(bloque, destino)) destino = lista;
  Aprende.sonido.clic();
  alEditar();
}

function alEditar() {
  resultadosVariantes = [];
  mensaje(mensajeRobotEl, "");
  pintarPrograma();
  mostrarTableroInicial();
}

function pintarPrograma() {
  programaEl.innerHTML = "";
  programaEl.appendChild(ranura(programa, "Aquí va tu programa"));
  const nivel = nivelActualRobot();
  const n = R.contarBloques(programa);
  cuentaBloquesEl.textContent = `(${n}${nivel.maxBloques ? ` de ${nivel.maxBloques}` : ""} bloques)`;
}

function ranura(lista, textoVacio) {
  const div = document.createElement("div");
  div.className = "ranura" + (lista === destino ? " activa" : "");
  if (!lista.length) div.innerHTML = `<span class="ranura-vacia">${textoVacio}</span>`;
  lista.forEach((b) => div.appendChild(bloqueEl(b, lista)));
  // Tocar una ranura la elige como lugar donde agregar bloques.
  div.addEventListener("click", (e) => {
    if (animando || e.target.closest(".ranura") !== div || e.target.closest("button")) return;
    destino = lista;
    pintarPrograma();
  });
  return div;
}

function bloqueEl(b, lista) {
  const el = document.createElement("div");
  el.className = `bloque ${BLOQUES[b.tipo].clase}`;
  el.dataset.id = b.id;
  const cabeza = document.createElement("div");
  cabeza.className = "bloque-cabeza";
  if (b.tipo === "repetir") {
    cabeza.innerHTML = `<span>Repetir</span>
      <button class="mini" data-cambio="-1" aria-label="Menos veces">−</button>
      <strong class="veces">${b.veces}</strong>
      <button class="mini" data-cambio="1" aria-label="Más veces">+</button>
      <span>veces</span>`;
    cabeza.querySelectorAll("[data-cambio]").forEach((boton) =>
      boton.addEventListener("click", () => {
        if (animando) return;
        b.veces = Math.min(9, Math.max(2, b.veces + Number(boton.dataset.cambio)));
        Aprende.sonido.clic();
        alEditar();
      })
    );
  } else {
    cabeza.innerHTML = `<span>${BLOQUES[b.tipo].texto}</span>`;
  }
  const quitar = document.createElement("button");
  quitar.className = "mini quitar-bloque";
  quitar.setAttribute("aria-label", "Quitar este bloque");
  quitar.textContent = "×";
  quitar.addEventListener("click", () => !animando && quitarBloque(b, lista));
  cabeza.appendChild(quitar);
  el.appendChild(cabeza);

  if (b.hijos) el.appendChild(ranura(b.hijos, "toca aquí y agrega lo que se repite"));
  if (b.si) {
    el.appendChild(ranura(b.si, "qué hacer si hay algo"));
    const sino = document.createElement("div");
    sino.className = "bloque-cabeza sino";
    sino.textContent = "si no (está libre):";
    el.appendChild(sino);
    el.appendChild(ranura(b.sino, "qué hacer si está libre"));
  }
  return el;
}

function resaltarBloque(id) {
  programaEl.querySelectorAll(".bloque.ejecutando").forEach((e) => e.classList.remove("ejecutando"));
  const el = programaEl.querySelector(`.bloque[data-id="${id}"]`);
  if (el) el.classList.add("ejecutando");
}

// ---- Tablero ----

function estadoInicial(tablero) {
  return {
    robot: { ...tablero.robot },
    estrellas: new Set(tablero.estrellas.map(R.clave)),
    pisadas: new Set(),
    sensor: null,
    choque: null,
  };
}

function pintarTablero(tablero, estado) {
  tableroEl.style.gridTemplateColumns = `repeat(${tablero.cols}, 1fr)`;
  tableroEl.innerHTML = "";
  const rocas = new Set(tablero.rocas.map(R.clave));
  // Si chocó contra la orilla, la casilla del choque no existe: marcamos la del robot.
  const choqueFuera = estado.choque &&
    (estado.choque[0] < 0 || estado.choque[0] >= tablero.filas || estado.choque[1] < 0 || estado.choque[1] >= tablero.cols);
  for (let f = 0; f < tablero.filas; f++) {
    for (let c = 0; c < tablero.cols; c++) {
      const k = R.clave([f, c]);
      const celda = document.createElement("div");
      celda.className = "celda-sensor";
      if (estado.pisadas.has(k)) celda.classList.add("pisada");
      if (estado.sensor && R.clave(estado.sensor.casilla) === k) celda.classList.add(estado.sensor.hay ? "sensor-hay" : "sensor-libre");
      if (estado.choque && R.clave(estado.choque) === k) celda.classList.add("choque");
      if (choqueFuera && estado.robot.f === f && estado.robot.c === c) celda.classList.add("choque");
      if (rocas.has(k)) celda.innerHTML = `<img src="${IMG}roca.svg" alt="roca" />`;
      else if (estado.robot.f === f && estado.robot.c === c) {
        celda.innerHTML = `<img class="rover" src="${IMG}rover.svg" alt="robot" style="transform: rotate(${estado.robot.dir * 90}deg)" />`;
      } else if (estado.estrellas.has(k)) celda.innerHTML = `<img src="${IMG}estrella.svg" alt="estrella" />`;
      tableroEl.appendChild(celda);
    }
  }
}

function pintarVariantes() {
  const tableros = nivelActualRobot().tableros;
  variantesEl.innerHTML = "";
  variantesEl.hidden = tableros.length === 1;
  tableros.forEach((_, i) => {
    const boton = document.createElement("button");
    boton.className = "variante" + (i === tableroVisto ? " actual" : "");
    const marca = resultadosVariantes[i] === "exito" ? " ✓" : resultadosVariantes[i] === "falla" ? " ✗" : "";
    boton.textContent = `Tablero ${i + 1}${marca}`;
    boton.addEventListener("click", () => {
      if (animando) return;
      tableroVisto = i;
      mostrarTableroInicial();
    });
    variantesEl.appendChild(boton);
  });
}

function mostrarTableroInicial() {
  const tablero = nivelActualRobot().tableros[tableroVisto];
  pintarTablero(tablero, estadoInicial(tablero));
  pintarVariantes();
  resaltarBloque(null);
}

// ---- Ejecutar ----

function bloquearEditor(si) {
  animando = si;
  botonCorrer.disabled = si;
  botonLimpiar.disabled = si;
  cajaBloquesEl.querySelectorAll("button").forEach((b) => (b.disabled = si));
  programaEl.classList.toggle("corriendo", si);
}

async function animar(tablero, resultado, s) {
  const estado = estadoInicial(tablero);
  pintarTablero(tablero, estado);
  // Si el programa nunca termina, mostramos solo el comienzo.
  const cuadros = resultado.fin === "cansado" ? resultado.cuadros.slice(0, 30) : resultado.cuadros;
  for (const cuadro of cuadros) {
    await espera(VELOCIDAD);
    if (s !== sesion) return false;
    resaltarBloque(cuadro.bloque);
    if (cuadro.robot.f !== estado.robot.f || cuadro.robot.c !== estado.robot.c) {
      estado.pisadas.add(R.clave([estado.robot.f, estado.robot.c]));
      Aprende.sonido.paso();
    }
    estado.robot = cuadro.robot;
    estado.estrellas = new Set(cuadro.estrellas);
    estado.sensor = cuadro.sensor || null;
    estado.choque = cuadro.choque || null;
    if (cuadro.recogida) Aprende.sonido.acierto();
    if (cuadro.sensor) Aprende.sonido.clic();
    pintarTablero(tablero, estado);
  }
  return resultado.fin === "exito";
}

const EXPLICACION = {
  choque: "¡Pum! El robot chocó.",
  cansado: "El robot repite y repite sin llegar nunca. ¡Revisa tus bloques de repetir!",
  incompleto: "El programa terminó, pero el robot no recogió todas las estrellas.",
};

async function correrPrograma() {
  if (animando) return;
  if (!programa.length) {
    mensaje(mensajeRobotEl, "Primero arma tu programa tocando los bloques de arriba.", "error");
    return;
  }
  const nivel = nivelActualRobot();
  const s = sesion;
  bloquearEditor(true);
  // En pantallas chicas el tablero queda arriba del programa: lo mostramos.
  if (window.innerWidth < 700) tableroEl.scrollIntoView({ behavior: "smooth", block: "center" });
  mensaje(mensajeRobotEl, "");
  resultadosVariantes = [];
  let falla = null;
  for (let i = 0; i < nivel.tableros.length; i++) {
    tableroVisto = i;
    pintarVariantes();
    const resultado = R.simular(programa, nivel.tableros[i]);
    const bien = await animar(nivel.tableros[i], resultado, s);
    if (s !== sesion) return;
    resultadosVariantes[i] = bien ? "exito" : "falla";
    pintarVariantes();
    if (!bien) {
      falla = { i, fin: resultado.fin };
      break;
    }
    if (i < nivel.tableros.length - 1) {
      mensaje(mensajeRobotEl, `¡Tablero ${i + 1} listo! ✓ Ahora el siguiente…`, "exito");
      await espera(900);
      if (s !== sesion) return;
    }
  }
  bloquearEditor(false);
  resaltarBloque(null);

  if (falla) {
    const donde = nivel.tableros.length > 1 ? ` (en el tablero ${falla.i + 1})` : "";
    mensaje(mensajeRobotEl, `${EXPLICACION[falla.fin]}${donde} Cambia tu programa y prueba otra vez.`, "error");
    Aprende.sonido.error();
    Aprende.efecto.sacudir(tableroEl);
    return;
  }

  const usados = R.contarBloques(programa);
  let estrellas = 1;
  if (usados <= nivel.reto) estrellas = 3;
  else if (usados <= nivel.reto + 2) estrellas = 2;
  let texto = `¡Funciona! 🎉 ${Aprende.textoEstrellas(estrellas)} Usaste ${usados} ${usados === 1 ? "bloque" : "bloques"}.`;
  if (estrellas < 3) texto += ` Se puede con ${nivel.reto}… ¿lo intentas?`;
  if (nivel.tableros.length > 1) texto += " ¡Tu programa sirvió en todos los tableros!";
  mensaje(mensajeRobotEl, texto, "exito");
  celebrar(`robot-${nivelRobot + 1}`, estrellas, pantallas.robot);
  botonSiguienteRobot.hidden = nivelRobot === NIVELES_ROBOT.length - 1;
}

botonCorrer.addEventListener("click", correrPrograma);
botonLimpiar.addEventListener("click", () => {
  if (animando) return;
  programa = [];
  destino = programa;
  alEditar();
});
botonSiguienteRobot.addEventListener("click", () => abrirNivelRobot(nivelRobot + 1));

// ================= Taller 2: circuitos =================

const placaEl = document.getElementById("placa");
const mensajeCircuitoEl = document.getElementById("mensaje-circuito");
const retoCircuitoEl = document.getElementById("reto-circuito");
const botonSiguienteCircuito = document.getElementById("btn-siguiente-circuito");

let nivelCircuito = 0;
let piezas = [];
let toques = 0;
let cortosCausados = 0;
let habiaCorto = false;
let resuelto = false;

const TINTA = "#2b2118";
const PUNTAS = [[50, 0], [100, 50], [50, 100], [0, 50]];

// Cables desde el centro hacia cada lado abierto, con contorno de tinta.
function cablesSVG(lados, color) {
  const lineas = lados.map((s) => `M50 50 L${PUNTAS[s][0]} ${PUNTAS[s][1]}`).join(" ");
  return `<path d="${lineas}" stroke="${TINTA}" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="${lineas}" stroke="${color}" stroke-width="11" stroke-linecap="round" fill="none"/>
    <circle cx="50" cy="50" r="9" fill="${color}" stroke="${TINTA}" stroke-width="4"/>`;
}

function piezaSVG(p, res) {
  const i = p.f * NIVELES_CIRCUITO[nivelCircuito].cols + p.c;
  const enCorto = res.cortoCeldas.has(i);
  const conCorriente = res.energizadas.has(i);
  const color = enCorto ? "#d65a46" : conCorriente ? "#f0b93b" : "#b07a4f";
  const lados = R.ladosDe(p);
  let dibujo = "";
  if (R.CABLES.includes(p.tipo)) {
    dibujo = cablesSVG(lados, color);
  } else if (p.tipo === "bateria") {
    dibujo = `${cablesSVG(lados, color)}
      <rect x="27" y="20" width="46" height="62" rx="8" fill="#2e7d8c" stroke="${TINTA}" stroke-width="4"/>
      <rect x="40" y="12" width="20" height="10" rx="3" fill="#f0b93b" stroke="${TINTA}" stroke-width="4"/>
      <text x="50" y="44" text-anchor="middle" font-size="26" font-weight="800" fill="#fffdf8">+</text>
      <text x="50" y="72" text-anchor="middle" font-size="26" font-weight="800" fill="#fffdf8">−</text>`;
  } else if (p.tipo === "foco") {
    const prendido = res.encendidos.has(p.id);
    dibujo = `${cablesSVG(lados, color)}
      ${prendido ? '<circle cx="50" cy="50" r="40" fill="#ffe066" opacity="0.45"/>' : ""}
      <circle cx="50" cy="50" r="23" fill="${prendido ? "#ffe066" : "#fff8e6"}" stroke="${TINTA}" stroke-width="4"/>
      <path d="M38 54 l4 -10 l4 10 l4 -10 l4 10 l4 -10" fill="none" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>`;
  } else if (p.tipo === "motor") {
    const girando = res.encendidos.has(p.id);
    dibujo = `${cablesSVG(lados, color)}
      <circle cx="50" cy="50" r="25" fill="#cde4b0" stroke="${TINTA}" stroke-width="4"/>
      <g class="helice${girando ? " girando" : ""}">
        <path d="M50 50 C44 38 46 28 50 26 C54 28 56 38 50 50 Z M50 50 C62 47 70 52 71 56 C68 59 58 58 50 50 Z M50 50 C44 61 36 66 32 64 C31 60 38 53 50 50 Z" fill="#2e7d8c" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="50" cy="50" r="5" fill="${TINTA}"/>
      </g>`;
  } else if (p.tipo === "interruptor") {
    const palanca = p.cerrado ? "M50 70 L50 30" : "M50 70 L72 38";
    dibujo = `<g transform="rotate(${p.rot * 90} 50 50)">
      <path d="M50 0 L50 30 M50 70 L50 100" stroke="${TINTA}" stroke-width="20" stroke-linecap="round" fill="none"/>
      <path d="M50 0 L50 30 M50 70 L50 100" stroke="${color}" stroke-width="11" stroke-linecap="round" fill="none"/>
      <path d="${palanca}" stroke="${TINTA}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="50" cy="30" r="7" fill="#fffdf8" stroke="${TINTA}" stroke-width="4"/>
      <circle cx="50" cy="70" r="7" fill="#fffdf8" stroke="${TINTA}" stroke-width="4"/>
    </g>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${dibujo}</svg>`;
}

function nivelActualCircuito() {
  return NIVELES_CIRCUITO[nivelCircuito];
}

function abrirNivelCircuito(i) {
  nivelCircuito = i;
  const nivel = nivelActualCircuito();
  piezas = nivel.piezas.map((p) => ({ ...p }));
  toques = 0;
  cortosCausados = 0;
  resuelto = false;
  mostrarPantalla("circuito");
  document.getElementById("titulo-circuito").textContent = `Nivel ${i + 1}: ${nivel.titulo}`;
  document.getElementById("texto-circuito").innerHTML = nivel.texto;
  pantallas.circuito.querySelector("[data-record]").hidden = true;
  botonSiguienteCircuito.hidden = true;
  mensaje(mensajeCircuitoEl, "");
  // Un cortocircuito que ya venía en el nivel no cuenta como error.
  habiaCorto = R.evaluarCircuito(nivel, piezas).corto;
  evaluarYPintar();
}

function pintarPlaca(res) {
  const nivel = nivelActualCircuito();
  placaEl.style.gridTemplateColumns = `repeat(${nivel.cols}, 1fr)`;
  placaEl.style.maxWidth = `${nivel.cols * 112}px`;
  placaEl.innerHTML = "";
  const porCelda = new Map(piezas.map((p) => [p.f * nivel.cols + p.c, p]));
  for (let f = 0; f < nivel.filas; f++) {
    for (let c = 0; c < nivel.cols; c++) {
      const p = porCelda.get(f * nivel.cols + c);
      const celda = document.createElement("button");
      celda.className = "celda-circuito";
      if (!p) {
        celda.classList.add("vacia");
        celda.disabled = true;
      } else {
        const tocable = (R.CABLES.includes(p.tipo) && !p.fija) || p.tipo === "interruptor";
        celda.classList.toggle("tocable", tocable);
        celda.disabled = !tocable || resuelto;
        if (res.encendidos.has(p.id)) celda.classList.add("prendida");
        celda.innerHTML = piezaSVG(p, res);
        celda.setAttribute("aria-label", p.tipo === "interruptor" ? (p.cerrado ? "Interruptor cerrado" : "Interruptor abierto") : p.tipo);
        celda.addEventListener("click", () => tocarPieza(p));
      }
      placaEl.appendChild(celda);
    }
  }
}

function tocarPieza(p) {
  if (resuelto) return;
  if (R.CABLES.includes(p.tipo) && !p.fija) p.rot = (p.rot + 1) % 4;
  else if (p.tipo === "interruptor") p.cerrado = !p.cerrado;
  else return;
  toques++;
  Aprende.sonido.clic();
  evaluarYPintar();
}

function evaluarYPintar() {
  const nivel = nivelActualCircuito();
  const res = R.evaluarCircuito(nivel, piezas);
  const minimo = R.toquesMinimos(nivel);
  retoCircuitoEl.textContent = `Toques: ${toques} · 🏆 Reto: resuélvelo en ${minimo}`;

  if (res.corto) {
    if (!habiaCorto) {
      cortosCausados++;
      Aprende.sonido.error();
    }
    mensaje(mensajeCircuitoEl, "⚡ ¡Cortocircuito! La electricidad va de + a − solo por cables, sin pasar por nada. ¡Corta ese camino!", "error");
  } else if (habiaCorto) {
    mensaje(mensajeCircuitoEl, "");
  }
  habiaCorto = res.corto;

  const listo = !res.corto && nivel.objetivo.every((id) => res.encendidos.has(id));
  if (listo && !resuelto) {
    resuelto = true;
    let estrellas = 1;
    if (toques <= minimo + 2) estrellas = 3;
    else if (toques <= minimo + 6) estrellas = 2;
    if (cortosCausados > 0) estrellas = Math.min(estrellas, 2);
    let texto = `¡Circuito cerrado! 🎉 ${Aprende.textoEstrellas(estrellas)} Lo hiciste en ${toques} ${toques === 1 ? "toque" : "toques"}.`;
    if (cortosCausados > 0) texto += " (Cuidado con los cortocircuitos.)";
    mensaje(mensajeCircuitoEl, texto, "exito");
    celebrar(`circuito-${nivelCircuito + 1}`, estrellas, pantallas.circuito);
    botonSiguienteCircuito.hidden = nivelCircuito === NIVELES_CIRCUITO.length - 1;
  }
  pintarPlaca(res);
}

document.getElementById("btn-reiniciar-circuito").addEventListener("click", () => abrirNivelCircuito(nivelCircuito));
botonSiguienteCircuito.addEventListener("click", () => abrirNivelCircuito(nivelCircuito + 1));

pintarMapa();
mostrarPantalla("mapa");
