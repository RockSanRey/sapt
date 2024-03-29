<?php

namespace App\Models\Administrador;
use CodeIgniter\Model;

class Mareportes extends Model
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
            log_message('info','[AREPORTES] Envio de datos para renderizado de parametros web');
            return $resultado->getResultArray();
        }
    }

    public function mostrarDatosContratosActivos($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(CONTRATO_CCONT,'_',IDUSUA_CLIEN) AS idTablePk, CONTRATO_CCONT,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, TELEFONO_CLIEN, MOVIL_CLIEN,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES, REFERENCIA_UBIC");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->where('IDUSUA_CLIEN',$parametro[0]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->groupBy('CONTRATO_CCONT');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AIMPCONTRATO|Async/Q] Generando datos desde consulta para continuar edici贸n de usuario');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function autoDatosCompletarTransferencias($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_transferencias');
            $builder->select("CONCAT(FOLIO_TRANS,'_',CONTRATO_TRANS,'_',CLIENALTA_TRANS) AS IDCONTRATO, CONTRATO_TRANS, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE");
            $builder->join('sys_clientes','IDUSUA_CLIEN=CLIENALTA_TRANS');
            $builder->like('CONTRATO_TRANS', $id,'after');
            $builder->where('ESTATUS_TRANS','ACTI');
            $builder->groupBy('CONTRATO_TRANS');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AREIMPTRANSFER|Async/Q] Generando datos desde consulta autocompletar contrato');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function mostrarDatosTransferContratos($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_transferencias');
            $builder->select("CONCAT(CONTRATO_TRANS,'_',CLIENBAJA_TRANS,'_',CLIENALTA_TRANS) AS idTablePk, FOLIO_TRANS, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, 
            CONTRATO_TRANS, FECHACAP_TRANS");
            $builder->join('sys_clientes','IDUSUA_CLIEN=CLIENALTA_TRANS');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_TRANS');
            $builder->where('FOLIO_TRANS',$parametro[0]);
            $builder->where('CONTRATO_TRANS',$parametro[1]);
            $builder->where('CLIENALTA_TRANS',$parametro[2]);
            $builder->where('ESTATUS_TRANS','ACTI');
            $builder->groupBy('CLIENALTA_TRANS');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AREIMPTRANSFER|Async/Q] Generando datos desde consulta para comprobate pagos');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function autoDatosCompletarBajas($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("CONCAT(USUARIO_CBAJA,'_',CONTRATO_CBAJA) AS IDCONTRATO, CONTRATO_CBAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->like('CONTRATO_CBAJA', $id,'after');
            $builder->where('ESTATUS_CBAJA','ACTI');
            $builder->groupBy('CONTRATO_CBAJA');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AREIMPBAJAS|Async/Q] Generando datos desde consulta autocompletar contrato');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function mostrarDatosBajasContratos($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("CONCAT(USUARIO_CBAJA,'_',CONTRATO_CBAJA,'_',FOLIO_CBAJA) AS idTablePk, FOLIO_CBAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, 
            CONTRATO_CBAJA, FBAJA_CBAJA");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CBAJA');
            $builder->where('USUARIO_CBAJA', $parametro[0]);
            $builder->where('CONTRATO_CBAJA', $parametro[1]);
            $builder->where('ESTATUS_CBAJA','ACTI');
            $builder->groupBy('USUARIO_CBAJA');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AREIMPBAJAS|Async/Q] Generando datos desde consulta para comprobate pagos');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function autoDatosCompletarReactivados($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("CONCAT(USUARIO_CBAJA,'_',CONTRATO_CBAJA,'_',FOLIO_CBAJA) AS IDCONTRATO, CONTRATO_CBAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->like('CONTRATO_CBAJA', $id,'after');
            $builder->where('ESTATUS_CBAJA','REAC');
            $builder->groupBy('CONTRATO_CBAJA');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AREIMREACTIVA|Async/Q] Generando datos desde consulta autocompletar contrato');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function mostrarDatosReactivosContratos($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("CONCAT(USUARIO_CBAJA,'_',CONTRATO_CBAJA,'_',FOLIO_CBAJA) AS idTablePk, FOLIO_CBAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, 
            CONTRATO_CBAJA, FBAJA_CBAJA");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CBAJA');
            $builder->where('USUARIO_CBAJA',$parametro[0]);
            $builder->where('CONTRATO_CBAJA',$parametro[1]);
            $builder->where('FOLIO_CBAJA',$parametro[2]);
            $builder->where('ESTATUS_CBAJA','REAC');
            $builder->groupBy('USUARIO_CBAJA');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AREIMPBAJAS|Async/Q] Generando datos desde consulta para comprobate pagos');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function autocompletarDatosContratoMod($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_contratosModificado');
            $builder->select("CONTRATO_CMODIF, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CMODIF');
            $builder->like('CONTRATO_CMODIF', $id,'both');
            $builder->where('ESTATUS_CMODIF','ACTI');
            $builder->groupBy('CONTRATO_CMODIF');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AIMPMODIFICA|Async/Q] Generando datos desde consulta autocompletar contrato');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
        
    }

    public function contratosDatosModificadosLista($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_contratosModificado');
            $builder->select("CONCAT(FOLIO_CMODIF,'_',CONTRATO_CMODIF) AS idTablePk, CONTRATO_CMODIF, 
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE,TIPOMOD_CMODIF,FOLIO_CMODIF");
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CMODIF');
            $builder->join('sys_clientes','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->where('CONTRATO_CMODIF', $id);
            $builder->where('ESTATUS_CMODIF','ACTI');
            $builder->groupBy('FOLIO_CMODIF');
            $builder->orderBy('FMODIF_CMODIF','DESC');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[AIMPMODIFICA|Async/Q] Generando datos desde consulta para listas contrato modificado');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
        
    }

    public function llenarDatosTablaRecibosPago()
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDCOBRO_COBR,'_',IDUSUA_CLIEN,'_',CONTRATO_COBR) AS idTablePk, IDCOBRO_COBR, CONSECUTIVO_COBR,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, CONCEPTO_COBR,
              CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON,' C.P.',CODIPOST_CODPOS,', ',NOMBRE_MUNIC,', ',NOMBRE_ESTA) AS DIRECCION,
              CONTRATO_CCONT, IDCOBRO_COBR, TOTAL_COBR, FMODIF_COBR, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_cobros','CONTRATO_COBR=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_COBR');
            $builder->where('CONTRATO_COBR=CONTRATO_CCONT');
            // $builder->like('FMODIF_COBR', '2023-03','after');
            $builder->like('FMODIF_COBR', date('Y-m'),'after');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
            $builder->orderBy('FECHACAP_COBR, HORACAP_COBR', 'DESC');
            $builder->limit(50);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[REIMCOMPRO|Async/Q] Generando datos desde consulta para continuar edici贸n de usuario');
                return $resultado->getResultArray();
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosComprobanteDomicilio($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDCOBRO_COBR,'_',IDUSUARIO_COBR,'_',CONTRATO_COBR) AS idTablePk, IDCOBRO_COBR, CONSECUTIVO_COBR,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, CONCEPTO_COBR,
              CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON,' C.P.',CODIPOST_CODPOS,', ',NOMBRE_MUNIC,', ',NOMBRE_ESTA) AS DIRECCION,
              CONTRATO_CCONT, IDCOBRO_COBR, TOTAL_COBR, FMODIF_COBR, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_cobros','CONTRATO_COBR=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_COBR');
            $builder->where('IDUSUA_CLIEN', $id);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
            $builder->orderBy('IDCOBRO_COBR', 'DESC');
            $builder->limit(50);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[REIMCOMPRO|Async/Q] Generando datos desde consulta para comprobate pagos');
                return $resultado->getResultArray();
    
            }
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenatDatosTablaDeudores()
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONTRATO_CCONT, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS USUARIO,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON) AS DIRECCION, SUM(TOTAL_DETA) AS DEUDA, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_detalles','CONTRATO_DETA=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_CCONT');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->orderBy('DEUDA','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[LISTACORTE|Async/Q] Generando datos desde consulta para continuar edici贸n de usuario');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function exportadorDatosListaDeudas()
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONTRATO_CCONT, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS USUARIO,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON) AS DIRECCION, SUM(TOTAL_DETA) AS DEUDA, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_detalles','CONTRATO_DETA=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_CCONT');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->orderBy('DEUDA','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[LISTACORTE|Async/Q] Generando datos desde consulta para continuar edici贸n de usuario');
                $listado = $resultado->getResultArray();
    
            }
            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("SUM(TOTAL_DETA) AS DEUDA");
            $buildera->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $buildera->join('sys_clientes_detalles','CONTRATO_DETA=CONTRATO_CCONT');
            $buildera->where('ESTATUS_CLIEN','ACTI');
            $buildera->where('ESTATUS_CCONT','ACTI');
            $buildera->where('ESTATUS_DETA','ADEU');
            $buildera->groupBy('ESTATUS_DETA');
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                $deuda = $resultado0->getResultArray();
    
            }
    
            return [
                $listado,
                $deuda
            ];
    
        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function listadoDatosGeneraCorte($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('SUM(TOTAL_COBR) AS TOTAL, COUNT(sys_clientes_cobros.PK_IDENTA) AS CANTIDAD');
            $builder->join('sys_clientes_pagos','IDCOBRO_PAGO=IDCOBRO_COBR');
            $builder->like('FMODIF_COBR ',$id,'after');
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->whereNotIn('IDMODIF_PAGO', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->where('ESTATUS_PAGO','PAGA');
            $builder->groupBy('ESTATUS_PAGO');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar corte anual');
                $corteGeneral=$resultado0->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_clientes_pagos');
            $buildera->select("METODO_PAGO, SUM(TOTAL_PAGO) AS TOTAL, COUNT(sys_clientes_cobros.PK_IDENTA) AS CANTIDAD");
            $buildera->join('sys_clientes_cobros','IDCOBRO_COBR=IDCOBRO_PAGO');
            $buildera->like('FMODIF_PAGO ',$id,'after');
            $buildera->whereNotIn('IDMODIF_PAGO', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $buildera->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $buildera->where('ESTATUS_PAGO','PAGA');
            $buildera->where('ESTATUS_COBR','PAGA');
            $buildera->groupBy('ESTATUS_PAGO, METODO_PAGO');
            $resultado1=$buildera->get();
            if($resultado1->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar corte anual metodos');
                $corteMetodos=$resultado1->getResultArray();
            }

            $builderb=$this->dbBuild->table('cat_metodoPagos');
            $builderb->select('CLAVE_METP, DESCRIPCION_METP');
            $builderb->where('ESTATUS_METP','ACTI');
            $builderb->orderBy('DESCRIPCION_METP','ASC');
            $resultado2=$builderb->get();
            if($resultado2->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar metodos pago');
                $metodosPago=$resultado2->getResultArray();
            }

            $builderc=$this->dbBuild->table('sys_clientes_cobros');
            $builderc->select("SUM(TOTAL_DETA) AS PAGOS, CLASIFIC_CONC");
            $builderc->join('sys_clientes_detalles','IDCOBRO_DETA=IDCOBRO_COBR');
            $builderc->join('sys_clientes_pagos','IDCOBRO_PAGO=IDCOBRO_COBR');
            $builderc->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builderc->like('FMODIF_COBR',$id,'after');
            $builderc->whereNotIn('IDMODIF_DETA', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builderc->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builderc->whereNotIn('IDMODIF_PAGO', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builderc->where('ESTATUS_DETA','PAGA');
            $builderc->where('ESTATUS_COBR','PAGA');
            $builderc->where('ESTATUS_PAGO','PAGA');
            $builderc->groupBy('YEAR(FMODIF_COBR), CLASIFIC_CONC');
            $resultado3=$builderc->get();
            if($resultado3->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar pago conceptos');
                $pagoConceptos=$resultado3->getResultArray();
            }


            return [
                $corteGeneral,
                $corteMetodos,
                $metodosPago,
                $pagoConceptos,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function listadoDatosGeneraCorteSem($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('SUM(TOTAL_COBR) AS TOTAL, COUNT(sys_clientes_cobros.PK_IDENTA) AS CANTIDAD');
            $builder->join('sys_clientes_pagos','IDCOBRO_PAGO=IDCOBRO_COBR');
            $builder->like('SEMANA_COBR',$id,'after');
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->whereNotIn('IDMODIF_PAGO', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->where('ESTATUS_PAGO','PAGA');
            $builder->groupBy('ESTATUS_PAGO');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar corte anual');
                $corteGeneral=$resultado0->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_clientes_pagos');
            $buildera->select("METODO_PAGO, SUM(TOTAL_PAGO) AS TOTAL, COUNT(sys_clientes_cobros.PK_IDENTA) AS CANTIDAD");
            $buildera->join('sys_clientes_cobros','IDCOBRO_COBR=IDCOBRO_PAGO');
            $buildera->like('SEMANA_PAGO ',$id,'after');
            $buildera->whereNotIn('IDMODIF_PAGO', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $buildera->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $buildera->where('ESTATUS_PAGO','PAGA');
            $buildera->where('ESTATUS_COBR','PAGA');
            $buildera->groupBy('ESTATUS_PAGO, METODO_PAGO');
            $resultado1=$buildera->get();
            if($resultado1->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar corte anual metodos');
                $corteMetodos=$resultado1->getResultArray();
            }

            $builderb=$this->dbBuild->table('cat_metodoPagos');
            $builderb->select('CLAVE_METP, DESCRIPCION_METP');
            $builderb->where('ESTATUS_METP','ACTI');
            $builderb->orderBy('DESCRIPCION_METP','ASC');
            $resultado2=$builderb->get();
            if($resultado2->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar metodos pago');
                $metodosPago=$resultado2->getResultArray();
            }

            $builderc=$this->dbBuild->table('sys_clientes_cobros');
            $builderc->select("SUM(TOTAL_DETA) AS PAGOS, CLASIFIC_CONC");
            $builderc->join('sys_clientes_detalles','IDCOBRO_DETA=IDCOBRO_COBR');
            $builderc->join('sys_clientes_pagos','IDCOBRO_PAGO=IDCOBRO_COBR');
            $builderc->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            $builderc->like('SEMANA_COBR',$id,'after');
            $builderc->whereNotIn('IDMODIF_DETA', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builderc->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builderc->whereNotIn('IDMODIF_PAGO', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builderc->where('ESTATUS_DETA','PAGA');
            $builderc->where('ESTATUS_COBR','PAGA');
            $builderc->where('ESTATUS_PAGO','PAGA');
            $builderc->groupBy('YEAR(FMODIF_COBR), CLASIFIC_CONC');
            $resultado3=$builderc->get();
            if($resultado3->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar pago conceptos');
                $pagoConceptos=$resultado3->getResultArray();
            }


            return [
                $corteGeneral,
                $corteMetodos,
                $metodosPago,
                $pagoConceptos,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboAnioMes()
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('FMODIF_COBR');
            $builder->where('FMODIF_COBR >','2021-12-29');
            // $builder->orLike('FMODIF_COBR','2022','after');
            // $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('YEAR(FMODIF_COBR)');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar combo aniomes');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboMes($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('FMODIF_COBR');
            $builder->like('FMODIF_COBR ',$id,'after');
            // $builder->orLike('FMODIF_COBR','2022','after');
            // $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('YEAR(FMODIF_COBR), MONTH(FMODIF_COBR)');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar combo meses');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboSemana($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('SEMANA_COBR');
            $builder->like('FMODIF_COBR ',$id,'after');
            // $builder->orLike('FMODIF_COBR','2022','after');
            // $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('YEAR(FMODIF_COBR), SEMANA_COBR');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar combo semana');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboDia($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('FMODIF_COBR');
            $builder->like('FMODIF_COBR',$id,'after');
            // $builder->orLike('FMODIF_COBR','2022','after');
            // $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('YEAR(FMODIF_COBR), MONTH(FMODIF_COBR), DAY(FMODIF_COBR)');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[ACORTECAJA|Async/Q] Generando datos desde consulta para continuar combo dias');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function listadoDatosGeneraMeses($id)
    {
        try {
            $arregloPagina=50;

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select("FMODIF_COBR, IDCOBRO_COBR, CONSECUTIVO_COBR, CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO) AS NOMBRE, TOTAL_COBR");
            $builder->join('sys_responsables','IDUSUA_RESPO=IDMODIF_COBR');
            $builder->like('FMODIF_COBR',$id,'after');
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
            $resultado=$builder->get();

            return [[
                'TOTALRESUL'=>$resultado->getNumRows(),
                'REGISPAGIN'=>$arregloPagina,
            ]];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function listadoDatosGeneraDias($id)
    {
        try {
            $arregloPagina=50;

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select("FMODIF_COBR, IDCOBRO_COBR, CONSECUTIVO_COBR, CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO) AS NOMBRE, TOTAL_COBR");
            $builder->join('sys_responsables','IDUSUA_RESPO=IDMODIF_COBR');
            $builder->like('FMODIF_COBR',$id,'after');
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
            $resultado=$builder->get();

            return [[
                'TOTALRESUL'=>$resultado->getNumRows(),
                'REGISPAGIN'=>$arregloPagina,
            ]];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosTablaPaginadaFolios($id)
    {
        try {
            $parametro=explode('_', $id);

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select("FMODIF_COBR, IDCOBRO_COBR, CONSECUTIVO_COBR, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN) AS CLIENTE, CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO) AS NOMBRE, TOTAL_COBR");
            $builder->join('sys_responsables','IDUSUA_RESPO=IDMODIF_COBR');
            $builder->join('sys_clientes','IDUSUA_CLIEN=IDUSUARIO_COBR');
            $builder->like('FMODIF_COBR',$parametro[0],'after');
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('sys_clientes_cobros.PK_IDENTA, IDCOBRO_COBR');
            $builder->orderBy('CONSECUTIVO_COBR');
            $builder->limit($parametro[2], $parametro[1]);
            $resultado=$builder->get();

            return $resultado->getResultArray();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function exportadorDatosListaFolios($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select("FMODIF_COBR, IDCOBRO_COBR, CONSECUTIVO_COBR, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN) AS CLIENTE, CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO) AS NOMBRE, TOTAL_COBR");
            $builder->join('sys_responsables','IDUSUA_RESPO=IDMODIF_COBR');
            $builder->join('sys_clientes','IDUSUA_CLIEN=IDUSUARIO_COBR');
            $builder->like('FMODIF_COBR',$id,'after');
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('sys_clientes_cobros.PK_IDENTA, IDCOBRO_COBR');
            $builder->orderBy('CONSECUTIVO_COBR');
            $resultado=$builder->get();

            $buildera=$this->dbBuild->table('sys_clientes_cobros');
            $buildera->select("SUM(TOTAL_COBR) AS TOTAL");
            $buildera->like('FMODIF_COBR',$id,'after');
            $buildera->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $buildera->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6','2ee8df762ab68bae608a06db607c564fb7a85ec5']);
            $buildera->where('ESTATUS_COBR','PAGA');
            $buildera->groupBy('ESTATUS_COBR');
            $resultado0=$buildera->get();

            return [$resultado->getResultArray(), $resultado0->getResultArray()];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function mostrarDatosDeudasDetalle($datosModificar)
    {
        try {

            $parametros=explode('_',$datosModificar[1]);
            $datosDetalle=null;
            $log_extra=[
                'user'=>$parametros[0],
            ];

            log_message('info','[PAGOSERVICIO|Async/Q] Comprobando atrasos en pagos de servicios para {user}', $log_extra);
            $builder=$this->dbBuild->table('sys_clientes_detalles');
            $builder->select("CODIGO_DETA,ESTATUS_DETA");
            // $builder->where('USUARIO_DETA', $parametros[0]);
            $builder->where('CONTRATO_DETA', $parametros[1]);
            $builder->where('CODIGO_DETA <',date('Ym').$datosModificar[2]);
            $builder->like('CODIGO_DETA',$datosModificar[2],'before');
            $builder->where('ESTATUS_DETA','ADEU');
            $resultado0=$builder->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Se detectaron adeudos comprobando si se aplico recargos para {user}', $log_extra);
                foreach ($resultado0->getResultArray() as $value) {
                    $mesRecargos=$value['CODIGO_DETA'];

                    $buildera=$this->dbBuild->table('sys_clientes_detalles');
                    $buildera->select("CODIGO_DETA,ESTATUS_DETA");
                    $buildera->where('CODIGO_DETA', substr($mesRecargos,0,6).'RSA');
                    // $buildera->where('USUARIO_DETA', $parametros[0]);
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
                                '".$datosModificar[0]."',
                                '".$parametros[0]."',
                                '".$parametros[1]."',
                                CLAVE_CONC,
                                '1',
                                COSTO_CONC,
                                COSTO_CONC,
                                '".$datosModificar[0]."',
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
            // $builderc->where('USUARIO_DETA', $parametros[0]);
            $builderc->where('CONTRATO_DETA', $parametros[1]);
            $builderc->like('CODIGO_DETA', date('Ym'),'after');
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
                    '".$datosModificar[0]."',
                    '".$parametros[0]."',
                    '".$parametros[1]."',
                    CLAVE_CONC,
                    '1',
                    COSTO_CONC,
                    COSTO_CONC,
                    '".$datosModificar[0]."',
                    curdate(),
                    'ADEU'
                    FROM cat_conceptos
                    WHERE
                    CLAVE_CONC like '".date('Ym').$datosModificar[2]."' AND
                    ESTATUS_CONC='ACTI'
                ");
                log_message('info','[PAGOSERVICIO|Async/Q] Creando mes corriente para pagar de {user}', $log_extra);

            }

            $arregloMultas=['SNEXTA','202210EXT','INASCORTE','TIRAZ','TIRAT','PASAG','JARDI','JARDT','RECONA','OFENZ','CORTE','RECONE','202201RSA','202202RSA','202203RSA','202204RSA','202205RSA','202206RSA','202207RSA','202208RSA','202209RSA','202210RSA','202211RSA','202212RSA'];
            if(date('m')=='01'){
                log_message('info','[PAGOSERVICIO|Async/Q] Revisando si es candidato a condonación de {user}', $log_extra);
                if($parametros[2]=='TARNOR' || $parametros[2]=='TARMAY'){
                    log_message('info','[PAGOSERVICIO|Async/Q] Verificando si se aplica condonacion de mes para {user}', $log_extra);
                    $builderg=$this->dbBuild->table('sys_clientes_detalles');
                    $builderg->select('CODIGO_DETA, ESTATUS_DETA');
                    $builderg->whereIn('CODIGO_DETA',$arregloMultas);
                    // $builderg->where('USUARIO_DETA', $parametros[0]);
                    $builderg->where('CONTRATO_DETA', $parametros[1]);
                    $resultado5=$builderg->get();
                    if(!$resultado5->getNumRows()>0){
                        log_message('info','[PAGOSERVICIO|Async/Q] No hay multas detectadas para {user}', $log_extra);
                        $builderh=$this->dbBuild->table('sys_clientes_detalles');
                        $builderh->select("CODIGO_DETA, ESTATUS_DETA");
                        $builderh->where('CODIGO_DETA',$datosModificar[3]);
                        // $builderh->where('USUARIO_DETA', $parametros[0]);
                        $builderh->where('CONTRATO_DETA', $parametros[1]);
                        $builderh->like('FECHACAP_DETA',date('Y'),'after');
                        $resultados6=$builderh->get();
                        if($resultados6->getNumRows()>0){
                            log_message('info','[PAGOSERVICIO|Async/Q] Ya esta agregada condonación de mes enero para {user}', $log_extra);                    
                        }else{
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
                                '".$datosModificar[0]."',
                                '".$parametros[0]."',
                                '".$parametros[1]."',
                                CLAVE_CONC,
                                '1',
                                COSTO_CONC,
                                COSTO_CONC,
                                '".$datosModificar[0]."',
                                curdate(),
                                'ADEU'
                                FROM cat_conceptos
                                WHERE
                                CLAVE_CONC like '".$datosModificar[3]."' AND
                                ESTATUS_CONC='ACTI'
                            ");
                            log_message('info','[PAGOSERVICIO|Async/Q] Creando condonación de mes enero para pagar de {user}', $log_extra);
    
                        }
        
                    }
        
                }

            }

            $buildere=$this->dbBuild->table('sys_clientes_detalles');
            $buildere->select("CONCAT(USUARIO_DETA,'_',CONTRATO_DETA,'_',CODIGO_DETA) AS `idTablePk`, CODIGO_DETA, DESCRIPCION_CONC, 
            CANTIDAD_DETA, COSTO_DETA, TOTAL_DETA, ESTATUS_DETA");
            $buildere->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            // $buildere->where('USUARIO_DETA', $parametros[0]);
            $buildere->where('CONTRATO_DETA', $parametros[1]);
            $buildere->where('ESTATUS_DETA','ADEU');
            $buildere->groupBy('CODIGO_DETA');
            $buildere->orderBy('CODIGO_DETA', 'ASC');
            $resultado2=$buildere->get();
            if($resultado2->getNumRows()>0){
                log_message('info','[PAGOSERVICIO|Async/Q] Generando datos desde consulta enviando datos para renderizar detalle de {user}', $log_extra);
                $datosDetalle=$resultado2->getResultArray();
            }

            $builderf=$this->dbBuild->table('sys_clientes_detalles');
            $builderf->select("CONTRATO_DETA,SUM(TOTAL_DETA) AS TOTAL_DETA");
            $builderf->join('cat_conceptos','CLAVE_CONC=CODIGO_DETA');
            // $builderf->where('USUARIO_DETA', $parametros[0]);
            $builderf->where('CONTRATO_DETA', $parametros[1]);
            $builderf->where('ESTATUS_DETA', 'ADEU');
            $resultado3=$builderf->get();
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






    public function imprimirDatosContrato($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("FECHACAP_CCONT, HORACAP_CCONT, IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, CODBARR_CLIEN, EMAIL_CLIEN,
            FNACIM_CLIEN, SEXO_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN, NOMBRE_ESTA, NOMBRE_MUNIC,
            CODIPOST_CODPOS, COLONIA_COLON, CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES, CONTRATO_CCONT, 
            DESCRIPCION_CONT, DESCRIPCION_CTARI, DESCRIPCION_CPERM");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->where('IDUSUA_CLIEN',$parametro[1]);
            $builder->where('CONTRATO_CCONT',$parametro[0]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[AREPORTES|Async/Q] Generando datos desde consulta para detalles de contrato');
                $contrato=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_responsables');
            $buildera->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, DESCRIPHOM_PUESTO");
            $buildera->join('cat_puestos','CLAVE_PUESTO=PERFIL_RESPO');
            $buildera->whereIn('PERFIL_RESPO',['COMIPRESI']);
            $buildera->where('ESTATUS_RESPO','ACTI');
            $buildera->groupBy('IDUSUA_RESPO');
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[AREPORTES|Async/Q] Generando datos desde consulta para datos comite');
                $comite=$resultado0->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_clientes');
            $builderb->select("IDUSUA_CLIEN,CODBARR_CLIEN,FECHACAP_CCONT,HORACAP_CCONT,CONTRATO_CCONT,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,NOMBRE_ESTA,NOMBRE_MUNIC,
            CODIPOST_CODPOS,COLONIA_COLON,CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,
            MODO_CCONT,TIPO_CCONT,PERMISO_CCONT,DESCUENTO_CCONT,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS RESPONS");
            $builderb->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builderb->join('sys_responsables','IDUSUA_RESPO=CAPTURA_CCONT');
            $builderb->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builderb->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builderb->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builderb->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builderb->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builderb->where('CLIENTE_CCONT',$parametro[1]);
            $builderb->where('CONTRATO_CCONT',$parametro[0]);
            $builderb->groupBy('CONTRATO_CCONT');
            $builderb->orderBy('CONTRATO_CCONT');
            $resultado2=$builderb->get();

            if($resultado2->getNumRows()>0){
                foreach($resultado2->getResultArray() as $filas){
                    $campA=$filas['IDUSUA_CLIEN'];
                    $campB=$filas['CODBARR_CLIEN'];
                    $campC=$filas['FECHACAP_CCONT'];
                    $campD=$filas['HORACAP_CCONT'];
                    $campE=$filas['CONTRATO_CCONT'];
                    $campF=$filas['NOMBRE'];
                    $campG=$filas['NOMBRE_ESTA'];
                    $campH=$filas['NOMBRE_MUNIC'];
                    $campI=$filas['CODIPOST_CODPOS'];
                    $campJ=$filas['COLONIA_COLON'];
                    $campK=$filas['CALLES'];
                    $campL=$filas['MODO_CCONT'];
                    $campM=$filas['TIPO_CCONT'];
                    $campN=$filas['PERMISO_CCONT'];
                    $campO=$filas['DESCUENTO_CCONT'];
                    $campP=$filas['RESPONS'];
                }
                $arreglo=[
                    ['SELLODIGA'=>$campA.'|'.$campB.'|'.$campC.'|'.$campD.'|'.$campE.'|'.$campF.'|'.$campG.'|'.$campH.'|'.$campI.'|'.$campJ
                    .'|'.$campK.'|'.$campL.'|'.$campM.'|'.$campN.'|'.$campO.'|'.$campP],
                    ['SELLODIGA'=>base64_encode($campA.'|'.$campB.'|'.$campC.'|'.$campD.'|'.$campE.'|'.$campF.'|'.$campG.'|'.$campH.'|'.
                    $campI.'|'.$campJ.'|'.$campK.'|'.$campL.'|'.$campM.'|'.$campN.'|'.$campO.'|'.$campP)],
                ];
            }


            return [
                $contrato,
                $comite,
                $arreglo,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function imprimirDatosComprobantePago($id)
    {
        try {
            $parametros=explode('_', $id);
            $datosDeuda=[];

            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("IDUSUA_CLIEN, CODBARR_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,
            EMAIL_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN, CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES, NOMBRE_ESTA, NOMBRE_MUNIC,
            CODIPOST_CODPOS, COLONIA_COLON, CONTRATO_CCONT, DESCUENTO_CCONT, DESCRIPCION_CONT, PERMISO_CCONT, IDCOBRO_COBR, FECHACAP_COBR, HORACAP_COBR, CONSECUTIVO_COBR");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_detalles','CONTRATO_DETA=CONTRATO_CCONT');
            $builder->join('sys_clientes_cobros','CONTRATO_COBR=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->where('IDCOBRO_COBR', $parametros[0]);
            $builder->where('USUARIO_DETA',$parametros[1]);
            $builder->where('CONTRATO_CCONT', $parametros[2]);
            $builder->where('IDCOBRO_COBR=IDCOBRO_DETA');
            // $builder->whereIn('ESTATUS_CLIEN',['ACTI','BAJD','BAJT']);
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado=$builder->get();
            // print_r($builder);
            if($resultado->getNumRows()>0){
                log_message('info','[AREPORTES|Async/Q] Generando datos desde consulta para obtener datos generales');
                $datosUsuario=$resultado->getResultArray();

            }

            $buildera=$this->dbBuild->table('sys_clientes_detalles');
            $buildera->select("CODIGO_DETA, DESCRIPCION_CONC, COSTO_DETA");
            $buildera->join('cat_conceptos','CODIGO_DETA=CLAVE_CONC');
            $buildera->where('IDCOBRO_DETA',$parametros[0]);
            $buildera->where('USUARIO_DETA',$parametros[1]);
            $buildera->where('CONTRATO_DETA',$parametros[2]);
            $buildera->where('ESTATUS_DETA','PAGA');
            $buildera->orderBy('CODIGO_DETA','ASC');
            $buildera->groupBy('CODIGO_DETA');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[AREPORTES|Async/Q] Generando datos desde consulta para obtener datos detalle pago');
                $datosDetalle=$resultado0->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_clientes_pagos');
            $builderb->select("CODBARR_CLIEN, FECHACAP_PAGO, HORACAP_PAGO, CONTRATO_PAGO, TOTAL_PAGO, RECIBO_PAGO, CAMBIO_PAGO, METODO_PAGO, DESCRIPCION_ESTAT, CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS ATIENDE");
            $builderb->join('cat_estatus','CLAVE_ESTAT=METODO_PAGO');
            $builderb->join('sys_clientes','IDUSUA_CLIEN=USUARIO_PAGO');
            $builderb->join('sys_responsables','IDUSUA_RESPO=IDMODIF_PAGO');
            $builderb->where('IDCOBRO_PAGO', $parametros[0]);
            $builderb->where('USUARIO_PAGO', $parametros[1]);
            $builderb->where('CONTRATO_PAGO', $parametros[2]);
            $builderb->where('ESTATUS_PAGO','PAGA');
            $builderb->groupBy('CONTRATO_PAGO');
            $resultados1=$builderb->get();
            
            if($resultados1->getNumRows()>0){
                log_message('info','[AREPORTES|Async/Q] Generando datos desde consulta para obtener datos transaccion');
                $datosPagos=$resultados1->getResultArray();
            }

            $builderc=$this->dbBuild->table('sys_clientes_detalles');
            $builderc->select("CONTRATO_DETA, SUM(TOTAL_DETA) as TOTAL_DEUDA");
            $builderc->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_DETA','left');
            $builderc->join('cat_conceptos','CODIGO_DETA=CLAVE_CONC');
            $builderc->where('CONTRATO_DETA',$parametros[2]);
            $builderc->where('ESTATUS_DETA','ADEU');
            $builderc->groupBy('CONTRATO_DETA');
            $resultados2=$builderc->get();

            if($resultados2->getNumRows()>0){
                log_message('info','[AREPORTES|Async/Q] Generando datos desde consulta para obtener datos deuda total');
                $datosDeuda=$resultados2->getResultArray();
            }

            return [
                $datosUsuario,
                $datosDetalle,
                $datosPagos,
                $datosDeuda,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function imprimirDatosAcuseBaja($id)
    {
        try {
            $parametro=explode('_', $id);

            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("FOLIO_CBAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, 
            CONTRATO_CBAJA, FBAJA_CBAJA, MOTIVBAJA_CBAJA, ESTATUS_CCONT");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CBAJA');
            $builder->where('USUARIO_CBAJA', $parametro[0]);
            $builder->where('CONTRATO_CBAJA', $parametro[1]);
            $builder->groupBy('USUARIO_CBAJA');
            $resultado0=$builder->get();

            $builderb=$this->dbBuild->table('sys_responsables');
            $builderb->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, PERFIL_RESPO, DESCRIPHOM_PUESTO");
            $builderb->join('cat_puestos','PERFIL_RESPO=CLAVE_PUESTO');
            $builderb->whereIn('PERFIL_RESPO',['COMIPRESI','COMITESOR']);
            $builderb->where('ESTATUS_RESPO','ACTI');
            $resultado1=$builderb->get();

            $builderc=$this->dbBuild->table('sys_clientes');
            $builderc->select("IDUSUA_CLIEN, CONTRATO_CCONT, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,
            NOMBRE_ESTA, NOMBRE_MUNIC,CODIPOST_CODPOS, COLONIA_COLON, CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,
            DESCRIPCION_CONT, TIPO_CCONT, PERMISO_CCONT, DESCUENTO_CCONT, FECHACAP_CCONT, FBAJA_CCONT, IDBAJA_CCONT,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS RESPONS, FOLIO_CBAJA");
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
                    $campA=$filas['FOLIO_CBAJA'];
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
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
                // $arreglo,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function imprimirDatosAcuseReactiva($id)
    {
        try {
            $parametro=explode('_', $id);

            $builder=$this->dbBuild->table('sys_clientes_contratosBajas');
            $builder->select("FOLIO_CBAJA, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, 
            CONTRATO_CBAJA, FREAC_CBAJA, MOTIVREAC_CBAJA, ESTATUS_CCONT");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CBAJA');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CBAJA');
            $builder->where('USUARIO_CBAJA',$parametro[0]);
            $builder->where('CONTRATO_CBAJA',$parametro[1]);
            $builder->where('FOLIO_CBAJA',$parametro[2]);
            $builder->where('ESTATUS_CBAJA','REAC');
            $builder->groupBy('USUARIO_CBAJA');
            $resultado0=$builder->get();

            $builderb=$this->dbBuild->table('sys_responsables');
            $builderb->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, PERFIL_RESPO");
            $builderb->whereIn('PERFIL_RESPO',['COMIPRESI','COMITESOR']);
            $builderb->where('ESTATUS_RESPO','ACTI');
            $resultado1=$builderb->get();

            return [
                $resultado0->getResultArray(),
                $resultado1->getResultArray(),
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function imprimirDatosReciboTransferencia($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_transferencias');
            $builder->select("FOLIO_TRANS, FTRANS_TRANS, HORACAP_TRANS, CONTRATO_TRANS,
            CONCAT(a.NOMBRE_CLIEN,' ',a.APATERNO_CLIEN,' ',a.AMATERNO_CLIEN) AS NOMBREALTA, a.CODBARR_CLIEN AS CODBARRALTA,
            CONCAT(c.CALLE_UBIC,' ',c.NEXTE_UBIC,' ',c.NINTE_UBIC) AS DOMICILIOALTA, a.SEXO_CLIEN AS SEXOALTA,
            CONCAT(b.NOMBRE_CLIEN,' ',b.APATERNO_CLIEN,' ',b.AMATERNO_CLIEN) AS NOMBREBAJA, b.CODBARR_CLIEN AS CODBARRBAJA,
            CONCAT(c.CALLE_UBIC,' ',c.NEXTE_UBIC,' ',c.NINTE_UBIC) AS DOMICILIOBAJA, b.SEXO_CLIEN AS SEXOBAJA,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON,', C.P. ',CODIPOST_CODPOS,', ',NOMBRE_MUNIC) AS DOMICILIOCONTRATO,
            DESCRIPCION_CONT, DESCRIPCION_CEXP, DESCRIPCION_CPERM, DESCRIPCION_CTARI,COMENTS_TRANS
            ");
            $builder->join('sys_clientes a','a.IDUSUA_CLIEN=CLIENALTA_TRANS');
            $builder->join('sys_clientes b','b.IDUSUA_CLIEN=CLIENBAJA_TRANS');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_TRANS');
            $builder->join('sys_clientes_ubicaciones c','c.IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_contratosExpedicion','CLAVE_CEXP=MODO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->where('CONTRATO_TRANS',$parametro[0]);
            $builder->where('CLIENBAJA_TRANS',$parametro[1]);
            $builder->where('CLIENALTA_TRANS',$parametro[2]);
            $builder->groupBy('CONTRATO_TRANS');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                $transfer= $resultado->getResultArray();
            }
            $buildera=$this->dbBuild->table('sys_responsables');
            $buildera->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $buildera->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $buildera->where('PUESTO_RESPO','COMIPRESI');
            $buildera->where('ESTATUS_RESPO','ACTI');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                $presid= $resultado0->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_responsables');
            $builderb->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $builderb->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $builderb->where('PUESTO_RESPO','COMITESOR');
            $builderb->where('ESTATUS_RESPO','ACTI');
            $resultado1=$builderb->get();

            if($resultado1->getNumRows()>0){
                $tesore= $resultado1->getResultArray();
            }

            return [
                $transfer,
                $presid,
                $tesore,
            ];


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function imprimirDatosAcuseModifica($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_contratosModificado');
            $builder->select("FOLIO_CMODIF, FCAMBIO_CMODIF, HORACAP_CMODIF,CONTRATO_CMODIF,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CODBARR_CLIEN,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS DOMICILIOALTA,SEXO_CLIEN,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON,', C.P. ',CODIPOST_CODPOS,', ',NOMBRE_MUNIC) AS DOMICILIOCONTRATO,
            DESCRIPCION_CONT, DESCRIPCION_CEXP, DESCRIPCION_CPERM, DESCRIPCION_CTARI,MOTCAMBIO_CMODIF,TIPOMOD_CMODIF
            ");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CMODIF');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CMODIF');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_contratosExpedicion','CLAVE_CEXP=MODO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->where('FOLIO_CMODIF',$parametro[0]);
            $builder->where('CONTRATO_CMODIF',$parametro[1]);
            $builder->groupBy('FOLIO_CMODIF');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                $transfer= $resultado->getResultArray();
            }
            $buildera=$this->dbBuild->table('sys_responsables');
            $buildera->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $buildera->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $buildera->where('PUESTO_RESPO','COMIPRESI');
            $buildera->where('ESTATUS_RESPO','ACTI');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                $presid= $resultado0->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_responsables');
            $builderb->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $builderb->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $builderb->where('PUESTO_RESPO','COMISECR');
            $builderb->where('ESTATUS_RESPO','ACTI');
            $resultado1=$builderb->get();

            if($resultado1->getNumRows()>0){
                $tesore= $resultado1->getResultArray();
            }

            return [
                $transfer,
                $presid,
                $tesore,
            ];


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }
    
    public function imprimirDatosAcuseAclaracion($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_clientes_contratosCondonado');
            $builder->select("FOLIO_CCOND, FCAMBIO_CCOND, HORACAP_CCOND,CONTRATO_CCOND,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS CLIENTE, CODBARR_CLIEN,
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_COLON,', C.P. ',CODIPOST_CODPOS,', ',NOMBRE_MUNIC) AS DOMICILIO,
            SEXO_CLIEN,CODIGOS_CCOND,MOTCAMBIO_CCOND,DEUDA_CCOND,MONTO_CCOND,RESTA_CCOND,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS AUTORIZO");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CCOND');
            $builder->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CCOND');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_codpostal','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_colonias','CLVCOLON_COLON=COLONIA_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_contratosExpedicion','CLAVE_CEXP=MODO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->join('sys_responsables','IDUSUA_RESPO=IDCAMBIO_CCOND');
            $builder->where('FOLIO_CCOND',$parametro[0]);
            $builder->where('CONTRATO_CCOND',$parametro[1]);
            $builder->groupBy('FOLIO_CCOND');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                $acuerdo= $resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_responsables');
            $buildera->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $buildera->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $buildera->whereIn('PUESTO_RESPO',['COMIPRESI','COMITESOR']);
            $buildera->where('ESTATUS_RESPO','ACTI');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                $presid= $resultado0->getResultArray();
            }

            $builderb=$this->dbBuild->table('sys_responsables');
            $builderb->select("CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE, SEXO_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $builderb->join('cat_puestos','CLAVE_PUESTO=PUESTO_RESPO');
            $builderb->where('PUESTO_RESPO','COMITESOR');
            $builderb->where('ESTATUS_RESPO','ACTI');
            $resultado1=$builderb->get();

            if($resultado1->getNumRows()>0){
                $tesore= $resultado1->getResultArray();
            }

            return [
                $acuerdo,
                $presid,
                $tesore,
            ];


        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }




}





?>