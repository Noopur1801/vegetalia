import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
   const { token, user } = useContext(AuthContext);

   // 1. If there is no token, kick them back to the login page
   if (!token) {
      return <Navigate to="/login" replace />;
   }

   // 2. If token exists but user state is still hydrating, show a quick loader instead of crashing
   if (!user) {
      return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
   }

   // 3. If their role doesn't match the required role for the page, reroute them
   if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={`/${user.role}-dashboard`} replace />;
   }

   // 4. If they pass all checks, render the requested page
   return <Outlet />;
}