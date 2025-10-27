  

    import { mostrarAlerta } from "./ui.js";

    // 🔹 Trae un Pokémon aleatorio desde la API
    export async function obtenerPokemonEnemigo() {
    try {
        const idRandom = Math.floor(Math.random() * 151) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idRandom}`);
        const data = await response.json();

        if (!data) {
            throw new Error("Pokémon inválido");
        }

        // Intentar obtener la imagen de diferentes fuentes
        const imagenPokemon = 
            (data.sprites?.front_default && await validateImage(data.sprites.front_default)) ||
            (data.sprites?.other?.["official-artwork"]?.front_default && await validateImage(data.sprites.other["official-artwork"].front_default)) ||
            (data.sprites?.other?.dream_world?.front_default && await validateImage(data.sprites.other.dream_world.front_default)) ||
            "/assets/pokeball.png";
    
        return {
            nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            imagen: imagenPokemon,
            ataque: data.stats[1].base_stat, // Attack
            vida: data.stats[0].base_stat,   // HP
        };

    } catch (error) {
        console.error("Error al obtener Pokémon enemigo:", error);
        mostrarAlerta("No se pudo conectar con la PokeAPI 😞", "error");
        // Retornar un Pokémon con valores por defecto en caso de error
        return {
            nombre: "Pokémon Desconocido",
            imagen: "/assets/pokeball.png",
            ataque: 50,
            vida: 50
        };
    }
    }

    // Función auxiliar para validar que una imagen existe
    async function validateImage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) return false;
            return url;
        } catch {
            return false;
        }
    }


    // 🔹 Simula el combate simple
    export function iniciarBatalla(jugador, enemigo) {
    const ataqueJugador = jugador.ataque + Math.floor(Math.random() * 10);
    const ataqueEnemigo = enemigo.ataque + Math.floor(Math.random() * 10);

    let resultado, icono;
    if (ataqueJugador >= ataqueEnemigo) {
        resultado = `🔥 ¡${jugador.nombre} ganó contra ${enemigo.nombre}!`;
        icono = "success";
    } else {
        resultado = `💀 ${jugador.nombre} fue derrotado por ${enemigo.nombre}...`;
        icono = "error";
    }

    // 🔹 Mostrar batalla visual
    Swal.fire({
        title: "⚔️ ¡Batalla Pokémon!",
        html: `
        <div style="display:flex;justify-content:space-around;align-items:center;">
            <div>
            <img src="${jugador.imagen}" alt="${jugador.nombre}" width="100">
            <p><strong>${jugador.nombre}</strong></p>
            <p>Ataque total: ${ataqueJugador}</p>
            </div>
            <h2>VS</h2>
            <div>
            <img src="${enemigo.imagen}" alt="${enemigo.nombre}" width="100">
            <p><strong>${enemigo.nombre}</strong></p>
            <p>Ataque total: ${ataqueEnemigo}</p>
            </div>
        </div>
        <hr>
        <h3>${resultado}</h3>
        `,
        icon: icono,
        confirmButtonText: "Continuar",
    });
    }


