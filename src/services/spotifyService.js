const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURL = process.env.SPOTIFY_REDIRECT_URL;
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-top-read',
  'user-library-read',
  'user-follow-read',
].join('%20');


// Construct Spotify login url
export const getSpotifyLoginURL = () => {
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectURL}&scope=${scopes}`;
}

export const exchangeCodeForToken = async (code) => {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        'Authorization': `Basic ${authString}`,
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
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        return data;
    } else {
        throw new Error('Failed to retrieve access token')
    }
};

export const fetchSpotifyUserProfile = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        const profileData = await response.json();
        return profileData;
    } else {
        throw new Error('Failed to fech user profile');
    }

};

export const refreshToken = async (refreshToken) => {
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
  } else {
    throw new Error('Failed to refresh access token');
  }
};