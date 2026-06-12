import { starters, ITEM_DEFINITIONS, RIVAL_INTERVALO } from "./data.js";
import { obtenerLogros, LOGROS_DEFINICION, mostrarPantallaLogros } from "./achievements.js";
import { obtenerRecord } from "./storage.js";

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

export function mostrarResultado(contenedorStats, contenedorMsg, nick, starter, victorias = 0, derrotas = 0, historial = [], xpPorNivel = 100, inventario = {}, rival = null, record = null) {
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
      const batallaEspecial = b.tipoBatalla === "rival"
        ? `<span class="historial-badge historial-badge-rival">Rival</span>`
        : b.tipoBatalla === "legendario"
          ? `<span class="historial-badge historial-badge-legendario">Legendario</span>`
          : "";
      const nombreEnemigo = b.entrenador
        ? `${b.entrenador} · ${b.enemigo}`
        : `vs ${b.enemigo}`;
      return `
        <div class="historial-item ${colorClase}" role="listitem">
          <span>${icono} <strong>${nombreEnemigo}</strong> ${batallaEspecial}</span>
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
  const recordActual = record || obtenerRecord();
  let logrosHTML = '';
  const totalLogros = LOGROS_DEFINICION.length;
  const logrosCount = logrosDesbloqueados.length;

  if (logrosDesbloqueados.length > 0) {
    const badges = logrosDesbloqueados.map(id => {
      const def = LOGROS_DEFINICION.find(l => l.id === id);
      if (!def) return '';
      return `<div class="logro-badge" title="${def.descripcion}" aria-label="${def.nombre}: ${def.descripcion}">${def.emoji} <span>${def.nombre}</span></div>`;
    }).join('');
    logrosHTML = `
      <div class="logros-container" aria-label="Logros desbloqueados">
        <p class="logros-titulo">🏅 Logros (${logrosCount}/${totalLogros})</p>
        <div class="logros-grid" role="list">${badges}</div>
        <button id="btnVerLogros" class="btn-ver-logros" aria-label="Ver todos los logros">Ver todos los logros 📋</button>
      </div>`;
  } else {
    logrosHTML = `
      <div class="logros-container" aria-label="Logros">
        <p class="logros-titulo">🏅 Logros (0/${totalLogros})</p>
        <p style="font-size:0.4rem;color:#aaa;margin:4px 0">¡Ganá batallas para desbloquear logros!</p>
        <button id="btnVerLogros" class="btn-ver-logros" aria-label="Ver todos los logros">Ver todos los logros 📋</button>
      </div>`;
  }

  let recordHTML = '';
  if (recordActual && (recordActual.mayorRacha > 0 || recordActual.mayorNivel > 0)) {
    recordHTML = `
      <div class="record-container" aria-label="Récord histórico">
        <p class="record-titulo">🏆 Récord histórico</p>
        <div class="record-grid">
          <div class="record-item" aria-label="Mayor racha: ${recordActual.mayorRacha}">
            <span class="record-emoji">🔥</span>
            <span class="record-label">Mayor racha</span>
            <strong class="record-valor">${recordActual.mayorRacha}</strong>
            ${recordActual.fechaMayorRacha ? `<span class="record-fecha">${recordActual.fechaMayorRacha}</span>` : ''}
          </div>
          <div class="record-item" aria-label="Mayor nivel: ${recordActual.mayorNivel}">
            <span class="record-emoji">⭐</span>
            <span class="record-label">Mayor nivel</span>
            <strong class="record-valor">${recordActual.mayorNivel}</strong>
            ${recordActual.fechaMayorNivel ? `<span class="record-fecha">${recordActual.fechaMayorNivel}</span>` : ''}
          </div>
        </div>
      </div>`;
  }

  const inventarioHTML = Object.entries(ITEM_DEFINITIONS).map(([clave, item]) => `
    <div class="item-badge" aria-label="${item.nombre}: ${inventario[clave] || 0}">
      <span>${item.emoji}</span>
      <span>${item.nombre}</span>
      <strong>x${inventario[clave] || 0}</strong>
    </div>
  `).join('');

  const hitoActualRival = Math.floor(victorias / RIVAL_INTERVALO);
  const rivalPendiente = victorias >= RIVAL_INTERVALO && hitoActualRival > (rival?.ultimoHitoSuperado || 0);
  const restoVictorias = victorias % RIVAL_INTERVALO;
  const victoriasParaRival = rivalPendiente ? 0 : (restoVictorias === 0 ? RIVAL_INTERVALO : RIVAL_INTERVALO - restoVictorias);
  const rivalEstado = rivalPendiente
    ? "⚠️ Tu rival ya te está esperando para el próximo desafío."
    : `⏳ Próximo rival en ${victoriasParaRival} ${victoriasParaRival === 1 ? "victoria" : "victorias"}.`;

  const progresoHTML = `
    <div class="inventario-container" aria-label="Inventario y progreso especial">
      <p class="inventario-titulo">🎒 Mochila</p>
      <div class="inventario-grid" role="list">${inventarioHTML}</div>
      <p class="rival-status">${rivalEstado}</p>
    </div>`;

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
      ${progresoHTML}
      ${historialHTML}
      ${recordHTML}
      ${logrosHTML}
    </div>
  `;

  // Pequeño efecto visual opcional al mostrar el resultado
  contenedorStats.querySelector(".tarjeta").classList.add("fade-in");

  // Adjuntar evento al botón de logros generado dentro del HTML
  const btnVerLogros = contenedorStats.querySelector("#btnVerLogros");
  if (btnVerLogros) {
    btnVerLogros.addEventListener("click", mostrarPantallaLogros);
  }
}

