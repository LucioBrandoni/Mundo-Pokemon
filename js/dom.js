import { starters } from "./data.js";
import { obtenerLogros, LOGROS_DEFINICION } from "./achievements.js";

// Retraso entre la entrada de cada carta (en segundos)
const CARD_STAGGER_DELAY_S = 0.15;

// Mostrar botones de selección de Pokémon inicial
export function mostrarOpcionesPokemon(contenedor, callback) {
  contenedor.innerHTML = ""; 

  starters.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card", "pokemon-card-enter");
    card.setAttribute("data-pokemon", pokemon.nombre);
    card.setAttribute("role", "listitem");
    // Entrada escalonada: cada carta aparece CARD_STAGGER_DELAY_S después de la anterior
    card.style.animationDelay = `${index * CARD_STAGGER_DELAY_S}s`;

    const img = document.createElement("img");
    img.src = pokemon.imagen;
    img.alt = `${pokemon.nombre} — Tipo: ${pokemon.tipo}, Vida: ${pokemon.vida}, Ataque: ${pokemon.ataque}`;
    img.width = 100;

    const name = document.createElement("p");
    name.textContent = pokemon.nombre;

    const btn = document.createElement("button");
    btn.textContent = "Elegir";
    btn.classList.add("btn", "starter-btn");
    btn.setAttribute("aria-label", `Elegir a ${pokemon.nombre} como tu Pokémon inicial`);
    btn.addEventListener("click", () => {
      // Flash retro en la imagen al seleccionar
      img.classList.add("selection-flash");
      img.addEventListener("animationend", () => img.classList.remove("selection-flash"), { once: true });
      callback(index);
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(btn);
    contenedor.appendChild(card);
  });
}


// Mostrar el resultado con la tarjeta del Pokémon elegido y el historial de batallas

export function mostrarResultado(contenedorStats, contenedorMsg, nick, starter, victorias = 0, derrotas = 0, historial = [], xpPorNivel = 100) {
  const totalBatallas = victorias + derrotas;

  // Construir el historial de las últimas 5 batallas
  let historialHTML = "";
  if (historial.length > 0) {
    const filas = historial.slice(0, 5).map(b => {
      const icono = b.resultado === "victoria" ? "🏆" : "💀";
      const colorClase = b.resultado === "victoria" ? "historial-victoria" : "historial-derrota";
      const efectividadBadge = b.efectividadJugador > 1
        ? `<span class="badge-efectivo">⚡×${b.efectividadJugador}</span>`
        : "";
      return `
        <div class="historial-item ${colorClase}" role="listitem">
          <span>${icono} <strong>vs ${b.enemigo}</strong></span>
          <span class="historial-detalle">${b.enemigoTipo || ''} · Niv.${b.enemigoNivel || '?'} ${efectividadBadge}</span>
          <span class="historial-fecha">${b.fecha}</span>
        </div>`;
    }).join("");
    historialHTML = `
      <div class="historial" aria-label="Últimas batallas">
        <p class="historial-titulo">⚔️ Últimas batallas</p>
        <div role="list">${filas}</div>
      </div>`;
  }

  const nivel = starter.nivel || 5;
  const experiencia = starter.experiencia || 0;
  const xpParaSiguienteNivel = xpPorNivel;
  const xpPorcentaje = Math.min(100, Math.floor((experiencia / xpParaSiguienteNivel) * 100));

  // Logros desbloqueados
  const logrosDesbloqueados = obtenerLogros();
  let logrosHTML = '';
  if (logrosDesbloqueados.length > 0) {
    const badges = logrosDesbloqueados.map(id => {
      const def = LOGROS_DEFINICION.find(l => l.id === id);
      if (!def) return '';
      return `<div class="logro-badge" title="${def.descripcion}" aria-label="${def.nombre}: ${def.descripcion}">${def.emoji} <span>${def.nombre}</span></div>`;
    }).join('');
    logrosHTML = `
      <div class="logros-container" aria-label="Logros desbloqueados">
        <p class="logros-titulo">🏅 Logros</p>
        <div class="logros-grid" role="list">${badges}</div>
      </div>`;
  }

  contenedorStats.innerHTML = `
    <div class="tarjeta" data-pokemon="${starter.nombre}">
      <h2>${starter.nombre}</h2>
      <img src="${starter.imagen}" alt="${starter.nombre}" width="150" class="pokemon-img">
      <p><strong>Tipo:</strong> ${starter.tipo}</p>
      <p><strong>Vida:</strong> ${starter.vida}</p>
      <p><strong>Ataque:</strong> ${starter.ataque}</p>
      <div class="nivel-xp">
        <p class="nivel-texto">⭐ Nivel: <strong>${nivel}</strong></p>
        <div class="xp-bar-container" title="XP: ${experiencia} / ${xpParaSiguienteNivel}">
          <div class="xp-bar" style="width:${xpPorcentaje}%"></div>
        </div>
        <p class="xp-texto">XP: ${experiencia} / ${xpParaSiguienteNivel}</p>
      </div>
      <hr>
      <p class="mensaje-final">¡¡Bienvenido, <span class="nick">${nick}</span>!!<br>Tu compañero será <strong>${starter.nombre}</strong>.</p>
      <div class="battle-stats">
        <p>⚔️ Batallas: <strong>${totalBatallas}</strong> &nbsp;|&nbsp; 🏆 Victorias: <strong>${victorias}</strong> &nbsp;|&nbsp; 💀 Derrotas: <strong>${derrotas}</strong></p>
      </div>
      ${historialHTML}
      ${logrosHTML}
    </div>
  `;

  // Pequeño efecto visual opcional al mostrar el resultado
  contenedorStats.querySelector(".tarjeta").classList.add("fade-in");
}




