<div class="container-fluid fondo-estado vh-100 bg-light p-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body bg-white p-2">
            <?php if(isset($descripcion)):?>
                <?=$descripcion;?>
            <?php endif;?>
        </div>
    </div>
    <div class="card">
        <div class="card-body bg-white p-2">
            <div class="card-text text-justify">
                <div id="inicialConvocatorias"></div>
                <ol class="col-12">
                    <li>Inicia el proceso de envio de invitaciones este proceso lleva tiempo.</li>
                </ol>
            </div>
            <div id="tablaDinamica"></div>
        </div>
        <div class="card-footer bg-white p-2 fuente-12p">
            <small>Crear código de asamblea <a href="acreaasamble" class="link">aquí</a></small><br/>
            <small>Tomar asistencia de asamblea <a href="asisasamblea" class="link">aquí</a></small><br/>
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="formRegistroDatos" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticCrearRegistro" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="labelTitleModal"></div>
            </div>
            <div class="modal-body bg-light p-2">
                <div class="needs-validation" id="formRegistroCRUD"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-success" id="botonGuardar">Convocar</button>
                <button type="button" class="btn btn-info" id="botonActualizar">Cerrar Asamblea</button>
                <button type="button" class="btn btn-danger" id="botonSancion">Aplicar sanción</button>
            </div>
        </div>
    </div>
</div>

<script src="/public/assets/datepicker/datepicker-full.min.js"></script>
<script src="/public/assets/datepicker/es.js"></script>
<link href="/public/assets/datepicker/datepicker.min.css" rel="stylesheet">
<link href="/public/assets/datepicker/datepicker-bs4.min.css" rel="stylesheet">
<script src="/public/JScript/Administrador/Comite/jsaConvAsamble.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
