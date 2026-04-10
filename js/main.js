import { guardarEnStorage, obtenerDeStorage, guardarBatalla, obtenerHistorial, limpiarHistorial } from "./storage.js";
import { mostrarOpcionesPokemon, mostrarResultado } from "./dom.js";
import { mostrarConfirmacion, mostrarAlerta } from "./ui.js";
import { obtenerPokemonEnemigo, iniciarBatalla, obtenerMovimientosPokemon } from "./battle.js";
import { starters, nextEvolution } from "./data.js";
import { verificarLogros, desbloquearLogroEvolucion } from "./achievements.js";

// Referencias al DOM

const formNickContainer = document.getElementById("formNickContainer");
const formNick = document.getElementById("formNick");
const nickInput = document.getElementById("nickInput");
const pokemonContainer = document.getElementById("pokemonContainer");
const starterButtons = document.getElementById("starterButtons");
const resultadoContainer = document.getElementById("resultadoContainer");
const pokemonStats = document.getElementById("pokemonStats");
const mensajeFinal = document.getElementById("mensajeFinal");
const loadingOverlay = document.getElementById("loadingOverlay");
const ariaLive = document.getElementById("ariaLive");

// Anuncia un mensaje a los lectores de pantalla sin mostrarlo visualmente
function anunciarAccesible(texto) {
    ariaLive.textContent = "";
    // Pequeño retardo para que el cambio sea detectado por los lectores de pantalla
    setTimeout(() => { ariaLive.textContent = texto; }, 50);
}

// Muestra la pantalla de carga
function mostrarCarga(mensaje = "Cargando...") {
    const parrafo = loadingOverlay.querySelector("p");
    if (parrafo) parrafo.textContent = mensaje;
    loadingOverlay.classList.add("visible");
    anunciarAccesible(mensaje);
}

// Oculta la pantalla de carga
function ocultarCarga() {
    loadingOverlay.classList.remove("visible");
}

// Muestra una sección con animación de entrada
function mostrarSeccion(el) {
    el.style.display = "block";
    el.classList.remove("slide-in-up");
    void el.offsetWidth; // forzar reflow para reiniciar la animación
    el.classList.add("slide-in-up");
}

// Oculta una sección
function ocultarSeccion(el) {
    el.style.display = "none";
    el.classList.remove("slide-in-up");
}

let nick = obtenerDeStorage("nick") || "";
let starter = obtenerDeStorage("starter") || null;

// Asegura que el starter tenga imagenEspaldas si fue guardado antes de que se añadiera el campo
if (starter && !starter.imagenEspaldas) {
    const fuente = starters.find(s => s.nombre === starter.nombre)
        || Object.values(nextEvolution).find(e => e.nombre === starter.nombre);
    if (fuente && fuente.imagenEspaldas) {
        starter.imagenEspaldas = fuente.imagenEspaldas;
        guardarEnStorage("starter", starter);
    }
}

// Patrones de URL permitidos para las imágenes del starter
const PATRONES_IMAGEN_VALIDA = [
    /^assets\//,
    /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\//,
];

function esImagenValida(url) {
    return !url || PATRONES_IMAGEN_VALIDA.some(p => p.test(url));
}

// Detecta si alguien manipuló las imágenes del starter desde el localStorage
// y muestra a Alf haciendo fuck you si es así
function validarImagenesStarter() {
    if (!starter) return;

    const imagenTampered = !esImagenValida(starter.imagen);
    const espaldaTampered = !esImagenValida(starter.imagenEspaldas);

    if (!imagenTampered && !espaldaTampered) return;

    Swal.fire({
        title: "🚨 ¡Trampa detectada!",
        html: `
            <p>Intentaste cambiar la imagen de tu Pokémon desde el localStorage.</p>
            <p>Alf tiene algo que decirte:</p>
            <img src="assets/alf-faku.svg" alt="Pikachu haciendo fuck you"
                 width="180" style="margin-top:8px"
                 onerror="this.replaceWith(Object.assign(document.createElement('span'),{style:'font-size:80px',textContent:'🖕'}))">
        `,
        icon: "warning",
        confirmButtonText: "Me pillaron... 😞",
        allowOutsideClick: false,
    });

    // Restaurar imágenes legítimas desde los datos en código
    const fuente = starters.find(s => s.nombre === starter.nombre)
        || Object.values(nextEvolution).find(e => e.nombre === starter.nombre);

    if (fuente) {
        if (imagenTampered) starter.imagen = fuente.imagen;
        if (espaldaTampered) starter.imagenEspaldas = fuente.imagenEspaldas;
    } else {
        // Pokémon desconocido en el starter: resetear todo
        starter.imagen = "assets/pokeball.png";
        starter.imagenEspaldas = null;
    }

    guardarEnStorage("starter", starter);
}

validarImagenesStarter();
let victorias = parseInt(obtenerDeStorage("victorias"), 10) || 0;
let derrotas = parseInt(obtenerDeStorage("derrotas"), 10) || 0;
let rachaActual = parseInt(obtenerDeStorage("racha"), 10) || 0;

// Sistema de experiencia
const XP_VICTORIA  = 50;
const XP_DERROTA   = 15;
const XP_POR_NIVEL = 100;
const NIVEL_INICIAL = 5;

function procesarExperiencia(gano) {
    const xpGanada = gano ? XP_VICTORIA : XP_DERROTA;
    starter.experiencia = (starter.experiencia || 0) + xpGanada;

    let subioNivel = false;
    while (starter.experiencia >= XP_POR_NIVEL) {
        starter.experiencia -= XP_POR_NIVEL;
        starter.nivel = (starter.nivel || NIVEL_INICIAL) + 1;
        subioNivel = true;
    }

    guardarEnStorage("starter", starter);
    return { xpGanada, subioNivel };
}

// Flujo inicial

if (nick && starter) {
    const historial = obtenerHistorial();
    mostrarResultado(pokemonStats, mensajeFinal, nick, starter, victorias, derrotas, historial, XP_POR_NIVEL);
    mostrarSeccion(resultadoContainer);
    agregarBotonesFinales();
    // Reanudar batalla pendiente si existe
    const enemigoGuardado = obtenerDeStorage("enemigoActual");
    if (enemigoGuardado) {
        reanudarBatalla(enemigoGuardado);
    }
} else {
    mostrarSeccion(formNickContainer);
    ocultarSeccion(pokemonContainer);
    ocultarSeccion(resultadoContainer);
}

// Evento: Ingreso de Nickname

formNick.addEventListener("submit", (e) => {
    e.preventDefault();
    nick = nickInput.value.trim();

    if (nick) {
    mostrarConfirmacion(`¿Querés llamarte ${nick}?`, (confirmado) => {
        if (confirmado) {
        guardarEnStorage("nick", nick);
        ocultarSeccion(formNickContainer);
        mostrarOpcionesPokemon(starterButtons, (index) => seleccionarPokemon(index));
        mostrarSeccion(pokemonContainer);
        } else {
        mostrarAlerta("Podés ingresar otro nombre.", "info");
        formNick.reset();
        }
    }, "Nuevo Entrenador");
    } else {
    mostrarAlerta("Debes ingresar un nick para continuar.", "error");
    }
});

// Selección de Pokémon inicial

function seleccionarPokemon(index) {
    const elegido = starters[index];
    mostrarConfirmacion(`¿Querés elegir a ${elegido.nombre}?`, (confirmado) => {
    if (confirmado) {
        starter = { ...elegido, nivel: NIVEL_INICIAL, experiencia: 0 };
        guardarEnStorage("starter", starter);
        ocultarSeccion(pokemonContainer);
        const historial = obtenerHistorial();
        mostrarResultado(pokemonStats, mensajeFinal, nick, starter, victorias, derrotas, historial, XP_POR_NIVEL);
        mostrarSeccion(resultadoContainer);
        agregarBotonesFinales();
    }
    });
}

// Botones finales (Volver al inicio / Comenzar desafío)

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
    btnVolver.setAttribute("aria-label", "Volver al inicio y reiniciar el juego");
    btnVolver.addEventListener("click", () => {
      mostrarConfirmacion(
        "Si volvés al inicio perderás todo tu progreso actual. ¿Estás seguro?",
        (confirmado) => {
          if (!confirmado) return;
          localStorage.clear();
          nick = "";
          starter = null;
          victorias = 0;
          derrotas = 0;
          rachaActual = 0;
          ocultarSeccion(resultadoContainer);
          ocultarSeccion(pokemonContainer);
          mostrarSeccion(formNickContainer);
        },
        "¿Volver al inicio?"
      );
    });

    const btnDesafio = document.createElement("button");
    btnDesafio.textContent = "Comenzar desafío";
    btnDesafio.className = "btn desafio";
    btnDesafio.setAttribute("aria-label", "Comenzar desafío y buscar un oponente Pokémon");
    btnDesafio.addEventListener("click", iniciarDesafio);

    btnContainer.appendChild(btnVolver);
    btnContainer.appendChild(btnDesafio);
    resultadoContainer.appendChild(btnContainer);
    }

// Combates utilizando PokeAPI

// Comprueba si el starter debe evolucionar y muestra el diálogo correspondiente
function mostrarEvolucionSiCorresponde() {
    const evolucion = nextEvolution[starter.nombre];
    if (!evolucion || starter.nivel < evolucion.nivelEvolucion) return;

    const nombreAnterior = starter.nombre;
    Swal.fire({
        title: `✨ ¡${nombreAnterior} está evolucionando!`,
        html: `
            <p>¡Ha alcanzado el <strong>nivel ${evolucion.nivelEvolucion}</strong>!</p>
            <div style="display:flex;justify-content:center;align-items:center;gap:30px;margin:16px 0">
                <div>
                    <img src="${starter.imagen}" alt="${nombreAnterior}" width="100" style="image-rendering:pixelated">
                    <p><strong>${nombreAnterior}</strong></p>
                </div>
                <div style="font-size:2em">→</div>
                <div>
                    <img src="${evolucion.imagen}" alt="${evolucion.nombre}" width="100" style="image-rendering:pixelated">
                    <p><strong>${evolucion.nombre}</strong></p>
                </div>
            </div>
            <p style="font-size:0.85em">
                ❤️ Vida: ${starter.vida} → <strong>${evolucion.vida}</strong> &nbsp;|&nbsp;
                ⚔️ Ataque: ${starter.ataque} → <strong>${evolucion.ataque}</strong>
            </p>
        `,
        icon: "success",
        confirmButtonText: "¡Evolucionar!",
        allowOutsideClick: false,
    }).then(() => {
        Object.assign(starter, {
            nombre:         evolucion.nombre,
            tipo:           evolucion.tipo,
            tiposApi:       evolucion.tiposApi,
            vida:           evolucion.vida,
            ataque:         evolucion.ataque,
            imagen:         evolucion.imagen,
            imagenEspaldas: evolucion.imagenEspaldas,
        });
        guardarEnStorage("starter", starter);
        desbloquearLogroEvolucion();
        verificarLogros({ gano: true, victorias, starter, rachaActual, multEnemigo: 1 });
        const historial = obtenerHistorial();
        mostrarResultado(pokemonStats, mensajeFinal, nick, starter, victorias, derrotas, historial, XP_POR_NIVEL);
        Swal.fire({
            title: `🎉 ¡${nombreAnterior} evolucionó a ${starter.nombre}!`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    });
}

async function iniciarDesafio() {
    mostrarCarga("Buscando oponente...");

    const enemigo = await obtenerPokemonEnemigo(victorias);
    ocultarCarga();
    if (!enemigo) return;

    // Guardar el enemigo actual para poder reanudar si se recarga la página
    guardarEnStorage("enemigoActual", enemigo);

    mostrarDialogoBatalla(enemigo);
}

// Construye el HTML con los detalles del Pokémon enemigo para los diálogos
function htmlDetallesEnemigo(enemigo) {
    const habilidadTexto = (enemigo.habilidades && enemigo.habilidades.length > 0)
        ? enemigo.habilidades.join(', ')
        : 'Desconocida';
    return `
        <img src="${enemigo.imagen}" alt="${enemigo.nombre}" width="150">
        <p><strong>Nivel:</strong> ${enemigo.nivel || '?'}</p>
        <p><strong>Tipo:</strong> ${enemigo.tipoDisplay || 'Desconocido'}</p>
        <p><strong>Vida:</strong> ${enemigo.vida}</p>
        <p><strong>Ataque:</strong> ${enemigo.ataque}</p>
        <p><strong>Habilidad:</strong> ${habilidadTexto}</p>
    `;
}

// Muestra el diálogo de encuentro con el enemigo y gestiona la batalla
function mostrarDialogoBatalla(enemigo) {
    anunciarAccesible(`¡Un ${enemigo.nombre} salvaje apareció! Nivel: ${enemigo.nivel || '?'}, Tipo: ${enemigo.tipoDisplay || 'Desconocido'}, Vida: ${enemigo.vida}, Ataque: ${enemigo.ataque}.`);
    Swal.fire({
    title: `¡Un ${enemigo.nombre} salvaje apareció!`,
    html: htmlDetallesEnemigo(enemigo),
    showCancelButton: true,
    confirmButtonText: "¡Luchar!",
    cancelButtonText: "Huir 🏃",
    }).then(async (result) => {
    if (result.isConfirmed) {
        mostrarCarga("Preparando movimientos...");
        const { movimientos, imagenEspaldas } = await obtenerMovimientosPokemon(starter.nombre, starter.tiposApi || []);
        if (imagenEspaldas) starter.imagenEspaldas = imagenEspaldas;
        ocultarCarga();
        iniciarBatalla(starter, enemigo, movimientos, (gano, stats = {}) => {
            // null significa que el jugador huyó durante la batalla
            if (gano === null) {
                localStorage.removeItem("enemigoActual");
                return;
            }
            // Actualizar y persistir estadísticas
            if (gano) {
                victorias++;
                rachaActual++;
                guardarEnStorage("victorias", victorias);
            } else {
                derrotas++;
                rachaActual = 0;
                guardarEnStorage("derrotas", derrotas);
            }
            guardarEnStorage("racha", rachaActual);
            // Procesar experiencia y nivel
            const { xpGanada, subioNivel } = procesarExperiencia(gano);
            // Guardar en historial
            guardarBatalla({
                fecha:              new Date().toLocaleDateString('es-AR'),
                enemigo:            enemigo.nombre,
                enemigoTipo:        enemigo.tipoDisplay || 'Desconocido',
                enemigoNivel:       enemigo.nivel || '?',
                resultado:          gano ? 'victoria' : 'derrota',
                ataqueJugador:      stats.ataqueJugador,
                ataqueEnemigo:      stats.ataqueEnemigo,
                efectividadJugador: stats.multJugador || 1,
            });
            // Verificar logros
            verificarLogros({ gano, victorias, starter, rachaActual, multEnemigo: stats.multEnemigo || 1 });
            // Limpiar batalla pendiente y refrescar pantalla
            localStorage.removeItem("enemigoActual");
            const historial = obtenerHistorial();
            mostrarResultado(pokemonStats, mensajeFinal, nick, starter, victorias, derrotas, historial, XP_POR_NIVEL);
            // Notificación de subida de nivel
            if (subioNivel) {
                Swal.fire({
                    title: `⭐ ¡${starter.nombre} subió de nivel!`,
                    html: `<p>¡Ahora está en el <strong>nivel ${starter.nivel}</strong>!</p><p style="font-size:0.75em">+${xpGanada} XP obtenidos</p>`,
                    icon: "success",
                    confirmButtonText: "¡Genial!",
                }).then(() => {
                    mostrarEvolucionSiCorresponde();
                });
            }
        });
    } else {
        localStorage.removeItem("enemigoActual");
        mostrarAlerta("Escapaste del combate...", "info");
    }
    });
}

// Reanuda una batalla que quedó pendiente al recargar la página
function reanudarBatalla(enemigo) {
    Swal.fire({
    title: "¡Tienes una batalla pendiente!",
    html: `
        <p>Estabas a punto de enfrentarte a <strong>${enemigo.nombre}</strong>.</p>
        ${htmlDetallesEnemigo(enemigo)}
    `,
    showCancelButton: true,
    confirmButtonText: "¡Continuar batalla!",
    cancelButtonText: "Abandonar 🏃",
    }).then((result) => {
    if (result.isConfirmed) {
        mostrarDialogoBatalla(enemigo);
    } else {
        localStorage.removeItem("enemigoActual");
        mostrarAlerta("Abandonaste la batalla pendiente.", "info");
    }
    });
}





