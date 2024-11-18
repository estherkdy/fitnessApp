// Home.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'
 

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Fitness Plan +</h1>
            <div className="login-buttons">
                <button onClick={() => navigate('/clientlogin')}>Client Login</button>
                <button onClick={() => navigate('/trainerlogin')}>Trainer Login</button>
            </div>
            <p>Don't have an account?</p>
            <Link to='/signup' className="signup-link">Sign Up</Link>
        </div>
    );
}

export default Home;
