let integrantes = [];
let saldos = [];

function agregarDatos() {
  let integranteInput = document.getElementById("agregarIntegrante");
  let saldoInput = document.getElementById("agregarSaldo");

  let integrante = integranteInput.value;
  let saldo = parseFloat(saldoInput.value);

  if (integrantes.includes(integrante)) {
    Swal.fire({
      title: "Ese nombre ya existe!",
      text: "Debes ingresar un nombre distinto!",
      icon: "error"
    });
    return;
  }

  if (integrante && !isNaN(saldo)) {
    integrantes.push(integrante);
    saldos.push(saldo);

    // Actualizar listas
    actualizarListas();

    // Limpiar inputs
    integranteInput.value = "";
    saldoInput.value = "";

    document.getElementById("btn-calcular").disabled = integrantes.length < 2;
  }
}

function actualizarListas() {
  let integrantesList = document.getElementById("integrantes");
  let saldosList = document.getElementById("saldos");

  // Limpiar listas
  integrantesList.innerHTML = "";
  saldosList.innerHTML = "";

  //Si la lista tiene integrantes habilita el boton
  document.getElementById("btn-calcular").disabled = integrantes.length < 2;

  // Actualizar listas con los nuevos datos
  for (let i = 0; i < integrantes.length; i++) {
    let integranteItem = document.createElement("li");
    integranteItem.textContent = integrantes[i];
    integrantesList.appendChild(integranteItem);

    let saldoItem = document.createElement("li");
    saldoItem.textContent = `$${saldos[i].toFixed(2)}`;
    saldosList.appendChild(saldoItem);
  }
}

function limpiarLista() {
  integrantes.length = 0;
  saldos.length = 0;
  actualizarListas();

  //Limpiar resultados
  limpiarResultados();
}

function limpiarResultados() {
  let resultadoElement = document.getElementById("resultado");
  resultadoElement.innerHTML = "";
  let contenedorResultado = document.querySelector(".resultado");
  contenedorResultado.style.border = 'none';

}

function calcular() {
  let totalGastado = saldos.reduce((total, saldo) => total + saldo, 0);
  let cantidadIntegrantes = integrantes.length;
  let contribucionIndividual = totalGastado / cantidadIntegrantes;

  let ajustes = [];
  let deudas = [];

  // Calcular ajustes iniciales
  for (let i = 0; i < cantidadIntegrantes; i++) {
    ajustes.push(saldos[i] - contribucionIndividual);
  }

  // Realizar ajustes adicionales
  for (let i = 0; i < cantidadIntegrantes; i++) {
    while (ajustes[i] > 0) {
      let transferenciaRealizada = false;

      for (let j = 0; j < cantidadIntegrantes; j++) {
        if (ajustes[j] < 0) {
          const montoTransferencia = Math.min(Math.abs(ajustes[i]), Math.abs(ajustes[j]));

          // Ajustar saldos y generar deuda
          ajustes[i] -= montoTransferencia;
          ajustes[j] += montoTransferencia;

          // Generar deuda directamente sin invertir quién debe a quién
          const deudaAdicional = `${integrantes[j]} le debe $${montoTransferencia.toFixed(2)} a ${integrantes[i]}`;
          deudas.push(deudaAdicional);

          transferenciaRealizada = true;
          if (ajustes[i] === 0) {
            break;
          }
        }
      }

      // Si no se realizó ninguna transferencia, no tiene sentido seguir ajustando
      if (!transferenciaRealizada) {
        break;
      }
    }
  }

  let resultado = {
    total: totalGastado.toFixed(2),
    cantidadIntegrantes,
    contribucionIndividual: contribucionIndividual.toFixed(2),
    deudas,
  };

  mostrarResultadoEnInterfaz(resultado);

  return resultado;
}
function obtenerTextoResultado(resultado) {
    return `Aqui tienes los resultados:
  Total: $${resultado.total}
  Integrantes: ${resultado.cantidadIntegrantes}
  Cada uno debe poner: $${resultado.contribucionIndividual}
  Deudas:
  ${resultado.deudas.map((deuda) => `- ${deuda}`).join("\n")}`;
  }
  
  function mostrarResultadoEnInterfaz(resultado) {
    let textoResultados = obtenerTextoResultado(resultado);
  
    // Resultados en una alerta de SweetAlert
    Swal.fire({
      title: "¡Resultados!",
      text: textoResultados,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Copiar",
      cancelButtonText: "Cerrar",
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Copiar al portapapeles
        copiarAlPortapapeles(textoResultados);
  
        Swal.fire({
          title: "¡Copiado!",
          text: "Los resultados han sido copiados al portapapeles.",
          icon: "success",
          showDenyButton: true,
          denyButtonText: "Compartir por WhatsApp"
        }).then((whatsAppResult) => {
          if (whatsAppResult.isDenied) {
            // Compartir por WhatsApp
            compartirPorWhatsApp(textoResultados);
          }
        });
      }
    });
  }
  
  // Función para copiar al portapapeles
  function copiarAlPortapapeles(texto) {
    let campoTexto = document.createElement("textarea");
    campoTexto.value = texto;
    campoTexto.setAttribute("readonly", "");
    campoTexto.style.position = "absolute";
    campoTexto.style.left = "-9999px";
    document.body.appendChild(campoTexto);
    campoTexto.select();
    document.execCommand("copy");
    document.body.removeChild(campoTexto);
  }
  
  // Función para compartir por WhatsApp
  function compartirPorWhatsApp(texto) {
    let urlWhatsApp = `https://wa.me/`;
    window.open(urlWhatsApp, "_blank");
  }
document.getElementById("btn-calcular").disabled = integrantes.length < 2;

/* Elimine los onclick de mi html para usar EventListeners */
document.getElementById("btn-limpiar").addEventListener("click", limpiarLista);
document.getElementById("btn-calcular").addEventListener("click", calcular);
document.getElementById("btn-agregar").addEventListener("click", agregarDatos);