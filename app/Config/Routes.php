<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php'))
{
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Cuenta');
$routes->setDefaultMethod('login');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
//
// Grupo de rutas para cuenta login
$routes->group('',['namespace'=>'App\Controllers'], function($routes){
	$routes->group('', function($cuenta){
		$cuenta->get('/','Cuenta::login');
		$cuenta->get('login','Cuenta::login');
		$cuenta->post('verificar','Cuenta::verificar');
		$cuenta->post('login/verificandoCredencial','Cuenta::verificandoCredencial');
		$cuenta->get('expiro','Cuenta::expiro');
		$cuenta->get('salir','Cuenta::salir');
	});

});

$routes->group('', ['namespace'=>'App\Controllers\Cliente'], function($cliente){
	$cliente->group('', function($cuenta){

	});
});

$routes->group('', ['namespace'=>'App\Controllers\Auditoria'], function($auditoria){
	$auditoria->group('',function($reportes){
		$reportes->get('reportegral','Reportes::reportegral',['filter'=>'autenticar']);
		$reportes->get('reportegral/llenarComboAuditConceptosAnio/(:any)', 'Reportes::llenarComboAuditConceptosAnio/$1');
		$reportes->get('reportegral/llenarComboAuditConceptosMes/(:any)', 'Reportes::llenarComboAuditConceptosMes/$1');
		$reportes->get('reportegral/listadoConceptosPagadosMes/(:any)', 'Reportes::listadoConceptosPagadosMes/$1');
		$reportes->get('reportegral/llenarComboAuditConceptos/(:any)', 'Reportes::llenarComboAuditConceptos/$1');
		$reportes->get('reportegral/listadoConceptosPagados/(:any)', 'Reportes::listadoConceptosPagados/$1');
	});
});


$routes->group('', ['namespace'=>'App\Controllers\Administrador'], function($admins){


	$admins->group('', function($dashboard){
		$dashboard->get('adashboard','Dashboard::adashboard',['filter'=>'autenticar']);
		$dashboard->get('adashboard/mensajeSaludoInicial/(:any)', 'Dashboard::mensajeSaludoInicial/$1');
		$dashboard->get('adashboard/resumenCantidadesTes', 'Dashboard::resumenCantidadesTes');
		$dashboard->get('adashboard/resumenCantidadesPre', 'Dashboard::resumenCantidadesPre');
		
	});

	$admins->group('',function($catalogos){
		$catalogos->get('acatconcepto','Catalogos::acatconcepto',['filter'=>'autenticar']);
		$catalogos->get('acatconcepto/llenarTablaConceptos','Catalogos::llenarTablaConceptos');
		$catalogos->get('acatconcepto/autoCompletDescrip/(:any)','Catalogos::autoCompletDescrip/$1');
		$catalogos->post('acatconcepto/registrarConceptos','Catalogos::registrarConceptos');
		$catalogos->get('acatconcepto/buscarConceptosEditar/(:any)','Catalogos::buscarConceptosEditar/$1');
		$catalogos->post('acatconcepto/actualizarConceptos','Catalogos::actualizarConceptos');
		$catalogos->get('acatconcepto/eliminarConceptos/(:any)','Catalogos::eliminarConceptos/$1');
		$catalogos->get('acatcontrato','Catalogos::acatcontrato',['filter'=>'autenticar']);
		$catalogos->get('acatcontrato/llenarTablaContratos','Catalogos::llenarTablaContratos');
		$catalogos->post('acatcontrato/registroContratos','Catalogos::registroContratos');
		$catalogos->get('acatcontrato/buscarContratosEditar/(:any)','Catalogos::buscarContratosEditar/$1');
		$catalogos->post('acatcontrato/actualizarContratos','Catalogos::actualizarContratos');
		$catalogos->get('acatcontrato/eliminarContratos/(:any)','Catalogos::eliminarContratos/$1');
		$catalogos->get('acatcontrexp','Catalogos::acatcontrexp',['filter'=>'autenticar']);
		$catalogos->get('acatcontrexp/llenarTablaExpedidos','Catalogos::llenarTablaExpedidos');
		$catalogos->post('acatcontrexp/registrarExpedidos','Catalogos::registrarExpedidos');
		$catalogos->get('acatcontrexp/buscarExpedidosEditar/(:any)','Catalogos::buscarExpedidosEditar/$1');
		$catalogos->post('acatcontrexp/actualizarExpedidos','Catalogos::actualizarExpedidos');
		$catalogos->get('acatcontrexp/eliminarExpedidos/(:any)','Catalogos::eliminarExpedidos/$1');

		$catalogos->get('acatalogos/llenarComboCatContrato','Catalogos::llenarComboCatContrato');
		$catalogos->get('acatalogos/llenarComboCatExpedicion','Catalogos::llenarComboCatExpedicion');
		$catalogos->get('acatalogos/llenarComboCatPermisos','Catalogos::llenarComboCatPermisos');
		$catalogos->get('acatalogos/llenarComboCatTarifa','Catalogos::llenarComboCatTarifa');
		$catalogos->get('acatalogos/llenarComboCatEstatus','Catalogos::llenarComboCatEstatus');
		$catalogos->get('acatalogos/llenarComboConceptos','Catalogos::llenarComboConceptos');
		$catalogos->get('acatalogos/llenarComboAnticipos/(:any)','Catalogos::llenarComboAnticipos/$1');

	});

	$admins->group('', function($tramites){
		$tramites->get('aregusuarios','Tramites::aregusuarios',['filter'=>'autenticar']);
		$tramites->get('aregusuarios/llenarTablaUsuariosContratosMes','Tramites::llenarTablaUsuariosContratosMes');
		$tramites->post('aregusuarios/guardarUsuarioNuevo','Tramites::guardarUsuarioNuevo');
		$tramites->post('aregusuarios/asignarContratoUsuario','Tramites::asignarContratoUsuario');
		$tramites->get('aregusuarios/cargarContratosUsuarios/(:any)','Tramites::cargarContratosUsuarios/$1');
		$tramites->post('aregusuarios/actualizarRegistroUsuario','Tramites::actualizarRegistroUsuario');
		$tramites->get('amodusuarios','Tramites::amodusuarios',['filter'=>'autenticar']);
		$tramites->get('amodusuarios/llenarTablaUsuarioModificar/(:any)','Tramites::llenarTablaUsuarioModificar/$1');
		$tramites->get('amodusuarios/cargarUsuarioModificar/(:any)','Tramites::cargarUsuarioModificar/$1');
		$tramites->post('amodusuarios/actualizarUsuarioInformacion','Tramites::actualizarUsuarioInformacion');
		$tramites->get('aagrcontrato','Tramites::aagrcontrato',['filter'=>'autenticar']);
		$tramites->get('aagrcontrato/llenarTablaUsuariosAsignado/(:any)','Tramites::llenarTablaUsuariosAsignado/$1');
		$tramites->get('aagrcontrato/cargaUsuarioAsignar/(:any)','Tramites::cargaUsuarioAsignar/$1');
		$tramites->post('aagrcontrato/asignarNuevoContrato','Tramites::asignarNuevoContrato');
		$tramites->get('aagrcontrato/cargarUsuarioContratos/(:any)','Tramites::cargarUsuarioContratos/$1');
		$tramites->get('amodcontrato','Tramites::amodcontrato',['filter'=>'autenticar']);
		$tramites->get('amodcontrato/llenarTablaContratoModificar/(:any)','Tramites::llenarTablaContratoModificar/$1');
		$tramites->post('amodcontrato/actualizarContratoDetalle','Tramites::actualizarContratoDetalle');
		$tramites->get('atracontrato','Tramites::atracontrato',['filter'=>'autenticar']);
		$tramites->get('atracontrato/llenarTablaContratoTransferir/(:any)','Tramites::llenarTablaContratoTransferir/$1');
		$tramites->get('atracontrato/llenarUbicacionContrato/(:any)','Tramites::llenarUbicacionContrato/$1');
		$tramites->post('atracontrato/guardarUsuarioTransferir','Tramites::guardarUsuarioTransferir');
		$tramites->get('atracontrato/llenarUsuarioTransferir/(:any)','Tramites::llenarUsuarioTransferir/$1');
		$tramites->post('atracontrato/actualizarUsuarioTransferir','Tramites::actualizarUsuarioTransferir');
		$tramites->post('atracontrato/transferirContratoFinal','Tramites::transferirContratoFinal');
		$tramites->get('abajcontrato','Tramites::abajcontrato',['filter'=>'autenticar']);
		$tramites->get('abajcontrato/llenarTablaContratoBaja/(:any)','Tramites::llenarTablaContratoBaja/$1');
		$tramites->get('abajcontrato/cargarContratoBaja/(:any)','Tramites::cargarContratoBaja/$1');
		$tramites->post('abajcontrato/actualizarContratoBaja','Tramites::actualizarContratoBaja');
		$tramites->get('abajcontrato/acuseReciboBaja/(:any)','Tramites::acuseReciboBaja/$1');
		$tramites->get('aactcontrato','Tramites::aactcontrato',['filter'=>'autenticar']);
		$tramites->get('aactcontrato/autoCompletarBajasTem/(:any)','Tramites::autoCompletarBajasTem/$1');
		$tramites->get('aactcontrato/buscarEditarBajas/(:any)','Tramites::buscarEditarBajas/$1');
		$tramites->post('aactcontrato/reactivarContratoBaja','Tramites::reactivarContratoBaja');
		$tramites->get('amodubicacio','Tramites::amodubicacio',['filter'=>'autenticar']);
		$tramites->get('amodubicacio/llenarTablaUbicacionModificar/(:any)','Tramites::llenarTablaUbicacionModificar/$1');
		$tramites->post('amodubicacio/actualizarUbicacion','Tramites::actualizarUbicacion');
		$tramites->get('aregconvenio','Tramites::aregconvenio',['filter'=>'autenticar']);
		$tramites->get('aregconvenio/llenarTablaContratoConvenio/(:any)','Tramites::llenarTablaContratoConvenio/$1');
		$tramites->get('aregconvenio/buscarUsuarioDeudor/(:any)','Tramites::buscarUsuarioDeudor/$1');
		$tramites->get('amodcontrato','Tramites::amodcontrato',['filter'=>'autenticar']);
		$tramites->get('aborcontrato','Tramites::aborcontrato',['filter'=>'autenticar']);
		$tramites->get('aborcontrato/llenarTablaUsuarioContratos/(:any)','Tramites::llenarTablaUsuarioContratos/$1');
		$tramites->get('aborcontrato/eliminarContratos/(:any)','Tramites::eliminarContratos/$1');
		$tramites->get('aborusuarios','Tramites::aborusuarios',['filter'=>'autenticar']);
		$tramites->get('aborusuarios/llenarTablaUsuariosContratosHoy','Tramites::llenarTablaUsuariosContratosHoy');
		$tramites->get('aborusuarios/contratoUsuarioBorrar/(:any)','Tramites::contratoUsuarioBorrar/$1');
		$tramites->get('aborusuarios/eliminarUsuarioContrato/(:any)','Tramites::eliminarUsuarioContrato/$1');

		$tramites->get('atramites/autocompletarUsuario/(:any)','Tramites::autocompletarUsuario/$1');
		$tramites->get('atramites/autocompletarContrato/(:any)','Tramites::autocompletarContrato/$1');
		$tramites->get('atramites/firmaComiteTramites','Tramites::firmaComiteTramites');

	});

	$admins->group('', function($cobros){
		$cobros->get('apagoservic','Cobros::apagoservic',['filter'=>'autenticar']);
		$cobros->get('apagoservic/cargarDeudasDetalle/(:any)','Cobros::cargarDeudasDetalle/$1');
		$cobros->get('apagoservic/cargarHistoricoPagado/(:any)','Cobros::cargarHistoricoPagado/$1');
		$cobros->post('apagoservic/agregarConceptosDetalle','Cobros::agregarConceptosDetalle');
		$cobros->post('apagoservic/agregarAnticiposDetalle','Cobros::agregarAnticiposDetalle');
		$cobros->post('apagoservic/eliminarDetallesPago','Cobros::eliminarDetallesPago');
		$cobros->get('apagoservic/buscarCooperacion/(:any)','Cobros::buscarCooperacion/$1');
		$cobros->post('apagoservic/modificarCoperacion','Cobros::modificarCoperacion');
		$cobros->get('apagoservic/buscarTotalPago/(:any)','Cobros::buscarTotalPago/$1');
		$cobros->post('apagoservic/realizarPagoCuenta','Cobros::realizarPagoCuenta');
		$cobros->get('apagoservic/modificarTotalesConcepto/(:any)','Cobros::modificarTotalesConcepto/$1');
		$cobros->post('apagoservic/realizarPagoParcialCuenta','Cobros::realizarPagoParcialCuenta');
		$cobros->get('apagoservic/calculoTotalDeuda/(:any)','Cobros::calculoTotalDeuda/$1');
		$cobros->get('apagoespecia','Cobros::apagoespecia',['filter'=>'autenticar']);
		$cobros->get('apagoespecia/cargarDeudasEspeciales/(:any)','Cobros::cargarDeudasEspeciales/$1');
		$cobros->post('apagoespecia/realizarAjusteParcial','Cobros::realizarAjusteParcial');
		$cobros->get('acreacargo','Cobros::acreacargo',['filter'=>'autenticar']);
		$cobros->get('acreacargo/agregandoCargos/(:any)','Cobros::agregandoCargos/$1');
		$cobros->get('acreacargo/agregandoCargosSelec/(:any)','Cobros::agregandoCargosSelec/$1');
		$cobros->get('acreacargo/mostrarResumenCargos/(:any)','Cobros::mostrarResumenCargos/$1');
		$cobros->get('acrearecargo','Cobros::acrearecargo',['filter'=>'autenticar']);
		$cobros->get('acrearecargo/buscarIdUsuariosAdeudo','Cobros::buscarIdUsuariosAdeudo');
		$cobros->get('acrearecargo/agregandoRecargos/(:any)','Cobros::agregandoRecargos/$1');
		$cobros->get('acrearecargo/mostrarResumenRecargos','Cobros::mostrarResumenRecargos');
		
		$cobros->get('acobros/autoCompletarUsuario/(:any)','Cobros::autoCompletarUsuario/$1');
		$cobros->get('acobros/cargarUsuarioGenerales/(:any)','Cobros::cargarUsuarioGenerales/$1');
		$cobros->get('acobros/modificarTotalesConcepto/(:any)','Cobros::modificarTotalesConcepto/$1');
		$cobros->get('acobros/buscarContratosActivos','Cobros::buscarContratosActivos');
		$cobros->get('acobros/arregloContratosTotales/(:any)','Cobros::arregloContratosTotales/$1');

	});

	$admins->group('', function($comite){
		$comite->get('regiscomite','Comite::regiscomite',['filter'=>'autenticar']);
		$comite->get('regiscomite/llenarTablaComite','Comite::llenarTablaComite');
		$comite->post('regiscomite/guardarComiteNuevo','Comite::guardarComiteNuevo');
		$comite->get('regiscomite/buscarEditarComite/(:any)','Comite::buscarEditarComite/$1');
		$comite->post('regiscomite/actualizarRegistroComite','Comite::actualizarRegistroComite');
		$comite->get('regiscomite/eliminarRegistroComite/(:any)','Comite::eliminarRegistroComite/$1');
		$comite->get('regiscomite/enviarCorreoComiteCred/(:any)','Comite::enviarCorreoComiteCred/$1');
		$comite->get('reaccomite','Comite::reaccomite',['filter'=>'autenticar']);
		$comite->get('reaccomite/autoCompletarStaffNombre/(:any)','Comite::autoCompletarStaffNombre/$1');
		$comite->get('reaccomite/tablaStaffReactivar/(:any)','Comite::tablaStaffReactivar/$1');
		$comite->get('acreaasamble','Comite::acreaasamble',['filter'=>'autenticar']);
		$comite->get('acreaasamble/llenarTablaAsambleas','Comite::llenarTablaAsambleas');
		$comite->post('acreaasamble/guardarAsambleaNueva','Comite::guardarAsambleaNueva');
		$comite->get('acreaasamble/buscarEditarAsamblea/(:any)','Comite::buscarEditarAsamblea/$1');
		$comite->post('acreaasamble/actualizarAsamblea','Comite::actualizarAsamblea');
		$comite->get('acreaasamble/eliminarAsamblea/(:any)','Comite::eliminarAsamblea/$1');
		$comite->get('aconvasamble','Comite::aconvasamble',['filter'=>'autenticar']);
		$comite->get('aconvasamble/llenarTablaConvocatorias','Comite::llenarTablaConvocatorias');
		$comite->get('aconvasamble/totalesUsuariosConvocados/(:any)','Comite::totalesUsuariosConvocados/$1');
		$comite->get('aconvasamble/usuariosConvocados','Comite::usuariosConvocados');
		$comite->post('aconvasamble/creandoInvitacionUsuario','Comite::creandoInvitacionUsuario');
		$comite->get('aconvasamble/consultarAsambleaConvocada/(:any)','Comite::consultarAsambleaConvocada/$1');
		$comite->get('aconvasamble/cerrarAsambleaConvocada/(:any)','Comite::cerrarAsambleaConvocada/$1');
		$comite->get('aconvasamble/informeAsambleaAsistencias/(:any)','Comite::informeAsambleaAsistencias/$1');
		$comite->get('aconvasamble/usuariosFaltantes/(:any)','Comite::usuariosFaltantes/$1');
		$comite->post('aconvasamble/aplicandoSanciones','Comite::aplicandoSanciones');
		$comite->get('aconvasamble/mostrarResumenAsamblea/(:any)','Comite::mostrarResumenAsamblea/$1');
		$comite->get('asisasamblea','Comite::asisasamblea',['filter'=>'autenticar']);
		$comite->get('asisasamblea/llenarComboAsambleas','Comite::llenarComboAsambleas');
		$comite->get('asisasamblea/autoCompletarUsuario/(:any)','Comite::autoCompletarUsuario/$1');
		$comite->get('asisasamblea/marcarAsistencia/(:any)','Comite::marcarAsistencia/$1');

	});

	$admins->group('', function($reportes){
		$reportes->get('aimpcontrato','Reportes::aimpcontrato',['filter'=>'autenticar']);
		$reportes->get('aimpcontrato/mostrarContratosActivos/(:any)','Reportes::mostrarContratosActivos/$1');
		$reportes->get('areimtransfe','Reportes::areimtransfe',['filter'=>'autenticar']);
		$reportes->get('areimtransfe/autoCompletarTransferencias/(:any)','Reportes::autoCompletarTransferencias/$1');
		$reportes->get('areimtransfe/mostrarTransferContratos/(:any)','Reportes::mostrarTransferContratos/$1');
		$reportes->get('areimpbajas','Reportes::areimpbajas',['filter'=>'autenticar']);
		$reportes->get('areimpbajas/autoCompletarBajas/(:any)','Reportes::autoCompletarBajas/$1');
		$reportes->get('areimpbajas/mostrarBajasContratos/(:any)','Reportes::mostrarBajasContratos/$1');
		$reportes->get('areimreactiv','Reportes::areimreactiv',['filter'=>'autenticar']);
		$reportes->get('areimreactiv/autoCompletarReactivados/(:any)','Reportes::autoCompletarReactivados/$1');
		$reportes->get('areimreactiv/mostrarReactivosContratos/(:any)','Reportes::mostrarReactivosContratos/$1');
		$reportes->get('areimcompago','Reportes::areimcompago',['filter'=>'autenticar']);
		$reportes->get('areimcompago/llenarTablaRecibosPago','Reportes::llenarTablaRecibosPago');
		$reportes->get('areimcomdomi','Reportes::areimcomdomi',['filter'=>'autenticar']);
		$reportes->get('areimcomdomi/buscarComprobanteDomicilio/(:any)','Reportes::buscarComprobanteDomicilio/$1');
		$reportes->get('alistacortes','Reportes::alistacortes',['filter'=>'autenticar']);
		$reportes->get('alistacortes/llenatTablaDeudores','Reportes::llenatTablaDeudores');
		$reportes->get('alistacortes/exportadorListaDeudas','Reportes::exportadorListaDeudas');
		$reportes->get('acortecaja','Reportes::acortecaja',['filter'=>'autenticar']);
		$reportes->get('acortecaja/listadoGeneraCorte/(:any)','Reportes::listadoGeneraCorte/$1');
		$reportes->get('acortecaja/listadoGeneraCorteSem/(:any)','Reportes::listadoGeneraCorteSem/$1');
		$reportes->get('acortecaja/llenarComboAnioMes','Reportes::llenarComboAnioMes');
		$reportes->get('acortecaja/llenarComboMes/(:any)','Reportes::llenarComboMes/$1');
		$reportes->get('acortecaja/llenarComboSemana/(:any)','Reportes::llenarComboSemana/$1');
		$reportes->get('acortecaja/llenarComboDia/(:any)','Reportes::llenarComboDia/$1');
		$reportes->get('acortecaja/listadoGeneraMeses/(:any)','Reportes::listadoGeneraMeses/$1');
		$reportes->get('acortecaja/listadoGeneraDias/(:any)','Reportes::listadoGeneraDias/$1');
		$reportes->get('acortecaja/llenarTablaPaginadaFolios/(:any)','Reportes::llenarTablaPaginadaFolios/$1');
		$reportes->get('acortecaja/exportadorListaFolios/(:any)','Reportes::exportadorListaFolios/$1');
		$reportes->get('reportedeuda','Reportes::reportedeuda');
		$reportes->get('reportedeuda/mostrarDeudasDetalle/(:any)','Reportes::mostrarDeudasDetalle/$1');
		
		$reportes->get('areportes/imprimirContrato/(:any)','Reportes::imprimirContrato/$1');
		$reportes->get('areportes/imprimirComprobantePago/(:any)','Reportes::imprimirComprobantePago/$1');
		$reportes->get('areportes/imprimirAcuseBaja/(:any)','Reportes::imprimirAcuseBaja/$1');
		$reportes->get('areportes/imprimirAcuseReactiva/(:any)','Reportes::imprimirAcuseReactiva/$1');
		$reportes->get('areportes/imprimirReciboTransferencia/(:any)','Reportes::imprimirReciboTransferencia/$1');

	});


});

$routes->resource('acatconcepto', ['controllers/Administrador'=>'Catalogos']);
$routes->resource('acatcontrato', ['controllers/Administrador'=>'Catalogos']);
$routes->resource('acatalogos', ['controllers/Administrador'=>'Catalogos']);

$routes->resource('aregusuarios', ['controllers/Administrador'=>'Tramites']);
$routes->resource('amodusuarios', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aagrcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('amodcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('atracontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('abajcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('amodubicacio', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aregconvenio', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aborcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aborusuarios', ['controllers/Administrador'=>'Tramites']);
$routes->resource('atramites', ['controllers/Administrador'=>'Tramites']);

$routes->resource('apagoservic', ['controllers/Administrador'=>'Cobros']);
$routes->resource('apagoespecia', ['controllers/Administrador'=>'Cobros']);
$routes->resource('acreacargo', ['controllers/Administrador'=>'Cobros']);
$routes->resource('acrearecargo', ['controllers/Administrador'=>'Cobros']);
$routes->resource('acobros', ['controllers/Administrador'=>'Cobros']);

$routes->resource('regiscomite', ['controllers/Administrador'=>'Comite']);
$routes->resource('reaccomite', ['controllers/Administrador'=>'Comite']);
$routes->resource('acreaasamble', ['controllers/Administrador'=>'Comite']);
$routes->resource('aconvasamble', ['controllers/Administrador'=>'Comite']);
$routes->resource('asisasamblea', ['controllers/Administrador'=>'Comite']);

$routes->resource('aimpcontrato', ['controllers/Administrador'=>'Reportes']);
$routes->resource('areimtransfe', ['controllers/Administrador'=>'Reportes']);
$routes->resource('areimpbajas', ['controllers/Administrador'=>'Reportes']);
$routes->resource('areimcompago', ['controllers/Administrador'=>'Reportes']);
$routes->resource('areimcomdomi', ['controllers/Administrador'=>'Reportes']);
$routes->resource('areimcomdomi', ['controllers/Administrador'=>'Reportes']);
$routes->resource('alistacortes', ['controllers/Administrador'=>'Reportes']);
$routes->resource('acortecaja', ['controllers/Administrador'=>'Reportes']);
$routes->resource('areportes', ['controllers/Administrador'=>'Reportes']);
$routes->resource('reportedeuda', ['controllers/Administrador'=>'Reportes']);

$routes->resource('adashboard', ['controllers/Administrador'=>'Dashboard']);

$routes->resource('reportegral', ['controllers/Auditoria'=>'Reportes']);


$routes->group('', ['namespace'=>'App\Controllers\Cuenta'], function($cuenta){
	$cuenta->group('',function($acceso){
		$acceso->get('accesoadmin','Cuenta::accesoadmin');
		$acceso->post('accesoadmin/verificandoCredencial','Cuenta::verificandoCredencial');

	});
});


$routes->group('', ['namespace'=>'App\Controllers\Sistema'], function($sistema){

	$sistema->group('',function($menus){
		$menus->get('menunivela','Menuopcion::menunivela',['filter'=>'autenticar']);
		$menus->get('menunivela/llenarTablaMenuA','Menuopcion::llenarTablaMenuA');
		$menus->post('menunivela/guardarMenuNivelA','Menuopcion::guardarMenuNivelA');
		$menus->get('menunivela/buscarEditarMenuA/(:any)','Menuopcion::buscarEditarMenuA/$1');
		$menus->post('menunivela/actualizarMenuNivelA','Menuopcion::actualizarMenuNivelA');
		$menus->get('menunivela/eliminarMenuNivelA/(:any)','Menuopcion::eliminarMenuNivelA/$1');
		$menus->get('menunivelb','Menuopcion::menunivelb',['filter'=>'autenticar']);
		$menus->get('menunivelb/llenarTablaMenuB','Menuopcion::llenarTablaMenuB');
		$menus->post('menunivelb/guardarMenuNivelB','Menuopcion::guardarMenuNivelB');
		$menus->get('menunivelb/buscarEditarMenuB/(:any)','Menuopcion::buscarEditarMenuB/$1');
		$menus->post('menunivelb/actualizarMenuNivelB','Menuopcion::actualizarMenuNivelB');
		$menus->get('menunivelb/eliminarMenuNivelB/(:any)','Menuopcion::eliminarMenuNivelB/$1');
		$menus->get('menunivelc','Menuopcion::menunivelc',['filter'=>'autenticar']);
		$menus->get('menunivelc/llenarTablaMenuC','Menuopcion::llenarTablaMenuC');
		$menus->post('menunivelc/guardarMenuNivelC','Menuopcion::guardarMenuNivelC');
		$menus->get('menunivelc/buscarEditarMenuC/(:any)','Menuopcion::buscarEditarMenuC/$1');
		$menus->post('menunivelc/actualizarMenuNivelC','Menuopcion::actualizarMenuNivelC');
		$menus->get('menunivelc/eliminarMenuNivelC/(:any)','Menuopcion::eliminarMenuNivelC/$1');
		$menus->get('menuniveld','Menuopcion::menuniveld',['filter'=>'autenticar']);
		$menus->get('menuniveld/llenarTablaMenuD','Menuopcion::llenarTablaMenuD');
		$menus->post('menuniveld/guardarMenuNivelD','Menuopcion::guardarMenuNivelD');
		$menus->get('menuniveld/buscarEditarMenuD/(:any)','Menuopcion::buscarEditarMenuD/$1');
		$menus->post('menuniveld/actualizarMenuNivelD','Menuopcion::actualizarMenuNivelD');
		$menus->get('menuniveld/eliminarMenuNivelD/(:any)','Menuopcion::eliminarMenuNivelD/$1');

		$menus->get('menuopcion/llenarComboMenuA','Menuopcion::llenarComboMenuA');
		$menus->get('menuopcion/llenarComboMenuB/(:any)','Menuopcion::llenarComboMenuB/$1');
		$menus->get('menuopcion/llenarComboMenuC/(:any)','Menuopcion::llenarComboMenuC/$1');
		$menus->get('menuopcion/llenarComboAMenuC','Menuopcion::llenarComboAMenuC');
		$menus->get('menuopcion/llenarComboBMenuD/(:any)','Menuopcion::llenarComboBMenuD/$1');
		$menus->get('menuopcion/buscarIconos/(:any)','Menuopcion::buscarIconos/$1');

		$menus->get('menuarmado/armarMenuSistema/(:any)','Menuarmado::armarMenuSistema/$1');
		$menus->get('menuarmado/armarMenuSistemaRoles','Menuarmado::armarMenuSistemaRoles');

	});

	$sistema->group('', function($catalogos){
		$catalogos->get('catareas','Catalogos::catareas',['filter'=>'roladmin']);
		$catalogos->get('catareas/llenarTablaAreas','Catalogos::llenarTablaAreas');
		$catalogos->post('catareas/guardarAreas','Catalogos::guardarAreas');
		$catalogos->get('catareas/buscaEditarAreas/(:any)','Catalogos::buscaEditarAreas/$1');
		$catalogos->post('catareas/actualizarAreas','Catalogos::actualizarAreas');
		$catalogos->get('catareas/eliminarAreas/(:any)','Catalogos::eliminarAreas/$1');

		$catalogos->get('catpuestos','Catalogos::catpuestos',['filter'=>'roladmin']);
		$catalogos->get('catpuestos/llenarTablaPuestos','Catalogos::llenarTablaPuestos');
		$catalogos->post('catpuestos/guardarPuestos','Catalogos::guardarPuestos');
		$catalogos->get('catpuestos/buscarEditarPuestos/(:any)','Catalogos::buscarEditarPuestos/$1');
		$catalogos->post('catpuestos/actualizarPuestos','Catalogos::actualizarPuestos');
		$catalogos->get('catpuestos/eliminarPuestos/(:any)','Catalogos::eliminarPuestos/$1');

		$catalogos->get('catperfiles','Catalogos::catperfiles',['filter'=>'roladmin']);
		$catalogos->get('catperfiles/llenarTablaPerfiles','Catalogos::llenarTablaPerfiles');
		$catalogos->get('catperfiles/armarMenuAsignaPerfiles','Catalogos::armarMenuAsignaPerfiles');
		$catalogos->post('catperfiles/guardarPerfiles','Catalogos::guardarPerfiles');
		$catalogos->get('catperfiles/buscarEditarPerfiles/(:any)','Catalogos::buscarEditarPerfiles/$1');
		$catalogos->post('catperfiles/actualizarPerfiles','Catalogos::actualizarPerfiles');
		$catalogos->get('catperfiles/eliminarPerfil/(:any)','Catalogos::eliminarPerfil/$1');

		$catalogos->get('catestatus','Catalogos::catestatus',['filter'=>'roladmin']);
		$catalogos->get('catestatus/llenarTablaEstatus','Catalogos::llenarTablaEstatus');
		$catalogos->post('catestatus/guardarEstatus','Catalogos::guardarEstatus');
		$catalogos->get('catestatus/buscarEditarEstatus/(:any)','Catalogos::buscarEditarEstatus/$1');
		$catalogos->post('catestatus/actualizarEstatus','Catalogos::actualizarEstatus');
		$catalogos->get('catestatus/eliminarEstatus/(:any)','Catalogos::eliminarEstatus/$1');

		$catalogos->get('catalogos/llenarComboAreas','Catalogos::llenarComboAreas');
		$catalogos->get('catalogos/llenarComboPuestos/(:any)','Catalogos::llenarComboPuestos/$1');
		$catalogos->get('catalogos/armarMenuAsignaPerfiles','Catalogos::armarMenuAsignaPerfiles');
		$catalogos->get('catalogos/llenarComboCatEstatus','Catalogos::llenarComboCatEstatus');
		$catalogos->get('catalogos/llenarComboCatEstados','Catalogos::llenarComboCatEstados');
		$catalogos->get('catalogos/llenarComboCatMunicipios/(:any)','Catalogos::llenarComboCatMunicipios/$1');
		$catalogos->get('catalogos/llenarComboCatCodPostales/(:any)','Catalogos::llenarComboCatCodPostales/$1');
		$catalogos->get('catalogos/llenarComboCatColonias/(:any)','Catalogos::llenarComboCatColonias/$1');
		$catalogos->get('catalogos/llenarCompletarCalles/(:any)','Catalogos::llenarCompletarCalles/$1');

	});

	$sistema->group('', function($privilegios){
		$privilegios->get('asignastaff','Privilegios::asignastaff',['filter'=>'autenticar']);
		$privilegios->get('asignastaff/llenarTablaPerfilStaff','Privilegios::llenarTablaPerfilStaff');
		$privilegios->post('asignastaff/guardarAsignacionStaff','Privilegios::guardarAsignacionStaff');
		$privilegios->get('asignastaff/buscarAsignacionStaff/(:any)','Privilegios::buscarAsignacionStaff/$1');
		$privilegios->post('asignastaff/actualizarPerfilStaff','Privilegios::actualizarPerfilStaff');
		$privilegios->get('asignastaff/eliminarAsignacionStaff/(:any)','Privilegios::eliminarAsignacionStaff/$1');

		$privilegios->get('asignausuario','Privilegios::asigusuario',['filter'=>'autenticar']);
		$privilegios->get('asignausuario/llenarTablaPerfilUsuario','Privilegios::llenarTablaPerfilUsuario');
		$privilegios->get('asignausuario/llenarComboPerfilesDatos','Privilegios::llenarComboPerfilesDatos');
		$privilegios->get('asignausuario/llenarComboUsuariosDatos','Privilegios::llenarComboUsuariosDatos');
		$privilegios->post('asignausuario/datosGuardarAsignacion','Privilegios::datosGuardarAsignacion');
		$privilegios->get('asignausuario/buscarEditarAsignacion/(:any)','Privilegios::buscarEditarAsignacion/$1');
		$privilegios->post('asignausuario/datosActualizarAsignacion','Privilegios::datosActualizarAsignacion');
		$privilegios->get('asignausuario/datosEliminarAsignacion/(:any)','Privilegios::datosEliminarAsignacion/$1');

		$privilegios->get('privilegios/llenarComboPerfilesStaff','Privilegios::llenarComboPerfilesStaff');
		$privilegios->get('privilegios/llenarComboStaff','Privilegios::llenarComboStaff');
		$privilegios->get('privilegios/llenarMenuPerfil/(:any)','Privilegios::llenarMenuPerfil/$1');
		$privilegios->get('privilegios/llenarComboStaffDatos/(:any)','Privilegios::llenarComboStaffDatos/$1');

	});

	$sistema->group('', function($mailers){
		$mailers->get('mailmuestra','Mailers::mailmuestra');

	});




});

$routes->resource('menunivela', ['controllers/Sistema'=>'Menuopcion']);
$routes->resource('menunivelb', ['controllers/Sistema'=>'Menuopcion']);
$routes->resource('menunivelc', ['controllers/Sistema'=>'Menuopcion']);
$routes->resource('menuniveld', ['controllers/Sistema'=>'Menuopcion']);
$routes->resource('asignastaff', ['controllers/Sistema'=>'Privilegios']);


/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 * 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
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
