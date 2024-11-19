import React, { useState } from 'react';
import './ClientLog.css';

function ClientLog() {
    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [showMealForm, setShowMealForm] = useState(false);

    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);

    const [exerciseData, setExerciseData] = useState({
        name: '',
        reps: '',
        sets: '',
        duration: '',
        calories: ''
    });

    const [mealData, setMealData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
    });

    const handleExerciseChange = (e) => {
        setExerciseData({ ...exerciseData, [e.target.name]: e.target.value });
    };

    const handleMealChange = (e) => {
        setMealData({ ...mealData, [e.target.name]: e.target.value });
    };

    const addExercise = () => {
        setExercises([...exercises, exerciseData]);
        setExerciseData({ name: '', reps: '', sets: '', duration: '', calories: '' });
    };

    const addMeal = () => {
        setMeals([...meals, mealData]);
        setMealData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    };

    return (
        <div className="client-log">

            {/* Exercise Section */}
            <button onClick={() => setShowExerciseForm(!showExerciseForm)}>
                {showExerciseForm ? 'Hide Exercise Form' : 'Log Exercise'}
            </button>
            {showExerciseForm && (
                <div className="form-section">
                    <h3>Log Exercise</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Exercise Name"
                        value={exerciseData.name}
                        onChange={handleExerciseChange}
                    />
                    <input
                        type="number"
                        name="reps"
                        placeholder="Reps"
                        value={exerciseData.reps}
                        onChange={handleExerciseChange}
                    />
                    <input
                        type="number"
                        name="sets"
                        placeholder="Sets"
                        value={exerciseData.sets}
                        onChange={handleExerciseChange}
                    />
                    <input
                        type="number"
                        name="duration"
                        placeholder="Duration (minutes)"
                        value={exerciseData.duration}
                        onChange={handleExerciseChange}
                    />
                    <input
                        type="number"
                        name="calories"
                        placeholder="Calories Burned"
                        value={exerciseData.calories}
                        onChange={handleExerciseChange}
                    />
                    <button onClick={addExercise}>Add Exercise</button>
                </div>
            )}

            {/* Display Logged Exercises */}
            {exercises.length > 0 && (
                <div className="logged-items">
                    <h3>Logged Exercises</h3>
                    <ul>
                        {exercises.map((exercise, index) => (
                            <li key={index}>
                                {exercise.name} - {exercise.reps} reps, {exercise.sets} sets, {exercise.duration} mins, {exercise.calories} cal
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Meal Section */}
            <button onClick={() => setShowMealForm(!showMealForm)}>
                {showMealForm ? 'Hide Meal Form' : 'Log Meal'}
            </button>
            {showMealForm && (
                <div className="form-section">
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
                    <button onClick={addMeal}>Add Meal</button>
                </div>
            )}

            {/* Display Logged Meals */}
            {meals.length > 0 && (
                <div className="logged-items">
                    <h3>Logged Meals</h3>
                    <ul>
                        {meals.map((meal, index) => (
                            <li key={index}>
                                {meal.name} - {meal.calories} cal, Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fat: {meal.fat}g
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ClientLog;
