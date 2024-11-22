import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FitnessPlans() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [fitnessPlans, setFitnessPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [newWorkout, setNewWorkout] = useState({ name: '', duration: '' });
    const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

    const trainerId = localStorage.getItem('trainerID');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get(`/trainer/${trainerId}/clients`);
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchFitnessPlans = async (clientId) => {
        try {
            const response = await axios.get(`/trainer/${trainerId}/fitness_plans`, {
                params: { client_id: clientId },
            });
            setFitnessPlans(response.data);
        } catch (error) {
            console.error('Error fetching fitness plans:', error);
        }
    };

    const assignWorkout = async () => {
        if (!newWorkout.name || !newWorkout.duration || !selectedPlanId) {
            alert('Please provide workout details and select a plan.');
            return;
        }

        try {
            await axios.post(`/trainer/${trainerId}/assign_workout`, {
                plan_id: selectedPlanId,
                workout_name: newWorkout.name,
                duration: newWorkout.duration,
            });
            alert('Workout assigned successfully!');
            fetchFitnessPlans(selectedClient); // Refresh fitness plans
            setNewWorkout({ name: '', duration: '' });
        } catch (error) {
            console.error('Error assigning workout:', error);
        }
    };

    const assignMeal = async () => {
        if (!newMeal.name || !newMeal.calories || !selectedPlanId) {
            alert('Please provide meal details and select a plan.');
            return;
        }

        try {
            await axios.post(`/trainer/${trainerId}/assign_meal`, {
                plan_id: selectedPlanId,
                meal_name: newMeal.name,
                calories: newMeal.calories,
                protein: newMeal.protein,
                carbs: newMeal.carbs,
                fat: newMeal.fat,
            });
            alert('Meal assigned successfully!');
            fetchFitnessPlans(selectedClient); // Refresh fitness plans
            setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
        } catch (error) {
            console.error('Error assigning meal:', error);
        }
    };

    return (
        <div className="center-container">
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h2>Fitness Plans</h2>
            <div>
                <h3>Select a Client</h3>
                <select
                    onChange={(e) => {
                        setSelectedClient(e.target.value);
                        fetchFitnessPlans(e.target.value);
                    }}
                    value={selectedClient || ""}
                >
                    <option value="" disabled>Select a client</option>
                    {clients.map(client => (
                        <option key={client.client_id} value={client.client_id}>
                            {client.FirstName} {client.LastName} ({client.Email})
                        </option>
                    ))}
                </select>
            </div>

            {fitnessPlans.length > 0 ? (
                <div className="fitness-plans-list">
                    {fitnessPlans.map(plan => (
                        <div key={plan.PlanID} className="fitness-plan">
                            <h4>Description: {plan.Description}</h4>
                            <p>End Date: {plan.EndDate || 'Ongoing'}</p>

                            <h5>Workouts</h5>
                            {plan.workouts && plan.workouts.length > 0 ? (
                                plan.workouts.map((workout, index) => (
                                    <p key={index}>{workout.WorkoutName} - {workout.Duration} mins</p>
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
                                <button onClick={() => setSelectedPlanId(plan.PlanID) || assignWorkout()}>
                                    Assign Workout
                                </button>
                            </div>

                            <h5>Meals</h5>
                            {plan.diets && plan.diets.length > 0 ? (
                                plan.diets.map((diet, dIndex) => (
                                    diet.meals.map((meal, mIndex) => (
                                        <p key={mIndex}>{meal.meal_name} - {meal.Calories} cal</p>
                                    ))
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
                                <button onClick={() => setSelectedPlanId(plan.PlanID) || assignMeal()}>
                                    Assign Meal
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : selectedClient ? (
                <p>No fitness plans found for the selected client.</p>
            ) : (
                <p>Please select a client to view fitness plans.</p>
            )}
        </div>
    );
}

export default FitnessPlans;
