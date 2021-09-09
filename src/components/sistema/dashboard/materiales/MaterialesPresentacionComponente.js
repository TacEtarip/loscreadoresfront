import React, {useState} from 'react';
import { Row, Col, Button, Card, Spinner, Breadcrumb } from 'react-bootstrap';
import { FaFolderPlus } from 'react-icons/fa';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import AddTipoMaterialComponente from '../modals/AddTipoMaterialModal';
import imagenTest from '../../../../assets/images/textilbg.jpg'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';
const tipoSchema = yup.object().shape({
    codTipoMaterial: yup.number(),
    nombre: yup.string().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').max(50).required('Se requiere el nombre.'),
    tipoOperacion: yup.number(),
    index: yup.number(),
});


const MaterialesPresentacionComponente = () =>{
    const [modalAddTipo, setModalAddTipo] = useState(false);
    
    const [tipos, setTipos] = useState([]);

    const [cargado, setCargado] = useState(false);

    const apiMAT = useMaterialAPI();

    const apiMatRef = React.useRef(apiMAT);

    const agregarTipoMaterial = (newTipoMaterial) => {
        const temporalTipos = tipos;
        temporalTipos.push(newTipoMaterial);
        setTipos(temporalTipos);
    };

    const editarTipoMaterial = (newTipoMaterial, index) => {
        const temporalTipos = tipos;
        temporalTipos[index] = newTipoMaterial;
        setTipos(temporalTipos);
    };

    useEffect(() => {
        const getTiposFunc = async () => {
            const result = await apiMatRef.current.getTiposMaterial();
            if (result.error && result.error !== 0) {
                alert(result.message);
            }
            setTipos(result.tipos || []);
            setCargado(true);
        }
        getTiposFunc();
    }, []);

    const tipoFormik = useFormik({
        validationSchema: tipoSchema,
        initialValues: { codTipoMaterial: -1, nombre: '', tipoOperacion: 1, index: -1 }
    });

    const handleModalOpening = (cod, nombre, tipoOperacion, index) =>{
        tipoFormik.setFieldValue('index', index);
        tipoFormik.setFieldValue('codTipoMaterial', cod);
        tipoFormik.setFieldValue('nombre', nombre);
        tipoFormik.setFieldValue('tipoOperacion', tipoOperacion);
        tipoFormik.setFieldTouched('nombre', false);
        setModalAddTipo(true);
    };

    return(
        <React.Fragment>
            {cargado ? (
                <React.Fragment>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item active
                            href="/sistema/dashboard/materiales">Materiales</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
            <Row style={{'alignItems': 'center'}}>
                <Col xs="auto"><h1>Tipos De Materiales</h1></Col>
                <Col xs="auto">
                    <Button onClick={() => handleModalOpening(-1, '', 1)}
                    type="button" className="danger-btn-fix btn-text-icon" variant="danger">
                        <FaFolderPlus></FaFolderPlus>
                        Añadir Tipo
                    </Button>
                </Col>
            </Row>
            <Row  xs={1} md={2} lg={3} className="g-4 row-espacio">
                {tipos.map((t, i) => {
                    return (
                    <Col key={i}>
                        <Card>
                            <Card.Img variant="top" src={imagenTest} />
                            <Card.Body>
                                <Card.Title className="titulo-card">
                                        <h5>{t.nombre}</h5>
                                        <span className="spacer"></span>
                                        <div>
                                            <span onClick={() => handleModalOpening(t.codTipoMaterial, t.nombre, 2, i)}>
                                                <MdModeEdit></MdModeEdit></span>
                                            <span onClick={() => handleModalOpening(t.codTipoMaterial, t.nombre, 3, i)}>
                                                <MdDelete></MdDelete></span>
                                        </div> 
                                    </Card.Title>
                                <hr/>  
                                <Link to={`/sistema/dashboard/materiales/${t.codTipoMaterial}`}>Ver {t.nombre}</Link>
                            </Card.Body>
                        </Card>
                    </Col>)
                })}
            </Row>
            <AddTipoMaterialComponente
                formikTipo={tipoFormik}
                show={modalAddTipo}
                onHide={() => setModalAddTipo(false)}
                agregar={agregarTipoMaterial}
                editar={editarTipoMaterial}
            />
                </React.Fragment>
            ): (
                <Row style={{justifyContent: 'center', height: '60vh', 'alignContent': 'center'}}>
                        <Spinner variant="danger" size="lg" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>       
                </Row>
            )}
        </React.Fragment>
        );
};

export default MaterialesPresentacionComponente;