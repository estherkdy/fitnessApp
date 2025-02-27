import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientHome.css';
import Modal from '../Modal';

function ClientHome() {
    const navigate = useNavigate();
    const [trainerInfo, setTrainerInfo] = useState(null);
    const [fitnessPlan, setFitnessPlan] = useState([]);
    const [reminders, setReminders] = useState([]);

    const [trainerFetched, setTrainerFetched] = useState(false);
    const [fitnessPlanFetched, setFitnessPlanFetched] = useState(false);
    const [remindersFetched, setRemindersFetched] = useState(false);
    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [showMealForm, setShowMealForm] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);
    const [specialty, setSpecialty] = useState(null);

    const addExercise = () => {
        setExercises([...exercises, exerciseData]);
        setExerciseData({ name: '', reps: '', sets: '', duration: '', calories: '' });
    };

    const addMeal = () => {
        setMeals([...meals, mealData]);
        setMealData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    };

    const [exerciseData, setExerciseData] = useState({
        name: '',
        reps: '',
        sets: '',
        duration: '',
        calories: '',
        date: ''
    });

    const [mealData, setMealData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        date: ''
    });

    const handleExerciseChange = (e) => {
        setExerciseData({ ...exerciseData, [e.target.name]: e.target.value });
    };

    const handleMealChange = (e) => {
        setMealData({ ...mealData, [e.target.name]: e.target.value });
    };

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

    const handleSpecialty = async (event) => {
        // open modal with list of trainers with selected specialty from search trainers
        const selectedSpecialty = event.target.value;
        setSpecialty(selectedSpecialty);
        openModal(
            // show list of trainers with specialty
        )
    }

    const searchTrainers = () => {
        navigate("/clientviewtrainers")
    }

    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [netCalories, setNetCalories] = useState(0);
    const [statDate, setStateDate] = useState('');
    

    const handleStats = async () => {
        // openModal(
        //     <div>
        //         <label>Select a day</label>
        //         <input
        //             type="date"
        //             name="date"
        //             value={statDate}
        //             onChange={handleStatCalc}
        //         />
        //         <p>Calories consumed: {caloriesConsumed}</p>
        //         <p>Calories burned: {caloriesBurned}</p>
        //         <p>Net Calorie Count: {netCalories}</p>
        //     </div>
        // )
    }

    const handleStatCalc = async () => {
        // using statDate go into database and get data to do calculations to update in handleStats
    }

    return (
        <div className='client-home'>
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
                <button className='stats' onClick={() => navigate('/clientstats')}>Your Statistics</button>
                <button className="update-button" onClick={() => navigate('/clientupdate')}>View Profile</button>
            </div>
            <div className='box'>
                {/* Trainer Info */}
                <button className='button' onClick={getTrainer}>View Trainer Info</button>

                {/* Trainer Info */}
                <button className='button' onClick={searchTrainers}>Search Trainers</button>

                {/* Fitness Plan */}
                <button className='button' onClick={viewFitnessPlan}>View Fitness Plan</button>

                {/* Exercise Section */}
                <button className='button' onClick={() => navigate('/logexercise')}>Log Exercise</button>

                {/* Meal Section */}
                <button className='button' onClick={() => navigate('/logmeal')}>Log Meal</button>

                {/* Reminders */}
                <button className='button' onClick={checkReminders}>Check Reminders</button>
            </div>

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default ClientHome;
