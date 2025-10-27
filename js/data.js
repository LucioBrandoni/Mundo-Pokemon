// Datos base: Pokémon iniciales

export const starters = [
  { nombre: "Bulbasaur", tipo: "Planta/Veneno", vida: 45, ataque: 49, imagen: "assets/bulbasaur.png" },
  { nombre: "Charmander", tipo: "Fuego", vida: 39, ataque: 52, imagen: "assets/charmander.png" },
  { nombre: "Squirtle", tipo: "Agua", vida: 44, ataque: 48, imagen: "assets/squirtle.png" }
];

console.log("data.js cargado", typeof starters !== 'undefined' ? starters.length + " starters" : starters);
