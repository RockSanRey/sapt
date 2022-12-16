<?php

namespace App\Controllers\Administrador;
use App\Models\Administrador\Macobros;
use App\Controllers\BaseController;

class Cobros extends BaseController
{
    protected $modeloCobros;

    function __construct()
    {
        $this->modeloCobros = new Macobros;
    }

    public function llamandoParametrosWeb($id)
    {
        log_message('info','[ACOBROS] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $this->modeloCobros->llamandoDatosParametrosWeb($id)){
            log_message('info','[ACOBROS] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function apagoservic()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'apagoservic',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[PAGOSERVICIO] Cargando modulo pagoservic para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Cobros/vPagoServic').view('Plantilla/vFooter');        
    }

    public function cargarDeudasDetalle($id)
    {
        log_message('info','[PAGOSERVICIO] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[PAGOSERVICIO|Async] Consultando datos para llenar lista de deudas.');
            $tarifa=explode('_',$id);
            log_message('info','[PAGOSERVICIO|Async] Comprobar tarifa que tiene aplicado');
            if($tarifa[2]=='TARNOR'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSA',
                ];
            }
            if($tarifa[2]=='TARMAY'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSAD',
                ];
            }
            if($tarifa[2]=='TARNEG'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSAN',
                ];
            }
            if($tarifa[2]=='TARESP'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSAE',
                ];
            }
            if($tablaDatos=$this->modeloCobros->cargarDatosDeudasDetalle($datosRevisar)){
                return json_encode($tablaDatos);
            }else {
                log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al solicitar los datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[PAGOSERVICIO] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Sin sesión',
                'button'=>'Iniciar sesión',
                'icon'=>'error',
                'text'=>'La sesión ha caducado o no existe.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function cargarHistoricoPagado($id)
    {
        log_message('info','[PAGOSERVICIO|Async] Solicitando datos para renderizado de completar usuarios');
        if($tablaDatos = $this->modeloCobros->cargarDatosHistoricoPagado($id)){
            log_message('info','[PAGOSERVICIO|Async] Envio de datos para renderizado de completar usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function agregarConceptosDetalle()
    {
        log_message('info','[PAGOSERVICIO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $campoJson=json_decode($this->request->getBody());
            $datosParaAgregar=[
                $captura = session()->get('IDCLIENTE'),
                $textMovimiento = $campoJson->textMovimiento,
                $textConceptos = $campoJson->textConceptos,
            ];
            log_message('notice','[PAGOSERVICIO|Async] {user} esta intentando grabar conceptos en detalles.', $log_extra);
            log_message('info','[PAGOSERVICIO|Async] Enviando datos verificar duplicidad');
            if($datosDuplicados=$this->modeloCobros->buscarDuplicadosConceptosDetalle($datosParaAgregar)){
                log_message('info','[PAGOSERVICIO|Async] Retorno de datos esperando respuesta, notificando');
                $swalMensajes=[
                    'title'=>'Advertencia',
                    'button'=>'Entendido',
                    'icon'=>'warning',
                    'text'=>'Existen registros con la misma clave, revise sus datos.',
                    'estatus'=>'duplicado',
                ];
                return json_encode($swalMensajes);

            }else {
                log_message('info','[PAGOSERVICIO|Async] No se detecto registros duplicados.');
                if($this->modeloCobros->agregarDatosConceptosDetalle($datosParaAgregar)){
                    log_message('info','[PAGOSERVICIO|Async] Los registros se grabaron correctamente, notificando.');
                    $swalMensajes=[
                        'title'=>'Agregado',
                        'button'=>'Ok',
                        'icon'=>'success',
                        'text'=>'El concepto se agrego correctamente.',
                        'estatus'=>'agrego',
                    ];

                    return json_encode($swalMensajes);
                }else {
                    log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al guardar los datos, notificando');
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

    public function eliminarDetallesPago($id)
    {
        log_message('info','[PAGOSERVICIO|Async] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            log_message('info','[PAGOSERVICIO|Async] Enviando metadata para eliminar datos de la estructura pago detalle.');
            $datosParaEliminar=[
                $cajero= session()->get('IDCLIENTE'),
                $metaData= $id,
            ];
            if($this->modeloCobros->eliminarDatosDetallesPago($datosParaEliminar)){
                log_message('info','[PAGOSERVICIO|Async] Los registros se eliminaron correctamente, continua proseso de asignacion.');
                $swalMensajes=[
                    'title'=>'Eliminados',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'El registro se elimino correctamente.',
                    'estatus'=>'eliminado',
                ];

                return json_encode($swalMensajes);
            }else {
                log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al solicitar los datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al procesar el evento notificando.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }
    }

    public function buscarCooperacion($id)
    {
        log_message('info','[PAGOSERVICIO|Async] Solicitando datos para modificar concepto en detalles');
        if($tablaDatos=$this->modeloCobros->buscarDatosCooperacion($id)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function modificarCoperacion()
    {
        log_message('info','[PAGOSERVICIO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $campoJson=json_decode($this->request->getBody());
            $datosParaAgregar=[
                $captura = session()->get('IDCLIENTE'),
                $textCodigoCoperacion = $campoJson->textCodigoCoperacion,
                $textCantidad = $campoJson->textCantidad,
                $textCoperacion = $campoJson->textCoperacion,
            ];
            log_message('notice','[PAGOSERVICIO|Async] {user} esta intentando actualizar conceptos en detalles.', $log_extra);
            if($this->modeloCobros->modificarDatosCoperacion($datosParaAgregar)){
                log_message('info','[PAGOSERVICIO|Async] Los registros se actualizaron correctamente, notificando.');
                $swalMensajes=[
                    'title'=>'Modificado',
                    'button'=>'Ok',
                    'icon'=>'success',
                    'text'=>'El concepto se modificó correctamente.',
                    'estatus'=>'agrego',
                ];

                return json_encode($swalMensajes);
            }else {
                log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al guardar los datos, notificando');
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

    public function buscarTotalPago($id)
    {
        log_message('info','[PAGOSERVICIO|Async] Solicitando datos para modificar concepto en detalles');
        if($tablaDatos=$this->modeloCobros->buscarDatosTotalPago($id)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function realizarPagoCuenta()
    {
        log_message('info','[PAGOSERVICIO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $campoJson=json_decode($this->request->getBody());
            $datosParaAgregar=[
                $captura = session()->get('IDCLIENTE'),
                $textMovimiento = $campoJson->textMovimiento,
                $textTotal = $campoJson->textTotal,
                $textMetodo = $campoJson->textMetodo,
                $textRecibo = $campoJson->textRecibo,
                $textCambio = $campoJson->textCambio,
            ];
            log_message('notice','[PAGOSERVICIO|Async] {user} esta intentando actualizar conceptos en detalles.', $log_extra);
            if($datosTabla=$this->modeloCobros->realizarDatosPagoCuenta($datosParaAgregar)){
                log_message('info','[PAGOSERVICIO|Async] Los registros se actualizaron correctamente, notificando.');
                return json_encode($datosTabla);
            }else {
                log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al guardar los datos, notificando');
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

    public function realizarPagoParcialCuenta()
    {
        log_message('info','[PAGOSERVICIO|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $campoJson=json_decode($this->request->getBody());
            $datosParaAgregar=[
                $captura = session()->get('IDCLIENTE'),
                $textMovimiento = $campoJson->textMovimiento,
                $textTotal = $campoJson->textTotal,
                $textMetodo = $campoJson->textMetodo,
                $textRecibo = $campoJson->textRecibo,
                $textCambio = $campoJson->textCambio,
                $abonos = $campoJson->abonos,
            ];
            log_message('notice','[PAGOSERVICIO|Async] {user} esta intentando actualizar conceptos en detalles.', $log_extra);
            if($datosTabla=$this->modeloCobros->realizarDatosPagoParcialCuenta($datosParaAgregar)){
                log_message('info','[PAGOSERVICIO|Async] Los registros se actualizaron correctamente, notificando.');
                return json_encode($datosTabla);
            }else {
                log_message('info','[PAGOSERVICIO|Async] Ocurrio un error al guardar los datos, notificando');
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

    public function apagoespecia()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'apagoespecia',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[PAGOESPECIAL] Cargando modulo pagoespecia para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Cobros/vPagoEspecia').view('Plantilla/vFooter');        
    }

    public function cargarDeudasEspeciales($id)
    {
        log_message('info','[PAGOESPECIAL] Comprobando sesión iniciada en el sistema.');
        if(session()->get('logged_in')==1){
            log_message('info','[PAGOESPECIAL|Async] Consultando datos para llenar lista de deudas.');
            $tarifa=explode('_',$id);
            log_message('info','[PAGOESPECIAL|Async] Comprobar tarifa que tiene aplicado');
            if($tarifa[2]=='TARNOR'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSA',
                ];
            }
            if($tarifa[2]=='TARMAY'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSAD',
                ];
            }
            if($tarifa[2]=='TARNEG'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSAN',
                ];
            }
            if($tarifa[2]=='TARESP'){
                $datosRevisar=[
                    $idCapturista=session()->get('IDCLIENTE'),
                    $idClaves=$id,
                    $claveDeuda='CSAE',
                ];
            }
            if($tablaDatos=$this->modeloCobros->cargarDatosDeudasEspeciales($datosRevisar)){
                return json_encode($tablaDatos);
            }else {
                log_message('info','[PAGOESPECIAL|Async] Ocurrio un error al solicitar los datos, notificando');
                $swalMensajes=[
                    'title'=>'Error Servidor',
                    'button'=>'Ok',
                    'icon'=>'error',
                    'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                    'estatus'=>'error',
                ];

                return json_encode($swalMensajes);
            }
        }else {
            log_message('info','[PAGOESPECIAL] La sesión ha caducado o no existe');
            $swalMensajes=[
                'title'=>'Sin sesión',
                'button'=>'Iniciar sesión',
                'icon'=>'error',
                'text'=>'La sesión ha caducado o no existe.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }
    
    public function realizarAjusteParcial()
    {
        log_message('info','[PAGOESPECIAL|Async] Verificando el método de envio para continuar proceso guardar');
        if($this->request->getMethod('POST')){
            $log_extra=[
                'user'=>session()->get('IDCLIENTE'),
            ];
            $campoJson=json_decode($this->request->getBody());
            $datosParaAgregar=[
                $captura = session()->get('IDCLIENTE'),
                $textMovimiento = $campoJson->textMovimiento,
                $textTotal = $campoJson->textTotal,
                $textMetodo = $campoJson->textMetodo,
                $textRecibo = $campoJson->textRecibo,
                $textCambio = $campoJson->textCambio,
                $abonos = $campoJson->abonos,
            ];
            log_message('notice','[PAGOESPECIAL|Async] {user} esta intentando actualizar conceptos en detalles.', $log_extra);
            if($datosTabla=$this->modeloCobros->realizarDatosAjusteParcial($datosParaAgregar)){
                log_message('info','[PAGOESPECIAL|Async] Los registros se actualizaron correctamente, notificando.');
                return json_encode($datosTabla);
            }else {
                log_message('info','[PAGOESPECIAL|Async] Ocurrio un error al guardar los datos, notificando');
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

    public function acreacargo()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'acreacargo',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CREACARGO] Cargando modulo creacargo para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Cobros/vCreaCargo').view('Plantilla/vFooter');        
    }

    public function agregandoCargos($id)
    {
        $tarifa=explode('_',$id);
        log_message('info','[CREACARGO|Async] Comprobar tarifa que tiene aplicado');
        if($tarifa[1]=='TARNOR'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSA',
            ];
        }
        if($tarifa[1]=='TARMAY'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAD',
            ];
        }
        if($tarifa[1]=='TARNEG'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAN',
            ];
        }
        if($tarifa[1]=='TARESP'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAE',
            ];
        }
        if($tablaDatos=$this->modeloCobros->agregandoDatosCargos($datosModificar)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREACARGO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function agregandoCargosSelec($id)
    {
        $tarifa=explode('_',$id);
        log_message('info','[CREACARGO|Async] Comprobar tarifa que tiene aplicado');
        if($tarifa[1]=='TARNOR'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSA',
            ];
        }
        if($tarifa[1]=='TARMAY'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAD',
            ];
        }
        if($tarifa[1]=='TARNEG'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAN',
            ];
        }
        if($tarifa[1]=='TARESP'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAE',
            ];
        }
        if($tablaDatos=$this->modeloCobros->agregandoDatosCargosSelec($datosModificar)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREACARGO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function mostrarResumenCargos()
    {
        log_message('info','[CREACARGO|Async] Solicitando datos para modificar concepto en detalles');
        if($tablaDatos=$this->modeloCobros->mostrarDatosResumenCargos()){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREACARGO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function acrearecargo()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'acrearecargo',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[CREARECARGO] Cargando modulo crearecargo para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Cobros/vCreaRecargo').view('Plantilla/vFooter');        
    }

    public function agregandoRecargos($id)
    {
        $tarifa=explode('_',$id);
        log_message('info','[CREARECARGO|Async] Comprobar tarifa que tiene aplicado');
        if($tarifa[1]=='TARNOR'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSA',
            ];
        }
        if($tarifa[1]=='TARMAY'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAD',
            ];
        }
        if($tarifa[1]=='TARNEG'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAN',
            ];
        }
        if($tarifa[1]=='TARESP'){
            $datosModificar=[
                $idClaves=$id,
                $claveDeuda='CSAE',
            ];
        }
        if($tablaDatos=$this->modeloCobros->agregandoDatosRecargos($datosModificar)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREARECARGO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }

    }

    public function mostrarResumenRecargos()
    {
        log_message('info','[CREARECARGO|Async] Solicitando datos para modificar concepto en detalles');
        if($tablaDatos=$this->modeloCobros->mostrarDatosResumenRecargos()){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[CREARECARGO|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }







    public function autoCompletarUsuario($id)
    {
        log_message('info','[ACOBROS|Async] Solicitando datos para renderizado de completar usuarios');
        if($tablaDatos = $this->modeloCobros->autocompletarDatosUsuario($id)){
            log_message('info','[ACOBROS|Async] Envio de datos para renderizado de completar usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACOBROS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function cargarUsuarioGenerales($id)
    {
        log_message('info','[ACOBROS|Async] Solicitando datos para renderizado de completar usuarios');
        if($tablaDatos = $this->modeloCobros->cargarDatosUsuarioGenerales($id)){
            log_message('info','[ACOBROS|Async] Envio de datos para renderizado de completar usuarios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACOBROS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function modificarTotalesConcepto($id)
    {
        log_message('info','[ACOBROS|Async] Modificando datos para actualizar totales');
        if($tablaDatos = $this->modeloCobros->modificarDatosTotalesConcepto($id)){
            log_message('info','[ACOBROS|Async] Envio de datos para renderizado de totales');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACOBROS|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function buscarContratosActivos()
    {
        log_message('info','[ACOBROS|Async] Solicitando datos para modificar concepto en detalles');
        if($tablaDatos=$this->modeloCobros->buscarContratosActivos()){
            $retorno=[
                $idCapturista=session()->get('IDCLIENTE'),
                $tablaDatos,
            ];
            return json_encode($retorno);
        }else {
            log_message('info','[ACOBROS|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }
    }

    public function arregloContratosTotales($id)
    {
        log_message('info','[ACOBROS|Async] Solicitando datos para modificar concepto en detalles');
        if($tablaDatos=$this->modeloCobros->arregloDatosContratosTotales($id)){
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACOBROS|Async] Ocurrio un error al solicitar los datos, notificando');
            $swalMensajes=[
                'title'=>'Error Servidor',
                'button'=>'Ok',
                'icon'=>'error',
                'text'=>'Ocurro un error al consultar los tados para renderizado notificando.',
                'estatus'=>'error',
            ];

            return json_encode($swalMensajes);
        }

    }






}

?>