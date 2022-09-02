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
		$dashboard->get('/dashboard','Dashboard::index',['filter'=>'autenticar','filter'=>'roladmin']);
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
		$comite->get('convasamble/usuariosFaltantes','Comite::usuariosFaltantes');
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
		$cobros->get('crearcargo/mostrarResumenCargos','Cobros::mostrarResumenCargos');
		$cobros->get('crearrecarg','Cobros::crearrecarg');
		$cobros->get('crearrecarg/buscarIdUsuariosAdeudo','Cobros::buscarIdUsuariosAdeudo');
		$cobros->get('crearrecarg/verificarMovimientos/(:any)','Cobros::verificarMovimientos/$1');
		$cobros->get('crearrecarg/mostrarResumenRecargos','Cobros::mostrarResumenRecargos');

	});

	$routes->group('', function($reportes){
		$reportes->get('listausuario','Reportes::listausuario');
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
		$reportes->get('reporteesp/informacionReporteEspeciales','Reportes::informacionReporteEspeciales');

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
	$admins->group('',function($dashboard){
		$dashboard->get('adashboard','Dashboard::adashboard',['filter'=>'autenticar']);

	});

});

$routes->group('', ['namespace'=>'App\Controllers\Sistema'], function($sistema){
	$sistema->group('', function($menus){
		$menus->get('menunivela','Menuopcion::menuniva');
		$menus->get('menunivelb','Menuopcion::menunivb');
		$menus->get('menunivelc','Menuopcion::menunivc');
		$menus->get('menuniveld','Menuopcion::menunivd');
		$menus->get('menuopcion/buscarIconos','Menuopcion::buscarIconos');
		$menus->get('menuopcion/buscarIconos/(:any)','Menuopcion::buscarIconos/$1');
		$menus->get('menuopcion/llenarTablaMenuA','Menuopcion::llenarTablaMenuA');
		$menus->post('menuopcion/datosGuardarMenuA','Menuopcion::datosGuardarMenuA');
		$menus->get('menuopcion/buscarEditarMenuA/(:alphanum)','Menuopcion::buscarEditarMenuA/$1');
		$menus->get('menuopcion/datosEliminarMenuA/(:alphanum)','Menuopcion::datosEliminarMenuA/$1');
		$menus->post('menuopcion/datosActualizarMenuA','Menuopcion::datosActualizarMenuA');
		$menus->get('menuopcion/llenarTablaMenuB','Menuopcion::llenarTablaMenuB');
		$menus->post('menuopcion/datosGuardarMenuB','Menuopcion::datosGuardarMenuB');
		$menus->get('menuopcion/buscarEditarMenuB/(:alphanum)_(:alphanum)','Menuopcion::buscarEditarMenuB/$1_$2');
		$menus->get('menuopcion/datosEliminarMenuB/(:alphanum)_(:alphanum)','Menuopcion::datosEliminarMenuB/$1_$2');
		$menus->post('menuopcion/datosActualizarMenuB','Menuopcion::datosActualizarMenuB');
		$menus->get('menuopcion/llenarTablaMenuC','Menuopcion::llenarTablaMenuC');
		$menus->post('menuopcion/datosGuardarMenuC','Menuopcion::datosGuardarMenuC');
		$menus->get('menuopcion/buscarEditarMenuC/(:alphanum)_(:alphanum)','Menuopcion::buscarEditarMenuC/$1_$2');
		$menus->get('menuopcion/datosEliminarMenuC/(:alphanum)_(:alphanum)','Menuopcion::datosEliminarMenuC/$1_$2');
		$menus->post('menuopcion/datosActualizarMenuC','Menuopcion::datosActualizarMenuC');
		$menus->get('menuopcion/llenarTablaMenuD','Menuopcion::llenarTablaMenuD');
		$menus->post('menuopcion/datosGuardarMenuD','Menuopcion::datosGuardarMenuD');
		$menus->get('menuopcion/buscarEditarMenuD/(:alphanum)_(:alphanum)','Menuopcion::buscarEditarMenuD/$1_$2');
		$menus->get('menuopcion/datosEliminarMenuD/(:alphanum)_(:alphanum)','Menuopcion::datosEliminarMenuD/$1_$2');
		$menus->post('menuopcion/datosActualizarMenuD','Menuopcion::datosActualizarMenuD');

		$menus->get('menuarmado/armarMenuSistema/(:any)','Menuarmado::armarMenuSistema/$1');
		$menus->get('menuarmado/armarMenuSistemaRoles','Menuarmado::armarMenuSistemaRoles');

		$menus->get('menuopcion/llenarComboMenuA','Menuopcion::llenarComboMenuA');
		$menus->get('menuopcion/llenarComboMenuB/(:alphanum)','Menuopcion::llenarComboMenuB/$1');
		$menus->get('menuopcion/llenarComboMenuC/(:alphanum)','Menuopcion::llenarComboMenuC/$1');
		$menus->get('menuopcion/llenarComboAMenuC','Menuopcion::llenarComboAMenuC');
		$menus->get('menuopcion/llenarComboBMenuD/(:any)','Menuopcion::llenarComboBMenuD/$1');

	});

	$sistema->group('', function($catalogos){
		$catalogos->get('areas','Catalogos::catareas');
		$catalogos->get('areas/llenarTablaAreas','Catalogos::llenarTablaAreas');
		$catalogos->post('areas/datosGuardarAreas','Catalogos::datosGuardarAreas');
		$catalogos->get('areas/buscaEditarAreas/(:any)','Catalogos::buscaEditarAreas/$1');
		$catalogos->post('areas/datosActualizarAreas','Catalogos::datosActualizarAreas');
		$catalogos->get('areas/datosEliminarAreas/(:any)','Catalogos::datosEliminarAreas/$1');

		$catalogos->get('puestos','Catalogos::catpuestos');
		$catalogos->get('puestos/llenarTablaPuestos','Catalogos::llenarTablaPuestos');
		$catalogos->post('puestos/datosGuardarPuestos','Catalogos::datosGuardarPuestos');
		$catalogos->get('puestos/buscarEditarPuestos/(:any)','Catalogos::buscarEditarPuestos/$1');
		$catalogos->post('puestos/datosActualizarPuestos','Catalogos::datosActualizarPuestos');
		$catalogos->get('puestos/datosEliminarPuestos/(:any)','Catalogos::datosEliminarPuestos/$1');

		$catalogos->get('perfiles','Catalogos::catperfiles');
		$catalogos->get('perfiles/llenarTablaPerfiles','Catalogos::llenarTablaPerfiles');
		$catalogos->get('perfiles/armarMenuAsignaPerfiles','Catalogos::armarMenuAsignaPerfiles');
		$catalogos->post('perfiles/datosGuardarPerfiles','Catalogos::datosGuardarPerfiles');
		$catalogos->get('perfiles/buscarEditarPerfiles/(:any)','Catalogos::buscarEditarPerfiles/$1');
		$catalogos->post('perfiles/datosActualizarPerfiles','Catalogos::datosActualizarPerfiles');

		$catalogos->get('catalogos/llenarComboAreas','Catalogos::llenarComboAreas');
		$catalogos->get('catalogos/llenarComboPuestos/(:any)','Catalogos::llenarComboPuestos/$1');
		$catalogos->get('catalogos/armarMenuAsignaPerfiles','Catalogos::armarMenuAsignaPerfiles');
		$catalogos->get('catalogos/llenarComboCatEstados','Catalogos::llenarComboCatEstados');
		$catalogos->get('catalogos/llenarComboCatMunicipios/(:any)','Catalogos::llenarComboCatMunicipios/$1');
		$catalogos->get('catalogos/llenarComboCatCodPostales/(:any)','Catalogos::llenarComboCatCodPostales/$1');
		$catalogos->get('catalogos/llenarComboCatColonias/(:any)','Catalogos::llenarComboCatColonias/$1');
		$catalogos->get('catalogos/llenarCompletarCalles/(:any)','Catalogos::llenarCompletarCalles/$1');


		$catalogos->get('catestatus','Catalogos::catestatus');
		$catalogos->get('catestatus/llenarTablaEstatus','Catalogos::llenarTablaEstatus');
		$catalogos->post('catestatus/GuardarEstatus','Catalogos::GuardarEstatus');
		$catalogos->get('catestatus/buscarEditarEstatus/(:any)','Catalogos::buscarEditarEstatus/$1');
		$catalogos->post('catestatus/actualizarEstatus','Catalogos::actualizarEstatus');
		$catalogos->get('catestatus/eliminarEstatus/(:any)','Catalogos::eliminarEstatus/$1');


	});

	$sistema->group('', function($privilegios){
		$privilegios->get('asignausuario','Privilegios::asigusuario');
		$privilegios->get('asignausuario/llenarTablaPerfilUsuario','Privilegios::llenarTablaPerfilUsuario');
		$privilegios->get('asignausuario/llenarComboPerfilesDatos','Privilegios::llenarComboPerfilesDatos');
		$privilegios->get('asignausuario/llenarComboUsuariosDatos','Privilegios::llenarComboUsuariosDatos');
		$privilegios->get('asignausuario/llenarMenuPerfil/(:any)','Privilegios::llenarMenuPerfil/$1');
		$privilegios->post('asignausuario/datosGuardarAsignacion','Privilegios::datosGuardarAsignacion');
		$privilegios->get('asignausuario/buscarEditarAsignacion/(:any)','Privilegios::buscarEditarAsignacion/$1');
		$privilegios->post('asignausuario/datosActualizarAsignacion','Privilegios::datosActualizarAsignacion');
		$privilegios->get('asignausuario/datosEliminarAsignacion/(:any)','Privilegios::datosEliminarAsignacion/$1');


	});

	$sistema->group('', function($mailers){
		$mailers->get('mailmuestra','Mailers::mailmuestra');


	});




});

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
