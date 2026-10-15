// ==========================================
// MOCK BACKEND & MANEJO DE SESIÓN
// ==========================================

/**
 * Función asincrónica para enviar datos al servidor.
 * En esta etapa guarda en localStorage, adjuntando el usuario logueado desde sessionStorage.
 */
async function apiGuardarRegistro(nuevoRegistro) {
    // 1. Verificamos la sesión activa (sessionStorage)
    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioSesion")) || { id: "invitado" };
    nuevoRegistro.usuarioId = usuarioActivo.id;

    // 2. Simulamos la persistencia en base de datos (localStorage)
    const registrosBD = JSON.parse(localStorage.getItem("registrosMESH")) || [];
    registrosBD.push(nuevoRegistro);
    localStorage.setItem("registrosMESH", JSON.stringify(registrosBD));

    // Retorno simulación de API con delay
    return new Promise((resolve) => {
        setTimeout(() => resolve({ status: 200, data: nuevoRegistro }), 100);
    });
}

// Helpers globales de Fecha/Hora para reutilizar en sueno.js, animo.js, etc.
function obtenerFechaHoyISO() {
    const hoy = new Date();
    const a = hoy.getFullYear();
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    const d = String(hoy.getDate()).padStart(2, '0');
    return `${a}-${m}-${d}`;
}

function obtenerHoraActualFormateada() {
    const hoy = new Date();
    return hoy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ==========================================
// LISTENERS DE NAVEGACIÓN DE BOTONES
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const botonesRegistro = document.querySelectorAll(".registro-circulo");

    botonesRegistro.forEach((boton) => {
        boton.addEventListener("click", () => {
            const tipo = boton.dataset.tipo;
            
            // Guardamos el tipo activo en la sesión temporal
            sessionStorage.setItem("tipoRegistroActivo", tipo);
            localStorage.setItem("tipoRegistro", tipo);

            // Redirige al formulario específico (ej: sueno.html, animo.html, etc.)
            window.location.href = `${tipo}.html`;
        });
    });
});