let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try{
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        busquedaUsuarios.classList.remove('d-none');
        busquedaUsuarios.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de usuario para ver el comprobante de domicilio que necesita reimprimir.</li>
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
                buscarComprobantesPago(textIdUsuario);
            }else if(e.keyCode >= 64 && e.keyCode <= 90){
                completarBusquedaUsuarios(textUsuario);
            }
        })
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        butonBuscarUsuario.addEventListener('click', () => {
            buscarComprobantesPago(textIdUsuario);
        })
        let detalleDatosRecibos = document.querySelector('#detalleDatosRecibos');
        detalleDatosRecibos.classList.remove('tabla-contenedor');

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

const buscarComprobantesPago = async  (textIdUsuario) => {
    try{
        let idBusqueda = textIdUsuario.value;
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        let detalleDatosRecibos = document.querySelector('#detalleDatosRecibos');
        detalleDatosRecibos.innerHTML=cargaAnimacion;
        fetch(`areimcomdomi/buscarComprobanteDomicilio/${idBusqueda}`)
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
            botonResetear.classList.add('btn','btn-sm','btn-secondary');
            botonResetear.innerHTML='Nueva Busqueda';
            botonResetear.addEventListener('click', () => {
                plantillaBusqueda();
                detalleDatosRecibos.classList.remove('tabla-contenedor');
                detalleDatosRecibos.innerHTML='';
            })

            if(respuestas.estatus=='error'){
                detalleDatosRecibos.innerHTML='';
                plantillaBusqueda();
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#C1AF0D',
                    html: respuestas.text,
                })

            }else{
                detalleDatosRecibos.classList.add('tabla-contenedor');
                const tablaRecibosPagos = document.createElement('table');
                tablaRecibosPagos.classList.add('table','table-sm','table-hover','fuente-14p');
                tablaRecibosPagos.innerHTML=`
                    <thead>
                        <th class="col">Detalles</th>
                        <th>Acciones</th>
                    </thead>
                `;
                detalleDatosRecibos.appendChild(tablaRecibosPagos);
                const cuerpoTablaRecibosPagos = document.createElement('tbody');
                respuestas.forEach(recibos => {
                    const filasRecibosPagos = document.createElement('tr');
                    const columnaDetalles = document.createElement('td');
                    columnaDetalles.classList.add('fuente-12p');
                    columnaDetalles.innerHTML=`
                        <div class="row">
                            <div class="col-md-6 col-12">
                                Folio: ${recibos.IDCOBRO_COBR} - <small class="fuente-10p">${recibos.CONSECUTIVO_COBR}</small>
                            </div>
                            <div class="col-md-6 col-12">Usuario: ${recibos.NOMBRE}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-8">Ubicacion: ${recibos.DIRECCION}</div>
                            <div class="col-md-4">${recibos.CONCEPTO_COBR}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">Total pago: $${parseFloat(recibos.TOTAL_COBR).toFixed(2)}</div>
                            <div class="col-md-4">Fecha pago: ${recibos.FMODIF_COBR}</div>
                            <div class="col-md-4">
                                <div class="badge badge-success rounded">${recibos.DESCRIPCION_ESTAT}</div>
                            </div>
                        </div>
                    `;
                    filasRecibosPagos.appendChild(columnaDetalles);
                    const columnaAcciones = document.createElement('td');
                    const botonReimprimirRecibo = document.createElement('button');
                    botonReimprimirRecibo.classList.add('btn','btn-success','btn-sm');
                    botonReimprimirRecibo.setAttribute('dataimprimir',recibos.idTablePk);
                    botonReimprimirRecibo.setAttribute('id','botonReimprimirReciboSel');
                    botonReimprimirRecibo.innerHTML = '<i class="fas fa-print"></i>';
                    botonReimprimirRecibo.addEventListener('click',() => {
                        reimprimirReciboPago(botonReimprimirRecibo);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonReimprimirRecibo);
                    columnaAcciones.appendChild(grupoAcciones);
                    filasRecibosPagos.appendChild(columnaAcciones)

                    cuerpoTablaRecibosPagos.appendChild(filasRecibosPagos);
                    
                })
                tablaRecibosPagos.appendChild(cuerpoTablaRecibosPagos);
                detalleDatosRecibos.innerHTML='';
                detalleDatosRecibos.appendChild(tablaRecibosPagos);
                detalleDatosRecibos.appendChild(botonResetear);
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

const reimprimirReciboPago = async (botonReimprimirRecibo) => {
    try{
        let idBusqueda = botonReimprimirRecibo.attributes.dataimprimir.value;
        let impresionComprobante = document.querySelector('#impresionComprobante');
        impresionComprobante.innerHTML=`
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
        fetch(`areportes/imprimirComprobantePago/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            respuestas[0].forEach(usuarios => {
                let tipoTarifa = '';
                if(usuarios.DESCUENTO_CCONT=='SINDES'){
                    tipoTarifa = 'Completa';
                }else if(usuarios.DESCUENTO_CCONT=='CONDES'){
                    tipoTarifa = 'Descuento';
                }else if(usuarios.DESCUENTO_CCONT=='TARESP'){
                    tipoTarifa = 'Especial';
                }else if(usuarios.DESCUENTO_CCONT=='TARNEG'){
                    tipoTarifa = 'Negocio';
                }
                const cabeceraComprobante = document.createElement('table');
                cabeceraComprobante.setAttribute('border','0');
                cabeceraComprobante.setAttribute('cellspacing','0');
                cabeceraComprobante.setAttribute('cellpadding','0');
                cabeceraComprobante.setAttribute('style','width: 100%; font-family: Montserrat;');
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
                        <td rowspan="4" colspan="1" style="border: 1px solid rgb(20,179,237);"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:80px; height:80px; margin: auto;"/></td>
                        <td rowspan="4" colspan="8" style="text-align: center; border: 1px solid rgb(20,179,237);">
                            <div style="text-align: center; font-size: 10px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                            <div style="text-align: center; font-size: 8px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                        </td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237);">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Contrato:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${usuarios.CONTRATO_CCONT}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${usuarios.FECHACAP_COBR}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Hora:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${usuarios.HORACAP_COBR}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha Impresión:</div>
                            <div style="float: right; margin-right: 5px; font-size:10px;">${fechaImpress}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding: 3px; text-align: center; font-weight: bolder; font-size:10px;">Comprobante de Pago</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Nombre:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.NOMBRE}</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Contrato:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.DESCRIPCION_CONT}</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Tarifa:</div>
                            <div style="text-align: center; font-size:10px;">${tipoTarifa}</div>
                        </td>
                        <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Folio:</div>
                            <div style="float: right; margin-right: 5px; text-align: center; font-size:10px;">${usuarios.IDCOBRO_COBR+'-'+usuarios.CONSECUTIVO_COBR}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Calle:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.CALLES}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Colonia:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.COLONIA_CODPOS}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Codigo Postal:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.CODIPOST_CODPOS}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Municipio:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.NOMBRE_MUNIC}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Estado:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.ESTADO_ESTA}</div>
                        </td>
                        <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Telefono:</div>
                            <div style="text-align: center; font-size:10px;">${usuarios.TELEFONO_CLIEN} - ${usuarios.MOVIL_CLIEN}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" style="padding: 5px;"></td>
                    </tr>

                `;

                impresionComprobante.appendChild(cabeceraComprobante);
            })

            let capaDetalles = document.createElement('div');
            capaDetalles.setAttribute('style','width: 100%; min-height: 245px; border: 1px solid rgb(20,179,237); font-family: Montserrat;')
            if(respuestas[1]==null){
                const detalleComprobante = document.createElement('table');
                detalleComprobante.setAttribute('border','0');
                detalleComprobante.setAttribute('cellspacing','0');
                detalleComprobante.setAttribute('cellpadding','0');
                detalleComprobante.setAttribute('style','width: 100%;');
                detalleComprobante.innerHTML=`
                    <thead>
                        <td colspan="1" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: absolute; margin-left:5px; font-size:8px;">Código</div>
                        </td>
                        <td colspan="9" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: absolute; margin-left:5px; font-size:8px;">Descripción</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: absolute; margin-left:5px; font-size:8px;">Costo</div>
                        </td>
                    </thead>
                    <tbody>
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

                    <tr><td colspan="3">No datos</td></tr>
                    </tbody>
                `;
                capaDetalles.appendChild(detalleComprobante);
                impresionComprobante.appendChild(capaDetalles);
            }else{
                const detalleComprobante = document.createElement('table');
                detalleComprobante.setAttribute('border','0');
                detalleComprobante.setAttribute('cellspacing','0');
                detalleComprobante.setAttribute('cellpadding','0');
                detalleComprobante.setAttribute('style','width: 100%;');
                detalleComprobante.innerHTML=`
                    <thead>
                        <td colspan="1" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: relative; margin-left:5px; font-size:10px;">Código</div>
                        </td>
                        <td colspan="9" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: relative; margin-left:5px; font-size:10px;">Descripción</div>
                        </td>
                        <td colspan="2" style="border: 1px solid rgb(20,179,237); font-weight: bold;">
                            <div style="position: relative; margin-left:5px; font-size:10px;">Costo</div>
                        </td>
                    </thead>
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
                `;
                const tablaBodyRecibo = document.createElement('tbody')
                respuestas[1].forEach(detalles => {
                    const filaDetalles = document.createElement('tr');
                    const columnaCodigo = document.createElement('td');
                    columnaCodigo.setAttribute('style','border: 1px solid rgb(20,179,237); border-left: none; border-bottom: none;');
                    columnaCodigo.setAttribute('colspan','1');
                    columnaCodigo.innerHTML='<div style="position: relative; margin-left:5px; font-size:6px;">'+detalles.CODIGO_DETA+'</div>';
                    filaDetalles.appendChild(columnaCodigo);
                    const columnaDescripcion = document.createElement('td');
                    columnaDescripcion.setAttribute('style','border: 1px solid rgb(20,179,237); border-left: none; border-right: none; border-bottom: none;');
                    columnaDescripcion.setAttribute('colspan','9');
                    columnaDescripcion.innerHTML='<div style="position: relative; margin-left:5px; font-size:6px;">'+detalles.DESCRIPCION_CONC+'</div>';
                    filaDetalles.appendChild(columnaDescripcion);
                    const columnaCosto = document.createElement('td');
                    columnaCosto.setAttribute('style','border: 1px solid rgb(20,179,237); border-right: none; border-bottom: none;');
                    columnaCosto.setAttribute('colspan','2');
                    columnaCosto.innerHTML='<div style="position: relative; margin-left:5px; font-size:6px;">$'+parseFloat(detalles.COSTO_DETA).toFixed(2)+'</div>';
                    filaDetalles.appendChild(columnaCosto);
                    tablaBodyRecibo.appendChild(filaDetalles);
                    detalleComprobante.appendChild(tablaBodyRecibo);
                })

                capaDetalles.appendChild(detalleComprobante);
                impresionComprobante.appendChild(capaDetalles);

            }

            if(respuestas[2]==null){
                const pagoDetallado = document.createElement('table');
                pagoDetallado.setAttribute('border','0');
                pagoDetallado.setAttribute('cellspacing','0');
                pagoDetallado.setAttribute('cellpadding','0');
                pagoDetallado.setAttribute('style','width: 100%; font-family: Montserrat;');
                pagoDetallado.innerHTML=`
                    <tr>
                        <td></td>
                    </tr>
                `;
                impresionComprobante.appendChild(pagoDetallado);

            }else{
                const pagoDetallado = document.createElement('table');
                pagoDetallado.setAttribute('border','0');
                pagoDetallado.setAttribute('cellspacing','0');
                pagoDetallado.setAttribute('cellpadding','0');
                pagoDetallado.setAttribute('style','width: 100%; font-family: Montserrat;');
                respuestas[2].forEach(totales => {
                    let reciboCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.RECIBO_PAGO);
                    let cambioCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.CAMBIO_PAGO);
                    let totalCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTAL_PAGO);
                    pagoDetallado.innerHTML=`
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
                            <td rowspan="2" colspan="5" id="detalleDeudasFila"></td>
                            <td rowspan="2" colspan="5">
                                <div style="text-align:center; margin-right: 5px; font-size: 10px;"><span>Atendió:</span> ${totales.ATIENDE}</div>
                            </td>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Metodo Pago:</div>
                                <div style="float: right; margin-right: 5px; font-size:10px;">${totales.DESCRIPCION_ESTAT}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Pago Recibido:</div>
                                <div style="float: right; margin-right: 5px; font-size:10px;">${reciboCosto}</div>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="2" colspan="10" id="codigoBarras"></td>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Cambio:</div>
                                <div style="float: right; margin-right: 5px; font-size:10px;">${cambioCosto}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border: 1px solid rgb(20,179,237); border-top: none;">
                                <div style="position: absolute; margin-left:5px; font-size:6px;">Total a Pagar:</div>
                                <div style="float: right; margin-right: 5px; font-size:12px; font-weight: bolder;">${totalCosto}</div>
                            </td>
                        </tr>
                    `;

                    impresionComprobante.appendChild(pagoDetallado);
                })

            }
            let codigoBarras = document.querySelector('#codigoBarras');
            respuestas[2].forEach(totales => {
                const codigo_qr = document.createElement('img');
                codigo_qr.setAttribute('style','position:relative; top:2px; height:30px; width:250px;');
                JsBarcode(codigo_qr, totales.CODBARR_CLIEN, {
                    displayValue: false,
                    format: 'CODE128',
                    width: 1,
                });
                codigoBarras.appendChild(codigo_qr);
            })

            let detalleDeudasFila = document.querySelector('#detalleDeudasFila');
            if(respuestas[3]==null || respuestas[3]==''){
                const deudaDetalle = document.createElement('div');
                deudaDetalle.setAttribute('style','font-size: 10px; margin-left:10px;')
                deudaDetalle.innerHTML=`
                    <span>Total Deuda:</span> <span style="color: rgba(10,92,13,1); font-weight: bolder; font-size:14px;">$0.00</span>
                `;
                detalleDeudasFila.appendChild(deudaDetalle);

            }else{
                respuestas[3].forEach(deudas => {
                    let totalDeuda = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(deudas.TOTAL_DEUDA);
                    const deudaDetalle = document.createElement('div');
                    deudaDetalle.setAttribute('style','font-size: 10px; margin-left:10px;')
                    if(deudas.TOTAL_DEUDA==null){
                        deudaDetalle.innerHTML=`
                            <span>Total Deuda:</span> <span style="color: rgba(10,92,13,1); font-weight: bolder; font-size:14px;">$0.00</span>
                        `;
                    }else{
                        deudaDetalle.innerHTML=`
                            <span>Total Deuda:</span> <span>Contrato ${deudas.CONTRATO_DETA}<span> <span style="color: rgba(149,0,0,1); font-weight: bolder; font-size:14px;">${totalDeuda}</span>
                        `;
                    }
                    detalleDeudasFila.appendChild(deudaDetalle);
                })

            }
            let ventImpri = window.open('', 'popimpr');
            ventImpri.document.write(impresionComprobante.innerHTML);
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
