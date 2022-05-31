import React, {Component} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

export default class ErrorBoundary extends Component {
    constructor(props){
        super(props)
        this.state = { error: null, errorInfo: null }
    }

    // For this example we'll just use componentDidCatch, this is only
    // here to show you what this method would look like.
    // static getDerivedStateFromProps(error){
    // return { error: true }
    // }

    componentDidCatch(error, info){
        this.setState({ error: error, errorInfo: info })
    }

    render() {
        if(this.state.errorInfo){
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
                                    <h2 className="oops">Oops.. </h2>
                                    <h2 className="error-msg mt-20 mb-20">An Error Occurred</h2>
                                    <h2 className="error-desc-msg mb-70">
                                        Something is broken. Please let us know what you were doing when this error occurred.
                                        We will fix it as soon as possible. Sorry for any inconvenience caused.
                                    </h2>
                                    <Button onClick={() => window.location.reload()} variant="contained" className="btn-light btn-lg">Try again</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
