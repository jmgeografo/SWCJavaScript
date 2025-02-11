//Iniciamos el script al hacer click en el botón de iniciar presupuesto
document.getElementById("formularioPresupuesto").addEventListener("submit", function(e){
    e.preventDefault();
    
//Definimos el valor en UF de cada servicio geográfico global
    const servicio = {
        "gestion territorial": 25,
        "cartografia y sig": 18,
        "evaluacion ambiental": 20,
        "webmapping": 25
    };

//Aplicamos un factor de ajuste según la distancia de la ejecución del servicio.    

    const region = {
        "region metropolitana": 1,
        "region de valparaiso": 1.2,
        "region del libertador bernardo o'higgins": 1.2,
        "region de La araucania": 1.1,
        "region del biobio": 1.2,
        "region de los rios": 1.3,
        "region de los lagos": 1.3
    }

//Obtener valores del formulario y obviar el espacio al ingresar nombre    
    const nombreCliente = document.getElementById("nombre").value.trim();
    const servicioSeleccion = document.getElementById("servicio").value;
    const regionSeleccion = document.getElementById("region").value;

    if (!nombreCliente) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

//Costo total se define por valor base + IVA 

    const costoServicio = servicio[servicioSeleccion];
    const factorRegion = region[regionSeleccion];

    const costoTotal = () => {
        let costoBase = costoServicio * factorRegion;
        let iva = costoBase * 0.19;
        return costoBase + iva;
    };

    localStorage.setItem("nombreCliente", nombreCliente);
    localStorage.setItem("servicioSeleccionado", servicioSeleccion);
    localStorage.setItem("regionSeleccionada", regionSeleccion);
    localStorage.setItem("costoTotal", costoTotal);

//Se crea párrafo con el resultado
document.getElementById("resultado").textContent =
    "El presupuesto para nuestro cliente " + nombreCliente + " es de " + costoTotal() + " UF, IVA incluido";
});