// Finales básicos — Aprende con Ana Isabella
// La compu defiende al rey negro y Capi da pistas en los finales del
// capítulo "Finales" (mate con dama, mate con torre y la regla del
// cuadrado). Funciones puras: se prueban desde Node (herramientas/).
//
// La pista usa la idea de "la caja": contar cuántas casillas le quedan al
// rey negro para caminar sin que lo ataquen, y elegir la jugada que más se
// las achica, sin ahogarlo y sin dejar piezas sueltas.

const Finales = (() => {
  const A = typeof Ajedrez !== "undefined" ? Ajedrez : require("./ajedrez-motor.js");
  const VALOR = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
  const VECINOS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  const fila = (i) => Math.floor(i / 8);
  const col = (i) => i % 8;
  const distancia = (a, b) => Math.max(Math.abs(fila(a) - fila(b)), Math.abs(col(a) - col(b)));
  const solo = (m) => !m.promocion || A.tipoDe(m.promocion) === "Q";

  // Casillas a las que el rey negro podría llegar caminando sin pisar casillas
  // atacadas por las blancas: el tamaño de su "caja".
  function caja(p) {
    const rey = p.tablero.indexOf("k");
    if (rey === -1) return 0;
    const sinRey = p.tablero.slice();
    sinRey[rey] = null; // el rey no se tapa a sí mismo los ataques
    const vacio = { ...p, tablero: sinRey };
    const visto = new Set([rey]);
    const cola = [rey];
    while (cola.length) {
      const i = cola.shift();
      for (const [df, dc] of VECINOS) {
        const f = fila(i) + df;
        const c = col(i) + dc;
        if (f < 0 || f > 7 || c < 0 || c > 7) continue;
        const j = f * 8 + c;
        if (visto.has(j)) continue;
        const pieza = p.tablero[j];
        if (pieza && A.colorDe(pieza) === "b") continue;
        if (A.atacada(vacio, j, "w")) continue;
        visto.add(j);
        cola.push(j);
      }
    }
    return visto.size;
  }

  // ¿Alguna pieza blanca (no el rey) quedó al alcance del rey negro sin quien la cuide?
  function piezaSuelta(p) {
    return A.todosLegales(p, "b").some((m) => m.captura && A.tipoDe(m.captura) !== "K");
  }

  // Jugada de la compu (negras). Si puede comer algo, come. Si las blancas
  // quieren coronar, el rey corre hacia el peón. Si no, busca la jugada que
  // le deje más espacio, lejos de las orillas.
  function defensa(p) {
    const jugadas = A.todosLegales(p, "b").filter(solo);
    if (!jugadas.length) return null;
    const captura = jugadas
      .filter((m) => m.captura)
      .sort((a, b) => VALOR[A.tipoDe(b.captura)] - VALOR[A.tipoDe(a.captura)])[0];
    if (captura) return captura;
    const peon = p.tablero.indexOf("P");
    const reyBlanco = p.tablero.indexOf("K");
    const puntaje = (m) => {
      const n = A.mover(p, m);
      const rey = m.hasta;
      if (peon !== -1) {
        // Hacia la casilla donde corona el peón (y hacia el peón).
        const meta = col(peon);
        return -distancia(rey, meta) * 3 - distancia(rey, peon);
      }
      const centro = Math.abs(3.5 - fila(rey)) + Math.abs(3.5 - col(rey));
      return caja({ ...n, turno: "w" }) * 2 - centro + distancia(rey, reyBlanco) * 0.3;
    };
    let mejor = null;
    let mejorPuntos = -Infinity;
    for (const m of jugadas) {
      const v = puntaje(m) + Math.random() * 0.01;
      if (v > mejorPuntos) {
        mejorPuntos = v;
        mejor = m;
      }
    }
    return mejor;
  }

  // Qué tan bien va el final para las blancas (le toca a "turno").
  function evaluar(p, turno) {
    const jugadas = A.todosLegales(p, turno).filter(solo);
    if (!jugadas.length) {
      if (!A.enJaque(p, turno)) return -100000; // ahogado: empate, lo peor
      return turno === "b" ? 100000 : -100000;
    }
    if (p.tablero.every((x) => !x || A.tipoDe(x) === "K")) return -100000; // se comieron todo
    const reyNegro = p.tablero.indexOf("k");
    const reyBlanco = p.tablero.indexOf("K");
    const orilla = Math.min(fila(reyNegro), 7 - fila(reyNegro), col(reyNegro), 7 - col(reyNegro));
    return -caja(p) * 10 - distancia(reyBlanco, reyNegro) * 3 - orilla * 4;
  }

  // Busca "prof" jugadas adelante: las blancas quieren subir el puntaje y
  // las negras bajarlo. Un mate más rápido vale un poquito más.
  function buscar(p, turno, prof) {
    const jugadas = A.todosLegales(p, turno).filter(solo);
    if (prof === 0 || !jugadas.length) return evaluar(p, turno);
    let mejor = turno === "w" ? -Infinity : Infinity;
    for (const m of jugadas) {
      const n = A.mover(p, m);
      // Si las blancas dejan una pieza suelta, la compu se la come.
      if (turno === "w" && piezaSuelta(n)) {
        mejor = Math.max(mejor, -100000);
        continue;
      }
      let v = buscar(n, turno === "w" ? "b" : "w", prof - 1);
      if (Math.abs(v) >= 100000) v += turno === "w" ? prof : -prof;
      if (turno === "w" ? v > mejor : v < mejor) mejor = v;
    }
    return mejor;
  }

  // Para coronar: empujar el peón si no se lo comen; si no, acercar el rey.
  function pistaCorona(p) {
    let mejor = null;
    let mejorPuntos = -Infinity;
    for (const m of A.todosLegales(p, "w").filter(solo)) {
      const n = A.mover(p, m);
      if (piezaSuelta(n)) continue;
      const peon = n.tablero.indexOf("P");
      const v = (m.promocion ? 1000 : 0) + (peon === -1 ? 0 : (7 - fila(peon)) * 10) - distancia(n.tablero.indexOf("K"), peon === -1 ? m.hasta : peon);
      if (v > mejorPuntos) {
        mejorPuntos = v;
        mejor = m;
      }
    }
    return mejor;
  }

  // Pista para las blancas. objetivo: "mate" (dama o torre) o "corona".
  function pista(p, objetivo = "mate") {
    if (objetivo === "corona") return pistaCorona(p);
    let mejor = null;
    let mejorPuntos = -Infinity;
    for (const m of A.todosLegales(p, "w").filter(solo)) {
      const n = A.mover(p, m);
      let v;
      if (A.situacion(n, "b") === "mate") v = 1e9;
      else if (piezaSuelta(n)) v = -1e9;
      else v = buscar(n, "b", 2) + Math.random() * 0.01;
      if (v > mejorPuntos) {
        mejorPuntos = v;
        mejor = m;
      }
    }
    return mejor;
  }

  return { caja, defensa, pista, piezaSuelta, distancia };
})();

if (typeof module !== "undefined") module.exports = Finales;
