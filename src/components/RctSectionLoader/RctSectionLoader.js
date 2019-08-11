/**
 * Rct Section Loader
 */
import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class RctSectionLoader extends Component{
    render() {
        return (
            <div className="d-flex justify-content-center loader-overlay" style={{...this.props.style}}>
                <CircularProgress />
            </div>
        )
    }
}