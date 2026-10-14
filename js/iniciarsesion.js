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
                if (dibujoPestana && dibujoOjo) {
                    dibujoPestana.classList.add("oculto");
                    dibujoOjo.classList.remove("oculto");
                }
            } else {
                casillaTexto.type = "password";
                if (dibujoPestana && dibujoOjo) {
                    dibujoPestana.classList.remove("oculto");
                    dibujoOjo.classList.add("oculto");
                }
            }
        });
    }
}

/* activo la funcion para el ojito del inicio de sesion */
activarOcultarMostrarContrasena("password", "ojo-contrasena");

/*  el botón de continuar en iniciar sesión */
const continuar = document.getElementById("continuar");

if (continuar) {
    continuar.addEventListener("click", function(e) {
        e.preventDefault(); // Previene recargas

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const textoayuda = document.getElementById("texto-ayuda");

        if (!emailInput || !passwordInput) {
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        /* Leo cuenta que se guardó desde crearcuenta.js */
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioRegistrado"));

        /* Si no hay ninguna cuenta guardada en el navegador */
        if (!usuarioGuardado) {
            textoayuda.textContent = "No hay ninguna cuenta registrada. Registrate primero.";
            return;
        }

        /* Reviso si la clave guardada se llama 'contrasena' o 'password' xq a veces pongo las dos*/
        const claveGuardada = usuarioGuardado.contrasena || usuarioGuardado.password;

        /* Comparo datos */
        if (email === usuarioGuardado.email && password === claveGuardada) {
            // Guardo en localStorage qué usuario inició sesión que desp lo hace back
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioGuardado));

            window.location.href = "../html/inicio.html";
        } else {
            // Muestro el mensaje de error si no coinciden
            textoayuda.textContent = "Email o contraseña incorrectos";
        }
    });
}