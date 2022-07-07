import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('dotenv').config();

class NavigationAdmin extends Component {
    render() {
        return (
            <div className = "container-fluid">
                <nav className="navbar navbar-inverse navbar-fixed-top nav-padding-right">
                    <div className="navbar-header">
                        <p className="navbar-brand">{process.env.REACT_APP_WEBSITE_NAME} [Admin] </p>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to = {{pathname: "/", state: this.props.state }} className = "heading">Inicio</Link></li>
                        <li><Link to = {{pathname: "/Universities", state: this.props.state}}>Instituciones Académicas</Link></li>
                        <li><Link to = {{pathname: "/Employeers", state: this.props.state}}>Empleadores</Link></li>
                        <li><Link to = {{pathname: "/Recruiters", state: this.props.state}}>Reclutadores</Link></li>
                        <li><Link to = {{pathname: "/Configuration", state: this.props.state}}>Configuración</Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default NavigationAdmin;