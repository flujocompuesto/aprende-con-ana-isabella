// GET  /api/partida/:codigo → estado de la partida (jugadas y estado).
// POST /api/partida/:codigo  { tipo, ... }:
//   unirse                    → ocupa el color libre y devuelve su clave
//   jugada { clave, jugada, n } → agrega la jugada número n (0, 1, 2…) si es
//                                 el turno de esa clave
//   rendirse { clave }
//   pedir-deshacer { clave }  → pide volver a antes de su última jugada
//   responder-deshacer { clave, acepta } → el rival dice que sí o que no
import { json, claveNueva, publica, JUGADA_VALIDA } from "../../_lib/partidas.js";

async function leer(env, codigo) {
  return env.DB.prepare("SELECT * FROM partidas WHERE codigo = ?").bind(codigo).first();
}

export async function onRequestGet({ params, env }) {
  if (!env.DB) return json({ error: "Falta la base de datos de partidas." }, 503);
  const fila = await leer(env, String(params.codigo));
  if (!fila) return json({ error: "No existe una partida con ese código." }, 404);
  return json(publica(fila));
}

export async function onRequestPost({ params, request, env }) {
  if (!env.DB) return json({ error: "Falta la base de datos de partidas." }, 503);
  const codigo = String(params.codigo);
  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return json({ error: "Pedido inválido." }, 400);
  }
  const fila = await leer(env, codigo);
  if (!fila) return json({ error: "No existe una partida con ese código." }, 404);
  const ahora = Date.now();

  if (cuerpo.tipo === "unirse") {
    const color = !fila.clave_w ? "w" : !fila.clave_b ? "b" : null;
    if (!color) return json({ error: "Esa partida ya tiene a sus dos jugadores." }, 409);
    const clave = claveNueva();
    // Solo ocupa el lugar si sigue libre (por si entran dos a la vez).
    const r = await env.DB.prepare(
      `UPDATE partidas SET clave_${color} = ?, estado = 'jugando', actualizada = ? WHERE codigo = ? AND clave_${color} IS NULL`
    )
      .bind(clave, ahora, codigo)
      .run();
    if (r.meta.changes !== 1) return json({ error: "Alguien entró justo antes. Prueba otra vez." }, 409);
    return json({ codigo, color, clave, ...publica({ ...fila, [`clave_${color}`]: clave, estado: "jugando" }) });
  }

  const color = cuerpo.clave && cuerpo.clave === fila.clave_w ? "w" : cuerpo.clave && cuerpo.clave === fila.clave_b ? "b" : null;
  if (!color) return json({ error: "Esa clave no es de esta partida." }, 403);

  if (cuerpo.tipo === "rendirse") {
    await env.DB.prepare("UPDATE partidas SET estado = ?, actualizada = ? WHERE codigo = ?").bind(`rinde-${color}`, ahora, codigo).run();
    return json(publica({ ...fila, estado: `rinde-${color}` }));
  }

  if (cuerpo.tipo === "pedir-deshacer") {
    if (fila.estado !== "jugando") return json({ error: "La partida no está en juego.", ...publica(fila) }, 409);
    const total = fila.jugadas ? fila.jugadas.split(" ").length : 0;
    const mias = color === "w" ? Math.ceil(total / 2) : Math.floor(total / 2);
    if (!mias) return json({ error: "Todavía no has jugado.", ...publica(fila) }, 409);
    await env.DB.prepare("UPDATE partidas SET deshacer = ?, actualizada = ? WHERE codigo = ?").bind(color, ahora, codigo).run();
    return json(publica({ ...fila, deshacer: color }));
  }

  if (cuerpo.tipo === "responder-deshacer") {
    const pide = fila.deshacer;
    if (!pide || pide === color) return json({ error: "No hay ningún pedido que contestar.", ...publica(fila) }, 409);
    const jugadas = fila.jugadas ? fila.jugadas.split(" ") : [];
    let nuevas = fila.jugadas;
    if (cuerpo.acepta) {
      // Vuelve a antes de la última jugada del que pidió: si el rival ya
      // le contestó, se quitan dos.
      const turno = jugadas.length % 2 === 0 ? "w" : "b";
      nuevas = jugadas.slice(0, jugadas.length - (turno === pide ? 2 : 1)).join(" ");
    }
    const r = await env.DB.prepare("UPDATE partidas SET jugadas = ?, deshacer = NULL, actualizada = ? WHERE codigo = ? AND jugadas = ? AND deshacer = ?")
      .bind(nuevas, ahora, codigo, fila.jugadas, pide)
      .run();
    if (r.meta.changes !== 1) return json({ error: "La partida cambió justo ahora.", ...publica(await leer(env, codigo)) }, 409);
    return json(publica({ ...fila, jugadas: nuevas, deshacer: null }));
  }

  if (cuerpo.tipo === "jugada") {
    if (fila.estado !== "jugando") return json({ error: "La partida no está en juego.", ...publica(fila) }, 409);
    const jugadas = fila.jugadas ? fila.jugadas.split(" ") : [];
    const turno = jugadas.length % 2 === 0 ? "w" : "b";
    if (color !== turno) return json({ error: "No es tu turno.", ...publica(fila) }, 409);
    if (cuerpo.n !== jugadas.length) return json({ error: "Tu tablero estaba atrasado.", ...publica(fila) }, 409);
    if (!JUGADA_VALIDA.test(cuerpo.jugada || "")) return json({ error: "Jugada inválida." }, 400);
    const nuevas = [...jugadas, cuerpo.jugada].join(" ");
    // La condición sobre "jugadas" evita que dos pedidos pisen la misma jugada.
    // Jugar cancela cualquier pedido de deshacer pendiente.
    const r = await env.DB.prepare("UPDATE partidas SET jugadas = ?, deshacer = NULL, actualizada = ? WHERE codigo = ? AND jugadas = ?")
      .bind(nuevas, ahora, codigo, fila.jugadas)
      .run();
    if (r.meta.changes !== 1) return json({ error: "Tu tablero estaba atrasado.", ...publica(await leer(env, codigo)) }, 409);
    return json(publica({ ...fila, jugadas: nuevas, deshacer: null }));
  }

  return json({ error: "No entiendo ese pedido." }, 400);
}
