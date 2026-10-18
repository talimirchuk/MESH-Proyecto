document.addEventListener("DOMContentLoaded", () => {
    // Botones principales
    const btnVerContrasena = document.getElementById("btn-ver-contrasena");
    const btnEliminarPerfil = document.getElementById("btn-eliminar-perfil");

    // Modales
    const modalContrasena = document.getElementById("modal-contrasena");
    const modalEliminar = document.getElementById("modal-eliminar");

    // Elementos internos modal contraseña
    const valorEmailUsuario = document.getElementById("valor-email-usuario");
    const valorPassUsuario = document.getElementById("valor-pass-usuario");

    // Botones modal eliminar
    const btnCancelarEliminar = document.getElementById("btn-cancelar-eliminar");
    const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");

    // Obtener usuario activo
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"))
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                       || { email: "juanperez@gmail.com", password: "JuanPerez1901" };

    // Abrir modal Ver Contraseña
    if (btnVerContrasena && modalContrasena) {
        btnVerContrasena.addEventListener("click", () => {
            valorEmailUsuario.textContent = usuarioActivo.email || usuarioActivo.usuario || "juanperez@gmail.com";
            valorPassUsuario.textContent = usuarioActivo.password || usuarioActivo.contrasena || "JuanPerez1901";
            modalContrasena.classList.add("activo");
        });
    }

    // Abrir modal Eliminar Perfil
    if (btnEliminarPerfil && modalEliminar) {
        btnEliminarPerfil.addEventListener("click", () => {
            modalEliminar.classList.add("activo");
        });
    }

    // Cancelar/Cerrar modal eliminar
    if (btnCancelarEliminar && modalEliminar) {
        btnCancelarEliminar.addEventListener("click", () => {
            modalEliminar.classList.remove("activo");
        });
    }

    // Confirmar eliminación -> Borrar datos reales del usuario y redirigir a primera.html
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener("click", () => {
            const emailAEliminar = usuarioActivo.email || usuarioActivo.usuario;

            if (emailAEliminar) {
                // 1. Borrar de los registros generales MESH solo los del usuario activo
                const registrosBD = JSON.parse(localStorage.getItem("registrosMESH")) || [];
                const registrosFiltrados = registrosBD.filter(reg => reg.usuarioEmail !== emailAEliminar);
                localStorage.setItem("registrosMESH", JSON.stringify(registrosFiltrados));

                // 2. Borrar historiales y configuraciones individuales del usuario
                localStorage.removeItem(`meds_${emailAEliminar}`);
                localStorage.removeItem(`dosis_${emailAEliminar}`);
            }

            // 3. Borrar la sesión activa del almacenamiento local y de sesión
            localStorage.removeItem("usuarioLogueado");
            sessionStorage.removeItem("usuarioLogueado");

            // 4. Redirigir a la pantalla de entrada primera.html
            window.location.href = "primera.html";
        });
    }

    // Cerrar los modales al hacer clic fuera de la tarjeta blanca
    [modalContrasena, modalEliminar].forEach(modal => {
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    modal.classList.remove("activo");
                }
            });
        }
    });
});