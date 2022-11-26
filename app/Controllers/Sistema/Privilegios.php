<?php
namespace App\Controllers\Sistema;
use App\Models\Sistema\Mprivilegios;
use App\Controllers\BaseController;

/**
 *
 */
class Privilegios extends BaseController
{
    public function llamandoParametrosWeb($id)
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[PRIVILEGIOS] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $modeloPrivilegios->llamandoDatosParametrosWeb($id)){
            log_message('info','[PRIVILEGIOS] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function asignastaff()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>$respuesta['TITULO_CONW'].' | SAPT',
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDUSUA_CLIEN'),
            'grupo'=>$sesionIniciada->get('NIVELPERF_CLIEN'),
        ];
        log_message('info','[ASIGNASTAFF] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Privilegios/vAsignaStaff').view('Plantilla/vFooter');
    }

    public function llenarTablaPerfilStaff()
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[ASIGNASTAFF|Async] Solicitando datos para renderizado de tabla perfil usuario');
        if($tablaDatos = $modeloPrivilegios->llenarDatosTablaPerfilStaff()){
            log_message('info','[ASIGNASTAFF|Async] Envio de datos para renderizado de tabla perfil usuario');
            return json_encode($tablaDatos);
        }else{
            log_message('info','[ASIGNASTAFF|Async] Ocurrio un error al hacer la consulta de datos');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'error',
                'text'=>'Ocurrió un error al consultar los datos',
                'estatus'=>'error',
            ];
            return json_encode($swalMensajes);

        }

    }

    public function guardarAsignacionStaff()
    {
        log_message('info','[ASIGNASTAFF|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNASTAFF|Async] Verificando el método de envio para GUARDAR');
            if($this->request->getMethod('POST')){
                log_message('info','[ASIGNASTAFF|Async] Metodo envio reconocido continua proceso GUARDAR');
                $reglasValidacion = $this->validate([
                    'textPerfil'=>[
                        'label'=>'Perfil',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textUsuario'=>[
                        'label'=>'Usuario',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                ]);
                log_message('info','[ASIGNASTAFF|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDUSUA_CLIEN'),
                    $textPerfil = $this->request->getPost('textPerfil'),
                    $textUsuario = $this->request->getPost('textUsuario'),
                ];
                $log_extra=[
                    'user'=>session()->get('IDUSUA_CLIEN'),
                    'item'=>$this->request->getPost('textPerfil'),
                    'itema'=>$this->request->getPost('textUsuario'),
                ];
                log_message('notice','[ASIGNASTAFF|Async] {user} esta asignando perfil {item} a {itema}.', $log_extra);
                log_message('info','[ASIGNASTAFF|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[ASIGNASTAFF|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[ASIGNASTAFF|Async] Reglas de validacion aceptadas');
                    $modeloPrivilegio = new Mprivilegios;
                    log_message('info','[ASIGNASTAFF|Async] Enviando datos para verificar duplicidad');
                    if($datosDuplicados=$modeloPrivilegio->buscarDuplicadosAsignacionStaff($datosParaGuardar)){
                        log_message('info','[ASIGNASTAFF|Async] Retorno de datos duplicados esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[ASIGNASTAFF|Async] No se detecto registros duplicados.');
                        if($retorno=$modeloPrivilegio->guardarDatosAsignacionStaff($datosParaGuardar)){
                            log_message('info','[ASIGNASTAFF|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            echo json_encode($swalMensajes);
                        }else {
                            log_message('info','[ASIGNASTAFF|Async] Ocurrio un error al guardar los datos, notificando');
                            $swalMensajes=[
                                'title'=>'Error Servidor',
                                'button'=>'Ok',
                                'icon'=>'error',
                                'text'=>'Ocurro un error al guardar los datos.',
                                'estatus'=>'error',
                            ];
                            return json_encode($swalMensajes);
                        }
                    }
                }
            }else {
                log_message('info','[ASIGNASTAFF|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNASTAFF|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function buscarAsignacionStaff($id)
    {
        log_message('info','[ASIGNASTAFF|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNASTAFF|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                $modeloPrivilegio = new Mprivilegios;
                $datosParaBuscar=[
                    $captura = session()->get('IDUSUA_CLIEN'),
                    $idRegistro = $id,
                ];
                log_message('info','[ASIGNASTAFF|Async] Solicitando datos para renderizado de edición Asignado');
                if($datosEditar=$modeloPrivilegio->buscarDatosAsignacionStaff($datosParaBuscar)){
                    log_message('info','[ASIGNASTAFF|Async] Envio de datos para renderizado de inputs Asignado');
                    return $datosEditar;
                }else {
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'warning',
                        'text'=>'No se encontraron datos que mostrar.',
                        'estatus'=>'error',
                    ];
                    return json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[ASIGNASTAFF|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNASTAFF|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function llenarComboStaffDatos($id)
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[ASIGNASTAFF|Async] Solicitando datos para renderizado de combo usuario');
        if($tablaDatos = $modeloPrivilegios->llenarDatosComboStaffDatos($id)){
            log_message('info','[ASIGNASTAFF|Async] Envio de datos para renderizado de combo usuario');
            return json_encode($tablaDatos);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'warning',
                'text'=>'No se encontraron datos que mostrar.',
                'estatus'=>'error',
            ];
            return json_encode($swalMensajes);
        }

    }

    public function actualizarPerfilStaff()
    {
        log_message('info','[ASIGNASTAFF|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNASTAFF|Async] Verificando el método de envio para GUARDAR');
            if($this->request->getMethod('POST')){
                log_message('info','[ASIGNASTAFF|Async] Metodo envio reconocido continua proceso para actualizar');
                $reglasValidacion = $this->validate([
                    'textPerfil'=>[
                        'label'=>'Perfil',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textUsuario'=>[
                        'label'=>'Usuario',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'menuRoles'=>[
                        'label'=>'Roles',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                ]);
                log_message('info','[ASIGNASTAFF|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaActualizar=[
                    $captura = session()->get('IDUSUA_CLIEN'),
                    $textPerfil = $this->request->getPost('textPerfil'),
                    $textUsuario = $this->request->getPost('textUsuario'),
                    $menuRoles = $this->request->getPost('menuRoles[]'),
                ];
                log_message('info','[ASIGNASTAFF|Async] Inicializando reglas de validación.');
                if(!$reglasValidacion){
                    log_message('info','[ASIGNASTAFF|Async] Las reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[ASIGNASTAFF|Async] Reglas de validacion aceptadas');
                    $modeloPrivilegio = new Mprivilegios;
                    log_message('info','[ASIGNASTAFF|Async] Enviando datos para la actualización');
                    if($respuestaAviso=$modeloPrivilegio->actualizarDatosPerfilStaff($datosParaActualizar)){
                        log_message('info','[ASIGNASTAFF|Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'actualizado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[ASIGNASTAFF|Async] Ocurrio un error al guardar los datos, notificando');
                        $swalMensajes=[
                            'title'=>'Error Servidor',
                            'button'=>'Ok',
                            'icon'=>'error',
                            'text'=>'Ocurro un error al guardar los datos.',
                            'estatus'=>'error',
                        ];
                        return json_encode($swalMensajes);
                    }
                }
            }else {
                log_message('info','[ASIGNASTAFF|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNASTAFF|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function eliminarAsignacionStaff($id)
    {
        log_message('info','[ASIGNASTAFF|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNASTAFF|Async] Verificando el método de envio para GUARDAR');
            if($this->request->getMethod('POST')){
                log_message('info','[ASIGNASTAFF|Async] Metodo envio reconocido continua proceso');
                log_message('info','[ASIGNASTAFF|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaEliminar=[
                    $captura = session()->get('IDUSUA_CLIEN'),
                    $textUsuario = $id,
                ];
                $modeloPrivilegio = new Mprivilegios;
                if($modeloPrivilegio->eliminarDatosAsignacionStaff($datosParaEliminar)){
                    log_message('info','[ASIGNASTAFF|Async] Los registros se eliminaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se eliminaron correctamente.',
                        'estatus'=>'eliminado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[ASIGNASTAFF|Async] Ocurrio un error al guardar los datos, notificando');
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'error',
                        'text'=>'Ocurro un error al eliminar los datos.',
                        'estatus'=>'error',
                    ];
                    echo json_encode($swalMensajes);
                }
            }else {
                log_message('info','[ASIGNASTAFF|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNASTAFF|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }

    }


    public function asigusuario()
    {
        log_message('info','[ASIGNAUSER] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            $id = __FUNCTION__;
            $respuesta=$this->llamandoParametrosWeb($id);
            $cadena=array(
                'titulo'=>$respuesta['TITULO_CONW'].' | SAPT',
                'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
                'robots'=>$respuesta['ROBOTS_CONW'],
                'Keyword'=>$respuesta['KEYWORD_CONW'],
                'descripcion'=>$respuesta['DESCRIPCION_CONW'],
                'pantalla'=>$id,
                'sesionIniciada'=>session(),
            );
            $sesionIniciada=session();
            $log_extra=[
                'user'=>$sesionIniciada->get('IDUSUA_RESPO'),
                'grupo'=>$sesionIniciada->get('NIVELPERF_RESPO'),
            ];
            log_message('info','[ASIGNAUSER] La sesión aun es vigente se comprobando privileios');
            if($sesionIniciada->get('NIVELPERF_RESPO')=='USUARIO'){
                log_message('notice','[ASIGNAUSER] Se encontro una sesión de {grupo} de {user} redireccionando a dashboard.',$log_extra);
                redirect()->to('/dashboard');
            }else {
                log_message('info','[ASIGNAUSER] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
                return view('Plantilla/vHeader',$cadena).view('Sistema/Privilegios/vAsignaUsuario').view('Plantilla/vFooter');
            }
        }else {
            log_message('info','[ASIGNAUSER] La sesión ha caducado o no existe');
            return redirect()->to('/expiro');
        }
    }

    public function llenarTablaPerfilUsuario()
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[ASIGNAUSER|Async] Solicitando datos para renderizado de tabla perfil usuario');
        if($tablaDatos = $modeloPrivilegios->llenarDatosTablaPerfilUsuario()){
            log_message('info','[ASIGNAUSER|Async] Envio de datos para renderizado de tabla perfil usuario');
            return $tablaDatos;
        }

    }

    public function llenarComboPerfilesDatos()
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[ASIGNAUSER|Async] Solicitando datos para renderizado de combo perfiles');
        if($tablaDatos = $modeloPrivilegios->llenarDatosComboPerfilesDatos()){
            log_message('info','[ASIGNAUSER|Async] Envio de datos para renderizado de combo perfiles');
            return $tablaDatos;
        }

    }

    public function llenarComboUsuariosDatos()
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[ASIGNAUSER|Async] Solicitando datos para renderizado de combo usuario');
        if($tablaDatos = $modeloPrivilegios->llenarDatosComboUsuariosDatos()){
            log_message('info','[ASIGNAUSER|Async] Envio de datos para renderizado de combo usuario');
            return $tablaDatos;
        }

    }

    public function llenarMenuPerfil($id)
    {
        $modeloPrivilegios = new Mprivilegios;
        log_message('info','[ASIGNAUSER|Async] Solicitando datos para renderizado de combo usuario');
        if($tablaDatos = $modeloPrivilegios->llenarDatosMenuPerfil($id)){
            log_message('info','[ASIGNAUSER|Async] Envio de datos para renderizado de combo usuario');
            return json_encode($tablaDatos);
        }

    }

    public function datosGuardarAsignacion()
    {
        log_message('info','[ASIGNAUSER|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNAUSER|Async] Verificando el método de envio para GUARDAR');
            if($this->request->getMethod('POST')){
                log_message('info','[ASIGNAUSER|Async] Metodo envio reconocido continua proceso GUARDAR');
                $reglasValidacion = $this->validate([
                    'textPerfil'=>[
                        'label'=>'Perfil',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textUsuario'=>[
                        'label'=>'Usuario',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                ]);
                log_message('info','[ASIGNAUSER|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDUSUA_RESPO'),
                    $textPerfil = $this->request->getPost('textPerfil'),
                    $textUsuario = $this->request->getPost('textUsuario'),
                ];
                $log_extra=[
                    'user'=>session()->get('IDUSUA_RESPO'),
                    'item'=>$this->request->getPost('textPerfil'),
                    'itema'=>$this->request->getPost('textUsuario'),
                ];
                log_message('notice','[ASIGNAUSER|Async] {user} esta asignando perfil {item} a {itema}.', $log_extra);
                log_message('info','[ASIGNAUSER|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[ASIGNAUSER|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[ASIGNAUSER|Async] Reglas de validacion aceptadas');
                    $modeloPrivilegio = new Mprivilegios;
                    log_message('info','[ASIGNAUSER|Async] Enviando datos para verificar duplicidad');
                    if($datosDuplicados=$modeloPrivilegio->buscarDuplicadosAsignacion($datosParaGuardar)){
                        log_message('info','[ASIGNAUSER|Async] Retorno de datos duplicados esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[ASIGNAUSER|Async] No se detecto registros duplicados.');
                        if($retorno=$modeloPrivilegio->guardarAsignacion($datosParaGuardar)){
                            log_message('info','[ASIGNAUSER|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            echo json_encode($swalMensajes);
                        }else {
                            log_message('info','[ASIGNAUSER|Async] Ocurrio un error al guardar los datos, notificando');
                            $swalMensajes=[
                                'title'=>'Error Servidor',
                                'button'=>'Ok',
                                'icon'=>'error',
                                'text'=>'Ocurro un error al guardar los datos.',
                                'estatus'=>'error',
                            ];
                            return json_encode($swalMensajes);
                        }
                    }
                }
            }else {
                log_message('info','[ASIGNAUSER|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNAUSER|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function buscarEditarAsignacion($id)
    {
        log_message('info','[ASIGNAUSER|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNAUSER|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                $modeloPrivilegio = new Mprivilegios;
                $datosParaBuscar=[
                    $captura = session()->get('IDUSUA_RESPO'),
                    $idRegistro = $id,
                ];
                log_message('info','[ASIGNAUSER|Async] Solicitando datos para renderizado de edición Asignado');
                if($datosEditar=$modeloPrivilegio->buscarDatosAsignacion($datosParaBuscar)){
                    log_message('info','[ASIGNAUSER|Async] Envio de datos para renderizado de inputs Asignado');
                    return $datosEditar;
                }else {
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'warning',
                        'text'=>'No se encontraron datos que mostrar.',
                        'estatus'=>'error',
                    ];
                    return json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[ASIGNAUSER|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNAUSER|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function datosActualizarAsignacion()
    {
        log_message('info','[ASIGNAUSER|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNAUSER|Async] Verificando el método de envio para GUARDAR');
            if($this->request->getMethod('POST')){
                log_message('info','[ASIGNAUSER|Async] Metodo envio reconocido continua proceso para actualizar');
                $reglasValidacion = $this->validate([
                    'textPerfil'=>[
                        'label'=>'Perfil',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textUsuario'=>[
                        'label'=>'Usuario',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'menuRoles'=>[
                        'label'=>'Roles',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                ]);
                log_message('info','[ASIGNAUSER|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaActualizar=[
                    $captura = session()->get('IDUSUA_RESPO'),
                    $textPerfil = $this->request->getPost('textPerfil'),
                    $textUsuario = $this->request->getPost('textUsuario'),
                    $menuRoles = $this->request->getPost('menuRoles[]'),
                ];
                log_message('info','[ASIGNAUSER|Async] Inicializando reglas de validación.');
                if(!$reglasValidacion){
                    log_message('info','[ASIGNAUSER|Async] Las reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    echo json_encode($swalMensajes);
                }else{
                    log_message('info','[ASIGNAUSER|Async] Reglas de validacion aceptadas');
                    $modeloPrivilegio = new Mprivilegios;
                    log_message('info','[ASIGNAUSER|Async] Enviando datos para la actualización');
                    if($respuestaAviso=$modeloPrivilegio->actualizarPerfiles($datosParaActualizar)){
                        log_message('info','[ASIGNAUSER|Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[ASIGNAUSER|Async] Ocurrio un error al guardar los datos, notificando');
                        $swalMensajes=[
                            'title'=>'Error Servidor',
                            'button'=>'Ok',
                            'icon'=>'error',
                            'text'=>'Ocurro un error al guardar los datos.',
                            'estatus'=>'error',
                        ];
                        echo json_encode($swalMensajes);
                    }
                }
            }else {
                log_message('info','[ASIGNAUSER|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNAUSER|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function datosEliminarAsignacion($id)
    {
        log_message('info','[ASIGNAUSER|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[ASIGNAUSER|Async] Verificando el método de envio para GUARDAR');
            if($this->request->getMethod('POST')){
                log_message('info','[ASIGNAUSER|Async] Metodo envio reconocido continua proceso');
                log_message('info','[ASIGNAUSER|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaEliminar=[
                    $captura = session()->get('IDUSUA_RESPO'),
                    $textUsuario = $id,
                ];
                $modeloPrivilegio = new Mprivilegios;
                if($modeloPrivilegio->eliminarAsignacion($datosParaEliminar)){
                    log_message('info','[ASIGNAUSER|Async] Los registros se eliminaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se eliminaron correctamente.',
                        'estatus'=>'eliminado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[ASIGNAUSER|Async] Ocurrio un error al guardar los datos, notificando');
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'error',
                        'text'=>'Ocurro un error al eliminar los datos.',
                        'estatus'=>'error',
                    ];
                    echo json_encode($swalMensajes);
                }
            }else {
                log_message('info','[ASIGNAUSER|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'No se reconoce metodo de envio.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[ASIGNAUSER|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }

    }


    public function llenarComboPerfilesStaff()
    {
        log_message('info','[PRIVILEGIOS|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            $modeloPrivilegios = new Mprivilegios;
            $datosBusqueda=[
                $idStaff=session()->get('IDUSUA_CLIEN'),
            ];
            log_message('info','[PRIVILEGIOS|Async] Solicitando datos para renderizado de combo perfiles staff');
            if($tablaDatos = $modeloPrivilegios->llenarDatosComboPerfilesStaff($datosBusqueda)){
                log_message('info','[PRIVILEGIOS|Async] Envio de datos para renderizado de combo perfiles staff');
                return json_encode($tablaDatos);
            }else{
                log_message('info','[PRIVILEGIOS|Async] Ocurrio un error al hacer la consulta de datos');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Entendido',
                    'icon'=>'error',
                    'text'=>'Ocurrió un error al consultar los datos',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);

            }

        }else {
            log_message('info','[PRIVILEGIOS|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function llenarComboStaff()
    {
        log_message('info','[PRIVILEGIOS|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            $modeloPrivilegios = new Mprivilegios;
            log_message('info','[PRIVILEGIOS|Async] Solicitando datos para renderizado de combo staff');
            if($tablaDatos = $modeloPrivilegios->llenarDatosComboStaff()){
                log_message('info','[PRIVILEGIOS|Async] Envio de datos para renderizado de combo staff');
                return json_encode($tablaDatos);
            }else{
                log_message('info','[PRIVILEGIOS|Async] Ocurrio un error al hacer la consulta de datos');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Entendido',
                    'icon'=>'error',
                    'text'=>'Ocurrió un error al consultar los datos',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);

            }

        }else {
            log_message('info','[PRIVILEGIOS|Async] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'Sesión ha terminado',
                'estatus'=>'nosesion',
            ];

            return json_encode($swalMensajes);
        }

    }





}


?>
