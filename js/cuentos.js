// Cuentos de Capi — Aprende con Ana Isabella
// Lectura con comprensión: se elige un cuento de la biblioteca, se lee (o se
// escucha con la voz del navegador, en español) y se contestan preguntas.
// Las estrellas dependen de los errores. Cuentos en js/cuentos-datos.js.
// Progreso "cuentos" → id del cuento.

const NIVELES = { 1: "●○○ Cortito", 2: "●●○ Mediano", 3: "●●● Largo" };
const ANIMOS = ["¡Muy bien! 🎉", "¡Exacto! ✨", "¡Genial! 🌟", "¡Eso es! 👏"];

let cuento = null;
let k = 0;
let errores = 0;
let sesion = 0;

const pantallas = {
  biblioteca: document.getElementById("pantalla-biblioteca"),
  lectura: document.getElementById("pantalla-lectura"),
  preguntas: document.getElementById("pantalla-preguntas"),
  fin: document.getElementById("pantalla-fin"),
};
const preguntaEl = document.getElementById("pregunta");
const respuestasEl = document.getElementById("respuestas");
const mensajeEl = document.getElementById("mensaje-cuento");
const accionesEl = document.getElementById("acciones-cuento");
const puntosEl = document.getElementById("puntos-pasos");

function mostrarPantalla(nombre) {
  sesion++;
  callar();
  Object.entries(pantallas).forEach(([n, el]) => (el.hidden = n !== nombre));
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

const parrafos = (c) => c.texto.map((p) => `<p>${p}</p>`).join("");

// ---- Voz (la del navegador, en español) ----

const hayVoz = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let voz = null;
function buscarVoz() {
  const voces = window.speechSynthesis.getVoices();
  return voces.find((v) => /^es-(MX|US|419|CO|AR|PA)/.test(v.lang)) || voces.find((v) => v.lang && v.lang.startsWith("es")) || null;
}
if (hayVoz) {
  voz = buscarVoz();
  window.speechSynthesis.onvoiceschanged = () => (voz = buscarVoz());
}

function leerEnVoz(textos) {
  const aviso = document.getElementById("aviso-voz");
  aviso.hidden = true;
  if (!hayVoz || Aprende.silenciado()) {
    aviso.hidden = false;
    aviso.textContent = Aprende.silenciado()
      ? "El sonido está apagado (🔇). Tócalo arriba para prenderlo… ¡o léelo tú en voz alta!"
      : "Este navegador no tiene voz. ¡Léelo tú en voz alta!";
    return;
  }
  window.speechSynthesis.cancel();
  // Quitamos las rayas de diálogo para que la voz no las lea raro.
  textos.forEach((t, i) => {
    const frase = new SpeechSynthesisUtterance(t.replace(/—/g, ", "));
    frase.lang = voz ? voz.lang : "es-MX";
    if (voz) frase.voice = voz;
    frase.rate = 0.9;
    if (i === textos.length - 1) frase.onend = () => mostrarBotonesVoz(false);
    window.speechSynthesis.speak(frase);
  });
  mostrarBotonesVoz(true);
}

function callar() {
  if (hayVoz) window.speechSynthesis.cancel();
  mostrarBotonesVoz(false);
}

function mostrarBotonesVoz(leyendo) {
  document.getElementById("btn-escuchar").hidden = leyendo;
  document.getElementById("btn-callar").hidden = !leyendo;
}

// ---- Biblioteca ----

function estrellasDe(id) {
  return (Aprende.progreso().cuentos || {})[id] || 0;
}

function pintarBiblioteca() {
  const caja = document.getElementById("cuentos");
  caja.innerHTML = "";
  // De los cortitos a los largos (sort es estable: dentro del nivel, el orden del archivo).
  [...CUENTOS].sort((a, b) => a.nivel - b.nivel).forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "capitulo-card tarjeta-cuento";
    const estrellas = estrellasDe(c.id);
    b.innerHTML = `
      <span class="numero">${i + 1}</span>
      <span class="emoji">${c.dibujo}</span>
      <span class="titulo">${c.titulo}</span>
      <span class="subtitulo-unidad">${NIVELES[c.nivel]}</span>
      <span class="estrellas-cap">${estrellas ? Aprende.textoEstrellas(estrellas) : "¡Nuevo!"}</span>`;
    b.addEventListener("click", () => abrirCuento(c));
    caja.appendChild(b);
  });
}

function abrirCuento(c) {
  cuento = c;
  mostrarPantalla("lectura");
  document.getElementById("titulo-cuento").textContent = `${c.dibujo} ${c.titulo}`;
  document.getElementById("texto-cuento").innerHTML = parrafos(c);
}

// ---- Preguntas ----

function empezarPreguntas() {
  k = 0;
  errores = 0;
  mostrarPantalla("preguntas");
  document.getElementById("titulo-preguntas").textContent = `${cuento.dibujo} ${cuento.titulo}`;
  document.getElementById("texto-repaso").innerHTML = parrafos(cuento);
  document.querySelector(".ver-cuento").open = false;
  mostrarPregunta();
}

function mostrarPregunta() {
  sesion++;
  const q = cuento.preguntas[k];
  puntosEl.innerHTML = cuento.preguntas
    .map((_, i) => `<span class="punto-paso${i < k ? " hecho" : ""}${i === k ? " actual" : ""}"></span>`)
    .join("");
  preguntaEl.innerHTML = `<span class="numero-pregunta">Pregunta ${k + 1} de ${cuento.preguntas.length}</span>${q.texto}`;
  respuestasEl.innerHTML = "";
  accionesEl.innerHTML = "";
  mensaje("");
  if (q.tipo === "ordena") ordenar(q);
  else opciones(q);
}

function siguiente() {
  const b = document.createElement("button");
  const ultima = k === cuento.preguntas.length - 1;
  b.className = "boton ejecutar";
  b.textContent = ultima ? "Terminar" : "Siguiente pregunta →";
  b.addEventListener("click", () => {
    if (ultima) terminar();
    else {
      k++;
      mostrarPregunta();
    }
  });
  accionesEl.appendChild(b);
  Aprende.efecto.rebote(b);
}

function opciones(q) {
  const caja = document.createElement("div");
  caja.className = "opciones";
  mezclar(q.opciones).forEach((op) => {
    const b = document.createElement("button");
    b.className = "opcion";
    b.textContent = op.t;
    b.dataset.correcta = op.ok ? "si" : "no";
    b.addEventListener("click", () => {
      if (op.ok) {
        b.classList.add("correcta");
        caja.querySelectorAll("button").forEach((x) => (x.disabled = true));
        // La explicación ya trae su propio ánimo; si no hay, va uno al azar.
        mensaje(op.explica || ANIMOS[Math.floor(Math.random() * ANIMOS.length)], "exito");
        Aprende.sonido.acierto();
        siguiente();
      } else {
        errores++;
        b.classList.add("incorrecta");
        b.disabled = true;
        mensaje(op.explica || "¡Casi! Mira el cuento otra vez.", "error");
        Aprende.sonido.error();
        Aprende.efecto.sacudir(b);
      }
    });
    caja.appendChild(b);
  });
  respuestasEl.appendChild(caja);
}

// Tocar los hechos en el orden en que pasaron.
function ordenar(q) {
  let elegidos = [];
  let bloqueado = false;
  const linea = document.createElement("ol");
  linea.className = "orden-armado";
  const bandeja = document.createElement("div");
  bandeja.className = "bandeja-orden";
  const pintar = () => {
    linea.innerHTML = elegidos.length
      ? elegidos.map((i) => `<li>${q.pasos[i]}</li>`).join("")
      : '<li class="ranura-vacia">Toca lo que pasó primero…</li>';
    bandeja.querySelectorAll("button").forEach((b) => (b.disabled = bloqueado || elegidos.includes(Number(b.dataset.i))));
  };
  let orden;
  do orden = mezclar([...q.pasos.keys()]);
  while (orden.every((v, i) => v === i));
  orden.forEach((i) => {
    const b = document.createElement("button");
    b.className = "tarjeta-orden";
    b.textContent = q.pasos[i];
    b.dataset.i = i;
    b.addEventListener("click", () => {
      if (bloqueado || elegidos.includes(i)) return;
      elegidos.push(i);
      Aprende.sonido.clic();
      pintar();
      if (elegidos.length < q.pasos.length) return;
      bloqueado = true;
      pintar();
      const mal = elegidos.findIndex((v, j) => v !== j);
      if (mal === -1) {
        mensaje("¡Orden perfecto! Así pasó. 🎉", "exito");
        Aprende.sonido.acierto();
        siguiente();
        return;
      }
      errores++;
      mensaje(`Casi… el paso número ${mal + 1} no va ahí. ¡Intenta otra vez!`, "error");
      Aprende.sonido.error();
      Aprende.efecto.sacudir(linea);
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        elegidos = [];
        bloqueado = false;
        pintar();
      }, 1500);
    });
    bandeja.appendChild(b);
  });
  respuestasEl.append(linea, bandeja);
  pintar();
}

function terminar() {
  const estrellas = errores === 0 ? 3 : errores <= 2 ? 2 : 1;
  mostrarPantalla("fin");
  const textos = { 3: "¡Entendiste todo el cuento! Eres una gran lectora. 📚", 2: "¡Muy bien! Entendiste casi todo.", 1: "¡Bien! Léelo otra vez con calma y ganarás más estrellas." };
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = textos[estrellas];
  document.getElementById("fin-resumen").textContent =
    errores === 0 ? `«${cuento.titulo}»: ¡sin errores!` : `«${cuento.titulo}»: ${errores} ${errores === 1 ? "error" : "errores"}.`;
  Aprende.finDePartida("cuentos", cuento.id, estrellas);
  pintarBiblioteca();
}

// ---- Eventos ----

document.querySelectorAll("[data-accion='biblioteca']").forEach((b) =>
  b.addEventListener("click", () => {
    pintarBiblioteca();
    mostrarPantalla("biblioteca");
  })
);
document.getElementById("btn-preguntas").addEventListener("click", empezarPreguntas);
document.getElementById("btn-escuchar").addEventListener("click", () => leerEnVoz([cuento.titulo, ...cuento.texto]));
document.getElementById("btn-callar").addEventListener("click", callar);

pintarBiblioteca();
mostrarPantalla("biblioteca");
// Un enlace con #id abre ese cuento directo (ej. cuentos.html#semillas-sofia).
const pedido = CUENTOS.find((c) => c.id === decodeURIComponent(location.hash.slice(1)));
if (pedido) abrirCuento(pedido);
