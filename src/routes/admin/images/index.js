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

// api
import * as Apis from 'Api';

// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// add new form
import AddNewForm from './AddNewForm';

// update form
import UpdateForm from './UpdateForm';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

export default class TestSets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            all: false,
            items: null, // initial item data
            selectedItem: null, // selected item to perform operations
            loading: false, // loading activity
            addNewItemModal: false, // add new item form modal
            addNewItemDetail: {
                test_case_id: '',
                position: '',
                dicom_file: '',
                truth: [],
            },
            openViewItemDialog: false, // view item dialog box
            editItem: null,
            allSelected: false,
            selectedItems: 0,
            testCasesList: [],
            ratingScalesList: [],
            lesionTypesList: [],
            currentPage: 1,
            totalPageCount: 0,
            totalItemCount: 0,
            itemsPerPage: 10,
        }
    }

    componentDidMount() {
        this.getItemList();
        this.getTestCasesList();
        this.getRatingScalesList();
        this.getLesionTypesList();
    }

    getItemList() {
        Apis.imagesList(this.state.currentPage).then((data) => {
            this.setState({
                loading: false,
                items: data.data,
                currentPage: data.meta.currentPage,
                totalPageCount: data.meta.totalPageCount,
                totalItemCount: data.meta.totalItemCount,
                itemsPerPage: data.meta.itemsPerPage,
            });
        }).catch(error => {
            // error hanlding
        });
    }

    getTestCasesList() {
        Apis.testCasesList().then((data) => {
            this.setState({
                testCasesList: data,
            });
        }).catch(error => {
            // error hanlding
        })
    }

    getRatingScalesList() {
        Apis.ratingScalesList().then((data) => {
            this.setState({
                ratingScalesList: data,
            });
        }).catch(error => {
            // error hanlding
        })
    }

    getLesionTypesList() {
        Apis.lesionTypesList().then((data) => {
            this.setState({
                lesionTypesList: data,
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
        this.setState({selectedItem: data});
    }

    /**
     * Delete Item Permanently
     */
    deleteItemPermanently() {
        const {selectedItem} = this.state;
        this.refs.deleteConfirmationDialog.close();
        this.setState({loading: true});
        let self = this;

        Apis.imagesDelete(selectedItem.id).then(resp => {
            NotificationManager.success('Item Deleted!');
            this.getItemList();
        }).catch(error => {
            NotificationManager.error(error.message);
        }).finally(() => {
            self.setState({loading: false, selectedItem: null});
        });
    }

    /**
     * Open Add New Item Modal
     */
    opnAddNewItemModal() {
        this.setState({addNewItemModal: true});
    }

    /**
     * On Reload
     */
    onReload() {
        this.setState({loading: true});
        this.getItemList();
    }

    /**
     * On Select Item
     */
    onSelectItem(item) {
        item.checked = !item.checked;
        let selectedItems = 0;
        let items = this.state.items.map(itemData => {
            if (itemData.checked) {
                selectedItems++;
            }
            if (itemData.id === item.id) {
                if (itemData.checked) {
                    selectedItems++;
                }
                return item;
            } else {
                return itemData;
            }
        });
        this.setState({items, selectedItems});
    }

    /**
     * On Change Add New Item Details
     */
    onChangeAddNewItemDetails(key, value) {
        this.setState({
            addNewItemDetail: {
                ...this.state.addNewItemDetail,
                [key]: value
            }
        });
    }

    /**
     * Add New Item
     */
    async addNewItem() {
        const { addNewItemDetail } = this.state;
        //check add param
        let hasError = false;
        if (addNewItemDetail.test_case_id === '' || addNewItemDetail.dicom_file === '') {
            hasError = true;
        } else {
            addNewItemDetail.truth.forEach((v) => {
               if(v.rating_scale_id === '') hasError = true;
               v.lesion_type.forEach((l) => {
                   if(l === '') hasError = true;
               })
            });
        };

        if (!hasError) {
            this.setState({addNewItemModal: false, loading: true});
            let self = this;
            try{
                const imageObj = await Apis.dicomImagesUpload(addNewItemDetail);
                debugger
                addNewItemDetail.truth.forEach((v) => {
                    v.image_id = imageObj.id;
                });

                const truthResult = await Apis.truthsBatchAdd(addNewItemDetail.truth);
                let lesionTypeTruths = [];
                truthResult.forEach((t, ti) => {
                    t.lesion_type.forEach((l, li) => {
                        lesionTypeTruths.push({
                            truth_id: t.id,
                            lesion_type_id: l
                        });
                    });
                });
                const lesionTypeTruthsResult = await Apis.lesionTypesTruthsBatchAdd(lesionTypeTruths);
                NotificationManager.success('Item Created!');
                this.getItemList();
            } catch (error) {
                NotificationManager.error(error.message);
            }
            self.setState({
                loading: false,
                addNewItemDetail: {
                    test_case_id: '',
                    position: '',
                    dicom_file: '',
                    truth: [],
                }
            });
        } else {
            NotificationManager.error('Please input correct information')
        }
    }

    /**
     * View Item Detail Hanlder
     */
    viewItemDetail(data) {
        this.setState({openViewItemDialog: true, selectedItem: data});
    }

    /**
     * On Edit Item
     */
    onEditItem(item) {
        item.truth = [];
        this.setState({addNewItemModal: true, editItem: item});
    }

    /**
     * On Add & Update Item Modal Close
     */
    onAddUpdateItemModalClose() {
        this.setState({addNewItemModal: false, editItem: null})
    }

    /**
     * On Update Item Details
     */
    onUpdateItemDetails(key, value) {
        this.setState({
            editItem: {
                ...this.state.editItem,
                [key]: value
            }
        });
    }

    /**
     * Update Item
     */
    updateItem() {
        const {editItem} = this.state;
        if (editItem.test_case_id !== '' ) {
            let indexOfUpdateItem = '';
            let items = this.state.items;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.id === editItem.id) {
                    indexOfUpdateItem = i
                }
            }
            items[indexOfUpdateItem] = editItem;
            this.setState({loading: true, editItem: null, addNewItemModal: false});
            let self = this;
            if(editItem.dicom_file !== undefined) {
                Apis.dicomImagesUpload(editItem).then(resp => {
                    NotificationManager.success('Item Updated!');
                    this.getItemList();
                }).catch(error => {
                    NotificationManager.error(error.message);
                }).finally(() => {
                    self.setState({items, loading: false});
                });
            } else {
                Apis.imagesUpdate(editItem.id, editItem).then(resp => {
                    NotificationManager.success('Item Updated!');
                    this.getItemList();
                }).catch(error => {
                    NotificationManager.error(error.message);
                }).finally(() => {
                    self.setState({items, loading: false});
                });
            }
        } else {
            NotificationManager.error('Please input correct information');
        }
    }

    //Select All item
    onSelectAllItem(e) {
        const {selectedItems, items} = this.state;
        let selectAll = selectedItems < items.length;
        if (selectAll) {
            let selectAllItems = items.map(item => {
                item.checked = true
                return item
            });
            this.setState({items: selectAllItems, selectedItems: selectAllItems.length})
        } else {
            let unselectedItems = items.map(item => {
                item.checked = false
                return item;
            });
            this.setState({selectedItems: 0, items: unselectedItems});
        }
    }

    onChangePage(selectedPage) {
        this.setState({currentPage: selectedPage}, () => {
            this.getItemList();
        });
    }

    render() {
        const {items, loading, selectedItem, editItem, allSelected, selectedItems} = this.state;
        return (
            <div className="item-management">
                <Helmet>
                    <title>Images Management</title>
                    <meta name="description" content=""/>
                </Helmet>
                <PageTitleBar
                    title={"Images"}
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
                                <a href="javascript:void(0)" onClick={() => this.opnAddNewItemModal()} color="primary" className="caret btn-sm mr-10">
                                    Add New Item <i className="zmdi zmdi-plus"></i></a>
                            </div>
                        </div>
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                            <tr>
                                <th className="w-5">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                indeterminate={selectedItems > 0 && selectedItems < items.length}
                                                checked={selectedItems > 0}
                                                onChange={(e) => this.onSelectAllItem(e)}
                                                value="all"
                                                color="primary"
                                            />
                                        }
                                        label="All"
                                    />
                                </th>
                                <th>Id</th>
                                <th>Test Case</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items && items.map((item, key) => (
                                <tr key={key}>
                                    <td>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={item.checked !== undefined && item.checked}
                                                    onChange={() => this.onSelectItem(item)}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.test_cases.name}</td>
                                    <td className="list-action">
                                        <a href="javascript:void(0)" onClick={() => this.viewItemDetail(item)}><i className="ti-eye"></i></a>
                                        <a href="javascript:void(0)" onClick={() => this.onEditItem(item)}><i className="ti-pencil"></i></a>
                                        <a href="javascript:void(0)" onClick={() => this.onDelete(item)}><i className="ti-close"></i></a>
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
                    message="This will delete item permanently."
                    onConfirm={() => this.deleteItemPermanently()}
                />
                <Modal isOpen={this.state.addNewItemModal} toggle={() => this.onAddUpdateItemModalClose()} size="lg">
                    <ModalHeader toggle={() => this.onAddUpdateItemModalClose()}>
                        {editItem === null ?
                            'Add New Item' : 'Update Item'
                        }
                    </ModalHeader>
                    <ModalBody>
                        {editItem === null ?
                            <AddNewForm
                                addNewItemDetails={this.state.addNewItemDetail}
                                onChangeAddNewItemDetails={this.onChangeAddNewItemDetails.bind(this)}
                                testCasesList={this.state.testCasesList}
                                ratingScalesList={this.state.ratingScalesList}
                                lesionTypesList={this.state.lesionTypesList}
                            /> :
                            <UpdateForm
                                item={editItem}
                                onUpdateItemDetail={this.onUpdateItemDetails.bind(this)}
                                testCasesList={this.state.testCasesList}
                                ratingScalesList={this.state.ratingScalesList}
                                lesionTypesList={this.state.lesionTypesList}
                            />
                        }
                    </ModalBody>
                    <ModalFooter>
                        {editItem === null ?
                            <Button variant="contained" className="text-white btn-success" onClick={() => this.addNewItem()}>Add</Button>
                            : <Button variant="contained" color="primary" className="text-white" onClick={() => this.updateItem()}>Update</Button>
                        }
                        {' '}
                        <Button variant="contained" className="text-white btn-danger" onClick={() => this.onAddUpdateItemModalClose()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Dialog
                    onClose={() => this.setState({openViewItemDialog: false})}
                    open={this.state.openViewItemDialog}
                >
                    <DialogContent>
                        {selectedItem !== null &&
                        <div>
                            <div className="clearfix d-flex">
                                <div className="media pull-left">
                                    <div className="media-body">
                                        <p>Test Case: <span className="fw-bold">{selectedItem.test_cases.name}</span></p>
                                        <p>Position: <span className="fw-bold">{selectedItem.position}</span></p>
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
