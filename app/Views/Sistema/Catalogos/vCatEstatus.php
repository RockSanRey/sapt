<div class="container-fluid fondo-estado sapt-vh-650p bg-light p-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2 fuente-12p">
            <?php if(isset($descripcion)):?>
            <div class="text-justify"><?=$descripcion;?></div>
            <?php endif;?>
        </div>
    </div>
    <div class="card">
        <div class="card-body bg-white p-2 fuente-12p">
            <!-- Button trigger modal -->
            <div class="text-justify mb-2">
                Para crear un nuevo registro haz clic en este botón
                <button type="button" class="btn btn-sm btn-success mb-2 fuente-12p" id="botonRegistro" data-toggle="modal" data-target="#formRegistroDatos">
                    <i class="fas fa-pencil-alt"></i> Crear Registro
                </button>
            </div>
            <div id="tablaDinamica"></div>
        </div>
        <div class="card-footer bg-white fuente-12p">
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="formRegistroDatos" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticCrearRegistro" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="staticCrearRegistro">Crear Registro</div>
            </div>
            <div class="modal-body">
                <form id="formularioRegistro"></form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-sm btn-success" id="botonGuardar">Guardar</button>
                <button type="button" class="btn btn-sm btn-info" id="botonActualizar">Actualizar</button>
            </div>
        </div>
    </div>
</div>


<script src="/public/JScript/Sistema/Catalogos/jsEstatus.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/app/catalogos/areas.css" rel="stylesheet">