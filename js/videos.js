// Estudio de videos — Aprende con Ana Isabella
// Curso con Capi para aprender a hacer videos de YouTube: la idea, cuidarse
// en internet, el guion, grabar, editar, la miniatura y subirlo con papá.
// Las unidades (en js/videos-unidades.js) se abren en orden. Mientras avanza,
// Ana Isabella arma el plan de SU video, que se guarda solo en este
// navegador ("aprende:mi-video") y al final se ve completo para grabarlo.

const CLAVE_PLAN = "aprende:mi-video";

let sesion = 0; // cambia al salir de un paso; los temporizadores viejos se detienen
let unidadIdx = 0;
let pasoIdx = 0;
let errores = 0;

const pantallas = {
  mapa: document.getElementById("pantalla-mapa"),
  unidad: document.getElementById("pantalla-unidad"),
  fin: document.getElementById("pantalla-fin"),
  plan: document.getElementById("pantalla-plan"),
};
const unidadesEl = document.getElementById("unidades");
const tituloEl = document.getElementById("titulo-unidad");
const puntosEl = document.getElementById("puntos-pasos");
const textoEl = document.getElementById("texto-capi");
const contenidoEl = document.getElementById("contenido-video");
const mensajeEl = document.getElementById("mensaje-video");
const accionesEl = document.getElementById("acciones-video");
const botonPlan = document.getElementById("btn-plan");

function mostrarPantalla(nombre) {
  sesion++;
  Object.entries(pantallas).forEach(([k, el]) => (el.hidden = k !== nombre));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- Utilidades ----

function mezclar(lista) {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

// Revuelve los índices 0..n-1 sin dejarlos en orden.
function desordenados(n) {
  let orden;
  do orden = mezclar([...Array(n).keys()]);
  while (n > 1 && orden.every((v, i) => v === i));
  return orden;
}

// Lo que escribe la niña se muestra como texto, nunca como HTML.
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

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

// ---- Mi plan de video (solo en este navegador) ----

function leerPlan() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PLAN)) || {};
  } catch {
    return {};
  }
}

function guardarPlan(cambios) {
  const plan = { ...leerPlan(), ...cambios };
  try {
    localStorage.setItem(CLAVE_PLAN, JSON.stringify(plan));
  } catch {
    // Navegador privado: el plan dura solo mientras la página esté abierta.
  }
  return plan;
}

function miniaturaHTML({ miniFondo, miniImagen, miniTexto }, letra = "grande") {
  return `<div class="miniatura" style="background:${esc(miniFondo || "#f0b93b")}">
    <span class="imagen-mini">${esc(miniImagen || "🎬")}</span>
    <span class="letrero-mini ${letra}">${esc(miniTexto || "")}</span>
    <span class="duracion-mini">2:15</span>
  </div>`;
}

function planHTML(plan) {
  const dato = (v, donde) => (v ? esc(v) : `<span class="falta">— lo completas en «${donde}»</span>`);
  const pasos = [plan.paso1, plan.paso2, plan.paso3].filter(Boolean);
  return `<article class="plan-video">
    <h3>📋 Mi plan de video</h3>
    <section><h4>💡 La idea</h4>
      <p><strong>Tema:</strong> ${dato(plan.tema, "La idea")}</p>
      <p><strong>Para quién:</strong> ${dato(plan.publico, "La idea")}</p>
      <p><strong>Qué se lleva quien lo vea:</strong> ${dato(plan.aprende, "La idea")}</p>
    </section>
    <section><h4>📝 El guion</h4>
      <p><strong>🪝 Gancho:</strong> ${dato(plan.gancho, "El guion")}</p>
      ${pasos.length ? `<ol>${pasos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>` : `<p><strong>🧩 Pasos:</strong> ${dato("", "El guion")}</p>`}
      <p><strong>🎉 Final:</strong> ${dato(plan.final, "El guion")}</p>
    </section>
    <section><h4>🖼️ Miniatura y título</h4>
      ${plan.miniTexto ? miniaturaHTML(plan) : `<p>${dato("", "Miniatura y título")}</p>`}
      <p><strong>🏷️ Título:</strong> ${dato(plan.titulo, "Miniatura y título")}</p>
    </section>
    <section><h4>✅ Antes de grabar con papá</h4>
      <ul class="lista-revisar">
        <li>La ventana frente a mí, no detrás</li>
        <li>Un lugar tranquilo, sin ruido</li>
        <li>Celular acostado y firme (trípode o libros)</li>
        <li>Una prueba cortita para revisar luz y sonido</li>
        <li>Nada de datos personales: ni escuela, ni dirección, ni apellidos</li>
        <li>Música libre de derechos</li>
      </ul>
    </section>
  </article>`;
}

function hayPlan() {
  return Object.keys(leerPlan()).length > 0;
}

// ================= Mapa del curso =================

function estrellasDe(id) {
  return (Aprende.progreso().videos || {})[id] || 0;
}

function pintarMapa() {
  unidadesEl.innerHTML = "";
  const sugerida = UNIDADES_VIDEO.findIndex((u) => !estrellasDe(u.id));
  UNIDADES_VIDEO.forEach((u, i) => {
    const abierta = i === 0 || estrellasDe(UNIDADES_VIDEO[i - 1].id) > 0;
    const estrellas = estrellasDe(u.id);
    const b = boton(
      `<span class="numero">${i + 1}</span>
      <span class="emoji">${u.icono}</span>
      <span class="titulo">${u.titulo}</span>
      <span class="estrellas-cap">${estrellas ? Aprende.textoEstrellas(estrellas) : abierta ? (i === sugerida ? "👉 ¡Sigue aquí!" : "&nbsp;") : "Bloqueada"}</span>`,
      "capitulo-card" + (i === sugerida && abierta ? " sugerido" : "")
    );
    b.disabled = !abierta;
    b.addEventListener("click", () => abrirUnidad(i));
    unidadesEl.appendChild(b);
  });
  botonPlan.hidden = !hayPlan();
}

// ================= Unidad =================

function abrirUnidad(i) {
  unidadIdx = i;
  pasoIdx = 0;
  errores = 0;
  mostrarPantalla("unidad");
  mostrarPaso();
}

function mostrarPaso() {
  sesion++;
  const u = UNIDADES_VIDEO[unidadIdx];
  const paso = u.pasos[pasoIdx];
  tituloEl.textContent = `${u.icono} Unidad ${unidadIdx + 1}: ${u.titulo}`;
  puntosEl.innerHTML = u.pasos
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
  const ultimo = pasoIdx === UNIDADES_VIDEO[unidadIdx].pasos.length - 1;
  const b = boton(ultimo ? "Terminar unidad" : "Siguiente →", "boton ejecutar btn-siguiente-paso");
  b.addEventListener("click", () => {
    if (ultimo) terminarUnidad();
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
    const caja = crear("div", paso.visual ? "opciones-tomas" : "opciones");
    mezclar(paso.opciones).forEach((op, i) => {
      const contenido = paso.visual ? `${op.html}<span class="nombre-toma">Toma ${"ABCD"[i]}</span>` : op.html || op.t;
      const b = boton(contenido, paso.visual ? "opcion-toma" : "opcion");
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

  ordena(paso) {
    const linea = crear("ol", "orden-armado");
    const bandeja = crear("div", "bandeja-orden");
    const quitar = boton("⌫ Quitar la última", "boton quitar");
    let elegidos = [];
    let bloqueado = false;

    const pintar = () => {
      linea.innerHTML = elegidos.length
        ? elegidos.map((i) => `<li>${paso.items[i]}</li>`).join("")
        : '<li class="ranura-vacia">Toca las tarjetas de abajo, en orden…</li>';
      bandeja.querySelectorAll("button").forEach((b) => (b.disabled = bloqueado || elegidos.includes(Number(b.dataset.i))));
      quitar.disabled = bloqueado || !elegidos.length;
    };

    const revisar = () => {
      bloqueado = true;
      pintar();
      const mal = elegidos.findIndex((v, k) => v !== k);
      if (mal === -1) {
        mensaje(paso.exito || "¡Orden perfecto!", "exito");
        Aprende.sonido.acierto();
        Aprende.efecto.rebote(linea);
        quitar.hidden = true;
        mostrarSiguiente();
        return;
      }
      fallo(linea, `Casi… la tarjeta número ${mal + 1} no va ahí. ¡Intenta otra vez!`);
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        elegidos = [];
        bloqueado = false;
        pintar();
      }, 1500);
    };

    desordenados(paso.items.length).forEach((i) => {
      const b = boton(paso.items[i], "tarjeta-orden");
      b.dataset.i = i;
      b.addEventListener("click", () => {
        if (bloqueado || elegidos.includes(i)) return;
        elegidos.push(i);
        Aprende.sonido.clic();
        pintar();
        if (elegidos.length === paso.items.length) revisar();
      });
      bandeja.appendChild(b);
    });
    quitar.addEventListener("click", () => {
      if (bloqueado || !elegidos.length) return;
      elegidos.pop();
      Aprende.sonido.clic();
      pintar();
    });
    const herramientas = crear("div", "acciones");
    herramientas.appendChild(quitar);
    contenidoEl.append(linea, bandeja, herramientas);
    pintar();
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
        mensaje(`${item.cesta === 0 ? "✅ ¡Sí!" : "🚫 ¡Exacto, mejor no!"} ${item.por}`, "exito");
        Aprende.sonido.acierto();
      } else {
        fallo(tarjeta, `${item.cesta === 0 ? "¡Eso sí se puede!" : "¡Mejor no!"} ${item.por}`);
      }
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        k++;
        if (k < items.length) {
          mensaje("");
          mostrar();
        } else {
          tarjeta.textContent = "🛡️";
          cuenta.textContent = "";
          cestas.hidden = true;
          mensaje(paso.exito || "¡Listo!", "exito");
          mostrarSiguiente();
        }
      }, 2200);
    }

    contenidoEl.append(cuenta, tarjeta, cestas);
    mostrar();
  },

  escribe(paso) {
    const plan = leerPlan();
    const valores = {};
    const ficha = crear("div", "ficha-plan");

    paso.campos.forEach((c) => {
      const bloque = crear("div", "campo-plan");
      bloque.appendChild(crear("label", "etiqueta-campo", c.etiqueta));
      const guardado = plan[c.clave] || "";
      if (c.tipo === "elige") {
        const grupo = crear("div", "chips-elige");
        let libre = null;
        c.opciones.forEach((o) => {
          const b = boton(esc(o), "chip-elige");
          if (guardado === o) {
            b.classList.add("elegido");
            valores[c.clave] = o;
          }
          b.addEventListener("click", () => {
            valores[c.clave] = o;
            grupo.querySelectorAll(".chip-elige").forEach((x) => x.classList.toggle("elegido", x === b));
            if (libre) libre.value = "";
            Aprende.sonido.clic();
          });
          grupo.appendChild(b);
        });
        bloque.appendChild(grupo);
        if (c.libre) {
          libre = document.createElement("input");
          libre.className = "entrada-plan";
          libre.maxLength = 80;
          libre.placeholder = c.libre;
          if (guardado && !c.opciones.includes(guardado)) {
            libre.value = guardado;
            valores[c.clave] = guardado;
          }
          libre.addEventListener("input", () => {
            const v = libre.value.trim();
            if (!v) return;
            valores[c.clave] = v;
            grupo.querySelectorAll(".chip-elige").forEach((x) => x.classList.remove("elegido"));
          });
          bloque.appendChild(libre);
        }
      } else {
        const entrada = document.createElement("input");
        entrada.className = "entrada-plan";
        entrada.maxLength = c.max || 90;
        entrada.placeholder = c.placeholder || "";
        entrada.value = guardado;
        valores[c.clave] = guardado.trim();
        entrada.addEventListener("input", () => (valores[c.clave] = entrada.value.trim()));
        bloque.appendChild(entrada);
      }
      ficha.appendChild(bloque);
    });

    const aviso = crear("p", "pista-suave", "🛡️ No escribas tu nombre completo, tu escuela ni dónde vives.");
    const guardar = boton("📋 Guardar en mi plan", "boton ejecutar");
    guardar.addEventListener("click", () => {
      // Lo que falta no cuenta como error: solo se avisa.
      const falta = paso.campos.find((c) => (c.requerido || c.tipo === "elige") && !valores[c.clave]);
      if (falta) {
        mensaje(`Te falta: ${falta.etiqueta}`, "error");
        return;
      }
      guardarPlan(valores);
      mensaje(paso.exito || "¡Guardado en tu plan! 📋", "exito");
      Aprende.sonido.acierto();
      mostrarSiguiente();
    });
    const pie = crear("div", "acciones");
    pie.appendChild(guardar);
    contenidoEl.append(ficha, aviso, pie);
  },

  set(paso) {
    const estado = {};
    paso.controles.forEach((c) => (estado[c.clave] = c.opciones[0].v));
    let listo = false;

    const estudio = crear("div", "estudio");
    estudio.innerHTML = `<div class="celular">
        <div class="pantalla-cel">
          <span class="ventana"></span>
          <img class="actor" src="../img/capibara.svg" alt="Capi frente a la cámara" />
          <span class="ruido">♪ BRRRR ♪</span>
          <span class="rec">● REC</span>
        </div>
      </div>`;
    const celular = estudio.querySelector(".celular");
    const controles = crear("div", "controles-set");

    const pintar = () => {
      celular.className = "celular " + Object.entries(estado).map(([k, v]) => `${k}-${v}`).join(" ") + (listo ? " grabando" : "");
      controles.querySelectorAll(".chip-elige").forEach((b) => {
        b.classList.toggle("elegido", estado[b.dataset.clave] === b.dataset.v);
        b.disabled = listo;
      });
    };

    paso.controles.forEach((c) => {
      const grupo = crear("div", "grupo-set");
      grupo.appendChild(crear("span", "etiqueta-campo", c.etiqueta));
      const opciones = crear("div", "chips-elige");
      c.opciones.forEach((o) => {
        const b = boton(o.t, "chip-elige");
        b.dataset.clave = c.clave;
        b.dataset.v = o.v;
        b.addEventListener("click", () => {
          estado[c.clave] = o.v;
          Aprende.sonido.clic();
          pintar();
        });
        opciones.appendChild(b);
      });
      grupo.appendChild(opciones);
      controles.appendChild(grupo);
    });

    const grabar = boton("🎬 Grabar", "boton borrar");
    grabar.addEventListener("click", () => {
      if (listo) return;
      const malo = paso.controles.map((c) => c.opciones.find((o) => o.v === estado[c.clave])).find((o) => !o.ok);
      if (malo) {
        fallo(celular, malo.porque);
        return;
      }
      listo = true;
      grabar.disabled = true;
      pintar();
      mensaje("🎬 ¡Grabando! Buena luz, silencio y el celular firme y acostado. ¡Así se hace!", "exito");
      Aprende.sonido.victoria();
      Aprende.confeti(30);
      mostrarSiguiente();
    });

    const pie = crear("div", "acciones");
    pie.appendChild(grabar);
    contenidoEl.append(estudio, controles, pie);
    pintar();
  },

  editor(paso) {
    const buenos = paso.clips.filter((c) => !c.malo);
    let quedan = mezclar(paso.clips);
    const guia = crear("p", "pasos-info");
    const linea = crear("div", "linea-tiempo");
    const bandeja = crear("div", "bandeja-orden");
    const clipHTML = (c) => `<span class="emoji-clip">${c.emoji}</span><span>${c.t}</span>`;
    contenidoEl.append(guia, linea, bandeja);

    // Fase 1: cortar las tomas que sobran.
    const pintarCortar = () => {
      const malos = quedan.filter((c) => c.malo).length;
      guia.innerHTML = `✂️ Toca las tomas que <strong>sobran</strong> para cortarlas. Quedan ${malos}.`;
      linea.innerHTML = "";
      quedan.forEach((c) => {
        const b = boton(clipHTML(c), "clip");
        b.addEventListener("click", () => cortar(c, b));
        linea.appendChild(b);
      });
    };

    const cortar = (c, b) => {
      if (!c.malo) {
        fallo(b, `¡Esa toma la necesitas! «${c.t}» va en tu video.`);
        return;
      }
      b.classList.add("cortado");
      b.disabled = true;
      mensaje(`✂️ ${c.por}`, "exito");
      Aprende.sonido.acierto();
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        quedan = quedan.filter((x) => x !== c);
        if (quedan.some((x) => x.malo)) pintarCortar();
        else empezarOrden();
      }, 450);
    };

    // Fase 2: ordenar las tomas buenas en la línea de tiempo.
    let elegidos = [];
    let bloqueado = false;
    const pintarOrden = () => {
      linea.innerHTML = elegidos.length
        ? elegidos.map((i) => `<span class="clip colocado">${clipHTML(buenos[i])}</span>`).join("")
        : '<span class="ranura-vacia">Tu línea de tiempo: toca las tomas en orden…</span>';
      bandeja.querySelectorAll("button").forEach((b) => (b.disabled = bloqueado || elegidos.includes(Number(b.dataset.i))));
    };

    const empezarOrden = () => {
      mensaje("¡Cortaste todo lo que sobraba! ✂️ Ahora ordena las tomas.", "exito");
      guia.innerHTML = "🧩 Toca las tomas <strong>en orden</strong>: gancho, pasos y final.";
      desordenados(buenos.length).forEach((i) => {
        const b = boton(clipHTML(buenos[i]), "clip");
        b.dataset.i = i;
        b.addEventListener("click", () => {
          if (bloqueado || elegidos.includes(i)) return;
          elegidos.push(i);
          Aprende.sonido.clic();
          pintarOrden();
          if (elegidos.length === buenos.length) revisarOrden();
        });
        bandeja.appendChild(b);
      });
      pintarOrden();
    };

    const revisarOrden = () => {
      bloqueado = true;
      pintarOrden();
      const mal = elegidos.findIndex((v, k) => v !== k);
      const s = sesion;
      if (mal !== -1) {
        fallo(linea, `Casi… la toma número ${mal + 1} no va ahí. Recuerda: gancho, pasos y final.`);
        setTimeout(() => {
          if (s !== sesion) return;
          elegidos = [];
          bloqueado = false;
          pintarOrden();
        }, 1500);
        return;
      }
      bandeja.hidden = true;
      Aprende.sonido.acierto();
      mensaje("¡Video armado! 🎞️ Toca ▶ para verlo.", "exito");
      const ver = boton("▶ Ver mi video", "boton siguiente");
      ver.addEventListener("click", () => reproducir(ver));
      const pie = crear("div", "acciones");
      pie.appendChild(ver);
      contenidoEl.appendChild(pie);
    };

    // Fase 3: ver el video terminado.
    const reproducir = async (ver) => {
      ver.disabled = true;
      guia.innerHTML = "🎞️ Así quedó tu video:";
      const s = sesion;
      contenidoEl.querySelector(".pantalla-video")?.remove();
      const pantalla = crear("div", "pantalla-video");
      contenidoEl.insertBefore(pantalla, linea);
      for (let i = 0; i < buenos.length; i++) {
        pantalla.innerHTML = `<span class="emoji-escena">${buenos[i].emoji}</span><span class="texto-escena">${buenos[i].t}</span>
          <span class="barra-video"><span style="width:${((i + 1) / buenos.length) * 100}%"></span></span>`;
        linea.querySelectorAll(".clip").forEach((c, k) => c.classList.toggle("sonando", k === i));
        Aprende.sonido.paso();
        await new Promise((r) => setTimeout(r, 1300));
        if (s !== sesion) return;
      }
      pantalla.innerHTML = '<span class="emoji-escena">🎬</span><span class="texto-escena">¡FIN!</span>';
      linea.querySelectorAll(".clip").forEach((c) => c.classList.remove("sonando"));
      ver.disabled = false;
      ver.textContent = "▶ Verlo otra vez";
      mensaje("¡Quedó genial! Sin errores y en orden. 🎉", "exito");
      Aprende.confeti(30);
      mostrarSiguiente();
    };

    pintarCortar();
  },

  miniatura(paso) {
    const plan = leerPlan();
    const est = {
      fondo: plan.miniFondo || paso.fondos[0],
      imagen: plan.miniImagen || "",
      texto: plan.miniTexto || "",
      letra: "chica",
      quien: "",
    };
    let lista = false;

    const vista = crear("div", "vista-miniatura");
    const controles = crear("div", "controles-set");
    const pintar = () => {
      vista.innerHTML = miniaturaHTML({ miniFondo: est.fondo, miniImagen: est.imagen || "❔", miniTexto: est.texto || "TU TEXTO" }, est.letra);
      controles.querySelectorAll("[data-grupo]").forEach((b) => {
        b.classList.toggle("elegido", est[b.dataset.grupo] === b.dataset.v);
        b.disabled = lista;
      });
    };

    const grupo = (etiqueta, nombre, opciones, clase = "chip-elige") => {
      const g = crear("div", "grupo-set");
      g.appendChild(crear("span", "etiqueta-campo", etiqueta));
      const fila = crear("div", "chips-elige");
      opciones.forEach(({ v, html }) => {
        const b = boton(html, clase);
        b.dataset.grupo = nombre;
        b.dataset.v = v;
        b.addEventListener("click", () => {
          est[nombre] = v;
          Aprende.sonido.clic();
          pintar();
        });
        fila.appendChild(b);
      });
      g.appendChild(fila);
      controles.appendChild(g);
    };

    grupo("🎨 Fondo", "fondo", paso.fondos.map((f) => ({ v: f, html: `<span class="muestra-fondo" style="background:${f}"></span>` })), "chip-elige chip-color");
    grupo("🖼️ Imagen", "imagen", paso.imagenes.map((e) => ({ v: e, html: e })), "chip-elige chip-emoji");

    const gTexto = crear("div", "grupo-set");
    gTexto.appendChild(crear("span", "etiqueta-campo", "🔠 Texto (máximo 4 palabras)"));
    const entrada = document.createElement("input");
    entrada.className = "entrada-plan";
    entrada.maxLength = 32;
    entrada.placeholder = "Ej.: ¡VUELA LEJOS!";
    entrada.value = est.texto;
    entrada.addEventListener("input", () => {
      est.texto = entrada.value;
      pintar();
    });
    gTexto.appendChild(entrada);
    controles.appendChild(gTexto);

    grupo("🔡 Tamaño de letra", "letra", [{ v: "chica", html: "letra chiquita" }, { v: "grande", html: "LETRA GRANDE" }]);
    grupo("🧸 ¿Quién sale?", "quien", paso.quien.map((q) => ({ v: q.v, html: q.t })));

    const listaBtn = boton("✅ Lista", "boton ejecutar");
    listaBtn.addEventListener("click", () => {
      if (lista) return;
      const palabras = est.texto.trim().split(/\s+/).filter(Boolean).length;
      const quien = paso.quien.find((q) => q.v === est.quien);
      // Lo incompleto solo se avisa; lo que rompe una regla cuenta como error.
      if (!est.imagen) return mensaje("Elige una imagen que muestre de qué trata tu video.", "error");
      if (!palabras) return mensaje("Escribe un texto cortito para tu miniatura.", "error");
      if (!quien) return mensaje("Elige quién sale en la miniatura.", "error");
      if (palabras > 4) return fallo(vista, `Tiene ${palabras} palabras: en una miniatura van <strong>máximo 4</strong>, ¡para que se lea en un celular!`);
      if (est.letra !== "grande") return fallo(vista, "Con letra chiquita no se lee en la pantalla de un celular. ¡Ponla GRANDE!");
      if (!quien.ok) return fallo(vista, quien.porque);
      lista = true;
      listaBtn.disabled = true;
      entrada.disabled = true;
      pintar();
      guardarPlan({ miniFondo: est.fondo, miniImagen: est.imagen, miniTexto: est.texto.trim() });
      mensaje("¡Qué buena miniatura! 🖼️ Se lee desde lejos y muestra de qué trata. Quedó en tu plan.", "exito");
      Aprende.sonido.acierto();
      Aprende.confeti(25);
      mostrarSiguiente();
    });

    const pie = crear("div", "acciones");
    pie.appendChild(listaBtn);
    contenidoEl.append(vista, controles, pie);
    pintar();
  },

  subida(paso) {
    const plan = leerPlan();
    const ficha = crear("form", "ficha-subida");
    ficha.addEventListener("submit", (e) => e.preventDefault());
    ficha.innerHTML = `
      <div class="subida-encabezado">⬆️ Subir video · Canal de papá</div>
      <label class="etiqueta-campo" for="subida-titulo">🏷️ Título</label>
      <input id="subida-titulo" class="entrada-plan" maxlength="100" placeholder="El título de tu video" />
      <fieldset><legend class="etiqueta-campo">📝 Descripción: marca las frases que sí van</legend>
        ${paso.frases.map((f, i) => `<label class="opcion-ficha"><input type="checkbox" name="frase" value="${i}" /> ${f.t}</label>`).join("")}
      </fieldset>
      <fieldset><legend class="etiqueta-campo">🧒 ¿Es contenido para niños?</legend>
        ${paso.audiencia.map((a) => `<label class="opcion-ficha"><input type="radio" name="audiencia" value="${a.v}" /> ${a.t}</label>`).join("")}
      </fieldset>
      <fieldset><legend class="etiqueta-campo">👀 ¿Quién lo puede ver?</legend>
        ${paso.visibilidad.map((v) => `<label class="opcion-ficha"><input type="radio" name="visibilidad" value="${v.v}" /> <strong>${v.t}</strong> · ${v.detalle}</label>`).join("")}
      </fieldset>`;
    const titulo = ficha.querySelector("#subida-titulo");
    titulo.value = plan.titulo || "";

    let publicado = false;
    const publicar = boton("✅ Publicar", "boton ejecutar");
    publicar.addEventListener("click", () => {
      if (publicado) return;
      const marcadas = [...ficha.querySelectorAll('[name="frase"]:checked')].map((x) => paso.frases[Number(x.value)]);
      const audiencia = paso.audiencia.find((a) => a.v === ficha.querySelector('[name="audiencia"]:checked')?.value);
      const visibilidad = paso.visibilidad.find((v) => v.v === ficha.querySelector('[name="visibilidad"]:checked')?.value);
      if (!titulo.value.trim()) return mensaje("Escribe el título de tu video.", "error");
      const mala = marcadas.find((f) => f.malo);
      if (mala) return fallo(ficha, mala.porque);
      if (!marcadas.length) return mensaje("Marca al menos una frase para la descripción.", "error");
      if (!audiencia) return mensaje("Falta decir si es contenido para niños.", "error");
      if (!audiencia.ok) return fallo(ficha, audiencia.porque);
      if (!visibilidad) return mensaje("Falta elegir quién lo puede ver.", "error");
      if (!visibilidad.ok) return fallo(ficha, visibilidad.porque);

      publicado = true;
      publicar.disabled = true;
      ficha.querySelectorAll("input").forEach((x) => (x.disabled = true));
      guardarPlan({ titulo: titulo.value.trim() });
      subir(titulo.value.trim(), visibilidad);
    });

    // Una barra de "subiendo…" y la celebración.
    const subir = async (nombre, visibilidad) => {
      const s = sesion;
      const barra = crear("div", "barra-subida", '<span class="relleno-subida"></span><span class="texto-subida">Subiendo… 0 %</span>');
      contenidoEl.appendChild(barra);
      for (let p = 0; p <= 100; p += 5) {
        barra.querySelector(".relleno-subida").style.width = `${p}%`;
        barra.querySelector(".texto-subida").textContent = p < 100 ? `Subiendo… ${p} %` : "¡Subido! 100 %";
        await new Promise((r) => setTimeout(r, 90));
        if (s !== sesion) return;
      }
      mensaje(`🎉 ¡Publicado! «${esc(nombre)}» quedó en el canal de papá como <strong>${visibilidad.t}</strong>. (Esto fue una práctica: el de verdad lo suben juntos.)`, "exito");
      Aprende.sonido.victoria();
      Aprende.confeti(50);
      mostrarSiguiente();
    };

    const pie = crear("div", "acciones");
    pie.appendChild(publicar);
    contenidoEl.append(ficha, pie);
  },

  plan() {
    contenidoEl.innerHTML = planHTML(leerPlan());
    const imprimir = boton("🖨️ Imprimir mi plan", "boton siguiente");
    imprimir.addEventListener("click", () => window.print());
    const pie = crear("div", "acciones");
    pie.appendChild(imprimir);
    contenidoEl.appendChild(pie);
    Aprende.confeti(40);
    mostrarSiguiente();
  },
};

// ================= Fin de la unidad =================

function terminarUnidad() {
  const u = UNIDADES_VIDEO[unidadIdx];
  let estrellas = 1;
  if (errores === 0) estrellas = 3;
  else if (errores <= 2) estrellas = 2;
  mostrarPantalla("fin");
  const textos = {
    3: "¡Perfecto! Eres toda una creadora.",
    2: "¡Muy bien! Unidad completa.",
    1: "¡Unidad completa! Repítela para ganar más estrellas.",
  };
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = textos[estrellas];
  document.getElementById("fin-resumen").textContent =
    errores === 0 ? `Terminaste «${u.titulo}» sin errores.` : `Terminaste «${u.titulo}» con ${errores} ${errores === 1 ? "error" : "errores"}.`;
  Aprende.finDePartida("videos", u.id, estrellas);
  document.getElementById("btn-siguiente-unidad").hidden = unidadIdx === UNIDADES_VIDEO.length - 1;
  pintarMapa();
}

function verPlan() {
  document.getElementById("contenido-plan").innerHTML = planHTML(leerPlan());
  mostrarPantalla("plan");
}

document.getElementById("btn-mapa").addEventListener("click", () => {
  pintarMapa();
  mostrarPantalla("mapa");
});
document.getElementById("btn-volver-mapa").addEventListener("click", () => {
  pintarMapa();
  mostrarPantalla("mapa");
});
document.getElementById("btn-siguiente-unidad").addEventListener("click", () => abrirUnidad(unidadIdx + 1));
botonPlan.addEventListener("click", verPlan);
document.getElementById("btn-plan-volver").addEventListener("click", () => {
  pintarMapa();
  mostrarPantalla("mapa");
});
document.getElementById("btn-plan-imprimir").addEventListener("click", () => window.print());

pintarMapa();
mostrarPantalla("mapa");
