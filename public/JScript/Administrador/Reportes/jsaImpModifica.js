let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda()
})

const plantillaBusqueda = async () => {
    try{
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        busquedaUsuarios.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de usuario para ver el contrato que necesita reimprimir.</li>
                </ol>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control form-control-sm" name="textUsuario" id="textUsuario" placeholder="Buscar Usuario" autocomplete="off" autofocus/>
                <input type="hidden" name="textContratoMod" id="textContratoMod" value="" />
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textUsuario = document.querySelector('#textUsuario');
        let textContratoMod = document.querySelector('#textContratoMod');
        let userListComplete = document.querySelector('#userListComplete');
        textUsuario.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(textUsuario.value.length > 4){
                completarBusquedaUsuarios(textUsuario);
            }
        })
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        butonBuscarUsuario.addEventListener('click', () => {
            buscarContratosActivos(textContratoMod);
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
        let textContratoMod = document.querySelector('#textContratoMod');
        userListComplete.innerHTML='';
        if(textUsuario.value=='' || textUsuario.value==null){
            userListComplete.innerHTML='';
        }else{
            let idBusqueda = textUsuario.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`impmodifica/autocompletarContratoMod/${idBusqueda}`)
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
                        listadoItemUl.innerHTML= usuario.CONTRATO_CMODIF+' '+usuario.CLIENTE;
                        listadoItemUl.addEventListener('click', () => {
                            textContratoMod.value=usuario.CONTRATO_CMODIF;
                            textUsuario.value = usuario.CLIENTE;
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

const buscarContratosActivos = async  (textContratoMod) => {
    try{
        let idBusqueda = textContratoMod.value;
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        let listaContratosModificados = document.querySelector('#listaContratosModificados');
        listaContratosModificados.innerHTML=cargaAnimacion;
        fetch(`impmodifica/contratosModificadosLista/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            busquedaUsuarios.innerHTML=`
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Hacer clic en el boton <span class="btn-success btn-sm"><i class="fa fa-print"></i></span> para imprimir el acuse de la modificacion del contrato.</li>
                    </ol>
                </div>
            `;
            const botonResetear = document.createElement('button');
            botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
            botonResetear.innerHTML='Modificar Otro Usuario';
            botonResetear.addEventListener('click', () => {
                listaContratosModificados.innerHTML='';
                listaContratosModificados.classList.remove('tabla-contenedor');
                plantillaBusqueda();
            })
            const tablaDetallesContratos = document.createElement('table');
            tablaDetallesContratos.classList.add('table','table-sm','table-hover','table-bordered','fuente-12p');
            tablaDetallesContratos.innerHTML=`
                <thead>
                    <th class="col">Detalles</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaDetallesUsuario = document.createElement('tbody');
            if(respuestas.estatus=='error'){
                cuerpoTablaDetallesUsuario.innerHTML=`
                    <td colspan="2">${respuestas.text}</td>
                `;
            }else{
                listaContratosModificados.classList.add('tabla-contenedor');
                respuestas.forEach(usuarios => {
                    const filaTablaDetallesContratos = document.createElement('tr');
                    const columnaDetallesContratos = document.createElement('td');
                    columnaDetallesContratos.innerHTML=`
                        <div class="row">
                            <div class="col-md-3 col-12"><small>Contrato:</small> ${usuarios.CONTRATO_CMODIF}</div>
                            <div class="col-md-3 col-12"><small>Cliente:</small> ${usuarios.CLIENTE}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-10 col-12"> 
                                <small>Folio:</small> ${usuarios.FOLIO_CMODIF} | <small>Modificado por:</small> ${usuarios.TIPOMOD_CMODIF} | 
                            </div>
                        </div>
                    `;
                    filaTablaDetallesContratos.appendChild(columnaDetallesContratos);
                    const columnaAcciones = document.createElement('td');
                    const botonExportContrato = document.createElement('button');
                    botonExportContrato.classList.add('btn','btn-danger','btn-sm');
                    botonExportContrato.setAttribute('dataexport',usuarios.idTablePk);
                    botonExportContrato.setAttribute('id','botonExportSel');
                    botonExportContrato.innerHTML = '<i class="fa fa-file-pdf"></i>';
                    botonExportContrato.addEventListener('click',() => {
                        exportarContrato(botonExportContrato);
                    });
                    const botonImprimContrato = document.createElement('button');
                    botonImprimContrato.classList.add('btn','btn-success','btn-sm');
                    botonImprimContrato.setAttribute('dataimprimir',usuarios.idTablePk);
                    botonImprimContrato.setAttribute('id','botonImprimSel');
                    botonImprimContrato.innerHTML='<i class="fa fa-print"></i>';
                    botonImprimContrato.addEventListener('click',() => {
                        reimprimirContrato(botonImprimContrato);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonExportContrato);
                    grupoAcciones.appendChild(botonImprimContrato);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaDetallesContratos.appendChild(columnaAcciones);
                    cuerpoTablaDetallesUsuario.appendChild(filaTablaDetallesContratos);

                })
                tablaDetallesContratos.appendChild(cuerpoTablaDetallesUsuario);

            }
            listaContratosModificados.innerHTML='';
            listaContratosModificados.appendChild(tablaDetallesContratos);
            listaContratosModificados.appendChild(botonResetear);
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

const reimprimirContrato = async (botonImprimContrato) => {
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
                let idBusqueda = botonImprimContrato.attributes.dataimprimir.value;
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
