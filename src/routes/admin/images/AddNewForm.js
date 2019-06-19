/**
 * Add New Item Form
 */
import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, FormText, CardTitle, CardSubtitle, CardText, Card} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Button from "@material-ui/core/Button";

export default class AddNewForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onAddTruth() {
        let {truth} = this.props.addNewItemDetails;
        truth.push({
            rating_scale_id: '',
            x: '',
            y: '',
            rating: '',
            lesion_type: []
        });
        this.props.onChangeAddNewItemDetails('truth', truth);
    }

    onChangeTruth(index, key, value) {
        let {truth} = this.props.addNewItemDetails;
        truth[index][key] = value;
        this.props.onChangeAddNewItemDetails('truth', truth);
    }

    onRemoveTruth(index) {
        let {truth} = this.props.addNewItemDetails;
        truth.splice(index, 1);
        this.props.onChangeAddNewItemDetails('truth', truth);
    }

    onAddLesionType(truthIndex) {
        let { truth } = this.props.addNewItemDetails;
        truth[truthIndex].lesion_type.push('');
        this.props.onChangeAddNewItemDetails('truth', truth);
    }

    onChangeLesionType(truthIndex, lesionIndex, value) {
        let {truth} = this.props.addNewItemDetails;
        truth[truthIndex].lesion_type[lesionIndex] = value;
        this.props.onChangeAddNewItemDetails('truth', truth);
    }

    onRemoveLesionType(truthIndex, lestionIndex) {
        let {truth} = this.props.addNewItemDetails;
        truth[truthIndex].lesion_type.splice(lestionIndex, 1);
        this.props.onChangeAddNewItemDetails('truth', truth);
    }

    renderTruth() {
        const {addNewItemDetails, onChangeAddNewItemDetails, ratingScalesList, lesionTypesList} = this.props;
        return (
            <RctCollapsibleCard heading="Truth">
                {
                    addNewItemDetails.truth.map((item, index) => {
                        return (
                            <Card body key={index} className={'mt-5 mb-5'}>
                                <FormGroup>
                                    <Label for="position">Rating scale*</Label>
                                    <Input type="select" name="test_case_id" id="test_case_id" value={item.rating_scale_id}
                                           onChange={(e) => this.onChangeTruth(index, 'rating_scale_id', e.target.value)}>
                                        <option key={-1}></option>
                                        {
                                            ratingScalesList.map((item, index) => (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="position">X</Label>
                                    <Input
                                        type="number"
                                        name="x"
                                        id="x"
                                        placeholder=""
                                        value={item.x}
                                        onChange={(e) => this.onChangeTruth(index, 'x', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="y">Y</Label>
                                    <Input
                                        type="number"
                                        name="y"
                                        id="y"
                                        placeholder=""
                                        value={item.y}
                                        onChange={(e) => this.onChangeTruth(index, 'y', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="rating">Rating</Label>
                                    <Input
                                        type="number"
                                        name="rating"
                                        id="rating"
                                        placeholder=""
                                        value={item.rating}
                                        onChange={(e) => this.onChangeTruth(index,'rating', e.target.value)}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Lesion types truth</Label>
                                </FormGroup>

                                {this.renderLesionType(item, index)}

                                <FormGroup>
                                    <Button className="text-white btn-primary" onClick={() => this.onAddLesionType(index)}>Add New Lesion types truth</Button>
                                </FormGroup>
                                <FormGroup>
                                    <Button variant="contained" className="text-white btn-danger" onClick={() => this.onRemoveTruth(index)}>Remove</Button>
                                </FormGroup>
                            </Card>
                        )
                    })
                }
                <Button variant="contained" className="text-white btn-primary" onClick={() => this.onAddTruth()}>Add New Truth</Button>
            </RctCollapsibleCard>
        );
    }

    renderLesionType(truthItem, truthIndex) {
        const {addNewItemDetails, onChangeAddNewItemDetails, ratingScalesList, lesionTypesList} = this.props;
        return (
            <div className="ml-20 mt-10 mb-10">
                {
                    truthItem.lesion_type.map((item, index) => {
                        return (
                            <FormGroup key={index}>
                                <Label for="rating">Lesion type*</Label>

                                <Input type="select" name="lesion_type_id" id="lesion_type_id" value={item}
                                       onChange={(e) =>  this.onChangeLesionType(truthIndex, index, e.target.value)}>
                                    <option key={-1}></option>
                                    {
                                        lesionTypesList.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </Input>
                                <Button variant="contained" className="mt-10 text-white btn-danger" onClick={() => this.onRemoveLesionType(truthIndex, index)}>Remove</Button>
                            </FormGroup>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        const {addNewItemDetails, onChangeAddNewItemDetails, testCasesList, ratingScalesList, lesionTypesList} = this.props;
        return (
            <div>
                <RctCollapsibleCard heading="Image Information">
                    <FormGroup>
                        <Label for="test_case_id">Test Case*</Label>
                        <Input type="select" name="test_case_id" id="test_case_id" value={addNewItemDetails.test_case_id}
                               onChange={(e) => onChangeAddNewItemDetails('test_case_id', e.target.value)}>
                            <option key={-1}></option>
                            {
                                testCasesList.map((item, index) => (
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="position">Position</Label>
                        <Input
                            type="number"
                            name="position"
                            id="position"
                            placeholder=""
                            value={addNewItemDetails.position}
                            onChange={(e) => onChangeAddNewItemDetails('position', e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="dicom_file">Dicom</Label>
                        <Input
                            type="file"
                            accept=".dcm"
                            name="dicom_file"
                            id="dicom_file"
                            onChange={(e) => onChangeAddNewItemDetails('dicom_file', e.target.files[0])}
                        />
                    </FormGroup>
                </RctCollapsibleCard>
                {this.renderTruth()}
            </div>
        );
    }
}
