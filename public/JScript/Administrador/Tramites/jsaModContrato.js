let botonActualizar = document.querySelector('#botonActualizar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonActualizar.addEventListener('click', () => {
        actualizarRegistroContrato();
    })
})

const plantillaBusqueda = async () => {
    try{
        let busquedaContratos = document.querySelector('#busquedaContratos');
        busquedaContratos.classList.remove('d-none');
        busquedaContratos.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de contrato que se va a modificar</li>
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
            }else if(e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57){
                completarBusquedaContratos(textContrato);
            }
        })
        botonActualizar.classList.add('d-none');
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
        if(textIdContrato.value=='' || textIdContrato.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#f43',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el usuario a buscar',
            })
        }else{
            let idBusqueda = textIdContrato.value;
            let busquedaContratos = document.querySelector('#busquedaContratos');
            let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
            datosContratoDetalle.innerHTML=cargaAnimacion;
            fetch(`amodcontrato/llenarTablaContratoModificar/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                busquedaContratos.innerHTML=`
                    <div class="card-text text-justify">
                        <ol class="col-12 fuente-12p" start="2">
                            <li>Modifica los campos que se van a cambiar y haz clic en actualizar para guardar los cambios.</li>
                        </ol>
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary mb-3" id="botonResetear">Modificar otro Contrato</button>
                `;
                let botonResetear = document.querySelector('#botonResetear');
                botonResetear.addEventListener('click', () => {
                    datosContratoDetalle.innerHTML='';
                    plantillaBusqueda();
                })
                respuestas.forEach(contrato => {
                    datosContratoDetalle.innerHTML=`
                        <div class="form-group">
                            <input type="hidden" id="textIdCliente" name="textIdCliente" value="${contrato.CLIENTE_CCONT}">
                            <input type="hidden" id="textIdContrato" name="textIdContrato" value="${contrato.CONTRATO_CCONT}">
                            <div class="form-control form-control-sm">${contrato.CONTRATO_CCONT} - ${contrato.NOMBRE}</div>
                        </div>
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
                    botonActualizar.classList.remove('d-none');
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

const actualizarRegistroContrato = async () => {
    try {
        let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
        if(validarCliente() && validarContrato() && validarTipoContrato() && validarExpContrato() && validarPermisos() &&
        validarDescuento() && validarComentarios()){
            const crearDatos = new FormData(datosContratoDetalle);
            fetch('amodcontrato/actualizarContratoDetalle', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    }).then((result) => {
                        if((result.isConfirmed)){
                            datosContratoDetalle.innerHTML='';
                            botonActualizar.classList.add('d-none');
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
    if (inputForm.length > 250) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. máx 250 caracteres',
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
