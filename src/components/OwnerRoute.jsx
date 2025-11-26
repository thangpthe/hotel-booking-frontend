import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const OwnerRoute = ({ children }) => {
  const { owner } = useContext(AppContext);

  if (!owner) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default OwnerRoute;