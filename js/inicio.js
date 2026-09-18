function mostrarEventos() {
  const dias = [
    { fecha: "Hoy", registros: [] }, //vacío a propósito así usa la funcion de saltar al primero q tenga algo

    { fecha: "Ayer", registros: [
        { hora: "14:30", tipo: "Crisis", info: "Episodio breve, sin complicaciones" },
        { hora: "09:00", tipo: "Medicación", info: "Dosis matutina administrada" }
      ]
    },
    { fecha: "Hace 2 días", registros: [
        { hora: "20:15", tipo: "Sueño", info: "Durmió 8 horas" }
      ]
    }
  ]; // esta lista simula lo que en el futuro va a devolver el backend con fetch, por eso tiene esta forma con fecha + registros adentro

  const diaConRegistros = dias.find(dia => dia.registros.length > 0); //pone la info del día más reciente con registros

  const lineas = diaConRegistros.registros.slice(0, 3).map(registro => { // .map transforma cada registro del array en un texto (fecha - hora - tipo), para convertirse en un mismo párrafo después
    // diaConRegistros.fecha se usa acá porque el registro en sí no tiene fecha propia, es la del día completo
    return `${diaConRegistros.fecha} - ${registro.hora} - ${registro.tipo}`; //arma el texto completo de la línea (ej: "Ayer - 14:30 - Crisis"), todavía no es un <p>, solo texto
  }); // cierra el { del map y el ( del .map(

  return lineas; // devuelve la lista de textos ya armados, para convertirse en <p> en renderEventos()
}

function renderEventos() {
  const lineas = mostrarEventos();
  const tarjeta = document.querySelector(".tarjeta.tarjeta-ancha1"); // busca en el HTML la tarjeta de "Últimos eventos" para poder modificarla

  // saca los <p> viejos y remplaza por recientes, por si renderEventos() se llama más de una vez y hay que refrescar la lista sin duplicar
  tarjeta.querySelectorAll("p").forEach(p => p.remove());//querySelectorAll("p") busca todos los <p> que hay adentro de esa tarjeta y me devuelve un mismo p
  const boton = tarjeta.querySelector("button"); // guarda una referencia al botón "Ver todos" para usarla abajo

  lineas.forEach(linea => {
    const p = document.createElement("p"); // crea un <p> nuevo, vacío, que todavía no está en la página
    p.textContent = linea; // le mete el texto adentro
    tarjeta.insertBefore(p, boton); // inserta cada <p> antes del botón "Ver todos"
  });
}

renderEventos(); //fuera de cualquier función, para que se ejecute sola apenas carga la página

function mostrarRecordatorios() {
  const recordatorios = [
    { hora: "10:00", tipo: "Medicación" },
    { hora: "14:30", tipo: "Terapia" },
    { hora: "18:00", tipo: "Actividad" },
    { hora: "20:00", tipo: "Medicación" } // para probar que slice corta bien a 3
  ]; 

  const lineas = recordatorios.slice(0, 3).map(recordatorio => { //sin find porque acá no hay que buscar por día(en eventos sí)
    return `${recordatorio.hora} - ${recordatorio.tipo}`; //arma el texto de la línea, todavía no es un <p>
  });

  return lineas;
}

function renderRecordatorios() {
  const lineas = mostrarRecordatorios();
  const tarjeta = document.querySelector(".tarjeta.tarjeta-ancha2"); //la tarjeta de recordatorios, no la de eventos

  tarjeta.querySelectorAll("p").forEach(p => p.remove()); //por si se llama más de una vez
  const boton = tarjeta.querySelector("button");

  lineas.forEach(linea => {
    const p = document.createElement("p");
    p.textContent = linea;
    tarjeta.insertBefore(p, boton);
  });
}

renderRecordatorios(); //la llamo acá abajo para que arranque sola, igual que renderEventos()