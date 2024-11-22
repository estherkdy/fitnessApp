import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrainerHome.css';
import Modal from '../Modal'

function TrainerHome() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [fitnessPlans, setFitnessPlans] = useState([]);
    const [reminderMessage, setReminderMessage] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [plansFetched, setPlansFetched] = useState(false);
    const [clientsFetched, setClientsFetched] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null); 
    const [newDescription, setNewDescription] = useState("");
    const [unassignedClients, setUnassignedClients] = useState([]);
    const [unassignedFetched, setUnassignedFetched] = useState(false);
    const [selectedUnassignedClient, setSelectedUnassignedClient] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [newWorkout, setNewWorkout] = useState({ name: "", duration: "" });
    const [newMeal, setNewMeal] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });

    const trainerId = localStorage.getItem('trainerID');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    const viewClients = async () => {
        setClientsFetched(true);
        try {
            const response = await axios.get(`/trainer/${trainerId}/clients`);
            const data = response.data;
            setClients(data);
            openModal(
                data.length > 0 ? (
                    <div>
                        <h2>Clients</h2>
                        {data.map(client => (
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
            )
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const viewUnassignedClients = async () => {
        setUnassignedFetched(true);
        try {
            const response = await axios.get(`/trainer/${trainerId}/unassigned_clients`);
            const data = response.data;
            setUnassignedClients(data);
            openModal(
                data.length > 0 ? (
                    <div>
                        <h2>Unassigned Clients</h2>
                        <select
                            onChange={(e) => setSelectedUnassignedClient(e.target.value)}
                            value={selectedUnassignedClient || ""}
                        >
                            <option value="" disabled>Select a client</option>
                            {data.map(client => (
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
            )
        } catch (error) {
            console.error('Error fetching unassigned clients:', error);
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

    const selectClientFitnessPlan = async () => {
        try {
            const response = await axios.get(`/trainer/${trainerId}/clients`);
            const data = response.data;
            setUnassignedClients(data);
            openModal(
                data.length > 0 ? (
                    <div>
                        <h2>Clients</h2>
                        <select
                            onChange={(e) => selectedClient(e.target.value)}
                            value={selectedClient}
                        >
                            <option value="" disabled>Select a client</option>
                            {data.map(client => (
                                <option key={client.client_id} value={client.client_id}>
                                    {client.FirstName} {client.LastName} ({client.Email})
                                </option>
                            ))}
                        </select>
                        <button onClick={viewFitnessPlans}>Select Client</button> {/* need to use selected client to viewFitnessPlans */}
                    </div>
                ) : (
                    <p>No clients found.</p>
                )
            )
        } catch (error) {
            console.error('Error fetching unassigned clients:', error);
        }
    }

    const viewFitnessPlans = async () => {
        setPlansFetched(true);
        try {
            const response = await axios.get(`/trainer/${trainerId}/fitness_plans`);
            const data = response.data;
            setFitnessPlans(data);

            if (data.length === 0) {
                openModal(
                    <div>
                        <p>No fitness plans available.</p>
                    </div>
                );
                return;
            }

            openModal(
                <div>
                    {data.map(plan => (
                    <div key={plan.PlanID} className="fitness-plan">
                        <h4>Description: {plan.Description}</h4>
                        <p>End Date: {plan.EndDate || 'Ongoing'}</p>
    
                        <h5>Workouts</h5>
                        {plan.workouts && plan.workouts.length > 0 ? (
                            plan.workouts.map((workout, wIndex) => (
                                <div key={wIndex} className="workout">
                                    <p>{workout.WorkoutName} - {workout.Duration} mins</p>
                                </div>
                            ))
                        ) : (
                            <p>No workouts assigned.</p>
                        )}
    
                        <div>
                            <input
                                type="text"
                                placeholder="Workout Name"
                                value={newWorkout.name}
                                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Duration (mins)"
                                value={newWorkout.duration}
                                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                            />
                            <button onClick={() => { setSelectedPlanId(plan.PlanID); assignWorkout(); }}>
                                Assign Workout
                            </button>
                        </div>
    
                        <h5>Meals</h5>
                        {plan.diets && plan.diets.length > 0 ? (
                            plan.diets.map((diet, dIndex) => (
                                <div key={dIndex} className="diet">
                                    {diet.meals.map((meal, mIndex) => (
                                        <p key={mIndex}>{meal.meal_name} - {meal.Calories} cal</p>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>No meals assigned.</p>
                        )}
    
                        <div>
                            <input
                                type="text"
                                placeholder="Meal Name"
                                value={newMeal.name}
                                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Calories"
                                value={newMeal.calories}
                                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Protein (g)"
                                value={newMeal.protein}
                                onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Carbs (g)"
                                value={newMeal.carbs}
                                onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Fat (g)"
                                value={newMeal.fat}
                                onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                            />
                            <button onClick={() => { setSelectedPlanId(plan.PlanID); assignMeal(); }}>
                                Assign Meal
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )
        } catch (error) {
            console.error('Error fetching fitness plans:', error);
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

    const openSendReminder = () => {
        openModal(
            <div>
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
            </div>
        )
    }

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

    const assignWorkout = async () => {
        if (!selectedPlanId || !newWorkout.name || !newWorkout.duration) {
            alert("Please provide all workout details.");
            return;
        }
        try {
            const response = await axios.post(`/trainer/${trainerId}/assign_workout`, {
                plan_id: selectedPlanId,
                workout_name: newWorkout.name,
                duration: newWorkout.duration
            });
            alert(response.data.message);
            setNewWorkout({ name: "", duration: "" });
            viewFitnessPlans(); // Refresh fitness plans
        } catch (error) {
            console.error('Error assigning workout:', error);
        }
    };
    
    const assignMeal = async () => {
        if (!selectedPlanId || !newMeal.name || !newMeal.calories || !newMeal.protein || !newMeal.carbs || !newMeal.fat) {
            alert("Please provide all meal details.");
            return;
        }
        try {
            const response = await axios.post(`/trainer/${trainerId}/assign_meal`, {
                plan_id: selectedPlanId,
                meal_name: newMeal.name,
                calories: newMeal.calories,
                protein: newMeal.protein,
                carbs: newMeal.carbs,
                fat: newMeal.fat
            });
            alert(response.data.message);
            setNewMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
            viewFitnessPlans(); // Refresh fitness plans
        } catch (error) {
            console.error('Error assigning meal:', error);
        }
    };

    const viewStats = async () => {
        try {
            const clientsResponse = await fetch(`/trainer/${trainerId}/assigned_clients`);
            const clientsData = await clientsResponse.json();
            console.log(clientsData);  // Check if this returns { num_clients: x }
    
            const remindersResponse = await fetch(`/trainer/${trainerId}/reminders_sent`);
            const remindersData = await remindersResponse.json();
            console.log(remindersData);  // Check if this returns { num_reminders: x }
    
            const exercisesResponse = await fetch(`/trainer/${trainerId}/exercises_created`);
            const exercisesData = await exercisesResponse.json();
            console.log(exercisesData);  // Check if this returns { num_exercises: x }
    
            const mealsResponse = await fetch(`/trainer/${trainerId}/meals_created`);
            const mealsData = await mealsResponse.json();
            console.log(mealsData);  // Check if this returns { num_meals: x }
    
            // Open modal with the stats
            openModal(
                <div>
                    <p>Current number of clients: {clientsData.num_clients}</p>
                    <p>Reminders sent: {remindersData.num_reminders}</p>
                    <p>Exercises created: {exercisesData.num_exercises}</p>
                    <p>Meals created: {mealsData.num_meals}</p>
                </div>
            );
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };
    
    
    
    return (
        <div className="client-home">
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
                <button className="stats" onClick={() => { console.log('Stats button clicked'); viewStats(); }}>
    Your Statistics
</button>


                <button className="update-button" onClick={() => navigate('/trainerupdate')}>View Profile</button>
            </div>
            <div className='box'>
                {/* View Clients */}
                <button className='button' onClick={viewClients}>View Clients</button>

                {/* View Unassigned Clients */}
                <button className='button' onClick={viewUnassignedClients}>View Unassigned Clients</button>

                {/* View Fitness Plans */}
                <button className='button' onClick={selectClientFitnessPlan}>View Fitness Plans</button>

                {/* Send Reminder */}
                <button className='button' onClick={openSendReminder}>Send Reminder</button>
            </div>

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default TrainerHome;
