import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('dotenv').config();

class NavigationRegisteredCandidate extends Component {
    render() {
        return (
            <div className = "container-fluid">
                <nav className="navbar navbar-inverse navbar-fixed-top nav-padding-right">
                    <div className="navbar-header">
                        <p className="navbar-brand">{process.env.REACT_APP_WEBSITE_NAME}</p>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to = {{pathname: "/", state: this.props.state}} className = "heading">Inicio</Link></li>
                        <li><Link to = {{pathname: "/MyExperiences", state: this.props.state}}>Mis experiencias</Link></li>
                        <li><Link to = {{pathname: "/MyCV", state: this.props.state}}>Mi CV</Link></li>
                    </ul>
                </nav>
                <div className = "container-fluid">
                    <div className="well well-sm">
                        <div className = "row">
                            <div className="col-sm-6 text-left">{this.props.state.page == "Home" ? "¡Hola " + this.props.state.candidate.name + "!": ""}</div>
                            <div className="col-sm-6 text-right">Estado general:&nbsp;
                                {this.props.state.candidate ? 
                                (this.props.state.candidate.isVerified ? 
                                    <span className="label label-success">Verificado</span> 
                                : (this.props.state.candidate.experienceCount > 0 ?
                                    <span className="label label-danger">No verificado</span>
                                : <span className="label label-default">Sin experiencia</span>
                                )) : "Error"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NavigationRegisteredCandidate;