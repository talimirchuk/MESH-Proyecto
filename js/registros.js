const botonesRegistro = document.querySelectorAll(".registro-card"); //querySelectorAll busca en todo el HTML todas las tarjetas que tengan la clase .registro-card

botonesRegistro.forEach(function(boton) {//foreach agarra los botones y hace las instruccioness
    boton.addEventListener("click", function() {
        // Lee el valor de data-tipo ("sueno", "animo", etc.)
        const tipo = boton.dataset.tipo; 
        
        // Guarda en el navegador qué tipo eligió para usarlo después
        localStorage.setItem("tipoRegistro", tipo);
        
        // Redirige al archivo HTML correspondiente
        window.location.href = `${tipo}.html`;
    });
});