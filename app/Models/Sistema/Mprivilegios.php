<?php

namespace App\Models\Sistema;
use CodeIgniter\Model;

/**
 *
 */
class Mprivilegios extends Model
{
    public function llamandoDatosParametrosWeb($id)
    {
        $db= \Config\Database::connect();
        $builder=$db->table('sys_controlweb');
        $builder->select('`TITULO_CONW`, `TITULOPANT_CONW`, `ROBOTS_CONW`, `KEYWORD_CONW`, `DESCRIPCION_CONW`, `REFERENCIA_CONW`');
        $builder->where('CLAVE_CONW',$id);
        $builder->where('ESTATUS_CONW','ACTI');
        $resultado=$builder->get();

        return $resultado->getResultArray();
    }

    public function llenarDatosTablaPerfilStaff()
    {
        try {
            log_message('info','[ASIGNASTAFF|Async] Solicitando datos para listado perfil usuario.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_perfilusuario');
            $builder->select("`IDUSUA_PERFUS` AS `idTablePk`, CONCAT(NOMBRE_RESPO,' ', APATERNO_RESPO,' ', AMATERNO_RESPO) AS `NOMBRE`, PERFIL_PERFUS, OPCIONES_PERFUS, PERFMOD_PERFUS");
            $builder->join('sys_responsables','IDUSUA_RESPO=IDUSUA_PERFUS');
            $builder->whereIn('NIVELPERF_RESPO',['MASTER','ADMINISTRAD']);
            $builder->where('ESTATUS_RESPO','ACTI');
            $builder->orderBy('PERFIL_PERFUS, APATERNO_RESPO, NOMBRE_RESPO');
            $builder->groupBy('IDUSUA_PERFUS');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[ASIGNASTAFF|Async/Q] Generando datos por consulta para renderizado de perfil usuario.');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function buscarDuplicadosAsignacionStaff($datosParaGuardar)
    {
        try {
            $db= \Config\Database::connect();
            log_message('info','[ASIGNASTAFF|Async/Q] Verificando duplicidad en consulta para grabar asignación.');
            $builder=$db->table('sys_perfilusuario');
            $builder->select("IDUSUA_PERFUS, PERFIL_PERFUS");
            $builder->where('IDUSUA_PERFUS',$datosParaGuardar[2]);
            $resultado=$builder->get();
            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function guardarDatosAsignacionStaff($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            $db= \Config\Database::connect();

            $buildera=$db->table('cat_perfiles');
            $buildera->select('PERFIL_PERF');
            $buildera->where('CLAVE_PERF',$datosParaGuardar[1]);
            $buildera->where('ESTATUS_PERF','ACTI');
            $resultado0=$buildera->get();
            log_message('info','[ASIGNASTAFF|Async/Q] Generando datos desde consulta desde perfiles para guardado.');
            foreach($resultado0->getResultArray() as $filas){
                $opcionesInsert=$filas['PERFIL_PERF'];
            }

            $setGuardar=[
                'FECHCAPT_PERFUS'=>date('Y-m-d'),
                'HORACAPT_PERFUS'=>date('H:i:s'),
                'CAPTURA_PERFUS'=>$datosParaGuardar[0],
                'IDUSUA_PERFUS'=>$datosParaGuardar[2],
                'PERFIL_PERFUS'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'OPCIONES_PERFUS'=>$opcionesInsert,
                'IDMODIF_PERFUS'=>$datosParaGuardar[0],
                'FMODIF_PERFUS'=>date('Y-m-d-'),
            ];

            $builderb=$db->table('sys_perfilusuario');
            $builderb->insert($setGuardar);
            log_message('notice','[ASIGNASTAFF|Async/Q] {user} Asigno un perfil {item} a perfiles de usuario .', $log_extra);

            $setActualizar=[
                'AREA_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'PUESTO_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'NIVELPERF_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'PERFIL_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'IDMODIF_RESPO'=>$datosParaGuardar[0],
                'FMODIF_RESPO'=>date('Y-m-d-'),
            ];
            $builderc=$db->table('sys_responsables');
            $builderc->where('IDUSUA_RESPO',$datosParaGuardar[2]);
            $builderc->set($setActualizar);
            $builderc->update($setActualizar);
            log_message('notice','[ASIGNASTAFF|Async/Q] {user} actualizando perfil y roles de {item} en responsables .', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function buscarDatosAsignacionStaff($datosParaBuscar)
    {
        try {
            $dba= \Config\Database::connect();
            $buildera=$dba->table('sys_perfilusuario');
            $buildera->select("IDUSUA_PERFUS, PERFIL_PERFUS, OPCIONES_PERFUS");
            $buildera->where('IDUSUA_PERFUS',$datosParaBuscar[1]);
            $resultado0=$buildera->get();
            log_message('info','[ASIGNASTAFF|Async/Q] Generando datos desde consulta para renderizado de edicion de perfil.');

            return json_encode($resultado0->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function llenarDatosComboStaffDatos($id)
    {
        try {
            log_message('info','[ASIGNASTAFF|Async] Solicitando retorno de datos para combo usuarios.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_responsables');
            $builder->select("IDUSUA_RESPO,  CONCAT(NOMBRE_RESPO,' ', APATERNO_RESPO,' ', AMATERNO_RESPO) AS `NOMBRE`");
            $builder->where('IDUSUA_RESPO',$id);
            $builder->where('ESTATUS_RESPO', 'ACTI');
            $resultado=$builder->get();
            log_message('info','[ASIGNASTAFF|Async/Q] Generando datos por consulta para renderizado de combo usuarios.');

            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function actualizarDatosPerfilStaff($datosParaActualizar)
    {
        try {
            $menuRoles=implode(', ',$datosParaActualizar[3]);
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
                'item2'=>$datosParaActualizar[2],
            ];
            $db= \Config\Database::connect();
            $setActualiza=[
                'OPCIONES_PERFUS'=>$menuRoles,
                'PERFMOD_PERFUS'=>'SI',
                'IDMODIF_PERFUS'=>$datosParaActualizar[0],
                'FMODIF_PERFUS'=>date('Y-m-d'),
            ];
            $builder=$db->table('sys_perfilusuario');
            $builder->where('IDUSUA_PERFUS',$datosParaActualizar[2]);
            $builder->where('PERFIL_PERFUS',$datosParaActualizar[1]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[ASIGNASTAFF|Async/Q] {user} actualizo el perfil de {item2} en {item}.', $log_extra);
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function eliminarDatosAsignacionStaff($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $db= \Config\Database::connect();
            $builder=$db->table('sys_perfilusuario');
            $builder->where('IDUSUA_PERFUS',$datosParaEliminar[1]);
            $builder->delete();
            log_message('notice','[ASIGNASTAFF|Async/Q] {user} eliminó al user {item} de los perfiles de usuarios.',$log_extra);
            $buildera=$db->query('ALTER TABLE `sys_perfilusuario` AUTO_INCREMENT = 1;');
            log_message('notice','[ASIGNASTAFF|Async/Q] Reindexando tabla tras eliminación.');
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function llenarDatosTablaPerfilUsuario()
    {
        try {
            log_message('info','[ASIGNAUSER|Async] Solicitando datos para listado perfil usuario.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_perfilusuario');
            $builder->select("`IDUSUA_PERFUS` AS `idTablePk`, CONCAT(NOMBRE_RESPO,' ', APATERNO_RESPO,' ', AMATERNO_RESPO) AS `NOMBRE`, PERFIL_PERFUS, OPCIONES_PERFUS, PERFMOD_PERFUS");
            $builder->join('sys_responsables','IDUSUA_RESPO=IDUSUA_PERFUS');
            $builder->where('ESTATUS_RESPO','ACTI');
            $builder->orderBy('PERFIL_PERFUS, APATERNO_RESPO, NOMBRE_RESPO');
            $builder->groupBy('IDUSUA_PERFUS');
            $resultado=$builder->get();
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de perfil usuario.');

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function llenarDatosComboPerfilesDatos()
    {
        try {
            log_message('info','[ASIGNAUSER|Async] Solicitando datos para renderizado de combo perfiles.');
            $db= \Config\Database::connect();
            $builder=$db->table('cat_puestos');
            $builder->select("CLAVE_PERF, DESCRIPHOM_PUESTO");
            $builder->join('cat_perfiles','CLAVE_PERF=CLAVE_PUESTO');
            $builder->groupBy('CLAVE_PERF');
            $resultado=$builder->get();
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de combo perfil.');

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function llenarDatosComboUsuariosDatos()
    {
        try {
            log_message('info','[ASIGNAUSER|Async] Solicitando retorno de datos para combo usuarios.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_responsables');
            $builder->select("IDUSUA_RESPO,  CONCAT(NOMBRE_RESPO,' ', APATERNO_RESPO,' ', AMATERNO_RESPO) AS `NOMBRE`");
            $builder->where('ESTATUS_RESPO', 'ACTI');
            $builder->orderBy('APATERNO_RESPO, NOMBRE_RESPO');
            $resultado=$builder->get();
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de combo usuarios.');

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function llenarDatosMenuPerfil($id)
    {
        try {

            $opciond='';
            $opcionc[]='';
            $opcionb[]='';
            $opciona[]='';
            $arreglod="''";
            $arregloc="''";
            $arreglob="''";
            $arregloa="''";

            log_message('info','[ASIGNAUSER|Async/Q] Solicitando retorno de datos para opciones perfil.');
            $db0= \Config\Database::connect();
            $builder=$db0->table('cat_perfiles');
            $builder->select("CLAVE_PERF,  PERFIL_PERF");
            $builder->where('CLAVE_PERF',$id);
            $resultado0=$builder->get();
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos para determinar opciones y roles seleccionadas.');
            foreach($resultado0->getResultArray() as $filasd){
                $opciond="'".$filasd['PERFIL_PERF']."'";
            }
            $separaa=explode(", ", $opciond);
            $arreglod=implode("','", $separaa);

            $dbd= \Config\Database::connect();
            $resultado4=$dbd->query("
                SELECT IDSBMENU_MEND, IDSBMENUO_MEND, CLASS_MEND, REFEREN_MEND, TITLE_MEND, DESCRIP_MEND, ORDEN_MEND, CONTOPC_MEND
                FROM sys_menunivd
                WHERE IDSBMENUO_MEND IN (".$arreglod.")
                AND ESTATUS_MEND='ACTI'
                ORDER BY ORDEN_MEND ASC
            ");
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de menu nivel d.');
            foreach($resultado4->getResultArray() as $filasc){
                $opcionc[]="'".$filasc['IDSBMENU_MEND']."'";
            }
            $arregloc=implode(",",$opcionc);

            $dbc= \Config\Database::connect();
            $resultado3=$dbc->query("
                SELECT IDSMENU_MENC, IDSBMENU_MENC, CLASS_MENC, REFEREN_MENC, TITLE_MENC, DESCRIP_MENC, ORDEN_MENC, CONTOPC_MENC
                FROM sys_menunivc
                WHERE IDSBMENU_MENC IN (".$arreglod.$arregloc.")
                AND ESTATUS_MENC='ACTI'
                ORDER BY ORDEN_MENC ASC
            ");
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de menu nivel c.');
            foreach($resultado3->getResultArray() as $filasb){
                $opcionb[]="'".$filasb['IDSMENU_MENC']."'";
            }
            $arreglob=implode(",", $opcionb);

            $dbb= \Config\Database::connect();
            $resultado2=$dbb->query("
                SELECT IDMENU_MENB, IDSMENU_MENB, CLASS_MENB, REFEREN_MENB, TITLE_MENB, DESCRIP_MENB, ORDEN_MENB, CONTOPC_MENB
                FROM sys_menunivb
                WHERE IDSMENU_MENB IN (".$arreglod.$arregloc.$arreglob.")
                AND ESTATUS_MENB='ACTI'
                ORDER BY ORDEN_MENB ASC
            ");
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de menu nivel b.');
            foreach($resultado2->getResultArray() as $filasa){
                $opciona[]="'".$filasa['IDMENU_MENB']."'";
            }
            $arregloa=implode(",", $opciona);

            $dba= \Config\Database::connect();
            $resultado1=$dba->query("
                SELECT IDMENU_MENA, CLASS_MENA, TITLE_MENA, DESCRIP_MENA, REFEREN_MENA, ORDEN_MENA, CONTOPC_MENA
                FROM sys_menuniva
                WHERE IDMENU_MENA IN (".$arreglod.$arregloc.$arreglob.$arregloa.")
                AND ESTATUS_MENA='ACTI'
                ORDER BY ORDEN_MENA ASC
            ");
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos por consulta para renderizado de menu nivel a.');

            return [
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
                $resultado2->getResultArray(),
                $resultado3->getResultArray(),
                $resultado4->getResultArray(),
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }
    }

    public function buscarDuplicadosAsignacion($datosParaGuardar)
    {
        try {
            $db= \Config\Database::connect();
            log_message('info','[ASIGNAUSER|Async/Q] Verificando duplicidad en consulta para grabar asignación.');
            $builder=$db->table('sys_perfilusuario');
            $builder->select("IDUSUA_PERFUS, PERFIL_PERFUS");
            $builder->where('IDUSUA_PERFUS',$datosParaGuardar[2]);
            $resultado=$builder->get();
            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function guardarAsignacion($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            $db= \Config\Database::connect();

            $buildera=$db->table('cat_perfiles');
            $buildera->select('PERFIL_PERF');
            $buildera->where('CLAVE_PERF',$datosParaGuardar[1]);
            $buildera->where('ESTATUS_PERF','ACTI');
            $resultado0=$buildera->get();
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos desde consulta desde perfiles para guardado.');
            foreach($resultado0->getResultArray() as $filas){
                $opcionesInsert=$filas['PERFIL_PERF'];
            }

            $setGuardar=[
                'FECHCAPT_PERFUS'=>date('Y-m-d'),
                'HORACAPT_PERFUS'=>date('H:i:s'),
                'CAPTURA_PERFUS'=>$datosParaGuardar[0],
                'IDUSUA_PERFUS'=>$datosParaGuardar[2],
                'PERFIL_PERFUS'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'OPCIONES_PERFUS'=>$opcionesInsert,
                'IDMODIF_PERFUS'=>$datosParaGuardar[0],
                'FMODIF_PERFUS'=>date('Y-m-d-'),
            ];

            $builderb=$db->table('sys_perfilusuario');
            $builderb->insert($setGuardar);
            log_message('notice','[ASIGNAUSER|Async/Q] {user} Asigno un perfil {item} a perfiles de usuario .', $log_extra);

            $setActualizar=[
                'AREA_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'PUESTO_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'NIVELPERF_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'PERFIL_RESPO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'IDMODIF_RESPO'=>$datosParaGuardar[0],
                'FMODIF_RESPO'=>date('Y-m-d-'),
            ];
            $builderc=$db->table('sys_responsables');
            $builderc->where('IDUSUA_RESPO',$datosParaGuardar[2]);
            $builderc->set($setActualizar);
            $builderc->update($setActualizar);
            log_message('notice','[ASIGNAUSER|Async/Q] {user} actualizando perfil y roles de {item} en responsables .', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function buscarDatosAsignacion($datosParaBuscar)
    {
        try {
            $dba= \Config\Database::connect();
            $buildera=$dba->table('sys_perfilusuario');
            $buildera->select("IDUSUA_PERFUS, PERFIL_PERFUS, OPCIONES_PERFUS");
            $buildera->where('IDUSUA_PERFUS',$datosParaBuscar[1]);
            $resultado0=$buildera->get();
            log_message('info','[ASIGNAUSER|Async/Q] Generando datos desde consulta para renderizado de edicion de perfil.');

            return json_encode($resultado0->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function actualizarPerfiles($datosParaActualizar)
    {
        try {
            $menuRoles=implode(', ',$datosParaActualizar[3]);
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
                'item2'=>$datosParaActualizar[2],
            ];
            $db= \Config\Database::connect();
            $setActualiza=[
                'OPCIONES_PERFUS'=>$menuRoles,
                'PERFMOD_PERFUS'=>'SI',
                'IDMODIF_PERFUS'=>$datosParaActualizar[0],
                'FMODIF_PERFUS'=>date('Y-m-d'),
            ];
            $builder=$db->table('sys_perfilusuario');
            $builder->where('IDUSUA_PERFUS',$datosParaActualizar[2]);
            $builder->where('PERFIL_PERFUS',$datosParaActualizar[1]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('info','[ASIGNAUSER|Async/Q] {user} actualizo el perfil de {item2} en {item}.', $log_extra);
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function eliminarAsignacion($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $db= \Config\Database::connect();
            $builder=$db->table('sys_perfilusuario');
            $builder->where('IDUSUA_PERFUS',$datosParaEliminar[1]);
            $builder->delete();
            log_message('notice','[ASIGNAUSER|Async/Q] {user} eliminó al user {item} de los perfiles de usuarios.',$log_extra);
            $buildera=$db->query('ALTER TABLE `sys_perfilusuario` AUTO_INCREMENT = 1;');
            log_message('notice','[ASIGNAUSER|Async/Q] Reindexando tabla tras eliminación.');
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }


    public function llenarDatosComboPerfilesStaff($datosBusqueda)
    {
        try {
            $log_extra=[
                'user'=>$datosBusqueda[0],
            ];
            log_message('info','[PRIVILEGIOS|Async/Q] {user} solicito datos para renderizado de combo perfil.', $log_extra);
            $db= \Config\Database::connect();
            $builder=$db->table('cat_puestos');
            $builder->select("CLAVE_PERF, DESCRIPHOM_PUESTO");
            $builder->join('cat_perfiles','CLAVE_PERF=CLAVE_PUESTO');
            $builder->where('ESTATUS_PERF','ACTI');
            $builder->groupBy('CLAVE_PERF');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[PRIVILEGIOS|Async/Q] Generando datos por consulta para renderizado de combo perfil.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }

    public function llenarDatosComboStaff()
    {
        try {
            log_message('info','[PRIVILEGIOS|Async] {user} solicito datos para renderizado combo staff.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_responsables');
            $builder->select("IDUSUA_RESPO,  CONCAT(NOMBRE_RESPO,' ', APATERNO_RESPO,' ', AMATERNO_RESPO) AS `NOMBRE`");
            $builder->where('ESTATUS_RESPO', 'ACTI');
            $builder->whereIn('PERFIL_RESPO',['MASTER','ADMINISTRA','REPARTO']);
            $builder->orderBy('APATERNO_RESPO, NOMBRE_RESPO');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[PRIVILEGIOS|Async/Q] Generando datos por consulta para renderizado de combo staff.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement);
        }

    }




}


 ?>
