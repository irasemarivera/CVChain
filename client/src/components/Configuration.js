import React, { Component, useState } from "react";
import MainContract from "../abi/CandidateContract.json";

import getWeb3 from "../getWeb3";

import { Form, FormLabel, FormGroup, FormControl, Button} from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Footer from './Footer';

class Configuration extends Component {
    constructor(props) {
      super(props)
      if (props.location.state) {
        this.state = {
          instance: props.location.state.instance,
          account: props.location.state.account,
          web3: props.location.state.web3,
          role: props.location.state.role,
        }
      } else {
        this.state = {
          instance: undefined,
          account: null,
          web3: null,
        }
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      console.log(this.state);
    }

    handleInputChange(event) {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      
      this.setState({
        [name]: value
      });
    }

    changeViewResumeTime = async () => {
      try{
        await this.state.instance.methods.setViewResumeTime(this.state.newResumeTime).send({from: this.state.account, gas: 1000000});
        document.getElementById("showModal").click();
        console.log("View resume time setting changed");
      } catch (error){
        alert(error.message);
      }
    }

    clic = async () => {
      document.getElementById("showModal").click();
    }

    goToHome = async () => {
      //Reload
      window.location.replace(window.origin);
    }
    
    componentDidMount = async () => {
      // FOR REFRESHING PAGE ONLY ONCE -
      /*if(!window.location.hash.includes("#loaded")){
        window.location = window.location + '#loaded';
        window.location.reload();
      }*/
      let web3 = null;
      if (!this.state.web3){
        try {
          // Get network provider and web3 instance.
          web3 = await getWeb3();
        } catch (error) {
          alert("Failed to load web3, accounts, or contract. Check console for details.");
          console.error(error);
        }
      } else {
        web3 = this.state.web3;
      }

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MainContract.networks[networkId];
      const instance = new web3.eth.Contract(MainContract.abi, deployedNetwork && deployedNetwork.address);
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log("Setting state");
      this.setState({ instance: instance, web3: web3, account: accounts[0] }, this.populateData);
    };

    populateData = async () => {
      const resumeTime = await this.state.instance.methods.getViewResumeTime().call({from: this.state.account});
      this.setState({ resumeTime: resumeTime});
    }

    render() {
      if (!this.state.web3) {
        return (
          <div className = "container-fluid">
            <div className="jumbotron">
            <h2>Esperando a conectar...</h2>
            </div>
          </div>
        );
      } else if(this.state.role == 5){
        return (
          <div className = "container-fluid">
            <NavigationAdmin state={this.state}/>
            <div className = "container-fluid"> 
              <div className="row">
                <div className="col-*-*"><h3>Configuración</h3></div>
              </div>
              <Form onSubmit={(event) => {
                    event.preventDefault();
                    this.changeViewResumeTime();
                  }} >
                 <div className="row">
                 <div className="col-sm-6"><br/><b>Tiempo actual {this.state.resumeTime} segundos</b></div>
                  <div className="col-sm-6">
                    <FormGroup>
                      <FormLabel>Tiempo</FormLabel>
                      <FormControl
                          name = "newResumeTime"
                          input = 'text'
                          onChange = {this.handleInputChange}
                          placeholder = "Introduce el nuevo tiempo en segundos para la consulta de CVs"
                          required />
                    </FormGroup>
                  </div>
                </div>
                <div className="row text-center">
                  <Button variant="primary" type="submit">Guardar</Button>
                  <button id="showModal" type="button" hidden className="btn btn-info btn-md invisible" data-toggle="modal" data-target="#myModal" onClick={this.clic}>Open Modal</button>
                </div>
              </Form>  
            </div>
            <div className="container">
              <div className="modal fade" id="myModal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      <h4 className="modal-title">Confirmación</h4>
                    </div>
                    <div className="modal-body">
                      <p>Se ha modificado el tiempo de consulta de los CVs</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.goToHome}>Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
          </div>
        );
      } else {
        return (<div><h1>Usuario no autorizado{this.state.role}</h1></div>);
      }
    }
}

export default Configuration;