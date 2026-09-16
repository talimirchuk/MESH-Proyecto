// Cuenta ficticia (datos que después vienen del back)
let pacienteDatos = {
    nombre: "Juan Pérez",
    nacimiento: "12/12",
    diagnostico: "Epilepsia focal",
    contacto: "paciente@gmail.com",
    observaciones: "Ninguna"
  };

function mostrarPaciente (){ 
document.getElementById("paciente-nombre").textContent = pacienteDatos.nombre;
document.getElementById("paciente-diagnostico").textContent = pacienteDatos.diagnostico;
document.getElementById("paciente-nacimiento").textContent = pacienteDatos.nacimiento;
document.getElementById("paciente-contacto").textContent = pacienteDatos.contacto;
document.getElementById("paciente-observaciones").textContent = pacienteDatos.observaciones;
}
mostrarPaciente();

let editando = false;
const boton = document.getElementById("btn-editar");

boton.addEventListener("click", function() {
    if (!editando) {
      // poner <input> con los datos actuales 
      document.getElementById("paciente-nombre").innerHTML = `<input type="text" id="input-nombre" value="${pacienteDatos.nombre}">`;
      document.getElementById("paciente-nacimiento").innerHTML = `<input type="text" id="input-nacimiento" value="${pacienteDatos.nacimiento}">`;
      document.getElementById("paciente-diagnostico").innerHTML = `<input type="text" id="input-diagnostico" value="${pacienteDatos.diagnostico}">`;
      document.getElementById("paciente-contacto").innerHTML = `<input type="text" id="input-contacto" value="${pacienteDatos.contacto}">`;
      document.getElementById("paciente-observaciones").innerHTML = `<input type="text" id="input-observaciones" value="${pacienteDatos.observaciones}">`;
  
      boton.textContent = "Guardar cambios";
      editando = true;
  
    } else {
      // Leer el .value de cada input y guardarlo en pacienteDatos
  
      pacienteDatos.nombre = document.getElementById("input-nombre").value;
      pacienteDatos.nacimiento = document.getElementById("input-nacimiento").value;
      pacienteDatos.diagnostico = document.getElementById("input-diagnostico").value;
      pacienteDatos.contacto = document.getElementById("input-contacto").value;
      pacienteDatos.observaciones = document.getElementById("input-observaciones").value;
  
      //pantalla con los nuevos valores
      mostrarPaciente();
  
      boton.textContent = "Editar ficha de datos";
      editando = false;
    }
  });