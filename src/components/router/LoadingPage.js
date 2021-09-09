// import PropTypes from 'prop-types'; 
import React from 'react';
import logo from '../../assets/images/logo.svg';
import './loadingpage.scss';
export const LoadingPage = () => {
    return (
        <div className="loading-page">
            <img className="loading-logo" width="300px" src={logo} alt='logoloading'/>
        </div>
    )
};

/*LandingPage.propTypes = {
    onHide: PropTypes.func,
}*/