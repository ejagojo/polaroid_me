import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import LandingPage from '../src/components/LandingPage';
import Home from '../src/components/Home';
import { exchangeCodeForToken, fetchSpotifyUserProfile } from '../src/services/spotifyService';
import Loader from '../src/components/Loader';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = window.localStorage.getItem('spotify_access_token');
    if (storedToken) {
      console.log("Token found in local storage:", storedToken);
      setToken(storedToken);
      fetchSpotifyUserProfile(storedToken)
        .then((profile) => {
          console.log("Spotify Profile from local storage:", profile);
          setUser(profile);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch profile from stored token:', err);
          setLoading(false);
        });
      return; // Skip the rest of the useEffect if token is already in storage
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !token) {
      console.log("Authorization code received:", code);
      exchangeCodeForToken(code)
        .then((data) => {
          setToken(data.access_token);
          window.localStorage.setItem('spotify_access_token', data.access_token); // Save token in local storage
          console.log("Access token received and stored:", data.access_token);
          return fetchSpotifyUserProfile(data.access_token);
        })
        .then((profile) => {
          console.log("Spotify Profile:", profile);
          setUser(profile);
          navigate('/home'); // Navigate to home after login
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to login:', err);
          setLoading(false);
        });
    } else {
      setLoading(false); // Set loading to false if no code is found
    }
  }, [token, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<div>Loading...</div>} />
        <Route path="/home" element={<Home token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
