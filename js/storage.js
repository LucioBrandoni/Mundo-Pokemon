// Funciones para manejo del localStorage

export function guardarEnStorage(clave, valor) {
  if (typeof valor === 'string') {
    localStorage.setItem(clave, valor);
  } else {
    localStorage.setItem(clave, JSON.stringify(valor));
  }
}

export function obtenerDeStorage(clave) {
  const dato = localStorage.getItem(clave);
  if (!dato) return null;
  
  try {
    return JSON.parse(dato);
  } catch (e) {
    // Si no se puede parsear como JSON, devolver el valor como string
    return dato;
  }
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
  localStorage.removeItem('historial');
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
  localStorage.setItem(RECORD_KEY, JSON.stringify(record));
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
