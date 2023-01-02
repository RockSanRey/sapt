let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try {
        let busquedaContrato = document.querySelector('#busquedaContrato');
        busquedaContrato.classList.remove('d-none');
        busquedaContrato.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de contrato para ver la baja que necesita reimprimir.</li>
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
                buscarBajasContratos(textIdContrato);
            }else if(e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57){
                completarBusquedaBajas(textContrato);
            }
        })
        let butonBuscarContrato = document.querySelector('#butonBuscarContrato');
        butonBuscarContrato.addEventListener('click', () => {
            buscarBajasContratos(textIdContrato);
        })
        let datosBajasDetalle = document.querySelector('#datosBajasDetalle');
        datosBajasDetalle.classList.remove('tabla-contenedor');

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
            fetch(`areimpbajas/autoCompletarBajas/${idBusqueda}`)
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
                        listadoItemUl.innerHTML= '<small><strong>'+contrato.CONTRATO_CBAJA+'</strong></small>'+' '+contrato.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdContrato.value=contrato.IDCONTRATO;
                            textContrato.value = contrato.CONTRATO_CBAJA+' - '+contrato.NOMBRE;
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

const buscarBajasContratos = async (textIdUsuario) => {
    try {
        let idBusqueda = textIdUsuario.value;
        let busquedaContrato = document.querySelector('#busquedaContrato');
        let datosBajasDetalle = document.querySelector('#datosBajasDetalle');
        let acuseRecibo = document.querySelector('#acuseRecibo');
        datosBajasDetalle.innerHTML=cargaAnimacion;
        fetch(`areimpbajas/mostrarBajasContratos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            busquedaContrato.innerHTML=`
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Hacer clic en el boton <span class="btn-success btn-sm"><i class="fa fa-print"></i></span> para imprimir la baja.</li>
                    </ol>
                </div>
            `;
            const botonResetear = document.createElement('button');
            botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
            botonResetear.innerHTML='Buscar otra Baja';
            botonResetear.addEventListener('click', () => {
                datosBajasDetalle.innerHTML='';
                datosBajasDetalle.classList.remove('tabla-contenedor');
                acuseRecibo.innerHTML='';
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
                datosBajasDetalle.classList.add('tabla-contenedor');
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
                    const botonExportarBaja = document.createElement('button');
                    botonExportarBaja.classList.add('btn','btn-danger','btn-sm');
                    botonExportarBaja.setAttribute('dataexport',bajas.idTablePk);
                    botonExportarBaja.setAttribute('id','botonExportSel');
                    botonExportarBaja.innerHTML = '<i class="fa fa-file-pdf"></i>';
                    botonExportarBaja.addEventListener('click',() => {
                        exportarBaja(botonExportarBaja);
                    });
                    const botonImprimirBaja = document.createElement('button');
                    botonImprimirBaja.classList.add('btn','btn-success','btn-sm');
                    botonImprimirBaja.setAttribute('dataimprimir',bajas.idTablePk);
                    botonImprimirBaja.setAttribute('id','botonImprimirSel');
                    botonImprimirBaja.innerHTML = '<i class="fa fa-print"></i>';
                    botonImprimirBaja.addEventListener('click',() => {
                        reimprimirBaja(botonImprimirBaja);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonExportarBaja);
                    grupoAcciones.appendChild(botonImprimirBaja);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaBajasContratos.appendChild(columnaAcciones);
                    cuerpoTablaBajasContratos.appendChild(filaTablaBajasContratos);

                })
                tablaBajasContratos.appendChild(cuerpoTablaBajasContratos);
            }
            datosBajasDetalle.innerHTML='';
            datosBajasDetalle.appendChild(tablaBajasContratos);
            datosBajasDetalle.appendChild(botonResetear);
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

const exportarBaja = async (botonExportarBaja) => {
    try {
        let idBusqueda = botonExportarBaja.attributes.dataexport.value;

        const docImprimir = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'letter',
            compress: true
        });

        fetch(`areportes/imprimirAcuseBaja/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            let logoSistema = new Image();
            logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
            let mesesArray = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
            let fechaHoy = new Date();
            let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
            let nombreArchivo = '';
            docImprimir.addImage(logoSistema, 'png', 12,12, 30,30);
            docImprimir.setFontSize(10);
            docImprimir.text('COMITE DE SISTEMA DE AGUA POTABLE DE TELTIPAN',200,25, 'right');
            docImprimir.setFontSize(8);
            docImprimir.text('CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO',200,29, 'right');
            docImprimir.setFontType('bold');

            respuestas[0].forEach(bajas => {
                let fechaSplit = bajas.FBAJA_CBAJA.split('-');
                let contador = parseInt(fechaSplit[1]-1)
                let mesMuestra = '';
                for(let mes=contador; mes <= contador; mes++){
                    mesMuestra=mesesArray[mes];
                }
                if(bajas.ESTATUS_CCONT=='INAC'){
                    docImprimir.setFontSize(12);
                    docImprimir.text('ASUNTO: BAJA TEMPORAL DE CONTRATO',200,40, 'right');
                    docImprimir.setFontSize(12);
                    docImprimir.setFontType('normal');
                    docImprimir.text('Por medio del presente documento queda escrito que el día '+fechaSplit[2]+' de '+mesMuestra+' de '+fechaSplit[0]+' en las instalaciones del pozo '+
                    'de agua potable de Teltipan de Juárez  el C. '+bajas.NOMBRE+' con numero de contrato '+bajas.CONTRATO_CBAJA+' solicita la Baja Temporal de su contrato por motivo '+
                    'de '+bajas.OBSERVACIONES_CBAJA+', manifiesta que a esta fecha no presenta adeudos de ningún tipo en el Sistema de Agua Potable Teltipán.',25,80, {align: 'justify', maxWidth: 175, lineHeightFactor: 1.5});
                    docImprimir.setFontType('bold');
                    docImprimir.text('Nota: La baja temporal cuenta con un periodo de recesión de 12 meses a partir de su expedición, al usuario en caso de'+
                    ' no presentarse a su reactivación se asigna en automática su alta en el sistema.',25,115, {align: 'justify', maxWidth:175, lineHeightFactor: 1.0});
                    docImprimir.setFontType('normal');
                    docImprimir.setFontSize(12);
                    docImprimir.text('El presente documento da fe y legalidad de la Baja efectuada y cero adeudos.',25,135, 'left');

                }else if(bajas.ESTATUS_CCONT=='BAJA'){
                    docImprimir.setFontSize(12);
                    docImprimir.text('ASUNTO: BAJA DEFINITIVA DE CONTRATO',200,40, 'right');
                    docImprimir.setFontSize(12);
                    docImprimir.setFontType('normal');
                    docImprimir.text('Por medio del presente documento queda escrito que el día '+fechaSplit[2]+' de '+mesMuestra+' de '+fechaSplit[0]+' en las instalaciones del pozo '+
                    'de agua potable de Teltipan de Juárez  el C. '+bajas.NOMBRE+' con numero de contrato '+bajas.CONTRATO_CBAJA+' solicita la Baja Definitiva de su contrato por motivo '+
                    'de '+bajas.OBSERVACIONES_CBAJA+', manifiesta que a esta fecha no presenta adeudos de ningún tipo en el Sistema de Agua Potable Teltipán.',25,80, {align: 'justify', maxWidth: 175, lineHeightFactor: 1.5});
                    docImprimir.setFontType('normal');
                    docImprimir.setFontSize(12);
                    docImprimir.text('El presente documento da fe y legalidad de la Baja efectuada y cero adeudos.',25,125, 'left');

                }
                nombreArchivo=bajas.FOLIO_CBAJA;
                docImprimir.setFontType('bold');
                docImprimir.text('Folio: '+bajas.FOLIO_CBAJA, 200,50, 'right');
                docImprimir.text('Contrato: '+bajas.CONTRATO_CBAJA, 25,70, 'left');
                docImprimir.setFontType('bold');
                docImprimir.setFontSize(10);
                docImprimir.text(bajas.NOMBRE,110,233, 'center');

            })

            let rulehorizon = 60;
            respuestas[1].forEach(comite => {
                docImprimir.setFontSize(10);
                docImprimir.text(comite.NOMBRE,rulehorizon,188, 'center');
                rulehorizon = rulehorizon+95;

            })

            docImprimir.setFontType('bold');
            docImprimir.setFontSize(12);
            docImprimir.text('EN ACUERDO:',110,150, 'center');
            docImprimir.setFontSize(8);
            docImprimir.setFontType('normal');
            docImprimir.line(28, 185, 98, 185);
            docImprimir.text('Presidente del Sistema de Agua potable Teltipan.',60,192, 'center');
            docImprimir.line(120, 185, 190, 185);
            docImprimir.text('Tesorero del Sistema de Agua potable Teltipan.',155,192, 'center');
            docImprimir.line(70, 230, 150, 230);
            docImprimir.text('Usuario.',110,237, 'center');
            docImprimir.setFontSize(6);
            let espaciosello = 250;
            respuestas[2].forEach(sello => {
                docImprimir.text('Sello Digital: '+sello.SELLODIGA,15,espaciosello, {align: 'justify', maxWidth: 185, lineHeightFactor: 1.0});
                espaciosello=espaciosello+6;

            })

            docImprimir.save('Baja '+nombreArchivo+'.pdf');
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

const reimprimirBaja = async (botonImprimirBaja) => {
    try{
        let idBusqueda = botonImprimirBaja.attributes.dataimprimir.value;
        let acuseRecibo = document.querySelector('#acuseRecibo');
        acuseRecibo.innerHTML=`
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
        fetch(`areportes/imprimirAcuseBaja/${idBusqueda}`)
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
                let fechaSplit = bajas.FBAJA_CBAJA.split('-');
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
                                    ${bajas.NOMBRE} con numero de contrato ${bajas.CONTRATO_CBAJA} solicita la <strong>Baja Temporal</strong> 
                                    de su contrato por motivo de ${bajas.OBSERVACIONES_CBAJA}, manifiesta que a esta fecha no presenta 
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
                                    ${bajas.NOMBRE} con numero de contrato ${bajas.CONTRATO_CBAJA} solicita la <strong>Baja Definitiva</strong> 
                                    de su contrato por motivo de ${bajas.OBSERVACIONES_CBAJA}, manifiesta que a esta fecha no presenta 
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

            acuseRecibo.appendChild(tablaAcuseBaja);

            let ventImpri = window.open('', 'popimpr');
            ventImpri.document.write(acuseRecibo.innerHTML);
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
