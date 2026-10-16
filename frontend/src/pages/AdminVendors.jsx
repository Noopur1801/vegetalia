import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AdminVendors() {
   const [vendors, setVendors] = useState([]);
   const [loading, setLoading] = useState(true);
   const { token } = useContext(AuthContext);

   useEffect(() => {
      const fetchVendors = async () => {
         try {
            const res = await axios.get('http://localhost:5000/api/admin/vendors', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setVendors(res.data);
         } catch (err) {
            console.error("Error fetching vendors:", err);
         } finally {
            setLoading(false);
         }
      };

      if (token) fetchVendors();
   }, [token]);

   return (
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
         <h2 style={{ marginTop: 0, color: '#2b3f44', marginBottom: '24px' }}>Manage Vendors</h2>

         {loading ? (
            <p>Loading vendors...</p>
         ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                     <tr>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Vendor Name</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Email</th>
                        <th style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 'bold' }}>Joined Date</th>
                     </tr>
                  </thead>
                  <tbody>
                     {vendors.length === 0 ? (
                        <tr>
                           <td colSpan="3" style={{ padding: '16px', textAlign: 'center' }}>No vendors found.</td>
                        </tr>
                     ) : (
                        vendors.map((vendor) => (
                           <tr key={vendor._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px 16px', color: '#111827' }}>{vendor.name}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{vendor.email}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                                 {new Date(vendor.createdAt).toLocaleDateString()}
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