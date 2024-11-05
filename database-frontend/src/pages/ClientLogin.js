import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClientLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', {
                email,
                password,
                user_type: 'client',
            });
            if (response.data.message === 'Login successful') {
                const clientId = response.data.client_id;
                localStorage.setItem('clientId', clientId);
                navigate('/clienthome');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to log in');
        }
    };

    const disabled = !email || !password;

    return (
        <div className="login-container">
            <button title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>Client Login</h1>
            
            <div className="input-row">
                <input 
                    type="text" 
                    value={email} 
                    onChange={handleEmail} 
                    placeholder="Email"
                />
            </div>

            <div className="input-row">
                <input 
                    type="password" 
                    value={password} 
                    onChange={handlePassword} 
                    placeholder="Password"
                />
            </div>

            <div className="input-row">
                <button disabled={disabled} onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
}

export default ClientLogin;
