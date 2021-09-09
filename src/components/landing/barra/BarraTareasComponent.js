import React, { Component } from 'react';
import './header.scss';
import logo from '../../../assets/images/logo.svg';
import { NavLink } from 'react-router-dom';

class BarraTareasComponente extends Component {
    render() {
        return (
            <header>
                <div className="interior">
                    <img src={logo} className="logo" alt="logo" />
                    <div className="navegacion">
                        <NavLink activeClassName="activado" to='/inicio/presentacion'>Inicio</NavLink>
                        <NavLink activeClassName="activado" to='/inicio/contactanos'>Contactanos</NavLink>
                        <NavLink activeClassName="activado" to='/sistema'>Sistema</NavLink>
                    </div>
                </div>
            </header>
        );
    }
}

export default BarraTareasComponente;