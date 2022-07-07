import React, { Component } from "react";
import { Form, FormLabel, FormText, FormGroup, FormControl, Button } from 'react-bootstrap';

import MainContract from "../abi/CandidateContract.json";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";
import getWeb3 from "../getWeb3";

import NavigationRegisteredCandidate from './NavigationRegisteredCandidate';
import HomeRegisteredCandidate from './HomeRegisteredCandidate';
import Experiences from './Experiences';
import Footer from './Footer';
import Error from './Error';

class MyCV extends Component {
  constructor(props) {
    super(props)
      if (props.location.state) {
        this.state = {
          instance: props.location.state.instance,
          account: props.location.state.account,
          web3: props.location.state.web3,
          role: props.location.state.role,
          page: "MyCV",
        }
      } else {
        this.state = {
          instance: undefined,
          account: null,
          web3: null,
        }
      }
      console.log(this.state);
  }

  handleInputChange  = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value} );
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
    
    const verifierDeployedNetwork = VerifiersContract.networks[networkId];
    const verifierInstance = new web3.eth.Contract(VerifiersContract.abi, verifierDeployedNetwork && verifierDeployedNetwork.address);
    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    console.log("Setting state");
    this.setState({ verifierInstance: verifierInstance, instance: instance, web3: web3, account: accounts[0] }, this.populateData);
  };

  populateData = async () => {
    const getCandidateResult = await this.state.instance.methods.getCandidate().call({from: this.state.account});
    let academicExperienceList = [];
    let professionalExperienceList = [];
    for (var i = 0; i < getCandidateResult[1].length; i++) {
      const getVerifierResult = await this.state.verifierInstance.methods.getVerifier(getCandidateResult[1][i].verifiableBy).call({from: this.state.account});
      getCandidateResult[1][i].verifier = "[" + getVerifierResult.cif + "]  " + getVerifierResult.name;
      if (getCandidateResult[1][i].experienceType == 1) {
        academicExperienceList.push(getCandidateResult[1][i]);
      } else if (getCandidateResult[1][i].experienceType == 2) {
        professionalExperienceList.push(getCandidateResult[1][i]);
      }
    }

    const getAllAuthorizedRecruitersResult = await this.state.verifierInstance.methods.getAllAuthorizedRecruiters().call({from: this.state.account});
    let recruitersList = [];
    for (var i = 0; i < getAllAuthorizedRecruitersResult.length; i++) {
      recruitersList.push(getAllAuthorizedRecruitersResult[i]);
    }

    const resumeTime = await this.state.instance.methods.getViewResumeTime().call({from: this.state.account});

    this.setState({ candidate: getCandidateResult[0], academicExperienceList: academicExperienceList, academicExperienceCount: academicExperienceList.length, 
      professionalExperienceList: professionalExperienceList, professionalExperienceCount: professionalExperienceList.length,
      recruitersList: recruitersList, resumeTime: resumeTime});

    
    console.log(this.state);
  }
  
  authorizeResume = async () => {
    let recruitersList = []
    recruitersList.push(this.state.authorizedTo);
    try {
      await this.state.instance.methods.authorizeRecruiter(recruitersList).send({from: this.state.account, gas: 1000000});

      const getRecruiterrResult = await this.state.verifierInstance.methods.getRecruiter(this.state.authorizedTo).call({from: this.state.account});
      const expirationDate = new Date(Date.now() + (this.state.resumeTime*1000)).toLocaleString()
      this.setState({recruiterAuthorized: "[" + getRecruiterrResult.cif + "]  " + getRecruiterrResult.name, expirationDate: expirationDate }, this.clic);
    } catch (error){
      alert(error.message);
    }
  }
  
  clic = async () => {
    document.getElementById("showModal").click();
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
    } else if (this.state.candidate){
      let optionsList;
      if(this.state.recruitersList){
        optionsList = this.state.recruitersList.map((recruiter, key) => {
          return (
            <option key={key} value={recruiter.recruiterAddress}>[{recruiter.cif}] {recruiter.name}</option>
          );
        });
      }
      let url = window.origin 
      return (
        <div className = "container-fluid">  
          <NavigationRegisteredCandidate state = {this.state}/>
          <div className = "container"> 
            <div className="row">
              <Form onSubmit={(event) => {
                event.preventDefault()
                this.authorizeResume()
              }} >
              <FormGroup>
                <div className="col-sm-2">
                  <FormLabel>Compartir CV con</FormLabel>
                  </div>
                <div className="col-sm-8">
                  <FormControl
                    name = "authorizedTo"
                    as="select"
                    onChange={this.handleInputChange} required>
                    <option value="">Selecciona un reclutador</option>
                    {optionsList}
                  </FormControl>
                </div>
                <div className="col-sm-1">
                  <Button variant="primary" type="submit">Autorizar</Button>
                  <button id="showModal" type="button" hidden className="btn btn-info btn-md invisible" data-toggle="modal" data-target="#myModal" onClick={this.clic}>Open Modal</button>
                </div>
              </FormGroup>
              </Form>
            </div>
          </div>
          <HomeRegisteredCandidate state = {this.state}/>
          <Experiences state = {this.state}/>
          <div className="container">
            <div className="modal fade" id="myModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">CV compartido</h4>
                  </div>
                  <div className="modal-body">
                    <p>El CV es accesible desde este momento por {this.state.recruiterAuthorized}</p>
                    <p>Recuerda que el CV sólo estará disponible para el reclutador hasta el {this.state.expirationDate}</p>
                    <p><a href={`${window.origin}/#/ViewCV?address=${this.state.account}`}>{`${window.origin}/#/ViewCV?address=${this.state.account}`}</a></p>
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
      return (<Error/>);
    }
  }
}

export default MyCV;