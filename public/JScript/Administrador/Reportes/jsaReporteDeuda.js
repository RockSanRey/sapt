let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    buscadorUsuarios()
})

const buscadorUsuarios = async () => {
    try{
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        busquedaUsuarios.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de usuario para ver el contrato que necesita reimprimir.</li>
                </ol>
            </div>
            <div class="input-group mb-3">
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                <select id="textMetodoBus" name="textMetodoBus" class="custom-select custom-select-sm col-md-2" autofocus></select>
                <input type="text" class="form-control form-control-sm" name="textUsuario" id="textUsuario" placeholder="Buscar Usuario" autocomplete="off" autofocus/>
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textUsuario = document.querySelector('#textUsuario');
        let textMetodoBus = document.querySelector('#textMetodoBus');
        let userListComplete = document.querySelector('#userListComplete');
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        textMetodoBus.innerHTML=`
            <option value="">Buscar por</option>
            <option value="NOMBR">Nombre</option>
            <option value="IDUSU">Id Usuario</option>
            <option value="CONTR">Contrato</option>
        `;
        textUsuario.setAttribute('disabled','disabled');
        butonBuscarUsuario.setAttribute('disabled','disabled');
        textMetodoBus.addEventListener('change', () => {
            if(textMetodoBus.value==''){
                butonBuscarUsuario.setAttribute('disabled','disabled');
                textUsuario.setAttribute('disabled','disabled');
                textUsuario.setAttribute('placeholder','');
                userListComplete.innerHTML='';
            }else{
                if(textMetodoBus.value=='NOMBR'){
                    textUsuario.setAttribute('placeholder','Escribe Nombre del Usuario');
                    userListComplete.innerHTML='';
                    textUsuario.value='';
                }else if(textMetodoBus.value=='IDUSU'){
                    textUsuario.setAttribute('placeholder','Escribe Numero de Usuario');
                    userListComplete.innerHTML='';
                    textUsuario.value='';
                }else if(textMetodoBus.value=='CONTR'){
                    textUsuario.setAttribute('placeholder','Escanea el código de barras');
                    userListComplete.innerHTML='';
                    textUsuario.value='';
                }
                butonBuscarUsuario.removeAttribute('disabled');
                textUsuario.removeAttribute('disabled');
                textUsuario.focus();
            }
        })
        textUsuario.addEventListener('keyup', (e) => {
            if(textMetodoBus.value==''||textMetodoBus.value==null){
                return Swal.fire({
                    title: 'Validación',
                    icon: 'error',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Requerido',
                    html: 'Debe seleccionar método de busqueda',
                    showConfirmButton: false,
                    timer: 2500
                }).then((result)=> {
                    if(result.dismiss){
                        textMetodoBus.classList.add('is-invalid');
                        textMetodoBus.focus();
                    }
                })
            }else{
                userListComplete.innerHTML='';
                completarBusquedaUsuarios(textMetodoBus,textUsuario);
            }
            // if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode==8){
            //     userListComplete.innerHTML='';
            //     completarBusquedaUsuarios(textUsuario);
            //     codigoTecla.innerHTML=e.keyCode;
            // }
        })
        butonBuscarUsuario.addEventListener('click', () => {
            mostrarContratosPagar(textIdUsuario);
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

const completarBusquedaUsuarios = async (textMetodoBus,textUsuario) => {
    try{
        let idBusqueda = textMetodoBus.value+'_'+textUsuario.value;
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');        
        userListComplete.innerHTML='';
        if(textUsuario.value=='' || textUsuario.value==null){
            userListComplete.innerHTML='';
        }else if(textMetodoBus.value=='NOMBR'){
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`acobros/autoCompletarUsuario/${idBusqueda}`)
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

        }else if(textMetodoBus.value=='IDUSU'){
            if(isNaN(textUsuario.value)){
                return Swal.fire({
                    title: 'Validación',
                    icon: 'error',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Numeros',
                    html: 'Solo Números',
                    showConfirmButton: false,
                    timer: 3500,
                })        
            }else if(textUsuario.value.length>4){
                userListComplete.innerHTML=cargaAnimacion;
                fetch(`acobros/autoCompletarUsuario/${idBusqueda}`)
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
                            listadoItemUl.innerHTML= usuario.NOMBRE+' - id Usuario:'+usuario.CODBARR_CLIEN;
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
        }else if(textMetodoBus.value=='CONTR'){
            if(isNaN(textUsuario.value)){
                return Swal.fire({
                    title: 'Validación',
                    icon: 'error',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Numeros',
                    html: 'Solo Números',
                    showConfirmButton: false,
                    timer: 3500,
                })        
            }else{
                if(textUsuario.value.length==14){
                    butonBuscarUsuario.innerHTML=cargaAnimacion;
                    fetch(`acobros/autoCompletarUsuario/${idBusqueda}`)
                    .then(respRender => respRender.json())
                    .then(respuestas => {
                        respuestas.forEach(usuario => {
                            textIdUsuario.value=usuario.IDUSUA_CLIEN;
                            textUsuario.value = usuario.NOMBRE;
                            userListComplete.innerHTML='';
                            butonBuscarUsuario.click();
                        })
                    })
                }
            }
        }else{

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

const mostrarContratosPagar = async (textIdUsuario) => {
    try {
        if(validarMetodoBus()){
            let idBusqueda = textIdUsuario.value;
            let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
            let datosContratosPago = document.querySelector('#datosContratosPago');
            let interaccionBotones = document.querySelector('#interaccionBotones');
            let datosDeudaDetalle = document.querySelector('#datosDeudaDetalle');
            let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
            datosContratosPago.innerHTML=`
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="${textIdUsuario.value}">
                <input type="hidden" id="textMovimiento" name="textMovimiento" value="" />
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Selecciona un contrato y haz clic en ver detalles para ver su deuda.</li>
                    </ol>
                </div>
            `;
            fetch(`acobros/cargarUsuarioGenerales/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error'){
                    datosContratosPago.innerHTML='';
                    buscadorUsuarios();
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    })
                }else if(respuestas[0]==null || respuestas[1]==null){
                    const capaSinDatos = document.createElement('div');
                    capaSinDatos.innerHTML=`
                        <div class="row">
                            <div class="form-group col-md-12 col-12"><div class="form-control form-control-sm"><small>Usuario:</small> <b>No hay datos disponibles</b></div></div>
                        </div>
                    `;
                    busquedaUsuarios.appendChild(capaSinDatos);
                    interaccionBotones.classList.remove('d-none');
                    botonResetear.addEventListener('click', () => {
                        datosContratosPago.innerHTML='';
                        datosDeudaDetalle.innerHTML='';
                        interaccionBotones.classList.add('d-none');
                        buscadorUsuarios();
                    })
                }else{
                    const tablaContratos = document.createElement('table');
                    tablaContratos.classList.add('table','table-sm','table-hover','fuente-12p','mb-0');
                    const filaUsuarioInformacion = document.createElement('tr');
                    respuestas[0].forEach(usuario => {
                        filaUsuarioInformacion.innerHTML=`
                            <td colspan="3"><small>Id</small> <b>${usuario.CODBARR_CLIEN}</b> || <small>Cliente:</small> <b>${usuario.NOMBRE}</b></td>
                        `;
                        tablaContratos.appendChild(filaUsuarioInformacion);
                    })
                    respuestas[1].forEach(contratos => {
                        const filatablaContratos = document.createElement('tr');
                        const columnaContratos = document.createElement('td');
                        columnaContratos.classList.add('sapt-min-w95');
                        columnaContratos.innerHTML=`
                            <div class="row">
                                <div class="col-md-3 col-12 fuente-12p">Contrato: <strong>${contratos.CONTRATO_CCONT}</strong></div>
                                <div class="col-md-9 col-12 fuente-12p">Dirección del contrato ${contratos.DIRECCION} | ${contratos.DESCRIPCION_CTARI} | ${contratos.DESCRIPCION_CPERM}</div>
                            </div>
                        `;
                        filatablaContratos.appendChild(columnaContratos);
                        const columnaAcciones = document.createElement('td');
                        const botonVerConceptos = document.createElement('button');
                        botonVerConceptos.setAttribute('dataview',contratos.idTablePk);
                        botonVerConceptos.setAttribute('id','botonVerSel');
                        if(contratos.ESTATUS_CCONT=='BAJD' || contratos.ESTATUS_CCONT=='BAJT'){
                            botonVerConceptos.setAttribute('disabled','disabled');
                            botonVerConceptos.classList.add('btn','btn-white','btn-sm');
                            botonVerConceptos.innerHTML='<i class="fas fa-eye-slash"></i> Baja';
                        }else {
                            botonVerConceptos.innerHTML='<i class="fas fa-eye"></i> Detalles';
                            botonVerConceptos.classList.add('btn','btn-info','btn-sm');
                        }
                        botonVerConceptos.addEventListener('click', () => {
                            mostrarDetallesPago(botonVerConceptos);
                        })
                        columnaAcciones.classList.add('sapt-min-w120x');
                        columnaAcciones.appendChild(botonVerConceptos);
                        filatablaContratos.appendChild(columnaAcciones);
                        tablaContratos.appendChild(filatablaContratos);
                    })
                    busquedaUsuarios.innerHTML='';
                    datosContratosPago.appendChild(tablaContratos);
                    interaccionBotones.classList.remove('d-none');
                }
                let botonResetear = document.querySelector('#botonResetear');
                botonResetear.addEventListener('click', () => {
                    datosContratosPago.innerHTML='';
                    datosDeudaDetalle.innerHTML='';
                    interaccionBotones.classList.add('d-none');
                    buscadorUsuarios();
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

const mostrarDetallesPago = async (botonVerConceptos) => {
    try {
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
                let textMovimiento = document.querySelector('#textMovimiento');
                let datosDeudaDetalle = document.querySelector('#datosDeudaDetalle');
                let textoContratoCobro = document.querySelector('#textoContratoCobro');
                let textoDeudaTotal = document.querySelector('#textoDeudaTotal');
                let seccContrato = idBusqueda.split('_');
                textoContratoCobro.innerHTML=`Contrato ${seccContrato[1]}`;
                textMovimiento.value=idBusqueda;
                datosDeudaDetalle.innerHTML=cargaAnimacion;
                textoDeudaTotal.innerHTML=cargaAnimacion;
                fetch(`reportedeuda/mostrarDeudasDetalle/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    const tablaDetallesPago = document.createElement('table');
                    tablaDetallesPago.classList.add('table','table-sm','table-hover','fuente-12p');
                    tablaDetallesPago.innerHTML=`
                        <thead>
                            <th class="col">Conceptos</th>
                            <th>Estatus</th>
                        </thead>
                    `;
                    const cuerpoTablaDetalles = document.createElement('tbody');
                    if(respuestas[0]==null){
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
                        botonHistorico.innerHTML='Mostrar Historial <i class="fas fa-clock"></i>';
                        botonHistorico.addEventListener('click', () => {
                            verHistoricoPagado(botonHistorico);
                        })
                        columnaAcciones.appendChild(botonHistorico);
                        filaDetallesPago.appendChild(columnaAcciones);
                        cuerpoTablaDetalles.appendChild(filaDetallesPago);
                    }else{
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
                            if(detallePago.ESTATUS_DETA=='ADEU'){
                                columnaAcciones.innerHTML='<i class="fas fa-money-bill text-warning"></i>'
                            }
                            filasDetalles.appendChild(columnaAcciones);
                            cuerpoTablaDetalles.append(filasDetalles);
                        })
                    }
                    tablaDetallesPago.appendChild(cuerpoTablaDetalles);
                    datosDeudaDetalle.classList.add('tabla-contenedor');
                    datosDeudaDetalle.innerHTML='';
                    datosDeudaDetalle.appendChild(tablaDetallesPago);
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

function validarMetodoBus(){
    let inputForm = document.querySelector("#textMetodoBus");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Método Busqueda es requerido',
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
