import React, { Component } from 'react';

class LoginComponente extends Component {

    render() {
        const objetoCarro = {
            nombre: 'Toyota',
            partes: ['Capote', 'Luces']
        }
        const partes = [];
        for (const [index, value] of objetoCarro.partes.entries()) {
            partes.push(<li key={index} className="partes">{value}</li>)
        }
        return (
            <React.Fragment>
                <h1>Login</h1>
                <h2>Test</h2>
                <ol>
                    {
                        objetoCarro.partes.map((partes, index) => {
                            return (
                            <li key={index} className="partes">{partes}</li>
                            );
                        })
                    }
                </ol>
                <ul>
                    {
                        partes
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default LoginComponente;