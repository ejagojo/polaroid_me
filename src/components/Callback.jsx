// /src/components/Callback.jsx

import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/spotifyService';
import Loader from './Loader';

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasExchangedCode = useRef(false); // Ref to prevent multiple exchanges

  useEffect(() => {
    if (hasExchangedCode.current) return; // If already exchanged, do nothing
    hasExchangedCode.current = true; // Mark as exchanged

    const code = new URLSearchParams(location.search).get('code');
    if (code) {
      exchangeCodeForToken(code)
        .then(() => {
          // Remove code from URL to prevent reuse
          navigate('/home', { replace: true });
        })
        .catch((error) => {
          console.error('Error exchanging code for token:', error);
          alert(`Login failed: ${error.message}`);
          // Clear tokens from localStorage and sessionStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiration');
          sessionStorage.removeItem('pkce_code_verifier');
          navigate('/'); // Navigate back to login on error
        });
    } else {
      console.error('No code found in URL');
      navigate('/'); // Navigate back to login
    }
  }, [location, navigate]);

  return <Loader />; // Display loader while processing
}

export default Callback;
