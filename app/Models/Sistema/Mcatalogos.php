<?php

namespace App\Models\Sistema;
use CodeIgniter\Model;

/**
 *
 */
class Mcatalogos extends Model
{
    protected $dbBuild;

    function __construct()
    {
        $this->dbBuild = \Config\Database::connect();
    }

    public function llamandoDatosParametrosWeb($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_controlweb');
            $builder->select('`TITULO_CONW`,`TITULOPANT_CONW`,`ROBOTS_CONW`,`KEYWORD_CONW`,`DESCRIPCION_CONW`,`REFERENCIA_CONW`');
            $builder->where('CLAVE_CONW',$id);
            $builder->where('ESTATUS_CONW','ACTI');
            $resultado=$builder->get();
            
            $buildera=$this->dbBuild->table('sys_registro_plataforma');
            $buildera->select("NOMSEO_RPLA,NOMBRE_RPLA");
            $buildera->where('ESTATUS_RPLA','ACTI');
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                $paginaSEO=$resultado0->getResultArray();
            }else{
                $paginaSEO=[['NOMSEO_RPLA'=>'SISINAD','NOMBRE_RPLA'=>'Sistema Integral de Administración']];
            }
            return [
                $resultado->getResultArray(),
                $paginaSEO,
            ];
        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosTablaAreas()
    {
        try {
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->select('`CLAVE_AREA` AS `idTablePk`, `CLAVE_AREA`,`DESCRIPCION_AREA`,`FMODIF_AREA`,COALESCE(COUNT(DISTINCT(`CLAVE_PUESTO`))) AS `TOTAL`');
            $builder->join('cat_staff_puestos','CLAVEAREA_PUESTO=CLAVE_AREA','left');
            $builder->where('ESTATUS_AREA','ACTI');
            $builder->orderBy('FMODIF_AREA','DESC');
            $builder->groupBy('CLAVE_AREA');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AREAS|Async/Q] Generando datos por consulta para renderizado de tabla areas.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[AREAS|Async/Q] No hay datos en consulta para renderizado de tabla areas.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");            
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDuplicadosAreas($datosParaGuardar)
    {
        try {
            log_message('info','[AREAS|Async/Q] Buscando duplicidad en la tabla con parametros solicitados.');
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->select('CLAVE_AREA, DESCRIPCION_AREA, FMODIF_AREA');
            $builder->where('CLAVE_AREA',$datosParaGuardar[1]);
            $builder->where('ESTATUS_AREA','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AREAS|Async/Q] Se encontratos valores duplicados en la tabla retornando valores.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function guardarDatosAreas($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaBuscar[0],
                'item'=>$datosParaBuscar[1],
            ];
            $setGuardar=[
                'FECHCAPT_AREA'=>date('Y-m-d'),
                'HORACAPT_AREA'=>date('H:i:s'),
                'CAPTURA_AREA'=>$datosParaGuardar[0],
                'CLAVE_AREA'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'DESCRIPCION_AREA'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'COMENTARIO_AREA'=>$datosParaGuardar[3],
                'IDMODIF_AREA'=>$datosParaGuardar[0],
                'FMODIF_AREA'=>date('Y-m-d-'),
                'ESTATUS_AREA'=>'ACTI',
            ];
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->insert($setGuardar);
            log_message('info','[AREAS|Async/Q] {user} Creo un nuevo registro {item} en catalogo de áreas .');
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDatosAreas($datosParaBuscar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaBuscar[0],
            ];
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->select('CLAVE_AREA, DESCRIPCION_AREA, COMENTARIO_AREA');
            $builder->where('CLAVE_AREA',$datosParaBuscar[1]);
            $builder->where('ESTATUS_AREA','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AREAS|Async/Q] Generando datos por consulta para renderizado de datos a modificar areas.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[AREAS|Async/Q] No hay datos en consulta para renderizado de tabla areas.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");            
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function actualizarDatosAreas($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
            ];
            $setActualiza=[
                'DESCRIPCION_AREA'=>$datosParaActualizar[2],
                'COMENTARIO_AREA'=>$datosParaActualizar[3],
                'IDMODIF_AREA'=>$datosParaActualizar[0],
                'FMODIF_AREA'=>date('Y-m-d'),
            ];
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->where('CLAVE_AREA',$datosParaActualizar[1]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[AREAS|Async/Q] {user} Actualizo un registro {item} en catalogo de áreas .', $log_extra);
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function eliminarDatosAreas($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->where('CLAVE_AREA',$datosParaEliminar[1]);
            $builder->delete();
            log_message('notice','[AREAS|Async/Q] {user} eliminó el codigo {item} de la base de datos.',$log_extra);
            $buildera=$this->dbBuild->query('ALTER TABLE `cat_staff_area` AUTO_INCREMENT = 1;');
            log_message('notice','[AREAS|Async/Q] Reindexando tabla tras eliminación.');
    
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosTablaPuestos()
    {
        try {
            log_message('info','[PUESTOS|Async] Solicitando retorno de datos para listado.');
            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->select("CONCAT(CLAVEAREA_PUESTO,'_',CLAVE_PUESTO) AS `idTablePk`,CLAVEAREA_PUESTO,CLAVE_PUESTO,DESCRIPHOM_PUESTO,
            RANGO_PUESTO,FMODIF_PUESTO,COALESCE(COUNT(DISTINCT(`CLAVE_PERF`))) AS `TOTAL`");
            $builder->join('cat_staff_perfiles','CLAVE_PERF=CLAVE_PUESTO','left');
            $builder->where('ESTATUS_PUESTO','ACTI');
            $builder->orderBy('FMODIF_PUESTO','DESC');
            $builder->groupBy('CLAVE_PUESTO');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[PUESTOS|Async/Q] Generando datos para renderizado de tabla puestos.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[PUESTOS|Async/Q] No hay datos en consulta para renderizado de tabla puestos.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDuplicadosPuestos($datosParaGuardar)
    {
        try {
            log_message('info','[PUESTOS|Async/Q] Buscando duplicidad en la tabla con parametros solicitados.');
            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->select('CLAVEAREA_PUESTO, CLAVE_PUESTO, DESCRIPHOM_PUESTO FMODIF_AREA');
            $builder->where('CLAVEAREA_PUESTO',$datosParaGuardar[1]);
            $builder->where('CLAVE_PUESTO',$datosParaGuardar[2]);
            $builder->where('ESTATUS_PUESTO','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[PUESTOS|Async/Q] Se encontratos valores duplicados en la tabla retornando valores.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function guardarDatosPuestos($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaBuscar[0],
                'item'=>$datosParaBuscar[2],
            ];
            $setGuardar=[
                'FECHCAPT_PUESTO'=>date('Y-m-d'),
                'HORACAPT_PUESTO'=>date('H:i:s'),
                'CAPTURA_PUESTO'=>$datosParaGuardar[0],
                'CLAVEAREA_PUESTO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'CLAVE_PUESTO'=>ucwords(mb_strtoupper($datosParaGuardar[2])),
                'DESCRIPHOM_PUESTO'=>ucwords(mb_strtolower($datosParaGuardar[3])),
                'DESCRIPMUJ_PUESTO'=>ucwords(mb_strtolower($datosParaGuardar[4])),
                'RANGO_PUESTO'=>str_pad($datosParaGuardar[5],3,'0',STR_PAD_LEFT),
                'COMENTARIO_PUESTO'=>$datosParaGuardar[6],
                'IDMODIF_PUESTO'=>$datosParaGuardar[0],
                'FMODIF_PUESTO'=>date('Y-m-d-'),
                'ESTATUS_PUESTO'=>'ACTI',
            ];
            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->insert($setGuardar);
            log_message('notice','[PUESTOS|Async/Q] {user} creo un nuevo registro {item} en estructura puestos.');
    
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDatosPuestos($id)
    {
        try {
            $parametros= explode('_',$id);
            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->select('CLAVEAREA_PUESTO,CLAVE_PUESTO,DESCRIPHOM_PUESTO,DESCRIPMUJ_PUESTO,RANGO_PUESTO,COMENTARIO_PUESTO');
            $builder->where('CLAVEAREA_PUESTO',$parametros[0]);
            $builder->where('CLAVE_PUESTO',$parametros[1]);
            $builder->where('ESTATUS_PUESTO','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[PUESTOS|Async/Q] Generando datos por consulta para renderizado de datos a modificar puestos.');
                return $resultado->getResultArray();

            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function actualizarDatosPuestos($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
            ];
            $setActualiza=[
                'DESCRIPHOM_PUESTO'=>$datosParaActualizar[3],
                'DESCRIPMUJ_PUESTO'=>$datosParaActualizar[4],
                'RANGO_PUESTO'=>$datosParaActualizar[5],
                'COMENTARIO_PUESTO'=>$datosParaActualizar[6],
                'IDMODIF_PUESTO'=>$datosParaActualizar[0],
                'FMODIF_PUESTO'=>date('Y-m-d'),
            ];
            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->where('CLAVEAREA_PUESTO',$datosParaActualizar[1]);
            $builder->where('CLAVE_PUESTO',$datosParaActualizar[2]);
            $builder->where('ESTATUS_PUESTO','ACTI');
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[PUESTOS|Async/Q] {user} actualizo un registro {item} en la estructura puestos.', $log_extra);
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function eliminarDatosPuestos($datosParaEliminar)
    {
        try {

            $parametros= explode('_',$datosParaEliminar[1]);
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$parametros[1],
            ];
            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->where('CLAVEAREA_PUESTO',$parametros[0]);
            $builder->where('CLAVE_PUESTO',$parametros[1]);
            $builder->delete();
            log_message('notice','[PUESTOS|Async/Q] Usuario {user} eliminó el codigo {item} de la base de datos.',$log_extra);
            $buildera=$this->dbBuild->query('ALTER TABLE `cat_staff_puestos` AUTO_INCREMENT = 1;');
            log_message('notice','[PUESTOS|Async/Q] Reindexando tabla tras eliminación.');
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosTablaPerfiles()
    {
        try {
            log_message('info','[PERFILES|Async/Q] Solicitando retorno de datos para listado perfiles.');
            $builder=$this->dbBuild->table('cat_staff_perfiles');
            $builder->select("CLAVE_PERF AS `idTablePk`, CLAVE_PERF,PERFIL_PERF,FMODIF_PERF,
            COALESCE(COUNT(DISTINCT(`IDUSUA_PERFUS`))) AS `TOTAL`,COALESCE(COUNT(DISTINCT(`IDUSUA_CLPER`))) AS `TOTALB`");
            $builder->join('sys_perfilusuario','PERFIL_PERFUS=CLAVE_PERF','left');
            $builder->join('sys_clientes_perfiles','PERFIL_CLPER=CLAVE_PERF','left');
            $builder->where('ESTATUS_PERF','ACTI');
            $builder->orderBy('FMODIF_PERF','DESC');
            $builder->groupBy('CLAVE_PERF');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[PERFILES|Async/Q] Generando datos desde consulta para renderizado de listado perfiles.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[PERFILES|Async/Q] No hay datos en consulta para renderizado de tabla perfiles.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDuplicadosPerfiles($datosParaGuardar)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_staff_perfiles');
            $builder->select('CLAVE_PERF, FMODIF_PERF');
            $builder->where('CLAVE_PERF',$datosParaGuardar[2]);
            $builder->where('ESTATUS_PERF','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[PERFILES|Async/Q] Se encontraron valores duplicados notificando.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function guardarDatosPerfiles($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[2],
            ];
            log_message('info','[PERFILES|Async] Iniciando grabado en la estructura de perfiles.');
            $menuRoles=implode(', ',$datosParaGuardar[4]);
            $setGuardar=[
                'FECHCAPT_PERF'=>date('Y-m-d'),
                'HORACAPT_PERF'=>date('H:i:s'),
                'CAPTURA_PERF'=>$datosParaGuardar[0],
                'CLAVE_PERF'=>$datosParaGuardar[2],
                'PERFIL_PERF'=>$menuRoles,
                'COMENTS_PERF'=>$datosParaGuardar[3],
                'IDMODIF_PERF'=>$datosParaGuardar[0],
                'FMODIF_PERF'=>date('Y-m-d'),
                'ESTATUS_PERF'=>'ACTI'
            ];
            $builder=$this->dbBuild->table('cat_staff_perfiles');
            $builder->insert($setGuardar);
            log_message('notice','[PERFILES|Async/Q] {user} creo un nuevo registro {item} en estructura perfiles.',$log_extra);
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDatosPerfiles($datosParaBuscar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaBuscar[0],
                'item'=>$datosParaBuscar[1],
            ];
            log_message('info','[PERFILES|Async] {user} solicito busqueda para modificar estructura perfiles.', $log_extra);
            $db= \Config\Database::connect();
            $builder=$db->table('cat_staff_perfiles');
            $builder->select('CLAVE_PERF, PERFIL_PERF, COMENTS_PERF');
            $builder->where('CLAVE_PERF',$datosParaBuscar[1]);
            $builder->where('ESTATUS_PERF','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[PERFILES|Async/Q] Generando datos por consulta para renderizado de datos a modificar perfiles.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[PERFILES|Async/Q] No hay datos en consulta para renderizado de tabla perfiles.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function actualizarDatosPerfiles($datosParaActualizar)
    {
        try {
            $menuRoles=implode(', ',$datosParaActualizar[3]);
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
            ];
            $setActualiza=[
            'COMENTS_PERF'=>$datosParaActualizar[2],
            'PERFIL_PERF'=>$menuRoles,
            'IDMODIF_PERF'=>$datosParaActualizar[0],
            'FMODIF_PERF'=>date('Y-m-d'),
            ];
            $builder=$this->dbBuild->table('cat_staff_perfiles');
            $builder->where('CLAVE_PERF',$datosParaActualizar[1]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[PERFILES|Async/Q] {user} actualizo un registro {item} en estructura perfiles .', $log_extra);
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function eliminarDatosPerfiles($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $builder=$this->dbBuild->table('cat_staff_perfiles');
            $builder->where('CLAVE_PERF',$datosParaEliminar[1]);
            $builder->where('ESTATUS_PERF','ACTI');
            $builder->delete();
            log_message('notice','[PUESTOS|Async/Q] Usuario {user} eliminó el perfil {item} de la base de datos.',$log_extra);
            $buildera=$this->dbBuild->query('ALTER TABLE `cat_staff_perfiles` AUTO_INCREMENT = 1;');
            log_message('notice','[PUESTOS|Async/Q] Reindexando tabla tras eliminación.');
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function armarDatosMenuAsignaPerfiles()
    {
        try {
            log_message('info','[PERFILES|Async] Solicitando retorno de datos para armado de menu de usuario.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, CLASS_MENA, TITLE_MENA, DESCRIP_MENA, REFEREN_MENA, CONTOPC_MENA, ORDEN_MENA');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->orderBy('ORDEN_MENA');
            $resultado0=$builder->get();
            log_message('info','[PERFILES|Async/Q] Generando datos desde consulta para renderizado opciones de menu nivel A.');

            $dba= \Config\Database::connect();
            $buildera=$dba->table('sys_menunivb');
            $buildera->select("IDMENU_MENB, IDSMENU_MENB, CLASS_MENB, REFEREN_MENB, TITLE_MENB, DESCRIP_MENB, ORDEN_MENB, CONTOPC_MENB");
            $buildera->where('ESTATUS_MENB','ACTI');
            $buildera->orderBy('ORDEN_MENB','ASC');
            $resultado1=$buildera->get();
            log_message('info','[PERFILES|Async/Q] Generando datos desde consulta para renderizado opciones de menu nivel B.');

            $dbb= \Config\Database::connect();
            $builderb=$dbb->table('sys_menunivc');
            $builderb->select("IDSMENU_MENC, IDSBMENU_MENC, CLASS_MENC, REFEREN_MENC, TITLE_MENC, DESCRIP_MENC, ORDEN_MENC, CONTOPC_MENC");
            $builderb->join('sys_menunivd','IDSBMENU_MEND=IDSBMENU_MENC','left');
            $builderb->where('ESTATUS_MENC','ACTI');
            $builderb->orderBy('ORDEN_MENC','ASC');
            $builderb->groupBy('IDSBMENU_MENC');
            $resultado2=$builderb->get();
            log_message('info','[PERFILES|Async/Q] Generando datos desde consulta para renderizado opciones de menu nivel C.');

            $dbc= \Config\Database::connect();
            $builderc=$dbc->table('sys_menunivd');
            $builderc->select("IDSBMENU_MEND, IDSBMENUO_MEND, CLASS_MEND, REFEREN_MEND, TITLE_MEND, DESCRIP_MEND, ORDEN_MEND, CONTOPC_MEND");
            $builderc->where('ESTATUS_MEND','ACTI');
            $builderc->orderBy('ORDEN_MEND','ASC');
            $builderc->groupBy('IDSBMENUO_MEND');
            $resultado3=$builderc->get();
            log_message('info','[PERFILES|Async/Q] Generando datos desde consulta para renderizado opciones de menu nivel D.');

            return array(
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
                $resultado2->getResultArray(),
                $resultado3->getResultArray(),
            );

        } catch (\Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaEstatus()
    {
        try {
            log_message('info','[ESTATUS|Async] Solicitando datos para listado estatus.');
            $builder=$this->dbBuild->table('cat_estatus');
            $builder->select("`CLAVE_ESTAT` AS `idTablePk`,`CLAVE_ESTAT`,`DESCRIPCION_ESTAT`,RANGO_ESTAT,`FMODIF_ESTAT`");
            $builder->where('ESTATUS_ESTAT','ACTI');
            $builder->orderBy('FMODIF_ESTAT','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ESTATUS|Async/Q] Generando datos por consulta para renderizado de tabla estatus.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[PERFILES|Async/Q] No hay datos en consulta para renderizado de tabla estatus.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDuplicadosEstatus($datosParaGuardar)
    {
        try {
            $builder=$this->dbBuild->table('cat_estatus');
            $builder->select('CLAVE_ESTAT, DESCRIPCION_ESTAT, FMODIF_ESTAT');
            $builder->where('CLAVE_ESTAT',$datosParaGuardar[1]);
            $builder->where('ESTATUS_ESTAT','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ESTATUS|Async/Q] Se encontraron datos por duplicidad notificando.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function guardarDatosEstatus($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            log_message('info','[ESTATUS|Async] Iniciando grabado de datos en estructura estatus.');
            $setGuardar=[
                'FECHACAP_ESTAT'=>date('Y-m-d'),
                'HORACAP_ESTAT'=>date('H:i:s'),
                'CAPTURA_ESTAT'=>$datosParaGuardar[0],
                'CLAVE_ESTAT'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'DESCRIPCION_ESTAT'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'RANGO_ESTAT'=>str_pad($datosParaGuardar[3], 3, '0', STR_PAD_LEFT),
                'COMENTARIOS_ESTAT'=>$datosParaGuardar[4],
                'IDMODIF_ESTAT'=>$datosParaGuardar[0],
                'FMODIF_ESTAT'=>date('Y-m-d-'),
                'ESTATUS_ESTAT'=>'ACTI',
            ];
            $builder=$this->dbBuild->table('cat_estatus');
            $builder->insert($setGuardar);
            log_message('info','[ESTATUS|Async/Q] {user} creo un nuevo registro {item} en catalogo de estatus.', $log_extra);
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDatosEditarEstatus($datosParaBuscar)
    {
        try {
            $builder=$this->dbBuild->table('cat_estatus');
            $builder->select('CLAVE_ESTAT,DESCRIPCION_ESTAT,RANGO_ESTAT,COMENTARIOS_ESTAT');
            $builder->where('CLAVE_ESTAT',$datosParaBuscar[1]);
            $builder->where('ESTATUS_ESTAT','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ESTATUS|Async/Q] Generando datos por consulta para renderizado de datos a modificar estatus.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function actualizarDatosEstatus($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
            ];
            $setActualiza=[
                'DESCRIPCION_ESTAT'=>ucwords(mb_strtolower($datosParaActualizar[2])),
                'RANGO_ESTAT'=>str_pad($datosParaActualizar[3], 3, '0', STR_PAD_LEFT),
                'COMENTARIOS_ESTAT'=>$datosParaActualizar[4],
                'IDMODIF_ESTAT'=>$datosParaActualizar[0],
                'FMODIF_ESTAT'=>date('Y-m-d-'),
            ];
            $builder=$this->dbBuild->table('cat_estatus');
            $builder->where('CLAVE_ESTAT',$datosParaActualizar[1]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[ESTATUS|Async/Q] {user} Actualizo un registro {item} en catalogo de estatus .', $log_extra);
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function eliminarDatosEstatus($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $builder=$this->dbBuild->table('cat_estatus');
            $builder->where('CLAVE_ESTAT',$datosParaEliminar[1]);
            $builder->delete();
            log_message('notice','[ESTATUS|Async/Q] {user} eliminó el codigo {item} de la base de datos.',$log_extra);
            $buildera=$this->dbBuild->query('ALTER TABLE `cat_estatus` AUTO_INCREMENT = 1;');
            log_message('notice','[ESTATUS|Async/Q] Reindexando tabla tras eliminación.');
    
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosTablaProvedor()
    {
        try {
            $builder=$this->dbBuild->table('cat_proveedor');
            $builder->select("IDPROV_PROV AS idTablePk,CLAVE_PROV,NOMBRE_PROV,RFC_PROV,FMODIF_PROV");
            $builder->where('ESTATUS_PROV','ACTI');
            $builder->orderBy('FMODIF_PROV','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATPROVEEDOR|Async/Q] Generando datos desde consulta para renderizar tabla proveddor');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATPROVEEDOR|Async/Q] No hay datos en consulta para renderizado de tabla proveedor.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDuplicadosProveedor($datosParaGuardar)
    {
        try {
            $builder=$this->dbBuild->table('cat_proveedor');
            $builder->select('CLAVE_PROV, NOMBRE_PROV, FMODIF_PROV');
            $builder->where('CLAVE_PROV',$datosParaGuardar[1]);
            $builder->where('ESTATUS_PROV','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATPROVEEDOR|Async/Q] Se encontraron datos por duplicidad notificando.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function guardarDatosProveedor($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            $builder=$this->dbBuild->table('cat_proveedor');
            $builder->selectMax('(SERIE_PROV)+1','SERIE_PROV');
            $builder->where('ESTATUS_PROV','ACTI');
            $resultado=$builder->get();
            foreach($resultado->getResultArray() as $filas){
                $secuenProv=$filas['ID_RESPO'];
            }
            if($secuenProv==''){
                $secuenProv=1;
            }
            log_message('info','[REGCOMITE|Async/Q] Obteniendo secuencia para asignar a {item}',$log_extra);

            $idProveedor=date('YmdHis');
            log_message('info','[CATPROVEEDOR|Async] Iniciando grabado de datos en estructura proveedores.');
            $setProvedor=[
                'FECHACAP_PROV'=>date('Y-m-d'),
                'HORACAP_PROV'=>date('H:i:s'),
                'CAPTURA_PROV'=>$datosParaGuardar[0],
                'IDPROV_PROV'=>sha1($idProveedor),
                'TIPOFIS_PROV'=>$datosParaGuardar[2],
                'CLAVE_PROV'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'SERIE_PROV'=>str_pad($secuenProv,6,'0',STR_PAD_LEFT),
                'NOMBRE_PROV'=>$datosParaGuardar[3],
                'RAZON_PROV'=>$datosParaGuardar[4],
                'BENEF_PROV'=>$datosParaGuardar[5],
                'RFC_PROV'=>ucwords(mb_strtoupper($datosParaGuardar[6])),
                'FOLIOCED_PROV'=>$datosParaGuardar[7],
                'CURP_PROV'=>ucwords(mb_strtoupper($datosParaGuardar[8])),
                'BACKORDEN_PROV'=>$datosParaGuardar[9],
                'PROVTIPO_PROV'=>$datosParaGuardar[10],
                'COMENTARIOS_PROV'=>$datosParaGuardar[12],
                'IDMODIF_PROV'=>$datosParaGuardar[0],
                'FMODIF_PROV'=>date('Y-m-d'),
                'ESTATUS_PROV'=>'ACTI',
            ];
            $buildera=$this->dbBuild->table('cat_proveedor');
            $buildera->insert($setProvedor);
            log_message('info','[CATPROVEEDOR|Async/Q] {user} creo un nuevo registro {item} en catalogo de proveedor.', $log_extra);

            $setProvUbicacion=[
                'FECHACAP_PUBIC'=>date('Y-m-d'),
                'HORACAP_PUBIC'=>date('H:i:s'),
                'CAPTURA_PUBIC'=>$datosParaGuardar[0],
                'IDPROV_PUBIC'=>sha1($idProveedor),
                'PROVUBIC_PUBIC'=>sha1($idProveedor).str_pad($secuenProv,3,'0',STR_PAD_LEFT),
                'SERIE_PUBIC'=>str_pad($secuenProv,3,'0',STR_PAD_LEFT),
                'NOMBRE_PUBIC'=>$datosParaGuardar[13],
                'PAIS_PUBIC'=>'MX',
                'ESTADO_PUBIC'=>$datosParaGuardar[14],
                'MUNIC_PUBIC'=>$datosParaGuardar[15],
                'CODPOS_PUBIC'=>$datosParaGuardar[16],
                'COLONIA_PUBIC'=>$datosParaGuardar[17],
                'CALLE_PUBIC'=>$datosParaGuardar[18],
                'NEXTE_PUBIC'=>$datosParaGuardar[19],
                'NINTE_PUBIC'=>$datosParaGuardar[20],
                'REFERENCIA_PUBIC'=>$datosParaGuardar[21],
                'IDMODIF_PUBIC'=>$datosParaGuardar[0],
                'FMODIF_PUBIC'=>date('Y-m-d'),
                'ESTATUS_PUBIC'=>'ACTI',
            ];
            $builderb=$this->dbBuild->table('cat_proveedor_ubicacion');
            $builderb->insert($setProvUbicacion);
            log_message('info','[CATPROVEEDOR|Async/Q] {user} creo un nuevo registro {item} en catalogo de proveedor ubicacion.', $log_extra);

            $setProvContacto=[
                'FECHACAP_PCONT'=>date('Y-m-d'),
                'HORACAP_PCONT'=>date('H:i:s'),
                'CAPTURA_PCONT'=>$datosParaGuardar[0],
                'IDPROV_PCONT'=>sha1($idProveedor),
                'PROVCONT_PCONT'=>sha1($idProveedor).str_pad($secuenProv,3,'0',STR_PAD_LEFT),
                'SERIE_PCONT'=>str_pad($secuenProv,3,'0',STR_PAD_LEFT),
                'NOMBRE_PCONT'=>$datosParaGuardar[22],
                'TELEFONO_PCONT'=>$datosParaGuardar[23],
                'MOVIL_PCONT'=>$datosParaGuardar[24],
                'EMAIL_PCONT'=>$datosParaGuardar[25],
                'COMENTARIOS_PCONT'=>$datosParaGuardar[26],
                'IDMODIF_PCONT'=>$datosParaGuardar[0],
                'FMODIF_PCONT'=>date('Y-m-d'),
                'ESTATUS_PCONT'=>'ACTI',
            ];
            $builderc=$this->dbBuild->table('cat_proveedor_contacto');
            $builderc->insert($setProvContacto);
            log_message('info','[CATPROVEEDOR|Async/Q] {user} creo un nuevo registro {item} en catalogo de proveedor contacto.', $log_extra);

            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDatosEditarProveedor($datosParaBuscar)
    {
        try {
            $builder=$this->dbBuild->table('cat_proveedor');
            $builder->select("IDPROV_PROV,CLAVE_PROV,TIPOFIS_PROV,NOMBRE_PROV,RAZON_PROV,BENEF_PROV,RFC_PROV,FOLIOCED_PROV,CURP_PROV,
            BACKORDEN_PROV,PROVTIPO_PROV,COMENTARIOS_PROV,PROVUBIC_PUBIC,NOMBRE_PUBIC,ESTADO_PUBIC,MUNIC_PUBIC,CODPOS_PUBIC,
            COLONIA_PUBIC,CALLE_PUBIC,NEXTE_PUBIC,NINTE_PUBIC,REFERENCIA_PUBIC,PROVCONT_PCONT,NOMBRE_PCONT,TELEFONO_PCONT,MOVIL_PCONT,
            EMAIL_PCONT,COMENTARIOS_PCONT");
            $builder->join('cat_proveedor_ubicacion','IDPROV_PUBIC=IDPROV_PROV');
            $builder->join('cat_proveedor_contacto','IDPROV_PCONT=IDPROV_PROV');
            $builder->where('IDPROV_PROV',$datosParaBuscar[1]);
            $builder->where('ESTATUS_PROV','ACTI');
            $builder->groupBy('IDPROV_PROV');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATPROVEEDOR|Async/Q] Generando datos por consulta para renderizado de datos a modificar estatus.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATPROVEEDOR|Async/Q] No hay datos en consulta para renderizado de tabla proveedor.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function actualizarDatosProveedor($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            log_message('info','[CATPROVEEDOR|Async] Iniciando grabado de datos en estructura proveedores.');
            $setProvedor=[
                'FECHACAP_PROV'=>date('Y-m-d'),
                'HORACAP_PROV'=>date('H:i:s'),
                'CAPTURA_PROV'=>$datosParaGuardar[0],
                'TIPOFIS_PROV'=>$datosParaGuardar[3],
                'NOMBRE_PROV'=>$datosParaGuardar[4],
                'RAZON_PROV'=>$datosParaGuardar[5],
                'BENEF_PROV'=>$datosParaGuardar[6],
                'RFC_PROV'=>ucwords(mb_strtoupper($datosParaGuardar[7])),
                'FOLIOCED_PROV'=>$datosParaGuardar[8],
                'CURP_PROV'=>ucwords(mb_strtoupper($datosParaGuardar[9])),
                'BACKORDEN_PROV'=>$datosParaGuardar[10],
                'PROVTIPO_PROV'=>$datosParaGuardar[11],
                'COMENTARIOS_PROV'=>$datosParaGuardar[13],
                'IDMODIF_PROV'=>$datosParaGuardar[0],
                'FMODIF_PROV'=>date('Y-m-d'),
            ];
            $buildera=$this->dbBuild->table('cat_proveedor');
            $buildera->where('IDPROV_PROV',$datosParaGuardar[1]);
            $buildera->where('CLAVE_PROV',$datosParaGuardar[2]);
            $buildera->set($setProvedor);
            $buildera->update($setProvedor);
            log_message('info','[CATPROVEEDOR|Async/Q] {user} actualizo registro {item} en catalogo de proveedor.', $log_extra);

            $setProvUbicacion=[
                'NOMBRE_PUBIC'=>$datosParaGuardar[15],
                'ESTADO_PUBIC'=>$datosParaGuardar[16],
                'MUNIC_PUBIC'=>$datosParaGuardar[17],
                'CODPOS_PUBIC'=>$datosParaGuardar[18],
                'COLONIA_PUBIC'=>$datosParaGuardar[19],
                'CALLE_PUBIC'=>$datosParaGuardar[20],
                'NEXTE_PUBIC'=>$datosParaGuardar[21],
                'NINTE_PUBIC'=>$datosParaGuardar[22],
                'REFERENCIA_PUBIC'=>$datosParaGuardar[23],
                'IDMODIF_PUBIC'=>$datosParaGuardar[0],
                'FMODIF_PUBIC'=>date('Y-m-d'),
            ];
            $builderb=$this->dbBuild->table('cat_proveedor_ubicacion');
            $builderb->where('IDPROV_PUBIC',$datosParaGuardar[1]);
            $builderb->where('PROVUBIC_PUBIC',$datosParaGuardar[14]);
            $builderb->set($setProvUbicacion);
            $builderb->update($setProvUbicacion);
            log_message('info','[CATPROVEEDOR|Async/Q] {user} actualizo registro {item} en catalogo de proveedor ubicacion.', $log_extra);

            $setProvContacto=[
                'NOMBRE_PCONT'=>$datosParaGuardar[25],
                'TELEFONO_PCONT'=>$datosParaGuardar[26],
                'MOVIL_PCONT'=>$datosParaGuardar[27],
                'EMAIL_PCONT'=>$datosParaGuardar[28],
                'COMENTARIOS_PCONT'=>$datosParaGuardar[29],
                'IDMODIF_PCONT'=>$datosParaGuardar[0],
                'FMODIF_PCONT'=>date('Y-m-d'),
            ];
            $builderc=$this->dbBuild->table('cat_proveedor_contacto');
            $builderc->where('IDPROV_PCONT',$datosParaGuardar[1]);
            $builderc->where('PROVCONT_PCONT',$datosParaGuardar[24]);
            $builderc->set($setProvContacto);
            $builderc->update($setProvContacto);
            log_message('info','[CATPROVEEDOR|Async/Q] {user} actualizo registro {item} en catalogo de proveedor contacto.', $log_extra);

            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function eliminarDatosProveedor($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $buildera=$this->dbBuild->table('cat_proveedor_contacto');
            $buildera->where('IDPROV_PCONT',$datosParaEliminar[1]);
            $buildera->delete();
            log_message('notice','[CATPROVEEDOR|Async/Q] {user} eliminó el codigo {item} de proveedor contacto.',$log_extra);
            $builderb=$this->dbBuild->query('ALTER TABLE `cat_proveedor_contacto` AUTO_INCREMENT = 1;');
            log_message('notice','[CATPROVEEDOR|Async/Q] Reindexando tabla tras eliminación.');

            $buildera=$this->dbBuild->table('cat_proveedor_ubicacion');
            $buildera->where('IDPROV_PUBIC',$datosParaEliminar[1]);
            $buildera->delete();
            log_message('notice','[CATPROVEEDOR|Async/Q] {user} eliminó el codigo {item} de proveedor ubicacion.',$log_extra);
            $builderb=$this->dbBuild->query('ALTER TABLE `cat_proveedor_ubicacion` AUTO_INCREMENT = 1;');
            log_message('notice','[CATPROVEEDOR|Async/Q] Reindexando tabla tras eliminación.');

            $builder=$this->dbBuild->table('cat_proveedor');
            $builder->where('IDPROV_PROV',$datosParaEliminar[1]);
            $builder->delete();
            log_message('notice','[CATPROVEEDOR|Async/Q] {user} eliminó el codigo {item} de proveedor.',$log_extra);
            $buildera=$this->dbBuild->query('ALTER TABLE `cat_proveedor` AUTO_INCREMENT = 1;');
            log_message('notice','[CATPROVEEDOR|Async/Q] Reindexando tabla tras eliminación.');
    
            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosTablaProducto()
    {
        try {
            $builder=$this->dbBuild->table('cat_productos');
            $builder->select("CONCAT(CLAVE_PROD) AS idTablePk,CLAVE_PROD,DESCRIPCION_PROD,FMODIF_PROD");
            $builder->where('ESTATUS_PROD','ACTI');
            $builder->orderBy('FMODIF_PROD','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATPRODUCTOS|Async/Q] Generando datos desde consulta para renderizar tabla productos');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATPRODUCTOS|Async/Q] No hay datos en consulta para renderizado de tabla productos.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDuplicadosProductos($datosParaGuardar)
    {
        try {
            $builder=$this->dbBuild->table('cat_productos');
            $builder->select('CLAVE_PROD, DESCRIPCION_PROD, FMODIF_PROD');
            $builder->where('CLAVE_PROD',$datosParaGuardar[1]);
            $builder->where('ESTATUS_PROD','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATPRODUCTOS|Async/Q] Se encontraron datos por duplicidad notificando.');
                return $resultado->getResultArray();
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function guardarDatosProductos($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];

            $setProductos=[
                'FECHACAP_PROD'=>date('Y-m-d'),
                'HORACAP_PROD'=>date('H:i:s'),
                'CAPTURA_PROD'=>$datosParaGuardar[0],
                'CLAVE_PROD'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'DESCRIPCION_PROD'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'DESCEDIT_PROD'=>$datosParaGuardar[3],
                'TIPOPROD_PROD'=>$datosParaGuardar[4],
                'INVENTAR_PROD'=>$datosParaGuardar[5],
                'CATEGORIA_PROD'=>$datosParaGuardar[6],
                'MARCA_PROD'=>$datosParaGuardar[6],
                'TIPOEMPA_PROD'=>$datosParaGuardar[6],
                'ALTO_PROD'=>$datosParaGuardar[7],
                'ANCHO_PROD'=>$datosParaGuardar[8],
                'LARGO_PROD'=>$datosParaGuardar[9],
                'PESO_PROD'=>$datosParaGuardar[10],
                'COMENTARIOS_PROD'=>$datosParaGuardar[11],
                'IDMODIF_PROD'=>$datosParaGuardar[0],
                'FMODIF_PROD'=>date('Y-m-d'),
                'ESTATUS_PROD'=>'ACTI',
            ];
            $buildera=$this->dbBuild->table('cat_productos');
            $buildera->insert($setProductos);
            log_message('info','[CATPRODUCTOS|Async/Q] {user} creo un nuevo registro {item} en catalogo de productos.', $log_extra);


            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function buscarDatosEditarProductos($datosParaBuscar)
    {
        try {
            $parametros=explode('_',$datosParaBuscar[1]);
            $builder=$this->dbBuild->table('cat_productos');
            $builder->select("`CLAVE_PROD`,`CODBARR_PROD`,`DESCRIPCION_PROD`,`DESCEDIT_PROD`,`TIPOPROD_PROD`,`INVENTAR_PROD`,`CATEGORIA_PROD`,
            `MARCA_PROD`,`TIPOEMPA_PROD`,`ALTO_PROD`,`ANCHO_PROD`,`LARGO_PROD`,`PESO_PROD`,`COMENTARIOS_PROD`");
            $builder->where('CLAVE_PROD',$parametros[0]);
            $builder->where('ESTATUS_PROD','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATPRODUCTOS|Async/Q] Generando datos por consulta para renderizado de datos a modificar productos.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATPRODUCTOS|Async/Q] No hay datos en consulta para renderizado de tabla productos.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function actualizarDatosProductos($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            log_message('info','[CATPRODUCTOS|Async] Iniciando grabado de datos en estructura productos.');
            $setProducto=[
                'DESCRIPCION_PROD'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'DESCEDIT_PROD'=>$datosParaGuardar[3],
                'TIPOPROD_PROD'=>$datosParaGuardar[4],
                'INVENTAR_PROD'=>$datosParaGuardar[5],
                'CATEGORIA_PROD'=>$datosParaGuardar[6],
                'MARCA_PROD'=>$datosParaGuardar[6],
                'TIPOEMPA_PROD'=>$datosParaGuardar[6],
                'ALTO_PROD'=>$datosParaGuardar[7],
                'ANCHO_PROD'=>$datosParaGuardar[8],
                'LARGO_PROD'=>$datosParaGuardar[9],
                'PESO_PROD'=>$datosParaGuardar[10],
                'COMENTARIOS_PROD'=>$datosParaGuardar[11],
                'IDMODIF_PROD'=>$datosParaGuardar[0],
                'FMODIF_PROD'=>date('Y-m-d'),
            ];
            $buildera=$this->dbBuild->table('cat_productos');
            $buildera->where('CLAVE_PROD',$datosParaGuardar[1]);
            $buildera->where('CODBARR_PROD',$datosParaGuardar[2]);
            $buildera->set($setProducto);
            $buildera->update($setProducto);
            log_message('info','[CATPRODUCTOS|Async/Q] {user} actualizo registro {item} en catalogo de productos.', $log_extra);

            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function eliminarDatosProductos($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $parametros=explode('_',$datosParaEliminar[1]);
            $buildera=$this->dbBuild->table('cat_productos');
            $buildera->where('CLAVE_PROD',$parametros[0]);
            $buildera->where('CODBARR_PROD',$parametros[1]);
            $buildera->delete();
            log_message('notice','[CATPRODUCTOS|Async/Q] {user} eliminó el codigo {item} de productos.',$log_extra);
            $builderb=$this->dbBuild->query('ALTER TABLE `cat_productos` AUTO_INCREMENT = 1;');
            log_message('notice','[CATPRODUCTOS|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }
    








    public function llenarDatosComboAreas()
    {
        try {
            $builder=$this->dbBuild->table('cat_staff_area');
            $builder->select('CLAVE_AREA, DESCRIPCION_AREA');
            $builder->where('ESTATUS_AREA','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos para renderizado de combo areas para puestos.');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla areas.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosComboPuestos($id)
    {
        try {

            $builder=$this->dbBuild->table('cat_staff_puestos');
            $builder->select('CLAVE_PUESTO, DESCRIPHOM_PUESTO');
            $builder->where('CLAVEAREA_PUESTO',$id);
            $builder->where('ESTATUS_PUESTO','ACTI');
            $resultado=$builder->get();
    
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async] Generando datos desde consulta por factor para renderizar combo puestos');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla puestos.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }
    }

    public function llenarDatosComboCatEstados()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_estados');
            $builder->select('CLAVE_ESTA, NOMBRE_ESTA');
            $builder->where('ESTATUS_ESTA','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo estados');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla estados.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function llenarDatosComboCatMunicipios($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_municipios');
            $builder->select('CLVMUNI_MUNIC, NOMBRE_MUNIC');
            $builder->where('ESTADO_MUNIC', $id);
            $builder->where('ESTATUS_MUNIC','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo municipios');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla municipios.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function llenarDatosComboCatCodPostales($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_codpostal');
            $builder->select('CLVCODPOS_CODPOS, CODIPOST_CODPOS');
            $builder->where('MUNIC_CODPOS', $id);
            $builder->where('ESTATUS_CODPOS','ACTI');
            $builder->groupBy('CLVCODPOS_CODPOS');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo codigopostal');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla codigopostal.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function llenarDatosComboCatColonias($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_colonias');
            $builder->select('CLVCOLON_COLON, COLONIA_COLON');
            $builder->where('CODPOS_COLON', $id);
            $builder->where('ESTATUS_COLON','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo colonias');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla colonias.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function llenarDatosCompletarCalles($id)
    {
        try {
            $parametros=explode('_', $id);
            $db= \Config\Database::connect();
            $builder=$db->table('cat_calles');
            $builder->select('CALLE_CALLE');
            $builder->where('COLON_CALLE',$parametros[0]);
            $builder->like('CALLE_CALLE', $parametros[1],'both');
            $builder->where('ESTATUS_CALLE','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para completar calles');
                return $resultado->getResultArray();
            }else{
                log_message('info','[CATALOGOS|Async/Q] No hay datos en consulta para renderizado de tabla calles.');
                throw new \RuntimeException("No se encontraron datos en el catálogo.");
            }

        } catch (\RuntimeException $errorElement) {
            $errorMessage = [
                'estatus'=>'error',
                'icon'=>'error',
                'mensaje'=>'Error en consulta: '.$errorElement->getMessage(),
            ];
            return $errorMessage;
        }

    }

    public function llenarDatosComboTipoPersonas()
    {
        $builder=$this->dbBuild->table('cat_tipoPersona');
        $builder->select('CLAVE_TPER, DESCRIPCION_TPER');
        $builder->where('ESTATUS_TPER','ACTI');
        $resultado=$builder->get();
        if($resultado->getNumRows()>0){
            
            return $resultado->getResultArray();
        }
    }

    public function llenarDatosComboEstadoGral()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_estados');
            $builder->select('CLAVE_ESTA, NOMBRE_ESTA');
            $builder->where('PAIS_ESTA','MX');
            $builder->orderBy('NOMBRE_ESTA');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo estados');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboMunicipiosGral($id)
    {
        try {
            $builder=$this->dbBuild->table('cat_municipios');
            $builder->select('CLVMUNI_MUNIC, NOMBRE_MUNIC');
            $builder->where('ESTADO_MUNIC', $id);
            $builder->orderBy('NOMBRE_MUNIC','ACS');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo municipios');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboCodPostalesGral($id)
    {
        try {
            $builder=$this->dbBuild->table('cat_codpostal');
            $builder->select('CLVCODPOS_CODPOS, CODIPOST_CODPOS');
            $builder->where('MUNIC_CODPOS', $id);
            $builder->groupBy('CLVCODPOS_CODPOS');
            $builder->orderBy('CODIPOST_CODPOS','ASC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo codigopostal');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboColoniasGral($id)
    {
        try {
            $builder=$this->dbBuild->table('cat_colonias');
            $builder->select('CLVCOLON_COLON, COLONIA_COLON');
            $builder->where('CODPOS_COLON', $id);
            $builder->orderBy('COLONIA_COLON','ASC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo colonias');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboMetodosPago()
    {
        try {
            $builder=$this->dbBuild->table('cat_metodopagos');
            $builder->select('CLAVE_METP, DESCRIPCION_METP');
            $builder->where('ESTATUS_METP', 'ACTI');
            $builder->orderBy('DESCRIPCION_METP','ASC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo metodos pago');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function autoDatosCompletarProveedores($id)
    {
        try {
            $builder=$this->dbBuild->table('cat_proveedor');
            $builder->select('CLAVE_PROV, NOMBRE_PROV');
            $builder->like('NOMBRE_PROV', $id,'left');
            $builder->where('ESTATUS_PROV','ACTI');
            $builder->orderBy('NOMBRE_PROV','ASC');
            $builder->limit(50);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de lista proveedores');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function autoDatosCompletarProductos($id)
    {
        try {
            $builder=$this->dbBuild->table('cat_productos');
            $builder->select('CLAVE_PROD, DESCRIPCION_PROD');
            $builder->like('DESCRIPCION_PROD', $id,'left');
            $builder->where('ESTATUS_PROD','ACTI');
            $builder->orderBy('DESCRIPCION_PROD','ASC');
            $builder->limit(50);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de lista productos');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }




}


?>
