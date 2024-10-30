import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Fitness Plan +</h1>
            <div>
                <button onClick={() => navigate('/clientlogin')}>Client Login</button>
                <button onClick={() => navigate('/trainerlogin')}>Trainer Login</button>
            </div>
            <p>Don't have an account?</p>
            <Link to='/signup'>Sign Up</Link>
        </div>
    );
}

export default Home;