let botonRegistrar = document.querySelector('#botonRegistrar');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
let controlEjecuta = 'catpuestos';
let funcionEjecuta = 'Puestos';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    botonRegistrar.addEventListener('click', () => plantillaFormulario());
    botonGuardar.addEventListener('click', () => guardarRegistrosPuestos());
    botonActualizar.addEventListener('click', () => actualizarRegistrosPuestos());
    botonCancelar.addEventListener('click', () => plantillaFormulario());
})

const obtenerListado = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        const respRender = await fetch(`${controlEjecuta}/llenarTabla${funcionEjecuta}`);
        const respuestas = await respRender.json();
        const tablaListaPuestos = document.createElement('table');
        tablaListaPuestos.classList.add('table','table-sm','table-hover','fuente-12p');
        tablaListaPuestos.innerHTML=`
            <thead>
                <th>Area</th>
                <th>Clave</th>
                <th>Descripción</th>
                <th>F Modif</th>
                <th>Acciones</th>
            </thead>
        `;
        const cuerpoTablaListaPuestos = document.createElement('tbody');
        if(respuestas.estatus=='error'){
            cuerpoTablaListaPuestos.innerHTML=`<tr><td colspan="4">${respuestas.mensaje}</td></tr>`;
        }else{
            tablaDinamica.classList.add('tabla-contenedor');
            respuestas.forEach(puesto => {
                const {CLAVEAREA_PUESTO,CLAVE_PUESTO,DESCRIPHOM_PUESTO,RANGO_PUESTO,FMODIF_PUESTO,TOTAL,idTablePk} = puesto;
                const filaTablaListasPuestos = document.createElement('tr');
                filaTablaListasPuestos.setAttribute('dataparent',idTablePk);
                filaTablaListasPuestos.innerHTML = `
                    <td>${CLAVEAREA_PUESTO}</td>
                    <td>${CLAVE_PUESTO}</td>
                    <td class="col">${DESCRIPHOM_PUESTO} | ${RANGO_PUESTO}</td>
                    <td>${FMODIF_PUESTO}</td>
                `;
                const columnaAcciones = document.createElement('td');
                if(TOTAL==0){
                    const botonEditarEl = document.createElement('button');
                    botonEditarEl.classList.add('btn','btn-sm','btn-info','btn-sm');
                    botonEditarEl.setAttribute('data-toggle','modal');
                    botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEditarEl.setAttribute('dataedit',idTablePk);
                    botonEditarEl.setAttribute('id','botonEditarSel');
                    botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarEl.addEventListener('click',() => buscandoDatosEditar(botonEditarEl));
                    const botonEliminarEl = document.createElement('button');
                    botonEliminarEl.classList.add('btn','btn-sm','btn-danger','btn-sm');
                    botonEliminarEl.setAttribute('dataelim',idTablePk);
                    botonEliminarEl.setAttribute('id','botonEliminarSel');
                    botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarEl.addEventListener('click',()=>confirmarEliminar(botonEliminarEl));
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group','text-center');
                    grupoAcciones.appendChild(botonEditarEl);
                    grupoAcciones.appendChild(botonEliminarEl);
                    columnaAcciones.appendChild(grupoAcciones);
                }else {
                    const badgePill = document.createElement('span');
                    badgePill.classList.add('badge','badge-warning','font-weight-bold');
                    const capaToolTipA = document.createElement('div');
                    capaToolTipA.classList.add('tooltip-box');
                    capaToolTipA.innerHTML=TOTAL+'<span class="tooltip-info fuente-12p">Perfiles Asignados</span>';
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
                filaTablaListasPuestos.appendChild(columnaAcciones);
                cuerpoTablaListaPuestos.appendChild(filaTablaListasPuestos);
            });
            
        }
        tablaListaPuestos.appendChild(cuerpoTablaListaPuestos);
        tablaDinamica.innerHTML='';
        tablaDinamica.appendChild(tablaListaPuestos);

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
    try {
        let formularioPuestosCRUD = document.querySelector('#formularioPuestosCRUD');
        botonGuardar.classList.remove('d-none');
        botonActualizar.classList.add('d-none');
        formularioPuestosCRUD.innerHTML=`
            <div class="form-group mb-2">
                <select name="textArea" value="" class="custom-select custom-select-sm col-md-4 col-12" id="textArea"></select>
            </div>
            <div class="form-group mb-2">
                <input type="text" name="textPuesto" value="" class="form-control form-control-sm col-md-4 col-12" id="textPuesto" maxlength="6" placeholder="Puesto">
            </div>
            <div class="form-group mb-2">
                <input type="text" name="textDescripcionH" value="" class="form-control form-control-sm" id="textDescripcionH" max-length="30" placeholder="Descripción Hom">
            </div>
            <div class="form-group mb-2">
                <input type="text" name="textDescripcionM" value="" class="form-control form-control-sm" id="textDescripcionM" max-length="30" placeholder="Descripción Muj">
            </div>
            <div class="form-group mb-2">
                <input type="number" name="textRango" value="" class="form-control form-control-sm col-md-3 col-6" id="textRango" maxlength="3" placeholder="Rango">
            </div>
            <div class="form-group mb-2">
                <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios"></textarea>
                <div class="text-muted fuente-10p" id="letrasRestanteslabel">500/500</div>
            </div>
        `;
        llenarComboAreas();
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

const guardarRegistrosPuestos = async () => {
    try {
        if(validarArea()&&validarPuesto()&&validarDescripcionH()&&validarDescripcionM()&&validarRango()&&validarComentario()){
            let formularioPuestosCRUD = document.querySelector('#formularioPuestosCRUD');
            const crearDatos = new FormData(formularioPuestosCRUD);
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
        let formularioPuestosCRUD = document.querySelector('#formularioPuestosCRUD');
        const respRender = await fetch(`${controlEjecuta}/buscarEditar${funcionEjecuta}/${idRegistro}`);
        const respuestas = await respRender.json();
        if(respuestas.estatus=='error'||respuestas==null){
            formularioPuestosCRUD.innerHTML=`<div>${respuestas.text}</div>`;
        }else{
            respuestas.forEach(puestos => {
                const {CLAVEAREA_PUESTO,CLAVE_PUESTO,DESCRIPHOM_PUESTO,DESCRIPMUJ_PUESTO,RANGO_PUESTO,COMENTARIO_PUESTO} = puestos
                formularioPuestosCRUD.innerHTML=`
                    <input type="hidden" name="textArea" value="${CLAVEAREA_PUESTO}" id="textArea">
                    <div class="form-group mb-2">
                        <input type="text" name="textPuesto" value="${CLAVE_PUESTO}" class="form-control form-control-sm col-md-4 col-12" id="textPuesto" maxlength="13" placeholder="Puesto" readonly/>
                    </div>
                    <div class="form-group mb-2">
                        <input type="text" name="textDescripcionH" value="${DESCRIPHOM_PUESTO}" class="form-control form-control-sm" id="textDescripcionH" max-length="50" placeholder="Descripción Hom"/>
                    </div>
                    <div class="form-group mb-2">
                        <input type="text" name="textDescripcionM" value="${DESCRIPMUJ_PUESTO}" class="form-control form-control-sm" id="textDescripcionM" max-length="50" placeholder="Descripción Muj"/>
                    </div>
                    <div class="form-group mb-2">
                        <input type="number" name="textRango" value="${RANGO_PUESTO}" class="form-control form-control-sm col-md-4 col-12" id="textRango" maxlength="13" placeholder="Puesto" />
                    </div>
                    <div class="form-group mb-2">
                        <textarea name="textComentario" rows="4" class="form-control form-control-sm" id="textComentario" max-length="500" placeholder="Comentarios">${COMENTARIO_PUESTO}</textarea>
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

const actualizarRegistrosPuestos = async () => {
    try {
        if(validarArea()&&validarPuesto()&&validarDescripcionH()&&validarDescripcionM()&&validarRango()&&validarComentario()){
            let formularioPuestosCRUD = document.querySelector('#formularioPuestosCRUD');
            const actualizaDatos = new FormData(formularioPuestosCRUD);
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
                eliminarRegistrosPuestos(idRegistro);
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

const eliminarRegistrosPuestos = async (idRegistro) => {
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
            }, 1300);            return Swal.fire({
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

const llenarComboAreas = async () => {
    try{
        let inputCombo = document.querySelector('#textArea');
        inputCombo.innerHTML = '<option value="">Cargando...</option>';
        const respRender = await fetch('catalogos/llenarComboAreas');
        const respuestas = await respRender.json();
        if(respuestas.estatus=='error'){
            inputCombo.innerHTML = `<option value="">${respuestas.text}</option>`;
        }else{
            inputCombo.innerHTML = `<option value="">Selecciona Área</option>`;
            respuestas.forEach(registros => {
                const {CLAVE_AREA,DESCRIPCION_AREA} = registros;
                const opcionElemento= document.createElement('option');
                opcionElemento.setAttribute('value', CLAVE_AREA);
                opcionElemento.classList.add('fuente-12p');
                opcionElemento.innerHTML= DESCRIPCION_AREA;
                inputCombo.appendChild(opcionElemento);
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
    try {
        let formularioPuestosCRUD = document.querySelector('#formularioPuestosCRUD');
        formularioPuestosCRUD.innerHTML='';
        
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
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Área es requerido',
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

function validarPuesto(){
    let inputForm = document.querySelector("#textPuesto");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Puesto es requerido',
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
            text: 'Puesto min 4 caracteres',
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
            text: 'Puesto máx 6 caracteres',
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

function validarDescripcionH(){
    let inputForm = document.querySelector("#textDescripcionH");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Descripción H es requerido',
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
            text: 'Descripción H min 4 caracteres',
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
            text: 'Descripción H máx 30 caracteres',
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

function validarDescripcionM(){
    let inputForm = document.querySelector("#textDescripcionM");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Descripción M es requerido',
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
            text: 'Descripción M min 4 caracteres',
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
            text: 'Descripción M máx 30 caracteres',
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
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Rango es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);

            }
        })
        return false;
    }else if (inputForm.value.length > 3) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Rango máx 6 caracteres',
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
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}

