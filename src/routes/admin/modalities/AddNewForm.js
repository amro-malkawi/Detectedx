/**
 * Add New Item Form
 */
import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, Card} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Button from "@material-ui/core/Button";

class AddNewForm extends Component {

    onAddMetrics() {
        let { metrics } = this.props.addNewItemDetails;
        metrics.push('');
        this.props.onChangeAddNewItemDetails('metrics', metrics);
    }

    onChangeMetrics(index, value) {
        let { metrics } = this.props.addNewItemDetails;
        metrics[index] = value;
        this.props.onChangeAddNewItemDetails('metrics', metrics);
    }

    onRemoveMetrics(index) {
        let { metrics } = this.props.addNewItemDetails;
        metrics.splice(index, 1);
        this.props.onChangeAddNewItemDetails('metrics', metrics);
    }

    onAddRatingScales() {
        let {ratingScales} = this.props.addNewItemDetails;
        ratingScales.push({
            name: '',
            country: '',
            default_rating: '',
            max_rating: '',
            lesion_type: []
        });
        this.props.onChangeAddNewItemDetails('ratingScales', ratingScales);
    }

    onChangeRatingScales(index, key ,value) {
        let {ratingScales} = this.props.addNewItemDetails;
        ratingScales[index][key] = value;
        this.props.onChangeAddNewItemDetails('ratingScales', ratingScales);
    }

    onRemoveRatingScales(index) {
        let {ratingScales} = this.props.addNewItemDetails;
        ratingScales.splice(index, 1);
        this.props.onChangeAddNewItemDetails('ratingScales', ratingScales);
    }

    onAddLesionType(index) {
        let { ratingScales } = this.props.addNewItemDetails;
        ratingScales[index].lesion_type.push('');
        this.props.onChangeAddNewItemDetails('ratingScales', ratingScales);
    }

    onChangeLesionType(ratingScalesIndex, index, value) {
        let {ratingScales} = this.props.addNewItemDetails;
        ratingScales[ratingScalesIndex].lesion_type[index] = value;
        this.props.onChangeAddNewItemDetails('ratingScales', ratingScales);
    }

    onRemoveLesionType(ratingScalesIndex, index) {
        let {ratingScales} = this.props.addNewItemDetails;
        ratingScales[ratingScalesIndex].lesion_type.splice(index, 1);
        this.props.onChangeAddNewItemDetails('ratingScales', ratingScales);
    }


    renderMetrics() {
        const {addNewItemDetails, onChangeAddNewItemDetails, metricsList} = this.props;
        return(
            <RctCollapsibleCard heading="Metrics">
                {
                    addNewItemDetails.metrics.map((item, index) => {
                        return (
                            <div className={'ml-20'}>
                                <FormGroup>
                                    <Label for="metrics_id">Metric**</Label>
                                    <Input type="select" name="metrics_id" id="metrics_id" value={item}
                                           onChange={(e) => this.onChangeMetrics(index, e.target.value)}>
                                        <option key={-1}></option>
                                        {
                                            metricsList.map((item, index) => (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Button variant="contained" className="text-white btn-danger" onClick={() => this.onRemoveMetrics(index)}>Remove</Button>
                                </FormGroup>
                            </div>
                        )
                    })
                }
                <Button variant="contained" className="text-white btn-primary" onClick={() => this.onAddMetrics()}>Add Metrics</Button>
            </RctCollapsibleCard>
        );
    }

    renderRatingScales() {
        const {addNewItemDetails, onChangeAddNewItemDetails, metricsList} = this.props;
        return (
            <RctCollapsibleCard heading="Rating Scales">
                {
                    addNewItemDetails.ratingScales.map((item, index) => {
                        return (
                            <Card body key={index} className={'mt-5 mb-5'}>
                                <FormGroup>
                                    <Label for="name">Name</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder=""
                                        value={item.name}
                                        onChange={(e) => this.onChangeRatingScales(index, 'name', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="y">Country</Label>
                                    <Input
                                        type="text"
                                        name="country"
                                        id="country"
                                        placeholder=""
                                        value={item.country}
                                        onChange={(e) => this.onChangeRatingScales(index, 'country', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="default_rating">Default rating</Label>
                                    <Input
                                        type="number"
                                        name="default_rating"
                                        id="default_rating"
                                        placeholder=""
                                        value={item.default_rating}
                                        onChange={(e) => this.onChangeRatingScales(index,'default_rating', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="max_rating">Max rating</Label>
                                    <Input
                                        type="number"
                                        name="max_rating"
                                        id="max_rating"
                                        placeholder=""
                                        value={item.max_rating}
                                        onChange={(e) => this.onChangeRatingScales(index,'max_rating', e.target.value)}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Lesion Types</Label>
                                </FormGroup>
                                {this.renderLesionType(item, index)}
                                <FormGroup>
                                    <Button className="text-white btn-primary" onClick={() => this.onAddLesionType(index)}>Add Lesion Type</Button>
                                </FormGroup>
                                <FormGroup>
                                    <Button variant="contained" className="text-white btn-danger" onClick={() => this.onRemoveRatingScales(index)}>Remove</Button>
                                </FormGroup>
                            </Card>
                        )
                    })
                }
                <Button variant="contained" className="text-white btn-primary" onClick={() => this.onAddRatingScales()}>Add Rating Scale</Button>
            </RctCollapsibleCard>
        );
    }

    renderLesionType(ratingScalesItem, ratingScalesIndex) {
        return (
            <div className="ml-20 mt-10 mb-10">
                {
                    ratingScalesItem.lesion_type.map((item, index) => {
                        return (
                            <FormGroup key={index}>
                                <Label for="lesion_type_name">Name</Label>
                                <Input
                                    type="text"
                                    name="lesion_type_name"
                                    id="lesion_type_name"
                                    placeholder=""
                                    value={item}
                                    onChange={(e) => this.onChangeLesionType(ratingScalesIndex, index, e.target.value)}
                                />
                                <Button variant="contained" className="mt-10 text-white btn-danger" onClick={() => this.onRemoveLesionType(ratingScalesIndex, index)}>Remove</Button>
                            </FormGroup>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        const {addNewItemDetails, onChangeAddNewItemDetails } = this.props;
        return (
            <div>
                <RctCollapsibleCard>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder=""
                            value={addNewItemDetails.name}
                            onChange={(e) => onChangeAddNewItemDetails('name', e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="number_of_slides">Number of Images</Label>
                        <Input
                            type="number"
                            name="number_of_slides"
                            id="number_of_slides"
                            placeholder=""
                            value={addNewItemDetails.number_of_slides}
                            onChange={(e) => onChangeAddNewItemDetails('number_of_slides', e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="postcode">Circle size</Label>
                        <Input
                            type="text"
                            name="circle_size"
                            id="circle_size"
                            placeholder=""
                            value={addNewItemDetails.circle_size}
                            onChange={(e) => onChangeAddNewItemDetails('circle_size', e.target.value)}
                        />
                    </FormGroup>
                </RctCollapsibleCard>
                {this.renderMetrics()}
                {this.renderRatingScales()}
            </div>
        );
    }
}





const AddNewForm1 = ({addNewItemDetails, onChangeAddNewItemDetails}) => (
    <div>
        <FormGroup>
            <Label for="name">Name</Label>
            <Input
                type="text"
                name="name"
                id="name"
                placeholder=""
                value={addNewItemDetails.name}
                onChange={(e) => onChangeAddNewItemDetails('name', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="number_of_slides">Number of Images</Label>
            <Input
                type="number"
                name="number_of_slides"
                id="number_of_slides"
                placeholder=""
                value={addNewItemDetails.number_of_slides}
                onChange={(e) => onChangeAddNewItemDetails('number_of_slides', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="postcode">Circle size</Label>
            <Input
                type="text"
                name="circle_size"
                id="circle_size"
                placeholder=""
                value={addNewItemDetails.circle_size}
                onChange={(e) => onChangeAddNewItemDetails('circle_size', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default AddNewForm;