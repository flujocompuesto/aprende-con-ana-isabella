// Mi alcancía — Aprende con Ana Isabella
// Educación financiera para niños, en 4 misiones con Capi que se abren en
// orden: necesidades y deseos, los tres frascos (gastar, ahorrar, compartir),
// una meta de ahorro semana a semana (con tentaciones) y el interés compuesto
// con un gráfico que ella misma mueve. Progreso "alcancia" → id de la misión.
// Las cifras son de juego (una mesada de $10, un interés de 10 % al año) para
// que se vea la idea; no son consejos de inversión.

const MISIONES = [
  {
    id: "necesito", titulo: "¿Lo necesito o lo quiero?", icono: "🛒",
    pasos: [
      {
        tipo: "explica",
        texto: "Una <strong>necesidad</strong> es algo que de verdad hace falta para vivir bien. Un <strong>deseo</strong> es algo que nos gusta tener, pero podemos vivir sin él. ¡Los deseos no son malos! Pero primero van las necesidades.",
        tarjetas: [
          { emoji: "🧺", titulo: "Necesidad", texto: "Comida, agua, ropa, casa, ir al doctor, útiles de la escuela." },
          { emoji: "🎈", titulo: "Deseo", texto: "Juguetes, dulces, videojuegos, ir al cine." },
        ],
      },
      {
        tipo: "clasifica",
        texto: "¿Es una necesidad o un deseo? Manda cada tarjeta a su lugar.",
        cestas: ["🧺 Necesidad", "🎈 Deseo"],
        exito: "¡Muy bien! Ya sabes separar lo que necesitas de lo que quieres. 🎉",
        items: [
          { t: "💧 Agua para tomar", cesta: 0, por: "Sin agua no podemos vivir." },
          { t: "🎮 Una consola nueva", cesta: 1, por: "Es divertida, pero se puede vivir sin ella." },
          { t: "👟 Zapatos para ir a la escuela", cesta: 0, por: "Los necesitas todos los días." },
          { t: "🍭 Una bolsa de dulces", cesta: 1, por: "Ricos, pero no hacen falta (¡y no le gustan a tus dientes!)." },
          { t: "💊 Medicina cuando estás enferma", cesta: 0, por: "La salud es lo primero." },
          { t: "🧸 El juguete de moda", cesta: 1, por: "Te gusta, pero no lo necesitas." },
          { t: "🍎 Comida para la semana", cesta: 0, por: "Sin comida no hay energía." },
          { t: "🍿 Ir al cine", cesta: 1, por: "Un gusto bonito, pero no una necesidad." },
          { t: "📓 Cuadernos para la escuela", cesta: 0, por: "Los necesitas para aprender." },
          { t: "🧥 Un abrigo cuando hace frío", cesta: 0, por: "Te protege del frío." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Tienes <strong>$10</strong>. Necesitas un cuaderno de <strong>$4</strong>, y se te antojan un helado de <strong>$3</strong> y un llavero de <strong>$5</strong>. ¿Qué haces?",
        opciones: [
          { t: "Primero compro el cuaderno, y con los $6 que sobran elijo un solo antojo", ok: true, explica: "¡Excelente! Primero la necesidad, y con lo que sobra eliges un deseo." },
          { t: "Compro el helado y el llavero", explica: "Gastarías $8 y solo te quedarían $2: ¡no te alcanza para el cuaderno que necesitas!" },
          { t: "Pido prestado para comprar todo", explica: "Lo prestado hay que devolverlo. Mejor elige con lo que tienes." },
        ],
      },
    ],
  },
  {
    id: "frascos", titulo: "Los tres frascos", icono: "🫙",
    pasos: [
      {
        tipo: "explica",
        texto: "Un truco de las personas que saben de dinero: cada vez que recibes dinero, lo repartes en <strong>3 frascos</strong>.",
        tarjetas: [
          { emoji: "🍭", titulo: "Gastar", texto: "Para cosas de ahora: un helado, un sticker." },
          { emoji: "🐷", titulo: "Ahorrar", texto: "Para una meta grande, más adelante." },
          { emoji: "💝", titulo: "Compartir", texto: "Para ayudar a otros o hacer un regalo." },
        ],
      },
      {
        tipo: "frascos",
        total: 10,
        texto: "Recibiste <strong>$10</strong> de mesada. Reparte las monedas en los tres frascos. Regla de Capi: ahorra <strong>por lo menos 3 de cada 10</strong> y pon <strong>al menos 1</strong> para compartir.",
      },
      {
        tipo: "pregunta",
        texto: "Te regalaron <strong>$20</strong> en tu cumpleaños. Con la regla de ahorrar 3 de cada 10, ¿cuánto va como mínimo al frasco de ahorrar?",
        opciones: [
          { t: "$6", ok: true, explica: "¡Sí! $20 son dos veces $10, así que son 3 + 3 = $6." },
          { t: "$3", explica: "$3 es para cada $10. Con $20 son dos veces: $6." },
          { t: "$20", explica: "Puedes ahorrar todo si quieres, pero el mínimo de la regla es $6." },
        ],
      },
    ],
  },
  {
    id: "meta", titulo: "Mi meta de ahorro", icono: "🛼",
    pasos: [
      {
        tipo: "explica",
        texto: "Ahorrar es más fácil con una <strong>meta</strong>. Capi quiere unos <strong>patines de $60</strong> 🛼. Cada semana recibe <strong>$10</strong> de mesada y decide cuánto ahorrar. Pero cuidado: ¡aparecerán tentaciones! ¿Lo logras en 7 semanas?",
      },
      { tipo: "simulacion", meta: 60, mesada: 10, texto: "Ayuda a Capi a juntar para sus patines. Cada semana: elige cuánto ahorras y decide qué hacer con lo que pase." },
    ],
  },
  {
    id: "crece", titulo: "El dinero que crece", icono: "🌱",
    pasos: [
      {
        tipo: "explica",
        texto: "Si guardas tu dinero en un banco o lo inviertes, te pagan un poquito por usarlo: eso es el <strong>interés</strong>. Y lo mágico: después, <strong>¡el interés también gana interés!</strong> Eso se llama <strong>interés compuesto</strong> 🌱, y es como una bola de nieve que va creciendo.",
      },
      {
        tipo: "pregunta",
        texto: "Tienes <strong>$100</strong> y te pagan <strong>10 %</strong> de interés al año (10 de cada 100). ¿Cuánto tienes al final del primer año?",
        opciones: [
          { t: "$110", ok: true, explica: "¡Sí! 10 % de $100 son $10, y $100 + $10 = $110." },
          { t: "$101", explica: "10 % de $100 es $10, no $1." },
          { t: "$200", explica: "Eso sería el 100 %. El 10 % de $100 son $10." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Y si dejas esos <strong>$110</strong> otro año, al 10 %… ¿cuánto tienes al final del segundo año?",
        opciones: [
          { t: "$121", ok: true, explica: "¡Exacto! El 10 % de $110 son $11: ganaste $1 más que el primer año porque el interés también ganó interés. 🌱" },
          { t: "$120", explica: "Casi: el segundo año el 10 % es sobre $110 (no sobre $100), o sea $11. Total: $121." },
          { t: "$111", explica: "El 10 % de $110 son $11, no $1. Total: $121." },
        ],
      },
      {
        tipo: "crece",
        texto: "Ahora juega con el tiempo. Si ahorras <strong>$10 cada mes</strong> con un interés de 10 % al año, ¿cuántos años tienen que pasar para que <strong>lo que ganó el interés</strong> (amarillo) sea <strong>más</strong> que lo que pusiste tú? Mueve la barra de los años.",
      },
      {
        tipo: "pregunta",
        texto: "¿Qué hace crecer más tus ahorros?",
        opciones: [
          { t: "Empezar temprano y ahorrar seguido", ok: true, explica: "¡Ese es el secreto! El tiempo es el mejor amigo del interés compuesto." },
          { t: "Esperar a ser grande para empezar", explica: "Mientras más tarde empiezas, menos tiempo tiene el interés para crecer." },
          { t: "Ahorrar mucho una vez y nunca más", explica: "Ayuda, pero ahorrar seguido y con tiempo crece mucho más." },
        ],
      },
    ],
  },
];

// ---- Estado ----

let sesion = 0;
let misionIdx = 0;
let pasoIdx = 0;
let errores = 0;
let estrellasFijas = null; // la simulación decide sus estrellas por semanas

const pantallas = {
  mapa: document.getElementById("pantalla-mapa"),
  mision: document.getElementById("pantalla-mision"),
  fin: document.getElementById("pantalla-fin"),
};
const misionesEl = document.getElementById("misiones");
const tituloEl = document.getElementById("titulo-mision");
const puntosEl = document.getElementById("puntos-pasos");
const textoEl = document.getElementById("texto-capi");
const contenidoEl = document.getElementById("contenido-alcancia");
const mensajeEl = document.getElementById("mensaje-alcancia");
const accionesEl = document.getElementById("acciones-alcancia");

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

function crear(etiqueta, clase = "", html = "") {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (html) el.innerHTML = html;
  return el;
}

function boton(html, clase) {
  const b = crear("button", clase, html);
  b.type = "button";
  return b;
}

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

function fallo(el, texto) {
  errores++;
  mensaje(texto, "error");
  Aprende.sonido.error();
  if (el) Aprende.efecto.sacudir(el);
}

const dinero = (n) => `$${Math.round(n).toLocaleString("es")}`;

// ================= Mapa de misiones =================

function estrellasDe(id) {
  return (Aprende.progreso().alcancia || {})[id] || 0;
}

function pintarMapa() {
  misionesEl.innerHTML = "";
  const sugerida = MISIONES.findIndex((m) => !estrellasDe(m.id));
  MISIONES.forEach((m, i) => {
    const abierta = i === 0 || estrellasDe(MISIONES[i - 1].id) > 0;
    const estrellas = estrellasDe(m.id);
    const b = boton(
      `<span class="numero">${i + 1}</span>
      <span class="emoji">${m.icono}</span>
      <span class="titulo">${m.titulo}</span>
      <span class="estrellas-cap">${estrellas ? Aprende.textoEstrellas(estrellas) : abierta ? (i === sugerida ? "👉 ¡Sigue aquí!" : "&nbsp;") : "Bloqueada"}</span>`,
      "capitulo-card" + (i === sugerida && abierta ? " sugerido" : "")
    );
    b.disabled = !abierta;
    b.addEventListener("click", () => abrirMision(i));
    misionesEl.appendChild(b);
  });
}

// ================= Misión =================

function abrirMision(i) {
  misionIdx = i;
  pasoIdx = 0;
  errores = 0;
  estrellasFijas = null;
  mostrarPantalla("mision");
  mostrarPaso();
}

function mostrarPaso() {
  sesion++;
  const m = MISIONES[misionIdx];
  const paso = m.pasos[pasoIdx];
  tituloEl.textContent = `${m.icono} ${m.titulo}`;
  puntosEl.innerHTML = m.pasos
    .map((_, i) => `<span class="punto-paso${i < pasoIdx ? " hecho" : ""}${i === pasoIdx ? " actual" : ""}"></span>`)
    .join("");
  textoEl.innerHTML = paso.texto || "";
  contenidoEl.innerHTML = "";
  accionesEl.innerHTML = "";
  mensaje("");
  PASOS[paso.tipo](paso);
}

function mostrarSiguiente() {
  if (accionesEl.querySelector(".btn-siguiente-paso")) return;
  const ultimo = pasoIdx === MISIONES[misionIdx].pasos.length - 1;
  const b = boton(ultimo ? "Terminar misión" : "Siguiente →", "boton ejecutar btn-siguiente-paso");
  b.addEventListener("click", () => {
    if (ultimo) terminarMision();
    else {
      pasoIdx++;
      mostrarPaso();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  accionesEl.appendChild(b);
  Aprende.efecto.rebote(b);
}

// ---- Tipos de paso ----

const PASOS = {
  explica(paso) {
    if (paso.tarjetas) {
      contenidoEl.innerHTML = `<div class="tarjetas-explica">${paso.tarjetas
        .map((t) => `<div class="tarjeta-explica"><span class="emoji-grande">${t.emoji}</span><strong>${t.titulo}</strong><span>${t.texto}</span></div>`)
        .join("")}</div>`;
    }
    mostrarSiguiente();
  },

  pregunta(paso) {
    const caja = crear("div", "opciones");
    mezclar(paso.opciones).forEach((op) => {
      const b = boton(op.t, "opcion");
      b.dataset.correcta = op.ok ? "si" : "no";
      b.addEventListener("click", () => {
        if (op.ok) {
          b.classList.add("correcta");
          caja.querySelectorAll("button").forEach((x) => (x.disabled = true));
          mensaje(op.explica || "¡Correcto!", "exito");
          Aprende.sonido.acierto();
          Aprende.efecto.rebote(b);
          mostrarSiguiente();
        } else {
          b.classList.add("incorrecta");
          b.disabled = true;
          fallo(b, op.explica || "¡Casi! Piensa otra vez.");
        }
      });
      caja.appendChild(b);
    });
    contenidoEl.appendChild(caja);
  },

  clasifica(paso) {
    const items = mezclar(paso.items);
    let k = 0;
    const cuenta = crear("p", "pasos-info");
    const tarjeta = crear("div", "tarjeta-clasifica");
    const cestas = crear("div", "cestas");
    paso.cestas.forEach((nombre, ci) => {
      const b = boton(nombre, `boton-cesta cesta-${ci}`);
      b.addEventListener("click", () => responder(ci));
      cestas.appendChild(b);
    });
    const mostrar = () => {
      tarjeta.textContent = items[k].t;
      cuenta.textContent = `Tarjeta ${k + 1} de ${items.length}`;
      cestas.querySelectorAll("button").forEach((b) => (b.disabled = false));
      Aprende.efecto.rebote(tarjeta);
    };
    function responder(ci) {
      cestas.querySelectorAll("button").forEach((b) => (b.disabled = true));
      const item = items[k];
      if (ci === item.cesta) {
        mensaje(`¡Sí! ${item.por}`, "exito");
        Aprende.sonido.acierto();
      } else {
        fallo(tarjeta, `${item.cesta === 0 ? "Es una necesidad:" : "Es un deseo:"} ${item.por}`);
      }
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        k++;
        if (k < items.length) {
          mensaje("");
          mostrar();
        } else {
          tarjeta.textContent = "🎉";
          cuenta.textContent = "";
          cestas.hidden = true;
          mensaje(paso.exito, "exito");
          mostrarSiguiente();
        }
      }, 1900);
    }
    contenidoEl.append(cuenta, tarjeta, cestas);
    mostrar();
  },

  // Repartir monedas en los tres frascos con botones + y −.
  frascos(paso) {
    const nombres = [
      { id: "gastar", emoji: "🍭", titulo: "Gastar" },
      { id: "ahorrar", emoji: "🐷", titulo: "Ahorrar" },
      { id: "compartir", emoji: "💝", titulo: "Compartir" },
    ];
    const en = { gastar: 0, ahorrar: 0, compartir: 0 };
    let listo = false;
    const quedan = () => paso.total - en.gastar - en.ahorrar - en.compartir;
    const mano = crear("div", "mano-monedas");
    const frascos = crear("div", "frascos");
    const pintar = () => {
      mano.innerHTML = `<span>Te quedan por repartir:</span> ${"🪙".repeat(quedan()) || "—"} <strong>${dinero(quedan())}</strong>`;
      frascos.innerHTML = "";
      nombres.forEach((n) => {
        const f = crear("div", `frasco frasco-${n.id}`);
        f.innerHTML = `<span class="frasco-titulo">${n.emoji} ${n.titulo}</span>
          <div class="frasco-vidrio"><div class="frasco-monedas">${"🪙".repeat(en[n.id])}</div></div>
          <strong class="frasco-total">${dinero(en[n.id])}</strong>`;
        const botones = crear("div", "frasco-botones");
        const menos = boton("−", "boton-frasco");
        const mas = boton("+", "boton-frasco");
        menos.disabled = listo || en[n.id] === 0;
        mas.disabled = listo || quedan() === 0;
        menos.setAttribute("aria-label", `Sacar una moneda de ${n.titulo}`);
        mas.setAttribute("aria-label", `Poner una moneda en ${n.titulo}`);
        menos.addEventListener("click", () => {
          en[n.id]--;
          Aprende.sonido.clic();
          pintar();
        });
        mas.addEventListener("click", () => {
          en[n.id]++;
          Aprende.sonido.paso();
          pintar();
        });
        botones.append(menos, mas);
        f.appendChild(botones);
        frascos.appendChild(f);
      });
    };
    const revisar = boton("✅ Listo", "boton ejecutar");
    revisar.addEventListener("click", () => {
      if (listo) return;
      if (quedan() > 0) return mensaje(`Todavía te quedan ${dinero(quedan())} por repartir.`, "error");
      if (en.ahorrar < 3) return fallo(frascos, "Recuerda la regla: ahorra por lo menos $3 de cada $10. 🐷");
      if (en.compartir < 1) return fallo(frascos, "Pon al menos $1 en compartir: ayudar a otros también es importante. 💝");
      listo = true;
      revisar.disabled = true;
      pintar();
      const mucho = en.ahorrar >= 5 ? " ¡Y ahorraste la mitad o más: así se llega rápido a una meta!" : "";
      mensaje(`¡Muy bien repartido! ${dinero(en.gastar)} para gastar, ${dinero(en.ahorrar)} para ahorrar y ${dinero(en.compartir)} para compartir.${mucho}`, "exito");
      Aprende.sonido.acierto();
      Aprende.confeti(30);
      mostrarSiguiente();
    });
    const pie = crear("div", "acciones");
    pie.appendChild(revisar);
    contenidoEl.append(mano, frascos, pie);
    pintar();
  },

  // La meta de ahorro, semana a semana, con tentaciones y regalos.
  simulacion(paso) {
    // Lo que pasa cada semana. "ahorro" toca el frasco de ahorrar; "gasto" el de gastar.
    const EVENTOS = {
      2: { texto: "🎁 Tu tía te regala <strong>$5</strong>.", a: { t: "🐷 Lo ahorro", ahorro: 5 }, b: { t: "🍭 Lo guardo para gastar", gasto: 5 } },
      3: { texto: "🍦 Pasa el carrito de los helados: cuesta <strong>$2</strong>.", a: { t: "🍦 Me compro uno", gasto: -2 }, b: { t: "🙅 Hoy no", gasto: 0 } },
      4: { texto: "🎮 Una amiga vende un juego usado por <strong>$15</strong>. Para comprarlo tendrías que usar tus ahorros…", a: { t: "🎮 Lo compro con mis ahorros", ahorro: -15, tentacion: true }, b: { t: "🙅 No, sigo con mi meta", ahorro: 0 } },
      5: { texto: "🧹 Ayudas a lavar el carro y te ganas <strong>$4</strong>.", a: { t: "🐷 Lo ahorro", ahorro: 4 }, b: { t: "🍭 Lo guardo para gastar", gasto: 4 } },
      6: { texto: "🎂 Es el cumpleaños de un amigo. Un regalito cuesta <strong>$3</strong>.", a: { t: "🎁 Se lo compro con mi dinero de gastar", gasto: -3 }, b: { t: "✏️ Le hago una tarjeta hecha a mano", gasto: 0 } },
      7: { texto: "✨ ¡Oferta! Stickers brillantes a <strong>$4</strong>, pero solo con tus ahorros.", a: { t: "✨ Los compro con mis ahorros", ahorro: -4, tentacion: true }, b: { t: "🙅 Mejor no", ahorro: 0 } },
    };
    let semana = 0;
    let ahorro = 0;
    let gasto = 0;
    const historia = []; // ahorro al final de cada semana

    const tablero = crear("div", "tablero-meta");
    const zona = crear("div", "zona-semana");
    contenidoEl.append(tablero, zona);

    const pintar = () => {
      const pct = Math.min(100, (ahorro / paso.meta) * 100);
      tablero.innerHTML = `
        <div class="meta-titulo">🛼 Meta: patines de ${dinero(paso.meta)} · Semana ${semana}</div>
        <div class="barra-meta"><div class="relleno-meta" style="width:${pct}%"></div><span>${dinero(ahorro)} de ${dinero(paso.meta)}</span></div>
        <div class="frascos-mini"><span>🐷 Ahorros: <strong>${dinero(ahorro)}</strong></span><span>🍭 Para gastar: <strong>${dinero(gasto)}</strong></span></div>
        <div class="grafico-semanas">${historia.map((h, i) => `<div class="col-semana" title="Semana ${i + 1}"><div style="height:${Math.min(100, (h / paso.meta) * 100)}%"></div><span>${i + 1}</span></div>`).join("")}</div>`;
    };

    const nuevaSemana = () => {
      semana++;
      mensaje("");
      pintar();
      zona.innerHTML = `<p class="pregunta-semana"><strong>Semana ${semana}:</strong> recibes tu mesada de ${dinero(paso.mesada)} 🪙. ¿Cuánto ahorras?</p>`;
      const fila = crear("div", "botones-semana");
      [2, 5, 8].forEach((n) => {
        const b = boton(`🐷 Ahorro ${dinero(n)} <small>(gasto ${dinero(paso.mesada - n)})</small>`, "opcion");
        b.addEventListener("click", () => {
          ahorro += n;
          gasto += paso.mesada - n;
          Aprende.sonido.paso();
          despuesDeAhorrar();
        });
        fila.appendChild(b);
      });
      zona.appendChild(fila);
    };

    const despuesDeAhorrar = () => {
      pintar();
      const ev = EVENTOS[semana];
      if (!ev) return cerrarSemana();
      zona.innerHTML = `<p class="pregunta-semana">${ev.texto}</p>`;
      const fila = crear("div", "botones-semana");
      [ev.a, ev.b].forEach((op) => {
        const b = boton(op.t, "opcion");
        // Lo que no alcanza no se puede comprar.
        if ((op.gasto || 0) < 0 && gasto + op.gasto < 0) b.disabled = true;
        if ((op.ahorro || 0) < 0 && ahorro + op.ahorro < 0) b.disabled = true;
        b.addEventListener("click", () => {
          ahorro += op.ahorro || 0;
          gasto += op.gasto || 0;
          if (op.tentacion) mensaje("Usaste tus ahorros… los patines tendrán que esperar un poco más. 🤔", "error");
          else if ((op.ahorro || 0) > 0) mensaje("¡Buena decisión! Tus ahorros crecen. 🐷", "exito");
          else mensaje("");
          Aprende.sonido.clic();
          cerrarSemana();
        });
        fila.appendChild(b);
      });
      zona.appendChild(fila);
    };

    const cerrarSemana = () => {
      historia.push(ahorro);
      pintar();
      if (ahorro >= paso.meta) {
        estrellasFijas = semana <= 7 ? 3 : semana <= 9 ? 2 : 1;
        zona.innerHTML = `<p class="pregunta-semana">🛼🎉 ¡Lo lograste en <strong>${semana} semanas</strong>! Capi ya tiene sus patines${ahorro > paso.meta ? ` y le sobraron ${dinero(ahorro - paso.meta)}` : ""}.</p>`;
        mensaje(semana <= 7 ? "¡Increíble! Ahorraste como una experta. 🏆" : "¡Lo lograste! La próxima vez prueba a ahorrar más cada semana y a resistir las tentaciones.", "exito");
        Aprende.sonido.victoria();
        Aprende.confeti(60);
        mostrarSiguiente();
        return;
      }
      const sigue = boton(`Siguiente semana →`, "boton siguiente");
      sigue.addEventListener("click", nuevaSemana);
      zona.innerHTML = "";
      zona.appendChild(sigue);
    };

    nuevaSemana();
  },

  // Interés compuesto: ahorrar $10 al mes con 10 % al año y mover los años.
  crece() {
    const MENSUAL = 10;
    const TASA = 0.1;
    let anios = 3;
    let logrado = false;
    // Lo que hay al final de cada año: lo que pusiste y lo que ganó el interés.
    const calcular = (n) => {
      const filas = [];
      let saldo = 0;
      for (let mes = 1; mes <= n * 12; mes++) {
        saldo = saldo * (1 + TASA / 12) + MENSUAL;
        if (mes % 12 === 0) filas.push({ anio: mes / 12, puesto: MENSUAL * mes, total: saldo });
      }
      return filas;
    };
    const grafico = crear("div", "grafico-crece");
    const control = crear("div", "control-crece");
    control.innerHTML = `<label for="anios-crece"><strong>Años:</strong> <span id="valor-anios">${anios}</span></label>
      <input id="anios-crece" type="range" min="1" max="20" value="${anios}" />`;
    const resumen = crear("p", "resumen-crece");
    contenidoEl.append(control, grafico, resumen);
    const deslizador = control.querySelector("input");

    const pintar = () => {
      const filas = calcular(anios);
      const maximo = calcular(20)[19].total;
      grafico.innerHTML = filas
        .map((f) => {
          const altoPuesto = (f.puesto / maximo) * 100;
          const altoInteres = ((f.total - f.puesto) / maximo) * 100;
          return `<div class="col-crece" title="Año ${f.anio}"><div class="parte-interes" style="height:${altoInteres}%"></div><div class="parte-puesto" style="height:${altoPuesto}%"></div><span>${f.anio}</span></div>`;
        })
        .join("");
      const ultimo = filas[filas.length - 1];
      const interes = ultimo.total - ultimo.puesto;
      document.getElementById("valor-anios").textContent = anios;
      resumen.innerHTML = `En <strong>${anios} ${anios === 1 ? "año" : "años"}</strong> pusiste <span class="dato-puesto">${dinero(ultimo.puesto)}</span> y el interés te dio <span class="dato-interes">${dinero(interes)}</span>. Total: <strong>${dinero(ultimo.total)}</strong>.`;
      if (!logrado && interes > ultimo.puesto) {
        logrado = true;
        mensaje(`🌱 ¡Lo encontraste! A los ${anios} años, ¡tu dinero ya gana más por sí solo que lo que pusiste tú! Eso es el interés compuesto.`, "exito");
        Aprende.sonido.victoria();
        Aprende.confeti(50);
        mostrarSiguiente();
      }
    };
    deslizador.addEventListener("input", () => {
      anios = Number(deslizador.value);
      pintar();
    });
    pintar();
  },
};

// ================= Fin de la misión =================

function terminarMision() {
  const m = MISIONES[misionIdx];
  let estrellas = estrellasFijas;
  if (estrellas === null) estrellas = errores === 0 ? 3 : errores <= 2 ? 2 : 1;
  mostrarPantalla("fin");
  const textos = { 3: "¡Perfecto! Manejas tu dinero como experta. 🐷", 2: "¡Muy bien! Misión cumplida.", 1: "¡Misión cumplida! Repítela para ganar más estrellas." };
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = textos[estrellas];
  document.getElementById("fin-resumen").textContent =
    estrellasFijas !== null ? "" : errores === 0 ? `Terminaste «${m.titulo}» sin errores.` : `Terminaste «${m.titulo}» con ${errores} ${errores === 1 ? "error" : "errores"}.`;
  Aprende.finDePartida("alcancia", m.id, estrellas);
  document.getElementById("btn-siguiente-mision").hidden = misionIdx === MISIONES.length - 1;
  pintarMapa();
}

document.getElementById("btn-mapa").addEventListener("click", () => {
  pintarMapa();
  mostrarPantalla("mapa");
});
document.getElementById("btn-volver-mapa").addEventListener("click", () => mostrarPantalla("mapa"));
document.getElementById("btn-siguiente-mision").addEventListener("click", () => abrirMision(misionIdx + 1));

pintarMapa();
mostrarPantalla("mapa");
