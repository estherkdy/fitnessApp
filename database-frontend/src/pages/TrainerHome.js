import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrainerHome.css';

function TrainerHome() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [fitnessPlans, setFitnessPlans] = useState([]);
    const [reminderMessage, setReminderMessage] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [plansFetched, setPlansFetched] = useState(false);
    const [clientsFetched, setClientsFetched] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null); 
    const [newDescription, setNewDescription] = useState("");
    const [unassignedClients, setUnassignedClients] = useState([]);
    const [unassignedFetched, setUnassignedFetched] = useState(false);
    const [selectedUnassignedClient, setSelectedUnassignedClient] = useState(null);

    const trainerId = localStorage.getItem('trainerID');

    const viewClients = async () => {
        if (clientsFetched) {
            setClientsFetched(false);
            setClients([]);
        } else {
            setClientsFetched(true);
            try {
                const response = await axios.get(`/trainer/${trainerId}/clients`);
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        }
    };

    const viewUnassignedClients = async () => {
        if (unassignedFetched) {
            setUnassignedFetched(false);
            setUnassignedClients([]);
        } else {
            setUnassignedFetched(true);
            try {
                const response = await axios.get(`/trainer/${trainerId}/unassigned_clients`);
                setUnassignedClients(response.data);
            } catch (error) {
                console.error('Error fetching unassigned clients:', error);
            }
        }
    };

    const assignClient = async () => {
        if (!selectedUnassignedClient) {
            alert('Please select a client to assign.');
            return;
        }
        try {
            const response = await axios.post(`/trainer/${trainerId}/assign_client`, {
                client_id: selectedUnassignedClient,
            });
            alert(response.data.message);
            setSelectedUnassignedClient(null);
            viewUnassignedClients(); // Refresh unassigned clients
        } catch (error) {
            console.error('Error assigning client:', error);
        }
    };

    const viewFitnessPlans = async () => {
        if (plansFetched) {
            setPlansFetched(false);
            setFitnessPlans([]);
        } else {
            setPlansFetched(true);
            try {
                const response = await axios.get(`/trainer/${trainerId}/fitness_plans`);
                setFitnessPlans(response.data);
            } catch (error) {
                console.error('Error fetching fitness plans:', error);
            }
        }
    };

    const startEditingPlan = (planId, currentDescription) => {
        setEditingPlanId(planId);
        setNewDescription(currentDescription); 
    };

    const submitDescriptionUpdate = async () => {
        try {
            await axios.patch(`/trainer/${trainerId}/update_plan`, {
                plan_id: editingPlanId,
                description: newDescription,
            });
            console.log("Plan description updated");
            setEditingPlanId(null); 
            viewFitnessPlans(); 
        } catch (error) {
            console.error('Error updating fitness plan:', error);
        }
    };

    const sendReminder = async () => {
        try {
            const response = await axios.post(`/trainer/${trainerId}/set_reminder`, {
                client_id: selectedClientId,
                message: reminderMessage,
                reminder_date: reminderDate
            });
            console.log(response.data.message);
            setReminderMessage("");
            setReminderDate("");
        } catch (error) {
            console.error('Error sending reminder:', error);
        }
    };

    const deleteAccount = async () => {
        try {
            await axios.delete(`/trainer/${trainerId}/delete`);
            alert('Account deleted');
            localStorage.removeItem('trainerId');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="home">
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>
                    Log Out
                </button>
                <button className="update-button" onClick={() => navigate('/trainerupdate')}>
                    Update Profile
                </button>
            </div>
            <h1>Trainer Home Page</h1>

            {/* View Clients */}
            <button onClick={viewClients}>View Clients</button>
            {clientsFetched && (
                clients.length > 0 ? (
                    <div>
                        <h2>Clients</h2>
                        {clients.map(client => (
                            <div key={client.client_id} className="client-details">
                                <h3>{client.FirstName} {client.LastName}</h3>
                                <p>Email: {client.Email}</p>
                                <p>Age: {client.age} years</p>
                                <p>Height: {client.height} cm</p>
                                <p>Weight: {client.weight} kg</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No clients found.</p>
                )
            )}

            {/* View Unassigned Clients */}
            <button onClick={viewUnassignedClients}>View Unassigned Clients</button>
            {unassignedFetched && (
                unassignedClients.length > 0 ? (
                    <div>
                        <h2>Unassigned Clients</h2>
                        <select
                            onChange={(e) => setSelectedUnassignedClient(e.target.value)}
                            value={selectedUnassignedClient || ""}
                        >
                            <option value="" disabled>Select a client</option>
                            {unassignedClients.map(client => (
                                <option key={client.client_id} value={client.client_id}>
                                    {client.FirstName} {client.LastName} ({client.Email})
                                </option>
                            ))}
                        </select>
                        <button onClick={assignClient}>Assign Client</button>
                    </div>
                ) : (
                    <p>No unassigned clients found.</p>
                )
            )}

            {/* View Fitness Plans */}
            <button onClick={viewFitnessPlans}>View Fitness Plans</button>
            {plansFetched && (
                fitnessPlans.length > 0 ? (
                    <div>
                        <h2>Fitness Plans</h2>
                        {fitnessPlans.map(plan => (
                            <div key={plan.PlanID} className="fitness-plan">
                                <h4>Description: {plan.Description}</h4>
                                <p>End Date: {plan.EndDate || 'Ongoing'}</p>
                                <h5>Workouts</h5>
                                {plan.workouts && plan.workouts.length > 0 ? (
                                    plan.workouts.map((workout, wIndex) => (
                                        <div key={wIndex} className="workout">
                                            <p>{workout.WorkoutName} - {workout.Duration} mins</p>
                                            <ul>
                                                {workout.exercises.map((exercise, eIndex) => (
                                                    <li key={eIndex}>
                                                        {exercise.ExerciseName} - {exercise.Reps} reps, {exercise.Sets} sets, {exercise.CaloriesBurned} cal, {exercise.Completed ? 'Completed' : 'Incomplete'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p>No workouts assigned.</p>
                                )}
                                <h5>Meals</h5>
                                {plan.diets && plan.diets.length > 0 ? (
                                    plan.diets.map((diet, dIndex) => (
                                        <div key={dIndex} className="diet">
                                            <p>Diet: {diet.diet_name}</p>
                                            <ul>
                                                {diet.meals.map((meal, mIndex) => (
                                                    <li key={mIndex}>
                                                        {meal.meal_name} - {meal.Calories} cal, Protein: {meal.Protein}g, Carbs: {meal.Carbs}g, Fat: {meal.Fat}g, {meal.Completed ? 'Completed' : 'Incomplete'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p>No meals assigned.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No fitness plans found.</p>
                )
            )}

            {/* Send Reminder */}
            <h3>Send Reminder</h3>
            <select onChange={(e) => setSelectedClientId(e.target.value)} value={selectedClientId || ""}>
                <option value="" disabled>Select Client</option>
                {clients.map(client => (
                    <option key={client.client_id} value={client.client_id}>
                        {client.FirstName} {client.LastName}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Reminder Message"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
            />
            <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
            />
            <button onClick={sendReminder}>Send Reminder</button>

            {/* Delete Account */}
            <button className="delete-button" onClick={deleteAccount}>
                Delete Account
            </button>
        </div>
    );
}

export default TrainerHome;
