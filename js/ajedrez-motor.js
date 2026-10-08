// Motor de reglas de ajedrez — Aprende con Ana Isabella
// Tablero de 64 casillas: índice = fila * 8 + columna. La fila 0 es la fila 8
// del tablero real (arriba, lado de las negras) y la columna 0 es la "a".
// Piezas: mayúsculas = blancas (K Q R B N P), minúsculas = negras, null = vacía.
// Las posiciones no se modifican: mover() devuelve una posición nueva.

const Ajedrez = (() => {
  const COLUMNAS = "abcdefgh";

  const nombreCasilla = (i) => COLUMNAS[i % 8] + (8 - Math.floor(i / 8));
  const indiceCasilla = (nombre) => (8 - Number(nombre[1])) * 8 + COLUMNAS.indexOf(nombre[0]);
  const colorDe = (p) => (p ? (p === p.toUpperCase() ? "w" : "b") : null);
  const tipoDe = (p) => (p ? p.toUpperCase() : null);
  const rivalDe = (color) => (color === "w" ? "b" : "w");
  const dentro = (f, c) => f >= 0 && f < 8 && c >= 0 && c < 8;

  const SALTOS_CABALLO = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  const DIAGONALES = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  const RECTAS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const DIRECCIONES = {
    N: SALTOS_CABALLO,
    B: DIAGONALES,
    R: RECTAS,
    Q: [...DIAGONALES, ...RECTAS],
    K: [...DIAGONALES, ...RECTAS],
  };

  // Lee una posición en notación FEN (la estándar del ajedrez).
  function desdeFEN(fen) {
    const [colocacion, turno = "w", enroques = "-", alPaso = "-"] = fen.trim().split(/\s+/);
    const tablero = [];
    for (const fila of colocacion.split("/")) {
      for (const c of fila) {
        if (/\d/.test(c)) for (let k = 0; k < Number(c); k++) tablero.push(null);
        else tablero.push(c);
      }
    }
    return {
      tablero,
      turno,
      enroques: {
        K: enroques.includes("K"),
        Q: enroques.includes("Q"),
        k: enroques.includes("k"),
        q: enroques.includes("q"),
      },
      alPaso: alPaso === "-" ? null : indiceCasilla(alPaso),
    };
  }

  // ¿La casilla i está atacada por alguna pieza del color dado?
  function atacada(pos, i, porColor) {
    const t = pos.tablero;
    const f = Math.floor(i / 8);
    const c = i % 8;
    const es = (ff, cc, tipos) => {
      const p = t[ff * 8 + cc];
      return p && colorDe(p) === porColor && tipos.includes(tipoDe(p));
    };
    // Un peón blanco ataca hacia arriba: está una fila más abajo que la casilla.
    const filaPeon = porColor === "w" ? f + 1 : f - 1;
    for (const dc of [-1, 1]) {
      if (dentro(filaPeon, c + dc) && es(filaPeon, c + dc, "P")) return true;
    }
    for (const [df, dc] of SALTOS_CABALLO) {
      if (dentro(f + df, c + dc) && es(f + df, c + dc, "N")) return true;
    }
    for (const [df, dc] of DIRECCIONES.K) {
      if (dentro(f + df, c + dc) && es(f + df, c + dc, "K")) return true;
    }
    for (const [tipos, dirs] of [["BQ", DIAGONALES], ["RQ", RECTAS]]) {
      for (const [df, dc] of dirs) {
        let ff = f + df;
        let cc = c + dc;
        while (dentro(ff, cc)) {
          if (t[ff * 8 + cc]) {
            if (es(ff, cc, tipos)) return true;
            break;
          }
          ff += df;
          cc += dc;
        }
      }
    }
    return false;
  }

  function reyDe(pos, color) {
    return pos.tablero.indexOf(color === "w" ? "K" : "k");
  }

  // Sin rey en el tablero (como en los ejercicios) nunca hay jaque.
  function enJaque(pos, color) {
    const rey = reyDe(pos, color);
    return rey !== -1 && atacada(pos, rey, rivalDe(color));
  }

  // Movimientos de una pieza sin revisar si dejan al propio rey en jaque.
  function pseudoLegales(pos, i) {
    const t = pos.tablero;
    const p = t[i];
    if (!p) return [];
    const color = colorDe(p);
    const tipo = tipoDe(p);
    const rival = rivalDe(color);
    const f = Math.floor(i / 8);
    const c = i % 8;
    const movs = [];
    const agregar = (hasta, extra = {}) => movs.push({ desde: i, hasta, pieza: p, captura: t[hasta] || null, ...extra });

    if (tipo === "P") {
      const dir = color === "w" ? -1 : 1;
      const filaInicial = color === "w" ? 6 : 1;
      const filaFinal = color === "w" ? 0 : 7;
      // Al llegar al final, el peón corona (se transforma en otra pieza).
      const avanzar = (hasta, extra = {}) => {
        if (Math.floor(hasta / 8) === filaFinal) {
          for (const pr of "QRBN") agregar(hasta, { ...extra, promocion: color === "w" ? pr : pr.toLowerCase() });
        } else {
          agregar(hasta, extra);
        }
      };
      const una = (f + dir) * 8 + c;
      if (dentro(f + dir, c) && !t[una]) {
        avanzar(una);
        const dos = (f + 2 * dir) * 8 + c;
        if (f === filaInicial && !t[dos]) agregar(dos, { doble: true });
      }
      for (const dc of [-1, 1]) {
        if (!dentro(f + dir, c + dc)) continue;
        const h = (f + dir) * 8 + c + dc;
        if (t[h] && colorDe(t[h]) === rival) avanzar(h);
        else if (h === pos.alPaso) agregar(h, { alPaso: true, captura: color === "w" ? "p" : "P" });
      }
      return movs;
    }

    const deslizante = tipo === "B" || tipo === "R" || tipo === "Q";
    for (const [df, dc] of DIRECCIONES[tipo]) {
      let ff = f + df;
      let cc = c + dc;
      while (dentro(ff, cc)) {
        const h = ff * 8 + cc;
        if (t[h]) {
          if (colorDe(t[h]) === rival) agregar(h);
          break;
        }
        agregar(h);
        if (!deslizante) break;
        ff += df;
        cc += dc;
      }
    }

    // Enroque: rey y torre sin mover, nada en medio y sin pasar por jaque.
    if (tipo === "K") {
      const fila = color === "w" ? 7 : 0;
      const base = fila * 8;
      if (i === base + 4 && !atacada(pos, i, rival)) {
        const [corto, largo, torre] = color === "w" ? ["K", "Q", "R"] : ["k", "q", "r"];
        if (pos.enroques[corto] && t[base + 7] === torre && !t[base + 5] && !t[base + 6] &&
            !atacada(pos, base + 5, rival) && !atacada(pos, base + 6, rival)) {
          agregar(base + 6, { enroque: "corto" });
        }
        if (pos.enroques[largo] && t[base] === torre && !t[base + 1] && !t[base + 2] && !t[base + 3] &&
            !atacada(pos, base + 3, rival) && !atacada(pos, base + 2, rival)) {
          agregar(base + 2, { enroque: "largo" });
        }
      }
    }
    return movs;
  }

  function mover(pos, m) {
    const t = pos.tablero.slice();
    const color = colorDe(m.pieza);
    t[m.hasta] = m.promocion || m.pieza;
    t[m.desde] = null;
    if (m.alPaso) t[m.hasta + (color === "w" ? 8 : -8)] = null;
    if (m.enroque) {
      const base = Math.floor(m.desde / 8) * 8;
      if (m.enroque === "corto") {
        t[base + 5] = t[base + 7];
        t[base + 7] = null;
      } else {
        t[base + 3] = t[base];
        t[base] = null;
      }
    }
    // Mover el rey o una torre (o que capturen la torre) quita el derecho a enrocar.
    const enroques = { ...pos.enroques };
    for (const i of [m.desde, m.hasta]) {
      if (i === 60) enroques.K = enroques.Q = false;
      if (i === 4) enroques.k = enroques.q = false;
      if (i === 63) enroques.K = false;
      if (i === 56) enroques.Q = false;
      if (i === 7) enroques.k = false;
      if (i === 0) enroques.q = false;
    }
    return {
      tablero: t,
      turno: rivalDe(color),
      enroques,
      alPaso: m.doble ? (m.desde + m.hasta) / 2 : null,
    };
  }

  // Movimientos legales de la pieza en la casilla i.
  function legales(pos, i) {
    const p = pos.tablero[i];
    if (!p) return [];
    const color = colorDe(p);
    return pseudoLegales(pos, i).filter((m) => !enJaque(mover(pos, m), color));
  }

  function todosLegales(pos, color = pos.turno) {
    const res = [];
    pos.tablero.forEach((p, i) => {
      if (p && colorDe(p) === color) res.push(...legales(pos, i));
    });
    return res;
  }

  // "mate", "ahogado", "tablas" (solo reyes), "jaque" o "normal".
  function situacion(pos, color = pos.turno) {
    const puedeMover = todosLegales(pos, color).length > 0;
    const jaque = enJaque(pos, color);
    if (!puedeMover) return jaque ? "mate" : "ahogado";
    if (pos.tablero.every((p) => !p || tipoDe(p) === "K")) return "tablas";
    return jaque ? "jaque" : "normal";
  }

  // Cuenta posiciones a cierta profundidad (para comprobar que las reglas están bien).
  function perft(pos, profundidad) {
    if (profundidad === 0) return 1;
    let n = 0;
    for (const m of todosLegales(pos)) n += perft(mover(pos, m), profundidad - 1);
    return n;
  }

  return {
    INICIAL: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    desdeFEN,
    nombreCasilla,
    indiceCasilla,
    colorDe,
    tipoDe,
    atacada,
    enJaque,
    legales,
    todosLegales,
    mover,
    situacion,
    perft,
  };
})();

// Permite probar el motor desde la terminal con Node.
if (typeof module !== "undefined") module.exports = Ajedrez;
