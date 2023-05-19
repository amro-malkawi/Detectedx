import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import CircularProgress from "@mui/material/CircularProgress";
import MainLayout from "Components/MainLayout";
import SignupFormComponent from "./SignupFormComponent";
import PlanComponent from "./PlanComponent";
import EnterpriseComponent from "./EnterpriseComponent";
import PayComponent from "./PayComponent";
import {useDispatch, useSelector} from "react-redux";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import {login} from "Store/Actions";
import moment from "moment";

function Index() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.authUser.isLogin);
    const userEmail =  useSelector((state) => state.authUser.userEmail);
    const [step, setStep] = useState(location.pathname === '/plan' ? 'plan' : 'info');  // info, plan, pay, enterpriseCode
    const [planList, setPlanList] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [signupInfo, setSignupInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isLogin && location.pathname !== '/plan') {
            navigate('/');
        }
        Apis.paymentInfo().then(resp => {
            setPlanList(resp);
            setLoading(false);
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }, []);

    const onSignUp = (info, hasEnterpriseCode) => {
        setSignupInfo(info);
        Apis.signUp(info).then((result) => {
            ReactGA.event('sign_up');
            NotificationManager.success("Register succeeded.");
            return Apis.login(info.email, info.password);
        }).then((result) => {
            dispatch(login(result.userId, result.userName, result.userEmail, result.id, navigate, null));
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
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        })
    }

    const onSelectPlan = (plan) => {
        if(plan.detail) {
            ReactGA.event('add_to_cart', {
                currency: plan.detail.currency,
                value: plan.detail.amount,
                items: [{
                    item_id: plan.detail.id,
                    item_name: plan.name,
                    currency: plan.detail.currency,
                    price: plan.detail.amount
                }]
            });
        }
        setSelectedPlan(plan);
        if(isLogin) {
            if(plan.id === 'enterprise') {
                setStep('enterpriseCode');
            } else if(plan.id === 'free') {
                onUserSubscribe('free', {});
            } else {
                setStep('pay');
            }
        } else {
            if(signupInfo) {
                if(plan.id === 'enterprise') {
                    setStep('enterpriseCode');
                } else if(plan.id === 'free') {
                    onUserSubscribe('free', {});
                } else {
                    setStep('pay');
                }
            } else {
                setStep('info');
            }
        }
    }

    const onFinishPayment = (type, value, discountCode) => {
        if(selectedPlan && selectedPlan.detail) {
            ReactGA.event('purchase', {
                currency: selectedPlan.detail.currency,
                transaction_id: value.paymentIntentId,
                value: selectedPlan.detail.amount,
                coupon: discountCode,
                items: [{
                    item_id: selectedPlan.detail.id,
                    item_name: selectedPlan.name,
                    currency: selectedPlan.detail.currency,
                    price: selectedPlan.detail.amount
                }]
            });
        }
        if(isLogin) {
            // user subscribe
            onUserSubscribe(type, value);
        } else {
            console.error('incorrect parameter');
        }
    }

    // const onSignUp = (type, value) => {
    //     const data = {signupInfo};
    //     if (type === 'enterpriseCode') {
    //         data.enterpriseCode = value
    //     } else if (type === 'pay') {
    //         data.paymentInfo = value
    //     } else {
    //         return;
    //     }
    //
    //     Apis.signUp(data).then((result) => {
    //         NotificationManager.success(<IntlMessages id={"user.createSuccessful"}/>);
    //         return Apis.login(signupInfo.email, signupInfo.password);
    //     }).then((result) => {
    //         dispatch(login(result.userId, result.userName, result.userEmail, result.id, history, '/'));
    //     }).catch((e) => {
    //         NotificationManager.error(e.response ? e.response.data.error.message : e.message);
    //     })
    // }

    const onUserSubscribe = (type, value) => {
        const data = {};
        if (type === 'enterpriseCode') {
            data.enterpriseCode = value
        } else if (type === 'pay') {
            data.paymentInfo = value
        } else if (type === 'free') {
            data.paymentInfo = {amount: 0};
        } else {
            return;
        }
        Apis.userSubscribe(data).then((result) => {
            if(type === 'free') {
                const expiredDate = moment().add(7, 'days');
                NotificationManager.success('Thank you for subscribing, your trial ends on ' + expiredDate.format('MMM Do YYYY'));
            } else {
                NotificationManager.success('Subscription was succeeded');
            }
            if(location.pathname === '/plan') {
                navigate('/main/profile?tab=billing');
            } else {
                navigate('/');
            }
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
                return <SignupFormComponent onComplete={onSignUp}/>;
            case 'plan':
                return <PlanComponent onSelectPlan={onSelectPlan} planList={planList}/>;
            case 'pay':
                return (
                    <PayComponent
                        signupEmail={!isLogin ? signupInfo.email : userEmail}
                        plan={selectedPlan}
                        onPay={(subscriptionId, customerId, paymentIntentId, discountCode) => onFinishPayment('pay', {subscriptionId, customerId, paymentIntentId, plan: selectedPlan.id}, discountCode)}
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