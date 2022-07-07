import React, { Component, useState } from "react";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";

import getWeb3 from "../getWeb3";

import { Form, FormLabel, FormGroup, FormControl, Button} from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Footer from './Footer';

class AddRecruiter extends Component {
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

    addRecruiter = async () => {
      await this.state.verifiersInstance.methods.addAuthorizedRecruiters(
        this.state.cif,
        this.state.name,
        this.state.postalAddress,
        this.state.emailAddress,
        this.state.recruiterAddress).send({from: this.state.account, gas: 1000000});
        document.getElementById("showModal").click();
        console.log("Recruiter registered");
        
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
      const deployedNetwork = VerifiersContract.networks[networkId];
      const instance = new web3.eth.Contract(VerifiersContract.abi, deployedNetwork && deployedNetwork.address);
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log("Setting state");
      this.setState({ verifiersInstance: instance, web3: web3, account: accounts[0] }, this.populateData);
    };

    populateData = async () => {
      const role = await this.state.instance.methods.getUserRole().call({from: this.state.account});
      console.log("User role:" + role);
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
                <div className="col-*-*"><h3>Ingresa los datos del reclutador</h3></div>
              </div>
              <div className="row">
                <Form onSubmit={(event) => {
                    event.preventDefault();
                    //this.clic();
                    this.addRecruiter();
                  }} >
                  <FormGroup>
                    <FormLabel>CIF</FormLabel>
                    <FormControl
                        name = "cif"
                        input = 'text'
                        value = {this.state.dni}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce el CIF del reclutador"
                        required />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl
                        name = "name"
                        input = 'text'
                        value = {this.state.name}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce el nombre del reclutador"
                        required />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Direccion Postal</FormLabel>
                    <FormControl
                        name = "postalAddress"
                        input = 'textArea'
                        value = {this.state.postalAddress}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce la dirección postal del reclutador"
                        required />
                  </FormGroup> 

                  <FormGroup>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl
                        name = "emailAddress"
                        input = 'text'
                        value = {this.state.emailAddress}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce el correo electronico del reclutador" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Dirección Ethereum</FormLabel>
                    <FormControl
                        name = "recruiterAddress"
                        input = 'text'
                        value = {this.state.recruiterAddress}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce la dirección Ethereum del reclutador" />
                  </FormGroup>

                  <Button variant="primary" type="submit">Guardar</Button>
                  <button id="showModal" type="button" hidden className="btn btn-info btn-md invisible" data-toggle="modal" data-target="#myModal" onClick={this.clic}>Open Modal</button>
                </Form>  
              </div>
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
                      <p>Reclutador añadido</p>
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

export default AddRecruiter;