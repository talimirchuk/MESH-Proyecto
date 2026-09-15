// Cuenta ficticia (datos que después vienen del back)
const emailValido = "paciente@gmail.com";
const passwordValida = "1234";

const continuar = document.getElementById("continuar");
continuar.addEventListener("click", function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === emailValido && password === passwordValida) {
        window.location.href = "../html/inicio.html";
    } else {
        const textoayuda = document.getElementById("texto-ayuda");
        textoayuda.textContent = "Email o contraseña incorrectos";
    }
});