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
        let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
        datosUsuarioDetalle.classList.remove('tabla-contenedor');

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
                    const botonVerContrato = document.createElement('button');
                    botonVerContrato.classList.add('btn','btn-success','btn-sm');
                    botonVerContrato.setAttribute('dataimprimir',usuarios.idTablePk);
                    botonVerContrato.setAttribute('id','botonEditarSel');
                    botonVerContrato.innerHTML = '<i class="fa fa-print"></i>';
                    botonVerContrato.addEventListener('click',() => {
                        reimprimirContrato(botonVerContrato);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonVerContrato);
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

const reimprimirContrato = async (botonVerContrato) => {
    try{
        Swal.fire({
            title: 'Imprmimir',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, imprimir',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea imprimir los datos este usuario?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonVerContrato.attributes.dataimprimir.value;
                botonVerContrato.innerHTML = cargaAnimacion;
                const docImprimir = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'letter',
                    compress: true
                });
                fetch(`aimpcontrato/reimprimirContrato/${idBusqueda}`)
                .then(respuestaRender => respuestaRender.json())
                .then(respuestas => {
                    botonVerContrato.innerHTML = '<i class="fa fa-print"></i>';
                    let nombreArchivo = '';
                    let logoSistema = new Image();
                    logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
                    let fechaHoy = new Date();
                    let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
                    //let base64Image = document.querySelector('#codigo_qr').attributes.src.value;
                    docImprimir.addImage(logoSistema, 'png', 12,12, 30,30);
                    docImprimir.setDrawColor(20,179,237);
                    docImprimir.rect(10, 10, 195, 32);
                    docImprimir.rect(10, 10, 35, 32);
                    docImprimir.rect(155, 10, 50, 8);
                    docImprimir.rect(155, 18, 50, 8);
                    docImprimir.rect(155, 26, 50, 8);
                    docImprimir.rect(155, 34, 50, 8);
                    docImprimir.rect(10, 45, 195, 32);
                    docImprimir.rect(10, 45, 125, 8);
                    docImprimir.rect(135, 45, 70, 8);
                    docImprimir.rect(10, 53, 90, 8);
                    docImprimir.rect(100, 53, 60, 8);
                    docImprimir.rect(160, 53, 45, 8);
                    docImprimir.rect(10, 61, 105, 8);
                    docImprimir.rect(115, 61, 90, 8);
                    docImprimir.rect(95, 69, 40, 8);
                    docImprimir.rect(135, 69, 30, 8);
                    docImprimir.rect(165, 69, 40, 8);
                    docImprimir.line(30, 244, 100, 244);
                    docImprimir.line(130, 244, 190, 244);
                    docImprimir.setFontSize(12);
                    docImprimir.text('SISTEMA DE AGUA POTABLE',100,15, 'center');
                    docImprimir.text('COMITE DE ADMINISTRACION DE AGUA POTABLE',100,20, 'center');
                    docImprimir.setFontSize(10);
                    docImprimir.text('CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ',100,25, 'center');
                    docImprimir.text('MUNICIPIO DE TLAXCOAPAN, HIDALGO',100,30, 'center');
                    docImprimir.setFontSize(6);
                    docImprimir.text('Contrato:',156,12, 'left');
                    docImprimir.text('Fecha:',156,20, 'left');
                    docImprimir.text('Hora:',156,28, 'left');
                    docImprimir.text('Impresión:',156,36, 'left');
                    docImprimir.text('Cliente:',11,47, 'left');
                    docImprimir.text('Tipo Contrato:',136,47, 'left');
                    docImprimir.text('Calle y Numero:',11,55, 'left');
                    docImprimir.text('Colonia:',101,55, 'left');
                    docImprimir.text('Cod. Postal:',161,55, 'left');
                    docImprimir.text('Municipio:',11,63, 'left');
                    docImprimir.text('Estado:',116,63, 'left');
                    docImprimir.text('Telefono(s):',11,71, 'left');
                    docImprimir.text('Impedimento:',96,71, 'left');
                    docImprimir.text('Permiso:',136,71, 'left');
                    docImprimir.text('Tarifa:',166,71, 'left');
                    docImprimir.setFontSize(10);
                    docImprimir.text('CONDICIONES: Este contrato queda sujeto a las condiciones que se estipulan en las siguientes clausulas:',12,85, 'left');
                    docImprimir.text('1. Toda persona que desee conectarse a la red de agua potable, debera solicitarla por escrito al comité de administracion para su analisis y la factibilidad de su autorizacion.',12,90, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('2. Una vez autorizada la peticion, el interesado se obliga a tener listo el registro con las caracteristicas establecidas para tal fin y cubrir la cuota vigente por concepto de contrato.',12,99, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('3. Los dias de cobro por el consumo de agua potable, seran los dias domingo en un horario de 8:00 a 11:00 Hrs.',12,108, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('4. El usuario debera pagar la cuota mensual vigente por el servicio de agua potable, misma que en asamblea general de vecinos determine de acuerdo a las necesidades imperantes.',12,114, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('5. Todo padre o madre de familia tiene la obligacion de pagar oportunamente la cuota mensual correspondiente por el servicio de agua potable.',12,123, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('6. En caso de que el equipo de bombeo se encuentre en malas condiciones, es obligacion de los usuarios aportar una cuota extra, cuyo monto sera calculado de acuerdo al gasto principal realizado.',12,132, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('7. Todo usuario que se atrase en el pago mensual, se vera obligado a pagar como sancion el equivalente a un dia de salario minimo.',12,141, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('8. Todo usuario que por diversos motivos se les haya cortado el servicio de agua potable, para su reconexion debera pagar el equivalente a cuatro dias de salario minimo.',12,150, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('9. Si la red interna del usuario se encuentra en malas condiciones propiciando fugas y/o tiraderos de agua, ademas de repararla por su propia cuenta sera sancionado con el equivalente a dos dias de salario minimo.',12,160, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('10. Todo usuario que se le haya cortado el servicio de agua potable y que se le demuestre que por propia cuenta reconecto el servicio, se le cortara el servico y no podra reconectarse hasta pagar la sancion equivalente a siete dias de salario minimo.',12,169, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('11. Todo usuario que reincida en cualquiera de los casos anteriores, su sancion subira al doble y por tercera reincidencia, la sancion se triplicara.',12,181, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('12. Todo usuario que no se presente a las asambleas que el comité de administracion convoque, sera sancionado con la cuota vigente para tal caso; por segunda falta la sancion sera el doble y por tercera inasistencia corte del servicio y no se podra reconectar hasta haber',12,190, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('13. Todo usuario que proporcione servicio de agua a personas que tengan adeudos rezagados, el servicio cortado o personas que no hayan hecho su contrato, se les hara un llamado y si hacen caso omiso, se les cortara el servicio aunque esten al corriente en sus pagos.',12,203, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('EL PRESIDENTE DEL COMITÉ DE ADMINISTRACION DEL SISTEMA DE AGUA POTABLE',60,222, {align: 'center', maxWidth: 90, lineHeightFactor: 1.0});
                    docImprimir.text('EL USUARIO',160,224, {align: 'center', maxWidth: 50, lineHeightFactor: 1.0});
                    docImprimir.text('Nombre y Firma',60,248, 'center');
                    docImprimir.text('Nombre y Firma',160,248, 'center');

                    docImprimir.rect(10, 80, 195, 185);
                    respuestas.forEach(contrato => {
                        let permisoLabel = '';
                        let descuentoLabel = '';
                        if(contrato.PERMISO_CCONT=='SIPERM'){
                            permisoLabel='Si Permiso';
                        }else {
                            permisoLabel='No Permiso';
                        }
                        if(contrato.DESCUENTO_CCONT=='SINDES'){
                            descuentoLabel='T. Completa';
                        }else{
                            descuentoLabel='T. Descuento';
                        }
                        docImprimir.setFontSize(12);
                        docImprimir.text(contrato.CONTRATO_CCONT,203,17, 'right');
                        docImprimir.text(contrato.FECHACAP_CCONT,203,25, 'right');
                        docImprimir.text(contrato.HORACAP_CCONT,203,33, 'right');
                        docImprimir.text(fechaImpress,203,41, 'right');
                        docImprimir.text(contrato.NOMBRE,17,51, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CONT,143,51, 'left');
                        docImprimir.text(contrato.CALLES,17,59, 'left');
                        docImprimir.text(contrato.COLONIA_CODPOS,106,59, 'left');
                        docImprimir.text(contrato.CODIPOST_CODPOS,166,59, 'left');
                        docImprimir.text(contrato.NOMBRE_MUNIC,16,67, 'left');
                        docImprimir.text(contrato.ESTADO_ESTA,120,67, 'left');
                        docImprimir.text(contrato.TELEFONO_CLIEN+' '+contrato.MOVIL_CLIEN,16,76, 'left');
                        docImprimir.text(permisoLabel,139,76, 'left');
                        docImprimir.text(descuentoLabel,169,76, 'left');
                        JsBarcode('#codigo_qr', contrato.CODBARR_CLIEN, {
                            displayValue: false,
                            format: 'CODE128',
                            width: 1,
                        });
                        let codigo_qr = document.querySelector('img#codigo_qr');
                        docImprimir.addImage(codigo_qr.src, 'jpeg', 50,35, 50,5);

                        nombreArchivo = contrato.CONTRATO_CCONT;

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

