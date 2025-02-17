/**
 * News Dashboard
 */

import React, { Component } from 'react'
import Content from './content';
import InstructionVideoLecture from "./InstructionVideoLecture";
import {Dialog} from "@mui/material";
import {withStyles} from "tss-react/mui";

export default class instruction extends Component {
    static defaultProps = {
    };
    render() {
        const {isOpen, onClose, theme, type, video} = this.props;
        if(type === undefined || type === null || type === 'null') return null;
        return (
            <FullDialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '80%'}}}>
                {
                    type === 'VIDEO-LECTURE' ? <InstructionVideoLecture onClose={onClose} theme={theme} type={type} video={video}/> : <Content onClose={onClose} theme={theme} type={type} video={video}/>
                }
            </FullDialog>
        )
    }
}

const FullDialog = withStyles(Dialog, (theme) => ({
    paper: {
        height: '100%',
        maxWidth: 1090
    }
}));
