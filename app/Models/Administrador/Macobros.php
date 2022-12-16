<?php

namespace App\Models\Administrador;
use CodeIgniter\Model;

class Macobros extends Model
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
            log_message('info','[ACOBROS] Envio de datos para renderizado de parametros web');
            return $resultado->getResultArray();
        }
    }

    public function cargarDatosDeudasDetalle($datosRevisar)
    {
        try {
            $parametros=explode('_',$datosRevisar[1]);
            $datosDetalle=null;
            $log_extra=[
                'user'=>$parametros[0],
            ];
            log_message('info','[PAGOSERVICIO|Async/Q] Comprobando atrasos en pagos de servicios para {user}', $log_extra);
            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select('CODIGO_DETA');
            $builder->where('USUARIO_DETA', $parametros[0]);
            $builder->where('CONTRATO_DETA', $parametros[1]);
            $builder->where('CODIGO_DETA <',date('Ym').$datosRevisar[2]);
            $builder->like('CODIGO_DETA',$datosRevisar[2],'before');
            $builder->where('ESTATUS_DETA','ADEU');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Se detectaron adeudos comprobando si se aplico recargos para {user}', $log_extra);
                foreach ($resultado0->getResultArray() as $value) {
                    $mesRecargos=$value['CODIGO_DETA'];

                    $buildera=$this->dbBuild->table('sys_clientes_detalles');
                    $buildera->select('CODIGO_DETA','ESTATUS_DETA');
                    $buildera->where('CODIGO_DETA', substr($mesRecargos,0,6).'RSA');
                    $buildera->where('USUARIO_DETA', $parametros[0]);
                    $buildera->where('CONTRATO_DETA', $parametros[1]);
                    $buildera->whereIn('ESTATUS_DETA', ['ADEU','PAGA']);
                    $resultado1=$buildera->get();
                    if(!$resultado1->getNumRows()>0){
                        log_message('info','[PAGOSERVICIO|Async/Q] No se encontraron recargos aplicados para {user}', $log_extra);
                        $builderb=$this->dbBuild->query("
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
                                '".$datosRevisar[0]."',
                                '".$parametros[0]."',
                                '".$parametros[1]."',
                                CLAVE_CONC,
                                '1',
                                COSTO_CONC,
                                COSTO_CONC,
                                '".$datosRevisar[0]."',
                                curdate(),
                                'ADEU'
                            FROM cat_conceptos
                            WHERE
                            CLAVE_CONC = '".substr($mesRecargos,0,6)."RSA' AND
                            ESTATUS_CONC='ACTI'
                        ");
                        log_message('info','[PAGOSERVICIO|Async/Q] Creando recargos '.substr($mesRecargos,0,6).'RSA para {user}', $log_extra);

                    }
                }
            }

            log_message('info','[PAGOSERVICIO|Async] Comprobar que exista el concepto de mes corriente para {user}', $log_extra);
            $builderc=$this->dbBuild->table('sys_clientes_detalles');
            $builderc->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, 
            CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $builderc->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builderc->where('USUARIO_DETA', $parametros[0]);
            $builderc->where('CONTRATO_DETA', $parametros[1]);
            $builderc->like('CODIGO_DETA', date('Ym').$datosRevisar[2]);
            $builderc->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
            $builderc->groupBy('CODIGO_DETA');
            $resultado3=$builderc->get();

            if(!$resultado3->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] No hay mes corriente cargado en los registros de {user}', $log_extra);

                $builderd=$this->dbBuild->query("
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
                    '".$datosRevisar[0]."',
                    '".$parametros[0]."',
                    '".$parametros[1]."',
                    CLAVE_CONC,
                    '1',
                    COSTO_CONC,
                    COSTO_CONC,
                    '".$datosRevisar[0]."',
                    curdate(),
                    'ADEU'
                    FROM cat_conceptos
                    WHERE
                    CLAVE_CONC like '".date('Ym').$datosRevisar[2]."' AND
                    ESTATUS_CONC='ACTI'
                ");
                log_message('info','[PAGOSERVICIO|Async/Q] Creando mes corriente para pagar de {user}', $log_extra);

            }

            $buildere=$this->dbBuild->table('sys_clientes_detalles');
            $buildere->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, 
            CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $buildere->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildere->where('USUARIO_DETA', $parametros[0]);
            $buildere->where('CONTRATO_DETA', $parametros[1]);
            $buildere->where('ESTATUS_DETA','ADEU');
            $buildere->groupBy('CODIGO_DETA');
            $buildere->orderBy('CODIGO_DETA', 'ASC');
            $resultado2=$buildere->get();

            if($resultado2->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta enviando datos para renderizar detalle de {user}', $log_extra);
                $datosDetalle=$resultado2->getResultArray();
            }

            $buildere=$this->dbBuild->table('sys_clientes_detalles');
            $buildere->select("SUM(TOTAL_DETA) AS TOTAL_DETA");
            $buildere->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildere->where('USUARIO_DETA', $parametros[0]);
            $buildere->where('CONTRATO_DETA', $parametros[1]);
            $buildere->where('ESTATUS_DETA', 'ADEU');
            $resultado3=$buildere->get();

            if($resultado3->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta para actualizar el costo del pedido');
                $datosTotal=$resultado3->getResultArray();
            }

            return [
                $datosDetalle,
                $datosTotal,
            ];


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cargarDatosHistoricoPagado($id)
    {
        try {
            $parametros = explode('_',$id);
            $log_extra=[
                'user'=>$parametros[0],
            ];

            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select("CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, DESCRIPCION_ESTAT");
            $builder->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_DETA');
            $builder->where('USUARIO_DETA', $parametros[0]);
            $builder->where('CONTRATO_DETA', $parametros[1]);
            $builder->where('ESTATUS_DETA','PAGA');
            $builder->groupBy('CODIGO_DETA');
            $builder->orderBy('CODIGO_DETA', 'DESC');
            $builder->limit(13);
            $resultado2=$builder->get();

            if($resultado2->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta enviando datos para renderizar detalle pagado de {user}', $log_extra);
                return $resultado2->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDuplicadosConceptosDetalle($datosParaAgregar)
    {
        try {
            $parametros = explode('_',$datosParaAgregar[1]);

            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select("CODIGO_DETA, DESCRIPCION_CONC, COSTO_DETA");
            $builder->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builder->where('USUARIO_DETA',$parametros[0]);
            $builder->where('CONTRATO_DETA',$parametros[1]);
            $builder->where('CODIGO_DETA',$datosParaAgregar[2]);
            $builder->where('ESTATUS_DETA','ADEU');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function agregarDatosConceptosDetalle($datosParaAgregar)
    {
        try {
            $parametros = explode('_',$datosParaAgregar[1]);

            $log_extra=[
                'user'=>$datosParaAgregar[0],
                'item'=>$datosParaAgregar[2],
                'item2'=>$parametros[1],
            ];

            $builder=$this->dbBuild->table('cat_conceptos');
            $builder->select('CLAVE_CONC, COSTO_CONC');
            $builder->where('CLAVE_CONC', $datosParaAgregar[2]);
            $builder->where('ESTATUS_CONC','ACTI');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos para aplicar el costo del concepto agregado');
                foreach($resultado0->getResultArray() as $filas){
                    $codigo=$filas['CLAVE_CONC'];
                    $costo=$filas['COSTO_CONC'];
                }
            }

            $setCreaDetalle=[
                'FECHACAP_DETA'=>date('Y-m-d'),
                'HORACAP_DETA'=>date('H:i:s'),
                'CAPTURA_DETA'=>$datosParaAgregar[0],
                'USUARIO_DETA'=>$parametros[0],
                'CONTRATO_DETA'=>$parametros[1],
                'CODIGO_DETA'=>$datosParaAgregar[2],
                'CANTIDAD_DETA'=>'1',
                'COSTO_DETA'=>$costo,
                'TOTAL_DETA'=>$costo,
                'IDMODIF_DETA'=>$datosParaAgregar[0],
                'FMODIF_DETA'=>date('Y-m-d'),
                'ESTATUS_DETA'=>'ADEU',
            ];
            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->insert($setCreaDetalle);
            log_message('notice','[PAGOSERVICIO|Async/Q] {user} agrego concepto {item} al pedido de {item2}', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosDetallesPago($datosParaEliminar)
    {
        try {
            $parametros = explode('_',$datosParaEliminar[1]);

            $log_extra=[
                'user'=>$datosParaEliminar[0],
                'item'=>$parametros[0],
                'item2'=>$parametros[2],
            ];

            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->where('USUARIO_DETA',$parametros[0]);
            $builder->where('CONTRATO_DETA',$parametros[1]);
            $builder->where('CODIGO_DETA',$parametros[2]);
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->delete();
            log_message('notice','[PAGOSERVICIO|Async/Q] {user} elimino el registro {item2} de estructura detalle pago de {item}.', $log_extra);

            $buildera=$this->dbBuild->query('ALTER TABLE `sys_clientes_detalles` AUTO_INCREMENT = 1');
            log_message('notice','[PAGOSERVICIO|Async/Q] Reindexando tabla tras eliminación.');

            return true;


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosCooperacion($id)
    {
        try {
            $parametros = explode('_',$id);

            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS CODIGOCAMBIO, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA");
            $buildera->join('cat_conceptos', 'CLAVE_CONC=CODIGO_DETA');
            $buildera->where('USUARIO_DETA', $parametros[0]);
            $buildera->where('CONTRATO_DETA', $parametros[1]);
            $buildera->where('CODIGO_DETA', $parametros[2]);
            $buildera->whereIn('ESTATUS_DETA',['ADEU']);
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos para cobro del mes corriente generando pedido y detalles');
                return $resultado0->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function modificarDatosCoperacion($datosParaActualizar)
    {
        try {
            $parametros = explode('_',$datosParaActualizar[1]);
            $log_extra=[
                'user'=>$datosParaActualizar[0],
                'item'=>$datosParaActualizar[2],
                'item2'=>$parametros[0],
            ];
            $totalCosto = $datosParaActualizar[2]*$datosParaActualizar[3];
            $setActualizaCoope=[
                'CANTIDAD_DETA'=>$datosParaActualizar[2],
                'COSTO_DETA'=>$datosParaActualizar[3],
                'TOTAL_DETA'=>$totalCosto,
                'IDMODIF_DETA'=>$datosParaActualizar[0],
                'FMODIF_DETA'=>date('Y-m-d'),
                'ESTATUS_DETA'=>'ADEU',
            ];
            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->where('USUARIO_DETA', $parametros[0]);
            $buildera->where('CONTRATO_DETA', $parametros[1]);
            $buildera->where('CODIGO_DETA', $parametros[2]);
            $buildera->set($setActualizaCoope);
            $buildera->update($setActualizaCoope);
            log_message('notice','[PAGOSERVICIO|Async/Q] {user} actualizo totales {item} al detalle de {item2}', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosTotalPago($id)
    {
        try {
            $parametros = explode('_',$id);

            $buildere=$this->dbBuild->table('sys_clientes_detalles');
            $buildere->select("SUM(TOTAL_DETA) AS TOTAL_DETA");
            $buildere->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildere->where('USUARIO_DETA', $parametros[0]);
            $buildere->where('CONTRATO_DETA', $parametros[1]);
            $buildere->where('ESTATUS_DETA', 'ADEU');
            $resultado2=$buildere->get();

            if($resultado2->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta para actualizar el costo del pedido');
                return $resultado2->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function realizarDatosPagoCuenta($datosParaCompletar)
    {
        try {
            $parametros = explode('_',$datosParaCompletar[1]);

            $log_extra=[
                'user'=>$datosParaCompletar[0],
                'item'=>$parametros[0],
                'item2'=>$parametros[1],
            ];

            $builderc=$this->dbBuild->table('sys_clientes_cobros');
            $builderc->selectMax('(CONSECUTIVO_COBR)+1','CONSECUTIVO_COBR');
            $builderc->where('ESTATUS_COBR','PAGA');
            $resultado0=$builderc->get();
            foreach($resultado0->getResultArray() as $filas){
                $secuenciaCobro=$filas['CONSECUTIVO_COBR'];
            }
            if($secuenciaCobro==''){
                $secuenciaCobro=1;
            }

            $setMovimiento=date('YmdHis');

            $setPedidoCobro=[
                'FECHACAP_COBR'=>date('Y-m-d'),
                'HORACAP_COBR'=>date('H:i:s'),
                'CAPTURA_COBR'=>$datosParaCompletar[0],
                'IDCOBRO_COBR'=>$setMovimiento,
                'CONSECUTIVO_COBR'=>str_pad($secuenciaCobro,10,'0', STR_PAD_LEFT),
                'IDUSUARIO_COBR'=>$parametros[0],
                'CONTRATO_COBR'=>$parametros[1],
                'CONCEPTO_COBR'=>'Pago de Servicios',
                'TOTAL_COBR'=>$datosParaCompletar[2],
                'IDMODIF_COBR'=>$datosParaCompletar[0],
                'FMODIF_COBR'=>date('Y-m-d'),
                'ESTATUS_COBR'=>'PAGA',
            ];
            $buildera=$this->dbBuild->table('sys_clientes_cobros');
            $buildera->insert($setPedidoCobro);
            log_message('info','[PAGOSERVICIO|Async/Q] {user} ha realizado el cobro de servicios para {item}.', $log_extra);

            $setCompletaPago = [
                'FECHACAP_PAGO'=>date('Y-m-d'),
                'HORACAP_PAGO'=>date('H:i:s'),
                'CAPTURA_PAGO'=>$datosParaCompletar[0],
                'IDCOBRO_PAGO'=>$setMovimiento,
                'CONTRATO_PAGO'=>$parametros[1],
                'USUARIO_PAGO'=>$parametros[0],
                'METODO_PAGO'=>$datosParaCompletar[3],
                'TOTAL_PAGO'=>$datosParaCompletar[2],
                'RECIBO_PAGO'=>$datosParaCompletar[4],
                'CAMBIO_PAGO'=>$datosParaCompletar[5],
                'IDMODIF_PAGO'=>$datosParaCompletar[0],
                'FMODIF_PAGO'=>date('Y-m-d'),
                'ESTATUS_PAGO'=>'PAGA',
            ];
            $builderb=$this->dbBuild->table('sys_clientes_pagos');
            $builderb->insert($setCompletaPago);
            log_message('info','[PAGOSERVICIO|Async/Q] {user} crea datos de pago para pedido {item}.', $log_extra);


            $setActualizaDetalle = [
                'IDCOBRO_DETA'=>$setMovimiento,
                'IDMODIF_DETA'=>$datosParaCompletar[0],
                'FMODIF_DETA'=>date('Y-m-d'),
                'ESTATUS_DETA'=>'PAGA',
            ];
            $builderc=$this->dbBuild->table('sys_clientes_detalles');
            $builderc->where('USUARIO_DETA', $parametros[0]);
            $builderc->where('CONTRATO_DETA', $parametros[1]);
            $builderc->where('ESTATUS_DETA','ADEU');
            $builderc->set($setActualizaDetalle);
            $builderc->update($setActualizaDetalle);
            log_message('info','[PAGOSERVICIO|Async/Q] {user} actualizando estatus de pago en detalle {item}.', $log_extra);


            $builderd=$this->dbBuild->table('sys_clientes_cobros');
            $builderd->select("CONCAT(IDCOBRO_COBR,'_',IDUSUARIO_COBR,'_',CONTRATO_COBR) AS `idTablePk`, IDCOBRO_COBR, CONTRATO_COBR, CONCEPTO_COBR, TOTAL_COBR, FMODIF_COBR");
            $builderd->where('IDCOBRO_COBR', $setMovimiento);
            $builderd->where('IDUSUARIO_COBR', $parametros[0]);
            $builderd->where('CONTRATO_COBR', $parametros[1]);
            $builderd->where('ESTATUS_COBR','PAGA');
            $resultado0=$builderd->get();

            if($resultado0->getNumRows()>0){
                return $resultado0->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function realizarDatosPagoParcialCuenta($datosParaCompletar)
    {
        try {
            $parametros = explode('_', $datosParaCompletar[1]);

            $log_extra=[
                'user'=>$datosParaCompletar[0],
                'item'=>$parametros[0],
                'item2'=>$parametros[1],
            ];

            $builderc=$this->dbBuild->table('sys_clientes_cobros');
            $builderc->selectMax('(CONSECUTIVO_COBR)+1','CONSECUTIVO_COBR');
            $builderc->where('ESTATUS_COBR','PAGA');
            $resultado0=$builderc->get();
            foreach($resultado0->getResultArray() as $filas){
                $secuenciaCobro=$filas['CONSECUTIVO_COBR'];
            }
            if($secuenciaCobro==''){
                $secuenciaCobro=1;
            }

            $setMovimiento=date('YmdHis');

            $setPedidoCobro=[
                'FECHACAP_COBR'=>date('Y-m-d'),
                'HORACAP_COBR'=>date('H:i:s'),
                'CAPTURA_COBR'=>$datosParaCompletar[0],
                'IDCOBRO_COBR'=>$setMovimiento,
                'CONSECUTIVO_COBR'=>str_pad($secuenciaCobro,10,'0', STR_PAD_LEFT),
                'IDUSUARIO_COBR'=>$parametros[0],
                'CONTRATO_COBR'=>$parametros[1],
                'CONCEPTO_COBR'=>'Pago de Servicios',
                'TOTAL_COBR'=>$datosParaCompletar[2],
                'IDMODIF_COBR'=>$datosParaCompletar[0],
                'FMODIF_COBR'=>date('Y-m-d'),
                'ESTATUS_COBR'=>'PAGA',
            ];
            $buildera=$this->dbBuild->table('sys_clientes_cobros');
            $buildera->insert($setPedidoCobro);
            log_message('info','[PAGOSERVICIO|Async/Q] {user} ha realizado el cobro de servicios para {item}.', $log_extra);

            $setCompletaPago = [
                'FECHACAP_PAGO'=>date('Y-m-d'),
                'HORACAP_PAGO'=>date('H:i:s'),
                'CAPTURA_PAGO'=>$datosParaCompletar[0],
                'IDCOBRO_PAGO'=>$setMovimiento,
                'CONTRATO_PAGO'=>$parametros[1],
                'USUARIO_PAGO'=>$parametros[0],
                'METODO_PAGO'=>$datosParaCompletar[3],
                'TOTAL_PAGO'=>$datosParaCompletar[2],
                'RECIBO_PAGO'=>$datosParaCompletar[4],
                'CAMBIO_PAGO'=>$datosParaCompletar[5],
                'IDMODIF_PAGO'=>$datosParaCompletar[0],
                'FMODIF_PAGO'=>date('Y-m-d'),
                'ESTATUS_PAGO'=>'PAGA',
            ];
            $builderb=$this->dbBuild->table('sys_clientes_pagos');
            $builderb->insert($setCompletaPago);
            log_message('info','[PAGOSERVICIO|Async/Q] {user} crea datos de pago para pedido {item}.', $log_extra);


            $setActualizaDetalle = [
                'IDCOBRO_DETA'=>$setMovimiento,
                'IDMODIF_DETA'=>$datosParaCompletar[0],
                'FMODIF_DETA'=>date('Y-m-d'),
                'ESTATUS_DETA'=>'PAGA',
            ];
            $builderc=$this->dbBuild->table('sys_clientes_detalles');
            $builderc->where('USUARIO_DETA', $parametros[0]);
            $builderc->where('CONTRATO_DETA', $parametros[1]);
            $builderc->whereIn('CODIGO_DETA', $datosParaCompletar[6]);
            $builderc->where('ESTATUS_DETA','ADEU');
            $builderc->set($setActualizaDetalle);
            $builderc->update($setActualizaDetalle);
            log_message('info','[PAGOSERVICIO|Async/Q] {user} actualizando estatus de pago en detalle {item}.', $log_extra);


            $builderd=$this->dbBuild->table('sys_clientes_cobros');
            $builderd->select("CONCAT(IDCOBRO_COBR,'_',IDUSUARIO_COBR,'_',CONTRATO_COBR) AS `idTablePk`, IDCOBRO_COBR, CONTRATO_COBR, CONCEPTO_COBR, TOTAL_COBR, FMODIF_COBR");
            $builderd->where('IDCOBRO_COBR', $setMovimiento);
            $builderd->where('IDUSUARIO_COBR', $parametros[0]);
            $builderd->where('CONTRATO_COBR', $parametros[1]);
            $builderd->where('ESTATUS_COBR','PAGA');
            $resultado0=$builderd->get();

            if($resultado0->getNumRows()>0){
                return $resultado0->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cargarDatosDeudasEspeciales($datosRevisar)
    {
        try {
            $parametros=explode('_',$datosRevisar[1]);
            $datosDetalle=null;
            $log_extra=[
                'user'=>$parametros[0],
            ];

            $buildere=$this->dbBuild->table('sys_clientes_detalles');
            $buildere->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, 
            CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $buildere->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildere->where('USUARIO_DETA', $parametros[0]);
            $buildere->where('CONTRATO_DETA', $parametros[1]);
            $buildere->where('ESTATUS_DETA','ADEU');
            $buildere->groupBy('CODIGO_DETA');
            $buildere->orderBy('CODIGO_DETA', 'ASC');
            $resultado2=$buildere->get();

            if($resultado2->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta enviando datos para renderizar detalle de {user}', $log_extra);
                $datosDetalle=$resultado2->getResultArray();
            }

            $buildere=$this->dbBuild->table('sys_clientes_detalles');
            $buildere->select("SUM(TOTAL_DETA) AS TOTAL_DETA");
            $buildere->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $buildere->where('USUARIO_DETA', $parametros[0]);
            $buildere->where('CONTRATO_DETA', $parametros[1]);
            $buildere->where('ESTATUS_DETA', 'ADEU');
            $resultado3=$buildere->get();

            if($resultado3->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta para actualizar el costo del pedido');
                $datosTotal=$resultado3->getResultArray();
            }

            return [
                $datosDetalle,
                $datosTotal,
            ];


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function realizarDatosAjusteParcial($datosParaCompletar)
    {
        try {
            $parametros = explode('_', $datosParaCompletar[1]);

            $log_extra=[
                'user'=>$datosParaCompletar[0],
                'item'=>$parametros[0],
                'item2'=>$parametros[1],
            ];

            $builderc=$this->dbBuild->table('sys_clientes_cobros');
            $builderc->selectMax('(CONSECUTIVO_COBR)+1','CONSECUTIVO_COBR');
            $builderc->like('CONSECUTIVO_COBR','A','after');
            $builderc->where('ESTATUS_COBR','PAGA');
            $resultado0=$builderc->get();
            foreach($resultado0->getResultArray() as $filas){
                $secuenciaCobro=$filas['CONSECUTIVO_COBR'];
            }
            if($secuenciaCobro==''){
                $secuenciaCobro=1;
            }

            $setMovimiento=date('YmdHis');

            $setPedidoCobro=[
                'FECHACAP_COBR'=>'2020-01-01',
                'HORACAP_COBR'=>date('H:i:s'),
                'CAPTURA_COBR'=>$datosParaCompletar[0],
                'IDCOBRO_COBR'=>$setMovimiento,
                'CONSECUTIVO_COBR'=>'A'.str_pad($secuenciaCobro,9,'0', STR_PAD_LEFT),
                'IDUSUARIO_COBR'=>$parametros[0],
                'CONTRATO_COBR'=>$parametros[1],
                'CONCEPTO_COBR'=>'Ajuste de pagos',
                'TOTAL_COBR'=>$datosParaCompletar[2],
                'IDMODIF_COBR'=>$datosParaCompletar[0],
                'FMODIF_COBR'=>'2020-01-01',
                'ESTATUS_COBR'=>'PAGA',
            ];
            $buildera=$this->dbBuild->table('sys_clientes_cobros');
            $buildera->insert($setPedidoCobro);
            log_message('info','[PAGOESPECIAL|Async/Q] {user} ha realizado el cobro de servicios para {item}.', $log_extra);

            $setCompletaPago = [
                'FECHACAP_PAGO'=>'2020-01-01',
                'HORACAP_PAGO'=>date('H:i:s'),
                'CAPTURA_PAGO'=>$datosParaCompletar[0],
                'IDCOBRO_PAGO'=>$setMovimiento,
                'CONTRATO_PAGO'=>$parametros[1],
                'USUARIO_PAGO'=>$parametros[0],
                'METODO_PAGO'=>$datosParaCompletar[3],
                'TOTAL_PAGO'=>$datosParaCompletar[2],
                'RECIBO_PAGO'=>$datosParaCompletar[4],
                'CAMBIO_PAGO'=>$datosParaCompletar[5],
                'IDMODIF_PAGO'=>$datosParaCompletar[0],
                'FMODIF_PAGO'=>'2020-01-01',
                'ESTATUS_PAGO'=>'PAGA',
            ];
            $builderb=$this->dbBuild->table('sys_clientes_pagos');
            $builderb->insert($setCompletaPago);
            log_message('info','[PAGOESPECIAL|Async/Q] {user} crea datos de pago para pedido {item}.', $log_extra);


            $setActualizaDetalle = [
                'IDCOBRO_DETA'=>$setMovimiento,
                'IDMODIF_DETA'=>$datosParaCompletar[0],
                'FMODIF_DETA'=>'2020-01-01',
                'ESTATUS_DETA'=>'PAGA',
            ];
            $builderc=$this->dbBuild->table('sys_clientes_detalles');
            $builderc->where('USUARIO_DETA', $parametros[0]);
            $builderc->where('CONTRATO_DETA', $parametros[1]);
            $builderc->whereIn('CODIGO_DETA', $datosParaCompletar[6]);
            $builderc->where('ESTATUS_DETA','ADEU');
            $builderc->set($setActualizaDetalle);
            $builderc->update($setActualizaDetalle);
            log_message('info','[PAGOESPECIAL|Async/Q] {user} actualizando estatus de pago en detalle {item}.', $log_extra);


            $builderd=$this->dbBuild->table('sys_clientes_cobros');
            $builderd->select("CONCAT(IDCOBRO_COBR,'_',IDUSUARIO_COBR,'_',CONTRATO_COBR) AS `idTablePk`, IDCOBRO_COBR, CONTRATO_COBR, CONCEPTO_COBR, TOTAL_COBR, FMODIF_COBR");
            $builderd->where('IDCOBRO_COBR', $setMovimiento);
            $builderd->where('IDUSUARIO_COBR', $parametros[0]);
            $builderd->where('CONTRATO_COBR', $parametros[1]);
            $builderd->where('ESTATUS_COBR','PAGA');
            $resultado0=$builderd->get();

            if($resultado0->getNumRows()>0){
                return $resultado0->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }
    
    public function buscarDatosUsuariosTotal()
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_contratos');
            $builder->select("COUNT(DISTINCT(CONTRATO_CCONT)) AS TOTALES, DESCRIPCION_CTARI, DESCUENTO_CCONT");
            $builder->join('cat_contratosTarifas','DESCUENTO_CCONT=CLAVE_CTARI');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('DESCUENTO_CCONT');
            $builder->orderBy('DESCRIPCION_CTARI','DESC');
            $resultados0=$builder->get();

            if($resultados0->getNumRows()>0){
                log_message('info','[CREARCARGO|Async/Q] Generando datos desde consulta para obtener total contratos tarifa');
                return $resultados0->getResultArray();
            }


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function verificarDatosMesCorriente($id)
    {
        try {
            $parametros = explode('_',$id);
            $log_extra=[
                'user'=>$parametros[0],
            ];
            $builder=$this->dbBuild->table('sys_clientes_contratos');
            $builder->select("CONCAT(CONTRATO_CCONT,'_',CLIENTE_CCONT) AS CONTRATOS");
            $builder->where('DESCUENTO_CCONT',$parametros[1]);
            $builder->where('ESTATUS_CCONT','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CREARCARGO|Async/Q] Generando datos desde consulta agregar mes corriente faltante');
                foreach($resultado->getResultArray() as $filas){
                    $contratosArray[]=$filas['CONTRATOS'];
                }
            }
            return [$contratosArray];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function agregandoDatosCargos($datosModificar)
    {
        try {
            $parametros = explode('_',$datosModificar[0]);
            $log_extra=[
                'user'=>$parametros[3],
            ];
            log_message('info','[CREARCARGO|Async] Comprobar que exista el concepto de mes corriente para {user}', $log_extra);
            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $builder->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builder->where('USUARIO_DETA', $parametros[3]);
            $builder->where('CONTRATO_DETA', $parametros[2]);
            $builder->where('CODIGO_DETA', date('Ym').$datosModificar[1]);
            $builder->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
            $builder->groupBy('CODIGO_DETA');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CREARCARGO|Async/Q] Mes corriente esta aplicado para {user}', $log_extra);
                return true;
            }else {
                log_message('info','[CREARCARGO|Async/Q] No hay mes corriente aplicado para {user}', $log_extra);
                $buildera=$this->dbBuild->query("
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
                        '".$parametros[0]."',
                        '".$parametros[3]."',
                        '".$parametros[2]."',
                        CLAVE_CONC,
                        '1',
                        COSTO_CONC,
                        COSTO_CONC,
                        '".$parametros[0]."',
                        curdate(),
                        'ADEU'
                    FROM cat_conceptos
                    WHERE
                    CLAVE_CONC like '".date('Ym').$datosModificar[1]."' AND
                    ESTATUS_CONC='ACTI'
                ");
                log_message('notice','[CREARCARGO|Async/Q] Creando mes corriente para pagar de con tarifa completa para {user}', $log_extra);
                return true;

            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function agregandoDatosCargosSelec($datosModificar)
    {
        try {
            $parametros = explode('_',$datosModificar[0]);
            $log_extra=[
                'user'=>$parametros[3],
            ];
            log_message('info','[CREARCARGO|Async] Comprobar que exista el concepto de mes corriente para {user}', $log_extra);
            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $builder->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builder->where('USUARIO_DETA', $parametros[3]);
            $builder->where('CONTRATO_DETA', $parametros[2]);
            $builder->where('CODIGO_DETA', $parametros[4].$datosModificar[1]);
            $builder->whereIn('ESTATUS_DETA',['ADEU','PAGA']);
            $builder->groupBy('CODIGO_DETA');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CREARCARGO|Async/Q] Mes corriente esta aplicado para {user}', $log_extra);
                return true;
            }else {
                log_message('info','[CREARCARGO|Async/Q] No hay mes corriente aplicado para {user}', $log_extra);
                $buildera=$this->dbBuild->query("
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
                        '".$parametros[0]."',
                        '".$parametros[3]."',
                        '".$parametros[2]."',
                        CLAVE_CONC,
                        '1',
                        COSTO_CONC,
                        COSTO_CONC,
                        '".$parametros[0]."',
                        curdate(),
                        'ADEU'
                    FROM cat_conceptos
                    WHERE
                    CLAVE_CONC like '".$parametros[4].$datosModificar[1]."' AND
                    ESTATUS_CONC='ACTI'
                ");
                log_message('notice','[CREARCARGO|Async/Q] Creando mes corriente para pagar de con tarifa completa para {user}', $log_extra);
                return true;

            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function mostrarDatosResumenCargos()
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select("CODIGO_DETA, DESCUENTO_CCONT, COUNT(CONTRATO_DETA) AS CREADOS, SUM(TOTAL_DETA) AS PORPAGAR, DESCRIPCION_CTARI");
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_DETA');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->where('FECHACAP_DETA',date('Y-m-d'));
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('DESCUENTO_CCONT');
            $resultados0=$builder->get();

            if($resultados0->getNumRows()>0){
                log_message('info','[CREARCARGO|Async/Q] Generando datos desde consulta para obtener datos total contratos');
                return $resultados0->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }





    public function autocompletarDatosUsuario($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, CODBARR_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->like('NOMBRE_CLIEN',$id,'after');
            $builder->orLike('CODBARR_CLIEN',$id);
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $builder->orderBy('NOMBRE_CLIEN, APATERNO_CLIEN');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[TRAMITES|Async/Q] Generando datos desde consulta para continuar edición de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function cargarDatosUsuarioGenerales($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->where('IDUSUA_CLIEN', $id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[ACOBROS|Async/Q] Generando datos desde consulta para continuar carga de datos de usuario');
                $usuarios=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("CONCAT(IDUSUA_CLIEN,'_',CONTRATO_CCONT,'_',DESCUENTO_CCONT) AS `idTablePk`, CONTRATO_CCONT,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_CODPOS) AS DIRECCION, DESCRIPCION_CTARI, ESTATUS_CCONT");
            $buildera->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $buildera->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $buildera->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $buildera->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $buildera->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $buildera->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $buildera->where('CLVCOLON_CODPOS=COLONIA_UBIC');
            $buildera->where('IDUSUA_CLIEN', $id);
            $buildera->where('ESTATUS_CLIEN','ACTI');
            $buildera->groupBy('CONTRATO_CCONT');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[ACOBROS|Async/Q] Generando datos desde consulta para renderizar lista de contratos');
                $contratos=$resultado0->getResultArray();
            }

            return [
                $usuarios,
                $contratos,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function modificarDatosTotalesConcepto($id)
    {
        try {

            $parametro=explode('_', $id);

            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select('TOTAL_DETA');
            $builder->where('USUARIO_DETA', $parametro[0]);
            $builder->where('CONTRATO_DETA', $parametro[1]);
            $builder->where('CODIGO_DETA', $parametro[2]);
            $builder->where('ESTATUS_DETA', 'ADEU');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }










}


?>