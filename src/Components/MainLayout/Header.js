import React, {useState, useEffect} from 'react';
import {Input} from 'reactstrap';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {IconButton} from "@mui/material";
import {logoutUserFromEmail} from "Store/Actions";
import {LanguageSelect} from "../LanguageSelect/LanguageSelect";

function Header(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.authUser.isLogin);
    const userName = useSelector((state) => state.authUser.userName);
    const userCompletedCount = useSelector((state) => state.authUser.completedCount);
    const userCompletedPoint = useSelector((state) => state.authUser.completedPoint);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const searchParam = searchParams.get('search');
        if(searchParam) {
            setSearchText(searchParam);
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
            onSearch();
        }
    }

    const onSearch = () => {
        let path;
        if(searchText.length > 0) {
            path = '/main?search=' + searchText;
        } else {
            path = '/main';
        }
        if (location.pathname.indexOf('/main')) {
            navigate(path, {replace: true});
        } else {
            navigate(path);
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
                <div className={'home-icon'} onClick={() => navigate('/main')}>
                    <img src={require('Assets/img/main/icon_home.svg').default} alt={''}/>
                </div>
                <div className={'search-input'}>
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={onSearchKeyPress}
                    />
                    <IconButton className={'search-input-btn'} onClick={onSearch}>
                        <img src={require('Assets/img/main/icon_search.svg').default} alt={''}/>
                    </IconButton>
                </div>
            </div>
            <div className={'header-user-info d-flex flex-row align-items-center'}>
                <div className={'header-user-avatar'} onClick={() => navigate('/main/profile')}>
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
                            <span className={'fs-23 fw-semi-bold cursor-pointer'} onClick={() => navigate('/main/profile')}>Login</span>
                    }
                    <div className={'fs-14 cursor-pointer'} onClick={() => navigate('/main/profile?tab=completed')}>
                        <span>COMPLETED<span className={'hide-mobile'}> MODULES</span>:</span>
                        <span className={'info-num'}>{isLogin ? (!isNaN(userCompletedCount) ? userCompletedCount : 0) : ''}</span>
                        <span><span className={'hide-mobile'}>THIS YEARS </span>CME POINTS:</span>
                        <span className={'info-num'}>{isLogin ? (!isNaN(userCompletedPoint) ? Number(userCompletedPoint).toFixed(2) : 0) : ''}</span>
                    </div>
                    <LanguageSelect />
                </div>
            </div>
        </div>
    )
}

export default Header;