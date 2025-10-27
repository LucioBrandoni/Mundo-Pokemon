// Funciones que crean o modifican elementos en el DOM


import { starters } from "./data.js";

// 🔹 Mostrar botones de selección de Pokémon inicial
export function mostrarOpcionesPokemon(contenedor, callback) {
  contenedor.innerHTML = ""; // Limpiamos el contenedor antes de mostrar

  starters.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.setAttribute("data-pokemon", pokemon.nombre);

    const img = document.createElement("img");
    img.src = pokemon.imagen;
    img.alt = pokemon.nombre;
    img.width = 100;

    const name = document.createElement("p");
    name.textContent = pokemon.nombre;

    const btn = document.createElement("button");
    btn.textContent = "Elegir";
    btn.classList.add("btn", "starter-btn");
    btn.addEventListener("click", () => callback(index));

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(btn);
    contenedor.appendChild(card);
  });
}


// 🔹 Mostrar el resultado con la tarjeta del Pokémon elegido
export function mostrarResultado(contenedorStats, contenedorMsg, nick, starter) {
  contenedorStats.innerHTML = `
    <div class="tarjeta" data-pokemon="${starter.nombre}">
      <h2>${starter.nombre}</h2>
      <img src="${starter.imagen}" alt="${starter.nombre}" width="150" class="pokemon-img">
      <p><strong>Tipo:</strong> ${starter.tipo}</p>
      <p><strong>Vida:</strong> ${starter.vida}</p>
      <p><strong>Ataque:</strong> ${starter.ataque}</p>
      <hr>
      <p class="mensaje-final">¡¡Bienvenido, <span class="nick">${nick}</span>!!<br>Tu compañero será <strong>${starter.nombre}</strong>.</p>
    </div>
  `;

  // Pequeño efecto visual opcional al mostrar el resultado
  contenedorStats.querySelector(".tarjeta").classList.add("fade-in");
}




