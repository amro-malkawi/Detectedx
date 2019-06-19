/**
 * User Management Page
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

// api
import * as Apis from 'Api';

// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// add new user form
import AddNewUserForm from './AddNewUserForm';

// update user form
import UpdateUserForm from './UpdateUserForm';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            all: false,
            users: null, // initial user data
            selectedUser: null, // selected user to perform operations
            loading: false, // loading activity
            addNewUserModal: false, // add new user form modal
            addNewUserDetail: {
                title: '',
                first_name: '',
                last_name: '',
                gender: '',
                year_of_birth: '',
                email: '',
                password: '',
                confirm_password: '',
            },
            openViewUserDialog: false, // view user dialog box
            editUser: null,
            allSelected: false,
            selectedUsers: 0,
            currentPage: 1,
            totalPageCount: 0,
            totalItemCount: 0,
            itemsPerPage: 10,
        }
    }

    componentDidMount() {
        this.getUserList();
    }

    getUserList() {
        Apis.userList(this.state.currentPage).then((data) => {
            this.setState({
                loading: false,
                users: data.data,
                currentPage: data.meta.currentPage,
                totalPageCount: data.meta.totalPageCount,
                totalItemCount: data.meta.totalItemCount,
                itemsPerPage: data.meta.itemsPerPage,
            });
        }).catch(error => {
            // error hanlding
        })
    }

    /**
     * On Delete
     */
    onDelete(data) {
        this.refs.deleteConfirmationDialog.open();
        this.setState({selectedUser: data});
    }

    /**
     * Delete User Permanently
     */
    deleteUserPermanently() {
        const {selectedUser} = this.state;
        this.refs.deleteConfirmationDialog.close();
        this.setState({loading: true});
        let self = this;

        Apis.userDelete(selectedUser.id).then(resp => {
            NotificationManager.success('User Deleted!');
            this.getUserList();
        }).catch(error => {
            NotificationManager.error(error.message);
        }).finally(() => {
            self.setState({loading: false, selectedUser: null});
        });
    }

    /**
     * Open Add New User Modal
     */
    opnAddNewUserModal() {
        this.setState({addNewUserModal: true});
    }

    /**
     * On Reload
     */
    onReload() {
        this.setState({loading: true});
        this.getUserList();
    }

    /**
     * On Select User
     */
    onSelectUser(user) {
        user.checked = !user.checked;
        let selectedUsers = 0;
        let users = this.state.users.map(userData => {
            if (userData.checked) {
                selectedUsers++;
            }
            if (userData.id === user.id) {
                if (userData.checked) {
                    selectedUsers++;
                }
                return user;
            } else {
                return userData;
            }
        });
        this.setState({users, selectedUsers});
    }

    /**
     * On Change Add New User Details
     */
    onChangeAddNewUserDetails(key, value) {
        this.setState({
            addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value
            }
        });
    }

    /**
     * Add New User
     */
    addNewUser() {
        const { addNewUserDetail } = this.state;
        if (addNewUserDetail.email !== '' && addNewUserDetail.password !== '' && addNewUserDetail.password === addNewUserDetail.confirm_password ) {
            this.setState({addNewUserModal: false, loading: true});
            let self = this;
            Apis.userAdd(this.state.addNewUserDetail).then(resp => {
                NotificationManager.success('User Created!');
                this.getUserList();
            }).catch(error => {
                NotificationManager.error(error.message);
            }).finally(() => {
                self.setState({
                    loading: false,
                    addNewUserDetail: {
                        title: '',
                        first_name: '',
                        last_name: '',
                        gender: '',
                        year_of_birth: '',
                        email: '',
                        password: '',
                        confirm_password: '',
                    }
                });
            })
        } else {
            NotificationManager.error('Please input correct information')
        }
    }

    /**
     * View User Detail Hanlder
     */
    viewUserDetail(data) {
        this.setState({openViewUserDialog: true, selectedUser: data});
    }

    /**
     * On Edit User
     */
    onEditUser(user) {
        this.setState({addNewUserModal: true, editUser: user});
    }

    /**
     * On Add & Update User Modal Close
     */
    onAddUpdateUserModalClose() {
        this.setState({addNewUserModal: false, editUser: null})
    }

    /**
     * On Update User Details
     */
    onUpdateUserDetails(key, value) {
        this.setState({
            editUser: {
                ...this.state.editUser,
                [key]: value
            }
        });
    }

    /**
     * Update User
     */
    updateUser() {
        const {editUser} = this.state;
        if (editUser.email !== '' && editUser.password !== '' && editUser.password === editUser.confirm_password ) {
            let indexOfUpdateUser = '';
            let users = this.state.users;
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.id === editUser.id) {
                    indexOfUpdateUser = i
                }
            }
            users[indexOfUpdateUser] = editUser;
            this.setState({loading: true, editUser: null, addNewUserModal: false});
            let self = this;
            Apis.userUpdate(editUser.id, editUser).then(resp => {
                NotificationManager.success('User Updated!');
                this.getItemList();
            }).catch(error => {
                NotificationManager.error(error.message);
            }).finally(() => {
                self.setState({users, loading: false});
            });
        } else {
            NotificationManager.error('Please input correct information');
        }
    }

    //Select All user
    onSelectAllUser(e) {
        const {selectedUsers, users} = this.state;
        let selectAll = selectedUsers < users.length;
        if (selectAll) {
            let selectAllUsers = users.map(user => {
                user.checked = true
                return user
            });
            this.setState({users: selectAllUsers, selectedUsers: selectAllUsers.length})
        } else {
            let unselectedUsers = users.map(user => {
                user.checked = false
                return user;
            });
            this.setState({selectedUsers: 0, users: unselectedUsers});
        }
    }

    onChangePage(selectedPage) {
        this.setState({currentPage: selectedPage}, () => {
            this.getUserList();
        });
    }

    render() {
        const {users, loading, selectedUser, editUser, allSelected, selectedUsers} = this.state;
        return (
            <div className="user-management">
                <Helmet>
                    <title>Users Management</title>
                    <meta name="description" content=""/>
                </Helmet>
                <PageTitleBar
                    title={"Users"}
                    match={this.props.match}
                    enableBreadCrumb={false}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                            <div>
                                <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                            </div>
                            <div>
                                <a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10">Export to Excel</a>
                                <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">Add New User <i
                                    className="zmdi zmdi-plus"></i></a>
                            </div>
                        </div>
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                            <tr>
                                <th className="w-5">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                indeterminate={selectedUsers > 0 && selectedUsers < users.length}
                                                checked={selectedUsers > 0}
                                                onChange={(e) => this.onSelectAllUser(e)}
                                                value="all"
                                                color="primary"
                                            />
                                        }
                                        label="All"
                                    />
                                </th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users && users.map((user, key) => (
                                <tr key={key}>
                                    <td>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={user.checked !== undefined && user.checked}
                                                    onChange={() => this.onSelectUser(user)}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </td>
                                    <td>{user.id}</td>
                                    <td>{user.first_name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{moment(user.created_at).format('MMMM Do YYYY, HH:mm:ss')}</td>
                                    <td className="list-action">
                                        <a href="javascript:void(0)" onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a>
                                        <a href="javascript:void(0)" onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                                        <a href="javascript:void(0)" onClick={() => this.onDelete(user)}><i className="ti-close"></i></a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="border-top">
                            <tr>
                                <td colSpan="100%">
                                    <PaginationComponent
                                        totalItems={this.state.totalItemCount}
                                        pageSize={this.state.itemsPerPage}
                                        onSelect={this.onChangePage.bind(this)}
                                        maxPaginationNumbers={7}
                                        activePage={this.state.currentPage}
                                        />
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    {loading &&
                    <RctSectionLoader/>
                    }
                </RctCollapsibleCard>
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialog"
                    title="Are You Sure Want To Delete?"
                    message="This will delete user permanently."
                    onConfirm={() => this.deleteUserPermanently()}
                />
                <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()} size="lg">
                    <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                        {editUser === null ?
                            'Add New User' : 'Update User'
                        }
                    </ModalHeader>
                    <ModalBody>
                        {editUser === null ?
                            <AddNewUserForm
                                addNewUserDetails={this.state.addNewUserDetail}
                                onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                            />
                            : <UpdateUserForm user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)}/>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {editUser === null ?
                            <Button variant="contained" className="text-white btn-success" onClick={() => this.addNewUser()}>Add</Button>
                            : <Button variant="contained" color="primary" className="text-white" onClick={() => this.updateUser()}>Update</Button>
                        }
                        {' '}
                        <Button variant="contained" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Dialog
                    onClose={() => this.setState({openViewUserDialog: false})}
                    open={this.state.openViewUserDialog}
                >
                    <DialogContent>
                        {selectedUser !== null &&
                        <div>
                            <div className="clearfix d-flex">
                                <div className="media pull-left">
                                    <div className="media-body">
                                        <p>Email: <span className="fw-bold">{selectedUser.email}</span></p>
                                        <p>Type: <span className="badge badge-warning">{selectedUser.type}</span></p>
                                        <p>Created At: <span className="fw-bold">{moment(selectedUser.created_at).format('MMMM Do YYYY, HH:mm:ss')}</span></p>
                                        <p>Updated At: <span className="fw-bold">{moment(selectedUser.updated_at).format('MMMM Do YYYY, HH:mm:ss')}</span></p>
                                        <p>First Name: <span className="fw-bold">{selectedUser.first_name}</span></p>
                                        <p>Last Name: <span className="fw-bold">{selectedUser.last_name}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
