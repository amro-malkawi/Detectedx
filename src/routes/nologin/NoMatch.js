import React, {Component} from 'react';
import {Button, AppBar, Toolbar} from '@mui/material';
import {Link} from 'react-router-dom';

export default class NotFound extends Component {
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
                                <h2 className="oops">Oops.. </h2>
                                <h2 className="bold mb-0">404</h2>
                                <h2 className="error-msg mb-30">Sorry, page not found</h2>
                                <Button component={Link} to="/" variant="text" color={'info'} size={"large"}>Go To Home Page</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
