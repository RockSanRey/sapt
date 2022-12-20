let botonCancelar = document.querySelector('#botonCancelar');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector('#botonActualizar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListadoAsambleas();
    botonGuardar.addEventListener('click', () => {
        guardarCodigoAsamblea();
    })
    botonActualizar.addEventListener('click', () => {
        actualizarCodigoAsamblea();
    })
    botonCancelar.addEventListener('click', () => {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML='';
    })
})

const obtenerListadoAsambleas = async () => {
    try {
        let inicioCreaAsambleas = document.querySelector('#inicioCreaAsambleas');
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.classList.add('tabla-contenedor');
        inicioCreaAsambleas.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Haz clic en el boton <span class="btn btn-sm btn-success"><i class="fas fa-book-reader"></i></span>, para crear un código de asamblea donde se podrán hacer convocatorias y llevar el control de las mismas.</li>
                </ol>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-sm btn-success" id="botonCreaCodigo" data-toggle="modal" data-target="#formRegistroDatos"><i class="fas fa-book-reader"></i> Crear Código</button>
            </div>
        `;
        let botonCreaCodigo = document.querySelector('#botonCreaCodigo');
        botonCreaCodigo.addEventListener('click', () => {
            plantillaFormulario();
        })
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('acreaasamble/llenarTablaAsambleas')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                
            }else{
                const tablaAsambleas = document.createElement('table')
                tablaAsambleas.classList.add('table','table-sm','table-hover');
                tablaAsambleas.innerHTML=`
                    <thead>
                        <th class="col">Asambleas</th>
                        <th>Acciones</th>
                    </thead>
                `;
                const cuerpoTablaAsambleas = document.createElement('tbody');
                respuestas.forEach(asamblea => {
                    const filasTablaAsambleas = document.createElement('tr');
                    filasTablaAsambleas.classList.add('fuente-12p');
                    const columnaDetalles = document.createElement('td');
                    columnaDetalles.innerHTML=`
                        <div class="row">
                            <div class="col-md-2 col-12">${asamblea.CODIGO_ASAM}</div>
                            <div class="col-md-4 col-12">${asamblea.DESCRIPCION_ASAM}</div>
                            <div class="col-md-3 col-12">${asamblea.DESCRIPCION_ESTAT}</div>
                            <div class="col-md-3 col-12">${asamblea.FECHA_ASAM} - ${asamblea.HORA_ASAM}</div>
                        </div>
                    `;
                    filasTablaAsambleas.appendChild(columnaDetalles);
                    const columnaAcciones = document.createElement('td');
                    if(asamblea.TOTALES==0){
                        const botonEditarEl = document.createElement('button');
                        botonEditarEl.classList.add('btn','btn-info','btn-sm');
                        botonEditarEl.setAttribute('data-toggle','modal');
                        botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                        botonEditarEl.setAttribute('dataedit',asamblea.idTablePk);
                        botonEditarEl.setAttribute('id','botonEditarSel');
                        botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                        botonEditarEl.addEventListener('click',() => {
                            buscandoDatosEditar(botonEditarEl);
                        });
                        const botonEliminarReg = document.createElement('button');
                        botonEliminarReg.classList.add('btn','btn-danger','btn-sm');
                        botonEliminarReg.setAttribute('dataeliminar',asamblea.idTablePk);
                        botonEliminarReg.setAttribute('id','botonEliminarReg');
                        botonEliminarReg.innerHTML = '<i class="fa fa-eraser"></i>';
                        botonEliminarReg.addEventListener('click',() => {
                            eliminarCodigoAsamblea(botonEliminarReg);
                        });
                        const grupoAcciones = document.createElement('div');
                        grupoAcciones.classList.add('btn-group');
                        grupoAcciones.appendChild(botonEditarEl);
                        grupoAcciones.appendChild(botonEliminarReg);
                        columnaAcciones.appendChild(grupoAcciones);
                    }else{
                        const badgePill = document.createElement('span');
                        badgePill.classList.add('badge','badge-warning','font-weight-bold');
                        const capaToolTipA = document.createElement('div');
                        capaToolTipA.classList.add('tooltip-box');
                        capaToolTipA.innerHTML=asamblea.TOTALES+'<span class="tooltip-info fuente-12p">Total Convocados</span>';
                        capaToolTipA.addEventListener('mousemove', (e) => {
                            let ejex = e.clientX;
                            let ejey = e.clientY;
                            if(e.target.className == 'tooltip-box'){
                                e.target.children[0].style.top = (ejey+10) +'px';
                                e.target.children[0].style.left = (ejex-180) +'px';
                                e.target.children[0].style.width = 200+'px';
                            }
                        })
                        badgePill.appendChild(capaToolTipA);
                        columnaAcciones.classList.add('text-center', 'fuente-18p');
                        columnaAcciones.appendChild(badgePill);
                    }

                    filasTablaAsambleas.appendChild(columnaAcciones);
                    cuerpoTablaAsambleas.appendChild(filasTablaAsambleas);
                    
                })
                tablaAsambleas.appendChild(cuerpoTablaAsambleas);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(tablaAsambleas);
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

const plantillaFormulario = async () => {
    try {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Crear Código Asamblea';
        formRegistroCRUD.innerHTML='';
        formRegistroCRUD.innerHTML=`
            <div class="bg-white p-2">
                <div class="form-group mb-2">
                    <input type="text" name="textCodigo" value="" class="form-control form-control-sm col-md-4 col-12" id="textCodigo" maxlength="10" placeholder="Código">
                </div>
                <div class="form-group mb-2">
                    <input type="text" name="textDescripcion" value="" class="form-control form-control-sm col-md-12 col-12" id="textDescripcion" maxlength="40" placeholder="Descripción">
                </div>
                <div class="form-group mb-2">
                    <select class="custom-select custom-select-sm col-md-6 col-12" id="textTipo" name="textTipo">
                        <option value="">Tipo Asamblea</option>
                        <option value="ORDI">Ordinaria</option>
                        <option value="EXOR">Extraordinaria</option>
                    </select>
                </div>
                <div class="row">
                    <div class="form-group mb-2 col-md-6 col-12">
                        <input type="text" name="textFecha" value="" class="form-control form-control-sm" id="textFecha" maxlength="13" placeholder="Fecha">
                    </div>
                    <div class="form-group mb-2 col-md-6 col-12">
                        <input type="time" name="textHora" value="" step="2" class="form-control form-control-sm" id="textHora" maxlength="8" placeholder="Hora">
                    </div>
                </div>
            </div>
        `;
        let textFecha = document.querySelector('#textFecha');
        let fechaActual = new Date();
        let anioActual = fechaActual.getFullYear();
        let mesActual = fechaActual.getMonth();
        let diaActual = fechaActual.getDate();
        let selecionDia = new Datepicker(textFecha, {
            'range': true,
            'minDate': new Date(anioActual, mesActual, diaActual+0),
            'maxDate': new Date(anioActual+1, mesActual, diaActual),
            'format': 'yyyy-mm-dd',
            'language': 'es',
            'autohide': 'true'
        });
        botonGuardar.classList.remove('d-none');
        botonActualizar.classList.add('d-none');
        botonGuardar.innerHTML='Guardar';
        
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const guardarCodigoAsamblea = async () => {
    try {
        if(validarCodigo() && validarDescripcion() && validarTipo() && validarFecha() && validarHora()){
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('acreaasamble/guardarAsambleaNueva', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    }).then((result) => {
                        if((result.isConfirmed)){
                            obtenerListadoAsambleas();
                            botonCancelar.click();
                        }
                    })
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

const buscandoDatosEditar = async (botonEditarEl) => {
    try {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Modificar Asamblea';
        formRegistroCRUD.innerHTML=cargaAnimacion;
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.remove('d-none');
        Swal.fire({
            title: 'Editar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, editar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea editar los datos de la asamblea?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonEditarEl.attributes.dataedit.value;
                fetch(`acreaasamble/buscarEditarAsamblea/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error' || respuestas.estatus=='nosesion'){
                        formRegistroCRUD.innerHTML='';
                    }else{
                        respuestas.forEach(asamblea => {
                            formRegistroCRUD.innerHTML=`
                                <div class="bg-white p-2">
                                    <div class="form-group mb-2">
                                        <input type="text" name="textCodigo" value="${asamblea.CODIGO_ASAM}" class="form-control form-control-sm col-md-4 col-12" id="textCodigo" maxlength="10" placeholder="Código" readonly>
                                    </div>
                                    <div class="form-group mb-2">
                                        <input type="text" name="textDescripcion" value="${asamblea.DESCRIPCION_ASAM}" class="form-control form-control-sm col-md-12 col-12" id="textDescripcion" maxlength="40" placeholder="Descripción">
                                    </div>
                                    <div class="form-group mb-2">
                                        <select class="custom-select custom-select-sm col-md-6 col-12" id="textTipo" name="textTipo"></select>
                                    </div>
                                    <div class="row">
                                        <div class="form-group mb-2 col-md-6 col-12">
                                            <input type="text" name="textFecha" value="${asamblea.FECHA_ASAM}" class="form-control form-control-sm" id="textFecha" maxlength="13" placeholder="Fecha">
                                        </div>
                                        <div class="form-group mb-2 col-md-6 col-12">
                                            <input type="time" name="textHora" value="${asamblea.HORA_ASAM}" step="2" class="form-control form-control-sm" id="textHora" maxlength="12" placeholder="Hora">
                                        </div>
                                    </div>
                                </div>
                            `;
                            let textTipo = document.querySelector('#textTipo');
                            if(asamblea.TIPO_ASAM=='ORDI'){
                                textTipo.innerHTML=`
                                    <option value="">Tipo Asamblea</option>
                                    <option value="ORDI" selected="selected">Ordinaria</option>
                                    <option value="EXOR">Extraordinaria</option>
                                `;
                            }else if(asamblea.TIPO_ASAM=='EXOR'){
                                textTipo.innerHTML=`
                                    <option value="">Tipo Asamblea</option>
                                    <option value="ORDI">Ordinaria</option>
                                    <option value="EXOR" selected="selected">Extraordinaria</option>
                                `;
                            }
                            let textFecha = document.querySelector('#textFecha');
                            let fechaActual = new Date();
                            let anioActual = fechaActual.getFullYear();
                            let mesActual = fechaActual.getMonth();
                            let diaActual = fechaActual.getDate();
                            let selecionDia = new Datepicker(textFecha, {
                                'range': true,
                                'minDate': new Date(anioActual, mesActual, diaActual+0),
                                'maxDate': new Date(anioActual+1, mesActual, diaActual),
                                'format': 'yyyy-mm-dd',
                                'language': 'es',
                                'autohide': 'true'
                            });
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

const actualizarCodigoAsamblea = async () => {
    try {
        if(validarCodigo() && validarDescripcion() && validarTipo() && validarFecha() && validarHora()){
            botonGuardar.innerHTML=cargaAnimacion;
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('acreaasamble/actualizarAsamblea', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    }).then((result) => {
                        if((result.isConfirmed)){
                            obtenerListadoAsambleas();
                            botonCancelar.click();
                        }
                    })
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

const eliminarCodigoAsamblea = async (botonEliminarReg) => {
    try{
        let idBusqueda = botonEliminarReg.attributes.dataeliminar.value;
        Swal.fire({
            title: '¿Eliminar registro?',
            text: "¿Seguro? Esto no se puede revertir",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            cancelButtonColor: '#9C0000',
            confirmButtonText: '¡Si, eliminarlo!',
            cancelButtonText: '¡No, mejor no!',
        })
        .then((result)=>{
            if(result.isConfirmed){
                fetch(`creaasamble/eliminarAsamblea/${idBusqueda}`)
                .then(respuestaEl=>respuestaEl.json())
                .then(eliminado=>{
                    if(eliminado.estatus=='eliminado'){
                        botonEliminarReg.parentNode.parentNode.parentNode.remove();
                        return Swal.fire({
                            title: eliminado.title,
                            icon: eliminado.icon,
                            confirmButtonText: eliminado.button,
                            confirmButtonColor: '#009C06',
                            html: eliminado.text,
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





function validarCodigo(){
    let inputForm = document.querySelector("#textCodigo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Código es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Código min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Código máx 40 caracteres',
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

function validarDescripcion(){
    let inputForm = document.querySelector("#textDescripcion");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Descripción es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Descripción min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Descripción máx 40 caracteres',
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

function validarTipo(){
    let inputForm = document.querySelector("#textTipo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Tipo es requerido',
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

function validarFecha(){
    let inputForm = document.querySelector("#textFecha");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Fecha es requerido',
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

function validarHora(){
    let inputForm = document.querySelector("#textHora");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Hora es requerido',
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
