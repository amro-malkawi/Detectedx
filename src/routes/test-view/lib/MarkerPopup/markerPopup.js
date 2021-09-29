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

class MarkerPopup extends Component {
    constructor(props) {
        super(props);

        const {attempts_id, test_cases_id, markData, lesion_list, isPostTest, ratings, complete} = props;
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
                NotificationManager.error(<IntlMessages id={"testView.selectLesionType"}/>);
                return;
            }
            const rootLesionObj = lesionList.find((v) => v.name === Object.keys(selectedLesionList)[0]);
            if (rootLesionObj !== undefined && rootLesionObj.children !== undefined && rootLesionObj.children.length > 0) {
                if (rootLesionObj.children[0].children !== undefined && rootLesionObj.children[0].children.length > 0) {
                    // has sublesions
                    if (rootLesionObj.children.some((v) => (
                        v.name !== 'Associated features' && selectedLesionList[Object.keys(selectedLesionList)[0]][v.name] === undefined
                    ))) {
                        NotificationManager.error(<IntlMessages id={"testView.selectLesionType"}/>);
                        return;
                    }
                } else {
                    if (selectedLesionList[Object.keys(selectedLesionList)[0]] === '') {
                        NotificationManager.error(<IntlMessages id={"testView.selectLesionType"}/>);
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

    renderSubLesion(parent, item) {
        const {selectedLesionList} = this.state;
        const options = item.children.map((v) => ({value: v.id, label: v.name}));
        const selectedOptionObj = item.children.find((v) => v.name === selectedLesionList[parent][item.name]);
        const selectedOption = selectedOptionObj !== undefined ? [{value: selectedOptionObj.id, label: selectedOptionObj.name}] : [];
        let placeholder;
        if (this.state.complete || Number(this.state.selectedRating) < 3) {
            placeholder = <IntlMessages id={"testView.cannotSelectLesion"}/>;
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
                styles={selectStyles}
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
                if(temp.length < childrenLesionList.length) {
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
                    placeholder={this.state.complete || Number(this.state.selectedRating) < 3 ? <IntlMessages id={"testView.cannotSelectLesion"}/> : <IntlMessages id={"testView.selectLesion"}/>}
                    name="lesions"
                    isSearchable={false}
                    options={options}
                    value={selectedOption}
                    styles={selectStyles}
                    onChange={(option) => this.onChangeLesionList('root', '', option)}
                    defaultMenuIsOpen={selectedOption.length === 0}
                />
                {
                    hasSubLesion !== undefined && (hasSubLesion ?
                        childrenLesionList && childrenLesionList.map((v, i) => this.renderSubLesion(selectedLesionObj.name, v)) :
                        <Select
                            isDisabled={this.state.complete || Number(this.state.selectedRating) < 3}
                            placeholder={this.state.complete || Number(this.state.selectedRating) < 3 ? <IntlMessages id={"testView.cannotSelectLesion"}/> :
                                <IntlMessages id={"testView.selectChildLesion"}/>}
                            isSearchable={false}
                            options={childrenOptions}
                            value={selectedChildrenOption}
                            styles={selectStyles}
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
                            <CustomFormControlLabel
                                classes={{label: 'green-label'}}
                                disabled={this.state.complete}
                                value={ratings[0].value.toString()}
                                control={<CustomRadio classes={{root: 'green-icon'}}/>}
                                label={ratings[0].label}
                            />
                        </Col>
                        <Col sm={8}>
                            <div className={'fs-15 text-red fw-bold'}>Assess (0)</div>
                            <div className={'fs-11 text-red'}>Please select your level of confidence</div>
                            {
                                ratings.splice(1).map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <CustomFormControlLabel
                                            classes={{label: 'red-label'}}
                                            disabled={this.state.complete}
                                            value={v.value.toString()}
                                            control={<CustomRadio classes={{root: 'red-icon'}}/>}
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
                    <Label sm={3} style={{marginTop: 6}}><IntlMessages id="testView.rating"/></Label>
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
                    </Col>
                </FormGroup>
            )
        }
    }

    render() {
        const {lesionList} = this.state;
        return (
            <div id="cover" onClick={(e) => this.handleClosePopup('cancel')}>
                <div id="mark-details" onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <form>
                        {this.renderRatings()}
                        {
                            (lesionList.length > 0 && Number(this.state.selectedRating) > 2) &&
                                <div>
                                    <Label><IntlMessages id={"testView.Lesions"}/>:</Label>
                                    {this.renderLesion()}
                                </div>
                        }

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
                                                <Button variant="contained" className="mr-15 delete" onClick={() => this.handleClosePopup('delete')}><IntlMessages
                                                    id={"testView.delete"}/></Button> : null
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
    };
};

export default connect(mapStateToProps)(MarkerPopup);


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
        }
    },
    checked: {},
    disabled: {},
}))(Radio);


const selectStyles = {
    container: (styles, {data}) => {
        return {
            ...styles,
            marginBottom: 7,
        };
    },
    control: styles => ({...styles, backgroundColor: 'black'}),
    menu: styles => ({...styles, backgroundColor: 'black', borderColor: 'red', borderWidth: 10}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? 'yellow'
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : 'yellow',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? 'yellow' : color.alpha(0.3).css()),
            },
        };
    },
    singleValue: (styles, {data}) => {
        return {
            ...styles,
            color: 'yellow',
        };
    },
    multiValue: (styles, {data}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
    }),
    multiValueRemove: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
        ':hover': {
            backgroundColor: 'yellow',
            color: 'black',
        },
    }),
};


