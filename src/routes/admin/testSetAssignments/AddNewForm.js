/**
 * Add New Item Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const AddNewForm = ({addNewItemDetails, onChangeAddNewItemDetails, userList, testSetsList}) => (
    <div>
        <FormGroup>
            <Label for="user_id">User*</Label>
            <Input type="select" name="user_id" id="user_id" value={addNewItemDetails.user_id} onChange={(e) => onChangeAddNewItemDetails('user_id', e.target.value)}>
                <option key={-1} > </option>
                {
                    userList.map((item, index) => (
                        <option key={index} value={item.id}>{item.first_name} {item.last_name}</option>
                    ))
                }
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="test_set_id">Test Set*</Label>
            <Input type="select" name="test_set_id" id="test_set_id" value={addNewItemDetails.test_set_id} onChange={(e) => onChangeAddNewItemDetails('test_set_id', e.target.value)}>
                <option key={-1} > </option>
                {
                    testSetsList.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))
                }
            </Input>
        </FormGroup>
    </div>
);

export default AddNewForm;
