import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import ScrollToTop from './ScrollToTop';
import { LoadingPage } from './LoadingPage';

const LandingMainComponente = React.lazy(() => import('../landing/LandingMainComponente'));
const SistemaMainComponente = React.lazy(() => import('../sistema/SistemaMainComponente'));

const rutas = [
    {path: '/inicio', componente: <LandingMainComponente/>, exact: false},
    {path: '/sistema', componente: <SistemaMainComponente/>, exact: false},
    {path: '/', redirect: "/inicio", exact: true },
];

function RouterComponente () { 
        return (
        <Suspense fallback={<LoadingPage/>}>
            <Router>
                <ScrollToTop />
                <Switch>
                    {
                        rutas.map((ruta, index) => {
                            return (
                                <Route key={index} path={ruta.path} exact={ruta.exact}>
                                    {ruta.componente ? (ruta.componente) : (<Redirect to={{pathname: ruta.redirect}} />)}
                                </Route>
                            );
                        })
                    }
                </Switch>
            </Router>
        </Suspense>
        );
}

export default RouterComponente;