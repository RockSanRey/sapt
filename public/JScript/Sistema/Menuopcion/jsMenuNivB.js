let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector('#botonActualizar');
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
    botonGuardar.addEventListener('click', () => {
        guardarRegistrosMenu();
    })
    botonActualizar.addEventListener('click', () => {
        actualizarRegistrosMenu();
    })
    botonCancelar.addEventListener('click', () => {
        plantillaFormulario();
    })
})

const obtenerListado = async () => {
    try {
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('menunivelb/llenarTablaMenuB')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaDinamica.classList.add('tabla-contenedor');
            const listadoUlNivelA=document.createElement('ul');
            listadoUlNivelA.classList.add('menu-vertical-edit','fuente-12p');
            respuestas[0].forEach(respuesta => {
                const listadoItemUlNivelA=document.createElement('li');
                listadoItemUlNivelA.setAttribute('menu-item-select',respuesta.IDMENU_MENA);
                listadoItemUlNivelA.classList.add('menu-vertical-li-edit');
                listadoItemUlNivelA.innerHTML=`
                    <a><i class="${respuesta.CLASS_MENA}"></i>
                        ${respuesta.DESCRIP_MENA} - ${respuesta.IDMENU_MENA}</a>
                `;
                if(respuesta.CONTOPC_MENA=='SI'){
                    const tablaOpcionesMenuNivelB = document.createElement('table');
                    tablaOpcionesMenuNivelB.classList.add('table', 'table-hover', 'table-sm','mb-0','fuente-14p');
                    tablaOpcionesMenuNivelB.innerHTML=`
                        <thead>
                            <th>Orden</th>
                            <th>Descripción - ID</th>
                            <th>Referencia</th>
                            <th>F Modif.</th>
                            <th>Acciones</th>
                        </thead>
                    `;
                    const cuerpoTablaOpcionesMenuNivelB = document.createElement('tbody');
                    respuestas[1].forEach(responds => {
                        if(respuesta.IDMENU_MENA==responds.IDMENU_MENB){
                            const filaTablaOpcionesMenuNivelB = document.createElement('tr');
                            filaTablaOpcionesMenuNivelB.setAttribute('dataparent',responds.idTablePk);
                            filaTablaOpcionesMenuNivelB.classList.add('menu-vertical-edit-table');
                            const columnaOrdenNivelB = document.createElement('td');
                            columnaOrdenNivelB.innerHTML=responds.ORDEN_MENB;
                            filaTablaOpcionesMenuNivelB.appendChild(columnaOrdenNivelB);
                            const columnaDescripcionNivelB = document.createElement('td');
                            columnaDescripcionNivelB.classList.add('col');
                            columnaDescripcionNivelB.innerHTML=`<i class="${responds.CLASS_MENB}"></i> ${responds.DESCRIP_MENB} - ${responds.IDSMENU_MENB}</a>`;
                            filaTablaOpcionesMenuNivelB.appendChild(columnaDescripcionNivelB);
                            const columnaReferenciaMenuNivelB = document.createElement('td');
                            if(responds.CONTOPC_MENB=='NO'){
                                columnaReferenciaMenuNivelB.innerHTML=responds.REFEREN_MENB;
                            }else {
                                columnaReferenciaMenuNivelB.innerHTML=`-`;
                            }
                            filaTablaOpcionesMenuNivelB.appendChild(columnaReferenciaMenuNivelB);
                            const columnaModifMenuNivelB = document.createElement('td');
                            columnaModifMenuNivelB.innerHTML=responds.FMODIF_MENB;
                            filaTablaOpcionesMenuNivelB.appendChild(columnaModifMenuNivelB);
                            const columnaAccionesMenuNivelB = document.createElement('td');
                            if(responds.TOTAL==0){
                                const botonEditarEl = document.createElement('button');
                                botonEditarEl.classList.add('btn','btn-info','btn-sm');
                                botonEditarEl.setAttribute('data-toggle','modal');
                                botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                                botonEditarEl.setAttribute('dataedit',responds.idTablePk);
                                botonEditarEl.setAttribute('id','botonEditarSel');
                                botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                                botonEditarEl.addEventListener('click',() => {
                                    buscandoDatosEditar(botonEditarEl);
                                });
                                const botonEliminarEl = document.createElement('button');
                                botonEliminarEl.classList.add('btn','btn-danger','btn-sm');
                                botonEliminarEl.setAttribute('dataelim',responds.idTablePk);
                                botonEliminarEl.setAttribute('id','botonEliminarSel');
                                botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                                botonEliminarEl.addEventListener('click',()=>{
                                    eliminarRegistrosMenu(botonEliminarEl);
                                })
                                const grupoAcciones = document.createElement('div');
                                grupoAcciones.classList.add('btn-group','text-center');
                                grupoAcciones.appendChild(botonEditarEl);
                                grupoAcciones.appendChild(botonEliminarEl);
                                columnaAccionesMenuNivelB.appendChild(grupoAcciones);
                            }else {
                                const badgePill = document.createElement('span');
                                badgePill.classList.add('badge','badge-warning','font-weight-bold');
                                const capaToolTipA = document.createElement('div');
                                capaToolTipA.classList.add('tooltip-box');
                                capaToolTipA.innerHTML=responds.TOTAL+'<span class="tooltip-info fuente-12p">Num opciones asignadas</span>';
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
                                columnaAccionesMenuNivelB.classList.add('text-center', 'fuente-18p');
                                columnaAccionesMenuNivelB.appendChild(badgePill);
                            }
                            filaTablaOpcionesMenuNivelB.appendChild(columnaAccionesMenuNivelB);
                            cuerpoTablaOpcionesMenuNivelB.appendChild(filaTablaOpcionesMenuNivelB);
                            tablaOpcionesMenuNivelB.appendChild(cuerpoTablaOpcionesMenuNivelB);

                        }
                    })
                    listadoItemUlNivelA.appendChild(tablaOpcionesMenuNivelB);
                }
                listadoUlNivelA.appendChild(listadoItemUlNivelA);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(listadoUlNivelA);
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
    try {
        let templateForm = document.querySelector('#formMenuCRUD');
        templateForm.innerHTML=`
            <div class="form-group">
                <select name="textMenuA" class="custom-select custom-select-sm" id="textMenuA">
                </select>
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
                <div id="listaBusqueda" class="sys-autocompletados"></div>
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
        let textIcono = document.querySelector('#textIcono');
        textIcono.addEventListener('keyup', (e) => {
            if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode==8){
                completarInputIcono(textIcono.value);
            }
        })
        llenarListadoMenuA();
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

const llenarListadoMenuA = async () => {
    try {
        fetch('menuopcion/llenarComboMenuA')
        .then(respuestaRender => respuestaRender.json())
        .then(respuestas => {
            let textMenuA = document.querySelector('#textMenuA');
            textMenuA.innerHTML='<option value="">Menu nivel A</option>';
            respuestas.forEach(opcionSel => {
                const opcionInput = document.createElement('option');
                opcionInput.setAttribute('value',opcionSel.IDMENU_MENA);
                opcionInput.classList.add('fuente-12p');
                opcionInput.innerHTML=`
                    ${opcionSel.DESCRIP_MENA} - ${opcionSel.IDMENU_MENA}
                `;
                textMenuA.appendChild(opcionInput);
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
    let textClave = document.querySelector('#textClave');
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
        textReferencia.setAttribute('readonly','readonly');
        textReferencia.value=textClave.value;
        textIcono.focus();
    }else {
        capaSeoData.classList.add('d-none');
        textReferencia.removeAttribute('readonly','readonly');
    }
}

const guardarRegistrosMenu = async () => {
    try {
        if(validarMenuA() && validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && validarTooltip() &&
         validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && validarSeoKeyWords() &&
         validarSeoDescripcion()){
            const crearDatos = new FormData(formMenuCRUD);
            fetch('menunivelb/guardarMenuNivelB',{
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
        let templateForm = document.querySelector('#formMenuCRUD');
        templateForm.innerHTML=cargaAnimacion;
        fetch(`menunivelb/buscarEditarMenuB/${idRegistro}`)
        .then(respuestaEditar => respuestaEditar.json())
        .then(editados => {
            editados[0].forEach(menuEdit => {
                templateForm.innerHTML=`
                    <input type="hidden" name="textMenuA" value="${menuEdit.IDMENU_MENB}" id="textMenuA">
                    <div class="form-group">
                        <input type="text" name="textMenuAV" value="${menuEdit.IDMENU_MENB}" class="form-control form-control-sm col-md-6 col-12" id="textMenuAV" autocomplete="off" maxlength="12" placeholder="Raiz" readonly>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textClave" value="${menuEdit.IDSMENU_MENB}" class="form-control form-control-sm col-md-5 col-12" id="textClave" autocomplete="off" maxlength="12" placeholder="Clave" readonly>
                    </div>
                    <div class="row">
                        <div class="form-group col">
                            <input type="number" name="textOrden" value="${menuEdit.ORDEN_MENB}" class="form-control form-control-sm" id="textOrden" autocomplete="off" maxlength="12" placeholder="Orden">
                        </div>
                        <div class="form-group col">
                            <select name="textHijos" class="custom-select custom-select-sm" id="textHijos">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textIcono" value="${menuEdit.CLASS_MENB}" class="form-control form-control-sm col-md-8 col-12" id="textIcono" autocomplete="off" maxlength="30" placeholder="Icono CSS">
                        <div id="listaBusqueda" class="sys-autocompletados"></div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="textReferencia" value="${menuEdit.REFEREN_MENB}" class="form-control form-control-sm col-12" id="textReferencia" autocomplete="off" maxlength="40" placeholder="Referencia">
                    </div>
                    <div class="form-group">
                        <input type="text" name="textDescripcion" value="${menuEdit.DESCRIP_MENB}" class="form-control form-control-sm col-12" id="textDescripcion" autocomplete="off" maxlength="30" placeholder="Descripción">
                    </div>
                        <div class="form-group">
                        <input type="text" name="textTooltip" value="${menuEdit.TITLE_MENB}" class="form-control form-control-sm col-12" id="textTooltip" autocomplete="off" maxlength="40" placeholder="Tooltip Ayuda">
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
                let textIcono = document.querySelector('#textIcono');
                textIcono.addEventListener('keyup', (e) => {
                    if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode==8){
                        completarInputIcono(textIcono.value);
                    }
                })
                let textHijos = document.querySelector('#textHijos');
                seleccionado=menuEdit.CONTOPC_MENB
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

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const actualizarRegistrosMenu = async () => {
    try {
        if(validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && validarTooltip() &&
        validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && validarSeoKeyWords() &&
        validarSeoDescripcion()){
            const formMenuCRUD = document.querySelector('#formMenuCRUD');
            const actualizaDatos = new FormData(formMenuCRUD);
            fetch('menunivelb/actualizarMenuNivelB', {
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

const eliminarRegistrosMenu = async (botonEliminarEl) => {
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
                fetch(`menunivelb/eliminarMenuNivelB/${idRegistro}`)
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

const completarInputIcono = async (textIcono) => {
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
                    const listadoUl = document.createElement('ul');
                    listadoUl.innerHTML='';
                    listadoUl.classList.add('sys-autocompletar-list');
                    iconos.forEach(icono => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('sys-autocompletar-list-item');
                        listadoItemUl.setAttribute('itemIcono',`${icono.FONTCSS_ICONS}`);
                        listadoItemUl.addEventListener('click', () => {
                            let textIconoNuevo =  document.querySelector('#textIcono');
                            textIconoNuevo.value = icono.FONTCSS_ICONS;
                            listaBusqueda.innerHTML='';
                        })
                        listadoItemUl.innerHTML= `
                        <i class="fas ${icono.FONTCSS_ICONS}"></i> ${icono.FONTCSS_ICONS}
                        `;
                        listadoUl.appendChild(listadoItemUl);
                    })
                    listaBusqueda.appendChild(listadoUl);
                }else {
                    listaBusqueda.innerHTML='';
                }
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

function validarMenuA(){
    let inputForm = document.querySelector("#textMenuA");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
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
