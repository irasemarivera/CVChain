import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import MainContract from "../abi/CandidateContract.json";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";
import getWeb3 from "../getWeb3";

import NavigationRegisteredCandidate from './NavigationRegisteredCandidate';
import Footer from './Footer';

class MyExperiences extends Component {
  constructor(props) {
    super(props)
      if (props.location.state) {
        this.state = {
          instance: props.location.state.instance,
          account: props.location.state.account,
          web3: props.location.state.web3,
          role: props.location.state.role,
          page: "MyExperiences",
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
    for (var i = 0; i<getCandidateResult[1].length; i++) {
      const getVerifierResult = await this.state.verifierInstance.methods.getVerifier(getCandidateResult[1][i].verifiableBy).call({from: this.state.account});
      getCandidateResult[1][i].verifier = "[" + getVerifierResult.cif + "]  " + getVerifierResult.name;
      if (getCandidateResult[1][i].experienceType == 1) {
        academicExperienceList.push(getCandidateResult[1][i]);
      } else if (getCandidateResult[1][i].experienceType == 2) {
        professionalExperienceList.push(getCandidateResult[1][i]);
      }
    }

    this.setState({ candidate: getCandidateResult[0], academicExperienceList: academicExperienceList, academicExperienceCount: academicExperienceList.length, 
      professionalExperienceList: professionalExperienceList, professionalExperienceCount: professionalExperienceList.length});
    console.log(this.state);
  }
  
  getVerifier = async (verifierAddress) => {
    const getVerifierResult = await this.state.verifierInstance.methods.getVerifier(verifierAddress).call({from: this.state.account});
    console.log(getVerifierResult);
    return "hola" + verifierAddress;
  }
  

  render() {
    let academicExperiencesCount = 0;
    let academicExperienceList;
    if(this.state.academicExperienceList){
      academicExperienceList = this.state.academicExperienceList.map((academicExperience, key) => {
        return (
          <tr key={key}>
            <td>{++academicExperiencesCount}</td>
            <td><a href={`https://ipfs.infura.io/ipfs/${academicExperience.hash}`}>{academicExperience.title}</a></td>
            <td>{academicExperience.isVerified ? <span className="label label-success">Verificado</span> : <span className="label label-default">Pendiente</span>}</td>
            <td>{academicExperience.verifier}</td>
            <td>{academicExperience.isVerified ? new Date(academicExperience.verificationDate*1000).toLocaleString() : "-"}</td>
          </tr>
        );
      });
    }
    let professionalExperiencesCount = 0;
    let professionalExperienceList;
    if(this.state.professionalExperienceList){
      professionalExperienceList = this.state.professionalExperienceList.map((professionalExperience, key) => {
        return (
          <tr key={key}>
            <td>{++professionalExperiencesCount}</td>
            <td><a href={`https://ipfs.infura.io/ipfs/${professionalExperience.hash}`}>{professionalExperience.title}</a></td>
            <td>{professionalExperience.isVerified ? <span className="label label-success">Verificado</span> : <span className="label label-default">Pendiente</span>}</td>
            <td>{professionalExperience.verifier}</td>
            <td>{professionalExperience.isVerified ? new Date(professionalExperience.verificationDate*1000).toLocaleString() : "-"}</td>
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
          <NavigationRegisteredCandidate state = {this.state}/>
          <div className = "container"> 
            <div className="row">
              <div className="col-sm-10"><h3>Experiencias Académicas</h3></div>
              <div className="col-sm-2"><Link to = {{pathname: "/AddExperience", state: this.state, search: "academic"}}><Button type = "button">Nueva experiencia</Button></Link></div>
            </div>
            <div className="row">
              <div className="col-sm-10">
                Total de experiencias académicas: {this.state.academicExperienceCount}
              </div>
            </div>
            <div className="row">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Título</th>
                      <th>Status</th>
                      <th>Verificable por</th>
                      <th>Fecha de verificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicExperienceList}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">&nbsp;</div>
            <div className="row">&nbsp;</div>
            <div className="row">
              <div className="col-sm-10"><h3>Experiencias Profesionales</h3></div>
              <div className="col-sm-2"><Link to = {{pathname: "/AddExperience", state: this.state, search: "professional"}}><Button type = "button">Nueva experiencia</Button></Link></div>
            </div>
            <div className="row">
              <div className="col-sm-10">
                Total de experiencias profesionales: {this.state.professionalExperienceCount}
              </div>
            </div>
            <div className="row">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Título</th>
                      <th>Status</th>
                      <th>Verificable por</th>
                      <th>Fecha de verificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professionalExperienceList}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      );
    }
  }
}

export default MyExperiences;