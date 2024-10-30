import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(null);
    const [confirmPasswordText, setConfirmPasswordText] = useState('Please confirm your password');

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
    }
    const handleSignUp = () => {
        if (password === confirmPassword) {
            setConfirmPasswordText('Please confirm your password')
            if (userType === 'client') {
                // add to client database
                navigate('/clienthome');
                console.log('client signed up successfully.');
            }
            else {
                // add to trainer database
                navigate('/trainerhome');
                console.log('trainer signed up successfully.');
            }
        }
        else {
            setConfirmPasswordText("Passwords don't match");
            console.log('sign up unsuccessful')
        }
    }

    const disabled = !email || !password || !confirmPassword || !userType;

    return (
        <div>
            <button title='Back' onClick={() => navigate(-1)}>Back</button>
            <h1>SignUp</h1>
            <div>
                <input 
                    type='text' 
                    value={email} 
                    onChange={handleEmail} 
                    placeholder='email'>
                </input>
                <p>Please enter your email</p>
            </div>
            <div>
                <input 
                    type='password' 
                    value={password} onChange={handlePassword} 
                    placeholder='password'>
                </input>
                <p>Please enter your password</p>
            </div>
            <div>
                <input 
                    type='password' 
                    value={confirmPassword} onChange={handleConfirmPassword} 
                    placeholder='confirm password'>
                </input>
                <p>{confirmPasswordText}</p>
            </div>
            <select value={userType} onChange={handleUserType}>
                <option value=''>Select your user type</option>
                <option value='client'>Client</option>
                <option value='trainer'>Trainer</option>
            </select>
            <button disabled={disabled} onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;