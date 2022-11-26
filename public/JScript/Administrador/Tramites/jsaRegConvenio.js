let botonConvenio = document.querySelector('#botonConvenio');
let botonCitatorio = document.querySelector('#botonCitatorio');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonConvenio.addEventListener('click', () => {
        registrarConvenio();
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
            }else if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode == 8){
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
        let busquedaUsuarios = document.querySelector('#busquedaUsuarios');
        let datosContratoDetalle = document.querySelector('#datosContratoDetalle');
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
            datosContratoDetalle.innerHTML=cargaAnimacion;
            fetch(`aregconvenio/llenarTablaContratoConvenio/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                busquedaUsuarios.innerHTML=`
                    <div class="card-text text-justify">
                        <ol class="col-12 fuente-12p" start="2">
                            <li>Hacer clic en el botón <span class="btn-info btn-sm"><i class="fas fa-file"></i></span> para 
                            crear convenio o en el botón <span class="btn-warning btn-sm"><i class="fa fa-file-alt"></i></span> 
                            para crear citatorio.</li>
                        </ol>
                    </div>
                `;
                const botonResetear = document.createElement('button');
                botonResetear.classList.add('btn','btn-secondary','btn-sm','mb-2');
                botonResetear.innerHTML='Nueva busqueda';
                botonResetear.addEventListener('click', () => {
                    datosContratoDetalle.innerHTML='';
                    plantillaBusqueda();
                })
                const tablaContratos = document.createElement('table');
                tablaContratos.classList.add('table','table-sm','table-hover','table-bordered','fuente-12p');
                tablaContratos.innerHTML=`
                    <thead>
                        <th class="col">Detalles</th>
                        <th>Conv./Cit.</th>
                        <th>Acciones</th>
                    </thead>
                `;
                const cuerpoTablaContratos = document.createElement('tbody');
                if(respuestas.estatus=='error'){
                    cuerpoTablaContratos.innerHTML=`
                        <tr>
                            <td colspan="3">${respuestas.text}</td>
                        </tr>
                    `;
                }else{
                    respuestas.forEach(usuarios => {
                        let totalDeudaContrato = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(usuarios.TOTAL_DETA);
                        const filaTablaContratos = document.createElement('tr');
                        const columnaDetalles = document.createElement('td');
                        columnaDetalles.innerHTML=`
                            <div class="row">
                                <div class="col-md-3 col-12">${usuarios.CLIENTE}</div>
                                <div class="col-md-3 col-12"><small>Contrato</small>: ${usuarios.CONTRATO_CCONT}</div>
                                <div class="col-md-3 col-12"><small>Deuda</small>: ${totalDeudaContrato}</div>
                            </div>
                        `;
                        filaTablaContratos.appendChild(columnaDetalles);
                        const columnaConvenio = document.createElement('td');
                        columnaConvenio.setAttribute('contenConv',usuarios.idTablePk);
                        columnaConvenio.classList.add('text-center');
                        columnaConvenio.innerHTML=`<span class="badge badge-info fuente-14p">${usuarios.CONVENIOS}</span>`;
                        filaTablaContratos.appendChild(columnaConvenio);
                        const columnaAcciones = document.createElement('td');
                        const botonCrearConvenio = document.createElement('button');
                        botonCrearConvenio.classList.add('btn','btn-info','btn-sm');
                        botonCrearConvenio.setAttribute('data-toggle','modal');
                        botonCrearConvenio.setAttribute('data-target','#formRegistroDatos');
                        botonCrearConvenio.setAttribute('datacrearconvenio',usuarios.idTablePk);
                        botonCrearConvenio.setAttribute('id','botonAsignarEl');
                        botonCrearConvenio.innerHTML = `<i class="fa fa-file"></i>`;
                        botonCrearConvenio.addEventListener('click',() => {
                            buscarUsuarioConvenio(botonCrearConvenio);
                        });
    
                        const botonCrearCitatorio = document.createElement('button');
                        botonCrearCitatorio.classList.add('btn','btn-warning','btn-sm');
                        botonCrearCitatorio.setAttribute('data-toggle','modal');
                        botonCrearCitatorio.setAttribute('data-target','#formRegistroDatos');
                        botonCrearCitatorio.setAttribute('datacrearcita',usuarios.idTablePk);
                        botonCrearCitatorio.setAttribute('id','botonCrearCitatorio');
                        botonCrearCitatorio.innerHTML = `<i class="fa fa-file-alt"></i>`;
                        botonCrearCitatorio.addEventListener('click',() => {
                            buscarUsuarioCitatorio(botonCrearCitatorio);
                        });
                        const grupoAcciones = document.createElement('div');
                        grupoAcciones.classList.add('btn-group','text-center');
                        grupoAcciones.appendChild(botonCrearConvenio);
                        grupoAcciones.appendChild(botonCrearCitatorio);
                        columnaAcciones.appendChild(grupoAcciones);
                        filaTablaContratos.appendChild(columnaAcciones);
                        cuerpoTablaContratos.appendChild(filaTablaContratos);
                    })

                }
                tablaContratos.appendChild(cuerpoTablaContratos);
                datosContratoDetalle.innerHTML='';
                datosContratoDetalle.appendChild(tablaContratos);
                datosContratoDetalle.appendChild(botonResetear);

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

const buscarUsuarioConvenio = async (botonCrearConvenio) => {
    try {
        let labelTitleModal = document.querySelector('#labelTitleModal');
        labelTitleModal.innerHTML='Crear convenio';
        botonConvenio.classList.remove('d-none');
        botonCitatorio.classList.add('d-none');
        return Swal.fire({
            title: 'Crear Convenio',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Crear Convenio',
            confirmButtonColor: '#009C06',
            cancelButtonColor: '#9C0000',
            cancelButtonText: 'No, Mejor no',
            html: '¿Desea buscar los datos para crear un convenio nuevo?',
        })
        .then((result) => {
            if(result.isConfirmed){
                let idBusqueda = botonCrearConvenio.attributes.datacrearconvenio.value;
                let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
                formRegistroCRUD.innerHTML=cargaAnimacion;
                fetch(`aregconvenio/buscarUsuarioDeudor/${idBusqueda}`)
                .then(respRender => respRender.json())
                .then(respuestas => {
                    if(respuestas.estatus=='error'){

                    }else{
                        respuestas[0].forEach(usuario => {
                            formRegistroCRUD.innerHTML=`
                                <div class="bg-white p-2">
                                    <div class="row fuente-12p">
                                        <div class="form-group col-md-6 col-12 mb-2">
                                            <input type="hidden" value="${usuario.idTablePk}" name="textCliente" id="textCliente" />
                                            <small>Usuario:</small>
                                            <div class="form-control form-control-sm fuente-12p">${usuario.NOMBRE}</div>
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Contrato:</small>
                                            <div class="form-control form-control-sm fuente-12p">${usuario.CONTRATO_CCONT}</div>
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Total deuda:</small>
                                            <input type="hidden" name="textDeuda" id="textDeuda" class="form-control form-control-sm" value="${usuario.TOTAL_DETA}" />
                                            <div class="form-control form-control-sm text-right fuente-12p" id="labelTotal">$${parseFloat(usuario.TOTAL_DETA).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="labelsConvenios"></div>
                                <div class="bg-white p-2">
                                    <div class="tabla-contenedor-medio" id="detalleTablaDeuda"></div>
                                </div>
                                <div class="bg-white p-2">
                                    <div class="row">
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Fecha de plazo:</small>
                                            <input type="text" name="textPlazo" id="textPlazo" value="" class="form-control form-control-sm" maxlength="13" placeholder="F Plazo." readonly />
                                        </div>
                                        <div class="form-group col-md-3 col-12 mb-2">
                                            <small>Total Parciales:</small>
                                            <select name="textParcial" id="textParcial" class="custom-select custom-select-sm"><option value="">Parcialidades</option>
                                            <option value="2">2 Parcialidades</option>
                                            <option value="4">4 Parcialidades</option>
                                            <option value="8">8 Parcialidades</option>
                                            <option value="12">12 Parcialidades</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-2 col-12 mb-2">
                                            <small>Pago Parcial:</small>
                                            <input type="text" name="textPaulatinos" id="textPaulatinos" value="" class="form-control form-control-sm" maxlength="13" placeholder="Parcialidades" readonly/>
                                        </div>
                                        <div class="form-group col-md-2 col-12 mb-2">
                                            <small>D. Restante:</small>
                                            <input type="hidden" name="textRestante" id="textRestante" class="form-control form-control-sm" placeholder="$0.00" value="${usuario.TOTAL_DETA}" />
                                            <div class="form-control form-control-sm text-right" id="labelRestante">$${parseFloat(usuario.TOTAL_DETA).toFixed(2)}</div>
                                        </div>
                                        <div class="form-group col-md-2 col-12 mb-2">
                                            <small>Abono:</small>
                                            <input type="hidden" name="textAbono" id="textAbono" class="form-control form-control-sm" value="" />
                                            <div class="form-control form-control-sm text-right" id="labelAbono">$0.00</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            let textPlazo = document.querySelector('#textPlazo');
                            let fechaActual = new Date();
                            let anioActual = fechaActual.getFullYear();
                            let mesActual = fechaActual.getMonth();
                            let diaActual = fechaActual.getDate();
                            let selecionDia = new Datepicker(textPlazo, {
                                'range': true,
                                'minDate': new Date(anioActual -0, mesActual, diaActual),
                                'maxDate': new Date(anioActual +1, mesActual, diaActual),
                                'format': 'yyyy-mm-dd',
                                'language': 'es',
                                'autohide': 'true'
                            });
                            let textParcial = document.querySelector('#textParcial');
                            textParcial.addEventListener('change', () => {
                                if(textParcial.value=="" || textParcial.value==null){
                                    let textPaulatinos = document.querySelector('#textPaulatinos');
                                    textPaulatinos.value = '';
                                }else{
                                    let textRestante = document.querySelector('#textRestante');
                                    let textPaulatinos = document.querySelector('#textPaulatinos');
                                    let Paulatinos = '';
                                    Paulatinos=textRestante.value / textParcial.value;
                                    textPaulatinos.value = Paulatinos.toFixed(2);
    
                                }
                            })
    
                        })
                        let detalleTablaDeuda = document.querySelector('#detalleTablaDeuda');
                        const tablaDetalles = document.createElement('table');
                        tablaDetalles.classList.add('table','table-sm','table-hover');
                        const cuerpoTablaDetalles = document.createElement('tbody')
                        respuestas[1].forEach(detalles => {
                            const filaTablaDetalles = document.createElement('tr');
                            filaTablaDetalles.classList.add('fuente-12p');
                            const columnaCodigo = document.createElement('td');
                            columnaCodigo.innerHTML=detalles.CODIGO_DETA;
                            filaTablaDetalles.appendChild(columnaCodigo);
                            const columnaDescripcion = document.createElement('td');
                            columnaDescripcion.innerHTML=detalles.DESCRIPCION_CONC;
                            filaTablaDetalles.appendChild(columnaDescripcion);
                            const columnaCantidad = document.createElement('td');
                            columnaCantidad.innerHTML=detalles.CANTIDAD_DETA;
                            filaTablaDetalles.appendChild(columnaCantidad);
                            const columnaCosto = document.createElement('td');
                            columnaCosto.innerHTML=parseFloat(detalles.COSTO_DETA).toFixed(2);
                            filaTablaDetalles.appendChild(columnaCosto);
                            const columnaTotal = document.createElement('td');
                            columnaTotal.innerHTML=parseFloat(detalles.TOTAL_DETA).toFixed(2);
                            filaTablaDetalles.appendChild(columnaTotal);
                            const columnaCheckBox = document.createElement('td');
                            const capaCheckBox = document.createElement('div');
                            const inputCheckboxClicker = document.createElement('input');
                            inputCheckboxClicker.setAttribute('type','checkbox');
                            //inputCheckboxClicker.classList.add('form-check-input');
                            inputCheckboxClicker.setAttribute('id',detalles.idTablePk);
                            inputCheckboxClicker.setAttribute('name','abonos');
                            inputCheckboxClicker.setAttribute('value',detalles.CODIGO_DETA);
                            inputCheckboxClicker.addEventListener('click', () => {
                                modificarTotalesDeuda(inputCheckboxClicker);
                            })
                            const labelCheckbocClicker = document.createElement('label');
                            labelCheckbocClicker.setAttribute('for',detalles.idTablePk);
                            //labelCheckbocClicker.classList.add('custom-control-label');
                            labelCheckbocClicker.innerHTML=' Pagar';
       
                            capaCheckBox.appendChild(inputCheckboxClicker);
                            capaCheckBox.appendChild(labelCheckbocClicker);
                            columnaCheckBox.appendChild(capaCheckBox);
                            filaTablaDetalles.appendChild(columnaCheckBox);
                            cuerpoTablaDetalles.appendChild(filaTablaDetalles);
                        })
                        tablaDetalles.appendChild(cuerpoTablaDetalles);
                        detalleTablaDeuda.appendChild(tablaDetalles);
                        let labelsConvenios = document.querySelector('#labelsConvenios');
                        if(respuestas[2]==null){
                            labelsConvenios.innerHTML='';
                        }else{
                            respuestas[2].forEach(convenio => {
                                labelsConvenios.innerHTML=`
                                    <div class="form-group col-md-3 col-12">
                                        <small>Convenio:</small>
                                        <div class="form-control form-control-sm fuente-12p">${convenio.CONVENIOS} Convenio vigente</div>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <small>Folio:</small>
                                        <div class="form-control form-control-sm fuente-12p">${convenio.FOLIOCONV_CONV}</div>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <small>Vigencia:</small>
                                        <div class="form-control form-control-sm fuente-12p">${convenio.FECHALIQU_CONV}</div>
                                    </div>
                                `;
                            });
                        }
    
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

const modificarTotalesDeuda = async (inputCheckboxClicker) => {
    try{
        let textRestante = document.querySelector('#textRestante');
        let idBusqueda = inputCheckboxClicker.attributes.id.value;
        let labelRestante = document.querySelector('#labelRestante');
        let textDeuda = document.querySelector('#textDeuda');
        let textAbono = document.querySelector('#textAbono');
        let labelAbono = document.querySelector('#labelAbono');
        fetch(`regconvenio/buscarTotalesConcepto/${idBusqueda}`)
        .then(respRender =>  respRender.json())
        .then(respuestas => {
            respuestas.forEach(totales => {
                if(inputCheckboxClicker.checked==false){
                    let totalModificado=parseFloat(textRestante.value) + parseFloat(totales.TOTAL_DETA);
                    textRestante.value=totalModificado;
                    labelRestante.innerHTML='$'+parseFloat(totalModificado).toFixed(2);
                    let totalAbono = parseFloat(textDeuda.value) - parseFloat(textRestante.value);
                    textAbono.value=totalAbono;
                    labelAbono.innerHTML='$'+parseFloat(totalAbono).toFixed(2);

                }else if(inputCheckboxClicker.checked==true){
                    let totalModificado=parseFloat(textRestante.value) - parseFloat(totales.TOTAL_DETA);
                    textRestante.value=totalModificado;
                    labelRestante.innerHTML='$'+parseFloat(totalModificado).toFixed(2);
                    let totalAbono = parseFloat(textDeuda.value) - parseFloat(textRestante.value);
                    textAbono.value=totalAbono;
                    labelAbono.innerHTML='$'+parseFloat(totalAbono).toFixed(2);

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

const registrarConvenio = async () => {
    try {
        if(validarCliente() && validarDeuda() && validarPlazo() && validarParcial() && validarPaulatinos() && validarRestante() &&
         validarAbono() && validarRoles()){
            let textCliente = document.querySelector('#textCliente');
            let textDeuda = document.querySelector('#textDeuda');
            let textPlazo = document.querySelector('#textPlazo');
            let textParcial = document.querySelector('#textParcial');
            let textPaulatinos = document.querySelector('#textPaulatinos');
            let textRestante = document.querySelector('#textRestante');
            let textAbono = document.querySelector('#textAbono');
            let abonos = document.querySelectorAll('input[name="abonos"]:checked');
            let abonosTemporal = [];
            for(let regis = 0; regis < abonos.length; regis++){
                abonosTemporal.push(abonos[regis].value);
            }
            const convenioInputs = {
                textCliente: textCliente.value,
                textDeuda: textDeuda.value,
                textPlazo: textPlazo.value,
                textParcial: textParcial.value,
                textPaulatinos: textPaulatinos.value,
                textRestante: textRestante.value,
                textAbono: textAbono.value,
                abonos: abonosTemporal,
            }
            fetch('aregconvenio/crearConvenio', {
                method: 'POST',
                body: JSON.stringify(convenioInputs),
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
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#9C0000',
                        html: respuestas.text,
                    })

                }else{
                    return Swal.fire({
                        title: respuestas.title,
                        icon: respuestas.icon,
                        confirmButtonText: `${respuestas.button}`,
                        confirmButtonColor: '#2BC323',
                        html: respuestas.text,
                    })
                    .then((result) => {
                        if(result.isConfirmed){
                            let idBusqueda = textCliente.value;
                            let filaActuConvenios = document.querySelector(`td[contenconv="${idBusqueda}"]`);
                            filaActuConvenios.classList.add('font-weight-bold','text-center');
                            fetch(`aregconvenio/buscandoConvenCitat/${idBusqueda}`)
                            .then(respRender => respRender.json())
                            .then(respuestas => {
                                const badgeConvenios = document.createElement('span');
                                badgeConvenios.classList.add('badge','badge-info','badge-pill','fuente-14p');
                                if(respuestas[0]==null){
                                }else{
                                    respuestas[0].forEach(convenio => {
                                        badgeConvenios.innerHTML=convenio.CONVENIOS;
                                    });
                                }
                                filaActuConvenios.appendChild(badgeConvenios);
                                const badgeCitatorios = document.createElement('span');
                                badgeCitatorios.classList.add('badge','badge-success','badge-pill','fuente-14p');
                                if(respuestas[1]==null){
                                }else{
                                    respuestas[1].forEach(citatorio => {
                                        badgeCitatorios.innerHTML=citatorio.CITATORIOS;
                                    });
                                }
                                filaActuConvenios.appendChild(badgeCitatorios);


                            })
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

function validarFecha(){
    let inputForm = document.querySelector("#textFecha");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Fecha Cita es requerido',
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

function validarDeuda(){
    let textDeuda = document.querySelector("#textDeuda");
    let inputForm = document.querySelector('#labelTotal');
    if(textDeuda.value==null || textDeuda.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Deuda es requerido',
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

function validarPlazo(){
    let inputForm = document.querySelector("#textPlazo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Fecha de plazo es requerido',
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

function validarParcial(){
    let inputForm = document.querySelector("#textParcial");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Total Parciales es requerido',
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

function validarPaulatinos(){
    let inputForm = document.querySelector("#textPaulatinos");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Pago Parcial es requerido',
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

function validarRestante(){
    let textRestante = document.querySelector("#textRestante");
    let inputForm = document.querySelector('#labelRestante');
    if(textRestante.value==null || textRestante.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'D. Restante es requerido',
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

function validarAbono(){
    let textAbono = document.querySelector("#textAbono");
    let inputForm = document.querySelector('#labelAbono');
    if(textAbono.value==null || textAbono.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Abono es requerido',
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
    let inputForm = document.querySelectorAll('input[name="abonos"]:checked');
    if(!inputForm==true){
        Swal.fire({
            title: 'Campo Error',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Debe seleccionar Abonos',
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
