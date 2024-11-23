import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FitnessPlans.css';

function FitnessPlans() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [workoutData, setWorkoutData] = useState({ name: '', duration: '' });
    const [mealData, setMealData] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    const [message, setMessage] = useState('');
    const trainerId = localStorage.getItem('trainerID');

    useEffect(() => {
        // Fetch clients assigned to the trainer
        const fetchClients = async () => {
            try {
                const response = await axios.get(`/trainer/${trainerId}/clients`);
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, [trainerId]);

    const handleAssignWorkout = async () => {
        if (!selectedClientId || !workoutData.name || !workoutData.duration) {
            setMessage('Please fill out all workout details and select a client.');
            return;
        }
        try {
            const response = await axios.post(`/trainer/${trainerId}/assign_workout`, {
                client_id: selectedClientId,
                workout_name: workoutData.name,
                duration: workoutData.duration
            });
            setMessage(response.data.message);
            setWorkoutData({ name: '', duration: '' }); // Reset form
        } catch (error) {
            console.error('Error assigning workout:', error);
            setMessage('Failed to assign workout.');
        }
    };

    const handleAssignMeal = async () => {
        if (!selectedClientId || !mealData.name || !mealData.calories || !mealData.protein || !mealData.carbs || !mealData.fat) {
            setMessage('Please fill out all meal details and select a client.');
            return;
        }
        try {
            const response = await axios.post(`/trainer/${trainerId}/assign_meal`, {
                client_id: selectedClientId,
                meal_name: mealData.name,
                calories: mealData.calories,
                protein: mealData.protein,
                carbs: mealData.carbs,
                fat: mealData.fat
            });
            setMessage(response.data.message);
            setMealData({ name: '', calories: '', protein: '', carbs: '', fat: '' }); // Reset form
        } catch (error) {
            console.error('Error assigning meal:', error);
            setMessage('Failed to assign meal.');
        }
    };

    return (
        <div className="fitness-plans-container">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <h2>Assign Workouts and Meals</h2>
            <div className="client-selection">
                <label>Select a Client:</label>
                <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                >
                    <option value="">-- Select a Client --</option>
                    {clients.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                            {client.FirstName} {client.LastName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="workout-section">
                <h3>Assign a Workout</h3>
                <input
                    type="text"
                    placeholder="Workout Name"
                    value={workoutData.name}
                    onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Duration (mins)"
                    value={workoutData.duration}
                    onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                />
                <button onClick={handleAssignWorkout}>Assign Workout</button>
            </div>
            <div className="meal-section">
                <h3>Assign a Meal</h3>
                <input
                    type="text"
                    placeholder="Meal Name"
                    value={mealData.name}
                    onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Calories"
                    value={mealData.calories}
                    onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Protein (g)"
                    value={mealData.protein}
                    onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={mealData.carbs}
                    onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Fat (g)"
                    value={mealData.fat}
                    onChange={(e) => setMealData({ ...mealData, fat: e.target.value })}
                />
                <button onClick={handleAssignMeal}>Assign Meal</button>
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default FitnessPlans;
