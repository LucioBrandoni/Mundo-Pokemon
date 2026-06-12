// Datos de Pokémon iniciales

export const starters = [
  // Generación I
  { nombre: "Bulbasaur",  tipo: "Planta/Veneno", tiposApi: ["grass", "poison"], vida: 45, ataque: 49, imagen: "assets/bulbasaur.png",  imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png" },
  { nombre: "Charmander", tipo: "Fuego",          tiposApi: ["fire"],            vida: 39, ataque: 52, imagen: "assets/charmander.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png" },
  { nombre: "Squirtle",   tipo: "Agua",            tiposApi: ["water"],           vida: 44, ataque: 48, imagen: "assets/squirtle.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png" },
  // Generación II
  { nombre: "Chikorita",  tipo: "Planta",          tiposApi: ["grass"],           vida: 45, ataque: 49, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/152.png" },
  { nombre: "Cyndaquil",  tipo: "Fuego",           tiposApi: ["fire"],            vida: 39, ataque: 52, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/155.png" },
  { nombre: "Totodile",   tipo: "Agua",            tiposApi: ["water"],           vida: 50, ataque: 65, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/158.png" },
];

// Cadenas de evolución de los starters (datos de PokeAPI evolution-chain 1, 2, 3, 4, 5 y 6)
// Bulbasaur → Ivysaur (lv16) → Venusaur (lv32)
// Charmander → Charmeleon (lv16) → Charizard (lv36)
// Squirtle → Wartortle (lv16) → Blastoise (lv36)
// Chikorita → Bayleef (lv16) → Meganium (lv32)
// Cyndaquil → Quilava (lv14) → Typhlosion (lv36)
// Totodile → Croconaw (lv18) → Feraligatr (lv30)
export const nextEvolution = {
  // Generación I
  "Bulbasaur":  { nombre: "Ivysaur",    nivelEvolucion: 16, tipo: "Planta/Veneno",  tiposApi: ["grass", "poison"],   vida: 60, ataque: 62,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png" },
  "Ivysaur":    { nombre: "Venusaur",   nivelEvolucion: 32, tipo: "Planta/Veneno",  tiposApi: ["grass", "poison"],   vida: 80, ataque: 82,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png" },
  "Charmander": { nombre: "Charmeleon", nivelEvolucion: 16, tipo: "Fuego",           tiposApi: ["fire"],              vida: 58, ataque: 64,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/5.png" },
  "Charmeleon": { nombre: "Charizard",  nivelEvolucion: 36, tipo: "Fuego/Volador",   tiposApi: ["fire", "flying"],    vida: 78, ataque: 84,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png" },
  "Squirtle":   { nombre: "Wartortle",  nivelEvolucion: 16, tipo: "Agua",            tiposApi: ["water"],             vida: 59, ataque: 63,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/8.png" },
  "Wartortle":  { nombre: "Blastoise",  nivelEvolucion: 36, tipo: "Agua",            tiposApi: ["water"],             vida: 79, ataque: 83,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",   imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/9.png" },
  // Generación II
  "Chikorita":  { nombre: "Bayleef",    nivelEvolucion: 16, tipo: "Planta",          tiposApi: ["grass"],             vida: 60, ataque: 62,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/153.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/153.png" },
  "Bayleef":    { nombre: "Meganium",   nivelEvolucion: 32, tipo: "Planta",          tiposApi: ["grass"],             vida: 80, ataque: 82,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/154.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/154.png" },
  "Cyndaquil":  { nombre: "Quilava",    nivelEvolucion: 14, tipo: "Fuego",           tiposApi: ["fire"],              vida: 58, ataque: 64,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/156.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/156.png" },
  "Quilava":    { nombre: "Typhlosion", nivelEvolucion: 36, tipo: "Fuego",           tiposApi: ["fire"],              vida: 78, ataque: 84,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/157.png" },
  "Totodile":   { nombre: "Croconaw",   nivelEvolucion: 18, tipo: "Agua",            tiposApi: ["water"],             vida: 65, ataque: 80,  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/159.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/159.png" },
  "Croconaw":   { nombre: "Feraligatr", nivelEvolucion: 30, tipo: "Agua",            tiposApi: ["water"],             vida: 85, ataque: 105, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/160.png", imagenEspaldas: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/160.png" },
};

export const ITEM_DEFINITIONS = {
  potion: {
    nombre: "Poción",
    curacion: 20,
    emoji: "🧪",
  },
  superPotion: {
    nombre: "Super Poción",
    curacion: 50,
    emoji: "✨",
  },
};

export const INITIAL_INVENTORY = {
  potion: 2,
  superPotion: 1,
};

export const RIVAL_STARTERS = {
  Bulbasaur: "Charmander",
  Charmander: "Squirtle",
  Squirtle: "Bulbasaur",
  Chikorita: "Cyndaquil",
  Cyndaquil: "Totodile",
  Totodile: "Chikorita",
};

export const RIVAL_TRAINER_NAME = "Rival";

export const LEGENDARY_IDS = [144, 145, 146, 150, 243, 244, 245, 249, 250];

export function obtenerCadenaEvolutiva(nombrePokemon) {
  if (!nombrePokemon) return [];

  const base = starters.find(starter => starter.nombre === nombrePokemon);
  if (base) {
    const cadena = [base.nombre];
    let actual = base.nombre;
    while (nextEvolution[actual]) {
      actual = nextEvolution[actual].nombre;
      cadena.push(actual);
    }
    return cadena;
  }

  const entrada = Object.entries(nextEvolution).find(([, evolucion]) => evolucion.nombre === nombrePokemon);
  if (!entrada) return [nombrePokemon];

  return obtenerCadenaEvolutiva(entrada[0]);
}

export function obtenerDatosPokemon(nombrePokemon) {
  if (!nombrePokemon) return null;

  return starters.find(pokemon => pokemon.nombre === nombrePokemon)
    || nextEvolution[nombrePokemon]
    || Object.values(nextEvolution).find(evolucion => evolucion.nombre === nombrePokemon)
    || null;
}

export function obtenerBaseCadena(nombrePokemon) {
  const cadena = obtenerCadenaEvolutiva(nombrePokemon);
  return cadena[0] || nombrePokemon;
}

export function esFormaFinal(nombrePokemon) {
  if (!nombrePokemon) return false;
  const cadena = obtenerCadenaEvolutiva(nombrePokemon);
  return cadena[cadena.length - 1] === nombrePokemon;
}
