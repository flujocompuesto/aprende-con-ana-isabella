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
  {
    id: "arcoiris", nivel: 1, titulo: "Capi y el arcoíris", dibujo: "🌈",
    texto: [
      "Una tarde llovió mucho en el bosque. Capi esperó debajo de una hoja grandota, con su mandarina bien sujeta en la cabeza.",
      "Cuando la lluvia paró, salió el sol. Y en el cielo apareció un arco gigante de colores.",
      "—¡Mira, Tula! ¿Quién pintó el cielo? —preguntó Capi.",
      "Tula, la tortuga, que sabía muchas cosas, le explicó: —Nadie lo pintó. La luz del sol pasa por las gotitas de lluvia y se separa en colores. Eso es un arcoíris.",
      "Capi contó los colores con la pata: rojo, naranja, amarillo, verde, azul, añil y violeta. ¡Siete!",
      "—El naranja es mi favorito —dijo Capi—. Es del color de mi mandarina.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué apareció en el cielo cuando paró la lluvia?", opciones: [
        { t: "Un arcoíris", ok: true, explica: "¡Sí! Un arco gigante de colores." },
        { t: "Una nube negra", explica: "Fíjate: cuando paró la lluvia salió el sol." },
        { t: "La luna", explica: "Era de tarde y salió el sol. ¿Qué apareció?" },
      ] },
      { tipo: "opciones", texto: "Según Tula, ¿qué se necesita para que haya un arcoíris?", opciones: [
        { t: "La luz del sol y gotitas de lluvia", ok: true, explica: "¡Exacto! La luz se separa en colores al pasar por las gotitas." },
        { t: "Que alguien lo pinte", explica: "Tula dijo que nadie lo pintó." },
        { t: "Solo muchas nubes", explica: "Vuelve a leer lo que explicó Tula: habla del sol y de la lluvia." },
      ] },
      { tipo: "opciones", texto: "¿Cuántos colores contó Capi?", opciones: [
        { t: "Siete", ok: true, explica: "¡Sí! Rojo, naranja, amarillo, verde, azul, añil y violeta." },
        { t: "Tres", explica: "Cuéntalos tú en el quinto párrafo." },
        { t: "Diez", explica: "Cuéntalos tú en el quinto párrafo." },
      ] },
      { tipo: "opciones", texto: "¿Por qué el naranja es el color favorito de Capi?", opciones: [
        { t: "Porque es del color de su mandarina", ok: true, explica: "¡Claro! Su mandarina nunca la deja." },
        { t: "Porque es el primer color del arcoíris", explica: "El primero es el rojo. Mira lo que dice Capi al final." },
        { t: "Porque Tula se lo dijo", explica: "Lo dice Capi solita en la última línea." },
      ] },
    ],
  },
  {
    id: "semilla", nivel: 1, titulo: "La semilla de Tula", dibujo: "🌻",
    texto: [
      "Tula, la tortuga, encontró una semilla chiquita y redonda. La plantó en la tierra, junto a su casa.",
      "Al día siguiente fue a mirarla. No había nada. —¿Por qué no crece? —preguntó.",
      "Capi le dijo: —Las semillas necesitan agua, sol y paciencia. Paciencia quiere decir saber esperar sin enojarse.",
      "Tula la regó todas las mañanas. Pasó una semana y salió una hojita verde. Pasó un mes y la planta ya era más alta que Tula.",
      "Un día, la planta se llenó de flores amarillas enormes. ¡Era un girasol!",
      "—Valió la pena esperar —dijo Tula, muy contenta, y se quedó dormida a su sombra.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué necesitan las semillas, según Capi?", opciones: [
        { t: "Agua, sol y paciencia", ok: true, explica: "¡Sí! Y la paciencia fue lo más difícil para Tula." },
        { t: "Solo mucha agua", explica: "Capi dijo tres cosas. Búscalas en el tercer párrafo." },
        { t: "Que les canten", explica: "¡Qué lindo sería! Pero Capi dijo otras tres cosas." },
      ] },
      { tipo: "opciones", texto: "¿Qué quiere decir «paciencia»?", opciones: [
        { t: "Saber esperar sin enojarse", ok: true, explica: "¡Exacto! Capi lo explica en el cuento." },
        { t: "Correr muy rápido", explica: "Al contrario: tiene que ver con esperar." },
        { t: "Regar muchas veces", explica: "Tula regaba, pero «paciencia» es otra cosa. Capi lo explica." },
      ] },
      { tipo: "ordena", texto: "Ordena lo que pasó, del principio al final:", pasos: [
        "Tula planta la semilla",
        "Tula ve que no ha crecido nada",
        "Sale una hojita verde",
        "La planta se llena de flores",
      ] },
      { tipo: "opciones", texto: "¿Cuál es la idea más importante del cuento?", opciones: [
        { t: "Las cosas buenas a veces toman tiempo", ok: true, explica: "¡Sí! «Valió la pena esperar», dijo Tula." },
        { t: "Las tortugas duermen mucho", explica: "Tula se durmió al final, pero el cuento enseña otra cosa." },
        { t: "Las semillas crecen en un día", explica: "¡Al revés! Tardó un mes en crecer." },
      ] },
    ],
  },
  {
    id: "trueque", nivel: 2, titulo: "El mercado del trueque", dibujo: "🐚",
    texto: [
      "Hace mucho tiempo, en el bosque no había dinero. Los animales cambiaban unas cosas por otras. A eso se le llama trueque.",
      "Capi tenía muchas mandarinas y quería una bufanda para el invierno. Fue a ver a la oveja Lola, que tejía bufandas preciosas.",
      "—Te cambio mandarinas por una bufanda —le dijo Capi. —¡Ay, no! —respondió Lola—. A mí no me gustan las mandarinas. Yo quiero zanahorias.",
      "Capi fue a ver al conejo, que tenía zanahorias. Pero el conejo no quería mandarinas: ¡quería una canasta! Y la ardilla, que hacía canastas, quería nueces. Capi caminó todo el día y no consiguió su bufanda.",
      "Esa noche, los animales se reunieron. —Esto es muy difícil —dijo el búho—. ¿Y si usamos unas conchitas brillantes que todos aceptemos? Con ellas se podría pagar cualquier cosa.",
      "Al día siguiente, Capi vendió sus mandarinas y le pagaron con conchitas. Con esas conchitas le pagó a Lola la bufanda. ¡Fue facilísimo!",
      "Así fue como el bosque inventó el dinero: algo que todos aceptan para cambiarlo por lo que necesitan.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué es el trueque?", opciones: [
        { t: "Cambiar unas cosas por otras, sin dinero", ok: true, explica: "¡Sí! Así se hacía en el bosque al principio." },
        { t: "Comprar con monedas", explica: "En el trueque todavía no había dinero." },
        { t: "Regalar cosas", explica: "En el trueque se da algo, pero se recibe otra cosa a cambio." },
      ] },
      { tipo: "opciones", texto: "¿Por qué Lola no aceptó las mandarinas?", opciones: [
        { t: "Porque no le gustaban: ella quería zanahorias", ok: true, explica: "¡Exacto! Ese era el problema del trueque." },
        { t: "Porque ya no tenía bufandas", explica: "Sí tenía: al final le vendió una a Capi." },
        { t: "Porque estaba enojada con Capi", explica: "No estaba enojada. Mira lo que ella quería." },
      ] },
      { tipo: "ordena", texto: "Ordena lo que pasó:", pasos: [
        "Capi quiere una bufanda",
        "Lola pide zanahorias",
        "Los animales se reúnen de noche",
        "Capi paga con conchitas",
      ] },
      { tipo: "opciones", texto: "¿Por qué el trueque era tan difícil?", opciones: [
        { t: "Porque había que encontrar a alguien que quisiera justo lo que uno tenía", ok: true, explica: "¡Sí! Lola quería zanahorias, el conejo una canasta, la ardilla nueces…" },
        { t: "Porque nadie tenía nada", explica: "Todos tenían algo: mandarinas, zanahorias, canastas…" },
        { t: "Porque el mercado estaba muy lejos", explica: "El cuento no dice eso. Piensa en lo que quería cada animal." },
      ] },
      { tipo: "opciones", texto: "¿Cuál es la idea principal del cuento?", opciones: [
        { t: "El dinero se inventó para que cambiar cosas fuera más fácil", ok: true, explica: "¡Eso! Las conchitas eran el dinero del bosque." },
        { t: "El búho es muy sabio", explica: "Es cierto, pero el cuento trata de algo más grande." },
        { t: "Las bufandas abrigan mucho", explica: "La bufanda es lo que Capi quería, pero el cuento enseña otra cosa." },
      ] },
    ],
  },
  {
    id: "museo", nivel: 2, titulo: "Bip en el museo", dibujo: "🦕",
    texto: [
      "Leo llevó a Bip, su robot, al museo de ciencias. La guía les propuso un juego: —Quien encuentre el huevo de dinosaurio se gana un premio. Pero solo el robot puede buscar.",
      "Leo miró el mapa del museo y le escribió a Bip las instrucciones: «Avanza 3 salas. Gira a la izquierda. Avanza 2 salas».",
      "Bip avanzó, giró y avanzó… y llegó a la sala de los peces. ¡Allí no había ningún huevo!",
      "Leo revisó el mapa con calma. —¡Ya sé! —dijo—. Bip hizo justo lo que le pedí. El error fue mío: tenía que girar a la derecha, no a la izquierda.",
      "La guía sonrió: —Los programadores dicen que eso es un error del programa. Buscarlo y arreglarlo se llama depurar.",
      "Leo corrigió la instrucción. Bip volvió al principio, avanzó 3 salas, giró a la derecha y avanzó 2 salas… ¡y encontró el huevo de dinosaurio!",
      "El premio era una insignia que decía «Programador del día». Leo se la puso a Bip, porque los dos habían trabajado en equipo.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué tenía que encontrar Bip?", opciones: [
        { t: "Un huevo de dinosaurio", ok: true, explica: "¡Sí! Era el juego de la guía." },
        { t: "Un pez", explica: "Llegó a la sala de los peces por error. ¿Qué buscaba?" },
        { t: "La salida del museo", explica: "Vuelve a leer el primer párrafo." },
      ] },
      { tipo: "opciones", texto: "¿Por qué Bip llegó a la sala de los peces?", opciones: [
        { t: "Porque la instrucción decía izquierda en vez de derecha", ok: true, explica: "¡Exacto! Bip hizo justo lo que decía la instrucción." },
        { t: "Porque Bip se portó mal", explica: "Leo dijo que Bip hizo justo lo que le pidió." },
        { t: "Porque se le acabó la batería", explica: "El cuento no dice eso. Busca qué error encontró Leo." },
      ] },
      { tipo: "opciones", texto: "¿Qué quiere decir «depurar»?", opciones: [
        { t: "Buscar el error del programa y arreglarlo", ok: true, explica: "¡Sí! Lo explica la guía." },
        { t: "Limpiar el robot", explica: "Suena parecido a «puro», pero la guía lo explica de otra forma." },
        { t: "Empezar un programa nuevo", explica: "Leo no empezó de cero: arregló una sola instrucción." },
      ] },
      { tipo: "ordena", texto: "Ordena la aventura:", pasos: [
        "Leo escribe las instrucciones",
        "Bip llega a la sala de los peces",
        "Leo encuentra el error",
        "Bip encuentra el huevo",
      ] },
      { tipo: "opciones", texto: "¿Por qué Leo le dio la insignia a Bip?", opciones: [
        { t: "Porque los dos habían trabajado en equipo", ok: true, explica: "¡Eso! Leo pensó las instrucciones y Bip las siguió." },
        { t: "Porque a Leo no le gustaban las insignias", explica: "El cuento dice por qué se la dio. Mira el final." },
        { t: "Porque Bip lo hizo todo solo", explica: "Bip no lo hizo solo: Leo escribió y arregló las instrucciones." },
      ] },
    ],
  },
  {
    id: "brasil", nivel: 3, titulo: "Capi viaja a Brasil", dibujo: "🇧🇷",
    texto: [
      "Un día llegó una carta para Capi. Era de su prima Cacá, que vive en Brasil: «¡Ven a visitarme al Pantanal! Aquí vivimos muchísimas capibaras».",
      "Capi preparó su maleta: un sombrero para el sol, su brújula y, claro, una mandarina. Voló en avión hacia el sur, hasta Sudamérica.",
      "Cuando llegó, Cacá la abrazó: —¡Olá, prima! ¡Bem-vinda ao Brasil! Capi no entendió nada. —En Brasil se habla portugués —le explicó Cacá—. «Olá» es hola y «bem-vinda» es bienvenida.",
      "El Pantanal era enorme y estaba lleno de agua. Había garzas, tortugas, monos y muchísimas capibaras nadando felices. —Aquí no nos dicen capibaras, sino «capivaras», con v —dijo Cacá.",
      "Mientras paseaban, Capi dijo: —La capital de Brasil es Río de Janeiro, ¿verdad? Es muy famosa. —No —le contestó Cacá—. Río es una ciudad preciosa, con playas, pero la capital es Brasilia.",
      "Antes de volver, Capi le regaló su mandarina a Cacá. —¡Obrigada! —dijo Cacá, que en portugués quiere decir gracias. —¡De nada! —respondió Capi, y se rió: en portugués se dice igual.",
      "En el avión de vuelta, Capi anotó en su cuaderno las palabras nuevas: olá, bem-vinda, obrigada, capivara. ¡Ya tenía ganas de volver!",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué idioma se habla en Brasil?", opciones: [
        { t: "Portugués", ok: true, explica: "¡Sí! Por eso Cacá le dijo «olá»." },
        { t: "Español", explica: "Capi habla español, pero en Brasil se habla otro idioma." },
        { t: "Inglés", explica: "Cacá lo explica en el tercer párrafo." },
      ] },
      { tipo: "opciones", texto: "¿Cuál es la capital de Brasil?", opciones: [
        { t: "Brasilia", ok: true, explica: "¡Exacto! Capi se confundió, pero Cacá se lo explicó." },
        { t: "Río de Janeiro", explica: "Eso creía Capi, porque Río es muy famosa. ¡Pero no es la capital!" },
        { t: "El Pantanal", explica: "El Pantanal es donde vive Cacá, no una ciudad." },
      ] },
      { tipo: "opciones", texto: "¿Qué quiere decir «obrigada»?", opciones: [
        { t: "Gracias", ok: true, explica: "¡Sí! Cacá lo dijo cuando recibió la mandarina." },
        { t: "Hola", explica: "«Hola» en portugués es «olá»." },
        { t: "Bienvenida", explica: "«Bienvenida» es «bem-vinda»." },
      ] },
      { tipo: "opciones", texto: "¿Por qué crees que en el Pantanal viven tantas capibaras?", opciones: [
        { t: "Porque tiene mucha agua, y a las capibaras les encanta nadar", ok: true, explica: "¡Bien pensado! El cuento dice que estaba lleno de agua y que nadaban felices." },
        { t: "Porque es la capital de Brasil", explica: "La capital es Brasilia. Piensa en cómo era el Pantanal." },
        { t: "Porque hace mucho frío", explica: "El cuento no habla de frío. ¿De qué estaba lleno el Pantanal?" },
      ] },
      { tipo: "ordena", texto: "Ordena el viaje de Capi:", pasos: [
        "Llega la carta de Cacá",
        "Capi viaja en avión",
        "Cacá le enseña palabras en portugués",
        "Capi le regala su mandarina",
      ] },
    ],
  },
  {
    id: "dama-perdida", nivel: 3, titulo: "El misterio de la dama perdida", dibujo: "🕵️",
    texto: [
      "El sábado era el gran día: Capi y Tito, el zorro, iban a jugar la revancha del torneo. Pero cuando abrieron la caja del ajedrez… ¡faltaba la dama blanca!",
      "—¡Alguien se la robó! —gritó Tito. —Calma —dijo Capi—. Vamos a investigar como detectives. Primero: ¿quién usó el ajedrez por última vez?",
      "Tula se acordó de que el martes había jugado la ardillita Nina. Fueron a verla. —Yo guardé todas las piezas —dijo Nina—. Pero la caja se me cayó cuando la llevaba de vuelta, junto al tronco hueco.",
      "Corrieron al tronco hueco. Adentro había hojas y una bellota, pero ninguna dama. Capi miró el suelo con atención y vio unas huellitas finas, como palitos. —Son huellas de pájaro —dijo Tula.",
      "Siguieron las huellas hasta el nido de Rita, la urraca. Allí, entre botones y tapitas brillantes, ¡estaba la dama blanca! —¡Ay, perdón! —dijo Rita—. La vi tan brillante en el suelo que pensé que nadie la quería.",
      "Rita devolvió la dama, y Capi le regaló una tapita brillante para su colección. Esa tarde jugaron la revancha. Esta vez Tito pensó con calma antes de cada jugada… ¡y quedaron empatados!",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Qué pieza faltaba en la caja?", opciones: [
        { t: "La dama blanca", ok: true, explica: "¡Sí! Y sin dama no se puede jugar bien." },
        { t: "El rey negro", explica: "Vuelve a leer el primer párrafo." },
        { t: "Un caballo", explica: "Vuelve a leer el primer párrafo." },
      ] },
      { tipo: "opciones", texto: "¿Qué quiere decir «investigar»?", opciones: [
        { t: "Buscar pistas para descubrir algo", ok: true, explica: "¡Exacto! Como hacen los detectives." },
        { t: "Jugar muy rápido", explica: "No tiene que ver con jugar. ¿Qué hicieron Capi y sus amigos?" },
        { t: "Esconder cosas", explica: "Al revés: querían encontrar algo." },
      ] },
      { tipo: "ordena", texto: "Ordena las pistas del misterio:", pasos: [
        "Abren la caja y falta la dama",
        "Nina cuenta que se le cayó la caja",
        "Encuentran huellas de pájaro",
        "Rita devuelve la dama",
      ] },
      { tipo: "opciones", texto: "¿Por qué Rita se llevó la dama?", opciones: [
        { t: "Porque era brillante y pensó que nadie la quería", ok: true, explica: "¡Sí! A Rita le encantan las cosas brillantes." },
        { t: "Porque quería jugar ajedrez", explica: "Rita lo explica. Mira qué más había en su nido." },
        { t: "Porque Tito se la regaló", explica: "Tito ni sabía dónde estaba. Mira lo que dice Rita." },
      ] },
      { tipo: "opciones", texto: "¿Qué cambió en Tito desde el torneo del bosque?", opciones: [
        { t: "Ahora pensaba con calma antes de cada jugada", ok: true, explica: "¡Bien! Aprendió de lo que le pasó en el torneo." },
        { t: "Ahora jugaba todavía más rápido", explica: "Al contrario. Mira cómo jugó la revancha." },
        { t: "Ya no quería jugar ajedrez", explica: "Sí jugó la revancha. ¿Cómo jugó esta vez?" },
      ] },
    ],
  },
  {
    id: "semillas-sofia", nivel: 3, titulo: "Las semillas de Sofía", dibujo: "🌱",
    texto: [
      "Sofía tiene ocho años y le encanta andar en bicicleta. Pero su bicicleta vieja ya le queda pequeña, y ella tiene un gran sueño: una bicicleta rosa con estrellas y una canasta para llevar a su gato Michi.",
      "La bicicleta cuesta 50 dólares. Sofía abrió su alcancía… y solo tenía 3. —Para tener dinero, primero hay que ganarlo —pensó.",
      "Así que hizo un plan: pasear al perro del vecino (5 dólares por semana), vender limonada los sábados (8 dólares por semana) y ayudar en casa con tareas extra (2 dólares por semana). Después de tres semanas, ¡ya tenía 48 dólares!",
      "Un día, caminando con su dinero, pasó por una tienda llena de helados, juguetes y dulces de todos los colores. Si gastaba todo, tendría muchos dulces hoy… pero nunca su bicicleta. Sofía respiró profundo, pensó en su sueño y siguió caminando. Eso se llama no gastar por impulso.",
      "Esa noche, su abuelo le contó un secreto: —No gastes todo lo que ganas. Reparte tu dinero en tres cajitas. De cada 10 dólares, pon 5 en la cajita de las metas, 3 en la de los gustos y 2 en la de las semillas.",
      "—¿Semillas? —preguntó Sofía. —Es dinero que no se gasta: se guarda para que crezca —dijo el abuelo—. Si lo guardas en una cuenta o lo inviertes, con el tiempo te pagan un poquito más. Eso se llama interés. Imagina que tus semillas crecen un poquito cada año: 10 dólares serían 12 en dos años, 16 en cinco años y ¡26 en diez años! El dinero trabaja mientras tú duermes.",
      "Después, el abuelo le contó algo increíble: —Con tus semillas también puedes comprar una pequeñísima parte de una empresa, como Disney o Nintendo. Esa partecita se llama acción. Si a la empresa le va bien, a ti también. Y si le va mal, tu acción puede valer menos por un tiempo: por eso se invierte con paciencia.",
      "A la semana siguiente, Sofía juntó lo que le faltaba y por fin compró su bicicleta rosa con estrellas. ¡Michi estrenó la canasta!",
      "Desde entonces, Sofía reparte su dinero en sus tres cajitas. Sus semillas siguieron creciendo, y un día compró su primera acción de Disney. —Ahora soy un poquito dueña de Disney —le dijo a Michi, que no entendió nada, pero ronroneó.",
      "Y este es el gran secreto de Sofía: la riqueza no es tener mucho hoy, es hacer que tu dinero trabaje para ti mañana.",
    ],
    preguntas: [
      { tipo: "opciones", texto: "¿Por qué Sofía no gastó su dinero en la tienda de dulces?", opciones: [
        { t: "Porque tenía una meta: su bicicleta", ok: true, explica: "¡Sí! Pensó en su sueño y siguió caminando." },
        { t: "Porque no le gustaban los dulces", explica: "El cuento no dice eso. ¿En qué pensó Sofía?" },
        { t: "Porque la tienda estaba cerrada", explica: "La tienda estaba abierta y llena de cosas." },
      ] },
      { tipo: "opciones", texto: "¿Cuánto dinero tenía Sofía después de tres semanas?", opciones: [
        { t: "48 dólares", ok: true, explica: "¡Exacto! Los 3 de la alcancía y 15 cada semana: 3 + 15 + 15 + 15 = 48." },
        { t: "50 dólares", explica: "Eso costaba la bicicleta. ¡Le faltaba un poquito!" },
        { t: "15 dólares", explica: "Eso ganaba en una semana. Fueron tres semanas, y ya tenía 3." },
      ] },
      { tipo: "ordena", texto: "Ordena la historia de Sofía:", pasos: [
        "Sofía sueña con una bicicleta nueva",
        "Pasea al perro y vende limonada",
        "Pasa de largo por la tienda de dulces",
        "Compra su bicicleta rosa",
      ] },
      { tipo: "opciones", texto: "¿Qué son las «semillas» del abuelo?", opciones: [
        { t: "Dinero que se guarda para que crezca", ok: true, explica: "¡Sí! Como una semilla que se vuelve árbol." },
        { t: "Semillas de verdad para plantar", explica: "Es una forma de hablar. El abuelo explica qué son." },
        { t: "Dinero para comprar dulces", explica: "Ese sería el de los gustos. Las semillas no se gastan." },
      ] },
      { tipo: "opciones", texto: "¿Qué es una acción?", opciones: [
        { t: "Una pequeña parte de una empresa", ok: true, explica: "¡Exacto! Por eso Sofía es un poquito dueña de Disney." },
        { t: "Una película de superhéroes", explica: "¡Esas son películas de acción! Aquí es otra cosa." },
        { t: "Una moneda de oro", explica: "No es una moneda. Lee lo que le contó el abuelo." },
      ] },
      { tipo: "opciones", texto: "¿Qué quiere decir el gran secreto de Sofía?", opciones: [
        { t: "Que vale más guardar y hacer crecer el dinero que gastarlo todo hoy", ok: true, explica: "¡Eso es! Su dinero trabaja para ella mañana." },
        { t: "Que hay que gastar todo rápido", explica: "Al contrario: Sofía no gastó todo." },
        { t: "Que el dinero crece en los árboles", explica: "¡Ojalá! Las semillas son una forma de hablar." },
      ] },
    ],
  },
];

if (typeof module !== "undefined") module.exports = { CUENTOS };
