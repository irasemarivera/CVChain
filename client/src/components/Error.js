import React, { Component } from 'react';

require('dotenv').config();

class Error extends Component {
    render() {
        return (
            <div><h3>Cargando... </h3></div>
        );
    }
}

export default Error;