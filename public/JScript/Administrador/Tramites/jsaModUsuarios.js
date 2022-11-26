let botonActualizar = document.querySelector('#botonActualizar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonActualizar.addEventListener('click', () => {
        actualizarRegistroUsuario();
    })
})

const plantillaBusqueda = async () => {
    try{
        let templateForm = document.querySelector('#busquedaUsuarios');
        templateForm.classList.remove('d-none');
        templateForm.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Escribe o escanea el número de usuario que se va a modificar</li>
                </ol>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control form-control-sm" name="textUsuario" id="textUsuario" placeholder="Buscar Usuario" autocomplete="off" autofocus/>
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                <div id="userListComplete" class="autocompletados"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textUsuario = document.querySelector('#textUsuario');
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        textUsuario.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                buscarUsuarioInformacion(textIdUsuario);
            }else if(e.keyCode >= 64 && e.keyCode <= 90){
                completarBusquedaUsuarios(textUsuario);
            }
        })
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        butonBuscarUsuario.addEventListener('click', () => {
            buscarUsuarioInformacion(textIdUsuario);
        })
        textUsuario.focus();

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const completarBusquedaUsuarios = async (textUsuario) => {
    try{
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        userListComplete.innerHTML='';
        if(textUsuario.value=='' || textUsuario.value==null){
            userListComplete.innerHTML='';
        }else{
            let idBusqueda = textUsuario.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`atramites/autocompletarUsuario/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    userListComplete.innerHTML='';
                    const listadoUl = document.createElement('ul');
                    listadoUl.innerHTML='';
                    listadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(usuario => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= usuario.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdUsuario.value=usuario.IDUSUA_CLIEN;
                            textUsuario.value = usuario.NOMBRE;
                            userListComplete.innerHTML='';
                        })
                        listadoUl.appendChild(listadoItemUl);
                    })
                    userListComplete.appendChild(listadoUl);

                }else{
                    userListComplete.innerHTML='';

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

const buscarUsuarioInformacion = async (textIdUsuario) => {
    try{
        if(textIdUsuario.value=='' || textIdUsuario.value==null){
            return Swal.fire({
                title: 'Validación',
                icon: 'error',
                confirmButtonColor: '#f43',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el usuario a buscar',
            })
        }else{
            let idBusqueda = textIdUsuario.value;
            buscarUsuarioGenerales(idBusqueda);
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

const buscarUsuarioGenerales = async  (idBusqueda) => {
    try{
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
        datosUsuarioDetalle.innerHTML=cargaAnimacion;
        fetch(`amodusuarios/llenarTablaUsuarioModificar/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            busquedaUsuarios.innerHTML=`
                <div class="card-text text-justify">
                    <ol class="col-12 fuente-12p" start="2">
                        <li>Hacer clic en el boton editar <span class="btn-info btn-sm"><i class="fa fa-edit"></i></span> para modificar el contrato.</li>
                    </ol>
                </div>
            `;
            const botonResetear = document.createElement('button');
            botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
            botonResetear.innerHTML='Modificar Otro Usuario';
            botonResetear.addEventListener('click', () => {
                datosUsuarioDetalle.innerHTML='';
                plantillaBusqueda();
            })
            const tablaDetallesUsuario = document.createElement('table');
            tablaDetallesUsuario.classList.add('table','table-sm','table-hover','table-bordered','fuente-12p');
            tablaDetallesUsuario.innerHTML=`
                <thead>
                    <th class="col">Detalles</th>
                    <th>Acciones</th>
                </thead>
            `;
            const cuerpoTablaDetallesUsuario = document.createElement('tbody');
            if(respuestas.estatus=='error'){
                cuerpoTablaDetallesUsuario.innerHTML=`
                    <td colspan="2">${respuestas.text}</td>
                `;
            }else{
                datosUsuarioDetalle.classList.add('tabla-contenedor');
                respuestas.forEach(usuarios => {
                    const filaTablaDetallesUsuarios = document.createElement('tr');
                    const columnaDetallesUsuarios = document.createElement('td');
                    columnaDetallesUsuarios.innerHTML=`
                        <div class="row fuente-12p">
                            <div class="col-md-10 col-12"><small>Usuario:</small> ${usuarios.NOMBRE}
                                <br/><small>Direccion:</small> ${usuarios.CALLES}, ${usuarios.COLONIA_CODPOS} C.P. ${usuarios.CODIPOST_CODPOS}, ${usuarios.NOMBRE_MUNIC}
                            </div>
                        </div>
                    `;
                    filaTablaDetallesUsuarios.appendChild(columnaDetallesUsuarios);
                    const columnaAcciones = document.createElement('td');
                    const botonEditarUsuario = document.createElement('button');
                    botonEditarUsuario.classList.add('btn','btn-info','btn-sm');
                    botonEditarUsuario.setAttribute('data-toggle','modal');
                    botonEditarUsuario.setAttribute('data-target','#formRegistroDatos');
                    botonEditarUsuario.setAttribute('dataedit',usuarios.idTablePk);
                    botonEditarUsuario.setAttribute('id','botonEditarSel');
                    botonEditarUsuario.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarUsuario.addEventListener('click',() => {
                        buscandoDatosEditar(botonEditarUsuario);
                    });
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonEditarUsuario);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaDetallesUsuarios.appendChild(columnaAcciones);
                    cuerpoTablaDetallesUsuario.appendChild(filaTablaDetallesUsuarios);

                })
                tablaDetallesUsuario.appendChild(cuerpoTablaDetallesUsuario);

            }
            datosUsuarioDetalle.innerHTML='';
            datosUsuarioDetalle.appendChild(tablaDetallesUsuario);
            datosUsuarioDetalle.appendChild(botonResetear);
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

const buscandoDatosEditar = async (botonEditarUsuario) => {
    try{
        let templateForm = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Modificar Usuario';
        templateForm.innerHTML=cargaAnimacion;
        Swal.fire({
            title: 'Editar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, editar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea editar los datos de este usuario?',
        })
        .then((result) => {
            if(result.isConfirmed){
                let idBusqueda = botonEditarUsuario.attributes.dataedit.value;
                fetch(`amodusuarios/cargarUsuarioModificar/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error'){

                    }else{
                        respuestas.forEach(cliente => {
                            let mailDecode='';
                            if(cliente.EMAIL_CLIEN==null){
                            }else{
                                mailDecode = atob(cliente.EMAIL_CLIEN).toString();
                            }
                            templateForm.innerHTML=`
                                <div class="card-text text-justify">
                                    <ol class="col-12 fuente-12p" start="3">
                                        <li>Completar los campos o modifica segun lo solicitado en el contrato importante anotar observaciones.</li>
                                    </ol>
                                </div>
                                <div class="bg-white p-2 mb-1">
                                    <div class="fuente-12p font-weight-bolder mb-2">Datos Personales</div>
                                    <div class="row">
                                        <input type="hidden" name="textCliente" id="textCliente" value="${cliente.IDUSUA_CLIEN}">
                                        <div class="form-group col-md-4 col-12 mb-1">
                                            <input type="text" name="textNombre" value="${cliente.NOMBRE_CLIEN}" class="form-control form-control-sm" id="textNombre" maxlength="13" placeholder="Nombre">
                                        </div>
                                        <div class="form-group col-md-4 col-12 mb-1">
                                            <input type="text" name="textApaterno" value="${cliente.APATERNO_CLIEN}" class="form-control form-control-sm" id="textApaterno" maxlength="13" placeholder="A. Paterno">
                                        </div>
                                        <div class="form-group col-md-4 col-12 mb-1">
                                            <input type="text" name="textAmaterno" value="${cliente.AMATERNO_CLIEN}" class="form-control form-control-sm" id="textAmaterno" maxlength="13" placeholder="A. Materno">

                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-3 col-12 mb-1">
                                            <input type="text" name="textNacimiento" value="${cliente.FNACIM_CLIEN}" class="form-control form-control-sm" id="textNacimiento" maxlength="13" placeholder="F Nacim." readonly>
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-1">
                                        <select name="textSexo" id="textSexo" class="custom-select custom-select-sm"></select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-3 col-12 mb-1">
                                            <input type="text" name="textTelefono" value="${cliente.TELEFONO_CLIEN}" class="form-control form-control-sm" id="textTelefono" maxlength="13" placeholder="Telefono">
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-1">
                                            <input type="text" name="textMovil" value="${cliente.MOVIL_CLIEN}" class="form-control form-control-sm" id="textMovil" maxlength="13" placeholder="Telefono 2">
                                        </div>
                                        <div class="form-group col-md-6 col-12 mb-1">
                                            <input type="text" name="textEmail" value="${mailDecode}" class="form-control form-control-sm" id="textEmail" maxlength="250" placeholder="alguien@aqui.com">
                                        </div>
                                    </div>
                                </div>

                            `;
                            let textSexo = document.querySelector('#textSexo');
                            botonActualizar.innerHTML='Actualizar';
                            if(cliente.SEXO_CLIEN=='H'){
                                textSexo.innerHTML=`
                                    <option value="">Sexo</option>
                                    <option value="H" selected="selected">Hombre</option>
                                    <option value="M">Mujer</option>
                                `;
                            }else if(cliente.SEXO_CLIEN=='M'){
                                textSexo.innerHTML=`
                                    <option value="">Sexo</option>
                                    <option value="H">Hombre</option>
                                    <option value="M" selected="selected">Mujer</option>
                                `;
                            }else{
                                textSexo.innerHTML=`
                                    <option value="">Sexo</option>
                                    <option value="H">Hombre</option>
                                    <option value="M">Mujer</option>
                                `;
                            }
                            let fechaActual = new Date();
                            let anioActual = fechaActual.getFullYear();
                            let mesActual = fechaActual.getMonth();
                            let diaActual = fechaActual.getDate();
                            let selecionDia = new Datepicker(textNacimiento, {
                                'range': true,
                                'minDate': new Date(anioActual -99, mesActual, diaActual),
                                'maxDate': new Date(anioActual -18, mesActual, diaActual),
                                'format': 'yyyy-mm-dd',
                                'language': 'es',
                                'autohide': 'true'
                            });
                            selecionDia
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

const llenarComboEstadosSelect = async (textEstado, selEstado) => {
    try{
        textEstado.innerHTML='<option value="">Estado</option>';
        fetch('catalogos/llenarComboCatEstados')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_ESTA);
                    opcionSelect.classList.add('fuente-12p');
                    if(selEstado==estados.CLAVE_ESTA){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=estados.ESTADO_ESTA;
                        textEstado.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=estados.ESTADO_ESTA;
                        textEstado.appendChild(opcionSelect);
                    }
                });
            }
            textEstado.addEventListener('change',() => {
                llenarComboMunicipiosSelect(textEstado);
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

const llenarComboMunicipiosSelect = async (selEstado, textMunicipio, selMunicipio) => {
    try{
        textMunicipio.innerHTML='<option value="">Municipio</option>';
        fetch(`catalogos/llenarComboCatMunicipios/${selEstado}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(municipios => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', municipios.CLVMUNI_MUNIC);
                    opcionSelect.classList.add('fuente-12p');
                    if(selMunicipio==municipios.CLVMUNI_MUNIC){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.NOMBRE_MUNIC;
                        textMunicipio.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.NOMBRE_MUNIC;
                        textMunicipio.appendChild(opcionSelect);
                    }
                });
            }
            textMunicipio.addEventListener('change',() => {
                llenarComboCodigoPostales(textMunicipio);
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

const llenarComboCodigoPostalesSelect = async (selMunicipio, textCodiPostal, selCodiPostal) => {
    try{
        textCodiPostal.innerHTML='<option value="">C.P.</option>';
        fetch(`catalogos/llenarComboCatCodPostales/${selMunicipio}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textEstado.appendChild(opcionSelect);
            }else{
                respuestas.forEach(municipios => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', municipios.CLVCODPOS_CODPOS);
                    opcionSelect.classList.add('fuente-12p');
                    if(selCodiPostal==municipios.CLVCODPOS_CODPOS){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.CODIPOST_CODPOS;
                        textCodiPostal.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.CODIPOST_CODPOS;
                        textCodiPostal.appendChild(opcionSelect);
                    }
                });
            }
            textCodiPostal.addEventListener('change',() => {
                llenarComboCodigoPostales(textMunicipio);
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

const llenarComboColoniasSelect = async (selCodiPostal, textColonia, selColonia) => {
    try{
        textColonia.innerHTML='<option value="">Colonias</option>';
        fetch(`catalogos/llenarComboCatColonias/${selCodiPostal}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textColonia.appendChild(opcionSelect);
            }else{
                respuestas.forEach(municipios => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', municipios.CLVCOLON_CODPOS);
                    opcionSelect.classList.add('fuente-12p');
                    if(selColonia==municipios.CLVCOLON_CODPOS){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.COLONIA_CODPOS;
                        textColonia.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.COLONIA_CODPOS;
                        textColonia.appendChild(opcionSelect);
                    }
                });
            }
            textColonia.addEventListener('change',() => {
                textCalle.focus();
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

const actualizarRegistroUsuario = async () => {
    try{
        if(validarCliente() && validarNombre() && validarApaterno() && validarAmaterno() && validarNacimiento() &&
        validarTelefono() && validarMovil() && validarEmail() && validarSexo()){
            botonActualizar.innerHTML='Espere...<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('amodusuarios/actualizarUsuarioInformacion', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado'){
                 return Swal.fire({
                     title: respuestas.title,
                     icon: respuestas.icon,
                     confirmButtonText: `${respuestas.button}`,
                     confirmButtonColor: '#9C0000',
                     html: respuestas.text,
                 });
                }else{
                    botonActualizar.innerHTML='Actualizado';
                    botonCancelar.click()
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                    });
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

botonCancelar.addEventListener('click', () => {
    let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
    formRegistroCRUD.innerHTML='';
})

function validarNombre(){
    let inputForm = document.querySelector("#textNombre");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Nombre es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Nombre min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Nombre máx 40 caracteres',
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

function validarApaterno(){
    let inputForm = document.querySelector("#textApaterno");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Paterno es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Paterno min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Paterno máx 40 caracteres',
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

function validarAmaterno(){
    let inputForm = document.querySelector("#textAmaterno");
    if(inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Materno min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'A Materno máx 40 caracteres',
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

function validarNacimiento(){
    let inputForm = document.querySelector("#textNacimiento");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'F Nacimiento es requerido',
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

function validarSexo(){
    let inputForm = document.querySelector("#textSexo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Sexo es requerido',
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

function validarTelefono(){
    let inputForm = document.querySelector("#textTelefono");
    if(isNaN(inputForm.value)){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Teléfono solo números',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 8) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Telefono min 8 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 13) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Telefono máx 13 caracteres',
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

function validarMovil(){
    let inputForm = document.querySelector("#textMovil");
    if(isNaN(inputForm.value)){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Movil solo números',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 8) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Movil min 8 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 13) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Movil máx 13 caracteres',
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

function validarEmail(){
    let inputForm = document.querySelector("#textEmail");
    // if(inputForm.value==null || inputForm.value==''){
    //     Swal.fire({
    //         title: 'Campo Inválido',
    //         confirmButtonText: 'Revisar',
    //         confirmButtonColor: '#9C0000',
    //         icon: 'error',
    //         text: 'Email es requerido',
    //     }).then((result)=>{
    //         if(result.isConfirmed){
    //             inputError(inputForm);
    //         }
    //     })
    //     return false;
    // }else
    if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Email min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Email máx 40 caracteres',
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

function validarEstado(){
    let inputForm = document.querySelector("#textEstado");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Estado es requerido',
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

function validarMunicipio(){
    let inputForm = document.querySelector("#textMunicipio");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Municipio es requerido',
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

function validarCodiPostal(){
    let inputForm = document.querySelector("#textCodiPostal");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'C. P. es requerido',
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

function validarColonia(){
    let inputForm = document.querySelector("#textColonia");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Colonia es requerido',
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

function validarCalle(){
    let inputForm = document.querySelector("#textCalle");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Calle es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Calle min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Calle máx 40 caracteres',
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

function validarNexter(){
    let inputForm = document.querySelector("#textNexter");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Ext. es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Ext. min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Ext. máx 40 caracteres',
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

function validarNinter(){
    let inputForm = document.querySelector("#textNinter");
    if(inputForm.length < 3) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. min 3 caracteres',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if (inputForm.length > 40) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. máx 40 caracteres',
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

function validarReferen(){
    let inputForm = document.querySelector("#textReferen");
    if (inputForm.length > 80) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. máx 80 caracteres',
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

function validarCliente(){
    let inputForm = document.querySelector("#textCliente");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Cliente es requerido',
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

function validarUbicacion(){
    let inputForm = document.querySelector("#textUbicacion");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Ubicacion es requerido',
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

function validarTipoContrato(){
    let inputForm = document.querySelector("#textTipoContrato");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'T. Contrato es requerido',
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

function validarExpContrato(){
    let inputForm = document.querySelector("#textExpContrato");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Expedición requerido',
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

function validarPermisos(){
    let inputForm = document.querySelector("#textPermisos");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Permisos es requerido',
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

function validarDescuento(){
    let inputForm = document.querySelector("#textDescuento");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Descuento es requerido',
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

function validarComentarios(){
    let inputForm = document.querySelector("#textComentarios");
    if (inputForm.length > 250) {
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'N. Int. máx 250 caracteres',
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
