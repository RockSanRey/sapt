<?php namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RolAdmin implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Do something here
        log_message('info','[Roles] Comprobando nivel de perfil del usuario.');
        if(session()->get('NIVELCLIEN')=='USUARIO'){
            log_message('info','[Roles] Se detecto un nivel usuario para esta sesion redireccionando.');
            return redirect()->to('dashboard');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do something here


    }
}

?>
