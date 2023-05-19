/**
 * Test Routes
 */
import React from 'react';
import {Navigate, Outlet, Routes, Route} from 'react-router-dom';
import MainLayout from "Components/MainLayout";
import HomeComponent from './home';
import ProfileComponent from './profile';
import AttemptComponent from './attempt';
import {useSelector} from "react-redux";


function PrivateOutlet() {
    const isLogin = useSelector((state) => state.authUser.isLogin);
    return isLogin ? <Outlet/> : <Navigate to="/signin"/>;
}

const Main = () => (
        <MainLayout>
            <Routes>
                <Route path="/" element={<HomeComponent/>}/>
                <Route element={<PrivateOutlet/>}>
                    <Route path='profile' element={<ProfileComponent/>}/>
                    <Route path='/attempt/:attempt_id/:step' element={<AttemptComponent/>}/>
                    <Route path='/attempt/:attempt_id' element={<AttemptComponent/>}/>
                </Route>
            </Routes>
        </MainLayout>
    )
;

export default Main;
