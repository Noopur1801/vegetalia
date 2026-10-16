import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminDrivers() {
   const [drivers, setDrivers] = useState([]);
   const [loading, setLoading] = useState(true);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchDrivers = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/admin/drivers', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setDrivers(res.data);
         } catch (err) {
            console.error("Error fetching drivers:", err);
         } finally {
            setLoading(false);
         }
      };

      if (token) fetchDrivers();
   }, [token]);

   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <h2 style={{ marginTop: 0, color: '#2b3f44', marginBottom: '24px' }}>Manage Drivers</h2>

         {loading ? (
            <p>Loading drivers...</p>
         ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                     <tr>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Driver Name</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Email</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Joined Date</th>
                     </tr>
                  </thead>
                  <tbody>
                     {drivers.length === 0 ? (
                        <tr>
                           <td colSpan="3" style={{ padding: '16px', textAlign: 'center' }}>No drivers found.</td>
                        </tr>
                     ) : (
                        drivers.map((driver) => (
                           <tr key={driver._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px 16px', color: '#111827' }}>{driver.name}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{driver.email}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                                 {new Date(driver.createdAt).toLocaleDateString()}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}