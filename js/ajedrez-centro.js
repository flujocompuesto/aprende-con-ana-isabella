// El termómetro del centro — Aprende con Ana Isabella
// El centro son las casillas d4, e4, d5 y e5. Cuenta cuánto lo controla cada
// color: +1 por cada pieza que ataca (o defiende) una de esas casillas y +1
// por cada pieza que está parada en ellas. Lo usan los capítulos «El poder
// del centro» y «La batalla por el centro» de js/ajedrez.js.
// Puro (sin pantalla): se prueba en Node con herramientas/probar-ajedrez.js.

(function (raiz) {
  // En el navegador, Ajedrez es una constante global de ajedrez-motor.js (no cuelga de window).
  const A = typeof Ajedrez !== "undefined" ? Ajedrez : require("./ajedrez-motor.js");
  const CASILLAS = ["d4", "e4", "d5", "e5"].map(A.indiceCasilla);

  // ¿La pieza de la casilla j ataca (o defiende) la casilla i? Las piezas que
  // corren (torre, alfil, dama) necesitan el camino libre.
  function ataca(t, j, i) {
    const p = t[j];
    if (!p || j === i) return false;
    const fj = Math.floor(j / 8);
    const cj = j % 8;
    const df = Math.floor(i / 8) - fj;
    const dc = (i % 8) - cj;
    const tipo = A.tipoDe(p);
    // La fila 0 es la 8: el peón blanco ataca hacia arriba (fila menor).
    if (tipo === "P") return df === (A.colorDe(p) === "w" ? -1 : 1) && Math.abs(dc) === 1;
    if (tipo === "N") return (Math.abs(df) === 1 && Math.abs(dc) === 2) || (Math.abs(df) === 2 && Math.abs(dc) === 1);
    if (tipo === "K") return Math.max(Math.abs(df), Math.abs(dc)) === 1;
    const recta = df === 0 || dc === 0;
    const diagonal = Math.abs(df) === Math.abs(dc);
    if ((tipo === "R" && !recta) || (tipo === "B" && !diagonal) || (tipo === "Q" && !recta && !diagonal)) return false;
    const pf = Math.sign(df);
    const pc = Math.sign(dc);
    for (let f = fj + pf, c = cj + pc; f * 8 + c !== i; f += pf, c += pc) {
      if (t[f * 8 + c]) return false;
    }
    return true;
  }

  // Cuántas piezas del color atacan la casilla i.
  function ataques(p, i, color) {
    let n = 0;
    for (let j = 0; j < 64; j++) {
      const x = p.tablero[j];
      if (x && A.colorDe(x) === color && ataca(p.tablero, j, i)) n++;
    }
    return n;
  }

  // Cada casilla del centro con lo que le suma a cada color.
  function porCasilla(p) {
    return CASILLAS.map((i) => {
      const x = p.tablero[i];
      const cuenta = (color) => ataques(p, i, color) + (x && A.colorDe(x) === color ? 1 : 0);
      return { i, w: cuenta("w"), b: cuenta("b") };
    });
  }

  // El termómetro: el total de un color.
  const control = (p, color) => porCasilla(p).reduce((s, c) => s + c[color], 0);

  const Centro = { CASILLAS, ataca, ataques, porCasilla, control };
  raiz.Centro = Centro;
  if (typeof module !== "undefined") module.exports = Centro;
})(typeof window !== "undefined" ? window : globalThis);
