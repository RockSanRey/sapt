<?php namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Autenticar implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Do something here
        log_message('info','[Autenticar] Comprobando sesión iniciada en el sistema.');
        if(!session()->get('logged_in')){
            log_message('info','[Autenticar] La sesión expiro o no existe se redirecciona.');
            return redirect()->to('/expiro');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do something here
        log_message('info','[Autenticar] Sesión aun es activa se continua en el sistema.');

    }
}

?>
