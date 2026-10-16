import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminSideNav from '../components/AdminSideNav';

export default function AdminLayout() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

   useEffect(() => {
      const toggleMenu = () => setIsSidebarOpen(prev => !prev);
      window.addEventListener('toggleSidebar', toggleMenu);
      return () => window.removeEventListener('toggleSidebar', toggleMenu);
   }, []);

   return (
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', fontFamily: 'Inter, sans-serif', backgroundColor: '#f3f4f6' }}>
         <AdminSideNav isOpen={isSidebarOpen} />
         <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <Outlet />
         </div>
      </div>
   );
}