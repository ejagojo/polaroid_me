// /src/context/AuthContext.js

import React, { createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize accessToken state with the value from localStorage
  const [accessToken, setAccessTokenState] = useState(localStorage.getItem('accessToken'));

  // Function to update accessToken in both state and localStorage
  const setAccessToken = (token) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
