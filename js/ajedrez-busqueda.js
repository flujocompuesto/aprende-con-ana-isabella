// Búsqueda de jugadas — Aprende con Ana Isabella
// Mira unas jugadas hacia adelante (alfa-beta) contando el material, para
// decir qué tan buena es cada jugada. La usan la revisión de partidas
// ("¿Dónde me equivoqué?"), las pistas de los finales y el generador de
// problemas (herramientas/generar-problemas-ajedrez.js). Funciones puras: se
// prueban desde Node.

const Busqueda = (() => {
  const A = typeof Ajedrez !== "undefined" ? Ajedrez : require("./ajedrez-motor.js");
  const VALOR = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
  const MATE = 1000; // un mate vale más que todo el material junto

  const rivalDe = (color) => (color === "w" ? "b" : "w");
  // Al coronar, solo se considera la dama (como en la pantalla).
  const sinSubpromocion = (m) => !m.promocion || A.tipoDe(m.promocion) === "Q";

  // Material de las blancas menos el de las negras, en peones.
  function material(p) {
    let s = 0;
    for (const x of p.tablero) if (x) s += (A.colorDe(x) === "w" ? 1 : -1) * VALOR[A.tipoDe(x)];
    return s;
  }

  // Primero las capturas de piezas valiosas con piezas baratas: así la poda
  // alfa-beta corta antes.
  function ordenar(jugadas) {
    const prioridad = (m) =>
      (m.captura ? 10 * VALOR[A.tipoDe(m.captura)] - VALOR[A.tipoDe(m.pieza)] : 0) + (m.promocion ? 80 : 0);
    return jugadas.map((m) => [m, prioridad(m)]).sort((a, b) => b[1] - a[1]).map(([m]) => m);
  }

  // Al final de la búsqueda se siguen solo las capturas, hasta que comer ya no
  // convenga: así no se cuenta como ganada una pieza que se pierde enseguida.
  function quiescencia(p, color, alfa, beta, prof) {
    const quieto = (color === "w" ? 1 : -1) * material(p);
    if (quieto >= beta) return quieto;
    if (quieto > alfa) alfa = quieto;
    if (prof === 0) return alfa;
    const capturas = ordenar(A.todosLegales(p, color).filter((m) => (m.captura || m.promocion) && sinSubpromocion(m)));
    for (const m of capturas) {
      const v = -quiescencia(A.mover(p, m), rivalDe(color), -beta, -alfa, prof - 1);
      if (v >= beta) return v;
      if (v > alfa) alfa = v;
    }
    return alfa;
  }

  // Valor de la posición para "color" (que mueve), mirando "prof" jugadas.
  function negamax(p, color, prof, alfa, beta, ply) {
    const jugadas = A.todosLegales(p, color).filter(sinSubpromocion);
    if (!jugadas.length) return A.enJaque(p, color) ? -(MATE - ply) : 0;
    if (prof === 0) return quiescencia(p, color, alfa, beta, 6);
    let mejor = -Infinity;
    for (const m of ordenar(jugadas)) {
      const v = -negamax(A.mover(p, m), rivalDe(color), prof - 1, -beta, -alfa, ply + 1);
      if (v > mejor) mejor = v;
      if (v > alfa) alfa = v;
      if (alfa >= beta) break;
    }
    return mejor;
  }

  // Valor exacto de cada jugada de "color", de la mejor a la peor. "prof"
  // cuenta la jugada misma: 2 = mi jugada y la mejor respuesta.
  function valorarJugadas(p, color, prof = 2) {
    return A.todosLegales(p, color)
      .filter(sinSubpromocion)
      .map((m) => ({ m, valor: -negamax(A.mover(p, m), rivalDe(color), prof - 1, -Infinity, Infinity, 1) }))
      .sort((a, b) => b.valor - a.valor);
  }

  const esMate = (valor) => Math.abs(valor) > MATE / 2;

  return { VALOR, MATE, material, quiescencia, negamax, valorarJugadas, esMate, sinSubpromocion };
})();

if (typeof module !== "undefined") module.exports = Busqueda;
