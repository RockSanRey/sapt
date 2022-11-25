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

	$routes->group('', function($dashboard){
		$dashboard->get('dashboard','Dashboard::index',['filter'=> 'roldashboard']);
		$dashboard->get('inicio', 'Dashboard::inicio');
		$dashboard->get('dashboard/mensajeSaludoInicial/(:any)', 'Dashboard::mensajeSaludoInicial/$1');
		$dashboard->get('dashboard/graficoEstatusContratos', 'Dashboard::graficoEstatusContratos');
		$dashboard->get('dashboard/graficoDeudaAcumulada', 'Dashboard::graficoDeudaAcumulada');
	});

	$routes->group('', function($usuarios){
		$usuarios->get('regusuarios','Usuarios::regusuarios');
		$usuarios->post('regusuarios/guardarRegistroNuevo','Usuarios::guardarRegistroNuevo');
		$usuarios->post('regusuarios/asignarContratoUsuario','Usuarios::asignarContratoUsuario');
		$usuarios->get('regusuarios/llenarTablaUsuariosContratos','Usuarios::llenarTablaUsuariosContratos');
		$usuarios->get('regusuarios/cargarInformeContratos/(:any)','Usuarios::cargarInformeContratos/$1');
		$usuarios->post('regusuarios/actualizarRegistroUsuario','Usuarios::actualizarRegistroUsuario');
		$usuarios->get('regusuarios/mostrandoContratoUsuario/(:any)','Usuarios::mostrandoContratoUsuario/$1');
		$usuarios->get('asigcontrato','Usuarios::asigcontrato');
		$usuarios->get('asigcontrato/autoCompletarUsuario/(:any)','Usuarios::autoCompletarUsuario/$1');
		$usuarios->get('asigcontrato/llenarTablaUsuariosAsignado/(:any)','Usuarios::llenarTablaUsuariosAsignado/$1');
		$usuarios->get('asigcontrato/buscarUsuario/(:any)','Usuarios::buscarUsuario/$1');
		$usuarios->post('asigcontrato/asignarNuevoContrato','Usuarios::asignarNuevoContrato');
		$usuarios->get('asigcontrato/mostrandoContratoNuevo/(:any)','Usuarios::mostrandoContratoNuevo/$1');
		$usuarios->get('asigcontrato/cargarUsuarioContratos/(:any)','Usuarios::cargarUsuarioContratos/$1');
		$usuarios->get('modcontrato','Usuarios::modcontrato');
		$usuarios->get('modcontrato/autoCompletarModificacion/(:any)','Usuarios::autoCompletarModificacion/$1');
		$usuarios->get('modcontrato/cargarModificacionContratos/(:any)','Usuarios::cargarModificacionContratos/$1');
		$usuarios->post('modcontrato/actualizarContratoDetalle','Usuarios::actualizarContratoDetalle');
		$usuarios->get('modcontrato/actualzaFilaContrato/(:any)','Usuarios::actualzaFilaContrato/$1');
		$usuarios->get('bajacontrato','Usuarios::bajacontrato');
		$usuarios->get('bajacontrato/autoCompletarBajas/(:any)','Usuarios::autoCompletarBajas/$1');
		$usuarios->post('bajacontrato/actualizarContratoBaja','Usuarios::actualizarContratoBaja');
		$usuarios->get('bajacontrato/acuseReciboBaja/(:any)','Usuarios::acuseReciboBaja/$1');
		$usuarios->get('transdominio','Usuarios::transdominio');
		$usuarios->get('transdominio/autoCompletarContrato/(:any)','Usuarios::autoCompletarContrato/$1');
		$usuarios->get('transdominio/cargarContratoDetalles/(:any)','Usuarios::cargarContratoDetalles/$1');
		$usuarios->post('transdominio/guardarUsuarioTransfer','Usuarios::guardarUsuarioTransfer');
		$usuarios->post('transdominio/transferirContratoUsuario','Usuarios::transferirContratoUsuario');
		$usuarios->get('modusuario','Usuarios::modusuario');
		$usuarios->get('modusuario/autoCompletarUsuario/(:any)','Usuarios::autoCompletarUsuario/$1');
		$usuarios->get('modusuario/llenarTablaUsuarioModificar/(:any)','Usuarios::llenarTablaUsuarioModificar/$1');
		$usuarios->get('modusuario/cargarUsuarioModificar/(:any)','Usuarios::cargarUsuarioModificar/$1');
		$usuarios->post('modusuario/actualizarRegistroUsuario','Usuarios::actualizarRegistroUsuario');

		$usuarios->get('regconvenio','Usuarios::regconvenio');
		$usuarios->get('regconvenio/llenarTablaDeudas','Usuarios::llenarTablaDeudas');
		$usuarios->get('regconvenio/buscarUsuarioDeudor/(:any)','Usuarios::buscarUsuarioDeudor/$1');
		$usuarios->post('regconvenio/crearConvenio','Usuarios::crearConvenio');
		$usuarios->get('regconvenio/buscarUsuarioCitatorio/(:any)','Usuarios::buscarUsuarioCitatorio/$1');
		$usuarios->post('regconvenio/crearCitatorio','Usuarios::crearCitatorio');
		$usuarios->get('regconvenio/imprimirCitatorios/(:any)','Usuarios::imprimirCitatorios/$1');
		$usuarios->get('regconvenio/buscarTotalesConcepto/(:any)','Usuarios::buscarTotalesConcepto/$1');
		$usuarios->get('regconvenio/buscandoConvenCitat/(:any)','Usuarios::buscandoConvenCitat/$1');

		$usuarios->get('asisasamb','Usuarios::asisasamb');

	});

	$routes->group('', function($comite){
		$comite->get('regcomite','Comite::regcomite');
		$comite->get('regcomite/llenarTablaUsuariosComite','Comite::llenarTablaUsuariosComite');
		$comite->post('regcomite/guardarUsuarioNuevo','Comite::guardarUsuarioNuevo');
		$comite->get('regcomite/cargarInformeUsuarios/(:any)','Comite::cargarInformeUsuarios/$1');
		$comite->get('regcomite/eliminarRegistroUsuarios/(:any)','Comite::eliminarRegistroUsuarios/$1');
		$comite->post('regcomite/actualizarRegistroUsuario','Comite::actualizarRegistroUsuario');
		$comite->get('creaasamble','Comite::creaasamble');
		$comite->get('creaasamble/llenarTablaAsambleas','Comite::llenarTablaAsambleas');
		$comite->post('creaasamble/guardarAsambleaNueva','Comite::guardarAsambleaNueva');
		$comite->get('creaasamble/buscarEditarAsamblea/(:any)','Comite::buscarEditarAsamblea/$1');
		$comite->post('creaasamble/actualizarAsamblea','Comite::actualizarAsamblea');
		$comite->get('creaasamble/eliminarAsamblea/(:any)','Comite::eliminarAsamblea/$1');
		$comite->get('convasamble','Comite::convasamble');
		$comite->get('convasamble/llenarTablaConvocatorias','Comite::llenarTablaConvocatorias');
		$comite->get('convasamble/informeAsambleaConvoca/(:any)','Comite::informeAsambleaConvoca/$1');
		$comite->get('convasamble/usuariosConvocados','Comite::usuariosConvocados');
		$comite->post('convasamble/creandoInvitacionUsuario','Comite::creandoInvitacionUsuario');
		$comite->get('convasamble/informeAsambleaAsistencias/(:any)','Comite::informeAsambleaAsistencias/$1');
		$comite->get('convasamble/usuariosFaltantes/(:any)','Comite::usuariosFaltantes/$1');
		$comite->post('convasamble/aplicandoSanciones','Comite::aplicandoSanciones');
		$comite->get('convasamble/mostrarResumenConvocados/(:any)','Comite::mostrarResumenConvocados/$1');
		$comite->get('convasamble/consultarAsambleaConvocada/(:any)','Comite::consultarAsambleaConvocada/$1');
		$comite->get('convasamble/cerrarAsambleaConvocada/(:any)','Comite::cerrarAsambleaConvocada/$1');
		$comite->get('convasamble/listadoConvocados/(:any)','Comite::listadoConvocados/$1');
		$comite->get('asisasamble','Comite::asisasamble');
		$comite->get('asisasamble/marcarAsistencia/(:any)','Comite::marcarAsistencia/$1');
		$comite->get('asisasamble/autoCompletarUsuario/(:any)','Comite::autoCompletarUsuario/$1');

	});

	$routes->group('', function($catalogos){
		$catalogos->get('catcontratos','Catalogos::catcontratos');
		$catalogos->get('catcontratos/llenarTablaContratos','Catalogos::llenarTablaContratos');
		$catalogos->get('catcontratos/buscarContratosEditar/(:any)','Catalogos::buscarContratosEditar/$1');
		$catalogos->post('catcontratos/actualizarRegistroContratos','Catalogos::actualizarRegistroContratos');
		$catalogos->get('catcontratos/eliminarRegistroContratos/(:any)','Catalogos::eliminarRegistroContratos/$1');

		$catalogos->get('catconceptos','Catalogos::catconceptos');
		$catalogos->get('catconceptos/llenarTablaConceptos','Catalogos::llenarTablaConceptos');
		$catalogos->get('catconceptos/autoCompletDescrip/(:any)','Catalogos::autoCompletDescrip/$1');
		$catalogos->post('catconceptos/registrarConceptos','Catalogos::registrarConceptos');
		$catalogos->get('catconceptos/buscarConceptosEditar/(:any)','Catalogos::buscarConceptosEditar/$1');
		$catalogos->post('catconceptos/actualizarRegistroConceptos','Catalogos::actualizarRegistroConceptos');
		$catalogos->get('catconceptos/eliminarRegistroConceptos/(:any)','Catalogos::eliminarRegistroConceptos/$1');


		$catalogos->get('catcontratos/llenarComboTipoContratos','Catalogos::llenarComboTipoContratos');
		$catalogos->get('catconceptos/llenarComboConceptos','Catalogos::llenarComboConceptos');
		$catalogos->get('catconceptos/llenarComboAnticipos/(:any)','Catalogos::llenarComboAnticipos/$1');
		$catalogos->get('catalogos/llenarComboCatPuestos','Catalogos::llenarComboCatPuestos');
		$catalogos->get('catalogos/llenarComboCatPermisos','Catalogos::llenarComboCatPermisos');
		$catalogos->get('catalogos/llenarComboCatDescuentos','Catalogos::llenarComboCatDescuentos');
		$catalogos->get('catalogos/llenarComboCatEstatus','Catalogos::llenarComboCatEstatus');

	});

	$routes->group('', function($cobros){
		$cobros->get('pagoservicio','Cobros::pagoservicio');
		$cobros->get('pagoservicio/autoCompletarUsuario/(:any)','Cobros::autoCompletarUsuario/$1');
		$cobros->get('pagoservicio/cargarUsuarioGenerales/(:any)','Cobros::cargarUsuarioGenerales/$1');
		$cobros->get('pagoservicio/cargarDeudasDetalle/(:any)','Cobros::cargarDeudasDetalle/$1');
		$cobros->get('pagoservicio/cargarHistoricoPagado/(:any)','Cobros::cargarHistoricoPagado/$1');
		$cobros->get('pagoservicio/cargarUsuarioDeudas/(:any)','Cobros::cargarUsuarioDeudas/$1');
		$cobros->get('pagoservicio/cargarUsuarioPago/(:any)','Cobros::cargarUsuarioPago/$1');
		$cobros->get('pagoservicio/buscarCooperacion/(:any)','Cobros::buscarCooperacion/$1');
		$cobros->post('pagoservicio/modificarCoperacion','Cobros::modificarCoperacion');
		$cobros->post('pagoservicio/agregarConceptosDetalle','Cobros::agregarConceptosDetalle');
		$cobros->post('pagoservicio/agregarAnticiposDetalle','Cobros::agregarAnticiposDetalle');
		$cobros->get('pagoservicio/buscarDetallePago/(:any)','Cobros::buscarDetallePago/$1');
		$cobros->get('pagoservicio/eliminarDetallesPago/(:any)','Cobros::eliminarDetallesPago/$1');
		$cobros->get('pagoservicio/buscarTotalPago/(:any)','Cobros::buscarTotalPago/$1');
		$cobros->post('pagoservicio/realizarPagoCuenta/','Cobros::realizarPagoCuenta/');
		$cobros->post('pagoservicio/realizarPagoParcialCuenta','Cobros::realizarPagoParcialCuenta');
		$cobros->get('pagoservicio/imprimirComprobantePago/(:any)','Cobros::imprimirComprobantePago/$1');
		$cobros->get('pagoespecial','Cobros::pagoespecial');
		$cobros->get('pagoespecial/cargarDeudasEspeciales/(:any)','Cobros::cargarDeudasEspeciales/$1');
		$cobros->post('pagoespecial/agregarConceptoAbonoDeuda','Cobros::agregarConceptoAbonoDeuda');
		$cobros->post('pagoespecial/realizarPagoEspecial','Cobros::realizarPagoEspecial');
		$cobros->get('crearcargo','Cobros::crearcargo');
		$cobros->get('crearcargo/buscarUsuariosTotal','Cobros::buscarUsuariosTotal');
		$cobros->get('crearcargo/verificarMesCorriente/(:any)','Cobros::verificarMesCorriente/$1');
		$cobros->get('crearcargo/verificarMesSelectivo/(:any)','Cobros::verificarMesSelectivo/$1');
		$cobros->get('crearcargo/mostrarResumenCargos','Cobros::mostrarResumenCargos');
		$cobros->get('crearrecarg','Cobros::crearrecarg');
		$cobros->get('crearrecarg/buscarIdUsuariosAdeudo','Cobros::buscarIdUsuariosAdeudo');
		$cobros->get('crearrecarg/verificarMovimientos/(:any)','Cobros::verificarMovimientos/$1');
		$cobros->get('crearrecarg/mostrarResumenRecargos','Cobros::mostrarResumenRecargos');

	});

	$routes->group('', function($reportes){
		$reportes->get('listausuario','Reportes::listausuario');
		$reportes->get('listausuario/llenarListadosUsuarios','Reportes::llenarListadosUsuarios');
		$reportes->get('listausuario/llenarListadosFiltraCalles/(:any)','Reportes::llenarListadosFiltraCalles/$1');
		$reportes->get('listausuario/generarListadosNavegador','Reportes::generarListadosNavegador');
		$reportes->get('listausuario/llenarTablaPaginadaUsuarios/(:any)','Reportes::llenarTablaPaginadaUsuarios/$1');
		$reportes->get('reimcomprob','Reportes::reimcomprob');
		$reportes->get('reimcomprob/llenarTablaRecibosPago','Reportes::llenarTablaRecibosPago');
		$reportes->get('reimcomprob/imprimirComprobantePago/(:any)','Reportes::imprimirComprobantePago/$1');
		$reportes->get('reimcontrato','Reportes::reimcontrato');
		$reportes->get('reimcontrato/autoCompletarUsuario/(:any)','Reportes::autoCompletarUsuario/$1');
		$reportes->get('reimcontrato/buscarGeneralesUsuario/(:any)','Reportes::buscarGeneralesUsuario/$1');
		$reportes->get('reimcontrato/reimprimirContratoUsuario/(:any)','Reportes::reimprimirContratoUsuario/$1');
		$reportes->get('cmdomicilio','Reportes::cmdomicilio');
		$reportes->get('cmdomicilio/autoCompletarUsuario/(:any)','Reportes::autoCompletarUsuario/$1');
		$reportes->get('cmdomicilio/buscarComprobanteUsuario/(:any)','Reportes::buscarComprobanteUsuario/$1');
		$reportes->get('reimconvenio','Reportes::reimconvenio');
		$reportes->get('reimconvenio/llenatTablaConvenios','Reportes::llenatTablaConvenios');
		$reportes->get('reimbajas','Reportes::reimbajas');
		$reportes->get('reimbajas/autoCompletarContratos/(:any)','Reportes::autoCompletarContratos/$1');
		$reportes->get('reimcontrato/autoCompletarContratos/(:any)','Reportes::autoCompletarContratos/$1');
		$reportes->get('cortecaja','Reportes::cortecaja');
		$reportes->get('cortecaja/llenarComboMes','Reportes::llenarComboMes');
		$reportes->get('cortecaja/llenarComboDia','Reportes::llenarComboDia');
		$reportes->get('cortecaja/listadoGeneraMeses/(:any)','Reportes::listadoGeneraMeses/$1');
		$reportes->get('cortecaja/llenarTablaPaginadaFolios/(:any)','Reportes::llenarTablaPaginadaFolios/$1');
		$reportes->get('cortecaja/listadoGeneraDias/(:any)','Reportes::listadoGeneraDias/$1');
		$reportes->get('cortecaja/exportadorListaFolios/(:any)','Reportes::exportadorListaFolios/$1');
		$reportes->get('reportegral','Reportes::reportegral');
		$reportes->get('reportegral/informacionContratosGeneral','Reportes::informacionContratosGeneral');
		$reportes->get('reporteesp','Reportes::reporteesp');
		$reportes->get('reporteesp/informacionReporteEspeciales/(:any)','Reportes::informacionReporteEspeciales/$1');
		$reportes->get('reporteesp/llenarComboMensual','Reportes::llenarComboMensual');

		$reportes->get('listacortes','Reportes::listacortes');
		$reportes->get('listacortes/exportadorListaDeudas','Reportes::exportadorListaDeudas');

	});

	$routes->group('', function($auditorias){
		$auditorias->get('revpagos','Auditorias::revpagos');
		$auditorias->get('revpagos/totalRegistrosPagos','Auditorias::totalRegistrosPagos');
		$auditorias->get('revpagos/mostrandoRegistroPagos/(:any)','Auditorias::mostrandoRegistroPagos/$1');
	});
});


$routes->group('', ['namespace'=>'App\Controllers\Administrador'], function($admins){


	$admins->group('', function($dashboard){
		$dashboard->get('adashboard','Dashboard::adashboard',['filter'=>'autenticar']);

	});

	$admins->group('',function($catalogos){
		$catalogos->get('catconceptos','Catalogos::catconceptos',['filter'=>'autenticar']);
		$catalogos->get('catconceptos/llenarTablaConceptos','Catalogos::llenarTablaConceptos');
		$catalogos->get('catconceptos/autoCompletDescrip/(:any)','Catalogos::autoCompletDescrip/$1');
		$catalogos->post('catconceptos/registrarConceptos','Catalogos::registrarConceptos');
		$catalogos->get('catconceptos/buscarConceptosEditar/(:any)','Catalogos::buscarConceptosEditar/$1');
		$catalogos->post('catconceptos/actualizarRegistroConceptos','Catalogos::actualizarRegistroConceptos');
		$catalogos->get('catconceptos/eliminarRegistroConceptos/(:any)','Catalogos::eliminarRegistroConceptos/$1');

		$catalogos->get('acatalogos/llenarComboCatContrato','Catalogos::llenarComboCatContrato');
		$catalogos->get('acatalogos/llenarComboCatExpedicion','Catalogos::llenarComboCatExpedicion');
		$catalogos->get('acatalogos/llenarComboCatPermisos','Catalogos::llenarComboCatPermisos');
		$catalogos->get('acatalogos/llenarComboCatTarifa','Catalogos::llenarComboCatTarifa');

	});

	$admins->group('', function($cuenta){
		$cuenta->get('alogin','Cuenta::alogin');
		$cuenta->post('alogin/verificandoCredencial','Cuenta::verificandoCredencial');
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
		$tramites->get('aagrcontrato/mostrandoContratoNuevo/(:any)','Tramites::mostrandoContratoNuevo/$1');
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
		$tramites->get('atracontrato/imprimirReciboTransferencia/(:any)','Tramites::imprimirReciboTransferencia/$1');
		$tramites->get('abajcontrato','Tramites::abajcontrato',['filter'=>'autenticar']);
		$tramites->get('abajcontrato/llenarTablaContratoBaja/(:any)','Tramites::llenarTablaContratoBaja/$1');
		$tramites->get('abajcontrato/cargarContratoBaja/(:any)','Tramites::cargarContratoBaja/$1');
		$tramites->post('abajcontrato/actualizarContratoBaja','Tramites::actualizarContratoBaja');
		$tramites->get('abajcontrato/acuseReciboBaja/(:any)','Tramites::acuseReciboBaja/$1');
		$tramites->get('aregconvenio','Tramites::aregconvenio',['filter'=>'autenticar']);
		$tramites->get('aregconvenio/llenarTablaContratoConvenio/(:any)','Tramites::llenarTablaContratoConvenio/$1');
		$tramites->get('aregconvenio/buscarUsuarioDeudor/(:any)','Tramites::buscarUsuarioDeudor/$1');
		$tramites->post('aregconvenio/crearConvenio','Tramites::crearConvenio');

		
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

});

$routes->resource('aregusuarios', ['controllers/Administrador'=>'Tramites']);
$routes->resource('amodusuarios', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aagrcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('amodcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('atracontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('abajcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aregconvenio', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aborcontrato', ['controllers/Administrador'=>'Tramites']);
$routes->resource('aborusuarios', ['controllers/Administrador'=>'Tramites']);

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

		$catalogos->get('catestatus','Catalogos::catestatus',['filter'=>'roladmin']);
		$catalogos->get('catestatus/llenarTablaEstatus','Catalogos::llenarTablaEstatus');
		$catalogos->post('catestatus/guardarEstatus','Catalogos::guardarEstatus');
		$catalogos->get('catestatus/buscarEditarEstatus/(:any)','Catalogos::buscarEditarEstatus/$1');
		$catalogos->post('catestatus/actualizarEstatus','Catalogos::actualizarEstatus');
		$catalogos->get('catestatus/eliminarEstatus/(:any)','Catalogos::eliminarEstatus/$1');

		$catalogos->get('catalogos/llenarComboAreas','Catalogos::llenarComboAreas');
		$catalogos->get('catalogos/llenarComboPuestos/(:any)','Catalogos::llenarComboPuestos/$1');
		$catalogos->get('catalogos/armarMenuAsignaPerfiles','Catalogos::armarMenuAsignaPerfiles');
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

$routes->resource('menunivela', ['controller/Sistema'=>'Menuopcion']);
$routes->resource('menunivelb', ['controller/Sistema'=>'Menuopcion']);
$routes->resource('menunivelc', ['controller/Sistema'=>'Menuopcion']);
$routes->resource('menuniveld', ['controller/Sistema'=>'Menuopcion']);
$routes->resource('asignastaff', ['controller/Sistema'=>'Privilegios']);


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
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
