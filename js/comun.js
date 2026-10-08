// Utilidades compartidas por todos los juegos — Aprende con Ana Isabella
// Sonidos, confeti, animaciones de acierto/error y estrellas guardadas en el
// navegador. Se carga antes del script de cada juego.

const Aprende = (() => {
  const CLAVE_PROGRESO = "aprende:progreso";
  const CLAVE_SILENCIO = "aprende:silencio";

  // ---- Guardado en el navegador (si no se puede, el juego sigue igual) ----

  function leer(clave, porDefecto) {
    try {
      const valor = localStorage.getItem(clave);
      return valor === null ? porDefecto : JSON.parse(valor);
    } catch {
      return porDefecto;
    }
  }

  function escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Navegador privado o sin almacenamiento: simplemente no se guarda.
    }
  }

  // ---- Sonidos sintetizados (Web Audio, sin archivos) ----

  let contexto = null;
  let silencio = leer(CLAVE_SILENCIO, false) === true;

  function audio() {
    if (!contexto) {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) return null;
      contexto = new Contexto();
    }
    if (contexto.state === "suspended") contexto.resume();
    return contexto;
  }

  function nota(frecuencia, inicio, duracion, tipo = "sine", volumen = 0.15) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + inicio;
    const oscilador = c.createOscillator();
    const ganancia = c.createGain();
    oscilador.type = tipo;
    oscilador.frequency.value = frecuencia;
    ganancia.gain.setValueAtTime(0.0001, t);
    ganancia.gain.exponentialRampToValueAtTime(volumen, t + 0.02);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
    oscilador.connect(ganancia);
    ganancia.connect(c.destination);
    oscilador.start(t);
    oscilador.stop(t + duracion + 0.05);
  }

  const sonido = {
    acierto() {
      if (silencio) return;
      nota(660, 0, 0.15);
      nota(880, 0.1, 0.25);
    },
    error() {
      if (silencio) return;
      nota(240, 0, 0.22, "triangle", 0.12);
      nota(190, 0.12, 0.3, "triangle", 0.1);
    },
    clic() {
      if (silencio) return;
      nota(560, 0, 0.06, "square", 0.03);
    },
    paso() {
      if (silencio) return;
      nota(440, 0, 0.08, "triangle", 0.06);
    },
    victoria() {
      if (silencio) return;
      [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.12, 0.32));
    },
  };

  // Botón 🔊/🔇 en la esquina del encabezado.
  function ponerBotonSonido() {
    const encabezado = document.querySelector("header.hero");
    if (!encabezado) return;
    const boton = document.createElement("button");
    boton.className = "boton-sonido";
    const pintar = () => {
      boton.textContent = silencio ? "🔇" : "🔊";
      boton.setAttribute("aria-label", silencio ? "Activar sonido" : "Quitar sonido");
    };
    pintar();
    boton.addEventListener("click", () => {
      silencio = !silencio;
      escribir(CLAVE_SILENCIO, silencio);
      // Si se silencia, también se calla la voz que esté hablando.
      if (silencio && window.speechSynthesis) window.speechSynthesis.cancel();
      pintar();
      sonido.clic();
    });
    encabezado.appendChild(boton);
  }

  // ---- Efectos visuales ----

  const reducirMovimiento = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function confeti(cantidad = 70) {
    if (reducirMovimiento()) return;
    const colores = ["#6c5ce7", "#00b894", "#fdcb6e", "#e84393", "#0984e3", "#e17055"];
    const capa = document.createElement("div");
    capa.className = "confeti";
    for (let i = 0; i < cantidad; i++) {
      const pieza = document.createElement("span");
      pieza.style.left = `${Math.random() * 100}%`;
      pieza.style.background = colores[i % colores.length];
      pieza.style.setProperty("--x", `${Math.random() * 240 - 120}px`);
      pieza.style.setProperty("--giro", `${Math.random() * 720 - 360}deg`);
      pieza.style.animationDelay = `${Math.random() * 0.3}s`;
      pieza.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
      capa.appendChild(pieza);
    }
    document.body.appendChild(capa);
    setTimeout(() => capa.remove(), 3500);
  }

  // Reinicia una animación CSS aunque ya se haya usado en ese elemento.
  function animar(elemento, clase) {
    if (!elemento) return;
    elemento.classList.remove(clase);
    void elemento.offsetWidth;
    elemento.classList.add(clase);
    elemento.addEventListener("animationend", () => elemento.classList.remove(clase), { once: true });
  }

  const efecto = {
    rebote: (elemento) => animar(elemento, "rebote"),
    sacudir: (elemento) => animar(elemento, "sacudir"),
  };

  // ---- Progreso: mejores estrellas por juego y nivel ----

  function progreso() {
    const datos = leer(CLAVE_PROGRESO, {});
    return datos && typeof datos === "object" ? datos : {};
  }

  // Guarda solo si mejora el récord. Devuelve si fue récord nuevo.
  function guardarEstrellas(juego, nivel, estrellas) {
    const datos = progreso();
    const antes = (datos[juego] && datos[juego][nivel]) || 0;
    if (estrellas > antes) {
      datos[juego] = { ...(datos[juego] || {}), [nivel]: estrellas };
      escribir(CLAVE_PROGRESO, datos);
    }
    return estrellas > antes;
  }

  function estrellasDeJuego(juego) {
    const niveles = progreso()[juego] || {};
    return Object.values(niveles).reduce((suma, n) => suma + (Number(n) || 0), 0);
  }

  function totalEstrellas() {
    return Object.keys(progreso()).reduce((suma, juego) => suma + estrellasDeJuego(juego), 0);
  }

  // Estrellas según el porcentaje de aciertos (igual en todos los juegos).
  function estrellasPorAciertos(aciertos, total) {
    const porcentaje = aciertos / total;
    if (porcentaje >= 0.9) return 3;
    if (porcentaje >= 0.6) return 2;
    if (porcentaje >= 0.3) return 1;
    return 0;
  }

  function textoEstrellas(n) {
    return "⭐".repeat(n) + "☆".repeat(3 - n);
  }

  // Cierre común de una partida: guarda, celebra y avisa si hubo récord.
  function finDePartida(juego, nivel, estrellas) {
    const record = guardarEstrellas(juego, nivel, estrellas);
    if (estrellas >= 2) {
      sonido.victoria();
      confeti();
    } else {
      sonido.acierto();
    }
    const aviso = document.getElementById("fin-record");
    if (aviso) {
      aviso.hidden = !record;
      aviso.textContent = "🏅 ¡Nuevo récord en este nivel!";
    }
    return record;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ponerBotonSonido);
  } else {
    ponerBotonSonido();
  }

  return {
    silenciado: () => silencio,
    sonido,
    efecto,
    confeti,
    progreso,
    guardarEstrellas,
    estrellasDeJuego,
    totalEstrellas,
    estrellasPorAciertos,
    textoEstrellas,
    finDePartida,
  };
})();
