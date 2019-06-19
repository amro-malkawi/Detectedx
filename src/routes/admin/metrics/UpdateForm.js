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
            <Label for="range">Range</Label>
            <Input
                type="text"
                name="range"
                id="range"
                placeholder=""
                value={item.range}
                onChange={(e) => onUpdateItemDetail('range', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="description">Description</Label>
            <Input
                type="text"
                name="description"
                id="description"
                placeholder=""
                value={item.description}
                onChange={(e) => onUpdateItemDetail('description', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default UpdateForm;
