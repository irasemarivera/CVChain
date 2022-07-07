import React, { Component } from 'react';

require('dotenv').config();

class Error extends Component {
    render() {
        return (
            <div><h3>Usuario no autorizado. Contacta al administrador: <a href='mailto:{process.env.REACT_APP_ADMIN_EMAIL}'>{process.env.REACT_APP_ADMIN_EMAIL}</a></h3></div>
        );
    }
}

export default Error;