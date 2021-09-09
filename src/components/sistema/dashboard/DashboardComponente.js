import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
 

import { Link } from 'react-router-dom';
import { useAuth } from '../util/loginUtilidades';
import DashBoardRouting from './DashBoardRouting';
import './dashboardGlobal.scss';
const LoginComponente = () => {
  const auth = useAuth();
    return (
        <React.Fragment>
            <Navbar collapseOnSelect expand="lg"  bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="#">Los Creadores</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href="#features">Prendas</Nav.Link>
                      <Link className="nav-bar-link-fix" to="/sistema/dashboard/materiales">Materiales</Link> 
                      {
                        auth.esAdmin ? 
                        (
                        <NavDropdown title="Usuarios" >
                          <Link className="drop-fix" to="/sistema/dashboard/registroUsuarios">Administradores</Link> 
                          <Link className="drop-fix" to="/sistema/dashboard/registroUsuarios">Personal</Link> 
                          <NavDropdown.Divider />
                          <Link className="drop-fix" to="/sistema/dashboard/registroUsuarios">Registrar Usuario</Link> 
                          <Link className="drop-fix" to="/sistema/dashboard/registroUsuarios">Solicitudes de alta</Link> 
                        </NavDropdown>
                      ) : null
                      }
                    </Nav>
                    <Nav>
                      <Nav.Link onClick={auth.signout}>Cerrar Sesión</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            <div className="container-all-db">
              <DashBoardRouting/>
            </div>
        </React.Fragment>
    );
};

export default LoginComponente;