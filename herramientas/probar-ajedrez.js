// Pruebas del ajedrez — Aprende con Ana Isabella
// Uso: node herramientas/probar-ajedrez.js
// Verifica con el motor: perft (reglas), cada problema de los capítulos
// (mates, mates en 2, tácticas con su línea y sus "buenas"), el banco del
// problema del día y que los finales se ganen siguiendo la pista de Capi.
// Correrlo antes de publicar cualquier cambio en el ajedrez.

const fs = require("fs");
const path = require("path");
const A = require("../js/ajedrez-motor.js");
const B = require("../js/ajedrez-busqueda.js");
const F = require("../js/ajedrez-finales.js");
const { PROBLEMAS } = require("../js/ajedrez-problemas.js");

let errores = 0;
const ok = (bien, texto) => {
  if (!bien) errores++;
  console.log(bien ? "✅" : "❌", texto);
};
const nombre = (m) => A.nombreCasilla(m.desde) + A.nombreCasilla(m.hasta);
const buscar = (p, clave) => {
  const desde = A.indiceCasilla(clave.slice(0, 2));
  const hasta = A.indiceCasilla(clave.slice(2, 4));
  return A.legales(p, desde).find((m) => m.hasta === hasta && B.sinSubpromocion(m));
};
const matesEn1 = (p) => A.todosLegales(p, "w").filter(B.sinSubpromocion).filter((m) => A.situacion(A.mover(p, m), "b") === "mate");
const fuerzaMateEn2 = (p, m) => {
  const n = A.mover(p, m);
  const defensas = A.todosLegales(n, "b");
  return defensas.length > 0 && defensas.every((d) => matesEn1(A.mover(n, d)).length > 0);
};

// Los capítulos viven en js/ajedrez.js (que usa la pantalla): se toma solo
// el bloque de datos.
const fuente = fs.readFileSync(path.join(__dirname, "../js/ajedrez.js"), "utf8");
const bloque = fuente.slice(fuente.indexOf("const CAPITULOS = ["), fuente.indexOf("// Secciones del camino"));
const CAPITULOS = new Function("A", `${bloque}; return CAPITULOS;`)(A);

console.log("== Reglas ==");
ok(A.perft(A.desdeFEN(A.INICIAL), 4) === 197281, "perft(4) = 197281");

// Táctica: la línea es legal, gana 2+ puntos, la compu defiende con su mejor
// jugada y "buenas" son justo las primeras jugadas que ganan lo mismo.
function revisarTactica(fen, linea, buenasDadas, etiqueta) {
  const p = A.desdeFEN(fen);
  const base = B.material(p);
  const valores = B.valorarJugadas(p, "w", 3);
  const mejor = valores[0];
  const ganadoras = valores.filter((v) => v.valor >= mejor.valor - 0.5 && v.valor - base >= 2).map((v) => nombre(v.m)).sort();
  const buenas = [...new Set([linea[0], ...(buenasDadas || [])])].sort();
  let q = p;
  let legal = true;
  linea.forEach((clave, i) => {
    const m = buscar(q, clave);
    if (!m) legal = false;
    else {
      if (i % 2 === 1) {
        // La defensa de la compu debe ser de las mejores.
        const def = B.valorarJugadas(q, "b", 2);
        const suya = def.find((d) => nombre(d.m) === clave);
        if (!suya || suya.valor < def[0].valor - 0.5) legal = false;
      }
      q = A.mover(q, m);
    }
  });
  const seguro = legal ? -B.quiescencia(q, "b", -Infinity, Infinity, 6) - base : -99;
  ok(
    legal && mejor.valor - base >= 2 && seguro >= 2 && JSON.stringify(ganadoras) === JSON.stringify(buenas),
    `${etiqueta}: gana ${mejor.valor - base}, al final de la línea +${seguro} · buenas ${JSON.stringify(buenas)}${JSON.stringify(ganadoras) === JSON.stringify(buenas) ? "" : " ≠ motor " + JSON.stringify(ganadoras)}`
  );
}

// Final: siguiendo la pista contra la defensa de la compu, ¿se logra?
function revisarFinal(fen, objetivo, max, etiqueta) {
  const resultados = [];
  for (let k = 0; k < 4; k++) {
    let p = A.desdeFEN(fen);
    let res = "no termina";
    for (let j = 1; j <= max; j++) {
      const m = F.pista(p, objetivo);
      if (!m) {
        res = "sin pista";
        break;
      }
      p = A.mover(p, m);
      if (A.situacion(p, "b") === "mate") {
        res = j;
        break;
      }
      if (A.situacion(p, "b") === "ahogado") {
        res = "ahogado";
        break;
      }
      if (objetivo === "corona" && m.promocion) {
        res = F.piezaSuelta(p) ? "se comen la dama" : j;
        break;
      }
      const r = F.defensa(p);
      p = A.mover(p, r);
      if (r.captura) {
        res = "pierde pieza";
        break;
      }
    }
    resultados.push(res);
  }
  ok(resultados.every((r) => typeof r === "number"), `${etiqueta}: con la pista se logra en ${resultados.join(", ")} jugadas (máximo ${max})`);
}

console.log("== Capítulos ==");
const ids = new Set();
for (const cap of CAPITULOS) {
  ok(!ids.has(cap.id), `capítulo ${cap.id}: id único`);
  ids.add(cap.id);
  if (cap.requiere) ok(CAPITULOS.some((c) => c.id === cap.requiere), `${cap.id} requiere un capítulo que existe (${cap.requiere})`);
  cap.pasos.forEach((paso, i) => {
    const etiqueta = `${cap.id} paso ${i + 1} (${paso.tipo})`;
    if (paso.fen && paso.tipo !== "explica") {
      const p = A.desdeFEN(paso.fen);
      if (A.enJaque(p, "b")) ok(false, `${etiqueta}: las negras están en jaque y les toca a las blancas`);
    }
    if (paso.tipo === "mate") ok(matesEn1(A.desdeFEN(paso.fen)).length > 0, `${etiqueta}: hay mate en 1`);
    if (paso.tipo === "mate2") {
      const p = A.desdeFEN(paso.fen);
      const claves = A.todosLegales(p, "w").filter((m) => fuerzaMateEn2(p, m)).map(nombre);
      ok(!matesEn1(p).length && claves.length > 0, `${etiqueta}: sin mate en 1, mate en 2 con ${claves.join(", ")}`);
    }
    if (paso.tipo === "tactica") revisarTactica(paso.fen, paso.linea, paso.buenas, etiqueta);
    if (paso.tipo === "final") revisarFinal(paso.fen, paso.objetivo, paso.max, etiqueta);
  });
}

console.log("== Problema del día ==");
ok(PROBLEMAS.length >= 30, `el banco tiene ${PROBLEMAS.length} problemas`);
const fens = new Set();
let bienBanco = 0;
for (const pr of PROBLEMAS) {
  const p = A.desdeFEN(pr.fen);
  let bien = p.turno === "w" && !A.enJaque(p, "b") && !fens.has(pr.fen);
  fens.add(pr.fen);
  if (pr.tipo === "mate") bien = bien && matesEn1(p).length === 1;
  if (pr.tipo === "mate2") bien = bien && !matesEn1(p).length && A.todosLegales(p, "w").some((m) => fuerzaMateEn2(p, m));
  if (pr.tipo === "tactica") {
    let q = p;
    for (const clave of pr.linea) {
      const m = buscar(q, clave);
      if (!m) {
        bien = false;
        break;
      }
      q = A.mover(q, m);
    }
    const base = B.material(p);
    bien = bien && -B.quiescencia(q, "b", -Infinity, Infinity, 6) - base >= 2;
    const valores = B.valorarJugadas(p, "w", 3);
    bien = bien && nombre(valores[0].m) === pr.linea[0] && (!valores[1] || valores[1].valor <= valores[0].valor - 2);
  }
  if (!bien) ok(false, `problema ${pr.id} (${pr.tipo}, ${pr.tema}) no pasa: ${pr.fen}`);
  else bienBanco++;
}
ok(bienBanco === PROBLEMAS.length, `${bienBanco} de ${PROBLEMAS.length} problemas verificados (solución única)`);

console.log(errores ? `\n❌ HAY ${errores} ERRORES` : "\nTODO BIEN");
process.exit(errores ? 1 : 0);
