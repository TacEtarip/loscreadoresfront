import React from 'react';
import { Modal, Button, Container, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'; 
import './modal.scss';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';

const AddTipoMaterialComponente = (props) => {

  const [disabled, setDisabled] = React.useState(false);

  const materialAPI = useMaterialAPI();

    const ejecutarAccion = async () => {
      setDisabled(true);
      if (props.formikTipo.values.tipoOperacion === 1) {
        const result = await materialAPI.crearTipoMaterial(props.formikTipo.values.nombre);
        if (result.error && result.error !== 0) {
          alert(result.message);
        } else {
          props.agregar(result.nuevoTipo);
          props.onHide();
        }
      } else if (props.formikTipo.values.tipoOperacion === 2) {
        const result = await materialAPI.editarTipoMaterial(props.formikTipo.values.nombre, props.formikTipo.values.codTipoMaterial);
        if (result.error && result.error !== 0) {
          alert(result.message);
        } else {
          props.editar(result.nuevoTipo, props.formikTipo.values.index);
          props.onHide();
        }
      }
      setDisabled(false);
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
              <h4>{ props.formikTipo.values.tipoOperacion === 1 ? ('Añadir tipo de material') : 
                (props.formikTipo.values.tipoOperacion === 2 ? ('Editar tipo de material') : ('Eliminar tipo de material'))}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
              { props.formikTipo.values.tipoOperacion !== 3 ? 
              (<Form onSubmit={props.formikTipo.handleSubmit} noValidate>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        name="nombre"
                        type="text"
                        placeholder="Ejemplo: Telas"
                        onChange={props.formikTipo.handleChange}
                        onBlur={props.formikTipo.handleBlur}
                        value={props.formikTipo.values.nombre}
                        isInvalid={!!props.formikTipo.errors.nombre && props.formikTipo.touched.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{props.formikTipo.errors.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Form>) 
              : (
                  <React.Fragment>
                    <h5>¿Estas seguro que quieres eliminar {props.formikTipo.values.nombre}?</h5>
                    <p>Se eliminaran todos los sub-tipos y materiales de este tipo.</p>
                  </React.Fragment>
              ) }
              
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" 
          disabled={disabled}
          onClick={props.onHide}>Cerrar</Button>
          <Button 
          onClick={ejecutarAccion} disabled={!props.formikTipo.isValid || disabled} type="button" className="danger-btn-fix" variant="danger">
                { props.formikTipo.values.tipoOperacion === 1 ? ('Añadir') : 
                (props.formikTipo.values.tipoOperacion === 2 ? ('Editar') : ('Eliminar'))}
            </Button>
        </Modal.Footer>
      </Modal>
    );
}

AddTipoMaterialComponente.propTypes = {
    onHide: PropTypes.func,
    agregar: PropTypes.func,
    editar: PropTypes.func,
    formikTipo: PropTypes.object,
    show: PropTypes.bool
}

export default AddTipoMaterialComponente;