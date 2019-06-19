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
            <Label for="address">Name</Label>
            <Input
                type="text"
                name="address"
                id="address"
                placeholder=""
                value={item.address}
                onChange={(e) => onUpdateItemDetail('address', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="postcode">Postcode</Label>
            <Input
                type="text"
                name="postcode"
                id="postcode"
                placeholder=""
                value={item.postcode}
                onChange={(e) => onUpdateItemDetail('postcode', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="state">State</Label>
            <Input
                type="text"
                name="state"
                id="state"
                placeholder=""
                value={item.state}
                onChange={(e) => onUpdateItemDetail('state', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="country">Country</Label>
            <Input
                type="text"
                name="country"
                id="country"
                placeholder=""
                value={item.country}
                onChange={(e) => onUpdateItemDetail('country', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="email">Email</Label>
            <Input
                type="text"
                name="email"
                id="email"
                placeholder=""
                value={item.email}
                onChange={(e) => onUpdateItemDetail('email', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
                type="phone"
                name="phone"
                id="phone"
                placeholder=""
                value={item.phone}
                onChange={(e) => onUpdateItemDetail('phone', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default UpdateForm;
