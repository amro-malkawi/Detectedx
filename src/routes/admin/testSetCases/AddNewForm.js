/**
 * Add New Item Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const AddNewForm = ({addNewItemDetails, onChangeAddNewItemDetails, testSetsList, testCasesList}) => (
    <div>
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
        <FormGroup>
            <Label for="test_case_id">Test Case*</Label>
            <Input type="select" name="test_case_id" id="test_case_id" value={addNewItemDetails.test_case_id} onChange={(e) => onChangeAddNewItemDetails('test_case_id', e.target.value)}>
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
                value={addNewItemDetails.position}
                onChange={(e) => onChangeAddNewItemDetails('position', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default AddNewForm;
