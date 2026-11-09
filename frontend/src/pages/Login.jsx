import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import './Login.css';

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');

   // 🔑 Forgot Password States
   const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
   const [resetEmail, setResetEmail] = useState('');

   const { login } = useContext(AuthContext);
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

         login(token, userData);

         const userRole = userData?.role;

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
         console.error("Full login error:", err);
         const serverMsg = err.response?.data?.message;
         const errorDetails = serverMsg || err.message || JSON.stringify(err);
         setError(`Login failed: ${errorDetails}`);
      }
   };

   // 🔗 Forgot Password Handler
   const handlePasswordReset = async (e) => {
      e.preventDefault();
      try {
         const API_URL = import.meta.env.VITE_API_URL || 'https://vegetation-i19h.onrender.com';
         const cleanBaseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
         const res = await axios.post(`${cleanBaseUrl}/api/auth/forgot-password`, { email: resetEmail });
         alert(res.data.message);
         setIsForgotPasswordOpen(false);
         setResetEmail('');
      } catch (err) {
         alert(err.response?.data?.message || "Failed to send reset link");
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

               <div className="form-group" style={{ position: 'relative', marginBottom: '4px' }}>
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

               {/* Forgot Password Link */}
               <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                  <span
                     onClick={() => setIsForgotPasswordOpen(true)}
                     style={{ fontSize: '13px', color: '#4b6043', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                     Forgot Password?
                  </span>
               </div>

               <button type="submit" className="btn-primary">
                  Login
               </button>
            </form>

            <div className="signup-text">
               Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
            </div>
         </div>

         {/* Forgot Password Modal Popup */}
         {isForgotPasswordOpen && (
            <div style={{
               position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
               backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}>
               <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxSizing: 'border-box' }}>
                  <h3 style={{ color: '#4b6043', marginTop: 0 }}>Reset Password</h3>
                  <p style={{ fontSize: '14px', color: '#658354' }}>Enter your registered email address. We will log the reset link to your backend terminal.</p>
                  <input
                     type="email"
                     value={resetEmail}
                     onChange={(e) => setResetEmail(e.target.value)}
                     placeholder="Enter your email"
                     style={{ width: '100%', padding: '10px', margin: '12px 0', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                     <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(false)}
                        style={{ padding: '8px 12px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                     >
                        Cancel
                     </button>
                     <button
                        type="button"
                        onClick={handlePasswordReset}
                        style={{ padding: '8px 12px', background: '#4b6043', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                     >
                        Send Link
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}