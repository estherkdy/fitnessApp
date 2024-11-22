import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function LogExercise() {

    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [exerciseData, setExerciseData] = useState('');
    
    const addExercise = () => {
        setExercises([...exercises, exerciseData]);
        setExerciseData({ name: '', reps: '', sets: '', duration: '', calories: '' });
    };

    const handleExerciseChange = (e) => {
        setExerciseData({ ...exerciseData, [e.target.name]: e.target.value });
    };

    return (
        <div className="center-container">
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
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
                placeholder="Duration (mins)"
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
            <input
                type="date"
                name="date"
                value={exerciseData.date}
                onChange={handleExerciseChange}
            />
            <button onClick={addExercise}>Add Exercise</button>
        </div>
    )
}

export default LogExercise;