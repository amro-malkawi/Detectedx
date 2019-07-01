/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from 'react';
import Loadable from 'react-loadable';

// rct page loader
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';


////// frontend

// advance components TestList
const AsyncAdvanceTestListComponent = Loadable({
    loader: () => import("Routes/test/list"),
    loading: () => <RctPageLoader/>,
});

// advance components TestView
const AsyncAdvanceTestViewComponent = Loadable({
    loader: () => import("Routes/test-view"),
    loading: () => <RctPageLoader/>,
});

// advance components Score
const AsyncAdvanceTestCompleteListComponent = Loadable({
    loader: () => import("Routes/test/complete-list"),
    loading: () => <RctPageLoader/>,
});

export {
    AsyncAdvanceTestListComponent,
    AsyncAdvanceTestViewComponent,
    AsyncAdvanceTestCompleteListComponent
};
