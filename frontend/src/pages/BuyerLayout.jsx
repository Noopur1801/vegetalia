import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideNav from '../components/Sidebar.jsx';

export default function BuyerLayout() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

   // Listens for the hamburger click from the global Navbar
   useEffect(() => {
      const toggleMenu = () => setIsSidebarOpen(prev => !prev);
      window.addEventListener('toggleSidebar', toggleMenu);

      // Cleanup the listener when the user leaves the buyer dashboard
      return () => window.removeEventListener('toggleSidebar', toggleMenu);
   }, []);

   return (
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb' }}>

         {/* Passes the open/close state to the SideNav */}
         <SideNav isOpen={isSidebarOpen} />

         {/* DYNAMIC MAIN CONTENT */}
         <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <Outlet />
         </div>

      </div>
   );
}