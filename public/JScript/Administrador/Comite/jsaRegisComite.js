let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector('#botonActualizar');
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    obtenerListadoUsuarios();
    plantillaInicio();
    botonGuardar.addEventListener('click', () => {
        guardarRegistro();
    })
    botonActualizar.addEventListener('click', () => {
        actualizarRegistro();
    })
    botonCancelar.addEventListener('click', () => {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML='';
    })    
})

const obtenerListadoUsuarios = async () => {
    try{
        let tablaDinamica = document.querySelector('#tablaDinamica');
        tablaDinamica.innerHTML=cargaAnimacion;
        fetch('regiscomite/llenarTablaComite')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                return Swal.fire({
                    title: respuestas.title,
                    icon: respuestas.icon,
                    confirmButtonText: respuestas.button,
                    confirmButtonColor: '#BB0F0F',
                    html: respuestas.text,
                });

            }else{
                const tablaComite = document.createElement('table');
                tablaComite.classList.add('table','table-sm','table-hover','fuente-12');
                tablaComite.innerHTML=`
                    <thead>
                        <th>Registro</th>
                        <th class="col">Nombre</th>
                        <th>Telefono</th>
                        <th>F Registro</th>
                        <th>Acciones</th>
                    </thead>
                `;
                const cuerpoTablaComite = document.createElement('tbody');
                respuestas.forEach(usuarios => {
                    const filaTablaComite = document.createElement('tr');
                    filaTablaComite.classList.add('fuente-12p');
                    const columnaIdComite = document.createElement('td');
                    columnaIdComite.innerHTML=usuarios.ID_RESPO;
                    filaTablaComite.appendChild(columnaIdComite);
                    const columnaNombre = document.createElement('td');
                    if(usuarios.SEXO_RESPO=='H'){
                        columnaNombre.innerHTML=usuarios.NOMBRE+' | '+usuarios.DESCRIPHOM_PUESTO;
                    }else if(usuarios.SEXO_RESPO=='M'){
                        columnaNombre.innerHTML=usuarios.NOMBRE+' | '+usuarios.DESCRIPMUJ_PUESTO;
                    }
                    filaTablaComite.appendChild(columnaNombre);
                    const columnaTelefono = document.createElement('td');
                    columnaTelefono.innerHTML=usuarios.TELEFONO_RESPO;
                    filaTablaComite.appendChild(columnaTelefono);
                    const columnaFecha = document.createElement('td');
                    columnaFecha.innerHTML=usuarios.FMODIF_RESPO;
                    filaTablaComite.appendChild(columnaFecha);
                    const columnaAcciones = document.createElement('td');
                    const botonMailCreden = document.createElement('button');
                    botonMailCreden.classList.add('btn','btn-primary','btn-sm');
                    botonMailCreden.setAttribute('datamail',usuarios.idTablePk);
                    botonMailCreden.setAttribute('id','botonEditarSel');
                    botonMailCreden.innerHTML = '<i class="fa fa-envelope"></i>';
                    botonMailCreden.addEventListener('click',() => {
                        enviarMailCredencial(botonMailCreden);
                    });

                    const botonEditarEl = document.createElement('button');
                    botonEditarEl.classList.add('btn','btn-info','btn-sm');
                    botonEditarEl.setAttribute('data-toggle','modal');
                    botonEditarEl.setAttribute('data-target','#formRegistroDatos');
                    botonEditarEl.setAttribute('dataedit',usuarios.idTablePk);
                    botonEditarEl.setAttribute('id','botonEditarSel');
                    botonEditarEl.innerHTML = '<i class="fa fa-edit"></i>';
                    botonEditarEl.addEventListener('click',() => {
                        buscandoDatosEditar(botonEditarEl);
                    });
                    const botonEliminarReg = document.createElement('button');
                    botonEliminarReg.classList.add('btn','btn-danger','btn-sm');
                    botonEliminarReg.setAttribute('dataeliminar',usuarios.idTablePk);
                    botonEliminarReg.setAttribute('id','botonEliminarReg');
                    botonEliminarReg.innerHTML = '<i class="fa fa-eraser"></i>';
                    botonEliminarReg.addEventListener('click',() => {
                        eliminarRegistros(botonEliminarReg);
                    });
                    if(usuarios.idTablePk==''){
                        botonEditarEl.setAttribute('disabled','disabled');
                        botonEliminarReg.setAttribute('disabled','disabled');
                    }
                    const grupoAcciones = document.createElement('div');
                    grupoAcciones.classList.add('btn-group');
                    grupoAcciones.appendChild(botonMailCreden);
                    grupoAcciones.appendChild(botonEditarEl);
                    grupoAcciones.appendChild(botonEliminarReg);
                    columnaAcciones.appendChild(grupoAcciones);
                    filaTablaComite.appendChild(columnaAcciones);


                    cuerpoTablaComite.appendChild(filaTablaComite);
                })
                tablaDinamica.innerHTML='';
                tablaComite.appendChild(cuerpoTablaComite);
                tablaDinamica.appendChild(tablaComite);

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

const plantillaInicio = async () => {
    try {
        let iniciaUsuarios = document.querySelector('#iniciaUsuarios');
        iniciaUsuarios.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Haz clic en <span class="btn-success"><i class="fas fa-pencil-alt"></i> .</span> para iniciar el registro.</li>
                </ol>
            </div>
            <button type="button" id="iniciaCaptura" class="btn btn-sm btn-success mb-2" data-toggle="modal" data-target="#formRegistroDatos">
                <i class="fas fa-pencil-alt"></i> Nuevo Registro
            </button>
            <div class="card-text text-justify fuente-14p popup-hover">En este listado se muestran los registro del actual comité.
            </div>
        `;
        let iniciaCaptura = document.querySelector('#iniciaCaptura');
        iniciaCaptura.addEventListener('click', () => {
            plantillaFormulario();
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
        botonGuardar.classList.remove('d-none');
        botonActualizar.classList.add('d-none');
        botonGuardar.innerHTML='Guardar';
        let templateForm = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Registrar Comite';
        templateForm.innerHTML=`
            <div class="row">
                <div class="form-group col-md-4 col-12">
                    <input type="text" name="textNombre" value="" class="form-control form-control-sm" id="textNombre" maxlength="30" placeholder="Nombre">
                </div>
                <div class="form-group col-md-4 col-12">
                    <input type="text" name="textApaterno" value="" class="form-control form-control-sm" id="textApaterno" maxlength="30" placeholder="A. Paterno">
                </div>
                <div class="form-group col-md-4 col-12">
                    <input type="text" name="textAmaterno" value="" class="form-control form-control-sm" id="textAmaterno" maxlength="30" placeholder="A. Materno">

                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-3 col-12">
                    <input type="text" name="textNacimiento" value="" class="form-control form-control-sm" id="textNacimiento" maxlength="13" placeholder="F Nacim." readonly>
                </div>
                <div class="form-group col-md-3 col-12">
                <select name="textSexo" id="textSexo" class="custom-select custom-select-sm"></select>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-3 col-12">
                    <input type="text" name="textTelefono" value="" class="form-control form-control-sm" id="textTelefono" maxlength="13" placeholder="Telefono">
                </div>
                <div class="form-group col-md-3 col-12">
                    <input type="text" name="textMovil" value="" class="form-control form-control-sm" id="textMovil" maxlength="13" placeholder="Telefono 2">
                </div>
                <div class="form-group col-md-6 col-12">
                    <input type="text" name="textEmail" value="" class="form-control form-control-sm" id="textEmail" maxlength="250" placeholder="alguien@aqui.com">
                </div>
            </div>
            <div class="border p-1 mb-3">
                <div class="row">
                    <div class="form-group col-md-3 col-12">
                        <select name="textEstado" id="textEstado" class="custom-select custom-select-sm"></select>
                    </div>
                    <div class="form-group col-md-3 col-12">
                        <select name="textMunicipio" id="textMunicipio" class="custom-select custom-select-sm"></select>
                    </div>
                    <div class="form-group col-md-2 col-12">
                        <select name="textCodiPostal" id="textCodiPostal" class="custom-select custom-select-sm"></select>
                    </div>
                    <div class="form-group col-md-4 col-12">
                    <select name="textColonia" id="textColonia" class="custom-select custom-select-sm"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6 col-12">
                        <input type="text" name="textCalle" value="" class="form-control form-control-sm" id="textCalle" maxlength="50" placeholder="Calle">
                        <div id="listaBusqueda" class="autocompletados"></div>
                    </div>
                    <div class="form-group col-md-3 col-12">
                        <input type="text" name="textNexter" value="" class="form-control form-control-sm" id="textNexter" maxlength="30" placeholder="N. Ext.">
                    </div>
                    <div class="form-group col-md-3 col-12">
                        <input type="text" name="textNinter" value="" class="form-control form-control-sm" id="textNinter" maxlength="30" placeholder="N. Int.">
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" name="textReferen" value="" class="form-control form-control-sm" id="textReferen" maxlength="80" placeholder="Referencia del domicilio">
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-3 col-12">
                <select name="textPuesto" id="textPuesto" class="custom-select custom-select-sm"></select>
                </div>
            </div>

        `;
        let listaBusqueda = document.querySelector('#listaBusqueda');
        let textMunicipio = document.querySelector('#textMunicipio');
        let textCodiPostal = document.querySelector('#textCodiPostal');
        let textColonia = document.querySelector('#textColonia');
        let textCalle = document.querySelector('#textCalle');
        let textSexo = document.querySelector('#textSexo');
        let textNacimiento = document.querySelector('#textNacimiento');
        textMunicipio.innerHTML='<option value="">---</option>';
        textCodiPostal.innerHTML='<option value="">---</option>';
        textColonia.innerHTML='<option value="">---</option>';
        textSexo.innerHTML='<option value="">Sexo</option><option value="H">Hombre</option><option value="M">Mujer</option>';
        llenarComboEstados();
        llenarComboPuestos();
        textCalle.addEventListener('keyup', () => {
            listaBusqueda.innerHTML='';
            completarCalles(textCalle);
        })
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

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const llenarComboEstados = async () => {
    try{
        let textEstado = document.querySelector('#textEstado');
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
                    opcionSelect.innerHTML=estados.NOMBRE_ESTA;
                    textEstado.appendChild(opcionSelect);
                });
            }
            textEstado.addEventListener('change',() => {
                llenarComboMunicipios(textEstado);
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

const llenarComboMunicipios = async (textEstado) => {
    try{
        let textMunicipio = document.querySelector('#textMunicipio');
        if(textEstado.value=='' || textEstado.value==null){
            textMunicipio.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textEstado.value;
            textMunicipio.innerHTML='<option value="">Cargando...</option>';
            fetch(`catalogos/llenarComboCatMunicipios/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                textMunicipio.innerHTML='<option value="">Municipio</option>';
                if(respuestas.estatus=='error'){
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', '');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML='Sin Datos';
                    textMunicipio.appendChild(opcionSelect);
                }else{
                    respuestas.forEach(estados => {
                        const opcionSelect = document.createElement('option');
                        opcionSelect.setAttribute('value', estados.CLVMUNI_MUNIC);
                        opcionSelect.classList.add('fuente-12p');
                        opcionSelect.innerHTML=estados.NOMBRE_MUNIC;
                        textMunicipio.appendChild(opcionSelect);
                    });
                    textMunicipio.focus();
                }
                textMunicipio.addEventListener('change',() => {
                    llenarComboCodigoPostales(textMunicipio);
                });
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

const llenarComboCodigoPostales = async (textMunicipio) => {
    try{
        let textCodiPostal = document.querySelector('#textCodiPostal');
        if(textMunicipio.value=='' || textMunicipio.value==null){
            textCodiPostal.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textMunicipio.value;
            textCodiPostal.innerHTML='<option value="">Cargando...</option>';
            fetch(`catalogos/llenarComboCatCodPostales/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                textCodiPostal.innerHTML='<option value="">C.P.</option>';
                if(respuestas.estatus=='error'){
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', '');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML='Sin Datos';
                    textCodiPostal.appendChild(opcionSelect);
                }else{
                    respuestas.forEach(estados => {
                        const opcionSelect = document.createElement('option');
                        opcionSelect.setAttribute('value', estados.CLVCODPOS_CODPOS);
                        opcionSelect.classList.add('fuente-12p');
                        opcionSelect.innerHTML=estados.CODIPOST_CODPOS;
                        textCodiPostal.appendChild(opcionSelect);
                    });
                    textCodiPostal.focus();
                }
                textCodiPostal.addEventListener('change',() => {
                    llenarComboColonias(textCodiPostal);
                });
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

const llenarComboColonias = async (textCodiPostal) => {
    try{
        let textColonia = document.querySelector('#textColonia');
        if(textCodiPostal.value=='' || textCodiPostal.value==null){
            textColonia.innerHTML='<option value="">---</option>';
        }else{
            let idBusqueda = textCodiPostal.value;
            textColonia.innerHTML='<option value="">Cargando...</option>';
            fetch(`catalogos/llenarComboCatColonias/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                textColonia.innerHTML='<option value="">Colonias</option>';
                if(respuestas.estatus=='error'){
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', '');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML='Sin Datos';
                    textColonia.appendChild(opcionSelect);
                }else{
                    respuestas.forEach(estados => {
                        const opcionSelect = document.createElement('option');
                        opcionSelect.setAttribute('value', estados.CLVCOLON_COLON);
                        opcionSelect.classList.add('fuente-12p');
                        opcionSelect.innerHTML=estados.COLONIA_COLON;
                        textColonia.appendChild(opcionSelect);
                    });
                    textColonia.focus();
                }
                textColonia.addEventListener('change',() => {
                    textCalle.focus();
                });
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

const llenarComboPuestos = async () => {
    try{
        let textPuesto = document.querySelector('#textPuesto');
        textPuesto.innerHTML='<option value="">Puestos</option>';
        fetch('catalogos/llenarComboPuestos/ADMINISTRAD')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textPuesto.appendChild(opcionSelect);
            }else{
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_PUESTO);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=estados.DESCRIPHOM_PUESTO;
                    textPuesto.appendChild(opcionSelect);
                });
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

const completarCalles = async(textCalle) => {
    try{
        let listaBusqueda = document.querySelector('#listaBusqueda');
        let textColonia = document.querySelector('#textColonia');
        let textNexter = document.querySelector('#textNexter');
        listaBusqueda.innerHTML='';
        if(textCalle.value=='' || textCalle.value==null){
            listaBusqueda.innerHTML='';
        }else{
            let idBusqueda = textCalle.value;
            listaBusqueda.innerHTML='';
            fetch(`catalogos/llenarCompletarCalles/${textColonia.value}_${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    const ListadoUl = document.createElement('ul');
                    ListadoUl.innerHTML='';
                    ListadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(calles => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= calles.CALLE_CALLE;
                        listadoItemUl.addEventListener('click', () => {
                            textCalle.value = calles.CALLE_CALLE;
                            listaBusqueda.innerHTML='';
                            textNexter.focus();
                        })
                        ListadoUl.appendChild(listadoItemUl);
                    })
                    listaBusqueda.appendChild(ListadoUl);
                }else{
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

const guardarRegistro = async () => {
    try{
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        if(validarNombre() && validarApaterno() && validarAmaterno() && validarNacimiento() && validarSexo() && validarTelefono() && 
        validarMovil() && validarEmail() && validarEstado() && validarMunicipio() && validarCodiPostal() && validarColonia() && 
        validarCalle() && validarNexter() && validarNinter() && validarReferen() && validarPuesto()){
            botonGuardar.innerHTML='Espere...<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('regiscomite/guardarComiteNuevo', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado' || respuestas.estatus=='nosesion'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9A1616',
                        html: respuestas.text,
                    });
                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#2BC323',
                        html: respuestas.text,
                    }).then((result) => {
                        if((result.isConfirmed)){
                            obtenerListadoUsuarios();
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
    try{
        let templateForm = document.querySelector('#formRegistroCRUD');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        botonGuardar.classList.add('d-none');
        botonActualizar.classList.remove('d-none');
        botonActualizar.innerHTML='Actualizar';
        labelTitleModal.innerHTML='Modificar Usuario';
        templateForm.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
        Swal.fire({
            title: 'Editar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0A8000',
            confirmButtonText: 'Si, editar',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea editar los datos de este usuario?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonEditarEl.attributes.dataedit.value;
                fetch(`regiscomite/buscarEditarComite/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    botonEditarEl.innerHTML='<i class="fa fa-edit"></i>';
                    if(respuestas.estatus=='error'){

                    }else{
                        respuestas.forEach(usuario => {
                            let mailDecode= '';
                            if(usuario.EMAIL_RESPO==null){
                            }else{
                                mailDecode = atob(usuario.EMAIL_RESPO).toString();
                            }
                            templateForm.innerHTML=`
                                <div class="row">
                                    <input type="hidden" name="textCliente" id="textCliente" value="${usuario.IDUSUA_RESPO}">
                                    <input type="hidden" name="textUbicacion" id="textUbicacion" value="${usuario.IDUBIC_UBIC}">
                                    <div class="form-group col-md-4 col-12">
                                        <input type="text" name="textNombre" value="${usuario.NOMBRE_RESPO}" class="form-control form-control-sm" id="textNombre" maxlength="13" placeholder="Nombre">
                                    </div>
                                    <div class="form-group col-md-4 col-12">
                                        <input type="text" name="textApaterno" value="${usuario.APATERNO_RESPO}" class="form-control form-control-sm" id="textApaterno" maxlength="13" placeholder="A. Paterno">
                                    </div>
                                    <div class="form-group col-md-4 col-12">
                                        <input type="text" name="textAmaterno" value="${usuario.AMATERNO_RESPO}" class="form-control form-control-sm" id="textAmaterno" maxlength="13" placeholder="A. Materno">

                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3 col-12">
                                        <input type="text" name="textNacimiento" value="${usuario.FNACIM_RESPO}" class="form-control form-control-sm" id="textNacimiento" maxlength="13" placeholder="F Nacim." readonly>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                    <select name="textSexo" id="textSexo" class="custom-select custom-select-sm"></select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3 col-12">
                                        <input type="text" name="textTelefono" value="${usuario.TELEFONO_RESPO}" class="form-control form-control-sm" id="textTelefono" maxlength="13" placeholder="Telefono">
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <input type="text" name="textMovil" value="${usuario.MOVIL_RESPO}" class="form-control form-control-sm" id="textMovil" maxlength="13" placeholder="Telefono 2">
                                    </div>
                                    <div class="form-group col-md-6 col-12">
                                        <input type="text" name="textEmail" value="${mailDecode}" class="form-control form-control-sm" id="textEmail" maxlength="250" placeholder="alguien@aqui.com">
                                    </div>
                                </div>
                                <div class="border p-1">
                                    <input type="hidden" name="textUbicacion" id="textUbicacion" value="${usuario.IDUBIC_UBIC}">
                                    <div class="row">
                                        <div class="form-group col-md-3 col-12">
                                            <select name="textEstado" id="textEstado" class="custom-select custom-select-sm"></select>
                                        </div>
                                        <div class="form-group col-md-3 col-12">
                                            <select name="textMunicipio" id="textMunicipio" class="custom-select custom-select-sm"></select>
                                        </div>
                                        <div class="form-group col-md-2 col-12">
                                            <select name="textCodiPostal" id="textCodiPostal" class="custom-select custom-select-sm"></select>
                                        </div>
                                        <div class="form-group col-md-4 col-12">
                                        <select name="textColonia" id="textColonia" class="custom-select custom-select-sm"></select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-6 col-12">
                                            <input type="text" name="textCalle" value="${usuario.CALLE_UBIC}" class="form-control form-control-sm" id="textCalle" maxlength="50" placeholder="Calle">
                                            <div id="listaBusqueda" class="autocompletados"></div>
                                        </div>
                                        <div class="form-group col-md-3 col-12">
                                            <input type="text" name="textNexter" value="${usuario.NEXTE_UBIC}" class="form-control form-control-sm" id="textNexter" maxlength="30" placeholder="N. Ext.">
                                        </div>
                                        <div class="form-group col-md-3 col-12">
                                            <input type="text" name="textNinter" value="${usuario.NINTE_UBIC}" class="form-control form-control-sm" id="textNinter" maxlength="30" placeholder="N. Int.">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" name="textReferen" value="${usuario.REFERENCIA_UBIC}" class="form-control form-control-sm" id="textReferen" maxlength="80" placeholder="Referencia">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3 col-12">
                                        <select name="textPuesto" id="textPuesto" class="custom-select custom-select-sm"></select>
                                    </div>
                                </div>

                            `;
                            let textSexo = document.querySelector('#textSexo');
                            let textEstado = document.querySelector('#textEstado');
                            let textMunicipio = document.querySelector('#textMunicipio');
                            let textCodiPostal = document.querySelector('#textCodiPostal');
                            let textColonia = document.querySelector('#textColonia');
                            let textCalle = document.querySelector('#textCalle');
                            let textPuesto = document.querySelector('#textPuesto');
                            if(usuario.SEXO_RESPO=='H'){
                                textSexo.innerHTML=`
                                    <option value="">Sexo</option>
                                    <option value="H" selected="selected">Hombre</option>
                                    <option value="M">Mujer</option>
                                `;
                            }else if(usuario.SEXO_RESPO=='M'){
                                textSexo.innerHTML=`
                                    <option value="">Sexo</option>
                                    <option value="H">Hombre</option>
                                    <option value="M" selected="selected">Mujer</option>
                                `;
                            }
                            textCalle.addEventListener('keyup', () => {
                                listaBusqueda.innerHTML='';
                                completarCalles(textCalle);
                            })
                            selEstado=usuario.ESTADO_UBIC;
                            llenarComboEstadosSelect(textEstado, selEstado);
                            selMunicipio=usuario.MUNICIPIO_UBIC;
                            llenarComboMunicipiosSelect(selEstado, textMunicipio, selMunicipio);
                            selCodiPostal=usuario.CODIPOSTAL_UBIC;
                            llenarComboCodigoPostalesSelect(selMunicipio, textCodiPostal, selCodiPostal);
                            selColonia=usuario.COLONIA_UBIC;
                            llenarComboColoniasSelect(selCodiPostal, textColonia, selColonia);
                            selPuesto=usuario.PERFIL_RESPO;
                            llenarComboPuestosSelect(selPuesto);
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

                        })
                    }
                })
            }else{
                botonCancelar.click();
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
                        opcionSelect.innerHTML=estados.NOMBRE_ESTA;
                        textEstado.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=estados.NOMBRE_ESTA;
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
                    opcionSelect.setAttribute('value', municipios.CLVCOLON_COLON);
                    opcionSelect.classList.add('fuente-12p');
                    if(selColonia==municipios.CLVCOLON_COLON){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=municipios.COLONIA_COLON;
                        textColonia.appendChild(opcionSelect);
                    }else{
                        opcionSelect.innerHTML=municipios.COLONIA_COLON;
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

const llenarComboPuestosSelect = async (selPuesto) => {
    try{
        let textPuesto = document.querySelector('#textPuesto');
        textPuesto.innerHTML='<option value="">Puestos</option>';
        fetch('catalogos/llenarComboPuestos/ADMINISTRAD')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textPuesto.appendChild(opcionSelect);
            }else{
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_PUESTO);
                    opcionSelect.classList.add('fuente-12p');
                    if(selPuesto==estados.CLAVE_PUESTO){
                        opcionSelect.setAttribute('selected', 'selected');
                        opcionSelect.innerHTML=estados.DESCRIPHOM_PUESTO;
                        textPuesto.appendChild(opcionSelect);

                    }else{
                        opcionSelect.innerHTML=estados.DESCRIPHOM_PUESTO;
                        textPuesto.appendChild(opcionSelect);
                    }

                });
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

const actualizarRegistro = async () => {
    try{
        if(validarNombre() && validarUbicacion() && validarApaterno() && validarAmaterno() && validarNacimiento() && validarTelefono() 
        && validarMovil() && validarEmail() && validarEstado() && validarMunicipio() && validarCodiPostal() && validarColonia() && 
        validarCalle() && validarNexter() && validarNinter() && validarReferen() && validarPuesto()){
            botonActualizar.innerHTML='Espere...<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
            const crearDatos = new FormData(formRegistroCRUD);
            fetch('regiscomite/actualizarRegistroComite', {
                method: 'POST',
                body: crearDatos,
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error' || respuestas.estatus=='invalido' || respuestas.estatus=='duplicado'){
                 return Swal.fire({
                     title: respuestas.title,
                     icon: respuestas.icon,
                     confirmButtonText: respuestas.button,
                     confirmButtonColor: '#51BB0F',
                     html: respuestas.text,
                 });
                }else{
                    botonActualizar.innerHTML='Actualizado';
                    botonCancelar.click()
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#51BB0F',
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

const eliminarRegistros = async (botonEliminarReg) => {
    try{
        let idBusqueda = botonEliminarReg.attributes.dataeliminar.value;
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
                fetch(`regiscomite/eliminarRegistroComite/${idBusqueda}`)
                .then(respuestaEl=>respuestaEl.json())
                .then(eliminado=>{
                    if(eliminado.estatus=='eliminado'){
                        botonEliminarReg.parentNode.parentNode.parentNode.remove();
                        return Swal.fire({
                            title: eliminado.title,
                            icon: eliminado.icon,
                            confirmButtonText: eliminado.button,
                            confirmButtonColor: '#51BB0F',
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

const enviarMailCredencial = async (botonMailCreden) => {
    try {
        let idBusqueda = botonMailCreden.attributes.datamail.value;
        Swal.fire({
            title: '¿Enviar Correo?',
            text: "¿Desea enviar un correo al destinatario con sus credenciales de acceso?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#51BB0F',
            cancelButtonColor: '#B80C21',
            confirmButtonText: '¡Si, enviar!',
            cancelButtonText: '¡No, mejor no!',
        })
        .then((result)=>{
            if(result.isConfirmed){
                fetch(`regiscomite/enviarCorreoComiteCred/${idBusqueda}`)
                .then(respRender=>respRender.json())
                .then(respuestas=>{
                    if(respuestas.estados=='error'||respuestas.estatus=='novalido'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: respuestas.button,
                            confirmButtonColor: '#B80C21',
                            html: respuestas.text,
                        })
                    }else if(respuestas.estatus=='enviado'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: respuestas.button,
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

function validarUbicacion(){
    let inputForm = document.querySelector("#textUbicacion");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Ubicación',
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

function validarPuesto(){
    let inputForm = document.querySelector("#textPuesto");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
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

function inputError(inputForm){
    inputForm.classList.add('is-invalid');
}

function inputValido(inputForm){
    inputForm.classList.remove('is-invalid');
    inputForm.classList.add('is-valid');
}
