const IP_BACKEND = "http://localhost:3000";

// Helper para poner en mayúscula la primera letra
function capitalizarPrimeraLetra(texto) {
    if (!texto) return "";
    const str = String(texto).trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Obtener usuario activo
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"))
                 || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                 || {};
                 
    const idUsuario = Number(usuario.id || usuario.pacienteId || usuario.idPaciente);
    const emailUsuario = usuario.email || "";
    const elemNombre = document.getElementById("nombre-usuario");

    let nombreMostrar = usuario.nombre || usuario.nombreYapellido || usuario.nombreCompleto || usuario.nombre_apellido;
    
    if (!nombreMostrar && idUsuario) {
        try {
            const resUser = await fetch(`${IP_BACKEND}/usuarios/${idUsuario}`);
            if (resUser.ok) {
                const datosUser = await resUser.json();
                nombreMostrar = datosUser.nombre || datosUser.nombreYapellido || datosUser.nombreCompleto || datosUser.email;
            }
        } catch (e) {
            console.warn("No se pudo obtener el usuario.");
        }
    }

    if (elemNombre) {
        elemNombre.textContent = nombreMostrar || "Paciente";
    }

    if (!idUsuario) return;

    // 2. Cargar Resumen de Salud (Historial)
    try {
        const resHist = await fetch(`${IP_BACKEND}/pacientes/${idUsuario}/historial`);
        if (resHist.ok) {
            const data = await resHist.json();

            // A. SUEÑO
            const suenoRegs = (data.sueno || []).filter(r => Number(r.pacienteId || r.idPaciente) === idUsuario);
            if (suenoRegs.length > 0) {
                const ultSueno = suenoRegs[suenoRegs.length - 1];
                const elemSueno = document.getElementById("sueno-valor");
                if (elemSueno) {
                    let horasStr = String(ultSueno.horasDormidas || ultSueno.horas || '--');
                    if (!horasStr.includes("hs")) {
                        horasStr += " hs";
                    }
                    elemSueno.textContent = horasStr;
                }
            } else {
                const elemSueno = document.getElementById("sueno-valor");
                if (elemSueno) elemSueno.textContent = "Sin datos";
            }

            // B. MEDICACIÓN (Se elimina la terminación "hs:" extra)
            const medRegs = (data.medicaciones || data.medicacion || []).filter(r => Number(r.pacienteId || r.idPaciente) === idUsuario);
            if (medRegs.length > 0) {
                const ultMed = medRegs[medRegs.length - 1];
                const elemMedHora = document.getElementById("med-hora");
                const elemMedNombre = document.getElementById("med-nombre");

                const horaReg = ultMed.hora || ultMed.horaTomada || ultMed.horaMedicacion || ultMed.horario || '--:--';
                
                if (elemMedHora) {
                    // Si ya incluye AM o PM, no agrega la palabra "hs"
                    if (horaReg.toUpperCase().includes("AM") || horaReg.toUpperCase().includes("PM")) {
                        elemMedHora.textContent = `Última ${horaReg}:`;
                    } else {
                        elemMedHora.textContent = `Última ${horaReg} hs:`;
                    }
                }
                
                if (elemMedNombre) {
                    elemMedNombre.textContent = `${ultMed.nombreMedicamento || ultMed.medicamento || ''} ${ultMed.dosis || ''}`.trim() || 'Registrada';
                }
            }

            // C. ESTADO DE ÁNIMO (Primera letra en mayúscula)
            const animoRegs = (data.estadodeanimo || []).filter(r => Number(r.pacienteId || r.idPaciente) === idUsuario);
            if (animoRegs.length > 0) {
                const ultAnimo = animoRegs[animoRegs.length - 1];
                const elemAnimoEmocion = document.getElementById("animo-emocion");
                const elemAnimoIntensidad = document.getElementById("animo-intensidad");

                if (elemAnimoEmocion) {
                    elemAnimoEmocion.textContent = capitalizarPrimeraLetra(ultAnimo.emocion || '--');
                }
                if (elemAnimoIntensidad) {
                    elemAnimoIntensidad.textContent = capitalizarPrimeraLetra(ultAnimo.intensidad || '');
                }
            }

            // D. CRISIS (Etiqueta con primera letra en mayúscula)
            const crisisRegs = (data.crisis || []).filter(r => Number(r.pacienteId || r.idPaciente) === idUsuario);
            if (crisisRegs.length > 0) {
                const ultCrisis = crisisRegs[crisisRegs.length - 1];
                const elemCrisisFecha = document.getElementById("crisis-fecha");
                if (elemCrisisFecha && ultCrisis.fecha) {
                    const partes = ultCrisis.fecha.split("-");
                    elemCrisisFecha.textContent = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0].slice(2)}` : ultCrisis.fecha;
                }
            } else {
                const elemCrisisFecha = document.getElementById("crisis-fecha");
                if (elemCrisisFecha) elemCrisisFecha.textContent = "Sin crisis";
            }
        }
    } catch (err) {
        console.error("Error al obtener historial:", err);
    }

    // 3. Cargar Recordatorios + Mostrar Fecha
    const contenedorRec = document.getElementById("lista-recordatorios-inicio");
    const elemFechaRec = document.getElementById("fecha-recordatorios");

    try {
        let resRec = await fetch(`${IP_BACKEND}/recordatorios/${encodeURIComponent(emailUsuario)}`);
        
        if (!resRec.ok) {
            resRec = await fetch(`${IP_BACKEND}/sincronizar`);
        }

        if (resRec.ok && contenedorRec) {
            let dataRec = await resRec.json();
            
            if (dataRec.recordatorios) {
                dataRec = dataRec.recordatorios;
            }

            const recsUsuario = Array.isArray(dataRec)
                ? dataRec.filter(r => !r.usuarioEmail || r.usuarioEmail === emailUsuario || Number(r.pacienteId) === idUsuario)
                : [];

            if (recsUsuario.length === 0) {
                contenedorRec.innerHTML = `<p class="sin-registros-texto">No tenés recordatorios pendientes.</p>`;
                if (elemFechaRec) elemFechaRec.textContent = "";
                return;
            }

            // Ordenar por fecha y hora
            recsUsuario.sort((a, b) => new Date(`${a.fecha}T${a.hora || '00:00'}`) - new Date(`${b.fecha}T${b.hora || '00:00'}`));

            const fechaMasCercana = recsUsuario[0].fecha;

            if (elemFechaRec && fechaMasCercana) {
                const partesF = fechaMasCercana.split("-");
                if (partesF.length === 3) {
                    elemFechaRec.textContent = `(${partesF[2]}/${partesF[1]}/${partesF[0].slice(2)})`;
                } else {
                    elemFechaRec.textContent = `(${fechaMasCercana})`;
                }
            }

            const recordatoriosDelDia = recsUsuario
                .filter(r => r.fecha === fechaMasCercana)
                .slice(0, 3);

            let html = "";
            recordatoriosDelDia.forEach(r => {
                let horaStr = r.hora || '--:--';
                if (horaStr.length > 5 && !horaStr.toUpperCase().includes("AM") && !horaStr.toUpperCase().includes("PM")) {
                    horaStr = horaStr.slice(0, 5);
                }

                const descripcion = [r.tipo, r.descripcion || r.titulo || r.nombre || r.medicamento].filter(Boolean).join(" - ");

                html += `
                    <div class="item-recordatorio">
                        <span class="hora-rec">${horaStr}</span>
                        <span class="texto-rec">${descripcion || 'Recordatorio'}</span>
                    </div>
                `;
            });

            contenedorRec.innerHTML = html;
        } else if (contenedorRec) {
            contenedorRec.innerHTML = `<p class="sin-registros-texto">No tenés recordatorios pendientes.</p>`;
        }
    } catch (err) {
        console.error("Error al obtener recordatorios:", err);
        if (contenedorRec) {
            contenedorRec.innerHTML = `<p class="sin-registros-texto">No tenés recordatorios pendientes.</p>`;
        }
    }
});