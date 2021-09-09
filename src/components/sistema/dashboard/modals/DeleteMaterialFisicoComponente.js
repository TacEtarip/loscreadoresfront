import React from 'react';
import './modal.scss';
import PropTypes from 'prop-types'; 
import { Modal, Button, Container } from 'react-bootstrap';

const DeleteMaterialFisicoComponente = (props) => {

    return (
    <Modal
        {...props}
        size="lg"
        centered
        fullscreen={'sm-down'}
    >
        <Modal.Header closeButton>
            <Modal.Title id="add-tipo-material">
                <h4>Eliminar Material Fisico De La Variante: {props.codMaterialDefinido}</h4>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
                    <h5>¿Estas seguro que quieres eliminar el material con codigo {props.codMaterialFisico}?</h5>
                    <p>Se eliminaran este material ademas de su reporte de ingreso.</p>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={props.onHide}>Cerrar</Button>
          <Button type="button" className="danger-btn-fix" variant="danger" onClick={props.onHide}>
                Eliminar
            </Button>
        </Modal.Footer>
    </Modal>)
}

DeleteMaterialFisicoComponente.propTypes = {
    onHide: PropTypes.func,
    codMaterialFisico: PropTypes.number,
    codMaterialDefinido: PropTypes.number,
}

export default DeleteMaterialFisicoComponente;
