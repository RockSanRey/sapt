let botonGuardar = document.querySelector('#botonGuardar');
let botonAsignar = document.querySelector('#botonAsignar');
let botonContrato = document.querySelector('#botonContrato');
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonGuardar.addEventListener('click', () => {
        guardarUsuarioTransferencia();
    })
    botonAsignar.addEventListener('click', () => {
        actualizarUsuarioTransferencia();
    })
    botonContrato.addEventListener('click', () => {
        transferirContrato();
    })
    botonCancelar.addEventListener('click', () => {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML='';
    })
})

const plantillaBusqueda = async () => {
    try{
        let busquedaContratos = document.querySelector('#busquedaContratos');
        busquedaContratos.classList.remove('d-none');
        busquedaContratos.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de contrato que se va a transferir</li>
                </ol>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control form-control-sm" name="textContrato" id="textContrato" placeholder="Buscar Contrato" autocomplete="off" autofocus/>
                <input type="hidden" name="textIdContrato" id="textIdContrato" value="" />
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarContrato">Buscar</button>
                </div>
            </div>
        `;
        let textContrato = document.querySelector('#textContrato');
        let userListComplete = document.querySelector('#userListComplete');
        let textIdContrato = document.querySelector('#textIdContrato');
        textContrato.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                buscarContratoInformacion(textIdContrato);
            }else if(e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 8){
                completarBusquedaContratos(textContrato);
            }
        })
        botonAsignar.classList.add('d-none');
        let butonBuscarContrato = document.querySelector('#butonBuscarContrato');
        butonBuscarContrato.addEventListener('click', () => {
            buscarContratoInformacion(textIdContrato);
        })
        textContrato.focus();

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const completarBusquedaContratos = async (textContrato) => {
    try{
        let userListComplete = document.querySelector('#userListComplete');
        let textIdContrato = document.querySelector('#textIdContrato');
        userListComplete.innerHTML='';
        if(textContrato.value=='' || textContrato.value==null){
            userListComplete.innerHTML='';
        }else{
            let idBusqueda = textContrato.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`atramites/autocompletarContrato/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    userListComplete.innerHTML='';
                    const listadoUl = document.createElement('ul');
                    listadoUl.innerHTML='';
                    listadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(contrato => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= '<small><strong>'+contrato.CONTRATO_CCONT+'</strong></small>'+' '+contrato.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdContrato.value=contrato.IDCONTRATO;
                            textContrato.value = contrato.CONTRATO_CCONT+' - '+contrato.NOMBRE;
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

const buscarContratoInformacion = async (textIdContrato) => {
    try{
        let plantillaContrato = document.querySelector('#plantillaContrato');
        if(textIdContrato.value=='' || textIdContrato.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el usuario a buscar',
            })
        }else{
            let idBusqueda = textIdContrato.value;
            let busquedaContratos = document.querySelector('#busquedaContratos');
            let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
            let plantillaContrato = document.querySelector('#plantillaContrato');
            datosContratoDetalle.innerHTML=cargaAnimacion;
            fetch(`atracontrato/llenarTablaContratoTransferir/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                busquedaContratos.innerHTML=`
                    <div class="card-text text-justify">
                        <ol class="col-12 fuente-12p" start="2">
                            <li>Haz clic en el boton <span class="btn btn-info btn-sm"><i class="fas fa-user-plus"></i></span> para crear al usuario que se le va a transferir el contrato.</li>
                        </ol>
                    </div>
                `;
                const botonResetear = document.createElement('button');
                botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
                botonResetear.innerHTML='Otra Transferencia';
                botonResetear.addEventListener('click', () => {
                    datosContratoDetalle.innerHTML='';
                    plantillaContrato.innerHTML='';
                    plantillaBusqueda();
                })
                const tablaContratos = document.createElement('table');
                tablaContratos.classList.add('table','table-sm','table-bordered');
                const cuerpoTablaContratos = document.createElement('tbody');
                respuestas.forEach(contrato => {
                    const filaTablaContratos = document.createElement('tr');
                    const columnaDetalles = document.createElement('td');
                    columnaDetalles.classList.add('fuente-12p','col');
                    columnaDetalles.innerHTML=`
                        <div class="row">
                            <div class="col-md-2 col-12"><small>Contrato:</small> ${contrato.CONTRATO_CCONT}</div>
                            <div class="col-md-10 col-12">
                                <div><small>Usuario:</small> ${contrato.NOMBRE}</div>
                                <div><small>Dirección:</small> ${contrato.CALLES}, ${contrato.COLONIA_CODPOS}, ${contrato.CODIPOST_CODPOS}, ${contrato.COLONIA_CODPOS}</div>
                                <div class="row">
                                    <div class="col-md-3 col-6"><small>Tipo Contrato:</small> ${contrato.DESCRIPCION_CONT}</div>
                                    <div class="col-md-3 col-6"><small>Perm. Asamblea:</small> ${contrato.DESCRIPCION_CPERM}</div>
                                    <div class="col-md-3 col-6"><small>Tarifa:</small> ${contrato.DESCRIPCION_CTARI}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    filaTablaContratos.appendChild(columnaDetalles);
                    const columnaAcciones = document.createElement('td');
                    const botonNuevoUsuario = document.createElement('button');
                    botonNuevoUsuario.classList.add('btn','btn-info','btn-sm');
                    botonNuevoUsuario.setAttribute('datatrans',contrato.idTablePk);
                    botonNuevoUsuario.setAttribute('data-toggle','modal');
                    botonNuevoUsuario.setAttribute('data-target','#formRegistroDatos');
                    botonNuevoUsuario.innerHTML='<i class="fas fa-user-plus"></i>';
                    botonNuevoUsuario.addEventListener('click', () => {
                        crearUsuarioTransferido(botonNuevoUsuario);
                    })
                    const botonUsuarioExiste = document.createElement('button');
                    botonUsuarioExiste.classList.add('btn','btn-success','btn-sm');
                    botonUsuarioExiste.setAttribute('datatrans',contrato.idTablePk);
                    botonUsuarioExiste.setAttribute('data-toggle','modal');
                    botonUsuarioExiste.setAttribute('data-target','#formRegistroDatos');
                    botonUsuarioExiste.innerHTML='<i class="fas fa-user-friends"></i>';
                    botonUsuarioExiste.addEventListener('click', () => {
                        TransferirUsuarioRegistrado(botonUsuarioExiste);
                    })
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonNuevoUsuario);
                    grupoAcciones.appendChild(botonUsuarioExiste);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaContratos.appendChild(columnaAcciones);
                    cuerpoTablaContratos.appendChild(filaTablaContratos);
                })
                tablaContratos.appendChild(cuerpoTablaContratos);
                datosContratoDetalle.innerHTML='';
                datosContratoDetalle.appendChild(tablaContratos);
                datosContratoDetalle.appendChild(botonResetear);

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

const crearUsuarioTransferido = async (botonNuevoUsuario) => {
    try {
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let idBusqueda = botonNuevoUsuario.attributes.datatrans.value;
        botonContrato.classList.add('d-none');
        botonAsignar.classList.add('d-none');
        botonGuardar.classList.remove('d-none');
        labelTitleModal.innerHTML='Crear Usuario'
        return Swal.fire({
            title: 'Tramites',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, crear',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea crear usuario para transferir contrato?',
        })
        .then((result) => {
            if(result.isConfirmed){
                formRegistroCRUD.innerHTML=`
                    <div class="bg-white p-2 mb-1">
                        <div class="card-text text-justify">
                            <ol class="col-12 fuente-12p" start="3">
                                <li>Completa el registro de datos generales del nuevo usuario.</li>
                            </ol>
                        </div>
                        <input type="hidden" id="textIdCliente" name="textIdCliente" value="${idBusqueda}">
                        <div class="fuente-12p font-weight-bolder mb-2">Datos Personales</div>
                        <div class="row">
                            <div class="form-group col-md-4 col-12 mb-1">
                                <input type="text" name="textNombre" value="" class="form-control form-control-sm" id="textNombre" maxlength="30" placeholder="Nombre*">
                            </div>
                            <div class="form-group col-md-4 col-6 mb-1">
                                <input type="text" name="textApaterno" value="" class="form-control form-control-sm" id="textApaterno" maxlength="30" placeholder="A. Paterno*">
                            </div>
                            <div class="form-group col-md-4 col-6 mb-1">
                                <input type="text" name="textAmaterno" value="" class="form-control form-control-sm" id="textAmaterno" maxlength="30" placeholder="A. Materno">
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-4 col-6 mb-1">
                                <input type="text" name="textNacimiento" value="" class="form-control form-control-sm" id="textNacimiento" maxlength="13" placeholder="F Nacim.*" readonly>
                            </div>
                            <div class="form-group col-md-3 col-6 mb-1">
                            <select name="textSexo" id="textSexo" class="custom-select custom-select-sm"></select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-3 col-6 mb-1">
                                <input type="phone" name="textTelefono" value="" class="form-control form-control-sm" id="textTelefono" maxlength="13" placeholder="Telefono*">
                            </div>
                            <div class="form-group col-md-3 col-6 mb-1">
                                <input type="phone" name="textMovil" value="" class="form-control form-control-sm" id="textMovil" maxlength="13" placeholder="Telefono 2">
                            </div>
                            <div class="form-group col-md-6 col-12 mb-1">
                                <input type="text" name="textEmail" value="" class="form-control form-control-sm" id="textEmail" maxlength="250" placeholder="alguien@aqui.com*">
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-2">
                        <div class="fuente-12p font-weight-bolder mb-2">Ubicación</div>
                        <div class="row">
                            <div class="form-group col-md-3 col-12 mb-1">
                                <select name="textEstado" id="textEstado" class="custom-select custom-select-sm"></select>
                            </div>
                            <div class="form-group col-md-3 col-8 mb-1">
                                <select name="textMunicipio" id="textMunicipio" class="custom-select custom-select-sm"></select>
                            </div>
                            <div class="form-group col-md-2 col-4 mb-1">
                                <select name="textCodiPostal" id="textCodiPostal" class="custom-select custom-select-sm"></select>
                            </div>
                            <div class="form-group col-md-4 col-12 mb-1">
                            <select name="textColonia" id="textColonia" class="custom-select custom-select-sm"></select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6 col-12 mb-1">
                                <input type="text" name="textCalle" value="" class="form-control form-control-sm" id="textCalle" maxlength="50" placeholder="Calle*">
                                <div id="listaBusqueda" class="autocompletados"></div>
                            </div>
                            <div class="form-group col-md-3 col-12 mb-1">
                                <input type="text" name="textNexter" value="" class="form-control form-control-sm" id="textNexter" maxlength="30" placeholder="N. Ext.*">
                            </div>
                            <div class="form-group col-md-3 col-12 mb-1">
                                <input type="text" name="textNinter" value="" class="form-control form-control-sm" id="textNinter" maxlength="30" placeholder="N. Int.">
                            </div>
                        </div>
                        <div class="form-group mb-1">
                            <input type="text" name="textReferen" value="" class="form-control form-control-sm" id="textReferen" maxlength="80" placeholder="Referencia">
                        </div>
                    </div>
                `;
                let textSexo = document.querySelector('#textSexo');
                let textEstado = document.querySelector('#textEstado');
                let textMunicipio = document.querySelector('#textMunicipio');
                let textCodiPostal = document.querySelector('#textCodiPostal');
                let textColonia = document.querySelector('#textColonia');
                let textCalle = document.querySelector('#textCalle');
                let textNexter = document.querySelector('#textNexter');
                let textNinter = document.querySelector('#textNinter');
                let textReferen = document.querySelector('#textReferen');
                let estadoSelecto = '';
                let municipiSelecto = '';
                let codipostalSelecto = '';
                let coloniaSelecto = '';
                textSexo.innerHTML='<option value="">Sexo</option><option value="H">Hombre</option><option value="M">Mujer</option>';
                let fechaActual = new Date();
                let anioActual = fechaActual.getFullYear();
                let mesActual = fechaActual.getMonth();
                let diaActual = fechaActual.getDate();
                let selecionDia = new Datepicker(textNacimiento, {
                    'range': true,
                    'minDate': new Date(anioActual -99, mesActual, diaActual),
                    'maxDate': new Date(anioActual -18, mesActual, diaActual),
                    'format': 'yyyy-mm-dd',
                    'language': 'es',
                    'autohide': 'true'
                });
        
                fetch(`atracontrato/llenarUbicacionContrato/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    respuestas.forEach(ubicacion => {
                        textCalle.value=ubicacion.CALLE_UBIC;
                        textNexter.value=ubicacion.NEXTE_UBIC;
                        textNinter.value=ubicacion.NINTE_UBIC;
                        textReferen.value=ubicacion.REFERENCIA_UBIC;
                        estadoSelecto = ubicacion.ESTADO_UBIC;
                        municipiSelecto = ubicacion.MUNICIPIO_UBIC;
                        codipostalSelecto = ubicacion.CODIPOSTAL_UBIC;
                        coloniaSelecto = ubicacion.COLONIA_UBIC;
                        llenarComboEstadosSelect(textEstado,estadoSelecto);
                        llenarComboMunicipiosSelect(estadoSelecto,textMunicipio,municipiSelecto);
                        llenarComboCodigoPostalesSelect(municipiSelecto,textCodiPostal,codipostalSelecto);
                        llenarComboColoniasSelect(codipostalSelecto,textColonia,coloniaSelecto);
                    })
                })
            }else{
                botonCancelar.click();
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

const TransferirUsuarioRegistrado = async (botonUsuarioExiste) => {
    try {
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let idBusqueda = botonUsuarioExiste.attributes.datatrans.value;
        botonAsignar.classList.remove('d-none');
        botonContrato.classList.add('d-none');
        botonGuardar.classList.add('d-none');
        labelTitleModal.innerHTML='Crear Usuario'
        return Swal.fire({
            title: 'Tramites',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, transferir',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea transferir contrato a un usuario?',
        })
        .then((result) => {
            if(result.isConfirmed){
                const grupoUsuario = document.createElement('div');
                const grupoUbicacion = document.createElement('div');
                grupoUsuario.setAttribute('id','plantillaUsuario');
                botonAsignar.setAttribute('disabled','disabled');
                grupoUsuario.innerHTML=`
                    <div class="bg-white p-2 mb-1">
                        <div class="card-text text-justify">
                            <ol class="col-12 fuente-12p" start="3">
                                <li>Busca al usuario a transferir el contrato.</li>
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
                    </div>
                `;
                formRegistroCRUD.appendChild(grupoUsuario);
                let textUsuario = document.querySelector('#textUsuario');
                let userListComplete = document.querySelector('#userListComplete');
                let textIdUsuario = document.querySelector('#textIdUsuario');
                textUsuario.addEventListener('keyup', (e) => {
                    userListComplete.innerHTML='';
                    if(e.keyCode=='13'){
                        e.preventDefault();
                        buscarUsuarioInformacion(textIdUsuario);
                    }else if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode == 8){
                        completarBusquedaUsuarios(textUsuario);
                    }
                })
                let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
                butonBuscarUsuario.addEventListener('click', () => {
                    buscarUsuarioInformacion(textIdUsuario);
                })
                grupoUbicacion.innerHTML=`
                    <div class="bg-white p-2">
                        <div class="fuente-12p font-weight-bolder mb-2">Ubicación</div>
                        <div class="row">
                            <input type="hidden" id="textIdContrato" name="textIdContrato" value="">
                            <div class="form-group col-md-3 col-12 mb-1">
                                <select name="textEstado" id="textEstado" class="custom-select custom-select-sm"></select>
                            </div>
                            <div class="form-group col-md-3 col-8 mb-1">
                                <select name="textMunicipio" id="textMunicipio" class="custom-select custom-select-sm"></select>
                            </div>
                            <div class="form-group col-md-2 col-4 mb-1">
                                <select name="textCodiPostal" id="textCodiPostal" class="custom-select custom-select-sm"></select>
                            </div>
                            <div class="form-group col-md-4 col-12 mb-1">
                            <select name="textColonia" id="textColonia" class="custom-select custom-select-sm"></select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6 col-12 mb-1">
                                <input type="text" name="textCalle" value="" class="form-control form-control-sm" id="textCalle" maxlength="50" placeholder="Calle*">
                                <div id="listaBusqueda" class="autocompletados"></div>
                            </div>
                            <div class="form-group col-md-3 col-12 mb-1">
                                <input type="text" name="textNexter" value="" class="form-control form-control-sm" id="textNexter" maxlength="30" placeholder="N. Ext.*">
                            </div>
                            <div class="form-group col-md-3 col-12 mb-1">
                                <input type="text" name="textNinter" value="" class="form-control form-control-sm" id="textNinter" maxlength="30" placeholder="N. Int.">
                            </div>
                        </div>
                        <div class="form-group mb-1">
                            <input type="text" name="textReferen" value="" class="form-control form-control-sm" id="textReferen" maxlength="80" placeholder="Referencia">
                        </div>
                    </div>
                `;
                formRegistroCRUD.appendChild(grupoUbicacion);
                let textIdContrato = document.querySelector('#textIdContrato');
                let textEstado = document.querySelector('#textEstado');
                let textMunicipio = document.querySelector('#textMunicipio');
                let textCodiPostal = document.querySelector('#textCodiPostal');
                let textColonia = document.querySelector('#textColonia');
                let textCalle = document.querySelector('#textCalle');
                let textNexter = document.querySelector('#textNexter');
                let textNinter = document.querySelector('#textNinter');
                let textReferen = document.querySelector('#textReferen');
                let estadoSelecto = '';
                let municipiSelecto = '';
                let codipostalSelecto = '';
                let coloniaSelecto = '';

                fetch(`atracontrato/llenarUbicacionContrato/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    respuestas.forEach(ubicacion => {
                        textIdContrato.value=ubicacion.idTablePk;
                        textCalle.value=ubicacion.CALLE_UBIC;
                        textNexter.value=ubicacion.NEXTE_UBIC;
                        textNinter.value=ubicacion.NINTE_UBIC;
                        textReferen.value=ubicacion.REFERENCIA_UBIC;
                        estadoSelecto = ubicacion.ESTADO_UBIC;
                        municipiSelecto = ubicacion.MUNICIPIO_UBIC;
                        codipostalSelecto = ubicacion.CODIPOSTAL_UBIC;
                        coloniaSelecto = ubicacion.COLONIA_UBIC;
                        llenarComboEstadosSelect(textEstado,estadoSelecto);
                        llenarComboMunicipiosSelect(estadoSelecto,textMunicipio,municipiSelecto);
                        llenarComboCodigoPostalesSelect(municipiSelecto,textCodiPostal,codipostalSelecto);
                        llenarComboColoniasSelect(codipostalSelecto,textColonia,coloniaSelecto);
                    })
                })
                
            }else{
                botonCancelar.click();
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
                        listadoItemUl.innerHTML= '<small><strong>'+usuario.CODBARR_CLIEN+'</strong></small>'+' '+usuario.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdUsuario.value=usuario.IDUSUA_CLIEN;
                            textUsuario.value = usuario.CODBARR_CLIEN+' - '+usuario.NOMBRE;
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
    try {
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
            let plantillaUsuario = document.querySelector('#plantillaUsuario');
            let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
            butonBuscarUsuario.innerHTML='Espere... '+cargaAnimacion;
            fetch(`atracontrato/llenarUsuarioTransferir/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error'){

                }else{
                    botonAsignar.removeAttribute('disabled','disabled');
                    respuestas.forEach(usuario => {
                        let mailDecode='';
                        if(usuario.EMAIL_CLIEN==null){
                        }else{
                            mailDecode = atob(usuario.EMAIL_CLIEN).toString();
                        }                        
                        plantillaUsuario.innerHTML=`
                            <div class="bg-white p-2 mb-1">
                                <div class="card-text text-justify">
                                    <ol class="col-12 fuente-12p" start="4">
                                        <li>Completa el registro de datos generales del nuevo usuario.</li>
                                    </ol>
                                </div>
                                <input type="hidden" id="textIdCliente" name="textIdCliente" value="${usuario.IDUSUA_CLIEN}">
                                <div class="fuente-12p font-weight-bolder mb-2">Datos Personales</div>
                                <div class="row">
                                    <div class="form-group col-md-4 col-12 mb-1">
                                        <input type="text" name="textNombre" value="${usuario.NOMBRE_CLIEN}" class="form-control form-control-sm" id="textNombre" maxlength="30" placeholder="Nombre*">
                                    </div>
                                    <div class="form-group col-md-4 col-6 mb-1">
                                        <input type="text" name="textApaterno" value="${usuario.APATERNO_CLIEN}" class="form-control form-control-sm" id="textApaterno" maxlength="30" placeholder="A. Paterno*">
                                    </div>
                                    <div class="form-group col-md-4 col-6 mb-1">
                                        <input type="text" name="textAmaterno" value="${usuario.AMATERNO_CLIEN}" class="form-control form-control-sm" id="textAmaterno" maxlength="30" placeholder="A. Materno">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-4 col-6 mb-1">
                                        <input type="text" name="textNacimiento" value="${usuario.FNACIM_CLIEN}" class="form-control form-control-sm" id="textNacimiento" maxlength="13" placeholder="F Nacim.*" readonly>
                                    </div>
                                    <div class="form-group col-md-3 col-6 mb-1">
                                    <select name="textSexo" id="textSexo" class="custom-select custom-select-sm"></select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3 col-6 mb-1">
                                        <input type="phone" name="textTelefono" value="${usuario.TELEFONO_CLIEN}" class="form-control form-control-sm" id="textTelefono" maxlength="13" placeholder="Telefono*">
                                    </div>
                                    <div class="form-group col-md-3 col-6 mb-1">
                                        <input type="phone" name="textMovil" value="${usuario.MOVIL_CLIEN}" class="form-control form-control-sm" id="textMovil" maxlength="13" placeholder="Telefono 2">
                                    </div>
                                    <div class="form-group col-md-6 col-12 mb-1">
                                        <input type="text" name="textEmail" value="${mailDecode}" class="form-control form-control-sm" id="textEmail" maxlength="250" placeholder="alguien@aqui.com*">
                                    </div>
                                </div>
                            </div>
                        `;
                        let textSexo = document.querySelector('#textSexo');
                        if(usuario.SEXO_CLIEN=='H'){
                            textSexo.innerHTML=`
                                <option value="">Sexo</option>
                                <option value="H" selected="selected">Hombre</option>
                                <option value="M">Mujer</option>
                            `;
                        }else if(usuario.SEXO_CLIEN=='M'){
                            textSexo.innerHTML=`
                                <option value="">Sexo</option>
                                <option value="H">Hombre</option>
                                <option value="M" selected="selected">Mujer</option>
                            `;
                        }else{
                            textSexo.innerHTML=`
                                <option value="">Sexo</option>
                                <option value="H">Hombre</option>
                                <option value="M">Mujer</option>
                            `;
                        }
                        let fechaActual = new Date();
                        let anioActual = fechaActual.getFullYear();
                        let mesActual = fechaActual.getMonth();
                        let diaActual = fechaActual.getDate();
                        let selecionDia = new Datepicker(textNacimiento, {
                            'range': true,
                            'minDate': new Date(anioActual -99, mesActual, diaActual),
                            'maxDate': new Date(anioActual -18, mesActual, diaActual),
                            'format': 'yyyy-mm-dd',
                            'language': 'es',
                            'autohide': 'true'
                        });
        
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

const llenarComboEstadosSelect = async (textEstado, estadoSelecto) => {
    try{
        textEstado.innerHTML='<option value="">Estado</option>';
        fetch('catalogos/llenarComboCatEstados')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_ESTA);
                    opcionSelect.classList.add('fuente-12p');
                    if(estadoSelecto==estados.CLAVE_ESTA){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=estados.ESTADO_ESTA;
                        textEstado.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=estados.ESTADO_ESTA;
                        textEstado.appendChild(opcionSelect);
                    }
                });
            }
            textEstado.addEventListener('change',() => {
                llenarComboMunicipiosSelect(textEstado);
            });
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

const llenarComboMunicipiosSelect = async (estadoSelecto, textMunicipio, municipiSelecto) => {
    try{
        textMunicipio.innerHTML='<option value="">Municipio</option>';
        fetch(`catalogos/llenarComboCatMunicipios/${estadoSelecto}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(municipios => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', municipios.CLVMUNI_MUNIC);
                    opcionSelect.classList.add('fuente-12p');
                    if(municipiSelecto==municipios.CLVMUNI_MUNIC){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.NOMBRE_MUNIC;
                        textMunicipio.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.NOMBRE_MUNIC;
                        textMunicipio.appendChild(opcionSelect);
                    }
                });
            }
            textMunicipio.addEventListener('change',() => {
                llenarComboCodigoPostales(textMunicipio);
            });
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

const llenarComboCodigoPostalesSelect = async (municipiSelecto, textCodiPostal, codipostalSelecto) => {
    try{
        textCodiPostal.innerHTML='<option value="">C.P.</option>';
        fetch(`catalogos/llenarComboCatCodPostales/${municipiSelecto}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(municipios => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', municipios.CLVCODPOS_CODPOS);
                    opcionSelect.classList.add('fuente-12p');
                    if(codipostalSelecto==municipios.CLVCODPOS_CODPOS){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.CODIPOST_CODPOS;
                        textCodiPostal.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.CODIPOST_CODPOS;
                        textCodiPostal.appendChild(opcionSelect);
                    }
                });
            }
            textCodiPostal.addEventListener('change',() => {
                llenarComboCodigoPostales(textMunicipio);
            });
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

const llenarComboColoniasSelect = async (codipostalSelecto, textColonia, coloniaSelecto) => {
    try{
        textColonia.innerHTML='<option value="">Colonias</option>';
        fetch(`catalogos/llenarComboCatColonias/${codipostalSelecto}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textColonia.appendChild(opcionSelect);
            }else{
                respuestas.forEach(municipios => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', municipios.CLVCOLON_CODPOS);
                    opcionSelect.classList.add('fuente-12p');
                    if(coloniaSelecto==municipios.CLVCOLON_CODPOS){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.COLONIA_CODPOS;
                        textColonia.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.COLONIA_CODPOS;
                        textColonia.appendChild(opcionSelect);
                    }
                });
            }
            textColonia.addEventListener('change',() => {
                textCalle.focus();
            });
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

const guardarUsuarioTransferencia = async () => {
    try {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let plantillaTransferencia = document.querySelector('#plantillaTransferencia');
        let textIdCliente = document.querySelector('#textIdCliente');
        if(validarNombre() && validarApaterno() && validarAmaterno() && validarNacimiento() && validarSexo() && validarTelefono()
        && validarMovil() && validarEmail() && validarEstado() && validarMunicipio() && validarCodiPostal() && validarColonia()
        && validarCalle() && validarNexter() && validarNinter() && validarReferen()){
            botonGuardar.innerHTML='Espere... '+cargaAnimacion;
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('atracontrato/guardarUsuarioTransferir', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    labelTitleModal.innerHTML='Transferir Contrato';
                    botonGuardar.innerHTML='Guardar';
                    botonGuardar.classList.add('d-none');
                    botonContrato.classList.remove('d-none');
                    let grupoFormulario = document.createElement('div')
                    grupoFormulario.classList.add('bg-white','p-2');
                    grupoFormulario.innerHTML=`
                        <div class="card-text text-justify">
                            <ol class="col-12 fuente-12p" start="5">
                                <li>Modifcar los detalles de contrato para hacer transferencia.</li>
                            </ol>
                        </div>
                    `;
                    respuestas[0].forEach(usuario => {
                        const grupoUsuario = document.createElement('div');
                        grupoUsuario.innerHTML=`
                            <div class="form-group">
                                <input type="hidden" id="textIdCliente" name="textIdCliente" value="${usuario.IDUSUA_CLIEN}">
                                <input type="hidden" id="textIdUbicacion" name="textIdUbicacion" value="${usuario.IDUBIC_UBIC}">
                                <div class="form-control form-control-sm">${usuario.NOMBRE}</div>
                            </div>
                        `;
                        grupoFormulario.appendChild(grupoUsuario);
                    })
                    formRegistroCRUD.innerHTML='';
                    formRegistroCRUD.appendChild(grupoFormulario);
                    respuestas[1].forEach(contrato => {
                        const grupoContrato = document.createElement('div');
                        grupoContrato.innerHTML=`
                            <input type="hidden" id="textIdContrato" name="textIdContrato" value="${contrato.IDCONTRATO}">
                            <input type="hidden" id="textContratoT" name="textContratoT" value="${contrato.CONTRATO_CCONT}">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textTipoContrato" name="textTipoContrato"></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textExpContrato" name="textExpContrato"></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textPermisos" name="textPermisos"></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textDescuento" name="textDescuento"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <textarea class="form-control form-control-sm" rows="5" id="textComentarios" name="textComentarios">${contrato.COMENTS_CCONT}</textarea>
                            </div>
                        `;
                        grupoFormulario.appendChild(grupoContrato);
                        formRegistroCRUD.appendChild(grupoFormulario);
                        let textTipoContrato = document.querySelector('#textTipoContrato')
                        let textExpContrato = document.querySelector('#textExpContrato')
                        let textPermisos = document.querySelector('#textPermisos')
                        let textDescuento = document.querySelector('#textDescuento')
                        let tipoSelecto = contrato.TIPO_CCONT;
                        let modoSelecto = contrato.MODO_CCONT;
                        let permisoSelecto = contrato.PERMISO_CCONT;
                        let descuentoSelecto = contrato.DESCUENTO_CCONT
                        llenarComboContratosSel(textTipoContrato,tipoSelecto);
                        llenarComboExpedicionSel(textExpContrato,modoSelecto);
                        llenarComboPermisosSel(textPermisos,permisoSelecto);
                        llenarComboTarifaSel(textDescuento,descuentoSelecto);
    
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

const actualizarUsuarioTransferencia = async () => {
    try {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        let plantillaTransferencia = document.querySelector('#plantillaTransferencia');
        let textIdCliente = document.querySelector('#textIdCliente');
        if(validarCliente() && validarNombre() && validarApaterno() && validarAmaterno() && validarNacimiento() && validarSexo() && validarTelefono()
        && validarMovil() && validarEmail() && validarEstado() && validarMunicipio() && validarCodiPostal() && validarColonia()
        && validarCalle() && validarNexter() && validarNinter() && validarReferen()){
            botonAsignar.innerHTML='Espere... '+cargaAnimacion;
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('atracontrato/actualizarUsuarioTransferir', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    labelTitleModal.innerHTML='Transferir Contrato';
                    botonAsignar.innerHTML='Asignar'
                    botonAsignar.classList.add('d-none');
                    botonContrato.classList.remove('d-none');
                    let grupoFormulario = document.createElement('div')
                    grupoFormulario.classList.add('bg-white','p-2');
                    grupoFormulario.innerHTML=`
                        <div class="card-text text-justify">
                            <ol class="col-12 fuente-12p" start="5">
                                <li>Modifcar los detalles de contrato para hacer transferencia.</li>
                            </ol>
                        </div>
                    `;
                    respuestas[0].forEach(usuario => {
                        const grupoUsuario = document.createElement('div');
                        grupoUsuario.innerHTML=`
                            <div class="form-group">
                                <input type="hidden" id="textIdCliente" name="textIdCliente" value="${usuario.IDUSUA_CLIEN}">
                                <input type="hidden" id="textIdUbicacion" name="textIdUbicacion" value="${usuario.IDUBIC_UBIC}">
                                <div class="form-control form-control-sm">${usuario.NOMBRE}</div>
                            </div>
                        `;
                        grupoFormulario.appendChild(grupoUsuario);
                    })
                    formRegistroCRUD.innerHTML='';
                    formRegistroCRUD.appendChild(grupoFormulario);
                    respuestas[1].forEach(contrato => {
                        const grupoContrato = document.createElement('div');
                        grupoContrato.innerHTML=`
                            <input type="hidden" id="textIdContrato" name="textIdContrato" value="${contrato.IDCONTRATO}">
                            <input type="hidden" id="textContratoT" name="textContratoT" value="${contrato.CONTRATO_CCONT}">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textTipoContrato" name="textTipoContrato"></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textExpContrato" name="textExpContrato"></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textPermisos" name="textPermisos"></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <select class="custom-select custom-select-sm" id="textDescuento" name="textDescuento"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <textarea class="form-control form-control-sm" rows="5" id="textComentarios" name="textComentarios">${contrato.COMENTS_CCONT}</textarea>
                            </div>
                        `;
                        grupoFormulario.appendChild(grupoContrato);
                        formRegistroCRUD.appendChild(grupoFormulario);
                        let textTipoContrato = document.querySelector('#textTipoContrato')
                        let textExpContrato = document.querySelector('#textExpContrato')
                        let textPermisos = document.querySelector('#textPermisos')
                        let textDescuento = document.querySelector('#textDescuento')
                        let tipoSelecto = contrato.TIPO_CCONT;
                        let modoSelecto = contrato.MODO_CCONT;
                        let permisoSelecto = contrato.PERMISO_CCONT;
                        let descuentoSelecto = contrato.DESCUENTO_CCONT
                        llenarComboContratosSel(textTipoContrato,tipoSelecto);
                        llenarComboExpedicionSel(textExpContrato,modoSelecto);
                        llenarComboPermisosSel(textPermisos,permisoSelecto);
                        llenarComboTarifaSel(textDescuento,descuentoSelecto);
    
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

const llenarComboContratosSel = async (textTipoContrato,tipoSelecto) => {
    try {
        textTipoContrato.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatContrato')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textTipoContrato.appendChild(opcionSelect);
            }else{
                textTipoContrato.innerHTML='<option value="">Tipo Contrato*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CONT);
                    opcionSelect.classList.add('fuente-12p');
                    if(tipoSelecto==estados.CLAVE_CONT){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CONT;
                    textTipoContrato.appendChild(opcionSelect);
                });
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

const llenarComboExpedicionSel = async (textExpContrato,modoSelecto) => {
    try {
        textExpContrato.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatExpedicion')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textExpContrato.appendChild(opcionSelect);
            }else{
                textExpContrato.innerHTML='<option value="">Expedición*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CEXP);
                    opcionSelect.classList.add('fuente-12p');
                    if(modoSelecto==estados.CLAVE_CEXP){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CEXP;
                    textExpContrato.appendChild(opcionSelect);
                });
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

const llenarComboPermisosSel = async (textPermisos,permisoSelecto) => {
    try {
        textPermisos.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatPermisos')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textPermisos.appendChild(opcionSelect);
            }else{
                textPermisos.innerHTML='<option value="">Permisos*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CPERM);
                    opcionSelect.classList.add('fuente-12p');
                    if(permisoSelecto==estados.CLAVE_CPERM){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CPERM;
                    textPermisos.appendChild(opcionSelect);
                });
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

const llenarComboTarifaSel = async (textDescuento,descuentoSelecto) => {
    try {
        textDescuento.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatTarifa')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textDescuento.appendChild(opcionSelect);
            }else{
                textDescuento.innerHTML='<option value="">Tarifa*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CTARI);
                    opcionSelect.classList.add('fuente-12p');
                    if(descuentoSelecto==estados.CLAVE_CTARI){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CTARI;
                    textDescuento.appendChild(opcionSelect);
                });
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

const transferirContrato = async () => {
    try {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        if(validarCliente() && validarUbicacion() && validarContrato() && validarTipoContrato() && validarExpContrato()
        && validarPermisos() && validarDescuento() && validarComentarios()){
            let textIdCliente = document.querySelector('#textIdCliente');
            let textContratoT = document.querySelector('#textContratoT');
            let textIdContrato = document.querySelector('#textIdContrato');
            let plantillaContrato = document.querySelector('#plantillaContrato');
            botonContrato.innerHTML='Espere... '+cargaAnimacion;
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('atracontrato/transferirContratoFinal', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    }).then((result) => {
                        if((result.isConfirmed)){
                            botonContrato.innerHTML='Transferir Contrato';
                            textIdContrato.value = textIdCliente.value+'_'+textContratoT.value;
                            buscarContratoInformacion(textIdContrato);
                            const botonImprimirRecibo = document.createElement('button');
                            botonImprimirRecibo.classList.add('btn','btn-sm','btn-info');
                            botonImprimirRecibo.setAttribute('datarecib',textIdContrato.value);
                            botonImprimirRecibo.innerHTML='<i class="fas fa-pdf-file"></i> Imprimir Recibo';
                            botonImprimirRecibo.addEventListener('click', ()=> {
                                imprimirReciboTransferencia(botonImprimirRecibo);
                            })
                            plantillaContrato.appendChild(botonImprimirRecibo);
                            botonCancelar.click();
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

const imprimirReciboTransferencia = async (botonImprimirRecibo) => {
    try {
        let idBusqueda = botonImprimirRecibo.attributes.datarecib.value;
        let plantillaTransferencia = document.querySelector('#plantillaTransferencia');
        plantillaTransferencia.innerHTML='';
        const reciboTransferencia = document.createElement('div');
        fetch(`atracontrato/imprimirReciboTransferencia/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            plantillaTransferencia.innerHTML=`
                <style>
                    @font-face {
                        font-family: 'Montserrat';
                        src: url('public/assets/estilos/css_frontend/Montserrat/Montserrat-Regular.ttf') format('truetype');
                        font-style: normal;
                        font-weight: normal;
                    }
    
                </style>
            `;
            let fechaHoy = new Date();
            let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
            const cabeceraComprobante = document.createElement('table');
            cabeceraComprobante.setAttribute('border','0');
            cabeceraComprobante.setAttribute('cellspacing','0');
            cabeceraComprobante.setAttribute('cellpadding','0');
            cabeceraComprobante.setAttribute('style','width: 100%; font-family: Montserrat;');
            let nombrePresi='';
            let puestoPresi='';
            let nombreTesor='';
            let puestoTesor='';
            respuestas[1].forEach(presid => {
                nombrePresi=presid.NOMBRE;
                puestoPresi=presid.DESCRIPHOM_PUESTO;
            })
            respuestas[2].forEach(tesore => {
                nombreTesor=tesore.NOMBRE;
                puestoTesor=tesore.DESCRIPHOM_PUESTO;
            })
            respuestas[0].forEach(recibo => {
                let sexoAlta='';
                let transRecep='';
                if(recibo.SEXOALTA=='H'){
                    sexoAlta='el';
                    transRecep='EL TRANSFERIDO';
                }else if(recibo.SEXOALTA=='M'){
                    sexoAlta='la';
                    transRecep='LA TRANSFERIDA';
                }else{
                    sexoAlta='del';
                    transRecep='TRANSFERIDO';
                }
                let sexoBaja='';
                let transDador='';
                if(recibo.SEXOBAJA=='H'){
                    sexoBaja='el';
                    transDador='EL TRANSFIRIENTE';
                }else if(recibo.SEXOBAJA=='M'){
                    sexoBaja='la';
                    transDador='LA TRANSFIRIENTE'
                }else{
                    sexoBaja='del';
                    transDador='LA TRANSFIRIENTE'
                }
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
                        <td colspan="1"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:80px; height:80px; margin: auto;"/></td>
                        <td colspan="10" style="text-align: center;">
                            <div style="text-align: center; font-size: 14px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                            <div style="text-align: center; font-size: 10px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                        </td>
                        <td colspan="1"></td>
                    </tr>
                    <tr>
                        <td colspan="9"></td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237);">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha:</div>
                            <div style="float: right; margin-right: 5px; font-size:14px;">${recibo.FTRANS_TRANS}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="9"></td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237);">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Hora:</div>
                            <div style="float: right; margin-right: 5px; font-size:14px;">${recibo.HORACAP_TRANS}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="9"></td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237);">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Folio:</div>
                            <div style="float: right; margin-right: 5px; font-size:14px;">${recibo.FOLIO_TRANS}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:10px; font-size:14px; text-align:justify; border: 1px solid rgb(20,179,237); border-bottom: none;">
                            Conste con el presente documento de <strong>TRANSFERENCIA DE CONTRATO</strong> que otorgan de una parte 
                            ${sexoAlta} <strong>C. ${recibo.NOMBREALTA}</strong> con el número de usuario <strong>${recibo.CODBARRALTA}</strong>
                            y con domicilio en ${recibo.DOMICILIOALTA} a quien en adelante se le denominará <strong>${transRecep}</strong> 
                            y de la otra parte ${sexoBaja} <strong>C. ${recibo.NOMBREBAJA}</strong> con el número de usuario 
                            <strong>${recibo.CODBARRBAJA}</strong> y domicilio en ${recibo.DOMICILIOBAJA} a quien se le denominará 
                            <strong>${transDador}</strong> conforme a los terminos o condiciones siguientes.
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:10px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                            <strong>PRIMERA: ${transDador}</strong> declara que ha cubierto cualquier adeudo multa o sansión que se ha derivado del presente
                            contrato y que no tiene ningun tipo de recargo, y que la toma del servicio de agua esta completamente libre de
                            ilegalidades como alguna toma clandestina o ilegal que pueda derivar de futuras sanciones o demandas que se 
                            le trasladan al <strong>${transRecep}</strong>.
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:10px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                            <strong>SEGUNDA: ${transRecep}</strong> Adquiere las obligaciones y responsabilidades del contrato 
                            <strong>${recibo.CONTRATO_TRANS}</strong> que tiene domicilio actual en ${recibo.DOMICILIOCONTRATO} y que de 
                            hoy en adelante se encargará de realizar los pagos del mismo con las condiciones de tarifa y tipo que se quedan 
                            estipuladas en las caractetisticas del contrato y se adjuntan a continuación:
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:10px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                            <div style="margin-left:10px;">Tipo contrato: <strong>${recibo.DESCRIPCION_CONT}</strong></div>
                            <div style="margin-left:10px;">Modo de Contrato: <strong>${recibo.DESCRIPCION_CEXP}</strong></div>
                            <div style="margin-left:10px;">Presencia en Asambleas: <strong>${recibo.DESCRIPCION_CPERM}</strong></div>
                            <div style="margin-left:10px;">Tarifa: <strong>${recibo.DESCRIPCION_CTARI}</strong></div>
                            
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:10px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                            La presente transferencia se realiza con las siguientes observaciones o comentarios que describen la razón 
                            de la transferencia: <strong>${recibo.COMENTS_TRANS}</strong>.
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:10px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                            El presente documento da fe y legalidad de que las partes establecidas aceptan y estan de acuerdo con las deciciones aquí 
                            resueltas para un fin común conociendo las condiciones y términos establecidos en la asamblea del Cómite de Agua Potable Teltipan,
                            firman en comun acuerdo todas las partes:
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:40px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237);"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border-bottom: 1px solid rgb(20,179,237);"></td>
                        <td colspan="2" style="font-size:14px; text-align:justify; border: none;"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border-bottom: 1px solid rgb(20,179,237);"></td>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-right: 1px solid rgb(20,179,237);"></td>
                    </tr>
                    <tr>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237);"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border: none;">
                            <div style="text-align:center;">${recibo.NOMBREALTA}</div>
                            <div style="font-size: 12px; text-align:center;">${transRecep}</div>
                        </td>
                        <td colspan="2" style="font-size:14px; text-align:justify; border: none;"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border: none;">
                            <div style="text-align:center;">${recibo.NOMBREBAJA}</div>
                            <div style="font-size: 12px; text-align:center;">${transDador}</div>
                        </td>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-right: 1px solid rgb(20,179,237);"></td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:40px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237);"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border-bottom: 1px solid rgb(20,179,237);"></td>
                        <td colspan="2" style="font-size:14px; text-align:justify; border: none;"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border-bottom: 1px solid rgb(20,179,237);"></td>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-right: 1px solid rgb(20,179,237);"></td>
                    </tr>
                    <tr>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237);"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border: none;">
                            <div style="text-align:center;">${nombrePresi}</div>
                            <div style="font-size: 12px; text-align:center;">${puestoPresi}</div>
                        </td>
                        <td colspan="2" style="font-size:14px; text-align:justify; border: none;"></td>
                        <td colspan="4" style="font-size:14px; text-align:justify; border: none;">
                            <div style="text-align:center;">${nombreTesor}</div>
                            <div style="font-size: 12px; text-align:center;">${puestoTesor}</div>
                        </td>
                        <td colspan="1" style="font-size:14px; text-align:justify; border-right: 1px solid rgb(20,179,237);"></td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding:40px; font-size:14px; text-align:justify; border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">
                        </td>
                    </tr>
                `;
            })
            plantillaTransferencia.appendChild(cabeceraComprobante);
            let impriRecibo = window.open('', 'popimpr');
            impriRecibo.document.write(plantillaTransferencia.innerHTML);
            impriRecibo.document.close();
            impriRecibo.print();
            impriRecibo.close();
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

function validarCliente(){
    let inputForm = document.querySelector("#textIdCliente");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Cliente es requerido',
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

function validarNombre(){
    let inputForm = document.querySelector("#textNombre");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Nombre es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Nombre min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Nombre máx 40 caracteres',
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

function validarApaterno(){
    let inputForm = document.querySelector("#textApaterno");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Paterno es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Paterno min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Paterno máx 40 caracteres',
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

function validarAmaterno(){
    let inputForm = document.querySelector("#textAmaterno");
    if(inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Materno min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Materno máx 40 caracteres',
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

function validarNacimiento(){
    let inputForm = document.querySelector("#textNacimiento");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'F Nacimiento es requerido',
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

function validarSexo(){
    let inputForm = document.querySelector("#textSexo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Sexo es requerido',
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

function validarTelefono(){
    let inputForm = document.querySelector("#textTelefono");
    if(isNaN(inputForm.value)){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Teléfono solo números',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 8) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Telefono min 8 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 13) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Telefono máx 13 caracteres',
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

function validarMovil(){
    let inputForm = document.querySelector("#textMovil");
    if(isNaN(inputForm.value)){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Movil solo números',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 8) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Movil min 8 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 13) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Movil máx 13 caracteres',
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

function validarEmail(){
    let inputForm = document.querySelector("#textEmail");
    // if(inputForm.value==null || inputForm.value==''){
    //     Swal.fire({
    //         title: 'Campo Inválido',
    //         confirmButtonText: 'Revisar',
    //         confirmButtonColor: '#9C0000',
    //         icon: 'error',
    //         text: 'Email es requerido',
    //     }).then((result)=>{
    //         if(result.isConfirmed){
    //             inputError(inputForm);
    //         }
    //     })
    //     return false;
    // }else
    if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Email min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Email máx 40 caracteres',
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

function validarEstado(){
    let inputForm = document.querySelector("#textEstado");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Estado es requerido',
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

function validarMunicipio(){
    let inputForm = document.querySelector("#textMunicipio");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Municipio es requerido',
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

function validarCodiPostal(){
    let inputForm = document.querySelector("#textCodiPostal");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'C. P. es requerido',
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

function validarColonia(){
    let inputForm = document.querySelector("#textColonia");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Colonia es requerido',
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

function validarCalle(){
    let inputForm = document.querySelector("#textCalle");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Calle es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Calle min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Calle máx 40 caracteres',
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

function validarNexter(){
    let inputForm = document.querySelector("#textNexter");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Ext. es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Ext. min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Ext. máx 40 caracteres',
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

function validarNinter(){
    let inputForm = document.querySelector("#textNinter");
    if(inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. máx 40 caracteres',
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

function validarReferen(){
    let inputForm = document.querySelector("#textReferen");
    if (inputForm.length > 80) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. máx 80 caracteres',
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

function validarUbicacion(){
    let inputForm = document.querySelector("#textIdUbicacion");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Ubicacion es requerido',
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

function validarContrato(){
    let inputForm = document.querySelector("#textIdContrato");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Contrato es requerido',
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

function validarTipoContrato(){
    let inputForm = document.querySelector("#textTipoContrato");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'T. Contrato es requerido',
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

function validarExpContrato(){
    let inputForm = document.querySelector("#textExpContrato");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Expedición requerido',
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

function validarPermisos(){
    let inputForm = document.querySelector("#textPermisos");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Permisos es requerido',
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

function validarDescuento(){
    let inputForm = document.querySelector("#textDescuento");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Tarifa es requerido',
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

function validarComentarios(){
    let inputForm = document.querySelector("#textComentarios");
    if (inputForm.length > 400) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Comentarios. máx 400 caracteres',
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
