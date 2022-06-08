import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('dotenv').config();

class NavigationAdmin extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top nav-padding-right">
                <div className="navbar-header">
                    <p className="navbar-brand">{process.env.REACT_APP_WEBSITE_NAME} [Admin] </p>
                </div>
                <ul className="nav navbar-nav navbar-right">
                    <li className="active"><Link to = '/' className = "heading">Home</Link></li>
                    <li><Link to = '/CandidateDetails'>Candidates</Link></li>
                    <li><Link to = '/RequestVoter'>Apply for voter</Link></li>
                    <li><Link to = '/Vote'>Vote</Link></li>
                    <li><Link to = '/VerifyVoter'>Verify voter</Link></li>
                    <li><Link to = '/AddCandidate'>Add candidate</Link></li>
                    <li><Link to = '/Result'>Results</Link></li>
                    <li><Link to = '/Admin'>Start/End</Link></li>
                </ul>
            </nav>
        );
    }
}

export default NavigationAdmin;