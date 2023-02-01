let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try{
        let busquedaTransferencias = document.querySelector('#busquedaTransferencias');
        busquedaTransferencias.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Buscar contratos que hicieron transferencias de dominio</li>
                </ol>
            </div>
            <div class="input-group mb-3">
                <input type="hidden" name="textIdContrato" id="textIdContrato" value="" />
                <input type="text" class="form-control form-control-sm" name="textContrato" id="textContrato" placeholder="Buscar Contrato" autocomplete="off" autofocus/>
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarContrato">Buscar</button>
                </div>
            </div>
        `;
        let textContrato = document.querySelector('#textContrato');
        let textIdContrato = document.querySelector('#textIdContrato');
        let userListComplete = document.querySelector('#userListComplete');
        textContrato.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                if(validarContrato()){
                    buscarTransferenciasContratos(textIdContrato);
                }
            }else if(e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57){
                completarBusquedaTransferencias(textContrato);
            }
        })
        let butonBuscarContrato = document.querySelector('#butonBuscarContrato');
        butonBuscarContrato.addEventListener('click', () => {
            if(validarContrato()){
                buscarTransferenciasContratos(textIdContrato);
            }
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

const completarBusquedaTransferencias = async (textContrato) => {
    try{
        let userListComplete = document.querySelector('#userListComplete');
        let textIdContrato = document.querySelector('#textIdContrato');
        userListComplete.innerHTML='';
        if(textContrato.value=='' || textContrato.value==null){
            userListComplete.innerHTML='';
        }else{
            let idBusqueda = textContrato.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`areimtransfe/autoCompletarTransferencias/${idBusqueda}`)
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
                        listadoItemUl.innerHTML= '<small><strong>'+usuario.CONTRATO_TRANS+'</strong></small>'+' '+usuario.CLIENTE;                        listadoItemUl.addEventListener('click', () => {
                            textIdContrato.value=usuario.IDCONTRATO;
                            textContrato.value = usuario.CONTRATO_TRANS+' - '+usuario.CLIENTE;
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

const buscarTransferenciasContratos = async (textIdContrato) => {
    try {
        let idBusqueda = textIdContrato.value;
        let busquedaReactivaciones = document.querySelector('#busquedaTransferencias');
        let datosTransferenciasDetalle = document.querySelector('#datosTransferenciasDetalle');
        datosTransferenciasDetalle.innerHTML=cargaAnimacion;
        fetch(`areimtransfe/mostrarTransferContratos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            busquedaTransferencias.innerHTML=`
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Hacer clic en el boton <span class="btn-info btn-sm"><i class="fa fa-print"></i></span> para imprimir la transferencia.</li>
                    </ol>
                </div>
            `;
            const botonResetear = document.createElement('button');
            botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
            botonResetear.innerHTML='Buscar otra Baja';
            botonResetear.addEventListener('click', () => {
                datosTransferenciasDetalle.innerHTML='';
                datosTransferenciasDetalle.classList.remove('tabla-contenedor');
                plantillaBusqueda();
            })
            const tablaBajasContratos = document.createElement('table');
            tablaBajasContratos.classList.add('table','table-sm','table-hover','table-bordered','fuente-12p');
            tablaBajasContratos.innerHTML=`
                <thead>
                    <th class="col">Detalles</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaBajasContratos = document.createElement('tbody');
            if(respuestas.estatus=='error'){
                cuerpoTablaBajasContratos.innerHTML=`
                    <td colspan="2">${respuestas.text}</td>
                `;
            }else{
                datosTransferenciasDetalle.classList.add('tabla-contenedor');
                respuestas.forEach(transfer => {
                    const filaTablaBajasContratos = document.createElement('tr');
                    const columnaDetallesContratos = document.createElement('td');
                    columnaDetallesContratos.innerHTML=`
                        <div class="row fuente-12p">
                            <div class="col-md-10 col-12"><small>Folio Transferencia:</small> ${transfer.FOLIO_TRANS}
                                <br/><small>Usuario Nuevo:</small> ${transfer.CLIENTE}, <small>Contrato:</small> ${transfer.CONTRATO_TRANS}
                            </div>
                        </div>
                    `;
                    filaTablaBajasContratos.appendChild(columnaDetallesContratos);
                    const columnaAcciones = document.createElement('td');
                    const botonImprimirTransfer = document.createElement('button');
                    botonImprimirTransfer.classList.add('btn','btn-success','btn-sm');
                    botonImprimirTransfer.setAttribute('dataimprimir',transfer.idTablePk);
                    botonImprimirTransfer.setAttribute('id','botonImprimirSel');
                    botonImprimirTransfer.innerHTML = '<i class="fa fa-print"></i>';
                    botonImprimirTransfer.addEventListener('click',() => {
                        imprimirTransferencia(botonImprimirTransfer);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonImprimirTransfer);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaBajasContratos.appendChild(columnaAcciones);
                    cuerpoTablaBajasContratos.appendChild(filaTablaBajasContratos);

                })
                tablaBajasContratos.appendChild(cuerpoTablaBajasContratos);
            }
            datosTransferenciasDetalle.innerHTML='';
            datosTransferenciasDetalle.appendChild(tablaBajasContratos);
            datosTransferenciasDetalle.appendChild(botonResetear);
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

const imprimirTransferencia = async (botonImprimirTransfer) => {
    try {
        let idBusqueda = botonImprimirTransfer.attributes.dataimprimir.value;
        let plantillaTransferencia = document.querySelector('#plantillaTransferencia');
        plantillaTransferencia.innerHTML='';
        fetch(`areportes/imprimirReciboTransferencia/${idBusqueda}`)
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


function validarContrato(){
    let textIdContrato = document.querySelector("#textIdContrato");
    let inputForm = document.querySelector("#textContrato");
    if(textIdContrato.value==null || textIdContrato.value==''){
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

function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
