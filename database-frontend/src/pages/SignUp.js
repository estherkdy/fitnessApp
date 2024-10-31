import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; 

function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(null);
    const [confirmPasswordText, setConfirmPasswordText] = useState('Confirm your password:');
    const [isError, setIsError] = useState(false); // Track if there's an error

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };
    const handlePassword = (event) => {
        setPassword(event.target.value);
    };
    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    };
    const handleUserType = (event) => {
        setUserType(event.target.value);
    };
    const handleSignUp = () => {
        if (password === confirmPassword) {
            setConfirmPasswordText('Confirm your password:');
            setIsError(false); // Reset error state
            if (userType === 'client') {
                navigate('/clienthome');
                console.log('client signed up successfully.');
            } else {
                navigate('/trainerhome');
                console.log('trainer signed up successfully.');
            }
        } else {
            setConfirmPasswordText("Passwords don't match");
            setIsError(true); // Set error state
            console.log('sign up unsuccessful');
        }
    };

    const disabled = !email || !password || !confirmPassword || !userType;

    return (
        <div>
            <button title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>Sign Up</h1>
            <div>
                <label htmlFor="emailInput">Please enter your email:</label>
                <input
                    id="emailInput"
                    type="text"
                    value={email}
                    onChange={handleEmail}
                    placeholder="email"
                />
            </div>
            <div>
                <label htmlFor="passwordInput">Please enter your password:</label>
                <input
                    id="passwordInput"
                    type="password"
                    value={password}
                    onChange={handlePassword}
                    placeholder="password"
                />
            </div>
            <div>
                <label htmlFor="confirmPasswordInput">
                    <span className={isError ? "error-text" : ""}>
                        {confirmPasswordText}
                    </span>
                </label>
                <input
                    id="confirmPasswordInput"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    placeholder="confirm password"
                />
            </div>
            <div>
                <label htmlFor="userTypeSelect">Select your user type:</label>
                <select id="userTypeSelect" value={userType} onChange={handleUserType}>
                    <option value="">Select your user type</option>
                    <option value="client">Client</option>
                    <option value="trainer">Trainer</option>
                </select>
            </div>
            <button disabled={disabled} onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;
