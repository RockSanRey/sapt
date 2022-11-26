<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2">
            <?php if(isset($descripcion)):?>
                <?=$descripcion;?>
            <?php endif;?>
        </div>
    </div>
    <div class="card">
        <div class="card-body p-2">
            <div id="busquedaUsuarios"></div>
            <div id="datosContratoDetalle"></div>
            <div id="datosRecibo" class="d-none"></div>
        </div>
        <div class="card-footer bg-white">
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="formRegistroDatos" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticCrearRegistro" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header p-2">
                <div class="modal-title" id="labelTitleModal"></div>
            </div>
            <div class="modal-body bg-light p-2">
                <form class="needs-validation" id="formRegistroCRUD"></form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-sm btn-success" id="botonConvenio">Convenio</button>
                <button type="button" class="btn btn-sm btn-success" id="botonCitatorio">Citatorio</button>
            </div>
        </div>
    </div>
</div>

<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/datepicker/datepicker-full.min.js"></script>
<script src="/public/assets/datepicker/es.js"></script>
<link href="/public/assets/datepicker/datepicker.min.css" rel="stylesheet">
<link href="/public/assets/datepicker/datepicker-bs4.min.css" rel="stylesheet">
<script src="/public/JScript/Administrador/Tramites/jsaRegConvenio.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/css_frontend/menus/menu.css" rel="stylesheet">
