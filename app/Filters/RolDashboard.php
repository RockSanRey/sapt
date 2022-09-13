<?php namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RolDashboard implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Do something here
        log_message('info','[Roles] Comprobando nivel de perfil del usuario.');
        if(session()->get('NIVELCLIEN')=='MASTER' || session()->get('NIVELCLIEN')=='ADMINISTRAD'){
            log_message('info','[Roles] Se detecto un nivel administrativo para el usuario redireccionando.');
            return redirect()->to('adashboard');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do something here


    }
}

?>
