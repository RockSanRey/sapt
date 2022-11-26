<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2">
            <p class="card-text text-justify fuente-14p">
                <?php if(isset($descripcion)):?>
                    <?=$descripcion;?>
                <?php endif;?>
            </p>
        </div>
    </div>
    <div class="card">
        <div class="card-body bg-white p-2">
            <div class="card-text text-justify fuente-14p popup-hover">En este listado se muestran los usuarios registrados el dia de hoy
                y que se pueden eliminar por algun error de captura.
                <div class="popup-info">
                    Si requieres modificar usuarios y no aparecen en el listado deberás ir a Mod. Usuarios, o si vas a agregar un usuario
                    para transferir un dominio debes ir a Trans. Dominio
                </div>
            </div>
            <div id="listadoUsuariosHoy"></div>
        </div>
        <div class="card-footer bg-white p-2 fuente-12p">
            <small>Registrar usuarios/contrato <a href="aregusuarios" class="link">aquí</a></small><br/>
            <small>Modificar datos usuarios <a href="amodusuarios" class="link">aquí</a></small><br/>
            <small>Agregar contratos <a href="aagrcontrato" class="link">aquí</a></small><br/>
            <small>Borrar contrato erroneos <a href="aborcontrato" class="link">aquí</a></small><br/>
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="formRegistroDatos" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticCrearRegistro" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header pl-3 p-2">
                <div class="modal-title" id="labelTitleModal"></div>
            </div>
            <div class="modal-body bg-light">
                <div id="plantillaContrato"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" id="botonCancelar">Cancelar</button>
                <button type="button" class="btn btn-sm btn-success" id="botonBorrar">Eliminar</button>
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
<script src="/public/JScript/Administrador/Tramites/jsaBorUsuarios.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/app/tramites/regusuarios.css" rel="stylesheet">
