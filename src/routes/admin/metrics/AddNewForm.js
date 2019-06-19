/**
 * Add New Item Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const AddNewForm = ({addNewItemDetails, onChangeAddNewItemDetails}) => (
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
            <Label for="range">Range</Label>
            <Input
                type="text"
                name="range"
                id="range"
                placeholder=""
                value={addNewItemDetails.range}
                onChange={(e) => onChangeAddNewItemDetails('range', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="description">Description</Label>
            <Input
                type="text"
                name="description"
                id="description"
                placeholder=""
                value={addNewItemDetails.description}
                onChange={(e) => onChangeAddNewItemDetails('description', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default AddNewForm;
