// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ClientLogin from './pages/ClientLogin';
import TrainerLogin from './pages/TrainerLogin';
import AdminLogin from './pages/AdminLogin'; 
import SignUp from './pages/SignUp';
import ClientHome from './pages/ClientHome';
import TrainerHome from './pages/TrainerHome';
import './App.css';
import ClientUpdate from './pages/ClientUpdate';
import TrainerUpdate from './pages/TrainerUpdate';
import AdminHome from './pages/AdminHome';
import LogExercise from './pages/LogExercise';
import LogMeal from './pages/LogMeal';
import ClientStats from './pages/ClientStats';
import UnassignedClients from './pages/UnassignedClients';
import FitnessPlans from './pages/FitnessPlans';
import SendReminder from './pages/SendReminder';
import TrainerStats from './pages/TrainerStats';
import ClientViewTrainers from './pages/ClientViewTrainers';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientlogin" element={<ClientLogin />} />
          <Route path="/trainerlogin" element={<TrainerLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/clienthome" element={<ClientHome />} />
          <Route path="/clientviewtrainers" element={<ClientViewTrainers />} />
          <Route path="/trainerhome" element={<TrainerHome />} />
          <Route path="/trainerupdate" element={<TrainerUpdate />} />
          <Route path="/clientupdate" element={<ClientUpdate />} />
          <Route path="/logexercise" element={<LogExercise />} />
          <Route path="/logmeal" element={<LogMeal />} />
          <Route path="/clientstats" element={<ClientStats />} />
          <Route path="/unassignedclients" element={<UnassignedClients />} />
          <Route path="/fitnessplans" element={<FitnessPlans />} />
          <Route path="/sendreminder" element={<SendReminder />} />
          <Route path="/trainerstats" element={<TrainerStats />} />
        </Routes>
    </Router>
  );
}

export default App;
