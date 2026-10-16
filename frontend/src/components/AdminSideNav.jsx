import { Link, useLocation } from 'react-router-dom';

export default function AdminSideNav({ isOpen }) {
   const location = useLocation();

   if (!isOpen) return null;

   const SideLink = ({ to, label, icon }) => {
      const isActive = location.pathname === to;
      return (
         <Link
            to={to}
            style={{
               display: 'flex',
               alignItems: 'center',
               gap: '12px',
               padding: '12px 16px',
               textDecoration: 'none',
               backgroundColor: isActive ? '#ddead1' : 'transparent',
               color: isActive ? '#4b6043' : '#6b7280',
               borderRadius: '8px',
               fontWeight: isActive ? 'bold' : 'normal',
               transition: 'background-color 0.2s',
               marginBottom: '4px'
            }}
         >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            {label}
         </Link>
      );
   };

   return (
      <div style={{
         width: '240px',
         backgroundColor: 'white',
         borderRight: '1px solid #c7ddb5',
         padding: '24px 16px',
         display: 'flex',
         flexDirection: 'column',
         minHeight: '100vh'
      }}>
         <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px' }}>
            Menu
         </p>

         <SideLink to="/admin-dashboard" label="Dashboard" icon="🏠" />
         <SideLink to="/admin/buyers" label="Buyers" icon="👥" />
         <SideLink to="/admin/vendors" label="Vendors" icon="🏪" />
         <SideLink to="/admin/drivers" label="Drivers" icon="🛵" />
         <SideLink to="/admin/orders" label="All Orders" icon="📦" />
         <SideLink to="/admin/analytics" label="Analytics" icon="📈" />
         <SideLink to="/admin/settings" label="Settings" icon="⚙️" />
      </div>
   );
}