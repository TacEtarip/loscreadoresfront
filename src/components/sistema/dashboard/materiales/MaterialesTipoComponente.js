import React, {useState} from 'react';
import { Row, Col, Button, Card, Spinner, Breadcrumb } from 'react-bootstrap';
import { FaFolderPlus } from 'react-icons/fa';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import ModificarSubTipoMaterialComponente from '../modals/ModificarSubTipoMaterialComponente';
import imagenTest from '../../../../assets/images/textilbg.jpg'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useRouteMatch } from 'react-router-dom';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';

const tipoSchema = yup.object().shape({
    codSubTipoMaterial: yup.number(),
    nombre: yup.string().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').max(50).required('Se requiere el nombre.'),
    tipoOperacion: yup.number(),
    index: yup.number(),
});

const MaterialesTipoComponente = (probs) =>{
    const [modalAddSubTipo, setModalAddSubTipo] = useState(false);
    const { url } = useRouteMatch();

    const [tipo, setTipo] = useState(null);

    const apiMAT = useMaterialAPI();

    const apiMatRef = React.useRef(apiMAT);

    const subTipoFormik = useFormik({
        validationSchema: tipoSchema,
        initialValues: { codSubTipoMaterial: -1, nombre: '', tipoOperacion: 1, index: -1 }
    });

    const handleModalOpening = (cod, nombre, tipoOperacion, index) =>{
        subTipoFormik.setFieldValue('index', index);
        subTipoFormik.setFieldValue('codSubTipoMaterial', cod);
        subTipoFormik.setFieldValue('nombre', nombre);
        subTipoFormik.setFieldValue('tipoOperacion', tipoOperacion);
        subTipoFormik.setFieldTouched('nombre', false);
        setModalAddSubTipo(true);
    };

    React.useEffect(() => {
        const getTipoFunc =  async () => {
            const result = await apiMatRef.current.getTipo(probs.codTipoMaterial);
            if (result.error && result.error !== 0) {
                alert(result.message);
            }
            setTipo(result.tipo || null);
        }
        getTipoFunc();
    }, [probs.codTipoMaterial])

    const agregarSubTipoMaterial = (newSubTipoMaterial) => {
        const temporalTipos = tipo.subTipos;
        temporalTipos.push(newSubTipoMaterial);
        tipo.subTipos = temporalTipos;
        setTipo(tipo);
    };

    const editarSubTipoMaterial = (newSubTipoMaterial, index) => {
        tipo.subTipos[index] = newSubTipoMaterial;
        setTipo(tipo);
    };

    return(
        <React.Fragment>
            {
                tipo !== null ? (
                    <React.Fragment>
                    <Row>
                    <Col>
                        <Breadcrumb>
                            <li className="breadcrumb-item">
                                <Link to={'/sistema/dashboard/materiales/'}>Materiales</Link>
                            </li>
                            <Breadcrumb.Item  active
                            href={url}>{tipo.nombre}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    </Row>
                        <Row style={{'alignItems': 'center'}}>
                    <Col xs="auto"><h1>{tipo.nombre}</h1></Col>
                    <Col xs="auto">
                    <Button xs="auto" onClick={() => handleModalOpening(-1, '', 1)}
                    type="button" className="danger-btn-fix btn-text-icon" variant="danger">
                        <FaFolderPlus></FaFolderPlus>
                        Añadir Sub Tipo
                    </Button>
                    </Col>
            </Row>
            <Row  xs={1} md={2} lg={3} className="g-4 row-espacio">
                {tipo.subTipos.map((t, i) => {
                    return (
                    <Col key={i}>
                        <Card>
                            <Card.Img variant="top" src={imagenTest} />
                            <Card.Body>
                                <Card.Title className="titulo-card">
                                        <h5>{t.nombre}</h5>
                                        <span className="spacer"></span>
                                        <div>
                                            <span onClick={() => handleModalOpening(t.codSubTipoMaterial, t.nombre, 2, i)}>
                                                <MdModeEdit></MdModeEdit></span>
                                            <span onClick={() => handleModalOpening(t.codSubTipoMaterial, t.nombre, 3, i)}>
                                                <MdDelete></MdDelete></span>
                                        </div> 
                                    </Card.Title>
                                <hr/>  
                                <Link to={`/sistema/dashboard/materiales/${probs.codTipoMaterial}/${t.codSubTipoMaterial}`}>Ver {t.nombre}</Link>
                            </Card.Body>
                        </Card>
                    </Col>)
                })}
            </Row>
            <ModificarSubTipoMaterialComponente
                formikSubTipo={subTipoFormik}
                show={modalAddSubTipo}
                onHide={() => setModalAddSubTipo(false)}
                codTipoMaterial={parseInt(probs.codTipoMaterial)}
                agregar={agregarSubTipoMaterial}
                editar={editarSubTipoMaterial}
            />
                    </React.Fragment>
                ) : (
                    <Row style={{justifyContent: 'center', height: '60vh', 'alignContent': 'center'}}>
                        <Spinner variant="danger" size="lg" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>       
                    </Row>
                )
            }
            
            
        </React.Fragment>
        );
};

export default MaterialesTipoComponente;