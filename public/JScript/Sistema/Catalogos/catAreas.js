let botonRegistrar = document.querySelector('#botonRegistrar');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
let controlEjecuta = 'catareas';
let funcionEjecuta = 'CatAreas';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    botonRegistrar.addEventListener('click', () => plantillaFormulario());
    botonGuardar.addEventListener('click', () => guardarRegistroArea());
    botonActualizar.addEventListener('click', () => actualizarRegistroArea());
    botonCancelar.addEventListener('click', () => inputLimpiar());
})

const obtenerListado = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        const respRender = await fetch(`${controlEjecuta}/llenarTabla${funcionEjecuta}`);
        const respuestas = await respRender.json();
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
        if(respuestas.estatus=='error'){
            cuerpoTablaAreas.innerHTML=`<tr><td colspan="4">${respuestas.text}</td></tr>`;
        }else{
            tablaDinamica.classList.add('tabla-contenedor');
            respuestas.forEach(areas => {
                const {CLAVE_AREA,DESCRIPCION_AREA,FMODIF_AREA,TOTAL,idTablePk} = areas;
                const filaTablaAreas = document.createElement('tr');
                filaTablaAreas.setAttribute('dataparent',idTablePk);
                filaTablaAreas.innerHTML = `
                    <td>${CLAVE_AREA}</td>
                    <td>${DESCRIPCION_AREA}</td>
                    <td>${FMODIF_AREA}</td>
                `;
                const columnaAcciones = document.createElement('td');
                if(TOTAL==0){
                    const botonEditarEl = document.createElement('button');
                    botonEditarEl.classList.add('btn','btn-sm','btn-info');
                    botonEditarEl.setAttribute('data-toggle','modal');
                    botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEditarEl.setAttribute('dataedit',idTablePk);
                    botonEditarEl.setAttribute('id','botonEditarSel');
                    botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarEl.addEventListener('click',() => buscandoDatosEditar(botonEditarEl));
                    const botonEliminarEl = document.createElement('button');
                    botonEliminarEl.classList.add('btn','btn-sm','btn-danger');
                    botonEliminarEl.setAttribute('dataelim',idTablePk);
                    botonEliminarEl.setAttribute('id','botonEliminarSel');
                    botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarEl.addEventListener('click',()=>confirmarEliminar(botonEliminarEl));
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
                    capaToolTipA.innerHTML=TOTAL+'<span class="tooltip-info fuente-12p">Num puestos asignadas</span>';
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
            });
            
        }
        tablaAreas.appendChild(cuerpoTablaAreas);
        tablaDinamica.innerHTML='';
        tablaDinamica.appendChild(tablaAreas);

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
    let formularioAreasCRUD = document.querySelector('#formularioAreasCRUD');
    botonGuardar.classList.remove('d-none');
    botonActualizar.classList.add('d-none');
    formularioAreasCRUD.innerHTML=`
        <div class="form-group mb-2">
            <input type="text" name="textArea" value="" class="form-control form-control-sm col-md-4 col-12" id="textArea" maxlength="6" placeholder="Area">
        </div>
        <div class="form-group mb-2">
            <input type="text" name="textDescripcion" value="" class="form-control form-control-sm" id="textDescripcion" maxlength="30" placeholder="Descripción">
        </div>
        <div class="form-group mb-2">
          <textarea name="textComentario" row="5" class="form-control form-control-sm" id="textComentario" maxlength="500" rows="4" maxlength="500" placeholder="Comentarios"></textarea>
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

}

const guardarRegistroArea = async () => {
    try{
        if(validarArea()&&validarDescripcion()&&validarComentario()){
            let formularioAreasCRUD = document.querySelector('#formularioAreasCRUD');
            const crearDatos = new FormData(formularioAreasCRUD);
            const respRender = await fetch(`${controlEjecuta}/guardar${funcionEjecuta}`,{
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
    try {
        let idRegistro = botonEditarEl.attributes.dataedit.value
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.remove('d-none');
        const formularioAreasCRUD = document.querySelector('#formularioAreasCRUD');
        const respRender = await fetch(`${controlEjecuta}/buscaEditar${funcionEjecuta}/${idRegistro}`)
        const respuestas = await respRender.json();
        if(respuestas.estatus=='error'){
            formularioAreasCRUD.innerHTML=`<div>${respuestas.text}</div>`;
        }else{
            respuestas.forEach(registros => {
                const {CLAVE_AREA,DESCRIPCION_AREA,COMENTARIO_AREA} = registros;
                formularioAreasCRUD.innerHTML = `
                <div class="form-group mb-2">
                    <input type="hidden" name="textArea" id="textArea" value="${CLAVE_AREA}" />
                    <input type="text" name="textAreaV" value="${CLAVE_AREA}" class="form-control form-control-sm col-md-4 col-12" id="textAreaV" maxlength="13" placeholder="Area" readonly />
                </div>
                <div class="form-group mb-2">
                    <input type="text" name="textDescripcion" value="${DESCRIPCION_AREA}" class="form-control form-control-sm" id="textDescripcion" maxlength="30" placeholder="Descripción" />
                </div>
                <div class="form-group mb-2">
                    <textarea name="textComentario" rows="4" class="form-control form-control-sm" id="textComentario" maxlength="500" placeholder="Comentarios">${COMENTARIO_AREA}</textarea>
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

const actualizarRegistroArea = async () => {
    try{
        if(validarArea()&&validarDescripcion()&&validarComentario()){
            let formularioAreasCRUD = document.querySelector('#formularioAreasCRUD');
            const actualizaDatos = new FormData(formularioAreasCRUD);
            const respRender = await fetch(`${controlEjecuta}/actualizar${funcionEjecuta}`, {
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
                eliminarRegistrosArea(idRegistro);
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

const eliminarRegistrosArea = async (idRegistro) => {
    try {
        const respRender = await fetch(`${controlEjecuta}/eliminar${funcionEjecuta}/${idRegistro}`);
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
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })

    }
}

const inputLimpiar = async () => {
    let formularioAreasCRUD = document.querySelector('#formularioAreasCRUD');
    formularioAreasCRUD.innerHTML='';
}


function validarArea(){
    let inputForm = document.querySelector("#textArea");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',            
            icon: 'error',
            text: 'Clave es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.value.length < 4) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',            
            icon: 'error',
            text: 'Clave min 4 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.value.length > 6) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',            
            icon: 'error',
            text: 'Clave máx 6 caracteres',
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
            confirmButtonColor: '#9C0000',            
            icon: 'error',
            text: 'Descripción es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.value.length < 4) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',            
            icon: 'error',
            text: 'Descripción min 4 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.value.length > 30) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',            
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
    if (inputForm.value.length > 500) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',            
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

