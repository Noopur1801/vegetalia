import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DriverSideNav from '../components/DriverSideNav';

export default function DriverLayout() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

   useEffect(() => {
      const toggleMenu = () => setIsSidebarOpen(prev => !prev);
      window.addEventListener('toggleSidebar', toggleMenu);
      return () => window.removeEventListener('toggleSidebar', toggleMenu);
   }, []);

   return (
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb' }}>

         <DriverSideNav isOpen={isSidebarOpen} />

         <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <Outlet />
         </div>

      </div>
   );
}