let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
const estilosReportes = `
    <style>
        @font-face {
            font-family: 'Montserrat';
            src: url('public/assets/estilos/css_frontend/Montserrat/Montserrat-Regular.ttf') format('truetype');
            font-style: normal;
            font-weight: normal;
        }
    </style>
    <img src="public/assets/imagen/logotipos/logo_sapt_trans_300.png" style="position: absolute; margin: 60px 20%; width: 400px; height:400p; z-index:-10;" />
`;
const columnasTabla = `
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
const cabeceraReportes = `
    <tr>
        <td colspan="1" style=""><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:100px; height:100px;"/></td>
        <td colspan="10" style="text-align: center;">
            <div style="text-align: center; font-size: 14px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
            <div style="text-align: center; font-size: 10px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
        </td>
        <td colspan="1" style=""></td>
    </tr>
`;
let mesesName = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try{
        let combosFechas = document.querySelector('#busquedaFechas');
        let hojasCorteAnual = document.querySelector('#hojasCorteAnual');
        let hojasCorteMensual = document.querySelector('#hojasCorteMensual');
        let hojasCorteSemanal = document.querySelector('#hojasCorteSemanal');
        hojasCorteAnual.innerHTML=`
            <div class="mb-2 fuente-12p">En esta sección se obtiene un reporte general del año se recomienda generar cuando haya concluido el año fiscal. (se pueden generar reportes parciales al corte)</div>
            <div class="row">
                <div class="input-group col-md-6 col-12">
                    <select class="custom-select custom-select-sm" id="textAnioCorte" name="textAnioCorte"></select>
                        <div class="input-group-prepend">
                        <button class="btn btn-info btn-sm mb-3" id="botonBusquedaAnioCorte"><i class="fa fa-file-alt"></i> Generar</button>
                    </div>
                </div>
            </div>
            <div class="corte-caja-espacio" id="corteCajaAnual"></div>
            <div id="botonesGenerarAnual"></div>

        `;
        hojasCorteMensual.innerHTML=`
            <div class="mb-2 fuente-12p">En esta sección se obtiene un reporte general del mes se recomienda generar cuando haya concluido el mes. (se pueden generar reportes parciales al corte)</div>
            <div class="row">
                <div class="input-group col-md-10 col-12">
                    <select class="custom-select custom-select-sm" id="textCorteAnioMes" name="textCorteAnioMes"></select>
                    <select class="custom-select custom-select-sm" id="textCorteMeses" name="textCorteMeses"><option value="">---</option></select>
                    <div class="input-group-prepend">
                        <button class="btn btn-info btn-sm mb-3" id="botonBusquedaMesCorte"><i class="fa fa-file-alt"></i> Generar</button>
                    </div>
                </div>
            </div>
            <div class="corte-caja-espacio" id="corteCajaMensual"></div>
            <div id="botonesGenerarMensual"></div>
        `;
        hojasCorteSemanal.innerHTML=`
            <div class="mb-2 fuente-12p">En esta sección se obtiene un reporte general de la semana se recomienda generar cuando haya concluido la semana. (se pueden generar reportes parciales al corte)</div>
            <div class="row">
                <div class="input-group col-md-12 col-12">
                    <select class="custom-select custom-select-sm" id="textCorteAnioSemana" name="textCorteAnioSemana"></select>
                    <select class="custom-select custom-select-sm" id="textCorteMesesSemana" name="textCorteMesesSemana"><option value="">---</option></select>
                    <select class="custom-select custom-select-sm" id="textCorteSemana" name="textCorteSemana"><option value="">---</option></select>
                    <div class="input-group-prepend">
                        <button class="btn btn-info btn-sm mb-3" id="botonBusquedaSemanaCorte"><i class="fa fa-file-alt"></i> Generar</button>
                    </div>
                </div>
            </div>
            <div class="corte-caja-espacio" id="corteCajaSemanal"></div>
            <div id="botonesGenerarSemanal"></div>
        `;
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
        let textAnioCorte = document.querySelector('#textAnioCorte');
        let textCorteAnioMes = document.querySelector('#textCorteAnioMes');
        let textCorteMeses = document.querySelector('#textCorteMeses');
        let textCorteAnioSemana = document.querySelector('#textCorteAnioSemana');
        let textCorteMesesSemana = document.querySelector('#textCorteMesesSemana');
        let textCorteSemana = document.querySelector('#textCorteSemana');
        let textAnioMes = document.querySelector('#textAnioMes');
        let textMeses = document.querySelector('#textMeses');
        let textAnioDia = document.querySelector('#textAnioDia');
        let textMesDia = document.querySelector('#textMesDia');
        let textFecha = document.querySelector('#textFecha');
        llenarComboAnios(textAnioCorte,textCorteAnioMes,textCorteAnioSemana);
        let botonBusquedaAnioCorte = document.querySelector('#botonBusquedaAnioCorte');
        botonBusquedaAnioCorte.addEventListener('click', () => {
            generarCorteAnual(textAnioCorte);
        })
        llenarComboAnioMes(textAnioMes);
        textCorteAnioMes.addEventListener('change', () => {
            llenarComboCorteMeses(textCorteAnioMes,textCorteMeses);
        })
        let botonBusquedaMesCorte = document.querySelector('#botonBusquedaMesCorte');
        botonBusquedaMesCorte.addEventListener('click', () => {
            generarCorteMensual(textCorteMeses);
        })
        textCorteAnioSemana.addEventListener('change', () => {
            llenarComboCorteMesSemana(textCorteAnioSemana,textCorteMesesSemana);
        })
        textCorteMesesSemana.addEventListener('change', () => {
            llenarComboCorteSemana(textCorteMesesSemana,textCorteSemana);
        })
        let botonBusquedaSemanaCorte = document.querySelector('#botonBusquedaSemanaCorte');
        botonBusquedaSemanaCorte.addEventListener('click', () => {
            generarCorteSemanal(textCorteSemana);
        })

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

const llenarComboAnios = async (textAnioCorte,textCorteAnioMes,textCorteAnioSemana) => {
    try{
        fetch('acortecaja/llenarComboAnioMes')
        .then(respRender =>  respRender.json())
        .then(respuestas => {
            textAnioCorte.innerHTML='<option value="">Selecciona Año</option>';
            respuestas.forEach(mesPaga => {
                const iteracion = mesPaga.FMODIF_COBR.split('-');
                const opcionSelect = document.createElement('option');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.setAttribute('value',iteracion[0]);
                opcionSelect.innerHTML='Año '+iteracion[0];
                textAnioCorte.appendChild(opcionSelect);
            });
            textCorteAnioMes.innerHTML='<option value="">Selecciona Año</option>';
            respuestas.forEach(mesPaga => {
                const iteracion = mesPaga.FMODIF_COBR.split('-');
                const opcionSelect = document.createElement('option');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.setAttribute('value',iteracion[0]);
                opcionSelect.innerHTML='Año '+iteracion[0];
                textCorteAnioMes.appendChild(opcionSelect);
            });
            textCorteAnioSemana.innerHTML='<option value="">Selecciona Año</option>';
            respuestas.forEach(mesPaga => {
                const iteracion = mesPaga.FMODIF_COBR.split('-');
                const opcionSelect = document.createElement('option');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.setAttribute('value',iteracion[0]);
                opcionSelect.innerHTML='Año '+iteracion[0];
                textCorteAnioSemana.appendChild(opcionSelect);
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

const llenarComboCorteMeses = async (textCorteAnioMes,textCorteMeses) => {
    try{
        if(textCorteAnioMes.value=='' || textCorteAnioMes.value==null){
            textCorteMeses.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textCorteAnioMes.value;
            fetch(`acortecaja/llenarComboMes/${idBusqueda}`)
            .then(respRender =>  respRender.json())
            .then(respuestas => {
                textCorteMeses.innerHTML='<option value="">Selecciona Mes</option>';
                respuestas.forEach(mesPaga => {
                    const iteracion = mesPaga.FMODIF_COBR.split('-');
                    const opcionSelect = document.createElement('option');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                    opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                    textCorteMeses.appendChild(opcionSelect);
    
                });
                textCorteMeses.focus();
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

const llenarComboCorteMesSemana = async (textCorteAnioSemana,textCorteMesesSemana) => {
    try{
        if(textCorteAnioSemana.value=='' || textCorteAnioSemana.value==null){
            textCorteMesesSemana.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textCorteAnioSemana.value;
            fetch(`acortecaja/llenarComboMes/${idBusqueda}`)
            .then(respRender =>  respRender.json())
            .then(respuestas => {
                textCorteMesesSemana.innerHTML='<option value="">Selecciona Mes</option>';
                respuestas.forEach(mesPaga => {
                    const iteracion = mesPaga.FMODIF_COBR.split('-');
                    const opcionSelect = document.createElement('option');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.setAttribute('value',iteracion[0]+'-'+iteracion[1]);
                    opcionSelect.innerHTML=mesesName[iteracion[1]-1]+' '+iteracion[0];
                    textCorteMesesSemana.appendChild(opcionSelect);
    
                });
                textCorteMesesSemana.focus();
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

const llenarComboCorteSemana = async (textCorteMesesSemana,textCorteSemana) => {
    try{
        if(textCorteMesesSemana.value=='' || textCorteMesesSemana.value==null){
            textCorteSemana.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textCorteMesesSemana.value;
            fetch(`acortecaja/llenarComboSemana/${idBusqueda}`)
            .then(respRender =>  respRender.json())
            .then(respuestas => {
                textCorteSemana.innerHTML='<option value="">Selecciona Mes</option>';
                respuestas.forEach(mesPaga => {
                    const iteracion = mesPaga.SEMANA_COBR.split('-');
                    const opcionSelect = document.createElement('option');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.setAttribute('value',mesPaga.SEMANA_COBR);
                    opcionSelect.innerHTML=iteracion[0]+' Sem '+iteracion[1];
                    textCorteSemana.appendChild(opcionSelect);
    
                });
                textCorteSemana.focus();
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

const generarCorteAnual = async (textAnioCorte) => {
    try {
        let corteCajaAnual = document.querySelector('#corteCajaAnual');
        corteCajaAnual.innerHTML=cargaAnimacion;
        if(textAnioCorte.value=='' || textAnioCorte.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el año a generar',
            })
        }else{
            let idBusqueda = textAnioCorte.value;
            let reporteGenerados = document.querySelector('#reporteGenerados');
            let botonesGenerarAnual = document.querySelector('#botonesGenerarAnual');
            reporteGenerados.innerHTML='';
            botonesGenerarAnual.classList.add('d-none');
            botonesGenerarAnual.innerHTML=`
                <div class="btn-group">
                    <button class="btn btn-success btn-sm" id="botonImprimirAnual"><i class="fa fa-print"></i> Imprimir Informe</button>
                </div>
            `;
            fetch(`acortecaja/listadoGeneraCorte/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                corteCajaAnual.innerHTML='';
                botonesGenerarAnual.classList.remove('d-none');
                let botonImprimirAnual = document.querySelector('#botonImprimirAnual');
                botonImprimirAnual.addEventListener('click', () => {
                    imprimirInformeCorte();
                })
    
                reporteGenerados.innerHTML=estilosReportes;
                const tablaReportes = document.createElement('table');
                tablaReportes.setAttribute('border','0');
                tablaReportes.setAttribute('cellspacing','0');
                tablaReportes.setAttribute('cellpadding','0');
                tablaReportes.setAttribute('style','width: 100%; font-family: Montserrat;');
                const cuerpoTablaReportes = document.createElement('tbody');
                cuerpoTablaReportes.innerHTML=columnasTabla+cabeceraReportes;
                tablaReportes.appendChild(cuerpoTablaReportes);
                reporteGenerados.appendChild(tablaReportes);
                respuestas[0].forEach(corteAnual => {
                    const totalPagos = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(corteAnual.TOTAL);
                    corteCajaAnual.innerHTML=`
                        <div class="bg-dark text-white p-1 text-center">Total Ingresos</div>
                        <div class="row">
                            <div class="col-md-6 col-6 fuente-12p">Ingreso total:</div>
                            <div class="col-md-6 col-6 fuente-14p font-weight-bold">${totalPagos}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-6 fuente-12p">Total Cobros:</div>
                            <div class="col-md-6 col-6 fuente-14p font-weight-bold">${corteAnual.CANTIDAD}</div>
                        </div>
                    `;
                    const tablaContenidoReporte = document.createElement('table');
                    tablaContenidoReporte.setAttribute('border','0');
                    tablaContenidoReporte.setAttribute('cellspacing','0');
                    tablaContenidoReporte.setAttribute('cellpadding','0');
                    tablaContenidoReporte.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaContenidoReporte = document.createElement('tbody');
                    cuerpoTablaContenidoReporte.innerHTML=`
                        ${columnasTabla}
                        <tr>
                            <td colspan="12" style="text-align:center; padding:10px;">Reporte Corte Anual ${textAnioCorte.value}</td>
                        </tr>
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos</td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                            <td colspan="5" style="font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">Total Ingresos en Sistema</td>
                            <td colspan="5" style="font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">${totalPagos}</td>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                            <td colspan="5" style="font-size:14px; text-align:center; border-bottom: 1px solid rgb(20,179,237);">Total Cobros</td>
                            <td colspan="5" style="font-size:18px; font-weight:bold; border-bottom: 1px solid rgb(20,179,237);">${corteAnual.CANTIDAD}</td>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    tablaContenidoReporte.appendChild(cuerpoTablaContenidoReporte);
                    reporteGenerados.appendChild(tablaContenidoReporte);
                })
                const corteCajaAnualSubt = document.createElement('div');
                corteCajaAnualSubt.classList.add('bg-dark','text-white','p-1','text-center');
                corteCajaAnualSubt.innerHTML='Ingresos Metodo de Pago';
                corteCajaAnual.appendChild(corteCajaAnualSubt);
                if(respuestas[2]==null){

                }else{
                    const tablaCorteMetodo = document.createElement('table');
                    tablaCorteMetodo.setAttribute('border','0');
                    tablaCorteMetodo.setAttribute('cellspacing','0');
                    tablaCorteMetodo.setAttribute('cellpadding','0');
                    tablaCorteMetodo.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaCorteMetodo = document.createElement('tbody');
                    cuerpoTablaCorteMetodo.innerHTML=`${columnasTabla}
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos Metodo de pago</td>
                        </tr>                    
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    respuestas[2].forEach(metodos => {
                        const metodoPagoFila = document.createElement('div');
                        metodoPagoFila.classList.add('row');
                        const metodoPagoTag = document.createElement('div');
                        metodoPagoTag.classList.add('col-md-6','col-6','fuente-12p');
                        metodoPagoTag.innerHTML=metodos.DESCRIPCION_METP;
                        const corteMetodoPago = document.createElement('div');
                        corteMetodoPago.classList.add('col-md-6','col-6','fuente-12p','font-weight-bold');
                        const filaMetodoPago = document.createElement('tr');
                        const columnaEspacios = document.createElement('td');
                        columnaEspacios.setAttribute('colspan','1')
                        columnaEspacios.setAttribute('style','font-size:14px; text-align:center;');
                        filaMetodoPago.appendChild(columnaEspacios)
                        const columnaMetodoTag = document.createElement('td');
                        columnaMetodoTag.setAttribute('colspan','5')
                        columnaMetodoTag.setAttribute('style','font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaMetodoTag.innerHTML=metodos.DESCRIPCION_METP;
                        filaMetodoPago.appendChild(columnaMetodoTag);
                        const columnaMetodoTotal = document.createElement('td');
                        columnaMetodoTotal.setAttribute('colspan','5')
                        columnaMetodoTotal.setAttribute('style','font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        respuestas[1].forEach(corteMetodo => {
                            const pagoMetodo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(corteMetodo.TOTAL);
                            if(metodos.CLAVE_METP==corteMetodo.METODO_PAGO){
                                corteMetodoPago.innerHTML=`${pagoMetodo} | Cobros: ${corteMetodo.CANTIDAD}`;
                                columnaMetodoTotal.innerHTML=`${pagoMetodo} | Cobros: ${corteMetodo.CANTIDAD}`;
                            }else{
                                corteMetodoPago.innerHTML='-';
                                columnaMetodoTotal.innerHTML='-';
                            }
                        })
                        metodoPagoFila.appendChild(metodoPagoTag);
                        metodoPagoFila.appendChild(corteMetodoPago);
                        corteCajaAnual.appendChild(metodoPagoFila);
                        filaMetodoPago.appendChild(columnaMetodoTotal);
                        const columnaEspaciosR = document.createElement('td');
                        columnaEspaciosR.setAttribute('colspan','1')
                        columnaEspaciosR.setAttribute('style','font-size:14px; text-align:center;');
                        filaMetodoPago.appendChild(columnaEspaciosR)
                        cuerpoTablaCorteMetodo.appendChild(filaMetodoPago)
                    })
                    tablaCorteMetodo.appendChild(cuerpoTablaCorteMetodo);
                    reporteGenerados.appendChild(tablaCorteMetodo);
                }
                const corteCajaAnualSubta = document.createElement('div');
                corteCajaAnualSubta.classList.add('bg-dark','text-white','p-1','text-center');
                corteCajaAnualSubta.innerHTML='Ingresos Concepto de Pago';
                corteCajaAnual.appendChild(corteCajaAnualSubta);

                if(respuestas[3]==null){

                }else{
                    const tablaCorteConcepto = document.createElement('table');
                    tablaCorteConcepto.setAttribute('border','0');
                    tablaCorteConcepto.setAttribute('cellspacing','0');
                    tablaCorteConcepto.setAttribute('cellpadding','0');
                    tablaCorteConcepto.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaCorteConcepto = document.createElement('tbody');
                    cuerpoTablaCorteConcepto.innerHTML=`${columnasTabla}
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos Conceptos de pago</td>
                        </tr>                    
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    respuestas[3].forEach(conceptosPago => {
                        const pagoMetodo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(conceptosPago.PAGOS);
                        const metodoConceptoFila = document.createElement('div');
                        metodoConceptoFila.classList.add('row');
                        const metodoConceptoTag = document.createElement('div');
                        metodoConceptoTag.classList.add('col-md-6','col-6','fuente-12p');
                        metodoConceptoTag.innerHTML=conceptosPago.CLASIFIC_CONC;
                        const corteMetodoConcepto = document.createElement('div');
                        corteMetodoConcepto.classList.add('col-md-6','col-6','fuente-12p','font-weight-bold');
                        corteMetodoConcepto.innerHTML=pagoMetodo;
                        metodoConceptoFila.appendChild(metodoConceptoTag);
                        metodoConceptoFila.appendChild(corteMetodoConcepto);
                        corteCajaAnual.appendChild(metodoConceptoFila);
                        const filaConceptoPago = document.createElement('tr');
                        const columnaEspacios = document.createElement('td');
                        columnaEspacios.setAttribute('colspan','1')
                        columnaEspacios.setAttribute('style','font-size:14px; text-align:center;');
                        filaConceptoPago.appendChild(columnaEspacios)
                        const columnaConceptoTag = document.createElement('td');
                        columnaConceptoTag.setAttribute('colspan','5')
                        columnaConceptoTag.setAttribute('style','font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaConceptoTag.innerHTML=conceptosPago.CLASIFIC_CONC;
                        filaConceptoPago.appendChild(columnaConceptoTag);
                        const columnaConceptoTotal = document.createElement('td');
                        columnaConceptoTotal.setAttribute('colspan','5')
                        columnaConceptoTotal.setAttribute('style','font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaConceptoTotal.innerHTML=pagoMetodo;
                        filaConceptoPago.appendChild(columnaConceptoTotal);
                        const columnaEspaciosR = document.createElement('td');
                        columnaEspaciosR.setAttribute('colspan','1')
                        columnaEspaciosR.setAttribute('style','font-size:14px; text-align:center;');
                        filaConceptoPago.appendChild(columnaEspaciosR)
                        cuerpoTablaCorteConcepto.appendChild(filaConceptoPago)
                    })
                    tablaCorteConcepto.appendChild(cuerpoTablaCorteConcepto);
                    reporteGenerados.appendChild(tablaCorteConcepto);

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

const generarCorteMensual = async (textCorteMeses) => {
    try {
        let corteCajaMensual = document.querySelector('#corteCajaMensual');
        corteCajaMensual.innerHTML=cargaAnimacion;
        if(textCorteMeses.value=='' || textCorteMeses.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el mes a generar',
            })
        }else{
            let idBusqueda = textCorteMeses.value;
            let reporteGenerados = document.querySelector('#reporteGenerados');
            let botonesGenerarMensual = document.querySelector('#botonesGenerarMensual');
            reporteGenerados.innerHTML='';
            botonesGenerarMensual.classList.add('d-none');
            botonesGenerarMensual.innerHTML=`
                <div class="btn-group">
                    <button class="btn btn-success btn-sm" id="botonImprimirMensual"><i class="fa fa-print"></i> Imprimir Informe</button>
                </div>
            `;
            fetch(`acortecaja/listadoGeneraCorte/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                corteCajaMensual.innerHTML='';
                botonesGenerarMensual.classList.remove('d-none');
                let botonImprimirMensual = document.querySelector('#botonImprimirMensual');
                botonImprimirMensual.addEventListener('click', () => {
                    imprimirInformeCorte();
                })
    
                reporteGenerados.innerHTML=estilosReportes;
                const tablaReportes = document.createElement('table');
                tablaReportes.setAttribute('border','0');
                tablaReportes.setAttribute('cellspacing','0');
                tablaReportes.setAttribute('cellpadding','0');
                tablaReportes.setAttribute('style','width: 100%; font-family: Montserrat;');
                const cuerpoTablaReportes = document.createElement('tbody');
                cuerpoTablaReportes.innerHTML=columnasTabla+cabeceraReportes;
                tablaReportes.appendChild(cuerpoTablaReportes);
                reporteGenerados.appendChild(tablaReportes);
                respuestas[0].forEach(corteAnual => {
                    const totalPagos = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(corteAnual.TOTAL);
                    corteCajaMensual.innerHTML=`
                        <div class="bg-dark text-white p-1 text-center">Total Ingresos</div>
                        <div class="row">
                            <div class="col-md-6 col-6 fuente-12p">Ingreso total:</div>
                            <div class="col-md-6 col-6 fuente-14p font-weight-bold">${totalPagos}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-6 fuente-12p">Total Cobros:</div>
                            <div class="col-md-6 col-6 fuente-14p font-weight-bold">${corteAnual.CANTIDAD}</div>
                        </div>
                    `;
                    const tablaContenidoReporte = document.createElement('table');
                    tablaContenidoReporte.setAttribute('border','0');
                    tablaContenidoReporte.setAttribute('cellspacing','0');
                    tablaContenidoReporte.setAttribute('cellpadding','0');
                    tablaContenidoReporte.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaContenidoReporte = document.createElement('tbody');
                    cuerpoTablaContenidoReporte.innerHTML=`
                        ${columnasTabla}
                        <tr>
                            <td colspan="12" style="text-align:center; padding:10px;">Reporte Corte Anual ${textAnioCorte.value}</td>
                        </tr>
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos</td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                            <td colspan="5" style="font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">Total Ingresos en Sistema</td>
                            <td colspan="5" style="font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">${totalPagos}</td>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                            <td colspan="5" style="font-size:14px; text-align:center; border-bottom: 1px solid rgb(20,179,237);">Total Cobros</td>
                            <td colspan="5" style="font-size:18px; font-weight:bold; border-bottom: 1px solid rgb(20,179,237);">${corteAnual.CANTIDAD}</td>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    tablaContenidoReporte.appendChild(cuerpoTablaContenidoReporte);
                    reporteGenerados.appendChild(tablaContenidoReporte);
                })
                const corteInformeSubta = document.createElement('div');
                corteInformeSubta.classList.add('bg-dark','text-white','p-1','text-center');
                corteInformeSubta.innerHTML='Ingresos Metodo de Pago';
                corteCajaMensual.appendChild(corteInformeSubta);
                if(respuestas[2]==null){

                }else{
                    const tablaCorteMetodo = document.createElement('table');
                    tablaCorteMetodo.setAttribute('border','0');
                    tablaCorteMetodo.setAttribute('cellspacing','0');
                    tablaCorteMetodo.setAttribute('cellpadding','0');
                    tablaCorteMetodo.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaCorteMetodo = document.createElement('tbody');
                    cuerpoTablaCorteMetodo.innerHTML=`${columnasTabla}
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos Metodo de pago</td>
                        </tr>                    
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    respuestas[2].forEach(metodos => {
                        const metodoPagoFila = document.createElement('div');
                        metodoPagoFila.classList.add('row');
                        const metodoPagoTag = document.createElement('div');
                        metodoPagoTag.classList.add('col-md-6','col-6','fuente-12p');
                        metodoPagoTag.innerHTML=metodos.DESCRIPCION_METP;
                        const corteMetodoPago = document.createElement('div');
                        corteMetodoPago.classList.add('col-md-6','col-6','fuente-12p','font-weight-bold');
                        const filaMetodoPago = document.createElement('tr');
                        const columnaEspacios = document.createElement('td');
                        columnaEspacios.setAttribute('colspan','1')
                        columnaEspacios.setAttribute('style','font-size:14px; text-align:center;');
                        filaMetodoPago.appendChild(columnaEspacios)
                        const columnaMetodoTag = document.createElement('td');
                        columnaMetodoTag.setAttribute('colspan','5')
                        columnaMetodoTag.setAttribute('style','font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaMetodoTag.innerHTML=metodos.DESCRIPCION_METP;
                        filaMetodoPago.appendChild(columnaMetodoTag);
                        const columnaMetodoTotal = document.createElement('td');
                        columnaMetodoTotal.setAttribute('colspan','5')
                        columnaMetodoTotal.setAttribute('style','font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        respuestas[1].forEach(corteMetodo => {
                            const pagoMetodo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(corteMetodo.TOTAL);
                            if(metodos.CLAVE_METP==corteMetodo.METODO_PAGO){
                                corteMetodoPago.innerHTML=`${pagoMetodo} | Cobros: ${corteMetodo.CANTIDAD}`;
                                columnaMetodoTotal.innerHTML=`${pagoMetodo} | Cobros: ${corteMetodo.CANTIDAD}`;
                            }else{
                                corteMetodoPago.innerHTML='-';
                                columnaMetodoTotal.innerHTML='-';
                            }
                        })
                        metodoPagoFila.appendChild(metodoPagoTag);
                        metodoPagoFila.appendChild(corteMetodoPago);
                        corteCajaMensual.appendChild(metodoPagoFila);
                        filaMetodoPago.appendChild(columnaMetodoTotal);
                        const columnaEspaciosR = document.createElement('td');
                        columnaEspaciosR.setAttribute('colspan','1')
                        columnaEspaciosR.setAttribute('style','font-size:14px; text-align:center;');
                        filaMetodoPago.appendChild(columnaEspaciosR)
                        cuerpoTablaCorteMetodo.appendChild(filaMetodoPago)
                    })
                    tablaCorteMetodo.appendChild(cuerpoTablaCorteMetodo);
                    reporteGenerados.appendChild(tablaCorteMetodo);
                }
                const corteInformeSubtb = document.createElement('div');
                corteInformeSubtb.classList.add('bg-dark','text-white','p-1','text-center');
                corteInformeSubtb.innerHTML='Ingresos Concepto de Pago';
                corteCajaMensual.appendChild(corteInformeSubtb);

                if(respuestas[3]==null){

                }else{
                    const tablaCorteConcepto = document.createElement('table');
                    tablaCorteConcepto.setAttribute('border','0');
                    tablaCorteConcepto.setAttribute('cellspacing','0');
                    tablaCorteConcepto.setAttribute('cellpadding','0');
                    tablaCorteConcepto.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaCorteConcepto = document.createElement('tbody');
                    cuerpoTablaCorteConcepto.innerHTML=`${columnasTabla}
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos Conceptos de pago</td>
                        </tr>                    
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    respuestas[3].forEach(conceptosPago => {
                        const pagoMetodo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(conceptosPago.PAGOS);
                        const metodoConceptoFila = document.createElement('div');
                        metodoConceptoFila.classList.add('row');
                        const metodoConceptoTag = document.createElement('div');
                        metodoConceptoTag.classList.add('col-md-6','col-6','fuente-12p');
                        metodoConceptoTag.innerHTML=conceptosPago.CLASIFIC_CONC;
                        const corteMetodoConcepto = document.createElement('div');
                        corteMetodoConcepto.classList.add('col-md-6','col-6','fuente-12p','font-weight-bold');
                        corteMetodoConcepto.innerHTML=pagoMetodo;
                        metodoConceptoFila.appendChild(metodoConceptoTag);
                        metodoConceptoFila.appendChild(corteMetodoConcepto);
                        corteCajaMensual.appendChild(metodoConceptoFila);
                        const filaConceptoPago = document.createElement('tr');
                        const columnaEspacios = document.createElement('td');
                        columnaEspacios.setAttribute('colspan','1')
                        columnaEspacios.setAttribute('style','font-size:14px; text-align:center;');
                        filaConceptoPago.appendChild(columnaEspacios)
                        const columnaConceptoTag = document.createElement('td');
                        columnaConceptoTag.setAttribute('colspan','5')
                        columnaConceptoTag.setAttribute('style','font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaConceptoTag.innerHTML=conceptosPago.CLASIFIC_CONC;
                        filaConceptoPago.appendChild(columnaConceptoTag);
                        const columnaConceptoTotal = document.createElement('td');
                        columnaConceptoTotal.setAttribute('colspan','5')
                        columnaConceptoTotal.setAttribute('style','font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaConceptoTotal.innerHTML=pagoMetodo;
                        filaConceptoPago.appendChild(columnaConceptoTotal);
                        const columnaEspaciosR = document.createElement('td');
                        columnaEspaciosR.setAttribute('colspan','1')
                        columnaEspaciosR.setAttribute('style','font-size:14px; text-align:center;');
                        filaConceptoPago.appendChild(columnaEspaciosR)
                        cuerpoTablaCorteConcepto.appendChild(filaConceptoPago)
                    })
                    tablaCorteConcepto.appendChild(cuerpoTablaCorteConcepto);
                    reporteGenerados.appendChild(tablaCorteConcepto);

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

const generarCorteSemanal = async (textCorteSemana) => {
    try {
        let corteCajaSemanal = document.querySelector('#corteCajaSemanal');
        corteCajaSemanal.innerHTML=cargaAnimacion;
        if(textCorteSemana.value=='' || textCorteSemana.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el mes a generar',
            })
        }else{
            let idBusqueda = textCorteSemana.value;
            let reporteGenerados = document.querySelector('#reporteGenerados');
            let botonesGenerarSemanal = document.querySelector('#botonesGenerarSemanal');
            reporteGenerados.innerHTML='';
            botonesGenerarSemanal.classList.add('d-none');
            botonesGenerarSemanal.innerHTML=`
                <div class="btn-group">
                    <button class="btn btn-success btn-sm" id="botonImprimirMensual"><i class="fa fa-print"></i> Imprimir Informe</button>
                </div>
            `;
            fetch(`acortecaja/listadoGeneraCorteSem/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                corteCajaSemanal.innerHTML='';
                botonesGenerarSemanal.classList.remove('d-none');
                let botonImprimirMensual = document.querySelector('#botonImprimirMensual');
                botonImprimirMensual.addEventListener('click', () => {
                    imprimirInformeCorte();
                })
    
                reporteGenerados.innerHTML=estilosReportes;
                const tablaReportes = document.createElement('table');
                tablaReportes.setAttribute('border','0');
                tablaReportes.setAttribute('cellspacing','0');
                tablaReportes.setAttribute('cellpadding','0');
                tablaReportes.setAttribute('style','width: 100%; font-family: Montserrat;');
                const cuerpoTablaReportes = document.createElement('tbody');
                cuerpoTablaReportes.innerHTML=columnasTabla+cabeceraReportes;
                tablaReportes.appendChild(cuerpoTablaReportes);
                reporteGenerados.appendChild(tablaReportes);
                respuestas[0].forEach(corteAnual => {
                    const totalPagos = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(corteAnual.TOTAL);
                    corteCajaSemanal.innerHTML=`
                        <div class="bg-dark text-white p-1 text-center">Total Ingresos</div>
                        <div class="row">
                            <div class="col-md-6 col-6 fuente-12p">Ingreso total:</div>
                            <div class="col-md-6 col-6 fuente-14p font-weight-bold">${totalPagos}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-6 fuente-12p">Total Cobros:</div>
                            <div class="col-md-6 col-6 fuente-14p font-weight-bold">${corteAnual.CANTIDAD}</div>
                        </div>
                    `;
                    const tablaContenidoReporte = document.createElement('table');
                    tablaContenidoReporte.setAttribute('border','0');
                    tablaContenidoReporte.setAttribute('cellspacing','0');
                    tablaContenidoReporte.setAttribute('cellpadding','0');
                    tablaContenidoReporte.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaContenidoReporte = document.createElement('tbody');
                    cuerpoTablaContenidoReporte.innerHTML=`
                        ${columnasTabla}
                        <tr>
                            <td colspan="12" style="text-align:center; padding:10px;">Reporte Corte Anual ${textAnioCorte.value}</td>
                        </tr>
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos</td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                            <td colspan="5" style="font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">Total Ingresos en Sistema</td>
                            <td colspan="5" style="font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);">${totalPagos}</td>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                            <td colspan="5" style="font-size:14px; text-align:center; border-bottom: 1px solid rgb(20,179,237);">Total Cobros</td>
                            <td colspan="5" style="font-size:18px; font-weight:bold; border-bottom: 1px solid rgb(20,179,237);">${corteAnual.CANTIDAD}</td>
                            <td colspan="1" style="font-size:14px; text-align:center;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    tablaContenidoReporte.appendChild(cuerpoTablaContenidoReporte);
                    reporteGenerados.appendChild(tablaContenidoReporte);
                })
                const corteInformeSubta = document.createElement('div');
                corteInformeSubta.classList.add('bg-dark','text-white','p-1','text-center');
                corteInformeSubta.innerHTML='Ingresos Metodo de Pago';
                corteCajaSemanal.appendChild(corteInformeSubta);
                if(respuestas[2]==null){

                }else{
                    const tablaCorteMetodo = document.createElement('table');
                    tablaCorteMetodo.setAttribute('border','0');
                    tablaCorteMetodo.setAttribute('cellspacing','0');
                    tablaCorteMetodo.setAttribute('cellpadding','0');
                    tablaCorteMetodo.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaCorteMetodo = document.createElement('tbody');
                    cuerpoTablaCorteMetodo.innerHTML=`${columnasTabla}
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos Metodo de pago</td>
                        </tr>                    
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    respuestas[2].forEach(metodos => {
                        const metodoPagoFila = document.createElement('div');
                        metodoPagoFila.classList.add('row');
                        const metodoPagoTag = document.createElement('div');
                        metodoPagoTag.classList.add('col-md-6','col-6','fuente-12p');
                        metodoPagoTag.innerHTML=metodos.DESCRIPCION_METP;
                        const corteMetodoPago = document.createElement('div');
                        corteMetodoPago.classList.add('col-md-6','col-6','fuente-12p','font-weight-bold');
                        const filaMetodoPago = document.createElement('tr');
                        const columnaEspacios = document.createElement('td');
                        columnaEspacios.setAttribute('colspan','1')
                        columnaEspacios.setAttribute('style','font-size:14px; text-align:center;');
                        filaMetodoPago.appendChild(columnaEspacios)
                        const columnaMetodoTag = document.createElement('td');
                        columnaMetodoTag.setAttribute('colspan','5')
                        columnaMetodoTag.setAttribute('style','font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaMetodoTag.innerHTML=metodos.DESCRIPCION_METP;
                        filaMetodoPago.appendChild(columnaMetodoTag);
                        const columnaMetodoTotal = document.createElement('td');
                        columnaMetodoTotal.setAttribute('colspan','5')
                        columnaMetodoTotal.setAttribute('style','font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        respuestas[1].forEach(corteMetodo => {
                            const pagoMetodo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(corteMetodo.TOTAL);
                            if(metodos.CLAVE_METP==corteMetodo.METODO_PAGO){
                                corteMetodoPago.innerHTML=`${pagoMetodo} | Cobros: ${corteMetodo.CANTIDAD}`;
                                columnaMetodoTotal.innerHTML=`${pagoMetodo} | Cobros: ${corteMetodo.CANTIDAD}`;
                            }else{
                                corteMetodoPago.innerHTML='-';
                                columnaMetodoTotal.innerHTML='-';
                            }
                        })
                        metodoPagoFila.appendChild(metodoPagoTag);
                        metodoPagoFila.appendChild(corteMetodoPago);
                        corteCajaSemanal.appendChild(metodoPagoFila);
                        filaMetodoPago.appendChild(columnaMetodoTotal);
                        const columnaEspaciosR = document.createElement('td');
                        columnaEspaciosR.setAttribute('colspan','1')
                        columnaEspaciosR.setAttribute('style','font-size:14px; text-align:center;');
                        filaMetodoPago.appendChild(columnaEspaciosR)
                        cuerpoTablaCorteMetodo.appendChild(filaMetodoPago)
                    })
                    tablaCorteMetodo.appendChild(cuerpoTablaCorteMetodo);
                    reporteGenerados.appendChild(tablaCorteMetodo);
                }
                const corteInformeSubtb = document.createElement('div');
                corteInformeSubtb.classList.add('bg-dark','text-white','p-1','text-center');
                corteInformeSubtb.innerHTML='Ingresos Concepto de Pago';
                corteCajaSemanal.appendChild(corteInformeSubtb);

                if(respuestas[3]==null){

                }else{
                    const tablaCorteConcepto = document.createElement('table');
                    tablaCorteConcepto.setAttribute('border','0');
                    tablaCorteConcepto.setAttribute('cellspacing','0');
                    tablaCorteConcepto.setAttribute('cellpadding','0');
                    tablaCorteConcepto.setAttribute('style','width: 100%; font-family: Montserrat;');
                    const cuerpoTablaCorteConcepto = document.createElement('tbody');
                    cuerpoTablaCorteConcepto.innerHTML=`${columnasTabla}
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="background-color: rgb(46,46,46); text-align:center; color:#FFF;">Total Ingresos Conceptos de pago</td>
                        </tr>                    
                        <tr>
                            <td colspan="12" style="padding:2px; text-align:center; color:#FFF;"></td>
                        </tr>
                    `;
                    respuestas[3].forEach(conceptosPago => {
                        const pagoMetodo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(conceptosPago.PAGOS);
                        const metodoConceptoFila = document.createElement('div');
                        metodoConceptoFila.classList.add('row');
                        const metodoConceptoTag = document.createElement('div');
                        metodoConceptoTag.classList.add('col-md-6','col-6','fuente-12p');
                        metodoConceptoTag.innerHTML=conceptosPago.CLASIFIC_CONC;
                        const corteMetodoConcepto = document.createElement('div');
                        corteMetodoConcepto.classList.add('col-md-6','col-6','fuente-12p','font-weight-bold');
                        corteMetodoConcepto.innerHTML=pagoMetodo;
                        metodoConceptoFila.appendChild(metodoConceptoTag);
                        metodoConceptoFila.appendChild(corteMetodoConcepto);
                        corteCajaSemanal.appendChild(metodoConceptoFila);
                        const filaConceptoPago = document.createElement('tr');
                        const columnaEspacios = document.createElement('td');
                        columnaEspacios.setAttribute('colspan','1')
                        columnaEspacios.setAttribute('style','font-size:14px; text-align:center;');
                        filaConceptoPago.appendChild(columnaEspacios)
                        const columnaConceptoTag = document.createElement('td');
                        columnaConceptoTag.setAttribute('colspan','5')
                        columnaConceptoTag.setAttribute('style','font-size:14px; text-align:center; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaConceptoTag.innerHTML=conceptosPago.CLASIFIC_CONC;
                        filaConceptoPago.appendChild(columnaConceptoTag);
                        const columnaConceptoTotal = document.createElement('td');
                        columnaConceptoTotal.setAttribute('colspan','5')
                        columnaConceptoTotal.setAttribute('style','font-size:18px; font-weight:bold; border-top: 1px solid rgb(20,179,237); border-bottom: 1px solid rgb(20,179,237);');
                        columnaConceptoTotal.innerHTML=pagoMetodo;
                        filaConceptoPago.appendChild(columnaConceptoTotal);
                        const columnaEspaciosR = document.createElement('td');
                        columnaEspaciosR.setAttribute('colspan','1')
                        columnaEspaciosR.setAttribute('style','font-size:14px; text-align:center;');
                        filaConceptoPago.appendChild(columnaEspaciosR)
                        cuerpoTablaCorteConcepto.appendChild(filaConceptoPago)
                    })
                    tablaCorteConcepto.appendChild(cuerpoTablaCorteConcepto);
                    reporteGenerados.appendChild(tablaCorteConcepto);

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

const imprimirInformeCorte = async () => {
    try {
        let reporteGenerados = document.querySelector('#reporteGenerados');
        let ventImpri = window.open('', 'popimpr');
        ventImpri.document.write(reporteGenerados.innerHTML);
        ventImpri.document.close();
        ventImpri.print();
        ventImpri.close();

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
                    <td>${parseFloat(folios.TOTAL_COBR).toFixed(2)}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaFolios);
            })
            respuestas[1].forEach(totales => {
                const filaTotal = document.createElement('tr');
                filaTotal.innerHTML=`
                <td colspan="4">Gran Total</td>
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
                    <td>${parseFloat(folios.TOTAL_COBR).toFixed(2)}</td>
                `;
                tablaFoliosCuerpo.appendChild(filaFolios);
            })
            tablaExportadora.appendChild(tablaFoliosCuerpo);
            respuestas[1].forEach(totales => {
                const filaTotal = document.createElement('tr');
                filaTotal.innerHTML=`
                <td colspan="4">Gran Total</td>
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
                    4: {halign: 'center',fillColor: [255, 255, 255], cellWidth: 13} ,
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



