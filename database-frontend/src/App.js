// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ClientLogin from './pages/ClientLogin';
import TrainerLogin from './pages/TrainerLogin';
import SignUp from './pages/SignUp';
import ClientHome from './pages/ClientHome';
import TrainerHome from './pages/TrainerHome';
import './App.css';

function App() {
  return (
    <Router>
      <div className="centered-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientlogin" element={<ClientLogin />} />
          <Route path="/trainerlogin" element={<TrainerLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/clienthome" element={<ClientHome />} />
          <Route path="/trainerhome" element={<TrainerHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
