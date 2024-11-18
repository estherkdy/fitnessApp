import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientHome.css';

function ClientHome() {
    const navigate = useNavigate();
    const [trainerInfo, setTrainerInfo] = useState(null);
    const [fitnessPlan, setFitnessPlan] = useState([]);
    const [reminders, setReminders] = useState([]);
    
    const [trainerFetched, setTrainerFetched] = useState(false);
    const [fitnessPlanFetched, setFitnessPlanFetched] = useState(false);
    const [remindersFetched, setRemindersFetched] = useState(false);

    const clientId = localStorage.getItem('clientId'); 

    const getTrainer = async () => {
        if (trainerFetched) {
            setTrainerFetched(false);
            setTrainerInfo(null)
        }
        else {
            setTrainerFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/trainer`);
                setTrainerInfo(response.data);
            } catch (error) {
                console.error('Error fetching trainer info:', error);
            }
        }
    };

    const viewFitnessPlan = async () => {
        if (fitnessPlanFetched) {
            setFitnessPlanFetched(false)
            setFitnessPlan([])
        }
        else {
            setFitnessPlanFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/fitness_plan`);
                setFitnessPlan(response.data);
                console.log("Fetched Fitness Plan:", response.data); // Log to verify data structure
            } catch (error) {
                console.error('Error fetching fitness plan:', error);
            }
        }
    };

    const updateExerciseStatus = async (exerciseId, completed) => {
        try {
            await axios.patch(`/client/${clientId}/exercise_status`, {
                exercise_id: exerciseId,
                completed: completed
            });
            console.log(`Exercise status updated to ${completed ? 'Complete' : 'Incomplete'}`);
            setFitnessPlanFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/fitness_plan`);
                setFitnessPlan(response.data);
                console.log("Fetched Fitness Plan:", response.data); // Log to verify data structure
            } catch (error) {
                console.error('Error fetching fitness plan:', error);
            } // Refresh fitness plan to show updated status
        } catch (error) {
            console.error('Error updating exercise status:', error);
        }
    };

    const updateMealStatus = async (mealId, completed) => {
        try {
            await axios.patch(`/client/${clientId}/meal_status`, {
                meal_id: mealId,
                completed: completed
            });
            console.log(`Meal status updated to ${completed ? 'Complete' : 'Incomplete'}`);
            setFitnessPlanFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/fitness_plan`);
                setFitnessPlan(response.data);
                console.log("Fetched Fitness Plan:", response.data); // Log to verify data structure
            } catch (error) {
                console.error('Error fetching fitness plan:', error);
            } // Refresh fitness plan to show updated status
        } catch (error) {
            console.error('Error updating meal status:', error);
        }
    };

    const checkReminders = async () => {
        if (remindersFetched) {
            setRemindersFetched(false);
            setReminders([])
        }
        else {
            setRemindersFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/reminders`);
                setReminders(response.data);
            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        }
    };

    const deleteAccount = async () => {
        try {
            await axios.delete(`/client/${clientId}/delete`);
            alert('Account deleted');
            localStorage.removeItem('clientId');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="home">
            <div className='button-box'>
                <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
                <button className='update-button' onClick={() => navigate('/clientupdate')}>Update Profile</button>
            </div>
            <h1>Client Home Page</h1>

            {/* Trainer Info */}
            <button onClick={getTrainer}>View Trainer Info</button>
            {trainerFetched && (
                trainerInfo ? (
                    <div>
                        <h2>Trainer Information</h2>
                        <table>
                            <thead>
                                <tr><th>Name</th><th>Specialty</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{trainerInfo.FirstName} {trainerInfo.LastName}</td>
                                    <td>{trainerInfo.Specialty}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No trainer assigned.</p>
                )
            )}

            {/* Fitness Plan with Update Buttons for Exercises and Meals */}
            <button onClick={viewFitnessPlan}>View Fitness Plan</button>
            {fitnessPlanFetched && (
                fitnessPlan.length > 0 ? (
                    <div>
                        <h2>Fitness Plan</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>End Date</th>
                                    <th>Exercises</th>
                                    <th>Meals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fitnessPlan.map((plan, index) => (
                                    <tr key={index}>
                                        <td>{plan.Description}</td>
                                        <td>{plan.EndDate}</td>
                                        <td>
                                            {plan.exercises && plan.exercises.length > 0 ? (
                                                plan.exercises.map(ex => (
                                                    <div key={ex.ExerciseID} className="exercise-item">
                                                        <span>{ex.Name}</span>
                                                        <button 
                                                            className="exercise-button"
                                                            onClick={() => updateExerciseStatus(ex.ExerciseID, !ex.Completed)}>
                                                            {ex.Completed ? "Mark as Incomplete" : "Mark as Complete"}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No exercises assigned.</p>
                                            )}
                                        </td>
                                        <td>
                                            {plan.meals && plan.meals.length > 0 ? (
                                                plan.meals.map(meal => (
                                                    <div key={meal.MealID} className="meal-item">
                                                        <span>{meal.meal_name}</span>
                                                        <button 
                                                            className="meal-button"
                                                            onClick={() => updateMealStatus(meal.MealID, !meal.Completed)}>
                                                            {meal.Completed ? "Mark as Incomplete" : "Mark as Complete"}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No meals assigned.</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No fitness plans found.</p>
                )
            )}

            {/* Reminders */}
            <button onClick={checkReminders}>Check Reminders</button>
            {remindersFetched && (
                reminders.length > 0 ? (
                    <div>
                        <h2>Reminders</h2>
                        <ul>
                            {reminders.map((reminder, index) => (
                                <li key={index}>
                                    {reminder.Message} (Due on: {reminder.ReminderDate})
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No reminders found.</p>
                )
            )}

            {/* Delete Account */}
            <button className='delete-button' onClick={deleteAccount}>Delete Account</button>
        </div>
    );
}

export default ClientHome;
