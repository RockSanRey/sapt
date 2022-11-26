let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
    botonGuardar.addEventListener('click', () => {
        guardarRegistrosPerfiles();
    })
    botonActualizar.addEventListener('click', () => {
        actualizarRegistroPerfiles();
    })
    botonCancelar.addEventListener('click', () => {
        plantillaFormulario();
    })
})

const obtenerListado = async () => {
    try {
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('catperfiles/llenarTablaPerfiles')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaDinamica.classList.add('tabla-contenedor');
            const tablaListaPerfiles = document.createElement('table');
            tablaListaPerfiles.classList.add('table','table-sm','table-hover','fuente-14p');
            tablaListaPerfiles.innerHTML=`
                <thead>
                    <th>Clave</th>
                    <th>Opciones</th>
                    <th>F Modif</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaListaPerfiles = document.createElement('tbody');
            respuestas.forEach(perfil => {
                const filasTablaListaPerfiles = document.createElement('tr');
                filasTablaListaPerfiles.setAttribute('dataparent',perfil.idTablePk);
                filasTablaListaPerfiles.innerHTML += `
                <td>${perfil.CLAVE_PERF}</td>
                <td class="fuente-10p">${perfil.PERFIL_PERF}</td>
                <td>${perfil.FMODIF_PERF}</td>
                `;
                const columnaAcciones = document.createElement('td');
                const badgePill = document.createElement('span');
                badgePill.classList.add('badge','badge-warning','font-weight-bold');
                const capaToolTipA = document.createElement('div');
                capaToolTipA.classList.add('tooltip-box');
                capaToolTipA.innerHTML=perfil.TOTAL+'<span class="tooltip-info fuente-12p">Perfiles Asignados</span>';
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
                const columnaBadge = document.createElement('td');
                columnaBadge.classList.add('text-center', 'fuente-18p');
                columnaBadge.appendChild(badgePill);
                filasTablaListaPerfiles.appendChild(columnaBadge);
                const botonEditarEl = document.createElement('button');
                botonEditarEl.classList.add('btn','btn-info','btn-sm');
                botonEditarEl.setAttribute('data-toggle','modal');
                botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                botonEditarEl.setAttribute('dataedit',perfil.idTablePk);
                botonEditarEl.setAttribute('id','botonEditarSel');
                botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                botonEditarEl.addEventListener('click',() => {
                    buscandoDatosEditar(botonEditarEl);
                });
                const filaBoton = document.createElement('td');
                filaBoton.appendChild(botonEditarEl);
                filasTablaListaPerfiles.appendChild(filaBoton);
                const botonEliminarEl = document.createElement('button');
                botonEliminarEl.classList.add('btn','btn-danger','btn-sm');
                botonEliminarEl.setAttribute('dataelim',perfil.idTablePk);
                botonEliminarEl.setAttribute('id','botonEliminarSel');
                botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                botonEliminarEl.addEventListener('click',()=>{
                    eliminarRegistrosPerfiles(botonEliminarEl);
                })
                const grupoAcciones = document.createElement('div');
                grupoAcciones.classList.add('btn-group','text-center');
                grupoAcciones.appendChild(botonEditarEl);
                grupoAcciones.appendChild(botonEliminarEl);
                columnaAcciones.appendChild(grupoAcciones);
                filasTablaListaPerfiles.appendChild(columnaAcciones);
                cuerpoTablaListaPerfiles.appendChild(filasTablaListaPerfiles);
                tablaListaPerfiles.appendChild(cuerpoTablaListaPerfiles);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(tablaListaPerfiles);
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
            <select name="textArea" value="" class="custom-select custom-select-sm col-12" id="textArea"></select>
        </div>
        <div class="form-group">
            <select name="textPuesto" value="" class="custom-select custom-select-sm col-12" id="textPuesto">
                <option value="">---</option>
            </select>
        </div>
        <div class="form-group">
          <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios"></textarea>
        </div>
        <div class="lista-contenedor" id="menuPerfiles">
        </div>
    `;
    botonGuardar.classList.remove('d-none');
    botonActualizar.classList.add('d-none');
    llenarComboAreas();
    armarMenuPerfilNuevo();
    let textArea = document.querySelector('#textArea');
    textArea.addEventListener('change', () => {
        llenarComboPuestos(textArea);
    })
    return templateForm;

}

const guardarRegistrosPerfiles = async () => {
    try {
        if(validarArea() && validarPuesto() && validarComentario() && validarRoles()){
            const crearDatos = new FormData(formAreasCRUD);
            fetch('catperfiles/guardarPerfiles',{
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender=>respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='nosesion' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado'){
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
        let templateForm = document.querySelector('#formAreasCRUD');
        templateForm.innerHTML=cargaAnimacion;
        let idRegistro = botonEditarEl.attributes.dataedit.value
        fetch(`catperfiles/buscarEditarPerfiles/${idRegistro}`)
        .then(respuestaEditar => respuestaEditar.json())
        .then(respuestas => {
            respuestas.forEach(respuesta => {
                templateForm.innerHTML=`
                    <input type="hidden" name="textPuesto" value="${respuesta.CLAVE_PERF}" id="textPuesto">
                    <div class="form-group">
                        <input type="text" name="textPuestoV" value="${respuesta.CLAVE_PERF}" class="form-control form-control-sm col-md-4 col-12" id="textPuestoV" maxlength="13" placeholder="Puesto" readonly>
                    </div>
                    <div class="form-group">
                      <textarea name="textComentario" cols="40" class="form-control form-control-sm" id="textComentario" max-length="500" rows="4" placeholder="Comentarios">${respuesta.COMENTS_PERF}</textarea>
                    </div>
                    <div class="lista-contenedor" id="menuPerfiles">
                    </div>
                `;
                botonGuardar.classList.add('d-none');
                botonActualizar.classList.remove('d-none');
                rolesSelecionados=respuesta.PERFIL_PERF;
                armarMenuPerfilEditar(rolesSelecionados);
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

const actualizarRegistroPerfiles = async () => {
    try {
        if(validarPuesto() && validarComentario() && validarRoles()){
            const formAreasCRUD = document.querySelector('#formAreasCRUD');
            const actualizaDatos = new FormData(formAreasCRUD);
            fetch('catperfiles/actualizarPerfiles', {
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

const llenarComboAreas = async () => {
    let inputCombo = document.querySelector('#textArea');
    inputCombo.innerHTML = '<option value="">Área</option>';
    fetch('catalogos/llenarComboAreas')
    .then(respuestaRender=>respuestaRender.json())
    .then(areas=>{
        areas.forEach(area => {
            const opcionElemento= document.createElement('option');
            opcionElemento.setAttribute('value',area.CLAVE_AREA);
            opcionElemento.innerHTML = area.DESCRIPCION_AREA;
            inputCombo.appendChild(opcionElemento);
        })
    })
}

const llenarComboPuestos = async (textArea) => {
    try {
        let textPuesto = document.querySelector('#textPuesto');
        idBusqueda = textArea.value;
        if(idBusqueda==null || idBusqueda==''){
            textPuesto.innerHTML = `<option value="">---</option>`;
        }else {
            textPuesto.innerHTML = `<option value="">Cargando...</option>`;
            fetch(`catalogos/llenarComboPuestos/${idBusqueda}`)
            .then(respuestaRender=>respuestaRender.json())
            .then(respuestas => {
                textPuesto.innerHTML = `<option value="">Puestos</option>`;
                respuestas.forEach(puesto => {
                    const opcionElemento= document.createElement('option');
                    opcionElemento.setAttribute('value',puesto.CLAVE_PUESTO);
                    opcionElemento.innerHTML=`${puesto.CLAVE_PUESTO} - ${puesto.DESCRIPHOM_PUESTO}`;
                    textPuesto.appendChild(opcionElemento);
                    textPuesto.focus();
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

const armarMenuPerfilNuevo = async () => {
    let menuPerfiles = document.querySelector('#menuPerfiles');
    menuPerfiles.innerHTML=cargaAnimacion;
    fetch('catperfiles/armarMenuAsignaPerfiles')
    .then(respRender => respRender.json())
    .then(respuestas => {
        const listadoUl=document.createElement('ul');
        listadoUl.classList.add('menu-vertical-edit','fuente-12p')
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
                                listadoItemUlA.innerHTML=`<a class="dropdown-toggle margen-izq-20">
                                <i class="${respuestb.CLASS_MENB}"></i>
                                ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}</a>
                                `;
                                const listadoUlB = document.createElement('ul');
                                listadoUlB.classList.add('menu-vertical-edit');
                                respuestas[2].forEach(respuestc => {
                                    if(respuestb.IDSMENU_MENB==respuestc.IDSMENU_MENC){
                                        const listadoItemUlB = document.createElement('li');
                                        listadoItemUlB.setAttribute('menu-item-select',respuestc.IDSBMENU_MENC);
                                        listadoItemUlB.classList.add('menu-vertical-li-edit');
                                        if(respuestc.CONTOPC_MENC=='SI'){
                                            listadoItemUlB.innerHTML=`<a class="dropdown-toggle margen-izq-30">
                                            <i class="${respuestc.CLASS_MENC}"></i>
                                            ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}</a>
                                            `;
                                            const listadoUlC = document.createElement('ul');
                                            listadoUlC.classList.add('menu-vertical-edit');
                                            respuestas[3].forEach(respuestd => {
                                                if(respuestc.IDSBMENU_MENC==respuestd.IDSBMENU_MEND){
                                                    const listadoItemUlC = document.createElement('li');
                                                    listadoItemUlC.setAttribute('menu-item-select',respuestd.IDSBMENUO_MEND);
                                                    listadoItemUlC.classList.add('menu-vertical-li-edit');
                                                    if(respuestd.CONTOPC_MEND=='SI'){
                                                        listadoItemUlC.innerHTML=`<a class="dropdown-toggle margen-izq-40">
                                                        <i class="${respuestd.CLASS_MEND}"></i>
                                                        ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}</a>
                                                        `;
                                                    }else {
                                                        listadoItemUlC.innerHTML=`<a class="margen-izq-40 p-0">
                                                        <input type="checkbox" name="menuRoles[]" id="${respuestd.IDSBMENUO_MEND}" value="${respuestd.IDSBMENUO_MEND}">
                                                        <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0 p-2 col-10">
                                                        <i class="${respuestd.CLASS_MEND}"></i>
                                                        ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}
                                                        </label>
                                                        </a>
                                                        `;
                                                    }
                                                    listadoUlC.appendChild(listadoItemUlC);
                                                    listadoItemUlB.appendChild(listadoUlC);
                                                }
                                            });
                                        }else {
                                            listadoItemUlB.innerHTML=`<a class="margen-izq-30 p-0">
                                            <input type="checkbox" name="menuRoles[]" id="${respuestc.IDSBMENU_MENC}" value="${respuestc.IDSBMENU_MENC}">
                                            <label for="${respuestc.IDSBMENU_MENC}" class="mb-0 p-2 col-10">
                                            <i class="${respuestc.CLASS_MENC}"></i>
                                            ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}
                                            </label>
                                            </a>
                                            `;
                                        }
                                        listadoUlB.appendChild(listadoItemUlB);
                                        listadoItemUlA.appendChild(listadoUlB);
                                    }
                                });
                            }else {
                                listadoItemUlA.innerHTML=`<a class="margen-izq-20 p-0">
                                <input type="checkbox" name="menuRoles[]" id="${respuestb.IDSMENU_MENB}" value="${respuestb.IDSMENU_MENB}">
                                <label for="${respuestb.IDSMENU_MENB}" class="mb-0 p-2 col-10">
                                <i class="${respuestb.CLASS_MENB}"></i>
                                ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}
                                </label>
                                </a>
                                `;
                            }
                            listadoUlA.appendChild(listadoItemUlA);
                            listadoItemUl.appendChild(listadoUlA);
                        }
                    });
                }else {
                    listadoItemUl.innerHTML=`<a class="p-0">
                    <input type="checkbox" name="menuRoles[]" id="${respuesta.IDMENU_MENA}" value="${respuesta.IDMENU_MENA}">
                    <label for="${respuesta.IDMENU_MENA}" class="mb-0 p-2 col-10">
                        <i class="${respuesta.CLASS_MENA}"></i>
                        ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}
                    </label>
                    </a>
                    `;
                }
                listadoUl.appendChild(listadoItemUl);
                menuPerfiles.innerHTML='';
                menuPerfiles.appendChild(listadoUl);
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

}

const armarMenuPerfilEditar = async (rolesSelecionados) => {
    let menuPerfiles = document.querySelector('#menuPerfiles');
    menuPerfiles.innerHTML=cargaAnimacion;
    fetch('catperfiles/armarMenuAsignaPerfiles')
    .then(respuestaRender => respuestaRender.json())
    .then(respuestas => {
        const listadoUl=document.createElement('ul');
        listadoUl.classList.add('menu-vertical-edit','fuente-12p')
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
                                listadoItemUlA.innerHTML=`<a class="dropdown-toggle margen-izq-20">
                                <i class="${respuestb.CLASS_MENB}"></i>
                                ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}</a>
                                `;
                                const listadoUlB = document.createElement('ul');
                                listadoUlB.classList.add('menu-vertical-edit');
                                respuestas[2].forEach(respuestc => {
                                    if(respuestb.IDSMENU_MENB==respuestc.IDSMENU_MENC){
                                        const listadoItemUlB = document.createElement('li');
                                        listadoItemUlB.setAttribute('menu-item-select',respuestc.IDSBMENU_MENC);
                                        listadoItemUlB.classList.add('menu-vertical-li-edit');
                                        if(respuestc.CONTOPC_MENC=='SI'){
                                            listadoItemUlB.innerHTML=`<a class="dropdown-toggle margen-izq-20">
                                            <i class="${respuestc.CLASS_MENC}"></i>
                                            ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}</a>
                                            `;
                                            const listadoUlC = document.createElement('ul');
                                            listadoUlC.classList.add('menu-vertical-edit');
                                            respuestas[3].forEach(respuestd => {
                                                if(respuestc.IDSBMENU_MENC==respuestd.IDSBMENU_MEND){
                                                    const listadoItemUlC = document.createElement('li');
                                                    listadoItemUlC.setAttribute('menu-item-select',respuestd.IDSBMENUO_MEND);
                                                    listadoItemUlC.classList.add('menu-vertical-li-edit');
                                                    if(respuestd.CONTOPC_MEND=='SI'){
                                                        listadoItemUlC.innerHTML=`<a class="dropdown-toggle margen-izq-20">
                                                        <i class="${respuestd.CLASS_MEND}"></i>
                                                        ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}</a>
                                                        `;
                                                    }else {
                                                        if(rolesSelecionados.includes(respuestd.IDSBMENUO_MEND)){
                                                            listadoItemUlC.innerHTML=`<a class="margen-izq-20">
                                                            <input type="checkbox" name="menuRoles[]" id="${respuestd.IDSBMENUO_MEND}" value="${respuestd.IDSBMENUO_MEND}" checked="checked">
                                                            <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0">
                                                            <i class="${respuestd.CLASS_MEND}"></i>
                                                            ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}
                                                            </label>
                                                            </a>
                                                            `;
                                                        }else {
                                                            listadoItemUlC.innerHTML=`<a class="margen-izq-20">
                                                            <input type="checkbox" name="menuRoles[]" id="${respuestd.IDSBMENUO_MEND}" value="${respuestd.IDSBMENUO_MEND}">
                                                            <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0">
                                                            <i class="${respuestd.CLASS_MEND}"></i>
                                                            ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}
                                                            </label>
                                                            </a>
                                                            `;
                                                        }
                                                    }
                                                    listadoUlC.appendChild(listadoItemUlC);
                                                    listadoItemUlB.appendChild(listadoUlC);
                                                }
                                            });
                                        }else {
                                            if(rolesSelecionados.includes(respuestc.IDSBMENU_MENC)){
                                                listadoItemUlB.innerHTML=`<a class="margen-izq-20">
                                                <input type="checkbox" name="menuRoles[]" id="${respuestc.IDSBMENU_MENC}" value="${respuestc.IDSBMENU_MENC}" checked="checked">
                                                <label for="${respuestc.IDSBMENU_MENC}" class="mb-0">
                                                <i class="${respuestc.CLASS_MENC}"></i>
                                                ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}
                                                </label>
                                                </a>
                                                `;
                                            }else {
                                                listadoItemUlB.innerHTML=`<a class="margen-izq-20">
                                                <input type="checkbox" name="menuRoles[]" id="${respuestc.IDSBMENU_MENC}" value="${respuestc.IDSBMENU_MENC}">
                                                <label for="${respuestc.IDSBMENU_MENC}" class="mb-0">
                                                <i class="${respuestc.CLASS_MENC}"></i>
                                                ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}
                                                </label>
                                                </a>
                                                `;
                                            }
                                        }
                                        listadoUlB.appendChild(listadoItemUlB);
                                        listadoItemUlA.appendChild(listadoUlB);
                                    }
                                });
                            }else {
                                if(rolesSelecionados.includes(respuestb.IDSMENU_MENB)){
                                    listadoItemUlA.innerHTML=`<a class="margen-izq-20">
                                    <input type="checkbox" name="menuRoles[]" id="${respuestb.IDSMENU_MENB}" value="${respuestb.IDSMENU_MENB}" checked="checked">
                                    <label for="${respuestb.IDSMENU_MENB}" class="mb-0">
                                    <i class="${respuestb.CLASS_MENB}"></i>
                                    ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}
                                    </label>
                                    </a>
                                    `;
                                }else {
                                    listadoItemUlA.innerHTML=`<a class="margen-izq-20">
                                    <input type="checkbox" name="menuRoles[]" id="${respuestb.IDSMENU_MENB}" value="${respuestb.IDSMENU_MENB}">
                                    <label for="${respuestb.IDSMENU_MENB}" class="mb-0">
                                    <i class="${respuestb.CLASS_MENB}"></i>
                                    ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}
                                    </label>
                                    </a>
                                    `;
                                }
                            }
                            listadoUlA.appendChild(listadoItemUlA);
                            listadoItemUl.appendChild(listadoUlA);
                        }
                    });
                }else {
                    if(rolesSelecionados.includes(respuesta.IDMENU_MENA)){
                        listadoItemUl.innerHTML=`<a class="p-0">
                        <input type="checkbox" name="menuRoles[]" id="${respuesta.IDMENU_MENA}" value="${respuesta.IDMENU_MENA}" checked="checked">
                        <label for="${respuesta.IDMENU_MENA}" class="mb-0 p-2 col-10">
                        <i class="${respuesta.CLASS_MENA}"></i>
                        ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}
                        </label>
                        </a>
                        `;
                    }else {
                        listadoItemUl.innerHTML=`<a class="p-0">
                        <input type="checkbox" name="menuRoles[]" id="${respuesta.IDMENU_MENA}" value="${respuesta.IDMENU_MENA}">
                        <label for="${respuesta.IDMENU_MENA}" class="mb-0 p-2 col-10">
                        <i class="${respuesta.CLASS_MENA}"></i>
                        ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}
                        </label>
                        </a>
                        `;
                    }
                }
                listadoUl.appendChild(listadoItemUl);
                menuPerfiles.innerHTML='';
                menuPerfiles.appendChild(listadoUl);
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

}

function eliminarRegistros(botonEliminarEl){
    try {
        let idRegistro = botonEliminarEl.attributes.dataelim.value
        Swal.fire({
            title: '¿Eliminar registro?',
            text: "¿Seguro? Esto no se puede revertir",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#670A0A',
            cancelButtonColor: '#5ADD33',
            confirmButtonText: '¡Si, eliminarlo!',
        })
        .then((result)=>{
            if(result.isConfirmed){
                fetch(`perfiles/datosEliminarPerfil/${idRegistro}`)
                .then(respuestaEl=>respuestaEl.json())
                .then(eliminado=>{
                    if(eliminado.estatus=='eliminado'){
                        botonEliminarEl.parentNode.parentNode.remove();
                        return Swal.fire({
                            title: eliminado.title,
                            icon: eliminado.icon,
                            confirmButtonText: `${eliminado.button}`,
                            confirmButtonColor: '#2AB500',
                            html: eliminado.text,
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
    }
    inputValido(inputForm);
    return true;
}

function validarRoles(){
    let inputForm = document.querySelectorAll('input[name="menuRoles[]"]:checked');
    if(!inputForm==true){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Debe seleccionar Roles',
        })
        return false;
    }
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
    }else if (inputForm.length > 12) {
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#670A0A',
            icon: 'error',
            text: 'Comentario máx 12 caracteres',
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
