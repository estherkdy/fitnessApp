import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function SendReminder() {

    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [reminderMessage, setReminderMessage] = useState("");
    const [reminderDate, setReminderDate] = useState("");

    const trainerId = localStorage.getItem('trainerID');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`/trainer/${trainerId}/clients`);
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, [trainerId]);

    const sendReminder = async () => {
        if (!selectedClientId || !reminderMessage || !reminderDate) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post(`/trainer/${trainerId}/set_reminder`, {
                client_id: selectedClientId,
                message: reminderMessage,
                reminder_date: reminderDate,
            });
            alert(response.data.message);
            setReminderMessage("");
            setReminderDate("");
        } catch (error) {
            console.error('Error sending reminder:', error);
        }
    };

    return (
        <div className="center-container">
            <button className='back-button' title="Back" onClick={() => navigate(-1)}>Back</button>
            <h2>Send Reminder</h2>
            <div className="form-group">
                <label htmlFor="client-select">Select Client</label>
                <select
                    id="client-select"
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    value={selectedClientId || ""}
                >
                    <option value="" disabled>
                        Select a client
                    </option>
                    {clients.map(client => (
                        <option key={client.client_id} value={client.client_id}>
                            {client.FirstName} {client.LastName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="reminder-message">Reminder Message</label>
                <input
                    type="text"
                    id="reminder-message"
                    placeholder="Enter message"
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="reminder-date">Reminder Date</label>
                <input
                    type="date"
                    id="reminder-date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                />
            </div>
            <button className="send-button" onClick={sendReminder}>
                Send Reminder
            </button>
        </div>
    );
}

export default SendReminder;
