<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <!-- <div class="card mb-2">
        <div class="card-body bg-white p-2 fuente-12p">
            <?php if(isset($descripcion)):?>
                <?=$descripcion;?>
            <?php endif;?>
        </div>
    </div> -->
    <div class="card">
        <div class="card-body bg-white p-2">
            <div id="buscadorUsuarioPago"></div>
            <div id="datosUsuarioPago"></div>
            <div class="row d-none" id="interaccionBotones">
                <div class="form-group col-md-4 col-12 mb-2 btn-group">
                    <button type="button" class="btn btn-sm btn-secondary mb-1" id="botonResetear">Limpiar</button>
                    <button type="button" class="btn btn-sm btn-success mb-1 d-none" id="botonCobrar">Hacer Cobro</button>
                    <button type="button" class="btn btn-sm btn-success mb-1 d-none" id="botonPagoParcial">Hacer Cobro</button>
                    <button type="button" class="btn btn-sm btn-warning mb-1 d-none" id="botonParcial">Cobro Parcial</button>
                </div>
                <div class="form-group col-md-4 col-12 mb-2">
                    <div class="input-group">
                        <select name="textConceptos" id="textConceptos" class="custom-select custom-select-sm" disabled><option value="">---</option><select>
                        <div class="input-group-append">
                            <button id="botonAgregarMultas" class="btn btn-outline-success btn-sm" disabled>Multas <i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-4 col-12 mb-2">
                    <div class="input-group">
                        <div class="input-group-append">
                            <button id="botonAgregarAnticipo" class="btn btn-outline-success btn-sm" disabled>Adenlantar Meses <i class="fas fa-plus"></i></button>
                        </div>
                        <div class="input-group-append">
                            <button id="botonMostrarHistorial" class="btn btn-outline-success btn-sm" disabled>Mostrar Historial <i class="fas fa-clock"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-8 col-12">
                    <div class="fuente-12rem font-weight-bold" id="textoContratoCobro"></div>
                </div>
                <div class="form-group col-md-4 col-12">
                    <div class="text-warning fuente-22rem font-weight-bold text-right" id="textoDeudaTotal"></div>
                </div>
            </div>
            <div id="datosUsuarioDetalle"></div>
            <div id="labelsParciales"></div>
            <div id="impresionComprobante" class="d-none"></div>
            <table id="tablaDetallesRecibo" class="d-none"></table>

            <img id="codigo_qr" class="d-none" />
        </div>
        <div class="card-footer bg-white">
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="formCobroDeuda" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticCrearRegistro" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="labelTitleModal"></div>
            </div>
            <div class="modal-body bg-light">
                <div id="pagoCobro"></div>
                <div id="modifCoperacion"></div>
                <div id="listadoAnticipados"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-success" id="botonCooperacion">Cooperación</button>
                <button type="button" class="btn btn-success" id="botonAddAnticipo">Anticipar</button>
                <button type="button" class="btn btn-success" id="botonCompletar">Pagar</button>
                <button type="button" class="btn btn-success" id="botonTemporal">Pagar P</button>
                <button type="button" class="btn btn-danger" id="botonEliminar">Eliminar</button>
            </div>
        </div>
    </div>
</div>

<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/jsPdf/jspdf.plugin.autotable.js"></script>
<script src="/public/assets/jsPdf/JsBarcode.all.min.js"></script>
<script src="/public/JScript/Administrador/Cobros/jsaPagoServic.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/app/cobros/pagoservicio.css" rel="stylesheet">
