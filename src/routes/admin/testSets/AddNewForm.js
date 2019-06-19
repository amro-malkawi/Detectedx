/**
 * Add New Item Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const AddNewForm = ({addNewItemDetails, onChangeAddNewItemDetails, modalitiesList}) => (
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
            <Label for="modality_id">Modality*</Label>
            <Input type="select" name="modality_id" id="modality_id" value={addNewItemDetails.modality_id} onChange={(e) => onChangeAddNewItemDetails('modality_id', e.target.value)}>
                <option key={-1} > </option>
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
                name=""
                id="target_country"
                placeholder=""
                value={addNewItemDetails.target_country}
                onChange={(e) => onChangeAddNewItemDetails('target_country', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="target_state">Target state</Label>
            <Input
                type="text"
                name="target_state"
                id="target_state"
                placeholder=""
                value={addNewItemDetails.target_state}
                onChange={(e) => onChangeAddNewItemDetails('target_state', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="target_state">Difficulty</Label>
            <Input
                type="number"
                name="target_state"
                id="target_state"
                placeholder=""
                value={addNewItemDetails.target_state}
                onChange={(e) => onChangeAddNewItemDetails('difficulty', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default AddNewForm;
