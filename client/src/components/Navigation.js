import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('dotenv').config();

class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top nav-padding-right">
                <div className="navbar-header">
                    <p className="navbar-brand">{process.env.REACT_APP_WEBSITE_NAME}</p>
                </div>
                <ul className="nav navbar-nav">
                    <li className="active"><Link to = '/' className = "heading">Home</Link></li>
                    <li><Link to = '/CandidateDetails'>Candidates</Link></li>
                    <li><Link to = '/RequestVoter'>Apply for voter</Link></li>
                    <li><Link to = '/Vote'>Vote</Link></li>
                </ul>
            </nav>
        );
    }
}

export default Navigation;