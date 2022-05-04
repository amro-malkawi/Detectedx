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
import CircularProgress from "@material-ui/core/CircularProgress";
import {userSubscribe} from "Api";

function Index() {
    const history = useHistory();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const userEmail = selectors.getUserEmail(null);
    const [step, setStep] = useState(history.location.pathname === '/plan' ? 'plan' : 'info');  // info, plan, pay, enterpriseCode
    const [planList, setPlanList] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [signupInfo, setSignupInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isLogin && history.location.pathname !== '/plan') {
            history.push('/');
        }
        Apis.paymentInfo().then(resp => {
            setPlanList(resp);
            setLoading(false);
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }, []);

    const onCompleteInfo = (info, hasEnterpriseCode) => {
        setSignupInfo(info);
        if(!selectedPlan) {
            if (hasEnterpriseCode) {
                setStep('enterpriseCode');
            } else {
                setStep('plan');
            }
        } else {
            if (selectedPlan.id !== 'enterprise') {
                setStep('pay');
            } else {
                setStep('enterpriseCode');
            }
        }
    }

    const onSelectPlan = (plan) => {
        setSelectedPlan(plan);
        if(isLogin) {
            if (plan.id !== 'enterprise') {
                setStep('pay');
            } else {
                setStep('enterpriseCode');
            }
        } else {
            if(signupInfo) {
                if (plan.id !== 'enterprise') {
                    setStep('pay');
                } else {
                    setStep('enterpriseCode');
                }
            } else {
                setStep('info');
            }
        }
    }

    const onFinishPayment = (type, value) => {
        if(!isLogin && signupInfo) {
            // signup
            onSignUp(type, value);
        } else if(isLogin) {
            // user subscribe
            onUserSubscribe(type, value);
        } else {
            console.error('incorrect parameter');
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

    const onUserSubscribe = (type, value) => {
        const data = {};
        if (type === 'enterpriseCode') {
            data.enterpriseCode = value
        } else if (type === 'pay') {
            data.paymentInfo = value
        } else {
            return;
        }
        Apis.userSubscribe(data).then((result) => {
            NotificationManager.success('Subscription was succeeded');
            history.push('/main/profile?tab=billing');
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        })

    }

    const renderComponent = () => {
        if(loading) {
            return  <div className={'main-signup'}><CircularProgress /></div>
        }
        switch (step) {
            case 'info':
                return <SignupFormComponent onComplete={onCompleteInfo}/>;
            case 'plan':
                return <PlanComponent onSelectPlan={onSelectPlan} planList={planList}/>;
            case 'pay':
                return (
                    <PayComponent
                        signupEmail={!isLogin ? signupInfo.email : userEmail}
                        plan={selectedPlan}
                        onPay={(subscriptionId, customerId, paymentIntentId) => onFinishPayment('pay', {subscriptionId, customerId, paymentIntentId, plan: selectedPlan.id})}
                    />
                );
            case 'enterpriseCode':
                return <EnterpriseComponent onSubmit={(code) => onFinishPayment('enterpriseCode', code)}/>;
            default:
                return null;
        }
    }

    return (
        <MainLayout>
            {renderComponent()}
        </MainLayout>
    )
}

export default Index;