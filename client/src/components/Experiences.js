import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import MainContract from "../abi/CandidateContract.json";
import VerifiersContract from "../abi/RecruitersVerifiersContract.json";
import getWeb3 from "../getWeb3";

import NavigationRegisteredCandidate from './NavigationRegisteredCandidate';
import Footer from './Footer';

class Experiences extends Component {
  constructor(props) {
    console.log(props);
    super(props)
      if (props.state) {
        this.state = props.state;
      } else {
        this.state = {
          instance: undefined,
          account: null,
          web3: null,
        }
      }
      console.log(this.state);
  }

  render() {
    let academicExperiencesCount = 0;
    let academicExperienceList;
    if(this.state.academicExperienceList){
      academicExperienceList = this.state.academicExperienceList.map((academicExperience, key) => {
        return (
          <tr key={key}>
            <td>{++academicExperiencesCount}</td>
            <td><a href={`https://ipfs.infura.io/ipfs/${academicExperience.hash}`} target="_blank">{academicExperience.title}</a></td>
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
            <td><a href={`https://ipfs.infura.io/ipfs/${professionalExperience.hash}`} target="_blank">{professionalExperience.title}</a></td>
            <td>{professionalExperience.isVerified ? <span className="label label-success">Verificado</span> : <span className="label label-default">Pendiente</span>}</td>
            <td>{professionalExperience.verifier}</td>
            <td>{professionalExperience.isVerified ? new Date(professionalExperience.verificationDate*1000).toLocaleString() : "-"}</td>
          </tr>
        );
      });
    }
    let buttonAddAcademicExperience;
    if (this.state.page == "MyExperiences"){
      buttonAddAcademicExperience = <Link to = {{pathname: "/AddExperience", state: this.state, search: "academic"}}><Button type = "button">Nueva experiencia</Button></Link>
    } else{
      buttonAddAcademicExperience = <p>&nbsp;</p>
    }
    let buttonAddProfessionalExperience;
    if (this.state.page == "MyExperiences"){
      buttonAddProfessionalExperience = <Link to = {{pathname: "/AddExperience", state: this.state, search: "professional"}}><Button type = "button">Nueva experiencia</Button></Link>
    } else{
      buttonAddProfessionalExperience = <p>&nbsp;</p>
    }
    let space;
    if (this.state.page == "MyExperiences"){
      space = <div className="row"><p>&nbsp;</p><p>&nbsp;</p></div>
    } else{
      space = "";
    }
      return (
        <div className = "container-fluid">  
          <div className = "container"> 
            <div className="row">
              <div className="col-sm-10"><h3>Experiencias Académicas</h3></div>
              <div className="col-sm-2">{buttonAddAcademicExperience}</div>
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
            {space}
            <div className="row">
              <div className="col-sm-10"><h3>Experiencias Profesionales</h3></div>
              <div className="col-sm-2">{buttonAddProfessionalExperience}</div>
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
        </div>
      );
  }
}

export default Experiences;