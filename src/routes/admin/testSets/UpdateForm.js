/**
 * Update Item Details Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const UpdateForm = ({item, onUpdateItemDetail, modalitiesList}) => (
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
            <Label for="modality_id">Modality*</Label>
            <Input type="select" name="modality_id" id="modality_id" value={item.modality_id} onChange={(e) => onUpdateItemDetail('modality_id', e.target.value)}>
                {
                    modalitiesList.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))
                }
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="target_country">Target country</Label>
            <Input
                type="text"
                name="target_country"
                id="target_country"
                placeholder=""
                value={item.target_country}
                onChange={(e) => onUpdateItemDetail('target_country', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="target_state">Target state</Label>
            <Input
                type="text"
                name="target_state"
                id="target_state"
                placeholder=""
                value={item.target_state}
                onChange={(e) => onUpdateItemDetail('target_state', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="target_state">Difficulty</Label>
            <Input
                type="number"
                name="target_state"
                id="target_state"
                placeholder=""
                value={item.target_state}
                onChange={(e) => onUpdateItemDetail('difficulty', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default UpdateForm;
