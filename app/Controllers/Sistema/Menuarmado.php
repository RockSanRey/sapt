<?php
namespace App\Controllers\Sistema;
use App\Models\Sistema\Mmenuarmado;
use App\Controllers\BaseController;

/**
 *
 */
class Menuarmado extends BaseController
{

    public function armarMenuSistema($id)
    {

        log_message('info','[MENU|Async] Solicitando datos para renderizado de menu sistema');
        $modeloMenuArmado = new Mmenuarmado;
        if($tablaDatos = $modeloMenuArmado->datosParaArmarMenu($id)){
            log_message('info','[MENU|Async] Envio de datos para renderizado de menu sistema');
            return json_encode($tablaDatos);
        }
    }

    public function armarMenuSistemaRoles(){
        log_message('info','[MENU|Async] Comprobando una sesión iniciada para armado de menu sistema');
        if(session()->get('logged_in')){
            log_message('info','[MENU|Async] La sesión aun es existente continua proceso de armado.');
            $setPerfilRoles=[
                $idusuario=session()->get('IDCLIENTE'),
            ];
            $modeloMenuArmado = new Mmenuarmado;
            log_message('info','[MENU|Async] Envio de datos para renderizado de menu sistema');
            if($tablaDatos = $modeloMenuArmado->armarDatosMenuSistemaRoles($setPerfilRoles)){
                return json_encode($tablaDatos);
            }

        }
    }










}






 ?>
