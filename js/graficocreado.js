const IP_BACKEND = "http://10.10.32.41:3000";

let chartInstancia = null;

const NOMBRES_PERIODOS = {
    "7dias": "Últimos 7 días",
    "15dias": "Últimos 15 días",
    "30dias": "Último mes",
    "6meses": "Últimos 6 meses",
    "1ano": "Último año",
    "todo": "Desde que me registré"
};

function formatearFecha(fechaISO) {
    const partes = fechaISO.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}` : fechaISO;
}

function calcularFechaLimite(periodo) {
    const hoy = new Date();
    let dias = 0;

    if (periodo === "7dias") dias = 7;
    else if (periodo === "15dias") dias = 15;
    else if (periodo === "30dias") dias = 30;
    else if (periodo === "6meses") dias = 180;
    else if (periodo === "1ano") dias = 365;
    else if (periodo === "todo") return null;

    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() - dias);
    return limite;
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Obtener la selección guardada
    const categorias = JSON.parse(localStorage.getItem("grafico_categorias") || "[]");
    const periodo = localStorage.getItem("grafico_periodo") || "";
    const subtitulo = document.getElementById("subtitulo-grafico");

    if (categorias.length === 0 || !periodo) {
        if (subtitulo) subtitulo.textContent = "No se seleccionó ninguna categoría.";
        return;
    }

    const textoPeriodo = NOMBRES_PERIODOS[periodo] || periodo;
    if (subtitulo) subtitulo.textContent = `Sueño — ${textoPeriodo}`;

    // 2. Obtener paciente logueado
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"))
                 || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                 || {};
    const idUsuario = Number(usuario.id || usuario.pacienteId || usuario.idPaciente);

    const canvas = document.getElementById("graficoCanvas");
    if (!canvas || !idUsuario) return;
    const ctx = canvas.getContext("2d");

    // 3. Solo procesamos 'sueno' por ahora
    if (!categorias.includes("sueno")) {
        if (subtitulo) subtitulo.textContent = "Por ahora solo está programado el gráfico de Sueño.";
        return;
    }

    const fechaLimite = calcularFechaLimite(periodo);

    try {
        // Pedido de datos reales al Backend
        const res = await fetch(`${IP_BACKEND}/pacientes/${idUsuario}/historial`);
        if (!res.ok) throw new Error("Error backend");
        const data = await res.json();

        // Filtrar registros del usuario activo
        let registrosSueno = (data.sueno || []).filter(item => Number(item.pacienteId) === idUsuario);

        // Filtrar según el período seleccionado
        if (fechaLimite) {
            registrosSueno = registrosSueno.filter(r => new Date(r.fechaDelDia + "T00:00:00") >= fechaLimite);
        }

        // Ordenar cronológicamente
        registrosSueno.sort((a, b) => a.fechaDelDia.localeCompare(b.fechaDelDia));

        if (registrosSueno.length === 0) {
            if (subtitulo) subtitulo.textContent = `Sueño — Sin registros en este período.`;
            return;
        }

        // 4. Renderizar gráfico real con Chart.js
        chartInstancia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: registrosSueno.map(r => formatearFecha(r.fechaDelDia)),
                datasets: [{
                    label: 'Horas Dormidas',
                    data: registrosSueno.map(r => Number(r.horasDormidas) || 0),
                    borderColor: '#21884F',
                    backgroundColor: 'rgba(33, 136, 79, 0.15)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Horas' }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error al obtener datos de sueño:", error);
    }
});