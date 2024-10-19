// /src/components/Callback.jsx

import React, { useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/spotifyService';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasExchangedCode = useRef(false); // Ref to prevent multiple exchanges
  const { setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    if (hasExchangedCode.current) {
      return;
    }
    hasExchangedCode.current = true;

    const code = new URLSearchParams(location.search).get('code');

    if (code) {
      exchangeCodeForToken(code)
        .then((data) => {
          setAccessToken(data.access_token);
          navigate('/home', { replace: true });
        })
        .catch((error) => {
          console.error('Error exchanging code for token:', error);
          alert(`Login failed: ${error.message}`);
          // Clear tokens from storage
          setAccessToken(null);
          sessionStorage.clear();
          navigate('/', { replace: true });
        });
    } else {
      console.error('No code found in URL');
      navigate('/', { replace: true });
    }
  }, [location, navigate, setAccessToken]);

  return <Loader />; // Display loader while processing
}

export default Callback;
