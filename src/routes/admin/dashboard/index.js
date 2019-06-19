/**
 * Test sets Management Page
 */
import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge
} from 'reactstrap';
import PaginationComponent from "Components/PaginationComponent";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {NotificationManager} from 'react-notifications';
import moment from 'moment';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';


// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

export default class TestSets extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="item-management">
                <Helmet>
                    <title>Dashborad</title>
                    <meta name="description" content=""/>
                </Helmet>
                <PageTitleBar
                    title={"Dashboard"}
                    match={this.props.match}
                    enableBreadCrumb={false}
                />
                <RctCollapsibleCard fullBlock>

                </RctCollapsibleCard>
            </div>
        );
    }
}
