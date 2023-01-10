let botonActualizar = document.querySelector('#botonActualizar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonActualizar.addEventListener('click', () => {
        actualizarUbicacionContrato();
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
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el usuario a buscar',
            })
        }else{
            let idBusqueda = textIdContrato.value;
            let busquedaContratos = document.querySelector('#busquedaContratos');
            let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
            datosContratoDetalle.innerHTML=cargaAnimacion;
            fetch(`amodubicacio/llenarTablaUbicacionModificar/${idBusqueda}`)
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
                            <input type="hidden" id="textIdCliente" name="textIdCliente" value="${contrato.idTablePk}">
                            <div id="textCliente" class="form-control form-control-sm">${contrato.CONTRATO_CCONT} - ${contrato.CLIENTE}</div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-3">
                                <div class="custom-select custom-select-sm">${contrato.ESTADO_ESTA}</div>
                            </div>
                            <div class="form-group col-md-3">
                                <div class="custom-select custom-select-sm">${contrato.NOMBRE_MUNIC}</div>
                            </div>
                            <div class="form-group col-md-3">
                                <div class="custom-select custom-select-sm">${contrato.CODIPOST_CODPOS}</div>
                            </div>
                            <div class="form-group col-md-3">
                                <select class="custom-select custom-select-sm" id="textColonia" name="textColonia"></select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-4">
                                <input type="text" class="form-control form-control-sm" name="textCalle" id="textCalle" value="${contrato.CALLE_UBIC}" placeholder="Calle"/>
                            </div>
                            <div class="form-group col-md-3">
                                <input type="text" class="form-control form-control-sm" name="textNexte" id="textNexte" value="${contrato.NEXTE_UBIC}" placeholder="N. Ext."/>
                            </div>
                            <div class="form-group col-md-3">
                                <input type="text" class="form-control form-control-sm" name="textNinte" id="textNinte" value="${contrato.NINTE_UBIC}" placeholder="N. Int."/>
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control form-control-sm" rows="5" id="textReferencia" name="textReferencia">${contrato.REFERENCIA_UBIC}</textarea>
                        </div>
                    `;
                    let textColonia = document.querySelector('#textColonia')
                    let selCodiPostal = contrato.CODIPOSTAL_UBIC;
                    let selColonia = contrato.COLONIA_UBIC;
                    llenarComboColoniaSel(selCodiPostal,textColonia,selColonia);
                    botonActualizar.innerHTML='Actualizar';
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

const llenarComboColoniaSel = async (selCodiPostal, textColonia, selColonia) => {
    try{
        textColonia.innerHTML='<option value="">Colonias</option>';
        fetch(`catalogos/llenarComboCatColonias/${selCodiPostal}`)
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
                    if(selColonia==municipios.CLVCOLON_CODPOS){
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

const actualizarUbicacionContrato = async () => {
    try{
        if(validarCliente() && validarColonia() && validarCalle() && validarNexter() && validarNinter() && validarReferen()){
            let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
            botonActualizar.innerHTML='Espere...'+cargaAnimacion;
            const crearDatos = new FormData(datosContratoDetalle);
            fetch('amodubicacio/actualizarUbicacion', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    botonActualizar.innerHTML='Actualizado';
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    })
                    .then((result) => {
                        if(result.isConfirmed){
                            botonActualizar.classList.add('d-none');
                            datosContratoDetalle.innerHTML='';
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
    let textIdCliente = document.querySelector("#textIdCliente");
    let inputForm = document.querySelector("#textCliente");
    if(textIdCliente.value==null || textIdCliente.value==''){
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
    let inputForm = document.querySelector("#textNexte");
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
    let inputForm = document.querySelector("#textNinte");
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
    let inputForm = document.querySelector("#textReferencia");
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

function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
