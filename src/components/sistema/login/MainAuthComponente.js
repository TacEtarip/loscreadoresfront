import React from 'react';
import './login.scss';
// import { useLocation } from 'react-router-dom';
import LoginComponente from './LoginComponente';

const MainAuthComponente = () => {
    // const location = useLocation();

    return (
        <div className="login-bg">
            <LoginComponente/>
        </div>
    )
};

export default MainAuthComponente;