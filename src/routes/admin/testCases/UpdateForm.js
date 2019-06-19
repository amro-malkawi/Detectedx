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
            <Label for="difficulty">Difficulty</Label>
            <Input
                type="number"
                name="difficulty"
                id="difficulty"
                placeholder=""
                value={item.difficulty}
                onChange={(e) => onUpdateItemDetail('difficulty', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default UpdateForm;
