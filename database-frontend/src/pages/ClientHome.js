import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientHome() {
    const navigate = useNavigate();

        // Statevariables for the data
        const [trainerInfo, setTrainerInfo] = useState([]);
        const [fitnessPlan, setFitnessPlan] = useState([]);
        const [exerciseStatus, setExerciseStatus] = useState([]);
        const [mealStatus, setMealStatus] = useState([]);
        const [reminders, setReminders] = useState([]);


        const getTrainer = () => {
            // Placeholder data, replace when connected with backend
            const trainers = [
                { id: 1, name: 'Esther Kim' },
                { id: 2, name: 'K' },
            ];
            setTrainerInfo(trainers);
            setFitnessPlan([]);
            setExerciseStatus([]);
            setMealStatus([]);
            setReminders([]);
        };

        // viewing the fitness plan
        const viewFitnessPlan = () => {
            // day and exercise for that day
            const plans = [
                { day: 'Monday', exercises: 'Squats, Lunges' },
                { day: 'Wednesday', exercises: 'Push-ups, Planks' },
            ];
            setTrainerInfo([]);
            setFitnessPlan(plans);
            setExerciseStatus([]);
            setMealStatus([]);
            setReminders([]);
        };

        const updateExercisePlan = () => {
            // bool for if an exercise is completed or not
            const updatedStatus = [
                { exercise: 'Squats', completed: true },
                { exercise: 'Lunges', completed: false },
            ];
            setTrainerInfo([]);
            setFitnessPlan([]);
            setExerciseStatus(updatedStatus);
            setMealStatus([]);
            setReminders([]);
        };

        const updateMealPlan = () => {
            // meal plam
            const meals = [
                { meal: 'Breakfast', eaten: true },
                { meal: 'Lunch', eaten: false },
            ];
            setTrainerInfo([]);
            setFitnessPlan([]);
            setExerciseStatus([]);
            setMealStatus(meals);
            setReminders([]);
        };
    
        const checkReminder = () => { 
            const remindersList = [
                { id: 1, reminder: 'Drink water every hour' },
                { id: 2, reminder: 'Do stretching exercises' },
            ];
            setTrainerInfo([]);
            setFitnessPlan([]);
            setExerciseStatus([]);
            setMealStatus([]);
            setReminders(remindersList);
        };

        const deleteAccount = () => {
            
            console.log('Account deleted');
            
        };
    
    return (
        <div className="home">
            <button onClick={() => navigate('/')}>Home</button>
            <h1>Client Home Page</h1>
            <button onClick={getTrainer}>View Trainer Info</button> {/* view trainer's info */}
            <button onClick={viewFitnessPlan}>View Fitness Plan</button> {/* view your fitness plan */}
            <button onClick={updateExercisePlan}>Update Exercise Status</button> {/* check off exercises completed */}
            <button onClick={updateMealPlan}>Update Meal Status</button> {/* check off meals eaten */}
            <button onClick={checkReminder}>Check Reminders</button> {/* check reminders */}
            <button onClick={deleteAccount}>Delete Account</button> {/* Delete all user info */}


                {/* Displaying trainer information */}
                {trainerInfo.length > 0 && (
                <div>
                    <h2>Trainer Information</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {trainerInfo.map((trainer) => (
                                <tr key={trainer.id}>
                                    <td>{trainer.id}</td>
                                    <td>{trainer.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Display Fitness Plan */}
            {fitnessPlan.length > 0 && (
                <div>
                    <h2>Fitness Plan</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Exercises</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fitnessPlan.map((plan, index) => (
                                <tr key={index}>
                                    <td>{plan.day}</td>
                                    <td>{plan.exercises}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

                  {/* Display Exercise Status */}
                  {exerciseStatus.length > 0 && (
                <div>
                    <h2>Exercise Status</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Exercise</th>
                                <th>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exerciseStatus.map((status, index) => (
                                <tr key={index}>
                                    <td>{status.exercise}</td>
                                    <td>{status.completed ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

                       {/* Display Meal Status */}
                       {mealStatus.length > 0 && (
                <div>
                    <h2>Meal Status</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Meal</th>
                                <th>Eaten</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealStatus.map((meal, index) => (
                                <tr key={index}>
                                    <td>{meal.meal}</td>
                                    <td>{meal.eaten ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

                        {/* Display Reminders */}
                        {reminders.length > 0 && (
                <div>
                    <h2>Reminders</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Reminder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reminders.map((reminder) => (
                                <tr key={reminder.id}>
                                    <td>{reminder.id}</td>
                                    <td>{reminder.reminder}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}






        </div>
    );
}

export default ClientHome;
