import React, {Component} from 'react';
import {FormGroup, Label, ModalHeader, ModalBody, Modal, ModalFooter} from 'reactstrap';
import {
    TextField,
    InputLabel,
    FormControl,
    Fab,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { red } from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {NavLink} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";
import PaymentModal from "Components/Payment/PaymentModal";
import DeleteProfileModal from './DeleteProfileModal';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: "personalInfo",
            userInfo: {
                place_of_work: '',
                position: '',
                interest: '',
                email: '',
                created_at: '',
                first_name: '',
                last_name: '',
                gender: '',
                year_of_birth: '',
                country: '',
                address1: '',
                address2: '',
                suburb: '',
                state: '',
                postcode: '',
                referrer_by: '',
                extra_info: '',
                user_subscription: undefined,
                need_user_subscribe: false,
                payment_history: [],
                user_credit_history: []
            },
            birthday: '',
            interestList: [],
            placeOfWorkList: [],
            countryList: [],
            labelWidth: 50,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            showModalType: '',
            loading: true,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const that = this;
        Promise.all([
            Apis.userInfo(),
            Apis.userPositions(),
            Apis.userInterests(),
            Apis.userPlaceOfWorks(),
            Apis.countryList()
        ]).then(function (values) {
            that.setState({
                userInfo: values[0],
                positionList: values[1],
                interestList: values[2],
                placeOfWorkList: values[3],
                countryList: values[4],
                loading: false
            });
        }).catch(e => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });

    }

    onExpandeChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    onChangeData(key, value) {
        let userInfo = this.state.userInfo;
        userInfo[key] = value;
        this.setState({userInfo: {...userInfo}});
    }

    onChangeSelectData(key, data) {
        if (data === null) {
            this.onChangeData(key, '');
        } else if (typeof data === 'object' && !Array.isArray(data)) {
            this.onChangeData(key, data.value);
        } else if (typeof data === 'object' && Array.isArray(data)) {
            this.onChangeData(key, data.map((v) => v.value).join(','));
        }
    }

    onSaveProfile() {
        if(this.state.userInfo.first_name === '' || this.state.userInfo.last_name === '') {
            NotificationManager.error("Please input username");
            return;
        }
        this.setState({loading: true});
        Apis.userUpdate(this.state.userInfo).then(resp => {
            NotificationManager.success("User information was updated");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {
            this.setState({loading: false});
        })
    }

    onClickDeleteProfile() {
        this.setState({showModalType: 'deleteProfile'});
    }

    onShowPasswordChangeModal() {
        this.setState({
            showModalType: 'changePassword',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
    }

    onChangePassword(){
        if(this.state.currentPassword === '' || this.state.newPassword === '' || this.state.confirmNewPassword === '') {
            NotificationManager.error('Please input all data');
            return;
        }
        if(this.state.newPassword !== this.state.confirmNewPassword) {
            NotificationManager.error('Please confirm new password');
            return;
        }
        this.setState({showModalType: ''});
        Apis.changePassword(this.state.currentPassword, this.state.newPassword).then((resp) => {
            NotificationManager.success("Password changed");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {

        })

    }

    onDownloadInvoice(id) {
        Apis.paymentHistoryReceipt(id).then((result) => {
            if(result.url !== '') window.open(result.url, "_blank");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        });
    }

    onFinishSubscribe() {
        this.setState({showModalType: '', loading: true}, () => {
            this.getData();
        })
    }

    render() {
        if (!this.state.loading) {
            const countryOptions = this.state.countryList.map((v) => ({value: v.country_name, label: v.country_name}));
            const placeOfWorkOptions = this.state.placeOfWorkList.map(v => ({value: v.id, label: v.name}));
            const placeOfWorkDefault = this.state.userInfo.place_of_work === null ? [] : placeOfWorkOptions.filter((v) => this.state.userInfo.place_of_work.split(',').indexOf(v.value.toString()) !== -1);

            const positionOptions = this.state.positionList.map(v => ({value: v.id, label: v.name}));
            const positionDefault = positionOptions.find(v => v.value === this.state.userInfo.position);

            const interestOptions = this.state.interestList.map(v => ({value: v.id, label: v.name}));
            const interestDefault = this.state.userInfo.interest === null ? [] : interestOptions.filter((v) => this.state.userInfo.interest.split(',').indexOf(v.value.toString()) !== -1);
            return (
                <div>
                    <div className={'row m-0'}>
                        <RctCollapsibleCard
                            colClasses="col-sm-12 col-md-4 col-xl-4 b-100 w-xs-full"
                        >
                            <div className="">
                                <div className="p-0">
                                    <div className="p-20" style={{textAlign: 'center'}}>
                                        <div className="media-body pt-10">
                                            <h1 className="mb-5">{this.state.userInfo.email}</h1>
                                            <span className="text-muted fs-14"><i className="ti-time"/> {moment(this.state.userInfo.created_at).format('MMM Do YYYY, HH:mm:ss')}</span>
                                            <h3 className="mt-20 mb-5">Current Points: {this.state.userInfo.user_credit}</h3>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex justify-content-center mt-10">
                                            <Button variant="contained" className="btn-primary text-white" onClick={() => this.onShowPasswordChangeModal()}>
                                                <IntlMessages id="profile.changePassword" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RctCollapsibleCard>
                        <RctCollapsibleCard
                            colClasses="col-sm-12 col-md-8 col-xl-8 b-100 w-xs-full"
                        >
                            <ExpansionPanel expanded={this.state.expanded === 'personalInfo'} onChange={this.onExpandeChange('personalInfo')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}><IntlMessages id="profile.personalInformation" /></span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <TextField
                                        id="first-name"
                                        value={this.state.userInfo.first_name}
                                        onChange={(event) => this.onChangeData('first_name', event.target.value)}
                                        label={<IntlMessages id={"profile.firstName"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="last-name"
                                        value={this.state.userInfo.last_name}
                                        onChange={(event) => this.onChangeData('last_name', event.target.value)}
                                        label={<IntlMessages id={"profile.lastName"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <FormGroup row className={'mb-0'}>
                                        <Label style={{padding: '12px 25px 0px 13px', fontSize: 16}}><IntlMessages id={"profile.gender"}/>: </Label>
                                        <RadioGroup
                                            aria-label="position"
                                            name="position"
                                            value={this.state.userInfo.gender}
                                            onChange={(event) => this.onChangeData('gender', event.target.value)}
                                            row
                                        >
                                            <FormControlLabel
                                                value={''}
                                                control={<Radio/>}
                                                label={<IntlMessages id={"profile.position.notSpecified"}/>}
                                            />
                                            <FormControlLabel
                                                value={'female'}
                                                control={<Radio/>}
                                                label={<IntlMessages id={"profile.position.female"}/>}
                                            />
                                            <FormControlLabel
                                                value={'male'}
                                                control={<Radio/>}
                                                label={<IntlMessages id={"profile.position.male"}/>}
                                            />
                                        </RadioGroup>
                                    </FormGroup>
                                    <TextField
                                        id="birthday"
                                        value={this.state.userInfo.year_of_birth}
                                        onChange={(event) => this.onChangeData('year_of_birth', event.target.value)}
                                        label={<IntlMessages id={"profile.birthday"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'address'} onChange={this.onExpandeChange('address')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}><IntlMessages id={"profile.address"}/></span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <FormControl variant="outlined" fullWidth>
                                        <CustomInputLabel
                                            htmlFor="country"
                                            shrink
                                        >
                                            <IntlMessages id={"profile.country"}/>
                                        </CustomInputLabel>
                                        <ReactSelect
                                            id={'country'}
                                            defaultValue={{value: this.state.userInfo.country, label: this.state.userInfo.country}}
                                            // value={{ value: this.state.userInfo.country, label: this.state.userInfo.country }}
                                            placeholder={<IntlMessages id={"profile.selectCountry"}/>}
                                            options={countryOptions}
                                            onChange={(data) => this.onChangeSelectData('country', data)}
                                            styles={selectStyles}
                                        />
                                    </FormControl>

                                    <TextField
                                        id="address_line1"
                                        value={this.state.userInfo.address1}
                                        onChange={(event) => this.onChangeData('address1', event.target.value)}
                                        label={<IntlMessages id={"profile.addressLine1"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="address_line2"
                                        value={this.state.userInfo.address2}
                                        onChange={(event) => this.onChangeData('address2', event.target.value)}
                                        label={<IntlMessages id={"profile.addressLine2"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="suburb"
                                        value={this.state.userInfo.suburb}
                                        onChange={(event) => this.onChangeData('suburb', event.target.value)}
                                        label={<IntlMessages id={"profile.suburb"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="state"
                                        value={this.state.userInfo.state}
                                        onChange={(event) => this.onChangeData('state', event.target.value)}
                                        label={<IntlMessages id={"profile.state"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="postcode"
                                        value={this.state.userInfo.postcode}
                                        onChange={(event) => this.onChangeData('postcode', event.target.value)}
                                        label={<IntlMessages id={"profile.postcode"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'additional'} onChange={this.onExpandeChange('additional')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}><IntlMessages id={"profile.additionalInformation"}/></span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <FormControl variant="outlined" fullWidth>
                                        <CustomInputLabel
                                            htmlFor="placesOfWork"
                                            shrink
                                        >
                                            <IntlMessages id={"profile.placeOfWork"}/>
                                        </CustomInputLabel>
                                        <ReactSelect
                                            id={'places_of_Work'}
                                            defaultValue={placeOfWorkDefault}
                                            // value={[]}
                                            placeholder={<IntlMessages id={"profile.inputOption"}/>}
                                            isMulti
                                            options={placeOfWorkOptions}
                                            onChange={(data) => this.onChangeSelectData('place_of_work', data)}
                                            styles={selectStyles}
                                        />
                                    </FormControl>
                                    <FormControl variant="outlined" fullWidth>
                                        <CustomInputLabel
                                            htmlFor="position"
                                            shrink
                                        >
                                            <IntlMessages id={"profile.position"}/>
                                        </CustomInputLabel>
                                        <CreatableSelect
                                            id={'position'}
                                            defaultValue={positionDefault}
                                            // value={[]}
                                            placeholder={<IntlMessages id={"profile.selectPosition"}/>}
                                            options={positionOptions}
                                            onChange={(data) => this.onChangeSelectData('position', data)}
                                            styles={selectStyles}
                                        />
                                    </FormControl>
                                    <FormControl variant="outlined" fullWidth>
                                        <CustomInputLabel
                                            htmlFor="interest"
                                            shrink
                                        >
                                            <IntlMessages id={"profile.interests"}/>
                                        </CustomInputLabel>
                                        <CreatableSelect
                                            id={'interest'}
                                            defaultValue={interestDefault}
                                            // value={[]}
                                            placeholder={<IntlMessages id={"profile.selectInterests"}/>}
                                            options={interestOptions}
                                            onChange={(data) => this.onChangeSelectData('interest', data)}
                                            isMulti
                                            styles={selectStyles}
                                        />
                                    </FormControl>
                                    <TextField
                                        id="referred_by"
                                        value={this.state.userInfo.referrer_by}
                                        onChange={(event) => this.onChangeData('referrer_by', event.target.value)}
                                        label={<IntlMessages id={"profile.referredBy"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                    />
                                    <TextField
                                        id="extra_info"
                                        value={this.state.userInfo.extra_info}
                                        onChange={(event) => this.onChangeData('extra_info', event.target.value)}
                                        label={<IntlMessages id={"profile.extraInformation"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'payment'} onChange={this.onExpandeChange('payment')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}><IntlMessages id={"profile.subscriptions"}/></span>
                                    <SubscriptionButton
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        disabled={!this.state.userInfo.need_user_subscribe}
                                        onClick={(e) => this.setState({showModalType: 'subscription'})}
                                    >
                                        <IntlMessages id={"profile.subscribe"}/>
                                    </SubscriptionButton>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <div className={'d-flex justify-content-center'}>
                                        <table className="table table-middle table-hover mb-0 mobile-table">
                                            <thead>
                                            <tr>
                                                <th className="text-center"><IntlMessages id={"profile.subscriptionType"}/></th>
                                                <th className="text-center"><IntlMessages id={"profile.status"}/></th>
                                                <th className="text-center"><IntlMessages id={"profile.lastPayment"}/></th>
                                                <th className="text-center"><IntlMessages id={"profile.nextPayment"}/></th>
                                                <th className="text-center"><IntlMessages id={"profile.paymentMethod"}/></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.userInfo.user_subscription === undefined ? null :
                                                    <tr>
                                                        <td className="text-center" data-title={'Subscription Type'}>{this.state.userInfo.user_subscription.subscription_plans.name}</td>
                                                        <td className='text-center' data-title={'Status'}><span className='text-primary'>{this.state.userInfo.user_subscription.status}</span></td>
                                                        <td className="text-center" data-title={'Last Payment'}>{moment(this.state.userInfo.user_subscription.created_at).format('MMM Do YYYY, HH:mm:ss')}</td>
                                                        <td className="text-center" data-title={'Next Payment Due'}>{moment(this.state.userInfo.user_subscription.expire_at).format('MMM Do YYYY, HH:mm:ss')}</td>
                                                        <td className="text-center" data-title={'Payment Method'}>{this.state.userInfo.user_subscription.payment_type}</td>
                                                    </tr>
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </RctCollapsibleCard>
                        <RctCollapsibleCard
                            colClasses="col-sm-12 col-md-12 col-xl-6 b-100 w-xs-full"
                        >
                            <span className={'fs-17 fw-bold'}><IntlMessages id={"profile.billingHistory"}/></span>
                            <table className="table table-middle table-hover mb-0 mobile-table">
                                <thead>
                                <tr>
                                    <th className="text-center"><IntlMessages id={"profile.paymentType"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.description"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.total"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.paymentMethod"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.invoice"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.date"}/></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.userInfo.payment_history.map((v) => (
                                        <tr>
                                            <td className="text-center" data-title={'Type'}>{v.payment_history_type}</td>
                                            <td className="text-center" data-title={'Description'}>{v.payment_history_desc}</td>
                                            <td className="text-center" data-title={'Total'}>{v.payment_history_amount} {v.payment_history_currency}</td>
                                            <td className="text-center" data-title={'Payment Method'}>{v.payment_history_pay_type}</td>
                                            <td className="text-center" data-title={'Invoice'}>
                                                <NavLink to="#" replace onClick={() => this.onDownloadInvoice(v.id)}>
                                                    <Tooltip id="tooltip-icon" title="Download Invoice"><DescriptionOutlinedIcon /></Tooltip>
                                                </NavLink>
                                            </td>
                                            <td className="text-center" data-title={'Date'}>{moment(v.created_at).format('MMM Do YYYY, HH:mm:ss')}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </RctCollapsibleCard>
                        <RctCollapsibleCard
                            colClasses="col-sm-12 col-md-12 col-xl-6 b-100 w-xs-full"
                        >
                            <span className={'fs-17 fw-bold'}><IntlMessages id={"profile.creditHistory"}/></span>
                            <table className="table table-middle table-hover mb-0 mobile-table">
                                <thead>
                                <tr>
                                    <th className="text-center"><IntlMessages id={"profile.paymentType"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.description"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.total"}/></th>
                                    <th className="text-center"><IntlMessages id={"profile.date"}/></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.userInfo.user_credit_history.map((v) => (
                                        <tr>
                                            <td className="text-center" data-title={'Type'}>{v.credit_history_type}</td>
                                            <td className="text-center" data-title={'Description'}>{v.credit_history_desc}</td>
                                            <td className="text-center" data-title={'Total'}>{v.credit_history_amount} points</td>
                                            <td className="text-center" data-title={'Date'}>{moment(v.created_at).format('MMM Do YYYY, HH:mm:ss')}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </RctCollapsibleCard>
                    </div>
                    <div className={'d-flex justify-content-end mr-50'}>
                        <Fab variant="extended" color="primary" aria-label="add" className={'m-1 mr-70'} onClick={() => this.onSaveProfile()}>
                            <SaveIcon className={'mr-1'} />
                            <IntlMessages id={"profile.update"} />
                        </Fab>
                        <Fab variant="extended" aria-label="add" className={'m-1 btn-danger text-white'} onClick={() => this.onClickDeleteProfile()}>
                            <DeleteForeverIcon className={'mr-1'} />
                            <IntlMessages id={"profile.delete"} />
                        </Fab>
                    </div>
                    <Modal
                        isOpen={this.state.showModalType === 'changePassword'}
                        toggle={() => this.setState({showModalType: ''})}
                    >
                        <ModalHeader toggle={() => this.setState({showModalType: ''})}>
                            <IntlMessages id={"profile.changePassword"}/>
                        </ModalHeader>
                        <ModalBody>
                            <TextField
                                id="current_password"
                                value={this.state.currentPassword}
                                onChange={(event) => this.setState({currentPassword: event.target.value})}
                                label={<IntlMessages id={"profile.currentPassword"}/>}
                                className={'mb-10'}
                                type="password"
                                margin="dense"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                id="new_password"
                                value={this.state.newPassword}
                                onChange={(event) => this.setState({newPassword: event.target.value})}
                                label={<IntlMessages id={"profile.newPassword"}/>}
                                className={'mb-10'}
                                type="password"
                                margin="dense"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                id="confirm_password"
                                value={this.state.confirmNewPassword}
                                onChange={(event) => this.setState({confirmNewPassword: event.target.value})}
                                label={<IntlMessages id={"profile.confirmPassword"}/>}
                                className={'mb-10'}
                                type="password"
                                margin="dense"
                                variant="outlined"
                                fullWidth
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="contained"
                                color="primary"
                                className="text-white bg-primary"
                                onClick={() => this.onChangePassword()}
                            >
                                <IntlMessages id={"profile.change"}/>
                            </Button>
                            <Button
                                variant="contained"
                                className="btn-danger text-white bg-danger"
                                onClick={() => this.setState({showModalType: 'changePassword'})}
                            >
                                <IntlMessages id={"profile.cancel"}/>
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <DeleteProfileModal open={this.state.showModalType === 'deleteProfile'} onClose={() => this.setState({showModalType: ''})} />
                    {
                        this.state.showModalType === 'subscription' &&
                        <PaymentModal
                            type={'planSubscribe'}
                            onFinish={() => this.onFinishSubscribe()}
                            onClose={() => this.setState({showModalType: ''})}
                        />
                    }
                </div>
            )
        } else {
            return (<RctSectionLoader/>);
        }
    }
}

const selectStyles = {
    container: styles => ({...styles, marginBottom: 10}),
    control: styles => ({...styles, padding: 5}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        return {
            ...styles,
        };
    },
    menu: styles => ({...styles, zIndex: 5}),
};

const CustomInputLabel = withStyles(theme => ({
    shrink: {
        backgroundColor: 'white',
        paddingLeft: 2,
        paddingRight: 2,
    }
}))(InputLabel);

const SubscriptionButton = withStyles((theme) => ({
    root: {
        padding: '0 10px',
        marginLeft: 20,
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    },
}))(Button);