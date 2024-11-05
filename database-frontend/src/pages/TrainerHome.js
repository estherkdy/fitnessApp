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

    const trainerId = localStorage.getItem('trainerID'); 

    const viewClients = async () => {
        setClientsFetched(true);
        try {
            const response = await axios.get(`/trainer/${trainerId}/clients`);
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const viewFitnessPlans = async () => {
        setPlansFetched(true);
        try {
            const response = await axios.get(`/trainer/${trainerId}/fitness_plans`);
            setFitnessPlans(response.data);
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
            <button onClick={() => navigate('/')}>Home</button>
            <h1>Trainer Home Page</h1>

            {/* View Clients */}
            <button onClick={viewClients}>View Clients</button>
            {clientsFetched && (
                clients.length > 0 ? (
                    <div>
                        <h2>Clients</h2>
                        <ul>
                            {clients.map(client => (
                                <li key={client.client_id}>
                                    {client.FirstName} {client.LastName} - ID: {client.client_id}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No clients found.</p>
                )
            )}

            {/* View Fitness Plans */}
            <button onClick={viewFitnessPlans}>View Fitness Plans</button>
            {plansFetched && (
                fitnessPlans.length > 0 ? (
                    <div>
                        <h2>Fitness Plans</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Plan ID</th>
                                    <th>Client ID</th>
                                    <th>Description</th>
                                    <th>End Date</th>
                                    <th>Update Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fitnessPlans.map(plan => (
                                    <tr key={plan.PlanID}>
                                        <td>{plan.PlanID}</td>
                                        <td>{plan.ClientID}</td>
                                        <td>
                                            {editingPlanId === plan.PlanID ? (
                                                <input
                                                    type="text"
                                                    value={newDescription}
                                                    onChange={(e) => setNewDescription(e.target.value)}
                                                />
                                            ) : (
                                                plan.Description
                                            )}
                                        </td>
                                        <td>{plan.EndDate}</td>
                                        <td>
                                            {editingPlanId === plan.PlanID ? (
                                                <button onClick={submitDescriptionUpdate}>Submit</button>
                                            ) : (
                                                <button onClick={() => startEditingPlan(plan.PlanID, plan.Description)}>
                                                    Update
                                                </button>
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
            <button onClick={deleteAccount}>Delete Account</button>
        </div>
    );
}

export default TrainerHome;
