import React, { useEffect, useState } from 'react';
import {
  fetchSpotifyUserProfile,
  fetchUserTopTracks,
  fetchUserPlaylists,
} from '../services/spotifyService';
import Loader from './Loader';

const Home = ({ token }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define an async function to fetch all required data concurrently
    const fetchData = async () => {
      try {
        const [profile, tracks, playlistsData] = await Promise.all([
          fetchSpotifyUserProfile(token),
          fetchUserTopTracks(token),
          fetchUserPlaylists(token),
        ]);

        setUserProfile(profile);
        setTopTracks(tracks.items);
        setPlaylists(playlistsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
        localStorage.clear(); // Clear tokens if an error occurs
        window.location.href = '/'; // Redirect to login page
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

return (
  <div className="min-h-screen p-10 bg-black text-white">
    {/* User Profile Section */}
    {userProfile && (
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {userProfile.display_name}!
        </h1>
        <p className="text-xl">Your Spotify Data Dashboard</p>
      </div>
    )}

    {/* Top Tracks Section */}
    {topTracks.length > 0 && (
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Top Tracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
    )}

    {/* Playlists Section */}
    {playlists.length > 0 && (
      <div>
        <h2 className="text-3xl font-bold mb-4">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
