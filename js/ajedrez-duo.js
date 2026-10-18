// Jugar con papá — Aprende con Ana Isabella
// Partidas entre dos personas, con Capi de árbitra:
//  · En el mismo aparato: se turnan; el tablero se puede dar vuelta.
//  · En línea: uno crea la partida y le dicta el código (4 cifras) al otro.
//    Cada aparato guarda su clave secreta en el navegador y le pregunta al
//    servidor (functions/api/partida/) por las jugadas nuevas cada segundo y
//    medio. El servidor solo guarda las jugadas en orden y revisa los
//    turnos; las reglas las revisa el tablero (ajedrez-motor.js).
// Usa el tablero y las funciones de js/ajedrez.js (se carga después).

const CLAVE_EN_LINEA = "aprende:partida-en-linea";
const ESPERA_SONDEO = 1500;
const COLOR = { w: "blancas", b: "negras" };

let duo = null; // { modo: "local" | "linea", ... }

// Una jugada como texto ("e2e4", "e7e8q") y de vuelta.
const textoJugada = (m) => claveMovimiento(m) + (m.promocion ? "q" : "");
function jugadaDeTexto(p, texto) {
  const desde = A.indiceCasilla(texto.slice(0, 2));
  const hasta = A.indiceCasilla(texto.slice(2, 4));
  return A.legales(p, desde).find((m) => m.hasta === hasta && (!m.promocion || A.tipoDe(m.promocion) === "Q"));
}

// Capi árbitra comenta cada jugada.
function arbitra(antes, m, despues) {
  const quien = A.colorDe(m.pieza) === "w" ? "las blancas" : "las negras";
  const rival = A.colorDe(m.pieza) === "w" ? "b" : "w";
  const sit = A.situacion(despues, rival);
  if (sit === "mate") return CapiRival.decir("feliz", `¡Jaque mate! 🏆 ¡Ganan ${quien}!`, "baile", 0);
  if (sit === "ahogado") return CapiRival.decir("sorprendida", "¡Ahogado! Es empate 🤝", "", 0);
  if (sit === "tablas") return CapiRival.decir("sorprendida", "¡Solo quedan los reyes! Empate 🤝", "", 0);
  if (m.captura) {
    const grande = ["Q", "R"].includes(A.tipoDe(m.captura));
    return CapiRival.decir(grande ? "llorona" : "sorprendida", `¡Uy! ${quien[0].toUpperCase() + quien.slice(1)} se comieron ${INFO_PIEZAS[A.tipoDe(m.captura)].articulo} 😮`, grande ? "llanto" : "salto-sorpresa");
  }
  if (sit === "jaque") return CapiRival.decir("mareada", `¡Jaque al rey de ${COLOR[rival]}! 😵`, "mareo");
  CapiRival.decir("normal", `Les toca a las ${COLOR[rival]} ${rival === "w" ? "⚪" : "⚫"}`, "", 0);
}

// Termina la partida (mate, ahogado o rendición) con un mensaje.
function finDuo(texto) {
  alMover = null;
  mensaje(texto, "exito");
  Aprende.sonido.victoria();
  Aprende.confeti(50);
}

// El panel debajo del tablero: el turno, el pedido de deshacer (en línea) y
// las fichas que se comió cada uno.
function panelDuo() {
  panelEl.innerHTML = `
    <p class="estado-partida" id="estado-duo"></p>
    <div id="pedido-duo"></div>
    <p class="capturadas">⚪ Las blancas comieron: <span id="comidas-w"></span></p>
    <p class="capturadas">⚫ Las negras comieron: <span id="comidas-b"></span></p>`;
}

// Solo reescribe si cambió (el sondeo lo llama cada segundo y medio).
function estadoDuo(texto) {
  const el = document.getElementById("estado-duo");
  if (!el) panelEl.innerHTML = `<p class="estado-partida">${texto}</p>`;
  else if (el.innerHTML !== texto) el.innerHTML = texto;
}

const VALOR_PIEZA = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };

// Las fichas comidas por cada color (de las más valiosas a las menos) y
// cuántos puntos va ganando el que va adelante.
function pintarComidas(movs) {
  const comio = { w: [], b: [] };
  movs.forEach((m) => m.captura && comio[A.colorDe(m.pieza)].push(m.captura));
  const puntos = (l) => l.reduce((t, x) => t + VALOR_PIEZA[A.tipoDe(x)], 0);
  const ventaja = puntos(comio.w) - puntos(comio.b);
  ["w", "b"].forEach((c) => {
    const el = document.getElementById(`comidas-${c}`);
    if (!el) return;
    const lista = comio[c].sort((x, y) => VALOR_PIEZA[A.tipoDe(y)] - VALOR_PIEZA[A.tipoDe(x)]);
    const extra = (c === "w" ? ventaja : -ventaja) > 0 ? ` <span class="ventaja">+${Math.abs(ventaja)}</span>` : "";
    const html = lista.length ? piezasHTML(lista) + extra : '<span class="ninguna">ninguna todavía</span>';
    if (el.innerHTML !== html) el.innerHTML = html;
  });
}

// Las jugadas en texto, ya convertidas (para contar las comidas).
function movsDeTextos(textos) {
  let p = A.desdeFEN(A.INICIAL);
  const movs = [];
  for (const t of textos) {
    const m = jugadaDeTexto(p, t);
    if (!m) break;
    movs.push(m);
    p = A.mover(p, m);
  }
  return movs;
}

// ================= En el mismo aparato =================

function abrirDuoLocal() {
  mostrarPantalla(pantallaLeccion);
  tituloEl.textContent = "👨‍👧 Partida en este aparato";
  puntosPasosEl.innerHTML = "";
  modoSuelto = null;
  prepararPaso({ tipo: "nada", fen: A.INICIAL, texto: "Juegan dos personas en el mismo aparato: se turnan para mover. Empiezan las <strong>blancas</strong>. Si quieren, den vuelta el tablero en cada turno 🔄." });
  duo = { modo: "local", historial: [], movs: [] };
  panelDuo();
  CapiRival.mostrar(null, "¡Hoy yo soy la árbitra! Empiezan las blancas 🍊");
  const turnoLocal = () => {
    colorJugador = pos.turno;
    const sit = A.situacion(pos, pos.turno);
    if (sit === "mate") estadoDuo(`¡Jaque mate! Ganan las ${COLOR[pos.turno === "w" ? "b" : "w"]} 🏆`);
    else if (sit === "ahogado" || sit === "tablas") estadoDuo("Empate 🤝");
    else estadoDuo(`Turno de las <strong>${COLOR[pos.turno]}</strong> ${pos.turno === "w" ? "⚪" : "⚫"}${sit === "jaque" ? " · ⚠️ ¡en jaque!" : ""}`);
  };
  alMover = (m) => {
    const antes = pos;
    duo.historial.push(pos);
    duo.movs.push(m);
    aplicar(m);
    pintarComidas(duo.movs);
    arbitra(antes, m, pos);
    turnoLocal();
    const sit = A.situacion(pos, pos.turno);
    if (sit === "mate") finDuo(`¡Jaque mate! 🏆 Ganan las ${COLOR[A.colorDe(m.pieza)]}.`);
    else if (sit === "ahogado" || sit === "tablas") finDuo("¡Empate! 🤝");
  };
  agregarBoton("🔄 Dar vuelta el tablero", "siguiente", () => {
    volteado = !volteado;
    pintarTablero();
  });
  agregarBoton("↩ Deshacer", "quitar", () => {
    if (!duo.historial.length) return;
    pos = duo.historial.pop();
    duo.movs.pop();
    pintarComidas(duo.movs);
    ultimo = null;
    seleccion = null;
    destinos = [];
    mensaje("");
    if (!alMover) alMover = duo.alMover;
    turnoLocal();
    pintarTablero();
    CapiRival.decir("pensando", "¿Eh? ¿Volvimos atrás? ⏪");
  });
  agregarBoton("Nueva partida", "borrar", abrirDuoLocal);
  duo.alMover = alMover;
  pintarComidas(duo.movs);
  turnoLocal();
  pintarTablero();
}

// ================= En línea =================

function leerEnLinea() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_EN_LINEA)) || null;
  } catch {
    return null;
  }
}

function guardarEnLinea(datos) {
  try {
    if (datos) localStorage.setItem(CLAVE_EN_LINEA, JSON.stringify(datos));
    else localStorage.removeItem(CLAVE_EN_LINEA);
  } catch {
    // Sin almacenamiento: la partida sigue, pero no se recupera al recargar.
  }
}

async function pedir(url, cuerpo) {
  const r = await fetch(url, cuerpo ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cuerpo) } : { cache: "no-store" });
  let datos = {};
  try {
    datos = await r.json();
  } catch {
    datos = { error: "El servidor no respondió bien." };
  }
  return { ok: r.ok, estado: r.status, datos };
}

// Menú: crear una partida o entrar con un código.
function abrirEnLinea() {
  mostrarPantalla(pantallaLeccion);
  tituloEl.textContent = "🌐 Jugar en línea";
  puntosPasosEl.innerHTML = "";
  modoSuelto = null;
  prepararPaso({ tipo: "nada", texto: "Cada uno juega en su aparato. Uno <strong>crea</strong> la partida y le dice el <strong>código</strong> al otro, que lo escribe para <strong>entrar</strong>." });
  duo = null;
  const guardada = leerEnLinea();
  panelEl.innerHTML = `
    <div class="menu-en-linea">
      ${guardada ? `<button class="boton ejecutar" data-a="volver">↩ Volver a mi partida ${guardada.codigo}</button>` : ""}
      <div class="caja-en-linea">
        <strong>Crear una partida</strong>
        <div class="botones-dia">
          <button class="boton siguiente" data-a="crear-w">⚪ Juego con blancas</button>
          <button class="boton siguiente" data-a="crear-b">⚫ Juego con negras</button>
        </div>
      </div>
      <div class="caja-en-linea">
        <strong>Entrar con un código</strong>
        <div class="fila-codigo">
          <input id="codigo-partida" class="entrada-codigo" inputmode="numeric" maxlength="4" placeholder="1234" aria-label="Código de la partida" />
          <button class="boton ejecutar" data-a="unirse">Entrar</button>
        </div>
      </div>
    </div>`;
  CapiRival.mostrar(null, "¡Una partida entre ustedes! Yo seré la árbitra 🍊");
  const enLinea = (a, f) => panelEl.querySelector(`[data-a="${a}"]`)?.addEventListener("click", f);
  enLinea("volver", () => entrarAPartida(guardada));
  enLinea("crear-w", () => crearPartida("w"));
  enLinea("crear-b", () => crearPartida("b"));
  enLinea("unirse", unirse);
  panelEl.querySelector("#codigo-partida").addEventListener("keydown", (e) => e.key === "Enter" && unirse());
}

async function crearPartida(color) {
  mensaje("Creando la partida…");
  const r = await pedir("/api/partida", { color });
  if (!r.ok) return mensaje(r.datos.error || "No se pudo crear la partida. ¿Hay internet?", "error");
  guardarEnLinea({ codigo: r.datos.codigo, color: r.datos.color, clave: r.datos.clave });
  entrarAPartida(leerEnLinea());
}

async function unirse() {
  const codigo = (panelEl.querySelector("#codigo-partida").value || "").trim();
  if (!/^\d{4}$/.test(codigo)) return mensaje("El código tiene 4 números.", "error");
  const guardada = leerEnLinea();
  if (guardada && guardada.codigo === codigo) return entrarAPartida(guardada);
  mensaje("Entrando…");
  const r = await pedir(`/api/partida/${codigo}`, { tipo: "unirse" });
  if (!r.ok) return mensaje(r.datos.error || "No pude entrar. ¿Hay internet?", "error");
  guardarEnLinea({ codigo, color: r.datos.color, clave: r.datos.clave });
  entrarAPartida(leerEnLinea());
}

// La partida en sí: el tablero, los turnos y la conversación con el servidor.
function entrarAPartida(datos) {
  mostrarPantalla(pantallaLeccion);
  tituloEl.textContent = `🌐 Partida ${datos.codigo}`;
  puntosPasosEl.innerHTML = "";
  modoSuelto = null;
  prepararPaso({ tipo: "nada", fen: A.INICIAL, texto: `Juegas con las <strong>${COLOR[datos.color]}</strong>. Código de la partida: <strong class="codigo-grande">${datos.codigo}</strong>` });
  duo = { modo: "linea", ...datos, jugadas: [], estado: "esperando", enviando: false, deshacer: null };
  panelDuo();
  volteado = datos.color === "b";
  colorJugador = datos.color;
  CapiRival.mostrar(null, "¡Que gane la mejor! 🍊");
  const s = sesion;

  agregarBoton("🏳️ Rendirme", "quitar", async () => {
    if (duo.estado !== "jugando") return;
    if (!confirm("¿Seguro que te rindes?")) return;
    await pedir(`/api/partida/${duo.codigo}`, { tipo: "rendirse", clave: duo.clave });
    sondear();
  });
  const botonDeshacer = agregarBoton("↩ Pedir deshacer", "pista", async () => {
    if (!puedePedir()) return;
    duo.deshacer = duo.color;
    mostrarEstado();
    const r = await pedir(`/api/partida/${duo.codigo}`, { tipo: "pedir-deshacer", clave: duo.clave });
    if (!r.ok) {
      duo.deshacer = r.datos.deshacer || null;
      mensaje(r.datos.error || "No se pudo pedir. ¿Hay internet?", "error");
    }
    mostrarEstado();
  });
  // Se puede pedir si ya jugaste alguna vez y no hay otro pedido en curso.
  const puedePedir = () => {
    const mias = duo.color === "w" ? Math.ceil(duo.jugadas.length / 2) : Math.floor(duo.jugadas.length / 2);
    return duo.estado === "jugando" && !duo.terminada && !duo.enviando && !duo.deshacer && mias > 0;
  };
  const responder = async (acepta) => {
    const pedidoEl = document.getElementById("pedido-duo");
    if (pedidoEl) pedidoEl.innerHTML = "";
    const r = await pedir(`/api/partida/${duo.codigo}`, { tipo: "responder-deshacer", clave: duo.clave, acepta });
    if (s !== sesion) return;
    if (r.datos.jugadas) {
      duo.deshacer = r.datos.deshacer;
      aplicarLista(r.datos.jugadas);
    }
    if (!r.ok) mensaje(r.datos.error || "No se pudo contestar. ¿Hay internet?", "error");
    else if (acepta) CapiRival.decir("pensando", "¡Volvimos atrás! ⏪ Piensen bien la próxima", "", 2000);
    mostrarEstado();
  };
  // El cuadrito del pedido: preguntas al rival o «esperando respuesta».
  const pintarPedido = () => {
    const el = document.getElementById("pedido-duo");
    if (!el) return;
    const tipo = !duo.deshacer || duo.terminada ? "" : duo.deshacer === duo.color ? "espero" : "pregunta";
    if (el.dataset.tipo === tipo) return;
    el.dataset.tipo = tipo;
    if (tipo === "espero") el.innerHTML = '<p class="pedido-deshacer">⏳ Le pediste a tu rival deshacer tu última jugada…</p>';
    else if (tipo === "pregunta") {
      el.innerHTML = `<div class="pedido-deshacer">
          <p>↩ Tu rival quiere <strong>deshacer</strong> su última jugada. ¿Lo dejas?</p>
          <div class="botones-dia">
            <button class="boton ejecutar" data-r="si">Sí, que la deshaga</button>
            <button class="boton quitar" data-r="no">No</button>
          </div>
        </div>`;
      el.querySelector('[data-r="si"]').addEventListener("click", () => responder(true));
      el.querySelector('[data-r="no"]').addEventListener("click", () => responder(false));
      Aprende.sonido.boing?.();
    } else el.innerHTML = "";
  };

  agregarBoton("Salir de la partida", "borrar", () => {
    guardarEnLinea(null);
    volverAlMapa();
  });

  // Rehace el tablero desde el principio con la lista de jugadas.
  const aplicarLista = (lista) => {
    const nuevas = lista.slice(duo.jugadas.length);
    if (lista.length < duo.jugadas.length || lista.slice(0, duo.jugadas.length).join(" ") !== duo.jugadas.join(" ")) {
      // Algo no coincide: se rearma todo.
      pos = A.desdeFEN(A.INICIAL);
      duo.jugadas = [];
      lista.forEach((t) => {
        const m = jugadaDeTexto(pos, t);
        if (m) pos = A.mover(pos, m);
        duo.jugadas.push(t);
      });
      ultimo = null;
      seleccion = null;
      destinos = [];
      pintarTablero();
      pintarComidas(movsDeTextos(duo.jugadas));
      return;
    }
    nuevas.forEach((t) => {
      const m = jugadaDeTexto(pos, t);
      if (!m) return;
      const antes = pos;
      aplicar(m);
      duo.jugadas.push(t);
      arbitra(antes, m, pos);
    });
    if (nuevas.length) pintarComidas(movsDeTextos(duo.jugadas));
  };

  const mostrarEstado = () => {
    pintarPedido();
    botonDeshacer.disabled = !puedePedir();
    const sit = A.situacion(pos, pos.turno);
    if (duo.estado === "esperando") {
      estadoDuo(`⏳ Esperando a tu rival… Dile este código: <strong class="codigo-grande">${duo.codigo}</strong>`);
      return;
    }
    if (duo.estado.startsWith("rinde-")) {
      const rindio = duo.estado.slice(6);
      estadoDuo(rindio === duo.color ? "Te rendiste 🏳️" : "¡Tu rival se rindió! 🏆");
      if (alMover || !duo.terminada) finDuo(rindio === duo.color ? "Te rendiste. ¡La próxima la ganas!" : "¡Ganaste! Tu rival se rindió 🏆");
      duo.terminada = true;
      CapiRival.decir(rindio === duo.color ? "sorprendida" : "feliz", rindio === duo.color ? "¡Bandera blanca! 🏳️" : "¡Ganaste! 🏆", "", 0);
      return;
    }
    if (sit === "mate") {
      const gane = pos.turno !== duo.color;
      estadoDuo(gane ? "¡Jaque mate! Ganaste 🏆" : "Jaque mate… ganó tu rival");
      if (!duo.terminada) finDuo(gane ? "¡JAQUE MATE! 🏆 ¡Ganaste!" : "Jaque mate… ¡qué buena partida! Prueben otra.");
      duo.terminada = true;
      return;
    }
    if (sit === "ahogado" || sit === "tablas") {
      estadoDuo("Empate 🤝");
      if (!duo.terminada) finDuo("¡Empate! 🤝");
      duo.terminada = true;
      return;
    }
    const miTurno = pos.turno === duo.color;
    estadoDuo(miTurno ? `Te toca ${duo.color === "w" ? "⚪" : "⚫"}${sit === "jaque" ? " · ⚠️ ¡Estás en jaque!" : ""}` : "⏳ Esperando la jugada de tu rival…");
    alMover = miTurno && !duo.enviando ? jugarEnLinea : null;
  };

  const jugarEnLinea = async (m) => {
    const texto = textoJugada(m);
    const n = duo.jugadas.length;
    mensaje("");
    const antes = pos;
    aplicar(m);
    duo.jugadas.push(texto);
    duo.enviando = true;
    duo.deshacer = null; // jugar cancela el pedido pendiente
    pintarComidas(movsDeTextos(duo.jugadas));
    arbitra(antes, m, pos);
    mostrarEstado();
    const r = await pedir(`/api/partida/${duo.codigo}`, { tipo: "jugada", clave: duo.clave, jugada: texto, n });
    duo.enviando = false;
    if (s !== sesion) return;
    if (!r.ok) {
      mensaje(r.datos.error || "No se pudo mandar la jugada. Reviso el tablero…", "error");
      if (r.datos.jugadas) {
        duo.jugadas = ["x"]; // fuerza a rearmar el tablero
        aplicarLista(r.datos.jugadas);
      }
    }
    mostrarEstado();
  };

  // Pregunta por las novedades cada segundo y medio, mientras esté en esta pantalla.
  const sondear = async () => {
    if (s !== sesion) return;
    const r = await pedir(`/api/partida/${duo.codigo}`);
    if (s !== sesion) return;
    if (r.estado === 404) {
      guardarEnLinea(null);
      estadoDuo("Esa partida ya no existe (las partidas se borran a los 2 días).");
      alMover = null;
      return;
    }
    if (r.ok && !duo.enviando) {
      const antes = duo.estado;
      duo.estado = r.datos.estado;
      if (antes === "esperando" && duo.estado === "jugando") CapiRival.decir("feliz", "¡Ya llegó tu rival! ¡A jugar! 🎉", "baile");
      // Mi pedido de deshacer se contestó: si la lista se acortó fue un sí.
      if (duo.deshacer === duo.color && !r.datos.deshacer) {
        if (r.datos.jugadas.length < duo.jugadas.length) CapiRival.decir("feliz", "¡Tu rival te dejó deshacer! ⏪ Vuelve a pensarla", "salto-sorpresa", 2200);
        else if (r.datos.jugadas.length === duo.jugadas.length) {
          mensaje("Tu rival dijo que no 🙅 La jugada se queda.", "error");
          CapiRival.decir("sorprendida", "¡Dijo que no! 🙅 ¡A seguir!", "", 2000);
        }
      }
      duo.deshacer = r.datos.deshacer;
      aplicarLista(r.datos.jugadas);
      mostrarEstado();
    }
    if (!duo.terminada) setTimeout(sondear, ESPERA_SONDEO);
  };

  pintarTablero();
  pintarComidas([]);
  mostrarEstado();
  sondear();
}
