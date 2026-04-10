// Datos de Pokémon iniciales

export const starters = [
  { nombre: "Bulbasaur", tipo: "Planta/Veneno", tiposApi: ["grass", "poison"], vida: 45, ataque: 49, imagen: "assets/bulbasaur.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png" },
  { nombre: "Charmander", tipo: "Fuego",         tiposApi: ["fire"],           vida: 39, ataque: 52, imagen: "assets/charmander.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png" },
  { nombre: "Squirtle",   tipo: "Agua",           tiposApi: ["water"],          vida: 44, ataque: 48, imagen: "assets/squirtle.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png" }
];

// Cadenas de evolución de los starters (datos de PokeAPI evolution-chain 1, 2 y 3)
// Bulbasaur → Ivysaur (lv16) → Venusaur (lv32)
// Charmander → Charmeleon (lv16) → Charizard (lv36)
// Squirtle → Wartortle (lv16) → Blastoise (lv36)
export const nextEvolution = {
  "Bulbasaur":  { nombre: "Ivysaur",    nivelEvolucion: 16, tipo: "Planta/Veneno",  tiposApi: ["grass", "poison"],   vida: 60, ataque: 62, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png" },
  "Ivysaur":    { nombre: "Venusaur",   nivelEvolucion: 32, tipo: "Planta/Veneno",  tiposApi: ["grass", "poison"],   vida: 80, ataque: 82, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png" },
  "Charmander": { nombre: "Charmeleon", nivelEvolucion: 16, tipo: "Fuego",          tiposApi: ["fire"],              vida: 58, ataque: 64, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/5.png" },
  "Charmeleon": { nombre: "Charizard",  nivelEvolucion: 36, tipo: "Fuego/Volador",  tiposApi: ["fire", "flying"],    vida: 78, ataque: 84, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png" },
  "Squirtle":   { nombre: "Wartortle",  nivelEvolucion: 16, tipo: "Agua",           tiposApi: ["water"],             vida: 59, ataque: 63, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/8.png" },
  "Wartortle":  { nombre: "Blastoise",  nivelEvolucion: 36, tipo: "Agua",           tiposApi: ["water"],             vida: 79, ataque: 83, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/9.png" },
};
