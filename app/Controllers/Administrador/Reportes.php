<?php

namespace App\Controllers\Administrador;
use App\Models\Administrador\Mareportes;
use App\Controllers\BaseController;

class Reportes extends BaseController
{
    protected $modeloReportes;

    function __construct()
    {
        $this->modeloReportes = new Mareportes;
    }

    public function llamandoParametrosWeb($id)
    {
        log_message('info','[AREPORTES] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $this->modeloReportes->llamandoDatosParametrosWeb($id)){
            log_message('info','[AREPORTES] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function aimpcontrato()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'aimpcontrato',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AIMPCONTRATO] Cargando modulo impcontrato para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vImpContrato').view('Plantilla/vFooter');        
    }

    public function mostrarContratosActivos($id)
    {
        log_message('info','[AIMPCONTRATO|Async] Solicitando datos para renderizado de contratos activos');
        if($tablaDatos = $this->modeloReportes->mostrarDatosContratosActivos($id)){
            log_message('info','[AIMPCONTRATO|Async] Envio de datos para renderizado de contratos activos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AIMPCONTRATO|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function areimtransfe()
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
        log_message('info','[AREIMPTRANSFER] Cargando modulo reimptransfe para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vReimTransfe').view('Plantilla/vFooter');        
    }

    public function autoCompletarTransferencias($id)
    {
        log_message('info','[AREIMPTRANSFER|Async] Solicitando datos para renderizado de autocompletar contratos');
        if($tablaDatos = $this->modeloReportes->autoDatosCompletarTransferencias($id)){
            log_message('info','[AREIMPTRANSFER|Async] Envio de datos para renderizado de autocompletar contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMPTRANSFER|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function mostrarTransferContratos($id)
    {
        log_message('info','[AREIMPTRANSFER|Async] Solicitando datos para renderizado de contratos trasnferidos');
        if($tablaDatos = $this->modeloReportes->mostrarDatosTransferContratos($id)){
            log_message('info','[AREIMPTRANSFER|Async] Envio de datos para renderizado de contratos trasnferidos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMPTRANSFER|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function areimpbajas()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'areimpbajas',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AREIMPBAJAS] Cargando modulo reimpbajas para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vReimpBajas').view('Plantilla/vFooter');        
    }

    public function autoCompletarBajas($id)
    {
        log_message('info','[AREIMPBAJAS|Async] Solicitando datos para renderizado de autocompletar contratos');
        if($tablaDatos = $this->modeloReportes->autoDatosCompletarBajas($id)){
            log_message('info','[AREIMPBAJAS|Async] Envio de datos para renderizado de autocompletar contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMPBAJAS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function mostrarBajasContratos($id)
    {
        log_message('info','[AREIMPBAJAS|Async] Solicitando datos para renderizado de bajas contratos');
        if($tablaDatos = $this->modeloReportes->mostrarDatosBajasContratos($id)){
            log_message('info','[AREIMPBAJAS|Async] Envio de datos para renderizado de bajas contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMPBAJAS|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function areimreactiv()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'areimreactiv',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AREIMREACTIVA] Cargando modulo reimreactiv para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vReimReactiv').view('Plantilla/vFooter');        
    }

    public function autoCompletarReactivados($id)
    {
        log_message('info','[AREIMREACTIVA|Async] Solicitando datos para renderizado completar rectivados');
        if($tablaDatos = $this->modeloReportes->autoDatosCompletarReactivados($id)){
            log_message('info','[AREIMREACTIVA|Async] Envio de datos para renderizado completar rectivados');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMREACTIVA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function mostrarReactivosContratos($id)
    {
        log_message('info','[AREIMREACTIVA|Async] Solicitando datos para renderizado de contratos reactivados');
        if($tablaDatos = $this->modeloReportes->mostrarDatosReactivosContratos($id)){
            log_message('info','[AREIMREACTIVA|Async] Envio de datos para renderizado de contratos reactivados');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMREACTIVA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function impmodifica()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'areimcompago',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AIMPMODIFICA] Cargando modulo impmodifica para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vImpModifica').view('Plantilla/vFooter');        
    }

    public function autocompletarContratoMod($id)
    {
        if($tablaDatos = $this->modeloReportes->autocompletarDatosContratoMod($id)){
            log_message('info','[AIMPMODIFICA|Async] Envio de datos para renderizado de autocompletar contratos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AIMPMODIFICA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function contratosModificadosLista($id)
    {
        if($tablaDatos = $this->modeloReportes->contratosDatosModificadosLista($id)){
            log_message('info','[AIMPMODIFICA|Async] Envio de datos para renderizado de lista contratos modificados');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AIMPMODIFICA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function areimcompago()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'areimcompago',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AREIMCOMPAGO] Cargando modulo reimcompago para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vReimComPago').view('Plantilla/vFooter');        
    }

    public function llenarTablaRecibosPago()
    {
        log_message('info','[AREIMCOMPAGO|Async] Solicitando datos para renderizado de comprobantes pagos');
        if($tablaDatos = $this->modeloReportes->llenarDatosTablaRecibosPago()){
            log_message('info','[AREIMCOMPAGO|Async] Envio de datos para renderizado de comprobantes pagos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMCOMPAGO|Async] Ocurrio un error al consultar los datos, notificando');
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
    
    public function areimcomdomi()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'areimcomdomi',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[AREIMCOMDOMI] Cargando modulo reimcomdomi para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vReimComDomi').view('Plantilla/vFooter');        
    }

    public function buscarComprobanteDomicilio($id)
    {
        log_message('info','[AREIMCOMDOMI|Async] Solicitando datos para renderizado de comprobate pagos');
        if($tablaDatos = $this->modeloReportes->buscarDatosComprobanteDomicilio($id)){
            log_message('info','[AREIMCOMDOMI|Async] Envio de datos para renderizado de comprobate pagos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREIMCOMDOMI|Async] Ocurrio un error al consultar los datos, notificando');
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
    
    public function alistacortes()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'alistacortes',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[ALISTACORTES] Cargando modulo listacortes para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vListaCortes').view('Plantilla/vFooter');        
    }
    
    public function llenatTablaDeudores()
    {
        log_message('info','[ALISTACORTES|Async] Solicitando datos para renderizado de tabla deudores');
        if($tablaDatos = $this->modeloReportes->llenatDatosTablaDeudores()){
            log_message('info','[ALISTACORTES|Async] Envio de datos para renderizado de tabla deudores');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ALISTACORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function exportadorListaDeudas()
    {
        log_message('info','[ALISTACORTES|Async] Solicitando datos para renderizado de exportar excel deudor');
        if($tablaDatos = $this->modeloReportes->exportadorDatosListaDeudas()){
            log_message('info','[ALISTACORTES|Async] Envio de datos para renderizado de exportar excel deudor');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ALISTACORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function acortecaja()
    {
        $id = __FUNCTION__;
        $respuesta=$this->llamandoParametrosWeb($id);
        $cadena=array(
            'titulo'=>'SAPT | '.$respuesta['TITULO_CONW'],
            'tutiloPantalla'=>$respuesta['TITULOPANT_CONW'],
            'robots'=>$respuesta['ROBOTS_CONW'],
            'Keyword'=>$respuesta['KEYWORD_CONW'],
            'descripcion'=>$respuesta['DESCRIPCION_CONW'],
            'pantalla'=>'acortecaja',
            'sesionIniciada'=>session(),
        );
        $sesionIniciada=session();
        $log_extra=[
            'user'=>$sesionIniciada->get('IDCLIENTE'),
            'grupo'=>$sesionIniciada->get('NIVELCLIEN'),
        ];
        log_message('info','[ACORTECAJA] Cargando modulo cortecaja para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vCorteCaja').view('Plantilla/vFooter');        
    }

    public function listadoGeneraCorte($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de corte anual');
        if($tablaDatos = $this->modeloReportes->listadoDatosGeneraCorte($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de corte anual');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function listadoGeneraCorteSem($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de corte semanal');
        if($tablaDatos = $this->modeloReportes->listadoDatosGeneraCorteSem($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de corte semanal');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function llenarComboAnioMes()
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de combo aniomes');
        if($tablaDatos = $this->modeloReportes->llenarDatosComboAnioMes()){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de combo aniomes');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function llenarComboMes($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de combo mes');
        if($tablaDatos = $this->modeloReportes->llenarDatosComboMes($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de combo mes');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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
    
    public function llenarComboSemana($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de combo semana');
        if($tablaDatos = $this->modeloReportes->llenarDatosComboSemana($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de combo semana');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function llenarComboDia($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de combo dia');
        if($tablaDatos = $this->modeloReportes->llenarDatosComboDia($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de combo dia');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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
    
    public function listadoGeneraMeses($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de listado mes');
        if($tablaDatos = $this->modeloReportes->listadoDatosGeneraMeses($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de listado mes');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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
    
    public function listadoGeneraDias($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de listado dia');
        if($tablaDatos = $this->modeloReportes->listadoDatosGeneraDias($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de listado dia');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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
    
    public function llenarTablaPaginadaFolios($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de paginado folios');
        if($tablaDatos = $this->modeloReportes->llenarDatosTablaPaginadaFolios($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de paginado folios');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function exportadorListaFolios($id)
    {
        log_message('info','[ACORTECAJA|Async] Solicitando datos para renderizado de exporta lista');
        if($tablaDatos = $this->modeloReportes->exportadorDatosListaFolios($id)){
            log_message('info','[ACORTECAJA|Async] Envio de datos para renderizado de exporta lista');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[ACORTECAJA|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function reportedeuda()
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
        log_message('info','[ACORTECAJA] Cargando modulo reportedeuda para {user} con privilegios {grupo}.',$log_extra);
        return view('Plantilla/vHeader',$cadena).view('Administrador/Reportes/vReporteDeuda').view('Plantilla/vFooter');        
    }

    public function mostrarDeudasDetalle($id)
    {
        log_message('info','[REPORTEDEUDA|Async] Solicitando datos para renderizado detalles reuda');
        $tarifa=explode('_',$id);
        log_message('info','[CREACARGO|Async] Comprobar tarifa que tiene aplicado');
        if($tarifa[2]=='TARNOR'){
            $datosModificar=[
                $captura=session()->get('IDCLIENTE'),
                $idClaves=$id,
                $claveDeuda='CSA',
            ];
        }
        if($tarifa[2]=='TARMAY'){
            $datosModificar=[
                $captura=session()->get('IDCLIENTE'),
                $idClaves=$id,
                $claveDeuda='CSAD',
            ];
        }
        if($tarifa[2]=='TARNEG'){
            $datosModificar=[
                $captura=session()->get('IDCLIENTE'),
                $idClaves=$id,
                $claveDeuda='CSAN',
            ];
        }
        if($tarifa[2]=='TARESP'){
            $datosModificar=[
                $captura=session()->get('IDCLIENTE'),
                $idClaves=$id,
                $claveDeuda='CSAE',
            ];
        }
        if($tablaDatos = $this->modeloReportes->mostrarDatosDeudasDetalle($datosModificar)){
            log_message('info','[REPORTEDEUDA|Async] Envio de datos para renderizado detalles reuda');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[REPORTEDEUDA|Async] Ocurrio un error al consultar los datos, notificando');
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
    

    
    

    public function imprimirContrato($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizado de contratos activos');
        if($tablaDatos = $this->modeloReportes->imprimirDatosContrato($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizado de contratos activos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function imprimirComprobantePago($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizado de comprobate pagos');
        if($tablaDatos = $this->modeloReportes->imprimirDatosComprobantePago($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizado de comprobate pagos');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function imprimirAcuseBaja($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizado de baja contrato');
        if($tablaDatos = $this->modeloReportes->imprimirDatosAcuseBaja($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizado de baja contrato');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function imprimirAcuseReactiva($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizado de reactivación contrato');
        if($tablaDatos = $this->modeloReportes->imprimirDatosAcuseReactiva($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizado de reactivación contrato');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function imprimirReciboTransferencia($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizado de recibo transferencia');
        if($tablaDatos = $this->modeloReportes->imprimirDatosReciboTransferencia($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizado de recibo transferencia');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function imprimirAcuseModifica($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizado de recibo modificacion');
        if($tablaDatos = $this->modeloReportes->imprimirDatosAcuseModifica($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizado de recibo modificacion');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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

    public function imprimirAcuseAclaracion($id)
    {
        log_message('info','[AREPORTES|Async] Solicitando datos para renderizar acuse aclaracion');
        if($tablaDatos = $this->modeloReportes->imprimirDatosAcuseAclaracion($id)){
            log_message('info','[AREPORTES|Async] Envio de datos para renderizar acuse aclaracion');
            return json_encode($tablaDatos);
        }else {
            log_message('info','[AREPORTES|Async] Ocurrio un error al consultar los datos, notificando');
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