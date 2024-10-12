// /src/components/LandingPage.jsx

import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { getSpotifyLoginURL } from '../services/spotifyService';
import Navbar from './Navbar'; // Import Navbar

const LandingPage = () => {
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

  return (
    <div className="flex min-h-screen flex-col bg-black">
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="text-white bg-black border-2 border-[#fff8ff] rounded-md px-6 py-3 hover:bg-[#fff8ff] hover:text-black transition-all duration-200"
          >
            Login with Spotify
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
