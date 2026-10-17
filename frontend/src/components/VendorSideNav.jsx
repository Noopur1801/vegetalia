import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VendorSideNav({ isOpen }) {
   const location = useLocation();
   const [products, setProducts] = useState([]);
   const { token } = useContext(AuthContext);

   // Fetch products when sidebar is open
   useEffect(() => {
      const fetchSidebarProducts = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/products/all', {
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
            Manage Orders
         </p>

         <SideLink to="/vendor/orders-today" label="Orders for Today" />
         <SideLink to="/vendor/orders-tomorrow" label="For Tomorrow" />
         <SideLink to="/vendor/orders-15days" label="For After 15 Days" />

         <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#75975e', marginBottom: '12px', marginTop: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Logistics
         </p>

         <SideLink to="/vendor/delivery-report" label="Report for Delivery" />
         <SideLink to="/vendor/partners" label="Delivery Partners" />

         <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#75975e', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Inventory
         </p>
         <SideLink to="/vendor/add-product" label="Add New Product" />
         <SideLink to="/vendor/my-products" label="My Products" />


      </div>
   );
}