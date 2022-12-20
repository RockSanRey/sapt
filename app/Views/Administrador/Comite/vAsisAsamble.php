<div class="container-fluid fondo-estado vh-100 bg-light pt-2">
    <h5 class="text-center"><?=$tutiloPantalla;?></h5>
    <div class="card mb-2">
        <div class="card-body p-2">
            <div class="card-text text-justify">
                En este modulo se van a tomar las asistencias a la asamblea con el código QR, Código de barras o Nombre.
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-body p-2">
            <div id="selectorAsamblea"></div>
            <div class="accordion" id="accordionExample">
                <div class="card">
                    <div class="card-title mb-0" id="headingOne">
                        <div class="btn btn-block text-left p-1" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Asistencia QR
                        </div>
                    </div>
                    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="card-body">
                            <div id="capturaEscaneoQr"></div>
                            <div id="qrReader"></div>
                            <div id="qr-reader-results"></div>
                            <script>
                                function docReady(fn) {
                                    // see if DOM is already available
                                    if (document.readyState === "complete"
                                        || document.readyState === "interactive") {
                                        // call on next available tick
                                        setTimeout(fn, 1);
                                    } else {
                                        document.addEventListener("DOMContentLoaded", fn);
                                    }
                                }

                                docReady(function () {
                                    var resultContainer = document.getElementById('qr-reader-results');
                                    var lastResult, countResults = 0;
                                    function onScanSuccess(decodedText, decodedResult) {
                                        if (decodedText !== lastResult) {
                                            ++countResults;
                                            lastResult = decodedText;
                                            // Handle on success condition with the decoded message.
                                            // console.log(`Scan result ${decodedText}`, decodedResult);
                                            fetch(`asisasamble/marcarAsistencia/${decodedText}_QRCOD`)
                                            .then(respRender => respRender.json())
                                            .then(respuestas => {
                                                if(respuestas.estatus=='error'){
                                                    return Swal.fire({
                                                        title: respuestas.title,
                                                        icon: respuestas.icon,
                                                        confirmButtonText: respuestas.button,
                                                        confirmButtonColor: '#9C0000',
                                                        html: respuestas.text,
                                                    })

                                                }else{
                                                    return Swal.fire({
                                                        title: respuestas.title,
                                                        icon: respuestas.icon,
                                                        confirmButtonText: respuestas.button,
                                                        confirmButtonColor: '#009C06',
                                                        html: respuestas.text,
                                                    })
                                                    .then((result) => {
                                                        if(result.isConfirmed){
                                                            docReady();
                                                        }
                                                    })

                                                }
                                            })
                                        }
                                    }

                                    var html5QrcodeScanner = new Html5QrcodeScanner(
                                        "qrReader", { fps: 10, qrbox: {width: 170, height: 170} });
                                    html5QrcodeScanner.render(onScanSuccess);
                                });
                            </script>

                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title mb-0" id="headingTwo">
                        <button class="btn btn-block text-left collapsed p-1" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Asistencia Barras
                        </button>
                    </div>
                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div class="card-body">
                            <input type="text" class="form-control form-control-lg" id="textCodigoBarras" name="textCodigoBarras" value="" placeholder="Código Barras" autocomplete="off" maxlength="15">
                        </div>
                    </div>
                </div>
              <div class="card">
                <div class="card-title mb-0" id="headingThree">
                    <button class="btn btn-block text-left collapsed p-1" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Asistencia Nombre
                    </button>
                </div>
                <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                  <div class="card-body">
                      <div class="form-group">
                          <input type="hidden" id="textIdUsuario" name="textIdUsuario" value="" />
                          <input type="text" class="form-control form-control-lg" id="textNombre" name="textNombre" value="" placeholder="Nombre Usuario" autocomplete="off" maxlength="50">
                          <div id="userListComplete" class="autocompletados-lg-a"></div>
                      </div>
                      <div class="tabla-contenedor"></div>
                      <div class="tabla-contenedor"></div>
                      <div class="tabla-contenedor"></div>
                  </div>
                </div>
              </div>
            </div>



        </div>
        <div class="card-footer bg-white fuente-12p p-2">
            <small>Crear código de asamblea <a href="acreaasamble" class="link">aquí</a></small><br/>
            <small>Convocar a asamblea <a href="aconvasamble" class="link">aquí</a></small><br/>
        </div>
    </div>
</div>

<script src="/public/assets/jsPdf/jspdf.min.js"></script>
<script src="/public/assets/jsPdf/jspdf.plugin.autotable.js"></script>
<script src="/public/assets/datepicker/datepicker-full.min.js"></script>
<script src="/public/assets/datepicker/es.js"></script>
<link href="/public/assets/datepicker/datepicker.min.css" rel="stylesheet">
<link href="/public/assets/datepicker/datepicker-bs4.min.css" rel="stylesheet">
<script src="public/assets/qrCode/html5-qrcode.min.js"></script>
<script src="/public/JScript/Administrador/Comite/jsaAsisAsamble.js"></script>
<script src="/public/assets/sweetalert/sweetalert2.all.min.js"></script>
<link href="/public/assets/estilos/css_frontend/formularios/formularios.css" rel="stylesheet">
<link href="/public/assets/estilos/app/asambleas/asisasambleas.css" rel="stylesheet">
