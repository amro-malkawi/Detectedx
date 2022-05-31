import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import {Link} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

export default class ChromeError extends Component {
    render() {
        return (
            <div className="error-wrapper" key="1">
                <AppBar position="static" className="session-header">
                    <Toolbar>
                        <div className="container">
                            <div className="d-flex justify-content-between">
                                <div className="session-logo">
                                    <a href="https://www.detectedx.com">
                                        <img src={require('Assets/img/main/header_logo.png')} alt="session-logo" className="img-fluid" width="150"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="session-inner-wrapper">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-9 mx-auto">
                            <div className="error-body text-center">
                                <h1 className="oops mt-30" style={{fontSize: 120}}><i className="zmdi zmdi-info-outline"/></h1>
                                <h2 className="error-msg mb-0">Browser not supported</h2>
                                <h3 className=" mt-30">Please use Google Chrome, Firefox or Edge to access DetectED-X software</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
