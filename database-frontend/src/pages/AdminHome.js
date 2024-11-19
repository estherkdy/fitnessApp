import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminHome.css'; 
import { useNavigate } from 'react-router-dom';

function AdminHome() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        userType: 'client', 
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        height: '',
        weight: '',
        age: '',
        specialty: '', 
    });
    const [usersFetched, setUsersFetched] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        if (usersFetched) {
            setUsersFetched(false);
            setUsers([]);
        } else {
            setUsersFetched(true);
            try {
                const response = await axios.get('/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post('/admin/create_user', newUser);
            alert(response.data.message);
            fetchUsers(); 
            setNewUser({
                userType: 'client',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                height: '',
                weight: '',
                age: '',
                specialty: '',
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`/admin/delete_user/${userId}`);
            alert(response.data.message);
            fetchUsers(); 
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="admin-home">
            <div className="button-box">
                <button className="logout-button" onClick={() => navigate('/')}>
                    Log Out
                </button>
            </div>
            <h1>Admin Home</h1>

            {/* View Users */}
            <button onClick={fetchUsers}>{usersFetched ? 'Hide Users' : 'View Users'}</button>
            {usersFetched && (
                <div>
                    <h2>All Users</h2>
                    {users.length > 0 ? (
                        <div className="user-list">
                            {users.map((user) => (
                                <div key={user.id} className="user-card">
                                    <h3>{user.FirstName} {user.LastName}</h3>
                                    <p>Email: {user.Email}</p>
                                    <p>Type: {user.UserType}</p>
                                    {user.UserType === 'client' && (
                                        <>
                                            <p>Height: {user.Height} cm</p>
                                            <p>Weight: {user.Weight} kg</p>
                                            <p>Age: {user.Age}</p>
                                        </>
                                    )}
                                    {user.UserType === 'trainer' && (
                                        <p>Specialty: {user.Specialty}</p>
                                    )}
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete User
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            )}

            {/* Create User */}
            <div className="create-user">
                <h2>Create New User</h2>
                <select name="userType" value={newUser.userType} onChange={handleInputChange}>
                    <option value="client">Client</option>
                    <option value="trainer">Trainer</option>
                </select>
                <input
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    placeholder="First Name"
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    placeholder="Last Name"
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                />
                {newUser.userType === 'client' && (
                    <>
                        <input
                            type="number"
                            name="height"
                            value={newUser.height}
                            placeholder="Height (cm)"
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="weight"
                            value={newUser.weight}
                            placeholder="Weight (kg)"
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="age"
                            value={newUser.age}
                            placeholder="Age"
                            onChange={handleInputChange}
                        />
                    </>
                )}
                {newUser.userType === 'trainer' && (
                    <input
                        type="text"
                        name="specialty"
                        value={newUser.specialty}
                        placeholder="Specialty"
                        onChange={handleInputChange}
                    />
                )}
                <button onClick={handleCreateUser}>Create User</button>
            </div>
        </div>
    );
}

export default AdminHome;
