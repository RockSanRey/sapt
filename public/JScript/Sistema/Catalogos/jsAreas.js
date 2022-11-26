let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
    botonGuardar.addEventListener('click', () => {
        guardarRegistroArea();
    })
    botonActualizar.addEventListener('click', ()=>{
        actualizarReistroArea();
    })
    botonCancelar.addEventListener('click', () => {
        inputLimpiar();
    })
})

const obtenerListado = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('catareas/llenarTablaAreas')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaDinamica.classList.add('tabla-contenedor');
            const tablaAreas = document.createElement('table');
            tablaAreas.classList.add('table','table-hover','table-sm','fuente-12p');
            tablaAreas.innerHTML=`
                <thead>
                    <th>Clave</th>
                    <th class="col">Descripción</th>
                    <th>Modif</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaAreas = document.createElement('tbody');
            respuestas.forEach(areas => {
                const filaTablaAreas = document.createElement('tr');
                filaTablaAreas.innerHTML += `
                <td>${areas.Clave}</td>
                <td>${areas.Descripción}</td>
                <td>${areas.Modif}</td>
                `;
                const columnaAcciones = document.createElement('td');
                if(areas.TOTAL==0){
                    const botonEditarEl = document.createElement('button');
                    botonEditarEl.classList.add('btn','btn-info');
                    botonEditarEl.setAttribute('data-toggle','modal');
                    botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEditarEl.setAttribute('dataedit',areas.idTablePk);
                    botonEditarEl.setAttribute('id','botonEditarSel');
                    botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarEl.addEventListener('click',() => {
                        buscandoDatosEditar(botonEditarEl);
                    });
                    const botonEliminarEl = document.createElement('button');
                    botonEliminarEl.classList.add('btn','btn-danger');
                    botonEliminarEl.setAttribute('dataelim',areas.idTablePk);
                    botonEliminarEl.setAttribute('id','botonEliminarSel');
                    botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarEl.addEventListener('click',()=>{
                        eliminarRegistrosArea(botonEliminarEl);
                    })
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonEditarEl);
                    grupoAcciones.appendChild(botonEliminarEl);
                    columnaAcciones.appendChild(grupoAcciones);
                }else {
                    const badgePill = document.createElement('span');
                    badgePill.classList.add('badge','badge-warning','font-weight-bold');
                    const capaToolTipA = document.createElement('div');
                    capaToolTipA.classList.add('tooltip-box');
                    capaToolTipA.innerHTML=areas.TOTAL+'<span class="tooltip-info fuente-12p">Num puestos asignadas</span>';
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
                    columnaAcciones.appendChild(badgePill);
                }
                filaTablaAreas.appendChild(columnaAcciones);
                cuerpoTablaAreas.appendChild(filaTablaAreas);
                tablaAreas.appendChild(cuerpoTablaAreas);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(tablaAreas);
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
};

const plantillaFormulario = async () =>{
    let templateForm = document.querySelector('#formAreasCRUD');
    templateForm.innerHTML=`
        <div class="form-group">
            <input type="text" name="textArea" value="" class="form-control form-control-sm col-md-4 col-12" id="textArea" maxlength="13" placeholder="Area">
        </div>
        <div class="form-group">
            <input type="text" name="textDescripcion" value="" class="form-control form-control-sm" id="textDescripcion" max-length="50" placeholder="Descripción">
        </div>
        <div class="form-group">
          <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios"></textarea>
        </div>
    `;
    botonGuardar.classList.remove('d-none');
    botonActualizar.classList.add('d-none');
    return templateForm;

}

const guardarRegistroArea = async () => {
    try{
        if(validarArea() && validarDescripcion() && validarComentario()){
            let formAreasCRUD = document.querySelector('#formAreasCRUD');
            const crearDatos = new FormData(formAreasCRUD);
            fetch('catareas/guardarAreas',{
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender=>respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='nosesion' || respuestas.estatus=='invalido'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#e9b20e',
                        html: respuestas.text,
                    })
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#51BB0F',
                        html: respuestas.text,
                    }).then((result) => {
                        if(result.isConfirmed){
                            obtenerListado();
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
        let idRegistro = botonEditarEl.attributes.dataedit.value
        fetch(`catareas/buscaEditarAreas/${idRegistro}`)
        .then(respuestaEditar => respuestaEditar.json())
        .then(editando => {
            editando.forEach(editando => {
                const templateForm = document.querySelector('#formAreasCRUD');
                templateForm.innerHTML = `
                <div class="form-group">
                    <input type="hidden" name="textArea" value="${editando.CLAVE_AREA}" id="textArea">
                    <input type="text" name="textAreaV" value="${editando.CLAVE_AREA}" class="form-control form-control-sm col-md-4 col-12" id="textAreaV" maxlength="13" placeholder="Area" readonly>
                </div>
                <div class="form-group">
                    <input type="text" name="textDescripcion" value="${editando.DESCRIPCION_AREA}" class="form-control form-control-sm" id="textDescripcion" max-length="50" placeholder="Descripción">
                </div>
                <div class="form-group">
                    <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios">${editando.COMENTARIO_AREA}</textarea>
                </div>
                `;
                botonGuardar.classList.add('d-none');
                botonActualizar.classList.remove('d-none');
                return templateForm;
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

const actualizarReistroArea = async () => {
    try{
        if(validarArea() && validarDescripcion() && validarComentario()){
            let formAreasCRUD = document.querySelector('#formAreasCRUD');
            const actualizaDatos = new FormData(formAreasCRUD);
            fetch('catareas/actualizarAreas', {
                method: 'POST',
                body: actualizaDatos,
            })
            .then(respRender=>respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='nosesion' || respuestas.estatus=='invalido'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#e9b20e',
                        html: respuestas.text,
                    })
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#51BB0F',
                        html: respuestas.text,
                    }).then((result) => {
                        if(result.isConfirmed){
                            obtenerListado();
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

const eliminarRegistrosArea = async (botonEliminarEl) => {
    try {
        let idRegistro = botonEliminarEl.attributes.dataelim.value
        Swal.fire({
            title: '¿Eliminar registro?',
            text: "¿Seguro? Esto no se puede revertir",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#B80C21',
            cancelButtonColor: '#701919',
            confirmButtonText: '¡Si, eliminarlo!',
            cancelButtonText: '¡No, mejor no!',
        })
        .then((result)=>{
            if(result.isConfirmed){
                fetch(`catareas/eliminarAreas/${idRegistro}`)
                .then(respRender=>respRender.json())
                .then(respuestas=>{
                    if(respuestas.estatus=='error' || respuestas.estatus=='nosesion'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: `${respuestas.button}`,
                            confirmButtonColor: '#e9b20e',
                            html: respuestas.text,
                        })
                    }else{
                        botonEliminarEl.parentNode.parentNode.parentNode.remove();
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: `${respuestas.button}`,
                            confirmButtonColor: '#51BB0F',
                            html: respuestas.text,
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

function validarArea(){
    let inputForm = document.querySelector("#textArea");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Clave es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 4) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Clave min 4 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 12) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Clave máx 12 caracteres',
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
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Descripción es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 4) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Descripción min 4 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 30) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Descripción máx 30 caracteres',
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

function validarComentario(){
    let inputForm = document.querySelector("#textComentario");
    if (inputForm.length > 500) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Comentario máx 500 caracteres',
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
    inputForm.focus();
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}

function inputLimpiar(){
    plantillaFormulario();
}
