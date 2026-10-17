import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminBuyers() {
   const [buyers, setBuyers] = useState([]);
   const [loading, setLoading] = useState(true);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchBuyers = async () => {
         try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/buyers', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setBuyers(res.data);
         } catch (err) {
            console.error("Error fetching buyers:", err);
         } finally {
            setLoading(false);
         }
      };

      if (token) fetchBuyers();
   }, [token]);

   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <h2 style={{ marginTop: 0, color: '#2b3f44', marginBottom: '24px' }}>Manage Buyers</h2>

         {loading ? (
            <p>Loading buyers...</p>
         ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                     <tr>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Name</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Email</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Joined Date</th>
                     </tr>
                  </thead>
                  <tbody>
                     {buyers.length === 0 ? (
                        <tr>
                           <td colSpan="3" style={{ padding: '16px', textAlign: 'center' }}>No buyers found.</td>
                        </tr>
                     ) : (
                        buyers.map((buyer) => (
                           <tr key={buyer._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px 16px', color: '#111827' }}>{buyer.name}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{buyer.email}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                                 {new Date(buyer.createdAt).toLocaleDateString()}
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