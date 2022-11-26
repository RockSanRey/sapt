let botonBorrar = document.querySelector('#botonBorrar');
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListadoUsuarios();
    botonBorrar.addEventListener('click', () => {
        eliminarUsuarios();
    })
})

const obtenerListadoUsuarios = async () => {
    try{
        let listadoUsuariosHoy = document.querySelector('#listadoUsuariosHoy');
        listadoUsuariosHoy.innerHTML=cargaAnimacion;
        fetch('aborusuarios/llenarTablaUsuariosContratosHoy')
        .then(respRender => respRender.json())
        .then(respuestas => {
            listadoUsuariosHoy.classList.add('tabla-contenedor');
            const tablaUsuarios = document.createElement('table');
            tablaUsuarios.classList.add('table','table-sm','table-hover','fuente-12p');
            tablaUsuarios.innerHTML=`
                <thead>
                    <th class="col">Detalles</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaUsuarios = document.createElement('tbody');
            if(respuestas.estatus=='error'){
                cuerpoTablaUsuarios.innerHTML=`
                    <tr>
                        <td colspan="2">${respuestas.text}</td>
                    </tr>
                `;
                tablaUsuarios.appendChild(cuerpoTablaUsuarios);
                listadoUsuariosHoy.innerHTML='';
                listadoUsuariosHoy.appendChild(tablaUsuarios);
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    html: respuestas.text,
                    showConfirmButton: false,
                    timer: 1000,
                });

            }else{
                respuestas.forEach(usuarios => {
                    const filaTablaUsuarios = document.createElement('tr');
                    const columnaDetalles = document.createElement('td');
                    columnaDetalles.innerHTML=`
                        <div class="row">
                            <div class="col-md-2 col-12">${usuarios.CONTRATO_CCONT}</div>
                            <div class="col-md-6 col-12">${usuarios.CLIENTE}</div>
                            <div class="col-md-2 col-12">${usuarios.DESCRIPCION_CONT}</div>
                            <div class="col-md-2 col-12">${usuarios.FMODIF_CLIEN}</div>
                        </div>
                    `;
                    filaTablaUsuarios.appendChild(columnaDetalles);
                    const columnaAcciones = document.createElement('td');
                    const botonEliminarEl = document.createElement('button');
                    botonEliminarEl.classList.add('btn','btn-sm','btn-info');
                    botonEliminarEl.setAttribute('data-toggle','modal');
                    botonEliminarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEliminarEl.setAttribute('dataelim',usuarios.idTablePk);
                    botonEliminarEl.setAttribute('id','botonEliminarSel');
                    botonEliminarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEliminarEl.addEventListener('click',() => {
                        buscandoDatosEliminar(botonEliminarEl);
                    });
                    let grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonEliminarEl);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaUsuarios.appendChild(columnaAcciones);

                    cuerpoTablaUsuarios.appendChild(filaTablaUsuarios);
                    tablaUsuarios.appendChild(cuerpoTablaUsuarios);
                    listadoUsuariosHoy.innerHTML='';
                    listadoUsuariosHoy.appendChild(tablaUsuarios);
                })

            }
        })
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const buscandoDatosEliminar = async (botonEliminarEl) => {
    try{
        let plantillaContrato = document.querySelector('#plantillaContrato');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let idBusqueda = botonEliminarEl.attributes.dataelim.value;
        fetch(`aborusuarios/contratoUsuarioBorrar/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas==null || respuestas.estatus=='error'){

            }else{
                labelTitleModal.innerHTML='Eliminando Usuario';
                const grupoUsuario = document.createElement('div');
                const grupoDetalles = document.createElement('div');
                grupoUsuario.classList.add('border','col-12','p-2','bg-white','fuente-12p','mb-1');
                grupoDetalles.classList.add('border','col-12','p-2','bg-white','fuente-12p','mb-1');
                respuestas[0].forEach(usuario => {
                    grupoUsuario.innerHTML=`
                        <input type="hidden" id="textCliente" name="textCliente" value="${usuario.idTablePk}">
                        <div class="row">
                            <div class="col-md-6"><small>Nombre:</small> ${usuario.CLIENTE}</div>
                            <div class="col-md-6"><small>Fecha Registro:</small> ${usuario.FECHCAPT_CLIEN}</div>
                        </div>
                        <div class=""><small>Contrato:</small> ${usuario.CONTRATO_CCONT}</div>
                        <div class=""><small>Tipo Contrato:</small> ${usuario.DESCRIPCION_CONT}</div>
                        <div class=""><small>Ubicación:</small> ${usuario.CALLE_UBIC} ${usuario.NEXTE_UBIC} ${usuario.NINTE_UBIC}</div>
                    `

                })
                const tablaDetalles = document.createElement('table');
                tablaDetalles.classList.add('table','table-sm','table-bordered');
                tablaDetalles.innerHTML=`
                    <thead>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Costo</th>
                        <th>Cantid</th>
                        <th>Total</th>
                    </thead>
                `;
                const cuerpoTablaDetalles = document.createElement('tbody');
                respuestas[1].forEach(detalles => {
                    const filaTablaDetalles = document.createElement('tr');
                    filaTablaDetalles.innerHTML=`
                        <td>${detalles.CODIGO_DETA}</td>
                        <td>${detalles.DESCRIPCION_CONC}</td>
                        <td>${detalles.COSTO_DETA}</td>
                        <td>${detalles.CANTIDAD_DETA}</td>
                        <td>${detalles.TOTAL_DETA}</td>
                    `;
                    cuerpoTablaDetalles.appendChild(filaTablaDetalles);
                })
                tablaDetalles.appendChild(cuerpoTablaDetalles);
                grupoDetalles.appendChild(tablaDetalles);
                plantillaContrato.innerHTML='';
                plantillaContrato.appendChild(grupoUsuario);
                plantillaContrato.appendChild(grupoDetalles);

            }
        })
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const eliminarUsuarios = async () => {
    try{
        return Swal.fire({
            title: 'Tramites',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea eliminar este registro mal capturado?',
        })
        .then((result) => {
            if(result.isConfirmed){
                let textCliente = document.querySelector('#textCliente');
                let plantillaContrato = document.querySelector('#plantillaContrato');
                fetch(`aborusuarios/eliminarUsuarioContrato/${textCliente.value}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: `${respuestas.button}`,
                            confirmButtonColor: '#9C0000',
                            html: respuestas.text,
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    }else{
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: `${respuestas.button}`,
                            confirmButtonColor: '#009C06',
                            html: respuestas.text,
                            showConfirmButton: false,
                            timer: 1500,
                        }).then((result) => {
                            if((result.isDismissed)){
                                obtenerListadoUsuarios();
                                botonCancelar.click();
                                plantillaContrato.innerHTML='';
                            }
                        })
                    }
                })
            }
        })
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}
