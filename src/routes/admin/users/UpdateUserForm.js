/**
 * Update User Details Form
 */
import React from 'react';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const UpdateUserForm = ({user, onUpdateUserDetail}) => (
    <div>
        <RctCollapsibleCard heading="Details">
            <Form>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Enter Title"
                        value={user.title}
                        onChange={(e) => onUpdateUserDetail('title', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="first_name">First name</Label>
                    <Input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="Enter First Name"
                        value={user.first_name}
                        onChange={(e) => onUpdateUserDetail('first_name', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="last_name">Last name</Label>
                    <Input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Enter Last Name"
                        value={user.last_name}
                        onChange={(e) => onUpdateUserDetail('last_name', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="gender">Gender</Label>
                    <Input
                        type="text"
                        name="gender"
                        id="gender"
                        placeholder="Enter Gender"
                        value={user.gender}
                        onChange={(e) => onUpdateUserDetail('gender', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="year_of_birth">Year of birth</Label>
                    <Input
                        type="text"
                        name="year_of_birth"
                        id="year_of_birth"
                        placeholder="Enter Year of birth"
                        value={user.year_of_birth}
                        onChange={(e) => onUpdateUserDetail('year_of_birth', e.target.value)}
                    />
                </FormGroup>
            </Form>
        </RctCollapsibleCard>
        <RctCollapsibleCard heading="Login">
            <FormGroup>
                <Label for="email">Email*</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={user.email}
                    onChange={(e) => onUpdateUserDetail('email', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password*</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={user.password}
                    onChange={(e) => onUpdateUserDetail('password', e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="confirm_password">Password confirmation</Label>
                <Input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="Enter Password again"
                    value={user.confirm_password}
                    onChange={(e) => onUpdateUserDetail('confirm_password', e.target.value)}
                />
            </FormGroup>
        </RctCollapsibleCard>
    </div>
);

export default UpdateUserForm;
