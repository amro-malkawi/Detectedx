import React from 'react';
import {isMobile} from 'react-device-detect';
import {Scrollbars} from "react-custom-scrollbars";

ScrollContainer.defaultProps = {
    className: '',
    style: {},
    autoHide: true,
    autoHideDuration: 100
}

function ScrollContainer({children, className, style, autoHide, autoHideDuration}) {
    if(isMobile) {
        return(
            <div className={className} style={style}>
                {children}
            </div>
        )
    } else {
        return (
            <Scrollbars
                className={className}
                style={style}
                autoHide={autoHide}
                autoHideDuration={autoHideDuration}
            >
                {children}
            </Scrollbars>
        )
    }
}

export default ScrollContainer;