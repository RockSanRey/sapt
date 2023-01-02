<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2">
            <?php if(isset($descripcion)):?>
                <div class="text-justify"><?=$descripcion;?></div>
            <?php endif;?>
        </div>
    </div>
    <div class="card">
        <div class="card-body bg-white p-2">
            <div id="listadoCortes"></div>
            <table id="tablaExportadora" class="d-none"></table>
        </div>
        <div class="card-footer bg-white">
            <div id="botonesExportar"></div>
        </div>
    </div>
</div>

<script src="/public/assets/exportxls/xlsx.full.min.js"></script>
<script src="/public/assets/exportxls/FileSaver.min.js"></script>
<script src="/public/assets/exportxls/tableexport.min.js"></script>
<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/jsPdf/jspdf.plugin.autotable.js"></script>
<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Reportes/jsaListaCortes.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
