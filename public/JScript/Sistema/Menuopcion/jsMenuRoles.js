let botonMuestraBarra = document.querySelector('#botonMuestraBarra');
let botonOcultaBarra = document.querySelector('#botonOcultaBarra');
let menuLaterarMenu = document.querySelector('#menuLaterarMenu');
let opcionesDisponibles = document.querySelector('input[name="opcionesDisponibles"]');

document.addEventListener('DOMContentLoaded', () => {
    armarMenuSistemaRoles();
    botonMuestraBarra.addEventListener('click', () => {
        let headBoton = document.querySelector('.headerbar-boton');
        headBoton.classList.toggle('headerbar-boton-show')
        sideBar.classList.toggle('sidebar-sisinad-hide');
    })
    botonOcultaBarra.addEventListener('click', () => {
        let headBoton = document.querySelector('.headerbar-boton');
        headBoton.classList.toggle('headerbar-boton-show')
        sideBar.classList.toggle('sidebar-sisinad-hide');
    })

})


const armarMenuSistemaRoles = async () => {
    try {
        let sideBar = document.querySelector('#sideBar');
        sideBar.classList.add('sidebar-sisinad-hide');
        menuLaterarMenu.innerHTML='<div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Loading...</span></div>';
        opcionArmado = opcionesDisponibles.value;
        (fetch(`/menuarmado/armarMenuSistemaRoles`))
        .then(respuestaRender => respuestaRender.json())
        .then(respuestas => {
            menuLaterarMenu.innerHTML='';
            const listadoUl = document.createElement('ul');
            listadoUl.classList.add('menu-nav-nivela-ul');
            respuestas[1].forEach(respuesta => {
                const listadoItemUl = document.createElement('li');
                listadoItemUl.setAttribute('menu-item-select',respuesta.IDMENU_MENA);
                listadoItemUl.classList.add('menu-nav-nivela-li');
                if(respuesta.CONTOPC_MENA=='SI'){
                    const subMenuNivelA = document.createElement('div');
                    subMenuNivelA.classList.add('menu-nav-nivela-down');
                    subMenuNivelA.innerHTML=`
                        <a menu-item-click="${respuesta.IDMENU_MENA}" class="menu-nav-nivela-a">
                            <i class="${respuesta.CLASS_MENA} menu-nav-nivela-icon"></i>
                            <span class="menu-nav-nivela-opcion">${respuesta.DESCRIP_MENA}</span>
                        </a>
                        <i class="fas fa-angle-down"></i>
                    `;
                    listadoItemUl.appendChild(subMenuNivelA);
                    subMenuNivelA.addEventListener('click', () =>{
                        let valorActivoA = document.querySelector(`[menu-item-childb="${respuesta.IDMENU_MENA}"]`);
                        valorActivoA.classList.toggle('menu-nav-nivelb-ul-show');
                    })
                    const listadoUlA = document.createElement('ul');
                    listadoUlA.classList.add('menu-nav-nivelb-ul');
                    respuestas[2].forEach(respuestb => {
                        if(respuesta.IDMENU_MENA==respuestb.IDMENU_MENB){
                            listadoUlA.setAttribute('menu-item-childb',respuestb.IDMENU_MENB);
                            const listadoItemUlA = document.createElement('li');
                            listadoItemUlA.setAttribute('menu-item-select',respuestb.IDSMENU_MENB);
                            listadoItemUlA.classList.add('menu-nav-nivelb-li');
                            if(respuestb.CONTOPC_MENB=='SI'){
                                const subMenuNivelB = document.createElement('div');
                                subMenuNivelB.classList.add('menu-nav-nivelb-down');
                                subMenuNivelB.innerHTML=`
                                        <a menu-item-click="${respuestb.IDSMENU_MENB}" class="menu-nav-nivelb-a">
                                            <i class="${respuestb.CLASS_MENB} menu-nav-nivelb-icon"></i>
                                            <span class="menu-nav-nivelb-opcion">${respuestb.DESCRIP_MENB}</span>
                                        </a>
                                        <i class="fas fa-angle-down"></i>
                                `;
                                listadoItemUlA.appendChild(subMenuNivelB);
                                subMenuNivelB.addEventListener('click', () =>{
                                    let valorActivoB = document.querySelector(`[menu-item-childc="${respuestb.IDSMENU_MENB}"]`);
                                    valorActivoB.classList.toggle('menu-nav-nivelc-ul-show');
                                })
                                const listadoUlB = document.createElement('ul');
                                listadoUlB.classList.add('menu-nav-nivelc-ul');
                                respuestas[3].forEach(respuestc => {
                                    if(respuestb.IDSMENU_MENB==respuestc.IDSMENU_MENC){
                                        listadoUlB.setAttribute('menu-item-childc',respuestc.IDSMENU_MENC);
                                        const listadoItemUlB = document.createElement('li');
                                        listadoItemUlB.setAttribute('menu-item-select',respuestc.IDSBMENU_MENC);
                                        listadoItemUlB.classList.add('menu-nav-nivelc-li');
                                        if(respuestc.CONTOPC_MENC=='SI'){
                                            let subMenuNivelC = document.createElement('div');
                                            subMenuNivelC.classList.add('menu-nav-nivelb-down');
                                            subMenuNivelC.innerHTML=`
                                                    <a menu-item-click="${respuestc.IDSBMENU_MENC}" class="menu-nav-nivelc-a">
                                                        <i class="${respuestc.CLASS_MENC} menu-nav-nivelc-icon"></i>
                                                        <span class="menu-nav-nivelc-opcion">${respuestc.DESCRIP_MENC}</span>
                                                    </a>
                                                    <i class="fas fa-angle-down"></i>
                                            `;
                                            listadoItemUlB.appendChild(subMenuNivelC);
                                            subMenuNivelC.addEventListener('click', () => {
                                                let valorActivoC = document.querySelector(`[menu-item-childd="${respuestc.IDSBMENU_MENC}"]`);
                                                valorActivoC.classList.toggle('menu-nav-niveld-ul-show');
                                            })
                                            const listadoUlC = document.createElement('ul');
                                            listadoUlC.classList.add('menu-nav-niveld-ul');
                                            respuestas[4].forEach(respuestd => {
                                                if(respuestc.IDSBMENU_MENC==respuestd.IDSBMENU_MEND){
                                                    listadoUlC.setAttribute('menu-item-childd',respuestd.IDSBMENU_MEND);
                                                    const listadoItemUlC = document.createElement('li');
                                                    listadoItemUlC.setAttribute('menu-item-select',respuestd.IDSBMENUO_MEND);
                                                    listadoItemUlC.classList.add('menu-nav-niveld-li');
                                                    if(respuestd.CONTOPC_MEND=='SI'){
                                                        listadoItemUlC.innerHTML=`
                                                            <div class="menu-nav-niveld-down">
                                                                <a menu-item-click="${respuestc.IDSBMENUO_MEND}" class="menu-nav-niveld-a">
                                                                    <i class="${respuestc.CLASS_MEND} menu-nav-niveld-icon"></i>
                                                                    <span class="menu-nav-nivelc-opcion">${respuestc.DESCRIP_MEND}</span>
                                                                </a>
                                                                <i class="fas fa-angle-down"></i>
                                                            </div>
                                                        `;
                                                    }else {
                                                        listadoItemUlC.innerHTML=`
                                                        <div class="menu-nav-niveld-link">
                                                            <a menu-item-click="${respuestd.IDSBMENUO_MEND}" class="menu-nav-niveld-a" href="${respuestd.REFEREN_MEND}">
                                                                <i class="${respuestd.CLASS_MEND} menu-nav-niveld-icon"></i>
                                                                <span class="menu-nav-nivelc-opcion">${respuestd.DESCRIP_MEND}</span>
                                                            </a>
                                                        </div>
                                                        `;

                                                    }
                                                    listadoUlC.appendChild(listadoItemUlC);
                                                    listadoItemUlB.appendChild(listadoUlC);
                                                }
                                            })
                                        }else {
                                            listadoItemUlB.innerHTML=`
                                            <div class="menu-nav-nivelc-link">
                                                <a menu-item-click="${respuestc.IDSBMENU_MENC}" class="menu-nav-nivelc-a" href="${respuestc.REFEREN_MENC}">
                                                    <i class="${respuestc.CLASS_MENC} menu-nav-nivelc-icon"></i>
                                                    <span class="menu-nav-nivelc-opcion">${respuestc.DESCRIP_MENC}</span>
                                                </a>
                                            </div>
                                            `;
                                        }
                                        listadoUlB.appendChild(listadoItemUlB);
                                        listadoItemUlA.appendChild(listadoUlB);
                                    }
                                })
                            }else {
                                listadoItemUlA.innerHTML=`
                                <div class="menu-nav-nivelb-link">
                                    <a menu-item-click="${respuestb.IDSMENU_MENB}" class="menu-nav-nivelb-a" href="${respuestb.REFEREN_MENB}">
                                        <i class="${respuestb.CLASS_MENB} menu-nav-nivelb-icon"></i>
                                        <span class="menu-nav-nivelb-opcion">${respuestb.DESCRIP_MENB}</span>
                                    </a>
                                </div>
                                `;
                            }
                            listadoUlA.appendChild(listadoItemUlA);
                            listadoItemUl.appendChild(listadoUlA);
                        }
                    })
                }else {
                    listadoItemUl.innerHTML=`
                    <div class="menu-nav-nivela-link">
                        <a menu-item-click="${respuesta.IDMENU_MENA}" class="menu-nav-nivela-a" href="${respuesta.REFEREN_MENA}">
                            <i class="${respuesta.CLASS_MENA} menu-nav-nivela-icon"></i>
                            <span class="menu-nav-nivela-opcion">${respuesta.DESCRIP_MENA}</span>
                        </a>
                    </div>
                    `;
                }
                listadoUl.appendChild(listadoItemUl);
                menuLaterarMenu.appendChild(listadoUl);
                //menuLaterarMenu.classList.add('menu-nav-content-hide');

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
