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
        /* 1. Leo la lista completa de usuarios creados en usuariosMESH */
        const listaUsuarios = JSON.parse(localStorage.getItem("usuariosMESH")) || [];

        /* Si no hay ninguna cuenta guardada en la lista */
        if (listaUsuarios.length === 0) {
            textoayuda.textContent = "No hay ninguna cuenta registrada. Registrate primero.";
            return;
        }

        /* 2. Busco en el array el usuario cuyo email y contraseña coincidan */
        const usuarioEncontrado = listaUsuarios.find(function(u) {
            const claveGuardada = u.contrasena || u.password;
            return u.email.toLowerCase() === email.toLowerCase() && password === claveGuardada;
        });

        /* 3. Comparo datos */
        if (usuarioEncontrado) {
            // Guardamos en 'usuarioLogueado' SÓLO la cuenta que acaba de ingresar
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));

            window.location.href = "../html/inicio.html";
        } else {
            // Muestro el mensaje de error si no coinciden
            textoayuda.textContent = "Email o contraseña incorrectos";
        }
    });
}