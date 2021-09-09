import React, {useState} from 'react';
import { Row, Col, Button, Card, Image, ListGroup, ListGroupItem, Form, InputGroup, Spinner, Breadcrumb } from 'react-bootstrap';
import imagenTest from '../../../../assets/images/textilbg.jpg'
import { FaFolderPlus, FaSearch } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useRouteMatch } from 'react-router-dom';
import ModificarVarianteMaterial from '../modals/ModificarVarianteMaterial';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import ModificarMaterialComponente from '../modals/ModificarMaterialComonente';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';
import { getColores, getMarcas } from '../../util/helpersAPI';
const varianteSchema = yup.object().shape({
    nombre: yup.string().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').max(20).required('Nombre requerido'),
    codMaterialDefinido: yup.number(),
    codColor: yup.number().required(),
    hex_code: yup.string().required(),
    nombreColor: yup.string().max(20, 'Maximo 20 caracteres').matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').required('Color requerido'),
    codMarca: yup.number().required(),
    precio_por_unidad: yup.number().min(0.10, 'El minimo es de S/0.10').required('Campo requerido.'),
    descripcion: yup.string().max(200, 'Descripción muy larga.').required('Se requiere una descripción.'),
    tipoOperacion: yup.number(),
    index: yup.number(),
});

const filtrosSchema = yup.object().shape({
    busqueda: yup.string(),
    codColor: yup.number(),
    codMarca: yup.number(),
    precioMinimo: yup.number('Precio invalido'),
    precioMaximo: yup.number('Precio invalido'),
});

const materialSchema = yup.object().shape({
    codMaterial: yup.number(),
    nombre: yup.string().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').max(50).required('Se requiere el nombre.'),
    unidadDeMedida: yup.string().required(),
    unidadDeMedidaUso: yup.string().required(),
    descripcion: yup.string().max(1000).required('Se requiere una descripción.'),
    tipoOperacion: yup.number(),
    index: yup.number(),
});

const MaterialesComponente = (probs) => {

    const [modalAddVariante, setModalAddVariante] = useState(false);
    const [modalModifyMaterial, setModalModifyMaterial] = useState(false);

    const [material, setMaterial] = useState(null);

    const [variantes, setVariantes] = useState([]);

    const [colores, setColores] = useState([]);

    const [marcas, setMarcas] = useState([]);

    const { url } = useRouteMatch();

    const apiMAT = useMaterialAPI();

    const apiMatRef = React.useRef(apiMAT);

    React.useEffect(() => {
        getColores().subscribe(res => {
            if (res.error) {
                alert(res.error)
              } else {
                setColores(res);
              }
        });

        getMarcas().subscribe(res => {
            if (res.error) {
                alert(res.error)
              } else {
                setMarcas(res);
              }
        });
    }, []);

    React.useEffect(() => {
        const getMaterialFunc = async () => {
            const result = await apiMatRef.current.getMaterial(probs.codMaterial);
            if (result.error && result.error !== 0) {
                alert(result.message);
            } else {
                setVariantes(result.material.variantes || []);
                result.material.variantes = undefined;
                setMaterial(result.material || null);
            }
        }
        getMaterialFunc();
    }, [probs.codMaterial]);

    const varianteFormik = useFormik({
        validationSchema: varianteSchema,
        initialValues: { 
            nombre: '',
            codMaterialDefinido: -1,
            codColor: -1,
            hex_code: '',
            nombreColor: '',
            codMarca: -1,
            precio_por_unidad: 0,
            descripcion: '',
            tipoOperacion: 1,
            index: -1,
     }
    });

    const getVariantesFiltradas = async () => {
        const result = await apiMatRef.current.getVariantesFiltro(
                probs.codMaterial, 
                filtrosFormik.values.codColor == -1 ? null : filtrosFormik.values.codColor, 
                filtrosFormik.values.codMarca == -1 ? null : filtrosFormik.values.codMarca,
                filtrosFormik.values.precioMinimo == '' ? null : filtrosFormik.values.precioMinimo,
                filtrosFormik.values.precioMaximo == '' ? null : filtrosFormik.values.precioMaximo,
                filtrosFormik.values.busqueda == '' ? null : filtrosFormik.values.busqueda);
        if (result.error && result.error !== 0) {
            alert(result.message);
        } else {
            setVariantes(result.variantes || []);
        }
    }

    const filtrosFormik = useFormik({
        validationSchema: filtrosSchema,
        initialValues: {
            busqueda: '',
            codColor: -1,
            codMarca: -1,
            precioMinimo: '',
            precioMaximo: '',
        },
        onSubmit: () => getVariantesFiltradas()
    });

    const materialFormik = useFormik({
        validationSchema: materialSchema,
        initialValues: { codMaterial: -1, nombre: '', 
        unidadDeMedida: '', unidadDeMedidaUso: '', 
        tipoOperacion: 1, descripcion: '', index: -1 }
    });

    const handleModalOpening = (nombre, codMaterialDefinido, codColor, hex_code, nombreColor, codMarca, precio_por_unidad, descripcion, tipoOperacion, index) =>{
        varianteFormik.resetForm();
        varianteFormik.setFieldValue('nombre', nombre);
        varianteFormik.setFieldValue('codMaterialDefinido', codMaterialDefinido);
        varianteFormik.setFieldValue('codColor', codColor);
        varianteFormik.setFieldValue('hex_code', '#' + hex_code);
        varianteFormik.setFieldValue('nombreColor', nombreColor);
        varianteFormik.setFieldValue('codMarca', codMarca);
        varianteFormik.setFieldValue('precio_por_unidad', precio_por_unidad);
        varianteFormik.setFieldValue('descripcion', descripcion);
        varianteFormik.setFieldValue('tipoOperacion', tipoOperacion);
        varianteFormik.setFieldValue('index', index);
        setModalAddVariante(true);
    };

    const handleModalMaterialOpening = (cod, nombre, tipoOperacion, unidadDeMedida, unidadDeMedidaUso, descripcion, index) =>{
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
        setModalModifyMaterial(true);
    };

    const editarMaterial = (newMaterial) => {
        material.nombre = newMaterial.nombre;
        material.descripcion = newMaterial.descripcion;
        material.unidad_medida = newMaterial.unidad_medida;
        material.unidad_medida_uso = newMaterial.unidad_medida_uso;
        setMaterial(material);
    };

    const agregarVariante = (newVariante) => {
        variantes.push(newVariante)
        setVariantes(variantes);
    };

    const editarVariante = (newVariante, index) => {
        variantes[index] = newVariante;
        setVariantes(variantes);
    };

    return(
    <React.Fragment>
        {material ? (
            <React.Fragment>
            <Row>
                    <Col>
                        <Breadcrumb>
                            <li className="breadcrumb-item">
                                <Link to={'/sistema/dashboard/materiales/'}>Materiales</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/sistema/dashboard/materiales/${material.codTipoMaterial}`}>
                                {material.nombreTipo}</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/sistema/dashboard/materiales/${material.codTipoMaterial}/${material.codSubTipoMaterial}`}>
                                {material.nombreSubTipo}</Link>
                            </li>
                            <Breadcrumb.Item  active
                            href={url}>{material.nombre}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
            </Row>
            <Row className="g-4">
            <Col xs="12"><h1>{material.nombre}</h1></Col>
            <Col xs="3"><Image src={imagenTest} fluid thumbnail/></Col>
            <Col xs="9">
                <p>
                    {material.descripcion}
                </p>
                <h6 className="anotaciones" >Unidad de medida: {material.unidad_medida} | Unidad de medida para uso: {material.unidad_medida_uso}</h6>
                <div className="btns-presentacion">
                <Button  onClick={() => handleModalMaterialOpening(material.codMaterial, material.nombre, 2, material.unidad_medida, material.unidad_medida_uso, material.descripcion, -2)}
                    type="button" className="btn-text-icon" variant="light">
                        <MdModeEdit></MdModeEdit>
                        Editar
                </Button>
                <Button  onClick={() => handleModalMaterialOpening(material.codMaterial, material.nombre, 3, material.unidad_medida, material.unidad_medida_uso, material.descripcion, -2)}
                    type="button" className="btn-text-icon" variant="light">
                        <MdDelete></MdDelete>
                        Eliminar
                </Button>
                </div>

            </Col>
            <Col xs="10">
            </Col>
        </Row>
        <Row style={{'alignItems': 'center'}} className="g-4 row-espacio">
                    <Col xs="auto"><h2>Variaciones de {material.nombre}</h2></Col>
                    <Col xs="auto">
                    <Button xs="auto" onClick={() => handleModalOpening('', -1, -1, '', '',-1, 0, '', 1, -1)}
                    type="button" className="danger-btn-fix btn-text-icon" variant="danger">
                        <FaFolderPlus></FaFolderPlus>
                        Añadir Variante
                    </Button>
                    </Col>
        </Row>
        <Form onSubmit={filtrosFormik.handleSubmit}>
            <Row className="g-2 row-espacio">
                <Form.Group as={Col} md="3">
                    <Form.Label>Buscar</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><FaSearch></FaSearch></InputGroup.Text>
                        <Form.Control
                            name="busqueda"
                            placeholder="Buscar descripción o nombre."
                            onBlur={filtrosFormik.handleBlur}
                            onChange={filtrosFormik.handleChange}
                            value={filtrosFormik.values.busqueda}
                            isInvalid={filtrosFormik.errors.busqueda}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="2">
                    <Form.Label>Precio Minimo</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>S/</InputGroup.Text>
                        <Form.Control
                            name="precioMinimo"
                            placeholder="1.00"
                            type="number"
                            onBlur={filtrosFormik.handleBlur}
                            onChange={filtrosFormik.handleChange}
                            value={filtrosFormik.values.precioMinimo}
                            isInvalid={filtrosFormik.errors.precioMinimo}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="2">
                    <Form.Label>Precio Maximo</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>S/</InputGroup.Text>
                        <Form.Control
                            name="precioMaximo"
                            placeholder="2.00"
                            type="number"
                            onBlur={filtrosFormik.handleBlur}
                            onChange={filtrosFormik.handleChange}
                            value={filtrosFormik.values.precioMaximo}
                            isInvalid={filtrosFormik.errors.precioMaximo}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="2">
                    <Form.Label>Filtrar Color</Form.Label>
                    <Form.Select
                        name="codColor"
                        onBlur={filtrosFormik.handleBlur}
                        onChange={filtrosFormik.handleChange}
                        value={filtrosFormik.values.codColor}
                    >
                        <option value={-1}>Seleccionar Color</option>
                        {
                            colores.map((c, i) => {
                                return (<option key={i} value={c.codColor}>{c.nombre}</option>)
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="2">
                    <Form.Label>Filtrar Marca</Form.Label>
                    <Form.Select
                        name="codMarca"
                        onBlur={filtrosFormik.handleBlur}
                        onChange={filtrosFormik.handleChange}
                        value={filtrosFormik.values.codMarca}
                    >
                        <option value={-1}>Seleccionar Marca</option>
                        {
                            marcas.map((m, i) => {
                                return (<option key={i} value={m.codMarca}>{m.nombre}</option>)
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Col  md="1" style={{'alignSelf': 'flex-end'}}>
            <Button className="filtro-btn" variant="primary" type="submit">
                Filtrar
            </Button>
            </Col>
            </Row>

        </Form>
        <Row xs={2} md={3} lg={4} style={{marginTop: '2rem'}} className="g-2">
            {
                variantes.map((v, i) => {
                    return (
                        <Col key={i}>
                            <Card>
                                <div style={{backgroundColor: `#${v.hex_code}`}} className="card-img-top fake-card-img"></div>
                                <Card.Body>
                                    <Card.Title className="titulo-card">
                                        <h5>{v.nombre}</h5>
                                        <span className="spacer"></span>
                                        <div>
                                            <span onClick={() =>
                                                handleModalOpening(v.nombre, v.codMaterialDefinido, v.codColor, v.hex_code, v.nombreColor, v.codMarca, v.precio_por_unidad, v.descripcion, 2, i)}>
                                                <MdModeEdit></MdModeEdit></span>
                                            <span onClick={() => 
                                                handleModalOpening(v.nombre, v.codMaterialDefinido, v.codColor, v.hex_code, v.nombreColor, v.codMarca, v.precio_por_unidad, v.descripcion, 3, i)}>
                                                <MdDelete></MdDelete></span>
                                        </div> 
                                    </Card.Title>
                                    <Card.Text>
                                        {v.descripcion}
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem>Marca: {v.nombreMarca}</ListGroupItem>
                                    <ListGroupItem>Color: {v.nombreColor} | #{v.hex_code}</ListGroupItem>
                                    <ListGroupItem>Precio: S/{v.precio_por_unidad.toFixed(2)} por CMT</ListGroupItem>
                                </ListGroup>
                                <Card.Body>
                                    <Link 
                                    to={`${url}/${v.codMaterialDefinido}`}>
                                        Ver esta variante</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })
            }
        </Row>
        <ModificarVarianteMaterial
                formikVarianteMaterial={varianteFormik}
                show={modalAddVariante}
                onHide={() => setModalAddVariante(false)}
                colores={colores}
                marcas={marcas}
                editar={editarVariante}
                agregar={agregarVariante}
                codMaterial={parseInt(probs.codMaterial)}
        />

        <ModificarMaterialComponente
                formikMaterial={materialFormik}
                show={modalModifyMaterial}
                onHide={() => setModalModifyMaterial(false)}
                codSubTipoMaterial={parseInt(material.codSubTipoMaterial)}
                editar={editarMaterial}
            />
            </React.Fragment>
        ):(
            <Row style={{justifyContent: 'center', height: '60vh', 'alignContent': 'center'}}>
                        <Spinner variant="danger" size="lg" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>       
                    </Row>
        )}
        
    </React.Fragment>
    );

};

export default MaterialesComponente;