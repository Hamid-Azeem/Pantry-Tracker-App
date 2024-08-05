import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthProvider'; // Adjust the import path

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
