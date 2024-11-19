import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientHome.css';
import ClientLog from './ClientLog';

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
            setTrainerInfo(null);
        } else {
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
            setFitnessPlanFetched(false);
            setFitnessPlan([]);
        } else {
            setFitnessPlanFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/fitness_plan`);
                setFitnessPlan(response.data);
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
            viewFitnessPlan(); // Refresh fitness plan data
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
            viewFitnessPlan(); // Refresh fitness plan data
        } catch (error) {
            console.error('Error updating meal status:', error);
        }
    };

    const checkReminders = async () => {
        if (remindersFetched) {
            setRemindersFetched(false);
            setReminders([]);
        } else {
            setRemindersFetched(true);
            try {
                const response = await axios.get(`/client/${clientId}/reminders`);
                setReminders(response.data);
            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        }
    };

    const markReminderComplete = async (reminderId) => {
        try {
            await axios.patch(`/client/${clientId}/update_reminder`, {
                reminder_id: reminderId,
                completed: true
            });
            checkReminders(); // Refresh reminders
        } catch (error) {
            console.error('Error marking reminder as complete:', error);
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
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
                <button className="update-button" onClick={() => navigate('/clientupdate')}>Update Profile</button>
            </div>
            <h1>Client Home Page</h1>

            {/* Trainer Info */}
            <button onClick={getTrainer}>View Trainer Info</button>
            {trainerFetched && (
                trainerInfo ? (
                    <div>
                        <h2>Trainer Information</h2>
                        <p>{trainerInfo.FirstName} {trainerInfo.LastName} ({trainerInfo.Specialty})</p>
                    </div>
                ) : (
                    <p>No trainer assigned.</p>
                )
            )}
            <ClientLog />

            {/* Fitness Plan */}
            <button onClick={viewFitnessPlan}>View Fitness Plan</button>
            {fitnessPlanFetched && fitnessPlan.length > 0 && (
                <div>
                    <h2>Fitness Plan</h2>
                    {fitnessPlan.map((plan, index) => (
                        <div key={index} className="fitness-plan">
                            <h3>{plan.Description} (Ends: {plan.EndDate || 'Ongoing'})</h3>
                            <h4>Exercises</h4>
                            <ul>
                                {plan.exercises.map((exercise) => (
                                    <li key={exercise.ExerciseID}>
                                        <input
                                            type="checkbox"
                                            checked={exercise.Completed}
                                            onChange={() => updateExerciseStatus(exercise.ExerciseID, !exercise.Completed)}
                                        />
                                        {exercise.Name} - {exercise.Reps} reps, {exercise.Sets} sets, {exercise.CaloriesBurned} cal
                                    </li>
                                ))}
                            </ul>
                            <h4>Meals</h4>
                            <ul>
                                {plan.meals.map((meal) => (
                                    <li key={meal.MealID}>
                                        <input
                                            type="checkbox"
                                            checked={meal.Completed}
                                            onChange={() => updateMealStatus(meal.MealID, !meal.Completed)}
                                        />
                                        {meal.meal_name} - {meal.Calories} cal, Protein: {meal.Protein}g, Carbs: {meal.Carbs}g, Fat: {meal.Fat}g
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Reminders */}
            <button onClick={checkReminders}>Check Reminders</button>
            {remindersFetched && reminders.length > 0 && (
                <div>
                    <h2>Reminders</h2>
                    <ul>
                        {reminders.map((reminder) => (
                            <li key={reminder.ReminderID}>
                                <input
                                    type="checkbox"
                                    checked={reminder.Completed}
                                    onChange={() => markReminderComplete(reminder.ReminderID)}
                                />
                                {reminder.Message} (Due: {reminder.ReminderDate})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Delete Account */}
            <button className="delete-button" onClick={deleteAccount}>Delete Account</button>
        </div>
    );
}

export default ClientHome;
