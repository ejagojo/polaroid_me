import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import SpotifyFullLogo from "../assets/spotify-logo-full.png"; // Import the full Spotify logo

const PolaroidCollage = ({
  tracks,
  timeRangeLabel,
  userName,
  timeRangeDisplay,
  topArtists,
}) => {
  const collageRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [gradientBackground, setGradientBackground] = useState("");

  // Function to generate a gradient with three visible layers
  const generateRandomGradient = () => {
    const colors = [
      "#FF5733", // Bright orange
      "#33FF57", // Bright green
      "#3357FF", // Bright blue
      "#FF33A1", // Vibrant pink
      "#A133FF", // Deep purple
      "#33FFF6", // Aqua blue
      "#FFC733", // Bright yellow
    ];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    const color3 = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(135deg, ${color1} 25%, ${color2} 50%, ${color3} 75%)`;
  };

  // Set a random gradient background when the component mounts
  useEffect(() => {
    setGradientBackground(generateRandomGradient());
  }, []);

  /**
   * Handles the download of the collage image.
   * Uses html2canvas to capture the collage at the exact size of the preview.
   */
  const handleDownload = async () => {
    if (collageRef.current) {
      try {
        setIsDownloading(true);

        // Capture the exact size of the collage preview
        const canvas = await html2canvas(collageRef.current, {
          useCORS: true,
          scale: 2, // Slightly increase scale for sharper rendering
          scrollY: -window.scrollY,
          width: collageRef.current.offsetWidth,
          height: collageRef.current.offsetHeight,
        });

        // Convert the canvas to Blob and use FileSaver to trigger download
        canvas.toBlob((blob) => {
          saveAs(blob, `polaroid_collage_${timeRangeLabel}.png`);
        });
      } catch (error) {
        console.error("Error generating image:", error);
        alert("An error occurred while generating the image.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="mb-8">
      {/* Collage Container */}
      <div className="relative w-full flex justify-center mb-4">
        <div
          ref={collageRef}
          className="relative border-4 border-gray-800 rounded-lg overflow-hidden"
          style={{
            width: "100vw",
            height: "177.78vw", // Aspect ratio for iPhone simulation (16:9)
            maxWidth: "360px",
            maxHeight: "640px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px",
            boxSizing: "border-box",
            backgroundImage: gradientBackground, // Apply stronger gradient
          }}
        >
          {/* Spotify Logo Above the Title */}
          <div className="w-full flex items-center justify-center mb-2 z-10">
            <img
              src={SpotifyFullLogo}
              alt="Spotify Logo"
              className="h-6"
              style={{ height: "24px" }}
            />
          </div>
          {/* Background Enhancement */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 opacity-10 pointer-events-none"
            aria-hidden="true"
          ></div>

          {/* Collage Title */}
          <div className="w-full text-center mb-2 z-10">
            <h2 className="text-l font-bold text-black">
              Top Tracks - {userName} - {timeRangeDisplay}
            </h2>
          </div>

          {/* Decorative Divider */}
          <div className="w-2/3 border-b-2 border-gray-300 my-2 z-10"></div>

          {/* User Statistics */}
          <div className="w-full text-center mb-4 z-10">
            <p className="text-xs text-black">
              <strong>Favorite Artist:</strong>{" "}
              {topArtists && topArtists.length > 0
                ? topArtists[0].name
                : "Not enough data"}
            </p>
          </div>

          {/* Polaroid Frames Container */}
          <div
            className="w-full flex-grow flex flex-wrap justify-center items-start z-10 gap-3"
            style={{ paddingBottom: "40px" }}
          >
            {tracks.slice(0, 10).map((track, index) => {
              const rotation = Math.floor(Math.random() * 10) - 5;
              return (
                <div
                  key={track.id}
                  className="relative flex-shrink-0 shadow-lg rounded-lg transition-all duration-300"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: "100%", // Adjust to fill space in a responsive grid
                    aspectRatio: "3 / 4", // Slightly taller for Polaroid effect
                    maxWidth: "120px", // Ensure Polaroids stay within desired size
                    position: "relative",
                  }}
                >
                  {/* Polaroid Frame */}
                  <div
                    className="bg-white p-2 shadow-lg rounded-lg flex flex-col items-center justify-between"
                    style={{
                      height: "100%",
                      position: "relative",
                      width: "120px", // Ensuring a consistent width for all Polaroids
                      aspectRatio: "3 / 4", // Maintain the Polaroid aspect ratio
                    }}
                  >
                    {/* Album Art */}
                    <div
                      className="relative flex justify-center items-center mb-2"
                      style={{
                        width: "100%",
                        height: "70%", // Album art takes up 75% of the Polaroid height
                        overflow: "hidden", // Prevent overflow of the image
                      }}
                    >
                      <img
                        src={track.album.images[0]?.url}
                        alt={`${track.name} by ${track.artists[0]?.name}`}
                        className="w-full h-full"
                        style={{
                          objectFit: "contain", // Ensures the album art fills the container without stretching
                          borderRadius: "0px",
                        }}
                      />
                    </div>
                    {/* Caption */}
                    <div
                      className="absolute bottom-0 w-full bg-white text-center py-1 px-1"
                      style={{
                        height: "40px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "4px",
                      }}
                    >
                      <p
                        className="font-semibold text-xs text-black leading-tight"
                        style={{
                          fontSize: "8px", // Smaller font size for the track name
                        }}
                      >
                        {track.name}
                      </p>
                      <p
                        className="text-xs text-gray-500 leading-tight"
                        style={{
                          fontSize: "7px", // Smaller font size for the artist name
                        }}
                      >
                        {track.artists[0]?.name}
                      </p>
                    </div>
                    {/* Optional: Add a shadow effect to mimic Polaroid */}
                    <div
                      className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none"
                      style={{ boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
{/* 
          <div className="absolute bottom-2 w-full text-center z-10">
            <p className="text-xs text-black">polaroid-me.vercel.app/</p>
          </div> */}
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="text-white bg-black border-2 border-gray-800 rounded-md px-6 py-3 hover:bg-gray-800 hover:text-white transition-all duration-200"
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download Collage"}
        </button>
      </div>
    </div>
  );
};

export default PolaroidCollage;
