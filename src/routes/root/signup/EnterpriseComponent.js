import React, {useState, useEffect} from 'react';
import {Input} from "reactstrap";
import {Button} from '@material-ui/core';

function EnterpriseComponent({onSubmit}) {
    const [code, setCode] = useState('');
    const onKeyPress = (event) => {
        if(event.key === 'Enter' && code.length > 0) {
            onSubmit(code);
        }
    }


    return (
        <div className={'enterprise-card'}>
            <div className={'enterprise-card-content'}>
                <div className={'enterprise-card-data'}>
                    <div className={'d-flex justify-content-center'}>
                        <img src={require('Assets/img/main/header_logo.png')} className={'enterprise-site-logo'} alt={'pay-site-logo'}/>
                    </div>
                    <div className={'text-primary1 text-center mt-30'}>
                        YOU HAVE SELECTED
                    </div>
                    <div className={'text-white text-center fs-26 fw-semi-bold mt-1 mb-30'}>
                        Enterprise
                    </div>
                    <div className={'px-50'}>
                        <Input
                            type={'text'}
                            placeholder={'ENTER YOUR ENTERPRISE CODE'}
                            className={'enterprise-input'}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyPress={onKeyPress}
                        />
                        <Button className={'enterprise-submit-btn'} onClick={() => onSubmit(code)}>SUBMIT</Button>
                    </div>
                    <div className={'fs-17 text-center text-white mt-50 mb-20'}>
                        FOR SUPPORT CALL
                    </div>
                    <div className={'enterprise-phone-num text-primary1 text-center'}>
                        US: 833-940-4074
                    </div>
                    <div className={'enterprise-phone-num text-primary1 text-center'}>
                        AU: 1300 816 631
                    </div>
                    <div className={'enterprise-split-line'}/>
                    <div className={'enterprise-desc'}>
                        Don't have to code contact your<br/>
                        sales representative for assistance
                    </div>
                </div>
                <div className={'enterprise-card-bottom'}>
                    <span>Powered By Stripe | Legals</span>
                    <span className={'ml-3'}>Refunds</span>
                    <span className={'ml-3'}>Contact</span>
                </div>
            </div>
        </div>
    )
}

export default EnterpriseComponent;