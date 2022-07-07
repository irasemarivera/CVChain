import React from 'react';
import ReactDOM from 'react-dom';
import './custom.css';

import RegisterCandidate from './components/RegisterCandidate';
import MyExperiences from './components/MyExperiences';
import MyCV from './components/MyCV';
import AddExperience from './components/AddExperience';
import Universities from './components/Universities';
import Employeers from './components/Employeers';
import AddVerifier from './components/AddVerifier';
import Recruiters from './components/Recruiters';
import AddRecruiter from './components/AddRecruiter';
import CandidatesToVerify from './components/CandidatesToVerify';
import ExperiencesToVerify from './components/ExperiencesToVerify';
import Configuration from './components/Configuration';
import ViewCV from './components/ViewCV';
import Home from './components/Home';

import { HashRouter, Switch, Route } from 'react-router-dom';

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route exact path = '/' component = {Home} />
            <Route exact path = '/RegisterCandidate' component = {RegisterCandidate} />
            <Route exact path = '/MyExperiences' component = {MyExperiences} />
            <Route exact path = '/MyCV' component = {MyCV} />
            <Route exact path = '/AddExperience' component = {AddExperience} />
            <Route exact path = '/Universities' component = {Universities} />
            <Route exact path = '/Employeers' component = {Employeers} />
            <Route exact path = '/AddVerifier' component = {AddVerifier} />
            <Route exact path = '/Recruiters' component = {Recruiters} />
            <Route exact path = '/AddRecruiter' component = {AddRecruiter} />
            <Route exact path = '/CandidatesToVerify' component = {CandidatesToVerify} />
            <Route exact path = '/ExperiencesToVerify' component = {ExperiencesToVerify} />
            <Route exact path = '/Configuration' component = {Configuration} />
            <Route exact path = '/ViewCV' component = {ViewCV} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
