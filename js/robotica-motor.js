// Motor de la sección de Robótica — Aprende con Ana Isabella
// Funciones puras (sin pantalla), que se pueden probar desde Node:
//  1) simular(programa, tablero): corre un programa de bloques y devuelve,
//     cuadro por cuadro, lo que hace el robot.
//  2) evaluarCircuito(nivel, piezas): dice qué focos y motores se prenden y
//     si hay un cortocircuito.

const Robotica = (() => {
  // ================= Robot con bloques =================

  // Direcciones: 0 arriba, 1 derecha, 2 abajo, 3 izquierda.
  const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const clave = ([f, c]) => `${f},${c}`;

  // Cada bloque cuenta 1, más lo que tenga adentro.
  function contarBloques(lista) {
    return lista.reduce(
      (n, b) => n + 1 + contarBloques(b.hijos || []) + contarBloques(b.si || []) + contarBloques(b.sino || []),
      0
    );
  }

  // Bloques: avanzar, izq, der, repetir {veces, hijos}, hasta {hijos},
  // si {si, sino}. Termina en "exito", "choque", "cansado" (no para nunca)
  // o "incompleto" (se acabó el programa sin recoger todas las estrellas).
  function simular(programa, tablero, maxPasos = 400) {
    const robot = { ...tablero.robot };
    const rocas = new Set(tablero.rocas.map(clave));
    const estrellas = new Set(tablero.estrellas.map(clave));
    const cuadros = [];
    let pasos = 0;
    let fin = null;

    const adelante = () => [robot.f + DIRS[robot.dir][0], robot.c + DIRS[robot.dir][1]];
    const bloqueado = () => {
      const [f, c] = adelante();
      return f < 0 || f >= tablero.filas || c < 0 || c >= tablero.cols || rocas.has(clave([f, c]));
    };
    const cuadro = (bloque, extra = {}) =>
      cuadros.push({ bloque: bloque.id, robot: { ...robot }, estrellas: [...estrellas], ...extra });
    const cansado = () => {
      if (++pasos <= maxPasos) return false;
      fin = "cansado";
      return true;
    };

    function correr(lista) {
      for (const b of lista) {
        if (fin || cansado()) return;
        if (b.tipo === "avanzar") {
          if (bloqueado()) {
            cuadro(b, { choque: adelante() });
            fin = "choque";
            return;
          }
          [robot.f, robot.c] = adelante();
          const recogida = estrellas.delete(clave([robot.f, robot.c]));
          cuadro(b, { recogida });
          if (estrellas.size === 0) {
            fin = "exito";
            return;
          }
        } else if (b.tipo === "izq" || b.tipo === "der") {
          robot.dir = (robot.dir + (b.tipo === "der" ? 1 : 3)) % 4;
          cuadro(b);
        } else if (b.tipo === "repetir") {
          for (let k = 0; k < b.veces && !fin; k++) {
            cuadro(b, { vuelta: k + 1 });
            correr(b.hijos);
          }
        } else if (b.tipo === "hasta") {
          while (!fin && estrellas.size > 0) {
            if (cansado()) return;
            cuadro(b);
            correr(b.hijos);
          }
        } else if (b.tipo === "si") {
          const hay = bloqueado();
          cuadro(b, { sensor: { casilla: adelante(), hay } });
          correr(hay ? b.si : b.sino);
        }
      }
    }

    correr(programa);
    if (!fin) fin = estrellas.size === 0 ? "exito" : "incompleto";
    return { cuadros, fin };
  }

  // ================= Circuitos =================

  // Lados: 0 arriba, 1 derecha, 2 abajo, 3 izquierda. Aberturas sin girar.
  const LADOS_BASE = {
    recta: [0, 2],
    curva: [0, 1],
    t: [0, 1, 3],
    cruz: [0, 1, 2, 3],
    bateria: [0, 2], // + arriba, − abajo
    foco: [0, 2],
    motor: [0, 2],
    interruptor: [0, 2],
  };
  const CABLES = ["recta", "curva", "t", "cruz"];
  const VUELTAS = { recta: 2, curva: 4, t: 4, cruz: 1 }; // giros distintos de cada cable
  const PASO = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  const ladosDe = (p) => LADOS_BASE[p.tipo].map((s) => (s + p.rot) % 4);

  function evaluarCircuito(nivel, piezas) {
    const { filas, cols } = nivel;
    const padre = Array.from({ length: filas * cols * 4 }, (_, i) => i);
    const raiz = (x) => (padre[x] === x ? x : (padre[x] = raiz(padre[x])));
    const unir = (a, b) => (padre[raiz(a)] = raiz(b));
    const puerto = (p, lado) => (p.f * cols + p.c) * 4 + lado;
    const enCelda = new Map(piezas.map((p) => [p.f * cols + p.c, p]));

    // Cada cable une todas sus salidas; un interruptor cerrado une sus dos lados.
    for (const p of piezas) {
      const lados = ladosDe(p);
      if (CABLES.includes(p.tipo) || (p.tipo === "interruptor" && p.cerrado)) {
        lados.slice(1).forEach((s) => unir(puerto(p, lados[0]), puerto(p, s)));
      }
    }
    // Piezas vecinas se conectan si las dos tienen salida hacia la otra.
    for (const p of piezas) {
      for (const s of ladosDe(p)) {
        const q = enCelda.get((p.f + PASO[s][0]) * cols + (p.c + PASO[s][1]));
        const dentro = p.f + PASO[s][0] >= 0 && p.f + PASO[s][0] < filas && p.c + PASO[s][1] >= 0 && p.c + PASO[s][1] < cols;
        if (dentro && q && ladosDe(q).includes((s + 2) % 4)) unir(puerto(p, s), puerto(q, (s + 2) % 4));
      }
    }

    const bateria = piezas.find((p) => p.tipo === "bateria");
    const [ladoMas, ladoMenos] = ladosDe(bateria);
    const mas = raiz(puerto(bateria, ladoMas));
    const menos = raiz(puerto(bateria, ladoMenos));

    const resultado = { encendidos: new Set(), corto: mas === menos, energizadas: new Set(), cortoCeldas: new Set() };
    const nodoDeCelda = (p) => raiz(puerto(p, ladosDe(p)[0]));

    if (resultado.corto) {
      // La electricidad se va directo por los cables: nada se prende.
      for (const p of piezas) {
        if (CABLES.includes(p.tipo) || p.tipo === "interruptor" || p.tipo === "bateria") {
          if (ladosDe(p).some((s) => raiz(puerto(p, s)) === mas)) resultado.cortoCeldas.add(p.f * cols + p.c);
        }
      }
      return resultado;
    }

    // Focos y motores son "puentes" entre dos nodos. Se prenden si están en
    // algún camino que va de + a − (sin repetir nodos).
    const puentes = piezas
      .filter((p) => p.tipo === "foco" || p.tipo === "motor")
      .map((p) => {
        const [a, b] = ladosDe(p);
        return { pieza: p, a: raiz(puerto(p, a)), b: raiz(puerto(p, b)) };
      })
      .filter((e) => e.a !== e.b); // si sus dos lados están unidos por cable, está "en corto"

    const nodosActivos = new Set();
    const visitados = new Set([mas]);
    const camino = [];
    (function buscar(nodo) {
      if (nodo === menos) {
        camino.forEach((e) => {
          resultado.encendidos.add(e.pieza.id);
          nodosActivos.add(e.a);
          nodosActivos.add(e.b);
        });
        return;
      }
      for (const e of puentes) {
        if (camino.includes(e)) continue;
        const otro = e.a === nodo ? e.b : e.b === nodo ? e.a : null;
        if (otro === null || visitados.has(otro)) continue;
        visitados.add(otro);
        camino.push(e);
        buscar(otro);
        camino.pop();
        visitados.delete(otro);
      }
    })(mas);

    for (const p of piezas) {
      const i = p.f * cols + p.c;
      if (p.tipo === "foco" || p.tipo === "motor") {
        if (resultado.encendidos.has(p.id)) resultado.energizadas.add(i);
      } else if (p.tipo === "bateria") {
        if (resultado.encendidos.size) resultado.energizadas.add(i);
      } else if (p.tipo === "interruptor" && !p.cerrado) {
        // abierto: no pasa nada por él
      } else if (nodosActivos.has(nodoDeCelda(p))) {
        resultado.energizadas.add(i);
      }
    }
    return resultado;
  }

  function cumpleObjetivo(nivel, piezas) {
    const r = evaluarCircuito(nivel, piezas);
    return !r.corto && nivel.objetivo.every((id) => r.encendidos.has(id));
  }

  // Toques para llegar a la solución pensada (girar cables y cerrar interruptores).
  function toquesMinimos(nivel) {
    return nivel.piezas.reduce((n, p) => {
      if (CABLES.includes(p.tipo) && p.sol !== undefined) {
        const v = VUELTAS[p.tipo];
        return n + ((((p.sol - p.rot) % v) + v) % v);
      }
      if (p.tipo === "interruptor" && p.solCerrado !== undefined) return n + (p.solCerrado !== p.cerrado ? 1 : 0);
      return n;
    }, 0);
  }

  return { DIRS, clave, contarBloques, simular, CABLES, ladosDe, evaluarCircuito, cumpleObjetivo, toquesMinimos };
})();

if (typeof module !== "undefined") module.exports = Robotica;
