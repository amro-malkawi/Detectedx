/**
 * Update Item Details Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const UpdateForm = ({item, onUpdateItemDetail, userList, clinicsList}) => (
    <div>
        <FormGroup>
            <Label for="user_id">User*</Label>
            <Input type="select" name="user_id" id="user_id" value={item.user_id} onChange={(e) => onUpdateItemDetail('user_id', e.target.value)}>
                <option key={-1} > </option>
                {
                    userList.map((item, index) => (
                        <option key={index} value={item.id}>{item.first_name} {item.last_name}</option>
                    ))
                }
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="clinic_id">Clinic*</Label>
            <Input type="select" name="clinic_id" id="clinic_id" value={item.clinic_id} onChange={(e) => onUpdateItemDetail('clinic_id', e.target.value)}>
                <option key={-1} > </option>
                {
                    clinicsList.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))
                }
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="position">Position</Label>
            <Input
                type="text"
                name="position"
                id="position"
                placeholder=""
                value={item.position}
                onChange={(e) => onUpdateItemDetail('position', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="position">Position other</Label>
            <Input
                type="text"
                name="position_other"
                id="position_other"
                placeholder=""
                value={item.position_other}
                onChange={(e) => onUpdateItemDetail('position_other', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default UpdateForm;
