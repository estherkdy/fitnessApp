import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Update.css';

function TrainerUpdate() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPasswordText, setConfirmPasswordText] = useState('Confirm your password:');
    const [isError] = useState(false); // Track if there's an error

    const trainerId = localStorage.getItem('trainerID');

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

    const deleteAccount = async () => {
        try {
            await axios.delete(`/trainer/${trainerId}/delete`);
            alert('Account deleted');
            localStorage.removeItem('trainerId');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return(
        <div>
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
                <label htmlFor="emailInput">Please enter your new email:</label>
                <input
                    id="emailInput"
                    type="text"
                    value={email}
                    onChange={handleEmail}
                    placeholder="email"
                />
            </div>
            <div>
                <label htmlFor="passwordInput">Please enter your new password:</label>
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
            <button>Update</button>

            {/* Delete Account */}
            <button className="delete-button" onClick={deleteAccount}>
                Delete Account
            </button>
        </div>
    );
}

export default TrainerUpdate;