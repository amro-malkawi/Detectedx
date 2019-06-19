/**
 * Add New User Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const AddNewUserForm = ({addNewUserDetails, onChangeAddNewUserDetails}) => (
    <div>
        <RctCollapsibleCard heading="Details">
            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter Title"
                    value={addNewUserDetails.title}
                    onChange={(e) => onChangeAddNewUserDetails('title', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="first_name">First name</Label>
                <Input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="Enter First Name"
                    value={addNewUserDetails.first_name}
                    onChange={(e) => onChangeAddNewUserDetails('first_name', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="last_name">Last name</Label>
                <Input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Enter Last Name"
                    value={addNewUserDetails.last_name}
                    onChange={(e) => onChangeAddNewUserDetails('last_name', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="gender">Gender</Label>
                <Input
                    type="text"
                    name="gender"
                    id="gender"
                    placeholder="Enter Gender"
                    value={addNewUserDetails.gender}
                    onChange={(e) => onChangeAddNewUserDetails('gender', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="year_of_birth">Year of birth</Label>
                <Input
                    type="text"
                    name="year_of_birth"
                    id="year_of_birth"
                    placeholder="Enter Year of birth"
                    value={addNewUserDetails.year_of_birth}
                    onChange={(e) => onChangeAddNewUserDetails('year_of_birth', e.target.value)}
                />
            </FormGroup>
        </RctCollapsibleCard>
        <RctCollapsibleCard heading="Login">
            <FormGroup>
                <Label for="email">Email*</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={addNewUserDetails.email}
                    onChange={(e) => onChangeAddNewUserDetails('email', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password*</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={addNewUserDetails.password}
                    onChange={(e) => onChangeAddNewUserDetails('password', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="confirm_password">Password confirmation</Label>
                <Input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="Enter Password again"
                    value={addNewUserDetails.confirm_password}
                    onChange={(e) => onChangeAddNewUserDetails('confirm_password', e.target.value)}
                />
            </FormGroup>
        </RctCollapsibleCard>
    </div>
);

export default AddNewUserForm;
