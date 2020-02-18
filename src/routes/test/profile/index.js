import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    Form,
    FormGroup,
    Label,
    Input, ModalHeader, ModalBody, Modal, ModalFooter,
} from 'reactstrap';
import {
    TextField,
    OutlinedInput,
    FilledInput,
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
    Fab,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {withStyles} from '@material-ui/core/styles';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import moment from 'moment';

const countryList = require('./country');

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
                user_order: [],
            },
            birthday: '',
            interestList: [],
            placeOfWorkList: [],
            labelWidth: 50,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            showChangePasswordModal: false,
            loading: true,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const that = this;
        let promise0 = new Promise(function (resolve, reject) {
            Apis.userInfo().then(resp => {
                resolve(resp);
            }).catch((e) => {
                reject(e);
            });
        });
        let promise1 = new Promise(function (resolve, reject) {
            Apis.userPositions().then(resp => {
                resolve(resp);
            }).catch(e => {
                reject(e);
            });
        });
        let promise2 = new Promise(function (resolve, reject) {
            Apis.userInterests().then(resp => {
                resolve(resp);
            }).catch(e => {
                reject(e);
            });
        });
        let promise3 = new Promise(function (resolve, reject) {
            Apis.userPlaceOfWorks().then(resp => {
                resolve(resp);
            }).catch(e => {
                reject(e);
            });
        });
        Promise.all([promise0, promise1, promise2, promise3]).then(function (values) {
            that.setState({
                userInfo: values[0],
                positionList: values[1],
                interestList: values[2],
                placeOfWorkList: values[3],
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

    onSaveData() {
        this.setState({loading: true});
        Apis.userUpdate(this.state.userInfo).then(resp => {
            NotificationManager.success("User information was updated");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {
            this.setState({loading: false});
        })
    }

    onShowPasswordChangeModal() {
        this.setState({
            showChangePasswordModal: true,
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
        this.setState({showChangePasswordModal: false});
        Apis.changePassword(this.state.currentPassword, this.state.newPassword).then((resp) => {
            NotificationManager.success("Password changed");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {

        })

    }
    render() {
        if (!this.state.loading) {
            const countryOptions = countryList.map((v) => ({value: v.country, label: v.country}));
            const placeOfWorkOptions = this.state.placeOfWorkList.map(v => ({value: v.id, label: v.name}));
            const placeOfWorkDefault = this.state.userInfo.place_of_work === null ? [] : placeOfWorkOptions.filter((v) => this.state.userInfo.place_of_work.split(',').indexOf(v.value.toString()) !== -1);

            const positionOptions = this.state.positionList.map(v => ({value: v.id, label: v.name}));
            const positionDefault = positionOptions.find(v => v.value === this.state.userInfo.position);

            const interestOptions = this.state.interestList.map(v => ({value: v.id, label: v.name}));
            const interestDefault = this.state.userInfo.interest === null ? [] : interestOptions.filter((v) => this.state.userInfo.interest.split(',').indexOf(v.value.toString()) !== -1);
            return (
                <div>
                    <div className={'row'}>
                        <RctCollapsibleCard
                            colClasses="col-sm-4 col-md-4 col-xl-4 b-100 w-xs-full"
                        >
                            <div className="">
                                <div className="p-0">
                                    <div className="p-20" style={{textAlign: 'center'}}>
                                        <div className="media-body pt-10">
                                            <h1 className="mb-5">{this.state.userInfo.email}</h1>
                                            <span className="text-muted fs-14"><i className="ti-time"/> {moment(this.state.userInfo.created_at).format('MMMM Do YYYY, HH:mm:ss')}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex justify-content-center mt-10">
                                            <Button variant="contained" className="btn-primary text-white" onClick={() => this.onShowPasswordChangeModal()}>
                                                Change Password
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RctCollapsibleCard>
                        <RctCollapsibleCard
                            colClasses="col-sm-8 col-md-8 col-xl-8 b-100 w-xs-full"
                        >
                            <ExpansionPanel expanded={this.state.expanded === 'personalInfo'} onChange={this.onExpandeChange('personalInfo')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}>Personal Information</span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <TextField
                                        id="first-name"
                                        value={this.state.userInfo.first_name}
                                        onChange={(event) => this.onChangeData('first_name', event.target.value)}
                                        label="First Name"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="last-name"
                                        value={this.state.userInfo.last_name}
                                        onChange={(event) => this.onChangeData('last_name', event.target.value)}
                                        label="Last Name"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <FormGroup row className={'mb-0'}>
                                        <Label style={{padding: '12px 25px 0px 13px', fontSize: 16}}>Gender: </Label>
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
                                                label={'Not Specified'}
                                            />
                                            <FormControlLabel
                                                value={'female'}
                                                control={<Radio/>}
                                                label={'Female'}
                                            />
                                            <FormControlLabel
                                                value={'male'}
                                                control={<Radio/>}
                                                label={'Male'}
                                            />
                                        </RadioGroup>
                                    </FormGroup>
                                    <TextField
                                        id="birthday"
                                        value={this.state.userInfo.year_of_birth}
                                        onChange={(event) => this.onChangeData('year_of_birth', event.target.value)}
                                        label="Birthday"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'address'} onChange={this.onExpandeChange('address')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}>Address</span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <FormControl variant="outlined" fullWidth>
                                        <CustomInputLabel
                                            htmlFor="country"
                                            shrink
                                        >
                                            Country
                                        </CustomInputLabel>
                                        <ReactSelect
                                            id={'country'}
                                            defaultValue={{value: this.state.userInfo.country, label: this.state.userInfo.country}}
                                            // value={{ value: this.state.userInfo.country, label: this.state.userInfo.country }}
                                            placeholder={'Select Country'}
                                            options={countryOptions}
                                            onChange={(data) => this.onChangeSelectData('country', data)}
                                            styles={selectStyles}
                                        />
                                    </FormControl>

                                    <TextField
                                        id="address_line1"
                                        value={this.state.userInfo.address1}
                                        onChange={(event) => this.onChangeData('address1', event.target.value)}
                                        label="Address line1"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="address_line2"
                                        value={this.state.userInfo.address2}
                                        onChange={(event) => this.onChangeData('address2', event.target.value)}
                                        label="Address line2"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="suburb"
                                        value={this.state.userInfo.suburb}
                                        onChange={(event) => this.onChangeData('suburb', event.target.value)}
                                        label="Suburb"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="state"
                                        value={this.state.userInfo.state}
                                        onChange={(event) => this.onChangeData('state', event.target.value)}
                                        label="State"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <TextField
                                        id="postcode"
                                        value={this.state.userInfo.postcode}
                                        onChange={(event) => this.onChangeData('postcode', event.target.value)}
                                        label="Postcode"
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'additional'} onChange={this.onExpandeChange('additional')}>
                                <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"/>}>
                                    <span className={'fs-17 fw-bold'}>Additional Information</span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <FormControl variant="outlined" fullWidth>
                                        <CustomInputLabel
                                            htmlFor="placesOfWork"
                                            shrink
                                        >
                                            Places of work
                                        </CustomInputLabel>
                                        <ReactSelect
                                            id={'places_of_Work'}
                                            defaultValue={placeOfWorkDefault}
                                            // value={[]}
                                            placeholder={'Input Options'}
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
                                            Position
                                        </CustomInputLabel>
                                        <CreatableSelect
                                            id={'position'}
                                            defaultValue={positionDefault}
                                            // value={[]}
                                            placeholder={'Select position'}
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
                                            Interests
                                        </CustomInputLabel>
                                        <CreatableSelect
                                            id={'interest'}
                                            defaultValue={interestDefault}
                                            // value={[]}
                                            placeholder={'Select interests'}
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
                                        label="Referred By"
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
                                        label="Extra information"
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
                                    <span className={'fs-17 fw-bold'}>Subscriptions</span>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: 'block'}}>
                                    <div className={'d-flex justify-content-center'}>
                                        <table className="table table-middle table-hover mb-0">
                                            <thead>
                                            <tr>
                                                <th className="text-center">Subscription Type</th>
                                                <th className="text-center">Last Payment</th>
                                                <th className="text-center">Next Payment Due</th>
                                                <th className="text-center">Payment Method</th>
                                                <th className="text-center"/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.userInfo.user_order.length === 0 ? null :
                                                    <tr>
                                                        <td className="text-center">{this.state.userInfo.user_order[0].product_plans.name} Plan</td>
                                                        <td className="text-center">{moment(this.state.userInfo.user_order[0].created_at).format('MMMM Do YYYY, HH:mm:ss')} Plan</td>
                                                        <td className="text-center">{moment(this.state.userInfo.user_order[0].expire_at).format('MMMM Do YYYY, HH:mm:ss')}</td>
                                                        <td className="text-center">{this.state.userInfo.user_order[0].payment_type}</td>
                                                        <td />
                                                    </tr>
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </RctCollapsibleCard>
                        <RctCollapsibleCard
                            colClasses="col-sm-12 col-md-12 col-xl-12 b-100 w-xs-full"
                        >
                            <span className={'fs-17 fw-bold'}>Billing History</span>
                            <table className="table table-middle table-hover mb-0">
                                <thead>
                                <tr>
                                    <th className="text-center">Date</th>
                                    <th className="text-center">Description</th>
                                    <th className="text-center">Payment Method</th>
                                    <th className="text-center">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.userInfo.user_order.map((v, i) => (
                                        <tr key={i}>
                                            <td className="text-center">{moment(v.created_at).format('MMMM Do YYYY, HH:mm:ss')}</td>
                                            <td className="text-center">{v.product_plans.name} Plan</td>
                                            <td className="text-center">{v.payment_type}</td>
                                            <td className="text-center">{v.amount} AUD</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </RctCollapsibleCard>
                    </div>
                    <div className={'d-flex justify-content-center'}>
                        <Fab variant="extended" color="primary" aria-label="add" className={'m-1'} onClick={() => this.onSaveData()}>
                            <SaveIcon className={'mr-1'} />
                            Update
                        </Fab>
                    </div>
                    <Modal
                        isOpen={this.state.showChangePasswordModal}
                        toggle={() => this.setState({showChangePasswordModal: false})}
                    >
                        <ModalHeader toggle={() => this.setState({showChangePasswordModal: false})}>
                            Change Password
                        </ModalHeader>
                        <ModalBody>
                            <TextField
                                id="current_password"
                                value={this.state.currentPassword}
                                onChange={(event) => this.setState({currentPassword: event.target.value})}
                                label="Current Password"
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
                                label="New Password"
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
                                label="Confirm Password"
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
                                Change
                            </Button>
                            <Button
                                variant="contained"
                                className="btn-danger text-white bg-danger"
                                onClick={() => this.setState({showChangePasswordModal: false})}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
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