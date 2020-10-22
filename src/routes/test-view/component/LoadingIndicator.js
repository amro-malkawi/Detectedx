import React from 'react';

export default ({percentComplete}) => {
    if(percentComplete === 100) {
        return null
    } else {
        return (
            <div className="imageViewerLoadingIndicator loadingIndicator">
                <div className="indicatorContents">
                    <h2>
                        Loading...
                        <i className="fa fa-spin fa-circle-o-notch fa-fw" />{' '}
                    </h2>
                </div>
            </div>
        )
    }
}