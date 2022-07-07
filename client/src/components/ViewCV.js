import React, { Component } from "react";
import { Form, FormLabel, FormText, FormGroup, FormControl, Button } from 'react-bootstrap';

import MainContract from "../abi/CandidateContract.json";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";
import getWeb3 from "../getWeb3";

import NavigationRecruiter from './NavigationRecruiter';
import HomeRegisteredCandidate from './HomeRegisteredCandidate';
import Footer from './Footer';

class ViewCV extends Component {
  constructor(props) {
    console.log(props);
    super(props)
      if (props.location.state) {
        this.state = {
          instance: props.location.state.instance,
          account: props.location.state.account,
          web3: props.location.state.web3,
          role: props.location.state.role,
          page: "ViewCV",
        }
      } else if (props.location.search){
        var address = props.location.search.substring(props.location.search.indexOf("=")+1,props.location.search.length);
        console.log(address);
        if (address.length > 0)
          this.state = {
            page: "ViewCV",
            candidateAddress: props.location.search.substring(props.location.search.indexOf("=")+1,props.location.search.length),
          }
        else {
          this.state = {
            page: "ViewCV",
            message: "La dirección no existe",
          }
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
        console.log("antes");
        web3 = await getWeb3();
        console.log("despues");
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
    if (this.state.candidateAddress)
      this.getCandidate();
  }
  
  getCandidate = async () => {
    console.log(this.state);
    let address = this.state.candidateAddress;
    if (!address){
      address = document.getElementById("candidateAddress").value;
    }
    try {
      const getCandidateResult = await this.state.instance.methods.getCandidateRecruiter(address, Math.trunc(Date.now()/1000)).call({from: this.state.account});
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

      this.setState({ candidateAddress: address, candidate: getCandidateResult[0], academicExperienceList: academicExperienceList, academicExperienceCount: academicExperienceList.length, 
        professionalExperienceList: professionalExperienceList, professionalExperienceCount: professionalExperienceList.length, getCandidateResult: getCandidateResult});

      console.log(this.state);
    } catch (error){
      console.log(error);
      this.setState({message: "No estas autorizado para ver este CV y/o la dirección no existe"}, this.clic);
    }
  }
  
  clic = async () => {
    document.getElementById("showModal").click();
  }

  render() {
    let academmicExperiencesCount = 0;
    let academicExperienceList;
    if(this.state.academicExperienceList){
      academicExperienceList = this.state.academicExperienceList.map((academicExperience, key) => {
        return (
          <tr key={key}>
            <td>{++academmicExperiencesCount}</td>
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
    let modal = <div className="container">
                  <button id="showModal" type="button" hidden className="btn btn-info btn-md invisible" data-toggle="modal" data-target="#myModal" onClick={this.clic}>Open Modal</button>
                  <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <h4 className="modal-title">Mensaje</h4>
                        </div>
                        <div className="modal-body">
                          <p>{this.state.message}</p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.goToHome}>Cerrar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    if (!this.state.web3) {
      return (
        <div className = "container-fluid">
          <div className="jumbotron">
            <h2>Esperando a conectar...</h2>
          </div>
          {modal}
        </div>
      );
    } 
    if (!this.state.candidateAddress){
      return (
        <div className = "container-fluid">  
          <NavigationRecruiter/>
          <div className = "container"> 
            <div className="row">
              <Form onSubmit={(event) => {
                event.preventDefault()
                this.getCandidate()
                //this.clic();
              }} >
              <FormGroup>
                <div className="col-sm-2">
                  <FormLabel>Dirección del candidato</FormLabel>
                  </div>
                <div className="col-sm-8">
                  <FormControl
                      id = "candidateAddress"
                      input = 'text'
                      value = {this.state.candidateAddress}
                      placeholder = "Introduce la dirección Ethereum del candidato"
                      required />
                </div>
                <div className="col-sm-1">
                  <Button variant="primary" type="submit">Consultar</Button>
                </div>
              </FormGroup>
              </Form>
            </div>
          </div>
          {modal}
          <Footer/>
        </div> 
      );
    }
    if (this.state.candidateAddress){
      return (
        <div className = "container-fluid">  
          <NavigationRecruiter state = {this.state}/>
          <div className = "container">
              <div className="well well-sm">
                  <div className = "row">
                      <div className="col-sm-6 text-left">&nbsp;</div>
                      <div className="col-sm-6 text-right">Estado general del perfil:&nbsp;
                          {this.state.candidate ? 
                          (this.state.candidate.isVerified ? 
                              <span className="label label-success">Verificado</span> 
                          : (this.state.candidate.experienceCount > 0 ?
                              <span className="label label-danger">No verificado</span>
                          : <span className="label label-default">Sin experiencia</span>
                          )) : "Error"}
                      </div>
                  </div>
              </div>
            <div className="row">
              <HomeRegisteredCandidate state = {this.state}/>
              <div className="col-sm-10"><h3>Experiencias Académicas</h3></div>
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
            <div className="row">
              <div className="col-sm-10"><h3>Experiencias Profesionales</h3></div>
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
          {modal}
        </div>
      );
    }
  }
}

export default ViewCV;