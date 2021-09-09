import React from 'react';
import { Modal, Button, Container, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'; 
import './modal.scss';
import { useMaterialAPI } from '../../util/callsMaterialesAPI';

const ModificarSubTipoMaterialComponente = (props) => {

  const [disabled, setDisabled] = React.useState(false);

  const materialAPI = useMaterialAPI();

  const ejecutarAccion = async () => {
    setDisabled(true);
    if (props.formikSubTipo.values.tipoOperacion === 1) {

      const result = await materialAPI.crearSubTipoMaterial(props.formikSubTipo.values.nombre, props.codTipoMaterial);
      setDisabled(false);
      if (result.error && result.error !== 0) {
        alert(result.message);
      } else {
        props.agregar(result.nuevoSubTipo);
        props.onHide();
      }
    } else if (props.formikSubTipo.values.tipoOperacion === 2) {
      const result = await materialAPI.editarSubTipoMaterial(props.formikSubTipo.values.nombre, props.formikSubTipo.values.codSubTipoMaterial);
      setDisabled(false);
      if (result.error && result.error !== 0) {
        alert(result.message);
      } else {
        props.editar(result.nuevoSubTipo, props.formikSubTipo.values.index);
        props.onHide();
      }
    }
  };
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="add-sub-tipo-material"
        centered
        fullscreen={'sm-down'}
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-tipo-material">
              <h4>{ props.formikSubTipo.values.tipoOperacion === 1 ? ('Añadir sub-tipo de material') : 
                (props.formikSubTipo.values.tipoOperacion === 2 ? ('Editar sub-tipo de material') : ('Eliminar sub-tipo de material'))}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
              { props.formikSubTipo.values.tipoOperacion !== 3 ? 
              (<Form onSubmit={props.formikSubTipo.handleSubmit} noValidate>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        name="nombre"
                        type="text"
                        placeholder="Ejemplo: Telas"
                        onChange={props.formikSubTipo.handleChange}
                        onBlur={props.formikSubTipo.handleBlur}
                        value={props.formikSubTipo.values.nombre}
                        isInvalid={!!props.formikSubTipo.errors.nombre && props.formikSubTipo.touched.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{props.formikSubTipo.errors.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Form>) 
              : (
                  <React.Fragment>
                    <h5>¿Estas seguro que quieres eliminar {props.formikSubTipo.values.nombre}?</h5>
                    <p>Se eliminaran todos los sub-tipos y materiales de este tipo.</p>
                  </React.Fragment>
              ) }
              
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={disabled}  type="button" onClick={props.onHide}>Cerrar</Button>
          <Button disabled={disabled || !props.formikSubTipo.isValid} type="button" className="danger-btn-fix" variant="danger" onClick={ejecutarAccion}>
                { props.formikSubTipo.values.tipoOperacion === 1 ? ('Añadir') : 
                (props.formikSubTipo.values.tipoOperacion === 2 ? ('Editar') : ('Eliminar'))}
            </Button>
        </Modal.Footer>
      </Modal>
    );
}

ModificarSubTipoMaterialComponente.propTypes = {
    onHide: PropTypes.func,
    formikSubTipo: PropTypes.object,
    editar: PropTypes.func,
    agregar: PropTypes.func,
    codTipoMaterial: PropTypes.number,
    show: PropTypes.bool
}

export default ModificarSubTipoMaterialComponente;