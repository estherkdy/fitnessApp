import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };
    const handlePassword = (event) => {
        setPassword(event.target.value);
    };
    const handleLogin = () => {
        // check for email and password in database
        navigate('/trainerhome')
    }

    const disabled = !email || !password;

    return (
        <div>
            <button title='Back' onClick={() => navigate(-1)}>Back</button>
            <h1>Trainer Login</h1>
            <input type='text' value={email} onChange={handleEmail} placeholder='email'></input>
            <input type='text' value={password} onChange={handlePassword} placeholder='password'></input>
            <button disabled={disabled} onClick={handleLogin}>Log In</button>
        </div>
    );
}

export default TrainerLogin;