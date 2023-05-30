<?php

namespace App\Models\Administrador;
use CodeIgniter\Model;

class Macomite extends Model
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
            log_message('info','[ACOMITE] Envio de datos para renderizado de parametros web');
            return $resultado->getResultArray();
        }
    }

    public function llenarDatosTablaComite()
    {
        try {
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->select("`IDUSUA_RESPO` AS `idTablePk`, `ID_RESPO`,CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS `NOMBRE`, SEXO_RESPO, TELEFONO_RESPO, FMODIF_RESPO, DESCRIPHOM_PUESTO, DESCRIPMUJ_PUESTO");
            $builder->join('cat_puestos','CLAVE_PUESTO=PERFIL_RESPO');
            $builder->whereNotIn('CLAVE_PUESTO', ['MASTER']);
            $builder->where('ESTATUS_RESPO','ACTI');
            $builder->orderBy('FMODIF_RESPO','DESC');
            $builder->groupBy('IDUSUA_RESPO');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[REGCOMITE|Async/Q] Generando datos por consulta para renderizado de tabla comite.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDuplicadosComite($datosParaGuardar)
    {
        try {
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->select("NOMBRE_RESPO, APATERNO_RESPO, AMATERNO_RESPO");
            $builder->where('NOMBRE_RESPO',$datosParaGuardar[1]);
            $builder->where('APATERNO_RESPO',$datosParaGuardar[2]);
            $builder->where('AMATERNO_RESPO',$datosParaGuardar[3]);
            $builder->where('EMAIL_RESPO',$datosParaGuardar[8]);
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[REGCOMITE|Async/Q] Generando datos por consulta de duplicados registro comite.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarDatosComiteNuevo($datosParaGuardar)
    {
        try {
            $acentuado = ['á','é','í','ó','ú'];
            $sinacento = ['a','e','i','o','ú'];
            $nombre=str_replace($acentuado,$sinacento,$datosParaGuardar[1]);
            $apaterno=str_replace($acentuado,$sinacento,$datosParaGuardar[2]);
            $amaterno=str_replace($acentuado,$sinacento,$datosParaGuardar[3]);
            $generaContrasena=substr($nombre, 0,4).substr($apaterno, 0,2).substr($amaterno, 0,2).'.'.date('his');

            if(empty($datosParaGuardar[8])){
                $idUsuarioAsignado=sha1(date('YmdHis'));
                $generaUsuario=substr($nombre, 0,4).substr($apaterno, 0,2).substr($amaterno, 0,2);
            }else{
                $idUsuarioAsignado=sha1($datosParaGuardar[8]);
                $generaUsuario=$datosParaGuardar[8];
            }
            log_message('info','[REGCOMITE|Async] Definiendo id de usuario y contraseña para asignar a comite');

            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$idUsuarioAsignado
            ];
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->selectMax('(ID_RESPO)+1','ID_RESPO');
            $builder->where('ESTATUS_RESPO','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                foreach($resultado->getResultArray() as $filas){
                    $secuenciaOrden=$filas['ID_RESPO'];
                }
                if($secuenciaOrden==''){
                    $secuenciaOrden=1;
                }
                log_message('info','[REGCOMITE|Async/Q] Obteniendo secuencia para asignar a {item}',$log_extra);

                $setGuardarComiteUsuario=[
                    'FECHCAPT_RESPO'=>date('Y-m-d'),
                    'HORACAPT_RESPO'=>date('H:i:s'),
                    'CAPTURA_RESPO'=>$datosParaGuardar[0],
                    'IDUSUA_RESPO'=>$idUsuarioAsignado,
                    'ID_RESPO'=>str_pad($secuenciaOrden, 8, '0', STR_PAD_LEFT),
                    'NOMBRE_RESPO'=>ucwords(mb_strtolower($datosParaGuardar[1])),
                    'APATERNO_RESPO'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                    'AMATERNO_RESPO'=>ucwords(mb_strtolower($datosParaGuardar[3])),
                    'AREA_RESPO'=>'ADMINISTRAD',
                    'FNACIM_RESPO'=>$datosParaGuardar[4],
                    'SEXO_RESPO'=>$datosParaGuardar[5],
                    'PUESTO_RESPO'=>$datosParaGuardar[17],
                    'TELEFONO_RESPO'=>$datosParaGuardar[6],
                    'MOVIL_RESPO'=>$datosParaGuardar[7],
                    'EMAIL_RESPO'=>base64_encode($generaUsuario),
                    'CAMPUS_RESPO'=>'TELTI',
                    'USUARIO_RESPO'=>base64_encode(base64_encode($generaUsuario)),
                    'PASSWORD_RESPO'=>base64_encode(base64_encode(base64_encode($generaContrasena))),
                    'IDMODIF_RESPO'=>$datosParaGuardar[0],
                    'FMODIF_RESPO'=>date('Y-m-d'),
                    'NIVELPERF_RESPO'=>'ADMINISTRAD',
                    'PERFIL_RESPO'=>$datosParaGuardar[17],
                    'ESTATUS_RESPO'=>'ACTI',
                ];
                $builderb=$this->dbBuild->table('sys_responsables');
                $builderb->insert($setGuardarComiteUsuario);
                log_message('notice','[REGCOMITE|Async/Q] {captur} creo un nuevo registro de responsable en el sistema continua proceso', $log_extra);

                $builderc=$this->dbBuild->table('sys_ubicaciones');
                $builderc->selectMax('(SECUENCIA_UBIC)+1','SECUENCIA_UBIC');
                $builderc->where('IDUSUA_UBIC', $idUsuarioAsignado);
                $builderc->where('ESTATUS_UBIC','ACTI');
                $resultado0=$builderc->get();
                foreach($resultado0->getResultArray() as $filas){
                    $secuenciaUbic=$filas['SECUENCIA_UBIC'];
                }
                if($secuenciaUbic==''){
                    $secuenciaUbic=1;
                }

                $builderh=$this->dbBuild->table('cat_perfiles');
                $builderh->select('PERFIL_PERF');
                $builderh->where('CLAVE_PERF',$datosParaGuardar[17]);
                $builderh->where('ESTATUS_PERF','ACTI');
                $resultado2=$builderh->get();

                if($resultado2->getNumRows()>0){
                    log_message('notice','[REGCOMITE|Async/Q] Se obtuvieron los privilegios del perfil solicitado integrando en registro');
                    foreach($resultado2->getResultArray() as $filas){
                        $opciones=$filas['PERFIL_PERF'];
                    }

                    $setPerfilUsuario=[
                        'FECHCAPT_PERFUS'=>date('Y-m-d'),
                        'HORACAPT_PERFUS'=>date('H:i:s'),
                        'CAPTURA_PERFUS'=>$datosParaGuardar[0],
                        'IDUSUA_PERFUS'=>$idUsuarioAsignado,
                        'PERFIL_PERFUS'=>$datosParaGuardar[17],
                        'OPCIONES_PERFUS'=>$opciones,
                        'IDMODIF_PERFUS'=>$datosParaGuardar[0],
                        'FMODIF_PERFUS'=>date('Y-m-d'),
                    ];
                    $builderg=$this->dbBuild->table('sys_perfilusuario');
                    $builderg->insert($setPerfilUsuario);
                    log_message('notice','[REGCOMITE|Async/Q] {captur} creo un nuevo registro de responsable y se le asigno sus privilegios en el sistema continua proceso', $log_extra);

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
                $builderd=$this->dbBuild->table('sys_ubicaciones');
                $builderd->insert($setAgregaUbicaiones);
                log_message('notice','[REGCOMITE|Async/Q] {captur} creo una ubicacion para el usuario en el sistema continua proceso', $log_extra);

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
                        log_message('info','[REGCOMITE|Async/Q] Obteniendo secuencia para asignar a calle',$log_extra);
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
                    log_message('notice','[REGCOMITE|Async/Q] Agregando nueva calle al sistema');

                }

                return true;

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosEditarComite($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->select("IDUSUA_RESPO, NOMBRE_RESPO, APATERNO_RESPO, AMATERNO_RESPO, EMAIL_RESPO,
            FNACIM_RESPO, SEXO_RESPO, TELEFONO_RESPO, MOVIL_RESPO, ESTADO_UBIC, MUNICIPIO_UBIC,
            CODIPOSTAL_UBIC, COLONIA_UBIC, CALLE_UBIC, NEXTE_UBIC, NINTE_UBIC, REFERENCIA_UBIC, IDUBIC_UBIC, PERFIL_RESPO");
            $builder->join('sys_ubicaciones','IDUSUA_UBIC=IDUSUA_RESPO');
            $builder->where('IDUSUA_RESPO', $id);
            $builder->where('ESTATUS_RESPO','ACTI');
            $builder->groupBy('IDUSUA_RESPO');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[REGUSUARIOS|Async/Q] Generando datos desde consulta para continuar edición de comite');
                return $resultado->getResultArray();

            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosRegistroComite($datosParaGuardar)
    {
        try {
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
                'item'=>$idUsuarioAsignado
            ];

            $setActualizarUsuario=[
                'NOMBRE_RESPO'=>ucwords(mb_strtolower($datosParaGuardar[2])),
                'APATERNO_RESPO'=>ucwords(mb_strtolower($datosParaGuardar[3])),
                'AMATERNO_RESPO'=>ucwords(mb_strtolower($datosParaGuardar[4])),
                'AREA_RESPO'=>'ADMINISTRAD',
                'FNACIM_RESPO'=>$datosParaGuardar[5],
                'SEXO_RESPO'=>$datosParaGuardar[6],
                'PUESTO_RESPO'=>$datosParaGuardar[18],
                'TELEFONO_RESPO'=>$datosParaGuardar[7],
                'MOVIL_RESPO'=>$datosParaGuardar[8],
                'EMAIL_RESPO'=>$datosParaGuardar[9],
                'CAMPUS_RESPO'=>'TELTI',
                'USUARIO_RESPO'=>base64_encode(base64_encode($generaUsuario)),
                'PASSWORD_RESPO'=>base64_encode(base64_encode(base64_encode($generaUsuario))),
                'IDMODIF_RESPO'=>$datosParaGuardar[0],
                'FMODIF_RESPO'=>date('Y-m-d'),
                'NIVELPERF_RESPO'=>$datosParaGuardar[19],
                'PERFIL_RESPO'=>$datosParaGuardar[19],
                'ESTATUS_RESPO'=>'ACTI',
            ];
            $buildera=$this->dbBuild->table('sys_responsables');
            $buildera->where('IDUSUA_RESPO', $datosParaGuardar[1]);
            $buildera->set($setActualizarUsuario);
            $buildera->update($setActualizarUsuario);
            log_message('notice','[REGCOMITE|Async/Q] {captur} actualizó registro de responsable en el sistema continua proceso', $log_extra);

            $builderb=$this->dbBuild->table('cat_perfiles');
            $builderb->select('PERFIL_PERF');
            $builderb->where('CLAVE_PERF',$datosParaGuardar[19]);
            $builderb->where('ESTATUS_PERF','ACTI');
            $resultado2=$builderb->get();

            if($resultado2->getNumRows()>0){
                log_message('notice','[REGCOMITE|Async/Q] Se obtuvieron los privilegios del perfil solicitado integrando en registro');
                foreach($resultado2->getResultArray() as $filas){
                    $opciones=$filas['PERFIL_PERF'];
                }

                $setPerfilUsuario=[
                    'PERFIL_PERFUS'=>$datosParaGuardar[19],
                    'OPCIONES_PERFUS'=>$opciones,
                    'IDMODIF_PERFUS'=>$datosParaGuardar[0],
                    'FMODIF_PERFUS'=>date('Y-m-d'),
                ];
                $builderc=$this->dbBuild->table('sys_perfilusuario');
                $builderc->where('IDUSUA_PERFUS', $datosParaGuardar[1]);
                $builderc->set($setPerfilUsuario);
                $builderc->update($setPerfilUsuario);
                log_message('notice','[REGCOMITE|Async/Q] {captur} actualizó registro de responsable y se le asigno sus privilegios en el sistema continua proceso', $log_extra);

            }

            $setActualizarUbicaiones = [
                'PAIS_UBIC'=>'MX',
                'ESTADO_UBIC'=>$datosParaGuardar[11],
                'MUNICIPIO_UBIC'=>$datosParaGuardar[12],
                'CODIPOSTAL_UBIC'=>$datosParaGuardar[13],
                'COLONIA_UBIC'=>$datosParaGuardar[14],
                'CALLE_UBIC'=>$datosParaGuardar[15],
                'NEXTE_UBIC'=>$datosParaGuardar[16],
                'NINTE_UBIC'=>$datosParaGuardar[17],
                'REFERENCIA_UBIC'=>$datosParaGuardar[18],
                'IDMODIF_UBIC'=>$datosParaGuardar[0],
                'FMODIF_UBIC'=>date('Y-m-d'),
                'ESTATUS_UBIC'=>'ACTI',
            ];
            $builderd=$this->dbBuild->table('sys_ubicaciones');
            $builderd->where('IDUSUA_UBIC', $datosParaGuardar[1]);
            $builderd->where('IDUBIC_UBIC', $datosParaGuardar[10]);
            $builderd->set($setActualizarUbicaiones);
            $builderd->update($setActualizarUbicaiones);
            log_message('notice','[REGCOMITE|Async/Q] {captur} actualizó una ubicacion para el usuario en el sistema continua proceso', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosRegistroComite($id)
    {
        try {
            $setActualUbicaciones=[
                'FMODIF_UBIC'=>date('Y-m-d'),
                'ESTATUS_UBIC'=>'BAJA',
            ];
            $builder=$this->dbBuild->table('sys_ubicaciones');
            $builder->where('IDUSUA_UBIC',$id);
            $builder->where('ESTATUS_UBIC','ACTI');
            $builder->set($setActualUbicaciones);
            $builder->update($setActualUbicaciones);
            log_message('notice','[REGCOMITE|Async/Q] Registro eliminado de estructura ubicaciones correctamente update baja.');

            $setActualResponsables=[
                'FMODIF_RESPO'=>date('Y-m-d'),
                'ESTATUS_RESPO'=>'BAJA',
            ];
            $buildere=$this->dbBuild->table('sys_responsables');
            $buildere->where('IDUSUA_RESPO',$id);
            $buildere->where('ESTATUS_RESPO','ACTI');
            $buildere->set($setActualResponsables);
            $buildere->update($setActualResponsables);
            log_message('notice','[REGCOMITE|Async/Q] Registro eliminado de estructura responsables comite correctamente.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosCredencialesMail($id)
    {
        try {
            $log_extra=[
                'user'=>$id,
            ];

            $builderh=$this->dbBuild->table('sys_responsables');
            $builderh->select("IDUSUA_RESPO,CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS NOMBRE,EMAIL_RESPO,USUARIO_RESPO,PASSWORD_RESPO,ESTATUS_RESPO");
            $builderh->where('IDUSUA_RESPO',$id);
            $builderh->where('ESTATUS_RESPO','ACTI');
            $builderh->groupBy('IDUSUA_RESPO');
            $resultado=$builderh->get();
            
            if($resultado->getNumRows()>0){
                log_message('info','[ACTIVASTAFF|Async/Q] Datos para mensaje de credenciales de {user}.', $log_extra);
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function autoDatosCompletarStaffNombre($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->select("IDUSUA_RESPO, CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS `NOMBRE`, ID_RESPO");
            $builder->like('NOMBRE_RESPO', $parametro[1],'after');
            $builder->where('ESTATUS_RESPO','BAJA');
            $builder->orderBy('NOMBRE_RESPO','APATERNO_RESPO','ASC');
            $builder->groupBy('IDUSUA_RESPO');
            $builder->limit(50);
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function tablaDatosStaffReactivar($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_responsables');
            $builder->select("IDUSUA_RESPO,CONCAT(NOMBRE_RESPO,' ',APATERNO_RESPO,' ',AMATERNO_RESPO) AS `NOMBRE`");
            $builder->where('IDUSUA_RESPO',$id);
            $builder->orderBy('NOMBRE_RESPO','APATERNO_RESPO','ASC');
            $builder->groupBy('IDUSUA_RESPO');
            $builder->limit(50);
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }
    }

    public function llenarDatosTablaAsambleas()
    {
        try {
            log_message('info','[CREAASAMBLE|Async] Solicitando datos para listado asambleas.');
            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("`CODIGO_ASAM` AS `idTablePk`, `CODIGO_ASAM`, DESCRIPCION_ASAM, TIPO_ASAM, DESCRIPCION_ESTAT, FECHA_ASAM, HORA_ASAM, COALESCE(COUNT(DISTINCT(USUARIO_CONV))) AS TOTALES");
            $builder->join('cat_estatus','CLAVE_ESTAT=TIPO_ASAM');
            $builder->join('sys_comite_convocatorias','CODIGOASAM_CONV=CODIGO_ASAM','left');
            $builder->whereIn('ESTATUS_ASAM',['ACTI','CONV','CERR','SANC']);
            $builder->orderBy('FMODIF_ASAM','DESC');
            $builder->groupBy('CODIGO_ASAM');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CREAASAMBLE|Async/Q] Generando datos por consulta para renderizado de tabla asambleas.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDuplicadosAsambleas($datosParaGuardar)
    {
        try {
            
            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("CODIGO_ASAM, DESCRIPCION_ASAM");
            $builder->where('CODIGO_ASAM',$datosParaGuardar[1]);
            $builder->where('ESTATUS_ASAM','ACTI');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function guardarDatosAsambleaNueva($datosParaGuardar)
    {
        try {

            $log_extra=[
                'captur'=>$datosParaGuardar[0],
            ];
            if($datosParaGuardar[3]=='ORDI'){
                $costoSancion=200.00;
            }elseif($datosParaGuardar[3]=='EXOR'){
                $costoSancion=100.00;
            }
            $setGuardarAsamblea=[
                'FECHACAP_ASAM'=>date('Y-m-d'),
                'HORACAP_ASAM'=>date('H:i:s'),
                'CAPTURA_ASAM'=>$datosParaGuardar[0],
                'CODIGO_ASAM'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'DESCRIPCION_ASAM'=>$datosParaGuardar[2],
                'TIPO_ASAM'=>$datosParaGuardar[3],
                'FECHA_ASAM'=>$datosParaGuardar[4],
                'HORA_ASAM'=>$datosParaGuardar[5],
                'IDMODIF_ASAM'=>$datosParaGuardar[0],
                'FMODIF_ASAM'=>date('Y-m-d'),
                'ESTATUS_ASAM'=>'ACTI',
            ];
            $buildera=$this->dbBuild->table('sys_comite_asambleas');
            $buildera->insert($setGuardarAsamblea);
            log_message('notice','[CREAASAMBLE|Async/Q] {captur} creo un nuevocódigo de asamblea continua proceso', $log_extra);

            $setGuardarConceptos=[
                'FECHACAP_CONC'=>date('Y-m-d'),
                'HORACAP_CONC'=>date('H:i:s'),
                'CAPTURA_CONC'=>$datosParaGuardar[0],
                'CLAVE_CONC'=>ucwords(mb_strtoupper($datosParaGuardar[1])),
                'DESCRIPCION_CONC'=>$datosParaGuardar[2],
                'CLASIFIC_CONC'=>'Sanción Asamblea',
                'COSTO_CONC'=>$costoSancion,
                'IDMODIF_CONC'=>$datosParaGuardar[0],
                'FMODIF_CONC'=>date('Y-m-d'),
                'ESTATUS_CONC'=>'ACTI',
            ];
            $builderb=$this->dbBuild->table('cat_conceptos');
            $builderb->insert($setGuardarConceptos);
            log_message('notice','[CREAASAMBLE|Async/Q] {captur} creo un concepto desde asamblea', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function buscarDatosEditarAsamblea($id)
    {
        try {
            log_message('info','[CREAASAMBLE|Async] Solicitando datos para listado asambleas.');
            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("CODIGO_ASAM, DESCRIPCION_ASAM, TIPO_ASAM, FECHA_ASAM, HORA_ASAM");
            $builder->whereIn('CODIGO_ASAM',$id);
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CREAASAMBLE|Async/Q] Generando datos por consulta para renderizado de tabla asambleas.');
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function actualizarDatosAsamblea($datosParaGuardar)
    {
        try {
            $log_extra=[
                'captur'=>$datosParaGuardar[0],
            ];
            if($datosParaGuardar[3]=='ORDI'){
                $costoSancion=200.00;
            }elseif($datosParaGuardar[3]=='EXOR'){
                $costoSancion=100.00;
            }
            $setActualizarAsamblea=[
                'DESCRIPCION_ASAM'=>$datosParaGuardar[2],
                'TIPO_ASAM'=>$datosParaGuardar[3],
                'FECHA_ASAM'=>$datosParaGuardar[4],
                'HORA_ASAM'=>$datosParaGuardar[5],
                'IDMODIF_ASAM'=>$datosParaGuardar[0],
                'FMODIF_ASAM'=>date('Y-m-d'),
            ];
            $buildera=$this->dbBuild->table('sys_comite_asambleas');
            $buildera->where('CODIGO_ASAM',$datosParaGuardar[1]);
            $buildera->set($setActualizarAsamblea);
            $buildera->update($setActualizarAsamblea);
            log_message('notice','[CREAASAMBLE|Async/Q] {captur} actualizo código de asamblea continua proceso', $log_extra);

            $setActualizaConceptos=[
                'DESCRIPCION_CONC'=>$datosParaGuardar[2],
                'CLASIFIC_CONC'=>'Sanción Asamblea',
                'COSTO_CONC'=>$costoSancion,
                'IDMODIF_CONC'=>$datosParaGuardar[0],
                'FMODIF_CONC'=>date('Y-m-d'),
            ];
            $builderb=$this->dbBuild->table('cat_conceptos');
            $builderb->where('CLAVE_CONC',$datosParaGuardar[1]);
            $builderb->set($setActualizaConceptos);
            $builderb->update($setActualizaConceptos);
            log_message('notice','[CREAASAMBLE|Async/Q] {captur} actualizo código de concepto desde asamblea', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function eliminarDatosAsamblea($datosParaEliminar)
    {
        try {
            $log_extra=[
                'captur'=>$datosParaEliminar[0],
                'item'=>$datosParaEliminar[1],
            ];
            $buildera=$this->dbBuild->table('sys_comite_asambleas');
            $buildera->where('CODIGO_ASAM',$datosParaEliminar[1]);
            $buildera->where('ESTATUS_ASAM','ACTI');
            $buildera->delete();
            log_message('notice','[CREAASAMBLE|Async/Q] {captur} elimino código de asamblea.',$log_extra);

            $builderb=$this->dbBuild->query('ALTER TABLE `sys_comite_asambleas` AUTO_INCREMENT = 1');
            log_message('notice','[CREAASAMBLE|Async/Q] Reindexando tabla tras eliminación.');

            $builderc=$this->dbBuild->table('cat_conceptos');
            $builderc->where('CLAVE_CONC',$datosParaEliminar[1]);
            $builderc->where('ESTATUS_CONC','ACTI');
            $builderc->delete();
            log_message('notice','[CREAASAMBLE|Async/Q] Registro eliminado de estructura conceptos correctamente.');

            $builderd=$this->dbBuild->query('ALTER TABLE `cat_conceptos` AUTO_INCREMENT = 1');
            log_message('notice','[CREAASAMBLE|Async/Q] Reindexando tabla tras eliminación.');

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosTablaConvocatorias()
    {
        try {

            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("`CODIGO_ASAM` AS `idTablePk`, `CODIGO_ASAM`, DESCRIPCION_ASAM, DESCRIPCION_ESTAT, FECHA_ASAM, HORA_ASAM, COUNT(DISTINCT(USUARIO_CONV)) AS INVITADOS, ESTATUS_ASAM");
            $builder->join('sys_comite_convocatorias','CODIGOASAM_CONV=CODIGO_ASAM','left');
            $builder->join('cat_estatus','CLAVE_ESTAT=TIPO_ASAM');
            $builder->groupBy('CODIGOASAM_CONV');
            $resultado=$builder->get();
            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para renderizado de codigo asambleas.');
                $convocados=$resultado->getResultArray();
            }
            $buildera=$this->dbBuild->table('sys_comite_convocatorias');
            $buildera->select("CODIGOASAM_CONV AS `idTablePk`, COUNT(DISTINCT(USUARIO_CONV)) AS INVITADOS, ASISTENCIA_CONV");
            $buildera->where('ESTATUS_CONV','CERR');
            $buildera->groupBy('CODIGOASAM_CONV, ASISTENCIA_CONV');
            $resultado0=$buildera->get();
            if($resultado0->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para renderizado de total convocados.');
                $asistencia=$resultado0->getResultArray();
            }

            return [
                $convocados,
                $asistencia,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function totalesDatosUsuariosConvocados($id)
    {
        try {
            log_message('info','[CONVASAMBLEA|Async] Solicitando datos para listado asambleas.');

            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("CODIGO_ASAM, DESCRIPCION_ASAM, DESCRIPCION_ESTAT");
            $builder->join('cat_estatus','CLAVE_ESTAT=TIPO_ASAM');
            $builder->where('CODIGO_ASAM',$id);
            $builder->groupBy('CODIGO_ASAM');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para informe de asamblea.');
                $asambleas=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("COUNT(DISTINCT(IDUSUA_CLIEN)) AS TOTALES");
            $buildera->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            // $buildera->where('PERMISO_CCONT','NOPERM');
            $buildera->where('ESTATUS_CCONT','ACTI');
            $buildera->groupBy('ESTATUS_CCONT');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
                $invitados=$resultado0->getResultArray();
            }

            return [
                $asambleas,
                $invitados,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function usuariosDatosConvocados()
    {
        try {
            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("CONCAT(IDUSUA_CLIEN,'_',CODBARR_CLIEN,'_',CONTRATO_CCONT) AS IDUSUARIO");
            $buildera->join('sys_clientes_contratos','CLIENTE_CCONT=IDUSUA_CLIEN');
            $buildera->where('ESTATUS_CCONT','ACTI');
            $buildera->where('ESTATUS_CLIEN','ACTI');
            $buildera->groupBy('IDUSUA_CLIEN');
            $buildera->orderBy('CODBARR_CLIEN');
            $resultado=$buildera->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
                foreach($resultado->getResultArray() as $filas){
                    $idUsuario[]=$filas['IDUSUARIO'];
                }
            }

            return $idUsuario;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function creandoDatosInvitacionUsuario($datosModificar)
    {
        try {
            $parametros = explode('_',$datosModificar[1]);
            $log_extra=[
                'user'=>$parametros[0],
                'item'=>$datosModificar[2],
            ];

            $setInvitacion = [
                'FECHACAP_CONV'=>date('Y-m-d'),
                'HORACAP_CONV'=>date('H:i:s'),
                'CAPTURA_CONV'=>$datosModificar[0],
                'CODIGOASAM_CONV'=>$datosModificar[2],
                'USUARIO_CONV'=>$parametros[0],
                'CODBARRUS_CONV'=>$parametros[1],
                'CONTRATO_CONV'=>$parametros[2],
                'IDMODIF_CONV'=>$datosModificar[0],
                'FMODIF_CONV'=>date('Y-m-d'),
                'ESTATUS_CONV'=>'CONV',
            ];
            $builder=$this->dbBuild->table('sys_comite_convocatorias');
            $builder->insert($setInvitacion);
            log_message('info','[CONVASAMBLEA|Async/Q] Creando invitación para {user} a asamblea {item}', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function consultarDatosAsambleaConvocada($id)
    {
        try {
            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("CODIGO_ASAM, DESCRIPCION_ASAM, DESCRIPCION_ESTAT, COUNT(DISTINCT(USUARIO_CONV)) AS TOTALES");
            $builder->join('cat_estatus','CLAVE_ESTAT=TIPO_ASAM');
            $builder->join('sys_comite_convocatorias','CODIGOASAM_CONV=CODIGO_ASAM');
            $builder->where('CODIGO_ASAM',$id);
            $builder->groupBy('CODIGO_ASAM');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para informe de asamblea.');
                $asambleas=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_comite_convocatorias');
            $buildera->select("ASISTENCIA_CONV, ESTATUS_CONV, COUNT(DISTINCT(USUARIO_CONV)) AS TOTALES, ");
            $buildera->where('CODIGOASAM_CONV',$id);
            $buildera->groupBy('ESTATUS_CONV');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
                $invitados=$resultado0->getResultArray();
            }

            return [
                $asambleas,
                $invitados,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function cerrarDatosAsambleaConvocada($datosAsistencia)
    {
        try {
            $log_extra=[
                'user'=>$datosAsistencia[0],
                'item'=>$datosAsistencia[1],
            ];
            $setAsistencia = [
                'FECHASIS_CONV'=>date('Y-m-d'),
                'HORAASIS_CONV'=>date('H:i:s'),
                'ASISTENCIA_CONV'=>'FALT',
                'TOMASIS_CONV'=>$datosAsistencia[0],
                'METODOASIS_CONV'=>'NONE',
                'IDMODIF_CONV'=>$datosAsistencia[0],
                'FMODIF_CONV'=>date('Y-m-d'),
                'ESTATUS_CONV'=>'CERR',
            ];
            $builder=$this->dbBuild->table('sys_comite_convocatorias');
            $builder->where('CODIGOASAM_CONV',$datosAsistencia[1]);
            $builder->where('ESTATUS_CONV','CONV');
            $builder->set($setAsistencia);
            $builder->update($setAsistencia);
            log_message('notice','[CONVASAMBLEA|Async/Q] {user} cerro asistecias de {item} por bloque.', $log_extra);

            $setActualizarAsamblea=[
                'FMODIF_ASAM'=>date('Y-m-d'),
                'IDMODIF_ASAM'=>$datosAsistencia[0],
                'ESTATUS_ASAM'=>'CERR',
            ];
            $buildera=$this->dbBuild->table('sys_comite_asambleas');
            $buildera->where('CODIGO_ASAM',$datosAsistencia[1]);
            $buildera->where('ESTATUS_ASAM','ACTI');
            $buildera->set($setActualizarAsamblea);
            $buildera->update($setActualizarAsamblea);
            log_message('notice','[CONVASAMBLEA|Async/Q] {user} cerro asamblea {item}.', $log_extra);

            return true;
            // $buildera=$this->dbBuild->table('sys_comite_convocatorias');
            // $buildera->select("CONCAT(USUARIO_CONV,'_',CODBARRUS_CONV) AS IDUSUARIO");
            // $buildera->where('CODIGOASAM_CONV',$datosAsistencia[1]);
            // $buildera->where('ASISTENCIA_CONV','FALT');
            // $buildera->where('ESTATUS_CONV','CERR');
            // $buildera->groupBy('IDUSUARIO');
            // $resultado=$buildera->get();

            // if($resultado->getNumRows()>0){
            //     log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
            //     foreach($resultado->getResultArray() as $filas){
            //         $idUsuario[]=$filas['IDUSUARIO'];
            //     }
            // }

            // return $idUsuario;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function informeDatosAsambleaAsistencias($id)
    {
        try {
            log_message('info','[CONVASAMBLEA|Async] Solicitando datos para listado asambleas.');

            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("CONCAT(CODIGO_ASAM,'_',TIPO_ASAM) AS CODIGOASAM, DESCRIPCION_ASAM, DESCRIPCION_ESTAT");
            $builder->join('cat_estatus','CLAVE_ESTAT=TIPO_ASAM');
            $builder->where('CODIGO_ASAM',$id);
            $builder->groupBy('CODIGO_ASAM');
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para informe de asamblea.');
                $asambleas=$resultado->getResultArray();
            }

            $buildera=$this->dbBuild->table('sys_comite_convocatorias');
            $buildera->select("COUNT(DISTINCT(USUARIO_CONV)) AS TOTALES");
            $buildera->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CONV');
            $buildera->where('ASISTENCIA_CONV','FALT');
            $buildera->where('PERMISO_CCONT','NOPERM');
            $buildera->where('CODIGOASAM_CONV',$id);
            $buildera->where('ESTATUS_CONV','CERR');
            $resultado0=$buildera->get();

            if($resultado0->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
                $invitados=$resultado0->getResultArray();
            }

            return [
                $asambleas,
                $invitados,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function usuariosDatosFaltantes($id)
    {
        try {
            $parametros=explode('_',$id);
            $buildera=$this->dbBuild->table('sys_comite_convocatorias');
            $buildera->select("CONCAT(USUARIO_CONV,'_',CONTRATO_CONV) AS IDUSUARIO");
            $buildera->join('sys_clientes_contratos','CONTRATO_CCONT=CONTRATO_CONV');
            $buildera->where('ASISTENCIA_CONV','FALT');
            $buildera->where('PERMISO_CCONT','NOPERM');
            $buildera->where('CODIGOASAM_CONV', $parametros[0]);
            $buildera->where('ESTATUS_CONV','CERR');
            $buildera->groupBy('USUARIO_CONV');
            $resultado=$buildera->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
                foreach($resultado->getResultArray() as $filas){
                    $idUsuario[]=$filas['IDUSUARIO'];
                }
            }

            return $idUsuario;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function aplicandoDatosSanciones($datosModificar)
    {
        try {
            $db= \Config\Database::connect();
            $parametros = explode('_',$datosModificar[1]);
            $parametroa = explode('_',$datosModificar[2]);
            $log_extra=[
                'user'=>$datosModificar[0],
                'item'=>$parametros[0],
            ];
            if($parametroa[1]=='ORDI'){
                $costoSancion=200.00;
            }elseif($parametroa[1]=='EXOR'){
                $costoSancion=100.00;
            }

            $setSancionado = [
                'FECHACAP_DETA'=>date('Y-m-d'),
                'HORACAP_DETA'=>date('H:i:s'),
                'CAPTURA_DETA'=>$datosModificar[0],
                'USUARIO_DETA'=>$parametros[0],
                'CONTRATO_DETA'=>$parametros[1],
                'CODIGO_DETA'=>$parametroa[0],
                'CANTIDAD_DETA'=>1,
                'COSTO_DETA'=>$costoSancion,
                'TOTAL_DETA'=>$costoSancion,
                'IDMODIF_DETA'=>$datosModificar[0],
                'FMODIF_DETA'=>date('Y-m-d'),
                'ESTATUS_DETA'=>'ADEU',
            ];
            $buildera=$db->table('sys_clientes_detalles');
            $buildera->insert($setSancionado);
            log_message('info','[CONVASAMBLEA|Async/Q] {user} Creando sancioó para {item} de asamblea.', $log_extra);

            return true;

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function mostrarDatosResumenAsamblea($id)
    {
        try {
            $parametros=explode('_',$id);
            $buildera=$this->dbBuild->table('sys_comite_convocatorias');
            $buildera->select("DESCRIPCION_ASAM, COUNT(DISTINCT(USUARIO_CONV)) AS TOTALES, ASISTENCIA_CONV");
            $buildera->join('sys_comite_asambleas','CODIGO_ASAM=CODIGOASAM_CONV');
            $buildera->where('CODIGOASAM_CONV', $parametros[0]);
            $buildera->where('ESTATUS_CONV','CERR');
            $buildera->groupBy('ASISTENCIA_CONV');
            $resultado=$buildera->get();

            if($resultado->getNumRows()>0){
                log_message('info','[CONVASAMBLEA|Async/Q] Generando datos por consulta para total de usuarios convocados.');
                $usuario=$resultado->getResultArray();
            }

            $setActualizarAsamblea=[
                'ESTATUS_ASAM'=>'SANC',
            ];
            $builderb=$this->dbBuild->table('sys_comite_asambleas');
            $builderb->where('CODIGO_ASAM',$parametros[0]);
            $builderb->where('ESTATUS_ASAM','CERR');
            $builderb->set($setActualizarAsamblea);
            $builderb->update($setActualizarAsamblea);
            log_message('notice','[CONVASAMBLEA|Async/Q] Actualizando el estatus de la asasmblea sancionada.');

            return [
                $usuario,
            ];

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function llenarDatosComboAsambleas()
    {
        try {
            $builder=$this->dbBuild->table('sys_comite_asambleas');
            $builder->select("CODIGO_ASAM, DESCRIPCION_ASAM, COUNT(DISTINCT(USUARIO_CONV)) AS TOTALES");
            $builder->join('sys_comite_convocatorias','CODIGOASAM_CONV=CODIGO_ASAM');
            $builder->where('ESTATUS_ASAM','ACTI');
            $builder->groupBy('CODIGO_ASAM');
            $builder->limit(50);
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function autoDatosCompletarUsuario($id)
    {
        try {
            $parametro=explode('_',$id);
            $builder=$this->dbBuild->table('sys_comite_convocatorias');
            $builder->select("IDUSUA_CLIEN, CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS `NOMBRE`, ID_CLIEN");
            $builder->join('sys_clientes','IDUSUA_CLIEN=USUARIO_CONV');
            $builder->like('NOMBRE_CLIEN', $parametro[0],'after');
            $builder->where('CODIGOASAM_CONV', $parametro[1]);
            $builder->where('ESTATUS_CLIEN','ACTI');
            $builder->where('ESTATUS_CONV','CONV');
            $builder->orderBy('NOMBRE_CLIEN','APATERNO_CLIEN','ASC');
            $builder->groupBy('IDUSUA_CLIEN');
            $builder->limit(50);
            $resultado=$builder->get();

            if($resultado->getNumRows()>0){
                return $resultado->getResultArray();
            }

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }

    public function marcarDatosAsistencia($datosAsistencia)
    {
        try {
            $parametros=explode('_',$datosAsistencia[1]);
            $log_extra=[
                'user'=>$datosAsistencia[0],
                'item'=>$parametros[0],
            ];
            $setAsistencia = [
                'FECHASIS_CONV'=>date('Y-m-d'),
                'HORAASIS_CONV'=>date('H:i:s'),
                'ASISTENCIA_CONV'=>'ASIS',
                'TOMASIS_CONV'=>$datosAsistencia[0],
                'METODOASIS_CONV'=>$parametros[1],
                'IDMODIF_CONV'=>$datosAsistencia[0],
                'FMODIF_CONV'=>date('Y-m-d'),
                'ESTATUS_CONV'=>'CERR',
            ];
            $builder=$this->dbBuild->table('sys_comite_convocatorias');
            if($parametros[1]=='QRCODE' or $parametros[1]=='NOMBR'){
                $builder->where('USUARIO_CONV',$parametros[0]);
            }else if($parametros[1]=='BRCOD'){
                $builder->where('CODBARRUS_CONV',$parametros[0]);
            }
            $builder->where('ESTATUS_CONV','CONV');
            $builder->set($setAsistencia);
            $builder->update($setAsistencia);
            log_message('notice','[CONVASAMBLE|Async/Q] {user} tomo asistecia de {item} por qr', $log_extra);

            $buildera=$this->dbBuild->table('sys_clientes');
            $buildera->select("CONCAT(NOMBRE_CLIEN,' ',APATERNO_CLIEN,' ',AMATERNO_CLIEN) AS NOMBRE");
            if($parametros[1]=='QRCODE' or $parametros[1]=='NOMBR'){
                $buildera->where('IDUSUA_CLIEN',$parametros[0]);
            }else if($parametros[1]=='BRCOD'){
                $buildera->where('CODBARR_CLIEN',$parametros[0]);
            }
            $buildera->where('ESTATUS_CLIEN','ACTI');
            $resultado=$buildera->get();

            return $resultado->getResult();

        } catch (Exception $errorElement) {
            return json_encode($errorElement.message());
        }

    }










}