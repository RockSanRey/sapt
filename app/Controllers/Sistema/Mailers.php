<?php
namespace App\Controllers\Sistema;
use App\Models\Sistema\Mmailers;
use App\Controllers\BaseController;

/**
 *
 */
class Mailers extends BaseController
{
    public function llamandoParametrosWeb($id)
    {
        $modeloMailers = new Mmailers;
        log_message('info','[MAILERS] Solicitando datos para renderizado de parametros web');
        if($tablaDatos = $modeloMailers->llamandoDatosParametrosWeb($id)){
            log_message('info','[MAILERS] Envio de datos para renderizado de parametros web');
            if(count($tablaDatos)>0){
                foreach($tablaDatos as $key => $value){
                    $paramWeb=$key=$value;
                }
                return $paramWeb;
            }
        }
    }

    public function mailmuestra()
    {
        log_message('info','[MAILMUESTRA] Comprobando sesión iniciada en el sistema.');
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
            log_message('info','[MAILMUESTRA] La sesión aun es vigente se comprobando privileios');
            if($sesionIniciada->get('NIVELPERF_RESPO')=='USUARIO'){
                log_message('notice','[MAILMUESTRA] Se encontro una sesión de {grupo} de {user} redireccionando a dashboard.',$log_extra);
                redirect()->to('/dashboard');
            }else {
                log_message('info','[MAILMUESTRA] Cargando modulo catalogos areas para {user} con privilegios {grupo}.',$log_extra);
                return view('Plantilla/vHeader',$cadena).view('Sistema/Mailers/vMailMuestra').view('Plantilla/vFooter');
            }
        }else {
            log_message('info','[MAILMUESTRA] La sesión ha caducado o no existe');
            return redirect()->to('/expiro');
        }
    }

















}



 ?>
