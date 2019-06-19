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
            <Label for="difficulty">Difficulty</Label>
            <Input
                type="number"
                name="difficulty"
                id="difficulty"
                placeholder=""
                value={addNewItemDetails.difficulty}
                onChange={(e) => onChangeAddNewItemDetails('difficulty', e.target.value)}
            />
        </FormGroup>
    </div>
);

export default AddNewForm;
