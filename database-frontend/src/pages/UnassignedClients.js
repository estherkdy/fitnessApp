import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function UnassignedClients() {
    const navigate = useNavigate();
    const [unassignedClients, setUnassignedClients] = useState([]); // Store unassigned clients
    const [selectedUnassignedClient, setSelectedUnassignedClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    const trainerId = localStorage.getItem('trainerID'); // Retrieve trainer ID

    // Fetch unassigned clients
    const fetchUnassignedClients = async () => {
        try {
            setIsLoading(true); // Show loading state
            const response = await axios.get(`/trainer/${trainerId}/unassigned_clients`);
            setUnassignedClients(response.data);
        } catch (error) {
            console.error('Error fetching unassigned clients:', error);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };

    // Assign client
    const assignClient = async () => {
        if (!selectedUnassignedClient) {
            alert('Please select a client to assign.');
            return;
        }
        try {
            const response = await axios.post(`/trainer/${trainerId}/assign_client`, {
                client_id: selectedUnassignedClient,
            });
            alert(response.data.message);
            setSelectedUnassignedClient(null);
            fetchUnassignedClients(); // Refresh the list of unassigned clients
        } catch (error) {
            console.error('Error assigning client:', error);
        }
    };

    // Fetch unassigned clients on component mount
    useEffect(() => {
        fetchUnassignedClients();
    }, []);

    return (
        <div className="center-container">
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h2>Unassigned Clients</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : unassignedClients.length > 0 ? (
                <div>
                    <select
                        onChange={(e) => setSelectedUnassignedClient(e.target.value)}
                        value={selectedUnassignedClient || ""}
                    >
                        <option value="" disabled>Select a client</option>
                        {unassignedClients.map((client) => (
                            <option key={client.client_id} value={client.client_id}>
                                {client.FirstName} {client.LastName} ({client.Email})
                            </option>
                        ))}
                    </select>
                    <button onClick={assignClient}>Assign Client</button>
                </div>
            ) : (
                <p>No unassigned clients found.</p>
            )}
        </div>
    );
}

export default UnassignedClients;
