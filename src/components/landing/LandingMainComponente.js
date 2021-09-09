import React, { Component } from 'react';
// import BarraTareasComponente from './barra/BarraTareasComponent';
// import LandingRouting from './LandingRouting';

const BarraTareasComponente = React.lazy(() => import('./barra/BarraTareasComponent'));
const LandingRouting = React.lazy(() => import('./LandingRouting'));

class LandingMainComponente extends Component {
    render() {
        return (
            <React.Fragment>
                <BarraTareasComponente/>
                <LandingRouting/>
            </React.Fragment>
        );
    }
}

export default LandingMainComponente;