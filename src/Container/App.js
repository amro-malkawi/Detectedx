import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Navigate, Route, Routes, useLocation, Outlet} from 'react-router-dom';
import {isChrome, isEdge, isFirefox, isSafari} from "react-device-detect";
import ReactGA from "react-ga4";
import MainPage from 'Routes/main';
import AppSignIn from 'Routes/nologin/Signin';
import AppSignUp from 'Routes/nologin/signup';
import ForgotPassword from 'Routes/nologin/ForgotPassword';
import ResetPassword from 'Routes/nologin/ResetPassword';
import SendEmail from 'Routes/nologin/SendEmail';
import Confirm from 'Routes/nologin/Confirm';
import ChromeError from 'Routes/nologin/ChromeError';
import NoMatch from 'Routes/nologin/NoMatch';
import TestView from 'Routes/test-view/index';
import VideoView from 'Routes/test-view/VideoView';


function PrivateOutlet() {
    const authUser = useSelector(state => state.authUser);
    const {isLogin} = authUser;
    return isLogin ? <Outlet /> : <Navigate to="/signin" />;
}

function App(props) {

    useEffect(() => {
        ReactGA.initialize('G-JHV7X81227');
    }, []);

    if(!isChrome && !isFirefox && !isSafari && !isEdge) {
        return <ChromeError/>
    }

    return (
        <Routes>
            <Route path="/main/*" element={<MainPage/>} />
            <Route path="/signin" element={<AppSignIn/>}/>
            <Route path="/signup" element={<AppSignUp/>}/>
            <Route path="/plan" element={<AppSignUp/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/users/send-email/:user_id" element={<SendEmail/>}/>
            <Route path="/users/confirm" element={<Confirm/>}/>
            <Route element={<PrivateOutlet/>}>
                <Route path="/test-view/:test_sets_id/:attempts_id/:test_cases_id/:is_post_test" element={<TestView />}/>
            </Route>
            <Route path="/test-view/:test_sets_id/:attempts_id/:test_cases_id" element={<TestView />}/>
            <Route path="/video-view/:test_sets_id/:attempts_id/:test_cases_id" element={<VideoView />}/>

            <Route path="/" element={<Navigate replace to="/main" />} />
            <Route path='*' element={<NoMatch/>}/>
        </Routes>
    );
}

export default App;
