document.addEventListener("DOMContentLoaded", function() {
    cargarServiciosYRegiones();
    mostrarCotizaciones();
});

const cotizaciones = [];

function cargarServiciosYRegiones() {
    fetch("services.json")
        .then(response => response.json())
        .then(data => {
            const selectServicio = document.getElementById("servicio");
            const selectRegion = document.getElementById("region");

            // Llenar el selector de los servicios
            data.servicios.forEach(servicio => {
                const option = document.createElement("option");
                option.value = servicio.nombre;  
                option.textContent = servicio.nombre;  
                selectServicio.appendChild(option);
            });

            // Llenar el selector de las regiones
            data.regiones.forEach(region => {
                const option = document.createElement("option");
                option.value = region.nombre;  
                option.textContent = region.nombre;  
                selectRegion.appendChild(option);
            });
        });
}

document.getElementById("formularioPresupuesto").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombreCliente = document.getElementById("nombre").value.trim();
    const servicioSeleccion = document.getElementById("servicio").value;
    const regionSeleccion = document.getElementById("region").value;

    if (!nombreCliente) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    // Calcular el costo total cuando se seleccionan servicio y región ya que tiene asociado un valor en UF y un factor de ajuste según distancia geográfica
    fetch("services.json")
        .then(response => response.json())
        .then(data => {
            // Buscar servicio y región seleccionados en los datos cargados json
            const servicio = data.servicios.find(s => s.nombre === servicioSeleccion);
            const region = data.regiones.find(r => r.nombre === regionSeleccion);

            // Cálculo del costo en base a datos json
            const costoServicio = servicio.precio;
            const factorRegion = region.factor;
            const costoTotal = () => {
                let costoBase = costoServicio * factorRegion;
                let iva = costoBase * 0.19;
                return costoBase + iva;
            };

            function calcularCosto(servicio, region) {
                const costoBase = servicio.precio * region.factor;
                const iva = costoBase * 0.19;
                return (costoBase + iva).toFixed(2);
            }

            // Crear la cotización
            const cotizacion = {
                nombre: nombreCliente,
                servicio: servicioSeleccion,
                region: regionSeleccion,
                costo: costoTotal().toFixed(2)  // Formatear el costo
            };

            cotizaciones.push(cotizacion);
            guardarCotizaciones();
            mostrarCotizaciones();

            document.getElementById("resultado").textContent =
                `El presupuesto para ${nombreCliente} es de ${cotizacion.costo} UF, IVA incluido.`;
        });
});

// Guardar cotizaciones en localStorage
function guardarCotizaciones() {
    localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
}

// Mostrar cotizaciones en el historial
function mostrarCotizaciones() {
    const listaCotizaciones = document.getElementById("listaCotizaciones");
    listaCotizaciones.innerHTML = '';

    cotizaciones.forEach((cotizacion, index) => {
        const li = document.createElement("li");
        li.textContent = `${cotizacion.nombre} - ${cotizacion.servicio} - ${cotizacion.region} - ${cotizacion.costo} UF`;

        // Botón de eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => eliminarCotizacion(index);

        // Botón de editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => editarCotizacion(index);

        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);
        listaCotizaciones.appendChild(li);
    });
}

// Eliminar cotización
function eliminarCotizacion(index) {
    cotizaciones.splice(index, 1);
    guardarCotizaciones();
    mostrarCotizaciones();
}

// Editar cotización
function editarCotizacion(index) {
    const cotizacion = cotizaciones[index];
    document.getElementById("nombre").value = cotizacion.nombre;
    document.getElementById("servicio").value = cotizacion.servicio;
    document.getElementById("region").value = cotizacion.region;

    // Actualizar cotización al reenviar el formulario
    document.getElementById("formularioPresupuesto").onsubmit = function(e) {
        e.preventDefault();
        cotizacion.nombre = document.getElementById("nombre").value.trim();
        cotizacion.servicio = document.getElementById("servicio").value;
        cotizacion.region = document.getElementById("region").value;
        
        // Actualizar el costo basado en el servicio y la región
        fetch("services.json")
            .then(response => response.json())
            .then(data => {
                const servicio = data.servicios.find(s => s.nombre === cotizacion.servicio);
                const region = data.regiones.find(r => r.nombre === cotizacion.region);
                cotizacion.costo = calcularCosto(servicio, region);
                guardarCotizaciones();
                mostrarCotizaciones();
            });
    };
}


