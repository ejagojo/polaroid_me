import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import Callback from './components/Callback';
import About from './components/About'; 
import PrivacyPolicy from './components/PrivacyPolicy'; 
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const accessToken = localStorage.getItem('accessToken');

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/home"
          element={accessToken ? <Home token={accessToken} /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
