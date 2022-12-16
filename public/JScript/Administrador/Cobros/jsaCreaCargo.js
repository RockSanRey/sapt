let avanceProgresoCargos = document.querySelector('#avanceProgresoCargos');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
document.addEventListener('DOMContentLoaded', () => {
    plantillaSelector();
    // arregloUsuarios();
})

const plantillaSelector = async () => {
    try{
        let inicialCargosUsuarios = document.querySelector('#inicialCargosUsuarios');
        inicialCargosUsuarios.innerHTML=`
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <input type="hidden" id="textCaptura" name="textCaptura" value="">
                        <button class="btn btn-sm btn-info" id="botonIniciarActual">Cargar mes Corriente</button>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group mb-3">
                        <select class="custom-select custom-select-sm" id="textMes" name="textMes"></select>
                        <div class="input-group-append">
                            <button class="btn btn-sm btn-info" id="botonIniciarMes">Cargar mes Seleccionado</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="grupoProgreso"></div>
        `
        let textMes = document.querySelector('#textMes');
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        anio = new Date().getFullYear();
        textMes.innerHTML='<option value="">Mes Cargo</option>'
        for(let contero = 0; contero < 12; contero++){
            const opcionInput = document.createElement('option');
            opcionInput.setAttribute('value',anio+String(contero+1).padStart(2,'0'));
            opcionInput.innerHTML=anio+' '+meses[contero];
            textMes.appendChild(opcionInput);
        }
        let botonIniciarActual = document.querySelector('#botonIniciarActual');
        botonIniciarActual.addEventListener('click', () => {
            contratosMesCorriente();
        })
        let botonIniciarMes = document.querySelector('#botonIniciarMes');
        botonIniciarMes.addEventListener('click', () => {
            if(validarMes()){
                contratosMesCorriente();
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

const contratosMesCorriente = async () => {
    try {
        let grupoProgreso = document.querySelector('#grupoProgreso');
        let textCaptura = document.querySelector('#textCaptura');
        grupoProgreso.innerHTML=cargaAnimacion;
        fetch('acreacargo/buscarUsuariosTotal')
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
                    botonProcesoCreaCargos.classList.add('btn','btn-sm','btn-success');
                    botonProcesoCreaCargos.innerHTML=`Cargos ${tarifas.DESCRIPCION_CTARI}`;
                    infoGrupoAppend.appendChild(botonProcesoCreaCargos);
                    infoGrupoContratos.appendChild(infoInputContratos);
                    infoGrupoContratos.appendChild(infoGrupoAppend);
                    grupoProgreso.appendChild(infoGrupoContratos);
                    botonProcesoCreaCargos.addEventListener('click', () => {
                        iniciarProcesoCargos(botonProcesoCreaCargos);
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

const iniciarProcesoCargos = async (botonProcesoCreaCargos) => {
    try {
        return Swal.fire({
            title: 'Cargos',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, Crear',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea iniciar el proceso de crear Cargos Mes corriente?',
        })
        .then((result) => {
            if(result.isConfirmed){
                let captura = botonProcesoCreaCargos.attributes.datacrea.value;
                let textCaptura = botonProcesoCreaCargos.innerHTML;
                let avisoModificadoUser = document.querySelector('#avisoModificadoUser');
                let inicialCargosUsuarios = document.querySelector('#inicialCargosUsuarios');
                let avanceProgresoCargos = document.querySelector('#avanceProgresoCargos');
                avisoModificadoUser.innerHTML=cargaAnimacion;
                avisoModificadoUser.classList.remove('alert-warning','alert-success');
                fetch(`acreacargo/verificarMesCorriente/${captura}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    let textMes = document.querySelector('#textMes');
                    if(respuestas.estatus=='error' || respuestas==null){
                    }else{
                        let totalContratos = respuestas[0].length;
                        avanceProgresoCargos.classList.remove('d-none');
                        const barraProgreso = document.createElement('div');
                        barraProgreso.classList.add('progress','mb-2');
                        barraProgreso.innerHTML=`
                            <div class="progress-bar progress-bar-striped bg-success text-center progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0% ${textCaptura} creados</div>
                        `;
                        avanceProgresoCargos.appendChild(barraProgreso);
                        if(textMes.value==''||textMes.value==null){
                            if(totalContratos>0){
                                for (let contador = 0; contador < totalContratos; contador++) {
                                    let avanceProgressBar = (((contador+1) / totalContratos)*100).toFixed(0);
                                    const idUsuarioA = respuestas[0][contador];
                                    fetch(`acreacargo/agregandoCargos/${captura}_${idUsuarioA}`)
                                    .then(respRenderA => respRenderA.json())
                                    .then(respuestas0 => {
                                        if(respuestas0==null || respuestas0.estatus=='error'){
                                        }else {
                                            barraProgreso.innerHTML=`
                                                <div class="progress-bar progress-bar-striped bg-success text-center progress-bar-animated" role="progressbar" style="width: ${avanceProgressBar}%" aria-valuenow="${avanceProgressBar}" aria-valuemin="0" aria-valuemax="100">${avanceProgressBar}% ${textCaptura} creados</div>
                                            `;
                                        }

                                    })
                                }
                            }
                        }else{
                            if(totalContratos>0){
                                for (let contador = 0; contador < totalContratos; contador++) {
                                    let avanceProgressBar = (((contador+1) / totalContratos)*100).toFixed(0);
                                    const idUsuarioA = respuestas[0][contador];
                                    fetch(`acreacargo/agregandoCargosSelec/${captura}_${idUsuarioA}_${textMes.value}`)
                                    .then(respRenderA => respRenderA.json())
                                    .then(respuestas0 => {
                                        if(respuestas0==null || respuestas0.estatus=='error'){
                                        }else {
                                            barraProgreso.innerHTML=`
                                                <div class="progress-bar progress-bar-striped bg-success text-center progress-bar-animated" role="progressbar" style="width: ${avanceProgressBar}%" aria-valuenow="${avanceProgressBar}" aria-valuemin="0" aria-valuemax="100">${avanceProgressBar}% ${textCaptura} creados</div>
                                            `;
                                        }

                                    })
                                }
                            }

                        }
                        fetch(`acreacargo/mostrarResumenCargos`)
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
                                inicialCargosUsuarios.innerHTML='';
                                avanceProgresoCargos.innerHTML='';
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

function validarMes(){
    let inputForm = document.querySelector("#textMes");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Mes es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }
    inputValido(inputForm);
    return true;

}

function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
