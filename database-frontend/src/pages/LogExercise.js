import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function LogExercise() {
    const navigate = useNavigate();
    const clientId = localStorage.getItem('clientId'); // Assuming clientId is stored in localStorage
    const [exerciseData, setExerciseData] = useState({
        name: '',
        reps: '',
        sets: '',
        calories_burned: '',
        date: ''
    });

    const handleExerciseChange = (e) => {
        const { name, value } = e.target;

        // Ensure calories_burned only accepts valid floats
        if (name === 'calories_burned') {
            const floatRegex = /^\d*\.?\d*$/; // Regex for a valid float
            if (!floatRegex.test(value)) {
                return; // Reject invalid input
            }
        }

        setExerciseData({ ...exerciseData, [name]: value });
    };

    const addExercise = async () => {
        try {
            const response = await axios.post(`/client/log_exercise/${clientId}`, exerciseData);
            alert(response.data.message || 'Exercise logged successfully');
            setExerciseData({ name: '', reps: '', sets: '', calories_burned: '', date: '' });
        } catch (error) {
            console.error('Error logging exercise:', error);
            alert('Failed to log exercise. Please try again.');
        }
    };

    return (
        <div className="center-container">
            <button className="back-button" title="Back" onClick={() => navigate(-1)}>
                Back
            </button>
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
                type="text"
                name="calories_burned"
                placeholder="Calories Burned"
                value={exerciseData.calories_burned}
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
    );
}

export default LogExercise;
