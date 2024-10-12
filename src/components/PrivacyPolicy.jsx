// /src/components/PrivacyPolicy.jsx

import React from 'react';
import Navbar from './Navbar';

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-lg mb-4">
          Your privacy is important to us. Polaroid Me uses your Spotify data to generate personalized collages of your top tracks and artists. We are committed to ensuring that your information is secure and transparent about how we use your data.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
        <p className="text-lg mb-4">
          - **Spotify Profile Information**: Your display name and profile picture.
          <br />
          - **Listening Data**: Your top tracks and artists based on the time range you select.
        </p>
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
        <p className="text-lg mb-4">
          We use your data solely to generate the Polaroid collage. We do not store, share, or sell your personal information to any third parties. All data processing occurs on your device.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Revoking Access</h2>
        <p className="text-lg mb-4">
          You can revoke Polaroid Me's access to your Spotify account at any time by visiting your Spotify account's app settings and removing access for Polaroid Me.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-lg">
          If you have any questions or concerns about our privacy practices, please feel free to <a href="/contact" className="text-blue-400 underline">contact us</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
