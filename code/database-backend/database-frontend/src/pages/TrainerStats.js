import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function TrainerStats() {
    const navigate = useNavigate();
    const trainerId = localStorage.getItem('trainerID');
    const [stats, setStats] = useState({
        num_clients: 0,
        num_reminders: 0,
        num_exercises: 0,
        num_meals: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true); // Start loading
            try {
                const clientsResponse = await fetch(`/trainer/${trainerId}/assigned_clients`);
                const clientsData = await clientsResponse.json();

                const remindersResponse = await fetch(`/trainer/${trainerId}/reminders_sent`);
                const remindersData = await remindersResponse.json();

                const exercisesResponse = await fetch(`/trainer/${trainerId}/workouts_created`);
                const exercisesData = await exercisesResponse.json();

                const mealsResponse = await fetch(`/trainer/${trainerId}/meals_created`);
                const mealsData = await mealsResponse.json();

                setStats({
                    num_clients: clientsData.num_clients || 0,
                    num_reminders: remindersData.num_reminders || 0,
                    num_exercises: exercisesData.num_exercises || 0,
                    num_meals: mealsData.num_meals || 0
                });
            } catch (error) {
                setError('Error fetching stats: ' + error.message);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchStats();
    }, [trainerId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="center-container">
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h2>Your Statistics</h2>
            <p>Current number of clients: {stats.num_clients}</p>
            <p>Reminders sent: {stats.num_reminders}</p>
            <p>Workouts created: {stats.num_exercises}</p>
            <p>Meals created: {stats.num_meals}</p>
        </div>
    );
}

export default TrainerStats;