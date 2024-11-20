import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientHome.css';
import ClientLog from './ClientLog';
import Modal from '../Modal';

function ClientHome() {
    const navigate = useNavigate();
    const [trainerInfo, setTrainerInfo] = useState(null);
    const [fitnessPlan, setFitnessPlan] = useState([]);
    const [reminders, setReminders] = useState([]);

    const [trainerFetched, setTrainerFetched] = useState(false);
    const [fitnessPlanFetched, setFitnessPlanFetched] = useState(false);
    const [remindersFetched, setRemindersFetched] = useState(false);

    const clientId = localStorage.getItem('clientId');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    const getTrainer = async () => {
        setTrainerFetched(true);
        try {
            const response = await axios.get(`/client/${clientId}/trainer`);
            const trainerData = response.data;
            setTrainerInfo(trainerData); // Update state
            openModal(
                trainerData ? (
                    <div>
                        <h2>Trainer Information</h2>
                        <p>
                            {trainerData.FirstName} {trainerData.LastName} ({trainerData.Specialty})
                        </p>
                    </div>
                ) : (
                    <p>No trainer assigned.</p>
                )
            );
        } catch (error) {
            console.error('Error fetching trainer info:', error);
            openModal(<p>Error fetching trainer information. Please try again later.</p>);
        }
    };

    const viewFitnessPlan = async () => {
        setFitnessPlanFetched(true);
        try {
            const response = await axios.get(`/client/${clientId}/fitness_plan`);
            const data = response.data;
            setFitnessPlan(data);
            openModal(
                <div>
                    <h2>Fitness Plan</h2>
                    {data.map((plan, index) => (
                        <div key={index} className="fitness-plan">
                            <h3>{plan.Description} (Ends: {plan.EndDate || 'Ongoing'})</h3>
                            <h4>Exercises</h4>
                            <ul>
                                {plan.exercises.map((exercise) => (
                                    <li key={exercise.ExerciseID}>
                                        <input
                                            type="checkbox"
                                            checked={exercise.Completed}
                                            onChange={() => updateExerciseStatus(exercise.ExerciseID, !exercise.Completed)}
                                        />
                                        {exercise.Name} - {exercise.Reps} reps, {exercise.Sets} sets, {exercise.CaloriesBurned} cal
                                    </li>
                                ))}
                            </ul>
                            <h4>Meals</h4>
                            <ul>
                                {plan.meals.map((meal) => (
                                    <li key={meal.MealID}>
                                        <input
                                            type="checkbox"
                                            checked={meal.Completed}
                                            onChange={() => updateMealStatus(meal.MealID, !meal.Completed)}
                                        />
                                        {meal.meal_name} - {meal.Calories} cal, Protein: {meal.Protein}g, Carbs: {meal.Carbs}g, Fat: {meal.Fat}g
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            );
        } catch (error) {
            console.error('Error fetching fitness plan:', error);
        }
    };
    

    const updateExerciseStatus = async (exerciseId, completed) => {
        try {
            await axios.patch(`/client/${clientId}/exercise_status`, {
                exercise_id: exerciseId,
                completed: completed
            });
            viewFitnessPlan(); // Refresh fitness plan data
        } catch (error) {
            console.error('Error updating exercise status:', error);
        }
    };

    const updateMealStatus = async (mealId, completed) => {
        try {
            await axios.patch(`/client/${clientId}/meal_status`, {
                meal_id: mealId,
                completed: completed
            });
            viewFitnessPlan(); // Refresh fitness plan data
        } catch (error) {
            console.error('Error updating meal status:', error);
        }
    };

    const checkReminders = async () => {
        setRemindersFetched(true);
        try {
            const response = await axios.get(`/client/${clientId}/reminders`);
            const data = response.data;
            setReminders(data);
            openModal(
                <div>
                    <h2>Reminders</h2>
                    <ul>
                        {data.map((reminder) => (
                            <li key={reminder.ReminderID}>
                                <input
                                    type="checkbox"
                                    checked={reminder.Completed}
                                    onChange={() => markReminderComplete(reminder.ReminderID)}
                                />
                                {reminder.Message} (Due: {reminder.ReminderDate})
                            </li>
                        ))}
                    </ul>
                </div>
            )
        } catch (error) {
            console.error('Error fetching reminders:', error);
        }
    };

    const markReminderComplete = async (reminderId) => {
        try {
            await axios.patch(`/client/${clientId}/update_reminder`, {
                reminder_id: reminderId,
                completed: true
            });
            checkReminders(); // Refresh reminders
        } catch (error) {
            console.error('Error marking reminder as complete:', error);
        }
    };

    return (
        <div className="home">
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
                <button className="update-button" onClick={() => navigate('/clientupdate')}>View Profile</button>
            </div>
            <h1>Client Home Page</h1>

            {/* Trainer Info */}
            <button onClick={getTrainer}>View Trainer Info</button>

            <ClientLog />

            {/* Fitness Plan */}
            <button onClick={viewFitnessPlan}>View Fitness Plan</button>

            {/* Reminders */}
            <button onClick={checkReminders}>Check Reminders</button>


            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default ClientHome;
