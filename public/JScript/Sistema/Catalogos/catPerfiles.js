let botonRegistro = document.querySelector('#botonRegistro');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
let controlEjecuta = 'catperfiles';
let funcionEjecuta = 'Perfiles';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    botonRegistro.addEventListener('click', () => plantillaFormulario());
    botonGuardar.addEventListener('click', () => guardarRegistrosPerfiles());
    botonActualizar.addEventListener('click', () => actualizarRegistroPerfiles());
    botonCancelar.addEventListener('click', () => inputLimpiar());
})

const obtenerListado = async () => {
    try {
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        const respRender = await fetch(`${controlEjecuta}/llenarTabla${funcionEjecuta}`)
        const respuestas = await respRender.json();
        const tablaPerfiles = document.createElement('table');
        tablaPerfiles.classList.add('table','table-sm','table-hover','fuente-12p');
        tablaPerfiles.innerHTML=`
            <thead>
                <th>Clave</th>
                <th>Opciones</th>
                <th>F Modif</th>
                <th colspan="2">Acciones</th>
            </thead>
        `;
        const cuerpoTablaPerfiles = document.createElement('tbody');
        if(respuestas.estatus=='error'||respuestas==null){
            cuerpoTablaPerfiles.innerHTML=`<tr><td colspan="4">${respuestas.mensaje}</td></tr>`;
        }else{
            tablaDinamica.classList.add('tabla-contenedor');
            respuestas.forEach(registros => {
                const {idTablePk,CLAVE_PERF,PERFIL_PERF,FMODIF_PERF,TOTAL} = registros;
                const filasTablaPerfiles = document.createElement('tr');
                filasTablaPerfiles.setAttribute('dataparent',idTablePk);
                filasTablaPerfiles.innerHTML = `
                    <td>${CLAVE_PERF}</td>
                    <td class="fuente-10p">${PERFIL_PERF}</td>
                    <td>${FMODIF_PERF}</td>
                `;
                const columnaAcciones = document.createElement('td');
                columnaAcciones.classList.add('p-0');
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
                const columnaBadge = document.createElement('td');
                columnaBadge.classList.add('p-0','text-center', 'fuente-18p');
                columnaBadge.appendChild(badgePill);
                filasTablaPerfiles.appendChild(columnaBadge);
                const botonEditarEl = document.createElement('button');
                botonEditarEl.classList.add('btn','btn-info','btn-sm');
                botonEditarEl.setAttribute('data-toggle','modal');
                botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                botonEditarEl.setAttribute('dataedit',idTablePk);
                botonEditarEl.setAttribute('id','botonEditarSel');
                botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                botonEditarEl.addEventListener('click',() => {buscandoDatosEditar(botonEditarEl)});
                const botonEliminarEl = document.createElement('button');
                botonEliminarEl.classList.add('btn','btn-danger','btn-sm');
                botonEliminarEl.setAttribute('dataelim',idTablePk);
                botonEliminarEl.setAttribute('id','botonEliminarSel');
                botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                botonEliminarEl.addEventListener('click',()=>{confirmarEliminar(botonEliminarEl)});
                const grupoAcciones = document.createElement('div');
                grupoAcciones.classList.add('btn-group','text-center');
                grupoAcciones.appendChild(botonEditarEl);
                grupoAcciones.appendChild(botonEliminarEl);
                columnaAcciones.appendChild(grupoAcciones);
                filasTablaPerfiles.appendChild(columnaAcciones);
                cuerpoTablaPerfiles.appendChild(filasTablaPerfiles);
            });
        }
        tablaPerfiles.appendChild(cuerpoTablaPerfiles);
        tablaDinamica.innerHTML='';
        tablaDinamica.appendChild(tablaPerfiles);

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
    let formularioPerfilesCRUD = document.querySelector('#formularioPerfilesCRUD');
    let staticCrearRegistro = document.querySelector('#staticCrearRegistro');
    staticCrearRegistro.innerHTML='Crear Registro';
    botonGuardar.classList.remove('d-none');
    botonActualizar.classList.add('d-none');
    formularioPerfilesCRUD.innerHTML=`
        <div class="form-group mb-2">
            <select name="textArea" value="" class="custom-select custom-select-sm col-12" id="textArea"></select>
        </div>
        <div class="form-group mb-2">
            <select name="textPuesto" value="" class="custom-select custom-select-sm col-12" id="textPuesto">
                <option value="">---</option>
            </select>
        </div>
        <div class="form-group mb-2">
            <textarea name="textComentario" rows="4" class="form-control form-control-sm" id="textComentario" max-length="500" placeholder="Comentarios"></textarea>
            <div class="text-muted fuente-10p" id="letrasRestanteslabel">500/500</div>
        </div>
        <div id="menuPerfiles"></div>
    `;
    llenarComboAreas();
    armarMenuPerfilNuevo();
    let textArea = document.querySelector('#textArea');
    textArea.addEventListener('change', () => {
        llenarComboPuestos(textArea);
    })
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

const guardarRegistrosPerfiles = async () => {
    try {
        if(validarArea()&&validarPuesto()&&validarComentario()&&validarRoles()){
            let formularioPerfilesCRUD = document.querySelector('#formularioPerfilesCRUD');
            const crearDatos = new FormData(formularioPerfilesCRUD);
            const respRender = await fetch('catperfiles/guardarPerfiles',{
                method: 'POST',
                body: crearDatos,
            });
            const respuestas = await respRender.json();
            if(respuestas.estatus=='error'||respuestas.estatus=='nosesion'||respuestas.estatus=='invalido'||respuestas.estatus=='duplicado'){
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
        let formularioPerfilesCRUD = document.querySelector('#formularioPerfilesCRUD');
        let staticCrearRegistro = document.querySelector('#staticCrearRegistro');
        staticCrearRegistro.innerHTML='Modificar Registro';
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.remove('d-none');
        formularioPerfilesCRUD.innerHTML=cargaAnimacion;
        let idRegistro = botonEditarEl.attributes.dataedit.value
        const respRender = await fetch(`catperfiles/buscarEditarPerfiles/${idRegistro}`);
        const respuestas = await respRender.json();
        respuestas.forEach(perfiles => {
            const {CLAVE_PERF,PERFIL_PERF,COMENTS_PERF} = perfiles;
            formularioPerfilesCRUD.innerHTML=`
                <input type="hidden" name="textPuesto" value="${CLAVE_PERF}" id="textPuesto">
                <div class="form-group mb-2">
                    <input type="text" name="textPuestoV" value="${CLAVE_PERF}" class="form-control form-control-sm col-md-4 col-12" id="textPuestoV" maxlength="13" placeholder="Puesto" readonly>
                </div>
                <div class="form-group mb-2">
                    <textarea name="textComentario" rows="4" class="form-control form-control-sm" id="textComentario" max-length="500" placeholder="Comentarios">${COMENTS_PERF}</textarea>
                    <div class="text-muted fuente-10p" id="letrasRestanteslabel">500/500</div>
                </div>
                <div id="menuPerfiles"></div>
            `;
            rolesSelecionados=PERFIL_PERF;
            armarMenuPerfilEditar(rolesSelecionados);
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

const actualizarRegistroPerfiles = async () => {
    try {
        if(validarPuesto()&&validarComentario()&&validarRoles()){
            let formularioPerfilesCRUD = document.querySelector('#formularioPerfilesCRUD');
            const actualizaDatos = new FormData(formularioPerfilesCRUD);
            const respRender = await fetch('catperfiles/actualizarPerfiles', {
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

const llenarComboAreas = async () => {
    try {
        let inputCombo = document.querySelector('#textArea');
        inputCombo.innerHTML = '<option value="">Cargando...</option>';
        const respRender = await fetch('catalogos/llenarComboAreas')
        const respuestas = await respRender.json();
        if(respuestas.estatus=='error'||respuestas==null){
            inputCombo.innerHTML = '<option value="">No data</option>';
        }else{
            inputCombo.innerHTML = '<option value="">Área</option>';
            respuestas.forEach(area => {
                const {CLAVE_AREA,DESCRIPCION_AREA} = area;
                const opcionElemento= document.createElement('option');
                opcionElemento.setAttribute('value',CLAVE_AREA);
                opcionElemento.innerHTML = DESCRIPCION_AREA;
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

const llenarComboPuestos = async (textArea) => {
    try {
        let textPuesto = document.querySelector('#textPuesto');
        idBusqueda = textArea.value;
        if(idBusqueda==null || idBusqueda==''){
            textPuesto.innerHTML = `<option value="">---</option>`;
        }else {
            textPuesto.innerHTML = `<option value="">Cargando...</option>`;
            const respRender = await fetch(`catalogos/llenarComboPuestos/${idBusqueda}`)
            const respuestas = await respRender.json();
            if(respuestas.estatus=='error'||respuestas==null){
                textPuesto.innerHTML = `<option value="">No data</option>`;
            }else{
                textPuesto.innerHTML = `<option value="">Puestos</option>`;
                respuestas.forEach(puesto => {
                    const opcionElemento = document.createElement('option');
                    opcionElemento.setAttribute('value',puesto.CLAVE_PUESTO);
                    opcionElemento.innerHTML=`${puesto.CLAVE_PUESTO} - ${puesto.DESCRIPHOM_PUESTO}`;
                    textPuesto.appendChild(opcionElemento);
                    textPuesto.focus();
                });

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

const armarMenuPerfilNuevo = async () => {
    let menuPerfiles = document.querySelector('#menuPerfiles');
    menuPerfiles.innerHTML=cargaAnimacion;
    const respRender = await fetch('catperfiles/armarMenuAsignaPerfiles');
    const respuestas = await respRender.json();
    const listadoUl=document.createElement('ul');
    listadoUl.classList.add('menu-vertical-edit','fuente-12p')
    respuestas[0].forEach(opciona => {
        const listadoItemUl=document.createElement('li');
        listadoItemUl.setAttribute('menu-item-select',opciona.IDMENU_MENA);
        listadoItemUl.classList.add('menu-vertical-li-edit');
        if(opciona.CONTOPC_MENA=='SI'){
            listadoItemUl.innerHTML=`
                <a class="dropdown-toggle">
                    <i class="${opciona.CLASS_MENA}"></i> ${opciona.DESCRIP_MENA}  - ${opciona.IDMENU_MENA}
                </a>
            `;
            const listadoUlA = document.createElement('ul');
            listadoUlA.classList.add('menu-vertical-edit');
            respuestas[1].forEach(opcionb => {
                if(opciona.IDMENU_MENA==opcionb.IDMENU_MENB){
                    const listadoItemUlA = document.createElement('li');
                    listadoItemUlA.setAttribute('menu-item-select',opcionb.IDSMENU_MENB);
                    listadoItemUlA.classList.add('menu-vertical-li-edit');
                    if(opcionb.CONTOPC_MENB=='SI'){
                        listadoItemUlA.innerHTML=`
                            <a class="dropdown-toggle margen-izq-20">
                                <i class="${opcionb.CLASS_MENB}"></i> ${opcionb.DESCRIP_MENB}  - ${opcionb.IDSMENU_MENB}
                            </a>
                        `;
                        const listadoUlB = document.createElement('ul');
                        listadoUlB.classList.add('menu-vertical-edit');
                        respuestas[2].forEach(opcionc => {
                            if(opcionb.IDSMENU_MENB==opcionc.IDSMENU_MENC){
                                const listadoItemUlB = document.createElement('li');
                                listadoItemUlB.setAttribute('menu-item-select',opcionc.IDSBMENU_MENC);
                                listadoItemUlB.classList.add('menu-vertical-li-edit');
                                if(opcionc.CONTOPC_MENC=='SI'){
                                    listadoItemUlB.innerHTML=`
                                        <a class="dropdown-toggle margen-izq-30">
                                            <i class="${opcionc.CLASS_MENC}"></i> ${opcionc.DESCRIP_MENC}  - ${opcionc.IDSBMENU_MENC}
                                        </a>
                                    `;
                                    const listadoUlC = document.createElement('ul');
                                    listadoUlC.classList.add('menu-vertical-edit');
                                    respuestas[3].forEach(opciond => {
                                        if(opcionc.IDSBMENU_MENC==opciond.IDSBMENU_MEND){
                                            const listadoItemUlC = document.createElement('li');
                                            listadoItemUlC.setAttribute('menu-item-select',opciond.IDSBMENUO_MEND);
                                            listadoItemUlC.classList.add('menu-vertical-li-edit');
                                            if(opciond.CONTOPC_MEND=='SI'){
                                                listadoItemUlC.innerHTML=`
                                                    <a class="dropdown-toggle margen-izq-40">
                                                        <i class="${opciond.CLASS_MEND}"></i>${opciond.DESCRIP_MEND}  - ${opciond.IDSBMENUO_MEND}
                                                    </a>
                                                `;
                                            }else {
                                                listadoItemUlC.innerHTML=`
                                                    <a class="margen-izq-40 p-0 pl-2">
                                                        <input type="checkbox" name="menuRoles[]" id="${opciond.IDSBMENUO_MEND}" value="${opciond.IDSBMENUO_MEND}">
                                                        <label for="${opciond.IDSBMENUO_MEND}" class="mb-0 p-2 col-10 menu-vertical-edit-clic">
                                                            <i class="${opciond.CLASS_MEND}"></i> ${opciond.DESCRIP_MEND}  - ${opciond.IDSBMENUO_MEND}
                                                        </label>
                                                    </a>
                                                `;
                                            }
                                            listadoUlC.appendChild(listadoItemUlC);
                                        }
                                    });
                                    listadoItemUlB.appendChild(listadoUlC);
                                }else {
                                    listadoItemUlB.innerHTML=`
                                        <a class="margen-izq-30 p-0 pl-2">
                                            <input type="checkbox" name="menuRoles[]" id="${opcionc.IDSBMENU_MENC}" value="${opcionc.IDSBMENU_MENC}">
                                            <label for="${opcionc.IDSBMENU_MENC}" class="mb-0 p-2 col-10 menu-vertical-edit-clic">
                                                <i class="${opcionc.CLASS_MENC}"></i>${opcionc.DESCRIP_MENC}  - ${opcionc.IDSBMENU_MENC}
                                            </label>
                                        </a>
                                    `;
                                }
                                listadoUlB.appendChild(listadoItemUlB);
                            }
                        });
                        listadoItemUlA.appendChild(listadoUlB);
                    }else {
                        listadoItemUlA.innerHTML=`
                            <a class="margen-izq-20 p-0 pl-2">
                                <input type="checkbox" name="menuRoles[]" id="${opcionb.IDSMENU_MENB}" value="${opcionb.IDSMENU_MENB}">
                                <label for="${opcionb.IDSMENU_MENB}" class="mb-0 p-2 col-10 menu-vertical-edit-clic">
                                    <i class="${opcionb.CLASS_MENB}"></i> ${opcionb.DESCRIP_MENB}  - ${opcionb.IDSMENU_MENB}
                                </label>
                            </a>
                        `;
                    }
                    listadoUlA.appendChild(listadoItemUlA);
                }
            });
            listadoItemUl.appendChild(listadoUlA);
        }else {
            listadoItemUl.innerHTML=`
                <a class="p-0 pl-2">
                    <input type="checkbox" name="menuRoles[]" id="${opciona.IDMENU_MENA}" value="${opciona.IDMENU_MENA}">
                    <label for="${opciona.IDMENU_MENA}" class="mb-0 p-2 col-10 menu-vertical-edit-clic">
                        <i class="${opciona.CLASS_MENA}"></i> ${opciona.DESCRIP_MENA}  - ${opciona.IDMENU_MENA}
                    </label>
                </a>
            `;
        }
        listadoUl.appendChild(listadoItemUl);
    });
    menuPerfiles.classList.add('tabla-contenedor-medio');
    menuPerfiles.innerHTML='';
    menuPerfiles.appendChild(listadoUl);

}

const armarMenuPerfilEditar = async (rolesSelecionados) => {
    try {
        let menuPerfiles = document.querySelector('#menuPerfiles');
        menuPerfiles.innerHTML=cargaAnimacion;
        const respRender = await fetch('catperfiles/armarMenuAsignaPerfiles')
        const respuestas = await respRender.json();
        const listadoUl=document.createElement('ul');
        listadoUl.classList.add('menu-vertical-edit','fuente-12p')
        respuestas[0].forEach(opciona => {
            const listadoItemUl=document.createElement('li');
            listadoItemUl.setAttribute('menu-item-select',opciona.IDMENU_MENA);
            listadoItemUl.classList.add('menu-vertical-li-edit');
            if(opciona.CONTOPC_MENA=='SI'){
                listadoItemUl.innerHTML=`
                <a class="dropdown-toggle">
                    <i class="${opciona.CLASS_MENA}"></i>${opciona.DESCRIP_MENA}  - ${opciona.IDMENU_MENA}
                </a>
                `;
                const listadoUlA = document.createElement('ul');
                listadoUlA.classList.add('menu-vertical-edit');
                respuestas[1].forEach(respuestb => {
                    if(opciona.IDMENU_MENA==respuestb.IDMENU_MENB){
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
                                                        <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0 menu-vertical-edit-clic">
                                                        <i class="${respuestd.CLASS_MEND}"></i>
                                                        ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}
                                                        </label>
                                                        </a>
                                                        `;
                                                    }else {
                                                        listadoItemUlC.innerHTML=`<a class="margen-izq-20">
                                                        <input type="checkbox" name="menuRoles[]" id="${respuestd.IDSBMENUO_MEND}" value="${respuestd.IDSBMENUO_MEND}">
                                                        <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0 menu-vertical-edit-clic">
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
                                            <label for="${respuestc.IDSBMENU_MENC}" class="mb-0 menu-vertical-edit-clic">
                                            <i class="${respuestc.CLASS_MENC}"></i>
                                            ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}
                                            </label>
                                            </a>
                                            `;
                                        }else {
                                            listadoItemUlB.innerHTML=`<a class="margen-izq-20">
                                            <input type="checkbox" name="menuRoles[]" id="${respuestc.IDSBMENU_MENC}" value="${respuestc.IDSBMENU_MENC}">
                                            <label for="${respuestc.IDSBMENU_MENC}" class="mb-0 menu-vertical-edit-clic">
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
                                listadoItemUlA.innerHTML=`
                                    <a class="margen-izq-20">
                                        <input type="checkbox" name="menuRoles[]" id="${respuestb.IDSMENU_MENB}" value="${respuestb.IDSMENU_MENB}" checked="checked">
                                        <label for="${respuestb.IDSMENU_MENB}" class="mb-0 menu-vertical-edit-clic">
                                            <i class="${respuestb.CLASS_MENB}"></i> ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}
                                        </label>
                                    </a>
                                `;
                            }else {
                                listadoItemUlA.innerHTML=`
                                    <a class="margen-izq-20">
                                        <input type="checkbox" name="menuRoles[]" id="${respuestb.IDSMENU_MENB}" value="${respuestb.IDSMENU_MENB}">
                                        <label for="${respuestb.IDSMENU_MENB}" class="mb-0 menu-vertical-edit-clic">
                                            <i class="${respuestb.CLASS_MENB}"></i> ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}
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
                if(rolesSelecionados.includes(opciona.IDMENU_MENA)){
                    listadoItemUl.innerHTML=`
                        <a class="p-0 pl-2">
                            <input type="checkbox" name="menuRoles[]" id="${opciona.IDMENU_MENA}" value="${opciona.IDMENU_MENA}" checked="checked">
                            <label for="${opciona.IDMENU_MENA}" class="mb-0 p-2 col-10 menu-vertical-edit-clic">
                                <i class="${opciona.CLASS_MENA}"></i> ${opciona.DESCRIP_MENA} - ${opciona.IDMENU_MENA}
                            </label>
                        </a>
                    `;
                }else {
                    listadoItemUl.innerHTML=`
                        <a class="p-0 pl-2">
                            <input type="checkbox" name="menuRoles[]" id="${opciona.IDMENU_MENA}" value="${opciona.IDMENU_MENA}">
                            <label for="${opciona.IDMENU_MENA}" class="mb-0 p-2 col-10 menu-vertical-edit-clic">
                                <i class="${opciona.CLASS_MENA}"></i> ${opciona.DESCRIP_MENA} - ${opciona.IDMENU_MENA}
                            </label>
                        </a>
                    `;
                }
            }
            listadoUl.appendChild(listadoItemUl);
        });
        menuPerfiles.classList.add('tabla-contenedor-medio');
        menuPerfiles.innerHTML='';
        menuPerfiles.appendChild(listadoUl);
            
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
                eliminarRegistrosPerfiles(idRegistro);
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

const eliminarRegistrosPerfiles = async (idRegistro) => {
    try {
        const respRender = await fetch(`catperfiles/eliminarPerfil/${idRegistro}`)
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
    let formularioPerfilesCRUD = document.querySelector('#formularioPerfilesCRUD');
    formularioPerfilesCRUD.innerHTML='';
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
            confirmButtonColor: '#9C0000',
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
            confirmButtonColor: '#9C0000',
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
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Comentario min 4 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 500) {
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

