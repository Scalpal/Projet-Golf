import React, { useContext } from 'react';
import { LoginContext } from '../Helper/LoginContext';
import { Navigate , useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {

  const { isLoggedIn } = useContext(LoginContext);
  const location = useLocation(); 

  return isLoggedIn ? children : <Navigate to="/dashboard" state={{from: location}}  />

}

export default ProtectedRoute;