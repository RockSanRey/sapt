<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body bg-shite p-2">
            <?php if(isset($descripcion)):?>
                <div class="text-justify"><?=$descripcion;?></div>
            <?php endif;?>
        </div>
    </div>
    <div class="card">
        <div class="card-body bg-white p-2">
            <div id="busquedaUsuarios"></div>
            <div id="detalleDatosRecibos"></div>
            <div id="impresionComprobante" class="d-none"></div>
        </div>
        <div class="card-footer bg-white fuente-12p p-2">
            <small>Reimprimir recibo de pago <a href="areimcompago" class="link">aquí</a></small><br/>
        </div>
    </div>
</div>
<table>

</table>

<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Reportes/jsaReimComDomi.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/app/cobros/pagoservicio.css" rel="stylesheet">
