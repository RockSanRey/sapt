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
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textUsuario = document.querySelector('#textUsuario');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        let userListComplete = document.querySelector('#userListComplete');
        textUsuario.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                buscarContratosActivos(textIdUsuario);
            }else if(e.keyCode >= 64 && e.keyCode <= 90){
                completarBusquedaUsuarios(textUsuario);
            }
        })
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        butonBuscarUsuario.addEventListener('click', () => {
            buscarContratosActivos(textIdUsuario);
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

const buscarContratosActivos = async  (textIdUsuario) => {
    try{
        let idBusqueda = textIdUsuario.value;
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        let datosContatosActivos = document.querySelector('#datosContatosActivos');
        datosContatosActivos.innerHTML=cargaAnimacion;
        fetch(`aimpcontrato/mostrarContratosActivos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            busquedaUsuarios.innerHTML=`
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Hacer clic en el boton <span class="btn-success btn-sm"><i class="fa fa-print"></i></span> para imprimir el contrato.</li>
                    </ol>
                </div>
            `;
            const botonResetear = document.createElement('button');
            botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
            botonResetear.innerHTML='Modificar Otro Usuario';
            botonResetear.addEventListener('click', () => {
                datosContatosActivos.innerHTML='';
                datosContatosActivos.classList.remove('tabla-contenedor');
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
                datosContatosActivos.classList.add('tabla-contenedor');
                respuestas.forEach(usuarios => {
                    const filaTablaDetallesContratos = document.createElement('tr');
                    const columnaDetallesContratos = document.createElement('td');
                    columnaDetallesContratos.innerHTML=`
                        <div class="row fuente-12p">
                            <div class="col-md-10 col-12"><small>Usuario:</small> ${usuarios.NOMBRE}
                                <br/><small>Direccion:</small> ${usuarios.CALLES}, <small>Referencia:</small> ${usuarios.REFERENCIA_UBIC}
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
            datosContatosActivos.innerHTML='';
            datosContatosActivos.appendChild(tablaDetallesContratos);
            datosContatosActivos.appendChild(botonResetear);
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

const exportarContrato = async (botonExportContrato) => {
    try{
        Swal.fire({
            title: 'Exportar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, exportar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea exportar los datos este contrato?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonExportContrato.attributes.dataexport.value;
                botonExportContrato.innerHTML = cargaAnimacion;
                const docImprimir = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'letter',
                    compress: true
                });
                fetch(`areportes/imprimirContrato/${idBusqueda}`)
                .then(respuestaRender => respuestaRender.json())
                .then(respuestas => {
                    botonExportContrato.innerHTML = '<i class="fa fa-file-pdf"></i>';
                    let nombreArchivo = '';
                    let logoSistema = new Image();
                    logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
                    let fechaHoy = new Date();
                    let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
                    //let base64Image = document.querySelector('#codigo_qr').attributes.src.value;
                    docImprimir.addImage(logoSistema, 'png', 12,12, 20,20);
                    docImprimir.setDrawColor(20,179,237);
                    docImprimir.rect(10, 10, 195, 24);
                    docImprimir.rect(10, 10, 25, 24);
                    docImprimir.rect(150, 10, 55, 6);
                    docImprimir.rect(150, 16, 55, 6);
                    docImprimir.rect(150, 22, 55, 6);
                    docImprimir.rect(150, 28, 55, 6);
                    docImprimir.rect(10, 37, 195, 24);
                    docImprimir.rect(10, 37, 100, 6);
                    docImprimir.rect(110, 37, 50, 6);
                    docImprimir.rect(160, 37, 45, 6);
                    docImprimir.rect(10, 43, 90, 6);
                    docImprimir.rect(100, 43, 63, 6);
                    docImprimir.rect(163, 43, 42, 6);
                    docImprimir.rect(10, 49, 105, 6);
                    docImprimir.rect(115, 49, 90, 6);
                    docImprimir.rect(10, 55, 80, 6);
                    docImprimir.rect(90, 55, 40, 6);
                    docImprimir.rect(130, 55, 35, 6);
                    docImprimir.rect(165, 55, 40, 6);
                    docImprimir.line(30, 219, 100, 219);
                    docImprimir.line(130, 219, 190, 219);
                    docImprimir.setFontSize(10);
                    docImprimir.text('SISTEMA DE AGUA POTABLE',95,15, 'center');
                    docImprimir.text('COMITE DE ADMINISTRACION DE AGUA POTABLE',95,20, 'center');
                    docImprimir.setFontSize(8);
                    docImprimir.text('CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ',95,24, 'center');
                    docImprimir.text('MUNICIPIO DE TLAXCOAPAN, HIDALGO',95,28, 'center');
                    docImprimir.setFontSize(6);
                    docImprimir.text('Contrato:',151,12, 'left');
                    docImprimir.text('Fecha:',151,18, 'left');
                    docImprimir.text('Hora:',151,24, 'left');
                    docImprimir.text('Impresión:',151,30, 'left');
                    docImprimir.text('Cliente:',11,39, 'left');
                    docImprimir.text('Tipo Contrato:',111,39, 'left');
                    docImprimir.text('Id Usuario:',161,39, 'left');
                    docImprimir.text('Calle y Numero:',11,46, 'left');
                    docImprimir.text('Colonia:',101,46, 'left');
                    docImprimir.text('Cod. Postal:',164,46, 'left');
                    docImprimir.text('Municipio:',11,51, 'left');
                    docImprimir.text('Estado:',116,51, 'left');
                    docImprimir.text('Telefono(s):',11,57, 'left');
                    docImprimir.text('Impedimento:',91,57, 'left');
                    docImprimir.text('Permiso:',131,57, 'left');
                    docImprimir.text('Tarifa:',166,57, 'left');
                    docImprimir.setFontSize(10);
                    docImprimir.text('CONDICIONES: Este contrato queda sujeto a las condiciones que se estipulan en las siguientes clausulas:',12,68, 'left');
                    docImprimir.text('1. Toda persona que desee conectarse a la red de agua potable, debera solicitarla por escrito al comité de administracion para su analisis y la factibilidad de su autorizacion.',12,73, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('2. Una vez autorizada la peticion, el interesado se obliga a tener listo el registro con las caracteristicas establecidas para tal fin y cubrir la cuota vigente por concepto de contrato.',12,82, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('3. Los dias de cobro por el consumo de agua potable, seran los dias domingo en un horario de 8:00 a 11:00 Hrs.',12,91, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('4. El usuario debera pagar la cuota mensual vigente por el servicio de agua potable, misma que en asamblea general de vecinos determine de acuerdo a las necesidades imperantes.',12,96, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('5. Todo padre o madre de familia tiene la obligacion de pagar oportunamente la cuota mensual correspondiente por el servicio de agua potable.',12,104, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('6. En caso de que el equipo de bombeo se encuentre en malas condiciones, es obligacion de los usuarios aportar una cuota extra, cuyo monto sera calculado de acuerdo al gasto principal realizado.',12,112, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('7. Todo usuario que se atrase en el pago mensual, se vera obligado a pagar como sancion el equivalente a un dia de salario minimo.',12,120, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('8. Todo usuario que por diversos motivos se les haya cortado el servicio de agua potable, para su reconexion debera pagar el equivalente a cuatro dias de salario minimo.',12,128, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('9. Si la red interna del usuario se encuentra en malas condiciones propiciando fugas y/o tiraderos de agua, ademas de repararla por su propia cuenta sera sancionado con el equivalente a dos dias de salario minimo.',12,136, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('10. Todo usuario que se le haya cortado el servicio de agua potable y que se le demuestre que por propia cuenta reconecto el servicio, se le cortara el servico y no podra reconectarse hasta pagar la sancion equivalente a siete dias de salario minimo.',12,144, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('11. Todo usuario que reincida en cualquiera de los casos anteriores, su sancion subira al doble y por tercera reincidencia, la sancion se triplicara.',12,155, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('12. Todo usuario que no se presente a las asambleas que el comité de administracion convoque, sera sancionado con la cuota vigente para tal caso; por segunda falta la sancion sera el doble y por tercera inasistencia corte del servicio y no se podra reconectar hasta haber',12,163, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('13. Todo usuario que proporcione servicio de agua a personas que tengan adeudos rezagados, el servicio cortado o personas que no hayan hecho su contrato, se les hara un llamado y si hacen caso omiso, se les cortara el servicio aunque esten al corriente en sus pagos.',12,175, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('EL PRESIDENTE DEL COMITÉ DE ADMINISTRACION DEL SISTEMA DE AGUA POTABLE',60,191, {align: 'center', maxWidth: 90, lineHeightFactor: 1.0});
                    docImprimir.text('EL USUARIO',160,191, {align: 'center', maxWidth: 50, lineHeightFactor: 1.0});
                    docImprimir.text('Nombre y Firma',60,222, 'center');
                    docImprimir.text('Nombre y Firma',160,222, 'center');

                    docImprimir.rect(10, 64, 195, 165);
                    respuestas[0].forEach(contrato => {
                        let permisoLabel = '';
                        let descuentoLabel = '';
                        docImprimir.setFontSize(12);
                        docImprimir.text(contrato.CONTRATO_CCONT,203,15, 'right');
                        docImprimir.text(contrato.FECHACAP_CCONT,203,21, 'right');
                        docImprimir.text(contrato.HORACAP_CCONT,203,27, 'right');
                        docImprimir.text(fechaImpress,203,33, 'right');
                        docImprimir.text(contrato.NOMBRE,160,218, 'center');
                        docImprimir.setFontSize(11);
                        docImprimir.text(contrato.NOMBRE,19,42, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CONT,131,42, 'left');
                        docImprimir.text(contrato.CODBARR_CLIEN,203,42, 'right');
                        docImprimir.text(contrato.CALLES,26,48, 'left');
                        docImprimir.text(contrato.COLONIA_COLON,109,48, 'left');
                        docImprimir.text(contrato.CODIPOST_CODPOS,176,48, 'left');
                        docImprimir.text(contrato.NOMBRE_MUNIC,21,54, 'left');
                        docImprimir.text(contrato.NOMBRE_ESTA,123,54, 'left');
                        docImprimir.text(contrato.TELEFONO_CLIEN+' '+contrato.MOVIL_CLIEN,16,60, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CPERM,140,60, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CTARI,172,60, 'left');
                        JsBarcode('#codigo_qr', contrato.CODBARR_CLIEN, {
                            displayValue: false,
                            format: 'CODE128',
                            width: 1,
                        });
                        let codigo_qr = document.querySelector('img#codigo_qr');
                        docImprimir.addImage(codigo_qr.src, 'jpeg', 165,230, 40,8);

                        nombreArchivo = contrato.CONTRATO_CCONT;

                    })
                    respuestas[1].forEach(comite => {
                        docImprimir.text(comite.NOMBRE,60,218, 'center');
                    })
                    let alturasello = 235
                    docImprimir.setFontSize(6);
                    docImprimir.text('Cadena Original',10,235, 'left');
                    docImprimir.text('Sello Digital',10,243, 'left');
                    respuestas[2].forEach(sello => {
                        docImprimir.text(sello.SELLODIGA,30,alturasello, {align: 'left', maxWidth: 125, lineHeightFactor: 1.0});
                        alturasello=alturasello+8
                    })
                    docImprimir.save('Contrato '+nombreArchivo+'.pdf');
                });

            }
        });

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
                let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
                datosContratoDetalle.innerHTML=`
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
                botonImprimContrato.innerHTML = cargaAnimacion;
                let fechaHoy = new Date();
                let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
                let cabeceraContrato = '';
                let detalleContrato = '';
                let comiteTramite = '';
                let usuarioTramite = '';
                let sellosDigital = '';
                let codigoBarra = '';
                fetch(`areportes/imprimirContrato/${idBusqueda}`)
                .then(respuestaRender => respuestaRender.json())
                .then(respuestas => {
                    botonImprimContrato.innerHTML = '<i class="fa fa-print"></i>';
                    respuestas[0].forEach(contrato => {
                        usuarioTramite=contrato.NOMBRE;
                        cabeceraContrato=`
                            <tr>
                                <td rowspan="4" colspan="1" style="border: 1px solid rgb(20,179,237);"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:80px; height:80px; margin: auto;"/></td>
                                <td rowspan="4" colspan="9" style="text-align: center; border: 1px solid rgb(20,179,237);">
                                    <div style="text-align: center; font-size: 14px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                                    <div style="text-align: center; font-size: 10px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                                </td>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237);">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Contrato:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${contrato.CONTRATO_CCONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${contrato.FECHACAP_CCONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Hora:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${contrato.HORACAP_CCONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha Impresión:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${fechaImpress}</div>
                                </td>
                            </tr>
                        
                        `;
                        detalleContrato=`
                            <tr>
                                <td colspan="6" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Cliente:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.NOMBRE}</div>
                                </td>
                                <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Tipo Contrato:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.DESCRIPCION_CONT}</div>
                                </td>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Id Usuario:</div>
                                    <div style="text-align: right; font-size:14px;">${contrato.CODBARR_CLIEN}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Calle y Numero:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.CALLES}</div>
                                </td>
                                <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Colonia:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.COLONIA_COLON}</div>
                                </td>
                                <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Cod. Postal:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.CODIPOST_CODPOS}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Telefono(s):</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.TELEFONO_CLIEN} - ${contrato.MOVIL_CLIEN}</div>
                                </td>
                                <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Impedimento:</div>
                                    <div style="text-align: center; font-size:14px;">-</div>
                                </td>
                                <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Permiso:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.DESCRIPCION_CPERM}</div>
                                </td>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Tarifa:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.DESCRIPCION_CTARI}</div>
                                </td>
                            </tr>
                        `;
                        codigoBarra = contrato.CODBARR_CLIEN;
                    })
                    respuestas[1].forEach(comite => {
                        comiteTramite = comite.NOMBRE;
                    })
                    respuestas[2].forEach(sello => {
                        sellosDigital+=`<div style="max-width:430px;word-wrap:break-word;padding-botton:10px;">${sello.SELLODIGA}</div>`;
                    })
                    const tablaAcuseContrato = document.createElement('table');
                    tablaAcuseContrato.setAttribute('border','0');
                    tablaAcuseContrato.setAttribute('cellspacing','0');
                    tablaAcuseContrato.setAttribute('cellpadding','0');
                    tablaAcuseContrato.setAttribute('style','width: 100%; font-family: Montserrat;');
                    tablaAcuseContrato.innerHTML=`
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
                        ${cabeceraContrato}
                        <tr>
                            <td colspan="12" style="padding:5px;"></td>
                        </tr>
                        ${detalleContrato}
                        <tr>
                            <td colspan="12" style="padding:5px;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:5px; border-top: 1px solid rgb(20,179,237); border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                                <div style="text-align:justify; font-size:14px;">CONDICIONES: Este contrato queda sujeto a las condiciones que se estipulan en las siguientes clausulas:</div>
                                <ol style="width:100%;max-width:750px;padding-left:25px;padding-right:25px;font-size:14px;">
                                    <li style="text-aling:justify;max-width:730px;">Toda persona que desee conectarse a la red de agua potable, debera solicitarla por escrito al comité de administracion para su analisis y la factibilidad de su autorizacion.</li>
                                    <li style="text-aling:justify;max-width:730px;">Una vez autorizada la peticion, el interesado se obliga a tener listo el registro con las caracteristicas establecidas para tal fin y cubrir la cuota vigente por concepto de contrato.</li>
                                    <li style="text-aling:justify;max-width:730px;">Los dias de cobro por el consumo de agua potable, seran los dias domingo en un horario de 8:00 a 11:00 Hrs.</li>
                                    <li style="text-aling:justify;max-width:730px;">El usuario debera pagar la cuota mensual vigente por el servicio de agua potable, misma que en asamblea general de vecinos determine de acuerdo a las necesidades imperantes.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo padre o madre de familia tiene la obligacion de pagar oportunamente la cuota mensual correspondiente por el servicio de agua potable.</li>
                                    <li style="text-aling:justify;max-width:730px;">En caso de que el equipo de bombeo se encuentre en malas condiciones, es obligacion de los usuarios aportar una cuota extra, cuyo monto sera calculado de acuerdo al gasto principal realizado.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que se atrase en el pago mensual, se vera obligado a pagar como sancion el equivalente a un dia de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que por diversos motivos se les haya cortado el servicio de agua potable, para su reconexion debera pagar el equivalente a cuatro dias de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Si la red interna del usuario se encuentra en malas condiciones propiciando fugas y/o tiraderos de agua, ademas de repararla por su propia cuenta sera sancionado con el equivalente a dos dias de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que se le haya cortado el servicio de agua potable y que se le demuestre que por propia cuenta reconecto el servicio, se le cortara el servico y no podra reconectarse hasta pagar la sancion equivalente a siete dias de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que reincida en cualquiera de los casos anteriores, su sancion subira al doble y por tercera reincidencia, la sancion se triplicara.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que no se presente a las asambleas que el comité de administracion convoque, sera sancionado con la cuota vigente para tal caso; por segunda falta la sancion sera el doble y por tercera inasistencia corte del servicio y no se podra reconectar hasta haber.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que proporcione servicio de agua a personas que tengan adeudos rezagados, el servicio cortado o personas que no hayan hecho su contrato, se les hara un llamado y si hacen caso omiso, se les cortara el servicio aunque esten al corriente en sus pagos.</li>
                                </ol>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">EL PRESIDENTE DEL COMITÉ DE ADMINISTRACION DEL SISTEMA DE AGUA POTABLE</td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">EL USUARIO</td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="padding:30px;"></td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="padding:30px;"></td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="text-align: center;border-bottom: 1px solid rgb(20,179,237);">${comiteTramite}</td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="text-align: center;border-bottom: 1px solid rgb(20,179,237);">${usuarioTramite}</td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">Nombre y firma</td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">Nombre y firma</td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="border-left: 1px solid rgb(20,179,237);border-right: 1px solid rgb(20,179,237);border-bottom: 1px solid rgb(20,179,237); padding:10px;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:10px;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:8px;"><div style="margin-bottom:10px;">Cadena Original</div><div style="margin-bottom:10px;">Sello digital</div></td>
                            <td colspan="8" style="font-size:8px;">${sellosDigital}</td>
                            <td colspan="3" style=""><img id="barcode"/></td>
                        </tr>
                    `;
                    datosContratoDetalle.appendChild(tablaAcuseContrato);
                    JsBarcode("#barcode", `${codigoBarra}`, {
                        format: "CODE128",
                        lineColor: "#14b3ed",
                        background: "#FFF",
                        width: 2,
                        height: 40,
                        displayValue: false
                    });
                    let ventImpri = window.open('', 'popimpr');
                    ventImpri.document.write(datosContratoDetalle.innerHTML);
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