import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class CandidateDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      candidateCount: 0,
      candidateList: null,
      loaded:false,
      isOwner:false
    }
  }

  // getCandidates = async () => {
  //   let result = await this.state.MasoomInstance.methods.getCandidates().call();

  //   this.setState({ candidates : result });
  //   for(let i =0; i <result.length ; i++)

    
  // }

  componentDidMount = async () => {

    // FOR REFRESHING PAGE ONLY ONCE -
    if(!window.location.hash.includes("#loaded")){
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MasoomContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MasoomContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });

      let candidateCount = await this.state.MasoomInstance.methods.getCandidateCount().call();
      this.setState({ candidateCount : candidateCount });

      let candidateList = [];
      for(let i=0;i<candidateCount;i++){
        let candidate = await this.state.MasoomInstance.methods.candidateDetails(i).call();

        candidateList.push(candidate);
      }

      this.setState({candidateList : candidateList});

      const owner = await this.state.MasoomInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }

      let fileCount = await instance.methods.fileCount().call();
      this.setState({fileCount});
      
      // Load files, sort by newest
      let fileList = [];
      for (var i = fileCount; i>= 1; i--){
        const file = await instance.methods.files(i).call();
        fileList.push(file);
      }
      this.setState({
        files: fileList,
      })
      console.log(this.state);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  

  render() {
    let candidateList;
    if(this.state.candidateList){
      candidateList = this.state.candidateList.map((candidate, key) => {
        return (
          <tr key={key}>
            <td>{candidate.candidateId}</td>
            <td>{candidate.name}</td>
            <td>{candidate.party}</td>
            <td>{candidate.manifesto}</td>
            <td>{candidate.constituency}</td> 
          </tr>
        );
      });
    }

    let fileList;
    if(this.state.files){
      fileList = this.state.files.map((file, key) => {
        return (
          <tr key={key}>
            <td>{file.id}</td>
            <td><a href={`https://ipfs.infura.io/ipfs/${file.hash}`}>{file.title}</a></td>
            <td>{file.author}</td>
          </tr>
        );
      });
    }
    
    if (!this.state.web3) {
      return (
        <div className = "container-fluid">  
          <div>{this.state.isOwner ? <NavigationAdmin/>: <Navigation/>}</div>
          <div className = "container"> 
            <div className="row">
              <div className="col-*-*"><h2>Loading Web3, accounts, and contract...</h2></div>
            </div>
          </div>
        </div>
      );
  } 
    
    return (
      <div className = "container-fluid">  
        <div>{this.state.isOwner ? <NavigationAdmin/>: <Navigation/>}</div>
        <div className = "container"> 
          <div className="row">
            <div className="col-*-*"><h2>Candidates List</h2></div>
          </div>
          <div className="row">
            <div>
              Total Number of Candidates: {this.state.candidateCount}
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Party</th>
                    <th>Manifesto</th>
                    <th>Constituency Number</th>
                  </tr>
                </thead>
                <tbody>
                  {candidateList}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-*-*"><h2>Files List</h2></div>
          </div>
          <div className="row">
            <div>
              Total Number of Files: {this.state.fileCount}
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                  </tr>
                </thead>
                <tbody>
                  {fileList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CandidateDetails;