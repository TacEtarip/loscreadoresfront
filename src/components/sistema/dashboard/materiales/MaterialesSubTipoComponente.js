import React, {useState} from 'react';
import { Row, Col, Button, Card, Spinner, Breadcrumb } from 'react-bootstrap';
import { FaFolderPlus } from 'react-icons/fa';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import ModificarMaterialComponente from '../modals/ModificarMaterialComonente';
import imagenTest from '../../../../assets/images/textilbg.jpg'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useRouteMatch } from 'react-router-dom';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';
const materialSchema = yup.object().shape({
    codMaterial: yup.number(),
    nombre: yup.string().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').max(50).required('Se requiere el nombre.'),
    unidadDeMedida: yup.string().required(),
    unidadDeMedidaUso: yup.string().required(),
    descripcion: yup.string().max(1000).required('Se requiere una descripción.'),
    tipoOperacion: yup.number(),
    index: yup.number(),
});

const MaterialesSubTipoComponente = (probs) =>{
    const [modalAddMaterial, setModalAddMaterial] = useState(false);

    const [subTipo, setSubTipo] = useState(null);
    const { url } = useRouteMatch();

    const apiMAT = useMaterialAPI();

    const apiMatRef = React.useRef(apiMAT);

    const materialFormik = useFormik({
        validationSchema: materialSchema,
        initialValues: { codMaterial: -1, nombre: '', 
        unidadDeMedida: '', unidadDeMedidaUso: '', 
        tipoOperacion: 1, descripcion: '', index: -1 }
    });

    const handleModalOpening = (cod, nombre, tipoOperacion, unidadDeMedida, unidadDeMedidaUso, descripcion, index) =>{
        materialFormik.setFieldValue('index', index);
        materialFormik.setFieldValue('codMaterial', cod);
        materialFormik.setFieldValue('nombre', nombre);
        materialFormik.setFieldValue('tipoOperacion', tipoOperacion);
        materialFormik.setFieldValue('unidadDeMedida', unidadDeMedida);
        materialFormik.setFieldValue('unidadDeMedidaUso', unidadDeMedidaUso);
        materialFormik.setFieldValue('descripcion', descripcion);
        materialFormik.setFieldTouched('nombre', false);
        materialFormik.setFieldTouched('unidadDeMedida', false);
        materialFormik.setFieldTouched('unidadDeMedidaUso', false);
        materialFormik.setFieldTouched('descripcion', false);
        setModalAddMaterial(true);
    };

    React.useEffect(() => {
        const getSubTipoFunction = async () => {
            const result = await apiMatRef.current.getSubTipo(probs.codSubTipoMaterial);
            if (result.error && result.error !== 0) {
                alert(result.message);
            }
            setSubTipo(result.subTipo || null);
        }
        getSubTipoFunction();
    }, [probs.codSubTipoMaterial])


    const agregarMaterial = (newMaterial) => {
        subTipo.materiales.push(newMaterial)
        setSubTipo(subTipo);
    };

    const editarMaterial = (newMaterial, index) => {
        subTipo.materiales[index] = newMaterial;
        setSubTipo(subTipo);
    };

    return(
        <React.Fragment>
            {subTipo ? (
                <React.Fragment>
                   <Row>
                    <Col>
                        <Breadcrumb>
                            <li className="breadcrumb-item">
                                <Link to={'/sistema/dashboard/materiales/'}>Materiales</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/sistema/dashboard/materiales/${subTipo.codTipoMaterial}`}>
                                {subTipo.nombreTipo}</Link>
                            </li>
                            <Breadcrumb.Item  active
                            href={url}>{subTipo.nombre}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    </Row>
                    <Row style={{'alignItems': 'center'}}>
                    <Col xs="auto"><h1>{subTipo.nombre}</h1></Col>
                    <Col xs="auto">
                    <Button xs="auto" onClick={() => handleModalOpening(-1, '', 1, '', '', '')}
                    type="button" className="danger-btn-fix btn-text-icon" variant="danger">
                        <FaFolderPlus></FaFolderPlus>
                        Añadir Material
                    </Button>
                    </Col>
            </Row>
            <Row  xs={1} md={2} lg={3} className="g-4 row-espacio">
                {subTipo.materiales.map((m, i) => {
                    return (
                    <Col key={i}>
                        <Card>
                            <Card.Img variant="top" src={imagenTest} />
                            <Card.Body>
                                <Card.Title className="titulo-card">
                                        <h5>{m.nombre}</h5>
                                        <span className="spacer"></span>
                                        <div>
                                            <span onClick={() => handleModalOpening(m.codMaterial, m.nombre, 2, m.unidad_medida, m.unidad_medida_uso, m.descripcion, i)}>
                                                <MdModeEdit></MdModeEdit></span>
                                            <span onClick={() => handleModalOpening(m.codMaterial, m.nombre, 3, m.unidad_medida, m.unidad_medida_uso, m.descripcion, i)}>
                                                <MdDelete></MdDelete></span>
                                        </div> 
                                    </Card.Title>
                                    <Card.Text>
                                        {m.descripcion}
                                    </Card.Text>
                                <hr/>  
                                <Link to={`/sistema/dashboard/materiales/${probs.codTipoMaterial}/${probs.codSubTipoMaterial}/${m.codMaterial}`}>Ver {m.nombre}</Link>
                            </Card.Body>
                        </Card>
                    </Col>)
                })}
            </Row>
            <ModificarMaterialComponente
                formikMaterial={materialFormik}
                show={modalAddMaterial}
                onHide={() => setModalAddMaterial(false)}
                codSubTipoMaterial={parseInt(probs.codSubTipoMaterial)}
                agregar={agregarMaterial}
                editar={editarMaterial}
            />
                </React.Fragment>
            )
            :(
                <Row style={{justifyContent: 'center', height: '60vh', 'alignContent': 'center'}}>
                        <Spinner variant="danger" size="lg" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>       
                </Row> 
            )}
            
        </React.Fragment>
        );
};

export default MaterialesSubTipoComponente;