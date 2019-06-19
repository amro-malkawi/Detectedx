/**
 * Update Item Details Form
 */
import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, Card} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Button from "@material-ui/core/Button";


export default class UpdateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onAddTruth() {
        let {truth} = this.props.item;
        truth.push({
            rating_scale_id: '',
            x: '',
            y: '',
            rating: '',
            lesion_type: []
        });
        this.props.onUpdateItemDetail(truth, truth);
    }

    onChangeTruth(index, key, value) {
        let {truth} = this.props.item;
        truth[index][key] = value;
        this.props.onUpdateItemDetail(truth, truth);
    }

    onRemoveTruth(index) {
        let {truth} = this.props.item;
        truth.splice(index, 1);
        this.props.onUpdateItemDetail(truth, truth);
    }

    onAddLesionType(truthIndex) {
        let { truth } = this.props.item;
        truth[truthIndex].lesion_type.push('');
        this.props.onUpdateItemDetail(truth, truth);
    }

    onChangeLesionType(truthIndex, lesionIndex, value) {
        let {truth} = this.props.item;
        truth[truthIndex].lesion_type[lesionIndex] = value;
        this.props.onUpdateItemDetail(truth, truth);
    }

    onRemoveLesionType(truthIndex, lestionIndex) {
        let {truth} = this.props.item;
        truth[truthIndex].lesion_type.splice(lestionIndex, 1);
        this.props.onUpdateItemDetail(truth, truth);
    }

    renderTruth() {
        const {item, onUpdateItemDetail, ratingScalesList, lesionTypesList} = this.props;
        return (
            <RctCollapsibleCard heading="Truth">
                {
                    item.truth.map((item, index) => {
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
        const {item, onUpdateItemDetail, ratingScalesList, lesionTypesList} = this.props;
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
        const {item, onUpdateItemDetail, testCasesList, ratingScalesList, lesionTypesList} = this.props;
        return (
            <div>
                <RctCollapsibleCard heading="Image Information">
                    <FormGroup>
                        <Label for="test_case_id">Test Case*</Label>
                        <Input type="select" name="test_case_id" id="test_case_id" value={item.test_case_id}
                               onChange={(e) => onUpdateItemDetail('test_case_id', e.target.value)}>
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
                            value={item.position}
                            onChange={(e) => onUpdateItemDetail('position', e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="dicom_file">Dicom</Label>
                        <Input
                            type="file"
                            accept=".dcm"
                            name="dicom_file"
                            id="dicom_file"
                            onChange={(e) => onUpdateItemDetail('dicom_file', e.target.files[0])}
                        />
                    </FormGroup>
                </RctCollapsibleCard>
                {this.renderTruth()}
            </div>
        );
    }
}


const UpdateForm1 = ({item, onUpdateItemDetail, testCasesList}) => (
    <div>
        <FormGroup>
            <Label for="test_case_id">Test Case*</Label>
            <Input type="select" name="test_case_id" id="test_case_id" value={item.test_case_id} onChange={(e) => onUpdateItemDetail('test_case_id', e.target.value)}>
                <option key={-1} > </option>
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
                value={item.position}
                onChange={(e) => onUpdateItemDetail('position', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="dicom_file">Dicom</Label>
            <Input
                type="file"
                accept=".dcm"
                name="dicom_file"
                id="dicom_file"
                onChange={(e) => onUpdateItemDetail('dicom_file', e.target.files[0])}
            />
        </FormGroup>
    </div>
);
