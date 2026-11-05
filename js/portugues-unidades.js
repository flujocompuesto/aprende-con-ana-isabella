// Unidades del curso de portugués (de Brasil) — Aprende con Ana Isabella
// Cada unidad: palabras (con dibujo: emoji, color o número), un consejo de
// pronunciación de Capi ("dica"), y frases para armar. Las de conversación
// (la 8 y la 11) cambian las palabras por una charla con Capi.
// conDibujos: false → las opciones de práctica se muestran como texto en
// español (sirve para saludos, que no se pueden dibujar bien).

const UNIDADES_PT = [
  {
    id: "ola", titulo: "Olá!", es: "Saludos", icono: "👋", conDibujos: false,
    dica: "Las niñas dicen <strong>obrigada</strong> y los niños <strong>obrigado</strong>. Y esa <strong>o</strong> del final suena casi como <strong>u</strong>: «obrigadu».",
    palabras: [
      { pt: "olá", es: "hola", emoji: "👋" },
      { pt: "oi", es: "hola (entre amigos)", emoji: "😊" },
      { pt: "bom dia", es: "buenos días", emoji: "🌅" },
      { pt: "boa tarde", es: "buenas tardes", emoji: "🌇" },
      { pt: "boa noite", es: "buenas noches", emoji: "🌙" },
      { pt: "tchau", es: "adiós", emoji: "🙋" },
      { pt: "obrigada", es: "gracias", emoji: "💐" },
      { pt: "por favor", es: "por favor", emoji: "🙏" },
      { pt: "tudo bem?", es: "¿todo bien?", emoji: "👍" },
      { pt: "desculpa", es: "perdón", emoji: "🙇" },
    ],
    frases: [
      { pt: "Oi, tudo bem?", es: "Hola, ¿todo bien?" },
      { pt: "Bom dia, professora!", es: "¡Buenos días, maestra!" },
    ],
  },
  {
    id: "numeros", titulo: "Números", es: "Números", icono: "🔢", conDibujos: true,
    dica: "El 2 se dice <strong>dois</strong> (como «dos» con i) y el 3 lleva acento: <strong>três</strong>. ¡El 6 se dice <strong>seis</strong>, igualito!",
    palabras: [
      { pt: "um", es: "uno", texto: "1" },
      { pt: "dois", es: "dos", texto: "2" },
      { pt: "três", es: "tres", texto: "3" },
      { pt: "quatro", es: "cuatro", texto: "4" },
      { pt: "cinco", es: "cinco", texto: "5" },
      { pt: "seis", es: "seis", texto: "6" },
      { pt: "sete", es: "siete", texto: "7" },
      { pt: "oito", es: "ocho", texto: "8" },
      { pt: "nove", es: "nueve", texto: "9" },
      { pt: "dez", es: "diez", texto: "10" },
    ],
    frases: [
      { pt: "A Capi tem quatro patas.", es: "Capi tiene cuatro patas." },
      { pt: "Eu tenho dois gatos.", es: "Tengo dos gatos." },
    ],
  },
  {
    id: "cores", titulo: "Cores", es: "Colores", icono: "🎨", conDibujos: true,
    dica: "La <strong>lh</strong> suena como una «li» rapidita: verme<strong>lh</strong>o se dice «vermelio». ¡Y café se dice <strong>marrom</strong>!",
    palabras: [
      { pt: "vermelho", es: "rojo", color: "#e74c3c" },
      { pt: "azul", es: "azul", color: "#3498db" },
      { pt: "verde", es: "verde", color: "#2ecc71" },
      { pt: "amarelo", es: "amarillo", color: "#f1c40f" },
      { pt: "laranja", es: "naranja", color: "#e67e22" },
      { pt: "roxo", es: "morado", color: "#9b59b6" },
      { pt: "rosa", es: "rosado", color: "#fd79a8" },
      { pt: "preto", es: "negro", color: "#2d3436" },
      { pt: "branco", es: "blanco", color: "#ffffff" },
      { pt: "marrom", es: "café", color: "#8d5a3b" },
      { pt: "cinza", es: "gris", color: "#95a5a6" },
    ],
    frases: [
      { pt: "O céu é azul.", es: "El cielo es azul." },
      { pt: "A maçã é vermelha.", es: "La manzana es roja." },
    ],
  },
  {
    id: "animais", titulo: "Animais", es: "Animales", icono: "🐶", conDibujos: true,
    dica: "La <strong>nh</strong> suena como la <strong>ñ</strong>: gali<strong>nh</strong>a se dice «galiña». ¡Y ojo: perro se dice <strong>cachorro</strong>!",
    palabras: [
      { pt: "cachorro", es: "perro", emoji: "🐶" },
      { pt: "gato", es: "gato", emoji: "🐱" },
      { pt: "pássaro", es: "pájaro", emoji: "🐦" },
      { pt: "peixe", es: "pez", emoji: "🐟" },
      { pt: "cavalo", es: "caballo", emoji: "🐴" },
      { pt: "vaca", es: "vaca", emoji: "🐮" },
      { pt: "porco", es: "cerdo", emoji: "🐷" },
      { pt: "coelho", es: "conejo", emoji: "🐰" },
      { pt: "leão", es: "león", emoji: "🦁" },
      { pt: "macaco", es: "mono", emoji: "🐵" },
      { pt: "sapo", es: "rana", emoji: "🐸" },
      { pt: "galinha", es: "gallina", emoji: "🐔" },
    ],
    frases: [
      { pt: "Eu gosto de cachorros.", es: "Me gustan los perros." },
      { pt: "O gato é preto.", es: "El gato es negro." },
    ],
  },
  {
    id: "familia", titulo: "Família", es: "Familia", icono: "👨‍👩‍👧", conDibujos: true,
    dica: "La <strong>ã</strong> y el <strong>ão</strong> suenan por la nariz: m<strong>ã</strong>e, irm<strong>ão</strong>. ¡Y fíjate: <strong>avó</strong> (abuela) y <strong>avô</strong> (abuelo) solo cambian el acento!",
    palabras: [
      { pt: "mãe", es: "mamá", emoji: "👩" },
      { pt: "pai", es: "papá", emoji: "👨" },
      { pt: "irmã", es: "hermana", emoji: "👧" },
      { pt: "irmão", es: "hermano", emoji: "👦" },
      { pt: "avó", es: "abuela", emoji: "👵" },
      { pt: "avô", es: "abuelo", emoji: "👴" },
      { pt: "bebê", es: "bebé", emoji: "👶" },
      { pt: "família", es: "familia", emoji: "👨‍👩‍👧" },
    ],
    frases: [
      { pt: "Esta é a minha mãe.", es: "Esta es mi mamá." },
      { pt: "Eu amo a minha família.", es: "Amo a mi familia." },
    ],
  },
  {
    id: "comida", titulo: "Comida", es: "Comida", icono: "🍎", conDibujos: true,
    dica: "La <strong>ç</strong> suena como <strong>s</strong>: ma<strong>ç</strong>ã. Y cuidado: <strong>bolo</strong> es pastel y <strong>sorvete</strong> es helado.",
    palabras: [
      { pt: "maçã", es: "manzana", emoji: "🍎" },
      { pt: "pão", es: "pan", emoji: "🍞" },
      { pt: "leite", es: "leche", emoji: "🥛" },
      { pt: "ovo", es: "huevo", emoji: "🥚" },
      { pt: "queijo", es: "queso", emoji: "🧀" },
      { pt: "bolo", es: "pastel", emoji: "🍰" },
      { pt: "banana", es: "plátano", emoji: "🍌" },
      { pt: "uva", es: "uva", emoji: "🍇" },
      { pt: "morango", es: "fresa", emoji: "🍓" },
      { pt: "água", es: "agua", emoji: "💧" },
      { pt: "sorvete", es: "helado", emoji: "🍦" },
      { pt: "arroz", es: "arroz", emoji: "🍚" },
    ],
    frases: [
      { pt: "Eu quero um sorvete.", es: "Quiero un helado." },
      { pt: "Eu gosto de morango.", es: "Me gusta la fresa." },
    ],
  },
  {
    id: "escola", titulo: "Escola", es: "Escuela", icono: "🎒", conDibujos: true,
    dica: "Muchas palabras de la escuela se parecen al español: <strong>livro</strong> (libro), <strong>escola</strong> (escuela). ¡Pero la silla es <strong>cadeira</strong>!",
    palabras: [
      { pt: "livro", es: "libro", emoji: "📕" },
      { pt: "lápis", es: "lápiz", emoji: "✏️" },
      { pt: "caderno", es: "cuaderno", emoji: "📓" },
      { pt: "mochila", es: "mochila", emoji: "🎒" },
      { pt: "professora", es: "maestra", emoji: "👩‍🏫" },
      { pt: "escola", es: "escuela", emoji: "🏫" },
      { pt: "cadeira", es: "silla", emoji: "🪑" },
      { pt: "tesoura", es: "tijeras", emoji: "✂️" },
      { pt: "régua", es: "regla", emoji: "📏" },
      { pt: "computador", es: "computadora", emoji: "💻" },
    ],
    frases: [
      { pt: "O livro está na mochila.", es: "El libro está en la mochila." },
      { pt: "Eu gosto da escola.", es: "Me gusta la escuela." },
    ],
  },
  {
    id: "conversa", titulo: "Conversa com a Capi", es: "Conversación", icono: "💬", conDibujos: false,
    dica: "¡Ya sabes un montón! Ahora vamos a <strong>platicar en portugués</strong>. Escucha lo que te digo y elige qué contestar.",
    palabras: [],
    conversa: [
      {
        capi: "Oi! Eu sou a Capi. Como você se chama?", es: "¡Hola! Soy Capi. ¿Cómo te llamas?",
        opciones: [{ pt: "Eu me chamo Ana Isabella.", ok: true }, { pt: "Sim, um pouquinho!" }, { pt: "Boa noite!" }],
      },
      {
        capi: "Que nome bonito! Você fala português?", es: "¡Qué nombre tan bonito! ¿Hablas portugués?",
        opciones: [{ pt: "Sim, um pouquinho!", ok: true }, { pt: "Eu gosto de gatos." }, { pt: "Obrigada!" }],
      },
      {
        capi: "Legal! Do que você gosta?", es: "¡Genial! ¿Qué te gusta?",
        opciones: [{ pt: "Eu gosto de xadrez e robôs!", ok: true }, { pt: "Eu me chamo Capi." }, { pt: "Bom dia!" }],
      },
      {
        capi: "Eu também! Tchau, até logo!", es: "¡A mí también! ¡Adiós, hasta luego!",
        opciones: [{ pt: "Tchau, Capi! Até logo!", ok: true }, { pt: "Oi, tudo bem?" }, { pt: "Eu quero um bolo." }],
      },
    ],
    frases: [
      { pt: "Eu me chamo Ana Isabella.", es: "Me llamo Ana Isabella." },
      { pt: "Eu gosto de xadrez.", es: "Me gusta el ajedrez." },
    ],
  },
  // ---- Unidades difíciles: palabras engañosas y frases más largas ----
  {
    id: "verbos", titulo: "Ações", es: "Verbos", icono: "🏃", conDibujos: true,
    dica: "¡Cuidado con las palabras engañosas! <strong>Brincar</strong> es jugar y <strong>acordar</strong> es despertar (¡no recordar!). Para decir lo que haces, usa <strong>eu</strong> + el verbo terminado en <strong>-o</strong>: eu corro, eu canto, eu desenho.",
    palabras: [
      { pt: "correr", es: "correr", emoji: "🏃" },
      { pt: "nadar", es: "nadar", emoji: "🏊" },
      { pt: "dançar", es: "bailar", emoji: "💃" },
      { pt: "cantar", es: "cantar", emoji: "🎤" },
      { pt: "ler", es: "leer", emoji: "📖" },
      { pt: "escrever", es: "escribir", emoji: "✍️" },
      { pt: "dormir", es: "dormir", emoji: "😴" },
      { pt: "comer", es: "comer", emoji: "🍽️" },
      { pt: "brincar", es: "jugar", emoji: "🧸" },
      { pt: "desenhar", es: "dibujar", emoji: "🖍️" },
      { pt: "acordar", es: "despertar", emoji: "⏰" },
      { pt: "cozinhar", es: "cocinar", emoji: "🍳" },
    ],
    frases: [
      { pt: "Eu gosto de dançar.", es: "Me gusta bailar." },
      { pt: "Eu acordo muito cedo.", es: "Me despierto muy temprano." },
      { pt: "Nós brincamos no parque.", es: "Jugamos en el parque." },
    ],
  },
  {
    id: "semana", titulo: "Dias e tempo", es: "Días y clima", icono: "📅", conDibujos: false,
    dica: "En Brasil los días de semana se cuentan: el lunes es <strong>segunda-feira</strong> (el «segundo día»), el martes <strong>terça-feira</strong>… por eso en los calendarios dice 2ª, 3ª, 4ª. ¡Sábado y domingo son igual que en español! Y la lluvia es <strong>chuva</strong>.",
    palabras: [
      { pt: "segunda-feira", es: "lunes", texto: "2ª" },
      { pt: "terça-feira", es: "martes", texto: "3ª" },
      { pt: "quarta-feira", es: "miércoles", texto: "4ª" },
      { pt: "quinta-feira", es: "jueves", texto: "5ª" },
      { pt: "sexta-feira", es: "viernes", texto: "6ª" },
      { pt: "sábado", es: "sábado", texto: "sáb" },
      { pt: "domingo", es: "domingo", texto: "dom" },
      { pt: "sol", es: "sol", emoji: "☀️" },
      { pt: "chuva", es: "lluvia", emoji: "🌧️" },
      { pt: "nuvem", es: "nube", emoji: "☁️" },
      { pt: "vento", es: "viento", emoji: "💨" },
      { pt: "frio", es: "frío", emoji: "🥶" },
    ],
    frases: [
      { pt: "Hoje é sexta-feira!", es: "¡Hoy es viernes!" },
      { pt: "Hoje faz muito frio.", es: "Hoy hace mucho frío." },
      { pt: "Amanhã vai ter chuva.", es: "Mañana va a llover." },
    ],
  },
  {
    id: "lanchonete", titulo: "Na lanchonete", es: "En la cafetería", icono: "🥪", conDibujos: false,
    dica: "Capi trabaja hoy en una <strong>lanchonete</strong> (cafetería). Pide tu comida en portugués: vas a usar números, comida y <strong>por favor</strong>. En Brasil el dinero son <strong>reais</strong>.",
    palabras: [],
    finConversa: "¡Pediste tu comida en portugués! 🇧🇷🥪",
    conversa: [
      {
        capi: "Bem-vinda à lanchonete! O que você quer comer?", es: "¡Bienvenida a la cafetería! ¿Qué quieres comer?",
        opciones: [{ pt: "Eu quero um sanduíche, por favor.", ok: true }, { pt: "Hoje é domingo." }, { pt: "Eu gosto de azul." }],
      },
      {
        capi: "E para beber?", es: "¿Y para tomar?",
        opciones: [{ pt: "Um suco de laranja, por favor.", ok: true }, { pt: "Eu acordo cedo." }, { pt: "Uma cadeira verde." }],
      },
      {
        capi: "Quantos sanduíches você quer?", es: "¿Cuántos sándwiches quieres?",
        opciones: [{ pt: "Dois, por favor.", ok: true }, { pt: "Está chovendo." }, { pt: "Eu me chamo Capi." }],
      },
      {
        capi: "São dez reais. Mais alguma coisa?", es: "Son diez reales. ¿Algo más?",
        opciones: [{ pt: "Não, obrigada!", ok: true }, { pt: "Sim, eu sou um gato." }, { pt: "Bom dia, professora!" }],
      },
      {
        capi: "Bom apetite! Volte sempre!", es: "¡Buen provecho! ¡Vuelve pronto!",
        opciones: [{ pt: "Obrigada, Capi! Tchau!", ok: true }, { pt: "Quarta-feira." }, { pt: "Eu quero dormir." }],
      },
    ],
    frases: [
      { pt: "Eu quero um suco, por favor.", es: "Quiero un jugo, por favor." },
      { pt: "Quanto custa o sanduíche?", es: "¿Cuánto cuesta el sándwich?" },
      { pt: "Não, obrigada!", es: "¡No, gracias!" },
    ],
  },
  // ---- Unidades nuevas (nov-2026): cuerpo, ropa, fútbol y dos aventuras ----
  {
    id: "corpo", titulo: "O corpo", es: "El cuerpo", icono: "🖐️", conDibujos: true,
    dica: "La <strong>lh</strong> otra vez: o<strong>lh</strong>o se dice «olio» y ore<strong>lh</strong>a «orelia». La <strong>ç</strong> suena como <strong>s</strong>: bra<strong>ç</strong>o es «braso». ¡Y el pelo es <strong>cabelo</strong>!",
    palabras: [
      { pt: "cabeça", es: "cabeza", emoji: "🙆" },
      { pt: "cabelo", es: "pelo", emoji: "💇" },
      { pt: "olho", es: "ojo", emoji: "👁️" },
      { pt: "orelha", es: "oreja", emoji: "👂" },
      { pt: "nariz", es: "nariz", emoji: "👃" },
      { pt: "boca", es: "boca", emoji: "👄" },
      { pt: "dente", es: "diente", emoji: "🦷" },
      { pt: "mão", es: "mano", emoji: "✋" },
      { pt: "braço", es: "brazo", emoji: "💪" },
      { pt: "perna", es: "pierna", emoji: "🦵" },
      { pt: "pé", es: "pie", emoji: "🦶" },
      { pt: "coração", es: "corazón", emoji: "❤️" },
    ],
    frases: [
      { pt: "Eu tenho dois olhos.", es: "Tengo dos ojos." },
      { pt: "A Capi lava as mãos.", es: "Capi se lava las manos." },
      { pt: "Meu cabelo é comprido.", es: "Mi pelo es largo." },
    ],
  },
  {
    id: "roupas", titulo: "Roupas", es: "Ropa", icono: "👕", conDibujos: true,
    dica: "¡Palabras engañosas! La <strong>calça</strong> es el pantalón, los <strong>óculos</strong> son los lentes y las <strong>luvas</strong> son los guantes. Los zapatos deportivos se llaman <strong>tênis</strong>.",
    palabras: [
      { pt: "camiseta", es: "camiseta", emoji: "👕" },
      { pt: "calça", es: "pantalón", emoji: "👖" },
      { pt: "vestido", es: "vestido", emoji: "👗" },
      { pt: "tênis", es: "zapatillas", emoji: "👟" },
      { pt: "boné", es: "gorra", emoji: "🧢" },
      { pt: "chapéu", es: "sombrero", emoji: "👒" },
      { pt: "meias", es: "medias", emoji: "🧦" },
      { pt: "casaco", es: "abrigo", emoji: "🧥" },
      { pt: "cachecol", es: "bufanda", emoji: "🧣" },
      { pt: "luvas", es: "guantes", emoji: "🧤" },
      { pt: "óculos", es: "lentes", emoji: "👓" },
    ],
    frases: [
      { pt: "Eu gosto do meu boné vermelho.", es: "Me gusta mi gorra roja." },
      { pt: "Hoje eu uso um vestido azul.", es: "Hoy uso un vestido azul." },
      { pt: "Faz frio, coloca o casaco!", es: "¡Hace frío, ponte el abrigo!" },
    ],
  },
  {
    id: "futebol", titulo: "Futebol!", es: "Fútbol", icono: "⚽", conDibujos: true,
    dica: "En Brasil el fútbol es casi un idioma. ¡Ojo! <strong>Time</strong> no es tiempo: es el <strong>equipo</strong>, y se dice «chi-mi». La portera es la <strong>goleira</strong> y la hinchada es la <strong>torcida</strong>. ¿Y el gol? ¡Se grita «gooooool»!",
    palabras: [
      { pt: "bola", es: "pelota", emoji: "⚽" },
      { pt: "gol", es: "gol", emoji: "🥅" },
      { pt: "time", es: "equipo", emoji: "👥" },
      { pt: "goleira", es: "portera", emoji: "🧤" },
      { pt: "chutar", es: "patear", emoji: "🦵" },
      { pt: "torcida", es: "hinchada", emoji: "📣" },
      { pt: "estádio", es: "estadio", emoji: "🏟️" },
      { pt: "cartão amarelo", es: "tarjeta amarilla", emoji: "🟨" },
      { pt: "troféu", es: "trofeo", emoji: "🏆" },
      { pt: "campeã", es: "campeona", emoji: "🥇" },
    ],
    frases: [
      { pt: "A goleira defendeu o pênalti!", es: "¡La portera atajó el penal!" },
      { pt: "O meu time ganhou o jogo.", es: "Mi equipo ganó el partido." },
      { pt: "Chuta a bola, Capi!", es: "¡Patea la pelota, Capi!" },
    ],
  },
  {
    id: "pantanal", titulo: "No Pantanal", es: "Paseo por el Pantanal", icono: "🦜", conDibujos: false,
    dica: "¿Te acuerdas del cuento «Capi viaja a Brasil»? Hoy la prima <strong>Cacá</strong> te lleva a pasear por el Pantanal. Escucha lo que dice y contéstale en portugués. Una palabra útil: <strong>Nossa!</strong> es «¡Guau!».",
    palabras: [],
    finConversa: "¡Paseaste por el Pantanal en portugués! 🇧🇷🦜",
    conversa: [
      {
        capi: "Oi, prima! Bem-vinda ao Pantanal!", es: "¡Hola, prima! ¡Bienvenida al Pantanal!",
        opciones: [{ pt: "Obrigada, Cacá! Que lugar lindo!", ok: true }, { pt: "Eu quero um sanduíche." }, { pt: "Hoje é segunda-feira." }],
      },
      {
        capi: "Você quer nadar no rio?", es: "¿Quieres nadar en el río?",
        opciones: [{ pt: "Sim! Eu adoro nadar.", ok: true }, { pt: "Eu tenho dois gatos." }, { pt: "Boa noite!" }],
      },
      {
        capi: "Olha ali! Um jacaré!", es: "¡Mira allá! ¡Un yacaré!",
        opciones: [{ pt: "Nossa! Que grande!", ok: true }, { pt: "Eu uso óculos." }, { pt: "Quanto custa?" }],
      },
      {
        capi: "Você está com fome?", es: "¿Tienes hambre?",
        opciones: [{ pt: "Sim, eu quero uma fruta, por favor.", ok: true }, { pt: "Não, eu sou a goleira." }, { pt: "Tchau, professora!" }],
      },
      {
        capi: "Amanhã vamos ver as araras!", es: "¡Mañana vamos a ver las guacamayas!",
        opciones: [{ pt: "Oba! Até amanhã, Cacá!", ok: true }, { pt: "Hoje faz muito frio." }, { pt: "Eu me chamo Capi." }],
      },
    ],
    frases: [
      { pt: "Eu adoro nadar no rio.", es: "Me encanta nadar en el río." },
      { pt: "Olha, uma arara azul!", es: "¡Mira, una guacamaya azul!" },
    ],
  },
  {
    id: "misterio", titulo: "Noite de mistério", es: "Noche de misterio", icono: "🔦", conDibujos: false,
    dica: "Es de noche y Capi escucha un ruido raro… ¿te animas a investigar con ella? Palabras de miedito: <strong>medo</strong> es miedo, <strong>barulho</strong> es ruido y <strong>escuro</strong> es oscuro. Y cuando pasa el susto se dice <strong>Ufa!</strong>",
    palabras: [],
    finConversa: "¡Resolviste el misterio en portugués! 🔦👻",
    conversa: [
      {
        capi: "Psiu! Você ouviu esse barulho?", es: "¡Shh! ¿Escuchaste ese ruido?",
        opciones: [{ pt: "Sim! O que foi isso?", ok: true }, { pt: "Eu gosto de dançar." }, { pt: "Bom apetite!" }],
      },
      {
        capi: "Vamos ver com a lanterna?", es: "¿Vamos a ver con la linterna?",
        opciones: [{ pt: "Vamos, mas bem devagar!", ok: true }, { pt: "Eu quero um suco." }, { pt: "Hoje é sábado." }],
      },
      {
        capi: "Olha! Dois olhos brilhando no escuro!", es: "¡Mira! ¡Dos ojos brillando en la oscuridad!",
        opciones: [{ pt: "Que medo! Quem está aí?", ok: true }, { pt: "Meu time ganhou." }, { pt: "Obrigada, professora!" }],
      },
      {
        capi: "É só a Nina, a esquilinha!", es: "¡Es solo Nina, la ardillita!",
        opciones: [{ pt: "Ufa! Que susto!", ok: true }, { pt: "Eu gosto de azul." }, { pt: "Um suco de laranja." }],
      },
      {
        capi: "Agora vamos dormir. Boa noite!", es: "Ahora a dormir. ¡Buenas noches!",
        opciones: [{ pt: "Boa noite, Capi! Durma bem!", ok: true }, { pt: "Bom dia, Cacá!" }, { pt: "Vamos chutar a bola!" }],
      },
    ],
    frases: [
      { pt: "Eu tenho medo do escuro.", es: "Le tengo miedo a la oscuridad." },
      { pt: "Ufa, que susto!", es: "¡Uf, qué susto!" },
    ],
  },
];

if (typeof module !== "undefined") module.exports = { UNIDADES_PT };
