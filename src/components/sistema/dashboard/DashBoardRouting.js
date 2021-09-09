import React from 'react';
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch
} from "react-router-dom";
import { useAuth } from '../util/loginUtilidades';
import RegistrarUsuariosComponente from './registrarUsuarios/RegistrarUsuariosComponente';
import MaterialesMainComponente from './materiales/MaterialesMainComponente';
import PropTypes from 'prop-types'; 

const rutas = [
    {path: '/prendas', componente: <RegistrarUsuariosComponente/>, exact: true, hasToBeAdmin: false},
    {path: '/materiales', 
    componente: <MaterialesMainComponente/>, exact: true, hasToBeAdmin: false},
    {path: '/materiales/:codTipoMaterial', 
    componente: <MaterialesMainComponente/>, exact: true, hasToBeAdmin: false},
    {path: '/materiales/:codTipoMaterial/:codSubTipoMaterial', 
    componente: <MaterialesMainComponente/>, exact: true, hasToBeAdmin: false},
    {path: '/materiales/:codTipoMaterial/:codSubTipoMaterial/:codMaterial', 
    componente: <MaterialesMainComponente/>, exact: true, hasToBeAdmin: false},
    {path: '/materiales/:codTipoMaterial/:codSubTipoMaterial/:codMaterial/:codMaterialDefinido', 
    componente: <MaterialesMainComponente/>, exact: true, hasToBeAdmin: false},
    {path: '/registroUsuarios', componente: <RegistrarUsuariosComponente/>, exact: true, hasToBeAdmin: true},
    {path: '/', redirect: "/materiales", exact: true, redir: true },
];

const DashBoardRouting = () => { 
    let { path } = useRouteMatch();
    return (
            <Switch>
            {
                rutas.map((ruta, index) => {
                    return (
                        <RutaWC key={index}  redir={ruta.redir || false} 
                        path={path + ruta.path} exact={ruta.exact} hasToBeAdmin={ruta.hasToBeAdmin}>
                            {ruta.componente ? (ruta.componente) : (<Redirect to={{pathname: path + ruta.redirect}} />)}
                        </RutaWC>
                    );
                })
            }
            </Switch>
    );
}

const RutaWC = ({children, redir, hasToBeAdmin, ...rest}) => {
    const auth = useAuth();
    const htba = React.useRef(hasToBeAdmin);
    const comprobar = React.useCallback(() => {
        if (htba) {
            if (auth.esAdmin) {
                return true;
            }
            // auth.signout();
            return false;
        } 
        return true;
    }, [auth.esAdmin]);

    return(
        redir ? (
            <Route {...rest} render={() => children } />
        ) : (
            <Route {...rest} 
            render={() =>  comprobar() ? 
                (children) : 
                (null) } />
        )
    )
}

RutaWC.propTypes = {
    children: PropTypes.any,
    redir: PropTypes.bool,
    hasToBeAdmin: PropTypes.bool
}

export default DashBoardRouting;
