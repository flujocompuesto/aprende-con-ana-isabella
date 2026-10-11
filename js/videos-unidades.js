// Unidades del Estudio de videos — Aprende con Ana Isabella
// Cómo hacer un video de YouTube, de la idea a subirlo con papá. Cada unidad
// es una lista de pasos; el "tipo" dice qué juego es (ver js/videos.js):
//   explica    texto de Capi (y tarjetas opcionales)
//   pregunta   opción múltiple; "visual: true" muestra dibujos en vez de texto
//   ordena     tocar las tarjetas en el orden correcto (están en orden aquí)
//   clasifica  mandar cada tarjeta a una de dos cestas
//   escribe    campos que se guardan en "Mi plan de video"
//   set        el estudio de grabación (luz, ruido, celular, apoyo)
//   editor     cortar tomas malas, ordenar las buenas y ver el video
//   miniatura  diseñar la portada del video
//   subida     la ficha para subirlo al canal de papá
//   plan       el plan completo para grabarlo de verdad

// Una toma de cámara dibujada: Capi dentro de un cuadro 16:9. "ancho" es el
// tamaño de Capi (% del cuadro) y "abajo" dónde quedan sus pies (% de alto).
// La letra de cada toma (A, B, C) la pone el juego después de revolverlas.
const toma = (ancho, abajo) =>
  `<span class="mini-toma"><img src="../img/capibara.svg" alt="" style="width:${ancho}%;top:${abajo}%" /></span>`;

const UNIDADES_VIDEO = [
  {
    id: "idea", titulo: "La idea", icono: "💡",
    pasos: [
      {
        tipo: "explica",
        texto: "¡Hola, creadora! 🎬 Aquí vas a aprender a hacer videos para YouTube, paso a paso. Todo video empieza con una <strong>idea</strong>, y una buena idea responde tres preguntas:",
        tarjetas: [
          { emoji: "🎯", titulo: "¿De qué trata?", texto: "Un solo tema, bien clarito." },
          { emoji: "👧", titulo: "¿Para quién es?", texto: "Niños, principiantes, la familia…" },
          { emoji: "🎁", titulo: "¿Qué se lleva?", texto: "Algo que aprende o que lo hace reír." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Un video donde enseñas a hacer algo <strong>paso a paso</strong> se llama…",
        opciones: [
          { t: "Tutorial", ok: true, explica: "¡Sí! Los tutoriales son de los videos más buscados: la gente quiere aprender a hacer cosas." },
          { t: "Vlog", explica: "Un vlog es como un diario en video: cuentas cómo fue tu día." },
          { t: "Reseña", explica: "En una reseña das tu opinión de un libro, un juego o un juguete." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Cuál de estas ideas es la más <strong>clara</strong>?",
        opciones: [
          { t: "Cosas que me gustan", explica: "Es muy amplia: ¿cuáles cosas? ¿Qué va a aprender quien la vea?" },
          { t: "Cómo hacer un avión de papel que vuela muy lejos", ok: true, explica: "¡Clarísima! Se sabe de qué trata y qué vas a aprender." },
          { t: "Un video de todo un poco", explica: "Si es de todo, no es de nada. Elige un solo tema." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Qué hace que alguien quiera ver tu video <strong>hasta el final</strong>?",
        opciones: [
          { t: "Que aprenda algo o se divierta", ok: true, explica: "¡Exacto! Piensa siempre en quien lo va a ver." },
          { t: "Que dure muchísimo", explica: "Un video largo no es mejor: es mejor uno corto y entretenido." },
          { t: "Que tenga palabras muy difíciles", explica: "Mejor palabras sencillas, para que todos entiendan." },
        ],
      },
      {
        tipo: "escribe",
        texto: "¡Ahora tú! Elige de qué será <strong>tu</strong> video. Se guarda en <strong>tu plan de video</strong> 📋 (solo en este aparato) y al final lo grabas con papá.",
        exito: "¡Guardado en tu plan! 📋 Qué buena idea.",
        campos: [
          {
            clave: "tema", etiqueta: "¿De qué trata tu video?", tipo: "elige", libre: "…o escribe tu propia idea",
            opciones: ["♟️ Ajedrez para principiantes", "🤖 Mi robot o un invento", "🧪 Un experimento de ciencia", "🎨 Dibujo paso a paso", "🍪 Una receta fácil", "📚 Reseña de un libro", "🦫 Datos curiosos de animales", "✈️ Manualidad de papel"],
          },
          { clave: "publico", etiqueta: "¿Para quién es?", tipo: "elige", opciones: ["Niños como yo", "Principiantes de cualquier edad", "Toda la familia"] },
          { clave: "aprende", etiqueta: "¿Qué va a aprender o sentir quien lo vea?", tipo: "texto", placeholder: "Ej.: a doblar un avión que vuela lejos", max: 90 },
        ],
      },
    ],
  },
  {
    id: "cuidate", titulo: "Cuídate en internet", icono: "🛡️",
    pasos: [
      {
        tipo: "explica",
        texto: "Un secreto de las creadoras inteligentes: en internet <strong>cualquier persona</strong> puede ver tus videos. Por eso se muestra <strong>lo que haces</strong>, no <strong>quién eres ni dónde vives</strong>.",
      },
      {
        tipo: "explica",
        texto: "¿Sabías que para tener un canal propio en YouTube hay que tener <strong>13 años</strong>? Hasta entonces, tus videos se suben en el <strong>canal de papá</strong>, y siempre <strong>juntos</strong>: papá revisa cada video antes de publicarlo.",
      },
      {
        tipo: "clasifica",
        texto: "¿Se puede mostrar en un video? Manda cada tarjeta a su lugar.",
        cestas: ["✅ Sí se puede", "🚫 Mejor no"],
        exito: "¡Muy bien! Ya sabes cuidar tu privacidad. 🛡️",
        items: [
          { t: "✋ Tus manos haciendo una manualidad", cesta: 0, por: "Muchas creadoras graban solo sus manos." },
          { t: "🤖 Tu robot o tu invento", cesta: 0, por: "Eso es justo lo que la gente quiere ver." },
          { t: "🪪 Tu nombre completo, con apellidos", cesta: 1, por: "Basta con tu nombre de creadora o un apodo." },
          { t: "🏫 El nombre o el uniforme de tu escuela", cesta: 1, por: "Dice dónde estás todos los días." },
          { t: "🏠 Tu dirección o la vista desde tu ventana", cesta: 1, por: "Con eso alguien podría saber dónde vives." },
          { t: "🎂 Tu edad exacta o tu cumpleaños", cesta: 1, por: "Es un dato personal: mejor guárdalo." },
          { t: "♟️ Un tablero de ajedrez con una jugada", cesta: 0, por: "¡Perfecto para un tutorial!" },
          { t: "🦫 Un muñeco que presenta el video", cesta: 0, por: "Un personaje puede ser la cara de tu canal." },
          { t: "🚗 La placa del carro de la familia", cesta: 1, por: "La placa dice de quién es el carro." },
          { t: "🎨 Tu dibujo terminado", cesta: 0, por: "Solo revisa que no tenga tu nombre completo escrito." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Alguien te escribe pidiendo tu teléfono o dónde vives. ¿Qué haces?",
        opciones: [
          { t: "No le contesto y le aviso a papá", ok: true, explica: "¡Siempre! Nunca des datos personales, y cuéntale a un adulto." },
          { t: "Le contesto, parece amable", explica: "Aunque parezca amable, en internet no sabes quién es. Avísale a papá." },
          { t: "Le digo solo el nombre de mi escuela", explica: "La escuela también es un dato personal. Mejor no contestes y avísale a papá." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Quién sube tus videos a YouTube?",
        opciones: [
          { t: "Papá y yo, juntos, desde su canal", ok: true, explica: "¡Así es! Juntos y con el canal de papá." },
          { t: "Yo sola, sin decirle a nadie", explica: "Hasta los 13 años no se puede tener canal propio, y siempre es mejor con papá." },
          { t: "Un amigo que tenga la contraseña", explica: "Las contraseñas no se comparten con nadie, ni con los amigos." },
        ],
      },
    ],
  },
  {
    id: "guion", titulo: "El guion", icono: "📝",
    pasos: [
      {
        tipo: "explica",
        texto: "Un buen video tiene <strong>3 partes</strong>, como un cuento. Cuando dibujas cada escena como en un cómic, haces un <strong>storyboard</strong>.",
        tarjetas: [
          { emoji: "🪝", titulo: "Gancho", texto: "Los primeros segundos: algo que dé ganas de seguir viendo." },
          { emoji: "🧩", titulo: "Desarrollo", texto: "Los pasos o lo que muestras, en orden." },
          { emoji: "🎉", titulo: "Final", texto: "El resultado y una despedida." },
        ],
      },
      {
        tipo: "ordena",
        texto: "Ordena el storyboard del video <strong>«Avión de papel que vuela lejos»</strong>: toca las escenas de la primera a la última.",
        exito: "¡Storyboard perfecto! Gancho, pasos y final. 🎬",
        items: [
          "✈️ ¡Mira cómo vuela! Hoy te enseño a hacerlo",
          "📄 Solo necesitas una hoja de papel",
          "📐 Dobla la punta en triángulo",
          "🛩️ Dobla las alas hacia abajo",
          "🚀 ¡A volar! Mira qué lejos llega",
          "👋 ¡Chao! La próxima vez: un avión que da vueltas",
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Cuál es el mejor <strong>gancho</strong> para empezar ese video?",
        opciones: [
          { t: "«Hola… eh… bueno… hoy… vamos a ver…»", explica: "Si empiezas dudando, la gente se va. ¡Ensaya antes la primera frase!" },
          { t: "«¿Sabías que este avión vuela más de 10 metros? ¡Hoy aprendes a hacerlo!»", ok: true, explica: "¡Eso es un gancho! Una pregunta o algo sorprendente al inicio." },
          { t: "«Este video es largo, ten paciencia»", explica: "Eso da ganas de irse, no de quedarse." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Cuánto debería durar tu <strong>primer</strong> video?",
        opciones: [
          { t: "Cortito: de 1 a 3 minutos", ok: true, explica: "¡Sí! Es más fácil de grabar y editar, y la gente lo ve completo." },
          { t: "Una hora", explica: "Demasiado para empezar: grabar y editar una hora es muchísimo trabajo." },
          { t: "5 segundos", explica: "No alcanza para enseñar nada." },
        ],
      },
      {
        tipo: "escribe",
        texto: "Ahora escribe el guion de <strong>tu</strong> video, cortito. Recuerda: gancho, pasos y final.",
        exito: "¡Tu guion quedó en tu plan! 📋",
        campos: [
          { clave: "gancho", etiqueta: "🪝 Gancho: ¿qué dices al empezar?", tipo: "texto", placeholder: "Ej.: ¿Sabías que…?", requerido: true, max: 120 },
          { clave: "paso1", etiqueta: "🧩 Paso 1", tipo: "texto", placeholder: "Ej.: Necesitas…", requerido: true, max: 90 },
          { clave: "paso2", etiqueta: "🧩 Paso 2", tipo: "texto", placeholder: "Ej.: Después…", max: 90 },
          { clave: "paso3", etiqueta: "🧩 Paso 3", tipo: "texto", placeholder: "Ej.: Y al final…", max: 90 },
          { clave: "final", etiqueta: "🎉 Final: ¿cómo te despides?", tipo: "texto", placeholder: "Ej.: ¡Chao! La próxima vez…", requerido: true, max: 120 },
        ],
      },
    ],
  },
  {
    id: "grabar", titulo: "¡A grabar!", icono: "🎥",
    pasos: [
      {
        tipo: "explica",
        texto: "¡Luces, cámara, acción! Los 4 secretos para que tu video se vea y se oiga bien:",
        tarjetas: [
          { emoji: "💡", titulo: "Luz", texto: "La ventana frente a ti, no detrás." },
          { emoji: "🤫", titulo: "Silencio", texto: "Un lugar tranquilo, cerca del celular." },
          { emoji: "📱", titulo: "Celular", texto: "Acostado (horizontal) y firme." },
          { emoji: "🖼️", titulo: "Encuadre", texto: "Que se vea bien lo importante." },
        ],
      },
      {
        tipo: "set",
        texto: "Prepara el estudio de grabación de Capi. Cambia cada cosa y mira la pantalla del celular. Cuando todo esté bien, toca <strong>🎬 Grabar</strong>.",
        controles: [
          {
            clave: "luz", etiqueta: "💡 Luz",
            opciones: [
              { v: "detras", t: "Ventana detrás", porque: "Con la ventana detrás, Capi queda oscura como una sombra: se llama <strong>contraluz</strong>. Ponla frente a la ventana." },
              { v: "frente", t: "Ventana enfrente", ok: true },
              { v: "oscuro", t: "Luz apagada", porque: "Muy oscuro: la cámara no ve bien y la imagen sale con puntitos. Busca luz." },
            ],
          },
          {
            clave: "lugar", etiqueta: "🔊 Lugar",
            opciones: [
              { v: "ruido", t: "Cocina con licuadora", porque: "¡Brrrr! El ruido tapa tu voz. Busca un lugar silencioso." },
              { v: "calma", t: "Cuarto tranquilo", ok: true },
            ],
          },
          {
            clave: "celular", etiqueta: "📱 Celular",
            opciones: [
              { v: "vertical", t: "Parado", porque: "Parado (vertical) es para los Shorts. Para un video normal, acuéstalo: horizontal." },
              { v: "horizontal", t: "Acostado", ok: true },
            ],
          },
          {
            clave: "apoyo", etiqueta: "✋ Apoyo",
            opciones: [
              { v: "mano", t: "En la mano", porque: "En la mano, la imagen tiembla. Usa un trípode o apóyalo en una pila de libros." },
              { v: "tripode", t: "Trípode o libros", ok: true },
            ],
          },
        ],
      },
      {
        tipo: "pregunta", visual: true,
        texto: "¿Cuál de estas <strong>tomas</strong> está mejor?",
        opciones: [
          { html: toma(85, 120), explica: "¡Le cortaste la cabeza! Aléjate un poco y deja espacio arriba." },
          { html: toma(12, 92), explica: "Muy lejos: casi no se ve. Acércate un poco." },
          { html: toma(40, 100), ok: true, explica: "¡Perfecta! Se ve bien y queda un poquito de espacio arriba." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Estás grabando y te equivocas al hablar. ¿Qué haces?",
        opciones: [
          { t: "Hago una pausa, repito la frase y después corto el error al editar", ok: true, explica: "¡Como los profesionales! Repetir una parte se llama hacer otra <strong>toma</strong>." },
          { t: "Borro todo y empiezo de cero", explica: "No hace falta: los errores se cortan en la edición." },
          { t: "Lo dejo así, con el error", explica: "Mejor repite la frase: en la edición eliges la toma buena." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Antes de grabar todo el video, ¿qué conviene hacer?",
        opciones: [
          { t: "Una prueba cortita y mirarla", ok: true, explica: "¡Sí! Así revisas que se vea y se oiga bien antes de grabar todo." },
          { t: "Grabar todo de una vez sin revisar", explica: "Si algo salió mal (luz, sonido…), tendrías que grabar todo otra vez." },
          { t: "Nada, la cámara lo arregla sola", explica: "La cámara no arregla la luz ni el ruido: eso lo cuidas tú." },
        ],
      },
    ],
  },
  {
    id: "edicion", titulo: "Edición", icono: "✂️",
    pasos: [
      {
        tipo: "explica",
        texto: "Editar es como armar un rompecabezas con tus tomas: <strong>cortas</strong> los errores, <strong>ordenas</strong> las partes y agregas <strong>música</strong> y <strong>textos</strong>. Con papá pueden usar una app de edición en la compu o la tablet (por ejemplo, iMovie).",
      },
      {
        tipo: "editor",
        texto: "Esta es la grabación del video del avión, con todas las tomas revueltas. Primero <strong>corta</strong> las que sobran y después <strong>ordénalas</strong>.",
        clips: [
          { emoji: "✈️", t: "Gancho: ¡mira cómo vuela!" },
          { emoji: "📄", t: "Paso 1: la hoja" },
          { emoji: "📐", t: "Paso 2: la punta" },
          { emoji: "🛩️", t: "Paso 3: las alas" },
          { emoji: "🚀", t: "Resultado: ¡a volar!" },
          { emoji: "👋", t: "Despedida" },
          { emoji: "🤧", t: "Toma con un estornudo", malo: true, por: "¡Salud! Esa toma se corta." },
          { emoji: "⬛", t: "Pantalla negra: se tapó la cámara", malo: true, por: "Nadie quiere ver una pantalla negra." },
          { emoji: "😂", t: "Me equivoqué y me dio risa", malo: true, por: "Fue divertido, pero se corta (¡o se guarda para un video de bloopers!)." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Qué música le puedes poner a tu video?",
        opciones: [
          { t: "Música libre, como la de la Biblioteca de audio de YouTube", ok: true, explica: "¡Sí! Es gratis y se puede usar sin problemas." },
          { t: "La canción famosa que está de moda", explica: "Tiene <strong>derechos de autor</strong>: YouTube puede quitarle el sonido a tu video o bloquearlo." },
          { t: "Cualquier canción que encuentre en internet", explica: "La mayoría tiene derechos de autor. Usa música libre." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Para qué sirven los <strong>textos</strong> en la pantalla?",
        opciones: [
          { t: "Para destacar algo importante, como el nombre de cada paso", ok: true, explica: "¡Eso! Pocas palabras, grandes y en el momento justo." },
          { t: "Para escribir todo lo que digo, con letra chiquita", explica: "Mucho texto no se alcanza a leer. Pocas palabras y grandes." },
          { t: "Para tapar la imagen", explica: "El texto acompaña, no tapa lo importante." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "Mientras hablas, la música debe…",
        opciones: [
          { t: "Sonar bajita, para que se oiga tu voz", ok: true, explica: "¡Exacto! Tu voz es lo más importante." },
          { t: "Sonar más fuerte que tu voz", explica: "Si la música tapa tu voz, nadie entiende lo que explicas." },
          { t: "Cambiar de canción a cada rato", explica: "Mejor una sola música tranquila de fondo." },
        ],
      },
    ],
  },
  {
    id: "miniatura", titulo: "Miniatura y título", icono: "🖼️",
    pasos: [
      {
        tipo: "explica",
        texto: "La <strong>miniatura</strong> es la portada de tu video: lo primero que la gente ve. Y el <strong>título</strong> dice de qué trata.",
        tarjetas: [
          { emoji: "🔠", titulo: "Pocas palabras", texto: "Máximo 4, y GRANDES." },
          { emoji: "🌈", titulo: "Colores fuertes", texto: "Que se vea desde lejos." },
          { emoji: "🖼️", titulo: "Una imagen clara", texto: "Que muestre el tema." },
          { emoji: "🤝", titulo: "La verdad", texto: "Lo que prometes, lo cumples." },
        ],
      },
      {
        tipo: "pregunta",
        texto: "¿Cuál es el mejor <strong>título</strong> para el video del avión?",
        opciones: [
          { t: "Avión de papel que vuela MUY lejos ✈️ (¡fácil!)", ok: true, explica: "Dice de qué trata y da ganas de verlo." },
          { t: "¡¡NO VAS A CREER LO QUE PASÓ!! 😱😱", explica: "Eso es <strong>clickbait</strong>: no dice de qué trata y la gente se siente engañada." },
          { t: "video 1", explica: "Nadie sabe de qué trata. ¡Así nadie lo encuentra!" },
        ],
      },
      {
        tipo: "miniatura",
        texto: "¡Diseña la miniatura de <strong>tu</strong> video! Elige el color, la imagen y un texto cortito. Cuando esté lista, toca <strong>✅ Lista</strong>.",
        fondos: ["#f0b93b", "#ef8a3c", "#d65a46", "#2e7d8c", "#3f9a52", "#6fb3d9"],
        imagenes: ["✈️", "🤖", "♟️", "🧪", "🎨", "🍪", "📚", "🦫", "⚽", "🦖", "🌋", "🎸"],
        quien: [
          { v: "capi", t: "🦫 Capi o un muñeco", ok: true },
          { v: "objeto", t: "✋ Mis manos o el objeto", ok: true },
          { v: "cara", t: "🙂 Mi cara", porque: "Mejor sin tu cara: usa a Capi, un muñeco, tus manos o el objeto del video. (Si algún día quieren mostrarla, lo decide papá.)" },
        ],
      },
      {
        tipo: "escribe",
        texto: "Ahora el <strong>título</strong> de tu video: que diga de qué trata, ¡y que sea verdad!",
        exito: "¡Título guardado en tu plan! 🏷️",
        campos: [
          { clave: "titulo", etiqueta: "🏷️ Título", tipo: "texto", placeholder: "Ej.: Avión de papel que vuela MUY lejos ✈️", requerido: true, max: 100 },
        ],
      },
    ],
  },
  {
    id: "subir", titulo: "Súbelo con papá", icono: "🚀",
    pasos: [
      {
        tipo: "explica",
        texto: "¡Último paso! El video se sube con papá desde <strong>YouTube Studio</strong>, en su cuenta. Ahí se llena una ficha: título, descripción, miniatura y quién lo puede ver.",
      },
      {
        tipo: "ordena",
        texto: "Ordena los pasos para subir el video:",
        exito: "¡Eso es! Así se sube un video. ⬆️",
        items: [
          "👨 Papá entra a YouTube Studio con su cuenta",
          "⬆️ Tocan «Crear» y eligen el archivo del video",
          "✏️ Escriben el título y la descripción",
          "🖼️ Suben la miniatura",
          "🧒 Marcan «Sí, es contenido para niños»",
          "👀 Eligen quién lo puede ver",
          "✅ ¡Publicar!",
        ],
      },
      {
        tipo: "pregunta",
        texto: "Si un video es <strong>«No listado»</strong>, ¿quién lo puede ver?",
        opciones: [
          { t: "Solo quien tenga el enlace", ok: true, explica: "¡Sí! No aparece en búsquedas: papá le manda el enlace a la familia." },
          { t: "Todo el mundo", explica: "Ese es «Público»: aparece en búsquedas y lo puede ver cualquiera." },
          { t: "Nadie, ni papá", explica: "«Privado» lo ven solo papá y las personas que él invite." },
        ],
      },
      {
        tipo: "subida",
        texto: "¡A practicar! Llena la ficha para subir <strong>tu</strong> video al canal de papá. Ojo con la descripción: ¿qué frases sí van?",
        frases: [
          { t: "En este video te enseño algo genial, ¡paso a paso!" },
          { t: "Música: Biblioteca de audio de YouTube 🎵" },
          { t: "Mi dirección es: (la calle y el número de mi casa) 🏠", malo: true, porque: "¡Nunca! La dirección de tu casa no se pone en internet." },
          { t: "Mi escuela es: (el nombre de mi escuela) 🏫", malo: true, porque: "El nombre de tu escuela dice dónde estás todos los días: no va." },
          { t: "Mi teléfono es: (mi número) 📞", malo: true, porque: "El teléfono es un dato personal: no se comparte." },
          { t: "¡Gracias por ver mi video! 💛" },
        ],
        audiencia: [
          { v: "si", t: "Sí, es contenido para niños", ok: true },
          { v: "no", t: "No, no es para niños", porque: "Tu video es para niños como tú: YouTube pide marcarlo así, y además se apagan los comentarios." },
        ],
        visibilidad: [
          { v: "privado", t: "🔒 Privado", detalle: "Solo papá y quienes él invite", ok: true },
          { v: "no-listado", t: "🔗 No listado", detalle: "Solo quien tenga el enlace", ok: true },
          { v: "publico", t: "🌎 Público", detalle: "Todo el mundo", porque: "Para tu primer video, mejor que primero lo vea la familia: elige Privado o No listado. Después, si papá dice que sí, se puede cambiar." },
        ],
      },
      {
        tipo: "plan",
        texto: "¡Lo lograste, creadora! 🎉 Aquí está <strong>tu plan de video</strong> con todo lo que preparaste. Imprímelo o míralo con papá… ¡y a grabar!",
      },
    ],
  },
];

if (typeof module !== "undefined") module.exports = { UNIDADES_VIDEO };
