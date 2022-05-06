import React, {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import classNames from "classnames";
import {useSelector} from "react-redux";
import PersonalComponent from "./PersonalComponent";
import BillingComponent from "./BillingComponent";
import CompletedComponent from "./CompletedComponent";
import SettingComponent from "./SettingComponent";
import QueryString from "query-string";
import {useHistory, useLocation} from "react-router-dom";

const tabList = [
    {value: 'personal', label: 'Personal Info', component: <PersonalComponent/>},
    {value: 'billing', label: 'Billing Info', component: <BillingComponent/>},
    {value: 'completed', label: 'Completed', component: <CompletedComponent/>},
    {value: 'settings', label: 'Settings', component: <SettingComponent/>},
];

function Profile() {
    const history = useHistory();
    const location = useLocation();
    const userName = useState(useSelector((state) => state.authUser.userName));
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    useEffect(() => {
        const param = QueryString.parse(location.search);
        if (param.tab) {
            const i = tabList.findIndex((v) => v.value === param.tab);
            if (i !== -1 && selectedTabIndex !== i) setSelectedTabIndex(i);
        }
    }, [location])

    const onChangeTab = (index) => {
        setSelectedTabIndex(index)
        history.replace(QueryString.stringifyUrl({url: location.pathname, query: {tab: tabList[index].value}}));
    }

    return (
        <div className={'main-profile'}>
            <div className={'mb-20 d-flex flex-row align-items-center'}>
                <span className={'fs-23 mr-2'}>Hi {userName}</span>
                <img src={require('Assets/img/main/icon_hand.png')} alt={''} width={27}/>
            </div>
            <div className={'main-profile-content'}>
                <div className={'profile-tab-container'}>
                    <div className={'profile-tab-list'}>
                        {
                            tabList.map((v, i) => (
                                <Button
                                    key={v.value}
                                    className={classNames('profile-tab', {'active': i === selectedTabIndex})}
                                    onClick={() => onChangeTab(i)}
                                >
                                    {v.label}
                                </Button>
                            ))
                        }
                    </div>
                </div>
                {
                    tabList[selectedTabIndex].component
                }
            </div>
        </div>
    )
}

export default Profile;