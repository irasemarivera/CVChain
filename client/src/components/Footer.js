import React, { Component } from "react";

class Footer extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-bottom nav-padding-right">
                <ul className="nav navbar-nav navbar-right">
                    <p className="navbar-text">{process.env.REACT_APP_WEBSITE_NAME}. Made with ♥ by <a href="https://github.com/irasemarivera/CVChain" title="Mi GitHub">Irasema Rivera</a></p>
                </ul>
            </nav>
        );
    }
}

export default Footer;