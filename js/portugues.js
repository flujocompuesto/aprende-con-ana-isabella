// Curso de portugués — Aprende con Ana Isabella
// 8 unidades que se desbloquean en orden. Cada una: palabras nuevas (tarjetas
// para escuchar), práctica (leer, escuchar, traducir — con "trampas" en
// español) y armar frases. La última es una conversación con Capi.
// La voz es la del navegador en portugués de Brasil (pt-BR).

const PREGUNTAS_POR_UNIDAD = 8;
const TIPOS_PRACTICA = ["lee", "lee", "lee", "escucha", "escucha", "escucha", "traduce", "traduce"];
const ANIMOS = ["Muito bem! 🎉", "Isso aí! ✨", "Legal! 🌟", "Perfeito! 👏", "Ótimo! 🎊"];

let sesion = 0; // cambia al salir de una pantalla; los temporizadores viejos se detienen
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const pantallas = {
  mapa: document.getElementById("pantalla-mapa"),
  unidad: document.getElementById("pantalla-unidad"),
  fin: document.getElementById("pantalla-fin"),
};
const unidadesEl = document.getElementById("unidades");
const tituloEl = document.getElementById("titulo-unidad");
const puntosEl = document.getElementById("puntos-pasos");
const textoEl = document.getElementById("texto-capi");
const contenidoEl = document.getElementById("contenido-pt");
const mensajeEl = document.getElementById("mensaje-pt");
const accionesEl = document.getElementById("acciones-pt");

let unidadIdx = 0;
let pasos = [];
let pasoIdx = 0;
let errores = 0;

function mostrarPantalla(nombre) {
  sesion++;
  callar();
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

const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

// ---- Voz en portugués de Brasil ----

const hayVoz = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let voz = null;

function buscarVoz() {
  const voces = window.speechSynthesis.getVoices();
  return (
    voces.find((v) => v.lang === "pt-BR" && /luciana|google português|francisca|thiago/i.test(v.name)) ||
    voces.find((v) => v.lang === "pt-BR") ||
    voces.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt")) ||
    null
  );
}

if (hayVoz) {
  voz = buscarVoz();
  window.speechSynthesis.onvoiceschanged = () => (voz = buscarVoz());
}

const puedeHablar = () => hayVoz && !Aprende.silenciado();

function hablar(texto) {
  if (!puedeHablar()) return;
  window.speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(texto);
  frase.lang = "pt-BR";
  if (voz) frase.voice = voz;
  frase.rate = 0.85;
  window.speechSynthesis.speak(frase);
}

function callar() {
  if (hayVoz) window.speechSynthesis.cancel();
}

// ---- Dibujo de cada palabra ----

function visual(p, clase = "") {
  if (p.color) return `<span class="muestra-color ${clase}" style="background:${p.color}"></span>`;
  if (p.texto) return `<span class="visual-texto ${clase}">${p.texto}</span>`;
  return `<span class="visual-emoji ${clase}">${p.emoji}</span>`;
}

const sinAcentos = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ================= Mapa del curso =================

function estrellasDe(id) {
  return (Aprende.progreso().portugues || {})[id] || 0;
}

function pintarMapa() {
  unidadesEl.innerHTML = "";
  const sugerida = UNIDADES_PT.findIndex((u) => !estrellasDe(u.id));
  UNIDADES_PT.forEach((u, i) => {
    const abierta = i === 0 || estrellasDe(UNIDADES_PT[i - 1].id) > 0;
    const estrellas = estrellasDe(u.id);
    const boton = document.createElement("button");
    boton.className = "capitulo-card" + (i === sugerida && abierta ? " sugerido" : "");
    boton.disabled = !abierta;
    boton.innerHTML = `
      <span class="numero">${i + 1}</span>
      <span class="emoji">${u.icono}</span>
      <span class="titulo">${u.titulo}</span>
      <span class="subtitulo-unidad">${u.es}</span>
      <span class="estrellas-cap">${estrellas ? Aprende.textoEstrellas(estrellas) : abierta ? (i === sugerida ? "👉 ¡Sigue aquí!" : "&nbsp;") : "Bloqueada"}</span>`;
    boton.addEventListener("click", () => abrirUnidad(i));
    unidadesEl.appendChild(boton);
  });
}

// ================= Unidad =================

const NOMBRE_PASO = { palabras: "Palabras nuevas", practica: "Práctica", conversa: "Conversación", frases: "Arma la frase" };

function abrirUnidad(i) {
  unidadIdx = i;
  const u = UNIDADES_PT[i];
  pasos = u.conversa ? ["conversa", "frases"] : ["palabras", "practica", "frases"];
  pasoIdx = 0;
  errores = 0;
  mostrarPantalla("unidad");
  mostrarPaso();
}

function mostrarPaso() {
  sesion++;
  callar();
  const u = UNIDADES_PT[unidadIdx];
  const paso = pasos[pasoIdx];
  tituloEl.textContent = `Unidad ${unidadIdx + 1}: ${u.titulo} · ${NOMBRE_PASO[paso]}`;
  puntosEl.innerHTML = pasos
    .map((_, i) => `<span class="punto-paso${i < pasoIdx ? " hecho" : ""}${i === pasoIdx ? " actual" : ""}"></span>`)
    .join("");
  contenidoEl.innerHTML = "";
  accionesEl.innerHTML = "";
  mensaje("");
  ({ palabras: pasoPalabras, practica: pasoPractica, frases: pasoFrases, conversa: pasoConversa })[paso](u);
}

function mostrarSiguiente(texto) {
  const ultimo = pasoIdx === pasos.length - 1;
  const boton = document.createElement("button");
  boton.className = "boton ejecutar";
  boton.textContent = texto || (ultimo ? "Terminar unidad" : "Siguiente →");
  boton.addEventListener("click", () => {
    if (ultimo) terminarUnidad();
    else {
      pasoIdx++;
      mostrarPaso();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  accionesEl.innerHTML = "";
  accionesEl.appendChild(boton);
  Aprende.efecto.rebote(boton);
}

// ---- Paso 1: palabras nuevas ----

function pasoPalabras(u) {
  textoEl.innerHTML = `Toca cada tarjeta para escuchar cómo se dice. 🔊<br><strong>Dica de Capi:</strong> ${u.dica}`;
  const oidas = new Set();
  const cuenta = document.createElement("p");
  cuenta.className = "pasos-info";
  const rejilla = document.createElement("div");
  rejilla.className = "tarjetas-vocab";
  const actualizar = () => (cuenta.textContent = `Escuchaste ${oidas.size} de ${u.palabras.length} palabras`);
  u.palabras.forEach((p, i) => {
    const tarjeta = document.createElement("button");
    tarjeta.className = "tarjeta-vocab";
    tarjeta.innerHTML = `${visual(p)}<strong class="pt">${p.pt}</strong><span class="es">${p.es}</span>`;
    tarjeta.addEventListener("click", () => {
      hablar(p.pt);
      oidas.add(i);
      tarjeta.classList.add("oida");
      Aprende.efecto.rebote(tarjeta);
      actualizar();
      if (oidas.size === u.palabras.length && !accionesEl.children.length) {
        mensaje("¡Las escuchaste todas! Ahora a practicar. 💪", "exito");
        mostrarSiguiente();
      }
    });
    rejilla.appendChild(tarjeta);
  });
  contenidoEl.append(rejilla, cuenta);
  actualizar();
  if (!puedeHablar()) mensaje("Sin sonido: lee cada palabra en voz alta tú misma. 😉");
}

// ---- Paso 2: práctica ----

function pasoPractica(u) {
  textoEl.innerHTML = "¡A practicar! Lee, escucha y traduce. Cuidado con las <strong>trampas</strong>: a veces aparece la palabra en español. 😉";
  const palabras = mezclar(u.palabras).slice(0, PREGUNTAS_POR_UNIDAD);
  const preguntas = palabras.map((item, i) => {
    const otras = mezclar(u.palabras.filter((p) => p.pt !== item.pt)).slice(0, 3);
    return { tipo: TIPOS_PRACTICA[i], item, opciones: mezclar([item, ...otras]) };
  });
  let indice = 0;
  let aciertos = 0;

  const cabecera = document.createElement("p");
  cabecera.className = "pasos-info";
  const enunciado = document.createElement("div");
  enunciado.className = "enunciado";
  const opciones = document.createElement("div");
  opciones.className = "opciones-ingles";
  contenidoEl.append(cabecera, enunciado, opciones);

  const mostrar = () => {
    const pregunta = preguntas[indice];
    const tipo = pregunta.tipo === "escucha" && !puedeHablar() ? "lee" : pregunta.tipo;
    const { item } = pregunta;
    cabecera.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
    mensaje("");
    opciones.innerHTML = "";
    let lista = pregunta.opciones;

    if (tipo === "lee") {
      enunciado.innerHTML = `<div class="palabra-ingles">${item.pt}<button class="boton-oir" aria-label="Escuchar">🔊</button></div>
        <p class="pista-suave">¿Qué significa?</p>`;
      hablar(item.pt);
    } else if (tipo === "escucha") {
      enunciado.innerHTML = `<button class="boton-oir grande" aria-label="Escuchar otra vez">🔊</button>
        <p class="pista-suave">Escucha y elige qué significa</p>`;
      hablar(item.pt);
    } else {
      enunciado.innerHTML = `${u.conDibujos ? visual(item, "grande") : ""}<div class="palabra-es">«${item.es}» en portugués es…</div>`;
      // Trampa: la palabra en español, si es distinta a la de portugués.
      if (!/[ (]/.test(item.es) && sinAcentos(item.es) !== sinAcentos(item.pt)) {
        const distractores = pregunta.opciones.filter((p) => p !== item).slice(0, 2);
        lista = mezclar([item, ...distractores, { pt: item.es, trampa: true }]);
      }
    }
    const oir = enunciado.querySelector(".boton-oir");
    if (oir) oir.addEventListener("click", () => hablar(item.pt));

    lista.forEach((op) => {
      const boton = document.createElement("button");
      boton.className = "opcion-ingles";
      if (tipo === "traduce") boton.textContent = op.pt;
      else if (u.conDibujos) boton.innerHTML = visual(op);
      else boton.textContent = op.es;
      boton.dataset.correcta = op === item ? "si" : "no";
      boton.addEventListener("click", () => responder(op, boton));
      opciones.appendChild(boton);
    });

    function responder(op, boton) {
      opciones.querySelectorAll("button").forEach((b) => {
        b.disabled = true;
        if (b.dataset.correcta === "si") b.classList.add("correcta");
      });
      if (op === item) {
        aciertos++;
        mensaje(`${elegir(ANIMOS)} <strong>${item.pt}</strong> = ${item.es}`, "exito");
        Aprende.sonido.acierto();
        Aprende.efecto.rebote(boton);
      } else {
        errores++;
        boton.classList.add("incorrecta");
        mensaje(
          op.trampa
            ? `¡Ojo! «${op.pt}» es en español. En portugués se dice <strong>${item.pt}</strong>.`
            : `Casi… <strong>${item.pt}</strong> = ${item.es}`,
          "error"
        );
        Aprende.sonido.error();
        Aprende.efecto.sacudir(boton);
      }
      const s = sesion;
      setTimeout(() => s === sesion && hablar(item.pt), 400);
      setTimeout(() => {
        if (s !== sesion) return;
        indice++;
        if (indice < preguntas.length) mostrar();
        else terminarPractica();
      }, 2100);
    }
  };

  const terminarPractica = () => {
    cabecera.textContent = "";
    enunciado.innerHTML = `<div class="palabra-ingles">${aciertos} de ${preguntas.length}</div><p class="pista-suave">respuestas correctas</p>`;
    opciones.innerHTML = "";
    mensaje(aciertos === preguntas.length ? "Perfeito! 🏆 ¡Todas bien!" : "¡Bien hecho! Ahora vamos a armar frases.", "exito");
    mostrarSiguiente();
  };

  mostrar();
}

// ---- Paso 3: armar frases ----

function pasoFrases(u) {
  textoEl.innerHTML = "Ahora arma la frase en portugués: toca las palabras en el orden correcto. Puedes escucharla con el 🔊.";
  let k = 0;
  const significado = document.createElement("p");
  significado.className = "palabra-es frase-significado";
  const armada = document.createElement("div");
  armada.className = "frase-armada";
  const fichas = document.createElement("div");
  fichas.className = "letras";
  const herramientas = document.createElement("div");
  herramientas.className = "acciones";
  herramientas.innerHTML = `<button class="boton quitar" data-h="borrar">⌫ Quitar</button><button class="boton pista" data-h="oir">🔊 Escuchar</button>`;
  contenidoEl.append(significado, armada, fichas, herramientas);

  let palabras = [];
  let elegidas = [];
  let bloqueado = false;

  const pintar = () => {
    armada.innerHTML = elegidas.length
      ? elegidas.map((i) => `<span class="ficha-colocada">${palabras[i]}</span>`).join("")
      : '<span class="ranura-vacia">Toca las palabras de abajo…</span>';
    fichas.querySelectorAll("button").forEach((b, i) => (b.disabled = elegidas.includes(i) || bloqueado));
  };

  const cargar = () => {
    const frase = u.frases[k];
    significado.innerHTML = `Frase ${k + 1} de ${u.frases.length}: «${frase.es}»`;
    palabras = frase.pt.split(" ");
    let orden;
    do {
      orden = mezclar([...palabras.keys()]);
    } while (palabras.length > 1 && orden.every((v, i) => v === i));
    elegidas = [];
    bloqueado = false;
    fichas.innerHTML = "";
    palabras = orden.map((i) => palabras[i]); // las fichas, ya revueltas
    palabras.forEach((p, i) => {
      const boton = document.createElement("button");
      boton.className = "letra palabra-ficha";
      boton.textContent = p;
      boton.addEventListener("click", () => tocarFicha(i));
      fichas.appendChild(boton);
    });
    pintar();
  };

  function tocarFicha(i) {
    if (bloqueado || elegidas.includes(i)) return;
    elegidas.push(i);
    Aprende.sonido.clic();
    pintar();
    if (elegidas.length === palabras.length) revisar();
  }

  function revisar() {
    const frase = u.frases[k];
    const formada = elegidas.map((i) => palabras[i]).join(" ");
    bloqueado = true;
    pintar();
    const s = sesion;
    if (formada === frase.pt) {
      mensaje(`${elegir(ANIMOS)} <strong>${frase.pt}</strong>`, "exito");
      Aprende.sonido.acierto();
      Aprende.efecto.rebote(armada);
      setTimeout(() => s === sesion && hablar(frase.pt), 300);
      setTimeout(() => {
        if (s !== sesion) return;
        k++;
        if (k < u.frases.length) {
          mensaje("");
          cargar();
        } else {
          herramientas.hidden = true;
          mensaje("¡Armaste todas las frases! 🎉", "exito");
          mostrarSiguiente();
        }
      }, 2000);
    } else {
      errores++;
      mensaje("Casi… el orden no es ese. ¡Intenta otra vez! (Puedes escucharla con el 🔊)", "error");
      Aprende.sonido.error();
      Aprende.efecto.sacudir(armada);
      setTimeout(() => {
        if (s !== sesion) return;
        elegidas = [];
        bloqueado = false;
        pintar();
      }, 1200);
    }
  }

  herramientas.querySelector('[data-h="borrar"]').addEventListener("click", () => {
    if (bloqueado || !elegidas.length) return;
    elegidas.pop();
    Aprende.sonido.clic();
    pintar();
  });
  herramientas.querySelector('[data-h="oir"]').addEventListener("click", () => hablar(u.frases[k].pt));
  cargar();
}

// ---- Conversación con Capi ----

function pasoConversa(u) {
  textoEl.innerHTML = u.dica;
  const chat = document.createElement("div");
  chat.className = "chat";
  const opciones = document.createElement("div");
  opciones.className = "opciones";
  contenidoEl.append(chat, opciones);
  let k = 0;

  const globoCapi = (linea) => {
    const fila = document.createElement("div");
    fila.className = "mensaje-chat de-capi";
    fila.innerHTML = `<img class="avatar-chat" src="../img/capibara.svg" alt="Capi" />
      <div class="globo-chat"><strong>${linea.capi}</strong>
        <div class="acciones-chat"><button class="mini-texto" data-a="oir">🔊 Escuchar</button><button class="mini-texto" data-a="es">¿Qué dijo?</button></div>
        <div class="traduccion" hidden>${linea.es}</div>
      </div>`;
    fila.querySelector('[data-a="oir"]').addEventListener("click", () => hablar(linea.capi));
    fila.querySelector('[data-a="es"]').addEventListener("click", () => (fila.querySelector(".traduccion").hidden = false));
    chat.appendChild(fila);
  };

  const globoAna = (texto) => {
    const fila = document.createElement("div");
    fila.className = "mensaje-chat de-ana";
    fila.innerHTML = `<div class="globo-chat"><strong>${texto}</strong></div>`;
    chat.appendChild(fila);
  };

  const turno = () => {
    const linea = u.conversa[k];
    globoCapi(linea);
    hablar(linea.capi);
    opciones.innerHTML = "";
    mezclar(linea.opciones).forEach((op) => {
      const boton = document.createElement("button");
      boton.className = "opcion";
      boton.textContent = op.pt;
      boton.addEventListener("click", () => {
        if (op.ok) {
          opciones.innerHTML = "";
          globoAna(op.pt);
          hablar(op.pt);
          Aprende.sonido.acierto();
          mensaje(elegir(ANIMOS), "exito");
          k++;
          const s = sesion;
          setTimeout(() => {
            if (s !== sesion) return;
            mensaje("");
            if (k < u.conversa.length) turno();
            else {
              mensaje("¡Tuviste tu primera conversación en portugués! 🇧🇷🎉", "exito");
              mostrarSiguiente();
            }
          }, 2200);
        } else {
          errores++;
          boton.disabled = true;
          boton.classList.add("incorrecta");
          mensaje("Hmm, eso no contesta lo que preguntó Capi. Toca «¿Qué dijo?» si necesitas ayuda.", "error");
          Aprende.sonido.error();
          Aprende.efecto.sacudir(boton);
        }
      });
      opciones.appendChild(boton);
    });
    chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  turno();
}

// ================= Fin de la unidad =================

function terminarUnidad() {
  const u = UNIDADES_PT[unidadIdx];
  let estrellas = 1;
  if (errores === 0) estrellas = 3;
  else if (errores <= 2) estrellas = 2;
  mostrarPantalla("fin");
  const textos = { 3: "Perfeito! Sem nenhum erro.", 2: "Muito bem! ¡Unidad completa!", 1: "¡Unidad completa! Repítela para ganar más estrellas." };
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = textos[estrellas];
  document.getElementById("fin-resumen").textContent =
    errores === 0 ? `Terminaste «${u.titulo}» sin errores.` : `Terminaste «${u.titulo}» con ${errores} ${errores === 1 ? "error" : "errores"}.`;
  Aprende.finDePartida("portugues", u.id, estrellas);
  document.getElementById("btn-siguiente-unidad").hidden = unidadIdx === UNIDADES_PT.length - 1;
  pintarMapa();
}

document.getElementById("btn-mapa").addEventListener("click", () => {
  pintarMapa();
  mostrarPantalla("mapa");
});
document.getElementById("btn-volver-mapa").addEventListener("click", () => mostrarPantalla("mapa"));
document.getElementById("btn-siguiente-unidad").addEventListener("click", () => abrirUnidad(unidadIdx + 1));

pintarMapa();
mostrarPantalla("mapa");
