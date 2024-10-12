// /src/components/PolaroidCollage.jsx

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

/**
 * PolaroidCollage Component
 * Displays a responsive polaroid-style collage of top tracks and allows users to download it as an image.
 *
 * Props:
 * - tracks: Array of track objects.
 * - timeRangeLabel: String label for the time range (used in the image filename).
 * - userName: The display name of the user.
 * - timeRangeDisplay: A user-friendly string for the time range (e.g., "Past Month").
 */
const PolaroidCollage = ({ tracks, timeRangeLabel, userName, timeRangeDisplay }) => {
  const collageRef = useRef(null);

  /**
   * Handles the download of the collage image.
   * Uses html2canvas to capture the collage and triggers a download.
   */
  const handleDownload = async () => {
    if (collageRef.current) {
      try {
        // Scroll to the collage to ensure it's in view
        collageRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });

        const canvas = await html2canvas(collageRef.current, {
          useCORS: true,
          scrollY: -window.scrollY, // Adjust for scroll position
        });
        const dataURL = canvas.toDataURL('image/png');

        // Create a link to download the image
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `polaroid_collage_${timeRangeLabel}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating image:', error);
        alert('An error occurred while generating the image.');
      }
    }
  };

  return (
    <div className="mb-8">
      {/* Collage Container */}
      <div className="relative w-full flex justify-center mb-4">
        <div
          ref={collageRef}
          className="relative bg-white p-4 border-4 border-gray-800 rounded-lg shadow-lg"
          style={{
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* Background Enhancement */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 opacity-20 pointer-events-none"
            aria-hidden="true"
          ></div>

          {/* Collage Title */}
          <div className="w-full text-center mb-4">
            <h2 className="text-2xl font-bold text-black">
              Top 10 - {userName} - {timeRangeDisplay}
            </h2>
          </div>

          {/* Polaroid Frames Container */}
          <div className="w-full flex flex-wrap justify-center">
            {tracks.slice(0, 10).map((track, index) => {
              // Random rotation between -5 and 5 degrees
              const rotation = Math.floor(Math.random() * 10) - 5;
              return (
                <div
                  key={track.id}
                  className="relative m-2"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: 'calc(50% - 16px)',
                    maxWidth: '120px',
                  }}
                >
                  {/* Polaroid Frame */}
                  <div className="bg-white shadow-md rounded-sm overflow-hidden">
                    {/* Album Art */}
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      className="w-full h-auto"
                      crossOrigin="anonymous"
                    />
                    {/* Caption */}
                    <div className="p-2">
                      <p className="text-xs font-semibold">{track.name}</p>
                      <p className="text-xs text-gray-600">{track.artists[0]?.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Download Collage
        </button>
      </div>
    </div>
  );
};

export default PolaroidCollage;
