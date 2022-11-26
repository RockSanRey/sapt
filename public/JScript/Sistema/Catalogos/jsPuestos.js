let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
    botonGuardar.addEventListener('click', () => {
        guardarRegistrosPuestos();
    })
    botonActualizar.addEventListener('click', () => {
        actualizarRegistrosPuestos();
    })
    botonCancelar.addEventListener('click', () => {
        plantillaFormulario();
    })
})

const obtenerListado = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('catpuestos/llenarTablaPuestos')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaDinamica.classList.add('tabla-contenedor');
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
            respuestas.forEach(puesto => {
                const filaTablaListasPuestos = document.createElement('tr');
                filaTablaListasPuestos.setAttribute('dataparent',puesto.idTablePk);
                filaTablaListasPuestos.innerHTML = `
                <td>${puesto.CLAVEAREA_PUESTO}</td>
                <td>${puesto.CLAVE_PUESTO}</td>
                <td class="col">${puesto.DESCRIPHOM_PUESTO}</td>
                <td>${puesto.FMODIF_PUESTO}</td>
                `;
                const columnaAcciones = document.createElement('td');
                if(puesto.TOTAL==0){
                    const botonEditarEl = document.createElement('button');
                    botonEditarEl.classList.add('btn','btn-info','btn-sm');
                    botonEditarEl.setAttribute('data-toggle','modal');
                    botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEditarEl.setAttribute('dataedit',puesto.idTablePk);
                    botonEditarEl.setAttribute('id','botonEditarSel');
                    botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarEl.addEventListener('click',() => {
                        buscandoDatosEditar(botonEditarEl);
                    });
                    const botonEliminarEl = document.createElement('button');
                    botonEliminarEl.classList.add('btn','btn-danger','btn-sm');
                    botonEliminarEl.setAttribute('dataelim',puesto.idTablePk);
                    botonEliminarEl.setAttribute('id','botonEliminarSel');
                    botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarEl.addEventListener('click',()=>{
                        eliminarRegistrosPuestos(botonEliminarEl);
                    })
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
                    capaToolTipA.innerHTML=puesto.TOTAL+'<span class="tooltip-info fuente-12p">Perfiles Asignados</span>';
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
                tablaListaPuestos.appendChild(cuerpoTablaListaPuestos);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(tablaListaPuestos);
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

const plantillaFormulario = async () => {
    let templateForm = document.querySelector('#formAreasCRUD');
    templateForm.innerHTML=`
        <div class="form-group">
            <select name="textArea" value="" class="custom-select custom-select-sm col-md-4 col-12" id="textArea"></select>
        </div>
        <div class="form-group">
            <input type="text" name="textPuesto" value="" class="form-control form-control-sm col-md-4 col-12" id="textPuesto" maxlength="13" placeholder="Puesto">
        </div>
        <div class="form-group">
            <input type="text" name="textDescripcionH" value="" class="form-control form-control-sm" id="textDescripcionH" max-length="50" placeholder="Descripción Hom">
        </div>
        <div class="form-group">
            <input type="text" name="textDescripcionM" value="" class="form-control form-control-sm" id="textDescripcionM" max-length="50" placeholder="Descripción Muj">
        </div>
        <div class="form-group">
          <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios"></textarea>
        </div>
    `;
    botonGuardar.classList.remove('d-none');
    botonActualizar.classList.add('d-none');
    llenarComboAreas();
    return templateForm;

}

const guardarRegistrosPuestos = async () => {
    try {
        if(validarArea() && validarPuesto() && validarDescripcionH() && validarDescripcionM() && validarComentario()){
            let formAreasCRUD = document.querySelector('#formAreasCRUD');
            const crearDatos = new FormData(formAreasCRUD);
            fetch('catpuestos/guardarPuestos',{
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
        fetch(`catpuestos/buscarEditarPuestos/${idRegistro}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            respuestas.forEach(editando => {
                const templateForm = document.querySelector('#formAreasCRUD');
                templateForm.innerHTML=`
                    <input type="hidden" name="textArea" value="${editando.CLAVEAREA_PUESTO}" id="textArea">
                    <div class="form-group">
                        <input type="text" name="textPuesto" value="${editando.CLAVE_PUESTO}" class="form-control col-md-4 col-12" id="textPuesto" maxlength="13" placeholder="Puesto" readonly>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textDescripcionH" value="${editando.DESCRIPHOM_PUESTO}" class="form-control" id="textDescripcionH" max-length="50" placeholder="Descripción Hom">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textDescripcionM" value="${editando.DESCRIPMUJ_PUESTO}" class="form-control" id="textDescripcionM" max-length="50" placeholder="Descripción Muj">
                    </div>
                    <div class="form-group">
                      <textarea name="textComentario" cols="40" class="form-control" id="textComentario" max-length="500" rows="4" placeholder="Comentarios">${editando.COMENTARIO_PUESTO}</textarea>
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

const actualizarRegistrosPuestos = async () => {
    try {
        if(validarArea() && validarPuesto() && validarDescripcionH() && validarDescripcionM() && validarComentario()){
            let formAreasCRUD = document.querySelector('#formAreasCRUD');
            const actualizaDatos = new FormData(formAreasCRUD);
            fetch('catpuestos/actualizarPuestos', {
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

const eliminarRegistrosPuestos = async (botonEliminarEl) => {
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
                fetch(`catpuestos/eliminarPuestos/${idRegistro}`)
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

const llenarComboAreas = async () => {
    try{
        let inputCombo = document.querySelector('#textArea');
        inputCombo.innerHTML = '<option value="">Selecciona</option>';
        fetch('catalogos/llenarComboAreas')
        .then(respuestaRender=>respuestaRender.json())
        .then(areas=>{
            areas.forEach(area => {
                const opcionElemento= document.createElement('option');
                opcionElemento.setAttribute('value', area.CLAVE_AREA);
                opcionElemento.classList.add('fuente-12p');
                opcionElemento.innerHTML= area.DESCRIPCION_AREA;
                inputCombo.appendChild(opcionElemento);
            })
        })
        .catch(function(errorAlert){
            return Swal.fire({
                title: 'Error llamado',
                icon: 'error',
                confirmButtonColor: '#f43',
                html: errorAlert.message,
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



function validarArea(){
    let inputForm = document.querySelector("#textArea");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#670A0A',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Puesto es requerido',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Puesto min 4 caracteres',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Puesto máx 12 caracteres',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Descripción H es requerido',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Descripción H min 4 caracteres',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Descripción H máx 12 caracteres',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Descripción M es requerido',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Descripción M min 4 caracteres',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Descripción M máx 12 caracteres',
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
    if(inputForm==null || inputForm==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Comentario es requerido',
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
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Comentario min 4 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);

            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Comentario máx 40 caracteres',
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

function inputLimpiar(){
    plantillaFormulario();
}
