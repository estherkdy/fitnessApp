import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function AdminLogin() {
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
                user_type: 'admin',  
            });
            if (response.data.message === 'Login successful') {

                navigate('/adminhome'); 
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
        <div className='login'>
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>Admin Login</h1>
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
            <button disabled={disabled} onClick={handleLogin}>Log In</button>
        </div>
    );
}

export default AdminLogin;
