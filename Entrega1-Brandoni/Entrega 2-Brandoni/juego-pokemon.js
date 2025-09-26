// Datos de los Pokémon con imagen
const starters = [
    { nombre: "Bulbasaur", tipo: "Planta/Veneno", vida: 45, ataque: 49, imagen: "assets/bulbasaur.png" },
    { nombre: "Charmander", tipo: "Fuego", vida: 39, ataque: 52, imagen: "assets/charmander.png" },
    { nombre: "Squirtle", tipo: "Agua", vida: 44, ataque: 48, imagen: "assets/squirtle.png" }
];

// Contenedores DOM
const formNickContainer = document.getElementById("formNickContainer");
const formNick = document.getElementById("formNick");
const nickInput = document.getElementById("nickInput");

const pokemonContainer = document.getElementById("pokemonContainer");
const starterButtons = document.getElementById("starterButtons");

const resultadoContainer = document.getElementById("resultadoContainer");
const pokemonStats = document.getElementById("pokemonStats");
const mensajeFinal = document.getElementById("mensajeFinal");

// LocalStorage
let nick = localStorage.getItem("nick") || "";
let starter = JSON.parse(localStorage.getItem("starter")) || null;

// Si ya hay datos en localStorage, mostramos directamente
if (nick && starter) {
    formNickContainer.style.display = "none";
    mostrarResultado(nick, starter);
} else {
    formNickContainer.style.display = "block";
}

// Evento para ingresar nick con confirmación
formNick.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoNick = nickInput.value.trim();
    if(nuevoNick){
        if(confirm(`¿Estás seguro de que quieres llamarte ${nuevoNick}?`)){
            nick = nuevoNick;
            localStorage.setItem("nick", nick);
            formNickContainer.style.display = "none";
            mostrarOpcionesPokemon();
        } else {
            nickInput.value = "";
        }
    }
});

// Mostrar botones para elegir Pokémon
function mostrarOpcionesPokemon() {
    pokemonContainer.style.display = "block";
    starterButtons.innerHTML = ""; // Limpiar botones si se recarga
    starters.forEach((pokemon, index) => {
        const btn = document.createElement("button");
        btn.textContent = pokemon.nombre;
        btn.addEventListener("click", () => seleccionarPokemon(index));
        starterButtons.appendChild(btn);
    });
}

// Función al elegir Pokémon con confirmación
function seleccionarPokemon(index) {
    const elegido = starters[index];
    if(confirm(`¿Estás seguro de que quieres elegir a ${elegido.nombre}?`)){
        starter = elegido;
        localStorage.setItem("starter", JSON.stringify(starter));
        pokemonContainer.style.display = "none";
        mostrarResultado(nick, starter);
    }
}

// Mostrar stats, imagen y mensaje final
function mostrarResultado(nick, starter){
    resultadoContainer.style.display = "block";
    pokemonStats.innerHTML = `
        <p><strong>${starter.nombre}</strong></p>
        <img src="${starter.imagen}" alt="${starter.nombre}" width="150">
        <p>Tipo: ${starter.tipo}</p>
        <p>Vida: ${starter.vida}</p>
        <p>Ataque: ${starter.ataque}</p>
    `;
    mensajeFinal.textContent = `${nick}, tu compañero será ${starter.nombre}!!!`;
}
localStorage.clear();