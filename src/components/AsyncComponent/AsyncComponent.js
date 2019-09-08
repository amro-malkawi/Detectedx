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

// advance components attempt
const AsyncAdvanceTestAttemptComponent = Loadable({
    loader: () => import("Routes/test/attempt"),
    loading: () => <RctPageLoader/>,
});

// advance components Score
const AsyncAdvanceTestCompleteListComponent = Loadable({
    loader: () => import("Routes/test/complete-list"),
    loading: () => <RctPageLoader/>,
});

// user profile components
const AsyncAdvanceProfileComponent = Loadable({
    loader: () => import("Routes/test/profile"),
    loading: () => <RctPageLoader/>,
});

export {
    AsyncAdvanceTestListComponent,
    AsyncAdvanceTestViewComponent,
    AsyncAdvanceTestAttemptComponent,
    AsyncAdvanceTestCompleteListComponent,
    AsyncAdvanceProfileComponent
};
