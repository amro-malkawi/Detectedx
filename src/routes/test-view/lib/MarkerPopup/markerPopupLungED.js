import React, {Component} from 'react';
import {Col, FormGroup, Label} from "reactstrap";
import {Button, RadioGroup} from "@mui/material";
import Select from "react-select";
import {connect} from "react-redux";
import {MarkerFormControlLabel, MarkerRadio, markerSelectStyles} from "Components/CustomMuiComponent";

const lesionInfo = {
    lesions: {
        'Solid nodule(s)': {
            'LR2 4mm to <6mm': '2',
            'LR3 >6mm to <8mm': '3',
            'LR4A >8mm to <15mm': '4',
            'LR4B >15mm': '5'
        },
        'Part solid nodule(s)': {
            'LR2 <6mm': '2',
            'LR3 solid component <6mm': '3',
            'LR4A solid component >6mm to <8mm': '4',
            'LR4B solid component >8mm': '5'
        },
        'Non solid nodule(s) (GGN)': {
            'LR2 <30mm': '2',
            'LR3 >30mm': '3'
        },
        'Endobronchial nodule': {}
    },
    ratings: [
        {label: 'LR2', value: 2},
        {label: 'LR3', value: 3},
        {label: 'LR4A', value: 4},
        {label: 'LR4B/X', value: 5},
    ],
    follow: {
        '2': 'Continue annual screening with LDCT in 12 months',
        '3': 'Repeat CT in 6 months',
        '4': 'Repeat in 3 months or consider FDG-PET',
        '5': 'Specialist referral for work-up',
    }
}

class MarkerPopupLungED extends Component {
    constructor(props) {
        super(props);

        const {attempts_id, test_cases_id, markData, lesion_list, isPostTest, ratings, complete} = props;
        let isShowDeleteButton = true;
        if (markData.isNew) {
            isShowDeleteButton = false;
        }

        let rating = (markData.rating === undefined || isNaN(markData.rating)) ? '0' : markData.rating;


        this.state = {
            attempts_id,
            test_cases_id,
            isPostTest,
            selectedMarkData: markData,
            selectedRating: rating.toString(),
            lesionList: [],
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
        if (
            type === 'save' && Number(this.state.selectedRating) < 2
        ) {
            return;
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

    onChangeLesionList(type, option) {
        if (type === 'root') {
            let selectedRating = '';
            if(Object.keys(lesionInfo.lesions[option.label]).length === 0) {
                selectedRating = '4';
            }
            this.setState({
                selectedLesionList: {[option.label]: ''},
                selectedRating,
            });
        } else {
            this.setState({
                selectedLesionList: {[type]: option.label},
                selectedRating: lesionInfo.lesions[type][option.label]
            });
        }
    }

    renderLesion() {
        const {selectedLesionList} = this.state;
        const lesionOptions = Object.keys(lesionInfo.lesions).map((v) => ({
            label: v, value: v
        }));
        const selectedLesion = Object.keys(selectedLesionList)[0];
        let selectedLesionObj = lesionInfo.lesions[selectedLesion];
        const selectedLesionOption = selectedLesionObj === undefined ? [] : [{value: selectedLesion, label: selectedLesion}];
        const sizeOptions =
            selectedLesionOption.length === 0 ? [] :
                Object.keys(selectedLesionObj).map((v) => ({
                    label: v, value: v
                }));
        const selectedSizeOption = (selectedLesionList[selectedLesion] && typeof selectedLesionList[selectedLesion] === 'string') ?
            [{ value: selectedLesionList[selectedLesion], label: selectedLesionList[selectedLesion]}] : [];
        return (
            <div>
                <Select
                    placeholder={'Select nodule type'}
                    name="lesions"
                    isSearchable={false}
                    options={lesionOptions}
                    value={selectedLesionOption}
                    styles={markerSelectStyles}
                    onChange={(option) => this.onChangeLesionList('root', option)}
                    defaultMenuIsOpen={true}
                />
                {
                    sizeOptions.length > 0 &&
                    <Select
                        placeholder={'Select size'}
                        name="lesions"
                        isSearchable={false}
                        options={sizeOptions}
                        value={selectedSizeOption}
                        styles={markerSelectStyles}
                        onChange={(option) => this.onChangeLesionList(selectedLesion, option)}
                        defaultMenuIsOpen={true}
                    />
                }
            </div>
        )
    }

    renderRatings() {
        return (
            <FormGroup className={'mb-0 d-flex ps-3 pt-3 pe-3'} row>
                <Label style={{marginTop: 8}}>Rating:</Label>
                <Col >
                    <RadioGroup
                        disabled
                        aria-label="position"
                        name="position"
                        value={this.state.selectedRating}
                        onChange={this.onChangeRating.bind(this)}
                        row
                    >
                        {
                            lesionInfo.ratings.map((v, i) => {   // [0, 1, 2, 3...]
                                return (
                                    <MarkerFormControlLabel
                                        disabled={true}
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

    render() {
        return (
            <div id="cover" onClick={(e) => this.handleClosePopup('cancel')}>
                <div id="mark-details" style={{width: 432}} onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <form>
                        <Label>Lesions:</Label>
                        {
                            this.renderLesion()
                        }
                        {this.renderRatings()}
                        {
                            lesionInfo.follow[this.state.selectedRating] &&
                            <div className={'mb-20'}>{lesionInfo.follow[this.state.selectedRating]}</div>
                        }
                        <div className="actions mt-5">
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
                                                <Button variant="contained" className="me-15 delete" onClick={() => this.handleClosePopup('delete')}>Delete</Button> : null
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
    };
};

export default connect(mapStateToProps)(MarkerPopupLungED);


