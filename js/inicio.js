// Página de inicio — muestra las estrellas ganadas en cada juego y el total.

document.querySelectorAll(".juego-card[data-juego]").forEach((tarjeta) => {
  const ganadas = Aprende.estrellasDeJuego(tarjeta.dataset.juego);
  const maximo = Number(tarjeta.dataset.max);
  const etiqueta = tarjeta.querySelector(".progreso-card");
  if (!etiqueta) return;
  if (ganadas === 0) {
    etiqueta.textContent = "¡Nuevo!";
  } else if (ganadas >= maximo) {
    etiqueta.textContent = `🏆 ⭐ ${ganadas} / ${maximo} ¡Completo!`;
  } else {
    etiqueta.textContent = `⭐ ${ganadas} / ${maximo}`;
  }
});

const total = Aprende.totalEstrellas();
const totalEl = document.getElementById("total-estrellas");
if (totalEl && total > 0) {
  totalEl.hidden = false;
  totalEl.textContent = `⭐ Tienes ${total} ${total === 1 ? "estrella" : "estrellas"}`;
}

// Racha del problema del día de ajedrez (la guarda js/ajedrez.js): sigue
// viva si lo resolvió hoy o ayer.
(() => {
  const etiqueta = document.querySelector('.juego-card[data-juego="ajedrez"] .progreso-card');
  if (!etiqueta) return;
  let diario = {};
  try {
    diario = JSON.parse(localStorage.getItem("aprende:ajedrez-diario")) || {};
  } catch {
    return;
  }
  const fecha = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const racha = diario.dia === fecha(hoy) || diario.dia === fecha(ayer) ? diario.racha || 0 : 0;
  if (racha > 0) etiqueta.textContent += ` · 🔥 ${racha}`;
  if (diario.dia !== fecha(hoy)) etiqueta.textContent += " · 🧩 ¡Problema del día!";
})();
