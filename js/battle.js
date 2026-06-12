    import { ITEM_DEFINITIONS, LEGENDARY_IDS, esFormaFinal } from "./data.js";
    import { mostrarAlerta } from "./ui.js";
    import { playAttackSound, playVictorySound, playDefeatSound } from "./audio.js";

    const MAX_INTENTOS = 3;

    // Constantes para el cálculo de nivel del enemigo
    const MAX_NIVEL          = 100;
    const MIN_NIVEL          = 5;
    const NIVEL_POR_VICTORIA = 4;
    const NIVEL_RANDOM_BOOST = 10;
    const NIVEL_BASE         = 5;
    const BONUS_NIVEL_FORMA_FINAL = 8;
    const PROB_LEGENDARIO_FORMA_FINAL = 0.35;

    // Factor de escala de HP para que las batallas duren varios turnos
    const HP_SCALE = 2;

    // ============================================================
    // Tablas de tipos
    // ============================================================

    const TYPE_NAMES_ES = {
        normal:   'Normal',    fire:     'Fuego',     water:    'Agua',
        grass:    'Planta',    electric: 'Eléctrico', ice:      'Hielo',
        fighting: 'Lucha',    poison:   'Veneno',    ground:   'Tierra',
        flying:   'Volador',  psychic:  'Psíquico',  bug:      'Bicho',
        rock:     'Roca',     ghost:    'Fantasma',  dragon:   'Dragón',
        dark:     'Siniestro',steel:    'Acero',     fairy:    'Hada',
    };

    const TYPE_COLORS = {
        fire: '#FF6030', water: '#3399FF', grass: '#33BB33', electric: '#F8C000',
        ice: '#66CCFF', fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
        flying: '#A890F0', psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
        ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0',
        fairy: '#EE99AC', normal: '#888888',
    };

    // Tipos a los que cada tipo ataca con ventaja (×2)
    const TYPE_STRENGTHS = {
        fire:     ['grass', 'bug', 'ice', 'steel'],
        water:    ['fire', 'ground', 'rock'],
        grass:    ['water', 'ground', 'rock'],
        electric: ['water', 'flying'],
        ice:      ['grass', 'ground', 'dragon', 'flying'],
        fighting: ['normal', 'rock', 'steel', 'ice', 'dark'],
        poison:   ['grass', 'fairy'],
        ground:   ['fire', 'electric', 'poison', 'rock', 'steel'],
        flying:   ['grass', 'fighting', 'bug'],
        psychic:  ['fighting', 'poison'],
        bug:      ['grass', 'psychic', 'dark'],
        rock:     ['fire', 'ice', 'flying', 'bug'],
        ghost:    ['ghost', 'psychic'],
        dragon:   ['dragon'],
        dark:     ['ghost', 'psychic'],
        steel:    ['ice', 'rock', 'fairy'],
        fairy:    ['fighting', 'dragon', 'dark'],
        normal:   [],
    };

    /**
     * Calcula el multiplicador de efectividad de tipos.
     * Devuelve 2 si algún tipo del atacante tiene ventaja sobre algún tipo del defensor, 1 en caso contrario.
     */
    function calcularMultiplicador(tiposAtacante = [], tiposDefensor = []) {
        for (const tipoAtk of tiposAtacante) {
            const fortalezas = TYPE_STRENGTHS[tipoAtk] || [];
            for (const tipoDef of tiposDefensor) {
                if (fortalezas.includes(tipoDef)) return 2;
            }
        }
        return 1;
    }

    /** Traduce un array de tipos en inglés a una cadena en español. */
    function traducirTipos(tipos = []) {
        return tipos.map(t => TYPE_NAMES_ES[t] || t).join('/');
    }

    /** Traduce un único tipo en inglés a español. */
    function traducirTipoUI(tipo) {
        return TYPE_NAMES_ES[tipo] || tipo;
    }

    /** Capitaliza un nombre con guiones (ej. "solar-power" → "Solar Power"). */
    function formatearHabilidad(nombre) {
        return nombre.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    /** Capitaliza un nombre de movimiento con guiones. */
    function formatearMovimiento(nombre) {
        return nombre.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // ============================================================
    // Movimientos de reserva por tipo (sin llamadas a la API)
    // ============================================================

    const MOVIMIENTOS_POR_TIPO = {
        fire:     [{ nombre: 'Lanzallamas',      poder: 90,  tipo: 'fire',     pp: 15 },
                   { nombre: 'Ascuas',            poder: 40,  tipo: 'fire',     pp: 25 }],
        water:    [{ nombre: 'Surf',              poder: 90,  tipo: 'water',    pp: 15 },
                   { nombre: 'Pistola Agua',      poder: 40,  tipo: 'water',    pp: 25 }],
        grass:    [{ nombre: 'Hoja Afilada',      poder: 55,  tipo: 'grass',    pp: 25 },
                   { nombre: 'Latigo Cepa',       poder: 45,  tipo: 'grass',    pp: 25 }],
        electric: [{ nombre: 'Trueno',            poder: 110, tipo: 'electric', pp: 10 },
                   { nombre: 'Impactrueno',       poder: 40,  tipo: 'electric', pp: 30 }],
        ice:      [{ nombre: 'Rayo Hielo',        poder: 90,  tipo: 'ice',      pp: 10 },
                   { nombre: 'Ventisca',          poder: 110, tipo: 'ice',      pp:  5 }],
        fighting: [{ nombre: 'Patada Salto',      poder: 100, tipo: 'fighting', pp: 10 },
                   { nombre: 'Golpe Karate',      poder: 50,  tipo: 'fighting', pp: 25 }],
        poison:   [{ nombre: 'Bomba Lodo',        poder: 65,  tipo: 'poison',   pp: 20 },
                   { nombre: 'Acido',             poder: 40,  tipo: 'poison',   pp: 30 }],
        ground:   [{ nombre: 'Terremoto',         poder: 100, tipo: 'ground',   pp: 10 },
                   { nombre: 'Excavar',           poder: 80,  tipo: 'ground',   pp: 10 }],
        flying:   [{ nombre: 'Ataque Aereo',      poder: 60,  tipo: 'flying',   pp: 20 },
                   { nombre: 'Vendaval',          poder: 110, tipo: 'flying',   pp:  5 }],
        psychic:  [{ nombre: 'Psiquico',          poder: 90,  tipo: 'psychic',  pp: 10 },
                   { nombre: 'Psicorrayo',        poder: 65,  tipo: 'psychic',  pp: 10 }],
        bug:      [{ nombre: 'Tijera X',          poder: 80,  tipo: 'bug',      pp: 15 },
                   { nombre: 'Picadura',          poder: 60,  tipo: 'bug',      pp: 20 }],
        rock:     [{ nombre: 'Avalancha',         poder: 75,  tipo: 'rock',     pp: 10 },
                   { nombre: 'Lanzarrocas',       poder: 25,  tipo: 'rock',     pp: 15 }],
        ghost:    [{ nombre: 'Sombra Vil',        poder: 80,  tipo: 'ghost',    pp: 15 },
                   { nombre: 'Bola Sombra',       poder: 80,  tipo: 'ghost',    pp: 15 }],
        dragon:   [{ nombre: 'Garra Dragon',      poder: 80,  tipo: 'dragon',   pp: 15 },
                   { nombre: 'Draco Meteoro',     poder: 130, tipo: 'dragon',   pp:  5 }],
        dark:     [{ nombre: 'Pulso Umbrio',      poder: 80,  tipo: 'dark',     pp: 15 },
                   { nombre: 'Mordisco',          poder: 60,  tipo: 'dark',     pp: 25 }],
        steel:    [{ nombre: 'Cabeza De Hierro',  poder: 80,  tipo: 'steel',    pp: 15 },
                   { nombre: 'Giro Bola',         poder: 60,  tipo: 'steel',    pp: 20 }],
        fairy:    [{ nombre: 'Brillo Magico',     poder: 80,  tipo: 'fairy',    pp: 10 },
                   { nombre: 'Voz Cautivadora',   poder: 40,  tipo: 'fairy',    pp: 20 }],
        normal:   [{ nombre: 'Hiperrayo',         poder: 150, tipo: 'normal',   pp:  5 },
                   { nombre: 'Placaje',           poder: 40,  tipo: 'normal',   pp: 35 }],
    };

    const MOVIMIENTO_PLACAJE = { nombre: 'Placaje', poder: 40, tipo: 'normal', pp: 35 };
    const MOVIMIENTO_FORCEJEO = { nombre: 'Forcejeo', poder: 50, tipo: 'normal', pp: 10 };

    /** Devuelve movimientos de reserva con ppActual inicializado, basados en los tipos del Pokémon. */
    function obtenerMovimientosFallback(tiposApi = []) {
        const movs = [];
        for (const tipo of tiposApi.slice(0, 2)) {
            const typeMovs = MOVIMIENTOS_POR_TIPO[tipo] || MOVIMIENTOS_POR_TIPO.normal;
            movs.push(...typeMovs);
        }
        if (movs.length === 0) movs.push(...MOVIMIENTOS_POR_TIPO.normal);
        // Garantizar al menos Placaje como movimiento de reserva
        if (!movs.some(m => m.nombre === MOVIMIENTO_PLACAJE.nombre)) {
            movs.push(MOVIMIENTO_PLACAJE);
        }
        return movs.slice(0, 4).map(m => ({ ...m, ppActual: m.pp }));
    }

    // ============================================================
    // Obtener movimientos reales del jugador desde la PokeAPI
    // ============================================================

    /**
     * Obtiene hasta 4 movimientos ofensivos reales para un Pokémon desde la PokeAPI.
     * Si la API falla, devuelve movimientos de reserva.
     * @param {string} nombrePokemon
     * @param {string[]} tiposApi
     * @returns {Promise<Array>}
     */
    export async function obtenerMovimientosPokemon(nombrePokemon, tiposApi = []) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // Barajar y tomar 8 candidatos
            const all = [...(data.moves || [])];
            for (let i = all.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [all[i], all[j]] = [all[j], all[i]];
            }
            const candidates = all.slice(0, 8);

            // Obtener detalles de los movimientos en paralelo
            const details = await Promise.all(
                candidates.map(m =>
                    fetch(m.move.url)
                        .then(r => r.json())
                        .catch(() => null)
                )
            );

            const movimientos = details
                .filter(d => d && d.power && d.power > 0 && d.damage_class?.name !== 'status')
                .slice(0, 4)
                .map(d => ({
                    nombre:   formatearMovimiento(d.name),
                    poder:    d.power,
                    tipo:     d.type.name,
                    pp:       Math.min(d.pp || 10, 20),
                    ppActual: Math.min(d.pp || 10, 20),
                }));

            // Completar con reservas si hacen falta al menos 2 movimientos
            if (movimientos.length < 2) {
                const fallbacks = obtenerMovimientosFallback(tiposApi);
                movimientos.push(...fallbacks.slice(0, 4 - movimientos.length));
            }

            const imagenEspaldas = data.sprites?.back_default || null;
            return { movimientos, imagenEspaldas };
        } catch (err) {
            console.warn('Usando movimientos de reserva:', err);
            return { movimientos: obtenerMovimientosFallback(tiposApi), imagenEspaldas: null };
        }
    }

    // ============================================================
    // Rango de Pokémon según progreso
    // ============================================================

    function obtenerRangoPokemon(victorias, formaFinal = false) {
        if (formaFinal) return 721;         // Hasta Gen 6
        if (victorias >= 20) return 649; // Gen 1–5 (más fuertes)
        if (victorias >= 15) return 386; // Gen 1–3
        if (victorias >= 10) return 251; // Gen 1–2
        if (victorias >= 6)  return 151; // Gen 1 completo
        if (victorias >= 3)  return 100; // Gen 1 medio
        return 50;                        // Gen 1 inicial (más débiles)
    }

    function normalizarProgreso(progreso) {
        if (typeof progreso === 'number') {
            return { victorias: progreso, starter: null };
        }

        return {
            victorias: progreso?.victorias || 0,
            starter: progreso?.starter || null,
        };
    }

    function elegirIdEnemigo(maxId, permitirLegendarios) {
        // PROB_LEGENDARIO_FORMA_FINAL representa una probabilidad directa (ej. 0.35 = 35%)
        if (permitirLegendarios && Math.random() < PROB_LEGENDARIO_FORMA_FINAL) {
            return LEGENDARY_IDS[Math.floor(Math.random() * LEGENDARY_IDS.length)];
        }

        return Math.floor(Math.random() * maxId) + 1;
    }

    // ============================================================
    // Obtener Pokémon enemigo desde la API
    // ============================================================

    export async function obtenerPokemonEnemigo(progreso = 0) {
        const { victorias, starter } = normalizarProgreso(progreso);
        const formaFinal = esFormaFinal(starter?.nombre);
        const maxId = obtenerRangoPokemon(victorias, formaFinal);
        let ultimoError = null;

        for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
            try {
                const idRandom = elegirIdEnemigo(maxId, formaFinal);
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idRandom}`);

                if (!response.ok) {
                    throw new Error(`Respuesta HTTP inesperada: ${response.status}`);
                }

                const data = await response.json();

                // Imagen: preferir front_default, luego official-artwork, luego dream_world
                const imagenPokemon =
                    (data.sprites?.front_default && await validateImage(data.sprites.front_default)) ||
                    (data.sprites?.other?.["official-artwork"]?.front_default && await validateImage(data.sprites.other["official-artwork"].front_default)) ||
                    (data.sprites?.other?.dream_world?.front_default && await validateImage(data.sprites.other.dream_world.front_default)) ||
                    "assets/pokeball.png";

                // Tipos
                const tipos = (data.types || []).map(t => t.type.name);
                const tipoDisplay = traducirTipos(tipos);

                // Nivel (basado en victorias + azar, rango MIN_NIVEL–MAX_NIVEL)
                const bonusFormaFinal = formaFinal ? BONUS_NIVEL_FORMA_FINAL : 0;
                const nivel = Math.min(MAX_NIVEL, Math.max(MIN_NIVEL,
                    victorias * NIVEL_POR_VICTORIA + Math.floor(Math.random() * NIVEL_RANDOM_BOOST) + NIVEL_BASE + bonusFormaFinal));

                // Habilidades no ocultas (máx. 2)
                const habilidades = (data.abilities || [])
                    .filter(a => !a.is_hidden)
                    .slice(0, 2)
                    .map(a => formatearHabilidad(a.ability.name));

                return {
                    nombre:     data.name.charAt(0).toUpperCase() + data.name.slice(1),
                    imagen:     imagenPokemon,
                    ataque:     data.stats[1].base_stat,
                    vida:       data.stats[0].base_stat,
                    tipos,
                    tipoDisplay,
                    nivel,
                    habilidades,
                    esLegendario: LEGENDARY_IDS.includes(data.id),
                };

            } catch (error) {
                ultimoError = error;
                console.warn(`Intento ${intento}/${MAX_INTENTOS} fallido al obtener Pokémon enemigo:`, error);
            }
        }

        // Todos los intentos fallaron: usar Pokémon de reserva
        console.error("No se pudo obtener el Pokémon enemigo tras varios intentos:", ultimoError);
        mostrarAlerta("No se pudo conectar con la PokeAPI 😞. Se usará un oponente de reserva.", "error");
        return {
            nombre:     "Pokémon Desconocido",
            imagen:     "assets/pokeball.png",
            ataque:     50,
            vida:       50,
            tipos:      ['normal'],
            tipoDisplay:'Normal',
            nivel:      5,
            habilidades:['Desconocida'],
            esLegendario: false,
        };
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

    // ============================================================
    // Cálculo de daño por turno
    // ============================================================

    /**
     * Calcula el daño de un movimiento con variación aleatoria.
     * @param {number} poder  - Poder base del movimiento
     * @param {number} ataque - Estadística de ataque del atacante
     * @param {number} mult   - Multiplicador de tipo (1 o 2)
     * @returns {number}
     */
    function calcularDano(poder, ataque, mult) {
        const base = Math.floor((poder / 3) * (ataque / 50));
        const variacion = Math.floor(Math.random() * 5) + 1;
        return Math.max(1, Math.floor(base * mult) + variacion);
    }

    // ============================================================
    // Sistema de batalla por turnos con pantalla interactiva
    // ============================================================

    /**
     * Inicia la batalla por turnos en la pantalla dedicada.
     * @param {object}   jugador            - Datos del Pokémon del jugador
     * @param {object}   enemigo            - Datos del Pokémon enemigo
     * @param {Array}    movimientosJugador - Movimientos del jugador obtenidos de la API
     * @param {Function} onFinished         - Callback(gano, stats) | gano===null si huyó
     */
    export function iniciarBatalla(jugador, enemigo, movimientosJugador, onFinished, opciones = {}) {
        const movimientosEnemigo = obtenerMovimientosFallback(enemigo.tipos || ['normal']);
        const inventario = opciones.inventario || {};

        const hpMaxJugador = jugador.vida * HP_SCALE;
        const hpMaxEnemigo = enemigo.vida * HP_SCALE;
        let hpJugador = hpMaxJugador;
        let hpEnemigo = hpMaxEnemigo;

        let mejorMultJugador = 1;
        let mejorMultEnemigo = 1;
        let totalAtaqueJugador = 0;
        let totalAtaqueEnemigo = 0;
        let accionesHabilitadas = true;

        const pantalla       = document.getElementById('battleScreen');
        const logText        = document.getElementById('battleLogText');
        const movesGrid      = document.getElementById('battleMovesGrid');
        const btnHuir        = document.getElementById('battleBtnHuir');
        const btnItems       = document.getElementById('battleBtnItems');
        const enemyHpBar     = document.getElementById('battleEnemyHpBar');
        const playerHpBar    = document.getElementById('battlePlayerHpBar');
        const enemyHpNums    = document.getElementById('battleEnemyHpNums');
        const playerHpNums   = document.getElementById('battlePlayerHpNums');
        const enemyNameEl    = document.getElementById('battleEnemyName');
        const playerNameEl   = document.getElementById('battlePlayerName');
        const enemySprite    = document.getElementById('battleEnemySprite');
        const playerSprite   = document.getElementById('battlePlayerSprite');

        const nombreEnemigoPantalla = enemigo.esRival
            ? `${enemigo.entrenador} · ${enemigo.nombre}  Niv.${enemigo.nivel || '?'}`
            : `${enemigo.nombre}  Niv.${enemigo.nivel || '?'}`;
        enemyNameEl.textContent  = nombreEnemigoPantalla;
        playerNameEl.textContent = `${jugador.nombre}  Niv.${jugador.nivel || '?'}`;
        enemySprite.src  = enemigo.imagen;
        enemySprite.alt  = enemigo.nombre;
        playerSprite.src = jugador.imagenEspaldas || jugador.imagen;
        playerSprite.alt = jugador.nombre;

        actualizarHP(enemyHpBar, enemyHpNums, hpEnemigo, hpMaxEnemigo);
        actualizarHP(playerHpBar, playerHpNums, hpJugador, hpMaxJugador);
        setLog(`${enemigo.esRival ? `${enemigo.entrenador} envió a ${enemigo.nombre}` : `¡Un ${enemigo.nombre} salvaje apareció!`} ¿Qué hará ${jugador.nombre}?`);

        if (movimientosJugador.every(m => m.ppActual <= 0)) {
            movimientosJugador.splice(0, movimientosJugador.length,
                { ...MOVIMIENTO_FORCEJEO, ppActual: MOVIMIENTO_FORCEJEO.pp });
        }

        pantalla.style.display = 'flex';
        renderMovimientos();
        renderBotonesUtilidad();

        btnHuir.onclick = () => {
            if (!accionesHabilitadas) return;
            terminarBatalla(false, true);
        };

        btnItems.onclick = async () => {
            if (!accionesHabilitadas || !hayItemsUsables()) return;

            const opcionesItems = obtenerItemsUsables();
            const inputOptions = Object.fromEntries(
                opcionesItems.map(([clave, cantidad]) => [
                    clave,
                    `${ITEM_DEFINITIONS[clave].emoji} ${ITEM_DEFINITIONS[clave].nombre} (+${ITEM_DEFINITIONS[clave].curacion} HP) · x${cantidad}`,
                ])
            );

            const { value: itemSeleccionado } = await Swal.fire({
                title: 'Usar objeto',
                input: 'radio',
                inputOptions,
                inputValidator: (value) => !value && 'Elegí un objeto para continuar.',
                showCancelButton: true,
                confirmButtonText: 'Usar objeto',
                cancelButtonText: 'Cancelar',
            });

            if (!itemSeleccionado || !accionesHabilitadas) return;
            usarItemTurno(itemSeleccionado);
        };

        function setLog(msg) {
            logText.textContent = msg;
        }

        function actualizarHP(bar, nums, actual, maximo) {
            const pct = Math.max(0, (actual / maximo) * 100);
            bar.style.width = pct + '%';
            bar.classList.remove('hp-warning', 'hp-danger');
            if (pct <= 20) bar.classList.add('hp-danger');
            else if (pct <= 50) bar.classList.add('hp-warning');
            nums.textContent = `${Math.max(0, actual)} / ${maximo}`;
        }

        function obtenerItemsUsables() {
            if (hpJugador >= hpMaxJugador) return [];

            return Object.entries(ITEM_DEFINITIONS)
                .filter(([clave]) => (inventario[clave] || 0) > 0);
        }

        function hayItemsUsables() {
            return obtenerItemsUsables().length > 0;
        }

        function renderMovimientos() {
            movesGrid.innerHTML = '';
            movimientosJugador.forEach((mov) => {
                const btn = document.createElement('button');
                btn.className = 'battle-move-btn';
                const color = TYPE_COLORS[mov.tipo] || '#888';
                btn.style.borderLeftColor = color;
                btn.innerHTML = `
                    <span style="display:block;font-size:0.45rem">${mov.nombre}</span>
                    <span class="battle-move-type" style="color:${color}">${traducirTipoUI(mov.tipo)}</span>&nbsp;
                    <span class="battle-move-power">💥${mov.poder}</span><br>
                    <span class="battle-move-pp">PP: ${mov.ppActual}/${mov.pp}</span>
                `;
                btn.disabled = !accionesHabilitadas || mov.ppActual <= 0;
                btn.setAttribute('aria-label', `${mov.nombre} — Tipo ${traducirTipoUI(mov.tipo)}, Poder ${mov.poder}, PP ${mov.ppActual}`);
                btn.addEventListener('click', () => {
                    if (!accionesHabilitadas || mov.ppActual <= 0) return;
                    ejecutarTurnoJugador(mov);
                });
                movesGrid.appendChild(btn);
            });
        }

        function renderBotonesUtilidad() {
            const totalPociones = inventario.potion || 0;
            const totalSuper = inventario.superPotion || 0;
            btnItems.innerHTML = `Items 🎒<br>P:${totalPociones} SP:${totalSuper}`;
            btnItems.disabled = !accionesHabilitadas || !hayItemsUsables();
            btnItems.setAttribute('aria-label', `Usar objeto. Pociones ${totalPociones}, Super Pociones ${totalSuper}`);
            btnHuir.disabled = !accionesHabilitadas;
        }

        function bloquear() {
            accionesHabilitadas = false;
            renderMovimientos();
            renderBotonesUtilidad();
        }

        function desbloquear() {
            const todosSinPP = movimientosJugador.every(m => m.ppActual <= 0);
            if (todosSinPP) {
                movimientosJugador.splice(0, movimientosJugador.length,
                    { ...MOVIMIENTO_FORCEJEO, ppActual: MOVIMIENTO_FORCEJEO.pp });
            }
            accionesHabilitadas = true;
            renderMovimientos();
            renderBotonesUtilidad();
        }

        function usarItemTurno(claveItem) {
            const item = ITEM_DEFINITIONS[claveItem];
            if (!item || (inventario[claveItem] || 0) <= 0 || hpJugador >= hpMaxJugador) return;

            bloquear();
            inventario[claveItem] = Math.max(0, (inventario[claveItem] || 0) - 1);
            const vidaAntes = hpJugador;
            hpJugador = Math.min(hpMaxJugador, hpJugador + item.curacion);
            const curacionAplicada = hpJugador - vidaAntes;

            actualizarHP(playerHpBar, playerHpNums, hpJugador, hpMaxJugador);
            animarSprite(playerSprite, 'battle-winner');
            setLog(`${jugador.nombre} usó ${item.nombre} y recuperó ${curacionAplicada} HP.`);

            setTimeout(ejecutarTurnoEnemigo, 1200);
        }

        function ejecutarTurnoJugador(mov) {
            bloquear();
            mov.ppActual = Math.max(0, mov.ppActual - 1);

            const tiposEnemigo = enemigo.tipos || [];
            const mult  = calcularMultiplicador([mov.tipo], tiposEnemigo);
            const dano  = calcularDano(mov.poder, jugador.ataque, mult);

            if (mult > mejorMultJugador) mejorMultJugador = mult;
            totalAtaqueJugador += dano;
            hpEnemigo -= dano;

            actualizarHP(enemyHpBar, enemyHpNums, hpEnemigo, hpMaxEnemigo);
            animarSprite(playerSprite, 'battle-attack');
            animarSprite(enemySprite, 'battle-hit');
            playAttackSound();

            let msg = `${jugador.nombre} usó ${mov.nombre}`;
            if (mult >= 2) msg += ` — ¡Es muy eficaz! (×${mult})`;
            msg += `. ¡${dano} de daño!`;
            setLog(msg);

            if (hpEnemigo <= 0) {
                setTimeout(() => terminarBatalla(true), 900);
                return;
            }
            setTimeout(ejecutarTurnoEnemigo, 1300);
        }

        function ejecutarTurnoEnemigo() {
            const movsDisponibles = movimientosEnemigo.filter(m => m.ppActual > 0);
            const movEnemigo = movsDisponibles.length > 0
                ? movsDisponibles[Math.floor(Math.random() * movsDisponibles.length)]
                : { ...MOVIMIENTO_FORCEJEO, ppActual: 1 };

            movEnemigo.ppActual = Math.max(0, movEnemigo.ppActual - 1);

            const tiposJugador = jugador.tiposApi || [];
            const mult  = calcularMultiplicador([movEnemigo.tipo], tiposJugador);
            const dano  = calcularDano(movEnemigo.poder, enemigo.ataque, mult);

            if (mult > mejorMultEnemigo) mejorMultEnemigo = mult;
            totalAtaqueEnemigo += dano;
            hpJugador -= dano;

            actualizarHP(playerHpBar, playerHpNums, hpJugador, hpMaxJugador);
            animarSprite(enemySprite, 'battle-attack');
            animarSprite(playerSprite, 'battle-shake');
            playAttackSound();

            let msg = `${enemigo.nombre} usó ${movEnemigo.nombre}`;
            if (mult >= 2) msg += ` — ¡Es muy eficaz! (×${mult})`;
            msg += `. ¡${dano} de daño!`;
            setLog(msg);

            if (hpJugador <= 0) {
                setTimeout(() => terminarBatalla(false), 900);
                return;
            }
            setLog(msg + ` ¿Qué hará ${jugador.nombre}?`);
            desbloquear();
        }

        function animarSprite(sprite, clase) {
            sprite.classList.remove(clase);
            void sprite.offsetWidth;
            sprite.classList.add(clase);
            sprite.addEventListener('animationend', () => sprite.classList.remove(clase), { once: true });
        }

        function limpiarPantalla() {
            pantalla.style.display = 'none';
            playerSprite.classList.remove('battle-winner', 'battle-shake', 'battle-attack');
            enemySprite.classList.remove('battle-winner', 'battle-shake', 'battle-attack');
            btnHuir.style.display = '';
            accionesHabilitadas = true;
            renderBotonesUtilidad();
        }

        function terminarBatalla(gano, huyo = false) {
            if (huyo) {
                limpiarPantalla();
                mostrarAlerta('Escapaste del combate...', 'info');
                onFinished(null, {});
                return;
            }

            if (gano) {
                animarSprite(playerSprite, 'battle-winner');
                setLog(`🏆 ¡${jugador.nombre} derrotó a ${enemigo.nombre}!`);
                playVictorySound();
            } else {
                animarSprite(enemySprite, 'battle-winner');
                setLog(`💀 ${jugador.nombre} fue derrotado por ${enemigo.nombre}...`);
                playDefeatSound();
            }
            btnHuir.style.display = 'none';
            btnItems.disabled = true;

            setTimeout(() => {
                limpiarPantalla();

                const titulo = gano
                    ? `🔥 ¡${jugador.nombre} ganó la batalla!`
                    : `💀 ${jugador.nombre} fue derrotado...`;
                const etiquetaEnemiga = enemigo.esRival
                    ? `${enemigo.entrenador} · ${enemigo.nombre}`
                    : enemigo.nombre;

                Swal.fire({
                    title: titulo,
                    html: `
                        <div style="display:flex;justify-content:space-around;align-items:center;gap:10px;flex-wrap:wrap">
                            <div>
                                <img src="${jugador.imagen}" alt="${jugador.nombre}" width="90"
                                     class="${gano ? 'battle-winner' : 'battle-shake'}"
                                     style="image-rendering:pixelated">
                                <p><strong>${jugador.nombre}</strong></p>
                                <p style="font-size:0.65em">Daño total: ${totalAtaqueJugador}</p>
                            </div>
                            <h2>VS</h2>
                            <div>
                                <img src="${enemigo.imagen}" alt="${enemigo.nombre}" width="90"
                                     class="${gano ? 'battle-shake' : 'battle-winner'}"
                                     style="image-rendering:pixelated">
                                <p><strong>${etiquetaEnemiga}</strong></p>
                                <p style="font-size:0.65em">Daño total: ${totalAtaqueEnemigo}</p>
                            </div>
                        </div>
                    `,
                    icon: gano ? 'success' : 'error',
                    confirmButtonText: 'Continuar',
                }).then(() => {
                    onFinished(gano, {
                        ataqueJugador:      totalAtaqueJugador,
                        ataqueEnemigo:      totalAtaqueEnemigo,
                        multJugador:        mejorMultJugador,
                        multEnemigo:        mejorMultEnemigo,
                    });
                });
            }, 1500);
        }
    }
