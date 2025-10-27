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
