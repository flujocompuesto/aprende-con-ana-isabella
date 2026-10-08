// Unidades del curso de portugués (de Brasil) — Aprende con Ana Isabella
// Cada unidad: palabras (con dibujo: emoji, color o número), un consejo de
// pronunciación de Capi ("dica"), y frases para armar. La última unidad tiene
// además una conversación con Capi.
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
      { pt: "Eu tenho nove anos.", es: "Tengo nueve años." },
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
        opciones: [{ pt: "Eu me chamo Ana Isabella.", ok: true }, { pt: "Eu tenho nove anos." }, { pt: "Boa noite!" }],
      },
      {
        capi: "Que nome bonito! Quantos anos você tem?", es: "¡Qué nombre tan bonito! ¿Cuántos años tienes?",
        opciones: [{ pt: "Eu tenho nove anos.", ok: true }, { pt: "Eu gosto de gatos." }, { pt: "Obrigada!" }],
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
];

if (typeof module !== "undefined") module.exports = { UNIDADES_PT };
