// ==========================================
// MOCK BACKEND Y GUARDADO GLOBAL
// ==========================================
async function apiGuardarRegistro(nuevoRegistro) {
    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioSesion")) || { id: "invitado" };
    nuevoRegistro.usuarioId = usuarioActivo.id;

    const registrosBD = JSON.parse(localStorage.getItem("registrosMESH")) || [];
    registrosBD.push(nuevoRegistro);
    localStorage.setItem("registrosMESH", JSON.stringify(registrosBD));

    return { status: 200, message: "Guardado OK" };
}

// Restricción de inputs numéricos
function soloEnteros(input, maxDigitos, maximo) {
    if (!input) return;
    input.addEventListener("keydown", function (e) {
        if (["-", "+", "e", "E", ".", ","].includes(e.key)) e.preventDefault();
    });

    input.addEventListener("input", function () {
        let valor = input.value.replace(/\D/g, "").slice(0, maxDigitos);
        if (maximo && Number(valor) > maximo) valor = String(maximo);
        input.value = valor;
    });
}

// Manejo de autocompletado de tipos de crisis
const CLAVE_TIPOS = "tiposCrisis";
function obtenerTiposRecientes() {
    const guardados = localStorage.getItem(CLAVE_TIPOS);
    return guardados ? JSON.parse(guardados) : [];
}

function renderTipos() {
    const listaTipos = document.getElementById("lista-tipos");
    if (!listaTipos) return;
    listaTipos.innerHTML = "";
    obtenerTiposRecientes().forEach(tipo => {
        const opcion = document.createElement("option");
        opcion.value = tipo;
        listaTipos.appendChild(opcion);
    });
}

function recordarTipo(tipo) {
    let tipos = obtenerTiposRecientes().filter(t => t.toLowerCase() !== tipo.toLowerCase());
    tipos.unshift(tipo);
    localStorage.setItem(CLAVE_TIPOS, JSON.stringify(tipos.slice(0, 10)));
    renderTipos();
}

// ==========================================
// EVENTOS Y LÓGICA DE BOTONES
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const modalCrisis = document.getElementById("modal-crisis");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const botonesRegistro = document.querySelectorAll(".registro-circulo");

    const inputTipo = document.getElementById("tipo-crisis");
    const inputDia = document.getElementById("dia");
    const inputMes = document.getElementById("mes");
    const inputAnio = document.getElementById("anio");
    const inputHora = document.getElementById("hora-crisis");
    const btnsPeriodo = document.querySelectorAll(".btn-periodo");
    const inputObs = document.getElementById("observaciones");
    const botonGuardar = document.getElementById("guardar");

    let periodoSeleccionado = "";

    soloEnteros(inputDia, 2, 31);
    soloEnteros(inputMes, 2, 12);
    soloEnteros(inputAnio, 4, null);
    renderTipos();

    // Lógica para botones AM / PM
    btnsPeriodo.forEach(btn => {
        btn.addEventListener("click", () => {
            btnsPeriodo.forEach(b => b.classList.remove("seleccionado"));
            btn.classList.add("seleccionado");
            periodoSeleccionado = btn.dataset.periodo;
        });
    });

    // Abrir Modal al tocar Crisis
    botonesRegistro.forEach(boton => {
        boton.addEventListener("click", () => {
            if (boton.dataset.tipo === "crisis") {
                modalCrisis.classList.remove("oculto");
            }
        });
    });

    // Cerrar Modal
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", () => {
            modalCrisis.classList.add("oculto");
        });
    }

    // Guardar Registro con Validación Completa
    if (botonGuardar) {
        botonGuardar.addEventListener("click", async () => {
            const tipoVal = inputTipo.value.trim();
            const diaVal = inputDia.value.trim();
            const mesVal = inputMes.value.trim();
            const anioVal = inputAnio.value.trim();
            const horaVal = inputHora.value.trim();
            const obsVal = inputObs.value.trim();

            // Validaciones estrictas antes de guardar
            if (!tipoVal) {
                alert("Escribí o seleccioná el tipo de crisis.");
                return;
            }
            if (!diaVal || Number(diaVal) < 1 || Number(diaVal) > 31) {
                alert("Ingresá un día válido (1 a 31).");
                return;
            }
            if (!mesVal || Number(mesVal) < 1 || Number(mesVal) > 12) {
                alert("Ingresá un mes válido (1 a 12).");
                return;
            }
            if (anioVal.length !== 4) {
                alert("Ingresá un año válido de 4 dígitos.");
                return;
            }
            if (!horaVal) {
                alert("Ingresá la hora de la crisis.");
                return;
            }
            if (!periodoSeleccionado) {
                alert("Seleccioná si la hora fue AM o PM.");
                return;
            }

            const diaFormat = String(diaVal).padStart(2, '0');
            const mesFormat = String(mesVal).padStart(2, '0');

            const nuevoRegistro = {
                id: Date.now(),
                fechaISO: `${anioVal}-${mesFormat}-${diaFormat}`,
                hora: `${horaVal} ${periodoSeleccionado}`,
                tipo: "Crisis",
                info: `Crisis: ${tipoVal}${obsVal ? ` - ${obsVal}` : ''}`,
                detalles: {
                    tipoCrisis: tipoVal,
                    observaciones: obsVal,
                    periodo: periodoSeleccionado
                }
            };

            await apiGuardarRegistro(nuevoRegistro);
            recordarTipo(tipoVal);
            window.location.href = "historial.html";
        });
    }
});