import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrainerHome.css';
import Modal from '../Modal';

function TrainerHome() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const trainerId = localStorage.getItem('trainerID');

    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    const viewClients = async () => {
        try {
            const response = await axios.get(`/trainer/${trainerId}/clients`);
            const data = response.data;
            setClients(data);
            openModal(
                data.length > 0 ? (
                    <div>
                        <h2>Clients</h2>
                        {data.map(client => (
                            <div key={client.client_id} className="client-details">
                                <h3>{client.FirstName} {client.LastName}</h3>
                                <p>Email: {client.Email}</p>
                                <p>Age: {client.age} years</p>
                                <p>Height: {client.height} cm</p>
                                <p>Weight: {client.weight} kg</p>
                                <button
                                    className="del-client"
                                    onClick={() => removeClient(client.client_id)}
                                >
                                    Remove Client
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No clients found.</p>
                )
            );
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const removeClient = async (clientId) => {
        try {
            const response = await axios.delete(`/trainer/${clientId}/delete_fitness_plan`);
            alert(response.data.message || 'Client removed successfully.');
            setClients(clients.filter(client => client.client_id !== clientId)); // Update client list
        } catch (error) {
            console.error('Error removing client:', error);
            alert('Failed to remove client.');
        }
        closeModal(); // Close the modal after operation
    };

    return (
        <div className="trainer-home">
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
                <button className="stats" onClick={() => navigate('/trainerstats')}>Your Statistics</button>
                <button className="update-button" onClick={() => navigate('/trainerupdate')}>View Profile</button>
            </div>
            <div className="box">
                {/* View Clients */}
                <button className="button" onClick={viewClients}>View Clients</button>

                {/* View Unassigned Clients */}
                <button className="button" onClick={() => navigate('/unassignedclients')}>View Unassigned Clients</button>

                {/* View Fitness Plans */}
                <button className="button" onClick={() => navigate('/fitnessplans')}>View Fitness Plans</button>

                {/* Send Reminder */}
                <button className="button" onClick={() => navigate('/sendreminder')}>Send Reminder</button>
            </div>

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default TrainerHome;
