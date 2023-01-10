let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector("#botonActualizar");
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListado();
    plantillaFormulario();
    botonGuardar.addEventListener('click', () => {
        crearNuevaAsignacion();
    })
    botonActualizar.addEventListener('click', () => {
        modificarRolesPerfil();
    })
    botonCancelar.addEventListener('click', () => {
        plantillaFormulario();
    })
})

const obtenerListado = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('asignastaff/llenarTablaPerfilStaff')
        .then(respRender => respRender.json())
        .then(respuestas => {
            tablaDinamica.classList.add('tabla-contenedor')
            const tablaPerfiles = document.createElement('table');
            tablaPerfiles.classList.add('table','table-sm','table-hover','fuente-14p');
            tablaPerfiles.innerHTML=`
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Perfil</th>
                        <th>Opciones</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
            `;
            const cuerpoTablaPerfiles = document.createElement('tbody');
            respuestas.forEach(perfiles => {
                const filaTablaPerfiles = document.createElement('tr');
                filaTablaPerfiles.innerHTML=`
                    <td class="fuente-12p">${perfiles.NOMBRE}</td>
                    <td>${perfiles.PERFIL_PERFUS}</td>
                    <td class="fuente-10p">${perfiles.OPCIONES_PERFUS}</td>
                `;
                const columnaAcciones = document.createElement('td');
                const botonEditarEl = document.createElement('button');
                botonEditarEl.classList.add('btn','btn-info','btn-sm');
                botonEditarEl.setAttribute('data-toggle','modal');
                botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                botonEditarEl.setAttribute('dataedit',perfiles.idTablePk);
                botonEditarEl.setAttribute('id','botonEditarSel');
                botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                botonEditarEl.addEventListener('click',() => {
                    buscandoEditarPerfil(botonEditarEl);
                });
                const botonEliminarEl = document.createElement('button');
                botonEliminarEl.classList.add('btn','btn-danger','btn-sm');
                botonEliminarEl.setAttribute('dataelim',perfiles.idTablePk);
                botonEliminarEl.setAttribute('id','botonEliminarSel');
                botonEliminarEl.innerHTML = '<i class="fa fa-eraser"></i>';
                botonEliminarEl.addEventListener('click',()=>{
                    eliminarRegistrosPrivilegios(botonEliminarEl);
                })
                const grupoAcciones = document.createElement('div');
                grupoAcciones.classList.add('btn-group');
                grupoAcciones.appendChild(botonEditarEl);
                grupoAcciones.appendChild(botonEliminarEl);
                columnaAcciones.appendChild(grupoAcciones);
                filaTablaPerfiles.appendChild(columnaAcciones);
                cuerpoTablaPerfiles.appendChild(filaTablaPerfiles);
                tablaPerfiles.appendChild(cuerpoTablaPerfiles);
                tablaDinamica.innerHTML='';
                tablaDinamica.appendChild(tablaPerfiles);
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

const plantillaFormulario = async () => {
    try{
        let templateForm = document.querySelector('#formCRUD');
        templateForm.innerHTML=`
            <div class="form-group">
                <select name="textPerfil" id="textPerfil" class="custom-select custom-select-sm"></select>
            </div>
            <div class="form-group">
                <select name="textUsuario" id="textUsuario" class="custom-select custom-select-sm"></select>
            </div>
            <div class="lista-contenedor" id="menuPerfiles"></div>
        `;
        botonGuardar.classList.remove('d-none')
        botonActualizar.classList.add('d-none');
        llenarComboPerfiles();
        llenarComboUsuarios();
        let textPerfil = document.querySelector('#textPerfil');
        textPerfil.addEventListener('change', () =>{
            armarMenuPerfil(textPerfil);
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

const llenarComboPerfiles = async () => {
    try {
        let textPerfil = document.querySelector('#textPerfil');
        textPerfil.innerHTML='<option value="">Cargando...</option>';
        fetch('privilegios/llenarComboPerfilesStaff')
        .then(respRender => respRender.json())
        .then(respuestas => {
            textPerfil.innerHTML='<option value="">Selecciona Perfil</option>';
            respuestas.forEach(respuesta => {
                const opcionSel = document.createElement('option');
                opcionSel.setAttribute('value',respuesta.CLAVE_PERF);
                opcionSel.classList.add('fuente-12p');
                opcionSel.innerHTML=respuesta.DESCRIPHOM_PUESTO;
                textPerfil.appendChild(opcionSel);
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

const llenarComboUsuarios = async () => {
    try {
        let textUsuario = document.querySelector('#textUsuario');
        (fetch('privilegios/llenarComboStaff'))
        .then(respRender => respRender.json())
        .then(respuestas => {
            textUsuario.innerHTML='<option value="">Selecciona Usuario</option>';
            respuestas.forEach(respuesta => {
                const opcionSel = document.createElement('option');
                opcionSel.setAttribute('value',respuesta.IDUSUA_RESPO);
                opcionSel.innerHTML=respuesta.NOMBRE;
                textUsuario.appendChild(opcionSel);
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

const crearNuevaAsignacion = async () => {
    try{
        if(validarPerfil() && validarUsuario()){
            const crearDatos = new FormData(formCRUD);
            fetch('asignastaff/guardarAsignacionStaff',{
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

const buscandoEditarPerfil = async (botonEditarEl) => {
    try {
        let templateForm = document.querySelector('#formCRUD');
        let idRegistro = botonEditarEl.attributes.dataedit.value
        templateForm.innerHTML=cargaAnimacion;
        fetch(`asignastaff/buscarAsignacionStaff/${idRegistro}`)
        .then(respuestaEditar => respuestaEditar.json())
        .then(editados => {
            editados.forEach(editando => {
                templateForm.innerHTML = `
                    <div class="form-group">
                        <select name="textPerfil" id="textPerfil" class="custom-select custom-select-sm"></select>
                    </div>
                    <div class="form-group">
                        <select name="textUsuario" id="textUsuario" class="custom-select custom-select-sm"></select>
                    </div>
                    <div class="lista-contenedor" id="menuPerfiles">
                    </div>
                `;
                botonGuardar.classList.add('d-none');
                botonActualizar.classList.remove('d-none');
                let textPerfilSel = editando.PERFIL_PERFUS;
                let textUsuarioSel = editando.IDUSUA_PERFUS;
                llenarComboPerfilesSec(textPerfilSel);
                llenarComboUsuariosSec(textUsuarioSel);
                rolesSelecionados=editando.OPCIONES_PERFUS;
                armarMenuPerfilEditar(rolesSelecionados);

                return templateForm;
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

const llenarComboPerfilesSec = async (textPerfilSel) => {
    try {
        let inputCombo = document.querySelector('#textPerfil');
        let selectActivo = textPerfilSel;
        inputCombo.innerHTML = '<option value="">Cargando...</option>';
        fetch('privilegios/llenarComboPerfilesStaff')
        .then(respRender => respRender.json())
        .then(respuestas => {
            inputCombo.innerHTML = '<option value="">Selecciona Perfil</option>';
            respuestas.forEach(respuesta => {
                if(respuesta.CLAVE_PERF==selectActivo){
                    const opcionElemento = document.createElement('option');
                    opcionElemento.setAttribute('value',respuesta.CLAVE_PERF);
                    opcionElemento.setAttribute('selected','selected');
                    opcionElemento.innerHTML=respuesta.DESCRIPHOM_PUESTO;
                    inputCombo.appendChild(opcionElemento);
                }else {
                    const opcionElemento = document.createElement('option');
                    opcionElemento.setAttribute('value',respuesta.CLAVE_PERF);
                    opcionElemento.innerHTML=respuesta.DESCRIPHOM_PUESTO;
                    inputCombo.appendChild(opcionElemento);
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

const llenarComboUsuariosSec = async (textUsuarioSel) => {
    try {
        let inputCombo = document.querySelector('#textUsuario');
        let selectActivoA = textUsuarioSel;
        inputCombo.innerHTML = '<option value="">Cargando...</option>';
        fetch(`privilegios/llenarComboStaffDatos/${selectActivoA}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: `${respuestas.button}`,
                    confirmButtonColor: '#2BC323',
                    html: respuestas.text,
                })

            }else{
                inputCombo.innerHTML = '<option value="">Selecciona Usuario</option>';
                respuestas.forEach(respuesta => {
                    if(respuesta.IDUSUA_RESPO==selectActivoA){
                        const opcionElemento = document.createElement('option');
                        opcionElemento.setAttribute('value',respuesta.IDUSUA_RESPO);
                        opcionElemento.setAttribute('selected','selected');
                        opcionElemento.innerHTML= respuesta.NOMBRE;
                        inputCombo.appendChild(opcionElemento);
                    }else {
                        const opcionElemento = document.createElement('option');
                        opcionElemento.setAttribute('value',respuesta.IDUSUA_RESPO);
                        opcionElemento.innerHTML=respuesta.NOMBRE;
                        inputCombo.appendChild(opcionElemento);
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

const armarMenuPerfil = async (textPerfil) => {
    try {
        let menuPerfiles = document.querySelector('#menuPerfiles');
        if(textPerfil.value==null || textPerfil.value==''){
            menuPerfiles.innerHTML=cargaAnimacion;
        }else {
            let menuDataPerfil = textPerfil.value;
            menuPerfiles.innerHTML='';
            (fetch(`privilegios/llenarMenuPerfil/${menuDataPerfil}`))
            .then(respRender => respRender.json())
            .then(respuestas => {
                respuestas[0].forEach(respopcion => {
                    let opcionesArreglo=respopcion.PERFIL_PERF;
                    const listadoUl=document.createElement('ul');
                    listadoUl.classList.add('menu-vertical-nivela','fuente-12p')
                    respuestas[1].forEach(respuesta => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.setAttribute('menu-item-select',respuesta.IDMENU_MENA);
                        listadoItemUl.classList.add('menu-vertical-li-nivela');
                        if(respuesta.CONTOPC_MENA=='SI'){
                            listadoItemUl.innerHTML=`<a class="menu-vertical-opcion-nivela dropdown-toggle">
                            <i class="${respuesta.CLASS_MENA}"></i>
                            ${respuesta.DESCRIP_MENA}</a>
                            `;
                            const listadoUlA = document.createElement('ul');
                            listadoUlA.classList.add('menu-vertical-nivelb');
                            respuestas[2].forEach(respuestb => {
                                if(respuesta.IDMENU_MENA==respuestb.IDMENU_MENB){
                                    const listadoItemUlA = document.createElement('li');
                                    listadoItemUlA.setAttribute('menu-item-select',respuestb.IDSMENU_MENB);
                                    listadoItemUlA.classList.add('menu-vertical-li-nivelb');
                                    if(respuestb.CONTOPC_MENB=='SI'){
                                        listadoItemUlA.innerHTML=`<a class="menu-vertical-opcion-nivelb dropdown-toggle">
                                        <i class="${respuestb.CLASS_MENB}"></i>
                                        ${respuestb.DESCRIP_MENB}</a>
                                        `;
                                        const listadoUlB = document.createElement('ul');
                                        listadoUlB.classList.add('menu-vertical-nivelc');
                                        respuestas[3].forEach(respuestc => {
                                            if(respuestb.IDSMENU_MENB==respuestc.IDSMENU_MENC){
                                                const listadoItemUlB = document.createElement('li');
                                                listadoItemUlB.setAttribute('menu-item-select',respuestc.IDSBMENU_MENC);
                                                listadoItemUlB.classList.add('menu-vertical-li-nivelc');
                                                if(respuestc.CONTOPC_MENC=='SI'){
                                                    listadoItemUlB.innerHTML=`<a class="menu-vertical-opcion-nivelc dropdown-toggle">
                                                    <i class="${respuestc.CLASS_MENC}"></i>
                                                    ${respuestc.DESCRIP_MENC}</a>
                                                    `;
                                                    const listadoUlC = document.createElement('ul');
                                                    listadoUlC.classList.add('menu-vertical-niveld');
                                                    respuestas[4].forEach(respuestd => {
                                                        if(respuestc.IDSBMENU_MENC==respuestd.IDSBMENU_MEND){
                                                            const listadoItemUlC = document.createElement('li');
                                                            listadoItemUlC.setAttribute('menu-item-select',respuestd.IDSBMENUO_MENC);
                                                            listadoItemUlC.classList.add('menu-vertical-li-niveld');
                                                            if(respuestd.CONTOPC_MEND=='SI'){
                                                                listadoItemUlC.innerHTML=`<a class="menu-vertical-opcion-niveld dropdown-toggle">
                                                                <i class="${respuestd.CLASS_MEND}"></i>
                                                                ${respuestd.DESCRIP_MEND}</a>
                                                                `;
                                                            }else {
                                                                listadoItemUlC.innerHTML=`<a class="menu-vertical-opcion-niveld">
                                                                <i class="${respuestd.CLASS_MEND}"></i>
                                                                ${respuestd.DESCRIP_MEND}</a>
                                                                `;
                                                            }
                                                            listadoUlC.appendChild(listadoItemUlC);
                                                            listadoItemUlB.appendChild(listadoUlC);
                                                        }
                                                    })
                                                }else {
                                                    listadoItemUlB.innerHTML=`<a class="menu-vertical-opcion-nivelc">
                                                    <i class="${respuestc.CLASS_MENC}"></i>
                                                    ${respuestc.DESCRIP_MENC}</a>
                                                    `;
                                                }
                                                listadoUlB.appendChild(listadoItemUlB);
                                                listadoItemUlA.appendChild(listadoUlB);
                                            }
                                        })
                                    }else {
                                        listadoItemUlA.innerHTML=`<a class="menu-vertical-opcion-nivelb">
                                        <i class="${respuestb.CLASS_MENB}"></i>
                                        ${respuestb.DESCRIP_MENB}</a>
                                        `;
                                    }
                                    listadoUlA.appendChild(listadoItemUlA);
                                    listadoItemUl.appendChild(listadoUlA);
                                }

                            })
                        }else {
                            listadoItemUl.innerHTML=`<a class="menu-vertical-opcion-nivela">
                            <i class="${respuesta.CLASS_MENA}"></i>
                            ${respuesta.DESCRIP_MENA}</a>
                            `;
                        }
                        listadoUl.appendChild(listadoItemUl);
                        menuPerfiles.appendChild(listadoUl);
                    })
                    opcionesArreglo
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

const armarMenuPerfilEditar = async (rolesSelecionados) => {
    try {
        let menuPerfiles = document.querySelector('#menuPerfiles');
        menuPerfiles.innerHTML=cargaAnimacion;
        fetch('catalogos/armarMenuAsignaPerfiles')
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
                                                            if(rolesSelecionados.includes(respuestd.IDSBMENUO_MEND)){
                                                                listadoItemUlC.innerHTML=`<a class="margen-izq-40">
                                                                <input type="checkbox" name="menuRoles[]" id="${respuestd.IDSBMENUO_MEND}" value="${respuestd.IDSBMENUO_MEND}" checked="checked">
                                                                <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0 p-0 col-10">
                                                                <i class="${respuestd.CLASS_MEND}"></i>
                                                                ${respuestd.DESCRIP_MEND}  - ${respuestd.IDSBMENUO_MEND}
                                                                </label>
                                                                </a>
                                                                `;
                                                            }else {
                                                                listadoItemUlC.innerHTML=`<a class="margen-izq-40">
                                                                <input type="checkbox" name="menuRoles[]" id="${respuestd.IDSBMENUO_MEND}" value="${respuestd.IDSBMENUO_MEND}">
                                                                <label for="${respuestd.IDSBMENUO_MEND}" class="mb-0 p-0 col-10">
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
                                                    listadoItemUlB.innerHTML=`<a class="margen-izq-30">
                                                    <input type="checkbox" name="menuRoles[]" id="${respuestc.IDSBMENU_MENC}" value="${respuestc.IDSBMENU_MENC}" checked="checked">
                                                    <label for="${respuestc.IDSBMENU_MENC}" class="mb-0 p-0 col-10">
                                                    <i class="${respuestc.CLASS_MENC}"></i>
                                                    ${respuestc.DESCRIP_MENC}  - ${respuestc.IDSBMENU_MENC}
                                                    </label>
                                                    </a>
                                                    `;
                                                }else {
                                                    listadoItemUlB.innerHTML=`<a class="margen-izq-30">
                                                    <input type="checkbox" name="menuRoles[]" id="${respuestc.IDSBMENU_MENC}" value="${respuestc.IDSBMENU_MENC}">
                                                    <label for="${respuestc.IDSBMENU_MENC}" class="mb-0 p-0 col-10">
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
                                        <label for="${respuestb.IDSMENU_MENB}" class="mb-0 p-0 col-10">
                                        <i class="${respuestb.CLASS_MENB}"></i>
                                        ${respuestb.DESCRIP_MENB}  - ${respuestb.IDSMENU_MENB}
                                        </label>
                                        </a>
                                        `;
                                    }else {
                                        listadoItemUlA.innerHTML=`<a class="margen-izq-20">
                                        <input type="checkbox" name="menuRoles[]" id="${respuestb.IDSMENU_MENB}" value="${respuestb.IDSMENU_MENB}">
                                        <label for="${respuestb.IDSMENU_MENB}" class="mb-0 p-0 col-10">
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
                            <label for="${respuesta.IDMENU_MENA}" class="mb-0 p-0 col-10">
                            <i class="${respuesta.CLASS_MENA}"></i>
                            ${respuesta.DESCRIP_MENA}  - ${respuesta.IDMENU_MENA}
                            </label>
                            </a>
                            `;
                        }else {
                            listadoItemUl.innerHTML=`<a class="p-0">
                            <input type="checkbox" name="menuRoles[]" id="${respuesta.IDMENU_MENA}" value="${respuesta.IDMENU_MENA}">
                            <label for="${respuesta.IDMENU_MENA}" class="mb-0 p-0 col-10">
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
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const modificarRolesPerfil = async () => {
    try {
        if(validarPerfil() && validarUsuario() && validarRoles()){
            const actualizaDatos = new FormData(formCRUD);
            fetch('asignastaff/actualizarPerfilStaff', {
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

const eliminarRegistrosPrivilegios = async (botonEliminarEl) => {
    try {
        let idRegistro = botonEliminarEl.attributes.dataelim.value
        Swal.fire({
            title: '¿Eliminar registro?',
            text: "¿Seguro? Esto no se puede revertir",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2BC323',
            cancelButtonColor: '#DB2121',
            confirmButtonText: '¡Si, eliminarlo!',
        })
        .then((result)=>{
            if(result.isConfirmed){
                fetch(`asignastaff/eliminarAsignacionStaff/${idRegistro}`)
                .then(respuestaEl=>respuestaEl.json())
                .then(eliminado=>{
                    if(eliminado.estatus=='eliminado'){
                        botonEliminarEl.parentNode.parentNode.remove();
                        return Swal.fire({
                            title: eliminado.title,
                            icon: eliminado.icon,
                            confirmButtonText: `${eliminado.button}`,
                            confirmButtonColor: '#2BC323',
                            html: eliminado.text,
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


function validarPerfil(){
    let inputForm = document.querySelector("#textPerfil");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Perfil es requerido',
        }).then((result)=>{
            if((result.isConfirmed)){
                inputError(inputForm);

            }
        })
        return false;
    }
    inputValido(inputForm);
    return true;
}

function validarUsuario(){
    let inputForm = document.querySelector("#textUsuario");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Usuario es requerido',
        }).then((result)=>{
            if((result.isConfirmed)){
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
            confirmButtonColor: '#B80C21',
            icon: 'error',
            text: 'Debe seleccionar Roles',
        })
        return false;
    }
    return true;
}

function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
