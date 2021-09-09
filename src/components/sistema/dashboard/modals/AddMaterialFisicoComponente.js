import React from 'react';
import './modal.scss';
import PropTypes from 'prop-types'; 
import { Modal, Button, Container, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';

const AddMaterialFisicoComponente = (props) => {
    const [disabled, setDisabled] = React.useState(false);
    const materialAPI = useMaterialAPI();
    
    const ejecutarAccion = async () => {
        setDisabled(true);
        const result = await materialAPI.crearMaterialFisico(props.codMaterialDefinido, 
            props.materialFisicoFormik.values.cantidad_original,
            props.materialFisicoFormik.values.cantidad_gastada,
            props.materialFisicoFormik.values.codProveedor,
            props.materialFisicoFormik.values.valor,
            props.materialFisicoFormik.values.cod_factura,
            props.materialFisicoFormik.values.comentario,
        );
        setDisabled(false);
        if (result.error && result.error !== 0) {
            alert(result.message);
          } else {
            props.agregar(result.nuevoProductoMaterial);
            props.onHide();
          }
    };

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
                <h4>Añadir Material Fisico A La Variante: {props.codMaterialDefinido}</h4>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form onSubmit={props.materialFisicoFormik.handleSubmit} noValidate>
                <Row className="g-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Seleccionar Proveedor</Form.Label>
                        <Form.Select
                        disabled={disabled}
                        name="codProveedor"
                        onChange={props.materialFisicoFormik.handleChange}
                        onBlur={props.materialFisicoFormik.handleBlur}
                        value={props.materialFisicoFormik.values.codProveedor}
                        isInvalid={!!props.materialFisicoFormik.errors.codProveedor}
                        >
                            <option value={-1}>Seleccionar Proveedor</option>
                            {
                                props.proveedores.map((p, i) => {
                                    return (<option key={i} value={p.codProveedor}>{p.nombrePersonaJuridica ? p.nombrePersonaJuridica : p.nombrePersonaNatural}</option>)
                                })
                            }
                        </Form.Select>    
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Valor De Compra</Form.Label>
                        <InputGroup>
                        <InputGroup.Text>S/</InputGroup.Text>
                        <Form.Control
                        disabled={disabled}
                        name="valor"
                        type="number"
                        placeholder="Ejemplo: 10.00"
                        onChange={props.materialFisicoFormik.handleChange}
                        onBlur={props.materialFisicoFormik.handleBlur}
                        value={props.materialFisicoFormik.values.valor}
                        isInvalid={!!props.materialFisicoFormik.errors.valor 
                            && props.materialFisicoFormik.touched.valor}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.materialFisicoFormik.errors.valor}
                        </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Codigo De Factura</Form.Label>
                        <Form.Control
                        disabled={disabled}
                        name="cod_factura"
                        type="text"
                        placeholder="Ejemplo: NNNN-0021"
                        onChange={props.materialFisicoFormik.handleChange}
                        onBlur={props.materialFisicoFormik.handleBlur}
                        value={props.materialFisicoFormik.values.cod_factura}
                        isInvalid={!!props.materialFisicoFormik.errors.cod_factura 
                            && props.materialFisicoFormik.touched.cod_factura}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.materialFisicoFormik.errors.cod_factura}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Comentario De Compra</Form.Label>
                        <Form.Control
                        disabled={disabled}
                        name="comentario"
                        as="textarea"
                        placeholder="Ejemplo: NNNN-0021"
                        onChange={props.materialFisicoFormik.handleChange}
                        onBlur={props.materialFisicoFormik.handleBlur}
                        value={props.materialFisicoFormik.values.comentario}
                        isInvalid={!!props.materialFisicoFormik.errors.comentario 
                            && props.materialFisicoFormik.touched.comentario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.materialFisicoFormik.errors.comentario}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Cantidad Original</Form.Label>
                        <Form.Control
                        disabled={disabled}
                        name="cantidad_original"
                        type="number"
                        placeholder="Ejemplo: 10"
                        onChange={props.materialFisicoFormik.handleChange}
                        onBlur={props.materialFisicoFormik.handleBlur}
                        value={props.materialFisicoFormik.values.cantidad_original}
                        isInvalid={!!props.materialFisicoFormik.errors.cantidad_original 
                            && props.materialFisicoFormik.touched.cantidad_original}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.materialFisicoFormik.errors.cantidad_original}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group  as={Col} md="6">
                        <Form.Label>Cantidad Gastada</Form.Label>
                        <Form.Control
                        disabled={disabled}
                        name="cantidad_gastada"
                        type="number"
                        placeholder="Ejemplo: 10"
                        onChange={props.materialFisicoFormik.handleChange}
                        onBlur={props.materialFisicoFormik.handleBlur}
                        value={props.materialFisicoFormik.values.cantidad_gastada}
                        isInvalid={!!props.materialFisicoFormik.errors.cantidad_gastada 
                            && props.materialFisicoFormik.touched.cantidad_gastada}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.materialFisicoFormik.errors.cantidad_gastada}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={disabled}  type="button" onClick={props.onHide}>Cerrar</Button>
          <Button disabled={disabled} type="button" className="danger-btn-fix" variant="danger" onClick={ejecutarAccion}>
                Añadir
            </Button>
        </Modal.Footer>
    </Modal>)
}

AddMaterialFisicoComponente.propTypes = {
    onHide: PropTypes.func,
    materialFisicoFormik: PropTypes.object,
    codMaterialDefinido: PropTypes.number,
    proveedores: PropTypes.array,
    agregar: PropTypes.func,
    show: PropTypes.bool,
}

export default AddMaterialFisicoComponente;
