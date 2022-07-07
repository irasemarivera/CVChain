import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('dotenv').config();

class NavigationUnregisteredCandidate extends Component {
    render() {
        return (
            <div className = "container-fluid">
                <nav className="navbar navbar-inverse navbar-fixed-top nav-padding-right">
                    <div className="navbar-header">
                        <p className="navbar-brand">{process.env.REACT_APP_WEBSITE_NAME}</p>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to = {{pathname: "/", state: this.props.state}} className = "heading">Inicio</Link></li>
                        <li><Link to = {{pathname: "/RegisterCandidate", state: this.props.state}}>Registrarme</Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default NavigationUnregisteredCandidate;