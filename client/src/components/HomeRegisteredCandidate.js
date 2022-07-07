import React, { Component } from 'react';
import Error from './Error';

require('dotenv').config();

class HomeRegisteredCandidate extends Component {
    render() {
        if (this.props.state.candidate) {
            return (
                <div className = "container">
                    <h3>{this.props.state.page == "Home" ? "Mis datos" : "Datos personales del candidato"}</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>DNI</td>
                                <td>{this.props.state.candidate.dni}</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{this.props.state.candidate.name} {this.props.state.candidate.lastName} { this.props.state.candidate.secondLastName}</td>
                            </tr>
                            <tr>
                                <td>Dirección Postal</td>
                                <td>{this.props.state.candidate.postalAddress}</td>
                            </tr>
                            <tr>
                                <td>Correo electrónico</td>
                                <td>{this.props.state.candidate.emailAddress}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {this.props.state.page == "Home" ? <div><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div> : ""}
                </div>
            );
        } else {
            return (<Error/>);
        }
    }
}

export default HomeRegisteredCandidate;