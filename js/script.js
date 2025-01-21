//Iniciamos el script al hacer click en el botón de iniciar presupuesto
document.getElementById("botonInicio").addEventListener("click", function(){
    
    let nombreCliente = prompt("¿Cuál es su nombre completo?");
        if(!nombreCliente){
            alert("Por favor ingresa tú nombre");
            return;
    }

//Definimos el valor en UF de cada servicio geográfico global
    const servicio = {
        "Gestión territorial": 25,
        "Cartografía y SIG": 18,
        "Evaluación ambiental": 20,
        "Webmapping": 25
    };

//Aplicamos un factor de ajuste según la distancia de la ejecución del servicio.    

    const region = {
        "Región Metropolitana": 1,
        "Región de Valparaíso": 1.2,
        "Región del Libertador Bernardo O'higgins": 1.2,
        "Región de La Araucanía": 1.1,
        "Región del Biobío": 1.2,
        "Región de Los Ríos": 1.3,
        "Región de Los Lagos": 1.3
    }

//Cliente escoge servicio y región e invalida si se equivoca

    let servicioSeleccion = prompt("¿Qué servicio quiere cotizar? Gestión territorial, Cartografía y SIG, Evaluación ambiental, Webmapping.");
        if(!servicio[servicioSeleccion]){
            alert("Servicio inválido, intente de nuevo");
            return;
        }

    let regionSeleccion = prompt("¿ En qué región? Región Metropolitana, Región de Valparaíso, Región del Libertador Bernardo O'higgins, Región de La Araucanía, Región del Biobío, Región de Los Ríos, Región de Los Lagos");
        if(!region[regionSeleccion]){
            alert("Región inválida, intente de nuevo");
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

//Se crea párrafo con el resultado
document.getElementById("resultado").textContent =
    "El presupuesto para nuestro cliente " + nombreCliente + " es de " + costoTotal() + " UF, IVA incluido";
});