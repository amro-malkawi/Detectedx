import React from 'react';

export default ({isLoaded}) => {
    if(isLoaded) {
        return null
    } else {
        return (
            <div className="imageViewerLoadingIndicator loadingIndicator">
                <div className="indicatorContents">
                    <h2>
                        {!isLoaded ? 'Loading...' : 'Loaded -'}
                        <i className="fa fa-spin fa-circle-o-notch fa-fw" />{' '}
                    </h2>
                </div>
            </div>
        )
    }
}