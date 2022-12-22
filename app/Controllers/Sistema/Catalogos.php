<?php
namespace App\Controllers\Sistema;
use App\Models\Sistema\Mcatalogos;
use App\Controllers\BaseController;

/**
 *
 */
class Catalogos extends BaseController
{
    public function llamandoParametrosWeb($id)
    {
        $modeloCatalogos = new Mcatalogos;
        log_message('info','[CATALOGOS] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $modeloCatalogos->llamandoDatosParametrosWeb($id)){
            log_message('info','[CATALOGOS] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function catareas()
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
            'grupo'=>$sesionIniciada->get('NIVELPERF_RESPO'),
        ];
        log_message('info','[AREAS] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vAreas').view('Plantilla/vFooter');
    }

    public function llenarTablaAreas()
    {
        $modeloCatalogos = new Mcatalogos;
        log_message('info','[AREAS|Async] Solicitando datos para renderizado de tabla areas');
        if($tablaDatos = $modeloCatalogos->llenarDatosTablaAreas()){
            log_message('info','[AREAS|Async] Envio de datos para renderizado de tabla areas');
            return $tablaDatos;
        }
    }

    public function guardarAreas()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[AREAS|Async] Verificando el método de envio');
        if($this->request->getMethod('POST')){
            log_message('info','[AREAS|Async] Metodo envio reconocido continua proceso');
            $reglasValidacion = $this->validate([
                'textArea'=>[
                    'label'=>'Clave',
                    'rules'=>'required|min_length[4]|max_length[12]|alpha',
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
            log_message('info','[Async] AREAS - Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $this->request->getPost('textArea'),
                $textDescrip = $this->request->getPost('textDescripcion'),
                $textComent = $this->request->getPost('textComentario'),
            ];
            log_message('notice','[Async] AREAS - Usuario {user} esta intentando grabar registros en catalogo areas.', $log_extra);
            log_message('info','[Async] AREAS - Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[Async] AREAS - Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                echo json_encode($swalMensajes);
            }else{
                log_message('info','[Async] AREAS - Reglas de validacion aceptadas');
                $modeloCatalogos = new Mcatalogos;
                log_message('info','[Async] AREAS - Enviando datos verificar duplicidad');
                if($datosDuplicados=$modeloCatalogos->buscarDuplicadosAreas($datosParaGuardar)){
                    log_message('info','[Async] AREAS - Retorno de datos esperando respuesta');
                    $swalMensajes=[
                        'title'=>'Advertencia',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'Existen registros con la misma clave, revise sus datos.',
                        'estatus'=>'duplicado',
                    ];
                    echo json_encode($swalMensajes);

                }else {
                    log_message('info','[Async] AREAS - No se detecto registros duplicados.');
                    if($retorno=$modeloCatalogos->guardarDatosAreas($datosParaGuardar)){
                        log_message('info','[Async] AREAS - Los registros se grabaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[Async] AREAS - Ocurrio un error al guardar los datos, notificando');
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
        }
        else {
            log_message('info','[Async] AREAS - Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function buscaEditarAreas($id)
    {
        log_message('info','[AREAS|Async] Verificando el método de envio de la petición');
        if($this->request->getMethod('POST')){
            log_message('info','[AREAS|Async] Metodo envio reconocido continua proceso de edicion');
            $modeloCatalogos = new Mcatalogos;
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[AREAS|Async] Solicitando datos para renderizado de edición de areas');
            if($datosEditar=$modeloCatalogos->buscarDatosAreas($datosParaBuscar)){
                log_message('info','[AREAS|Async] Envio de datos para renderizado de edición de areas');
                return $datosEditar;
            }else {
                log_message('info','[AREAS|Async] No se encontraron resultados o ocurrio un error, notificando.');
                $swalMensajes=[
                    'title'=>'No datos',
                    'button'=>'Ok',
                    'icon'=>'warning',
                    'text'=>'No se encontraron registro o ocurrio un error.',
                    'estatus'=>'noencontrado',
                ];
                echo json_encode($swalMensajes);
            }
        }
        else {
            log_message('info','[AREAS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function actualizarAreas()
    {
        log_message('info','[AREAS|Async] Verificando el método de envio para actualizar');
        if($this->request->getMethod('POST')){
            log_message('info','[AREAS|Async] Metodo envio reconocido continua proceso de actualización');
            log_message('info','[AREAS|Async] Creando las reglas de validación para la actualización');
            $reglasValidacion = $this->validate([
                'textArea'=>[
                    'label'=>'Clave',
                    'rules'=>'required|min_length[4]|max_length[12]|alpha',
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
            log_message('info','[AREAS|Async] Creando variables con arreglo de los datos a actualizar');
            $datosParaActualizar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $this->request->getPost('textArea'),
                $textDescrip = $this->request->getPost('textDescripcion'),
                $textComent = $this->request->getPost('textComentario'),
            ];
            log_message('info','[AREAS|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[AREAS|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                echo json_encode($swalMensajes);
            }else{
                log_message('info','[AREAS|Async] Reglas de validacion aceptadas');
                $modeloCatalogos = new Mcatalogos;
                log_message('info','[AREAS|Async] Enviando datos al modelo para la actualización');
                if($modeloCatalogos->actualizarDatosAreas($datosParaActualizar)){
                    log_message('info','[AREAS|Async] Los registros se actualizaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se grabaron correctamente.',
                        'estatus'=>'guardado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[AREAS|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[AREAS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function eliminarAreas($id)
    {
        log_message('info','[AREAS|Async] Verificando el método de envio para eliminar');
        if($this->request->getMethod('POST')){
            log_message('info','[AREAS|Async] Metodo envio reconocido continua proceso');
            log_message('info','[AREAS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $id,
            ];
            $modeloCatalogos = new Mcatalogos;
            log_message('info','[AREAS|Async] Enviando datos al modelo para eliminar.');
            if($modeloCatalogos->eliminarDatosAreas($datosParaEliminar)){
                log_message('info','[AREAS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                echo json_encode($swalMensajes);
            }else {
                log_message('info','[AREAS|Async] Ocurrio un error al eliminar datos, notificando');
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
            log_message('info','[AREAS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }

    }

    public function catpuestos()
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
            'grupo'=>$sesionIniciada->get('NIVELPERF_RESPO'),
        ];
        log_message('info','[PUESTOS] Cargando modulo catalogos para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vPuestos').view('Plantilla/vFooter');
    }

    public function llenarTablaPuestos()
    {
        $modeloCatalogos = new Mcatalogos;
        log_message('info','[PUESTOS|Async] Solicitando datos para renderizado de tabla puestos');
        if($tablaDatos = $modeloCatalogos->llenarDatosTablaPuestos()){
            log_message('info','[PUESTOS|Async] Envio de datos para renderizado de tabla puestos');
            return $tablaDatos;
        }

    }

    public function guardarPuestos()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[PUESTOS|Async] Verificando el método de envio para proceso de guardar');
        if($this->request->getMethod('POST')){
            log_message('info','[PUESTOS|Async] Metodo envio reconocido continua proceso de guardar');
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
                'textComentario'=>[
                    'label'=>'Comentarios',
                    'rules'=>'max_length[500]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ]
            ]);
            log_message('info','[PUESTOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $this->request->getPost('textArea'),
                $textPuesto = $this->request->getPost('textPuesto'),
                $textDescripH = $this->request->getPost('textDescripcionH'),
                $textDescripM = $this->request->getPost('textDescripcionM'),
                $textComent = $this->request->getPost('textComentario'),
            ];
            log_message('notice','[PUESTOS|Async] {user} esta intentando grabar registros en estructura puestos.', $log_extra);
            log_message('info','[PUESTOS|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[PUESTOS|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                echo json_encode($swalMensajes);
            }else{
                log_message('info','[PUESTOS|Async] Reglas de validacion aceptadas');
                $modeloCatalogos = new Mcatalogos;
                log_message('info','[PUESTOS|Async] Enviando datos verificar duplicidad');
                if($datosDuplicados=$modeloCatalogos->buscarDuplicadosPuestos($datosParaGuardar)){
                    log_message('info','[PUESTOS|Async] Retorno de datos esperando respuesta y notificando');
                    $swalMensajes=[
                        'title'=>'Advertencia',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'Existen registros con la misma clave, revise sus datos.',
                        'estatus'=>'duplicado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[PUESTOS|Async] No se detecto registros duplicados continua proceso de guardar.');
                    if($retorno=$modeloCatalogos->guardarDatosPuestos($datosParaGuardar)){
                        log_message('info','[PUESTOS|Async] Los registros se grabaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[PUESTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
        }
        else {
            log_message('info','[PUESTOS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function buscarEditarPuestos($id)
    {
        log_message('info','[PUESTOS|Async] Verificando el método de envio');
        if($this->request->getMethod('POST')){
            log_message('info','[PUESTOS|Async] Metodo envio reconocido continua proceso');
            $modeloCatalogos = new Mcatalogos;
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[PUESTOS|Async] Solicitando datos para renderizado de edición');
            if($datosEditar=$modeloCatalogos->buscarDatosPuestos($datosParaBuscar)){
                log_message('info','[PUESTOS|Async] Envio de datos para renderizado de inputs');
                return $datosEditar;
            }else {
                echo json_encode('no trajo nada');
            }
        }
        else {
            log_message('info','[PUESTOS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function actualizarPuestos()
    {
        log_message('info','[PUESTOS|Async] Verificando el método de envio');
        if($this->request->getMethod('POST')){
            log_message('info','[PUESTOS|Async] Metodo envio reconocido continua proceso');
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
                'textComentario'=>[
                    'label'=>'Comentarios',
                    'rules'=>'max_length[500]|string',
                    'errors'=>[
                        'max_length'=>'{field} dene tener max {param} caracteres',
                    ],
                ]
            ]);
            log_message('info','[PUESTOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaActualizar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $this->request->getPost('textArea'),
                $textPuesto = $this->request->getPost('textPuesto'),
                $textDescripH = $this->request->getPost('textDescripcionH'),
                $textDescripM = $this->request->getPost('textDescripcionM'),
                $textComent = $this->request->getPost('textComentario'),
            ];
            log_message('info','[PUESTOS|Async] Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[PUESTOS|Async] Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                echo json_encode($swalMensajes);
            }else{
                log_message('info','[PUESTOS|Async] Reglas de validacion aceptadas');
                $modeloCatalogos = new Mcatalogos;
                log_message('info','[PUESTOS|Async] Enviando datos para la actualización');
                if($modeloCatalogos->actualizarDatosPuestos($datosParaActualizar)){
                    log_message('info','[PUESTOS|Async] Los registros se actualizaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Proceso exitoso',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'Los registros se grabaron correctamente.',
                        'estatus'=>'guardado',
                    ];
                    echo json_encode($swalMensajes);
                }else {
                    log_message('info','[PUESTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[PUESTOS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }

    }

    public function eliminarPuestos($id)
    {
        log_message('info','[PUESTOS|Async] Verificando el método de envio');
        if($this->request->getMethod('POST')){
            log_message('info','[PUESTOS|Async] Metodo envio reconocido continua proceso');
            log_message('info','[PUESTOS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textArea = $id,
            ];
            $modeloCatalogos = new Mcatalogos;
            if($modeloCatalogos->eliminarDatosPuestos($datosParaEliminar)){
                log_message('info','[PUESTOS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                echo json_encode($swalMensajes);
            }else {
                log_message('info','[PUESTOS|Async] Ocurrio un error al guardar los datos, notificando');
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
            log_message('info','[PUESTOS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function catperfiles()
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
            'grupo'=>$sesionIniciada->get('NIVELPERF_RESPO'),
        ];
        log_message('info','[PERFILES] Cargando modulo catalogos para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vPerfiles').view('Plantilla/vFooter');
    }

    public function llenarTablaPerfiles()
    {
        $modeloCatalogos = new Mcatalogos;
        log_message('info','[PERFILES|Async] Solicitando datos para renderizado de tabla perfiles');
        if($tablaDatos = $modeloCatalogos->llenarDatosTablaPerfiles()){
            log_message('info','[PERFILES|Async] Envio de datos para renderizado de tabla perfiles');
            return $tablaDatos;
        }
    }

    public function armarMenuAsignaPerfiles()
    {
        log_message('info','[ASIGNAUSER|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in'==1)){
            $modeloCatalogos= new Mcatalogos;
            log_message('info','[ASIGNAUSER|Async] Solicitando datos para armado de menu para asignación.');
            if($datosParaMenu=$modeloCatalogos->armarDatosMenuAsignaPerfiles())
            {
                log_message('info','[ASIGNAUSER|Async] Envio de datos para renderizado de menu para asignación.');
                return json_encode($datosParaMenu);
            }else {
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al buscar datos.',
                    'estatus'=>'error',
                ];

                echo json_encode($swalMensajes);
            }

        }else {
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado inicie sesión de nuevo.',
                'estatus'=>'invalido',
            ];
            echo json_encode($swalMensajes);
        }

    }

    public function guardarPerfiles()
    {
        if(session()->get('logged_in'==1)){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[Async] PERFILES - Verificando el método de envio de datos al servidor');
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
                log_message('info','[Async] PERFILES- Creando variables con arreglo de los campos del formulario');
                $datosParaGuardar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textArea = $this->request->getPost('textArea'),
                    $textPuesto = $this->request->getPost('textPuesto'),
                    $textComent = $this->request->getPost('textComentario'),
                    $menuRoles = $this->request->getPost('menuRoles[]'),
                ];
                log_message('info','[Async] PERFILES Inicializando reglas de validación.');
                if(!$reglasValidacion){
                    log_message('info','[Async] PERFILES Las reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    echo json_encode($swalMensajes);
                }else{
                    log_message('info','[Async] PERFILES Reglas de validacion aceptadas');
                    $modeloCatalogos = new Mcatalogos;
                    log_message('info','[Async] PERFILES Enviando datos para verificar duplicidad.');
                    if($datosDuplicados=$modeloCatalogos->buscarDuplicadosPerfiles($datosParaGuardar)){
                        log_message('info','[Async] PERFILES Retorno de datos esperando respuesta');
                        $swalMensajes=[
                            'title'=>'Advertencia',
                            'button'=>'Entendido',
                            'icon'=>'warning',
                            'text'=>'Existen registros con la misma clave, revise sus datos.',
                            'estatus'=>'duplicado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[Async] PERFILES No se detecto registros duplicados.');
                        if($retorno=$modeloCatalogos->guardarDatosPerfiles($datosParaGuardar)){
                            log_message('info','[Async] PERFILES Los registros se grabaron correctamente, notificando.');
                            $swalMensajes=[
                                'title'=>'Proceso exitoso',
                                'button'=>'Ok',
                                'icon'=>'success',
                                'text'=>'Los registros se grabaron correctamente.',
                                'estatus'=>'guardado',
                            ];
                            echo json_encode($swalMensajes);
                        }else {
                            log_message('info','[Async] PERFILES Ocurrio un error al guardar los datos, notificando');
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

            }else {
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'error',
                    'text'=>'Metodo de envio no aceptado.',
                    'estatus'=>'invalido',
                ];
                echo json_encode($swalMensajes);
            }

        }else {
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado inicie sesión de nuevo.',
                'estatus'=>'invalido',
            ];
            echo json_encode($swalMensajes);
        }

    }

    public function buscarEditarPerfiles($id)
    {
        if(session()->get('logged_in'==1)){
            log_message('info','[Async] PERFILES Verificando el método de envio para busqueda');
            if($this->request->getMethod('POST')){
                log_message('info','[Async] PERFILES Metodo envio reconocido continua proceso busqueda');
                $modeloCatalogos = new Mcatalogos;
                $datosParaBuscar=[
                    $captura = session()->get('IDCLIENTE'),
                    $idRegistro = $id,
                ];
                log_message('info','[Async] PERFILES Solicitando datos para renderizado de edición');
                if($datosEditar=$modeloCatalogos->buscarDatosPerfiles($datosParaBuscar)){
                    log_message('info','[Async] PERFILES Envio de datos para renderizado de inputs en formulario');
                    return $datosEditar;
                }else {
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'No se encontraron valores en la base.',
                        'estatus'=>'invalido',
                    ];
                    echo json_encode($swalMensajes);
                }
            }
            else {
                log_message('info','[Async] PERFILES Metodo envio no reconocido termina proceso busqueda');
                return false;
            }

        }else {
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado inicie sesión de nuevo.',
                'estatus'=>'invalido',
            ];
            echo json_encode($swalMensajes);
        }
    }

    public function actualizarPerfiles()
    {
        if(session()->get('logged_in'==1)){
            log_message('info','[Async] PERFILES Verificando el método de envio para actualizar');
            if($this->request->getMethod('POST')){
                log_message('info','[Async] PERFILES Metodo envio reconocido continua proceso actualizar');
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
                log_message('info','[Async] PERFILES- Creando variables con arreglo de los campos del formulario');
                $datosParaActualizar=[
                    $captura = session()->get('IDCLIENTE'),
                    $textPuesto = $this->request->getPost('textPuesto'),
                    $textComent = $this->request->getPost('textComentario'),
                    $menuRoles = $this->request->getPost('menuRoles[]'),
                ];
                log_message('info','[Async] PERFILES Inicializando reglas de validación.');
                if(!$reglasValidacion){
                    log_message('info','[Async] PERFILES Las reglas de validacion fueron rechazadas');
                    $swalMensajes=[
                        'title'=>'Atención',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>$this->validator->listErrors(),
                        'estatus'=>'invalido',
                    ];
                    echo json_encode($swalMensajes);
                }else{
                    log_message('info','[Async] Reglas de validacion aceptadas');
                    $modeloCatalogos = new Mcatalogos;
                    log_message('info','[Async] Enviando datos para la actualización');
                    if($respuestaAviso=$modeloCatalogos->actualizarDatosPerfiles($datosParaActualizar)){
                        log_message('info','[Async] Los registros se actualizaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[Async] Ocurrio un error al guardar los datos, notificando');
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
                log_message('info','[Async] PERFILES Metodo envio no reconocido termina proceso actualizar');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'error',
                    'text'=>'Metodo de envio no aceptado.',
                    'estatus'=>'invalido',
                ];
                echo json_encode($swalMensajes);
            }
        }else {
            $swalMensajes=[
                'title'=>'Atención',
                'button'=>'Entendido',
                'icon'=>'warning',
                'text'=>'La sesión ha caducado inicie sesión de nuevo.',
                'estatus'=>'invalido',
            ];
            echo json_encode($swalMensajes);
        }
    }

    public function eliminarPerfil($id)
    {
        log_message('info','[PERFILES|Async] Metodo envio reconocido continua proceso');
        log_message('info','[PERFILES|Async] Creando variables con arreglo de los campos del formulario');
        $datosParaEliminar=[
            $captura = session()->get('IDCLIENTE'),
            $textArea = $id,
        ];
        $modeloCatalogos = new Mcatalogos;
        if($modeloCatalogos->eliminarDatosPerfil($datosParaEliminar)){
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
    }

    public function catestatus()
    {
        log_message('info','[ESTATUS] Comprobando sesión iniciada en el sistema.');
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
                'user'=>$sesionIniciada->get('IDCLIENTE'),
                'grupo'=>$sesionIniciada->get('NIVELPERF_RESPO'),
            ];
            log_message('info','[ESTATUS] La sesión aun es vigente se comprobando privileios');
            if($sesionIniciada->get('NIVELPERF_RESPO')=='USUARIO'){
                log_message('notice','[ESTATUS] Se encontro una sesión de {grupo} de {user} redireccionando a dashboard.',$log_extra);
                redirect()->to('/dashboard');
            }else {
                log_message('info','[ESTATUS] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
                return view('Plantilla/vHeader',$cadena).view('Sistema/Catalogos/vEstatus').view('Plantilla/vFooter');
            }
        }else {
            log_message('info','[ESTATUS] La sesión ha caducado o no existe');
            return redirect()->to('/expiro');
        }
    }

    public function llenarTablaEstatus()
    {
        $modeloCatalogos = new Mcatalogos;
        log_message('info','[ESTATUS|Async] Solicitando datos para renderizado de tabla areas');
        if($tablaDatos = $modeloCatalogos->llenarDatosTablaEstatus()){
            log_message('info','[ESTATUS|Async] Envio de datos para renderizado de tabla areas');
            return $tablaDatos;
        }else {
            log_message('info','[ESTATUS|Async] No se encontraron datos para mostrar o exportar, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function guardarEstatus()
    {
        $log_extra=[
            'user'=>session()->get('IDCLIENTE'),
        ];
        log_message('info','[ESTATUS|Async] Verificando el método de envio');
        if($this->request->getMethod('POST')){
            log_message('info','[ESTATUS|Async] Metodo envio reconocido continua proceso');
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
            log_message('info','[ESTATUS|Async] - Creando variables con arreglo de los campos del formulario');
            $datosParaGuardar=[
                $captura = session()->get('IDCLIENTE'),
                $textClave = $this->request->getPost('textClave'),
                $textDescrip = $this->request->getPost('textDescripcion'),
                $textRango = $this->request->getPost('textRango'),
                $textComent = $this->request->getPost('textComentario'),
            ];
            log_message('notice','[ESTATUS|Async] - Usuario {user} esta intentando grabar registros en catalogo areas.', $log_extra);
            log_message('info','[ESTATUS|Async] - Inicializando Validación de reglas...');
            if(!$reglasValidacion){
                log_message('info','[ESTATUS|Async] - Reglas de validacion fueron rechazadas');
                $swalMensajes=[
                    'title'=>'Atención',
                    'button'=>'Entendido',
                    'icon'=>'info',
                    'text'=>$this->validator->listErrors(),
                    'estatus'=>'invalido',
                ];

                echo json_encode($swalMensajes);
            }else{
                log_message('info','[ESTATUS|Async] - Reglas de validacion aceptadas');
                $modeloCatalogos = new Mcatalogos;
                log_message('info','[ESTATUS|Async] - Enviando datos verificar duplicidad');
                if($datosDuplicados=$modeloCatalogos->buscarDuplicadosEstatus($datosParaGuardar)){
                    log_message('info','[ESTATUS|Async] - Retorno de datos esperando respuesta');
                    $swalMensajes=[
                        'title'=>'Advertencia',
                        'button'=>'Entendido',
                        'icon'=>'warning',
                        'text'=>'Existen registros con la misma clave, revise sus datos.',
                        'estatus'=>'duplicado',
                    ];
                    echo json_encode($swalMensajes);

                }else {
                    log_message('info','[ESTATUS|Async] - No se detecto registros duplicados.');
                    if($retorno=$modeloCatalogos->guardarDatosEstatus($datosParaGuardar)){
                        log_message('info','[ESTATUS|Async] - Los registros se grabaron correctamente, notificando.');
                        $swalMensajes=[
                            'title'=>'Proceso exitoso',
                            'button'=>'Ok',
                            'icon'=>'success',
                            'text'=>'Los registros se grabaron correctamente.',
                            'estatus'=>'guardado',
                        ];
                        echo json_encode($swalMensajes);
                    }else {
                        log_message('info','[ESTATUS|Async] - Ocurrio un error al guardar los datos, notificando');
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
        }
        else {
            log_message('info','[ESTATUS|Async] - Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function buscarEditarEstatus($id)
    {
        log_message('info','[ESTATUS|Async] Verificando el método de envio de la petición');
        if($this->request->getMethod('POST')){
            log_message('info','[ESTATUS|Async] Metodo envio reconocido continua proceso de edicion');
            $modeloCatalogos = new Mcatalogos;
            $datosParaBuscar=[
                $captura = session()->get('IDCLIENTE'),
                $idRegistro = $id,
            ];
            log_message('info','[ESTATUS|Async] Solicitando datos para renderizado de edición de areas');
            if($datosEditar=$modeloCatalogos->buscarDatosEditarEstatus($datosParaBuscar)){
                log_message('info','[ESTATUS|Async] Envio de datos para renderizado de edición de areas');
                return $datosEditar;
            }else {
                log_message('info','[ESTATUS|Async] No se encontraron resultados o ocurrio un error, notificando.');
                $swalMensajes=[
                    'title'=>'No datos',
                    'button'=>'Ok',
                    'icon'=>'warning',
                    'text'=>'No se encontraron registro o ocurrio un error.',
                    'estatus'=>'noencontrado',
                ];
                echo json_encode($swalMensajes);
            }
        }
        else {
            log_message('info','[ESTATUS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }
    }

    public function actualizarEstatus()
    {
        log_message('info','[ESTATUS|Async] Verificando el método de envio para actualizar');
        if($this->request->getMethod('POST')){
            log_message('info','[ESTATUS|Async] Metodo envio reconocido continua proceso de actualización');
            log_message('info','[ESTATUS|Async] Creando las reglas de validación para la actualización');
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
                $modeloCatalogos = new Mcatalogos;
                log_message('info','[ESTATUS|Async] Enviando datos al modelo para la actualización');
                if($modeloCatalogos->actualizarDatosEstatus($datosParaActualizar)){
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
            return false;
        }
    }

    public function eliminarEstatus($id)
    {
        log_message('info','[ESTATUS|Async] Verificando el método de envio para eliminar');
        if($this->request->getMethod('POST')){
            log_message('info','[ESTATUS|Async] Metodo envio reconocido continua proceso');
            log_message('info','[ESTATUS|Async] Creando variables con arreglo de los campos del formulario');
            $datosParaEliminar=[
                $captura = session()->get('IDCLIENTE'),
                $textClave = $id,
            ];
            $modeloCatalogos = new Mcatalogos;
            log_message('info','[ESTATUS|Async] Enviando datos al modelo para eliminar.');
            if($modeloCatalogos->eliminarDatosEstatus($datosParaEliminar)){
                log_message('info','[ESTATUS|Async] Los registros se eliminaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Proceso exitoso',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'Los registros se eliminaron correctamente.',
                    'estatus'=>'eliminado',
                ];
                echo json_encode($swalMensajes);
            }else {
                log_message('info','[ESTATUS|Async] Ocurrio un error al eliminar datos, notificando');
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
            log_message('info','[ESTATUS|Async] Metodo envio no reconocido termina proceso');
            return false;
        }

    }









    public function llenarComboAreas()
    {
        $modeloCatalogos= new Mcatalogos;
        if($datosParaCombo=$modeloCatalogos->llenarComboAreas())
        {
            return json_encode($datosParaCombo);
        }else {
            return json_encode('error paso');
        }
    }

    public function llenarComboPuestos($id)
    {
        $modeloCatalogos= new Mcatalogos;
        log_message('info','[CATALOGOS|Async] Solicitando datos desde factor externo para renderizar combo puestos');
        if($datosParaCombo=$modeloCatalogos->llenarDatosComboPuestos($id))
        {
            return json_encode($datosParaCombo);
        }else {
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al buscar datos.',
                'estatus'=>'error',
            ];

            echo json_encode($swalMensajes);
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




}


?>
