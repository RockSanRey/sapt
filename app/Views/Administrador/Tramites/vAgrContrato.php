<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2">
            <div class="card-text text-justify fuente-14p">
                <?php if(isset($descripcion)):?>
                    <?=$descripcion;?>
                <?php endif;?>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-body p-2">
            <div id="busquedaUsuarios"></div>
            <div id="datosUsuarioDetalle"></div>
            <div id="datosContratoDetalle" class="d-none"></div>
            <img id="codigo_qr" class="d-none" />
        </div>
        <div class="card-footer bg-white p-2 fuente-12p">
            <small>Registrar usuarios/contrato <a href="aregusuarios" class="link">aquí</a></small><br/>
            <small>Modificar datos usuarios <a href="amodusuarios" class="link">aquí</a></small><br/>
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
                <div id="datosUsuarioTemplate"></div>
                <div id="datosUsuarioContrato"></div>
            </div>
            <div class="modal-footer p-2">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-sm btn-success" id="botonContrato">Asingar Contrato</button>
            </div>
        </div>
    </div>
</div>

<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/datepicker/datepicker-full.min.js"></script>
<script src="/public/assets/datepicker/es.js"></script>
<link href="/public/assets/datepicker/datepicker.min.css" rel="stylesheet">
<link href="/public/assets/datepicker/datepicker-bs4.min.css" rel="stylesheet">
<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Tramites/jsaAgrContrato.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/css_frontend/menus/menu.css" rel="stylesheet">
