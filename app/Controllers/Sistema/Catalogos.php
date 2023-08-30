<?php
namespace App\Controllers\Sistema;
use App\Models\Sistema\Mcatalogos;
use App\Controllers\BaseController;

/**
 *
 */
class Catalogos extends BaseController
{
    protected $modeloCatalogos;

    function __construct()
    {
        $this->modeloCatalogos = new Mcatalogos;
    }

    public function llamandoParametrosWeb($id)
    {
        if($tablaDatos = $this->modeloCatalogos->llamandoDatosParametrosWeb($id)){
            log_message('info','[CATALOGOS] Solicitando datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                log_message('info','[CATALOGOS] Envio de datos para renderizado de parametros web');
                foreach($tablaDatos[0] as $key => $value){
                    $paramWeb=$key=$value;
                }
                foreach($tablaDatos[1] as $key => $value){
                    $paramSEO=$key=$value;
                }
                return [$paramWeb,$paramSEO];
            }
        }
    }

    public function catareas()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=[
            'titulo'=>$respuesta[1]['NOMSEO_RPLA'].' | '.$respuesta[0]['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta[0]['TITULOPANT_CONW'],
            'robots'=>$respuesta[0]['ROBOTS_CONW'],
            'Keyword'=>$respuesta[0]['KEYWORD_CONW'],
            'descripcion'=>$respuesta[0]['DESCRIPCION_CONW'],
            'footer'=>$respuesta[1]['NOMBRE_RPLA'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        ];
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AREAS] Cargando modulo '.$id.' para {user} con privilegios {grupo}.',$log_extra);
        return view('Sistema/Catalogos/vCatAreas',$cadena);
    }

    public function controlAccionesAreas()
    {
        
    }

    public function llenarTablaAreas()
    {
        try {
            log_message('info','[CATAREAS|Async] Solicitando datos para renderizado de tabla areas');
            $tablaDatos = $this->modeloCatalogos->llenarDatosTablaAreas();
            log_message('info','[CATAREAS|Async] Envio de datos para renderizado de tabla areas');
            return json_encode($tablaDatos);

        } catch (\RuntimeException $error) {
            log_message('error','[CATAREAS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function guardarAreas()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATAREAS|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[CATAREAS|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textArea'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[4]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ]
                ]);
                log_message('info','[CATAREAS|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textArea = $this->request->getPost('textArea'),
                    $textDescrip = $this->request->getPost('textDescripcion'),
                    $textComent = $this->request->getPost('textComentario'),
                ];
                log_message('notice','[CATAREAS|Async] {user} esta intentando grabar registros en catalogo areas.', $log_extra);
                log_message('info','[CATAREAS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATAREAS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATAREAS|Async] Reglas de validacion aceptadas');
                    log_message('info','[CATAREAS|Async] Enviando datos para verificar duplicidad');
                    if($datosDuplicados=$this->modeloCatalogos->buscarDuplicadosAreas($datosParaGuardar)){
                        log_message('info','[CATAREAS|Async] Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
    
                    }else {
                        log_message('info','[CATAREAS|Async] No se detecto registros duplicados.');
                        if($retorno=$this->modeloCatalogos->guardarDatosAreas($datosParaGuardar)){
                            log_message('info','[CATAREAS|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[CATAREAS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATAREAS|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATAREAS|Async] Error al obtener insertar datos en tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function buscaEditarAreas($id)
    {
        try {
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[CATAREAS|Async] Solicitando datos para renderizado de edición de areas');
            if($datosEditar=$this->modeloCatalogos->buscarDatosAreas($datosParaBuscar)){
                log_message('info','[CATAREAS|Async] Envio de datos para renderizado de edición de areas');
                return json_encode($datosEditar);
            }else {
                log_message('info','[CATAREAS|Async] No se encontraron resultados o ocurrio un error, notificando.');
                $swalMensajes=[
                    'title'=>'No datos',
                    'button'=>'Ok',
                    'icon'=>'warning',
                    'text'=>'No se encontraron registro o ocurrio un error.',
                    'estatus'=>'noencontrado',
                ];
                return json_encode($swalMensajes);
            }
        } catch (\RuntimeException $error) {
            log_message('error','[CATAREAS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function actualizarAreas()
    {
        try {
            log_message('info','[CATAREAS|Async] Verificando el método de envio para actualizar');
            if($this->request->getMethod('POST')){
                log_message('info','[CATAREAS|Async] Metodo envio reconocido continua proceso de actualización');
                log_message('info','[CATAREAS|Async] Creando las reglas de validación para la actualización');
                $reglasValidacion = $this->validate([
                    'textArea'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[4]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ]
                ]);
                log_message('info','[CATAREAS|Async] Creando variables con arreglo de los datos a actualizar');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textArea = $this->request->getPost('textArea'),
                    $textDescrip = $this->request->getPost('textDescripcion'),
                    $textComent = $this->request->getPost('textComentario'),
                ];
                log_message('info','[CATAREAS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATAREAS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATAREAS|Async] Reglas de validacion aceptadas');
                    log_message('info','[CATAREAS|Async] Enviando datos al modelo para la actualización');
                    if($this->modeloCatalogos->actualizarDatosAreas($datosParaActualizar)){
                        log_message('info','[CATAREAS|Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CATAREAS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATAREAS|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATAREAS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function eliminarAreas($id)
    {
        try {
            log_message('info','[CATAREAS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $id,
            ];
            log_message('info','[CATAREAS|Async] Enviando datos al modelo para eliminar.');
            if($this->modeloCatalogos->eliminarDatosAreas($datosParaEliminar)){
                log_message('info','[CATAREAS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                return json_encode($swalMensajes);
            }else {
                log_message('info','[CATAREAS|Async] Ocurrio un error al eliminar datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al eliminar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATAREAS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function catpuestos()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=[
            'titulo'=>$respuesta[1]['NOMSEO_RPLA'].' | '.$respuesta[0]['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta[0]['TITULOPANT_CONW'],
            'robots'=>$respuesta[0]['ROBOTS_CONW'],
            'Keyword'=>$respuesta[0]['KEYWORD_CONW'],
            'descripcion'=>$respuesta[0]['DESCRIPCION_CONW'],
            'footer'=>$respuesta[1]['NOMBRE_RPLA'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        ];
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CATPUESTOS] Cargando modulo catalogos para {user} con privilegios {grupo}.',$log_extra);
        return view('Sistema/Catalogos/vCatPuestos',$cadena);
    }

    public function controlAccionesPuestos()
    {
        
    }

    public function llenarTablaPuestos()
    {
        try {
            log_message('info','[CATPUESTOS|Async] Solicitando datos para renderizado de tabla puestos');
            $tablaDatos = $this->modeloCatalogos->llenarDatosTablaPuestos();
            log_message('info','[CATPUESTOS|Async] Envio de datos para renderizado de tabla puestos');
            return json_encode($tablaDatos);

        } catch (\RuntimeException $error) {
            log_message('error','[CATPUESTOS|Async] Error al obtener datos para renderizado de tabla puestos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }

    }

    public function guardarPuestos()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATPUESTOS|Async] Verificando el método de envio para proceso de guardar');
            if($this->request->getMethod('POST')){
                log_message('info','[CATPUESTOS|Async] Metodo envio reconocido continua proceso de guardar');
                $reglasValidacion = $this->validate([
                    'textArea'=>[
                        'label'=>'Área',
                        'rules'=>'required|min_length[4]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textPuesto'=>[
                        'label'=>'Puesto',
                        'rules'=>'required|min_length[4]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textDescripcionH'=>[
                        'label'=>'Descripción H',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textDescripcionM'=>[
                        'label'=>'Descripción M',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRango'=>[
                        'label'=>'Rango',
                        'rules'=>'required|max_length[3]|numeric',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'numeric'=>'{field} solo deben ser números',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ]
                ]);
                log_message('info','[CATPUESTOS|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textArea = $this->request->getPost('textArea'),
                    $textPuesto = $this->request->getPost('textPuesto'),
                    $textDescripH = $this->request->getPost('textDescripcionH'),
                    $textDescripM = $this->request->getPost('textDescripcionM'),
                    $textRango = $this->request->getPost('textRango'),
                    $textComent = $this->request->getPost('textComentario'),
                ];
                log_message('notice','[CATPUESTOS|Async] {user} esta intentando grabar registros en estructura puestos.', $log_extra);
                log_message('info','[CATPUESTOS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATPUESTOS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPUESTOS|Async] Reglas de validacion aceptadas');
                    log_message('info','[CATPUESTOS|Async] Enviando datos verificar duplicidad');
                    if($datosDuplicados=$this->modeloCatalogos->buscarDuplicadosPuestos($datosParaGuardar)){
                        log_message('info','[CATPUESTOS|Async] Retorno de datos esperando respuesta y notificando');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CATPUESTOS|Async] No se detecto registros duplicados continua proceso de guardar.');
                        if($retorno=$this->modeloCatalogos->guardarDatosPuestos($datosParaGuardar)){
                            log_message('info','[CATPUESTOS|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[CATPUESTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATPUESTOS|Async] Metodo envio no reconocido termina proceso');
                return false;
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPUESTOS|Async] Error al obtener datos para renderizado de tabla puestos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function buscarEditarPuestos($id)
    {
        try {
            log_message('info','[CATPUESTOS|Async] Solicitando datos para renderizado de edición');
            $datosEditar=$this->modeloCatalogos->buscarDatosPuestos($id);
            log_message('info','[CATPUESTOS|Async] Envio de datos para renderizado de inputs');
            return json_encode($datosEditar);

        } catch (\RuntimeException $error) {
            log_message('error','[CATPUESTOS|Async] Error al obtener datos para renderizado de tabla puestos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function actualizarPuestos()
    {
        try {
            log_message('info','[CATPUESTOS|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[CATPUESTOS|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textArea'=>[
                        'label'=>'Área',
                        'rules'=>'required|min_length[4]|max_length[12]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textPuesto'=>[
                        'label'=>'Puesto',
                        'rules'=>'required|min_length[4]|max_length[12]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textDescripcionH'=>[
                        'label'=>'Descripción H',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textDescripcionM'=>[
                        'label'=>'Descripción M',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRango'=>[
                        'label'=>'Rango',
                        'rules'=>'required|max_length[3]|numeric',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'numeric'=>'{field} solo deben ser números',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ]
                ]);
                log_message('info','[CATPUESTOS|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textArea = $this->request->getPost('textArea'),
                    $textPuesto = $this->request->getPost('textPuesto'),
                    $textDescripH = $this->request->getPost('textDescripcionH'),
                    $textDescripM = $this->request->getPost('textDescripcionM'),
                    $textRango = $this->request->getPost('textRango'),
                    $textComent = $this->request->getPost('textComentario'),
                ];
                log_message('info','[CATPUESTOS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATPUESTOS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPUESTOS|Async] Reglas de validacion aceptadas');
                    log_message('info','[CATPUESTOS|Async] Enviando datos para la actualización');
                    if($this->modeloCatalogos->actualizarDatosPuestos($datosParaActualizar)){
                        log_message('info','[CATPUESTOS|Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CATPUESTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATPUESTOS|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPUESTOS|Async] Error al obtener datos para renderizado de tabla puestos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }

    }

    public function eliminarPuestos($id)
    {
        try {
            log_message('info','[CATPUESTOS|Async] Metodo envio reconocido continua proceso');
            log_message('info','[CATPUESTOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $id,
            ];
            if($this->modeloCatalogos->eliminarDatosPuestos($datosParaEliminar)){
                log_message('info','[CATPUESTOS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                return json_encode($swalMensajes);
            }else {
                log_message('info','[CATPUESTOS|Async] Ocurrio un error al guardar los datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al eliminar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPUESTOS|Async] Error al obtener datos para renderizado de tabla puestos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function catperfiles()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>$respuesta[1]['NOMSEO_RPLA'].' | '.$respuesta[0]['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta[0]['TITULOPANT_CONW'],
            'robots'=>$respuesta[0]['ROBOTS_CONW'],
            'Keyword'=>$respuesta[0]['KEYWORD_CONW'],
            'descripcion'=>$respuesta[0]['DESCRIPCION_CONW'],
            'footer'=>$respuesta[1]['NOMBRE_RPLA'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CATPERFILES] Cargando modulo catalogos para {user} con privilegios {grupo}.',$log_extra);
        return view('Sistema/Catalogos/vCatPerfiles',$cadena);
    }

    public function controlAccionesPerfiles()
    {
        
    }

    public function llenarTablaPerfiles()
    {
        log_message('info','[CATPERFILES|Async] Solicitando datos para renderizado de tabla perfiles');
        try {
            $tablaDatos = $this->modeloCatalogos->llenarDatosTablaPerfiles();
            log_message('info','[CATPERFILES|Async] Envio de datos para renderizado de tabla perfiles');
            return json_encode($tablaDatos);

        } catch (\RuntimeException $error) {
            log_message('error','[CATPERFILES|Async] Error al obtener datos para renderizado de tabla perfiles: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function armarMenuAsignaPerfiles()
    {
        try {
            log_message('info','[CATPERFILES|Async] Solicitando datos para armado de menu para asignación.');
            $datosParaMenu=$this->modeloCatalogos->armarDatosMenuAsignaPerfiles();
            log_message('info','[CATPERFILES|Async] Envio de datos para renderizado de menu para asignación.');
            return json_encode($datosParaMenu);

        } catch (\RuntimeException $error) {
            log_message('error','[CATPERFILES|Async] Error al obtener datos para renderizado de tabla perfiles: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }

    }

    public function guardarPerfiles()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATPERFILESAsync]  Verificando el método de envio de datos al servidor');
            if($this->request->getMethod('POST')){
                $reglasValidacion = $this->validate([
                    'textArea'=>[
                        'label'=>'Área',
                        'rules'=>'required|min_length[4]|max_length[12]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textPuesto'=>[
                        'label'=>'Puesto',
                        'rules'=>'required|min_length[4]|max_length[12]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
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
                log_message('info','[CATPERFILESAsync] Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textArea = $this->request->getPost('textArea'),
                    $textPuesto = $this->request->getPost('textPuesto'),
                    $textComent = $this->request->getPost('textComentario'),
                    $menuRoles = $this->request->getPost('menuRoles[]'),
                ];
                log_message('info','[CATPERFILESAsync] Inicializando reglas de validación.');
                if(!$reglasValidacion){
                    log_message('info','[CATPERFILESAsync] Las reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPERFILESAsync] Reglas de validacion aceptadas');
                    log_message('info','[CATPERFILESAsync] Enviando datos para verificar duplicidad.');
                    if($datosDuplicados=$this->modeloCatalogos->buscarDuplicadosPerfiles($datosParaGuardar)){
                        log_message('info','[CATPERFILESAsync] Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CATPERFILESAsync] No se detecto registros duplicados.');
                        if($retorno=$this->modeloCatalogos->guardarDatosPerfiles($datosParaGuardar)){
                            log_message('info','[CATPERFILESAsync] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[CATPERFILESAsync] Ocurrio un error al guardar los datos, notificando');
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
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'error',
                    'text'=>'Metodo de envio no aceptado.',
                    'estatus'=>'invalido',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPERFILES|Async] Error al obtener datos para renderizado de tabla perfiles: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function buscarEditarPerfiles($id)
    {
        try {
            log_message('info','[PERFILES|Async] Verificando el método de envio para busqueda');
            if($this->request->getMethod('POST')){
                log_message('info','[PERFILES|Async] Metodo envio reconocido continua proceso busqueda');
                $datosParaBuscar=[
                    $captura = session()->get('IDCLIENTE'),
                    $idRegistro = $id,
                ];
                log_message('info','[PERFILES|Async] Solicitando datos para renderizado de edición');
                if($datosEditar=$this->modeloCatalogos->buscarDatosPerfiles($datosParaBuscar)){
                    log_message('info','[PERFILES|Async] Envio de datos para renderizado de inputs en formulario');
                    return json_encode($datosEditar);
                }else {
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'No se encontraron valores en la base.',
                        'estatus'=>'invalido',
                    ];
                    return json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[PERFILES|Async] Metodo envio no reconocido termina proceso busqueda');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'warning',
                    'text'=>'No se encontraron valores en la base.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[PERFILES|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function actualizarPerfiles()
    {
        try {
            log_message('info','[PERFILES|Async] Verificando el método de envio para actualizar');
            if($this->request->getMethod('POST')){
                log_message('info','[PERFILES|Async] Metodo envio reconocido continua proceso actualizar');
                $reglasValidacion = $this->validate([
                    'textPuesto'=>[
                        'label'=>'Puesto',
                        'rules'=>'required|min_length[4]|max_length[12]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
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
                log_message('info','[PERFILES|Async] Creando variables con arreglo de los campos del formulario');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textPuesto = $this->request->getPost('textPuesto'),
                    $textComent = $this->request->getPost('textComentario'),
                    $menuRoles = $this->request->getPost('menuRoles[]'),
                ];
                log_message('info','[PERFILES|Async] Inicializando reglas de validación.');
                if(!$reglasValidacion){
                    log_message('info','[PERFILES|Async] Las reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[PERFILES|Async] Reglas de validacion aceptadas');
                    log_message('info','[PERFILES|Async] Enviando datos para la actualización');
                    if($respuestaAviso=$this->modeloCatalogos->actualizarDatosPerfiles($datosParaActualizar)){
                        log_message('info','[PERFILES|Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[PERFILES|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[PERFILES|Async] Metodo envio no reconocido termina proceso actualizar');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'error',
                    'text'=>'Metodo de envio no aceptado.',
                    'estatus'=>'invalido',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[PERFILES|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function eliminarPerfiles($id)
    {
        try {
            log_message('info','[PERFILES|Async] Metodo envio reconocido continua proceso');
            log_message('info','[PERFILES|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $id,
            ];
            if($this->modeloCatalogos->eliminarDatosPerfiles($datosParaEliminar)){
                log_message('info','[PERFILES|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                return json_encode($swalMensajes);
            }else {
                log_message('info','[PERFILES|Async] Ocurrio un error al guardar los datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al eliminar los datos.',
                    'estatus'=>'error',
                ];
    
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[PERFILES|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function catestatus()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>$respuesta['TITULO_CONW'].' | SAPT',
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'footer'=>$respuesta[1]['NOMBRE_RPLA'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[ESTATUS] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vEstatus').view('Plantilla/vFooter');
    }

    public function controlAccionesEstatus()
    {
        
    }

    public function llenarTablaEstatus()
    {
        try {
            log_message('info','[ESTATUS|Async] Solicitando datos para renderizado de tabla areas');
            $tablaDatos = $this->modeloCatalogos->llenarDatosTablaEstatus();
            log_message('info','[ESTATUS|Async] Envio de datos para renderizado de tabla areas');
            return json_encode($tablaDatos);

        } catch (\RuntimeException $error) {
            log_message('error','[ESTATUS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function guardarEstatus()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[ESTATUS|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[ESTATUS|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textClave'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[3]|max_length[4]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRango'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|numeric',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'numeric'=>'{field} solo deben ser números',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ]
                ]);
                log_message('info','[ESTATUS|Async]  Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textDescrip = $this->request->getPost('textDescripcion'),
                    $textRango = $this->request->getPost('textRango'),
                    $textComent = $this->request->getPost('textComentario'),
                ];
                log_message('notice','[ESTATUS|Async] Usuario {user} esta intentando grabar registros en catalogo areas.', $log_extra);
                log_message('info','[ESTATUS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[ESTATUS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[ESTATUS|Async] Reglas de validacion aceptadas');
                    log_message('info','[ESTATUS|Async] Enviando datos verificar duplicidad');
                    if($datosDuplicados=$this->modeloCatalogos->buscarDuplicadosEstatus($datosParaGuardar)){
                        log_message('info','[ESTATUS|Async] Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
    
                    }else {
                        log_message('info','[ESTATUS|Async] No se detecto registros duplicados.');
                        if($retorno=$modeloCatalogos->guardarDatosEstatus($datosParaGuardar)){
                            log_message('info','[ESTATUS|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[ESTATUS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[ESTATUS|Async] Metodo envio no reconocido termina proceso');
                return false;
            }

        } catch (\RuntimeException $error) {
            log_message('error','[PERFILES|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function buscarEditarEstatus($id)
    {
        log_message('info','[ESTATUS|Async] Solicitando datos para renderizado de edición de areas');
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[ESTATUS|Async/Q] {user} Solicito busqueda de datos para modificar catalogo de estatus.', $log_extra);
            if($datosEditar=$this->modeloCatalogos->buscarDatosEditarEstatus($datosParaBuscar)){
                log_message('info','[ESTATUS|Async] Envio de datos para renderizado de edición de areas');
                return json_encode($datosEditar);
            }else {
                log_message('info','[ESTATUS|Async] No se encontraron resultados o ocurrio un error, notificando.');
                $swalMensajes=[
                    'title'=>'No datos',
                    'button'=>'Ok',
                    'icon'=>'warning',
                    'text'=>'No se encontraron registro o ocurrio un error.',
                    'estatus'=>'noencontrado',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[ESTATUS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function actualizarEstatus()
    {
        try {
            log_message('info','[ESTATUS|Async] Verificando el método de envio para actualizar');
            if($this->request->getMethod('POST')){
                log_message('info','[ESTATUS|Async] Metodo envio reconocido continua proceso de actualización');
                log_message('info','[ESTATUS|Async] Creando las reglas de validación para la actualización');
                $reglasValidacion = $this->validate([
                    'textClave'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[3]|max_length[4]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textDescripcion'=>[
                        'label'=>'Descripción',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRango'=>[
                        'label'=>'Descripción',
                        'rules'=>'required',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textComentario'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ]
                ]);
                log_message('info','[ESTATUS|Async] Creando variables con arreglo de los datos a actualizar');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textDescrip = $this->request->getPost('textDescripcion'),
                    $textRango = $this->request->getPost('textRango'),
                    $textComent = $this->request->getPost('textComentario'),
                ];
                log_message('info','[ESTATUS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[ESTATUS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[ESTATUS|Async] Reglas de validacion aceptadas');
                    log_message('info','[ESTATUS|Async] Enviando datos al modelo para la actualización');
                    if($this->modeloCatalogos->actualizarDatosEstatus($datosParaActualizar)){
                        log_message('info','[ESTATUS|Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'actualizado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[ESTATUS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[ESTATUS|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[ESTATUS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function eliminarEstatus($id)
    {
        try {
            log_message('info','[ESTATUS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textClave = $id,
            ];
            log_message('info','[ESTATUS|Async] Enviando datos al modelo para eliminar.');
            if($this->modeloCatalogos->eliminarDatosEstatus($datosParaEliminar)){
                log_message('info','[ESTATUS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                return json_encode($swalMensajes);
            }else {
                log_message('info','[ESTATUS|Async] Ocurrio un error al eliminar datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al eliminar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[ESTATUS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }

    }

    public function catproveedor()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>$respuesta['TITULO_CONW'].' | SAPT',
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'footer'=>$respuesta[1]['NOMBRE_RPLA'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CATPROVEEDOR] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vCatProveedor').view('Plantilla/vFooter');
    }

    public function controlAccionesProveedor()
    {
        
    }

    public function llenarTablaProvedor()
    {
        try {
            log_message('info','[CATPROVEEDOR|Async] Solicitando datos para renderizado de tabla proveedores');
            $datosTabla=$this->modeloCatalogos->llenarDatosTablaProvedor();
            log_message('info','[CATPROVEEDOR|Async] Solicitando datos para renderizado de tabla proveedores');
            return json_encode($datosTabla);

        } catch (\RuntimeException $error) {
            log_message('error','[CATPROVEEDOR|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function guardarProveedor()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATPROVEEDOR|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[CATPROVEEDOR|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textClave'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[3]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textTipoPersona'=>[
                        'label'=>'T. Persona',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textNombre'=>[
                        'label'=>'Nombre',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRazonSocial'=>[
                        'label'=>'Razón Social',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textBeneficiario'=>[
                        'label'=>'Beneficiario',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRFC'=>[
                        'label'=>'RFC',
                        'rules'=>'required|max_length[14]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textFolioCIF'=>[
                        'label'=>'Folio CIF',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textCURP'=>[
                        'label'=>'CURP',
                        'rules'=>'max_length[18]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textDevoluciones'=>[
                        'label'=>'Devolucion',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textProvee'=>[
                        'label'=>'Provee',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textComentsGral'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textNombreUbic'=>[
                        'label'=>'Ubicación',
                        'rules'=>'required|max_length[10]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textEstado'=>[
                        'label'=>'Estado',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textMunicipio'=>[
                        'label'=>'Municipio',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textCodigoPostal'=>[
                        'label'=>'C.P.',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textColonia'=>[
                        'label'=>'Colonia',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textCalle'=>[
                        'label'=>'Calle',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textNexter'=>[
                        'label'=>'N. Ext.',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textNinter'=>[
                        'label'=>'N. Int.',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textReferencia'=>[
                        'label'=>'Referencia',
                        'rules'=>'max_length[300]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textNombreContacto'=>[
                        'label'=>'Contacto',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textTelefono'=>[
                        'label'=>'Telefono',
                        'rules'=>'required|max_length[15]|numeric',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'numeric'=>'{field} debe ser solo números.',
                        ],
                    ],
                    'textMovil'=>[
                        'label'=>'Movil',
                        'rules'=>'max_length[15]',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textCorreo'=>[
                        'label'=>'Email',
                        'rules'=>'required|max_length[80]|valid_email',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'numeric'=>'{field} debe ser solo números.',
                            'valid_email'=>'{field} contiene un correo no válido',
                        ],
                    ],
                    'textComentsCont'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],

                ]);
                log_message('info','[CATPROVEEDOR|Async]  Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textTipoPersona = $this->request->getPost('textTipoPersona'),
                    $textNombre = $this->request->getPost('textNombre'),
                    $textRazonSocial = $this->request->getPost('textRazonSocial'),
                    $textBeneficiario = $this->request->getPost('textBeneficiario'),
                    $textRFC = $this->request->getPost('textRFC'),
                    $textFolioCIF = $this->request->getPost('textFolioCIF'),
                    $textCURP = $this->request->getPost('textCURP'),
                    $textDevoluciones = $this->request->getPost('textDevoluciones'),
                    $textProvee = $this->request->getPost('textProvee'),
                    $textGrupoProvee = $this->request->getPost('textGrupoProvee'),
                    $textComentsGral = $this->request->getPost('textComentsGral'),
                    $textNombreUbic = $this->request->getPost('textNombreUbic'),
                    $textEstado = $this->request->getPost('textEstado'),
                    $textMunicipio = $this->request->getPost('textMunicipio'),
                    $textCodigoPostal = $this->request->getPost('textCodigoPostal'),
                    $textColonia = $this->request->getPost('textColonia'),
                    $textCalle = $this->request->getPost('textCalle'),
                    $textNexter = $this->request->getPost('textNexter'),
                    $textNinter = $this->request->getPost('textNinter'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textNombreContacto = $this->request->getPost('textNombreContacto'),
                    $textTelefono = $this->request->getPost('textTelefono'),
                    $textMovil = $this->request->getPost('textMovil'),
                    $textCorreo = $this->request->getPost('textCorreo'),
                    $textComentsCont = $this->request->getPost('textComentsCont'),
                ];
                log_message('notice','[CATPROVEEDOR|Async] {user} esta intentando grabar registros en catalogo proveedor.', $log_extra);
                log_message('info','[CATPROVEEDOR|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATPROVEEDOR|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPROVEEDOR|Async] Reglas de validacion aceptadas');
                    log_message('info','[CATPROVEEDOR|Async] Enviando datos verificar duplicidad');
                    if($datosDuplicados=$this->modeloCatalogos->buscarDuplicadosProveedor($datosParaGuardar)){
                        log_message('info','[CATPROVEEDOR|Async] Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
    
                    }else {
                        log_message('info','[CATPROVEEDOR|Async] No se detecto registros duplicados.');
                        if($retorno=$this->modeloCatalogos->guardarDatosProveedor($datosParaGuardar)){
                            log_message('info','[CATPROVEEDOR|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[CATPROVEEDOR|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATPROVEEDOR|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPROVEEDOR|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function buscarEditarProveedor($id)
    {
        log_message('info','[CATPROVEEDOR|Async] Solicitando datos para renderizado de edición de areas');
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[CATPROVEEDOR|Async/Q] {user} Solicito busqueda de datos para modificar catalogo de estatus.', $log_extra);
            if($datosEditar=$this->modeloCatalogos->buscarDatosEditarProveedor($datosParaBuscar)){
                log_message('info','[CATPROVEEDOR|Async] Envio de datos para renderizado de edición de areas');
                return json_encode($datosEditar);
            }else {
                log_message('info','[CATPROVEEDOR|Async] No se encontraron resultados o ocurrio un error, notificando.');
                $swalMensajes=[
                    'title'=>'No datos',
                    'button'=>'Ok',
                    'icon'=>'warning',
                    'text'=>'No se encontraron registro o ocurrio un error.',
                    'estatus'=>'noencontrado',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPROVEEDOR|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function actualizarProveedor()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATPROVEEDOR|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[CATPROVEEDOR|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textIdProv'=>[
                        'label'=>'textIdProv',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textClave'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[3]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textTipoPersona'=>[
                        'label'=>'T. Persona',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textNombre'=>[
                        'label'=>'Nombre',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRazonSocial'=>[
                        'label'=>'Razón Social',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textBeneficiario'=>[
                        'label'=>'Beneficiario',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textRFC'=>[
                        'label'=>'RFC',
                        'rules'=>'required|max_length[14]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textFolioCIF'=>[
                        'label'=>'Folio CIF',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textCURP'=>[
                        'label'=>'CURP',
                        'rules'=>'max_length[18]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textDevoluciones'=>[
                        'label'=>'Devolucion',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textProvee'=>[
                        'label'=>'Provee',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textComentsGral'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textIdUbica'=>[
                        'label'=>'textIdUbica',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textNombreUbic'=>[
                        'label'=>'Ubicación',
                        'rules'=>'required|max_length[10]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textEstado'=>[
                        'label'=>'Estado',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textMunicipio'=>[
                        'label'=>'Municipio',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textCodigoPostal'=>[
                        'label'=>'C.P.',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textColonia'=>[
                        'label'=>'Colonia',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textCalle'=>[
                        'label'=>'Calle',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textNexter'=>[
                        'label'=>'N. Ext.',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textNinter'=>[
                        'label'=>'N. Int.',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textReferencia'=>[
                        'label'=>'Referencia',
                        'rules'=>'max_length[300]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textIdContac'=>[
                        'label'=>'textIdContac',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textNombreContacto'=>[
                        'label'=>'Contacto',
                        'rules'=>'required|max_length[30]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textTelefono'=>[
                        'label'=>'Telefono',
                        'rules'=>'required|max_length[15]|numeric',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'numeric'=>'{field} debe ser solo números.',
                        ],
                    ],
                    'textMovil'=>[
                        'label'=>'Movil',
                        'rules'=>'max_length[15]',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textCorreo'=>[
                        'label'=>'Email',
                        'rules'=>'required|max_length[80]|valid_email',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'numeric'=>'{field} debe ser solo números.',
                            'valid_email'=>'{field} contiene un correo no válido',
                        ],
                    ],
                    'textComentsCont'=>[
                        'label'=>'Comentarios',
                        'rules'=>'max_length[500]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],

                ]);
                log_message('info','[CATPROVEEDOR|Async]  Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textIdProv = $this->request->getPost('textIdProv'),
                    $textClave = $this->request->getPost('textClave'),
                    $textTipoPersona = $this->request->getPost('textTipoPersona'),
                    $textNombre = $this->request->getPost('textNombre'),
                    $textRazonSocial = $this->request->getPost('textRazonSocial'),
                    $textBeneficiario = $this->request->getPost('textBeneficiario'),
                    $textRFC = $this->request->getPost('textRFC'),
                    $textFolioCIF = $this->request->getPost('textFolioCIF'),
                    $textCURP = $this->request->getPost('textCURP'),
                    $textDevoluciones = $this->request->getPost('textDevoluciones'),
                    $textProvee = $this->request->getPost('textProvee'),
                    $textGrupoProvee = $this->request->getPost('textGrupoProvee'),
                    $textComentsGral = $this->request->getPost('textComentsGral'),
                    $textIdUbica = $this->request->getPost('textIdUbica'),
                    $textNombreContacto = $this->request->getPost('textNombreContacto'),
                    $textEstado = $this->request->getPost('textEstado'),
                    $textMunicipio = $this->request->getPost('textMunicipio'),
                    $textCodigoPostal = $this->request->getPost('textCodigoPostal'),
                    $textColonia = $this->request->getPost('textColonia'),
                    $textCalle = $this->request->getPost('textCalle'),
                    $textNexter = $this->request->getPost('textNexter'),
                    $textNinter = $this->request->getPost('textNinter'),
                    $textReferencia = $this->request->getPost('textReferencia'),
                    $textIdContac = $this->request->getPost('textIdContac'),
                    $textNombreContacto = $this->request->getPost('textNombreContacto'),
                    $textTelefono = $this->request->getPost('textTelefono'),
                    $textMovil = $this->request->getPost('textMovil'),
                    $textCorreo = $this->request->getPost('textCorreo'),
                    $textComentsCont = $this->request->getPost('textComentsCont'),
                ];
                log_message('notice','[CATPROVEEDOR|Async] {user} esta intentando grabar registros en catalogo proveedor.', $log_extra);
                log_message('info','[CATPROVEEDOR|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATPROVEEDOR|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPROVEEDOR|Async] No se detecto registros duplicados.');
                    if($retorno=$this->modeloCatalogos->actualizarDatosProveedor($datosParaGuardar)){
                        log_message('info','[CATPROVEEDOR|Async] Los registros se grabaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CATPROVEEDOR|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATPROVEEDOR|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPROVEEDOR|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function eliminarProveedor($id)
    {
        try {
            log_message('info','[CATPROVEEDOR|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textClave = $id,
            ];
            log_message('info','[CATPROVEEDOR|Async] Enviando datos al modelo para eliminar.');
            if($this->modeloCatalogos->eliminarDatosProveedor($datosParaEliminar)){
                log_message('info','[CATPROVEEDOR|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                return json_encode($swalMensajes);
            }else {
                log_message('info','[CATPROVEEDOR|Async] Ocurrio un error al eliminar datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al eliminar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPROVEEDOR|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }

    }

    public function catproductos()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>$respuesta['TITULO_CONW'].' | SAPT',
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'footer'=>$respuesta[1]['NOMBRE_RPLA'],
            'pantalla'=>$id,
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CATPRODUCTOS] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vCatProductos').view('Plantilla/vFooter');
    }

    public function controlAccionesProducto()
    {
        
    }

    public function llenarTablaProducto()
    {
        try {
            log_message('info','[CATPRODUCTOS|Async] Solicitando datos para renderizado de tabla proveedores');
            $datosTabla=$this->modeloCatalogos->llenarDatosTablaProducto();
            log_message('info','[CATPRODUCTOS|Async] Solicitando datos para renderizado de tabla proveedores');
            return json_encode($datosTabla);

        } catch (\RuntimeException $error) {
            log_message('error','[CATPRODUCTOS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function guardarProductos()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATPRODUCTOS|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[CATPRODUCTOS|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textClave'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[3]|max_length[6]|alpha',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
                        ],
                    ],
                    'textCodBarras'=>[
                        'label'=>'Cód Barras',
                        'rules'=>'required|max_length[16]|string',
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
                    'textDescEditable'=>[
                        'label'=>'Editable',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textTipoProducto'=>[
                        'label'=>'Tipo Producto',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textInventariable'=>[
                        'label'=>'Inventariable',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textTipoEmpaque'=>[
                        'label'=>'Tipo Empaque',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textAlto'=>[
                        'label'=>'Beneficiario',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textAncho'=>[
                        'label'=>'RFC',
                        'rules'=>'max_length[14]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textLargo'=>[
                        'label'=>'Folio CIF',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textPesoW'=>[
                        'label'=>'CURP',
                        'rules'=>'max_length[18]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
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
                log_message('info','[CATPRODUCTOS|Async]  Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textCodBarras = $this->request->getPost('textCodBarras'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textDescEditable = $this->request->getPost('textDescEditable'),
                    $textTipoProducto = $this->request->getPost('textTipoProducto'),
                    $textInventariable = $this->request->getPost('textInventariable'),
                    $textTipoEmpaque = $this->request->getPost('textTipoEmpaque'),
                    $textAlto = $this->request->getPost('textAlto'),
                    $textAncho = $this->request->getPost('textAncho'),
                    $textLargo = $this->request->getPost('textLargo'),
                    $textPesoW = $this->request->getPost('textPesoW'),
                    $textComentarios = $this->request->getPost('textComentarios'),
                ];
                log_message('notice','[CATPRODUCTOS|Async] {user} esta intentando grabar registros en catalogo productos.', $log_extra);
                log_message('info','[CATPRODUCTOS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATPRODUCTOS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPRODUCTOS|Async] Reglas de validacion aceptadas');
                    log_message('info','[CATPRODUCTOS|Async] Enviando datos verificar duplicidad');
                    if($datosDuplicados=$this->modeloCatalogos->buscarDuplicadosProductos($datosParaGuardar)){
                        log_message('info','[CATPRODUCTOS|Async] Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        return json_encode($swalMensajes);
    
                    }else {
                        log_message('info','[CATPRODUCTOS|Async] No se detecto registros duplicados.');
                        if($retorno=$this->modeloCatalogos->guardarDatosProductos($datosParaGuardar)){
                            log_message('info','[CATPRODUCTOS|Async] Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            return json_encode($swalMensajes);
                        }else {
                            log_message('info','[CATPRODUCTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATPRODUCTOS|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPRODUCTOS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function buscarEditarProductos($id)
    {
        log_message('info','[CATPRODUCTO|Async] Solicitando datos para renderizado de edición de areas');
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[CATPRODUCTO|Async/Q] {user} Solicito busqueda de datos para modificar catalogo de productos.', $log_extra);
            if($datosEditar=$this->modeloCatalogos->buscarDatosEditarProductos($datosParaBuscar)){
                log_message('info','[CATPRODUCTO|Async] Envio de datos para renderizado de edición de productos');
                return json_encode($datosEditar);
            }else {
                log_message('info','[CATPRODUCTO|Async] No se encontraron resultados o ocurrio un error, notificando.');
                $swalMensajes=[
                    'title'=>'No datos',
                    'button'=>'Ok',
                    'icon'=>'warning',
                    'text'=>'No se encontraron registro o ocurrio un error.',
                    'estatus'=>'noencontrado',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPRODUCTO|Async] Error al obtener datos para renderizado de tabla productos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function actualizarProductos()
    {
        try {
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[CATPRODUCTOS|Async] Verificando el método de envio');
            if($this->request->getMethod('POST')){
                log_message('info','[CATPRODUCTOS|Async] Metodo envio reconocido continua proceso');
                $reglasValidacion = $this->validate([
                    'textClave'=>[
                        'label'=>'Clave',
                        'rules'=>'required|min_length[3]|max_length[16]|alpha_numeric',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'min_length'=>'{field} dene tener min {param} caracteres',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                            'alpha'=>'{field} solo deben ser letras',
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
                    'textDescEditable'=>[
                        'label'=>'Editable',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textTipoProducto'=>[
                        'label'=>'Tipo Producto',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textInventariable'=>[
                        'label'=>'Inventariable',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textTipoEmpaque'=>[
                        'label'=>'Tipo Empaque',
                        'rules'=>'required|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                        ],
                    ],
                    'textAlto'=>[
                        'label'=>'Beneficiario',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textAncho'=>[
                        'label'=>'RFC',
                        'rules'=>'max_length[14]|string',
                        'errors'=>[
                            'required'=>'{field} es requerido.',
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textLargo'=>[
                        'label'=>'Folio CIF',
                        'rules'=>'max_length[30]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
                        ],
                    ],
                    'textPesoW'=>[
                        'label'=>'CURP',
                        'rules'=>'max_length[18]|string',
                        'errors'=>[
                            'max_length'=>'{field} dene tener max {param} caracteres',
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
                log_message('info','[CATPRODUCTOS|Async]  Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textClave = $this->request->getPost('textClave'),
                    $textDescripcion = $this->request->getPost('textDescripcion'),
                    $textDescEditable = $this->request->getPost('textDescEditable'),
                    $textTipoProducto = $this->request->getPost('textTipoProducto'),
                    $textInventariable = $this->request->getPost('textInventariable'),
                    $textTipoEmpaque = $this->request->getPost('textTipoEmpaque'),
                    $textAlto = $this->request->getPost('textAlto'),
                    $textAncho = $this->request->getPost('textAncho'),
                    $textLargo = $this->request->getPost('textLargo'),
                    $textPesoW = $this->request->getPost('textPesoW'),
                    $textComentarios = $this->request->getPost('textComentarios'),
                ];
                log_message('notice','[CATPRODUCTOS|Async] {user} esta intentando grabar registros en catalogo productos.', $log_extra);
                log_message('info','[CATPRODUCTOS|Async] Inicializando Validación de reglas...');
                if(!$reglasValidacion){
                    log_message('info','[CATPRODUCTOS|Async] Reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'info',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
    
                    return json_encode($swalMensajes);
                }else{
                    log_message('info','[CATPRODUCTOS|Async] No se detecto registros duplicados.');
                    if($retorno=$this->modeloCatalogos->actualizarDatosProductos($datosParaGuardar)){
                        log_message('info','[CATPRODUCTOS|Async] Los registros se grabaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        return json_encode($swalMensajes);
                    }else {
                        log_message('info','[CATPRODUCTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[CATPRODUCTOS|Async] Metodo envio no reconocido termina proceso');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al guardar los datos.',
                    'estatus'=>'error',
                ];
                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPRODUCTOS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function eliminarProductos($id)
    {
        try {
            log_message('info','[CATPRODUCTOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textClave = $id,
            ];
            log_message('info','[CATPRODUCTOS|Async] Enviando datos al modelo para eliminar.');
            if($this->modeloCatalogos->eliminarDatosProductos($datosParaEliminar)){
                log_message('info','[CATPRODUCTOS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                return json_encode($swalMensajes);
            }else {
                log_message('info','[CATPRODUCTOS|Async] Ocurrio un error al eliminar datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al eliminar los datos.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }

        } catch (\RuntimeException $error) {
            log_message('error','[CATPRODUCTOS|Async] Error al obtener datos para renderizado de tabla productos: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }

    }



    public function llenarComboAreas()
    {
        try {
            log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo areas');
            $datosParaCombo=$this->modeloCatalogos->llenarDatosComboAreas();
            return json_encode($datosParaCombo);

        } catch (\RuntimeException $error) {
            log_message('error','[CATALOGOS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function llenarComboPuestos($id)
    {
        try {
            $modeloCatalogos= new Mcatalogos;
            log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo puestos');
            $datosParaCombo=$modeloCatalogos->llenarDatosComboPuestos($id);
            return json_encode($datosParaCombo);

        } catch (\RuntimeException $error) {
            log_message('error','[CATALOGOS|Async] Error al obtener datos para renderizado de tabla areas: ' . $error->getMessage());
            return json_encode(['error' => $error->getMessage()]);
        }
    }

    public function llenarComboCatEstados()
    {
        $modeloCatalogos= new Mcatalogos;
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo estados');
        if($datosParaCombo=$modeloCatalogos->llenarDatosComboCatEstados())
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo estados');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboCatMunicipios($id)
    {
        $modeloCatalogos= new Mcatalogos;
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo municipios');
        if($datosParaCombo=$modeloCatalogos->llenarDatosComboCatMunicipios($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo municipios');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboCatCodPostales($id)
    {
        $modeloCatalogos= new Mcatalogos;
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo codigopostal');
        if($datosParaCombo=$modeloCatalogos->llenarDatosComboCatCodPostales($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo codigopostal');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboCatColonias($id)
    {
        $modeloCatalogos= new Mcatalogos;
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo colonias');
        if($datosParaCombo=$modeloCatalogos->llenarDatosComboCatColonias($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo colonias');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarCompletarCalles($id)
    {
        $modeloCatalogos= new Mcatalogos;
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para completar calles');
        if($datosParaCombo=$modeloCatalogos->llenarDatosCompletarCalles($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externa para completar calles');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboTipoPersonas()
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos para renderizado de combo tipo personas');
        if($datosParaCombo=$this->modeloCatalogos->llenarDatosComboTipoPersonas()){
            log_message('info','[CATALOGOS|Async] Enviando datos para renderizado de combo tipo personas');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron resultados o ocurrio un error, notificando.');
            $swalMensajes=[
                'title'=>'No datos',
                'button'=>'Ok',
                'icon'=>'warning',
                'text'=>'No se encontraron registro o ocurrio un error.',
                'estatus'=>'noencontrado',
            ];
            return json_encode($swalMensajes);
        }
    }

    public function llenarComboEstadoGral()
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo estados');
        if($datosParaCombo=$this->modeloCatalogos->llenarDatosComboEstadoGral())
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo estados');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboMunicipiosGral($id)
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo municipios');
        if($datosParaCombo=$this->modeloCatalogos->llenarDatosComboMunicipiosGral($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo municipios');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboCodPostalesGral($id)
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo codigopostal');
        if($datosParaCombo=$this->modeloCatalogos->llenarDatosComboCodPostalesGral($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo codigopostal');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboColoniasGral($id)
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo colonias');
        if($datosParaCombo=$this->modeloCatalogos->llenarDatosComboColoniasGral($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo colonias');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function autoCompletarProveedores($id)
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar lista proveedores');
        if($datosParaCombo=$this->modeloCatalogos->autoDatosCompletarProveedores($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar lista proveedores');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function llenarComboMetodosPago()
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo metodos pago');
        if($datosParaCombo=$this->modeloCatalogos->llenarDatosComboMetodosPago()){
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar combo metodos pago');
            return json_encode($datosParaCombo);
        }
    }

    public function autoCompletarProductos($id)
    {
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar lista productos');
        if($datosParaCombo=$this->modeloCatalogos->autoDatosCompletarProductos($id))
        {
            log_message('info','[CATALOGOS|Async] Enviando datos hacia la petición externapara renderizar lista productos');
            return json_encode($datosParaCombo);
        }else {
            log_message('info','[CATALOGOS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'estatus'=>'error',
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
            ];

            return json_encode($swalMensajes);
        }
    }




}


?>
