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

    public function regiscomite()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[REGCOMITE] Cargando modulo regiscomite para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Comite/vRegisComite').view('Plantilla/vFooter');        
    }

    public function llenarTablaComite()
    {
        log_message('info','[REGCOMITE|Async] Solicitando datos para renderizado de tabla comite');
        if($tablaDatos = $this->modeloComite->llenarDatosTablaComite()){
            log_message('info','[REGCOMITE|Async] Envio de datos para renderizado de tabla comite');
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

    public function guardarComiteNuevo()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[REGCOMITE|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[REGCOMITE|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textNombre'=>[
                    'label'=>'Nombre',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textApaterno'=>[
                    'label'=>'A. Paterno',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textAmaterno'=>[
                    'label'=>'A. Materno',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textNacimiento'=>[
                    'label'=>'F. Nacimiento',
                    'rules'=>'max_length[15]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textSexo'=>[
                    'label'=>'Sexo',
                    'rules'=>'max_length[15]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textTelefono'=>[
                    'label'=>'Telefono',
                    'rules'=>'max_length[15]',
                    'errors'=>[
                        'numeric'=>'{field} solo números.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textMovil'=>[
                    'label'=>'Movil',
                    'rules'=>'max_length[15]',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textEmail'=>[
                    'label'=>'Email',
                    'rules'=>'max_length[250]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textEstado'=>[
                    'label'=>'Estado',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textMunicipio'=>[
                    'label'=>'Municipio',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textCodiPostal'=>[
                    'label'=>'C.P.',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textColonia'=>[
                    'label'=>'Colonia',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textCalle'=>[
                    'label'=>'Calle',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textNexter'=>[
                    'label'=>'N. Ext.',
                    'rules'=>'required|min_length[1]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textNinter'=>[
                    'label'=>'N. Int.',
                    'rules'=>'max_length[40]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textReferen'=>[
                    'label'=>'Referencia',
                    'rules'=>'max_length[80]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textPuesto'=>[
                    'label'=>'Puesto',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
            ]);
            log_message('info','[REGCOMITE|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textNombre = $this->request->getPost('textNombre'),
                $textApaterno = $this->request->getPost('textApaterno'),
                $textAmaterno = $this->request->getPost('textAmaterno'),
                $textNacimiento = $this->request->getPost('textNacimiento'),
                $textSexo = $this->request->getPost('textSexo'),
                $textTelefono = $this->request->getPost('textTelefono'),
                $textMovil = $this->request->getPost('textMovil'),
                $textEmail = $this->request->getPost('textEmail'),
                $textEstado = $this->request->getPost('textEstado'),
                $textMunicipio = $this->request->getPost('textMunicipio'),
                $textCodiPostal = $this->request->getPost('textCodiPostal'),
                $textColonia = $this->request->getPost('textColonia'),
                $textCalle = $this->request->getPost('textCalle'),
                $textNexter = $this->request->getPost('textNexter'),
                $textNinter = $this->request->getPost('textNinter'),
                $textReferen = $this->request->getPost('textReferen'),
                $textPuesto = $this->request->getPost('textPuesto'),
            ];
            log_message('notice','[REGCOMITE|Async] {user} esta intentando grabar registros en comite.', $log_extra);
            log_message('info','[REGCOMITE|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[REGCOMITE|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[REGCOMITE|Async] Reglas de validacion aceptadas');
                log_message('info','[REGCOMITE|Async] Enviando datos verificar duplicidad');
                if($datosDuplicados=$this->modeloComite->buscarDuplicadosComite($datosParaGuardar)){
                    log_message('info','[REGCOMITE|Async] Retorno de datos esperando respuesta');
                    $swalMensajes=[
                        'title'=>'Duplicados',
                        'button'=>'Ok',
                        'icon'=>'warning',
                        'text'=>'Los datos enviados ya existen en el sistema, revisar.',
                        'estatus'=>'duplicado',
                    ];
                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[REGCOMITE|Async] No se detecto registros duplicados.');
                    if($this->modeloComite->guardarDatosComiteNuevo($datosParaGuardar)){
                        log_message('info','[REGCOMITE|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                        $swalMensajes=[
                            'title'=>'Guardado',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los datos se han guardado correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);

                    }else {
                        log_message('info','[REGCOMITE|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[REGCOMITE|Async] Metodo envio no reconocido termina proceso');
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

    public function buscarEditarComite($id)
    {
        log_message('info','[REGCOMITE|Async] Solicitando datos para renderizado de editar comite');
        if($tablaDatos = $this->modeloComite->buscarDatosEditarComite($id)){
            log_message('info','[REGCOMITE|Async] Envio de datos para renderizado de editar comite');
            return json_encode($tablaDatos);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los datos.',
                'estatus'=>'error',
            ];
            echo json_encode($swalMensajes);

        }

    }

    public function actualizarRegistroComite()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[REGCOMITE|Async] Verificando el método de envio para continuar proceso actualizar');
        if($this->request->getMethod('POST')){
            log_message('info','[REGCOMITE|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textNombre'=>[
                    'label'=>'Nombre',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textApaterno'=>[
                    'label'=>'A. Paterno',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textAmaterno'=>[
                    'label'=>'A. Materno',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textNacimiento'=>[
                    'label'=>'F. Nacimiento',
                    'rules'=>'max_length[15]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textSexo'=>[
                    'label'=>'Sexo',
                    'rules'=>'max_length[15]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textTelefono'=>[
                    'label'=>'Telefono',
                    'rules'=>'max_length[15]',
                    'errors'=>[
                        'numeric'=>'{field} solo números.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textMovil'=>[
                    'label'=>'Movil',
                    'rules'=>'max_length[15]',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textEmail'=>[
                    'label'=>'Email',
                    'rules'=>'max_length[250]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textUbicacion'=>[
                    'label'=>'Ubicación',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textEstado'=>[
                    'label'=>'Estado',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textMunicipio'=>[
                    'label'=>'Municipio',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textCodiPostal'=>[
                    'label'=>'C.P.',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textColonia'=>[
                    'label'=>'Colonia',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textCalle'=>[
                    'label'=>'Calle',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textNexter'=>[
                    'label'=>'N. Ext.',
                    'rules'=>'required|min_length[1]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textNinter'=>[
                    'label'=>'N. Int.',
                    'rules'=>'max_length[40]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textReferen'=>[
                    'label'=>'Referencia',
                    'rules'=>'max_length[80]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textPuesto'=>[
                    'label'=>'Puesto',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
            ]);
            log_message('info','[REGCOMITE|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCliente = $this->request->getPost('textCliente'),
                $textNombre = $this->request->getPost('textNombre'),
                $textApaterno = $this->request->getPost('textApaterno'),
                $textAmaterno = $this->request->getPost('textAmaterno'),
                $textNacimiento = $this->request->getPost('textNacimiento'),
                $textSexo = $this->request->getPost('textSexo'),
                $textTelefono = $this->request->getPost('textTelefono'),
                $textMovil = $this->request->getPost('textMovil'),
                $textEmail = $this->request->getPost('textEmail'),
                $textUbicacion = $this->request->getPost('textUbicacion'),
                $textEstado = $this->request->getPost('textEstado'),
                $textMunicipio = $this->request->getPost('textMunicipio'),
                $textCodiPostal = $this->request->getPost('textCodiPostal'),
                $textColonia = $this->request->getPost('textColonia'),
                $textCalle = $this->request->getPost('textCalle'),
                $textNexter = $this->request->getPost('textNexter'),
                $textNinter = $this->request->getPost('textNinter'),
                $textReferen = $this->request->getPost('textReferen'),
                $textPuesto = $this->request->getPost('textPuesto'),
            ];
            log_message('notice','[REGCOMITE|Async] {user} esta intentando actualizar registros en comite.', $log_extra);
            log_message('info','[REGCOMITE|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[REGCOMITE|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[REGCOMITE|Async] Reglas de validacion aceptadas');
                log_message('info','[REGCOMITE|Async] No se detecto registros duplicados.');
                if($this->modeloComite->actualizarDatosRegistroComite($datosParaGuardar)){
                    log_message('info','[REGCOMITE|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                    $swalMensajes=[
                        'title'=>'Guardado',
                        'button'=>'Ok',
                        'icon'=>'warning',
                        'text'=>'Los datos se han guardado correctamente.',
                        'estatus'=>'guardado',
                    ];
                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[REGCOMITE|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[REGCOMITE|Async] Metodo envio no reconocido termina proceso');
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

    public function eliminarRegistroComite($id)
    {
        log_message('info','[REGCOMITE|Async] Enviando datos para aplicar supreción de registros');
        if($this->modeloComite->eliminarDatosRegistroComite($id)){
            log_message('info','[REGCOMITE|Async] El proceso se ha completado correctamente, notificando');
            $swalMensajes=[
                'title'=>'Eliminado',
                'button'=>'Ok',
                'icon'=>'success',
                'text'=>'El registro se ha eliminado correctamente.',
                'estatus'=>'eliminado',
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

    public function enviarCorreoComiteCred($id)
    {
        log_message('info','[ACTIVASTAFF|Async] Solicitando datos de solicitud para llenado de mensaje.');
        if($datosMensajeMail = $this->modeloComite->buscarDatosCredencialesMail($id)){
            log_message('info','[ACTIVASTAFF|Async] Generando plantilla para llenado de mensaje.');
            $cadena=[
                'armadoMensaje'=> $datosMensajeMail,
            ];
            $mensajeMail = view('Sistema/Mailers/vMailCredencialStaff', $cadena);
            foreach ($datosMensajeMail as $filasCliente) {
                $correo=base64_decode($filasCliente['EMAIL_RESPO']);
            }
            log_message('info','[ACTIVASTAFF|Async] Seteando configuración para envio de correo.');
            $config['mailType']='html';
            $config['protocol']='smtp';
            $config['SMTPHost']='teltipanhgo.org.mx';
            $config['SMTPUser']='registro@teltipanhgo.org.mx';
            $config['SMTPPass']='IsRdPetggwXA2hI3';
            $config['SMTPPort']='465';
            $config['SMTPTimeout']='60';
            $config['SMTPCrypto'] = 'ssl';
            $config['charset']='utf-8';
            $config['newline']="\r\n";
            $config['crlf']="\r\n";
            $config['wordWrap'] = true;
            $config['validate']=true;

            log_message('info','[ACTIVASTAFF|Async] Inicializando servicio de envio de correo.');
            $email = \Config\Services::email();
            $email->initialize($config);
            $email->setFrom('registro@teltipanhgo.org.mx', 'Registro SAPT');
            // $email->setTo('rsanchezr@masotek.com.mx');
            $email->setTo($correo);
            $email->setreplyTo('comite@teltipanhgo.org.mx','Comite SAPT');
            $email->setSubject('Credenciales de acceso | SAPT');
            $email->setMessage($mensajeMail);

            if($email->send()){
                log_message('info','[REGISTROSTAFF|Async] Se envío el email correctalente.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Se envió el correo de credenciales de acceso al staff.',
                    'estatus'=>'enviado',
                ];
                return json_encode($swalMensajes);
            }else {
                var_dump($email->printDebugger());
                log_message('critical','[REGISTROSTAFF|Async] Ocurrio un error en la configuración.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Ocurrió un erro el enviar el correo vea los logs.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }

        }else{
            log_message('info','[REGISTROSTAFF|Async] No se encontraron resultados o ocurrio un error, notificando.');
            $swalMensajes=[
                'title'=>'No datos',
                'button'=>'Ok',
                'icon'=>'warning',
                'text'=>'No se encontraron registro o ocurrio un error.',
                'estatus'=>'nofound',
            ];
            return json_encode($swalMensajes);
        }
    }

    public function reaccomite()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[REACCOMITE] Cargando modulo reaccomite para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Comite/vReacComite').view('Plantilla/vFooter');        
    }

    public function autoCompletarStaffNombre($id)
    {
        log_message('info','[REACCOMITE|Async] Solicitando datos para renderizado de asambleas');
        if($tablaDatos = $this->modeloComite->autoDatosCompletarStaffNombre($id)){
            log_message('info','[REACCOMITE|Async] Envio de datos para renderizado de asambleas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REACCOMITE|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function tablaStaffReactivar($id)
    {
        log_message('info','[REACCOMITE|Async] Solicitando datos para renderizado de asambleas');
        if($tablaDatos = $this->modeloComite->tablaDatosStaffReactivar($id)){
            log_message('info','[REACCOMITE|Async] Envio de datos para renderizado de asambleas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REACCOMITE|Async] Ocurrio un error al consultar los datos, notificando');
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
                'title'=>'Eliminado',
                'button'=>'Ok',
                'icon'=>'success',
                'text'=>'El registro se ha eliminado correctamente.',
                'estatus'=>'eliminado',
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