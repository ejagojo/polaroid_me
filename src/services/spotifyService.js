// spotifyService.js

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const redirectURL = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-top-read',
  'user-library-read',
  'user-follow-read',
].join('%20');

// Construct Spotify login URL
export const getSpotifyLoginURL = () => {
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectURL}&scope=${scopes}`;
};

// Exchange authorization code for an access token
export const exchangeCodeForToken = async (code) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectURL,
      grant_type: 'authorization_code',
    }).toString(),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Failed to retrieve access token');
  }
};

// Fetch the current user's Spotify profile
export const fetchSpotifyUserProfile = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch user profile');
  }
};

// Fetch the user's top tracks with detailed logging
export const fetchUserTopTracks = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const data = await response.json();

    // Debugging: Log the entire raw data for the first 5 tracks
    console.log("Full raw data for top 5 tracks:");

    data.items.slice(0, 5).forEach((track, index) => {
      console.log(`Raw Data for Track #${index + 1}:`, track);
      console.log('--------------------------------');
    });

    return data;
  } else {
    throw new Error('Failed to fetch top tracks');
  }
};

// Fetch the user's playlists
export const fetchUserPlaylists = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch playlists');
  }
};

// Refresh access token using the refresh token
export const refreshToken = async (refreshToken) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  if (response.ok) {
    const data = await response.json();
    return data.access_token;
  } else {
    throw new Error('Failed to refresh access token');
  }
};
