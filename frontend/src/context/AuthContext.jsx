import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [token, setToken] = useState(() => {
      const savedToken = localStorage.getItem('token');
      return (savedToken && savedToken !== 'undefined') ? savedToken : null;
   });

   const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined') {
         try {
            return JSON.parse(savedUser);
         } catch (err) {
            console.error("Failed to parse initial user:", err);
            localStorage.removeItem('user');
         }
      }
      return null;
   });

   const login = (newToken, userData) => {
      setToken(newToken);
      setUser(userData);
      if (newToken) localStorage.setItem('token', newToken);
      if (userData) localStorage.setItem('user', JSON.stringify(userData));
   };

   const logout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
   };

   return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};