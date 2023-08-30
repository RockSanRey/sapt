let botonRegistro = document.querySelector('#botonRegistro');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
let controlEjecuta = 'catestatus';
let funcionEjecuta = 'Estatus';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    botonRegistro.addEventListener('click', () => plantillaFormulario());
    botonGuardar.addEventListener('click', () => guardarRegistrosEstatus());
    botonActualizar.addEventListener('click', () => actualizarRegistrosEstatus());
    botonCancelar.addEventListener('click', () => inputLimpiar());
})

const obtenerListado = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        const respRender = await fetch('catestatus/llenarTablaEstatus');
        const respuestas = await respRender.json();
        tablaDinamica.classList.add('tabla-contenedor');
        const tablaListaEstatus = document.createElement('table');
        tablaListaEstatus.classList.add('table','table-sm','table-hover','fuente-12p');
        tablaListaEstatus.innerHTML=`
            <thead>
                <th>Clave</th>
                <th class="col">Descripción</th>
                <th>Rango</th>
                <th>F Modif</th>
                <th>Acciones</th>
            </thead>
        `;
        const cuerpoTablaListaEstatus = document.createElement('tbody');
        if(respuestas.estatus=='error'||respuestas==null){
            cuerpoTablaListaEstatus.innerHTML=`<tr><td colspan="4">${respuestas.mensaje}</td></tr>`;
        }else{
            respuestas.forEach(estatus => {
                const {CLAVE_ESTAT,DESCRIPCION_ESTAT,RANGO_ESTAT,FMODIF_ESTAT,idTablePk} = estatus;
                const filaTablaListaEstatus = document.createElement('tr');
                filaTablaListaEstatus.setAttribute('dataparent',idTablePk);
                filaTablaListaEstatus.innerHTML = `
                <td>${CLAVE_ESTAT}</td>
                <td>${DESCRIPCION_ESTAT}</td>
                <td>${RANGO_ESTAT}</td>
                <td>${FMODIF_ESTAT}</td>
                `;
                const columnaAcciones = document.createElement('td');
                const botonEditarEl = document.createElement('button');
                botonEditarEl.classList.add('btn','btn-info','btn-sm');
                botonEditarEl.setAttribute('data-toggle','modal');
                botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                botonEditarEl.setAttribute('dataedit',idTablePk);
                botonEditarEl.setAttribute('id','botonEditarSel');
                botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                botonEditarEl.addEventListener('click',() => buscandoDatosEditar(botonEditarEl));
                const botonEliminarEl = document.createElement('button');
                botonEliminarEl.classList.add('btn','btn-danger','btn-sm');
                botonEliminarEl.setAttribute('dataelim',idTablePk);
                botonEliminarEl.setAttribute('id','botonEliminarSel');
                botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                botonEliminarEl.addEventListener('click',() => confirmarEliminar(botonEliminarEl));
                const grupoAcciones = document.createElement('div');
                grupoAcciones.classList.add('btn-group','text-center');
                grupoAcciones.appendChild(botonEditarEl);
                grupoAcciones.appendChild(botonEliminarEl);
                columnaAcciones.appendChild(grupoAcciones);
                filaTablaListaEstatus.appendChild(columnaAcciones);
                cuerpoTablaListaEstatus.appendChild(filaTablaListaEstatus);
            });
        }
        tablaListaEstatus.appendChild(cuerpoTablaListaEstatus);
        tablaDinamica.innerHTML='';
        tablaDinamica.appendChild(tablaListaEstatus);

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
};

const plantillaFormulario = async () => {
    try{
        let formularioRegistro = document.querySelector('#formularioRegistro');
        botonGuardar.classList.remove('d-none');
        botonActualizar.classList.add('d-none');
        formularioRegistro.innerHTML=`
            <div class="form-group mb-2">
                <input type="text" name="textClave" value="" class="form-control form-control-sm col-md-4 col-12" id="textClave" maxlength="4" placeholder="Clave">
            </div>
            <div class="form-group mb-2">
                <input type="text" name="textDescripcion" value="" class="form-control form-control-sm" id="textDescripcion" max-length="50" placeholder="Descripción">
            </div>
            <div class="form-group mb-2">
                <input type="number" name="textRango" value="" class="form-control form-control-sm col-md-4 col-12" id="textRango" maxlength="3" placeholder="Rango">
            </div>
            <div class="form-group mb-2">
                <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" maxlength="500" rows="4" placeholder="Comentarios"></textarea>
                <div class="text-muted fuente-10p" id="letrasRestanteslabel">500/500</div>
            </div>
        `;
        let textComentario = document.querySelector('#textComentario');
        let maxLetras = 500;
        let letrasRestanteslabel = document.querySelector('#letrasRestanteslabel');
        textComentario.addEventListener('keyup', (e) => {
            e.preventDefault()
            const actualLetras = textComentario.value.length;
            if(actualLetras<=500){
                const restanteLetras = maxLetras - actualLetras;
                letrasRestanteslabel.innerHTML=restanteLetras+'/'+maxLetras;
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

const guardarRegistrosEstatus = async () => {
    try{
        if(validarClave()&&validarDescripcion()&&validarRango()&&validarComentario()){
            let formularioRegistro = document.querySelector('#formularioRegistro');
            const crearDatos = new FormData(formularioRegistro);
            const respRender = await fetch('catestatus/guardarEstatus',{
                method: 'POST',
                body: crearDatos,
            });
            const respuestas = await respRender.json();
            if(respuestas.estatus=='error' || respuestas.estatus=='nosesion' || respuestas.estatus=='invalido'){
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#e9b20e',
                    html: respuestas.text,
                })
            }else{
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#51BB0F',
                    html: respuestas.text,
                }).then((result) => {
                    if(result.isConfirmed){
                        obtenerListado();
                        botonCancelar.click();
                    }
                })
            }
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
    try{
        let formularioRegistro = document.querySelector('#formularioRegistro');
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.remove('d-none');
        formularioRegistro.innerHTML=cargaAnimacion;
        let idBusqueda = botonEditarEl.attributes.dataedit.value;
        const respRender = await fetch(`catestatus/buscarEditarEstatus/${idBusqueda}`)
        const respuestas = await respRender.json();
        respuestas.forEach(estatus => {
            const {CLAVE_ESTAT,DESCRIPCION_ESTAT,RANGO_ESTAT,COMENTARIOS_ESTAT} = estatus
            formularioRegistro.innerHTML = `
            <div class="form-group">
                <input type="hidden" name="textClave" value="${CLAVE_ESTAT}" id="textClave">
                <input type="text" name="textClaveV" value="${CLAVE_ESTAT}" class="form-control form-control-sm col-md-4 col-12" id="textClaveV" maxlength="4" placeholder="Area" readonly>
            </div>
            <div class="form-group">
                <input type="text" name="textDescripcion" value="${DESCRIPCION_ESTAT}" class="form-control form-control-sm" id="textDescripcion" max-length="50" placeholder="Descripción">
            </div>
            <div class="form-group">
                <input type="text" name="textRango" value="${RANGO_ESTAT}" class="form-control form-control-sm col-md-4 col-12" id="textRango" maxlength="13" placeholder="Area">
            </div>
            <div class="form-group">
                <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios">${COMENTARIOS_ESTAT}</textarea>
                <div class="text-muted fuente-10p" id="letrasRestanteslabel">500/500</div>
            </div>
            `;
            let textComentario = document.querySelector('#textComentario');
            let maxLetras = 500;
            let letrasRestanteslabel = document.querySelector('#letrasRestanteslabel');
            textComentario.addEventListener('keyup', (e) => {
                e.preventDefault()
                const actualLetras = textComentario.value.length;
                if(actualLetras<=500){
                    const restanteLetras = maxLetras - actualLetras;
                    letrasRestanteslabel.innerHTML=restanteLetras+'/'+maxLetras;
                }
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

const actualizarRegistrosEstatus = async () => {
    try{
        if(validarClave() && validarDescripcion() && validarRango() &&validarComentario()){
            let formularioRegistro = document.querySelector('#formularioRegistro');
            const actualizaDatos = new FormData(formularioRegistro);
            const respRender = await fetch('catestatus/actualizarEstatus',{
                method: 'POST',
                body: actualizaDatos,
            });
            const respuestas = await respRender.json();
            if(respuestas.estatus=='error' || respuestas.estatus=='nosesion' || respuestas.estatus=='invalido'){
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#e9b20e',
                    html: respuestas.text,
                })
            }else{
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#51BB0F',
                    html: respuestas.text,
                }).then((result) => {
                    if(result.isConfirmed){
                        obtenerListado();
                        botonCancelar.click();
                    }
                })
            }
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

const confirmarEliminar = async (botonEliminarEl) => {
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
                eliminarRegistrosEstatus(idRegistro);
            }
        })
    } catch (errorAlert) {
        console.error(errorAlert.type);
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const eliminarRegistrosEstatus = async (idRegistro) => {
    try {
        const respRender = await fetch(`catestatus/eliminarEstatus/${idRegistro}`);
        const respuestas = await respRender.json();
        if(respuestas.estatus=='error' || respuestas.estatus=='nosesion'){
            return Swal.fire({
                title: respuestas.title,
                icon: respuestas.icon,
                confirmButtonText: respuestas.button,
                confirmButtonColor: '#e9b20e',
                html: respuestas.text,
            })
        }else{
            let filaEliminar = document.querySelector(`tr[dataparent="${idRegistro}"]`);
            filaEliminar.classList.add('fade');
            setTimeout(() => {
                filaEliminar.remove();
            }, 1300);
            return Swal.fire({
                title: respuestas.title,
                icon: respuestas.icon,
                confirmButtonText: respuestas.button,
                confirmButtonColor: '#51BB0F',
                html: respuestas.text,
            })
        }

    } catch (errorAlert) {
        console.error(errorAlert.type);
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const inputLimpiar = async () => {
    let formularioRegistro = document.querySelector('#formularioRegistro');
    formularioRegistro.innerHTML='';
}



function validarClave(){
    let inputForm = document.querySelector("#textClave");
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
    }else if (inputForm.length < 3) {
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
    }else if (inputForm.length > 4) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Clave máx 4 caracteres',
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

function validarRango(){
    let inputForm = document.querySelector("#textRango");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            icon: 'error',
            text: 'Rango es requerido',
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
