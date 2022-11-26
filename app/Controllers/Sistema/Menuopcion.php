<?php
namespace App\Controllers\Sistema;
use App\Models\Sistema\Mmenuopcion;
use App\Controllers\BaseController;

class Menuopcion extends BaseController
{
    protected $modeloMenu;

    public function __construct()
    {
        $this->modeloMenu = new Mmenuopcion;
    }
    public function llamandoParametrosWeb($id)
    {
        log_message('info','[MENUOPCION] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $this->modeloMenu->llamandoDatosParametrosWeb($id)){
            log_message('info','[MENUOPCION] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function menunivela()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'menunivela',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[MENUNIVA] Cargando modulo menus para {user} con privilegios {grupo}  menu A.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Menuopcion/vMenuniva').view('Plantilla/vFooter');
    }

    public function llenarTablaMenuA()
    {
        log_message('info','[MENUNIVA|Async] Solicitando datos para renderizado de tabla menu A');
        if($tablaDatos = $this->modeloMenu->llenarDatosTablaMenuA()){
            log_message('info','[MENUNIVA|Async] Envio de datos para renderizado de tabla menu A');
            return $tablaDatos;
        }
    }

    public function guardarMenuNivelA()
    {
        log_message('info','[MENUNIVA|Async] Comprobando sesión iniciada en el sistema para proceso guardado.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVA|Async] Verificando el método de envio para proceso guardar');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVA|Async] Método de envio reconocido continua proceso guardar');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Orden',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Contiene Opciones',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVA|Async] Creando variables en arreglo para enviar data del proceso guardado');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('notice','[MENUNIVA|Async] {user} esta intentando grabar registros en menu nivel A.', $log_extra);
                log_message('info','[MENUNIVA|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVA|Async] Reglas de validacion fueron rechazadas GUARDAR');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVA|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVA|Async] Enviando datos para verificar duplicidad de registros en menu A');
                    if($datosDuplicados=$this->modeloMenu->buscarDuplicadosMenuA($datosParaGuardar)){
                        log_message('info','[MENUNIVA|Async] Retorno de datos encontrados notificando esperando respuesta de usuario');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);

                    }else {
                        log_message('info','[MENUNIVA|Async] No se detecto registros duplicados en menu A continua proceso guardado');
                        if($this->modeloMenu->guardarDatosMenuNivelA($datosParaGuardar)){
                            log_message('info','[MENUNIVA|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);

                        }else {
                            log_message('info','[MENUNIVA|Async] Ocurrio un error al guardar los datos, notificando menu A');
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
            }else{
                log_message('info','[MENUNIVA|Async] Método de envio no reconocido para proceso guardar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);

            }

        }else{
            log_message('info','[MENUNIVA|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);

        }

    }

    public function buscarEditarMenuA($id)
    {
        log_message('info','[MENUNIVA|Async] Verificando el método de envio menu A');
        if($this->request->getMethod('POST')){
            log_message('info','[MENUNIVA|Async] Metodo envio reconocido continua proceso menu A');
                $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[MENUNIVA|Async] Solicitando datos para renderizado de edición menu A');
            if($datosEditar=$this->modeloMenu->buscarDatosEditarMenuA($datosParaBuscar)){
                log_message('info','[MENUNIVA|Async] Envio de datos para renderizado de inputs');
                return json_encode($datosEditar);
            }else {
                log_message('info','[MENUNIVA|Async] No se encontraron datos en la consulta solicitada para edición');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Entendido',
                    'icon'=>'warning',
                    'text'=>'No se encontraron datos en la consulta solicitada.',
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }
        }
        else {
            log_message('info','[MENUNIVA|Async] Método de envio no reconocido para proceso edición se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Método de envio de datos no reconocido.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function actualizarMenuNivelA()
    {
        log_message('info','[MENUNIVA|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVA|Async] Verificando el método de envio para proceso actualización');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVA|Async] Metodo envio reconocido continua proceso actualización');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVA|Async] Creando variables en arreglo para enviar data del proceso actualización');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('info','[MENUNIVA|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVA|Async] Reglas de validacion fueron rechazadas proceso actualización interrumpido');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVA|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVA|Async] Enviando datos a modelo para la actualización');
                    if($this->modeloMenu->actualizarDatosMenuNivelA($datosParaActualizar)){
                        log_message('info','[MENUNIVA|Async] Los registros se actualizaron correctamente, notificando menu A.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[MENUNIVA|Async] Ocurrio un error al actualizar los datos, notificando menu A');
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
                log_message('info','[MENUNIVA|Async] Método de envio no reconocido para proceso actualización se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        }else{
            log_message('info','[MENUNIVA|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function eliminarMenuNivelA($id)
    {
        log_message('info','[MENUNIVA|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            log_message('info','[MENUNIVA|Async] Verificando el método de envio para proceso eliminar menu A');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVA|Async] Metodo envio reconocido continua proceso eliminar menu A');
                log_message('info','[MENUNIVA|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaEliminar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $id,
                ];
                        if($this->modeloMenu->eliminarDatosMenuNivelA($datosParaEliminar)){
                    log_message('info','[MENUNIVA|Async] Los registros se eliminaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se eliminaron correctamente.',
                        'estatus'=>'eliminado',
                    ];
                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[MENUNIVA|Async] Ocurrio un error al guardar los datos, notificando');
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'error',
                        'text'=>'Ocurro un error al eliminar los datos.',
                        'estatus'=>'error',
                    ];

                    return json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[MENUNIVA|Async] Método de envio no reconocido para proceso eliminar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVA|Async] La sesión ha caducado o no existe proceso eliminar se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function menunivelb()
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
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[MENUNIVB] Cargando modulo menus para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Menuopcion/vMenunivb').view('Plantilla/vFooter');
    }

    public function llenarTablaMenuB()
    {
        log_message('info','[MENUNIVB|Async] Solicitando datos para renderizado de tabla menu b');
        if($tablaDatos = $this->modeloMenu->llenarDatosTablaMenuB()){
            log_message('info','[MENUNIVB|Async] Envio de datos para renderizado de tabla menu b');
            return json_encode($tablaDatos);
        }
    }

    public function guardarMenuNivelB()
    {
        log_message('info','[MENUNIVB|Async] Comprobando sesión iniciada en el sistema para proceso guardado.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVB|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVB|Async]  Metodo envio reconocido continua proceso');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVB|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textMenuA = $this->request->getPost('textMenuA'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('notice','[MENUNIVB|Async] {user} esta intentando grabar registros en menu nivel B.', $log_extra);
                log_message('info','[MENUNIVB|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVB|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVB|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVB|Async] Enviando datos verificar duplicidad');
                    if($datosDuplicados=$this->modeloMenu->buscarDuplicadosMenuB($datosParaGuardar)){
                        log_message('info','[MENUNIVB|Async] Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[MENUNIVB|Async] No se detecto registros duplicados.');
                        if($retorno=$this->modeloMenu->guardarDatosMenuNivelB($datosParaGuardar)){
                            log_message('info','[MENUNIVB|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[MENUNIVB|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[MENUNIVB|Async] Método de envio no reconocido para proceso guardar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);

            }
        }else{
            log_message('info','[MENUNIVB|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);

        }
    }

    public function buscarEditarMenuB($id)
    {
        log_message('info','[MENUNIVB|Async] Verificando el método de envio menu B');
        if($this->request->getMethod('POST')){
            log_message('info','[MENUNIVB|Async] Metodo envio reconocido continua proceso menu B');
                $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[MENUNIVB|Async] Solicitando datos para renderizado de edición menu B');
            if($datosEditar=$this->modeloMenu->buscarDatosMenuB($datosParaBuscar)){
                log_message('info','[MENUNIVB|Async] Envio de datos para renderizado de inputs menu B');
                return json_encode($datosEditar);
            }else {
                log_message('info','[MENUNIVB|Async] No se encontraron datos en la consulta solicitada para edición');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Entendido',
                    'icon'=>'warning',
                    'text'=>'No se encontraron datos en la consulta solicitada.',
                    'estatus'=>'invalido',
                ];

                return json_encode($swalMensajes);
            }
        }
        else {
            log_message('info','[MENUNIVB|Async] Método de envio no reconocido para proceso edición se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Método de envio de datos no reconocido.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function actualizarMenuNivelB()
    {
        log_message('info','[MENUNIVB|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVB|Async] Verificando el método de envio para proceso actualización');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVB|Async] Metodo envio reconocido continua proceso actualización');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Orden',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Opciones',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Icono',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVB|Async] Creando variables en arreglo para enviar data del proceso actualización');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textMenuA = $this->request->getPost('textMenuA'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('info','[MENUNIVB|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVB|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    echo json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVB|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVB|Async] Enviando datos para la actualización');
                    if($this->modeloMenu->actualizarDatosMenuNivelB($datosParaActualizar)){
                        log_message('info','[MENUNIVB|Async] Los registros se actualizaron correctamente, notificando menu B.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[MENUNIVB|Async] Ocurrio un error al guardar los datos, notificando menu B');
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
            }
            else {
                log_message('info','[MENUNIVB|Async] Método de envio no reconocido para proceso actualización se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVB|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function eliminarMenuNivelB($id)
    {
        log_message('info','[MENUNIVB|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            log_message('info','[MENUNIVB|Async] Verificando el método de envio para ELIMINAR menu B');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVB|Async] Metodo envio reconocido continua proceso eliminar menu A');
                log_message('info','[MENUNIVB|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaEliminar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $id,
                ];
                        if($this->modeloMenu->eliminarDatosMenuNivelB($datosParaEliminar)){
                    log_message('info','[MENUNIVB|Async] Los registros se eliminaron correctamente de menu B, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se eliminaron correctamente.',
                        'estatus'=>'eliminado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[MENUNIVB|Async] Ocurrio un error al eliminar los datos menu B, notificando');
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'error',
                        'text'=>'Ocurro un error al eliminar los datos.',
                        'estatus'=>'error',
                    ];

                    return json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[MENUNIVB|Async] Método de envio no reconocido para proceso eliminar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVB|Async] La sesión ha caducado o no existe proceso eliminar se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function menunivelc()
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
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[MENUNIVC|Async] Cargando modulo menus para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Menuopcion/vMenunivc').view('Plantilla/vFooter');
    }

    public function llenarTablaMenuC()
    {
        log_message('info','[MENUNIVC|Async] Solicitando datos para renderizado de tabla menu C');
        if($tablaDatos = $this->modeloMenu->llenarDatosTablaMenuC()){
            log_message('info','[MENUNIVC|Async] Envio de datos para renderizado de tabla menu C');
            return json_encode($tablaDatos);
        }
    }

    public function guardarMenuNivelC()
    {
        log_message('info','[MENUNIVC|Async] Comprobando sesión iniciada en el sistema para proceso guardado.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVC|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVC|Async] Metodo envio reconocido continua proceso de GUARDAR menu C');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textMenuB'=>[
                            'label'=>'Menu Raíz B',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textMenuB'=>[
                            'label'=>'Menu Raíz B',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVC|Async] Creando variables con arreglo de los campos del formulario menu C');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textMenuA = $this->request->getPost('textMenuA'),
                    $textMenuB = $this->request->getPost('textMenuB'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('notice','[MENUNIVC|Async] {user} esta intentando grabar registros en menu nivel C.', $log_extra);
                log_message('info','[MENUNIVC|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVC|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVC|Async] Reglas de validacion aceptadas');
                    log_message('info','[MENUNIVC|Async] Enviando datos verificar duplicidad menu C');
                    if($datosDuplicados=$this->modeloMenu->buscarDuplicadosMenuC($datosParaGuardar)){
                        log_message('info','[MENUNIVC|Async] Retorno de datos esperando respuesta de usuario');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);

                    }else {
                        log_message('info','[MENUNIVC|Async] No se detecto registros duplicados.');
                        if($retorno=$this->modeloMenu->guardarDatosMenuNivelC($datosParaGuardar)){
                            log_message('info','[MENUNIVC|Async] Los registros se grabaron correctamente de menu C, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            echo json_encode($swalMensajes);
                        }else {
                            log_message('info','[MENUNIVC|Async] Ocurrio un error al guardar los datos en menu C, notificando');
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
                log_message('info','[MENUNIVC|Async] Método de envio no reconocido para proceso guardar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVB|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);

        }
    }

    public function buscarEditarMenuC($id)
    {
        log_message('info','[MENUNIVC|Async] Verificando el método de envio menu C');
        if($this->request->getMethod('POST')){
            log_message('info','[MENUNIVC|Async] Metodo envio reconocido continua proceso menu C');
                $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[MENUNIVC|Async] Solicitando datos para renderizado de edición menu C');
            if($datosEditar=$this->modeloMenu->buscarDatosMenuC($datosParaBuscar)){
                log_message('info','[MENUNIVC|Async] Envio de datos para renderizado de inputs menu C');
                return json_encode($datosEditar);
            }else {
                echo json_encode('no trajo nada');
            }
        }
        else {
            log_message('info','[MENUNIVC|Async] Metodo envio no reconocido termina proceso');
            return false;
        }

    }

    public function actualizarMenuNivelC()
    {
        log_message('info','[MENUNIVC|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVC|Async] Verificando el método de envio para proceso actualización');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVC|Async] Metodo envio reconocido continua proceso actualización');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textMenuB'=>[
                            'label'=>'Menu Raíz B',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textMenuB'=>[
                            'label'=>'Menu Raíz B',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVC|Async] Creando variables en arreglo para enviar data del proceso actualización');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textMenuB = $this->request->getPost('textMenuB'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('info','[MENUNIVC|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVC|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVC|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVC|Async] Enviando datos para la actualización');
                    if($this->modeloMenu->actualizarDatosMenuNivelC($datosParaActualizar)){
                        log_message('info','[MENUNIVC|Async] Los registros se actualizaron correctamente, notificando menu C.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[MENUNIVC|Async] Ocurrio un error al guardar los datos, notificando menu C');
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
                log_message('info','[MENUNIVC|Async] Método de envio no reconocido para proceso actualización se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVC|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function eliminarMenuNivelC($id)
    {
        log_message('info','[MENUNIVC|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            log_message('info','[MENUNIVC|Async] Verificando el método de envio para ELIMINAR menu B');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVC|Async] Metodo envio reconocido continua proceso ELIMINAR menu B');
                log_message('info','[MENUNIVC|Async] Creando variables con arreglo de los campos del formulario menu B');
                $datosParaEliminar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $id,
                ];
                        if($this->modeloMenu->eliminarDatosMenuNivelC($datosParaEliminar)){
                    log_message('info','[MENUNIVC|Async] Los registros se eliminaron correctamente de menu B, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se eliminaron correctamente.',
                        'estatus'=>'eliminado',
                    ];
                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[MENUNIVC|Async] Ocurrio un error al eliminar los datos menu B, notificando');
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'error',
                        'text'=>'Ocurro un error al eliminar los datos.',
                        'estatus'=>'error',
                    ];

                    return json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[MENUNIVC|Async] Método de envio no reconocido para proceso eliminar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVC|Async] La sesión ha caducado o no existe proceso eliminar se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function menuniveld()
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
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[MENUNIVD] Cargando modulo menus para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Menuopcion/vMenunivd').view('Plantilla/vFooter');
    }

    public function llenarTablaMenuD()
    {
        log_message('info','[MENUNIVD|Async] Solicitando datos para renderizado de tabla menu D');
        if($tablaDatos = $this->modeloMenu->llenarDatosTablaMenuD()){
            log_message('info','[MENUNIVD|Async] Envio de datos para renderizado de tabla menu D');
            return json_encode($tablaDatos);
        }
    }

    public function guardarMenuNivelD()
    {
        log_message('info','[MENUNIVD|Async] Comprobando sesión iniciada en el sistema para proceso guardado.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[MENUNIVD|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVD|Async] Metodo envio reconocido continua proceso de GUARDAR menu D');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textMenuB'=>[
                            'label'=>'Menu Raíz B',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textMenuC'=>[
                            'label'=>'Menu Raíz C',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textMenuA'=>[
                            'label'=>'Menu Raíz',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textMenuB'=>[
                            'label'=>'Menu Raíz B',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textMenuC'=>[
                            'label'=>'Menu Raíz C',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVD|Async] Creando variables con arreglo de los campos del formulario menu D');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textMenuA = $this->request->getPost('textMenuA'),
                    $textMenuB = $this->request->getPost('textMenuB'),
                    $textMenuC = $this->request->getPost('textMenuC'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('notice','[MENUNIVD|Async] {user} esta intentando grabar registros en menu nivel D.', $log_extra);
                log_message('info','[MENUNIVD|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVD|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVD|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVD|Async] Enviando datos verificar duplicidad menu D');
                    if($datosDuplicados=$this->modeloMenu->buscarDuplicadosMenuD($datosParaGuardar)){
                        log_message('info','[MENUNIVD|Async] Retorno de datos esperando respuesta de usuario');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);

                    }else {
                        log_message('info','[MENUNIVD|Async] No se detecto registros duplicados.');
                        if($retorno=$this->modeloMenu->guardarDatosMenuNivelD($datosParaGuardar)){
                            log_message('info','[MENUNIVD|Async] Los registros se grabaron correctamente de menu D, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[MENUNIVD|Async] Ocurrio un error al guardar los datos en menu D, notificando');
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
                log_message('info','[MENUNIVD|Async] Método de envio no reconocido para proceso guardar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVD|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);

        }
    }

    public function buscarEditarMenuD($id)
    {
        log_message('info','[MENUNIVD|Async] Verificando el método de envio menu D');
        if($this->request->getMethod('POST')){
            log_message('info','[MENUNIVD|Async] Metodo envio reconocido continua proceso menu D');
                $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[MENUNIVD|Async] Solicitando datos para renderizado de edición menu D');
            if($datosEditar=$this->modeloMenu->buscarDatosMenuD($datosParaBuscar)){
                log_message('info','[MENUNIVD|Async] Envio de datos para renderizado de inputs menu D');
                return json_encode($datosEditar);
            }else {
                echo json_encode('no trajo nada');
            }
        }
        else {
            log_message('info','[MENUNIVD|Async] Metodo envio no reconocido termina proceso');
            return false;
        }

    }

    public function actualizarMenuNivelD()
    {
        log_message('info','[MENUNIVD|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            log_message('info','[MENUNIVD|Async] Verificando el método de envio para proceso actualización');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVD|Async] Metodo envio reconocido continua proceso actualización');
                $confirmHijos=$this->request->getVar('textHijos');
                if($confirmHijos='SI'){
                    $reglasValidacion = $this->validate([
                        'textMenuC'=>[
                            'label'=>'Menu Raíz C',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'max_length[12]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[40]|string',
                        'errors'=>[
                        'required'=>'{field} es requerido.',
                        'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                        ],
                    ]);
                }else {
                    $reglasValidacion = $this->validate([
                        'textMenuC'=>[
                            'label'=>'Menu Raíz C',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textClave'=>[
                            'label'=>'Clave',
                            'rules'=>'required|min_length[4]|max_length[12]|alpha',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'min_length'=>'{field} dene tener min {param} caracteres',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                                'alpha'=>'{field} solo deben ser letras',
                            ],
                        ],
                        'textOrden'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|numeric',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'numeric'=>'{field} solo deben ser números',
                            ],
                        ],
                        'textHijos'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                            ],
                        ],
                        'textIcono'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[30]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textReferencia'=>[
                            'label'=>'Referencia',
                            'rules'=>'required|max_length[12]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textTooltip'=>[
                            'label'=>'Tooltip',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textDescripcion'=>[
                            'label'=>'Descripción',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTitulo'=>[
                            'label'=>'Titulo SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoTituloPant'=>[
                            'label'=>'Titulo Pantalla SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoRobots'=>[
                            'label'=>'Robots SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoKeyWords'=>[
                            'label'=>'Keywords SEO',
                            'rules'=>'max_length[40]|string',
                            'errors'=>[
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                        'textSeoDescripcion'=>[
                            'label'=>'Descripción SEO',
                            'rules'=>'required|max_length[40]|string',
                            'errors'=>[
                                'required'=>'{field} es requerido.',
                                'max_length'=>'{field} dene tener max {param} caracteres',
                            ],
                        ],
                    ]);
                }
                log_message('info','[MENUNIVD|Async] Creando variables con arreglo de los campos del formulario ACTUALIZAR menu D');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textMenuC = $this->request->getPost('textMenuC'),
                    $textClave = $this->request->getPost('textClave'),
                    $textIcono = $this->request->getPost('textIcono'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textTooltip = $this->request->getPost('textTooltip'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textHijos = $this->request->getPost('textHijos'),
                    $textOrden = $this->request->getPost('textOrden'),
                    $textSeoTitulo = $this->request->getPost('textSeoTitulo'),
                    $textSeoTituloPant = $this->request->getPost('textSeoTituloPant'),
                    $textSeoRobots = $this->request->getPost('textSeoRobots'),
                    $textSeoKeyWords = $this->request->getPost('textSeoKeyWords'),
                    $textSeoDescripcion = $this->request->getPost('textSeoDescripcion'),
                ];
                log_message('info','[MENUNIVD|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[MENUNIVD|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];

                    echo json_encode($swalMensajes);
                }else{
                    log_message('info','[MENUNIVD|Async] Reglas de validacion aceptadas');
                                log_message('info','[MENUNIVD|Async] Enviando datos para la actualización');
                    if($this->modeloMenu->actualizarDatosMenuNivelD($datosParaActualizar)){
                        log_message('info','[MENUNIVD|Async] Los registros se actualizaron correctamente, notificando menu D.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[MENUNIVD|Async] Ocurrio un error al guardar los datos, notificando menu D');
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
            }
            else {
                log_message('info','[MENUNIVD|Async] Método de envio no reconocido para proceso actualización se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVD|Async] La sesión ha caducado o no existe proceso guardado se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function eliminarMenuNivelD($id)
    {
        log_message('info','[MENUNIVD|Async] Comprobando sesión iniciada en el sistema para proceso actualización.');
        if(session()->get('logged_in')==1){
            log_message('info','[MENUNIVD|Async] Verificando el método de envio para ELIMINAR menu D');
            if($this->request->getMethod('POST')){
                log_message('info','[MENUNIVD|Async] Metodo envio reconocido continua proceso ELIMINAR menu D');
                log_message('info','[MENUNIVD|Async] Creando variables con arreglo de los campos del formulario menu D');
                $datosParaEliminar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $id,
                ];
                        if($respuestaAviso=$this->modeloMenu->eliminarDatosMenuNivelD($datosParaEliminar)){
                    log_message('info','[MENUNIVD|Async] Los registros se eliminaron correctamente de menu D, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se eliminaron correctamente.',
                        'estatus'=>'eliminado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[MENUNIVD|Async] Ocurrio un error al eliminar los datos menu D, notificando');
                    $swalMensajes=[
                        'title'=>'Error Servidor',
                        'button'=>'Ok',
                        'icon'=>'error',
                        'text'=>'Ocurro un error al eliminar los datos.',
                        'estatus'=>'error',
                    ];

                    echo json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[MENUNIVD|Async] Método de envio no reconocido para proceso eliminar se interrumpe');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Método de envio de datos no reconocido.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else{
            log_message('info','[MENUNIVD|Async] La sesión ha caducado o no existe proceso eliminar se interrumpe');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado debe iniciar sesión de nuevo.',
                'estatus'=>'invalido',
            ];

            return json_encode($swalMensajes);
        }

    }




    public function llenarComboMenuA()
    {
        log_message('info','[MENUNIVA|Async] Solicitando datos para renderizado de combo menu a');
        if($tablaDatos = $this->modeloMenu->llenarDatosComboMenuA()){
            log_message('info','[MENUNIVA|Async] Envio de datos para renderizado de combo menu a');
            return json_encode($tablaDatos);
        }
    }

    public function llenarComboMenuB($id)
    {
        log_message('info','[MENUNIVB|Async] Solicitando datos para renderizado de combobox menu B');
        if($tablaDatos = $this->modeloMenu->llenarDatosComboMenuB($id)){
            log_message('info','[MENUNIVB|Async] Envio de datos para renderizado de combobox menu B');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[MENUNIVB|Async] No se encontraron datos en la definicion del menu');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'No hay datos o opciones en este menu.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboMenuC($id)
    {
        log_message('info','[MENUNIVC|Async] Solicitando datos para renderizado de combobox menu C');
        if($tablaDatos = $this->modeloMenu->llenarDatosComboMenuC($id)){
            log_message('info','[MENUNIVC|Async] Envio de datos para renderizado de combobox menu C');
            return json_encode($tablaDatos);
        }
    }

    public function llenarComboAMenuC()
    {
        log_message('info','[MENUNIVC|Async] Solicitando datos para renderizado de combo menu a');
        if($tablaDatos = $this->modeloMenu->llenarDatosComboAMenuC()){
            log_message('info','[MENUNIVC|Async] Envio de datos para renderizado de combo menu a');
            return json_encode($tablaDatos);
        }
    }

    public function llenarComboBMenuD($id)
    {
        log_message('info','[MENUNIVD|Async] Solicitando datos para renderizado de combobox menu B');
        if($tablaDatos = $this->modeloMenu->llenarDatosComboBMenuD($id)){
            log_message('info','[MENUNIVD|Async] Envio de datos para renderizado de combobox menu B');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[MENUNIVD|Async] No se encontraron datos en la definicion del menu');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'No hay datos o opciones en este menu.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function buscarIconos($id)
    {
        if($listaIconos= $this->modeloMenu->buscarIconosInput($id)){
            return $listaIconos;
        }else {
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


}

?>
