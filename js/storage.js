// Funciones para manejo del localStorage y sessionStorage

function serializarValor(valor) {
  return typeof valor === 'string' ? valor : JSON.stringify(valor);
}

function parsearValorGuardado(dato) {
  if (!dato) return null;

  try {
    return JSON.parse(dato);
  } catch {
    // Si no se puede parsear como JSON, devolver el valor como string
    return dato;
  }
}

function guardarEn(store, clave, valor) {
  try {
    store.setItem(clave, serializarValor(valor));
  } catch (error) {
    console.warn(`No se pudo guardar la clave "${clave}" en storage:`, error);
  }
}

function obtenerDe(store, clave) {
  try {
    return parsearValorGuardado(store.getItem(clave));
  } catch (error) {
    console.warn(`No se pudo leer la clave "${clave}" de storage:`, error);
    return null;
  }
}

function removerDe(store, clave) {
  try {
    store.removeItem(clave);
  } catch (error) {
    console.warn(`No se pudo eliminar la clave "${clave}" de storage:`, error);
  }
}

export function guardarEnStorage(clave, valor) {
  guardarEn(localStorage, clave, valor);
}

export function obtenerDeStorage(clave) {
  return obtenerDe(localStorage, clave);
}

export function guardarEnSessionStorage(clave, valor) {
  guardarEn(sessionStorage, clave, valor);
}

export function obtenerDeSessionStorage(clave) {
  return obtenerDe(sessionStorage, clave);
}

export function removerDeSessionStorage(clave) {
  removerDe(sessionStorage, clave);
}

// Historial de batallas (máximo 20 registros, más reciente primero)

export function guardarBatalla(batalla) {
  const historial = obtenerHistorial();
  historial.unshift(batalla);
  if (historial.length > 20) historial.splice(20);
  localStorage.setItem('historial', JSON.stringify(historial));
}

export function obtenerHistorial() {
  try {
    return JSON.parse(localStorage.getItem('historial')) || [];
  } catch {
    return [];
  }
}

export function limpiarHistorial() {
  removerDe(localStorage, 'historial');
}

// Récord histórico (persiste entre partidas)

const RECORD_KEY = 'record';

export function obtenerRecord() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY)) || {
      mayorRacha: 0, fechaMayorRacha: null,
      mayorNivel: 0, fechaMayorNivel: null,
    };
  } catch {
    return { mayorRacha: 0, fechaMayorRacha: null, mayorNivel: 0, fechaMayorNivel: null };
  }
}

export function guardarRecord(record) {
  guardarEn(localStorage, RECORD_KEY, record);
}

export function actualizarRecord(rachaActual, nivelActual) {
  const record = obtenerRecord();
  const hoy = new Date().toLocaleDateString('es-AR');
  let actualizado = false;

  if (rachaActual > record.mayorRacha) {
    record.mayorRacha = rachaActual;
    record.fechaMayorRacha = hoy;
    actualizado = true;
  }

  if (nivelActual > record.mayorNivel) {
    record.mayorNivel = nivelActual;
    record.fechaMayorNivel = hoy;
    actualizado = true;
  }

  if (actualizado) guardarRecord(record);
  return record;
}
