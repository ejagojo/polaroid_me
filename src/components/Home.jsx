import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  fetchSpotifyUserProfile,
  fetchUserTopTracks,
  fetchUserPlaylists,
  fetchUserTopArtists,
} from '../services/spotifyService';
import Loader from './Loader';
import PolaroidCollage from './PolaroidCollage';
import Navbar from './Navbar'; // Import Navbar

const Home = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [tracksLoading, setTracksLoading] = useState(false);
  const [showCollage, setShowCollage] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    // Fetch user profile and playlists once
    const fetchInitialData = async () => {
      try {
        const [profile, playlistsData] = await Promise.all([
          fetchSpotifyUserProfile(accessToken),
          fetchUserPlaylists(accessToken),
        ]);

        setUserProfile(profile);
        setPlaylists(playlistsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAccessToken(null); // Clear the access token from context
        sessionStorage.clear(); // Clear session storage
        window.location.href = '/'; // Redirect to login page
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    if (!accessToken) return;

    // Fetch top tracks and top artists whenever timeRange changes
    const fetchData = async () => {
      setTracksLoading(true);
      setShowCollage(false); // Hide collage when time range changes

      try {
        // Fetch top tracks
        const tracks = await fetchUserTopTracks(accessToken, timeRange);
        setTopTracks(tracks.items);

        // Fetch top artists
        const artists = await fetchUserTopArtists(accessToken, timeRange);
        setTopArtists(artists.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTracksLoading(false);
      }
    };

    fetchData();
  }, [accessToken, timeRange]);

  if (loading) {
    return <Loader />;
  }

  // Function to handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setShowCollage(false); // Hide collage when time range changes
  };

  // Function to handle collage generation
  const handleGenerateCollage = () => {
    setShowCollage(true);
  };

  // Function to get a label for the time range (used in filename)
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'short_term':
        return 'past_month';
      case 'medium_term':
        return 'past_6_months';
      case 'long_term':
        return 'all_time';
      default:
        return 'time_range';
    }
  };

  // Function to get a user-friendly time range display
  const getTimeRangeDisplay = () => {
    switch (timeRange) {
      case 'short_term':
        return 'Past Month';
      case 'medium_term':
        return 'Past 6 Months';
      case 'long_term':
        return 'All Time';
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black relative">
      <Navbar /> {/* Add Navbar */}
      
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl space-y-8">
          {/* User Profile Section */}
          {userProfile && (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {userProfile.display_name}!
              </h1>
              <p className="text-lg">Here's your music collection!</p>
            </div>
          )}

          {/* Time Range Buttons */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Select Time Range:</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleTimeRangeChange('short_term')}
                className={`px-4 py-2 rounded-md ${
                  timeRange === 'short_term' ? 'bg-white text-black' : 'bg-gray-800 text-white'
                } hover:bg-white hover:text-black transition`}
              >
                Past Month
              </button>
              <button
                onClick={() => handleTimeRangeChange('medium_term')}
                className={`px-4 py-2 rounded-md ${
                  timeRange === 'medium_term' ? 'bg-white text-black' : 'bg-gray-800 text-white'
                } hover:bg-white hover:text-black transition`}
              >
                Past 6 Months
              </button>
              <button
                onClick={() => handleTimeRangeChange('long_term')}
                className={`px-4 py-2 rounded-md ${
                  timeRange === 'long_term' ? 'bg-white text-black' : 'bg-gray-800 text-white'
                } hover:bg-white hover:text-black transition`}
              >
                All Time
              </button>
            </div>

            {/* Generate Collage Button */}
            <div className="mt-6">
              <button
                onClick={handleGenerateCollage}
                className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition"
              >
                Generate Collage
              </button>
            </div>
          </div>

          {/* Polaroid Collage Section */}
          {showCollage && !tracksLoading && topTracks.length > 0 && (
            <PolaroidCollage
              tracks={topTracks}
              timeRangeLabel={getTimeRangeLabel()}
              userName={userProfile.display_name}
              timeRangeDisplay={getTimeRangeDisplay()}
              topArtists={topArtists}
            />
          )}

          {/* Top Tracks Section */}
          {tracksLoading ? (
            <Loader />
          ) : topTracks.length > 0 ? (
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Your Top Tracks - {getTimeRangeDisplay()}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="bg-white p-2 shadow-lg rounded-lg flex flex-col items-center justify-between"
                    style={{ width: '100%', aspectRatio: '3/4', maxWidth: "320px", position: "relative"}}
                  >
                    <div
                      className="relative flex justify-center items-center mb-2"
                      style={{ width: '100%', height: '70%', overflow: "hidden" }}
                    >
                      <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        className="w-full h-full"
                        style={{
                          objectFit: "contain",
                          // border: "2px solid #ccc",
                          borderRadius: "0px"
                        }}
                      />
                    </div>
                    <div className="w-full text-center py-2 px-2">
                      <p
                        className="font-semibold text-sm text-black leading-tight"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {track.name}
                      </p>
                      <p
                        className="text-xs text-gray-500 leading-tight"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {track.artists[0]?.name}
                      </p>
                    </div>
                    <div
                      className="absolute bottom-2 right-2 text-black font-bold text-xs"
                      style={{ zIndex: 10 }}
                    >
                      #{index + 1}
                    </div>
                    <div
                      className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none"
                      style={{ boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No top tracks available.</p>
          )}

          {/* Playlists Section */}
          {playlists.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-4">Your Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 relative flex flex-col items-center"
                    style={{ width: '100%', aspectRatio: '3/4' }}
                  >
                    <div
                      className="relative bg-white rounded overflow-hidden flex-shrink-0 mb-2"
                      style={{ width: '100%', height: '70%' }}
                    >
                      <img
                        src={playlist.images[0]?.url}
                        alt={playlist.name}
                        className="w-full h-full object-cover border-2 border-gray-300"
                      />
                    </div>
                    <div className="w-full text-center py-2 px-2">
                      <p
                        className="font-semibold text-sm text-black leading-tight"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {playlist.name}
                      </p>
                    </div>
                    <div
                      className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none"
                      style={{ boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
