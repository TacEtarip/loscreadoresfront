import React, { Component } from 'react';
import prendaChalecoNaranja from '../../../assets/images/prenda_naranja.png';
import {Fade} from 'react-awesome-reveal';
import textileria from '../../../assets/images/textileria.svg';
import sales from '../../../assets/images/sales.svg';
import './landing.scss';

class LandingComponente extends Component {
    /*
    <div>
        {this.state.contador}
        <input type="button" onClick={this.sumar} value="Sumar"/>
      </div>
    state = {
        contador: 
    }
    sumar = () => {
        console.log('Sumando');
        this.setState({
            contador: this.state.contador + 1,
        });
    };*/
    

    render() {


        const prendas = [
            {nombre: 'chaleco', scr: prendaChalecoNaranja},
            {nombre: 'chaleco', scr: prendaChalecoNaranja},
            {nombre: 'chaleco', scr: prendaChalecoNaranja},
            {nombre: 'chaleco', scr: prendaChalecoNaranja},
            {nombre: 'chaleco', scr: prendaChalecoNaranja},
            {nombre: 'chaleco', scr: prendaChalecoNaranja}
        ];
        
        return (
            <React.Fragment>
            <section className="presentacion" style={{'marginTop': '96px'}}>
                <Fade direction="right">
                    <h1>
                        CONFECCIÓN DE PRENDAS
                    </h1>
                </Fade>
                <Fade direction='left'>
                <div className="prenda-carrusel">
                    <div style={{'minWidth': ((prendas.length*300) + (prendas.length*20))}} className="prendas">
                        {
                            prendas.map((prenda, index) => {
                                return (<img key={index} width="300px" src={prenda.scr} className="logo" alt={prenda.nombre} />);
                            })
                        }
                        {
                            prendas.map((prenda, index) => {
                                return (<img key={index} width="300px" src={prenda.scr} className="logo" alt={prenda.nombre} />);
                            })
                        }
                    </div>
                </div>
                </Fade>
            </section>
            <div className="contenedor-section">
            <section className="info-section">
                <div className="imagen-texto">
                    <Fade direction='right' >
                        <img idth="500px" src={textileria} alt='textileria' />
                        <h2>REALIZAMOS</h2>
                    </Fade>
                </div>
                <div className="contenido-info">
                    <Fade direction='right' cascade>
                        <h3>Costura</h3>
                        <h3>Ojal y botón</h3>
                        <h3>Cerradora</h3>
                    </Fade>
                </div>
                <div className="contenido-info">
                    <Fade direction='right' cascade>
                        <h3>Pretinadora</h3>
                        <h3>Tapetera</h3>
                        <h3>Diseño de logos</h3>
                    </Fade>
                </div>
            </section>
            <section className="info-section">
                <div className="ventas-texto">
                    <Fade direction='left' >
                        <img src={sales} alt='textileria' />
                        <h2>CONFECCIONAMOS AL POR MAYOR Y AL POR MENOR</h2>
                    </Fade>
                </div>
                <div className="lista-productos">
                    ventas TRUJILLO
                </div>
                <div className="parrago-info">
                    <Fade direction='left'>
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget dictum nisl. Vestibulum suscipit non erat non facilisis. Quisque a vulputate nibh. Nunc leo risus, facilisis sit amet augue a, iaculis fermentum felis.
                        </p>
                    </Fade>
                </div>
            </section>
            </div>
            </React.Fragment>
        );
    }
}

export default LandingComponente;