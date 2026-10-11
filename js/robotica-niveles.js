// Niveles de la sección de Robótica — Aprende con Ana Isabella
// Robot: posiciones [fila, columna]; dir 0 arriba, 1 derecha, 2 abajo, 3 izquierda.
//   "reto" = bloques de la mejor solución (3 estrellas); "maxBloques" obliga a
//   usar la idea nueva del nivel. Varios tableros = el mismo programa debe
//   funcionar en todos (para eso sirven los sensores).
// Circuitos: cada pieza tiene "rot" (giro inicial) y "sol" (giro de la
//   solución pensada). Los interruptores tienen "cerrado" y "solCerrado".

// Arma un tablero a partir de un camino. Movimientos: "D5" = 5 a la derecha,
// "B" abajo, "I" izquierda, "A" arriba. Todo lo que no es camino es roca.
function tableroDeCamino({ filas, cols, inicio, dir, movimientos, estrellas }) {
  const PASOS = { D: [0, 1], B: [1, 0], I: [0, -1], A: [-1, 0] };
  const camino = new Set([`${inicio[0]},${inicio[1]}`]);
  let [f, c] = inicio;
  for (const mov of movimientos.split(" ")) {
    const [df, dc] = PASOS[mov[0]];
    for (let k = 0; k < Number(mov.slice(1)); k++) {
      f += df;
      c += dc;
      camino.add(`${f},${c}`);
    }
  }
  const rocas = [];
  for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) if (!camino.has(`${i},${j}`)) rocas.push([i, j]);
  return { filas, cols, robot: { f: inicio[0], c: inicio[1], dir }, estrellas, rocas };
}

const NIVELES_ROBOT = [
  {
    titulo: "Avanzar y girar",
    bloques: ["avanzar", "izq", "der"],
    reto: 7,
    texto: "Los robots de verdad no saben qué es arriba o abajo: solo saben <strong>avanzar</strong> hacia donde miran y <strong>girar</strong>. Fíjate hacia dónde apunta la flecha del robot y llévalo a la estrella.",
    tableros: [{ filas: 6, cols: 6, robot: { f: 5, c: 0, dir: 0 }, estrellas: [[2, 3]], rocas: [] }],
  },
  {
    titulo: "Repetir",
    bloques: ["avanzar", "izq", "der", "repetir"],
    reto: 2,
    maxBloques: 3,
    texto: "¡Qué flojera poner 5 veces Avanzar! Usa <strong>Repetir</strong>: todo lo que pongas adentro se hace las veces que digas. Toca Repetir y después Avanzar para ponerlo adentro.",
    tableros: [{ filas: 6, cols: 6, robot: { f: 2, c: 0, dir: 1 }, estrellas: [[2, 5]], rocas: [] }],
  },
  {
    titulo: "La escalera",
    bloques: ["avanzar", "izq", "der", "repetir"],
    reto: 5,
    maxBloques: 6,
    texto: "Sube la escalera hasta la estrella. Pista: todos los escalones son iguales… ¡repite uno!",
    tableros: [{
      filas: 6, cols: 6, robot: { f: 5, c: 0, dir: 0 }, estrellas: [[1, 4]],
      rocas: [[5, 1], [4, 2], [3, 3], [2, 4], [3, 0], [2, 1], [1, 2], [0, 3]],
    }],
  },
  {
    titulo: "El cuadrado",
    bloques: ["avanzar", "izq", "der", "repetir"],
    reto: 4,
    maxBloques: 6,
    texto: "Recoge las 3 estrellas. Pista de ingeniera: ¡puedes poner un <strong>Repetir adentro de otro Repetir</strong>!",
    tableros: [{
      filas: 6, cols: 6, robot: { f: 4, c: 1, dir: 0 }, estrellas: [[1, 1], [1, 4], [4, 4]],
      rocas: [[2, 2], [2, 3], [3, 2], [3, 3]],
    }],
  },
  {
    titulo: "Repetir hasta llegar",
    bloques: ["avanzar", "izq", "der", "hasta"],
    reto: 2,
    maxBloques: 2,
    texto: "Ahora el robot va a probar tu programa en <strong>3 tableros distintos</strong> y tiene que funcionar en todos. Como no sabes cuántos pasos son (¡y solo caben 2 bloques!), usa <strong>Repetir hasta llegar</strong>: el robot sigue hasta encontrar la estrella.",
    tableros: [
      { filas: 6, cols: 6, robot: { f: 2, c: 0, dir: 1 }, estrellas: [[2, 3]], rocas: [] },
      { filas: 6, cols: 6, robot: { f: 2, c: 0, dir: 1 }, estrellas: [[2, 5]], rocas: [] },
      { filas: 6, cols: 6, robot: { f: 2, c: 0, dir: 1 }, estrellas: [[2, 1]], rocas: [] },
    ],
  },
  {
    titulo: "El sensor",
    bloques: ["avanzar", "izq", "der", "hasta", "si"],
    reto: 4,
    maxBloques: 5,
    texto: "Los robots tienen <strong>sensores</strong> para saber qué hay enfrente. Usa <strong>Si hay algo adelante</strong>: si hay una roca o la orilla, gira; si no, avanza. ¡Un solo programa para los 3 tableros!",
    tableros: [
      { filas: 6, cols: 6, robot: { f: 5, c: 0, dir: 0 }, estrellas: [[0, 5]], rocas: [] },
      { filas: 6, cols: 6, robot: { f: 5, c: 0, dir: 0 }, estrellas: [[3, 4]], rocas: [[2, 0]] },
      { filas: 6, cols: 6, robot: { f: 5, c: 2, dir: 0 }, estrellas: [[2, 5]], rocas: [[1, 2]] },
    ],
  },
  {
    titulo: "Laberintos",
    bloques: ["avanzar", "izq", "der", "repetir", "hasta", "si"],
    reto: 4,
    maxBloques: 6,
    texto: "Estos laberintos son más difíciles… ¿funcionará tu programa del sensor? ¡Así trabajan las aspiradoras robot: no conocen la casa, pero reaccionan a lo que sienten!",
    tableros: [
      { filas: 6, cols: 6, robot: { f: 5, c: 0, dir: 0 }, estrellas: [[5, 5]], rocas: [] },
      { filas: 6, cols: 6, robot: { f: 5, c: 1, dir: 0 }, estrellas: [[4, 3]], rocas: [[1, 1], [2, 4]] },
      { filas: 6, cols: 6, robot: { f: 4, c: 0, dir: 1 }, estrellas: [[5, 0]], rocas: [[4, 3]] },
    ],
  },
  {
    titulo: "La aspiradora",
    bloques: ["avanzar", "izq", "der", "repetir"],
    reto: 11,
    maxBloques: 14,
    texto: "Las aspiradoras robot limpian en <strong>zigzag</strong>: van a la derecha, bajan, van a la izquierda, bajan… Recoge las 4 estrellas. Pista: ¡un Repetir grande con dos Repetir adentro!",
    tableros: [{ filas: 5, cols: 6, robot: { f: 0, c: 0, dir: 1 }, estrellas: [[0, 5], [1, 0], [2, 5], [3, 0]], rocas: [] }],
  },
  {
    titulo: "Rodea las rocas",
    bloques: ["avanzar", "izq", "der", "hasta", "si"],
    reto: 11,
    maxBloques: 13,
    texto: "¡Hay rocas en el camino! Cuando el sensor vea una, el robot tiene que <strong>rodearla por arriba</strong>: girar, subir, avanzar dos, bajar y volver a mirar a la derecha. Pon todos esos pasos dentro del Si. La estrella está en su cueva: solo se entra por la izquierda. ¡4 tableros!",
    // La estrella vive en una cueva de rocas en medio del campo (solo se
    // entra por la izquierda) y cambia de lugar: así no se llega siguiendo
    // la pared ni barriendo el tablero, hay que rodear cada roca del camino.
    tableros: [
      [5, [2]],
      [5, [1, 3]],
      [4, [2]],
      [5, [3]],
    ].map(([cueva, rocasCamino]) => ({
      filas: 5,
      cols: 8,
      robot: { f: 2, c: 0, dir: 1 },
      estrellas: [[2, cueva]],
      rocas: [[1, cueva], [3, cueva], [2, cueva + 1], ...rocasCamino.map((c) => [2, c])],
    })),
  },
  {
    titulo: "Espiral gigante",
    bloques: ["avanzar", "izq", "der", "repetir", "hasta", "si"],
    reto: 4,
    maxBloques: 5,
    texto: "¡El laberinto más grande! Una espiral con 5 estrellas, y solo caben 5 bloques. Piensa como una ingeniera: ¿qué programa que ya conoces sigue los pasillos solito?",
    tableros: [
      tableroDeCamino({ filas: 7, cols: 7, inicio: [0, 0], dir: 1, movimientos: "D6 B6 I6 A4 D4 B2 I2 A1",
        estrellas: [[0, 6], [6, 6], [6, 0], [2, 4], [3, 2]] }),
      tableroDeCamino({ filas: 6, cols: 6, inicio: [0, 0], dir: 1, movimientos: "D5 B5 I5 A3 D3 B1 I2",
        estrellas: [[0, 5], [5, 5], [5, 0], [2, 3], [3, 1]] }),
    ],
  },
];

const NIVELES_CIRCUITO = [
  {
    titulo: "Prende el foco",
    filas: 3, cols: 3, objetivo: ["foco"],
    texto: "Un <strong>circuito</strong> es un camino cerrado: la electricidad sale de la batería por el <strong>+</strong>, pasa por el foco y regresa por el <strong>−</strong>. Toca los cables para girarlos y cierra el camino.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 0, sol: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 0, c: 2, tipo: "curva", rot: 2, sol: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 2, tipo: "foco", id: "foco", rot: 0 },
      { f: 2, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 2, c: 2, tipo: "curva", rot: 2, sol: 3 },
    ],
  },
  {
    titulo: "El interruptor",
    filas: 3, cols: 4, objetivo: ["foco"],
    texto: "El <strong>interruptor</strong> es una puerta para la electricidad: abierto corta el camino y cerrado la deja pasar. Arregla los cables y ciérralo tocándolo.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 1, sol: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 0, c: 2, tipo: "interruptor", rot: 1, cerrado: false, solCerrado: true },
      { f: 0, c: 3, tipo: "curva", rot: 1, sol: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 3, tipo: "foco", id: "foco", rot: 0 },
      { f: 2, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 2, c: 2, tipo: "recta", rot: 0, sol: 1 },
      { f: 2, c: 3, tipo: "curva", rot: 3, sol: 3 },
    ],
  },
  {
    titulo: "El motor",
    filas: 4, cols: 4, objetivo: ["motor"],
    texto: "Los <strong>motores</strong> hacen girar las ruedas y los brazos de los robots. Conecta el motor para que su hélice gire.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 1, sol: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 0, c: 2, tipo: "recta", rot: 1, sol: 1 },
      { f: 0, c: 3, tipo: "curva", rot: 1, sol: 2 },
      { f: 1, c: 0, tipo: "recta", rot: 1, sol: 0 },
      { f: 1, c: 3, tipo: "motor", id: "motor", rot: 0 },
      { f: 2, c: 0, tipo: "bateria", rot: 0 },
      { f: 2, c: 3, tipo: "recta", rot: 0, sol: 0 },
      { f: 3, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 3, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 3, c: 2, tipo: "recta", rot: 0, sol: 1 },
      { f: 3, c: 3, tipo: "curva", rot: 2, sol: 3 },
    ],
  },
  {
    titulo: "Focos en serie",
    filas: 3, cols: 4, objetivo: ["focoA", "focoB"],
    texto: "Dos focos <strong>en serie</strong>: la electricidad pasa primero por uno y después por el otro, en un solo camino. ¡Prende los dos!",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 0, sol: 1 },
      { f: 0, c: 1, tipo: "foco", id: "focoA", rot: 1 },
      { f: 0, c: 2, tipo: "foco", id: "focoB", rot: 1 },
      { f: 0, c: 3, tipo: "curva", rot: 2, sol: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 3, tipo: "recta", rot: 1, sol: 0 },
      { f: 2, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 2, c: 2, tipo: "recta", rot: 1, sol: 1 },
      { f: 2, c: 3, tipo: "curva", rot: 1, sol: 3 },
    ],
  },
  {
    titulo: "Focos en paralelo",
    filas: 3, cols: 4, objetivo: ["focoA", "focoB"],
    texto: "Dos focos <strong>en paralelo</strong>: cada uno tiene su propio camino. Los cables en forma de <strong>T</strong> reparten la electricidad. Si un foco se apaga, ¡el otro sigue prendido!",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 1, sol: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 0, c: 2, tipo: "t", rot: 0, sol: 2 },
      { f: 0, c: 3, tipo: "curva", rot: 2, sol: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 2, tipo: "foco", id: "focoA", rot: 0 },
      { f: 1, c: 3, tipo: "foco", id: "focoB", rot: 0 },
      { f: 2, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 2, c: 2, tipo: "t", rot: 2, sol: 0 },
      { f: 2, c: 3, tipo: "curva", rot: 2, sol: 3 },
    ],
  },
  {
    titulo: "¡Cortocircuito!",
    filas: 3, cols: 4, objetivo: ["foco"],
    texto: "¡Ups! Este circuito tiene un <strong>cortocircuito</strong>: la electricidad se va por el camino fácil (los cables de la derecha) y no pasa por el foco. Así el foco no prende y la batería se calienta. ¡Corta ese camino!",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 1 },
      { f: 0, c: 2, tipo: "t", rot: 2 },
      { f: 0, c: 3, tipo: "curva", rot: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 2, tipo: "foco", id: "foco", rot: 0 },
      { f: 1, c: 3, tipo: "recta", rot: 0, sol: 1 },
      { f: 2, c: 0, tipo: "curva", rot: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 1 },
      { f: 2, c: 2, tipo: "t", rot: 0 },
      { f: 2, c: 3, tipo: "curva", rot: 3 },
    ],
  },
  {
    titulo: "El circuito del robot",
    filas: 4, cols: 5, objetivo: ["ojos", "ruedas"],
    texto: "¡El gran final! Arma el circuito de un robot: sus <strong>ojos</strong> (el foco) y sus <strong>ruedas</strong> (el motor), con un interruptor para prenderlo.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 1, sol: 1 },
      { f: 0, c: 1, tipo: "interruptor", rot: 1, cerrado: false, solCerrado: true },
      { f: 0, c: 2, tipo: "recta", rot: 0, sol: 1 },
      { f: 0, c: 3, tipo: "t", rot: 1, sol: 2 },
      { f: 0, c: 4, tipo: "curva", rot: 2, sol: 2 },
      { f: 1, c: 0, tipo: "recta", rot: 1, sol: 0 },
      { f: 1, c: 3, tipo: "foco", id: "ojos", rot: 0 },
      { f: 1, c: 4, tipo: "motor", id: "ruedas", rot: 0 },
      { f: 2, c: 0, tipo: "bateria", rot: 0 },
      { f: 2, c: 3, tipo: "recta", rot: 1, sol: 0 },
      { f: 2, c: 4, tipo: "recta", rot: 1, sol: 0 },
      { f: 3, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 3, c: 1, tipo: "recta", rot: 1, sol: 1 },
      { f: 3, c: 2, tipo: "recta", rot: 1, sol: 1 },
      { f: 3, c: 3, tipo: "t", rot: 3, sol: 0 },
      { f: 3, c: 4, tipo: "curva", rot: 1, sol: 3 },
    ],
  },
  {
    titulo: "Solo el verde",
    filas: 3, cols: 5, objetivo: ["verde"], apagados: ["rojo"],
    texto: "Ahora el reto es prender <strong>solo el foco verde</strong>: el rojo tiene que quedar <strong>apagado</strong>. Arregla el camino del verde y usa el interruptor para apagar el rojo.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 0, sol: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 0, c: 2, tipo: "t", rot: 2 },
      { f: 0, c: 3, tipo: "interruptor", rot: 1, cerrado: true, solCerrado: false },
      { f: 0, c: 4, tipo: "curva", rot: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 2, tipo: "foco", id: "verde", color: "verde", rot: 0 },
      { f: 1, c: 4, tipo: "foco", id: "rojo", color: "rojo", rot: 0 },
      { f: 2, c: 0, tipo: "curva", rot: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 2, c: 2, tipo: "t", rot: 0 },
      { f: 2, c: 3, tipo: "recta", rot: 1 },
      { f: 2, c: 4, tipo: "curva", rot: 3 },
    ],
  },
  {
    titulo: "El mega circuito",
    filas: 4, cols: 5, objetivo: ["foco1", "motor", "foco2"],
    texto: "¡El más grande! Un foco <strong>en serie</strong> y, después, un motor y otro foco <strong>en paralelo</strong>. Prende las tres cosas.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 3, sol: 1 },
      { f: 0, c: 1, tipo: "foco", id: "foco1", rot: 1 },
      { f: 0, c: 2, tipo: "recta", rot: 0, sol: 1 },
      { f: 0, c: 3, tipo: "t", rot: 0, sol: 2 },
      { f: 0, c: 4, tipo: "curva", rot: 2, sol: 2 },
      { f: 1, c: 0, tipo: "recta", rot: 1, sol: 0 },
      { f: 1, c: 3, tipo: "motor", id: "motor", rot: 0 },
      { f: 1, c: 4, tipo: "recta", rot: 1, sol: 0 },
      { f: 2, c: 0, tipo: "bateria", rot: 0 },
      { f: 2, c: 3, tipo: "recta", rot: 1, sol: 0 },
      { f: 2, c: 4, tipo: "foco", id: "foco2", rot: 0 },
      { f: 3, c: 0, tipo: "curva", rot: 0, sol: 0 },
      { f: 3, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 3, c: 2, tipo: "recta", rot: 1, sol: 1 },
      { f: 3, c: 3, tipo: "t", rot: 3, sol: 0 },
      { f: 3, c: 4, tipo: "curva", rot: 1, sol: 3 },
    ],
  },
  {
    titulo: "La cruz",
    filas: 3, cols: 5, objetivo: ["foco"],
    texto: "Esta pieza en <strong>cruz</strong> une sus 4 lados y está atornillada: no se puede girar. Si los cables la conectan arriba y abajo… ¡cortocircuito! Prende el foco sin que la electricidad se escape por la cruz. <strong>Piensa en qué orden girar</strong> antes de tocar.",
    piezas: [
      { f: 0, c: 0, tipo: "curva", rot: 1 },
      { f: 0, c: 1, tipo: "recta", rot: 0, sol: 1 },
      { f: 0, c: 2, tipo: "t", rot: 2, sol: 0 },
      { f: 0, c: 3, tipo: "recta", rot: 1 },
      { f: 0, c: 4, tipo: "curva", rot: 2 },
      { f: 1, c: 0, tipo: "bateria", rot: 0 },
      { f: 1, c: 2, tipo: "cruz", rot: 0, fija: true },
      { f: 1, c: 4, tipo: "foco", id: "foco", rot: 0 },
      { f: 2, c: 0, tipo: "curva", rot: 0 },
      { f: 2, c: 1, tipo: "recta", rot: 1 },
      { f: 2, c: 2, tipo: "t", rot: 0 },
      { f: 2, c: 3, tipo: "recta", rot: 0, sol: 1 },
      { f: 2, c: 4, tipo: "curva", rot: 1, sol: 3 },
    ],
  },
];

if (typeof module !== "undefined") module.exports = { NIVELES_ROBOT, NIVELES_CIRCUITO };
