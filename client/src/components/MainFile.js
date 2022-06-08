import React, { Component } from 'react';
import { Form, FormLabel, FormGroup, FormControl, Button } from 'react-bootstrap';

class MainFile extends Component {

  render() {
    return (
      <div className="container-fluid">
        <div>
          <form onSubmit={(event) => {
              event.preventDefault()
              const title = this.fileTitle.value
              this.props.uploadFile(title)
            }} >

                <FormGroup>
                  <FormLabel>Upload file</FormLabel>
                  <FormControl type="file" accept=".pdf" onChange={this.props.captureFile}/>
                  <FormControl type="text"
                    id="fileTitle"
                    ref={(input) => { this.fileTitle = input }}
                    className="form-control-sm"
                    placeholder="Assign a name to the file"
                    required />
                </FormGroup>
                <Button variant="primary" type="submit">Submit</Button>
            </form>
            { this.props.files.map((file, key) => {
              return(
                  <div className="card mb-4 text-center hover-overlay bg-secondary mx-auto" key={key} >
                    <div className="card-title bg-dark">
                        <a href={`https://ipfs.infura.io/ipfs/${file.hash}`}>{file.title}</a>
                    </div>
                  </div>
                )
            })}
          </div>
        </div>
    );
  }
}

export default MainFile;