// Datos de Pokémon iniciales

export const starters = [
  { nombre: "Bulbasaur", tipo: "Planta/Veneno", vida: 45, ataque: 49, imagen: "/Mundo-Pokemon/assets/bulbasaur.png" },
  { nombre: "Charmander", tipo: "Fuego", vida: 39, ataque: 52, imagen: "/Mundo-Pokemon/assets/charmander.png" },
  { nombre: "Squirtle", tipo: "Agua", vida: 44, ataque: 48, imagen: "/Mundo-Pokemon/assets/squirtle.png" }
];

console.log("data.js cargado", typeof starters !== 'undefined' ? starters.length + " starters" : starters);
