import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentAuthUser, getValidatedSessionUser } from '../services/userService';

interface UserAuthGuardProps {
  children: React.ReactNode;
}

/**
 * UserAuthGuard protects all academic workspace routes.
 * If no authenticated user session exists, it immediately redirects
 * the visitor to the Login Page (/login) with preserved return path.
 */
export const UserAuthGuard: React.FC<UserAuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => getValidatedSessionUser());

  useEffect(() => {
    const checkAuth = () => {
      setCurrentUser(getValidatedSessionUser());
    };

    window.addEventListener('neurobridge_auth_changed', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('neurobridge_auth_changed', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (!currentUser) {
    // Preserve requested destination in navigation state for post-login redirection
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
