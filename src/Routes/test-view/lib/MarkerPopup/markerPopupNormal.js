import React, {Component} from 'react';
import {Col, FormGroup, Label} from "reactstrap";
import {Button, RadioGroup} from "@mui/material";
import Select from "react-select";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {MarkerFormControlLabel, MarkerRadio, markerSelectStyles} from "Components/CustomMuiComponent";

class MarkerPopupNormal extends Component {
    constructor(props) {
        super(props);
        const {attempts_id, test_cases_id, markData, lesion_list, isPostTest, ratings, complete, showImageList} = props;
        let isShowDeleteButton = true;
        if (markData.isNew) {
            isShowDeleteButton = false;
        }
        let rating = (markData.rating === undefined || isNaN(markData.rating)) ? '2' : markData.rating;
        let lesionList = [];
        try {
            lesionList = JSON.parse(lesion_list);
        } catch (e) {}

        // support multiple monitor, add padding for two monitor.
        this.dialogSide = null;
        if(window.innerWidth > 2000 && window.screen.width < window.outerWidth) {
            showImageList.forEach((imgRow) => {
                const i = imgRow.findIndex((v) => v === markData.imageId);
                if(i !== -1) {
                    this.dialogSide = ( i < imgRow.length / 2) ? 'left' : 'right';
                }
            });
        }

        this.state = {
            attempts_id,
            test_cases_id,
            isPostTest,
            selectedMarkData: markData,
            selectedRating: rating.toString(),
            lesionList: lesionList,
            selectedLesionList: markData.lesionList || {},
            ratings,
            complete,
            isShowPopupDelete: isShowDeleteButton,
        }
    }


    setSelectedRating(value) {
        if (Number(value) < 3) {
            this.setState({selectedLesionList: {}});
        }
        this.setState({selectedRating: value});
    }

    onChangeRating(event) {
        this.setSelectedRating(event.target.value);
    }

    handleClosePopup(type) {
        const {onClose, popupCancelHandler, popupDeleteHandler, popupSaveHandler} = this.props;
        const {lesionList, selectedLesionList} = this.state;
        if (
            type === 'save' && Number(this.state.selectedRating) > 2 &&
            lesionList.length !== 0
        ) {
            // new lesion types check
            if (Object.keys(selectedLesionList).length === 0) {
                NotificationManager.error("Please select lesion type");
                return;
            }
            const rootLesionObj = lesionList.find((v) => v.name === Object.keys(selectedLesionList)[0]);
            if (rootLesionObj !== undefined && rootLesionObj.children !== undefined && rootLesionObj.children.length > 0) {
                if (rootLesionObj.children[0].children !== undefined && rootLesionObj.children[0].children.length > 0) {
                    // has sublesions
                    if (rootLesionObj.children.some((v) => (
                        v.name !== 'Associated features' && selectedLesionList[Object.keys(selectedLesionList)[0]][v.name] === undefined
                    ))) {
                        NotificationManager.error("testView.selectLesionType");
                        return;
                    }
                } else {
                    if (selectedLesionList[Object.keys(selectedLesionList)[0]] === '') {
                        NotificationManager.error("testView.selectLesionType");
                        return;
                    }
                }
            }
        }
        onClose();
        switch (type) {
            case 'cancel':
            case 'ok':
                popupCancelHandler();
                break;
            case 'delete':
                if (!window.confirm('Are you sure you want to delete this mark?')) break;
                popupDeleteHandler(this.state.selectedMarkData.id);
                break;
            case 'save':
                let data = {
                    id: this.state.selectedMarkData.id,
                    marker_tool_type: this.state.selectedMarkData.marker_tool_type,
                    attempt_id: this.state.attempts_id,
                    test_case_id: this.state.test_cases_id,
                    rating: this.state.selectedRating,
                    answer_lesion_list: JSON.stringify(this.state.selectedLesionList),
                    isNew: this.state.selectedMarkData.isNew,
                    is_post_test: this.state.isPostTest
                };
                if (data.marker_tool_type === 'Marker') {
                    data.marker_data = JSON.stringify({x: this.state.selectedMarkData.handles.end.x, y: this.state.selectedMarkData.handles.end.y})
                } else if (data.marker_tool_type === 'MarkerFreehand') {
                    data.marker_data = JSON.stringify(this.state.selectedMarkData.handles).replace(/-?\d+\.\d+/g, function (x) {
                        return parseFloat(x).toFixed(2)
                    });
                }
                popupSaveHandler(data);
                break;
            default:
                break;
        }
    }

    onChangeLesionList(type, subType, option) {
        const {selectedLesionList} = this.state;
        if (type === 'root') {
            this.setState({selectedLesionList: {[option.label]: ''}});
        } else if (subType !== undefined && subType !== '') {
            if (typeof selectedLesionList[type] !== 'object') selectedLesionList[type] = {};
            selectedLesionList[type][subType] = option.label;
            this.setState({selectedLesionList: selectedLesionList});
        } else {
            this.setState({selectedLesionList: {[type]: option.label}});
        }
    }

    onSaveScreeningMark() {
        // I added "none" key in selectedLesionList to skip validation.
        this.setState({
            selectedRating: 3,
            selectedLesionList: {screening: ''}
        }, () => this.handleClosePopup('save'));
    }

    renderSubLesion(parent, item) {
        const {selectedLesionList} = this.state;
        const options = item.children.map((v) => ({value: v.id, label: v.name}));
        const selectedOptionObj = item.children.find((v) => v.name === selectedLesionList[parent][item.name]);
        const selectedOption = selectedOptionObj !== undefined ? [{value: selectedOptionObj.id, label: selectedOptionObj.name}] : [];
        let placeholder;
        if (this.state.complete || Number(this.state.selectedRating) < 3) {
            placeholder = "Can not select lesion type";
        } else {
            if (item.name === 'Present') {
                // when drop down is "Present", change placeholder to "Associated features"
                placeholder = 'Select Associated features';
            } else {
                placeholder = 'Select ' + item.name;
            }
        }
        return (
            <Select
                key={item.id}
                isDisabled={this.state.complete || Number(this.state.selectedRating) < 3}
                placeholder={placeholder}
                name="lesions"
                isSearchable={false}
                options={options}
                value={selectedOption}
                styles={markerSelectStyles}
                onChange={(option) => this.onChangeLesionList(parent, item.name, option)}
                defaultMenuIsOpen={selectedOption.length === 0}
            />
        )
    }

    renderLesion() {
        // value example {Mass: {Shape: 'Oval', Margin: 'Circumscribed}}
        // value example {Asymmetry: 'Global'}
        const {lesionList, selectedLesionList} = this.state;
        if (lesionList.length === 0) return;
        let options = lesionList.map((v, i) => {
            return {label: v.name, value: v.id}
        });
        let selectedLesionObj = lesionList.find((v) => v.name === Object.keys(selectedLesionList)[0]);
        const selectedOption = selectedLesionObj === undefined ? [] : [{value: selectedLesionObj.id, label: selectedLesionObj.name}];
        let hasSubLesion;
        let childrenOptions = [];
        let selectedChildrenOption = [];
        let childrenLesionList;
        if (selectedLesionObj && selectedLesionObj.children && selectedLesionObj.children.length > 0) {
            childrenLesionList = selectedLesionObj.children;
            if (childrenLesionList[0].children !== undefined && childrenLesionList[0].children.length > 0) {
                // breast lesions
                hasSubLesion = true;
                // when Present value is not "Present", remove "Associated features" drop list
                if (selectedLesionList[selectedLesionObj.name]['Present'] !== 'Present') {
                    childrenLesionList = childrenLesionList.filter((v) => v.name !== 'Associated features');
                }

                // step by step select feature
                const temp = childrenLesionList.filter((v) => selectedLesionList[selectedLesionObj.name][v.name] !== undefined);
                if (temp.length < childrenLesionList.length) {
                    // add select what did not set value
                    temp.push(childrenLesionList[temp.length]);
                }
                childrenLesionList = temp;


            } else {
                hasSubLesion = false;
                childrenOptions = childrenLesionList.map((v) => ({value: v.id, label: v.name}));
                const selectedChildLesionObj = childrenLesionList.find((v) => v.name === selectedLesionList[selectedLesionObj.name]);
                if (selectedChildLesionObj !== undefined) {
                    selectedChildrenOption = [{value: selectedChildLesionObj.id, label: selectedChildLesionObj.name}];
                }
            }
        }


        return (
            <div>
                <Select
                    isDisabled={this.state.complete || Number(this.state.selectedRating) < 3}
                    placeholder={this.state.complete || Number(this.state.selectedRating) < 3 ? "Can not select lesion type" : "Select lesion type"}
                    name="lesions"
                    isSearchable={false}
                    options={options}
                    value={selectedOption}
                    styles={markerSelectStyles}
                    onChange={(option) => this.onChangeLesionList('root', '', option)}
                    defaultMenuIsOpen={selectedOption.length === 0}
                />
                {
                    hasSubLesion !== undefined && (hasSubLesion ?
                        childrenLesionList && childrenLesionList.map((v, i) => this.renderSubLesion(selectedLesionObj.name, v)) :
                        <Select
                            isDisabled={this.state.complete || Number(this.state.selectedRating) < 3}
                            placeholder={this.state.complete || Number(this.state.selectedRating) < 3 ? "Can not select lesion type" : "Select lesion"}
                            isSearchable={false}
                            options={childrenOptions}
                            value={selectedChildrenOption}
                            styles={markerSelectStyles}
                            onChange={(option) => this.onChangeLesionList(selectedLesionObj.name, '', option)}
                            defaultMenuIsOpen={selectedChildrenOption.length === 0}
                        />)
                }
            </div>
        );
    }

    renderRatings() {
        const ratings = [...this.state.ratings];
        if (this.props.testSetHangingIdList.length > 0 && ratings.length > 0) {
            // breast popup
            return (
                <div>
                    <div className={'fs-19 mb-2'}>Bi-RADS Categories:</div>
                    <RadioGroup
                        disabled
                        aria-label="position"
                        name="position"
                        value={this.state.selectedRating}
                        onChange={this.onChangeRating.bind(this)}
                        row
                    >
                        <Col sm={4} className={'d-flex flex-column align-items-center'}>
                            <div className={'fs-15 fw-bold'} style={{marginBottom: 16, color: '#2eff2e'}}>Benign (2)</div>
                            <MarkerFormControlLabel
                                classes={{label: 'green-label'}}
                                disabled={this.state.complete}
                                value={ratings[0].value.toString()}
                                control={<MarkerRadio classes={{root: 'green-icon'}}/>}
                                label={ratings[0].label}
                            />
                        </Col>
                        <Col sm={8}>
                            <div className={'fs-15 text-red fw-bold'}>Assess (0)</div>
                            <div className={'fs-11 text-red'}>Please select your level of confidence</div>
                            {
                                ratings.splice(1).map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <MarkerFormControlLabel
                                            classes={{label: 'red-label'}}
                                            disabled={this.state.complete}
                                            value={v.value.toString()}
                                            control={<MarkerRadio classes={{root: 'red-icon'}}/>}
                                            label={v.label}
                                            key={i}
                                        />
                                    )
                                })
                            }
                        </Col>
                    </RadioGroup>
                </div>
            );
        } else {
            return (
                <FormGroup className={'mb-5'} row>
                    <Label sm={3} style={{marginTop: 6}}>Rating:</Label>
                    <Col sm={9}>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={this.state.selectedRating}
                            onChange={this.onChangeRating.bind(this)}
                            row
                        >
                            {
                                this.state.ratings.map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <MarkerFormControlLabel
                                            disabled={this.state.complete}
                                            value={v.value.toString()}
                                            control={<MarkerRadio/>}
                                            label={v.label}
                                            key={i}
                                        />
                                    )
                                })
                            }
                        </RadioGroup>
                    </Col>
                </FormGroup>
            )
        }
    }

    render() {
        const {lesionList} = this.state;
        const coverClassForDualMonitor = this.dialogSide ? (this.dialogSide === 'left' ? 'right-padding' : 'left-padding') : '';
        if (this.props.attemptInfo.attempt_sub_type === 'screening') {
            // attempt type is screening, show only "Recall" button
            return (
                <div id="cover" className={coverClassForDualMonitor} onClick={(e) => this.handleClosePopup('cancel')}>
                    <div id="mark-details" onClick={(e) => e.stopPropagation()}>
                        <form>
                            <div className={'text-white fs-19'}>Requires further investigation.</div>
                            <div className="actions">
                                <div className="left">
                                </div>
                                {
                                    this.state.complete ?
                                        <div className="right">
                                            <Button variant="contained" className="ok" onClick={() => this.handleClosePopup('ok')}>&nbsp;&nbsp;Ok&nbsp;&nbsp;</Button>
                                        </div> :
                                        <div className="right">
                                            {
                                                this.state.isShowPopupDelete ?
                                                    <Button variant="contained" className="me-15 delete" onClick={() => this.handleClosePopup('delete')}>
                                                        Delete
                                                    </Button> : null
                                            }
                                            <Button
                                                variant="contained"
                                                className="save"
                                                onClick={() => this.onSaveScreeningMark()}
                                            >
                                                Recall
                                            </Button>
                                        </div>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <div id="cover" className={coverClassForDualMonitor} onClick={(e) => this.handleClosePopup('cancel')}>
                <div id="mark-details" onClick={(e) => e.stopPropagation()}>
                    <form>
                        {this.renderRatings()}
                        {
                            (lesionList.length > 0 && Number(this.state.selectedRating) > 2) &&
                            <div>
                                <Label>Lesions:</Label>
                                {this.renderLesion()}
                            </div>
                        }

                        <div className="actions">
                            <div className="left">
                            </div>
                            {
                                this.state.complete ?
                                    <div className="right">
                                        <Button variant="contained" className="ok" onClick={() => this.handleClosePopup('ok')}>&nbsp;&nbsp;Ok&nbsp;&nbsp;</Button>
                                    </div> :
                                    <div className="right">
                                        {
                                            this.state.isShowPopupDelete ?
                                                <Button variant="contained" className="me-15 delete" onClick={() => this.handleClosePopup('delete')}>
                                                    Delete
                                                </Button> : null
                                        }
                                        <Button variant="contained" className="save" onClick={() => this.handleClosePopup('save')}>Save</Button>
                                    </div>
                            }
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        testSetHangingIdList: state.testView.testSetHangingIdList,
        attemptInfo: state.testView.attemptInfo,
        showImageList: state.testView.showImageList,
    };
};

export default connect(mapStateToProps)(MarkerPopupNormal);


