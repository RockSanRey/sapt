<?php

namespace App\Controllers\Administrador;
use App\Models\Administrador\Macomite;
use App\Controllers\BaseController;

class Comite extends BaseController
{
    protected $modeloComite;

    function __construct()
    {
        $this->modeloComite = new Macomite;
    }

    public function llamandoParametrosWeb($id)
    {
        log_message('info','[ACOMITE] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $this->modeloComite->llamandoDatosParametrosWeb($id)){
            log_message('info','[ACOMITE] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function acreaasamble()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'acreaasamble',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CREAASAMBLEA] Cargando modulo creaasamble para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Comite/vCreaAsamble').view('Plantilla/vFooter');        
    }

    public function llenarTablaAsambleas()
    {
        log_message('info','[CREAASAMBLEA|Async] Solicitando datos para renderizado de asambleas');
        if($tablaDatos = $this->modeloComite->llenarDatosTablaAsambleas()){
            log_message('info','[CREAASAMBLEA|Async] Envio de datos para renderizado de asambleas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREAASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function guardarAsambleaNueva()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[CREAASAMBLEA|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[CREAASAMBLEA|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textCodigo'=>[
                    'label'=>'Código',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textDescripcion'=>[
                    'label'=>'Descripćión',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textTipo'=>[
                    'label'=>'Tipo',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textFecha'=>[
                    'label'=>'Fecha',
                    'rules'=>'required|max_length[15]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textHora'=>[
                    'label'=>'Hora',
                    'rules'=>'required|max_length[15]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
            ]);
            log_message('info','[CREAASAMBLEA|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCodigo = $this->request->getPost('textCodigo'),
                $textDescripcion = $this->request->getPost('textDescripcion'),
                $textTipo = $this->request->getPost('textTipo'),
                $textFecha = $this->request->getPost('textFecha'),
                $textHora = $this->request->getPost('textHora'),
            ];
            log_message('notice','[CREAASAMBLEA|Async] {user} esta intentando crear código de asamblea.', $log_extra);
            log_message('info','[CREAASAMBLEA|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[CREAASAMBLEA|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[CREAASAMBLEA|Async] Reglas de validacion aceptadas');
                log_message('info','[CREAASAMBLEA|Async] Enviando datos verificar duplicidad');
                if($datosDuplicados=$this->modeloComite->buscarDuplicadosAsambleas($datosParaGuardar)){
                    log_message('info','[CREAASAMBLEA|Async] Retorno de datos esperando respuesta');
                    $swalMensajes=[
                        'title'=>'Advertencia',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'Existen registros con la misma clave, revise sus datos.',
                        'estatus'=>'duplicado',
                    ];
                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[CREAASAMBLEA|Async] No se detecto registros duplicados.');
                    if($this->modeloComite->guardarDatosAsambleaNueva($datosParaGuardar)){
                        log_message('info','[CREAASAMBLEA|Async] Los registros se grabaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Asambleas',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Se ha creado el código de asamblea.',
                            'estatus'=>'creado',
                        ];

                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CREAASAMBLEA|Async] Ocurrio un error al guardar los datos, notificando');
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
        }
        else {
            log_message('info','[CREAASAMBLEA|Async] Metodo envio no reconocido termina proceso');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error envio no reconocido.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function buscarEditarAsamblea($id)
    {
        log_message('info','[CREAASAMBLEA|Async] Solicitando datos para renderizado de asambleas');
        if($tablaDatos = $this->modeloComite->buscarDatosEditarAsamblea($id)){
            log_message('info','[CREAASAMBLEA|Async] Envio de datos para renderizado de asambleas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREAASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function actualizarAsamblea()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[CREAASAMBLEA|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[CREAASAMBLEA|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textCodigo'=>[
                    'label'=>'Código',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textDescripcion'=>[
                    'label'=>'Descripćión',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textTipo'=>[
                    'label'=>'Tipo',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textFecha'=>[
                    'label'=>'Fecha',
                    'rules'=>'required|max_length[15]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textHora'=>[
                    'label'=>'Hora',
                    'rules'=>'required|max_length[15]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
            ]);
            log_message('info','[CREAASAMBLEA|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCodigo = $this->request->getPost('textCodigo'),
                $textDescripcion = $this->request->getPost('textDescripcion'),
                $textTipo = $this->request->getPost('textTipo'),
                $textFecha = $this->request->getPost('textFecha'),
                $textHora = $this->request->getPost('textHora'),
            ];
            log_message('notice','[CREAASAMBLEA|Async] {user} esta intentando crear código de asamblea.', $log_extra);
            log_message('info','[CREAASAMBLEA|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[CREAASAMBLEA|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[CREAASAMBLEA|Async] Reglas de validacion aceptadas');
                log_message('info','[CREAASAMBLEA|Async] No se detecto registros duplicados.');
                if($this->modeloComite->actualizarDatosAsamblea($datosParaGuardar)){
                    log_message('info','[CREAASAMBLEA|Async] Los registros se grabaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Asambleas',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Se ha creado el código de asamblea.',
                        'estatus'=>'creado',
                    ];

                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[CREAASAMBLEA|Async] Ocurrio un error al guardar los datos, notificando');
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
        else {
            log_message('info','[CREAASAMBLEA|Async] Metodo envio no reconocido termina proceso');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error envio no reconocido.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function eliminarAsamblea($id)
    {
        log_message('info','[CREAASAMBLEA|Async] Solicitando datos para renderizado de asambleas');
        $datosParaEliminar=[
            $captura=session()->get('IDCLIENTE'),
            $codigo=$id,
        ];
        if($this->modeloComite->eliminarDatosAsamblea($datosParaEliminar)){
            log_message('info','[CREAASAMBLEA|Async] Envio de datos para renderizado de asambleas');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }else {
            log_message('info','[CREAASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }
    
    public function aconvasamble()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aconvasamble',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CONVASAMBLEA] Cargando modulo convasamble para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Comite/vConvAsamble').view('Plantilla/vFooter');        
    }

    public function llenarTablaConvocatorias()
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para renderizado de asambleas');
        if($tablaDatos = $this->modeloComite->llenarDatosTablaConvocatorias()){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para renderizado de asambleas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CONVASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function totalesUsuariosConvocados($id)
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para renderizado de total a convocar');
        if($tablaDatos = $this->modeloComite->totalesDatosUsuariosConvocados($id)){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para renderizado de total a convocar');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CONVASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function usuariosConvocados()
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para usuarios a convocar');
        if($tablaDatos = $this->modeloComite->usuariosDatosConvocados()){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para usuarios a convocar');
            $retorno=[
                $idCapturista=session()->get('IDCLIENTE'),
                $tablaDatos,
            ];
            return json_encode($retorno);
        }else {
            log_message('info','[CONVASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function creandoInvitacionUsuario()
    {
        log_message('info','[CREARRECARGO|Async] Creando variable para envio de datos a convocatoria.');
        $camposJson=json_decode($this->request->getBody());
        $datosModificar = [
            $idCapturista=$camposJson->capturista,
            $idUsuario=$camposJson->idUsuario,
            $asamblea=$camposJson->asamblea,
        ];
        if($tablaDatos=$this->modeloComite->creandoDatosInvitacionUsuario($datosModificar)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREARRECARGO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function consultarAsambleaConvocada($id)
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para renderizado de convocados');
        if($tablaDatos = $this->modeloComite->consultarDatosAsambleaConvocada($id)){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para renderizado de convocados');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CONVASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function cerrarAsambleaConvocada($id)
    {
        log_message('info','[CONVASAMBLEA|Async] Enviando datos para cerrar convocatoria de asamblea');
        $datosAsistencia = [
            $idCapturista=session()->get('IDCLIENTE'),
            $idUsuario=$id,
        ];
        if($this->modeloComite->cerrarDatosAsambleaConvocada($datosAsistencia)){
            log_message('info','[CONVASAMBLEA|Async] Convocatoria se ha cerrado, notificando.');
            $swalMensajes=[
                'title'=>'Asamblea',
                'button'=>'Ok',
                'icon'=>'success',
                'text'=>'Esta asamblea se ha cerrado y aplicado las falta correspondientes.',
                'estatus'=>'cerrado',
            ];
            return json_encode($swalMensajes);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos.',
                'estatus'=>'error',
            ];
            return json_encode($swalMensajes);

        }

    }

    public function informeAsambleaAsistencias($id)
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para renderizado asistencias asamblea');
        if($tablaDatos = $this->modeloComite->informeDatosAsambleaAsistencias($id)){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para renderizado asistencias asamblea');
            return json_encode($tablaDatos);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos.',
                'estatus'=>'error',
            ];
            return json_encode($swalMensajes);

        }

    }

    public function usuariosFaltantes($id)
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para renderizado usuario sancion');
        if($tablaDatos = $this->modeloComite->usuariosDatosFaltantes($id)){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para renderizado usuario sancion');
            $datosCompilado=[
                $id=session()->get('IDCLIENTE'),
                $tablaDatos,
            ];
            return json_encode($datosCompilado);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos.',
                'estatus'=>'error',
            ];
            return json_encode($swalMensajes);

        }

    }

    public function aplicandoSanciones()
    {
        log_message('info','[CONVASAMBLEA|Async] Creando variable para envio de datos a convocatoria.');
        $camposJson=json_decode($this->request->getBody());
        $datosModificar = [
            $idCapturista=$camposJson->capturista,
            $idUsuario=$camposJson->idUsuario,
            $asamblea=$camposJson->asamblea,
        ];
        if($tablaDatos=$this->modeloComite->aplicandoDatosSanciones($datosModificar)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CONVASAMBLEA|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }
 
    public function mostrarResumenAsamblea($id)
    {
        log_message('info','[CONVASAMBLEA|Async] Solicitando datos para renderizado resumen asamblea');
        if($tablaDatos = $this->modeloComite->mostrarDatosResumenAsamblea($id)){
            log_message('info','[CONVASAMBLEA|Async] Envio de datos para renderizado resumen asamblea');
            $datosCompilado=[
                $id=session()->get('IDCLIENTE'),
                $tablaDatos,
            ];
            return json_encode($datosCompilado);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos.',
                'estatus'=>'error',
            ];
            return json_encode($swalMensajes);

        }

    }

    public function asisasamblea()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'asisasamblea',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[ASISASAMBLEA] Cargando modulo asisasamble para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Comite/vAsisAsamble').view('Plantilla/vFooter');        
    }

    public function llenarComboAsambleas()
    {
        log_message('info','[ASISASAMBLEA|Async] Solicitando datos para renderizado de combo Asambleas');
        if($tablaDatos = $this->modeloComite->llenarDatosComboAsambleas()){
            log_message('info','[ASISASAMBLEA|Async] Envio de datos para renderizado de combo Asambleas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ASISASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function autoCompletarUsuario($id)
    {
        if($tablaDatos = $this->modeloComite->autoDatosCompletarUsuario($id)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ASISASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function marcarAsistencia($id)
    {
        log_message('info','[ASISASAMBLEA|Async] Envio de datos para asistencia de asamblea');
        $datosAsistencia=[
            $captura=session()->get('IDCLIENTE'),
            $codigo=$id,
        ];
        if($tablaDatos = $this->modeloComite->marcarDatosAsistencia($datosAsistencia)){
            log_message('info','[ASISASAMBLEA|Async] Se ha marcado la asistencia de asamblea, notificando');
            $swalMensajes=[
                'title'=>'Asistencia',
                'button'=>'Ok',
                'icon'=>'success',
                'text'=>'Se ha marcado la asistencia de '.$tablaDatos[0]->NOMBRE,
                'estatus'=>'asistencia',
            ];
            return json_encode($swalMensajes);
    }else {
            log_message('info','[ASISASAMBLEA|Async] Ocurrio un error al consultar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }








}