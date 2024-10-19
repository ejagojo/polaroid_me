// /src/components/RequireAuth.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RequireAuth({ children }) {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    // User is not authenticated; redirect to landing page
    return <Navigate to="/" />;
  }

  // User is authenticated; render the protected component
  return children;
}

export default RequireAuth;
