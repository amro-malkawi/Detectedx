/**
 * Sign Up With Firebase
 */
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
// app config
import AppConfig from 'Constants/AppConfig';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";

export default class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.match.params.user_id,
            loading: false,
        };
        this.onCheckVerify();
    }

    onCheckVerify() {
        Apis.checkEmailStatus(this.state.userId).then((resp) => {
            if(!resp.result) {
                this.props.history.replace('/signin');
            }
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        })
    }

    onResendEmail() {
        this.setState({loading: true});
        Apis.userVerify(this.state.userId).then((resp) => {
            NotificationManager.success('Resend email. Please check again');
        }).catch((e) => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {
            this.setState({loading: false});
        });
    }

    render() {
        const {loading} = this.state;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    {loading &&
                    <LinearProgress/>
                    }
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <Link to="/">
                                            <img src={AppConfig.appLogo} alt="session-logo" width="110" height="35"/>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/signin" className="mr-15 text-white"><IntlMessages id={"user.alreadyAccount"} /></Link>
                                        <Button
                                            component={Link}
                                            to="/signin"
                                            variant="contained"
                                            className="btn-light"
                                        >
                                            <IntlMessages id={"user.signin"}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-12 col-md-8 col-lg-7" style={{margin: 'auto'}}>
                                    <div className="session-body text-center">
                                        <div className="session-head mb-15">
                                            <h2><IntlMessages id={"user.sentEmail.title"}/></h2>
                                            <p><IntlMessages id={"user.sentEmail.checkTime"} /></p>
                                        </div>
                                        <div>
                                            <img className={'mt-20 mb-20'} src={require('Assets/img/inbox.png')} width={170} height={170} alt={''}/>
                                            <div>
                                                <span><IntlMessages id={"user.sentEmail.clickLink"}/></span>
                                            </div>
                                            <div>
                                                <span><IntlMessages id={"user.sentEmail.checkSpamBox"}/></span>
                                            </div>
                                        </div>
                                        <Button component="span" disabled={this.state.loading} className={'mt-20 mb-20'} style={{color: '#0D47A1'}} onClick={() => this.onResendEmail()}>
                                            <IntlMessages id={"user.sentEmail.resend"}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </QueueAnim>
        );
    }
}