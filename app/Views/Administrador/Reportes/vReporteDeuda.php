<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2">
            <div class="card-text text-justify fuente-12p">
                <?php if(isset($descripcion)):?>
                    <?=$descripcion;?>
                <?php endif;?>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-body p-2">
            <div id="busquedaUsuarios"></div>
            <div id="datosContratosPago"></div>
            <div id="interaccionBotones" class="d-none">
                <button type="button" class="btn btn-sm btn-secondary mb-1" id="botonResetear">Nueva busqueda</button>
                <div class="row">
                    <div class="form-group col-md-8 col-12">
                        <div class="fuente-12rem font-weight-bold" id="textoContratoCobro"></div>
                    </div>
                    <div class="form-group col-md-4 col-12">
                        <div class="text-warning fuente-22rem font-weight-bold text-right" id="textoDeudaTotal"></div>
                    </div>
                </div>
            </div>
            <div id="datosDeudaDetalle"></div>
        </div>
        <div class="card-footer bg-white p-2 fuente-12p">
        </div>
    </div>
</div>

<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Reportes/jsaReporteDeuda.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
