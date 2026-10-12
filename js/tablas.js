// Tablas de multiplicar — Aprende con Ana Isabella
// Un repaso que se adapta: cada multiplicación (de la del 2 a la del 10) vive
// en una "caja" del 0 al 4. Si la contesta bien y rápido sube de caja; si se
// equivoca, vuelve a la 0 y aparece otra vez en la misma partida. El repaso
// inteligente pregunta más las de cajas bajas (las que cuestan). También se
// puede practicar una tabla sola y ver el mapa de colores de lo que domina.
// Lo aprendido se guarda en el navegador ("aprende:tablas"); las estrellas
// van al progreso "tablas" (tabla-2 … tabla-10 y repaso).

const CLAVE = "aprende:tablas";
const TABLAS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const POR_PARTIDA = 12;
const RAPIDO_MS = 6000; // contestar en menos de esto cuenta como "rápido"
const DOMINADA = 3; // desde esta caja una multiplicación está dominada

// Trucos de cada tabla (y algunos especiales).
const TRUCOS = {
  2: "La tabla del 2 es el <strong>doble</strong>: 2 × 7 = 7 + 7 = 14.",
  3: "En la del 3 los resultados van de 3 en 3: 3, 6, 9, 12, 15…",
  4: "La del 4 es el <strong>doble del doble</strong>: 4 × 6 → el doble de 6 es 12, y el doble de 12 es 24.",
  5: "En la del 5 los resultados siempre terminan en <strong>0 o 5</strong>.",
  6: "6 × un número par termina en ese mismo número: 6 × 4 = 2<strong>4</strong>, 6 × 8 = 4<strong>8</strong>.",
  7: "Para la del 7: 7 × 8 = 56 (¡5, 6, 7, 8 en orden!).",
  8: "La del 8 es el doble de la del 4: 8 × 6 = el doble de 24 = 48.",
  9: "En la del 9, las cifras del resultado suman 9: 9 × 7 = 63 (6 + 3 = 9). Y la primera cifra es una menos: 9 × <strong>7</strong> = <strong>6</strong>3.",
  10: "En la del 10, ¡solo agrega un cero! 10 × 7 = 70.",
};
const ESPECIALES = {
  "7x8": "5, 6, 7, 8: <strong>56 = 7 × 8</strong>.",
  "6x7": "6 × 7 = 42: «seis por siete, cuarenta y dos», ¡casi rima!",
  "8x8": "8 × 8 = 64: «ocho por ocho, sesenta y cuatro, ¡como las casillas del ajedrez!» ♟️",
  "7x7": "7 × 7 = 49: un cuadrado perfecto.",
  "6x6": "6 × 6 = 36: un cuadrado perfecto.",
};

const truco = (a, b) => {
  const clave = `${Math.min(a, b)}x${Math.max(a, b)}`;
  if (ESPECIALES[clave]) return ESPECIALES[clave];
  if (a === 1 || b === 1) return "Cualquier número por 1 da el mismo número.";
  // El truco de la tabla más fácil de las dos (para 7 × 4, el de la del 4).
  const tabla = [10, 2, 5, 9, 4, 3, 6, 8, 7].find((t) => a === t || b === t);
  return `${TRUCOS[tabla] || ""} Y recuerda: ${a} × ${b} es lo mismo que ${b} × ${a}.`;
};

// ---- Lo que sabe (guardado) ----

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || {};
  } catch {
    return {};
  }
}

function guardar(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // Sin almacenamiento: el repaso funciona, pero no recuerda entre visitas.
  }
}

// Clave de una multiplicación: el orden no importa (3×7 = 7×3).
const claveDe = (a, b) => `${Math.min(a, b)}x${Math.max(a, b)}`;

// Todas las multiplicaciones distintas de las tablas del 2 al 10 (× 1 a 10).
const TODAS = (() => {
  const lista = [];
  for (const a of TABLAS) for (let b = 1; b <= 10; b++) if (!lista.some(([x, y]) => claveDe(x, y) === claveDe(a, b))) lista.push([a, b]);
  return lista;
})();

function cajaDe(datos, a, b) {
  return (datos[claveDe(a, b)] || {}).caja ?? -1; // -1 = nunca vista
}

// ---- Estado de la partida ----

let modo = "repaso"; // "repaso" o un número de tabla
let ronda = [];
let indice = 0;
let aciertos = 0;
let rapidas = 0;
let racha = 0;
let escrito = "";
let inicioPregunta = 0;
let bloqueado = false;
let sesion = 0;
let falladas = new Set();

const pantallas = {
  inicio: document.getElementById("pantalla-inicio"),
  juego: document.getElementById("pantalla-juego"),
  fin: document.getElementById("pantalla-fin"),
};
const operacionEl = document.getElementById("operacion");
const respuestaEl = document.getElementById("respuesta");
const mensajeEl = document.getElementById("mensaje-juego");
const trucoEl = document.getElementById("truco");
const tecladoEl = document.getElementById("teclado");

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

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

// ---- Pantalla de inicio ----

function pintarInicio() {
  const datos = leer();
  const dominadas = TODAS.filter(([a, b]) => cajaDe(datos, a, b) >= DOMINADA).length;
  document.getElementById("saludo-tablas").innerHTML = dominadas
    ? `¡Ya dominas <strong>${dominadas} de ${TODAS.length}</strong> multiplicaciones! El <strong>repaso inteligente</strong> te pregunta más las que te cuestan.`
    : "¡Vamos a aprender las tablas! Empieza con el <strong>repaso inteligente</strong> o elige una tabla. Yo me acuerdo de cuáles te cuestan. 🧠";

  const lista = document.getElementById("lista-tablas");
  lista.innerHTML = "";
  const progreso = Aprende.progreso().tablas || {};
  TABLAS.forEach((t) => {
    const b = document.createElement("button");
    b.className = "boton-tabla";
    const estrellas = progreso[`tabla-${t}`] || 0;
    b.innerHTML = `<strong>× ${t}</strong><span>${estrellas ? Aprende.textoEstrellas(estrellas) : "&nbsp;"}</span>`;
    b.addEventListener("click", () => empezar(t));
    lista.appendChild(b);
  });

  // Mapa 10 × 9: filas = tablas, columnas = × 1 a 10.
  const mapa = document.getElementById("mapa-tablas");
  mapa.innerHTML = '<span class="celda-mapa encabezado">×</span>' + Array.from({ length: 10 }, (_, i) => `<span class="celda-mapa encabezado">${i + 1}</span>`).join("");
  TABLAS.forEach((a) => {
    mapa.insertAdjacentHTML("beforeend", `<span class="celda-mapa encabezado">${a}</span>`);
    for (let b = 1; b <= 10; b++) {
      const caja = cajaDe(datos, a, b);
      const estado = caja < 0 ? "nueva" : caja >= DOMINADA ? "dominada" : caja >= 1 ? "casi" : "cuesta";
      const celda = document.createElement("button");
      celda.className = `celda-mapa ${estado}`;
      celda.textContent = a * b;
      celda.setAttribute("aria-label", `${a} por ${b}`);
      celda.addEventListener("click", () => {
        document.getElementById("truco-mapa").innerHTML = `<strong>${a} × ${b} = ${a * b}</strong> · ${truco(a, b)}`;
        Aprende.sonido.clic();
      });
      mapa.appendChild(celda);
    }
  });
  document.getElementById("truco-mapa").innerHTML = "";
}

// ---- Armar la partida ----

// Repaso: cuanto más baja la caja, más probable que salga. Las nunca vistas
// entran de a poco, empezando por las tablas fáciles.
function rondaRepaso() {
  const datos = leer();
  const peso = ([a, b]) => {
    const caja = cajaDe(datos, a, b);
    if (caja < 0) return 3 / Math.max(a, b);
    const fallos = (datos[claveDe(a, b)] || {}).fallos || 0;
    return (5 - caja) ** 2 + Math.min(fallos, 4);
  };
  const disponibles = [...TODAS];
  const elegidas = [];
  while (elegidas.length < POR_PARTIDA && disponibles.length) {
    const total = disponibles.reduce((s, x) => s + peso(x), 0);
    let r = Math.random() * total;
    const i = disponibles.findIndex((x) => (r -= peso(x)) <= 0);
    elegidas.push(disponibles.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return elegidas.map(([a, b]) => (Math.random() < 0.5 ? [a, b] : [b, a]));
}

function rondaTabla(t) {
  return mezclar(Array.from({ length: 10 }, (_, i) => [t, i + 1])).map(([a, b]) => (Math.random() < 0.3 ? [b, a] : [a, b]));
}

function empezar(m) {
  modo = m;
  ronda = m === "repaso" ? rondaRepaso() : rondaTabla(m);
  indice = 0;
  aciertos = 0;
  rapidas = 0;
  racha = 0;
  falladas = new Set();
  document.getElementById("titulo-ronda").textContent = m === "repaso" ? "✨ Repaso" : `Tabla del ${m}`;
  mostrarPantalla("juego");
  mostrarPregunta();
}

function mostrarPregunta() {
  const [a, b] = ronda[indice];
  escrito = "";
  bloqueado = false;
  operacionEl.textContent = `${a} × ${b}`;
  respuestaEl.textContent = "?";
  respuestaEl.className = "respuesta";
  trucoEl.hidden = true;
  mensaje("");
  document.getElementById("contador").textContent = `${indice + 1}/${ronda.length}`;
  document.getElementById("barra-progreso").style.width = `${(indice / ronda.length) * 100}%`;
  activarTeclado(true);
  inicioPregunta = performance.now();
}

function activarTeclado(activo) {
  tecladoEl.querySelectorAll("button").forEach((b) => (b.disabled = !activo));
}

function teclear(valor) {
  if (bloqueado) return;
  if (valor === "borrar") escrito = escrito.slice(0, -1);
  else if (valor === "comprobar") return comprobar();
  else if (escrito.length < 3) escrito += valor;
  respuestaEl.textContent = escrito || "?";
  Aprende.sonido.clic();
}

function comprobar() {
  if (!escrito || bloqueado) return;
  bloqueado = true;
  activarTeclado(false);
  const [a, b] = ronda[indice];
  const bien = Number(escrito) === a * b;
  const ms = performance.now() - inicioPregunta;
  const datos = leer();
  const clave = claveDe(a, b);
  const dato = datos[clave] || { caja: 0, vistas: 0, fallos: 0 };
  dato.vistas++;
  if (bien) {
    // Rápido sube una caja; lento solo sube si estaba en las primeras.
    if (ms < RAPIDO_MS) dato.caja = Math.min(4, dato.caja + 1);
    else if (dato.caja < 2) dato.caja++;
  } else {
    dato.caja = 0;
    dato.fallos++;
  }
  datos[clave] = dato;
  guardar(datos);

  const s = sesion;
  if (bien) {
    // En la partida solo cuenta como acierto si no la había fallado antes.
    if (!falladas.has(clave)) aciertos++;
    if (ms < RAPIDO_MS) rapidas++;
    racha++;
    respuestaEl.classList.add("correcta");
    mensaje(ms < RAPIDO_MS ? `¡Correcto! ⚡ ${a} × ${b} = ${a * b}` : `¡Correcto! ${a} × ${b} = ${a * b}. ¡La próxima, más rápido!`, "exito");
    Aprende.sonido.acierto();
    if (racha % 5 === 0) Aprende.confeti(30);
    setTimeout(() => s === sesion && avanzar(), 1000);
  } else {
    racha = 0;
    respuestaEl.classList.add("incorrecta");
    respuestaEl.textContent = `${a * b}`;
    mensaje(`Era ${a * b}. ¡Te la vuelvo a preguntar en un ratito!`, "error");
    trucoEl.innerHTML = `💡 ${truco(a, b)}`;
    trucoEl.hidden = false;
    Aprende.sonido.error();
    Aprende.efecto.sacudir(respuestaEl);
    // La que falló vuelve 3 preguntas después (una sola vez).
    if (!falladas.has(clave)) {
      falladas.add(clave);
      ronda.splice(Math.min(ronda.length, indice + 4), 0, [b, a]);
    }
    const sigue = document.createElement("button");
    sigue.className = "boton siguiente";
    sigue.textContent = "Entendido →";
    sigue.addEventListener("click", () => {
      sigue.remove();
      avanzar();
    });
    trucoEl.appendChild(document.createElement("br"));
    trucoEl.appendChild(sigue);
  }
  const rachaEl = document.getElementById("racha");
  rachaEl.hidden = racha < 2;
  rachaEl.textContent = `🔥 ${racha}`;
}

function avanzar() {
  indice++;
  if (indice < ronda.length) mostrarPregunta();
  else terminar();
}

function terminar() {
  const preguntas = new Set(ronda.map(([a, b]) => claveDe(a, b))).size;
  const estrellas = Aprende.estrellasPorAciertos(aciertos, preguntas);
  mostrarPantalla("fin");
  const textos = ["¡Sigue practicando! Cada vez te acuerdas de más.", "¡Bien hecho!", "¡Muy bien! Ya casi las dominas.", "¡Increíble! Eres una calculadora humana. 🧠"];
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = textos[estrellas];
  document.getElementById("fin-puntaje").textContent = `Acertaste ${aciertos} de ${preguntas} al primer intento`;
  document.getElementById("fin-detalle").textContent = `⚡ ${rapidas} ${rapidas === 1 ? "respuesta rápida" : "respuestas rápidas"} (en menos de 6 segundos)`;
  Aprende.finDePartida("tablas", modo === "repaso" ? "repaso" : `tabla-${modo}`, estrellas);
}

// ---- Teclado ----

["1", "2", "3", "4", "5", "6", "7", "8", "9", "borrar", "0", "comprobar"].forEach((valor) => {
  const b = document.createElement("button");
  b.className = "tecla";
  if (valor === "borrar") {
    b.classList.add("tecla-borrar");
    b.textContent = "⌫";
    b.setAttribute("aria-label", "Borrar");
  } else if (valor === "comprobar") {
    b.classList.add("tecla-comprobar");
    b.textContent = "✓";
    b.setAttribute("aria-label", "Comprobar");
  } else b.textContent = valor;
  b.addEventListener("click", () => teclear(valor));
  tecladoEl.appendChild(b);
});

document.addEventListener("keydown", (e) => {
  if (pantallas.juego.hidden) return;
  if (/^[0-9]$/.test(e.key)) teclear(e.key);
  else if (e.key === "Backspace") {
    e.preventDefault();
    teclear("borrar");
  } else if (e.key === "Enter") {
    e.preventDefault();
    teclear("comprobar");
  }
});

document.getElementById("btn-repaso").addEventListener("click", () => empezar("repaso"));
document.getElementById("btn-repetir").addEventListener("click", () => empezar(modo));
document.querySelectorAll("[data-accion='inicio']").forEach((b) =>
  b.addEventListener("click", () => {
    pintarInicio();
    mostrarPantalla("inicio");
  })
);

pintarInicio();
mostrarPantalla("inicio");
