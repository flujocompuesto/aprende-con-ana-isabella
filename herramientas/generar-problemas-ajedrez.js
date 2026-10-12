// Genera js/ajedrez-problemas.js: el banco del "Problema del día".
// Uso: node herramientas/generar-problemas-ajedrez.js [semilla]
//
// Cómo: juega partidas entre dos compus que se equivocan como principiantes
// (a veces no ven lo que les comen) y en cada posición busca un problema con
// UNA sola solución, verificada con el motor:
//   - mate:    mate en 1, una sola jugada lo da.
//   - mate2:   mate en 2 que empieza con jaque o captura (1 o 2 soluciones).
//   - tactica: una jugada que gana material (2+ puntos) y ninguna otra se le
//              acerca; se guarda la línea (jugada, defensa, remate).
// Si le toca mover a las negras, el tablero se da vuelta: Ana Isabella
// siempre juega con las blancas. La misma semilla da el mismo banco.

const fs = require("fs");
const path = require("path");
const A = require("../js/ajedrez-motor.js");
const B = require("../js/ajedrez-busqueda.js");

let semilla = Number(process.argv[2] || 2026);
const azar = () => ((semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648);

const nombre = (m) => A.nombreCasilla(m.desde) + A.nombreCasilla(m.hasta);
const rivalDe = (c) => (c === "w" ? "b" : "w");
const NOMBRES = { P: "un peón", N: "un caballo", B: "un alfil", R: "una torre", Q: "la dama" };

function aFEN(p) {
  const filas = [];
  for (let f = 0; f < 8; f++) {
    let fila = "";
    let vacias = 0;
    for (let c = 0; c < 8; c++) {
      const x = p.tablero[f * 8 + c];
      if (!x) vacias++;
      else {
        if (vacias) fila += vacias;
        vacias = 0;
        fila += x;
      }
    }
    filas.push(fila + (vacias || ""));
  }
  const e = p.enroques;
  const enroques = (e.K ? "K" : "") + (e.Q ? "Q" : "") + (e.k ? "k" : "") + (e.q ? "q" : "") || "-";
  const alPaso = p.alPaso === null || p.alPaso === undefined ? "-" : A.nombreCasilla(p.alPaso);
  return `${filas.join("/")} ${p.turno} ${enroques} ${alPaso} 0 1`;
}

// Da vuelta el tablero y cambia los colores: las negras pasan a ser blancas.
function espejo(p) {
  const tablero = Array(64).fill(null);
  p.tablero.forEach((x, i) => {
    if (!x) return;
    const f = Math.floor(i / 8);
    const c = i % 8;
    tablero[(7 - f) * 8 + c] = x === x.toUpperCase() ? x.toLowerCase() : x.toUpperCase();
  });
  const e = p.enroques;
  const alPaso = p.alPaso === null ? null : (7 - Math.floor(p.alPaso / 8)) * 8 + (p.alPaso % 8);
  return { tablero, turno: rivalDe(p.turno), enroques: { K: e.k, Q: e.q, k: e.K, q: e.Q }, alPaso };
}

const matesEn1 = (p, color) =>
  A.todosLegales(p, color).filter(B.sinSubpromocion).filter((m) => A.situacion(A.mover(p, m), rivalDe(color)) === "mate");

function fuerzaMateEn2(p, m, color) {
  const n = A.mover(p, m);
  const defensas = A.todosLegales(n, rivalDe(color));
  return defensas.length > 0 && defensas.every((d) => matesEn1(A.mover(n, d), color).length > 0);
}

// Una compu principiante: casi siempre juega bien a 1 jugada, pero a veces
// juega cualquier cosa (así aparecen piezas sueltas y oportunidades).
function jugadaPrincipiante(p, color) {
  const jugadas = A.todosLegales(p, color).filter(B.sinSubpromocion);
  if (azar() < 0.18) return jugadas[Math.floor(azar() * jugadas.length)];
  const valores = B.valorarJugadas(p, color, 1);
  const buenas = valores.filter((v) => v.valor >= valores[0].valor - 0.5);
  return buenas[Math.floor(azar() * buenas.length)].m;
}

// Mira la posición (le toca a "color") y devuelve un problema o null.
function buscarProblema(p, color) {
  const mates = matesEn1(p, color);
  if (mates.length === 1) return { tipo: "mate", solucion: [nombre(mates[0])] };
  if (mates.length > 1) return null;

  // Mate en 2 que empieza con jaque o captura (lo más natural para buscar).
  const forzadas = A.todosLegales(p, color)
    .filter(B.sinSubpromocion)
    .filter((m) => m.captura || A.enJaque(A.mover(p, m), rivalDe(color)))
    .filter((m) => fuerzaMateEn2(p, m, color));
  // Hasta 2 soluciones está bien: la pantalla acepta cualquier jugada que fuerce el mate.
  if (forzadas.length >= 1 && forzadas.length <= 2) return { tipo: "mate2", solucion: [nombre(forzadas[0])] };
  if (forzadas.length > 2) return null;

  // Ganar material: la mejor jugada a 3 jugadas, muy por encima de las demás.
  const signo = color === "w" ? 1 : -1;
  const base = signo * B.material(p);
  if (Math.abs(base) > 4) return null; // con mucha ventaja ya no es un problema
  // Filtro rápido: a 2 jugadas (con las capturas del final) ya se ve si hay
  // algo que ganar; solo entonces se hace la búsqueda completa.
  const rapida = B.valorarJugadas(p, color, 2);
  if (!rapida.length || rapida[0].valor - base < 2) return null;
  const valores = B.valorarJugadas(p, color, 3);
  const [mejor, segunda] = valores;
  if (!mejor || B.esMate(mejor.valor) || mejor.valor - base < 2) return null;
  if (segunda && segunda.valor > mejor.valor - 2) return null;

  // La línea: jugada clave, mejor defensa y el remate (o solo la captura).
  const n1 = A.mover(p, mejor.m);
  const linea = [mejor.m];
  const ganado = (q) => signo * B.material(q) - base;
  const seguro = (q, c) => -B.quiescencia(q, rivalDe(c), -Infinity, Infinity, 6) * 1; // valor para "color" tras su jugada
  if (!(mejor.m.captura && ganado(n1) >= 2 && seguro(n1, color) * 1 >= base + 2)) {
    const defensa = B.valorarJugadas(n1, rivalDe(color), 2)[0];
    if (!defensa) return null;
    const n2 = A.mover(n1, defensa.m);
    const remate = B.valorarJugadas(n2, color, 1)[0];
    if (!remate) return null;
    const n3 = A.mover(n2, remate.m);
    if (ganado(n3) < 2 || seguro(n3, color) < base + 2) return null;
    linea.push(defensa.m, remate.m);
  }
  // Lo que se gana: la pieza más valiosa que comen las blancas en la línea.
  const comidas = linea.filter((_, i) => i % 2 === 0).map((m) => m.captura).filter(Boolean);
  const pieza = comidas.sort((a, b) => B.VALOR[A.tipoDe(b)] - B.VALOR[A.tipoDe(a)])[0];
  if (!pieza) return null;
  return { tipo: "tactica", solucion: linea.map(nombre), gana: NOMBRES[A.tipoDe(pieza)], ganancia: mejor.valor - base };
}

// El tema, para la pista: pieza sola, tenedor, jaque o una jugada tranquila.
function tema(p, problema) {
  if (problema.tipo !== "tactica") return problema.tipo;
  const [clave, , remate] = problema.solucion;
  const desde = A.indiceCasilla(clave.slice(0, 2));
  const hasta = A.indiceCasilla(clave.slice(2, 4));
  if (problema.solucion.length === 1) return "colgada";
  const m = A.legales(p, desde).find((x) => x.hasta === hasta);
  const n = A.mover(p, m);
  if (remate && remate.slice(0, 2) === clave.slice(2, 4)) {
    // La misma pieza ataca a dos (o al rey y a otra): tenedor.
    const atacadas = A.legales({ ...n, turno: "w" }, hasta).filter((x) => x.captura && (B.VALOR[A.tipoDe(x.captura)] >= 3));
    if (atacadas.length >= 2 || (A.enJaque(n, "b") && atacadas.length >= 1)) return "tenedor";
  }
  return A.enJaque(n, "b") ? "jaque" : "tranquila";
}

const encontrados = { mate: [], mate2: [], tactica: [] };
const vistos = new Set();
const PARTIDAS = Number(process.env.PARTIDAS || 160);
const t0 = Date.now();

for (let g = 0; g < PARTIDAS; g++) {
  let p = A.desdeFEN(A.INICIAL);
  // Por partida: máximo 2 tácticas y 2 mates, separados. Así el banco es variado.
  const deEstaPartida = { tactica: 0, mate: 0, mate2: 0 };
  let ultimoPly = -99;
  for (let ply = 0; ply < 90; ply++) {
    const color = p.turno;
    const sit = A.situacion(p, color);
    if (sit === "mate" || sit === "ahogado" || sit === "tablas") break;
    if (ply >= 10 && ply - ultimoPly >= 6) {
      const problema = buscarProblema(p, color);
      if (problema && (problema.tipo === "tactica" ? deEstaPartida.tactica < 2 : deEstaPartida.mate + deEstaPartida.mate2 < 2)) {
        const blancas = color === "w" ? p : espejo(p);
        const fen = aFEN(blancas);
        const clave = fen.split(" ")[0];
        if (!vistos.has(clave)) {
          vistos.add(clave);
          // Se vuelve a calcular sobre el tablero ya volteado (y así se verifica).
          const otra = buscarProblema(blancas, "w");
          if (otra && otra.tipo === problema.tipo) {
            otra.fen = fen;
            otra.tema = tema(blancas, otra);
            otra.piezas = blancas.tablero.filter(Boolean).length;
            encontrados[otra.tipo].push(otra);
            deEstaPartida[otra.tipo]++;
            ultimoPly = ply;
          }
        }
      }
    }
    p = A.mover(p, jugadaPrincipiante(p, color));
  }
  if (g % 20 === 19) {
    const s = Math.round((Date.now() - t0) / 1000);
    console.error(`partida ${g + 1}/${PARTIDAS} · ${s}s · mates ${encontrados.mate.length}, mate2 ${encontrados.mate2.length}, tácticas ${encontrados.tactica.length}`);
  }
}

// Elegimos un banco variado: menos piezas primero (más fácil de ver).
const elegir = (lista, n) => lista.sort((a, b) => a.piezas - b.piezas).slice(0, n);
const mates = elegir(encontrados.mate, 30);
const mates2 = elegir(encontrados.mate2, 20);
const porTema = {};
for (const t of encontrados.tactica) (porTema[t.tema] = porTema[t.tema] || []).push(t);
const tacticas = [
  ...elegir(porTema.colgada || [], 14),
  ...elegir(porTema.tenedor || [], 14),
  ...elegir(porTema.jaque || [], 12),
  ...elegir(porTema.tranquila || [], 10),
];

// Se intercalan para que cada día toque algo distinto.
const banco = [];
const colas = [mates, tacticas.filter((_, i) => i % 2 === 0), mates2, tacticas.filter((_, i) => i % 2 === 1)];
while (colas.some((c) => c.length)) for (const c of colas) if (c.length) banco.push(c.shift());

const lineas = banco.map((x, i) => {
  const datos = { id: i + 1, tipo: x.tipo, tema: x.tema, fen: x.fen };
  if (x.tipo === "tactica") Object.assign(datos, { linea: x.solucion, gana: x.gana });
  return "  " + JSON.stringify(datos).replace(/"(\w+)":/g, "$1: ") + ",";
});

const salida = `// Banco del "Problema del día" — Aprende con Ana Isabella
// GENERADO por herramientas/generar-problemas-ajedrez.js: no editar a mano.
// Cada problema está verificado con el motor (los mates en 1 y las tácticas
// tienen una sola solución; los mates en 2, una o dos). Siempre
// juegan las blancas. tipo: mate (en 1), mate2 o tactica (ganar material:
// "linea" = jugada clave, defensa de la compu y remate).

const PROBLEMAS = [
${lineas.join("\n")}
];

if (typeof module !== "undefined") module.exports = { PROBLEMAS };
`;
fs.writeFileSync(path.join(__dirname, "../js/ajedrez-problemas.js"), salida);
const cuenta = banco.reduce((c, x) => ((c[x.tema] = (c[x.tema] || 0) + 1), c), {});
console.log(`Listo: ${banco.length} problemas en ${Math.round((Date.now() - t0) / 1000)}s`, cuenta);
