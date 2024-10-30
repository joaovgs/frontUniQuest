import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrganizerRoute: React.FC = () => {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn && role === 1) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default OrganizerRoute;
