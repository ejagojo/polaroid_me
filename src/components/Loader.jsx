import React from 'react';
import '../App.css';  // Ensure this contains necessary styling for animation

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {/* <h2 className="loading-text">Loading your Spotify Data...</h2> */}
    </div>
  );
};

export default Loader;
