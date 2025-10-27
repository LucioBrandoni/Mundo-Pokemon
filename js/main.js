import { guardarEnStorage, obtenerDeStorage } from "./storage.js";
import { mostrarOpcionesPokemon, mostrarResultado } from "./dom.js";
import { mostrarConfirmacion, mostrarAlerta } from "./ui.js";
import { obtenerPokemonEnemigo, iniciarBatalla } from "./battle.js";
import { starters } from "./data.js";

// Referencias al DOM
const formNickContainer = document.getElementById("formNickContainer");
const formNick = document.getElementById("formNick");
const nickInput = document.getElementById("nickInput");
const pokemonContainer = document.getElementById("pokemonContainer");
const starterButtons = document.getElementById("starterButtons");
const resultadoContainer = document.getElementById("resultadoContainer");
const pokemonStats = document.getElementById("pokemonStats");
const mensajeFinal = document.getElementById("mensajeFinal");

let nick = obtenerDeStorage("nick") || "";
let starter = obtenerDeStorage("starter") || null;

// 🔹 Flujo inicial
if (nick && starter) {
  // Si hay datos guardados, mostrar resultado y reconstruir botones
    mostrarResultado(pokemonStats, mensajeFinal, nick, starter);
    resultadoContainer.style.display = "block";
    agregarBotonesFinales();
} else {
  // Si no hay datos, mostrar el formulario inicial
    formNickContainer.style.display = "block";
    pokemonContainer.style.display = "none";
    resultadoContainer.style.display = "none";
}

// 🔹 Evento: Ingreso de Nickname
formNick.addEventListener("submit", (e) => {
    e.preventDefault();
    nick = nickInput.value.trim();

    if (nick) {
    mostrarConfirmacion(`¿Querés llamarte ${nick}?`, (confirmado) => {
        if (confirmado) {
        guardarEnStorage("nick", nick);
        formNickContainer.style.display = "none";
        mostrarOpcionesPokemon(starterButtons, (index) => seleccionarPokemon(index));
        pokemonContainer.style.display = "block";
        } else {
        mostrarAlerta("Podés ingresar otro nombre.", "info");
        formNick.reset();
        }
    }, "Nuevo Entrenador");
    } else {
    mostrarAlerta("Debes ingresar un nick para continuar.", "error");
    }
});

// 🔹 Selección de Pokémon inicial
function seleccionarPokemon(index) {
    const elegido = starters[index];
    mostrarConfirmacion(`¿Querés elegir a ${elegido.nombre}?`, (confirmado) => {
    if (confirmado) {
        starter = elegido;
        guardarEnStorage("starter", starter);
        pokemonContainer.style.display = "none";
        resultadoContainer.style.display = "block";
        mostrarResultado(pokemonStats, mensajeFinal, nick, starter);
        agregarBotonesFinales();
    }
    });
}

// 🔹 Botones finales (Volver al inicio / Comenzar desafío)
function agregarBotonesFinales() {
  // Evitar duplicados al recargar
    const existente = resultadoContainer.querySelector(".botonera-final");
    if (existente) existente.remove();

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("botonera-final");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "10px";
    btnContainer.style.marginTop = "20px";
    btnContainer.style.justifyContent = "center";

    const btnVolver = document.createElement("button");
    btnVolver.textContent = "Volver al inicio";
    btnVolver.className = "btn volver";
    btnVolver.addEventListener("click", () => {
    localStorage.clear();
    nick = "";
    starter = null;
    resultadoContainer.style.display = "none";
    pokemonContainer.style.display = "none";
    formNickContainer.style.display = "block";
    });

    const btnDesafio = document.createElement("button");
    btnDesafio.textContent = "Comenzar desafío";
    btnDesafio.className = "btn desafio";
    btnDesafio.addEventListener("click", iniciarDesafio);

    btnContainer.appendChild(btnVolver);
    btnContainer.appendChild(btnDesafio);
    resultadoContainer.appendChild(btnContainer);
    }

// 🔹 Lógica del desafío con PokeAPI
async function iniciarDesafio() {
    mostrarAlerta("Buscando un oponente...", "info");

    const enemigo = await obtenerPokemonEnemigo();
    if (!enemigo) return;

    Swal.fire({
    title: `¡Un ${enemigo.nombre} salvaje apareció!`,
    html: `
        <img src="${enemigo.imagen}" alt="${enemigo.nombre}" width="150">
        <p><strong>Vida:</strong> ${enemigo.vida}</p>
        <p><strong>Ataque:</strong> ${enemigo.ataque}</p>
    `,
    showCancelButton: true,
    confirmButtonText: "¡Luchar!",
    cancelButtonText: "Huir 🏃",
    }).then((result) => {
    if (result.isConfirmed) {
        iniciarBatalla(starter, enemigo);
    } else {
        mostrarAlerta("Escapaste del combate...", "info");
    }
    });
}




