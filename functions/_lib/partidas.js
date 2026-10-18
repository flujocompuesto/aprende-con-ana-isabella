// Utilidades de las partidas en línea (Pages Functions + D1, binding DB).
// El servidor solo hace de "cartero": guarda las jugadas en orden y revisa
// que cada una venga de quien tiene el turno. Las reglas las revisa el
// tablero de cada aparato (js/ajedrez-motor.js).

export const json = (datos, estado = 200) =>
  new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const claveNueva = () => {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

// Lo que ve cualquiera que tenga el código (nunca las claves).
export function publica(fila) {
  const jugadas = fila.jugadas ? fila.jugadas.split(" ") : [];
  return {
    codigo: fila.codigo,
    jugadas,
    estado: fila.estado,
    // Quién falta por entrar, para la pantalla de espera.
    libre: !fila.clave_w ? "w" : !fila.clave_b ? "b" : null,
  };
}

export const JUGADA_VALIDA = /^[a-h][1-8][a-h][1-8][qrbn]?$/;
