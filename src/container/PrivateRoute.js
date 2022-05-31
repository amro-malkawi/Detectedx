import React from 'react';
import * as selectors from "Selectors";
import {connect} from "react-redux";
import {Redirect, Route} from "react-router-dom";


const PrivateRoute = ({component: Component, ...rest, isLogin}) => {
    return (
        <Route
            {...rest}
            render={props =>
                isLogin
                    ? <Component {...props} />
                    : <Redirect
                        to={{
                            pathname: '/signin',
                            state: {from: props.location}
                        }}
                    />}
        />
    )
}
// map state to props
const mapStateToProps = (state) => ({
    isLogin: selectors.getIsLogin(state),
});

export default connect(mapStateToProps)(PrivateRoute);