
// Modales visuales con SweetAlert2
export function mostrarConfirmacion(texto, callback) {
  Swal.fire({
    title: "Confirmar",
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


