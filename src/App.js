import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { exchangeCodeForToken, fetchSpotifyUserProfile } from '../src/services/spotifyService';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Handle Spotify OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !token) {

      exchangeCodeForToken(code)
        .then((data) => {
          setToken(data.access_token);
          fetchSpotifyUserProfile(data.access_token)
            .then((profile) => {
              setUser(profile);
            })
            .catch((err) => console.error('Error fetching profile:', err));
          navigate('/home'); // Navigate to home after login
        })
        .catch((err) => console.error('Failed to login:', err));
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Add more routes here */}
      </Routes>
    </div>
  );
}

export default App;
