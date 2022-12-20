let botonCancelar = document.querySelector('#botonCancelar');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector('#botonActualizar');
let botonSancion = document.querySelector('#botonSancion');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListadoAsambleas();
    botonGuardar.addEventListener('click', () => {
        iniciarConvocatoria();
    })
    botonActualizar.addEventListener('click', () => {
        cerrarAsambleaConvocada();
    })
    botonSancion.addEventListener('click', () => {
        sancionAsambleaFaltante();
    })
})

const obtenerListadoAsambleas = async () => {
    try{
        let inicialConvocatorias = document.querySelector('#inicialConvocatorias');
        inicialConvocatorias.innerHTML='';
        inicialConvocatorias.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Crea un convicatoria para usuarios con el botón <span class="btn btn-info btn-sm"><i class="fas fa-book-reader"></i> Convocar</span>.</li>
                </ol>
            </div>
        `;
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('aconvasamble/llenarTablaConvocatorias')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#BB0F0F',
                    html: respuestas.text,
                });

            }else{
                tablaDinamica.classList.add('tabla-contenedor');
                const tablaConvocatorias = document.createElement('table')
                tablaConvocatorias.classList.add('table','table-sm','table-hover');
                tablaConvocatorias.innerHTML=`
                    <thead>
                        <th class="col">Asambleas</th>
                        <th>Asistencias/Faltas</th>
                        <th>Acciones</th>
                    </thead>
                `;
                const cuerpoTablaConvocatorias = document.createElement('tbody');
                respuestas[0].forEach(convocatorias => {
                    const filaTablaConvocatorias = document.createElement('tr');
                    const columnaTablaConvocatorias = document.createElement('td');
                    columnaTablaConvocatorias.innerHTML=`
                        <div class="row fuente-12p">
                            <div class="col-md-3">${convocatorias.CODIGO_ASAM}</div>
                            <div class="col-md-5">${convocatorias.DESCRIPCION_ASAM}</div>
                            <div class="col-md-2">${convocatorias.DESCRIPCION_ESTAT}</div>
                            <div class="col-md-2"><small>Concocados:</small> ${convocatorias.INVITADOS}</div>
                        </div>
                    `;
                    filaTablaConvocatorias.appendChild(columnaTablaConvocatorias);
                    const columnaAsistencias = document.createElement('td');
                    columnaAsistencias.classList.add('text-center');
                    respuestas[1].forEach(asistencia => {
                        if(asistencia.idTablePk==convocatorias.idTablePk){
                            if(asistencia.ASISTENCIA_CONV=='ASIS'){
                                const grupoAsistencia = document.createElement('span');
                                grupoAsistencia.classList.add('text-success','font-weight-bold');
                                let porcentaje = parseInt(asistencia.INVITADOS) / parseInt(convocatorias.INVITADOS);
                                grupoAsistencia.innerHTML=parseFloat(porcentaje*100).toFixed(2)+'% '+asistencia.INVITADOS;
                                columnaAsistencias.appendChild(grupoAsistencia);
                            }else if(asistencia.ASISTENCIA_CONV=='FALT'){
                                const grupoAsistencia = document.createElement('span');
                                grupoAsistencia.innerHTML='/'+asistencia.INVITADOS;
                                columnaAsistencias.appendChild(grupoAsistencia);
                            }
                        }
                    })
                    filaTablaConvocatorias.appendChild(columnaAsistencias);
                    const columnaAcciones = document.createElement('td');
                    if(convocatorias.INVITADOS==0){
                        const botonConvocatoria = document.createElement('button');
                        botonConvocatoria.classList.add('btn','btn-info','btn-sm');
                        botonConvocatoria.setAttribute('dataconvo',convocatorias.idTablePk);
                        botonConvocatoria.setAttribute('data-toggle','modal');
                        botonConvocatoria.setAttribute('data-target','#formRegistroDatos');
                        botonConvocatoria.innerHTML='Convocar';
                        botonConvocatoria.addEventListener('click',() => {
                            crearConvocatoria(botonConvocatoria);
                        });
                        columnaAcciones.appendChild(botonConvocatoria);
                    }else if(convocatorias.INVITADOS>0 && convocatorias.ESTATUS_ASAM=='ACTI'){
                        const botonCerrarAsamblea = document.createElement('button');
                        botonCerrarAsamblea.classList.add('btn','btn-warning','btn-sm');
                        botonCerrarAsamblea.setAttribute('dataconvo',convocatorias.idTablePk);
                        botonCerrarAsamblea.setAttribute('data-toggle','modal');
                        botonCerrarAsamblea.setAttribute('data-target','#formRegistroDatos');
                        botonCerrarAsamblea.innerHTML='Cerrar';
                        botonCerrarAsamblea.addEventListener('click',() => {
                            cerrarAsamblea(botonCerrarAsamblea);
                        });
                        columnaAcciones.appendChild(botonCerrarAsamblea);
                    }else if(convocatorias.ESTATUS_ASAM=='CERR'){
                        const botonSancionAsamblea = document.createElement('button');
                        botonSancionAsamblea.classList.add('btn','btn-danger','btn-sm');
                        botonSancionAsamblea.setAttribute('dataconvo',convocatorias.idTablePk);
                        botonSancionAsamblea.setAttribute('data-toggle','modal');
                        botonSancionAsamblea.setAttribute('data-target','#formRegistroDatos');
                        botonSancionAsamblea.innerHTML='Sanción';
                        botonSancionAsamblea.addEventListener('click',() => {
                            prepararSancion(botonSancionAsamblea);
                        });
                        columnaAcciones.appendChild(botonSancionAsamblea);
                    }else if(convocatorias.ESTATUS_ASAM=='SANC'){
                        columnaAcciones.innerHTML=`
                            <div class="text-success font-weight-bold"><i class="fas fa-check"></i> Check</div>
                        `;
                    }
                    filaTablaConvocatorias.appendChild(columnaAcciones);
                    cuerpoTablaConvocatorias.appendChild(filaTablaConvocatorias);
                })
                tablaConvocatorias.appendChild(cuerpoTablaConvocatorias);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(tablaConvocatorias);
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

const crearConvocatoria = async (botonConvocatoria) => {
    try{
        let idBusqueda = botonConvocatoria.attributes.dataconvo.value;
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML=cargaAnimacion;
        botonGuardar.classList.remove('d-none');
        botonActualizar.classList.add('d-none');
        botonSancion.classList.add('d-none');
        Swal.fire({
            title: 'Convocatorias',
            showCancelButton: true,
            confirmButtonText: 'Si convocar',
            confirmButtonColor: '#009C06',
            cancelButtonColor: '#9C0000',
            cancelButtonText: '¡No, mejor no!',
            icon: 'question',
            text: '¿Desea hacer la convocatoria para esta asamblea?',
        }).then((result)=>{
            if(result.isConfirmed){
                fetch(`aconvasamble/totalesUsuariosConvocados/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    formRegistroCRUD.classList.add('bg-white','p-2');
                    if(respuestas[0].estatus=='error'||respuestas[0].estatus=='error'){

                    }else{
                        respuestas[0].forEach(asambleas => {
                            formRegistroCRUD.innerHTML=`
                                <div class="form-group mb-2">
                                    <input type="hidden" name="textCodigo" id="textCodigo" value="${asambleas.CODIGO_ASAM}">
                                    <input type="text" name="textCodigoVista" id="textCodigoVista" class="form-control form-control-sm" value="${asambleas.CODIGO_ASAM} - ${asambleas.DESCRIPCION_ASAM}" disabled>
                                </div>
                                <div class="form-group mb-2">
                                    <input type="text" name="textAsambleaNombre" id="textAsambleaNombre" class="form-control form-control-sm" value="Tipo Asamblea: ${asambleas.DESCRIPCION_ESTAT}" disabled>
                                </div>
                            `;
                        })
                        respuestas[1].forEach(invitados => {
                            const grupoInvitados = document.createElement('div');
                            grupoInvitados.classList.add('form-group','mb-2');
                            grupoInvitados.innerHTML=`
                                <input type="text" name="textInvitados" id="textInvitados" class="form-control form-control-sm" value="Total a convocar: ${invitados.TOTALES}" disabled>
                            `;
                            formRegistroCRUD.appendChild(grupoInvitados);
                        })
                    }
                })
            }else{
                botonCancelar.click();
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

const iniciarConvocatoria = async () => {
    try{
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let progresoAvance = document.createElement('div');
        let textCodigo = document.querySelector('#textCodigo').value;
        fetch(`aconvasamble/usuariosConvocados`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            let capturista = respuestas[0];
            let totalConvocados = respuestas[1].length;
            botonGuardar.classList.add('d-none');
            progresoAvance.innerHTML=`
                <div class="progress d-none mb-2" id="barraProgresoA"></div>
            `;
            const barraProgresoA = document.createElement('div');
            const mensajeFinal = document.createElement('div');
            barraProgresoA.classList.add('progress','mb-4');
            progresoAvance.appendChild(barraProgresoA);
            formRegistroCRUD.appendChild(progresoAvance);
            formRegistroCRUD.appendChild(mensajeFinal);
            if(totalConvocados>0){
                for (let conteroA = 0; conteroA < totalConvocados; conteroA++) {
                    let avanceProgressBar = (((conteroA+1) / totalConvocados)*100).toFixed(0);
                    const datosInvitacion = {
                        idUsuario: respuestas[1][conteroA],
                        asamblea: textCodigo,
                        capturista: capturista,
                    };
                    fetch('aconvasamble/creandoInvitacionUsuario', {
                        method: 'POST',
                        body: JSON.stringify(datosInvitacion),
                        headers: {
                            "Content-type": "application/json",
                        },
                    })
                    .then(respRenderA => respRenderA.json())
                    .then(respuestasA => {
                        if(respuestasA==null || respuestasA.estatus=='error' || respuestasA.estatus=='nosesion'){

                        }else {
                            barraProgresoA.innerHTML=`
                                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${avanceProgressBar}%" aria-valuenow="${avanceProgressBar}" aria-valuemin="0" aria-valuemax="100">${avanceProgressBar}% convocados</div>
                            `;
                        }

                    })
                }
            }
            mensajeFinal.innerHTML=`
                <div class="alert alert-success" role="alert">Se han convocado a los usuarios a la asamblea solo falta tomar la asistencia.</div>
            `;
            obtenerListadoAsambleas();
            botonCancelar.innerHTML='Cerrar';

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

const cerrarAsamblea = async (botonCerrarAsamblea) => {
    try {
        let idBusqueda = botonCerrarAsamblea.attributes.dataconvo.value;
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML=cargaAnimacion;
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.remove('d-none');
        botonSancion.classList.add('d-none');
        Swal.fire({
            title: 'Asambleas',
            showCancelButton: true,
            confirmButtonText: 'Si cerrar',
            confirmButtonColor: '#009C06',
            cancelButtonColor: '#9C0000',
            cancelButtonText: '¡No, mejor no!',
            icon: 'question',
            text: '¿Desea cerrar esta asamblea?',
        }).then((result)=>{
            if(result.isConfirmed){
                fetch(`aconvasamble/consultarAsambleaConvocada/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas[0].estatus=='error'||respuestas[0].estatus=='error'){

                    }else{
                        respuestas[0].forEach(asambleas => {
                            formRegistroCRUD.classList.add('bg-white','p-2');
                            formRegistroCRUD.innerHTML=`
                                <div class="form-group mb-2">
                                    <input type="hidden" name="textCodigo" id="textCodigo" value="${asambleas.CODIGO_ASAM}">
                                    <input type="text" name="textCodigoVista" id="textCodigoVista" class="form-control form-control-sm" value="${asambleas.CODIGO_ASAM} ${asambleas.DESCRIPCION_ASAM}" disabled>
                                </div>
                                <div class="form-group mb-2">
                                    <input type="text" name="textAsambleaNombre" id="textAsambleaNombre" class="form-control form-control-sm" value="Tipo Asamblea: ${asambleas.DESCRIPCION_ESTAT}" disabled>
                                </div>
                                <div class="form-group mb-2">
                                    <input type="text" name="textInvitados" id="textInvitados" class="form-control form-control-sm" value="Total convocados: ${asambleas.TOTALES}" disabled>
                                </div>
                            `;
                        })
                        const grupoInvitados = document.createElement('div');
                        grupoInvitados.classList.add('row');
                        respuestas[1].forEach(asistencias => {
                            const grupoFragmento = document.createElement('div');
                            grupoFragmento.classList.add('col-md-6','form-group','mb-2');
                            if(asistencias.ASISTENCIA_CONV==null){
                                grupoFragmento.innerHTML=`
                                    <input type="text" name="textAsistencia" id="textAsistencia" class="form-control form-control-sm" value="Faltaron: ${asistencias.TOTALES}" disabled>
                                `;
                            }else if(asistencias.ASISTENCIA_CONV=='ASIS'){
                                grupoFragmento.innerHTML=`
                                    <input type="text" name="textAsistencia" id="textAsistencia" class="form-control form-control-sm" value="Asistencias: ${asistencias.TOTALES}" disabled>
                                `;
                            }
                            grupoInvitados.appendChild(grupoFragmento);
                            formRegistroCRUD.appendChild(grupoInvitados);
                        })

                    }
                })
            }else{
                botonCancelar.click();
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

const cerrarAsambleaConvocada = async () => {
    try {
        let idBusqueda = document.querySelector('#textCodigo').value;
        fetch(`aconvasamble/cerrarAsambleaConvocada/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'||respuestas==null){

            }else{
                botonCancelar.click();
                obtenerListadoAsambleas();
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#009C06',
                    html: respuestas.text,
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

const prepararSancion = async (botonSancionAsamblea) => {
    try {
        let idBusqueda = botonSancionAsamblea.attributes.dataconvo.value;
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML=cargaAnimacion;
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.add('d-none');
        botonSancion.classList.remove('d-none');
        Swal.fire({
            title: 'Asambleas',
            showCancelButton: true,
            confirmButtonText: 'Si sancionar',
            confirmButtonColor: '#009C06',
            cancelButtonColor: '#9C0000',
            cancelButtonText: '¡No, mejor no!',
            icon: 'question',
            text: '¿Desea aplicar la sanción a los faltantes?',
        }).then((result)=>{
            if(result.isConfirmed){
                fetch(`aconvasamble/informeAsambleaAsistencias/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    formRegistroCRUD.classList.add('bg-white','p-2');
                    if(respuestas[0].estatus=='error'||respuestas[0].estatus=='error'){

                    }else{
                        respuestas[0].forEach(asambleas => {
                            formRegistroCRUD.innerHTML=`
                                <div class="form-group mb-2">
                                    <input type="hidden" name="textCodigo" id="textCodigo" value="${asambleas.CODIGOASAM}">
                                    <input type="text" name="textCodigoVista" id="textCodigoVista" class="form-control form-control-sm" value="${asambleas.CODIGO_ASAM} ${asambleas.DESCRIPCION_ASAM}" disabled>
                                </div>
                                <div class="form-group mb-2">
                                    <input type="text" name="textAsambleaNombre" id="textAsambleaNombre" class="form-control form-control-sm" value="Tipo Asamblea: ${asambleas.DESCRIPCION_ESTAT}" disabled>
                                </div>
                            `;
                        })
                        respuestas[1].forEach(invitados => {
                            const grupoInvitados = document.createElement('div');
                            grupoInvitados.classList.add('form-group','mb-2');
                            grupoInvitados.innerHTML=`
                                <input type="text" name="textFaltaron" id="textFaltaron" class="form-control form-control-sm" value="Faltantes: ${invitados.TOTALES}" disabled>
                            `;
                            formRegistroCRUD.appendChild(grupoInvitados);
                        })

                    }
                })
            }else{
                botonCancelar.click();
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

const sancionAsambleaFaltante = async () => {
    try{
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let progresoAvance = document.createElement('div');
        let textCodigo = document.querySelector('#textCodigo');
        fetch(`aconvasamble/usuariosFaltantes/${textCodigo.value}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            let faltantes = respuestas[1].length;
            botonActualizar.classList.add('d-none');
            progresoAvance.innerHTML=`
                <div class="progress d-none mb-2" id="barraProgresoA"></div>
            `;
            formRegistroCRUD.appendChild(progresoAvance);
            let barraProgresoA = document.querySelector('#barraProgresoA');
            barraProgresoA.classList.remove('d-none');
            if(faltantes>0){
                for (let conteroA = 0; conteroA < faltantes; conteroA++) {
                    let avanceProgressBar = (((conteroA+1) / faltantes)*100).toFixed(0);
                    const datosInvitacion = {
                        capturista: respuestas[0],
                        idUsuario: respuestas[1][conteroA],
                        asamblea: textCodigo.value,
                    };
                    fetch('aconvasamble/aplicandoSanciones', {
                        method: 'POST',
                        body: JSON.stringify(datosInvitacion),
                        headers: {
                            "Content-type": "application/json",
                        },
                    })
                    .then(respRenderA => respRenderA.json())
                    .then(respuestasA => {
                        if(respuestasA==null || respuestasA.estatus=='error' || respuestasA.estatus=='nosesion'){

                        }else {
                            barraProgresoA.innerHTML=`
                                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${avanceProgressBar}%" aria-valuenow="${avanceProgressBar}" aria-valuemin="0" aria-valuemax="100">${avanceProgressBar}% convocados</div>
                            `;
                        }

                    })
                }
            }
            fetch(`aconvasamble/mostrarResumenAsamblea/${textCodigo.value}`)
            .then(respRenderB => respRenderB.json())
            .then(respuestas1 => {
                botonSancion.classList.add('d-none');
                obtenerListadoAsambleas();
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
