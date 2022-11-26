let botonGuardar = document.querySelector('#botonGuardar');
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonGuardar.addEventListener('click', () => {
        guardarBajaContrato();
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
                    <li>Escribe o escanea el número de contrato que se va a dar de baja.</li>
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
            datosContratoDetalle.innerHTML=cargaAnimacion;
            fetch(`abajcontrato/llenarTablaContratoBaja/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                busquedaContratos.innerHTML=`
                    <div class="card-text text-justify">
                        <ol class="col-12 fuente-12p" start="2">
                            <li>Haz clic en el boton <span class="btn btn-info btn-sm"><i class="fas fa-edit"></i></span> para modificar el contrato.</li>
                        </ol>
                    </div>
                `;
                const botonResetear = document.createElement('button');
                botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
                botonResetear.innerHTML='Otra Baja';
                botonResetear.addEventListener('click', () => {
                    datosContratoDetalle.innerHTML='';
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
                                <div><small>Dirección:</small> ${contrato.CALLES}</div>
                                <div class="row">
                                    <div class="col-md-3 col-6"><small>Tipo Contrato:</small> ${contrato.DESCRIPCION_CONT}</div>
                                    <div class="col-md-3 col-6"><small>Perm. Asamblea:</small> ${contrato.DESCRIPCION_CPERM}</div>
                                    <div class="col-md-3 col-6"><small>Tarifa:</small> ${contrato.DESCRIPCION_CTARI}</div>
                                    <div class="col-md-3 col-6"><small>Contratos Totales:</small> ${contrato.TOTALCONTRATO}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    filaTablaContratos.appendChild(columnaDetalles);
                    const columnaAcciones = document.createElement('td');
                    const botonEditarContrato = document.createElement('button');
                    botonEditarContrato.classList.add('btn','btn-info','btn-sm');
                    botonEditarContrato.setAttribute('dataedit',contrato.idTablePk);
                    botonEditarContrato.setAttribute('data-toggle','modal');
                    botonEditarContrato.setAttribute('data-target','#formRegistroDatos');
                    botonEditarContrato.innerHTML='<i class="fas fa-edit"></i>';
                    botonEditarContrato.addEventListener('click', () => {
                        buscarContratoModificar(botonEditarContrato);
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
                    grupoAcciones.appendChild(botonEditarContrato);
                    // grupoAcciones.appendChild(botonUsuarioExiste);
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

const buscarContratoModificar = async (botonEditarContrato) => {
    try {
        let idBusqueda = botonEditarContrato.attributes.dataedit.value;
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        return Swal.fire({
            title: 'Tramites',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, dar de Baja',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea dar de baja el contrato?',
        })
        .then((result) => {
            if(result.isConfirmed){
                formRegistroCRUD.innerHTML=cargaAnimacion;
                fetch(`abajcontrato/cargarContratoBaja/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error'){

                    }else{
                        respuestas.forEach(detalle => {
                            formRegistroCRUD.innerHTML=`
                                <div class="bg-white p-2">
                                    <ol class="col-12 fuente-12p" start="3">
                                        <li>Completar los campos segun lo solicitado en el contrato importante anotar observaciones.</li>
                                    </ol>
                                    <input type="hidden" id="textModificacion" name="textModificacion" value="${detalle.idTablePk}"/>
                                    <div class="form-group mb-2">
                                        <div class="form-control form-control-sm">${detalle.NOMBRE} | ${detalle.CONTRATO_CCONT}</div>
                                    </div>
                                    <div class="form-group mb-2">
                                        <div class="form-control form-control-sm">${detalle.CALLES}</div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>T. Contrato:</small>
                                            <div class="form-control form-control-sm">${detalle.DESCRIPCION_CONT}</div>
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Expedición:</small>
                                            <div class="form-control form-control-sm">${detalle.DESCRIPCION_CEXP}</div>
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Permiso:</small>
                                            <div class="form-control form-control-sm">${detalle.DESCRIPCION_CPERM}</div>
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Tarifa:</small>
                                            <div class="form-control form-control-sm">${detalle.DESCRIPCION_CTARI}</div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <small>Estatus:</small>
                                        <select class="custom-select custom-select-sm col-md-3 col-12" name="textEstatus" id="textEstatus"></select>
                                    </div>
                                    <div class="form-group">
                                        <small>Observaciones:</small>
                                        <textarea class="form-control form-control-sm" id="textComentarios" rows="5" name="textComentarios">${detalle.COMENTS_CCONT}</textarea>
                                    </div>
                                </div>
                            `;
                            let estatusSelec = detalle.ESTATUS_CCONT;
                            llenarComboEstatus(estatusSelec);
                        })
                    }
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

const llenarComboEstatus = async (estatusSelec) => {
    try {
        let textEstatus = document.querySelector('#textEstatus');
        fetch('catalogos/llenarComboCatEstatus')
        .then(respRender => respRender.json())
        .then(respuestas => {
            textEstatus.innerHTML='<option value="">Estatus</option>'
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstatus.appendChild(opcionSelect);
            }else {
                respuestas.forEach(estatus => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estatus.CLAVE_ESTAT);
                    opcionSelect.classList.add('fuente-12p');
                    if(estatusSelec==estatus.CLAVE_ESTAT){
                        opcionSelect.setAttribute('selected','selected');
                        opcionSelect.innerHTML=estatus.DESCRIPCION_ESTAT;
                        textEstatus.appendChild(opcionSelect);
                    }else {
                        opcionSelect.innerHTML=estatus.DESCRIPCION_ESTAT;
                        textEstatus.appendChild(opcionSelect);

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

const guardarBajaContrato = async () => {
    try {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        if(validarEstatus() && validarComentarios()){
            Swal.fire({
                title: 'Aplicar Baja',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0A8000',
                confirmButtonText: 'Si, dar de baja',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No, mejor reviso',
                html: '¿De verdad se dará de baja el contrato?',
            })
            .then((result)=>{
                if(result.isConfirmed){
                    let textModificacion = document.querySelector('#textModificacion');
                    const crearDatos = new FormData(formRegistroCRUD);
                    fetch('abajcontrato/actualizarContratoBaja', {
                        method: 'POST',
                        body: crearDatos,
                    })
                    .then(respRender => respRender.json())
                    .then(respuestas => {
                        if(respuestas.estatus=='error' || respuestas.estatus=='nosesion' || respuestas.estatus=='duplicado'){
                            return Swal.fire({
                                title: respuestas.title,
                                icon: respuestas.icon,
                                confirmButtonText: `${respuestas.button}`,
                                confirmButtonColor: '#9C0000',
                                html: respuestas.text,
                            })
                        }else{
                            botonCancelar.click();
                            return Swal.fire({
                                title: respuestas.title,
                                icon: respuestas.icon,
                                confirmButtonText: respuestas.button,
                                confirmButtonColor: '#0A8000',
                                html: respuestas.text,
                            })
                            .then((result) => {
                                if(result.isConfirmed){
                                    imprimiendoAcuse(textModificacion);
                                }
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

const imprimiendoAcuse = async (textModificacion) => {
    try{
        let idBusqueda = textModificacion.value;
        let datosRecibo = document.querySelector('#datosRecibo');
        datosRecibo.innerHTML=`
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

        fetch(`abajcontrato/acuseReciboBaja/${idBusqueda}`)
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
                let fechaSplit = bajas.FBAJA_BAJA.split('-');
                let contador = parseInt(fechaSplit[1]-1)
                let mesesArray = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                let mesMuestra = '';
                for(let mes=contador; mes <= contador; mes++){
                    mesMuestra=mesesArray[mes];
                }
                if(bajas.ESTATUS_CCONT=='INAC'){
                    mensajeBaja=`
                        <tr>
                            <td colspan="12">
                                <div style="text-align: right; padding:10px; font-weight:bolder;">ASUNTO: BAJA TEMPORAL DE CONTRATO</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12">
                                <div style="text-align: right; padding:10px; font-weight:bolder;">FOLIO: ${bajas.FOLIO_BAJA}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12">
                                <div style="text-align: left; padding:10px; font-weight:bolder;">Contrato: ${bajas.CONTRATO_BAJA}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12">
                                <div style="text-align: justify; padding:10px;">
                                    Por medio del presente documento queda escrito que el día ${fechaSplit[2]} de ${mesMuestra} de 
                                    ${fechaSplit[0]} en las instalaciones del pozo de agua potable de Teltipan de Juárez  del C. 
                                    ${bajas.NOMBRE} con numero de contrato ${bajas.CONTRATO_BAJA} solicita la <strong>Baja Temporal</strong> 
                                    de su contrato por motivo de ${bajas.OBSERVACIONES_BAJA}, manifiesta que a esta fecha no presenta 
                                    adeudos de ningún tipo en el Sistema de Agua Potable Teltipán.
                                </div>
                            </td>
                        </tr>
                    `;

                }else if(bajas.ESTATUS_CCONT=='BAJA'){
                    mensajeBaja=`
                        <tr>
                            <td colspan="12">
                                <div style="text-align: right; padding:10px; font-weight:bolder">ASUNTO: BAJA DEFINITIVA DE CONTRATO</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12">
                                <div style="text-align: right; padding:10px; font-weight:bolder;">FOLIO: ${bajas.FOLIO_BAJA}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12">
                                <div style="text-align: left; padding:10px; font-weight:bolder;">Contrato: ${bajas.CONTRATO_BAJA}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12">
                                <div style="text-align: justify; padding:10px;">
                                    Por medio del presente documento queda escrito que el día ${fechaSplit[2]} de ${mesMuestra} de 
                                    ${fechaSplit[0]} en las instalaciones del pozo de agua potable de Teltipan de Juárez  del C. 
                                    ${bajas.NOMBRE} con numero de contrato ${bajas.CONTRATO_BAJA} solicita la <strong>Baja Definitiva</strong> 
                                    de su contrato por motivo de ${bajas.OBSERVACIONES_BAJA}, manifiesta que a esta fecha no presenta 
                                    adeudos de ningún tipo en el Sistema de Agua Potable Teltipán.
                                </div>
                            </td>
                        </tr>
                    `;

                }
                titularBaja=`
                <tr>
                    <td colspan="3"></td>
                    <td colspan="6" style="border-top: 1px solid rgb(20,179,237); padding-bottom:100px;">
                        <div style="text-align:center; font-size:14px;">${bajas.NOMBRE}</div>
                        <div style="text-align:center; font-size:12px;">Usuario/a}</div>
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
                        <div style="text-align: left; padding:10px;">El presente documento da fe y legalidad de la Baja efectuada y cero adeudos.</div>
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

            datosRecibo.appendChild(tablaAcuseBaja);

            let ventImpri = window.open('', 'popimpr');
            ventImpri.document.write(datosRecibo.innerHTML);
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


function validarModificacion(){
    let inputForm = document.querySelector("#textModificacion");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Modificacion es requerido',
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

function validarEstatus(){
    let inputForm = document.querySelector("#textEstatus");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Estatus es requerido',
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
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Observaciones es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 250) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Observaciones máx 250 caracteres',
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
