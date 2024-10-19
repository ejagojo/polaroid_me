// /src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import Callback from './components/Callback';
import About from './components/About'; 
import PrivacyPolicy from './components/PrivacyPolicy'; 
import Contact from './components/Contact';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
