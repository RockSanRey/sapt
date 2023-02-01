<?php

namespace App\Controllers\Administrador;
use App\Models\Administrador\Matramites;
use App\Controllers\BaseController;

/**
 *
 */
class Tramites extends BaseController
{

    protected $modeloTramites;

    function __construct()
    {
        $this->modeloTramites = new Matramites;
    }

    public function llamandoParametrosWeb($id)
    {
        log_message('info','[ATRAMITES] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $this->modeloTramites->llamandoDatosParametrosWeb($id)){
            log_message('info','[ATRAMITES] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function aregusuarios()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[REGUSUARIOS] Cargando modulo regusuario para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vRegUsuarios').view('Plantilla/vFooter');
    }

    public function llenarTablaUsuariosContratosMes()
    {
        log_message('info','[REGUSUARIOS|Async] Solicitando datos para renderizado de tabla usuarios contratos');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaUsuariosContratosMes()){
            log_message('info','[REGUSUARIOS|Async] Envio de datos para renderizado de tabla usuarios contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REGUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function guardarUsuarioNuevo()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[REGUSUARIOS|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[REGUSUARIOS|Async] Metodo envio reconocido continua proceso guardar');
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
            ]);
            log_message('info','[REGUSUARIOS|Async] Creando variables con arreglo de los campos del formulario');
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
            ];
            log_message('notice','[REGUSUARIOS|Async] {user} esta intentando grabar registros en usuarios.', $log_extra);
            log_message('info','[REGUSUARIOS|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[REGUSUARIOS|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[REGUSUARIOS|Async] Reglas de validacion aceptadas');
                log_message('info','[REGUSUARIOS|Async] Enviando datos verificar duplicidad');
                if($datosDuplicados=$this->modeloTramites->buscarDuplicadosUsuarios($datosParaGuardar)){
                    log_message('info','[REGUSUARIOS|Async] Retorno de datos esperando respuesta');
                    $swalMensajes=[
                        'title'=>'Advertencia',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'Existen registros con la misma clave, revise sus datos.',
                        'estatus'=>'duplicado',
                    ];
                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[REGUSUARIOS|Async] No se detecto registros duplicados.');
                    if($retorno=$this->modeloTramites->guardarDatosUsuarioNuevo($datosParaGuardar)){
                        log_message('info','[REGUSUARIOS|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                        return json_encode($retorno);
                    }else {
                        log_message('info','[REGUSUARIOS|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[REGUSUARIOS|Async] Metodo envio no reconocido termina proceso');
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

    public function asignarContratoUsuario()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[REGUSUARIOS|Async] Verificando el método de envio para continuar proceso asignacion');
        if($this->request->getMethod('POST')){
            log_message('info','[REGUSUARIOS|Async] Metodo envio reconocido continua proceso asignacion');
            log_message('info','[REGUSUARIOS|Async] Creando variables con arreglo de los campos del formulario');
            $camposJson=json_decode($this->request->getBody());
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCliente = $camposJson->textCliente,
                $textUbicacion = $camposJson->textUbicacion,
                $textTipoContrato = $camposJson->textTipoContrato,
                $textPermisos = $camposJson->textPermisos,
                $textDescuento = $camposJson->textDescuento,
                $textExpContrato = $camposJson->textExpContrato,
                $textComentarios = $camposJson->textComentarios,
            ];
            log_message('notice','[REGUSUARIOS|Async] {user} esta intentando asignar contrato a usuario.', $log_extra);
            if($this->modeloTramites->asignarDatosContratoUsuario($datosParaGuardar)){
                log_message('info','[REGUSUARIOS|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                $swalMensajes=[
                    'title'=>'Asignado',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'El contrato se ha generado y se ha registrado al usuario.',
                    'estatus'=>'guardado',
                ];

                return json_encode($swalMensajes);

            }else {
                log_message('info','[REGUSUARIOS|Async] Ocurrio un error al guardar los datos, notificando');
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
        else {
            log_message('info','[REGUSUARIOS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function cargarContratosUsuarios($id)
    {
        log_message('info','[REGUSUARIOS|Async] Solicitando datos para renderizado de modificar usuarios');
        if($tablaDatos = $this->modeloTramites->cargarDatosContratosUsuarios($id)){
            log_message('info','[REGUSUARIOS|Async] Envio de datos para renderizado de modificar usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REGUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function actualizarRegistroUsuario()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[REGUSUARIOS|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[REGUSUARIOS|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textUbicacion'=>[
                    'label'=>'Ubicacion',
                    'rules'=>'required|min_length[3]|max_length[45]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
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
                'textNacimiento'=>[
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
            ]);
            log_message('info','[REGUSUARIOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCliente = $this->request->getPost('textCliente'),
                $textUbicacion = $this->request->getPost('textUbicacion'),
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
            ];
            log_message('notice','[REGUSUARIOS|Async] {user} esta intentando grabar registros en usuarios.', $log_extra);
            log_message('info','[REGUSUARIOS|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[REGUSUARIOS|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[REGUSUARIOS|Async] Reglas de validacion aceptadas');
                if($this->modeloTramites->actualizarDatosRegistroUsuario($datosParaGuardar)){
                    log_message('info','[REGUSUARIOS|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                    $swalMensajes=[
                        'title'=>'Actualizado',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Se actualizó el registro correctamente',
                        'estatus'=>'actualizado',
                    ];

                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[REGUSUARIOS|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[REGUSUARIOS|Async] Metodo envio no reconocido termina proceso');
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

    public function amodusuarios()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[MODUSUARIOS] Cargando modulo modusuario para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vModUsuarios').view('Plantilla/vFooter');
    }

    public function llenarTablaUsuarioModificar($id)
    {
        log_message('info','[MODUSUARIOS|Async] Solicitando datos para renderizado de tabla usuarios');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaUsuarioModificar($id)){
            log_message('info','[MODUSUARIOS|Async] Envio de datos para renderizado de tabla usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[MODUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function cargarUsuarioModificar($id)
    {
        log_message('info','[MODUSUARIOS|Async] Solicitando datos para renderizado de usuario modificar');
        if($tablaDatos = $this->modeloTramites->cargarDatosUsuarioModificar($id)){
            log_message('info','[MODUSUARIOS|Async] Envio de datos para renderizado de usuario modificar');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[MODUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function actualizarUsuarioInformacion()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[MODUSUARIOS|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[MODUSUARIOS|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
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
                'textNacimiento'=>[
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
            ]);
            log_message('info','[MODUSUARIOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCliente = $this->request->getPost('textCliente'),
                $textUbicacion = $this->request->getPost('textUbicacion'),
                $textNombre = $this->request->getPost('textNombre'),
                $textApaterno = $this->request->getPost('textApaterno'),
                $textAmaterno = $this->request->getPost('textAmaterno'),
                $textNacimiento = $this->request->getPost('textNacimiento'),
                $textSexo = $this->request->getPost('textSexo'),
                $textTelefono = $this->request->getPost('textTelefono'),
                $textMovil = $this->request->getPost('textMovil'),
                $textEmail = $this->request->getPost('textEmail'),
            ];
            log_message('notice','[MODUSUARIOS|Async] {user} esta intentando grabar registros en usuarios.', $log_extra);
            log_message('info','[MODUSUARIOS|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[MODUSUARIOS|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[MODUSUARIOS|Async] Reglas de validacion aceptadas');
                if($this->modeloTramites->actualizarDatosUsuarioInformacion($datosParaGuardar)){
                    log_message('info','[MODUSUARIOS|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                    $swalMensajes=[
                        'title'=>'Actualizado',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Se actualizó el registro correctamente',
                        'estatus'=>'actualizado',
                    ];

                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[MODUSUARIOS|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[MODUSUARIOS|Async] Metodo envio no reconocido termina proceso');
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

    public function aagrcontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AGRCONTRATO] Cargando modulo aagrcontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vAgrContrato').view('Plantilla/vFooter');
    }

    public function llenarTablaUsuariosAsignado($id)
    {
        log_message('info','[AGRCONTRATO|Async] Solicitando datos para renderizado de tabla usuarios');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaUsuariosAsignado($id)){
            log_message('info','[AGRCONTRATO|Async] Envio de datos para renderizado de tabla usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AGRCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function cargaUsuarioAsignar($id)
    {
        log_message('info','[AGRCONTRATO|Async] Solicitando datos para usuarios agregar contrato');
        if($tablaDatos = $this->modeloTramites->cargaDatosUsuarioAsignar($id)){
            log_message('info','[AGRCONTRATO|Async] Envio de datos para usuarios agregar contrato');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AGRCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function asignarNuevoContrato()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[AGRCONTRATO|Async] Verificando el método de envio para continuar proceso asignacion');
        if($this->request->getMethod('POST')){
            log_message('info','[AGRCONTRATO|Async] Metodo envio reconocido continua proceso asignacion');
            log_message('info','[AGRCONTRATO|Async] Creando variables con arreglo de los campos del formulario');
            $camposJson=json_decode($this->request->getBody());
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textIdUsuario = $camposJson->textIdUsuario,
                $textEstado = $camposJson->textEstado,
                $textMunicipio = $camposJson->textMunicipio,
                $textCodiPostal = $camposJson->textCodiPostal,
                $textColonia = $camposJson->textColonia,
                $textCalle = $camposJson->textCalle,
                $textNexter = $camposJson->textNexter,
                $textNinter = $camposJson->textNinter,
                $textReferen = $camposJson->textReferen,
                $textTipoContrato = $camposJson->textTipoContrato,
                $textExpContrato = $camposJson->textExpContrato,
                $textDescuento = $camposJson->textDescuento,
                $textPermisos = $camposJson->textPermisos,
                $textComentarios = $camposJson->textComentarios,
            ];
            log_message('notice','[AGRCONTRATO|Async] {user} esta intentando asignar contrato a usuario.', $log_extra);
            if($tablaDatos=$this->modeloTramites->asignarDatosNuevoContrato($datosParaGuardar)){
                log_message('info','[AGRCONTRATO|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                return json_encode($tablaDatos);

            }else {
                log_message('info','[AGRCONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
        else {
            log_message('info','[AGRCONTRATO|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function cargarUsuarioContratos($id)
    {
        log_message('info','[AGRCONTRATO|Async] Solicitando datos para usuarios agregar contrato');
        if($tablaDatos = $this->modeloTramites->cargarDatosUsuarioContratos($id)){
            log_message('info','[AGRCONTRATO|Async] Envio de datos para usuarios agregar contrato');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AGRCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function amodcontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[MODCONTRATO] Cargando modulo amodcontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vModContrato').view('Plantilla/vFooter');
    }

    public function llenarTablaContratoModificar($id)
    {
        log_message('info','[MODCONTRATO|Async] Solicitando datos para renderizado de tabla contrato');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaContratoModificar($id)){
            log_message('info','[MODCONTRATO|Async] Envio de datos para renderizado de tabla contrato');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[MODCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function actualizarContratoDetalle()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[MODCONTRATO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[MODCONTRATO|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textIdCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textIdContrato'=>[
                    'label'=>'Contrato',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textTipoContrato'=>[
                    'label'=>'Tipo',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textExpContrato'=>[
                    'label'=>'Exp Contrato',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textPermisos'=>[
                    'label'=>'Permiso',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textDescuento'=>[
                    'label'=>'Tarifa',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textComentarios'=>[
                    'label'=>'Comentarios',
                    'rules'=>'max_length[400]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
            ]);
            log_message('info','[MODCONTRATO|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textIdCliente = $this->request->getPost('textIdCliente'),
                $textIdContrato = $this->request->getPost('textIdContrato'),
                $textTipoContrato = $this->request->getPost('textTipoContrato'),
                $textExpContrato = $this->request->getPost('textExpContrato'),
                $textPermisos = $this->request->getPost('textPermisos'),
                $textDescuento = $this->request->getPost('textDescuento'),
                $textComentarios = $this->request->getPost('textComentarios'),
            ];
            log_message('notice','[MODCONTRATO|Async] {user} esta intentando modificar registros en contratos.', $log_extra);
            log_message('info','[MODCONTRATO|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[MODCONTRATO|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[MODCONTRATO|Async] Reglas de validacion aceptadas');
                if($this->modeloTramites->actualizarDatosContratoDetalle($datosParaGuardar)){
                    log_message('info','[MODCONTRATO|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                    $swalMensajes=[
                        'title'=>'Actualizado',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Se actualizó el registro correctamente',
                        'estatus'=>'actualizado',
                    ];

                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[MODCONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[MODCONTRATO|Async] Metodo envio no reconocido termina proceso');
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

    public function atracontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[TRACONTRATO] Cargando modulo atracontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vTraContrato').view('Plantilla/vFooter');
    }

    public function llenarTablaContratoTransferir($id)
    {
        log_message('info','[TRACONTRATO|Async] Solicitando datos para renderizado de contrato transferir');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaContratoTransferir($id)){
            log_message('info','[TRACONTRATO|Async] Envio de datos para renderizado de contrato transferir');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[TRACONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function llenarUbicacionContrato($id)
    {
        log_message('info','[TRACONTRATO|Async] Solicitando datos para renderizado de contrato ubicacion');
        if($tablaDatos = $this->modeloTramites->llenarDatosUbicacionContrato($id)){
            log_message('info','[TRACONTRATO|Async] Envio de datos para renderizado de contrato ubicacion');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[TRACONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function guardarUsuarioTransferir()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[TRACONTRATO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[TRACONTRATO|Async] Metodo envio reconocido continua proceso guardar');
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
                'textIdCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
            ]);
            log_message('info','[TRACONTRATO|Async] Creando variables con arreglo de los campos del formulario');
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
                $textIdCliente = $this->request->getPost('textIdCliente'),
            ];
            log_message('notice','[TRACONTRATO|Async] {user} esta intentando grabar registros de usuario.', $log_extra);
            log_message('info','[TRACONTRATO|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[TRACONTRATO|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[TRACONTRATO|Async] Reglas de validacion aceptadas');
                log_message('info','[TRACONTRATO|Async] Enviando datos verificar duplicidad');
                if($datosDuplicados=$this->modeloTramites->buscarDuplicadosUsuarios($datosParaGuardar)){
                    log_message('info','[TRACONTRATO|Async] Retorno de datos esperando respuesta');
                    $swalMensajes=[
                        'title'=>'Advertencia',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'Existen registros con la misma clave, revise sus datos.',
                        'estatus'=>'duplicado',
                    ];
                    return json_encode($swalMensajes);

                }else {
                    log_message('info','[TRACONTRATO|Async] No se detecto registros duplicados.');
                    if($retorno=$this->modeloTramites->guardarDatosUsuarioTransferir($datosParaGuardar)){
                        log_message('info','[TRACONTRATO|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                        return json_encode($retorno);
                    }else {
                        log_message('info','[TRACONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[TRACONTRATO|Async] Metodo envio no reconocido termina proceso');
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

    public function llenarUsuarioTransferir($id)
    {
        log_message('info','[TRACONTRATO|Async] Solicitando datos para renderizado de usuario datos');
        if($tablaDatos = $this->modeloTramites->llenarDatosUsuarioTransferir($id)){
            log_message('info','[TRACONTRATO|Async] Envio de datos para renderizado de usuario datos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[TRACONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function actualizarUsuarioTransferir()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[TRACONTRATO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[TRACONTRATO|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textIdCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textIdContrato'=>[
                    'label'=>'Contrato',
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
                'textIdCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
            ]);
            log_message('info','[TRACONTRATO|Async] Creando variables con arreglo de los campos del formulario');
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
                $textIdCliente = $this->request->getPost('textIdCliente'),
                $textIdContrato = $this->request->getPost('textIdContrato'),
            ];
            log_message('notice','[TRACONTRATO|Async] {user} esta intentando grabar registros de usuario.', $log_extra);
            log_message('info','[TRACONTRATO|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[TRACONTRATO|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[TRACONTRATO|Async] Reglas de validacion aceptadas');
                if($retorno=$this->modeloTramites->actualizarDatosUsuarioTransferir($datosParaGuardar)){
                    log_message('info','[TRACONTRATO|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                    return json_encode($retorno);
                }else {
                    log_message('info','[TRACONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[TRACONTRATO|Async] Metodo envio no reconocido termina proceso');
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

    public function transferirContratoFinal()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[TRACONTRATO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[TRACONTRATO|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textIdCliente'=>[
                    'label'=>'Cliente',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textIdUbicacion'=>[
                    'label'=>'Ubicacion',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textIdContrato'=>[
                    'label'=>'Contrato',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textTipoContrato'=>[
                    'label'=>'Tipo Contrato',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textExpContrato'=>[
                    'label'=>'Expedicion',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textPermisos'=>[
                    'label'=>'Permisos',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textDescuento'=>[
                    'label'=>'Descuento',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textComentarios'=>[
                    'label'=>'Comentarios',
                    'rules'=>'max_length[500]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
            ]);
            log_message('info','[TRACONTRATO|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textIdCliente = $this->request->getPost('textIdCliente'),
                $textIdUbicacion = $this->request->getPost('textIdUbicacion'),
                $textIdContrato = $this->request->getPost('textIdContrato'),
                $textTipoContrato = $this->request->getPost('textTipoContrato'),
                $textExpContrato = $this->request->getPost('textExpContrato'),
                $textPermisos = $this->request->getPost('textPermisos'),
                $textDescuento = $this->request->getPost('textDescuento'),
                $textComentarios = $this->request->getPost('textComentarios'),
            ];
            log_message('notice','[TRACONTRATO|Async] {user} esta intentando transferir contrato.', $log_extra);
            log_message('info','[TRACONTRATO|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[TRACONTRATO|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[TRACONTRATO|Async] Reglas de validacion aceptadas');
                if($this->modeloTramites->transferirDatosContratoFinal($datosParaGuardar)){
                    log_message('info','[TRACONTRATO|Async] La transferencia se ha completado notificando');
                    $swalMensajes=[
                        'title'=>'Trámites',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'La transferencia de contratos se ha completado.',
                        'estatus'=>'transferido',
                    ];

                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[TRACONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[TRACONTRATO|Async] Metodo envio no reconocido termina proceso');
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

    public function abajcontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[BAJCONTRATO] Cargando modulo abajcontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vBajContrato').view('Plantilla/vFooter');
    }

    public function llenarTablaContratoBaja($id)
    {
        log_message('info','[BAJCONTRATO|Async] Solicitando datos para renderizado de contrato datos');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaContratoBaja($id)){
            log_message('info','[BAJCONTRATO|Async] Envio de datos para renderizado de contrato datos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[BAJCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function cargarContratoBaja($id)
    {
        log_message('info','[BAJCONTRATO|Async] Solicitando datos para renderizado de contrato detalles');
        if($tablaDatos = $this->modeloTramites->cargarDatosContratoBaja($id)){
            log_message('info','[BAJCONTRATO|Async] Envio de datos para renderizado de contrato detalles');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[BAJCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function actualizarContratoBaja()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[BAJCONTRATO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[BAJCONTRATO|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textModificacion'=>[
                    'label'=>'Modificacion',
                    'rules'=>'required',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textEstatus'=>[
                    'label'=>'Estatus',
                    'rules'=>'required|min_length[3]|max_length[40]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'min_length'=>'{field} dene tener min {param} caracteres',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textMotivo'=>[
                    'label'=>'Motivo',
                    'rules'=>'required|max_length[400]|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
                'textComentarios'=>[
                    'label'=>'Comentarios',
                    'rules'=>'max_length[400]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ],
            ]);
            log_message('info','[BAJCONTRATO|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textModificacion = $this->request->getPost('textModificacion'),
                $textEstatus = $this->request->getPost('textEstatus'),
                $textMotivo = $this->request->getPost('textMotivo'),
                $textComentarios = $this->request->getPost('textComentarios'),
            ];
            log_message('notice','[BAJCONTRATO|Async] {user} esta intentando dar de baja contrato.', $log_extra);
            log_message('info','[BAJCONTRATO|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[BAJCONTRATO|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[BAJCONTRATO|Async] Reglas de validacion aceptadas');
                if($retorno=$this->modeloTramites->actualizarDatosContratoBaja($datosParaGuardar)){
                    log_message('info','[BAJCONTRATO|Async] Los registros se grabaron correctamente, continua proseso de asignacion.');
                    $swalMensajes=[
                        'title'=>'Trámites',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'La baja se ha realizado ahora imprime el acuse de baja.',
                        'estatus'=>'actualizado',
                    ];

                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[BAJCONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[TRACONTRATO|Async] Metodo envio no reconocido termina proceso');
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

    public function acuseReciboBaja($id)
    {
        log_message('info','[BAJCONTRATO|Async] Solicitando datos para renderizado de recibo baja');
        if($tablaDatos = $this->modeloTramites->acuseDatosReciboBaja($id)){
            log_message('info','[BAJCONTRATO|Async] Envio de datos para renderizado de recibo baja');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[BAJCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function amodubicacio()
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
        log_message('info','[MODUBICACION] Cargando modulo modubicacion para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vModUbicacio').view('Plantilla/vFooter');
    }

    public function llenarTablaUbicacionModificar($id)
    {
        log_message('info','[MODUBICACION|Async] Solicitando datos para renderizado de modif ubicación');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaUbicacionModificar($id)){
            log_message('info','[MODUBICACION|Async] Envio de datos para renderizado de modif ubicación');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[MODUBICACION|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function actualizarUbicacion()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[MODUBICACION|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[MODUBICACION|Async] Metodo envio reconocido continua proceso guardar');
            $reglasValidacion = $this->validate([
                'textIdCliente'=>[
                    'label'=>'Cliente',
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
                    'rules'=>'required|max_length[40]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres.',
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textNexte'=>[
                    'label'=>'N. Ext.',
                    'rules'=>'required|string',
                    'errors'=>[
                        'required'=>'{field} es requerido.',
                    ],
                ],
                'textNinte'=>[
                    'label'=>'N. Int.',
                    'rules'=>'max_length[20]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres.',
                    ],
                ],
                'textReferencia'=>[
                    'label'=>'Referencia',
                    'rules'=>'max_length[200]|string',
                    'errors'=>[
                        'max_length'=>'{field} debe tener max {param} caracteres',
                    ],
                ],
            ]);
            log_message('info','[MODUBICACION|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textIdCliente = $this->request->getPost('textIdCliente'),
                $textColonia = $this->request->getPost('textColonia'),
                $textCalle = $this->request->getPost('textCalle'),
                $textNexte = $this->request->getPost('textNexte'),
                $textNinte = $this->request->getPost('textNinte'),
                $textReferencia = $this->request->getPost('textReferencia'),
            ];
            log_message('notice','[MODUBICACION|Async] {user} esta intentando actualizar ubicaciones.', $log_extra);
            log_message('info','[MODUBICACION|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[MODUBICACION|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }else{
                log_message('info','[MODUBICACION|Async] Reglas de validacion aceptadas');
                if($retorno=$this->modeloTramites->actualizarDatosUbicacion($datosParaGuardar)){
                    log_message('info','[MODUBICACION|Async] Los registros se grabaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Trámites',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Se han actualizado los datos de ubicación.',
                        'estatus'=>'actualizado',
                    ];

                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[BAJCONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[TRACONTRATO|Async] Metodo envio no reconocido termina proceso');
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

    public function aactcontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aactcontrato',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AACTCONTRATO] Cargando modulo actcontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vActContrato').view('Plantilla/vFooter');
    }

    public function autoCompletarBajasTem($id)
    {
        log_message('info','[AACTCONTRATO|Async] Solicitando datos para renderizado de bajas tempotales');
        if($tablaDatos = $this->modeloTramites->autoDatosCompletarBajasTem($id)){
            log_message('info','[AACTCONTRATO|Async] Envio de datos para renderizado de bajas tempotales');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AACTCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function buscarEditarBajas($id)
    {
        log_message('info','[AACTCONTRATO|Async] Solicitando datos para renderizado reactivar bajas');
        if($tablaDatos = $this->modeloTramites->buscarDatosEditarBajas($id)){
            log_message('info','[AACTCONTRATO|Async] Envio de datos para renderizado reactivar bajas');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AACTCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function reactivarContratoBaja()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[AGRCONTRATO|Async] Verificando el método de envio para continuar proceso asignacion');
        if($this->request->getMethod('POST')){
            log_message('info','[AGRCONTRATO|Async] Metodo envio reconocido continua proceso asignacion');
            log_message('info','[AGRCONTRATO|Async] Creando variables con arreglo de los campos del formulario');
            $camposJson=json_decode($this->request->getBody());
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textIdContrato = $camposJson->textIdContrato,
                $textEstatus = $camposJson->textEstatus,
                $textMotivo = $camposJson->textMotivo,
            ];
            log_message('notice','[AGRCONTRATO|Async] {user} esta intentando asignar contrato a usuario.', $log_extra);
            if($this->modeloTramites->reactivarBajasContratoBaja($datosParaGuardar)){
                log_message('info','[AGRCONTRATO|Async] Los registros se grabaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Reactivado',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'El contrato se ha reactivado correctamente.',
                    'estatus'=>'activado',
                ];

                return json_encode($swalMensajes);
            }else {
                log_message('info','[AGRCONTRATO|Async] Ocurrio un error al guardar los datos, notificando');
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
        else {
            log_message('info','[AGRCONTRATO|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function aregconvenio()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[REGCONVENIO] Cargando modulo aregconvenio para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vRegConvenio').view('Plantilla/vFooter');
    }

    public function llenarTablaContratoConvenio($id)
    {
        log_message('info','[REGCONVENIO|Async] Solicitando datos para renderizado de contrato datos');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaContratoConvenio($id)){
            log_message('info','[REGCONVENIO|Async] Envio de datos para renderizado de contrato datos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REGCONVENIO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function buscarUsuarioDeudor($id)
    {
        log_message('info','[REGCONVENIO|Async] Solicitando datos para renderizado de contrato detalles');
        if($tablaDatos = $this->modeloTramites->buscarDatosUsuarioDeudor($id)){
            log_message('info','[REGCONVENIO|Async] Envio de datos para renderizado de contrato detalles');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REGCONVENIO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function crearConvenio()
    {
        if($this->request->getMethod('POST')){
            log_message('info','[REGCONVENIO|Async] Creando variables con arreglo de los campos del formulario');
            $camposJson=json_decode($this->request->getBody());
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textCliente = $camposJson->textCliente,
                $textDeuda = $camposJson->textDeuda,
                $textPlazo = $camposJson->textPlazo,
                $textParcial = $camposJson->textParcial,
                $textPaulatinos = $camposJson->textPaulatinos,
                $textRestante = $camposJson->textRestante,
                $textAbono = $camposJson->textAbono,
                $abonos = $camposJson->abonos,
            ];
            log_message('info','[REGCONVENIO|Async] Enviando datos verificar duplicidad');
            if($datosDuplicados=$this->modeloTramites->buscarDuplicadosConvenio($datosParaGuardar)){
                log_message('info','[REGCONVENIO|Async] Se encontraron baja aplicadas con los parametros enviados notificando.');
                $swalMensajes=[
                    'title'=>'Advertencia',
                    'button'=>'Entendido',
                    'icon'=>'warning',
                    'text'=>'Existen registros con la misma clave, revise sus datos.',
                    'estatus'=>'duplicado',
                ];
                return json_encode($swalMensajes);

            }else{
                log_message('info','[REGCONVENIO|Async] No se detecto registros duplicados.');
                if($this->modeloTramites->crearDatosConvenio($datosParaGuardar)){
                    log_message('info','[REGCONVENIO|Async] Los registros se grabaron correctamente, notficando.');
                    $swalMensajes=[
                        'title'=>'Trámites',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Se ha creado el convenio debera imprimir el acuse y pagar el abono.',
                        'estatus'=>'creado',
                    ];

                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[REGCONVENIO|Async] Ocurrio un error al guardar los datos, notificando');
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

    public function aborcontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[BORCONTRATO] Cargando modulo aborcontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vBorContrato').view('Plantilla/vFooter');
    }

    public function llenarTablaUsuarioContratos($id)
    {
        log_message('info','[BORCONTRATO|Async] Solicitando datos para usuarios agregar contrato');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaUsuarioContratos($id)){
            log_message('info','[BORCONTRATO|Async] Envio de datos para usuarios agregar contrato');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[BORCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function eliminarContratos($id)
    {
        log_message('info','[BORCONTRATO|Async] Preparando solicitud para eliminar contratos');
        $datosEliminar=[
            session()->get('IDCLIENTE'),
            $id,
        ];
        if($this->modeloTramites->eliminarDatosContratos($datosEliminar)){
            log_message('info','[BORCONTRATO|Async] Notificando el proceso de eliminar contrato');
            $swalMensajes=[
                'title'=>'Tramite',
                'button'=>'Entendido',
                'icon'=>'success',
                'text'=>'Se ha eliminado el registro de este contrato.',
                'estatus'=>'eliminado',
            ];

            return json_encode($swalMensajes);
        }else {
            log_message('info','[BORCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function aborusuarios()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aregusuarios',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[BORUSUARIOS] Cargando modulo borusuario para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Tramites/vBorUsuarios').view('Plantilla/vFooter');
    }

    public function llenarTablaUsuariosContratosHoy()
    {
        log_message('info','[BORUSUARIOS|Async] Solicitando datos para renderizado de tabla usuarios contratos');
        if($tablaDatos = $this->modeloTramites->llenarDatosTablaUsuariosContratosHoy()){
            log_message('info','[BORUSUARIOS|Async] Envio de datos para renderizado de tabla usuarios contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[BORUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function contratoUsuarioBorrar($id)
    {
        log_message('info','[BORUSUARIOS|Async] Solicitando datos para renderizado de usuarios contratos');
        if($tablaDatos = $this->modeloTramites->contratoDatosUsuarioBorrar($id)){
            log_message('info','[BORUSUARIOS|Async] Envio de datos para renderizado de usuarios contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[BORUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function eliminarUsuarioContrato($id)
    {
        log_message('info','[BORUSUARIOS|Async] Preparando solicitud para eliminar usuarios contratos');
        $datosEliminar=[
            session()->get('IDCLIENTE'),
            $id,
        ];
        if($this->modeloTramites->eliminarDatosUsuarioContrato($datosEliminar)){
            log_message('info','[BORUSUARIOS|Async] Notificando el proceso de eliminar usuario contrato');
            $swalMensajes=[
                'title'=>'Tramite',
                'button'=>'Entendido',
                'icon'=>'success',
                'text'=>'Se ha eliminado el registro de este usuario.',
                'estatus'=>'eliminado',
            ];

            return json_encode($swalMensajes);
        }else {
            log_message('info','[BORUSUARIOS|Async] Ocurrio un error al consultar los datos, notificando');
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






    public function autocompletarUsuario($id)
    {
        log_message('info','[TRAMITES|Async] Solicitando datos para renderizado de completar usuarios');
        if($tablaDatos = $this->modeloTramites->autocompletarDatosUsuario($id)){
            log_message('info','[TRAMITES|Async] Envio de datos para renderizado de completar usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[TRAMITES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function autocompletarContrato($id)
    {
        log_message('info','[TRAMITES|Async] Solicitando datos para renderizado de completar contratos');
        if($tablaDatos = $this->modeloTramites->autocompletarDatosContrato($id)){
            log_message('info','[TRAMITES|Async] Envio de datos para renderizado de completar contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[TRAMITES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function firmaComiteTramites()
    {
        log_message('info','[TRAMITES|Async] Solicitando datos para renderizado de firmas tramites');
        if($tablaDatos = $this->modeloTramites->firmaDatosComiteTramites()){
            log_message('info','[TRAMITES|Async] Envio de datos para renderizado de firmas tramites');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[TRAMITES|Async] Ocurrio un error al consultar los datos, notificando');
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






 ?>
