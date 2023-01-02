document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try{
        let combosFechas = document.querySelector('#busquedaFechas');
        combosFechas.innerHTML=`
            <div class="row">
                <div class="input-group col-md-4">
                    <select class="custom-select custom-select-sm" id="textAnioMes" name="textAnioMes"></select>
                    <select class="custom-select custom-select-sm" id="textMeses" name="textMeses"><option value="">---</option></select>
                     <div class="input-group-prepend">
                        <button class="btn btn-info btn-sm" id="botonBusquedaMes"><i class="fa fa-search"></i> Buscar</button>
                    </div>
                </div>
                <div class="input-group col-md-3"></div>
                <div class="input-group col-md-5">
                    <select class="custom-select custom-select-sm" id="textAnioDia" name="textAnioDia"></select>
                    <select class="custom-select custom-select-sm" id="textMesDia" name="textMesDia"><option value="">---</option></select>
                    <select class="custom-select custom-select-sm" id="textFecha" name="textFecha"><option value="">---</option></select>
                    <div class="input-group-prepend">
                       <button class="btn btn-info btn-sm" id="botonBusquedaDia"><i class="fa fa-search"></i> Buscar</button>
                   </div>
                </div>
            </div>

        `;
        let textAnioMes = document.querySelector('#textAnioMes');
        let textMeses = document.querySelector('#textMeses');
        let textAnioDia = document.querySelector('#textAnioDia');
        let textMesDia = document.querySelector('#textMesDia');
        let textFecha = document.querySelector('#textFecha');
        llenarComboAnioMes(textAnioMes);
        textAnioMes.addEventListener('change', () => {
            llenarComboMeses(textAnioMes,textMeses);
        })
        llenarComboAnioDia(textAnioDia);
        textAnioDia.addEventListener('change', () => {
            llenarComboMesDia(textAnioDia,textMesDia);
        })
        textMesDia.addEventListener('change', () => {
            llenarComboFechas(textMesDia,textFecha);
        })
        let botonBusquedaMes = document.querySelector('#botonBusquedaMes');
        botonBusquedaMes.addEventListener('click', () => {
            generarListadoMes();
        })
        let botonBusquedaDia = document.querySelector('#botonBusquedaDia');
        botonBusquedaDia.addEventListener('click', () => {
            generarListadoDia();
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

const llenarComboAnioMes = async (textAnioMes) => {
    try{
        fetch('acortecaja/llenarComboAnioMes')
        .then(respRender =>  respRender.json())
        .then(respuestas => {
            textAnioMes.innerHTML='<option value="">Selecciona Año</option>';
            let contero = respuestas.length;
            respuestas.forEach(mesPaga => {
                const iteracion = mesPaga.FMODIF_COBR.split('-');
                const opcionSelect = document.createElement('option');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.setAttribute('value',iteracion[0]);
                opcionSelect.innerHTML='Año '+iteracion[0];
                textAnioMes.appendChild(opcionSelect);
                // for(let mes=0; mes <= contero; mes++){
                //     const opcionSelect = document.createElement('option');
                //     opcionSelect.classList.add('fuente-12p');
                //     opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                //     opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                //     textMeses.appendChild(opcionSelect);
                //     console.log(iteracion[1]);
                // }

            });

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

const llenarComboMeses = async (textAnioMes,textMeses) => {
    try{
        if(textAnioMes.value=='' || textAnioMes.value==null){
            textMeses.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textAnioMes.value;
            fetch(`acortecaja/llenarComboMes/${idBusqueda}`)
            .then(respRender =>  respRender.json())
            .then(respuestas => {
                textMeses.innerHTML='<option value="">Selecciona Mes</option>';
                let mesesName = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                let contero = respuestas.length;
                respuestas.forEach(mesPaga => {
                    const iteracion = mesPaga.FMODIF_COBR.split('-');
                    const opcionSelect = document.createElement('option');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                    opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                    textMeses.appendChild(opcionSelect);
                    // for(let mes=0; mes <= contero; mes++){
                    //     const opcionSelect = document.createElement('option');
                    //     opcionSelect.classList.add('fuente-12p');
                    //     opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                    //     opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                    //     textMeses.appendChild(opcionSelect);
                    //     console.log(iteracion[1]);
                    // }
    
                });
                textMeses.focus();
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

const llenarComboAnioDia = async (textAnioDia) => {
    try{
        fetch('acortecaja/llenarComboAnioMes')
        .then(respRender =>  respRender.json())
        .then(respuestas => {
            textAnioDia.innerHTML='<option value="">Selecciona Año</option>';
            let contero = respuestas.length;
            respuestas.forEach(mesPaga => {
                const iteracion = mesPaga.FMODIF_COBR.split('-');
                const opcionSelect = document.createElement('option');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.setAttribute('value',iteracion[0]);
                opcionSelect.innerHTML='Año '+iteracion[0];
                textAnioDia.appendChild(opcionSelect);
                // for(let mes=0; mes <= contero; mes++){
                //     const opcionSelect = document.createElement('option');
                //     opcionSelect.classList.add('fuente-12p');
                //     opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                //     opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                //     textMeses.appendChild(opcionSelect);
                //     console.log(iteracion[1]);
                // }

            });

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

const llenarComboMesDia = async (textAnioDia,textMesDia) => {
    try{
        if(textAnioDia.value=='' || textAnioDia.value==null){
            textMesDia.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textAnioDia.value;
            fetch(`acortecaja/llenarComboMes/${idBusqueda}`)
            .then(respRender =>  respRender.json())
            .then(respuestas => {
                textMesDia.innerHTML='<option value="">Selecciona Mes</option>';
                let mesesName = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                let contero = respuestas.length;
                respuestas.forEach(mesPaga => {
                    const iteracion = mesPaga.FMODIF_COBR.split('-');
                    const opcionSelect = document.createElement('option');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                    opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                    textMesDia.appendChild(opcionSelect);
                    // for(let mes=0; mes <= contero; mes++){
                    //     const opcionSelect = document.createElement('option');
                    //     opcionSelect.classList.add('fuente-12p');
                    //     opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                    //     opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                    //     textMesDia.appendChild(opcionSelect);
                    //     console.log(iteracion[1]);
                    // }
    
                });
                textMesDia.focus();
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

const llenarComboFechas = async (textMesDia,textFecha) => {
    try{
        let idBusqueda = textMesDia.value;
        if(textMesDia.value=='' || textMesDia.value==null){
            textFecha.innerHTML='<option value="">---</option>';
        }else{
            fetch(`acortecaja/llenarComboDia/${idBusqueda}`)
            .then(respRender =>  respRender.json())
            .then(respuestas => {
                textFecha.innerHTML='<option value="">Selecciona Día</option>';
                respuestas.forEach(fechas => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.setAttribute('value',fechas.FMODIF_COBR);
                    opcionSelect.innerHTML=fechas.FMODIF_COBR;
                    textFecha.appendChild(opcionSelect);
                })
            });
            textFecha.focus();
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

const generarListadoMes = async () => {
    try{
        let textMeses = document.querySelector('#textMeses');
        if(textMeses.value=='' || textMeses.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#f43',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el mes a buscar',
            })

        }else{
            let idBusqueda = textMeses.value;
            let botonesPagina = document.querySelector('#botonesPagina');
            let botonesExportar = document.querySelector('#botonesExportar');
            fetch(`acortecaja/listadoGeneraMeses/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                let tablaListadoFolios = document.querySelector('#tablaListadoFolios');
                tablaListadoFolios.classList.remove('tabla-contenedor');
                tablaListadoFolios.innerHTML='';
                botonesPagina.classList.add('mt-2');
                botonesPagina.innerHTML='';
                botonesExportar.classList.add('d-none');
                botonesExportar.innerHTML=`
                    <div class="btn-group">
                       <button class="btn btn-success btn-sm" id="botonExportaExcel"><i class="fa fa-file-excel"></i> Exportar Excel</button>
                       <button class="btn btn-danger btn-sm" id="botonExportaPdf"><i class="fa fa-file-pdf"></i> Exportar Pdf</button>
                   </div>
                `;
                let botonExportaExcel = document.querySelector('#botonExportaExcel');
                let botonExportaPdf = document.querySelector('#botonExportaPdf');
                botonExportaExcel.addEventListener('click', () => {
                    exportarListadoExcel(idBusqueda);
                })
                botonExportaPdf.addEventListener('click', () => {
                    exportarListadoPdf(idBusqueda);
                })
                respuestas.forEach(paginacion => {
                    let totalArreglo = paginacion.TOTALRESUL;
                    let filaPagina = paginacion.REGISPAGIN;
                    let paginado = parseInt(paginacion.TOTALRESUL)/parseInt(paginacion.REGISPAGIN);
                    for(let paginaBox=0; paginaBox <= paginado; paginaBox++){
                        const rangoInicial = parseInt(totalArreglo/paginado)*paginaBox
                        const botonPaginaClick = document.createElement('button');
                        botonPaginaClick.classList.add('btn','btn-sm','btn-light','fuente-12p');
                        botonPaginaClick.innerHTML=paginaBox+1;
                        botonPaginaClick.setAttribute('datapagin',idBusqueda+'_'+rangoInicial+'_'+filaPagina);
                        botonPaginaClick.addEventListener('click', () => {
                            llenarTablaPaginada(botonPaginaClick);
                        })

                        botonesPagina.appendChild(botonPaginaClick);

                    }
                })

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

const generarListadoDia = async () => {
    try{
        let textFecha = document.querySelector('#textFecha');
        if(textFecha.value=='' || textFecha.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#f43',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el mes a buscar',
            })

        }else{
            let idBusqueda = textFecha.value;
            let botonesPagina = document.querySelector('#botonesPagina');
            let botonesExportar = document.querySelector('#botonesExportar');
            fetch(`acortecaja/listadoGeneraDias/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                let tablaListadoFolios = document.querySelector('#tablaListadoFolios');
                tablaListadoFolios.classList.remove('tabla-contenedor');
                tablaListadoFolios.innerHTML='';
                botonesPagina.classList.add('btn-group','mt-2');
                botonesPagina.innerHTML='';
                botonesExportar.classList.add('d-none');
                botonesExportar.innerHTML=`
                    <div class="btn-group">
                       <button class="btn btn-success btn-sm" id="botonExportaExcel"><i class="fa fa-file-excel"></i> Exportar Excel</button>
                       <button class="btn btn-danger btn-sm" id="botonExportaPdf"><i class="fa fa-file-pdf"></i> Exportar Pdf</button>
                   </div>
                `;
                let botonExportaExcel = document.querySelector('#botonExportaExcel');
                let botonExportaPdf = document.querySelector('#botonExportaPdf');
                botonExportaExcel.addEventListener('click', () => {
                    exportarListadoExcel(idBusqueda);
                })
                botonExportaPdf.addEventListener('click', () => {
                    exportarListadoPdf(idBusqueda);
                })
                respuestas.forEach(paginacion => {
                    tablaListadoFolios.innerHTML='';
                    let totalArreglo = paginacion.TOTALRESUL;
                    let filaPagina = paginacion.REGISPAGIN;
                    let paginado = parseInt(paginacion.TOTALRESUL)/parseInt(paginacion.REGISPAGIN);
                    for(let paginaBox=0; paginaBox <= paginado; paginaBox++){
                        const rangoInicial = parseInt(totalArreglo/paginado)*paginaBox
                        const botonPaginaClick = document.createElement('button');
                        botonPaginaClick.classList.add('btn','btn-sm','btn-light');
                        botonPaginaClick.innerHTML=paginaBox+1;
                        botonPaginaClick.setAttribute('datapagin',idBusqueda+'_'+rangoInicial+'_'+filaPagina);
                        botonPaginaClick.addEventListener('click', () => {
                            llenarTablaPaginada(botonPaginaClick);
                        })

                        botonesPagina.appendChild(botonPaginaClick);

                    }
                })

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

const llenarTablaPaginada = async (botonPaginaClick) => {
    try{
        let idBusqueda = botonPaginaClick.attributes.datapagin.value;
        let tablaListadoFolios = document.querySelector('#tablaListadoFolios');
        let botonesExportar = document.querySelector('#botonesExportar');
        botonesExportar.classList.remove('d-none');
        tablaListadoFolios.classList.add('tabla-contenedor');
        tablaListadoFolios.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
        fetch(`acortecaja/llenarTablaPaginadaFolios/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaListadoFolios.innerHTML='';
            const tablaFolios = document.createElement('table');
            tablaFolios.classList.add('table','table-sm','table-hover','table-striped');
            tablaFolios.innerHTML=`
                    <thead class="thead-light">
                        <td>Fecha</td>
                        <td>Folio Cobro</td>
                        <td>Cliente</td>
                        <td>Cajero</td>
                        <td>Total</td>
                    </thead>
                    <tbody id="tablaCuerpo"></tbody>
            `;
            tablaListadoFolios.appendChild(tablaFolios);
            let tablaCuerpo = document.querySelector('#tablaCuerpo');
            tablaCuerpo.innerHTML='';
            respuestas.forEach(folios => {
                const totalCosto = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(folios.TOTAL_COBR);
                const filaFolios = document.createElement('tr');
                filaFolios.classList.add('fuente-12p');
                const columnaFecha = document.createElement('td');
                columnaFecha.innerHTML=folios.FMODIF_COBR;
                filaFolios.appendChild(columnaFecha);
                const columnaFolio = document.createElement('td');
                columnaFolio.innerHTML=folios.IDCOBRO_COBR+' '+folios.CONSECUTIVO_COBR;
                filaFolios.appendChild(columnaFolio);
                const columnaCliente = document.createElement('td');
                columnaCliente.innerHTML=folios.CLIENTE;
                filaFolios.appendChild(columnaCliente);
                const columnaNombre = document.createElement('td');
                columnaNombre.innerHTML=folios.NOMBRE;
                filaFolios.appendChild(columnaNombre);
                const columnaTotal = document.createElement('td');
                columnaTotal.innerHTML=totalCosto;
                filaFolios.appendChild(columnaTotal);

                tablaCuerpo.appendChild(filaFolios);

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

const exportarListadoExcel = async (idBusqueda) => {
    try{
        let tablaExportadora = document.querySelector('#tablaExportadora');
        fetch(`acortecaja/exportadorListaFolios/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaExportadora.innerHTML=`
                <thead>
                    <td>Fecha</td>
                    <td>Folio Cobro</td>
                    <td>Cliente</td>
                    <td>Cajero</td>
                    <td>Total</td>
                </thead>
            `;
            const tablaFoliosCuerpo = document.createElement('tbody');
            respuestas[0].forEach(folios => {
                const filaFolios = document.createElement('tr');
                filaFolios.innerHTML=`
                    <td>${folios.FMODIF_COBR}</td>
                    <td>${folios.IDCOBRO_COBR} - ${folios.CONSECUTIVO_COBR}</td>
                    <td>${folios.CLIENTE}</td>
                    <td>${folios.NOMBRE}</td>
                    <td>${folios.TOTAL_COBR}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaFolios);
            })
            respuestas[1].forEach(totales => {
                const filaTotal = document.createElement('tr');
                filaTotal.innerHTML=`
                <td colspan="3">Gran Total</td>
                <td>${totales.TOTAL}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaTotal);
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            let tablaExportar = new TableExport(tablaExportadora, {
                exportButtons: false,
                filename: 'Listado '+idBusqueda,
                sheetname: 'Folios',
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

const exportarListadoPdf = async (idBusqueda) => {
    try{
        let tablaExportadora = document.querySelector('#tablaExportadora');
        fetch(`acortecaja/exportadorListaFolios/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaExportadora.innerHTML=`
                <thead>
                    <td>Fecha</td>
                    <td>Folio Cobro</td>
                    <td>Cliente</td>
                    <td>Cajero</td>
                    <td>Total</td>
                </thead>
            `;
            const tablaFoliosCuerpo = document.createElement('tbody');
            respuestas[0].forEach(folios => {
                const filaFolios = document.createElement('tr');
                filaFolios.innerHTML=`
                    <td>${folios.FMODIF_COBR}</td>
                    <td>${folios.IDCOBRO_COBR} - ${folios.CONSECUTIVO_COBR}</td>
                    <td>${folios.CLIENTE}</td>
                    <td>${folios.NOMBRE}</td>
                    <td>${folios.TOTAL_COBR}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaFolios);
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            respuestas[1].forEach(totales => {
                const filaTotal = document.createElement('tr');
                filaTotal.innerHTML=`
                <td colspan="3">Gran Total</td>
                <td>${totales.TOTAL}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaTotal);
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            const docImprimir = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'letter',
                compress: true
            });
            let logoSistema = new Image();
            let marcaAgua = new Image();
            logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
            marcaAgua.src = 'public/assets/imagen/logotipos/logo_sapt_trans_300.png';
            let base64Logo = logoSistema;
            let base64MarcaAgua = marcaAgua;
            docImprimir.addImage(base64Logo, 'png', 8,5, 16,16);
            docImprimir.addImage(base64MarcaAgua, 'png', 50,10, 110,110);
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
                    0: {halign: 'left', fillColor: [255, 255, 255], cellWidth: 15} ,
                    1: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 35} ,
                    2: {halign: 'left',fillColor: [255, 255, 255], cellWidth: 50} ,
                    3: {halign: 'left',fillColor: [255, 255, 255], cellWidth: 50} ,
                    4: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 8} ,
                    fontSize: 6,
                },
                tableWidth: 195,
            })
            docImprimir.save('Listado '+idBusqueda+'.pdf');

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
