// Genera js/mapa-mundo.js: el mapa del juego "Explora el mundo".
// Uso: node herramientas/generar-mapa.js ruta/ne_110m_admin_0_countries.geojson
//
// Los datos son de Natural Earth (https://www.naturalearthdata.com), de
// dominio público. El archivo se baja de:
// https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
//
// Proyección de Miller (como los mapas escolares, sin la Antártida), con
// coordenadas redondeadas para que el archivo pese poco.

const fs = require("fs");
const path = require("path");

const ANCHO = 1000;
const LAT_MAX = 84;
const LAT_MIN = -57;
const rad = (g) => (g * Math.PI) / 180;
const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * rad(lat)));
const Y_MAX = miller(LAT_MAX);
const Y_MIN = miller(LAT_MIN);
const ALTO = Math.round((ANCHO * (Y_MAX - Y_MIN)) / (2 * Math.PI));

const proyectar = ([lon, lat]) => {
  const x = ((lon + 180) / 360) * ANCHO;
  const y = ((Y_MAX - miller(Math.max(LAT_MIN, Math.min(LAT_MAX, lat)))) / (Y_MAX - Y_MIN)) * ALTO;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};

// Continentes como se enseñan en la escuela en Latinoamérica: América es uno
// solo (con sus regiones Norte, Central y del Sur).
const CONTINENTE = {
  Africa: "africa",
  Asia: "asia",
  Europe: "europa",
  "North America": "america",
  "South America": "america",
  Oceania: "oceania",
};
const REGION_AMERICA = { "Northern America": "norte", "Central America": "central", Caribbean: "central", "South America": "sur" };

const entrada = process.argv[2];
if (!entrada) {
  console.error("Falta la ruta del GeoJSON de Natural Earth (ver el encabezado).");
  process.exit(1);
}
const datos = JSON.parse(fs.readFileSync(entrada, "utf8"));

const paises = [];
for (const f of datos.features) {
  const p = f.properties;
  const continente = CONTINENTE[p.CONTINENT];
  if (!continente) continue; // Antártida y océanos
  let iso = (p.ISO_A2_EH && p.ISO_A2_EH !== "-99" ? p.ISO_A2_EH : p.ISO_A2) || "";
  iso = iso === "-99" ? "" : iso.toLowerCase();
  const poligonos = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = "";
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let mayor = { area: -1, cx: 0, cy: 0 };
  for (const poligono of poligonos) {
    const anillo = poligono[0].map(proyectar);
    // Área y centro del pedazo más grande (para poner etiquetas y hacer zoom).
    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < anillo.length - 1; i++) {
      const [x1, y1] = anillo[i];
      const [x2, y2] = anillo[i + 1];
      const cruz = x1 * y2 - x2 * y1;
      area += cruz;
      cx += (x1 + x2) * cruz;
      cy += (y1 + y2) * cruz;
    }
    area /= 2;
    if (Math.abs(area) > mayor.area && area !== 0) mayor = { area: Math.abs(area), cx: cx / (6 * area), cy: cy / (6 * area) };
    for (const anilloCompleto of poligono) {
      const puntos = anilloCompleto.map(proyectar);
      d += "M" + puntos.map(([x, y]) => `${x} ${y}`).join("L") + "Z";
      for (const [x, y] of puntos) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  paises.push({
    iso,
    nombre: p.NAME_ES || p.NAME,
    continente,
    // México se enseña como América del Norte (Natural Earth lo pone en Central).
    region: continente !== "america" ? "" : iso === "mx" ? "norte" : REGION_AMERICA[p.SUBREGION] || "sur",
    centro: [Math.round(mayor.cx), Math.round(mayor.cy)],
    caja: [Math.floor(minX), Math.floor(minY), Math.ceil(maxX), Math.ceil(maxY)],
    d,
  });
}
paises.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

const salida = `// Mapa del mundo de "Explora el mundo" — Aprende con Ana Isabella
// GENERADO por herramientas/generar-mapa.js con datos de Natural Earth
// (dominio público). No editar a mano. Proyección de Miller, ${ANCHO}×${ALTO}.
// iso: código de 2 letras (para la bandera de flagcdn) · centro y caja: para
// etiquetas y zoom · d: el dibujo del país.

const MAPA = {
  ancho: ${ANCHO},
  alto: ${ALTO},
  paises: [
${paises.map((x) => "    " + JSON.stringify(x) + ",").join("\n")}
  ],
};

if (typeof module !== "undefined") module.exports = { MAPA };
`;
fs.writeFileSync(path.join(__dirname, "../js/mapa-mundo.js"), salida);
console.log(`Listo: ${paises.length} países, ${ANCHO}×${ALTO}, ${Math.round(salida.length / 1024)} KB`);
const sinIso = paises.filter((x) => !x.iso).map((x) => x.nombre);
console.log("Sin código (no salen en preguntas):", sinIso.join(", "));
