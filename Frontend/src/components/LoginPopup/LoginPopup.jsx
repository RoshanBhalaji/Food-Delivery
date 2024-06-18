import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import axios from "axios";
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        email: ''
    });

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onLogin = async (e) => {
        e.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, formData);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error logging in or registering:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => { setShowLogin(false); }} src={assets.cross_icon} alt="close icon" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input
                            type="text"
                            placeholder='Your name'
                            name='name'
                            onChange={onChangeHandler}
                            value={formData.name}
                            required
                        />
                    )}
                    <input
                        type="email"
                        required
                        placeholder='Your email'
                        name='email'
                        value={formData.email}
                        onChange={onChangeHandler}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        name='password'
                        value={formData.password}
                        onChange={onChangeHandler}
                        required
                    />
                </div>
                <button type="submit">
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
