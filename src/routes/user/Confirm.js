/**
 * Sign Up With Firebase
 */
import React, {Component} from 'react';
import * as Apis from 'Api';
import SweetAlert from 'react-bootstrap-sweetalert'
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

export default class Confirm extends Component {
    constructor(props) {
        super(props);
        let url = new URL(window.location.href);
        const userId = url.searchParams.get("uid");
        const redirect = url.searchParams.get('redirect');
        const token = url.searchParams.get('token');
        if (userId === null || token === null) {
            this.props.history.replace('/');
        }
        this.state = {
            userId,
            redirect,
            token,
            success: false,
            fault: false
        };
    }

    componentDidMount() {
        Apis.userConfirm(this.state.userId, this.state.token).then((resp) => {
            this.setState({
                success: true
            });
        }).catch((e) => {
            this.setState({
                fault: true
            });
        });
    }

    render() {
        return (
            <div>
                <RctSectionLoader/>
                <SweetAlert success show={this.state.success} title="Successful" confirmBtnText={'continue'} onConfirm={() => this.props.history.replace('/')}>
                    Your email address has been successfully verified.
                </SweetAlert>
                <SweetAlert danger show={this.state.fault} title="Failed" confirmBtnText={'OK'} onConfirm={() => null}>
                    Email Verification failed.
                </SweetAlert>
            </div>
        );
    }
}