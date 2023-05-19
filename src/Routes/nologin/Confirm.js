/**
 * Sign Up
 */
import React, {useState, useEffect} from 'react';
import * as Apis from 'Api';
// import SweetAlert from 'react-bootstrap-sweetalert'
import {useNavigate, useSearchParams} from "react-router-dom";

function Confirm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [success, setSuccess] = useState(false);
    const [fault, setFault] = useState(false);

    useEffect(() => {
        const userId = searchParams.get('uid');
        const redirect = searchParams.get('redirect');
        const token = searchParams.get('token');
        if (userId === null || token === null) {
            navigate('/', {replace: true});
        } else {
            Apis.userConfirm(userId, token).then((resp) => {
                setSuccess(true);
            }).catch((e) => {
                setFault(true);
            });
        }
    }, []);

    return (
        <div>
            {
                success &&
                <div className={'text-center mt-40'}>
                    Your email address has been successfully verified.
                </div>
            }
            {
                fault &&
                <div className={'text-center mt-40'}>
                    Email Verification failed.
                </div>
            }
            {/*<SweetAlert success show={success} title={'Successful'} confirmBtnText={"Continue"} onConfirm={() => navigate('/', {replace: true})}>*/}
            {/*    Your email address has been successfully verified.*/}
            {/*</SweetAlert>*/}
            {/*<SweetAlert danger show={fault} title={"Failed"} confirmBtnText={"OK"} onConfirm={() => null}>*/}
            {/*    Email Verification failed.*/}
            {/*</SweetAlert>*/}
        </div>
    );
}

export default Confirm;