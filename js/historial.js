// Datos ficticios, desp remplazo por back (4 variables por registro: fecha, hora, tipo, info)
const historialDatos = [
    {
      fecha: "Hoy, (16/09)",
      hora: "08:00",
      tipo: "Sueño",
      info: "Durmió 8 horas seguidas, descanso profundo."
    },
    {
      fecha: "Hoy, (16/09)",
      hora: "12:30",
      tipo: "Medicación",
      info: "Tomó dosis de la mañana."
    },
    {
      fecha: "Ayer, (15/09)",
      hora: "10:00",
      tipo: "Estado de ánimo",
      info: "Muy bueno"
    },
    {
        fecha: "Lunes, (14/09)",
        hora: "12:30",
        tipo: "Medicación",
        info: "Tomó dosis de la mañana."
      },
  ];
  
  //busca  contenedor  en el HTML con su ID
  const dashboardHistorial = document.getElementById("dashboard-historial");
  
  // función: armar y mostrar las tarjetas en la pantalla según su fecha
  function mostrarHistorial() {
    // Si no encuentra el contenedor en el HTML, frena
    if (!dashboardHistorial) return;
    dashboardHistorial.innerHTML = "";
  
    //cosa vacía para juntar los registros por su fecha (como carpetas)
    const agrupadoPorFecha = {};
  
    historialDatos.forEach(function(registro) {
      //si la "carpeta" de esa fecha no existe todavía, se crea una
      if (!agrupadoPorFecha[registro.fecha]) {
        agrupadoPorFecha[registro.fecha] = [];
      }
      // guarda registro en su carpeta 
      agrupadoPorFecha[registro.fecha].push(registro);
    });
  
    //recorre cada "carpeta"/fecha para armar una sola tarjeta por día
    for (const fecha in agrupadoPorFecha) {
      
      // variable de texto vacía para poner los párrafos <p> del día
      let htmlRegistros = "";
  
      // lee todos los registros de la fecha y convierte a <p>
      agrupadoPorFecha[fecha].forEach(function(reg) {
        htmlRegistros += `<p>${reg.hora} - ${reg.tipo} - ${reg.info}</p>`;
      });
  
      // título con fecha (h2) y tarjeta con TODOS sus <p> 
      dashboardHistorial.innerHTML += `
        <h2>${fecha}</h2>
        <div class="tarjeta">
          ${htmlRegistros}
        </div>
      `;
    }
  }
  
  //ejecuta y muestra en pantalla
  mostrarHistorial();