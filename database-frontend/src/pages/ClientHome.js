import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClientHome() {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/')}>Home</button>
            <h1>Client Home Page</h1>
            <button>View Trainer Info</button> {/* view trainer's info */}
            <button>View Fitness Plan</button> {/* view your fitness plan */}
            <button>Update Exeercise Status</button> {/* check off exercises completed */}
            <button>Update Meal Status</button> {/* check off meals eaten */}
            <button>Check Reminders</button> {/* check reminders */}
            <button>Delete Account</button> {/* Delete all user info */}
        </div>
    );
}

export default ClientHome;