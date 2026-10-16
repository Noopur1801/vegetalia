import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');

   const { login } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      try {
         const response = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
         });

         // 1. Grab token and the nested user object from the backend
         const { token, user } = response.data;

         // 2. Send the ENTIRE user object to your AuthContext
         login(token, user);

         // 3. Navigate based on user.role (NOT just 'role')
         if (user.role === 'vendor') {
            navigate('/vendor/sales');
         } else if (user.role === 'buyer') {
            navigate('/buyer/marketplace');
         } else if (user.role === 'driver') {
            navigate('/driver/deliveries');
         } else if (user.role === 'admin') {
            navigate('/admin/admin-dashboard');
         }

      } catch (err) {
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

               <div className="form-group">
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
                  >
                     {/* Eye Icon SVG */}
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

               <button type="button" className="btn-google">
                  {/* Google G Logo SVG */}
                  <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
               </button>
            </form>

            <div className="signup-text">
               Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
            </div>
         </div>
      </div>
   );
}