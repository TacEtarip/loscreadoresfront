import React from 'react';
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch
} from "react-router-dom";

// import MainAuthComponente from './login/MainAuthComponente';
// import DashBoardComponente from './dashboard/DashboardComponente';

import PropTypes from 'prop-types'; 

import { ProvideAuth, useAuth } from './util/loginUtilidades';

const MainAuthComponente = React.lazy(() => import('./login/MainAuthComponente'));
const DashBoardComponente = React.lazy(() => import('./dashboard/DashboardComponente'));

const rutas = [
    {path: '/login', componente: <MainAuthComponente/>, exact: true, redirect: "/dashboard", hasToBeLogged: false},
    {path: '/dashboard', componente: <DashBoardComponente/>, exact: false, redirect: "/login", hasToBeLogged: true},
    {path: '/', redirect: "/login", exact: true, redir: true },
];
const SistemaRouting = () => { 
        let { path } = useRouteMatch();
        return (
            <ProvideAuth>
                <Switch>
                {
                    rutas.map((ruta, index) => {
                        return (
                            <RutaWC key={index} redirect={path + ruta.redirect} redir={ruta.redir || false} 
                            path={path + ruta.path} exact={ruta.exact} hasToBeLogged={ruta.hasToBeLogged}>
                                {ruta.componente ? (ruta.componente) : (<Redirect to={{pathname: path + ruta.redirect}} />)}
                            </RutaWC>
                        );
                    })
                }
                </Switch>
            </ProvideAuth>

        );
}

const RutaWC = ({children, redir, redirect, hasToBeLogged, ...rest}) => {
    const auth = useAuth();
    const htbl = React.useRef(hasToBeLogged);
    const comprobar = React.useCallback(() => {
        if (htbl.current) {
            if (auth.user) {
                return true;
            }
            return false;
        } else {
            if (!auth.user) {
                return true;
            }
        }
        return false;
    }, [auth.user]);
    return(
        redir ? (
            <Route {...rest} render={() => children } />
        ) : (
            <Route {...rest} 
            render={({location}) =>  comprobar() ? 
                (children) : 
                (<Redirect to={{
                    pathname: redirect,
                    state: { from: location }
                }}/>) } />
        )
    )
}

RutaWC.propTypes = {
    children: PropTypes.any,
    redir: PropTypes.bool,
    redirect: PropTypes.string,
    hasToBeLogged: PropTypes.bool
}

export default SistemaRouting;