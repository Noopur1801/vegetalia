import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DriverSideNav({ isOpen }) {
   const location = useLocation();
   const [products, setProducts] = useState([]);
   const { token } = useContext(AuthContext);

   // Fetch the products when the sidebar opens
   useEffect(() => {
      const fetchSidebarProducts = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/products/all', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
         } catch (err) {
            console.error("Failed to fetch products for sidebar", err);
         }
      };
      if (token && isOpen) fetchSidebarProducts();
   }, [token, isOpen]);

   if (!isOpen) return null;

   // Filter the data based on availability
   const availableToday = products.filter(product => product.availability === 'today');
   const availableYesterday = products.filter(product => product.availability === 'yesterday');
   const available15Days = products.filter(product => product.availability === '15_days');

   const SideLink = ({ to, label }) => {
      const isActive = location.pathname === to;
      return (
         <Link
            to={to}
            style={{
               display: 'block',
               padding: '12px 16px',
               textDecoration: 'none',
               backgroundColor: isActive ? '#ddead1' : 'transparent',
               color: isActive ? '#4b6043' : '#374151',
               borderRadius: '8px',
               fontWeight: isActive ? 'bold' : 'normal',
               transition: 'background-color 0.2s',
               marginBottom: '4px'
            }}
         >
            {label}
         </Link>
      );
   };

   return (
      <div style={{
         width: '215px',
         backgroundColor: 'white',
         borderRight: '1px solid #c7ddb5',
         padding: '24px 16px',
         display: 'flex',
         flexDirection: 'column',
         minHeight: '100vh',
         overflowY: 'auto'
      }}>
         <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#75975e', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            My Routes
         </p>

         <SideLink to="/driver/today" label="Deliveries for today" />
         <SideLink to="/driver/ahead" label="Deliveries to take ahead" />


      </div>
   );
}