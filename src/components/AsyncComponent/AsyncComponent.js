/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from 'react';
import Loadable from 'react-loadable';

// rct page loader
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';

// advance components TestView
const AsyncAdvanceTestViewComponent = Loadable({
    loader: () => import("Routes/test-view"),
    loading: () => <RctPageLoader/>,
});

export {
    AsyncAdvanceTestViewComponent,
};
