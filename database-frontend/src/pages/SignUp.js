import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; 

function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
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
    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    };
    const handleLastName = (event) => {
        setLastName(event.target.value);
    };
    const handleHeight = (event) => {
        setHeight(event.target.value);
    };
    const handleWeight = (event) => {
        setWeight(event.target.value);
    };
    const handleAge = (event) => {
        setAge(event.target.value);
    };
    
    const handleSignUp = () => {
        if (password === confirmPassword) {
            setConfirmPasswordText('Confirm your password:');
            setIsError(false); // Reset error state
            if (userType === 'client') {
                navigate('/clienthome');
                console.log('Client signed up successfully.');
                // Optionally log user details here
                console.log({ firstName, lastName, height, weight, age });
            } else {
                navigate('/trainerhome');
                console.log('Trainer signed up successfully.');
                // Optionally log user details here
                console.log({ firstName, lastName });
            }
        } else {
            setConfirmPasswordText("Passwords don't match");
            setIsError(true); // Set error state
            console.log('Sign up unsuccessful');
        }
    };

    const disabled = !email || !password || !confirmPassword || !userType || (userType === 'client' && (!height || !weight || !age)) || !firstName || !lastName;

    return (
        <div>
            <button title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>Sign Up</h1>
            <div>
                <label htmlFor="firstNameInput">First Name:</label>
                <input
                    id="firstNameInput"
                    type="text"
                    value={firstName}
                    onChange={handleFirstName}
                    placeholder="First Name"
                />
            </div>
            <div>
                <label htmlFor="lastNameInput">Last Name:</label>
                <input
                    id="lastNameInput"
                    type="text"
                    value={lastName}
                    onChange={handleLastName}
                    placeholder="Last Name"
                />
            </div>
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
            {userType === 'client' && (
                <>
                    <div>
                        <label htmlFor="heightInput">Height (cm):</label>
                        <input
                            id="heightInput"
                            type="number"
                            value={height}
                            onChange={handleHeight}
                            placeholder="Height"
                        />
                    </div>
                    <div>
                        <label htmlFor="weightInput">Weight (kg):</label>
                        <input
                            id="weightInput"
                            type="number"
                            value={weight}
                            onChange={handleWeight}
                            placeholder="Weight"
                        />
                    </div>
                    <div>
                        <label htmlFor="ageInput">Age:</label>
                        <input
                            id="ageInput"
                            type="number"
                            value={age}
                            onChange={handleAge}
                            placeholder="Age"
                        />
                    </div>
                </>
            )}
            <button disabled={disabled} onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;
