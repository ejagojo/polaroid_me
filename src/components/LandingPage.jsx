// /src/components/LandingPage.jsx

import React, { useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { getSpotifyLoginURL } from '../services/spotifyService';
import Navbar from './Navbar'; // Import Navbar
import SpotifyLogoWithText from '../assets/spotify-logo-green.png'; // Import full Spotify logo

const LandingPage = () => {
  const [showWarning, setShowWarning] = useState(true);

  // Handle login
  const handleLogin = async () => {
    try {
      const url = await getSpotifyLoginURL();
      window.location.href = url;
    } catch (error) {
      console.error('Error generating Spotify login URL:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  };

  // Function to close the warning
  const closeWarning = () => {
    setShowWarning(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black relative">
      {showWarning && (
        <div className="bg-yellow-400 text-black text-sm sm:text-base p-2 fixed top-4 left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg z-50 w-11/12 max-w-md flex justify-between items-center">
          <p>
            This app is in development mode. If you'd like to be a tester, message me your email via Instagram: 
            <a href="https://www.instagram.com/ejagojo" className="font-bold underline ml-1">
              @ejagojo
            </a>
          </p>
          <button
            onClick={closeWarning}
            className="text-black font-bold text-lg ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <Navbar /> {/* Add Navbar */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-xl p-6">
          {/* Title with Typewriter Effect */}
          <h1 className="text-5xl font-bold text-white mb-4">
            <Typewriter
              words={['Welcome to Polaroid Me', 'Have Fun :)']}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h1>

          {/* Description */}
          <p className="text-lg text-white mb-8">
            Playlist Polaroid is a tool that turns your top tracks and artists into personalized Polaroid snapshots, letting you style and share your music taste in a unique, fun way.
          </p>

          {/* Divider */}
          <hr className="border-t border-purple-300 w-1/2 mx-auto my-8" />

          {/* Login Button with Spotify Logo */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center mx-auto text-white bg-black border-2 border-[#fff8ff] rounded-md px-6 py-3 hover:bg-[#fff8ff] hover:text-black transition-all duration-200"
          >
            <img
              src={SpotifyLogoWithText}
              alt="Spotify Logo"
              className="w-6 h-6 mr-2"
            />
            <span>Login with Spotify</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
