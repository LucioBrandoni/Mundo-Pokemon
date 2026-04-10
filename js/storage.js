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
