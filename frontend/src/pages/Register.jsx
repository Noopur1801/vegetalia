import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reusing the beautiful styling from the login page

export default function Register() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [role, setRole] = useState('buyer'); // Default role
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const navigate = useNavigate();

   const handleRegister = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      try {
         await axios.post('http://localhost:5000/api/auth/register', {
            email,
            password,
            role
         });

         setSuccess('Account created successfully! Redirecting...');
         setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
         setError(err.response?.data?.message || 'Registration failed.');
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

            <h1 className="login-title">Create an Account</h1>
            <p className="login-subtitle">Join Vegetillya today.</p>

            {error && <div className="error-message">{error}</div>}
            {success && (
               <div className="success-message" role="status">
                  {success}
               </div>
            )}

            <form onSubmit={handleRegister}>
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
                     type="password"
                     className="login-input"
                     placeholder="Create a password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>

               <div className="form-group" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '10px 0' }}>

                     <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: role === 'buyer' ? '#3f824e' : '#4b5563', fontWeight: role === 'buyer' ? 'bold' : 'normal' }}>
                        <input
                           type="radio"
                           name="role"
                           value="buyer"
                           checked={role === 'buyer'}
                           onChange={(e) => setRole(e.target.value)}
                           style={{ accentColor: '#488c52', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        Buyer
                     </label>

                     <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: role === 'vendor' ? '#3f824e' : '#4b5563', fontWeight: role === 'vendor' ? 'bold' : 'normal' }}>
                        <input
                           type="radio"
                           name="role"
                           value="vendor"
                           checked={role === 'vendor'}
                           onChange={(e) => setRole(e.target.value)}
                           style={{ accentColor: '#488c52', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        Vendor
                     </label>

                     <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: role === 'driver' ? '#3f824e' : '#4b5563', fontWeight: role === 'driver' ? 'bold' : 'normal' }}>
                        <input
                           type="radio"
                           name="role"
                           value="driver"
                           checked={role === 'driver'}
                           onChange={(e) => setRole(e.target.value)}
                           style={{ accentColor: '#488c52', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        Driver
                     </label>

                  </div>
               </div>

               <button type="submit" className="btn-primary">
                  Sign up
               </button>
            </form>

            <div className="signup-text">
               Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
            </div>
         </div>
      </div>
   );
}