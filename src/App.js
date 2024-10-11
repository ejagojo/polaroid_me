import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import Loader from './components/Loader';
import { exchangeCodeForToken } from '../src/services/spotifyService'; // Removed unused fetchSpotifyUserProfile import

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || ''); // Retained necessary state variables
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !token) {
      exchangeCodeForToken(code)
        .then((data) => {
          setToken(data.access_token);
          localStorage.setItem('access_token', data.access_token);
          navigate('/home');
        })
        .catch((err) => console.error('Failed to login:', err));
    } else {
      setLoading(false); // Only set loading to false if no code is found
    }
  }, [token, navigate]);

  if (loading) {
    return <Loader />; // Use the custom loader
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<Loader />} />
        <Route path="/home" element={<Home token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
