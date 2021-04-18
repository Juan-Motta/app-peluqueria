let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp() {

    //Limpiar inputs
    limpiarInputs();

    mostrarServicios();
    //Resalta el div actual segun el tab al que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de l acita o mensaje de error si no pasa la validacion
    mostrarResumen();

    //almacena el nombre de la cita en el objeto
    nombreCita();

    //allmacenar la fecha de la cita en el objeto
    fechaCita();

    //amacena la hora
    horaCita();

}

function limpiarInputs() {
    const nombreInput = document.querySelector('#nombre');
    const fechaInput = document.querySelector('#fecha');
    const horaInput = document.querySelector('#hora');

    nombreInput.value = '';
    fechaInput.value = '';
    horaInput.value = '';
}

function mostrarSeccion() {
    //eliminar mostrar seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');

    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    
    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach( (enlace) => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            //Lamar la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json'); //Nos da un resultado, pero hay que especificarle a JS que queremos hacer con el
        const db = await resultado.json(); // Le decimos a JS que la respuesta es un JSON
        const { servicios } = db;

        //General el HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            //DOM Scripting

            //Gnenerar nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Gnenerar precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar el div contenedor
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // selecciona un servicio paara la cita
            servicioDiv.onclick = seleccionarServicio;

            //injectar precio y nombre al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //injectar al html
            document.querySelector('#servicios').appendChild(servicioDiv);
        })

    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e) {
    let elemento;
    //Forzar que el elemento al que se le da click sea el div
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent,
        }

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id );
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();//Estamos en la pagina 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen() {
    //destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //selecionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia HTML previo
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion de objeto
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumen div
        resumenDiv.appendChild(noServicios);
    } else {

        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de Cita';

        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
        
        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de Servicios';

        serviciosCita.appendChild(headingServicios);

        let cantidad = 0;

        //iterar sobre el arreglo de servicios
        servicios.forEach( (servicio) =>{
            const { nombre, precio } = servicio;

            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');
            
            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio');

            const totalServicio = precio.split('$');
            
            cantidad += parseInt(totalServicio[1].trim());

            //colocar texto y precio en el div
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);

            serviciosCita.appendChild(contenedorServicio);

        });

        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);

        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.innerHTML = `<span>Tatal a Pagar:</span> $ ${cantidad}`;
        cantidadPagar.classList.add('pagar');

        resumenDiv.appendChild(cantidadPagar);
    }
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', (e) => {
        const nombreTexto = e.target.value.trim();
        //validacion de que nombre texto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 2){
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            console.log(cita);
        }

    });
}

function mostrarAlerta(mensaje, tipo) {
    //si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    
    const fechaAhora = new Date(); 

    //Formato yyyy-mm-dd ahora
    const yearAhora = fechaAhora.getFullYear();
    const mesAhora = fechaAhora.getMonth() + 1;
    const diaAhora = fechaAhora.getDate();

    fechaInput.addEventListener('input', (e) => {

        const fechaSeleccionada = fechaInput.value.split('-');
        //Formato yyyy-mm-dd input
        const yearSeleccionado = parseInt(fechaSeleccionada[0]);
        const mesSeleccionado = parseInt(fechaSeleccionada[1]);
        const diaSeleccionado = parseInt(fechaSeleccionada[2]);

        const dia = new Date(e.target.value).getUTCDay(); //numero del dia del 0 al 6 - domingo a sabado
        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semaana no son permitidos', 'error');
        } else if(yearSeleccionado < yearAhora || mesSeleccionado < mesAhora || diaSeleccionado < diaAhora) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fechas nateriores no son permitidas', 'error');
        } else {
            cita.fecha = fechaInput.value; 
            console.log(cita);
        }
    })
}
    
function desabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date(); 

    //Formato yyyy-mm-dd
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate();

    const fechaDesabilitar = `${year}-${mes}-${dia}`;
    
    inputFecha.min = fechaDesabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', (e) => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita;
        }
    });
}