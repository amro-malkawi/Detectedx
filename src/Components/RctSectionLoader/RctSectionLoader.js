/**
 * Rct Section Loader
 */
import React, {Component} from 'react';
import {CircularProgress} from '@mui/material';

export default class RctSectionLoader extends Component{
    render() {
        return (
            <div className="d-flex justify-content-center align-items-center loader-overlay" style={{...this.props.style}}>
                <CircularProgress />
            </div>
        )
    }
}