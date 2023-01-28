const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const criptoImagen = document.querySelector('.imagen-cripto');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}
// Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
} );

document.addEventListener('DOMContentLoaded' , () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})


function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=40&tsym=USD';
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then( criptomonedas => selectCriptomondas(criptomonedas))
}

function selectCriptomondas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e) {
    e.preventDefault();
    // validar 
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda ==='' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje) {
    const divMensajeExiste = document.querySelector('.error');
    if(!divMensajeExiste) {

        console.log(mensaje);
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    try {
        const respuesta = await fetch(url);
        const contizacion = await respuesta.json();
        mostrarCotizacionHTML(contizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
} 

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    console.log(cotizacion);
    
    const { PRICE, IMAGEURL, HIGHDAY, LOWDAY, CHANGEPCT24HOUR,LASTUPDATE  } = cotizacion;
    criptoImagen.src = `https://www.cryptocompare.com/${IMAGEURL}?width=400`;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;
    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
    // https://www.cryptocompare.com/media/37746251/btc.png?width=50
  
}
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();
    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
  </div>
    `;

    resultado.appendChild(spinner);
}
