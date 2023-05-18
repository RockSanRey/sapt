let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try{
        let busquedaReactivaciones = document.querySelector('#busquedaReactivaciones');
        busquedaReactivaciones.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Buscar contratos que tiene bajas temporales</li>
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
                    buscarBajasContratos(textIdContrato);
                }
            }else if(e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57){
                completarBusquedaBajas(textContrato);
            }
        })
        let butonBuscarContrato = document.querySelector('#butonBuscarContrato');
        butonBuscarContrato.addEventListener('click', () => {
            if(validarContrato()){
                buscarBajasContratos(textIdContrato);
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

const completarBusquedaBajas = async (textContrato) => {
    try{
        let userListComplete = document.querySelector('#userListComplete');
        let textIdContrato = document.querySelector('#textIdContrato');
        userListComplete.innerHTML='';
        if(textContrato.value=='' || textContrato.value==null){
            userListComplete.innerHTML='';
        }else{
            let idBusqueda = textContrato.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`areimreactiv/autoCompletarReactivados/${idBusqueda}`)
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
                        listadoItemUl.innerHTML= '<small><strong>'+usuario.CONTRATO_CBAJA+'</strong></small>'+' '+usuario.CLIENTE;                        listadoItemUl.addEventListener('click', () => {
                            textIdContrato.value=usuario.IDCONTRATO;
                            textContrato.value = usuario.CONTRATO_CBAJA+' - '+usuario.CLIENTE;
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

const buscarBajasContratos = async (textIdContrato) => {
    try {
        let idBusqueda = textIdContrato.value;
        let busquedaReactivaciones = document.querySelector('#busquedaReactivaciones');
        let datosReactivacionesDetalle = document.querySelector('#datosReactivacionesDetalle');
        datosReactivacionesDetalle.innerHTML=cargaAnimacion;
        fetch(`areimreactiv/mostrarReactivosContratos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            busquedaReactivaciones.innerHTML=`
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Hacer clic en el boton <span class="btn-info btn-sm"><i class="fa fa-edit"></i></span> para editar la reactivación.</li>
                    </ol>
                </div>
            `;
            const botonResetear = document.createElement('button');
            botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
            botonResetear.innerHTML='Buscar otra Baja';
            botonResetear.addEventListener('click', () => {
                datosReactivacionesDetalle.innerHTML='';
                datosReactivacionesDetalle.classList.remove('tabla-contenedor');
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
                datosReactivacionesDetalle.classList.add('tabla-contenedor');
                respuestas.forEach(bajas => {
                    const filaTablaBajasContratos = document.createElement('tr');
                    const columnaDetallesContratos = document.createElement('td');
                    columnaDetallesContratos.innerHTML=`
                        <div class="row fuente-12p">
                            <div class="col-md-10 col-12"><small>Folio Baja:</small> ${bajas.FOLIO_CBAJA}
                                <br/><small>Usuario:</small> ${bajas.NOMBRE}, <small>Contrato:</small> ${bajas.CONTRATO_CBAJA}
                            </div>
                        </div>
                    `;
                    filaTablaBajasContratos.appendChild(columnaDetallesContratos);
                    const columnaAcciones = document.createElement('td');
                    const botonImprimirReactiva = document.createElement('button');
                    botonImprimirReactiva.classList.add('btn','btn-success','btn-sm');
                    botonImprimirReactiva.setAttribute('dataimprimir',bajas.idTablePk);
                    botonImprimirReactiva.setAttribute('id','botonImprimirSel');
                    botonImprimirReactiva.innerHTML = '<i class="fa fa-print"></i>';
                    botonImprimirReactiva.addEventListener('click',() => {
                        imprimirReactivacion(botonImprimirReactiva);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonImprimirReactiva);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaBajasContratos.appendChild(columnaAcciones);
                    cuerpoTablaBajasContratos.appendChild(filaTablaBajasContratos);

                })
                tablaBajasContratos.appendChild(cuerpoTablaBajasContratos);
            }
            datosReactivacionesDetalle.innerHTML='';
            datosReactivacionesDetalle.appendChild(tablaBajasContratos);
            datosReactivacionesDetalle.appendChild(botonResetear);
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

const imprimirReactivacion = async (botonImprimirReactiva) => {
    try {
        let idBusqueda = botonImprimirReactiva.attributes.dataimprimir.value;
        let datosAcuseRecibo = document.querySelector('#datosAcuseRecibo');
        datosAcuseRecibo.innerHTML=`
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
        fetch(`areportes/imprimirAcuseReactiva/${idBusqueda}`)
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
                let fechaSplit = bajas.FREAC_CBAJA.split('-');
                let contador = parseInt(fechaSplit[1]-1)
                let mesesArray = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                let mesMuestra = '';
                for(let mes=contador; mes <= contador; mes++){
                    mesMuestra=mesesArray[mes];
                }
                mensajeBaja=`
                <tr>
                    <td colspan="12">
                        <div style="text-align: right; padding:10px; font-weight:bolder;">ASUNTO: REACTIVACIÓN DE CONTRATO</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">
                        <div style="text-align: right; padding:10px; font-weight:bolder;">FOLIO: ${bajas.FOLIO_CBAJA}</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">
                        <div style="text-align: left; padding:10px; font-weight:bolder;">Contrato: ${bajas.CONTRATO_CBAJA}</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="12">
                        <div style="text-align: justify; padding:10px;">
                            Por medio del presente documento queda escrito que el día ${fechaSplit[2]} de ${mesMuestra} de 
                            ${fechaSplit[0]} en las instalaciones del pozo de agua potable de Teltipan de Juárez  del C. 
                            ${bajas.NOMBRE} con numero de contrato ${bajas.CONTRATO_CBAJA} solicita la <strong>Reactivación</strong> 
                            de su contrato por motivo de ${bajas.MOTIVREAC_CBAJA}, manifiesta que a esta fecha iniciara la generación 
                            de cargos y uso del servicio así como las posibles multas o sanciones si llega a incumplir sus pagos o faltas.
                        </div>
                    </td>
                </tr>
            `;
                titularBaja=`
                <tr>
                    <td colspan="3"></td>
                    <td colspan="6" style="border-top: 1px solid rgb(20,179,237); padding-bottom:100px;">
                        <div style="text-align:center; font-size:14px;">${bajas.NOMBRE}</div>
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
                        <div style="text-align: left; padding:10px;">El presente documento da fe y legalidad de la modificación de contrato efectuada.</div>
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
            datosAcuseRecibo.appendChild(tablaAcuseBaja);

            let ventImpri = window.open('', 'popimpr');
            ventImpri.document.write(datosAcuseRecibo.innerHTML);
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
