import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function ClientStats() {
    const navigate = useNavigate();
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [netCalories, setNetCalories] = useState(0);
    const [statDate, setStateDate] = useState('');

    const handleStatCalc = async () => {
        // using statDate go into database and get data to do calculations to update in handleStats
    }

    return(
        <div className='center-container'>
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h1>View Your Stats Per Day</h1>
            <label>Select a day</label>
            <input
                type="date"
                name="date"
                value={statDate}
                onChange={handleStatCalc}
            />
            <p>Calories consumed: {caloriesConsumed}</p>
            <p>Calories burned: {caloriesBurned}</p>
            <p>Net Calorie Count: {netCalories}</p>
        </div>
    )
}

export default ClientStats;