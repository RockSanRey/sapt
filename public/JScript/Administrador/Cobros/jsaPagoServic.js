let botonCancelar = document.querySelector('#botonCancelar');
let botonCooperacion = document.querySelector('#botonCooperacion');
let botonAddAnticipo = document.querySelector('#botonAddAnticipo');
let botonCompletar = document.querySelector('#botonCompletar');
let botonTemporal = document.querySelector('#botonTemporal');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    buscadorUsuarios();
    botonAddAnticipo.addEventListener('click', () => {
        agregarMesesAnticipados();
    })
    botonCooperacion.addEventListener('click', () => {
        modificarCoperacion();
    })
    botonCompletar.addEventListener('click', () => {
        pagarDeudaCompleta();
    })
    botonTemporal.addEventListener('click', () => {
        pagarDeudaParcial();
    })
    botonCancelar.addEventListener('click', () => {
        let pagoCobro = document.querySelector('#pagoCobro')
        let modifCoperacion = document.querySelector('#modifCoperacion')
        let listadoAnticipados = document.querySelector('#listadoAnticipados')
        pagoCobro.innerHTML='';
        modifCoperacion.innerHTML='';
        listadoAnticipados.innerHTML='';
    })
})

const buscadorUsuarios = async () => {
    try{
        let buscadorUsuarioPago = document.querySelector('#buscadorUsuarioPago');
        buscadorUsuarioPago.innerHTML=`
            <div class="input-group mb-3">
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                <input type="text" class="form-control form-control-lg" name="textUsuario" id="textUsuario" placeholder="Escribe N° Usuario" autocomplete="off" autofocus/>
                <div id="userListComplete" class="autocompletados-lg"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textUsuario = document.querySelector('#textUsuario');
        let userListComplete = document.querySelector('#userListComplete');
        textUsuario.addEventListener('keyup', (e) => {
            if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode==8){
                userListComplete.innerHTML='';
                completarBusquedaUsuarios(textUsuario);
            }
        })
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        butonBuscarUsuario.addEventListener('click', () => {
            buscarUsuarioInformacion(textIdUsuario);
        })
        let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
        datosUsuarioDetalle.classList.remove('tabla-contenedor');
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
            fetch(`apagoservic/autoCompletarUsuario/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    userListComplete.innerHTML='';
                    const ListadoUl = document.createElement('ul');
                    ListadoUl.innerHTML='';
                    ListadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(usuario => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= usuario.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdUsuario.value=usuario.IDUSUA_CLIEN;
                            textUsuario.value = usuario.NOMBRE;
                            userListComplete.innerHTML='';
                        })
                        ListadoUl.appendChild(listadoItemUl);
                    })
                    userListComplete.appendChild(ListadoUl);

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
            let datosUsuarioPago = document.querySelector('#datosUsuarioPago');
            let buscadorUsuarioPago = document.querySelector('#buscadorUsuarioPago');
            let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
            fetch(`apagoservic/cargarUsuarioGenerales/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error'){
                    datosUsuarioPago.innerHTML='';
                    buscadorUsuarios();
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    })
                    
                }else{
                    buscadorUsuarioPago.innerHTML='';
                    respuestas[0].forEach(usuario => {
                        datosUsuarioPago.innerHTML='';
                        datosUsuarioPago.innerHTML=`
                            <div class="row">
                                <div class="form-group col-md-12 col-12"><div class="form-control form-control-sm"><small>Usuario:</small> <b>${usuario.NOMBRE}</b></div></div>
                            </div>
                            <div id="listaContratos"></div>
                            <div class="row" id="interaccionBotones">
                                <input type="hidden" id="textMovimiento" name="textMovimiento" value="" />
                                <div class="form-group col-md-4 col-12 btn-group">
                                    <button type="button" class="btn btn-sm btn-secondary mb-3" id="botonResetear">Limpiar</button>
                                    <button type="button" class="btn btn-sm btn-success mb-3 d-none" id="botonCobrar">Hacer Cobro</button>
                                    <button type="button" class="btn btn-sm btn-success mb-3 d-none" id="botonPagoParcial">Hacer Cobro</button>
                                    <button type="button" class="btn btn-sm btn-warning mb-3 d-none" id="botonParcial">Cobro Parcial</button>
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="input-group mb-3">
                                        <select name="textConceptos" id="textConceptos" class="custom-select custom-select-sm"><select>
                                        <div class="input-group-append">
                                            <button id="botonAgregarMultas" class="btn btn-outline-success btn-sm" disabled>Multas <i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="input-group mb-3">
                                        <div class="input-group-append">
                                            <button id="botonAgregarAnticipo" class="btn btn-outline-success btn-sm" disabled>Adenlantar Meses <i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-md-8 col-12">
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="text-warning h1 font-weight-bold text-right" id="textoDeudaTotal"></div>
                                </div>
                            </div>
                        `;
                        let textMovimiento = document.querySelector('#textMovimiento');
                        let textConceptos = document.querySelector('#textConceptos');
                        let botonResetear = document.querySelector('#botonResetear');
                        let botonCobrar = document.querySelector('#botonCobrar');
                        let botonParcial = document.querySelector('#botonParcial');
                        let botonPagoParcial = document.querySelector('#botonPagoParcial');
                        let botonAgregarMultas = document.querySelector('#botonAgregarMultas');
                        let botonAgregarAnticipo = document.querySelector('#botonAgregarAnticipo');
                        botonResetear.addEventListener('click', () => {
                            datosUsuarioPago.innerHTML='';
                            datosUsuarioDetalle.innerHTML='';
                            labelsParciales.innerHTML='';
                            buscadorUsuarios();
                        })
                        botonCobrar.setAttribute('data-toggle','modal');
                        botonCobrar.setAttribute('data-target','#formCobroDeuda');
                        botonCobrar.addEventListener('click', () => {
                            cargarTotalPagoCobro(textMovimiento);
                        })
                        botonParcial.addEventListener('click', () => {
                            let idBusqueda = textMovimiento.value;
                            cargarDeudasSelectiva(idBusqueda);
                        })
                        botonPagoParcial.setAttribute('data-toggle','modal');
                        botonPagoParcial.setAttribute('data-target','#formCobroDeuda');
                        botonPagoParcial.addEventListener('click', () => {
                            cargarParcialPagoCobro();
                        })
                        botonAgregarAnticipo.setAttribute('data-toggle','modal');
                        botonAgregarAnticipo.setAttribute('data-target','#formCobroDeuda');
                        botonAgregarAnticipo.addEventListener('click', () => {
                            llenarListaAnticipados();
    
                        })
                        botonAgregarMultas.addEventListener('click', () => {
                            if(validarConceptos()){
                                botonAgregarMultas.innerHTML='Agregando... '+cargaAnimacion;
                                const datosAgregados = {
                                    textMovimiento: textMovimiento.value,
                                    textConceptos: textConceptos.value,
                                };
                                fetch('apagoservic/agregarConceptosDetalle', {
                                    method: 'POST',
                                    body: JSON.stringify(datosAgregados),
                                    headers: {
                                        "Content-type": "application/json",
                                    },
                                })
                                .then(respRender => respRender.json())
                                .then(respuestas => {
                                    botonAgregarMultas.innerHTML='Multas <i class="fas fa-plus">';
                                    if(respuestas.estatus=='error' || respuestas.estatus=='duplicado'){
                                        return Swal.fire({
                                            title: respuestas.title,
                                            icon: respuestas.icon,
                                            confirmButtonText: respuestas.button,
                                            confirmButtonColor: '#9C0000',
                                            html: respuestas.text,
                                        })
                                    }else{
                                        let idBusqueda = document.querySelector('#textMovimiento').value;
                                        llenarActualizaDetalle(idBusqueda);
                                        textConceptos.classList.remove('is-valid');
                                        textConceptos.value='';
                                        return Swal.fire({
                                            title: respuestas.title,
                                            icon: respuestas.icon,
                                            confirmButtonText: respuestas.button,
                                            confirmButtonColor: '#009C06',
                                            html: respuestas.text,
                                        })
                                    }
                                })
                            }
    
                        })
                                            
                    })
                    let listaContratos = document.querySelector('#listaContratos');
                    const tablaContratos = document.createElement('table');
                    tablaContratos.classList.add('table','table-sm','table-hover');
                    respuestas[1].forEach(contratos => {
                        const filatablaContratos = document.createElement('tr');
                        const columnaContratos = document.createElement('td');
                        columnaContratos.classList.add('col-11');
                        columnaContratos.innerHTML=`
                            <div class="row">
                                <div class="col-md-2 col-12 fuente-12p">Contrato: <strong>${contratos.CONTRATO_CCONT}</strong></div>
                                <div class="col-md-10 col-12 fuente-12p">Dirección del contrato ${contratos.DIRECCION} | ${contratos.DESCRIPCION_CTARI}</div>
                            </div>
                        `;
                        filatablaContratos.appendChild(columnaContratos);
                        const botonVerConceptos = document.createElement('button');
                        botonVerConceptos.setAttribute('dataview',contratos.idTablePk);
                        botonVerConceptos.setAttribute('id','botonVerSel');
                        if(contratos.ESTATUS_CCONT=='BAJA' || contratos.ESTATUS_CCONT=='INAC'){
                            botonVerConceptos.setAttribute('disabled','disabled');
                            botonVerConceptos.classList.add('btn','btn-white','btn-sm');
                            botonVerConceptos.innerHTML='<i class="fas fa-eye-slash"></i> Baja';
                        }else {
                            botonVerConceptos.innerHTML='<i class="fas fa-eye"></i> Detalles';
                            botonVerConceptos.classList.add('btn','btn-info','btn-sm');
                        }
                        botonVerConceptos.addEventListener('click', () => {
                            buscarDetallePagos(botonVerConceptos);
                        })
                        const columnaBoton = document.createElement('td');
                        columnaBoton.classList.add('col-md-2')
                        columnaBoton.appendChild(botonVerConceptos);
                        filatablaContratos.appendChild(columnaBoton);
                        tablaContratos.appendChild(filatablaContratos);
                        listaContratos.appendChild(tablaContratos);
                    })
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

const buscarDetallePagos = async (botonVerConceptos) => {
    try{
        Swal.fire({
            title: 'Cobros',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, Visualizar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea ver el detalle de adeudos de este contrato?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonVerConceptos.attributes.dataview.value;
                let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
                let botonCobrar = document.querySelector('#botonCobrar');
                let botonParcial = document.querySelector('#botonParcial');
                let botonPagoParcial = document.querySelector('#botonPagoParcial')
                let botonAgregarMultas = document.querySelector('#botonAgregarMultas');
                let botonAgregarAnticipo = document.querySelector('#botonAgregarAnticipo');
                let botonResetear = document.querySelector('#botonResetear');
                let textMovimiento = document.querySelector('#textMovimiento');
                let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
                let labelsParciales = document.querySelector('#labelsParciales');
                textMovimiento.value=idBusqueda;
                botonTemporal.classList.add('d-none');
                botonCompletar.classList.remove('d-none');
                botonCooperacion.classList.add('d-none');
                botonPagoParcial.classList.add('d-none');
                botonResetear.classList.remove('btn-success');
                botonResetear.classList.add('btn-secondary');
                botonResetear.innerHTML='Limpiar';
                datosUsuarioDetalle.innerHTML=cargaAnimacion;
                fetch(`apagoservic/cargarDeudasDetalle/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    datosUsuarioDetalle.innerHTML='';
                    labelsParciales.innerHTML='';
                    datosUsuarioDetalle.classList.add('tabla-contenedor');
                    const tablaDetallesPago = document.createElement('table');
                    tablaDetallesPago.classList.add('table','table-sm','table-hover','fuente-12p');
                    tablaDetallesPago.innerHTML=`
                        <thead>
                            <th class="col">Conceptos</th>
                            <th>Acciones</th>
                        </thead>
                    `;
                    const cuerpoTablaDetalles = document.createElement('tbody');
                    if(respuestas[0]==null){
                        botonAgregarMultas.removeAttribute('disabled');
                        botonAgregarAnticipo.removeAttribute('disabled');
                        const filaDetallesPago = document.createElement('tr');
                        const columnaMensaje = document.createElement('td');
                        columnaMensaje.innerHTML='Sin deudas registradas';
                        filaDetallesPago.appendChild(columnaMensaje);
                        const columnaAcciones = document.createElement('td');
                        const botonHistorico = document.createElement('button');
                        botonHistorico.classList.add('btn','btn-light','btn-sm');
                        botonHistorico.setAttribute('datahistor',idBusqueda);
                        botonHistorico.setAttribute('data-toggle','modal');
                        botonHistorico.setAttribute('data-target','#formCobroDeuda');
                        botonHistorico.innerHTML='<i class="fas fa-eye"></i> Ver Histórico';
                        botonHistorico.addEventListener('click', () => {
                            verHistoricoPagado(botonHistorico);
                        })
                        columnaAcciones.appendChild(botonHistorico);
                        filaDetallesPago.appendChild(columnaAcciones);
                        cuerpoTablaDetalles.appendChild(filaDetallesPago);
                        tablaDetallesPago.appendChild(cuerpoTablaDetalles);
                        datosUsuarioDetalle.appendChild(tablaDetallesPago);
                        let textConceptos= document.querySelector('#textConceptos')
                        llenarComboConceptos(textConceptos);

                    }else{
                        botonAgregarMultas.removeAttribute('disabled');
                        botonAgregarAnticipo.removeAttribute('disabled');
                        botonCobrar.classList.remove('d-none');
                        botonParcial.classList.remove('d-none');

                        respuestas[0].forEach(detallePago => {
                            const filasDetalles = document.createElement('tr');
                            const columnaDetalles = document.createElement('td');
                            columnaDetalles.innerHTML=`
                                <div class="row">
                                    <div class="col-md-2 col-12">${detallePago.CODIGO_DETA}</div>
                                    <div class="col-md-5 col-12">${detallePago.DESCRIPCION_CONC}</div>
                                    <div class="col-md-1 col-2">${parseInt(detallePago.CANTIDAD_DETA).toFixed(0)}</div>
                                    <div class="col-md-2 col-5">${'$'+parseFloat(detallePago.COSTO_DETA).toFixed(2)}</div>
                                    <div class="col-md-2 col-5">${'$'+parseFloat(detallePago.TOTAL_DETA).toFixed(2)}</div>
                                </div>
                            `;
                            filasDetalles.appendChild(columnaDetalles);

                            const columnaAcciones = document.createElement('td');
                            const botonEliminarServ = document.createElement('button');
                            botonEliminarServ.classList.add('btn','btn-danger','btn-sm');
                            botonEliminarServ.setAttribute('dataeliminar',detallePago.idTablePk);
                            botonEliminarServ.setAttribute('id','botonEliminarServ');
                            botonEliminarServ.innerHTML = '<i class="fa fa-eraser"></i>';
                            botonEliminarServ.addEventListener('click',() => {
                                eliminarServicioCobro(botonEliminarServ);
                            });
                            if(detallePago.CODIGO_DETA=='COPABI' || detallePago.CODIGO_DETA=='CORTMAQ'){
                                const botonEditarServ = document.createElement('button');
                                botonEditarServ.classList.add('btn','btn-info','btn-sm');
                                botonEditarServ.setAttribute('dataeditar', detallePago.idTablePk);
                                botonEditarServ.setAttribute('id','botonEditarServ');
                                botonEditarServ.setAttribute('data-toggle','modal');
                                botonEditarServ.setAttribute('data-target','#formCobroDeuda');
                                botonEditarServ.innerHTML='<i class="fa fa-edit"></i>';
                                botonEditarServ.addEventListener('click', () => {
                                    editarServicioCobro(botonEditarServ);
                                })
                                columnaAcciones.classList.add('btn-group');
                                columnaAcciones.appendChild(botonEditarServ);
                            }
                            columnaAcciones.appendChild(botonEliminarServ);
                            filasDetalles.appendChild(columnaAcciones);
                            cuerpoTablaDetalles.append(filasDetalles);
                            tablaDetallesPago.appendChild(cuerpoTablaDetalles);
                            datosUsuarioDetalle.appendChild(tablaDetallesPago);
                        })
                        let textConceptos= document.querySelector('#textConceptos')
                        llenarComboConceptos(textConceptos);

                    }
                    respuestas[1].forEach(totales => {
                        let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTAL_DETA);
                        textoDeudaTotal.innerHTML=costoOrden;

                    })
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

const llenarComboConceptos = async (textConceptos) => {
    try{
        fetch('acatalogos/llenarComboConceptos')
        .then(respRender => respRender.json())
        .then(respuestas => {
            textConceptos.innerHTML='<option value="">Selecciona Multa</option>';
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(conceptos => {
                    const opcionElem = document.createElement('option');
                    opcionElem.setAttribute('value',conceptos.CLAVE_CONC);
                    opcionElem.classList.add('fuente-12p');
                    opcionElem.innerHTML=conceptos.DESCRIPCION_CONC+' - $'+parseFloat(conceptos.COSTO_CONC).toFixed(2);
                    textConceptos.appendChild(opcionElem);
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

const llenarListaAnticipados = async () => {
    try{
        let listadoAnticipados = document.querySelector('#listadoAnticipados');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let pagoCobro = document.querySelector('#pagoCobro');
        let comparador = document.querySelector('#textMovimiento').value;
        botonCooperacion.classList.add('d-none');
        botonCompletar.classList.add('d-none');
        botonTemporal.classList.add('d-none');
        botonAddAnticipo.classList.remove('d-none');
        labelTitleModal.innerHTML='Meses para anticipar';
        listadoAnticipados.innerHTML=cargaAnimacion;
        fetch(`acatalogos/llenarComboAnticipos/${comparador}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            pagoCobro.innerHTML='';
            listadoAnticipados.innerHTML=cargaAnimacion;
            if(respuestas.estatus=='error'){
                listadoAnticipados.innerHTML='Sin Datos';
            }else{
                listadoAnticipados.innerHTML='';
                const tablaAnticipos = document.createElement('table');
                tablaAnticipos.classList.add('table','table-hover','table-sm','fuente-12p');
                respuestas.forEach(conceptos => {
                    let costoMensual = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(conceptos.COSTO_CONC);
                    const filaAnticipos = document.createElement('tr');
                    const columnaDescripcion = document.createElement('td');
                    const labelAdelantosClicker = document.createElement('label');
                    labelAdelantosClicker.setAttribute('for',conceptos.CLAVE_CONC);
                    labelAdelantosClicker.setAttribute('role','button');
                    labelAdelantosClicker.innerHTML=' '+conceptos.DESCRIPCION_CONC+' '+costoMensual;
                    columnaDescripcion.appendChild(labelAdelantosClicker);
                    filaAnticipos.appendChild(columnaDescripcion);
                    const columnaAcciones = document.createElement('td');
                    const columnaClicker = document.createElement('div');
                    const inputAdelantosClicker = document.createElement('input');
                    inputAdelantosClicker.setAttribute('type','checkbox');
                    inputAdelantosClicker.setAttribute('id',conceptos.CLAVE_CONC);
                    inputAdelantosClicker.setAttribute('name','adelantos');
                    inputAdelantosClicker.setAttribute('value',conceptos.CLAVE_CONC);
                    columnaClicker.appendChild(inputAdelantosClicker);
                    columnaAcciones.appendChild(columnaClicker);
                    filaAnticipos.appendChild(columnaAcciones);
                    tablaAnticipos.appendChild(filaAnticipos);
                    listadoAnticipados.appendChild(tablaAnticipos);
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

const verHistoricoPagado = async (botonHistorico) => {
    try{
        let idBusqueda = botonHistorico.attributes.datahistor.value;
        let labelTitleModal = document.querySelector('#labelTitleModal');
        botonCooperacion.classList.add('d-none');
        botonCompletar.classList.add('d-none');
        botonAddAnticipo.classList.add('d-none');
        labelTitleModal.innerHTML='Ver Historial';
        fetch(`apagoservic/cargarHistoricoPagado/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            let listadoAnticipados = document.querySelector('#listadoAnticipados');
            let pagoCobro = document.querySelector('#pagoCobro');
            listadoAnticipados.classList.add('tabla-contenedor');
            listadoAnticipados.innerHTML='<div class="text-justify"><small>Se muestran los ultimos 13 movimientos que se cobraron del contrato:</small></div>';
            const tablaPagados = document.createElement('table');
            tablaPagados.classList.add('table','table-hove','table-sm','fuente-10p');
            pagoCobro.innerHTML='';
            respuestas.forEach(pagados => {
                let costoTotal = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(pagados.TOTAL_DETA);

                const filaPagados = document.createElement('tr');
                const columnaClave = document.createElement('td');
                columnaClave.innerHTML=pagados.CODIGO_DETA;
                filaPagados.appendChild(columnaClave);
                const columnaDescripcion = document.createElement('td');
                columnaDescripcion.innerHTML=pagados.DESCRIPCION_CONC;
                filaPagados.appendChild(columnaDescripcion);
                const columnaCantidad = document.createElement('td')
                columnaCantidad.innerHTML=parseFloat(pagados.CANTIDAD_DETA).toFixed(0);
                filaPagados.appendChild(columnaCantidad);
                const columnaCosto = document.createElement('td');
                columnaCosto.innerHTML=costoTotal;
                filaPagados.appendChild(columnaCosto);
                const columnaEstatus = document.createElement('td');
                columnaEstatus.innerHTML=`<span class="badge badge-success badge-pill fuente-12p">${pagados.DESCRIPCION_ESTAT}</span>`;
                filaPagados.appendChild(columnaEstatus);
                tablaPagados.appendChild(filaPagados);
                listadoAnticipados.appendChild(tablaPagados);
            })
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

const agregarMesesAnticipados = async () => {
    try{
        let textMovimiento = document.querySelector('#textMovimiento');
        let adelantos = document.querySelectorAll('input[name="adelantos"]:checked');
        let adelantosTemporal = [];
        for(let regis = 0; regis < adelantos.length; regis++){
            adelantosTemporal.push(adelantos[regis].value);
        }
        const datosAdelantos = {
            textMovimiento: textMovimiento.value,
            adelantos: adelantosTemporal,
        }
        fetch('pagoservicio/agregarAnticiposDetalle', {
            method: 'POST',
            body: JSON.stringify(datosAdelantos),
            headers: {
                "Content-type": "application/json",
            },
        })
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error' || respuestas.estatus=='duplicado'){
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#9C0000',
                    html: respuestas.text,
                })

            }else{
                let idBusqueda = textMovimiento.value;
                llenarActualizaDetalle(idBusqueda)
                botonCancelar.click();
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#009C06',
                    html: respuestas.text,
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

const llenarActualizaDetalle = async (idBusqueda) => {
    try{
        let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
        let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
        let botonCobrar = document.querySelector('#botonCobrar');
        let botonParcial = document.querySelector('#botonParcial');
        datosUsuarioDetalle.innerHTML=cargaAnimacion;
        fetch(`apagoservic/cargarDeudasDetalle/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            datosUsuarioDetalle.innerHTML='';
            datosUsuarioDetalle.classList.add('tabla-contenedor');
            textMovimiento.value=idBusqueda;
            const tablaDetallesPago = document.createElement('table');
            tablaDetallesPago.classList.add('table','table-sm','table-hover','fuente-12p');
            tablaDetallesPago.innerHTML=`
                <thead>
                    <th class="col">Concepto</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaDetalles = document.createElement('tbody');
            if(respuestas[0]==null){
                botonAgregarMultas.removeAttribute('disabled');
                botonAgregarAnticipo.removeAttribute('disabled');
                botonCobrar.classList.add('d-none');
                botonParcial.classList.add('d-none');
                const filaDetallesPago = document.createElement('tr');
                const columnaMensaje = document.createElement('td');
                columnaMensaje.innerHTML='Sin deudas registradas';
                filaDetallesPago.appendChild(columnaMensaje);
                const columnaAcciones = document.createElement('td');
                const botonHistorico = document.createElement('button');
                botonHistorico.classList.add('btn','btn-light','btn-sm');
                botonHistorico.setAttribute('datahistor',idBusqueda);
                botonHistorico.setAttribute('data-toggle','modal');
                botonHistorico.setAttribute('data-target','#formCobroDeuda');
                botonHistorico.innerHTML='<i class="fas fa-eye"></i> Ver Histórico';
                botonHistorico.addEventListener('click', () => {
                    verHistoricoPagado(botonHistorico);
                })
                columnaAcciones.appendChild(botonHistorico);
                filaDetallesPago.appendChild(columnaAcciones);
                cuerpoTablaDetalles.appendChild(filaDetallesPago);
                tablaDetallesPago.appendChild(cuerpoTablaDetalles);
                datosUsuarioDetalle.appendChild(tablaDetallesPago);

            }else{
                botonCobrar.classList.remove('d-none');
                botonParcial.classList.remove('d-none');
                respuestas[0].forEach(detallePago => {
                    const filasDetalles = document.createElement('tr');
                    const columnaDetalles = document.createElement('td');
                    columnaDetalles.innerHTML=`
                        <div class="row">
                            <div class="col-md-2 col-12">${detallePago.CODIGO_DETA}</div>
                            <div class="col-md-5 col-12">${detallePago.DESCRIPCION_CONC}</div>
                            <div class="col-md-1 col-2">${parseInt(detallePago.CANTIDAD_DETA).toFixed(0)}</div>
                            <div class="col-md-2 col-5">${'$'+parseFloat(detallePago.COSTO_DETA).toFixed(2)}</div>
                            <div class="col-md-2 col-5">${'$'+parseFloat(detallePago.TOTAL_DETA).toFixed(2)}</div>
                        </div>
                    `;
                    filasDetalles.appendChild(columnaDetalles);
                    const columnaAcciones = document.createElement('td');
                    const botonEliminarServ = document.createElement('button');
                    botonEliminarServ.classList.add('btn','btn-danger','btn-sm');
                    botonEliminarServ.setAttribute('dataeliminar',detallePago.idTablePk);
                    botonEliminarServ.setAttribute('id','botonEliminarServ');
                    botonEliminarServ.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarServ.addEventListener('click',() => {
                        eliminarServicioCobro(botonEliminarServ);
                    });
                    if(detallePago.CODIGO_DETA=='COPABI' || detallePago.CODIGO_DETA=='CORTMAQ'){
                        const botonEditarServ = document.createElement('button');
                        botonEditarServ.classList.add('btn','btn-info','btn-sm');
                        botonEditarServ.setAttribute('dataeditar', detallePago.idTablePk);
                        botonEditarServ.setAttribute('id','botonEditarServ');
                        botonEditarServ.setAttribute('data-toggle','modal');
                        botonEditarServ.setAttribute('data-target','#formCobroDeuda');
                        botonEditarServ.innerHTML='<i class="fa fa-edit"></i>';
                        botonEditarServ.addEventListener('click', () => {
                            editarServicioCobro(botonEditarServ);
                        })
                        columnaAcciones.classList.add('btn-group');
                        columnaAcciones.appendChild(botonEditarServ);
                    }
                    columnaAcciones.appendChild(botonEliminarServ);
                    filasDetalles.appendChild(columnaAcciones);
                    cuerpoTablaDetalles.append(filasDetalles);
                    tablaDetallesPago.appendChild(cuerpoTablaDetalles);
                    datosUsuarioDetalle.appendChild(tablaDetallesPago);
                })
            }
            respuestas[1].forEach(totales => {
                let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTAL_DETA);
                textoDeudaTotal.innerHTML=costoOrden;
            })
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

const eliminarServicioCobro = async (botonEliminarServ) => {
    try{
        Swal.fire({
            title: 'Eliminar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, eliminar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea eliminar los datos este concepto?',
        })
        .then((result)=>{
            if(result.isConfirmed){
                let textMovimiento = document.querySelector('#textMovimiento')
                let idBusqueda = botonEliminarServ.attributes.dataeliminar.value;
                botonEliminarServ.innerHTML=cargaAnimacion;
                fetch(`apagoservic/eliminarDetallesPago/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    botonEliminarServ.innerHTML='<i fas fa-eraser></i>';
                    if(respuestas.estatus=='error'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: respuestas.button,
                            confirmButtonColor: '#9C0000',
                            html: respuestas.text,
                        })
                    }else{
                        botonEliminarServ.parentNode.parentNode.remove();
                        let idBusqueda = textMovimiento.value;
                        llenarActualizaDetalle(idBusqueda);
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: respuestas.button,
                            confirmButtonColor: '#009C06',
                            html: respuestas.text,
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

const editarServicioCobro = async (botonEditarServ) => {
    try {
        let idBusqueda = botonEditarServ.attributes.dataeditar.value;
        let modifCoperacion = document.querySelector('#modifCoperacion');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        botonCooperacion.classList.remove('d-none');
        botonTemporal.classList.add('d-none');
        botonCompletar.classList.add('d-none');
        botonAddAnticipo.classList.add('d-none');
        modifCoperacion.innerHTML=cargaAnimacion;
        labelTitleModal.innerHTML='Modificar Concepto';
        fetch(`apagoservic/buscarCooperacion/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas==null){

            }else {
                respuestas.forEach(coperacion => {
                    modifCoperacion.innerHTML=`
                        <div class="form-group">
                            <div class="form-control form-control-sm">${coperacion.DESCRIPCION_CONC}</div>
                            <input type="hidden" value="${coperacion.CODIGOCAMBIO}" name="textCodigoCoperacion" id="textCodigoCoperacion"/>
                        </div>
                        <div class="row">
                            <div class="form-group col-6">
                                <input type="number" class="form-control form-control-sm" name="textCantidad" id="textCantidad" value="${coperacion.CANTIDAD_DETA}" placeholder="Cant." />
                            </div>
                            <div class="form-group col-6">
                                <input type="text" class="form-control form-control-sm" id="textCoperacion" name="textCoperacion" value="${coperacion.COSTO_DETA}" placeholder="Costo" />
                            </div>
                        </div>
                    `;
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

const modificarCoperacion = async () => {
    try {
        if(validarCoperacion() && validarCantidad()){
            let textCodigoCoperacion = document.querySelector('#textCodigoCoperacion');
            let textCantidad = document.querySelector('#textCantidad');
            let textCoperacion = document.querySelector('#textCoperacion');
            const cooperaciones = {
                textCodigoCoperacion: textCodigoCoperacion.value,
                textCantidad: textCantidad.value,
                textCoperacion: textCoperacion.value,
            }
            fetch('apagoservic/modificarCoperacion', {
                method: 'POST',
                body: JSON.stringify(cooperaciones),
                headers: {
                    "Content-type": "application/json",
                },

            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='duplicado'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    })

                }else{
                    let idBusqueda = textMovimiento.value;
                    llenarActualizaDetalle(idBusqueda)
                    botonCancelar.click();
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    })
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

const cargarTotalPagoCobro = async (textMovimiento) => {
    try{
        let idBusqueda = textMovimiento.value;
        let listadoAnticipados = document.querySelector('#listadoAnticipados');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let pagoCobro = document.querySelector('#pagoCobro');
        botonCooperacion.classList.add('d-none');
        botonCompletar.classList.remove('d-none');
        botonTemporal.classList.add('d-none');
        botonAddAnticipo.classList.add('d-none');
        listadoAnticipados.classList.remove('tabla-contenedor');
        labelTitleModal.innerHTML='Pago Total';
        pagoCobro.innerHTML=cargaAnimacion;
        fetch(`apagoservic/buscarTotalPago/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas==null){

            }else{
                respuestas.forEach(totales => {
                    let totalCobrar = 0;
                    if(totales.TOTAL_DETA==null){
                        totalCobrar=parseFloat(0);
                        botonCompletar.setAttribute('disabled','disabled');
                    }else{
                        totalCobrar=parseFloat(totales.TOTAL_DETA).toFixed(2);
                        botonCompletar.removeAttribute('disabled','disabled');
                    }
                    pagoCobro.innerHTML=`
                        <div class="form-group row">
                            <label for="textTotal" class="col-sm-4 col-form-label">Total a Pagar:</label>
                            <div class="col-sm-8">
                                <input type="hidden" id="textTotal" name="textTotal" value="${totalCobrar}">
                                <div type="hidden" class="form-control form-control-sm text-success text-right font-weight-bold">${parseFloat(totales.TOTAL_DETA).toFixed(2)}</div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="textMetodo" class="col-sm-4 col-form-label">Metodo pago:</label>
                            <div class="col-sm-8">
                                <select name="textMetodo" id="textMetodo" class="custom-select custom-select-sm"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="textRecibo" class="col-sm-4 col-form-label">Recibido:</label>
                            <div class="col-sm-8">
                                <input type="number" name="textRecibo" id="textRecibo" class="form-control form-control-sm text-right font-weight-bold" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="textCambio" class="col-sm-4 col-form-label">Cambio:</label>
                            <div class="col-sm-8">
                                <input type="text" readonly name="textCambio" id="textCambio" class="form-control form-control-sm text-warning text-right font-weight-bold" />
                            </div>
                        </div>
                    `;
                    let textTotal = document.querySelector('#textTotal');
                    let textMetodo = document.querySelector('#textMetodo');
                    let textRecibo = document.querySelector('#textRecibo');
                    textMetodo.innerHTML=`
                        <option value="">Método pago</option>
                        <option value="EFEC">Efectivo</option>
                        <option value="TDEB">T. Debito</option>
                        <option value="TCRE">T. Crédito</option>
                        <option value="TSPE">Trans. Interbancaria SPEI</option>
                    `;
                    textMetodo.addEventListener('change', () => {
                        if(textMetodo.value=='' || textMetodo.value==null){
                            return Swal.fire({
                                title: 'Campo no válido',
                                icon: 'warning',
                                confirmButtonColor: '#9C0000',
                                confirmButtonText: 'Verificar',
                                html: 'Seleccione un método de pago a utilizar.',
                            })

                        }else{
                            textRecibo.focus();
                        }
                    });
                    textRecibo.addEventListener('focusout', () => {
                        let textCambio = document.querySelector('#textCambio');
                        let calculoCambio = 0;
                        if(textMetodo.value=='' || textMetodo.value==null){
                            return Swal.fire({
                                title: 'Campo no válido',
                                icon: 'warning',
                                confirmButtonColor: '#9C0000',
                                confirmButtonText: 'Verificar',
                                html: 'Seleccione un método de pago a utilizar.',
                            })
                        }else if(textRecibo.value=='' || textRecibo.value==null){
                        }else if(textRecibo.value < textTotal.value){
                            return Swal.fire({
                                title: 'Campo no válido',
                                icon: 'warning',
                                confirmButtonColor: '#9C0000',
                                confirmButtonText: 'Verificar',
                                html: 'No se puede recibir menos dinero de lo que debe.',
                            })
                        }else{
                            calculoCambio = parseFloat(textRecibo.value)-parseFloat(textTotal.value);
                            textCambio.value=parseFloat(calculoCambio).toFixed(2);
                        }
                    })
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

const pagarDeudaCompleta = async () => {
    try {
        if(validarMetodo() && validarRecibo()){
            Swal.fire({
                title: 'Cobrar',
                icon: 'question',
                confirmButtonColor: '#009C06',
                confirmButtonText: 'Si, Cobrar',
                showCancelButton: true,
                cancelButtonColor: '#9C0000',
                cancelButtonText: 'No, mejor no',
                html: '¿Desea hacer el cobro de este servicio?',
            })
            .then((result)=>{
                if(result.isConfirmed){
                    let textMovimiento = document.querySelector('#textMovimiento');
                    let textTotal = document.querySelector('#textTotal');
                    let textMetodo = document.querySelector('#textMetodo');
                    let textRecibo = document.querySelector('#textRecibo');
                    let textCambio = document.querySelector('#textCambio');
                    let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
                    let interaccionBotones = document.querySelector('#interaccionBotones');
                    let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
                    let labelsParciales = document.querySelector('#labelsParciales');
                    datosUsuarioDetalle.innerHTML=cargaAnimacion;
                    const datosPagos = {
                        textMovimiento: textMovimiento.value,
                        textTotal: textTotal.value,
                        textMetodo: textMetodo.value,
                        textRecibo: textRecibo.value,
                        textCambio: textCambio.value,
                    }
                    fetch('apagoservic/realizarPagoCuenta', {
                        method: 'POST',
                        body: JSON.stringify(datosPagos),
                        headers: {
                            "Content-type": "application/json",
                        },
                    })
                    .then(respRender => respRender.json())
                    .then(respuestas => {
                        if(respuestas.estatus=='error'){
                            return Swal.fire({
                                title: respuestas.title,
                                icon: respuestas.icon,
                                confirmButtonText: respuestas.button,
                                confirmButtonColor: '#9C0000',
                                html: respuestas.text,
                            })

                        }else{
                            textoDeudaTotal.innerHTML='';
                            interaccionBotones.innerHTML=`
                                <input type="hidden" id="textMovimiento" name="textMovimiento" value="${textMovimiento.value}" />
                                <div class="form-group col-md-4 col-12 btn-group">
                                    <button type="button" class="btn btn-sm btn-success mb-3" id="botonResetear">Nuevo Cobro</button>
                                    <button type="button" class="btn btn-sm btn-success mb-3 d-none" id="botonCobrar">Hacer Cobro</button>
                                    <button type="button" class="btn btn-sm btn-success mb-3 d-none" id="botonPagoParcial">Hacer Cobro</button>
                                    <button type="button" class="btn btn-sm btn-warning mb-3 d-none" id="botonParcial">Cobro Parcial</button>
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="input-group mb-3">
                                        <select name="textConceptos" id="textConceptos" class="custom-select custom-select-sm"><select>
                                        <div class="input-group-append">
                                            <button id="botonAgregarMultas" class="btn btn-outline-success btn-sm" disabled>Multas <i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="input-group mb-3">
                                        <div class="input-group-append">
                                            <button id="botonAgregarAnticipo" class="btn btn-outline-success btn-sm" disabled>Adenlantar Meses <i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                            `;
                            const tablaReciboPago = document.createElement('table');
                            tablaReciboPago.classList.add('table','table-sm','table-hover','fuente-12p');
                            tablaReciboPago.innerHTML=`
                                <thead>
                                    <th>Folio</th>
                                    <th class="col">Descripción</th>
                                    <th>Acciones</th>
                                </thead>
                            `;
                            const cuerpoTablaReciboPago = document.createElement('tbody');
                            respuestas.forEach(recibo => {
                                let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(recibo.TOTAL_COBR);
                                const filaTablaReciboPago = document.createElement('tr');
                                const columnaIdCobro = document.createElement('td');
                                columnaIdCobro.innerHTML=recibo.IDCOBRO_COBR;
                                filaTablaReciboPago.appendChild(columnaIdCobro);
                                const columnaDetalles = document.createElement('td');
                                columnaDetalles.innerHTML=`
                                    <div class="fuente-14p">${recibo.CONCEPTO_COBR}</div>
                                    <div class="fuente-12p">Contrato:${recibo.CONTRATO_COBR}</div>
                                    <div class="fuente-12p">Pagado:${costoOrden}</div>
                                `;
                                filaTablaReciboPago.appendChild(columnaDetalles);
                                const columnaAcciones = document.createElement('td');
                                const grupoAcciones = document.createElement('div');
                                grupoAcciones.classList.add('btn-group');
                                const botonExportarPdf = document.createElement('button');
                                botonExportarPdf.classList.add('btn','btn-danger');
                                botonExportarPdf.setAttribute('dataexportar',recibo.idTablePk);
                                botonExportarPdf.setAttribute('id','botonExportarPdf');
                                botonExportarPdf.innerHTML = '<i class="fa fa-file-pdf"></i>';
                                botonExportarPdf.addEventListener('click',() => {
                                    crearReciboPago(botonExportarPdf)
                                });
                                const botonImprimirRecibo = document.createElement('button');
                                botonImprimirRecibo.classList.add('btn','btn-success','btn-block');
                                botonImprimirRecibo.setAttribute('dataimprimir',recibo.idTablePk);
                                botonImprimirRecibo.setAttribute('id','botonImprimirRecibo');
                                botonImprimirRecibo.innerHTML = '<i class="fa fa-print"></i>';
                                botonImprimirRecibo.addEventListener('click',() => {
                                    imprimirReciboPago(botonImprimirRecibo)
                                });
                                grupoAcciones.appendChild(botonExportarPdf);
                                grupoAcciones.appendChild(botonImprimirRecibo);
                                columnaAcciones.appendChild(grupoAcciones);
                                filaTablaReciboPago.appendChild(columnaAcciones);
                                cuerpoTablaReciboPago.appendChild(filaTablaReciboPago);

                            })
                            tablaReciboPago.appendChild(cuerpoTablaReciboPago);
                            datosUsuarioDetalle.innerHTML='';
                            datosUsuarioDetalle.appendChild(tablaReciboPago);
                            labelsParciales.innerHTML='';
                            let botonResetear = document.querySelector('#botonResetear');
                            botonResetear.addEventListener('click', () => {
                                datosUsuarioPago.innerHTML='';
                                datosUsuarioDetalle.innerHTML='';
                                labelsParciales.innerHTML='';
                                buscadorUsuarios();
                            })
                            botonCancelar.click();
                            return Swal.fire({
                                title: 'Pagado',
                                icon: 'success',
                                confirmButtonText: 'Continuar',
                                confirmButtonColor: '#009C06',
                                html: 'El pago de esta orden se ha completado correctamente.',
                            })

                        }
                    })
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

const cargarDeudasSelectiva = async (idBusqueda) => {
    try {
        Swal.fire({
            title: 'Ver detalle',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, Visualizar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea mostrar un pago selectivo de este detalle?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
                let botonCobrar = document.querySelector('#botonCobrar');
                let botonPagoParcial = document.querySelector('#botonPagoParcial');
                let botonParcial = document.querySelector('#botonParcial');
                let botonAgregarMultas = document.querySelector('#botonAgregarMultas');
                let botonAgregarAnticipo = document.querySelector('#botonAgregarAnticipo');
                let textMovimiento = document.querySelector('#textMovimiento');
                let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
                botonCompletar.classList.add('d-none');
                botonTemporal.classList.remove('d-none');
                botonResetear.classList.remove('btn-success');
                botonResetear.classList.add('btn-secondary');
                botonResetear.innerHTML='Limpiar';
                datosUsuarioDetalle.innerHTML=cargaAnimacion;
                fetch(`apagoservic/cargarDeudasDetalle/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    datosUsuarioDetalle.innerHTML='';
                    datosUsuarioDetalle.classList.add('tabla-contenedor');
                    textMovimiento.value=idBusqueda;
                    const tablaDetallesPago = document.createElement('table');
                    tablaDetallesPago.classList.add('table','table-sm','table-hover','fuente-12p');
                    tablaDetallesPago.innerHTML=`
                        <thead>
                            <th class="col">Conceptos</th>
                            <th colspan="2">Acciones</th>
                        </thead>
                    `;
                    const tablaCuerpoDetalles = document.createElement('tbody');
                    if(respuestas[0]==null){
                        tablaCuerpoDetalles.innerHTML=`
                            <tr><td colspan="2">Sin deudas registradas</td></tr>
                        `;
                        tablaDetallesPago.appendChild(tablaCuerpoDetalles);
                        datosUsuarioDetalle.appendChild(tablaDetallesPago);

                    }else{
                        botonAgregarMultas.removeAttribute('disabled');
                        botonAgregarAnticipo.removeAttribute('disabled');
                        botonCobrar.classList.add('d-none');
                        botonParcial.classList.remove('d-none');
                        botonPagoParcial.classList.remove('d-none');

                        respuestas[0].forEach(detallePago => {
                            const filasDetalles = document.createElement('tr');
                            const columnaDetalles = document.createElement('td');
                            columnaDetalles.innerHTML=`
                                <div class="row">
                                    <div class="col-md-2 col-12">${detallePago.CODIGO_DETA}</div>
                                    <div class="col-md-4 col-12">${detallePago.DESCRIPCION_CONC}</div>
                                    <div class="col-md-2 col-2">${parseInt(detallePago.CANTIDAD_DETA).toFixed(0)}</div>
                                    <div class="col-md-2 col-5">${'$'+parseFloat(detallePago.COSTO_DETA).toFixed(2)}</div>
                                    <div class="col-md-2 col-5">${'$'+parseFloat(detallePago.TOTAL_DETA).toFixed(2)}</div>
                                </div>
                            `;
                            filasDetalles.appendChild(columnaDetalles);
                            const columnaCheckBox = document.createElement('td');
                            const capaCheckBox = document.createElement('div');
                            //capaCheckBox.classList.add('custom-control','custom-checkbox');
                            const inputCheckboxClicker = document.createElement('input');
                            inputCheckboxClicker.setAttribute('type','checkbox');
                            //inputCheckboxClicker.classList.add('form-check-input');
                            inputCheckboxClicker.setAttribute('id',detallePago.idTablePk);
                            inputCheckboxClicker.setAttribute('name','abonos');
                            inputCheckboxClicker.setAttribute('value',detallePago.CODIGO_DETA);
                            inputCheckboxClicker.addEventListener('click', () => {
                                modificarTotalesDeuda(inputCheckboxClicker);
                            })
                            const labelCheckbocClicker = document.createElement('label');
                            labelCheckbocClicker.setAttribute('for',detallePago.idTablePk);
                            //labelCheckbocClicker.classList.add('custom-control-label');
                            labelCheckbocClicker.innerHTML=' Pagar';


                            capaCheckBox.appendChild(inputCheckboxClicker);
                            capaCheckBox.appendChild(labelCheckbocClicker);
                            columnaCheckBox.appendChild(capaCheckBox);
                            filasDetalles.appendChild(columnaCheckBox);

                            tablaCuerpoDetalles.append(filasDetalles);
                            tablaDetallesPago.appendChild(tablaCuerpoDetalles);
                            datosUsuarioDetalle.appendChild(tablaDetallesPago);
                        })

                    }
                    respuestas[1].forEach(totales => {
                        let labelsParciales = document.querySelector('#labelsParciales');
                        textoDeudaTotal.innerHTML='MX$0.00'
                        let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTAL_DETA);
                        labelsParciales.innerHTML=`
                            <div class="row">
                                <div class="form-group col-md-3 col-12">
                                    <small>Total deuda:</small>
                                    <input type="hidden" name="textDeuda" id="textDeuda" class="form-control form-control-sm" value="${totales.TOTAL_DETA}" />
                                    <div class="form-control form-control-sm text-right fuente-12p" id="labelTotal">${costoOrden}</div>
                                </div>
                                <div class="form-group col-md-2 col-12">
                                    <small>D. Restante:</small>
                                    <input type="hidden" name="textRestante" id="textRestante" class="form-control form-control-sm" placeholder="$0.00" value="${totales.TOTAL_DETA}" />
                                    <div class="form-control form-control-sm text-right fuente-12p" id="labelRestante">${costoOrden}</div>
                                </div>
                                <div class="form-group col-md-2 col-12">
                                    <small>Abono:</small>
                                    <input type="hidden" name="textAbono" id="textAbono" class="form-control form-control-sm" value="" />
                                    <div class="form-control form-control-sm text-right fuente-12" id="labelAbono">$0.00</div>
                                </div>

                            </div>
                        `;
                    })
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

const modificarTotalesDeuda = async (inputCheckboxClicker) => {
    try{
        let textRestante = document.querySelector('#textRestante');
        let idBusqueda = inputCheckboxClicker.attributes.id.value;
        let textDeuda = document.querySelector('#textDeuda');
        let textAbono = document.querySelector('#textAbono');
        let labelAbono = document.querySelector('#labelAbono');
        let labelRestante = document.querySelector('#labelRestante');
        fetch(`regconvenio/buscarTotalesConcepto/${idBusqueda}`)
        .then(respRender =>  respRender.json())
        .then(respuestas => {
            respuestas.forEach(totales => {
                if(inputCheckboxClicker.checked==false){
                    let totalModificado=parseFloat(textRestante.value) + parseFloat(totales.TOTAL_DETA);
                    textRestante.value=totalModificado;
                    let totalAbono = parseFloat(textDeuda.value) - parseFloat(textRestante.value);
                    textAbono.value=totalAbono;
                    let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalAbono);
                    let costoModif = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalModificado);
                    textoDeudaTotal.innerHTML=costoOrden;
                    labelAbono.innerHTML=costoOrden;
                    labelRestante.innerHTML=costoModif;

                }else if(inputCheckboxClicker.checked==true){
                    let totalModificado=parseFloat(textRestante.value) - parseFloat(totales.TOTAL_DETA);
                    textRestante.value=totalModificado;
                    let totalAbono = parseFloat(textDeuda.value) - parseFloat(textRestante.value);
                    textAbono.value=totalAbono;
                    let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalAbono);
                    let costoModif = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalModificado);
                    textoDeudaTotal.innerHTML=costoOrden;
                    labelAbono.innerHTML=costoOrden;
                    labelRestante.innerHTML=costoModif;

                }

            })
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

const cargarParcialPagoCobro = async () => {
    try{
        let listadoAnticipados = document.querySelector('#listadoAnticipados');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        listadoAnticipados.innerHTML='';
        botonCompletar.classList.add('d-none');
        botonTemporal.classList.remove('d-none');
        botonAddAnticipo.classList.add('d-none');
        listadoAnticipados.classList.remove('tabla-contenedor');
        let textAbono = document.querySelector('#textAbono');
        labelTitleModal.innerHTML='Pago Parcial';

        pagoCobro.innerHTML=`
            <div class="form-group row">
                <label for="textTotal" class="col-sm-4 col-form-label">Total a Pagar:</label>
                <div class="col-sm-8">
                    <input type="hidden" id="textTotal" name="textTotal" value="${textAbono.value}">
                    <div type="hidden" class="form-control form-control-sm text-success text-right font-weight-bold">${parseFloat(textAbono.value).toFixed(2)}</div>
                </div>
            </div>
            <div class="form-group row">
                <label for="textMetodo" class="col-sm-4 col-form-label">Metodo pago:</label>
                <div class="col-sm-8">
                    <select name="textMetodo" id="textMetodo" class="custom-select custom-select-sm"></select>
                </div>
            </div>
            <div class="form-group row">
                <label for="textRecibo" class="col-sm-4 col-form-label">Recibido:</label>
                <div class="col-sm-8">
                    <input type="number" name="textRecibo" id="textRecibo" class="form-control form-control-sm text-right font-weight-bold" />
                </div>
            </div>
            <div class="form-group row">
                <label for="textCambio" class="col-sm-4 col-form-label">Cambio:</label>
                <div class="col-sm-8">
                    <input type="text" readonly name="textCambio" id="textCambio" class="form-control form-control-sm text-warning text-right font-weight-bold" />
                </div>
            </div>
        `;
        let textTotal = document.querySelector('#textTotal');
        let textMetodo = document.querySelector('#textMetodo');
        let textRecibo = document.querySelector('#textRecibo');
        textMetodo.innerHTML=`
            <option value="">Método pago</option>
            <option value="EFEC">Efectivo</option>
            <option value="TDEB">T. Debito</option>
            <option value="TCRE">T. Crédito</option>
            <option value="TSPE">Trans. Interbancaria SPEI</option>
        `;
        textMetodo.addEventListener('change', () => {
            if(textMetodo.value=='' || textMetodo.value==null){
                return Swal.fire({
                    title: 'Campo no válido',
                    icon: 'warning',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Verificar',
                    html: 'Seleccione un método de pago a utilizar.',
                })

            }else{
                textRecibo.focus();
            }
        });
        textRecibo.addEventListener('focusout', () => {
            let textCambio = document.querySelector('#textCambio');
            let calculoCambio = 0;
            if(textMetodo.value=='' || textMetodo.value==null){
                return Swal.fire({
                    title: 'Campo no válido',
                    icon: 'warning',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Verificar',
                    html: 'Seleccione un método de pago a utilizar.',
                })
            }else if(textRecibo.value=='' || textRecibo.value==null){
            }else if(textRecibo.value < textTotal.value){
                return Swal.fire({
                    title: 'Campo no válido',
                    icon: 'warning',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Verificar',
                    html: 'No se puede recibir menos dinero de lo que debe.',
                })
            }else{
                calculoCambio = parseFloat(textRecibo.value)-parseFloat(textTotal.value);
                textCambio.value=parseFloat(calculoCambio).toFixed(2);
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

const pagarDeudaParcial = async () => {
    try {
        if(validarMetodo() && validarRecibo()){
            Swal.fire({
                title: 'Cobrar',
                icon: 'question',
                confirmButtonColor: '#0A8000',
                confirmButtonText: 'Si, Cobrar',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                cancelButtonText: 'No, mejor no',
                html: '¿Desea hacer el cobro de este servicio?',
            })
            .then((result)=>{
                if(result.isConfirmed){
                    let textMovimiento = document.querySelector('#textMovimiento');
                    let textTotal = document.querySelector('#textTotal');
                    let textMetodo = document.querySelector('#textMetodo');
                    let textRecibo = document.querySelector('#textRecibo');
                    let textCambio = document.querySelector('#textCambio');
                    let abonos = document.querySelectorAll('input[name="abonos"]:checked');
                    let abonosTemporal = [];
                    for(let regis = 0; regis < abonos.length; regis++){
                        abonosTemporal.push(abonos[regis].value);
                    }
                    let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
                    let interaccionBotones = document.querySelector('#interaccionBotones');
                    let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
                    let labelsParciales = document.querySelector('#labelsParciales');

                    const datosPagos = {
                        textMovimiento: textMovimiento.value,
                        textTotal: textTotal.value,
                        textMetodo: textMetodo.value,
                        textRecibo: textRecibo.value,
                        textCambio: textCambio.value,
                        abonos: abonosTemporal,
                    }
                    fetch('apagoservic/realizarPagoParcialCuenta', {
                        method: 'POST',
                        body: JSON.stringify(datosPagos),
                        headers: {
                            "Content-type": "application/json",
                        },

                    })
                    .then(respRender => respRender.json())
                    .then(respuestas => {
                        if(respuestas.estatus=='error'){
                            return Swal.fire({
                                title: respuestas.title,
                                icon: respuestas.icon,
                                confirmButtonText: `${respuestas.button}`,
                                confirmButtonColor: '#9C0000',
                                html: respuestas.text,
                            })

                        }else{
                            textoDeudaTotal.innerHTML='';
                            interaccionBotones.innerHTML=`
                                <input type="hidden" id="textMovimiento" name="textMovimiento" value="${textMovimiento.value}" />
                                <div class="form-group col-md-4 col-12 btn-group">
                                    <button type="button" class="btn btn-sm btn-success mb-3" id="botonResetear">Nuevo Cobro</button>
                                    <button type="button" class="btn btn-sm btn-success mb-3 d-none" id="botonCobrar">Hacer Cobro</button>
                                    <button type="button" class="btn btn-sm btn-success mb-3 d-none" id="botonPagoParcial">Hacer Cobro</button>
                                    <button type="button" class="btn btn-sm btn-warning mb-3 d-none" id="botonParcial">Cobro Parcial</button>
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="input-group mb-3">
                                        <select name="textConceptos" id="textConceptos" class="custom-select custom-select-sm"><select>
                                        <div class="input-group-append">
                                            <button id="botonAgregarMultas" class="btn btn-outline-success btn-sm" disabled>Multas <i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-4 col-12">
                                    <div class="input-group mb-3">
                                        <div class="input-group-append">
                                            <button id="botonAgregarAnticipo" class="btn btn-outline-success btn-sm" disabled>Adenlantar Meses <i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                            `;
                            const tablaReciboPago = document.createElement('table');
                            tablaReciboPago.classList.add('table','table-sm','table-hover','fuente-12p');
                            tablaReciboPago.innerHTML=`
                                <thead>
                                    <th>Folio</th>
                                    <th class="col">Descripción</th>
                                    <th>Acciones</th>
                                </thead>
                            `;
                            const cuerpoTablaReciboPago = document.createElement('tbody');
                            respuestas.forEach(recibo => {
                                let costoOrden = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(recibo.TOTAL_COBR);
                                const filaTablaReciboPago = document.createElement('tr');
                                const columnaIdCobro = document.createElement('td');
                                columnaIdCobro.innerHTML=recibo.IDCOBRO_COBR;
                                filaTablaReciboPago.appendChild(columnaIdCobro);
                                const columnaDetalles = document.createElement('td');
                                columnaDetalles.innerHTML=`
                                    <div class="fuente-14p">${recibo.CONCEPTO_COBR}</div>
                                    <div class="fuente-12p">Contrato:${recibo.CONTRATO_COBR}</div>
                                    <div class="fuente-12p">Pagado:${costoOrden}</div>
                                `;
                                filaTablaReciboPago.appendChild(columnaDetalles);
                                const columnaAcciones = document.createElement('td');
                                const grupoAcciones = document.createElement('div');
                                grupoAcciones.classList.add('btn-group');
                                const botonExportarPdf = document.createElement('button');
                                botonExportarPdf.classList.add('btn','btn-danger');
                                botonExportarPdf.setAttribute('dataexportar',recibo.idTablePk);
                                botonExportarPdf.setAttribute('id','botonExportarPdf');
                                botonExportarPdf.innerHTML = '<i class="fa fa-file-pdf"></i>';
                                botonExportarPdf.addEventListener('click',() => {
                                    crearReciboPago(botonExportarPdf)
                                });
                                const botonImprimirRecibo = document.createElement('button');
                                botonImprimirRecibo.classList.add('btn','btn-success','btn-block');
                                botonImprimirRecibo.setAttribute('dataimprimir',recibo.idTablePk);
                                botonImprimirRecibo.setAttribute('id','botonImprimirRecibo');
                                botonImprimirRecibo.innerHTML = '<i class="fa fa-print"></i>';
                                botonImprimirRecibo.addEventListener('click',() => {
                                    imprimirReciboPago(botonImprimirRecibo)
                                });
                                grupoAcciones.appendChild(botonExportarPdf);
                                grupoAcciones.appendChild(botonImprimirRecibo);
                                columnaAcciones.appendChild(grupoAcciones);
                                filaTablaReciboPago.appendChild(columnaAcciones);
                                cuerpoTablaReciboPago.appendChild(filaTablaReciboPago);

                            })
                            tablaReciboPago.appendChild(cuerpoTablaReciboPago);
                            datosUsuarioDetalle.innerHTML='';
                            datosUsuarioDetalle.appendChild(tablaReciboPago);
                            labelsParciales.innerHTML='';
                            let botonResetear = document.querySelector('#botonResetear');
                            botonResetear.addEventListener('click', () => {
                                datosUsuarioPago.innerHTML='';
                                datosUsuarioDetalle.innerHTML='';
                                labelsParciales.innerHTML='';
                                buscadorUsuarios();
                            })
                            botonCancelar.click();
                            return Swal.fire({
                                title: 'Pagado',
                                icon: 'success',
                                confirmButtonText: 'Continuar',
                                confirmButtonColor: '#009C06',
                                html: 'El pago de esta orden se ha completado correctamente.',
                            })

                        }
                    })
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

const imprimirReciboPago = async (botonImprimirRecibo) => {
    try{
        let idBusqueda = botonImprimirRecibo.attributes.dataimprimir.value;
        let impresionComprobante = document.querySelector('#impresionComprobante');
        impresionComprobante.innerHTML=`
            <style>
                @font-face {
                	font-family: 'Montserrat';
                	src: url('public/assets/estilos/css_frontend/Montserrat/Montserrat-Regular.ttf') format('truetype');
                	font-style: normal;
                	font-weight: normal;
                }

            </style>
            <img src="public/assets/imagen/logotipos/logo_sapt_trans_300.png" style="position: absolute; margin: 60px 20%; width: 400px; height:400p;" />
        `;
        let fechaHoy = new Date();
        let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
        fetch(`pagoservicio/imprimirComprobantePago/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            respuestas[0].forEach(usuarios => {
                let tipoTarifa = '';
                if(usuarios.DESCUENTO_CCONT=='TARNOR'){
                    tipoTarifa = 'Completa';
                }else if(usuarios.DESCUENTO_CCONT=='TARMAY'){
                    tipoTarifa = 'Descuento';
                }else if(usuarios.DESCUENTO_CCONT=='TARESP'){
                    tipoTarifa = 'Especial';
                }else if(usuarios.DESCUENTO_CCONT=='TARNEG'){
                    tipoTarifa = 'Negocio';
                }
                const cabeceraComprobante = document.createElement('table');
                cabeceraComprobante.setAttribute('border','0');
                cabeceraComprobante.setAttribute('cellspacing','0');
                cabeceraComprobante.setAttribute('cellpadding','0');
                cabeceraComprobante.setAttribute('style','width: 100%; font-family: Montserrat;');
                cabeceraComprobante.innerHTML=`
                    <tr>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                    </tr>
                    <tr>
                        <td rowspan="4" colspan="1" style="border: 1px solid rgb(20,179,237);"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:80px; height:80px; margin: auto;"/></td>
                        <td rowspan="4" colspan="8" style="text-align: center; border: 1px solid rgb(20,179,237);">
                            <div style="text-align: center; font-size: 10px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                            <div style="text-align: center; font-size: 8px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                        </td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237);">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Contrato:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${usuarios.CONTRATO_CCONT}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${usuarios.FECHACAP_COBR}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Hora:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${usuarios.HORACAP_COBR}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha Impresión:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${fechaImpress}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding: 3px; text-align: center; font-weight: bolder; font-size:10px;">Comprobante de Pago</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Nombre:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.NOMBRE}</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Contrato:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.DESCRIPCION_CONT}</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Tarifa:</div>
                            <div style="text-align: center; font-size:10px;">${tipoTarifa}</div>
                        </td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Folio:</div>
                            <div style="float: right; margin-right: 5px; text-align: center; font-size:10px;">${usuarios.IDCOBRO_COBR+'-'+usuarios.CONSECUTIVO_COBR}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Calle:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.CALLES}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Colonia:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.COLONIA_CODPOS}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Codigo Postal:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.CODIPOST_CODPOS}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Municipio:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.NOMBRE_MUNIC}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Estado:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.ESTADO_ESTA}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Telefono:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.TELEFONO_CLIEN} - ${usuarios.MOVIL_CLIEN}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding: 5px;"></td>
                    </tr>

                `;

                impresionComprobante.appendChild(cabeceraComprobante);
            })

            let capaDetalles = document.createElement('div');
            capaDetalles.setAttribute('style','width: 100%; min-height: 245px; border: 1px solid rgb(20,179,237); font-family: Montserrat;')
            if(respuestas[1]==null){
                const detalleComprobante = document.createElement('table');
                detalleComprobante.setAttribute('border','0');
                detalleComprobante.setAttribute('cellspacing','0');
                detalleComprobante.setAttribute('cellpadding','0');
                detalleComprobante.setAttribute('style','width: 100%;');
                detalleComprobante.innerHTML=`
                    <thead>
                        <td colspan="1" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: absolute; margin-left:5px; font-size:8px;">Código</div>
                        </td>
                        <td colspan="9" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: absolute; margin-left:5px; font-size:8px;">Descripción</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: absolute; margin-left:5px; font-size:8px;">Costo</div>
                        </td>
                    </thead>
                    <tbody>
                    <tr>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                    </tr>

                    <tr><td colspan="3">No datos</td></tr>
                    </tbody>
                `;
                capaDetalles.appendChild(detalleComprobante);
                impresionComprobante.appendChild(capaDetalles);
            }else{
                const detalleComprobante = document.createElement('table');
                detalleComprobante.setAttribute('border','0');
                detalleComprobante.setAttribute('cellspacing','0');
                detalleComprobante.setAttribute('cellpadding','0');
                detalleComprobante.setAttribute('style','width: 100%;');
                detalleComprobante.innerHTML=`
                    <thead>
                        <td colspan="1" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: relative; margin-left:5px; font-size:10px;">Código</div>
                        </td>
                        <td colspan="9" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: relative; margin-left:5px; font-size:10px;">Descripción</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: relative; margin-left:5px; font-size:10px;">Costo</div>
                        </td>
                    </thead>
                    <tr>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                        <td width="8.33%"></td>
                    </tr>
                `;
                const tablaBodyRecibo = document.createElement('tbody')
                respuestas[1].forEach(detalles => {
                    const filaDetalles = document.createElement('tr');
                    const columnaCodigo = document.createElement('td');
                    columnaCodigo.setAttribute('style','border: 1px solid rgb(20,179,237); border-left: none; border-bottom: none;');
                    columnaCodigo.setAttribute('colspan','1');
                    columnaCodigo.innerHTML='<div style="position: relative; margin-left:5px; font-size:6px;">'+detalles.CODIGO_DETA+'</div>';
                    filaDetalles.appendChild(columnaCodigo);
                    const columnaDescripcion = document.createElement('td');
                    columnaDescripcion.setAttribute('style','border: 1px solid rgb(20,179,237); border-left: none; border-right: none; border-bottom: none;');
                    columnaDescripcion.setAttribute('colspan','9');
                    columnaDescripcion.innerHTML='<div style="position: relative; margin-left:5px; font-size:6px;">'+detalles.DESCRIPCION_CONC+'</div>';
                    filaDetalles.appendChild(columnaDescripcion);
                    const columnaCosto = document.createElement('td');
                    columnaCosto.setAttribute('style','border: 1px solid rgb(20,179,237); border-right: none; border-bottom: none;');
                    columnaCosto.setAttribute('colspan','2');
                    columnaCosto.innerHTML='<div style="position: relative; margin-left:5px; font-size:6px;">$'+parseFloat(detalles.COSTO_DETA).toFixed(2)+'</div>';
                    filaDetalles.appendChild(columnaCosto);
                    tablaBodyRecibo.appendChild(filaDetalles);
                    detalleComprobante.appendChild(tablaBodyRecibo);
                })

                capaDetalles.appendChild(detalleComprobante);
                impresionComprobante.appendChild(capaDetalles);

            }

            if(respuestas[2]==null){
                const pagoDetallado = document.createElement('table');
                pagoDetallado.setAttribute('border','0');
                pagoDetallado.setAttribute('cellspacing','0');
                pagoDetallado.setAttribute('cellpadding','0');
                pagoDetallado.setAttribute('style','width: 100%; font-family: Montserrat;');
                pagoDetallado.innerHTML=`
                    <tr>
                        <td></td>
                    </tr>
                `;
                impresionComprobante.appendChild(pagoDetallado);

            }else{
                const pagoDetallado = document.createElement('table');
                pagoDetallado.setAttribute('border','0');
                pagoDetallado.setAttribute('cellspacing','0');
                pagoDetallado.setAttribute('cellpadding','0');
                pagoDetallado.setAttribute('style','width: 100%; font-family: Montserrat;');
                respuestas[2].forEach(totales => {
                    let reciboCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.RECIBO_PAGO);
                    let cambioCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.CAMBIO_PAGO);
                    let totalCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTAL_PAGO);
                    pagoDetallado.innerHTML=`
                        <tr>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                        </tr>
                        <tr>
                            <td rowspan="2" colspan="5" id="detalleDeudasFila"></td>
                            <td rowspan="2" colspan="5">
                                <div style="text-align:center; margin-right: 5px; font-size: 10px;"><span>Atendió:</span> ${totales.ATIENDE}</div>
                            </td>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Metodo Pago:</div>
                                <div style="float: right; margin-right: 5px; font-size:10px;">${totales.DESCRIPCION_ESTAT}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Pago Recibido:</div>
                                <div style="float: right; margin-right: 5px; font-size:10px;">${reciboCosto}</div>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="2" colspan="10" id="codigoBarras"></td>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Cambio:</div>
                                <div style="float: right; margin-right: 5px; font-size:10px;">${cambioCosto}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Total a Pagar:</div>
                                <div style="float: right; margin-right: 5px; font-size:12px; font-weight: bolder;">${totalCosto}</div>
                            </td>
                        </tr>
                    `;

                    impresionComprobante.appendChild(pagoDetallado);
                })

            }
            let codigoBarras = document.querySelector('#codigoBarras');
            respuestas[2].forEach(totales => {
                const codigo_qr = document.createElement('img');
                codigo_qr.setAttribute('style','position:relative; top:2px; height:30px; width:250px;');
                JsBarcode(codigo_qr, totales.CODBARR_CLIEN, {
                    displayValue: false,
                    format: 'CODE128',
                    width: 1,
                });
                codigoBarras.appendChild(codigo_qr);
            })

            let detalleDeudasFila = document.querySelector('#detalleDeudasFila');
            if(respuestas[3]==null || respuestas[3]==''){
                const deudaDetalle = document.createElement('div');
                deudaDetalle.setAttribute('style','font-size: 10px; margin-left:10px;')
                deudaDetalle.innerHTML=`
                    <span>Total Deuda:</span> <span style="color: rgba(10,92,13,1); font-weight: bolder; font-size:14px;">$0.00</span>
                `;
                detalleDeudasFila.appendChild(deudaDetalle);

            }else{
                respuestas[3].forEach(deudas => {
                    let totalDeuda = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(deudas.TOTAL_DEUDA);
                    const deudaDetalle = document.createElement('div');
                    deudaDetalle.setAttribute('style','font-size: 10px; margin-left:10px;')
                    if(deudas.TOTAL_DEUDA==null){
                        deudaDetalle.innerHTML=`
                            <span>Total Deuda:</span> <span style="color: rgba(10,92,13,1); font-weight: bolder; font-size:14px;">$0.00</span>
                        `;
                    }else{
                        deudaDetalle.innerHTML=`
                            <span>Total Deuda:</span> Contrato ${deudas.CONTRATO_DETA} <span style="color: rgba(149,0,0,1); font-weight: bolder; font-size:14px;">${totalDeuda}</span>
                        `;
                    }
                    detalleDeudasFila.appendChild(deudaDetalle);
                })

            }
            let ventImpri = window.open('', 'popimpr');
            ventImpri.document.write(impresionComprobante.innerHTML);
            ventImpri.document.close();
            ventImpri.print();
            ventImpri.close();
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

const crearReciboPago = async (botonExportarPdf) => {
    try{
        let idBusqueda = botonExportarPdf.attributes.dataexportar.value;
        let tablaDetallesRecibo = document.querySelector('#tablaDetallesRecibo');
        const docImprimir = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'letter',
            compress: true,
        });

        fetch(`pagoservicio/imprimirComprobantePago/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            let logoSistema = new Image();
            let marcaAgua = new Image();
            logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
            marcaAgua.src = 'public/assets/imagen/logotipos/logo_sapt_trans_300.png';
            let fechaHoy = new Date();
            let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
            let base64Logo = logoSistema;
            let base64MarcaAgua = marcaAgua;
            docImprimir.addImage(base64Logo, 'png', 8,5, 16,16);
            docImprimir.addImage(base64MarcaAgua, 'png', 50,10, 110,110);
            docImprimir.setDrawColor(20,179,237);
            docImprimir.rect(7, 5, 202, 16);
            docImprimir.rect(7, 5, 18, 16);
            docImprimir.rect(164, 5, 45, 4);
            docImprimir.rect(164, 9, 45, 4);
            docImprimir.rect(164, 13, 45, 4);
            docImprimir.rect(164, 17, 45, 4);
            docImprimir.rect(7, 25, 202, 12);
            docImprimir.rect(7, 25, 112, 4);
            docImprimir.rect(119, 25, 39, 4);
            docImprimir.rect(158, 25, 51, 4);
            docImprimir.rect(7, 29, 85, 4);
            docImprimir.rect(92, 29, 65, 4);
            docImprimir.rect(157, 29, 52, 4);
            docImprimir.rect(7, 33, 65, 4);
            docImprimir.rect(72, 33, 76, 4);
            docImprimir.rect(148, 33, 61, 4);
            docImprimir.rect(7, 40, 202, 70);
            docImprimir.rect(169, 110, 40, 4);
            docImprimir.rect(169, 114, 40, 4);
            docImprimir.rect(169, 118, 40, 4);
            docImprimir.rect(169, 122, 40, 4);
            docImprimir.setDrawColor(135,142,147);
            docImprimir.setFontSize(10);
            docImprimir.text('SISTEMA DE AGUA POTABLE',95,10, 'center');
            docImprimir.text('COMITE DE ADMINISTRACION DE AGUA POTABLE',95,14, 'center');
            docImprimir.setFontSize(6);
            docImprimir.text('CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ',95,17, 'center');
            docImprimir.text('MUNICIPIO DE TLAXCOAPAN, HIDALGO',95,19, 'center');
            docImprimir.setFontType('bold');
            docImprimir.setFontSize(8);
            docImprimir.text('Comprobante de Pago',95,24, 'center');
            docImprimir.setFontType('normal');
            docImprimir.setFontSize(4);
            docImprimir.text('Contrato:',165,7, 'left');
            docImprimir.text('Fecha:',165,11, 'left');
            docImprimir.text('Hora:',165,15, 'left');
            docImprimir.text('Impresión:',165,19, 'left');
            docImprimir.text('Cliente:',8,27, 'left');
            docImprimir.text('Tipo Contrato:',128,27, 'left');
            docImprimir.text('Folio:',159,27, 'left');
            docImprimir.text('Calle y Numero:',8,31, 'left');
            docImprimir.text('Colonia:',93,31, 'left');
            docImprimir.text('Cod. Postal:',158,31, 'left');
            docImprimir.text('Municipio:',8,35, 'left');
            docImprimir.text('Estado:',73,35, 'left');
            docImprimir.text('Telefono(s):',149,35, 'left');
            docImprimir.text('Metodo Pago:',170,112, 'left');
            docImprimir.text('Su Pago:',170,116, 'left');
            docImprimir.text('Cambio:',170,120, 'left');
            docImprimir.text('Total:',170,124, 'left');

            respuestas[0].forEach(usuarios => {
                docImprimir.setFontType('normal');
                docImprimir.setFontSize(9);
                docImprimir.text(usuarios.CONTRATO_CCONT,208,8, 'right');
                docImprimir.text(fechaImpress,208,20, 'right');
                docImprimir.text(usuarios.NOMBRE,15,28, 'left');
                docImprimir.text(usuarios.DESCRIPCION_CONT,138,28, 'left');
                docImprimir.text(usuarios.IDCOBRO_COBR+'-'+usuarios.CONSECUTIVO_COBR,208,28, 'right');
                docImprimir.text(usuarios.CALLES,20,32, 'left');
                docImprimir.text(usuarios.COLONIA_CODPOS,100,32, 'left');
                docImprimir.text(usuarios.CODIPOST_CODPOS,168,32, 'left');
                docImprimir.text(usuarios.NOMBRE_MUNIC,16,36, 'left');
                docImprimir.text(usuarios.ESTADO_ESTA,79,36, 'left');
                docImprimir.text(usuarios.TELEFONO_CLIEN+' '+usuarios.MOVIL_CLIEN,150,36, 'left');
                JsBarcode('#codigo_qr', usuarios.CODBARR_CLIEN, {
                    displayValue: false,
                    format: 'CODE128',
                    width: 1,
                });
                let codigo_qr = document.querySelector('img#codigo_qr');
                docImprimir.addImage(codigo_qr.src, 'jpeg', 7,120, 60,5);

                nombreArchivo = usuarios.IDCOBRO_COBR;

            })
            if(respuestas[1]==null){
                tablaDetallesRecibo.innerHTML=`
                    <thead>
                        <td>Código</td>
                        <td>Descripción</td>
                        <td>Costo</td>
                    </thead>
                    <tbody>
                    <tr><td colspan="3">No datos</td></tr>
                    </tbody>
                `;
            }else{
                tablaDetallesRecibo.innerHTML=`
                    <thead>
                        <td>Código</td>
                        <td>Descripción</td>
                        <td>Costo</td>
                    </thead>
                `;
                const tablaBodyRecibo = document.createElement('tbody')
                respuestas[1].forEach(detalles => {
                    const filaDetalles = document.createElement('tr');
                    const columnaCodigo = document.createElement('td');
                    columnaCodigo.innerHTML=detalles.CODIGO_DETA;
                    filaDetalles.appendChild(columnaCodigo);
                    const columnaDescripcion = document.createElement('td');
                    columnaDescripcion.innerHTML=detalles.DESCRIPCION_CONC;
                    filaDetalles.appendChild(columnaDescripcion);
                    const columnaCosto = document.createElement('td');
                    columnaCosto.innerHTML='$'+parseFloat(detalles.COSTO_DETA).toFixed(2);
                    filaDetalles.appendChild(columnaCosto);
                    tablaBodyRecibo.appendChild(filaDetalles);
                    tablaDetallesRecibo.appendChild(tablaBodyRecibo);
                })

            }

            docImprimir.autoTable({
                html: '#tablaDetallesRecibo',
                margin: {top: 40, left:7},
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 255, 255],
                    borderColor: [20,179,237],
                    textColor: [0, 0, 0],
                    fontSize: 6,
                    textColor: [0, 0, 0],
                    cellPadding: .5,
                },
                bodyStyles: {
                    fontSize: 5,
                    drawColor: [20,179,237],
                    textColor: [0, 0, 0],
                    cellPadding: 0.1,
                },
                columnStyles: {
                    0: {halign: 'left', fillColor: [255, 255, 255], cellWidth: 4} ,
                    1: {halign: 'left',fillColor: [255, 255, 255], cellWidth: 90} ,
                    2: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 6} ,
                    fontSize: 6,
                },
                tableWidth: 202,
            })

            respuestas[2].forEach(total => {
                docImprimir.setFontType('normal');
                docImprimir.setFontSize(9);
                docImprimir.text(total.FECHACAP_PAGO,208,12, 'right');
                docImprimir.text(total.HORACAP_PAGO,208,16, 'right');
                docImprimir.setFontSize(8);
                docImprimir.text('Atendio: '+total.ATIENDE,165,117, 'right');
                docImprimir.text(total.DESCRIPCION_ESTAT,208,113, 'right');
                docImprimir.text('$'+parseFloat(total.RECIBO_PAGO).toFixed(2),208,117, 'right');
                docImprimir.text('$'+parseFloat(total.CAMBIO_PAGO).toFixed(2),208,121, 'right');
                docImprimir.setFontType('bold');
                docImprimir.setFontSize(10);
                docImprimir.text('$'+parseFloat(total.TOTAL_PAGO).toFixed(2),208,125, 'right');

            })
            let espacioLinea=114
            docImprimir.setFontSize(8);
            docImprimir.text('Total Adeudo:',10,114, 'left');
            docImprimir.setFontType('normal');
            espacioLinea=espacioLinea+3;
            if(respuestas[3]==null){
                docImprimir.text('No tiene adeudos Pendientes',10,espacioLinea, 'left');
            }else{
                respuestas[3].forEach(deudas => {
                    if(deudas.TOTAL_DEUDA==null){
                        docImprimir.text('$0.00',25,espacioLinea, 'left');
                    }else{
                        docImprimir.text('Contrato '+deudas.CONTRATO_DETA+' $'+parseFloat(deudas.TOTAL_DEUDA).toFixed(2),10,espacioLinea, 'left');
                    }
                })

            }

            docImprimir.save('Recibo '+nombreArchivo+'.pdf');

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










function validarConceptos(){
    let inputForm = document.querySelector("#textConceptos");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Conceptos es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }
    inputValido(inputForm);
    return true;

}

function validarCantidad(){
    let inputForm = document.querySelector("#textCantidad");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Cantidad es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }
    inputValido(inputForm);
    return true;

}

function validarCoperacion(){
    let inputForm = document.querySelector("#textCoperacion");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Coperacion es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if(isNaN(inputForm.value)){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Coperacion solo números',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;

    }
    inputValido(inputForm);
    return true;

}

function validarMetodo(){
    let inputForm = document.querySelector("#textMetodo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Método es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }
    inputValido(inputForm);
    return true;

}

function validarRecibo(){
    let inputForm = document.querySelector("#textRecibo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Recibo es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }
    inputValido(inputForm);
    return true;

}


function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
