import React, { Component } from "react";

import '../custom.css';

class Numbers extends Component {
    render() {
      return (
        <div className="container numbers">
          <div className="text-center bg-success">
            &nbsp;<h4>CVChain en números</h4>&nbsp;
            <div className="row">
              <div className="col-sm-4">
                <h5>Candidatos registrados</h5>
                <p>{this.props.state.candidatesCount}</p>
              </div>
              <div className="col-sm-4">
                <h5>Verificadores autorizados</h5>
                <p>{this.props.state.verifiersCount}</p>
              </div>
              <div className="col-sm-4">
                <h5>Reclutadores autorizados</h5>
                <p>{this.props.state.recruitersCount}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export default Numbers;