let avanceProgresoCargos = document.querySelector('#avanceProgresoCargos');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
document.addEventListener('DOMContentLoaded', () => {
    plantillaSelector();
})

const plantillaSelector = async () => {
    try {
        let inicialRecargosUsuarios = document.querySelector('#inicialRecargosUsuarios');
        inicialRecargosUsuarios.innerHTML=`
            <div class="form-group">
                <input type="hidden" id="textCaptura" name="textCaptura" value="">
                <button class="btn btn-sm btn-info" id="botonIniciar">Crear Recargos</button>
            </div>
            <div id="grupoProgreso"></div>
        `;
        let botonIniciar = document.querySelector('#botonIniciar');
        botonIniciar.addEventListener('click', () => {
            contratosMesActivos();
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

const contratosMesActivos = async () => {
    try {
        let grupoProgreso = document.querySelector('#grupoProgreso');
        let textCaptura = document.querySelector('#textCaptura');
        grupoProgreso.innerHTML=cargaAnimacion;
        fetch('acobros/buscarContratosActivos')
        .then(respRender => respRender.json())
        .then(respuestas => {
            grupoProgreso.innerHTML='<div class="text-justify mb-2">Se detectaron los siguientes contratos a los que se les aplicará un cargo del mes corriente.</div>';
            if(respuestas.estatus=='error' || respuestas==null){
            }else{
                textCaptura.value=respuestas[0];
                respuestas[1].forEach(tarifas => {
                    const infoGrupoContratos = document.createElement('div');
                    infoGrupoContratos.classList.add('input-group','mb-2');
                    const infoInputContratos = document.createElement('div');
                    infoInputContratos.classList.add('form-control','form-control-sm');
                    infoInputContratos.innerHTML=`Contratos activos ${tarifas.DESCRIPCION_CTARI} <strong>${tarifas.TOTALES}</strong>`;
                    const infoGrupoAppend = document.createElement('div');
                    infoGrupoAppend.classList.add('input-group-append');
                    const botonProcesoCreaCargos = document.createElement('button');
                    botonProcesoCreaCargos.setAttribute('datacrea',respuestas[0]+'_'+tarifas.DESCUENTO_CCONT)
                    botonProcesoCreaCargos.classList.add('btn','btn-sm','btn-warning');
                    botonProcesoCreaCargos.innerHTML=`Cargos ${tarifas.DESCRIPCION_CTARI}`;
                    infoGrupoAppend.appendChild(botonProcesoCreaCargos);
                    infoGrupoContratos.appendChild(infoInputContratos);
                    infoGrupoContratos.appendChild(infoGrupoAppend);
                    grupoProgreso.appendChild(infoGrupoContratos);
                    botonProcesoCreaCargos.addEventListener('click', () => {
                        iniciarProcesoRecargos(botonProcesoCreaCargos);
                    })
    
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

const iniciarProcesoRecargos = async (botonProcesoCreaCargos) => {
    try {
        return Swal.fire({
            title: 'Recargos',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, Crear',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea iniciar el proceso de crear recargos?',
        })
        .then((result) => {
            if(result.isConfirmed){
                let captura = botonProcesoCreaCargos.attributes.datacrea.value;
                let textRedaccion = botonProcesoCreaCargos.innerHTML;
                let avisoModificadoUser = document.querySelector('#avisoModificadoUser');
                let inicialRecargosUsuarios = document.querySelector('#inicialRecargosUsuarios');
                let avanceProgresoRecargos = document.querySelector('#avanceProgresoRecargos');
                avisoModificadoUser.innerHTML=cargaAnimacion;
                avisoModificadoUser.classList.remove('alert-warning','alert-success');
                fetch(`acobros/arregloContratosTotales/${captura}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error' || respuestas==null){
                    }else{
                        let totalContratos = respuestas[0].length;
                        avanceProgresoRecargos.classList.remove('d-none');
                        const barraProgreso = document.createElement('div');
                        barraProgreso.classList.add('progress','mb-2');
                        barraProgreso.innerHTML=`
                            <div class="progress-bar progress-bar-striped bg-success text-center progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0% ${textRedaccion} creados</div>
                        `;
                        avanceProgresoRecargos.appendChild(barraProgreso);
                        if(totalContratos>0){
                            for (let contador = 0; contador < totalContratos; contador++) {
                                let avanceProgressBar = (((contador+1) / totalContratos)*100).toFixed(0);
                                const idUsuarioA = respuestas[0][contador];
                                fetch(`acrearecargo/agregandoRecargos/${captura}_${idUsuarioA}`)
                                .then(respRenderA => respRenderA.json())
                                .then(respuestas0 => {
                                    if(respuestas0==null || respuestas0.estatus=='error'){
                                    }else {
                                        barraProgreso.innerHTML=`
                                            <div class="progress-bar progress-bar-striped bg-success text-center progress-bar-animated" role="progressbar" style="width: ${avanceProgressBar}%" aria-valuenow="${avanceProgressBar}" aria-valuemin="0" aria-valuemax="100">${avanceProgressBar}% ${textRedaccion} creados</div>
                                        `;
                                    }

                                })
                            }
                        }
                        fetch(`acrearecargo/mostrarResumenRecargos`)
                        .then(respRenderB => respRenderB.json())
                        .then(respuestas1 => {
                            avisoModificadoUser.innerHTML='';
                            if(respuestas1==null || respuestas1.estatus=='error'){
                                avisoModificadoUser.classList.add('alert','alert-warning');
                                const filaResumen = document.createElement('div');
                                filaResumen.innerHTML=`No se generaron cargas para ningun tipo de tarifa todos estaban aplicados.`;
                                avisoModificadoUser.appendChild(filaResumen);
                            }else{
                                avisoModificadoUser.classList.add('alert','alert-success');
                                respuestas1.forEach(resumen => {
                                    const filaResumen = document.createElement('div');
                                    filaResumen.innerHTML=`<i class="fas fa-check"></i> ${resumen.DESCRIPCION_CTARI}: ${resumen.CREADOS} con un monto de $${parseFloat(resumen.PORPAGAR)}.`;
                                    avisoModificadoUser.appendChild(filaResumen);
                                })
                            }
                            const botonResetear = document.createElement('button');
                            botonResetear.classList.add('btn','btn-sm','btn-secondary');
                            botonResetear.innerHTML='Generar nuevos cargos';
                            botonResetear.addEventListener('click', () => {
                                inicialRecargosUsuarios.innerHTML='';
                                avanceProgresoRecargos.innerHTML='';
                                avisoModificadoUser.innerHTML='';
                                avisoModificadoUser.classList.remove('alert','alert-success','alert-warning');
                                plantillaSelector();
                            })
                            avisoModificadoUser.appendChild(botonResetear);
                        })
                    }
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
