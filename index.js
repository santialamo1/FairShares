let integrantes = [];
let saldos = [];

function agregarDatos() {
  let integranteInput = document.getElementById("agregarIntegrante");
  let saldoInput = document.getElementById("agregarSaldo");

  let integrante = integranteInput.value;
  let saldo = parseFloat(saldoInput.value);

  if (integrante && !isNaN(saldo)) {
    integrantes.push(integrante);
    saldos.push(saldo);

    // Actualizar listas
    actualizarListas();

    // Limpiar inputs
    integranteInput.value = "";
    saldoInput.value = "";
  }
}

function actualizarListas() {
  let integrantesList = document.getElementById("integrantes");
  let saldosList = document.getElementById("saldos");

  // Limpiar listas
  integrantesList.innerHTML = "";
  saldosList.innerHTML = "";

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

function mostrarResultadoEnInterfaz(resultado) {
  let resultadoElement = document.getElementById("resultado");
  resultadoElement.innerHTML =  `<p>Aqui tienes los resultados:</p>
                                <p>Total: $${resultado.total}</p>
                                <p>Integrantes: ${
                                  resultado.cantidadIntegrantes
                                }</p>
                                <p>Cada uno debe poner: $${
                                  resultado.contribucionIndividual
                                }</p>
                                <p>Deudas:</p>
                                <ul>${resultado.deudas
                                  .map((deuda) => `<li>${deuda}</li>`)
                                  .join("")}</ul>`;
  let contenedorResultado = document.querySelector(".resultado");
  contenedorResultado.style.border = '1px solid black';
}

/* Elimine los onclick de mi html para usar EventListeners */
document.getElementById("btn-limpiar").addEventListener("click", limpiarLista);
document.getElementById("btn-calcular").addEventListener("click", calcular);
document.getElementById("btn-agregar").addEventListener("click", agregarDatos);