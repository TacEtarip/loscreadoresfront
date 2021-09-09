import React from 'react';
import { Modal, Button, Container, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types'; 
import './modal.scss';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';
import { getUnidadesDeMedida } from '../../util/helpersAPI';

const ModificarMaterialComponente = (props) => {

  const [udm, setUDM] = React.useState([]);

  const [disabled, setDisabled] = React.useState(false);

  const materialAPI = useMaterialAPI();

    React.useEffect(() => {
        getUnidadesDeMedida().subscribe(res => {
            setUDM(res);
        });
    }, []);

    const ejecutarAccion = async () => {
        setDisabled(true);
        if (props.formikMaterial.values.tipoOperacion === 1) {

          const result = await materialAPI
          .crearMaterial(
            props.formikMaterial.values.nombre, 
            props.codSubTipoMaterial, 
            props.formikMaterial.values.descripcion, 
            props.formikMaterial.values.unidadDeMedida, 
            props.formikMaterial.values.unidadDeMedidaUso
          );
          setDisabled(false);
          if (result.error && result.error !== 0) {
            alert(result.message);
          } else {
            props.agregar(result.nuevoMaterial);
            props.onHide();
          }
        } else if (props.formikMaterial.values.tipoOperacion === 2) {
          const result = await materialAPI
          .editarMaterial(
            props.formikMaterial.values.nombre, 
            props.formikMaterial.values.codMaterial, 
            props.formikMaterial.values.descripcion, 
            props.formikMaterial.values.unidadDeMedida, 
            props.formikMaterial.values.unidadDeMedidaUso
          );
          setDisabled(false);
          if (result.error && result.error !== 0) {
            alert(result.message);
          } else {
            props.editar(result.nuevoMaterial, props.formikMaterial.values.index);
            props.onHide();
          }
        }
    };

    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="add-tipo-material"
        centered
        fullscreen={'sm-down'}
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-tipo-material">
              <h4>{ props.formikMaterial.values.tipoOperacion === 1 ? ('Añadir material') : 
                (props.formikMaterial.values.tipoOperacion === 2 ? ('Editar material') : ('Eliminar material'))}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
              { props.formikMaterial.values.tipoOperacion !== 3 ? 
              (<Form onSubmit={props.formikMaterial.handleSubmit} noValidate>
                <Row  className="g-3">
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        name="nombre"
                        type="text"
                        placeholder="Ejemplo: Rollo De Tela De Algodon"
                        onChange={props.formikMaterial.handleChange}
                        onBlur={props.formikMaterial.handleBlur}
                        value={props.formikMaterial.values.nombre}
                        isInvalid={!!props.formikMaterial.errors.nombre && props.formikMaterial.touched.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{props.formikMaterial.errors.nombre}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Unidad de medidad de almacenamiento.</Form.Label>
                    <Form.Select
                        disabled={disabled}
                        name="unidadDeMedida"
                        onChange={props.formikMaterial.handleChange}
                        onBlur={props.formikMaterial.handleBlur}
                        value={props.formikMaterial.values.unidadDeMedida}
                        isInvalid={(!!props.formikMaterial.errors.unidadDeMedida && props.formikMaterial.touched.unidadDeMedida)}
                    >
                        <option value=''>Seleccionar Unidad De Medida</option>
                        {
                            udm.map((u, i) => {
                                return (<option key={i} value={u.codUnidadDeMedida}>
                                    {u.nombre}</option>)
                            })
                        }
                    </Form.Select>
                    <Form.Text muted>Unidad de medida de como se almacena el material. Ejemplo: Rollo de tela se almacena como UNIDAD</Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Unidad de medidad de uso.</Form.Label>
                    <Form.Select
                        disabled={disabled}
                        name="unidadDeMedidaUso"
                        onChange={props.formikMaterial.handleChange}
                        onBlur={props.formikMaterial.handleBlur}
                        value={props.formikMaterial.values.unidadDeMedidaUso}
                        isInvalid={(!!props.formikMaterial.errors.unidadDeMedidaUso && props.formikMaterial.touched.unidadDeMedidaUso)}
                    >
                        <option value=''>Seleccionar Unidad De Medida</option>
                        {
                            udm.map((u, i) => {
                                return (<option key={i} value={u.codUnidadDeMedida}>
                                    {u.nombre}</option>)
                            })
                        }
                    </Form.Select>
                    <Form.Text muted>Unidad de medida de se usara este material en la menor unidad de medida posible. Ejemplo: El rollo de tela se usa por centimetros.</Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        name="descripcion"
                        as="textarea"
                        onChange={props.formikMaterial.handleChange}
                        onBlur={props.formikMaterial.handleBlur}
                        value={props.formikMaterial.values.descripcion}
                        isInvalid={!!props.formikMaterial.errors.descripcion && props.formikMaterial.touched.descripcion}
                    />
                    <Form.Control.Feedback type="invalid">{props.formikMaterial.errors.descripcion}</Form.Control.Feedback>
                </Form.Group>
                </Row>
              </Form>) 
              : (
                  <React.Fragment>
                    <h5>¿Estas seguro que quieres eliminar {props.formikMaterial.values.nombre}?</h5>
                    <p>Se eliminaran este material y todos los productos en él.</p>
                  </React.Fragment>
              ) }
              
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={disabled} type="button" onClick={props.onHide}>Cerrar</Button>
          <Button disabled={disabled || !props.formikMaterial.isValid} type="button" className="danger-btn-fix" variant="danger" onClick={ejecutarAccion}>
                { props.formikMaterial.values.tipoOperacion === 1 ? ('Añadir') : 
                (props.formikMaterial.values.tipoOperacion === 2 ? ('Editar') : ('Eliminar'))}
            </Button>
        </Modal.Footer>
      </Modal>
    );
}

ModificarMaterialComponente.propTypes = {
    onHide: PropTypes.func,
    formikMaterial: PropTypes.object,
    editar: PropTypes.func,
    agregar: PropTypes.func,
    codSubTipoMaterial: PropTypes.number,
    show: PropTypes.bool
}

export default ModificarMaterialComponente;