<?php

namespace App\Models\Sistema;
use CodeIgniter\Model;

/**
 *
 */
class Mcatalogos extends Model
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

    public function llenarDatosTablaAreas()
    {
        log_message('info','[AREAS|Async] Solicitando datos para listado areas.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->select('`CLAVE_AREA` AS `idTablePk`, `CLAVE_AREA` AS `Clave`, `DESCRIPCION_AREA` AS `Descripción`, `FMODIF_AREA` AS `Modif`, COALESCE(COUNT(DISTINCT(`CLAVE_PUESTO`))) AS `TOTAL`');
        $builder->join('cat_puestos','CLAVEAREA_PUESTO=CLAVE_AREA','left');
        $builder->where('ESTATUS_AREA','ACTI');
        $builder->orderBy('FMODIF_AREA','DESC');
        $builder->groupBy('CLAVE_AREA');
        $resultado=$builder->get();
        log_message('info','[AREAS|Async/Q] Generando datos por consulta para renderizado de tabla areas.');

        return json_encode($resultado->getResultArray());
    }

    public function buscarDuplicadosAreas($datosParaGuardar)
    {
        log_message('info','[AREAS|Async/Q] Buscando duplicidad en la tabla con parametros solicitados.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->select('CLAVE_AREA, DESCRIPCION_AREA, FMODIF_AREA');
        $builder->where('CLAVE_AREA',$datosParaGuardar[1]);
        $builder->where('ESTATUS_AREA','ACTI');
        $resultado=$builder->get();
        return $resultado->getResultArray();
    }

    public function guardarDatosAreas($datosParaGuardar)
    {
        $log_extra=[
            'user'=>$datosParaBuscar[0],
            'item'=>$datosParaBuscar[1],
        ];
        log_message('info','[AREAS|Async] Iniciando grabado de datos en estructura areas.');
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
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->insert($setGuardar);
        log_message('info','[AREAS|Async/Q] {user} Creo un nuevo registro {item} en catalogo de áreas .');
        return true;
    }

    public function buscarDatosAreas($datosParaBuscar)
    {
        $log_extra=[
            'user'=>$datosParaBuscar[0],
        ];
        log_message('info','[AREAS|Async/Q] {user} Solicito busqueda de datos para modificar catalogo de areas.', $log_extra);
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->select('CLAVE_AREA, DESCRIPCION_AREA, COMENTARIO_AREA');
        $builder->where('CLAVE_AREA',$datosParaBuscar[1]);
        $builder->where('ESTATUS_AREA','ACTI');
        $resultado=$builder->get();
        log_message('info','[AREAS|Async/Q] Generando datos por consulta para renderizado de datos a modificar areas.');

        return json_encode($resultado->getResultArray());
    }

    public function actualizarDatosAreas($datosParaActualizar)
    {
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
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->where('CLAVE_AREA',$datosParaActualizar[1]);
        $builder->set($setActualiza);
        $builder->update($setActualiza);
        log_message('notice','[AREAS|Async/Q] {user} Actualizo un registro {item} en catalogo de áreas .', $log_extra);
        return true;

    }

    public function eliminarDatosAreas($datosParaEliminar)
    {
        $log_extra=[
            'user'=>$datosParaEliminar[0],
            'item'=>$datosParaEliminar[1],
        ];
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->where('CLAVE_AREA',$datosParaEliminar[1]);
        $builder->delete();
        log_message('notice','[AREAS|Async/Q] {user} eliminó el codigo {item} de la base de datos.',$log_extra);
        $buildera=$db->query('ALTER TABLE `cat_areas` AUTO_INCREMENT = 1;');
        log_message('notice','[AREAS|Async/Q] Reindexando tabla tras eliminación.');

        return true;
    }

    public function llenarDatosTablaPuestos()
    {
        log_message('info','[PUESTOS|Async] Solicitando retorno de datos para listado.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->select("CONCAT(CLAVEAREA_PUESTO,'_',CLAVE_PUESTO) AS `idTablePk`, CLAVEAREA_PUESTO, CLAVE_PUESTO, DESCRIPHOM_PUESTO, `FMODIF_PUESTO, COALESCE(COUNT(DISTINCT(`CLAVE_PERF`))) AS `TOTAL`");
        $builder->join('cat_perfiles','CLAVE_PERF=CLAVE_PUESTO','left');
        $builder->where('ESTATUS_PUESTO','ACTI');
        $builder->orderBy('FMODIF_PUESTO','DESC');
        $builder->groupBy('CLAVE_PUESTO');
        $resultado=$builder->get();
        log_message('info','[PUESTOS|Async/Q] Generando datos para renderizado de tabla puestos.');

        return json_encode($resultado->getResultArray());
    }

    public function buscarDuplicadosPuestos($datosParaGuardar)
    {
        log_message('info','[PUESTOS|Async/Q] Buscando duplicidad en la tabla con parametros solicitados.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->select('CLAVEAREA_PUESTO, CLAVE_PUESTO, DESCRIPHOM_PUESTO FMODIF_AREA');
        $builder->where('CLAVEAREA_PUESTO',$datosParaGuardar[1]);
        $builder->where('CLAVE_PUESTO',$datosParaGuardar[2]);
        $builder->where('ESTATUS_PUESTO','ACTI');
        $resultado=$builder->get();

        return $resultado->getResultArray();
    }

    public function guardarDatosPuestos($datosParaGuardar)
    {
        $log_extra=[
            'user'=>$datosParaBuscar[0],
            'item'=>$datosParaBuscar[2],
        ];
        log_message('info','[PUESTOS|Async] Iniciando grabado en la estructura de puestos.');
        $setGuardar=[
            'FECHCAPT_PUESTO'=>date('Y-m-d'),
            'HORACAPT_PUESTO'=>date('H:i:s'),
            'CAPTURA_PUESTO'=>$datosParaGuardar[0],
            'CLAVEAREA_PUESTO'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
            'CLAVE_PUESTO'=>ucwords(mb_strtoupper($datosParaGuardar[2])),
            'DESCRIPHOM_PUESTO'=>ucwords(mb_strtolower($datosParaGuardar[3])),
            'DESCRIPMUJ_PUESTO'=>ucwords(mb_strtolower($datosParaGuardar[4])),
            'COMENTARIO_PUESTO'=>$datosParaGuardar[5],
            'IDMODIF_PUESTO'=>$datosParaGuardar[0],
            'FMODIF_PUESTO'=>date('Y-m-d-'),
            'ESTATUS_PUESTO'=>'ACTI',
        ];
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->insert($setGuardar);
        log_message('notice','[PUESTOS|Async/Q] {user} creo un nuevo registro {item} en estructura puestos.');

        return true;
    }

    public function buscarDatosPuestos($datosParaBuscar)
    {
        $parametroInput= explode('_',$datosParaBuscar[1]);
        $log_extra=[
            'user'=>$datosParaBuscar[0],
        ];
        log_message('info','[PUESTOS|Async/Q] {user} solicito busqueda de datos para modificar registros puestos.', $log_extra);
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->select('CLAVEAREA_PUESTO,CLAVE_PUESTO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO, COMENTARIO_PUESTO');
        $builder->where('CLAVEAREA_PUESTO',$parametroInput[0]);
        $builder->where('CLAVE_PUESTO',$parametroInput[1]);
        $builder->where('ESTATUS_PUESTO','ACTI');
        $resultado=$builder->get();
        log_message('info','[AREAS|Async/Q] Generando datos por consulta para renderizado de datos a modificar puestos.');

        return json_encode($resultado->getResultArray());

    }

    public function actualizarDatosPuestos($datosParaActualizar)
    {
        $log_extra=[
            'user'=>$datosParaActualizar[0],
            'item'=>$datosParaActualizar[1],
        ];
        $setActualiza=[
            'DESCRIPHOM_PUESTO'=>$datosParaActualizar[3],
            'DESCRIPMUJ_PUESTO'=>$datosParaActualizar[4],
            'COMENTARIO_PUESTO'=>$datosParaActualizar[5],
            'IDMODIF_PUESTO'=>$datosParaActualizar[0],
            'FMODIF_PUESTO'=>date('Y-m-d'),
        ];
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->where('CLAVEAREA_PUESTO',$datosParaActualizar[1]);
        $builder->where('CLAVE_PUESTO',$datosParaActualizar[2]);
        $builder->set($setActualiza);
        $builder->update($setActualiza);
        log_message('info','[PUESTOS|Async/Q] {user} actualizo un registro {item} en la estructura puestos.', $log_extra);

        return true;
    }

    public function eliminarDatosPuestos($datosParaEliminar)
    {
        $parametroInput= explode('_',$datosParaEliminar[1]);

        $log_extra=[
            'user'=>$datosParaEliminar[0],
            'item'=>$parametroInput[1],
        ];
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->where('CLAVEAREA_PUESTO',$parametroInput[0]);
        $builder->where('CLAVE_PUESTO',$parametroInput[1]);
        $builder->delete();
        log_message('notice','[PUESTOS|Async/Q] Usuario {user} eliminó el codigo {item} de la base de datos.',$log_extra);
        $buildera=$db->query('ALTER TABLE `cat_puestos` AUTO_INCREMENT = 1;');
        log_message('notice','[PUESTOS|Async/Q] Reindexando tabla tras eliminación.');
        return true;
    }

    public function llenarDatosTablaPerfiles()
    {
        log_message('info','[PERFILES|Async/Q] Solicitando retorno de datos para listado perfiles.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_perfiles');
        $builder->select('CLAVE_PERF AS `idTablePk`, CLAVE_PERF, PERFIL_PERF, FMODIF_PERF, COALESCE(COUNT(DISTINCT(`IDUSUA_PERFUS`))) AS `TOTAL`');
        $builder->join('sys_perfilusuario','PERFIL_PERFUS=CLAVE_PERF','left');
        $builder->where('ESTATUS_PERF','ACTI');
        $builder->orderBy('FMODIF_PERF','DESC');
        $builder->groupBy('CLAVE_PERF');
        $resultado=$builder->get();
        log_message('info','[PERFILES|Async/Q] Generando datos desde consulta para renderizado de listado perfiles.');

        return json_encode($resultado->getResultArray());
    }

    public function guardarDatosPerfiles($datosParaGuardar)
    {
        try {
            log_message('info','[PERFILES|Async] Iniciando grabado en la estructura de perfiles.');
            $menuRoles=implode(', ',$datosParaGuardar[4]);
            $db= \Config\Database::connect();
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
            $builder=$db->table('cat_perfiles');
            $builder->insert($setGuardar);
            log_message('notice','[PERFILES|Async/Q] {user} creo un nuevo registro {item} en estructura perfiles.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
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
            $builder=$db->table('cat_perfiles');
            $builder->select('CLAVE_PERF, PERFIL_PERF, COMENTS_PERF');
            $builder->where('CLAVE_PERF',$datosParaBuscar[1]);
            $builder->where('ESTATUS_PERF','ACTI');
            $resultado=$builder->get();
            log_message('info','[AREAS|Async/Q] Generando datos por consulta para renderizado de datos a modificar perfiles.');

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDuplicadosPerfiles($datosParaGuardar)
    {
        try {
            log_message('info','[PERFILES|Async/Q] Buscando duplicidad en la tabla con parametros solicitados.');
            $db= \Config\Database::connect();
            $builder=$db->table('cat_perfiles');
            $builder->select('CLAVE_PERF, FMODIF_PERF');
            $builder->where('CLAVE_PERF',$datosParaGuardar[2]);
            $builder->where('ESTATUS_PERF','ACTI');
            $resultado=$builder->get();

            return $resultado->getResultArray();

        } catch (\Exception $errorElement) {
            return json_encode($errorElement.message());
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
            $db= \Config\Database::connect();
            $builder=$db->table('cat_perfiles');
            $builder->where('CLAVE_PERF',$datosParaActualizar[1]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[PERFILES|Async/Q] {user} actualizo un registro {item} en estructura perfiles .', $log_extra);
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
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

    public function llenarComboAreas()
    {
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->select('CLAVE_AREA, DESCRIPCION_AREA');
        $builder->where('ESTATUS_AREA','ACTI');
        $resultado=$builder->get();
        log_message('info','[PUESTOS|Async/Q] Generando datos para renderizado de combo areas para puestos.');

        return $resultado->getResultArray();
    }

    public function llenarDatosTablaEstatus()
    {
        log_message('info','[ESTATUS|Async] Solicitando datos para listado areas.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_estatus');
        $builder->select('`CLAVE_ESTAT` AS `idTablePk`, `CLAVE_ESTAT` AS `Clave`, `DESCRIPCION_ESTAT` AS `Descripción`, RANGO_ESTAT, `FMODIF_ESTAT` AS `Modif`');
        $builder->where('ESTATUS_ESTAT','ACTI');
        $builder->orderBy('FMODIF_ESTAT','DESC');
        $resultado=$builder->get();
        log_message('info','[ESTATUS|Async/Q] Generando datos por consulta para renderizado de tabla areas.');

        return json_encode($resultado->getResultArray());
    }

    public function buscarDuplicadosEstatus($datosParaGuardar)
    {
        log_message('info','[ESTATUS|Async/Q] Buscando duplicidad en la tabla con parametros solicitados.');
        $db= \Config\Database::connect();
        $builder=$db->table('cat_estatus');
        $builder->select('CLAVE_ESTAT, DESCRIPCION_ESTAT, FMODIF_ESTAT');
        $builder->where('CLAVE_ESTAT',$datosParaGuardar[1]);
        $builder->where('ESTATUS_ESTAT','ACTI');
        $resultado=$builder->get();
        return $resultado->getResultArray();
    }

    public function guardarDatosEstatus($datosParaGuardar)
    {
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
        $db= \Config\Database::connect();
        $builder=$db->table('cat_estatus');
        $builder->insert($setGuardar);
        log_message('info','[ESTATUS|Async/Q] {user} Creo un nuevo registro {item} en catalogo de estatus.', $log_extra);
        return true;
    }

    public function buscarDatosEditarEstatus($datosParaBuscar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaBuscar[0],
            ];
            log_message('info','[ESTATUS|Async/Q] {user} Solicito busqueda de datos para modificar catalogo de estatus.', $log_extra);
            $db= \Config\Database::connect();
            $builder=$db->table('cat_estatus');
            $builder->select('CLAVE_ESTAT, DESCRIPCION_ESTAT, RANGO_ESTAT, COMENTARIOS_ESTAT');
            $builder->where('CLAVE_ESTAT',$datosParaBuscar[1]);
            $builder->where('ESTATUS_ESTAT','ACTI');
            $resultado=$builder->get();
            log_message('info','[ESTATUS|Async/Q] Generando datos por consulta para renderizado de datos a modificar estatus.');

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosEstatus($datosParaActualizar)
    {
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
        $db= \Config\Database::connect();
        $builder=$db->table('cat_estatus');
        $builder->where('CLAVE_ESTAT',$datosParaActualizar[1]);
        $builder->set($setActualiza);
        $builder->update($setActualiza);
        log_message('notice','[ESTATUS|Async/Q] {user} Actualizo un registro {item} en catalogo de estatus .', $log_extra);
        return true;

    }

    public function eliminarDatosEstatus($datosParaEliminar)
    {
        $log_extra=[
            'user'=>$datosParaEliminar[0],
            'item'=>$datosParaEliminar[1],
        ];
        $db= \Config\Database::connect();
        $builder=$db->table('cat_estatus');
        $builder->where('CLAVE_ESTAT',$datosParaEliminar[1]);
        $builder->delete();
        log_message('notice','[ESTATUS|Async/Q] {user} eliminó el codigo {item} de la base de datos.',$log_extra);
        $buildera=$db->query('ALTER TABLE `cat_estatus` AUTO_INCREMENT = 1;');
        log_message('notice','[ESTATUS|Async/Q] Reindexando tabla tras eliminación.');

        return true;
    }









    public function cargarComboAreas()
    {
        $db= \Config\Database::connect();
        $builder=$db->table('cat_areas');
        $builder->select('CLAVE_AREA, DESCRIPCION_AREA');
        $builder->where('ESTATUS_AREA','ACTI');
        $resultado=$builder->get();
        foreach($resultado->getResultArray() as $filas){
            $salida[$filas['CLAVE_AREA']]=$filas['DESCRIPCION_AREA'];
        }
        return $salida;
    }

    public function llenarDatosComboPuestos($id)
    {
        $db= \Config\Database::connect();
        $builder=$db->table('cat_puestos');
        $builder->select('CLAVE_PUESTO, DESCRIPHOM_PUESTO');
        $builder->where('CLAVEAREA_PUESTO',$id);
        $builder->where('ESTATUS_PUESTO','ACTI');
        $resultado=$builder->get();

        if($resultado->getNumRows()>0){
            log_message('info','[CATALOGOS|Async] Generando datos desde consulta por factor para renderizar combo puestos');
            return $resultado->getResultArray();
        }
    }

    public function llenarDatosComboCatEstados()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_estados');
            $builder->select('CLAVE_ESTA, ESTADO_ESTA');
            $builder->where('ESTATUS_ESTA','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo estados');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboCatMunicipios($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_municipios');
            $builder->select('CLVMUNI_MUNIC, NOMBRE_MUNIC');
            $builder->where('CLVESTA_MUNIC', $id);
            $builder->where('ESTATUS_MUNIC','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo municipios');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboCatCodPostales($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_colonias');
            $builder->select('CLVCODPOS_CODPOS, CODIPOST_CODPOS');
            $builder->where('CLVMUNIC_CODPOS', $id);
            $builder->where('ESTATUS_CODPOS','ACTI');
            $builder->groupBy('CLVCODPOS_CODPOS');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo codigopostal');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboCatColonias($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_colonias');
            $builder->select('CLVCOLON_CODPOS, COLONIA_CODPOS');
            $builder->where('CLVCODPOS_CODPOS', $id);
            $builder->where('ESTATUS_CODPOS','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para renderizado de combo colonias');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosCompletarCalles($id)
    {
        try {
            $parametros=explode('_', $id);
            $db= \Config\Database::connect();
            $builder=$db->table('cat_calles');
            $builder->select('CALLE_CALLE');
            $builder->where('CLVCOLON_CALLE',$parametros[0]);
            $builder->like('CALLE_CALLE', $parametros[1],'both');
            $builder->where('ESTATUS_CALLE','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CATALOGOS|Async/Q] Generando datos desde consulta externa para completar calles');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }









}


?>
