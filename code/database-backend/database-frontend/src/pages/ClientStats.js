import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import './Home.css';

function ClientStats() {
    const navigate = useNavigate();
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [netCalories, setNetCalories] = useState(0);
    const [statDate, setStatDate] = useState('');

    const clientId = localStorage.getItem('clientId'); // Fetch client ID from localStorage

    const handleStatCalc = async (event) => {
        const selectedDate = event.target.value;
        setStatDate(selectedDate);

        if (!selectedDate) return;

        try {
            // Fetch meals and exercises from the backend for the selected date
            const mealResponse = await axios.get(`/client/meals_by_date/${clientId}`, {
                params: { date: selectedDate }
            });

            const meals = mealResponse.data;
            const totalCaloriesConsumed = meals.reduce((sum, meal) => sum + meal.Calories, 0);

            const exerciseResponse = await axios.get(`/client/exercises_by_date/${clientId}`, {
                params: { date: selectedDate }
            });

            const exercises = exerciseResponse.data;
            const totalCaloriesBurned = exercises.reduce((sum, exercise) => sum + exercise.CaloriesBurned, 0);

            // Update the stats in the state
            setCaloriesConsumed(totalCaloriesConsumed);
            setCaloriesBurned(totalCaloriesBurned);
            setNetCalories(totalCaloriesConsumed - totalCaloriesBurned);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    return (
        <div className='center-container'>
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>View Your Stats Per Day</h1>
            <label>Select a day</label>
            <input
                type="date"
                name="date"
                value={statDate}
                onChange={handleStatCalc} // Call the handler on date change
            />
            <p>Calories consumed: {caloriesConsumed}</p>
            <p>Calories burned: {caloriesBurned}</p>
            <p>Net Calorie Count: {netCalories}</p>
        </div>
    );
}

export default ClientStats;
