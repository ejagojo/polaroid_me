import React, { useRef, useState, useEffect } from "react";

const PolaroidCollage = ({
  tracks,
  timeRangeLabel,
  userName,
  timeRangeDisplay,
  topArtists,
}) => {
  const collageRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitButton, setShowExitButton] = useState(true); // Control exit button visibility

  // Handle Fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
        // Show the exit button initially
        setShowExitButton(true);
        // Hide the exit button after 3 seconds
        setTimeout(() => setShowExitButton(false), 3000);
      } else {
        setIsFullscreen(false);
      }
    };

    // Listen for fullscreen change
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle Fullscreen
  const toggleFullScreen = () => {
    if (!isFullscreen) {
      if (collageRef.current.requestFullscreen) {
        collageRef.current.requestFullscreen();
      } else if (collageRef.current.webkitRequestFullscreen) {
        collageRef.current.webkitRequestFullscreen(); // Safari
      } else if (collageRef.current.msRequestFullscreen) {
        collageRef.current.msRequestFullscreen(); // IE11
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE11
      }
    }
  };

  // Handle user tapping anywhere on the collage to show/hide the exit button
  const handleUserTap = () => {
    if (isFullscreen) {
      setShowExitButton(true); // Show the button again when the user taps
      // Hide it again after 3 seconds
      setTimeout(() => setShowExitButton(false), 3000);
    }
  };

  return (
    <div className="mb-8">
      {/* Collage Container */}
      <div className="relative w-full flex justify-center mb-4" onClick={handleUserTap}>
        <div
          ref={collageRef}
          className={`relative bg-white border-4 border-gray-800 rounded-lg overflow-hidden ${
            isFullscreen ? "fullscreen-mode" : ""
          }`}
          style={{
            width: isFullscreen ? "100vw" : "100%",
            height: isFullscreen ? "100vh" : "177.78vw", // Mobile-friendly aspect ratio
            maxWidth: "360px",
            maxHeight: "640px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          {/* Background Enhancement */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 opacity-10 pointer-events-none"
            aria-hidden="true"
          ></div>

          {/* Collage Title */}
          <div className="w-full text-center mb-2 z-10">
            <h2 className="text-xl font-bold text-black">
              Top 10 - {userName} - {timeRangeDisplay}
            </h2>
          </div>

          {/* Decorative Divider */}
          <div className="w-2/3 border-b-2 border-gray-300 my-2 z-10"></div>

          {/* User Statistics */}
          <div className="w-full text-center mb-4 z-10">
            <p className="text-sm text-black">
              <strong>Favorite Artist:</strong>{" "}
              {topArtists && topArtists.length > 0
                ? topArtists[0].name
                : "Not enough data"}
            </p>
            <p className="text-sm text-black">
              <strong>Top Genres:</strong>{" "}
              {topArtists && topArtists.length > 0
                ? topArtists
                    .flatMap((artist) => artist.genres)
                    .slice(0, 3)
                    .join(", ") || "N/A"
                : "Not enough data"}
            </p>
          </div>

          {/* Polaroid Frames Container */}
          <div
            className="w-full flex-grow flex flex-wrap justify-center items-start z-10"
            style={{ paddingBottom: "40px" }}
          >
            {tracks.slice(0, 10).map((track) => {
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
                    style={{ height: "150px" }}
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
                      className="p-1 download-font-size"
                      style={{
                        height: "40px",
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

          {/* Exit Fullscreen Button with Auto-Hide */}
          {isFullscreen && showExitButton && (
            <button
              onClick={toggleFullScreen}
              className="absolute top-2 right-2 z-20 bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Exit Full Screen
            </button>
          )}
        </div>
      </div>

      {/* Full-Screen Button */}
      {!isFullscreen && (
        <div className="flex justify-center">
          <button
            onClick={toggleFullScreen}
            className="text-white bg-black border-2 border-gray-800 rounded-md px-6 py-3 hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            View Full Screen
          </button>
        </div>
      )}
    </div>
  );
};

export default PolaroidCollage;
