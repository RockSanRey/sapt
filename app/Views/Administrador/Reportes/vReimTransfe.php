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
            <div id="busquedaTransferencias"></div>
            <div id="datosTransferenciasDetalle"></div>
            <div id="plantillaTransferencia" class="d-none"></div>
        </div>
        <div class="card-footer bg-white p-2 fuente-12p">
        </div>
    </div>
</div>

<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Reportes/jsaReimTransfe.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
