import React, { Component } from 'react';
import Error from './Error';

require('dotenv').config();

class HomeRecruiter extends Component {
    render() {
        if (this.props.state.recruiter) {
            return (
                <div className = "container">
                    <h3>Datos del reclutador</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>DNI</td>
                                <td>{this.props.state.recruiter.cif}</td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{this.props.state.recruiter.name}</td>
                            </tr>
                            <tr>
                                <td>Dirección Postal</td>
                                <td>{this.props.state.recruiter.postalAddress}</td>
                            </tr>
                            <tr>
                                <td>Correo electrónico</td>
                                <td>{this.props.state.recruiter.emailAddress}</td>
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

export default HomeRecruiter;