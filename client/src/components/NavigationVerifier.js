import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('dotenv').config();

class NavigationVerifier extends Component {
    render() {
        let container;
        if(this.props.state.page =="Home") {
            let text = " candidato(s) a verificar";
            let candidatesToVerify;
            if (this.props.state.verifiableCandidatesCount > 0){
                candidatesToVerify = <Link to = {{pathname: "/CandidatesToVerify", state: this.props.state}}><span className="badge">{this.props.state.verifiableCandidatesCount}</span>{text}</Link>
            } else{
                candidatesToVerify = <p>No hay{text}</p>
            }
            
            container = <div className = "container-fluid">
                            <div className="well well-sm">
                                <div className = "row">
                                    <div className="col-sm-6 text-left">{this.props.state.page == "Home" ? "¡Hola " + this.props.state.verifier.name + "!": ""}</div>
                                    <div className="col-sm-6 text-right">{candidatesToVerify}</div>
                                </div>
                            </div>
                        </div>
        }
        return (
            <div className = "container-fluid">
                <nav className="navbar navbar-inverse navbar-fixed-top nav-padding-right">
                    <div className="navbar-header">
                        <p className="navbar-brand">{process.env.REACT_APP_WEBSITE_NAME}</p>
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to = {{pathname: "/", state: this.props.state}} className = "heading">Inicio</Link></li>
                        <li><Link to = {{pathname: "/CandidatesToVerify", state: this.props.state}}>Candidatos</Link></li>
                    </ul>
                </nav>
                {container}
            </div>
        );
    }
}

export default NavigationVerifier;