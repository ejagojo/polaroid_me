// spotifyService.js
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectURL = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-top-read',
  'user-library-read',
  'user-follow-read',
  'user-read-recently-played',
].join(' '); // Use spaces between scopes

// console.log('Client ID:', clientId);
// console.log('Redirect URI:', redirectURL);

// Helper function to generate a random string with allowed characters
const generateRandomString = (length) => {
  const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => allowedChars.charAt(byte % allowedChars.length)).join('');
};

// Base64 URL-encode an ArrayBuffer
const base64URLEncode = (arrayBuffer) => {
  let base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Generate code challenge from code verifier
const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(digest);
};

// Generate code_verifier and code_challenge
export const getSpotifyLoginURL = async () => {
  const codeVerifier = generateRandomString(128); // Length between 43 and 128
  const codeChallenge = await generateCodeChallenge(codeVerifier);


  // console.log('Code Verifier:', codeVerifier);
  // console.log('Code Challenge:', codeChallenge);

  // Store code_verifier in localStorage
  localStorage.setItem('pkce_code_verifier', codeVerifier);




  // Construct the Spotify login URL
  const url = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(
    clientId
  )}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectURL
  )}&scope=${encodeURIComponent(
    scopes
  )}&code_challenge_method=S256&code_challenge=${encodeURIComponent(codeChallenge)}`;

  console.log('Redirecting to Spotify Login URL:', url);

  return url;
};

// Exchange authorization code for an access token using PKCE
export const exchangeCodeForToken = async (code) => {
  // Retrieve code_verifier from localStorage
  const codeVerifier = localStorage.getItem('pkce_code_verifier');

  // console.log('Retrieved codeVerifier:', codeVerifier);
  // console.log('Exchanging code:', code);
  // console.log('Using codeVerifier:', codeVerifier)

  if (!codeVerifier) {
    console.error('Code verifier not found!');
    throw new Error('Code verifier not found in sessionStorage');
  }

  console.log("You guys have a nice day!")


  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectURL,
      code_verifier: codeVerifier,
    }).toString(),
  });

  console.log('Token exchange response status:', response.status);
  if (response.ok) {
    const data = await response.json();
    // Save the access and refresh tokens in localStorage
    // console.log('Access token data:', data);
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    localStorage.setItem('tokenExpiration', Date.now() + data.expires_in * 1000);
    // Clear the code_verifier from storage
    localStorage.removeItem('pkce_code_verifier');
    return data;
  } else {
    const errorData = await response.json();
    console.error('Token Exchange Error:', errorData);
    throw new Error(`Failed to retrieve access token: ${errorData.error_description}`);
  }
};

// The rest of your functions (refreshToken, getAccessToken, fetchSpotifyUserProfile, etc.) remain the same.


// Refresh access token using the refresh token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) throw new Error('No refresh token available');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('tokenExpiration', Date.now() + data.expires_in * 1000);
    return data.access_token;
  } else {
    throw new Error('Failed to refresh access token');
  }
};

// Helper function to get and refresh token if needed
export const getAccessToken = async () => {
  let token = localStorage.getItem('accessToken');
  const expiration = localStorage.getItem('tokenExpiration');

  if (!token || Date.now() > expiration) {
    // Token is expired or missing, refresh it
    token = await refreshToken();
  }

  return token;
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
    const errorData = await response.json();
    console.error('Failed to fetch user profile:', errorData);
    throw new Error(`Failed to fetch user profile: ${errorData.error.message}`);
  }
};

// Fetch the user's top tracks
export const fetchUserTopTracks = async (accessToken, timeRange = 'medium_term') => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch top tracks');
  }
};

// Fetch the user's playlists
export const fetchUserPlaylists = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
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

export const fetchUserTopArtists = async (token) => {
  let timeRanges = ['short_term', 'medium_term', 'long_term'];
  for (let range of timeRanges) {
    console.log(`Fetching top artists for time range: ${range}`);
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(`Received top artists for ${range}:`, data.items);
      if (data.items && data.items.length > 0) {
        return data; // Return as soon as we get data
      }
    } else {
      console.error(`Failed to fetch top artists for ${range}:`, await response.json());
    }
  }
  throw new Error('No top artists data available');
};


export const fetchUserRecentlyPlayed = async (token) => {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/recently-played?limit=10',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch recently played tracks');
  }
  return response.json();
};