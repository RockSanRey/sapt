let formMenuCRUD=document.querySelector('#formMenuCRUD');

let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector('#botonActualizar');
let botonCancelar = document.querySelector('#botonCancelar');
let tablaDinamica = document.querySelector('#tablaDinamica');

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
})

const obtenerListado = async () => {
    try {
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
        fetch('menuopcion/llenarTablaMenuC')
        .then(respuestaRender => respuestaRender.json())
        .then(respuestas => {
            tablaDinamica.innerHTML='';
            const listadoUl=document.createElement('ul');
            listadoUl.classList.add('menu-vertical-edit')
                respuestas[0].forEach(respuesta => {
                    const listadoItemUl=document.createElement('li');
                    listadoItemUl.setAttribute('menu-item-select',respuesta.IDMENU_MENA);
                    listadoItemUl.classList.add('menu-vertical-li-edit');
                    if(respuesta.CONTOPC_MENA=='SI'){
                        listadoItemUl.innerHTML=`<a class="dropdown-toggle">
                        <i class="${respuesta.CLASS_MENA}"></i>
                        ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}</a>
                        `;
                        const listadoUlA = document.createElement('ul');
                        listadoUlA.classList.add('menu-vertical-edit');
                        respuestas[1].forEach(respuestb => {
                            if(respuesta.IDMENU_MENA==respuestb.IDMENU_MENB){
                                const listadoItemUlA = document.createElement('li');
                                listadoItemUlA.setAttribute('menu-item-select',respuestb.IDSMENU_MENB);
                                listadoItemUlA.classList.add('menu-vertical-li-edit');
                                if(respuestb.CONTOPC_MENB=='SI'){
                                    listadoItemUlA.innerHTML=`<a class="margen-izq-10 dropdown-toggle">
                                    <i class="${respuestb.CLASS_MENB}"></i>
                                    ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}</a>
                                    `;
                                    const tablaPrinci = document.createElement('table');
                                    tablaPrinci.classList.add('table', 'table-hover', 'table-sm','mb-0');
                                    const tablaHeader = document.createElement('thead');
                                    const tablaHeaderFila = document.createElement('tr');
                                    tablaHeaderFila.innerHTML=`
                                    <th scope="col">Orden</th>
                                    <th scope="col">Descripción & ID</th>
                                    <th scope="col">F Modif</th>
                                    <th scope="col">Referencia</th>
                                    <th scope="col" class="text-center" colspan="2">Acciones</th>
                                    `;
                                    tablaHeader.appendChild(tablaHeaderFila);
                                    tablaPrinci.appendChild(tablaHeader);
                                    respuestas[2].forEach(responds => {
                                        if(respuestb.IDSMENU_MENB==responds.IDSMENU_MENC){
                                            const filasTabla = document.createElement('tr');
                                            filasTabla.setAttribute('dataparent',responds.idTablePk);
                                            filasTabla.classList.add('menu-vertical-edit-table');
                                            const columnaOrden = document.createElement('td');
                                            columnaOrden.innerHTML=responds.ORDEN_MENC;
                                            filasTabla.appendChild(columnaOrden);
                                            const columnaDescrip = document.createElement('td');
                                            columnaDescrip.classList.add('col');
                                            columnaDescrip.innerHTML=`<i class="${responds.CLASS_MENC}"></i> ${responds.DESCRIP_MENC} - ${responds.IDSBMENU_MENC}`;
                                            filasTabla.appendChild(columnaDescrip);
                                            const columnaModif = document.createElement('td');
                                            columnaModif.innerHTML=responds.FMODIF_MENC;
                                            filasTabla.appendChild(columnaModif);
                                            if(responds.CONTOPC_MENC=='NO'){
                                                const columnaReferencia = document.createElement('td');
                                                columnaReferencia.innerHTML=responds.REFEREN_MENC;
                                                filasTabla.appendChild(columnaReferencia);
                                            }else {
                                                const columnaReferencia = document.createElement('td');
                                                columnaReferencia.innerHTML='-';
                                                filasTabla.appendChild(columnaReferencia);
                                            }
                                            if(responds.TOTAL==0){
                                                const botonEditarEl = document.createElement('button');
                                                botonEditarEl.classList.add('btn','btn-info');
                                                botonEditarEl.setAttribute('data-toggle','modal');
                                                botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                                                botonEditarEl.setAttribute('dataedit',responds.idTablePk);
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
                                                botonEliminarEl.setAttribute('dataelim',responds.idTablePk);
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
                                                badgePill.innerHTML= responds.TOTAL;
                                                const filaBadge = document.createElement('td');
                                                filaBadge.classList.add('text-center', 'fuente-20p');
                                                filaBadge.setAttribute('colspan','2');
                                                filaBadge.appendChild(badgePill);
                                                filasTabla.appendChild(filaBadge);
                                            }

                                            tablaPrinci.appendChild(filasTabla);
                                        }
                                    })
                                    listadoItemUlA.appendChild(tablaPrinci);
                                }else {
                                    listadoItemUlA.innerHTML=`<a class="margen-izq-10">
                                    <i class="${respuestb.CLASS_MENB}"></i>
                                    ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}</a>
                                    `;
                                }
                                listadoUlA.appendChild(listadoItemUlA)
                                listadoItemUl.appendChild(listadoUlA)
                            }
                        })
                    }else {
                        listadoItemUl.innerHTML=`<a>
                        <i class="${respuesta.CLASS_MENA}"></i>
                        ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}</a>
                        `;
                    }
                    listadoUl.appendChild(listadoItemUl);
                tablaDinamica.appendChild(listadoUl);
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
        let templateForm = document.querySelector('#formMenuCRUD');
        templateForm.innerHTML=`
        <div class="form-group">
            <select name="textMenuA" class="custom-select custom-select-sm" id="textMenuA"></select>
        </div>
        <div class="form-group">
            <select name="textMenuB" class="custom-select custom-select-sm" id="textMenuB"></select>
        </div>
        <div class="form-group">
            <input type="text" name="textClave" value="" class="form-control form-control-sm col-md-4 col-12" id="textClave" autocomplete="off" maxlength="12" placeholder="Clave">
        </div>
        <div class="row">
            <div class="form-group col">
                <input type="number" name="textOrden" value="" class="form-control form-control-sm" id="textOrden" autocomplete="off" maxlength="12" placeholder="Orden">
            </div>
            <div class="form-group col">
                <select name="textHijos" class="custom-select custom-select-sm" id="textHijos">
                    <option value="">Seleccione</option>
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
        botonGuardar.setAttribute('style','display:block');
        botonActualizar.setAttribute('style','display:none');
        let listaBusqueda = document.querySelector('#listaBusqueda');
        let textIcono = document.querySelector('#textIcono');
        textIcono.addEventListener('keyup', () => {
            listaBusqueda.innerHTML='';
            completarInputIcono(textIcono.value);
        })
        llenarListadoMenuA();
        let textMenuA = document.querySelector('#textMenuA');
        textMenuA.addEventListener('change', () => {
            llenarListadoMenuB(textMenuA);
        })
        textHijos.addEventListener('change', () => {
            cambioComboHijos(textHijos);
        })
        return templateForm;

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }

}

const llenarListadoMenuA = async () => {
    try {
        fetch('menuopcion/llenarComboAMenuC')
        .then(respuestaRender => respuestaRender.json())
        .then(respuestas => {
            let textMenuA = document.querySelector('#textMenuA');
            textMenuA.innerHTML='<option value="">Menu nivel A</option>';
            respuestas.forEach(opcionSel => {
                const opcionInput = document.createElement('option');
                opcionInput.setAttribute('value',opcionSel.IDMENU_MENA);
                opcionInput.innerHTML=`
                    ${opcionSel.DESCRIP_MENA} - ${opcionSel.IDMENU_MENA}
                `;
                textMenuA.appendChild(opcionInput);
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

const cambioComboHijos = async (textHijos) => {
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
}

const llenarListadoMenuB = async (textMenuA) => {
    try {
        idBusqueda = textMenuA.value;
        if(idBusqueda==null || idBusqueda==''){
            let textMenuB = document.querySelector('#textMenuB');
            textMenuB.innerHTML='<option value="">Selecciona</option>';
        }else {
            textMenuB.innerHTML='<option value="">Cargando...</option>';
            fetch(`menuopcion/llenarComboMenuB/${idBusqueda}`)
            .then(respuestaRender => respuestaRender.json())
            .then(respuestas => {
                let textMenuB = document.querySelector('#textMenuB');
                if(respuestas.estatus=='error'){
                    textMenuB.innerHTML='<option value="">---</option>';
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#51BB0F',
                        html: respuestas.text,
                    })
                }else{
                    textMenuB.innerHTML='<option value="">Menu nivel B</option>';
                    respuestas.forEach(opcionSel => {
                        const opcionInput = document.createElement('option');
                        opcionInput.setAttribute('value',opcionSel.IDSMENU_MENB);
                        opcionInput.innerHTML=`
                        ${opcionSel.DESCRIP_MENB} - ${opcionSel.IDSMENU_MENB}
                        `;
                        textMenuB.appendChild(opcionInput);
                        textMenuB.focus();
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
        if(validarMenuA() && validarMenuB() && validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && validarTooltip() && validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && validarSeoKeyWords() && validarSeoDescripcion()){
            const crearDatos = new FormData(formMenuCRUD);
            fetch('menuopcion/datosGuardarMenuC',{
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
        let templateForm = document.querySelector('#formMenuCRUD');
        templateForm.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
        fetch(`menuopcion/buscarEditarMenuC/${idRegistro}`)
        .then(respuestaEditar => respuestaEditar.json())
        .then(editados => {
            editados[0].forEach(editando => {
                templateForm.innerHTML=`
                    <input type="hidden" name="textMenuB" value="${editando.IDSMENU_MENC}" id="textMenuB">
                    <div class="form-group">
                        <input type="text" name="textMenuBV" value="${editando.IDSMENU_MENC} - ${editando.DESCRIP_MENC}" class="form-control form-control-sm col-md-8 col-12" id="textMenuBV" autocomplete="off" maxlength="12" placeholder="Raiz" readonly>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textClave" value="${editando.IDSBMENU_MENC}" class="form-control form-control-sm col-md-4 col-12" id="textClave" autocomplete="off" maxlength="12" placeholder="Clave" readonly>
                    </div>
                    <div class="row">
                        <div class="form-group col">
                            <input type="number" name="textOrden" value="${editando.ORDEN_MENC}" class="form-control form-control-sm" id="textOrden" autocomplete="off" maxlength="12" placeholder="Orden">
                        </div>
                        <div class="form-group col">
                            <select name="textHijos" class="custom-select custom-select-sm" id="textHijos"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textIcono" value="${editando.CLASS_MENC}" class="form-control form-control-sm col-md-8 col-12" id="textIcono" autocomplete="off" maxlength="30" placeholder="Icono CSS">
                        <div id="listaBusqueda" class="autocompletados"></div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textReferencia" value="${editando.REFEREN_MENC}" class="form-control form-control-sm col-12" id="textReferencia" autocomplete="off" maxlength="40" placeholder="Referencia">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textDescripcion" value="${editando.DESCRIP_MENC}" class="form-control form-control-sm col-12" id="textDescripcion" autocomplete="off" maxlength="30" placeholder="Descripción">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textTooltip" value="${editando.TITLE_MENC}" class="form-control form-control-sm col-12" id="textTooltip" autocomplete="off" maxlength="40" placeholder="Tooltip Ayuda">
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
                seleccionado=editando.CONTOPC_MENC
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
        if(validarMenuB() && validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && validarTooltip() && validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && validarSeoKeyWords() && validarSeoDescripcion()){
            const formMenuCRUD = document.querySelector('#formMenuCRUD');
            const actualizaDatos = new FormData(formMenuCRUD);
            fetch('menuopcion/datosActualizarMenuC', {
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
                fetch(`menuopcion/datosEliminarMenuC/${idRegistro}`)
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
    inputLimpiar();
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
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }

}

function validarMenuA(){
    let inputForm = document.querySelector("#textMenuA");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Menu Raíz es requerido',
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

function validarMenuB(){
    let inputForm = document.querySelector("#textMenuB");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Menu Raíz B es requerido',
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

    }else {
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

function inputLimpiar(){
    let textMenuA = document.querySelector("#textMenuA");
    let textMenuB = document.querySelector("#textMenuB");
    let textClave = document.querySelector("#textClave");
    let textOrden = document.querySelector("#textOrden");
    let textHijos = document.querySelector("#textHijos");
    let textIcono = document.querySelector("#textIcono");
    let textReferencia = document.querySelector("#textReferencia");
    let textTooltip = document.querySelector("#textTooltip");
    let textDescripcion = document.querySelector("#textDescripcion");
    textMenuA.value = textMenuB.value = textClave.value = textOrden.value = textHijos.value = textIcono.value = textReferencia.value = textTooltip.value = textDescripcion.value = "";
}
