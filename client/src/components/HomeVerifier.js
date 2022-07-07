import React, { Component } from 'react';
import Error from './Error';

require('dotenv').config();

class HomeVerifier extends Component {
    render() {
        if (this.props.state.verifier) {
            return (
                <div className = "container">
                    <h3>Datos de{this.props.state.verifier.verifierType == 1 ? " la institución académica" : "l empleador"}</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>DNI</td>
                                <td>{this.props.state.verifier.cif}</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{this.props.state.verifier.name}</td>
                            </tr>
                            <tr>
                                <td>Dirección Postal</td>
                                <td>{this.props.state.verifier.postalAddress}</td>
                            </tr>
                            <tr>
                                <td>Correo electrónico</td>
                                <td>{this.props.state.verifier.emailAddress}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div>
                </div>
            );
        } else {
            return (<Error/>);
        }
    }
}

export default HomeVerifier;