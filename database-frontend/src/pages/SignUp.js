import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const [isError, setIsError] = useState(false);  
    const [emailError, setEmailError] = useState(''); 
    const [trainerSpecialty, setTrainerSpecialty] = useState(null);

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
    const handleTrainerSpecialty = (event) => {
        setTrainerSpecialty(event.target.value);
    };
    const handleHeight = (event) => {
        const value = Math.max(0, event.target.value);  
        setHeight(value);
    };
    const handleWeight = (event) => {
        const value = Math.max(0, event.target.value);  
        setWeight(value);
    };
 
    const handleAge = (event) => {
        const value = Math.max(0, event.target.value);  
        setAge(value);
    };

    const handleSignUp = async () => {
        console.log('Sign up button clicked');
        
        // Email validation
        if (!email.includes('@')) {
            setEmailError('Please enter a valid email address.');
            return;  
        } else {
            setEmailError('');  
        }

        if (password === confirmPassword) {
            console.log('Passwords match');
            setConfirmPasswordText('Confirm your password:');
            setIsError(false);
    
            const userData = {
                firstName,
                lastName,
                email,
                password,
                user_type: userType,
                ...(userType === 'client' && { height, weight, age }),
                ...(userType === 'trainer' && { trainerSpecialty }),
            };
    
            try {
                console.log('Sending data:', userData);
                const response = await axios.post('/signup', userData, { withCredentials: true });
                console.log('Response:', response.data);
                if (userType === 'client') {
                    navigate('/clienthome');
                } else {
                    navigate('/trainerhome');
                }
            } catch (error) {
                console.error("Sign-up error: ", error);
            }
        } else {
            console.log("Passwords don't match");
            setConfirmPasswordText("Passwords don't match");
            setIsError(true);
        }
    };

    const disabled = !email || !password || !confirmPassword || !userType || (userType === 'client' && (!height || !weight || !age)) || !firstName || !lastName || (userType === 'trainer' && (!trainerSpecialty));

    return (
        <div className='center-container'>
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
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
            {userType === 'trainer' && (
                <>
                    <label htmlFor="trainerSpecialtySelect">Select your trainer specialty:</label>
                    <select id="trainerSpecialtySelect" value={trainerSpecialty} onChange={handleTrainerSpecialty}>
                        <option value="">Select your trainer specialty</option>
                        <option value="strength_training">Strength Training</option>
                        <option value="muscular_endurance">Muscular Endurance</option>
                        <option value="cardio_endurance">Cardiovascular Endurance</option>
                        <option value="dietician">Dietician</option>
                        <option value="life_coach">Life Coach</option>
                    </select>
                </>
            )}
            
            {emailError && <div className="error-text">{emailError}</div>}
            
            <button disabled={disabled} onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;
