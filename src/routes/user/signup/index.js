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
        name: 'Free',
        price: 0,
        access: 'LIMITED ACCESS',
        desc: '7 Day Free Trial',
        stripePlanId: 'price_1Kplj0LRKwvJbId7HD25ZrrD'
    },
    annual: {
        id: 'annual',
        name: 'Annual',
        price: 499,
        access: 'COMPLETE ACCESS',
        desc: 'Annual Plan',
        stripePlanId: 'price_1KpljlLRKwvJbId76Hk1uDcf'
    },
    monthly: {
        id: 'monthly',
        name: 'Monthly',
        price: 50,
        access: 'COMPLETE ACCESS',
        desc: 'Monthly Plan',
        stripePlanId: 'price_1Kplj0LRKwvJbId7HD25ZrrD'
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 0,

    }
}

function Index() {
    const history = useHistory();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const [step, setStep] = useState('info');  // info, plan, pay, enterpriseCode
    const [selectedPlan, setSelectedPlan] = useState(planList.annual);
    const [signupInfo, setSignupInfo] = useState({});

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
                plan.stripeKey = resp.stripeKey;
                plan.priceId = resp.stripePriceList[plan.id]
                setSelectedPlan(plan);
                setStep('pay');
            }).catch((e) => {
                NotificationManager.error(e.response ? e.response.data.error.message : e.message);
            });
        } else {
            setStep('enterpriseCode');
        }
    }

    const onSignUp = (type, value) => {
        const data = {signupInfo};
        if (type === 'enterpriseCode') {
            data.enterpriseCode = value
        } else if (type === 'pay') {
            data.paymentInfo = value
        } else {
            return;
        }

        Apis.signUp(data).then((result) => {
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
                        signupEmail={signupInfo.email}
                        plan={selectedPlan}
                        onPay={(subscriptionId, customerId, paymentIntentId) => onSignUp('pay', {subscriptionId, customerId, paymentIntentId, plan: selectedPlan.id})}
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