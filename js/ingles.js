// Inglés divertido — Aprende con Ana Isabella
// Vocabulario en inglés por temas. Cada partida mezcla retos de ver, escuchar,
// traducir y deletrear, contra reloj y con la pronunciación del navegador.

const TOTAL_PREGUNTAS = 10;
const PUNTOS_BASE = 10;
const BONO_RAPIDEZ = 5; // puntos extra máximos por responder rápido

// Orden de los retos en cada partida: de lo más fácil a lo más difícil.
const SECUENCIA = ["ver", "ver", "ver", "escucha", "escucha", "escucha", "traduce", "traduce", "deletrea", "deletrea"];

// Segundos para responder. Deletrear depende del largo de la palabra.
const TIEMPO = { ver: 12, escucha: 14, traduce: 12 };
const tiempoDeletreo = (palabra) => 12 + palabra.length * 3;

const ETIQUETAS = {
  ver: "👀 What is it? · ¿Qué es?",
  escucha: "👂 Listen! · Escucha y elige",
  traduce: "🗣️ ¿Cómo se dice en inglés?",
  deletrea: "✏️ Spell it! · Escríbelo en inglés",
};

const ANIMOS = ["Great! 🎉", "Awesome! ✨", "Super! 🌟", "Well done! 👏", "Excellent! 🎊"];

// Cada palabra se dibuja con un emoji, un color (muestra) o un número (texto).
const TEMAS = {
  animales: {
    nombre: "Animals", es: "Animales", emoji: "🐶", color: "color-verde",
    palabras: [
      { en: "dog", es: "perro", emoji: "🐶" },
      { en: "cat", es: "gato", emoji: "🐱" },
      { en: "bird", es: "pájaro", emoji: "🐦" },
      { en: "fish", es: "pez", emoji: "🐟" },
      { en: "horse", es: "caballo", emoji: "🐴" },
      { en: "cow", es: "vaca", emoji: "🐮" },
      { en: "pig", es: "cerdo", emoji: "🐷" },
      { en: "rabbit", es: "conejo", emoji: "🐰" },
      { en: "lion", es: "león", emoji: "🦁" },
      { en: "elephant", es: "elefante", emoji: "🐘" },
      { en: "monkey", es: "mono", emoji: "🐵" },
      { en: "frog", es: "rana", emoji: "🐸" },
      { en: "duck", es: "pato", emoji: "🦆" },
      { en: "bear", es: "oso", emoji: "🐻" },
    ],
  },
  colores: {
    nombre: "Colors", es: "Colores", emoji: "🎨", color: "color-rosa",
    palabras: [
      { en: "red", es: "rojo", color: "#e74c3c" },
      { en: "blue", es: "azul", color: "#3498db" },
      { en: "green", es: "verde", color: "#2ecc71" },
      { en: "yellow", es: "amarillo", color: "#f1c40f" },
      { en: "orange", es: "naranja", color: "#e67e22" },
      { en: "purple", es: "morado", color: "#9b59b6" },
      { en: "pink", es: "rosado", color: "#fd79a8" },
      { en: "black", es: "negro", color: "#2d3436" },
      { en: "white", es: "blanco", color: "#ffffff" },
      { en: "brown", es: "café", color: "#8d5a3b" },
      { en: "gray", es: "gris", color: "#95a5a6" },
    ],
  },
  numeros: {
    nombre: "Numbers", es: "Números", emoji: "🔢", color: "color-naranja",
    palabras: [
      { en: "one", es: "uno", texto: "1" },
      { en: "two", es: "dos", texto: "2" },
      { en: "three", es: "tres", texto: "3" },
      { en: "four", es: "cuatro", texto: "4" },
      { en: "five", es: "cinco", texto: "5" },
      { en: "six", es: "seis", texto: "6" },
      { en: "seven", es: "siete", texto: "7" },
      { en: "eight", es: "ocho", texto: "8" },
      { en: "nine", es: "nueve", texto: "9" },
      { en: "ten", es: "diez", texto: "10" },
      { en: "eleven", es: "once", texto: "11" },
      { en: "twelve", es: "doce", texto: "12" },
    ],
  },
  comida: {
    nombre: "Food", es: "Comida", emoji: "🍎", color: "color-coral",
    palabras: [
      { en: "apple", es: "manzana", emoji: "🍎" },
      { en: "bread", es: "pan", emoji: "🍞" },
      { en: "milk", es: "leche", emoji: "🥛" },
      { en: "egg", es: "huevo", emoji: "🥚" },
      { en: "cheese", es: "queso", emoji: "🧀" },
      { en: "cake", es: "pastel", emoji: "🍰" },
      { en: "carrot", es: "zanahoria", emoji: "🥕" },
      { en: "grapes", es: "uvas", emoji: "🍇" },
      { en: "strawberry", es: "fresa", emoji: "🍓" },
      { en: "cookie", es: "galleta", emoji: "🍪" },
      { en: "chicken", es: "pollo", emoji: "🍗" },
      { en: "rice", es: "arroz", emoji: "🍚" },
      { en: "water", es: "agua", emoji: "💧" },
      { en: "watermelon", es: "sandía", emoji: "🍉" },
    ],
  },
  cuerpo: {
    nombre: "Body", es: "Cuerpo", emoji: "🖐️", color: "color-azul",
    palabras: [
      { en: "hand", es: "mano", emoji: "✋" },
      { en: "foot", es: "pie", emoji: "🦶" },
      { en: "eye", es: "ojo", emoji: "👁️" },
      { en: "ear", es: "oreja", emoji: "👂" },
      { en: "nose", es: "nariz", emoji: "👃" },
      { en: "mouth", es: "boca", emoji: "👄" },
      { en: "leg", es: "pierna", emoji: "🦵" },
      { en: "arm", es: "brazo", emoji: "💪" },
      { en: "tooth", es: "diente", emoji: "🦷" },
      { en: "tongue", es: "lengua", emoji: "👅" },
      { en: "heart", es: "corazón", emoji: "❤️" },
      { en: "brain", es: "cerebro", emoji: "🧠" },
    ],
  },
  mundo: {
    nombre: "My world", es: "Mi mundo", emoji: "🌍", color: "color-turquesa",
    palabras: [
      { en: "house", es: "casa", emoji: "🏠" },
      { en: "car", es: "carro", emoji: "🚗" },
      { en: "ball", es: "pelota", emoji: "⚽" },
      { en: "book", es: "libro", emoji: "📕" },
      { en: "sun", es: "sol", emoji: "☀️" },
      { en: "moon", es: "luna", emoji: "🌙" },
      { en: "star", es: "estrella", emoji: "⭐" },
      { en: "tree", es: "árbol", emoji: "🌳" },
      { en: "flower", es: "flor", emoji: "🌸" },
      { en: "chair", es: "silla", emoji: "🪑" },
      { en: "bed", es: "cama", emoji: "🛏️" },
      { en: "door", es: "puerta", emoji: "🚪" },
      { en: "clock", es: "reloj", emoji: "⏰" },
      { en: "rain", es: "lluvia", emoji: "🌧️" },
    ],
  },
};

// Estado de la partida.
let temaActual = null;
let ronda = [];
let indice = 0;
let puntos = 0;
let aciertos = 0;
let racha = 0;
let bloqueado = false;
let resultados = []; // { item, ok } para el repaso final
let fichas = []; // deletreo: { letra, usada }
let respuesta = []; // deletreo: índices de fichas elegidas

// Temporizador de cada pregunta.
let temporizador = null;
let finTiempo = 0;
let duracionTiempo = 1;

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFin = document.getElementById("pantalla-fin");

const temasEl = document.getElementById("temas");
const puntosEl = document.getElementById("puntos");
const rachaEl = document.getElementById("racha");
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("barra-progreso");
const rellenoTiempoEl = document.getElementById("tiempo-relleno");
const etiquetaEl = document.getElementById("etiqueta-reto");
const enunciadoEl = document.getElementById("enunciado");
const opcionesEl = document.getElementById("opciones-ingles");
const deletreoEl = document.getElementById("deletreo");
const slotsEl = document.getElementById("slots");
const letrasEl = document.getElementById("letras");
const mensajeEl = document.getElementById("mensaje-juego");

function mostrarPantalla(p) {
  [pantallaInicio, pantallaJuego, pantallaFin].forEach((x) => (x.hidden = x !== p));
}

function mezclar(lista) {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// ---- Voz en inglés (la del navegador) ----

const hayVoz = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let vozIngles = null;

function buscarVoz() {
  const voces = window.speechSynthesis.getVoices();
  return (
    voces.find((v) => v.lang === "en-US" && /samantha|google us|aria|jenny/i.test(v.name)) ||
    voces.find((v) => v.lang === "en-US") ||
    voces.find((v) => v.lang && v.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

if (hayVoz) {
  vozIngles = buscarVoz();
  window.speechSynthesis.onvoiceschanged = () => (vozIngles = buscarVoz());
}

function puedeHablar() {
  return hayVoz && !Aprende.silenciado();
}

function hablar(texto) {
  if (!puedeHablar()) return;
  window.speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(texto);
  frase.lang = "en-US";
  if (vozIngles) frase.voice = vozIngles;
  frase.rate = 0.85;
  window.speechSynthesis.speak(frase);
}

function callar() {
  if (hayVoz) window.speechSynthesis.cancel();
}

// ---- Dibujo de cada palabra ----

function visual(item, clase = "") {
  if (item.color) return `<span class="muestra-color ${clase}" style="background:${item.color}"></span>`;
  if (item.texto) return `<span class="visual-texto ${clase}">${item.texto}</span>`;
  return `<span class="visual-emoji ${clase}">${item.emoji}</span>`;
}

// ---- Selección de tema ----

function pintarTemas() {
  const guardado = Aprende.progreso().ingles || {};
  temasEl.innerHTML = "";
  Object.entries(TEMAS).forEach(([id, tema]) => {
    const boton = document.createElement("button");
    boton.className = `tema ${tema.color}`;
    const estrellas = guardado[id] || 0;
    boton.innerHTML = `
      <span class="emoji">${tema.emoji}</span>
      <span class="en">${tema.nombre}</span>
      <span class="es">${tema.es}</span>
      <span class="estrellas-tema">${estrellas ? Aprende.textoEstrellas(estrellas) : "✨ ¡Nuevo!"}</span>`;
    boton.addEventListener("click", () => empezarPartida(id));
    temasEl.appendChild(boton);
  });
}

// ---- Partida ----

function empezarPartida(tema) {
  temaActual = tema;
  const palabras = TEMAS[tema].palabras;
  ronda = mezclar(palabras)
    .slice(0, TOTAL_PREGUNTAS)
    .map((item, i) => {
      const distractores = mezclar(palabras.filter((p) => p.en !== item.en)).slice(0, 3);
      return { tipo: SECUENCIA[i], item, opciones: mezclar([item, ...distractores]) };
    });
  indice = 0;
  puntos = 0;
  aciertos = 0;
  racha = 0;
  resultados = [];
  mostrarPantalla(pantallaJuego);
  mostrarPregunta();
}

function mostrarPregunta() {
  bloqueado = false;
  const pregunta = ronda[indice];
  // Si no hay voz (o está en silencio), "escuchar" se convierte en "ver".
  const tipo = pregunta.tipo === "escucha" && !puedeHablar() ? "ver" : pregunta.tipo;
  const item = pregunta.item;

  puntosEl.textContent = `Puntos: ${puntos}`;
  contadorEl.textContent = `${indice + 1}/${TOTAL_PREGUNTAS}`;
  barraEl.style.width = `${(indice / TOTAL_PREGUNTAS) * 100}%`;
  actualizarRacha();
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje-juego";
  etiquetaEl.textContent = ETIQUETAS[tipo];
  Aprende.efecto.rebote(etiquetaEl);

  opcionesEl.hidden = tipo === "deletrea";
  deletreoEl.hidden = tipo !== "deletrea";
  opcionesEl.innerHTML = "";

  if (tipo === "ver") {
    enunciadoEl.innerHTML = `<div class="palabra-ingles">${item.en}<button class="boton-oir" aria-label="Escuchar">🔊</button></div>`;
    ponerOpcionesDibujo(pregunta);
    hablar(item.en);
  } else if (tipo === "escucha") {
    enunciadoEl.innerHTML = `<button class="boton-oir grande" aria-label="Escuchar otra vez">🔊</button>
      <p class="pista-suave">Toca el parlante para escuchar otra vez</p>`;
    ponerOpcionesDibujo(pregunta);
    hablar(item.en);
  } else if (tipo === "traduce") {
    enunciadoEl.innerHTML = `${visual(item, "grande")}<div class="palabra-es">${item.es}</div>`;
    pregunta.opciones.forEach((op, i) => {
      const boton = crearOpcion(op, i);
      boton.textContent = op.en;
      opcionesEl.appendChild(boton);
    });
  } else {
    enunciadoEl.innerHTML = `${visual(item, "grande")}
      <div class="palabra-es">${item.es} <button class="boton-oir" aria-label="Escuchar la palabra">🔊</button></div>`;
    prepararDeletreo(item);
  }

  const oir = enunciadoEl.querySelector(".boton-oir");
  if (oir) oir.addEventListener("click", () => hablar(item.en));

  const segundos = tipo === "deletrea" ? tiempoDeletreo(item.en) : TIEMPO[tipo];
  iniciarTemporizador(segundos);
}

function crearOpcion(op, i) {
  const boton = document.createElement("button");
  boton.className = "opcion-ingles";
  boton.dataset.en = op.en;
  boton.setAttribute("aria-label", `Opción ${i + 1}`);
  boton.addEventListener("click", () => responder(op.en === ronda[indice].item.en, boton));
  return boton;
}

function ponerOpcionesDibujo(pregunta) {
  pregunta.opciones.forEach((op, i) => {
    const boton = crearOpcion(op, i);
    boton.innerHTML = visual(op);
    opcionesEl.appendChild(boton);
  });
}

// ---- Deletreo con fichas de letras ----

function prepararDeletreo(item) {
  respuesta = [];
  const letras = item.en.split("");
  // Revolvemos sin que quede igual a la palabra.
  let revueltas;
  do {
    revueltas = mezclar(letras);
  } while (revueltas.join("") === item.en && new Set(letras).size > 1);
  fichas = revueltas.map((letra) => ({ letra, usada: false }));

  slotsEl.className = "slots";
  slotsEl.innerHTML = item.en.split("").map(() => '<span class="slot"></span>').join("");
  letrasEl.innerHTML = "";
  fichas.forEach((ficha, i) => {
    const boton = document.createElement("button");
    boton.className = "letra";
    boton.textContent = ficha.letra;
    boton.addEventListener("click", () => elegirLetra(i));
    letrasEl.appendChild(boton);
  });
}

function pintarDeletreo() {
  slotsEl.querySelectorAll(".slot").forEach((slot, i) => {
    slot.textContent = respuesta[i] === undefined ? "" : fichas[respuesta[i]].letra;
  });
  letrasEl.querySelectorAll(".letra").forEach((b, i) => (b.disabled = fichas[i].usada || bloqueado));
}

function elegirLetra(i) {
  if (bloqueado || fichas[i].usada) return;
  fichas[i].usada = true;
  respuesta.push(i);
  Aprende.sonido.clic();
  pintarDeletreo();
  const palabra = ronda[indice].item.en;
  if (respuesta.length === palabra.length) {
    const formada = respuesta.map((idx) => fichas[idx].letra).join("");
    slotsEl.classList.add(formada === palabra ? "correcta" : "incorrecta");
    responder(formada === palabra, null);
  }
}

function borrarLetra() {
  if (bloqueado || respuesta.length === 0) return;
  fichas[respuesta.pop()].usada = false;
  Aprende.sonido.clic();
  pintarDeletreo();
}

// ---- Temporizador ----

function iniciarTemporizador(segundos) {
  detenerTemporizador();
  duracionTiempo = segundos * 1000;
  finTiempo = performance.now() + duracionTiempo;
  rellenoTiempoEl.classList.remove("apurado");
  rellenoTiempoEl.style.width = "100%";
  temporizador = setInterval(() => {
    const restante = Math.max(0, finTiempo - performance.now());
    const fraccion = restante / duracionTiempo;
    rellenoTiempoEl.style.width = `${fraccion * 100}%`;
    rellenoTiempoEl.classList.toggle("apurado", fraccion < 0.3);
    if (restante <= 0) {
      detenerTemporizador();
      responder(false, null, true);
    }
  }, 100);
}

// Detiene el reloj y devuelve qué fracción de tiempo quedaba (0 a 1).
function detenerTemporizador() {
  if (temporizador) clearInterval(temporizador);
  temporizador = null;
  return Math.max(0, finTiempo - performance.now()) / duracionTiempo;
}

// ---- Respuesta ----

function responder(acerto, boton, porTiempo = false) {
  if (bloqueado) return;
  bloqueado = true;
  const quedaba = detenerTemporizador();
  const item = ronda[indice].item;

  opcionesEl.querySelectorAll(".opcion-ingles").forEach((b) => {
    b.disabled = true;
    if (b.dataset.en === item.en) b.classList.add("correcta");
  });
  letrasEl.querySelectorAll(".letra").forEach((b) => (b.disabled = true));
  resultados.push({ item, ok: acerto });

  if (acerto) {
    aciertos++;
    racha++;
    const ganados = PUNTOS_BASE + Math.round(BONO_RAPIDEZ * quedaba);
    puntos += ganados;
    puntosEl.textContent = `Puntos: ${puntos}`;
    mensajeEl.textContent = `${elegir(ANIMOS)} ${item.en} = ${item.es} (+${ganados})`;
    mensajeEl.className = "mensaje-juego exito";
    Aprende.sonido.acierto();
    Aprende.efecto.rebote(boton || enunciadoEl);
    if (racha % 5 === 0) Aprende.confeti(35);
  } else {
    racha = 0;
    if (boton) boton.classList.add("incorrecta");
    if (!boton && !deletreoEl.hidden) {
      // Deletreo equivocado o sin tiempo: mostramos cómo se escribe.
      slotsEl.querySelectorAll(".slot").forEach((slot, i) => (slot.textContent = item.en[i]));
    }
    mensajeEl.textContent = porTiempo
      ? `⏰ ¡Se acabó el tiempo! ${item.en} = ${item.es}`
      : `Oops! Era: ${item.en} = ${item.es}`;
    mensajeEl.className = "mensaje-juego error";
    Aprende.sonido.error();
    Aprende.efecto.sacudir(boton || enunciadoEl);
  }
  actualizarRacha();

  // Pronunciamos la respuesta correcta para que la escuche siempre.
  setTimeout(() => hablar(item.en), 400);
  setTimeout(siguiente, 2300);
}

function actualizarRacha() {
  rachaEl.hidden = racha < 2;
  rachaEl.textContent = `🔥 ${racha}`;
}

function siguiente() {
  indice++;
  if (indice >= TOTAL_PREGUNTAS) terminarPartida();
  else mostrarPregunta();
}

function terminarPartida() {
  detenerTemporizador();
  barraEl.style.width = "100%";
  mostrarPantalla(pantallaFin);

  const estrellas = Aprende.estrellasPorAciertos(aciertos, TOTAL_PREGUNTAS);
  let felicitacion = "Keep going! ¡Sigue practicando, vas muy bien!";
  if (estrellas === 3) felicitacion = "Amazing! ¡Increíble, hablas inglés como campeona!";
  else if (estrellas === 2) felicitacion = "Great job! ¡Muy bien, ya sabes muchas palabras!";
  else if (estrellas === 1) felicitacion = "Good try! ¡Buen intento, cada vez mejor!";

  const tema = TEMAS[temaActual];
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-resumen").textContent = `Acertaste ${aciertos} de ${TOTAL_PREGUNTAS}`;
  document.getElementById("fin-puntos").textContent = `${puntos} puntos`;
  document.getElementById("fin-nivel").textContent = `Tema: ${tema.nombre} (${tema.es})`;
  Aprende.finDePartida("ingles", temaActual, estrellas);

  // Repaso: todas las palabras de la partida, se pueden tocar para oírlas.
  const repaso = document.getElementById("repaso");
  repaso.innerHTML = "";
  resultados.forEach(({ item, ok }) => {
    const li = document.createElement("li");
    li.innerHTML = `<button class="repaso-item">${visual(item)}
      <span><strong>${item.en}</strong> = ${item.es}</span>
      <span class="marca">${ok ? "✅" : "🔁"} 🔊</span></button>`;
    li.querySelector("button").addEventListener("click", () => hablar(item.en));
    repaso.appendChild(li);
  });
  pintarTemas();
}

function salirAlInicio() {
  detenerTemporizador();
  callar();
  pintarTemas();
  mostrarPantalla(pantallaInicio);
}

// ---- Eventos ----

document.querySelectorAll("[data-accion='inicio']").forEach((b) => b.addEventListener("click", salirAlInicio));
document.getElementById("btn-repetir").addEventListener("click", () => empezarPartida(temaActual));
document.getElementById("btn-borrar-letra").addEventListener("click", borrarLetra);

// Teclado: 1-4 eligen opción, letras para deletrear, Borrar quita la última.
document.addEventListener("keydown", (e) => {
  if (pantallaJuego.hidden || bloqueado) return;
  if (!deletreoEl.hidden) {
    if (e.key === "Backspace") {
      e.preventDefault();
      borrarLetra();
      return;
    }
    const i = fichas.findIndex((f) => !f.usada && f.letra === e.key.toLowerCase());
    if (i !== -1) elegirLetra(i);
    return;
  }
  const n = Number(e.key);
  const botones = opcionesEl.querySelectorAll(".opcion-ingles");
  if (n >= 1 && n <= botones.length) botones[n - 1].click();
});

pintarTemas();
mostrarPantalla(pantallaInicio);
