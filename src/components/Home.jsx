// /src/components/Home.jsx

import React, { useEffect, useState } from 'react';
import {
  fetchSpotifyUserProfile,
  fetchUserTopTracks,
  fetchUserPlaylists,
} from '../services/spotifyService';
import Loader from './Loader';
import PolaroidCollage from './PolaroidCollage';

const Home = ({ token }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('medium_term'); // Time range state
  const [tracksLoading, setTracksLoading] = useState(false); // Loading state for tracks
  const [showCollage, setShowCollage] = useState(false); // Controls the display of the collage

  useEffect(() => {
    // Fetch user profile and playlists once
    const fetchInitialData = async () => {
      try {
        const [profile, playlistsData] = await Promise.all([
          fetchSpotifyUserProfile(token),
          fetchUserPlaylists(token),
        ]);

        setUserProfile(profile);
        setPlaylists(playlistsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
        localStorage.clear(); // Clear tokens if an error occurs
        window.location.href = '/'; // Redirect to login page
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  useEffect(() => {
    // Fetch top tracks whenever timeRange changes
    const fetchTracks = async () => {
      setTracksLoading(true);
      setShowCollage(false); // Hide collage when time range changes
      try {
        const tracks = await fetchUserTopTracks(token, timeRange);
        setTopTracks(tracks.items);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      } finally {
        setTracksLoading(false);
      }
    };

    fetchTracks();
  }, [token, timeRange]);

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
    <div className="min-h-screen p-4 bg-black text-white">
      {/* User Profile Section */}
      {userProfile && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {userProfile.display_name}!
          </h1>
          <p className="text-lg">Your Spotify Data Dashboard</p>
        </div>
      )}

      {/* Time Range Buttons */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Select Time Range:</h2>
        <div className="flex flex-wrap space-x-2">
          <button
            onClick={() => handleTimeRangeChange('short_term')}
            className={`px-4 py-2 mb-2 rounded-md ${
              timeRange === 'short_term' ? 'bg-white text-black' : 'bg-gray-800 text-white'
            } hover:bg-white hover:text-black transition`}
          >
            Past Month
          </button>
          <button
            onClick={() => handleTimeRangeChange('medium_term')}
            className={`px-4 py-2 mb-2 rounded-md ${
              timeRange === 'medium_term' ? 'bg-white text-black' : 'bg-gray-800 text-white'
            } hover:bg-white hover:text-black transition`}
          >
            Past 6 Months
          </button>
          <button
            onClick={() => handleTimeRangeChange('long_term')}
            className={`px-4 py-2 mb-2 rounded-md ${
              timeRange === 'long_term' ? 'bg-white text-black' : 'bg-gray-800 text-white'
            } hover:bg-white hover:text-black transition`}
          >
            All Time
          </button>
        </div>

        {/* Generate Collage Button */}
        <div className="mt-4">
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
        />
      )}

      {/* Top Tracks Section */}
      {tracksLoading ? (
        <Loader />
      ) : topTracks.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Your Top Tracks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topTracks.map((track) => (
              <div key={track.id} className="bg-gray-800 p-4 rounded">
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="rounded mb-2"
                />
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm">{track.artists[0]?.name}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="bg-gray-800 p-4 rounded">
                <img
                  src={playlist.images[0]?.url}
                  alt={playlist.name}
                  className="rounded mb-2"
                />
                <p className="font-semibold">{playlist.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
