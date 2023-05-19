import React, {Component} from 'react';
import {Col, FormGroup, Label, Input} from "reactstrap";
import {Button, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import Select from "react-select";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {MarkerFormControlLabel, MarkerRadio, markerSelectStyles} from "Components/CustomMuiComponent";

class MarkerPopupWBCT extends Component {
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
        } catch (e) {
        }

        // support multiple monitor, add padding for two monitor.
        this.dialogSide = null;
        if (window.innerWidth > 2000 && window.screen.width < window.outerWidth) {
            showImageList.forEach((imgRow) => {
                const i = imgRow.findIndex((v) => v === markData.imageId);
                if (i !== -1) {
                    this.dialogSide = (i < imgRow.length / 2) ? 'left' : 'right';
                }
            });
        }

        this.state = {
            attempts_id,
            test_cases_id,
            isPostTest,
            selectedMarkData: markData,
            selectedRating: 3,  //rating.toString(),
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
                        NotificationManager.error("Please select lesion type");
                        return;
                    }
                } else {
                    if (selectedLesionList[Object.keys(selectedLesionList)[0]] === '') {
                        NotificationManager.error("Please select lesion type");
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

        return (
            <div>
                <Select
                    isDisabled={this.state.complete || Number(this.state.selectedRating) < 3}
                    placeholder={'Select fracture type'}
                    name="lesions"
                    isSearchable={false}
                    options={options}
                    value={selectedOption}
                    styles={markerSelectStyles}
                    onChange={(option) => this.onChangeLesionList('root', '', option)}
                    defaultMenuIsOpen={selectedOption.length === 0}
                />
                {
                    // add input text when selected other option
                    selectedOption.length > 0 && selectedOption[0].label.indexOf('Other') === 0 &&
                    <Input
                        type={'text'}
                        style={{backgroundColor: 'transparent', color: 'yellow'}}
                        placeholder={'other option'}
                        value={selectedLesionList['otherText'] ? selectedLesionList['otherText'].text : ''}
                        onChange={(e) => this.onChangeLesionList('otherText', 'text', {label: e.target.value})}
                    />
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

        return (
            <div id="cover" className={coverClassForDualMonitor} onClick={(e) => this.handleClosePopup('cancel')}>
                <div id="mark-details" onClick={(e) => e.stopPropagation()}>
                    <form>
                        {
                            (lesionList.length > 0 && Number(this.state.selectedRating) > 2) &&
                            <div>
                                <Label>Fractures:</Label>
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

export default connect(mapStateToProps)(MarkerPopupWBCT);



