import MainContract from "../abi/CandidateContract.json";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";

import React, { Component } from "react";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import NavigationUnregisteredCandidate from './NavigationUnregisteredCandidate';
import NavigationRegisteredCandidate from './NavigationRegisteredCandidate';
import NavigationVerifier from './NavigationVerifier';
import NavigationRecruiter from './NavigationRecruiter';
import HomeUnregisteredCandidate from './HomeUnregisteredCandidate';
import HomeRegisteredCandidate from './HomeRegisteredCandidate';
import HomeVerifier from './HomeVerifier';
import HomeRecruiter from './HomeRecruiter';
import Numbers from './Numbers';
import Footer from './Footer';
import Error from './Error';

class Home extends Component {
  constructor(props) {
    super(props)
    if (props.location.state)
      this.state = props.location.state;
    else{
      this.state = {
        instance: undefined,
        account: null,
        web3: null,
      }
    }
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

    const verifierDeployedNetwork = VerifiersContract.networks[networkId];
    const verifierInstance = new web3.eth.Contract(VerifiersContract.abi, verifierDeployedNetwork && verifierDeployedNetwork.address);
    
    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    console.log("Setting state");
    this.setState({ verifierInstance: verifierInstance, instance: instance, web3: web3, account: accounts[0] }, this.populateData);  
  };

  populateData = async () => {
    const role = await this.state.instance.methods.getUserRole().call({from: this.state.account});
    const candidatesCount = await this.state.instance.methods.getRegisteredCandidateCount().call();
    const verifiersCount = await this.state.instance.methods.getAuthorizedVerifierCount().call();
    const recruitersCount = await this.state.instance.methods.getAuthorizedRecruiterCount().call();
    this.setState({role: role, candidatesCount: candidatesCount, verifiersCount: verifiersCount, recruitersCount: recruitersCount});
    if (role == 1){
      const getCandidateResult = await this.state.instance.methods.getCandidate().call({from: this.state.account});
      this.setState({ candidate: getCandidateResult[0], experiences: getCandidateResult[1], page: "Home"});
    } else if (role == 3){
      const verifier = await this.state.verifierInstance.methods.getVerifier(this.state.account).call({from: this.state.account});
      const verifiableCandidates = await this.state.instance.methods.getVerifiableCandidates().call({from: this.state.account});
      this.setState({ verifier: verifier, verifiableCandidates: verifiableCandidates, verifiableCandidatesCount: verifiableCandidates.length, page: "Home"});
    } else if (role == 2){
      const recruiter = await this.state.verifierInstance.methods.getRecruiter(this.state.account).call({from: this.state.account});
      this.setState({ recruiter: recruiter, page: "Home"});
    }
    console.log("User role:" + role);
    console.log("Account:", this.state.account)
    console.log(this.state);
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
          <HomeUnregisteredCandidate state = {this.state}/>
          <Numbers state = {this.state} />
          <Footer/>
        </div>
      );
    } else if(this.state.role == 1) {
      return (
        <div className = "container-fluid">
          <NavigationRegisteredCandidate state = {this.state}/>
          <HomeRegisteredCandidate state = {this.state}/>
          <Numbers state = {this.state} />
          <Footer/>
        </div>
      );
    } else if(this.state.role == 2) {
      return (
        <div className = "container-fluid">
          <NavigationRecruiter state = {this.state}/>
          <HomeRecruiter state = {this.state}/>
          <Numbers state = {this.state} />
          <Footer/>
        </div>
      );
    } else if(this.state.role == 3) {
      return (
        <div className = "container-fluid">
          <NavigationVerifier state = {this.state}/>
          <HomeVerifier state = {this.state}/>
          <Numbers state = {this.state} />
          <Footer/>
        </div>
      );
    } else if(this.state.role == 5) {
      return (
        <div className = "container-fluid">
          <NavigationAdmin state={this.state}/>
          <div className="jumbotron">
            <h2>¡Bienvenid@ Administrador!</h2>
          </div>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <Numbers state = {this.state} />
          <Footer/>
        </div>
      );
    } else {
      return (<Error/>);
    }
  }
}

export default Home;
