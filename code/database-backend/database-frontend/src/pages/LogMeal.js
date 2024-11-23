import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function LogMeal() {
    const navigate = useNavigate();
    const clientId = localStorage.getItem('clientId'); // Assume clientId is stored in localStorage
    const [mealData, setMealData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        date: ''
    });
    const [message, setMessage] = useState('');

    const handleMealChange = (e) => {
        setMealData({ ...mealData, [e.target.name]: e.target.value });
    };

    const addMeal = async () => {
        try {
            const response = await axios.post(`/client/log_meal/${clientId}`, mealData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message || 'Meal logged successfully!');
            setMealData({ name: '', calories: '', protein: '', carbs: '', fat: '', date: '' });
        } catch (error) {
            console.error('Error logging meal:', error);
            setMessage(error.response?.data?.error || 'Failed to log meal');
        }
    };

    return (
        <div className="center-container">
            <button className="back-button" title="Back" onClick={() => navigate(-1)}>
                Back
            </button>
            <h3>Log Meal</h3>
            <input
                type="text"
                name="name"
                placeholder="Meal Name"
                value={mealData.name}
                onChange={handleMealChange}
            />
            <input
                type="number"
                name="calories"
                placeholder="Calories"
                value={mealData.calories}
                onChange={handleMealChange}
            />
            <input
                type="number"
                name="protein"
                placeholder="Protein (g)"
                value={mealData.protein}
                onChange={handleMealChange}
            />
            <input
                type="number"
                name="carbs"
                placeholder="Carbs (g)"
                value={mealData.carbs}
                onChange={handleMealChange}
            />
            <input
                type="number"
                name="fat"
                placeholder="Fat (g)"
                value={mealData.fat}
                onChange={handleMealChange}
            />
            <input
                type="date"
                name="date"
                value={mealData.date}
                onChange={handleMealChange}
            />
            <button onClick={addMeal}>Add Meal</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default LogMeal;
