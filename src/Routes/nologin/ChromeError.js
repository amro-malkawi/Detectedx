import React, {Component} from 'react';
import {AppBar, Toolbar} from '@mui/material';

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
                <div className="mt-70">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-9 mx-auto">
                            <div className="error-body text-center">
                                <h1 className="oops mt-30" style={{fontSize: 120}}><i className="zmdi zmdi-info-outline"/></h1>
                                <h2 className="error-msg mb-0">Browser not supported</h2>
                                <div className="fs-18 mt-30">Please use Google Chrome, Firefox or Edge to access DetectED-X software</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
