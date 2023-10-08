// variables y selectorires
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//eventos

eventListeners();

 function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    
    formulario.addEventListener('submit', agregarGasto);
}

//clases

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado; 
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    } 
    
}

class UI {
    insertarPresupuesto (cantidad) {
        //extrayendo los valores
        const {presupuesto, restante} = cantidad;

        //agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        //mensaje de rror 
        divMensaje.textContent = mensaje;

        //insertar en el HTML

        document.querySelector('.primario').insertBefore( divMensaje, formulario);
        
        //quitar el HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }

    mostrarGastos(gastos){
        
        this.limpiarHTML(); //elimina el HTML previo

        //iterar sobre los gastos

        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear un LI

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.setAttribute('data-id', id);

            //agregar el html del gasto

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>
            `;


            //boton para borrar el gasto

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = "Borrar &times;"
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%

        if ( (presupuesto / 4 ) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// intanciarlo
const ui = new UI();
let presupuesto;

//funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?')

    if (presupuestoUsuario === "" || presupuestoUsuario === null || presupuestoUsuario <= '0' || isNaN(presupuestoUsuario)) {
        window.location.reload();
    }

    //presupuesto valido 
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//anade gastos

function agregarGasto(e) {
    e.preventDefault();


    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta("Ambos campos son obligatorios", 'error');

    }else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');

        return
    }
    //generar un objeto con el gasto

    const gasto = {nombre, cantidad, id: Date.now() }

    //anade un nuevo gasto

    presupuesto.nuevoGasto(gasto);

    //mensaje de todo ok

    ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos

    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reiniciar formulario

    formulario.reset();
}

function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}



