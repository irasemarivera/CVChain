import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import MainContract from "../abi/CandidateContract.json";
import getWeb3 from "../getWeb3";

import NavigationVerifier from './NavigationVerifier';

class CandidatesToVerify extends Component {
  constructor(props) {
    super(props)
    if (props.location.state) {
      this.state = {
        instance: props.location.state.instance,
        account: props.location.state.account,
        web3: props.location.state.web3,
        role: props.location.state.role,
        page: "verifyCandidates",
        verifier: props.location.state.verifier,
        verifiableCandidates: props.location.state.verifiableCandidates,
        verifiableCandidatesCount: props.location.state.verifiableCandidatesCount,
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
    console.log(this.state);
  };
  

  render() {
    if (!this.state.web3) {
      return (
        <div className = "container-fluid">
          <div className="jumbotron">
            <h2>Esperando a conectar... </h2>
          </div>
        </div>
      );
    }
    let candidatesCount = 0;
    let candidateList;
    if(this.state.verifiableCandidates){
      candidateList = this.state.verifiableCandidates.map((candidate, key) => {
        return (
          <tr key={key}>
            <td>{++candidatesCount}</td>
            <td>{candidate.dni}</td>
            <td>{candidate.name} {candidate.lastName} {candidate.secondLastName}</td>
            <td>{candidate.emailAddress}</td>
            <td><Link to = {{pathname: "/ExperiencesToVerify", state: {candidate: candidate, state: this.state} }}>Ver Experiencias</Link></td>
          </tr>
        );
      });
    }
    return (
      <div className = "container-fluid">  
        <NavigationVerifier state = {this.state}/>
        <div className = "container"> 
          <div className="row">
            <div className="col-sm-10"><h3>Candidato(s) a verificar</h3></div>
          </div>
          <div className="row">
            <div className="col-sm-10">
              Total de candidatos a verificar: { this.state.verifiableCandidatesCount }
            </div>
          </div>
          <div className="row">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Correo Electrónico</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {candidateList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CandidatesToVerify;