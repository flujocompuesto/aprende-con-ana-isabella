// Capi rival — Aprende con Ana Isabella
// En las partidas de ajedrez (y en los problemas del día, la táctica y los
// finales, donde juega con las negras), Capi se sienta del otro lado del
// tablero y reacciona: cuando le comen una pieza hace muecas (ojos de plato, lengua
// afuera, berrinche con vapor, llanto a mares… y con la dama ¡se le vuela
// la mandarina!), se marea con los jaques, se pone lentes de sol cuando ella
// come algo y al final se rinde con bandera blanca o festeja.
// Las caras se dibujan en SVG con las mismas formas de img/capibara.svg.
// Uso (desde js/ajedrez.js): CapiRival.mostrar(nivel, frase?), CapiRival.reaccionar(evento, info),
// CapiRival.ocultar(). reaccionar() devuelve cuánto dura la mueca (ms).

const CapiRival = (() => {
  const TINTA = "#2b2118";
  const caja = document.getElementById("rival-capi");

  // ---- Dibujo ----

  const trazo = (d, ancho = 3.5, color = TINTA) =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const ojo = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="6.5" fill="${TINTA}"/><circle cx="${cx + 2.5}" cy="${cy - 2.5}" r="2.2" fill="#fff"/>`;
  const ojoGrande = (cx, cy) =>
    `<circle cx="${cx}" cy="${cy}" r="11.5" fill="#fff" stroke="${TINTA}" stroke-width="3.5"/><circle cx="${cx}" cy="${cy + 1}" r="4.5" fill="${TINTA}"/>`;
  // Una espiral de 2 vueltas para los ojos mareados.
  const espiral = (cx, cy) => {
    let d = `M${cx} ${cy}`;
    for (let a = 0; a <= Math.PI * 4; a += 0.35) d += ` L${(cx + Math.cos(a) * a * 0.9).toFixed(1)} ${(cy + Math.sin(a) * a * 0.9).toFixed(1)}`;
    return trazo(d, 2.6);
  };
  const MEJILLAS = `<ellipse cx="54" cy="100" rx="8" ry="5" fill="#e7889a" opacity="0.8"/><ellipse cx="146" cy="100" rx="8" ry="5" fill="#e7889a" opacity="0.8"/>`;
  const MEJILLAS_ROJAS = `<ellipse cx="56" cy="100" rx="12" ry="8" fill="#e05a4a" opacity="0.85"/><ellipse cx="144" cy="100" rx="12" ry="8" fill="#e05a4a" opacity="0.85"/>`;
  const NARIZ = `<rect x="84" y="104" width="32" height="13" rx="6.5" fill="#3d2a1e"/>`;
  const bocaRellena = (d, extra = "") => `<path d="${d}" fill="#3d2a1e" stroke="${TINTA}" stroke-width="3.5" stroke-linejoin="round"/>${extra}`;

  const CUERPO = `
    <g stroke="${TINTA}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M36 152 C32 114 64 100 100 100 C136 100 168 114 164 152 C162 184 138 200 100 200 C62 200 38 184 36 152 Z" fill="#a97448"/>
      <path d="M72 164 C72 148 85 140 100 140 C115 140 128 148 128 164 C128 182 115 192 100 192 C85 192 72 182 72 164 Z" fill="#c99665" stroke="none"/>
      <ellipse cx="74" cy="198" rx="15" ry="8" fill="#7d5434"/>
      <ellipse cx="126" cy="198" rx="15" ry="8" fill="#7d5434"/>
      <ellipse cx="62" cy="52" rx="10" ry="8" fill="#7d5434"/>
      <ellipse cx="138" cy="52" rx="10" ry="8" fill="#7d5434"/>
      <rect x="46" y="44" width="108" height="104" rx="36" fill="#a97448"/>
      <rect x="60" y="98" width="80" height="46" rx="22" fill="#c08a5a"/>
    </g>`;

  const MANDARINA = `
    <g class="mandarina">
      <g stroke="${TINTA}" stroke-width="4" stroke-linejoin="round">
        <circle cx="100" cy="32" r="16" fill="#f28c38"/>
        <path d="M100 17 C104 6 116 4 123 8 C117 16 107 19 100 17 Z" fill="#6aa66e"/>
      </g>
      <circle cx="94" cy="26" r="4" fill="#ffc48a"/>
    </g>`;

  // Cada cara: ojos, cejas, boca, mejillas y algo extra (lágrimas, vapor…).
  const CARAS = {
    normal: {
      ojos: ojo(74, 82) + ojo(126, 82),
      cejas: trazo("M66 70 Q74 66 82 70 M118 70 Q126 66 134 70", 3),
      boca: trazo("M100 117 v6 M89 127 Q100 134 111 127"),
    },
    pensando: {
      ojos: ojo(70, 78) + ojo(122, 78),
      cejas: trazo("M66 70 Q74 68 82 70 M118 62 Q126 56 134 62", 3),
      boca: trazo("M100 117 v6 M93 128 H107"),
      extra: `<g class="burbujas-pensar" fill="#fffdf8" stroke="${TINTA}" stroke-width="3"><circle cx="158" cy="44" r="5"/><circle cx="170" cy="30" r="7"/><circle cx="186" cy="14" r="10"/></g>`,
    },
    sorprendida: {
      ojos: ojoGrande(74, 82) + ojoGrande(126, 82),
      cejas: trazo("M62 60 Q74 52 86 60 M114 60 Q126 52 138 60", 3.5),
      boca: trazo("M100 117 v3") + `<ellipse cx="100" cy="131" rx="7" ry="9" fill="#3d2a1e" stroke="${TINTA}" stroke-width="3"/>`,
      extra: `<path class="gota" d="M156 58 Q150 70 156 74 Q162 70 156 58 Z" fill="#8fd0f0" stroke="${TINTA}" stroke-width="2.5"/>`,
    },
    llorona: {
      ojos: trazo("M66 76 L80 82 L66 88 M134 76 L120 82 L134 88", 4),
      cejas: trazo("M64 70 L82 63 M118 63 L136 70", 3.5),
      boca: bocaRellena("M84 138 Q100 118 116 138 Z"),
      extra: `<g class="lagrimas">${trazo("M70 90 Q62 106 68 122", 6, "#5fb3e6")}${trazo("M130 90 Q138 106 132 122", 6, "#5fb3e6")}<circle class="gotita" cx="66" cy="130" r="4" fill="#5fb3e6"/><circle class="gotita" cx="134" cy="130" r="4" fill="#5fb3e6"/></g>`,
    },
    lengua: {
      ojos: ojo(74, 82) + trazo("M118 82 Q126 75 134 82", 3.5),
      cejas: trazo("M66 67 Q74 62 82 67 M118 72 Q126 70 134 72", 3),
      boca: bocaRellena("M86 123 Q100 139 114 123 Z", `<path d="M99 131 Q99 147 109 147 Q118 146 115 130 Z" fill="#e7889a" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>`),
    },
    enojada: {
      ojos: ojo(74, 85) + ojo(126, 85),
      cejas: trazo("M62 66 L86 76 M114 76 L138 66", 4.5),
      boca: trazo("M86 131 L93 126 L100 131 L107 126 L114 131", 3.5),
      mejillas: MEJILLAS_ROJAS,
      extra: `<g class="vapor" fill="#e9e3d8" stroke="${TINTA}" stroke-width="2.5"><circle cx="34" cy="44" r="9"/><circle cx="26" cy="30" r="7"/><circle cx="166" cy="44" r="9"/><circle cx="174" cy="30" r="7"/></g>`,
    },
    mareada: {
      ojos: espiral(74, 82) + espiral(126, 82),
      cejas: "",
      boca: trazo("M86 130 Q93 123 100 130 Q107 137 114 130", 3.5),
      extra: `<g class="estrellitas" fill="#f0b93b" stroke="${TINTA}" stroke-width="2">${[[40, 30], [100, 6], [160, 30]]
        .map(([x, y]) => `<path d="M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y - 2} L${x + 4} ${y + 2} L${x + 6} ${y + 9} L${x} ${y + 5} L${x - 6} ${y + 9} L${x - 4} ${y + 2} L${x - 9} ${y - 2} L${x - 3} ${y - 3} Z"/>`)
        .join("")}</g>`,
    },
    orgullosa: {
      ojos: `<g><rect x="56" y="72" width="36" height="21" rx="9" fill="${TINTA}"/><rect x="108" y="72" width="36" height="21" rx="9" fill="${TINTA}"/>${trazo("M92 78 H108 M56 78 L46 74 M144 78 L154 74", 4)}${trazo("M62 77 L70 77", 2.5, "#fff")}${trazo("M114 77 L122 77", 2.5, "#fff")}</g>`,
      cejas: trazo("M60 64 Q74 58 88 64 M112 64 Q126 58 140 64", 3),
      boca: trazo("M100 117 v5 M89 128 Q104 136 115 123", 3.5),
      extra: `<g class="brillo" fill="#fff" stroke="${TINTA}" stroke-width="2"><path d="M160 66 L163 74 L171 77 L163 80 L160 88 L157 80 L149 77 L157 74 Z"/></g>`,
      sinLentes: true,
    },
    rendida: {
      ojos: trazo("M67 75 L81 89 M81 75 L67 89 M119 75 L133 89 M133 75 L119 89", 4),
      cejas: "",
      boca: trazo("M100 117 v5 M89 129 Q100 133 111 129", 3.5) + `<ellipse cx="108" cy="134" rx="5" ry="6" fill="#e7889a" stroke="${TINTA}" stroke-width="2.5"/>`,
      // La bandera va a la izquierda: a la derecha está el globo de la frase.
      extra: `<g class="bandera">${trazo("M24 172 V84", 4.5)}<path d="M24 86 Q8 76 -8 90 Q6 104 24 114 Z" fill="#fffdf8" stroke="${TINTA}" stroke-width="3.5" stroke-linejoin="round"/></g><ellipse cx="28" cy="160" rx="11" ry="9" fill="#7d5434" stroke="${TINTA}" stroke-width="4"/>`,
      sinLentes: true,
    },
    feliz: {
      ojos: trazo("M65 85 Q74 73 83 85 M117 85 Q126 73 135 85", 4),
      cejas: trazo("M66 64 Q74 60 82 64 M118 64 Q126 60 134 64", 3),
      boca: bocaRellena("M84 123 Q100 145 116 123 Z", `<ellipse cx="100" cy="135" rx="8" ry="4" fill="#e7889a"/>`),
      extra: `<g class="corazones" fill="#e7889a" stroke="${TINTA}" stroke-width="2.5">${[[30, 60], [170, 54]]
        .map(([x, y]) => `<path d="M${x} ${y + 8} C${x - 12} ${y} ${x - 8} ${y - 10} ${x} ${y - 4} C${x + 8} ${y - 10} ${x + 12} ${y} ${x} ${y + 8} Z"/>`)
        .join("")}</g>`,
    },
  };

  // Accesorios según qué tan fuerte juega.
  const LENTES = `<g fill="none" stroke="${TINTA}" stroke-width="3"><circle cx="74" cy="82" r="14" fill="#ffffff" fill-opacity="0.25"/><circle cx="126" cy="82" r="14" fill="#ffffff" fill-opacity="0.25"/><path d="M88 80 H112"/></g>`;
  const BIRRETE = `
    <g stroke="${TINTA}" stroke-width="3.5" stroke-linejoin="round">
      <path d="M70 52 V40 Q100 50 130 40 V52 Q100 62 70 52 Z" fill="#3d3d4a"/>
      <path d="M48 38 L100 20 L152 38 L100 56 Z" fill="#3d3d4a"/>
      <path d="M100 38 L146 46 V64" fill="none" stroke="#f0b93b" stroke-width="3"/>
      <circle cx="146" cy="66" r="4" fill="#f0b93b"/>
    </g>`;

  function dibujo(cara, nivel) {
    const c = CARAS[cara] || CARAS.normal;
    const lentes = (nivel === "lista" || nivel === "experta") && !c.sinLentes ? LENTES : "";
    const sombrero = nivel === "experta" ? BIRRETE : "";
    // La mandarina va encima del birrete (en la experta) o en la cabeza.
    // (El corrimiento va en un grupo de afuera: la animación usa el transform de adentro.)
    const mandarina = nivel === "experta" ? `<g transform="translate(0 -14)">${MANDARINA}</g>` : MANDARINA;
    return `<svg viewBox="-10 -16 220 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Capi">
      ${CUERPO}
      ${c.mejillas || MEJILLAS}
      ${NARIZ}
      ${c.ojos}${c.cejas}${c.boca}
      ${lentes}${sombrero}${mandarina}
      ${c.extra || ""}
    </svg>`;
  }

  // ---- Frases y reacciones ----

  const PIEZA = { P: "peón", N: "caballo", B: "alfil", R: "torre", Q: "dama" };
  const DE = { P: "mi peoncito", N: "mi caballito", B: "mi alfil", R: "mi torre", Q: "¡¡mi dama!!" };
  const azar = (lista) => lista[Math.floor(Math.random() * lista.length)];

  const FRASES = {
    saludo: ["¡Hola! ¿Jugamos? Elige qué tan fuerte juego 🍊", "¿Una partidita? ¡Escoge mi nivel!"],
    inicio: ["¡Te voy a ganar! (creo…) 😄", "¡Que gane la mejor! 🍊", "¡Lista para jugar!"],
    pensando: ["Mmm… 🤔", "Déjame pensar…", "¿Y si muevo esto…?", "Hmmm, hmmm…"],
    turno: ["¡Te toca! 😊", "Listo, ¡tu turno!", "A ver qué haces… 👀", "¡Tu turno, campeona!"],
    P: ["¡Mi peoncito! 😱", "¡Ey! ¡Ese era mi peón favorito!", "¡Glup! Bueno… era solo un peón 😅"],
    N: ["¡Mi caballito! 🐴💨", "¡Noooo, mi caballo saltarín!", "¡Eso no se vale! 😤"],
    B: ["¡Mi alfil! ¡Se fue en diagonal para siempre!", "¡Grrr! ¡Me las vas a pagar! 😤", "¡Ay, ay, ay, mi alfil!"],
    R: ["¡MI TORRE! 😭", "¡Se me cayó el castillo! 😭", "¡Buaaa! ¡Mi torre!"],
    Q: ["¡¡MI DAMA!! 😭😭 ¡Se me voló la mandarina del susto!", "¡Noooo! ¡Mi reina! ¡Era mi favorita! 😭", "¡Esto es un desastre! 😭🍊"],
    jaque: ["¡Jaque! ¡Uy, uy, uy! 😵", "¡Me mareo! ¡Jaque!", "¡Ay! ¡Mi rey está en peligro! 😵"],
    come: (p) => [`¡Ñam! Me comí tu ${PIEZA[p]} 😋`, `¡Ja! ¿Viste eso? Tu ${PIEZA[p]} es mío 😎`, `Gracias por el ${PIEZA[p]} 😎`],
    daJaque: ["¡Jaque! 😎 ¿Y ahora qué?", "¡Cuidado con tu rey! 😎"],
    deshacer: ["¿Eh? ¿Volvimos al pasado? ⏪", "¡Uy, viaje en el tiempo! 🤔"],
    pierde: ["¡Me rindo! 🏳️ ¡Eres una campeona!", "Jaque mate… ¡qué bien juegas! 🏳️"],
    gana: ["¡Jaque mate! 🎉 ¿Jugamos otra?", "¡Gané! Pero casi me ganas 😄"],
    tablas: ["¡Empate! Nadie ganó, nadie perdió 🤝"],
    // En los problemas:
    falla: ["¡Nanana! Esa no era 😜", "¡Uf, me salvé! 😅", "¡Jeje, casi! 😜", "¡Ja! Por ahí no 😝"],
    buena: ["¡Uy! ¿Cómo viste eso? 😰", "¡Oh, no! ¿Y ahora qué hago? 😰", "¡Glup! 😰"],
    defiende: ["¡Me escapo por aquí! 😅", "¡Rápido, a salvarse!", "Uf… ¿y ahora? 😬"],
    pista: ["¡No mires ahí! 🙈", "¡Ey, eso es ayudar! 🙈", "¡Shhh, no le digas! 🙈"],
    // En los finales:
    escapa: ["¡No me atrapas! 😜", "¡Por aquí me escapo! 😜", "¡Jeje, sigo libre! 😜"],
    encerrada: ["¡Me estás encerrando! 😰", "¡Ay, ya casi no tengo casillas! 😰", "¡Socorro, la caja se achica! 😰"],
    corona: ["¡Nooo! ¡Una dama nueva! 😭", "¡No llegué a tiempo! 😭"],
    ahogado: ["¡Ahogado! ¡Empate! Me salvé 😜", "¡Jeje, no me puedo mover pero no es mate! 😜"],
    sinJugadas: ["¡Se acabaron las jugadas! Me salvé 😜", "¡Tiempo! Mi rey sigue libre 😜"],
  };

  // Para empezar un problema: Capi reta a Ana Isabella según el tipo.
  const RETOS = {
    mate: ["¿A que no encuentras el mate? 😏", "¡Mi rey está bien escondido! (creo…) 😏"],
    mate2: ["Mate en 2… ¡imposible! 😏", "¡Te reto: mate en 2! 😏"],
    tactica: ["¡Mis piezas están bien cuidadas! (creo…) 😇", "¿Ves algo raro? Yo no veo nada 😇", "¡A que no me ganas nada! 😏"],
    final: ["¡A ver si me atrapas! Mi rey es muy rápido 😜", "¡Con un rey solito te gano igual! 😜"],
    corona: ["¡Ese peón no corona! Voy corriendo 🏃", "¡Te alcanzo, peoncito! 🏃"],
  };
  const reto = (tipo) => azar(RETOS[tipo] || RETOS.tactica);

  // Qué cara, qué animación y cuánto dura cada cosa.
  const REACCIONES = {
    P: { cara: "sorprendida", anima: "salto-sorpresa", ms: 1300, sonido: "boing" },
    N: { cara: "lengua", anima: "temblor", ms: 1500, sonido: "boing" },
    B: { cara: "enojada", anima: "temblor", ms: 1500, sonido: "gracioso" },
    R: { cara: "llorona", anima: "llanto", ms: 1900, sonido: "gracioso" },
    Q: { cara: "llorona", anima: "llanto mandarina-vuela", ms: 2300, sonido: "gracioso" },
    jaque: { cara: "mareada", anima: "mareo", ms: 1400, sonido: "boing" },
    come: { cara: "orgullosa", anima: "presume", ms: 1500 },
    daJaque: { cara: "orgullosa", anima: "presume", ms: 1400 },
    deshacer: { cara: "pensando", anima: "", ms: 1200 },
    falla: { cara: "lengua", anima: "presume", ms: 1300 },
    buena: { cara: "sorprendida", anima: "temblor", ms: 1000, sonido: "boing" },
    defiende: { cara: "sorprendida", anima: "", ms: 1000 },
    pista: { cara: "sorprendida", anima: "salto-sorpresa", ms: 1200 },
    escapa: { cara: "lengua", anima: "presume", ms: 1100 },
    encerrada: { cara: "sorprendida", anima: "temblor", ms: 1100 },
    corona: { cara: "llorona", anima: "llanto", ms: 0, sonido: "gracioso" },
    ahogado: { cara: "lengua", anima: "presume", ms: 0 },
    sinJugadas: { cara: "lengua", anima: "presume", ms: 0 },
    pierde: { cara: "rendida", anima: "desinflada", ms: 0, sonido: "gracioso" },
    gana: { cara: "feliz", anima: "baile", ms: 0 },
    tablas: { cara: "sorprendida", anima: "", ms: 0 },
  };

  let nivel = "tranquila";
  let reloj = null;

  function pintar(cara, frase, anima = "") {
    if (!caja) return;
    caja.querySelector(".avatar-rival").innerHTML = dibujo(cara, nivel);
    const avatar = caja.querySelector(".avatar-rival");
    avatar.className = "avatar-rival";
    // Reinicia la animación aunque sea la misma de antes.
    void avatar.offsetWidth;
    if (anima) avatar.classList.add(...anima.split(" "));
    if (frase !== undefined) {
      const globo = caja.querySelector(".frase-rival");
      globo.textContent = frase;
      Aprende.efecto.rebote(caja.querySelector(".globo-rival"));
    }
  }

  const NOMBRES = { tranquila: "Capi tranquila", lista: "Capi lista", experta: "Capi experta" };

  function mostrar(n, frase) {
    if (!caja) return;
    clearTimeout(reloj);
    nivel = n || "tranquila";
    caja.hidden = false;
    caja.innerHTML = `<div class="avatar-rival"></div>
      <div class="globo-rival"><strong class="nombre-rival">${n ? NOMBRES[n] : "Capi"}</strong><span class="frase-rival"></span></div>`;
    pintar("normal", frase || azar(n ? FRASES.inicio : FRASES.saludo));
  }

  function ocultar() {
    clearTimeout(reloj);
    if (caja) caja.hidden = true;
  }

  // evento: "comida" (info.tipo = pieza que le comieron), "jaque", "come"
  // (info.tipo = pieza que comió Capi), "daJaque", "pensando", "turno",
  // "deshacer", "pierde", "gana" o "tablas"; en los problemas también "falla",
  // "buena", "defiende" y "pista"; en los finales "escapa", "encerrada",
  // "corona", "ahogado" y "sinJugadas". Devuelve cuánto dura la mueca.
  function reaccionar(evento, info = {}) {
    if (!caja || caja.hidden) return 0;
    clearTimeout(reloj);
    if (evento === "pensando") {
      pintar("pensando", azar(FRASES.pensando));
      return 0;
    }
    if (evento === "normal" || evento === "turno") {
      pintar("normal", evento === "turno" ? azar(FRASES.turno) : undefined);
      return 0;
    }
    const clave = evento === "comida" ? info.tipo : evento;
    const r = REACCIONES[clave];
    if (!r) return 0;
    const frases = evento === "come" ? FRASES.come(info.tipo) : FRASES[clave];
    pintar(r.cara, azar(frases), r.anima);
    if (r.sonido) Aprende.sonido[r.sonido]?.();
    if (r.ms) reloj = setTimeout(() => pintar("normal"), r.ms);
    return r.ms;
  }

  return { mostrar, ocultar, reaccionar, reto, dibujo, CARAS };
})();
