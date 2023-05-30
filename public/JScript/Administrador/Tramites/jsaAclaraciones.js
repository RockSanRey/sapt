let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';


document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
})

const plantillaBusqueda = async () => {
    try{
        let busquedaCliente = document.querySelector('#busquedaCliente');
        busquedaCliente.classList.remove('d-none');
        busquedaCliente.innerHTML=`
            <div class="card">
                <div class="card-body">
                    <div class="card-text text-justify">
                        <ol class="col-12 fuente-12p">
                            <li>Escribe o escanea el número de usuario que se va a modificar</li>
                        </ol>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control form-control-sm" name="textUsuario" id="textUsuario" placeholder="Buscar Usuario" autocomplete="off" autofocus/>
                            <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                            <div id="userListComplete" class="autocompletados"></div>
                            <div class="input-group-append">
                                <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                            </div>
                        </div>
                    </div>
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
            fetch(`atramites/autoCompleteUserAclara/${idBusqueda}`)
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
        let busquedaCliente = document.querySelector('#busquedaCliente');
        let detallesCliente = document.querySelector('#detallesCliente');
        if(validarIdBusqueda()){
            let idBusqueda = textIdUsuario.value;
            busquedaCliente.innerHTML='';
            detallesCliente.innerHTML=cargaAnimacion;
            fetch(`aclaraciones/consultaEstatusCliente/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                const columnaCliente = document.createElement('div');
                columnaCliente.classList.add('col-md-2','col-12');
                const columnaContratos = document.createElement('div');
                columnaContratos.classList.add('col-md-3','col-12');
                const columnaDetalles = document.createElement('div');
                columnaDetalles.classList.add('col-md-7','col-12');
                columnaDetalles.innerHTML=`
                    <div class="card">
                        <div class="card-body">
                            <div id="detallesContratos"></div>
                        </div>
                    </div>
                `;
                const botonResetear = document.createElement('button')
                botonResetear.classList.add('btn','btn-sm','btn-secondary','mt-2');
                botonResetear.innerHTML='Nueva busqueda';
                botonResetear.addEventListener('click', () => {
                    busquedaCliente.innerHTML='';
                    detallesCliente.innerHTML='';
                    plantillaBusqueda();
                })
                if(respuestas.estatus=='error'||respuestas==null){
                    detallesCliente.classList.remove('row','no-gutters');
                    detallesCliente.innerHTML=`
                        <div class="card">
                            <div class="card-body">No Hay valores que mostrar ya que ocurrio un error.</div>
                        </div>
                    `;
                    detallesCliente.appendChild(botonResetear);
                }else{
                    if(respuestas[0]==null||respuestas[0]==''){
                        detallesCliente.classList.remove('row','no-gutters');
                        detallesCliente.innerHTML=`
                            <div class="card">
                                <div class="card-body font-weight-bold">No hay información para mostrar puede que tenga baja mucho antes de sistematizar.</div>
                            </div>
                        `;  
                    }else{
                        detallesCliente.classList.add('row');
                        respuestas[0].forEach(usuarios => {
                            const cardUsuario = document.createElement('div');
                            cardUsuario.innerHTML=`
                                <div class="card">
                                    <div class="card-body p-2 fuente-12p">
                                        <div class="mb-2"><small>Id Usuario:</small><div class="font-weight-bold">${usuarios.CODBARR_CLIEN}</div></div>
                                        <div class="mb-2"><small>Cliente:</small><div class="font-weight-bold">${usuarios.NOMBRE}</div></div>
                                        <div class="mb-1"><small>Telefono:</small><div class="font-weight-bold">${usuarios.TELEFONO_CLIEN}</div></div>
                                        <div class="mb-2"><small>Movil:</small><div class="font-weight-bold">${usuarios.MOVIL_CLIEN}</div></div>
                                        <div class="mb-2"><small>Correo:</small><div class="font-weight-bold">${usuarios.EMAIL_CLIEN}</div></div>
                                        <div class="mb-2"><small>Estatus:</small><div class="font-weight-bold">${usuarios.DESCRIPCION_ESTAT}</div></div>
                                    </div>
                                </div>
                            `;
                            columnaCliente.appendChild(cardUsuario);
                            const cardCredencial = document.createElement('div')
                            cardCredencial.classList.add('card','mt-2');
                            const cardCredencialBody = document.createElement('div');
                            cardCredencialBody.classList.add('card-body','p-2','text-center','fuente-12p');
                            cardCredencialBody.innerHTML=`
                                <div class="mb-2">Identificadores para Pagos o Asistencias a asambleas.</div>
                                <div class="font-weight-bold">Cod. para pagos</div>
                            `;
                            const grupoCodigos = document.createElement('div');
                            grupoCodigos.classList.add('h-oculto');
                            const capaCodigoBarra = document.createElement('img');
                            capaCodigoBarra.setAttribute('jsbarcode-format','CODE128');
                            capaCodigoBarra.setAttribute('jsbarcode-value',usuarios.CODBARR_CLIEN);
                            capaCodigoBarra.setAttribute('jsbarcode-displayvalue','true');
                            capaCodigoBarra.setAttribute('jsbarcode-height','35');
                            capaCodigoBarra.setAttribute('jsbarcode-linecolor','#000000');
                            capaCodigoBarra.setAttribute('id','bar_'+usuarios.CODBARR_CLIEN)
                            JsBarcode(capaCodigoBarra).init();
                            grupoCodigos.appendChild(capaCodigoBarra);
                            const grupoQrCode = document.createElement('div');
                            grupoQrCode.innerHTML='<div class="font-weight-bold">Cod para Asambleas</div>';
                            const capaCodigoQr = document.createElement('span');
                            capaCodigoQr.classList.add('text-center');
                            grupoQrCode.appendChild(capaCodigoQr)
                            grupoCodigos.appendChild(grupoQrCode);
                            new QRCode(capaCodigoQr, {
                                text: usuarios.IDUSUA_CLIEN,
                                width: 200,
                                height: 200,
                                colorDark : "#000000",
                                colorLight : "#ffffff",
                                correctLevel : QRCode.CorrectLevel.H
                            });
                            cardCredencialBody.appendChild(grupoCodigos);
                            cardCredencial.appendChild(cardCredencialBody);
                            columnaCliente.appendChild(cardCredencial);
                            
                        })
                        columnaCliente.appendChild(botonResetear);
                    }
                    const cardContrato = document.createElement('div');
                    cardContrato.classList.add('card','mb-2');
                    const cardContratoBody = document.createElement('div');
                    cardContratoBody.classList.add('card-body','p-2');
                    cardContratoBody.innerHTML='<div class="fuente-12p">Contratos</div>';
                    const contenidoTabla = document.createElement('div');
                    contenidoTabla.classList.add('tabla-contenedor-medio');
                    const tablaContratos = document.createElement('table');
                    tablaContratos.classList.add('table','table-sm','table-hover','fuente-12p');
                    const cuerpoTablaContratos = document.createElement('tbody')
                    if(respuestas[1]==null||respuestas[0]==''){
                        cuerpoTablaContratos.innerHTML=`
                            <tr>
                                <td>No hay información de contratos para mostrar puede que tengan una baja mucho antes de sistematizar.</td>
                            </tr>
                        `;
                    }else{
                        respuestas[1].forEach(contratos => {
                            let spanEstatus = '';
                            if(contratos.ESTATUS_CLIEN=='ACTI'){
                                spanEstatus = `<span class="text-success">${contratos.DESCRIPCION_ESTAT}</span>`;
                            }else if(contratos.ESTATUS_CLIEN=='BAJT'){
                                spanEstatus = `<span class="text-warning">${contratos.DESCRIPCION_ESTAT}</span>`;
                            }else if(contratos.ESTATUS_CLIEN=='BAJD'){
                                spanEstatus = `<span class="text-danger">${contratos.DESCRIPCION_ESTAT}</span>`;
                            }
                            const filaTablaContratos = document.createElement('tr');
                            filaTablaContratos.setAttribute('datacontrato',contratos.idTablePk)
                            const columnaContratosInfo = document.createElement('td');
                            columnaContratosInfo.innerHTML=`
                                <div class="row">
                                    <div class="col-md-12 col-12"><small>Contrato:</small> <span class="font-weight-bold">${contratos.CONTRATO_CCONT}</span></div>
                                    <div class="col-md-12 col-12"><small>Ubicación:</small> <span class="font-weight-bold">${contratos.CALLE_UBIC} ${contratos.NEXTE_UBIC} ${contratos.NINTE_UBIC}, Col: ${contratos.COLONIA_COLON}, C.P.: ${contratos.CODIPOST_CODPOS}, Munic: ${contratos.NOMBRE_MUNIC}</span></div>
                                    <div class="col-md-12 col-12"><span class="text-muted">Tipo: ${contratos.DESCRIPCION_CONT} | ${contratos.DESCRIPCION_CEXP} | ${contratos.DESCRIPCION_CPERM} | ${contratos.DESCRIPCION_CTARI} </span></div>
                                    <div class="col-md-12 col-12">Estatus: ${spanEstatus}</div>
                                </div>
                            `;
                            const columnaAcciones = document.createElement('td');
                            const botonVerDetalles = document.createElement('button');
                            botonVerDetalles.setAttribute('datadetalle',contratos.idTablePk);
                            botonVerDetalles.classList.add('btn','btn-sm','btn-info');
                            botonVerDetalles.innerHTML=`<i class="fas fa-eye"></i>`;
                            botonVerDetalles.addEventListener('click', () => {
                                mostrarDetalleContrato(botonVerDetalles);
                            })
                            columnaAcciones.appendChild(botonVerDetalles);
                            filaTablaContratos.appendChild(columnaContratosInfo);
                            filaTablaContratos.appendChild(columnaAcciones);
                            cuerpoTablaContratos.appendChild(filaTablaContratos);
                        })
                    }
                    tablaContratos.appendChild(cuerpoTablaContratos);
                    contenidoTabla.appendChild(tablaContratos)
                    cardContratoBody.appendChild(contenidoTabla);
                    cardContrato.appendChild(cardContratoBody);
                    columnaContratos.appendChild(cardContrato);
                    const capaGrupoPagos = document.createElement('div');
                    capaGrupoPagos.classList.add('card','mb-2');
                    const cardPagadosBody = document.createElement('div');
                    cardPagadosBody.classList.add('card-body','p-2');
                    cardPagadosBody.innerHTML='<div class="fuente-12p">Folios Pagos</div>'
                    const contenedorTablaPagos = document.createElement('div');
                    contenedorTablaPagos.classList.add('tabla-contenedor-medio');
                    const tablaPagos = document.createElement('table');
                    tablaPagos.classList.add('table','table-sm','table-hover','fuente-12p');
                    const cuerpoTablaPagos = document.createElement('tbody');
                    if(respuestas[2]==null||respuestas[2]==null){
                        cuerpoTablaPagos.innerHTML=`
                            <tr>
                                <td>No hay información de pagos para mostrar puede que tengan una baja mucho antes de sistematizar o bien nunca ha realizado pagos.</td>
                            </tr>
                        `;
                    }else{
                        respuestas[2].forEach(pagos => {
                            const filaTablaPagos = document.createElement('tr');
                            filaTablaPagos.innerHTML=`
                                <td>
                                    <div class="row">
                                        <div class="col-md-12 col-12"><small>Folio:</small> ${pagos.IDCOBRO_COBR}-${pagos.CONSECUTIVO_COBR}</div>
                                        <div class="col-md-12 col-12"><small>Contrato:</small> ${pagos.CONTRATO_COBR}</div>
                                        <div class="col-md-12 col-12"><small>Cliente:</small> ${pagos.CLIENTE}</div>
                                        <div class="col-md-12 col-12"><small>Pago:</small> ${pagos.TOTAL_PAGO} | Fecha Pago: ${pagos.FMODIF_PAGO}</div>
                                    </div>
                                </td>
                            `;
                            cuerpoTablaPagos.appendChild(filaTablaPagos);
                        })
                    }
                    tablaPagos.appendChild(cuerpoTablaPagos);
                    contenedorTablaPagos.appendChild(tablaPagos);
                    cardPagadosBody.appendChild(contenedorTablaPagos);
                    capaGrupoPagos.appendChild(cardPagadosBody);
                    columnaContratos.appendChild(capaGrupoPagos);
                    const cardAcuses = document.createElement('div');
                    cardAcuses.classList.add('card','mb-2');
                    const cardAcusesBody = document.createElement('div');
                    cardAcusesBody.classList.add('card-body','p-2','fuente-12p');
                    cardAcusesBody.setAttribute('id','cardAcusesBody');
                    cardAcuses.appendChild(cardAcusesBody);
                    columnaContratos.appendChild(cardAcuses);
                    
                }
                detallesCliente.innerHTML='';
                detallesCliente.appendChild(columnaCliente);
                detallesCliente.appendChild(columnaContratos);
                detallesCliente.appendChild(columnaDetalles);

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

const mostrarDetalleContrato = async (botonVerDetalles) => {
    try {
        let idBusqueda = botonVerDetalles.attributes.datadetalle.value;
        let detallesContratos = document.querySelector('#detallesContratos');
        let cardAcusesBody = document.querySelector('#cardAcusesBody');
        detallesContratos.innerHTML=cargaAnimacion;
        fetch(`aclaraciones/mostrarDetallesContratos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            const botonModifDetalle = document.createElement('button');
            botonModifDetalle.classList.add('btn','btn-sm','btn-info');
            botonModifDetalle.innerHTML='Modificar Detalle';
            botonModifDetalle.addEventListener('click', () => {
                mostrarDetalleContratoModif(botonVerDetalles);
            })
            const detallesContenedor = document.createElement('div');
            detallesContenedor.classList.add('tabla-contenedor');
            const tablaDetalles = document.createElement('table');
            tablaDetalles.classList.add('table','table-sm','table-hover','fuente-12p');
            const cuerpoTablaDetalles = document.createElement('tbody');
            let totalDeuda = document.createElement('div');
            if(respuestas.estatus=='error'||respuestas==null){
                botonModifDetalle.classList.add('d-none');
                cuerpoTablaDetalles.innerHTML='<tr><td>No hay deudas de este contrato</td></tr>'
            }else{
                if(respuestas[0]==null||respuestas[1]==null){
                    botonModifDetalle.classList.add('d-none');
                    cuerpoTablaDetalles.innerHTML='<tr><td>No hay deudas de este contrato</td></tr>'    
                }else{
                    respuestas[0].forEach(detalles => {
                        let costoCodigo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(detalles.COSTO_DETA);
                        let totalCodigo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(detalles.TOTAL_DETA);
                        const filaTablaDetalles = document.createElement('tr');
                        const columnaCodigo = document.createElement('td');
                        columnaCodigo.innerHTML=detalles.CODIGO_DETA,
                        filaTablaDetalles.appendChild(columnaCodigo);
                        const columnaDescripcion = document.createElement('td');
                        columnaDescripcion.innerHTML=detalles.DESCRIPCION_CONC;
                        filaTablaDetalles.appendChild(columnaDescripcion);
                        const columnaCantidad = document.createElement('td');
                        columnaCantidad.innerHTML=detalles.CANTIDAD_DETA;
                        filaTablaDetalles.appendChild(columnaCantidad);
                        const columnaCosto = document.createElement('td');
                        columnaCosto.innerHTML=costoCodigo;
                        filaTablaDetalles.appendChild(columnaCosto);
                        const columnaTotal = document.createElement('td');
                        columnaTotal.innerHTML=totalCodigo;
                        filaTablaDetalles.appendChild(columnaTotal);
                        cuerpoTablaDetalles.appendChild(filaTablaDetalles);
                    })
                    respuestas[1].forEach(totales => {
                        let labelTotal = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTALES);
                        totalDeuda.classList.add('text-right','font-weight-bold');
                        totalDeuda.innerHTML=labelTotal;
                    })
                }
                const tablaAcuses = document.createElement('table');
                tablaAcuses.classList.add('table','table-sm','table-hover','fuente-12p');
                const cuerpoTablaAcuses = document.createElement('tbody')
                if(respuestas[2]==null||respuestas[2]==''){
                    
                }else{
                    respuestas[2].forEach(acuerdos => {
                        const filaTablaAcuses = document.createElement('tr');
                        const columnaInfoAcuse = document.createElement('td');
                        columnaInfoAcuse.innerHTML=`
                            <div><small>Folio:</small> ${acuerdos.FOLIO_CCOND} | <small>Contrato:</small> ${acuerdos.CONTRATO_CCOND} | <small>Fecha:</small> ${acuerdos.FMODIF_CCOND}</div>
                        `;
                        filaTablaAcuses.appendChild(columnaInfoAcuse);
                        const columnaAcciones = document.createElement('td');
                        const botonImprimirAcuse = document.createElement('button');
                        botonImprimirAcuse.classList.add('btn','btn-sm','btn-success');
                        botonImprimirAcuse.setAttribute('dataimprimir',acuerdos.FOLIO_CCOND+'_'+acuerdos.CONTRATO_CCOND);
                        botonImprimirAcuse.innerHTML='<i class="fas fa-print"></i>';
                        botonImprimirAcuse.addEventListener('click', () => {
                            imprimirAcuseAcuerdo(botonImprimirAcuse);
                        })
                        columnaAcciones.appendChild(botonImprimirAcuse);
                        filaTablaAcuses.appendChild(columnaAcciones);
    
                        cuerpoTablaAcuses.appendChild(filaTablaAcuses);
                    })
                }
                tablaAcuses.appendChild(cuerpoTablaAcuses);
                cardAcusesBody.innerHTML='';
                cardAcusesBody.appendChild(tablaAcuses);
            }
            tablaDetalles.appendChild(cuerpoTablaDetalles);
            detallesContratos.innerHTML='';
            detallesContenedor.appendChild(tablaDetalles);
            detallesContratos.appendChild(detallesContenedor);
            detallesContratos.appendChild(totalDeuda);
            detallesContratos.appendChild(botonModifDetalle);
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

const mostrarDetalleContratoModif = async (botonVerDetalles) => {
    try {
        let idBusqueda = botonVerDetalles.attributes.datadetalle.value;
        let detallesContratos = document.querySelector('#detallesContratos');
        detallesContratos.innerHTML=cargaAnimacion;
        fetch(`aclaraciones/mostrarDetallesContratos/${idBusqueda}`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            const detallesContenedor = document.createElement('div');
            detallesContenedor.classList.add('tabla-contenedor-medio');
            detallesContenedor.setAttribute('id','detallesContenedor');
            const tablaDetalles = document.createElement('table');
            tablaDetalles.classList.add('table','table-sm','table-hover','fuente-12p');
            const cuerpoTablaDetalles = document.createElement('tbody');
            let labelDeuda = document.createElement('div');
            labelDeuda.setAttribute('id','labelDeuda');
            let totalDeuda = document.createElement('input');
            totalDeuda.setAttribute('type','hidden');
            totalDeuda.setAttribute('id','totalDeuda');
            totalDeuda.setAttribute('value',0);
            let labelCondonado = document.createElement('div');
            labelCondonado.setAttribute('id','labelCondonado');
            let totalCondonado = document.createElement('input');
            totalCondonado.setAttribute('type','hidden');
            totalCondonado.setAttribute('id','totalCondonado');
            totalCondonado.setAttribute('value',0);
            let labelRestante = document.createElement('div');
            labelRestante.setAttribute('id','labelRestante');
            let totalRestante = document.createElement('input');
            totalRestante.setAttribute('type','hidden');
            totalRestante.setAttribute('id','totalRestante');
            totalRestante.setAttribute('value',0);
            const botonQuitarDeuda = document.createElement('button');
            botonQuitarDeuda.classList.add('btn','btn-sm','btn-info');
            botonQuitarDeuda.setAttribute('disabled','disabled');
            botonQuitarDeuda.innerHTML='Quitar adeudos';
            botonQuitarDeuda.addEventListener('click', () => {
                condonarDeudas(botonQuitarDeuda);
            })
            const textRazon = document.createElement('input');
            textRazon.classList.add('form-control','form-control-sm','mb-2');
            textRazon.setAttribute('id','textRazon');
            textRazon.setAttribute('placeholder','Razón Maximo 40 caracteres');
            const textMotivo = document.createElement('textarea');
            textMotivo.classList.add('form-control','form-control-sm','mb-2');
            textMotivo.setAttribute('id','textMotivo');
            textMotivo.setAttribute('rows','5');
            textMotivo.setAttribute('placeholder','Escribe el motivo de la condonación, aparecera en el acuse');

            if(respuestas.estatus=='error'||respuestas==null||respuestas[0]==null||respuestas[1]==null){
                cuerpoTablaDetalles.innerHTML='<tr><td>No hay deudas de este contrato</td></tr>'
            }else{
                respuestas[0].forEach(detalles => {
                    let costoCodigo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(detalles.COSTO_DETA);
                    let totalCodigo = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(detalles.TOTAL_DETA);
                    const filaTablaDetalles = document.createElement('tr');
                    filaTablaDetalles.setAttribute('dataparent',detalles.idTablePk);
                    const columnaCodigo = document.createElement('td');
                    columnaCodigo.innerHTML=detalles.CODIGO_DETA,
                    filaTablaDetalles.appendChild(columnaCodigo);
                    const columnaDescripcion = document.createElement('td');
                    columnaDescripcion.innerHTML=detalles.DESCRIPCION_CONC;
                    filaTablaDetalles.appendChild(columnaDescripcion);
                    const columnaCantidad = document.createElement('td');
                    columnaCantidad.innerHTML=detalles.CANTIDAD_DETA;
                    filaTablaDetalles.appendChild(columnaCantidad);
                    const columnaCosto = document.createElement('td');
                    columnaCosto.innerHTML=costoCodigo;
                    filaTablaDetalles.appendChild(columnaCosto);
                    const columnaTotal = document.createElement('td');
                    columnaTotal.innerHTML=totalCodigo;
                    filaTablaDetalles.appendChild(columnaTotal);
                    const columnaCheckBox = document.createElement('td');
                    const capaCheckBox = document.createElement('div');
                    capaCheckBox.classList.add('d-flex');
                    const inputCheckboxClicker = document.createElement('input');
                    inputCheckboxClicker.setAttribute('type','checkbox');
                    //inputCheckboxClicker.classList.add('form-check-input');
                    inputCheckboxClicker.setAttribute('id',detalles.idTablePk);
                    inputCheckboxClicker.setAttribute('name','abonos');
                    inputCheckboxClicker.setAttribute('value',detalles.CODIGO_DETA);
                    inputCheckboxClicker.addEventListener('click', () => {
                        modificarTotalesDeuda(inputCheckboxClicker,botonQuitarDeuda);
                    })
                    const labelCheckbocClicker = document.createElement('label');
                    labelCheckbocClicker.setAttribute('for',detalles.idTablePk);
                    labelCheckbocClicker.classList.add('fuente-18p','mb-0');
                    labelCheckbocClicker.innerHTML=' Quitar';
                    capaCheckBox.appendChild(inputCheckboxClicker);
                    capaCheckBox.appendChild(labelCheckbocClicker);
                    columnaCheckBox.appendChild(capaCheckBox);
                    filaTablaDetalles.appendChild(columnaCheckBox);

                    cuerpoTablaDetalles.appendChild(filaTablaDetalles);
                })
                respuestas[1].forEach(totales => {
                    let deudaInicial = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totales.TOTALES);
                    let condonado = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(0);
                    totalDeuda.value=totales.TOTALES;
                    labelDeuda.classList.add('text-right','font-weight-bold');
                    labelDeuda.innerHTML='Adeudo: '+deudaInicial;
                    labelCondonado.classList.add('text-right','font-weight-bold');
                    labelCondonado.innerHTML=condonado;
                    labelRestante.classList.add('text-right','font-weight-bold','text-danger');
                    labelRestante.innerHTML=condonado;
                    totalRestante.value=totales.TOTALES;
                })
            }
            tablaDetalles.appendChild(cuerpoTablaDetalles);
            detallesContratos.innerHTML=`<input type="hidden" id="textMovimiento" name="textMovimiento" value="${idBusqueda}">`;
            detallesContenedor.appendChild(tablaDetalles);
            detallesContratos.appendChild(detallesContenedor);
            detallesContratos.appendChild(labelDeuda);
            detallesContratos.appendChild(totalDeuda);
            detallesContratos.appendChild(labelCondonado);
            detallesContratos.appendChild(totalCondonado);
            detallesContratos.appendChild(labelRestante);
            detallesContratos.appendChild(totalRestante);
            detallesContratos.appendChild(textRazon);
            detallesContratos.appendChild(textMotivo);
            detallesContratos.appendChild(botonQuitarDeuda);
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

const modificarTotalesDeuda = async (inputCheckboxClicker,botonQuitarDeuda) => {
    try{
        let idBusqueda = inputCheckboxClicker.attributes.id.value;
        let labelCondonado = document.querySelector('#labelCondonado');
        let labelRestante = document.querySelector('#labelRestante');
        let totalCondonado = document.querySelector('#totalCondonado');
        let totalRestante = document.querySelector('#totalRestante');
        fetch(`aclaraciones/modificarCondonacion/${idBusqueda}`)
        .then(respRender =>  respRender.json())
        .then(respuestas => {
            respuestas.forEach(totales => {
                if(inputCheckboxClicker.checked==false){
                    let totalModificado=parseFloat(totalRestante.value) + parseFloat(totales.TOTAL_DETA);
                    totalRestante.value=totalModificado;
                    let totalAbono = parseFloat(totalCondonado.value) - parseFloat(totales.TOTAL_DETA);
                    totalCondonado.value=totalAbono;
                    let costoAbono = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalAbono);
                    let costoModif = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalModificado);
                    labelCondonado.innerHTML='Apoyo: '+costoAbono;
                    labelRestante.innerHTML='Por pagar: '+costoModif;
                }else if(inputCheckboxClicker.checked==true){
                    let totalModificado=parseFloat(totalRestante.value) - parseFloat(totales.TOTAL_DETA);
                    totalRestante.value=totalModificado;
                    let totalAbono = parseFloat(totalCondonado.value) + parseFloat(totales.TOTAL_DETA);
                    totalCondonado.value=totalAbono;
                    let costoAbono = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalAbono);
                    let costoModif = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(totalModificado);
                    labelCondonado.innerHTML='Apoyo: '+costoAbono;
                    labelRestante.innerHTML='Por pagar: '+costoModif;
                }
                if(totalCondonado.value>0){
                    labelCondonado.classList.add('text-warning');
                    labelRestante.classList.add('text-danger');
                    botonQuitarDeuda.removeAttribute('disabled')
                }else{
                    let condonado = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(0);
                    labelCondonado.classList.remove('text-warning');
                    labelRestante.classList.remove('text-danger');
                    labelCondonado.innerHTML=condonado
                    labelRestante.innerHTML=condonado
                    botonQuitarDeuda.setAttribute('disabled','disabled');
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

const condonarDeudas = async (botonQuitarDeuda) => {
    try {
        if(validarRazon()&&validarMotivo()){
            let detallesContenedor = document.querySelector('#detallesContenedor');
            let textMovimiento = document.querySelector('#textMovimiento');
            let totalDeuda = document.querySelector('#totalDeuda');
            let totalCondonado = document.querySelector('#totalCondonado');
            let totalRestante = document.querySelector('#totalRestante');
            let textRazon = document.querySelector('#textRazon');
            let textMotivo = document.querySelector('#textMotivo');
            let condonacionCheck = document.querySelectorAll('input[name="abonos"]:checked');
            let condonacionTemporal = [];
            for(let regis = 0; regis < condonacionCheck.length; regis++){
                condonacionTemporal.push(condonacionCheck[regis].value);
            }
            const datosCondonacion = {
                textMovimiento: textMovimiento.value,
                condonacionCheck: condonacionTemporal,
                textRazon: textRazon.value,
                textMotivo: textMotivo.value,
                totalDeuda: totalDeuda.value,
                totalCondonado: totalCondonado.value,
                totalRestante: totalRestante.value,
            }
            fetch('aclaraciones/realizarCondonacionDeuda', {
                method: 'POST',
                body: JSON.stringify(datosCondonacion),
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
                    let detallesContratos = document.querySelector('#detallesContratos');
                    botonQuitarDeuda.setAttribute('disabled','disabled');
                    textRazon.setAttribute('disabled','disabled');
                    textMotivo.setAttribute('disabled','disabled');
                    detallesContenedor.innerHTML='';
                    const tablaAcuses = document.createElement('table');
                    tablaAcuses.classList.add('table','table-sm','table-hover','fuente-12p','mt-2');
                    const cuerpoTablaAcuses = document.createElement('tbody')
                    respuestas.forEach(acuses => {
                        const filaTablaAcuses = document.createElement('tr');
                        const columnaInfoAcuse = document.createElement('td');
                        columnaInfoAcuse.innerHTML=`
                            <div><small>Folio:</small> ${acuses.FOLIO_CCOND} | <small>Contrato:</small> ${acuses.CONTRATO_CCOND} | <small>Fecha:</small> ${acuses.FMODIF_CCOND}</div>
                        `;
                        filaTablaAcuses.appendChild(columnaInfoAcuse);
                        const columnaAcciones = document.createElement('td');
                        const botonImprimirAcuse = document.createElement('button');
                        botonImprimirAcuse.classList.add('btn','btn-sm','btn-success');
                        botonImprimirAcuse.setAttribute('dataimprimir',acuses.FOLIO_CCOND+'_'+acuses.CONTRATO_CCOND);
                        botonImprimirAcuse.innerHTML='<i class="fas fa-print"></i>';
                        botonImprimirAcuse.addEventListener('click', () => {
                            imprimirAcuseAcuerdo(botonImprimirAcuse);
                        })
                        columnaAcciones.appendChild(botonImprimirAcuse);
                        filaTablaAcuses.appendChild(columnaAcciones);
    
                        cuerpoTablaAcuses.appendChild(filaTablaAcuses);
                    })
                    tablaAcuses.appendChild(cuerpoTablaAcuses);
                    detallesContratos.appendChild(tablaAcuses);
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

const imprimirAcuseAcuerdo = async (botonImprimirAcuse) => {
    try {
        let idBusqueda = botonImprimirAcuse.attributes.dataimprimir.value;
        let datosAcuseRecibo = document.querySelector('#datosAcuseRecibo');
        datosAcuseRecibo.innerHTML=`
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
        let fechaHoy = new Date();
        let fechaImpress = fechaHoy.getFullYear()+'-'+('0'+(fechaHoy.getMonth()+1)).slice(-2)+'-'+('0'+(fechaHoy.getDate())).slice(-2)+' '+('0'+(fechaHoy.getHours())).slice(-2)+':'+('0'+(fechaHoy.getMinutes())).slice(-2)+':'+('0'+(fechaHoy.getSeconds())).slice(-2);
        fetch(`areportes/imprimirAcuseAclaracion/${idBusqueda}`)
        .then(respuestaRender => respuestaRender.json())
        .then(respuestas => {
            const tablaAcuseBaja = document.createElement('table');
            tablaAcuseBaja.setAttribute('border','0');
            tablaAcuseBaja.setAttribute('cellspacing','0');
            tablaAcuseBaja.setAttribute('cellpadding','0');
            tablaAcuseBaja.setAttribute('style','width: 100%; font-family: Montserrat;');
            let mensajeBaja = '';
            let comiteParti = document.createElement('tr');
            let titularBaja = '';
            respuestas[0].forEach(acuerdo => {
                let fechaSplit = acuerdo.FCAMBIO_CCOND.split('-');
                let contador = parseInt(fechaSplit[1]-1)
                let mesesArray = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                let mesMuestra = '';
                let pronombre = '';
                let condonado = new Intl.NumberFormat("en-US", {style: "currency", currency: "MXN"}).format(acuerdo.MONTO_CCOND);
                if(acuerdo.SEXO_CLIEN=='H'){
                    pronombre='el'
                }else if(acuerdo.SEXO_CLIEN=='M'){
                    pronombre='la'
                }else{
                    pronombre='del'
                }
                for(let mes=contador; mes <= contador; mes++){
                    mesMuestra=mesesArray[mes];
                }
                mensajeBaja=`
                    <tr>
                        <td colspan="12">
                            <div style="text-align: right; padding:10px; font-weight:bolder;">ASUNTO: ACLARACION DE DEUDAS</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12">
                            <div style="text-align: right; padding:10px; font-weight:bolder;">FOLIO: ${acuerdo.FOLIO_CCOND}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12">
                            <div style="text-align: left; padding:10px; font-weight:bolder;">Contrato: ${acuerdo.CONTRATO_CCOND}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12">
                            <div style="text-align: justify; padding:10px;">
                                Por medio del presente documento el día ${fechaSplit[2]} de ${mesMuestra} de ${fechaSplit[0]} en las 
                                instalaciones del pozo de agua potable de Teltipan de Juárez ${pronombre} C. ${acuerdo.CLIENTE} con 
                                el contrato ${acuerdo.CONTRATO_CCOND} solicita <strong>aclaracion de su(s) adeudo(s)</strong> 
                                despues de una negociación con el Presidente y Tesorero se le podrá apoyar condonando la 
                                candidad de ${condonado}<br/>
                                Acontinuación se detalla las condiciones por las que se llego a este acuerdo de ambas partes.<br/>
                                <strong>${acuerdo.MOTCAMBIO_CCOND}</strong>.<br/>
                                Se detalla las caracteristicas resultantes del acuerdo a continuación<br/>
                                <p>
                                Deuda inicial: ${acuerdo.DEUDA_CCOND}<br/>
                                Apoyo condonado: ${acuerdo.MONTO_CCOND}<br/>
                                Por liquidar: ${acuerdo.RESTA_CCOND}<br/>
                                Códigos Condonados: ${acuerdo.CODIGOS_CCOND}<br/>
                                </p>
                                Este acuse es informativo y queda como dato para cualquier aclaración futura.
                            </div>
                        </td>
                    </tr>
                `;
                titularBaja=`
                    <tr>
                        <td colspan="3"></td>
                        <td colspan="6" style="border-top: 1px solid rgb(20,179,237); padding-bottom:80px;">
                            <div style="text-align:center; font-size:14px;">${acuerdo.CLIENTE}</div>
                            <div style="text-align:center; font-size:12px;">Usuario/a</div>
                        </td>
                        <td colspan="3"></td>
                    </tr>
                `;
                
            })
            respuestas[1].forEach(comite => {
                const columnaComiteA = document.createElement('td');
                columnaComiteA.setAttribute('colspan','1');
                comiteParti.appendChild(columnaComiteA);
                const columnaDatos = document.createElement('td');
                columnaDatos.setAttribute('colspan','4');
                columnaDatos.setAttribute('style','border-top: 1px solid rgb(20,179,237); padding-bottom:80px;');
                columnaDatos.innerHTML=`
                    <div style="text-align:center; font-size:14px;">${comite.NOMBRE}</div>
                    <div style="text-align:center; font-size:12px;">${comite.DESCRIPHOM_PUESTO}</div>
                `;
                comiteParti.appendChild(columnaDatos);
                const columnaComiteB = document.createElement('td');
                columnaComiteB.setAttribute('colspan','1');
                comiteParti.appendChild(columnaComiteB);
            })
            tablaAcuseBaja.innerHTML=`
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
                <tr>
                    <td colspan="1" style="border: none;"><img src="public/assets/imagen/logotipos/logo_sapt_color_300.png" style="width:100px; height:100px; margin: auto;"/></td>
                    <td colspan="11" style="text-align: center; border: none;">
                        <div style="text-align: right; padding:10px 10px 0px; font-size: 14px;">SISTEMA DE AGUA POTABLE COMITE DE ADMINISTRACION DE AGUA POTABLE</div>
                        <div style="text-align: right; padding:0px 10px; font-size: 12px;">CERRADA ABASOLO S/N TELTIPAN DE JUÁREZ MUNICIPIO DE TLAXCOAPAN, HIDALGO</div>
                    </td>
                </tr>
                ${mensajeBaja}
                <tr>
                    <td colspan="12">
                        <div style="text-align: left; padding:5px;">El presente documento da fe y legalidad del acuerdo efectuado.</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="12" style="padding-bottom:30px;">
                        <div style="text-align: center; padding:30px; font-weight:bolder;">EN ACUERDO:</div>
                    </td>
                </tr>
                ${comiteParti.outerHTML}
                ${titularBaja}
            `;
            datosAcuseRecibo.appendChild(tablaAcuseBaja);
            let ventImpri = window.open('', 'popimpr');
            ventImpri.document.write(datosAcuseRecibo.innerHTML);
            ventImpri.document.close();
            ventImpri.print();
            ventImpri.close();
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


function validarIdBusqueda(){
    let inputForm = document.querySelector("#textIdUsuario");
    let textUsuario = document.querySelector("#textUsuario");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Cliente es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(textUsuario);
            }
        })
        return false;
    }
    inputValido(textUsuario);
    return true;

}

function validarRazon(){
    let inputForm = document.querySelector("#textRazon");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Razon es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if(inputForm.value>30){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Razon máx. 30 caracteres',
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

function validarMotivo(){
    let inputForm = document.querySelector("#textMotivo");
    if(inputForm.value==null || inputForm.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Motivo es requerido',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
    }else if(inputForm.value<20){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Motivo debe ser mas especifico',
        }).then((result)=>{
            if(result.isConfirmed){
                inputError(inputForm);
            }
        })
        return false;
        
    }else if(inputForm.value>500){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Motivo máx. 500 caracteres',
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
