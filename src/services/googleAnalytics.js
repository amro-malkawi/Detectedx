import React, { useEffect } from "react";
import ReactGA from "react-ga";

ReactGA.initialize("UA-133482385-3");

const withGoogleTracker = (WrappedComponent, options = {}) => {
    const trackPage = (location, page) => {
        if(window.location.href.indexOf('rivelato') > -1) {
            ReactGA.set({
                page,
                ...options
            });
            ReactGA.pageview(page);
        }
    };

    const HOC = props => {
        useEffect(() => trackPage(props.location, props.location.pathname), [
            props.location.pathname
        ]);

        return <WrappedComponent {...props} />;
    };
    return HOC;
};

export default withGoogleTracker;