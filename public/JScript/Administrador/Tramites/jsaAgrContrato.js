let botonContrato = document.querySelector('#botonContrato');
let botonCancelar = document.querySelector('#botonCancelar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonContrato.addEventListener('click', () => {
        asignarContratoUsuario();
    })
    botonCancelar.addEventListener('click', () => {
        let datosUsuarioTemplate = document.querySelector('#datosUsuarioTemplate');
        let datosUsuarioContrato = document.querySelector('#datosUsuarioContrato');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='';
        datosUsuarioTemplate.innerHTML='';
        datosUsuarioContrato.innerHTML='';
    })
})

const plantillaBusqueda = async () => {
    try{
        let templateForm = document.querySelector('#busquedaUsuarios');
        templateForm.classList.remove('d-none');
        templateForm.innerHTML=`
            <div class="card-text text-justify">
                <ol class="col-12 fuente-12p">
                    <li>Buscar usuario que se agrega nuevo contrato</li>
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
                confirmButtonColor: '#9C0000',
                confirmButtonText: 'Completar',
                html: 'Debe ingresar el usuario a buscar',
            })
        }else{
            let idBusqueda = textIdUsuario.value;
            let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
            let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
            datosUsuarioDetalle.innerHTML=cargaAnimacion;
            fetch(`aagrcontrato/llenarTablaUsuariosAsignado/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    });

                }else{
                    const botonResetear = document.createElement('button');
                    botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
                    botonResetear.innerHTML='Iniciar de nuevo';
                    botonResetear.addEventListener('click', ()=> {
                        datosUsuarioDetalle.innerHTML='';
                        plantillaBusqueda();
                    })
    
                    const tablaUsuarios = document.createElement('table')
                    tablaUsuarios.classList.add('table','table-sm','table-hover','table-bordered');
                    tablaUsuarios.innerHTML=`
                        <thead>
                            <tr>
                                <th scope="col" class="col">Detalles</th>
                                <th scope="col" class="text-center">Acciones</th>
                            </tr>
                        </thead>
                    `;
                    const cuerpoTablaUsuarios = document.createElement('tbody');
                    busquedaUsuarios.innerHTML=`
                        <div class="card-text text-justify">
                            <ol class="col-12 fuente-12p" start="2">
                                <li>Hacer clic en el boton agregar contrato <span class="btn-info btn-sm"><i class="fa fa-folder-plus"></i></span> para uno nuevo.</li>
                            </ol>
                        </div>
                        <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="${idBusqueda}" />
                    `;
                    respuestas.forEach(usuarios => {
                        const filaTablaUsuarios = document.createElement('tr');
                        const columnaDetalles = document.createElement('td');
                        columnaDetalles.innerHTML=`
                            <div class="row fuente-12p">
                                <div class="col-md-7 col-12">${usuarios.CLIENTE}</div>
                                <div class="col-md-3 col-12">${usuarios.FMODIF_CLIEN}</div>
                                <div class="col-md-3 col-12"><div class="badge badge-info">Contratos: ${usuarios.TOTAL}</div>
                            </div>
                        `;
                        filaTablaUsuarios.appendChild(columnaDetalles);
                        const columnaAcciones = document.createElement('td');
                        const botonAsignarElemento = document.createElement('button');
                        botonAsignarElemento.classList.add('btn','btn-info','btn-sm');
                        botonAsignarElemento.setAttribute('data-toggle','modal');
                        botonAsignarElemento.setAttribute('data-target','#formRegistroDatos');
                        botonAsignarElemento.setAttribute('dataasign',usuarios.idTablePk);
                        botonAsignarElemento.setAttribute('id','botonAsignarEl');
                        botonAsignarElemento.innerHTML = '<i class="fa fa-folder-plus"></i>';
                        botonAsignarElemento.addEventListener('click',() => {
                            buscarUsuarioAsignar(botonAsignarElemento);
                        });
                        const botonVerContrato = document.createElement('button');
                        botonVerContrato.classList.add('btn','btn-success');
                        botonVerContrato.setAttribute('data-toggle','modal','btn-sm');
                        botonVerContrato.setAttribute('data-target','#formRegistroDatos');
                        botonVerContrato.setAttribute('dataimprimir',usuarios.idTablePk);
                        botonVerContrato.setAttribute('id','botonVerContrato');
                        botonVerContrato.innerHTML = '<i class="fa fa-eye"></i>';
                        botonVerContrato.addEventListener('click',() => {
                            mostrarContratosUsuario(botonVerContrato);
                        });
                        const grupoAcciones = document.createElement('div');
                        grupoAcciones.classList.add('btn-group');
                        grupoAcciones.appendChild(botonAsignarElemento);
                        grupoAcciones.appendChild(botonVerContrato);
                        columnaAcciones.appendChild(grupoAcciones);
                        filaTablaUsuarios.appendChild(columnaAcciones);
                        cuerpoTablaUsuarios.appendChild(filaTablaUsuarios);
                    })
                    tablaUsuarios.appendChild(cuerpoTablaUsuarios);
                    datosUsuarioDetalle.innerHTML='';
                    datosUsuarioDetalle.appendChild(tablaUsuarios);
                    datosUsuarioDetalle.appendChild(botonResetear);
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

const buscarUsuarioAsignar = async (botonAsignarElemento) => {
    try{
        let idBusqueda = botonAsignarElemento.attributes.dataasign.value;
        let datosUsuarioTemplate = document.querySelector('#datosUsuarioTemplate');
        let datosUsuarioContrato = document.querySelector('#datosUsuarioContrato');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Agregar Contrato';
        datosUsuarioTemplate.innerHTML=cargaAnimacion;
        datosUsuarioContrato.innerHTML='';
        Swal.fire({
            title: 'Editar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, agregar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea agregar contrato a este usuario?',
        })
        .then((result) => {
            if(result.isConfirmed){
                fetch(`aagrcontrato/cargaUsuarioAsignar/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error'){
                        return Swal.fire({
                            title: respuestas.title,
                            icon: respuestas.icon,
                            confirmButtonText: `${respuestas.button}`,
                            confirmButtonColor: '#9C0000',
                            html: respuestas.text,
                        });
        
                    }else{
                        datosUsuarioTemplate.innerHTML='';
                        respuestas.forEach(usuarios => {
                            datosUsuarioTemplate.innerHTML=`
                                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="${usuarios.IDUSUA_CLIEN}" />
                                <div class="bg-white mb-2 p-2">
                                    <div class="fuente-12p font-weight-bolder mb-2">Datos Personales</div>
                                    <div class="form-group mb-2">
                                        <div class="form-control form-control-sm"><small>Usuario:</small> ${usuarios.NOMBRE}</div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-4 col-12 mb-2">
                                            <div class="form-control form-control-sm"><small>Telefono:</small> ${usuarios.TELEFONO_CLIEN} - ${usuarios.MOVIL_CLIEN}</div>
                                        </div>
                                        <div class="form-group col-md-4 col-12 mb-2">
                                            <div class="form-control form-control-sm"><small>Email:</small> ${usuarios.EMAIL_CLIEN}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="alert alert-info fuente-12p mb-2">
                                    Ahora deberas ingresar la dirección que se va a ocupar para establecer este contrato en caso de que el usuarios haga una contratación nueva
                                </div>
                                <div class="card-text text-justify">
                                    <ol class="col-12 fuente-12p" start="3">
                                        <li>Completar los campos solicitados de ubicación y detalles de contrato.</li>
                                    </ol>
                                </div>
                                <div class="bg-white border p-2 mb-2">
                                    <div class="fuente-12p font-weight-bolder mb-2">Ubicacion Contrato</div>
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
                                        <input type="text" name="textReferen" value="" class="form-control form-control-sm" id="textReferen" maxlength="80" placeholder="Referencia">
                                    </div>
                                </div>
                                <div class="bg-white border p-2 mb-2">
                                    <div class="fuente-12p font-weight-bolder mb-2">Detalles Contrato</div>
                                    <div class="row">
                                        <div class="form-group col-md-3 col-12">
                                            <select name="textTipoContrato" id="textTipoContrato" class="custom-select custom-select-sm"></select>
                                        </div>
                                        <div class="form-group col-md-3 col-12">
                                            <select name="textExpContrato" id="textExpContrato" class="custom-select custom-select-sm"></select>
                                        </div>
                                        <div class="form-group col-md-3 col-12">
                                            <select name="textPermisos" id="textPermisos" class="custom-select custom-select-sm"></select>
                                        </div>
                                        <div class="form-group col-md-3 col-12">
                                            <select name="textDescuento" id="textDescuento" class="custom-select custom-select-sm"></select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <textarea name="textComentarios" id="textComentarios" class="form-control form-control-sm" placeholder="Observaciones o comentarios"></textarea>
                                    </div>
                                </div>
        
                            `;
                            let textMunicipio = document.querySelector('#textMunicipio');
                            let textCodiPostal = document.querySelector('#textCodiPostal');
                            let textColonia = document.querySelector('#textColonia');
                            let textCalle = document.querySelector('#textCalle');
                            let textNexter = document.querySelector('#textNexter');
                            let listaBusqueda = document.querySelector('#listaBusqueda');
                            textMunicipio.innerHTML='<option value="">---</option>';
                            textCodiPostal.innerHTML='<option value="">---</option>';
                            textColonia.innerHTML='<option value="">---</option>';
                            llenarComboEstados();
                            textCalle.addEventListener('keyup', (e) => {
                                listaBusqueda.innerHTML='';
                                if(e.keyCode=='13'){
                                    e.preventDefault();
                                    textNexter.focus();
                                }else if(e.keyCode >= 64 && e.keyCode <= 90){
                                    completarCalles(textCalle);
                                }
                            })
                            let textTipoContrato = document.querySelector('#textTipoContrato');
                            let textExpContrato = document.querySelector('#textExpContrato');
                            let textPermisos = document.querySelector('#textPermisos');
                            let textDescuento = document.querySelector('#textDescuento');
                            llenarComboContratos(textTipoContrato);
                            llenarComboExpedicion(textExpContrato);
                            llenarComboPermisos(textPermisos);
                            llenarComboTarifa(textDescuento);
                            botonContrato.classList.remove('d-none');
        
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

const llenarComboEstados = async () => {
    try{
        let textEstado = document.querySelector('#textEstado');
        textEstado.innerHTML='<option value="">Cargando...*</option>';
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
                textEstado.innerHTML='<option value="">Estado*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_ESTA);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=estados.ESTADO_ESTA;
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
                textMunicipio.innerHTML='<option value="">Municipio*</option>';
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
                textCodiPostal.innerHTML='<option value="">C.P.*</option>';
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
                textColonia.innerHTML='<option value="">Colonias*</option>';
                if(respuestas.estatus=='error'){
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', '');
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML='Sin Datos';
                    textColonia.appendChild(opcionSelect);
                }else{
                    respuestas.forEach(estados => {
                        const opcionSelect = document.createElement('option');
                        opcionSelect.setAttribute('value', estados.CLVCOLON_CODPOS);
                        opcionSelect.classList.add('fuente-12p');
                        opcionSelect.innerHTML=estados.COLONIA_CODPOS;
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
            listaBusqueda.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
            fetch(`catalogos/llenarCompletarCalles/${textColonia.value}_${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    listaBusqueda.innerHTML='';
                    const listadoUl = document.createElement('ul');
                    listadoUl.innerHTML='';
                    listadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(calles => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= calles.CALLE_CALLE;
                        listadoItemUl.addEventListener('click', () => {
                            textCalle.value = calles.CALLE_CALLE;
                            listaBusqueda.innerHTML='';
                            textNexter.focus();
                        })
                        listadoUl.appendChild(listadoItemUl);
                    })
                    listaBusqueda.appendChild(listadoUl);
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

const llenarComboContratos = async (textTipoContrato) => {
    try {
        textTipoContrato.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatContrato')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textTipoContrato.appendChild(opcionSelect);
            }else{
                textTipoContrato.innerHTML='<option value="">Tipo Contrato*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CONT);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=estados.DESCRIPCION_CONT;
                    textTipoContrato.appendChild(opcionSelect);
                });
                // textTipoContrato.addEventListener('change', () => {
                //     tarifaExpedicion
                // })
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

const llenarComboExpedicion = async (textExpContrato) => {
    try {
        textExpContrato.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatExpedicion')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textExpContrato.appendChild(opcionSelect);
            }else{
                textExpContrato.innerHTML='<option value="">Expedición*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CEXP);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=estados.DESCRIPCION_CEXP;
                    textExpContrato.appendChild(opcionSelect);
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

const llenarComboPermisos = async (textPermisos) => {
    try {
        textPermisos.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatPermisos')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textPermisos.appendChild(opcionSelect);
            }else{
                textPermisos.innerHTML='<option value="">Permisos*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CPERM);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=estados.DESCRIPCION_CPERM;
                    textPermisos.appendChild(opcionSelect);
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

const llenarComboTarifa = async (textDescuento) => {
    try {
        textDescuento.innerHTML='<option value="">Cargando...*</option>'
        fetch('acatalogos/llenarComboCatTarifa')
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textDescuento.appendChild(opcionSelect);
            }else{
                textDescuento.innerHTML='<option value="">Tarifa*</option>';
                respuestas.forEach(estados => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', estados.CLAVE_CTARI);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=estados.DESCRIPCION_CTARI;
                    textDescuento.appendChild(opcionSelect);
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

const asignarContratoUsuario = async () => {
    try {
        let textIdUsuario = document.querySelector('#textIdUsuario');
        let textEstado = document.querySelector('#textEstado');
        let textMunicipio = document.querySelector('#textMunicipio');
        let textCodiPostal = document.querySelector('#textCodiPostal');
        let textColonia = document.querySelector('#textColonia');
        let textCalle = document.querySelector('#textCalle');
        let textNexter = document.querySelector('#textNexter');
        let textNinter = document.querySelector('#textNinter');
        let textReferen = document.querySelector('#textReferen');
        let textTipoContrato = document.querySelector('#textTipoContrato');
        let textExpContrato = document.querySelector('#textExpContrato');
        let textDescuento = document.querySelector('#textDescuento');
        let textPermisos = document.querySelector('#textPermisos');
        let textComentarios = document.querySelector('#textComentarios');
        if(validarIdUsuario() && validarEstado() && validarMunicipio() && validarCodiPostal() && validarColonia()
        && validarCalle() && validarNexter() && validarNinter() && validarReferen() && validarTipoContrato() && validarExpContrato()
        && validarDescuento() && validarPermisos() && validarComentarios()){
            const crearContrato = {
                textIdUsuario: textIdUsuario.value,
                textEstado: textEstado.value,
                textMunicipio: textMunicipio.value,
                textCodiPostal: textCodiPostal.value,
                textColonia: textColonia.value,
                textCalle: textCalle.value,
                textNexter: textNexter.value,
                textNinter: textNinter.value,
                textReferen: textReferen.value,
                textTipoContrato: textTipoContrato.value,
                textExpContrato: textExpContrato.value,
                textDescuento: textDescuento.value,
                textPermisos: textPermisos.value,
                textComentarios: textComentarios.value,
            };
            fetch('aagrcontrato/asignarNuevoContrato',{
                method: 'POST',
                body: JSON.stringify(crearContrato),
                headers: {
                    "Content-type": "application/json",
                },
            })
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.estatus=='error'){
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    })
                }else{
                    respuestas.forEach(idContrato => {
                        let idVerContrato = idContrato.IDCONTRAUSER;
                        return Swal.fire({
                            title: 'Asignado',
                            icon: 'success',
                            confirmButtonText: 'Entendido',
                            confirmButtonColor: '#009C06',
                            html: 'El contrato se ha generado y se ha registrado al usuario.',
                            showConfirmButton: false,
                            timer: 2500,
                        }).then((result) => {
                            if((result.isDismissed)){
                                buscarUsuarioInformacion(textIdUsuario);
                                botonCancelar.click();
                                imprimirContratoNuevo(idVerContrato);
                            }
                        })
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

const mostrarContratosUsuario = async (botonVerContrato) => {
    try{
        let idBusqueda = botonVerContrato.attributes.dataimprimir.value;
        let datosUsuarioTemplate = document.querySelector('#datosUsuarioTemplate');
        let datosUsuarioContrato = document.querySelector('#datosUsuarioContrato');
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Mostrar Contratos';
        botonContrato.classList.add('d-none');
        datosUsuarioTemplate.innerHTML='';
        datosUsuarioContrato.innerHTML=cargaAnimacion;
        fetch(`aagrcontrato/cargarUsuarioContratos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            respuestas[0].forEach(usuarios => {
                datosUsuarioContrato.innerHTML=`
                    <div class="form-group">
                        <div class="form-control form-control-sm"><small>Usuario:</small> ${usuarios.NOMBRE}</div>
                    </div>
                `;
            })
            const capaContenedor = document.createElement('div');
            capaContenedor.classList.add('tabla-contenedor');
            const tablaContratos = document.createElement('table');
            tablaContratos.classList.add('table','table-sm','table-hover');
            tablaContratos.innerHTML=`
                <thead>
                    <th>Contrato</th>
                    <th>Acciones</th>
                </thead>
            `;
            const tablaBody = document.createElement('tbody');
            if(respuestas[1]==null){
                const filaContratos = document.createElement('tr');
                filaContratos.classList.add('fuente-12p');
                const columnaContratos = document.createElement('td');
                columnaContratos.innerHTML=`
                    <div class="row">
                        <div class="col-md-3 col-12"></div>
                        <div class="col-md-8 col-12">No hay datos o registros de contratos</div>
                    </div>
                `;
                filaContratos.appendChild(columnaContratos);
                tablaBody.appendChild(filaContratos);

            }else{
                respuestas[1].forEach(contratos => {
                    const filaContratos = document.createElement('tr');
                    filaContratos.classList.add('fuente-12p');
                    const columnaContratos = document.createElement('td');
                    columnaContratos.innerHTML=`
                        <div class="row">
                            <div class="col-md-3 col-12">${contratos.CONTRATO_CCONT}</div>
                            <div class="col-md-8 col-12">${contratos.CALLES} ${contratos.COLONIA_CODPOS}, ${contratos.CODIPOST_CODPOS}, ${contratos.NOMBRE_MUNIC}, </div>
                        </div>
                    `;
                    filaContratos.appendChild(columnaContratos);
                    const columnaImprimir = document.createElement('td');
                    const botonExportContrato = document.createElement('button');
                    botonExportContrato.classList.add('btn','btn-danger','btn-sm');
                    botonExportContrato.setAttribute('dataexport',contratos.IDCONTRAUSER);
                    botonExportContrato.setAttribute('id','botonExportContrato');
                    botonExportContrato.innerHTML = '<i class="fa fa-file-pdf"></i>';
                    botonExportContrato.addEventListener('click',() => {
                        exportarContrato(botonExportContrato);
                    });
                    const botonImprimContrato = document.createElement('button');
                    botonImprimContrato.classList.add('btn','btn-success','btn-sm');
                    botonImprimContrato.setAttribute('dataimprimir',contratos.IDCONTRAUSER);
                    botonImprimContrato.setAttribute('id','botonImprimContrato');
                    botonImprimContrato.innerHTML = '<i class="fa fa-print"></i>';
                    botonImprimContrato.addEventListener('click',() => {
                        reimprimirContrato(botonImprimContrato);
                    });
                    const grupoImprimir = document.createElement('div');
                    grupoImprimir.classList.add('btn-group');
                    grupoImprimir.appendChild(botonExportContrato);
                    grupoImprimir.appendChild(botonImprimContrato);
                    columnaImprimir.appendChild(grupoImprimir);
                    filaContratos.appendChild(columnaImprimir);

                    tablaBody.appendChild(filaContratos);
                })

            }
            tablaContratos.appendChild(tablaBody);
            capaContenedor.appendChild(tablaContratos);
            datosUsuarioContrato.appendChild(capaContenedor);
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

const exportarContrato = async (botonExportContrato) => {
    try{
        Swal.fire({
            title: 'Exportar',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, exportar',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea exportar los datos este contrato?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonExportContrato.attributes.dataexport.value;
                botonExportContrato.innerHTML = cargaAnimacion;
                const docImprimir = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'letter',
                    compress: true
                });
                fetch(`areportes/imprimirContrato/${idBusqueda}`)
                .then(respuestaRender => respuestaRender.json())
                .then(respuestas => {
                    botonExportContrato.innerHTML = '<i class="fa fa-file-pdf"></i>';
                    let nombreArchivo = '';
                    let logoSistema = new Image();
                    logoSistema.src = 'public/assets/imagen/logotipos/logo_sapt_color_300.png';
                    let fechaHoy = new Date();
                    let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
                    //let base64Image = document.querySelector('#codigo_qr').attributes.src.value;
                    docImprimir.addImage(logoSistema, 'png', 12,12, 20,20);
                    docImprimir.setDrawColor(20,179,237);
                    docImprimir.rect(10, 10, 195, 24);
                    docImprimir.rect(10, 10, 25, 24);
                    docImprimir.rect(150, 10, 55, 6);
                    docImprimir.rect(150, 16, 55, 6);
                    docImprimir.rect(150, 22, 55, 6);
                    docImprimir.rect(150, 28, 55, 6);
                    docImprimir.rect(10, 37, 195, 24);
                    docImprimir.rect(10, 37, 125, 6);
                    docImprimir.rect(135, 37, 70, 6);
                    docImprimir.rect(10, 43, 90, 6);
                    docImprimir.rect(100, 43, 63, 6);
                    docImprimir.rect(163, 43, 42, 6);
                    docImprimir.rect(10, 49, 105, 6);
                    docImprimir.rect(115, 49, 90, 6);
                    docImprimir.rect(10, 55, 80, 6);
                    docImprimir.rect(90, 55, 40, 6);
                    docImprimir.rect(130, 55, 35, 6);
                    docImprimir.rect(165, 55, 40, 6);
                    docImprimir.line(30, 219, 100, 219);
                    docImprimir.line(130, 219, 190, 219);
                    docImprimir.setFontSize(10);
                    docImprimir.text('SISTEMA DE AGUA POTABLE',95,15, 'center');
                    docImprimir.text('COMITE DE ADMINISTRACION DE AGUA POTABLE',95,20, 'center');
                    docImprimir.setFontSize(8);
                    docImprimir.text('CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ',95,24, 'center');
                    docImprimir.text('MUNICIPIO DE TLAXCOAPAN, HIDALGO',95,28, 'center');
                    docImprimir.setFontSize(6);
                    docImprimir.text('Contrato:',151,12, 'left');
                    docImprimir.text('Fecha:',151,18, 'left');
                    docImprimir.text('Hora:',151,24, 'left');
                    docImprimir.text('Impresión:',151,30, 'left');
                    docImprimir.text('Cliente:',11,39, 'left');
                    docImprimir.text('Tipo Contrato:',136,39, 'left');
                    docImprimir.text('Calle y Numero:',11,46, 'left');
                    docImprimir.text('Colonia:',101,46, 'left');
                    docImprimir.text('Cod. Postal:',164,46, 'left');
                    docImprimir.text('Municipio:',11,51, 'left');
                    docImprimir.text('Estado:',116,51, 'left');
                    docImprimir.text('Telefono(s):',11,57, 'left');
                    docImprimir.text('Impedimento:',91,57, 'left');
                    docImprimir.text('Permiso:',131,57, 'left');
                    docImprimir.text('Tarifa:',166,57, 'left');
                    docImprimir.setFontSize(10);
                    docImprimir.text('CONDICIONES: Este contrato queda sujeto a las condiciones que se estipulan en las siguientes clausulas:',12,68, 'left');
                    docImprimir.text('1. Toda persona que desee conectarse a la red de agua potable, debera solicitarla por escrito al comité de administracion para su analisis y la factibilidad de su autorizacion.',12,73, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('2. Una vez autorizada la peticion, el interesado se obliga a tener listo el registro con las caracteristicas establecidas para tal fin y cubrir la cuota vigente por concepto de contrato.',12,82, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('3. Los dias de cobro por el consumo de agua potable, seran los dias domingo en un horario de 8:00 a 11:00 Hrs.',12,91, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('4. El usuario debera pagar la cuota mensual vigente por el servicio de agua potable, misma que en asamblea general de vecinos determine de acuerdo a las necesidades imperantes.',12,96, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('5. Todo padre o madre de familia tiene la obligacion de pagar oportunamente la cuota mensual correspondiente por el servicio de agua potable.',12,104, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('6. En caso de que el equipo de bombeo se encuentre en malas condiciones, es obligacion de los usuarios aportar una cuota extra, cuyo monto sera calculado de acuerdo al gasto principal realizado.',12,112, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('7. Todo usuario que se atrase en el pago mensual, se vera obligado a pagar como sancion el equivalente a un dia de salario minimo.',12,120, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('8. Todo usuario que por diversos motivos se les haya cortado el servicio de agua potable, para su reconexion debera pagar el equivalente a cuatro dias de salario minimo.',12,128, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('9. Si la red interna del usuario se encuentra en malas condiciones propiciando fugas y/o tiraderos de agua, ademas de repararla por su propia cuenta sera sancionado con el equivalente a dos dias de salario minimo.',12,136, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('10. Todo usuario que se le haya cortado el servicio de agua potable y que se le demuestre que por propia cuenta reconecto el servicio, se le cortara el servico y no podra reconectarse hasta pagar la sancion equivalente a siete dias de salario minimo.',12,144, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('11. Todo usuario que reincida en cualquiera de los casos anteriores, su sancion subira al doble y por tercera reincidencia, la sancion se triplicara.',12,155, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('12. Todo usuario que no se presente a las asambleas que el comité de administracion convoque, sera sancionado con la cuota vigente para tal caso; por segunda falta la sancion sera el doble y por tercera inasistencia corte del servicio y no se podra reconectar hasta haber',12,163, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('13. Todo usuario que proporcione servicio de agua a personas que tengan adeudos rezagados, el servicio cortado o personas que no hayan hecho su contrato, se les hara un llamado y si hacen caso omiso, se les cortara el servicio aunque esten al corriente en sus pagos.',12,175, {align: 'justify', maxWidth: 190, lineHeightFactor: 1.0});
                    docImprimir.text('EL PRESIDENTE DEL COMITÉ DE ADMINISTRACION DEL SISTEMA DE AGUA POTABLE',60,191, {align: 'center', maxWidth: 90, lineHeightFactor: 1.0});
                    docImprimir.text('EL USUARIO',160,191, {align: 'center', maxWidth: 50, lineHeightFactor: 1.0});
                    docImprimir.text('Nombre y Firma',60,222, 'center');
                    docImprimir.text('Nombre y Firma',160,222, 'center');

                    docImprimir.rect(10, 64, 195, 165);
                    respuestas[0].forEach(contrato => {
                        let permisoLabel = '';
                        let descuentoLabel = '';
                        docImprimir.setFontSize(12);
                        docImprimir.text(contrato.CONTRATO_CCONT,203,15, 'right');
                        docImprimir.text(contrato.FECHACAP_CCONT,203,21, 'right');
                        docImprimir.text(contrato.HORACAP_CCONT,203,27, 'right');
                        docImprimir.text(fechaImpress,203,33, 'right');
                        docImprimir.text(contrato.NOMBRE,160,218, 'center');
                        docImprimir.setFontSize(11);
                        docImprimir.text(contrato.NOMBRE,19,42, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CONT,151,42, 'left');
                        docImprimir.text(contrato.CALLES,26,48, 'left');
                        docImprimir.text(contrato.COLONIA_CODPOS,109,48, 'left');
                        docImprimir.text(contrato.CODIPOST_CODPOS,176,48, 'left');
                        docImprimir.text(contrato.NOMBRE_MUNIC,21,54, 'left');
                        docImprimir.text(contrato.ESTADO_ESTA,123,54, 'left');
                        docImprimir.text(contrato.TELEFONO_CLIEN+' '+contrato.MOVIL_CLIEN,16,60, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CPERM,140,60, 'left');
                        docImprimir.text(contrato.DESCRIPCION_CTARI,172,60, 'left');
                        JsBarcode('#codigo_qr', contrato.CODBARR_CLIEN, {
                            displayValue: false,
                            format: 'CODE128',
                            width: 1,
                        });
                        let codigo_qr = document.querySelector('img#codigo_qr');
                        docImprimir.addImage(codigo_qr.src, 'jpeg', 165,230, 40,8);

                        nombreArchivo = contrato.CONTRATO_CCONT;

                    })
                    respuestas[1].forEach(comite => {
                        docImprimir.text(comite.NOMBRE,60,218, 'center');
                    })
                    let alturasello = 235
                    docImprimir.setFontSize(6);
                    docImprimir.text('Cadena Original',10,235, 'left');
                    docImprimir.text('Sello Digital',10,243, 'left');
                    respuestas[2].forEach(sello => {
                        docImprimir.text(sello.SELLODIGA,30,alturasello, {align: 'left', maxWidth: 125, lineHeightFactor: 1.0});
                        alturasello=alturasello+8
                    })
                    docImprimir.save('Contrato '+nombreArchivo+'.pdf');
                });

            }
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

const reimprimirContrato = async (botonImprimContrato) => {
    try {
        Swal.fire({
            title: 'Imprimir',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#009C06',
            confirmButtonText: 'Si, imprimir',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, mejor no',
            html: '¿Desea imprimir los datos este contrato?',
        })
        .then((result)=> {
            if(result.isConfirmed){
                let idBusqueda = botonImprimContrato.attributes.dataimprimir.value;
                let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
                datosContratoDetalle.innerHTML=`
                    <style>
                        @font-face {
                            font-family: 'Montserrat';
                            src: url('public/assets/estilos/css_frontend/Montserrat/Montserrat-Regular.ttf') format('truetype');
                            font-style: normal;
                            font-weight: normal;
                        }
                    </style>
                    <img src="public/assets/imagen/logotipos/logo_sapt_trans_300.png" style="position: absolute; margin: 150px 20%; width: 400px; height:400px;" />
                `;
                botonImprimContrato.innerHTML = cargaAnimacion;
                let fechaHoy = new Date();
                let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
                let cabeceraContrato = '';
                let detalleContrato = '';
                let comiteTramite = '';
                let usuarioTramite = '';
                let sellosDigital = '';
                let codigoBarra = '';
                fetch(`areportes/imprimirContrato/${idBusqueda}`)
                .then(respuestaRender => respuestaRender.json())
                .then(respuestas => {
                    botonImprimContrato.innerHTML = '<i class="fa fa-print"></i>';
                    respuestas[0].forEach(contrato => {
                        usuarioTramite=contrato.NOMBRE;
                        cabeceraContrato=`
                            <tr>
                                <td rowspan="4" colspan="1" style="border: 1px solid rgb(20,179,237);"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:80px; height:80px; margin: auto;"/></td>
                                <td rowspan="4" colspan="9" style="text-align: center; border: 1px solid rgb(20,179,237);">
                                    <div style="text-align: center; font-size: 14px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                                    <div style="text-align: center; font-size: 10px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                                </td>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237);">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Contrato:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${contrato.CONTRATO_CCONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${contrato.FECHACAP_CCONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Hora:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${contrato.HORACAP_CCONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Fecha Impresión:</div>
                                    <div style="float: right; margin-right: 5px; font-size:14px;">${fechaImpress}</div>
                                </td>
                            </tr>
                        
                        `;
                        detalleContrato=`
                            <tr>
                                <td colspan="8" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Cliente:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.NOMBRE}</div>
                                </td>
                                <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Tipo Contrato:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.DESCRIPCION_CONT}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Calle y Numero:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.CALLES}</div>
                                </td>
                                <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Colonia:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.COLONIA_CODPOS}</div>
                                </td>
                                <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Cod. Postal:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.CODIPOST_CODPOS}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Telefono(s):</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.TELEFONO_CLIEN} - ${contrato.MOVIL_CLIEN}</div>
                                </td>
                                <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Impedimento:</div>
                                    <div style="text-align: center; font-size:14px;">-</div>
                                </td>
                                <td colspan="3" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Permiso:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.DESCRIPCION_CPERM}</div>
                                </td>
                                <td colspan="2" style="border: 1px solid rgb(20,179,237)">
                                    <div style="position: absolute; margin-left:3px; font-size:6px;">Tarifa:</div>
                                    <div style="text-align: center; font-size:14px;">${contrato.DESCRIPCION_CTARI}</div>
                                </td>
                            </tr>
                        `;
                        codigoBarra = contrato.CODBARR_CLIEN;
                    })
                    respuestas[1].forEach(comite => {
                        comiteTramite = comite.NOMBRE;
                    })
                    respuestas[2].forEach(sello => {
                        sellosDigital+=`<div style="max-width:430px;word-wrap:break-word;padding-botton:10px;">${sello.SELLODIGA}</div>`;
                    })
                    const tablaAcuseContrato = document.createElement('table');
                    tablaAcuseContrato.setAttribute('border','0');
                    tablaAcuseContrato.setAttribute('cellspacing','0');
                    tablaAcuseContrato.setAttribute('cellpadding','0');
                    tablaAcuseContrato.setAttribute('style','width: 100%; font-family: Montserrat;');
                    tablaAcuseContrato.innerHTML=`
                        <tr>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                            <td width="8.33%"></td>
                        </tr>
                        ${cabeceraContrato}
                        <tr>
                            <td colspan="12" style="padding:5px;"></td>
                        </tr>
                        ${detalleContrato}
                        <tr>
                            <td colspan="12" style="padding:5px;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:5px; border-top: 1px solid rgb(20,179,237); border-left: 1px solid rgb(20,179,237); border-right: 1px solid rgb(20,179,237);">
                                <div style="text-align:justify; font-size:14px;">CONDICIONES: Este contrato queda sujeto a las condiciones que se estipulan en las siguientes clausulas:</div>
                                <ol style="width:100%;max-width:750px;padding-left:25px;padding-right:25px;font-size:14px;">
                                    <li style="text-aling:justify;max-width:730px;">Toda persona que desee conectarse a la red de agua potable, debera solicitarla por escrito al comité de administracion para su analisis y la factibilidad de su autorizacion.</li>
                                    <li style="text-aling:justify;max-width:730px;">Una vez autorizada la peticion, el interesado se obliga a tener listo el registro con las caracteristicas establecidas para tal fin y cubrir la cuota vigente por concepto de contrato.</li>
                                    <li style="text-aling:justify;max-width:730px;">Los dias de cobro por el consumo de agua potable, seran los dias domingo en un horario de 8:00 a 11:00 Hrs.</li>
                                    <li style="text-aling:justify;max-width:730px;">El usuario debera pagar la cuota mensual vigente por el servicio de agua potable, misma que en asamblea general de vecinos determine de acuerdo a las necesidades imperantes.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo padre o madre de familia tiene la obligacion de pagar oportunamente la cuota mensual correspondiente por el servicio de agua potable.</li>
                                    <li style="text-aling:justify;max-width:730px;">En caso de que el equipo de bombeo se encuentre en malas condiciones, es obligacion de los usuarios aportar una cuota extra, cuyo monto sera calculado de acuerdo al gasto principal realizado.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que se atrase en el pago mensual, se vera obligado a pagar como sancion el equivalente a un dia de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que por diversos motivos se les haya cortado el servicio de agua potable, para su reconexion debera pagar el equivalente a cuatro dias de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Si la red interna del usuario se encuentra en malas condiciones propiciando fugas y/o tiraderos de agua, ademas de repararla por su propia cuenta sera sancionado con el equivalente a dos dias de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que se le haya cortado el servicio de agua potable y que se le demuestre que por propia cuenta reconecto el servicio, se le cortara el servico y no podra reconectarse hasta pagar la sancion equivalente a siete dias de salario minimo.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que reincida en cualquiera de los casos anteriores, su sancion subira al doble y por tercera reincidencia, la sancion se triplicara.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que no se presente a las asambleas que el comité de administracion convoque, sera sancionado con la cuota vigente para tal caso; por segunda falta la sancion sera el doble y por tercera inasistencia corte del servicio y no se podra reconectar hasta haber.</li>
                                    <li style="text-aling:justify;max-width:730px;">Todo usuario que proporcione servicio de agua a personas que tengan adeudos rezagados, el servicio cortado o personas que no hayan hecho su contrato, se les hara un llamado y si hacen caso omiso, se les cortara el servicio aunque esten al corriente en sus pagos.</li>
                                </ol>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">EL PRESIDENTE DEL COMITÉ DE ADMINISTRACION DEL SISTEMA DE AGUA POTABLE</td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">EL USUARIO</td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="padding:30px;"></td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="padding:30px;"></td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="text-align: center;border-bottom: 1px solid rgb(20,179,237);">${comiteTramite}</td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="text-align: center;border-bottom: 1px solid rgb(20,179,237);">${usuarioTramite}</td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="border-left: 1px solid rgb(20,179,237);"></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">Nombre y firma</td>
                            <td colspan="2" style=""></td>
                            <td colspan="4" style="font-size:12px;text-align: center;">Nombre y firma</td>
                            <td colspan="1" style="border-right: 1px solid rgb(20,179,237);"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="border-left: 1px solid rgb(20,179,237);border-right: 1px solid rgb(20,179,237);border-bottom: 1px solid rgb(20,179,237); padding:10px;"></td>
                        </tr>
                        <tr>
                            <td colspan="12" style="padding:10px;"></td>
                        </tr>
                        <tr>
                            <td colspan="1" style="font-size:8px;"><div style="margin-bottom:10px;">Cadena Original</div><div style="margin-bottom:10px;">Sello digital</div></td>
                            <td colspan="8" style="font-size:8px;">${sellosDigital}</td>
                            <td colspan="3" style=""><img id="barcode"/></td>
                        </tr>
                    `;
                    datosContratoDetalle.appendChild(tablaAcuseContrato);
                    JsBarcode("#barcode", `${codigoBarra}`, {
                        format: "CODE128",
                        lineColor: "#14b3ed",
                        background: "#FFF",
                        width: 2,
                        height: 40,
                        displayValue: false
                    });
                    let ventImpri = window.open('', 'popimpr');
                    ventImpri.document.write(datosContratoDetalle.innerHTML);
                    ventImpri.document.close();
                    ventImpri.print();
                    ventImpri.close();
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


function validarIdUsuario(){
    let inputForm = document.querySelector("#textIdUsuario");
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
