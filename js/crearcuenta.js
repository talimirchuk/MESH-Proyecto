/* funcion para mostrar u ocultar la contrasena al hacer clic en el ojo */
function activarOcultarMostrarContrasena(idDelInput, idDelBoton) {
    const casillaTexto = document.getElementById(idDelInput);
    const botonOjo = document.getElementById(idDelBoton);

    if (casillaTexto && botonOjo) {
        const dibujoPestana = botonOjo.querySelector(".svg-pestana");
        const dibujoOjo = botonOjo.querySelector(".svg-ojo");

        botonOjo.addEventListener("click", function() {
            if (casillaTexto.type === "password") {
                casillaTexto.type = "text";
                dibujoPestana.classList.add("oculto");
                dibujoOjo.classList.remove("oculto");
            } else {
                casillaTexto.type = "password";
                dibujoPestana.classList.remove("oculto");
                dibujoOjo.classList.add("oculto");
            }
        });
    }
}

activarOcultarMostrarContrasena("contrasena", "ojo-contrasena");
activarOcultarMostrarContrasena("confirmar-contrasena", "ojo-confirmar-contrasena");

/* funcion p/ guardar el usuario, preparado para el backend */
async function guardarUsuario(usuario) {
    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
}

/* capturo el formulario */
const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", async function(e) {
    e.preventDefault();

    /* limpios los textos de error anteriores */
    const listaTextosError = document.querySelectorAll(".texto-error");
    listaTextosError.forEach(function(span) {
        span.textContent = "";
    });

    let hayErrores = false;

    /* lista de campos obligatorios */
    const campos = [
        { id: "nombre-completo", errorId: "error-nombre-completo" },
        { id: "email", errorId: "error-email" },
        { id: "contrasena", errorId: "error-contrasena" },
        { id: "confirmar-contrasena", errorId: "error-confirmar-contrasena" },
        { id: "fecha-nacimiento", errorId: "error-fecha-nacimiento" },
        { id: "diagnostico", errorId: "error-diagnostico" },
        { id: "medicamentos-habituales", errorId: "error-medicamentos-habituales" }
    ];

    /* valido que no haya ninguna casilla vacia */
    campos.forEach(function(campo) {
        const inputElemento = document.getElementById(campo.id);
        const errorElemento = document.getElementById(campo.errorId);

        if (!inputElemento.value.trim()) {
            errorElemento.textContent = "Por favor, completá esta casilla";
            hayErrores = true;
        }
    });

    /* valido coincidencia de contrasenas */
    const valorContrasena = document.getElementById("contrasena").value;
    const valorConfirmar = document.getElementById("confirmar-contrasena").value;

    if (valorContrasena && valorConfirmar && valorContrasena !== valorConfirmar) {
        document.getElementById("error-confirmar-contrasena").textContent = "Las contraseñas no coinciden";
        hayErrores = true;
    }

    if (hayErrores) {
        return;
    }

    /* armo el objeto con los datos del usuario nuevo */
    const nuevoUsuario = {
        nombreCompleto: document.getElementById("nombre-completo").value,
        email: document.getElementById("email").value,
        contrasena: valorContrasena,
        fechaNacimiento: document.getElementById("fecha-nacimiento").value,
        diagnostico: document.getElementById("diagnostico").value,
        medicamentosHabituales: document.getElementById("medicamentos-habituales").value
    };

    await guardarUsuario(nuevoUsuario);

    /* me manda a la pantalla de iniciar sesion */
    window.location.href = "../html/cuentacreada.html";
});