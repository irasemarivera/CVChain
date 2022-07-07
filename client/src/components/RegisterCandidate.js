import React, { Component } from "react";
import MainContract from "../abi/CandidateContract.json";
import getWeb3 from "../getWeb3";

import { Form, FormLabel, FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationUnregisteredCandidate from './NavigationUnregisteredCandidate';
import Footer from './Footer';

class RegisterCandidate extends Component {
    constructor(props){
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

    registerCandidate = async () => {
      await this.state.instance.methods.registerCandidate(
        this.state.dni,
        this.state.name,
        this.state.lastName,
        this.state.secondLastName,
        this.state.postalAddress,
        this.state.emailAddress).send({from: this.state.account, gas: 1000000});

        console.log("Candidate registered");
        document.getElementById("showModal").click();
    }

    clic = async () => {
      document.getElementById("showModal").click();
    }

    goToHome = async () => {
      //Reload
      window.location.replace(window.origin);
    }
    
    componentDidMount = async () => {
        /*// FOR REFRESHING PAGE ONLY ONCE -
        if(!window.location.hash.includes("#loaded")){
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
      } else if(this.state.role == 0){
        return (
          <div className = "container-fluid">
            <NavigationUnregisteredCandidate state = {this.state}/>
            <div className = "container"> 
              <div className="row">
                <div className="col-*-*"><h2>Por favor, ingresa tus datos</h2></div>
              </div>
              <div className="row">
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    //this.clic();
                    this.registerCandidate()
                  }} >
                  <FormGroup>
                    <FormLabel>DNI</FormLabel>
                    <FormControl
                        name = "dni"
                        input = 'text'
                        value = {this.state.dni}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce tu DNI"
                        required />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl
                        name = "name"
                        input = 'text'
                        value = {this.state.name}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce tu nombre"
                        required />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>1er apellido</FormLabel>
                    <FormControl
                        name = "lastName"
                        input = 'text'
                        value = {this.state.lastName}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce tu primer apellido"
                        required  />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>2o apellido</FormLabel>
                    <FormControl
                        name = "secondLastName"
                        input = 'text'
                        value = {this.state.secondLastName}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce tu segundo apellido" />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Direccion Postal</FormLabel>
                    <FormControl
                        name = "postalAddress"
                        input = 'textArea'
                        value = {this.state.postalAddress}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce tu dirección postal"
                        required />
                  </FormGroup> 

                  <FormGroup>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl
                        name = "emailAddress"
                        input = 'text'
                        value = {this.state.emailAddress}
                        onChange = {this.handleInputChange}
                        placeholder = "Introduce tu correo electronico" />
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
                      <p>Te has registrado como candidato</p>
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
        return (<div><h1>Usuario no autorizado</h1></div>);
      }
    }
}

export default RegisterCandidate;