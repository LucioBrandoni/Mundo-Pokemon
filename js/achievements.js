// Sistema de logros (badges)

const LOGROS_KEY = 'logros';

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
];

const FORMAS_FINALES = ['Venusaur', 'Charizard', 'Blastoise'];

export function obtenerLogros() {
    try {
        return JSON.parse(localStorage.getItem(LOGROS_KEY)) || [];
    } catch {
        return [];
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
 * @param {{ gano: boolean, victorias: number, starter: object, rachaActual: number, multEnemigo: number }} ctx
 */
export function verificarLogros(ctx) {
    const { gano, victorias, starter, rachaActual, multEnemigo } = ctx;

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
}

export function desbloquearLogroEvolucion() {
    if (!estaDesbloqueado('evolucionaste')) {
        if (desbloquearLogro('evolucionaste')) {
            notificarLogro(LOGROS_DEFINICION.find(l => l.id === 'evolucionaste'));
        }
    }
}
