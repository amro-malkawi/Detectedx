import React, {useState, useEffect} from 'react';
import MainLayout from "Components/MainLayout";
import SignupFormComponent from "./SignupFormComponent";
import PlanComponent from "./PlanComponent";
import EnterpriseComponent from "./EnterpriseComponent";
import PayComponent from "./PayComponent";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import * as selectors from "Selectors";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import {login} from "Actions";


const planList = {
    free: {
        id: 'free',
        price: 0,

    },
    annual: {
        id: 'annual',
        price: 499,

    },
    monthly: {
        id: 'monthly',
        price: 50,

    },
    enterprise: {
        id: 'enterprise',
        price: 0,

    }
}

function Index() {
    const history = useHistory();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const [step, setStep] = useState('pay');  // info, plan, pay, enterpriseCode
    const [selectedPlan, setSelectedPlan] = useState(planList.annual);
    const [signupInfo, setSignupInfo] = useState(null);

    const [stripeKey, setStripeKey] = useState('ASNlAmrUflaRXLfCF_Y3Tg5JwkdQfFxC3f4VlVrhxD9LiTdRQIrjtSvZ45FdKUhlRQPNwCcdjrSNh3qA');
    const [paypalKey, setPaypalKey] = useState('pk_test_o94dTQYi7yrYebuzehraBcqk00QCQPvwhk');

    useEffect(() => {
        if (isLogin) {
            history.push('/');
        }
    }, []);

    const onCompleteInfo = (info, hasEnterpriseCode) => {
        setSignupInfo(info);
        if (hasEnterpriseCode) {
            setStep('enterpriseCode');
        } else {
            setStep('plan');
        }
    }

    const onSelectPlan = (plan) => {
        if (plan.id !== 'enterprise') {
            Apis.paymentInfo().then(resp => {
                setStripeKey(resp.stripe);
                setPaypalKey(resp.paypal);
                setSelectedPlan(plan);
                setStep('pay');
            }).catch((e) => {
                NotificationManager.error(e.response ? e.response.data.error.message : e.message);
            });
        } else {
            setStep('enterpriseCode');
        }
    }

    const onPayFinish = () => {
        console.log(signupInfo);
    }

    const onSignUp = (type, value) => {
        const data = {signupInfo};
        if (type === 'enterpriseCode') {
            data.enterpriseCode = value
        } else if (type === 'pay') {
            data.payData = value
        } else {
            return;
        }

        Apis.singUp(signupInfo).then((result) => {
            NotificationManager.success(<IntlMessages id={"user.createSuccessful"}/>);
            return Apis.login(signupInfo.email, signupInfo.password);
        }).then((result) => {
            dispatch(login(result.userId, result.userName, result.userEmail, result.id, history, '/'));
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        })
    }

    const renderComplete = () => {
        switch (step) {
            case 'info':
                return <SignupFormComponent onComplete={onCompleteInfo}/>;
            case 'plan':
                return <PlanComponent onSelectPlan={onSelectPlan} planList={planList}/>;
            case 'pay':
                return (
                    <PayComponent
                        plan={selectedPlan} stripeKey={stripeKey} paypalKey={paypalKey} onPay={(payData) => onSignUp('pay', payData)}
                    />
                );
            case 'enterpriseCode':
                return <EnterpriseComponent onSubmit={(code) => onSignUp('enterpriseCode', code)}/>;
            default:
                return null;
        }
    }

    return (
        <MainLayout>
            {renderComplete()}
        </MainLayout>
    )
}

export default Index;