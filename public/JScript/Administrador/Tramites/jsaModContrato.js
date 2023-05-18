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
        // let teclaCodigo = document.querySelector('#teclaCodigo');
        textContrato.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                buscarContratoInformacion(textIdContrato);
            }else if(e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57){
                // teclaCodigo.innerHTML=e.keyCode;
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
        }else if(textContrato.value.length > 3){
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
            fetch(`amodcontrato/llenarTablaContratoModificar/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                busquedaContratos.innerHTML=`
                    <button type="button" class="btn btn-sm btn-secondary mb-3" id="botonResetear">Modificar otro Contrato</button>
                    <div class="card-text text-justify">
                        <ol class="col-12 fuente-12p" start="2">
                            <li>Selecciona que modificación vas a realizar en este contrato.</li>
                        </ol>
                    </div>
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
                            <div class="col-md-3 col-12">
                                <button type="button" class="btn btn-sm btn-info mb-3" id="botonModifTipo" modifTipo="TIPO">Modificar tipo contrato</button>
                            </div>
                            <div class="col-md-3 col-12">
                                <button type="button" class="btn btn-sm btn-info mb-3" id="botonModifModo" modifTipo="MODO">Modificar modo contrato</button>
                            </div>
                            <div class="col-md-3 col-12">
                                <button type="button" class="btn btn-sm btn-info mb-3" id="botonModifPerm" modifTipo="PERM">Modificar permiso asamblea</button>
                            </div>
                            <div class="col-md-3 col-12">
                                <button type="button" class="btn btn-sm btn-info mb-3" id="botonModifTarif" modifTipo="TARIF">Modificar tarifa contrato</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-3">
                                <input type="hidden" id="textTipoContrato" name="textTipoContrato" value="${contrato.TIPO_CCONT}">
                                <select class="custom-select custom-select-sm" id="textTipoContratoV" name="textTipoContratoV"></select>
                            </div>
                            <div class="form-group col-md-3">
                                <input type="hidden" id="textExpContrato" name="textExpContrato" value="${contrato.MODO_CCONT}">
                                <select class="custom-select custom-select-sm" id="textExpContratoV" name="textExpContratoV"></select>
                            </div>
                            <div class="form-group col-md-3">
                                <input type="hidden" id="textPermisos" name="textPermisos" value="${contrato.PERMISO_CCONT}">
                                <select class="custom-select custom-select-sm" id="textPermisosV" name="textPermisosV"></select>
                            </div>
                            <div class="form-group col-md-3">
                                <input type="hidden" id="textDescuento" name="textDescuento" value="${contrato.DESCUENTO_CCONT}">
                                <select class="custom-select custom-select-sm" id="textDescuentoV" name="textDescuentoV"></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control form-control-sm" rows="5" id="textComentarios" name="textComentarios" placeholder="Observaciones en este contrato">${contrato.COMENTS_CCONT}</textarea>
                        </div>
                        <div id="motivoTramite"></div>
                    `;
                    let textTipoContratoV = document.querySelector('#textTipoContratoV');
                    let textExpContratoV = document.querySelector('#textExpContratoV');
                    let textPermisosV = document.querySelector('#textPermisosV');
                    let textDescuentoV = document.querySelector('#textDescuentoV');
                    let botonModifTipo = document.querySelector('#botonModifTipo');
                    let botonModifModo = document.querySelector('#botonModifModo');
                    let botonModifPerm = document.querySelector('#botonModifPerm');
                    let botonModifTarif = document.querySelector('#botonModifTarif');
                    let textComentarios = document.querySelector('#textComentarios');                    
                    let tipoSelecto = contrato.TIPO_CCONT;
                    let modoSelecto = contrato.MODO_CCONT;
                    let permisoSelecto = contrato.PERMISO_CCONT;
                    let descuentoSelecto = contrato.DESCUENTO_CCONT
                    llenarComboContratosSel(textTipoContratoV,tipoSelecto);
                    llenarComboExpedicionSel(textExpContratoV,modoSelecto);
                    llenarComboPermisosSel(textPermisosV,permisoSelecto);
                    llenarComboTarifaSel(textDescuentoV,descuentoSelecto);
                    textTipoContratoV.setAttribute('disabled','disabled');
                    textExpContratoV.setAttribute('disabled','disabled');
                    textPermisosV.setAttribute('disabled','disabled');
                    textDescuentoV.setAttribute('disabled','disabled');
                    textComentarios.setAttribute('disabled','disabled');;
                    botonModifTipo.addEventListener('click', () => {
                        modificarContratoTramite(botonModifTipo);
                    })
                    botonModifModo.addEventListener('click', () => {
                        modificarContratoTramite(botonModifModo);
                    })
                    botonModifPerm.addEventListener('click', () => {
                        modificarContratoTramite(botonModifPerm);
                    })
                    botonModifTarif.addEventListener('click', () => {
                        modificarContratoTramite(botonModifTarif);
                    })
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

const llenarComboContratosSel = async (textTipoContratoV,tipoSelecto) => {
    try {
        textTipoContratoV.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatContrato')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textTipoContratoV.appendChild(opcionSelect);
            }else{
                textTipoContratoV.innerHTML='<option value="">Tipo Contrato*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CONT);
                    opcionSelect.classList.add('fuente-12p');
                    if(tipoSelecto==estados.CLAVE_CONT){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CONT;
                    textTipoContratoV.appendChild(opcionSelect);
                });
                textTipoContratoV.addEventListener('change', () => {
                    if(textTipoContratoV.value==''||textTipoContratoV.value==null){
                        textTipoContrato.value=='';
                    }else{
                        let textTipoContrato = document.querySelector('#textTipoContrato');
                        textTipoContrato.value=textTipoContratoV.value;
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

const llenarComboExpedicionSel = async (textExpContratoV,modoSelecto) => {
    try {
        textExpContratoV.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatExpedicion')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textExpContratoV.appendChild(opcionSelect);
            }else{
                textExpContratoV.innerHTML='<option value="">Expedición*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CEXP);
                    opcionSelect.classList.add('fuente-12p');
                    if(modoSelecto==estados.CLAVE_CEXP){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CEXP;
                    textExpContratoV.appendChild(opcionSelect);
                });
                textExpContratoV.addEventListener('change', () => {
                    if(textExpContratoV.value==''||textExpContratoV.value==null){
                        textExpContrato.value=='';
                    }else{
                        let textExpContrato = document.querySelector('#textExpContrato');
                        textExpContrato.value=textExpContratoV.value;
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

const llenarComboPermisosSel = async (textPermisosV,permisoSelecto) => {
    try {
        textPermisosV.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatPermisos')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textPermisosV.appendChild(opcionSelect);
            }else{
                textPermisosV.innerHTML='<option value="">Permisos*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CPERM);
                    opcionSelect.classList.add('fuente-12p');
                    if(permisoSelecto==estados.CLAVE_CPERM){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CPERM;
                    textPermisosV.appendChild(opcionSelect);
                });
                textPermisosV.addEventListener('change', () => {
                    if(textPermisosV.value==''||textPermisosV.value==null){
                        textPermisos.value=='';
                    }else{
                        let textPermisos = document.querySelector('#textPermisos');
                        textPermisos.value=textPermisosV.value;
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

const llenarComboTarifaSel = async (textDescuentoV,descuentoSelecto) => {
    try {
        textDescuentoV.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatTarifa')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textDescuentoV.appendChild(opcionSelect);
            }else{
                textDescuentoV.innerHTML='<option value="">Tarifa*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CTARI);
                    opcionSelect.classList.add('fuente-12p');
                    if(descuentoSelecto==estados.CLAVE_CTARI){
                        opcionSelect.setAttribute('selected','selected');
                    }
                    opcionSelect.innerHTML=estados.DESCRIPCION_CTARI;
                    textDescuentoV.appendChild(opcionSelect);
                });
                textDescuentoV.addEventListener('change', () => {
                    if(textDescuentoV.value==''||textDescuentoV.value==null){
                        textDescuento.value=='';
                    }else{
                        let textDescuento = document.querySelector('#textDescuento');
                        textDescuento.value=textDescuentoV.value;
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

const modificarContratoTramite = async (botonTipoTramite) => {
    try {
        let tipoModificacion = botonTipoTramite.attributes.modifTipo.value;
        let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
        let textTipoContratoV = document.querySelector('#textTipoContratoV')
        let textExpContratoV = document.querySelector('#textExpContratoV')
        let textPermisosV = document.querySelector('#textPermisosV')
        let textDescuentoV = document.querySelector('#textDescuentoV')
        let botonModifTipo = document.querySelector('#botonModifTipo');
        let botonModifModo = document.querySelector('#botonModifModo');
        let botonModifPerm = document.querySelector('#botonModifPerm');
        let botonModifTarif = document.querySelector('#botonModifTarif');
        let textComentarios = document.querySelector('#textComentarios');
        let motivoTramite = document.querySelector('#motivoTramite');
        botonModifTipo.setAttribute('disabled','disabled');
        botonModifModo.setAttribute('disabled','disabled');
        botonModifPerm.setAttribute('disabled','disabled');
        botonModifTarif.setAttribute('disabled','disabled');
        textTipoContratoV.setAttribute('disabled','disabled');
        textExpContratoV.setAttribute('disabled','disabled');
        textPermisosV.setAttribute('disabled','disabled');
        textDescuentoV.setAttribute('disabled','disabled');
    if(tipoModificacion=='TIPO'){
            botonModifTipo.removeAttribute('disabled');
            textTipoContratoV.removeAttribute('disabled');
            textComentarios.removeAttribute('disabled');
            motivoTramite.classList.add('form-group');
            motivoTramite.innerHTML=`
                <input type="hidden" id="textTipoModif" name="textTipoModif" value="${tipoModificacion}">
                <textarea class="form-control form-control-sm" rows="5" id="textMotivo" name="textMotivo" placeholder="Motivo para cambiar el tipo de contrato"></textarea>
                <button type="button" class="btn btn-sm btn-secondary mt-2" id="botonCancelar">Cancelar</button>
            `;
            datosContratoDetalle.appendChild(motivoTramite);
            textTipoContratoV.focus();
            botonActualizar.classList.remove('d-none');
        }else if(tipoModificacion=='MODO'){
            botonModifModo.removeAttribute('disabled');
            textExpContratoV.removeAttribute('disabled');
            textComentarios.removeAttribute('disabled');
            motivoTramite.classList.add('form-group');
            motivoTramite.innerHTML=`
                <input type="hidden" id="textTipoModif" name="textTipoModif" value="${tipoModificacion}">
                <textarea class="form-control form-control-sm" rows="5" id="textMotivo" name="textMotivo" placeholder="Motivo para cambiar el modo de contrato"></textarea>
                <button type="button" class="btn btn-sm btn-secondary mt-2" id="botonCancelar">Cancelar</button>
            `;
            datosContratoDetalle.appendChild(motivoTramite);
            textExpContratoV.focus();
            botonActualizar.classList.remove('d-none');
        }else if(tipoModificacion=='PERM'){
            botonModifPerm.removeAttribute('disabled');
            textPermisosV.removeAttribute('disabled');
            textComentarios.removeAttribute('disabled');
            motivoTramite.classList.add('form-group');
            motivoTramite.innerHTML=`
                <input type="hidden" id="textTipoModif" name="textTipoModif" value="${tipoModificacion}">
                <textarea class="form-control form-control-sm" rows="5" id="textMotivo" name="textMotivo" placeholder="Motivo para cambiar el permiso de asamblea"></textarea>
                <button type="button" class="btn btn-sm btn-secondary mt-2" id="botonCancelar">Cancelar</button>
            `;
            datosContratoDetalle.appendChild(motivoTramite);
            textPermisosV.focus();
            botonActualizar.classList.remove('d-none');
        }else if(tipoModificacion=='TARIF'){
            botonModifTarif.removeAttribute('disabled');
            textDescuentoV.removeAttribute('disabled');
            textComentarios.removeAttribute('disabled');
            motivoTramite.classList.add('form-group');
            motivoTramite.innerHTML=`
                <input type="hidden" id="textTipoModif" name="textTipoModif" value="${tipoModificacion}">
                <textarea class="form-control form-control-sm" rows="5" id="textMotivo" name="textMotivo" placeholder="Motivo para cambiar la tarifa de contrato"></textarea>
                <button type="button" class="btn btn-sm btn-secondary mt-2" id="botonCancelar">Cancelar</button>
            `;
            datosContratoDetalle.appendChild(motivoTramite);
            textDescuentoV.focus();
            botonActualizar.classList.remove('d-none');
        }
        let botonCancelar = document.querySelector('#botonCancelar');
        botonCancelar.addEventListener('click', () => {
            textTipoContratoV.setAttribute('disabled','disabled');
            botonModifTipo.removeAttribute('disabled');
            botonModifModo.removeAttribute('disabled');
            botonModifPerm.removeAttribute('disabled');
            botonModifTarif.removeAttribute('disabled');
            textTipoContratoV.setAttribute('disabled','disabled');
            textExpContratoV.setAttribute('disabled','disabled');
            textPermisosV.setAttribute('disabled','disabled');
            textDescuentoV.setAttribute('disabled','disabled');
            textComentarios.setAttribute('disabled','disabled');
            motivoTramite.innerHTML='';
            botonActualizar.classList.add('d-none');
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
        validarDescuento() && validarComentarios() && validarMotivo()){
            let botonCancelar = document.querySelector('#botonCancelar');
            let motivoTramite = document.querySelector('#motivoTramite');
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
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    botonCancelar.click();
                    respuestas.forEach(tramites => {
                        motivoTramite.innerHTML=`
                            <button type="button" class="btn btn-sm btn-success" id="botonImprimirAcuse" name="botonImprimirAcuse" tramiteAcuse="${tramites.FOLIO_CMODIF}_${tramites.CONTRATO_CMODIF}">Imprimir Acuse</button>
                        `;
                    })
                    let botonImprimirAcuse = document.querySelector('#botonImprimirAcuse');
                    botonImprimirAcuse.addEventListener('click', () => {
                        imprimirAcuseRecibo(botonImprimirAcuse);
                    })
                    return Swal.fire({
                        title: 'Tramites',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#009C06',
                        html: 'Se ha modificado el contrato ahora imprime el acuse.',
                        showConfirmButton: false,
                        timer: 2500,
                    }).then((result) => {
                        if((result.isDismissed)){
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

const imprimirAcuseRecibo = async (botonImprimirAcuse) => {
    try {
        Swal.fire({
            title: 'Imprimir',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, imprimir',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea imprimir los datos este contrato?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonImprimirAcuse.attributes.tramiteAcuse.value;
                let acuseReciboModificado = document.querySelector('#acuseReciboModificado');
                acuseReciboModificado.innerHTML='';
                acuseReciboModificado.innerHTML=`
                    <style>
                        @font-face {
                            font-family: 'Montserrat';
                            src: url('public/assets/estilos/css_frontend/Montserrat/Montserrat-Regular.ttf') format('truetype');
                            font-style: normal;
                            font-weight: normal;
                        }
                    </style>
                    <img src="public/assets/imagen/logotipos/logo_sapt_trans_300.png" style="position: absolute; margin: 150px 20%; width: 400px; height:400px;" />
                `;
                let fechaHoy = new Date();
                let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
                fetch(`areportes/imprimirAcuseModifica/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    const tablaAcuseBaja = document.createElement('table');
                    tablaAcuseBaja.setAttribute('border','0');
                    tablaAcuseBaja.setAttribute('cellspacing','0');
                    tablaAcuseBaja.setAttribute('cellpadding','0');
                    tablaAcuseBaja.setAttribute('style','width: 100%; font-family: Montserrat;');
                    let mensajeBaja = '';
                    let comiteParti = document.createElement('tr');
                    let titularBaja = '';
                    respuestas[0].forEach(bajas => {
                        let fechaSplit = bajas.FCAMBIO_CMODIF.split('-');
                        let contador = parseInt(fechaSplit[1]-1)
                        let mesesArray = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                        let mesMuestra = '';
                        let pronombre = '';
                        if(bajas.SEXO_CLIEN=='H'){
                            pronombre='el'
                        }else if(bajas.SEXO_CLIEN=='M'){
                            pronombre='la'
                        }else{
                            pronombre='del'
                        }
                        for(let mes=contador; mes <= contador; mes++){
                            mesMuestra=mesesArray[mes];
                        }
                        mensajeBaja=`
                            <tr>
                                <td colspan="12">
                                    <div style="text-align: right; padding:10px; font-weight:bolder;">ASUNTO: MODIFICACION DE CONTRATO</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="12">
                                    <div style="text-align: right; padding:10px; font-weight:bolder;">FOLIO: ${bajas.FOLIO_CMODIF}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="12">
                                    <div style="text-align: left; padding:10px; font-weight:bolder;">Contrato: ${bajas.CONTRATO_CMODIF}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="12">
                                    <div style="text-align: justify; padding:10px;">
                                        Por medio del presente documento queda escrito que el día ${fechaSplit[2]} de ${mesMuestra} de 
                                        ${fechaSplit[0]} en las instalaciones del pozo de agua potable de Teltipan de Juárez ${pronombre} C. 
                                        ${bajas.CLIENTE} con numero de contrato ${bajas.CONTRATO_CMODIF} solicita la <strong>modificación de 
                                        ${bajas.TIPOMOD_CMODIF}</strong> de su contrato por motivo de ${bajas.MOTCAMBIO_CMODIF}, el cual queda 
                                        realizado y amparado en este acuse los cambios se presentaran de manera inmediata en el sistema, si 
                                        requiere alguna modificación en su(s) contratos debera asistir a al pozo de agua y dirigirse con el 
                                        presidente o el secretario segun sea el tramite a solicitar.
                                    </div>
                                </td>
                            </tr>
                        `;
                        titularBaja=`
                            <tr>
                                <td colspan="3"></td>
                                <td colspan="6" style="border-top: 1px solid rgb(20,179,237); padding-bottom:100px;">
                                    <div style="text-align:center; font-size:14px;">${bajas.CLIENTE}</div>
                                    <div style="text-align:center; font-size:12px;">Usuario/a</div>
                                </td>
                                <td colspan="3"></td>
                            </tr>
                        `;
                        
                    })
                    respuestas[1].forEach(comite => {
                        const columnaComiteA = document.createElement('td');
                        columnaComiteA.setAttribute('colspan','1');
                        comiteParti.appendChild(columnaComiteA);
                        const columnaDatos = document.createElement('td');
                        columnaDatos.setAttribute('colspan','4');
                        columnaDatos.setAttribute('style','border-top: 1px solid rgb(20,179,237); padding-bottom:100px;');
                        columnaDatos.innerHTML=`
                            <div style="text-align:center; font-size:14px;">${comite.NOMBRE}</div>
                            <div style="text-align:center; font-size:12px;">${comite.DESCRIPHOM_PUESTO}</div>
                        `;
                        comiteParti.appendChild(columnaDatos);
                        const columnaComiteB = document.createElement('td');
                        columnaComiteB.setAttribute('colspan','1');
                        comiteParti.appendChild(columnaComiteB);
                    })
                    tablaAcuseBaja.innerHTML=`
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
                            <td colspan="1" style="border: none;"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:100px; height:100px; margin: auto;"/></td>
                            <td colspan="11" style="text-align: center; border: none;">
                                <div style="text-align: right; padding:10px 10px 0px; font-size: 14px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                                <div style="text-align: right; padding:0px 10px; font-size: 12px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                            </td>
                        </tr>
                        ${mensajeBaja}
                        <tr>
                            <td colspan="12">
                                <div style="text-align: left; padding:10px;">El presente documento da fe y legalidad de la reactivación efectuada.</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding-bottom:50px;">
                                <div style="text-align: center; padding:50px; font-weight:bolder;">EN ACUERDO:</div>
                            </td>
                        </tr>
                        ${comiteParti.outerHTML}
                        ${titularBaja}
                    `;
                    acuseReciboModificado.appendChild(tablaAcuseBaja);
                    let ventImpri = window.open('', 'popimpr');
                    ventImpri.document.write(acuseReciboModificado.innerHTML);
                    ventImpri.document.close();
                    ventImpri.print();
                    ventImpri.close();
                
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

function validarMotivo(){
    let inputForm = document.querySelector("#textMotivo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Motivo es requerido',
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
