// /src/components/Contact.jsx

import React from 'react';
import Navbar from './Navbar';

const Contact = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg mb-4">
          We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg mb-4">
          - Email: <a href="mailto:support@polaroidme.com" className="text-blue-400 underline">agojo.eljohn@gmail.com</a>
          <br />
          - Instagram: <a href="https://instagram.com/polaroidme" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">@ejagojo</a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
