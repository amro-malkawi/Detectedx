/**
 * Update Item Details Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const UpdateForm = ({item, onUpdateItemDetail}) => (
    <div>
        <FormGroup>
            <Label for="name">Name</Label>
            <Input
                type="text"
                name="name"
                id="name"
                placeholder=""
                value={item.name}
                onChange={(e) => onUpdateItemDetail('name', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="number_of_slides">Number of Images</Label>
            <Input
                type="number"
                name="number_of_slides"
                id="number_of_slides"
                placeholder=""
                value={item.number_of_slides}
                onChange={(e) => onUpdateItemDetail('number_of_slides', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="postcode">Circle size</Label>
            <Input
                type="text"
                name="circle_size"
                id="circle_size"
                placeholder=""
                value={item.circle_size}
                onChange={(e) => onUpdateItemDetail('circle_size', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default UpdateForm;
