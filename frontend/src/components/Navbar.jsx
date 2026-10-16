import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
   const { user, logout } = useContext(AuthContext);
   const { cart } = useContext(CartContext);
   const navigate = useNavigate();

   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   if (!user) return null;

   return (
      <nav className="navbar">
         <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
            {/* The Hamburger Menu - Now shows for buyers, vendors, AND drivers */}
            {(user.role === 'buyer' || user.role === 'vendor' || user.role === 'driver' || user.role === 'admin') && (
               <span
                  onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
                  style={{ cursor: 'pointer', marginRight: '16px', fontSize: '24px', color: '#4b6043', userSelect: 'none' }}
                  title="Toggle Sidebar"
               >
                  ☰
               </span>
            )}
            🥬 Vegetillya
         </div>

         <div className="navbar-links">

            {user.role === 'vendor' && (
               <>
                  <Link to="/vendor/reviews">Reviews</Link>
                  <Link to="/vendor/sales">Sales Report</Link>
                  <Link to="/vendor-dashboard">Profile</Link>
               </>
            )}

            {user.role === 'buyer' && (
               <>
                  <Link to="/buyer/marketplace">Marketplace</Link>
                  <Link to="/buyer/orders">Track Orders</Link>
                  <Link to="/buyer-dashboard">👤 Profile</Link>
                  <Link
                     to="/buyer/cart"
                     style={{ fontWeight: 'bold', backgroundColor: '#f4fbf4', color: '#3f824e', padding: '6px 14px', borderRadius: '20px', textDecoration: 'none' }}
                  >
                     🛒 Cart ({totalItems})
                  </Link>
               </>
            )}

            {/* Updated Driver Links matching your sketch */}
            {user.role === 'driver' && (
               <>
                  <Link to="/driver/reviews">Reviews</Link>
                  <Link to="/driver-dashboard">Profile</Link>
               </>
            )}

            {user.role === 'admin' && (
               <>
                  <Link to="/admin-dashboard">Dashboard</Link>
                  <Link to="/admin/profile">Profile</Link>
                  <Link to="/admin/orders">All Orders</Link>
               </>
            )}

            <button className="navbar-logout" onClick={handleLogout}>
               Logout
            </button>

         </div>
      </nav>
   );
}