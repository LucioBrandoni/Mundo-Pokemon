        //creación de pokemones con array y objeto

const starters = [
    { nombre: "Bulbasaur",
    tipo: "Planta/Veneno", 
    vida: 45, 
    ataque: 49 },

    { nombre: "Charmander",
    tipo: "Fuego",
    vida: 39, 
    ataque: 52 },

    { nombre: "Squirtle", 
    tipo: "Agua", 
    vida: 44, 
    ataque: 48 }
];


        // Ingreso de nickname del usuario

alert("Bienvenido al mundo Pokémon");

function iniciarJugador() {
    let nick = ""; 
    let confirmado = false;

    while (!confirmado) {
    nick = prompt("Ingresa tu Nick para esta nueva aventura");

    if (nick) {

        // Pregunto si quiere ese Nick y sino elige otro

    confirmado = confirm(`¿Estás seguro de que quieres llamarte ${nick}?`);
    } else {
    alert("Debes ingresar un nick para continuar");
    }
}

    return nick;
}


        // Función para mostrar los datos de un Pokémon

function mostrarPokemon(pokemon) {
    alert(
        `Has elegido a ${pokemon.nombre}!\n` +
        `Tipo: ${pokemon.tipo}\n` +
        `Vida: ${pokemon.vida}\n` +
        `Ataque: ${pokemon.ataque}`
    );
    }

        // Función para elegir un pokémon inicial

function elegirStarter() {
    let confirmado = false;
    let pokemonElegido;

    while (!confirmado) {
    let eleccion = prompt(
    "Elige tu Pokémon inicial:\n1. Bulbasaur\n2. Charmander\n3. Squirtle"
    );

    switch (eleccion) {
    case "1":
        pokemonElegido = starters[0];
        break;
    case "2":
        pokemonElegido = starters[1];
        break;
    case "3":
        pokemonElegido = starters[2];
        break;
    default:
        alert("Opción inválida. Intenta de nuevo.");
        continue; 
    }

        // Pregunto si quiere ese pokémon o volvemos a elegir otro

    confirmado = confirm(`¿Estás seguro de que quieres a ${pokemonElegido.nombre}?`);
}

    return pokemonElegido;
}


        // invocación de las funciones

let nick = iniciarJugador();
alert(`Bienvenido, ${nick} !\n Tu aventura Pokémon comienza ahora !`);


let starter = elegirStarter();
mostrarPokemon(starter);


alert(`${nick}, tu compañero será ${starter.nombre} !!!`);
console.log(`${nick}, tu compañero será ${starter.nombre} !!!`);




