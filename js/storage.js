// Funciones de almacenamiento local


export function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function obtenerDeStorage(clave) {
  const dato = localStorage.getItem(clave);
  return dato ? JSON.parse(dato) : null;
}
