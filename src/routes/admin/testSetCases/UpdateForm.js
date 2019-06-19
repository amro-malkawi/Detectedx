/**
 * Update Item Details Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const UpdateForm = ({item, onUpdateItemDetail, testSetsList, testCasesList}) => (
    <div>
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
        <FormGroup>
            <Label for="test_case_id">Test Case*</Label>
            <Input type="select" name="test_case_id" id="test_case_id" value={item.test_case_id} onChange={(e) => onUpdateItemDetail('test_case_id', e.target.value)}>
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
    </div>
);

export default UpdateForm;
