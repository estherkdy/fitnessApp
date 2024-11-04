import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClientHome() {
    const navigate = useNavigate();
    const [trainerInfo, setTrainerInfo] = useState([]);
    const [fitnessPlan, setFitnessPlan] = useState([]);
    const [exerciseStatus, setExerciseStatus] = useState([]);
    const [mealStatus, setMealStatus] = useState([]);
    const [reminders, setReminders] = useState([]);
    const clientId = 1; // Replace with actual client ID, possibly from authentication

    const getTrainer = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/client/${clientId}/trainer`);
            setTrainerInfo([response.data]);
        } catch (error) {
            console.error('Error fetching trainer info:', error);
        }
    };

    const viewFitnessPlan = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/client/${clientId}/fitness_plan`);
            setFitnessPlan(response.data);
        } catch (error) {
            console.error('Error fetching fitness plan:', error);
        }
    };

    const updateExercisePlan = async () => {
        try {
            const response = await axios.patch(`http://localhost:5000/client/${clientId}/exercise_status`, {
                exercise_id: 1,  // Replace with actual exercise ID
                completed: true
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('Error updating exercise status:', error);
        }
    };

    const updateMealPlan = async () => {
        try {
            const response = await axios.patch(`http://localhost:5000/client/${clientId}/meal_status`, {
                meal_id: 1,  // Replace with actual meal ID
                completed: true
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('Error updating meal status:', error);
        }
    };

    const checkReminder = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/client/${clientId}/reminders`);
            setReminders(response.data);
        } catch (error) {
            console.error('Error fetching reminders:', error);
        }
    };

    const deleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:5000/client/${clientId}/delete`);
            alert('Account deleted');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="home">
            <button onClick={() => navigate('/')}>Home</button>
            <h1>Client Home Page</h1>
            <button onClick={getTrainer}>View Trainer Info</button>
            <button onClick={viewFitnessPlan}>View Fitness Plan</button>
            <button onClick={updateExercisePlan}>Update Exercise Status</button>
            <button onClick={updateMealPlan}>Update Meal Status</button>
            <button onClick={checkReminder}>Check Reminders</button>
            <button onClick={deleteAccount}>Delete Account</button>

            {/* Display Trainer Info */}
            {trainerInfo.length > 0 && (
                <div>
                    <h2>Trainer Information</h2>
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Name</th></tr>
                        </thead>
                        <tbody>
                            {trainerInfo.map((trainer, index) => (
                                <tr key={index}>
                                    <td>{trainer.TrainerID}</td>
                                    <td>{trainer.FirstName} {trainer.LastName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Similar code for displaying Fitness Plan, Exercise Status, Meal Status, and Reminders */}
        </div>
    );
}

export default ClientHome;
