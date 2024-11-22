import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'

function LogMeal() {

    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);

    const [mealData, setMealData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        date: ''
    });

    const handleMealChange = (e) => {
        setMealData({ ...mealData, [e.target.name]: e.target.value });
    };

    const addMeal = () => {
        setMeals([...meals, mealData]);
        setMealData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    };

    return(
        <div className="center-container">
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
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
        </div>
    )
}

export default LogMeal;