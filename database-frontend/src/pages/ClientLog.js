import React, { useState } from 'react';
import './ClientLog.css';
import Modal from '../Modal';

function ClientLog() {

    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);

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

    return (
        <div className="client-log">

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

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default ClientLog;
