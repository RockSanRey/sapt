<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body bg-white p-2">
            <?php if(isset($descripcion)):?>
                <div class="text-justify"><?=$descripcion;?></div>
            <?php endif;?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 col-12">
            <div class="card mb-2">
                <div class="card-body bg-white p-2">
                    <div id="hojasCorteGeneral"></div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-12">
            <div class="card mb-2">
                <div class="card-body bg-white p-2">
                    <div id="hojasCorteTipo"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-body bg-white p-2">
            <div class="card-text text-justify">
                <ol class="col-12">
                    <li>Selecciona el mes o la fecha que deseas generar para el listado.</li>
                    <li>Hacer clic en el botón buscar <span class="btn-info btn-sm"><i class="fa fa-search"></i></span> para generar el listado.</li>
                    <li>Para imprimir o exportar elige la opción que necesites.</li>
                </ol>
            </div>
            <div id="busquedaFechas"></div>
            <div id="botonesPagina"></div>
            <div id="tablaListadoFolios"></div>
            <div id="botonesExportar"></div>
            <table class="d-none" id="tablaExportadora"></table>
            <img id="codigo_qr" class="d-none" />
        </div>
        <div class="card-footer bg-white">
        </div>
    </div>
</div>
<table>

</table>

<script src="/public/assets/exportxls/xlsx.full.min.js"></script>
<script src="/public/assets/exportxls/FileSaver.min.js"></script>
<script src="/public/assets/exportxls/tableexport.min.js"></script>
<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/jsPdf/jspdf.plugin.autotable.js"></script>
<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Reportes/jsaCorteCaja.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">


