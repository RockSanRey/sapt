let botonCancelar = document.querySelector('#botonCancelar');
let botonGuardar = document.querySelector('#botonGuardar');
let botonActualizar = document.querySelector('#botonActualizar');
let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';

document.addEventListener('DOMContentLoaded', () => {
    plantillaBusqueda();
    botonGuardar.addEventListener('click', () => {
        guardarCodigoAsamblea();
    })
    botonActualizar.addEventListener('click', () => {
        actualizarCodigoAsamblea();
    })
    botonCancelar.addEventListener('click', () => {
        let formRegistroCRUD = document.querySelector('#formRegistroCRUD');
        formRegistroCRUD.innerHTML='';
    })
})

const plantillaBusqueda = async () => {
    try {
        let iniciaUsuarios = document.querySelector('#iniciaUsuarios');
        iniciaUsuarios.innerHTML=`
            <div class="input-group mb-3">
                <input type="hidden" name="textIdUsuario" id="textIdUsuario" value="" />
                <select id="textMetodoBus" name="textMetodoBus" class="custom-select custom-select-sm col-md-2" autofocus></select>
                <input type="text" class="form-control form-control-sm col" name="textUsuario" id="textUsuario" placeholder="" autocomplete="off"/>
                <div id="userListComplete" class="autocompletados-lg"></div>
                <div class="input-group-append">
                    <button type="button" class="btn btn-sm btn-success" id="butonBuscarUsuario">Buscar</button>
                </div>
            </div>
        `;
        let textIdUsuario = document.querySelector('#textIdUsuario');
        let textUsuario = document.querySelector('#textUsuario');
        let textMetodoBus = document.querySelector('#textMetodoBus');
        let userListComplete = document.querySelector('#userListComplete');
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');
        textMetodoBus.innerHTML=`
            <option value="">Buscar por</option>
            <option value="NOMBR">Nombre</option>
        `;
        textUsuario.setAttribute('disabled','disabled');
        butonBuscarUsuario.setAttribute('disabled','disabled');
        textMetodoBus.addEventListener('change', () => {
            if(textMetodoBus.value==''){
                butonBuscarUsuario.setAttribute('disabled','disabled');
                textUsuario.setAttribute('disabled','disabled');
                textUsuario.setAttribute('placeholder','');
                userListComplete.innerHTML='';
            }else{
                if(textMetodoBus.value=='NOMBR'){
                    textUsuario.setAttribute('placeholder','Escribe Nombre del Usuario');
                    userListComplete.innerHTML='';
                    textUsuario.value='';
                }else if(textMetodoBus.value=='IDUSU'){
                    textUsuario.setAttribute('placeholder','Escribe Numero de Usuario');
                    userListComplete.innerHTML='';
                    textUsuario.value='';
                }else if(textMetodoBus.value=='CONTR'){
                    textUsuario.setAttribute('placeholder','Escanea el código de barras');
                    userListComplete.innerHTML='';
                    textUsuario.value='';
                }
                butonBuscarUsuario.removeAttribute('disabled');
                textUsuario.removeAttribute('disabled');
                textUsuario.focus();
            }
        })
        textUsuario.addEventListener('keyup', (e) => {
            if(textMetodoBus.value==''||textMetodoBus.value==null){
                return Swal.fire({
                    title: 'Validación',
                    icon: 'error',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Requerido',
                    html: 'Debe seleccionar método de busqueda',
                    showConfirmButton: false,
                    timer: 2500
                }).then((result)=> {
                    if(result.dismiss){
                        textMetodoBus.classList.add('is-invalid');
                        textMetodoBus.focus();
                    }
                })
            }else{
                userListComplete.innerHTML='';
                completarBusquedaUsuarios(textMetodoBus,textUsuario);
            }
            // if(e.keyCode >= 64 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode==8){
            //     userListComplete.innerHTML='';
            //     completarBusquedaUsuarios(textUsuario);
            //     codigoTecla.innerHTML=e.keyCode;
            // }
        })
        butonBuscarUsuario.addEventListener('click', () => {
            buscarUsuarioInformacion(textIdUsuario);
        })
        let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
        datosUsuarioDetalle.classList.remove('tabla-contenedor');

    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const completarBusquedaUsuarios = async (textMetodoBus,textUsuario) => {
    try{
        let idBusqueda = textMetodoBus.value+'_'+textUsuario.value;
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        let butonBuscarUsuario = document.querySelector('#butonBuscarUsuario');        
        userListComplete.innerHTML='';
        if(textUsuario.value=='' || textUsuario.value==null){
            userListComplete.innerHTML='';
        }else if(textMetodoBus.value=='NOMBR'){
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`reaccomite/autoCompletarStaffNombre/${idBusqueda}`)
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
                            textIdUsuario.value=usuario.IDUSUA_RESPO;
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

        }else if(textMetodoBus.value=='IDUSU'){
            if(isNaN(textUsuario.value)){
                return Swal.fire({
                    title: 'Validación',
                    icon: 'error',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Numeros',
                    html: 'Solo Números',
                    showConfirmButton: false,
                    timer: 3500,
                })        
            }else{
                userListComplete.innerHTML=cargaAnimacion;
                fetch(`acobros/autoCompletarUsuario/${idBusqueda}`)
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
                            listadoItemUl.innerHTML= usuario.NOMBRE+' - id Usuario:'+usuario.ID_RESPO;
                            listadoItemUl.addEventListener('click', () => {
                                textIdUsuario.value=usuario.IDUSUA_RESPO;
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
        }else if(textMetodoBus.value=='CONTR'){
            if(isNaN(textUsuario.value)){
                return Swal.fire({
                    title: 'Validación',
                    icon: 'error',
                    confirmButtonColor: '#9C0000',
                    confirmButtonText: 'Numeros',
                    html: 'Solo Números',
                    showConfirmButton: false,
                    timer: 3500,
                })        
            }else{
                if(textUsuario.value.length==14){
                    butonBuscarUsuario.innerHTML=cargaAnimacion;
                    fetch(`acobros/autoCompletarUsuario/${idBusqueda}`)
                    .then(respRender => respRender.json())
                    .then(respuestas => {
                        respuestas.forEach(usuario => {
                            textIdUsuario.value=usuario.IDUSUA_RESPO;
                            textUsuario.value = usuario.NOMBRE;
                            userListComplete.innerHTML='';
                            butonBuscarUsuario.click();
                        })
                    })
                }
            }
        }else{

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
            let datosUsuarioDetalle = document.querySelector('#datosUsuarioDetalle');
            fetch(`reaccomite/tablaStaffReactivar/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {

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
