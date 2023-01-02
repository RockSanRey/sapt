let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda()
})

const plantillaBusqueda = async () => {
    try{
        let listadoCortes = document.querySelector('#listadoCortes');
        let botonesExportar = document.querySelector('#botonesExportar');
        listadoCortes.innerHTML=cargaAnimacion;
        listadoCortes.classList.add('tabla-contenedor');
        botonesExportar.innerHTML=`
            <button class="btn btn-success btn-sm" id="botonExportarXls"><i class="fas fa-file-excel"></i> Exportar XLS</button>
            <button class="btn btn-danger btn-sm" id="botonExportarPdf"><i class="fas fa-file-pdf"></i> Exportar PDF</button>
        `;
        let botonExportarXls = document.querySelector('#botonExportarXls');
        let botonExportarPdf = document.querySelector('#botonExportarPdf');
        fetch('alistacortes/llenatTablaDeudores')
        .then(respRender => respRender.json())
        .then(respuestas => {
            let granTotalDeuda = 0;
            const tablaListaDeudores = document.createElement('table');
            tablaListaDeudores.classList.add('table','table-sm','table-hover','table-bordered','fuente-10p');
            tablaListaDeudores.setAttribute('id','tablaDetallesDeudores');
            tablaListaDeudores.innerHTML=`
                <thead>
                    <th>Contrato</th>
                    <th>Cliente</th>
                    <th>Direccion</th>
                    <th>Deuda</th>
                    <th>Estatus</th>
                </thead>
            `;
            const cuerpoTablaListaDeudores = document.createElement('tbody');
            respuestas.forEach(deudor => {
                let totalesDeuda = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(deudor.DEUDA);
                granTotalDeuda=granTotalDeuda+parseFloat(deudor.DEUDA);
                const filaTablaListaDeudores = document.createElement('tr');
                const columnaContrato = document.createElement('td');
                columnaContrato.innerHTML=deudor.CONTRATO_CCONT;
                filaTablaListaDeudores.appendChild(columnaContrato);
                const columnaCliente = document.createElement('td');
                columnaCliente.innerHTML=deudor.USUARIO;
                filaTablaListaDeudores.appendChild(columnaCliente);
                const columnaDireccion = document.createElement('td');
                columnaDireccion.innerHTML=deudor.DIRECCION;
                filaTablaListaDeudores.appendChild(columnaDireccion);
                const columnaDeuda = document.createElement('td');
                columnaDeuda.innerHTML=totalesDeuda;
                filaTablaListaDeudores.appendChild(columnaDeuda);
                const columnaEstatus = document.createElement('td');
                columnaEstatus.innerHTML=deudor.DESCRIPCION_ESTAT;
                filaTablaListaDeudores.appendChild(columnaEstatus);
                cuerpoTablaListaDeudores.appendChild(filaTablaListaDeudores);
            })
            const filaGranTotal = document.createElement('tr');
            let granDeuda = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(granTotalDeuda);
            filaGranTotal.innerHTML=`<td colspan="5" class="text-right">${granDeuda}</td>`;
            cuerpoTablaListaDeudores.appendChild(filaGranTotal);
            tablaListaDeudores.appendChild(cuerpoTablaListaDeudores);
            listadoCortes.innerHTML='';
            listadoCortes.appendChild(tablaListaDeudores);
            botonExportarXls.addEventListener('click', () => {
                exportarListadoExcel();
            })
            botonExportarPdf.addEventListener('click', () => {
                exportarListadoPdf();
            })
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

const exportarListadoExcel = async () => {
    try{
        let botonExportarXls = document.querySelector('#botonExportarXls');
        let tablaExportadora = document.querySelector('#tablaExportadora');
        botonExportarXls.innerHTML=cargaAnimacion;
        fetch('alistacortes/exportadorListaDeudas')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaExportadora.innerHTML=`
                <thead>
                    <td>Contrato</td>
                    <td>Usuario</td>
                    <td>Dirección</td>
                    <td>Deuda</td>
                    <td>Estatus</td>
                </thead>
            `;
            const tablaFoliosCuerpo = document.createElement('tbody');
            respuestas[0].forEach(deudores => {
                const filaFolios = document.createElement('tr');
                filaFolios.innerHTML=`
                    <td>${deudores.CONTRATO_CCONT}</td>
                    <td>${deudores.USUARIO}</td>
                    <td>${deudores.DIRECCION}</td>
                    <td>${deudores.DEUDA}</td>
                    <td>${deudores.DESCRIPCION_ESTAT}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaFolios);
            })
            respuestas[1].forEach(totales => {
                const filaTotal = document.createElement('tr');
                filaTotal.innerHTML=`
                <td colspan="4">Gran Total</td>
                <td>${totales.DEUDA}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaTotal);
                botonExportarXls.innerHTML='<i class="fas fa-file-excel"></i> Exportar XLS';
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            let tablaExportar = new TableExport(tablaExportadora, {
                exportButtons: false,
                filename: 'Listado Cortes',
                sheetname: 'deudores',
            });
            let datosExport = tablaExportar.getExportData();
            let prefDocumento = datosExport.tablaExportadora.xlsx;
            tablaExportar.export2file(prefDocumento.data, prefDocumento.mimeType, prefDocumento.filename, prefDocumento.fileExtension, prefDocumento.merges, prefDocumento.RTL, prefDocumento.sheetname);

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

const exportarListadoPdf = async () => {
    try{
        let botonExportarPdf = document.querySelector('#botonExportarPdf');
        let tablaExportadora = document.querySelector('#tablaExportadora');
        botonExportarPdf.innerHTML=cargaAnimacion;
        fetch('alistacortes/exportadorListaDeudas')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaExportadora.innerHTML=`
                <thead>
                    <td>Contrato</td>
                    <td>Usuario</td>
                    <td>Dirección</td>
                    <td>Deuda</td>
                    <td>Estatus</td>
                </thead>
            `;
            const tablaFoliosCuerpo = document.createElement('tbody');
            respuestas[0].forEach(deudores => {
                const filaFolios = document.createElement('tr');
                filaFolios.innerHTML=`
                    <td>${deudores.CONTRATO_CCONT}</td>
                    <td>${deudores.USUARIO}</td>
                    <td>${deudores.DIRECCION}</td>
                    <td>${deudores.DEUDA}</td>
                    <td>${deudores.DESCRIPCION_ESTAT}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaFolios);
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            respuestas[1].forEach(totales => {
                const filaTotal = document.createElement('tr');
                filaTotal.innerHTML=`
                <td colspan="3">Gran Total</td>
                <td colspan="2">${totales.DEUDA}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaTotal);
                botonExportarPdf.innerHTML=`<i class="fas fa-file-pdf"></i> Exportar PDF`;
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            const docImprimir = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'letter',
                compress: true
            });
            docImprimir.autoTable({
                html: '#tablaExportadora',
                margin: {top: 20, left:10},
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 255, 255],
                    borderColor: [20,179,237],
                    textColor: [0, 0, 0],
                    fontSize: 10,
                    textColor: [0, 0, 0],
                    cellPadding: .5,
                },
                bodyStyles: {
                    fontSize: 8,
                    drawColor: [20,179,237],
                    textColor: [0, 0, 0],
                    cellPadding: 0.1,
                },
                columnStyles: {
                    0: {halign: 'left', fillColor: [255, 255, 255], cellWidth: 22} ,
                    1: {halign: 'left',fillColor: [255, 255, 255], cellWidth: 60} ,
                    2: {halign: 'left',fillColor: [255, 255, 255], cellWidth: 60} ,
                    3: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 25} ,
                    3: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 8} ,
                    fontSize: 6,
                },
                tableWidth: 195,
            })
            docImprimir.save('Listado Deudores.pdf');

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
