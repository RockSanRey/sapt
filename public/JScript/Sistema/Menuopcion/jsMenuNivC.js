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
        fetch('menunivelc/llenarTablaMenuC')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaDinamica.classList.add('tabla-contenedor');
            const listadoUlNivelA=document.createElement('ul');
            listadoUlNivelA.classList.add('menu-vertical-edit','fuente-12p')
            respuestas[0].forEach(respuesta => {
                const listadoItemUlNivelA=document.createElement('li');
                listadoItemUlNivelA.setAttribute('menu-item-select',respuesta.IDMENU_MENA);
                listadoItemUlNivelA.classList.add('menu-vertical-li-edit');
                if(respuesta.CONTOPC_MENA=='SI'){
                    listadoItemUlNivelA.innerHTML=`<a class="dropdown-toggle">
                    <i class="${respuesta.CLASS_MENA}"></i>
                    ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}</a>
                    `;
                    const listadoUlNivelB = document.createElement('ul');
                    listadoUlNivelB.classList.add('menu-vertical-edit');
                    respuestas[1].forEach(respuestb => {
                        if(respuesta.IDMENU_MENA==respuestb.IDMENU_MENB){
                            const listadoItemUlNivelB = document.createElement('li');
                            listadoItemUlNivelB.setAttribute('menu-item-select',respuestb.IDSMENU_MENB);
                            listadoItemUlNivelB.classList.add('menu-vertical-li-edit');
                            if(respuestb.CONTOPC_MENB=='SI'){
                                listadoItemUlNivelB.innerHTML=`<a class="margen-izq-10 dropdown-toggle">
                                <i class="${respuestb.CLASS_MENB}"></i>
                                ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}</a>
                                `;
                                const tablaOpcionesMenuNivelC = document.createElement('table');
                                tablaOpcionesMenuNivelC.classList.add('table', 'table-hover', 'table-sm','mb-0','fuente-14p');
                                tablaOpcionesMenuNivelC.innerHTML=`
                                    <thead>
                                        <th>Orden</th>
                                        <th>Descripción - ID</th>
                                        <th>Referencia</th>
                                        <th>F Modif.</th>
                                        <th>Acciones</th>
                                    </thead>
                                `;
                                const cuerpoTablaOpcionesMenuNivelC = document.createElement('tbody');
                                respuestas[2].forEach(responds => {
                                    if(respuestb.IDSMENU_MENB==responds.IDSMENU_MENC){
                                        const filaTablaOpcionesMenuNivelC = document.createElement('tr');
                                        filaTablaOpcionesMenuNivelC.setAttribute('dataparent',responds.idTablePk);
                                        filaTablaOpcionesMenuNivelC.classList.add('menu-vertical-edit-table');
                                        const columnaOrdenNivelC = document.createElement('td');
                                        columnaOrdenNivelC.innerHTML=responds.ORDEN_MENC;
                                        filaTablaOpcionesMenuNivelC.appendChild(columnaOrdenNivelC);
                                        const columnaDescripcionNivelC = document.createElement('td');
                                        columnaDescripcionNivelC.classList.add('col');
                                        columnaDescripcionNivelC.innerHTML=`<i class="${responds.CLASS_MENC}"></i> ${responds.DESCRIP_MENC} - ${responds.IDSBMENU_MENC}`;
                                        filaTablaOpcionesMenuNivelC.appendChild(columnaDescripcionNivelC);
                                        const columnaReferenciaMenuNivelC = document.createElement('td');
                                        if(responds.CONTOPC_MENC=='NO'){
                                            columnaReferenciaMenuNivelC.innerHTML=responds.REFEREN_MENC;
                                        }else {
                                            columnaReferenciaMenuNivelC.innerHTML='-';
                                        }
                                        filaTablaOpcionesMenuNivelC.appendChild(columnaReferenciaMenuNivelC);
                                        const columnaModifMenuNivelC = document.createElement('td');
                                        columnaModifMenuNivelC.innerHTML=responds.FMODIF_MENC;
                                        filaTablaOpcionesMenuNivelC.appendChild(columnaModifMenuNivelC);
                                        const columnaAccionesMenuNivelC = document.createElement('td');
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
                                            columnaAccionesMenuNivelC.appendChild(grupoAcciones);
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
                                            columnaAccionesMenuNivelC.classList.add('text-center', 'fuente-18p');
                                            columnaAccionesMenuNivelC.appendChild(badgePill);
                                        }
                                        filaTablaOpcionesMenuNivelC.appendChild(columnaAccionesMenuNivelC);
                                        cuerpoTablaOpcionesMenuNivelC.appendChild(filaTablaOpcionesMenuNivelC);
                                        tablaOpcionesMenuNivelC.appendChild(cuerpoTablaOpcionesMenuNivelC);
                                    }
                                })
                                listadoItemUlNivelB.appendChild(tablaOpcionesMenuNivelC);
                            }else {
                                listadoItemUlNivelB.innerHTML=`<a class="margen-izq-10">
                                <i class="${respuestb.CLASS_MENB}"></i>
                                ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}</a>
                                `;
                            }
                            listadoUlNivelB.appendChild(listadoItemUlNivelB)
                            listadoItemUlNivelA.appendChild(listadoUlNivelB)
                        }
                    })
                }else {
                    listadoItemUlNivelA.innerHTML=`<a>
                    <i class="${respuesta.CLASS_MENA}"></i>
                    ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}</a>
                    `;
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
    try{
        let templateForm = document.querySelector('#formMenuCRUD');
        templateForm.innerHTML=`
        <div class="form-group">
            <select name="textMenuA" class="custom-select custom-select-sm" id="textMenuA"></select>
        </div>
        <div class="form-group">
            <select name="textMenuB" class="custom-select custom-select-sm" id="textMenuB"><option value="">---</option></select>
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
        let textMenuA = document.querySelector('#textMenuA');
        textMenuA.addEventListener('change', () => {
            llenarListadoMenuB(textMenuA);
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

const llenarListadoMenuA = async () => {
    try {
        fetch('menuopcion/llenarComboAMenuC')
        .then(respRender => respRender.json())
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
        textReferencia.value='';
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
        textReferencia.value='';
    }
}

const llenarListadoMenuB = async (textMenuA) => {
    try {
        idBusqueda = textMenuA.value;
        if(idBusqueda==null || idBusqueda==''){
            let textMenuB = document.querySelector('#textMenuB');
            textMenuB.innerHTML='<option value="">---</option>';
        }else {
            textMenuB.innerHTML='<option value="">Cargando...</option>';
            fetch(`menuopcion/llenarComboMenuB/${idBusqueda}`)
            .then(respRender => respRender.json())
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

const guardarRegistrosMenu = async () => {
    try {
        if(validarMenuA() && validarMenuB() && validarClave() && validarOrden() && validarHijos() && validarIcono() &&
        validarReferencia() && validarTooltip() && validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() &&
        validarSeoRobot() && validarSeoKeyWords() && validarSeoDescripcion()){
            const crearDatos = new FormData(formMenuCRUD);
            fetch('menunivelc/guardarMenuNivelC',{
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
        fetch(`menunivelc/buscarEditarMenuC/${idRegistro}`)
        .then(respRender => respRender.json())
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
                        <div id="listaBusqueda" class="sys-autocompletados"></div>
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
                let textIcono = document.querySelector('#textIcono');
                textIcono.addEventListener('keyup', (e) => {
                    if(e.keyCode >= 64 && e.keyCode <= 90){
                        completarInputIcono(textIcono.value);
                    }
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
        if(validarMenuB() && validarClave() && validarOrden() && validarHijos() && validarIcono() && validarReferencia() && 
        validarTooltip() && validarDescripcion() && validarSeoTitulo() && validarSeoTituloPant() && validarSeoRobot() && 
        validarSeoKeyWords() && validarSeoDescripcion()){
            const formMenuCRUD = document.querySelector('#formMenuCRUD');
            const actualizaDatos = new FormData(formMenuCRUD);
            fetch('menunivelc/actualizarMenuNivelC', {
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
                fetch(`menunivelc/eliminarMenuNivelC/${idRegistro}`)
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
            .then(respRender=>respRender.json())
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
