import React from 'react';
import './modal.scss';
import PropTypes from 'prop-types'; 
import { Modal, Button, Container, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';

const ModificarVarianteMaterial = (props) => {
    const [disabled, setDisabled] = React.useState(false);
    const materialAPI = useMaterialAPI();

    const ejecutarAccion = async () => {
      setDisabled(true);
      const hexCode = props.formikVarianteMaterial.values.hex_code.substring(1);
      if (props.formikVarianteMaterial.values.tipoOperacion === 1) {
        const result = await materialAPI.crearVarianteMaterial(
            props.formikVarianteMaterial.values.nombre, 
            props.codMaterial, 
            props.formikVarianteMaterial.values.codColor,
            props.formikVarianteMaterial.values.codMarca,
            props.formikVarianteMaterial.values.precio_por_unidad,
            props.formikVarianteMaterial.values.descripcion,
            props.formikVarianteMaterial.values.nombreColor,
            hexCode
        );
        setDisabled(false);

        if (result.error && result.error !== 0) {
            alert(result.message);
        } 
        else {
            props.agregar(result.nuevaVariante);
            props.onHide();
        }
      } else if (props.formikVarianteMaterial.values.tipoOperacion === 2) {
        const result = await materialAPI.editarVarianteMaterial(
            props.formikVarianteMaterial.values.nombre, 
            props.formikVarianteMaterial.values.codMaterialDefinido, 
            props.formikVarianteMaterial.values.codColor,
            props.formikVarianteMaterial.values.codMarca,
            props.formikVarianteMaterial.values.precio_por_unidad,
            props.formikVarianteMaterial.values.descripcion,
            props.formikVarianteMaterial.values.nombreColor,
            hexCode
        );
        setDisabled(false);
        if (result.error && result.error !== 0) {
            alert(result.message);
        } 
        else { 
            props.editar(result.nuevaVariante, props.formikVarianteMaterial.values.index);
            props.onHide();
         }
      }
    };

    React.useEffect(() => {
        const setColor = (codColor) => {
            if (codColor > 0) {
                const index = props.colores.findIndex(c => codColor == c.codColor);
                props.formikVarianteMaterial.setFieldValue('hex_code',  '#' + props.colores[index].hex_code);
                props.formikVarianteMaterial.setFieldValue('nombreColor', props.colores[index].nombre);
            } else {
                props.formikVarianteMaterial.setFieldValue('nombreColor', '');
            }
        }
        setColor(props.formikVarianteMaterial.values.codColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.formikVarianteMaterial.values.codColor]);
    return (
    <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        centered
        fullscreen={'sm-down'}
    >
        <Modal.Header closeButton>
            <Modal.Title id="add-tipo-material">
                <h4>{ props.formikVarianteMaterial.values.tipoOperacion === 1 ? ('Añadir variante de material') : 
                    (props.formikVarianteMaterial.values.tipoOperacion === 2 ? ('Editar Variante ' + props.formikVarianteMaterial.values.codMaterialDefinido)
                      : ('Eliminar Variante'))}</h4>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
          { props.formikVarianteMaterial.values.tipoOperacion !== 3 ? 
            (<Form onSubmit={props.formikVarianteMaterial.handleSubmit} noValidate>
                <Row className="g-3">
                <Form.Group disabled={disabled} as={Col} md="12">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                        name="nombre"
                        placeholder="Nombre..."
                        onChange={props.formikVarianteMaterial.handleChange}
                        onBlur={props.formikVarianteMaterial.handleBlur}
                        value={props.formikVarianteMaterial.values.nombre}
                        isInvalid={!!props.formikVarianteMaterial.errors.nombre && props.formikVarianteMaterial.touched.nombre}
                        />
                        <Form.Control.Feedback type="invalid">{props.formikVarianteMaterial.errors.nombre}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group disabled={disabled} as={Col} md="4">
                        <Form.Label>Seleccionar Color</Form.Label>
                        <Form.Select
                        name="codColor"
                        type="text"
                        onChange={props.formikVarianteMaterial.handleChange}
                        onBlur={props.formikVarianteMaterial.handleBlur}
                        value={props.formikVarianteMaterial.values.codColor}
                        isInvalid={!!props.formikVarianteMaterial.errors.codColor}
                        >
                            <option value={-1}>Seleccionar Color</option>
                            <option value={0}>Color Nuevo</option>
                            {
                                props.colores.map((c, i) => {
                                    return (<option key={i} value={c.codColor}>{c.nombre}</option>)
                                })
                            }
                        </Form.Select>    
                    </Form.Group>
                    <Form.Group as={Col} md="7">
                        <Form.Label>Nombre de color</Form.Label>
                        <Form.Control
                        name="nombreColor"
                        type="text"
                        disabled={(props.formikVarianteMaterial.values.codColor == 0) ? false:true}
                        placeholder="Ejemplo: Rojo"
                        onChange={props.formikVarianteMaterial.handleChange}
                        onBlur={props.formikVarianteMaterial.handleBlur}
                        value={props.formikVarianteMaterial.values.nombreColor}
                        isInvalid={!!props.formikVarianteMaterial.errors.nombreColor && props.formikVarianteMaterial.touched.nombreColor}
                        />
                        <Form.Control.Feedback type="invalid">{props.formikVarianteMaterial.errors.nombreColor}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group disabled={disabled}  as={Col} md="1">
                        <Form.Label>Pick</Form.Label>
                        <Form.Control
                        name="hex_code"
                        type="color"
                        onChange={props.formikVarianteMaterial.handleChange}
                        value={props.formikVarianteMaterial.values.hex_code}
                        disabled={(props.formikVarianteMaterial.values.codColor == 0) ? false:true}
                        />
                    </Form.Group>
                    <Form.Group disabled={disabled} as={Col} md="6">
                        <Form.Label>Seleccionar Marca</Form.Label>
                        <Form.Select
                        name="codMarca"
                        type="text"
                        onChange={props.formikVarianteMaterial.handleChange}
                        onBlur={props.formikVarianteMaterial.handleBlur}
                        value={props.formikVarianteMaterial.values.codMarca}
                        isInvalid={!!props.formikVarianteMaterial.errors.codMarca}
                        >
                            <option value={-1}>Seleccionar Marca</option>
                            {
                                props.marcas.map((c, i) => {
                                    return (<option key={i} value={c.codMarca}>{c.nombre}</option>)
                                })
                            }
                        </Form.Select>    
                    </Form.Group>
                    <Form.Group disabled={disabled} as={Col} md="6">
                        <Form.Label>Costo De Gasto Por Unidad</Form.Label>
                        <InputGroup>
                        <InputGroup.Text>S/</InputGroup.Text>
                        <Form.Control
                        name="precio_por_unidad"
                        type="number"
                        placeholder="Ejemplo: 10.00"
                        onChange={props.formikVarianteMaterial.handleChange}
                        onBlur={props.formikVarianteMaterial.handleBlur}
                        value={props.formikVarianteMaterial.values.precio_por_unidad}
                        isInvalid={!!props.formikVarianteMaterial.errors.precio_por_unidad 
                            && props.formikVarianteMaterial.touched.precio_por_unidad}
                        />
                                                <Form.Control.Feedback type="invalid">
                            {props.formikVarianteMaterial.errors.precio_por_unidad}
                        </Form.Control.Feedback>
                        </InputGroup>

                    </Form.Group>
                    <Form.Group disabled={disabled} as={Col} md="12">
                        <Form.Label>Descripción corta</Form.Label>
                        <Form.Control
                        name="descripcion"
                        as="textarea"
                        onChange={props.formikVarianteMaterial.handleChange}
                        onBlur={props.formikVarianteMaterial.handleBlur}
                        value={props.formikVarianteMaterial.values.descripcion}
                        isInvalid={!!props.formikVarianteMaterial.errors.descripcion && props.formikVarianteMaterial.touched.descripcion}
                        />
                        <Form.Control.Feedback type="invalid">{props.formikVarianteMaterial.errors.descripcion}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
            </Form>) 
              : (
                  <React.Fragment>
                    <h5>¿Estas seguro que quieres eliminar la variación {props.formikVarianteMaterial.values.codMaterialDefinido}?</h5>
                    <p>Se eliminaran todas la variacion y los productos dentro de ella.</p>
                  </React.Fragment>
              ) }
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={props.onHide}>Cerrar</Button>
          <Button type="button" disabled={!props.formikVarianteMaterial.isValid || disabled} className="danger-btn-fix" variant="danger" onClick={ejecutarAccion}>
                { props.formikVarianteMaterial.values.tipoOperacion === 1 ? ('Añadir') : 
                (props.formikVarianteMaterial.values.tipoOperacion === 2 ? ('Editar') : ('Eliminar'))}
            </Button>
        </Modal.Footer>
    </Modal>)
}

ModificarVarianteMaterial.propTypes = {
    onHide: PropTypes.func,
    formikVarianteMaterial: PropTypes.object,
    colores: PropTypes.array,
    marcas: PropTypes.array,
    editar: PropTypes.func,
    agregar: PropTypes.func,
    codMaterial: PropTypes.number,
    show: PropTypes.bool
}

export default ModificarVarianteMaterial;
