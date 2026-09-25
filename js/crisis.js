document.addEventListener('DOMContentLoaded', () => {
    // Manejo de botones de selección Sí / No
    const gruposSiNo = document.querySelectorAll('.opciones-si-no');

    gruposSiNo.forEach(grupo => {
        const botones = grupo.querySelectorAll('.btn-opcion');

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                // Desmarcar todos los botones dentro del mismo grupo
                botones.forEach(b => b.classList.remove('seleccionado'));
                
                // Marcar el botón clickeado
                boton.classList.add('seleccionado');

                // Lógica condicional para "¿Hubo crisis?"
                if (grupo.id === 'grupo-hubo-crisis') {
                    const cajaTipoCrisis = document.getElementById('caja-tipo-crisis');
                    if (boton.dataset.valor === 'si') {
                        cajaTipoCrisis.classList.remove('oculto');
                    } else {
                        cajaTipoCrisis.classList.add('oculto');
                        document.getElementById('tipo-crisis').value = ''; // Limpiar el campo si selecciona "No"
                    }
                }
            });
        });
    });
});