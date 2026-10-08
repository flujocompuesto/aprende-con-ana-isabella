// Aprende ajedrez — Aprende con Ana Isabella
// Camino de 10 capítulos con el Profe Búho: para qué sirve el juego, cómo se
// mueve cada pieza, jaque y jaque mate, cómo empezar la partida, y una
// partida contra la compu. Las reglas vienen de js/ajedrez-motor.js.

const A = Ajedrez;
const GLIFO = { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" };
// Fuerza la versión "texto" del símbolo (sin esto el peón sale como emoji de color).
const glifo = (tipo) => GLIFO[tipo] + "︎";

const INFO_PIEZAS = {
  K: { nombre: "Rey", articulo: "el rey", cuantas: 1, valor: "¡No tiene precio! Si lo atrapan, se acaba el juego.", mueve: "1 casilla en cualquier dirección." },
  Q: { nombre: "Dama (o reina)", articulo: "la dama", cuantas: 1, valor: "9 puntos", mueve: "Las casillas que quiera, en línea recta o en diagonal. ¡Es la más poderosa!" },
  R: { nombre: "Torre", articulo: "la torre", cuantas: 2, valor: "5 puntos", mueve: "En línea recta: adelante, atrás y a los lados." },
  B: { nombre: "Alfil", articulo: "el alfil", cuantas: 2, valor: "3 puntos", mueve: "En diagonal. Siempre se queda en casillas de su mismo color." },
  N: { nombre: "Caballo", articulo: "el caballo", cuantas: 2, valor: "3 puntos", mueve: "En forma de L, y puede saltar sobre otras piezas." },
  P: { nombre: "Peón", articulo: "el peón", cuantas: 8, valor: "1 punto", mueve: "Hacia adelante (la primera vez puede avanzar 2). Come en diagonal." },
};

// ---- Contenido del camino ----
// Tipos de paso: explica, conoce, explora, estrellas, pregunta, escapa, mate,
// jugada, guion y partida. Las posiciones se dan con "fen" o con "piezas".

const CAPITULOS = [
  {
    id: "meta", emoji: "🏰", titulo: "¿De qué se trata?",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, texto: "¡Hola! Soy el <strong>Profe Búho</strong> y te voy a enseñar ajedrez. Es un juego para <strong>2 jugadores</strong>: uno usa las piezas <strong>blancas</strong> y el otro las <strong>negras</strong>. Cada uno tiene <strong>16 piezas</strong>." },
      { tipo: "explica", fen: A.INICIAL, marcas: ["e1", "e8"], texto: "La <strong>meta</strong> es atrapar al <strong>rey</strong> del otro equipo para que no pueda escapar. ¡Eso se llama <strong>JAQUE MATE</strong>! No gana quien come más piezas: gana quien atrapa al rey." },
      { tipo: "conoce", fen: A.INICIAL, texto: "Conoce a tu ejército: <strong>toca cada tipo de pieza</strong> para saber cómo se llama, cómo se mueve y cuánto vale." },
      { tipo: "explica", fen: A.INICIAL, marcas: ["h1", "d1"], texto: "Así se arma el tablero: tiene <strong>64 casillas</strong>. La esquina de abajo a la derecha siempre es clara: <strong>¡blanca a la derecha!</strong> Y la dama va en una casilla de <strong>su mismo color</strong>." },
      { tipo: "pregunta", texto: "¿Quién mueve primero?", opciones: [
        { t: "Las blancas ⚪", ok: true, explica: "¡Sí! Las blancas siempre empiezan." },
        { t: "Las negras ⚫" },
        { t: "Quien quiera" },
      ] },
      { tipo: "pregunta", texto: "¿Cómo se gana una partida de ajedrez?", opciones: [
        { t: "Comiendo todas las piezas" },
        { t: "Dando jaque mate al rey", ok: true, explica: "¡Exacto! Atrapar al rey es la meta." },
        { t: "Llegando al otro lado del tablero" },
      ] },
    ],
  },
  {
    id: "torre", emoji: "♜", titulo: "La torre",
    pasos: [
      { tipo: "explora", piezas: { d4: "R" }, texto: "La <strong>torre</strong> se mueve en <strong>línea recta</strong>: adelante, atrás y a los lados, todas las casillas que quiera. <strong>Tócala</strong> para ver a dónde puede ir, y luego muévela." },
      { tipo: "estrellas", piezas: { a1: "R" }, estrellas: ["a5", "e5", "e8"], texto: "¡Recoge todas las estrellas ⭐ con la torre!" },
      { tipo: "estrellas", piezas: { h1: "R", h6: "p", c6: "p", c2: "p" }, texto: "Las piezas se <strong>comen</strong> cayendo en su casilla. ¡Come todos los peones negros con la torre!" },
    ],
  },
  {
    id: "alfil", emoji: "♝", titulo: "El alfil",
    pasos: [
      { tipo: "explora", piezas: { d4: "B" }, texto: "El <strong>alfil</strong> se mueve en <strong>diagonal</strong>, las casillas que quiera. ¿Notas algo? <strong>Siempre se queda en casillas del mismo color.</strong>" },
      { tipo: "estrellas", piezas: { c1: "B" }, estrellas: ["g5", "d8", "a5"], texto: "Recoge las estrellas con el alfil." },
      { tipo: "estrellas", piezas: { f1: "B", b5: "p", e8: "p" }, texto: "¡Ahora come los peones negros con el alfil!" },
    ],
  },
  {
    id: "dama", emoji: "♛", titulo: "La dama",
    pasos: [
      { tipo: "explora", piezas: { d4: "Q" }, texto: "La <strong>dama</strong> (o reina) es la pieza más poderosa: se mueve <strong>como la torre y como el alfil juntos</strong>. ¡Pruébala!" },
      { tipo: "estrellas", piezas: { d1: "Q" }, estrellas: ["d7", "a4", "h4"], texto: "Recoge las estrellas con la dama." },
      { tipo: "estrellas", piezas: { a1: "Q", a8: "r", h8: "r", h1: "r" }, texto: "¡Come las tres torres negras de las esquinas!" },
    ],
  },
  {
    id: "rey", emoji: "♚", titulo: "El rey",
    pasos: [
      { tipo: "explora", piezas: { d4: "K" }, texto: "El <strong>rey</strong> es la pieza más importante, pero es lento: se mueve <strong>1 casilla</strong> en cualquier dirección. ¡Hay que cuidarlo mucho!" },
      { tipo: "estrellas", piezas: { e1: "K" }, estrellas: ["e3", "g3", "g1"], texto: "Lleva al rey a recoger las estrellas, pasito a pasito." },
      { tipo: "explora", piezas: { d4: "K", e8: "r" }, texto: "Regla especial: el rey <strong>nunca</strong> puede ir a una casilla donde lo puedan comer. La torre negra vigila toda la columna <strong>e</strong>. Toca el rey y mira: ¡no lo deja pasar!" },
    ],
  },
  {
    id: "caballo", emoji: "♞", titulo: "El caballo",
    pasos: [
      { tipo: "explora", piezas: { d4: "N", c3: "P", d3: "P", e3: "P", c4: "P", e4: "P", c5: "P", d5: "P", e5: "P" }, texto: "El <strong>caballo</strong> salta en forma de <strong>L</strong>: 2 casillas en una dirección y 1 de lado. ¡Es la única pieza que puede <strong>saltar</strong> sobre otras! Tócalo." },
      { tipo: "estrellas", piezas: { b1: "N" }, estrellas: ["c3", "d5", "f6"], texto: "Salta con el caballo y recoge las estrellas." },
      { tipo: "estrellas", piezas: { c1: "N", d3: "p", e5: "p", g6: "p" }, texto: "¡Come los peones saltando en L!" },
    ],
  },
  {
    id: "peon", emoji: "♟", titulo: "El peón",
    pasos: [
      { tipo: "explora", piezas: { e2: "P", c5: "P" }, texto: "El <strong>peón</strong> camina <strong>hacia adelante</strong>, de a una casilla. En su <strong>primera jugada</strong> puede avanzar <strong>dos</strong>. ¡Nunca camina hacia atrás!" },
      { tipo: "estrellas", piezas: { d2: "P", e3: "p", d4: "p", c5: "p" }, texto: "El peón es especial: camina derecho, pero <strong>come en diagonal</strong>. ¡Come los tres peones negros!" },
      { tipo: "estrellas", piezas: { e2: "P" }, estrellas: ["e8"], texto: "Si un peón llega al otro lado del tablero, <strong>¡corona!</strong> Se convierte en dama. Llévalo hasta la estrella." },
    ],
  },
  {
    id: "jaque", emoji: "👑", titulo: "Jaque y jaque mate",
    pasos: [
      { tipo: "explica", piezas: { e8: "k", e1: "R", g1: "K" }, texto: "Cuando una pieza ataca al rey se dice <strong>¡JAQUE!</strong> Aquí la torre blanca le da jaque al rey negro (mira cómo se pone rojo). El rey en jaque <strong>tiene que salvarse</strong> en su siguiente jugada." },
      { tipo: "pregunta", piezas: { e1: "K", a5: "b", e8: "k" }, ocultarJaque: true, texto: "¿El rey blanco está en jaque?", opciones: [
        { t: "Sí", ok: true, explica: "¡Sí! El alfil negro lo ataca por la diagonal." },
        { t: "No" },
      ] },
      { tipo: "pregunta", piezas: { e1: "K", c3: "n", e8: "k" }, ocultarJaque: true, texto: "¿Y ahora? ¿El rey blanco está en jaque?", opciones: [
        { t: "Sí" },
        { t: "No", ok: true, explica: "¡Bien! El caballo salta en L y no llega al rey." },
      ] },
      { tipo: "escapa", piezas: { e1: "K", a3: "R", e4: "r", e8: "k" }, texto: "¡Tu rey está en jaque! Hay 3 formas de salvarlo: <strong>moverlo</strong>, <strong>tapar</strong> el ataque con otra pieza, o <strong>comer</strong> a la pieza que ataca. ¡Sálvalo!" },
      { tipo: "explica", piezas: { h8: "k", g7: "Q", f6: "K" }, texto: "Si el rey está en jaque y <strong>no tiene ninguna forma de salvarse</strong>, es <strong>JAQUE MATE</strong> y el juego termina. Aquí la dama blanca, protegida por su rey, atrapa al rey negro." },
      { tipo: "mate", fen: "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1", texto: "¡Tu turno! Da <strong>jaque mate en 1 jugada</strong> con la torre." },
      { tipo: "mate", fen: "7k/8/6K1/8/8/8/8/4Q3 w - - 0 1", texto: "Da jaque mate con la dama. Tu rey le cierra las salidas." },
      { tipo: "mate", fen: "6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1", texto: "¡Mate del caballo! El rey negro está rodeado por sus propias piezas…" },
    ],
  },
  {
    id: "apertura", emoji: "🚀", titulo: "Cómo empezar la partida",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, marcas: ["d4", "e4", "d5", "e5"], texto: "Para empezar bien, sigue las <strong>4 reglas de oro</strong>:<ol><li>🎯 Controla el <strong>centro</strong> (las casillas marcadas) con un peón.</li><li>🐴 Saca tus <strong>caballos y alfiles</strong>.</li><li>🏰 <strong>Enroca</strong> para proteger a tu rey.</li><li>✋ No saques la <strong>dama</strong> muy pronto.</li></ol>" },
      { tipo: "jugada", fen: A.INICIAL, texto: "Haz tu <strong>primera jugada</strong>: mueve un peón del centro o saca un caballo.",
        buenas: {
          e2e4: "¡Excelente! El peón del rey controla el centro.",
          d2d4: "¡Muy bien! El peón de la dama controla el centro.",
          g1f3: "¡Bien! El caballo sale mirando al centro.",
          b1c3: "¡Bien! El caballo sale mirando al centro.",
        },
        consejo: "Esa jugada no ayuda mucho a controlar el centro. Prueba con el peón de <strong>e2</strong> o de <strong>d2</strong>, o con un caballo." },
      { tipo: "guion", fen: A.INICIAL, texto: "Ahora juega conmigo una apertura famosa: la <strong>Italiana</strong>. Yo te digo qué mover y las negras responden solas.",
        jugadas: [
          { blanca: "e2e4", texto: "1️⃣ Mueve el peón de <strong>e2</strong> dos casillas, a <strong>e4</strong>: ¡controla el centro!", negra: "e7e5", textoNegra: "Las negras hacen lo mismo." },
          { blanca: "g1f3", texto: "2️⃣ Saca el <strong>caballo</strong> de g1 a <strong>f3</strong>: ataca el peón negro de e5.", negra: "b8c6", textoNegra: "Las negras defienden su peón con el caballo." },
          { blanca: "f1c4", texto: "3️⃣ Saca el <strong>alfil</strong> de f1 a <strong>c4</strong>: apunta a f7, el punto débil de las negras.", negra: "f8c5", textoNegra: "Las negras también sacan su alfil." },
          { blanca: "e1g1", texto: "4️⃣ ¡<strong>Enroca</strong>! Toca el rey y llévalo <strong>dos casillas</strong> hacia la torre, a <strong>g1</strong>. La torre salta sola al otro lado. (Solo se puede si el rey y la torre no se han movido.)", negra: "g8f6", textoNegra: "Las negras sacan su otro caballo." },
          { blanca: "d2d3", texto: "5️⃣ Mueve el peón de d2 a <strong>d3</strong>: protege tu peón de e4 y le abre camino a tu otro alfil." },
        ],
        final: "¡Perfecto! 🎉 Controlaste el centro, sacaste tus piezas y tu rey está seguro. ¡Así se empieza una partida!" },
      { tipo: "mate", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", texto: "⚠️ Una trampa famosa: el <strong>Mate del Pastor</strong>. La dama y el alfil atacan juntos la casilla <strong>f7</strong>. ¡Da jaque mate! (Si alguien te la quiere hacer a ti, protege f7.)" },
      { tipo: "pregunta", texto: "¿Cuál de estas <strong>NO</strong> es una buena idea al empezar?", opciones: [
        { t: "Controlar el centro" },
        { t: "Sacar la dama muy pronto", ok: true, explica: "¡Exacto! La dama es muy valiosa y al principio la pueden perseguir." },
        { t: "Sacar caballos y alfiles" },
        { t: "Enrocar" },
      ] },
    ],
  },
  {
    id: "partida", emoji: "🎮", titulo: "¡Juega una partida!",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, texto: "¡Llegó la hora de jugar una partida completa contra la compu! Tú juegas con las <strong>blancas</strong>. Usa las reglas de oro: centro, saca tus piezas y enroca. Si te equivocas puedes <strong>deshacer</strong>, y si no sabes qué jugar pide <strong>ayuda</strong> 💡." },
      { tipo: "partida" },
    ],
  },
];

// ---- Estado ----

let capIndice = 0;
let pasoIndice = 0;
let erroresPaso = [];
let pos = null;
let seleccion = null;
let destinos = [];
let marcas = new Set();
let objetivos = new Set();
let ultimo = null;
let ocultarJaque = false;
let bloqueado = false;
let alMover = null; // qué hacer cuando la niña mueve una pieza
let alTocar = null; // pasos donde tocar una casilla hace otra cosa
// Cambia al salir de un paso; los temporizadores viejos lo comparan y no hacen nada.
let sesion = 0;

const pantallaMapa = document.getElementById("pantalla-mapa");
const pantallaLeccion = document.getElementById("pantalla-leccion");
const pantallaFin = document.getElementById("pantalla-fin");
const capitulosEl = document.getElementById("capitulos");
const tituloEl = document.getElementById("titulo-capitulo");
const puntosPasosEl = document.getElementById("puntos-pasos");
const textoEl = document.getElementById("texto-paso");
const tableroEl = document.getElementById("tablero-ajedrez");
const panelEl = document.getElementById("panel-ajedrez");
const mensajeEl = document.getElementById("mensaje-ajedrez");
const accionesEl = document.getElementById("acciones-paso");

function mostrarPantalla(p) {
  [pantallaMapa, pantallaLeccion, pantallaFin].forEach((x) => (x.hidden = x !== p));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function posicionCon(piezas) {
  const tablero = Array(64).fill(null);
  Object.entries(piezas).forEach(([casilla, p]) => (tablero[A.indiceCasilla(casilla)] = p));
  return { tablero, turno: "w", enroques: { K: false, Q: false, k: false, q: false }, alPaso: null };
}

function posDePaso(paso) {
  if (paso.fen) return A.desdeFEN(paso.fen);
  if (paso.piezas) return posicionCon(paso.piezas);
  return null;
}

const quedanNegras = () => pos.tablero.some((p) => p && A.colorDe(p) === "b");
const claveMovimiento = (m) => A.nombreCasilla(m.desde) + A.nombreCasilla(m.hasta);

function buscarMovimiento(posicion, clave) {
  const desde = A.indiceCasilla(clave.slice(0, 2));
  const hasta = A.indiceCasilla(clave.slice(2, 4));
  return A.legales(posicion, desde).find((m) => m.hasta === hasta && (!m.promocion || A.tipoDe(m.promocion) === "Q"));
}

// ---- Mapa de capítulos ----

function pintarMapa() {
  const guardado = Aprende.progreso().ajedrez || {};
  const sugerido = CAPITULOS.findIndex((c) => !guardado[c.id]);
  capitulosEl.innerHTML = "";
  CAPITULOS.forEach((cap, i) => {
    const boton = document.createElement("button");
    boton.className = "capitulo-card" + (i === sugerido ? " sugerido" : "");
    const estrellas = guardado[cap.id] || 0;
    boton.innerHTML = `
      <span class="numero">${i + 1}</span>
      <span class="emoji">${cap.emoji}</span>
      <span class="titulo">${cap.titulo}</span>
      <span class="estrellas-cap">${estrellas ? Aprende.textoEstrellas(estrellas) : i === sugerido ? "👉 ¡Sigue aquí!" : "&nbsp;"}</span>`;
    boton.addEventListener("click", () => abrirCapitulo(i));
    capitulosEl.appendChild(boton);
  });
}

function abrirCapitulo(i) {
  capIndice = i;
  pasoIndice = 0;
  erroresPaso = [];
  tituloEl.textContent = `${CAPITULOS[i].emoji} ${CAPITULOS[i].titulo}`;
  mostrarPantalla(pantallaLeccion);
  mostrarPaso();
}

// ---- Tablero ----

function pintarTablero() {
  tableroEl.hidden = !pos;
  if (!pos) return;
  const reyesEnJaque = ocultarJaque
    ? []
    : ["w", "b"].filter((c) => A.enJaque(pos, c)).map((c) => pos.tablero.indexOf(c === "w" ? "K" : "k"));
  tableroEl.innerHTML = "";
  for (let i = 0; i < 64; i++) {
    const f = Math.floor(i / 8);
    const c = i % 8;
    const casilla = document.createElement("button");
    casilla.className = "casilla " + ((f + c) % 2 === 0 ? "clara" : "oscura");
    if (ultimo && (i === ultimo.desde || i === ultimo.hasta)) casilla.classList.add("ultima");
    if (marcas.has(i)) casilla.classList.add("marcada");
    if (i === seleccion) casilla.classList.add("seleccionada");
    if (reyesEnJaque.includes(i)) casilla.classList.add("en-jaque");
    const destino = destinos.find((d) => d.hasta === i);
    if (destino) casilla.classList.add(destino.captura ? "destino-captura" : "destino");

    const p = pos.tablero[i];
    let etiqueta = A.nombreCasilla(i);
    if (p) {
      const blanca = A.colorDe(p) === "w";
      casilla.innerHTML = `<span class="pieza ${blanca ? "blanca" : "negra"}">${glifo(A.tipoDe(p))}</span>`;
      etiqueta += ` ${INFO_PIEZAS[A.tipoDe(p)].nombre} de las ${blanca ? "blancas" : "negras"}`;
    } else if (objetivos.has(i)) {
      casilla.innerHTML = '<span class="objetivo">⭐</span>';
      etiqueta += " estrella";
    }
    if (c === 0) casilla.insertAdjacentHTML("beforeend", `<span class="coord fila">${8 - f}</span>`);
    if (f === 7) casilla.insertAdjacentHTML("beforeend", `<span class="coord columna">${"abcdefgh"[c]}</span>`);
    casilla.setAttribute("aria-label", etiqueta);
    casilla.addEventListener("click", () => tocarCasilla(i));
    tableroEl.appendChild(casilla);
  }
}

function tocarCasilla(i) {
  if (bloqueado || !pos) return;
  if (alTocar) {
    alTocar(i);
    return;
  }
  if (!alMover) return;
  if (seleccion !== null) {
    // Si el peón corona, se convierte en dama.
    const m = destinos.find((d) => d.hasta === i && (!d.promocion || A.tipoDe(d.promocion) === "Q"));
    if (m) {
      seleccion = null;
      destinos = [];
      alMover(m);
      return;
    }
  }
  const p = pos.tablero[i];
  if (p && A.colorDe(p) === "w" && i !== seleccion) {
    seleccion = i;
    destinos = A.legales(pos, i);
    Aprende.sonido.clic();
    if (!destinos.length) mensaje("Esa pieza no se puede mover ahora.");
  } else {
    seleccion = null;
    destinos = [];
  }
  pintarTablero();
}

// Aplica un movimiento. En los ejercicios las negras no juegan, así que el turno vuelve a las blancas.
function aplicar(m, mantenerTurno = false) {
  pos = A.mover(pos, m);
  if (mantenerTurno) pos = { ...pos, turno: "w" };
  ultimo = { desde: m.desde, hasta: m.hasta };
  seleccion = null;
  destinos = [];
  Aprende.sonido.paso();
  pintarTablero();
}

// ---- Interfaz de cada paso ----

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

function agregarBoton(texto, clase, accion) {
  const boton = document.createElement("button");
  boton.className = `boton ${clase}`;
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  accionesEl.appendChild(boton);
  return boton;
}

function mostrarSiguiente() {
  if (accionesEl.querySelector(".btn-siguiente-paso")) return;
  const ultimoPaso = pasoIndice === CAPITULOS[capIndice].pasos.length - 1;
  const boton = agregarBoton(ultimoPaso ? "Terminar capítulo 🏁" : "Siguiente ➡️", "ejecutar btn-siguiente-paso", siguientePaso);
  Aprende.efecto.rebote(boton);
}

function contarError() {
  erroresPaso[pasoIndice] = (erroresPaso[pasoIndice] || 0) + 1;
}

function pintarPuntosPasos() {
  const total = CAPITULOS[capIndice].pasos.length;
  puntosPasosEl.innerHTML = Array.from({ length: total }, (_, i) =>
    `<span class="punto-paso${i < pasoIndice ? " hecho" : ""}${i === pasoIndice ? " actual" : ""}"></span>`
  ).join("");
}

function mostrarPaso() {
  const paso = CAPITULOS[capIndice].pasos[pasoIndice];
  sesion++;
  pos = posDePaso(paso);
  seleccion = null;
  destinos = [];
  ultimo = null;
  marcas = new Set((paso.marcas || []).map(A.indiceCasilla));
  objetivos = new Set();
  ocultarJaque = !!paso.ocultarJaque;
  bloqueado = false;
  alMover = null;
  alTocar = null;
  panelEl.innerHTML = "";
  accionesEl.innerHTML = "";
  mensaje("");
  textoEl.innerHTML = paso.texto || "";
  pintarPuntosPasos();
  PASOS[paso.tipo](paso);
  pintarTablero();
}

function siguientePaso() {
  const cap = CAPITULOS[capIndice];
  if (pasoIndice < cap.pasos.length - 1) {
    pasoIndice++;
    mostrarPaso();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const errores = erroresPaso.reduce((s, n) => s + (n || 0), 0);
  let estrellas = 1;
  if (errores === 0) estrellas = 3;
  else if (errores <= 2) estrellas = 2;
  const textos = {
    3: "¡Capítulo completo! Eres una gran estudiante de ajedrez. 🦉",
    2: "¡Muy bien! Capítulo completo.",
    1: "¡Capítulo completo! Practica otra vez para ganar más estrellas.",
  };
  const resumen = errores === 0 ? "¡Sin ningún error!" : `Tuviste ${errores} ${errores === 1 ? "error" : "errores"}.`;
  terminarCapitulo(estrellas, textos[estrellas], resumen);
}

function terminarCapitulo(estrellas, felicitacion, resumen = "") {
  mostrarPantalla(pantallaFin);
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-resumen").textContent = resumen;
  Aprende.finDePartida("ajedrez", CAPITULOS[capIndice].id, estrellas);
  document.getElementById("btn-siguiente-cap").hidden = capIndice === CAPITULOS.length - 1;
  pintarMapa();
}

// Menor cantidad de jugadas para recoger todas las estrellas y comer todo.
function minimoMovimientos(inicio, estrellas) {
  const clave = (p, est) => p.tablero.map((x) => x || ".").join("") + "|" + [...est].sort().join(",");
  const cola = [[inicio, estrellas, 0]];
  const visto = new Set([clave(inicio, estrellas)]);
  while (cola.length) {
    const [p, est, d] = cola.shift();
    if (est.size === 0 && !p.tablero.some((x) => x && A.colorDe(x) === "b")) return d;
    for (const m of A.todosLegales(p, "w")) {
      if (m.promocion && A.tipoDe(m.promocion) !== "Q") continue;
      const nueva = { ...A.mover(p, m), turno: "w" };
      const resto = new Set(est);
      resto.delete(m.hasta);
      const k = clave(nueva, resto);
      if (!visto.has(k)) {
        visto.add(k);
        cola.push([nueva, resto, d + 1]);
      }
    }
  }
  return Infinity;
}

// ---- Tipos de paso ----

const PASOS = {
  explica() {
    mostrarSiguiente();
  },

  conoce() {
    const vistos = new Set();
    const pintarChips = () =>
      Object.keys(INFO_PIEZAS).map((t) => `<span class="chip-pieza${vistos.has(t) ? " visto" : ""}">${glifo(t)}</span>`).join("");
    panelEl.innerHTML = `<div class="chips-piezas" id="chips">${pintarChips()}</div><div id="info-pieza"></div>`;
    alTocar = (i) => {
      const p = pos.tablero[i];
      if (!p) return;
      const tipo = A.tipoDe(p);
      const info = INFO_PIEZAS[tipo];
      vistos.add(tipo);
      // Resaltamos todas las piezas de ese tipo para ver cuántas hay.
      marcas = new Set(pos.tablero.map((x, k) => (x && A.tipoDe(x) === tipo ? k : -1)).filter((k) => k >= 0));
      pintarTablero();
      Aprende.sonido.clic();
      document.getElementById("chips").innerHTML = pintarChips();
      document.getElementById("info-pieza").innerHTML = `
        <div class="info-pieza">
          <span class="glifo-grande">${glifo(tipo)}</span>
          <div><strong>${info.nombre}</strong> — cada jugador tiene ${info.cuantas}.<br>
          🚶 ${info.mueve}<br>💎 Vale: ${info.valor}</div>
        </div>`;
      if (vistos.size === 6) {
        mensaje("¡Ya conoces todas las piezas! 🎉", "exito");
        mostrarSiguiente();
      }
    };
  },

  explora(paso) {
    alMover = (m) => {
      aplicar(m, true);
      if (m.promocion) mensaje("¡Coronaste! 👑 Tu peón ahora es una dama.", "exito");
    };
    agregarBoton("↺ Reiniciar", "quitar", () => {
      pos = posDePaso(paso);
      ultimo = null;
      pintarTablero();
    });
    mostrarSiguiente();
  },

  estrellas(paso) {
    const inicial = posDePaso(paso);
    const estrellasIniciales = new Set((paso.estrellas || []).map(A.indiceCasilla));
    const minimo = minimoMovimientos(inicial, estrellasIniciales);
    let movimientos = 0;
    const indice = pasoIndice;

    const reiniciar = () => {
      pos = posDePaso(paso);
      objetivos = new Set(estrellasIniciales);
      movimientos = 0;
      ultimo = null;
      panelEl.innerHTML = `<p class="contador-ajedrez">Movimientos: <strong id="cuenta-mov">0</strong> · 🏆 Reto: hazlo en ${minimo}</p>`;
      mensaje("");
      alMover = jugar;
      pintarTablero();
    };

    const jugar = (m) => {
      aplicar(m, true);
      movimientos++;
      document.getElementById("cuenta-mov").textContent = movimientos;
      if (objetivos.delete(m.hasta) || m.captura) Aprende.sonido.acierto();
      pintarTablero();
      if (m.promocion) mensaje("¡Coronaste! 👑 Tu peón ahora es una dama.", "exito");
      if (objetivos.size === 0 && !quedanNegras()) {
        alMover = null;
        const extra = movimientos > minimo;
        // Cuenta el mejor intento: reiniciar y mejorar borra el error.
        erroresPaso[indice] = Math.min(erroresPaso[indice] ?? 1, extra ? 1 : 0);
        if (extra) {
          mensaje(`¡Lo lograste en ${movimientos} movimientos! 🎉 El reto era ${minimo}: reinicia si quieres intentarlo.`, "exito");
        } else {
          mensaje(`¡Perfecto! 🏆 Lo hiciste en ${movimientos} movimientos, ¡el mínimo!`, "exito");
          Aprende.confeti(30);
        }
        mostrarSiguiente();
      }
    };

    agregarBoton("↺ Reiniciar", "quitar", reiniciar);
    reiniciar();
  },

  pregunta(paso) {
    panelEl.innerHTML = '<div class="opciones" id="opciones-ajedrez"></div>';
    const contenedor = document.getElementById("opciones-ajedrez");
    paso.opciones.forEach((op) => {
      const boton = document.createElement("button");
      boton.className = "opcion";
      boton.textContent = op.t;
      boton.addEventListener("click", () => {
        if (op.ok) {
          boton.classList.add("correcta");
          contenedor.querySelectorAll("button").forEach((b) => (b.disabled = true));
          mensaje(op.explica || "¡Correcto!", "exito");
          Aprende.sonido.acierto();
          Aprende.efecto.rebote(boton);
          ocultarJaque = false;
          pintarTablero();
          mostrarSiguiente();
        } else {
          boton.classList.add("incorrecta");
          boton.disabled = true;
          contarError();
          mensaje("¡Casi! Piensa un poquito más e intenta otra vez.", "error");
          Aprende.sonido.error();
          Aprende.efecto.sacudir(boton);
        }
      });
      contenedor.appendChild(boton);
    });
  },

  escapa() {
    mensaje("Toca tu rey o una de tus piezas: el tablero solo te deja hacer jugadas que lo salvan.");
    alMover = (m) => {
      aplicar(m);
      alMover = null;
      let forma = "¡Bien pensado! Tapaste el ataque con otra pieza.";
      if (m.captura) forma = "¡Genial! Comiste a la pieza que atacaba.";
      else if (A.tipoDe(m.pieza) === "K") forma = "¡Muy bien! Moviste el rey a una casilla segura.";
      mensaje(`${forma} Tu rey está a salvo. 🛡️`, "exito");
      Aprende.sonido.acierto();
      mostrarSiguiente();
    };
  },

  mate() {
    let fallos = 0;
    alMover = (m) => {
      const nueva = A.mover(pos, m);
      const resultado = A.situacion(nueva, "b");
      if (resultado === "mate") {
        pos = nueva;
        ultimo = { desde: m.desde, hasta: m.hasta };
        marcas = new Set();
        alMover = null;
        pintarTablero();
        mensaje("¡JAQUE MATE! 🎉 El rey negro no tiene escape.", "exito");
        Aprende.sonido.victoria();
        Aprende.confeti(40);
        mostrarSiguiente();
        return;
      }
      // Mostramos la jugada un momento y la devolvemos.
      fallos++;
      contarError();
      const antes = pos;
      pos = nueva;
      ultimo = { desde: m.desde, hasta: m.hasta };
      bloqueado = true;
      pintarTablero();
      Aprende.sonido.error();
      mensaje(
        resultado === "jaque"
          ? "Es jaque, pero el rey todavía puede escapar. ¡Busca otra jugada!"
          : "Eso no es jaque mate. ¡Intenta otra!",
        "error"
      );
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        pos = antes;
        ultimo = null;
        bloqueado = false;
        if (fallos >= 2) darPista();
        pintarTablero();
      }, 1300);
    };
    const darPista = () => {
      const m = A.todosLegales(pos, "w").find((x) => A.situacion(A.mover(pos, x), "b") === "mate");
      if (!m) return;
      marcas = new Set([m.desde]);
      pintarTablero();
      mensaje(`💡 Pista: la jugada ganadora es con ${INFO_PIEZAS[A.tipoDe(m.pieza)].articulo}. ¡Está marcada!`);
    };
    agregarBoton("💡 Pista", "pista", darPista);
  },

  jugada(paso) {
    alMover = (m) => {
      const elogio = paso.buenas[claveMovimiento(m)];
      if (elogio) {
        aplicar(m);
        alMover = null;
        mensaje(elogio, "exito");
        Aprende.sonido.acierto();
        mostrarSiguiente();
      } else {
        contarError();
        mensaje(paso.consejo, "error");
        Aprende.sonido.error();
        Aprende.efecto.sacudir(tableroEl);
        pintarTablero();
      }
    };
  },

  guion(paso) {
    let k = 0;
    const mostrarJugada = () => {
      textoEl.innerHTML = (k === 0 ? paso.texto + "<br><br>" : "") + paso.jugadas[k].texto;
    };
    mostrarJugada();
    alMover = (m) => {
      const jugada = paso.jugadas[k];
      if (claveMovimiento(m) !== jugada.blanca) {
        contarError();
        marcas = new Set([A.indiceCasilla(jugada.blanca.slice(0, 2)), A.indiceCasilla(jugada.blanca.slice(2, 4))]);
        pintarTablero();
        mensaje("Esa jugada también se puede, pero sigamos el plan. Mira las casillas marcadas 👀", "error");
        Aprende.sonido.error();
        return;
      }
      marcas = new Set();
      aplicar(m);
      Aprende.sonido.acierto();
      mensaje("¡Bien! ✅", "exito");
      k++;
      if (jugada.negra) {
        bloqueado = true;
        const s = sesion;
        setTimeout(() => {
          if (s !== sesion) return;
          aplicar(buscarMovimiento(pos, jugada.negra));
          mensaje(`⚫ ${jugada.textoNegra}`);
          bloqueado = false;
          mostrarJugada();
        }, 900);
      } else if (k >= paso.jugadas.length) {
        alMover = null;
        textoEl.innerHTML = paso.final;
        Aprende.confeti(40);
        mostrarSiguiente();
      }
    };
  },

  partida() {
    elegirRival();
  },
};

// ---- Partida contra la compu ----

const VALOR = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
let compuLista = false;
let historial = [];
let capturadas = { w: [], b: [] };
let jugadasHechas = 0;

function atacadaPorPeon(p, i, porColor) {
  const f = Math.floor(i / 8);
  const c = i % 8;
  const fp = porColor === "w" ? f + 1 : f - 1;
  return [-1, 1].some((dc) => {
    const cc = c + dc;
    return fp >= 0 && fp < 8 && cc >= 0 && cc < 8 && p.tablero[fp * 8 + cc] === (porColor === "w" ? "P" : "p");
  });
}

// Lo más valioso que el rival podría ganar comiendo una pieza propia.
function riesgo(p, color) {
  const rival = color === "w" ? "b" : "w";
  let peor = 0;
  p.tablero.forEach((x, i) => {
    if (!x || A.colorDe(x) !== color || A.tipoDe(x) === "K") return;
    if (!A.atacada(p, i, rival)) return;
    const valor = VALOR[A.tipoDe(x)];
    let perdida = valor;
    if (A.atacada(p, i, color)) perdida = atacadaPorPeon(p, i, rival) ? valor - 1 : 0;
    peor = Math.max(peor, perdida);
  });
  return peor;
}

// Jugada de la compu (o sugerencia de ayuda). "lista" juega con más cuidado.
function elegirJugada(p, color, lista) {
  const rival = color === "w" ? "b" : "w";
  const cuidadosa = lista || Math.random() < 0.5;
  let mejor = null;
  let mejorPuntos = -Infinity;
  for (const m of A.todosLegales(p, color)) {
    if (m.promocion && A.tipoDe(m.promocion) !== "Q") continue;
    const nueva = A.mover(p, m);
    const sit = A.situacion(nueva, rival);
    const tipo = A.tipoDe(m.pieza);
    let puntos = 0;
    if (sit === "mate") puntos += 1000;
    if (sit === "ahogado" || sit === "tablas") puntos -= 30;
    if (sit === "jaque") puntos += 2;
    if (m.captura) puntos += VALOR[A.tipoDe(m.captura)] * 10;
    if (m.promocion) puntos += 80;
    if (cuidadosa) puntos -= riesgo(nueva, color) * 9;
    const filaDesde = Math.floor(m.desde / 8);
    if ((tipo === "N" || tipo === "B") && (filaDesde === 0 || filaDesde === 7)) {
      puntos += 3;
      // Mejor si la pieza sale mirando al centro (columnas c-f, filas 3 a 6).
      const fila = Math.floor(m.hasta / 8);
      const columna = m.hasta % 8;
      if (columna >= 2 && columna <= 5 && fila >= 2 && fila <= 5) puntos += 3;
    }
    if (m.enroque) puntos += 6;
    if (tipo === "P" && ["d4", "e4", "d5", "e5"].includes(A.nombreCasilla(m.hasta))) puntos += 3;
    if (tipo === "Q" && jugadasHechas < 10) puntos -= 3;
    if (tipo === "K" && !m.enroque && jugadasHechas < 30) puntos -= 4;
    puntos += Math.random() * (lista ? 3 : 10);
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = m;
    }
  }
  return mejor;
}

function elegirRival() {
  pos = A.desdeFEN(A.INICIAL);
  textoEl.innerHTML = "¿Contra qué compu quieres jugar?";
  panelEl.innerHTML = '<div class="opciones" id="rivales"></div>';
  const rivales = document.getElementById("rivales");
  [
    { t: "🐢 Compu tranquila (para empezar)", lista: false },
    { t: "🦊 Compu lista (más difícil)", lista: true },
  ].forEach((r) => {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = r.t;
    boton.addEventListener("click", () => empezarPartida(r.lista));
    rivales.appendChild(boton);
  });
}

function empezarPartida(lista) {
  sesion++;
  compuLista = lista;
  pos = A.desdeFEN(A.INICIAL);
  historial = [];
  capturadas = { w: [], b: [] };
  jugadasHechas = 0;
  ultimo = null;
  marcas = new Set();
  bloqueado = false;
  textoEl.innerHTML = `Juegas con las <strong>blancas</strong> contra la ${lista ? "🦊 compu lista" : "🐢 compu tranquila"}. ¡Buena suerte!`;
  panelEl.innerHTML = `
    <p id="estado-partida" class="estado-partida"></p>
    <p class="capturadas">Comiste: <span id="comidas-blancas"></span></p>
    <p class="capturadas">Te comieron: <span id="comidas-negras"></span></p>`;
  accionesEl.innerHTML = "";
  agregarBoton("↩️ Deshacer", "quitar", deshacer);
  agregarBoton("💡 Ayuda", "pista", ayuda);
  agregarBoton("🔄 Nueva partida", "borrar", () => {
    sesion++;
    bloqueado = false;
    accionesEl.innerHTML = "";
    mensaje("");
    elegirRival();
    pintarTablero();
  });
  alMover = jugarBlancas;
  mensaje("");
  actualizarEstado();
  pintarTablero();
}

function piezasHTML(lista) {
  return lista.map((p) => `<span class="pieza mini ${A.colorDe(p) === "w" ? "blanca" : "negra"}">${glifo(A.tipoDe(p))}</span>`).join("");
}

function actualizarEstado(texto) {
  const estado = document.getElementById("estado-partida");
  if (!estado) return;
  if (texto) estado.textContent = texto;
  else if (A.enJaque(pos, "w")) estado.textContent = "⚠️ ¡Jaque! Salva a tu rey.";
  else estado.textContent = "Tu turno ⚪ Toca una pieza blanca.";
  document.getElementById("comidas-blancas").innerHTML = piezasHTML(capturadas.w);
  document.getElementById("comidas-negras").innerHTML = piezasHTML(capturadas.b);
}

function jugarBlancas(m) {
  historial.push({ pos, capturadas: { w: [...capturadas.w], b: [...capturadas.b] }, ultimo, jugadasHechas });
  if (m.captura) capturadas.w.push(m.captura);
  marcas = new Set();
  mensaje("");
  aplicar(m);
  jugadasHechas++;
  if (revisarFin()) return;
  bloqueado = true;
  actualizarEstado("La compu está pensando… 🤔");
  const s = sesion;
  setTimeout(() => {
    if (s !== sesion) return;
    const respuesta = elegirJugada(pos, "b", compuLista);
    if (respuesta.captura) capturadas.b.push(respuesta.captura);
    aplicar(respuesta);
    jugadasHechas++;
    bloqueado = false;
    if (!revisarFin()) actualizarEstado();
  }, 650);
}

function revisarFin() {
  const sit = A.situacion(pos, pos.turno);
  if (sit !== "mate" && sit !== "ahogado" && sit !== "tablas") return false;
  alMover = null;
  bloqueado = true;
  let estrellas;
  let texto;
  if (sit === "mate" && pos.turno === "b") {
    estrellas = compuLista ? 3 : 2;
    texto = "¡JAQUE MATE! 🏆 ¡Le ganaste a la compu!";
  } else if (sit === "mate") {
    estrellas = 0;
    texto = "Jaque mate… esta vez ganó la compu. ¡Cada partida te hace mejor, inténtalo otra vez!";
  } else {
    estrellas = 1;
    texto = sit === "ahogado"
      ? "¡Tablas por ahogado! El rey no estaba en jaque, pero no tenía ninguna jugada."
      : "¡Tablas! Solo quedaron los dos reyes.";
  }
  actualizarEstado(texto);
  const s = sesion;
  setTimeout(() => s === sesion && terminarCapitulo(estrellas, texto, compuLista ? "Contra la 🦊 compu lista" : "Contra la 🐢 compu tranquila"), 1800);
  return true;
}

function deshacer() {
  if (bloqueado || !historial.length) return;
  const h = historial.pop();
  pos = h.pos;
  capturadas = h.capturadas;
  ultimo = h.ultimo;
  jugadasHechas = h.jugadasHechas;
  seleccion = null;
  destinos = [];
  marcas = new Set();
  Aprende.sonido.clic();
  mensaje("");
  pintarTablero();
  actualizarEstado();
}

function ayuda() {
  if (bloqueado) return;
  const m = elegirJugada(pos, "w", true);
  if (!m) return;
  marcas = new Set([m.desde, m.hasta]);
  pintarTablero();
  mensaje(`💡 Idea: mueve ${INFO_PIEZAS[A.tipoDe(m.pieza)].articulo} de ${A.nombreCasilla(m.desde)} a ${A.nombreCasilla(m.hasta)}.`);
}

// ---- Eventos ----

document.getElementById("btn-mapa").addEventListener("click", () => {
  sesion++;
  bloqueado = false;
  pintarMapa();
  mostrarPantalla(pantallaMapa);
});
document.getElementById("btn-volver-mapa").addEventListener("click", () => mostrarPantalla(pantallaMapa));
document.getElementById("btn-siguiente-cap").addEventListener("click", () => abrirCapitulo(capIndice + 1));

pintarMapa();
mostrarPantalla(pantallaMapa);
