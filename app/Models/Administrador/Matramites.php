<?php

namespace App\Models\Administrador;
use CodeIgniter\Model;

/**
 *
 */
class Matramites extends Model
{
    protected $dbBuild;

    function __construct()
    {
        $this->dbBuild = \Config\Database::connect();
    }

    public function llamandoDatosParametrosWeb($id)
    {
        $builder=$this->dbBuild->table('sys_controlweb');
        $builder->select('`TITULO_CONW`, `TITULOPANT_CONW`, `ROBOTS_CONW`, `KEYWORD_CONW`, `DESCRIPCION_CONW`, `REFERENCIA_CONW`');
        $builder->where('CLAVE_CONW',$id);
        $builder->where('ESTATUS_CONW','ACTI');
        $resultado=$builder->get();

        if($resultado->getNumRows()>0){
            log_message('info','[ATRAMITES] Envio de datos para renderizado de parametros web');
            return $resultado->getResultArray();
        }
    }

    public function llenarDatosTablaUsuariosContratosMes()
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(`CONTRATO_CCONT`,'_',`IDUSUA_CLIEN`) AS `idTablePk`, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CONTRATO_CCONT, DESCRIPCION_CONT, FECHACAP_CCONT");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->like('FECHACAP_CCONT',date('Y-m'),'after');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->orderBy('FMODIF_CCONT','DESC' );
            $builder->limit(30);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[REGUSUARIOS|Async/Q] Generando datos desde consulta para continuar renderizado de tabla usuarios');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function buscarDuplicadosUsuarios($datosParaGuardar)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("NOMBRE_CLIEN, APATERNO_CLIEN, AMATERNO_CLIEN");
            $builder->where('NOMBRE_CLIEN',$datosParaGuardar[1]);
            $builder->where('APATERNO_CLIEN',$datosParaGuardar[2]);
            $builder->where('AMATERNO_CLIEN',$datosParaGuardar[3]);
            $builder->where('CURP_CLIEN',mb_strtoupper($datosParaGuardar[6]));
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[REGUSUARIOS|Async/Q] Generando datos desde consulta para con valores duplicados');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function guardarDatosUsuarioNuevo($datosParaGuardar)
    {
        try {

            $acentuado = ['á','é','í','ó','ú'];
            $sinacento = ['a','e','i','o','ú'];
            $nombre=str_replace($acentuado,$sinacento,$datosParaGuardar[1]);
            $apaterno=str_replace($acentuado,$sinacento,$datosParaGuardar[2]);
            $amaterno=str_replace($acentuado,$sinacento,$datosParaGuardar[3]);
            $generaContrasena=substr($nombre, 0,4).substr($apaterno, 0,2).substr($amaterno, 0,2).'.'.date('ymd');

            if(empty($datosParaGuardar[8])){
                $idUsuarioAsignado=sha1(date('YmdHis'));
                $generaUsuario=substr($nombre, 0,4).substr($apaterno, 0,2).substr($amaterno, 0,2);
            }else{
                $idUsuarioAsignado=sha1($datosParaGuardar[9]);
                $generaUsuario=$datosParaGuardar[9];
            }
            log_message('info','[REGUSUARIOS|Async] Definiendo id de usuario y contraseña para asignar a usuario');

            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$idUsuarioAsignado
            ];
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->selectMax('(ID_CLIEN)+1','ID_CLIEN');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                foreach($resultado->getResultArray() as $filas){
                    $secuenciaOrden=$filas['ID_CLIEN'];
                }
                if($secuenciaOrden==''){
                    $secuenciaOrden=1;
                }
                log_message('info','[REGUSUARIOS|Async/Q] Obteniendo secuencia para asignar a {item}',$log_extra);
            }

            $setGuardarCLiente=[
                'FECHCAPT_CLIEN'=>date('Y-m-d'),
                'HORACAPT_CLIEN'=>date('H:i:s'),
                'CAPTURA_CLIEN'=>$datosParaGuardar[0],
                'IDUSUA_CLIEN'=>$idUsuarioAsignado,
                'CODBARR_CLIEN'=>date('Ymd').str_pad($secuenciaOrden, 6, '0', STR_PAD_LEFT),
                'ID_CLIEN'=>str_pad($secuenciaOrden, 8, '0', STR_PAD_LEFT),
                'NOMBRE_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[1])),
                'APATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'AMATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[3])),
                'NOMCOMP_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[1])).' '.ucwords(mb_strtolower($datosParaGuardar[2])).' '.ucwords(mb_strtolower($datosParaGuardar[3])),
                'FNACIM_CLIEN'=>$datosParaGuardar[4],
                'SEXO_CLIEN'=>$datosParaGuardar[5],
                'CURP_CLIEN'=>mb_strtoupper($datosParaGuardar[6]),
                'TELEFONO_CLIEN'=>$datosParaGuardar[7],
                'MOVIL_CLIEN'=>$datosParaGuardar[8],
                'EMAIL_CLIEN'=>base64_encode($datosParaGuardar[9]),
                'CAMPUS_CLIEN'=>'TELTI',
                'USUARIO_CLIEN'=>base64_encode(base64_encode($generaUsuario)),
                'PASSWORD_CLIEN'=>base64_encode(base64_encode(base64_encode($generaContrasena))),
                'AREA_CLIEN'=>'USUARIO',
                'PUESTO_CLIEN'=>'USUARIO',
                'NIVELPERF_CLIEN'=>'USUARIO',
                'PERFIL_CLIEN'=>'USUARIO',
                'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                'FMODIF_CLIEN'=>date('Y-m-d'),
                'ESTATUS_CLIEN'=>'ACTI',
            ];
            $builderb=$this->dbBuild->table('sys_clientes');
            $builderb->insert($setGuardarCLiente);
            log_message('notice','[REGUSUARIOS|Async/Q] {captur} creo un nuevo registro de cliente en el sistema continua proceso asignacion', $log_extra);

            $builderc=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderc->selectMax('(SECUENCIA_UBIC)+1','SECUENCIA_UBIC');
            $builderc->where('IDUSUA_UBIC', $idUsuarioAsignado);
            $builderc->where('ESTATUS_UBIC','ACTI');
            $resultado0=$builderc->get();
            if($resultado0->getNumRows()>0){
                foreach($resultado0->getResultArray() as $filas){
                    $secuenciaUbic=$filas['SECUENCIA_UBIC'];
                }
                if($secuenciaUbic==''){
                    $secuenciaUbic=1;
                }
                log_message('info','[REGUSUARIOS|Async/Q] Obteniendo secuencia de ubicaciones para {item}',$log_extra);
            }

            $setAgregaUbicaiones = [
                'FECHCAPT_UBIC'=>date('Y-m-d'),
                'HORACAPT_UBIC'=>date('H:i:s'),
                'CAPTURA_UBIC'=>$datosParaGuardar[0],
                'IDUSUA_UBIC'=>$idUsuarioAsignado,
                'IDUBIC_UBIC'=>$idUsuarioAsignado.str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'SECUENCIA_UBIC'=>str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'NOMBRE_UBIC'=>'Principal',
                'PAIS_UBIC'=>'MX',
                'ESTADO_UBIC'=>$datosParaGuardar[10],
                'MUNICIPIO_UBIC'=>$datosParaGuardar[11],
                'CODIPOSTAL_UBIC'=>$datosParaGuardar[12],
                'COLONIA_UBIC'=>$datosParaGuardar[13],
                'CALLE_UBIC'=>$datosParaGuardar[14],
                'NEXTE_UBIC'=>$datosParaGuardar[15],
                'NINTE_UBIC'=>$datosParaGuardar[16],
                'REFERENCIA_UBIC'=>$datosParaGuardar[17],
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'FMODIF_UBIC'=>date('Y-m-d'),
                'ESTATUS_UBIC'=>'ACTI',
            ];
            $builderd=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderd->insert($setAgregaUbicaiones);
            log_message('notice','[REGUSUARIOS|Async/Q] {captur} creo una ubicacion para el usuario en el sistema continua proceso asignacion', $log_extra);

            $buildere=$this->dbBuild->table('cat_calles');
            $buildere->select('CALLE_CALLE');
            $buildere->where('COLON_CALLE',$datosParaGuardar[13]);
            $buildere->where('CALLE_CALLE',$datosParaGuardar[14]);
            $buildere->where('ESTATUS_CALLE','ACTI');
            $resultado1=$buildere->get();
            if(!$resultado1->getNumRows()>0){

                $builderf=$this->dbBuild->table('cat_calles');
                $builderf->selectMax('(SECUENCIA_CALLE)+1','SECUENCIA_CALLE');
                $builderf->where('COLON_CALLE',$datosParaGuardar[13]);
                $builderf->where('ESTATUS_CALLE','ACTI');
                $resultado=$builderf->get();

                if($resultado->getNumRows()>0){
                    foreach($resultado->getResultArray() as $filas){
                        $secuenciaCalle=$filas['SECUENCIA_CALLE'];
                    }
                    if($secuenciaCalle==''){
                        $secuenciaCalle=1;
                    }
                    log_message('info','[REGUSUARIOS|Async/Q] Obteniendo secuencia para asignar a calle',$log_extra);
                }
                $setCalleNueva=[
                    'FECHACAP_CALLE'=>date('Y-m-d'),
                    'HORACAP_CALLE'=>date('H:i:s'),
                    'CAPTURA_CALLE'=>$datosParaGuardar[0],
                    'COLON_CALLE'=>$datosParaGuardar[13],
                    'SECUENCIA_CALLE'=>str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CLVCALLE_CALLE'=>$datosParaGuardar[13].str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CALLE_CALLE'=>$datosParaGuardar[14],
                    'IDMODIF_CALLE'=>$datosParaGuardar[0],
                    'FMODIF_CALLE'=>date('Y-m-d'),
                    'ESTATUS_CALLE'=>'ACTI',
                ];
                $builderg=$this->dbBuild->table('cat_calles');
                $builderg->insert($setCalleNueva);
                log_message('notice','[REGUSUARIOS|Async/Q] Agregando nueva calle al sistema');

            }

            $builderh=$this->dbBuild->table('sys_clientes');
            $builderh->select("IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, IDUBIC_UBIC");
            $builderh->join('sys_clientes_ubicaciones','IDUSUA_UBIC=IDUSUA_CLIEN');
            $builderh->where('IDUSUA_CLIEN', $idUsuarioAsignado);
            $builderh->where('ESTATUS_CLIEN','ACTI');
            $resultado2=$builderh->get();
            if($resultado2->getNumRows()>0){
                return $resultado2->getResultArray();
                log_message('info','[REGUSUARIOS|Async/Q] Generando datos desde consulta para continuar asignación de contrato');
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function asignarDatosContratoUsuario($datosParaGuardar)
    {
        try {
            $idAsigContrato=date('YmdHis');
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
                'item2'=>$idAsigContrato,
            ];

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select('ID_CLIEN');
            $builder->where('IDUSUA_CLIEN',$datosParaGuardar[1]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                foreach($resultado->getResultArray() as $filas){
                    $secuenciaOrden=$filas['ID_CLIEN'];
                }
                log_message('info','[REGUSUARIOS|Async/Q] Obteniendo secuencia para asignar contrato de {item}',$log_extra);
            }

            $setGuardarContraro=[
                'FECHACAP_CCONT'=>date('Y-m-d'),
                'HORACAP_CCONT'=>date('H:i:s'),
                'CAPTURA_CCONT'=>$datosParaGuardar[0],
                'CLIENTE_CCONT'=>$datosParaGuardar[1],
                'UBICA_CCONT'=>$datosParaGuardar[2],
                'CONTRATO_CCONT'=>$idAsigContrato,
                'CONSECUTIVO_CCONT'=>str_pad($secuenciaOrden,6,'0', STR_PAD_LEFT),
                'TIPO_CCONT'=>$datosParaGuardar[3],
                'MODO_CCONT'=>$datosParaGuardar[6],
                'PERMISO_CCONT'=>$datosParaGuardar[4],
                'DESCUENTO_CCONT'=>$datosParaGuardar[5],
                'COMENTS_CCONT'=>$datosParaGuardar[7],
                'IDMODIF_CCONT'=>$datosParaGuardar[0],
                'FMODIF_CCONT'=>date('Y-m-d'),
                'ESTATUS_CCONT'=>'ACTI',
            ];
            $buildera=$this->dbBuild->table('sys_clientes_contratos');
            $buildera->insert($setGuardarContraro);
            log_message('notice','[REGUSUARIOS|Async/Q] {captur} asigno un nuevo contrato al cliente en el sistema continua cargos de expedicion', $log_extra);

            $builderb=$this->dbBuild->table('cat_contratosExpedicion');
            $builderb->select('CLAVE_CEXP, COSTO_CEXP');
            $builderb->where('CLAVE_CEXP', $datosParaGuardar[6]);
            $builderb->where('ESTATUS_CEXP','ACTI');
            $resultado0=$builderb->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[REGUSUARIOS|Async/Q] Generando datos para aplicar el costo de expedicion contrato');
                foreach($resultado0->getResultArray() as $filas){
                    $codigo=$filas['CLAVE_CEXP'];
                    $costo=$filas['COSTO_CEXP'];
                }
            }
            $setCrearCargos=[
                'FECHACAP_DETA'=>date('Y-m-d'),
                'HORACAP_DETA'=>date('H:i:s'),
                'CAPTURA_DETA'=>$datosParaGuardar[0],
                'USUARIO_DETA'=>$datosParaGuardar[1],
                'CONTRATO_DETA'=>$idAsigContrato,
                'CODIGO_DETA'=>$codigo,
                'CANTIDAD_DETA'=>'1',
                'COSTO_DETA'=>$costo,
                'TOTAL_DETA'=>$costo,
                'IDMODIF_DETA'=>$datosParaGuardar[0],
                'FMODIF_DETA'=>date('Y-m-d'),
                'ESTATUS_DETA'=>'ADEU',
            ];
            $builderc=$this->dbBuild->table('sys_clientes_detalles');
            $builderc->insert($setCrearCargos);
            log_message('notice','[REGUSUARIOS|Async/Q] {captur} agrego un concepto de expedicion a la cuenta de {item2}', $log_extra);

            if($datosParaGuardar[5]='TARNOR'){
                log_message('info','[REGUSUARIOS|Async] Comprobar que exista el concepto de mes corriente para {item2} tarifa normal', $log_extra);
                $builderd=$this->dbBuild->table('sys_clientes_detalles');
                $builderd->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderd->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderd->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderd->where('CONTRATO_DETA', $idAsigContrato);
                $builderd->like('CODIGO_DETA', date('Ym').'CSA');
                $builderd->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderd->groupBy('CODIGO_DETA');
                $resultado=$builderd->get();
                if(!$resultado->getNumRows()>0){
                    log_message('info','[REGUSUARIOS|Async/Q] Aplicando mes corriente en los registros de {item2}', $log_extra);
                    $buildere=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles(
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        )
                        SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idAsigContrato."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSA' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('info','[REGUSUARIOS|Async/Q] Creando mes corriente para pagar de {item2}', $log_extra);
                    return true;
                }

            }elseif ($datosParaGuardar[5]='TARMAY') {
                log_message('info','[REGUSUARIOS|Async] Comprobar que exista el concepto de mes corriente para {item2} tarifa adulto', $log_extra);
                $builderd=$this->dbBuild->table('sys_clientes_detalles');
                $builderd->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderd->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderd->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderd->where('CONTRATO_DETA', $idAsigContrato);
                $builderd->like('CODIGO_DETA', date('Ym').'CSAD');
                $builderd->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderd->groupBy('CODIGO_DETA');
                $resultado=$builderd->get();
                if(!$resultado->getNumRows()>0){
                    log_message('info','[REGUSUARIOS|Async/Q] Aplicando mes corriente en los registros de {item2}', $log_extra);
                    $buildere=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles(
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        )
                        SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idAsigContrato."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSAD' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('info','[REGUSUARIOS|Async/Q] Creando mes corriente para pagar de {item2}', $log_extra);
                    return true;
                }
            }elseif ($datosParaGuardar[5]='TARNEG') {
                log_message('info','[REGUSUARIOS|Async] Comprobar que exista el concepto de mes corriente para {item2} tarifa negocios', $log_extra);
                $builderd=$this->dbBuild->table('sys_clientes_detalles');
                $builderd->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderd->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderd->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderd->where('CONTRATO_DETA', $idAsigContrato);
                $builderd->like('CODIGO_DETA', date('Ym').'CSAN');
                $builderd->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderd->groupBy('CODIGO_DETA');
                $resultado=$builderd->get();
                if(!$resultado->getNumRows()>0){
                    log_message('info','[REGUSUARIOS|Async/Q] Aplicando mes corriente en los registros de {item2}', $log_extra);
                    $buildere=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles(
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        )
                        SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idAsigContrato."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSAN' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('info','[REGUSUARIOS|Async/Q] Creando mes corriente para pagar de {item2}', $log_extra);
                    return true;
                }
            }elseif ($datosParaGuardar[5]='TARESP') {
                log_message('info','[REGUSUARIOS|Async] Comprobar que exista el concepto de mes corriente para {item2} tarifa especial', $log_extra);
                $builderd=$this->dbBuild->table('sys_clientes_detalles');
                $builderd->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderd->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderd->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderd->where('CONTRATO_DETA', $idAsigContrato);
                $builderd->like('CODIGO_DETA', date('Ym').'CSAE');
                $builderd->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderd->groupBy('CODIGO_DETA');
                $resultado=$builderd->get();
                if(!$resultado->getNumRows()>0){
                    log_message('info','[REGUSUARIOS|Async/Q] Aplicando mes corriente en los registros de {item2}', $log_extra);
                    $buildere=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles(
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        )
                        SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idAsigContrato."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSAE' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('info','[REGUSUARIOS|Async/Q] Creando mes corriente para pagar de {item2}', $log_extra);
                    return true;
                }

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cargarDatosContratosUsuarios($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, NOMBRE_CLIEN, APATERNO_CLIEN, AMATERNO_CLIEN, EMAIL_CLIEN,
            FNACIM_CLIEN, SEXO_CLIEN, CURP_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN, ESTADO_UBIC, MUNICIPIO_UBIC,
            CODIPOSTAL_UBIC, COLONIA_UBIC, CALLE_UBIC, NEXTE_UBIC, NINTE_UBIC, REFERENCIA_UBIC, IDUBIC_UBIC");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->where('IDUSUA_CLIEN',$parametro[1]);
            $builder->where('CONTRATO_CCONT',$parametro[0]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[REGUSUARIOS|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function actualizarDatosRegistroUsuario($datosParaGuardar)
    {
        $log_extra=[
            'captur'=>$datosParaGuardar[0],
        ];
        $setActualizaCliente=[
            'NOMBRE_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[3])),
            'APATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[4])),
            'AMATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[5])),
            'NOMCOMP_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[3])).' '.ucwords(mb_strtolower($datosParaGuardar[4])).' '.ucwords(mb_strtolower($datosParaGuardar[5])),
            'FNACIM_CLIEN'=>$datosParaGuardar[6],
            'SEXO_CLIEN'=>$datosParaGuardar[7],
            'CURP_CLIEN'=>mb_strtoupper($datosParaGuardar[8]),
            'TELEFONO_CLIEN'=>$datosParaGuardar[9],
            'MOVIL_CLIEN'=>$datosParaGuardar[10],
            'EMAIL_CLIEN'=>base64_encode($datosParaGuardar[11]),
            'CAMPUS_CLIEN'=>'TELTI',
            'IDMODIF_CLIEN'=>$datosParaGuardar[0],
            'FMODIF_CLIEN'=>date('Y-m-d'),
            'NIVELPERF_CLIEN'=>'USUARIO',
            'PERFIL_CLIEN'=>'USUARIO',
        ];
        $builderc=$this->dbBuild->table('sys_clientes');
        $builderc->where('IDUSUA_CLIEN',$datosParaGuardar[1]);
        $builderc->set($setActualizaCliente);
        $builderc->update($setActualizaCliente);
        log_message('info','[REGUSUARIOS|Async/Q] {captur} actualizo un registro de cliente en el sistema continua proceso', $log_extra);

        $setActualizaUbica=[
            'ESTADO_UBIC'=>$datosParaGuardar[12],
            'MUNICIPIO_UBIC'=>$datosParaGuardar[13],
            'CODIPOSTAL_UBIC'=>$datosParaGuardar[14],
            'COLONIA_UBIC'=>$datosParaGuardar[15],
            'CALLE_UBIC'=>$datosParaGuardar[16],
            'NEXTE_UBIC'=>$datosParaGuardar[17],
            'NINTE_UBIC'=>$datosParaGuardar[18],
            'REFERENCIA_UBIC'=>$datosParaGuardar[19],
            'IDMODIF_UBIC'=>$datosParaGuardar[0],
            'FMODIF_UBIC'=>date('Y-m-d'),
        ];
        $builderd=$this->dbBuild->table('sys_clientes_ubicaciones');
        $builderd->where('IDUSUA_UBIC',$datosParaGuardar[1]);
        $builderd->where('IDUBIC_UBIC',$datosParaGuardar[2]);
        $builderd->set($setActualizaUbica);
        $builderd->update($setActualizaUbica);
        log_message('info','[REGUSUARIOS|Async/Q] {captur} actualizo datos de ubicación del cliente en el sistema continua proceso', $log_extra);

        return true;
    }

    public function llenarDatosTablaUsuarioModificar($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN) AS idTablePk, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,
            NOMBRE_ESTA,NOMBRE_MUNIC,CODIPOST_CODPOS,COLONIA_COLON,CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES");
            $builder->join('sys_clientes_ubicaciones','IDUSUA_UBIC=IDUSUA_CLIEN');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->where('IDUSUA_CLIEN',$id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[MODUSUARIOS|Async/Q] Generando datos desde consulta para continuar tabla de usuario');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cargarDatosUsuarioModificar($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, NOMBRE_CLIEN, APATERNO_CLIEN, AMATERNO_CLIEN, EMAIL_CLIEN,
            FNACIM_CLIEN, SEXO_CLIEN, CURP_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN");
            $builder->where('IDUSUA_CLIEN', $id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[MODUSUARIOS|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosUsuarioInformacion($datosParaGuardar)
    {
        try {
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
            ];
            $setActualizaCliente=[
                'NOMBRE_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'APATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[3])),
                'AMATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[4])),
                'NOMCOMP_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[2])).' '.ucwords(mb_strtolower($datosParaGuardar[3])).' '.ucwords(mb_strtolower($datosParaGuardar[4])),
                'FNACIM_CLIEN'=>$datosParaGuardar[5],
                'SEXO_CLIEN'=>$datosParaGuardar[6],
                'CURP_CLIEN'=>mb_strtoupper($datosParaGuardar[7]),
                'TELEFONO_CLIEN'=>$datosParaGuardar[8],
                'MOVIL_CLIEN'=>$datosParaGuardar[9],
                'EMAIL_CLIEN'=>base64_encode($datosParaGuardar[10]),
                'AREA_CLIEN'=>'USUARIO',
                'PUESTO_CLIEN'=>'USUARIO',
                'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                'FMODIF_CLIEN'=>date('Y-m-d'),
            ];
            $builderc=$this->dbBuild->table('sys_clientes');
            $builderc->where('IDUSUA_CLIEN',$datosParaGuardar[1]);
            $builderc->set($setActualizaCliente);
            $builderc->update($setActualizaCliente);
            log_message('info','[MODUSUARIOS|Async/Q] {captur} actualizo un registro de cliente en el sistema continua proceso', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaUsuariosAsignado($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("`IDUSUA_CLIEN` AS `idTablePk`, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, FMODIF_CLIEN, COALESCE(COUNT(DISTINCT(CONTRATO_CCONT))) AS `TOTAL`");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN','left');
            $builder->where('IDUSUA_CLIEN',$id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $builder->limit(30);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AGRCONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla usuarios');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cargaDatosUsuarioAsignar($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, EMAIL_CLIEN,
            TELEFONO_CLIEN, MOVIL_CLIEN");
            $builder->where('IDUSUA_CLIEN', $id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ASIGCONTRATOS|Async/Q] Generando datos desde consulta para continuar renderizado de tabla usuarios');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function asignarDatosNuevoContrato($datosParaGuardar)
    {
        try {
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[1],
                'item2'=>$datosParaGuardar[11],
            ];
    
            $idContratoGenerate=date('YmdHis');
            $buildera=$this->dbBuild->table('sys_clientes_ubicaciones');
            $buildera->selectMax('(SECUENCIA_UBIC)+1','SECUENCIA_UBIC');
            $buildera->where('IDUSUA_UBIC', $datosParaGuardar[1]);
            $buildera->where('ESTATUS_UBIC','ACTI');
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[AGRCONTRATO|Async/Q] Obteniendo secuencia para asignar a {item}',$log_extra);
                foreach($resultado0->getResultArray() as $filas){
                    $secuenciaUbic=$filas['SECUENCIA_UBIC'];
                }
            }else{
                $secuenciaUbic=1;
            }
    
            $setAgregaUbicaiones = [
                'FECHCAPT_UBIC'=>date('Y-m-d'),
                'HORACAPT_UBIC'=>date('H:i:s'),
                'CAPTURA_UBIC'=>$datosParaGuardar[0],
                'IDUSUA_UBIC'=>$datosParaGuardar[1],
                'IDUBIC_UBIC'=>$datosParaGuardar[1].str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'SECUENCIA_UBIC'=>str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'NOMBRE_UBIC'=>'extra'.str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'PAIS_UBIC'=>'MX',
                'ESTADO_UBIC'=>$datosParaGuardar[2],
                'MUNICIPIO_UBIC'=>$datosParaGuardar[3],
                'CODIPOSTAL_UBIC'=>$datosParaGuardar[4],
                'COLONIA_UBIC'=>$datosParaGuardar[5],
                'CALLE_UBIC'=>$datosParaGuardar[6],
                'NEXTE_UBIC'=>$datosParaGuardar[7],
                'NINTE_UBIC'=>$datosParaGuardar[8],
                'REFERENCIA_UBIC'=>$datosParaGuardar[9],
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'FMODIF_UBIC'=>date('Y-m-d'),
                'ESTATUS_UBIC'=>'ACTI',
            ];
            $builderb=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderb->insert($setAgregaUbicaiones);
            log_message('notice','[AGRCONTRATO|Async/Q] {captur} creo una ubicacion para el usuario en el sistema continua proceso asignacion', $log_extra);
    
            $builderc=$this->dbBuild->table('cat_calles');
            $builderc->select('CALLE_CALLE');
            $builderc->where('COLON_CALLE',$datosParaGuardar[5]);
            $builderc->where('CALLE_CALLE',$datosParaGuardar[6]);
            $builderc->where('ESTATUS_CALLE','ACTI');
            $resultado1=$builderc->get();
            if(!$resultado1->getNumRows()>0){
                $builderd=$this->dbBuild->table('cat_calles');
                $builderd->selectMax('(SECUENCIA_CALLE)+1','SECUENCIA_CALLE');
                $builderd->where('COLON_CALLE',$datosParaGuardar[5]);
                $builderd->where('ESTATUS_CALLE','ACTI');
                $resultado=$builderd->get();

                if($resultado->getNumRows()>0){
                    foreach($resultado->getResultArray() as $filas){
                        $secuenciaCalle=$filas['SECUENCIA_CALLE'];
                    }
                    if($secuenciaCalle==''){
                        $secuenciaCalle=1;
                    }
                    log_message('info','[AGRCONTRATO|Async/Q] Obteniendo secuencia para asignar a calle',$log_extra);
                }

                $setCalleNueva=[
                    'FECHACAP_CALLE'=>date('Y-m-d'),
                    'HORACAP_CALLE'=>date('H:i:s'),
                    'CAPTURA_CALLE'=>$datosParaGuardar[0],
                    'COLON_CALLE'=>$datosParaGuardar[5],
                    'SECUENCIA_CALLE'=>str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CLVCALLE_CALLE'=>$datosParaGuardar[5].str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CALLE_CALLE'=>$datosParaGuardar[6],
                    'IDMODIF_CALLE'=>$datosParaGuardar[0],
                    'FMODIF_CALLE'=>date('Y-m-d'),
                    'ESTATUS_CALLE'=>'ACTI',
                ];
                $buildere=$this->dbBuild->table('cat_calles');
                $buildere->insert($setCalleNueva);
                log_message('notice','[AGRCONTRATO|Async/Q] Agregando nueva calle al sistema');
    
            }
    
            $setCrearContrato = [
                'FECHACAP_CCONT'=>date('Y-m-d'),
                'HORACAP_CCONT'=>date('H:i:s'),
                'CAPTURA_CCONT'=>$datosParaGuardar[0],
                'CLIENTE_CCONT'=>$datosParaGuardar[1],
                'UBICA_CCONT'=>$datosParaGuardar[1].str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'CONTRATO_CCONT'=>$idContratoGenerate,
                'TIPO_CCONT'=>$datosParaGuardar[10],
                'MODO_CCONT'=>$datosParaGuardar[11],
                'DESCUENTO_CCONT'=>$datosParaGuardar[12],
                'PERMISO_CCONT'=>$datosParaGuardar[13],
                'COMENTS_CCONT'=>$datosParaGuardar[14],
                'IDMODIF_CCONT'=>$datosParaGuardar[0],
                'FMODIF_CCONT'=>date('Y-m-d'),
                'ESTATUS_CCONT'=>'ACTI',
            ];
            $builderf=$this->dbBuild->table('sys_clientes_contratos');
            $builderf->insert($setCrearContrato);
            log_message('notice','[AGRCONTRATO|Async/Q] {captur} asigno un contrato nuevo a {item}', $log_extra);
    
            $builderg=$this->dbBuild->table('cat_conceptos');
            $builderg->select('CLAVE_CONC, COSTO_CONC');
            $builderg->where('CLAVE_CONC', $datosParaGuardar[11]);
            $builderg->where('ESTATUS_CONC','ACTI');
            $resultado2=$builderg->get();
            if($resultado2->getNumRows()>0){
                log_message('info','[AGRCONTRATO|Async/Q] Generando datos para aplicar el costo del concepto agregado');
                foreach($resultado2->getResultArray() as $filas){
                    $codigo=$filas['CLAVE_CONC'];
                    $costo=$filas['COSTO_CONC'];
                }
                $setCrearCargos=[
                    'FECHACAP_DETA'=>date('Y-m-d'),
                    'HORACAP_DETA'=>date('H:i:s'),
                    'CAPTURA_DETA'=>$datosParaGuardar[0],
                    'USUARIO_DETA'=>$datosParaGuardar[1],
                    'CONTRATO_DETA'=>$idContratoGenerate,
                    'CODIGO_DETA'=>$codigo,
                    'CANTIDAD_DETA'=>'1',
                    'COSTO_DETA'=>$costo,
                    'TOTAL_DETA'=>$costo,
                    'IDMODIF_DETA'=>$datosParaGuardar[0],
                    'FMODIF_DETA'=>date('Y-m-d'),
                    'ESTATUS_DETA'=>'ADEU',
                ];
                $builderg=$this->dbBuild->table('sys_clientes_detalles');
                $builderg->insert($setCrearCargos);
                log_message('notice','[AGRCONTRATO|Async/Q] {captur} agrego un concepto {item2} al detalle de {item}', $log_extra);
            }
            
            if($datosParaGuardar[12]='TARNOM'){
                log_message('info','[ASIGCONTRATOS|Async] Comprobar que exista el concepto de mes corriente para {item}', $log_extra);
                $builderh=$this->dbBuild->table('sys_clientes_detalles');
                $builderh->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderh->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderh->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderh->where('CONTRATO_DETA', $idContratoGenerate);
                $builderh->like('CODIGO_DETA', date('Ym').'CSA');
                $builderh->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderh->groupBy('CODIGO_DETA');
                $resultado3=$builderh->get();
                if(!$resultado3->getNumRows()>0){
                    log_message('info','[ASIGCONTRATOS|Async/Q] No existe mes corriente aplicando al detalle de {item}', $log_extra);
                    $builderi=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles (
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        ) SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idContratoGenerate."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSA' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('notice','[ASIGCONTRATOS|Async/Q] Creando mes corriente para pagar de {item}', $log_extra);
        
                }
                    
            }else if($datosParaGuardar[12]='TARMAY'){
                log_message('info','[ASIGCONTRATOS|Async] Comprobar que exista el concepto de mes corriente para {item}', $log_extra);
                $builderh=$this->dbBuild->table('sys_clientes_detalles');
                $builderh->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderh->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderh->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderh->where('CONTRATO_DETA', $idContratoGenerate);
                $builderh->like('CODIGO_DETA', date('Ym').'CSAD');
                $builderh->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderh->groupBy('CODIGO_DETA');
                $resultado3=$builderh->get();
                if(!$resultado3->getNumRows()>0){
                    log_message('info','[ASIGCONTRATOS|Async/Q] No existe mes corriente aplicando al detalle de {item}', $log_extra);
                    $builderi=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles (
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        ) SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idContratoGenerate."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSAD' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('notice','[ASIGCONTRATOS|Async/Q] Creando mes corriente para pagar de {item}', $log_extra);
        
                }

            }else if($datosParaGuardar[12]='TARNEG'){
                log_message('info','[ASIGCONTRATOS|Async] Comprobar que exista el concepto de mes corriente para {item}', $log_extra);
                $builderh=$this->dbBuild->table('sys_clientes_detalles');
                $builderh->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderh->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderh->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderh->where('CONTRATO_DETA', $idContratoGenerate);
                $builderh->like('CODIGO_DETA', date('Ym').'CSAN');
                $builderh->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderh->groupBy('CODIGO_DETA');
                $resultado3=$builderh->get();
                if(!$resultado3->getNumRows()>0){
                    log_message('info','[ASIGCONTRATOS|Async/Q] No existe mes corriente aplicando al detalle de {item}', $log_extra);
                    $builderi=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalles (
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        ) SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idContratoGenerate."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSAN' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('notice','[ASIGCONTRATOS|Async/Q] Creando mes corriente para pagar de {item}', $log_extra);
        
                }

            }else if($datosParaGuardar[12]='TARESP'){
                log_message('info','[ASIGCONTRATOS|Async] Comprobar que exista el concepto de mes corriente para {item}', $log_extra);
                $builderh=$this->dbBuild->table('sys_clientes_detalles');
                $builderh->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
                $builderh->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
                $builderh->where('USUARIO_DETA', $datosParaGuardar[1]);
                $builderh->where('CONTRATO_DETA', $idContratoGenerate);
                $builderh->like('CODIGO_DETA', date('Ym').'CSAE');
                $builderh->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
                $builderh->groupBy('CODIGO_DETA');
                $resultado3=$builderh->get();
                if(!$resultado3->getNumRows()>0){
                    log_message('info','[ASIGCONTRATOS|Async/Q] No existe mes corriente aplicando al detalle de {item}', $log_extra);
                    $builderi=$this->dbBuild->query("
                        INSERT INTO sys_clientes_detalless(
                            `FECHACAP_DETA`,
                            `HORACAP_DETA`,
                            `CAPTURA_DETA`,
                            `USUARIO_DETA`,
                            `CONTRATO_DETA`,
                            `CODIGO_DETA`,
                            `CANTIDAD_DETA`,
                            `COSTO_DETA`,
                            `TOTAL_DETA`,
                            `IDMODIF_DETA`,
                            `FMODIF_DETA`,
                            `ESTATUS_DETA`
                        ) SELECT
                            curdate(),
                            curtime(),
                            '".$datosParaGuardar[0]."',
                            '".$datosParaGuardar[1]."',
                            '".$idContratoGenerate."',
                            CLAVE_CONC,
                            '1',
                            COSTO_CONC,
                            COSTO_CONC,
                            '".$datosParaGuardar[0]."',
                            curdate(),
                            'ADEU'
                        FROM cat_conceptos
                        WHERE
                        CLAVE_CONC like '".date('Ym')."CSAE' AND
                        ESTATUS_CONC='ACTI'
                    ");
                    log_message('notice','[ASIGCONTRATOS|Async/Q] Creando mes corriente para pagar de {item}', $log_extra);
        
                }
        
            }

            $builderj=$this->dbBuild->table('sys_clientes_contratos');
            $builderj->select("CONCAT(CLIENTE_CCONT,'_',CONTRATO_CCONT) AS IDCONTRAUSER");
            $builderj->where('CONTRATO_CCONT',$idContratoGenerate);
            $builderj->where('ESTATUS_CCONT','ACTI');
            $resultado4=$builderj->get();
            if($resultado4->getNumRows()>0){
                log_message('info','[ASIGCONTRATOS|Async/Q] Generando información de contrato {item}', $log_extra);
                return $resultado4->getResultArray();
            }
            
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function cargarDatosUsuarioContratos($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->where('IDUSUA_CLIEN',$id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AGRCONTRATOS|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                $usuario=$resultado->getResultArray();

            }

            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("CONCAT(CONTRATO_CCONT,'_',IDUSUA_CLIEN) AS IDCONTRAUSER,NOMBRE_ESTA,NOMBRE_MUNIC,CODIPOST_CODPOS,COLONIA_COLON,
             CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,CONTRATO_CCONT,DESCRIPCION_CONT,PERMISO_CCONT");
            $buildera->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $buildera->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $buildera->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $buildera->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $buildera->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $buildera->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $buildera->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $buildera->where('IDUSUA_CLIEN',$id);
            $buildera->where('ESTATUS_CLIEN','ACTI');
            $buildera->groupBy('CONTRATO_CCONT');
            $resultado1=$buildera->get();
            if($resultado1->getNumRows()>0){
                log_message('info','[AGRCONTRATOS|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                $contratos=$resultado1->getResultArray();

            }

            return [
                $usuario,
                $contratos,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosTablaContratoModificar($id)
    {
        try {
            $parametro = explode('_', $id);
            $builder=$this->dbBuild->table('sys_clientes_contratos');
            $builder->select("CLIENTE_CCONT, CONTRATO_CCONT, TIPO_CCONT, MODO_CCONT, PERMISO_CCONT, DESCUENTO_CCONT, COMENTS_CCONT,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->join('sys_clientes','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->where('CLIENTE_CCONT',$parametro[0]);
            $builder->where('CONTRATO_CCONT',$parametro[1]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->limit(30);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[MODCONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla contratos');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosContratoDetalle($datosParaGuardar)
    {
        try {
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
            ];

            $idTramite=date('YmdHis');
            $buildera=$this->dbBuild->table('sys_clientes_contratosModificado');
            $buildera->selectMax('(CONSECUTIVO_CMODIF)+1','CONSECUTIVO_CMODIF');
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[MODCONTRATO|Async/Q] Obteniendo secuencia para asignar a {item}',$log_extra);
                foreach($resultado0->getResultArray() as $filas){
                    $secuencia=$filas['CONSECUTIVO_CMODIF'];
                }
            }else{
                $secuencia=1;
            }

            if($datosParaGuardar[8]=='TIPO'){
                $setActualizaContrato=[
                    'TIPO_CCONT'=>$datosParaGuardar[3],
                    // 'MODO_CCONT'=>$datosParaGuardar[4],
                    // 'PERMISO_CCONT'=>$datosParaGuardar[5],
                    // 'DESCUENTO_CCONT'=>$datosParaGuardar[6],
                    'COMENTS_CCONT'=>$datosParaGuardar[7],
                    'IDMODIF_CCONT'=>$datosParaGuardar[0],
                    'FMODIF_CCONT'=>date('Y-m-d'),
                ];
                $builder=$this->dbBuild->table('sys_clientes_contratos');
                $builder->where('CLIENTE_CCONT',$datosParaGuardar[1]);
                $builder->where('CONTRATO_CCONT',$datosParaGuardar[2]);
                $builder->set($setActualizaContrato);
                $builder->update($setActualizaContrato);
                log_message('notice','[MODCONTRATO|Async/Q] {captur} modifico el tipo de contrato en el sistema continua proceso', $log_extra);

                $setGuardaModificado=[
                    'FECHACAP_CMODIF'=>date('Y-m-d'),
                    'HORACAP_CMODIF'=>date('H:i:s'),
                    'CAPTURA_CMODIF'=>$datosParaGuardar[0],
                    'FOLIO_CMODIF'=>$idTramite,
                    'CONSECUTIVO_CMODIF'=>str_pad($secuencia,6,'0', STR_PAD_LEFT),
                    'CONTRATO_CMODIF'=>$datosParaGuardar[2],
                    'TIPOMOD_CMODIF'=>$datosParaGuardar[8],
                    'USUARIO_CMODIF'=>$datosParaGuardar[1],
                    'MOTCAMBIO_CMODIF'=>$datosParaGuardar[9],
                    'FCAMBIO_CMODIF'=>date('Y-m-d'),
                    'IDCAMBIO_CMODIF'=>$datosParaGuardar[0],
                    'IDMODIF_CMODIF'=>$datosParaGuardar[0],
                    'FMODIF_CMODIF'=>date('Y-m-d'),
                    'ESTATUS_CMODIF'=>'ACTI',
                ];
                $builderb=$this->dbBuild->table('sys_clientes_contratosModificado');
                $builderb->insert($setGuardaModificado);
                log_message('notice','[MODCONTRATO|Async/Q] creando registro de modificacion del contrato.', $log_extra);

            }elseif($datosParaGuardar[8]=='MODO'){
                $setActualizaContrato=[
                    // 'TIPO_CCONT'=>$datosParaGuardar[3],
                    'MODO_CCONT'=>$datosParaGuardar[4],
                    // 'PERMISO_CCONT'=>$datosParaGuardar[5],
                    // 'DESCUENTO_CCONT'=>$datosParaGuardar[6],
                    'COMENTS_CCONT'=>$datosParaGuardar[7],
                    'IDMODIF_CCONT'=>$datosParaGuardar[0],
                    'FMODIF_CCONT'=>date('Y-m-d'),
                ];
                $builder=$this->dbBuild->table('sys_clientes_contratos');
                $builder->where('CLIENTE_CCONT',$datosParaGuardar[1]);
                $builder->where('CONTRATO_CCONT',$datosParaGuardar[2]);
                $builder->set($setActualizaContrato);
                $builder->update($setActualizaContrato);
                log_message('notice','[MODCONTRATO|Async/Q] {captur} modifico el modo de contrato en el sistema continua proceso', $log_extra);

                $setGuardaModificado=[
                    'FECHACAP_CMODIF'=>date('Y-m-d'),
                    'HORACAP_CMODIF'=>date('H:i:s'),
                    'CAPTURA_CMODIF'=>$datosParaGuardar[0],
                    'FOLIO_CMODIF'=>$idTramite,
                    'CONSECUTIVO_CMODIF'=>str_pad($secuencia,6,'0', STR_PAD_LEFT),
                    'CONTRATO_CMODIF'=>$datosParaGuardar[2],
                    'TIPOMOD_CMODIF'=>$datosParaGuardar[8],
                    'USUARIO_CMODIF'=>$datosParaGuardar[1],
                    'MOTCAMBIO_CMODIF'=>$datosParaGuardar[9],
                    'FCAMBIO_CMODIF'=>date('Y-m-d'),
                    'IDCAMBIO_CMODIF'=>$datosParaGuardar[0],
                    'IDMODIF_CMODIF'=>$datosParaGuardar[0],
                    'FMODIF_CMODIF'=>date('Y-m-d'),
                    'ESTATUS_CMODIF'=>'ACTI',
                ];
                $builderb=$this->dbBuild->table('sys_clientes_contratosModificado');
                $builderb->insert($setGuardaModificado);
                log_message('notice','[MODCONTRATO|Async/Q] creando registro de modificacion del contrato.', $log_extra);

            }elseif($datosParaGuardar[8]=='PERM'){
                $setActualizaContrato=[
                    // 'TIPO_CCONT'=>$datosParaGuardar[3],
                    // 'MODO_CCONT'=>$datosParaGuardar[4],
                    'PERMISO_CCONT'=>$datosParaGuardar[5],
                    // 'DESCUENTO_CCONT'=>$datosParaGuardar[6],
                    'COMENTS_CCONT'=>$datosParaGuardar[7],
                    'IDMODIF_CCONT'=>$datosParaGuardar[0],
                    'FMODIF_CCONT'=>date('Y-m-d'),
                ];
                $builder=$this->dbBuild->table('sys_clientes_contratos');
                $builder->where('CLIENTE_CCONT',$datosParaGuardar[1]);
                $builder->where('CONTRATO_CCONT',$datosParaGuardar[2]);
                $builder->set($setActualizaContrato);
                $builder->update($setActualizaContrato);
                log_message('notice','[MODCONTRATO|Async/Q] {captur} modifico el permiso de contrato en el sistema continua proceso', $log_extra);

                $setGuardaModificado=[
                    'FECHACAP_CMODIF'=>date('Y-m-d'),
                    'HORACAP_CMODIF'=>date('H:i:s'),
                    'CAPTURA_CMODIF'=>$datosParaGuardar[0],
                    'FOLIO_CMODIF'=>$idTramite,
                    'CONSECUTIVO_CMODIF'=>str_pad($secuencia,6,'0', STR_PAD_LEFT),
                    'CONTRATO_CMODIF'=>$datosParaGuardar[2],
                    'TIPOMOD_CMODIF'=>$datosParaGuardar[8],
                    'USUARIO_CMODIF'=>$datosParaGuardar[1],
                    'MOTCAMBIO_CMODIF'=>$datosParaGuardar[9],
                    'FCAMBIO_CMODIF'=>date('Y-m-d'),
                    'IDCAMBIO_CMODIF'=>$datosParaGuardar[0],
                    'IDMODIF_CMODIF'=>$datosParaGuardar[0],
                    'FMODIF_CMODIF'=>date('Y-m-d'),
                    'ESTATUS_CMODIF'=>'ACTI',
                ];
                $builderb=$this->dbBuild->table('sys_clientes_contratosModificado');
                $builderb->insert($setGuardaModificado);
                log_message('notice','[MODCONTRATO|Async/Q] creando registro de modificacion del contrato.', $log_extra);

            }elseif($datosParaGuardar[8]=='TARIF'){
                $setActualizaContrato=[
                    // 'TIPO_CCONT'=>$datosParaGuardar[3],
                    // 'MODO_CCONT'=>$datosParaGuardar[4],
                    // 'PERMISO_CCONT'=>$datosParaGuardar[5],
                    'DESCUENTO_CCONT'=>$datosParaGuardar[6],
                    'COMENTS_CCONT'=>$datosParaGuardar[7],
                    'IDMODIF_CCONT'=>$datosParaGuardar[0],
                    'FMODIF_CCONT'=>date('Y-m-d'),
                ];
                $builder=$this->dbBuild->table('sys_clientes_contratos');
                $builder->where('CLIENTE_CCONT',$datosParaGuardar[1]);
                $builder->where('CONTRATO_CCONT',$datosParaGuardar[2]);
                $builder->set($setActualizaContrato);
                $builder->update($setActualizaContrato);
                log_message('notice','[MODCONTRATO|Async/Q] {captur} modifico el permiso de contrato en el sistema continua proceso', $log_extra);

                $setGuardaModificado=[
                    'FECHACAP_CMODIF'=>date('Y-m-d'),
                    'HORACAP_CMODIF'=>date('H:i:s'),
                    'CAPTURA_CMODIF'=>$datosParaGuardar[0],
                    'FOLIO_CMODIF'=>$idTramite,
                    'CONSECUTIVO_CMODIF'=>str_pad($secuencia,6,'0', STR_PAD_LEFT),
                    'CONTRATO_CMODIF'=>$datosParaGuardar[2],
                    'TIPOMOD_CMODIF'=>$datosParaGuardar[8],
                    'USUARIO_CMODIF'=>$datosParaGuardar[1],
                    'MOTCAMBIO_CMODIF'=>$datosParaGuardar[9],
                    'FCAMBIO_CMODIF'=>date('Y-m-d'),
                    'IDCAMBIO_CMODIF'=>$datosParaGuardar[0],
                    'IDMODIF_CMODIF'=>$datosParaGuardar[0],
                    'FMODIF_CMODIF'=>date('Y-m-d'),
                    'ESTATUS_CMODIF'=>'ACTI',
                ];
                $builderb=$this->dbBuild->table('sys_clientes_contratosModificado');
                $builderb->insert($setGuardaModificado);
                log_message('notice','[MODCONTRATO|Async/Q] creando registro de modificacion del contrato.', $log_extra);

            }

            $builderc=$this->dbBuild->table('sys_clientes_contratosModificado');
            $builderc->select("FOLIO_CMODIF,CONTRATO_CMODIF,TIPOMOD_CMODIF,FCAMBIO_CMODIF");
            $builderc->where('CONTRATO_CMODIF',$datosParaGuardar[2]);
            $builderc->where('FOLIO_CMODIF',$idTramite);
            $builderc->where('ESTATUS_CMODIF','ACTI');
            $builderc->orderBy('FMODIF_CMODIF','ASC');
            $resultado1=$builderc->get();
            if($resultado1->getNumRows()>0){
                return $resultado1->getResultArray();
            }


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaContratoTransferir($id)
    {
        try {
            $parametro=explode('_',$id);

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',IDUBIC_UBIC) AS idTablePk,IDUSUA_CLIEN,CONTRATO_CCONT, 
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,NOMBRE_ESTA,NOMBRE_MUNIC,
            CODIPOST_CODPOS,COLONIA_COLON,CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,DESCRIPCION_CONT, 
            DESCRIPCION_CEXP,DESCRIPCION_CPERM,DESCRIPCION_CTARI,FECHACAP_CCONT,COMENTS_CCONT");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_contratosExpedicion','CLAVE_CEXP=MODO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->where('CLIENTE_CCONT',$parametro[0]);
            $builder->where('CONTRATO_CCONT', $parametro[1]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de contratos transferir');
                return $resultado->getResultArray();
            }
    
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosUbicacionContrato($id)
    {
        try {
            $parametro=explode('_',$id);

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',IDUBIC_UBIC) AS idTablePk, CONTRATO_CCONT, 
            CALLE_UBIC,NEXTE_UBIC,NINTE_UBIC,COLONIA_UBIC,MUNICIPIO_UBIC,CODIPOSTAL_UBIC,ESTADO_UBIC,REFERENCIA_UBIC");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->where('CLIENTE_CCONT',$parametro[0]);
            $builder->where('CONTRATO_CCONT', $parametro[1]);
            $builder->where('IDUBIC_UBIC', $parametro[2]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de contratos ubicacion');
                return $resultado->getResultArray();
            }
    
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarDatosUsuarioTransferir($datosParaGuardar)
    {
        try {
            $parametro=explode('_',$datosParaGuardar[17]);
            $acentuado = ['á','é','í','ó','ú'];
            $sinacento = ['a','e','i','o','ú'];
            $nombre=str_replace($acentuado,$sinacento,$datosParaGuardar[1]);
            $apaterno=str_replace($acentuado,$sinacento,$datosParaGuardar[2]);
            $amaterno=str_replace($acentuado,$sinacento,$datosParaGuardar[3]);
            $generaContrasena=substr($nombre, 0,4).substr($apaterno, 0,2).substr($amaterno, 0,2).'.'.date('ymd');

            if(empty($datosParaGuardar[8])){
                $idUsuarioAsignado=sha1(date('YmdHis'));
                $generaUsuario=substr($nombre, 0,4).substr($apaterno, 0,2).substr($amaterno, 0,2);
            }else{
                $idUsuarioAsignado=sha1($datosParaGuardar[8]);
                $generaUsuario=$datosParaGuardar[8];
            }
            log_message('info','[TRACONTRATO|Async] Definiendo id de usuario y contraseña para asignar a usuario');

            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$idUsuarioAsignado
            ];
            $secuenciaOrden=1;
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->selectMax('(ID_CLIEN)+1','ID_CLIEN');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                foreach($resultado->getResultArray() as $filas){
                    $secuenciaOrden=$filas['ID_CLIEN'];
                }
                if($secuenciaOrden==''){
                    $secuenciaOrden=1;
                }
                log_message('info','[TRACONTRATO|Async/Q] Obteniendo secuencia para asignar a {item}',$log_extra);
            }

            $setGuardarCLiente=[
                'FECHCAPT_CLIEN'=>date('Y-m-d'),
                'HORACAPT_CLIEN'=>date('H:i:s'),
                'CAPTURA_CLIEN'=>$datosParaGuardar[0],
                'IDUSUA_CLIEN'=>$idUsuarioAsignado,
                'CODBARR_CLIEN'=>date('Ymd').str_pad($secuenciaOrden, 6, '0', STR_PAD_LEFT),
                'ID_CLIEN'=>str_pad($secuenciaOrden, 8, '0', STR_PAD_LEFT),
                'NOMBRE_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[1])),
                'APATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'AMATERNO_CLIEN'=>ucwords(mb_strtolower($datosParaGuardar[3])),
                'AREA_CLIEN'=>'USUARIO',
                'FNACIM_CLIEN'=>$datosParaGuardar[4],
                'SEXO_CLIEN'=>$datosParaGuardar[5],
                'PUESTO_CLIEN'=>'USUARIO',
                'TELEFONO_CLIEN'=>$datosParaGuardar[6],
                'MOVIL_CLIEN'=>$datosParaGuardar[7],
                'EMAIL_CLIEN'=>base64_encode($datosParaGuardar[8]),
                'CAMPUS_CLIEN'=>'TELTI',
                'USUARIO_CLIEN'=>base64_encode(base64_encode($generaUsuario)),
                'PASSWORD_CLIEN'=>base64_encode(base64_encode(base64_encode($generaContrasena))),
                'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                'FMODIF_CLIEN'=>date('Y-m-d'),
                'NIVELPERF_CLIEN'=>'USUARIO',
                'PERFIL_CLIEN'=>'USUARIO',
                'ESTATUS_CLIEN'=>'ACTI',
            ];
            $builderb=$this->dbBuild->table('sys_clientes');
            $builderb->insert($setGuardarCLiente);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} creo un nuevo registro de usuario para transferencia', $log_extra);

            $secuenciaUbic=1;
            $builderc=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderc->selectMax('(SECUENCIA_UBIC)+1','SECUENCIA_UBIC');
            $builderc->where('IDUSUA_UBIC', $idUsuarioAsignado);
            $builderc->where('ESTATUS_UBIC','ACTI');
            $resultado0=$builderc->get();
            if($resultado0->getNumRows()>0){
                foreach($resultado0->getResultArray() as $filas){
                    $secuenciaUbic=$filas['SECUENCIA_UBIC'];
                }
                if($secuenciaUbic==''){
                    $secuenciaUbic=1;
                }
                log_message('info','[TRACONTRATO|Async/Q] Obteniendo secuencia de ubicaciones para {item}',$log_extra);
            }

            $setAgregaUbicaiones = [
                'FECHCAPT_UBIC'=>date('Y-m-d'),
                'HORACAPT_UBIC'=>date('H:i:s'),
                'CAPTURA_UBIC'=>$datosParaGuardar[0],
                'IDUSUA_UBIC'=>$idUsuarioAsignado,
                'IDUBIC_UBIC'=>$idUsuarioAsignado.str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'SECUENCIA_UBIC'=>str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'NOMBRE_UBIC'=>'Principal',
                'PAIS_UBIC'=>'MX',
                'ESTADO_UBIC'=>$datosParaGuardar[9],
                'MUNICIPIO_UBIC'=>$datosParaGuardar[10],
                'CODIPOSTAL_UBIC'=>$datosParaGuardar[11],
                'COLONIA_UBIC'=>$datosParaGuardar[12],
                'CALLE_UBIC'=>$datosParaGuardar[13],
                'NEXTE_UBIC'=>$datosParaGuardar[14],
                'NINTE_UBIC'=>$datosParaGuardar[15],
                'REFERENCIA_UBIC'=>$datosParaGuardar[16],
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'FMODIF_UBIC'=>date('Y-m-d'),
                'ESTATUS_UBIC'=>'ACTI',
            ];
            $builderd=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderd->insert($setAgregaUbicaiones);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} creo una ubicacion para el usuario transferencia', $log_extra);

            $buildere=$this->dbBuild->table('cat_calles');
            $buildere->select('CALLE_CALLE');
            $buildere->where('COLON_CALLE',$datosParaGuardar[12]);
            $buildere->where('CALLE_CALLE',$datosParaGuardar[13]);
            $buildere->where('ESTATUS_CALLE','ACTI');
            $resultado1=$buildere->get();
            if(!$resultado1->getNumRows()>0){
                $builderf=$this->dbBuild->table('cat_calles');
                $builderf->selectMax('(SECUENCIA_CALLE)+1','SECUENCIA_CALLE');
                $builderf->where('COLON_CALLE',$datosParaGuardar[12]);
                $builderf->where('ESTATUS_CALLE','ACTI');
                $resultado=$builderf->get();

                if($resultado->getNumRows()>0){
                    foreach($resultado->getResultArray() as $filas){
                        $secuenciaCalle=$filas['SECUENCIA_CALLE'];
                    }
                    if($secuenciaCalle==''){
                        $secuenciaCalle=1;
                    }
                    log_message('info','[TRACONTRATO|Async/Q] Obteniendo secuencia para asignar a calle',$log_extra);
                }

                $setCalleNueva=[
                    'FECHACAP_CALLE'=>date('Y-m-d'),
                    'HORACAP_CALLE'=>date('H:i:s'),
                    'CAPTURA_CALLE'=>$datosParaGuardar[0],
                    'COLON_CALLE'=>$datosParaGuardar[12],
                    'SECUENCIA_CALLE'=>str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CLVCALLE_CALLE'=>$datosParaGuardar[12].str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CALLE_CALLE'=>$datosParaGuardar[13],
                    'IDMODIF_CALLE'=>$datosParaGuardar[0],
                    'FMODIF_CALLE'=>date('Y-m-d'),
                    'ESTATUS_CALLE'=>'ACTI',
                ];
                $builderg=$this->dbBuild->table('cat_calles');
                $builderg->insert($setCalleNueva);
                log_message('notice','[TRACONTRATO|Async/Q] Agregando nueva calle al sistema');

            }

            $builderh=$this->dbBuild->table('sys_clientes');
            $builderh->select("IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, IDUBIC_UBIC");
            $builderh->join('sys_clientes_ubicaciones','IDUSUA_UBIC=IDUSUA_CLIEN');
            $builderh->where('IDUSUA_CLIEN', $idUsuarioAsignado);
            $builderh->where('ESTATUS_CLIEN','ACTI');
            $resultado2=$builderh->get();
            if($resultado2->getNumRows()>0){
                $usuario=$resultado2->getResultArray();
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta usuarios general transferencia de contrato');
            }

            $builderi=$this->dbBuild->table('sys_clientes_contratos');
            $builderi->select("CONCAT(CLIENTE_CCONT,'_',CONTRATO_CCONT,'_',UBICA_CCONT) AS IDCONTRATO, CONTRATO_CCONT, TIPO_CCONT, MODO_CCONT, PERMISO_CCONT, DESCUENTO_CCONT, COMENTS_CCONT");
            $builderi->where('CLIENTE_CCONT',$parametro[0]);
            $builderi->where('CONTRATO_CCONT',$parametro[1]);
            $builderi->where('ESTATUS_CCONT','ACTI');
            $resultado3=$builderi->get();
            if($resultado3->getNumRows()>0){
                $contrato=$resultado3->getResultArray();
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta contrato detalles transferencia de contrato');
            }

            return [
                $usuario,
                $contrato,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosUsuarioTransferir($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, NOMBRE_CLIEN, APATERNO_CLIEN, AMATERNO_CLIEN, EMAIL_CLIEN,
            FNACIM_CLIEN, SEXO_CLIEN, CURP_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN");
            $builder->where('IDUSUA_CLIEN', $id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosUsuarioTransferir($datosParaGuardar)
    {
        try {

            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$datosParaGuardar[17]
            ];
            $parametro=explode('_',$datosParaGuardar[18]);

            $setActualizarCliente=[
                'FNACIM_CLIEN'=>$datosParaGuardar[4],
                'SEXO_CLIEN'=>$datosParaGuardar[5],
                'EMAIL_CLIEN'=>base64_encode($datosParaGuardar[8]),
                'TELEFONO_CLIEN'=>$datosParaGuardar[6],
                'MOVIL_CLIEN'=>$datosParaGuardar[7],
                'EMAIL_CLIEN'=>$datosParaGuardar[8],
                'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                'FMODIF_CLIEN'=>date('Y-m-d'),
            ];
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->where('IDUSUA_CLIEN',$datosParaGuardar[17]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->set($setActualizarCliente);
            $builder->update($setActualizarCliente);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} actualizo registro de usuario para transferencia', $log_extra);

            $secuenciaUbic=1;
            $nopmbreUbic='';
            $builderb=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderb->selectMax('(SECUENCIA_UBIC)+1','SECUENCIA_UBIC');
            $builderb->where('IDUSUA_UBIC', $datosParaGuardar[17]);
            $builderb->where('ESTATUS_UBIC','ACTI');
            $resultado0=$builderb->get();
            if($resultado0->getNumRows()>0){
                foreach($resultado0->getResultArray() as $filas){
                    $secuenciaUbic=$filas['SECUENCIA_UBIC'];
                    $nopmbreUbic='Extra';
                }
                if($secuenciaUbic==''){
                    $secuenciaUbic=1;
                    $nopmbreUbic='Principal';
                }
                log_message('info','[TRACONTRATO|Async/Q] Obteniendo secuencia de ubicaciones para {item}',$log_extra);
            }

            $setAgregaUbicaiones = [
                'FECHCAPT_UBIC'=>date('Y-m-d'),
                'HORACAPT_UBIC'=>date('H:i:s'),
                'CAPTURA_UBIC'=>$datosParaGuardar[0],
                'IDUSUA_UBIC'=>$datosParaGuardar[17],
                'IDUBIC_UBIC'=>$datosParaGuardar[17].str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'SECUENCIA_UBIC'=>str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT),
                'NOMBRE_UBIC'=>$nopmbreUbic,
                'PAIS_UBIC'=>'MX',
                'ESTADO_UBIC'=>$datosParaGuardar[9],
                'MUNICIPIO_UBIC'=>$datosParaGuardar[10],
                'CODIPOSTAL_UBIC'=>$datosParaGuardar[11],
                'COLONIA_UBIC'=>$datosParaGuardar[12],
                'CALLE_UBIC'=>$datosParaGuardar[13],
                'NEXTE_UBIC'=>$datosParaGuardar[14],
                'NINTE_UBIC'=>$datosParaGuardar[15],
                'REFERENCIA_UBIC'=>$datosParaGuardar[16],
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'FMODIF_UBIC'=>date('Y-m-d'),
                'ESTATUS_UBIC'=>'ACTI',
            ];
            $builderc=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderc->insert($setAgregaUbicaiones);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} creo una ubicacion para el usuario transferencia', $log_extra);

            $builderd=$this->dbBuild->table('cat_calles');
            $builderd->select('CALLE_CALLE');
            $builderd->where('COLON_CALLE',$datosParaGuardar[12]);
            $builderd->where('CALLE_CALLE',$datosParaGuardar[13]);
            $builderd->where('ESTATUS_CALLE','ACTI');
            $resultado1=$builderd->get();
            if(!$resultado1->getNumRows()>0){
                $buildere=$this->dbBuild->table('cat_calles');
                $buildere->selectMax('(SECUENCIA_CALLE)+1','SECUENCIA_CALLE');
                $buildere->where('COLON_CALLE',$datosParaGuardar[12]);
                $buildere->where('ESTATUS_CALLE','ACTI');
                $resultado=$buildere->get();

                if($resultado->getNumRows()>0){
                    foreach($resultado->getResultArray() as $filas){
                        $secuenciaCalle=$filas['SECUENCIA_CALLE'];
                    }
                    if($secuenciaCalle==''){
                        $secuenciaCalle=1;
                    }
                    log_message('info','[TRACONTRATO|Async/Q] Obteniendo secuencia para asignar a calle',$log_extra);
                }

                $setCalleNueva=[
                    'FECHACAP_CALLE'=>date('Y-m-d'),
                    'HORACAP_CALLE'=>date('H:i:s'),
                    'CAPTURA_CALLE'=>$datosParaGuardar[0],
                    'COLON_CALLE'=>$datosParaGuardar[12],
                    'SECUENCIA_CALLE'=>str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CLVCALLE_CALLE'=>$datosParaGuardar[12].str_pad($secuenciaCalle,4,'0', STR_PAD_LEFT),
                    'CALLE_CALLE'=>$datosParaGuardar[13],
                    'IDMODIF_CALLE'=>$datosParaGuardar[0],
                    'FMODIF_CALLE'=>date('Y-m-d'),
                    'ESTATUS_CALLE'=>'ACTI',
                ];
                $builderf=$this->dbBuild->table('cat_calles');
                $builderf->insert($setCalleNueva);
                log_message('notice','[TRACONTRATO|Async/Q] Agregando nueva calle al sistema');

            }

            $builderg=$this->dbBuild->table('sys_clientes');
            $builderg->select("IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, IDUBIC_UBIC");
            $builderg->join('sys_clientes_ubicaciones','IDUSUA_UBIC=IDUSUA_CLIEN');
            $builderg->where('IDUSUA_CLIEN', $datosParaGuardar[17]);
            $builderg->where('IDUBIC_UBIC', $datosParaGuardar[17].str_pad($secuenciaUbic,3,'0', STR_PAD_LEFT));
            $builderg->where('ESTATUS_CLIEN','ACTI');
            $resultado2=$builderg->get();
            if($resultado2->getNumRows()>0){
                $usuario=$resultado2->getResultArray();
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta usuario datos');
            }

            $builderh=$this->dbBuild->table('sys_clientes_contratos');
            $builderh->select("CONCAT(CLIENTE_CCONT,'_',CONTRATO_CCONT,'_',UBICA_CCONT) AS IDCONTRATO, CONTRATO_CCONT, TIPO_CCONT, MODO_CCONT, PERMISO_CCONT, DESCUENTO_CCONT, COMENTS_CCONT");
            $builderh->where('CLIENTE_CCONT',$parametro[0]);
            $builderh->where('CONTRATO_CCONT',$parametro[1]);
            $builderh->where('ESTATUS_CCONT','ACTI');
            $resultado3=$builderh->get();
            if($resultado3->getNumRows()>0){
                $contrato=$resultado3->getResultArray();
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta contrato detalles');
            }

            return [
                $usuario,
                $contrato,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function transferirDatosContratoFinal($datosParaGuardar)
    {
        try {
            $parametro=explode('_',$datosParaGuardar[3]);
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$parametro[0],
                'item2'=>$parametro[1],
            ];
            $setActualizarContrato = [
                'CLIENTE_CCONT'=>$datosParaGuardar[1],
                'UBICA_CCONT'=>$datosParaGuardar[2],
                'TIPO_CCONT'=>$datosParaGuardar[4],
                'MODO_CCONT'=>$datosParaGuardar[5],
                'PERMISO_CCONT'=>$datosParaGuardar[6],
                'DESCUENTO_CCONT'=>$datosParaGuardar[7],
                'COMENTS_CCONT'=>$datosParaGuardar[8],
                'FMODIF_CCONT'=>date('Y-m-d'),
                'IDMODIF_CCONT'=>$datosParaGuardar[0],
            ];
            $builder=$this->dbBuild->table('sys_clientes_contratos');
            $builder->where('CLIENTE_CCONT',$parametro[0]);
            $builder->where('CONTRATO_CCONT',$parametro[1]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->set($setActualizarContrato);
            $builder->update($setActualizarContrato);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} actualizo los parametro del contrato {item2}');

            $buildera=$this->dbBuild->table('sys_clientes_transferencias');
            $buildera->selectMax('(FOLIO_TRANS)+1','FOLIO_TRANS');
            $buildera->where('ESTATUS_TRANS','ACTI');
            $resultado0=$buildera->get();
            $folioTransfer='';
            if($resultado0->getNumRows()>0){
                foreach($resultado0->getResultArray() as $filas){
                    $folioTransfer=$filas['FOLIO_TRANS'];
                }
                if($folioTransfer==''){
                    $folioTransfer=1;
                }
                log_message('info','[TRACONTRATO|Async/Q] Obteniendo secuencia de transferencias para {item}',$log_extra);
            }
            $setFolioTransferencia = [
                'FECHACAP_TRANS'=>date('Y-m-d'),
                'HORACAP_TRANS'=>date('H:i:s'),
                'CAPTURA_TRANS'=>$datosParaGuardar[0],
                'FOLIO_TRANS'=>str_pad($folioTransfer,9,'0', STR_PAD_LEFT),
                'CONTRATO_TRANS'=>$parametro[1],
                'CLIENBAJA_TRANS'=>$parametro[0],
                'CLIENALTA_TRANS'=>$datosParaGuardar[1],
                'COMENTS_TRANS'=>$datosParaGuardar[8],
                'FTRANS_TRANS'=>date('Y-m-d'),
                'IDTRANS_TRANS'=>$datosParaGuardar[0],
                'FMODIF_TRANS'=>date('Y-m-d'),
                'IDMODIF_TRANS'=>$datosParaGuardar[0],
                'ESTATUS_TRANS'=>'ACTI',
            ];
            $builderb=$this->dbBuild->table('sys_clientes_transferencias');
            $builderb->insert($setFolioTransferencia);
            log_message('notice','[TRACONTRATO|Async/Q] Se creo un documento para soportar la transferencia');

            $setActualizarUsuario = [
                'FMODIF_CLIEN'=>date('Y-m-d'),
                'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                'ESTATUS_CLIEN'=>'TRAN',
            ];
            $builderc=$this->dbBuild->table('sys_clientes');
            $builderc->where('IDUSUA_CLIEN',$parametro[0]);
            $builderc->where('ESTATUS_CLIEN','ACTI');
            $builderc->set($setActualizarUsuario);
            $builderc->update($setActualizarUsuario);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} actualizo los parametro de usuario {item}');

            $setActualizarUbicacion = [
                'FMODIF_UBIC'=>date('Y-m-d'),
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'ESTATUS_UBIC'=>'TRAN',
            ];
            $builderd=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderd->where('IDUSUA_UBIC',$parametro[0]);
            $builderd->where('IDUBIC_UBIC',$parametro[2]);
            $builderd->where('ESTATUS_UBIC','ACTI');
            $builderd->set($setActualizarUbicacion);
            $builderd->update($setActualizarUbicacion);
            log_message('notice','[TRACONTRATO|Async/Q] {captur} actualizo los parametro de ubicacion {item}');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaContratoBaja($id)
    {
        try {

            $parametro=explode('_',$id);

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',IDUBIC_UBIC) AS idTablePk,CONTRATO_CCONT, 
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, 
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON,', C.P.',CODIPOST_CODPOS,', ',NOMBRE_MUNIC,', ',NOMBRE_ESTA) AS CALLES, 
            DESCRIPCION_CONT,DESCRIPCION_CEXP,DESCRIPCION_CPERM,DESCRIPCION_CTARI,FECHACAP_CCONT,COMENTS_CCONT,
            COALESCE(COUNT(DISTINCT(CONTRATO_CCONT))) AS TOTALCONTRATO");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_contratosExpedicion','CLAVE_CEXP=MODO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->where('CLIENTE_CCONT',$parametro[0]);
            $builder->where('CONTRATO_CCONT', $parametro[1]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[BAJCONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de contratos transferir');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cargarDatosContratoBaja($id)
    {
        try {
            $parametro=explode('_',$id);

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',IDUBIC_UBIC) AS idTablePk, CONTRATO_CCONT, 
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,' ',COLONIA_COLON,' C.P. ',CODIPOST_CODPOS,', ',NOMBRE_MUNIC,', ',NOMBRE_ESTA) AS CALLES,
            DESCRIPCION_CONT,DESCRIPCION_CEXP,DESCRIPCION_CPERM,DESCRIPCION_CTARI,FECHACAP_CCONT,COMENTS_CCONT,ESTATUS_CCONT");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_contratosExpedicion','CLAVE_CEXP=MODO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->where('CLIENTE_CCONT',$parametro[0]);
            $builder->where('CONTRATO_CCONT', $parametro[1]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[TRACONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de contratos transferir');
                return $resultado->getResultArray();
            }
    
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosContratoBaja($datosParaGuardar)
    {
        try {
            $parametro=explode('_',$datosParaGuardar[1]);
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'user'=>$parametro[0],
                'argu'=>$parametro[1],
                'arg1'=>$parametro[2],
            ];
            $secuenciaOrden=1;
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, COUNT(DISTINCT(CONTRATO_CCONT)) AS TOTAL");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->where('IDUSUA_CLIEN',$parametro[0]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[BAJCONTRATO|Async] Calculando el numero de contratos para {user}.',$log_extra);
                foreach($resultado->getResultArray() as $filas){
                    $totales=$filas['TOTAL'];
                }
                if($totales=1){
                    $setBajaUsuario=[
                        'FMODIF_CLIEN'=>date('Y-m-d'),
                        'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                        'ESTATUS_CLIEN'=>$datosParaGuardar[2],
                    ];
                    $builderc=$this->dbBuild->table('sys_clientes');
                    $builderc->where('IDUSUA_CLIEN',$parametro[0]);
                    $builderc->where('ESTATUS_CLIEN','ACTI');
                    $builderc->set($setBajaUsuario);
                    $builderc->update($setBajaUsuario);
                    log_message('notice','[BAJCONTRATO|Async] {captur} ha actualizado la baja de {user}.',$log_extra);
                }
            }

            $setBajaContrato = [
                'COMENTS_CCONT'=>$datosParaGuardar[3],
                'FMODIF_CCONT'=>date('Y-m-d'),
                'IDMODIF_CCONT'=>$datosParaGuardar[0],
                'ESTATUS_CCONT'=>$datosParaGuardar[2],
            ];
            $buildera=$this->dbBuild->table('sys_clientes_contratos');
            $buildera->where('CLIENTE_CCONT',$parametro[0]);
            $buildera->where('CONTRATO_CCONT',$parametro[1]);
            $buildera->where('ESTATUS_CCONT','ACTI');
            $buildera->set($setBajaContrato);
            $buildera->update($setBajaContrato);
            log_message('notice','[BAJCONTRATO|Async] {captur} ha actualizado la baja del contrato {argu}.',$log_extra);

            $setBajaUbicacion=[
                'FMODIF_UBIC'=>date('Y-m-d'),
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'ESTATUS_UBIC'=>$datosParaGuardar[2],
            ];
            $builderb=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderb->where('IDUSUA_UBIC',$parametro[0]);
            $builderb->where('IDUBIC_UBIC',$parametro[2]);
            $builderb->where('ESTATUS_UBIC','ACTI');
            $builderb->set($setBajaUbicacion);
            $builderb->update($setBajaUbicacion);
            log_message('notice','[BAJCONTRATO|Async] {captur} ha actualizado la baja de la ubicacion {arg1}.',$log_extra);
            
            $buildere=$this->dbBuild->table('sys_clientes_contratosBajas');
            $buildere->selectMax('(CONSECUTIVO_CBAJA)+1','CONSECUTIVO_CBAJA');
            $buildere->where('ESTATUS_CBAJA','ACTI');
            $resultado0=$buildere->get();
            if($resultado0->getNumRows()>0){
                foreach($resultado0->getResultArray() as $filas){
                    $secuenciaOrden=$filas['CONSECUTIVO_CBAJA'];
                }
                if($secuenciaOrden==''){
                    $secuenciaOrden=1;
                }
            }
            $folioBaja=date('Ymd').str_pad($secuenciaOrden, 6, '0', STR_PAD_LEFT);
            $setReciboBaja=[
                'FECHACAP_CBAJA'=>date('Y-m-d'),
                'HORACAP_CBAJA'=>date('H:i:s'),
                'CAPTURA_CBAJA'=>$datosParaGuardar[0],
                'FOLIO_CBAJA'=>$folioBaja,
                'CONSECUTIVO_CBAJA'=>str_pad($secuenciaOrden, 6, '0', STR_PAD_LEFT),
                'USUARIO_CBAJA'=>$parametro[0],
                'CONTRATO_CBAJA'=>$parametro[1],
                'FBAJA_CBAJA'=>date('Y-m-d'),
                'IDBAJA_CBAJA'=>$datosParaGuardar[0],
                'MOTIVBAJA_CBAJA'=>$datosParaGuardar[4],
                'IDMODIF_CBAJA'=>$datosParaGuardar[0],
                'FMODIF_CBAJA'=>date('Y-m-d'),
                'ESTATUS_CBAJA'=>'ACTI',
            ];
            $builderf=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builderf->insert($setReciboBaja);
            log_message('notice','[BAJCONTRATO|Async] {captur} ha creado un recibo de baja para {arg1}.',$log_extra);
            
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function acuseDatosReciboBaja($id)
    {
        try {
            $parametro=explode('_', $id);

            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("FOLIO_BAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, SEXO_CLIEN, CONTRATO_CBAJA, FBAJA_CBAJA, OBSERVACIONES_CBAJA, ESTATUS_CCONT");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->where('USUARIO_CBAJA', $parametro[0]);
            $builder->where('CONTRATO_CBAJA', $parametro[1]);
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                $recibo=$resultado0->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_responsables');
            $builderb->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, PERFIL_RESPO, DESCRIPHOM_PUESTO");
            $builderb->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $builderb->whereIn('PERFIL_RESPO',['COMIPRESI','COMITESOR']);
            $builderb->where('ESTATUS_RESPO','ACTI');
            $resultado1=$builderb->get();
            if($resultado1->getNumRows()>0){
                $comite=$resultado1->getResultArray();
            }

            $builderc=$this->dbBuild->table('sys_clientes');
            $builderc->select("IDUSUA_CLIEN, CONTRATO_CCONT, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,
            NOMBRE_ESTA,NOMBRE_MUNIC,CODIPOST_CODPOS,COLONIA_COLON,CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,
            DESCRIPCION_CONT,TIPO_CCONT,PERMISO_CCONT,DESCUENTO_CCONT,FECHACAP_CCONT,FBAJA_CCONT,IDBAJA_CCONT,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS RESPONS,FOLIO_CBAJA,ESTATUS_CCONT");
            $builderc->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builderc->join('sys_responsables','IDUSUA_RESPO=IDBAJA_CCONT');
            $builderc->join('sys_clientes_contratosBajas','CONTRATO_CBAJA=CONTRATO_CCONT');
            $builderc->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builderc->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builderc->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builderc->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builderc->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builderc->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builderc->where('CLIENTE_CCONT',$parametro[0]);
            $builderc->where('CONTRATO_CCONT',$parametro[1]);
            $builderc->groupBy('CONTRATO_CCONT');
            $builderc->orderBy('CONTRATO_CCONT');
            $resultado2=$builderc->get();

            if($resultado2->getNumRows()>0){
                foreach($resultado2->getResultArray() as $filas){
                    $campA=$filas['FOLIO_BAJA'];
                    $campB=$filas['IDUSUA_CLIEN'];
                    $campC=$filas['CONTRATO_CCONT'];
                    $campD=$filas['NOMBRE'];
                    $campE=$filas['NOMBRE_ESTA'];
                    $campF=$filas['NOMBRE_MUNIC'];
                    $campG=$filas['CODIPOST_CODPOS'];
                    $campH=$filas['COLONIA_COLON'];
                    $campI=$filas['CALLES'];
                    $campJ=$filas['DESCRIPCION_CONT'];
                    $campK=$filas['TIPO_CCONT'];
                    $campL=$filas['PERMISO_CCONT'];
                    $campM=$filas['DESCUENTO_CCONT'];
                    $campN=$filas['FECHACAP_CCONT'];
                    $campO=$filas['FBAJA_CCONT'];
                    $campP=$filas['IDBAJA_CCONT'];
                    $campQ=$filas['RESPONS'];
                }
                $arreglo=[
                    ['SELLODIGA'=>$campA.'|'.$campB.'|'.$campC.'|'.$campD.'|'.$campE.'|'.$campF.'|'.$campG.'|'.$campH.'|'.$campI.'|'.$campJ.'|'.$campK.'|'.$campL.'|'.$campM.'|'.$campN.'|'.$campO.'|'.$campP.'|'.$campQ],
                    ['SELLODIGA'=>base64_encode($campA.'|'.$campB.'|'.$campC.'|'.$campD.'|'.$campE.'|'.$campF.'|'.$campG.'|'.$campH.'|'.$campI.'|'.$campJ.'|'.$campK.'|'.$campL.'|'.$campM.'|'.$campN.'|'.$campO.'|'.$campP.'|'.$campQ)],
                ];
            }

            return [
                $recibo,
                $comite,
                // $arreglo,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaUbicacionModificar($id)
    {
        try {
            $parametros=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',UBICA_CCONT) AS idTablePk, CONTRATO_CCONT, 
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE,NOMBRE_ESTA,NOMBRE_MUNIC,CODIPOST_CODPOS,CODIPOSTAL_UBIC, 
            COLONIA_UBIC,CALLE_UBIC,NEXTE_UBIC,NINTE_UBIC,REFERENCIA_UBIC");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->where('IDUSUA_CLIEN',$parametros[0]);
            $builder->where('CONTRATO_CCONT',$parametros[1]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[MODUBICACION|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosUbicacion($datosParaGuardar)
    {
        try {
            $parametro=explode('_',$datosParaGuardar[1]);
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'user'=>$parametro[0],
                'argu'=>$parametro[1],
                'arg1'=>$parametro[2],
            ];
            $setActualizarUbicacion=[
                'COLONIA_UBIC'=>$datosParaGuardar[2],
                'CALLE_UBIC'=>$datosParaGuardar[3],
                'NEXTE_UBIC'=>$datosParaGuardar[4],
                'NINTE_UBIC'=>$datosParaGuardar[5],
                'REFERENCIA_UBIC'=>$datosParaGuardar[6],
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'FMODIF_UBIC'=>date('Y-m-d'),
            ];
            $builder=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builder->where('IDUSUA_UBIC',$parametro[0]);
            $builder->where('IDUBIC_UBIC',$parametro[2]);
            $builder->where('ESTATUS_UBIC','ACTI');
            $builder->set($setActualizarUbicacion);
            $builder->update($setActualizarUbicacion);
            log_message('notice','[MODUBICACION|Async] {captur} ha actualizado la ubicación de {arg1}.',$log_extra);
            
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaUsuarioContratos($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->where('IDUSUA_CLIEN',$id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AGRCONTRATOS|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                $usuario=$resultado->getResultArray();

            }

            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',UBICA_CCONT) AS idTablePk,CONTRATO_CCONT,NOMBRE_ESTA,
            NOMBRE_MUNIC,CODIPOST_CODPOS,COLONIA_COLON,CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,
            CONTRATO_CCONT, DESCRIPCION_CONT, PERMISO_CCONT");
            $buildera->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $buildera->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $buildera->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $buildera->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $buildera->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $buildera->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $buildera->join('cat_colonia','CLVCOLON_COLON=COLONIA_UBIC');
            $buildera->where('IDUSUA_CLIEN',$id);
            $buildera->where('ESTATUS_CLIEN','ACTI');
            $buildera->groupBy('CONTRATO_CCONT');
            $resultado1=$buildera->get();
            if($resultado1->getNumRows()>0){
                log_message('info','[BORCONTRATO|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                $contratos=$resultado1->getResultArray();

            }

            return [
                $usuario,
                $contratos,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosContratos($datosEliminar)
    {
        try {
            $parametro=explode('_',$datosEliminar[1]);
            $log_extra=[
                'captur'=>$datosEliminar[0],
                'user'=>$parametro[0],
                'item'=>$parametro[1],
            ];

            $builder=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builder->where('IDUSUA_UBIC',$parametro[0]);
            $builder->where('IDUBIC_UBIC',$parametro[2]);
            $builder->delete();
            log_message('notice','[BORCONTRATO|Async/Q] {captur} Eliminano datos de ubicacion de {item}.', $log_extra);
            $builderd=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORCONTRATO|Async/Q] Reindexando tabla tras eliminación.');

            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->where('USUARIO_DETA',$parametro[0]);
            $buildera->where('CONTRATO_DETA',$parametro[1]);
            $buildera->where('ESTATUS_DETA','ADEU');
            $buildera->delete();
            log_message('notice','[BORCONTRATO|Async/Q] Eliminando datos de pagos detalle de {user}.', $log_extra);
            $buildere=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORCONTRATO|Async/Q] Reindexando tabla tras eliminación.');

            $builderb=$this->dbBuild->table('sys_clientes_contratos');
            $builderb->where('CLIENTE_CCONT',$parametro[0]);
            $builderb->where('CONTRATO_CCONT',$parametro[1]);
            $builderb->delete();
            log_message('notice','[BORCONTRATO|Async/Q] Eliminando datos de contrato de {user}.', $log_extra);
            $builderf=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORCONTRATO|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaUsuariosContratosHoy()
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(`IDUSUA_CLIEN`,'_',CONTRATO_CCONT) AS `idTablePk`, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CONTRATO_CCONT, DESCRIPCION_CONT, FMODIF_CLIEN");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->like('FECHACAP_CCONT',date('Y-m-d'),'after');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->orderBy('FMODIF_CCONT','DESC' );
            $builder->limit(30);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[BORUSUARIOS|Async/Q] Generando datos desde consulta para continuar renderizado de tabla usuarios');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function contratoDatosUsuarioBorrar($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(`IDUSUA_CLIEN`,'_',CONTRATO_CCONT) AS `idTablePk`, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE,
            CONTRATO_CCONT, DESCRIPCION_CONT, FECHCAPT_CLIEN, CALLE_UBIC, NEXTE_UBIC, NINTE_UBIC");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('sys_clientes_ubicaciones','UBICA_CCONT=IDUBIC_UBIC');
            $builder->where('IDUSUA_CLIEN',$parametro[0]);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[BORUSUARIOS|Async/Q] Generando datos desde consulta para datos del usuarios');
                $usuario=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->select("CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $buildera->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildera->where('USUARIO_DETA',$parametro[0]);
            $buildera->where('CONTRATO_DETA',$parametro[1]);
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[BORUSUARIOS|Async/Q] Generando datos desde consulta para detales pago usuarios');
                $detalles=$resultado0->getResultArray();
            }

            return [
                $usuario,
                $detalles,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function eliminarDatosUsuarioContrato($datosEliminar)
    {
        try {
            $parametro=explode('_',$datosEliminar[1]);
            $log_extra=[
                'user'=>$parametro[0],
            ];

            $builder=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builder->where('IDUSUA_UBIC',$parametro[0]);
            $builder->delete();
            log_message('notice','[BORUSUARIOS|Async/Q] Eliminando datos de ubicacion de {user}.', $log_extra);
            $builderd=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORUSUARIOS|Async/Q] Reindexando tabla tras eliminación.');

            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->where('USUARIO_DETA',$parametro[0]);
            $buildera->where('CONTRATO_DETA',$parametro[1]);
            $buildera->where('ESTATUS_DETA','ADEU');
            $buildera->delete();
            log_message('notice','[BORUSUARIOS|Async/Q] Eliminando datos de pagos detalle de {user}.', $log_extra);
            $buildere=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORUSUARIOS|Async/Q] Reindexando tabla tras eliminación.');

            $builderb=$this->dbBuild->table('sys_clientes_contratos');
            $builderb->where('CLIENTE_CCONT',$parametro[0]);
            $builderb->where('CONTRATO_CCONT',$parametro[1]);
            $builderb->delete();
            log_message('notice','[BORUSUARIOS|Async/Q] Eliminando datos de contrato de {user}.', $log_extra);
            $builderf=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORUSUARIOS|Async/Q] Reindexando tabla tras eliminación.');

            $builderc=$this->dbBuild->table('sys_clientes');
            $builderc->where('IDUSUA_CLIEN',$parametro[0]);
            $builderc->delete();
            log_message('notice','[BORUSUARIOS|Async/Q] Eliminado datos de {user}', $log_extra);
            $builderg=$this->dbBuild->query('ALTER TABLE `sys_clientes_ubicaciones` AUTO_INCREMENT = 1;');
            log_message('notice','[BORUSUARIOS|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function autoDatosCompletarBajasTem($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("CONCAT(`USUARIO_CBAJA`,'_',CONTRATO_CBAJA) AS IDCONTRATO,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CONTRATO_CBAJA, FBAJA_CBAJA");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CBAJA');
            $builder->like('CONTRATO_CBAJA',$id,'both');
            $builder->where('ESTATUS_CBAJA','ACTI');
            $builder->where('ESTATUS_CCONT','INAC');
            $builder->groupBy('CONTRATO_CBAJA');
            $resultado=$builder->get();
            
            if($resultado->getNumRows()>0){
                log_message('info','[AACTCONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla contratos');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosEditarBajas($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("CONCAT(FOLIO_CBAJA,'_',`USUARIO_CBAJA`,'_',CONTRATO_CBAJA,'_',UBICA_CCONT) AS IDCONTRATO,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CONTRATO_CBAJA, ESTATUS_CCONT,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS DIRECCION, MOTIVBAJA_CBAJA,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS COMITE");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CBAJA');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('sys_responsables','IDUSUA_RESPO=IDBAJA_CBAJA');
            $builder->where('USUARIO_CBAJA',$parametro[0]);
            $builder->where('CONTRATO_CBAJA',$parametro[1]);
            $builder->where('ESTATUS_CBAJA','ACTI');
            $builder->groupBy('CONTRATO_CBAJA');
            $resultado=$builder->get();
            
            if($resultado->getNumRows()>0){
                log_message('info','[AACTCONTRATO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla contratos');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function reactivarBajasContratoBaja($datosParaGuardar)
    {
        try {
            $parametro=explode('_',$datosParaGuardar[1]);
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'argu'=>$parametro[0],
                'user'=>$parametro[1],
                'arg1'=>$parametro[2],
            ];
            $setBajaUsuario=[
                'FMODIF_CLIEN'=>date('Y-m-d'),
                'IDMODIF_CLIEN'=>$datosParaGuardar[0],
                'ESTATUS_CLIEN'=>$datosParaGuardar[2],
            ];
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->where('IDUSUA_CLIEN',$parametro[1]);
            $builder->where('ESTATUS_CLIEN','INAC');
            $builder->set($setBajaUsuario);
            $builder->update($setBajaUsuario);
            log_message('notice','[AACTCONTRATO|Async] {captur} ha activado la baja de {user}.',$log_extra);

            $setBajaContrato = [
                'FMODIF_CCONT'=>date('Y-m-d'),
                'IDMODIF_CCONT'=>$datosParaGuardar[0],
                'ESTATUS_CCONT'=>$datosParaGuardar[2],
            ];
            $buildera=$this->dbBuild->table('sys_clientes_contratos');
            $buildera->where('CLIENTE_CCONT',$parametro[1]);
            $buildera->where('CONTRATO_CCONT',$parametro[2]);
            $buildera->where('ESTATUS_CCONT','INAC');
            $buildera->set($setBajaContrato);
            $buildera->update($setBajaContrato);
            log_message('notice','[AACTCONTRATO|Async] {captur} ha activado la baja del contrato {argu}.',$log_extra);

            $setBajaUbicacion=[
                'FMODIF_UBIC'=>date('Y-m-d'),
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'ESTATUS_UBIC'=>$datosParaGuardar[2],
            ];
            $builderb=$this->dbBuild->table('sys_clientes_ubicaciones');
            $builderb->where('IDUSUA_UBIC',$parametro[1]);
            $builderb->where('IDUBIC_UBIC',$parametro[3]);
            $builderb->where('ESTATUS_UBIC','INAC');
            $builderb->set($setBajaUbicacion);
            $builderb->update($setBajaUbicacion);
            log_message('notice','[AACTCONTRATO|Async] {captur} ha activado la baja de la ubicacion de {user}.',$log_extra);
            
            $setReciboBaja=[
                'FREAC_CBAJA'=>date('Y-m-d'),
                'IDREAC_CBAJA'=>$datosParaGuardar[0],
                'MOTIVREAC_CBAJA'=>$datosParaGuardar[3],
                'IDMODIF_CBAJA'=>$datosParaGuardar[0],
                'FMODIF_CBAJA'=>date('Y-m-d'),
                'ESTATUS_CBAJA'=>'REAC',
            ];
            $builderc=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builderc->where('FOLIO_CBAJA',$parametro[0]);
            $builderc->where('USUARIO_CBAJA',$parametro[1]);
            $builderc->where('CONTRATO_CBAJA',$parametro[2]);
            $builderc->where('ESTATUS_CBAJA','ACTI');
            $builderc->set($setReciboBaja);
            $builderc->update($setReciboBaja);
            log_message('notice','[AACTCONTRATO|Async] {captur} ha reactivado baja para {user}.',$log_extra);
            
            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaContratoConvenio($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(`IDUSUA_CLIEN`,'_',CONTRATO_CCONT) AS `idTablePk`,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CONTRATO_CCONT,
            SUM(TOTAL_DETA) AS TOTAL_DETA, COALESCE(COUNT(DISTINCT(FOLIOCONV_CONV))) AS CONVENIOS");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_detalles','USUARIO_DETA=IDUSUA_CLIEN');
            $builder->join('sys_clientes_convenios','USUARIO_CONV=IDUSUA_CLIEN','left');
            $builder->where('CONTRATO_DETA=CONTRATO_CCONT');
            $builder->where('IDUSUA_CLIEN',$id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('IDUSUA_CLIEN, CONTRATO_CCONT');
            $builder->orderBy('TOTAL_DETA','DESC');
            $resultado=$builder->get();
            
            if($resultado->getNumRows()>0){
                log_message('info','[REGCONVENIO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla contratos');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosUsuarioDeudor($id)
    {
        try {
            $parametro=explode('_', $id);
            $convenios=null;

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA) AS `idTablePk`, CONTRATO_CCONT, CONCAT(`NOMBRE_CLIEN`,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS `NOMBRE`,SUM(TOTAL_DETA) AS TOTAL_DETA");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_detalles','USUARIO_DETA=IDUSUA_CLIEN');
            $builder->where('CONTRATO_DETA=CONTRATO_CCONT');
            $builder->where('IDUSUA_CLIEN', $parametro[0]);
            $builder->where('CONTRATO_CCONT', $parametro[1]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('IDUSUA_CLIEN, CONTRATO_CCONT');
            $builder->orderBy('NOMBRE_CLIEN', 'ASC');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[REGCONVENIO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla usuarios');
                $usuarioDeuda=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $buildera->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildera->where('USUARIO_DETA', $parametro[0]);
            $buildera->where('CONTRATO_DETA', $parametro[1]);
            $buildera->where('ESTATUS_DETA','ADEU');
            $buildera->groupBy('CODIGO_DETA');
            $buildera->orderBy('CODIGO_DETA','ASC');
            $resultado1=$buildera->get();

            if($resultado1->getNumRows()>0){
                log_message('info','[REGCONVENIO|Async/Q] Generando datos desde consulta para continuar renderizado de tabla detalles');
                $detalleDeuda=$resultado1->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_clientes');
            $builderb->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT) AS `idTablePk`, COALESCE(COUNT(DISTINCT(FOLIOCONV_CONV))) AS CONVENIOS,
            FECHALIQU_CONV, FOLIOCONV_CONV");
            $builderb->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builderb->join('sys_clientes_convenios','USUARIO_CONV=IDUSUA_CLIEN','left');
            $builderb->where('USUARIO_CONV',$parametro[0]);
            $builderb->where('CONTRATO_CONV',$parametro[1]);
            $builderb->groupBy('IDUSUA_CLIEN, CONTRATO_CCONT');
            $resultado2=$builderb->get();

            if($resultado2->getNumRows()>0){
                log_message('info','[REGCONVENIO|Async/Q] Generando datos desde consulta para obtener total de convenios del contrato');
                $convenios=$resultado2->getResultArray();
            }

            return [
                $usuarioDeuda,
                $detalleDeuda,
                $convenios,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDuplicadosConvenio($datosParaGuardar)
    {
        try {
            $parametro=explode('_', $datosParaGuardar[1]);
    
            $builder=$this->dbBuild->table('sys_clientes_convenios');
            $builder->select("USUARIO_CONV,FECHACAP_CONV,CONTRATO_CONV,FOLIOCONV_CONV");
            $builder->where('USUARIO_CONV',$parametro[0]);
            $builder->where('CONTRATO_CONV',$parametro[1]);
            $builder->where('ESTATUS_CONV','ACTI');
            $resultado=$builder->get();
            
            if($resultado->getNumRows()>0){
                log_message('info','[REGCONVENIO|Async] Generando datos de duplicidad retornando datos.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function crearDatosConvenio($datosParaGuardar)
    {
        try {
            $parametro=explode('_', $datosParaGuardar[1]);
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$parametro[0],
            ];
            $idCobroStamp=date('YmdHis');
            $setGuardarConvenio=[
                'FECHACAP_CONV'=>date('Y-m-d'),
                'HORACAP_CONV'=>date('H:i:s'),
                'CAPTURA_CONV'=>$datosParaGuardar[0],
                'FOLIOCONV_CONV'=>date('YmdHis'),
                'USUARIO_CONV'=>$parametro[0],
                'CONTRATO_CONV'=>$parametro[1],
                'DEUDATOTAL_CONV'=>$datosParaGuardar[2],
                'FECHALIQU_CONV'=>$datosParaGuardar[3],
                'PAULATINOS_CONV'=>$datosParaGuardar[4],
                'MONTOS_CONV'=>$datosParaGuardar[5],
                'ABONO_CONV'=>$datosParaGuardar[7],
                'RESTANTE_CONV'=>$datosParaGuardar[6],
                'IDMODIF_CONV'=>$datosParaGuardar[0],
                'FMODIF_CONV'=>date('Y-m-d'),
                'ESTATUS_CONV'=>'ACTI',
            ];

            $buildera=$this->dbBuild->table('sys_clientes_convenios');
            $buildera->insert($setGuardarConvenio);
            print_r($buildera);
            log_message('notice','[REGCONVENIO|Async/Q] {captur} creo un convenio nuevo para {item} continua proceso.',$log_extra);

            $builderb=$this->dbBuild->table('sys_clientes_detalles');
            $builderb->select("SUM(TOTAL_DETA) AS TOTAL_DETA");
            $builderb->where('USUARIO_DETA', $parametro[0]);
            $builderb->where('CONTRATO_DETA', $parametro[1]);
            $builderb->whereIn('CODIGO_DETA',$datosParaGuardar[8]);
            $builderb->where('ESTATUS_DETA','ADEU');
            $resultado0=$builderb->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[REGCONVENIO|Async/Q] Verificando el total de deuda mediante los codigos seleccionados.');
                foreach($resultado0->getResultArray() as $filas){
                    $totalPagado=$filas['TOTAL_DETA'];
                }
                $setCrearCobro=[
                    'FECHACAP_COBR'=>date('Y-m-d'),
                    'HORACAP_COBR'=>date('H:i:s'),
                    'CAPTURA_COBR'=>$datosParaGuardar[0],
                    'IDCOBRO_COBR'=>$idCobroStamp,
                    'IDUSUARIO_COBR'=>$parametro[0],
                    'CONTRATO_COBR'=>$parametro[1],
                    'CONCEPTO_COBR'=>'Pago Servicios (Convenio)',
                    'TOTAL_COBR'=>$totalPagado,
                    'IDMODIF_COBR'=>$datosParaGuardar[0],
                    'FMODIF_COBR'=>date('Y-m-d'),
                    'ESTATUS_COBR'=>'ADEU',
                ];
                $builderc=$this->dbBuild->table('sys_clientes_cobros');
                $builderc->select("IDCOBRO_COBR");
                $builderc->where('IDUSUARIO_COBR',$parametro[0]);
                $builderc->where('CONTRATO_COBR',$parametro[1]);
                $builderc->where('CONCEPTO_COBR','Pago Servicios (Convenio)');
                $builderc->where('ESTATUS_COBR','ADEU');
                $resultados2=$builderc->get();
                if($resultados2->getNumRows()>0){
                    log_message('info','[REGCONVENIO|Async/Q] Se detecto que si existe un cobro abierto pendiente para {item}.',$log_extra);
                    foreach($resultados2->getResultArray() as $filass){
                        $idCobroElim[]=$filass['IDCOBRO_COBR'];
                    }
                    $setQuitarCobroDetalle=[
                        'IDCOBRO_DETA'=>'',
                        'IDMODIF_DETA'=>$datosParaGuardar[0],
                        'FMODIF_DETA'=>date('Y-m-d'),
                    ];
                    $builderd=$this->dbBuild->table('sys_clientes_detalles');
                    $builderd->where('USUARIO_DETA',$parametro[0]);
                    $builderd->where('CONTRATO_DETA',$parametro[1]);
                    //$builderd->whereIn('CODIGO_DETA',$datosParaGuardar[8]);
                    $builderd->where('ESTATUS_DETA','ADEU');
                    $builderd->set($setQuitarCobroDetalle);
                    $builderd->update($setQuitarCobroDetalle);
                    log_message('notice','[REGCONVENIO|Async/Q] Quitando id de cobro de estructura detalles para {item}.',$log_extra);

                    $buildere=$this->dbBuild->table('sys_clientes_cobros');
                    $buildere->where('IDUSUARIO_COBR',$parametro[0]);
                    $buildere->where('CONTRATO_COBR',$parametro[1]);
                    $buildere->whereIn('IDCOBRO_COBR',$idCobroElim);
                    $buildere->where('ESTATUS_COBR','ADEU');
                    $buildere->delete();
                    log_message('notice','[REGCONVENIO|Async/Q] Registro eliminado de estructura cobros correctamente.');
                    $builderf=$this->dbBuild->query('ALTER TABLE `sys_clientes_cobros` AUTO_INCREMENT = 1');
                    log_message('notice','[REGCONVENIO|Async/Q] Reindexando estructura tras eliminación.');
                    $builderg=$this->dbBuild->table('sys_clientes_cobros');
                    $builderg->insert($setCrearCobro);
                    log_message('notice','[REGCONVENIO|Async/Q] {captur} creo un ticket de cobro para {item} mediante convenio.',$log_extra);


                }else{
                    log_message('info','[REGCONVENIO|Async/Q] No se detecto cobro abierto para {item} continua proceso.',$log_extra);
                    $builderg=$this->dbBuild->table('sys_clientes_cobros');
                    $builderg->insert($setCrearCobro);
                    log_message('notice','[REGCONVENIO|Async/Q] {captur} creo un ticket de cobro para {item} mediante convenio.',$log_extra);

                }
                $setActualizaDetalle=[
                    'IDCOBRO_DETA'=>$idCobroStamp,
                    'IDMODIF_DETA'=>$datosParaGuardar[0],
                    'FMODIF_DETA'=>date('Y-m-d'),
                ];
                $builderh=$db->table('sys_clientes_detalles');
                $builderh->where('USUARIO_DETA',$parametro[0]);
                $builderh->where('CONTRATO_DETA',$parametro[1]);
                $builderh->whereIn('CODIGO_DETA',$datosParaGuardar[8]);
                $builderh->where('ESTATUS_DETA','ADEU');
                $builderh->set($setActualizaDetalle);
                $builderh->update($setActualizaDetalle);
                log_message('notice','[REGCONVENIO|Async/Q] {captur} actualiza meses de abono para este convenio de {item}.',$log_extra);

                return true;

                
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }




    public function autocompletarDatosUsuario($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, CODBARR_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->like('NOMBRE_CLIEN',$id,'after');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $builder->orderBy('NOMBRE_CLIEN, APATERNO_CLIEN');
            $builder->limit(100);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[TRAMITES|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function autocompletarDatosContrato($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT) AS IDCONTRATO, 
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, CONTRATO_CCONT");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->like('CONTRATO_CCONT',$id,'both');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $builder->limit(100);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[TRAMITES|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function firmaDatosComiteTramites()
    {
        try {
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $builder->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $builder->where('PUESTO_RESPO','COMIPRESI');
            $builder->where('ESTATUS_RESPO','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                $presid= $resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_responsables');
            $buildera->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $buildera->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $buildera->where('PUESTO_RESPO','COMITESOR');
            $buildera->where('ESTATUS_RESPO','ACTI');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                $tesore= $resultado0->getResultArray();
            }

            return [
                $presid,
                $tesore,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }





}






 ?>
