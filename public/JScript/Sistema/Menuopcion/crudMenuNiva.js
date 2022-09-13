let formMenuCRUD=document.querySelector('#formMenuCRUD');

let tablaDinamica = document.querySelector('#tablaDinamica');
let botonCancelar = document.querySelector('#botonCancelar');
let botonGuardar = document.querySelector('#botonGuardar');

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
})

const obtenerListado = async () => {
    try {
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
        fetch('menuopcion/llenarTablaMenuA')
        .then(respuestaRender => respuestaRender.json())
        .then(respuestas => {
            tablaDinamica.innerHTML=`
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Orden</th>
                            <th scope="col">Descripción & ID</th>
                            <th scope="col">F Modif</th>
                            <th scope="col">Referencia</th>
                            <th scope="col" class="text-center" colspan="2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaOpcionesMenu">
                    </tbody>
                </table>
            `;
            let tablaOpcionesMenu = document.querySelector('#tablaOpcionesMenu');
            respuestas.forEach(respuesta => {
                const filasTabla = document.createElement('tr');
                filasTabla.setAttribute('dataparent',respuesta.idTablePk);
                filasTabla.classList.add('menu-vertical-edit-table');
                const columnaOrden = document.createElement('td');
                columnaOrden.innerHTML = respuesta.ORDEN_MENA;
                filasTabla.appendChild(columnaOrden);
                const columnaDescrip = document.createElement('td');
                columnaDescrip.classList.add('col');
                columnaDescrip.innerHTML=`<i class="${respuesta.CLASS_MENA}"></i> ${respuesta.DESCRIP_MENA} - ${respuesta.IDMENU_MENA}`
                filasTabla.appendChild(columnaDescrip);
                const columnaModif = document.createElement('td');
                columnaModif.innerHTML=respuesta.FMODIF_MENA;
                filasTabla.appendChild(columnaModif);
                if(respuesta.CONTOPC_MENA=='NO'){
                    const columnaReferencia = document.createElement('td');
                    columnaReferencia.innerHTML=respuesta.REFEREN_MENA;
                    filasTabla.appendChild(columnaReferencia);
                }else {
                    const columnaReferencia = document.createElement('td');
                    columnaReferencia.innerHTML='-';
                    filasTabla.appendChild(columnaReferencia);
                }
                if(respuesta.TOTAL==0){
                    const botonEditarEl = document.createElement('button');
                    botonEditarEl.classList.add('btn','btn-info');
                    botonEditarEl.setAttribute('data-toggle','modal');
                    botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEditarEl.setAttribute('dataedit',respuesta.idTablePk);
                    botonEditarEl.setAttribute('id','botonEditarSel');
                    botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarEl.addEventListener('click',() => {
                        buscandoDatosEditar(botonEditarEl);
                    });
                    const filaBoton = document.createElement('td');
                    filaBoton.appendChild(botonEditarEl);
                    filasTabla.appendChild(filaBoton);
                    const botonEliminarEl = document.createElement('button');
                    botonEliminarEl.classList.add('btn','btn-danger');
                    botonEliminarEl.setAttribute('dataelim',respuesta.idTablePk);
                    botonEliminarEl.setAttribute('id','botonEliminarSel');
                    botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarEl.addEventListener('click',()=>{
                        eliminarRegistros(botonEliminarEl);
                    })
                    const filaBoton2 = document.createElement('td');
                    filaBoton2.appendChild(botonEliminarEl);
                    filasTabla.appendChild(filaBoton2);
                }else {
                    const badgePill = document.createElement('span');
                    badgePill.classList.add('badge','badge-pill','badge-warning');
                    badgePill.setAttribute('data-toggle','tooltip');
                    badgePill.setAttribute('data-placement','top');
                    badgePill.setAttribute('title','Numero de relaciones asignadas');
                    badgePill.innerHTML= respuesta.TOTAL;
                    const filaBadge = document.createElement('td');
                    filaBadge.classList.add('text-center', 'fuente-20p');
                    filaBadge.setAttribute('colspan','2');
                    filaBadge.appendChild(badgePill);
                    filasTabla.appendChild(filaBadge);
                }
                tablaOpcionesMenu.appendChild(filasTabla);
            });
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
        console.error(errorAlert.type);
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
        let formMenuCRUD = document.querySelector('#formMenuCRUD');
        formMenuCRUD.innerHTML=`
            <div class="form-group">
                <input type="text" name="textClave" value="" class="form-control form-control-sm col-md-4 col-12" id="textClave" autocomplete="off" maxlength="12" placeholder="Clave" autofocus>
            </div>
            <div class="row no-gutters">
                <div class="form-group col-md-6 col-sm-6">
                    <input type="number" name="textOrden" value="" class="form-control form-control-sm" id="textOrden" autocomplete="off" maxlength="12" placeholder="Orden">
                </div>
                <div class="form-group col-md-6 col-sm-6">
                    <select name="textHijos" class="custom-select custom-select-sm" id="textHijos">
                        <option value="">Tiene opciones</option>
                        <option value="SI">Si tiene</option>
                        <option value="NO">No tiene</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <input type="text" name="textIcono" value="" class="form-control form-control-sm col-md-8 col-12" id="textIcono" autocomplete="off" maxlength="30" placeholder="Icono CSS">
                <div id="listaBusqueda" class="autocompletados"></div>
            </div>
            <div class="form-group">
                <input type="text" name="textReferencia" value="" class="form-control form-control-sm col-12" id="textReferencia" autocomplete="off" maxlength="40" placeholder="Referencia">
            </div>
            <div class="form-group">
                <input type="text" name="textDescripcion" value="" class="form-control form-control-sm col-12" id="textDescripcion" autocomplete="off" maxlength="30" placeholder="Descripción">
            </div>
            <div class="form-group">
                <input type="text" name="textTooltip" value="" class="form-control form-control-sm col-12" id="textTooltip" autocomplete="off" maxlength="40" placeholder="Tooltip Ayuda">
            </div>
            <div id="capaSeoData">
                <div class="form-group">
                    <input type="text" name="textSeoTitulo" value="" class="form-control form-control-sm col-12" id="textSeoTitulo" autocomplete="off" maxlength="40" placeholder="Titulo SEO">
                </div>
                <div class="form-group">
                    <input type="text" name="textSeoTituloPant" value="" class="form-control form-control-sm col-12" id="textSeoTituloPant" autocomplete="off" maxlength="40" placeholder="Titulo Pantalla SEO">
                </div>
                <div class="form-group">
                    <input type="text" name="textSeoRobots" value="" class="form-control form-control-sm col-12" id="textSeoRobots" autocomplete="off" maxlength="40" placeholder="Robots SEO">
                </div>
                <div class="form-group">
                    <input type="text" name="textSeoKeyWords" value="" class="form-control form-control-sm col-12" id="textSeoKeyWords" autocomplete="off" maxlength="40" placeholder="Keywords SEO">
                </div>
                <div class="form-group">
                    <textarea name="textSeoDescripcion" class="form-control form-control-sm col-12" id="textSeoDescripcion" maxlength="250" placeholder="Descripción SEO"></textarea>
                </div>
            </div>
        `;
        let capaSeoData = document.querySelector('#capaSeoData');
        capaSeoData.classList.add('d-none');
        let botonActualizar = document.querySelector('#botonActualizar');
        botonGuardar.setAttribute('style','display:block');
        botonActualizar.setAttribute('style','display:none');
        let listaBusqueda = document.querySelector('#listaBusqueda');
        let textIcono = document.querySelector('#textIcono');
        let textHijos = document.querySelector('#textHijos');
        textIcono.addEventListener('keyup', () => {
            listaBusqueda.innerHTML='';
            completarInputIcono(textIcono.value);
        })
        textHijos.addEventListener('change', () => {
            cambioComboHijos(textHijos);
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

const cambioComboHijos = async (textHijos) => {
    try{
        let textReferencia = document.querySelector('#textReferencia');
        let textDescripcion = document.querySelector('#textDescripcion');
        let capaSeoData = document.querySelector('#capaSeoData');
        let textIcono = document.querySelector('#textIcono');
        valorHijos=textHijos.value;
        if(valorHijos=='SI'){
            capaSeoData.classList.add('d-none');
            textReferencia.setAttribute('readonly','readonly');
            textDescripcion.value="";
            textIcono.focus();
        }else if (valorHijos=='NO') {
            capaSeoData.classList.remove('d-none');
            textReferencia.removeAttribute('readonly','readonly');
            textIcono.focus();
        }else {
            capaSeoData.classList.add('d-none');
            textReferencia.removeAttribute('readonly','readonly');
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

botonGuardar.addEventListener('click', () => {
    try {
        if(validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && validarTooltip() &&
         validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && validarSeoKeyWords() && validarSeoDescripcion()){
            const crearDatos = new FormData(formMenuCRUD);
            fetch('menuopcion/datosGuardarMenuA',{
                method: 'POST',
                body: crearDatos,
            })
            .then(respuesta=>respuesta.json())
            .then(data => {
                return Swal.fire({
                    title: data.title,
                    icon: data.icon,
                    confirmButtonText: `${data.button}`,
                    confirmButtonColor: '#51BB0F',
                    html: data.text,
                }).then((result) => {
                    if(result.isConfirmed){
                        if(data.estatus=='guardado'){
                            obtenerListado();
                            plantillaFormulario();
                            botonCancelar.click();
                        }

                    }
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
        }

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
})

const buscandoDatosEditar = async (botonEditarEl) => {
    try {
        let idRegistro = botonEditarEl.attributes.dataedit.value
        fetch(`menuopcion/buscarEditarMenuA/${idRegistro}`)
        .then(respuestaEditar => respuestaEditar.json())
        .then(editados => {
            editados[0].forEach(menuEdit => {
                const templateForm = document.querySelector('#formMenuCRUD');
                templateForm.innerHTML=`
                    <input type="hidden" name="textClave" value="${menuEdit.IDMENU_MENA}" id="textClave">
                    <div class="form-group">
                        <input type="text" name="textClaveV" value="${menuEdit.IDMENU_MENA}" class="form-control form-control-sm col-md-4 col-12" id="textClaveV" autocomplete="off" maxlength="12" placeholder="Clave" readonly>
                    </div>
                    <div class="row no-gutters">
                        <div class="form-group col-6">
                            <input type="number" name="textOrden" value="${menuEdit.ORDEN_MENA}" class="form-control form-control-sm" id="textOrden" autocomplete="off" maxlength="12" placeholder="Orden">
                        </div>
                        <div class="form-group col-6">
                            <select name="textHijos" class="custom-select custom-select-sm" id="textHijos">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textIcono" value="${menuEdit.CLASS_MENA}" class="form-control form-control-sm col-md-8 col-12" id="textIcono" autocomplete="off" maxlength="30" placeholder="Icono CSS">
                        <div id="listaBusqueda" class="autocompletados"></div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textReferencia" value="${menuEdit.REFEREN_MENA}" class="form-control form-control-sm col-12" id="textReferencia" autocomplete="off" maxlength="40" placeholder="Referencia">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textDescripcion" value="${menuEdit.DESCRIP_MENA}" class="form-control form-control-sm col-12" id="textDescripcion" autocomplete="off" maxlength="30" placeholder="Descripción">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textTooltip" value="${menuEdit.TITLE_MENA}" class="form-control form-control-sm col-12" id="textTooltip" autocomplete="off" maxlength="40" placeholder="Tooltip Ayuda">
                    </div>
                    <div id="capaSeoData">
                        <div class="form-group">
                            <input type="text" name="textSeoTitulo" value="" class="form-control form-control-sm col-12" id="textSeoTitulo" autocomplete="off" maxlength="40" placeholder="Titulo SEO">
                        </div>
                        <div class="form-group">
                            <input type="text" name="textSeoTituloPant" value="" class="form-control form-control-sm col-12" id="textSeoTituloPant" autocomplete="off" maxlength="40" placeholder="Titulo Pantalla SEO">
                        </div>
                        <div class="form-group">
                            <input type="text" name="textSeoRobots" value="" class="form-control form-control-sm col-12" id="textSeoRobots" autocomplete="off" maxlength="40" placeholder="Robots SEO">
                        </div>
                        <div class="form-group">
                            <input type="text" name="textSeoKeyWords" value="" class="form-control form-control-sm col-12" id="textSeoKeyWords" autocomplete="off" maxlength="40" placeholder="Keywords SEO">
                        </div>
                        <div class="form-group">
                            <textarea name="textSeoDescripcion" class="form-control form-control-sm col-12" id="textSeoDescripcion" maxlength="250" placeholder="Descripción SEO"></textarea>
                        </div>
                    </div>
                `;
                let capaSeoData = document.querySelector('#capaSeoData');
                capaSeoData.classList.add('d-none');
                botonGuardar.setAttribute('style','display:none');
                botonActualizar.setAttribute('style','display:block');
                let listaBusqueda = document.querySelector('#listaBusqueda');
                let textIcono = document.querySelector('#textIcono');
                textIcono.addEventListener('keyup', () => {
                    listaBusqueda.innerHTML='';
                    completarInputIcono(textIcono.value);
                })
                let textHijos = document.querySelector('#textHijos');
                seleccionado=menuEdit.CONTOPC_MENA
                if(seleccionado=='SI'){
                    capaSeoData.classList.add('d-none');
                    textHijos.innerHTML='<option value="">Seleccione</option>';
                    textHijos.innerHTML=`
                        <option value="SI" selected="selected">Si tiene</option>
                        <option value="NO">No tiene</option>
                    `;
                }else {
                    capaSeoData.classList.remove('d-none');
                    textHijos.innerHTML='<option value="">Seleccione</option>';
                    textHijos.innerHTML=`
                        <option value="SI">Si tiene</option>
                        <option value="NO" selected="selected">No tiene</option>
                    `;
                }
                textHijos.addEventListener('change', () => {
                    cambioComboHijos(textHijos);
                })
            })
            let capaSeoData = document.querySelector('#capaSeoData');
            editados[1].forEach(seoEdit => {
                capaSeoData.innerHTML=`
                    <div class="form-group">
                        <input type="text" name="textSeoTitulo" value="${seoEdit.TITULO_CONW}" class="form-control form-control-sm col-12" id="textSeoTitulo" autocomplete="off" maxlength="40" placeholder="Titulo SEO">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textSeoTituloPant" value="${seoEdit.TITULOPANT_CONW}" class="form-control form-control-sm col-12" id="textSeoTituloPant" autocomplete="off" maxlength="40" placeholder="Titulo Pantalla SEO">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textSeoRobots" value="${seoEdit.ROBOTS_CONW}" class="form-control form-control-sm col-12" id="textSeoRobots" autocomplete="off" maxlength="40" placeholder="Robots SEO">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textSeoKeyWords" value="${seoEdit.KEYWORD_CONW}" class="form-control form-control-sm col-12" id="textSeoKeyWords" autocomplete="off" maxlength="40" placeholder="Keywords SEO">
                    </div>
                    <div class="form-group">
                        <textarea name="textSeoDescripcion" class="form-control form-control-sm col-12" id="textSeoDescripcion" maxlength="250" placeholder="Descripción SEO">${seoEdit.DESCRIPCION_CONW}</textarea>
                    </div>

                `;
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
        console.error(errorAlert.type);
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

botonActualizar.addEventListener('click', () => {
    try {
        if(validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && validarTooltip() && validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && validarSeoKeyWords() && validarSeoDescripcion()){
            const formMenuCRUD = document.querySelector('#formMenuCRUD');
            const actualizaDatos = new FormData(formMenuCRUD);
            fetch('menuopcion/datosActualizarMenuA', {
                method: 'POST',
                body: actualizaDatos,
            })
            .then(respuestaEditar=>respuestaEditar.json())
            .then(actualizado => {
                return Swal.fire({
                    title: actualizado.title,
                    icon: actualizado.icon,
                    confirmButtonText: `${actualizado.button}`,
                    confirmButtonColor: '#51BB0F',
                    html: actualizado.text,
                }).then((result) => {
                    if(result.isConfirmed){
                        if(actualizado.estatus=='guardado'){
                            obtenerListado();
                            plantillaFormulario();
                            botonCancelar.click();
                        }
                    }
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
        }
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
})

function eliminarRegistros(botonEliminarEl){
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
                fetch(`menuopcion/datosEliminarMenuA/${idRegistro}`)
                .then(respuestaEl=>respuestaEl.json())
                .then(eliminado=>{
                    if(eliminado.estatus=='eliminado'){
                        botonEliminarEl.parentNode.parentNode.remove();
                        return Swal.fire({
                            title: eliminado.title,
                            icon: eliminado.icon,
                            confirmButtonText: `${eliminado.button}`,
                            confirmButtonColor: '#51BB0F',
                            html: eliminado.text,
                        })
                    }
                })
            }
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
        console.error(errorAlert.type);
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })

    }

}

botonCancelar.addEventListener('click', () => {
    plantillaFormulario();
})

function completarInputIcono(textIcono) {
    let listaBusqueda = document.querySelector('#listaBusqueda');
    listaBusqueda.innerHTML='';
    try {
        if(textIcono==null || textIcono=='' || textIcono.length === 0){
            listaBusqueda.innerHTML='';
        }else {
            listaBusqueda.innerHTML='';
            fetch(`menuopcion/buscarIconos/${textIcono}`)
            .then(respuestaRender=>respuestaRender.json())
            .then(iconos => {
                if(iconos.length > 0){
                    listaBusqueda.innerHTML='';
                    const ListadoUl = document.createElement('ul');
                    ListadoUl.innerHTML='';
                    ListadoUl.classList.add('list-group', 'list-group-flush');
                    iconos.forEach(icono => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('list-group-item');
                        listadoItemUl.setAttribute('itemIcono',`${icono.FONTCSS_ICONS}`);
                        listadoItemUl.addEventListener('click', () => {
                            let textIconoNuevo =  document.querySelector('#textIcono');
                            textIconoNuevo.value = icono.FONTCSS_ICONS;
                            ListadoUl.innerHTML='';
                        })
                        listadoItemUl.innerHTML= `
                        <i class="fas ${icono.FONTCSS_ICONS}"></i> ${icono.FONTCSS_ICONS}
                        `;
                        ListadoUl.appendChild(listadoItemUl);
                    })
                    listaBusqueda.appendChild(ListadoUl);
                }else {
                    listaBusqueda.innerHTML='';
                }
            })
            .catch(function(errorAlert){
                return Swal.fire({
                    title: 'Error llamado',
                    icon: 'error',
                    confirmButtonColor: '#f43',
                    html: errorAlert.message,
                })
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

function validarClave(){
    let inputForm = document.querySelector("#textClave");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
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
            confirmButtonColor: '#B80C21',
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
            confirmButtonColor: '#B80C21',
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

function validarOrden(){
    let inputForm = document.querySelector("#textOrden");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Orden es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (isNaN(inputForm.value)) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Orden debe ser numerico',
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

function validarHijos(){
    let inputForm = document.querySelector("#textHijos");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Dependencia requerido',
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

function validarIcono(){
    let inputForm = document.querySelector("#textIcono");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Ícono es requerido',
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

function validarReferencia(){
    let inputHijos = document.querySelector("#textHijos");
    let inputForm = document.querySelector("#textReferencia");
    if(inputHijos.value=='SI'){
        if(inputForm.length > 40){
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Referencia es max 40 caracteres',
            }).then((result)=>{
                if(result.isConfirmed){
                    inputError(inputForm);
                }
            })
            return false;
        }
        inputValido(inputForm);
        return true;
    }else {
        if(inputForm.value==null || inputForm.value==''){
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Referencia es requerido',
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
}

function validarTooltip(){
    let inputForm = document.querySelector("#textTooltip");
    if(inputForm.length < 4) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Tooltip min 4 caracteres',
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
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Tooltip máx 12 caracteres',
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
            confirmButtonColor: '#B80C21',
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
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Descripción min 4 caracteres',
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
            confirmButtonColor: '#B80C21',
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

function validarSeoTitulo(){
    let inputForm = document.querySelector("#textSeoTitulo");
    let inputSelect = document.querySelector('#textHijos');
    if(inputSelect.value=='NO'){
        if(inputForm.value==null || inputForm.value==''){
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Título SEO es requerido',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Título SEO min 3 caracteres',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Título SEO máx 40 caracteres',
            }).then((result)=>{
                if(result.isConfirmed){
                    inputError(inputForm);
                }
            })
            return false;
        }
        inputValido(inputForm);
        return true;

    }else {
        return true;
    }

}

function validarSeoTituloPant(){
    let inputForm = document.querySelector("#textSeoTituloPant");
    let inputSelect = document.querySelector('#textHijos');
    if(inputSelect.value=='NO'){
        if(inputForm.value==null || inputForm.value==''){
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Título Pantalla SEO es requerido',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Título Pantalla SEO min 3 caracteres',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Título Pantalla SEO máx 40 caracteres',
            }).then((result)=>{
                if(result.isConfirmed){
                    inputError(inputForm);
                }
            })
            return false;
        }
        inputValido(inputForm);
        return true;

    }else {
        return true;
    }
}

function validarSeoRobot(){
    let inputForm = document.querySelector("#textSeoRobots");
    let inputSelect = document.querySelector('#textHijos');
    if(inputSelect.value=='NO'){
        if(inputForm.value==null || inputForm.value==''){
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Robot SEO es requerido',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Robot SEO min 3 caracteres',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Robot SEO máx 40 caracteres',
            }).then((result)=>{
                if(result.isConfirmed){
                    inputError(inputForm);
                }
            })
            return false;
        }
        inputValido(inputForm);
        return true;

    }else{
        return true;
    }
}

function validarSeoKeyWords(){
    let inputForm = document.querySelector("#textSeoKeyWords");
    let inputSelect = document.querySelector('#textHijos');
    if(inputSelect.value=='NO'){
        if(inputForm.length > 50) {
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Keywords SEO máx 50 caracteres',
            }).then((result)=>{
                if(result.isConfirmed){
                    inputError(inputForm);
                }
            })
            return false;
        }
        inputValido(inputForm);
        return true;

    }else {
        return true;
    }
}

function validarSeoDescripcion(){
    let inputForm = document.querySelector("#textSeoDescripcion");
    let inputSelect = document.querySelector('#textHijos');
    if(inputSelect.value=='NO'){
        if(inputForm.value==null || inputForm.value==''){
            Swal.fire({
                title: 'Campo Error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Descripción SEO es requerido',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Descripción SEO min 3 caracteres',
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
                confirmButtonColor: '#B80C21',
                icon: 'error',
                text: 'Descripción SEO máx 40 caracteres',
            }).then((result)=>{
                if(result.isConfirmed){
                    inputError(inputForm);
                }
            })
            return false;
        }
        inputValido(inputForm);
        return true;

    }else {
        return true;
    }
}

function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
