import React from 'react';

export default ({percentComplete}) => {
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