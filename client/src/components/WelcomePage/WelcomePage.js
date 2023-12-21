import React from 'react';
import { Link } from 'react-router-dom';

import "./WelcomePage.css"

export default function WelcomePage(props) {

    return (
        <div className='welcome'>
            <div className='nameOfWebsite'>Welcome to <br/>Fake Stack Overflow</div>
            <div className='userOptions'>
                <Link to="/welcome/SignUpPage"><input type="button" className='option1' value="Register as a new user" /></Link>
                <Link to="/welcome/LoginPage"><input type="button" className='option2' value="Login as an existing user" /></Link>
                <Link to="/welcome/HomePage"><input type="button" className='option3' value="Continue as a Guest" /></Link>
            </div>
        </div>
    );
}
