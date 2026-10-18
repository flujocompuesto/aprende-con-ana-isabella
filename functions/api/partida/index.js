// POST /api/partida  { color: "w" | "b" } → crea una partida nueva.
// Devuelve el código (4 cifras, fácil de dictar) y la clave secreta del
// color elegido. De paso borra las partidas de hace más de 2 días.
import { json, claveNueva } from "../../_lib/partidas.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Falta la base de datos de partidas." }, 503);
  let color = "w";
  try {
    const cuerpo = await request.json();
    if (cuerpo.color === "b") color = "b";
  } catch {
    // Sin cuerpo: blancas.
  }
  const ahora = Date.now();
  await env.DB.prepare("DELETE FROM partidas WHERE actualizada < ?").bind(ahora - 2 * 86400000).run();
  const clave = claveNueva();
  for (let intento = 0; intento < 8; intento++) {
    const codigo = String(1000 + Math.floor(Math.random() * 9000));
    const r = await env.DB.prepare(
      `INSERT OR IGNORE INTO partidas (codigo, clave_w, clave_b, creada, actualizada) VALUES (?, ?, ?, ?, ?)`
    )
      .bind(codigo, color === "w" ? clave : null, color === "b" ? clave : null, ahora, ahora)
      .run();
    if (r.meta.changes === 1) return json({ codigo, color, clave });
  }
  return json({ error: "No encontré un código libre, prueba otra vez." }, 503);
}
