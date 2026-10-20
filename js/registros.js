// futuro BACKEND 
async function apiGuardarRegistro(nuevoRegistro) {
    // Leemos 'usuarioLogueado' (la clave real de tu pantalla)
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado")) 
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado")) 
                       || { email: "invitado" };

    // Asignamos el email del usuario activo como identificador único
    nuevoRegistro.usuarioEmail = usuarioActivo.email;

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

// EVENTOS Y LÓGICA DE BOTONES

document.addEventListener("DOMContentLoaded", () => {
    const modalCrisis = document.getElementById("modal-crisis");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const botonesRegistro = document.querySelectorAll(".registro-circulo");

    //CRISIS
    const inputTipo = document.getElementById("tipo-crisis");
    const inputDia = document.getElementById("dia");
    const inputMes = document.getElementById("mes");
    const inputAnio = document.getElementById("anio");
    const inputHora = document.getElementById("hora-crisis");
    const btnsPeriodo = document.querySelectorAll(".btn-periodo");
    const inputObs = document.getElementById("observaciones");
    const botonGuardar = document.getElementById("guardar");
    
    //MENSTRUACIÓN
    const modalMenstruacion = document.getElementById("modal-menstruacion");
    const btnCerrarMenstruacion = document.getElementById("btn-cerrar-menstruacion");

    const inDiaIni = document.getElementById("inicio-dia");
    const inMesIni = document.getElementById("inicio-mes");
    const inAnioIni = document.getElementById("inicio-anio");

    const inDiaFin = document.getElementById("fin-dia");
    const inMesFin = document.getElementById("fin-mes");
    const inAnioFin = document.getElementById("fin-anio");

    const inObsMenstruacion = document.getElementById("obs-menstruacion");
    const btnGuardarMenstruacion = document.getElementById("guardar-menstruacion");

    //MEDICACIÓN
    const modalMedicacion = document.getElementById("modal-medicacion");
    const btnCerrarMedicacion = document.getElementById("btn-cerrar-medicacion");

    const selectCategoriaMed = document.getElementById("tipo-med-categoria");
    const inputNombreMed = document.getElementById("nombre-med");
    const inputDosisMed = document.getElementById("dosis-med");
    const inputHoraMed = document.getElementById("hora-med");
    const btnsPeriodoMed = document.querySelectorAll(".btn-periodo-med");

    const inDiaMed = document.getElementById("med-dia");
    const inMesMed = document.getElementById("med-mes");
    const inAnioMed = document.getElementById("med-anio");
    const btnGuardarMed = document.getElementById("guardar-medicacion");
    let periodoMedSeleccionado = "";

    //SUEÑO
    const modalSueno = document.getElementById("modal-sueno");
    const btnCerrarSueno = document.getElementById("btn-cerrar-sueno");
    const inputHoraDormiste = document.getElementById("hora-dormiste");
    const inputHoraDespertaste = document.getElementById("hora-despertaste");
    const btnsPeriodoDormiste = document.querySelectorAll(".btn-periodo-dormiste");
    const btnsPeriodoDespertaste = document.querySelectorAll(".btn-periodo-despertaste");
    const btnMenos = document.getElementById("btn-menos");
    const btnMas = document.getElementById("btn-mas");
    const valorContador = document.getElementById("valor-contador");
    const btnGuardarSueno = document.getElementById("guardar-sueno");

    // ESTADO DE ÁNIMO
    const modalAnimo = document.getElementById("modal-animo");
    const btnCerrarAnimo = document.getElementById("btn-cerrar-animo");
    const cuadradosEmocion = document.querySelectorAll(".cuadrado-emocion");
    const rangeIntensidadAnimo = document.getElementById("range-intensidad-animo");
    const btnGuardarAnimo = document.getElementById("guardar-animo");

    let emocionSeleccionada = "normal/calmado";

    let periodoDormiste = "";
    let periodoDespertaste = "";
    let contadorDesperto = 0;

    let periodoSeleccionado = "";

    //RESTRICCIONES CRISIS
    soloEnteros(inputDia, 2, 31);
    soloEnteros(inputMes, 2, 12);
    soloEnteros(inputAnio, 4, null);
    renderTipos();

    //RESTRICCIONES MENSTRUACION
    soloEnteros(inDiaIni, 2, 31);
    soloEnteros(inMesIni, 2, 12);
    soloEnteros(inAnioIni, 4, null);
    soloEnteros(inDiaFin, 2, 31);
    soloEnteros(inMesFin, 2, 12);
    soloEnteros(inAnioFin, 4, null);

    //RESTRICCIONES MEDICACION
    soloEnteros(inDiaMed, 2, 31);
    soloEnteros(inMesMed, 2, 12);
    soloEnteros(inAnioMed, 4, null);

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
            else if (boton.dataset.tipo === "menstruacion") {
                modalMenstruacion.classList.remove("oculto");
            }
            else if (boton.dataset.tipo === "medicacion") {
                modalMedicacion.classList.remove("oculto");
            }
            else if (boton.dataset.tipo === "sueno") {
                modalSueno.classList.remove("oculto");
            }
            else if (boton.dataset.tipo === "animo") {
                modalAnimo.classList.remove("oculto");
            }
        });
    });

    // Cerrar Modal CRISIS
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", () => {
            modalCrisis.classList.add("oculto");
        });
    }

    // Cerrar Modal MENSTRUACION
    if (btnCerrarMenstruacion) {
        btnCerrarMenstruacion.addEventListener("click", () => {
            modalMenstruacion.classList.add("oculto");
        });
    }

    // Cerrar Modal MEDICACION
    if (btnCerrarMedicacion) {
        btnCerrarMedicacion.addEventListener("click", () => {
            modalMedicacion.classList.add("oculto");
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
            window.location.href = "registros.html";
        });
    }
    // === AGREGAR ACÁ: Guardar Menstruación (Inscribe cada día en el Historial) ===
    if (btnGuardarMenstruacion) {
        btnGuardarMenstruacion.addEventListener("click", async () => {
            const dIni = inDiaIni.value.trim();
            const mIni = inMesIni.value.trim();
            const aIni = inAnioIni.value.trim();

            const dFin = inDiaFin.value.trim();
            const mFin = inMesFin.value.trim();
            const aFin = inAnioFin.value.trim();
            const obs = inObsMenstruacion.value.trim();

            if (!dIni || !mIni || aIni.length !== 4) { alert("Ingresá una fecha de inicio válida."); return; }
            if (!dFin || !mFin || aFin.length !== 4) { alert("Ingresá una fecha de fin válida."); return; }

            const fechaInicio = new Date(Number(aIni), Number(mIni) - 1, Number(dIni));
            const fechaFin = new Date(Number(aFin), Number(mFin) - 1, Number(dFin));

            if (fechaFin < fechaInicio) {
                alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
                return;
            }

            // Inscribe un registro por cada día dentro del rango
            let fechaActual = new Date(fechaInicio);
            while (fechaActual <= fechaFin) {
                const aStr = fechaActual.getFullYear();
                const mStr = String(fechaActual.getMonth() + 1).padStart(2, '0');
                const dStr = String(fechaActual.getDate()).padStart(2, '0');
                const fechaISO = `${aStr}-${mStr}-${dStr}`;

                const registroDia = {
    id: Date.now() + Math.random(),
    fechaISO: fechaISO,
    hora: "", // Totalmente vacío para que no dibuje hora en la tarjeta
    tipo: "Menstruación",
    info: `Menstruación${obs ? ` - ${obs}` : ''}`,
    detalles: { observaciones: obs }
};

                await apiGuardarRegistro(registroDia);
                fechaActual.setDate(fechaActual.getDate() + 1);
            }

            window.location.href = "registros.html";
        });
    }

    // Lógica AM/PM para Medicación
    btnsPeriodoMed.forEach(btn => {
        btn.addEventListener("click", () => {
            btnsPeriodoMed.forEach(b => b.classList.remove("seleccionado"));
            btn.classList.add("seleccionado");
            periodoMedSeleccionado = btn.dataset.periodo;
        });
    });

    // Cargar historial de Medicaciones y Dosis ingresadas
    function cargarHistorialMedicacion() {
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado")) || { email: "invitado" };
        const medsGuardadas = JSON.parse(localStorage.getItem(`meds_${usuarioActivo.email}`)) || [];
        const dosisGuardadas = JSON.parse(localStorage.getItem(`dosis_${usuarioActivo.email}`)) || [];

        const datalistMeds = document.getElementById("lista-nombres-med");
        const datalistDosis = document.getElementById("lista-dosis-med");

        if (datalistMeds) {
            datalistMeds.innerHTML = "";
            medsGuardadas.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m;
                datalistMeds.appendChild(opt);
            });
        }

        if (datalistDosis) {
            datalistDosis.innerHTML = "";
            dosisGuardadas.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d;
                datalistDosis.appendChild(opt);
            });
        }
    }

    function recordarOpcionMed(clave, valor) {
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado")) || { email: "invitado" };
        const key = `${clave}_${usuarioActivo.email}`;
        let lista = JSON.parse(localStorage.getItem(key)) || [];
        
        lista = lista.filter(item => item.toLowerCase() !== valor.toLowerCase());
        lista.unshift(valor);
        localStorage.setItem(key, JSON.stringify(lista.slice(0, 10)));
        cargarHistorialMedicacion();
    }

    cargarHistorialMedicacion();

    // Guardar registro Medicación
    if (btnGuardarMed) {
        btnGuardarMed.addEventListener("click", async () => {
            const categoria = selectCategoriaMed.value;
            const nombre = inputNombreMed.value.trim();
            const dosis = inputDosisMed.value.trim();
            const hora = inputHoraMed.value.trim();
            const d = inDiaMed.value.trim();
            const m = inMesMed.value.trim();
            const a = inAnioMed.value.trim();

            if (!categoria) return alert("Seleccioná si es Crónica o Rescate.");
            if (!nombre) return alert("Ingresá el nombre de la medicación.");
            if (!hora) return alert("Ingresá la hora de la medicación.");
            if (!periodoMedSeleccionado) return alert("Seleccioná si la hora fue AM o PM.");
            if (!d || !m || a.length !== 4) return alert("Ingresá una fecha válida.");

            const diaFormat = String(d).padStart(2, '0');
            const mesFormat = String(m).padStart(2, '0');

            const nuevoRegistro = {
                id: Date.now(),
                fechaISO: `${a}-${mesFormat}-${diaFormat}`,
                hora: `${hora} ${periodoMedSeleccionado}`,
                tipo: "Medicación",
                info: `Medicación (${categoria}): ${nombre}${dosis ? ` - ${dosis}` : ''}`,
                detalles: { categoria, nombre, dosis, periodo: periodoMedSeleccionado }
            };

            await apiGuardarRegistro(nuevoRegistro);

            // Se guardan para autocompletar en los próximos registros de este usuario
            recordarOpcionMed("meds", nombre);
            if (dosis) recordarOpcionMed("dosis", dosis);

            window.location.href = "registros.html";
        });
    }
    if (btnMas) {
        btnMas.addEventListener("click", () => {
            contadorDesperto++;
            valorContador.textContent = contadorDesperto;
        });
    }

    if (btnMenos) {
        btnMenos.addEventListener("click", () => {
            if (contadorDesperto > 0) {
                contadorDesperto--;
                valorContador.textContent = contadorDesperto;
            }
        });
    }

    btnsPeriodoDormiste.forEach(btn => {
        btn.addEventListener("click", () => {
            btnsPeriodoDormiste.forEach(b => b.classList.remove("seleccionado"));
            btn.classList.add("seleccionado"); // Queda seleccionado en verde
            periodoDormiste = btn.dataset.periodo;
        });
    });

    btnsPeriodoDespertaste.forEach(btn => {
        btn.addEventListener("click", () => {
            btnsPeriodoDespertaste.forEach(b => b.classList.remove("seleccionado"));
            btn.classList.add("seleccionado"); // Queda seleccionado en verde
            periodoDespertaste = btn.dataset.periodo;
        });
    });

    if (btnCerrarSueno) {
        btnCerrarSueno.addEventListener("click", () => {
            modalSueno.classList.add("oculto");
        });
    }
    // Función para calcular las horas y minutos exactos de sueño
    function calcularHorasSueno(horaInicio, periodoInicio, horaFin, periodoFin) {
        const [hIniStr, mIniStr] = horaInicio.split(":");
        let hIni = parseInt(hIniStr, 10);
        const mIni = parseInt(mIniStr || "0", 10);

        const [hFinStr, mFinStr] = horaFin.split(":");
        let hFin = parseInt(hFinStr, 10);
        const mFin = parseInt(mFinStr || "0", 10);

        // Convertir hora inicio a 24hs
        if (periodoInicio === "PM" && hIni < 12) hIni += 12;
        if (periodoInicio === "AM" && hIni === 12) hIni = 0;

        // Convertir hora fin a 24hs
        if (periodoFin === "PM" && hFin < 12) hFin += 12;
        if (periodoFin === "AM" && hFin === 12) hFin = 0;

        let inicioMinutos = hIni * 60 + mIni;
        let finMinutos = hFin * 60 + mFin;

        // Si se despertó al día siguiente (ejemplo: durmió 23:00 PM y despertó 07:00 AM)
        if (finMinutos <= inicioMinutos) {
            finMinutos += 24 * 60;
        }

        const diferenciaMinutos = finMinutos - inicioMinutos;
        const horas = Math.floor(diferenciaMinutos / 60);
        const minutos = diferenciaMinutos % 60;

        // Armar el texto comprensible
        if (minutos === 0) {
            return `${horas} hs`;
        } else if (horas === 0) {
            return `${minutos} min`;
        } else {
            return `${horas} hs y ${minutos} min`;
        }
    }

    // Guardar Registro SUEÑO
    if (btnGuardarSueno) {
        btnGuardarSueno.addEventListener("click", async () => {
            const hDormiste = inputHoraDormiste.value.trim();
            const hDespertaste = inputHoraDespertaste.value.trim();

            if (!hDormiste) return alert("Ingresá la hora a la que te dormiste.");
            if (!periodoDormiste) return alert("Seleccioná si la hora en que te dormiste fue AM o PM.");
            if (!hDespertaste) return alert("Ingresá la hora a la que te despertaste.");
            if (!periodoDespertaste) return alert("Seleccioná si la hora en que te despertaste fue AM o PM.");

            // Calcula cuantas horas y minutos durmió en total
            const tiempoDormido = calcularHorasSueno(hDormiste, periodoDormiste, hDespertaste, periodoDespertaste);

            const ahora = new Date();
            const aStr = ahora.getFullYear();
            const mStr = String(ahora.getMonth() + 1).padStart(2, '0');
            const dStr = String(ahora.getDate()).padStart(2, '0');
            const fechaISO = `${aStr}-${mStr}-${dStr}`;

            let textoVeces = contadorDesperto === 0 
                ? "No se despertó durante la noche" 
                : `Se despertó ${contadorDesperto} ${contadorDesperto === 1 ? 'vez' : 'veces'} durante la noche`;

            const nuevoRegistro = {
                id: Date.now(),
                fechaISO: fechaISO,
                hora: `${hDespertaste} ${periodoDespertaste}`,
                tipo: "Sueño",
                info: `Durmió ${tiempoDormido}. ${textoVeces}.`,
                detalles: {
                    horasDurmió: tiempoDormido,
                    vecesDesperto: contadorDesperto
                }
            };

            await apiGuardarRegistro(nuevoRegistro);
            window.location.href = "registros.html";
        });
    }

    // Selección de Tarjeta de Emoción
    cuadradosEmocion.forEach(cuadrado => {
        cuadrado.addEventListener("click", () => {
            cuadradosEmocion.forEach(c => c.classList.remove("activo"));
            cuadrado.classList.add("activo");
            emocionSeleccionada = cuadrado.dataset.emocion;
        });
    });

    // Cerrar Modal ESTADO DE ÁNIMO
    if (btnCerrarAnimo) {
        btnCerrarAnimo.addEventListener("click", () => {
            modalAnimo.classList.add("oculto");
        });
    }

    // Guardar Registro ESTADO DE ÁNIMO (automático como Sueño)
    if (btnGuardarAnimo) {
        btnGuardarAnimo.addEventListener("click", async () => {
            const mapaIntensidad = { "1": "baja", "2": "moderada", "3": "alta" };
            const valorIntensidad = mapaIntensidad[rangeIntensidadAnimo.value] || "moderada";

            const ahora = new Date();
            const aStr = ahora.getFullYear();
            const mStr = String(ahora.getMonth() + 1).padStart(2, '0');
            const dStr = String(ahora.getDate()).padStart(2, '0');
            const fechaISO = `${aStr}-${mStr}-${dStr}`;

            let horas = ahora.getHours();
            const minutos = String(ahora.getMinutes()).padStart(2, '0');
            const periodo = horas >= 12 ? "PM" : "AM";
            horas = horas % 12 || 12;
            const horaFormateada = `${String(horas).padStart(2, '0')}:${minutos} ${periodo}`;

            const nuevoRegistro = {
                id: Date.now(),
                fechaISO: fechaISO,
                hora: horaFormateada,
                tipo: "Estado de Ánimo",
                info: `Emoción: ${emocionSeleccionada} - Intensidad: ${valorIntensidad}`,
                detalles: {
                    emocion: emocionSeleccionada,
                    intensidad: valorIntensidad
                }
            };

            await apiGuardarRegistro(nuevoRegistro);
            window.location.href = "registros.html";
        });
    }
});