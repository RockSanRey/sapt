let cargaAnimacion = '<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
document.addEventListener('DOMContentLoaded', () => {
    seleccionAsamblea();
    escaneadorCodigos();
    lecturaCodigoBarras();
    nombreEscritura();
})

const seleccionAsamblea = async () => {
    try {
        let selectorAsamblea = document.querySelector('#selectorAsamblea');
        selectorAsamblea.innerHTML=`
            <div class="form-group">
                <select id="textAsamblea" id="textAsamblea" class="custom-select custom-select-sm"></select>
            </div>
        `;
        let textAsamblea = document.querySelector('#textAsamblea');
        llenarComboAsambleas();
        textAsamblea.focus();
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const llenarComboAsambleas = async () => {
    try {
        let textAsamblea = document.querySelector('#textAsamblea');
        textAsamblea.innerHTML='<option value="">Elije Asamblea</option>'
        fetch(`asisasamblea/llenarComboAsambleas/`)
        .then(respRender => respRender.json())
        .then(respuestas => {
            if(respuestas.estatus=='error'){
                const opcionSelect = document.createElement('option');
                opcionSelect.setAttribute('value', '');
                opcionSelect.classList.add('fuente-12p');
                opcionSelect.innerHTML='Sin Datos';
                textAsamblea.appendChild(opcionSelect);
            }else{
                respuestas.forEach(asambleas => {
                    const opcionSelect = document.createElement('option');
                    opcionSelect.setAttribute('value', asambleas.CODIGO_ASAM);
                    opcionSelect.classList.add('fuente-12p');
                    opcionSelect.innerHTML=asambleas.DESCRIPCION_ASAM+' - '+asambleas.TOTALES;
                    textAsamblea.appendChild(opcionSelect);
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

const escaneadorCodigos = async () => {
    try{
        let qrReader = document.querySelector('#qrReader');
        qrReader.classList.add('escaneo-qr-contenido');
    } catch (errorAlert) {
        return Swal.fire({
            title: 'Error interno',
            icon: 'error',
            confirmButtonColor: '#f43',
            html: errorAlert.message,
        })
    }
}

const lecturaCodigoBarras = async () => {
    try{
        let textCodigoBarras = document.querySelector('#textCodigoBarras');
        textCodigoBarras.addEventListener('input', () => {
            if(isNaN(textCodigoBarras.value)){
                return Swal.fire({
                    title: 'Invalido',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#9C0000',
                    html: 'Solo deben ser números',
                    showConfirmButton: false,
                    timer: 1000,
                })
                .then((result) => {
                    if(result.isDismissed){
                        textCodigoBarras.value='';
                        textCodigoBarras.focus();
                    }
                })

            }else{
                if(textCodigoBarras.value.length==14){
                    let idBusqueda = textCodigoBarras.value+'_BRCOD';
                    fetch(`asisasamblea/marcarAsistencia/${idBusqueda}`)
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
                            return Swal.fire({
                                title: respuestas.title,
                                icon: respuestas.icon,
                                confirmButtonText: `${respuestas.button}`,
                                confirmButtonColor: '#009C06',
                                html: respuestas.text,
                                showConfirmButton: false,
                                timer: 1000,
                            })
                            .then((result) => {
                                if(result.isDismissed){
                                    textCodigoBarras.value='';
                                    textCodigoBarras.focus();
                                }
                            })
                        }
                    })
                }
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

const nombreEscritura = async () => {
    try {
        let textNombre = document.querySelector('#textNombre');
        let userListComplete = document.querySelector('#userListComplete');
        textNombre.addEventListener('keyup', (e) => {
            userListComplete.innerHTML='';
            if(e.keyCode=='13'){
                e.preventDefault();
                let textIdUsuario = document.querySelector('#textIdUsuario');
                nombreAsistenciaMarcar(textIdUsuario);
            }else if(e.keyCode >= 64 && e.keyCode <= 90){
                completarBusquedaUsuarios(textNombre);
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

const completarBusquedaUsuarios = async (textNombre) => {
    try{
        let userListComplete = document.querySelector('#userListComplete');
        let textIdUsuario = document.querySelector('#textIdUsuario');
        let textAsamblea = document.querySelector('#textAsamblea');
        userListComplete.innerHTML='';
        if(textNombre.value=='' || textNombre.value==null){
            userListComplete.innerHTML='';
        }else if(textAsamblea.value==''||textAsamblea.value==null){
            return Swal.fire({
                title: 'Invalido',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#9C0000',
                html: 'No ha seleccionado una asamblea',
                showConfirmButton: false,
                timer: 1000,
            })
            .then((result) => {
                if(result.isDismissed){
                    textAsamblea.classList.add('is-invalid');
                }
            })
        }else{
            textAsamblea.classList.remove('is-invalid');
            let idBusqueda = textNombre.value+'_'+textAsamblea.value;
            userListComplete.innerHTML=cargaAnimacion;
            fetch(`asisasamblea/autoCompletarUsuario/${idBusqueda}`)
            .then(respRender => respRender.json())
            .then(respuestas => {
                if(respuestas.length > 0){
                    userListComplete.innerHTML='';
                    const ListadoUl = document.createElement('ul');
                    ListadoUl.innerHTML='';
                    ListadoUl.classList.add('autocompletar-list');
                    respuestas.forEach(usuario => {
                        const listadoItemUl = document.createElement('li');
                        listadoItemUl.classList.add('autocompletar-list-item','fuente-12p');
                        listadoItemUl.innerHTML= usuario.NOMBRE;
                        listadoItemUl.addEventListener('click', () => {
                            textIdUsuario.value=usuario.IDUSUA_CLIEN;
                            textNombre.value = usuario.NOMBRE;
                            userListComplete.innerHTML='';
                            textNombre.focus();
                        })
                        ListadoUl.appendChild(listadoItemUl);
                    })
                    userListComplete.appendChild(ListadoUl);

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

const nombreAsistenciaMarcar = async (textIdUsuario) => {
    try {
        if(validaIdUsuario()){
            let idBusqueda = textIdUsuario.value+'_NOMBR';
            let textNombre = document.querySelector('#textNombre');
            fetch(`asisasamblea/marcarAsistencia/${idBusqueda}`)
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
                        confirmButtonText: respuestas.button,
                        confirmButtonColor: '#009C06',
                        html: respuestas.text,
                        showConfirmButton: false,
                        timer: 1200,
                    })
                    .then((result) => {
                        if(result.isDismissed){
                            textIdUsuario.value='';
                            textNombre.value='';
                            textNombre.classList.remove('is-valid');
                            textNombre.focus();
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

function validaIdUsuario(){
    let inputForm = document.querySelector("#textNombre");
    let textIdUsuario = document.querySelector('#textIdUsuario');
    if(textIdUsuario.value==null || textIdUsuario.value==''){
        Swal.fire({
            title: 'Campo Inválido',
            confirmButtonText: 'Revisar',
            confirmButtonColor: '#9C0000',
            icon: 'error',
            text: 'Usuario es requerido',
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
