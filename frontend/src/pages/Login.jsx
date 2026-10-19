import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx'; // <-- Make sure this import is here
import './Login.css';

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');

   const { login } = useContext(AuthContext); // <-- Grab login from context
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      try {
         const API_URL = import.meta.env.VITE_API_URL || 'https://vegetation-i19h.onrender.com';
         const cleanBaseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
         const loginEndpoint = `${cleanBaseUrl}/api/auth/login`;

         const response = await axios.post(loginEndpoint, {
            email,
            password
         });

         const { token, user } = response.data;
         const userData = user || { role: response.data.role, id: response.data.userId };

         // 🔑 CRITICAL: Update the AuthContext state so ProtectedRoute recognizes you are logged in!
         login(token, userData);

         const userRole = userData?.role;

         // Redirect based on role
         if (userRole === 'vendor') {
            navigate('/vendor/sales');
         } else if (userRole === 'buyer') {
            navigate('/buyer/marketplace');
         } else if (userRole === 'driver') {
            navigate('/driver/deliveries');
         } else if (userRole === 'admin') {
            navigate('/admin-dashboard');
         } else {
            navigate('/');
         }

      } catch (err) {
         console.error("Login error:", err);
         setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
   };

   return (
      <div className="login-container">
         <div className="vegetable-decorations" aria-hidden="true">
            <span className="veggie veggie-carrot">🥕</span>
            <span className="veggie veggie-tomato">🍅</span>
            <span className="veggie veggie-broccoli">🥦</span>
            <span className="veggie veggie-avocado">🥑</span>
            <span className="veggie veggie-corn">🌽</span>
            <span className="veggie veggie-leaf">🥬</span>
            <span className="veggie veggie-pepper">🫑</span>
            <span className="veggie veggie-peas">🫛</span>
         </div>
         <div className="login-card">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Please enter your details.</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
               <div className="form-group">
                  <input
                     type="email"
                     className="login-input"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                  />
               </div>

               <div className="form-group" style={{ position: 'relative' }}>
                  <input
                     type={showPassword ? "text" : "password"}
                     className="login-input"
                     placeholder="••••••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
                  <button
                     type="button"
                     className="password-toggle"
                     onClick={() => setShowPassword(!showPassword)}
                     style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {showPassword ? (
                           <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <line x1="1" y1="1" x2="23" y2="23"></line>
                           </>
                        ) : (
                           <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                           </>
                        )}
                     </svg>
                  </button>
               </div>

               <button type="submit" className="btn-primary">
                  Login
               </button>
            </form>

            <div className="signup-text">
               Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
            </div>
         </div>
      </div>
   );
}