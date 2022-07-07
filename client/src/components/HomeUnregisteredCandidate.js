import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

require('dotenv').config();

class HomeRegisteredCandidate extends Component {
    render() {
        return (
            <div className="jumbotron">
            <h2>¡Bienvenid@ a {process.env.REACT_APP_WEBSITE_NAME}!</h2>
            <p>&nbsp;</p>
            <p>En este portal podrás registrarte como candidato y subir tus documentos académicos y laborales para ser certificados</p>
            <p>¡Y acceder a mejores oportunidades laborales!</p>
            <p>&nbsp;</p>
            <Link to = {{pathname: "/RegisterCandidate", state: this.props.state}}><Button type = "button">¡Registrarme!</Button></Link>
          </div>
        );
    }
}

export default HomeRegisteredCandidate;