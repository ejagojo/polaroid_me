// /src/components/PolaroidCollage.jsx

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

/**
 * PolaroidCollage Component
 * Displays a responsive polaroid-style collage of top tracks and user statistics.
 *
 * Props:
 * - tracks: Array of track objects.
 * - timeRangeLabel: String label for the time range (used in the image filename).
 * - userName: The display name of the user.
 * - timeRangeDisplay: A user-friendly string for the time range (e.g., "Past Month").
 * - topArtists: Array of top artist objects.
 * - totalMinutes: Number representing total minutes listened.
 */
const PolaroidCollage = ({
  tracks,
  timeRangeLabel,
  userName,
  timeRangeDisplay,
  topArtists,
  // Removed totalMinutes as we'll address it in Issue 2
}) => {
  const collageRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Handles the download of the collage image.
   * Uses html2canvas to capture the collage and triggers a download.
   */
  const handleDownload = async () => {
    if (collageRef.current) {
      try {
        setIsDownloading(true);

        // Scroll to the collage to ensure it's in view
        collageRef.current.scrollIntoView({
          behavior: "auto",
          block: "center",
        });

        // Capture the collage with higher resolution
        const canvas = await html2canvas(collageRef.current, {
          useCORS: true,
          scale: 2,
          scrollY: -window.scrollY,
          windowWidth: collageRef.current.scrollWidth,
          windowHeight: collageRef.current.scrollHeight,
        });

        const dataURL = canvas.toDataURL("image/png");

        // Create a link to download the image
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `polaroid_collage_${timeRangeLabel}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
          className="relative bg-white border-4 border-gray-800 rounded-lg overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "360px",
            aspectRatio: "9 / 16",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px",
          }}
        >
          {/* Background Enhancement */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 opacity-10 pointer-events-none"
            aria-hidden="true"
          ></div>

          {/* Collage Title */}
          <div className="w-full text-center mb-2 z-10">
            <h2 className="text-l font-bold text-black">
              Top 10 - {userName} - {timeRangeDisplay}
            </h2>
          </div>

          {/* Decorative Divider */}
          <div className="w-2/3 border-b-2 border-gray-300 my-2 z-10"></div>

          {/* User Statistics */}
          <div className="w-full text-center mb-4 z-10">
            {/* Removed Total Minutes Listened as per Issue 2 */}
            <p className="text-xs text-black">
              <strong>Favorite Artist:</strong> {topArtists[0]?.name || "N/A"}
            </p>
            <p className="text-xs text-black">
              <strong>Top Genres:</strong>{" "}
              {topArtists
                .flatMap((artist) => artist.genres)
                .slice(0, 3)
                .join(", ") || "N/A"}
            </p>
          </div>

          {/* Polaroid Frames Container */}
          <div
            className="w-full flex-grow flex flex-wrap justify-center items-start z-10"
            style={{ paddingBottom: "40px" }}
          >
            {tracks.slice(0, 10).map((track, index) => {
              // Random rotation between -5 and 5 degrees
              const rotation = Math.floor(Math.random() * 10) - 5;
              return (
                <div
                  key={track.id}
                  className="relative m-1"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: "45%",
                    maxWidth: "100px",
                  }}
                >
                  {/* Polaroid Frame */}
                  <div
                    className="bg-white shadow-md rounded-sm overflow-hidden flex flex-col"
                    style={{ height: "150px" }} // Fixed height for the polaroid
                  >
                    {/* Album Art */}
                    <div className="flex-grow">
                      <img
                        src={track.album.images[0]?.url}
                        alt={`${track.name} by ${track.artists[0]?.name}`}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    {/* Caption */}
                    <div
                      className="p-1"
                      style={{
                        height: "40px", // Fixed height for caption
                        overflow: "hidden",
                      }}
                    >
                      <p
                        className="text-xs font-semibold text-black leading-tight"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.name}
                      </p>
                      <p
                        className="text-xs text-gray-800 leading-tight"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.artists[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Watermark */}
          <div className="absolute bottom-2 w-full text-center z-10">
            <p className="text-xs text-black">polaroid-me.vercel.app/</p>
          </div>
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
