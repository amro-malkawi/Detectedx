/**
 * Update Item Details Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const UpdateForm = ({item, onUpdateItemDetail, userList, testSetsList}) => (
    <div>
        <FormGroup>
            <Label for="user_id">Test Case*</Label>
            <Input type="select" name="user_id" id="user_id" value={item.user_id} onChange={(e) => onUpdateItemDetail('user_id', e.target.value)}>
                {
                    userList.map((item, index) => (
                        <option key={index} value={item.id}>{item.first_name} {item.last_name}</option>
                    ))
                }
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="test_set_id">Test Set*</Label>
            <Input type="select" name="test_set_id" id="test_set_id" value={item.test_set_id} onChange={(e) => onUpdateItemDetail('test_set_id', e.target.value)}>
                {
                    testSetsList.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))
                }
            </Input>
        </FormGroup>
    </div>
);

export default UpdateForm;
