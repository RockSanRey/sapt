let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListadoRecibos();
})

const obtenerListadoRecibos = async () => {
    try{
        let detalleDatosRecibos = document.querySelector('#detalleDatosRecibos');
        detalleDatosRecibos.innerHTML=cargaAnimacion;
        fetch('areimcompago/llenarTablaRecibosPago')
        .then(respRender => respRender.json())
        .then(respuestas => {
            const tablaRecibosPagos = document.createElement('table');
            tablaRecibosPagos.classList.add('table','table-sm','table-hover','fuente-14p');
            tablaRecibosPagos.innerHTML=`
                <thead>
                    <th class="col">Detalles</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaRecibosPagos = document.createElement('tbody');
            if(respuestas.estatus=='error' || respuestas.estatus=='nodata'){
                cuerpoTablaRecibosPagos.innerHTML=`<tr><td colspan="2">No hay datos para mostrar</td></tr>`;
                tablaRecibosPagos.appendChild(cuerpoTablaRecibosPagos);
                detalleDatosRecibos.innerHTML='';
                detalleDatosRecibos.appendChild(tablaRecibosPagos);
            }else{
                if(respuestas==null){

                }else{
                    detalleDatosRecibos.classList.add('tabla-contenedor');
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
                        const botonExportarPdf = document.createElement('button');
                        botonExportarPdf.classList.add('btn','btn-danger','btn-sm');
                        botonExportarPdf.setAttribute('dataexportar',recibos.idTablePk);
                        botonExportarPdf.setAttribute('id','botonExportarPdf');
                        botonExportarPdf.innerHTML = '<i class="fa fa-file-pdf"></i>';
                        botonExportarPdf.addEventListener('click',() => {
                            exportarReciboPago(botonExportarPdf)
                        });
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
                        grupoAcciones.appendChild(botonExportarPdf);
                        grupoAcciones.appendChild(botonReimprimirRecibo);
                        columnaAcciones.appendChild(grupoAcciones);
                        filasRecibosPagos.appendChild(columnaAcciones)

                        cuerpoTablaRecibosPagos.appendChild(filasRecibosPagos);
                        
                    })
                    tablaRecibosPagos.appendChild(cuerpoTablaRecibosPagos);
                    detalleDatosRecibos.innerHTML='';
                    detalleDatosRecibos.appendChild(tablaRecibosPagos);
                }
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
            <img src="public/assets/imagen/logotipos/logo_sapt_trans_300.png" style="position: absolute; margin: 60px 20%; width: 400px; height:400px;" />
        `;
        let fechaHoy = new Date();
        let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
        fetch(`areportes/imprimirComprobantePago/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            respuestas[0].forEach(usuarios => {
                let tipoTarifa = '';
                if(usuarios.DESCUENTO_CCONT=='TARNOR'){
                    tipoTarifa = 'Completa';
                }else if(usuarios.DESCUENTO_CCONT=='TARMAY'){
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
                            <div style="position: absolute; margin-left:3px; font-size:6px;">Id Usua:</div>
                            <div style="text-align: right; margin-right: 5px; font-size:10px;">${usuarios.CODBARR_CLIEN}</div>
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
                            <div style="text-align: center; font-size:10px;">${usuarios.COLONIA_COLON}</div>
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
                            <div style="text-align: center; font-size:10px;">${usuarios.NOMBRE_ESTA}</div>
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
                            <span>Total Deuda:</span> <span>Contrato ${deudas.CONTRATO_DETA}</span> <span style="color: rgba(149,0,0,1); font-weight: bolder; font-size:14px;">${totalDeuda}</span>
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

const exportarReciboPago = async (botonExportarPdf) => {
    try{
        let idBusqueda = botonExportarPdf.attributes.dataexportar.value;
        let tablaDetallesRecibo = document.querySelector('#tablaDetallesRecibo');
        const docImprimir = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'letter',
            compress: true,
        });

        fetch(`areportes/imprimirComprobantePago/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            let logoSistema = new Image();
            let marcaAgua = new Image();
            logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
            marcaAgua.src = 'public/assets/imagen/logotipos/logo_sapt_trans_300.png';
            let fechaHoy = new Date();
            let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
            let base64Logo = logoSistema;
            let base64MarcaAgua = marcaAgua;
            docImprimir.addImage(base64Logo, 'png', 8,5, 16,16);
            docImprimir.addImage(base64MarcaAgua, 'png', 50,10, 110,110);
            docImprimir.setDrawColor(20,179,237);
            docImprimir.rect(7, 5, 202, 16);
            docImprimir.rect(7, 5, 18, 16);
            docImprimir.rect(164, 5, 45, 4);
            docImprimir.rect(164, 9, 45, 4);
            docImprimir.rect(164, 13, 45, 4);
            docImprimir.rect(164, 17, 45, 4);
            docImprimir.rect(7, 25, 202, 12);
            docImprimir.rect(7, 25, 87, 4);
            docImprimir.rect(94, 25, 29, 4);
            docImprimir.rect(123, 25, 35, 4);
            docImprimir.rect(158, 25, 51, 4);
            docImprimir.rect(7, 29, 85, 4);
            docImprimir.rect(92, 29, 65, 4);
            docImprimir.rect(157, 29, 52, 4);
            docImprimir.rect(7, 33, 65, 4);
            docImprimir.rect(72, 33, 76, 4);
            docImprimir.rect(148, 33, 61, 4);
            docImprimir.rect(7, 40, 202, 70);
            docImprimir.rect(169, 110, 40, 4);
            docImprimir.rect(169, 114, 40, 4);
            docImprimir.rect(169, 118, 40, 4);
            docImprimir.rect(169, 122, 40, 4);
            docImprimir.setDrawColor(135,142,147);
            docImprimir.setFontSize(10);
            docImprimir.text('SISTEMA DE AGUA POTABLE',95,10, 'center');
            docImprimir.text('COMITE DE ADMINISTRACION DE AGUA POTABLE',95,14, 'center');
            docImprimir.setFontSize(6);
            docImprimir.text('CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ',95,17, 'center');
            docImprimir.text('MUNICIPIO DE TLAXCOAPAN, HIDALGO',95,19, 'center');
            docImprimir.setFontType('bold');
            docImprimir.setFontSize(8);
            docImprimir.text('Comprobante de Pago',95,24, 'center');
            docImprimir.setFontType('normal');
            docImprimir.setFontSize(4);
            docImprimir.text('Contrato:',165,7, 'left');
            docImprimir.text('Fecha:',165,11, 'left');
            docImprimir.text('Hora:',165,15, 'left');
            docImprimir.text('Impresión:',165,19, 'left');
            docImprimir.text('Cliente:',8,27, 'left');
            docImprimir.text('Tipo Contrato:',95,27, 'left');
            docImprimir.text('Id Usuario:',124,27, 'left');
            docImprimir.text('Folio:',159,27, 'left');
            docImprimir.text('Calle y Numero:',8,31, 'left');
            docImprimir.text('Colonia:',93,31, 'left');
            docImprimir.text('Cod. Postal:',158,31, 'left');
            docImprimir.text('Municipio:',8,35, 'left');
            docImprimir.text('Estado:',73,35, 'left');
            docImprimir.text('Telefono(s):',149,35, 'left');
            docImprimir.text('Metodo Pago:',170,112, 'left');
            docImprimir.text('Su Pago:',170,116, 'left');
            docImprimir.text('Cambio:',170,120, 'left');
            docImprimir.text('Total:',170,124, 'left');

            respuestas[0].forEach(usuarios => {
                docImprimir.setFontType('normal');
                docImprimir.setFontSize(9);
                docImprimir.text(usuarios.CONTRATO_CCONT,208,8, 'right');
                docImprimir.text(fechaImpress,208,20, 'right');
                docImprimir.text(usuarios.NOMBRE,15,28, 'left');
                docImprimir.text(usuarios.DESCRIPCION_CONT,106,28, 'left');
                docImprimir.text(usuarios.CODBARR_CLIEN,132,28, 'left');
                docImprimir.text(usuarios.IDCOBRO_COBR+'-'+usuarios.CONSECUTIVO_COBR,208,28, 'right');
                docImprimir.text(usuarios.CALLES,20,32, 'left');
                docImprimir.text(usuarios.COLONIA_COLON,100,32, 'left');
                docImprimir.text(usuarios.CODIPOST_CODPOS,168,32, 'left');
                docImprimir.text(usuarios.NOMBRE_MUNIC,16,36, 'left');
                docImprimir.text(usuarios.NOMBRE_ESTA,79,36, 'left');
                docImprimir.text(usuarios.TELEFONO_CLIEN+' '+usuarios.MOVIL_CLIEN,160,36, 'left');
                JsBarcode('#codigo_qr', usuarios.CODBARR_CLIEN, {
                    displayValue: false,
                    format: 'CODE128',
                    width: 1,
                });
                let codigo_qr = document.querySelector('img#codigo_qr');
                docImprimir.addImage(codigo_qr.src, 'jpeg', 7,120, 60,5);

                nombreArchivo = usuarios.IDCOBRO_COBR;

            })
            if(respuestas[1]==null){
                tablaDetallesRecibo.innerHTML=`
                    <thead>
                        <td>Código</td>
                        <td>Descripción</td>
                        <td>Costo</td>
                    </thead>
                    <tbody>
                    <tr><td colspan="3">No datos</td></tr>
                    </tbody>
                `;
            }else{
                tablaDetallesRecibo.innerHTML=`
                    <thead>
                        <td>Código</td>
                        <td>Descripción</td>
                        <td>Costo</td>
                    </thead>
                `;
                const tablaBodyRecibo = document.createElement('tbody')
                respuestas[1].forEach(detalles => {
                    const filaDetalles = document.createElement('tr');
                    const columnaCodigo = document.createElement('td');
                    columnaCodigo.innerHTML=detalles.CODIGO_DETA;
                    filaDetalles.appendChild(columnaCodigo);
                    const columnaDescripcion = document.createElement('td');
                    columnaDescripcion.innerHTML=detalles.DESCRIPCION_CONC;
                    filaDetalles.appendChild(columnaDescripcion);
                    const columnaCosto = document.createElement('td');
                    columnaCosto.innerHTML='$'+parseFloat(detalles.COSTO_DETA).toFixed(2);
                    filaDetalles.appendChild(columnaCosto);
                    tablaBodyRecibo.appendChild(filaDetalles);
                    tablaDetallesRecibo.appendChild(tablaBodyRecibo);
                })

            }

            docImprimir.autoTable({
                html: '#tablaDetallesRecibo',
                margin: {top: 40, left:7},
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 255, 255],
                    borderColor: [20,179,237],
                    textColor: [0, 0, 0],
                    fontSize: 6,
                    textColor: [0, 0, 0],
                    cellPadding: .5,
                },
                bodyStyles: {
                    fontSize: 5,
                    drawColor: [20,179,237],
                    textColor: [0, 0, 0],
                    cellPadding: 0.1,
                },
                columnStyles: {
                    0: {halign: 'left', fillColor: [255, 255, 255], cellWidth: 4} ,
                    1: {halign: 'left',fillColor: [255, 255, 255], cellWidth: 90} ,
                    2: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 6} ,
                    fontSize: 6,
                },
                tableWidth: 202,
            })

            respuestas[2].forEach(total => {
                docImprimir.setFontType('normal');
                docImprimir.setFontSize(9);
                docImprimir.text(total.FECHACAP_PAGO,208,12, 'right');
                docImprimir.text(total.HORACAP_PAGO,208,16, 'right');
                docImprimir.setFontSize(8);
                docImprimir.text('Atendio: '+total.ATIENDE,165,117, 'right');
                docImprimir.text(total.DESCRIPCION_ESTAT,208,113, 'right');
                docImprimir.text('$'+parseFloat(total.RECIBO_PAGO).toFixed(2),208,117, 'right');
                docImprimir.text('$'+parseFloat(total.CAMBIO_PAGO).toFixed(2),208,121, 'right');
                docImprimir.setFontType('bold');
                docImprimir.setFontSize(10);
                docImprimir.text('$'+parseFloat(total.TOTAL_PAGO).toFixed(2),208,125, 'right');

            })
            let espacioLinea=114
            docImprimir.setFontSize(8);
            docImprimir.text('Total Adeudo:',10,114, 'left');
            docImprimir.setFontType('normal');
            espacioLinea=espacioLinea+3;
            if(respuestas[3]==null){
                docImprimir.text('No tiene adeudos Pendientes',10,espacioLinea, 'left');
            }else{
                respuestas[3].forEach(deudas => {
                    if(deudas.TOTAL_DEUDA==null){
                        docImprimir.text('$0.00',25,espacioLinea, 'left');
                    }else{
                        docImprimir.text('Contrato '+deudas.CONTRATO_DETA+' $'+parseFloat(deudas.TOTAL_DEUDA).toFixed(2),10,espacioLinea, 'left');
                    }
                })

            }

            docImprimir.save('Recibo '+nombreArchivo+'.pdf');

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
