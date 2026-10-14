// Obtener los datos del usuario logueado o registrado desde localStorage
function obtenerDatosPaciente() {
  const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado")) || JSON.parse(localStorage.getItem("usuarioRegistrado"));
  
  if (!usuarioSesion) {
      return {
          nombreCompleto: "Sin Registrar",
          fechaNacimiento: "--",
          diagnostico: "--",
          email: "--",
          medicamentosHabituales: [],
          observaciones: "Ninguna"
      };
  }
  
  return usuarioSesion;
}

let pacienteDatos = obtenerDatosPaciente();

function mostrarPaciente() {
  document.getElementById("paciente-nombre").textContent = pacienteDatos.nombreCompleto || "--";
  document.getElementById("paciente-nacimiento").textContent = pacienteDatos.fechaNacimiento || "--";
  document.getElementById("paciente-diagnostico").textContent = pacienteDatos.diagnostico || "--";
  document.getElementById("paciente-contacto").textContent = pacienteDatos.email || "--";
  document.getElementById("paciente-observaciones").textContent = pacienteDatos.observaciones || "Ninguna";

  // Renderizar tarjetas de medicamentos
  const contenedorMed = document.getElementById("contenedor-medicamentos");
  contenedorMed.innerHTML = "";

  let listaMed = pacienteDatos.medicamentosHabituales;

  if (typeof listaMed === "string") {
      listaMed = listaMed.split("-").map(m => m.trim()).filter(m => m.length > 0);
  }

  if (!listaMed || listaMed.length === 0) {
      contenedorMed.innerHTML = `<p class="valor">Sin medicamentos registrados</p>`;
  } else {
      listaMed.forEach((med, index) => {
          const tarjeta = document.createElement("div");
          tarjeta.className = "tarjeta-medicamento";
          tarjeta.innerHTML = `
              <div class="info-medicamento">
                  <i class="fa-solid fa-capsules icono-pildora"></i>
                  <span class="valor-medicamento" id="med-val-${index}">${med}</span>
              </div>
              <i class="fa-solid fa-pen-to-square icono-editar-campo"></i>
          `;
          contenedorMed.appendChild(tarjeta);
      });
  }
}

mostrarPaciente();

let editando = false;
const boton = document.getElementById("btn-editar");

boton.addEventListener("click", function() {
  let listaMed = pacienteDatos.medicamentosHabituales;
  if (typeof listaMed === "string") {
      listaMed = listaMed.split("-").map(m => m.trim()).filter(m => m.length > 0);
  }

  if (!editando) {
      // Habilitar edición mediante campos input
      document.getElementById("paciente-nombre").innerHTML = `<input type="text" id="input-nombre" value="${pacienteDatos.nombreCompleto || ''}">`;
      document.getElementById("paciente-nacimiento").innerHTML = `<input type="date" id="input-nacimiento" value="${pacienteDatos.fechaNacimiento || ''}">`;
      document.getElementById("paciente-diagnostico").innerHTML = `<input type="text" id="input-diagnostico" value="${pacienteDatos.diagnostico || ''}">`;
      document.getElementById("paciente-contacto").innerHTML = `<input type="email" id="input-contacto" value="${pacienteDatos.email || ''}">`;
      document.getElementById("paciente-observaciones").innerHTML = `<input type="text" id="input-observaciones" value="${pacienteDatos.observaciones || ''}">`;

      // Inputs para medicamentos
      const contenedorMed = document.getElementById("contenedor-medicamentos");
      contenedorMed.innerHTML = "";
      
      if (listaMed && listaMed.length > 0) {
          listaMed.forEach((med, index) => {
              const tarjeta = document.createElement("div");
              tarjeta.className = "tarjeta-medicamento";
              tarjeta.innerHTML = `
                  <div class="info-medicamento" style="width: 100%;">
                      <i class="fa-solid fa-capsules icono-pildora"></i>
                      <input type="text" class="input-med-item" value="${med}">
                  </div>
              `;
              contenedorMed.appendChild(tarjeta);
          });
      } else {
          contenedorMed.innerHTML = `<input type="text" id="input-med-nuevo" placeholder="Ej: Ibuprofeno - Paracetamol">`;
      }

      boton.textContent = "Guardar Cambios";
      editando = true;

  } else {
      // Guardar valores ingresados
      pacienteDatos.nombreCompleto = document.getElementById("input-nombre").querySelector("input") ? document.getElementById("input-nombre").querySelector("input").value : document.getElementById("input-nombre").value;
      pacienteDatos.fechaNacimiento = document.getElementById("input-nacimiento").value;
      pacienteDatos.diagnostico = document.getElementById("input-diagnostico").value;
      pacienteDatos.email = document.getElementById("input-contacto").value;
      pacienteDatos.observaciones = document.getElementById("input-observaciones").value;

      // Leer inputs de medicamentos
      const inputsMed = document.querySelectorAll(".input-med-item");
      if (inputsMed.length > 0) {
          const nuevosMeds = [];
          inputsMed.forEach(input => {
              if (input.value.trim()) nuevosMeds.push(input.value.trim());
          });
          pacienteDatos.medicamentosHabituales = nuevosMeds;
      } else {
          const inputNuevo = document.getElementById("input-med-nuevo");
          if (inputNuevo && inputNuevo.value.trim()) {
              pacienteDatos.medicamentosHabituales = inputNuevo.value.split("-").map(m => m.trim()).filter(m => m.length > 0);
          }
      }

      // Persistir cambios en localStorage
      localStorage.setItem("usuarioLogueado", JSON.stringify(pacienteDatos));
      localStorage.setItem("usuarioRegistrado", JSON.stringify(pacienteDatos));

      // Actualizar la vista
      mostrarPaciente();

      boton.textContent = "Editar Ficha de Datos";
      editando = false;
  }
});