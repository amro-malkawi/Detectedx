import React from 'react';
import { CircularProgress } from '@mui/material';

export default ({type}) => {
    if(type === 'test-view') {
        return (
            <div className="loading-indicator test-view-loading-indicator">
                <div className="indicator-contents">
                    <CircularProgress />
                    <h2 className={'mt-20'}>
                        Loading...
                        <i className="fa fa-spin fa-circle-o-notch fa-fw"/>{' '}
                    </h2>
                </div>
            </div>
        )
    }else if(type === 'image') {
        return (
            <div className="loading-indicator image-loading-indicator">
                <div className="indicator-contents">
                    <h2>
                        Loading...
                        <i className="fa fa-spin fa-circle-o-notch fa-fw"/>{' '}
                    </h2>
                </div>
            </div>
        )
    } else {
        return null;
    }
}