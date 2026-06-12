// Sistema de logros (badges)

const LOGROS_KEY = 'logros';
const COLECCIONISTA_KEY = 'coleccionista_bases';
const BASES_KANTO = ['Bulbasaur', 'Charmander', 'Squirtle'];
const FORMAS_FINALES_KANTO = { Venusaur: 'Bulbasaur', Charizard: 'Charmander', Blastoise: 'Squirtle' };

export const LOGROS_DEFINICION = [
    {
        id: 'primer_victoria',
        emoji: '🥇',
        nombre: 'Primera Victoria',
        descripcion: 'Ganar tu primera batalla',
    },
    {
        id: 'en_racha',
        emoji: '🔥',
        nombre: 'En Racha',
        descripcion: 'Ganar 5 batallas seguidas sin perder',
    },
    {
        id: 'entrenador_serio',
        emoji: '📈',
        nombre: 'Entrenador Serio',
        descripcion: 'Alcanzar el nivel 20',
    },
    {
        id: 'evolucionaste',
        emoji: '🧬',
        nombre: '¡Evolucionaste!',
        descripcion: 'Evolucionar tu Pokémon por primera vez',
    },
    {
        id: 'david_vs_goliat',
        emoji: '💪',
        nombre: 'David vs Goliat',
        descripcion: 'Ganar una batalla con desventaja de tipo (enemigo ×2)',
    },
    {
        id: 'maestro_pokemon',
        emoji: '🌟',
        nombre: 'Maestro Pokémon',
        descripcion: 'Llegar a la forma final de la cadena evolutiva',
    },
    {
        id: 'veterano',
        emoji: '🎖️',
        nombre: 'Veterano',
        descripcion: 'Participar en 50 batallas',
    },
    {
        id: 'sin_rasgunos',
        emoji: '🛡️',
        nombre: 'Sin Rasguños',
        descripcion: 'Ganar una batalla sin recibir ningún daño',
    },
    {
        id: 'coleccionista',
        emoji: '📚',
        nombre: 'Coleccionista',
        descripcion: 'Evolucionar los 3 starters de Kanto a su forma final',
    },
    {
        id: 'cazador_leyendas',
        emoji: '💫',
        nombre: 'Cazador de Leyendas',
        descripcion: 'Enfrentarse a un Pokémon legendario',
    },
];

const FORMAS_FINALES = ['Venusaur', 'Charizard', 'Blastoise'];

export function obtenerLogros() {
    try {
        return JSON.parse(localStorage.getItem(LOGROS_KEY)) || [];
    } catch {
        return [];
    }
}

export function obtenerColeccionistaBases() {
    try {
        return JSON.parse(localStorage.getItem(COLECCIONISTA_KEY)) || [];
    } catch {
        return [];
    }
}

export function guardarColeccionistaBases(bases) {
    localStorage.setItem(COLECCIONISTA_KEY, JSON.stringify(bases));
}

function registrarFormaFinalKanto(nombrePokemon) {
    const starterBase = FORMAS_FINALES_KANTO[nombrePokemon];
    if (!starterBase) return;
    const bases = obtenerColeccionistaBases();
    if (!bases.includes(starterBase)) {
        bases.push(starterBase);
        guardarColeccionistaBases(bases);
    }
}

function estaDesbloqueado(id) {
    return obtenerLogros().includes(id);
}

function desbloquearLogro(id) {
    const logros = obtenerLogros();
    if (logros.includes(id)) return false;
    logros.push(id);
    localStorage.setItem(LOGROS_KEY, JSON.stringify(logros));
    return true;
}

function notificarLogro(logro) {
    Swal.fire({
        title: `${logro.emoji} ¡Logro Desbloqueado!`,
        html: `<p style="font-size:0.85em"><strong>${logro.nombre}</strong></p><p style="font-size:0.65em;color:#aaa">${logro.descripcion}</p>`,
        icon: 'success',
        timer: 3500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
    });
}

/**
 * Verifica y desbloquea logros según el contexto de la batalla.
 * @param {{ gano: boolean, victorias: number, derrotas?: number, starter: object, rachaActual: number, multEnemigo: number, ataqueEnemigo?: number }} ctx
 */
export function verificarLogros(ctx) {
    const { gano, victorias, derrotas = 0, starter, rachaActual, multEnemigo, ataqueEnemigo = Infinity } = ctx;
    const totalBatallas = victorias + derrotas;

    if (gano && victorias === 1 && !estaDesbloqueado('primer_victoria')) {
        if (desbloquearLogro('primer_victoria')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'primer_victoria'));
        }
    }

    if (gano && rachaActual >= 5 && !estaDesbloqueado('en_racha')) {
        if (desbloquearLogro('en_racha')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'en_racha'));
        }
    }

    if (starter.nivel >= 20 && !estaDesbloqueado('entrenador_serio')) {
        if (desbloquearLogro('entrenador_serio')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'entrenador_serio'));
        }
    }

    if (FORMAS_FINALES.includes(starter.nombre) && !estaDesbloqueado('maestro_pokemon')) {
        if (desbloquearLogro('maestro_pokemon')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'maestro_pokemon'));
        }
    }

    if (gano && multEnemigo >= 2 && !estaDesbloqueado('david_vs_goliat')) {
        if (desbloquearLogro('david_vs_goliat')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'david_vs_goliat'));
        }
    }

    if (totalBatallas >= 50 && !estaDesbloqueado('veterano')) {
        if (desbloquearLogro('veterano')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'veterano'));
        }
    }

    if (gano && ataqueEnemigo === 0 && !estaDesbloqueado('sin_rasgunos')) {
        if (desbloquearLogro('sin_rasgunos')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'sin_rasgunos'));
        }
    }

    registrarFormaFinalKanto(starter.nombre);
    const basesColeccionista = obtenerColeccionistaBases();
    if (BASES_KANTO.every(b => basesColeccionista.includes(b)) && !estaDesbloqueado('coleccionista')) {
        if (desbloquearLogro('coleccionista')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'coleccionista'));
        }
    }
}

export function desbloquearLogroEvolucion() {
    if (!estaDesbloqueado('evolucionaste')) {
        if (desbloquearLogro('evolucionaste')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'evolucionaste'));
        }
    }
}

export function desbloquearLogroCazadorLeyendas() {
    if (!estaDesbloqueado('cazador_leyendas')) {
        if (desbloquearLogro('cazador_leyendas')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'cazador_leyendas'));
        }
    }
}

export function mostrarPantallaLogros() {
    const desbloqueados = obtenerLogros();
    const total = desbloqueados.length;
    const maximo = LOGROS_DEFINICION.length;

    const items = LOGROS_DEFINICION.map(logro => {
        if (desbloqueados.includes(logro.id)) {
            return `<div class="logro-badge" title="${logro.descripcion}" aria-label="${logro.nombre}: ${logro.descripcion}">${logro.emoji} <span>${logro.nombre}</span></div>`;
        }
        return `<div class="logro-badge logro-bloqueado" title="${logro.descripcion}" aria-label="Bloqueado: ${logro.descripcion}">🔒 <span>${logro.nombre}</span><br><span class="logro-pista">${logro.descripcion}</span></div>`;
    }).join('');

    Swal.fire({
        title: `🏅 Logros (${total}/${maximo})`,
        html: `<div class="logros-grid logros-pantalla-grid">${items}</div>`,
        confirmButtonText: 'Cerrar',
        width: '95%',
    });
}
