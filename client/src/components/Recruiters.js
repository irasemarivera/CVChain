import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import VerifiersContract from "../abi/RecruitersVerifiersContract.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Footer from './Footer';

class Recruiters extends Component {
  constructor(props) {
    super(props)
    if (props.location.state) {
      this.state = {
        instance: props.location.state.instance,
        account: props.location.state.account,
        web3: props.location.state.web3,
        role: props.location.state.role,
        type: props.location.search,
        recruitersList: props.location.state.recruitersList,
        recruitersCount: props.location.state.recruitersCount,
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
    const deployedNetwork = VerifiersContract.networks[networkId];
    const instance = new web3.eth.Contract(VerifiersContract.abi, deployedNetwork && deployedNetwork.address);
    
    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    console.log("Setting state");
    this.setState({ verifiersInstance: instance, web3: web3, account: accounts[0] }, this.populateData);
      
  };

  populateData = async () => {
    const getAllAuthorizedRecruitersResult = await this.state.verifiersInstance.methods.getAllAuthorizedRecruiters().call({from: this.state.account});
    console.log(getAllAuthorizedRecruitersResult);
    let recruitersList = [];
    for (var i = 0; i<getAllAuthorizedRecruitersResult.length; i++)
      recruitersList.push(getAllAuthorizedRecruitersResult[i]);

    this.setState({ recruitersList: recruitersList, recruitersCount: recruitersList.length });
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
    let recruitersCount = 0;
    let recruitersList;
    if(this.state.recruitersList){
      recruitersList = this.state.recruitersList.map((recruiter, key) => {
        return (
          <tr key={key}>
            <td>{++recruitersCount}</td>
            <td>{recruiter.cif}</td>
            <td>{recruiter.name}</td>
            <td>{recruiter.postalAddress}</td>
            <td>{recruiter.emailAddress}</td>
            <td>{recruiter.verifierAddress}</td>
          </tr>
        );
      });
    }
    return (
      <div className = "container-fluid">  
        <NavigationAdmin state={this.state}/>
        <div className = "container"> 
          <div className="row">
            <div className="col-sm-10"><h3>Reclutadores</h3></div>
            <div className="col-sm-2"><Link to = {{pathname: "/AddRecruiter", state: this.state}}><Button type = "button">Nuevo reclutador</Button></Link></div>
          </div>
          <div className="row">
            <div className="col-sm-10">
              Total de reclutadores: { this.state.recruitersCount }
            </div>
          </div>
          <div className="row">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CIF</th>
                    <th>Nombre</th>
                    <th>Direccion Postal</th>
                    <th>Correo Electrónico</th>
                    <th>Dirección Ethereum</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitersList}
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

export default Recruiters;