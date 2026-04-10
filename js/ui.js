
// Funciones de interfaz usando SweetAlert2

export function mostrarConfirmacion(texto, callback, titulo = "Confirmar") {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No"
  }).then(result => callback(result.isConfirmed));
}

export function mostrarAlerta(texto, tipo = "info") {
  Swal.fire({
    icon: tipo,
    text: texto
  });
}


