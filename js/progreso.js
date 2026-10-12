// Mi progreso — Aprende con Ana Isabella
// Pasa el progreso de un aparato a otro sin cuentas ni servidor: todo lo que
// el sitio guarda en el navegador (claves "aprende:…") se vuelve un código
// de texto (ANA1- + JSON en base64) o un archivo. Al cargar, se COMBINA con
// lo que ya hay: mejores estrellas, la racha más nueva, la caja más alta de
// cada multiplicación. Nada se borra.

const PREFIJO = "ANA1-";
const NO_LLEVAR = ["aprende:silencio"]; // preferencia de cada aparato

const mensajeEl = document.getElementById("mensaje-progreso");
const salidaEl = document.getElementById("codigo-salida");

function mensaje(texto, tipo = "") {
  mensajeEl.innerHTML = texto;
  mensajeEl.className = "mensaje-juego " + tipo;
}

function leerTodo() {
  const datos = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (!clave.startsWith("aprende:") || NO_LLEVAR.includes(clave)) continue;
      try {
        datos[clave] = JSON.parse(localStorage.getItem(clave));
      } catch {
        // Un valor roto no se lleva.
      }
    }
  } catch {
    // Sin almacenamiento: no hay nada que llevar.
  }
  return datos;
}

// Texto ↔ base64 respetando tildes y emojis (UTF-8).
const aBase64 = (texto) => {
  let binario = "";
  for (const byte of new TextEncoder().encode(texto)) binario += String.fromCharCode(byte);
  return btoa(binario);
};
const deBase64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));

function codigo() {
  return PREFIJO + aBase64(JSON.stringify({ v: 1, fecha: new Date().toISOString().slice(0, 10), datos: leerTodo() }));
}

function leerCodigo(texto) {
  const limpio = texto.trim().replace(/\s+/g, "");
  if (!limpio.startsWith(PREFIJO)) throw new Error("no empieza con ANA1-");
  const paquete = JSON.parse(deBase64(limpio.slice(PREFIJO.length)));
  if (!paquete || typeof paquete.datos !== "object") throw new Error("sin datos");
  return paquete.datos;
}

// ---- Combinar ----

const maximo = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);

function combinar(clave, aqui, llega) {
  if (aqui === undefined || aqui === null) return llega;
  if (llega === undefined || llega === null) return aqui;
  if (clave === "aprende:progreso") {
    // Estrellas: la mejor de cada nivel de cada juego.
    const res = { ...aqui };
    for (const [juego, niveles] of Object.entries(llega)) {
      res[juego] = { ...(res[juego] || {}) };
      for (const [nivel, estrellas] of Object.entries(niveles || {})) res[juego][nivel] = maximo(res[juego][nivel], estrellas);
    }
    return res;
  }
  if (clave === "aprende:ajedrez-diario") {
    // La racha del día más reciente; récords, el mayor.
    const nuevo = (llega.dia || "") > (aqui.dia || "") ? llega : aqui;
    return {
      ...aqui,
      ...llega,
      dia: nuevo.dia,
      racha: nuevo.racha,
      mejor: maximo(aqui.mejor, llega.mejor),
      resueltos: maximo(aqui.resueltos, llega.resueltos),
      coordenadas: maximo(aqui.coordenadas, llega.coordenadas),
    };
  }
  if (clave === "aprende:tablas") {
    // Cada multiplicación: lo más avanzado.
    const res = { ...aqui };
    for (const [m, d] of Object.entries(llega)) {
      const a = res[m] || {};
      res[m] = { caja: maximo(a.caja, d.caja), vistas: maximo(a.vistas, d.vistas), fallos: maximo(a.fallos, d.fallos) };
    }
    return res;
  }
  if (typeof aqui === "object" && typeof llega === "object" && !Array.isArray(aqui)) {
    // Otros (como el plan de video): lo que falta aquí se completa con lo que llega.
    const res = { ...llega, ...aqui };
    for (const [k, v] of Object.entries(aqui)) if (v === "" && llega[k]) res[k] = llega[k];
    return res;
  }
  return aqui;
}

function cargar(datos) {
  const antes = Aprende.totalEstrellas();
  let claves = 0;
  try {
    for (const [clave, valor] of Object.entries(datos)) {
      if (!clave.startsWith("aprende:") || NO_LLEVAR.includes(clave)) continue;
      let actual;
      try {
        actual = JSON.parse(localStorage.getItem(clave));
      } catch {
        actual = null;
      }
      localStorage.setItem(clave, JSON.stringify(combinar(clave, actual, valor)));
      claves++;
    }
  } catch {
    mensaje("Este navegador no deja guardar (¿ventana privada?). Prueba en una ventana normal.", "error");
    return;
  }
  const despues = Aprende.totalEstrellas();
  const ganadas = despues - antes;
  mensaje(
    claves
      ? `¡Listo! Progreso cargado. Ahora tienes <strong>${despues} ⭐</strong>${ganadas > 0 ? ` (${ganadas} más que antes)` : ""}.`
      : "El código no tenía progreso para cargar.",
    claves ? "exito" : "error"
  );
  if (ganadas > 0) Aprende.confeti(50);
  pintar();
}

// ---- Pantalla ----

function pintar() {
  const total = Aprende.totalEstrellas();
  document.getElementById("resumen-progreso").textContent = `En este aparato tienes ${total} ${total === 1 ? "estrella" : "estrellas"} ⭐`;
  salidaEl.value = codigo();
}

document.getElementById("btn-copiar").addEventListener("click", async () => {
  salidaEl.value = codigo();
  try {
    await navigator.clipboard.writeText(salidaEl.value);
    mensaje("📋 ¡Código copiado! Pégalo en un mensaje para ti y ábrelo en el otro aparato.", "exito");
  } catch {
    salidaEl.select();
    mensaje("Selecciona el código de arriba y cópialo (mantén apretado → Copiar).");
  }
});

document.getElementById("btn-descargar").addEventListener("click", () => {
  const archivo = new Blob([codigo()], { type: "text/plain" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `progreso-aprende-${new Date().toISOString().slice(0, 10)}.txt`;
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  mensaje("💾 Archivo descargado. Ábrelo desde el otro aparato con «Elegir archivo».", "exito");
});

document.getElementById("btn-cargar").addEventListener("click", () => {
  const texto = document.getElementById("codigo-entrada").value;
  if (!texto.trim()) return mensaje("Primero pega el código.", "error");
  try {
    cargar(leerCodigo(texto));
  } catch {
    mensaje("Ese código no se pudo leer. Revisa que esté completo (empieza con ANA1-).", "error");
  }
});

document.getElementById("archivo").addEventListener("change", async (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  try {
    cargar(leerCodigo(await archivo.text()));
  } catch {
    mensaje("Ese archivo no tiene un progreso válido.", "error");
  }
  e.target.value = "";
});

pintar();

if (typeof module !== "undefined") module.exports = { combinar };
