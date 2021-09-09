import React from 'react';
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch
} from "react-router-dom";

import LandingComponente from './presentacion/LandingComponente';

const rutas = [
    {path: '/presentacion', componente: <LandingComponente/>, exact: true},
    {path: '/contactanos', componente: <LandingComponente/>, exact: true},
    {path: '/', redirect: "/presentacion", exact: true },
];
function LandingRouting () { 
        let { path } = useRouteMatch();
        return (
            <Switch>
            {
                rutas.map((ruta, index) => {
                    return (
                        <Route key={index} path={path + ruta.path} exact={ruta.exact}>
                            {ruta.componente ? (ruta.componente) : (<Redirect to={{pathname: path + ruta.redirect}} />)}
                        </Route>
                    );
                })
            }
            </Switch>
        );
}

export default LandingRouting;