import React, { Component } from "react";
import MainContract from "../abi/CandidateContract.json";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";
import getWeb3 from "../getWeb3";

import { Form, FormLabel, FormText, FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationRegisteredCandidate from './NavigationRegisteredCandidate';
import Footer from './Footer';

// Declare IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

class AddExperience extends Component {
    constructor(props){
        super(props)
        if (props.location.state) {
          this.state = {
            instance: props.location.state.instance,
            account: props.location.state.account,
            web3: props.location.state.web3,
            role: props.location.state.role,
            candidate: props.location.state.candidate,
            experienceType: (props.location.search == "?academic" ? 1 : 2),
            experienceList: undefined,
          }
        } else {
          this.state = {
            instance: undefined,
            account: null,
            web3: null,
            experienceList: undefined,
          }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.captureFile = this.captureFile.bind(this);
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

    uploadFile = async () => {
      console.log("Submitting file to IPFS...");
      //adding file to the IPFS
      await ipfs.add(this.state.buffer, (error, result) => {
        if (error) {
          console.error(error);
          return result;
        }
        this.setState({hash: result[0].hash}, this.addExperience);
      });
    }

    addExperience = async () => {
      console.log(this.state);
      let experienceList = [];
      let experience = {
        id: 0,
        hash: this.state.hash,
        title: this.state.fileTitle,
        experienceType: this.state.experienceType,
        candidateId: 0,
        author: this.state.account,
        isVerified: false,
        verifiableBy: this.state.verifiableBy,
        verificationDate: 0
      }
      experienceList.push(experience);
      console.log(experienceList);
      await this.state.instance.methods.addExperiences(experienceList).send({from: this.state.account, gas: 1000000});

      console.log("Experience added");
      document.getElementById("showModal").click();
    }

    clic = async () => {
      document.getElementById("showModal").click();
    }

    goToHome = async () => {
      //Reload
      window.location.replace(window.origin);
    }

    captureFile = event => {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        this.setState({ fileTitle: file.name, file: file, buffer: Buffer(reader.result) });
        console.log('file', this.state.file);
        console.log('buffer', this.state.buffer);
      };
    };
    
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

      const verifiersDeployedNetwork = VerifiersContract.networks[networkId];
      const verifiersInstance = new web3.eth.Contract(VerifiersContract.abi, verifiersDeployedNetwork && verifiersDeployedNetwork.address);
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log("Setting state");
      this.setState({ verifiersInstance: verifiersInstance, instance: instance, web3: web3, account: accounts[0] }, this.populateData);
    };

    populateData = async () => {
      const getAllAuthorizedVerifiersResult = await this.state.verifiersInstance.methods.getAllAuthorizedverifiers().call({from: this.state.account});
      let universitiesList = [];
      let employeersList = [];
      for (var i = 0; i < getAllAuthorizedVerifiersResult.length; i++) {
        if (getAllAuthorizedVerifiersResult[i].verifierType == 1){
          universitiesList.push(getAllAuthorizedVerifiersResult[i]);
        }
        if (getAllAuthorizedVerifiersResult[i].verifierType == 2){
          employeersList.push(getAllAuthorizedVerifiersResult[i]);
        }
      }
      universitiesList = universitiesList.sort((a, b) => (a.name > b.name) ? 1 : -1);
      employeersList = employeersList.sort((a, b) => (a.name > b.name) ? 1 : -1);
      this.setState({ universitiesList: universitiesList, universitiesCount: universitiesList.length,
        employeersList: employeersList, employeersCount: employeersList.length});
      console.log(this.state);
    };

    render() {
      if (!this.state.web3) {
        return (
          <div className = "container-fluid">
            <div className="jumbotron">
              <h2>Esperando a conectar...</h2>
            </div>
          </div>
        );
      } else {
        let optionsList;
        if(this.state.experienceType == 1 && this.state.universitiesList){
          optionsList = this.state.universitiesList.map((university, key) => {
            return (
              <option key={key} value={university.verifierAddress}>[{university.cif}] {university.name}</option>
            );
          });
        } else {
          if(this.state.employeersList){
            optionsList = this.state.employeersList.map((employeer, key) => {
              return (
                <option key={key} value={employeer.verifierAddress}>[{employeer.cif}] {employeer.name}</option>
              );
            });
          }
        }
        return (
        <div className = "container-fluid">  
          <NavigationRegisteredCandidate state = {this.state}/>
          <div className = "container-fluid">
            <div className="row">
              <div className="col-*-*"><h3>Nueva experiencia {this.state.experienceType == 1 ? "académica" : "profesional"}</h3></div>
            </div>
          </div>
          <div className = "container-fluid">
            <Form onSubmit={(event) => {
                  event.preventDefault()
                  this.uploadFile()
                  //this.addExperience()
                  //this.clic();
                }} >
              <div className="row">
                <div className="col-sm-6">
                  <FormLabel>Fichero que comprueba tu experiencia (sólo ficheros PDF)</FormLabel>
                  <FormGroup>
                    <FormLabel htmlFor = "myfile" className="btn btn-info">Selecciona un fichero</FormLabel>
                    <FormControl id = "myfile" type="file" accept=".pdf" onChange={this.captureFile} style={{display: "none"}} />
                    <p><FormText className="text-muted">{this.state.file ? "Nombre: " + this.state.file.name : ""}</FormText></p>
                    <p><FormText className="text-muted">{this.state.file ? "Extension: " + this.state.file.type : ""}</FormText></p>
                  </FormGroup>
                </div>
                <div className="col-sm-6">
                  <FormGroup>
                    <FormLabel>Verificable por</FormLabel>
                    <FormControl
                      name = "verifiableBy"
                      as="select"
                      onChange={this.handleInputChange} required>
                      <option value="">Selecciona un verificador</option>
                      {optionsList}
                    </FormControl>
                  </FormGroup>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <FormLabel>Título del fichero</FormLabel>
                  <FormGroup>
                    <FormControl 
                      name = "fileTitle"
                      input='text'
                      id = "fileTitle"
                      value = {this.state.fileTitle}
                      onChange={this.handleInputChange}
                      placeholder="Introduce un título para el fichero"
                      required />
                  </FormGroup>
                </div>
              </div>
              <div className="row text-center">
                <Button variant="info"type="submit" className="invisible" onClick={this.saveThisExperience}>Añadir otra</Button>
              </div>
              <div className="row">
                &nbsp;
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
                      <p>Experiencia(s) añadida(s)</p>
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
    }
  }
}

export default AddExperience;