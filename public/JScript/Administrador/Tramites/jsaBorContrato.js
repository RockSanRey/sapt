let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try {
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        busquedaUsuarios.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Buscar usuario que se eliminará contrato</li>
                </ol>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control form-control-sm" name="textUsuario" id="textUsuario" placeholder="Buscar Usuario" autocomplete="off" autofocus/>
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textUsuario = document.querySelector('#textUsuario');
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        textUsuario.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                buscarUsuarioInformacion(textIdUsuario);
            }else if(e.keyCode >= 64 && e.keyCode <= 90){
                completarBusquedaUsuarios(textUsuario);
            }
        })
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        butonBuscarUsuario.addEventListener('click', () => {
            buscarUsuarioInformacion(textIdUsuario);
        })
        textUsuario.focus();

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const completarBusquedaUsuarios = async (textUsuario) => {
    try{
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        userListComplete.innerHTML='';
        if(textUsuario.value=='' || textUsuario.value==null){
            userListComplete.innerHTML='';
        }else{
            let idBusqueda = textUsuario.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`atramites/autocompletarUsuario/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    userListComplete.innerHTML='';
                    const listadoUl = document.createElement('ul');
                    listadoUl.innerHTML='';
                    listadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(usuario => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= usuario.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdUsuario.value=usuario.IDUSUA_CLIEN;
                            textUsuario.value = usuario.NOMBRE;
                            userListComplete.innerHTML='';
                        })
                        listadoUl.appendChild(listadoItemUl);
                    })
                    userListComplete.appendChild(listadoUl);

                }else{
                    userListComplete.innerHTML='';

                }
            })

        }

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const buscarUsuarioInformacion = async (textIdUsuario) => {
    try{
        if(textIdUsuario.value=='' || textIdUsuario.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el usuario a buscar',
            })
        }else{
            let idBusqueda = textIdUsuario.value;
            let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
            let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
            datosUsuarioDetalle.innerHTML=cargaAnimacion;
            fetch(`aborcontrato/llenarTablaUsuarioContratos/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });

                }else{
                    datosUsuarioDetalle.innerHTML='';
                    respuestas[0].forEach(usuarios => {
                        const grupoUsuario = document.createElement('div');
                        grupoUsuario.innerHTML=`
                            <div class="form-group">
                                <div class="form-control form-control-sm"><small>Usuario:</small> ${usuarios.NOMBRE}</div>
                            </div>
                        `;
                        datosUsuarioDetalle.appendChild(grupoUsuario);
                    })
                    const tablaContratos = document.createElement('table')
                    tablaContratos.classList.add('table','table-sm','table-hover','table-bordered');
                    tablaContratos.innerHTML=`
                        <thead>
                            <tr>
                                <th scope="col" class="col">Detalles</th>
                                <th scope="col" class="text-center">Acciones</th>
                            </tr>
                        </thead>
                    `;
                    const cuerpoTablaContratos = document.createElement('tbody');
                    busquedaUsuarios.innerHTML=`
                        <div class="card-text text-justify">
                            <ol class="col-12 fuente-12p" start="2">
                                <li>Hacer clic en el boton eliminar contrato <span class="btn-danger btn-sm"><i class="fa fa-eraser"></i></span>.</li>
                            </ol>
                        </div>
                        <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="${idBusqueda}" />
                        <button class="btn btn-sm btn-secondary" id="botonNuevaBusqueda" name="botonNuevaBusqueda" >Nueva busqueda <i class="fas fa-user-plus"></i></button>
                    `;
                    respuestas[1].forEach(contratos => {
                        const filaTablaContratos = document.createElement('tr');
                        const columnaDetalles = document.createElement('td');
                        columnaDetalles.innerHTML=`
                            <div class="row fuente-12p">
                                <div class="col-md-3 col-12"><small>Contrato:</small> ${contratos.CONTRATO_CCONT}</div>
                                <div class="col-md-6 col-12"><small>Ubicación:</small> ${contratos.CALLES}, ${contratos.COLONIA_CODPOS}, ${contratos.NOMBRE_MUNIC}</div>
                                <div class="col-md-3 col-12"><div class="badge badge-info">Tipo Contrato: ${contratos.DESCRIPCION_CONT}</div>
                            </div>
                        `;
                        filaTablaContratos.appendChild(columnaDetalles);
                        const columnaAcciones = document.createElement('td');
                        const botonEliminarElemento = document.createElement('button');
                        botonEliminarElemento.classList.add('btn','btn-danger','btn-sm');
                        botonEliminarElemento.setAttribute('dataelim',contratos.idTablePk);
                        botonEliminarElemento.setAttribute('id','botonEliminarEl');
                        botonEliminarElemento.innerHTML = '<i class="fa fa-eraser"></i>';
                        botonEliminarElemento.addEventListener('click',() => {
                            buscarEliminarContrato(botonEliminarElemento);
                        });
                        const grupoAcciones = document.createElement('div');
                        grupoAcciones.classList.add('btn-group');
                        grupoAcciones.appendChild(botonEliminarElemento);
                        columnaAcciones.appendChild(grupoAcciones);
                        filaTablaContratos.appendChild(columnaAcciones);
                        cuerpoTablaContratos.appendChild(filaTablaContratos);
                    })
                    tablaContratos.appendChild(cuerpoTablaContratos);
                    datosUsuarioDetalle.appendChild(tablaContratos);
                }
                let botonNuevaBusqueda = document.querySelector('#botonNuevaBusqueda');
                botonNuevaBusqueda.addEventListener('click', ()=> {
                    datosUsuarioDetalle.innerHTML='';
                    plantillaBusqueda();
                })
            })

        }

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const buscarEliminarContrato = async (botonEliminarElemento) => {
    try {
        let idBusqueda = botonEliminarElemento.attributes.dataelim.value;
        let textIdUsuario = document.querySelector('#textIdUsuario');
        Swal.fire({
            title: 'Editar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, eliminar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea eliminar este contrato y derivados?',
        })
        .then((result) => {
            if(result.isConfirmed){
                fetch(`aborcontrato/eliminarContratos/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: respuestas.button,
                            confirmButtonColor: '#9C0000',
                            html: respuestas.text,
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    }else{
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: respuestas.button,
                            confirmButtonColor: '#009C06',
                            html: respuestas.text,
                            showConfirmButton: false,
                            timer: 1500,
                        }).then((result) => {
                            if((result.isDismissed)){
                                botonEliminarElemento.parentNode.parentNode.parentNode.remove();
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