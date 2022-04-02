import React, {Component} from 'react';
import {Col, FormGroup, Label} from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import {Button, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import Select from "react-select";
import {withStyles} from "@material-ui/core/styles";
import {yellow} from "@material-ui/core/colors";
import {NotificationManager} from "react-notifications";
import chroma from "chroma-js";
import {connect} from "react-redux";

class MarkerPopupNormal extends Component {
    constructor(props) {
        super(props);
        const {attempts_id, test_cases_id, markData, lesion_list, isPostTest, ratings, complete, showImageList} = props;
        let isShowDeleteButton = true;
        if (markData.isNew) {
            isShowDeleteButton = false;
        }
        // let rating = (markData.rating === undefined || isNaN(markData.rating)) ? '2' : markData.rating;

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
            selectedRating: (markData.lesionList.rating1 === undefined || isNaN(markData.lesionList.rating1)) ? '2' : markData.lesionList.rating1.toString(),
            selectedRating2: (markData.lesionList.rating2 === undefined || isNaN(markData.lesionList.rating2)) ? '2' : markData.lesionList.rating2.toString(),
            lesionList: [],
            ratings,
            complete,
            isShowPopupDelete: isShowDeleteButton,
        }
    }

    handleClosePopup(type) {
        const {onClose, popupCancelHandler, popupDeleteHandler, popupSaveHandler} = this.props;
        onClose();
        switch (type) {
            case 'cancel':
            case 'ok':
                popupCancelHandler();
                break;
            case 'delete':
                if (!confirm('Are you sure you want to delete this mark?')) break;
                popupDeleteHandler(this.state.selectedMarkData.id);
                break;
            case 'save':
                let data = {
                    id: this.state.selectedMarkData.id,
                    marker_tool_type: this.state.selectedMarkData.marker_tool_type,
                    attempt_id: this.state.attempts_id,
                    test_case_id: this.state.test_cases_id,
                    rating: this.state.selectedRating,
                    answer_lesion_list: JSON.stringify({rating1: this.state.selectedRating, rating2: this.state.selectedRating2}),
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

    renderRatings() {
        return (
            <div className={'d-flex flex-column'}>
                <div>How confident this case is suspicious for NAI</div>
                <RadioGroup
                    disabled
                    aria-label="position"
                    name="position"
                    value={this.state.selectedRating}
                    onChange={(e) => this.setState({selectedRating: e.target.value})}
                    row
                >
                    {
                        this.state.ratings.map((v, i) => {   // [0, 1, 2, 3...]
                            return (
                                <CustomFormControlLabel
                                    disabled={this.state.complete}
                                    value={v.value.toString()}
                                    control={<CustomRadio/>}
                                    label={v.label}
                                    key={i}
                                />
                            )
                        })
                    }
                </RadioGroup>
                <div className={'mt-2'}>How confident are you that may have missed any bony injuries due to excessive noise in the bony images</div>
                <RadioGroup
                    disabled
                    aria-label="position"
                    name="position"
                    value={this.state.selectedRating2}
                    onChange={(e) => this.setState({selectedRating2: e.target.value})}
                    row
                >
                    {
                        this.state.ratings.map((v, i) => {   // [0, 1, 2, 3...]
                            return (
                                <CustomFormControlLabel
                                    disabled={this.state.complete}
                                    value={v.value.toString()}
                                    control={<CustomRadio/>}
                                    label={v.label}
                                    key={i}
                                />
                            )
                        })
                    }
                </RadioGroup>
            </div>
        )
    }

    render() {
        const coverClassForDualMonitor = this.dialogSide ? (this.dialogSide === 'left' ? 'right-padding' : 'left-padding') : '';
        return (
            <div id="cover" className={coverClassForDualMonitor} onClick={(e) => this.handleClosePopup('cancel')}>
                <div id="mark-details" style={{width: '28.125rem'}} onClick={(e) => e.stopPropagation()}>
                    <form>
                        {this.renderRatings()}
                        <div className="actions">
                            <div className="left">
                            </div>
                            {
                                this.state.complete ?
                                    <div className="right">
                                        <Button variant="contained" className="ok" onClick={() => this.handleClosePopup('ok')}>&nbsp;&nbsp;<IntlMessages id={"testView.ok"}/>&nbsp;&nbsp;</Button>
                                    </div> :
                                    <div className="right">
                                        {
                                            this.state.isShowPopupDelete ?
                                                <Button variant="contained" className="mr-15 delete" onClick={() => this.handleClosePopup('delete')}>
                                                    <IntlMessages id={"testView.delete"}/>
                                                </Button> : null
                                        }
                                        <Button variant="contained" className="save" onClick={() => this.handleClosePopup('save')}><IntlMessages id={"testView.save"}/></Button>
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


const CustomFormControlLabel = withStyles(theme => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&$disabled': {
            color: yellow[200],
        },
        '&.green-label': {
            color: '#2eff2e'
        },
        '&.red-label': {
            color: 'red'
        }
    },
    disabled: {},
}))(FormControlLabel);

const CustomRadio = withStyles(theme => ({
    root: {
        color: yellow[600],
        '&$checked': {
            color: yellow[500],
        },
        '&$disabled': {
            color: yellow[200],
        },
        '&.green-icon': {
            color: '#2eff2e'
        },
        '&.red-icon': {
            color: 'red'
        },
        marginBottom: 0
    },
    checked: {},
    disabled: {},
}))(Radio);



