import React from 'react';
import Navbar from './Navbar';

const About = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">About Polaroid Me</h1>
        <p className="text-lg mb-4">
          Polaroid Me website designed for users who want to see what their music taste looks like as polaroids. 
        </p>
        <p className="text-lg mb-4">
          Polaroid Me is heavily inspired by <a href="https://receiptify.herokuapp.com/" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">Receiptify</a>, a popular website that converts your top Spotify tracks into a receipt-style list. Ideas for this project of mine is creds to the creator of Receiptify.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Generate a collage of your top tracks and artists.</li>
          <li>Customize the time range for your top music (past month, 6 months, all time).</li>
          <li>Download and share your Polaroid collage with friends.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
