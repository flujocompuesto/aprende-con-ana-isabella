// Cuentos de Capi — los cuentos y sus preguntas (Aprende con Ana Isabella)
// Cuentos ORIGINALES, escritos para el sitio. Cada uno tiene un nivel (1 a 3)
// y preguntas de varios tipos para leer con comprensión:
//   opciones: { tipo: "opciones", texto, opciones: [{ t, ok, explica }] }
//   ordena:   { tipo: "ordena", texto, pasos: [en orden] }
// Las preguntas buscan lo que dice el cuento, lo que se deduce (¿por qué?),
// el significado de palabras y la idea principal.

const CUENTOS = [
  {
    id: "mandarina", nivel: 1, titulo: "La mandarina de Capi", dibujo: "🍊",
    texto: [
      "Capi es una capibara muy tranquila. Siempre lleva una mandarina en la cabeza, porque dice que así piensa mejor.",
      "Una mañana, Capi fue al río a tomar agua. Se agachó un poquito… ¡y plop! La mandarina se cayó al agua y empezó a flotar río abajo.",
      "—¡Mi mandarina! —gritó Capi.",
      "Tula, la tortuga, nadó despacito hasta la mandarina y la empujó con la nariz hasta la orilla.",
      "—¡Gracias, Tula! —dijo Capi—. ¿Quieres la mitad?",
      "Las dos se sentaron al sol y compartieron la mandarina. Capi descubrió que una mandarina compartida sabe el doble de rica.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué lleva Capi en la cabeza?", opciones: [
        { t: "Una mandarina", ok: true, explica: "¡Sí! Dice que así piensa mejor." },
        { t: "Un sombrero", explica: "Vuelve a leer el principio: lleva una fruta." },
        { t: "Una flor", explica: "Vuelve a leer el principio: es una fruta naranja." },
      ] },
      { tipo: "opciones", texto: "¿Dónde se le cayó la mandarina?", opciones: [
        { t: "En el río", ok: true, explica: "¡Exacto! Se agachó a tomar agua y ¡plop!" },
        { t: "En el pasto", explica: "Fíjate: estaba tomando agua." },
        { t: "En su casa", explica: "Fíjate: había ido a tomar agua." },
      ] },
      { tipo: "opciones", texto: "¿Quién la ayudó?", opciones: [
        { t: "Tula, la tortuga", ok: true, explica: "¡Sí! La empujó con la nariz hasta la orilla." },
        { t: "Un pez", explica: "Busca quién nadó despacito hasta la mandarina." },
        { t: "Nadie, la sacó sola", explica: "Alguien nadó hasta la mandarina para ayudarla." },
      ] },
      { tipo: "opciones", texto: "¿Qué aprendió Capi al final?", opciones: [
        { t: "Que compartir hace las cosas más ricas", ok: true, explica: "¡Eso! Una mandarina compartida sabe el doble de rica." },
        { t: "Que no hay que ir nunca al río", explica: "El cuento no dice eso. Mira el último párrafo." },
        { t: "Que las mandarinas flotan", explica: "Es verdad que flotó, pero lo que aprendió está en la última frase." },
      ] },
    ],
  },
  {
    id: "bip", nivel: 1, titulo: "Bip, el robot que no sabía girar", dibujo: "🤖",
    texto: [
      "Leo armó un robot pequeñito y lo llamó Bip. Bip tenía ruedas, dos ojitos de luz y un botón rojo.",
      "Leo le dio una sola instrucción: «Avanza». Bip avanzó, avanzó y avanzó… ¡hasta chocar con la pared! ¡Pum!",
      "—Ay, Bip, la pared no se mueve —se rió Leo.",
      "Entonces Leo le enseñó una instrucción nueva: «Si hay algo adelante, gira». Bip avanzó otra vez. Cuando vio la pared, giró y siguió su camino.",
      "Esa noche, Bip recorrió solito toda la casa hasta llegar a la cocina. Leo sonrió: ¡su robot ya sabía esquivar!",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Cómo se llamaba el robot?", opciones: [
        { t: "Bip", ok: true, explica: "¡Sí! Leo lo llamó Bip." },
        { t: "Leo", explica: "Leo es quien armó el robot." },
        { t: "Bop", explica: "Casi… vuelve a leer la primera línea." },
      ] },
      { tipo: "opciones", texto: "¿Qué pasó cuando Bip solo sabía «Avanza»?", opciones: [
        { t: "Chocó con la pared", ok: true, explica: "¡Pum! Avanzó hasta chocar." },
        { t: "Se fue a dormir", explica: "Mira el segundo párrafo: ¿qué hizo ¡Pum!?" },
        { t: "Giró a la derecha", explica: "Todavía no sabía girar." },
      ] },
      { tipo: "ordena", texto: "Ordena lo que pasó, del principio al final:", pasos: [
        "Leo arma a Bip",
        "Bip choca con la pared",
        "Leo le enseña a girar",
        "Bip llega a la cocina",
      ] },
      { tipo: "opciones", texto: "¿Por qué al final Bip ya no chocaba?", opciones: [
        { t: "Porque aprendió a girar cuando había algo adelante", ok: true, explica: "¡Exacto! Como el sensor de los robots de verdad." },
        { t: "Porque Leo quitó la pared", explica: "La pared no se mueve, ¿recuerdas?" },
        { t: "Porque iba más despacio", explica: "La diferencia fue la instrucción nueva." },
      ] },
    ],
  },
  {
    id: "torneo", nivel: 2, titulo: "El torneo del bosque", dibujo: "♟️",
    texto: [
      "En el bosque se organizó un torneo de ajedrez. El favorito era Tito, un zorro muy presumido.",
      "—Nadie me puede ganar —decía, inflando el pecho—. Juego rapidísimo.",
      "En la final, Tito se enfrentó a Capi. Tito movía sus piezas sin pensar, muy rápido, para impresionar a todos. Capi, en cambio, miraba el tablero con calma antes de cada jugada y se preguntaba: «¿Qué me pueden comer? ¿Qué puedo comer yo?».",
      "De pronto, Capi vio que el caballo de Tito estaba solo, sin nadie que lo cuidara. ¡Se lo comió con su alfil! Unas jugadas después, le dio jaque mate con la dama.",
      "Tito se quedó callado. Luego bajó las orejas y le dio la mano a Capi.",
      "—Jugaste muy bien —le dijo—. La próxima vez voy a pensar antes de mover.",
      "—¿Jugamos otra para practicar? —le preguntó Capi con una sonrisa.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Quién era el favorito del torneo?", opciones: [
        { t: "Tito, el zorro", ok: true, explica: "¡Sí! Y él mismo lo decía mucho…" },
        { t: "Capi", explica: "Capi ganó, pero el favorito era otro." },
        { t: "Tula, la tortuga", explica: "Tula no juega en este cuento." },
      ] },
      { tipo: "opciones", texto: "¿Qué quiere decir que Tito era «presumido»?", opciones: [
        { t: "Que se creía mejor que los demás y lo decía", ok: true, explica: "¡Exacto! «Nadie me puede ganar», decía." },
        { t: "Que era muy tímido", explica: "Al contrario: hablaba mucho de lo bueno que era." },
        { t: "Que corría muy rápido", explica: "Jugaba rápido, pero «presumido» habla de cómo se creía." },
      ] },
      { tipo: "opciones", texto: "¿Por qué ganó Capi?", opciones: [
        { t: "Porque pensaba con calma antes de cada jugada", ok: true, explica: "¡Sí! Así encontró el caballo solo." },
        { t: "Porque jugaba más rápido que Tito", explica: "El rápido era Tito. Capi jugaba con calma." },
        { t: "Porque Tito se fue del torneo", explica: "Tito jugó hasta el final." },
      ] },
      { tipo: "opciones", texto: "¿Qué pieza de Tito estaba sola?", opciones: [
        { t: "El caballo", ok: true, explica: "¡Y Capi se lo comió con el alfil!" },
        { t: "La dama", explica: "La dama fue la que dio el mate… de Capi." },
        { t: "El rey", explica: "Al rey no se lo comen: se le da jaque mate." },
      ] },
      { tipo: "opciones", texto: "¿Cómo reaccionó Tito al perder?", opciones: [
        { t: "Felicitó a Capi y aprendió algo", ok: true, explica: "¡Sí! Saber perder también es de campeones." },
        { t: "Se enojó y se fue corriendo", explica: "Mira el final: le dio la mano." },
        { t: "Dijo que Capi había hecho trampa", explica: "No, le dijo «Jugaste muy bien»." },
      ] },
    ],
  },
  {
    id: "festival", nivel: 2, titulo: "El festival de las banderas", dibujo: "🚩",
    texto: [
      "La escuela del bosque preparaba un festival con banderas de muchos países. Pero un ventarrón sopló tan fuerte que todas las banderas volaron y se mezclaron en el pasto.",
      "—¡Faltan cinco minutos para el desfile! —dijo la maestra Garza, preocupada.",
      "Capi recogió una bandera verde con un rombo amarillo y un círculo azul con estrellas.",
      "—¡Esta es la de Brasil! —dijo—. Va al lado de la de Argentina.",
      "Tula encontró una roja y blanca con una hoja de arce. —¡Canadá!",
      "Entre todos ordenaron las banderas a tiempo. Cuando empezó el desfile, cada bandera iba en su lugar, ondeando con el mismo viento que antes las había desordenado.",
      "—Ese viento nos puso a prueba —dijo la maestra Garza—, y trabajando en equipo lo resolvimos.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué desordenó las banderas?", opciones: [
        { t: "Un ventarrón", ok: true, explica: "¡Sí! Sopló tan fuerte que volaron." },
        { t: "Un perro travieso", explica: "No hay perros en este cuento." },
        { t: "La lluvia", explica: "Fue algo que sopla." },
      ] },
      { tipo: "opciones", texto: "Por lo que pasó en el cuento, ¿qué es un «ventarrón»?", opciones: [
        { t: "Un viento muy fuerte", ok: true, explica: "¡Exacto! Fuerte como para hacer volar banderas." },
        { t: "Una ventana grande", explica: "Suena parecido, pero mira lo que hizo: sopló." },
        { t: "Un tipo de bandera", explica: "Mira la primera oración: el ventarrón sopló." },
      ] },
      { tipo: "opciones", texto: "¿Qué bandera tiene una hoja de arce?", opciones: [
        { t: "Canadá", ok: true, explica: "¡Sí! La encontró Tula." },
        { t: "Brasil", explica: "La de Brasil tiene un rombo y un círculo con estrellas." },
        { t: "Argentina", explica: "Busca la que encontró Tula." },
      ] },
      { tipo: "ordena", texto: "Ordena lo que pasó:", pasos: [
        "El viento hace volar las banderas",
        "La maestra Garza se preocupa",
        "Capi encuentra la bandera de Brasil",
        "Empieza el desfile",
      ] },
      { tipo: "opciones", texto: "¿Qué nos enseña el cuento?", opciones: [
        { t: "Que trabajando en equipo se resuelven los problemas", ok: true, explica: "¡Eso dijo la maestra Garza al final!" },
        { t: "Que no hay que hacer festivales", explica: "El festival salió muy bien al final." },
        { t: "Que el viento es malo", explica: "El mismo viento hizo ondear las banderas en el desfile." },
      ] },
    ],
  },
  {
    id: "telescopio", nivel: 3, titulo: "El telescopio de Pepa", dibujo: "🔭",
    texto: [
      "Pepa era una tortuga a la que le encantaban las estrellas. Cada noche miraba el cielo y soñaba con tener un telescopio para ver los anillos de Saturno.",
      "El telescopio de la tienda costaba 50 monedas. Pepa tenía 5. «Me va a tomar una eternidad», pensó. Pero decidió ahorrar 3 monedas cada semana en un frasco con una etiqueta que decía: «Para ver Saturno».",
      "Las primeras semanas fueron fáciles. Pero un día llegó la feria al pueblo, con algodón de azúcar y juegos brillantes. Sus amigos gastaron todas sus monedas. Pepa sintió una tentación enorme: el frasco ya tenía 26 monedas… Respiró hondo, miró la etiqueta y se compró un solo algodón con las monedas que tenía para gastar.",
      "Pasaron los meses. Una noche, por fin, el frasco llegó a 50 monedas. Pepa compró su telescopio, subió a la colina y apuntó al cielo. Ahí estaba Saturno, con sus anillos brillantes.",
      "—Valió la pena esperar —susurró, con una sonrisa enorme.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Para qué ahorraba Pepa?", opciones: [
        { t: "Para comprar un telescopio", ok: true, explica: "¡Sí! Para ver los anillos de Saturno." },
        { t: "Para ir a la feria", explica: "La feria fue una tentación, no su meta." },
        { t: "Para comprar algodón de azúcar", explica: "Se compró uno, pero su meta era otra." },
      ] },
      { tipo: "opciones", texto: "¿Por qué crees que Pepa le puso una etiqueta al frasco?", opciones: [
        { t: "Para acordarse de su meta cada vez que lo viera", ok: true, explica: "¡Exacto! En la feria, miró la etiqueta y resistió." },
        { t: "Porque le gustaba decorar frascos", explica: "Piensa en qué hizo Pepa en la feria antes de decidir." },
        { t: "Para que nadie lo pudiera abrir", explica: "Una etiqueta no cierra nada. Mira qué hizo con ella en la feria." },
      ] },
      { tipo: "opciones", texto: "¿Qué significa «tentación» en el cuento?", opciones: [
        { t: "Muchas ganas de hacer algo que tal vez no te conviene", ok: true, explica: "¡Sí! Gastar el frasco en la feria la alejaba de su meta." },
        { t: "Un juego de la feria", explica: "Lee otra vez: Pepa «sintió» una tentación." },
        { t: "Un tipo de dulce", explica: "El dulce era el algodón. La tentación es lo que sintió." },
      ] },
      { tipo: "opciones", texto: "En la feria, ¿qué decidió Pepa?", opciones: [
        { t: "Comprar un solo algodón con su dinero para gastar, sin tocar el frasco", ok: true, explica: "¡Muy inteligente! Se dio un gusto pequeño y cuidó su meta." },
        { t: "Gastar todo el frasco en juegos", explica: "Eso hicieron sus amigos con sus monedas, no Pepa." },
        { t: "No ir a la feria", explica: "Sí fue, pero decidió con cuidado." },
      ] },
      { tipo: "opciones", texto: "¿Cuál es la idea principal del cuento?", opciones: [
        { t: "Ahorrar con paciencia ayuda a cumplir una meta", ok: true, explica: "¡Eso! «Valió la pena esperar»." },
        { t: "Saturno tiene anillos", explica: "Es cierto, pero es un detalle. ¿De qué trata todo el cuento?" },
        { t: "Las ferias son divertidas", explica: "La feria es solo una parte. ¿Qué hizo Pepa durante todo el cuento?" },
      ] },
    ],
  },
  {
    id: "tesoro", nivel: 3, titulo: "El mapa del tesoro", dibujo: "🗺️",
    texto: [
      "Un sábado, Capi encontró un papel viejo debajo de una piedra. Era un mapa con una X roja y unas instrucciones: «Desde el árbol grande, camina 10 pasos al norte. Luego 5 pasos al este. Busca donde el agua canta».",
      "Capi llamó a Tula y a Tito. Tito quería correr hacia cualquier lado, pero Capi sacó su brújula.",
      "—El norte es hacia allá —dijo—. Contemos los pasos juntos.",
      "Diez pasos al norte. Cinco pasos al este. Y entonces escucharon un sonido suave: glu, glu, glu. ¡Era una pequeña cascada! «El agua canta», recordó Tula.",
      "Detrás de la cascada había un cofre. Lo abrieron con el corazón latiendo fuerte… y adentro había libros: cuentos, un atlas, uno de ajedrez y otro de robots, con una nota: «El tesoro más grande es lo que aprendes. Léelos y compártelos».",
      "Esa tarde, los tres amigos leyeron hasta que se hizo de noche. Tito, que antes quería correr, fue el último en cerrar su libro.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué usó Capi para saber dónde estaba el norte?", opciones: [
        { t: "Una brújula", ok: true, explica: "¡Sí! La brújula siempre apunta al norte." },
        { t: "Una linterna", explica: "Busca qué «sacó» Capi." },
        { t: "El mapa", explica: "El mapa decía hacia dónde ir, pero para saber dónde está el norte usó otra cosa." },
      ] },
      { tipo: "ordena", texto: "Ordena la aventura:", pasos: [
        "Capi encuentra el mapa",
        "Capi saca su brújula",
        "Escuchan el agua: glu, glu",
        "Abren el cofre",
      ] },
      { tipo: "opciones", texto: "¿Qué quería decir «donde el agua canta»?", opciones: [
        { t: "Un lugar con agua que hace ruido, como una cascada", ok: true, explica: "¡Exacto! El glu, glu de la cascada." },
        { t: "Un lugar donde canta un pájaro", explica: "Es el agua la que «canta». ¿Qué encontraron?" },
        { t: "Una canción escrita en el mapa", explica: "Fíjate qué escucharon al llegar." },
      ] },
      { tipo: "opciones", texto: "¿Qué había en el cofre?", opciones: [
        { t: "Libros y una nota", ok: true, explica: "¡Sí! Un tesoro de libros." },
        { t: "Monedas de oro", explica: "¡No era ese tipo de tesoro!" },
        { t: "Nada", explica: "Sí había algo… vuelve a leer el quinto párrafo." },
      ] },
      { tipo: "opciones", texto: "¿Por qué el cuento dice que Tito «fue el último en cerrar su libro»?", opciones: [
        { t: "Porque le gustó tanto leer que no quería parar", ok: true, explica: "¡Sí! Y eso que al principio solo quería correr." },
        { t: "Porque leía muy despacio", explica: "Piensa en cómo era Tito al principio y cómo terminó." },
        { t: "Porque se quedó dormido", explica: "El cuento no dice que se durmiera. ¿Qué cambió en Tito?" },
      ] },
    ],
  },
];

if (typeof module !== "undefined") module.exports = { CUENTOS };
