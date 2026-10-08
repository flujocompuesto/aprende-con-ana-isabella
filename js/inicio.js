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
