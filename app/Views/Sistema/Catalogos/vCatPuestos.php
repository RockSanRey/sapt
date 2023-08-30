<?=$this->extend('Layout/vCRMMain');?>
<?=$this->section('contenido');?>
    <div class="container-fluid fondo-estado panel-min-v600p bg-light p-2">
        <h5 class="text-center"><?=$tutiloPantalla;?></h5>
        <div class="card mb-2">
            <div class="card-body fuente-12p">
                <?php if(isset($descripcion)):?>
                    <div class="text-justify"><?=$descripcion;?></div>
                <?php endif;?>
            </div>
        </div>
        <div class="card">
            <div class="card-body bg-white">
                <!-- Button trigger modal -->
                <div class="text-justify mb-2 fuente-12p">
                    Para crear un nuevo registro haz clic en este botón
                    <button type="button" id="botonRegistro" class="btn btn-sm btn-success mb-2 fuente-10p" data-toggle="modal" data-target="#formRegistroDatos">
                        <i class="fas fa-pencil-alt"></i> Crear Registro
                    </button>
                </div>
                <div id="tablaDinamica"></div>
            </div>
            <div class="card-footer bg-white fuente-10p">
                <div><small class="text-muted">Registre nueva áreas <a href="catareas">aquí</a>.</small></div>
                <div><small class="text-muted">Continue <a href="catperfiles">aquí</a> para agregar y armar perfiles.</small></div>
            </div>
        </div>
    </div>
<!-- Modal -->
<div class="modal fade" id="formRegistroDatos" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticCrearRegistro" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="staticCrearRegistro"></div>
            </div>
            <div class="modal-body">
                <form id="formularioPuestosCRUD"></form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-sm btn-success" id="botonGuardar">Guardar</button>
                <button type="button" class="btn btn-sm btn-info" id="botonActualizar">Actualizar</button>
            </div>
        </div>
    </div>
</div>

<script src="/public/JScript/Sistema/Catalogos/catPuestos.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>

<?=$this->endSection();?>