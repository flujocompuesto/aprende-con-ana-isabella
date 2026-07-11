// Juego de banderas — Aprende con Ana Isabella
// Adivina el país por su bandera, con tres niveles de dificultad.

// Cada país tiene: código (para la imagen de la bandera) y nombre en español.
// El código es el ISO de 2 letras que usa flagcdn.com para servir la bandera.
const PAISES = {
  facil: [
    { codigo: "us", nombre: "Estados Unidos" },
    { codigo: "mx", nombre: "México" },
    { codigo: "ca", nombre: "Canadá" },
    { codigo: "br", nombre: "Brasil" },
    { codigo: "ar", nombre: "Argentina" },
    { codigo: "es", nombre: "España" },
    { codigo: "fr", nombre: "Francia" },
    { codigo: "it", nombre: "Italia" },
    { codigo: "de", nombre: "Alemania" },
    { codigo: "gb", nombre: "Reino Unido" },
    { codigo: "jp", nombre: "Japón" },
    { codigo: "cn", nombre: "China" },
    { codigo: "in", nombre: "India" },
    { codigo: "ru", nombre: "Rusia" },
    { codigo: "au", nombre: "Australia" },
  ],
  intermedio: [
    { codigo: "co", nombre: "Colombia" },
    { codigo: "pe", nombre: "Perú" },
    { codigo: "cl", nombre: "Chile" },
    { codigo: "ve", nombre: "Venezuela" },
    { codigo: "pt", nombre: "Portugal" },
    { codigo: "gr", nombre: "Grecia" },
    { codigo: "se", nombre: "Suecia" },
    { codigo: "no", nombre: "Noruega" },
    { codigo: "ch", nombre: "Suiza" },
    { codigo: "nl", nombre: "Países Bajos" },
    { codigo: "ie", nombre: "Irlanda" },
    { codigo: "eg", nombre: "Egipto" },
    { codigo: "za", nombre: "Sudáfrica" },
    { codigo: "kr", nombre: "Corea del Sur" },
    { codigo: "tr", nombre: "Turquía" },
    { codigo: "pl", nombre: "Polonia" },
    { codigo: "be", nombre: "Bélgica" },
    { codigo: "at", nombre: "Austria" },
  ],
  dificil: [
    { codigo: "sk", nombre: "Eslovaquia" },
    { codigo: "si", nombre: "Eslovenia" },
    { codigo: "hr", nombre: "Croacia" },
    { codigo: "rs", nombre: "Serbia" },
    { codigo: "ro", nombre: "Rumania" },
    { codigo: "bg", nombre: "Bulgaria" },
    { codigo: "ua", nombre: "Ucrania" },
    { codigo: "ci", nombre: "Costa de Marfil" },
    { codigo: "id", nombre: "Indonesia" },
    { codigo: "ec", nombre: "Ecuador" },
    { codigo: "py", nombre: "Paraguay" },
    { codigo: "uy", nombre: "Uruguay" },
    { codigo: "qa", nombre: "Catar" },
    { codigo: "ae", nombre: "Emiratos Árabes Unidos" },
    { codigo: "my", nombre: "Malasia" },
    { codigo: "ph", nombre: "Filipinas" },
    { codigo: "nz", nombre: "Nueva Zelanda" },
    { codigo: "is", nombre: "Islandia" },
  ],
};

// Cuántas preguntas tiene cada partida. Puedes cambiar este número.
const TOTAL_PREGUNTAS = 10;
// Puntos que vale cada respuesta correcta.
const PUNTOS_POR_ACIERTO = 10;

const NOMBRE_NIVEL = {
  facil: "Fácil",
  intermedio: "Intermedio",
  dificil: "Difícil",
};

// Estado de la partida en curso.
let nivelActual = null;
let preguntas = [];
let indice = 0;
let puntos = 0;
let aciertos = 0;
let bloqueado = false;

// Referencias a los elementos de la página.
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFin = document.getElementById("pantalla-fin");

const puntosEl = document.getElementById("puntos");
const contadorEl = document.getElementById("contador");
const barraEl = document.getElementById("barra-progreso");
const banderaEl = document.getElementById("bandera");
const opcionesEl = document.getElementById("opciones");
const mensajeEl = document.getElementById("mensaje-juego");

// Devuelve la URL de la imagen de la bandera en buena calidad.
function urlBandera(codigo) {
  return `https://flagcdn.com/w640/${codigo}.png`;
}

// Mezcla una lista al azar (algoritmo de Fisher-Yates).
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarPantalla(pantalla) {
  [pantallaInicio, pantallaJuego, pantallaFin].forEach((p) => {
    p.hidden = p !== pantalla;
  });
}

// Prepara las preguntas de la partida para el nivel elegido.
function empezarPartida(nivel) {
  nivelActual = nivel;
  const pool = PAISES[nivel];
  const seleccion = mezclar(pool).slice(0, TOTAL_PREGUNTAS);

  preguntas = seleccion.map((correcto) => {
    // Elegimos 3 países distintos del mismo nivel como respuestas incorrectas.
    const distractores = mezclar(pool.filter((p) => p.codigo !== correcto.codigo)).slice(0, 3);
    const opciones = mezclar([correcto, ...distractores]);
    return { correcto, opciones };
  });

  indice = 0;
  puntos = 0;
  aciertos = 0;
  mostrarPantalla(pantallaJuego);
  mostrarPregunta();
}

function mostrarPregunta() {
  bloqueado = false;
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje-juego";

  const pregunta = preguntas[indice];
  puntosEl.textContent = `Puntos: ${puntos}`;
  contadorEl.textContent = `${indice + 1}/${TOTAL_PREGUNTAS}`;
  barraEl.style.width = `${(indice / TOTAL_PREGUNTAS) * 100}%`;

  banderaEl.src = urlBandera(pregunta.correcto.codigo);
  banderaEl.alt = "Bandera para adivinar";

  opcionesEl.innerHTML = "";
  pregunta.opciones.forEach((pais) => {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = pais.nombre;
    boton.addEventListener("click", () => responder(pais, boton));
    opcionesEl.appendChild(boton);
  });
}

function responder(pais, boton) {
  if (bloqueado) return;
  bloqueado = true;

  const correcto = preguntas[indice].correcto;
  const acerto = pais.codigo === correcto.codigo;

  // Marcamos visualmente todas las opciones.
  const botones = opcionesEl.querySelectorAll(".opcion");
  botones.forEach((b) => {
    b.disabled = true;
    if (b.textContent === correcto.nombre) {
      b.classList.add("correcta");
    }
  });

  if (acerto) {
    puntos += PUNTOS_POR_ACIERTO;
    aciertos++;
    puntosEl.textContent = `Puntos: ${puntos}`;
    mensajeEl.textContent = "¡Muy bien! 🎉";
    mensajeEl.className = "mensaje-juego exito";
  } else {
    boton.classList.add("incorrecta");
    mensajeEl.textContent = `Era ${correcto.nombre}`;
    mensajeEl.className = "mensaje-juego error";
  }

  // Avanzamos automáticamente a la siguiente pregunta.
  setTimeout(siguiente, 1400);
}

function siguiente() {
  indice++;
  if (indice >= preguntas.length) {
    terminarPartida();
  } else {
    mostrarPregunta();
  }
}

function terminarPartida() {
  barraEl.style.width = "100%";
  mostrarPantalla(pantallaFin);

  const porcentaje = aciertos / TOTAL_PREGUNTAS;
  let emoji = "🌱";
  let felicitacion = "¡Sigue practicando!";
  if (porcentaje === 1) {
    emoji = "🏆";
    felicitacion = "¡Perfecto! Eres una campeona de banderas.";
  } else if (porcentaje >= 0.7) {
    emoji = "⭐";
    felicitacion = "¡Muy bien! Ya sabes muchas banderas.";
  } else if (porcentaje >= 0.4) {
    emoji = "👍";
    felicitacion = "¡Vas mejorando! Inténtalo otra vez.";
  }

  document.getElementById("fin-emoji").textContent = emoji;
  document.getElementById("fin-puntaje").textContent = `Acertaste ${aciertos} de ${TOTAL_PREGUNTAS}`;
  document.getElementById("fin-felicitacion").textContent = felicitacion;
  document.getElementById("fin-puntos").textContent = `${puntos} puntos`;
  document.getElementById("fin-nivel").textContent = `Nivel: ${NOMBRE_NIVEL[nivelActual]}`;
}

// Botones de selección de nivel.
document.querySelectorAll("[data-nivel]").forEach((boton) => {
  boton.addEventListener("click", () => empezarPartida(boton.dataset.nivel));
});

// Botón "Volver a elegir nivel" (aparece en el juego y en el final).
document.querySelectorAll("[data-accion='inicio']").forEach((boton) => {
  boton.addEventListener("click", () => mostrarPantalla(pantallaInicio));
});

// Botón "Jugar otra vez" con el mismo nivel.
document.getElementById("btn-repetir").addEventListener("click", () => {
  empezarPartida(nivelActual);
});

mostrarPantalla(pantallaInicio);
