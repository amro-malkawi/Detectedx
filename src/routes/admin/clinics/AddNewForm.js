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
            <Label for="address">Address</Label>
            <Input
                type="text"
                name="address"
                id="address"
                placeholder=""
                value={addNewItemDetails.address}
                onChange={(e) => onChangeAddNewItemDetails('address', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="postcode">Postcode</Label>
            <Input
                type="text"
                name="postcode"
                id="postcode"
                placeholder=""
                value={addNewItemDetails.postcode}
                onChange={(e) => onChangeAddNewItemDetails('postcode', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="state">State</Label>
            <Input
                type="text"
                name="state"
                id="state"
                placeholder=""
                value={addNewItemDetails.state}
                onChange={(e) => onChangeAddNewItemDetails('state', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="country">Country</Label>
            <Input
                type="text"
                name="country"
                id="country"
                placeholder=""
                value={addNewItemDetails.country}
                onChange={(e) => onChangeAddNewItemDetails('country', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="email">Email</Label>
            <Input
                type="text"
                name="email"
                id="email"
                placeholder=""
                value={addNewItemDetails.email}
                onChange={(e) => onChangeAddNewItemDetails('email', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
                type="phone"
                name="phone"
                id="phone"
                placeholder=""
                value={addNewItemDetails.phone}
                onChange={(e) => onChangeAddNewItemDetails('phone', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default AddNewForm;
