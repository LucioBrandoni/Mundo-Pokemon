// Efectos de sonido retro usando Web Audio API

const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
let _ctx = null;

function getCtx() {
    if (!_ctx) _ctx = new AudioCtxClass();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
}

export function isMuted() {
    return localStorage.getItem('soundMuted') === '1';
}

export function toggleMute() {
    const nowMuted = !isMuted();
    localStorage.setItem('soundMuted', nowMuted ? '1' : '0');
    return nowMuted;
}

/**
 * Reproduce una nota con oscilador.
 * @param {AudioContext} ctx
 * @param {number} freq  - Frecuencia en Hz
 * @param {string} type  - Tipo de onda ('square' | 'sawtooth' | 'triangle' | 'sine')
 * @param {number} start - Tiempo de inicio (ctx.currentTime)
 * @param {number} dur   - Duración en segundos
 * @param {number} vol   - Volumen máximo (0–1)
 */
function tone(ctx, freq, type, start, dur, vol = 0.28) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol, start);
    // exponentialRampToValueAtTime requiere un valor > 0 y un tiempo estrictamente futuro
    const rampEnd = Math.max(start + dur, ctx.currentTime + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, rampEnd);
    osc.start(start);
    osc.stop(rampEnd + 0.05);
}

/** Sonido de ataque: impacto breve y distorsionado. */
export function playAttackSound() {
    if (isMuted()) return;
    try {
        const ctx = getCtx();
        const t   = ctx.currentTime;
        tone(ctx, 180, 'sawtooth', t,        0.08, 0.25);
        tone(ctx, 420, 'square',   t + 0.05, 0.07, 0.20);
        tone(ctx, 160, 'sawtooth', t + 0.10, 0.10, 0.20);
    } catch (_) { /* contexto de audio no disponible */ }
}

/** Sonido de victoria: melodía ascendente. */
export function playVictorySound() {
    if (isMuted()) return;
    try {
        const ctx = getCtx();
        const t   = ctx.currentTime;
        // C5 → E5 → G5 → C6
        [523, 659, 784, 1047].forEach((f, i) =>
            tone(ctx, f, 'square', t + i * 0.18, 0.16, 0.28)
        );
    } catch (_) { /* contexto de audio no disponible */ }
}

/** Sonido de derrota: melodía descendente. */
export function playDefeatSound() {
    if (isMuted()) return;
    try {
        const ctx = getCtx();
        const t   = ctx.currentTime;
        // A4 → F#4 → D#4 → C4
        [440, 370, 311, 261].forEach((f, i) =>
            tone(ctx, f, 'triangle', t + i * 0.22, 0.20, 0.22)
        );
    } catch (_) { /* contexto de audio no disponible */ }
}

/** Sonido de evolución: arpeggio brillante ascendente. */
export function playEvolutionSound() {
    if (isMuted()) return;
    try {
        const ctx = getCtx();
        const t   = ctx.currentTime;
        [523, 659, 784, 880, 1047, 1319].forEach((f, i) =>
            tone(ctx, f, 'sine', t + i * 0.12, 0.13, 0.18)
        );
    } catch (_) { /* contexto de audio no disponible */ }
}
