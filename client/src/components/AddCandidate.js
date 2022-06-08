import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import { Form, FormLabel, FormText, FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
import MainFile from './MainFile'

// Declare IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

class AddCandidate extends Component {
    constructor(props){
        super(props);
        this.state = {
            MasoomInstance: undefined,
            account: null,
            web3: null,
            name: '',
            party: '',
            manifesto: '',
            constituency: '',
            candidates: null,
            isOwner: false,
            files: [],
            loading: true,
            currentHash: null,
            currentTitle: null,
        };
        this.uploadFile = this.uploadFile.bind(this);
        this.captureFile = this.captureFile.bind(this);
        this.changeFile = this.changeFile.bind(this);
    }

    updateName = event => {
        this.setState({ name: event.target.value});
    }

    updateParty = event => {
        this.setState({ party: event.target.value});
    }

    updateManifesto = event => {
        this.setState({ manifesto: event.target.value});
    }

    updateConstituency = event => {
        this.setState({ constituency: event.target.value});
    }

    addCandidate = async () => {
      await this.state.MasoomInstance.methods.addCandidate(
        this.state.name,
        this.state.party,
        this.state.manifesto,
        this.state.constituency).send({
          from: this.state.account, gas: 1000000
        });

        //Reload
        window.location.reload(false);
    }

    captureFile = event => {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        this.setState({ currentTitle: file, buffer: Buffer(reader.result) });
        console.log('title', this.state.currentTitle);
        console.log('buffer', this.state.buffer);
      };
    };

    changeFile = (hash, title) => {
      this.setState({ currentHash: hash });
      this.setState({ currentTitle: title });
    };

    uploadFile = (title) => {
      console.log("Submitting file to IPFS...");
      //adding file to the IPFS
      ipfs.add(this.state.buffer, (error, result) => {
        console.log("IPFS result", result);
        if (error) {
          console.error(error);
          return;
        }
        this.setState({ loading: true });
        this.state.MasoomInstance.methods.uploadFile(result[0].hash, title).send({ from: this.state.account}).on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
      });
    };
    
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
          this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });
          
          const owner = await this.state.MasoomInstance.methods.getOwner().call();
          if (this.state.account === owner) {
            this.setState({isOwner: true});
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
          //Set latest file with title to view as default
          const latest = await instance.methods.files(fileCount).call();
          this.setState({
            currentHash: latest.hash,
            currentTitle: latest.title,
          })
          this.setState({ loading: false});
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };

    render() {
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

      if (!this.state.isOwner) {
          return (
            <div className = "container-fluid">  
              <div>{this.state.isOwner ? <NavigationAdmin/>: <Navigation/>}</div>
              <div className = "container"> 
                <div className="row">
                  <div className="col-*-*"><h2>Only Admin can access.</h2></div>
                </div>
              </div>
            </div>
          );
      }

      let fileList;
      if(this.state.files){
        fileList = this.state.files.map((file, key) => {
          return (
          <div key={key}>
            <div>
              <a href={`https://ipfs.infura.io/ipfs/${file.hash}`}>{file.title}</a>
            </div>
          </div>
          );
        });
      }

      return (
        <div className = "container-fluid">  
          <div>{this.state.isOwner ? <NavigationAdmin/>: <Navigation/>}</div>
          <div className = "container"> 
            <div className="row">
              <div className="col-*-*"><h2>Add candidate</h2></div>
            </div>
            <div className="row">
              <Form onSubmit={(event) => {
                  event.preventDefault()
                  this.addCandidate()
                  const title = this.fileTitle.value
                  this.uploadFile(title)
                }} >
                <FormGroup>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                      input = 'text'
                      value = {this.state.name}
                      onChange = {this.updateName}
                      placeholder = "Enter name"
                      required />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Party Name</FormLabel>
                  <FormControl
                      input = 'textArea'
                      value = {this.state.party}
                      onChange = {this.updateParty}
                      placeholder = "Enter party name"
                      required  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Manifesto</FormLabel>
                  <FormControl
                      input = 'text'
                      value = {this.state.manifesto}
                      onChange = {this.updateManifesto}
                      placeholder = "Enter manifesto"
                      required />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Constituency Number</FormLabel>
                  <FormControl
                      input = 'text'
                      value = {this.state.constituency}
                      onChange = {this.updateConstituency}
                      placeholder = "Enter constituency number"
                      required />
                </FormGroup>  
                <FormGroup>
                  <FormLabel htmlFor = "myfile" className="btn btn-info btn-block">Upload a file</FormLabel>
                  <FormControl id = "myfile" type="file" accept=".pdf" onChange={this.captureFile} style={{display: "none"}} />
                  <p><FormText className="text-muted">Filename: {this.state.currentTitle ? this.state.currentTitle.name : ""}</FormText></p>
                  <p><FormText className="text-muted">File type: {this.state.currentTitle ? this.state.currentTitle.type : ""}</FormText></p>
                  <FormControl 
                    input='text'
                    id="fileTitle"
                    ref={(input) => {this.fileTitle = input }}
                    placeholder="Enter a name for the file"
                    required />
                </FormGroup>
                <Button variant="primary" type="submit">Add candidate</Button>
              </Form>  
              <div>Files List
                {fileList}
              </div>
            </div>
          </div>  
      </div>
      );
    }
}

export default AddCandidate;