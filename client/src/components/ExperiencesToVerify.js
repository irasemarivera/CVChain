import React, { Component } from "react";
import { Form, FormLabel, FormGroup, FormControl, Button } from 'react-bootstrap';

import MainContract from "../abi/CandidateContract.json";
import getWeb3 from "../getWeb3";

import NavigationVerifier from './NavigationVerifier';
import HomeRegisteredCandidate from './HomeRegisteredCandidate';
import Footer from './Footer';

class ExperiencesToVerify extends Component {
  constructor(props) {
    super(props)
    console.log(props);
    if (props.location.state) {
      this.state = {
        instance: props.location.state.state.instance,
        account: props.location.state.state.account,
        web3: props.location.state.state.web3,
        role: props.location.state.state.role,
        page: "ExperiencesToVerify",
        candidate: props.location.state.candidate,
        verifier: props.location.state.state.verifier,
        verifiableCandidates: props.location.state.state.verifiableCandidates,
        verifiableCandidatesCount: props.location.state.state.verifiableCandidatesCount,
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
    const getUnverifiedExperiencesByCandidateResult = await this.state.instance.methods.getUnverifiedExperiencesByCandidate(this.state.candidate.candidateAddress).call({from: this.state.account});
    let unverifiedExperiencesList = [];
    for (var i = 0; i < getUnverifiedExperiencesByCandidateResult.length; i++) {
      unverifiedExperiencesList.push(getUnverifiedExperiencesByCandidateResult[i]);
    }
    this.setState({ unverifiedExperiences: unverifiedExperiencesList, unverifiedExperiencesCount: unverifiedExperiencesList.length});

    console.log(this.state);
  }
  
  verifyExperiences = async () => {
    let experienceList = [];
    this.state.unverifiedExperiences.forEach(experience => {
      if(document.getElementById(experience.id).checked){
        experienceList.push(experience);
      }
    });
    if (experienceList.length > 0){
      console.log(experienceList);
      await this.state.instance.methods.verifyExperiences(experienceList, this.state.candidate.candidateAddress).send({from: this.state.account, gas: 1000000});
      document.getElementById("showModal").click();
    } else {
      alert("Seleccione al menos una experiencia");
    }
  }
  
  clic = async () => {
    document.getElementById("showModal").click();
  }

  handleInputChange  = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if (target.value == "on")
      value = true;
    else
      value = false;
    this.state.unverifiedExperiences[event.target.id] = value;
    //console.log({ [name]: value} );
    console.log(event.target);
  }

  render() {
    let unverifiedExperiencesList;
    if(this.state.unverifiedExperiences){
      unverifiedExperiencesList = this.state.unverifiedExperiences.map((unverifiedExperience, key) => {
        return (
          <tr key={key}>
            <td>{unverifiedExperience.id}</td>
            <td><a href={`https://ipfs.infura.io/ipfs/${unverifiedExperience.hash}`}>{unverifiedExperience.title}</a></td>
            <td><input id={unverifiedExperience.id} name={"check_"+unverifiedExperience.id} type="checkbox"/></td>
          </tr>
        );
      });
    }
    
    if (!this.state.web3) {
      return (
        <div className = "container-fluid">
          <div className="jumbotron">
            <h2>Esperando a conectar...</h2>
          </div>
        </div>
      );
    } else {
      return (
        <div className = "container-fluid">  
          <NavigationVerifier state = {this.state}/>
          <div className = "container"> 
            <div className="row">
              <HomeRegisteredCandidate state = {this.state}/>
            <div className="col-sm-10"><h3>Experiencias {this.state.verifier.verifierType == 1 ? "académicas" : "profesionales"}</h3></div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                Total de experiencias a verificar: {this.state.unverifiedExperiencesCount}
              </div>
              <div className="col-sm-2">
                <Form onSubmit={(event) => {
                  event.preventDefault()
                  this.verifyExperiences()
                }} >
                <FormGroup>
                    <Button variant="primary" type="submit">Verificar experiencias seleccionadas</Button>
                    <button id="showModal" type="button" hidden className="btn btn-info btn-md invisible" data-toggle="modal" data-target="#myModal" onClick={this.clic}>Open Modal</button>
                </FormGroup>
                </Form>
            </div>
            </div>
            <div className="row">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Título</th>
                      <th>Verificar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unverifiedExperiencesList}
                  </tbody>
                </table>
              </div>
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
                    <p>Experiencias verificadas</p>
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

export default ExperiencesToVerify;