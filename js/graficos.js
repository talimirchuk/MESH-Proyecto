//GRRÁFICOS
const ctx = document.getElementById('graficoCanvas')
const names = ['Tali','Vicky','Martu','Juan','Sofi']
const ages = [14, 15, 16, 17, 18]

const graficoCanvas = new Chart(ctx,{
type: 'line',
data: {
    labels: names,
    datasets:[{
        label:'Edad',
        data: ages,
        backgroundColor:[
            'rgba(255, 0, 0, 0.2)',
            'rgba(0, 149, 255, 0.2)',
            'rgba(99, 255, 99, 0.2)',
            'rgba(0, 238, 255, 0.2)',
            'rgba(140, 0, 255, 0.2)',
            'rgba(255, 187, 0, 0.2)'
        ],
        borderColor: [
            'rgb(255, 0, 0)',
            'rgb(0, 149, 255)',
            'rgb(99, 255, 99)',
            'rgb(0, 238, 255)',
            'rgb(140, 0, 255)',
            'rgb(255, 187, 0)'
        ],
        borderWidth: 1.5
    }]
}
})

//COSAS DEL ENCABEZADO
// desplegable interactivo de categorías
const btnDropdown = document.getElementById("btn-dropdown-categorias");
const listaCategorias = document.getElementById("lista-categorias");
const checkboxes = document.querySelectorAll(".checkbox-categoria");
const textoCategorias = document.getElementById("texto-categorias-seleccionadas");

// abrir y cerrar el desplegable al hacer clic en el botón
btnDropdown.addEventListener("click", function() {
    listaCategorias.classList.toggle("abierto");
});

// selecciónar de hasta máximo 2 opciones
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
        const seleccionados = document.querySelectorAll(".checkbox-categoria:checked");

        // si intenta marcar más de 2, desmarca la última elegida
        if (seleccionados.length > 2) {
            this.checked = false;
            return;
        }

        // actualizar el texto del botón con lo que tildó el usuario
        const nombresSeleccionados = Array.from(seleccionados).map(c => c.parentElement.textContent.trim());
        
        if (nombresSeleccionados.length > 0) {
            textoCategorias.textContent = nombresSeleccionados.join(" y ");
        } else {
            textoCategorias.textContent = "Categorías (hasta 2)";
        }
    });
});

// cerrar la lista si el usuario hace clic fuera del desplegable
document.addEventListener("click", function(e) {
    if (!btnDropdown.contains(e.target) && !listaCategorias.contains(e.target)) {
        listaCategorias.classList.remove("abierto");
    }
});