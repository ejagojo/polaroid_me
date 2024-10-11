import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import Callback from './components/Callback';

function App() {
  const accessToken = localStorage.getItem('accessToken');

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/home"
          element={accessToken ? <Home token={accessToken} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
