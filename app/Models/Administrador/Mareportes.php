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
                log_message('info','[AIMPCONTRATO|Async/Q] Generando datos desde consulta para continuar edición de usuario');
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

    public function llenarDatosTablaRecibosPago()
    {
        try {
            $builder=$this->dbBuild->table('sys_clientes');
            $builder->select("CONCAT(IDCOBRO_COBR,'_',IDUSUA_CLIEN,'_',CONTRATO_COBR) AS idTablePk, IDCOBRO_COBR, CONSECUTIVO_COBR,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, CONCEPTO_COBR,
              CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_CODPOS,' C.P.',CODIPOST_CODPOS,', ',NOMBRE_MUNIC,', ',ESTADO_ESTA) AS DIRECCION,
              CONTRATO_CCONT, IDCOBRO_COBR, TOTAL_COBR, FMODIF_COBR, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_cobros','CONTRATO_COBR=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_COBR');
            $builder->where('CONTRATO_COBR=CONTRATO_CCONT');
            $builder->where('CLVCOLON_CODPOS=COLONIA_UBIC');
            $builder->like('FMODIF_COBR', date('Y-m'),'after');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
            $builder->orderBy('FECHACAP_COBR, HORACAP_COBR', 'DESC');
            $builder->limit(50);
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[REIMCOMPRO|Async/Q] Generando datos desde consulta para continuar edición de usuario');
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
            $builder->select("CONCAT(IDCOBRO_COBR,'_',IDUSUA_CLIEN,'_',CONTRATO_COBR) AS idTablePk, IDCOBRO_COBR, CONSECUTIVO_COBR,
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE, CONCEPTO_COBR,
              CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_CODPOS,' C.P.',CODIPOST_CODPOS,', ',NOMBRE_MUNIC,', ',ESTADO_ESTA) AS DIRECCION,
              CONTRATO_CCONT, IDCOBRO_COBR, TOTAL_COBR, FMODIF_COBR, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_cobros','CONTRATO_COBR=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_COBR');
            $builder->where('CONTRATO_COBR=CONTRATO_CCONT');
            $builder->where('CLVCOLON_CODPOS=COLONIA_UBIC');
            $builder->where('IDUSUARIO_COBR', $id);
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
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_CODPOS) AS DIRECCION, SUM(TOTAL_DETA) AS DEUDA, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_detalles','CONTRATO_DETA=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_colonias','CLVCOLON_CODPOS=COLONIA_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_CCONT');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->orderBy('DEUDA','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[LISTACORTE|Async/Q] Generando datos desde consulta para continuar edición de usuario');
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
            CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC,', ',COLONIA_CODPOS) AS DIRECCION, SUM(TOTAL_DETA) AS DEUDA, DESCRIPCION_ESTAT");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_detalles','CONTRATO_DETA=CONTRATO_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_colonias','CLVCOLON_CODPOS=COLONIA_UBIC');
            $builder->join('cat_estatus','CLAVE_ESTAT=ESTATUS_CCONT');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CCONT','ACTI');
            $builder->where('ESTATUS_DETA','ADEU');
            $builder->groupBy('CONTRATO_CCONT');
            $builder->orderBy('DEUDA','DESC');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[LISTACORTE|Async/Q] Generando datos desde consulta para continuar edición de usuario');
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

    public function llenarDatosComboAnioMes()
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('FMODIF_COBR');
            $builder->where('FMODIF_COBR >','2021-12-29');
            // $builder->orLike('FMODIF_COBR','2022','after');
            // $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
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
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
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

    public function llenarDatosComboDia($id)
    {
        try {

            $builder=$this->dbBuild->table('sys_clientes_cobros');
            $builder->select('FMODIF_COBR');
            $builder->like('FMODIF_COBR',$id,'after');
            // $builder->orLike('FMODIF_COBR','2022','after');
            // $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
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
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
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
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
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
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
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
            $builder->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $builder->where('ESTATUS_COBR','PAGA');
            $builder->groupBy('IDCOBRO_COBR');
            $builder->orderBy('CONSECUTIVO_COBR');
            $resultado=$builder->get();

            $buildera=$this->dbBuild->table('sys_clientes_cobros');
            $buildera->select("SUM(TOTAL_COBR) AS TOTAL");
            $buildera->like('FMODIF_COBR',$id,'after');
            $buildera->whereNotIn('CAPTURA_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $buildera->whereNotIn('IDMODIF_COBR', ['78ea9f47ea4dc69e71f266b7487f3a16cb6965e6']);
            $buildera->where('ESTATUS_COBR','PAGA');
            $buildera->groupBy('ESTATUS_COBR');
            $resultado0=$buildera->get();

            return [$resultado->getResultArray(), $resultado0->getResultArray()];

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
            FNACIM_CLIEN, SEXO_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN, ESTADO_ESTA, NOMBRE_MUNIC,
            CODIPOST_CODPOS, COLONIA_CODPOS, CONCAT(CALLE_CLIEN,' ',NEXTE_CLIEN,' ',NINTE_CLIEN) AS CALLES, CONTRATO_CCONT, 
            DESCRIPCION_CONT, DESCRIPCION_CTARI, DESCRIPCION_CPERM");
            $builder->join('sys_clientes_contratos','IDUSUA_CLIEN=CLIENTE_CCONT');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_contratosTarifas','CLAVE_CTARI=DESCUENTO_CCONT');
            $builder->join('cat_contratosPermisos','CLAVE_CPERM=PERMISO_CCONT');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->where('IDUSUA_CLIEN',$parametro[1]);
            $builder->where('CONTRATO_CCONT',$parametro[0]);
            $builder->where('CLVCOLON_CODPOS=COLONIA_UBIC');
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
            CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE,ESTADO_ESTA,NOMBRE_MUNIC,
            CODIPOST_CODPOS,COLONIA_CODPOS,CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,
            MODO_CCONT,TIPO_CCONT,PERMISO_CCONT,DESCUENTO_CCONT,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS RESPONS");
            $builderb->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builderb->join('sys_responsables','IDUSUA_RESPO=CAPTURA_CCONT');
            $builderb->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builderb->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builderb->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builderb->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builderb->where('CLVCOLON_CODPOS=COLONIA_UBIC');
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
                    $campG=$filas['ESTADO_ESTA'];
                    $campH=$filas['NOMBRE_MUNIC'];
                    $campI=$filas['CODIPOST_CODPOS'];
                    $campJ=$filas['COLONIA_CODPOS'];
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
            EMAIL_CLIEN, TELEFONO_CLIEN, MOVIL_CLIEN, CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES, ESTADO_ESTA, NOMBRE_MUNIC,
            CODIPOST_CODPOS, COLONIA_CODPOS, CONTRATO_CCONT, DESCUENTO_CCONT, DESCRIPCION_CONT, PERMISO_CCONT, IDCOBRO_COBR, FECHACAP_COBR, HORACAP_COBR, CONSECUTIVO_COBR");
            $builder->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builder->join('sys_clientes_detalles','USUARIO_DETA=IDUSUA_CLIEN');
            $builder->join('sys_clientes_cobros','IDCOBRO_COBR=IDCOBRO_DETA');
            $builder->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builder->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builder->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builder->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builder->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builder->where('IDCOBRO_COBR', $parametros[0]);
            $builder->where('IDUSUA_CLIEN',$parametros[1]);
            $builder->where('CONTRATO_CCONT', $parametros[2]);
            $builder->where('CONTRATO_COBR=CONTRATO_CCONT');
            $builder->where('CLVCOLON_CODPOS=COLONIA_UBIC');
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->groupBy('IDUSUA_CLIEN');
            $resultado=$builder->get();

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
            $builderc->where('USUARIO_DETA',$parametros[1]);
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
            ESTADO_ESTA, NOMBRE_MUNIC,CODIPOST_CODPOS, COLONIA_CODPOS, CONCAT(CALLE_UBIC,' ',NEXTE_UBIC,' ',NINTE_UBIC) AS CALLES,
            DESCRIPCION_CONT, TIPO_CCONT, PERMISO_CCONT, DESCUENTO_CCONT, FECHACAP_CCONT, FBAJA_CCONT, IDBAJA_CCONT,
            CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS RESPONS, FOLIO_CBAJA");
            $builderc->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $builderc->join('sys_responsables','IDUSUA_RESPO=IDBAJA_CCONT');
            $builderc->join('sys_clientes_contratosBajas','CONTRATO_CBAJA=CONTRATO_CCONT');
            $builderc->join('cat_contratos','CLAVE_CONT=TIPO_CCONT');
            $builderc->join('sys_clientes_ubicaciones','IDUBIC_UBIC=UBICA_CCONT');
            $builderc->join('cat_estados','CLAVE_ESTA=ESTADO_UBIC');
            $builderc->join('cat_municipios','CLVMUNI_MUNIC=MUNICIPIO_UBIC');
            $builderc->join('cat_colonias','CLVCODPOS_CODPOS=CODIPOSTAL_UBIC');
            $builderc->where('CLVCOLON_CODPOS=COLONIA_UBIC');
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
                    $campE=$filas['ESTADO_ESTA'];
                    $campF=$filas['NOMBRE_MUNIC'];
                    $campG=$filas['CODIPOST_CODPOS'];
                    $campH=$filas['COLONIA_CODPOS'];
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
                $arreglo,
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

    




}





?>