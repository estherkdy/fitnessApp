import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClientViewTrainers() {
    const navigate = useNavigate();
    const [specialty, setSpecialty] = useState('');
    const [trainers, setTrainers] = useState([]);

    const handleSpecialtyChange = (event) => {
        setSpecialty(event.target.value);
    };

    const fetchTrainers = async () => {
        if (!specialty) {
            alert('Please select a specialty!');
            return;
        }
        try {
            const response = await axios.get(`/trainers/${specialty}/specific`);
            setTrainers(response.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    return (
        <div className="view-trainers">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <h1>Search Trainers</h1>
            <div>
                <label htmlFor="specialtySelect" style={{ display: 'block', marginBottom: '10px' }}>
                    Select a trainer specialty:
                </label>
                <select
                    id="specialtySelect"
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    style={{ marginBottom: '20px', padding: '5px', fontSize: '16px' }}
                >
                    <option value="">Select your trainer specialty</option>
                    <option value="strength_training">Strength Training</option>
                    <option value="muscular_endurance">Muscular Endurance</option>
                    <option value="cardio_endurance">Cardiovascular Endurance</option>
                    <option value="dietician">Dietician</option>
                    <option value="life_coach">Life Coach</option>
                </select>
                <button
                    className="fetch-button"
                    onClick={fetchTrainers}
                    style={{
                        marginLeft: '10px',
                        padding: '5px 15px',
                        backgroundColor: '#007BFF',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
            </div>
            <div>
                {trainers.length > 0 ? (
                    trainers.map((trainer) => (
                        <div key={trainer.TrainerID} className="trainer-card">
                            <h2>{trainer.FirstName} {trainer.LastName}</h2>
                            <p><strong>Specialty:</strong> {trainer.Specialty}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${trainer.Email}`}>{trainer.Email}</a></p>
                        </div>
                    ))
                ) : (
                    <p>No trainers available for this specialty.</p>
                )}
            </div>
        </div>
    );
}

export default ClientViewTrainers;
