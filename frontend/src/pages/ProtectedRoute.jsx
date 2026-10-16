import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
   const { token, user } = useContext(AuthContext);

   // 1. If there is no token, kick them back to the login page
   if (!token) {
      return <Navigate to="/login" replace />;
   }

   // 2. If their role doesn't match the required role for the page, reroute them
   if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Send them to their own dashboard based on their actual role
      return <Navigate to={`/${user.role}-dashboard`} replace />;
   }

   // 3. If they pass both checks, render the requested page
   return <Outlet />;
}