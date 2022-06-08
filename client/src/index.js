import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import './custom.css';

import AddCandidate from './components/AddCandidate';
import CandidateDetails from './components/CandidateDetails';
import RequestVoter from './components/RequestVoter';
import VerifyVoter from './components/VerifyVoter';
import Vote from './components/Vote';
import Result from './components/Result';
import Admin from './components/Admin';
import Home from './components/Home';

import { HashRouter, Switch, Route } from 'react-router-dom';


ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route exact path = '/' component = {Home} />
            <Route exact path = '/AddCandidate' component = {AddCandidate} />
            <Route exact path = '/CandidateDetails' component = {CandidateDetails} />
            <Route exact path = '/RequestVoter' component = {RequestVoter} />
            <Route exact path = '/VerifyVoter' component = {VerifyVoter} />
            <Route exact path = '/Vote' component = {Vote} />
            <Route exact path = '/Result' component = {Result} />
            <Route exact path = '/Admin' component = {Admin} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
