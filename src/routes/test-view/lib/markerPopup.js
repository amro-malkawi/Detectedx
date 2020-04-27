import React, {Component} from 'react';
import {Col, FormGroup, Label} from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import {Button, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import Select from "react-select";
import {withStyles} from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import {NotificationManager} from "react-notifications";
import chroma from "chroma-js";

export default class MarkerPopup extends Component {
    constructor(props) {
        super(props);

        const {attempts_id, test_cases_id, markData, lesion_types, isPostTest, ratings, complete} = props;
        let isShowDeleteButton = true;
        if (markData.isNew) {
            isShowDeleteButton = false;
        }

        let lesionsValue = [];
        let lesions = markData.lesionTypes.map(v => v.toString());
        lesion_types.forEach(v => {
            if (lesions.indexOf(v.id.toString()) !== -1) {
                lesionsValue.push({value: v.id, label: v.name});
            }
        });
        let rating = (markData.rating === undefined || isNaN(markData.rating)) ? '2' : markData.rating;
        if (Number(rating) < 3) {
            lesionsValue = [];
        }

        this.state = {
            attempts_id,
            test_cases_id,
            isPostTest,
            selectedMarkData: markData,
            selectedRating: rating.toString(),
            selectedLesions: lesionsValue,
            ratings,
            complete,
            isShowPopupDelete: isShowDeleteButton,
        }
    }


    setSelectedRating(value) {
        if (Number(value) < 3) {
            this.setState({selectedLesions: []});
        }
        this.setState({selectedRating: value});
    }

    onChangeRating(event) {
        this.setSelectedRating(event.target.value);
    }

    onChangeLesions(value) {
        this.setState({selectedLesions: value})
    }

    handleClosePopup(type) {
        const {onClose, popupCancelHandler, popupDeleteHandler, popupSaveHandler} = this.props;
        if (type === 'save' && Number(this.state.selectedRating) > 2 && (this.state.selectedLesions === null || this.state.selectedLesions.length === 0)) {
            NotificationManager.error(<IntlMessages id={"testView.selectLesionType"}/>);
            return;
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
                    x: this.state.selectedMarkData.handles.end.x,
                    y: this.state.selectedMarkData.handles.end.y,
                    attempt_id: this.state.attempts_id,
                    test_case_id: this.state.test_cases_id,
                    rating: this.state.selectedRating,
                    answer_lesion_types: this.state.selectedLesions.map((v) => v.value.toString()),
                    isNew: this.state.selectedMarkData.isNew,
                    is_post_test: this.state.isPostTest
                };
                popupSaveHandler(data);
                break;
        }
    }

    render() {
        const {lesion_types} = this.props;
        let lesions = lesion_types.map((v, i) => {
            return {label: v.name, value: v.id}
        });
        return (
            <div id="cover" onClick={(e) => this.handleClosePopup('cancel')}>
                <div id="mark-details" onClick={(e) => {e.stopPropagation()}}>
                    <form>
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
                                                    value={v.toString()}
                                                    control={<CustomRadio/>}
                                                    label={v}
                                                    key={i}
                                                />
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </Col>
                        </FormGroup>
                        <Label><IntlMessages id={"testView.Lesions"}/>:</Label>
                        <Select
                            isDisabled={this.state.complete || Number(this.state.selectedRating) < 3}
                            placeholder={this.state.complete || Number(this.state.selectedRating) < 3 ? <IntlMessages id={"testView.cannotSelectLesion"}/> : <IntlMessages id={"testView.selectLesion"}/>}
                            isMulti
                            name="lesions"
                            options={lesions}
                            value={this.state.selectedLesions}
                            styles={selectStyles}
                            onChange={this.onChangeLesions.bind(this)}
                        />

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
                                                <Button variant="contained" className="mr-15 delete" onClick={() => this.handleClosePopup('delete')}><IntlMessages id={"testView.delete"}/></Button> : null
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


const CustomFormControlLabel = withStyles(theme => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&$disabled': {
            color: yellow[200],
        },
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
    },
    checked: {},
    disabled: {},
}))(Radio);


const selectStyles = {
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


