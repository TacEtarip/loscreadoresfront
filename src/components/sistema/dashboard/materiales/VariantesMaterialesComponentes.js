import React, {useState} from 'react';
import { Row, Col, Button, Card, Image, ListGroup, ListGroupItem, Form, Spinner, Breadcrumb } from 'react-bootstrap';
import imagenTest from '../../../../assets/images/textilbg.jpg'
import { FaFolderPlus } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useRouteMatch } from 'react-router-dom';
import ModificarVarianteMaterial from '../modals/ModificarVarianteMaterial';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import AddMaterialFisicoComponente from '../modals/AddMaterialFisicoComponente';
import DeleteMaterialFisicoComponente from '../modals/DeleteMaterialFisicoComponente';
import { getColores, getMarcas, getProveedores } from '../../util/helpersAPI';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';
const d = new Date();
const year = d.getFullYear();
const mes = d.getMonth();
const dia = d.getDay();

const varianteSchema = yup.object().shape({
    codMaterialDefinido: yup.number(),
    codColor: yup.number().required(),
    hex_code: yup.string().required(),
    nombreColor: yup.string().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Nombre incorrecto').required('Color requerido'),
    codMarca: yup.number().required(),
    precio_por_unidad: yup.number().min(0.10, 'El minimo es de S/0.10').required('Campo requerido.'),
    descripcion: yup.string().max(200, 'Descripción muy larga.').required('Se requiere una descripción.'),
    tipoOperacion: yup.number(),
    index: yup.number(),
});


const materialFisicoAddSchema = yup.object().shape({
    codMaterialFisico: yup.number(),
    cantidad_original:  yup.number().min(0.10, 'Cantidad invalidad').required('Campo obligatorio'),
    cantidad_gastada:  yup.number().min(0, 'Cantidad invalidad').required('Campo obligatorio'),
    codProveedor: yup.number().min(1, 'Campo obligatorio').required('Campo obligatorio'),
    valor: yup.number().min(0.10).required('Campo obligatorio'),
    cod_factura: yup.string().max(15),
    comentario: yup.string()
});


const filtrosSchema = yup.object().shape({
    estado: yup.number().required(),
    desde_fecha: yup.date().max((new Date(year, mes, dia +1))),
    hasta_fecha: yup.date().max((new Date(year, mes, dia +1))),
    codProveedor:  yup.number()
});


const VariantesMaterialesComponente = (probs) => {

    const [modalModifyVariante, setModalModifyVariante] = useState(false);
    const [modalAddMaterialFisico, setModalAddMaterialFisico] = useState(false);
    const [modalDeleteMaterialFisico, setModalDeleteMaterialFisico] = useState(false);
    const [codMaterialFisico, setCodMaterialFisico] = useState(-1);
    // eslint-disable-next-line no-unused-vars
    const [indexDelete, setIndexDelete] = useState(-1);

    const [variante, setVariante] = useState(null);

    const [materialesFisicos, setMaterialesFisicos] = useState([]);

    const [colores, setColores] = useState([]);

    const [marcas, setMarcas] = useState([]);

    const [proveedores, setProveedores] = useState([]);

    const { url } = useRouteMatch();

    const apiMAT = useMaterialAPI();

    const apiMatRef = React.useRef(apiMAT);

    const varianteFormik = useFormik({
        validationSchema: varianteSchema,
        initialValues: { 
            codMaterialDefinido: -1,
            codColor: -1,
            hex_code: '',
            nombreColor: '',
            codMarca: -1,
            precio_por_unidad: 0,
            descripcion: '',
            tipoOperacion: 1,
            index: -2,
     }
    });

    const filtrosFormik = useFormik({
        validationSchema: filtrosSchema,
        initialValues: {
            estado: 1,
            desde_fecha: '',
            hasta_fecha: '',
            codProveedor: -1
        },
        onSubmit: () => filtrar()
    });

    const materialFisicoFormik = useFormik({
        validationSchema: materialFisicoAddSchema,
        initialValues: { 
            codMaterialFisico: -1,
            cantidad_original:  '',
            cantidad_gastada:  0,
            codProveedor: -1,
            valor: '',
            cod_factura: '',
            comentario: ''
     }
    });

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

        getProveedores().subscribe(res => {
            if (res.error) {
                alert(res.error)
              } else {
                  console.log(res);
                setProveedores(res);
              }
        });
    }, []);

    React.useEffect(() => {
        const getVarianteFunc = async () => {
            const result = await apiMatRef.current.getVariante(probs.codMaterialDefinido);
            if (result.error && result.error !== 0) {
                alert(result.message);
            } else {
                setMaterialesFisicos(result.variante.materialesProductos || []);
                result.variante.materialesProductos = undefined;
                setVariante(result.variante || null);
            }
        };
        getVarianteFunc();
    }, [probs.codMaterialDefinido]);
    

    const handleModalOpeningAddMaterialFisico = () =>{
        materialFisicoFormik.resetForm();
        setModalAddMaterialFisico(true);
    };

    const filtrar = async () => {
        const result = await apiMatRef.current.getMaterialFisicosFiltro(
            probs.codMaterialDefinido,
            filtrosFormik.values.estado,
            filtrosFormik.values.codProveedor,
            filtrosFormik.values.desde_fecha, 
            filtrosFormik.values.hasta_fecha, 
        );
        if (result.error && result.error !== 0) {
            alert(result.message);
        } else {
            setMaterialesFisicos(result.materialesFisicos || []);
        }
    };

    const handleModalOpeningDelete = (codMaterialFisico, index) => {
        setCodMaterialFisico(codMaterialFisico);
        setIndexDelete(index);
        setModalDeleteMaterialFisico(true);
    };

    const handleModalOpeningModifyVariante = 
    (codMaterialDefinido, nombre, codColor, hex_code, nombreColor, codMarca, precio_por_unidad, descripcion, tipoOperacion, index) =>{
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
        setModalModifyVariante(true);
    };


    const editarVariante = (newVariante) => {
        newVariante.materialesProductos = undefined;
        setVariante({...newVariante, 
            nombreMaterial: variante.nombreMaterial, 
            codSubTipoMaterial: variante.codSubTipoMaterial, 
            nombreSubTipo: variante.nombreSubTipo,
            nombreTipo: variante.nombreTipo,
            codTipoMaterial: variante.codTipoMaterial,
            unidad_medida_uso: variante.unidad_medida_uso
        });
    };

    const agregarMaterialFisico = (newMaterialFisico) => {
        materialesFisicos.push(newMaterialFisico);
        setMaterialesFisicos(materialesFisicos);
    };

    return(
    <React.Fragment>
        {
            variante ? (
                <React.Fragment>
             <Row>
                    <Col>
                        <Breadcrumb>
                            <li className="breadcrumb-item">
                                <Link to={'/sistema/dashboard/materiales/'}>Materiales</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/sistema/dashboard/materiales/${variante.codTipoMaterial}`}>
                                {variante.nombreTipo}</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/sistema/dashboard/materiales/${variante.codTipoMaterial}/${variante.codSubTipoMaterial}`}>
                                {variante.nombreSubTipo}</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/sistema/dashboard/materiales/${variante.codTipoMaterial}/${variante.codSubTipoMaterial}/${variante.codMaterial}`}>
                                {variante.nombreMaterial}</Link>
                            </li>
                            <Breadcrumb.Item  active
                            href={url}>{variante.nombre}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
            </Row>
            <Row className="g-4">
            <Col xs="12"><h1>{variante.nombreMaterial} variación: {variante.nombre}</h1></Col>
            <Col xs="3"><Image src={imagenTest} fluid thumbnail/></Col>
            <Col xs="9">
                <p>
                    {variante.descripcion}
                </p>
                <h6 className="anotaciones" >Unidad de medida para uso: {variante.unidad_medida_uso} | Color: #{variante.hex_code}</h6>
                <div className="btns-presentacion">
                <Button  onClick={() => 
                handleModalOpeningModifyVariante(variante.codMaterialDefinido, variante.nombre,
                    variante.codColor, variante.hex_code, variante.nombreColor,
                    variante.codMarca, variante.precio_por_unidad, variante.descripcion, 2, -2)}
                    type="button" className="btn-text-icon" variant="light">
                        <MdModeEdit></MdModeEdit>
                        Editar
                </Button>
                <Button  onClick={() => 
                handleModalOpeningModifyVariante(variante.codMaterialDefinido, variante.nombre,
                    variante.codColor, variante.hex_code, variante.nombreColor,
                    variante.codMarca, variante.precio_por_unidad, variante.descripcion, 3, -2)}
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
                    <Col xs="auto"><h2>Inventario de {variante.nombreMaterial}: {probs.codTipoMaterial}</h2></Col>
                    <Col xs="auto">
                    <Button xs="auto" onClick={() => handleModalOpeningAddMaterialFisico()}
                    type="button" className="danger-btn-fix btn-text-icon" variant="danger">
                        <FaFolderPlus></FaFolderPlus>
                        Añadir Material
                    </Button>
                    </Col>
        </Row>
        <Form onSubmit={filtrosFormik.handleSubmit} noValidate>
            <Row className="g-2 row-espacio">
                <Form.Group as={Col} md="2">
                    <Form.Label>Filtrar Por Estado</Form.Label>
                    <Form.Select
                        name="estado"
                        onBlur={filtrosFormik.handleBlur}
                        onChange={filtrosFormik.handleChange}
                        value={filtrosFormik.values.estado}
                    >
                    <option value={1}>Disponible</option>
                    <option value={2}>Agotados</option>
                    <option value={3}>Todos</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="2">
                    <Form.Label>Filtrar Por Proveedor</Form.Label>
                    <Form.Select
                        name="codProveedor"
                        onBlur={filtrosFormik.handleBlur}
                        onChange={filtrosFormik.handleChange}
                        value={filtrosFormik.values.codProveedor}
                    >
                    <option value={-1}>Seleccionar Proveedor</option>
                            {
                                proveedores.map((p, i) => {
                                    return (<option key={i} value={p.codProveedor}>{p.nombrePersonaJuridica ? p.nombrePersonaJuridica : p.nombrePersonaNatural}</option>)
                                })
                            }
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="3">
                        <Form.Label>Desde el:</Form.Label>
                            <Form.Control 
                                autoComplete="off"
                                type="date"
                                name="desde_fecha"
                                placeholder="Desde..."
                                min={`${(year-1).toString()}-${(mes+1).toString().length === 1 ? '0' + (mes+1).toString() : (mes+1).toString()}-${(dia).toString().length === 1 ? '0' + (dia).toString() : (dia).toString()}`}
                                max={`${(year).toString()}-${(mes+1).toString().length === 1 ? '0' + (mes+1).toString() : (mes+1).toString()}-${(dia).toString().length === 1 ? '0' + (dia).toString() : (dia).toString()}`}
                                onBlur={filtrosFormik.handleBlur}
                                onChange={filtrosFormik.handleChange}
                                value={filtrosFormik.values.desde_fecha}
                                isInvalid={(!!filtrosFormik.errors.desde_fecha && filtrosFormik.touched.desde_fecha)}
                            />
                </Form.Group>
                <Form.Group as={Col} md="3">
                        <Form.Label>Hasta el:</Form.Label>
                            <Form.Control 
                                autoComplete="off"
                                type="date"
                                name="hasta_fecha"
                                placeholder="Fecha de nacimiento..."
                                max={`${(year).toString()}-${(mes+1).toString().length === 1 ? '0' + (mes+1).toString() : (mes+1).toString()}-${(dia).toString().length === 1 ? '0' + (dia).toString() : (dia).toString()}`}
                                onBlur={filtrosFormik.handleBlur}
                                onChange={filtrosFormik.handleChange}
                                value={filtrosFormik.values.hasta_fecha}
                                isInvalid={(!!filtrosFormik.errors.hasta_fecha && filtrosFormik.touched.hasta_fecha)}
                            />
                </Form.Group>
                <Col  md="2" style={{'alignSelf': 'flex-end'}}>
            <Button className="filtro-btn" variant="primary" type="submit">
                Filtrar
            </Button>
            </Col>
            </Row>
        </Form>
        <Row xs={2} md={3} lg={4} style={{marginTop: '2rem'}} className="g-2">
            {
                materialesFisicos.map((mfs, i) => {
                    return (
                        <Col key={i}>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="titulo-card">
                                        <h5>Codigo: {mfs.codMaterialFisico}</h5>
                                        <span className="spacer"></span>
                                        <div>
                                            <span onClick={() => 
                                                handleModalOpeningDelete(mfs.codMaterialFisico, i)}>
                                                <MdDelete></MdDelete></span>
                                        </div> 
                                    </Card.Title>
                                    <Card.Text>
                                        Ultima modificación: 
                                        {
                                            parseISO_Date(mfs.ultima_actualizacion)
                                        }
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem>Cantidad disponible: {mfs.cantidad_original - mfs.cantidad_gastada} {variante.unidad_medida_uso}</ListGroupItem>
                                    <ListGroupItem>Añadido el: 
                                        {
                                            parseISO_Date(mfs.dia_de_ingreso)
                                        }
                                    </ListGroupItem>
                                    <ListGroupItem><Link 
                                    to={`${url}/${mfs.codMaterialDefinido}`}>
                                        Ver Registro De Ingreso</Link></ListGroupItem>
                                        <ListGroupItem><Link 
                                    to={`${url}/${mfs.codMaterialDefinido}`}>
                                        Ver Registro De Uso</Link></ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    )
                })
            }
        </Row>
        <ModificarVarianteMaterial
                formikVarianteMaterial={varianteFormik}
                show={modalModifyVariante}
                onHide={() => setModalModifyVariante(false)}
                colores={colores}
                marcas={marcas}
                editar={editarVariante}
                codMaterial={parseInt(probs.codMaterial)}
        />

        <AddMaterialFisicoComponente
            onHide={() => setModalAddMaterialFisico(false)}
            materialFisicoFormik={materialFisicoFormik}
            codMaterialDefinido={parseInt(probs.codMaterialDefinido)}
            proveedores={proveedores}
            agregar={agregarMaterialFisico}
            show={modalAddMaterialFisico}
        />

        <DeleteMaterialFisicoComponente
            onHide={() => setModalDeleteMaterialFisico(false)}
            show={modalDeleteMaterialFisico}
            codMaterialDefinido={parseInt(probs.codMaterialDefinido)}
            codMaterialFisico={parseInt(codMaterialFisico)}
        />
                </React.Fragment>
            ) 
            : (
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

const parseISO_Date = (dateISO) => {
    const parsedDate = ' ' +  ((new Date(dateISO).getDate() + 1).toString().length < 2
    ? '0' + (new Date(dateISO).getDate() + 1) : (new Date(dateISO).getDate() + 1)) + '/' 
    + ((new Date(dateISO).getMonth() + 1).toString().length < 2 ? '0' : '') +
    (new Date(dateISO).getMonth() + 1) +
    '/' +
    new Date(dateISO).getFullYear()
    return parsedDate;                                             
}

export default VariantesMaterialesComponente;