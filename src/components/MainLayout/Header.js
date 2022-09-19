import React, {useState, useEffect} from 'react';
import {Input} from 'reactstrap';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from 'react-router-dom';
import {logoutUserFromEmail} from "Actions";
import * as selectors from "Selectors";
import QueryString from "query-string";

function Header(props) {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const userName = useSelector((state) => state.authUser.userName);
    const userCompletedCount = useSelector((state) => state.authUser.completedCount);
    const userCompletedPoint = useSelector((state) => state.authUser.completedPoint);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const param = QueryString.parse(location.search);
        if(param.search) {
            setSearchText(param.search);
        }
    }, []);

    const getAvatarChars = () => {
        if (!userName) return '';
        const names = userName.split(' ');
        if (names.length >= 2) {
            return names[0][0] + names[1][0];
        } else {
            return names[0][0] + names[0][1];
        }
    }

    const onSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            let path;
            if(searchText.length > 0) {
                path = '/main/home?search=' + searchText;
            } else {
                path = '/main/home';
            }
            if (history.location.pathname.indexOf('/main/home')) {
                history.replace(path);
            } else {
                history.push(path);
            }
        }
    }

    const onLogout = () => {
        dispatch(logoutUserFromEmail());
    }

    return (
        <div className={'main-header'}>
            <div className={'header-logo'}>
                <a href={'https://detectedx.com'}>
                    <img src={require('Assets/img/main/header_logo.png')} alt={''}/>
                </a>
            </div>
            <div className={'header-searchbar'}>
                <div className={'home-icon'} onClick={() => history.push('/main')}>
                    <img src={require('Assets/img/main/icon_home.svg')} alt={''}/>
                </div>
                <div className={'search-input'}>
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={onSearchKeyPress}
                    />
                    <img src={require('Assets/img/main/icon_search.svg')} alt={''}/>
                </div>
            </div>
            <div className={'header-user-info d-flex flex-row align-items-center'}>
                <div className={'header-user-avatar'} onClick={() => history.push('/main/profile')}>
                    {/*<img src={require('Assets/img/main/temp_user.png')} alt={''}/>*/}
                    {
                        isLogin ?
                            <span>{getAvatarChars()}</span> :
                            <i className={'zmdi zmdi-account'}/>
                    }
                </div>
                <div className={'info-block'}>
                    {
                        isLogin ?
                            <div className={'d-flex flex-row justify-content-between align-items-center'}>
                                <span className={'fs-23 fw-semi-bold'}>{userName}</span>
                                <span className={'fs-16 fw-semi-bold text-primary1 cursor-pointer'} onClick={onLogout}>LOGOUT</span>
                            </div> :
                            <span className={'fs-23 fw-semi-bold cursor-pointer'} onClick={() => history.push('/main/profile')}>Login</span>
                    }
                    <div className={'fs-14 cursor-pointer'} onClick={() => history.push('/main/profile?tab=completed')}>
                        <span>COMPLETED<span className={'hide-mobile'}> MODULES</span>:</span>
                        <span className={'info-num'}>{isLogin ? (!isNaN(userCompletedCount) ? userCompletedCount : 0) : ''}</span>
                        <span><span className={'hide-mobile'}>THIS YEARS </span>CME POINTS:</span>
                        <span className={'info-num'}>{isLogin ? (!isNaN(userCompletedPoint) ? Number(userCompletedPoint).toFixed(2) : 0) : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;