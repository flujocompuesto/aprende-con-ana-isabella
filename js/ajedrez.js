// Aprende ajedrez — Aprende con Ana Isabella
// Camino de capítulos con Capi, la capibara, en secciones: lo básico (cómo se
// mueve cada pieza, jaque y mate, cómo empezar y una partida), táctica
// (pieza sola, tenedor, clavada, descubierta), mates de campeona, finales y
// retos. Arriba del camino está la práctica diaria: el problema del día con
// su racha, problemas extra y el reto de coordenadas. Después de cada
// partida se puede revisar "¿Dónde me equivoqué?".
// Reglas: js/ajedrez-motor.js · búsqueda de jugadas: js/ajedrez-busqueda.js ·
// finales: js/ajedrez-finales.js · banco de problemas: js/ajedrez-problemas.js.

const A = Ajedrez;
const GLIFO = { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" };
// Fuerza la versión "texto" del símbolo (sin esto el peón sale como emoji de color).
const glifo = (tipo) => GLIFO[tipo] + "︎";

const INFO_PIEZAS = {
  K: { nombre: "Rey", articulo: "el rey", cuantas: 1, valor: "¡No tiene precio! Si lo atrapan, se acaba el juego.", mueve: "1 casilla en cualquier dirección." },
  Q: { nombre: "Dama (o reina)", articulo: "la dama", cuantas: 1, valor: "9 puntos", mueve: "Las casillas que quiera, en línea recta o en diagonal. ¡Es la más poderosa!" },
  R: { nombre: "Torre", articulo: "la torre", cuantas: 2, valor: "5 puntos", mueve: "En línea recta: adelante, atrás y a los lados." },
  B: { nombre: "Alfil", articulo: "el alfil", cuantas: 2, valor: "3 puntos", mueve: "En diagonal. Siempre se queda en casillas de su mismo color." },
  N: { nombre: "Caballo", articulo: "el caballo", cuantas: 2, valor: "3 puntos", mueve: "En forma de L, y puede saltar sobre otras piezas." },
  P: { nombre: "Peón", articulo: "el peón", cuantas: 8, valor: "1 punto", mueve: "Hacia adelante (la primera vez puede avanzar 2). Come en diagonal." },
};

// ---- Contenido del camino ----
// Tipos de paso: explica, conoce, explora, estrellas, pregunta, escapa, mate,
// mate2, tactica, final, nombrar, coordenadas, jugada, guion y partida. Las
// posiciones se dan con "fen" o con "piezas". Un capítulo con "requiere" se
// abre al ganar al menos 1 ⭐ en el capítulo que nombra.

const CAPITULOS = [
  {
    id: "meta", emoji: "🏰", titulo: "¿De qué se trata?",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, texto: "¡Hola! Soy <strong>Capi</strong> y te voy a enseñar ajedrez. Es un juego para <strong>2 jugadores</strong>: uno usa las piezas <strong>blancas</strong> y el otro las <strong>negras</strong>. Cada uno tiene <strong>16 piezas</strong>." },
      { tipo: "explica", fen: A.INICIAL, marcas: ["e1", "e8"], texto: "La <strong>meta</strong> es atrapar al <strong>rey</strong> del otro equipo para que no pueda escapar. ¡Eso se llama <strong>JAQUE MATE</strong>! No gana quien come más piezas: gana quien atrapa al rey." },
      { tipo: "conoce", fen: A.INICIAL, texto: "Conoce a tu ejército: <strong>toca cada tipo de pieza</strong> para saber cómo se llama, cómo se mueve y cuánto vale." },
      { tipo: "explica", fen: A.INICIAL, marcas: ["h1", "d1"], texto: "Así se arma el tablero: tiene <strong>64 casillas</strong>. La esquina de abajo a la derecha siempre es clara: <strong>¡blanca a la derecha!</strong> Y la dama va en una casilla de <strong>su mismo color</strong>." },
      { tipo: "pregunta", texto: "¿Quién mueve primero?", opciones: [
        { t: "Las blancas ⚪", ok: true, explica: "¡Sí! Las blancas siempre empiezan." },
        { t: "Las negras ⚫" },
        { t: "Quien quiera" },
      ] },
      { tipo: "pregunta", texto: "¿Cómo se gana una partida de ajedrez?", opciones: [
        { t: "Comiendo todas las piezas" },
        { t: "Dando jaque mate al rey", ok: true, explica: "¡Exacto! Atrapar al rey es la meta." },
        { t: "Llegando al otro lado del tablero" },
      ] },
    ],
  },
  {
    id: "torre", emoji: "♜", titulo: "La torre",
    pasos: [
      { tipo: "explora", piezas: { d4: "R" }, texto: "La <strong>torre</strong> se mueve en <strong>línea recta</strong>: adelante, atrás y a los lados, todas las casillas que quiera. <strong>Tócala</strong> para ver a dónde puede ir, y luego muévela." },
      { tipo: "estrellas", piezas: { a1: "R" }, estrellas: ["a5", "e5", "e8"], texto: "¡Recoge todas las estrellas ⭐ con la torre!" },
      { tipo: "estrellas", piezas: { h1: "R", h6: "p", c6: "p", c2: "p" }, texto: "Las piezas se <strong>comen</strong> cayendo en su casilla. ¡Come todos los peones negros con la torre!" },
    ],
  },
  {
    id: "alfil", emoji: "♝", titulo: "El alfil",
    pasos: [
      { tipo: "explora", piezas: { d4: "B" }, texto: "El <strong>alfil</strong> se mueve en <strong>diagonal</strong>, las casillas que quiera. ¿Notas algo? <strong>Siempre se queda en casillas del mismo color.</strong>" },
      { tipo: "estrellas", piezas: { c1: "B" }, estrellas: ["g5", "d8", "a5"], texto: "Recoge las estrellas con el alfil." },
      { tipo: "estrellas", piezas: { f1: "B", b5: "p", e8: "p" }, texto: "¡Ahora come los peones negros con el alfil!" },
    ],
  },
  {
    id: "dama", emoji: "♛", titulo: "La dama",
    pasos: [
      { tipo: "explora", piezas: { d4: "Q" }, texto: "La <strong>dama</strong> (o reina) es la pieza más poderosa: se mueve <strong>como la torre y como el alfil juntos</strong>. ¡Pruébala!" },
      { tipo: "estrellas", piezas: { d1: "Q" }, estrellas: ["d7", "a4", "h4"], texto: "Recoge las estrellas con la dama." },
      { tipo: "estrellas", piezas: { a1: "Q", a8: "r", h8: "r", h1: "r" }, texto: "¡Come las tres torres negras de las esquinas!" },
    ],
  },
  {
    id: "rey", emoji: "♚", titulo: "El rey",
    pasos: [
      { tipo: "explora", piezas: { d4: "K" }, texto: "El <strong>rey</strong> es la pieza más importante, pero es lento: se mueve <strong>1 casilla</strong> en cualquier dirección. ¡Hay que cuidarlo mucho!" },
      { tipo: "estrellas", piezas: { e1: "K" }, estrellas: ["e3", "g3", "g1"], texto: "Lleva al rey a recoger las estrellas, pasito a pasito." },
      { tipo: "explora", piezas: { d4: "K", e8: "r" }, texto: "Regla especial: el rey <strong>nunca</strong> puede ir a una casilla donde lo puedan comer. La torre negra vigila toda la columna <strong>e</strong>. Toca el rey y mira: ¡no lo deja pasar!" },
    ],
  },
  {
    id: "caballo", emoji: "♞", titulo: "El caballo",
    pasos: [
      { tipo: "explora", piezas: { d4: "N", c3: "P", d3: "P", e3: "P", c4: "P", e4: "P", c5: "P", d5: "P", e5: "P" }, texto: "El <strong>caballo</strong> salta en forma de <strong>L</strong>: 2 casillas en una dirección y 1 de lado. ¡Es la única pieza que puede <strong>saltar</strong> sobre otras! Tócalo." },
      { tipo: "estrellas", piezas: { b1: "N" }, estrellas: ["c3", "d5", "f6"], texto: "Salta con el caballo y recoge las estrellas." },
      { tipo: "estrellas", piezas: { c1: "N", d3: "p", e5: "p", g6: "p" }, texto: "¡Come los peones saltando en L!" },
    ],
  },
  {
    id: "peon", emoji: "♟", titulo: "El peón",
    pasos: [
      { tipo: "explora", piezas: { e2: "P", c5: "P" }, texto: "El <strong>peón</strong> camina <strong>hacia adelante</strong>, de a una casilla. En su <strong>primera jugada</strong> puede avanzar <strong>dos</strong>. ¡Nunca camina hacia atrás!" },
      { tipo: "estrellas", piezas: { d2: "P", e3: "p", d4: "p", c5: "p" }, texto: "El peón es especial: camina derecho, pero <strong>come en diagonal</strong>. ¡Come los tres peones negros!" },
      { tipo: "estrellas", piezas: { e2: "P" }, estrellas: ["e8"], texto: "Si un peón llega al otro lado del tablero, <strong>¡corona!</strong> Se convierte en dama. Llévalo hasta la estrella." },
    ],
  },
  {
    id: "jaque", emoji: "👑", titulo: "Jaque y jaque mate",
    pasos: [
      { tipo: "explica", piezas: { e8: "k", e1: "R", g1: "K" }, texto: "Cuando una pieza ataca al rey se dice <strong>¡JAQUE!</strong> Aquí la torre blanca le da jaque al rey negro (mira cómo se pone rojo). El rey en jaque <strong>tiene que salvarse</strong> en su siguiente jugada." },
      { tipo: "pregunta", piezas: { e1: "K", a5: "b", e8: "k" }, ocultarJaque: true, texto: "¿El rey blanco está en jaque?", opciones: [
        { t: "Sí", ok: true, explica: "¡Sí! El alfil negro lo ataca por la diagonal." },
        { t: "No" },
      ] },
      { tipo: "pregunta", piezas: { e1: "K", c3: "n", e8: "k" }, ocultarJaque: true, texto: "¿Y ahora? ¿El rey blanco está en jaque?", opciones: [
        { t: "Sí" },
        { t: "No", ok: true, explica: "¡Bien! El caballo salta en L y no llega al rey." },
      ] },
      { tipo: "escapa", piezas: { e1: "K", a3: "R", e4: "r", e8: "k" }, texto: "¡Tu rey está en jaque! Hay 3 formas de salvarlo: <strong>moverlo</strong>, <strong>tapar</strong> el ataque con otra pieza, o <strong>comer</strong> a la pieza que ataca. ¡Sálvalo!" },
      { tipo: "explica", piezas: { h8: "k", g7: "Q", f6: "K" }, texto: "Si el rey está en jaque y <strong>no tiene ninguna forma de salvarse</strong>, es <strong>JAQUE MATE</strong> y el juego termina. Aquí la dama blanca, protegida por su rey, atrapa al rey negro." },
      { tipo: "mate", fen: "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1", texto: "¡Tu turno! Da <strong>jaque mate en 1 jugada</strong> con la torre." },
      { tipo: "mate", fen: "7k/8/6K1/8/8/8/8/4Q3 w - - 0 1", texto: "Da jaque mate con la dama. Tu rey le cierra las salidas." },
      { tipo: "mate", fen: "6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1", texto: "¡Mate del caballo! El rey negro está rodeado por sus propias piezas…" },
    ],
  },
  {
    id: "apertura", emoji: "🚀", titulo: "Cómo empezar la partida",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, marcas: ["d4", "e4", "d5", "e5"], texto: "Para empezar bien, sigue las <strong>4 reglas de oro</strong>:<ol><li>🎯 Controla el <strong>centro</strong> (las casillas marcadas) con un peón.</li><li>🐴 Saca tus <strong>caballos y alfiles</strong>.</li><li>🏰 <strong>Enroca</strong> para proteger a tu rey.</li><li>✋ No saques la <strong>dama</strong> muy pronto.</li></ol>" },
      { tipo: "jugada", fen: A.INICIAL, texto: "Haz tu <strong>primera jugada</strong>: mueve un peón del centro o saca un caballo.",
        buenas: {
          e2e4: "¡Excelente! El peón del rey controla el centro.",
          d2d4: "¡Muy bien! El peón de la dama controla el centro.",
          g1f3: "¡Bien! El caballo sale mirando al centro.",
          b1c3: "¡Bien! El caballo sale mirando al centro.",
        },
        consejo: "Esa jugada no ayuda mucho a controlar el centro. Prueba con el peón de <strong>e2</strong> o de <strong>d2</strong>, o con un caballo." },
      { tipo: "guion", fen: A.INICIAL, texto: "Ahora juega conmigo una apertura famosa: la <strong>Italiana</strong>. Yo te digo qué mover y las negras responden solas.",
        jugadas: [
          { blanca: "e2e4", texto: "1️⃣ Mueve el peón de <strong>e2</strong> dos casillas, a <strong>e4</strong>: ¡controla el centro!", negra: "e7e5", textoNegra: "Las negras hacen lo mismo." },
          { blanca: "g1f3", texto: "2️⃣ Saca el <strong>caballo</strong> de g1 a <strong>f3</strong>: ataca el peón negro de e5.", negra: "b8c6", textoNegra: "Las negras defienden su peón con el caballo." },
          { blanca: "f1c4", texto: "3️⃣ Saca el <strong>alfil</strong> de f1 a <strong>c4</strong>: apunta a f7, el punto débil de las negras.", negra: "f8c5", textoNegra: "Las negras también sacan su alfil." },
          { blanca: "e1g1", texto: "4️⃣ ¡<strong>Enroca</strong>! Toca el rey y llévalo <strong>dos casillas</strong> hacia la torre, a <strong>g1</strong>. La torre salta sola al otro lado. (Solo se puede si el rey y la torre no se han movido.)", negra: "g8f6", textoNegra: "Las negras sacan su otro caballo." },
          { blanca: "d2d3", texto: "5️⃣ Mueve el peón de d2 a <strong>d3</strong>: protege tu peón de e4 y le abre camino a tu otro alfil." },
        ],
        final: "¡Perfecto! 🎉 Controlaste el centro, sacaste tus piezas y tu rey está seguro. ¡Así se empieza una partida!" },
      { tipo: "mate", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", texto: "⚠️ Una trampa famosa: el <strong>Mate del Pastor</strong>. La dama y el alfil atacan juntos la casilla <strong>f7</strong>. ¡Da jaque mate! (Si alguien te la quiere hacer a ti, protege f7.)" },
      { tipo: "pregunta", texto: "¿Cuál de estas <strong>NO</strong> es una buena idea al empezar?", opciones: [
        { t: "Controlar el centro" },
        { t: "Sacar la dama muy pronto", ok: true, explica: "¡Exacto! La dama es muy valiosa y al principio la pueden perseguir." },
        { t: "Sacar caballos y alfiles" },
        { t: "Enrocar" },
      ] },
    ],
  },
  {
    id: "partida", emoji: "🎮", titulo: "¡Juega una partida!",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, texto: "¡Llegó la hora de jugar una partida completa contra mí, Capi! 🍊 Tú juegas con las <strong>blancas</strong>. Usa las reglas de oro: centro, saca tus piezas y enroca. Si te equivocas puedes <strong>deshacer</strong>, y si no sabes qué jugar pide <strong>ayuda</strong> 💡." },
      { tipo: "partida" },
    ],
  },
  // ---- Nivel experto: se abren al terminar el capítulo que piden ----
  // ---- Táctica: trucos para ganar piezas ----
  // En "tactica", la niña juega las blancas de "linea" y la compu las negras;
  // "buenas" son otras primeras jugadas que también ganan. Todo verificado
  // con el motor (herramientas/probar-ajedrez.js).
  {
    id: "colgada", emoji: "🎯", titulo: "¡Pieza sola!", requiere: "jaque",
    pasos: [
      { tipo: "explica", fen: "6k1/2p2ppp/3b4/n7/8/8/3Q1PPP/6K1 w - - 0 1", marcas: ["a5", "d6"], texto: "Una pieza está <strong>sola</strong> (o «colgada») cuando nadie la cuida: si la atacas, ¡te la comes gratis! Pero si está <strong>cuidada</strong>, al comerla te comen a ti. Aquí el caballo de a5 está solo y el alfil de d6 lo cuida un peón. Antes de cada jugada, pregúntate: <em>¿qué pieza del otro está sola?</em>" },
      { tipo: "tactica", fen: "6k1/8/8/3r4/8/8/8/3R2K1 w - - 0 1", linea: ["d1d5"], gana: "una torre", texto: "La torre negra está sola. ¡Cómetela!" },
      { tipo: "tactica", fen: "6k1/5pp1/5n2/8/r2Q4/8/5PPP/6K1 w - - 0 1", linea: ["d4a4"], gana: "una torre", texto: "La torre negra ataca a tu dama… pero, ¿quién la cuida a ella?" },
      { tipo: "tactica", fen: "6k1/2p2ppp/3b4/n7/8/8/3Q1PPP/6K1 w - - 0 1", linea: ["d2a5"], gana: "un caballo", texto: "Tu dama puede comer dos piezas: una está sola y la otra la cuida un peón. ¿Cuál te comes?" },
      { tipo: "tactica", fen: "r5k1/5ppp/8/8/2b5/8/3N1PPP/3R2K1 w - - 0 1", linea: ["d2c4"], gana: "un alfil", texto: "¿Hay alguna pieza negra sola? Ojo con la trampa: la casilla d8 la cuida la torre negra." },
    ],
  },
  {
    id: "tenedor", emoji: "🍴", titulo: "El tenedor", requiere: "colgada",
    pasos: [
      { tipo: "explica", fen: "r3k3/2N5/8/8/8/8/8/4K3 w - - 0 1", marcas: ["e8", "a8"], texto: "Un <strong>tenedor</strong> 🍴 es cuando UNA pieza ataca a DOS al mismo tiempo. El otro solo puede salvar una… ¡y tú te comes la otra! El caballo es el campeón de los tenedores: aquí ataca al rey y a la torre a la vez." },
      { tipo: "tactica", fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1", linea: ["d5c7", "e8d7", "c7a8"], gana: "una torre", texto: "¡Tu turno! Busca el salto del caballo que ataca al rey y a la torre." },
      { tipo: "tactica", fen: "2q3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1", linea: ["d5e7", "g8f8", "e7c8"], gana: "la dama", texto: "¿Ves al rey y a la dama negra? Un salto del caballo los ataca a los dos." },
      { tipo: "tactica", fen: "7k/8/2n1b3/8/2PP4/8/8/4K3 w - - 0 1", linea: ["d4d5", "c6d8", "d5e6"], gana: "un alfil", texto: "¡Hasta un peón puede hacer tenedor! Avánzalo para atacar a dos piezas." },
      { tipo: "tactica", fen: "4k3/8/8/8/7n/8/8/3QK3 w - - 0 1", linea: ["d1a4", "e8f7", "a4h4"], buenas: ["d1a4", "d1g4", "d1h5"], gana: "un caballo", texto: "Tenedor de dama: da jaque y, al mismo tiempo, ataca al caballo." },
    ],
  },
  {
    id: "clavada", emoji: "📌", titulo: "La clavada", requiere: "tenedor",
    pasos: [
      { tipo: "explica", fen: "4k3/8/8/4q3/8/8/3K4/4R3 w - - 0 1", marcas: ["e5", "e8"], texto: "Una <strong>clavada</strong> 📌: la dama negra no se puede salir de la columna porque detrás está su rey (si se sale, el rey quedaría en jaque). Las torres, los alfiles y la dama pueden clavar." },
      { tipo: "tactica", fen: "4k3/8/8/4q3/8/8/3K4/R7 w - - 0 1", linea: ["a1e1", "e5e7", "e1e7"], gana: "la dama", texto: "Clava a la dama contra su rey con la torre." },
      { tipo: "tactica", fen: "4k3/3q4/8/8/P7/8/8/4KB2 w - - 0 1", linea: ["f1b5", "e8e7", "b5d7"], gana: "la dama", texto: "Ahora con el alfil: clava a la dama contra el rey. Tu peón cuida la casilla." },
      { tipo: "tactica", fen: "4k3/1p6/2n5/1B6/3P4/8/8/4K3 w - - 0 1", linea: ["d4d5", "e8d7", "d5c6"], gana: "un caballo", texto: "El caballo negro está clavado: no se puede mover. ¡Atácalo con algo pequeño!" },
    ],
  },
  {
    id: "descubierta", emoji: "🎭", titulo: "Ataque a la descubierta", requiere: "clavada",
    pasos: [
      { tipo: "explica", fen: "4k3/8/8/7q/4B3/8/8/4R1K1 w - - 0 1", marcas: ["e1", "e4", "e8"], texto: "En el <strong>ataque a la descubierta</strong> 🎭 una pieza se mueve y «destapa» a otra que estaba detrás. Aquí, si el alfil se quita, la torre da jaque… ¡y el alfil puede atacar otra cosa en la misma jugada!" },
      { tipo: "tactica", fen: "4k3/8/8/7q/4B3/8/8/4R1K1 w - - 0 1", linea: ["e4g6", "e8d7", "g6h5"], buenas: ["e4g6", "e4f3"], gana: "la dama", texto: "Mueve el alfil para que la torre dé jaque… y que el alfil ataque a la dama." },
      { tipo: "tactica", fen: "3qk3/8/8/8/8/3B4/8/3RK3 w - - 0 1", linea: ["d3b5", "e8e7", "d1d8"], buenas: ["d3b5", "d3g6"], gana: "la dama", texto: "Tu torre mira a la dama negra, pero tu alfil está en medio. ¡Quítalo dando jaque!" },
    ],
  },
  // ---- Mates de campeona ----
  {
    id: "mates", emoji: "🏹", titulo: "Mates difíciles", requiere: "jaque",
    pasos: [
      { tipo: "explica", fen: "7k/R7/8/8/8/8/8/1R4K1 w - - 0 1", texto: "Ya sabes dar jaque mate. Ahora vienen <strong>mates famosos</strong> que usan los campeones desde hace siglos. A veces la jugada ganadora no es la más obvia: antes de mover, <strong>revisa todos los jaques</strong> que puedes dar." },
      { tipo: "mate", fen: "6k1/5ppp/8/q7/8/8/3B1PPP/4R1K1 w - - 0 1", texto: "¡La dama negra está suelta! Pero hay algo <strong>mejor</strong> que comérsela… Da jaque mate en 1." },
      { tipo: "mate", fen: "7k/R7/8/8/8/8/8/1R4K1 w - - 0 1", texto: "<strong>Mate de la escalera</strong>: una torre cierra una fila y la otra da el mate. ¡Encuéntralo!" },
      { tipo: "mate", fen: "7k/8/5N2/8/8/8/8/6RK w - - 0 1", texto: "El <strong>mate árabe</strong> tiene más de mil años: el caballo y la torre trabajan juntos. ¡Da jaque mate!" },
      { tipo: "mate", fen: "6k1/5p1p/5PpQ/8/8/8/8/6K1 w - - 0 1", texto: "La dama necesita una <strong>amiga</strong> que la cuide… ¡un peón! Da jaque mate." },
      { tipo: "mate", fen: "2kr4/3p4/8/8/5B2/8/4B3/6K1 w - - 0 1", texto: "<strong>Mate de Boden</strong>: dos alfiles que se cruzan como tijeras ✂️. Uno ya está en su lugar… ¿dónde va el otro?" },
    ],
  },
  {
    id: "mate2", emoji: "🧠", titulo: "Mate en 2", requiere: "mates",
    pasos: [
      { tipo: "explica", fen: "7k/8/8/8/8/8/R7/1R4K1 w - - 0 1", texto: "En el <strong>mate en 2</strong> haces una jugada, Capi se defiende como pueda, y después das el mate. La pregunta es: ¿qué jugada deja al rey <strong>sin salida, haga lo que haga</strong>?" },
      { tipo: "mate2", fen: "7k/8/8/8/8/8/R7/1R4K1 w - - 0 1", texto: "Mate en 2 con las dos torres: la primera <strong>encierra</strong> al rey y la segunda da el mate." },
      { tipo: "mate2", fen: "2r3k1/5ppp/8/8/8/8/3Q1PPP/3R2K1 w - - 0 1", texto: "¡Un truco de campeona! A veces hay que <strong>regalar la dama</strong> para dar mate. La torre negra no puede cuidar todo a la vez…" },
      { tipo: "mate2", fen: "5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1", texto: "El <strong>mate ahogado</strong>: el rey negro queda encerrado por sus propias piezas. Primero un sacrificio, después el caballo… 🐴" },
      { tipo: "mate2", fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 18", texto: "El mate más famoso de la historia: Paul Morphy lo dio en 1858 jugando en un palco de la <strong>ópera de París</strong> 🎭. ¡Regala la dama y da mate en 2!" },
    ],
  },
  // ---- Finales: con poquitas piezas ----
  {
    id: "final-dama", emoji: "👑", titulo: "Mate con la dama", requiere: "jaque",
    pasos: [
      { tipo: "explica", fen: "8/8/3k4/8/8/8/8/Q3K3 w - - 0 1", texto: "Con rey y dama contra el rey solo, ¡siempre se gana! El truco es <strong>la caja</strong> 📦: la dama encierra al rey negro en un espacio cada vez más chico, y tu rey se acerca a ayudar. ⚠️ Si el rey negro <strong>no</strong> está en jaque y no puede moverse, es <strong>ahogado</strong>: ¡empate! Déjale siempre una casilla." },
      { tipo: "final", fen: "4k3/8/8/8/8/8/8/3QK3 w - - 0 1", objetivo: "mate", max: 30, texto: "El rey negro ya está en la orilla. ¡Dale jaque mate! Si te trabas, pide una pista 💡." },
      { tipo: "final", fen: "8/8/8/4k3/8/8/8/K6Q w - - 0 1", objetivo: "mate", max: 30, texto: "Ahora el rey negro está en el centro. Achica la caja con la dama y acerca tu rey." },
    ],
  },
  {
    id: "final-torre", emoji: "🗼", titulo: "Mate con la torre", requiere: "final-dama",
    pasos: [
      { tipo: "explica", fen: "8/8/8/4k3/8/8/8/R5K1 w - - 0 1", texto: "Con la torre también se gana, pero tu rey tiene que trabajar más. La torre <strong>corta</strong> al rey negro (no lo deja cruzar su fila o su columna) y tu rey se le pone de frente. El mate es siempre en la <strong>orilla</strong>." },
      { tipo: "final", fen: "4k3/8/8/8/8/8/8/R3K3 w - - 0 1", objetivo: "mate", max: 30, texto: "El rey negro está en la orilla. ¡Dale jaque mate con la torre!" },
      { tipo: "final", fen: "8/8/8/4k3/8/8/8/R5K1 w - - 0 1", objetivo: "mate", max: 40, texto: "Desde el centro: corta con la torre, acerca tu rey y empuja al rey negro hasta la orilla." },
    ],
  },
  {
    id: "cuadrado", emoji: "🔲", titulo: "La regla del cuadrado", requiere: "peon",
    pasos: [
      { tipo: "explica", fen: "8/8/8/P6k/8/8/8/7K w - - 0 1", marcas: ["a5", "b5", "c5", "d5", "a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"], texto: "¿El rey negro alcanza a tu peón antes de que corone? Dibuja un <strong>cuadrado</strong> desde el peón hasta la orilla donde corona (el marcado). Si el rey negro puede <strong>meterse en el cuadrado</strong> en su jugada, alcanza al peón. Si no… ¡el peón corona!" },
      { tipo: "pregunta", fen: "8/8/8/P6k/8/8/8/7K w - - 0 1", marcas: ["a5", "b5", "c5", "d5", "a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"], texto: "Le toca al rey negro. ¿Puede meterse en el cuadrado y alcanzar al peón?", opciones: [
        { t: "No: está muy lejos", ok: true, explica: "¡Exacto! Aunque camine, no llega a tiempo: el peón corona." },
        { t: "Sí, lo alcanza" },
      ] },
      { tipo: "pregunta", fen: "8/8/8/P7/4k3/8/8/7K w - - 0 1", marcas: ["a5", "b5", "c5", "d5", "a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"], texto: "¿Y ahora? Le toca al rey negro.", opciones: [
        { t: "Sí: con un paso se mete en el cuadrado", ok: true, explica: "¡Sí! Va a d5, entra al cuadrado y atrapa al peón." },
        { t: "No, el peón corona" },
      ] },
      { tipo: "final", fen: "8/8/8/8/1k6/8/7P/7K w - - 0 1", objetivo: "corona", max: 8, texto: "¡Corona el peón! El rey negro va a correr… Recuerda: desde la fila 2 el peón puede avanzar <strong>dos</strong> casillas." },
    ],
  },
  // ---- Retos ----
  {
    id: "coordenadas", emoji: "🧭", titulo: "Coordenadas", requiere: "meta",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, marcas: ["e4"], texto: "Cada casilla tiene <strong>nombre</strong>: una letra (la columna, de la <strong>a</strong> a la <strong>h</strong>) y un número (la fila, del <strong>1</strong> al <strong>8</strong>). La casilla marcada es la <strong>e4</strong>. Mira las letras abajo y los números a la izquierda del tablero." },
      { tipo: "nombrar", cantidad: 8, texto: "¿Cómo se llama la casilla marcada? Busca su letra abajo y su número a la izquierda." },
      { tipo: "explica", fen: A.INICIAL, texto: "Las jugadas se escriben con la letra de la pieza y la casilla adonde va: <strong>R</strong> rey, <strong>D</strong> dama, <strong>T</strong> torre, <strong>A</strong> alfil, <strong>C</strong> caballo (el peón no lleva letra).<br>Ejemplos: <strong>e4</strong> = un peón va a e4 · <strong>Cf3</strong> = un caballo va a f3 · <strong>Axe5</strong> = un alfil <em>come</em> en e5 · <strong>+</strong> es jaque y <strong>#</strong> es mate." },
      { tipo: "pregunta", fen: A.INICIAL, texto: "¿Qué quiere decir <strong>Cf3</strong>?", opciones: [
        { t: "Un caballo va a f3", ok: true, explica: "¡Sí! C es caballo y f3 es la casilla." },
        { t: "El rey va a f3", explica: "El rey se escribe con R." },
        { t: "Un peón come en f3", explica: "El peón no lleva letra, y «come» se escribe con x." },
      ] },
      { tipo: "pregunta", fen: A.INICIAL, texto: "¿Y qué quiere decir <strong>Dxh7#</strong>?", opciones: [
        { t: "La dama come en h7 y es jaque mate", ok: true, explica: "D = dama, x = come, # = ¡mate!" },
        { t: "La dama va a h7 y es jaque", explica: "La x quiere decir que come, y # es mate (el jaque es +)." },
        { t: "Un caballo come en h7", explica: "El caballo es C; la D es la dama." },
      ] },
      { tipo: "coordenadas", segundos: 30, texto: "¡Reto contra reloj! Toca la casilla que te pido. Esta vez el tablero <strong>no tiene letras</strong>: ¡usa la memoria! Tienes 30 segundos." },
    ],
  },
  {
    id: "experta", emoji: "🎓", titulo: "Reto: Capi experta", requiere: "partida",
    pasos: [
      { tipo: "explica", fen: A.INICIAL, texto: "El último reto: <strong>Capi experta</strong>, con su birrete de graduada 🎓. Piensa <strong>2 jugadas adelante</strong>: casi nunca regala piezas y aprovecha las que tú dejes sueltas. Antes de cada jugada pregúntate: <em>¿qué me puede comer?</em> Ganarle vale ⭐⭐⭐ y empatar ⭐⭐." },
      { tipo: "partida", rival: "experta" },
    ],
  },
];

// Secciones del camino: cada una empieza en el capítulo "desde".
const SECCIONES = [
  { desde: "meta", titulo: "Lo básico" },
  { desde: "colgada", titulo: "Táctica: trucos para ganar piezas" },
  { desde: "mates", titulo: "Mates de campeona" },
  { desde: "final-dama", titulo: "Finales" },
  { desde: "coordenadas", titulo: "Retos" },
];

// ---- Estado ----

let capIndice = 0;
let pasoIndice = 0;
let erroresPaso = [];
let pos = null;
let seleccion = null;
let destinos = [];
let marcas = new Set();
let objetivos = new Set();
let ultimo = null;
let ocultarJaque = false;
let bloqueado = false;
let alMover = null; // qué hacer cuando la niña mueve una pieza
let alTocar = null; // pasos donde tocar una casilla hace otra cosa
let casillasError = new Set(); // la jugada equivocada que se revisa
let volteado = false; // tablero visto desde las negras
let colorJugador = "w"; // qué piezas se pueden tocar (en las partidas entre dos, cambia)
// Problema del día / práctica / revisión: fuera de los capítulos. Si existe,
// mostrarSiguiente() le avisa a él en vez de pasar al siguiente paso.
let modoSuelto = null;
// Cambia al salir de un paso; los temporizadores viejos lo comparan y no hacen nada.
let sesion = 0;

const pantallaMapa = document.getElementById("pantalla-mapa");
const pantallaLeccion = document.getElementById("pantalla-leccion");
const pantallaFin = document.getElementById("pantalla-fin");
const capitulosEl = document.getElementById("capitulos");
const tituloEl = document.getElementById("titulo-capitulo");
const puntosPasosEl = document.getElementById("puntos-pasos");
const textoEl = document.getElementById("texto-paso");
const tableroEl = document.getElementById("tablero-ajedrez");
const panelEl = document.getElementById("panel-ajedrez");
const mensajeEl = document.getElementById("mensaje-ajedrez");
const accionesEl = document.getElementById("acciones-paso");
const practicaEl = document.getElementById("practica-diaria");
const botonRevisar = document.getElementById("btn-revisar");

function mostrarPantalla(p) {
  [pantallaMapa, pantallaLeccion, pantallaFin].forEach((x) => (x.hidden = x !== p));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function posicionCon(piezas) {
  const tablero = Array(64).fill(null);
  Object.entries(piezas).forEach(([casilla, p]) => (tablero[A.indiceCasilla(casilla)] = p));
  return { tablero, turno: "w", enroques: { K: false, Q: false, k: false, q: false }, alPaso: null };
}

function posDePaso(paso) {
  if (paso.fen) return A.desdeFEN(paso.fen);
  if (paso.piezas) return posicionCon(paso.piezas);
  return null;
}

function mezclar(lista) {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

// Tres casillas que se confunden con "i": misma columna, misma fila, y la
// fila "dada vuelta" (contar desde arriba es el error más común).
function parecidas(i) {
  const f = Math.floor(i / 8);
  const c = i % 8;
  const opciones = new Set([(7 - f) * 8 + c, f * 8 + ((c + 1 + Math.floor(Math.random() * 6)) % 8), ((f + 1 + Math.floor(Math.random() * 6)) % 8) * 8 + c]);
  opciones.delete(i);
  while (opciones.size < 3) {
    const otra = Math.floor(Math.random() * 64);
    if (otra !== i) opciones.add(otra);
  }
  return [...opciones].slice(0, 3);
}

const quedanNegras = () => pos.tablero.some((p) => p && A.colorDe(p) === "b");
const claveMovimiento = (m) => A.nombreCasilla(m.desde) + A.nombreCasilla(m.hasta);

function buscarMovimiento(posicion, clave) {
  const desde = A.indiceCasilla(clave.slice(0, 2));
  const hasta = A.indiceCasilla(clave.slice(2, 4));
  return A.legales(posicion, desde).find((m) => m.hasta === hasta && (!m.promocion || A.tipoDe(m.promocion) === "Q"));
}

// ---- Mapa de capítulos ----

function pintarMapa() {
  const guardado = Aprende.progreso().ajedrez || {};
  // Los capítulos expertos se abren al terminar el que piden.
  const abierto = (cap) => !cap.requiere || (guardado[cap.requiere] || 0) > 0;
  const sugerido = CAPITULOS.findIndex((c) => !guardado[c.id] && abierto(c));
  capitulosEl.innerHTML = "";
  CAPITULOS.forEach((cap, i) => {
    const seccion = SECCIONES.find((s) => s.desde === cap.id);
    if (seccion) {
      const titulo = document.createElement("h3");
      titulo.className = "seccion-ajedrez";
      titulo.textContent = seccion.titulo;
      capitulosEl.appendChild(titulo);
    }
    const boton = document.createElement("button");
    boton.className = "capitulo-card" + (i === sugerido ? " sugerido" : "");
    boton.disabled = !abierto(cap);
    const estrellas = guardado[cap.id] || 0;
    const previo = cap.requiere && CAPITULOS.find((c) => c.id === cap.requiere);
    const estado = !abierto(cap)
      ? `🔒 Termina «${previo.titulo}»`
      : estrellas ? Aprende.textoEstrellas(estrellas) : i === sugerido ? "👉 ¡Sigue aquí!" : "&nbsp;";
    boton.innerHTML = `
      <span class="numero">${i + 1}</span>
      <span class="emoji">${cap.emoji}</span>
      <span class="titulo">${cap.titulo}</span>
      <span class="estrellas-cap">${estado}</span>`;
    boton.addEventListener("click", () => abrirCapitulo(i));
    capitulosEl.appendChild(boton);
  });
  pintarPractica();
}

function abrirCapitulo(i) {
  // Un capítulo experto cerrado (por ejemplo, desde "Siguiente capítulo") lleva al mapa.
  const req = CAPITULOS[i].requiere;
  if (req && !((Aprende.progreso().ajedrez || {})[req] > 0)) {
    pintarMapa();
    mostrarPantalla(pantallaMapa);
    return;
  }
  capIndice = i;
  pasoIndice = 0;
  erroresPaso = [];
  tituloEl.textContent = `${CAPITULOS[i].emoji} ${CAPITULOS[i].titulo}`;
  mostrarPantalla(pantallaLeccion);
  mostrarPaso();
}

// ---- Tablero ----

function pintarTablero() {
  tableroEl.hidden = !pos;
  if (!pos) return;
  const reyesEnJaque = ocultarJaque
    ? []
    : ["w", "b"].filter((c) => A.enJaque(pos, c)).map((c) => pos.tablero.indexOf(c === "w" ? "K" : "k"));
  tableroEl.innerHTML = "";
  // Dado vuelta, la casilla h1 queda arriba a la izquierda.
  for (let k = 0; k < 64; k++) {
    const i = volteado ? 63 - k : k;
    const f = Math.floor(i / 8);
    const c = i % 8;
    const casilla = document.createElement("button");
    casilla.className = "casilla " + ((f + c) % 2 === 0 ? "clara" : "oscura");
    if (ultimo && (i === ultimo.desde || i === ultimo.hasta)) casilla.classList.add("ultima");
    if (marcas.has(i)) casilla.classList.add("marcada");
    if (casillasError.has(i)) casilla.classList.add("jugada-error");
    if (i === seleccion) casilla.classList.add("seleccionada");
    if (reyesEnJaque.includes(i)) casilla.classList.add("en-jaque");
    const destino = destinos.find((d) => d.hasta === i);
    if (destino) casilla.classList.add(destino.captura ? "destino-captura" : "destino");

    const p = pos.tablero[i];
    let etiqueta = A.nombreCasilla(i);
    if (p) {
      const blanca = A.colorDe(p) === "w";
      casilla.innerHTML = `<span class="pieza ${blanca ? "blanca" : "negra"}">${glifo(A.tipoDe(p))}</span>`;
      etiqueta += ` ${INFO_PIEZAS[A.tipoDe(p)].nombre} de las ${blanca ? "blancas" : "negras"}`;
    } else if (objetivos.has(i)) {
      casilla.innerHTML = '<span class="objetivo">⭐</span>';
      etiqueta += " estrella";
    }
    if (c === (volteado ? 7 : 0)) casilla.insertAdjacentHTML("beforeend", `<span class="coord fila">${8 - f}</span>`);
    if (f === (volteado ? 0 : 7)) casilla.insertAdjacentHTML("beforeend", `<span class="coord columna">${"abcdefgh"[c]}</span>`);
    casilla.setAttribute("aria-label", etiqueta);
    casilla.addEventListener("click", () => tocarCasilla(i));
    tableroEl.appendChild(casilla);
  }
}

function tocarCasilla(i) {
  if (bloqueado || !pos) return;
  if (alTocar) {
    alTocar(i);
    return;
  }
  if (!alMover) return;
  if (seleccion !== null) {
    // Si el peón corona, se convierte en dama.
    const m = destinos.find((d) => d.hasta === i && (!d.promocion || A.tipoDe(d.promocion) === "Q"));
    if (m) {
      seleccion = null;
      destinos = [];
      alMover(m);
      return;
    }
  }
  const p = pos.tablero[i];
  if (p && A.colorDe(p) === colorJugador && i !== seleccion) {
    seleccion = i;
    destinos = A.legales(pos, i);
    Aprende.sonido.clic();
    if (!destinos.length) mensaje("Esa pieza no se puede mover ahora.");
  } else {
    seleccion = null;
    destinos = [];
  }
  pintarTablero();
}

// Aplica un movimiento. En los ejercicios las negras no juegan, así que el turno vuelve a las blancas.
function aplicar(m, mantenerTurno = false) {
  pos = A.mover(pos, m);
  if (mantenerTurno) pos = { ...pos, turno: "w" };
  ultimo = { desde: m.desde, hasta: m.hasta };
  seleccion = null;
  destinos = [];
  Aprende.sonido.paso();
  pintarTablero();
}

// ---- Interfaz de cada paso ----

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

function agregarBoton(texto, clase, accion) {
  const boton = document.createElement("button");
  boton.className = `boton ${clase}`;
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  accionesEl.appendChild(boton);
  return boton;
}

function mostrarSiguiente() {
  if (modoSuelto) {
    modoSuelto.alResolver();
    return;
  }
  if (accionesEl.querySelector(".btn-siguiente-paso")) return;
  const ultimoPaso = pasoIndice === CAPITULOS[capIndice].pasos.length - 1;
  const boton = agregarBoton(ultimoPaso ? "Terminar capítulo" : "Siguiente →", "ejecutar btn-siguiente-paso", siguientePaso);
  Aprende.efecto.rebote(boton);
}

function contarError() {
  erroresPaso[pasoIndice] = (erroresPaso[pasoIndice] || 0) + 1;
}

function pintarPuntosPasos() {
  const total = CAPITULOS[capIndice].pasos.length;
  puntosPasosEl.innerHTML = Array.from({ length: total }, (_, i) =>
    `<span class="punto-paso${i < pasoIndice ? " hecho" : ""}${i === pasoIndice ? " actual" : ""}"></span>`
  ).join("");
}

function mostrarPaso() {
  modoSuelto = null;
  prepararPaso(CAPITULOS[capIndice].pasos[pasoIndice]);
  pintarPuntosPasos();
}

// Deja la pantalla limpia y arma el paso (de un capítulo o suelto).
function prepararPaso(paso) {
  sesion++;
  CapiRival.ocultar();
  volteado = false;
  colorJugador = "w";
  tableroEl.classList.remove("sin-coordenadas");
  casillasError = new Set();
  pos = posDePaso(paso);
  seleccion = null;
  destinos = [];
  ultimo = null;
  marcas = new Set((paso.marcas || []).map(A.indiceCasilla));
  objetivos = new Set();
  ocultarJaque = !!paso.ocultarJaque;
  bloqueado = false;
  alMover = null;
  alTocar = null;
  panelEl.innerHTML = "";
  accionesEl.innerHTML = "";
  mensaje("");
  textoEl.innerHTML = paso.texto || "";
  PASOS[paso.tipo](paso);
  pintarTablero();
}

function siguientePaso() {
  const cap = CAPITULOS[capIndice];
  if (pasoIndice < cap.pasos.length - 1) {
    pasoIndice++;
    mostrarPaso();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const errores = erroresPaso.reduce((s, n) => s + (n || 0), 0);
  let estrellas = 1;
  if (errores === 0) estrellas = 3;
  else if (errores <= 2) estrellas = 2;
  const textos = {
    3: "¡Capítulo completo! Eres una gran estudiante de ajedrez.",
    2: "¡Muy bien! Capítulo completo.",
    1: "¡Capítulo completo! Practica otra vez para ganar más estrellas.",
  };
  const resumen = errores === 0 ? "¡Sin ningún error!" : `Tuviste ${errores} ${errores === 1 ? "error" : "errores"}.`;
  terminarCapitulo(estrellas, textos[estrellas], resumen);
}

function terminarCapitulo(estrellas, felicitacion, resumen = "") {
  mostrarPantalla(pantallaFin);
  botonRevisar.hidden = true;
  document.getElementById("fin-estrellas").textContent = Aprende.textoEstrellas(estrellas);
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-resumen").textContent = resumen;
  Aprende.finDePartida("ajedrez", CAPITULOS[capIndice].id, estrellas);
  document.getElementById("btn-siguiente-cap").hidden = capIndice === CAPITULOS.length - 1;
  pintarMapa();
}

// Menor cantidad de jugadas para recoger todas las estrellas y comer todo.
function minimoMovimientos(inicio, estrellas) {
  const clave = (p, est) => p.tablero.map((x) => x || ".").join("") + "|" + [...est].sort().join(",");
  const cola = [[inicio, estrellas, 0]];
  const visto = new Set([clave(inicio, estrellas)]);
  while (cola.length) {
    const [p, est, d] = cola.shift();
    if (est.size === 0 && !p.tablero.some((x) => x && A.colorDe(x) === "b")) return d;
    for (const m of A.todosLegales(p, "w")) {
      if (m.promocion && A.tipoDe(m.promocion) !== "Q") continue;
      const nueva = { ...A.mover(p, m), turno: "w" };
      const resto = new Set(est);
      resto.delete(m.hasta);
      const k = clave(nueva, resto);
      if (!visto.has(k)) {
        visto.add(k);
        cola.push([nueva, resto, d + 1]);
      }
    }
  }
  return Infinity;
}

// Jugadas de las blancas que dan jaque mate ya mismo.
const matesEn1 = (p) => A.todosLegales(p, "w").filter((x) => A.situacion(A.mover(p, x), "b") === "mate");

// ¿La jugada m fuerza el mate en 2? Sí, si toda defensa negra deja un mate en 1.
function fuerzaMateEn2(p, m) {
  const n = A.mover(p, m);
  const defensas = A.todosLegales(n, "b");
  return defensas.length > 0 && defensas.every((d) => matesEn1(A.mover(n, d)).length > 0);
}

// Pide dar jaque mate en 1 desde la posición actual. Si la jugada no es
// mate, se ve un momento y se devuelve; con 2 fallos aparece la pista.
// Devuelve la función que muestra la pista.
function pedirMate(textoExito = "¡JAQUE MATE! 🎉 El rey negro no tiene escape.") {
  let fallos = 0;
  const darPista = () => {
    const m = matesEn1(pos)[0];
    if (!m) return;
    marcas = new Set([m.desde]);
    pintarTablero();
    mensaje(`💡 Pista: la jugada ganadora es con ${INFO_PIEZAS[A.tipoDe(m.pieza)].articulo}. ¡Está marcada!`);
    CapiRival.reaccionar("pista");
  };
  alMover = (m) => {
    const nueva = A.mover(pos, m);
    const resultado = A.situacion(nueva, "b");
    if (resultado === "mate") {
      pos = nueva;
      ultimo = { desde: m.desde, hasta: m.hasta };
      marcas = new Set();
      alMover = null;
      pintarTablero();
      CapiRival.reaccionar("pierde");
      mensaje(textoExito, "exito");
      Aprende.sonido.victoria();
      Aprende.confeti(40);
      mostrarSiguiente();
      return;
    }
    // Mostramos la jugada un momento y la devolvemos.
    fallos++;
    contarError();
    const antes = pos;
    pos = nueva;
    ultimo = { desde: m.desde, hasta: m.hasta };
    bloqueado = true;
    pintarTablero();
    Aprende.sonido.error();
    CapiRival.reaccionar("falla");
    mensaje(
      resultado === "jaque"
        ? "Es jaque, pero el rey todavía puede escapar. ¡Busca otra jugada!"
        : "Eso no es jaque mate. ¡Intenta otra!",
      "error"
    );
    const s = sesion;
    setTimeout(() => {
      if (s !== sesion) return;
      pos = antes;
      ultimo = null;
      bloqueado = false;
      if (fallos >= 2) darPista();
      pintarTablero();
    }, 1300);
  };
  return darPista;
}

// En estos capítulos Capi juega con las negras en los pasos de mate y de
// escapar del jaque (las reacciones ya están en pedirMate y en mate2).
const CAPITULOS_CON_RIVAL = ["jaque", "mates", "mate2"];
const conRival = () => CAPITULOS_CON_RIVAL.includes((CAPITULOS[capIndice] || {}).id);
function retarEnMates(tipo) {
  if (conRival()) CapiRival.mostrar(null, CapiRival.reto(tipo));
}

// ---- Tipos de paso ----

const PASOS = {
  // Pantalla en blanco (para el reto de coordenadas y la revisión).
  nada() {},

  explica() {
    mostrarSiguiente();
  },

  conoce() {
    const vistos = new Set();
    const pintarChips = () =>
      Object.keys(INFO_PIEZAS).map((t) => `<span class="chip-pieza${vistos.has(t) ? " visto" : ""}">${glifo(t)}</span>`).join("");
    panelEl.innerHTML = `<div class="chips-piezas" id="chips">${pintarChips()}</div><div id="info-pieza"></div>`;
    alTocar = (i) => {
      const p = pos.tablero[i];
      if (!p) return;
      const tipo = A.tipoDe(p);
      const info = INFO_PIEZAS[tipo];
      vistos.add(tipo);
      // Resaltamos todas las piezas de ese tipo para ver cuántas hay.
      marcas = new Set(pos.tablero.map((x, k) => (x && A.tipoDe(x) === tipo ? k : -1)).filter((k) => k >= 0));
      pintarTablero();
      Aprende.sonido.clic();
      document.getElementById("chips").innerHTML = pintarChips();
      document.getElementById("info-pieza").innerHTML = `
        <div class="info-pieza">
          <span class="glifo-grande">${glifo(tipo)}</span>
          <div><strong>${info.nombre}</strong> — cada jugador tiene ${info.cuantas}.<br>
          🚶 ${info.mueve}<br>💎 Vale: ${info.valor}</div>
        </div>`;
      if (vistos.size === 6) {
        mensaje("¡Ya conoces todas las piezas! 🎉", "exito");
        mostrarSiguiente();
      }
    };
  },

  explora(paso) {
    alMover = (m) => {
      aplicar(m, true);
      if (m.promocion) mensaje("¡Coronaste! 👑 Tu peón ahora es una dama.", "exito");
    };
    agregarBoton("↺ Reiniciar", "quitar", () => {
      pos = posDePaso(paso);
      ultimo = null;
      pintarTablero();
    });
    mostrarSiguiente();
  },

  estrellas(paso) {
    const inicial = posDePaso(paso);
    const estrellasIniciales = new Set((paso.estrellas || []).map(A.indiceCasilla));
    const minimo = minimoMovimientos(inicial, estrellasIniciales);
    let movimientos = 0;
    const indice = pasoIndice;

    const reiniciar = () => {
      pos = posDePaso(paso);
      objetivos = new Set(estrellasIniciales);
      movimientos = 0;
      ultimo = null;
      panelEl.innerHTML = `<p class="contador-ajedrez">Movimientos: <strong id="cuenta-mov">0</strong> · 🏆 Reto: hazlo en ${minimo}</p>`;
      mensaje("");
      alMover = jugar;
      pintarTablero();
    };

    const jugar = (m) => {
      aplicar(m, true);
      movimientos++;
      document.getElementById("cuenta-mov").textContent = movimientos;
      if (objetivos.delete(m.hasta) || m.captura) Aprende.sonido.acierto();
      pintarTablero();
      if (m.promocion) mensaje("¡Coronaste! 👑 Tu peón ahora es una dama.", "exito");
      if (objetivos.size === 0 && !quedanNegras()) {
        alMover = null;
        const extra = movimientos > minimo;
        // Cuenta el mejor intento: reiniciar y mejorar borra el error.
        erroresPaso[indice] = Math.min(erroresPaso[indice] ?? 1, extra ? 1 : 0);
        if (extra) {
          mensaje(`¡Lo lograste en ${movimientos} movimientos! 🎉 El reto era ${minimo}: reinicia si quieres intentarlo.`, "exito");
        } else {
          mensaje(`¡Perfecto! 🏆 Lo hiciste en ${movimientos} movimientos, ¡el mínimo!`, "exito");
          Aprende.confeti(30);
        }
        mostrarSiguiente();
      }
    };

    agregarBoton("↺ Reiniciar", "quitar", reiniciar);
    reiniciar();
  },

  pregunta(paso) {
    panelEl.innerHTML = '<div class="opciones" id="opciones-ajedrez"></div>';
    const contenedor = document.getElementById("opciones-ajedrez");
    paso.opciones.forEach((op) => {
      const boton = document.createElement("button");
      boton.className = "opcion";
      boton.textContent = op.t;
      boton.addEventListener("click", () => {
        if (op.ok) {
          boton.classList.add("correcta");
          contenedor.querySelectorAll("button").forEach((b) => (b.disabled = true));
          mensaje(op.explica || "¡Correcto!", "exito");
          Aprende.sonido.acierto();
          Aprende.efecto.rebote(boton);
          ocultarJaque = false;
          pintarTablero();
          mostrarSiguiente();
        } else {
          boton.classList.add("incorrecta");
          boton.disabled = true;
          contarError();
          mensaje("¡Casi! Piensa un poquito más e intenta otra vez.", "error");
          Aprende.sonido.error();
          Aprende.efecto.sacudir(boton);
        }
      });
      contenedor.appendChild(boton);
    });
  },

  escapa() {
    mensaje("Toca tu rey o una de tus piezas: el tablero solo te deja hacer jugadas que lo salvan.");
    // Capi es la que da el jaque: presume, y se enoja si la niña se salva.
    if (conRival()) {
      CapiRival.mostrar(null, CapiRival.reto("escapa"));
      CapiRival.reaccionar("daJaque");
    }
    alMover = (m) => {
      aplicar(m);
      alMover = null;
      if (m.captura) CapiRival.reaccionar("comida", { tipo: A.tipoDe(m.captura) });
      else CapiRival.reaccionar("seSalva");
      let forma = "¡Bien pensado! Tapaste el ataque con otra pieza.";
      if (m.captura) forma = "¡Genial! Comiste a la pieza que atacaba.";
      else if (A.tipoDe(m.pieza) === "K") forma = "¡Muy bien! Moviste el rey a una casilla segura.";
      mensaje(`${forma} Tu rey está a salvo. 🛡️`, "exito");
      Aprende.sonido.acierto();
      mostrarSiguiente();
    };
  },

  mate() {
    retarEnMates("mate");
    const darPista = pedirMate();
    agregarBoton("💡 Pista", "pista", () => darPista());
  },

  // Mate en 2: una jugada que deja al rey sin salida haga lo que haga, la
  // defensa de la compu, y el mate. Se valida con el motor, no con una
  // respuesta fija: sirve cualquier jugada que fuerce el mate.
  mate2() {
    retarEnMates("mate2");
    let fallos = 0;
    let darPista = () => {
      const m = A.todosLegales(pos, "w").find((x) => fuerzaMateEn2(pos, x));
      if (!m) return;
      marcas = new Set([m.desde]);
      pintarTablero();
      mensaje(`💡 Pista: la primera jugada es con ${INFO_PIEZAS[A.tipoDe(m.pieza)].articulo}. ¡Está marcada!`);
      CapiRival.reaccionar("pista");
    };
    agregarBoton("💡 Pista", "pista", () => darPista());
    mensaje("Jugada 1 de 2. ¡Piensa antes de mover! 🤔");

    alMover = (m) => {
      const s = sesion;
      if (fuerzaMateEn2(pos, m)) {
        aplicar(m); // ahora le toca a la compu
        marcas = new Set();
        alMover = null;
        bloqueado = true;
        Aprende.sonido.acierto();
        CapiRival.reaccionar("buena");
        mensaje("¡Buena jugada! ✅ Capi se defiende…", "exito");
        setTimeout(() => {
          if (s !== sesion) return;
          // La compu elige la defensa que deja menos mates.
          const defensas = A.todosLegales(pos, "b");
          const cuantos = (d) => matesEn1(A.mover(pos, d)).length;
          aplicar(defensas.reduce((a, b) => (cuantos(b) < cuantos(a) ? b : a)));
          CapiRival.reaccionar("defiende");
          bloqueado = false;
          mensaje("Jugada 2 de 2: ¡ahora da jaque mate!");
          darPista = pedirMate("¡JAQUE MATE EN 2! 🏆 ¡Pensaste como una campeona!");
        }, 1000);
        return;
      }
      // No alcanza: mostramos la jugada y cómo se salva la compu, y volvemos.
      fallos++;
      contarError();
      const antes = pos;
      aplicar(m);
      bloqueado = true;
      Aprende.sonido.error();
      CapiRival.reaccionar("falla");
      const salvada = A.todosLegales(pos, "b").find((d) => !matesEn1(A.mover(pos, d)).length);
      mensaje(
        salvada
          ? "Mira cómo se salva Capi con esa jugada… ¡Busca otra!"
          : "¡Cuidado! Así el rey negro no está en jaque pero no puede mover: eso es <strong>ahogado</strong> (empate).",
        "error"
      );
      setTimeout(() => {
        if (s !== sesion) return;
        if (salvada) aplicar(salvada);
        setTimeout(() => {
          if (s !== sesion) return;
          pos = antes;
          ultimo = null;
          bloqueado = false;
          if (fallos >= 2) darPista();
          pintarTablero();
        }, 1300);
      }, 800);
    };
  },

  jugada(paso) {
    alMover = (m) => {
      const elogio = paso.buenas[claveMovimiento(m)];
      if (elogio) {
        aplicar(m);
        alMover = null;
        mensaje(elogio, "exito");
        Aprende.sonido.acierto();
        mostrarSiguiente();
      } else {
        contarError();
        mensaje(paso.consejo, "error");
        Aprende.sonido.error();
        Aprende.efecto.sacudir(tableroEl);
        pintarTablero();
      }
    };
  },

  guion(paso) {
    let k = 0;
    const mostrarJugada = () => {
      textoEl.innerHTML = (k === 0 ? paso.texto + "<br><br>" : "") + paso.jugadas[k].texto;
    };
    mostrarJugada();
    alMover = (m) => {
      const jugada = paso.jugadas[k];
      if (claveMovimiento(m) !== jugada.blanca) {
        contarError();
        marcas = new Set([A.indiceCasilla(jugada.blanca.slice(0, 2)), A.indiceCasilla(jugada.blanca.slice(2, 4))]);
        pintarTablero();
        mensaje("Esa jugada también se puede, pero sigamos el plan. Mira las casillas marcadas 👀", "error");
        Aprende.sonido.error();
        return;
      }
      marcas = new Set();
      aplicar(m);
      Aprende.sonido.acierto();
      mensaje("¡Bien! ✅", "exito");
      k++;
      if (jugada.negra) {
        bloqueado = true;
        const s = sesion;
        setTimeout(() => {
          if (s !== sesion) return;
          aplicar(buscarMovimiento(pos, jugada.negra));
          mensaje(`⚫ ${jugada.textoNegra}`);
          bloqueado = false;
          mostrarJugada();
        }, 900);
      } else if (k >= paso.jugadas.length) {
        alMover = null;
        textoEl.innerHTML = paso.final;
        Aprende.confeti(40);
        mostrarSiguiente();
      }
    };
  },

  // Ganar material: la niña juega las blancas de "linea" y la compu las
  // negras. Sirven también otras primeras jugadas de "buenas" y cualquier mate.
  tactica(paso) {
    let k = 0;
    let fallos = 0;
    // Capi juega con las negras (en el problema del día, abrirProblema la vuelve a mostrar con su reto).
    CapiRival.mostrar(null, CapiRival.reto("tactica"));
    const desdeDe = (clave) => A.indiceCasilla(clave.slice(0, 2));
    const ganar = (texto) => {
      alMover = null;
      marcas = new Set();
      pintarTablero();
      mensaje(texto, "exito");
      Aprende.sonido.victoria();
      Aprende.confeti(35);
      mostrarSiguiente();
    };
    const darPista = () => {
      if (!alMover) return;
      const desde = desdeDe(paso.linea[k]);
      marcas = new Set([desde]);
      pintarTablero();
      mensaje(`💡 Pista: juega con ${INFO_PIEZAS[A.tipoDe(pos.tablero[desde])].articulo}. ¡Está marcada!`);
      CapiRival.reaccionar("pista");
    };
    agregarBoton("💡 Pista", "pista", darPista);
    alMover = (m) => {
      const clave = claveMovimiento(m);
      const nueva = A.mover(pos, m);
      const esMate = A.situacion(nueva, "b") === "mate";
      const otraBuena = k === 0 && clave !== paso.linea[0] && (paso.buenas || []).includes(clave);
      const s = sesion;
      if (clave !== paso.linea[k] && !esMate && !otraBuena) {
        // Se ve la jugada un momento y se devuelve.
        fallos++;
        contarError();
        const antes = pos;
        pos = nueva;
        ultimo = { desde: m.desde, hasta: m.hasta };
        bloqueado = true;
        pintarTablero();
        Aprende.sonido.error();
        CapiRival.reaccionar("falla");
        mensaje(k === 0 ? "Con esa no ganas nada… ¡busca otra jugada!" : "Casi… ¡hay una jugada mejor para rematar!", "error");
        setTimeout(() => {
          if (s !== sesion) return;
          pos = antes;
          ultimo = null;
          bloqueado = false;
          if (fallos >= 2) darPista();
          pintarTablero();
        }, 1300);
        return;
      }
      marcas = new Set();
      aplicar(m);
      Aprende.sonido.acierto();
      // Capi (si está jugando, como en el problema del día) reacciona.
      if (esMate) CapiRival.reaccionar("pierde");
      else if (m.captura) CapiRival.reaccionar("comida", { tipo: A.tipoDe(m.captura) });
      else if (A.enJaque(pos, "b")) CapiRival.reaccionar("jaque");
      else CapiRival.reaccionar("buena");
      const premio = `¡Muy bien! Ganaste ${paso.gana || "material"}. 🎉`;
      if (esMate) return ganar("¡JAQUE MATE! 🎉 Mejor imposible.");
      if (otraBuena) return ganar(`¡Esa también funciona! Ganas ${paso.gana || "material"}. 🎉`);
      k++;
      if (k >= paso.linea.length) return ganar(premio);
      // La compu responde con la jugada de la línea.
      bloqueado = true;
      mensaje("¡Buena jugada! ✅ Capi responde…", "exito");
      setTimeout(() => {
        if (s !== sesion) return;
        aplicar(buscarMovimiento(pos, paso.linea[k]));
        CapiRival.reaccionar("defiende");
        k++;
        bloqueado = false;
        if (k >= paso.linea.length) return ganar(premio);
        mensaje("¡Ahora remata! ¿Qué te puedes comer?");
      }, 900);
    };
  },

  // Final contra el rey negro: dar mate (o coronar) antes de "max" jugadas.
  // La compu defiende con Finales.defensa y la pista es Finales.pista.
  final(paso) {
    let jugadas = 0;
    let vistas = new Set(); // posiciones de la partida, para que la pista no las repita
    const contador = () =>
      (panelEl.innerHTML = `<p class="contador-ajedrez">Jugadas: <strong>${jugadas}</strong> de ${paso.max}</p>`);
    const reiniciar = () => {
      sesion++;
      pos = posDePaso(paso);
      ultimo = null;
      marcas = new Set();
      jugadas = 0;
      vistas = new Set();
      bloqueado = false;
      alMover = jugar;
      contador();
      mensaje("");
      pintarTablero();
      // Capi juega con el rey negro y reta a la niña.
      CapiRival.mostrar(null, CapiRival.reto(paso.objetivo === "corona" ? "corona" : "final"));
    };
    const fallar = (texto) => {
      contarError();
      alMover = null;
      mensaje(`${texto} ¡Vamos otra vez!`, "error");
      Aprende.sonido.error();
      const s = sesion;
      setTimeout(() => s === sesion && reiniciar(), 2800);
    };
    const ganar = (texto) => {
      alMover = null;
      mensaje(texto, "exito");
      Aprende.sonido.victoria();
      Aprende.confeti(45);
      mostrarSiguiente();
    };
    function jugar(m) {
      marcas = new Set();
      aplicar(m);
      vistas.add(Finales.clave(pos));
      jugadas++;
      contador();
      const sit = A.situacion(pos, "b");
      if (sit === "mate") {
        CapiRival.reaccionar("pierde");
        return ganar(`¡JAQUE MATE en ${jugadas} jugadas! 🏆`);
      }
      if (sit === "ahogado") {
        CapiRival.reaccionar("ahogado");
        return fallar("¡Ahogado! 😮 El rey negro no está en jaque y no puede moverse: es empate.");
      }
      if (paso.objetivo === "corona" && m.promocion) {
        if (Finales.piezaSuelta(pos)) {
          CapiRival.reaccionar("come", { tipo: "Q" });
          return fallar("Coronaste, pero el rey negro se come la dama nueva.");
        }
        CapiRival.reaccionar("corona");
        return ganar("¡Coronaste! 👑 Tu peón ya es dama: ¡la partida está ganada!");
      }
      if (jugadas >= paso.max) {
        CapiRival.reaccionar("sinJugadas");
        return fallar(`Se acabaron las ${paso.max} jugadas.`);
      }
      // Con el jaque Capi se marea (y esa cara se queda mientras responde).
      const jaque = A.enJaque(pos, "b");
      if (jaque) CapiRival.reaccionar("jaque");
      bloqueado = true;
      const s = sesion;
      setTimeout(() => {
        if (s !== sesion) return;
        const r = Finales.defensa(pos);
        aplicar(r);
        bloqueado = false;
        if (r.captura) {
          CapiRival.reaccionar("come", { tipo: A.tipoDe(r.captura) });
          fallar(`¡El rey negro se comió ${INFO_PIEZAS[A.tipoDe(r.captura)].articulo}! Cuida tus piezas con tu rey.`);
          return;
        }
        if (jaque) return;
        // Si le quedan pocas casillas se asusta; si no, a veces se burla.
        if (paso.objetivo !== "corona" && Finales.caja(pos) <= 4) CapiRival.reaccionar("encerrada");
        else if (Math.random() < 0.35) CapiRival.reaccionar("escapa");
      }, 550);
    }
    agregarBoton("💡 Pista", "pista", () => {
      if (bloqueado || !alMover) return;
      const m = Finales.pista(pos, paso.objetivo, vistas);
      if (!m) return;
      marcas = new Set([m.desde, m.hasta]);
      pintarTablero();
      mensaje(`💡 Prueba mover ${INFO_PIEZAS[A.tipoDe(m.pieza)].articulo} a ${A.nombreCasilla(m.hasta)}.`);
      CapiRival.reaccionar("pista");
    });
    agregarBoton("↺ Empezar otra vez", "quitar", reiniciar);
    reiniciar();
  },

  // ¿Cómo se llama la casilla marcada? Con las letras del tablero a la vista.
  nombrar(paso) {
    pos = posicionCon({});
    const ronda = mezclar([...Array(64).keys()]).slice(0, paso.cantidad || 8);
    let k = 0;
    const mostrar = () => {
      const casilla = ronda[k];
      marcas = new Set([casilla]);
      pintarTablero();
      panelEl.innerHTML = `<p class="contador-ajedrez">Casilla ${k + 1} de ${ronda.length}</p><div class="opciones opciones-coord"></div>`;
      const caja = panelEl.querySelector(".opciones-coord");
      mezclar([casilla, ...parecidas(casilla)]).forEach((i) => {
        const boton = document.createElement("button");
        boton.className = "opcion";
        boton.textContent = A.nombreCasilla(i);
        boton.addEventListener("click", () => {
          if (i !== casilla) {
            contarError();
            boton.classList.add("incorrecta");
            boton.disabled = true;
            mensaje(`Esa es la ${A.nombreCasilla(i)}. La letra está abajo y el número a la izquierda.`, "error");
            Aprende.sonido.error();
            return;
          }
          boton.classList.add("correcta");
          caja.querySelectorAll("button").forEach((b) => (b.disabled = true));
          Aprende.sonido.acierto();
          mensaje(`¡Sí! Es la ${A.nombreCasilla(casilla)}.`, "exito");
          const s = sesion;
          setTimeout(() => {
            if (s !== sesion) return;
            k++;
            if (k < ronda.length) {
              mensaje("");
              mostrar();
            } else {
              marcas = new Set();
              pintarTablero();
              panelEl.innerHTML = "";
              mensaje("¡Muy bien! Ya sabes leer el tablero. 🧭", "exito");
              mostrarSiguiente();
            }
          }, 700);
        });
        caja.appendChild(boton);
      });
    };
    mostrar();
  },

  // Reto contra reloj del capítulo: las estrellas salen de cuántas acierta.
  coordenadas(paso) {
    juegoCoordenadas(paso.segundos || 30, (aciertos) => {
      const estrellas = aciertos >= 18 ? 3 : aciertos >= 12 ? 2 : aciertos >= 6 ? 1 : 0;
      const texto = estrellas === 3 ? "¡Eres rapidísima con las coordenadas!" : estrellas ? "¡Muy bien! Sigue practicando para ir más rápido." : "¡Buen intento! Practica un poco y vuelve a probar.";
      terminarCapitulo(estrellas, texto, `Encontraste ${aciertos} ${aciertos === 1 ? "casilla" : "casillas"} en ${paso.segundos || 30} segundos.`);
    });
  },

  partida(paso) {
    rivalFijo = paso.rival || null;
    if (rivalFijo) empezarPartida(rivalFijo);
    else elegirRival();
  },
};

// ---- Partida contra la compu ----

const VALOR = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
const RIVALES = { tranquila: "Capi tranquila", lista: "Capi lista", experta: "Capi experta" };
let rival = "tranquila";
let rivalFijo = null; // el capítulo del reto juega siempre contra la experta
// Cada jugada de la niña: la posición antes, su jugada y la respuesta de la compu.
let registro = [];
let historial = [];
let capturadas = { w: [], b: [] };
let jugadasHechas = 0;

function atacadaPorPeon(p, i, porColor) {
  const f = Math.floor(i / 8);
  const c = i % 8;
  const fp = porColor === "w" ? f + 1 : f - 1;
  return [-1, 1].some((dc) => {
    const cc = c + dc;
    return fp >= 0 && fp < 8 && cc >= 0 && cc < 8 && p.tablero[fp * 8 + cc] === (porColor === "w" ? "P" : "p");
  });
}

// Lo más valioso que el rival podría ganar comiendo una pieza propia.
function riesgo(p, color) {
  const rival = color === "w" ? "b" : "w";
  let peor = 0;
  p.tablero.forEach((x, i) => {
    if (!x || A.colorDe(x) !== color || A.tipoDe(x) === "K") return;
    if (!A.atacada(p, i, rival)) return;
    const valor = VALOR[A.tipoDe(x)];
    let perdida = valor;
    if (A.atacada(p, i, color)) perdida = atacadaPorPeon(p, i, rival) ? valor - 1 : 0;
    peor = Math.max(peor, perdida);
  });
  return peor;
}

// Jugada de la compu (o sugerencia de ayuda). "lista" juega con más cuidado.
function elegirJugada(p, color, lista) {
  const rival = color === "w" ? "b" : "w";
  const cuidadosa = lista || Math.random() < 0.5;
  let mejor = null;
  let mejorPuntos = -Infinity;
  for (const m of A.todosLegales(p, color)) {
    if (m.promocion && A.tipoDe(m.promocion) !== "Q") continue;
    const nueva = A.mover(p, m);
    const sit = A.situacion(nueva, rival);
    const tipo = A.tipoDe(m.pieza);
    let puntos = 0;
    if (sit === "mate") puntos += 1000;
    if (sit === "ahogado" || sit === "tablas") puntos -= 30;
    if (sit === "jaque") puntos += 2;
    if (m.captura) puntos += VALOR[A.tipoDe(m.captura)] * 10;
    if (m.promocion) puntos += 80;
    if (cuidadosa) puntos -= riesgo(nueva, color) * 9;
    puntos += bonoEstilo(m);
    puntos += Math.random() * (lista ? 3 : 10);
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = m;
    }
  }
  return mejor;
}

// Las reglas de oro, en puntos: sacar caballos y alfiles al centro, enrocar,
// peones al centro, no sacar la dama ni pasear al rey muy pronto.
function bonoEstilo(m) {
  const tipo = A.tipoDe(m.pieza);
  let puntos = 0;
  const filaDesde = Math.floor(m.desde / 8);
  if ((tipo === "N" || tipo === "B") && (filaDesde === 0 || filaDesde === 7)) {
    puntos += 3;
    // Mejor si la pieza sale mirando al centro (columnas c-f, filas 3 a 6).
    const fila = Math.floor(m.hasta / 8);
    const columna = m.hasta % 8;
    if (columna >= 2 && columna <= 5 && fila >= 2 && fila <= 5) puntos += 3;
  }
  if (m.enroque) puntos += 6;
  if (tipo === "P" && ["d4", "e4", "d5", "e5"].includes(A.nombreCasilla(m.hasta))) puntos += 3;
  if (tipo === "Q" && jugadasHechas < 10) puntos -= 3;
  if (tipo === "K" && !m.enroque && jugadasHechas < 30) puntos -= 4;
  return puntos;
}

// ---- La compu experta: piensa 2 jugadas ----
// Prueba cada jugada suya, mira la mejor respuesta de la rival y, al final,
// si ella todavía puede comer algo gratis. Así casi nunca regala piezas y
// aprovecha las que le dejan sueltas. Cuenta en peones (VALOR).

// Material: positivo si las blancas tienen más.
function materialBlancas(p) {
  let s = 0;
  for (const x of p.tablero) if (x) s += (A.colorDe(x) === "w" ? 1 : -1) * VALOR[A.tipoDe(x)];
  return s;
}

// Cuánto vale la posición para "color" cuando le toca mover, con sus jugadas
// legales ya calculadas: mate, ahogado, o material + su mejor captura.
function valorConTurno(p, color, jugadas) {
  if (!jugadas.length) return A.enJaque(p, color) ? -10000 : 0;
  const signo = color === "w" ? 1 : -1;
  const rival = color === "w" ? "b" : "w";
  let captura = 0;
  for (const m of jugadas) {
    if (!m.captura) continue;
    let gana = VALOR[A.tipoDe(m.captura)];
    // Si la pieza que come queda atacada, contamos que la pierde.
    if (A.atacada(A.mover(p, m), m.hasta, rival)) gana -= VALOR[A.tipoDe(m.pieza)];
    if (gana > captura) captura = gana;
  }
  return signo * materialBlancas(p) + captura;
}

function elegirJugadaExperta(p, color) {
  const rival = color === "w" ? "b" : "w";
  let mejor = null;
  let mejorPuntos = -Infinity;
  for (const m of A.todosLegales(p, color)) {
    if (m.promocion && A.tipoDe(m.promocion) !== "Q") continue;
    const n1 = A.mover(p, m);
    const respuestas = A.todosLegales(n1, rival);
    let puntos;
    if (!respuestas.length) {
      puntos = A.enJaque(n1, rival) ? 100000 : 0; // mate, o tablas por ahogado
    } else {
      // La rival elige la respuesta que más le conviene.
      puntos = Infinity;
      for (const r of respuestas) {
        if (r.promocion && A.tipoDe(r.promocion) !== "Q") continue;
        const n2 = A.mover(n1, r);
        const v = valorConTurno(n2, color, A.todosLegales(n2, color));
        if (v < puntos) puntos = v;
      }
    }
    puntos += bonoEstilo(m) * 0.05 + Math.random() * 0.2;
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = m;
    }
  }
  return mejor;
}

function elegirRival() {
  pos = A.desdeFEN(A.INICIAL);
  textoEl.innerHTML = "¿Contra cuál Capi quieres jugar?";
  CapiRival.mostrar(null);
  panelEl.innerHTML = '<div class="opciones" id="rivales"></div>';
  const rivales = document.getElementById("rivales");
  [
    { t: "🍊 Capi tranquila (para empezar)", rival: "tranquila" },
    { t: "🤓 Capi lista (más difícil)", rival: "lista" },
  ].forEach((r) => {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = r.t;
    boton.addEventListener("click", () => empezarPartida(r.rival));
    rivales.appendChild(boton);
  });
}

function empezarPartida(quien) {
  sesion++;
  rival = quien;
  pos = A.desdeFEN(A.INICIAL);
  historial = [];
  capturadas = { w: [], b: [] };
  jugadasHechas = 0;
  registro = [];
  ultimo = null;
  marcas = new Set();
  bloqueado = false;
  textoEl.innerHTML = `Juegas con las <strong>blancas</strong> contra <strong>${RIVALES[rival]}</strong>. ¡Buena suerte!`;
  CapiRival.mostrar(rival);
  panelEl.innerHTML = `
    <p id="estado-partida" class="estado-partida"></p>
    <p class="capturadas">Comiste: <span id="comidas-blancas"></span></p>
    <p class="capturadas">Te comieron: <span id="comidas-negras"></span></p>`;
  accionesEl.innerHTML = "";
  agregarBoton("↩ Deshacer", "quitar", deshacer);
  agregarBoton("💡 Ayuda", "pista", ayuda);
  agregarBoton("Nueva partida", "borrar", () => {
    sesion++;
    bloqueado = false;
    accionesEl.innerHTML = "";
    mensaje("");
    if (rivalFijo) empezarPartida(rivalFijo);
    else elegirRival();
    pintarTablero();
  });
  alMover = jugarBlancas;
  mensaje("");
  actualizarEstado();
  pintarTablero();
}

function piezasHTML(lista) {
  return lista.map((p) => `<span class="pieza mini ${A.colorDe(p) === "w" ? "blanca" : "negra"}">${glifo(A.tipoDe(p))}</span>`).join("");
}

function actualizarEstado(texto) {
  const estado = document.getElementById("estado-partida");
  if (!estado) return;
  if (texto) estado.textContent = texto;
  else if (A.enJaque(pos, "w")) estado.textContent = "⚠️ ¡Jaque! Salva a tu rey.";
  else estado.textContent = "Tu turno ⚪ Toca una pieza blanca.";
  document.getElementById("comidas-blancas").innerHTML = piezasHTML(capturadas.w);
  document.getElementById("comidas-negras").innerHTML = piezasHTML(capturadas.b);
}

function jugarBlancas(m) {
  historial.push({ pos, capturadas: { w: [...capturadas.w], b: [...capturadas.b] }, ultimo, jugadasHechas });
  registro.push({ antes: pos, m, respuesta: null });
  if (m.captura) capturadas.w.push(m.captura);
  marcas = new Set();
  mensaje("");
  aplicar(m);
  jugadasHechas++;
  if (revisarFin()) return;
  bloqueado = true;
  actualizarEstado("Capi está pensando… 🤔");
  // Capi hace una mueca si le comen algo o le dan jaque; si no, se pone a pensar.
  let mueca = 0;
  if (m.captura) mueca = CapiRival.reaccionar("comida", { tipo: A.tipoDe(m.captura) });
  else if (A.enJaque(pos, "b")) mueca = CapiRival.reaccionar("jaque");
  else CapiRival.reaccionar("pensando");
  const s = sesion;
  setTimeout(() => {
    if (s !== sesion) return;
    const respuesta = rival === "experta" ? elegirJugadaExperta(pos, "b") : elegirJugada(pos, "b", rival === "lista");
    registro[registro.length - 1].respuesta = respuesta;
    if (respuesta.captura) capturadas.b.push(respuesta.captura);
    aplicar(respuesta);
    jugadasHechas++;
    bloqueado = false;
    if (revisarFin()) return;
    actualizarEstado();
    if (respuesta.captura) CapiRival.reaccionar("come", { tipo: A.tipoDe(respuesta.captura) });
    else if (A.enJaque(pos, "w")) CapiRival.reaccionar("daJaque");
    else CapiRival.reaccionar("turno");
  }, Math.max(650, mueca * 0.8));
}

function revisarFin() {
  const sit = A.situacion(pos, pos.turno);
  if (sit !== "mate" && sit !== "ahogado" && sit !== "tablas") return false;
  alMover = null;
  bloqueado = true;
  let estrellas;
  let texto;
  if (sit === "mate" && pos.turno === "b") {
    estrellas = rival === "tranquila" ? 2 : 3;
    texto = rival === "experta" ? "¡JAQUE MATE! 🏆🎓 ¡Le ganaste a Capi experta!" : "¡JAQUE MATE! 🏆 ¡Le ganaste a Capi!";
    CapiRival.reaccionar("pierde");
  } else if (sit === "mate") {
    estrellas = 0;
    texto = "Jaque mate… esta vez ganó Capi. ¡Cada partida te hace mejor, inténtalo otra vez!";
    CapiRival.reaccionar("gana");
  } else {
    CapiRival.reaccionar("tablas");
    estrellas = rival === "experta" ? 2 : 1;
    texto = sit === "ahogado"
      ? "¡Tablas por ahogado! El rey no estaba en jaque, pero no tenía ninguna jugada."
      : "¡Tablas! Solo quedaron los dos reyes.";
  }
  actualizarEstado(texto);
  const s = sesion;
  setTimeout(() => {
    if (s !== sesion) return;
    terminarCapitulo(estrellas, texto, `Contra ${RIVALES[rival]}`);
    botonRevisar.hidden = registro.length < 3;
  }, 2600);
  return true;
}

function deshacer() {
  if (bloqueado || !historial.length) return;
  const h = historial.pop();
  registro.pop();
  CapiRival.reaccionar("deshacer");
  pos = h.pos;
  capturadas = h.capturadas;
  ultimo = h.ultimo;
  jugadasHechas = h.jugadasHechas;
  seleccion = null;
  destinos = [];
  marcas = new Set();
  Aprende.sonido.clic();
  mensaje("");
  pintarTablero();
  actualizarEstado();
}

function ayuda() {
  if (bloqueado) return;
  const m = elegirJugada(pos, "w", true);
  if (!m) return;
  marcas = new Set([m.desde, m.hasta]);
  pintarTablero();
  mensaje(`💡 Idea: mueve ${INFO_PIEZAS[A.tipoDe(m.pieza)].articulo} de ${A.nombreCasilla(m.desde)} a ${A.nombreCasilla(m.hasta)}.`);
}

// ================= Notación (como en los libros, en español) =================

const LETRA = { K: "R", Q: "D", R: "T", B: "A", N: "C", P: "" };

function notacion(p, m) {
  if (m.enroque) return m.enroque === "corto" ? "O-O" : "O-O-O";
  const tipo = A.tipoDe(m.pieza);
  const come = m.captura || m.alPaso;
  let texto = LETRA[tipo];
  if (tipo === "P" && come) texto += "abcdefgh"[m.desde % 8];
  texto += (come ? "x" : "") + A.nombreCasilla(m.hasta);
  if (m.promocion) texto += "=D";
  const rival = A.colorDe(m.pieza) === "w" ? "b" : "w";
  const sit = A.situacion(A.mover(p, m), rival);
  return texto + (sit === "mate" ? "#" : sit === "jaque" ? "+" : "");
}

// ================= Práctica diaria: problema del día, racha y coordenadas =================

const CLAVE_DIARIO = "aprende:ajedrez-diario";

function leerDiario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_DIARIO)) || {};
  } catch {
    return {};
  }
}

function guardarDiario(d) {
  try {
    localStorage.setItem(CLAVE_DIARIO, JSON.stringify(d));
  } catch {
    // Sin almacenamiento: la racha no se guarda, pero se puede jugar igual.
  }
}

function fechaLocal(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fechaAyer() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return fechaLocal(d);
}

// La racha sigue viva si resolvió hoy o ayer.
const rachaViva = (d) => (d.dia === fechaLocal() || d.dia === fechaAyer() ? d.racha || 0 : 0);

// Todos ven el mismo problema el mismo día; el banco da la vuelta.
function problemaDeHoy() {
  const hoy = new Date();
  const dias = Math.round((Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(2026, 0, 1)) / 86400000);
  return PROBLEMAS[((dias % PROBLEMAS.length) + PROBLEMAS.length) % PROBLEMAS.length];
}

function pintarPractica() {
  if (!practicaEl) return;
  const d = leerDiario();
  const racha = rachaViva(d);
  const hecho = d.dia === fechaLocal();
  practicaEl.innerHTML = `
    <div class="problema-dia">
      <span class="icono-dia">🧩</span>
      <div class="texto-dia">
        <strong>Problema del día</strong>
        <span>${hecho ? "✅ ¡Hoy ya lo resolviste! Mañana hay otro." : "¡Hay un problema nuevo esperándote!"}</span>
        <span class="racha-dia">🔥 Racha: ${racha} ${racha === 1 ? "día" : "días"}${d.mejor ? ` · Récord: ${d.mejor}` : ""}${d.resueltos ? ` · Problemas resueltos: ${d.resueltos}` : ""}</span>
      </div>
      <div class="botones-dia">
        <button class="boton ejecutar" data-a="hoy">${hecho ? "Verlo otra vez" : "Resolver"}</button>
        <button class="boton siguiente" data-a="otro">Otro problema</button>
        <button class="boton pista" data-a="coord">🧭 Coordenadas</button>
      </div>
    </div>
    <div class="problema-dia jugar-con-papa">
      <span class="icono-dia">👨‍👧</span>
      <div class="texto-dia">
        <strong>Jugar con papá</strong>
        <span>Una partida entre ustedes dos, con Capi de árbitra.</span>
      </div>
      <div class="botones-dia">
        <button class="boton ejecutar" data-a="duo-local">En este aparato</button>
        <button class="boton siguiente" data-a="duo-linea">🌐 En línea</button>
      </div>
    </div>`;
  practicaEl.querySelector('[data-a="hoy"]').addEventListener("click", () => abrirProblema(problemaDeHoy(), true));
  practicaEl.querySelector('[data-a="otro"]').addEventListener("click", () => abrirProblema(problemaAlAzar(), false));
  practicaEl.querySelector('[data-a="coord"]').addEventListener("click", abrirRetoCoordenadas);
  practicaEl.querySelector('[data-a="duo-local"]').addEventListener("click", () => abrirDuoLocal());
  practicaEl.querySelector('[data-a="duo-linea"]').addEventListener("click", () => abrirEnLinea());
}

function problemaAlAzar() {
  const hoy = problemaDeHoy();
  let p;
  do p = PROBLEMAS[Math.floor(Math.random() * PROBLEMAS.length)];
  while (p === hoy && PROBLEMAS.length > 1);
  return p;
}

const ENUNCIADOS = {
  mate: "Juegan las blancas. ¡Hay un <strong>jaque mate en 1</strong>!",
  mate2: "Juegan las blancas: <strong>mate en 2</strong>. Tu jugada, Capi se defiende… y mate.",
  colgada: "Juegan las blancas. Hay una pieza negra <strong>sola</strong>… ¿la encuentras? Ojo con las que están cuidadas.",
  tenedor: "Juegan las blancas. Busca un <strong>tenedor</strong> 🍴: una pieza que ataque a dos a la vez.",
  jaque: "Juegan las blancas y pueden ganar material. Pista: empieza con un <strong>jaque</strong>.",
  tranquila: "Juegan las blancas y pueden ganar material. ¿Cuál es la mejor jugada?",
};

// Abre un problema suelto (del día o de práctica) en la pantalla de lección.
function abrirProblema(problema, diario) {
  mostrarPantalla(pantallaLeccion);
  tituloEl.textContent = diario ? "🧩 Problema del día" : "🧩 Problema de práctica";
  puntosPasosEl.innerHTML = "";
  erroresPaso = [];
  pasoIndice = 0;
  const paso = { ...problema, texto: ENUNCIADOS[problema.tema] || ENUNCIADOS.tranquila };
  modoSuelto = null;
  prepararPaso(paso);
  // En los problemas Capi juega con las negras: reta, se burla y hace muecas.
  CapiRival.mostrar(null, CapiRival.reto(problema.tipo));
  modoSuelto = {
    alResolver() {
      modoSuelto = null;
      const d = leerDiario();
      d.resueltos = (d.resueltos || 0) + 1;
      let extra = "";
      if (diario && d.dia !== fechaLocal()) {
        d.racha = d.dia === fechaAyer() ? (d.racha || 0) + 1 : 1;
        d.mejor = Math.max(d.mejor || 0, d.racha);
        d.dia = fechaLocal();
        extra = ` 🔥 ¡Racha de ${d.racha} ${d.racha === 1 ? "día" : "días"}!`;
      }
      guardarDiario(d);
      if (extra) mensajeEl.innerHTML += extra;
      accionesEl.innerHTML = "";
      agregarBoton("Otro problema 🧩", "ejecutar", () => abrirProblema(problemaAlAzar(), false));
      agregarBoton("Volver al camino", "siguiente", volverAlMapa);
    },
  };
}

// Reto de coordenadas suelto (desde la práctica diaria), con récord.
function abrirRetoCoordenadas() {
  mostrarPantalla(pantallaLeccion);
  tituloEl.textContent = "🧭 Reto de coordenadas";
  puntosPasosEl.innerHTML = "";
  modoSuelto = null;
  prepararPaso({ tipo: "nada", texto: "Toca la casilla que te pido, lo más rápido que puedas. El tablero no tiene letras: ¡usa la memoria! Tienes 30 segundos." });
  juegoCoordenadas(30, (aciertos) => {
    const d = leerDiario();
    const record = aciertos > (d.coordenadas || 0);
    if (record) {
      d.coordenadas = aciertos;
      guardarDiario(d);
    }
    mensaje(`¡${aciertos} ${aciertos === 1 ? "casilla" : "casillas"} en 30 segundos!${record ? " 🏅 ¡Nuevo récord!" : ` Tu récord: ${d.coordenadas}.`}`, "exito");
    if (record) Aprende.confeti(30);
    agregarBoton("Otra vez", "ejecutar", abrirRetoCoordenadas);
    agregarBoton("Volver al camino", "siguiente", volverAlMapa);
  });
}

// El juego de coordenadas: tocar la casilla pedida contra reloj.
function juegoCoordenadas(segundos, alTerminar) {
  pos = posicionCon({});
  marcas = new Set();
  ultimo = null;
  tableroEl.classList.add("sin-coordenadas");
  pintarTablero();
  let aciertos = 0;
  let objetivo = -1;
  let reloj = null;
  const s = sesion;
  panelEl.innerHTML = `<div class="reto-coordenadas">
      <span class="casilla-pedida" id="casilla-pedida">¿Lista?</span>
      <span id="tiempo-coord">⏱️ ${segundos}</span>
      <span id="aciertos-coord">✅ 0</span>
    </div>`;
  const pedida = document.getElementById("casilla-pedida");
  const nueva = () => {
    let i;
    do i = Math.floor(Math.random() * 64);
    while (i === objetivo);
    objetivo = i;
    pedida.textContent = A.nombreCasilla(i);
  };
  alTocar = (i) => {
    if (!reloj) return;
    const casilla = tableroEl.children[i];
    if (i === objetivo) {
      aciertos++;
      document.getElementById("aciertos-coord").textContent = `✅ ${aciertos}`;
      Aprende.sonido.clic();
      casilla.classList.remove("toque-mal");
      casilla.classList.add("toque-bien");
      setTimeout(() => casilla.classList.remove("toque-bien"), 350);
      nueva();
    } else {
      Aprende.sonido.error();
      // Muestra un momento dónde estaba la casilla pedida.
      const correcta = tableroEl.children[objetivo];
      casilla.classList.add("toque-mal");
      correcta.classList.add("toque-pedida");
      setTimeout(() => {
        casilla.classList.remove("toque-mal");
        correcta.classList.remove("toque-pedida");
      }, 600);
    }
  };
  const empezar = agregarBoton("▶ ¡Empezar!", "ejecutar", () => {
    empezar.remove();
    const fin = Date.now() + segundos * 1000;
    nueva();
    reloj = setInterval(() => {
      if (s !== sesion) {
        clearInterval(reloj);
        return;
      }
      const resta = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      document.getElementById("tiempo-coord").textContent = `⏱️ ${resta}`;
      if (resta > 0) return;
      clearInterval(reloj);
      reloj = null;
      alTocar = null;
      pedida.textContent = "¡Tiempo!";
      tableroEl.classList.remove("sin-coordenadas");
      pintarTablero();
      alTerminar(aciertos);
    }, 200);
  });
}

function volverAlMapa() {
  sesion++;
  modoSuelto = null;
  bloqueado = false;
  alTocar = null;
  pintarMapa();
  mostrarPantalla(pantallaMapa);
}

// ================= Revisión: "¿Dónde me equivoqué?" =================
// Mira cada jugada de la partida a 2 jugadas (Busqueda) y elige hasta 3
// momentos donde se perdió material (2+ puntos) o se dejó pasar un mate.
// En cada uno, la niña busca una jugada mejor.

async function revisarPartida() {
  const jugadas = registro.slice();
  mostrarPantalla(pantallaLeccion);
  tituloEl.textContent = "🔍 ¿Dónde me equivoqué?";
  puntosPasosEl.innerHTML = "";
  modoSuelto = { alResolver() {} };
  prepararPaso({ tipo: "nada", fen: A.INICIAL, texto: "Capi está mirando tu partida, jugada por jugada… 🤔" });
  const s = sesion;
  const momentos = [];
  for (let i = 0; i < jugadas.length; i++) {
    mensaje(`Revisando la jugada ${i + 1} de ${jugadas.length}…`);
    await new Promise((r) => setTimeout(r, 0));
    if (s !== sesion) return;
    const { antes, m, respuesta } = jugadas[i];
    const valores = Busqueda.valorarJugadas(antes, "w", 2);
    const hecha = valores.find((v) => claveMovimiento(v.m) === claveMovimiento(m) && (!m.promocion || v.m.promocion === m.promocion));
    if (!hecha || !valores.length) continue;
    const mejor = valores[0];
    const perdida = mejor.valor - hecha.valor;
    const mateDejado = Busqueda.esMate(mejor.valor) && mejor.valor > 0 && !(Busqueda.esMate(hecha.valor) && hecha.valor > 0);
    if (perdida >= 2 || mateDejado) momentos.push({ i, antes, m, respuesta, valores, mejor, perdida: mateDejado ? 100 + perdida : perdida });
  }
  const elegidos = momentos.sort((a, b) => b.perdida - a.perdida).slice(0, 3).sort((a, b) => a.i - b.i);
  mensaje("");
  if (!elegidos.length) {
    textoEl.innerHTML = "¡No encontré errores grandes! 🎉 Cuidaste tus piezas y no dejaste pasar oportunidades. ¡Así se juega!";
    Aprende.confeti(30);
    agregarBoton("Volver al camino", "siguiente", volverAlMapa);
    return;
  }
  mostrarMomento(elegidos, 0);
}

function mostrarMomento(momentos, k) {
  const mo = momentos[k];
  sesion++;
  pos = mo.antes;
  ultimo = null;
  marcas = new Set();
  casillasError = new Set([mo.m.desde, mo.m.hasta]);
  bloqueado = false;
  accionesEl.innerHTML = "";
  panelEl.innerHTML = "";
  mensaje("");
  const tuya = notacion(mo.antes, mo.m);
  let paso;
  if (mo.perdida >= 100) paso = "¡Y ahí tenías un <strong>jaque mate</strong>!";
  else if (mo.respuesta && mo.respuesta.captura) paso = `Después Capi se comió ${INFO_PIEZAS[A.tipoDe(mo.respuesta.captura)].articulo}.`;
  else paso = "Con esa jugada perdías material.";
  textoEl.innerHTML = `<strong>Momento ${k + 1} de ${momentos.length}</strong> · En tu jugada ${mo.i + 1} jugaste <strong>${tuya}</strong> (en rojo). ${paso} ¿Qué era mejor? Busca otra jugada.`;
  pintarTablero();

  let fallos = 0;
  const siguiente = () => {
    alMover = null;
    if (k + 1 < momentos.length) agregarBoton("Siguiente momento →", "ejecutar", () => mostrarMomento(momentos, k + 1));
    else {
      textoEl.innerHTML += "<br><br>🧠 <strong>El secreto:</strong> antes de mover, pregúntate <em>¿qué me pueden comer?</em> y <em>¿qué puedo comer yo?</em>";
      agregarBoton("Terminar revisión", "ejecutar", volverAlMapa);
    }
  };
  const porQue = (v) => {
    if (Busqueda.esMate(v.valor) && v.valor > 0) return "¡Es jaque mate! 🎉";
    if (v.m.captura) return `¡Así te comías ${INFO_PIEZAS[A.tipoDe(v.m.captura)].articulo}!`;
    return "Así no pierdes nada.";
  };
  alMover = (m) => {
    const v = mo.valores.find((x) => claveMovimiento(x.m) === claveMovimiento(m));
    if (v && v.valor >= mo.mejor.valor - 0.5) {
      casillasError = new Set();
      aplicar(m, true);
      mensaje(`¡Esa es mucho mejor! 💪 ${porQue(v)}`, "exito");
      Aprende.sonido.acierto();
      siguiente();
      return;
    }
    fallos++;
    Aprende.sonido.error();
    if (fallos < 2) {
      mensaje("Esa tampoco… Piensa: ¿qué te pueden comer? ¿Qué puedes comer tú?", "error");
      pintarTablero();
      return;
    }
    marcas = new Set([mo.mejor.m.desde, mo.mejor.m.hasta]);
    pintarTablero();
    mensaje(`La mejor era <strong>${notacion(mo.antes, mo.mejor.m)}</strong> (marcada). ${porQue(mo.mejor)}`, "error");
    siguiente();
  };
}

// ---- Eventos ----

document.getElementById("btn-mapa").addEventListener("click", volverAlMapa);
botonRevisar.addEventListener("click", revisarPartida);
document.getElementById("btn-volver-mapa").addEventListener("click", volverAlMapa);
document.getElementById("btn-siguiente-cap").addEventListener("click", () => abrirCapitulo(capIndice + 1));

pintarMapa();
mostrarPantalla(pantallaMapa);
