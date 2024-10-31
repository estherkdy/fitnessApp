import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerHome() {
    const navigate = useNavigate();

    return (
        <div className="home">
            <button onClick={() => navigate('/')}>Home</button>
            <h1>Trainer Home Page</h1>
            <button>View Clients</button> {/* view clients and info */}
            <button>Update Clients</button> {/* add or drop client */}
            <button>View Fitness Plan</button> {/* view client fitness plan */}
            <button>Update Client Workout Plan</button> {/* add or drop exercises */}
            <button>Update Client Meal Plan</button> {/* add or drop meals */}
            <button>Send Reminder</button> {/* add or drop meals */}
            <button>Delete Account</button> {/* Delete all user info */}
        </div>
    );
}

export default TrainerHome;
