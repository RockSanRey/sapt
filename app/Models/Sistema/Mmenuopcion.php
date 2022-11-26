<?php

namespace App\Models\Sistema;
use CodeIgniter\Model;

/**
 *
 */
class Mmenuopcion extends Model
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

    public function llenarDatosTablaMenuA()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('`IDMENU_MENA` AS `idTablePk`, IDMENU_MENA, CLASS_MENA, REFEREN_MENA, TITLE_MENA, DESCRIP_MENA, ORDEN_MENA, CONTOPC_MENA, FMODIF_MENA, COALESCE(COUNT(DISTINCT(IDSMENU_MENB))) AS `TOTAL`');
            $builder->join('sys_menunivb','IDMENU_MENB=IDMENU_MENA','left');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->groupBy('IDMENU_MENA');
            $builder->orderBy('ORDEN_MENA','ASC');
            $resultado=$builder->get();
            log_message('info','[MENUNIVA|Async/Q] Generando datos desde consulta para renderizado de tabla menu.');

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }


    }

    public function buscarDuplicadosMenuA($datosParaGuardar)
    {
        try {
            log_message('info','[MENUNIVA|Async/Q] Buscando duplicidad en la tabla con parametros solicitados menu A.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, DESCRIP_MENA, FMODIF_MENA');
            $builder->where('IDMENU_MENA',$datosParaGuardar[1]);
            $builder->where('ESTATUS_MENA','ACTI');
            $resultado=$builder->get();
            log_message('info','[MENUNIVA|Async/Q] Generando datos desde consulta para verificación de duplicados menu A.');

            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarMenuNivelA($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
            ];
            $setGuardarMenu=[
                'FECHCAPT_MENA'=>date('Y-m-d'),
                'HORACAPT_MENA'=>date('H:i:s'),
                'CAPTURA_MENA'=>$datosParaGuardar[0],
                'IDMENU_MENA'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'CLASS_MENA'=>$datosParaGuardar[2],
                'REFEREN_MENA'=>$datosParaGuardar[3],
                'TITLE_MENA'=>$datosParaGuardar[4],
                'DESCRIP_MENA'=>ucwords(mb_strtolower($datosParaGuardar[5])),
                'CONTOPC_MENA'=>$datosParaGuardar[6],
                'ORDEN_MENA'=>str_pad($datosParaGuardar[7],3,'0',STR_PAD_LEFT),
                'IDMODIF_MENA'=>$datosParaGuardar[0],
                'FMODIF_MENA'=>date('Y-m-d-'),
                'ESTATUS_MENA'=>'ACTI',
            ];

            $setGuardarSeo=[
                'FECHACAPT_CONW'=>date('Y-m-d'),
                'HORACAPT_CONW'=>date('H:i:s'),
                'CAPTURA_CONW'=>$datosParaGuardar[0],
                'CLAVE_CONW'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'REFERENCIA_CONW'=>$datosParaGuardar[3],
                'TITULO_CONW'=>$datosParaGuardar[8],
                'TITULOPANT_CONW'=>$datosParaGuardar[9],
                'ROBOTS_CONW'=>$datosParaGuardar[10],
                'KEYWORD_CONW'=>$datosParaGuardar[11],
                'DESCRIPCION_CONW'=>$datosParaGuardar[12],
                'FMODIF_CONW'=>$datosParaGuardar[0],
                'IDMODIF_CONW'=>date('Y-m-d'),
                'ESTATUS_CONW'=>'ACTI',
            ];

            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->insert($setGuardarMenu);
            log_message('notice','[MENUNIVA|Async/Q] {user} creo un nuevo registro {item} en menu nivel A.', $log_extra);
            if($datosParaGuardar[6]=='NO'){
                $buildera=$db->table('sys_controlweb');
                $buildera->insert($setGuardarSeo);
                log_message('notice','[MENUNIVA|Async/Q] {user} creo un nuevo registro para control web con {item}.', $log_extra);
            }

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosEditarMenuA($datosParaBuscar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaBuscar[0],
            ];
            log_message('info','[MENUNIVA|Async/Q] {user} solicito busqueda de datos para modificar menu nivel A.', $log_extra);
            $db= \Config\Database::connect();
            $buildera=$db->table('sys_menuniva');
            $buildera->select('IDMENU_MENA, CLASS_MENA, REFEREN_MENA, TITLE_MENA, CONTOPC_MENA, ORDEN_MENA, DESCRIP_MENA');
            $buildera->where('IDMENU_MENA',$datosParaBuscar[1]);
            $buildera->where('ESTATUS_MENA','ACTI');
            $resultado0=$buildera->get();
            log_message('info','[MENUNIVA|Async/Q] Generando datos desde consulta para modificación de registros de menu A.');

            $builderb=$db->table('sys_controlweb');
            $builderb->select('TITULO_CONW, TITULOPANT_CONW, ROBOTS_CONW, KEYWORD_CONW, DESCRIPCION_CONW');
            $builderb->where('CLAVE_CONW',$datosParaBuscar[1]);
            $builderb->where('ESTATUS_CONW','ACTI');
            $resultado1=$builderb->get();
            log_message('info','[MENUNIVA|Async/Q] Generando datos desde consulta para modificación de registros control web.');

            return [
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function actualizarDatosMenuNivelA($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
            ];
            $setActualizaMenu=[
                'CLASS_MENA'=>$datosParaActualizar[2],
                'REFEREN_MENA'=>$datosParaActualizar[3],
                'TITLE_MENA'=>$datosParaActualizar[4],
                'DESCRIP_MENA'=>ucwords(mb_strtolower($datosParaActualizar[5])),
                'CONTOPC_MENA'=>$datosParaActualizar[6],
                'ORDEN_MENA'=>str_pad($datosParaActualizar[7],3,'0',STR_PAD_LEFT),
                'IDMODIF_MENA'=>$datosParaActualizar[0],
                'FMODIF_MENA'=>date('Y-m-d-'),
            ];

            $setActualizaSeo=[
                'REFERENCIA_CONW'=>$datosParaActualizar[3],
                'TITULO_CONW'=>$datosParaActualizar[8],
                'TITULOPANT_CONW'=>$datosParaActualizar[9],
                'ROBOTS_CONW'=>$datosParaActualizar[10],
                'KEYWORD_CONW'=>$datosParaActualizar[11],
                'DESCRIPCION_CONW'=>$datosParaActualizar[12],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaActualizar[0],
            ];

            $db= \Config\Database::connect();
            $buildera=$db->table('sys_menuniva');
            $buildera->where('IDMENU_MENA',$datosParaActualizar[1]);
            $buildera->set($setActualizaMenu);
            $buildera->update($setActualizaMenu);
            log_message('notice','[MENUNIVA|Async/Q] {user} actualizo un registro {item} en menu nivel A.', $log_extra);

            $builderb=$db->table('sys_controlweb');
            $builderb->where('CLAVE_CONW',$datosParaActualizar[1]);
            $builderb->set($setActualizaSeo);
            $builderb->update($setActualizaSeo);
            log_message('notice','[MENUNIVA|Async/Q] {user} actualizo un registro {item} en control web.', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosMenuNivelA($datosParaEliminar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $db= \Config\Database::connect();
            $buildera=$db->table('sys_menuniva');
            $buildera->where('IDMENU_MENA',$datosParaEliminar[1]);
            $buildera->delete();
            log_message('notice','[MENUNIVA|Async/Q] {user} eliminó el codigo {item} de la estructura menu nivel A.',$log_extra);
            $builderb=$db->query('ALTER TABLE `sys_menuniva` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVA|Async/Q] Reindexando tabla tras eliminación.');

            $builderc=$db->table('sys_controlweb');
            $builderc->where('CLAVE_CONW',$datosParaEliminar[1]);
            $builderc->delete();
            log_message('notice','[MENUNIVA|Async/Q] {user} eliminó el codigo {item} de la estructura control web.',$log_extra);
            $builderd=$db->query('ALTER TABLE `sys_controlweb` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVA|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosTablaMenuB()
    {
        try {

            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, CLASS_MENA, TITLE_MENA, DESCRIP_MENA, REFEREN_MENA, CONTOPC_MENA, ORDEN_MENA, FMODIF_MENA');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->orderBy('ORDEN_MENA');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVB|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel a.');

            $dba= \Config\Database::connect();
            $buildera=$dba->table('sys_menunivb');
            $buildera->select("CONCAT(IDMENU_MENB,'_',IDSMENU_MENB) AS `idTablePk`, IDMENU_MENB, IDSMENU_MENB, CLASS_MENB, REFEREN_MENB, TITLE_MENB, DESCRIP_MENB, ORDEN_MENB, CONTOPC_MENB, FMODIF_MENB, COALESCE(COUNT(DISTINCT(IDSBMENU_MENC))) AS `TOTAL`");
            $buildera->join('sys_menunivc','IDSMENU_MENC=IDSMENU_MENB','left');
            $buildera->where('ESTATUS_MENB','ACTI');
            $buildera->orderBy('ORDEN_MENB','ASC');
            $buildera->groupBy('IDSMENU_MENB');
            log_message('info','[MENUNIVB|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel b.');
            $resultado1=$buildera->get();

            return array(
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
            );

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function buscarDuplicadosMenuB($datosParaGuardar)
    {
        try {
            log_message('info','[MENUNIVB|Async/Q] Buscando duplicidad en la tabla con parametros solicitados menu B.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivb');
            $builder->select('IDSMENU_MENB, DESCRIP_MENB, FMODIF_MENB');
            $builder->where('IDMENU_MENB',$datosParaGuardar[1]);
            $builder->where('IDSMENU_MENB',$datosParaGuardar[2]);
            $builder->where('ESTATUS_MENB','ACTI');
            $resultado=$builder->get();
            log_message('info','[MENUNIVB|Async/Q] Generando datos desde consulta para verificación de duplicados menu B.');

            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarDatosMenuNivelB($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[2],
            ];
            $setGuardarMenu=[
                'FECHCAPT_MENB'=>date('Y-m-d'),
                'HORACAPT_MENB'=>date('H:i:s'),
                'CAPTURA_MENB'=>$datosParaGuardar[0],
                'IDMENU_MENB'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'IDSMENU_MENB'=>ucwords(mb_strtoupper($datosParaGuardar[2])),
                'CLASS_MENB'=>$datosParaGuardar[3],
                'REFEREN_MENB'=>$datosParaGuardar[4],
                'TITLE_MENB'=>$datosParaGuardar[5],
                'DESCRIP_MENB'=>ucwords(mb_strtolower($datosParaGuardar[6])),
                'CONTOPC_MENB'=>$datosParaGuardar[7],
                'ORDEN_MENB'=>str_pad($datosParaGuardar[8],3,'0',STR_PAD_LEFT),
                'IDMODIF_MENB'=>$datosParaGuardar[0],
                'FMODIF_MENB'=>date('Y-m-d-'),
                'ESTATUS_MENB'=>'ACTI',
            ];

            $setGuardarSeo=[
                'FECHACAPT_CONW'=>date('Y-m-d'),
                'HORACAPT_CONW'=>date('H:i:s'),
                'CAPTURA_CONW'=>$datosParaGuardar[0],
                'CLAVE_CONW'=>ucwords(mb_strtoupper($datosParaGuardar[2])),
                'REFERENCIA_CONW'=>$datosParaGuardar[4],
                'TITULO_CONW'=>$datosParaGuardar[9],
                'TITULOPANT_CONW'=>$datosParaGuardar[10],
                'ROBOTS_CONW'=>$datosParaGuardar[11],
                'KEYWORD_CONW'=>$datosParaGuardar[12],
                'DESCRIPCION_CONW'=>$datosParaGuardar[13],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaGuardar[0],
                'ESTATUS_CONW'=>'ACTI',
            ];


            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivb');
            $builder->insert($setGuardarMenu);
            log_message('notice','[MENUNIVB|Async/Q] {user} creo un nuevo registro {item} en menu nivel B.', $log_extra);

            if($datosParaGuardar[7]=='NO'){
                $buildera=$db->table('sys_controlweb');
                $buildera->insert($setGuardarSeo);
                log_message('notice','[MENUNIVB|Async/Q] {user} creo un nuevo registro para control web con {item}.', $log_extra);
            }

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosMenuB($datosParaBuscar)
    {
        try {
            $parametroInput=explode('_', $datosParaBuscar[1]);
            $log_extra=[
                'user'=>$datosParaBuscar[0],
            ];
            log_message('info','[MENUNIVB|Async/Q] {user} Solicito busqueda de datos para modificar menu nivel B.', $log_extra);
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivb');
            $builder->select('IDMENU_MENB, IDSMENU_MENB, CLASS_MENB, REFEREN_MENB, TITLE_MENB, CONTOPC_MENB, ORDEN_MENB, DESCRIP_MENB');
            $builder->where('IDMENU_MENB',$parametroInput[0]);
            $builder->where('IDSMENU_MENB',$parametroInput[1]);
            $builder->where('ESTATUS_MENB','ACTI');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVB|Async/Q] Generando datos desde consulta para modificación de registros de menu B.');

            $builderb=$db->table('sys_controlweb');
            $builderb->select('TITULO_CONW, TITULOPANT_CONW, ROBOTS_CONW, KEYWORD_CONW, DESCRIPCION_CONW');
            $builderb->where('CLAVE_CONW',$parametroInput[1]);
            $builderb->where('ESTATUS_CONW','ACTI');
            $resultado1=$builderb->get();
            //print_r($builderb);
            log_message('info','[MENUNIVB|Async/Q] Generando datos desde consulta para modificación de registros control web.');

            return [
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function actualizarDatosMenuNivelB($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
                'item2'=>$datosParaActualizar[2],
            ];
            $setActualizaMenu=[
                'CLASS_MENB'=>$datosParaActualizar[3],
                'REFEREN_MENB'=>$datosParaActualizar[4],
                'TITLE_MENB'=>$datosParaActualizar[5],
                'DESCRIP_MENB'=>ucwords(mb_strtolower($datosParaActualizar[6])),
                'CONTOPC_MENB'=>$datosParaActualizar[7],
                'ORDEN_MENB'=>str_pad($datosParaActualizar[8],3,'0',STR_PAD_LEFT),
                'IDMODIF_MENB'=>$datosParaActualizar[0],
                'FMODIF_MENB'=>date('Y-m-d-'),
            ];

            $setActualizaSeo=[
                'REFERENCIA_CONW'=>$datosParaActualizar[4],
                'TITULO_CONW'=>$datosParaActualizar[9],
                'TITULOPANT_CONW'=>$datosParaActualizar[10],
                'ROBOTS_CONW'=>$datosParaActualizar[11],
                'KEYWORD_CONW'=>$datosParaActualizar[12],
                'DESCRIPCION_CONW'=>$datosParaActualizar[13],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaActualizar[0],
            ];

            $db= \Config\Database::connect();

            $builder=$db->table('sys_menunivb');
            $builder->where('IDMENU_MENB',$datosParaActualizar[1]);
            $builder->where('IDSMENU_MENB',$datosParaActualizar[2]);
            $builder->set($setActualizaMenu);
            $builder->update($setActualizaMenu);
            log_message('notice','[MENUNIVB|Async/Q] {user} actualizo un registro {item} {item2} en menu nivel B.', $log_extra);

            $builderb=$db->table('sys_controlweb');
            $builderb->where('CLAVE_CONW',$datosParaActualizar[2]);
            $builderb->set($setActualizaSeo);
            $builderb->update($setActualizaSeo);
            log_message('info','[MENUNIVB|Async/Q] {user} actualizo un registro {item} en control web.', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosMenuNivelB($datosParaEliminar)
    {
        try {
            $parametroInput=explode('_', $datosParaEliminar[1]);
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$parametroInput[0],
                'item2'=>$parametroInput[1],
            ];
            $db= \Config\Database::connect();
            $buildera=$db->table('sys_menunivb');
            $buildera->where('IDMENU_MENB',$parametroInput[0]);
            $buildera->where('IDSMENU_MENB',$parametroInput[1]);
            $buildera->delete();
            log_message('notice','[MENUNIVB|Async/Q] {user} eliminó el codigo {item} de la estructura menu B.',$log_extra);
            $builderb=$db->query('ALTER TABLE `sys_menunivb` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVB|Async/Q] Reindexando tabla tras eliminación.');

            $builderc=$db->table('sys_controlweb');
            $builderc->where('CLAVE_CONW',$parametroInput[1]);
            $builderc->delete();
            log_message('notice','[MENUNIVB|Async/Q] {user} eliminó el codigo {item} de la estructura control web.',$log_extra);
            $builderd=$db->query('ALTER TABLE `sys_controlweb` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVB|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosTablaMenuC()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, CLASS_MENA, TITLE_MENA, DESCRIP_MENA, REFEREN_MENA, CONTOPC_MENA, ORDEN_MENA');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->orderBy('ORDEN_MENA');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel a.');

            $buildera=$db->table('sys_menunivb');
            $buildera->select("IDMENU_MENB, IDSMENU_MENB, CLASS_MENB, REFEREN_MENB, TITLE_MENB, DESCRIP_MENB, ORDEN_MENB, CONTOPC_MENB");
            $buildera->where('ESTATUS_MENB','ACTI');
            $buildera->orderBy('ORDEN_MENB','ASC');
            $resultado1=$buildera->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel b.');

            $builderb=$db->table('sys_menunivc');
            $builderb->select("CONCAT(IDSMENU_MENC,'_',IDSBMENU_MENC) AS `idTablePk`, IDSMENU_MENC, IDSBMENU_MENC, CLASS_MENC, REFEREN_MENC, TITLE_MENC, DESCRIP_MENC, ORDEN_MENC, CONTOPC_MENC, FMODIF_MENC, COALESCE(COUNT(DISTINCT(IDSBMENUO_MEND))) AS `TOTAL`");
            $builderb->join('sys_menunivd','IDSBMENU_MEND=IDSBMENU_MENC','left');
            $builderb->where('ESTATUS_MENC','ACTI');
            $builderb->orderBy('ORDEN_MENC','ASC');
            $builderb->groupBy('IDSBMENU_MENC');
            $resultado2=$builderb->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel c.');

            return array(
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
                $resultado2->getResultArray(),
            );

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function buscarDuplicadosMenuC($datosParaGuardar)
    {
        try {
            log_message('info','[MENUNIVC|Async/Q] Buscando duplicidad en la tabla con parametros solicitados menu C.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivc');
            $builder->select('IDSBMENU_MENC, DESCRIP_MENC, FMODIF_MENC');
            $builder->where('IDSMENU_MENC',$datosParaGuardar[2]);
            $builder->where('IDSBMENU_MENC',$datosParaGuardar[3]);
            $builder->where('ESTATUS_MENC','ACTI');
            $resultado=$builder->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para verificación de duplicados menu C.');
            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarDatosMenuNivelC($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[2],
                'item2'=>$datosParaGuardar[3],
            ];
            $setGuardarMenu=[
                'FECHCAPT_MENC'=>date('Y-m-d'),
                'HORACAPT_MENC'=>date('H:i:s'),
                'CAPTURA_MENC'=>$datosParaGuardar[0],
                'IDSMENU_MENC'=>ucwords(mb_strtoupper($datosParaGuardar[2])),
                'IDSBMENU_MENC'=>ucwords(mb_strtoupper($datosParaGuardar[3])),
                'CLASS_MENC'=>$datosParaGuardar[4],
                'REFEREN_MENC'=>$datosParaGuardar[5],
                'TITLE_MENC'=>$datosParaGuardar[6],
                'DESCRIP_MENC'=>ucwords(mb_strtolower($datosParaGuardar[7])),
                'CONTOPC_MENC'=>$datosParaGuardar[8],
                'ORDEN_MENC'=>str_pad($datosParaGuardar[9],3,'0',STR_PAD_LEFT),
                'IDMODIF_MENC'=>$datosParaGuardar[0],
                'FMODIF_MENC'=>date('Y-m-d-'),
                'ESTATUS_MENC'=>'ACTI',
            ];

            $setGuardarSeo=[
                'FECHACAPT_CONW'=>date('Y-m-d'),
                'HORACAPT_CONW'=>date('H:i:s'),
                'CAPTURA_CONW'=>$datosParaGuardar[0],
                'CLAVE_CONW'=>ucwords(mb_strtoupper($datosParaGuardar[3])),
                'REFERENCIA_CONW'=>$datosParaGuardar[5],
                'TITULO_CONW'=>$datosParaGuardar[10],
                'TITULOPANT_CONW'=>$datosParaGuardar[11],
                'ROBOTS_CONW'=>$datosParaGuardar[12],
                'KEYWORD_CONW'=>$datosParaGuardar[13],
                'DESCRIPCION_CONW'=>$datosParaGuardar[14],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaGuardar[0],
                'ESTATUS_CONW'=>'ACTI',
            ];

            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivc');
            $builder->insert($setGuardarMenu);
            log_message('notice','[MENUNIVC|Async/Q] {user} Creo un nuevo registro en {item} de {item2} en menu nivel C.', $log_extra);

            if($datosParaGuardar[8]=='NO'){
                $buildera=$db->table('sys_controlweb');
                $buildera->insert($setGuardarSeo);
                log_message('notice','[MENUNIVC|Async/Q] {user} creo un nuevo registro para control web con {item}.', $log_extra);
            }

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosMenuC($datosParaBuscar)
    {
        try {
            $parametroInput=explode('_', $datosParaBuscar[1]);
            $log_extra=[
                'user'=>$datosParaBuscar[0],
            ];
            $db= \Config\Database::connect();
            log_message('info','[MENUNIVC|Async/Q] {user} Solicito busqueda de datos para modificar menu nivel C.', $log_extra);
            $builder=$db->table('sys_menunivc');
            $builder->select('IDSMENU_MENC, IDSBMENU_MENC, CLASS_MENC, REFEREN_MENC, TITLE_MENC, CONTOPC_MENC, ORDEN_MENC, DESCRIP_MENC');
            $builder->where('IDSMENU_MENC',$parametroInput[0]);
            $builder->where('IDSBMENU_MENC',$parametroInput[1]);
            $builder->where('ESTATUS_MENC','ACTI');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para modificación de registros de menu C.');

            $builderb=$db->table('sys_controlweb');
            $builderb->select('TITULO_CONW, TITULOPANT_CONW, ROBOTS_CONW, KEYWORD_CONW, DESCRIPCION_CONW');
            $builderb->where('CLAVE_CONW',$parametroInput[1]);
            $builderb->where('ESTATUS_CONW','ACTI');
            $resultado1=$builderb->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para modificación de registros control web.');

            return [
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function actualizarDatosMenuNivelC($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
                'item2'=>$datosParaActualizar[2],
            ];
            $setActualiza=[
                'CLASS_MENC'=>$datosParaActualizar[3],
                'REFEREN_MENC'=>$datosParaActualizar[4],
                'TITLE_MENC'=>$datosParaActualizar[5],
                'DESCRIP_MENC'=>ucwords(mb_strtolower($datosParaActualizar[6])),
                'CONTOPC_MENC'=>$datosParaActualizar[7],
                'ORDEN_MENC'=>str_pad($datosParaActualizar[8],3,'0',STR_PAD_LEFT),
                'IDMODIF_MENC'=>$datosParaActualizar[0],
                'FMODIF_MENC'=>date('Y-m-d-'),
            ];

            $setActualizaSeo=[
                'REFERENCIA_CONW'=>$datosParaActualizar[4],
                'TITULO_CONW'=>$datosParaActualizar[9],
                'TITULOPANT_CONW'=>$datosParaActualizar[10],
                'ROBOTS_CONW'=>$datosParaActualizar[11],
                'KEYWORD_CONW'=>$datosParaActualizar[12],
                'DESCRIPCION_CONW'=>$datosParaActualizar[13],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaActualizar[0],
            ];

            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivc');
            $builder->where('IDSMENU_MENC',$datosParaActualizar[1]);
            $builder->where('IDSBMENU_MENC',$datosParaActualizar[2]);
            $builder->set($setActualiza);
            $builder->update($setActualiza);
            log_message('notice','[MENUNIVC|Async/Q] {user} actualizo un registro {item} {item2} en menu nivel C.', $log_extra);

            $builderb=$db->table('sys_controlweb');
            $builderb->where('CLAVE_CONW',$datosParaActualizar[2]);
            $builderb->set($setActualizaSeo);
            $builderb->update($setActualizaSeo);
            log_message('info','[MENUNIVC|Async/Q] {user} actualizo un registro {item2} en control web.', $log_extra);
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosMenuNivelC($datosParaEliminar)
    {
        try {
            $parametroInput=explode('_', $datosParaEliminar[1]);
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$parametroInput[0],
                'item2'=>$parametroInput[1],
            ];
            $db= \Config\Database::connect();
            $buildera=$db->table('sys_menunivc');
            $buildera->where('IDSMENU_MENC',$parametroInput[0]);
            $buildera->where('IDSBMENU_MENC',$parametroInput[1]);
            $buildera->delete();
            log_message('notice','[MENUNIVC|Async/Q] {user} eliminó el codigo {item} de la base de datos menu B.',$log_extra);
            $builderb=$db->query('ALTER TABLE `sys_menunivc` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVC|Async/Q] Reindexando tabla tras eliminación.');

            $builderc=$db->table('sys_controlweb');
            $builderc->where('CLAVE_CONW',$parametroInput[1]);
            $builderc->delete();
            log_message('notice','[MENUNIVB|Async/Q] {user} eliminó el codigo {item} de la estructura control web.',$log_extra);
            $builderd=$db->query('ALTER TABLE `sys_controlweb` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVB|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosTablaMenuD()
    {
        try {
            $db= \Config\Database::connect();

            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, CLASS_MENA, TITLE_MENA, DESCRIP_MENA, REFEREN_MENA, CONTOPC_MENA, ORDEN_MENA');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->orderBy('ORDEN_MENA');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel a.');

            $buildera=$db->table('sys_menunivb');
            $buildera->select("IDMENU_MENB, IDSMENU_MENB, CLASS_MENB, REFEREN_MENB, TITLE_MENB, DESCRIP_MENB, ORDEN_MENB, CONTOPC_MENB");
            $buildera->where('ESTATUS_MENB','ACTI');
            $buildera->orderBy('ORDEN_MENB','ASC');
            $resultado1=$buildera->get();
            log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel b.');

            $builderb=$db->table('sys_menunivc');
            $builderb->select("IDSMENU_MENC, IDSBMENU_MENC, CLASS_MENC, REFEREN_MENC, TITLE_MENC, DESCRIP_MENC, ORDEN_MENC, CONTOPC_MENC");
            $builderb->join('sys_menunivd','IDSBMENU_MEND=IDSBMENU_MENC','left');
            $builderb->where('ESTATUS_MENC','ACTI');
            $builderb->orderBy('ORDEN_MENC','ASC');
            $builderb->groupBy('IDSBMENU_MENC');
            $resultado2=$builderb->get();
            log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel c.');

            $builderc=$db->table('sys_menunivd');
            $builderc->select("CONCAT(IDSBMENU_MEND,'_',IDSBMENUO_MEND) AS `idTablePk`, IDSBMENU_MEND, IDSBMENUO_MEND, CLASS_MEND, REFEREN_MEND, TITLE_MEND, DESCRIP_MEND, ORDEN_MEND, CONTOPC_MEND, FMODIF_MEND");
            $builderc->where('ESTATUS_MEND','ACTI');
            $builderc->orderBy('ORDEN_MEND','ASC');
            $builderc->groupBy('IDSBMENUO_MEND');
            $resultado3=$builderc->get();
            log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para renderizar tabla de menus nivel d.');

            return array(
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
                $resultado2->getResultArray(),
                $resultado3->getResultArray(),
            );

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function buscarDuplicadosMenuD($datosParaGuardar)
    {
        try {
            log_message('info','[MENUNIVD|Async/Q] Buscando duplicidad en la tabla con parametros solicitados menu D.');
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivd');
            $builder->select('IDSBMENUO_MEND, DESCRIP_MEND, FMODIF_MEND');
            $builder->where('IDSBMENU_MEND',$datosParaGuardar[2]);
            $builder->where('IDSBMENUO_MEND',$datosParaGuardar[3]);
            $builder->where('ESTATUS_MEND','ACTI');
            $resultado=$builder->get();
            return $resultado->getResultArray();
            log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para verificación de duplicados menu D.');

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarDatosMenuNivelD($datosParaGuardar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[3],
                'item2'=>$datosParaGuardar[4],
            ];
            $setGuardarMenu=[
                'FECHCAPT_MEND'=>date('Y-m-d'),
                'HORACAPT_MEND'=>date('H:i:s'),
                'CAPTURA_MEND'=>$datosParaGuardar[0],
                'IDSBMENU_MEND'=>ucwords(mb_strtoupper($datosParaGuardar[3])),
                'IDSBMENUO_MEND'=>ucwords(mb_strtoupper($datosParaGuardar[4])),
                'CLASS_MEND'=>$datosParaGuardar[5],
                'REFEREN_MEND'=>$datosParaGuardar[6],
                'TITLE_MEND'=>$datosParaGuardar[7],
                'DESCRIP_MEND'=>ucwords(mb_strtolower($datosParaGuardar[8])),
                'CONTOPC_MEND'=>$datosParaGuardar[9],
                'ORDEN_MEND'=>str_pad($datosParaGuardar[10],3,'0',STR_PAD_LEFT),
                'IDMODIF_MEND'=>$datosParaGuardar[0],
                'FMODIF_MEND'=>date('Y-m-d-'),
                'ESTATUS_MEND'=>'ACTI',
            ];

            $setGuardarSeo=[
                'FECHACAPT_CONW'=>date('Y-m-d'),
                'HORACAPT_CONW'=>date('H:i:s'),
                'CAPTURA_CONW'=>$datosParaGuardar[0],
                'CLAVE_CONW'=>ucwords(mb_strtoupper($datosParaGuardar[4])),
                'REFERENCIA_CONW'=>$datosParaGuardar[6],
                'TITULO_CONW'=>$datosParaGuardar[11],
                'TITULOPANT_CONW'=>$datosParaGuardar[12],
                'ROBOTS_CONW'=>$datosParaGuardar[13],
                'KEYWORD_CONW'=>$datosParaGuardar[14],
                'DESCRIPCION_CONW'=>$datosParaGuardar[15],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaGuardar[0],
                'ESTATUS_CONW'=>'ACTI',
            ];

            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivd');
            $builder->insert($setGuardarMenu);
            log_message('notice','[MENUNIVD|Async/Q] {user} Creo un nuevo registro en {item} de {item2} en menu nivel D.', $log_extra);

            if($datosParaGuardar[9]=='NO'){
                $buildera=$db->table('sys_controlweb');
                $buildera->insert($setGuardarSeo);
                log_message('notice','[MENUNIVD|Async/Q] {user} creo un nuevo registro para control web con {item2}.', $log_extra);
            }

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosMenuD($datosParaBuscar)
    {
        try {
            $parametroInput=explode('_', $datosParaBuscar[1]);
            $log_extra=[
                'user'=>$datosParaBuscar[0],
            ];
            log_message('info','[MENUNIVD|Async] {user} Solicito busqueda de datos para modificar menu nivel D.', $log_extra);
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivd');
            $builder->select('IDSBMENU_MEND, IDSBMENUO_MEND, CLASS_MEND, REFEREN_MEND, TITLE_MEND, CONTOPC_MEND, ORDEN_MEND, DESCRIP_MEND');
            $builder->where('IDSBMENU_MEND',$parametroInput[0]);
            $builder->where('IDSBMENUO_MEND',$parametroInput[1]);
            $builder->where('ESTATUS_MEND','ACTI');
            $resultado0=$builder->get();

            $builderb=$db->table('sys_controlweb');
            $builderb->select('TITULO_CONW, TITULOPANT_CONW, ROBOTS_CONW, KEYWORD_CONW, DESCRIPCION_CONW');
            $builderb->where('CLAVE_CONW',$parametroInput[1]);
            $builderb->where('ESTATUS_CONW','ACTI');
            $resultado1=$builderb->get();
            log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para modificación de registros control web.');

            return [
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function actualizarDatosMenuNivelD($datosParaActualizar)
    {
        try {
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[1],
                'item2'=>$datosParaActualizar[2],
            ];
            $setActualizaMenu=[
                'CLASS_MEND'=>$datosParaActualizar[3],
                'REFEREN_MEND'=>$datosParaActualizar[4],
                'TITLE_MEND'=>$datosParaActualizar[5],
                'DESCRIP_MEND'=>ucwords(mb_strtolower($datosParaActualizar[6])),
                'CONTOPC_MEND'=>$datosParaActualizar[7],
                'ORDEN_MEND'=>str_pad($datosParaActualizar[8],3,'0',STR_PAD_LEFT),
                'IDMODIF_MEND'=>$datosParaActualizar[0],
                'FMODIF_MEND'=>date('Y-m-d-'),
            ];

            $setActualizaSeo=[
                'REFERENCIA_CONW'=>$datosParaActualizar[4],
                'TITULO_CONW'=>$datosParaActualizar[9],
                'TITULOPANT_CONW'=>$datosParaActualizar[10],
                'ROBOTS_CONW'=>$datosParaActualizar[11],
                'KEYWORD_CONW'=>$datosParaActualizar[12],
                'DESCRIPCION_CONW'=>$datosParaActualizar[13],
                'FMODIF_CONW'=>date('Y-m-d'),
                'IDMODIF_CONW'=>$datosParaActualizar[0],
            ];

            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivd');
            $builder->where('IDSBMENU_MEND',$datosParaActualizar[1]);
            $builder->where('IDSBMENUO_MEND',$datosParaActualizar[2]);
            $builder->set($setActualizaMenu);
            $builder->update($setActualizaMenu);
            log_message('notice','[MENUNIVD|Async/Q] {user} Actualizo un registro {item} de {item2} en menu nivel D.', $log_extra);

            $builderb=$db->table('sys_controlweb');
            $builderb->where('CLAVE_CONW',$datosParaActualizar[2]);
            $builderb->set($setActualizaSeo);
            $builderb->update($setActualizaSeo);
            log_message('notice','[MENUNIVD|Async/Q] {user} actualizo un registro {item2} en control web.', $log_extra);
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosMenuNivelD($datosParaEliminar)
    {
        try {
            $parametroInput=explode('_', $datosParaEliminar[1]);
            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$parametroInput[0],
                'item2'=>$parametroInput[1],
            ];
            $db= \Config\Database::connect();
            $buildera=$db->table('sys_menunivd');
            $buildera->where('IDSBMENU_MEND',$parametroInput[0]);
            $buildera->where('IDSBMENUO_MEND',$parametroInput[1]);
            $buildera->delete();
            log_message('notice','[MENUNIVD|Async/Q] Usuario {user} eliminó el codigo {item} de {item2} de la base de datos menu D.',$log_extra);
            $builderb=$db->query('ALTER TABLE `sys_menunivd` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVD|Async/Q] Reindexando tabla tras eliminación.');

            $builderc=$db->table('sys_controlweb');
            $builderc->where('CLAVE_CONW',$parametroInput[1]);
            $builderc->delete();
            log_message('notice','[MENUNIVD|Async/Q] {user} eliminó el codigo {item} de la estructura control web.',$log_extra);
            $builderd=$db->query('ALTER TABLE `sys_controlweb` AUTO_INCREMENT = 1;');
            log_message('notice','[MENUNIVD|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }



    public function llenarDatosComboMenuA()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, DESCRIP_MENA');
            $builder->where('CONTOPC_MENA','SI');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->orderBy('ORDEN_MENA');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVA|Async/Q] Generando datos desde consulta para renderizado de combobox de menu A.');
            return $resultado0->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboMenuB($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivb');
            $builder->select('IDSMENU_MENB, DESCRIP_MENB');
            $builder->where('IDMENU_MENB',$id);
            $builder->where('CONTOPC_MENB','SI');
            $builder->where('ESTATUS_MENB','ACTI');
            $builder->orderBy('ORDEN_MENB');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[MENUNIVB|Async/Q] Generando datos desde consulta para renderizado de combobox de menu B.');
                return $resultado0->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboMenuC($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivc');
            $builder->select('IDSBMENU_MENC, DESCRIP_MENC');
            $builder->where('IDSMENU_MENC',$id);
            $builder->where('CONTOPC_MENC','SI');
            $builder->where('ESTATUS_MENC','ACTI');
            $builder->orderBy('ORDEN_MENC');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para renderizado de combobox de menu C.');
            return $resultado0->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboAMenuC()
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menuniva');
            $builder->select('IDMENU_MENA, DESCRIP_MENA');
            $builder->join('sys_menunivb','IDMENU_MENB=IDMENU_MENA');
            $builder->where('CONTOPC_MENA','SI');
            $builder->where('CONTOPC_MENB','SI');
            $builder->where('ESTATUS_MENA','ACTI');
            $builder->groupBy('IDMENU_MENA');
            $builder->orderBy('ORDEN_MENA');
            $resultado0=$builder->get();
            log_message('info','[MENUNIVC|Async/Q] Generando datos desde consulta para renderizado de combobox de menu A.');
            return $resultado0->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboBMenuD($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('sys_menunivb');
            $builder->select('IDSMENU_MENB, DESCRIP_MENB');
            $builder->join('sys_menunivc','IDSMENU_MENC=IDSMENU_MENB');
            $builder->where('IDMENU_MENB',$id);
            $builder->where('CONTOPC_MENB','SI');
            $builder->where('CONTOPC_MENC','SI');
            $builder->where('ESTATUS_MENB','ACTI');
            $builder->orderBy('ORDEN_MENB');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[MENUNIVD|Async/Q] Generando datos desde consulta para renderizado de combobox de menu B.');
                return $resultado0->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }


    public function buscarIconosInput($id)
    {
        try {
            $db= \Config\Database::connect();
            $builder=$db->table('cat_iconoscss');
            $builder->select('FONTCSS_ICONS');
            $builder->like('FONTCSS_ICONS',$id,'both');
            $builder->where('ESTATUS_ICONS','ACTI');
            $builder->limit(50);
            $resultado=$builder->get();

            return json_encode($resultado->getResultArray());

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }





}

 ?>
