import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Update.css';
import axios from 'axios';

function ClientUpdate() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [confirmPasswordText, setConfirmPasswordText] = useState('Confirm password:');
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

    const clientId = localStorage.getItem('clientId');

 
      const deleteAccount = async () => {
        try { 
            const response = await axios.delete(`/client/${clientId}/delete`);
            alert('Account deleted');
            localStorage.removeItem('clientId');   
            navigate('/');   
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('There was an error deleting your account. Please try again.');
        }
    };

    return(
        <div className='center-container'>
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>Update Select Info</h1>
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
                <label htmlFor="passwordInput">Please enter your new password password:</label>
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
            <button>Update</button>
            {/* Delete Account */}
            <button className="delete-button" onClick={deleteAccount}>Delete Account</button>
        </div>
    );
}

export default ClientUpdate;
